import {scalePage,bindScale,resetScaleSession} from './route-scale.mjs';
import {prepareRemainsPage,bindRemains,resetRemains} from './returning-ledger-ui.mjs';
import {bridgesPage,bridgesEntry,bindBridges,resetBridgesSession} from './sentence-bridges-ui.mjs';
import {fossilPage,fossilEntry,bindFossil,resetFossilSession} from './fossil-close-ui.mjs';
import {portionsPage,portionsEntry,bindPortions,resetPortionsSession} from './join-portions-ui.mjs';
import {pavingPage,pavingEntry,pavingRefusalPage,bindPaving} from './garden-paving-ui.mjs';
import {preflightPavingDisplay} from './garden-paving-core.mjs';
import {noticePage,noticeEntry,bindNotice} from './puppet-notice-ui.mjs';
import {labelPage,labelEntry,bindLabel,resetLabelTurn} from './exhibit-label-ui.mjs';
import {clockWalkPage,clockWalkEntry,bindClockWalk} from './courier-clock-ui.mjs';
import {lanternPage,lanternEntry,bindLantern} from './lantern-line-ui.mjs';
import {collectionPage,collectionEntry,bindCollection} from './count-collection-ui.mjs';
import {hundredthsPage,hundredthsEntry,bindHundredths} from './hundredths-ui.mjs';
import {seedPage,seedEntry,bindSeed,resetSeedTurn} from './seed-stall-ui.mjs';
import {tenthsPage,tenthsEntry,bindTenths} from './tenths-ui.mjs';
import {sortingPage,bindSorting} from './sorting-desk-ui.mjs';
import {doublePage,bindDoubleCheck} from './willow-double-ui.mjs';
import {cafeStartPanel,bindCafeStart} from './cafe-start-ui.mjs';
import {noteInstructionEntry} from './instruction-core.mjs';
import {willowPathPage,willowPathEntry,bindWillowPath,resetWillowVoice} from './willow-path-ui.mjs';
import {renderInstructions,instructionEntry,bindInstructions} from './instruction-ui.mjs';
import {renderBundleExchange,bundleExchangeEntry,bindBundleExchange} from './bundle-exchange-ui.mjs';
import {renderReturning,returningOrdersEntry,bindReturning} from './returning-orders-ui.mjs';
import {renderJoiningOrders,joiningOrdersEntry,bindJoiningOrders} from './joining-orders-ui.mjs';
import {ledgerSourceExamples,recordLedgerDisplay} from './joining-ledger-core.mjs';
import {joiningLedgerPage,ledgerRefusalPage,bindJoiningLedger,resetJoiningLedger} from './joining-ledger-ui.mjs';
import {renderComparison,comparisonEntry,bindComparison,preflightComparisonDisplay,comparisonExposureNotice} from './comparing-orders-ui.mjs';
import {joiningView,noteJoiningExamples} from './joining-orders-core.mjs';
import {noteBundleDisplay,noteReturningDisplay,noteComparisonDisplay,syncBundleQuestionExposure} from './bundle-broad-exposure.mjs';
import {renderFractionTrail,fractionTrailEntry,bindFractionTrail} from './fraction-trail-ui.mjs';
import {renderParcelPacking,parcelPackingEntry,bindParcelPacking} from './parcel-packing-ui.mjs';
import {wholeBatchesPage,wholeBatchesEntry,bindWholeBatches} from './whole-batches-ui.mjs';
import {townPage,townInvitation,bindTown} from './town-remembers-ui.mjs';
import {townDisplayedFactPairs} from './town-remembers-core.mjs';
import {batchDisplayedFactPairs} from './whole-batches-core.mjs';
import {bellStudioPage,bellStudioEntry,bindBellStudio} from './bell-studio-ui.mjs';
import {createBellPlayer} from './bell-studio-audio.mjs';
import {travelersArchivePage,travelersArchiveEntry,bindTravelersArchive} from './travelers-archive-ui.mjs';
import {travelersArchive,noteArchiveSources} from './travelers-archive-core.mjs';
import {measuringRecipesPage,measuringRecipesEntry,bindMeasuringRecipes} from './measuring-recipes-ui.mjs';
import {measuringDeskPage,measurementEntry,bindMeasuringDesk} from './measuring-desk-ui.mjs';
import {fieldKitPage,fieldKitEntry,bindFieldKit,resetFieldKitTurn} from './field-kit-ui.mjs';
import {rainPathsPage,rainPathsEntry,bindRainPaths} from './rain-paths-ui.mjs';
import {rainDisplayExposure,noteRainDisplayExposure} from './rain-paths-core.mjs';
import {rainNotebookPage,rainNotebookEntry,bindRainNotebook} from './rain-notebook-ui.mjs';
import {noteRainNotebookExposure} from './rain-notebook-core.mjs';
import {bindRainNotebookInvitations,syncRainNotebookExposure} from './rain-notebook-bridge.mjs';
import {sharingCounterPage,sharingCounterEntry,bindSharingCounter} from './sharing-counter-ui.mjs';
import {sharingDisplayedFactPairs} from './sharing-counter-core.mjs';
import {fieldNotebookPage,fieldNotebookEntry,fieldNotebookPlanPanel,bindFieldNotebook} from './field-notebook-ui.mjs';
import {fieldNotebook,noteFieldExposure,fieldDisplayedDays} from './field-notebook-core.mjs';
import {plantStudyPage,plantStudyEntry,plantPlanPanel,bindPlantStudy} from './plant-study-ui.mjs';
import {plantStudy,setPlantDay,notePlantExposure,notePlantExposureUnknown} from './plant-study-core.mjs';
import {letterPage,letterEntry,bindLetterTrail} from './letter-trail-ui.mjs';
import {ensureLetters} from './letter-trail-core.mjs';
import {messagePage,bindMessages} from './message-ui.mjs';
import {ensureMessages} from './message-core.mjs';
import {ensureEqualGroups,noteGroupView} from './equal-groups-core.mjs';
import {equalGroupsPage,equalGroupEntry,equalGroupPairsShown,bindEqualGroups} from './equal-groups-ui.mjs';
import {loftPage,bindLoft} from './loft-ui.mjs';
import {destinationNotes} from './notebook-sections.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from './progress-transfer.mjs';
import {progressTransferPanel} from './progress-transfer-ui.mjs';
import {wordGardenPage,bindWordGarden} from './word-garden-ui.mjs';
import {riddlesPage,riddlesEntry,bindRiddles} from './riddles-ui.mjs';
import {connectionPairsShown} from './learning-connections.mjs';
import {connectionPanel,bindConnections} from './learning-connections-ui.mjs';
import {bindSpiral} from './living-spiral-ui.mjs';
import {adaptivePage as spiralPage,bindAdaptive} from './living-adaptive-ui.mjs';
import {adaptivePairsShown as spiralPairsShown,startAdaptiveSpiral} from './living-adaptive-core.mjs';
import {livingPage,bindLiving} from './living-ui.mjs';
import {ensurePostOffice,currentPostOffice,postOfficeView} from './post-office-core.mjs';
import {postOfficePage,bindPostOffice} from './post-office-ui.mjs';
import {notePendingBrambleFactExposure} from './post-rival.mjs';
import {ensureWorkshop} from './workshop-core.mjs';
import {workshopPage,bindWorkshop} from './workshop-ui.mjs';
import {resetRecutSession} from './ribbon-recut-ui.mjs';
import {resetGatheringBudget} from './gathering-budget-ui.mjs';
import {learningInvitations,learningExplore} from './learning-invitations.mjs';
import {orderValue} from './paris-pack-core.mjs';
import {ensureForage} from './forage-core.mjs';
import {foragePage,bindForage,foragePairsShown} from './forage-ui.mjs';
import {ensureFacts} from './facts-core.mjs';
import {factsPage,bindFacts} from './facts-ui.mjs';
import {orchardPage,bindOrchard} from './orchard-ui.mjs';
import {bindSpeech,stopSpeech,resetSpeechPreferences,setSpeechPreferences,hearButton} from './play-media.mjs';
import {ExplorerStore,EXPLORER_COLORS,EXPLORER_SYMBOLS} from './explorer-storage.mjs';
import {explorerChip,explorerPicker,explorerNotes} from './explorer-ui.mjs';
import {ensurePlantings,earnPlanting,seedOffer,plantingPage,openTasks,openNumberTaskPage,bindPlantings} from './plantings.mjs';
import {pip,dot} from './broad-art.mjs';
import {broadFeedback} from './broad-variants.mjs';
import {broadHelper,openBroadHelp,submitBroadHelp,broadHelpModelAction,renderBroadHelp} from './broad-help.mjs';
import {ensureScience,currentScience} from './science-core.mjs';
import {scienceHome,sciencePage,bindScience} from './science-ui.mjs';
import {coldWindowPage,bindColdWindow} from './cold-window-ui.mjs';
import {evidenceShelfPage,bindEvidenceShelf,resetEvidenceShelf} from './water-evidence-ui.mjs';
import {ensureCafe,nextGuest,orderFor,currentRecipe,cafeSupper} from './cafe-core.mjs';
import {renderCafe,bindCafe} from './cafe-ui.mjs';
import {helpers,helperLimit} from './help-content.mjs';
import {helpPage} from './help-ui.mjs';
import {isFrenchParis,isParisReadingVisit,parisHelper,parisNode,parisVisitStatus} from './paris-visit-source.mjs';
import {guides,avatars} from './companions.mjs';
import {entrances,storyNodes} from './story-content.mjs';
import {ensureGarden,currentVisit,entranceById,startVisit,resumeVisit,storyDraft,noteStorySeen,noteGardenFactExposure,submitStory,finishStoryNode,openStoryHelp,submitStoryHelp,useStoryReadingTool,editStoryOrder,submitStoryOrder} from './garden-core.mjs';
import {gardenHome,parisLanding,frenchLanding,companionLink,companionPicker,storyHub,storyPage,storyEnding,parisRecoveryPage,bindEgyptPhotoFallback} from './garden-ui.mjs';
import {areas} from './broad-content.mjs';
import {ensureBroad,areaById,itemById,beginTrail,trailQuestion,familiarity,noteBroadExposure,noteLegacyExposure,makeBroadObservation,recordTrail,instantiateBroad} from './broad-core.mjs';
import {broadHome,checkinHub,activityLibrary,trailSummary,learningMap,renderModel,adjustModel} from './broad-ui.mjs';
import {observation,recommendations,makePractice,methodLabel,describe,numericAnswer} from './core.mjs';
import {checkin,puzzles,skills} from './content.mjs';
const $=s=>document.querySelector(s), main=$('#main');
let bellPlayer=null;
const stopBell=(reason='page-change')=>bellPlayer?.stop(reason);
const bellPlayback={play:(sequence,callbacks)=>(bellPlayer??=createBellPlayer()).play(sequence,callbacks),stop:stopBell};
document.addEventListener('click',e=>{if(e.target.closest('[data-speak],[data-preview-voice],a[href^="#"]'))stopBell('speech-or-navigation');},true);
window.addEventListener('pagehide',()=>{stopBell('pagehide');stopSpeech();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopBell('hidden');stopSpeech();}});
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let browserStorage;try{browserStorage=localStorage;}catch{}
const explorerStore=new ExplorerStore(browserStorage);
let state=explorerStore.load(),storageOK=!explorerStore.warning,persist=explorerStore.persist;
let choosingExplorer=explorerStore.needsChooser,creatingExplorer=false,explorerDraft={avatar:'sky',color:'gold',symbol:'leaf'},gardenSelection={selected:[],group:''};
if(location.hash!=='#workshop/scale'||choosingExplorer)initializeExplorerState(state);setSpeechPreferences(state.garden?.speech);
let progressImport={candidate:null,message:'',reading:false},importRead=0;
let graph=null;
try {const response=await fetch('./marble-map.json');if(response.ok)graph=await response.json();}catch{}
let screen='',activity=null,active=null,practiceSession=null,routeChoice='auto',puzzleLevel=null,lastAdventure=null;
const blank=()=>({attempts:[],hinted:false,revealed:false,method:null,choice:null,input:'',error:'',exposed:false});
function storageWarning(){return explorerStore.warning||(!storageOK?'This browser cannot save progress right now. You can still explore; download notes before leaving.':'');}
function savingStatus(){return !persist?'Progress lasts only while this page stays open. Download notes before leaving.':!storageOK?'Progress could not be saved reliably. This session is still available; download notes before leaving.':'Progress is saved on this device.';}
function updateStorageNotice(){
 const message=storageWarning();let notice=main.querySelector('[data-save-warning]');
 if(message&&!notice){notice=document.createElement('p');notice.className='storage-warning';notice.dataset.saveWarning='';notice.setAttribute('role','status');main.prepend(notice);}
 if(notice){notice.textContent=message;notice.hidden=!message;}
 const status=main.querySelector('[data-saving-status]');if(status)status.textContent=savingStatus();
}
function save(){storageOK=explorerStore.save(state);persist=explorerStore.persist;updateStorageNotice();}
document.addEventListener('garden-speech-preference',e=>{state.garden.speech=e.detail;save();});
function syncDraft(){
  if(activity?.mode==='checkin')state.baseline.draft={questionId:activity.q.id,...active};
  if(activity?.mode.startsWith('broad-'))state.broad.drafts[`${activity.mode==='broad-checkin'?'checkin':'activity'}:${activity.q.id}`]={...active};
  save();
}
function array(a,b,split=false,label=`${a} rows with ${b} seeds in each row`){return `<div class="array" role="img" aria-label="${esc(label)}" style="grid-template-columns:repeat(${b},1fr)">${Array.from({length:a*b},(_,i)=>`<span class="seed${split&&Math.floor(i/b)>=5?' alt':''}"></span>`).join('')}</div>`;}
function picture(q){if(q.id==='fence')return `<svg viewBox="0 0 300 190" class="fence-picture" role="img" aria-label="A rectangle with top and bottom sides labeled 6 meters, and left and right sides labeled 4 meters"><rect x="65" y="35" width="170" height="115" rx="2" fill="#eaf4ef" stroke="#397958" stroke-width="4" stroke-dasharray="9 5"/><g fill="#183430" font-size="17" text-anchor="middle"><text x="150" y="22">6 m</text><text x="150" y="177">6 m</text><text x="31" y="99">4 m</text><text x="270" y="99">4 m</text></g></svg>`;const noun={mystery:'carrots',patchwork:'flowers',inverse:'bulbs',application:'plants',picnic:'berries'}[q.id]||'seeds';const shown=q.id==='mystery'?`Rows of ${q.b} carrots`:q.id==='patchwork'?`5 rows of yellow flowers and 2 rows of pink flowers, ${q.b} in each row`:`${q.a} rows, ${q.b} in each row`;return `${array(q.a,q.b,q.a>5,q.id==='mystery'?`${q.a} rows of ${q.b} carrots`:q.id==='patchwork'?shown:`${q.a} rows with ${q.b} ${noun} in each row`)}<p class="array-label">${shown}</p>`;}
function flower(x,y,c,n=6){let petals='';for(let k=0;k<n;k++){const t=k*2*Math.PI/n;petals+=`<circle cx="${x+Math.cos(t)*11}" cy="${y+Math.sin(t)*11}" r="8" fill="${c}"/>`;}return `<path d="M${x} ${y+6}V270" stroke="#397958" stroke-width="3"/><path d="M${x} ${y+55}q-26 -29 -28 -7q8 19 28 7M${x} ${y+35}q23 -29 27 -9q-5 19 -27 9" fill="#5b8d68"/>${petals}<circle cx="${x}" cy="${y}" r="6" fill="#183f39"/>`;}
function gardenArt(){let flowers='';for(let r=0;r<3;r++)for(let c=0;c<4;c++)flowers+=flower(98+c*69,74+r*65,['#e9b84a','#da8d8d','#abc4da'][r]);return `<div class="hero-art"><svg viewBox="0 0 440 310" aria-label="A garden of flowers arranged in three rows of four" role="img"><path d="M45 274Q220 251 395 274" fill="none" stroke="#a3bcaa" stroke-width="2"/>${flowers}<path d="M51 276h340" stroke="#183f39" stroke-width="2"/><circle cx="357" cy="41" r="19" fill="#fff" opacity=".8"/><path d="M43 169q-9 -9 -14 2q12 11 14 -2q9 -15 15 -3q-6 13 -15 3" fill="#e9b84a"/></svg><span class="art-note">What do you notice in the garden?</span></div>`;}
function heading(title,body,back=true){return `<div class="page-heading">${back?'<a href="#home" class="back">← Back to the garden</a>':''}<h1>${title}</h1><p>${body}</p></div>`;}
function noteInstructionArrival(){if(choosingExplorer)return;const [desk,page]=(location.hash||'').slice(1).split('/');if(page==='instructions'&&['post','loft'].includes(desk)&&noteInstructionEntry(state,desk))save();}
function navigate(hash){stopBell('navigation');if(location.hash===hash){noteInstructionArrival();render();}else location.hash=hash;}
function home(){return gardenHome(state,persist)+townInvitation(state)+'<section class="word-home-invite"><h2>Behind the library, words are growing.</h2><p>Choose a word plant, add a cutting, and discover what their parts could mean. Familiar words and surprising ideas both belong.</p><a class="primary" href="#words">Explore Word Garden</a></section>'+riddlesEntry();}
function startCheckin(){if(state.baseline.complete){navigate('#summary');return;}const q=checkin[state.baseline.index];activity={mode:'checkin',q};const draft=state.baseline.draft;active=draft?.questionId===q.id?{...blank(),...draft}:blank();
  if(draft?.questionId!==q.id&&(state.exposures?.includes(`${q.a}x${q.b}`)||state.exposures?.includes(`${q.b}x${q.a}`)))active.exposed=true;
  screen='activity';render();focusActivity();}
function checkinIntro(){if(state.baseline.complete)return summary();return `${heading('Let’s see how you think.','Sit together, grab paper or counters if you like, and take one little problem at a time.')}<section class="intro-panel"><div><h2>You bring your ideas.</h2><p>We’ll explore groups, multiplication, and a couple of garden mysteries.</p><ul class="plain-list"><li>You can draw, count, or work it out in your head.</li><li>Hints are welcome. They help us choose what to try next.</li><li>You can leave any question for another day.</li></ul><button class="primary" id="begin-checkin">${state.baseline.index||state.baseline.draft?'Continue exploring':'Let’s begin'}</button><details class="grownup-note"><summary>For grown-ups</summary><p class="tiny status-note">Notice the method as well as the answer. There is no timer.</p></details></div><div class="intro-art" aria-hidden="true">${array(3,4)}</div></section>`;}
function practiceIntro(){const r=recommendations(state);const choices=[['auto','Suggested for us'],['visual','Build equal groups'],['strategy','Connect known facts'],['facts','Make facts familiar'],['mixed','A fresh mix']];return `<section class="resume-strip"><span>Every fact from 1 × 1 through 12 × 12 is open in the multiplication garden.</span><a class="primary" href="#facts">Open the full multiplication garden</a></section>${heading('Grow a few facts.','Six little problems. Try a strategy, use a picture, and take the time you need.')}<div class="intro-panel"><div><h2>A useful place to start</h2><p>${esc(r.reason)}</p><p class="tiny">Your choice is always open.</p><div class="route-options" role="group" aria-label="Choose a practice path">${choices.map(([id,label])=>`<button class="route-choice ${routeChoice===id?'selected':''}" data-route="${id}" aria-pressed="${routeChoice===id}">${label}</button>`).join('')}</div><button id="begin-practice" class="primary">Let’s try six</button><details class="grownup-note"><summary>For grown-ups</summary><p class="tiny">Practice is recorded separately from the check-in.</p></details></div><div class="intro-art" aria-hidden="true">${array(4,3)}</div></div>`;}
function startPractice(){const questions=makePractice(state,routeChoice);state.sessions++;save();practiceSession={questions,index:0,observations:[]};activity={mode:'practice',q:questions[0]};active=blank();active.hinted=!!activity.q.strategyLead||!!activity.q.visual;if(active.hinted)markExposure();screen='activity';render();focusActivity();}
function aside(mode,q){return `<aside class="side-note"><span class="side-mark" aria-hidden="true">✿</span><h3>Thinking together</h3><p>${esc(active.attempts.at(-1)===q.answer||active.revealed?q.talk||'Can you explain the idea in your own words?':'Give time to think. Try asking “What do you notice?” or “How could you start?” Use a hint if you decide to help, so the notes can remember it.')}</p><hr><p>${mode==='checkin'?'Grown-up: after an answer, choose the description that best fits what you saw. Hints and extra tries are kept in the notes.':'A hint is an invitation to learn. Try one, then explain the idea in your own words.'}</p><a href="#notes">Open Grown-up notes</a></aside>`;}
function activityPage(){const {q,mode}=activity;const correct=active.attempts.at(-1)===q.answer;const total=mode==='checkin'?6:mode==='practice'?6:1;const i=mode==='checkin'?state.baseline.index:mode==='practice'?practiceSession.index:0;const label=mode==='checkin'?'A little check-in':mode==='practice'?'Multiplication practice':'Something to wonder';
 return `${heading(label,mode==='checkin'?'We’re noticing how you think. Every method gives us something useful to work with.':mode==='practice'?'Find a connection. Try a picture. See what makes sense.':'Read it together. You can use paper, counters, or a drawing.')}<div class="activity-layout"><section class="activity" aria-label="Math activity"><div class="activity-top"><span>${mode==='puzzle'?esc(q.tag):`${i+1} of ${total}`}</span><span class="steps" aria-hidden="true">${Array.from({length:total},(_,j)=>`<span class="step ${j<i?'done':j===i?'current':''}"></span>`).join('')}</span></div><h2>${esc(q.title)}</h2><p class="question">${esc(q.prompt)}</p>${q.visual||active.showArray?picture(q):''}${!correct?`<form id="answer-form" novalidate>${q.kind==='choice'?`<div class="choices" role="group" aria-label="Choose a number sentence">${q.choices.map((c,j)=>`<button type="button" class="choice ${active.choice===j?'selected':''}" data-choice="${j}" aria-pressed="${active.choice===j}">${esc(c)}</button>`).join('')}</div><button class="primary" type="submit">Try this idea</button>`:`<label class="answer-label" for="answer">Your answer${q.id==='fence'?' (meters)':''}</label><div class="answer-line"><input id="answer" name="answer" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" value="${esc(active.input)}" aria-describedby="answer-error"><button class="primary" type="submit">Try my answer</button></div>`}<span id="answer-error" role="alert" class="tiny">${esc(active.error)}</span></form>`:''}
 <div id="activity-feedback" aria-live="polite">${correct?`<div class="feedback success">That works. ${q.kind==='choice'?'Can you explain why?':'How did you find your answer?'}</div>`:active.attempts.length?'<div class="feedback">Let’s take another look. You can try a picture, get a hint, or skip it for now.</div>':''}</div>
 <div class="support-actions">${!active.hinted?'<button class="text-button" id="hint">A little hint</button>':''}${!q.visual&&!active.showArray?'<button class="text-button" id="show-array">Show a picture</button>':''}${!active.revealed?'<button class="text-button" id="solution">Work it out together</button>':''}</div>
 ${active.hinted?`<div class="hint"><strong>A little hint</strong><p>${esc(q.hint)}</p></div>`:''}${active.revealed?`<div class="solution"><strong>One way to think about it</strong><p>${esc(q.solution)}</p></div>`:''}
 ${correct?`<div class="observation"><fieldset><legend>How did you find it? Choose together.</legend><div class="method-grid">${[['knew','I knew it'],['worked','I worked it out'],['counted','I counted'],['together','We did it together']].map(([id,label])=>`<button type="button" class="method ${active.method===id?'selected':''}" data-method="${id}" aria-pressed="${active.method===id}">${label}</button>`).join('')}</div></fieldset><div class="next-row"><span class="tiny">Your way of thinking matters.</span><button id="next" class="primary" ${!active.method?'disabled':''}>${mode==='puzzle'?'Finish this puzzle':i===5?'See what we noticed':'Next little problem'}</button></div>${active.hinted||active.revealed||active.exposed?`<details class="grownup-note"><summary>For grown-ups</summary>${active.hinted||active.revealed?'<p class="tiny status-note">The notes will remember the support used.</p>':''}${active.exposed?'<p class="tiny status-note">A related example appeared earlier. The notes will remember that, too.</p>':''}</details>`:''}</div>`:`<div class="next-row"><button id="skip" class="text-button">Skip for now</button><a href="#home" class="text-button">Take a break</a></div>`}</section>${aside(mode,q)}</div>`;
}
function record(skip=false){
 if(activity.mode.startsWith('broad-')){
   const q=activity.q,kind=activity.mode==='broad-checkin'?'checkin':'activity';
   const o=makeBroadObservation(q,active,kind,skip,state);
   if(active.attempts.length||active.hinted||active.revealed||active.lessonSeen)markExposure();
   if(kind==='checkin'){recordTrail(state,o);const trail=state.broad.trails[q.area];if(trail.complete)earnPlanting(state,`walk:${q.area}:${trail.visits}`,q.area);}
   else {state.broad.activityObservations.push(o);delete state.broad.drafts[`activity:${q.id}`];lastAdventure=q;earnPlanting(state,active.participationEvent,q.area);screen='adventure-end';}
   activity=null;active=null;save();render();main.focus();window.scrollTo(0,0);return;
 }
 const q=activity.q,o=observation(q,active,active.method||'together',skip,activity.mode);if(active.exposed){o.exposed=true;o.independent=false;}if(active.attempts.length||active.hinted||active.revealed)markExposure();
 if(activity.mode==='checkin'){state.baseline.observations.push(o);state.baseline.index++;delete state.baseline.draft;if(state.baseline.index>=checkin.length){state.baseline.complete=true;activity=null;screen='';save();navigate('#summary');return;}save();startCheckin();}
 else if(activity.mode==='practice'){state.practice.push(o);practiceSession.observations.push(o);practiceSession.index++;save();if(practiceSession.index>=6){activity=null;screen='practice-end';render();main.focus();window.scrollTo(0,0);}else{activity={mode:'practice',q:practiceSession.questions[practiceSession.index]};active=blank();active.hinted=!!activity.q.strategyLead||!!activity.q.visual;if(active.hinted){markExposure();save();}render();focusActivity();}}
 else {state.puzzles.push(o);save();const saved=q;activity=null;screen='puzzle-end';renderPuzzleEnd(saved,o);}
}
function noteRows(){return skills.map(([skill,label])=>{const obs=state.baseline.observations.filter(o=>o.skill===skill);return `<div class="skill-row"><strong>${label}</strong>${obs.length?obs.map(o=>`<p>${esc(o.label)}: ${esc(describe(o))}${o.exposed?' (a related example was seen earlier)':''}.</p>`).join(''):'<p>Not explored yet.</p>'}</div>`;}).join('');}
function summary(){const r=recommendations(state);return `${heading('Here’s what we noticed.','A few observations to help us choose what to try next.')}<section class="summary-callout"><h2>There’s room to grow and explore.</h2><p>${esc(r.reason)}</p><div class="summary-links"><a class="primary" href="#practice">Try a little practice</a><a class="secondary" href="#puzzles">Choose an interesting problem</a></div></section><div class="notes-grid"><section class="panel"><h2>Our check-in observations</h2>${noteRows()}</section><section class="panel"><h2>For your next little session</h2><ul class="plain-list"><li>Pick a small practice set, then choose a puzzle that looks interesting.</li><li>Ask “How did you work that out?” and give time for an explanation.</li><li>Try a fresh example on another day to see what stayed with you.</li></ul><p class="tiny">Only six tasks were sampled. A correct answer can come from different methods. Skips mean “not explored,” and one tricky task is not a verdict about a skill.</p><a href="#notes">See the details in Grown-up notes</a></section></div>`;}
function practiceEnd(){const obs=practiceSession?.observations||[];return `${heading('A little practice, planted.','You tried six problems. That is a good place to pause.')}<div class="summary-callout"><h2>What did you notice?</h2><p>Was there a fact you could connect to something you already knew? Talk about one idea you want to keep.</p><div class="summary-links"><a href="#puzzles" class="primary">Find something to wonder</a><a href="#practice" class="secondary">Choose another practice set</a><a href="#home" class="text-button">Take a break</a></div></div><details class="panel"><summary>See this practice session together</summary>${obs.map(o=>`<div class="evidence-item"><strong>${esc(o.label)}</strong><p>${esc(describe(o))}</p></div>`).join('')}</details>`;}
function puzzlePage(){const rec=recommendations(state);const level=puzzleLevel||rec.suggestion;const opts=[['gentle','Small wonders'],['curious','Curious connections'],['stretch','A bigger stretch']];const icons={picnic:'✦ ✦ ✦',paths:'● ● ●',outfits:'♧ ◇ ♧',mystery:'▦ ?',fence:'▱',patchwork:'▦ ▦'};return `${heading('Something to wonder.','Interesting problems belong here from the start. Choose whichever catches your eye.')}<p class="tiny">${puzzleLevel?'Your chosen path':`Suggested starting path: ${opts.find(([id])=>id===level)[1]}`}. Every path is open.</p><div class="level-options" role="group" aria-label="Choose puzzles">${opts.map(([id,label])=>`<button class="level-choice ${id===level?'selected':''}" data-level="${id}" aria-pressed="${id===level}">${label}</button>`).join('')}</div><div class="puzzle-grid">${puzzles.filter(q=>q.level===level).map(q=>`<article class="puzzle-card"><div class="puzzle-art" aria-hidden="true">${icons[q.id]}</div><span class="tag">${q.tag}</span><h2>${q.title}</h2><p>${q.prompt}</p><button class="secondary" data-puzzle="${q.id}">Explore this one</button></article>`).join('')}</div>`;}
function evidence(o){return `<div class="evidence-item"><strong>${esc(o.label||o.questionId)}: ${esc(describe(o))}</strong><p>${esc(o.prompt)}</p><p>${o.status==='skipped'?'Skipped without an answer.':`Answers tried: ${o.attempts.map(a=>esc(o.questionId==='strategy'?checkin[1].choices[a]??a:a)).join(', ')||'None'}.`}${o.method?` Method: ${esc(methodLabel[o.method]||o.method)}.`:''}${o.hinted?' Hint or picture used.':''}${o.revealed?' Worked example opened.':''}${o.exposed?' Related example seen earlier.':''}</p></div>`;}
function notes(){const rec=recommendations(state);return `${heading('Grown-up notes','A record of individual tasks across the garden. All observations stay in this browser.')}${explorerNotes(explorerStore)}${cafeStartPanel(state)}${progressTransferPanel(progressImport,persist)}${destinationNotes(state,graph)}<div class="warning">${state.baseline.complete?'The original multiplication check-in is complete.':state.baseline.index?`The check-in is partly complete (${state.baseline.index} of 6 recorded).`:'The original multiplication check-in has not started.'} This small, untimed sample cannot establish a grade level or class readiness. “Worked it out” is positive evidence of reasoning; it is different from recalling a fact.</div><div class="notes-grid"><section class="panel"><h2>Original multiplication snapshot</h2>${noteRows()}${!state.baseline.complete?'<p class="status-note"><a href="#multiplication">Start or continue the check-in</a></p>':''}</section><section class="panel"><h2>What to try next</h2><p>${esc(rec.reason)}</p><p>Use a small practice set and keep an interesting problem alongside it. Ask which part felt comfortable and which part you would like to understand better.</p><p>For another session, use different examples. A single independent answer is an observation, not a mastery label.</p><div class="summary-links"><a href="#practice" class="secondary">Choose practice</a><a href="#puzzles" class="secondary">Choose a puzzle</a></div></section></div><details class="panel"><summary>Check-in details (${state.baseline.observations.length} recorded)</summary>${state.baseline.observations.length?state.baseline.observations.map(evidence).join(''):'<p>No answers have been recorded. Begin with a few questions together.</p>'}</details><details class="panel"><summary>Practice details (${state.practice.length} recorded)</summary><p class="tiny">These are learning attempts, kept separate from the check-in.</p>${state.practice.length?state.practice.map(evidence).join(''):'<p>No practice yet. A fresh mix is available even without a check-in.</p>'}</details><details class="panel"><summary>Puzzle details (${state.puzzles.length} recorded)</summary>${state.puzzles.length?state.puzzles.map(evidence).join(''):'<p>No puzzles recorded yet. Every puzzle path is open.</p>'}</details><section class="panel" style="margin-top:24px"><h2>Keep our place?</h2><label class="remember-label"><input type="checkbox" id="remember" ${persist?'checked':''}> Remember progress in this browser</label><p class="tiny status-note"><span data-saving-status>${esc(savingStatus())}</span> Switching this off removes all explorer saves, earlier shared saves, and kept copies from this device. Current sessions stay open in memory; download anything you want to keep first.</p></section><div class="notes-actions"><button class="secondary" id="download">Download our notes</button><button class="text-button" id="reset">Clear this explorer’s progress</button></div><p class="status-note">A download contains these observations, not a child’s name. Clearing this explorer leaves the other explorers in place. It cannot remove a file you already downloaded.</p>`;}
function markExposure(){
  if(!activity?.q)return;
  const q=activity.q;
  if(activity.mode.startsWith('broad-'))noteBroadExposure(state,q,activity.mode==='broad-checkin'?'checkin':'activity');
  const pairs=[];
  if(q.facts?.length)pairs.push(...q.facts);
  if(q.fact&&!pairs.some(p=>p[0]===q.fact[0]&&p[1]===q.fact[1]))pairs.push(q.fact);
  if(!q.fact&&!q.facts?.length&&Number.isFinite(q.a)&&Number.isFinite(q.b))pairs.push([q.a,q.b]);
  const model=active?.model||q.model;
  if(model?.type==='array'&&(activity.mode==='broad-activity'||active?.modelUsed||active?.showArray))pairs.push([model.rows,model.cols]);
  for(const pair of pairs){
    noteLegacyExposure(state,pair);noteGardenFactExposure(state,pair);
    state.exposures??=[];const key=`${pair[0]}x${pair[1]}`;
    if(!state.exposures.includes(key))state.exposures.push(key);
    const draft=state.baseline.draft,savedQuestion=draft&&checkin.find(t=>t.id===draft.questionId);
    if(activity.mode!=='checkin'&&savedQuestion&&((savedQuestion.a===pair[0]&&savedQuestion.b===pair[1])||(savedQuestion.a===pair[1]&&savedQuestion.b===pair[0])))draft.exposed=true;
  }
}
function openBroad(q,mode){
  if(activity?.q.id===q.id&&activity.mode===mode){const saved=state.broad.drafts[`${mode==='broad-checkin'?'checkin':'activity'}:${q.id}`];if(saved?.knownFact)active.knownFact=true;syncBundleQuestionExposure(state,activity.q,active);return;}
  q=instantiateBroad(state,q,mode,explorerStore.active.id);
  activity={q,mode};const key=`${mode==='broad-checkin'?'checkin':'activity'}:${q.id}`;
  const draft=state.broad.drafts[key];
  active=draft?{...blank(),...draft}:{...blank(),...familiarity(state,q)};
  syncBundleQuestionExposure(state,q,active);
  active.question=q;active.variant=q.variant||null;
  if(!active.participationEvent){state.plantings.nextVisit++;active.participationEvent=`adventure:${q.id}:${state.plantings.nextVisit}`;}
  if(mode==='broad-activity'){active.lessonSeen=true;markExposure();}
  syncDraft();
}
function beginJourney(){
  if(!state.broad.journey?.active)state.broad.journey={ids:areas.map(a=>a.id),index:0,active:true};
  const j=state.broad.journey;save();navigate(`#checkin/${j.ids[j.index]}`);
}
function broadActivityPage(){
 const {q,mode}=activity,learning=mode==='broad-activity',correct=active.attempts.at(-1)===q.answer,trail=state.broad.trails[q.area];
 if(active.helper?.open)return renderBroadHelp(q,active);
 const hear=(text,label='Hear it')=>hearButton(text,label),feedback=active.attempts.length?broadFeedback(q,active.attempts.at(-1)).message:'';
 const childLesson=q.childLesson||'Try Pip’s example together. Then bring your own idea to a new question.';
 const exampleOpen=active.exampleOpen??window.innerWidth>=700;
 const model=learning?`<details class="broad-example" id="broad-example" ${exampleOpen?'open':''}><summary>Pip’s example · tap to explore</summary>${renderModel(q,active,true,{mode:'activity'})}</details>`:q.showModel||active.showArray?renderModel(q,active,!!active.showArray,{mode:'checkin'}):'';
 return `<div class="activity-layout"><section class="activity broad-activity" aria-label="Math activity"><div class="activity-top"><span>${learning?'An adventure together':`Garden walk · ${trail.index+1} of 2`}</span><span class="broad-friends" aria-hidden="true">${pip('wave')}${dot(correct?'cheer':active.attempts.length?'puzzled':'think')}</span></div><h2>${esc(q.title)}</h2>${learning?`<p class="broad-lesson-summary">${esc(childLesson)}</p><details class="broad-idea"><summary>Read Pip’s idea</summary><p>${esc(childLesson)}</p>${hear(childLesson,'Hear Pip’s idea')}<details class="lesson"><summary>For grown-ups</summary><p>${esc(q.lesson)}</p>${hear(q.lesson,'Hear the teaching idea')}</details></details>`:''}${learning?model:''}<div class="broad-question-group">${learning?'<h3>Your turn</h3>':''}<p class="question">${esc(q.prompt)}</p>${hear(q.say||q.prompt,'Hear the question')}</div>${learning?'':model}
 ${!correct?`<form id="answer-form" novalidate>${q.kind==='choice'?`<div class="choices" role="group" aria-label="Choose an answer">${q.choices.map((c,i)=>`<button type="button" class="choice ${active.choice===i?'selected':''}" data-choice="${i}" aria-pressed="${active.choice===i}">${esc(c)}</button>`).join('')}</div><button class="primary" type="submit">Try this idea</button>`:`<label class="answer-label" for="answer">Your answer</label><div class="answer-line"><input id="answer" name="answer" type="text" inputmode="numeric" autocomplete="off" value="${esc(active.input)}" aria-describedby="answer-error"><button class="primary" type="submit">Try my answer</button></div>`}<span id="answer-error" role="alert" class="tiny">${esc(active.error)}</span></form>`:''}
 <div id="activity-feedback" aria-live="polite">${correct?`<div class="feedback success broad-celebration">${dot('cheer')}<span>That works. What helped you find it?</span><span class="sprout" aria-hidden="true">❧</span></div>`:feedback?`<div class="feedback">${esc(feedback)}${hear(feedback,'Hear this idea')}</div>`:''}</div><div class="support-actions">${!active.hinted?'<button id="hint"><span aria-hidden="true">✧</span> A little hint</button>':''}${!active.stepsSeen?'<button id="broad-first-step"><span aria-hidden="true">↗</span> Show me the first step</button>':''}<button id="broad-smaller-example"><span aria-hidden="true">▦</span> A smaller example</button>${!learning&&!active.showArray?'<button id="show-array"><span aria-hidden="true">◐</span> Play with a picture</button>':''}${!active.revealed?'<button id="solution"><span aria-hidden="true">☷</span> Work it out together</button>':''}</div>
 ${active.hinted?`<div class="hint"><strong>A little hint</strong><p>${esc(q.hint)}</p>${hear(q.hint,'Hear the hint')}</div>`:''}${active.stepsSeen?`<div class="support-step"><strong>A place to start</strong>${(q.steps||[]).map(step=>`<p>${esc(step)}</p>${hear(step,'Hear the first step')}`).join('')}</div>`:''}${active.revealed?`<div class="solution"><strong>One way to think about it</strong><p>${esc(q.solution)}</p>${hear(q.solution,'Hear this way')}</div>`:''}
 ${correct?`<fieldset><legend>How did you find it? Choose together.</legend><div class="method-grid">${[['knew','I knew it'],['worked','I worked it out'],['counted','I counted'],['together','We did it together']].map(([id,label])=>`<button class="method ${active.method===id?'selected':''}" data-method="${id}" aria-pressed="${active.method===id}">${label}</button>`).join('')}</div></fieldset><div class="next-row"><a href="#numbers" class="text-button">Take a break</a><button id="next" class="primary" ${!active.method?'disabled':''}>${learning?'Keep this idea':trail.index===1?'See what we noticed':'Try the next question'}</button></div>`:`<div class="next-row"><button id="skip" class="text-button">Skip for now</button><a href="#numbers" class="text-button">Take a break</a></div>`}</section><aside class="side-note">${dot(correct?'cheer':'think')}<h3>Dot wonders…</h3><p>${esc(correct||active.revealed?q.talk:'What do you notice? Can you show Pip where you might start?')}</p>${hear(correct||active.revealed?q.talk:'What do you notice? Can you show Pip where you might start?','Hear Dot’s question')}<hr><details class="grownup-note"><summary>For grown-ups</summary><p class="tiny">Notice the method as well as the answer. Every kind of trying is welcome.</p><a href="#map/${q.topicId}">See the learning connection</a></details></aside></div>`;
}
function adventureEnd(){return `${heading('An idea to take with you.','You made time for some mathematical wondering.')}<section class="summary-callout"><h2>${esc(lastAdventure.title)}</h2><p>${esc(lastAdventure.wonder)}</p><p class="tiny">Talk, draw, build, or try it another way.</p><div class="summary-links"><a class="primary" href="#activities/${lastAdventure.area}">More in this garden</a><a class="secondary" href="#checkin">Choose a garden walk</a><a href="#home" class="text-button">Take a break</a></div><details class="grownup-note"><summary>For grown-ups</summary><p class="tiny">This question is for exploring together. The app does not score explanations.</p></details></section>${seedOffer(state)}`;}
function syncFieldPlantExposure(view=null){
 const displayed=view?fieldDisplayedDays(state,view):null;
 if(displayed&&(displayed.days.length||displayed.unknown))noteFieldExposure(state,displayed.days,displayed.unknown);
 const notebook=fieldNotebook(state);
 if(!notebook||notebook.exposureUnknown||displayed?.unknown)notePlantExposureUnknown(state);
 for(const day of new Set([...(notebook?.exposedDays||[]),...(displayed?.days||[])]))notePlantExposure(state,day);
}
function exposeRain(exposure){noteRainDisplayExposure(state,exposure);exposeStoryFacts({facts:exposure.facts});save();}
function render(){
  stopBell('render');stopSpeech();
  const hash=location.hash||'#home', [root,slug,detail]=hash.slice(1).split('/');
  const scaleBench=hash==='#workshop/scale';
  if(!scaleBench||choosingExplorer)resetScaleSession();
  const remainsBench=hash==='#numbers/return/ledger';
  if(!remainsBench||choosingExplorer)resetRemains();
  const bridgesBench=hash==='#loft/bridges';
  if(!bridgesBench||choosingExplorer)resetBridgesSession();
  if(root!=='numbers'||slug!=='join'||detail!=='ledger'||choosingExplorer)resetJoiningLedger();
  if(root!=='science'||slug!=='evidence'||choosingExplorer)resetEvidenceShelf();
  if(root!=='numbers'||slug!=='seeds'||choosingExplorer)resetSeedTurn();
  if(root!=='field'||choosingExplorer)resetFieldKitTurn();
  if(root!=='numbers'||slug!=='path')resetWillowVoice();
  if(root!=='archive'||slug!=='labels'||choosingExplorer)resetLabelTurn();
  if(root!=='workshop'||slug!=='recut'||choosingExplorer)resetRecutSession();
  if(root!=='workshop'||slug!=='budget'||choosingExplorer)resetGatheringBudget();
  if(root!=='cafe'||slug!=='portions'||choosingExplorer)resetPortionsSession();
  if(root!=='living'||slug!=='fossils'||choosingExplorer)resetFossilSession();
  const groupBench=['cafe','post'].includes(root)&&slug==='groups',groupPlace=root==='cafe'?'cafe':'bramble';
  const messageBench=['post','loft'].includes(root)&&slug==='messages';
  const letterBench=['post','loft'].includes(root)&&slug==='letters',instructionBench=['post','loft'].includes(root)&&slug==='instructions';
  const fossilBench=root==='living'&&slug==='fossils',portionsBench=root==='cafe'&&slug==='portions',fractionBench=root==='cafe'&&slug==='fractions',bundleBench=root==='numbers'&&slug==='exchange',returnBench=root==='numbers'&&slug==='return'&&!remainsBench,joiningBench=root==='numbers'&&slug==='join'&&detail!=='ledger',joiningLedgerBench=root==='numbers'&&slug==='join'&&detail==='ledger',comparisonBench=root==='numbers'&&slug==='compare',tenthsBench=root==='numbers'&&slug==='tenths',hundredthsBench=root==='numbers'&&slug==='hundredths',seedBench=root==='numbers'&&slug==='seeds';
  const clockWalkBench=root==='post'&&slug==='clock-walk',pavingBench=root==='numbers'&&slug==='paving';
  const collectionBench=root==='living'&&slug==='collection',lanternBench=root==='numbers'&&slug==='lanterns',noticeBench=root==='loft'&&slug==='printer';
  const plantBench=root==='living'&&slug==='plants',fieldBench=root==='living'&&slug==='notebook'&&detail!=='rain',rainNotebookBench=root==='living'&&slug==='notebook'&&detail==='rain',sharingBench=root==='cafe'&&slug==='sharing',rainBench=root==='science'&&slug==='rain',measureBench=root==='science'&&slug==='measure',recipeBench=root==='cafe'&&slug==='recipes',packingBench=root==='post'&&slug==='packing',sortingBench=root==='post'&&slug==='sorting',doubleBench=root==='post'&&slug==='double-check',batchBench=root==='cafe'&&slug==='batches',labelBench=root==='archive'&&slug==='labels',archiveBench=root==='archive',bellBench=root==='studio'&&slug==='bells';
  // This independent scene must reach its atomic exposure check before normalizers/binders.
  if(scaleBench&&!choosingExplorer){
   let chip=document.querySelector('#explorer-header');if(!chip){chip=document.createElement('div');chip.id='explorer-header';document.querySelector('.header').append(chip);}chip.innerHTML=explorerChip(explorerStore);
   const guide=guides.find(g=>g.id===state.garden?.guide)||guides[0];
   $('#companion-link').innerHTML=companionLink({garden:{guide:guide.id}});
   document.querySelectorAll('.header nav a').forEach(a=>a.setAttribute('aria-current',a.getAttribute('href')==='#workshop'?'page':'false'));
   main.innerHTML=scalePage(state,explorerStore.active.id,{...pavingOptions(),save});
   updateStorageNotice();bindExplorers();
   bindScale({notebook:()=>state,explorerId:()=>explorerStore.active.id,isActive:()=>!choosingExplorer,save,render,focus:focusElement,...pavingOptions()});
   bindSpeech();return;
  }
  ensureGarden(state);ensureCafe(state);ensureScience(state);ensureFacts(state);ensureForage(state);ensureWorkshop(state);ensurePostOffice(state);ensurePlantings(state);
  let chip=document.querySelector('#explorer-header');if(!chip){chip=document.createElement('div');chip.id='explorer-header';document.querySelector('.header').append(chip);}chip.innerHTML=explorerChip(explorerStore);
  const navRoot=['paris','french','archive'].includes(root)?'storm':['checkin','activities','map','multiplication','practice','puzzles','summary','numbers','facts'].includes(root)?'numbers':root;
  $('#companion-link').innerHTML=companionLink(state);
  document.querySelectorAll('.header nav a').forEach(a=>a.setAttribute('aria-current',a.getAttribute('href')===`#${navRoot}`?'page':'false'));
  ensureEqualGroups(state);ensureMessages(state);ensureLetters(state);
  let html,joiningExamples=null;
  if(choosingExplorer)html=explorerPicker(explorerStore,explorerDraft,creatingExplorer);
  else if(bridgesBench)html=bridgesPage(explorerStore.active.id);
  else if(root==='field')html=fieldKitPage(state,slug,explorerStore.active.id);
  else if(bellBench)html=bellStudioPage(state);
  else if(labelBench)html=labelPage(state,detail,explorerStore.active.id);
  else if(archiveBench)html=travelersArchivePage(state)+labelEntry();
  else if(root==='town'&&slug==='remembers'){const pairs=townDisplayedFactPairs(state,detail);if(pairs.length){exposeStoryFacts({facts:pairs});save();}html=townPage(state,detail);}
  else if(bundleBench){const view=renderBundleExchange(state);html=view.html;const live=activity?.mode.startsWith('broad-')?{question:activity.q,active}:null;const changed=noteBundleDisplay(state,view.examples,live);exposeStoryFacts({facts:view.facts});if(changed||view.facts.length)save();}
  else if(remainsBench){const v=prepareRemainsPage(state,explorerStore.active.id,candidate=>prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok);html=v.html;if(v.changed)save();if(v.refused)queueMicrotask(()=>{if(location.hash==='#numbers/return/ledger')focusElement('#remains-status');});}
  else if(returnBench){const view=renderReturning(state,detail);html=view.html;const live=activity?.mode.startsWith('broad-')?{question:activity.q,active}:null;if(noteReturningDisplay(state,view.examples,live))save();}
  else if(comparisonBench){const view=renderComparison(state,detail);const options={canExport:candidate=>prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok,recordDisplay:(candidate,examples)=>noteComparisonDisplay(candidate,examples)};const prior=state.comparisonSupplies;if(preflightComparisonDisplay(state,view.examples,options)){html=view.html;if(state.comparisonSupplies!==prior)save();}else html=comparisonExposureNotice();}
  else if(root==='numbers'&&slug==='path')html=willowPathPage(state);
  else if(tenthsBench)html=tenthsPage(state);
  else if(pavingBench){const fits=preflightPavingDisplay(state,pavingOptions());html=fits?pavingPage(state):pavingRefusalPage();if(fits)save();}
  else if(clockWalkBench)html=clockWalkPage(state);
  else if(sortingBench)html=sortingPage(state);
  else if(doubleBench)html=doublePage(state,detail);
  else if(hundredthsBench)html=hundredthsPage(state);
  else if(seedBench)html=seedPage(state);
  else if(lanternBench)html=lanternPage(state);
  else if(noticeBench)html=noticePage(state);
  else if(joiningLedgerBench){const v=joiningView(state),examples=v.source?ledgerSourceExamples(v.source):[];const outcome=recordLedgerDisplay(state,examples,candidate=>prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok);html=outcome.ok?joiningLedgerPage(state,explorerStore.active.id):ledgerRefusalPage();if(outcome.changed)save();if(!outcome.ok)queueMicrotask(()=>{if(location.hash==='#numbers/join/ledger')focusElement('#ledger-notice');});}
  else if(joiningBench){const view=renderJoiningOrders(state);html=view.html;joiningExamples=view.examples;exposeStoryFacts({facts:view.facts});}
  else if(fossilBench)html=fossilPage(explorerStore.active.id);
  else if(portionsBench)html=portionsPage(explorerStore.active.id);
  else if(fractionBench)html=renderFractionTrail(state).html+tenthsEntry();
  else if(recipeBench)html=measuringRecipesPage(state)+fieldKitEntry('jug');
  else if(measureBench)html=measuringDeskPage(state,explorerStore.active.id);
  else if(packingBench){const view=renderParcelPacking(state);if(view.facts.length){exposeStoryFacts({facts:view.facts});save();}html=view.html;}
  else if(batchBench){exposeStoryFacts({facts:batchDisplayedFactPairs(state)});save();html=wholeBatchesPage(state);}
  else if(rainBench){syncRainNotebookExposure(state,{view:'known',rootExposer:exposeRain});html=rainPathsPage(state)+fieldKitEntry('weather');}
  else if(sharingBench){exposeStoryFacts({facts:sharingDisplayedFactPairs(state)});save();html=sharingCounterPage(state);}
  else if(rainNotebookBench)html=rainNotebookPage(state);
  else if(collectionBench)html=collectionPage(state);
  else if(fieldBench){syncFieldPlantExposure('notebook');save();html=fieldNotebookPage(state)+collectionEntry();}
  else if(plantBench){syncFieldPlantExposure();const ps=plantStudy(state);if(ps){setPlantDay(state,ps.day);save();}html=plantStudyPage(state)+fieldKitEntry('cress');}
  else if(instructionBench)html=renderInstructions(state,root).html;
  else if(letterBench)html=letterPage(state,root,detail)+(root==='post'?fieldKitEntry('notice'):'');
  else if(messageBench)html=messagePage(state,root,detail);
  else if(groupBench){if(detail!=='choose'){noteGroupView(state,groupPlace);exposeStoryFacts({facts:equalGroupPairsShown(state,groupPlace)});save();}html=equalGroupsPage(state,groupPlace,detail);}
  else if(root==='regrow'){syncFieldPlantExposure('planting');save();html=plantingPage(state,Number(slug||0))+plantPlanPanel(state)+fieldNotebookPlanPanel(state);}
  else if(root==='wonder'){html=openNumberTaskPage(state,slug);save();}
  else if(root==='french')html=frenchLanding(state);
  else if(root==='paris')html=parisLanding(state)+travelersArchiveEntry();
  else if(root==='words')html=wordGardenPage(state);
  else if(root==='riddles')html=riddlesPage(state);
  else if(root==='facts')html=factsPage(state,slug);
  else if(root==='orchard'){
    if(slug==='gather'){const pairs=foragePairsShown(state,detail);if(pairs.length){exposeStoryFacts({facts:pairs});save();}html=foragePage(state,detail);}
    else html=orchardPage(state,slug);
  }
  else if(root==='living'){if(slug==='first')html=livingPage(state)+'<aside class="living-invitation"><h2>Ready to follow another trail?</h2><p>Meet different animals and compare changing clues. Your first visit stays here.</p><a class="secondary" href="#living">Explore more Living Garden trails</a></aside>';else{const pairs=slug==='visit'?spiralPairsShown(state):[];if(pairs.length){exposeStoryFacts({facts:pairs});save();}html=spiralPage(state,slug);}const otherLiving=plantStudyEntry()+fieldNotebookEntry()+collectionEntry()+rainNotebookEntry()+(!slug?fieldKitEntry('walk')+fossilEntry():'');html+=slug==='movement'?`<details class="body-movement-other"><summary>Other Living Garden investigations</summary>${otherLiving}</details>`:otherLiving;}
  else if(root==='post')html=equalGroupEntry('bramble')+postOfficePage(state,slug)+letterEntry('post')+instructionEntry('post')+parcelPackingEntry()+bellStudioEntry()+clockWalkEntry()+bridgesEntry();
  else if(root==='workshop')html=slug==='recut'||slug==='budget'?workshopPage(state,slug,explorerStore.active.id):workshopPage(state,slug);
  else if(root==='explore')html=learningExplore(graph,slug);
  else if(root==='science'){
    html=slug==='window'?coldWindowPage():slug==='evidence'?evidenceShelfPage(explorerStore.active.id):slug==='choose'?scienceHome(state,detail):slug==='play'&&currentScience(state)?sciencePage(state):scienceHome(state);
    if(!['evidence','window'].includes(slug))html+=rainPathsEntry()+measurementEntry();
  }
  else if(root==='cafe'){
    if(state.cafe.current){const o=orderFor(state.cafe);exposeStoryFacts({facts:[[o.guests,o.bites],...(state.cafe.current.stage==='stock'?currentRecipe(state.cafe).map(item=>[o.guests,item.count]):[])]});}
    save();html=equalGroupEntry('cafe')+renderCafe(state)+portionsEntry()+sharingCounterEntry()+fractionTrailEntry()+measuringRecipesEntry()+wholeBatchesEntry()+bellStudioEntry();
  }
  else if(root==='companions')html=companionPicker(state);
  else if(root==='storm'){
    const visit=currentVisit(state);
    if(slug==='choose'){const parts=hash.slice(1).split('/');const place=parts[3],variant=parts[4];html=storyHub(state,detail,['paris','french'].includes(detail)&&place?{destination:place,variant:variant==='auto'?'auto':Number(variant),storyId:parts[5]||null}:null);}
    else if((slug==='play'||slug==='end')&&visit){
      if(isParisReadingVisit(visit)&&parisVisitStatus(visit)!=='current')html=parisRecoveryPage(state);
      else if(visit.finished)html=storyEnding(state);
      else {const draft=storyDraft(state);noteStorySeen(state);exposeStoryFacts(isParisReadingVisit(visit)?parisNode(visit,visit.node):storyNodes[visit.node],`${visit.id}:${visit.node}`);save();html=draft.helper?.open?helpPage(state,draft):storyPage(state,draft);}
    }else html=storyHub(state);
  }
  else if(root==='numbers')html=broadHome(state,graph,gardenArt,gardenSelection)+pavingEntry()+bundleExchangeEntry()+returningOrdersEntry()+joiningOrdersEntry()+comparisonEntry()+tenthsEntry()+hundredthsEntry()+seedEntry()+lanternEntry()+willowPathEntry()+'<section class="resume-strip garden-progress-link"><span>Every seed you plant is a small hello to the garden.</span><a class="secondary" href="#regrow">Visit our growing garden</a></section>'+seedOffer(state);
  else if(screen==='adventure-end')html=adventureEnd();
  else if(root==='checkin'&&areaById(slug)){
    const t=beginTrail(state,slug);save();
    if(t.complete)html=trailSummary(state,slug,graph)+seedOffer(state);
    else {openBroad(trailQuestion(state,slug),'broad-checkin');html=broadActivityPage();}
  }else if(root==='adventure'&&itemById(slug)?.lesson){openBroad(itemById(slug),'broad-activity');html=broadActivityPage();}
  else if(screen==='activity'&&activity)html=activityPage();
  else if(screen==='practice-end')html=practiceEnd();
  else if(root==='checkin')html=checkinHub(state);
  else if(root==='activities')html=activityLibrary(state,graph,areaById(slug)?slug:'all')+openTaskLibrary(slug);
  else if(root==='map')html=learningMap(state,graph,slug);
  else if(root==='multiplication')html=checkinIntro();
  else if(root==='practice')html=practiceIntro();
  else if(root==='puzzles')html=puzzlePage();
  else if(root==='summary')html=summary();
  else if(root==='notes')html=notes();
  else if(root==='loft')html=loftPage(state)+letterEntry('loft')+instructionEntry('loft')+noticeEntry()+bridgesEntry();
  else html=home()+travelersArchiveEntry()+bellStudioEntry();
  if(!choosingExplorer&&!bridgesBench&&!groupBench&&!messageBench&&!letterBench&&!instructionBench&&!plantBench&&!fieldBench&&!collectionBench&&!rainNotebookBench&&!sharingBench&&!rainBench&&!measureBench&&!recipeBench&&!packingBench&&!sortingBench&&!doubleBench&&!pavingBench&&!clockWalkBench&&!batchBench&&!fractionBench&&!bundleBench&&!returnBench&&!remainsBench&&!joiningBench&&!joiningLedgerBench&&!comparisonBench&&!fossilBench&&!portionsBench&&!tenthsBench&&!hundredthsBench&&!seedBench&&!lanternBench&&!noticeBench&&!archiveBench&&!bellBench&&!(root==='science'&&['evidence','window'].includes(slug))){const context={loft:'loft',numbers:'numbers',science:'water',cafe:'cafe',orchard:'orchard',paris:'paris'}[root]||(root==='activities'&&['measurement','fractions'].includes(slug)?slug:null);if(context)html+=learningInvitations(context);}
  if(!choosingExplorer&&!bridgesBench&&!groupBench&&!messageBench&&!letterBench&&!instructionBench&&!plantBench&&!fieldBench&&!collectionBench&&!rainNotebookBench&&!sharingBench&&!rainBench&&!measureBench&&!recipeBench&&!packingBench&&!sortingBench&&!doubleBench&&!pavingBench&&!clockWalkBench&&!batchBench&&!fractionBench&&!bundleBench&&!returnBench&&!remainsBench&&!joiningBench&&!joiningLedgerBench&&!comparisonBench&&!fossilBench&&!portionsBench&&!tenthsBench&&!hundredthsBench&&!seedBench&&!lanternBench&&!noticeBench&&!archiveBench&&['living','cafe','post'].includes(root)){const target=root==='post'?'bramble':root,pairs=connectionPairsShown(state,target);if(pairs.length){exposeStoryFacts({facts:pairs});save();}html+=connectionPanel(state,target);}

  main.innerHTML=(state.broad.draftNotice?'<section class="storage-warning" role="status"><p>Some paused questions could not be resumed. Their earlier work is kept in <a href="#notes">Grown-up notes</a>; it is not scored against the current question.</p><button class="secondary" id="dismiss-draft-notice">Keep exploring</button></section>':'')+html;
  bindEgyptPhotoFallback(main);
  if(joiningExamples!==null){const shown=noteJoiningExamples(state,joiningExamples);const live=activity?.mode.startsWith('broad-')?{question:activity.q,active}:null;if(noteBundleDisplay(state,[],live)||shown)save();}
  updateStorageNotice();bind();
  const film=endingFilm();if(film)queueMicrotask(()=>{if(endingFilm()===film)playFilm(film);});
}
function focusActivity(){const title=$('.activity h2');if(title){title.tabIndex=-1;title.focus();}}
function focusElement(selector){const element=$(selector);if(element){if(!element.matches('a[href],button,input,select,textarea,summary,[tabindex]'))element.tabIndex=-1;element.focus();}}
function focusExploreStart(){if(!choosingExplorer&&(location.hash||'').slice(1).split('/')[0]==='explore'){focusElement('#explore-title');return true;}return false;}
function rerenderActivity(){const input=$('#answer');if(input)active.input=input.value;syncDraft();render();}
function openTaskLibrary(selected){return `<section class="panel broad-open-invites"><h2>Questions with room for your ideas</h2><p>Wonder, estimate, invent, and explain together. These invitations have no scored answer.</p><div class="open-task-links">${openTasks().filter(t=>!areaById(selected)||t.area===selected).map(t=>`<a class="secondary" href="#wonder/${t.id}">${esc(t.title)}</a>`).join('')}</div></section>`;}
function notesReport(notebook){return {title:'After the Storm: observations',exportedAt:new Date().toISOString(),note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:explorerStore.active.avatar,color:explorerStore.active.color,symbol:explorerStore.active.symbol},recommendation:recommendations(notebook),...notebook};}
function downloadText(text,name){const url=URL.createObjectURL(new Blob([text],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function confirmGardenAction(title,explanation,action){const d=document.createElement('dialog');d.innerHTML=`<div class="dialog-content"><h2>${esc(title)}</h2><p>${esc(explanation)}</p><div class="dialog-actions"><button class="secondary" data-confirm-cancel>Keep it</button><button class="primary danger" data-confirm-do>Remove it</button></div></div>`;document.body.append(d);d.showModal();d.querySelector('[data-confirm-cancel]').onclick=()=>d.close();d.querySelector('[data-confirm-do]').onclick=()=>{stopBell('confirmed-action');action();d.close();render();};d.addEventListener('close',()=>d.remove());}
function cancelProgressImport(){importRead++;progressImport={candidate:null,message:'',reading:false};}
function useExplorer(next,destination='#home'){
 if(!next)return;stopBell('explorer-or-import');cancelProgressImport();resetWillowVoice();resetEvidenceShelf();resetSeedTurn();resetRecutSession();resetGatheringBudget();resetPortionsSession();resetFossilSession();resetScaleSession();state=next;initializeExplorerState(state);setSpeechPreferences(state.garden.speech);
 activity=null;active=null;practiceSession=null;screen='';lastAdventure=null;routeChoice='auto';puzzleLevel=null;gardenSelection={selected:[],group:''};choosingExplorer=false;creatingExplorer=false;persist=explorerStore.persist;save();navigate(destination);
 if(destination!=='#notes')playFilm('welcome');
}
function freshExplorerChoice(){for(const avatar of ['sky','fern','reed'])for(const color of EXPLORER_COLORS)for(const symbol of EXPLORER_SYMBOLS)if(!explorerStore.explorers.some(p=>p.avatar===avatar&&p.color===color&&p.symbol===symbol))return {avatar,color,symbol};return explorerDraft;}
function chooseExplorer(create=false){cancelProgressImport();if(create)explorerDraft=freshExplorerChoice();if(activity)syncDraft();choosingExplorer=true;creatingExplorer=create;stopSpeech();render();main.focus();window.scrollTo(0,0);}
function bindProgressTransfer(){
 if(explorerStore.importUncertain)document.querySelectorAll('#remember,#reset,#clear-all-explorers,[data-remove-copy]').forEach(el=>el.disabled=true);
 $('#progress-file')?.addEventListener('change',async e=>{
  const file=e.target.files?.[0];if(!file)return;stopBell('import');
  const token=++importRead,explorer=explorerStore.active.id;
  progressImport={candidate:null,message:'',reading:true};render();
  let candidate;
  try{candidate=file.size>MAX_IMPORT_BYTES?{ok:false,message:'Choose a notes JSON file up to 5 MB. The original file is unchanged.'}:prepareProgressImport(await file.text());}
  catch{candidate={ok:false,message:'This file could not be read. Choose the downloaded JSON notes file again.'};}
  if(token!==importRead||location.hash!=='#notes'||choosingExplorer||explorer!==explorerStore.active.id)return;
  progressImport={candidate:candidate.ok?candidate:null,message:candidate.ok?'File checked. Nothing has been imported yet.':candidate.message,reading:false};render();focusElement(candidate.ok?'#progress-import-preview':'#progress-import-status');
 });
 $('#progress-import-cancel')?.addEventListener('click',()=>{cancelProgressImport();progressImport.message='Import canceled. Existing progress is unchanged.';render();focusElement('#progress-file');});
 $('#progress-import-confirm')?.addEventListener('click',()=>{
  const result=explorerStore.importState(progressImport.candidate);
  if(!result.ok){progressImport.message=result.message;render();focusElement('#progress-import-status');return;}
  useExplorer(result.state,'#notes');progressImport.message=result.temporary?'Notebook brought into a separate explorer for this session. Saving is off; keep your file.':'Notebook brought into a separate explorer. Existing explorers are still available using Switch explorer.';render();focusElement('#progress-import-status');
 });
}
function bindExplorers(){
 bindProgressTransfer();
 $('#explorer-switch')?.addEventListener('click',()=>chooseExplorer());
 $('#notes-switch-explorer')?.addEventListener('click',()=>chooseExplorer());$('#notes-add-explorer')?.addEventListener('click',()=>chooseExplorer(true));
 $('#explorer-new')?.addEventListener('click',()=>{explorerDraft=freshExplorerChoice();creatingExplorer=true;render();});
 $('#explorer-back')?.addEventListener('click',()=>{creatingExplorer=false;render();});
 $('#explorer-cancel')?.addEventListener('click',e=>{e.preventDefault();choosingExplorer=false;creatingExplorer=false;noteInstructionArrival();render();});
 document.querySelectorAll('[data-select-explorer]').forEach(b=>b.onclick=()=>useExplorer(explorerStore.select(b.dataset.selectExplorer,state)));
 for(const field of ['avatar','color','symbol'])document.querySelectorAll(`[data-explorer-${field}]`).forEach(b=>b.onclick=()=>{explorerDraft[field]=b.dataset[`explorer${field[0].toUpperCase()+field.slice(1)}`];render();$(`[data-explorer-${field}="${explorerDraft[field]}"]`)?.focus();});
 $('#explorer-create')?.addEventListener('click',()=>useExplorer(explorerStore.add(explorerDraft,state)));
 document.querySelectorAll('[data-download-copy]').forEach(b=>b.onclick=()=>{const copy=explorerStore.keptCopies()[Number(b.dataset.downloadCopy)];if(copy)downloadText(copy.raw,`number-garden-notes-kept-${new Date().toISOString().slice(0,10)}.json`);});
 document.querySelectorAll('[data-remove-copy]').forEach(b=>b.onclick=()=>{const copy=explorerStore.keptCopies()[Number(b.dataset.removeCopy)];if(copy)confirmGardenAction('Remove this kept copy?','Download it first if you want to keep it. Other explorer records remain.',()=>explorerStore.removeCopy(copy.key));});
 $('#clear-all-explorers')?.addEventListener('click',()=>confirmGardenAction('Clear every explorer?','This removes every saved explorer, earlier shared save, backup and kept copy from this device. Download notes first. Downloaded files are unaffected.',()=>useExplorer(explorerStore.clearAll())));
}
function bindBroadExtras(){
 document.querySelectorAll('[data-garden-flower]').forEach(b=>b.onclick=()=>{const n=Number(b.dataset.gardenFlower);gardenSelection.selected=gardenSelection.selected.includes(n)?gardenSelection.selected.filter(x=>x!==n):[...gardenSelection.selected,n];render();$(`[data-garden-flower="${n}"]`)?.focus();});
 document.querySelectorAll('[data-garden-group]').forEach(b=>b.onclick=()=>{gardenSelection.group=b.dataset.gardenGroup==='clear'?'':b.dataset.gardenGroup;if(b.dataset.gardenGroup==='clear')gardenSelection.selected=[];render();$(`[data-garden-group="${b.dataset.gardenGroup}"]`)?.focus();});
 if(!activity?.mode.startsWith('broad-'))return;
 const q=activity.q,helper=active.helper;
 $('#broad-example')?.addEventListener('toggle',e=>{const open=e.target.open;if(active.exampleOpen===open)return;active.exampleOpen=open;syncDraft();});
 $('#broad-first-step')?.addEventListener('click',()=>{active.stepsSeen=true;markExposure();rerenderActivity();focusElement('.support-step');});
 $('#broad-smaller-example')?.addEventListener('click',()=>{const input=$('#answer');if(input)active.input=input.value;const h=openBroadHelp(q,active);exposeStoryFacts({facts:h.facts||[]});earnPlanting(state,'help:helper',null,'helper');markExposure();syncDraft();render();focusElement('#broad-help-title');});
 $('#broad-help-answer')?.addEventListener('input',e=>{helper.input=e.target.value;helper.error='';syncDraft();});
 document.querySelectorAll('[data-broad-help-choice]').forEach(b=>b.onclick=()=>{helper.choice=Number(b.dataset.broadHelpChoice);syncDraft();render();$(`[data-broad-help-choice="${helper.choice}"]`)?.focus();});
 document.querySelectorAll('[data-broad-help-action]').forEach(b=>b.onclick=()=>{broadHelpModelAction(q,active,b.dataset.broadHelpAction);syncDraft();render();focusElement('.helper-model');});
 $('#broad-help-answer-form')?.addEventListener('submit',e=>{e.preventDefault();const h=broadHelper(q),value=h.kind==='choice'?helper.choice:numericAnswer($('#broad-help-answer').value);if(value===null){helper.error='Try a whole number or return to your waiting question.';}else submitBroadHelp(q,active,value);syncDraft();render();focusElement('#broad-help-title');});
 $('#broad-help-explain')?.addEventListener('click',()=>{helper.revealed=true;syncDraft();render();focusElement('.solution');});
 $('#broad-help-return')?.addEventListener('click',()=>{helper.open=false;syncDraft();render();focusElement('#answer, [data-choice]');});
}
function pavingOptions(){return {canExport:candidate=>prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok,exposeFacts:(pairs,target)=>exposeStoryFacts({facts:pairs},null,target,true)};}
function bind(){
 bindPaving(state,{save,render,focus:focusElement,...pavingOptions()});
 bindNotice(state,{save,render,focus:focusElement,canExport:candidate=>prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok});
 bindLabel(state,{save,render,navigate,focus:focusElement,canExport:candidate=>prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok,explorerId:()=>explorerStore.active.id});
 bindClockWalk(state,{save,render,focus:focusElement,canExport:candidate=>prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok});
 bindSeed(state,{save,render,focus:focusElement,canExport:candidate=>prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok,downloadNotes:()=>downloadText(JSON.stringify(notesReport(state),null,2),`number-garden-notes-${explorerStore.active.symbol}-${new Date().toISOString().slice(0,10)}.json`)});
 bindLantern(state,{save,render,focus:focusElement,canExport:candidate=>prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok});
 bindCollection(state,{save,render,focus:focusElement,canExport:candidate=>prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok});
 bindHundredths(state,{save,render,focus:focusElement,canExport:candidate=>prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok,exposeFacts:(pairs,target=state)=>exposeStoryFacts({facts:pairs},null,target,true)});
 bindTenths(state,{save,render,focus:focusElement,canExport:candidate=>prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok});
 bindSorting(state,{save,render,focus:focusElement,canExport:candidate=>prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok});
 bindDoubleCheck(state,{save,render,navigate,focus:focusElement,canExport:candidate=>prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok,explorerId:()=>explorerStore.active.id,isActive:()=>!choosingExplorer});
 bindCafeStart(state,{save,render,focus:focusElement});
 bindWillowPath(state,{save,render,focus:focusElement,canExport:candidate=>prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok});
 bindBellStudio(state,{save,render,navigate,focus:focusElement,player:bellPlayback,stopSpeech});
 bindFieldKit(state,{save,render,navigate,focus:focusElement,canExport:candidate=>prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok,explorerId:()=>explorerStore.active.id});
 bindMeasuringDesk(state,{save,render,focus:focusElement,canExport:candidate=>prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok,explorerId:()=>explorerStore.active.id});
 bindTravelersArchive(state,{save,render,navigate,focus:focusElement});
 document.querySelector('[data-ta-notes]')?.addEventListener('toggle',e=>{if(e.currentTarget.open){const a=travelersArchive(state);if(a){const ids=[...new Set([...a.checks.flatMap(c=>c.sourceIds),...(a.kept?['photo','chronology']:[])])];if(ids.length){noteArchiveSources(state,ids);save();}}}});
 bindInstructions(state,(location.hash||'').startsWith('#loft')?'loft':'post',{save,render,navigate,focus:focusElement});
 bindBundleExchange(state,{save,render,navigate,focus:focusElement});
 bindReturning(state,{save,render,navigate,focus:focusElement,noteDisplay:examples=>{if(noteReturningDisplay(state,examples))save();},canExport:candidate=>prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok});
 const remainsOwner=explorerStore.active.id;
 bindRemains(state,{explorerId:remainsOwner,isActive:()=>!choosingExplorer&&location.hash==='#numbers/return/ledger'&&explorerStore.active.id===remainsOwner,save,render,focus:focusElement,canExport:candidate=>prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok});
 bindJoiningOrders(state,{save,render,navigate,canExport:candidate=>prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok,focus:focusElement});
 const ledgerOwner=explorerStore.active.id;
 bindJoiningLedger(state,{explorerId:ledgerOwner,isActive:()=>!choosingExplorer&&location.hash==='#numbers/join/ledger'&&explorerStore.active.id===ledgerOwner,save,render,focus:focusElement,canExport:candidate=>prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok});
 bindComparison(state,{save,render,focus:focusElement,canExport:candidate=>prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok,recordDisplay:(candidate,examples)=>noteComparisonDisplay(candidate,examples)});
 bindFractionTrail(state,{save,render,navigate,focus:focusElement});
 bindMeasuringRecipes(state,{save,render,navigate,focus:focusElement});
 bindParcelPacking(state,{save,render,navigate,focus:focusElement});
 bindWholeBatches(state,{save,render,navigate,focus:focusElement});
 bindTown(state,{save,render,navigate,focus:focusElement});
 bindRainPaths(state,{save,render,navigate,focus:focusElement,expose:exposeRain});
 bindRainNotebookInvitations(state,{save,navigate,focus:focusElement});
 bindRainNotebook(state,{save,render,navigate,focus:focusElement,expose:exposure=>{noteRainNotebookExposure(state,exposure);exposeRain(exposure);}});
 document.querySelector('[data-rp-notes]')?.addEventListener('toggle',e=>{if(e.currentTarget.open){const exposure=rainDisplayExposure(state,{view:'notes'});noteRainDisplayExposure(state,exposure);exposeStoryFacts({facts:exposure.facts});save();}});
 bindSharingCounter(state,{save,render,navigate,focus:focusElement});
 document.querySelector('[data-sc-notes]')?.addEventListener('toggle',e=>{if(e.currentTarget.open){exposeStoryFacts({facts:sharingDisplayedFactPairs(state,'notes')});save();}});
 document.querySelector('.town-notes')?.addEventListener('toggle',e=>{if(e.currentTarget.open){const pairs=townDisplayedFactPairs(state,null,'notes');if(pairs.length){exposeStoryFacts({facts:pairs});save();}}});
 bindFieldNotebook(state,{save,render,navigate,focus:focusElement});
 document.querySelector('[data-fn-notes]')?.addEventListener('toggle',e=>{if(e.currentTarget.open){syncFieldPlantExposure('notes');syncRainNotebookExposure(state,{view:'notes',rootExposer:exposeRain});save();}});
 document.querySelector('[data-rn-notes]')?.addEventListener('toggle',e=>{if(e.currentTarget.open)syncRainNotebookExposure(state,{view:'notes',rootExposer:exposeRain});});
 document.querySelector('[data-ps-notes]')?.addEventListener('toggle',e=>{if(e.currentTarget.open){const ps=plantStudy(state);if(!ps||Object.hasOwn(ps,'recovered'))notePlantExposureUnknown(state);if(ps?.plan)notePlantExposure(state,ps.plan.observation.day);save();}});
 bindPlantStudy(state,{save,render,navigate,focus:focusElement});
 const [egRoot,egSlug]=(location.hash||'#home').slice(1).split('/');
 if(egSlug==='letters'&&['post','loft'].includes(egRoot))bindLetterTrail(state,egRoot,{save,render,navigate,focus:focusElement});
 if(egSlug==='messages'&&['post','loft'].includes(egRoot))bindMessages(state,egRoot,{save,render,navigate,focus:focusElement});
 if(egSlug==='groups'&&['cafe','post'].includes(egRoot))bindEqualGroups(state,egRoot==='cafe'?'cafe':'bramble',{save,render,navigate,focus:focusElement});
 document.querySelectorAll('[data-film-replay]').forEach(button=>button.addEventListener('click',()=>playFilm(button.dataset.filmReplay,{replay:true})));
 $('#dismiss-draft-notice')?.addEventListener('click',()=>{state.broad.draftNotice=false;save();render();main.focus();});
 bindExplorers();bindBroadExtras();bindPlantings(state,{save,render,navigate,focus:focusElement});
 bindStory();
 bindFacts(state,{save,render,focus:focusElement,exposeFacts:pairs=>exposeStoryFacts({facts:pairs})});
 bindOrchard(state,{save,render,focus:focusElement});
 bindForage(state,{save,render,focus:focusElement,exposeFacts:pairs=>exposeStoryFacts({facts:pairs})});
 bindWordGarden(state,{save,render,focus:focusElement});
 bindRiddles(state,{save,render,focus:focusElement,canExport:candidate=>prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok,explorerId:()=>explorerStore.active.id});
 bindLoft(state,{save,render,focus:focusElement});
 bindWorkshop(state,{save,render,navigate,focus:focusElement,canExport:candidate=>prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok,explorerId:()=>explorerStore.active.id});
 bindPortions({render,focus:focusElement,explorerId:()=>explorerStore.active.id});
 bindFossil({render,focus:focusElement,explorerId:()=>explorerStore.active.id});
 bindBridges({explorerId:()=>explorerStore.active.id,focus:focusElement});
 bindSpeech();bindConnections(state,{save,render,navigate,focus:focusElement});
 bindScience(state,{save,render,focus:focusElement});
 bindColdWindow({explorerId:()=>explorerStore.active.id});
 bindEvidenceShelf({render,focus:focusElement,explorerId:()=>explorerStore.active.id});
 bindLiving(state,{save,render,focus:focusElement});
 bindSpiral(state,{save,render,navigate,focus:focusElement,startVisit:startAdaptiveSpiral});bindAdaptive(state,{save,render,navigate,focus:focusElement,canExport:candidate=>prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok});
 bindPostOffice(state,{save,render,navigate,focus:focusElement});
 bindCafe(state,{save,render,exposeFacts:pairs=>exposeStoryFacts({facts:pairs}),focus:focusElement});
 document.querySelectorAll('[data-trail]').forEach(b=>b.onclick=()=>navigate(`#checkin/${b.dataset.trail}`));
 document.querySelectorAll('[data-revisit]').forEach(b=>b.onclick=()=>{beginTrail(state,b.dataset.revisit,true);save();activity=null;active=null;screen='';navigate(`#checkin/${b.dataset.revisit}`);});
 document.querySelectorAll('[data-adventure]').forEach(b=>b.onclick=()=>navigate(`#adventure/${b.dataset.adventure}`));
 $('#begin-journey')?.addEventListener('click',beginJourney);
 $('#next-garden')?.addEventListener('click',()=>{const j=state.broad.journey;j.index++;if(j.index>=j.ids.length){j.active=false;save();navigate('#notes');}else{save();navigate(`#checkin/${j.ids[j.index]}`);}});
 document.querySelectorAll('[data-model-action]').forEach(b=>b.onclick=()=>{const input=$('#answer');if(input)active.input=input.value;const action=b.dataset.modelAction;if(action==='show-total')active.revealed=true;adjustModel(activity.q,active,action);active.modelUsed=true;if(activity.mode.startsWith('broad-'))earnPlanting(state,'help:model',null,'model');markExposure();syncDraft();render();const target=$(`[data-model-action="${action}"]`);if(target&&!target.disabled)target.focus();else focusElement('.picture-playground');});

 $('#remember')?.addEventListener('change',e=>{storageOK=explorerStore.setPersistence(e.target.checked,state);persist=explorerStore.persist;render();$('#remember')?.focus();});
 $('#begin-checkin')?.addEventListener('click',startCheckin);$('#begin-practice')?.addEventListener('click',startPractice);
 document.querySelectorAll('[data-route]').forEach(b=>b.onclick=()=>{routeChoice=b.dataset.route;render();});
 document.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{puzzleLevel=b.dataset.level;render();});
 document.querySelectorAll('[data-puzzle]').forEach(b=>b.onclick=()=>{activity={mode:'puzzle',q:puzzles.find(p=>p.id===b.dataset.puzzle)};active=blank();screen='activity';render();focusActivity();});
 $('#answer')?.addEventListener('input',e=>{active.input=e.target.value;active.error='';syncDraft();});
 document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{active.choice=Number(b.dataset.choice);active.error='';rerenderActivity();$(`[data-choice="${active.choice}"]`)?.focus();});
 $('#answer-form')?.addEventListener('submit',e=>{e.preventDefault();const q=activity.q;const value=q.kind==='choice'?active.choice:numericAnswer($('#answer').value);if(value===null){active.error=q.kind==='choice'?'Choose a number sentence to try.':'Write a whole number, or use “Skip for now.”';rerenderActivity();($('#answer')||$('[data-choice]'))?.focus();return;}active.attempts.push(value);if(activity.mode.startsWith('broad-')){const feedback=broadFeedback(q,value);if(feedback.misconception){active.misconceptions??=[];active.misconceptions.push({attempt:active.attempts.length,value,label:feedback.misconception});}}markExposure();active.input=q.kind==='number'?$('#answer').value:'';active.error='';syncDraft();render();focusElement('#activity-feedback');if(value!==q.answer)document.querySelector('#answer')?.select();});
 $('#hint')?.addEventListener('click',()=>{active.hinted=true;if(activity.mode.startsWith('broad-'))earnPlanting(state,'help:hint',null,'hint');markExposure();rerenderActivity();focusElement('.hint');});
 $('#show-array')?.addEventListener('click',()=>{active.hinted=true;active.showArray=true;if(activity.mode.startsWith('broad-')){active.modelUsed=true;earnPlanting(state,'help:model',null,'model');}markExposure();rerenderActivity();focusElement('.array, .fence-picture, .picture-playground');});
 $('#solution')?.addEventListener('click',()=>{active.revealed=true;markExposure();rerenderActivity();focusElement('.solution');});
 document.querySelectorAll('[data-method]').forEach(b=>b.onclick=()=>{active.method=b.dataset.method;syncDraft();render();$('#next')?.focus();});
 $('#next')?.addEventListener('click',()=>{if(active.method)record();});$('#skip')?.addEventListener('click',()=>record(true));
 $('#download')?.addEventListener('click',()=>{const report=notesReport(state);downloadText(JSON.stringify(report,null,2),`number-garden-notes-${explorerStore.active.symbol}-${new Date().toISOString().slice(0,10)}.json`);});
 $('#reset')?.addEventListener('click',showReset);
}
function exposeStoryFacts(node,except,target=state,qualifyPendingBramble=false){
 for(const pair of node.facts||[]){
  noteLegacyExposure(target,pair);noteGardenFactExposure(target,pair,except);
  if(qualifyPendingBramble)notePendingBrambleFactExposure(target,pair);
  target.exposures??=[];const key=`${pair[0]}x${pair[1]}`;if(!target.exposures.includes(key))target.exposures.push(key);
  const draft=target.baseline.draft,q=draft&&checkin.find(x=>x.id===draft.questionId),fact=q?.fact||(q&&[q.a,q.b]);
  if(fact&&fact.every(Number.isFinite)&&((fact[0]===pair[0]&&fact[1]===pair[1])||(fact[0]===pair[1]&&fact[1]===pair[0])))draft.exposed=true;
 }
}
function requestParis(destination,variant='auto',storyId=null){
 const options={destination,variant,storyId},v=currentVisit(state);
 if(v&&!v.finished){navigate(`#storm/choose/paris/${destination}/${variant}${storyId?`/${storyId}`:''}`);return;}
 if(startVisit(state,'paris',options)){save();navigate('#storm/play');}else {save();navigate('#paris');}
}
function requestFrench(destination,variant='auto',storyId=null){
 const v=currentVisit(state);
 if(v&&!v.finished){navigate(`#storm/choose/french/${destination}/${variant}${storyId?`/${storyId}`:''}`);return;}
 if(startVisit(state,'french',{destination,variant,storyId})){save();navigate('#storm/play');}else {save();navigate('#french');}
}
function requestPath(id){
 if(id==='french'){const active=currentVisit(state);navigate(active?.entrance==='french'&&!active.finished?'#storm/play':'#french');return;}
 if(!entranceById(id))return;
 const v=currentVisit(state);
 if(v&&!v.finished){navigate(v.entrance===id&&!(id==='paris'&&v.paris)?'#storm/play':`#storm/choose/${id}`);return;}
 if(startVisit(state,id)){save();navigate('#storm/play');}else {save();navigate(isFrenchParis({entrance:id})?'#french':id==='paris'?'#paris':'#storm');}
}
function finishStory(skip=false){
 if(!finishStoryNode(state,skip))return;
 save();render();main.focus();window.scrollTo(0,0);
}
function bindStory(){
 document.querySelectorAll('[data-start-path]').forEach(b=>b.onclick=()=>requestPath(b.dataset.startPath));
 document.querySelectorAll('[data-french-destination]').forEach(b=>b.onclick=()=>{const place=b.dataset.frenchDestination,value=$(`#french-length-${place}`).value,story=$(`#french-story-${place}`).value;requestFrench(place,value==='auto'?'auto':Number(value),story==='auto'?null:story);});
 document.querySelectorAll('[data-paris-pack-story]').forEach(b=>b.onclick=()=>{const story=b.dataset.parisPackStory,value=$(`#paris-pack-length-${story}`).value;requestParis(b.dataset.parisPackPlace,value==='auto'?'auto':Number(value),story);});
 document.querySelectorAll('[data-paris-destination]').forEach(b=>b.onclick=()=>{const place=b.dataset.parisDestination,value=$(`#paris-length-${place}`).value;requestParis(place,value==='auto'?'auto':Number(value));});
 document.querySelectorAll('[data-new-visit]').forEach(b=>b.onclick=()=>{const options=b.dataset.parisPlace?{destination:b.dataset.parisPlace,variant:b.dataset.parisVariant==='auto'?'auto':Number(b.dataset.parisVariant),storyId:b.dataset.parisStory||null}:undefined;if(startVisit(state,b.dataset.newVisit,options)){save();navigate('#storm/play');}else if(isParisReadingVisit({entrance:b.dataset.newVisit})){save();navigate(isFrenchParis({entrance:b.dataset.newVisit})?'#french':'#paris');}});
 document.querySelectorAll('[data-paris-fresh-start]').forEach(b=>b.onclick=()=>{const old=currentVisit(state),french=isFrenchParis(old),p=french?old?.french:old?.paris,options=p?.destination?{destination:p.destination,variant:[1,2,3].includes(p.variant)?p.variant:'auto',storyId:p.storyId||null}:undefined;if(startVisit(state,old.entrance,options)){save();navigate('#storm/play');}else {save();navigate(french?'#french':'#paris');}});
 document.querySelectorAll('[data-resume-visit]').forEach(b=>b.onclick=()=>{if(resumeVisit(state,b.dataset.resumeVisit)){save();navigate(currentVisit(state).finished?'#storm/end':'#storm/play');}});
 document.querySelectorAll('[data-guide]').forEach(b=>b.onclick=()=>{if(guides.some(g=>g.id===b.dataset.guide)){state.garden.guide=b.dataset.guide;save();render();$(`[data-guide="${state.garden.guide}"]`).focus();}});
 document.querySelectorAll('[data-avatar]').forEach(b=>b.onclick=()=>{if(avatars.some(a=>a.id===b.dataset.avatar)){state.garden.avatar=b.dataset.avatar;save();render();$(`[data-avatar="${state.garden.avatar}"]`).focus();}});
 const d=currentVisit(state)?.finished?null:storyDraft(state);
 document.querySelectorAll('[data-story-audio]').forEach(b=>b.addEventListener('click',()=>{if(useStoryReadingTool(state,'audio')){save();const note=$('#reading-support-note');if(note)note.textContent='You can listen, pause, and read the passage again.';}}));
 document.querySelectorAll('[data-story-reading-tool]').forEach(b=>b.onclick=()=>{const action=b.dataset.storyReadingTool;if(!useStoryReadingTool(state,action))return;save();render();const index=storyDraft(state).readingTools.focus;focusElement(index===null?'#reading-passage-title':`#reading-line-${index}`);});
 $('#story-help')?.addEventListener('click',()=>{const h=openStoryHelp(state);if(h)exposeStoryFacts(h);save();render();main.focus();window.scrollTo(0,0);});
 const visit=currentVisit(state),hx=d?.helper,h=visit&&(isParisReadingVisit(visit)?parisHelper(visit,visit.node):helpers[visit.node]);
 const helpRender=selector=>{save();render();if(selector)focusElement(selector);};
 $('#help-answer')?.addEventListener('input',e=>{hx.input=e.target.value;hx.error='';save();});
 document.querySelectorAll('[data-help-choice]').forEach(b=>b.onclick=()=>{hx.choice=Number(b.dataset.helpChoice);hx.error='';helpRender(`[data-help-choice="${hx.choice}"]`);});
 document.querySelectorAll('[data-help-spot]').forEach(b=>b.onclick=()=>{hx.modelUsed=true;hx.spotlight=Number(b.dataset.helpSpot);helpRender(`[data-help-spot="${hx.spotlight}"]`);});
 $('#help-step')?.addEventListener('click',()=>{hx.modelUsed=true;hx.steps=Math.min(helperLimit(h),hx.steps+1);helpRender('.model-readout');});
 $('#help-recount')?.addEventListener('click',()=>{hx.steps=0;helpRender('.model-readout');});
 $('#help-answer-form')?.addEventListener('submit',e=>{e.preventDefault();const value=h.kind==='choice'?hx.choice:numericAnswer($('#help-answer').value);if(value===null){hx.error='Choose an idea or write a whole number. You can also return without answering.';helpRender('#help-error');return;}submitStoryHelp(state,value);helpRender('#help-feedback');});
 $('#help-explain')?.addEventListener('click',()=>{hx.revealed=true;helpRender('.solution');});
 $('#help-return')?.addEventListener('click',()=>{hx.open=false;helpRender('#story-help');});
 $('#help-skip')?.addEventListener('click',()=>{hx.open=false;finishStory(true);});
 const changeOrder=(action,index)=>{
  const visit=currentVisit(state),node=visit&&(isParisReadingVisit(visit)?parisNode(visit,visit.node):storyNodes[visit.node]),old=storyDraft(state)?.order||[],removed=action==='remove'?old[index]:null;
  if(!editStoryOrder(state,action,index))return;save();render();
  const order=storyDraft(state).order;
  focusElement(order.length===3?'#order-submit':`[data-order-add="${removed??node.displayOrder.find(i=>!order.includes(i))}"]`);
 };
 document.querySelectorAll('[data-order-add]').forEach(b=>b.onclick=()=>changeOrder('add',Number(b.dataset.orderAdd)));
 document.querySelectorAll('[data-order-remove]').forEach(b=>b.onclick=()=>changeOrder('remove',Number(b.dataset.orderRemove)));
 $('#order-clear')?.addEventListener('click',()=>changeOrder('clear'));
 $('#story-answer')?.addEventListener('input',e=>{d.input=e.target.value;d.error='';save();});
 document.querySelectorAll('[data-story-choice]').forEach(b=>b.onclick=()=>{d.choice=Number(b.dataset.storyChoice);d.error='';save();render();$(`[data-story-choice="${d.choice}"]`).focus();});
 $('#story-answer-form')?.addEventListener('submit',e=>{e.preventDefault();const visit=currentVisit(state),n=isParisReadingVisit(visit)?parisNode(visit,visit.node):storyNodes[visit.node];if(n.kind==='order'){if(orderValue(d.order)===null){d.error='Place all three cards before trying this order.';save();render();focusElement('#story-error');return;}submitStoryOrder(state);save();render();focusElement('#story-feedback');return;}const value=n.kind==='choice'?d.choice:numericAnswer($('#story-answer').value);if(value===null){d.error=n.kind==='choice'?'Choose an idea to try, or use “Skip for now.”':'Write a whole number, or use “Skip for now.”';save();render();($('#story-answer')||$('[data-story-choice]')).focus();return;}submitStory(state,value);save();render();focusElement('#story-feedback');});
 $('#story-hint')?.addEventListener('click',()=>{d.hinted=true;save();render();focusElement('.hint');});
 $('#story-explain')?.addEventListener('click',()=>{d.revealed=true;save();render();focusElement('.solution');});
 document.querySelectorAll('[data-story-method]').forEach(b=>b.onclick=()=>{d.method=b.dataset.storyMethod;save();render();$('#story-next')?.focus();});
 document.querySelectorAll('[data-reading]').forEach(b=>b.onclick=()=>{d.reading=b.dataset.reading;save();render();$(`[data-reading="${d.reading}"]`).focus();});
 document.querySelectorAll('[data-design]').forEach(b=>b.onclick=()=>{d.designChoice=b.dataset.design;save();render();$(`[data-design="${d.designChoice}"]`).focus();});
 $('#story-next')?.addEventListener('click',()=>finishStory());
 $('#story-skip')?.addEventListener('click',()=>finishStory(true));
 $('#story-project-next')?.addEventListener('click',()=>finishStory());
}
function renderPuzzleEnd(q,o){main.innerHTML=`${heading('An idea to keep.','You made room for a little wondering.')}<section class="summary-callout"><h2>${esc(q.title)}</h2><p>${esc(describe(o))}. ${o.status==='skipped'?'You can return to this puzzle whenever you like.':esc(q.talk)}</p><div class="summary-links"><a href="#puzzles" class="primary">Choose another puzzle</a><a href="#home" class="secondary">Back to the garden</a></div></section>`;main.focus();}
 function showReset(){const d=document.createElement('dialog');d.innerHTML=`<div class="dialog-content"><h2>Start with a fresh page?</h2><p>This clears this explorer’s garden, café, stories, practice, guide and character choices, and notes. Other explorers stay in place. Earlier shared copies can be removed separately from notes. Download your notes first if you want to keep them.</p><div class="dialog-actions"><button class="secondary" id="cancel-reset">Keep our progress</button><button class="primary danger" id="confirm-reset">Clear progress</button></div></div>`;document.body.append(d);d.showModal();d.querySelector('#cancel-reset').onclick=()=>d.close();d.querySelector('#confirm-reset').onclick=()=>{stopBell('reset');resetSpeechPreferences();resetEvidenceShelf();resetGatheringBudget();resetPortionsSession();resetFossilSession();state=explorerStore.clearActive();ensurePlantings(state);ensureBroad(state);ensureGarden(state);ensureCafe(state);ensureScience(state);ensureFacts(state);ensureForage(state);ensureWorkshop(state);ensurePostOffice(state);practiceSession=null;activity=null;active=null;screen='';save();d.close();navigate('#home');};d.addEventListener('close',()=>d.remove());}
 document.addEventListener('click',event=>{const a=event.target.closest('a[href^="#"]');if(a?.getAttribute('href')==='#main'){event.preventDefault();main.focus();return;}if(a&&a.getAttribute('href')===location.hash){event.preventDefault();if(location.hash==='#numbers/return/ledger')resetRemains();if(activity)syncDraft();screen='';activity=null;active=null;noteInstructionArrival();render();if(!focusExploreStart())main.focus();window.scrollTo(0,0);}});
 window.addEventListener('hashchange',()=>{cancelProgressImport();if(activity)syncDraft();screen='';activity=null;active=null;noteInstructionArrival();render();if(!focusExploreStart())main.focus();window.scrollTo(0,0);});
 $('#privacy-button').onclick=()=>$('#about-dialog').showModal();
noteInstructionArrival();
 render();
 focusExploreStart();

// Films play once per explorer: the storm film on a first visit, and a short film at three story endings.
// Watching one is not learning evidence.
const FILMS={
 welcome:{src:'./storm-intro.html',title:'After the Storm introductory film',heading:'Before we begin…',skip:'Skip to the garden',note:'A little story about how our garden begins. Sound is optional. You can replay it from the home page.'},
 paris:{src:'./paris-film.html',title:'A Postcard Home: the Paris postcard film',heading:'A postcard home',skip:'Skip the film',note:'Pip and Dot fly the Paris postcard home. Sound is optional. You can watch it again from the story ending.'},
 cafe:{src:'./cafe-film.html',title:'Welcome Back, Neighbors: the café supper film',heading:'The welcome-back supper',skip:'Skip the film',note:'Six tables, six lanterns. Sound is optional. You can watch it again from the café goal.'},
 bramble:{src:'./bramble-film.html',title:'Through the Ribbon Gate: Bramble’s film',heading:'Through the ribbon gate',skip:'Skip the film',note:'A story example: Bramble ties three bundles of four ribbons. Your own work stays in your notebook. Sound is optional.'}
};
function filmSeen(id){return id==='welcome'?state.garden.welcomeFilmSeen===true:state.garden.filmsSeen?.[id]===true;}
function markFilmSeen(id){if(id==='welcome')state.garden.welcomeFilmSeen=true;else{if(!state.garden.filmsSeen||typeof state.garden.filmsSeen!=='object'||Array.isArray(state.garden.filmsSeen))state.garden.filmsSeen={};state.garden.filmsSeen[id]=true;}save();}
function playFilm(id,{replay=false}={}){
 if(!Object.hasOwn(FILMS,id)||(!replay&&filmSeen(id))||document.querySelector('dialog[open]'))return false;
 const f=FILMS[id],returnFocus=document.activeElement;stopBell('film');stopSpeech();
 const dialog=document.createElement('dialog');dialog.className='welcome-film';dialog.setAttribute('aria-labelledby','welcome-film-title');
 dialog.innerHTML=`<div class="welcome-film-heading"><h2 id="welcome-film-title">${esc(f.heading)}</h2><button type="button" class="secondary" data-film-skip autofocus>${esc(f.skip)}</button></div><iframe title="${esc(f.title)}" src="${f.src}?autoplay=1&amp;embedded=1"></iframe><p class="tiny">${esc(f.note)}</p>`;
 document.body.append(dialog);
 const frame=dialog.querySelector('iframe');
 let exampleOffered=false;
 const finished=e=>{
  if(e.origin!==location.origin||e.source!==frame.contentWindow)return;
  if(e.data==='garden-film-finished')dialog.close();
  else if(id==='bramble'&&e.data==='garden-film-example'&&!exampleOffered){exampleOffered=true;exposeStoryFacts({facts:[[3,4]]});save();}
 };
 dialog.querySelector('[data-film-skip]').onclick=()=>dialog.close();
 dialog.addEventListener('close',()=>{window.removeEventListener('message',finished);frame.remove();dialog.remove();if(returnFocus?.isConnected&&typeof returnFocus.focus==='function')returnFocus.focus();else main.focus();},{once:true});
 window.addEventListener('message',finished);
 dialog.showModal();
 markFilmSeen(id);return true;
}
// The story endings that earn a film: the Paris errand, the first café supper, and Bramble's gate.
function endingFilm(){
 if(choosingExplorer)return null;
 const [root,slug]=(location.hash||'#home').slice(1).split('/');
 if(root==='storm'&&['end','play'].includes(slug)){const v=currentVisit(state);if(v?.finished&&(v.entrance==='paris'||entranceById(v.entrance)?.language==='fr'))return 'paris';}
 if(root==='cafe'&&!['groups','sharing','recipes','batches','fractions'].includes(slug)){const goal=cafeSupper(state.cafe);if(goal.complete&&goal.round===1)return 'cafe';}
 if(root==='post'&&!['choose','groups','messages','letters','instructions','packing'].includes(slug)){const v=currentPostOffice(state);if(v&&!v.closed&&postOfficeView(v)==='bramble'&&['resolved','continued'].includes(v.rival?.phase))return 'bramble';}
 return null;
}
if(!choosingExplorer&&location.hash!=='#workshop/scale')playFilm('welcome');
