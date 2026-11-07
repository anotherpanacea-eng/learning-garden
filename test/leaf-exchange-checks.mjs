import assert from 'node:assert/strict';
import {createLeafExchange, changeLeafExchange as change, leafExchangeModel as model, leafExchangeNarration as hear} from '../dist/leaf-exchange-core.mjs';
import {leafExchangeCopy as copy, leafExchangeTrails as trails, leafExchangeTeaching as cards} from '../dist/leaf-exchange-content.mjs';

const initial = createLeafExchange();
assert.deepEqual(initial, {page:'build', photo:2, resp:1, gas:'oxygen', paired:false, trail:0, lesson:0, kind:0});
const frozen = Object.freeze(initial);
for (let photo = 0; photo <= 6; photo++) for (let resp = 0; resp <= 6; resp++) {
  for (const gas of ['oxygen', 'carbon-dioxide']) {
    const work = Object.freeze({...initial, photo, resp, gas});
    const m = model(work);
    const photoCount = Array.from({length: photo}, () => 6).reduce((a,b) => a+b, 0);
    const respCount = Array.from({length: resp}, () => 6).reduce((a,b) => a+b, 0);
    const made = gas === 'oxygen' ? photoCount : respCount;
    const used = gas === 'oxygen' ? respCount : photoCount;
    assert.equal(m.made, made); assert.equal(m.used, used); assert.equal(m.net, made-used);
    assert.equal(m.oxygenNet, photoCount-respCount); assert.equal(m.carbonDioxideNet, respCount-photoCount);
    assert.equal(m.oxygenNet + m.carbonDioxideNet, 0);
    assert.deepEqual(m.rows.map(r => r.molecules), [photoCount,respCount]);
    assert.deepEqual(m.rows.map(r => r.role), gas === 'oxygen' ? ['made','used'] : ['used','made']);
    assert.equal(m.pairedCount, Math.min(photo,resp)); assert.equal(m.markerX, 68+7*(made-used+36));
    for (const r of m.rows) {
      if (r.groups === 0) { assert.match(r.caption,/^No /); assert.doesNotMatch(r.caption,/×/); }
      else assert.ok(r.caption.includes(`${r.groups} ${r.groups === 1 ? 'group' : 'groups'} × 6`));
    }
    assert.equal(model({...work, paired:true}).net, m.net);
    assert.deepEqual(model({...work, paired:true}).rows,m.rows);
    if (m.net < 0) assert.match(m.explanation,/change, not a negative amount of gas/);
    if (m.net === 0) assert.match(m.explanation,/cannot distinguish no entries from balanced entries/);
    if (m.net > 0) assert.match(m.netCaption,/net: \+/);
    if (m.net < 0) assert.match(m.netCaption,/net: −/);
    const pair = model({...work, paired:true});
    assert.match(pair.linkCaption, Math.min(photo,resp) === 0 ? /^No links:/ : /^Linked pairs:/);
  }
}
for (const bad of ['1',true,false,null,undefined,NaN,Infinity,-1,7,0.5,{},[]]) {
  for (const action of ['photo','resp']) assert.equal(change(frozen,action,bad),frozen);
}
for (const [action,value] of [['page','no'],['gas','night'],['trail',6],['lesson',0],['kind',0],['reset',null]]) assert.equal(change(frozen,action,value),frozen);
for (const [action,value] of [['photo',2],['resp',1],['gas','oxygen'],['trail',0],['page','build']]) assert.equal(change(frozen,action,value),frozen);
for (const [action,value] of [['photo',0],['resp',6],['gas','carbon-dioxide'],['trail',5],['pair',undefined]]) {
  const next = change(frozen,action,value); assert.notEqual(next,frozen);
  const key = action === 'pair' ? 'paired' : action;
  assert.deepEqual(Object.fromEntries(Object.entries(next).filter(([k])=>k!==key)),Object.fromEntries(Object.entries(frozen).filter(([k])=>k!==key)));
}
assert.equal(Object.is(change(frozen,'photo',-0).photo,-0),false);
assert.deepEqual(change(change(frozen,'photo',3),'photo',2),initial);
const learn = Object.freeze(change(initial,'page','learn'));
for (const [action,value] of [['photo',1],['resp',0],['gas','carbon-dioxide'],['pair',null],['trail',1],['lesson',4],['kind',0]]) assert.equal(change(learn,action,value),learn);
assert.equal(change(learn,'lesson',0),learn);
assert.equal(change(learn,'lesson',3).lesson,3);
assert.deepEqual(change(learn,'page','build'),initial);
assert.equal(trails.length,6); assert.equal(cards.length,4);
assert.ok(Object.isFrozen(copy)); assert.ok(Object.isFrozen(cards)); assert.ok(Object.isFrozen(trails));
assert.ok(cards.every(Object.isFrozen)); assert.ok(trails.every(Object.isFrozen));
const detached = model(initial); detached.trail.title = 'changed'; detached.teaching.title='changed'; detached.rows[0].caption='changed';
assert.equal(model(initial).trail.title,'Zero, two ways'); assert.equal(model(initial).teaching.title,'Two processes, two accounts.');

const context = Object.freeze({index:4,title:'Saved <model>',notice:'FULL PRIVATE SOURCE NOTICE',steps:0,
  rows:Object.freeze([
    Object.freeze({label:'Same label',canCross:false,leftToRight:-0,rightToLeft:0,net:-0}),
    Object.freeze({label:'Same label',canCross:true,leftToRight:1,rightToLeft:2,net:-1}),
    Object.freeze({label:'Balanced',canCross:true,leftToRight:3,rightToLeft:3,net:0})
  ])});
const before = JSON.stringify(context);
const returnWork = Object.freeze({...learn,lesson:3});
assert.equal(change(returnWork,'kind',1,context).kind,1);
for (const bad of [-1,3,'1',NaN,0.5]) assert.equal(change(returnWork,'kind',bad,context),returnWork);
assert.equal(change({...returnWork,lesson:2},'kind',1,context).kind,0);
assert.equal(change(returnWork,'kind',1,null),returnWork);
const zero = model(returnWork,context).copied;
assert.match(zero.stepCaption,/^Starting snapshot:/); assert.match(zero.permission,/did not allow/);
assert.equal(zero.crossingsCaption,'Left to right: 0 crossings. Right to left: 0 crossings.');
assert.equal(zero.netCaption,'Net: 0 markers. No crossings were counted for this marker kind.');
assert.deepEqual(zero.kindOptions.map(k=>k.label),['Kind 1 · Same label','Kind 2 · Same label','Kind 3 · Balanced']);
const selected = {...returnWork,kind:1}; const neg = model(selected,context).copied;
assert.equal(neg.crossingsCaption,'Left to right: 1 crossing. Right to left: 2 crossings.');
assert.equal(neg.netCaption,'Net: 1 marker right to left.');
assert.match(neg.permission,/allowed this kind/);
assert.equal(model({...returnWork,kind:2},context).copied.netCaption,'Net: 0 markers; opposite crossing totals balance.');
assert.equal(model(returnWork,{...context,steps:7}).copied.stepCaption,'Cumulative crossings by step 7.');
assert.equal(model(initial,context).copied,null);
assert.equal(model({...learn,lesson:2},context).copied,null);
assert.equal(model(returnWork,null).copied,null);
assert.equal(model(selected,context).net,model(selected,null).net);
assert.equal(JSON.stringify(context),before);

const buildSpeech = hear(initial,context);
for (const text of [copy.title,copy.story,copy.buildInstruction,copy.modelNote,copy.limitNote,copy.chipKey,copy.pairNote,copy.visitNote]) assert.equal(buildSpeech.split(text).length-1,1);
assert.ok(buildSpeech.includes(trails[0].prompt)); assert.ok(!buildSpeech.includes(trails[1].prompt));
assert.ok(!buildSpeech.includes(copy.copyHeading)); assert.ok(!buildSpeech.includes(cards[1].text));
for (let lesson=0;lesson<4;lesson++) {
  const speech=hear({...learn,lesson},context);
  assert.ok(speech.includes(cards[lesson].text));
  for(let other=0;other<4;other++) if(other!==lesson) assert.ok(!speech.includes(cards[other].text));
  assert.ok(!speech.includes(context.notice)); assert.ok(!speech.includes(copy.buildInstruction));
  assert.equal(speech.split(copy.visitNote).length-1,1);
  assert.equal(speech.includes(copy.copyHeading),lesson===3);
}
const copiedSpeech=hear(selected,context);
for(const text of [copy.copyHeading,copy.copyNote,copy.transferQuestion,neg.crossingsCaption,neg.netCaption]) assert.equal(copiedSpeech.split(text).length-1,1);
assert.ok(!copiedSpeech.includes(zero.netCaption));
const noCopy=hear(returnWork,null);
assert.ok(noCopy.includes(copy.noCopy));
for(const text of [copy.copyHeading,copy.copyNote,copy.transferQuestion,'Run 5','This saved model']) assert.ok(!noCopy.includes(text));
console.log('Leaf Exchange: finite arithmetic, reducer, copy and current narration checks passed.');

// Inspect the emitted decorative geometry: the concrete failure is a diagram
// disagreeing with the adjacent arithmetic, including empty and endpoint rows.
const {leafExchangePage: page} = await import('../dist/leaf-exchange-ui.mjs');
const attrs = tag => Object.fromEntries([...tag.slice(0,tag.indexOf('>')+1).matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
const svgs = html => [...html.matchAll(/<svg\b[^>]*>[\s\S]*?<\/svg>/g)].map(m=>m[0]);
function checkLedger(svg, photo, resp, links, net = null) {
  assert.equal(attrs(svg).viewBox, `0 0 640 ${net === null ? 245 : 330}`);
  assert.equal(attrs(svg)['aria-hidden'],'true');
  const chips=[...svg.matchAll(/<g\b[^>]*data-leaf-exchange-chip="([^"]+)"[^>]*>([\s\S]*?)<\/g>/g)];
  assert.equal(chips.length, photo+resp);
  for (const [row,count,y] of [['photosynthesis',photo,75],['respiration',resp,200]]) {
    const rowChips=chips.filter(c=>c[1]===row); assert.equal(rowChips.length,count);
    rowChips.forEach((c,i)=>{
      const rect=attrs(c[2].match(/<rect\b[^>]*>/)[0]);
      assert.equal(Number(rect.x),38+100*i); assert.equal(Number(rect.y),y-29);
      assert.equal(Number(rect.width),64); assert.equal(Number(rect.height),58);
      const dots=[...c[2].matchAll(/<circle\b[^>]*>/g)].map(m=>attrs(m[0]));
      assert.equal(dots.length,6);
      assert.deepEqual(dots.map(d=>[Number(d.cx),Number(d.cy),Number(d.r)]),[-10,10].flatMap(dy=>[-16,0,16].map(dx=>[70+100*i+dx,y+dy,6])));
    });
  }
  const drawnLinks=[...svg.matchAll(/<line\b[^>]*data-leaf-exchange-link\b[^>]*>/g)].map(m=>attrs(m[0]));
  assert.equal(drawnLinks.length,links);
  drawnLinks.forEach((l,i)=>assert.deepEqual([+l.x1,+l.x2,+l.y1,+l.y2],[70+100*i,70+100*i,104,171]));
  const pins=[...svg.matchAll(/<line\b[^>]*data-leaf-exchange-pin\b[^>]*>/g)].map(m=>attrs(m[0]));
  assert.equal(pins.length,net===null?0:1);
  if(net!==null) {
    assert.deepEqual([+pins[0].x1,+pins[0].x2,+pins[0].y1,+pins[0].y2],[320+7*net,320+7*net,276,294]);
    const ticks=[...svg.matchAll(/<line\b[^>]*class="leaf-exchange-tick"[^>]*>/g)].map(m=>attrs(m[0]));
    assert.deepEqual(ticks.map(t=>+t.x1),Array.from({length:13},(_,i)=>68+42*i));
  }
}
for(let photo=0;photo<=6;photo++) for(let resp=0;resp<=6;resp++) for(const gas of ['oxygen','carbon-dioxide']) {
  const work={...initial,photo,resp,gas,paired:true};
  const rendered=svgs(page(work,null));
  checkLedger(rendered[0],photo,resp,Math.min(photo,resp),(gas==='oxygen'?1:-1)*6*(photo-resp));
  const key=rendered[1]; assert.equal(attrs(key).viewBox,'0 0 80 74');
  assert.deepEqual([+attrs(key).width,+attrs(key).height],[80,74]);
  assert.equal([...key.matchAll(/<circle\b/g)].length,6);
}
checkLedger(svgs(page({...learn,lesson:0},null))[0],1,1,0);
checkLedger(svgs(page({...learn,lesson:1},null))[0],3,1,1,12);
const zeroFigures=svgs(page({...learn,lesson:2},null));
checkLedger(zeroFigures[0],0,0,0);checkLedger(zeroFigures[1],2,2,0);
const tray=svgs(page(returnWork,context))[0];
assert.equal(attrs(tray).viewBox,'0 0 360 120');
const cells=[...tray.matchAll(/<rect\b[^>]*>/g)].map(m=>attrs(m[0]));
assert.equal(cells.length,13);
assert.deepEqual(cells.map(c=>[+c.x,+c.y,+c.width,+c.height]),[8,5].flatMap((n,row)=>Array.from({length:n},(_,i)=>[45+26*i,25+50*row,22,22])));
const copiedPage=page(returnWork,context);
assert.ok(copiedPage.includes('Saved &lt;model&gt;'));assert.ok(!copiedPage.includes('Saved <model>'));
assert.equal(svgs(page(returnWork,null))[0],tray); // copied counts never scale the worked bars
assert.ok(!page(returnWork,null).includes(copy.copyHeading));
console.log('Leaf Exchange: emitted bundle, link, worked-card and number-line geometry checks passed.');
