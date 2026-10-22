import assert from 'node:assert/strict';
import {broadItems,ensureBroad,instantiateBroad,familiarity,noteBroadExposure,makeBroadObservation,broadDescribe,beginTrail,recordTrail,trailQuestion} from '../dist/broad-core.mjs';
import {generatedBroad,validBroadParams} from '../dist/broad-variants.mjs';
import {freshState,restoreState} from '../dist/core.mjs';
let checks=0;const check=(x,m)=>{assert.ok(x,m);checks++;};
// Independent answer computation from the saved operands, including choice semantics.
function expected(q){const p=q.params;switch(p.type){
case 'bundle':return p.hundreds*100+p.tens*10+p.ones;
case 'value':return p.tens*10;
case 'tens':return p.hundreds*100+p.tens*10+p.ones+p.add*10;
case 'add':return p.a+p.b;case 'subtract':return p.a-p.b;
case 'group':case 'area':return p.rows*p.cols;case 'share':return p.cols;
case 'packs':return p.rows*p.cols+p.sign*p.extra;
case 'part':return p.shaded*(p.parts*p.size/p.parts);
case 'sequence':{let n=p.start;for(let i=1;i<p.n;i++)n+=p.step;return n;}
case 'corners':return {triangle:3,rectangle:4,square:4,hexagon:6}[p.shape];
case 'symmetry':return {triangle:3,rectangle:2,square:4,hexagon:6}[p.shape];
case 'ribbon':return p.start+p.length-p.start;
case 'perimeter':return 2*p.length+2*p.width;
case 'missingSide':return (2*(p.length+p.width)-2*p.length)/2;
case 'missing':return p.total-p.known;
case 'story':return p.sign===1?p.start+p.first-p.second:p.start-p.first+p.second;
case 'fractionName':return q.choices.indexOf(`One ${{2:'half',3:'third',4:'quarter',5:'fifth'}[p.parts]}`);
case 'shapeName':return q.choices.indexOf({triangle:'equilateral triangle',rectangle:'long rectangle',square:'square',hexagon:'regular hexagon'}[p.shape]);
case 'turn':{let i=0;for(let t=0;t<p.turns;t++)i=(i+p.direction+4)%4;return q.choices.indexOf(['North','East','South','West'][i]);}
case 'claim':return q.choices.indexOf(`An extra dot in each row adds ${p.rows}, making ${p.rows*p.cols+p.rows}.`);
case 'double':return q.choices.indexOf(`Each original row gains a matching row: ${p.rows*p.cols} more dots, making ${2*p.rows*p.cols}.`);
default:throw Error(p.type);
}}
function constraints(q){const p=q.params;check(validBroadParams(p),q.id+' valid params');switch(p.type){
case 'bundle':check(p.hundreds===0&&p.tens>=1&&p.tens<=9&&p.ones>=0&&p.ones<=9,'two digits');break;
case 'value':check(new Set([p.hundreds,p.tens,p.ones]).size===3&&[p.hundreds,p.tens,p.ones].every(x=>x>=1&&x<=9),'unique digits');break;
case 'tens':check(p.add>=1&&p.add<=4&&p.hundreds>=1&&p.hundreds<=7&&p.regroup===(p.tens+p.add>=10),'tens regroup');break;
case 'add':case 'subtract':check(p.type==='add'?p.a+p.b>10&&p.a+p.b<=20:p.a>10&&p.a-p.b<10&&p.a-p.b>=0,'crossing ten');break;
case 'group':case 'share':case 'packs':case 'area':check(p.rows>=2&&p.rows<=9&&p.cols>=2&&p.cols<=9,'factor range');break;
case 'part':check(p.size>=2&&p.size<=9&&(p.parts*p.size)%p.parts===0,'equal fractional shares');break;
case 'sequence':check(p.start>=0&&p.start<=12&&p.step>=2&&p.step<=9&&p.n>=4&&p.n<=7,'sequence range');break;
case 'ribbon':check(p.start>=0&&p.start<=8&&p.length>=3&&p.length<=12&&p.start+p.length<=20,'ribbon bounds');break;
case 'perimeter':case 'missingSide':check(p.length>=2&&p.length<=9&&p.width>=2&&p.width<=9,'rectangle range');break;
case 'missing':check(p.known>=1&&p.total<=20&&p.total>p.known,'missing addend');break;
case 'story':check(p.start+p.sign*p.first>=0&&expected(q)>=0&&expected(q)<50,'story nonnegative');break;
}}
for(const q of broadItems()){
 const s=freshState();ensureBroad(s);const first=instantiateBroad(s,q);check(first.prompt===q.prompt&&first.answer===q.answer&&first.variant===null,'authored first '+q.id);
 const variants=new Set();
 for(let seed=0;seed<1000;seed++){
  const x=generatedBroad(q,seed);check(Number.isInteger(x.answer)&&x.answer>=0&&x.answer===expected(x),'independent answer '+q.id+' '+seed);constraints(x);if(q.params.type==='part'&&q.params.shaded>1)check(x.params.shaded>1,'non-unit fraction remains non-unit');
  if(x.params.type==='symmetry'&&x.params.shape==='triangle')check(x.prompt.includes('equilateral triangle'),'three mirror lines name the equal-sided triangle');
  if(x.params.type==='symmetry'&&x.params.shape==='hexagon')check(x.prompt.includes('regular hexagon'),'six mirror lines name the regular hexagon');
  check(x.solution.includes(x.kind==='choice'?x.choices[x.answer].split(' ')[0]:String(x.answer))||['shapeName','turn','fractionName','claim','double'].includes(x.params.type),'solution '+q.id);
  check(JSON.stringify(x)===JSON.stringify(generatedBroad(q,seed)),'repeatable '+q.id);variants.add(JSON.stringify(x.variant.params)+JSON.stringify(x.choices));
  if(q.lesson&&!['shapeName','symmetry','corners','turn'].includes(x.params.type))check(JSON.stringify(x.model)===JSON.stringify(q.model),'authored Pip example');
  if(x.fact)check(x.facts.some(f=>JSON.stringify(f)===JSON.stringify(x.fact)),'displayed fact retained');
 }
 check(variants.size>1,'varies '+q.id);
 const x=generatedBroad(q,'frozen');s.broad.drafts[`checkin:${q.id}`]={question:x,attempts:[]};const restored=restoreState(JSON.stringify(s));ensureBroad(restored);check(JSON.stringify(instantiateBroad(restored,q))===JSON.stringify(x),'full frozen restore '+q.id);
 noteBroadExposure(s,x,'activity');check(familiarity(s,x).familiar,'same seed familiar');const y=generatedBroad(q,'different');const a={attempts:[y.answer],method:'worked',...familiarity(s,y)};const o=makeBroadObservation(y,a,'checkin');check(o.sameKind&&!o.freshEvidence&&o.independent&&broadDescribe(o).includes('new example'),'same kind conservative');
}
const s=freshState();ensureBroad(s);const paused=generatedBroad(broadItems().find(q=>q.id==='operations-anchor'),'paused');s.broad.drafts['checkin:operations-anchor']={question:paused,attempts:[]};noteBroadExposure(s,{id:'other',fact:[...paused.fact].reverse()},'activity');check(s.broad.drafts['checkin:operations-anchor'].knownFact,'paused exact generated factors');
for(const id of ['number','operations','fractions','patterns','geometry','measurement','reasoning']){const s=freshState();ensureBroad(s);beginTrail(s,id);for(let i=0;i<2;i++){const q=trailQuestion(s,id);recordTrail(s,makeBroadObservation(q,{attempts:[q.answer],method:'worked'},'checkin'));}beginTrail(s,id,true);check(trailQuestion(s,id).id===`${id}-anchor`,'revisit uses fresh anchor');}
{
 // A copy edit must not close a paused question; a changed answer or number still does.
 const item=broadItems().find(q=>q.kind==='number')||broadItems()[0];
 const fresh=()=>{const s=freshState();const b=ensureBroad(s);const q=instantiateBroad(s,item,'checkin');b.drafts[`checkin:${item.id}`]={attempts:[],question:q};return {s,q};};
 const reload=s=>{const r=restoreState(JSON.stringify(s));ensureBroad(r);return r;};
 {const {s,q}=fresh();const d=s.broad.drafts[`checkin:${item.id}`];d.question.prompt='Earlier prompt wording';d.question.hint='Earlier hint';const r=reload(s);
  check(r.broad.drafts[`checkin:${item.id}`],'earlier wording keeps the paused question open');check(instantiateBroad(r,item,'checkin').prompt==='Earlier prompt wording','resumed question keeps its own wording');check(!r.broad.draftNotice,'no closed-question notice for a copy edit');}
 {const {s}=fresh();const d=s.broad.drafts[`checkin:${item.id}`];d.question.answer=typeof d.question.answer==='number'?d.question.answer+1:'changed';const r=reload(s);
  check(!r.broad.drafts[`checkin:${item.id}`]&&r.broad.closedDrafts.length===1,'a changed answer still closes the paused question and keeps it');}
 {const {s}=fresh();delete s.broad.drafts[`checkin:${item.id}`].question.prompt;const r=reload(s);
  check(!r.broad.drafts[`checkin:${item.id}`],'a saved question missing its prompt is not resumed');}
 {const {s}=fresh();const d=s.broad.drafts[`checkin:${item.id}`];d.question.title='  ';const r=reload(s);
  check(!r.broad.drafts[`checkin:${item.id}`],'a saved question with a blank title is not resumed');}
 {const {s}=fresh();const d=s.broad.drafts[`checkin:${item.id}`];delete d.question.talk;d.question.wonder='An extra earlier wording field';const r=reload(s);
  check(r.broad.drafts[`checkin:${item.id}`],'adding or dropping an optional wording field keeps the paused question open');}
 {const {s}=fresh();s.broad.drafts[`checkin:${item.id}`].question.prompt={toString:null};const r=reload(s);
  check(!r.broad.drafts[`checkin:${item.id}`],'non-text wording is not resumed');}
 {const choiceItem=broadItems().find(q=>Array.isArray(q.choices)&&q.choices.length>1);const s=freshState();const b=ensureBroad(s);const q=instantiateBroad(s,choiceItem,'checkin');q.choices[0]='  ';b.drafts[`checkin:${choiceItem.id}`]={attempts:[],question:q};const r=reload(s);
  check(!r.broad.drafts[`checkin:${choiceItem.id}`],'a saved question with a blank answer choice is not resumed');}
 {const choiceItem=broadItems().find(q=>q.id==='fractions-foundation'),key=`checkin:${choiceItem.id}`;
  const freshChoice=()=>{const s=freshState();ensureBroad(s);const q=instantiateBroad(s,choiceItem,'checkin');s.broad.drafts[key]={question:q,attempts:[q.answer],input:'kept choice'};return {s,q};};
  {const {s,q}=freshChoice(),r=reload(s);check(r.broad.drafts[key]?.question.choices[q.answer]===q.choices[q.answer]&&!r.broad.draftNotice,'unchanged choice mapping resumes');}
  {const {s,q}=freshChoice();q.prompt='Earlier question wording';const r=reload(s);
   check(r.broad.drafts[key]?.question.prompt==='Earlier question wording'&&!r.broad.draftNotice,'valid choice mapping survives a prompt edit');}
  for(const change of ['swap','duplicate']){const {s,q}=freshChoice(),other=q.choices.findIndex((_,i)=>i!==q.answer);
   if(change==='swap')[q.choices[q.answer],q.choices[other]]=[q.choices[other],q.choices[q.answer]];
   else q.choices[other]=q.choices[q.answer];
   const original=structuredClone(s.broad.drafts[key]),r=reload(s);
   check(!r.broad.drafts[key]&&r.broad.closedDrafts.length===1&&r.broad.draftNotice,`${change} choices close the unsafe draft`);
   assert.deepEqual(r.broad.closedDrafts[0],{key,draft:original});checks++;
  }
 }
}
console.log(`${checks} Number Garden variant checks passed.`);
