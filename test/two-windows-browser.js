// Optional real-browser regressions. Serve dist locally; see the implementation receipt.
const assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
(async()=>{
 const root=path.resolve(__dirname,'..'),load=file=>import(pathToFileURL(path.join(root,'dist',file)).href);
 const {freshState}=await load('core.mjs'),{initializeExplorerState}=await load('progress-transfer.mjs');
 const {startWindows,setWindowsPage,chooseWindowClaim,chooseWindowRelation,toggleWindowLine,checkWindowClaim,chooseWindowCard,setWindowWords,checkWindowMessage}=await load('two-windows-core.mjs');
 const seed=initializeExplorerState(freshState());seed.garden.welcomeFilmSeen=true;const r=startWindows(seed,'sign');
 chooseWindowClaim(seed,'sign-unknown');chooseWindowRelation(seed,'unknown');toggleWindowLine(seed,'sign-B1');checkWindowClaim(seed);
 chooseWindowCard(seed,'sign-note-left');setWindowWords(seed,'  Fictional words.\nExactly kept.  ');checkWindowMessage(seed);setWindowsPage(seed,'compare');
 // A mechanically readable historical result may disagree with today's source metadata.
 r.source.accounts[1].lines[0].text='An earlier whole-sign detail.';r.claimChecks[0].feedback='Earlier recorded feedback.';r.messageChecks[0].fits=false;r.messageChecks[0].feedback='Earlier card feedback.';
 const pw=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),{chromium}=pw.default||pw;
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});let checks=0;
 const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;},ok=(x,m)=>{assert.ok(x,m);checks++;};
 try{
  const p=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'}),errors=[];p.on('pageerror',e=>errors.push(String(e)));
  await p.addInitScript(seed=>{if(!localStorage.getItem('windows-regression-seeded')){localStorage.setItem('number-garden-v1',JSON.stringify(seed));localStorage.setItem('windows-regression-seeded','yes');}},seed);
  const stored=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('number-garden-v1:explorer-1'))),current=async()=>{const s=(await stored()).twoWindows;return s.rounds.find(r=>r.id===s.current);};
  const click=s=>p.locator(s).first().click(),tab=page=>click(`[data-window-page="${page}"]`);
  await p.goto(new URL('#workshop/windows',process.env.WINDOWS_TEST_URL||'http://127.0.0.1:8000/').href);await p.locator('.windows-claim-result').waitFor();
  const feedback=await p.locator('.windows-claim-result').first().textContent();ok(feedback.includes('Earlier recorded feedback.'),'frozen feedback displayed exactly');ok(feedback.includes('Reread both accounts for the missing detail'),'missing-information guidance invites rereading');ok(!feedback.includes('Recorded useful lines'),'missing-information result does not imply proof of absence');
  await p.locator('.windows-claim-result details>summary').first().click();ok((await p.locator('.windows-claim-result').first().textContent()).includes('An earlier whole-sign detail.'),'historical selected source wording preserved');
  await tab('message');const result=p.locator('.windows-message-result').first();const text=await result.textContent(),fit=text.indexOf('Ready-made note fit'),own=text.indexOf('Own words at this moment — ungraded, not part of this card check');ok(fit>=0&&fit<own,'supplied-card verdict separated from ungraded prose');ok(text.indexOf('Earlier card feedback.')<own,'frozen card feedback precedes own writing');ok(text.includes('as recorded: no'),'old contradictory outcome not regraded');eq(await p.locator('#windows-words').inputValue(),r.words,'exact own text restored');
  const original=structuredClone((await current()).messageChecks[0]);await p.reload();await p.locator('#windows-words').waitFor();eq((await current()).messageChecks[0],original,'actual reload preserves old outcome and wording');
  await click('.windows-more-stories>summary');await p.locator('form[data-window-start="flags"] button[type=submit]').click();await tab('compare');await p.locator('#windows-claim').selectOption('flags-inferred');await click('[data-window-relation="inferred"]');await click('[data-window-line="flags-A1"]');await click('[data-window-account="b"]');eq(await p.locator('.windows-live-account:visible').count(),1,'phone shows one active source account');await click('[data-window-line="flags-B1"]');eq((await current()).answers['flags-inferred'].lines,['flags-A1','flags-B1'],'source switch preserves both selected clues');
  await click('#windows-selected-clues>summary');ok((await p.locator('#windows-selected-clues').textContent()).includes('A1'),'clue board keeps hidden account clue');await click('[data-window-check-claim]');ok((await current()).claimChecks.at(-1).evidenceFits,'combined clues accepted');eq(await p.evaluate(()=>document.activeElement.className),'windows-claim-result','check focuses feedback');
  await click('.windows-frozen-source>summary');eq(await p.locator('.windows-frozen-source .windows-account:visible').count(),2,'history preserves both passages regardless of live pagination');
  ok(await p.locator('[data-window-line]:visible').evaluateAll(bs=>bs.every(b=>{const r=b.getBoundingClientRect();return r.width>=44&&r.height>=44;})),'source targets at least44px');ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no phone horizontal overflow');eq(errors,[],'no browser errors');
  console.log(`Two Windows browser regressions: ${checks} assertions passed.`);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
