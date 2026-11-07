import assert from 'node:assert/strict';
import {chanceBags, chanceCopy, chanceLessons, chanceQuestions} from '../dist/chance-line-content.mjs';
import {createChanceLine, changeChanceLine, chanceFraction, chancePoint, chanceLineModel, chanceLineNarration} from '../dist/chance-line-core.mjs';

// These expected values are independently counted from the authored finite bags.
const expected = [
  ['none', 0, 4, 0, '0/4', '0', 'impossible'],
  ['quarter', 1, 3, 3, '1/4', '1/4', 'unlikely'],
  ['half', 2, 2, 6, '2/4', '1/2', 'even chance'],
  ['most', 3, 1, 9, '3/4', '3/4', 'likely'],
  ['all', 4, 0, 12, '4/4', '1', 'certain'],
  ['third', 2, 4, 4, '2/6', '1/3', 'unlikely'],
  ['dozen-half', 6, 6, 6, '6/12', '1/2', 'even chance'],
  ['dozen-most', 9, 3, 9, '9/12', '3/4', 'likely']
];
const initial = createChanceLine();
assert.deepEqual(initial, {
  page: 'build', bag: 1, pins: Array(8).fill(null), refs: Array(8).fill(false),
  lesson: 0, question: 0, answers: Array(4).fill(null), explanations: Array(4).fill(false)
});
assert.notEqual(createChanceLine().pins, initial.pins);
const frozen = Object.freeze({...initial, pins: Object.freeze(initial.pins), refs: Object.freeze(initial.refs), answers: Object.freeze(initial.answers), explanations: Object.freeze(initial.explanations)});
for (const [index, [id, sun, moon, point, raw, label, word]] of expected.entries()) {
  let work = changeChanceLine(frozen, 'bag', index);
  assert.deepEqual(chanceBags[index], {id, sun, moon});
  assert.equal(chanceLineModel(work).own, null, 'no bag has a default proposal');
  assert.equal(chanceLineModel(work).reference, null, 'navigation never reveals the reference');
  work = changeChanceLine(work, 'reference');
  const model = chanceLineModel(work);
  assert.deepEqual(model.bag, {id, sun, moon, total: sun + moon});
  assert.deepEqual(model.reference, {index: point, raw, label, word});
  assert.equal(12 * sun, point * (sun + moon), 'each reference fits an exact twelfths position');
}
assert.deepEqual(Array.from({length: 13}, (_, i) => chancePoint(i)), [
  '0', '1/12', '2/12 = 1/6', '3/12 = 1/4', '4/12 = 1/3', '5/12',
  '6/12 = 1/2', '7/12', '8/12 = 2/3', '9/12 = 3/4', '10/12 = 5/6', '11/12', '1'
]);
for (const [n, d, result] of [[0, 6, '0'], [12, 12, '1'], [2, 6, '1/3'], [6, 12, '1/2'], [9, 12, '3/4'], [1, 4, '1/4']]) {
  assert.equal(chanceFraction(n, d), result);
}

// Reject placeholders, coercible strings and out-of-range events atomically.
for (const [action, invalid] of [
  ['bag', [-1, 8, 1.5, '1', null]], ['pin', [-1, 13, 0.5, '', '6', null, undefined]],
  ['lesson', [-1, 4, 0.5, '1', null]], ['question', [-1, 4, 0.5, '1', null]],
  ['answer', [-1, 3, 0.5, '1', null]], ['page', ['', 'other', null, 0]]
]) for (const value of invalid) assert.equal(changeChanceLine(frozen, action, value), frozen);
assert.equal(changeChanceLine(frozen, 'unknown', 0), frozen);
for (const [action, value] of [['page', 'build'], ['bag', 1], ['lesson', 0], ['question', 0], ['clear', undefined]]) {
  assert.equal(changeChanceLine(frozen, action, value), frozen, 'no-op preserves identity');
}
let work = changeChanceLine(frozen, 'pin', 12);
assert.notEqual(work, frozen);
assert.notEqual(work.pins, frozen.pins);
assert.equal(frozen.pins[1], null, 'reducer never mutates previous work');
assert.equal(work.refs, frozen.refs, 'unaffected arrays remain shared');
assert.equal(changeChanceLine(work, 'pin', 12), work);
work = changeChanceLine(work, 'reference');
assert.deepEqual(chanceLineModel(work).own, {index: 12, label: '1'});
assert.equal(chanceLineModel(work).reference.index, 3, 'reference never corrects an unexpected own pin');
work = changeChanceLine(work, 'bag', 6);
work = changeChanceLine(work, 'pin', 6);
work = changeChanceLine(work, 'reference');
assert.equal(chanceLineModel(work).own.index, chanceLineModel(work).reference.index, 'coincident pins remain separate model entries');
work = changeChanceLine(work, 'bag', 1);
assert.equal(chanceLineModel(work).own.index, 12);
assert.equal(chanceLineModel(work).reference.index, 3);
work = changeChanceLine(work, 'clear');
assert.equal(chanceLineModel(work).own, null);
assert.equal(chanceLineModel(work).reference.index, 3, 'clearing own proposal keeps reference visible');
work = changeChanceLine(work, 'reference');
assert.equal(chanceLineModel(work).reference, null);
work = changeChanceLine(work, 'bag', 6);
assert.equal(chanceLineModel(work).own.index, 6);
assert.equal(chanceLineModel(work).reference.index, 6, 'each bag retains both controls');

assert.deepEqual(chanceLessons.map(lesson => lesson.bags), [[1], [3, 6], [2, 6], [3]]);
assert.deepEqual(chanceQuestions.map(question => question.key), [0, 1, 2, 1]);
assert.deepEqual(chanceQuestions.map(question => question.choices[question.key].label), ['1/4', 'Three Sun and one Moon', 'Still 3/4', 'Sun is more likely, but Moon can appear']);
for (let index = 0; index < 4; index++) {
  work = changeChanceLine(work, 'lesson', index);
  assert.equal(chanceLineModel(work).lesson, chanceLessons[index]);
  work = changeChanceLine(work, 'question', index);
  assert.equal(chanceLineModel(work).selected, null);
  assert.equal(chanceLineModel(work).feedback, null);
  assert.equal(chanceLineModel(work).explanation, null);
  for (let choice = 0; choice < 3; choice++) {
    work = changeChanceLine(work, 'answer', choice);
    assert.equal(chanceLineModel(work).selected, choice);
    assert.equal(chanceLineModel(work).feedback, chanceQuestions[index].choices[choice].feedback);
    assert.equal(changeChanceLine(work, 'answer', choice), work);
  }
  work = changeChanceLine(work, 'explanation');
  assert.equal(chanceLineModel(work).explanation, chanceQuestions[index].explanation);
  work = changeChanceLine(work, 'answer', 0);
  assert.equal(chanceLineModel(work).explanation, chanceQuestions[index].explanation, 'answer revision does not hide exposed help');
}
work = changeChanceLine(work, 'question', 0);
assert.equal(chanceLineModel(work).selected, 0);
assert.equal(chanceLineModel(work).explanation, chanceQuestions[0].explanation);
work = changeChanceLine(work, 'explanation');
assert.equal(chanceLineModel(work).explanation, null);
assert.equal(chanceLineModel(work).selected, 0, 'hiding help does not erase answer');

// Narration includes only current visible work, with no hidden reference/help.
let spokenWork = createChanceLine();
let speech = chanceLineNarration(spokenWork);
assert.ok(speech.includes(chanceCopy.rule));
assert.ok(speech.includes(chanceCopy.lifetime));
assert.ok(speech.includes('Your pin has not been placed.'));
assert.ok(!speech.includes('Reference for Sun:'));
assert.ok(!speech.includes(chanceLessons[1].text));
assert.ok(!speech.includes(chanceQuestions[0].prompt));
spokenWork = changeChanceLine(spokenWork, 'pin', 0);
spokenWork = changeChanceLine(spokenWork, 'reference');
speech = chanceLineNarration(spokenWork);
assert.ok(speech.includes('Your pin: 0.'));
assert.ok(speech.includes('Reference for Sun: 1/4, unlikely.'));
spokenWork = changeChanceLine(spokenWork, 'page', 'learn');
spokenWork = changeChanceLine(spokenWork, 'lesson', 2);
speech = chanceLineNarration(spokenWork);
assert.ok(speech.includes(chanceLessons[2].text));
assert.ok(speech.includes('reference 2/4 = 1/2'));
assert.ok(speech.includes('reference 6/12 = 1/2'));
assert.ok(!speech.includes('Reference for Sun: 1/4'));
assert.ok(!speech.includes(chanceLessons[1].text));
spokenWork = changeChanceLine(spokenWork, 'page', 'questions');
speech = chanceLineNarration(spokenWork);
assert.ok(speech.includes(chanceQuestions[0].prompt));
for (const choice of chanceQuestions[0].choices) assert.ok(speech.includes(choice.label));
assert.ok(!speech.includes(chanceQuestions[0].explanation));
assert.ok(!speech.includes(chanceQuestions[0].choices[1].feedback));
spokenWork = changeChanceLine(spokenWork, 'answer', 1);
speech = chanceLineNarration(spokenWork);
assert.ok(speech.includes(chanceQuestions[0].choices[1].feedback));
assert.ok(!speech.includes(chanceQuestions[0].explanation));
spokenWork = changeChanceLine(spokenWork, 'explanation');
assert.ok(chanceLineNarration(spokenWork).includes(chanceQuestions[0].explanation));
spokenWork = changeChanceLine(spokenWork, 'question', 1);
speech = chanceLineNarration(spokenWork);
assert.ok(!speech.includes(chanceQuestions[0].explanation));
assert.ok(!speech.includes(chanceQuestions[0].choices[1].feedback));
assert.ok(!speech.includes(chanceLessons[2].text));
assert.ok(speech.includes(chanceCopy.lifetime));
assert.ok(speech.includes('Back to Seed Stall'));
console.log('Chance Line: finite mathematics, immutable controls, retained proposals, question help and current-page narration passed.');
