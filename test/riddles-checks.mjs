import assert from 'node:assert/strict';
import {riddles,riddleSizes,riddlePlaces,ownRiddle} from '../dist/riddles-content.mjs';
import {riddleState,validRiddles,openRiddle,poolFor,chooseSize,nextRiddle,pickChoice,askClue,showAnswer,riddleSummary} from '../dist/riddles-core.mjs';
import {riddlesPage,riddlesNotes} from '../dist/riddles-ui.mjs';
import {freshState,restoreStateResult} from '../dist/core.mjs';
import {prepareProgressImport,initializeExplorerState} from '../dist/progress-transfer.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';

const copy=x=>structuredClone(x);
// A repeatable sequence stands in for Math.random.
const seeded=(seed=7)=>()=>(seed=(seed*16807)%2147483647)/2147483647;

// Every card has exactly one fitting choice and a reason for each other choice.
assert.equal(new Set(riddles.map(r=>r.id)).size,riddles.length);
for(const r of riddles){
 assert.ok(['sprout','seedling','sapling'].includes(r.band),r.id);
 assert.equal(r.choices.length,3,r.id);assert.equal(new Set(r.choices.map(c=>c.code)).size,3,r.id);
 assert.equal(r.choices.filter(c=>c.code===r.answer).length,1,r.id);
 for(const c of r.choices)assert.equal(c.code===r.answer?c.nudge===null:typeof c.nudge==='string'&&c.nudge.length>0,true,`${r.id}:${c.code}`);
 assert.ok(riddlePlaces[r.place],r.id);
}
for(const band of ['sprout','seedling','sapling'])assert.ok(poolFor(band).length>=5,band);
const copyText=JSON.stringify([riddles,riddleSizes,riddlePlaces,ownRiddle]);
assert.doesNotMatch(copyText,/—/,'kid-facing copy has no em-dashes');

// Viewing never creates saved work.
{
 const s=freshState(),before=copy(s);
 assert.match(riddlesPage(s),/Pull out a riddle/);assert.equal(riddlesNotes(s),'');assert.equal(openRiddle(s),null);
 assert.deepEqual(s,before);
}

// A pulled card keeps its saved order through reload, and reload renders the same page.
{
 const s=freshState();assert.equal(nextRiddle(s,seeded()),riddles[0].id);
 const c=s.riddles.current;assert.deepEqual([...c.order].sort(),riddles[0].choices.map(x=>x.code).sort());
 assert.deepEqual(s.riddles.met,[riddles[0].id]);
 const restored=restoreStateResult(JSON.stringify(s)).state;
 assert.deepEqual(restored.riddles.current.order,c.order);assert.equal(riddlesPage(restored),riddlesPage(s));
 const shown=[...riddlesPage(s).matchAll(/data-riddle-choice="([^"]+)"/g)].map(m=>m[1]);assert.deepEqual(shown,c.order,'buttons follow saved order');
}

// The fitting choice does not sit in one position across cards.
{
 const s=freshState(),slots=new Set(),random=seeded(11);
 for(let i=0;i<riddles.length;i++){nextRiddle(s,random);const c=s.riddles.current;slots.add(c.order.indexOf(riddleById(c.id).answer));}
 assert.equal(slots.size,3);
}

// A miss keeps its nudge and stays unpickable; the fitting pick solves and logs once.
{
 const s=freshState();nextRiddle(s,seeded());const card=riddles[0],wrong=card.choices.find(c=>c.code!==card.answer);
 assert.deepEqual(pickChoice(s,wrong.code),{fits:false});
 const page=riddlesPage(s);assert.ok(page.includes(wrong.nudge.replaceAll("'",'&#39;')));assert.match(page,/not this one/);
 assert.equal(pickChoice(s,wrong.code),false,'a tried choice cannot be picked again');
 assert.equal(pickChoice(s,'not-a-choice'),false);
 assert.deepEqual(pickChoice(s,card.answer),{fits:true});
 assert.equal(s.riddles.current.outcome,'solved');assert.deepEqual(s.riddles.log,[{id:card.id,tries:2,clue:false,outcome:'solved'}]);
 assert.ok(riddlesPage(s).includes(card.why));assert.match(riddlesPage(s),new RegExp(riddlePlaces[card.place].href));
 const done=copy(s);assert.equal(pickChoice(s,card.answer),false);assert.equal(askClue(s),false);assert.equal(showAnswer(s),false);assert.deepEqual(s,done,'a finished card is read-only');
}

// Clue, shown answer and moving on are recorded as different outcomes.
{
 const s=initializeExplorerState(freshState()),random=seeded(3);
 nextRiddle(s,random);assert.equal(askClue(s),true);assert.ok(riddlesPage(s).includes(riddles[0].clue));pickChoice(s,riddles[0].answer);
 nextRiddle(s,random);pickChoice(s,riddles[1].answer);
 nextRiddle(s,random);assert.equal(showAnswer(s),true);assert.match(riddlesPage(s),/Here is the answer/);
 nextRiddle(s,random);nextRiddle(s,random);
 assert.deepEqual(riddleSummary(s.riddles),{met:5,first:1,later:0,clue:1,shown:1,skipped:1});
 assert.match(destinationNotes(s),/Found after Dot’s clue: 1\. Answer shown: 1\. Moved on before finishing: 1\./);
 assert.ok(validRiddles(s.riddles));
}

// Card choice narrows the pool, unmet cards come first, then the rotation repeats.
{
 const s=freshState(),random=seeded(5);assert.equal(chooseSize(s,'sapling'),true);assert.equal(chooseSize(s,'tiny'),false);
 const pool=poolFor('sapling').map(r=>r.id),seen=[];
 for(let i=0;i<pool.length;i++)seen.push(nextRiddle(s,random));
 assert.deepEqual(seen,pool);assert.equal(nextRiddle(s,random),pool[0],'rotation wraps after every card is met');
 const open=copy(s.riddles.current);chooseSize(s,'sprout');assert.deepEqual(s.riddles.current,open,'changing cards keeps the card that is out');
 assert.equal(riddleById(nextRiddle(s,random)).band,'sprout');
}

// Saved work that today's cards cannot show is kept, and play can continue.
{
 const s=freshState();nextRiddle(s,seeded());s.riddles.current.id='old-card';s.riddles.met.push('old-card');
 assert.ok(validRiddles(s.riddles),'unknown ids are not checked against today’s cards');
 const before=copy(s);assert.match(riddlesPage(s),/blown away/);assert.equal(pickChoice(s,'rain'),false);assert.deepEqual(s,before);
 assert.match(riddlesNotes(s),/Different riddle cards pulled out: 2/);
 assert.ok(nextRiddle(s,seeded()));assert.equal(s.riddles.log.at(-1).id,'old-card');
}
for(const raw of [{version:2},[],'text',{version:1,size:'any',met:[],current:{id:'rain',order:['rain'],picks:[],clue:false,outcome:null},log:[]}]){
 const s=freshState();s.riddles=copy(raw);const before=copy(s);
 assert.equal(riddleState(s),null);assert.match(riddlesPage(s),/cannot read/);assert.match(riddlesNotes(s),/kept unchanged/);
 assert.equal(nextRiddle(s),false);assert.equal(chooseSize(s,'any'),false);assert.deepEqual(s,before,'unreadable riddle work is never replaced');
 const preview=prepareProgressImport(JSON.stringify({title:'synthetic',...s}));assert.equal(preview.ok,true,'other destinations stay importable');assert.deepEqual(preview.state.riddles,raw);
}
{
 const s=freshState();nextRiddle(s,seeded());pickChoice(s,riddles[0].answer);
 const preview=prepareProgressImport(JSON.stringify({title:'synthetic',...s}));assert.equal(preview.ok,true);assert.deepEqual(preview.state.riddles,s.riddles);assert.ok(preview.summary.destinations.includes('Riddles in the Hedge'));
}

function riddleById(id){return riddles.find(r=>r.id===id);}
console.log('Riddles in the Hedge checks passed.');
