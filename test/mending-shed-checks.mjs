// Spec 332: Mending Shed rules, saved evidence, drift, validation and real Notes preflight.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {readFileSync} from 'node:fs';
import {MAX_IMPORT_BYTES} from '../dist/progress-limits.mjs';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import * as K from '../dist/mending-shed-content.mjs';
import * as M from '../dist/mending-shed-core.mjs';
import {mendingShedPage,mendingShedNotes} from '../dist/mending-shed-ui.mjs';
const clone=structuredClone;
const report=s=>({title:'After the Storm: observations',note:'Synthetic Mending Shed checks.',exportedAt:'2026-10-31T12:00:00.000Z',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:{reason:'Synthetic report'},...s});
const canExport=s=>prepareProgressImport(JSON.stringify(report(s),null,2)).ok;
const options={canExport},fresh=()=>initializeExplorerState(freshState());
// The copy sheet's table, written out independently of the content module.
const sheet={
 'wooden-bucket':['bucket',['wood'],['metal'],'sack bucket wood plastic metal glass'],
 'metal-bucket':['bucket',['metal'],[],'bucket spoon wood plastic metal glass'],
 'plastic-bucket':['bucket',['plastic'],[],'basket bucket metal plastic wood cloth'],
 lantern:['lantern',['metal','glass','cotton'],[],'lantern window-pane plastic metal wood glass cotton'],
 sack:['sack',['sacking'],[],'mailbag sack plastic leather sacking glass'],
 mailbag:['mailbag',['cloth','leather'],[],'mailbag sack metal cloth glass leather'],
 'window-pane':['window-pane',['glass'],[],'lantern window-pane plastic slate wood glass'],
 rope:['rope',['rope-fiber'],[],'rope basket plastic metal willow rope-fiber'],
 basket:['basket',['willow'],[],'bucket basket willow plastic metal cloth'],
 'roof-slate':['roof-slate',['slate'],[],'roof-slate window-pane wood glass slate plastic'],
 'gate-hinge':['gate-hinge',['iron'],[],'spoon gate-hinge wood iron plastic glass'],
 spoon:['spoon',['wood'],[],'spoon bucket metal plastic glass wood']
};
const outcomes={clay:'keeps keeps keeps keeps','willow-rod':'hardly keeps keeps hardly',rubber:'springs springs springs springs',sponge:'springs springs springs hardly',slate:'hardly snaps hardly hardly',rope:'hardly keeps keeps hardly'};
export function runChecks(){
 let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(a,m)=>{assert.ok(a,m);n++;},yes=r=>{ok(r.ok,JSON.stringify(r));return r;};
 const refused=(s,fn)=>{const before=clone(s);eq(fn().ok,false);eq(s,before,'a refusal leaves the notebook unchanged');};
 const check=(s,card,object,materials)=>yes(M.checkMendingCard(s,card,{object,materials},options)).check.line.text;
 // Content matches the copy sheet.
 eq(K.pileCards.length,12);eq(K.pileCards[0].id,'metal-bucket');eq(K.guidedCard,'metal-bucket');
 for(const c of K.pileCards){const [o,needs,also,tray]=sheet[c.id];eq([c.object,[...c.needs],[...c.also],c.tray.join(' ')],[o,needs,also,tray],c.id);}
 for(const s of K.samples)eq(K.actions.map(a=>s.outcomes[a.id]).join(' '),outcomes[s.id],s.id);
 eq(K.samples.map(s=>s.material),['clay','willow','rubber','sponge','slate','rope']);
 // Tray positions vary: object first on six and second on six; first needed material in each of four material positions.
 eq(K.pileCards.filter(c=>c.tray[0]===c.object).length,6);eq(K.pileCards.filter(c=>c.tray[1]===c.object).length,6);
 eq(new Set(K.pileCards.map(c=>c.tray.filter(k=>K.chips[k].kind==='material').indexOf(c.needs[0]))),new Set([0,1,2,3]));
 // Check lines in order, on a fresh notebook (each check writes).
 const s=fresh();ok(!Object.hasOwn(s,'mendingShed'),'no root before the first write');
 eq(check(s,'metal-bucket',null,['bucket']),'"Bucket" is what it is. What is it made of?');
 eq(check(s,'metal-bucket','metal',[]),"That's what it's made of. What is the thing called?");
 eq(check(s,'metal-bucket',null,['metal']),"What is it? Choose the thing's name.");
 eq(check(s,'metal-bucket','spoon',['metal']),'Look again. What is this thing called?');
 eq(check(s,'metal-bucket','bucket',['wood']),'Look closely. Is that what this one is made of?');
 eq(check(s,'metal-bucket','bucket',[]),'What is it made of? Choose a material.');
 eq(check(s,'lantern','lantern',['metal','glass']),'Look again. Is there a part made of something else?');
 eq(check(s,'mailbag','mailbag',['leather']),'Look again. Is there a part made of something else?');
 eq(check(s,'lantern','lantern',['metal','glass','cotton']),"That's it: lantern, made of metal, glass and cotton.");
 eq(check(s,'window-pane',null,['window-pane']),'"Window pane" is what it is. What is it made of?');
 eq(check(s,'wooden-bucket','bucket',['wood','metal']),"That's it: bucket, made of wood and metal.");
 eq(check(s,'sack','sack',['sacking']),"That's it: sack, made of sacking (jute).");
 for(const [id,[o,needs]] of Object.entries(sheet))ok(M.rightCheck(M.mendingCheck(K.pileCards.find(c=>c.id===id),K.pileCards.find(c=>c.id===id).tray.map(k=>({id:k,label:K.chips[k].label})),{object:o,materials:needs})),id);
 // Evidence: first kept once, sortedCheck is the first right check, later wrong checks never unsort.
 let r=s.mendingShed.pile['metal-bucket'];eq(r.checks,6);eq(r.first.line.id,'object-in-materials');eq(r.sortedCheck,null);
 check(s,'metal-bucket','bucket',['metal']);check(s,'metal-bucket','bucket',['wood']);r=s.mendingShed.pile['metal-bucket'];
 eq(r.sortedCheck.line.text,"That's it: bucket, made of metal.");eq(r.latest.line.id,'wrong-material');eq(r.first.line.id,'object-in-materials');eq(r.checks,8);
 eq(r.tray.map(c=>c.id),[...K.pileCards[0].tray]);eq(r.card,'metal bucket');
 // Placed chips must come from the tray, once.
 refused(s,()=>M.checkMendingCard(s,'metal-bucket',{object:'lantern',materials:[]},options));
 refused(s,()=>M.checkMendingCard(s,'metal-bucket',{object:'bucket',materials:['metal','metal']},options));
 refused(s,()=>M.checkMendingCard(s,'metal-bucket',{object:'bucket',materials:['bucket']},options));
 // Shape bench.
 const t=yes(M.letGoMendingShape(s,'slate','bend','springs',options)).try;
 eq(t,{predicted:{id:'springs',label:'Springs back'},shown:{id:'snaps',label:'Hardly changes or snaps'},result:'Still slate. Now in two pieces.',prediction:'Surprise! Different materials answer differently.'});
 eq(yes(M.letGoMendingShape(s,'slate','bend','hardly',options)).try.prediction,"You predicted that. Now you've seen it.");
 eq(yes(M.letGoMendingShape(s,'willow-rod','bend','keeps',options)).try.result,'It keeps the new shape. Still willow.');
 eq(yes(M.letGoMendingShape(s,'rubber','stretch','springs',options)).try.result,'It springs back when you let go. Still rubber.');
 eq(yes(M.letGoMendingShape(s,'clay','squash','hardly',options)).try.result,'It keeps the new shape. Still clay.');
 const cell=s.mendingShed.shapes.slate.actions.bend;eq(cell.tries,2);eq(cell.first.predicted.id,'springs');eq(cell.latest.predicted.id,'hardly');eq(cell.action,'Bend');eq(s.mendingShed.shapes.slate.sample,'Slate');
 refused(s,()=>M.letGoMendingShape(s,'slate','bend','maybe',options));refused(s,()=>M.letGoMendingShape(s,'glass','bend','keeps',options));
 // Progress and the grown-up line.
 let v=M.mendingShedView(s);eq(M.mendingShedSummary(v),{pile:'4 of 12 things sorted',shapes:'4 of 24 shape tests tried',grownUp:'Mending Shed: 4 of 12 things sorted; 4 of 24 shape tests tried.'});
 // Support: a rung on an unchecked item writes a support-only record that stays unobserved.
 yes(M.supportMending(s,{bench:'pile',card:'spoon'},options));r=s.mendingShed.pile.spoon;eq([r.first,r.latest,r.sortedCheck,r.checks,r.supported],[null,null,null,0,true]);
 eq(M.supportMending(s,{bench:'pile',card:'spoon'},options).changed,false);
 yes(M.supportMending(s,{bench:'pile',card:'metal-bucket'},options));r=s.mendingShed.pile['metal-bucket'];eq([r.first.line.id,r.checks,!!r.sortedCheck,r.supported],['object-in-materials',8,true,true]);
 yes(M.supportMending(s,{bench:'shapes',sample:'sponge',action:'stretch'},options));eq(s.mendingShed.shapes.sponge.actions.stretch.tries,0);
 v=M.mendingShedView(s);eq(M.mendingShedSummary(v).grownUp,'Mending Shed: 4 of 12 things sorted; 4 of 24 shape tests tried, with help.');eq(v.sorted,4);eq(v.tried,4);
 // Start writes taught once.
 const u=fresh();yes(M.startMendingBench(u,'pile',options));eq(u.mendingShed.taught,{pile:true,shapes:false});eq(M.startMendingBench(u,'pile',options).changed,false);eq(Object.keys(u.mendingShed).sort(),['pile','shapes','taught','v']);
 // Rendering makes no write.
 const w=fresh(),wb=clone(w);mendingShedPage(w);mendingShedNotes(w);M.mendingShedView(w);eq(w,wb);
 // Count saturation.
 const c=fresh();check(c,'spoon','spoon',['metal']);c.mendingShed.pile.spoon.checks=9999;check(c,'spoon','spoon',['wood']);r=c.mendingShed.pile.spoon;eq(r.checks,9999);eq(r.latest.line.id,'right');eq(r.sortedCheck.line.id,'right');eq(r.first.line.id,'wrong-material');
 yes(M.letGoMendingShape(c,'clay','twist','keeps',options));c.mendingShed.shapes.clay.actions.twist.tries=9999;yes(M.letGoMendingShape(c,'clay','twist','springs',options));eq(c.mendingShed.shapes.clay.actions.twist.tries,9999);eq(c.mendingShed.shapes.clay.actions.twist.latest.predicted.id,'springs');
 // Validation: count rules make records unreadable, preserved raw; the rest stays open.
 const d=fresh();check(d,'spoon','spoon',['wood']);check(d,'rope','rope',['rope-fiber']);
 d.mendingShed.pile.spoon.checks=0;d.mendingShed.pile.rope.first=null;d.mendingShed.shapes={clay:{sample:'Clay',actions:{squash:{action:'Squash',first:null,latest:null,tries:2,supported:false,at:'x'}}}};d.mendingShed.jobs={later:'slice'};
 const raw=clone(d.mendingShed);v=M.mendingShedView(d);
 eq(v.cards.find(x=>x.id==='spoon').status,'unreadable');eq(v.cards.find(x=>x.id==='rope').status,'unreadable');eq(v.samples.find(x=>x.id==='clay').cells.squash.status,'unreadable');
 refused(d,()=>M.checkMendingCard(d,'spoon',{object:'spoon',materials:['wood']},options));refused(d,()=>M.supportMending(d,{bench:'pile',card:'spoon'},options));
 check(d,'basket','basket',['willow']);eq(d.mendingShed.pile.spoon,raw.pile.spoon);eq(d.mendingShed.pile.rope,raw.pile.rope);eq(d.mendingShed.shapes.clay,raw.shapes.clay);eq(d.mendingShed.jobs,{later:'slice'});
 ok(mendingShedPage(d).length>0);
 // Tray shape rules.
 const tray=fresh();check(tray,'rope','rope',['rope-fiber']);tray.mendingShed.pile.rope.tray=[tray.mendingShed.pile.rope.tray[0]];eq(M.mendingShedView(tray).cards.find(x=>x.id==='rope').status,'unreadable');
 // Drift: kept tray without a chip the current rules need is read-only with its record intact; kept labels render as saved.
 const f=fresh();check(f,'lantern','lantern',['metal','glass','cotton']);const lantern=f.mendingShed.pile.lantern;
 lantern.tray=lantern.tray.filter(x=>x.id!=='cotton');lantern.first.materials=lantern.first.materials.filter(x=>x.id!=='cotton');lantern.latest=clone(lantern.first);lantern.sortedCheck=clone(lantern.first);lantern.card='old lantern';
 const kept=clone(lantern);v=M.mendingShedView(f);const e=v.cards.find(x=>x.id==='lantern');eq([e.status,e.editable,e.sorted,e.label],['ready',false,true,'old lantern']);
 refused(f,()=>M.checkMendingCard(f,'lantern',{object:'lantern',materials:['metal']},options));eq(f.mendingShed.pile.lantern,kept);ok(mendingShedNotes(f).includes('old lantern'));
 // Drift: a kept chip id no longer in the module; a kept card or sample no longer in the module.
 const g=fresh();check(g,'spoon','spoon',['wood']);g.mendingShed.pile.spoon.tray.push({id:'bone',label:'bone'});eq(M.mendingShedView(g).cards.find(x=>x.id==='spoon').editable,false);
 g.mendingShed.pile.kettle={...clone(g.mendingShed.pile.spoon),card:'kettle'};g.mendingShed.shapes={glass:{sample:'Glass rod',actions:{tap:{action:'Tap',first:null,latest:null,tries:0,supported:true,at:'x'}}}};
 v=M.mendingShedView(g);const k=v.cards.find(x=>x.id==='kettle');eq([k.status,k.editable,k.label],['ready',false,'kettle']);const glass=v.samples.find(x=>x.id==='glass');eq([glass.label,glass.cells.tap.status,glass.cells.tap.editable],['Glass rod','ready',false]);ok(v.actions.some(a=>a.id==='tap'&&a.label==='Tap'));
 eq(v.sorted,1);
 // Unknown version: whole root raw and read-only.
 const x=fresh();x.mendingShed={v:2,anything:[1]};const xb=clone(x);eq(M.mendingShedView(x).status,'unsupported');refused(x,()=>M.checkMendingCard(x,'spoon',{object:'spoon',materials:['wood']},options));refused(x,()=>M.startMendingBench(x,'pile',options));
 ok(mendingShedPage(x).includes(K.mendingCopy.unknownVersion));ok(mendingShedNotes(x).includes(K.mendingCopy.unknownVersion));eq(x,xb);
 for(const value of [null,7,'text',[],[1,2],{v:1,pile:'x',shapes:3,taught:[]}]){const y=fresh();y.mendingShed=value;ok(typeof mendingShedNotes(y)==='string');ok(typeof mendingShedPage(y)==='string');}
 const y=fresh();y.mendingShed={v:1,pile:'x'};eq(M.mendingShedView(y).pileStatus,'unreadable');refused(y,()=>M.checkMendingCard(y,'spoon',{object:'spoon',materials:['wood']},options));yes(M.letGoMendingShape(y,'rope','bend','keeps',options));eq(y.mendingShed.pile,'x');
 // Preflight: refusal is atomic and covers support writes.
 const z=fresh();const no={canExport:()=>false};refused(z,()=>M.checkMendingCard(z,'spoon',{object:'spoon',materials:['wood']},no));refused(z,()=>M.supportMending(z,{bench:'pile',card:'spoon'},no));refused(z,()=>M.startMendingBench(z,'shapes',no));ok(!Object.hasOwn(z,'mendingShed'));

 // Every shipped line is on the 332 copy sheet; every line the sheet marks 167 is in 167's companion.
 const flat=f=>readFileSync(new URL(f,import.meta.url),'utf8').replace(/\*/g,'');const sheet332=flat('../docs/content/332-mending-shed-first-slice-text.md'),sheet167=flat('../docs/content/167-mending-shed-text.md');
 const T=K.mendingCopy,strings=[...Object.entries(T).filter(([k])=>k!=='grownUpLine').flatMap(([,x])=>Array.isArray(x)?x:[x]),...Object.values(K.teachCards).flatMap(c=>[c.text,c.example,...c.steps]),...Object.values(K.ladderExamples).flatMap(e=>[e.title,e.body,e.start]),...Object.values(K.checkLines),...Object.values(K.resultLines),...Object.values(K.chips).map(c=>c.label),...K.samples.map(x=>x.label),...K.actions.map(x=>x.label),...K.predictChips.map(x=>x.label),...K.pileCards.map(c=>c.label)];
 for(const line of strings)ok(sheet332.includes(line)||T.guidedSteps.join(' ')===line,'332 copy sheet: '+line);
 ok(sheet332.includes('Mending Shed: {n} of 12 things sorted; {m} of 24 shape tests tried{, with help}.'),'grown-up line on the sheet');
 for(const line of [...T.firstVisit,T.laterVisit,T.simplified,K.teachCards.pile.text,...K.teachCards.pile.steps,K.teachCards.shapes.text,...K.teachCards.shapes.steps,T.pilePrompt,T.rowObject,T.rowMaterials,T.multiNote,K.checkLines.materialInObject,K.checkLines.missingMaterial,'"Bucket" is what it is. What is it made of?',T.shapesPrompt,...K.predictChips.map(x=>x.label),T.matched,T.surprise,T.willowNote,...K.samples.map(x=>x.label),K.resultLines.snaps,...Object.values(K.ladderExamples).flatMap(e=>[e.title,e.body,e.start])])ok(sheet167.includes(line),'167 companion: '+line);
 // Precedence when several conditions apply, and {Object} on every object chip.
 const pc=(card,object,materials)=>{const c=K.pileCards.find(x=>x.id===card);return M.mendingCheck(c,c.tray.map(k=>({id:k,label:K.chips[k].label})),{object,materials}).line.id;};
 eq(pc('metal-bucket','metal',['bucket']),'object-in-materials');eq(pc('metal-bucket','wood',[]),'material-in-object');eq(pc('metal-bucket','spoon',['wood']),'wrong-object');eq(pc('metal-bucket',null,['glass']),'object-empty');
 eq(pc('lantern','lantern',['plastic']),'wrong-material');eq(pc('lantern','lantern',['plastic','metal','glass','cotton']),'wrong-material');eq(pc('wooden-bucket','bucket',['metal']),'missing-material');
 for(const c of K.pileCards){const tray=c.tray.map(k=>({id:k,label:K.chips[k].label}));eq(M.mendingCheck(c,tray,{object:null,materials:[c.object]}).line.text,`"${K.chips[c.object].label[0].toUpperCase()+K.chips[c.object].label.slice(1)}" is what it is. What is it made of?`);}
 eq(M.mendingCheck(K.pileCards.find(c=>c.id==='mailbag'),K.pileCards.find(c=>c.id==='mailbag').tray.map(k=>({id:k,label:K.chips[k].label})),{object:null,materials:['mailbag']}).line.text,`"Dot's mailbag" is what it is. What is it made of?`);
 // Refusals: Let go, the real capacity limit and an existing notebook.
 const q=fresh();check(q,'spoon','spoon',['wood']);yes(M.letGoMendingShape(q,'rope','bend','keeps',options));const no2={canExport:()=>false};
 refused(q,()=>M.letGoMendingShape(q,'rope','bend','keeps',no2));refused(q,()=>M.checkMendingCard(q,'spoon',{object:'spoon',materials:['wood']},no2));refused(q,()=>M.supportMending(q,{bench:'shapes',sample:'rope',action:'bend'},no2));
 q.filler='x'.repeat(MAX_IMPORT_BYTES);refused(q,()=>M.checkMendingCard(q,'spoon',{object:'spoon',materials:['wood']},options));eq(M.checkMendingCard(q,'spoon',{object:'spoon',materials:['wood']},options).error,'capacity');refused(q,()=>M.letGoMendingShape(q,'rope','bend','keeps',options));
 // Saturation updates at and keeps first on a shape cell.
 const sat=fresh();yes(M.letGoMendingShape(sat,'sponge','squash','keeps',options));const cellS=sat.mendingShed.shapes.sponge.actions.squash,firstS=clone(cellS.first);cellS.tries=9999;cellS.at='2000-01-01T00:00:00.000Z';yes(M.letGoMendingShape(sat,'sponge','squash','springs',options));
 eq([sat.mendingShed.shapes.sponge.actions.squash.tries,sat.mendingShed.shapes.sponge.actions.squash.first],[9999,firstS]);ok(sat.mendingShed.shapes.sponge.actions.squash.at!=='2000-01-01T00:00:00.000Z','at moves at the cap');
 const satP=fresh();check(satP,'rope','rope',['metal']);satP.mendingShed.pile.rope.checks=9999;satP.mendingShed.pile.rope.at='2000-01-01T00:00:00.000Z';check(satP,'rope','rope',['metal']);ok(satP.mendingShed.pile.rope.at!=='2000-01-01T00:00:00.000Z');eq(satP.mendingShed.pile.rope.sortedCheck,null);
 // Saved keys outside [a-z0-9-]{1,40} are unreadable and kept raw.
 const bad=fresh();check(bad,'spoon','spoon',['wood']);bad.mendingShed.pile.SPOON=clone(bad.mendingShed.pile.spoon);bad.mendingShed.shapes={INVALID:{sample:'Clay',actions:{squash:{action:'Squash',first:null,latest:null,tries:0,supported:false,at:'x'}}},clay:{sample:'Clay',actions:{'Bad Key':{action:'Odd',first:null,latest:null,tries:0,supported:false,at:'x'}}}};
 const badRaw=clone(bad.mendingShed);v=M.mendingShedView(bad);eq(v.cards.find(x=>x.id==='SPOON').status,'unreadable');eq(v.samples.find(x=>x.id==='INVALID').status,'unreadable');eq(v.samples.find(x=>x.id==='INVALID').cells.squash.status,'unreadable');eq(v.samples.find(x=>x.id==='clay').cells['Bad Key'].status,'unreadable');
 yes(M.letGoMendingShape(bad,'clay','squash','keeps',options));eq(bad.mendingShed.pile.SPOON,badRaw.pile.SPOON);eq(bad.mendingShed.shapes.INVALID,badRaw.shapes.INVALID);eq(bad.mendingShed.shapes.clay.actions['Bad Key'],badRaw.shapes.clay.actions['Bad Key']);
 // Export and import carry the root exactly, with unreadable entries and unknown siblings.
 d.mendingShed.extra={later:[1,2]};const imported=prepareProgressImport(JSON.stringify(report(d),null,2));ok(imported.ok);eq(imported.state.mendingShed,d.mendingShed,'import keeps the root exactly');
 // A write whose generated line would break the reader is refused; accepted retained work stays readable.
 {const lb=initializeExplorerState(freshState());yes(M.supportMending(lb,{bench:'pile',card:'metal-bucket'},options));
  const kept=lb.mendingShed.pile['metal-bucket'];kept.first=null;kept.latest=null;kept.sortedCheck=null;kept.checks=0;kept.tray.find(c=>c.id==='bucket').label='b'.repeat(190);
  const imported=prepareProgressImport(JSON.stringify(report(lb),null,2));ok(imported.ok,'long retained labels import');const st=imported.state;
  const card=()=>M.mendingShedView(st).cards.find(c=>c.id==='metal-bucket');eq(card().status,'ready');ok(card().editable);
  const before=clone(st);const res=M.checkMendingCard(st,'metal-bucket',{object:'bucket',materials:['metal']},options);eq(res,{ok:false,error:'unavailable'});eq(st,before,'the refusal leaves it unchanged');eq(card().status,'ready','still readable');
  yes(M.checkMendingCard(st,'metal-bucket',{object:'bucket',materials:[]},options));eq(card().status,'ready','a short line still saves');eq(st.mendingShed.pile['metal-bucket'].tray.find(c=>c.id==='bucket').label,'b'.repeat(190),'labels kept');}
 // The root travels through the real Notes import.
 const back=prepareProgressImport(JSON.stringify(report(s),null,2));ok(back.ok);
 return n;
}
if(import.meta.url===pathToFileURL(process.argv[1]).href)console.log(`Mending Shed checks: ${runChecks()} passed.`);
