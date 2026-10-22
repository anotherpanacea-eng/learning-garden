import assert from 'node:assert/strict';
import {freshState} from '../dist/core.mjs';
import {apprenticeCases,apprenticeSource} from '../dist/fair-test-apprentice-content.mjs';
import {apprenticeView,validApprenticeSource,validApprenticeRound,setApprenticeOpen,startApprentice,setApprenticePage,changeApprenticeRepair,chooseApprenticeCard,setApprenticeWords,addApprenticeSupport,resumeApprentice,apprenticeDemonstration,checkApprenticeDemonstration,checkApprenticeCard,keepApprenticeWords,apprenticeCheckMatches} from '../dist/fair-test-apprentice-core.mjs';
import {startFair,setFairPage,setFairNote,revealFair} from '../dist/fair-test-core.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;};
const expected={'low-smooth':[12,13,12],'low-rough':[5,6,5],'middle-smooth':[19,18,19],'middle-rough':[9,10,9],'high-smooth':[26,25,26],'high-rough':[14,15,14]};
const repairSets={height:['low-smooth|high-smooth','low-rough|high-rough'],surface:['low-rough|low-smooth','middle-rough|middle-smooth','high-rough|high-smooth'],careful:['low-smooth|high-smooth','low-rough|high-rough']};
for(const item of apprenticeCases){
 const source=apprenticeSource(item.id);ok(validApprenticeSource(source));eq(source.model.length,6);
 for(const model of source.model)eq(model.distances,expected[model.id],'reviewed original model values');
 const a=source.model.find(c=>c.id===source.original.a),b=source.model.find(c=>c.id===source.original.b);ok(Math.min(...b.distances)>Math.max(...a.distances),'valid B-farther observation is preserved in every authored case');
 const options=item.mission==='height'?['smooth','rough']:['low','middle','high'];
 for(const left of options)for(const right of options){
  const s=freshState(),r=startApprentice(s,item.id),original=structuredClone(r.source.original);
  const aid=item.mission==='height'?`low-${left}`:`${left}-rough`,bid=item.mission==='height'?`high-${right}`:`${right}-smooth`;
  ok(changeApprenticeRepair(s,'a',aid));ok(changeApprenticeRepair(s,'b',bid));
  const draft=structuredClone(r.repair),c=checkApprenticeDemonstration(s),expectedFit=repairSets[item.id].includes(`${aid}|${bid}`);
  eq(c.focused,expectedFit,'all17 repair combinations use independent specification matrix');eq(c.values,{a:expected[aid],b:expected[bid]});eq(c.card,null,'demonstration does not grade a selected explanation');eq(r.source.original,original,'repair never replaces original comparison');eq(r.repair,draft);ok(validApprenticeRound(r));
  const stored=structuredClone(c);chooseApprenticeCard(s,item.id+'-useful');setApprenticeWords(s,'  Private fictional explanation.\nExactly kept.  ');eq(r.checks[0],stored,'new choices/prose do not rewrite demonstration');ok(apprenticeCheckMatches(r,c),'irrelevant card/prose change does not invalidate the demonstrated pair');
  const before=structuredClone(r);ok(!changeApprenticeRepair(s,'a',item.mission==='height'?'middle-smooth':'low-smooth'),'fixed question factor cannot quietly change');eq(r,before);
 }
 const s=freshState(),r=startApprentice(s,item.id);
 eq(checkApprenticeCard(s),null,'blank selection creates no check');eq(r.checks,[]);
 for(const card of source.cards){chooseApprenticeCard(s,card.id);const c=checkApprenticeCard(s);eq(c.card.fits,card.id===item.id+'-useful','every12 supplied card outcome matches reviewed content');eq(c.card.text,card.text);eq(c.feedback,card.feedback);eq(c.values,null);eq(c.focused,null,'card check does not assess current repair');ok(apprenticeCheckMatches(r,c));setApprenticeWords(s,'A new fictional explanation after this card check.');ok(apprenticeCheckMatches(r,c),'private writing is not part of supplied-card relevance');chooseApprenticeCard(s,null);ok(!apprenticeCheckMatches(r,c),'a different card input marks previous card check earlier');}
 const previous=structuredClone(r.checks);chooseApprenticeCard(s,item.id+'-useful');const words='\n  Our fictional words.\r\n<&> “Exactly.”  ';ok(setApprenticeWords(s,words));eq(r.words,words);const own=keepApprenticeWords(s);eq(own.card,null);eq(own.focused,null);eq(own.values,null);eq(own.input.words,words);eq(r.checks.slice(0,previous.length),previous);ok(apprenticeCheckMatches(r,own));
 chooseApprenticeCard(s,null);ok(apprenticeCheckMatches(r,own),'ungraded snapshot not tied to unrelated card choice');setApprenticeWords(s,words+'x');ok(!apprenticeCheckMatches(r,own));
 const unchanged=structuredClone(r);ok(!setApprenticeWords(s,'x'.repeat(801)));eq(r,unchanged,'over-limit text refused without truncation');ok(setApprenticeWords(s,'🪴'.repeat(400)));eq(r.words.length,800,'browser UTF16 limit');ok(!setApprenticeWords(s,'🪴'.repeat(401)));
}
{
 const s=freshState(),before=structuredClone(s);eq(apprenticeView(s).status,'missing');eq(s,before);ok(!addApprenticeSupport(s,'help'));ok(!setApprenticePage(s,'show'));eq(s,before,'support/page cannot invent a visit');ok(setApprenticeOpen(s,true));eq(s.fairTests.investigations,[]);eq(s.fairTests.seen,false);eq(s.fairTests.apprentice,undefined,'open creates neither ordinary investigation nor encounter');startApprentice(s,'height');eq(s.fairTests.investigations,[]);eq(s.fairTests.seen,false,'supplied apprentice examples not ordinary independent trials');
}
{
 const s=freshState();startFair(s);setFairPage(s,'tell');setFairNote(s,'  Earlier actual investigation.\n ');revealFair(s,'A');const base=structuredClone(s.fairTests),r=startApprentice(s,'height');addApprenticeSupport(s,'audio');addApprenticeSupport(s,'help');checkApprenticeDemonstration(s);setApprenticeOpen(s,false);const after=structuredClone(s.fairTests);delete after.apprentice;delete after.apprenticeOpen;eq(after,base,'all original page/trials/prose/support untouched by apprentice');
 startApprentice(s,'surface');eq(apprenticeView(s).current.support,[]);eq(apprenticeView(s).current.familiar,false);startApprentice(s,'height');ok(apprenticeView(s).current.familiar,'familiarity follows encounter id');eq(apprenticeView(s).current.support,[]);resumeApprentice(s,r.id);eq(apprenticeView(s).current.support,['audio','help'],'own earlier support resumes');
}
{
 const s=freshState(),r=startApprentice(s,'height');chooseApprenticeCard(s,'height-useful');const card=checkApprenticeCard(s),demo=checkApprenticeDemonstration(s);card.card.fits=false;card.card.text='Earlier exact supplied wording';card.feedback='Earlier feedback';demo.focused=true;demo.values={a:[30,29,30],b:[0,1,0]};demo.feedback='Earlier demo feedback';r.source.claim='Earlier original claim';r.source.model[0].distances=[2,2,2];const before=structuredClone(s);ok(validApprenticeRound(r),'changed numbers/wording/contradictory historical outputs stay readable');apprenticeView(s);eq(s,before,'reading old results never recomputes them');const oldChecks=structuredClone(r.checks);changeApprenticeRepair(s,'b','high-smooth');const next=checkApprenticeDemonstration(s);eq(r.checks.slice(0,2),oldChecks,'explicit new check leaves both earlier records byte-for-byte');eq(next.values.a,[2,2,2],'only explicit new demonstration uses frozen source model');eq(r.checks[0],card);eq(r.checks[1],demo);eq(apprenticeSource('height').model[0].distances,expected['low-smooth'],'saved pack mutations do not alter catalog');
}
for(const value of [null,'<script>opaque</script>',{version:99,original:'<img src=x>'}]){
 const s=freshState();setApprenticeOpen(s,true);s.fairTests.apprentice=structuredClone(value);const before=structuredClone(s.fairTests.apprentice);eq(apprenticeView(s).status,'unavailable');eq(startApprentice(s,'height'),null);ok(!addApprenticeSupport(s,'help'));eq(s.fairTests.apprentice,before);ok(setApprenticeOpen(s,false));eq(s.fairTests.apprentice,before,'opaque child can close without rewriting it');const r=startFair(s);ok(r,'ordinary bench remains usable');eq(s.fairTests.apprentice,before);
}
{
 const s=freshState();s.fairTests={version:99,original:'earlier base'};const before=structuredClone(s);ok(!setApprenticeOpen(s,true));eq(startApprentice(s,'height'),null);eq(s,before,'future base entirely read-only');
}
{
 const s=freshState(),r=startApprentice(s,'height');s.fairTests.apprentice.extra='root kept';r.extra={original:true};s.fairTests.apprentice.rounds.push({id:9.5,raw:'earlier'},null);const raw=structuredClone(s.fairTests.apprentice.rounds.slice(1));const next=startApprentice(s,'surface');eq(next.id,10,'new id exceeds fractional raw sibling');eq(s.fairTests.apprentice.rounds.slice(1,3),raw);eq(s.fairTests.apprentice.extra,'root kept');eq(r.extra,{original:true});s.fairTests.apprentice.rounds.push({id:Number.MAX_SAFE_INTEGER,raw:'exhausted'});const before=structuredClone(s);eq(startApprentice(s,'careful'),null);eq(s,before,'unsafe id exhaustion nonmutating');ok(changeApprenticeRepair(s,'a','middle-rough'),'existing readable encounter remains playable');
}
{
 const s=freshState();for(let i=0;i<12;i++)startApprentice(s,'height');const raw={id:90,raw:'unreadable kept'};s.fairTests.apprentice.rounds.splice(2,0,raw);const before=structuredClone(s);eq(apprenticeView(s).rounds.length,12);eq(s,before);const next=startApprentice(s,'surface');eq(next.id,91);eq(apprenticeView(s).rounds.map(r=>r.id),[2,3,4,5,6,7,8,9,10,11,12,91]);ok(s.fairTests.apprentice.rounds.includes(raw),'explicit cap evicts only readable entries');
 const r=apprenticeView(s).current;for(let i=0;i<9;i++){setApprenticeWords(s,String(i));keepApprenticeWords(s);}eq(r.checks.length,8);eq(r.checks.map(c=>c.input.words),['1','2','3','4','5','6','7','8']);
}
console.log(`Fair Test apprentice core: ${n} assertions passed.`);
