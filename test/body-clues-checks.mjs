import assert from 'node:assert/strict';
import {bodyCatalog,bodySource,bodyFeatureChoices} from '../dist/body-clues-content.mjs';
import {bodyView,validBodySource,validBodyRound,validBodyCheck,startBody,setBodyPage,setBodyView,chooseBodyLegs,chooseBodyFeature,addBodySupport,resumeBody,evaluateBody,checkBody,bodyCheckMatches} from '../dist/body-clues-core.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;};
// Independent finite-picture oracle. A legitimate key leaf need not fit the pictured animal.
const oracle={snail:['0','shell','Garden land snail'],worm:['0','rings','Earthworm'],ladybird:['6','cases','Ladybird beetle'],woodlouse:['14','plates','Woodlouse']};
eq(bodyCatalog.length,4);
for(const [picture,[count,feature,label]] of Object.entries(oracle)){
 const s=bodySource(picture);ok(validBodySource(s));eq(s.expected,{legs:count,body:feature});eq(s.label,label);eq(s.drawing,{version:1,kind:picture});
 for(const legs of ['0','6','14','other','unsure'])for(const chosen of [null,'shell','rings','cases','plates','other','unsure']){
  const expectedAllowed=legs==='0'?['shell','rings','other','unsure']:legs==='6'?['cases','other','unsure']:legs==='14'?['plates','other','unsure']:[null];
  const before=structuredClone(s),c=evaluateBody(s,{legs,feature:chosen});eq(s,before,'evaluation does not alter the supplied source');
  if(!expectedAllowed.includes(chosen)){eq(c,null,'incomplete/dependent-invalid trail is not a check');continue;}
  const entry=Object.entries(oracle).find(([,v])=>v[0]===legs&&v[1]===chosen);
  eq(c.named,entry?{id:entry[0],label:entry[1][2]}:null,'key leaf comes from both chosen features');
  eq(c.stop,legs==='unsure'||chosen==='unsure'?'unclear':entry?null:'outside');
  eq(c.features,{legs:legs==='unsure'?null:legs===count,body:chosen===null||chosen==='unsure'?null:chosen===feature},'uncertain is unobserved, not false');
  ok(validBodyCheck(c));eq(c.source,s);ok(c.source!==s&&c.source.key!==s.key,'check freezes complete own key/source');
 }
}
{
 const state={};const old=startBody(state,'snail');chooseBodyLegs(state,'0');chooseBodyFeature(state,'shell');const oldCheck=checkBody(state);
 const saved=JSON.parse(JSON.stringify(state));const fifth=bodySource('ladybird');
 fifth.id='synthetic-fifth';fifth.title='Synthetic picture';fifth.expected.body='new_clue';
 fifth.key.push({id:'synthetic-fifth',legs:'6',body:'new_clue',label:'Synthetic fifth leaf',clue:'Synthetic fifth clue'});
 ok(validBodySource(fifth),'new clue vocabulary is valid without changing the current source catalog');
 bodyCatalog.push(fifth);
 try{
  eq(bodyView(saved).current.source.key.length,4,'saved four-entry visit stays readable after catalog extension');
  eq(bodyView(saved).current.checks[0],oldCheck,'old recorded outcome stays exact');
  const newer=startBody(saved,'synthetic-fifth');ok(validBodyRound(newer));eq(newer.source.key.length,5);
  chooseBodyLegs(saved,'6');ok(chooseBodyFeature(saved,'new_clue'));const checked=checkBody(saved);
  eq(checked.named,{id:'synthetic-fifth',label:'Synthetic fifth leaf'});eq(checked.features,{legs:true,body:true});
  const reloaded=JSON.parse(JSON.stringify(saved));eq(bodyView(reloaded).rounds.length,2);eq(bodyView(reloaded).rounds[0].source.key.length,4);eq(bodyView(reloaded).current.source.key.length,5);
 }finally{bodyCatalog.pop();}
 const short=bodySource('snail');short.key=short.key.slice(0,2);ok(validBodySource(short),'two-entry saved key is readable');
 const repeated=structuredClone(fifth);repeated.key.push({...repeated.key[0],id:'different-id'});ok(!validBodySource(repeated),'duplicate leg and body leaf is rejected');
 const unsupported=structuredClone(fifth);unsupported.drawing.kind='unrendered';ok(!validBodySource(unsupported),'saved drawing still needs a supported renderer');
 eq(old.source.key.length,4,'catalog extension does not mutate the original visit');
}
{
 const s={unrelated:{kept:true}},before=structuredClone(s);eq(bodyView(s).status,'missing');eq(startBody(s,'unknown'),null);eq(s,before);eq(setBodyPage(s,'keep'),false);eq(s,before);
 const r=startBody(s,'snail');ok(validBodyRound(r));eq(s.unrelated,before.unrelated);eq(checkBody(s),null,'no implicit empty check');
 chooseBodyLegs(s,'0');eq(checkBody(s),null,'zero legs alone cannot separate the two pictured animals');chooseBodyFeature(s,'rings');const wrong=checkBody(s);eq(wrong.named.id,'worm');eq(wrong.features,{legs:true,body:false});ok(wrong.feedback.includes('coiled shell'));ok(bodyCheckMatches(r));
 setBodyView(s,'detail');addBodySupport(s,'audio');ok(bodyCheckMatches(r),'representation/support changes do not stale input');eq(wrong.support,[],'later support does not relabel old check');
 chooseBodyFeature(s,'shell');ok(!bodyCheckMatches(r));const fit=checkBody(s);eq(fit.features,{legs:true,body:true});eq(fit.support,['audio']);
 chooseBodyLegs(s,'14');eq(r.feature,null,'changing first branch clears dependent clue only');eq(r.checks,[wrong,fit]);eq(chooseBodyFeature(s,'shell'),false);chooseBodyFeature(s,'unsure');const uncertain=checkBody(s);eq(uncertain.features,{legs:false,body:null});eq(uncertain.named,null);eq(uncertain.stop,'unclear');
 for(const p of ['inspect','key','keep'])ok(setBodyPage(s,p));eq(setBodyPage(s,'unknown'),false);eq(setBodyView(s,'sideways'),false);eq(addBodySupport(s,'grade'),false);addBodySupport(s,'audio');eq(r.support,['audio']);
 const copy=bodySource('snail');copy.inspection='Changed separate copy.';eq(r.source.inspection,bodySource('snail').inspection,'visits never alias catalog/source clones');
 const second=startBody(s,'snail');eq(second.familiar,true);eq(second.support,[]);eq(second.checks,[]);eq(second.legs,null);ok(resumeBody(s,r.id));eq(bodyView(s).current,r);eq(resumeBody(s,500),false);
}
{
 const s={},r=startBody(s,'ladybird');chooseBodyLegs(s,'6');chooseBodyFeature(s,'cases');const c=checkBody(s);c.named={id:'old-name',label:'Earlier exact label'};c.features={legs:false,body:null};c.stop='outside';c.feedback='Earlier exact recorded feedback';delete c.support;c.source.inspection='Earlier exact wording';c.source.key[2].label='Earlier key label';
 ok(validBodyRound(r),'contradictory old outcomes and older wording are not regraded');ok(validBodyCheck(c));const old=structuredClone(c);ok(!bodyCheckMatches(r),'own frozen earlier source differs');checkBody(s);eq(r.checks[0],old,'explicit new check leaves historical result intact');eq(r.checks.at(-1).named.label,'Ladybird beetle');
 for(let i=0;i<9;i++)checkBody(s);eq(r.checks.length,8,'only explicit checks trim the eight-result list');
}
for(const raw of [null,'<script>earlier</script>',{version:99,earlier:'kept'},{version:1,page:'bad',current:1,nextId:2,seen:[],rounds:[]}]){
 const s={bodyClues:structuredClone(raw)},before=structuredClone(s);eq(bodyView(s).status,'unavailable');eq(startBody(s,'worm'),null);eq(checkBody(s),null);eq(setBodyPage(s,'key'),false);eq(s,before,'unreadable whole root stays exact');
}
{
 const s={},r=startBody(s,'woodlouse');const raw={id:50,version:99,exact:'earlier unknown work'},bad=structuredClone(r);bad.id=51;bad.source.drawing.version=2;s.bodyClues.rounds.push(raw,bad);s.bodyClues.current=51;
 eq(bodyView(s).current,r,'readable sibling fallback');eq(bodyView(s).earlier,[raw,bad]);const before=structuredClone([raw,bad]);startBody(s,'worm');eq([raw,bad],before);eq(s.bodyClues.current,52,'allocation observes even unreadable numeric IDs');ok(s.bodyClues.rounds.includes(raw)&&s.bodyClues.rounds.includes(bad));
 const duplicate=structuredClone(r);s.bodyClues.rounds.push(duplicate);ok(bodyView(s).earlier.includes(duplicate),'duplicate IDs are retained read-only');
}
{
 const s={},r=startBody(s,'snail');s.bodyClues.rounds=Array.from({length:15},(_,i)=>({...structuredClone(r),id:i+1}));s.bodyClues.current=15;s.bodyClues.nextId=16;const raw={id:'opaque',kept:true};s.bodyClues.rounds.splice(2,0,raw);const before=structuredClone(s);eq(bodyView(s).rounds.length,15);eq(s,before,'views never trim an oversized import');startBody(s,'woodlouse');eq(bodyView(s).rounds.map(r=>r.id),Array.from({length:12},(_,i)=>i+5));ok(s.bodyClues.rounds.includes(raw));
}
for(const unsafe of [Number.MAX_SAFE_INTEGER,Infinity,Number.MAX_VALUE]){
 const s={};startBody(s,'snail');s.bodyClues.rounds.push({id:unsafe,version:99});const before=structuredClone(s);eq(startBody(s,'worm'),null);eq(s,before,'failed allocation does not trim or mutate raw work');
}
{
 const s={},r=startBody(s,'worm');r.extra={retained:'unknown'};s.bodyClues.extra='also retained';for(let i=0;i<3;i++){setBodyPage(s,'key');setBodyView(s,'detail');chooseBodyLegs(s,'0');chooseBodyFeature(s,'rings');checkBody(s);}eq(r.extra,{retained:'unknown'});eq(s.bodyClues.extra,'also retained');
 const old=structuredClone(s);eq(chooseBodyLegs(s,'42'),false);eq(chooseBodyFeature(s,'unknown'),false);eq(s,old,'rejected draft operations do not mutate');
}
console.log(`Body clues core: ${n} assertions passed.`);
