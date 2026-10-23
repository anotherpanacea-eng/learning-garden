import {joiningCases,joiningView} from './joining-orders-core.mjs';
import {freshLedger,ledgerResultExample,moveLedger,recordLedgerDisplay,startLedgerCase} from './joining-ledger-core.mjs';
import {hearButton} from './play-media.mjs';

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let session=null,owner=null,caseId=null;
export function resetJoiningLedger(){session=null;owner=null;caseId=null;}
function currentSession(explorerId,source){
 if(!session||owner!==explorerId||caseId!==source.id){session=freshLedger();owner=explorerId;caseId=source.id;}
 return session;
}
const button=(label,action,disabled=false,primary=false)=>'<button type="button" class="'+(primary?'primary':'secondary')+'" data-ledger-action="'+action+'"'+(disabled?' disabled':'')+'>'+label+'</button>';
const marks=(origin,n)=>Array.from({length:n},()=>'<span class="ledger-mark ledger-'+origin+'" aria-hidden="true"></span>').join('');
const packet=(pip,dot)=>'<span class="ledger-packet" role="img" aria-label="Ten counter bundle: '+pip+' Pip and '+dot+' Dot">'+marks('pip',pip)+marks('dot',dot)+'</span>';
const group=(heading,contents,kind='')=>'<section class="ledger-group '+kind+'"><h3>'+heading+'</h3><div class="ledger-marks">'+contents+'</div></section>';
function picture(source,s){
 const dotOnes=source.dot%10,originals=packet(10,0)+packet(10,0)+packet(0,10),wrapped=s.stage==='wrapped';
 if(s.stage==='separate')return group('Pip: 2 tens and 4 ones',packet(10,0)+packet(10,0)+marks('pip',4),'pip')+group('Dot: 1 ten and '+dotOnes+' ones',packet(0,10)+marks('dot',dotOnes),'dot');
 return group('Original tens: 2 Pip, 1 Dot',originals)+(wrapped?group('One new ten: 4 Pip, 6 Dot',packet(4,6))+group('Loose: 1 Dot one',marks('dot',1)):group('Ones working tray: '+(4+dotOnes),marks('pip',4)+marks('dot',dotOnes)));
}
function pictureDescription(source,s){
 const dotOnes=source.dot%10;
 const grouping=s.stage==='separate'?'separate: Pip has two tens and four ones; Dot has one ten and '+dotOnes+' ones':s.stage==='wrapped'?'joined: three original tens, one new ten from four Pip and six Dot ones, and one loose Dot one':'joined: three original tens and '+(4+dotOnes)+' loose ones';
 return 'Supplied rows: Pip two tens and four ones; Dot one ten and '+dotOnes+' ones. '+grouping+(s.stage==='wrapped'?'. One new ten exists':'. No new ten exists')+'. Written result: tens '+(s.tensPlaced?(source.id==='steady-orders'?'3':'4'):'blank')+', ones '+(s.onesPlaced?(source.id==='steady-orders'?'7':'1'):'blank')+'.';
}
function caption(source,s){
 const exchange=source.id==='full-frame-orders',stage=s.tensPlaced?'finished':s.onesPlaced?'ones':s.stage;
 const copy=exchange?{
  separate:'Pip has two tens and four ones. Dot has one ten and seven ones. Their written numbers line up in tens and ones places.',
  joined:'Four ones and seven ones make eleven ones. Ten of them can become one new ten.',
  wrapped:'Ten of the same eleven ones are now one new ten. One Dot one stays loose. No counter was added or lost.',
  ones:'The one loose Dot counter puts 1 under ones. The new bundle waits with the tens.',
  finished:'Two Pip tens, one Dot ten and the new ten make four tens. The same counters read 24 + 17 = 41.'
 }:{
  separate:'Pip has two tens and four ones. Dot has one ten and three ones. Their written numbers line up in tens and ones places.',
  joined:'Four ones and three ones make seven ones. Seven ones cannot make a new ten.',
  ones:'The seven ones in the picture put 7 under ones. The original tens are still waiting.',
  finished:'Two Pip tens and one Dot ten make three tens. The same counters read 24 + 13 = 37.'
 };
 return copy[stage];
}
function pictureControls(source,s){
 if(s.stage==='separate')return button('Join the ones','join',false,true);
 return button('Separate the ones again','separate',s.stage!=='joined'||s.onesPlaced||s.tensPlaced)
  +(source.id==='full-frame-orders'
   ?button('Wrap ten of these ones','wrap',s.stage!=='joined'||s.onesPlaced||s.tensPlaced,true)+button('Unwrap the new ten','unwrap',s.stage!=='wrapped'||s.onesPlaced||s.tensPlaced)
   :'<p class="ledger-hint">Seven ones cannot fill a ten.</p>');
}
function writingControls(source,s){
 const ready=s.stage===(source.id==='full-frame-orders'?'wrapped':'joined');
 return button('Place the ones digit from this picture','place-ones',!ready||s.onesPlaced,true)
  +button('Lift the ones digit','lift-ones',!s.onesPlaced||s.tensPlaced)
  +button('Place the tens digit from this picture','place-tens',!s.onesPlaced||s.tensPlaced,true)
  +button('Lift the tens digit','lift-tens',!s.tensPlaced);
}
function writing(source,s){
 const exchange=source.id==='full-frame-orders',ones=source.dot%10,one=exchange?1:7,ten=exchange?4:3;
 const result='<tr class="ledger-result"><th scope="row">=</th><td>'+(s.tensPlaced?ten:'<span class="ledger-empty">□</span>')+'</td><td>'+(s.onesPlaced?one:'<span class="ledger-empty">□</span>')+'</td></tr>';
 const line=s.tensPlaced?'Supplied writing: '+source.pip+' + '+source.dot+' = '+source.total+'.':s.onesPlaced?(exchange?'Ones line: 4 + 7 = 11; 10 become 1 ten, leaving 1 one.':'Ones line: 4 + 3 = 7 ones.'):s.stage==='separate'?'The source rows are aligned. Join the ones to begin.':'Ones to consider: 4 + '+ones+' = '+(4+ones)+'. The result places are still blank.';
 const pictureText=picture(source,s),spoken=caption(source,s)+' '+line;
 return '<section class="ledger-pane" data-ledger-pane><h2 id="ledger-write-title" tabindex="-1">Put this picture into places</h2><p class="ledger-small">The compact picture shows these same counters, not more counters. Each column names a place, not a separate supply of counters.</p>'
  +'<div class="ledger-writing-layout"><div><div class="ledger-compact" role="img" aria-label="'+esc(pictureDescription(source,s))+'">'+pictureText+'</div><p class="ledger-caption">'+esc(caption(source,s))+'</p></div>'
  +'<div>'+(exchange&&s.stage==='wrapped'?'<p class="ledger-carry">+1 ten from ones: the same wrapped bundle joins the tens.</p>':'')
  +'<table class="ledger-table"><caption>Aligned tens and ones</caption><thead><tr><th scope="col">Order</th><th scope="col">Tens</th><th scope="col">Ones</th></tr></thead><tbody><tr><th scope="row">Pip</th><td>2</td><td>4</td></tr><tr><th scope="row">+ Dot</th><td>1</td><td>'+ones+'</td></tr>'+result+'</tbody></table>'
  +'<p class="ledger-caption">'+esc(line)+'</p><div class="ledger-controls">'+writingControls(source,s)+hearButton(spoken,'Hear this step')+'</div></div></div>'
  +'<details><summary>Talk about what changed</summary><p>'+(exchange?'What did the new ten change in the picture and in the written tens place? What stayed the same?':'Why did the ones stay as seven? What did joining change without making a new ten?')+'</p></details></section>';
}
function pictured(source,s){
 return '<section class="ledger-pane" data-ledger-pane><h2 id="ledger-picture-title" tabindex="-1">Picture the same counters</h2><p class="ledger-small">This is a fresh writing picture of the same orders. Your joining table stays as you left it. This writing picture starts again when you leave.</p>'
  +'<div class="ledger-full" role="img" aria-label="'+esc(pictureDescription(source,s))+'">'+picture(source,s)+'</div>'
  +'<p class="ledger-caption">'+esc(caption(source,s))+'</p><div class="ledger-controls">'+pictureControls(source,s)+hearButton(caption(source,s),'Hear this step')+'</div></section>';
}
function notice(){return '<p id="ledger-notice" role="status" tabindex="-1"></p>';}
export function ledgerRefusalPage(){
 return '<section class="joining-ledger" data-ledger-root><h1>Write the Same Sum</h1><p id="ledger-notice" role="status" tabindex="-1">This notebook is too large or complex to show another complete writing picture safely. Your original work is unchanged. Download notes first, or use a separate explorer.</p><a href="#notes">Grown-up notes</a> <a href="#numbers/join">Joining Supply Orders</a></section>';
}
export function joiningLedgerPage(state,explorerId){
 const v=joiningView(state);
 const head='<section class="joining-ledger" data-ledger-root><header><a href="#numbers/join" class="ledger-back">Return to the joining table</a><p class="ledger-eyebrow">Bundle Burrow · optional writing picture</p><h1>Write the same sum</h1></header>';
 if(v.unsupported)return head+'<p id="ledger-notice" role="status" tabindex="-1">This saved order uses an unfamiliar format. The original remains in your notes. Open Joining Supply Orders to keep it and start fresh if you choose.</p><a href="#numbers/join">Open the saved order</a> <a href="#notes">Grown-up notes</a></section>';
 if(v.absent)return head+'<section class="ledger-pane"><h2>Choose a pair of orders</h2><p>Either pair can be opened.</p><div class="ledger-case-list">'+joiningCases.map(c=>'<section><h3>'+c.pip+' + '+c.dot+'</h3><button type="button" data-ledger-start="'+c.id+'">Start this order</button></section>').join('')+'</div>'+notice()+'</section></section>';
 const s=currentSession(explorerId,v.source),turn=s.turn,source=v.source;
 return head+'<p>Pip\'s and Dot\'s seed counters stay the same while their grouping and written places change.</p><p class="ledger-source-line">Pip: '+source.pip+' counters. Dot: '+source.dot+' counters.</p>'
  +'<details><summary>Read the original order request</summary><p>'+esc(source.title)+'</p><p>'+esc(source.request)+'</p></details>'
  +'<div class="ledger-turns" role="group" aria-label="Writing picture turn"><button type="button" data-ledger-turn="picture" aria-current="'+(turn==='picture'?'page':'false')+'">Picture</button><button type="button" data-ledger-turn="write" aria-current="'+(turn==='write'?'page':'false')+'">Write</button></div>'
  +(turn==='picture'?pictured(source,s):writing(source,s))+notice()+'</section>';
}
export function bindJoiningLedger(state,{explorerId,isActive,canExport,save,render,focus}={}){
 const scope=document.querySelector('[data-ledger-root]');if(!scope)return;
 const v=joiningView(state),sourceId=v.source?.id,still=()=>scope.isConnected&&isActive?.()&&joiningView(state).source?.id===sourceId;
 const refuse=()=>{const status=scope.querySelector('#ledger-notice');if(!status)return;status.innerHTML='This notebook is too large or complex to record another complete picture safely. Your work is unchanged. <a href="#notes">Download notes</a> first, or use a separate explorer.';focus?.('#ledger-notice');};
 scope.querySelectorAll('[data-ledger-start]').forEach(b=>b.onclick=()=>{
  if(!scope.isConnected||!isActive?.())return;
  const outcome=startLedgerCase(state,b.dataset.ledgerStart,canExport);
  if(!outcome.ok){refuse();return;}
  resetJoiningLedger();save?.();render?.();focus?.('#ledger-picture-title');
 });
 scope.querySelectorAll('[data-ledger-turn]').forEach(b=>b.onclick=()=>{
  if(!still())return;
  const next=b.dataset.ledgerTurn;
  if(!['picture','write'].includes(next))return;
  currentSession(explorerId,v.source).turn=next;
  render?.();focus?.(next==='picture'?'#ledger-picture-title':'#ledger-write-title');
 });
 const inverse={join:'separate',separate:'join',wrap:'unwrap',unwrap:'wrap','place-ones':'lift-ones','lift-ones':'place-ones','place-tens':'lift-tens','lift-tens':'place-tens'};
 scope.querySelectorAll('[data-ledger-action]').forEach(b=>b.onclick=()=>{
  if(!still())return;
  const current=currentSession(explorerId,v.source),next=moveLedger(current,v.source,b.dataset.ledgerAction);
  if(!next){const status=scope.querySelector('#ledger-notice');if(status)status.textContent=({separate:'Lift both written digits and unwrap the new ten before separating the ones.',wrap:'Join eleven ones with both written cells blank before wrapping ten.',unwrap:'Lift both written digits before unwrapping the new ten.','place-ones':'Join the ones first; eleven ones need wrapping before one digit can be placed.','lift-ones':'Lift the tens digit before lifting the ones digit.','place-tens':'Place the ones digit before placing the tens digit.'})[b.dataset.ledgerAction]||'This step is already shown. Use its reverse to go back.';return;}
  if(b.dataset.ledgerAction==='place-tens'){
   const outcome=recordLedgerDisplay(state,[ledgerResultExample(v.source)],canExport);
   if(!outcome.ok){refuse();return;}
   if(outcome.changed)save?.();
  }
  session=next;render?.();
  const back=inverse[b.dataset.ledgerAction],selector='[data-ledger-action="'+back+'"]:not(:disabled)';
  focus?.(document.querySelector(selector)?selector:(next.turn==='picture'?'#ledger-picture-title':'#ledger-write-title'));
 });
}
