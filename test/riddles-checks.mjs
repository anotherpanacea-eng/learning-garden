import assert from 'node:assert/strict';
import {riddles,riddleSizes,riddlePlaces,ownRiddle} from '../dist/riddles-content.mjs';
import {riddleState,riddleView,validRiddles,validRiddleSource,validRiddleCurrent,openRiddle,poolFor,chooseSize,nextRiddle,replaceRawRiddle,pickChoice,askClue,showAnswer,riddleSummary,commitRiddles} from '../dist/riddles-core.mjs';
import {riddlesPage,riddlesNotes} from '../dist/riddles-ui.mjs';
import {freshState,restoreStateResult} from '../dist/core.mjs';
import {prepareProgressImport,initializeExplorerState,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';

const copy=structuredClone,seeded=(seed=7)=>()=>(seed=(seed*16807)%2147483647)/2147483647;
const byId=id=>riddles.find(r=>r.id===id);
const report=s=>JSON.stringify({title:'After the Storm: observations',exportedAt:'2026-10-22T00:00:00.000Z',note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'dot',color:'green',symbol:'leaf'},recommendation:'Try another garden activity.',...s},null,2);
const actualExport=s=>prepareProgressImport(report(s)).ok;

assert.equal(new Set(riddles.map(r=>r.id)).size,riddles.length);
for(const r of riddles){
 assert.ok(['sprout','seedling','sapling'].includes(r.band),r.id);
 assert.equal(r.choices.length,3,r.id);assert.equal(new Set(r.choices.map(c=>c.code)).size,3,r.id);
 assert.equal(r.choices.filter(c=>c.code===r.answer).length,1,r.id);
 for(const c of r.choices)assert.equal(c.code===r.answer?c.nudge===null:typeof c.nudge==='string'&&c.nudge.length>0,true,`${r.id}:${c.code}`);
 assert.ok(riddlePlaces[r.place],r.id);
}
for(const band of ['sprout','seedling','sapling'])assert.ok(poolFor(band).length>=5,band);
assert.doesNotMatch(JSON.stringify([riddles,riddleSizes,riddlePlaces,ownRiddle]),/—/);
assert.match(byId('rain').clue,/gray/);assert.match(byId('map').prompt,/one folded sheet/);
assert.match(byId('caterpillar').prompt,/butterfly emerges/);assert.doesNotMatch(byId('caterpillar').prompt,/as a butterfly caterpillar/);

// Viewing and hearing the invitation do not create a root.
{
 const s=freshState(),before=copy(s);assert.match(riddlesPage(s),/Pull out a riddle/);
 assert.equal(riddlesNotes(s),'');assert.equal(openRiddle(s),null);assert.deepEqual(s,before);
}

// A pulled card owns its whole source and order, including after reload or an authored-pack change.
{
 const s=freshState();assert.equal(nextRiddle(s,seeded()),riddles[0].id);
 const c=s.riddles.current;assert.ok(validRiddleCurrent(c));assert.ok(validRiddleSource(c.source));
 assert.deepEqual([...c.order].sort(),riddles[0].choices.map(x=>x.code).sort());
 assert.deepEqual(s.riddles.met,[riddles[0].id]);
 const restored=restoreStateResult(JSON.stringify(s)).state;assert.deepEqual(restored.riddles.current,c);
 assert.equal(riddlesPage(restored),riddlesPage(s));
 const shown=[...riddlesPage(s).matchAll(/data-riddle-choice="([^"]+)"/g)].map(m=>m[1]);assert.deepEqual(shown,c.order);
 const alternate=copy(restored);alternate.riddles.current.source.prompt='Earlier private wording, still here?';
 alternate.riddles.current.source.choices.find(x=>x.code===c.source.answer).text='An earlier answer';
 alternate.riddles.current.source.why='This earlier answer fits its own clue.';
 alternate.riddles.current.source.place={href:'#words',label:'Visit an earlier place'};
 assert.ok(validRiddleCurrent(alternate.riddles.current));assert.match(riddlesPage(alternate),/Earlier private wording/);
 assert.match(riddlesPage(alternate),/An earlier answer/);assert.doesNotMatch(riddlesPage(alternate),/I fall from the clouds/);
 assert.deepEqual(pickChoice(alternate,c.source.answer),{fits:true});
 assert.match(riddlesPage(alternate),/This earlier answer fits its own clue/);
 assert.match(riddlesPage(alternate),/Visit an earlier place/);
 assert.deepEqual(prepareProgressImport(report(alternate)).state.riddles,alternate.riddles);
}

// Fit positions vary, while a miss, clue, answer and log transition remain distinct.
{
 const s=freshState(),slots=new Set(),random=seeded(11);
 for(let i=0;i<riddles.length;i++){nextRiddle(s,random);const c=s.riddles.current;slots.add(c.order.indexOf(c.source.answer));}
 assert.equal(slots.size,3);
}
{
 const s=freshState();nextRiddle(s,seeded());const card=riddles[0],wrong=card.choices.find(c=>c.code!==card.answer);
 assert.deepEqual(pickChoice(s,wrong.code),{fits:false});
 assert.ok(riddlesPage(s).includes(wrong.nudge.replaceAll("'",'&#39;')));assert.match(riddlesPage(s),/not this one/);
 assert.equal(pickChoice(s,wrong.code),false);assert.equal(pickChoice(s,'not-a-choice'),false);
 assert.deepEqual(pickChoice(s,card.answer),{fits:true});assert.equal(s.riddles.current.outcome,'solved');
 assert.equal(s.riddles.log.length,0,'a completed current is not logged yet');
 assert.equal(riddleSummary(s.riddles).later,1,'completed current counts once');
 assert.match(riddlesPage(s),/Rain is water falling/);
 const done=copy(s);assert.equal(pickChoice(s,card.answer),false);assert.equal(askClue(s),false);assert.equal(showAnswer(s),false);assert.deepEqual(s,done);
 nextRiddle(s,seeded());assert.equal(s.riddles.log.length,1);assert.deepEqual(s.riddles.log[0].source,done.riddles.current.source);
 assert.deepEqual(s.riddles.log[0].picks,done.riddles.current.picks);assert.equal(s.riddles.log[0].tries,2);
 assert.equal(riddleSummary(s.riddles).later,1,'transition does not count twice');
}
{
 const s=initializeExplorerState(freshState()),random=seeded(3);
 nextRiddle(s,random);assert.equal(askClue(s),true);assert.match(riddlesPage(s),/Look up on a gray day/);pickChoice(s,riddles[0].answer);
 nextRiddle(s,random);pickChoice(s,riddles[1].answer);
 nextRiddle(s,random);assert.equal(showAnswer(s),true);assert.match(riddlesPage(s),/Here is the answer/);
 nextRiddle(s,random);nextRiddle(s,random);
 assert.deepEqual(riddleSummary(s.riddles),{met:5,first:1,later:0,clue:1,shown:1,skipped:1,legacy:0,unavailable:0});
 assert.match(destinationNotes(s),/Found after Dot’s clue: 1\. Answer shown: 1\. Moved on before finishing: 1\./);
 assert.ok(validRiddles(s.riddles));
}

// Band choice narrows the pool without replacing the currently owned source.
{
 const s=freshState(),random=seeded(5);assert.equal(chooseSize(s,'sapling'),true);assert.equal(chooseSize(s,'tiny'),false);
 const pool=poolFor('sapling').map(r=>r.id),seen=[];
 for(let i=0;i<pool.length;i++)seen.push(nextRiddle(s,random));
 assert.deepEqual(seen,pool);assert.equal(nextRiddle(s,random),pool[0]);
 const open=copy(s.riddles.current);chooseSize(s,'sprout');assert.deepEqual(s.riddles.current,open);
 assert.equal(byId(nextRiddle(s,random)).band,'sprout');
}

// Mixed historical siblings stay in place; a legacy code-only current never inherits today's answer.
{
 const s=freshState();nextRiddle(s,seeded());const frozen=copy(s.riddles.current);
 pickChoice(s,frozen.source.answer);nextRiddle(s,seeded());
 const historical=copy(s.riddles.log[0]);s.riddles.log.push({id:'rain',tries:1,clue:false,outcome:'solved'},{future:'raw'});
 s.riddles.met.push({future:'met'});s.riddles.current={id:'rain',order:frozen.order,picks:[],clue:false,outcome:null};
 const before=copy(s),view=riddleView(s);assert.equal(view.unavailableCurrent,true);assert.equal(view.logs.length,2);
 assert.match(riddlesPage(s),/earlier riddle card is unavailable/);assert.doesNotMatch(riddlesPage(s),/I fall from the clouds/);
 assert.equal(pickChoice(s,'rain'),false);assert.equal(nextRiddle(s),false);assert.deepEqual(s,before);
 assert.deepEqual(riddleSummary(s.riddles),{met:2,first:2,later:0,clue:0,shown:0,skipped:0,legacy:1,unavailable:3});
 assert.match(riddlesNotes(s),/earlier code-only round/);
 assert.deepEqual(prepareProgressImport(report(s)).state.riddles,before.riddles);
 assert.ok(replaceRawRiddle(s,seeded()));assert.deepEqual(s.riddles.retainedRawCurrent[0],before.riddles.current);
 assert.deepEqual(s.riddles.log,[historical,{id:'rain',tries:1,clue:false,outcome:'solved'},{future:'raw'}]);
 assert.deepEqual(s.riddles.met.slice(0,-1),before.riddles.met);
}

// Unsupported root pauses only Riddles and remains exactly downloadable.
for(const raw of [{version:2},[],'text']){
 const s=freshState();s.riddles=copy(raw);const before=copy(s);
 assert.equal(riddleState(s),null);assert.match(riddlesPage(s),/cannot read/);assert.match(riddlesNotes(s),/kept unchanged/);
 assert.equal(nextRiddle(s),false);assert.equal(chooseSize(s,'any'),false);assert.deepEqual(s,before);
 const preview=prepareProgressImport(report(s));assert.equal(preview.ok,true);assert.deepEqual(preview.state.riddles,raw);
}

// A full real report is the boundary: rejected mutations leave every byte of work intact.
{
 const s=freshState();nextRiddle(s,seeded());const huge='x'.repeat(1024);
 s.extra=huge.repeat(5000);while(!actualExport(s))s.extra=s.extra.slice(0,-1024);
 s.extra+='x'.repeat(MAX_IMPORT_BYTES-new TextEncoder().encode(report(s)).length-2);
 const wrong=s.riddles.current.order.find(x=>x!==s.riddles.current.source.answer);
 const before=copy(s),result=commitRiddles(s,c=>pickChoice(c,wrong),actualExport);
 assert.equal(result,false);assert.deepEqual(s,before);assert.equal(actualExport(s),true);
 const larger=copy(s);delete larger.extra;assert.deepEqual(commitRiddles(larger,c=>pickChoice(c,wrong),actualExport),{fits:false});
 assert.equal(prepareProgressImport(report(larger)).ok,true);
}
console.log('Riddles in the Hedge checks passed.');
