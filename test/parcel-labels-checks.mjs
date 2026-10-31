import assert from 'node:assert/strict';
import {freshState} from '../dist/core.mjs';
import {prepareProgressImport} from '../dist/progress-transfer.mjs';
import {makeParcelSource} from '../dist/parcel-labels-content.mjs';
import {parcelLabelsPage, parcelLabelsNotes, parcelPicture} from '../dist/parcel-labels-ui.mjs';
import {parcelLabelsView, parcelLabel, parcelReady, validParcelSource, validParcelWork, startParcel,
  openParcel, setParcelPiece, setParcelMessage, showParcelHelp, checkParcel, keepParcel, removeParcel} from '../dist/parcel-labels-core.mjs';

let checks = 0;
const ok = (value, message) => {assert.ok(value, message); checks++;};
const equal = (actual, expected, message) => {assert.deepEqual(actual, expected, message); checks++;};
const clone = x => structuredClone(x);
const json = x => JSON.stringify(x);
const options = {canExport: candidate => prepareProgressImport(json(candidate)).ok};
const work = s => parcelLabelsView(s).work;
const oracle = {bun:'buns', cup:'cups', pot:'pots', box:'boxes', dish:'dishes', brush:'brushes',
  berry:'berries', cherry:'cherries', daisy:'daisies', tray:'trays', key:'keys', toy:'toys'};

// Independent literal noun oracle; enumerate every generated noun/count combination.
const combinations = new Set();
for (let serial = 1; serial <= 60; serial++) {
  const source = makeParcelSource(serial);
  ok(validParcelSource(source), 'every authored source is readable');
  equal(source.plural, oracle[source.base], 'authoritative conventional spelling');
  equal(source.expected, source.count === 1 ? source.base : oracle[source.base], 'meaning sets the target');
  combinations.add(`${source.base}:${source.count}`);
  const stems = source.trimmed === null ? ['keep'] : ['keep', 'trim'];
  for (const stem of stems) for (const ending of ['none', 's', 'es', 'ies']) {
    const s = {...freshState(), parcelLabels:{version:1, currentId:source.id, nextSerial:serial+1, visits:{
      [source.id]:{source:clone(source), draft:{stem, ending}, ownMessage:'', help:false, checks:[], ready:false},
    }}};
    const literal = (stem === 'trim' ? source.base.slice(0,-1) : source.base) + (ending === 'none' ? '' : ending);
    equal(parcelLabel(work(s)), literal, 'literal pieces are not autocorrected');
    const r = checkParcel(s, options);
    ok(r.ok, 'each legal construction can be checked');
    equal(r.record.outcome, literal === (source.count === 1 ? source.base : oracle[source.base]) ? 'match' : 'different', 'construction checked against the frozen task');
    equal(r.record.label, literal, 'literal response retained');
    equal(r.record.supported, true, 'every tile construction remains supported');
    equal(r.record.helpSeenBefore, false, 'optional help distinct from supplied construction');
    ok(r.record.feedback.includes(`Your label: ${literal}.`), 'feedback names the actual label');
    equal(parcelReady(work(s)), r.record.outcome === 'match', 'readiness follows an actual matching check');
    if (source.count === 1 && stem === 'trim') ok(r.record.feedback.includes(`Keep ${source.base}`), 'singular-y correction names the real stem control');
    if (source.base === 'daisy' && ['dais','daises'].includes(literal)) ok(r.record.feedback.includes('raised platform'), 'dais/daises are meaningful words, not fragments');
    if (source.base === 'toy' && literal === 'toes') ok(r.record.feedback.includes('real word for parts of a foot'), 'toes is a different meaningful word');
    if (source.count === 1 && source.base === 'toy' && literal === 'toes') ok(r.record.feedback.includes('about one toy.'), 'discovery respects a singular request');
    if (source.count === 1 && source.base === 'daisy' && ['dais','daises'].includes(literal)) ok(r.record.feedback.includes('about one cut flower.'), 'flower discovery respects a singular request');
    if (source.count > 1 && r.record.outcome === 'match' && source.family === 'ies') ok(r.record.feedback.includes('change y to i and add es'), 'chunk connects to the spelling transformation');
  }
}
equal(combinations.size, 60, 'all twelve nouns at all five quantities exercised');
for (const family of ['s','es','ies','keep-y']) {
  const words = new Set();
  for (let serial=1; serial<=3; serial++) words.add(makeParcelSource(serial,{family,quantity:'more'}).base);
  equal(words.size, 3, 'each selected family has three actual words');
}
equal(makeParcelSource(0), null, 'no zero serial');
equal(makeParcelSource(1,{family:'unknown'}), null, 'invalid selector does not silently choose a lesson');

const s = freshState(), before = json(s);
parcelLabelsView(s); equal(json(s), before, 'fresh view is pure');
ok(startParcel(s, {family:'ies',quantity:'more'}, options).ok, 'explicit start');
equal(Object.keys(s).sort(), [...Object.keys(freshState()),'parcelLabels'].sort(), 'start touches only its own extension');
equal(work(s).source.base, 'berry', 'deliberate starting family');
equal(work(s).draft.ending, null, 'no ending tile is preselected');
equal(checkParcel(s, options).error, 'choose-ending', 'missing selection is distinct from No ending');
setParcelPiece(s,'ending','s',options); checkParcel(s,options);
const firstAttempt = clone(work(s).checks[0]);
setParcelMessage(s, '<exact> First message & punctuation.', options);
ok(keepParcel(s,options).ok, 'a differing draft can be kept');
const firstKept = clone(work(s).firstKept);
showParcelHelp(s,options); setParcelPiece(s,'stem','trim',options); setParcelPiece(s,'ending','ies',options);
const corrected = checkParcel(s,options);
equal(corrected.record.outcome,'match','correction can fit');
equal(corrected.record.helpSeenBefore,true,'help exposure frozen before the correction');
equal(work(s).checks[0],firstAttempt,'first differing attempt not replaced');
setParcelMessage(s,'Latest message.',options); keepParcel(s,options);
equal(work(s).firstKept,firstKept,'first kept source/pieces/writing/history retained');
equal(work(s).latestKept.ownMessage,'Latest message.','latest kept version separate');
ok(parcelReady(work(s)),'matching current check is ready');
setParcelPiece(s,'ending','s',options); setParcelPiece(s,'ending','ies',options);
ok(!parcelReady(work(s)),'edit away/back needs a fresh check');
const imported = prepareProgressImport(json(s)); ok(imported.ok,'actual generic notebook transfer accepts the extension');
ok(!parcelReady(work(imported.state)),'transfer does not resurrect an old readiness stamp');
equal(imported.state.parcelLabels,s.parcelLabels,'exact source, writing and histories survive transfer');
checkParcel(s,options); ok(parcelReady(work(s)),'a fresh matching check restores readiness');

for (const mutation of [x=>setParcelPiece(x,'ending','es',{canExport:()=>false}),
  x=>setParcelMessage(x,'Refused',{canExport:()=>false}),x=>keepParcel(x,{canExport:()=>false}),
  x=>startParcel(x,{}, {canExport:()=>false}),x=>removeParcel(x,x.parcelLabels.currentId,true,{canExport:()=>false})]) {
  const t=clone(s), held=t.parcelLabels, raw=json(t); ok(!mutation(t).ok,'preflight refusal is explicit');
  equal(json(t),raw,'preflight refusal changes no notebook field'); ok(t.parcelLabels===held,'refusal preserves actual root identity');
}
const historical=clone(s), historicalWork=work(historical);
historicalWork.source.base='cactus';historicalWork.source.trimmed=null;
historicalWork.source.plural='cactuses';historicalWork.source.expected='cactuses';
historicalWork.draft={stem:'keep',ending:'es'};
ok(validParcelWork(work(historical)),'a frozen noun outside today’s catalog remains readable');
equal(checkParcel(historical,options).record.outcome,'match','frozen expected form, not today’s catalog, owns the check');
const heldOutcome=clone(historical.parcelLabels);setParcelMessage(historical,'Another note.',options);
equal(work(historical).checks,heldOutcome.visits[heldOutcome.currentId].checks,'saved results not regraded when writing');

const mixed=clone(s), current=mixed.parcelLabels.currentId;
mixed.parcelLabels.visits['unreadable-old']={source:{format:99},raw:['retained']};
mixed.parcelLabels.extra={future:'held'};work(mixed).source.futureMetadata={held:true};work(mixed).firstKept={format:99,raw:'keep exact'};
const rawSibling=clone(mixed.parcelLabels.visits['unreadable-old']), rawSnapshot=clone(work(mixed).firstKept);
ok(setParcelPiece(mixed,'ending','es',options).ok,'unknown snapshot does not close readable working controls');
equal(keepParcel(mixed,options).error,'kept-unavailable','unknown kept material cannot be overwritten');
equal(work(mixed).firstKept,rawSnapshot,'unknown snapshot exact');
ok(startParcel(mixed,{},options).ok,'unreadable sibling does not close a new slot');
ok(openParcel(mixed,current,options).ok,'readable older visit still opens');
equal(mixed.parcelLabels.visits['unreadable-old'],rawSibling,'unreadable sibling exact after actions');
equal(mixed.parcelLabels.extra,{future:'held'},'additive metadata retained');
equal(work(mixed).source.futureMetadata,{held:true},'additive source metadata retained');

const collision=clone(s);collision.parcelLabels.nextSerial=1;const collided=json(collision);
equal(startParcel(collision,{},options).error,'collision','occupied id refuses even with valid serial');equal(json(collision),collided,'collision does not repair counter or overwrite work');
const cap=freshState();for(let i=0;i<12;i++)ok(startParcel(cap,{},options).ok,'explicit visit allocation');
const capped=json(cap);equal(startParcel(cap,{},options).error,'visit-cap','capacity is explicit');equal(json(cap),capped,'no oldest-visit eviction');
const selected=Object.keys(cap.parcelLabels.visits)[3], others=clone(cap.parcelLabels.visits), serial=cap.parcelLabels.nextSerial;
equal(removeParcel(cap,selected,false,options).error,'confirmation','removal requires actual confirmation');equal(json(cap),capped,'cancel loses nothing');
ok(removeParcel(cap,selected,true,options).ok,'only selected visit removed');delete others[selected];equal(cap.parcelLabels.visits,others,'all other parcels exact');equal(cap.parcelLabels.nextSerial,serial,'removal never recycles identity');
const activeId=cap.parcelLabels.currentId;removeParcel(cap,activeId,true,options);equal(cap.parcelLabels.currentId,'','removing current does not auto-select another source');

const limit=clone(s);while(work(limit).checks.length<24)checkParcel(limit,options);
const limited=json(limit);equal(checkParcel(limit,options).error,'check-cap','response cap explicit');equal(json(limit),limited,'no automatic response trimming');
for(const root of [{version:99,raw:['future']},{version:1,currentId:'',nextSerial:1,visits:[]},null]) {
  const bad={...freshState(),parcelLabels:root}, raw=json(bad);parcelLabelsView(bad);
  equal(startParcel(bad,{},options).ok,false,'unsupported root refuses locally');equal(json(bad),raw,'unsupported root exact');
}
const odd=clone(s);odd.parcelLabels.nextSerial='future';const oddRaw=json(odd);parcelLabelsView(odd);equal(json(odd),oddRaw,'malformed selector read is pure');
ok(setParcelMessage(odd,'Still readable.',options).ok,'malformed creation counter leaves current writing open');equal(startParcel(odd,{},options).error,'counter','malformed counter never normalized');
for (const model of [freshState(), s, mixed, odd, {...freshState(),parcelLabels:{version:99,raw:'exact'}}]) {
  const held=json(model), page=parcelLabelsPage(model), notes=parcelLabelsNotes(model);
  ok(typeof page==='string' && typeof notes==='string','page and Notes read every retained scope');
  equal(json(model),held,'rendering and Notes never normalize saved work');
}
const escaped=clone(s);work(escaped).ownMessage='<tag> & "quoted"';keepParcel(escaped,options);
ok(parcelLabelsPage(escaped).includes('&lt;tag&gt; &amp; &quot;quoted&quot;'),'own writing escaped in play surface');
ok(parcelLabelsNotes(escaped).includes('&lt;tag&gt; &amp; &quot;quoted&quot;'),'own writing escaped in Notes');
ok(parcelLabelsPage(s).includes('Kept draft; no current matching check.'),'a differing first-kept label is explicitly a draft');
for (let serial=1;serial<=60;serial++) {
  const src=makeParcelSource(serial),picture=parcelPicture(src);
  equal((picture.match(/data-parcel-object/g)||[]).length,src.count,'picture explicitly repeats exactly the requested count');
  ok(picture.includes(src.count===1?'1 pictured object; it is called':'pictured objects; one is called'),'picture uses grammatical singular/plural accessible text');
  ok(!picture.includes(src.plural),'picture does not announce the target plural');
}
console.log(`Parcel labels: ${checks} source/model checks passed; native UI, art and hosted acceptance remain separate.`);
