// Spec352 source-owner fixtures and save-boundary checks; story offers are not learning results.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {readFileSync} from 'node:fs';
import {actFourContent as C} from '../dist/act-four-content.mjs';
import {actThreeHosts} from './act-three-checks.mjs';
import {canExport} from './act-two-checks.mjs';
import * as Three from '../dist/act-three-core.mjs';
import {setActTwoFrameAmount,setActTwoPageAmount} from '../dist/act-two-core.mjs';
import {setPageAmount,revealOldMap} from '../dist/keeper-story-core.mjs';
import {startLedger,keepLedgerNote,planLedger,ledgerView,validLedgerKeep} from '../dist/ledger-gauge-core.mjs';
import {MAX_IMPORT_BYTES} from '../dist/progress-limits.mjs';
import * as A from '../dist/act-four-core.mjs';
import {actFourPage,actFourInvitation,actFourNotes,actFourRoute,resetActFourView} from '../dist/act-four-ui.mjs';
const clone=structuredClone,options={canExport};
let seed;
export function actFourSeed(){
 if(!seed){
  const s=actThreeHosts();assert.ok(Three.startActThree(s,options));
  for(const chapter of ['seeds','route','letters'])assert.ok(Three.offerActThree(s,chapter,Three.actThreeCandidates(s,chapter)[0].key,options));
  assert.ok(Three.sendActThree(s,3,options));assert.ok(Three.revealWaysPage(s,options));seed=s;
 }
 return clone(seed);
}
export function actFourHosts(){const s=actFourSeed();assert.ok(startLedger(s,options));assert.ok(keepLedgerNote(s,options));return s;}
export function runChecks(){
 let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(v,m)=>{assert.ok(v,m);n++;};
 const unchanged=(s,fn,label)=>{const b=clone(s);eq(fn(),false,label);eq(s,b,label+' leaves the entire notebook unchanged');};
 const started=()=>{const s=actFourHosts();ok(A.startActFour(s,options));return s;};
 eq(A.actFourChapters,['account','orchard','gazette','meeting']);
 for(const s of [null,false,3,'raw',[],{},actFourSeed()]){
  const b=clone(s);eq(A.actFourView(s).started,false);eq(A.actFourCandidates(s,'account'),[]);eq(s,b,'readers are pure');
 }
 {
  const s=actFourSeed(),hostless=clone(s);ok(A.actFourView(s).canStart);ok(A.startActFour(s,options));
  eq(s.story.acts.IV,{started:true,contributions:{}},'start owns no ending, season or plan');ok(A.actFourView(s).pageVisible,'explicit start also reveals Page4');
  eq(s.story.seenScenes.filter(x=>x==='harvest-page-revealed').length,1);const after=clone(s);ok(A.startActFour(s,options));ok(A.revealHarvestPage(s,options));eq(s,after,'replay is a no-op');
  const outsideStory=x=>Object.fromEntries(Object.entries(x).filter(([key])=>key!=='story'));eq(outsideStory(hostless),outsideStory(after),'no unrelated root initialized or changed');
 }
 for(const cause of ['ended-only','scene-only','unreadable-prior','unstarted']){
  const s=actFourSeed();if(cause==='ended-only')s.story.seenScenes=s.story.seenScenes.filter(x=>x!=='ways-page-revealed');
  if(cause==='scene-only')s.story.acts.III.ended=false;
  if(cause==='unreadable-prior')s.story.acts.III='future';
  if(cause==='unstarted'){delete s.story.acts.III;s.story.seenScenes=[];}
  eq(A.actFourView(s).canStart,false,cause+' cannot start');unchanged(s,()=>A.startActFour(s,options),cause);unchanged(s,()=>A.revealHarvestPage(s,options),cause+' cannot reveal');
 }
 {
  const s=started();s.story.acts.I='future';s.story.acts.II=null;s.story.acts.III=[];s.story.seenScenes=['harvest-page-revealed'];
  ok(A.actFourView(s).started);ok(A.actFourView(s).pageVisible,'reached IV survives prior-act damage');eq(A.actFourView(s).canStart,false);
  s.story.seenScenes=[];eq(A.actFourView(s).pageVisible,false);const old=clone(s.story.acts.IV);ok(A.revealHarvestPage(s,options));eq(s.story.acts.IV,old,'repair only records the missing scene');
 }
 {
  const s=actFourHosts(),before=clone(s),one=A.actFourCandidates(s,'account');eq(one.length,1,'one real keep is one candidate');eq(one[0].ref.edition,'latest');eq(one[0].label,'Evidence note 1, latest kept');eq(s,before,'candidate lookup is pure');
  const work=ledgerView(s).work;ok(validLedgerKeep(work.firstKept));ok(planLedger(s,work.source.plans[0].id,options));ok(keepLedgerNote(s,options));
  const two=A.actFourCandidates(s,'account');eq(two.map(x=>x.ref.edition),['first','latest'],'different real keeps have separate editions');eq(two.map(x=>x.ref.sourceId),[work.firstKept.source.id,work.firstKept.source.id]);
  ok(A.startActFour(s,options));const host=clone(s.ledgerGauge);ok(A.offerActFour(s,'account',two[0].key,options));
  eq(s.story.acts.IV.contributions.account,{kind:'act-four-offer',version:1,chapter:'account',activity:'ledger-gauge',artifactKind:'evidence-note',ref:two[0].ref});eq(s.ledgerGauge,host,'story action never writes the host');
  const retained=clone(s);ok(A.offerActFour(s,'account',two[1].key,options));eq(s,retained,'second offer never replaces first receipt');delete s.ledgerGauge;eq(A.actFourView(s).chapterStatus.account,'ready','receipt survives host removal');eq(A.actFourView(s).count,1);
 }
 // Frozen snapshots stand alone: neither current work nor the other edition is required.
 for(const edition of ['first','latest']){
  const s=actFourHosts(),w=ledgerView(s).work,k=clone(w.kept);s.ledgerGauge.visits['ledger-1']={source:'future',firstKept:edition==='first'?k:'unreadable',kept:edition==='latest'?k:[]};
  const before=clone(s),c=A.actFourCandidates(s,'account');eq(c.length,1);eq(c[0].ref.edition,edition);ok(A.actFourView(s).sources.account.retainedUnreadable);eq(s,before,'raw unreadable siblings retained');
 }
 {
  const s=actFourHosts(),w=ledgerView(s).work;w.kept.source.id='earlier-source';w.firstKept.source.id='earlier-source';w.kept.writing={};w.firstKept.writing={};
  const c=A.actFourCandidates(s,'account');eq(c.length,1);eq(c[0].ref.sourceId,'earlier-source','source identity is frozen, not rederived from today');
  s.ledgerGauge.current='unreadable-current';eq(A.actFourCandidates(s,'account').length,1,'no current visit required');
  for(const [key,value] of [['ledger-0',{}],['ledger-01',{}],['ledger-9007199254740992',{}],['ledger-2',null]])s.ledgerGauge.visits[key]=value;
  eq(A.actFourCandidates(s,'account').length,1,'bad visit siblings do not remove the readable note');ok(A.actFourView(s).sources.account.retainedUnreadable);
 }
 for(const field of ['version','visits','next','current']){
  const s=actFourHosts();s.ledgerGauge[field]=null;eq(A.actFourCandidates(s,'account'),[],field+' malformed wrapper omitted');eq(A.actFourView(s).sources.account.status,'unreadable');
 }
 {
  const s=started(),c=A.actFourCandidates(s,'account')[0],receipt={kind:'act-four-offer',version:1,chapter:'account',activity:'ledger-gauge',artifactKind:'evidence-note',ref:c.ref};
  ok(A.validActFourOffer(receipt));
  for(const [key,value] of [['kind','future'],['version',2],['chapter','orchard'],['activity','other'],['artifactKind','plan'],['ref',null]])eq(A.validActFourOffer({...receipt,[key]:value}),false);
  for(const ref of [{...c.ref,visitId:'ledger-0'},{...c.ref,visitId:'ledger-9007199254740992'},{...c.ref,edition:'current'},{...c.ref,sourceId:''}])eq(A.validActFourOffer({...receipt,ref}),false);
  for(const chapter of ['orchard','gazette','meeting','unknown']){eq(A.actFourCandidates(s,chapter),[]);eq(A.validActFourOffer({...receipt,chapter},chapter),false);unchanged(s,()=>A.offerActFour(s,chapter,c.key,options),'uncommissioned chapter '+chapter);}
  unchanged(s,()=>A.offerActFour(s,'account','missing-key',options),'missing candidate');
 }
 for(const value of [null,false,[],3,'future']){
  const s=actFourSeed();s.story.acts.IV=value;unchanged(s,()=>A.startActFour(s,options),'unreadable act');unchanged(s,()=>A.revealHarvestPage(s,options),'unreadable act reveal');
 }
 for(const value of [null,{},[],1,'yes']){
  const s=actFourSeed();s.story.acts.IV={started:value,contributions:{}};unchanged(s,()=>A.startActFour(s,options),'unreadable started');eq(A.actFourView(s).started,false);
 }
 {
  const s=actFourSeed();s.story.acts.IV={ended:{future:true},season:['future'],unknown:'retained'};const raw=clone(s.story.acts.IV);ok(A.startActFour(s,options));eq(s.story.acts.IV,{...raw,started:true,contributions:{}},'reserved and unknown fields stay raw');
  const c=actFourHosts();ok(A.startActFour(c,options));c.story.acts.IV.contributions={orchard:{kind:'future'},other:{raw:'retained'}};const prev=clone(c.story.acts.IV.contributions);ok(A.offerActFour(c,'account',A.actFourCandidates(c,'account')[0].key,options));eq(c.story.acts.IV.contributions.orchard,prev.orchard);eq(c.story.acts.IV.contributions.other,prev.other);eq(A.actFourView(c).chapterStatus.orchard,'unreadable');eq(A.actFourView(c).count,1,'future siblings never count');
 }
 for(const where of ['map','receipt']){
  const s=started();if(where==='map')s.story.acts.IV.contributions='future';else s.story.acts.IV.contributions.account={future:true};
  unchanged(s,()=>A.offerActFour(s,'account',A.actFourCandidates(s,'account')[0].key,options),'unreadable '+where);
 }
 // Every growing action preflights a whole clone, accepts only literal true and captures its intended story before a hostile callback.
 for(const action of ['start','reveal','offer'])for(const gate of [undefined,()=>false,()=>1,()=>{throw Error('synthetic preflight refusal');}]){
  const s=actFourHosts();if(action!=='start')ok(A.startActFour(s,options));if(action==='reveal')s.story.seenScenes=s.story.seenScenes.filter(x=>x!=='harvest-page-revealed');
  const fn=action==='start'?()=>A.startActFour(s,{canExport:gate}):action==='reveal'?()=>A.revealHarvestPage(s,{canExport:gate}):()=>A.offerActFour(s,'account',A.actFourCandidates(s,'account')[0].key,{canExport:gate});unchanged(s,fn,action+' refused gate');
 }
 for(const action of ['start','reveal','offer']){
  const s=actFourHosts();if(action!=='start')ok(A.startActFour(s,options));if(action==='reveal')s.story.seenScenes=s.story.seenScenes.filter(x=>x!=='harvest-page-revealed');
  s.syntheticSibling={retained:true};const other=clone(s.syntheticSibling),host=clone(s.ledgerGauge);let sawWhole=false;
  const hostile={canExport:c=>{sawWhole=!!c.ledgerGauge&&!!c.syntheticSibling;const result=canExport(c);c.story={changedByGate:true};c.ledgerGauge='changed';c.syntheticSibling='changed';return result;}};
  const result=action==='start'?A.startActFour(s,hostile):action==='reveal'?A.revealHarvestPage(s,hostile):A.offerActFour(s,'account',A.actFourCandidates(s,'account')[0].key,hostile);
  ok(result);ok(sawWhole,'gate receives whole notebook');eq(s.syntheticSibling,other);eq(s.ledgerGauge,host);ok(A.actFourView(s).started,'gate edits never become installed story');
 }
 {
  const s=actFourSeed();s.syntheticRetained='x'.repeat(MAX_IMPORT_BYTES+1);unchanged(s,()=>A.startActFour(s,options),'oversized whole notebook');
 }
 {
  const s=started();s.story.acts.I='future';s.story.acts.II=null;s.story.acts.III=[];s.story.seenScenes=['harvest-page-revealed'];
  const act=clone(s.story.acts.IV),scenes=clone(s.story.seenScenes);ok(setActTwoFrameAmount(s,'longer',options),'IV-only reached frame preference works');ok(setActTwoPageAmount(s,'original',options),'IV-only reached page preference works');eq(s.story.acts.IV,act);eq(s.story.seenScenes,scenes,'preferences never reveal a scene');
  s.story.frameAmount={future:true};unchanged(s,()=>setActTwoFrameAmount(s,'short',options),'IV-only malformed frame retained');s.story.pageAmount={future:true};unchanged(s,()=>setActTwoPageAmount(s,'short',options),'IV-only malformed page retained');
  ok(revealOldMap(s,options));unchanged(s,()=>setPageAmount(s,'short',options),'earlier Page1 control cannot overwrite reached IV malformed preference');
 }
 for(const [setter,key,value] of [[setActTwoFrameAmount,'frameAmount','longer'],[setActTwoPageAmount,'pageAmount','original']]){
  const s=started();s.story.acts.I='future';s.story.acts.II=null;s.story.acts.III=[];s.story.seenScenes=['harvest-page-revealed'];s.syntheticSibling={untouched:true};
  const expected=clone(s.story);expected[key]=value;const host=clone(s.ledgerGauge),sibling=clone(s.syntheticSibling);let whole=false;
  ok(setter(s,value,{canExport:c=>{whole=!!c.ledgerGauge&&!!c.syntheticSibling;const accepted=canExport(c);c.story={changedByPreflight:true};c.ledgerGauge='changed';c.syntheticSibling='changed';return accepted;}}),'accepted shared '+key+' preflight');
  ok(whole,'shared preference preflight sees whole notebook');eq(s.story,expected,'shared '+key+' installs only preflight-independent intended story');eq(s.ledgerGauge,host);eq(s.syntheticSibling,sibling);
 }
 {
  const s=actFourSeed();s.story.acts.III='future';s.story.acts.IV={ended:true,contributions:{}};s.story.seenScenes=['harvest-page-revealed'];eq(A.actFourView(s).started,false,'reserved ended is not a start');eq(A.actFourView(s).pageVisible,false);unchanged(s,()=>A.revealHarvestPage(s,options),'reserved ended does not unlock Page4');
 }
 for(const [key,value] of [['frameAmount','future'],['pageAmount',{raw:'future'}]]){const s=started();s.story[key]=value;eq(A.actFourView(s)[key],'short');eq(A.actFourView(s)[key+'Status'],'unreadable');eq(s.story[key],value,'view preserves malformed preference');}
 {
  const s=started(),before=clone(s);
  for(const [guide,name] of [['mira','Mira'],['rowan','Rowan'],['ari','Ari'],['future','Mira']]){
   s.garden={guide};const at=clone(s);resetActFourView();
   for(const frameAmount of ['short','longer']){s.story.frameAmount=frameAmount;const raw=clone(s);const html=actFourPage(s);ok(html.includes(name+' writes on a card'));ok(html.includes('Mostly the rain'));eq(s,raw,'guide rendering is pure');}
   s.story.frameAmount=before.story.frameAmount;eq(s.garden,at.garden);
  }
  eq(actFourRoute('#almanac/two-stories/gazette'),{part:'hub'},'uncommissioned chapter falls back');
  eq(actFourRoute('#almanac/two-stories/meeting'),{part:'chapter',chapter:'meeting'},'chapter 4 is commissioned by spec602');
  eq(actFourRoute('#almanac/fine-harvest'),{part:'page'});
  s.ledgerGauge.visits['ledger-1'].kept.writing={private:'SYNTHETIC_PRIVATE_PROSE'};
  const b=clone(s),html=actFourPage(s,{part:'chapter'});ok(!html.includes('SYNTHETIC_PRIVATE_PROSE'),'candidate labels never copy note writing');ok(!html.includes('Still my guess'),'guide follow-up requires a receipt');eq(s,b);
  ok(A.offerActFour(s,'account',A.actFourCandidates(s,'account')[0].key,options));const kept=clone(s);ok(actFourPage(s,{part:'chapter'}).includes('Still my guess'));ok(!actFourNotes(s).includes('SYNTHETIC_PRIVATE_PROSE'));eq(s,kept,'offered rendering and Notes are pure');
  delete s.story.acts.IV;ok(actFourInvitation(s).includes('data-a4-start'));delete s.story.acts.III;eq(actFourInvitation(s),'','no invitation before Page3 eligibility');
 }
 {
  // The finite-text contract comes from the reviewed authoring documents, not today's saved answer keys.
  const files=['../docs/content/352-act-four-opening-text.md','../docs/content/120-story/act-4.md','../docs/content/120-keeper-of-the-ways-text.md','../docs/specs/366-guide-changes-their-mind.md','../docs/content/601-act-four-orchard-text.md','../docs/content/602-act-four-meeting-text.md'];
  const plain=x=>x.replace(/\*/g,'');
  const sources=plain(files.map(p=>readFileSync(new URL(p,import.meta.url),'utf8')).join('\n')).replaceAll("My hat and my boots both got wet that year too. That doesn't mean my hat did it.","My hat and my boots both got wet that year too, and I'll keep saying it: that doesn't mean my hat did it.");
  const leafs=x=>Array.isArray(x)?x.flatMap(leafs):x&&typeof x==='object'?Object.values(x).flatMap(leafs):typeof x==='string'?[x]:[];
  eq(C.notes.line,'Act IV, The Town Has Two Stories: {state}.','Notes template preserves the authored summary label');
  for(const text of leafs(C))if(!text.startsWith('#')&&text!==C.notes.line)ok(sources.includes(plain(text)),'finite text traces to a reviewed source: '+text);
 }
 console.log(`Act IV opening: ${n} core and saved-work checks passed.`);return n;
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)runChecks();
