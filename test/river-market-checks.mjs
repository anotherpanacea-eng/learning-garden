import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {makeCargaSource,riverMarketText} from '../dist/river-market-content.mjs';
import {validCargaSource,validErrand,cargaOutcome,allInPlace,riverMarketView,riverMarketTries,setRiverAmount,openCarga,placeItem,submitCarga,answerCarga,useRiverSupport,startCargaAgain,seeBoatLine,cargaLines} from '../dist/river-market-core.mjs';
import {hearButton,spoken,localVoices,chooseLocalVoice} from '../dist/play-media.mjs';
import {riverMarketPage,riverMarketNotes} from '../dist/river-market-ui.mjs';
let checks=0;const ok=(value,label)=>{assert.ok(value,label);checks++;};
const yes={canExport:()=>true},bytes=s=>JSON.stringify(s);
const fresh=()=>({});
function placeAll(state,fix={}){const e=riverMarketView(state).carga;for(const i of e.source.items)placeItem(state,i.id,fix[i.id]??e.source.targets[i.kind],yes);}

// Both amounts, each with its own items and a bounded, frozen source.
for(const amount of ['short','longer']){
 const s=makeCargaSource(amount);
 ok(validCargaSource(s)&&Object.isFrozen(s)&&Object.isFrozen(s.items),`${amount} source is valid and frozen`);
 ok(s.items.length===(amount==='short'?5:6),`${amount} note has its own item count`);
 ok(s.items.filter(i=>i.kind==='miel').length===3&&s.items.filter(i=>i.kind==='harina').length===2,'three honey jars and two flour sacks');
 ok(s.items.some(i=>i.kind==='semillas')===(amount==='longer'),'the seed box is in the longer note only');
 ok(s.question.choices.map(c=>c.id).join()==='dos,tres,cuatro'&&s.question.choices[1].id===s.question.fit,'fitting choice is second');
 ok(new TextEncoder().encode(bytes(s)).length<=48*1024,'source fits 48 KiB');
}
ok(makeCargaSource('medium')===null,'unknown amount makes no source');

// Every wrong-place line, in companion order, deduplicated by kind and place.
{
 const s=makeCargaSource('longer'),p=Object.fromEntries(s.items.map(i=>[i.id,s.targets[i.kind]]));
 ok(cargaOutcome(s,p).all&&allInPlace(s,p),'all in place');
 const q={...p,'miel-1':'jardin','miel-2':'panaderia','miel-3':'jardin','harina-1':'cafe','semillas-1':'panaderia'};
 const o=cargaOutcome(s,q);
 ok(o.lines.join()==='miel-panaderia,harina-cafe,miel-jardin,semillas-panaderia','companion order, one line per kind and place');
 ok(cargaLines({source:s},o.lines).every(l=>l.es&&l.en),'each line has Spanish and English');
 const order=['miel-panaderia','harina-cafe','semillas-cafe','miel-jardin','harina-jardin','semillas-panaderia'];
 ok(s.feedback.wrong.map(w=>w.id).join()===order.join(),'all six wrong-place lines exist in order');
}

// First write: choosing an amount or opening the note. Rendering reads make no write.
{
 const st=fresh();ok(riverMarketView(st).status==='new'&&bytes(st)==='{}','view of a new explorer writes nothing');
 ok(submitCarga(st,yes).ok===false&&bytes(st)==='{}','no errand, no write');
 ok(setRiverAmount(st,'longer',yes).ok&&st.spanish.amount==='longer'&&!st.spanish.errands.carga,'amount creates the root without opening an errand');
 ok(setRiverAmount(st,'longer',yes).changed===false,'same amount is a no-op');
 ok(openCarga(st,yes).ok&&st.spanish.errands.carga.tryId===1&&st.spanish.nextTry===2,'opening takes tryId 1');
 ok(st.spanish.errands.carga.source.amount==='longer','freezes the current amount');
 setRiverAmount(st,'short',yes);ok(riverMarketView(st).carga.source.amount==='longer'&&st.spanish.amount==='short','a started errand keeps its note');
 ok(openCarga(st,yes).changed===false,'reopening is a no-op');
}

// Done unloading with items left records nothing; first submission and hints stay separate from the final fit.
{
 const st=fresh();openCarga(st,yes);const s=riverMarketView(st).carga.source;
 placeItem(st,'miel-1','cafe',yes);const before=bytes(st);
 const r=submitCarga(st,yes);ok(r.incomplete&&bytes(st)===before,'items on the landing: nothing recorded');
 ok(answerCarga(st,'tres',yes).error==='not-yet','question waits for the first Done');
 placeAll(st,{'harina-1':'cafe'});
 const first=submitCarga(st,yes);ok(first.ok&&!first.outcome.all&&first.outcome.lines.join()==='harina-cafe','a wrong place gets its line');
 const e=()=>st.spanish.errands.carga;
 ok(e().taskEvidence.firstSubmission.outcome.lines.join()==='harina-cafe'&&e().taskEvidence.hints.join()==='harina-cafe','hint recorded with the first submission');
 placeItem(st,'harina-1','panaderia',yes);submitCarga(st,yes);
 ok(e().taskEvidence.submissions===2&&e().taskEvidence.firstSubmission.outcome.all===false&&e().taskEvidence.hints.join()==='harina-cafe,all','later submissions keep the first and add hints');
 ok(answerCarga(st,'dos',yes).fitted===false&&e().state==='started','non-fitting pick stays started');
 ok(answerCarga(st,'cuatro',yes).fitted===false,'every nudge reachable');
 ok(answerCarga(st,'tres',yes).fitted&&e().state==='done','done when placement and question both fit');
 ok(e().answer.picks.join()==='dos,cuatro,tres','picks kept in order');
 ok(placeItem(st,'miel-1','jardin',yes).error==='done','a done errand is not moved');
 ok(validErrand(e())&&s.items.length===5,'done errand validates');
}

// An untouched task stays unobserved; support marks before it shows and survives resume.
{
 const st=fresh();openCarga(st,yes);
 ok(st.spanish.errands.carga.taskEvidence.firstSubmission===null,'unobserved until submitted');
 ok(useRiverSupport(st,'meaning',yes).ok&&st.spanish.errands.carga.support.meaning,'meaning recorded');
 const resumed=JSON.parse(bytes(st));ok(riverMarketView(resumed).carga.support.meaning,'support survives resume');
 placeAll(st);submitCarga(st,yes);ok(st.spanish.errands.carga.taskEvidence.firstSubmission.support.meaning,'first submission records the support then in use');
 ok(useRiverSupport(st,'meaning',yes).changed===false&&useRiverSupport(st,'bogus',yes).ok===false,'repeat is a no-op, unknown support refused');
}

// Start again: exact move to earlier, only real capacity refuses, familiar set.
{
 const st=fresh();openCarga(st,yes);placeAll(st);submitCarga(st,yes);answerCarga(st,'tres',yes);
 seeBoatLine(st,yes);ok(st.spanish.boatLineSeen&&!riverMarketView(st).boatLinePending,'boat line once');
 const done=bytes(st.spanish.errands.carga);
 ok(startCargaAgain(st,yes).ok&&bytes(st.spanish.earlier[0])===done,'moves the errand unchanged');
 ok(st.spanish.errands.carga.tryId===2&&st.spanish.errands.carga.familiar&&st.spanish.errands.carga.state==='started','fresh try is familiar');
 for(let n=0;n<9;n++)startCargaAgain(st,yes);
 ok(st.spanish.earlier.length===10,'no fixed cap below capacity');
 const full=bytes(st);ok(startCargaAgain(st,{canExport:()=>false}).error==='capacity'&&bytes(st)===full,'a capacity refusal changes nothing');
 ok(new Set([st.spanish.errands.carga,...st.spanish.earlier].map(e=>e.tryId)).size===11,'ids never reused');
 ok(riverMarketView(st).label==='started'&&riverMarketView(st).familiar,'label and familiarity');
}

// Restarting an unfinished, supported errand keeps it exactly and marks the fresh one familiar at the current amount.
{
 const st=fresh();openCarga(st,yes);useRiverSupport(st,'meaning',yes);placeItem(st,'miel-1','cafe',yes);
 const kept=bytes(st.spanish.errands.carga);setRiverAmount(st,'longer',yes);
 ok(startCargaAgain(st,yes).ok&&bytes(st.spanish.earlier[0])===kept,'unfinished try kept exactly');
 const e=st.spanish.errands.carga;ok(e.familiar&&e.source.amount==='longer'&&!e.support.meaning,'fresh try is familiar, longer and unsupported');
 ok(riverMarketView(st).label==='started','an unfinished earlier try is not Done before');
}

// A frozen source resumes unchanged after content keys, wording and order change.
{
 const st=fresh();openCarga(st,yes);const e=st.spanish.errands.carga;
 e.source=structuredClone(e.source);e.source.sentences[0].es='Una línea de antes.';e.source.places.reverse();e.source.question.choices[0].nudge='An earlier nudge.';
 ok(validErrand(e),'an older readable source need not match today');
 placeAll(st);ok(submitCarga(st,yes).outcome.all,'actions resolve from the frozen source');
 ok(riverMarketView(st).carga.source.sentences[0].es==='Una línea de antes.','display reads the frozen text');
}

// Duplicate try ids are ineligible for receipts but stay readable.
{
 const st=fresh();openCarga(st,yes);placeAll(st);submitCarga(st,yes);startCargaAgain(st,yes);
 ok(riverMarketTries(st).length===2,'two unique tries');
 st.spanish.errands.carga.tryId=1;
 ok(riverMarketTries(st).length===0&&riverMarketView(st).cargaReadable,'shared id: neither eligible, both readable');
}

// Unreadable and unknown-version records stay exact.
{
 const raw={spanish:{v:2,anything:[1,2,3]}},before=bytes(raw);
 ok(riverMarketView(raw).status==='unsupported'&&openCarga(raw,yes).ok===false&&setRiverAmount(raw,'short',yes).ok===false&&bytes(raw)===before,'unknown version is read-only');
 const st=fresh();openCarga(st,yes);st.spanish.errands.carga.task.placements['miel-1']='luna';const kept=bytes(st);
 ok(!riverMarketView(st).cargaReadable&&riverMarketView(st).label==='started','unreadable errand shown as unavailable');
 ok(placeItem(st,'miel-2','cafe',yes).ok===false&&bytes(st)===kept,'no edit to an unreadable errand');
 ok(startCargaAgain(st,yes).ok&&st.spanish.earlier[0].task.placements['miel-1']==='luna','Start again keeps the raw errand exactly');
 const bad=[null,[],'x',{v:1},{v:1,amount:'short',errands:[],earlier:[],nextTry:1,boatLineSeen:false}];
 for(const value of bad){const s={spanish:value};const b=bytes(s);riverMarketView(s);ok(bytes(s)===b,'views never repair');}
}

// A refused real-transfer preflight leaves the whole notebook unchanged; a missing preflight refuses.
{
 const st={other:{keep:true}};const before=bytes(st);
 ok(openCarga(st,{canExport:()=>false}).error==='capacity'&&bytes(st)===before,'refused export changes nothing');
 ok(openCarga(st,{}).error==='capacity'&&bytes(st)===before,'missing preflight refuses');
 ok(openCarga(st,{canExport:()=>{throw new Error('boom');}}).ok===false&&bytes(st)===before,'throwing preflight refuses');
 openCarga(st,yes);const mid=bytes(st);
 ok(placeItem(st,'miel-1','cafe',{canExport:()=>false}).ok===false&&bytes(st)===mid,'refused edit changes nothing');
}

// Source check: shipped text matches the panel-resolved companion and has no em-dash.
{
 const companion=readFileSync(new URL('../docs/content/117-river-market-text.md',import.meta.url),'utf8').replace(/\*/g,'');
 const plain=x=>x.replace(/<\/?i>/g,'');
 const shipped=[];
 for(const amount of ['short','longer']){const s=makeCargaSource(amount);
  shipped.push(...s.sentences.flatMap(x=>[x.es,x.en]),...s.feedback.wrong.map(w=>w.es),s.feedback.all.es,s.feedback.all.en,s.question.es,s.question.en,...s.question.choices.map(c=>c.nudge),...s.places.map(p=>p.label),s.prompt);}
 shipped.push(riverMarketText.homeLink,riverMarketText.opening,riverMarketText.later,riverMarketText.noVoice,riverMarketText.helped,riverMarketText.boatLine.es,riverMarketText.boatLine.en,riverMarketText.capacity,riverMarketText.unavailable,riverMarketText.invitation,riverMarketText.notesDetails,...Object.values(riverMarketText.grammar).map(g=>g.text));
 for(const line of shipped)ok(companion.includes(plain(line)),`in the companion: ${plain(line).slice(0,60)}`);
 const spec=readFileSync(new URL('../docs/specs/324-river-market-cargo.md',import.meta.url),'utf8');
 for(const line of [riverMarketText.stillOnLanding,riverMarketText.amountLocked,riverMarketText.startedAgain,riverMarketText.phrasebookEmpty,riverMarketText.phrasebookBack,riverMarketText.wordByWord,riverMarketText.nextSentence,riverMarketText.pickedUp,riverMarketText.unknownVersion,riverMarketText.notesLink])ok(spec.includes(line),`in the 324 table: ${line}`);
 const all=bytes(riverMarketText)+bytes(makeCargaSource('longer'))+bytes(makeCargaSource('short'));
 ok(!all.includes('—'),'no em-dash in shipped text');
 ok(!/junco/.test(all),'the panel replaced junco');
}

// Local Spanish speech works like French and never falls back to another language.
{
 const v=(name,lang,local=true,extra={})=>({name,lang,localService:local,voiceURI:name,...extra});
 const list=[v('Ana','es-ES'),v('Remote','es-ES',false),v('Amélie','fr-FR'),v('Alex','en-US')];
 ok(localVoices(list,'es').map(x=>x.name).join()==='Ana','only local es-* voices');
 ok(localVoices(list,'fr').map(x=>x.name).join()==='Amélie'&&localVoices(list,'en').map(x=>x.name).join()==='Alex','French and English lists unchanged');
 ok(chooseLocalVoice(list,'','es').name==='Ana','automatic Spanish voice');
 ok(chooseLocalVoice([v('Alex','en-US')],'','es')===null,'only English voices: no Spanish voice, no fallback');
 ok(chooseLocalVoice(list,'Alex','es').name==='Ana','a saved English choice does not replace the Spanish voice');
 ok(chooseLocalVoice(list,'Ana','fr').name==='Amélie'&&chooseLocalVoice(list,'Gone','es')===null,'other-language choices and absent choices keep their rules');
 const b=hearButton('¡Hola!','Hear it','es');ok(b.includes('data-speak-lang="es"')&&b.includes('lang="es"'),'hear button marks Spanish');
 ok(hearButton('Bonjour','Hear it','fr').includes('data-speak-lang="fr"')&&hearButton('Hi').includes('data-speak-lang="en"')&&!hearButton('Hi').includes(' lang='),'French and English buttons unchanged');
 ok(spoken('3/4 = ½','es')==='3/4 = ½'&&spoken('3/4','en')==='3 quarters','Spanish text is spoken as written');
}

// Renders and Notes make no write, for any JSON value at spanish.
{
 const states=[{},{spanish:null},{spanish:[]},{spanish:'x'},{spanish:{v:2}},{spanish:{v:1}}];
 const st=fresh();openCarga(st,yes);placeAll(st,{'miel-1':'jardin'});submitCarga(st,yes);useRiverSupport(st,'meaning',yes);states.push(st);
 const done=fresh();openCarga(done,yes);placeAll(done);submitCarga(done,yes);answerCarga(done,'tres',yes);states.push(done);
 for(const x of states){const b=bytes(x);const page=riverMarketPage(x),notes=riverMarketNotes(x);ok(typeof page==='string'&&typeof notes==='string'&&bytes(x)===b,'render and notes are pure');}
 const page=riverMarketPage(st);
 ok(page.includes("lang='es'")&&page.includes('data-speak-lang="es"'),'Spanish is marked and spoken as Spanish');
 ok(page.includes('The honey is in the garden. Is it for the garden?')===false,'Marisol lines appear only after Done in this session');
 ok(page.includes('How many jars of honey are there?')&&page.includes('Reeds grow well')===false,'question shows after submission; short note has no reed line');
 ok(!riverMarketPage(done).includes('data-river-action=\'done\''),'no Done unloading once done');
 ok(riverMarketNotes(st).includes('La carga started, with English help.')&&riverMarketNotes(done).includes('La carga done.'),'grown-up line');
 ok(riverMarketNotes({})==='','no root, no notes section');
}
console.log(`${checks} river market checks passed.`);
