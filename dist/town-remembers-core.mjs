import {batchState} from './whole-batches-core.mjs';
import {sharingState} from './sharing-counter-core.mjs';
import {recipeState} from './measuring-recipes-core.mjs';
import {localDay,validDay} from './town-day.mjs';

const KINDS=['trays','shares','jugs'];
const FORMS={trays:['trays-reverse','trays-shortcut'],shares:['share-compare','share-buns'],jugs:['jug-coarser','jug-more']};
const clone=x=>JSON.parse(JSON.stringify(x));
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const int=(x,min,max)=>Number.isSafeInteger(x)&&x>=min&&x<=max;
const str=(x,max=1000)=>typeof x==='string'&&x.length<=max;
const counts=[2,3,4,6],amounts=[50,100,150,200,250,300,350,400,450];
const rotate=(items,index)=>items.map((_,i)=>items[(i+index%items.length)%items.length]);
const title=s=>str(s?.title,200)?s.title:'Earlier work';
const byDay=(a,b)=>(a.keptDay||'').localeCompare(b.keptDay||'')||a.caseId.localeCompare(b.caseId);
export const artifactKey=a=>JSON.stringify([a.kind,a.caseId,a.values]);
export function sourceArtifacts(state,today=localDay()){
 const out=[];
 const roots=[['trays',batchState(state)],['shares',sharingState(state)],['jugs',recipeState(state)]];
 for(const [kind,root] of roots)for(const [caseId,work] of Object.entries(root?.cases||{})){
  const kept=work?.kept,source=kept?.source,day=kept?.keptDay;
  if(!obj(kept)||!obj(source)||!str(caseId,100)||!str(source.title,200)||day!==undefined&&(!validDay(day)||day>=today))continue;
  let values,forms=[];
  if(kind==='trays'){
   const p=kept.input?.model?.portions,b=source.base;
   if(source.modelId!=='whole-batches-v1'||source.revision!==1||source.unit!=='mL'||source.baseGuests!==2||b?.['cloud-water']!==100||b?.['star-water']!==150)continue;
   const cloud=p?.['cloud-water'],star=p?.['star-water'],c=cloud/100;
   if(!int(c,1,3)||star!==150*c)continue;
   values={cloud,star,c};forms=['trays-reverse',...(c<=2?['trays-shortcut']:[])];
  }else if(kind==='shares'){
   const whole=source.whole,model=kept.model,cuts=model?.cuts,selected=model?.selected;
   if(source.kind!=='loaf'||!str(whole?.id,100)||!int(whole?.width,1,100)||!Array.isArray(cuts)||!Array.isArray(selected)||!cuts.every(x=>int(x,1,whole.width-1))||!selected.every(x=>int(x,0,cuts.length))||new Set(selected).size!==selected.length)continue;
   const n=cuts.length+1;if(!counts.includes(n))continue;
   const widths=[0,...cuts,whole.width].slice(1).map((x,i)=>x-[0,...cuts][i]);
   if(!widths.every(x=>x===whole.width/n))continue;
   values={wholeId:whole.id,width:whole.width,cuts:clone(cuts),selected:clone(selected),n};
   forms=['share-compare',...(selected.length===1?['share-buns']:[])];
  }else{
   const a=source.apparatus,p=kept.model?.portions;
   if(a?.unit!=='mL'||a.jarCapacity!==500||a.jugCapacity!==500||a.transfer!==50)continue;
   const cloud=p?.['cloud-water'],star=p?.['star-water'];
   if(!int(cloud,0,500)||!int(star,0,500))continue;
   const ingredient=amounts.includes(cloud)?'cloud-water':amounts.includes(star)?'star-water':null;
   if(!ingredient)continue;
   values={cloud,star,ingredient,a:p[ingredient]};forms=['jug-coarser','jug-more'];
  }
  out.push({kind,caseId,title:title(source),keptDay:day??null,values,forms,key:artifactKey({kind,caseId,values:kind==='shares'?[values.wholeId,values.width,values.cuts,values.selected]:[values.cloud,values.star]})});
 }
 return out;
}
const blank=()=>({version:1,rotation:null,used:[],errands:[]});
const rootValid=r=>obj(r)&&r.version===1&&(r.rotation===null||KINDS.includes(r.rotation))&&Array.isArray(r.used)&&r.used.length<=48&&r.used.every(x=>str(x,500))&&Array.isArray(r.errands)&&r.errands.length<=200;
export function townState(state){return !Object.hasOwn(state,'townRemembers')?blank():rootValid(state.townRemembers)?state.townRemembers:null;}
const known=f=>Object.values(FORMS).flat().includes(f);
export function errandValid(e){
 if(!obj(e)||!int(e.id,1,Number.MAX_SAFE_INTEGER)||!known(e.form)||!KINDS.includes(e.kind)||!FORMS[e.kind].includes(e.form)||!obj(e.artifact)||!str(e.artifact.caseId,100)||!str(e.artifact.title,200)||!(e.artifact.keptDay===null||validDay(e.artifact.keptDay))||!valuesValid(e.form,e.artifact.values)||!exampleValid(e.example)||!str(e.artifact.key,500)||!validDay(e.startedDay)||!str(e.question)||!str(e.picture)||!str(e.help)||!str(e.feedback)||!Array.isArray(e.choices)||e.choices.length!==3||!e.choices.every(c=>obj(c)&&(str(c.value,200)||int(c.value,0,1000))&&str(c.label,300))||new Set(e.choices.map(c=>c.value)).size!==3||!e.choices.some(c=>c.value===e.expected)||!(e.choice===null||e.choices.some(c=>c.value===e.choice))||!['open','kept','aside'].includes(e.status)||!obj(e.support)||!['example','together','narration'].every(k=>typeof e.support[k]==='boolean')||typeof e.familiar!=='boolean'||!Array.isArray(e.checks)||e.checks.length>8||!e.checks.every(c=>obj(c)&&e.choices.some(o=>o.value===c.choice)&&c.fit===(c.choice===e.expected)&&str(c.feedback)))return false;
 return true;
}
function valuesValid(form,v){
 if(!obj(v))return false;
 if(form.startsWith('trays-'))return int(v.c,1,3)&&int(v.cloud,0,500)&&int(v.star,0,500);
 if(form.startsWith('share-'))return str(v.wholeId,100)&&int(v.width,1,100)&&counts.includes(v.n)&&Array.isArray(v.cuts)&&v.cuts.length===v.n-1&&v.cuts.every(x=>int(x,1,v.width-1))&&Array.isArray(v.selected)&&v.selected.length<=v.n&&v.selected.every(x=>int(x,0,v.n-1))&&(form!=='share-compare'||counts.includes(v.m))&&(form!=='share-buns'||v.selected.length===1);
 return int(v.cloud,0,500)&&int(v.star,0,500)&&['cloud-water','star-water'].includes(v.ingredient)&&amounts.includes(v.a)&&(form!=='jug-coarser'||int(v.lower,0,500)&&int(v.upper,0,500))&&(form!=='jug-more'||int(v.t,0,500));
}
function exampleValid(x){if(!obj(x)||!Object.entries(x).every(([k,v])=>k==='kind'||int(v,0,500)))return false;
 return x.kind==='trays'?int(x.cloud,0,500)&&int(x.star,0,500)&&int(x.guests,1,12):x.kind==='shortcut'?['cloud','star','proposedCloud','proposedStar'].every(k=>int(x[k],0,500)):x.kind==='shares'?int(x.width,1,100)&&counts.includes(x.n)&&counts.includes(x.m):x.kind==='buns'?counts.includes(x.n):x.kind==='jug'?int(x.amount,0,500):x.kind==='pour'&&['start','target','extra'].every(k=>int(x[k],0,500));}
function readable(r){const ids=new Set();return r.errands.filter(e=>{if(!errandValid(e)||ids.has(e.id))return false;ids.add(e.id);return true;});}
const openErrand=r=>r.errands.find(e=>obj(e)&&e.status==='open')||null;
export function nextTownCard(state,today=localDay()){
 const r=townState(state);if(!r)return null;
 const open=openErrand(r);if(open)return {type:readable(r).includes(open)?'open':'unavailable',errand:open};
 const unused=sourceArtifacts(state,today).filter(a=>!r.used.includes(a.key));
 const start=r.rotation===null?0:(KINDS.indexOf(r.rotation)+1)%3;
 for(let i=0;i<3;i++){
  const kind=KINDS[(start+i)%3],group=unused.filter(a=>a.kind===kind).sort(byDay);if(!group.length)continue;
  const artifact=group[0],last=readable(r).filter(e=>e.kind===kind).sort((a,b)=>a.id-b.id).at(-1)?.form;
  const preferred=FORMS[kind].find(f=>f!==last&&artifact.forms.includes(f))||artifact.forms[0];
  const finished=readable(r).filter(e=>e.status!=='open').sort((a,b)=>a.id-b.id);
  return {type:'offer',artifact,form:preferred,willTrim:readable(r).length>=12?finished[0]?.id??null:null};
 }
 return null;
}
const word=(n,w)=>`${n} ${w}${n===1?'':w.endsWith('ch')?'es':'s'}`;
const nextCount=n=>counts[(counts.indexOf(n)+1)%counts.length];
function formContent(a,form){
 const v=a.values,kind=a.kind;
 let choices,expected,question,picture,help,feedback,example;
 if(form==='trays-reverse'){
  const c=v.c,h=c===1?2:1;
  choices=[c,2*c,2*c+1].map(n=>({value:n,label:word(n,'guest')}));expected=2*c;
  picture=`Two separate kept jars: ${v.cloud} mL cloud-water and ${v.star} mL star-water. Reference card: 2 guests need 100 mL cloud-water and 150 mL star-water.`;
  question='Purl has these two jars. Each whole batch serves 2 guests. How many guests can these jars serve?';
  feedback=`These jars hold ${word(c,'whole batch')}. Each batch serves 2 guests, so they can serve ${word(2*c,'guest')}. ${c} counts batches, not guests; ${2*c+1} would need more ingredients.`;
  help=`In this separate example, ${word(h,'batch')} ${h===1?'uses':'use'} ${100*h} mL cloud-water and ${150*h} mL star-water in two labelled jars. Two guests per batch means ${word(2*h,'guest')}.`;
  example={kind:'trays',cloud:100*h,star:150*h,guests:2*h};
 }else if(form==='trays-shortcut'){
  const c=v.c,h=c===1?2:1;
  choices=[{value:'accept',label:'Yes. Adding the same amount to both makes one more batch.'},{value:'overflow',label:'No. The jars would overflow.'},{value:'needs-star',label:'No. One more batch needs 100 mL cloud-water and 150 mL star-water.'}];expected='needs-star';
  picture=`Kept jars: ${v.cloud} mL cloud-water and ${v.star} mL star-water. Wisp proposes separate jars with ${v.cloud+100} mL cloud-water and ${v.star+100} mL star-water. Each jar holds at most 500 mL. One batch: 100 mL cloud-water and 150 mL star-water.`;
  question='Wisp adds 100 mL to each jar. Is that one more whole batch?';
  feedback=`One more batch adds 100 mL cloud-water and 150 mL star-water. Wisp's star-water is 50 mL short. The proposed jars hold ${v.cloud+100} mL and ${v.star+100} mL, both below their 500 mL capacity.`;
  help=`A different tray: ${h} complete ${h===1?'batch has':'batches have'} ${h*100} mL cloud-water and ${h*150} mL star-water. Adding 100 mL to both gives ${h*100+100} mL and ${h*150+100} mL. Star-water is still 50 mL short of one more batch.`;
  example={kind:'shortcut',cloud:h*100,star:h*150,proposedCloud:h*100+100,proposedStar:h*150+100};
 }else if(form==='share-compare'){
  const n=v.n,m=v.m,relation=m<n?'Bigger':'Smaller',hn=n===2?3:2,hm=nextCount(hn);
  choices=['Smaller','Bigger','We cannot compare these pieces.'].map(x=>({value:x,label:x}));expected=relation;
  picture=`Kept ${v.wholeId} loaf, width ${v.width}: ${n} equal pieces, cuts at ${v.cuts.join(', ')}. Clover's outline is the same whole and width, cut into ${m} equal pieces. One piece is marked in each outline for comparison; these marks do not change the kept selection.`;
  question=`Clover cuts the same loaf into ${m} equal pieces. Is one of Clover's pieces bigger or smaller than one of yours?`;
  feedback=`Both pictures show the same whole loaf. Cutting into ${m} equal pieces makes each piece ${relation.toLowerCase()} than cutting into ${n}. We know the whole is the same, so we can compare.`;
  help=`In a separate example, the same loaf is cut into ${hn} equal pieces, then ${hm} equal pieces. One of ${hm} is ${hm<hn?'bigger':'smaller'} than one of ${hn}.`;
  example={kind:'shares',width:12,n:hn,m:hm};
 }else if(form==='share-buns'){
  const n=v.n,h=n===2?4:2;choices=[n,1,12/n].map(x=>({value:x,label:word(x,'bun')}));expected=12/n;
  picture=`Kept ${v.wholeId} loaf, width ${v.width}, in ${n} equal pieces; one saved piece selected: 1/${n} of this loaf. Beside it is a basket of 12 unselected buns.`;
  question=`Ember wants the same fraction of this 12-bun basket. How many buns are 1/${n} of 12?`;
  feedback=`Split 12 buns into ${n} equal groups. Each group has ${12/n} buns. One whole group is 1/${n} of the basket. One share does not always mean one bun.`;
  help=`In a separate 12-bun basket, split the buns into ${h} equal groups. One outlined group has ${12/h} buns, which is 1/${h} of that basket.`;
  example={kind:'buns',n:h};
 }else if(form==='jug-coarser'){
  const a=v.a,lower=v.lower,upper=v.upper,h=a===200?350:200;
  choices=[lower,a,upper].map(x=>({value:x,label:`${x} mL`}));expected=a;
  const position=a%100===0?`at the numbered ${a} mL mark`:`at the unnumbered mark halfway between ${lower} and ${upper} mL`;
  picture=`Remembered ${v.ingredient} jar, without an amount label. A separate straight-sided spare jug has the same amount. Its level is ${position}; the scale shows numbered 0, 100, 200, 300, 400, 500 mL marks and unnumbered midpoints.`;
  question="Wisp's spare jug holds the same amount. Read its scale. How many millilitres are inside?";
  feedback=a%100===0?`The liquid meets the numbered ${a} mL line; the neighbouring numbered marks are ${lower} mL and ${upper} mL.`:`Each numbered interval is 100 mL. The unnumbered midpoint is 50 mL past the lower numbered mark. The liquid reaches ${a} mL. The marks just below and above are ${lower} mL and ${upper} mL.`;
  help=`In a separate jug, ${h} mL reaches ${h%100===0?`the numbered ${h} mL mark`:`the halfway tick between ${h-50} and ${h+50} mL`}. Its scale runs from 0 to 500 mL in 100 mL numbered steps.`;
  example={kind:'jug',amount:h};
 }else{
  const a=v.a,t=v.t,more=t-a,extra=more+50===t?more+100:more+50,h=more===50?{start:200,end:300}:{start:150,end:200};
  choices=[more,t,extra].map(x=>({value:x,label:`${x} mL`}));expected=more;
  picture=`Kept ${v.ingredient} amount: ${a} mL. Separate jug starts at ${a} mL with a dashed target line at ${t} mL. No pouring has happened.`;
  question=`Purl has ${a} mL and needs ${t} mL. How much more should Purl pour?`;
  feedback=`Count on from ${a} mL to ${t} mL: add ${more} mL. ${t} mL is the final amount, not the extra pour. Adding ${extra} mL would pass the target.`;
  help=`In a separate jug, start at ${h.start} mL, add ${h.end-h.start} mL, and finish at ${h.end} mL. The extra pour is the difference between start and target.`;
  example={kind:'pour',start:h.start,target:h.end,extra:h.end-h.start};
 }
 const index=kind==='trays'?v.c-1:kind==='shares'?counts.indexOf(v.n):amounts.indexOf(v.a);
 choices=rotate(choices,index);
 return {choices,expected,question,picture,help,feedback,example};
}
export function startTown(state,today=localDay()){
 const card=nextTownCard(state,today),r=townState(state);if(card?.type!=='offer'||!r||readable(r).length>=12&&card.willTrim===null)return false;
 const next=clone(r),a=clone(card.artifact);
 if(card.form==='share-compare')a.values.m=nextCount(a.values.n);
 if(card.form==='jug-coarser'){a.values.lower=(Math.ceil(a.values.a/100)-1)*100;a.values.upper=(Math.floor(a.values.a/100)+1)*100;}
 if(card.form==='jug-more')a.values.t=Math.ceil((a.values.a+1)/100)*100;
 const content=formContent(a,card.form);
 const id=Math.max(0,...next.errands.filter(x=>int(x?.id,1,Number.MAX_SAFE_INTEGER)).map(x=>x.id))+1;
 if(!int(id,1,Number.MAX_SAFE_INTEGER))return false;
 const familiar=readable(next).some(e=>e.form===card.form);
 const errand={id,kind:a.kind,form:card.form,artifact:{caseId:a.caseId,title:a.title,keptDay:a.keptDay,key:a.key,values:clone(a.values)},startedDay:today,...content,choice:null,status:'open',support:{example:false,together:false,narration:false},familiar,checks:[]};
 if(!errandValid(errand))return false;
 if(card.willTrim!==null)next.errands.splice(next.errands.findIndex(e=>e?.id===card.willTrim&&errandValid(e)),1);
 next.errands.push(errand);next.used=[...next.used.filter(k=>k!==a.key),a.key].slice(-48);next.rotation=a.kind;state.townRemembers=next;return clone(errand);
}
function change(state,fn){const r=townState(state);if(!r)return false;const next=clone(r),result=fn(next);if(result===false||!rootValid(next))return false;state.townRemembers=next;return result??true;}
export function chooseTown(state,value){return change(state,r=>{const e=openErrand(r);if(!errandValid(e)||!e.choices.some(c=>c.value===value))return false;e.choice=value;});}
export function checkTown(state){return change(state,r=>{const e=openErrand(r);if(!errandValid(e)||e.choice===null||e.checks.length>=8)return false;const check={choice:e.choice,fit:e.choice===e.expected,feedback:e.feedback};e.checks.push(check);return clone(check);});}
export function keepTown(state){return change(state,r=>{const e=openErrand(r);if(!errandValid(e)||e.choice===null)return false;e.status='kept';});}
export function asideTown(state){return change(state,r=>{const e=openErrand(r);if(!obj(e)||e.status!=='open')return false;e.status='aside';});}
export function supportTown(state,kind){if(!['example','together','narration'].includes(kind))return false;return change(state,r=>{const e=openErrand(r);if(!errandValid(e))return false;e.support[kind]=true;});}
export function townHistory(state){const r=townState(state);if(!r)return {readable:[],raw:[state.townRemembers],unavailable:true};const good=readable(r);return {readable:good,raw:r.errands.filter(e=>!good.includes(e)),unavailable:false};}
