// Independent finite arithmetic, retained-source and media lifecycle oracles for280.
// Fixtures and examples are synthetic; no learner data is imported.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {MAX_IMPORT_BYTES,recoveryFitsProgressLimits} from '../dist/progress-limits.mjs';
import {waitingNotebook} from './story-arrivals-checks.mjs';
import {RHYTHM_MODEL,RHYTHM_SOURCES} from '../dist/rhythm-content.mjs';
import * as r from '../dist/rhythm-core.mjs';
import {createRhythmPlayer} from '../dist/rhythm-audio.mjs';

const copy=structuredClone,weights={w:4,h:2,q:1,rq:1},codes=Object.keys(weights);
const used=s=>s.reduce((a,c)=>a+weights[c],0);
const facts=s=>({usedBeats:used(s),spaceBeats:4-used(s),attacks:s.filter(c=>c!=='rq').length,rests:s.filter(c=>c==='rq').length,occupiedSeconds:used(s)/2});
const report=s=>({title:'After the Storm: observations',exportedAt:'2026-10-28T12:00:00.000Z',note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'sky',color:'blue',symbol:'leaf'},recommendation:recommendations(s),...s});
export const rhythmCanExport=s=>prepareProgressImport(JSON.stringify(report(s),null,2)).ok;
export function rhythmFixtures(){
 const base=waitingNotebook();base.syntheticOther.payload='x'.repeat(512000);
 const partial=copy(base);r.chooseRhythm(partial,'own-bar');r.editRhythm(partial,'append','h');r.keepRhythm(partial);
 const finished=copy(base);r.chooseRhythm(finished,'echo-1');for(const c of ['q','q','h'])r.editRhythm(finished,'append',c);r.useRhythmSupport(finished,'referenceRequested');r.checkRhythm(finished);r.keepRhythm(finished);
 return {base,partial,finished};
}
function environment(config={}){
 const e={contexts:[],nodes:[],gains:[],timers:new Map(),now:0,next:0,resumes:[]};
 e.later=(fn,ms)=>{if(config.timerFail)throw Error('Synthetic timer failure');const id=++e.next;e.timers.set(id,{fn,time:e.now+ms});return id;};e.clear=id=>e.timers.delete(id);
 e.advance=ms=>{const end=e.now+ms;for(let i=0;i<100;i++){const next=[...e.timers.entries()].sort((a,b)=>a[1].time-b[1].time).find(([,v])=>v.time<=end);if(!next)break;e.now=next[1].time;e.timers.delete(next[0]);next[1].fn();}e.now=end;};
 const param=()=>({calls:[],setValueAtTime(v,t){if(config.paramFail)throw Error('Synthetic parameter failure');this.calls.push(['set',v,t]);},linearRampToValueAtTime(v,t){this.calls.push(['ramp',v,t]);},cancelScheduledValues(t){this.calls.push(['cancel',t]);}});
 class Context{
  constructor(){if(config.constructorFail)throw Error('Synthetic unavailable audio');this.state='suspended';this.destination={};this.suspends=0;e.contexts.push(this);}
  get currentTime(){return 10+e.now/1000;}
  resume(){if(config.resume==='reject')return Promise.reject(Error('Synthetic resume failure'));if(config.resume==='defer')return new Promise((resolve,reject)=>e.resumes.push({resolve:()=>{this.state='running';resolve();},reject}));this.state='running';return Promise.resolve();}
  suspend(){this.suspends++;this.state='suspended';return Promise.resolve();}
  createOscillator(){if(config.oscFailAt===e.nodes.length+1)throw Error('Synthetic oscillator failure');const n={frequency:param(),starts:[],stops:[],disconnected:0,connect(x){this.target=x;},start(t){this.starts.push(t);},stop(t){this.stops.push(t);},disconnect(){this.disconnected++;}};e.nodes.push(n);return n;}
  createGain(){const n={gain:param(),disconnected:0,connect(x){this.target=x;},disconnect(){this.disconnected++;}};e.gains.push(n);return n;}
 }
 e.player=createRhythmPlayer({AudioContext:Object.hasOwn(config,'AudioContext')?config.AudioContext:Context,setTimeout:e.later,clearTimeout:e.clear});return e;
}
const flush=async()=>{for(let i=0;i<8;i++)await Promise.resolve();};
export async function runRhythmChecks(){
 let n=0;const ok=(v,m)=>{assert.ok(v,m);n++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},same=(a,b,m)=>{assert.equal(a,b,m);n++;},close=(a,b,m)=>ok(Math.abs(a-b)<1e-9,m);
 const options={canExport:rhythmCanExport};
 const current=s=>r.rhythmView(s).current;
 const fresh=(id='own-bar')=>{const s=initializeExplorerState(freshState());s.syntheticOther={waiting:'Synthetic parcel',stock:7};ok(r.chooseRhythm(s,id,options),'explicit source choice');return s;};
 const put=(s,seq)=>{r.editRhythm(s,'clear',null,options);for(const c of seq)ok(r.editRhythm(s,'append',c,options),'append fitting code');};
 const unchanged=(s,fn,m)=>{const before=copy(s),root=s.rhythm,other=s.syntheticOther;eq(fn(),false,m);eq(s,before,'refused operation leaves full notebook exact');same(s.rhythm,root,'refusal keeps rhythm identity');same(s.syntheticOther,other,'refusal keeps unrelated identity');};
 const seqs=[];function collect(s=[]){seqs.push(s);for(const c of codes)if(used(s)+weights[c]<=4)collect([...s,c]);}collect();
 eq(seqs.length,50,'independently enumerated fifty fitting sequences');
 eq([RHYTHM_MODEL.beats,RHYTHM_MODEL.beatSeconds,RHYTHM_MODEL.frequency,RHYTHM_MODEL.peakGain,RHYTHM_MODEL.gap],[4,.5,330,.025*2/3,.06],'fixed quarter-note beat and source model');
 eq(RHYTHM_SOURCES.map(x=>[x.id,x.kind,x.target]),[['own-bar','own',null],['echo-1','echo',['q','q','h']],['echo-2','echo',['h','q','q']],['echo-5','echo',['q','rq','q','q']]],'finite authored echoes include explicit rest');
 {
  const s=freshState(),before=copy(s);eq(r.rhythmView(s).status,'absent');r.rhythmFacts([]);r.rhythmPlaybackPlan([]);eq(s,before,'reading does not initialize absent root');ok(!Object.hasOwn(prepareProgressImport(JSON.stringify(report(s))).state,'rhythm'),'actual import never initializes rhythm');
  for(const id of ['unknown','',null,{},'__proto__'])unchanged(s,()=>r.chooseRhythm(s,id,options),'invalid source');
 }
 for(const seq of seqs){
  eq(r.rhythmFacts(seq),facts(seq),'facts follow independent beat arithmetic');ok(r.validRhythmSequence(seq));
  const plan=r.rhythmPlaybackPlan(seq);eq(plan.duration,seq.length?2:0,'partial/rest bar retains full frame');eq(plan.hasSound,seq.some(x=>x!=='rq'));eq(plan.beats,seq.length?[0,.5,1,1.5]:[],'equal beats never reveal event boundaries');
  let beat=0;for(let i=0;i<seq.length;i++){const e=plan.events[i];eq([e.start,e.duration,e.frequency],[beat/2,weights[seq[i]]/2,seq[i]==='rq'?null:330]);close(e.toneSeconds,seq[i]==='rq'?0:weights[seq[i]]/2-.06);beat+=weights[seq[i]];}
  const s=fresh();put(s,seq);const savedOther=s.syntheticOther;
  for(const c of codes){const t=copy(s),fits=used(seq)+weights[c]<=4;if(fits){ok(r.editRhythm(t,'append',c,options));eq(current(t).sequence,[...seq,c]);}else unchanged(t,()=>r.editRhythm(t,'append',c,options),'overfull append refused');}
  for(let i=0;i<seq.length;i++)for(const c of codes){const t=copy(s),fits=used(seq)-weights[seq[i]]+weights[c]<=4;if(fits){ok(r.editRhythm(t,'replace',{index:i,code:c},options));const expected=[...seq];expected[i]=c;eq(current(t).sequence,expected);}else unchanged(t,()=>r.editRhythm(t,'replace',{index:i,code:c},options),'overfull swap refused');}
  same(s.syntheticOther,savedOther,'arithmetic/editing never changes other root identity');
 }
 for(const bad of [null,{},['alien'],['w','q'],Array(5).fill('rq'),[undefined],Array(2),Object.assign(['q'],{extra:'h'}),Object.assign(Array(1),{extra:'q'}),Object.assign(['q',,],{extra:'rq'})]){eq(r.validRhythmSequence(bad),false);eq(r.rhythmPlaybackPlan(bad),null);}
 {
  const s=fresh('echo-1');put(s,['q','q','h']);ok(r.useRhythmSupport(s,'referenceRequested',options));ok(r.checkRhythm(s,options));const first=copy(current(s).checks[0]);eq(first.outcome,'match');eq(first.familiar,false);eq(first.supportBefore.feedbackSeen,false,'pre-check exposure snapshot');ok(current(s).support.feedbackSeen);
  ok(r.useRhythmSupport(s,'exampleShown',options));ok(r.checkRhythm(s,options));eq(current(s).checks[1].familiar,true);eq(current(s).checks[1].supportBefore.exampleShown,true);eq(current(s).checks[0],first,'later support never rewrites first attempt');
  ok(r.keepRhythm(s,options));const kept=copy(current(s).kept);r.editRhythm(s,'remove',0,options);unchanged(s,()=>r.keepRhythm(s,options),'kept snapshot requires explicit replacement');ok(r.keepRhythm(s,{...options,replace:true}));eq(current(s).checks[0],first);ok(JSON.stringify(current(s).kept)!==JSON.stringify(kept));
  const root=s.rhythm;ok(r.useRhythmSupport(s,'exampleShown',{canExport(){throw Error('No-op must not preflight');}}));same(s.rhythm,root);const sameState=copy(s);ok(r.editRhythm(s,'replace',{index:0,code:current(s).sequence[0]},{canExport(){throw Error('No-op edit must not preflight');}}));same(s.rhythm,root);eq(s,sameState);
  ok(r.chooseRhythm(s,'echo-1',{...options,newVersion:true}));eq(current(s).checks,[]);eq(current(s).support.exampleShown,false,'new-version bookkeeping is local, not global unfamiliarity');eq(Object.values(s.rhythm.visits)[0].checks[0],first,'new version retains old source/support');
 }
 {
  const s=fresh();put(s,['h','rq','q']);ok(r.editRhythm(s,'move',{index:0,delta:1},options));eq(current(s).sequence,['rq','h','q']);ok(r.editRhythm(s,'remove',1,options));eq(current(s).sequence,['rq','q']);ok(r.keepRhythm(s,options));ok(r.checkRhythm(s,options));eq(current(s).checks[0].outcome,null,'own-bar records facts without grading music');
  const root=s.rhythm;ok(r.selectRhythmVisit(s,s.rhythm.current,{canExport(){throw Error('Same selection no-op');}}));same(s.rhythm,root);
  for(const [action,payload] of [['append','future'],['replace',{index:99,code:'h'}],['move',{index:0,delta:2}],['remove',-1],['unknown','q']])unchanged(s,()=>r.editRhythm(s,action,payload,options),'bad edit atomic');
  unchanged(s,()=>r.useRhythmSupport(s,'mastered',options),'unknown support does not become proficiency');
 }
 {
  const s=fresh('echo-1');let w=current(s);w.source.id='earlier-echo';w.source.title='Earlier synthetic wording';w.source.prompt='An earlier source';w.source.target=['h','h'];put(s,['h','h']);ok(r.checkRhythm(s,options));eq(current(s).checks[0].outcome,'match','new check consumes its own frozen target, not current catalog');
  w=current(s);w.checks[0].outcome='different';w.checks[0].facts={usedBeats:0,spaceBeats:0,attacks:0,rests:0,occupiedSeconds:0};const original=copy(w.checks[0]);ok(r.readableAttempt(w.checks[0]),'bounded earlier outcome/facts are not regraded');ok(r.keepRhythm(s,options));const kept=copy(current(s).kept);const old=copy(s);r.rhythmView(s);eq(s,old,'read-only source history');eq(current(s).checks[0],original);ok(r.editRhythm(s,'append','q',options)===false,'full earlier source bar still respects capacity');
  w=current(s);w.sequence=['future'];w.checks.push({version:99,raw:'Synthetic future attempt'});w.support.referenceRequested='future';const frozen=copy(s);const v=r.rhythmView(s);ok(!v.editable,'broken working fields stay read-only');eq(v.readableChecks[0],original,'independent readable attempt survives broken working draft');eq(v.kept,kept,'independent kept snapshot survives broken working draft');eq(s,frozen,'view never repairs invalid siblings');
  ok(r.chooseRhythm(s,'own-bar',{...options,newVersion:true}),'new version bypasses but retains malformed earlier draft');eq(Object.values(s.rhythm.visits)[0],frozen.rhythm.visits[frozen.rhythm.current]);
 }
 {
  const s=fresh('echo-1');put(s,['q','q','h']);ok(r.checkRhythm(s,options));ok(r.keepRhythm(s,options));const w=current(s);
  for(const source of [w.source,w.checks[0].source,w.kept.source])Object.assign(source.model,{frequency:440,peakGain:.01,attack:.02,release:.04,gap:.08});
  w.checks[0].outcome='different';const oldAttempt=copy(w.checks[0]),oldKept=copy(w.kept),saved=copy(s);
  ok(r.readableSource(w.source),'unused historical tuning metadata does not invalidate source');ok(r.readableAttempt(w.checks[0]));ok(r.readableKeep(w.kept));ok(r.rhythmView(s).editable);eq(s,saved,'reading leaves earlier metadata/outcomes exact');
  ok(r.editRhythm(s,'remove',2,options));ok(r.editRhythm(s,'append','h',options));eq(current(s).checks[0],oldAttempt,'editing never regrades earlier tuning-era outcome');eq(current(s).kept,oldKept,'editing retains earlier tuning-era kept source');ok(r.checkRhythm(s,options));eq(current(s).checks.at(-1).outcome,'match');eq(current(s).checks[0],oldAttempt);
  const e=environment();await e.player.play(current(s).sequence);eq(e.nodes.map(x=>x.frequency.calls[0][1]),[330,330,330],'player uses current safe constant, not imported source frequency');eq(e.gains.map(x=>x.gain.calls[1][1]),[.025*2/3,.025*2/3,.025*2/3],'old source gain does not configure actual player');close(e.nodes[0].stops[0]-e.nodes[0].starts[0],.44,'old source gap does not configure actual player');e.player.stop();
 }
 {
  const s=fresh();delete current(s).checks;delete current(s).kept;const before=copy(s);eq(r.rhythmView(s).readableChecks,[]);eq(r.rhythmView(s).kept,null);eq(s,before,'missing optional history is absent on read');
  ok(r.checkRhythm(s,options),'explicit Check creates missing check list');eq(current(s).checks.length,1);eq(current(s).checks[0].familiar,false);ok(!Object.hasOwn(current(s),'kept'),'checking does not initialize missing kept sibling');
  ok(r.keepRhythm(s,options),'explicit Keep creates missing kept snapshot');eq(current(s).kept.sequence,[],'unfinished empty work is keepable');
  current(s).checks=null;current(s).kept={version:99,raw:'Synthetic present malformed kept'};unchanged(s,()=>r.checkRhythm(s,options),'present malformed check list retained');unchanged(s,()=>r.keepRhythm(s,{...options,replace:true}),'present malformed kept retained');
 }
 {
  const s=fresh();s.rhythm.next=1000000000;ok(r.chooseRhythm(s,'echo-1',{...options,newVersion:true}),'last safe ID remains allocatable');eq(s.rhythm.current,'rhythm-1000000000');eq(s.rhythm.next,1000000000,'last allocation retains canonical cap sentinel');const last=copy(current(s));unchanged(s,()=>r.chooseRhythm(s,'echo-2',{...options,newVersion:true}),'exhausted last-ID collision refuses without changing current');eq(current(s),last);
 }
 {
  const s=fresh('echo-2');put(s,['h']);const w=current(s);w.checks.push({version:99,raw:'Synthetic unknown check'});w.kept={version:99,raw:'Synthetic unknown kept'};const raw=copy(w.kept);ok(r.checkRhythm(s,options),'bad attempt sibling does not poison new valid attempt');eq(current(s).checks[0],{version:99,raw:'Synthetic unknown check'});unchanged(s,()=>r.keepRhythm(s,{...options,replace:true}),'unreadable kept value cannot be overwritten');eq(current(s).kept,raw);
  for(let i=current(s).checks.length;i<24;i++)ok(r.checkRhythm(s,options));const before=copy(current(s).checks);unchanged(s,()=>r.checkRhythm(s,options),'attempt cap refuses without eviction');eq(current(s).checks,before);
 }
 {
  const s=fresh(),root=s.rhythm;root.visits['rhythm-2']={version:99,raw:'Synthetic collision'};root.next=2;ok(r.chooseRhythm(s,'echo-2',{...options,newVersion:true}));eq(s.rhythm.visits['rhythm-2'],{version:99,raw:'Synthetic collision'});ok(s.rhythm.current!=='rhythm-2','allocation skips owned unknown collision');
  while(Object.keys(s.rhythm.visits).length<24)ok(r.chooseRhythm(s,'own-bar',{...options,newVersion:true}));unchanged(s,()=>r.chooseRhythm(s,'echo-1',{...options,newVersion:true}),'visit cap retains every raw entry');
 }
 {
  const s=fresh('echo-1');current(s).source.id='earlier-quiet-example';current(s).source.target=['rq','rq','rq','rq'];const root=s.rhythm;
  ok(r.useRhythmSupport(s,'referenceRequested',{canExport(){throw Error('Silent reference is a no-op');}}));same(s.rhythm,root);eq(current(s).support.referenceRequested,false,'historical all-rest reference is visual, not a sound request');
  ok(r.useRhythmSupport(s,'responseRequested',{canExport(){throw Error('Empty response is a no-op');}}));same(s.rhythm,root);put(s,['rq','rq']);const quiet=s.rhythm;ok(r.useRhythmSupport(s,'responseRequested',{canExport(){throw Error('Silent response is a no-op');}}));same(s.rhythm,quiet);eq(current(s).support.responseRequested,false);
  ok(r.chooseRhythm(s,'earlier-quiet-example',{...options,newVersion:true}),'new version can copy supported unknown frozen source');eq(current(s).source.target,['rq','rq','rq','rq']);
 }
 {
  const s=fresh();s.rhythm.next='future';const value=copy(s.rhythm.next);ok(r.editRhythm(s,'append','q',options),'healthy work remains editable with malformed allocation sibling');eq(s.rhythm.next,value,'existing edit never repairs allocation metadata');
 }
 for(const mutate of [x=>x.next=0,x=>x.next='future',x=>x.next=1e9+1,x=>x.version=99,x=>x.visits=null]){
  const s=fresh();mutate(s.rhythm);const before=copy(s);unchanged(s,()=>r.chooseRhythm(s,'echo-1',{...options,newVersion:true}),'unsupported allocation metadata remains raw');r.rhythmView(s);eq(s,before);
 }
 {
  const s=fresh();s.rhythm.current='missing';const old=copy(s);eq(r.rhythmView(s).source,null,'missing selection has no implicit fallback');eq(s,old);ok(r.selectRhythmVisit(s,Object.keys(s.rhythm.visits)[0],options));
  const blocked=fresh();for(const action of [()=>r.editRhythm(blocked,'append','q',{canExport:()=>false}),()=>r.useRhythmSupport(blocked,'teachingShown',{canExport:()=>false}),()=>r.checkRhythm(blocked,{canExport:()=>false}),()=>r.keepRhythm(blocked,{canExport:()=>false}),()=>r.chooseRhythm(blocked,'echo-5',{newVersion:true,canExport:()=>false})])unchanged(blocked,action,'actual transaction callback refuses atomically');
  const touched=copy(blocked.syntheticOther);ok(r.editRhythm(blocked,'append','q',{canExport(candidate){candidate.syntheticOther.stock=999;candidate.rhythm.visits[candidate.rhythm.current].sequence=['w'];return true;}}));eq(blocked.syntheticOther,touched,'callback unrelated mutations never commit');eq(current(blocked).sequence,['q'],'callback cannot overwrite validated own proposal either');
 }
 {
  // Actual raw candidate fits, while the real metadata-bearing pretty report alone refuses.
  const s=initializeExplorerState(freshState());s.syntheticOther={payload:''};const proposed=copy(s);ok(r.chooseRhythm(proposed,'echo-1'));const size=new TextEncoder().encode(JSON.stringify(proposed,null,2)).length;s.syntheticOther.payload='x'.repeat(MAX_IMPORT_BYTES-size-32);const raw=copy(s);ok(r.chooseRhythm(raw,'echo-1'));ok(recoveryFitsProgressLimits(raw),'actual post-choice raw notebook fits');ok(!rhythmCanExport(raw),'actual pretty report/import callback refuses');unchanged(s,()=>r.chooseRhythm(s,'echo-1',options),'real report-boundary refusal');
  const f=rhythmFixtures();const exported=report(f.finished),prepared=prepareProgressImport(JSON.stringify(exported,null,2));ok(prepared.ok,'real saved notebook imports');eq(prepared.state.rhythm,f.finished.rhythm);eq(prepared.state.syntheticOther.payload.length,512000,'large unrelated sibling retained');
 }
 // Exact variable-duration schedules. The oracle uses literal beat weights above.
 for(const seq of [['w'],['h','h'],['q','q','q','q'],['q','rq','q','q'],['h']]){
  const e=environment(),beats=[],ends=[],statuses=[];eq(e.contexts.length,0);const result=await e.player.play(seq,{onBeat:x=>beats.push(x),onEnd:x=>ends.push(x),onStatus:x=>statuses.push(x)});eq(result.status,'started');eq(e.nodes.length,seq.filter(c=>c!=='rq').length);eq(e.timers.size,5,'only four equal beats and one finish timer');
  let offset=0,node=0;for(const c of seq){if(c!=='rq'){const o=e.nodes[node],g=e.gains[node].gain.calls;eq(o.type,'sine');eq(o.frequency.calls[0][1],330);close(o.starts[0],10.025+offset/2);close(o.stops[0]-o.starts[0],weights[c]/2-.06);eq(g.map(x=>x[0]),['set','ramp','set','ramp']);eq(g.map(x=>x[1]),[0,.025*2/3,.025*2/3,0]);close(g[1][2]-o.starts[0],.015);close(o.stops[0]-g[2][2],.035);node++;}offset+=weights[c];}
  e.advance(2026);eq(beats,[0,1,2,3]);eq(ends[0].mode,'audio-request');eq(statuses.at(-1).status,'completed');eq(e.timers.size,0);ok(e.nodes.every(x=>x.disconnected>0));ok(e.contexts[0].suspends>0);
 }
 {
  const e=environment(),beats=[],ends=[];eq((await e.player.play(['rq','rq'],{onBeat:x=>beats.push(x),onEnd:x=>ends.push(x)})).status,'visual');eq(e.contexts.length,0);e.advance(2001);eq(beats,[0,1,2,3]);eq(ends[0].mode,'visual');eq(e.timers.size,0);
  eq((await e.player.play([])).status,'empty');eq(e.timers.size,0);eq(e.contexts.length,0);eq((await e.player.play(['w','q'])).status,'invalid');eq(e.contexts.length,0);
 }
 for(const config of [{AudioContext:null},{constructorFail:true},{resume:'reject'},{oscFailAt:2},{paramFail:true}]){
  const e=environment(config),beats=[],ends=[],statuses=[];eq((await e.player.play(['q','q','h'],{onBeat:x=>beats.push(x),onEnd:x=>ends.push(x),onStatus:x=>statuses.push(x)})).status,'unavailable');ok(statuses.some(x=>x.status==='unavailable'));e.advance(2001);eq(beats,[0,1,2,3],'unavailable sound retains usable visual beats');eq(ends[0].mode,'visual-unavailable');eq(e.timers.size,0);ok(e.nodes.every(x=>x.disconnected>0),'partly allocated nodes cleaned');
 }
 {
  const e=environment({timerFail:true}),events=[];eq((await e.player.play(['q'],{onStatus:x=>events.push(x)})).status,'unavailable');eq(e.timers.size,0,'timer allocation failure cleans the whole run');ok(e.nodes.every(x=>x.disconnected>0));ok(events.some(x=>x.status==='unavailable'));
 }
 for(const reason of ['manual-stop','edit','render','navigation','explorer-switch','import','reset','film','speech','pagehide','hidden']){
  const e=environment(),ends=[],beats=[];await e.player.play(['q','q','h'],{onEnd:x=>ends.push(x),onBeat:x=>beats.push(x)});e.advance(30);e.player.stop(reason);const b=copy(beats);e.advance(5000);eq(beats,b,'stopped run emits no later beats');eq(ends.at(-1).reason,reason);eq(e.timers.size,0);ok(e.nodes.every(x=>x.disconnected>0));eq(e.contexts[0].state,'suspended');
 }
 {
  const e=environment({resume:'defer'});const pending=e.player.play(['w']);await flush();eq(e.resumes.length,1);e.player.stop('owner-changed');e.resumes[0].resolve();eq((await pending).status,'cancelled');eq(e.nodes.length,0);eq(e.timers.size,0);eq(e.contexts[0].state,'suspended','late resume does not leave old context running');
 }
 {
  const e=environment({resume:'defer'});const first=e.player.play(['w']);await flush();const second=e.player.play(['h','h']);await flush();eq(e.resumes.length,2);e.resumes[1].resolve();eq((await second).status,'started');e.resumes[0].resolve();eq((await first).status,'cancelled');eq(e.nodes.length,2,'overtaken first request creates no extra oscillators');e.player.stop();eq(e.timers.size,0);
 }
 {
  const e=environment();eq((await e.player.play(['q'],{onStatus:x=>{if(x.status==='requested')e.player.stop('reentrant');}})).status,'cancelled');eq(e.contexts.length,0);eq(e.timers.size,0);await e.player.play(['q'],{onBeat(){throw Error('Synthetic detached UI');},onEnd(){throw Error('Synthetic detached UI');}});e.advance(2026);eq(e.timers.size,0,'UI callback failures do not leak timers');
 }
 console.log(`Rhythm Studio: ${n} finite arithmetic, retention, transaction and audio checks passed.`);
 return n;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await runRhythmChecks();
