import {makeParcelSource, parcelEndings} from './parcel-labels-content.mjs';

const object = x => x !== null && typeof x === 'object' && !Array.isArray(x);
const text = (x, max = 1600) => typeof x === 'string' && x.length <= max;
const id = x => typeof x === 'string' && /^[a-z][a-z0-9-]{0,49}$/.test(x);
const own = (x, key) => Object.hasOwn(x, key);
const clone = x => structuredClone(x);
const ending = x => parcelEndings.some(([code]) => code === x);
const rootShape = r => object(r) && r.version === 1 && object(r.visits) && Object.keys(r.visits).length <= 12;

export function validParcelSource(s) {
  return object(s) && s.format === 1 && id(s.id) && text(s.base, 40) && !!s.base && text(s.plural, 60) && !!s.plural &&
    Number.isInteger(s.count) && s.count >= 1 && s.count <= 5 && ['cafe', 'garden'].includes(s.destination) &&
    s.requestKind === 'send' && id(s.family) && id(s.art) && (s.trimmed === null || text(s.trimmed, 40) && !!s.trimmed) &&
    text(s.expected, 80) && !!s.expected && text(s.patternName, 80) && text(s.explanation) && text(s.workedExample, 3200) &&
    object(s.messages) && ['match', 'one', 'noEnding', 'trimmedNoEnding'].every(k => text(s.messages[k])) &&
    object(s.discoveries) && Object.keys(s.discoveries).length <= 8 && Object.entries(s.discoveries).every(([k, v]) => text(k, 80) && text(v));
}
const validPieces = (d, s, selected = false) => object(d) && ['keep', 'trim'].includes(d.stem) &&
  (d.stem !== 'trim' || s.trimmed !== null) && (ending(d.ending) || !selected && d.ending === null);
const validCheck = c => object(c) && ['keep', 'trim'].includes(c.stem) && ending(c.ending) && text(c.label, 100) &&
  ['match', 'different'].includes(c.outcome) && c.supported === true && typeof c.helpSeenBefore === 'boolean' && text(c.feedback, 6000);
function validWorking(w) {
  return object(w) && validParcelSource(w.source) && validPieces(w.draft, w.source) && text(w.ownMessage, 600) &&
    typeof w.help === 'boolean' && (w.ready === undefined || typeof w.ready === 'boolean') &&
    Array.isArray(w.checks) && w.checks.length <= 24 && w.checks.every(validCheck);
}
export const validParcelWork = validWorking;
const validSnapshot = k => object(k) && k.format === 1 && validWorking(k) && text(k.label, 100);
const readableVisit = (r, key) => id(key) && own(r.visits, key) && validWorking(r.visits[key]) ? r.visits[key] : null;

export function parcelLabel(w) {
  if (!validWorking(w) || w.draft.ending === null) return '';
  return (w.draft.stem === 'trim' ? w.source.trimmed : w.source.base) + (w.draft.ending === 'none' ? '' : w.draft.ending);
}
export function parcelReady(w) {
  if (!validWorking(w) || w.ready !== true) return false;
  const c = w.checks.at(-1);
  return !!c && c.outcome === 'match' && c.stem === w.draft.stem && c.ending === w.draft.ending && c.label === parcelLabel(w);
}
export function parcelLabelsView(state) {
  if (!own(state, 'parcelLabels')) return {status: 'new', work: null, visits: [], canCreate: true};
  const r = state.parcelLabels;
  if (!rootShape(r)) return {status: 'unsupported', work: null, visits: [], canCreate: false};
  const visits = Object.entries(r.visits).filter(([key]) => id(key)).map(([key, w]) => ({id: key, readable: validWorking(w), source: validWorking(w) ? w.source : null}));
  const work = readableVisit(r, r.currentId);
  return {status: 'ready', work, visits, canCreate: typeof r.currentId === 'string' &&
    Number.isSafeInteger(r.nextSerial) && r.nextSerial >= 1 && r.nextSerial < 999999999 &&
    Object.keys(r.visits).length < 12 && !own(r.visits, `parcel-${r.nextSerial}`)};
}
const fail = (error, detail = '') => ({ok: false, error, detail});
function change(state, fn, options) {
  try {
    const candidate = clone(state), result = fn(candidate);
    if (!result.ok || result.changed === false) return result;
    if (options?.canExport && !options.canExport(candidate)) return fail('unexportable');
    state.parcelLabels = candidate.parcelLabels;
    return result;
  } catch { return fail('unexportable'); }
}
function workingChange(state, fn, options) {
  return change(state, next => {
    const r = next.parcelLabels;
    if (!rootShape(r)) return fail('unavailable');
    const w = readableVisit(r, r.currentId);
    if (!w) return fail('unavailable');
    const result = fn(w);
    return !result.ok || validWorking(w) ? result : fail('unavailable');
  }, options);
}
export function startParcel(state, selection = {}, options = {}) {
  return change(state, next => {
    if (!own(next, 'parcelLabels')) next.parcelLabels = {version: 1, currentId: '', nextSerial: 1, visits: {}};
    const r = next.parcelLabels;
    if (!rootShape(r) || typeof r.currentId !== 'string') return fail('unavailable');
    if (Object.keys(r.visits).length >= 12) return fail('visit-cap');
    if (!Number.isSafeInteger(r.nextSerial) || r.nextSerial < 1 || r.nextSerial >= 999999999) return fail('counter');
    const key = `parcel-${r.nextSerial}`;
    if (own(r.visits, key)) return fail('collision');
    const source = makeParcelSource(r.nextSerial, selection);
    if (!source || !validParcelSource(source)) return fail('selection');
    r.visits[key] = {source, draft: {stem: 'keep', ending: null}, ownMessage: '', help: false, ready: false, checks: []};
    r.currentId = key; r.nextSerial++;
    return {ok: true, id: key};
  }, options);
}
export function openParcel(state, key, options = {}) {
  return change(state, next => {
    const r = next.parcelLabels;
    if (!rootShape(r) || !readableVisit(r, key)) return fail('unavailable');
    if (r.currentId === key) return {ok: true, changed: false};
    r.currentId = key; return {ok: true};
  }, options);
}
export function setParcelPiece(state, field, value, options = {}) {
  return workingChange(state, w => {
    if (!['stem', 'ending'].includes(field)) return fail('selection');
    const draft = {...w.draft, [field]: value};
    if (!validPieces(draft, w.source)) return fail('selection');
    if (w.draft[field] === value) return {ok: true, changed: false};
    w.draft[field] = value; w.ready = false;
    return {ok: true};
  }, options);
}
export function setParcelMessage(state, message, options = {}) {
  return workingChange(state, w => {
    if (!text(message, 600)) return fail('message-length');
    if (w.ownMessage === message) return {ok: true, changed: false};
    w.ownMessage = message; return {ok: true};
  }, options);
}
export function showParcelHelp(state, options = {}) {
  return workingChange(state, w => {
    if (w.help) return {ok: true, changed: false};
    w.help = true; return {ok: true};
  }, options);
}
export function checkParcel(state, options = {}) {
  return workingChange(state, w => {
    if (!validPieces(w.draft, w.source, true)) return fail('choose-ending');
    if (w.checks.length >= 24) return fail('check-cap');
    const s = w.source, label = parcelLabel(w), match = label === s.expected;
    const discovery = own(s.discoveries, label) ? `${s.discoveries[label]} ` : '';
    let explanation;
    if (match) explanation = s.messages.match;
    else if (s.count === 1) explanation = s.messages.one;
    else if (w.draft.ending === 'none') explanation = `${w.draft.stem === 'trim' ? s.messages.trimmedNoEnding : s.messages.noEnding} ${s.explanation}`;
    else explanation = s.explanation;
    const record = {...clone(w.draft), label, outcome: match ? 'match' : 'different', supported: true,
      helpSeenBefore: w.help, feedback: `Your label: ${label}. ${match ? 'That label fits this request.' : "Let's adjust this label."} ${discovery}${explanation}`};
    w.checks.push(record); w.ready = match;
    return {ok: true, record: clone(record)};
  }, options);
}
export function keepParcel(state, options = {}) {
  return workingChange(state, w => {
    if (!validPieces(w.draft, w.source, true)) return fail('choose-ending');
    if (['firstKept', 'latestKept'].some(key => own(w, key) && !validSnapshot(w[key]))) return fail('kept-unavailable');
    const snapshot = {format: 1, source: clone(w.source), draft: clone(w.draft), label: parcelLabel(w), ownMessage: w.ownMessage,
      help: w.help, ready: parcelReady(w), checks: clone(w.checks)};
    if (!own(w, 'firstKept')) w.firstKept = clone(snapshot);
    w.latestKept = snapshot;
    return {ok: true};
  }, options);
}
export function removeParcel(state, key, confirmed, options = {}) {
  if (confirmed !== true) return fail('confirmation');
  return change(state, next => {
    const r = next.parcelLabels;
    if (!rootShape(r) || !readableVisit(r, key)) return fail('unavailable');
    delete r.visits[key]; if (r.currentId === key) r.currentId = '';
    return {ok: true};
  }, options);
}
