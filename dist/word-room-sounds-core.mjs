// Spec342: literal materials and explicit help; no oral performance is observed.
import {makeSoundMessageSource} from './word-room-sounds-content.mjs';
import {freshWordRoom,validWordRoomRoot,wordRoomText,wordRoomCode} from './word-room-core.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),own=(o,k)=>obj(o)&&Object.hasOwn(o,k),clone=structuredClone;
const text=(x,max=4000)=>typeof x==='string'&&x.length>0&&x.length<=max;
const code=wordRoomCode;
const map=x=>obj(x)&&Object.keys(x).length<=64;
const alphabet=x=>Array.isArray(x)&&x.length>=1&&x.length<=26&&new Set(x).size===x.length&&x.every(l=>typeof l==='string'&&/^[a-z]$/.test(l));
const sized=x=>{try{return obj(x)&&new TextEncoder().encode(JSON.stringify(x)).length<=96*1024;}catch{return false;}};
const helpKeys=['partnerCard','word','picture','example','contrast','base'];
const help=x=>obj(x)&&helpKeys.every(k=>typeof x[k]==='boolean');
const emptyHelp=()=>Object.fromEntries(helpKeys.map(k=>[k,false]));
const modes=['listen','read'],pages=['setup','partner','work','comparison','contrast','example'];
const slots=(x,a)=>Array.isArray(x)&&x.length===3&&x.every(l=>l===null||typeof l==='string'&&a.includes(l));
const word=(w,a)=>obj(w)&&typeof w.label==='string'&&/^[a-z]{3}$/.test(w.label)&&
  Array.isArray(w.letters)&&w.letters.length===3&&w.letters.join('')===w.label&&w.letters.every(l=>typeof l==='string'&&l.length===1&&a.includes(l))&&
  text(w.meaning)&&text(w.alt)&&code(w.art)&&text(w.guidance);
const pair=(x,a)=>obj(x)&&word(x.left,a)&&word(x.right,a)&&Number.isInteger(x.position)&&x.position>=0&&x.position<3&&
  x.left.letters.every((l,i)=>(l!==x.right.letters[i])===(i===x.position))&&Array.isArray(x.frames)&&x.frames.length===3&&x.frames.every(t=>text(t));
export function soundCaseSource(s,id){
  return code(id)&&sized(s)&&s.id===id&&text(s.title,160)&&alphabet(s.alphabet)&&pair(s,s.alphabet)&&
    obj(s.example)&&text(s.example.title,160)&&pair(s.example,s.alphabet)?s:null;
}
export function soundComparison(x){
  return obj(x)&&Array.isArray(x.slots)&&x.slots.length===3&&x.slots.every(l=>l===null||typeof l==='string'&&/^[a-z]$/.test(l))&&
    typeof x.target==='string'&&/^[a-z]{3}$/.test(x.target)&&['incomplete','different','match'].includes(x.result);
}
export function soundKeep(x){
  return obj(x)&&Array.isArray(x.slots)&&x.slots.length===3&&x.slots.every(l=>l===null||typeof l==='string'&&/^[a-z]$/.test(l))&&modes.includes(x.mode)&&help(x.help);
}
export function soundRecord(r,id){
  const s=obj(r)&&soundCaseSource(r.source,id);
  return s&&modes.includes(r.mode)&&slots(r.slots,s.alphabet)&&Number.isInteger(r.place)&&r.place>=0&&r.place<3&&
    pages.includes(r.page)&&Number.isInteger(r.frame)&&r.frame>=0&&r.frame<3&&help(r.help)?r:null;
}
export function validSoundMessages(r){
  return obj(r)&&r.v===1&&typeof r.active==='boolean'&&obj(r.sharedHelp)&&typeof r.sharedHelp.message==='boolean'&&
    sized(r.source)&&code(r.source.id)&&Number.isSafeInteger(r.source.revision)&&r.source.revision>0&&map(r.source.cases)&&
    map(r.records)&&(r.selectedId===null||code(r.selectedId))&&['choose','case','message'].includes(r.page);
}
const fresh=()=>({v:1,active:true,source:makeSoundMessageSource(),sharedHelp:{message:false},selectedId:null,records:{},page:'choose'});
export function soundMessagesView(book){
  if(own(book,'wordRoom')&&!validWordRoomRoot(book.wordRoom))return{status:'parent-unavailable',active:false};
  const r=book?.wordRoom?.soundMessages;
  if(!own(book?.wordRoom,'soundMessages'))return{status:'new',active:false};
  if(!validSoundMessages(r))return{status:'unsupported',active:false,root:r};
  const ids=[...new Set([...Object.keys(r.source.cases),...Object.keys(r.records)])];
  const cases=ids.map(id=>{
    const present=own(r.records,id),record=present?soundRecord(r.records[id],id):null;
    const source=present?record?.source:soundCaseSource(r.source.cases[id],id);
    return{id,source:source||null,record,earlier:!own(r.source.cases,id)};
  });
  const current=cases.find(x=>x.id===r.selectedId)||null;
  const readableMessage=code(r.source.message?.id)?wordRoomText({texts:{[r.source.message.id]:r.source.message}},r.source.message.id):null;
  const offered=Object.keys(r.source.cases);
  const complete=offered.length>0&&offered.every(id=>{
    const row=cases.find(x=>x.id===id);return row?.source&&row.record&&soundKeep(row.record.firstKept);
  });
  return{status:'ready',active:r.active,root:r,cases,current:current?.record?current:null,
    selected:current,message:readableMessage,page:r.page,complete};
}
const fail=error=>({ok:false,error});
function mutate(book,fn,options={},create=false){
  if(!obj(book)||typeof options.canExport!=='function')return fail('capacity');
  try{
    const original=book.wordRoom;
    if(options.isCurrent&&options.isCurrent()!==true)return fail('stale');
    const candidate=clone(book);
    if(!own(candidate,'wordRoom')){if(!create)return fail('unavailable');candidate.wordRoom=freshWordRoom();}
    if(!validWordRoomRoot(candidate.wordRoom))return fail('unavailable');
    if(!own(candidate.wordRoom,'soundMessages')){if(!create)return fail('unavailable');candidate.wordRoom.soundMessages=fresh();}
    const r=candidate.wordRoom.soundMessages;
    if(!validSoundMessages(r))return fail('unavailable');
    const result=fn(r);
    if(!result.ok||result.changed===false)return result;
    if(!validSoundMessages(r)||!recoveryFitsProgressLimits(candidate))return fail('capacity');
    const proposal=clone(candidate.wordRoom);
    if(options.canExport(candidate)!==true)return fail('capacity');
    if(book.wordRoom!==original||options.isCurrent&&options.isCurrent()!==true)return fail('stale');
    book.wordRoom=proposal;
    return result;
  }catch{return fail('capacity');}
}
export const enterSoundMessages=(book,options)=>mutate(book,r=>{r.active=true;return{ok:true};},options,true);
export const leaveSoundMessages=(book,options)=>mutate(book,r=>{r.active=false;return{ok:true};},options);
export function chooseSoundCase(book,id,mode,options){
  return mutate(book,r=>{
    if(!code(id)||!modes.includes(mode))return fail('selection');
    if(own(r.records,id)){
      const work=soundRecord(r.records[id],id);if(!work)return fail('unavailable');
      if(work.mode!==mode){work.mode=mode;work.page=mode==='listen'?'setup':'work';if(mode==='read')work.help.word=true;}
    }else{
      const source=own(r.source.cases,id)&&soundCaseSource(r.source.cases[id],id);if(!source)return fail('unavailable');
      r.records[id]={source:clone(source),mode,slots:[null,null,null],place:0,page:mode==='listen'?'setup':'work',frame:0,help:emptyHelp()};
      if(mode==='read')r.records[id].help.word=true;
    }
    r.active=true;r.selectedId=id;r.page='case';return{ok:true};
  },options);
}
const snapshot=w=>{
  const keep={slots:clone(w.slots),mode:w.mode,help:clone(w.help)};
  if(currentComparison(w))keep.comparison=clone(w.comparison);
  return keep;
};
export function currentComparison(w){
  return obj(w)&&Array.isArray(w.slots)&&soundComparison(w.comparison)&&w.comparison.target===w.source?.right?.label&&w.slots.every((l,i)=>l===w.comparison.slots[i])?w.comparison:null;
}
export function actSoundCase(book,action,value,options){
  return mutate(book,r=>{
    if(action==='choose'){r.page='choose';return{ok:true};}
    if(action==='message'){
      const m=r.source.message;
      if(!code(m?.id)||!wordRoomText({texts:{[m.id]:m}},m.id))return fail('unavailable');
      r.sharedHelp.message=true;r.page='message';return{ok:true};
    }
    if(action==='caseBack'){
      r.page=own(r.records,r.selectedId)&&soundRecord(r.records[r.selectedId],r.selectedId)?'case':'choose';return{ok:true};
    }
    if(r.page!=='case'||!own(r.records,r.selectedId))return fail('selection');
    const w=soundRecord(r.records[r.selectedId],r.selectedId);if(!w)return fail('unavailable');
    const s=w.source;
    if(action==='partner'){if(w.mode!=='listen'||w.page!=='setup')return fail('selection');w.help.partnerCard=true;w.page='partner';}
    else if(action==='hidePartner'){if(w.page!=='partner')return fail('selection');w.page='work';}
    else if(action==='back'){if(!['comparison','contrast','example'].includes(w.page))return fail('selection');w.page='work';}
    else if(action==='build'){if(w.mode!=='read'||w.page!=='work')return fail('selection');w.mode='listen';w.page='work';}
    else if(['prev','next'].includes(action)){
      if(!['example','contrast'].includes(w.page))return fail('selection');
      w.frame=Math.max(0,Math.min(2,w.frame+(action==='next'?1:-1)));
    }else{
      if(w.page!=='work')return fail('selection');
      if(['place','letter','clearPlace','clear','base'].includes(action)&&w.mode!=='listen')return fail('selection');
      if(action==='place'){if(!Number.isInteger(value)||value<0||value>2)return fail('selection');w.place=value;}
      else if(action==='letter'){if(w.mode!=='listen'||typeof value!=='string'||!s.alphabet.includes(value))return fail('selection');w.slots[w.place]=value;w.place=Math.min(2,w.place+1);}
      else if(action==='clearPlace'){w.slots[w.place]=null;}
      else if(action==='clear'){w.slots=[null,null,null];w.place=0;}
      else if(action==='base'){if(w.slots.some(l=>l!==null))return fail('selection');w.slots=clone(s.left.letters);w.help.base=true;}
      else if(action==='word'){w.help.word=true;}
      else if(action==='picture'){w.help.picture=true;}
      else if(action==='compare'){
        w.help.word=true;w.comparison={slots:clone(w.slots),target:s.right.label,result:w.slots.includes(null)?'incomplete':w.slots.join('')===s.right.label?'match':'different'};w.page='comparison';
      }else if(action==='contrast'){w.help.word=true;w.help.contrast=true;w.page='contrast';w.frame=0;}
      else if(action==='example'){
        w.help.example=true;if([s.example.left.label,s.example.right.label].includes(s.right.label))w.help.word=true;w.page='example';w.frame=0;
      }else if(action==='keep'){
        const kept=snapshot(w);if(!own(w,'firstKept'))w.firstKept=clone(kept);w.latestKept=kept;return{ok:true,notice:'kept'};
      }else if(action==='restoreFirst'||action==='restoreLatest'){
        const kept=action==='restoreFirst'?w.firstKept:w.latestKept;
        if(!soundKeep(kept)||!slots(kept.slots,s.alphabet))return fail('unavailable');
        w.slots=clone(kept.slots);w.place=0;for(const k of helpKeys)w.help[k]=w.help[k]||kept.help[k];
      }else return fail('selection');
    }
    if(!soundRecord(w,r.selectedId))return fail('unavailable');
    return{ok:true};
  },options);
}
