import assert from 'node:assert/strict';
import {MESSAGE_CASES,messageCase,messageCard,messageClue,messageCardOutcome} from '../dist/message-content.mjs';
import {ensureMessages,messageState,currentMessage,chooseMessageCase,setMessagePage,setMessageClue,setMessageCard,setMessageText,testMessageCard,setMessageReading,useMessageSupport,setMessagePlayback,carryMessage,recoverMessages} from '../dist/message-core.mjs';
let checks=0;
const check=(condition,message)=>{assert.ok(condition,message);checks++;};
const equal=(actual,expected,message)=>{assert.deepEqual(actual,expected,message);checks++;};
const copy=x=>structuredClone(x);
const fresh=(place='post',id='basket')=>{const s={};check(chooseMessageCase(s,place,id),'choose case');return s;};
check(MESSAGE_CASES.length===3&&new Set(MESSAGE_CASES.map(c=>c.id)).size===3,'three freely open cases');
check(messageCase('missing')===null,'unknown case absent');
for(const c of MESSAGE_CASES){
 check(['cafe','garden','bridge'].includes(c.scenePlace),'valid scene place');
 check(c.sceneParts.length===3&&c.sceneParts.every(p=>p.label&&p.prop),'distinct labelled visual parts');
 const original=messageCard(c,'original');equal(original.text,c.original,'original card literal exact note');equal(original.reply,c.question,'original pauses for clarification');check(!original.fits&&original.visual==='ask','original never guesses a meaning');
 check(c.cards.filter(card=>card.fits).length===2,'two useful descriptions, not one magic wording');
 check(c.clues.filter(clue=>clue.relevant).length===1,'one narrowly relevant request clue');
 check(messageCard(c,'missing')===null&&messageClue(c,'missing')===null,'unknown options absent');
 for(const place of ['post','loft'])for(const card of c.cards)for(const clue of c.clues){
  const s=fresh(place,c.id),x=currentMessage(s,place);check(x.work.cardId==='original','fresh draft starts at ambiguous note');
  setMessageCard(s,place,card.id);setMessageClue(s,place,clue.id);const result=testMessageCard(s,place);
  equal(result,{card,clue,fits:card.fits,clueRelevant:clue.relevant},'card serves request and clue relevance are separate');
  equal(messageCardOutcome(c,x.work.feedback.cardId),card,'stored feedback computes finite content');
  equal(x.work.attempts[0],{cardId:card.id,clueId:clue.id,reading:'unknown',support:{help:false,audio:false,example:false},context:{familiar:false,priorSupport:{help:false,audio:false,example:false},priorReading:[]}},'explicit selection with neutral evidence');
  check(messageState(s)===s.messages,'all card/clue states validate');
 }
}
{
 const s=fresh(),w=currentMessage(s,'post').work;
 for(const page of ['inspect','revise','play','human','story']){check(setMessagePage(s,'post',page),'page accepted');equal(currentMessage(copy(s),'post').work.page,page,'page survives reload');}
 const exact='  A message with <script>fictional</script> & "quotes"\nOne more line. 🐇  ';
 for(const field of ['original','reason','reply']){setMessageText(s,'post',field,exact);equal(w[field],exact,'author words preserved exactly');}
 setMessageReading(s,'post','self');useMessageSupport(s,'post','help');useMessageSupport(s,'post','audio');setMessageReading(s,'post','together');setMessageReading(s,'post','unknown');setMessageReading(s,'post','self');
 setMessageCard(s,'post','blankets');setMessageClue(s,'post','blankets');testMessageCard(s,'post');
 const attempt=copy(w.attempts[0]);check(attempt.support.audio&&attempt.support.help&&attempt.reading==='self','self report does not erase narration/help');equal(attempt.context.priorReading,['self','together'],'earlier reading reports retained');check(!('independent' in attempt)&&!('correct' in attempt),'no broad independent or correctness claim');
 useMessageSupport(s,'post','example');setMessageReading(s,'post','together');setMessagePlayback(s,'post',1);equal(w.attempts[0],attempt,'attempt snapshot does not alias support/context');
 const count=w.attempts.length;for(let i=0;i<5;i++){setMessagePlayback(s,'post',0);setMessagePlayback(s,'post',1);}equal(w.attempts.length,count,'playback makes no attempt');
 for(const field of ['original','reason','reply']){testMessageCard(s,'post');check(w.feedback,'test shows feedback');setMessageText(s,'post',field,exact+'!');equal(w.feedback,null,'authored edits invalidate stale feedback');}
 testMessageCard(s,'post');setMessageCard(s,'post','seeds');equal(w.feedback,null,'card edit invalidates feedback');testMessageCard(s,'post');setMessageClue(s,'post','two');equal(w.feedback,null,'clue edit invalidates feedback');
 for(let i=0;i<30;i++){setMessageCard(s,'post',i%2?'blankets':'seeds');testMessageCard(s,'post');}equal(w.attempts.length,24,'only newest24 explicit tests');check(messageState(s),'bounded edited state validates');
 const before=copy(s);for(const field of ['original','reason','reply'])check(!setMessageText(s,'post',field,'x'.repeat(field==='original'?601:401)),'oversize refused rather than silently truncating');equal(s,before,'oversize cannot discard words');
 for(const field of ['original','reason','reply']){const text='x'.repeat(field==='original'?600:400);check(setMessageText(s,'post',field,text),'exact bound accepted');equal(w[field],text,'maximum exact string preserved');}
}
{
 const s=fresh(),source=currentMessage(s,'post').work;
 setMessageText(s,'post','original','Please bring the blankets.');setMessageText(s,'post','reason','For our supper.');setMessageText(s,'post','reply','I can help.');setMessageCard(s,'post','blankets');setMessageClue(s,'post','blankets');setMessagePage(s,'post','play');setMessagePlayback(s,'post',1);setMessageReading(s,'post','self');useMessageSupport(s,'post','audio');testMessageCard(s,'post');const before=copy(source);
 equal(carryMessage(s,'post'),{target:'loft',reopened:false},'first crossing');equal(source,before,'crossing never edits source');const dest=currentMessage(s,'loft').work;
 equal([dest.original,dest.reason,dest.reply,dest.cardId,dest.clueId,dest.playback,dest.reading,dest.page],['Please bring the blankets.','For our supper.','I can help.','blankets','blankets',0,'self','story'],'exact content copied into reader rehearsal');equal(dest.attempts,[],'carried selection is not a new attempt');equal(dest.feedback,null,'feedback requires explicit test');check(dest.context.familiar&&dest.context.priorSupport.audio,'carried message familiar with prior support');equal(dest.provenance,{source:'post',reading:'self',support:{help:false,audio:true,example:false}},'first crossing provenance');
 setMessageText(s,'loft','original','A different fictional note.');useMessageSupport(s,'loft','help');setMessageReading(s,'loft','together');setMessagePage(s,'loft','human');testMessageCard(s,'loft');equal(source,before,'destination changes do not alias source');
 const kept=copy(dest);equal(carryMessage(s,'post'),{target:'loft',reopened:true},'later crossing reopens destination');equal(dest,kept,'existing destination draft not overwritten');
 equal(carryMessage(s,'loft'),{target:'post',reopened:true},'reverse crossing reopens original source');equal(source,before,'reverse crossing does not overwrite source');
 testMessageCard(s,'post');const last=source.attempts.at(-1);check(last.context.familiar&&last.context.priorSupport.help&&last.context.priorSupport.audio&&last.context.priorReading.includes('together'),'later source test conservatively includes destination support and reading');
 chooseMessageCase(s,'post','flags');setMessageText(s,'post','reason','Flags for neighbours.');chooseMessageCase(s,'post','basket');equal(source.original,'Please bring the blankets.','case switching keeps source');equal(currentMessage(copy(s),'loft').work,kept,'all destination work reloads exactly');
}
{
 const s=fresh('loft','flags');setMessageText(s,'loft','original','Hang them on the line.');useMessageSupport(s,'loft','example');setMessageReading(s,'loft','together');equal(carryMessage(s,'loft'),{target:'post',reopened:false},'direct Loft draft can cross to Post');const w=currentMessage(s,'post').work;check(w.page==='revise'&&w.context.familiar&&w.support.example&&w.context.priorReading.includes('together'),'reverse first crossing preserves context');
 const other=fresh();chooseMessageCase(other,'loft','basket');useMessageSupport(other,'post','help');setMessageReading(other,'post','together');testMessageCard(other,'loft');const a=currentMessage(other,'loft').work.attempts[0];check(a.context.familiar&&a.context.priorSupport.help&&a.context.priorReading.includes('together'),'separately started destination retains observed context');
}
{
 const unrelated={postOffice:{pending:{parcel:'fictional',route:[1,2]}},loft:{draft:{dialogue:'Fictional puppet speech.'},shelf:[{id:4}]},other:{nested:[1,2,3]}};const s=copy(unrelated);ensureMessages(s);chooseMessageCase(s,'post','basket');setMessageCard(s,'post','blankets');testMessageCard(s,'post');carryMessage(s,'post');setMessageText(s,'loft','reply','Yes!');for(const [k,v]of Object.entries(unrelated))equal(s[k],v,'ordinary delivery/show/shelf and unrelated state unchanged');
 const frozen=copy(s);Object.freeze(frozen);const before=JSON.stringify(frozen);messageState(frozen);currentMessage(frozen,'post');equal(JSON.stringify(frozen),before,'read-only access never normalizes state');
 const empty={};equal(messageState(empty),null,'missing root unavailable until initialization');equal(empty,{},'missing root read does not mutate');check(ensureMessages(empty)&&messageState(empty),'explicit initialization');
}
{
 const malformed=[null,[],17,'future data',{version:2,selected:{post:'basket'},cases:{}},{version:1,selected:{post:null,loft:null},cases:{unknown:{}}}];
 const good=fresh();const mutations=[r=>{r.extra=true;},r=>{r.selected.post='flags';},r=>{r.cases.basket.post.page='secret';},r=>{r.cases.basket.post.original='x'.repeat(601);},r=>{r.cases.basket.post.support.audio='yes';},r=>{r.cases.basket.post.feedback={cardId:'missing',clueId:null};},r=>{r.cases.basket.post.attempts=[{cardId:'blankets',clueId:null,reading:'self',support:{help:false,audio:false,example:false},context:{familiar:false,priorSupport:{help:false,audio:false,example:false},priorReading:[]},independent:true}];},r=>{r.cases.basket.post.context.priorReading=['self','self'];},r=>{r.cases.basket.post.provenance={source:'outside',reading:'unknown',support:{help:false,audio:false,example:false}};}];for(const mutate of mutations){const r=copy(good.messages);mutate(r);malformed.push(r);}
 for(const root of malformed){const s={messages:copy(root),other:{keep:'exact'}},before=copy(s);equal(messageState(s),null,'malformed/future refused');equal(currentMessage(s,'post'),null,'unsupported not rendered as active');equal(ensureMessages(s),null,'initialization retains unsupported root');check(!chooseMessageCase(s,'post','basket')&&!setMessageText(s,'post','original','replacement')&&!carryMessage(s,'post'),'ordinary actions cannot replace unsupported root');equal(s,before,'unsupported remains byte-equivalent after read/actions');check(recoverMessages(s),'explicit fresh start');equal(s.messages.recovered,root,'exact unsupported payload retained');check(messageState(s),'recovered fresh state validates');equal(s.other,before.other,'recovery leaves unrelated state');check(!recoverMessages(s),'valid recovery does not overwrite retained payload');}
}
{
 const s=fresh(),before=copy(s);check(!chooseMessageCase(s,'elsewhere','basket')&&!chooseMessageCase(s,'post','missing'),'invalid case/place refused');check(!setMessagePage(s,'post','missing')&&!setMessageClue(s,'post','missing')&&!setMessageCard(s,'post','missing')&&!setMessageText(s,'post','unknown','x')&&!setMessageText(s,'post','original',5)&&!setMessageReading(s,'post','independent')&&!useMessageSupport(s,'post','magic')&&!setMessagePlayback(s,'post',2),'invalid action values refused');equal(s,before,'invalid actions unchanged');setMessageCard(s,'post',null);equal(testMessageCard(s,'post'),false,'no supplied sentence means no test');equal(currentMessage(s,'post').work.attempts.length,0,'authored text never automatic attempt');setMessageCard(s,'post','blankets');setMessageClue(s,'post',null);equal(testMessageCard(s,'post').clueRelevant,null,'missing clue stays unobserved');
}
console.log(`Message-reader checks: ${checks} passed.`);
