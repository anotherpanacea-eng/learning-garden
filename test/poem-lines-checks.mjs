import assert from 'node:assert/strict';
import {poemCases} from '../dist/poem-lines-content.mjs';
import {createLines,changeLines,lineModel,lineReference,lineWords,linePaperCopy,lineExample} from '../dist/poem-lines-core.mjs';

const expected = {
  lantern:{words:['I','leave','a','lantern','by','the','gate.','Its','light','stays','when','I','go.'],a:[7],b:[2,7,10]},
  rain:{words:['We','wait;','the','rain','taps','at','the','roof.','Then','one','small','drop','finds','the','cup.'],a:[8],b:[2,5,8,12]},
  bridge:{words:['The','bridge','remembers','nothing','of','our','names,','yet','every','board','is','warm','where','we','have','stood.'],a:[7],b:[3,7,12]},
  seeds:{words:['Beyond','the','window,','seeds','wait','in','paper','boats.','We','call','them','cargo;','tomorrow','they','may','become','a','garden.'],a:[8,12],b:[3,6,8,12,15]}
};
const copy = value => structuredClone(value);
const flatten = model => model.lines.flatMap(row => row.words.map(word => word.text));
function partition(words, breaks) {
  const result = []; let start = 0;
  for (const end of [...breaks,words.length]) {result.push(words.slice(start,end)); start=end;}
  return result;
}
assert.deepEqual(poemCases.map(item => item.id),Object.keys(expected));
for (const [id,e] of Object.entries(expected)) {
  const original = createLines(id), untouched = copy(original);
  assert.equal(lineWords(id),e.words.join(' '));
  assert.deepEqual(original,{breaks:e.a,pauses:{},previous:null});
  for (const variant of ['a','b']) {
    const reference = lineReference(id,variant), model = lineModel(id,reference);
    assert.deepEqual(model.lines.map(row => row.words.map(word => word.text)),partition(e.words,e[variant]));
    assert.deepEqual(flatten(model),e.words);
    assert.deepEqual(model.lines.map(row => [row.start,row.end]),e[variant].concat(e.words.length).map((end,i,ends) => [i ? ends[i-1]+1 : 1,end]));
    assert.equal(model.canUndo,false);
    assert.ok(model.lines.every(row => row.words.every(word => word.pause === null)));
    reference.breaks.push(1);
    assert.deepEqual(lineReference(id,variant).breaks,e[variant],'references are fresh copies');
  }
  let work = changeLines(id,original,'break',1);
  assert.deepEqual(work.breaks,[1,...e.a]);
  assert.deepEqual(work.previous,{breaks:e.a,pauses:{}});
  const beforePause = copy(work);
  work = changeLines(id,work,'pause',{position:1,kind:'brief'});
  assert.deepEqual(work.previous,{breaks:beforePause.breaks,pauses:{}});
  assert.equal(lineModel(id,work).lines[0].words[0].pause,'brief','pause belongs to its token at a line end');
  const withBrief = copy(work);
  assert.equal(changeLines(id,work,'pause',{position:1,kind:'brief'}),null);
  assert.deepEqual(work,withBrief,'no-op preserves history and material');
  work = changeLines(id,work,'break',1);
  assert.deepEqual(work.breaks,e.a);
  assert.deepEqual(work.pauses,{'1':'brief'},'joining leaves pause intact');
  assert.deepEqual(changeLines(id,work,'undo'),{breaks:[1,...e.a],pauses:{1:'brief'},previous:null});
  assert.equal(changeLines(id,changeLines(id,work,'undo'),'undo'),null,'only one material change can be undone');
  work = changeLines(id,work,'pause',{position:1,kind:'long'});
  assert.equal(lineModel(id,work).lines[0].words[0].pause,'long');
  const priorReset = copy(work);
  const reset = changeLines(id,work,'reset');
  assert.deepEqual(reset,{breaks:e.a,pauses:{},previous:{breaks:e.a,pauses:{1:'long'}}});
  assert.deepEqual(changeLines(id,reset,'undo'),{breaks:priorReset.breaks,pauses:priorReset.pauses,previous:null});
  assert.equal(changeLines(id,original,'reset'),null);
  const removed = changeLines(id,work,'pause',{position:1,kind:null});
  assert.deepEqual(removed.pauses,{});
  assert.deepEqual(original,untouched,'all operations are pure');
  for (const p of [0,-1,1.5,e.words.length,e.words.length+1,'1',NaN,Infinity]) {
    assert.equal(changeLines(id,work,'break',p),null);
    assert.equal(changeLines(id,work,'pause',{position:p,kind:'brief'}),null);
  }
  for (const bad of ['short','longer','',false,undefined]) assert.equal(changeLines(id,work,'pause',{position:1,kind:bad}),null);
  for (const invalid of [null,[],{}, {...original,breaks:Array(1)}, {...original,breaks:[1,1]}, {...original,breaks:[2,1]}, {...original,breaks:[e.words.length]},
    {...original,pauses:{'01':'brief'}}, {...original,pauses:{'a':'brief'}}, {...original,pauses:{[e.words.length]:'long'}},
    {...original,pauses:{1:null}}, {...original,previous:{breaks:e.a,pauses:{},previous:null}}, {...original,extra:true}]) {
    assert.equal(lineModel(id,invalid),null);
    assert.equal(changeLines(id,invalid,'reset'),null);
    assert.equal(linePaperCopy(id,invalid),null);
  }
  const exportWork = changeLines(id,changeLines(id,original,'break',1),'pause',{position:1,kind:'brief'});
  const body = linePaperCopy(id,exportWork);
  const section = body.split('\n\n');
  assert.deepEqual(section[1].split('\n'),partition(e.words,[1,...e.a]).map(words => words.join(' ')));
  assert.ok(section[0].endsWith('Arrangement of the given words'));
  assert.equal(section[2],`Pause plans\n1: ${e.words[0]} — pause`);
  assert.equal(section[3],'Pause notes are plans for a person; no performance was recorded.\n');
  assert.deepEqual(exportWork.pauses,{1:'brief'},'export is read-only');
}
for (const id of ['example','__proto__','constructor','',null,undefined,{}]) {
  assert.equal(createLines(id),null); assert.equal(lineWords(id),null); assert.equal(lineReference(id,'a'),null);
  assert.equal(lineModel(id,createLines('lantern')),null); assert.equal(changeLines(id,createLines('lantern'),'break',1),null);
}
assert.equal(lineReference('lantern','A'),null);
assert.equal(changeLines('lantern',createLines('lantern'),'write','new words'),null);
assert.equal(changeLines('lantern',createLines('lantern'),'pause',{position:1,kind:'brief',extra:1}),null);
const exampleWords = ['We','hold','the','door;','the','wind','comes','in.'];
const expectedExamples = [
  [{breaks:[],pauses:{}}], [{breaks:[2],pauses:{}}],
  [{breaks:[2],pauses:{}},{breaks:[2],pauses:{2:'brief'}}],
  [{breaks:[],pauses:{4:'brief'}}],
  [{breaks:[],pauses:{4:'brief'}},{breaks:[],pauses:{4:'long'}}]
];
expectedExamples.forEach((layouts,frame) => {
  const actual = lineExample(frame);
  assert.deepEqual(actual.tokens,exampleWords);
  assert.equal(actual.layouts.length,layouts.length);
  layouts.forEach((e,index) => {
    const rows = actual.layouts[index].lines;
    assert.deepEqual(rows.map(row => row.words.map(word => word.text)),partition(exampleWords,e.breaks));
    assert.deepEqual(Object.fromEntries(rows.flatMap(row => row.words.filter(word => word.pause).map(word => [word.position,word.pause]))),e.pauses);
  });
});
for (const frame of [-1,5,1.5,'0',null,NaN]) assert.equal(lineExample(frame),null);
console.log('Poem lines checks passed.');
