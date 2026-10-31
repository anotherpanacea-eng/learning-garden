// Spec 328 El camino: the frozen source, the move table, evidence, the question, per-errand support and try ids, Mi cuaderno and the source check.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {makeCaminoSource,makeCargaSource,riverMarketText} from '../dist/river-market-content.mjs';
import {validCaminoSource,validCaminoErrand,validErrand,riverMarketView,riverMarketTries,openCamino,openCarga,moveTeo,answerCamino,answerCarga,useRiverSupport,useCuadernoSupport,startCaminoAgain,startCargaAgain,setRiverAmount,placeItem,submitCarga} from '../dist/river-market-core.mjs';
import {riverMarketPage,riverMarketNotes} from '../dist/river-market-ui.mjs';
let checks=0;const ok=(value,label)=>{assert.ok(value,label);checks++;};
const yes={canExport:()=>true},no={canExport:()=>false},bytes=s=>JSON.stringify(s);
const opened=(amount='short')=>{const st={};if(amount!=='short')setRiverAmount(st,amount,yes);openCamino(st,yes);return st;};
const walk=(st,moves)=>moves.map(b=>moveTeo(st,b,yes));
const cam=st=>st.spanish.errands.camino;
// With La carga done, arrival shows El camino, the first errand that isn't done.
function doneCarga(st){openCarga(st,yes);const e=st.spanish.errands.carga;for(const i of e.source.items)placeItem(st,i.id,e.source.targets[i.kind],yes);submitCarga(st,yes);answerCarga(st,e.source.question.fit,yes);return st;}

// Both amounts: a valid, frozen, bounded source with the spec's table.
for(const amount of ['short','longer']){
 const s=makeCaminoSource(amount);
 ok(validCaminoSource(s)&&Object.isFrozen(s)&&Object.isFrozen(s.moves),`${amount} source is valid and frozen`);
 ok(s.sentences.length===5,`${amount} note has five sentences`);
 ok(s.map.map(n=>n.label).join(' · ')==='el muelle · el puente · la plaza · la panadería · el café · la oficina de correos','map labels in companion order');
 ok(s.buttons.map(b=>`${b.es} ${b.arrow}`).join(' · ')==='recto ↑ · cruza ⤳ · a la izquierda ← · a la derecha →','buttons as the companion gives them');
 ok(s.question.fit===(amount==='short'?'cafe':'correos'),'the fitting choice for the amount');
 ok(new TextEncoder().encode(bytes(s)).length<=48*1024,'source fits 48 KiB');
 ok(!validCaminoSource({...s,moves:{...s.moves,plaza:{...s.moves.plaza,recto:'muelle'}}}),'the landing is never a destination');
 ok(!validCaminoSource({...s,start:'plaza'})&&!validCaminoSource({...s,errand:'carga'}),'start and errand are fixed');
}
ok(makeCaminoSource('medium')===null,'unknown amount makes no source');

// The move table, cell by cell, from a fresh walk to each node.
{
 const to={muelle:[],puente:['recto'],plaza:['recto','cruza'],correos:['recto','cruza','derecha']};
 const table={muelle:{recto:'puente',cruza:'nothing',izquierda:'stays',derecha:'stays'},puente:{recto:'stays',cruza:'plaza',izquierda:'stays',derecha:'stays'},plaza:{recto:'stays',cruza:'nothing',izquierda:'panaderia',derecha:'correos'},correos:{recto:'stays',cruza:'nothing',izquierda:'stays',derecha:'stays'}};
 for(const amount of ['short','longer'])for(const [node,row] of Object.entries(table))for(const [b,cell] of Object.entries(row)){
  const st=opened(amount);ok(cam(st).source.amount===amount,'the walk uses its amount');walk(st,to[node]);const before=cam(st).task.moveCount,r=moveTeo(st,b,yes),e=cam(st);
  const where=['nothing','stays'].includes(cell)?node:cell;
  ok(r.ok&&e.task.at===where,`${node} + ${b} -> ${where}`);
  ok(e.task.moveCount===before+1,`${node} + ${b} counts one move, staying or not`);
  if(cell==='nothing'||cell==='stays')ok(r.line===cell&&e.taskEvidence.hints.includes(cell),`${node} + ${b} records the ${cell} hint`);
 }
}

// Wrong turn, the hint, Back to the plaza, then the bakery.
{
 const st=opened();
 ok(moveTeo(st,'back',yes).error==='selection','Back is only at the post office');
 walk(st,['recto','cruza','derecha']);let e=cam(st);
 ok(e.taskEvidence.firstArrival.destination==='correos'&&e.taskEvidence.hints.includes('correos'),'first arrival keeps the post office and its hint');
 ok(answerCamino(st,'puente',yes).fitted===false&&cam(st).answer.picks.join()==='puente','the question opens after a first arrival');
 ok(moveTeo(st,'back',yes).at==='plaza'&&cam(st).task.moves.at(-1)==='back','Back to the plaza is a move');
 const r=moveTeo(st,'izquierda',yes);e=cam(st);
 ok(r.at==='panaderia'&&r.line==='panaderia'&&e.state==='started','the bakery without a fitting pick is not yet done');
 ok(e.taskEvidence.firstArrival.destination==='correos','firstArrival is kept once');
 ok(moveTeo(st,'recto',yes).error==='arrived'&&cam(st).task.moveCount===5,'no moves once Teo is at the bakery');
 answerCamino(st,'cafe',yes);ok(cam(st).state==='done'&&riverMarketView(st).caminoLabel==='done','bakery plus a fitting latest pick is Done');
 ok(answerCamino(st,'cafe',yes).error==='done','Done refuses further picks');
}
{
 const st=opened();ok(answerCamino(st,'cafe',yes).error==='not-yet','no question before an arrival');
 walk(st,['recto','cruza','derecha']);answerCamino(st,'cafe',yes);ok(cam(st).state==='started','a fitting pick at the post office waits for the bakery');
 walk(st,['back','izquierda']);ok(cam(st).state==='done','reaching the bakery then completes it');
 const notFit=opened();walk(notFit,['recto','cruza','derecha']);answerCamino(notFit,'cafe',yes);answerCamino(notFit,'muelle',yes);walk(notFit,['back','izquierda']);
 ok(cam(notFit).state==='started'&&cam(notFit).answer.fitted===false,'the latest pick decides');
}

// Moves: the latest 32 and the full count; firstArrival after a long walk; the 9999 bound refuses unchanged.
{
 const st=opened();for(let i=0;i<40;i++)moveTeo(st,'izquierda',yes);
 walk(st,['recto','cruza','izquierda']);const e=cam(st);
 ok(e.task.moves.length===32&&e.task.moveCount===43&&e.task.moves.at(-1)==='izquierda','moves keep the latest 32 and the full count');
 ok(e.taskEvidence.firstArrival.moves.length===32&&e.taskEvidence.firstArrival.moveCount===43&&e.taskEvidence.firstArrival.moves.slice(-3).join()==='recto,cruza,izquierda','firstArrival keeps the latest 32 with the arrival move and the full count');
 const big=opened();cam(big).task.moveCount=9999;cam(big).task.moves=Array(32).fill('izquierda');
 ok(validCaminoErrand(cam(big)),'9999 moves is still readable');const b=bytes(big);
 ok(moveTeo(big,'recto',yes).error==='capacity'&&bytes(big)===b,'a move past 9999 refuses without changing the save');
 const resumed=JSON.parse(bytes(opened()));walk(resumed,['recto']);const copy=JSON.parse(bytes(resumed));
 ok(moveTeo(copy,'cruza',yes).at==='plaza','a resumed walk continues from the saved node');
}

// A frozen source resumes unchanged when the content module's map, labels, wording and order change.
{
 const st=opened();walk(st,['recto','cruza']);const saved=JSON.parse(bytes(st)),s=saved.spanish.errands.camino.source;
 s.map[2].label='la plazuela';s.moves.plaza.izquierda='correos';s.moves.plaza.derecha='panaderia';s.feedback.panaderia.es='¡Por fin, la panadería!';s.question.choices.reverse();s.sentences[3].es='En la plazuela, gira a la derecha.';
 ok(validCaminoErrand(saved.spanish.errands.camino),'an older frozen source stays readable');
 const page=riverMarketPage(doneCarga(saved));ok(page.includes('la plazuela')&&page.includes('En la plazuela, gira a la derecha.'),'the frozen labels and sentences render');
 const r=moveTeo(saved,'derecha',yes);ok(r.at==='panaderia'&&cam(saved).source.feedback.panaderia.es==='¡Por fin, la panadería!','moves resolve from the frozen table, not the module');
 const order=cam(saved).source.question.choices.map(c=>c.id).join();ok(order==='muelle,puente,cafe','the frozen choice order is kept');
 ok(riverMarketPage(saved).indexOf("data-river-choice='muelle'")<riverMarketPage(saved).indexOf("data-river-choice='cafe'"),'the question renders in the frozen order');
 answerCamino(saved,'cafe',yes);ok(cam(saved).state==='done','the frozen fit decides');
}

// An unreadable El camino record and an unknown errand record leave La carga open and stay exact.
{
 const st=opened();cam(st).task.at='cafe';st.spanish.errands.receta={tryId:99,future:true};st.spanish.earlier.push({tryId:98,errand:'tiempo'});
 const keep=bytes({camino:cam(st),receta:st.spanish.errands.receta,earlier:st.spanish.earlier});
 ok(openCarga(st,yes).ok&&st.spanish.errands.carga.tryId===2,'La carga opens beside them');
 const e=st.spanish.errands.carga;for(const i of e.source.items)placeItem(st,i.id,e.source.targets[i.kind],yes);submitCarga(st,yes);
 ok(bytes({camino:cam(st),receta:st.spanish.errands.receta,earlier:st.spanish.earlier.slice(0,1)})===keep,'the unreadable and unknown records are kept exactly');
 // Decode the saved-data section and compare every retained record with its original.
 const pre=riverMarketNotes(st).match(/<pre>([\s\S]*)<\/pre>/)[1].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
 const exported=JSON.parse(pre),original=JSON.parse(keep);
 assert.deepEqual(exported.errands.camino,original.camino);assert.deepEqual(exported.errands.receta,original.receta);assert.deepEqual(exported.earlier,original.earlier);
 ok(true,'the saved-data section carries the unreadable camino, the unknown errand and the unknown earlier record exactly');
 assert.deepEqual(exported,JSON.parse(bytes(st.spanish)));ok(true,'and the whole spanish root exactly');
 ok(riverMarketView(st).earlier[0].readable===false&&riverMarketView(st).earlier[0].kind===null,'an unknown earlier record is listed as unreadable');
}

// Evidence shape: arrival is never reconstructed; damaged records are unreadable, not repaired.
{
 const st=opened();walk(st,['recto','cruza','derecha']);const e=cam(st);
 ok(validCaminoErrand(e),'a walked errand is valid');
 const bad=[x=>{x.task.at='cafe';},x=>{x.task.at='nowhere';},x=>{x.taskEvidence.firstArrival=null;},x=>{x.taskEvidence.hints.push('stays','stays');},x=>{x.task.moves.push('fly');},x=>{x.state='done';},x=>{x.taskEvidence.firstArrival.destination='plaza';},x=>{x.task.moveCount=10000;}];
 for(const f of bad){const x=structuredClone(e);f(x);ok(!validCaminoErrand(x),`rejects ${f.toString().slice(3,60)}`);}
 const u=structuredClone(st);u.spanish.errands.camino.task.at='cafe';const b=bytes(u);
 ok(riverMarketView(u).camino===null&&riverMarketView(u).caminoPresent,'an unreadable camino shows as present but unavailable');
 ok(moveTeo(u,'recto',yes).error==='unavailable'&&bytes(u)===b,'and refuses moves unchanged');
 const fresh={};openCamino(fresh,yes);ok(riverMarketPage(fresh).includes("aria-current='true'>La carga")||riverMarketPage(fresh).includes("open' aria-current='true'"),'arrival shows La carga first when it is not done');
 ok(riverMarketPage(u).includes("data-river-action='open-camino'")&&bytes(u)===b,'still lists El camino, without a write');
}

// Support: recorded before English shows, per errand; firstArrival's support never changes.
{
 const st=opened();walk(st,['recto','cruza','izquierda']);
 useRiverSupport(st,'meaning',yes,'camino');const e=cam(st);
 ok(e.support.meaning&&e.taskEvidence.firstArrival.support.meaning===false,'firstArrival support is a snapshot');
 ok(useRiverSupport(st,'meaning',yes,'nope').error==='selection','unknown errand refused');
 openCarga(st,yes);ok(st.spanish.errands.carga.support.meaning===false,'carga support is separate');
 const b=bytes(st);ok(useRiverSupport(st,'narration',no,'camino').error==='capacity'&&bytes(st)===b,'a refused support write changes nothing');
}

// Mi cuaderno: one write marks meaning for every opened errand; a refusal changes nothing; nothing opened, no write.
{
 const none={};ok(useCuadernoSupport(none,yes).changed===false&&bytes(none)==='{}','nothing opened, no write');
 const st=opened();openCarga(st,yes);const b=bytes(st);
 ok(useCuadernoSupport(st,no).error==='capacity'&&bytes(st)===b,'refused cuaderno write changes nothing');
 ok(useCuadernoSupport(st,yes).ok&&cam(st).support.meaning&&st.spanish.errands.carga.support.meaning,'both opened errands marked in one write');
 ok(useCuadernoSupport(st,yes).changed===false,'already marked, no write');
}

// Try ids, Start again, familiarity and Done before per errand, and mixed collisions.
{
 const st=opened();walk(st,['recto','cruza','izquierda']);answerCamino(st,'cafe',yes);const old=structuredClone(cam(st));
 setRiverAmount(st,'longer',yes);ok(startCaminoAgain(st,yes).ok,'Start again');
 ok(bytes(st.spanish.earlier.at(-1))===bytes(old),'the old try is kept exactly');
 ok(cam(st).tryId===2&&cam(st).familiar&&cam(st).source.amount==='longer'&&cam(st).task.at==='muelle','fresh try: new id, familiar, current amount, at the landing');
 ok(riverMarketView(st).caminoLabel==='started','the fresh try is started');
 openCarga(st,yes);ok(st.spanish.errands.carga.tryId===3&&!st.spanish.errands.carga.familiar,'La carga takes the next shared id and is not familiar from El camino');
 ok(riverMarketView(st).label==='started','camino Done before does not mark La carga');
 const unfinished=opened();startCaminoAgain(unfinished,yes);ok(cam(unfinished).familiar&&riverMarketView(unfinished).caminoLabel==='started','familiar after an unfinished try');
 const before=opened();walk(before,['recto','cruza','izquierda']);answerCamino(before,'cafe',yes);startCaminoAgain(before,yes);delete before.spanish.errands.camino;
 ok(riverMarketView(before).caminoLabel==='before','Done before per errand');
 const b=bytes(st);ok(startCaminoAgain(st,no).error==='capacity'&&bytes(st)===b,'Start again refused only by capacity, unchanged');
}
{
 const st={};openCarga(st,yes);openCamino(st,yes);
 ok(riverMarketTries(st).map(e=>e.tryId).join()==='1','riverMarketTries returns La carga only');
 st.spanish.errands.camino.tryId=1;
 ok(validCaminoErrand(cam(st))&&validErrand(st.spanish.errands.carga),'mixed collision: both stay readable');
 ok(riverMarketTries(st).length===0,'a carga id shared with a camino record is not receipt-eligible');
 const st2={};openCamino(st2,yes);st2.spanish.nextTry=1;ok(openCarga(st2,yes).error==='unavailable','a fresh id that collides with El camino is refused');
 const st3={};openCamino(st3,yes);walk(st3,['recto','cruza','izquierda']);answerCamino(st3,'cafe',yes);
 ok(riverMarketTries(st3).length===0,'riverMarketTries never returns an El camino try');
}

// Preflight: every explicit camino write refuses unchanged.
{
 const st=opened();walk(st,['recto','cruza','derecha']);const b=bytes(st);
 for(const [name,f] of [['open',s=>openCamino({},no)],['move',s=>moveTeo(s,'back',no)],['pick',s=>answerCamino(s,'cafe',no)],['again',s=>startCaminoAgain(s,no)]]){const r=f(st);ok(r.error==='capacity'&&bytes(st)===b,`${name} refuses unchanged`);}
}

// The page: render makes no write; the errand list, map, place text, buttons and the grown-up line.
{
 const st=opened();walk(st,['recto','cruza','derecha']);doneCarga(st);const b=bytes(st);
 const page=riverMarketPage(st);ok(bytes(st)===b,'render is pure');
 ok(page.includes('data-river-action=\'open\'')&&page.includes('data-river-action=\'open-camino\''),'the errand list has both entries');
 ok(page.indexOf('La carga')<page.indexOf('El camino'),'in list order');
 ok(page.includes("role='img' aria-labelledby='river-teo-place'")&&page.includes("Teo is at <i lang='es'>la oficina de correos</i>."),'Teo\'s place in text and as the map description');
 ok(page.includes("aria-label='Move Teo'")&&page.includes("data-river-action='back'"),'Move Teo group and Back at the post office');
 ok(page.includes('Read the line about <i>la plaza</i> again.')&&page.includes('¿Dónde está la panadería?'),'hint and question after the first arrival');
 ok(page.includes('Give a grown-up directions'),'the second invitation');
 const done=opened();walk(done,['recto','cruza','izquierda']);answerCamino(done,'cafe',yes);doneCarga(done);
 const atBakery=opened();walk(atBakery,['recto','cruza','izquierda']);doneCarga(atBakery);const bp=riverMarketPage(atBakery);
 ok(bp.includes('data-river-move')===false&&bp.includes('¡La panadería! Huele a pan. ¡Gracias!'),'buttons replaced by the arrival line at the bakery');
 ok(riverMarketNotes(st).includes('La carga done. El camino started.')&&riverMarketNotes(done).includes('El camino done.'),'grown-up line names both errands');
 useRiverSupport(done,'meaning',yes,'camino');ok(riverMarketNotes(done).includes('El camino done, with English help.'),'with English help');
 for(const x of [{spanish:null},{spanish:[]},{spanish:{v:1,errands:{camino:'x'},earlier:[],amount:'short',nextTry:1,boatLineSeen:false}}]){const bb=bytes(x);riverMarketPage(x);riverMarketNotes(x);ok(bytes(x)===bb,'any JSON value at spanish is safe');}
}

// Source check: shipped El camino text matches the companion or the 328 table, with no em-dash.
{
 const companion=readFileSync(new URL('../docs/content/117-river-market-text.md',import.meta.url),'utf8').replace(/\*/g,'');
 const spec=readFileSync(new URL('../docs/specs/328-river-market-camino.md',import.meta.url),'utf8');
 const plain=x=>x.replace(/<\/?i>/g,'');
 for(const amount of ['short','longer']){const s=makeCaminoSource(amount),f=s.feedback;
  const lines=[...s.sentences.flatMap(x=>[x.es,x.en]),...s.words.flatMap(w=>[w.es,w.en]),...s.map.map(n=>n.label),s.prompt,f.start.es,f.start.en,f.nothing.es,f.nothing.en,f.nothing.lead,f.nothing.tail,f.correos.es,f.correos.en,f.correos.hint,f.panaderia.es,f.panaderia.en,s.back.label,s.question.es,s.question.en,...s.question.choices.flatMap(c=>[c.es,c.nudge]),s.grammar.directions.text,s.invitation];
  for(const line of lines)ok(companion.includes(plain(line)),`in the companion: ${plain(line).slice(0,60)}`);
  for(const line of [f.stays.text,s.group])ok(spec.includes(line),`in the 328 table: ${line}`);
  ok(spec.includes(s.place.replace('{place}','{place}')),'place line in the 328 table');
  ok(!bytes(s).includes('—'),'no em-dash');
 }
}
console.log(`${checks} El camino checks passed.`);
