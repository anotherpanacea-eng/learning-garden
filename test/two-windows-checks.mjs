import assert from 'node:assert/strict';
import {windowStories,windowSource,windowRelations} from '../dist/two-windows-content.mjs';
import {validWindowSource,validWindowRound,windowsView,startWindows,setWindowsPage,setWindowsAccount,chooseWindowClaim,nextWindowClaim,chooseWindowRelation,toggleWindowLine,chooseWindowCard,setWindowWords,setWindowReading,addWindowSupport,resumeWindows,evaluateWindowClaim,checkWindowClaim,checkWindowMessage,keepWindowWords,windowClaimMatches,windowMessageMatches,sourceLines} from '../dist/two-windows-core.mjs';
let count=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);count++;},ok=(x,m)=>{assert.ok(x,m);count++;},copy=x=>structuredClone(x);
const gold={
 baskets:{stated:[['baskets-B2']],inferred:[['baskets-B1','baskets-B2']],contradicted:[['baskets-A3']],unknown:[]},
 flags:{stated:[['flags-B1'],['flags-B2']],inferred:[['flags-A1','flags-B1'],['flags-A1','flags-B2']],contradicted:[['flags-A1']],unknown:[]},
 sign:{stated:[['sign-B2']],inferred:[['sign-B1']],contradicted:[['sign-B2']],unknown:[]}
};
for(const story of windowStories)for(const form of ['short','long']){
 const source=windowSource(story.id,form);ok(validWindowSource(source),'all reviewed frozen packs mechanically readable');eq(source.claims.length,4);eq(source.reader.cards.map(c=>c.fits),[false,true,true,false],'two supported useful revisions plus incomplete/unsupported cards');
 const lines=sourceLines(source).map(l=>l.id);
 for(const kind of ['stated','inferred','contradicted','unknown']){
  const claim=source.claims.find(c=>c.id===`${story.id}-${kind}`);eq(claim.kind,kind,'reviewed relation remains unchanged');eq(claim.groups,gold[story.id][kind],'reviewed evidence alternatives preserved in runtime');
  for(let mask=0;mask<2**lines.length;mask++){
   const selected=lines.filter((_,i)=>mask&(1<<i)),supported=gold[story.id][kind].some(g=>g.every(k=>selected.includes(k)));
   for(const chosen of windowRelations.map(r=>r.id)){
    const answer={classification:chosen,lines:selected},before=copy(answer),r=evaluateWindowClaim(source,claim.id,answer);
    eq(r.classificationFits,chosen===kind,'category outcome separate from selected evidence');eq(r.evidenceFits,kind==='unknown'?null:supported,'unknown does not grade proof-of-absence; all supporting supersets accepted');eq(answer,before,'pure evaluation does not change selection');
   }
  }
 }
 const short=windowSource(story.id,'short');for(const a of source.accounts)eq(a.lines.slice(0,3),short.accounts.find(x=>x.id===a.id).lines,'expanded core wording byte-identical');
}
{
 const s={},before=copy(s);eq(windowsView(s).status,'missing');eq(addWindowSupport(s,'help'),false);eq(checkWindowClaim(s),null);eq(s,before,'help/view/check do not create phantom visit');ok(setWindowsPage(s,'compare'));eq(windowsView(s).rounds.length,0,'explicit page action can open empty desk without visit');
 const r=startWindows(s,'sign');ok(validWindowRound(r));eq(r.familiar,false);chooseWindowClaim(s,'sign-inferred');chooseWindowRelation(s,'inferred');toggleWindowLine(s,'sign-B1');const check=checkWindowClaim(s);ok(check.classificationFits&&check.evidenceFits,'operative viewpoint clue alone accepted');ok(windowClaimMatches(r));const frozen=copy(check);
 chooseWindowClaim(s,'sign-stated');chooseWindowRelation(s,'contradicted');toggleWindowLine(s,'sign-A1');chooseWindowClaim(s,'sign-inferred');eq(r.answers['sign-inferred'],{classification:'inferred',lines:['sign-B1']},'statement drafts independent');eq(r.claimChecks[0],frozen,'switching question keeps old outcome');
 toggleWindowLine(s,'sign-A2');ok(!windowClaimMatches(r));eq(r.claimChecks[0],frozen);const superset=checkWindowClaim(s);ok(superset.evidenceFits,'blocked-view contextual superset accepted');
 chooseWindowClaim(s,'sign-unknown');chooseWindowRelation(s,'unknown');toggleWindowLine(s,'sign-A1');eq(checkWindowClaim(s).evidenceFits,null,'selected irrelevant line not called proof of absence');
 const next=nextWindowClaim(s);eq(next,'sign-stated','four statements cycle predictably without locks');ok(setWindowsAccount(s,'b'));for(const code of ['help','audio','together','example','help'])ok(addWindowSupport(s,code));eq(r.support,['help','audio','together','example']);ok(setWindowReading(s,'reported-independent'));eq(r.reading,'reported-independent','support never rewrites separate report');
 const second=startWindows(s,'sign','long');ok(second.familiar,'same event in another form remains familiar');eq(second.support,[]);eq(second.words,'');eq(r.claimChecks[0],frozen);ok(resumeWindows(s,r.id));
}
{
 const s={},r=startWindows(s,'baskets');const own='  A fictional roof note.\n<script>kept as words</script>  ';ok(setWindowWords(s,own));eq(r.words,own,'exact spaces/newlines/markup preserved as prose');const before=copy(r);eq(setWindowWords(s,'x'.repeat(1201)),false);eq(r,before,'over-limit writing refused, never truncated');
 eq(checkWindowMessage(s),null,'card check requires chosen supplied card');chooseWindowCard(s,'baskets-note-original');const incomplete=checkWindowMessage(s);eq(incomplete.fits,false,'true incomplete original does not meet destination goal');eq(incomplete.words,own);
 chooseWindowCard(s,'baskets-note-roof');const useful=checkWindowMessage(s);eq(useful.fits,true);const frozen=copy(useful);ok(windowMessageMatches(r));setWindowWords(s,own+'\nA new line.');ok(!windowMessageMatches(r));eq(useful,frozen,'typing keeps recorded card/words/feedback');const kept=keepWindowWords(s);eq(kept.card,null);eq(kept.fits,null,'no prose grade even when useful supplied card selected');eq(kept.words,r.words);ok(windowMessageMatches(r));chooseWindowCard(s,null);ok(windowMessageMatches(r),'card choice is separate from kept own-word draft');
}
{
 const s={},r=startWindows(s,'flags');chooseWindowRelation(s,'stated');toggleWindowLine(s,'flags-B1');checkWindowClaim(s);chooseWindowCard(s,'flags-note-dot');checkWindowMessage(s);
 r.source.title='Earlier title, kept';r.source.accounts[0].lines[0].text='Earlier author wording is retained.';r.claimChecks[0].classificationFits=false;r.claimChecks[0].expected='unknown';r.claimChecks[0].evidenceFits=null;r.claimChecks[0].feedback='An earlier recorded explanation';r.messageChecks[0].fits=false;r.messageChecks[0].text='An earlier supplied note';r.messageChecks[0].feedback='An earlier reader response';const before=copy(s);
 ok(validWindowRound(r),'old source wording and contradictory outputs retained by shape');eq(windowsView(s).current,r);eq(s,before,'view neither regrades nor refreshes from catalog');ok(windowClaimMatches(r),'input-current label does not regrade old false outcome');
 r.source.claims[0].kind='unknown';const fresh=checkWindowClaim(s);eq(fresh.expected,'unknown','new explicit check uses this visit’s old frozen metadata, not current catalog');eq(fresh.evidenceFits,null);eq(r.claimChecks[0],before.twoWindows.rounds[0].claimChecks[0]);
}
{
 const s={},r=startWindows(s,'baskets');chooseWindowRelation(s,'stated');for(let i=0;i<10;i++)checkWindowClaim(s);for(let i=0;i<10;i++)keepWindowWords(s);eq(r.claimChecks.length,8);eq(r.messageChecks.length,8);s.twoWindows.extra={keep:true};r.extra='unknown round field';s.twoWindows.rounds.push({id:2,original:'<bad prior source>'});s.twoWindows.current=2;const raw=copy(s.twoWindows.rounds[1]);eq(windowsView(s).current,r,'raw current fallback retains readable sibling');ok(chooseWindowRelation(s,'inferred'));eq(s.twoWindows.rounds[1],raw);eq(r.extra,'unknown round field');const next=startWindows(s,'flags');eq(next.id,3);eq(s.twoWindows.extra,{keep:true});for(let i=0;i<13;i++)startWindows(s,'sign');eq(windowsView(s).rounds.length,12);eq(windowsView(s).earlier,[raw],'raw sibling never evicted');
 s.twoWindows.rounds.push({id:Number.MAX_SAFE_INTEGER+1});const before=copy(s);eq(startWindows(s,'baskets'),null);eq(s,before,'unsafe imported ids refuse without mutation');ok(setWindowsPage(s,'read'),'existing visits remain usable at new-id exhaustion');
}
for(const raw of [null,'opaque',{version:99,rounds:[]},{version:1,page:'read',account:'a',current:1,nextId:0,seen:[],rounds:[]}]){const s={twoWindows:copy(raw)},before=copy(s);eq(windowsView(s).status,'unavailable');eq(startWindows(s,'sign'),null);eq(setWindowsPage(s,'read'),false);eq(addWindowSupport(s,'audio'),false);eq(setWindowWords(s,'new'),false);eq(s,before,'unsupported envelope exact and read-only');}
console.log(`Two Windows core: ${count} assertions passed.`);
