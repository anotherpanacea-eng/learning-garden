// Synthetic civil-date, report, frozen-source and aggregate-count oracles for281.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {MAX_IMPORT_BYTES,recoveryFitsProgressLimits} from '../dist/progress-limits.mjs';
import {waitingNotebook} from './story-arrivals-checks.mjs';
import {WEATHER_CATEGORIES,PRACTICE_WEATHER_DAYS} from '../dist/weather-tally-content.mjs';
import * as w from '../dist/weather-tally-core.mjs';
const copy=structuredClone,today='2026-10-28';
const practice=['sun','sun','clouds','rain','rain','clouds','sun','wind','sun','clouds','rain','sun','sun','clouds','clouds','rain','sun','snow','clouds','sun','rain','rain','clouds','sun','wind','sun','clouds','rain','sun','clouds'];
const codes=['sun','clouds','rain','wind','snow'];
const counted=(source,placements)=>Object.fromEntries(source.categories.map(c=>[c.code,placements.filter(x=>x===c.code).length]));
const report=s=>({title:'After the Storm: observations',exportedAt:'2026-10-28T12:00:00.000Z',note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'sky',color:'blue',symbol:'leaf'},recommendation:recommendations(s),...s});
export const weatherCanExport=s=>prepareProgressImport(JSON.stringify(report(s),null,2)).ok;
export function weatherFixtures(){
 const base=waitingNotebook();base.syntheticOther.payload='x'.repeat(512000);
 const date=w.localCivilDate(),month=date.slice(0,7),earlier=month+'-01';
 base.weather=[{date:earlier,weather:'sun',temp:12,original:{raw:'Synthetic earlier entry'}},{date:earlier,weather:'rain',temp:9,extra:'Synthetic last readable duplicate'},{date:earlier,weather:'future',raw:'Synthetic unreadable duplicate'},null,{date:'not-a-date',weather:'snow'},'Synthetic raw entry'];
 const partial=copy(base),id=w.createWeatherTally(partial,w.practiceWeatherSource());for(const code of practice.slice(0,6))w.placeWeatherMark(partial,id,code);
 const refusal=copy(base);refusal.syntheticOther.payload='';const refusalSource=w.practiceWeatherSource();refusalSource.title='Synthetic source with data-speak-lang= in its title';const refusalId=w.createWeatherTally(refusal,refusalSource);const candidate=copy(refusal);w.useWeatherSupport(candidate,refusalId,'narration');const bytes=new TextEncoder().encode(JSON.stringify(candidate,null,2)).length;refusal.syntheticOther.payload='x'.repeat(MAX_IMPORT_BYTES-bytes-32);
 const historical=copy(base),historySource={version:9,kind:'practice',id:'synthetic-earlier-categories',title:'Earlier two-row notes',month:null,categories:[{code:'bright"row',label:'Earlier bright'},{code:"wet'row",label:'Earlier wet'}],days:[{day:1,date:null,weather:'bright"row'},{day:2,date:null,weather:"wet'row"},{day:3,date:null,weather:'bright"row'}]};const historicalId=w.createWeatherTally(historical,historySource);
 return {base,partial,refusal,refusalId,historical,historicalId,date,month,earlier};
}
export function runWeatherChecks(){
 let n=0;const ok=(v,m)=>{assert.ok(v,m);n++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},same=(a,b,m)=>{assert.equal(a,b,m);n++;};
 const options={canExport:weatherCanExport},fresh=()=>{const s=initializeExplorerState(freshState());s.syntheticOther={waiting:'Synthetic untouched parcel'};return s;};
 const sheet=(s,id)=>s.dataDesk.find(x=>x?.id===id),newSheet=(s,source=w.practiceWeatherSource())=>{const id=w.createWeatherTally(s,source,options);ok(typeof id==='string','explicit new sheet returns a stable ID');return id;};
 const refusal=(s,fn,m)=>{const before=copy(s),weather=s.weather,desk=s.dataDesk,other=s.syntheticOther;eq(fn(),false,m);eq(s,before,'refusal leaves actual full notebook exact');same(s.weather,weather);same(s.dataDesk,desk);same(s.syntheticOther,other);};
 const selected=(source)=>source.days.map(d=>d.weather);
 eq(WEATHER_CATEGORIES.map(x=>x.code),codes);eq(PRACTICE_WEATHER_DAYS,practice,'exact authored thirty-day sequence');
 const p=w.practiceWeatherSource();eq(p.kind,'practice');eq(p.month,null);eq(p.days.map(x=>x.date),Array(30).fill(null));eq(p.days.map(x=>x.day),Array.from({length:30},(_,i)=>i+1));eq(p.days.map(x=>x.weather),practice);eq(counted(p,practice),{sun:11,clouds:9,rain:7,wind:2,snow:1},'independently counted practice totals');
 // Independent Gregorian arithmetic, including century exceptions and domain ends.
 const leap=y=>y%4===0&&(y%100!==0||y%400===0),dims=(y,m)=>[31,leap(y)?29:28,31,30,31,30,31,31,30,31,30,31][m-1];
 for(const y of [1,4,100,400,1582,1900,2000,2024,2025,2100,2400,9999])for(let m=1;m<=12;m++){
  const prefix=String(y).padStart(4,'0')+'-'+String(m).padStart(2,'0');ok(w.validMonth(prefix));eq(w.daysInMonth(y,m),dims(y,m));for(const d of [1,dims(y,m)])ok(w.validCivilDate(prefix+'-'+String(d).padStart(2,'0')));ok(!w.validCivilDate(prefix+'-00'));ok(!w.validCivilDate(prefix+'-'+String(dims(y,m)+1).padStart(2,'0')));
 }
 for(const d of ['0000-01-01','10000-01-01','2026-13-01','2026-00-01','2026-1-01','2026-01-1','2026-02-29','1900-02-29','2100-02-29','not-a-date',null,{},false])eq(w.validCivilDate(d),false);
 for(const d of ['0001-01-01','2000-02-29','2024-02-29','9999-12-31'])eq(w.localCivilDate(new Date(d+'T12:00:00')),d,'local civil date rather than UTC slicing');
 {
  const s=fresh(),before=copy(s);w.weatherView(s,today);w.weatherMonths(s);w.weatherMonthSource(s,'2026-10');w.tallyView(s,null);eq(s,before,'views create neither optional root');ok(!Object.hasOwn(prepareProgressImport(JSON.stringify(report(s))).state,'weather'));ok(!Object.hasOwn(prepareProgressImport(JSON.stringify(report(s))).state,'dataDesk'));
  for(const changed of ['2026-10-29','2026-10-27'])refusal(s,()=>w.saveWeatherNote(s,today,'sun',{...options,today:changed}),'date flip in either direction refuses old rendered date');
  ok(w.saveWeatherNote(s,today,'sun',{...options,today}));eq(s.weather,[{date:today,weather:'sun'}]);const root=s.weather;ok(w.saveWeatherNote(s,today,'sun',{today,canExport(){throw Error('Same-value save must not preflight');}}));same(s.weather,root,'same selected code is an identity-preserving no-op');
  for(const [date,code] of [['2026-02-29','sun'],[today,'future'],[null,'rain']])refusal(s,()=>w.saveWeatherNote(s,date,code,{...options,today:date}),'invalid date/code atomic');
 }
 {
  const s=fresh();s.weather=[{date:today,weather:'sun',temp:10,extra:{raw:'First'}},{date:'2026-10-27',weather:'clouds'},{date:today,weather:'rain',temp:8,extra:{raw:'Last readable'}},{date:today,weather:'future',raw:'Later unreadable'},null,'Synthetic raw'];const original=copy(s),last=copy(s.weather[2]);
  eq(w.weatherView(s,today).entry,last,'last readable duplicate, not last raw entry, is selected');eq(w.weatherView(s,today).index,2);ok(w.saveWeatherNote(s,today,'wind',{...options,today}));eq(s.weather[2],{...last,weather:'wind'},'change replaces only selected entry weather code');eq(s.weather.filter((_,i)=>i!==2),original.weather.filter((_,i)=>i!==2));
  const source=w.weatherMonthSource(s,'2026-10');eq(source.kind,'reported');eq(source.month,'2026-10');eq(source.title,'Your notes for October 2026','new reported sources freeze a human-readable month title');eq(source.days.map(d=>[d.date,d.weather]),[['2026-10-27','clouds'],[today,'wind']],'source collapses read view only and sorts actual dates');eq(w.weatherMonths(s).find(x=>x.month==='2026-10').count,2,'two unique report dates, no five-day gate');const frozen=copy(source),id=newSheet(s,source);ok(w.saveWeatherNote(s,today,'snow',{...options,today}));eq(sheet(s,id).source,frozen,'later weather changes never rewrite frozen source');eq(source,frozen,'source remains an independent snapshot');
  const raw=copy(s);w.weatherView(s,today);w.weatherMonthSource(s,'2026-10');eq(s,raw,'reading never deduplicates or rewrites raw entries');
 }
 {
  const s=fresh();s.weather=Array.from({length:1098},(_,i)=>({date:new Date(Date.UTC(2020,0,i+1)).toISOString().slice(0,10),weather:'sun'}));s.weather.push({date:today,weather:'future',extra:'Unreadable does not count'});eq(w.weatherView(s,today).readableCount,1098);refusal(s,()=>w.saveWeatherNote(s,today,'sun',{...options,today}),'new readable date refuses at1098 without eviction');const first=s.weather[0].date;ok(w.saveWeatherNote(s,first,'rain',{...options,today:first}),'existing readable date can still change');eq(s.weather.length,1099);
  s.weather.push({date:'2024-01-01',weather:'clouds'},{date:'2024-01-02',weather:'rain'});const before=copy(s);w.weatherView(s,today);eq(s,before,'over-cap imported history remains intact');refusal(s,()=>w.saveWeatherNote(s,today,'sun',{...options,today}),'over-cap append refuses without truncation');
 }
 for(const weather of [null,{},false,'Synthetic earlier weather']){
  const s=fresh();s.weather=weather;refusal(s,()=>w.saveWeatherNote(s,today,'sun',{...options,today}),'unsupported weather writer isolated');const id=newSheet(s);ok(w.tallyView(s,id).mutable,'practice tally remains open with unsupported weather root');eq(s.weather,weather);
 }
 for(const desk of [null,{},false,'Synthetic earlier tally']){
  const s=fresh();s.dataDesk=desk;refusal(s,()=>w.createWeatherTally(s,p,options),'unsupported tally root isolated');ok(w.saveWeatherNote(s,today,'sun',{...options,today}));eq(s.dataDesk,desk);
 }
 {
  const s=fresh(),id=newSheet(s),other=s.syntheticOther;eq(sheet(s,id).placements,[]);for(let i=0;i<practice.length;i++){ok(w.placeWeatherMark(s,id,practice[i],options));eq(w.tallyView(s,id).counts,counted(p,practice.slice(0,i+1)),'counts derive from actual placements');}same(s.syntheticOther,other);refusal(s,()=>w.placeWeatherMark(s,id,'sun',options),'all source cards placed, no extra mark');ok(w.checkWeatherTally(s,id,options));const first=copy(sheet(s,id).checks[0]);eq(first.expected,{sun:11,clouds:9,rain:7,wind:2,snow:1});eq(first.complete,true);eq(first.matches,true);eq(first.supportBefore.feedback,false);ok(sheet(s,id).support.feedback);ok(w.undoWeatherMark(s,id,options));eq(sheet(s,id).placements,practice.slice(0,-1));eq(w.tallyView(s,id).next,p.days.at(-1),'Back restores the actual final card');eq(sheet(s,id).checks[0],first);ok(w.checkWeatherTally(s,id,options));eq(sheet(s,id).checks.at(-1).complete,false);eq(sheet(s,id).checks.at(-1).matches,false);ok(sheet(s,id).checks.at(-1).supportBefore.feedback);ok(w.keepWeatherTally(s,id,options),'unfinished keep allowed');
  const kept=copy(sheet(s,id).kept),before=copy(s);for(const fn of [()=>w.placeWeatherMark(s,id,'sun',options),()=>w.undoWeatherMark(s,id,options),()=>w.checkWeatherTally(s,id,options),()=>w.useWeatherSupport(s,id,'teaching',options)])refusal(s,fn,'kept sheet is read-only');eq(s,before);eq(sheet(s,id).kept,kept);
  const revision=w.reviseWeatherTally(s,id,options);ok(typeof revision==='string'&&revision!==id);eq(sheet(s,revision).revisedFrom,id);eq(sheet(s,revision).placements,kept.placements);eq(sheet(s,revision).checks,[]);eq(sheet(s,revision).kept,null);eq(sheet(s,id),before.dataDesk.find(x=>x.id===id),'revision leaves entire old sheet exact');
 }
 {
  const s=fresh(),id=newSheet(s),swapped=[...practice];[swapped[0],swapped[2]]=[swapped[2],swapped[0]];ok(swapped.some((x,i)=>x!==practice[i]),'two different day cards are deliberately exchanged');for(const x of swapped)ok(w.placeWeatherMark(s,id,x,options));ok(w.checkWeatherTally(s,id,options));ok(sheet(s,id).checks[0].matches,'matching aggregate totals do not establish per-day placement correctness');
 }
 for(let count=1;count<=5;count++){
  const cats=Array.from({length:count},(_,i)=>({code:i===0?'earlier"row':i===1?"other'row":'old-'+i,label:'Synthetic old row '+(i+1)})),source={version:7,kind:'practice',id:'earlier-source',title:'An earlier source',month:null,categories:cats,days:cats.map((c,i)=>({day:i+1,date:null,weather:c.code}))};ok(w.readableSource(source),'positive historical source version and own categories stay readable');const s=fresh(),id=newSheet(s,source);for(const c of cats)ok(w.placeWeatherMark(s,id,c.code,options));eq(Object.keys(w.tallyView(s,id).counts),cats.map(c=>c.code));ok(w.checkWeatherTally(s,id,options));ok(sheet(s,id).checks[0].matches);ok(w.keepWeatherTally(s,id,options));eq(w.tallyView(s,id).source.categories,cats,'historical rows derive from own source only');
 }
 {
  const s=fresh(),supplied=w.practiceWeatherSource(),id=newSheet(s,supplied),frozen=copy(sheet(s,id).source);supplied.categories[0].label='Synthetic later label';supplied.days[0].weather='snow';eq(sheet(s,id).source,frozen,'later changes to supplied practice/catalog copy never rewrite a frozen sheet');
  for(const key of ['mastered','feedback','constructor'])refusal(s,()=>w.useWeatherSupport(s,id,key,options),'unsupported support/feedback cannot be recorded directly');
 }
 for(const reserved of ['__proto__','constructor','prototype','toString','valueOf']){const source=copy(p);source.categories[0].code=reserved;source.days[0].weather=reserved;eq(w.readableSource(source),false,'reserved object-key code unsupported');}
 for(const placements of [Array(1),Object.assign(Array(1),{extra:'sun'}),['future'],Array(31).fill('sun')])eq(w.validPlacements(p,placements),false,'invalid/sparse/too-long placements unsupported');
 {
  const s=fresh(),id=newSheet(s);ok(w.placeWeatherMark(s,id,'sun',options));ok(w.checkWeatherTally(s,id,options));ok(w.keepWeatherTally(s,id,options));const original=copy(sheet(s,id));sheet(s,id).kept.counts={sun:0,clouds:0,rain:0,wind:0,snow:0};sheet(s,id).checks[0].counts={sun:0,clouds:0,rain:0,wind:0,snow:0};sheet(s,id).checks[0].matches=true;sheet(s,id).checks[0].complete=true;const kept=copy(sheet(s,id).kept),check=copy(sheet(s,id).checks[0]);ok(w.readableKeep(kept));ok(w.readableCheck(check),'bounded historical outcomes are not recomputed');sheet(s,id).source={version:99};sheet(s,id).placements=['future'];sheet(s,id).support=false;const raw=copy(sheet(s,id)),v=w.tallyView(s,id);eq(v.source,kept.source,'kept source authoritative over malformed current source');eq(v.placements,kept.placements);eq(v.counts,kept.counts,'old kept counts displayed exactly as recorded');eq(v.checks[0],check);const revised=w.reviseWeatherTally(s,id,options);ok(typeof revised==='string');eq(sheet(s,revised).source,kept.source);eq(sheet(s,revised).placements,kept.placements);eq(w.tallyView(s,revised).counts,counted(kept.source,kept.placements),'new revision computes its new live counts without rewriting old recorded counts');eq(sheet(s,id),raw);ok(original.source.kind==='practice');
 }
 for(const bad of [false,0,'',undefined,{},[]]){
  const s=fresh(),id=newSheet(s);sheet(s,id).kept=bad;for(const fn of [()=>w.placeWeatherMark(s,id,'sun',options),()=>w.undoWeatherMark(s,id,options),()=>w.checkWeatherTally(s,id,options),()=>w.useWeatherSupport(s,id,'narration',options),()=>w.keepWeatherTally(s,id,options),()=>w.reviseWeatherTally(s,id,options)])refusal(s,fn,'every present nonnull malformed kept value blocks mutation');
 }
 {
  const s=fresh(),id=newSheet(s);delete sheet(s,id).checks;delete sheet(s,id).kept;const before=copy(s);eq(w.tallyView(s,id).checks,[]);eq(s,before,'missing optional fields remain absent on read');ok(w.checkWeatherTally(s,id,options));ok(!Object.hasOwn(sheet(s,id),'kept'));ok(w.keepWeatherTally(s,id,options));
  const t=fresh(),key=newSheet(t);sheet(t,key).checks=null;refusal(t,()=>w.checkWeatherTally(t,key,options),'present malformed checks retained');ok(w.placeWeatherMark(t,key,'rain',options),'malformed checks do not block marks');ok(w.keepWeatherTally(t,key,options));
 }
 {
  const s=fresh(),id=newSheet(s);sheet(s,id).checks=[{version:99,raw:'Synthetic unknown check'}];for(let i=1;i<8;i++)ok(w.checkWeatherTally(s,id,options));const checks=copy(sheet(s,id).checks);refusal(s,()=>w.checkWeatherTally(s,id,options),'eight own raw check entries cap without eviction');eq(sheet(s,id).checks,checks);ok(w.placeWeatherMark(s,id,'sun',options));ok(w.keepWeatherTally(s,id,options));
  const t=fresh();t.dataDesk=[{id:'weather-tally-9',kind:'future'}];const next=newSheet(t);eq(next,'weather-tally-10','allocation goes beyond raw own IDs');const original=copy(t.dataDesk[0]);while(t.dataDesk.length<24)newSheet(t);refusal(t,()=>w.createWeatherTally(t,p,options),'twenty-four own sheet entries cap, including raw');eq(t.dataDesk[0],original);
  const u=fresh();u.dataDesk=[{id:'weather-tally-999999999',kind:'future'}];eq(w.createWeatherTally(u,p,options),'weather-tally-1000000000');refusal(u,()=>w.createWeatherTally(u,p,options),'ID limit refuses beyond final safe ID');
 }
 {
  const s=fresh(),id=newSheet(s);s.dataDesk.push(copy(sheet(s,id)));const before=copy(s);ok(!w.tallyView(s,id).mutable,'duplicate IDs are read-only');refusal(s,()=>w.placeWeatherMark(s,id,'sun',options),'duplicate IDs never choose an arbitrary sheet');eq(s,before);const next=newSheet(s);ok(w.tallyView(s,next).mutable,'unique new sibling remains available');
 }
 {
  const s=fresh(),id=newSheet(s);ok(w.useWeatherSupport(s,id,'teaching',options));const root=s.dataDesk;ok(w.useWeatherSupport(s,id,'teaching',{canExport(){throw Error('True support no-op must not preflight');}}));same(s.dataDesk,root);for(const key of ['narration','together']){refusal(s,()=>w.useWeatherSupport(s,id,key,{canExport:()=>false}),'failed first support preflight atomic');eq(sheet(s,id).support[key],false);}ok(w.useWeatherSupport(s,id,'narration',options));ok(w.checkWeatherTally(s,id,options));eq(sheet(s,id).checks[0].supportBefore,{teaching:true,narration:true,together:false,feedback:false});
  const other=copy(s.syntheticOther);ok(w.placeWeatherMark(s,id,'rain',{canExport(c){c.syntheticOther={changed:'Synthetic callback contamination'};c.dataDesk[0].placements=['snow'];return true;}}));eq(s.syntheticOther,other);eq(sheet(s,id).placements,['rain'],'validated own proposal captured before callback');ok(w.saveWeatherNote(s,today,'sun',{today,canExport(c){c.syntheticOther={changed:true};c.weather[0].weather='snow';return true;}}));eq(s.weather,[{date:today,weather:'sun'}]);eq(s.syntheticOther,other);
 }
 for(const action of ['weather','sheet']){
  const s=fresh();s.syntheticOther.payload='';const proposed=copy(s);ok(action==='weather'?w.saveWeatherNote(proposed,today,'sun',{today}):typeof w.createWeatherTally(proposed,p)==='string');const bytes=new TextEncoder().encode(JSON.stringify(proposed,null,2)).length;s.syntheticOther.payload='x'.repeat(MAX_IMPORT_BYTES-bytes-32);const raw=copy(s);ok(action==='weather'?w.saveWeatherNote(raw,today,'sun',{today}):typeof w.createWeatherTally(raw,p)==='string');ok(recoveryFitsProgressLimits(raw),'actual post-action raw notebook fits');ok(!weatherCanExport(raw),'actual metadata-bearing pretty report alone refuses');refusal(s,()=>action==='weather'?w.saveWeatherNote(s,today,'sun',{...options,today}):w.createWeatherTally(s,p,options),'actual report preflight refusal atomic');
 }
 const f=weatherFixtures(),prepared=prepareProgressImport(JSON.stringify(report(f.partial),null,2));ok(prepared.ok);eq(prepared.state.weather,f.partial.weather);eq(prepared.state.dataDesk,f.partial.dataDesk);eq(prepared.state.syntheticOther.payload.length,512000,'actual complete import retains large unrelated work and raw duplicate weather');
 console.log(`Weather tallies: ${n} civil-date, source, aggregate, history and atomic preservation checks passed.`);return n;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)runWeatherChecks();
