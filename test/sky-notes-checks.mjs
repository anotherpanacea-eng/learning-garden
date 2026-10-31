// Spec 323 sky notes: civil dates, one readable note per date, raw preservation, capacity, hemisphere, atomic writes and picture mirroring.
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {SKY_SHAPES,SKY_CODES,SKY_COPY,SKY_PANELS,changePrompt} from '../dist/sky-notes-content.mjs';
import * as k from '../dist/sky-notes-core.mjs';
import {skyNotesNotes,skyNotesPage} from '../dist/sky-notes-ui.mjs';
const copy=structuredClone,root=fileURLToPath(new URL('../',import.meta.url));
const report=s=>({title:'After the Storm: observations',exportedAt:'2026-10-31T12:00:00.000Z',note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'sky',color:'blue',symbol:'leaf'},recommendation:recommendations(s),...s});
export const skyCanExport=s=>prepareProgressImport(JSON.stringify(report(s),null,2)).ok;
export function runSkyChecks(){
 let n=0;const ok=(v,m)=>{assert.ok(v,m);n++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},same=(a,b,m)=>{assert.equal(a,b,m);n++;};
 const options={canExport:skyCanExport},today='2026-10-31';
 const fresh=()=>{const s=initializeExplorerState(freshState());s.syntheticOther={waiting:'Synthetic untouched parcel'};return s;};
 const refused=(s,fn,m)=>{const before=copy(s),sky=s.sky,other=s.syntheticOther;eq(fn(),false,m);eq(s,before,`${m}: notebook unchanged`);same(s.sky,sky,`${m}: same sky root`);same(s.syntheticOther,other,`${m}: other root untouched`);};

 // 1. Dates.
 for(const d of ['2024-02-29','2000-02-29','0001-01-01','9999-12-31','2026-04-30'])ok(k.validCivilDate(d),`valid ${d}`);
 for(const d of ['2023-02-29','1900-02-29','0000-12-31','10000-01-01','2026-13-01','2026-04-31','2026-10-1','2026-10-31T00:00',20261031,null])ok(!k.validCivilDate(d),`invalid ${d}`);
 same(k.localCivilDate(new Date(2026,9,31,23,30)),'2026-10-31','local calendar components, not UTC truncation');
 same(k.localCivilDate(new Date(Number.NaN)),null,'invalid device date gives no date');
 {const s=fresh();refused(s,()=>k.saveSkyNote(s,'2026-10-30','full',{...options,today}),'date flipped forward refuses');refused(s,()=>k.saveSkyNote(s,'2026-11-01','full',{...options,today}),'date flipped back refuses');
  refused(s,()=>k.saveSkyNote(s,'2026-02-30','full',{...options,today:'2026-02-30'}),'invalid rendered date refuses');ok(!k.skyView(s,null).canWrite,'no device date: writes unavailable');ok(!Object.hasOwn(s,'sky'),'no sky root until first Save');}

 // 2 and 3. Last readable per date, raw preservation, revision, no-op and append.
 {const s=fresh();s.sky=[{date:today,shape:'full',note:{kept:'Synthetic first'}},{date:today,shape:'half-growing',extra:'Synthetic last readable'},{date:today,shape:'new',raw:'Synthetic unknown code'},null,'Synthetic raw string',{date:'2026-10-32',shape:'full'},{date:'2026-10-01',shape:'not-seen'},[{date:today,shape:'full'}],{shape:'full'}];
  const v=k.skyView(s,today);same(v.entry.shape,'half-growing','last readable entry wins');same(v.index,1,'selected index');same(v.readableCount,3,'readable entries counted raw');same(v.unreadableCount,6,'unreadable entries counted');eq(v.entries.map(e=>e.date),['2026-10-01',today],'one note per date, sorted');
  const before=copy(s);let probes=0;const counted={canExport:c=>{probes++;return skyCanExport(c);}};
  same(k.saveSkyNote(s,today,'half-growing',{...counted,today}),'same','same code is a no-op');same(probes,0,'no-op runs no preflight');eq(s,before,'no-op changes nothing');
  ok(k.saveSkyNote(s,today,'fat-growing',{...counted,today})===true,'revision saves');same(probes,1,'one preflight per write');
  const expect=copy(before);expect.sky[1].shape='fat-growing';eq(s,expect,'only .shape on the selected entry changed; every raw entry kept');
  const s2=copy(s);ok(k.saveSkyNote(s2,'2026-11-01','thin-growing',{...options,today:'2026-11-01'})===true,'append for a new date');eq(s2.sky.slice(0,-1),s.sky,'append keeps every earlier entry');eq(s2.sky.at(-1),{date:'2026-11-01',shape:'thin-growing'},'appended entry shape');
  const first=fresh();ok(k.saveSkyNote(first,today,'not-seen',{...options,today})===true,'first Save creates the root');eq(first.sky,[{date:today,shape:'not-seen'}],'not-seen is a full note');
  for(const bad of ['new','Full',' full',undefined,{}])refused(s,()=>k.saveSkyNote(s,today,bad,{...options,today}),`unknown code ${String(bad)} refuses`);}

 // 4. Capacity counts readable raw entries, duplicates included.
 {const s=fresh();s.sky=[];for(let i=0;i<1097;i++){const d=new Date(Date.UTC(2020,0,1+i));s.sky.push({date:d.toISOString().slice(0,10),shape:'full'});}s.sky.push({date:'2020-01-01',shape:'half-growing'});
  same(k.skyView(s,today).readableCount,1098,'1,098 readable entries');refused(s,()=>k.saveSkyNote(s,today,'full',{...options,today}),'new date refused at capacity');
  const t=copy(s);t.sky[1097].date=today;ok(k.saveSkyNote(t,today,'thin-shrinking',{...options,today})===true,"today's note can still change at capacity");same(t.sky.length,1098,'no eviction');
  const big=copy(s);for(let i=0;i<200;i++)big.sky.push({date:'2019-12-31',shape:'full',i});const imported=prepareProgressImport(JSON.stringify(report(big)));ok(imported.ok,'over-cap import accepted');eq(imported.state.sky,big.sky,'over-cap import intact');}

 // 5. Unsupported roots and the hemisphere setting.
 {const s=fresh();s.sky={kept:'Synthetic earlier object'};same(k.skyView(s,today).status,'unsupported','non-array root');refused(s,()=>k.saveSkyNote(s,today,'full',{...options,today}),'non-array sky blocks sky writes');
  ok(k.setHemisphere(s,'south',options)===true,'hemisphere still writes beside an unsupported sky root');eq(s.sky,{kept:'Synthetic earlier object'},'sky root untouched by the setting');
  const h=fresh();same(k.hemisphereView(h).effective,'north','missing means north');same(k.setHemisphere(h,'north',options),'same','choosing north when absent is a no-op');ok(!Object.hasOwn(h,'hemisphere'),'no-op writes nothing');
  h.hemisphere={dir:'east'};same(k.hemisphereView(h).effective,'north','unknown shows northern pictures');same(k.setHemisphere(h,'north',options),'same','current effective value is a no-op');eq(h.hemisphere,{dir:'east'},'unknown value kept verbatim');
  ok(k.setHemisphere(h,'south',options)===true,'explicit different choice replaces the root');same(h.hemisphere,'south','south saved');
  refused(h,()=>k.setHemisphere(h,'equator',options),'unknown choice refuses');
  const notes=fresh();notes.sky=[{date:today,shape:'full'}];const sky=copy(notes.sky);ok(k.setHemisphere(notes,'south',options)===true,'switch');eq(notes.sky,sky,'switching pictures leaves notes byte-identical');}

 // 6. Atomic writes commit only the captured proposal.
 {const s=fresh();s.sky=[{date:'2026-10-01',shape:'full'}];const before=copy(s);
  const hostile={canExport:c=>{c.sky.push({date:'2026-10-02',shape:'full',hostile:true});c.syntheticOther.waiting='Synthetic hostile change';c.extra='x';return true;}};
  ok(k.saveSkyNote(s,today,'thin-growing',{...hostile,today})===true,'hostile probe allows');eq(s.sky,[...before.sky,{date:today,shape:'thin-growing'}],'only the captured proposal commits');eq(s.syntheticOther,before.syntheticOther,'other root untouched');ok(!Object.hasOwn(s,'extra'),'no new root');
  const h=fresh(),hb=copy(h);ok(k.setHemisphere(h,'south',{canExport:c=>{c.hemisphere='north';c.syntheticOther=null;return true;}})===true,'hostile probe on the setting');same(h.hemisphere,'south','captured setting commits');eq(h.syntheticOther,hb.syntheticOther,'other root untouched by the setting');
  const r=fresh();r.sky=[];refused(r,()=>k.saveSkyNote(r,today,'full',{canExport:()=>false,today}),'preflight refusal changes nothing');
  const big=fresh();big.syntheticOther.payload='x'.repeat(5_300_000);refused(big,()=>k.saveSkyNote(big,today,'full',{...options,today}),'over-limit notebook refuses');}

 // 7. Readers and imports: no unrelated module reads the sky roots; the sky modules import no weather, evidence or suggestion code.
 {const reader=/\.sky\b|\.hemisphere\b|\[['"](sky|hemisphere)['"]\]|hasOwn\([^)]*['"](sky|hemisphere)['"]/;const allowed=new Set(['sky-notes-core.mjs','sky-notes-ui.mjs']);
  for(const f of readdirSync(root+'dist').filter(f=>f.endsWith('.mjs'))){const text=readFileSync(root+'dist/'+f,'utf8');if(!allowed.has(f))ok(!reader.test(text),`${f} does not read sky or hemisphere`);}
  for(const f of ['sky-notes-core.mjs','sky-notes-ui.mjs','sky-notes-content.mjs']){const imports=[...readFileSync(root+'dist/'+f,'utf8').matchAll(/from '\.\/([^']+)'/g)].map(m=>m[1]);ok(imports.every(i=>!/^weather-tally-|evidence|suggest/.test(i)),`${f} imports no weather, evidence or suggestion module`);}}

 // 8. Pictures: the southern set mirrors the northern set; full and not-seen are the same in both.
 {eq(SKY_CODES,['thin-growing','half-growing','fat-growing','full','fat-shrinking','half-shrinking','thin-shrinking','not-seen'],'eight codes in cycle order, no new');
  const twin={'thin-growing':'thin-shrinking','half-growing':'half-shrinking','fat-growing':'fat-shrinking'};
  for(const code of SKY_CODES){const north=k.moonArt(code,'north'),south=k.moonArt(code,'south');ok(north.includes('aria-hidden="true"'),`${code} picture is decorative`);ok(!/face|eye|shadow|sun/i.test(north),`${code} picture has no face, shadow or sun`);
   if(code==='full'||code==='not-seen')same(south,north,`${code} identical in both settings`);else{same(k.moonPath(code,'south'),k.mirrorPath(k.moonPath(code,'north')),`${code} south is the mirror of north`);ok(south!==north,`${code} differs between settings`);}}
  for(const [g,s] of Object.entries(twin)){same(k.moonPath(g,'south'),k.moonPath(s,'north'),`south ${g} looks like north ${s}`);same(k.moonPath(s,'south'),k.moonPath(g,'north'),`south ${s} looks like north ${g}`);}
  // Northern growing shapes are lit on the right: their outer arc runs from top to bottom clockwise.
  for(const g of Object.keys(twin))ok(k.moonPath(g,'north').startsWith('M24 4 A20 20 0 0 1 24 44'),`north ${g} lit on the right`);
  same(k.mirrorPath(k.mirrorPath(k.moonPath('thin-growing'))),k.moonPath('thin-growing'),'mirroring twice is the identity');}

 // 9. Copy: no exclamation marks or em-dashes, and no cause of phases.
 {const lines=[...SKY_SHAPES.map(s=>s.label),...Object.values(SKY_COPY),...SKY_PANELS.flatMap(p=>[p.title,p.body]),changePrompt('Full')];
  for(const line of lines){ok(!/[!—]/.test(line),`no exclamation mark or em-dash: ${line}`);ok(!/shadow|orbit|reflect|because/i.test(line),`no cause given: ${line}`);}
  ok(SKY_COPY.safety==='Never look straight at the sun.','safety line');ok(SKY_PANELS[2].body.includes('about 29 and a half days')&&!/29\.5|29\.53/.test(SKY_PANELS.map(p=>p.body).join(' ')),'about 29 and a half days, no exact count');}

 // Notes and transfer: raw values survive export and import; Notes lists readable notes and flags the rest.
 {const s=fresh();s.syntheticOther.payload='y'.repeat(512*1024);s.sky=[{date:'2026-10-01',shape:'full'},{date:'2026-10-01',shape:'full',dup:true},{date:'bad',shape:'full'},7];s.hemisphere='east';
  const imported=prepareProgressImport(JSON.stringify(report(s),null,2));ok(imported.ok,'transfer accepts sky roots');eq(imported.state.sky,s.sky,'sky raw entries round trip');same(imported.state.hemisphere,'east','unknown hemisphere round trips');same(imported.state.syntheticOther.payload.length,512*1024,'unrelated work preserved');ok(imported.summary.destinations.includes('Sky notes')&&imported.summary.destinations.includes('Moon picture setting'),'transfer names the destinations');
  const html=skyNotesNotes(s);ok(html.includes('Sky notes')&&html.includes('2026-10-01: Full'),'Notes lists readable notes');ok(html.includes('Unavailable entries: 2'),'Notes counts unavailable entries');ok(html.includes('waxing crescent'),'astronomy names in Grown-up notes only');same(skyNotesNotes(fresh()),'','no section without the roots');}
 for(const h of ['north','south']){const s=freshState();s.hemisphere=h;const html=skyNotesPage(s,'panel-check'),panels=html.slice(html.indexOf('sky-panels'));for(const p of SKY_PANELS)ok(panels.includes(k.moonArt(p.code,h,'sky-panel-moon')),`${p.code} panel follows the ${h} setting`);}
 console.log(`Sky notes: ${n} civil-date, preservation, capacity, hemisphere, atomic, reader and picture checks passed.`);return n;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)runSkyChecks();
