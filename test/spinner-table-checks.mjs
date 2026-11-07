import assert from 'node:assert/strict';
import {spinnerMarks, spinnerPresets, spinnerLessons, spinnerQuestions, spinnerCopy} from '../dist/spinner-table-content.mjs';
import {createSpinnerTable, changeSpinnerTable as change, spinnerSlotMark, spinnerSlotAngle, browserSpinnerSlot, spinnerTableModel as model, spinnerTableNarration as narration} from '../dist/spinner-table-core.mjs';

const initial = createSpinnerTable();
assert.deepEqual(initial, {page: 'design', counts: [6, 3, 3], from: 0, to: 1, runs: [], active: null, lesson: 0, question: 0, learnPanel: 'pictures', answers: [null, null, null, null], explanations: [false, false, false, false], confirmReset: false, notice: null, summaryOpen: false});
assert.notEqual(createSpinnerTable().counts, initial.counts);
assert.deepEqual(spinnerMarks, [{id: 'sun', label: 'Sun'}, {id: 'cloud', label: 'Cloud'}, {id: 'rain', label: 'Rain'}]);
assert.deepEqual(spinnerPresets.map(p => [p.label, p.counts]), [['Equal shares', [4, 4, 4]], ['Half for Sun', [6, 3, 3]], ['Mostly Sun', [10, 1, 1]]]);
// Independently enumerated reduced twelfths, including zero and certainty.
const fractions = ['0', '1/12', '2/12 = 1/6', '3/12 = 1/4', '4/12 = 1/3', '5/12', '6/12 = 1/2', '7/12', '8/12 = 2/3', '9/12 = 3/4', '10/12 = 5/6', '11/12', '1'];
const centers = [15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345];
let designs = 0;
for (let sun = 0; sun <= 12; sun++) for (let cloud = 0; cloud <= 12 - sun; cloud++) {
  designs++;
  const counts = [sun, cloud, 12 - sun - cloud];
  const work = {...initial, counts: Object.freeze(counts)};
  const expectedSlots = [...Array(sun).fill(0), ...Array(cloud).fill(1), ...Array(12 - sun - cloud).fill(2)];
  const actual = model(work).design;
  assert.deepEqual(actual.slotMarks, expectedSlots);
  assert.equal(actual.equal, sun === 4 && cloud === 4);
  let numerator = 0, denominator = 1;
  for (const [i, mark] of actual.marks.entries()) {
    assert.equal(mark.count, counts[i]);
    assert.equal(mark.chance, fractions[counts[i]]);
    const reduced = mark.chance.split(' = ').at(-1).split('/').map(Number);
    const n = reduced[0], d = reduced[1] || 1;
    assert.equal(n * 12, counts[i] * d);
    numerator = numerator * d + n * denominator;
    denominator *= d;
  }
  assert.equal(numerator, denominator, 'all three model shares sum to one');
  for (let slot = 0; slot < 12; slot++) {
    assert.equal(spinnerSlotMark(counts, slot), expectedSlots[slot]);
    assert.equal(spinnerSlotAngle(slot), centers[slot]);
  }
  for (let from = 0; from < 3; from++) for (let to = 0; to < 3; to++) {
    const selected = {...work, from, to};
    const moved = change(selected, 'move');
    if (from === to || counts[from] === 0) assert.equal(moved, selected);
    else {
      const expected = [...counts]; expected[from]--; expected[to]++;
      assert.deepEqual(moved.counts, expected);
      assert.equal(moved.runs, selected.runs);
      assert.deepEqual(selected.counts, counts);
    }
  }
}
assert.equal(designs, 91);

function entropy(values) {
  let reads = 0;
  return {source: {getRandomValues(array) { assert.ok(array instanceof Uint32Array); assert.equal(array.length, 1); array[0] = values[reads++]; return array; }}, reads: () => reads};
}
for (let slot = 0; slot < 12; slot++) assert.equal(browserSpinnerSlot(entropy([slot]).source), slot);
for (const [values, expected, reads] of [
  [[4294967291], 11, 1], [[4294967292, 4294967293, 4294967294, 4294967295, 25], 1, 5],
  [[...Array(31).fill(4294967295), 10], 10, 32], [[...Array(32).fill(4294967292), 1], null, 32]
]) {
  const test = entropy(values);
  assert.equal(browserSpinnerSlot(test.source), expected);
  assert.equal(test.reads(), reads);
}
assert.equal(browserSpinnerSlot(null), null);
assert.equal(browserSpinnerSlot({}), null);
assert.equal(browserSpinnerSlot({getRandomValues() { throw Error('synthetic source failure'); }}), null);

for (const [action, values] of [
  ['page', ['other', null]], ['from', [-1, 3, '1', 0.5]], ['to', [-1, 3, null]], ['preset', [-1, 3, '0']],
  ['active', [0, -1, 3]], ['lesson', [-1, 4, '0']], ['question', [-1, 4]], ['answer', [-1, 3]], ['learn-panel', ['other', null]], ['spin', [-1, 0, 12, '1']]
]) for (const value of values) assert.equal(change(initial, action, value), initial);
for (const [action, value] of [['page', 'design'], ['from', 0], ['to', 1], ['preset', 1], ['lesson', 0], ['question', 0], ['learn-panel', 'pictures'], ['reset-request'], ['reset-cancel'], ['reset-confirm'], ['entropy-failure'], ['unknown']]) assert.equal(change(initial, action, value), initial);

let work = change(initial, 'start');
assert.deepEqual(work.runs, [{counts: [6, 3, 3], draws: []}]);
assert.equal(model(work).active.last, null);
assert.equal(model(work).active.drawCount, 0);
assert.equal(model(work).active.canSpin, true);
const empty = work;
for (let slot = 0; slot < 12; slot++) work = change(work, 'spin', slot);
assert.deepEqual(model(work).active.tally, [6, 3, 3]);
assert.deepEqual(model(work).active.results.map(r => r.mark.label), ['Sun', 'Sun', 'Sun', 'Sun', 'Sun', 'Sun', 'Cloud', 'Cloud', 'Cloud', 'Rain', 'Rain', 'Rain']);
assert.deepEqual(model(work).active.results.map(r => [r.slice, r.angle]), centers.map((angle, i) => [i + 1, angle]));
assert.deepEqual(empty.runs[0].draws, [], 'earlier state is immutable');
const recorded = work.runs[0];
work = change(work, 'preset', 0);
assert.equal(work.runs[0], recorded);
assert.equal(model(work).active.mismatch, true);
assert.deepEqual(model(work).active.counts, [6, 3, 3]);
assert.deepEqual(model(work).active.tally, [6, 3, 3]);
work = change(work, 'start');
work = change(work, 'spin', 5);
assert.equal(model(work).active.last.mark.label, 'Cloud', 'new run uses its edited wheel');
work = change(work, 'active', 0);
work = change(work, 'spin', 5);
assert.equal(model(work).active.last.mark.label, 'Sun', 'continuing old run uses its frozen wheel');
while (model(work).active.canSpin) work = change(work, 'spin', 11);
assert.equal(work.runs[0].draws.length, 20);
assert.equal(change(work, 'spin', 0), work);
assert.equal(change(work, 'entropy-failure'), work);
work = change(work, 'start');
assert.equal(work.runs.length, 3);
assert.equal(change(work, 'start'), work);
assert.equal(work.runs[0].draws.length, 20, 'no run is evicted');
assert.deepEqual(work.runs[1].draws, [5]);
work = change(work, 'entropy-failure');
assert.equal(model(work).notice, spinnerCopy.entropy);
assert.equal(change(work, 'entropy-failure'), work);
const beforeReset = work;
work = change(work, 'reset-request');
assert.ok(model(work).confirmation.includes('these 3 runs'));
assert.equal(work.runs, beforeReset.runs);
work = change(work, 'reset-cancel');
assert.equal(work.notice, 'entropy-unavailable');
work = change(work, 'reset-request');
work = change(work, 'reset-confirm');
assert.deepEqual(work.runs, []);
assert.equal(work.active, null);
assert.deepEqual(work.counts, [4, 4, 4]);
assert.equal(work.notice, null);

const live = change(initial, 'start');
for (const [action, value] of [['spin', 3], ['start'], ['page', 'design'], ['from', 1], ['to', 2], ['move'], ['preset', 0], ['summary'], ['entropy-failure'], ['lesson', 1], ['question', 1], ['learn-panel', 'questions'], ['answer', 1], ['explanation'], ['reset-cancel']]) {
  const requested = change(live, 'reset-request');
  const changed = change(requested, action, value);
  assert.notEqual(changed, requested, action);
  assert.equal(changed.confirmReset, false, action);
  assert.equal(change(changed, 'reset-confirm'), changed, 'stale confirmation cannot clear newer work');
}
const requested = change(live, 'reset-request');
assert.equal(change(requested, 'page', 'runs'), requested, 'no-op retains open confirmation');
assert.equal(change(requested, 'spin', 12), requested, 'invalid action retains open confirmation');
const failed = change(live, 'entropy-failure');
assert.equal(change(change(failed, 'reset-request'), 'entropy-failure').confirmReset, false);
assert.equal(change(change(failed, 'reset-request'), 'spin', 0).notice, null);
const retained = change(change(change(change(live, 'answer', 2), 'explanation'), 'summary'), 'preset', 2);
const cleared = change(change(retained, 'reset-request'), 'reset-confirm');
assert.equal(cleared.answers, retained.answers);
assert.equal(cleared.explanations, retained.explanations);
assert.deepEqual(cleared.counts, [10, 1, 1]);
assert.equal(cleared.summaryOpen, true);
assert.equal(change(cleared, 'start').summaryOpen, true);
const twoRuns = change(live, 'start');
assert.equal(change(change(twoRuns, 'reset-request'), 'active', 0).confirmReset, false);
const immutableRun = Object.freeze({counts: Object.freeze([6, 3, 3]), draws: Object.freeze([0, 11])});
const immutableWork = Object.freeze({...live, counts: Object.freeze([6, 3, 3]), runs: Object.freeze([immutableRun])});
const appended = change(immutableWork, 'spin', 6);
assert.deepEqual(appended.runs[0].draws, [0, 11, 6]);
assert.equal(appended.runs[0].counts, immutableRun.counts);
assert.deepEqual(immutableRun.draws, [0, 11]);

assert.deepEqual(spinnerQuestions.map(q => q.key), [1, 0, 2, 1]);
assert.deepEqual(spinnerQuestions.map(q => q.choices[q.key].label), ['Sun has a 1/2 chance; each other mark has 1/4', '4 Sun, 4 Cloud, 4 Rain', 'A 1/2 chance', 'Rain’s next chance is 1/4']);
work = {...initial, page: 'learn', learnPanel: 'questions'};
for (let q = 0; q < 4; q++) {
  work = change(work, 'question', q);
  assert.equal(model(work).feedback, null);
  assert.equal(model(work).explanation, null);
  for (let choice = 0; choice < 3; choice++) {
    work = change(work, 'answer', choice);
    assert.equal(model(work).feedback, spinnerQuestions[q].choices[choice].feedback);
    assert.equal(change(work, 'answer', choice), work);
    const speech = narration(work);
    assert.ok(speech.includes(spinnerQuestions[q].choices[choice].feedback));
    assert.ok(!speech.includes(spinnerQuestions[q].explanation));
    assert.ok(!speech.includes(spinnerLessons[0].text));
  }
  work = change(work, 'explanation');
  work = change(work, 'answer', 0);
  assert.equal(model(work).explanation, spinnerQuestions[q].explanation);
  assert.ok(narration(work).includes(spinnerQuestions[q].explanation));
}
assert.ok(narration(initial).includes(spinnerCopy.rule));
assert.ok(!narration(initial).includes(spinnerQuestions[0].prompt));
for (let lesson = 0; lesson < 4; lesson++) {
  const speech = narration({...initial, page: 'learn', lesson});
  assert.ok(speech.includes(spinnerLessons[lesson].text));
  assert.ok(!speech.includes(spinnerQuestions[0].prompt));
  if (lesson === 2) assert.ok(speech.includes(spinnerCopy.authored));
}
work = change(change(change(live, 'spin', 11), 'preset', 0), 'start');
work = change(work, 'active', 0);
let speech = narration(work);
assert.ok(speech.includes('Screen draw 1: Rain mark. Tally: Sun 0, Cloud 0, Rain 1.'));
assert.ok(speech.includes(spinnerCopy.mismatch));
assert.ok(!speech.includes('Recorded tally:'));
speech = narration(change(work, 'summary'));
assert.ok(speech.includes('Run 1: frozen stops Sun 6, Cloud 3, Rain 3. Recorded tally: Sun 0, Cloud 0, Rain 1.'));
assert.ok(speech.includes('Run 2: frozen stops Sun 4, Cloud 4, Rain 4. Not drawn yet.'));
assert.ok(narration({...work, page: 'design'}).includes('Current design.'));
assert.ok(!narration({...work, page: 'design'}).includes('Rain mark. Tally:'));
assert.ok(narration(change(work, 'reset-request')).includes('This clears these 2 runs'));
assert.ok(!narration(work).includes('This clears'));
assert.ok(speech.includes(spinnerCopy.lifetime));
assert.ok(speech.includes('Back to Seed Stall'));
console.log('Spinner Table: 91 designs, exact shares and stops, entropy boundaries, frozen runs, finite reset lifecycle, supported questions and visible narration passed.');
