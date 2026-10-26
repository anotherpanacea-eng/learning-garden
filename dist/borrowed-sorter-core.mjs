import {createSorterSource} from './borrowed-sorter-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';

const clone = value => structuredClone(value);
const own = (value, key) => Object.hasOwn(value, key);
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const string = (value, max = 6000) => typeof value === 'string' && value.length <= max;
const integer = (value, max = 1000000) => Number.isSafeInteger(value) && value >= 0 && value <= max;
const list = (value, max) => Array.isArray(value) && value.length <= max;
const strings = (value, max = 256) => list(value, max) && value.every(x => string(x, 240));
const reserved = ['__proto__','constructor','prototype','toString','valueOf'];
const id = value => string(value, 100) && /^[a-z0-9][a-z0-9-]*$/i.test(value) && !reserved.includes(value);
const unique = xs => new Set(xs).size === xs.length;
const featureNames = ['size','wrap','road'];
const domains = {size:['small','large'],wrap:['brown','blue'],road:['valley','hill']};
const datasets = ['baseline','augmented'];
const batches = ['test','training'];
const labelNames = ['testBatch','trainingBatch','augmentedBatch','extraBatch','modelBoundary','development','augmentedWarning','noMajority','noParcels','closing','traceSupport','runSupport','practice'];
const arrayIds = (xs, max) => list(xs, max) && xs.every(x => object(x) && id(x.id)) && unique(xs.map(x => x.id));

function validFeatures(source, features) {
  return list(features, 3) && unique(features) && features.every(f => source.features.some(x => x.id === f));
}
const validProfile = (source, value) => object(value) && validFeatures(source, value.features) && datasets.includes(value.dataset);
const canonical = (source, features) => source.features.map(f => f.id).filter(id => features.includes(id));
function validRow(source, row) {
  return object(row) && id(row.id) && integer(row.town) && integer(row.hill) && featureNames.every(name =>
    source.features.find(f => f.id === name)?.values.some(v => v.id === row[name]));
}
function safeTotal(rows) {
  const total = rows.reduce((n, r) => n + r.town + r.hill, 0);
  return integer(total);
}
const validOption = option => object(option) && id(option.id) && string(option.label, 500) && string(option.reply);
function validSourceInner(source) {
  if (!object(source) || source.version !== 1 || source.mode !== 'exact-majority-v1' ||
      !id(source.id) || !string(source.title, 240) || !string(source.story) ||
      !arrayIds(source.features, 3) || source.features.length !== 3 ||
      !featureNames.every(name => source.features.some(f => f.id === name)) ||
      !arrayIds(source.destinations, 2) || source.destinations.length !== 2 ||
      !['town','hill'].every(name => source.destinations.some(d => d.id === name && string(d.label, 200)))) return false;
  for (const feature of source.features) {
    if (!string(feature.label, 200) || !arrayIds(feature.values, 2) || !feature.values.length ||
        !feature.values.every(v => domains[feature.id].includes(v.id) && string(v.label, 200))) return false;
  }
  if (!object(source.tables)) return false;
  for (const name of ['baseline','extra','test']) {
    const rows = source.tables[name];
    if (!arrayIds(rows, 32) || !rows.every(r => validRow(source, r)) || !safeTotal(rows)) return false;
  }
  const augmented = [...source.tables.baseline, ...source.tables.extra];
  if (!unique(augmented.map(r => r.id)) || !safeTotal(augmented) || !validProfile(source, source.initialProfile)) return false;
  if (!list(source.instructions, 12) || !source.instructions.every(t => string(t)) ||
      !list(source.pages, 5) || source.pages.length !== 5 ||
      !source.pages.every(p => object(p) && string(p.title, 240) && list(p.teaching, 12) && p.teaching.every(t => string(t)) && string(p.example))) return false;
  if (!arrayIds(source.tasks, 48)) return false;
  for (const task of source.tasks) {
    if (!integer(task.page, 4) || !['integer','choice'].includes(task.kind) ||
        !string(task.prompt) || !validProfile(source, task.profile) || !batches.includes(task.batch) ||
        !string(task.key, 100) || !string(task.feedback) || !string(task.hint) || !string(task.example) ||
        !arrayIds(task.choices, 12)) return false;
    if (task.kind === 'integer') {
      if (!/^\d+$/.test(task.key) || !integer(Number(task.key), 10000) || !integer(task.denominator) || task.choices.length) return false;
    } else if (task.denominator !== null || !task.choices.length ||
        !task.choices.every(validOption) || !task.choices.some(c => c.id === task.key)) return false;
  }
  if (!arrayIds(source.discussions, 16) || !source.discussions.every(d => integer(d.page, 4) && string(d.prompt) &&
      arrayIds(d.options, 16) && d.options.length > 0 && d.options.every(validOption))) return false;
  if (!arrayIds(source.parts, 8) || !source.parts.every(p => string(p.title, 240) && arrayIds(p.options, 16) &&
      p.options.every(o => string(o.text)))) return false;
  const taskIds = [...source.tasks, ...source.discussions, ...source.parts].map(x => x.id);
  if (!unique(taskIds) || !arrayIds(source.presets, 16) || !source.presets.every(p => string(p.label, 240) && validProfile(source, p))) return false;
  return object(source.labels) && labelNames.every(name => string(source.labels[name]));
}
export function validSorterSource(source) {
  try { return validSourceInner(source); } catch { return false; }
}
function corpus(source, dataset) {
  return dataset === 'augmented' ? [...source.tables.baseline, ...source.tables.extra] : source.tables.baseline;
}
const counts = rows => rows.reduce((n, row) => ({town:n.town + row.town, hill:n.hill + row.hill}), {town:0, hill:0});
function classify(source, features, dataset, parcel) {
  const examples = corpus(source, dataset);
  const matching = examples.filter(row => features.every(f => row[f] === parcel[f]));
  const matchedCounts = counts(matching);
  const fallback = matchedCounts.town + matchedCounts.hill === 0;
  const votes = fallback ? counts(examples) : {...matchedCounts};
  const destination = votes.town === votes.hill ? 'none' : votes.town > votes.hill ? 'town' : 'hill';
  return {parcel:clone(parcel), matchedIds:matching.map(row => row.id), matchedCounts, fallback, votes, destination};
}
export function classifySorter(source, features, dataset, parcel) {
  try {
    if (!validSorterSource(source) || !validFeatures(source, features) || !datasets.includes(dataset)) return null;
    if (typeof parcel === 'string') parcel = source.tables.test.find(row => row.id === parcel);
    if (!validRow(source, parcel)) return null;
    return classify(source, canonical(source, features), dataset, parcel);
  } catch { return null; }
}
const percentage = (correct, total) => total === 0 ? null : 100 * correct / total;
function evaluate(source, features, dataset, batch) {
  const parcels = batch === 'training' ? source.tables.baseline : source.tables.test;
  const rows = parcels.map(parcel => {
    const trace = classify(source, features, dataset, parcel);
    return {parcelId:parcel.id, town:parcel.town, hill:parcel.hill,
      correctTown:trace.destination === 'town' ? parcel.town : 0,
      correctHill:trace.destination === 'hill' ? parcel.hill : 0,
      undecided:trace.destination === 'none' ? parcel.town + parcel.hill : 0, trace};
  });
  const groups = {};
  for (const destination of ['town','hill']) {
    const total = rows.reduce((n, r) => n + r[destination], 0);
    const correct = rows.reduce((n, r) => n + r[destination === 'town' ? 'correctTown' : 'correctHill'], 0);
    groups[destination] = {total, correct, percent:percentage(correct, total)};
  }
  const total = groups.town.total + groups.hill.total;
  const correct = groups.town.correct + groups.hill.correct;
  return {batch, rows, total, correct, undecided:rows.reduce((n, r) => n + r.undecided, 0), percent:percentage(correct, total), groups};
}
export function evaluateSorter(source, features, dataset, batch = 'test') {
  try {
    if (!validSorterSource(source) || !validFeatures(source, features) || !datasets.includes(dataset) || !batches.includes(batch)) return null;
    return evaluate(source, canonical(source, features), dataset, batch);
  } catch { return null; }
}
// Compare only the fields the computation and UI own; preserve unrelated fields.
function matches(value, expected) {
  if (Array.isArray(expected)) return Array.isArray(value) && value.length === expected.length && expected.every((x, i) => matches(value[i], x));
  if (object(expected)) return object(value) && Object.keys(expected).every(k => own(value, k) && matches(value[k], expected[k]));
  return value === expected;
}
function sameProfile(source, a, b) {
  return validProfile(source, a) && validProfile(source, b) && a.dataset === b.dataset &&
    JSON.stringify(canonical(source, a.features)) === JSON.stringify(canonical(source, b.features));
}
export function validSorterRun(record) {
  try {
    return object(record) && validSorterSource(record.source) && validProfile(record.source, record) && strings(record.helpBefore) &&
      object(record.result) && batches.includes(record.result.batch) &&
      matches(record.result, evaluate(record.source, record.features, record.dataset, record.result.batch));
  } catch { return false; }
}
export function validSorterTrace(record) {
  try {
    if (!object(record) || !validSorterSource(record.source) || !validProfile(record.source, record) || !strings(record.helpBefore) || !id(record.parcelId)) return false;
    const parcel = record.source.tables.test.find(row => row.id === record.parcelId);
    return !!parcel && matches(record.trace, classify(record.source, record.features, record.dataset, parcel));
  } catch { return false; }
}
export function validSorterCheck(record) {
  try {
    if (!object(record) || !validSorterSource(record.source) || !id(record.taskId) || !string(record.raw, 40) ||
        !validProfile(record.source, record.profile) || !strings(record.helpBefore) ||
        !['match','different'].includes(record.outcome) || !string(record.feedback, 12000) || record.supported !== true) return false;
    const task = record.source.tasks.find(t => t.id === record.taskId);
    return !!task && sameProfile(record.source, record.profile, task.profile) &&
      matches(record.resultContext, evaluate(record.source, record.profile.features, record.profile.dataset, task.batch));
  } catch { return false; }
}
export function validSorterPart(part, sourcePart = null) {
  return object(part) && ['own','supplied'].includes(part.mode) && string(part.own, 1200) &&
    string(part.choiceId, 100) && (!sourcePart || part.choiceId === '' || sourcePart.options.some(o => o.id === part.choiceId));
}
function renderedAdvice(source, plan) {
  const renderedParts = [], supportedParts = [];
  for (const part of source.parts) {
    const entry = own(plan, part.id) ? plan[part.id] : {mode:'own', own:'', choiceId:''};
    const valid = validSorterPart(entry, part);
    const mode = object(entry) && entry.mode === 'supplied' ? 'supplied' : 'own';
    const option = valid ? part.options.find(o => o.id === entry.choiceId) : null;
    const text = !valid ? '' : mode === 'own' ? entry.own : option?.text || '';
    renderedParts.push({id:part.id, title:part.title, text, mode});
    if (valid && mode === 'supplied' && option) supportedParts.push({partId:part.id, choiceId:option.id, text:option.text});
  }
  return {renderedParts, supportedParts};
}
export function validSorterKeep(record) {
  try {
    if (!object(record) || !validSorterSource(record.source) || !object(record.plan) || !strings(record.helpBefore) || !list(record.runs, 24)) return false;
    const advice = renderedAdvice(record.source, record.plan);
    return matches(record.renderedParts, advice.renderedParts) && matches(record.supportedParts, advice.supportedParts) &&
      record.runs.every(run => object(run) && validSorterSource(run.source) && validProfile(run.source, run) &&
        (!own(run, 'helpBefore') || strings(run.helpBefore)) && object(run.result) && batches.includes(run.result.batch) && matches(run.result, evaluate(run.source, run.features, run.dataset, run.result.batch)));
  } catch { return false; }
}
export function validSorterWork(work) {
  try {
    return object(work) && validSorterSource(work.source) && integer(work.page, 4) && validProfile(work.source, work) &&
      string(work.parcelId, 100) && (work.parcelId === '' || work.source.tables.test.some(row => row.id === work.parcelId)) &&
      object(work.answers) && object(work.plan) && strings(work.help) && list(work.runs, 24) && list(work.traces, 12) &&
      list(work.checks, 48) && object(work.firstChecks);
  } catch { return false; }
}
function validRoot(root) {
  return object(root) && root.version === 1 && string(root.current, 1000) &&
    Number.isSafeInteger(root.next) && root.next >= 1 && object(root.visits) && Object.keys(root.visits).length <= 16;
}
export function sorterView(state) {
  if (!own(state, 'borrowedSorter')) return {status:'empty', current:'', work:null, visits:[], root:null};
  const root = state.borrowedSorter;
  if (!validRoot(root)) return {status:'unavailable', current:'', work:null, visits:[], root};
  const visits = Object.entries(root.visits).map(([key, work]) => ({id:key,
    title:validSorterSource(work?.source) ? work.source.title : key,
    readable:id(key) && validSorterWork(work)}));
  const current = root.current;
  const work = id(current) && own(root.visits, current) && validSorterWork(root.visits[current]) ? root.visits[current] : null;
  return {status:work ? 'ready' : current ? 'unreadable' : 'empty', current, work, visits, root};
}
function fits(candidate, options) {
  try { return recoveryFitsProgressLimits(candidate) && (!options.canExport || options.canExport(candidate) === true); }
  catch { return false; }
}
function change(state, operation, options = {}) {
  try {
    if (own(state, 'borrowedSorter') && !validRoot(state.borrowedSorter)) return false;
    const candidate = clone(state);
    const outcome = operation(candidate);
    if (!outcome || !validRoot(candidate.borrowedSorter)) return false;
    if (outcome.visitId && (!own(candidate.borrowedSorter.visits, outcome.visitId) || !validSorterWork(candidate.borrowedSorter.visits[outcome.visitId]))) return false;
    if (!fits(candidate, options)) return false;
    for (const key of Object.keys(candidate)) state[key] = candidate[key];
    return outcome.value;
  } catch { return false; }
}
function workChange(state, operation, options = {}) {
  return change(state, candidate => {
    const view = sorterView(candidate);
    if (!view.work) return false;
    const value = operation(view.work);
    return value ? {value, visitId:view.current} : false;
  }, options);
}
export function startSorter(state, options = {}) {
  return change(state, candidate => {
    if (!own(candidate, 'borrowedSorter')) candidate.borrowedSorter = {version:1, current:'', next:1, visits:{}};
    const root = candidate.borrowedSorter;
    if (Object.keys(root.visits).length >= 16) return false;
    let serial = root.next;
    while (own(root.visits, `sorter-${serial}`)) {
      serial++;
      if (!Number.isSafeInteger(serial)) return false;
    }
    if (serial >= Number.MAX_SAFE_INTEGER) return false;
    const source = createSorterSource(serial);
    if (!validSorterSource(source)) return false;
    const visitId = `sorter-${serial}`;
    root.visits[visitId] = {source, page:0, features:clone(source.initialProfile.features), dataset:source.initialProfile.dataset,
      parcelId:source.tables.test[0]?.id || '', answers:{}, plan:{}, help:[], runs:[], traces:[], checks:[], firstChecks:{}};
    root.current = visitId;
    root.next = serial + 1;
    return {value:visitId, visitId};
  }, options);
}
export function resumeSorter(state, visitId, options = {}) {
  if (!id(visitId)) return false;
  return change(state, candidate => {
    const root = candidate.borrowedSorter;
    if (!root || !own(root.visits, visitId) || !validSorterWork(root.visits[visitId])) return false;
    root.current = visitId;
    return {value:true, visitId};
  }, options);
}
export function pageSorter(state, page, options = {}) {
  return integer(page, 4) && workChange(state, work => {work.page = page; return true;}, options);
}
export function profileSorter(state, features, dataset, options = {}) {
  const work = sorterView(state).work;
  if (!work || !validFeatures(work.source, features) || !datasets.includes(dataset)) return false;
  const next = {features:canonical(work.source, features), dataset};
  if (sameProfile(work.source, work, next)) return true;
  return workChange(state, current => {current.features = next.features; current.dataset = next.dataset; return true;}, options);
}
export function parcelSorter(state, parcelId, options = {}) {
  return workChange(state, work => {
    if (!work.source.tables.test.some(row => row.id === parcelId)) return false;
    work.parcelId = parcelId;
    return true;
  }, options);
}
export function editSorter(state, kind, itemId, value, options = {}) {
  if (!['answer','plan'].includes(kind) || !id(itemId)) return false;
  return workChange(state, work => {
    if (kind === 'answer') {
      const task = work.source.tasks.find(t => t.id === itemId);
      if (!task || !string(value, 40) || (own(work.answers, itemId) && !string(work.answers[itemId], 40))) return false;
      if (task.kind === 'choice' && value !== '' && !task.choices.some(c => c.id === value)) return false;
      work.answers[itemId] = value;
    } else {
      const part = work.source.parts.find(p => p.id === itemId);
      if (!part || !validSorterPart(value, part) || (own(work.plan, itemId) && !validSorterPart(work.plan[itemId], part))) return false;
      if (value.choiceId !== '' && !part.options.some(o => o.id === value.choiceId)) return false;
      work.plan[itemId] = clone(value);
    }
    return true;
  }, options);
}
function knownHelp(source, key) {
  if (['trace','run'].includes(key)) return true;
  if (source.tasks.some(t => key === `${t.id}:hint` || key === `${t.id}:example`)) return true;
  if (source.discussions.some(d => d.options.some(o => key === `${d.id}:${o.id}`))) return true;
  return source.parts.some(p => key === `${p.id}:starter`);
}
function addHelp(work, key) {
  if (!knownHelp(work.source, key)) return false;
  if (!work.help.includes(key)) work.help.push(key);
  return true;
}
export function helpSorter(state, key, options = {}) {
  return workChange(state, work => addHelp(work, key), options);
}
export function starterSorter(state, partId, confirmed = false, options = {}) {
  return workChange(state, work => {
    const part = work.source.parts.find(p => p.id === partId);
    const entry = own(work.plan, partId) ? work.plan[partId] : null;
    if (!part || !validSorterPart(entry, part)) return false;
    const option = part.options.find(o => o.id === entry.choiceId);
    if (!option || (entry.own.length > 0 && confirmed !== true)) return false;
    if (!addHelp(work, `${partId}:starter`)) return false;
    work.plan[partId] = {...clone(entry), mode:'own', own:option.text};
    return true;
  }, options);
}
export function runSorter(state, presetId = null, options = {}) {
  return workChange(state, work => {
    if (work.runs.length >= 24) return false;
    if (presetId !== null) {
      const preset = work.source.presets.find(p => p.id === presetId);
      if (!preset) return false;
      work.features = canonical(work.source, preset.features);
      work.dataset = preset.dataset;
    }
    if (!addHelp(work, 'run')) return false;
    const record = {source:clone(work.source), features:clone(work.features), dataset:work.dataset,
      result:evaluate(work.source, work.features, work.dataset, 'test'), helpBefore:clone(work.help)};
    if (!validSorterRun(record)) return false;
    work.runs.push(record);
    return {recorded:true, ...clone(record)};
  }, options);
}
export function traceSorter(state, options = {}) {
  return workChange(state, work => {
    if (work.traces.length >= 12) return false;
    const parcel = work.source.tables.test.find(row => row.id === work.parcelId);
    if (!parcel || !addHelp(work, 'trace')) return false;
    const record = {source:clone(work.source), features:clone(work.features), dataset:work.dataset,
      parcelId:parcel.id, trace:classify(work.source, work.features, work.dataset, parcel), helpBefore:clone(work.help)};
    if (!validSorterTrace(record)) return false;
    work.traces.push(record);
    return {recorded:true, ...clone(record)};
  }, options);
}
export function checkSorter(state, taskId, options = {}) {
  const work = sorterView(state).work;
  const task = work?.source.tasks.find(t => t.id === taskId);
  if (!work || !task) return false;
  const raw = own(work.answers, taskId) ? work.answers[taskId] : '';
  if (!string(raw, 40)) return false;
  let answer;
  if (task.kind === 'integer') {
    if (!/^\d+$/.test(raw.trim()) || !integer(Number(raw.trim()), 10000)) return {recorded:false, feedback:'Enter a whole number from 0 to 10000. Leave off the percent sign; a blank is not zero.'};
    answer = String(Number(raw.trim()));
  } else {
    if (!task.choices.some(c => c.id === raw)) return {recorded:false, feedback:'Choose one of this question’s supplied answers before checking.'};
    answer = raw;
  }
  return workChange(state, current => {
    if (current.checks.length >= 48) return false;
    const ownTask = current.source.tasks.find(t => t.id === taskId);
    const selected = ownTask.choices.find(c => c.id === answer);
    const feedback = selected ? `${selected.reply} ${ownTask.feedback}` : ownTask.feedback;
    const record = {source:clone(current.source), taskId, raw, profile:clone(ownTask.profile),
      resultContext:evaluate(current.source, ownTask.profile.features, ownTask.profile.dataset, ownTask.batch),
      helpBefore:clone(current.help), outcome:answer === ownTask.key ? 'match' : 'different', feedback, supported:true};
    if (!validSorterCheck(record)) return false;
    if (!own(current.firstChecks, taskId)) current.firstChecks[taskId] = clone(record);
    current.checks.push(record);
    return {recorded:true, ...clone(record)};
  }, options);
}
export function keepSorter(state, options = {}) {
  return workChange(state, work => {
    const advice = renderedAdvice(work.source, work.plan);
    const record = {source:clone(work.source), plan:clone(work.plan), ...advice, helpBefore:clone(work.help),
      runs:work.runs.filter(validSorterRun).map(run => ({source:clone(run.source), features:clone(run.features), dataset:run.dataset, result:clone(run.result), helpBefore:clone(run.helpBefore)}))};
    if (!validSorterKeep(record)) return false;
    if (!own(work, 'firstKept')) work.firstKept = clone(record);
    work.kept = clone(record);
    return true;
  }, options);
}
export function removeSorter(state, visitId, confirmed, options = {}) {
  if (confirmed !== true || !string(visitId, 1000)) return false;
  return change(state, candidate => {
    const root = candidate.borrowedSorter;
    if (!root || !own(root.visits, visitId)) return false;
    delete root.visits[visitId];
    if (root.current === visitId) root.current = '';
    return {value:true};
  }, options);
}
