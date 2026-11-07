import assert from 'node:assert/strict';
import { mirrorCases, createMirror, mirrorModel, changeMirror, mirrorGeometry, aimMirror, mirrorComparison, mirrorExample } from '../dist/mirror-paths-core.mjs';
const near = (a, b, message = '') => assert.ok(Math.abs(a - b) < 1e-8, `${message}: ${a} vs ${b}`);
const dot = (a, b) => a.x * b.x + a.y * b.y;
const minus = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const directions = Array.from({ length: 11 }, (_, i) => i * 15 - 75);
const allAngles = [null, ...directions];
const tap = (state, angle, radius = 100) => {
  // Rotate local n/t coordinates independently of the implementation's atan2.
  const phi = mirrorCases.find(c => c.id === state.caseId).normal * Math.PI / 180 + state.turn * Math.PI / 2;
  const a = angle * Math.PI / 180;
  const n = { x: Math.cos(phi), y: Math.sin(phi) }, t = { x: -n.y, y: n.x };
  return aimMirror(state, 300 + radius * (Math.cos(a) * n.x + Math.sin(a) * t.x),
    220 + radius * (Math.cos(a) * n.y + Math.sin(a) * t.y));
};
for (const c of mirrorCases) {
  assert.deepEqual(createMirror(c.id), { caseId: c.id, angle: null, turn: 0, previous: null });
  for (let turn = 0; turn < 4; turn++) for (const angle of allAngles) {
    const state = { caseId: c.id, angle, turn, previous: null };
    const frozen = structuredClone(state);
    const m = mirrorModel(state), g = mirrorGeometry(state);
    near(dot(g.normal, g.tangent), 0);
    near(Math.hypot(g.normal.x, g.normal.y), 1);
    const mirror = minus(g.mirrorEnd, g.mirrorStart);
    near(dot(mirror, g.normal), 0);
    near(distance(g.normalEnd, g.hit), 185);
    near(distance(g.lamp, g.hit), 150);
    near(dot(minus(g.rightAngle[0], g.hit), g.normal), 18);
    near(dot(minus(g.rightAngle[2], g.hit), g.tangent), 18);
    near(distance(g.rightAngle[0], g.rightAngle[1]), 18);
    near(distance(g.rightAngle[1], g.rightAngle[2]), 18);
    near(distance(g.guide, g.hit), c.incidence === 0 ? 150 : 135);
    near(distance(g.incoming.tip, g.hit), 90);
    near(distance(g.reference.tip, g.hit), 125);
    assert.ok(dot(g.incoming.direction, minus(g.hit, g.incoming.start)) > 0);
    assert.ok(dot(g.incoming.direction, g.normal) < 0);
    const d = g.incoming.direction, projection = dot(d, g.normal);
    const reflected = { x: d.x - 2 * projection * g.normal.x, y: d.y - 2 * projection * g.normal.y };
    near(g.reference.direction.x, reflected.x, 'vector reflection x');
    near(g.reference.direction.y, reflected.y, 'vector reflection y');
    near(Math.acos(Math.min(1, dot(g.reference.direction, g.normal))) * 180 / Math.PI, c.incidence);
    for (const ray of [g.incoming, g.reference, g.proposal].filter(Boolean)) {
      near(Math.hypot(ray.direction.x, ray.direction.y), 1);
      const travel = minus(ray.end, ray.start);
      assert.ok(dot(travel, ray.direction) > 0);
      near(travel.x * ray.direction.y - travel.y * ray.direction.x, 0);
      near(minus(ray.tip, ray.start).x * travel.y - minus(ray.tip, ray.start).y * travel.x, 0);
    }
    for (const hatch of g.hatches) { near(dot(minus(hatch.start, g.hit), g.normal), 0); assert.ok(dot(minus(hatch.end, g.hit), g.normal) < 0); }
    if (angle === null) assert.equal(g.proposal, null);
    else {
      near(distance(g.proposal.tip, g.hit), 145);
      assert.ok(dot(g.proposal.direction, g.normal) > 0);
      near(dot(g.proposal.direction, g.normal), Math.cos(angle * Math.PI / 180));
      near(dot(g.proposal.direction, g.tangent), Math.sin(angle * Math.PI / 180));
    }
    const comparison = mirrorComparison(state);
    const referenceFits = angle !== null && g.proposal.direction.x * reflected.x + g.proposal.direction.y * reflected.y > 1 - 1e-10;
    const expected = angle === null ? 'empty' : referenceFits ? 'match' : angle !== 0 && Math.abs(angle) === c.incidence ? 'same-side' : 'angle';
    assert.equal(comparison.kind, expected);
    assert.equal(m.hasProposal, angle !== null);
    assert.equal(m.canCCW, angle !== null && angle > -75);
    assert.equal(m.canCW, angle !== null && angle < 75);
    const rotation = changeMirror(state, 'rotate');
    assert.notEqual(rotation, state); assert.equal(rotation.angle, angle);
    let fullTurn = state;
    for (let i = 0; i < 4; i++) fullTurn = changeMirror(fullTurn, 'rotate');
    assert.deepEqual(fullTurn, state);
    const rotatedGeometry = mirrorGeometry(rotation);
    near(rotatedGeometry.lamp.x - 300, -(g.lamp.y - 220));
    near(rotatedGeometry.lamp.y - 220, g.lamp.x - 300);
    for (const action of ['add', 'ccw', 'cw', 'flip', 'clear']) {
      const allowed = { add: m.canAdd, ccw: m.canCCW, cw: m.canCW, flip: m.canFlip, clear: m.canClear }[action];
      const changed = changeMirror(state, action);
      assert.equal(changed !== null, allowed);
      if (changed) {
        const expectedAngle = { add: 0, ccw: angle - 15, cw: angle + 15, flip: angle === 0 ? 0 : -angle, clear: null }[action];
        assert.equal(changed.angle, expectedAngle); assert.equal(changed.turn, turn);
        assert.notEqual(changed, state); assert.deepEqual(changed.previous, { angle });
        assert.deepEqual(changeMirror(changed, 'undo'), state);
      }
    }
    for (const previousAngle of allAngles) {
      const withHistory = { ...state, previous: { angle: previousAngle } };
      const snapshot = structuredClone(withHistory);
      const rotated = changeMirror(withHistory, 'rotate');
      assert.deepEqual(rotated.previous, withHistory.previous); assert.notEqual(rotated.previous, withHistory.previous);
      assert.deepEqual(changeMirror(withHistory, 'undo'), { ...state, angle: previousAngle, previous: null });
      assert.equal(changeMirror(changeMirror(withHistory, 'undo'), 'undo'), null);
      const aimed = changeMirror(withHistory, 'aim', angle);
      assert.equal(aimed, null); assert.deepEqual(withHistory, snapshot);
    }
    assert.deepEqual(state, frozen);
    for (const proposal of directions) {
      const aimed = tap(state, proposal);
      assert.equal(aimed?.angle ?? null, angle === proposal ? null : proposal);
    }
    // Exact midpoint ties choose the clockwise neighbour, including negative angles.
    for (const [a, expectedAngle] of [[7.5, 15], [-7.5, 0], [22.5, 30], [-22.5, -15], [7.5 - 2e-9, 0], [7.5 - 2e-10, 15]]) {
      const aimed = tap(state, a); assert.equal(aimed?.angle ?? null, angle === expectedAngle ? null : expectedAngle);
    }
    for (const radius of [60, 205]) assert.equal(tap({ ...state, angle: null }, 15, radius)?.angle, 15);
    for (const radius of [60 - 1e-6, 205 + 1e-6]) assert.equal(tap(state, 15, radius), null);
    for (const a of [-180, -90, -82.5, 82.5, 90, 180, -82.5 - 1e-6, 82.5 + 1e-6]) assert.equal(tap(state, a), null, `reject angle ${a}`);
    for (const [a, expectedAngle] of [[-82.5 + 1e-6, -75], [82.5 - 1e-6, 75]]) assert.equal(tap({ ...state, angle: null }, a)?.angle, expectedAngle);
  }
}
const initial = createMirror('curtain');
for (const corrupt of [null, {}, { ...initial, caseId: null }, { ...initial, angle: 90 }, { ...initial, angle: -0 }, { ...initial, turn: 4 }, { ...initial, previous: {} }, { ...initial, previous: { angle: 90 } }]) {
  for (const fn of [mirrorModel, mirrorGeometry, mirrorComparison]) assert.equal(fn(corrupt), null);
  assert.equal(changeMirror(corrupt, 'add'), null); assert.equal(aimMirror(corrupt, 300, 100), null);
}
for (const value of [null, 7.5, 90, NaN, Infinity, '15']) assert.equal(changeMirror(initial, 'aim', value), null);
for (const bad of [NaN, Infinity, '100', null, undefined]) assert.equal(aimMirror(initial, bad, 100), null);
assert.equal(createMirror('unknown'), null); assert.equal(changeMirror(initial, 'unknown'), null);
for (let frame = 0; frame <= 4; frame++) {
  const e = mirrorExample(frame);
  assert.equal(e.caseId, null); assert.equal(e.showNormal, frame >= 1); assert.equal(e.showReference, frame >= 2);
  assert.equal(e.showFalse, frame === 3); assert.equal(e.angle, frame === 3 ? 60 : null);
  assert.equal(changeMirror(e, 'add'), null); assert.equal(aimMirror(e, 300, 100), null);
  const reference = e.geometry.reference.direction, incoming = e.geometry.incoming.direction, n = e.geometry.normal;
  near(reference.x, incoming.x - 2 * dot(incoming, n) * n.x);
  near(reference.y, incoming.y - 2 * dot(incoming, n) * n.y);
  if (frame === 3) { near(dot(e.geometry.proposal.direction, n), .5); assert.ok(distance(e.geometry.proposal.end, e.geometry.reference.end) > 50); }
}
const first = mirrorExample(2).geometry, last = mirrorExample(4).geometry;
near(last.lamp.x - 300, -(first.lamp.y - 220)); near(last.lamp.y - 220, first.lamp.x - 300);
for (const frame of [-1, 5, 1.5, '1', null]) assert.equal(mirrorExample(frame), null);
console.log('Mirror paths geometry, actions, aiming, history and separate examples passed.');
