// Spec 322 §8 source checks: the look is one stored field, read through styleOf, and never anything else.
import assert from 'node:assert/strict';
import {freshState,restoreState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {ensureGarden} from '../dist/garden-core.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {styleOf,chooseStyle} from '../dist/style-core.mjs';
import {fieldJournalCafe,frameText} from '../dist/style-frames.mjs';
import {stylePanel,submitStyle,STYLE_COPY} from '../dist/style-ui.mjs';
import {guests,ingredients,cafeSuppers} from '../dist/cafe-content.mjs';
import {renderCafe} from '../dist/cafe-ui.mjs';
import {nextGuest,orderFor,adjustBite,checkPlate,skipCafeStage,currentRecipe,serveCafe} from '../dist/cafe-core.mjs';
import {scanCopySource} from '../scripts/check-child-copy.mjs';
let count=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);count++;},ok=(x,m)=>{assert.ok(x,m);count++;};
const seed=()=>initializeExplorerState(freshState());
// The app's own Notes check: the notebook as it would be downloaded must import again.
const report=c=>({title:'After the Storm: observations',exportedAt:'2026-10-31T00:00:00.000Z',note:'A small informal sample, not a grade or mastery assessment.',...c});
const real=c=>prepareProgressImport(JSON.stringify(report(c),null,2)).ok;

// 1. styleOf reads Field Journal only for the exact code.
for(const garden of [undefined,{},{style:'mystery'},{style:''},{style:null},{style:'Field-Journal'},{style:['field-journal']}])ok(styleOf({garden})==='storybook',JSON.stringify(garden));
for(const garden of [null,[],['field-journal'],'field-journal',7])eq(styleOf({garden}),'storybook','unreadable garden');
eq(styleOf({garden:{style:'field-journal'}}),'field-journal');eq(styleOf(null),'storybook');

// 2. chooseStyle writes only garden.style, and a no-op or refusal writes nothing.
{
 const s=seed();s.garden.future={kept:true};const before=structuredClone(s);
 eq(chooseStyle(s,'field-journal',real),'saved');const want=structuredClone(before);want.garden.style='field-journal';eq(s,want,'only garden.style changed');
 const same=structuredClone(s);ok(chooseStyle(s,'field-journal',real)!=='saved');eq(s,same,'same look writes nothing');eq(submitStyle(s,'field-journal',real),'same');
 for(const bad of ['mystery','',null,undefined,'Storybook'])ok(chooseStyle(s,bad,real)!=='saved',String(bad));eq(s,same,'refused codes write nothing');
 eq(chooseStyle(s,'storybook',real),'saved');eq(s.garden.style,'storybook');eq(submitStyle(s,'field-journal',real),'saved');
}
for(const bad of [null,[],'text',4]){const s={garden:bad,cafe:{}};const b=structuredClone(s);ok(chooseStyle(s,'field-journal',real)!=='saved');eq(s,b,'unreadable garden declined');eq(submitStyle(s,'field-journal',real),'unreadable');}
{const s=seed();delete s.garden;const b=structuredClone(s);eq(chooseStyle(s,'field-journal',real),'saved');eq(s,{...b,garden:{style:'field-journal'}},'absent garden is created');}
{const s=seed();s.garden.style='mystery';eq(chooseStyle(s,'storybook',real),'saved','explicit Storybook replaces an unknown value');eq(s.garden.style,'storybook');}

// 2b. The choice runs the Notes check on a whole copy first, and a refusal writes nothing.
{
 const s=seed(),before=structuredClone(s);
 for(const check of [undefined,null,'yes',()=>false,()=>1,()=>'true',()=>undefined,()=>{throw new Error('boom');}]){
  eq(chooseStyle(s,'field-journal',check),'report-safety',`refused: ${String(check)}`);eq(s,before,'a refused check writes nothing');
  eq(submitStyle(s,'field-journal',check),'report-safety');eq(s,before,'a refused submit writes nothing');
 }
 ok(STYLE_COPY['report-safety'].includes('Nothing changed'),'the refusal says nothing changed');
 // A check that edits its copy cannot change what is saved.
 let seen=null;const poison=c=>{seen=c;c.garden.style='mystery';c.garden.extra=true;c.cafe=null;return true;};
 eq(chooseStyle(s,'field-journal',poison),'saved');ok(seen!==s&&seen.garden!==s.garden,'the check gets a copy');
 const want=structuredClone(before);want.garden.style='field-journal';eq(s,want,'only the proposed look is saved');
 // A no-op never calls the check.
 let calls=0;eq(chooseStyle(s,'field-journal',()=>{calls++;return true;}),'same');eq(calls,0,'no check for the same look');
}
// A notebook that exports at exactly the import limit stays importable: choosing a look would push it over, so it is refused.
{
 const s=seed();s.garden.future='';const size=c=>new TextEncoder().encode(JSON.stringify(report(c),null,2)).length;
 s.garden.future='x'.repeat(MAX_IMPORT_BYTES-size(s));eq(size(s),MAX_IMPORT_BYTES,'exactly at the limit');ok(real(s),'importable at the limit');
 const before=structuredClone(s);eq(chooseStyle(s,'field-journal',real),'report-safety','over the limit is refused');eq(s,before,'the notebook is unchanged');ok(real(s),'still importable');
 s.garden.future='';s.garden.future='x'.repeat(MAX_IMPORT_BYTES-size(s)-64);eq(chooseStyle(s,'field-journal',real),'saved','room for the look');ok(real(s),'importable after the change');
}
// 3. An unknown stored value survives ensureGarden, save, export and import byte for byte.
{
 const s=seed();s.garden.style='mystery';ensureGarden(s);eq(s.garden.style,'mystery');
 stylePanel(s);renderCafe(s);eq(s.garden.style,'mystery','display never rewrites');
 eq(restoreState(JSON.stringify(s)).garden.style,'mystery','restore');
 const exported=JSON.stringify({title:'After the Storm: observations',exportedAt:'2026-10-31T00:00:00.000Z',...s});
 const prepared=prepareProgressImport(exported);ok(prepared.ok,prepared.message);eq(prepared.state.garden.style,'mystery','import');
 ok(/value="storybook" checked/.test(stylePanel(s)),'unknown shows Storybook selected');
}
// Explorers keep their own look.
{
 class Storage{constructor(){this.data=new Map();}get length(){return this.data.size;}key(i){return [...this.data.keys()][i]??null;}getItem(k){return this.data.get(k)??null;}setItem(k,v){this.data.set(k,v);}removeItem(k){this.data.delete(k);}}
 const disk=new Storage(),store=new ExplorerStore(disk),a=initializeExplorerState(store.load()),aId=store.active.id;eq(chooseStyle(a,'field-journal',real),'saved');ok(store.save(a));
 const b=initializeExplorerState(store.add({},a));eq(styleOf(b),'storybook','a new explorer does not copy the look');
 eq(styleOf(new ExplorerStore(disk).select(aId)),'field-journal','reload keeps the look');
}

// 4. The frame copy: twelve guests (Ember with thanks only) plus gathering 1, within the copy rules.
eq(Object.keys(fieldJournalCafe).filter(k=>k!=='supper').sort(),guests.map(g=>g.id).sort());
eq(Object.keys(fieldJournalCafe.ember),['thanks']);
for(const g of guests.filter(g=>g.id!=='ember'))ok(fieldJournalCafe[g.id].greeting&&fieldJournalCafe[g.id].thanks,g.id);
const variants=[...Object.entries(fieldJournalCafe).filter(([k])=>k!=='supper').flatMap(([id,v])=>Object.entries(v).map(([key,text])=>({text,twin:guests.find(g=>g.id===id)[key]}))),
 ...['eyebrow','invitation','ending'].map(key=>({text:fieldJournalCafe.supper[key],twin:key==='eyebrow'?'Our café goal':cafeSuppers[0][key]}))];
eq(scanCopySource(variants.map(v=>v.text).join('\n')),[],'child-copy vocabulary');
const british=/\b(colou?rs?|neighbours?|favourite|labelled|metres?|litres?|recognise[ds]?|behaviour|theatre|catalogue|practising)\b/i;
const forbidden=/\b(real|grown-up|baby|babyish|serious|advanced|level|harder|easier|mature|kids?)\b/i;
const property=new RegExp(`\\b(${[...new Set(ingredients.flatMap(i=>i.properties))].join('|')})\\b`,'i');
const dishes=guests.map(g=>g.wantedDish.toLowerCase());
for(const {text,twin} of variants){
 ok(typeof text==='string'&&text.length>0&&text.split(/\s+/).length<=30,text);
 ok(!/[—!]/.test(text),`no em-dash or exclamation: ${text}`);
 ok(!/[<>{}#*_~^|\\]/.test(text),`read-aloud symbols: ${text}`);
 ok(!/'/.test(text),`curly apostrophes: ${text}`);
 ok(!british.test(text)||/neighbors/.test(text),`US spelling: ${text}`);
 ok(!forbidden.test(text),`forbidden word: ${text}`);
 ok(!property.test(text),`property word: ${text}`);
 ok(!dishes.some(d=>text.toLowerCase().includes(d)),`dish name: ${text}`);
 for(const n of text.match(/\d+|\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b/gi)||[])ok(new RegExp(`\\b${n}\\b`,'i').test(twin),`number ${n} is in the Storybook twin: ${text}`);
}
// 5. The supper invitation keeps the goal.
ok(fieldJournalCafe.supper.invitation.includes('Serve six tables'));
// frameText falls back for Storybook, unknown looks and missing variants.
eq(frameText({garden:{style:'field-journal'}},'A','B'),'B');eq(frameText({garden:{style:'field-journal'}},'A',''),'A');eq(frameText({garden:{style:'field-journal'}},'A',undefined),'A');eq(frameText({garden:{style:'mystery'}},'A','B'),'A');

// The café turn: the variant lines and the stamp in Field Journal only, and no write from rendering.
{
 const s=seed();ok(nextGuest(s));const o=orderFor(s.cafe),g=o.guest;
 const story=renderCafe(s),storyTouch=renderCafe(s,{touch:true});
 ok(story.includes(g.greeting.replace(/“/g,'“'))||story.includes(g.greeting.slice(0,20)),'Storybook arrival');ok(story.includes('Our café goal'));
 const before=structuredClone(s);eq(chooseStyle(s,'field-journal',real),'saved');const fj=renderCafe(s),fjTouch=renderCafe(s,{touch:true});
 const want=structuredClone(before);want.garden.style='field-journal';eq(s,want,'rendering writes nothing');
 const fg=fieldJournalCafe[g.id].greeting;
 if(fg){const esc=t=>t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');ok(fj.includes(esc(fg))||fj.includes(fg),'variant arrival');ok(fjTouch.includes(esc(fg))||fjTouch.includes(fg),'variant arrival in Café tools');}
 ok(fj.includes('Café ledger')&&fjTouch.includes('Café ledger'),'variant eyebrow');ok(!fj.includes('Our café goal'));
 ok(fj.includes(fieldJournalCafe.supper.invitation.slice(0,40)),'variant invitation');
 ok(!fj.includes('cafe-stamp')&&!story.includes('cafe-stamp'),'no stamp before serving');
 // Serve the order, then check the thank-you line and the stamp.
 const item=ingredients.find(i=>!i.orchard&&o.wanted.every(p=>i.properties.includes(p)));for(let j=0;j<o.bites;j++)adjustBite(s,item.id,1);
 ok(checkPlate(s)&&skipCafeStage(s)&&skipCafeStage(s));for(const r of currentRecipe(s.cafe))s.cafe.stock[r.ingredient.id]=r.required;ok(serveCafe(s));
 eq(s.cafe.current.stage,'served','the order reaches served');{
  const served=renderCafe(s),servedTouch=renderCafe(s,{touch:true});
  ok(served.includes('<span class="cafe-stamp" aria-hidden="true">Served</span>')&&servedTouch.includes('cafe-stamp'),'stamp on a served card');
  const thanks=fieldJournalCafe[g.id].thanks;ok(served.includes(thanks.slice(1,25)),'variant thanks');
  s.cafe.current.recovered=true;ok(!renderCafe(s).includes('cafe-stamp'),'no stamp on a recovered visit');delete s.cafe.current.recovered;
  eq(chooseStyle(s,'storybook',real),'saved');ok(!renderCafe(s).includes('cafe-stamp'),'Storybook has no stamp');
 }
}

// The panel copy.
{const html=stylePanel(seed());for(const t of [STYLE_COPY.heading,STYLE_COPY.explanation,STYLE_COPY.button,STYLE_COPY.caption,'Bright pictures and playful lines.','Notebook pages, maps and quieter lines.'])ok(html.includes(t.replace(/’/g,'’')),t);ok(/value="storybook" checked/.test(html));ok(!/data-style=/.test(html),'the preview never sets the page look');}
console.log(`${count} style checks passed.`);
