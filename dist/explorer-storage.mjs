import {freshStory} from './keeper-story-core.mjs';
import {STORAGE_KEY,freshState,restoreStateResult} from './core.mjs';

export const REGISTRY_KEY='learning-garden-explorers';
export const SAVE_KEY='number-garden-save';
export const EXPLORER_COLORS=['gold','rose','blue','green','lavender','coral'];
export const EXPLORER_SYMBOLS=['leaf','acorn','shell','feather','pebble','flower'];
const avatarIds=['fern','reed','sky'];
const validId=id=>typeof id==='string'&&/^explorer-[1-9]\d{0,8}$/.test(id);
const stateKey=id=>`${STORAGE_KEY}:${id}`;
const copyKey=key=>/^number-garden-(?:backup|kept)-/.test(key);
const managed=key=>key===REGISTRY_KEY||key===STORAGE_KEY||key.startsWith(`${STORAGE_KEY}:`)||copyKey(key);
function cleanProfile(p){
 if(!p||!validId(p.id)||!avatarIds.includes(p.avatar)||!EXPLORER_COLORS.includes(p.color)||!EXPLORER_SYMBOLS.includes(p.symbol)||typeof p.createdAt!=='string'||!Number.isFinite(Date.parse(p.createdAt)))return null;
 return {id:p.id,avatar:p.avatar,color:p.color,symbol:p.symbol,createdAt:p.createdAt};
}
function cleanRegistry(raw){
 try{const r=JSON.parse(raw);if(r?.version!==1||!Array.isArray(r.explorers)||!r.explorers.length)return null;const explorers=r.explorers.map(cleanProfile);if(explorers.some(p=>!p)||new Set(explorers.map(p=>p.id)).size!==explorers.length||!explorers.some(p=>p.id===r.activeId))return null;return {version:1,activeId:r.activeId,explorers};}catch{return null;}
}

// All learner data remains in this browser. A failed preservation write blocks replacement.
export class ExplorerStore{
 constructor(storage,options={}){this.storage=storage;this.now=options.now||(()=>new Date());this.memory=new Map();this.importCopies=new Map();this.registry=null;this._persist=true;this._warning='';this._writeBlocked=false;this._needsChooser=false;}
 get active(){return this.registry?.explorers.find(p=>p.id===this.registry.activeId)||null;}
 get explorers(){return this.registry?.explorers||[];}
 get persist(){return this._persist;}
 get warning(){return this._warning;}
 get needsChooser(){return this._needsChooser;}
 get importUncertain(){return this._importUncertain===true;}
 _warn(text='Progress could not be saved. This session is still available; download notes before leaving.'){this._warning=text;}
 _get(key){return this.storage.getItem(key);}
 _keys(){return Array.from({length:this.storage.length},(_,i)=>this.storage.key(i)).filter(k=>typeof k==='string');}
 _write(key,raw){try{this.storage.setItem(key,raw);if(this._get(key)!==raw)throw new Error('Write did not persist');return true;}catch{this._warn();return false;}}
 _stamp(){return this.now().toISOString().replace(/[:.]/g,'-');}
 _copy(raw,kind,id){
  try{const prefix=`number-garden-${kind}-${id}-`,keys=this._keys();if(keys.some(k=>k.startsWith(prefix)&&this._get(k)===raw))return true;let key=`${prefix}${this._stamp()}`,n=1;while(keys.includes(key))key=`${prefix}${this._stamp()}-${n++}`;if(!this._write(key,raw))return false;
   // Only migration backups are bounded; unreadable kept copies remain until removal.
   if(kind==='backup'){const previous=this._keys().filter(k=>k.startsWith(prefix)).sort().reverse();for(const old of previous.slice(2))this.storage.removeItem(old);}
   return true;
  }catch{this._warn();return false;}
 }
 _newProfile(choice={}){
  let n=1;const ids=new Set(this.explorers.map(p=>p.id));let keys=[];try{keys=this._keys();}catch{this._writeBlocked=true;this._warn();}
  while(ids.has(`explorer-${n}`)||keys.includes(stateKey(`explorer-${n}`)))n++;
  const avatar=avatarIds.includes(choice.avatar)?choice.avatar:'sky',color=EXPLORER_COLORS.includes(choice.color)?choice.color:EXPLORER_COLORS[(n-1)%6],symbol=EXPLORER_SYMBOLS.includes(choice.symbol)?choice.symbol:EXPLORER_SYMBOLS[(n-1)%6];
  const used=new Set(this.explorers.map(p=>`${p.avatar}:${p.color}:${p.symbol}`));
  const avatars=[avatar,...avatarIds.filter(a=>a!==avatar)],colorStart=EXPLORER_COLORS.indexOf(color),symbolStart=EXPLORER_SYMBOLS.indexOf(symbol);
  for(const candidateAvatar of avatars)for(let c=0;c<6;c++)for(let s=0;s<6;s++){
   const candidateColor=EXPLORER_COLORS[(colorStart+c)%6],candidateSymbol=EXPLORER_SYMBOLS[(symbolStart+s)%6];
   if(!used.has(`${candidateAvatar}:${candidateColor}:${candidateSymbol}`))return {id:`explorer-${n}`,avatar:candidateAvatar,color:candidateColor,symbol:candidateSymbol,createdAt:this.now().toISOString()};
  }
  this._warn('All explorer pictures are in use. Choose an existing explorer to keep playing.');return null;
 }
 _fresh(profile){return {...freshState(),story:freshStory(),garden:{avatar:profile.avatar}};}
 _commitRegistry(){if(!this._persist||this._writeBlocked)return false;try{const raw=this._get(REGISTRY_KEY);if(raw!==null&&!cleanRegistry(raw)&&!this._copy(raw,'kept','registry'))return false;return this._write(REGISTRY_KEY,JSON.stringify(this.registry));}catch{this._warn();return false;}}
 _avatar(state,profile){if(!state.garden||typeof state.garden!=='object'||Array.isArray(state.garden))state.garden={};if(!avatarIds.includes(state.garden.avatar))state.garden.avatar=profile.avatar;return state;}
 _readState(profile){
  if(this.memory.has(profile.id))return this.memory.get(profile.id);
  let state;try{const raw=this._get(stateKey(profile.id));if(raw===null){state=this._fresh(profile);this._warn('A saved explorer had no readable progress copy. This session starts with a fresh notebook.');}else{const result=restoreStateResult(raw);state=result.state;if(result.reason){const kept=this._copy(raw,'kept',profile.id);this._warn(kept?'We couldn’t open some saved progress. We kept a copy, so nothing is lost.':'Some saved progress could not be read or copied safely. The original is unchanged; this session is temporary.');}}}catch{this._writeBlocked=true;this._warn();state=this._fresh(profile);}
  this._avatar(state,profile);this.memory.set(profile.id,state);return state;
 }
 load(){
  if(this.registry)return this.memory.get(this.registry.activeId)||this._readState(this.active);
  try{this._persist=this._get(SAVE_KEY)!=='off';if(!this._persist){const p=this._newProfile();this.registry={version:1,activeId:p.id,explorers:[p]};const s=this._fresh(p);this.memory.set(p.id,s);return s;}
   const rawRegistry=this._get(REGISTRY_KEY);
   if(rawRegistry!==null){const registry=cleanRegistry(rawRegistry);if(registry){this.registry=registry;this._needsChooser=registry.explorers.length>1;return this._readState(this.active);}if(!this._copy(rawRegistry,'kept','registry'))this._writeBlocked=true;this._warn(this._writeBlocked?'The explorer list could not be read or copied safely. The original is unchanged; this session is temporary.':'The explorer list could not be read. Its original copy has been kept.');}
   const legacy=this._get(STORAGE_KEY),restored=legacy===null?null:restoreStateResult(legacy),p=this._newProfile({avatar:restored?.state.garden?.avatar});this.registry={version:1,activeId:p.id,explorers:[p]};const s=this._avatar(restored?.state||this._fresh(p),p);this.memory.set(p.id,s);
   if(this._writeBlocked)return s;
   if(legacy!==null){if(!this._copy(legacy,'backup',p.id)||!this._write(stateKey(p.id),legacy)){this._writeBlocked=true;return s;}if(restored.reason){if(!this._copy(legacy,'kept',p.id))this._writeBlocked=true;this._warn(this._writeBlocked?'Some saved progress could not be copied safely. The original is unchanged; this session is temporary.':'We couldn’t open some saved progress. We kept a copy, so nothing is lost.');}}
   else if(!this._write(stateKey(p.id),JSON.stringify(s))){this._writeBlocked=true;return s;}
   if(!this._writeBlocked&&!this._commitRegistry())this._writeBlocked=true;
   return s;
  }catch{this._writeBlocked=true;this._warn();if(!this.registry){const p={id:'explorer-1',avatar:'sky',color:'gold',symbol:'leaf',createdAt:this.now().toISOString()};this.registry={version:1,activeId:p.id,explorers:[p]};this.memory.set(p.id,this._fresh(p));}return this.memory.get(this.registry.activeId)||this._fresh(this.active);}
 }
 _writeState(profile,state){
  const key=stateKey(profile.id);try{const raw=this._get(key);if(raw!==null){const restored=restoreStateResult(raw);if(restored.reason&&!this._copy(raw,'kept',profile.id))return false;}
   if(!this._write(key,JSON.stringify(state)))return false;if(avatarIds.includes(state.garden?.avatar))profile.avatar=state.garden.avatar;return true;
  }catch{this._warn();return false;}
 }
 save(state){if(!this.registry)this.load();this.memory.set(this.active.id,state);if(!this._persist)return true;if(this._writeBlocked)return false;return this._writeState(this.active,state)&&this._commitRegistry();}
 add(choice={},currentState){
  if(!this.registry)this.load();if(currentState)this.save(currentState);const p=this._newProfile(choice);if(!p)return null;const s=this._fresh(p);this.registry.explorers.push(p);this.registry.activeId=p.id;this.memory.set(p.id,s);this._needsChooser=false;
  if(this._persist&&!this._writeBlocked){if(!this._write(stateKey(p.id),JSON.stringify(s))||!this._commitRegistry())this._writeBlocked=true;}return s;
 }
 importState(prepared){
  const fail=message=>({ok:false,message});
  const halt=message=>{this._writeBlocked=true;this._importUncertain=true;this._warn(message);return fail(message);};
  if(!this.registry)this.load();
  if(!prepared?.ok||typeof prepared.raw!=='string'||restoreStateResult(JSON.stringify(prepared.state)).reason)return fail('Choose and preview a supported notebook first.');
  if(this._persist&&this._writeBlocked)return fail('Saving is unavailable. Download your current notes and keep the import file, then reload before trying again.');
  const profile=this._newProfile(prepared.choice);if(!profile)return fail('No explorer slot is available.');
  const state=structuredClone(prepared.state);this._avatar(state,profile);state.garden.avatar=profile.avatar;
  const next={version:1,activeId:profile.id,explorers:[...this.explorers,profile]},rawNext=JSON.stringify(next),key=stateKey(profile.id),recovery=`number-garden-kept-${profile.id}-${this._stamp()}`;
  if(this._persist){
   let before;
   try{before=this._get(REGISTRY_KEY);if(JSON.stringify(cleanRegistry(before))!==JSON.stringify(this.registry))return halt('The explorer list changed in another tab. Saving is paused here; reload before importing.');if(this._get(key)!==null||this._get(recovery)!==null)return halt('This explorer slot is already saved. Saving is paused here; reload before importing.');}catch{return halt('Saved progress could not be checked. Saving is paused here; keep your file and reload before importing.');}
   const rawState=JSON.stringify(state);
   const cleanup=()=>{try{if(this._get(REGISTRY_KEY)!==before)return false;for(const [k,value] of [[key,rawState],[recovery,prepared.raw]])if(this._get(k)===value)this.storage.removeItem(k);return true;}catch{return false;/* Uncertain new keys remain recoverable; existing keys are never removed. */}};
   if(!this._write(recovery,prepared.raw)||!this._write(key,rawState)){if(!cleanup())return halt('The import could not be checked safely. Its new copies have been kept and saving is paused here. Keep your file and reload.');return fail('The notebook could not be saved, possibly because this browser is full. Existing explorer files were not replaced. Keep your file and reload before trying again.');}
   try{if(this._get(REGISTRY_KEY)!==before)return halt('The explorer list changed in another tab. The new file copies have been kept. Saving is paused here; reload before importing.');}catch{return halt('The saved explorer list could not be checked. The new file copies have been kept. Saving is paused here; keep your file and reload.');}
   if(!this._write(REGISTRY_KEY,rawNext)){
    let rolledBack=false;
    try{const actual=this._get(REGISTRY_KEY);rolledBack=actual===before;if(actual===rawNext)rolledBack=this._write(REGISTRY_KEY,before);}catch{}
    if(rolledBack){if(!cleanup())return halt('The prior explorer list was restored, but cleanup could not be checked safely. Saving is paused here; keep your file and reload.');return fail('The import could not be completed. Existing explorers are unchanged. Keep your file and try again.');}
    this._writeBlocked=true;this._importUncertain=true;this._warn('Download your current notes, then reload and check the explorer list before importing again. The import may have been saved, but we couldn’t confirm it. Its progress and the original file are kept.');return fail(this.warning);
   }
  }else this.importCopies.set(recovery,prepared.raw);
  this.registry=next;this.memory.set(profile.id,state);this._needsChooser=false;this._warning='';
  return {ok:true,state,temporary:!this._persist};
 }
 select(id,currentState){
  if(!this.registry)this.load();if(!this.explorers.some(p=>p.id===id))return null;if(currentState)this.save(currentState);this.registry.activeId=id;this._needsChooser=false;const s=this._readState(this.active);if(this._persist&&!this._writeBlocked)this._commitRegistry();return s;
 }
 setPersistence(enabled,currentState){
  if(this.importUncertain)return false;
  if(!this.registry)this.load();if(currentState)this.memory.set(this.active.id,currentState);
  if(!enabled){for(const p of this.explorers)this._readState(p);this._persist=false;let ok=this._write(SAVE_KEY,'off');try{for(const k of this._keys().filter(managed)){try{this.storage.removeItem(k);if(this._get(k)!==null)ok=false;}catch{ok=false;}}}catch{ok=false;}if(!ok)this._warn('Some saved copies could not be removed. Saving is off for this session; check browser storage before sharing this device.');return ok;}
  this._persist=true;this._writeBlocked=false;if(!this._write(SAVE_KEY,'on'))return false;for(const [key,raw] of this.importCopies)if(!this._write(key,raw)){this._writeBlocked=true;return false;}for(const p of this.explorers){const s=this.memory.get(p.id)||this._readState(p);if(!this._writeState(p,s)){this._writeBlocked=true;return false;}}return this._commitRegistry();
 }
 clearActive(){
  if(this.importUncertain)return this.load();
  if(!this.registry)this.load();const id=this.active.id,s=this._fresh(this.active);this.memory.set(id,s);for(const k of this.importCopies.keys())if(k.startsWith(`number-garden-kept-${id}-`))this.importCopies.delete(k);try{if(this._persist){for(const k of this._keys())if(k===stateKey(id)||k.startsWith(`number-garden-backup-${id}-`)||k.startsWith(`number-garden-kept-${id}-`))this.storage.removeItem(k);this.save(s);}}catch{this._warn();}return s;
 }
 clearAll(){
  if(this.importUncertain)return this.load();
  try{for(const k of this._keys().filter(managed))this.storage.removeItem(k);}catch{this._warn();this._writeBlocked=true;}
  this.memory.clear();this.importCopies.clear();this.registry={version:1,activeId:null,explorers:[]};const p=this._newProfile();this.registry={version:1,activeId:p.id,explorers:[p]};const s=this._fresh(p);this.memory.set(p.id,s);this._needsChooser=false;if(this._persist&&!this._writeBlocked)this.save(s);return s;
 }
 keptCopies(){let copies=new Map(this.importCopies);try{for(const key of this._keys().filter(k=>copyKey(k)||k===STORAGE_KEY))copies.set(key,this._get(key));}catch{this._warn();}return [...copies].map(([key,raw])=>({key,raw,label:key===STORAGE_KEY?'Earlier shared progress':key.startsWith('number-garden-kept-')?'Kept original progress':'Progress backup'}));}
 removeCopy(key){if(this.importUncertain||!(key===STORAGE_KEY||copyKey(key)))return false;this.importCopies.delete(key);try{this.storage.removeItem(key);return this._get(key)===null;}catch{this._warn();return false;}}
}
