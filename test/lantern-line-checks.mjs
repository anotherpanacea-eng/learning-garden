import assert from 'node:assert/strict';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {lanternCases} from '../dist/lantern-line-content.mjs';
import {validLanternSource,lanternView,startLantern,recoverLantern,editLantern,supportLantern,checkLantern,keepLantern,lanternResult} from '../dist/lantern-line-core.mjs';
import {lanternPage,lanternNotes} from '../dist/lantern-line-ui.mjs';
import {chooseTrailCase,startTrailFlag,moveTrailFlag,keepTrail} from '../dist/fraction-trail-core.mjs';
const clone=structuredClone,json=JSON.stringify,fresh=()=>initializeExplorerState(freshState());let checks=0;
const ok=(x,m)=>{assert.ok(x,m);checks++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
const report=s=>JSON.stringify({title:'Synthetic notes',exportedAt:'2026-10-22T19:00:00Z',note:'Synthetic model practice',...s},null,2),fits=s=>prepareProgressImport(report(s)).ok;
const set=(s,key,index)=>{editLantern(s,'zero',key);for(let i=0;i<index;i++)editLantern(s,'move',key,1);};
let combinations=0;const fitting=[];
for(const source of lanternCases){
 ok(validLanternSource(source),'authored source admitted');const [a,b]=source.markers;
 const as=[null,...Array.from({length:a.denominator+1},(_,i)=>i)],bs=[null,...Array.from({length:b.denominator+1},(_,i)=>i)];
 for(const ai of as)for(const bi of bs)for(const choice of [null,'first','same','second']){
  const snap={source,indices:{[a.id]:ai,[b.id]:bi},choice,guide:null,support:[]};
  const ax=ai===null?null:12*ai/a.denominator,bx=bi===null?null:12*bi/b.denominator;
  const expected=ax===null||bx===null?null:ax===bx?'same':ax>bx?'first':'second',r=lanternResult(snap);
  eq(r,{placement:[ai===null?null:ai===a.numerator,bi===null?null:bi===b.numerator],relation:expected,orderMatches:expected===null||choice===null?null:choice===expected},'independent integer-coordinate oracle');combinations++;
 }
 fitting.push(12*a.numerator/a.denominator===12*b.numerator/b.denominator?'same':a.numerator/a.denominator>b.numerator/b.denominator?'first':'second');
}
eq(combinations,792,'all bounded and absent positions/choices enumerated');eq(fitting.filter(x=>x==='first').length,2,'two first-fitting requests');eq(fitting.filter(x=>x==='same').length,2,'two equal requests');eq(fitting.filter(x=>x==='second').length,2,'two second-fitting requests');
{
 const s=fresh(),before=json(s);lanternPage(s);lanternNotes(s);eq(json(s),before,'chooser render allocates nothing');ok(startLantern(s,'smaller-parts',fits),'explicit start');
 ok(checkLantern(s,fits),'blank work can be checked');eq(lanternView(s).feedback.result,{placement:[null,null],relation:null,orderMatches:null},'absent points are unobserved');
 set(s,'amber',1);set(s,'blue',0);editLantern(s,'choice',null,'first');ok(checkLantern(s,fits),'actual comparison check');eq(lanternView(s).feedback.result,{placement:[true,false],relation:'first',orderMatches:true},'wrong placement with correct actual order is distinct');
 const old=clone(lanternView(s).feedback);ok(keepLantern(s,false,fits),'keep own checked picture');const kept=json(lanternView(s).kept);
 editLantern(s,'guide',null,'amber');ok(!lanternView(s).feedback&&lanternView(s).work.support.includes('guides'),'guide is support and makes latest check earlier');eq(lanternView(s).work.checks.at(-1),old,'source result retained');
 for(let i=0;i<6;i++)checkLantern(s,fits);eq(lanternView(s).readableChecks.length,4,'recent check window rolls');eq(json(lanternView(s).kept),kept,'kept copy independent of rollover');
 const w=lanternView(s).work;w.kept.check.snapshot.indices=Object.fromEntries(Object.entries(w.kept.check.snapshot.indices).reverse());ok(!lanternView(s).keptUnreadable,'key order is not work identity');ok(!keepLantern(s,false,fits)&&keepLantern(s,true,fits),'kept replacement explicit');
 const beforeGuides=clone(lanternView(s).work.indices);editLantern(s,'guide',null,'blue');eq(lanternView(s).work.indices,beforeGuides,'changing guides never moves points');
 editLantern(s,'page',null,'compare');checkLantern(s,fits);const id=lanternView(s).feedback.id;editLantern(s,'page',null,'place');eq(lanternView(s).feedback.id,id,'page-only change retains applicable check');
 supportLantern(s,'together',fits);ok(!lanternView(s).feedback&&lanternView(s).work.support.includes('together'),'support is distinct from current verdict');
 const imported=prepareProgressImport(report(s));ok(imported.ok,'actual import accepts local optional root');eq(imported.state.lanternLine,s.lanternLine,'current/kept/checks roundtrip');
 const sourceTitle=lanternCases[0].title;try{lanternCases[0].title='Changed author words';ok(lanternPage(s).includes('Smaller parts'),'saved wording stays its own');}finally{lanternCases[0].title=sourceTitle;}
}
{
 const s=fresh();startLantern(s,'same-place');set(s,'amber',2);set(s,'blue',1);editLantern(s,'choice',null,'same');checkLantern(s);eq(lanternView(s).feedback.result,{placement:[true,true],relation:'same',orderMatches:true},'equivalent fractions meet');const html=lanternPage(s);eq((html.match(/<figure[\s\S]*?<\/figure>/)[0].match(/data-tick="6"/g)||[]).length,2,'coincident markers share exact tick');
 const indices=clone(lanternView(s).work.indices);ok(!editLantern(s,'move','amber',99),'invalid step refused');eq(lanternView(s).work.indices,indices,'invalid step atomic');set(s,'amber',4);ok(!editLantern(s,'move','amber',1),'whole endpoint refuses overshoot');
}
{
 const s=fresh();startLantern(s,'same-parts');const w=lanternView(s).work;
 w.source.id='retired-walk';w.source.title='Earlier & walk';w.source.markers[0].id='old-a';w.source.markers[0].label='Earlier & first';w.source.markers[1].id='old-b';w.indices={'old-a':1,'old-b':2};s.lanternLine.cases={'retired-walk':w};s.lanternLine.current='retired-walk';
 ok(lanternView(s).work&&lanternPage(s).includes('Earlier &amp; first'),'retired IDs and escaped own labels remain playable');checkLantern(s);ok(prepareProgressImport(report(s)).ok,'retired source imports');
 s.lanternLine.cases['same-parts']=false;ok(!startLantern(s,'same-parts'),'occupied unreadable case not overwritten');ok(startLantern(s,'same-place'),'unrelated request remains open');eq(s.lanternLine.cases['same-parts'],false,'raw sibling unchanged');
}
{
 const s=fresh();startLantern(s,'smaller-parts');checkLantern(s);const w=lanternView(s).work;w.checks.push({id:900,future:'raw'});w.kept={future:true};const raw=clone(w.checks[1]);
 ok(lanternView(s).keptUnreadable&&!keepLantern(s,true,fits),'unreadable kept cannot be overwritten');ok(checkLantern(s,fits),'readable work continues beside raw siblings');eq(lanternView(s).work.checks[1],raw,'raw sibling keeps relative place');eq(lanternView(s).work.checks.at(-1).id,901,'new ID exceeds occupied unreadable ID');
 const original=clone(s.lanternLine);ok(recoverLantern(s,fits),'confirmed recovery can retain whole old root');eq(s.lanternLine.retainedRaw,original,'whole retained root including checks/kept');
 startLantern(s,'smaller-parts');lanternView(s).work.checks.push({id:Number.MAX_SAFE_INTEGER,future:true});const before=json(s);ok(!checkLantern(s,fits)&&json(s)===before,'occupied safe integer exhaustion refuses atomically');
}
for(const raw of [null,false,{version:2,future:'untouched'}]){
 const s=fresh();s.lanternLine=raw;const before=json(s);ok(prepareProgressImport(report(s)).ok&&lanternView(s).status==='recovery','future raw root survives actual importer');lanternPage(s);eq(json(s),before,'recovery display read only');ok(recoverLantern(s,fits)&&json(s.lanternLine.retainedRaw)===json(raw),'explicit recovery retains unknown root');
}
function atCap(s){s.padding='x';const size=new TextEncoder().encode(report(s)).length;s.padding='x'.repeat(MAX_IMPORT_BYTES-size);ok(fits(s),'synthetic complete report fits exact byte limit');}
{
 const blank=fresh();atCap(blank);const before=json(blank);ok(!startLantern(blank,'same-place',fits)&&json(blank)===before,'new allocation preflight atomic');
 const s=fresh();startLantern(s,'smaller-parts');atCap(s);const old=json(s);for(const [name,fn] of [['check',()=>checkLantern(s,fits)],['Keep',()=>keepLantern(s,false,fits)],['support',()=>supportLantern(s,'help',fits)],['choice',()=>editLantern(s,'choice',null,'first',fits)],['guide',()=>editLantern(s,'guide',null,'amber',fits)],['recovery',()=>recoverLantern(s,fits)]])ok(!fn()&&json(s)===old,`${name} actual formatted report refusal is atomic`);
 const deep=fresh();deep.lanternLine={raw:{}};let node=deep.lanternLine;for(let i=0;i<59;i++)node.next=node={};ok(fits(deep),'deep raw original imports');const raw=json(deep.lanternLine);ok(!recoverLantern(deep,fits)&&json(deep.lanternLine)===raw,'retained depth preflight atomic');
}
{
 const s=fresh();chooseTrailCase(s,'quarter-stop');startTrailFlag(s);moveTrailFlag(s,1);keepTrail(s);const old=json(s.fractionTrail);startLantern(s,'smaller-parts');set(s,'amber',1);checkLantern(s);keepLantern(s);eq(json(s.fractionTrail),old,'existing ribbon controls/kept work unchanged');
 const before=json(s.lanternLine);lanternNotes(s);eq(json(s.lanternLine),before,'notes never mutate own-source records');
}
console.log(`${checks} Lantern Line checks passed, including ${combinations} independent rational position/choice cases.`);
