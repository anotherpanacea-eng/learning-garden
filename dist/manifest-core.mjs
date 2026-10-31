// Specs 319 and 329: Pip's read rule, the Load it and Read it orders, and the exchangeManifest root (saved strings only).
export const TILE_IDS=Object.freeze(['colon','semicolon','comma','empty']);
export const LOAD_CODES=Object.freeze(['semicolon-lead','colon-cut','fits','lead-merged','loads-merged','as-it-stands']);
const MARK={colon:':',semicolon:';',comma:',',empty:''};
export const JOIN_TILE_IDS=Object.freeze(['period','semicolon','colon','dash','comma','nothing']);
export const READ_CODES=Object.freeze(['because-alone','because-usually','because-comma','comma-alone','crash','explain','period','semicolon','colon','dash']);
const LINE_SLOTS={m1:3,m2:3,m3:3,m4:1},ITEM_IDS=['A1','A2','A3','A4','C1','C2','C3','C4','C5'],GUIDED_IDS=['A1','C1'],NOTE_IDS=['n1','n2','n3','n4','n5'];
// Tile items: A3 has three gaps, C5 one.
const TILE_ITEMS={A3:{tiles:['colon','semicolon','comma'],slots:['s1','s2','s3']},C5:{tiles:['period','semicolon','colon','dash','comma'],slots:['s1']}};
const JOIN_FIELDS=['shown','mark','text','said','outcome','supported','at'];
const LINE_FIELDS=['variant','shown','slots','load','text','crates','said','supported','at'];
const ITEM_FIELDS=['shown','answer','prompt','offered','answerText','said','outcome','supported','guided','at'];
const plain=x=>!!x&&typeof x==='object'&&!Array.isArray(x)&&Object.getPrototypeOf(x)===Object.prototype;
const own=(o,k)=>Object.hasOwn(o,k);
const slotIds=parts=>parts.filter(p=>p.slot).map(p=>p.slot);
const strip=s=>s.replace(/\*+/g,'');
// Two whole sentences joined by a mark (spec 329): the dash is spaced, nothing adds only the space, and a period capitalizes what follows.
const JOIN_MARK={period:'.',semicolon:';',colon:':',dash:' –',comma:',',nothing:''};
export function joinText(first,mark,second){const next=mark==='period'?second.charAt(0).toUpperCase()+second.slice(1):second;return `${first}${JOIN_MARK[mark]} ${next}`;}
export const noteFits=(note,mark)=>note.fits.includes(mark);
export function readCode(note,mark){
 if(note.because)return mark==='nothing'?'because-usually':mark==='comma'?'because-comma':'because-alone';
 if(mark==='comma')return 'comma-alone';if(mark==='nothing')return 'crash';
 if(mark==='colon'&&!note.explain)return 'explain';
 return mark;
}
export const lineSlots=line=>slotIds(line.parts);
export const filled=(line,slots)=>lineSlots(line).every(k=>TILE_IDS.includes(slots?.[k]));
// The line as the learner's tiles punctuate it; empty slots leave no mark.
export function punctuate(lead,parts,slots){let out=lead;for(const p of parts){if(p.slot)out+=MARK[slots[p.slot]]??'';else if(p.fixed)out+=p.fixed;else if(p.and)out+=' and';else out+=' '+p.t;}return out+'.';}
export const fitsLine=(line,slots)=>lineSlots(line).every(k=>line.fits[k].includes(slots[k]));
// Pip loads one crate per piece, reading only the marks (spec 319, "How Pip reads a line").
export function readLine(line,slots){
 const weNeed=line.kind==='weNeed',s1=slots.s1;
 if(s1==='semicolon'||weNeed&&s1==='colon')return [];
 const semi=['s2','s3'].some(k=>slots[k]==='semicolon'),pieces=[];let cur=[];
 const cut=()=>{pieces.push(cur.join(' '));cur=[];},mark=m=>{if(cur.length)cur[cur.length-1]+=m;};
 if(s1==='comma'&&!semi){cur.push(line.lead);cut();}
 else if(!weNeed&&s1!=='colon'){cur.push(line.lead);if(s1==='comma')mark(',');}
 for(const p of line.parts.slice(1)){
  if(p.t)cur.push(p.t);
  else if(p.fixed){if(semi)mark(',');else cut();}
  else if(p.and){if(!semi)cut();cur.push('and');}
  else{const t=slots[p.slot];if(t==='semicolon')cut();else if(t==='comma'){if(semi)mark(',');else cut();}else if(t==='colon')mark(':');}
 }
 cut();
 return pieces.map(x=>x.trim().replace(/^and(\s+|$)/,'').replace(/\.$/,'').trim().toLowerCase()).filter(Boolean);
}
export function loadCode(line,slots){
 if(slots.s1==='semicolon')return 'semicolon-lead';
 if(line.kind==='weNeed'&&slots.s1==='colon')return 'colon-cut';
 if(fitsLine(line,slots))return 'fits';
 if(line.kind!=='weNeed'&&slots.s1==='empty')return 'lead-merged';
 if(line.kind==='big'&&['s2','s3'].some(k=>slots[k]==='comma'))return 'loads-merged';
 return 'as-it-stands';
}
export const whatFits=line=>line.kind==='weNeed'?['weNeed']:['lead',line.kind];
// A3 feedback: a comma in slot 2 and/or 3 gives those lines; any other non-fitting pattern gives the hint.
export function itemFeedback(item,answer){
 if(item.kind==='tiles'&&item.accept){const t=answer.s1;if(item.accept.includes(t))return {outcome:'fits',said:[item.explanation]};return {outcome:'other',said:[item.tileFeedback[t]??item.hint,item.explanation]};}
 if(item.kind==='tiles'){const fits=Object.entries(item.answer).every(([k,v])=>answer[k]===v);if(fits)return {outcome:'fits',said:[item.explanation]};const lines=['s2','s3'].filter(k=>answer[k]==='comma').map(k=>item.commaFeedback[k]);return {outcome:'other',said:[...(lines.length?lines:[item.hint]),item.explanation]};}
 const c=item.choices.find(c=>c.id===answer);return c.id===item.fits?{outcome:'fits',said:[item.explanation]}:{outcome:'other',said:[c.feedback,item.explanation]};
}
export const itemCard=item=>item.kind==='tiles'&&!item.card?`*${item.lead}${item.parts.map(p=>p.slot?' ___':p.fixed?p.fixed:p.and?' and':' '+p.t).join('')}.*`:item.card;
export const itemPrompt=item=>[itemCard(item),item.prompt].filter(Boolean).map(strip).join('\n');

// Saved work. Validation is structural: ids, codes, counts and types, never today's wording or answers.
const str=x=>typeof x==='string'&&[...x].length<=400;
const strs=x=>Array.isArray(x)&&x.length<=8&&x.every(str);
function lineShape(id,e){
 if(!plain(e))return 'unreadable';const keys=LINE_FIELDS.filter(k=>own(e,k));
 if(keys.length===1&&keys[0]==='supported')return e.supported===true?'pending':'unreadable';
 if(keys.length!==LINE_FIELDS.length)return 'unreadable';
 const n=LINE_SLOTS[id]??3,slots=e.slots;
 const ok=e.variant==='market'&&Array.isArray(e.shown)&&e.shown.length===4&&e.shown.every(t=>TILE_IDS.includes(t))&&new Set(e.shown).size===4&&plain(slots)&&Object.keys(slots).length===n&&Object.keys(slots).every(k=>['s1','s2','s3'].slice(0,n).includes(k)&&TILE_IDS.includes(slots[k]))&&LOAD_CODES.includes(e.load)&&str(e.text)&&strs(e.crates)&&str(e.said)&&typeof e.supported==='boolean'&&typeof e.at==='string';
 return ok?'completed':'unreadable';
}
function joinShape(e){
 if(!plain(e))return 'unreadable';const keys=JOIN_FIELDS.filter(k=>own(e,k));if(keys.length!==JOIN_FIELDS.length)return 'unreadable';
 const ok=Array.isArray(e.shown)&&e.shown.length===6&&new Set(e.shown).size===6&&e.shown.every(t=>JOIN_TILE_IDS.includes(t))&&e.shown.includes(e.mark)&&str(e.text)&&str(e.said)&&['fits','other'].includes(e.outcome)&&typeof e.supported==='boolean'&&typeof e.at==='string';
 return ok?'completed':'unreadable';
}
function itemShape(id,e){
 if(!plain(e))return 'unreadable';const keys=ITEM_FIELDS.filter(k=>own(e,k));
 if(keys.length===2&&own(e,'supported')&&own(e,'guided'))return e.supported===true&&typeof e.guided==='boolean'?'pending':'unreadable';
 if(keys.length!==ITEM_FIELDS.length)return 'unreadable';
 const tiles=TILE_ITEMS[id],shown=e.shown;
 const okShown=Array.isArray(shown)&&shown.length<=(tiles?tiles.tiles.length:3)&&shown.length>0&&new Set(shown).size===shown.length&&shown.every(x=>tiles?tiles.tiles.includes(x):['a','b','c'].includes(x));
 const okAnswer=tiles?plain(e.answer)&&Object.keys(e.answer).length===tiles.slots.length&&tiles.slots.every(k=>tiles.tiles.includes(e.answer[k])):typeof e.answer==='string'&&okShown&&shown.includes(e.answer);
 const ok=okShown&&okAnswer&&str(e.prompt)&&strs(e.offered)&&e.offered.length===shown.length&&str(e.answerText)&&strs(e.said)&&['fits','other'].includes(e.outcome)&&typeof e.supported==='boolean'&&typeof e.guided==='boolean'&&typeof e.at==='string';
 return ok?'completed':'unreadable';
}
export function manifestView(state){
 if(!own(state,'exchangeManifest'))return {status:'absent',cardsSeen:false,lists:{},items:{},joins:{}};
 const r=state.exchangeManifest;
 if(plain(r)&&own(r,'v')&&r.v!==1)return {status:'unknown',root:r,lists:{},items:{},joins:{}};
 // Items allow 278's whole catalog (25); joins are optional and hold at most 8 notes.
 if(!plain(r)||r.v!==1||typeof r.cardsSeen!=='boolean'||!plain(r.lists)||!plain(r.items)||Object.keys(r.lists).length>4||Object.keys(r.items).length>25||own(r,'joins')&&(!plain(r.joins)||Object.keys(r.joins).length>8))return {status:'malformed',root:r,lists:{},items:{},joins:{}};
 const lists={},items={},joins={};
 for(const [k,e] of Object.entries(r.lists))lists[k]={shape:own(LINE_SLOTS,k)?lineShape(k,e):'unreadable',entry:e};
 for(const [k,e] of Object.entries(r.items))items[k]={shape:ITEM_IDS.includes(k)?itemShape(k,e):'unreadable',entry:e};
 for(const [k,e] of Object.entries(r.joins??{}))joins[k]={shape:NOTE_IDS.includes(k)?joinShape(e):'unreadable',entry:e};
 return {status:'ready',root:r,cardsSeen:r.cardsSeen,lists,items,joins};
}
// Every write: clone, change only exchangeManifest, shape-check what changed, preflight the real export, commit.
function commit(state,change,options){
 const v=manifestView(state);if(v.status==='unknown'||v.status==='malformed')return false;
 if(typeof options?.canExport!=='function')return false;
 const candidate=structuredClone(state);
 if(!own(candidate,'exchangeManifest'))candidate.exchangeManifest={v:1,cardsSeen:false,lists:{},items:{}};
 const root=candidate.exchangeManifest,result=change(root);if(result===false)return false;
 const after=manifestView(candidate);if(after.status!=='ready')return false;
 for(const [kind,id] of result.touched){const x=after[kind][id];if(!x||x.shape==='unreadable')return false;}
 try{if(!options.canExport(candidate))return false;}catch{return false;}
 state.exchangeManifest=root;return result.value??true;
}
const time=options=>(options?.now?.()??new Date()).toISOString();
const ready=(state,kind,id)=>{const v=manifestView(state),x=v[kind][id];return x?.shape==='unreadable'?false:x;};
// Support exposure is saved before display. Completed entries already carry their committed flag.
export function markSupport(state,kind,id,options,{guided=false}={}){
 const x=ready(state,kind,id);if(x===false)return false;
 const v=manifestView(state);if(v.status==='unknown'||v.status==='malformed')return false;
 if(x?.shape==='completed'&&!(kind==='items'&&GUIDED_IDS.includes(id)&&guided)||x&&x.entry.supported===true&&(kind==='lists'||!guided||x.entry.guided===true))return 'noop';
 return commit(state,root=>{const map=root[kind];if(own(map,id)){map[id].supported=true;if(kind==='items'&&guided)map[id].guided=true;}else map[id]=kind==='lists'?{supported:true}:{supported:true,guided};return {touched:[[kind,id]]};},options);
}
export function markCardsSeen(state,options){
 const v=manifestView(state);if(v.status==='unknown'||v.status==='malformed')return false;if(v.cardsSeen)return 'noop';
 return commit(state,root=>{root.cardsSeen=true;return {touched:[]};},options);
}
const supportedFor=(v,x)=>v.cardsSeen===true||x?.shape==='completed'||x?.entry?.supported===true;
// snapshot is the line as rendered; a Load it never consults today's catalog.
export function loadLine(state,snapshot,slots,options){
 if(!filled(snapshot,slots))return false;const x=ready(state,'lists',snapshot.id);if(x===false)return false;
 const v=manifestView(state),shown=[...TILE_IDS],picked=Object.fromEntries(lineSlots(snapshot).map(k=>[k,slots[k]]));
 const load=loadCode(snapshot,picked),crates=readLine(snapshot,picked),entry={variant:'market',shown,slots:picked,load,text:punctuate(snapshot.lead,snapshot.parts,picked),crates,said:snapshot.said[load],supported:supportedFor(v,x),at:time(options)};
 return commit(state,root=>{const old=root.lists[snapshot.id];root.lists[snapshot.id]=plain(old)?{...old,...entry}:entry;return {touched:[['lists',snapshot.id]],value:entry};},options);
}
export function answerItem(state,snapshot,answer,options){
 const x=ready(state,'items',snapshot.id);if(x===false)return false;
 const tiles=snapshot.kind==='tiles',gaps=tiles?(snapshot.accept?['s1']:['s1','s2','s3']):[];
 if(tiles?!gaps.every(k=>snapshot.tiles.includes(answer?.[k])):!snapshot.choices.some(c=>c.id===answer))return false;
 const v=manifestView(state),{outcome,said}=itemFeedback(snapshot,answer),guided=snapshot.guided===true||x?.entry?.guided===true;
 const shown=tiles?[...snapshot.tiles]:snapshot.choices.map(c=>c.id),offered=tiles?snapshot.tiles.map(t=>snapshot.tileNames[t]):snapshot.choices.map(c=>c.text);
 const answerText=tiles?(snapshot.accept?joinText(snapshot.first,answer.s1,snapshot.second):strip(punctuate(snapshot.lead,snapshot.parts,answer))):snapshot.choices.find(c=>c.id===answer).text;
 const entry={shown,answer:tiles?Object.fromEntries(gaps.map(k=>[k,answer[k]])):answer,prompt:itemPrompt(snapshot),offered,answerText,said,outcome,supported:guided||supportedFor(v,x),guided,at:time(options)};
 return commit(state,root=>{const old=root.items[snapshot.id];root.items[snapshot.id]=plain(old)?{...old,...entry}:entry;return {touched:[['items',snapshot.id]],value:entry};},options);
}
// Read it on one of Dot's notes. snapshot is the note as rendered, with today's Read it lines frozen in.
export function readNote(state,snapshot,mark,options){
 if(!JOIN_TILE_IDS.includes(mark))return false;const x=ready(state,'joins',snapshot.id);if(x===false)return false;
 const v=manifestView(state),code=readCode(snapshot,mark);
 const entry={shown:[...JOIN_TILE_IDS],mark,text:joinText(snapshot.first,mark,snapshot.second),said:snapshot.said[code],outcome:noteFits(snapshot,mark)?'fits':'other',supported:supportedFor(v,x),at:time(options)};
 return commit(state,root=>{if(!own(root,'joins'))root.joins={};const old=root.joins[snapshot.id];root.joins[snapshot.id]=plain(old)?{...old,...entry}:entry;return {touched:[['joins',snapshot.id]],value:entry};},options);
}
