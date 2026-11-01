// Spec 344 source checks: the six cases on the tray, tray limits, check transitions, unknown support,
// retained-source reading, unreadable isolation, refusals and pure readers.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {rodTraySource as S,ROD_COPY as K} from '../dist/rod-tray-content.mjs';
import * as R from '../dist/rod-tray-core.mjs';
import {rodTrayPage,rodTrayNotes,resetRodTrayView,rodSentenceSpoken,spokenText,trayText} from '../dist/rod-tray-ui.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;};
const yes=()=>true,C=Object.fromEntries(S.cases.map(c=>[c.id,c]));
const tray=(state,id)=>R.rodCaseView(state,id).draft;
const act=(state,id,a,times=1,gate=yes)=>{let r;for(let i=0;i<times;i++)r=R.rodAction(state,id,a,gate);return r;};

// The six cases, worked on the real tray by an independent recipe: build the start, make the move
// (adding zero pairs only when the rods to take away are missing), pair off and count.
eq(S.cases.map(c=>c.id),['cross-down','two-below','pay-off','take-black','take-red','remove-charge']);
const pairsNeeded={},most={};
for(const c of S.cases){
 const s={};act(s,c.id,c.start>=0?'addRed':'addBlack',Math.abs(c.start));let pairs=0,top=0;const peak=()=>{const t=tray(s,c.id);top=Math.max(top,t.red,t.black);};peak();
 const kind=c.operand>=0?'Red':'Black',size=Math.abs(c.operand);
 if(c.op==='add'){act(s,c.id,'add'+kind,size);peak();}
 else{const have=tray(s,c.id)[kind.toLowerCase()];if(have<size){pairs=size-have;act(s,c.id,'addPair',pairs);peak();}act(s,c.id,'take'+kind,size);}
 act(s,c.id,'pairOff');const t=tray(s,c.id),worth=t.red-t.black;
 eq(worth,c.result,c.id+' result on the tray');ok(t.red===0||t.black===0,c.id+' one kind left after pairing');pairsNeeded[c.id]=pairs;most[c.id]=top;
 eq(c.start+(c.op==='add'?c.operand:-c.operand),c.result,c.id+' sentence arithmetic');ok([c.start,c.operand,c.result].every(x=>x>=-12&&x<=12),c.id+' within −12..12');
}
eq(Object.values(pairsNeeded),[0,0,0,3,2,4],'zero pairs needed, as the spec states');eq(Object.values(most),[7,8,10,4,3,6],'most rods of one color, as the spec states');
// Helpers: each step's tray matches its words, and helper answers differ from every case answer.
const helperAnswers={adding:-1,takeNegative:6,takePositive:-4};
for(const [k,h] of Object.entries(S.helpers)){const last=h.steps.at(-1);eq(last.red-last.black,helperAnswers[k],k+' helper answer');ok(!S.cases.some(c=>c.result===helperAnswers[k]),k+' helper answer differs from every case');}
// Zero-pair invariance over all 169 trays.
let states=0;for(let r=0;r<=12;r++)for(let b=0;b<=12;b++){states++;const t={red:r,black:b,answer:null},w=R.trayWorth(t),add=R.applyRodAction(t,'addPair'),off=R.applyRodAction(t,'pairOff');
 if(r<12&&b<12)eq(R.trayWorth(add.tray),w,'adding a zero pair keeps the worth');else eq(add.refused,'full','full tray refuses a pair');
 eq(R.trayWorth(off.tray),w,'pairing off keeps the worth');eq(off.paired,Math.min(r,b));}
eq(states,169);
// Feedback: the explanation for a match, the targeted line for each listed value, the general line otherwise.
for(const c of S.cases){eq(R.rodFeedback(S,c,c.result),c.explanation);for(const f of c.feedback){eq(R.rodFeedback(S,c,f.value),f.line);ok(f.value!==c.result&&f.value>=-12&&f.value<=12,c.id+' targeted value reachable and not the answer');}
 const other=[...Array(25).keys()].map(i=>i-12).find(v=>v!==c.result&&!c.feedback.some(f=>f.value===v));eq(R.rodFeedback(S,c,other),S.lines.nonMatch);}
// The number line arrow and read-aloud sentence.
eq(R.rodMove(C['cross-down']),{from:4,to:-3,delta:-7,through:true});eq(R.rodMove(C['take-black']),{from:1,to:4,delta:3,through:false});eq(R.rodMove(C['remove-charge']).through,true);
eq(rodSentenceSpoken(C['take-black']),'1 take away negative 3');eq(rodSentenceSpoken(C['two-below']),'negative 5 plus negative 3');eq(spokenText('2 − (−4)'),'2 take away negative 4');
eq(trayText({red:1,black:0}),'1 red rod, 0 black rods.');eq(trayText({red:0,black:0}),K.empty);

// Tray controls at both limits; no automatic zero pairs; the stepper at both ends.
{const s={};eq(R.rodAction(s,'two-below','takeRed',yes).code,'no-red');eq(R.rodAction(s,'two-below','takeBlack',yes).code,'no-black');ok(!Object.hasOwn(s,'rodTray'),'a refused action writes nothing');
 eq(R.rodAction(s,'two-below','pairOff',yes),{ok:true,changed:false,code:'no-pairs',paired:0},'pairing an empty tray is a no-op');ok(!Object.hasOwn(s,'rodTray'),'a no-op adds no root');
 act(s,'two-below','addRed',12);eq(R.rodAction(s,'two-below','addRed',yes).code,'full');eq(R.rodAction(s,'two-below','addPair',yes).code,'full');eq(tray(s,'two-below').red,12);
 eq(R.rodAction(s,'two-below','pairOff',yes).code,'no-pairs','one kind only: nothing pairs');act(s,'two-below','addBlack',3);eq(R.rodAction(s,'two-below','pairOff',yes).paired,3);eq(tray(s,'two-below'),{red:9,black:0,answer:null});
 act(s,'two-below','answerDown',30);eq(tray(s,'two-below').answer,-12,'stepper stops at −12');act(s,'two-below','answerUp',40);eq(tray(s,'two-below').answer,12,'stepper stops at 12');
 act(s,'two-below','startAgain');eq(tray(s,'two-below'),{red:0,black:0,answer:12},'Start again empties the tray only');
 eq(Object.keys(s.rodTray),['kind','version','source','drafts','checks','support','teaching']);eq(s.rodTray.source,structuredClone(S),'the root keeps its own copy of the source');eq(tray(s,'cross-down'),{red:0,black:0,answer:null},'other cases untouched');}

// Check transitions: first and latest, count, repeat no-op, help alone counts, no answer refused.
{const s={};act(s,'take-red','addRed');eq(R.rodCheck(s,'take-red',yes).code,'no-answer');act(s,'take-red','answerUp',2);
 eq(R.rodCheck(s,'take-red',yes).code,'changed');let k=R.rodCaseView(s,'take-red').check;eq(k.count,1);eq(k.first,k.latest);eq(k.first.matches,false);eq(k.first.helpBefore,{guided:false,hint:false,helper:false,line:false,teach:{T1:false,T2:false,T3:false,T4:false}});
 eq(R.rodCheck(s,'take-red',yes),{ok:true,changed:false,code:'no-op'},'a repeat press is a no-op');eq(R.rodCaseView(s,'take-red').check.count,1);
 eq(R.rodSupport(s,'take-red','hint',yes).code,'changed');eq(R.rodCheck(s,'take-red',yes).code,'changed','a change in help alone is a new check');k=R.rodCaseView(s,'take-red').check;eq([k.count,k.first.helpBefore.hint,k.latest.helpBefore.hint],[2,false,true]);
 eq(R.rodTeaching(s,'T3',yes).code,'changed');R.rodCheck(s,'take-red',yes);eq(R.rodCaseView(s,'take-red').check.latest.helpBefore.teach.T3,true,'teach exposure is part of the snapshot');
 act(s,'take-red','answerDown',4);act(s,'take-red','addBlack',2);R.rodCheck(s,'take-red',yes);k=R.rodCaseView(s,'take-red').check;eq([k.count,k.latest.answer,k.latest.matches,k.latest.black,k.first.answer],[4,-2,true,2,2],'first never changes');
 eq(R.rodCheck({},'cross-down',yes).code,'no-answer');
 const g={};act(g,'cross-down','answerDown');R.rodCheck(g,'cross-down',yes);eq(R.rodCaseView(g,'cross-down').check.first.helpBefore.guided,true,'case 1 always carries guided steps');
 eq(R.rodSupport(s,'take-red','hint',yes),{ok:true,changed:false,code:'unchanged'},'support flags only turn on');eq(R.rodSupport(s,'take-red','sneak',yes).code,'invalid-choice');eq(R.rodTeaching(s,'T9',yes).code,'invalid-choice');}

// Unknown support and teaching stay null in later snapshots and are never written over.
{const s={};act(s,'pay-off','answerUp');R.rodCheck(s,'pay-off',yes);s.rodTray.support=[{caseId:'pay-off',hint:'yes',helper:false,line:false}];const raw=structuredClone(s.rodTray.support);
 eq(R.rodSupport(s,'pay-off','hint',yes).code,'unreadable');eq(s.rodTray.support,raw,'unreadable support kept raw');
 act(s,'pay-off','answerUp');eq(R.rodCheck(s,'pay-off',yes).code,'changed');const h=R.rodCaseView(s,'pay-off').check.latest.helpBefore;eq([h.hint,h.helper,h.line],[null,null,null],'unknown support is null, not false');
 eq(R.rodSupport(s,'take-black','hint',yes).code,'changed','other cases keep their support');
 s.rodTray.teaching={T1:true,T2:'maybe',T3:false,T4:false};eq(R.rodTeaching(s,'T2',yes).code,'unreadable');eq(R.rodTeaching(s,'T3',yes).code,'changed');act(s,'pay-off','answerUp');R.rodCheck(s,'pay-off',yes);eq(R.rodCaseView(s,'pay-off').check.latest.helpBefore.teach,{T1:true,T2:null,T3:true,T4:false});eq(s.rodTray.teaching.T2,'maybe');
 s.rodTray.teaching='opaque';eq(R.rodTeaching(s,'T1',yes).code,'unreadable');eq(R.rodCaseView(s,'pay-off').teach,{T1:null,T2:null,T3:null,T4:null});eq(R.rodCheck(s,'pay-off',yes).code,'changed','checks still work with unknown teaching');eq(s.rodTray.teaching,'opaque');
 ok(rodTrayNotes(s).includes('T1 unknown'),'Notes say unknown');ok(rodTrayNotes(s).includes('hint unknown'),'Notes say unknown support');}

// Retained source: Notes and return views read the notebook's own copy, never today's catalogue; saved matches are literal.
{const s={};act(s,'take-black','addRed');act(s,'take-black','answerUp',4);R.rodCheck(s,'take-black',yes);
 const c=s.rodTray.source.cases.find(c=>c.id==='take-black');c.title='Earlier title';c.explanation='Earlier explanation.';c.result=2;c.feedback[0].line='Earlier line.';
 const notes=rodTrayNotes(s);ok(notes.includes('Earlier title')&&notes.includes('Earlier explanation.')&&!notes.includes(C['take-black'].explanation),'Notes use the retained wording');
 ok(notes.includes('4, matches'),'the saved matches is literal, never rescored');eq(R.rodCaseView(s,'take-black').check.first.matches,true);
 resetRodTrayView();ok(rodTrayPage(s,'old').includes('Earlier title'),'the page reads the retained source');
 R.rodCheck(s,'take-black',yes);eq(R.rodCaseView(s,'take-black').check.count,1,'same snapshot: no-op');act(s,'take-black','answerDown',2);R.rodCheck(s,'take-black',yes);eq(R.rodCaseView(s,'take-black').check.latest.matches,true,'a new check scores against the retained case');}

// Unreadable entries are isolated; bad roots stay exact and write nothing.
{const s={};act(s,'cross-down','addRed',2);act(s,'two-below','answerUp');R.rodCheck(s,'two-below',yes);s.rodTray.drafts.push({caseId:'pay-off',red:13,black:0,answer:null});s.rodTray.checks.push({caseId:'take-red',first:{},latest:{},count:1},{caseId:'two-below',extra:1});
 const before=structuredClone(s.rodTray);
 eq(R.rodAction(s,'pay-off','addRed',yes).code,'unreadable');eq(R.rodCheck(s,'two-below',yes).code,'unreadable','a duplicate check entry makes that case unreadable');act(s,'take-red','answerUp');eq(R.rodCheck(s,'take-red',yes).code,'unreadable');
 eq(R.rodAction(s,'cross-down','addRed',yes).code,'changed','other cases stay usable');eq(s.rodTray.drafts.find(d=>d.caseId==='pay-off'),before.drafts.find(d=>d.caseId==='pay-off'),'raw draft kept');eq(s.rodTray.checks.slice(1),before.checks.slice(1),'raw checks kept');
 ok(rodTrayNotes(s).includes('Checks: unreadable, kept as saved.'),'Notes mark the unreadable case');
 const e={};act(e,'cross-down','addRed');e.rodTray.drafts[0].future={kept:true};act(e,'cross-down','addRed');eq(e.rodTray.drafts[0].future,{kept:true},'unknown additive fields are kept');
 for(const root of [{kind:'rod-tray',version:2},{kind:'other',version:1},[],{kind:'rod-tray',version:1,source:{id:'x'}},{kind:'rod-tray',version:1,source:{...structuredClone(S),cases:[]}}]){const t={rodTray:structuredClone(root)},b=structuredClone(t);
  for(const w of [()=>R.rodAction(t,'cross-down','addRed',yes),()=>R.rodCheck(t,'cross-down',yes),()=>R.rodSupport(t,'cross-down','hint',yes),()=>R.rodTeaching(t,'T1',yes)])eq(w().ok,false,'no write into '+JSON.stringify(root).slice(0,30));eq(t,b,'bad root stays exact');
  resetRodTrayView();ok(rodTrayPage(t,'bad').includes('data-rt-closed'),'page closes');ok(rodTrayNotes(t).includes('<pre>'),'Notes keep raw');}
 const sec={rodTray:{...structuredClone(before),checks:'opaque'}};eq(R.rodCheck(sec,'cross-down',yes).code,'unreadable');eq(R.rodAction(sec,'cross-down','addRed',yes).code,'changed','a bad checks section leaves drafts usable');eq(sec.rodTray.checks,'opaque');}

// Refused gates write nothing; readers are pure.
for(const gate of [()=>false,()=>{throw Error('x');},undefined]){const s={},b=structuredClone(s);
 for(const w of [()=>R.rodAction(s,'cross-down','addRed',gate),()=>R.rodSupport(s,'cross-down','hint',gate),()=>R.rodTeaching(s,'T1',gate)])eq(w().code,'report-safety');eq(s,b,'refused gate writes nothing');
 const t={};act(t,'cross-down','answerUp');const tb=structuredClone(t);eq(R.rodCheck(t,'cross-down',gate).code,'report-safety');eq(t,tb);}
{const s={};act(s,'cross-down','addBlack',2);act(s,'cross-down','answerDown');R.rodCheck(s,'cross-down',yes);const b=structuredClone(s);R.readRodTray(s);rodTrayNotes(s);resetRodTrayView();rodTrayPage(s,'pure');eq(s,b,'view and Notes write nothing');}
{const s={};resetRodTrayView();const html=rodTrayPage(s,'fresh');ok(!Object.hasOwn(s,'rodTray'),'opening writes nothing');eq(rodTrayNotes(s),'','no Notes before any work');
 ok(html.includes('4 + (−7)')&&html.includes('aria-label="4 plus negative 7"'),'sentence drawn and read aloud');for(const t of Object.values(K.buttons))ok(html.includes(t),'control: '+t);ok(html.includes(K.contrast),'contrast caption');
 eq([...html.matchAll(/data-rt-case="([^"]+)"/g)].map(m=>m[1]),['cross-down','two-below','pay-off','take-black','take-red','remove-charge'],'all six open');ok(/data-rt-check[^>]*disabled/.test(html),'Check waits for an answer');}
// Copy: the companion's lines with a true minus sign and no em-dash.
{const companion=readFileSync(new URL('../docs/content/344-rod-tray-text.md',import.meta.url),'utf8').replace(/[“”]/g,'"').replace(/[‘’]/g,"'");
 const strings=[];const walk=v=>{if(typeof v==='string')strings.push(v);else if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object')Object.values(v).forEach(walk);};
 walk(S.cases.map(c=>[c.title,c.prompt,c.guided,c.hint,c.explanation,c.feedback.map(f=>f.line)]));walk(Object.values(S.helpers).map(h=>h.steps.map(s=>s.text)));walk(Object.values(S.teach).map(t=>[t.title,t.text,t.steps]));walk(S.lines);
 walk(Object.entries(K).filter(([k,v])=>typeof v==='string'&&!['refused','unreadable','unknownVersion','nextStep'].includes(k)).map(([,v])=>v));walk(K.buttons);walk(K.ladder);
 for(const x of strings){ok(companion.includes(x.replace(/[“”]/g,'"').replace(/[‘’]/g,"'")),'from the companion: '+x);ok(!x.includes('—')&&!/(^|[ (])-\d/.test(x),'true minus, no em-dash: '+x);}}
console.log(`Rod Tray: ${n} checks passed (6 cases on the tray, ${states} zero-pair states).`);
