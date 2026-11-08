// Spec603 · Act IV chapter 3. Fixtures come from the real Act IV and Travelers' Archive APIs; story offers are not learning results.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {orchardSeed} from './act-four-orchard-checks.mjs';
import {actFourHosts} from './act-four-checks.mjs';
import {canExport} from './act-two-checks.mjs';
import * as A from '../dist/act-four-core.mjs';
import {actFourPage,actFourNotes,actFourReturn,actFourRoute} from '../dist/act-four-ui.mjs';
import {actFourContent as C} from '../dist/act-four-content.mjs';
import {ensureTravelersArchive,keepArchiveReply,setArchiveReplyChoice,setArchiveReplyText} from '../dist/travelers-archive-core.mjs';
import {ARCHIVE_PACK} from '../dist/travelers-archive-content.mjs';

const options={canExport},clone=structuredClone;
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const SECRET='A private sentence the story must never read';
export function keepReply(s){ensureTravelersArchive(s);assert.ok(setArchiveReplyChoice(s,'claim','return-later'));setArchiveReplyText(s,SECRET);assert.ok(keepArchiveReply(s));return s;}

export function runChecks(){
 let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(v,m)=>{assert.ok(v,m);n++;};
 const unchanged=(s,fn,label)=>{const before=clone(s);fn();eq(s,before,label);};

 eq(actFourRoute('#almanac/two-stories/gazette'),{part:'chapter',chapter:'gazette'},'chapter 3 route');
 eq(A.actFourLiveChapters,['account','orchard','gazette'],'three reading chapters');

 const s=orchardSeed();
 eq(A.actFourView(s).sources.gazette,{status:'missing',retainedUnreadable:false,candidates:[]},'no archive root reads as missing');
 ensureTravelersArchive(s);
 eq(A.actFourCandidates(s,'gazette'),[],'an archive visit with nothing kept offers nothing');
 ok(actFourPage(s,{part:'chapter',chapter:'gazette'}).includes(esc(C.gazette.noWork)),'the chapter says nothing is ready yet');

 keepReply(s);
 const c=A.actFourCandidates(s,'gazette');
 eq(c.map(x=>({key:x.key,ref:x.ref,packLabel:x.packLabel})),[{key:JSON.stringify(['gazette',ARCHIVE_PACK.id]),ref:{packId:ARCHIVE_PACK.id},packLabel:ARCHIVE_PACK.visit}],'one candidate, named by its pack');
 const page=actFourPage(s,{part:'chapter',chapter:'gazette'});
 ok(page.includes(esc('Kept archive reply: '+ARCHIVE_PACK.visit)),'labelled by the visit, never by the reply');
 ok(!page.includes(SECRET)&&!JSON.stringify(c).includes(SECRET),'the reply text is never read into a candidate or page');
 unchanged(s,()=>{A.actFourView(s);A.actFourCandidates(s,'gazette');actFourPage(s,{part:'chapter',chapter:'gazette'});actFourNotes(s);},'reads and renders write nothing');

 // Offering: atomic refusal, one id-only receipt, a repeat is a no-op, other chapters untouched.
 unchanged(s,()=>eq(A.offerActFour(s,'gazette',c[0].key,{canExport:()=>false}),false,'a refused export writes nothing'),'refusal leaves the notebook unchanged');
 const archive=clone(s.travelersArchive);
 ok(A.offerActFour(s,'gazette',c[0].key,options),'offer the kept reply');
 eq(s.story.acts.IV.contributions.gazette,{kind:'act-four-offer',version:1,chapter:'gazette',activity:'travelers-archive',artifactKind:'kept-reply',ref:{packId:ARCHIVE_PACK.id}},'the receipt holds the pack id only');
 ok(!JSON.stringify(s.story).includes(SECRET),'no reply text reaches the story');
 eq(s.travelersArchive,archive,'offering leaves the archive unchanged');
 ok(A.offerActFour(s,'gazette',c[0].key,options),'offering again reports done');
 const first=clone(s.story.acts.IV.contributions.gazette),other=clone(s);other.travelersArchive.kept.packId='valencia-1957-v1';
 ok(A.offerActFour(other,'gazette',A.actFourCandidates(other,'gazette')[0].key,options),'offering another pack after a receipt reports done');
 eq(other.story.acts.IV.contributions.gazette,first,'and the first receipt stays exactly as it was');
 // A later keep replaces the archive's reply; the receipt still names the same pack and is never revoked.
 setArchiveReplyText(s,'A changed reply');keepArchiveReply(s);eq(A.actFourView(s).chapterStatus.gazette,'ready','a later keep never revokes the receipt');
 const gone=clone(s);delete gone.travelersArchive;eq(A.actFourView(gone).chapterStatus.gazette,'ready','removing the archive keeps the receipt');

 // Snapshots are judged by their own shape; a pack from another version is still offered; malformed ones are not.
 const h=orchardSeed();keepReply(h);
 const later=clone(h);later.travelersArchive.kept.packId='valencia-1957-v2';
 eq(A.actFourCandidates(later,'gazette').map(x=>[x.ref.packId,x.packLabel]),[['valencia-1957-v2',null]],'a pack from another version is offered with a plain label');
 ok(actFourPage(later,{part:'chapter',chapter:'gazette'}).includes(esc(C.gazette.candidateEarlier)),'and named plainly');
 const none=clone(h);none.travelersArchive.kept.sources=[];eq(A.actFourCandidates(none,'gazette').length,1,'a reply kept with no sources is still offered');
 for(const [label,make] of [['no pack id',x=>{delete x.kept.packId;}],['reply that is not an object',x=>{x.kept.reply='text';}],['empty reply',x=>{x.kept.reply={};}],['a coded field that is a number',x=>{x.kept.reply.claim=42;}],['reply text that is not a string',x=>{x.kept.reply.text=7;}],['a source with no id',x=>{x.kept.sources=[{}];}],['a duplicated source id',x=>{x.kept.sources=[x.kept.sources[0],x.kept.sources[0]];}]]){
  const y=clone(h);make(y.travelersArchive);eq(A.actFourCandidates(y,'gazette'),[],'not offered: '+label);ok(A.actFourView(y).sources.gazette.retainedUnreadable,'reported: '+label);
 }
 const root=clone(h);root.travelersArchive.version=2;eq(A.actFourView(root).sources.gazette.status,'unreadable','an unsupported root reads as unreadable');

 // Receipt validation is shape only.
 const good={kind:'act-four-offer',version:1,chapter:'gazette',activity:'travelers-archive',artifactKind:'kept-reply',ref:{packId:'paris-flood-1910-v1'}};
 ok(A.validActFourOffer(good)&&A.validActFourOffer({...good,ref:{packId:'a-future-pack'}}),'well-formed receipts, including a future pack');
 for(const [label,bad] of [['activity',{...good,activity:'rain-paths'}],['kind',{...good,artifactKind:'kept-result'}],['extra ref key',{...good,ref:{packId:'p',text:'x'}}],['empty id',{...good,ref:{packId:''}}]])ok(!A.validActFourOffer(bad),'rejects '+label);

 // Before Act IV starts nothing can be offered; chapter 3 counts towards the ending.
 const early=keepReply(actFourHosts());
 unchanged(early,()=>eq(A.offerActFour(early,'gazette',A.actFourCandidates(early,'gazette')[0]?.key,options),false,'no offer before Act IV starts'),'and nothing is written');
 const two=keepReply(orchardSeed());ok(A.offerActFour(two,'gazette',A.actFourCandidates(two,'gazette')[0].key,options));ok(A.offerActFour(two,'account',A.actFourCandidates(two,'account')[0].key,options));ok(A.keepActFourPlan(two,'wall',null,options));
 eq([A.actFourView(two).earlierChapters,A.actFourView(two).canEnd],[2,true],'chapters 1 and 3 with a plan can end the meeting');
 eq(A.actFourMindChange(A.actFourView(two)),'account','with no chapter 2 rain result, Pip changes his mind');

 // Rendering.
 const hub=actFourPage(s,{part:'hub'});
 ok(['account','orchard','gazette','meeting'].every(x=>hub.includes(`#almanac/two-stories/${x}`)),'the hub links all four chapters');
 const pageAri=actFourPage({...s,garden:{guide:'ari'}},{part:'chapter',chapter:'gazette'});
 ok(pageAri.includes('data-a4-gazette')&&pageAri.includes(`aria-label="${esc(C.gazette.scene)}"`),'the Gazette scene is described');
 ok(C.gazette.headlines.every(h=>pageAri.includes(esc(h).split(' ')[0])),'both headlines are on the front page');
 ok(pageAri.includes('href="#archive"'),'the chapter links the Travelers’ Archive');
 ok(pageAri.includes(esc(C.gazette.kept))&&pageAri.includes('Ari reads both headlines again'),'after an offer, the kept line and the guide line');
 ok(actFourNotes(s).includes('chapter 3 has work'),'Notes name chapter 3');
 ok(actFourReturn(s,'gazette').includes('#almanac/two-stories/gazette'),'the archive offers the way back to chapter 3');
 return n;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(`Act IV chapter 3: ${runChecks()} checks passed`);
