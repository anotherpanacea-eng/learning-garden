// Spec 319 source checks: Pip's read rule, Load it order, set A, saved strings, structural validation and copy.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MANIFEST_TEXT as T,MANIFEST_LINES,MANIFEST_ITEMS,JOIN_NOTES,JOIN_ITEMS,CRATE_TEXT as K,CRATE_TITLES,TITLE_ITEMS} from '../dist/manifest-content.mjs';
import {TILE_IDS,JOIN_TILE_IDS,readLine,loadCode,punctuate,whatFits,itemFeedback,manifestView,markSupport,markCardsSeen,loadLine,answerItem,readNote,readCode,joinText,CRATE_TILE_IDS,crateCode,chooseTitle} from '../dist/manifest-core.mjs';
import {manifestNotes,manifestPage,resetManifestView} from '../dist/manifest-ui.mjs';
import {scanCopySource} from '../scripts/check-child-copy.mjs';
const readText=url=>readFileSync(new URL(url,import.meta.url),'utf8').replace(/\r\n/g,'\n');
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;};
const L=Object.fromEntries(MANIFEST_LINES.map(l=>[l.id,l])),I=Object.fromEntries(MANIFEST_ITEMS.map(i=>[i.id,i]));
const lineSnap=l=>structuredClone({...l,said:{...T.load}}),itemSnap=i=>structuredClone({...i,tileNames:{...T.tiles,...T.joinTiles}});
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
const companion=readText('../docs/content/278-exchange-manifest-text.md'),spec=readText('../docs/specs/319-market-list-marks.md'),spec329=readText('../docs/specs/329-joining-dots-notes.md');
const straight=x=>x.replace(/[“”]/g,'"').replace(/[‘’]/g,"'"),flat=x=>straight(x).replace(/\s+/g,' ');
const rowsOf=text=>[...text.matchAll(/^\| [^|]+ \| (.+) \|$/gm)].map(m=>m[1]).filter(x=>x!=='Exact text'&&!/^-+$/.test(x));
const exceptionRows=rowsOf(spec.slice(spec.indexOf('**Wording outside the companion'),spec.indexOf('Before build, a script')));
const exceptionRows329=rowsOf(spec329.slice(spec329.indexOf('**Wording outside the companion'),spec329.indexOf("319's exceptions")));
const slotException=exceptionRows.find(r=>r.startsWith('Gap {n}'));
 eq(slotException,`Gap {n} (n is 1 to 3), followed by ", " and the chosen tile's name once chosen`,'slot exception defines the actual separator');
// Audit labels generated by the real renderer, before and after each possible tile.
for(const tile of [null,...TILE_IDS]){
 const state=fresh();if(tile)loadLine(state,lineSnap(L.m1),{s1:tile,s2:tile,s3:tile},options);
 resetManifestView();const html=manifestPage(state,'copy-audit');
 const labels=[...html.matchAll(/data-mf-slot="(m[^"]+)" aria-label="([^"]+)"/g)];eq(labels.length,10,'every generated bench slot label audited');
 for(const [,id,label] of labels){const [owner,slot]=id.split(':'),number=Number(slot.slice(1));const expected=slotException.split(' (n is')[0].replace('{n}',number)+(owner==='m1'&&tile?`, ${T.tiles[tile]}`:'');eq(label,expected,'generated slot label expands spec exception: '+id);}
}
// Spec 349's panel replaces 329's and covers all three benches.
const spec349=readText('../docs/specs/349-book-crate.md');
const panel=spec349.slice(spec349.indexOf('**Grown-up panel, exact text.**'),spec349.indexOf('**Wording outside')).split('\n').filter(x=>x.startsWith('> ')&&x.length>2).map(x=>x.slice(2));
const companionFlat=flat(companion.replace(/^> /gm,''));
const fromCompanion=x=>companionFlat.includes(flat(x))||companionFlat.includes(flat(x).replace(/\*/g,''));
const strings=[];const walk=v=>{if(typeof v==='string')strings.push(v);else if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object')Object.values(v).forEach(walk);};
walk(Object.fromEntries(Object.entries(T).filter(([k])=>!['crates','grownUp','cards','joinCards'].includes(k))));
const cardStrings=[];[...T.cards,...T.joinCards].forEach(c=>{cardStrings.push(c.title.replace(/^Card \d\. /,''),c.text,c.example,...c.steps);});
const itemStrings=[];[...MANIFEST_ITEMS,...JOIN_ITEMS].forEach(i=>{for(const k of ['card','prompt','hint','explanation'])if(i[k])itemStrings.push(i[k]);(i.steps||[]).forEach(x=>itemStrings.push(x));(i.choices||[]).forEach(c=>{itemStrings.push(c.text);if(c.feedback)itemStrings.push(c.feedback);});Object.values(i.commaFeedback||{}).forEach(x=>itemStrings.push(x));Object.values(i.tileFeedback||{}).forEach(x=>itemStrings.push(x));});
const exception=x=>[...exceptionRows,...exceptionRows329].some(r=>straight(r)===straight(x));
for(const x of [...strings,...cardStrings,...itemStrings].filter(Boolean)){if(['m1','m2','m3','m4'].includes(x))continue;ok(fromCompanion(x)||exception(x),'shipped string has a source: '+x);ok(!/["']/.test(x),'print rule applied: '+x);}
eq(T.grownUp.map(flat),panel.map(flat),'grown-up panel is the spec’s exact trimmed text');
for(const l of MANIFEST_LINES){let i=0;const template=`${l.lead}${l.parts.map(p=>p.slot?` [${++i}]`:p.fixed?p.fixed:p.and?' and':' '+p.t).join('')}.`;ok(companionFlat.includes(template),'line template is the companion’s: '+template);}
{let i=0;const a3=`*${I.A3.lead}${I.A3.parts.map(p=>p.slot?` [${++i}]`:p.fixed?p.fixed:p.and?' and':' '+p.t).join('')}.*`;ok(companionFlat.includes(a3),'A3 card is the companion’s');}
const card1=T.cards[0],lead=card1.example.replace(/\*/g,'').split(':')[0]+'.';ok(card1.steps[0].includes(`“${lead}”`),'card 1 step 1 quotes the visible market lead-in');ok(![...strings,...cardStrings,...itemStrings].some(x=>x.includes('We send three things up the river.')),'manifest-version step 1 is not shipped');
const shipped=[...strings,...cardStrings,...itemStrings,...T.grownUp];
for(const x of shipped){ok(!/Vadoalto|Nuria|Hollis|high ford|\bpage\b/i.test(x),'no place or page beyond the market: '+x);ok(!x.includes('—'),'no em-dash: '+x);}
eq(scanCopySource(shipped.filter(x=>!T.grownUp.includes(x)).join('\n')),[],'child-copy terms');

// Spec 329: Joining Dot's Notes and set C.
const N=Object.fromEntries(JOIN_NOTES.map(x=>[x.id,x])),C=Object.fromEntries(JOIN_ITEMS.map(i=>[i.id,i]));
const noteSnap=x=>structuredClone({...x,said:{...T.read}});
eq(JOIN_TILE_IDS,['period','semicolon','colon','dash','comma','nothing'],'tile order');
for(const x of JOIN_NOTES)ok(companionFlat.includes(`${x.first} [ ] ${x.second}`),'note template is the companion’s: '+x.id);
// An independent reading of the accepted table and the Read it order (spec 329), for all 30 pairs.
const accepted={n1:['period','semicolon','dash'],n2:['period','semicolon','colon','dash'],n3:['period','semicolon','dash'],n4:['comma','nothing'],n5:['period','semicolon','colon','dash']};
const readOracle=(id,m)=>id==='n4'?(['period','semicolon','colon','dash'].includes(m)?'because-alone':m==='nothing'?'because-usually':'because-comma'):m==='comma'?'comma-alone':m==='nothing'?'crash':m==='colon'&&['n1','n3'].includes(id)?'explain':m;
const sep={period:'. ',semicolon:'; ',colon:': ',dash:' – ',comma:', ',nothing:' '};
let pairs=0,fitsCount=0;
for(const x of JOIN_NOTES)for(const m of JOIN_TILE_IDS){pairs++;const s=fresh(),e=readNote(s,noteSnap(x),m,options),code=readOracle(x.id,m);
 eq(readCode(x,m),code,`${x.id} ${m} code`);eq(e.said,T.read[code],`${x.id} ${m} line`);eq(e.outcome,accepted[x.id].includes(m)?'fits':'other',`${x.id} ${m} outcome`);if(e.outcome==='fits')fitsCount++;
 const second=m==='period'?x.second[0].toUpperCase()+x.second.slice(1):x.second;eq(e.text,x.first+sep[m]+second,`${x.id} ${m} text`);
 eq(e.shown,JOIN_TILE_IDS);eq(e.mark,m);eq(e.supported,false);eq(s.exchangeManifest.joins[x.id],e);}
eq([pairs,fitsCount],[30,16],'every note and tile; 16 accepted');
eq(joinText(N.n3.first,'period',N.n3.second),'We packed two honey cakes. Pip ate one.');eq(joinText(N.n4.first,'period',N.n4.second),'Because the river path floods. We take the bridge road.');
ok(readNote(fresh(),noteSnap(N.n1),'empty',options)===false,'list tiles are not join tiles');
// Support: a later Read it carries the line already seen; cards seen mark every later entry.
{const s=fresh();eq(readNote(s,noteSnap(N.n1),'comma',options).supported,false);eq(readNote(s,noteSnap(N.n1),'semicolon',options).supported,true);
 eq(readNote(s,noteSnap(N.n2),'colon',options).supported,false);markCardsSeen(s,options);eq(readNote(s,noteSnap(N.n3),'dash',options).supported,true);
 eq(Object.keys(s.exchangeManifest),['v','cardsSeen','lists','items','joins'],'joins added only by a Read it');}
{const s=fresh();loadLine(s,lineSnap(L.m1),{s1:'colon',s2:'comma',s3:'comma'},options);ok(!Object.hasOwn(s.exchangeManifest,'joins'),'a Load it adds no joins map');}
// Frozen strings: a later wording change never rewrites a saved Read it.
{const s=fresh(),old=noteSnap(N.n2);readNote(s,old,'colon',options);const saved=structuredClone(s.exchangeManifest.joins.n2),today=noteSnap(N.n2);today.said.colon='Today’s line.';today.second='today’s words.';
 eq(manifestView(s).joins.n2.entry,saved);const notes=manifestNotes(s);ok(notes.includes(T.read.colon)&&!notes.includes('Today’s line.'),'Notes render the saved join strings');ok(notes.includes(T.joinNotesHeading),'Notes subheading');
 const e=readNote(s,today,'colon',options);eq([e.said,e.text],['Today’s line.','The bridge is closed: today’s words.']);}
// Set C: positions, not-single-longest, feedback.
eq(JOIN_ITEMS.map(i=>i.id),['C1','C2','C3','C4','C5']);
for(const [id,at] of [['C1',1],['C2',2],['C3',0],['C4',1]]){const i=C[id],lens=i.choices.map(c=>c.text.length),fit=i.choices.findIndex(c=>c.id===i.fits);eq(fit,at,id+' fitting position');ok(!(lens[fit]===Math.max(...lens)&&lens.filter(x=>x===lens[fit]).length===1),id+' fitting choice is never the single longest');
 for(const c of i.choices)eq(itemFeedback(i,c.id),c.id===i.fits?{outcome:'fits',said:[i.explanation]}:{outcome:'other',said:[c.feedback,i.explanation]});}
for(const t of C.C5.tiles){const f=itemFeedback(C.C5,{s1:t}),fits=['semicolon','dash','period'].includes(t);eq(f,fits?{outcome:'fits',said:[C.C5.explanation]}:{outcome:'other',said:[C.C5.tileFeedback[t],C.C5.explanation]},'C5 '+t);}
{const s=fresh();eq(markSupport(s,'items','C1',options,{guided:true}),true);eq(s.exchangeManifest.items.C1,{supported:true,guided:true},'C1 pending before its steps');
 const c1=answerItem(s,itemSnap(C.C1),'b',options);eq([c1.outcome,c1.supported,c1.guided],['fits',true,true]);eq(c1.prompt,'The river path is fast ___ the bridge road is dry.\nWhich mark can join these two whole sentences?');
 eq(answerItem(s,itemSnap(C.C2),'a',options).prompt,'Which sentence uses its semicolon correctly?','C2 has no card');
 eq(answerItem(s,itemSnap(C.C4),'b',options).prompt,'We packed two honey cakes. Pip ate one.\nJoin them with a dash. Which is right?','C4 freezes its card');
 const c5=answerItem(s,itemSnap(C.C5),{s1:'period',s2:'colon'},options);eq(c5.answer,{s1:'period'});eq(c5.answerText,'The bridge road is slow. It is always dry.');eq(c5.shown,['period','semicolon','colon','dash','comma']);eq(c5.offered,['period ( . )','semicolon ( ; )','colon ( : )','dash ( – )','comma ( , )']);eq(c5.outcome,'fits');
 eq(answerItem(s,itemSnap(C.C5),{s1:'dash'},options).answerText,'The bridge road is slow – it is always dry.');eq(answerItem(s,itemSnap(C.C5),{s1:'colon'},options).outcome,'other');
 ok(answerItem(s,itemSnap(C.C5),{s1:'nothing'},options)===false,'C5 has no nothing tile');ok(answerItem(s,itemSnap(C.C5),{},options)===false,'C5 needs its gap');
 eq(Object.keys(s.exchangeManifest.items),['C1','C2','C4','C5']);for(const id of ['C1','C2','C4','C5'])eq(manifestView(s).items[id].shape,'completed',id+' completed shape');
 const notes=manifestNotes(s);ok(notes.includes('The bridge road is slow: it is always dry.'),'Notes show C5’s saved answer');}
// Validation: joins, the wider item bound and older shapes.
{const s=fresh();readNote(s,noteSnap(N.n1),'semicolon',options);const r=s.exchangeManifest;
 const bad=[e=>({...e,shown:e.shown.slice(1)}),e=>({...e,shown:[...e.shown.slice(0,5),'period']}),e=>({...e,mark:'empty'}),e=>({...e,text:3}),e=>({...e,said:'x'.repeat(401)}),e=>({...e,outcome:'good'}),e=>({...e,supported:'yes'}),e=>{const x={...e};delete x.at;return x;},()=>['opaque']];
 for(const f of bad){const x=structuredClone(r);x.joins.n1=f(x.joins.n1);eq(shape(x,'joins','n1'),'unreadable',JSON.stringify(x.joins.n1).slice(0,60));}
 const y=structuredClone(r);y.joins.n1.future={kept:true};eq(shape(y,'joins','n1'),'completed','unknown additive join field ignored');
 const t={exchangeManifest:y};readNote(t,noteSnap(N.n1),'dash',options);eq(t.exchangeManifest.joins.n1.future,{kept:true},'additive field kept on replacement');
 const z=structuredClone(r);z.joins.n9={};eq(shape(z,'joins','n9'),'unreadable','unknown note id');
 const u={exchangeManifest:structuredClone(r)};u.exchangeManifest.joins.n2=['opaque'];const before=structuredClone(u.exchangeManifest.joins.n2);ok(readNote(u,noteSnap(N.n2),'period',options)===false,'unreadable join turns read-only');eq(u.exchangeManifest.joins.n2,before);
 for(const joins of [[],'x',Object.fromEntries(Array.from({length:9},(_,i)=>['n'+i,{}]))]){const w={exchangeManifest:{...structuredClone(r),joins}};eq(manifestView(w).status,'malformed','bad joins map: '+JSON.stringify(joins).slice(0,30));const b=structuredClone(w);ok(readNote(w,noteSnap(N.n1),'period',options)===false);eq(w,b);}
 const items=Object.fromEntries(Array.from({length:25},(_,i)=>['X'+i,{}]));eq(manifestView({exchangeManifest:{...base,items}}).status,'ready','25 items allowed');
 eq(manifestView({exchangeManifest:{...base,items:{...items,X25:{}}}}).status,'malformed','26 items malformed');
 eq(manifestView({exchangeManifest:structuredClone(base)}).joins,{},'a 319-shaped root has no joins');}
// Every join write refuses on a failed preflight.
for(const canExport of [()=>false,()=>{throw Error('preflight');},undefined]){const s=fresh(),before=structuredClone(s);ok(readNote(s,noteSnap(N.n1),'period',{canExport})===false,'refused join preflight');eq(s,before);}
// The page renders the new bench, cards 7 to 9 and Set C, closed by default.
{resetManifestView();const html=manifestPage(fresh(),'join-render');ok(html.includes(T.joinTitle.replace('’','&#39;'))||html.includes(T.joinTitle),'bench title');ok(html.includes('data-mf-set="C"')&&!/data-mf-set="C" open/.test(html),'Set C closed by default');
 eq([...html.matchAll(/data-mf-read="(n\d)"/g)].map(m=>m[1]),['n1','n2','n3','n4','n5']);for(const m of html.matchAll(/data-mf-slot="(n\d:s1)" aria-label="([^"]+)"/g))eq(m[2],'Gap','note gap label');
 for(const c of T.joinCards)ok(html.includes(c.title),'card shown: '+c.title);}

// Spec 349: the Book Crate, card 10 and set D.
const TT=Object.fromEntries(CRATE_TITLES.map(t=>[t.id,t])),D=Object.fromEntries(TITLE_ITEMS.map(i=>[i.id,i]));
const titleSnap=t=>structuredClone({...t,said:{...K.said}});
eq(CRATE_TILE_IDS,['italics','quotes','plain'],'crate tile order');
// Finite checks on the eight titles, notes and kinds (spec 349's table and the companion).
eq(CRATE_TITLES.map(t=>[t.id,t.title,t.kind]),[['t1','The Wind in the Willows','whole'],['t2','The River Bank','part'],['t3','A Child’s Garden of Verses','whole'],['t4','The Swing','part'],['t5','Just So Stories','whole'],['t6','How the Whale Got His Throat','part'],['t7','The Willowbank Gazette','whole'],['t8','Willow Brook Runs Down','short']]);
eq(CRATE_TITLES.map(t=>t.note),['a book by Kenneth Grahame, 1908','its first chapter','a book of poems by Robert Louis Stevenson, 1885','a poem in that book','a book by Rudyard Kipling, 1902','a story in that book','the town’s newspaper','a song the town sings at the Market Fair']);
eq(CRATE_TITLES.filter(t=>t.story).map(t=>t.id),['t7','t8'],'only the Gazette and the song are Willowbank stories');
for(const t of CRATE_TITLES)ok(companionFlat.includes(flat(`${t.kind==='whole'?`*${t.title}*`:`"${t.title}"`}: ${t.note}`)),'title and note are the companion’s: '+t.id);
// An independent reading of the order table for all 48 title, tile and mode combinations.
const lineOf={plain:'Plain letters hide that it’s a title. Pick a mark.',news:'This is a whole newspaper. Most school writing uses italics.',book:'This is a whole book. Most school writing uses italics.',short:'A part, or a short work, goes in quotation marks.',inside:'This one lives inside a bigger work. Try quotation marks.',under:'By hand, a whole work is underlined.',lean:'A whole work leans over in italics.'};
const crateOracle=(id,m,hand)=>{const whole=['t1','t3','t5','t7'].includes(id);if(m==='plain')return ['plain',lineOf.plain];if(m==='quotes')return id==='t7'?['whole-newspaper-quotes',lineOf.news]:whole?['whole-quotes',lineOf.book]:['part-quotes',lineOf.short];if(id==='t8')return ['short-italics',lineOf.short];if(!whole)return ['part-italics',lineOf.inside];return hand?['whole-underline',lineOf.under]:['whole-italics',lineOf.lean];};
let combos=0;
for(const t of CRATE_TITLES)for(const m of CRATE_TILE_IDS)for(const hand of [false,true]){combos++;const s=fresh(),e=chooseTitle(s,titleSnap(t),m,hand,options),[code,line]=crateOracle(t.id,m,hand),whole=t.kind==='whole';
 eq(crateCode(t,m,m==='italics'&&hand),code,`${t.id} ${m} ${hand} code`);eq(e.said,line,`${t.id} ${m} ${hand} line`);
 eq(e.text,m==='plain'?t.title:m==='quotes'?`“${t.title}”`:hand?`_${t.title}_`:`*${t.title}*`,`${t.id} ${m} ${hand} text`);
 eq(e.outcome,(whole?m==='italics':m==='quotes')?'fits':'other',`${t.id} ${m} ${hand} outcome`);eq([e.shown,e.mark,e.hand,e.supported],[['italics','quotes','plain'],m,hand,false]);eq(s.exchangeManifest.crate[t.id],e);}
eq(combos,48,'all 48 title, mark and mode combinations');
ok(chooseTitle(fresh(),titleSnap(TT.t1),'underline',false,options)===false,'underline is not a saved tile');ok(chooseTitle(fresh(),titleSnap(TT.t1),'italics','yes',options)===false,'hand must be a boolean');
// Saves: absent until the first choice, replacement, support, cards seen and frozen strings.
{const s=fresh();loadLine(s,lineSnap(L.m1),{s1:'colon',s2:'comma',s3:'comma'},options);ok(!Object.hasOwn(s.exchangeManifest,'crate'),'no other write adds crate');
 eq(chooseTitle(s,titleSnap(TT.t2),'italics',false,options).supported,false,'first choice unsupported');const e=chooseTitle(s,titleSnap(TT.t2),'quotes',false,options);eq([e.supported,e.outcome],[true,'fits'],'a later choice carries the line already seen');eq(Object.keys(s.exchangeManifest.crate),['t2'],'each choice replaces that title’s entry');
 eq(manifestView(s).crate.t2.shape,'completed');markCardsSeen(s,options);eq(chooseTitle(s,titleSnap(TT.t3),'plain',false,options).supported,true,'card worked example marks later choices');
 const saved=JSON.parse(JSON.stringify(s));eq(manifestView(saved).crate.t3.entry.supported,true,'support survives export and import');}
{const s=fresh(),old=titleSnap(TT.t7);chooseTitle(s,old,'quotes',false,options);const today=titleSnap(TT.t7);today.said['whole-newspaper-quotes']='Today’s crate line.';today.title='Today’s title';
 const notes=manifestNotes(s);ok(notes.includes('This is a whole newspaper.')&&!notes.includes('Today’s crate line.')&&notes.includes(K.notesHeading),'Notes render the saved crate strings under their subheading');ok(notes.includes('“The Willowbank Gazette”'),'Notes show the saved marked title');
 eq(chooseTitle(s,today,'quotes',false,options).said,'Today’s crate line.','a new choice uses its own snapshot');}
// Structural validation of crate entries and the crate map.
{const s=fresh();chooseTitle(s,titleSnap(TT.t1),'italics',false,options);const r=s.exchangeManifest;
 const bad=[e=>{const x={...e};delete x.hand;return x;},e=>({...e,hand:'no'}),e=>({...e,shown:['italics','italics','plain']}),e=>({...e,shown:['italics','quotes','underline']}),e=>({...e,shown:['italics','quotes']}),e=>({...e,mark:'underline'}),e=>({...e,text:'x'.repeat(401)}),e=>({...e,said:5}),e=>({...e,outcome:'right'}),e=>({...e,supported:'yes'}),e=>({...e,at:1}),()=>['opaque'],()=>({mark:'italics'})];
 for(const f of bad){const x=structuredClone(r);x.crate.t1=f(x.crate.t1);eq(shape(x,'crate','t1'),'unreadable',JSON.stringify(x.crate.t1).slice(0,60));}
 const y=structuredClone(r);y.crate.t1.future={kept:true};eq(shape(y,'crate','t1'),'completed','unknown additive crate field ignored');
 const t={exchangeManifest:y};chooseTitle(t,titleSnap(TT.t1),'quotes',false,options);eq(t.exchangeManifest.crate.t1.future,{kept:true},'additive field kept on replacement');
 const z=structuredClone(r);z.crate.t9={};eq(shape(z,'crate','t9'),'unreadable','unknown title id');
 const u={exchangeManifest:structuredClone(r)};u.exchangeManifest.crate.t2={opaque:true};const before=structuredClone(u.exchangeManifest.crate.t2);ok(chooseTitle(u,titleSnap(TT.t2),'quotes',false,options)===false,'unreadable title turns read-only');eq(u.exchangeManifest.crate.t2,before);
 eq(chooseTitle(u,titleSnap(TT.t3),'italics',false,options).outcome,'fits','other titles stay usable');
 eq(manifestView({exchangeManifest:structuredClone(base)}).crate,{},'a 329-shaped root reads an empty crate');eq(manifestView({exchangeManifest:structuredClone(base)}).crateStatus,'ready');}
// A malformed crate map closes only the crate: lists, joins and items stay usable and keep the raw value exactly.
for(const crate of [[],'x',null,Object.fromEntries(Array.from({length:9},(_,i)=>['t'+i,{}]))]){
 const s={exchangeManifest:{...complete(),crate}},raw=JSON.stringify(crate);const v=manifestView(s);eq([v.status,v.crateStatus],['ready','unavailable'],'bad crate map: '+raw.slice(0,30));
 const b=structuredClone(s);ok(chooseTitle(s,titleSnap(TT.t1),'italics',false,options)===false,'no crate write');eq(s,b);
 ok(loadLine(s,lineSnap(L.m4),{s1:'empty'},options)!==false,'lists stay usable');ok(readNote(s,noteSnap(N.n1),'period',options)!==false,'joins stay usable');ok(answerItem(s,itemSnap(D.D2),'c',options)!==false,'items stay usable');ok(markCardsSeen(s,options)!==false,'cards seen stays usable');
 eq(JSON.stringify(s.exchangeManifest.crate),raw,'raw crate kept exactly');ok(JSON.stringify(s).includes(`"crate":${raw}`),'export carries the raw crate');
 resetManifestView();const page=manifestPage(s,'bad-crate');ok(!page.includes('data-mf-title=')&&page.includes('data-mf-root="open"')&&page.includes('data-mf-load="m1"'),'crate rows read-only, page open');ok(manifestNotes(s).includes(K.notesHeading),'Notes name the unavailable crate');}
// Set D: positions, not-single-longest after the print rule, feedback and frozen shapes.
eq(TITLE_ITEMS.map(i=>i.id),['D1','D2','D3','D4']);
for(const [id,at] of [['D1',0],['D2',2],['D3',1],['D4',0]]){const i=D[id],lens=i.choices.map(c=>[...c.text.replace(/\*/g,'')].length),fit=i.choices.findIndex(c=>c.id===i.fits);eq(fit,at,id+' fitting position');ok(!(lens[fit]===Math.max(...lens)&&lens.filter(x=>x===lens[fit]).length===1),id+' fitting choice is never the single longest');
 for(const c of i.choices)eq(itemFeedback(i,c.id),c.id===i.fits?{outcome:'fits',said:[i.explanation]}:{outcome:'other',said:[c.feedback,i.explanation]});}
eq(D.D3.choices.map(c=>[...c.text.replace(/\*/g,'')].length),[67,65,65],'D3 lengths as the spec states');
{const s=fresh();eq(markSupport(s,'items','D1',options,{guided:true}),true);eq(s.exchangeManifest.items.D1,{supported:true,guided:true},'D1 pending before its steps');
 const d1=answerItem(s,itemSnap(D.D1),'b',options);eq([d1.outcome,d1.supported,d1.guided],['other',true,true]);eq(d1.prompt,'The librarian types the title of a book: The Wind in the Willows.\nIn school writing, how do you show a typed book title?');
 eq(answerItem(s,itemSnap(D.D4),'a',options).prompt,'You write a book title by hand for school. What do you do?','D4 has no card');
 const d3=answerItem(s,itemSnap(D.D3),'b',options);eq(d3.answerText,'“The River Bank” is the first chapter of *The Wind in the Willows*.');eq(d3.prompt,'“The River Bank” is the first chapter of The Wind in the Willows.\nIn school writing, which sentence shows the chapter and the book?');
 for(const id of ['D1','D3','D4'])eq(manifestView(s).items[id].shape,'completed',id+' completed shape');ok(manifestNotes(s).includes('<em>The Wind in the Willows</em>'),'Notes draw D3’s saved italics');
 for(const canExport of [()=>false,()=>{throw Error('x');}]){const t=fresh(),b=structuredClone(t);ok(markSupport(t,'items','D1',{canExport},{guided:true})===false,'refused Set D pre-display save');eq(t,b);}}
// Copy: the companion, the spec's seven exceptions and the market limits.
const exceptions349=rowsOf(spec349.slice(spec349.indexOf('**Wording outside the companion'),spec349.indexOf("319's and 329's exceptions")));
eq(exceptions349.length,7,'seven exception rows');
for(const x of [K.setTitle,K.notesHeading,K.said['whole-newspaper-quotes'],K.said['whole-underline'],K.said['part-italics'],K.tiles.underline,K.underlined('{title}')])ok(exceptions349.some(r=>straight(r)===straight(x)),'exception text is the spec’s: '+x);
const crateStrings=[K.card.title.replace(/^Card \d+\. /,''),K.card.text,K.card.example,...K.card.steps,K.benchTitle,K.header,K.hand,K.historyLabel,...Object.values(K.tiles),...Object.values(K.said),K.setTitle,K.notesHeading,...CRATE_TITLES.flatMap(t=>[t.title,t.note])];
TITLE_ITEMS.forEach(i=>{for(const k of ['card','prompt','hint','explanation'])if(i[k])crateStrings.push(i[k]);i.steps?.forEach(x=>crateStrings.push(x));i.choices.forEach(c=>{crateStrings.push(c.text);if(c.feedback)crateStrings.push(c.feedback);});});
for(const x of crateStrings){ok(!/["']/.test(x),'print rule applied: '+x);ok(!/Vadoalto|Nuria|Hollis|high ford|\bthe Ways\b|\bpage\b/i.test(x),'no place or page beyond the market: '+x);ok(!x.includes('—'),'no em-dash: '+x);}
eq(scanCopySource(crateStrings.join('\n')),[],'child-copy terms in the crate strings');
eq(T.glossary.slice(-3).map(g=>g[0]),['Italics','Quotation marks','Title'],'glossary adds the three terms in order');
// The page: card 10, the bench, Hand mode and Set D, closed by default.
{resetManifestView();const s=fresh(),html=manifestPage(s,'crate-render');ok(html.includes(K.card.title)&&html.includes(K.benchTitle),'card 10 and the bench');ok(html.includes('data-mf-set="D"')&&!/data-mf-set="D" open/.test(html),'Set D closed by default');
 eq([...html.matchAll(/data-mf-crate="(t\d)"/g)].map(m=>m[1]),['t1','t2','t3','t4','t5','t6','t7','t8']);eq((html.match(/class="mf-pair"/g)||[]).length,4,'four pair cards');ok(/data-mf-hand aria-pressed="false"/.test(html),'Hand mode off on a new visit');
 ok(html.indexOf('data-mf-set="C"')<html.indexOf(K.card.title)&&html.indexOf(K.benchTitle)<html.indexOf('data-mf-set="D"'),'below Set C, then the bench, then Set D');
 chooseTitle(s,titleSnap(TT.t3),'italics',true,options);resetManifestView();const page=manifestPage(s,'crate-render');ok(page.includes('<span class="sr-only">A Child&#39;s Garden of Verses, underlined</span>')||page.includes('A Child’s Garden of Verses, underlined'),'underlined title has its accessible name');ok(page.includes('class="mf-underline"'),'underline drawn');}
ok(/\.mf-underline\{[^}]*text-decoration:underline/.test(readText('../dist/manifest.css'))&&!/\.mf-underline\{[^}]*cursor:pointer/.test(readText('../dist/manifest.css')),'underline is not styled as a link');
console.log(`Exchange Manifest market list, joining notes and book crate: ${n} checks passed (${total} tile patterns, ${pairs} note marks, ${combos} crate choices).`);
