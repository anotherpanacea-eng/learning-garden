import {makeWordRoomSource} from './word-room-content.mjs';

const object = x => x !== null && typeof x === 'object' && !Array.isArray(x);
const own = (x, k) => object(x) && Object.hasOwn(x, k);
const clone = x => structuredClone(x);
export const wordRoomCode = x => typeof x === 'string' && /^[a-z][a-z0-9-]{0,79}$/.test(x);
const text = (x, min, max) => typeof x === 'string' && x.length >= min && x.length <= max;
const nullableCode = x => x === null || wordRoomCode(x);
const count = (x, min, max) => object(x) && Object.keys(x).length >= min && Object.keys(x).length <= max;
const alphabet = a => Array.isArray(a) && a.length >= 1 && a.length <= 26 && new Set(a).size === a.length && a.every(x => typeof x === 'string' && /^[a-z]$/.test(x));
const page = x => ['choose', 'meet', 'build', 'read'].includes(x);

export function validWordRoomRoot(r) {
  return object(r) && r.version === 1 && object(r.source) && wordRoomCode(r.source.id) &&
    Number.isSafeInteger(r.source.revision) && r.source.revision > 0 && alphabet(r.source.alphabet) &&
    count(r.source.words, 1, 128) && count(r.source.texts, 0, 32) && object(r.drafts) &&
    nullableCode(r.selectedId) && nullableCode(r.textId) && page(r.page) && Array.isArray(r.gallery);
}
export function wordRoomWord(source, key) {
  if (!wordRoomCode(key) || !alphabet(source?.alphabet) || !own(source?.words, key)) return null;
  const w = source.words[key];
  return object(w) && w.id === key && typeof w.label === 'string' && /^[a-z]{3}$/.test(w.label) &&
    Array.isArray(w.letters) && w.letters.length === 3 && w.letters.every(x => source.alphabet?.includes(x)) &&
    w.letters.every(x => typeof x === 'string' && /^[a-z]$/.test(x)) && w.letters.join('') === w.label &&
    nullableCode(w.textId) && wordRoomCode(w.art) && text(w.meaning, 1, 500) && text(w.alt, 1, 500) &&
    text(w.guidance, 1, 1500) ? w : null;
}
export function wordRoomText(source, key) {
  if (!wordRoomCode(key) || !own(source?.texts, key)) return null;
  const t = source.texts[key];
  if (!object(t) || t.id !== key || !text(t.title, 1, 160) || !text(t.text, 1, 4000) ||
      !text(t.prompt, 1, 500) || !Array.isArray(t.tokens) || t.tokens.length < 1 || t.tokens.length > 512) return null;
  let end = 0;
  for (const token of t.tokens) {
    if (!object(token) || !text(token.text, 1, 4000) || !Number.isInteger(token.start) || !Number.isInteger(token.end) ||
        token.start < end || token.start < 0 || token.start >= token.end || token.end > t.text.length ||
        !['target', 'adult-supplied'].includes(token.role) || t.text.slice(token.start, token.end) !== token.text) return null;
    end = token.end;
  }
  return t;
}
export const validWordRoomDraft = (d, letters) => alphabet(letters) && object(d) && Array.isArray(d.slots) && d.slots.length === 3 &&
  d.slots.every(x => x === null || typeof x === 'string' && letters.includes(x)) &&
  Number.isInteger(d.place) && d.place >= 0 && d.place <= 2 && typeof d.modelShown === 'boolean' &&
  (d.point === null || Number.isInteger(d.point) && d.point >= 0 && d.point <= 3);
const freshDraft = () => ({slots: [null, null, null], place: 0, modelShown: true, point: null});
const freshRoom = () => ({version: 1, source: makeWordRoomSource(), selectedId: null, textId: null, page: 'choose', drafts: {}, gallery: []});

export function wordRoomView(book) {
  const present = own(book, 'wordRoom'), r = present ? book.wordRoom : null;
  if (present && !validWordRoomRoot(r)) return {status: 'unsupported', root: r, source: null, words: [], texts: [], gallery: [], complete: false};
  const source = present ? r.source : makeWordRoomSource();
  const words = Object.keys(source.words).map(id => ({id, word: wordRoomWord(source, id)}));
  const texts = Object.keys(source.texts).map(id => ({id, text: wordRoomText(source, id)}));
  const word = present ? wordRoomWord(source, r.selectedId) : null;
  const hasDraft = !!word && own(r.drafts, r.selectedId);
  const draft = hasDraft && validWordRoomDraft(r.drafts[r.selectedId], source.alphabet) ? r.drafts[r.selectedId] : null;
  const currentText = present ? wordRoomText(source, r.textId) : null;
  const gallery = present ? [...new Set(r.gallery.filter(id => wordRoomCode(id) && wordRoomWord(source, id)))] : [];
  const complete = words.every(x => x.word && gallery.includes(x.id));
  let effectivePage = present ? r.page : 'choose';
  if (effectivePage === 'read' && !currentText) effectivePage = 'choose';
  if (['meet', 'build'].includes(effectivePage) && !word) effectivePage = 'choose';
  if (effectivePage === 'build' && !draft) effectivePage = 'meet';
  return {status: present ? 'ready' : 'new', root: r, source, words, texts, word, draft, hasDraft,
    draftUnreadable: hasDraft && !draft, currentText, gallery, complete, page: effectivePage};
}
export function wordRoomSiblings(source, id) {
  const word = wordRoomWord(source, id);
  return word ? Object.keys(source.words).map(key => wordRoomWord(source, key)).filter(w =>
    w && w.id !== id && w.letters[0] !== word.letters[0] && w.letters.slice(1).join('') === word.letters.slice(1).join('')) : [];
}
export function wordRoomExample(source, id) {
  if (!object(source?.words)) return null;
  const preferred = id === 'fin' ? 'mat' : 'fin';
  return wordRoomWord(source, preferred) || Object.keys(source.words).filter(key => key !== id).map(key => wordRoomWord(source, key)).find(Boolean) || null;
}

const fail = error => ({ok: false, error});
function change(book, fn, options = {}) {
  if (!object(book)) return fail('unavailable');
  if (typeof options.canExport !== 'function') return fail('capacity');
  try {
    if (options.isCurrent && !options.isCurrent()) return fail('stale');
    const next = clone(book), result = fn(next);
    if (!result.ok || result.changed === false) return result;
    if (!validWordRoomRoot(next.wordRoom)) return fail('unavailable');
    if (!options.canExport(next)) return fail('capacity');
    if (options.isCurrent && !options.isCurrent()) return fail('stale');
    book.wordRoom = next.wordRoom;
    return result;
  } catch { return fail('capacity'); }
}
function room(next, create = false) {
  if (!own(next, 'wordRoom') && create) next.wordRoom = freshRoom();
  return validWordRoomRoot(next.wordRoom) ? next.wordRoom : null;
}
export function chooseWordRoomWord(book, id, options) {
  return change(book, next => {
    const r = room(next, true);
    if (!r || !wordRoomWord(r.source, id)) return fail('unavailable');
    const missing = !own(r.drafts, id);
    if (missing) r.drafts[id] = freshDraft();
    if (!missing && r.selectedId === id && r.page === 'meet') return {ok: true, changed: false};
    r.selectedId = id; r.page = 'meet';
    return {ok: true};
  }, options);
}
export function chooseWordRoomText(book, id, options) {
  return change(book, next => {
    const r = room(next, true);
    if (!r || !wordRoomText(r.source, id)) return fail('unavailable');
    if (r.textId === id && r.page === 'read') return {ok: true, changed: false};
    r.textId = id; r.page = 'read'; return {ok: true};
  }, options);
}
export function setWordRoomPage(book, requested, options) {
  return change(book, next => {
    const r = room(next);
    if (!r || ![...['choose', 'meet', 'build', 'read'], 'back'].includes(requested)) return fail('unavailable');
    const w = wordRoomWord(r.source, r.selectedId);
    const d = w && own(r.drafts, w.id) && validWordRoomDraft(r.drafts[w.id], r.source.alphabet);
    let target = requested === 'back' ? w && d ? 'build' : 'choose' : requested;
    let textId = r.textId, notice = '';
    if (target === 'read' && r.page !== 'read') {
      if (w && wordRoomText(r.source, w.textId)) textId = w.textId;
      else { target = 'choose'; notice = 'text-unavailable'; }
    }
    if (['meet', 'build'].includes(target) && !w) target = 'choose';
    if (r.page === target && textId === r.textId) return {ok: true, changed: false, notice};
    r.page = target; r.textId = textId; return {ok: true, notice};
  }, options);
}
export function editWordRoomDraft(book, action, value, options) {
  return change(book, next => {
    const r = room(next), w = r && wordRoomWord(r.source, r.selectedId), d = w && r.drafts[w.id];
    if (!w || !validWordRoomDraft(d, r.source.alphabet)) return fail('unavailable');
    switch (action) {
      case 'place':
        if (!Number.isInteger(value) || value < 0 || value > 2) return fail('selection');
        if (d.place === value) return {ok: true, changed: false}; d.place = value; break;
      case 'letter':
        if (typeof value !== 'string' || !r.source.alphabet.includes(value)) return fail('selection');
        if (d.slots[d.place] === value) return {ok: true, changed: false}; d.slots[d.place] = value; break;
      case 'clear-place':
        if (d.slots[d.place] === null) return {ok: true, changed: false}; d.slots[d.place] = null; break;
      case 'clear':
        if (d.slots.every(x => x === null)) return {ok: true, changed: false}; d.slots = [null, null, null]; break;
      case 'model':
        if (typeof value !== 'boolean') return fail('selection');
        if (d.modelShown === value) return {ok: true, changed: false}; d.modelShown = value; break;
      case 'point':
        if (value !== null && (!Number.isInteger(value) || value < 0 || value > 3)) return fail('selection');
        if (d.point === value) return {ok: true, changed: false}; d.point = value; break;
      default: return fail('selection');
    }
    return {ok: true};
  }, options);
}
export function checkWordRoomLabel(book) {
  const v = wordRoomView(book);
  if (!v.word || !v.draft) return fail('unavailable');
  const empty = v.draft.slots.indexOf(null);
  if (empty >= 0) return {ok: true, kind: 'incomplete', place: empty};
  const label = v.draft.slots.join('');
  const word = v.word.label === label ? v.word : v.words.map(x => x.word).find(w => w?.label === label);
  const unavailable = !word && Object.values(v.source.words).some(w => object(w) && own(w, 'label') && w.label === label);
  return {ok: true, kind: word ? word.id === v.word.id ? 'match' : 'other' : unavailable ? 'unavailable' : 'outside',
    id: word?.id || null, label, target: v.word.id, slots: [...v.draft.slots], book, root: v.root, source: v.source};
}
function receiptCurrent(book, checked) {
  if (!object(book) || !checked?.ok || !Array.isArray(checked.slots) || checked.slots.length !== 3 ||
      !['match', 'other'].includes(checked.kind) || checked.book !== book || checked.root !== book.wordRoom) return false;
  const v = wordRoomView(book);
  const current = checkWordRoomLabel(book);
  return current.id === checked.id && current.kind === checked.kind && v.source === checked.source && v.word?.id === checked.target && !!v.draft &&
    v.draft.slots.every((letter, i) => letter === checked.slots[i]) && wordRoomWord(v.source, checked.id)?.label === checked.label;
}
export function keepWordRoomLabel(book, checked, options = {}) {
  if (!receiptCurrent(book, checked)) return fail('stale');
  return change(book, next => {
    const r = room(next);
    if (!r || !wordRoomWord(r.source, checked.id)) return fail('unavailable');
    if (r.gallery.includes(checked.id)) return {ok: true, changed: false};
    r.gallery.push(checked.id); return {ok: true, id: checked.id};
  }, {...options, isCurrent: () => receiptCurrent(book, checked) && (!options.isCurrent || options.isCurrent())});
}
export function recoverWordRoom(book, confirmed, options) {
  if (confirmed !== true) return fail('confirmation');
  return change(book, next => {
    const previous = own(next, 'wordRoom') ? clone(next.wordRoom) : undefined;
    next.wordRoom = freshRoom();
    if (own(book, 'wordRoom')) next.wordRoom.recovered = previous;
    return {ok: true};
  }, options);
}
