// Spec 328 browser journeys in Chromium: El camino by tap and keyboard, the wrong turn and back, announcements, errand switching, Mi cuaderno, reload, Notes and import, reset, two explorers and stale controls.
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
const playwright=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),{chromium}=playwright.chromium?playwright:playwright.default;
const url=process.env.RIVER_TEST_URL;if(!url)throw new Error('Serve dist locally and set RIVER_TEST_URL.');
const out=process.env.RIVER_ARTIFACTS;if(out)mkdirSync(out,{recursive:true});
let n=0;const ok=(x,m)=>{assert.ok(x,m);n++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;};
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
const book=p=>p.evaluate(()=>{const id=JSON.parse(localStorage.getItem('learning-garden-explorers')||'{}').activeId||'explorer-1';return JSON.parse(localStorage.getItem('number-garden-v1:'+id)||'{}');});
const act=(p,a)=>p.locator(`[data-river-action="${a}"]`).first();
const mv=(p,b)=>p.locator(`[data-river-move="${b}"]`);
const status=p=>p.locator('#river-status').innerText();
const focused=p=>p.evaluate(()=>{const a=document.activeElement;return a?.id||a?.dataset?.riverMove||a?.dataset?.riverAction||a?.tagName;});
async function fresh(width,height){const c=await browser.newContext({viewport:{width,height},acceptDownloads:true});const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.errors=errors;await p.goto(url+'#mercado');await p.locator('[data-river-root]').waitFor();return {c,p};}
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
  await press('derecha');ok((await status(p)).includes('Esta es la oficina de correos.'),`${w}: post office announced`);
  ok(await focused(p)==='back',`${w}: focus moves to Back to the plaza`);
  ok((await p.locator('.river-hint').innerText()).includes('Read the line about la plaza again.'),`${w}: the hint`);
  ok(await p.locator('.river-question').count()===1,`${w}: the question after the first arrival`);
  if(w===820){const vis=await p.evaluate(()=>['.river-note','.river-map'].map(s=>{const r=document.querySelector(s).getBoundingClientRect();return r.bottom>0&&r.top<innerHeight;}));eq(vis,[true,true],'820: note and map visible together');}
  if(out)await p.screenshot({path:`${out}/camino-correos-${w}.png`,fullPage:true});
  // Reload mid-walk keeps the node.
  await p.reload();await p.locator('[data-river-root]').waitFor();await act(p,'open-camino').click();await p.locator('.river-map').waitFor();
  ok((await p.locator('#river-teo-place').innerText())==='Teo is at la oficina de correos.',`${w}: reload keeps Teo's place`);
  await act(p,'back').click();await mv(p,'izquierda').click();
  ok((await p.locator('.river-replies').last().innerText()).includes('¡La panadería! Huele a pan. ¡Gracias!')&&await mv(p,'recto').count()===0,`${w}: the bakery replaces the buttons`);
  await p.locator('[data-river-choice="puente"]').click();ok((await p.locator('.river-nudge').innerText()).includes('Teo crossed the puente'),`${w}: a non-fitting pick nudges`);
  await p.locator('[data-river-choice="cafe"]').click();const saved=(await book(p)).spanish.errands.camino;
  ok(saved.state==='done'&&saved.taskEvidence.firstArrival.destination==='correos'&&saved.taskEvidence.hints.includes('correos'),`${w}: done, first arrival at the post office kept`);
  ok((await p.locator('.river-entry').nth(1).innerText()).includes('Done'),`${w}: El camino shows Done`);
  if(out)await p.screenshot({path:`${out}/camino-done-${w}.png`,fullPage:true});
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
}finally{await browser.close();}
console.log(`El camino browser checks: ${n} assertions passed.`);
