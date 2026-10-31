// Spec 328 browser journeys in Chromium: El camino by tap and keyboard, the wrong turn and back, announcements, errand switching, Mi cuaderno, reload, Notes and import, reset, two explorers and stale controls.
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
const playwright=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),{chromium}=playwright.chromium?playwright:playwright.default;
const url=process.env.RIVER_TEST_URL;if(!url)throw new Error('Serve dist locally and set RIVER_TEST_URL.');
import {tmpdir} from 'node:os';
import {MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
// Screenshots are always written for inspection: to RIVER_ARTIFACTS, or a temporary folder that is printed.
const out=process.env.RIVER_ARTIFACTS||`${tmpdir()}/river-camino-${Date.now()}`;mkdirSync(out,{recursive:true});
let n=0;const ok=(x,m)=>{assert.ok(x,m);n++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;};
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
const book=p=>p.evaluate(()=>{const id=JSON.parse(localStorage.getItem('learning-garden-explorers')||'{}').activeId||'explorer-1';return JSON.parse(localStorage.getItem('number-garden-v1:'+id)||'{}');});
const act=(p,a)=>p.locator(`[data-river-action="${a}"]`).first();
const mv=(p,b)=>p.locator(`[data-river-move="${b}"]`);
const status=p=>p.locator('#river-status').innerText();
const focused=p=>p.evaluate(()=>{const a=document.activeElement;return a?.id||a?.dataset?.riverMove||a?.dataset?.riverAction||a?.tagName;});
// The real app, with read-only hooks to the live notebook and its Notes report for the preflight-refusal journey.
async function hook(c){await c.route('**/app.mjs',async r=>{const res=await r.fetch({maxRetries:3});const b=(await res.text()).replace('let graph=null,','window.__read=()=>state;window.__report=()=>notesReport(state);let graph=null,');await r.fulfill({response:res,body:b,headers:{...res.headers(),'content-type':'text/javascript'}});});}
// Teo never covers a map label.
const teoClear=p=>p.evaluate(()=>{const t=document.querySelector('.river-teo circle').getBoundingClientRect();return [...document.querySelectorAll('.river-map > text, .river-map g:not(.river-teo) text')].every(x=>{const r=x.getBoundingClientRect();return r.right<=t.left||r.left>=t.right||r.bottom<=t.top||r.top>=t.bottom;});});
async function fresh(width,height){const c=await browser.newContext({viewport:{width,height},acceptDownloads:true});await hook(c);const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.errors=errors;await p.goto(url+'#mercado');await p.locator('[data-river-root]').waitFor();return {c,p};}
const overflow=p=>p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1);
const small=p=>p.$$eval('.river-page button,.river-page summary,.river-page a',xs=>xs.filter(x=>x.offsetParent).filter(x=>{const r=x.getBoundingClientRect();return r.width<43.5||r.height<43.5;}).map(x=>x.outerHTML.slice(0,80)));
try{
 for(const [w,h] of [[320,600],[820,1000],[1024,768]]){
  const {c,p}=await fresh(w,h);
  ok((await p.locator('.river-entry').allInnerTexts()).map(t=>t.split('\n')[0]).join()==='La carga,El camino',`${w}: both errands listed in order`);
  eq(Object.hasOwn(await book(p),'spanish'),false,`${w}: arrival writes nothing`);
  await act(p,'open-camino').click();await p.locator('.river-map').waitFor();
  ok(await focused(p)==='river-note-title',`${w}: choosing El camino moves focus to its heading`);
  ok((await book(p)).spanish.errands.camino.tryId===1,`${w}: opening El camino takes try 1`);
  ok((await p.locator('.river-replies').last().innerText()).includes('¿Por dónde voy? Siempre me pierdo.'),`${w}: Teo's start line`);
  ok((await p.locator('#river-teo-place').innerText())==='Teo is at el muelle.',`${w}: Teo's place in text`);
  ok(!(await overflow(p)),`${w}: no horizontal overflow`);eq(await small(p),[],`${w}: 44 px controls`);
  // Keyboard at 320, taps elsewhere: a wrong press, the right way, the wrong turn.
  const press=async b=>{if(w===320){await mv(p,b).focus();await p.keyboard.press('Enter');}else await mv(p,b).click();};
  await press('cruza');ok((await status(p)).includes('Aquí no hay nada que cruzar.')&&(await status(p)).startsWith('Teo is at el muelle.'),`${w}: nothing to cross, announced with Teo's place`);
  await press('izquierda');ok((await status(p)).includes("That way doesn't go anywhere from here."),`${w}: stays line`);
  await press('recto');await press('cruza');ok((await p.locator('#river-teo-place').innerText())==='Teo is at la plaza.',`${w}: across the bridge to the plaza`);
  ok(await p.locator('.river-question').count()===0,`${w}: no question before an arrival`);
  ok(await teoClear(p),`${w}: Teo clear of the labels at the plaza`);
  await press('derecha');ok((await status(p)).includes('Esta es la oficina de correos.'),`${w}: post office announced`);
  ok(await focused(p)==='derecha',`${w}: a move keeps focus on the pressed button`);ok(await teoClear(p),`${w}: Teo clear of the labels at the post office`);
  // Every press at the post office shows its own line, keeping the hint and Back.
  await press('cruza');let replies=await p.locator('.river-replies').last().innerText();
  ok(replies.includes('Aquí no hay nada que cruzar.')&&!replies.includes('Esta es la oficina de correos.')&&replies.includes('Read the line about la plaza again.')&&await act(p,'back').count()===1,`${w}: cruza at the post office shows nothing to cross, with the hint and Back`);
  for(const b of ['recto','izquierda','derecha']){await press(b);replies=await p.locator('.river-replies').last().innerText();ok(replies.includes("That way doesn't go anywhere from here.")&&replies.includes('Read the line about la plaza again.')&&await focused(p)===b,`${w}: ${b} at the post office stays put, focus kept`);}
  ok((await p.locator('.river-hint').innerText()).includes('Read the line about la plaza again.'),`${w}: the hint`);
  ok(await p.locator('.river-question').count()===1,`${w}: the question after the first arrival`);
  if(w===820){await p.locator('.river-task').evaluate(e=>e.scrollIntoView({block:'start'}));
   const vis=await p.evaluate(()=>{const inside=r=>r.top>=0&&r.bottom<=innerHeight,some=r=>r.bottom>0&&r.top<innerHeight;const q=s=>document.querySelector(s).getBoundingClientRect();return {note:some(q('.river-note')),map:inside(q('.river-map')),buttons:[...document.querySelectorAll('[data-river-move]')].map(b=>inside(b.getBoundingClientRect()))};});
   eq(vis,{note:true,map:true,buttons:[true,true,true,true]},'820: the note, the whole map and all four buttons visible together');}
  await p.screenshot({path:`${out}/camino-correos-${w}.png`,fullPage:true});
  // Reload mid-walk keeps the node.
  await p.reload();await p.locator('[data-river-root]').waitFor();await act(p,'open-camino').click();await p.locator('.river-map').waitFor();
  ok((await p.locator('#river-teo-place').innerText())==='Teo is at la oficina de correos.',`${w}: reload keeps Teo's place`);
  await act(p,'back').click();ok(await focused(p)==='river-teo-place',`${w}: after Back, focus on Teo's place`);await mv(p,'izquierda').click();
  ok((await p.locator('.river-replies').last().innerText()).includes('¡La panadería! Huele a pan. ¡Gracias!')&&await mv(p,'recto').count()===0,`${w}: the bakery replaces the buttons`);
  ok(await focused(p)==='river-teo-place'&&await teoClear(p),`${w}: focus on Teo's place at the bakery; Teo clear of the labels`);
  await p.locator('[data-river-choice="puente"]').click();ok((await p.locator('.river-nudge').innerText()).includes('Teo crossed the puente'),`${w}: a non-fitting pick nudges`);
  await p.locator('[data-river-choice="cafe"]').click();const saved=(await book(p)).spanish.errands.camino;
  ok(saved.state==='done'&&saved.taskEvidence.firstArrival.destination==='correos'&&saved.taskEvidence.hints.includes('correos'),`${w}: done, first arrival at the post office kept`);
  ok((await p.locator('.river-entry').nth(1).innerText()).includes('Done'),`${w}: El camino shows Done`);
  await p.screenshot({path:`${out}/camino-done-${w}.png`,fullPage:true});
  // Switching errands is view state: no write, focus on the heading.
  const before=JSON.stringify(await book(p));await act(p,'open').click();await p.locator('.river-note').waitFor();
  ok(JSON.stringify(await book(p))!==before&&(await book(p)).spanish.errands.carga,`${w}: choosing La carga the first time opens it`);
  const after=JSON.stringify(await book(p));await act(p,'open-camino').click();await p.locator('.river-map').waitFor();
  ok(JSON.stringify(await book(p))===after,`${w}: switching back makes no write`);ok(await focused(p)==='river-note-title',`${w}: focus on the heading`);
  ok(p.errors.length===0,`${w}: no page errors (${p.errors.join('; ')})`);await c.close();
 }
 // Mi cuaderno: both groups, meaning recorded first for every opened errand; Notes, export and import; reset.
 {const {c,p}=await fresh(820,1000);await act(p,'open').click();await p.locator('.river-note').waitFor();await act(p,'open-camino').click();await p.locator('.river-map').waitFor();
  await act(p,'note-directions').click();await p.locator('#river-cuaderno-title').waitFor();
  const s=(await book(p)).spanish;ok(s.errands.carga.support.meaning&&s.errands.camino.support.meaning,'opening a Details note records meaning for both errands');
  const text=await p.locator('.river-cuaderno').innerText();ok(text.includes('La carga')&&text.includes('El camino')&&text.includes('sigue recto keep going straight'),'Mi cuaderno shows both groups');
  ok(await p.locator('[data-river-grammar="directions"]').evaluate(d=>d.open),'the Directions note opens');
  await act(p,'cuaderno-close').click();await mv(p,'recto').click();
  await p.goto(url+'#notes');const line=await p.locator(`details:has-text("The River Market (Spanish)")`).first().textContent();
  ok(line.includes('La carga started, with English help. El camino started, with English help.'),'the grown-up line names both errands');
  const [dl]=await Promise.all([p.waitForEvent('download'),p.locator('#download').click()]);const file=await dl.path();
  const data=JSON.parse((await import('node:fs')).readFileSync(file,'utf8'));
  await p.locator('#reset').click();await p.locator('dialog[open] #confirm-reset').click();await p.locator('dialog[open] [data-film-skip]').first().click().catch(()=>{});
  ok(!Object.hasOwn(await book(p),'spanish'),'reset clears the market');
  await p.goto(url+'#notes');await p.locator('#progress-file').setInputFiles({name:'synthetic.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
  await p.locator('#progress-import-confirm').click();await p.locator('#progress-import-status').waitFor();
  await p.goto(url+'#mercado');await p.locator('[data-river-root]').waitFor();await act(p,'open-camino').click();await p.locator('.river-map').waitFor();
  ok((await p.locator('#river-teo-place').innerText())==='Teo is at el puente.','import brings the walk back');
  ok(p.errors.length===0,`cuaderno: no page errors (${p.errors.join('; ')})`);await c.close();}
 // A move button left over from another explorer cannot write.
 {const {c,p}=await fresh(820,1000);await act(p,'open-camino').click();await p.locator('.river-map').waitFor();const stale=await p.evaluateHandle(()=>document.querySelector('[data-river-move="recto"]'));
  await p.locator('#explorer-switch').click();await p.locator('#explorer-new').click();await p.locator('#explorer-create').click();await p.locator('[data-river-root]').waitFor();
  const snap=()=>p.evaluate(()=>Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)])));const before=await snap();
  await stale.evaluate(b=>b.click());eq(await snap(),before,'a detached move button changes neither explorer');
  const stale2=await p.evaluateHandle(()=>document.querySelector('[data-river-action="open-camino"]'));await p.goto(url+'#home');await stale2.evaluate(b=>b.click());
  ok(!Object.hasOwn(await book(p),'spanish'),'a control left after navigation does not write');await c.close();}
 // Forced preflight refusal: a notebook whose Notes report is 16 bytes over the import limit (a support flag shrinks the report by one byte) refuses every camino write unchanged.
 {const {c,p}=await fresh(820,1000);await act(p,'open-camino').click();await p.locator('.river-map').waitFor();await mv(p,'recto').click();
  await p.evaluate(max=>{const st=__read();st.padding='';const size=new TextEncoder().encode(JSON.stringify(__report(),null,2)).length;st.padding='x'.repeat(max-size+16);},MAX_IMPORT_BYTES);
  const snap=()=>p.evaluate(()=>Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)])));const before=await snap(),live=await p.evaluate(()=>JSON.stringify(__read().spanish));
  const view=await p.locator('.river-walk').innerHTML();
  await mv(p,'cruza').click();ok((await status(p)).includes("There isn't room to save this change yet."),'refused move shows the capacity line');
  ok(await p.locator('.river-walk').innerHTML()===view&&(await p.locator('#river-teo-place').innerText())==='Teo is at el puente.','refused move leaves the view unchanged');
  await act(p,'meaning').click();ok(await p.locator('.river-gloss').count()===0,'refused meaning support shows no English');
  await act(p,'words').click();ok(await p.locator('.river-words').count()===0,'refused Word by word shows no English');
  await act(p,'cuaderno').click();ok(await p.locator('#river-cuaderno-title').count()===0,'refused Mi cuaderno stays closed');
  await act(p,'note-directions').click();ok(await p.locator('#river-cuaderno-title').count()===0,'refused Details note stays closed');
  eq(await snap(),before,'refusals change no saved data');eq(await p.evaluate(()=>JSON.stringify(__read().spanish)),live,'nor the live notebook');
  ok(p.errors.length===0,`refusal: no page errors (${p.errors.join('; ')})`);await c.close();}
 // Support before English through the UI: every HTML write that would show English is checked synchronously against the saved support.
 for(const path of ['meaning','words','cuaderno','note-directions']){const {c,p}=await fresh(320,600);
  await p.evaluate(()=>{window.__early=[];window.__english=0;const saved=()=>{const id=JSON.parse(localStorage.getItem('learning-garden-explorers')||'{}').activeId||'explorer-1';return JSON.parse(localStorage.getItem('number-garden-v1:'+id)||'{}').spanish?.errands?.camino?.support?.meaning===true;};
   const check=html=>{if(typeof html==='string'&&/river-gloss|river-words|river-cuaderno/.test(html)){window.__english++;if(!saved())window.__early.push(html.slice(0,80));}};
   const d=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');Object.defineProperty(Element.prototype,'innerHTML',{configurable:true,get:d.get,set(v){check(v);d.set.call(this,v);}});
   const o=Object.getOwnPropertyDescriptor(Element.prototype,'outerHTML');Object.defineProperty(Element.prototype,'outerHTML',{configurable:true,get:o.get,set(v){check(v);o.set.call(this,v);}});
   const ia=Element.prototype.insertAdjacentHTML;Element.prototype.insertAdjacentHTML=function(w,v){check(v);return ia.call(this,w,v);};});
  await act(p,'open-camino').click();await p.locator('.river-map').waitFor();
  await act(p,path).click();await p.locator(path==='meaning'?'.river-gloss':path==='words'?'.river-words':'#river-cuaderno-title').first().waitFor();
  const r=await p.evaluate(()=>({early:window.__early,english:window.__english}));
  ok(r.english>0&&r.early.length===0,`${path}: meaning saved before any English HTML was written (${r.early.join(' | ')})`);await c.close();}
 // Switching explorers writes nothing to either explorer's market.
 {const {c,p}=await fresh(820,1000);await act(p,'open-camino').click();await p.locator('.river-map').waitFor();await mv(p,'recto').click();
  const first=await p.evaluate(()=>JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId),key='number-garden-v1:'+first;
  const mine=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)).spanish,key);
  await p.locator('#explorer-switch').click();await p.locator('#explorer-new').click();await p.locator('#explorer-create').click();await p.locator('[data-river-root]').waitFor();
  ok(!Object.hasOwn(await book(p),'spanish'),'the new explorer starts with no market save');
  const second=await p.evaluate(()=>JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId);ok(second!==first,'a second explorer is active');
  const theirs=await p.evaluate(()=>{const id=JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId;return localStorage.getItem('number-garden-v1:'+id);});
  await p.locator('#explorer-switch').click();await p.locator(`[data-select-explorer="${first}"]`).click();await p.locator('[data-river-root]').waitFor();
  eq(await p.evaluate(()=>JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId),first,'switched back to the first explorer');
  await act(p,'open-camino').click();await p.locator('.river-map').waitFor();ok((await p.locator('#river-teo-place').innerText())==='Teo is at el puente.','the first explorer resumes at the bridge');
  eq(await p.evaluate(k=>JSON.parse(localStorage.getItem(k)).spanish,key),mine,'switching explorers leaves the first market exact');
  eq(await p.evaluate(id=>localStorage.getItem('number-garden-v1:'+id),second),theirs,'and the second explorer\'s save exact');await c.close();}
}finally{await browser.close();}
console.log(`Screenshots for inspection: ${out}`);
console.log(`El camino browser checks: ${n} assertions passed.`);
