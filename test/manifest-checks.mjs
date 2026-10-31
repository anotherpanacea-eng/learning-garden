// Spec 319 source checks: Pip's read rule, Load it order, set A, saved strings, structural validation and copy.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MANIFEST_TEXT as T,MANIFEST_LINES,MANIFEST_ITEMS} from '../dist/manifest-content.mjs';
import {TILE_IDS,readLine,loadCode,punctuate,whatFits,itemFeedback,manifestView,markSupport,markCardsSeen,loadLine,answerItem} from '../dist/manifest-core.mjs';
import {manifestNotes,manifestPage,resetManifestView} from '../dist/manifest-ui.mjs';
import {scanCopySource} from '../scripts/check-child-copy.mjs';
const readText=url=>readFileSync(new URL(url,import.meta.url),'utf8').replace(/\r\n/g,'\n');
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;};
const L=Object.fromEntries(MANIFEST_LINES.map(l=>[l.id,l])),I=Object.fromEntries(MANIFEST_ITEMS.map(i=>[i.id,i]));
const lineSnap=l=>structuredClone({...l,said:{...T.load}}),itemSnap=i=>structuredClone({...i,tileNames:{...T.tiles}});
const options={canExport:()=>true,now:()=>new Date('2026-10-31T12:00:00Z')};
const slotsOf=l=>l.parts.filter(p=>p.slot).map(p=>p.slot);
function* patterns(l){const ids=slotsOf(l);for(let k=0;k<4**ids.length;k++)yield Object.fromEntries(ids.map((id,i)=>[id,TILE_IDS[Math.floor(k/4**i)%4]]));}

// An independent string reading of the rule: split the punctuated text itself.
function oracle(l,s){
 if(s.s1==='semicolon'||l.kind==='weNeed'&&s.s1==='colon')return [];
 const text=punctuate(l.lead,l.parts,s).slice(0,-1),rest=text.slice(l.lead.length),semi=['s2','s3'].some(k=>s[k]==='semicolon');
 const body=s.s1==='colon'?rest.slice(1):s.s1==='empty'&&l.kind==='weNeed'?rest:text;
 return (semi?body.split(';'):body.split(/,| and /)).map(x=>x.trim().replace(/^and\b\s*/,'').toLowerCase()).filter(Boolean);
}
function loadOracle(l,s){const fit=slotsOf(l).every(k=>l.fits[k].includes(s[k]));return s.s1==='semicolon'?'semicolon-lead':l.kind==='weNeed'&&s.s1==='colon'?'colon-cut':fit?'fits':l.kind!=='weNeed'&&s.s1==='empty'?'lead-merged':l.kind==='big'&&(s.s2==='comma'||s.s3==='comma')?'loads-merged':'as-it-stands';}
let total=0;
for(const l of MANIFEST_LINES)for(const s of patterns(l)){total++;const c=readLine(l,s);eq(c,oracle(l,s),`${l.id} ${JSON.stringify(s)} crates`);ok(c.length<=7,'at most seven crates');eq(loadCode(l,s),loadOracle(l,s),`${l.id} ${JSON.stringify(s)} load`);}
eq(total,64*3+4,'every tile pattern for every line');
eq(whatFits(L.m1),['lead','short']);eq(whatFits(L.m2),['lead','big']);eq(whatFits(L.m3),['lead','big']);eq(whatFits(L.m4),['weNeed']);
// The spec's example table.
const fit2={s1:'colon',s2:'semicolon',s3:'semicolon'};
eq(readLine(L.m2,fit2),['flour, two sacks','eggs, one dozen','butter, one block']);
eq(readLine(L.m2,{...fit2,s2:'comma',s3:'comma'}),['flour','two sacks','eggs','one dozen','butter','one block'],'the one dozen joke: six crates');
eq(readLine(L.m2,{...fit2,s3:'empty'}),['flour, two sacks','eggs, one dozen and butter, one block']);
eq(readLine(L.m1,{s1:'colon',s2:'comma',s3:'empty'}).length,3);eq(readLine(L.m4,{s1:'empty'}),['flour','eggs','oats']);
eq(readLine(L.m2,{s1:'comma',s2:'comma',s3:'comma'}).length,7);eq(readLine(L.m3,{s1:'empty',...{s2:'semicolon',s3:'semicolon'}})[0],'the cart stops at three places the mill, at nine');
eq(punctuate(L.m3.lead,L.m3.parts,fit2),'The cart stops at three places: the mill, at nine; the bakery, at ten; and the café, at noon.');
eq(T.crates(0,[]),'Pip loads no crates.');eq(T.crates(3,['a','b','c']),'Pip loads 3 crates: a · b · c.');

// Set A: order, feedback and every A3 pattern.
eq(MANIFEST_ITEMS.map(i=>i.id),['A1','A2','A3','A4']);
for(const [id,at] of [['A1',0],['A2',1],['A4',2]]){const i=I[id],lens=i.choices.map(c=>c.text.length),fit=i.choices.findIndex(c=>c.id===i.fits);eq(fit,at,id+' fitting position');ok(!(lens[fit]===Math.max(...lens)&&lens.filter(x=>x===lens[fit]).length===1),id+' fitting choice is never the single longest');
 for(const c of i.choices)eq(itemFeedback(i,c.id),c.id===i.fits?{outcome:'fits',said:[i.explanation]}:{outcome:'other',said:[c.feedback,i.explanation]});}
for(const s1 of I.A3.tiles)for(const s2 of I.A3.tiles)for(const s3 of I.A3.tiles){const a={s1,s2,s3},f=itemFeedback(I.A3,a),fits=s1==='colon'&&s2==='semicolon'&&s3==='semicolon',lines=[s2==='comma'&&I.A3.commaFeedback.s2,s3==='comma'&&I.A3.commaFeedback.s3].filter(Boolean);
 eq(f,fits?{outcome:'fits',said:[I.A3.explanation]}:{outcome:'other',said:[...(lines.length?lines:[I.A3.hint]),I.A3.explanation]},'A3 '+JSON.stringify(a));}

// Saved work.
const fresh=()=>({garden:{},other:{kept:true}});
{const s=fresh(),before=structuredClone(s);eq(manifestView(s).status,'absent');manifestNotes(s);eq(s,before,'readers write nothing');ok(!Object.hasOwn(s,'exchangeManifest'),'absent until the first write');
 const e=loadLine(s,lineSnap(L.m1),{s1:'colon',s2:'comma',s3:'comma'},options);
 eq(Object.keys(s.exchangeManifest),['v','cardsSeen','lists','items']);eq(s.exchangeManifest.v,1);eq(s.exchangeManifest.cardsSeen,false);eq(s.other,{kept:true},'other roots untouched');
 eq(e,{variant:'market',shown:['colon','semicolon','comma','empty'],slots:{s1:'colon',s2:'comma',s3:'comma'},load:'fits',text:'The miller sells three things: flour, oats, and bran.',crates:['flour','oats','bran'],said:T.load.fits,supported:false,at:'2026-10-31T12:00:00.000Z'});
 eq(s.exchangeManifest.lists.m1,e);eq(loadLine(s,lineSnap(L.m1),{s1:'empty',s2:'comma',s3:'comma'},options).supported,true,'a later attempt carries the feedback it has seen');
 eq(loadLine(s,lineSnap(L.m4),{s1:'colon'},options).crates,[],'colon cut');ok(loadLine(s,lineSnap(L.m2),{s1:'colon'},options)===false,'Load it needs every slot');
 eq(markCardsSeen(s,options),true);eq(markCardsSeen(s,options),'noop');eq(loadLine(s,lineSnap(L.m3),fit2,options).supported,true,'teach cards seen mark every later entry');}
{const s=fresh();eq(markSupport(s,'items','A1',options,{guided:true}),true);eq(s.exchangeManifest.items.A1,{supported:true,guided:true},'A1 pending before its steps');eq(markSupport(s,'items','A1',options,{guided:true}),'noop');
 const e=answerItem(s,itemSnap(I.A1),'a',options);eq([e.outcome,e.supported,e.guided],['fits',true,true]);eq(e.prompt,'We need three things ___ apples, reed and honey.\nWhich mark fits the gap?');eq(e.offered,['A colon','A semicolon','No mark at all']);eq(e.answerText,'A colon');
 eq(markSupport(s,'items','A1',options,{guided:true}),'noop','completed A1 keeps its answer');eq(s.exchangeManifest.items.A1,e);
 eq(answerItem(s,itemSnap(I.A2),'a',options).supported,false,'no support before a first answer');eq(markSupport(s,'items','A4',options),true);eq(answerItem(s,itemSnap(I.A4),'c',options).supported,true,'ladder before answering is recorded');
 const a3=answerItem(s,itemSnap(I.A3),{s1:'colon',s2:'comma',s3:'semicolon',extra:'x'},options);eq(a3.answer,{s1:'colon',s2:'comma',s3:'semicolon'});eq(a3.answerText,'The cart carries three loads: apples, six baskets, honey cake, two boxes; and seeds, one tin.');eq(a3.offered,['colon ( : )','semicolon ( ; )','comma ( , )']);eq(a3.shown,['colon','semicolon','comma']);
 ok(answerItem(s,itemSnap(I.A2),'z',options)===false,'unknown choice refused');}
// Reopening completed A1 upgrades flags only; unreadable A1 stays exact.
{const state=fresh();answerItem(state,itemSnap(I.A1),'c',options);
 const e=state.exchangeManifest.items.A1;e.supported=false;e.guided=false;e.prompt='Earlier\nquestion';e.said=['Earlier\nfeedback'];e.future={kept:true};const before=structuredClone(e);
 eq(markSupport(state,'items','A1',options,{guided:true}),true);
 eq(state.exchangeManifest.items.A1,{...before,supported:true,guided:true},'completed A1 preserves answer and frozen strings');
 eq(markSupport(state,'items','A1',options,{guided:true}),'noop');
 state.exchangeManifest.items.A1={opaque:'unreadable'};const bad=structuredClone(state);
 eq(markSupport(state,'items','A1',options,{guided:true}),false);eq(state,bad,'unreadable A1 untouched');}
// A changed answer rule with the same choice ids: the saved outcome stays; Try again scores today's snapshot.
{const s=fresh(),old=itemSnap(I.A2);answerItem(s,old,'b',options);const saved=structuredClone(s.exchangeManifest.items.A2),today=itemSnap(I.A2);today.fits='c';today.prompt='Today’s wording.';today.choices[1].feedback='Today’s feedback.';
 eq(manifestView(s).items.A2.entry,saved);eq(s.exchangeManifest.items.A2.outcome,'fits','earlier outcome never rescored');
 const e=answerItem(s,today,'b',options);eq([e.outcome,e.prompt],['other','Today’s wording.']);const notes=manifestNotes(s);ok(notes.includes('Today’s wording.')&&!notes.includes('Which sentence'),'Notes render the saved strings');}
// Structural validation.
const shape=(root,kind,id)=>manifestView({exchangeManifest:root})[kind][id]?.shape;
const base={v:1,cardsSeen:false,lists:{},items:{}},complete=()=>{const s=fresh();loadLine(s,lineSnap(L.m1),{s1:'colon',s2:'comma',s3:'comma'},options);answerItem(s,itemSnap(I.A2),'b',options);answerItem(s,itemSnap(I.A3),fit2,options);return s.exchangeManifest;};
{const r=complete();eq(shape(r,'lists','m1'),'completed');eq(shape(r,'items','A2'),'completed');eq(shape(r,'items','A3'),'completed');
 const bad=[[e=>({supported:true,load:'fits'}),'lists'],[e=>({...e,text:7}),'lists'],[e=>({...e,crates:Array(9).fill('a')}),'lists'],[e=>({...e,said:'x'.repeat(401)}),'lists'],[e=>({...e,load:'great'}),'lists'],[e=>({...e,slots:{s1:'colon'}}),'lists'],[e=>({...e,shown:['colon','colon','comma','empty']}),'lists'],[e=>({supported:false}),'lists'],[e=>[],'lists']];
 for(const [f,kind] of bad){const x=structuredClone(r);x.lists.m1=f(x.lists.m1);eq(shape(x,kind,'m1'),'unreadable',JSON.stringify(x.lists.m1).slice(0,60));}
 const badItems=[e=>({...e,offered:['one']}),e=>({...e,answer:'c',shown:['a','b']}),e=>({...e,said:'text'}),e=>({...e,outcome:'right'}),e=>({...e,guided:'no'}),e=>({supported:true}),e=>({...e,answerText:'é'.repeat(401)})];
 for(const f of badItems){const x=structuredClone(r);x.items.A2=f(x.items.A2);eq(shape(x,'items','A2'),'unreadable',JSON.stringify(x.items.A2).slice(0,60));}
 const x=structuredClone(r);x.items.A3.answer={s1:'colon',s2:'empty',s3:'comma'};eq(shape(x,'items','A3'),'unreadable','A3 tiles have no empty');
 const y=structuredClone(r);y.lists.m1.future={bench:'b'};eq(shape(y,'lists','m1'),'completed','additive field allowed');
 // Writes keep additive fields and unreadable siblings exact.
 const s={exchangeManifest:structuredClone(y)};s.exchangeManifest.items.A4=['opaque'];const sib=structuredClone(s.exchangeManifest.items.A4);loadLine(s,lineSnap(L.m1),{s1:'colon',s2:'comma',s3:'empty'},options);eq(s.exchangeManifest.lists.m1.future,{bench:'b'});eq(s.exchangeManifest.items.A4,sib);
 ok(answerItem(s,itemSnap(I.A4),'c',options)===false,'unreadable entry turns read-only');ok(markSupport(s,'items','A4',options)===false,'no support over an unreadable entry');eq(s.exchangeManifest.items.A4,sib);}
for(const [root,status] of [[{v:2,anything:true},'unknown'],[{v:1,cardsSeen:'no',lists:{},items:{}},'malformed'],[{v:1,cardsSeen:false,lists:[],items:{}},'malformed'],[[],'malformed'],[{cardsSeen:false,lists:{},items:{}},'malformed'],[{...base,lists:{m1:{},m2:{},m3:{},m4:{},m5:{}}},'malformed']]){
 const s={exchangeManifest:structuredClone(root)},before=structuredClone(s);eq(manifestView(s).status,status,JSON.stringify(root));
 for(const w of [()=>loadLine(s,lineSnap(L.m4),{s1:'empty'},options),()=>markCardsSeen(s,options),()=>markSupport(s,'items','A1',options,{guided:true}),()=>answerItem(s,itemSnap(I.A2),'b',options)])ok(w()===false,'no write into '+status);eq(s,before,status+' root stays exact');ok(manifestNotes(s).length>0,'Notes still shows it');}
// Preflight refusal and pure readers.
for(const canExport of [()=>false,()=>{throw Error('preflight');},undefined]){const s={exchangeManifest:complete()},before=structuredClone(s),ref=s.exchangeManifest;
 for(const w of [()=>loadLine(s,lineSnap(L.m4),{s1:'empty'},{canExport}),()=>markCardsSeen(s,{canExport}),()=>markSupport(s,'items','A1',{canExport},{guided:true}),()=>answerItem(s,itemSnap(I.A1),'a',{canExport})])ok(w()===false,'refused preflight');eq(s,before);ok(s.exchangeManifest===ref,'refusal keeps the same root');}
{const s={exchangeManifest:complete()},before=structuredClone(s);manifestView(s);manifestNotes(s);eq(s,before,'Notes and view are pure');}

// Every saved readout retains newlines as displayed text.
{const state={exchangeManifest:complete()},r=state.exchangeManifest;
 r.lists.m1.text='Saved\nline';r.lists.m1.crates=['Saved\ncrate'];r.lists.m1.said='Saved\nload';
 for(const e of Object.values(r.items)){e.prompt='Saved\nprompt';e.offered=e.offered.map(()=> 'Saved\nchoice');e.answerText='Saved\nanswer';e.said=['Saved\nfeedback'];}
 resetManifestView();const notes=manifestNotes(state),page=manifestPage(state,'newlines');
 for(const html of [notes,page])for(const m of html.matchAll(/<([a-z]+)([^>]*)>(Saved\n[^<]*)<\/\1>/g))ok(m[2].includes('mf-frozen'),'saved text has newline-preserving class: '+m[3]);
 ok(notes.includes('Saved\nline')&&notes.includes('Saved\nanswer'),'Notes keeps frozen line breaks');
 ok(page.includes('Saved\nload'),'resumed line keeps frozen feedback');
 ok(/\.mf-frozen\s*\{[^}]*white-space:\s*pre-line/.test(readText('../dist/manifest.css')),'frozen class preserves line breaks');
 const ui=readText('../dist/manifest-ui.mjs');ok(ui.includes('class="mf-prompt mf-frozen"')&&ui.includes('class="mf-chosen mf-frozen"')&&ui.includes('class="mf-said mf-frozen"'),'resumed item frozen fields preserve line breaks');}

// Copy: every shipped string comes from the companion (print rule), the spec's exact exceptions or the trimmed panel.
const companion=readText('../docs/content/278-exchange-manifest-text.md'),spec=readText('../docs/specs/319-market-list-marks.md');
const straight=x=>x.replace(/[“”]/g,'"').replace(/[‘’]/g,"'"),flat=x=>straight(x).replace(/\s+/g,' ');
const exceptionRows=[...spec.slice(spec.indexOf('**Wording outside the companion'),spec.indexOf('Before build, a script')).matchAll(/^\| [^|]+ \| (.+) \|$/gm)].map(m=>m[1]).filter(x=>x!=='Exact text'&&!/^-+$/.test(x));
const slotException=exceptionRows.find(r=>r.startsWith('Gap {n}'));
 eq(slotException,`Gap {n} (n is 1 to 3), followed by ", " and the chosen tile's name once chosen`,'slot exception defines the actual separator');
// Audit labels generated by the real renderer, before and after each possible tile.
for(const tile of [null,...TILE_IDS]){
 const state=fresh();if(tile)loadLine(state,lineSnap(L.m1),{s1:tile,s2:tile,s3:tile},options);
 resetManifestView();const html=manifestPage(state,'copy-audit');
 const labels=[...html.matchAll(/data-mf-slot="([^"]+)" aria-label="([^"]+)"/g)];eq(labels.length,10,'every generated bench slot label audited');
 for(const [,id,label] of labels){const [owner,slot]=id.split(':'),number=Number(slot.slice(1));const expected=slotException.split(' (n is')[0].replace('{n}',number)+(owner==='m1'&&tile?`, ${T.tiles[tile]}`:'');eq(label,expected,'generated slot label expands spec exception: '+id);}
}
const panel=spec.slice(spec.indexOf('**Grown-up panel, exact text**'),spec.indexOf('**Wording outside')).split('\n').filter(x=>x.startsWith('> ')&&x.length>2).map(x=>x.slice(2));
const companionFlat=flat(companion.replace(/^> /gm,''));
const fromCompanion=x=>companionFlat.includes(flat(x))||companionFlat.includes(flat(x).replace(/\*/g,''));
const strings=[];const walk=v=>{if(typeof v==='string')strings.push(v);else if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object')Object.values(v).forEach(walk);};
walk(Object.fromEntries(Object.entries(T).filter(([k])=>!['crates','grownUp','cards'].includes(k))));
const cardStrings=[];T.cards.forEach(c=>{cardStrings.push(c.title.replace(/^Card \d\. /,''),c.text,c.example,...c.steps);});
const itemStrings=[];MANIFEST_ITEMS.forEach(i=>{for(const k of ['card','prompt','hint','explanation'])if(i[k])itemStrings.push(i[k]);(i.steps||[]).forEach(x=>itemStrings.push(x));(i.choices||[]).forEach(c=>{itemStrings.push(c.text);if(c.feedback)itemStrings.push(c.feedback);});Object.values(i.commaFeedback||{}).forEach(x=>itemStrings.push(x));});
const exception=x=>exceptionRows.some(r=>straight(r)===straight(x));
for(const x of [...strings,...cardStrings,...itemStrings].filter(Boolean)){if(['m1','m2','m3','m4'].includes(x))continue;ok(fromCompanion(x)||exception(x),'shipped string has a source: '+x);ok(!/["']/.test(x),'print rule applied: '+x);}
eq(T.grownUp.map(flat),panel.map(flat),'grown-up panel is the spec’s exact trimmed text');
for(const l of MANIFEST_LINES){let i=0;const template=`${l.lead}${l.parts.map(p=>p.slot?` [${++i}]`:p.fixed?p.fixed:p.and?' and':' '+p.t).join('')}.`;ok(companionFlat.includes(template),'line template is the companion’s: '+template);}
{let i=0;const a3=`*${I.A3.lead}${I.A3.parts.map(p=>p.slot?` [${++i}]`:p.fixed?p.fixed:p.and?' and':' '+p.t).join('')}.*`;ok(companionFlat.includes(a3),'A3 card is the companion’s');}
const card1=T.cards[0],lead=card1.example.replace(/\*/g,'').split(':')[0]+'.';ok(card1.steps[0].includes(`“${lead}”`),'card 1 step 1 quotes the visible market lead-in');ok(![...strings,...cardStrings,...itemStrings].some(x=>x.includes('We send three things up the river.')),'manifest-version step 1 is not shipped');
const shipped=[...strings,...cardStrings,...itemStrings,...T.grownUp];
for(const x of shipped){ok(!/Vadoalto|Nuria|Hollis|high ford|\bpage\b/i.test(x),'no place or page beyond the market: '+x);ok(!x.includes('—'),'no em-dash: '+x);}
eq(scanCopySource(shipped.filter(x=>!T.grownUp.includes(x)).join('\n')),[],'child-copy terms');
console.log(`Exchange Manifest market list: ${n} checks passed (${total} tile patterns).`);
