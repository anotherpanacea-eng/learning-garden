import {poemCases, lineExampleText, lineFrames} from './poem-lines-content.mjs';

const poem = id => poemCases.find(item => item.id === id);
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value) &&
  [Object.prototype, null].includes(Object.getPrototypeOf(value));
const keys = (value, expected) => object(value) && Reflect.ownKeys(value).length === expected.length && expected.every(key => Object.hasOwn(value, key));
const position = (value, count) => Number.isInteger(value) && value >= 1 && value < count;
const snapshot = work => ({breaks:[...work.breaks], pauses:{...work.pauses}});
function validSnapshot(work, count) {
  if (!keys(work, ['breaks','pauses']) || !Array.isArray(work.breaks) || !object(work.pauses)) return false;
  if (!Array.from(work.breaks).every((p, i) => position(p,count) && (i === 0 || work.breaks[i - 1] < p))) return false;
  return Reflect.ownKeys(work.pauses).every(key => typeof key === 'string' &&
    String(Number(key)) === key && position(Number(key),count) && ['brief','long'].includes(work.pauses[key]));
}
function validWork(work, count) {
  return keys(work,['breaks','pauses','previous']) && validSnapshot({breaks:work.breaks,pauses:work.pauses},count) &&
    (work.previous === null || validSnapshot(work.previous,count));
}
function rows(tokens, breaks, pauses) {
  let start = 1;
  return [...breaks,tokens.length].map(end => {
    const row = {start,end,words:tokens.slice(start - 1,end).map((text,index) => {
      const p = start + index;
      return {position:p,text,pause:pauses[p] ?? null};
    })};
    start = end + 1;
    return row;
  });
}
export function lineWords(id) {
  const item = poem(id);
  return item ? item.text : null;
}
export function lineReference(id, layout) {
  const item = poem(id);
  return item && ['a','b'].includes(layout) ? {breaks:[...item.layouts[layout]],pauses:{},previous:null} : null;
}
export function createLines(id) { return lineReference(id,'a'); }
export function lineModel(id, work) {
  const item = poem(id), tokens = lineWords(id)?.split(' ');
  if (!item || !validWork(work,tokens.length)) return null;
  return {id,title:item.title,tokens,breaks:[...work.breaks],pauses:{...work.pauses},
    lines:rows(tokens,work.breaks,work.pauses),canUndo:work.previous !== null};
}
export function changeLines(id, work, action, value) {
  const tokens = lineWords(id)?.split(' ');
  if (!tokens || !validWork(work,tokens.length)) return null;
  if (action === 'undo') return work.previous ? {...snapshot(work.previous),previous:null} : null;
  const next = snapshot(work);
  if (action === 'break') {
    if (!position(value,tokens.length)) return null;
    next.breaks = next.breaks.includes(value) ? next.breaks.filter(p => p !== value) : [...next.breaks,value].sort((a,b) => a-b);
  } else if (action === 'pause') {
    if (!keys(value,['position','kind']) || !position(value.position,tokens.length) || ![null,'brief','long'].includes(value.kind)) return null;
    if ((next.pauses[value.position] ?? null) === value.kind) return null;
    if (value.kind === null) delete next.pauses[value.position];
    else next.pauses[value.position] = value.kind;
  } else if (action === 'reset') {
    next.breaks = [...poem(id).layouts.a]; next.pauses = {};
  } else return null;
  if (next.breaks.length === work.breaks.length && next.breaks.every((p,i) => p === work.breaks[i]) &&
      Object.keys(next.pauses).length === Object.keys(work.pauses).length && Object.keys(next.pauses).every(p => next.pauses[p] === work.pauses[p])) return null;
  return {...next,previous:snapshot(work)};
}
export function linePaperCopy(id, work) {
  const model = lineModel(id,work);
  if (!model) return null;
  const plan = Object.entries(model.pauses).map(([p,kind]) => `${p}: ${model.tokens[Number(p)-1]} — ${kind === 'brief' ? 'pause' : 'longer pause'}`);
  return `${model.title}\nArrangement of the given words\n\n${model.lines.map(row => row.words.map(word => word.text).join(' ')).join('\n')}\n\nPause plans\n${plan.length ? plan.join('\n') : 'No pause notes.'}\n\nPause notes are plans for a person; no performance was recorded.\n`;
}
export function lineExample(frame) {
  if (!Number.isInteger(frame) || frame < 0 || frame >= lineFrames.length) return null;
  const tokens = lineExampleText.split(' ');
  const layout = (label,breaks,pauses={}) => ({label,lines:rows(tokens,breaks,pauses)});
  const layouts = frame === 0 ? [layout('One printed line',[])] :
    frame === 1 ? [layout('Two printed lines',[2])] :
    frame === 2 ? [layout('Read across the line ending',[2]),layout('Try a small pause',[2],{2:'brief'})] :
    frame === 3 ? [layout('Pause inside the line',[],{4:'brief'})] :
    [layout('Brief pause',[],{4:'brief'}),layout('Longer pause',[],{4:'long'})];
  return {frame,tokens,caption:lineFrames[frame],layouts};
}
