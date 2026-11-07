import {sharedTurnJobs,sharedTurnLessons,sharedTurnCopy as copy} from './shared-turn-content.mjs';
const integer=(n,min,max)=>Number.isInteger(n)&&n>=min&&n<=max;
const tilts=[0,90,180,270];
export function createSharedTurn(){return {page:'build',whole:180,first:60,tilt:0,job:0,ideas:Array(8).fill(null),drafts:Array(8).fill(''),readings:Array(8).fill(false),lesson:0};}
function valid(work){return work && ['build','cover','learn'].includes(work.page)&&[180,360].includes(work.whole)&&integer(work.first,0,work.whole)&&work.first%15===0&&tilts.includes(work.tilt)&&integer(work.job,0,7)&&integer(work.lesson,0,3)&&Array.isArray(work.ideas)&&work.ideas.length===8&&work.ideas.every(n=>n===null||integer(n,0,360))&&Array.isArray(work.drafts)&&work.drafts.length===8&&work.drafts.every(s=>typeof s==='string'&&s.length<=32)&&Array.isArray(work.readings)&&work.readings.length===8&&work.readings.every(b=>typeof b==='boolean');}
export function sharedTurnDraftNumber(raw){if(typeof raw!=='string'||raw.length>32)return null;const s=raw.trim();return /^\d{1,3}$/.test(s)&&Number(s)<=360?Number(s):null;}
export function changeSharedTurn(work,action,value){
 if(!valid(work))return work;
 const set=(key,v)=>work[key]===v?work:{...work,[key]:v};
 const slot=(key,v)=>{if(work[key][work.job]===v)return work;const values=[...work[key]];values[work.job]=v;return {...work,[key]:values};};
 if(action==='page')return ['build','cover','learn'].includes(value)?set('page',value):work;
 if(action==='turn')return {...work,tilt:(work.tilt+90)%360};
 if(work.page==='build'){
  if(action==='whole'&&[180,360].includes(value)&&work.first<=value)return set('whole',value);
  if(action==='first'&&integer(value,0,work.whole)&&value%15===0)return set('first',value);
 }
 if(work.page==='cover'){
  if(action==='job'&&integer(value,0,7))return set('job',value);
  if(action==='draft'&&typeof value==='string'&&value.length<=32)return slot('drafts',value);
  if(action==='idea'&&integer(value,0,360))return slot('ideas',value);
  if(action==='reading')return slot('readings',!work.readings[work.job]);
  if(action==='clear-idea'){
   if(work.ideas[work.job]===null&&work.drafts[work.job]==='')return work;
   const ideas=[...work.ideas],drafts=[...work.drafts];ideas[work.job]=null;drafts[work.job]='';return {...work,ideas,drafts};
  }
 }
 if(work.page==='learn'&&action==='lesson'&&integer(value,0,3))return set('lesson',value);
 return work;
}
const direction=angle=>{const a=((angle%360)+360)%360;if(a===0)return [1,0];if(a===90)return [0,-1];if(a===180)return [-1,0];if(a===270)return [0,1];const r=a*Math.PI/180;return [Math.cos(r),-Math.sin(r)];};
const at=(angle,radius)=>{const [x,y]=direction(angle);return [160+x*radius,160+y*radius];};
function ray(role,angle,length,width,headWidth){const tip=at(angle,155),base=at(angle,146),[x,y]=direction(angle);return {role,angle,length,width,solid:at(angle,length),continuation:at(angle,152),tip,head:[tip,[base[0]-y*headWidth/2,base[1]+x*headWidth/2],[base[0]+y*headWidth/2,base[1]-x*headWidth/2]]};}
function arc(role,start,sweep,radius,arrow=true){
 const segments=[];for(let offset=0;offset<sweep;offset+=180){const end=Math.min(offset+180,sweep);segments.push({from:at(start+offset,radius),to:at(start+end,radius),radius,large:0,sweep:0});}
 let head=[];
 if(sweep>0&&arrow){const tip=at(start+sweep,radius),r=(start+sweep)*Math.PI/180,tangent=[-Math.sin(r),-Math.cos(r)],base=[tip[0]-tangent[0]*8,tip[1]-tangent[1]*8];head=[tip,[base[0]-tangent[1]*4,base[1]+tangent[0]*4],[base[0]+tangent[1]*4,base[1]-tangent[0]*4]];}
 return {role,start,sweep,radius,segments,head};
}
export function sharedTurnGeometry(pose={}){
 if(!pose||typeof pose!=='object'||Array.isArray(pose))return null;
 const {whole,first,tilt=0,gap=false}=pose;
 if(![180,360].includes(whole)||!integer(first,0,whole)||!tilts.includes(tilt)||typeof gap!=='boolean'||(gap&&(whole!==180||first!==60)))return null;
 const second=gap?60:whole-first;
 const rays=[ray('start',tilt,115,10,14),ray('end',tilt+whole,100,6,10),ray('divider',tilt+first,135,2,6)];
 const arcs=[arc('whole',tilt,whole,145,false),arc('first',tilt,first,70),arc('second',tilt+(gap?120:first),second,100)];
 const notes=[];
 if(gap){rays.push(ray('gap-edge',tilt+120,125,2,6));arcs.push(arc('gap',tilt+60,60,120,false));}
 else if(whole===360&&(first===0||first===360))notes.push(copy.allRays);
 else {if(whole===360)notes.push(copy.full);if(first===0)notes.push(copy.dividerStart);if(first===whole)notes.push(copy.dividerEnd);}
 return {whole,first,second,tilt,gap,rays,arcs,notes};
}
export function sharedTurnModel(work){
 if(!valid(work))return null;
 const job=sharedTurnJobs[work.job],lesson=sharedTurnLessons[work.lesson];
 const reading=work.readings[work.job]?{...job,text:`The other part is ${job.missing}°. ${job.whole}° − ${job.given}° = ${job.missing}°. Together, ${job.given}° + ${job.missing}° = ${job.whole}°.`}:null;
 const pose=work.page==='build'?{whole:work.whole,first:work.first}:work.page==='cover'?{whole:job.whole,first:job.given}:lesson;
 return {page:work.page,build:{whole:work.whole,first:work.first,second:work.whole-work.first,canHalf:work.first<=180,canLess:work.first>0,canMore:work.first<work.whole},job,draft:work.drafts[work.job],idea:work.ideas[work.job],reading,lesson,geometry:sharedTurnGeometry({...pose,tilt:work.tilt})};
}
const measure=n=>n===0?'No turn · 0°':n===360?'One full turn · 360°':`${n}°`;
export function sharedTurnNarration(work){
 const m=sharedTurnModel(work);if(!m)return '';
 const g=m.geometry,kind=g.whole===180?'half':'full';let text;
 if(m.page==='build')text=`Build two parts. ${copy.buildTeaching} ${copy.curveNote} First part ${measure(g.first)}. Second part ${measure(g.second)}. ${g.first}° + ${g.second}° = ${g.whole}°.`;
 else if(m.page==='cover'){
  const j=m.job;
  text=`Cover a label. Job ${work.job+1} of 8. The two marked parts fill one ${kind} turn. The first part is ${j.given}°. What is the other part? ${j.given}° + ${m.reading?`${j.missing}°`:'covered label'} = ${j.whole}°. ${m.idea===null?copy.emptyIdea:`Your idea: ${m.idea}°.`}`;
  if(m.draft!==''&&(sharedTurnDraftNumber(m.draft)===null||sharedTurnDraftNumber(m.draft)!==m.idea)){const n=sharedTurnDraftNumber(m.draft);text+=` ${n===null?copy.invalidDraft:`Your draft, not kept yet: ${n}°.`}`;}
  if(m.reading)text+=` ${m.reading.text}`;
  text+=` ${copy.draftNote} ${copy.curveNote}`;
 }else text=`See why. Worked example · not your parts. ${m.lesson.title} ${m.lesson.text}${g.gap?' Gap 60°. 60° + 60° + gap 60° = 180°.':''}`;
 const parts=g.gap?'The marked first and second parts are 60 degrees each, with a gap of 60 degrees.':`Starting ray, dividing ray and ending ray show first part ${g.first} degrees and second part ${m.page==='cover'&&!m.reading?'covered':`${g.second} degrees`}.`;
 return `${copy.title}. ${text} A drawing of a ${g.whole}-degree ${kind} counterclockwise turn at one pin. ${parts} Ray lengths do not set the angle measures. ${g.notes.join(' ')} ${copy.lifetime} Back to Hinge Bench.`;
}
