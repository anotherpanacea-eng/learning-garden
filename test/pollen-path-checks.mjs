import assert from 'node:assert/strict';
import { createPollenPath, changePollenPath as change, pollenPathModel as model, pollenPathNarration as narration } from '../dist/pollen-path-core.mjs';
import { pollenPathCopy as copy, pollenPathContacts, pollenPathInvitations, pollenPathLessons } from '../dist/pollen-path-content.mjs';

const freeze = work => {
  Object.freeze(work.body);
  work.stigmas.forEach(Object.freeze);
  Object.freeze(work.stigmas);
  Object.freeze(work.contacts);
  return Object.freeze(work);
};
const names = [0, 1, 2, 3].map(bits => [[], ['A'], ['B'], ['A', 'B']][bits]);
const label = origins => origins.length ? origins.join(' and ') : 'none';
const bits = origins => ['A', 'B'].map(origin => origins.includes(origin));
const initial = createPollenPath();
assert.deepEqual(initial, { page: 'garden', position: 'rest', body: [false, false], stigmas: [[false, false], [false, false]], contacts: [], invitation: 0, lesson: 0, confirmFresh: false });
assert.notEqual(initial.body, createPollenPath().body);

// Independently use origin-name sets, rather than the implementation's bit operations.
for (const body of names) for (const a of names) for (const b of names) {
  for (const flower of ['A', 'B']) for (const part of ['anthers', 'stigma', 'nectar']) {
    const work = freeze({ ...createPollenPath(), body: bits(body), stigmas: [bits(a), bits(b)], confirmFresh: true });
    const before = JSON.stringify(work);
    const expectedBody = new Set(body);
    const expectedStigmas = [new Set(a), new Set(b)];
    if (part === 'anthers') expectedBody.add(flower);
    if (part === 'stigma') for (const origin of body) expectedStigmas[flower === 'A' ? 0 : 1].add(origin);
    const code = `${flower.toLowerCase()}-${part}`;
    const next = change(work, 'contact', code);
    const expectedOrigins = [...expectedBody].sort();
    const expectedStigmaOrigins = expectedStigmas.map(set => [...set].sort());
    assert.deepEqual(next.body, bits(expectedOrigins));
    assert.deepEqual(next.stigmas, expectedStigmaOrigins.map(bits));
    assert.equal(next.position, code);
    assert.deepEqual(next.contacts, [code]);
    assert.equal(next.confirmFresh, false);
    assert.equal(JSON.stringify(work), before);
    const view = model(next);
    assert.equal(view.bodyCaption, `Pollen origins on the visitor: ${label(expectedOrigins)}`);
    assert.deepEqual(view.stigmaCaptions, expectedStigmaOrigins.map((origins, index) => `Origins shown on ${index ? 'B' : 'A'}'s stigma: ${label(origins)}`));
  }
}

let work = createPollenPath();
const touch = code => { work = change(work, 'contact', code); };
touch('a-stigma');
const emptyStatus = "No pollen came with this visitor. Flower A's stigma still shows no origins.";
assert.equal(model(work).status, emptyStatus);
assert.ok(narration(work).includes(emptyStatus));
touch('a-anthers');
touch('b-stigma');
const repeatedStatus = "The visitor brings pollen from A to flower B's stigma. Origins on flower B's stigma: A. The visitor keeps its origin marks.";
const repeated = change(work, 'contact', 'b-stigma');
assert.notEqual(repeated, work);
assert.equal(model(repeated).status, repeatedStatus);
assert.ok(narration(repeated).includes(repeatedStatus));
work = change(repeated, 'clean');
assert.deepEqual(work.stigmas, [[false, false], [true, false]]);
assert.equal(model(work).status, copy.cleanStatus);
touch('b-stigma');
const retainedStatus = "No pollen came with this visitor. Marks already on flower B's stigma keep their place.";
assert.equal(model(work).status, retainedStatus);
assert.ok(narration(work).includes(retainedStatus));
touch('b-anthers');
touch('a-stigma');
touch('a-anthers');
touch('b-stigma');
assert.deepEqual(work.body, [true, true]);
assert.deepEqual(work.stigmas, [[false, true], [true, true]]);
const retainedMarks = JSON.stringify([work.body, work.stigmas]);
touch('a-nectar');
touch('b-nectar');
assert.equal(JSON.stringify([work.body, work.stigmas]), retainedMarks);
assert.equal(work.contacts.length, 8);
assert.deepEqual(model(work).recent, work.contacts.map(code => code === 'clean' ? 'Clean paper visitor' : pollenPathContacts.find(contact => contact.id === code).label));
assert.equal(model(work).status, "The visitor stops at flower B's nectar. In this model it touches only the nectar stop, so the pollen marks stay the same.");

const pending = freeze(change(work, 'fresh-request'));
assert.equal(change(pending, 'fresh-request'), pending);
for (const [action, value] of [['contact', 'x'], ['page', 'x'], ['invitation', -1], ['invitation', 6], ['invitation', '1'], ['invitation', 1.5], ['lesson', 0], ['unknown']]) {
  assert.equal(change(pending, action, value), pending);
}
for (const [action, value] of [['page', 'garden'], ['invitation', pending.invitation], ['clean'], ['contact', 'a-nectar'], ['fresh-cancel']]) {
  assert.equal(change(pending, action, value).confirmFresh, false);
}
assert.equal(change(work, 'page', 'garden'), work);
assert.equal(change(work, 'invitation', work.invitation), work);
assert.equal(change(work, 'fresh-cancel'), work);
assert.equal(change(work, 'fresh-confirm'), work);
const configured = { ...pending, invitation: 5, lesson: 3 };
assert.deepEqual(change(configured, 'fresh-confirm'), { ...createPollenPath(), invitation: 5, lesson: 3 });
const freshEmpty = change(change(createPollenPath(), 'fresh-request'), 'fresh-confirm');
assert.deepEqual(freshEmpty, createPollenPath());
assert.equal(model(freshEmpty).status, copy.initialStatus);
const twiceClean = change(change(createPollenPath(), 'clean'), 'clean');
assert.deepEqual(twiceClean.contacts, ['clean', 'clean']);
assert.equal(twiceClean.position, 'rest');

const learn = freeze(change(pending, 'page', 'learn'));
assert.equal(learn.confirmFresh, false);
assert.deepEqual(learn.body, pending.body);
assert.deepEqual(learn.stigmas, pending.stigmas);
for (const [action, value] of [['contact', 'a-anthers'], ['clean'], ['invitation', 1], ['fresh-request'], ['fresh-confirm'], ['lesson', -1], ['lesson', 4], ['lesson', '1']]) assert.equal(change(learn, action, value), learn);
assert.equal(change(learn, 'lesson', learn.lesson), learn);
assert.equal(change(learn, 'page', 'learn'), learn);
assert.equal(change({ ...learn, confirmFresh: true }, 'lesson', learn.lesson).confirmFresh, false);

for (let invitation = 0; invitation < 6; invitation++) {
  const selected = change(work, 'invitation', invitation);
  assert.deepEqual(selected.body, work.body);
  assert.deepEqual(selected.stigmas, work.stigmas);
  assert.deepEqual(selected.contacts, work.contacts);
  assert.equal(model(selected).invitation, pollenPathInvitations[invitation]);
  const view = model(selected);
  const expected = [copy.title, copy.intro, copy.instruction, pollenPathInvitations[invitation].title, pollenPathInvitations[invitation].prompt, copy.anatomy, copy.caption, copy.legend, copy.limit, view.location, view.bodyCaption, ...view.stigmaCaptions, view.status, copy.recent, ...view.recent, copy.recentNote, copy.lifetime].join(' ');
  assert.equal(narration(selected), expected);
  assert.equal(narration(change(selected, 'fresh-request')), expected.replace(` ${copy.lifetime}`, ` ${copy.confirmation} ${copy.lifetime}`));
}
for (let lesson = 0; lesson < 4; lesson++) {
  const selected = change(learn, 'lesson', lesson);
  const card = pollenPathLessons[lesson];
  assert.equal(model(selected).lesson, card);
  assert.deepEqual(selected.body, learn.body);
  assert.deepEqual(selected.stigmas, learn.stigmas);
  assert.equal(narration(selected), [copy.title, copy.intro, card.title, card.text, copy.worked, card.caption, copy.lifetime].join(' '));
  assert.ok(!narration(selected).includes(model(selected).status));
  assert.ok(card.caption.length > 0);
  assert.ok(card.figure.length > 0);
}
const frozen = freeze(createPollenPath());
model(frozen).body[0] = true;
model(frozen).stigmas[0][0] = true;
assert.deepEqual(frozen, createPollenPath());
assert.equal(narration(frozen), [copy.title, copy.intro, copy.instruction, pollenPathInvitations[0].title, pollenPathInvitations[0].prompt, copy.anatomy, copy.caption, copy.legend, copy.limit, 'Paper bee: resting', 'Pollen origins on the visitor: none', "Origins shown on A's stigma: none", "Origins shown on B's stigma: none", copy.initialStatus, copy.recent, copy.emptyRecent, copy.recentNote, copy.lifetime].join(' '));
console.log('Pollen Path finite model, lifecycle, status and current-page narration checks passed.');
