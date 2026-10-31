// Spec 334: grading, kept evidence, drift, validation, preflight and copy for the first Design Table slice.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {readFileSync} from 'node:fs';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {MAX_IMPORT_BYTES} from '../dist/progress-limits.mjs';
import {designTableCopy as T,designItems,designBrief} from '../dist/design-table-content.mjs';
import * as C from '../dist/design-table-core.mjs';
import {designTablePage,designTableNotes,designTableSummary,resetDesignTableView} from '../dist/design-table-ui.mjs';
const clone=structuredClone;
const report=s=>({title:'After the Storm: observations',note:'Synthetic Design Table checks.',exportedAt:'2026-10-31T12:00:00.000Z',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:{reason:'Synthetic report'},...s});
const canExport=s=>prepareProgressImport(JSON.stringify(report(s),null,2)).ok;
const options={canExport},fresh=()=>initializeExplorerState(freshState());
const RIGHT_BOARD={need:'need',courier:'who','keeps-dry':'musts',strong:'musts',heavy:'musts',shed:'limits',coins:'limits',days:'limits'};
const item=id=>designItems.find(x=>x.id===id);
export function runChecks(){
 let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(a,m)=>{assert.ok(a,m);n++;},yes=r=>{ok(r.ok,JSON.stringify(r));return r;};
 const refused=(s,fn)=>{const before=clone(s);eq(fn().ok,false);eq(s,before,'a refusal leaves the notebook unchanged');};
 const rec=(s,id)=>s.designTable.items[id],brief=s=>s.designTable.briefs['ways-crate'];
 // The rain table's shipped data.
 const sat=T.rain.tries.reduce((a,t)=>a+t[1],0),bas=T.rain.tries.reduce((a,t)=>a+t[2],0);
 eq([sat,bas,bas-sat],[1,9,8]);eq(T.rain.total,['Total','1 of 30','9 of 30']);ok(T.rain.carry.includes('satchel holds 6 parcels; basket holds 10'));eq(item('a5').answer,8);
 // A5: whole numbers 0 to 99 only; 8 right, 9 and 3 tagged, others the other line.
 for(const bad of ['','  ','8.0','8.5','-1','100','1e1','eight','+8'])eq(C.parseEntry(bad),null,`not an answer: ${bad}`);
 eq([C.parseEntry('0'),C.parseEntry(' 8 '),C.parseEntry('99'),C.parseEntry('08')],[0,8,99,8]);
 eq(C.gradeNumber(item('a5'),8).line,{id:'right',text:'Yes. 9 take away 1 is 8.'});eq(C.gradeNumber(item('a5'),9).line.text,"That's the basket's total. Take away the satchel's.");
 eq(C.gradeNumber(item('a5'),3).line.text,'Use all three tries for each bag.');eq(C.gradeNumber(item('a5'),7).line.text,"Not quite. Add each bag's tries, then take away.");
 // Tags, in the copy sheet's order.
 const tags=item('bags-tags'),T4={'keeps-dry':'satchel-strength','holds-6':'satchel-weakness','holds-10':'basket-strength','lets-rain':'basket-weakness'};
 eq(C.gradeTags(tags,{...T4,best:'satchel-strength'}).line.id,'single-winner');eq(C.gradeTags(tags,{best:'basket-strength'}).line.text,'Check the carry test. Does one bag win both?');
 eq(C.gradeTags(tags,{'keeps-dry':'satchel-strength'}).line.text,'Each bag needs a strength and a weakness.');eq(C.gradeTags(tags,{}).line.id,'empty');
 eq(C.gradeTags(tags,{'keeps-dry':'basket-strength','holds-6':'satchel-weakness','holds-10':'satchel-strength','lets-rain':'basket-weakness'}).line.text,'Look at the table again. Is that true of this bag?');
 eq(C.gradeTags(tags,{'keeps-dry':'satchel-weakness','holds-6':'satchel-strength','holds-10':'basket-strength','lets-rain':'basket-weakness'}).line.id,'wrong');
 eq(C.gradeTags(tags,T4),{right:true,line:{id:'right',text:'Yes. Each bag is better at something.'}});
 // The frame: both right pairs, a mismatch and an empty gap.
 const frame=item('bags-frame');eq(C.gradeFrame(frame,{dry:'for'}).line.text,'Choose a chip for each gap.');eq(C.gradeFrame(frame,{}).line.id,'empty');
 eq(C.gradeFrame(frame,{dry:'for',parcels:'data'}).line.text,'Does that number show it? Look at the table.');eq(C.gradeFrame(frame,{lots:'for',damp:'data'}).line.id,'mismatch');
 eq(C.gradeFrame(frame,{dry:'for',damp:'data'}).line.text,'Better for dry letters because the data showed 1 damp, not 9.');eq(C.gradeFrame(frame,{lots:'for',parcels:'data'}).line.text,'Better for lots of parcels because the data showed 10 parcels, not 6.');
 // Choice items: every right and tagged wrong line; fitting positions vary.
 const lines={'bags-guided':['satchel','Yes. Fewer damp letters means drier.'],'bags-improve':['line','That might keep the space and stop the rain. Test it to find out.'],'bags-unfair':['not-fairly','Not fairly. The basket got more water. Test them the same way.'],a4:['satchel','Yes. Fewer damp letters.'],a6:['same-water','Right. Test them the same way.'],'brief-guided':['limit',"Yes. It limits your choices. It doesn't say what the crate does."],a8:['jars','Yes. You can test that and see.']};
 for(const [id,[right,line]] of Object.entries(lines)){const it=item(id);eq(C.gradeChoice(it,right),{right:true,line:{id:right,text:line}});for(const o of it.options.filter(o=>o.id!==right)){const g=C.gradeChoice(it,o.id);eq(g.right,false);ok(g.line.text&&g.line.text!==line,`${id}/${o.id} has its own line`);}}
 eq(C.gradeChoice(item('a4'),'baker').line.text,"Who made it doesn't change the results.");eq(C.gradeChoice(item('a8'),'nice').line.text,"Taste isn't a test. Try a must with a number.");eq(C.gradeChoice(item('bags-unfair'),'yes').line.text,'Look again. Did both bags get the same water?');eq(C.gradeChoice(item('a4'),'nope'),null);
 const pos=id=>item(id).options.findIndex(o=>o.id===item(id).right)+1;
 eq(['bags-guided','a4','bags-unfair','a6','brief-guided','bags-improve','a8'].map(pos),[1,1,1,2,2,3,3],'the copy sheet positions');
 // A7 order: unsorted, then wrong bin, then right with all four.
 const a7=item('a7');eq(C.gradeSort(a7,{jars:'musts',coins:'limits',dry:'musts'}).line.text,'Sort every card first. Which one is left?');
 eq(C.gradeSort(a7,{jars:'limits',coins:'limits',dry:'musts',shed:'limits'}).line.text,'Does this say what the crate does, or what limits you?');
 eq(C.gradeSort(a7,{jars:'musts',coins:'limits',dry:'musts',shed:'limits'}),{right:true,line:{id:'right',text:'Yes. Two musts and two limits.'}});
 // The brief, in order: solution, vague, swap, other wrong slot, room, right.
 eq(C.gradeBrief({...RIGHT_BOARD,oak:'need',strong:'musts'},['strong','heavy']).line.text,'Maybe. First, what must any answer do?');
 eq(C.gradeBrief({strong:'musts'},[]),{right:false,line:{id:'strong',text:'"Really strong" → "Carries 6 jars through the bump test"'},flip:['strong']});
 eq(C.gradeBrief({heavy:'limits',nice:'musts'},[]).flip,['nice','heavy']);eq(C.gradeBrief({heavy:'limits',nice:'musts'},[]).line.text,'Nice for whom? Try a must you can test.');
 eq(C.gradeBrief({heavy:'limits'},[]).line.text,'"Not too heavy" → "Weighs 5 kg or less, empty"');
 eq(C.gradeBrief({...RIGHT_BOARD,'keeps-dry':'limits',shed:'musts'},['strong','heavy']).line.text,'Does this say what the crate does, or what limits you?');
 eq(C.gradeBrief({...RIGHT_BOARD,strong:'limits',coins:'musts'},['strong','heavy']).line.id,'swap');
 eq(C.gradeBrief({need:'who',courier:'need'},[]).line.text,'Look again. Which slot does this one belong in?');eq(C.gradeBrief({shed:'need'},[]).line.id,'wrong');
 eq(C.gradeBrief({need:'need'},[]).line.text,'Every slot needs its tiles. Which one still has room?');eq(C.gradeBrief({},[]).line.id,'room');
 eq(C.gradeBrief(RIGHT_BOARD,['strong','heavy']),{right:true,line:{id:'right',text:'Your brief'}});
 // Nothing writes until the first Start, answer, check or rung.
 const s=fresh();resetDesignTableView();ok(designTablePage(s,'e').includes(T.firstVisit.replace('{guide}','').slice(0,30)));ok(!Object.hasOwn(s,'designTable'),'rendering makes no write');
 ok(!designTablePage(s,'e').includes('{guide}'),'the guide is substituted');eq(designTableNotes(s),'','no notes before a write');
 // Start records taught once.
 yes(C.startStation(s,'bags',options));eq(s.designTable,{v:1,taught:{bags:true,brief:false},items:{},briefs:{}});eq(C.startStation(s,'bags',options).changed,false);eq(C.startStation(s,'other',options).ok,false);
 // First answer kept once; latest, tries and at change; rightAnswer kept once; a later wrong keeps it right.
 yes(C.answerItem(s,'a4','baker',options));const a4=rec(s,'a4');eq(a4.first.choice,{id:'baker',label:'The basket, because the baker made it'});eq(a4.tries,1);eq(a4.rightAnswer,null);
 eq(a4.prompt,item('a4').prompt);eq(a4.explanation,'The results decide: fewer letters got damp in the satchel.');eq(a4.options.map(o=>o.id),['satchel','baker','parcels']);eq(a4.slots,[]);eq(a4.rev,'r1');
 yes(C.answerItem(s,'a4','satchel',options));yes(C.answerItem(s,'a4','parcels',options));
 eq(rec(s,'a4').first.choice.id,'baker');eq(rec(s,'a4').latest.choice.id,'parcels');eq(rec(s,'a4').rightAnswer.choice.id,'satchel');eq(rec(s,'a4').tries,3);
 ok(designTablePage(s,'e').length);
 // Placements keep the shown option and slot.
 yes(C.answerItem(s,'bags-tags',T4,options));eq(rec(s,'bags-tags').latest.placed.map(e=>[e.item.label,e.slot.label]),[['holds 10 parcels','Basket: strength'],['keeps letters dry','Satchel: strength'],['lets rain in','Basket: weakness'],['holds only 6 parcels','Satchel: weakness']]);
 eq(C.answerItem(s,'bags-tags',{unknown:'satchel-strength'},options).ok,false);
 yes(C.answerItem(s,'bags-frame',{lots:'for',parcels:'data'},options));eq(rec(s,'bags-frame').rightAnswer.line.text,'Better for lots of parcels because the data showed 10 parcels, not 6.');
 // A5 stores the whole number only.
 yes(C.answerItem(s,'a5',9,options));eq(rec(s,'a5').latest.entry,9);eq(rec(s,'a5').latest.line.id,'total-not-difference');eq(C.answerItem(s,'a5',100,options).ok,false);eq(C.answerItem(s,'a5',2.5,options).ok,false);
 yes(C.answerItem(s,'a5',8,options));eq(rec(s,'a5').rightAnswer.entry,8);
 // Count saturates at 9999, while latest and at still move.
 s.designTable.items.a6={...clone(rec(s,'a4')),prompt:item('a6').prompt,explanation:item('a6').explanation,options:clone(item('a6').options),first:null,latest:null,rightAnswer:null,tries:0};
 yes(C.answerItem(s,'a6','worse',options));rec(s,'a6').tries=9999;yes(C.answerItem(s,'a6','same-water',options));eq(rec(s,'a6').tries,9999);eq(rec(s,'a6').latest.choice.id,'same-water');ok(rec(s,'a6').rightAnswer);
 // The ladder: support rises through preflight; a support-only record stays unobserved; Skip never writes.
 yes(C.openRung(s,'a8',1,options));eq(rec(s,'a8').support,'hint');eq([rec(s,'a8').tries,rec(s,'a8').first,rec(s,'a8').latest],[0,null,null]);ok(C.validItem(rec(s,'a8')));
 eq(C.progress(C.designView(s),'brief'),0,'a support-only record is not tried');yes(C.openRung(s,'a8',2,options));eq(rec(s,'a8').support,'example');eq(C.openRung(s,'a8',1,options).changed,false);eq(rec(s,'a8').support,'example','support only rises');
 eq(C.openRung(s,'bags-guided',1,options).ok,false,'guided items have no ladder');eq(C.openRung(s,'a8',3,options).ok,false);
 yes(C.openRung(s,'a4',1,options));eq(rec(s,'a4').first.choice.id,'baker','a rung keeps first');eq(rec(s,'a4').tries,3);
 // Progress and the grown-up line.
 const v=C.designView(s);eq(C.progress(v,'bags'),5);ok(C.withHelp(v));eq(designTableSummary(v),'Design Table: Two bags, 5 of 8 tried; Write the brief, 0 of 4 tried, with help.');
 // The brief: a pre-check flip left in the tray, an incomplete check, then a vague tile placed.
 const b=fresh();yes(C.checkBrief(b,{need:'need'},['strong'],options));let r=brief(b);
 eq(r.first,{placed:[{item:{id:'need',label:'Carry letters and honey jars along the river path'},slot:{id:'need',label:'Need'}}],flipped:['strong'],line:{id:'room',text:'Every slot needs its tiles. Which one still has room?'}});
 eq(r.tray,clone(designBrief.tray));eq(r.checks,1);
 const res=yes(C.checkBrief(b,{need:'need',heavy:'musts'},['strong'],options));eq(res.returned,['heavy']);eq(res.flipped,['strong','heavy']);r=brief(b);
 eq(r.latest.placed.map(e=>e.item.id),['need','heavy'],'the board as submitted');eq(r.latest.flipped,['strong','heavy']);eq(r.first.line.id,'room','first kept once');eq(r.latest.line.text,'"Not too heavy" → "Weighs 5 kg or less, empty"');
 eq(C.checkBrief(b,{nice:'musts'},['nice'],options).ok,false,'a flipped Nice cannot be placed');eq(C.checkBrief(b,{shed:'limits',coins:'limits',days:'limits',keeps:'limits'},[],options).ok,false);
 eq(C.checkBrief(b,{shed:'need',coins:'need'},[],options).ok,false,'a slot cannot overfill');
 yes(C.checkBrief(b,RIGHT_BOARD,['strong','heavy'],options));r=brief(b);ok(r.rightBrief);eq(r.rightBrief.placed.map(e=>e.item.id),['need','courier','keeps-dry','bump','weighs','shed','coins','days'],'card order');
 const card=C.briefReadBack(r,T.briefCard);eq(card,[{label:'Need:',text:'carry letters and honey jars along the river path.'},{label:"Who it's for:",text:'the courier, walking.'},{label:'Musts (criteria):',text:'keeps 12 letters dry in the rain test · carries 6 jars through the bump test · weighs 5 kg or less, empty'},{label:'Limits (constraints):',text:'shed materials only · 10 coins or less · ready in 3 days'}]);
 const sheet=readFileSync(new URL('../docs/content/334-design-table-first-slice-text.md',import.meta.url),'utf8');
 for(const x of card)ok(sheet.includes(`- **${x.label}** ${x.text}`),'the companion brief card exactly: '+x.label);
 yes(C.checkBrief(b,{oak:'need'},[],options));eq(brief(b).rightBrief.placed.length,8,'a later wrong check keeps the right brief');eq(brief(b).checks,4);
 // The solution line wins, and placed vague tiles still flip after the check.
 eq(C.gradeBrief({oak:'need',strong:'musts'},[]),{right:false,line:{id:'solution',text:'Maybe. First, what must any answer do?'},flip:['strong']});
 {const sv=fresh();const out=yes(C.checkBrief(sv,{oak:'need',strong:'musts'},[],options));eq(out.returned,['strong']);eq(out.flipped,['strong']);eq(brief(sv).latest.placed.map(e=>e.item.id),['oak','strong'],'submitted as placed');eq(brief(sv).latest.flipped,['strong']);eq(brief(sv).latest.line.id,'solution');}
 // A placed or chosen entry must be a well-formed copy from the record's own list.
 {const mb=clone(brief(b));delete mb.rightBrief.placed[0].item.label;ok(!C.validBrief(mb),'a placed entry without its label is unreadable');
  const mb2=clone(brief(b));mb2.rightBrief.placed[0].item.label='Not the kept label';ok(!C.validBrief(mb2),'a placed label must match the kept list');
  const z=clone(b);z.designTable.briefs['ways-crate']=mb;eq(C.designView(z).brief.status,'unreadable');resetDesignTableView();ok(designTablePage(z,'e').length);refused(z,()=>C.checkBrief(z,RIGHT_BOARD,['strong','heavy'],options));
  const zi=fresh();yes(C.answerItem(zi,'a4','satchel',options));delete rec(zi,'a4').latest.choice.label;eq(C.designView(zi).items.a4.status,'unreadable');}
 // A kept brief renders after the content module rewrites a flip side.
 brief(b).tray.find(t=>t.id==='heavy').flip.label='An older flip side';brief(b).rightBrief.placed.find(e=>e.item.id==='weighs').item.label='An older flip side';
 ok(C.validBrief(brief(b)));ok(C.briefCurrent(brief(b)),'labels alone keep the record current');eq(C.briefReadBack(brief(b),T.briefCard)[2].text.includes('an older flip side'),true);
 brief(b).tray.find(t=>t.id==='heavy').flip.id='weighs-old';brief(b).rightBrief.placed.find(e=>e.item.id==='weighs').item.id='weighs-old';brief(b).latest.placed=[];brief(b).first.placed=[];
 ok(C.validBrief(brief(b)));ok(!C.briefCurrent(brief(b)),'a changed flip side is read-only');eq(C.designView(b).brief.writable,false);refused(b,()=>C.checkBrief(b,RIGHT_BOARD,['strong','heavy'],options));
 resetDesignTableView();ok(designTablePage(b,'e').length);
 // Drift: a changed rev, a missing needed option, or a removed id makes a kept record read-only and still rendered from its own copy.
 const d=fresh();yes(C.answerItem(d,'a6','worse',options));yes(C.answerItem(d,'a6','same-water',options));
 const keep=clone(d.designTable);rec(d,'a6').rev='r0';eq(C.designView(d).items.a6.writable,false);refused(d,()=>C.answerItem(d,'a6','same-water',options));
 rec(d,'a6').rev='r1';rec(d,'a6').options.pop();eq(C.designView(d).items.a6.writable,false);d.designTable=clone(keep);
 rec(d,'a6').prompt='An older question?';rec(d,'a6').options[0].label='An older choice';rec(d,'a6').first.choice.label='An older choice';rec(d,'a6').explanation='An older explanation.';ok(C.designView(d).items.a6.writable,'labels alone keep it writable');
 rec(d,'a6').options[0].id='gone';rec(d,'a6').first.choice.id='gone';eq(C.designView(d).items.a6.status,'kept');eq(C.designView(d).items.a6.writable,false);
 resetDesignTableView();ok(designTablePage(d,'e').length);
 // Unreadable: count and presence disagree; preserved raw; the rest of the table open.
 const u=fresh();yes(C.answerItem(u,'a4','satchel',options));rec(u,'a4').tries=0;eq(C.designView(u).items.a4.status,'unreadable');ok(C.designView(u).items.a8.writable);
 const ur=clone(u.designTable);refused(u,()=>C.answerItem(u,'a4','satchel',options));refused(u,()=>C.openRung(u,'a4',1,options));yes(C.answerItem(u,'a8','jars',options));eq(rec(u,'a4'),ur.items.a4);
 for(const bad of [{prompt:''},{tries:-1},{tries:10000},{support:'all'},{rev:'R 1'},{options:'x'},{first:null},{latest:{choice:{id:'nope',label:'x'},entry:null,placed:null,line:{id:'x',text:'y'}}},{explanation:7},{at:5}]){
  const z=fresh();yes(C.answerItem(z,'a4','satchel',options));Object.assign(rec(z,'a4'),bad);eq(C.designView(z).items.a4.status,'unreadable',JSON.stringify(bad));}
 const big=fresh();yes(C.answerItem(big,'a4','satchel',options));rec(big,'a4').options=Array.from({length:13},(_,i)=>({id:`o${i}`,label:'x'}));eq(C.designView(big).items.a4.status,'unreadable','at most 12 options');
 // Unknown sibling keys and unknown entries stay exact through a write and a Notes round trip.
 const x=fresh();yes(C.answerItem(x,'a4','satchel',options));x.designTable.sketches={later:[1]};x.designTable.items.later={anything:true};x.designTable.briefs.later=7;
 yes(C.answerItem(x,'a8','jars',options));eq(x.designTable.sketches,{later:[1]});eq(x.designTable.items.later,{anything:true});eq(x.designTable.briefs.later,7);
 eq(prepareProgressImport(JSON.stringify(report(x),null,2)).state.designTable,x.designTable,'import keeps the root exactly');
 // Unknown v: raw, read-only and noted.
 const w=fresh();w.designTable={v:2,later:true};eq(C.designView(w).status,'unsupported');refused(w,()=>C.startStation(w,'bags',options));refused(w,()=>C.answerItem(w,'a4','satchel',options));
 resetDesignTableView();ok(designTablePage(w,'e').includes(T.unknownVersion));ok(designTablePage(w,'e').includes('href="#notes"'));ok(designTableNotes(w).includes(T.unknownVersion));
 for(const value of [null,0,'x',[],{v:1,items:[]},{v:1,items:{a4:7}},{v:1,taught:'yes'},{v:1,briefs:{'ways-crate':null}}]){const y=fresh();y.designTable=value;ok(typeof designTableNotes(y)==='string');resetDesignTableView();ok(typeof designTablePage(y,'e')==='string');}
 const bt=fresh();bt.designTable={v:1,taught:'yes'};refused(bt,()=>C.startStation(bt,'bags',options));yes(C.answerItem(bt,'a4','satchel',options));eq(bt.designTable.taught,'yes');
 const bi=fresh();bi.designTable={v:1,items:[1]};eq(C.designView(bi).items.a4.status,'unreadable');refused(bi,()=>C.answerItem(bi,'a4','satchel',options));
 // Real preflight refusal at the capacity limit.
 const q=fresh();q.filler='x'.repeat(MAX_IMPORT_BYTES);refused(q,()=>C.startStation(q,'bags',options));refused(q,()=>C.answerItem(q,'a4','satchel',options));refused(q,()=>C.openRung(q,'a4',1,options));refused(q,()=>C.checkBrief(q,{need:'need'},[],options));
 eq(C.answerItem(q,'a4','satchel',options).error,'capacity');eq(C.answerItem(fresh(),'a4','satchel',{}).ok,false,'no export check, no write');
 // Copy: every string is on the 334 sheet, 176 lines match 176's companion, no em-dash.
 const flat=f=>readFileSync(new URL(f,import.meta.url),'utf8').replace(/\*\*/g,'').replace(/\*/g,'');
 const s334=flat('../docs/content/334-design-table-first-slice-text.md'),s176=flat('../docs/content/176-design-table-text.md');
 const plain=x=>String(x).replace(/\*\*/g,'').replace(/\*/g,'');
 const strings=[];const walk=x=>{if(typeof x==='string')strings.push(x);else if(x&&typeof x==='object')Object.values(x).forEach(walk);};walk(T);walk(designItems);walk(designBrief);
 const ids=new Set([...designItems.flatMap(i=>[i.id,i.station,i.kind,i.rev,...i.options.map(o=>o.id),...(i.slots||[]).map(o=>o.id),...Object.keys(i.lines),i.right,...Object.values(i.key||{}),i.single,...Object.values(i.pairs||{}),...Object.values(i.gaps||{}).flat()].filter(Boolean)),...designBrief.tray.flatMap(t=>[t.id,t.flip?.id].filter(Boolean)),...designBrief.slots.map(o=>o.id),designBrief.id,designBrief.rev,designBrief.station,...designBrief.cardOrder,...Object.values(designBrief.belongs),designBrief.solution,'.','']);
 const composed=new Set([item('bags-frame').readBack.lots,T.progress.bags,T.progress.brief,T.placedName,T.grown.line,T.rain.carry,T.frameText,T.briefSlots,T.firstVisit]);
 for(const x of strings){if(ids.has(x)||composed.has(x))continue;ok(s334.includes(plain(x).replace(/'/g,"'"))||s176.includes(plain(x)),'on the sheet: '+x);}
 ok(s334.includes(plain(T.firstVisit)),'first visit');ok(s334.includes(plain(T.rain.carry).replace('Carry test: ','')),'carry line');
 const from176=[T.firstVisit,T.laterVisit,T.teach.bags.text,...T.teach.bags.steps,T.teach.brief.text,...T.teach.brief.steps,...T.mary,...designItems.filter(i=>['a6','a7','a8'].includes(i.id)).flatMap(i=>[i.prompt,i.explanation,i.hint,i.stuckLine,...Object.entries(i.lines).filter(([k])=>!(i.id==='a7'&&k!=='wrong')).map(([,t])=>t)]),item('a4').prompt,item('a4').hint,item('a4').stuckLine,...Object.values(item('a4').lines),item('a5').prompt,item('a5').steps,item('a5').explanation,item('a5').hint,item('a5').stuckLine];
 for(const x of from176)ok(s176.includes(plain(x)),'176 companion: '+x);
 for(const [k,d] of T.terms)ok(s176.includes(`${k}: ${d}`),'key term: '+k);
 ok(!JSON.stringify([T,designItems,designBrief]).includes('—'),'no em-dash');
 return n;
}
if(import.meta.url===pathToFileURL(process.argv[1]).href)console.log(`Design Table checks: ${runChecks()} passed.`);
