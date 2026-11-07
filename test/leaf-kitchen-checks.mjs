import assert from 'node:assert/strict';
import {createLeafKitchen, changeLeafKitchen, leafKitchenModel, leafKitchenNarration} from '../dist/leaf-kitchen-core.mjs';
import {leafKitchenCopy as copy, leafKitchenCards as cards, leafKitchenRoles as roles,
  leafKitchenReference as reference, leafKitchenTeaching as teaching,
  leafKitchenInvitations as invitations} from '../dist/leaf-kitchen-content.mjs';

const expectedRoles = {
  'carbon-dioxide': 'materials', water: 'materials', light: 'energy',
  minerals: 'nutrients', glucose: 'food', oxygen: 'gas'
};
assert.deepEqual(reference, expectedRoles);
assert.deepEqual(cards.map(card => card.id), Object.keys(expectedRoles));
assert.deepEqual(roles.map(role => role.id), ['materials', 'energy', 'nutrients', 'food', 'gas']);
assert.deepEqual(teaching.map(step => step.picture), ['materials', 'energy', 'food', 'gas', 'night']);
assert.deepEqual(invitations.map(q => q.choices.findIndex(choice => choice.outcome === 'fits') + 1), [1, 2, 3, 2]);

// Freeze the input so each valid action and getter must leave local work alone.
function freezeWork(work) {
  return Object.freeze({...work, placements: Object.freeze({...work.placements})});
}
function act(work, action, value) {
  const before = structuredClone(work), frozen = freezeWork(work);
  const next = changeLeafKitchen(frozen, action, value);
  assert.ok(next, `${action} should change local work`);
  assert.notEqual(next, frozen);
  assert.notEqual(next.placements, frozen.placements);
  assert.deepEqual(frozen, before);
  return next;
}
function noop(work, action, value) {
  assert.equal(changeLeafKitchen(freezeWork(work), action, value), null, `${action} should be a no-op`);
}
const fresh = createLeafKitchen(), another = createLeafKitchen();
assert.notEqual(fresh.placements, another.placements);
assert.deepEqual(fresh.placements, Object.fromEntries(Object.keys(expectedRoles).map(id => [id, null])));
assert.equal(fresh.page, 'build');
assert.equal(fresh.selected, null);
assert.equal(fresh.reference, false);
assert.equal(fresh.step, 0);
assert.equal(fresh.invitation, 0);
assert.equal(fresh.choice, null);
for (const [action, value] of [['page', 'build'], ['page', 'unknown'], ['select', 'unknown'], ['place', 'materials'], ['remove'], ['new-arrangement'], ['show-reference'], ['step', 1], ['question', 1], ['answer', 'choice-1'], ['unknown']]) noop(fresh, action, value);

// Unexpected placements and a half-finished board remain visible, editable drafts.
let work = act(fresh, 'select', 'glucose');
assert.equal(work.placements.glucose, null);
noop(work, 'select', 'glucose'); noop(work, 'remove'); noop(work, 'place', 'unknown');
work = act(work, 'place', 'materials');
noop(work, 'place', 'materials');
work = act(work, 'select', 'water');
work = act(work, 'place', 'materials');
let model = leafKitchenModel(freezeWork(work));
assert.equal(model.selected.id, 'water');
assert.deepEqual(model.roles[0].cards.map(card => card.id), ['water', 'glucose']);
assert.deepEqual(model.unplaced.map(card => card.id), ['carbon-dioxide', 'light', 'minerals', 'oxygen']);
assert.equal(model.reference, null);
assert.equal(model.teaching, null);
assert.equal(model.invitation, null);
assert.equal(model.feedback, null);
work = act(work, 'remove');
assert.equal(work.selected, 'water');
assert.equal(work.placements.water, null);
noop(work, 'remove');

// Manual comparison cannot silently replace even the unexpected sugar placement.
const placements = structuredClone(work.placements);
work = act(work, 'page', 'compare');
noop(work, 'select', 'water'); noop(work, 'place', 'food'); noop(work, 'remove'); noop(work, 'new-arrangement');
assert.equal(leafKitchenModel(work).reference, null);
const hiddenNarration = leafKitchenNarration(work);
for (const text of [copy.reference, copy.wordEquation, copy.wordEquationNote,
  copy.materialArrow, copy.energyArrow, copy.foodArrow, copy.gasArrow, copy.mineralsArrow, copy.diagramCaption]) {
  assert.ok(!leafKitchenNarration(fresh).includes(text), `Arrange excludes ${text}`);
  assert.ok(!hiddenNarration.includes(text), `Hidden Compare excludes ${text}`);
}
assert.ok(hiddenNarration.includes(copy.referenceHidden));
work = act(work, 'show-reference'); noop(work, 'show-reference');
model = leafKitchenModel(work);
assert.deepEqual(work.placements, placements);
assert.deepEqual(Object.fromEntries(model.reference.roles.flatMap(role => role.cards.map(card => [card.id, role.id]))), expectedRoles);
assert.equal(model.reference.wordEquation, copy.wordEquation);
assert.equal(model.reference.wordEquationNote, copy.wordEquationNote);
assert.equal(model.reference.notice, copy.referenceNotice);
assert.ok(leafKitchenNarration(work).includes(copy.wordEquation));
work = act(work, 'page', 'build');
assert.equal(leafKitchenModel(work).reference, null);
work = act(work, 'select', 'oxygen'); work = act(work, 'place', 'food');
work = act(work, 'page', 'compare');
assert.ok(leafKitchenModel(work).reference);

// Page changes preserve the independent construction; every current teaching step is open.
work = act(work, 'page', 'learn');
noop(work, 'show-reference'); noop(work, 'answer', 'choice-1');
for (const invalid of [-1, 5, 0.5, '1', NaN, undefined]) noop(work, 'step', invalid);
for (let i = 0; i < 5; i++) {
  if (i) work = act(work, 'step', i); else noop(work, 'step', i);
  model = leafKitchenModel(freezeWork(work));
  assert.equal(model.teaching.index, i);
  assert.equal(model.teaching.title, teaching[i].title);
  assert.equal(model.teaching.text, teaching[i].text);
  assert.equal(model.reference, null);
  const spoken = leafKitchenNarration(work);
  assert.ok(spoken.includes(teaching[i].caption));
  for (let j = 0; j < 5; j++) if (j !== i) assert.ok(!spoken.includes(teaching[j].text));
}
const preserved = structuredClone(work.placements);
work = act(work, 'page', 'questions');
noop(work, 'step', 0);
for (const invalid of [-1, 4, 0.5, '1', NaN, undefined]) noop(work, 'question', invalid);
noop(work, 'answer', 'unknown');
for (let i = 0; i < 4; i++) {
  if (i) work = act(work, 'question', i); else noop(work, 'question', i);
  assert.equal(work.choice, null);
  assert.equal(leafKitchenModel(work).feedback, null);
  for (const choice of invitations[i].choices) {
    work = act(work, 'answer', choice.id); noop(work, 'answer', choice.id);
    model = leafKitchenModel(freezeWork(work));
    assert.equal(model.invitation.index, i);
    assert.equal(model.invitation.choice.id, choice.id);
    assert.deepEqual(model.feedback, {outcome: choice.outcome, text: choice.feedback});
    const spoken = leafKitchenNarration(work);
    assert.ok(spoken.includes(`${copy[choice.outcome]} ${choice.feedback}`));
    for (const other of invitations[i].choices) if (other !== choice) assert.ok(!spoken.includes(other.feedback));
    for (let j = 0; j < 4; j++) if (j !== i) assert.ok(!spoken.includes(invitations[j].prompt));
  }
  work = act(work, 'question', i); // Choose another idea clears current feedback.
  assert.equal(work.choice, null);
  noop(work, 'question', i);
}
assert.deepEqual(work.placements, preserved);
// Reused choice ids always describe the current question in this pure API.
work = act(work, 'answer', 'choice-2');
assert.equal(leafKitchenModel(work).feedback.outcome, 'fits');
work = act(work, 'question', 0);
assert.equal(leafKitchenModel(work).feedback, null);
work = act(work, 'answer', 'choice-2');
assert.equal(leafKitchenModel(work).feedback.outcome, 'different');

// Reset clears only the arrangement and revealed reference, preserving current help/question.
work = act(work, 'page', 'build');
const previousQuestion = work.invitation, previousChoice = work.choice;
work = act(work, 'new-arrangement');
assert.deepEqual(work.placements, fresh.placements);
assert.equal(work.selected, null); assert.equal(work.reference, false);
assert.equal(work.step, 4);
assert.equal(work.invitation, previousQuestion); assert.equal(work.choice, previousChoice);
noop(work, 'new-arrangement');

// Narration order and scope are behavioral: no hidden pages or folded disclosures.
const suffix = `${copy.notice} ${copy.visitNote} ${copy.parentLeaveWarning}`;
for (const page of ['build', 'compare', 'learn', 'questions']) {
  const current = {...work, page}, before = structuredClone(current);
  const spoken = leafKitchenNarration(freezeWork(current));
  assert.ok(spoken.startsWith(`${copy.title} ${copy.story} ${copy[page]} ${copy[`${page}Instruction`]}`));
  assert.ok(spoken.endsWith(suffix));
  assert.ok(!spoken.includes(copy.grownup));
  assert.ok(!spoken.includes(copy.leaveWarning));
  assert.deepEqual(current, before);
}
const arrangedSpeech = leafKitchenNarration(fresh);
assert.ok(arrangedSpeech.indexOf(copy.noneSelected) < arrangedSpeech.indexOf(roles[0].label));
assert.ok(arrangedSpeech.includes(`${roles[0].label} ${copy.emptyRole}`));
assert.ok(arrangedSpeech.indexOf(roles.at(-1).label) < arrangedSpeech.indexOf(copy.unplaced));
assert.ok(arrangedSpeech.indexOf(copy.unplaced) < arrangedSpeech.indexOf(cards[0].label));
// Returned view data may be consumed without altering work or the content catalogue.
model = leafKitchenModel(fresh); model.unplaced[0].label = 'Synthetic view edit';
assert.equal(leafKitchenModel(fresh).unplaced[0].label, cards[0].label);
console.log('Leaf Kitchen: local arrangement, explicit comparison, teaching, questions and narration checks passed.');
