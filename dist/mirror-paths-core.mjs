// Angles use SVG coordinates: positive turns are clockwise.
export const mirrorCases = Object.freeze([
  { id: 'curtain', normal: -90, incidence: 30, side: -1 },
  { id: 'wide', normal: -90, incidence: 60, side: -1 },
  { id: 'opposite', normal: -90, incidence: 45, side: 1 },
  { id: 'side', normal: 0, incidence: 30, side: -1 },
  { id: 'slanted', normal: -45, incidence: 60, side: 1 },
  { id: 'return', normal: 45, incidence: 0, side: 0 },
].map(Object.freeze));
const angles = new Set(Array.from({ length: 11 }, (_, i) => (i - 5) * 15));
const validAngle = a => a === null || (Number.isFinite(a) && angles.has(a) && !Object.is(a, -0));
const zero = n => n === 0 ? 0 : n;
const caseFor = id => mirrorCases.find(c => c.id === id);
function validState(s) {
  return !!s && typeof s === 'object' && !!caseFor(s.caseId) && validAngle(s.angle) &&
    Number.isInteger(s.turn) && s.turn >= 0 && s.turn < 4 &&
    (s.previous === null || (!!s.previous && typeof s.previous === 'object' &&
      Object.keys(s.previous).length === 1 && Object.hasOwn(s.previous, 'angle') && validAngle(s.previous.angle)));
}
export function createMirror(id) {
  return caseFor(id) ? { caseId: id, angle: null, turn: 0, previous: null } : null;
}
function model(s, c) {
  const hasProposal = s.angle !== null;
  return {
    caseId: s.caseId, normalHeading: c.normal + s.turn * 90, incidence: c.incidence,
    sourceSide: c.side, angle: s.angle, turn: s.turn, referenceAngle: zero(-c.side * c.incidence),
    hasProposal, canAdd: !hasProposal, canCCW: hasProposal && s.angle > -75,
    canCW: hasProposal && s.angle < 75, canFlip: hasProposal && s.angle !== 0,
    canClear: hasProposal, canUndo: s.previous !== null,
  };
}
export function mirrorModel(s) { return validState(s) ? model(s, caseFor(s.caseId)) : null; }
export function changeMirror(s, action, value) {
  const m = mirrorModel(s);
  if (!m) return null;
  const copy = () => ({ caseId: s.caseId, angle: s.angle, turn: s.turn,
    previous: s.previous === null ? null : { angle: s.previous.angle } });
  if (action === 'rotate') return { ...copy(), turn: (s.turn + 1) % 4 };
  if (action === 'undo') return m.canUndo ? { ...copy(), angle: s.previous.angle, previous: null } : null;
  let angle;
  if (action === 'add' && m.canAdd) angle = 0;
  else if (action === 'ccw' && m.canCCW) angle = s.angle - 15;
  else if (action === 'cw' && m.canCW) angle = s.angle + 15;
  else if (action === 'flip' && m.canFlip) angle = zero(-s.angle);
  else if (action === 'clear' && m.canClear) angle = null;
  else if (action === 'aim' && value !== null && validAngle(value) && value !== s.angle) angle = value;
  else return null;
  return { ...copy(), angle, previous: { angle: s.angle } };
}
const unit = degrees => ({ x: Math.cos(degrees * Math.PI / 180), y: Math.sin(degrees * Math.PI / 180) });
const H = Object.freeze({ x: 300, y: 220 });
const point = (u, radius) => ({ x: H.x + u.x * radius, y: H.y + u.y * radius });
function geometry(m) {
  const n = unit(m.normalHeading), t = unit(m.normalHeading + 90);
  const source = unit(m.normalHeading + m.sourceSide * m.incidence);
  const reference = unit(m.normalHeading + m.referenceAngle);
  const outgoing = (u, tip) => ({ start: { ...H }, end: point(u, 150), tip: point(u, tip), direction: { ...u } });
  const corner = point(n, 18);
  return {
    hit: { ...H }, normal: n, tangent: t, normalEnd: point(n, 185),
    mirrorStart: point(t, -160), mirrorEnd: point(t, 160), lamp: point(source, 150),
    guide: m.incidence === 0 ? point(source, 150) : point(reference, 135),
    incoming: { start: point(source, 150), end: { ...H }, tip: point(source, 105),
      direction: { x: -source.x, y: -source.y } },
    reference: outgoing(reference, 125), proposal: m.angle === null ? null : outgoing(unit(m.normalHeading + m.angle), 145),
    rightAngle: [corner, { x: corner.x + 18 * t.x, y: corner.y + 18 * t.y }, point(t, 18)],
    hatches: Array.from({ length: 13 }, (_, i) => {
      const start = point(t, (i - 6) * 24);
      return { start, end: { x: start.x - 12 * n.x + 8 * t.x, y: start.y - 12 * n.y + 8 * t.y } };
    }),
  };
}
export function mirrorGeometry(s) { const m = mirrorModel(s); return m ? geometry(m) : null; }
export function aimMirror(s, x, y) {
  const m = mirrorModel(s);
  if (!m || !Number.isFinite(x) || !Number.isFinite(y)) return null;
  const dx = x - H.x, dy = y - H.y, r = Math.hypot(dx, dy);
  // Allow only floating-point roundoff at the inclusive radial endpoints.
  const epsilon = 1e-10;
  if (r < 60 - epsilon || r > 205 + epsilon) return null;
  let angle = ((Math.atan2(dy, dx) * 180 / Math.PI - m.normalHeading) % 360 + 540) % 360 - 180;
  if (angle <= -82.5 || angle >= 82.5) return null;
  const lower = Math.floor(angle / 15) * 15, upper = lower + 15;
  angle = zero(angle - lower < upper - angle - 1e-9 ? lower : upper);
  return changeMirror(s, 'aim', angle);
}
export function mirrorComparison(s) {
  const m = mirrorModel(s);
  if (!m) return null;
  const kind = m.angle === null ? 'empty' : m.angle === m.referenceAngle ? 'match' :
    m.angle !== 0 && Math.abs(m.angle) === m.incidence ? 'same-side' : 'angle';
  return { kind, angle: m.angle, incidence: m.incidence, referenceAngle: m.referenceAngle, sourceSide: m.sourceSide };
}
export function mirrorExample(frame) {
  if (!Number.isInteger(frame) || frame < 0 || frame > 4) return null;
  const s = { caseId: null, angle: frame === 3 ? 60 : null, turn: frame === 4 ? 1 : 0, previous: null };
  const m = model(s, mirrorCases[0]);
  return { ...m, geometry: geometry(m), showNormal: frame >= 1, showReference: frame >= 2, showFalse: frame === 3 };
}
