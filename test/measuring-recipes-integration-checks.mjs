import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {nextGuest,adjustBite} from '../dist/cafe-core.mjs';
import {ingredients} from '../dist/cafe-content.mjs';
import {startPostOffice} from '../dist/post-office-core.mjs';
import {deliveries} from '../dist/post-office-content.mjs';
import {startShow,setSceneDialogue} from '../dist/loft-core.mjs';
import {drawLetter} from '../dist/letter-trail-core.mjs';
import {chooseSharingCase,shareSharingRound} from '../dist/sharing-counter-core.mjs';
import {chooseRainCase,nextRainPhase} from '../dist/rain-paths-core.mjs';
import {RECIPE_CASES} from '../dist/measuring-recipes-content.mjs';
import {recipeState,recipeView,chooseRecipe,setRecipePage,chooseRecipeIngredient,fillRecipeJug,returnRecipeJug,pourRecipeJug,returnRecipePortion,setRecipeReading,setRecipeUnit,checkRecipeReading,checkRecipeTray,useRecipeSupport,keepRecipe,recoverRecipes} from '../dist/measuring-recipes-core.mjs';
import {measuringRecipesPage,measuringRecipesNotes,measuringRecipesEntry,bindMeasuringRecipes} from '../dist/measuring-recipes-ui.mjs';
import {recipeJugArt} from '../dist/measuring-recipes-art.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
const fresh=()=>initializeExplorerState(freshState());
{
 const s=fresh();chooseRecipe(s,'lantern-supper');fillRecipeJug(s);keepRecipe(s);chooseRecipe(s,'welcome-broth');setRecipeReading(s,'50');checkRecipeReading(s);keepRecipe(s);setRecipePage(s,'keep');s.measuringRecipes.cases['welcome-broth'].feedback.reading=false;
 const readings=w=>[w.reading,w.checks[0].reading,w.kept.reading,w.kept.latestReading.reading];
 for(let index=0;index<4;index++)for(const value of [undefined,null,17,[],{toString:null}]){
  const payload=JSON.parse(JSON.stringify(s));readings(payload.measuringRecipes.cases['welcome-broth'])[index].text=value;const loaded=JSON.parse(JSON.stringify(payload)),raw=JSON.stringify(loaded);
  eq(recipeState(loaded),null,'saved reading text must already be a string');ok(measuringRecipesPage(loaded).includes('An earlier recipe notebook is kept'),'malformed JSON text renders recovery');eq(JSON.stringify(loaded),raw,'recovery view preserves raw text');
  ok(recoverRecipes(loaded));eq(loaded.measuringRecipes.cases,{'lantern-supper':s.measuringRecipes.cases['lantern-supper']},'recovery drops only unreadable recipe');eq(loaded.measuringRecipes.recovered,JSON.parse(raw).measuringRecipes,'unreadable recipe retained');chooseRecipe(loaded,'lantern-supper');ok(measuringRecipesPage(loaded).includes('Lantern supper'),'other recipe remains open');
 }
}
for(const c of RECIPE_CASES){const s=fresh();chooseRecipe(s,c.id);setRecipeReading(s,'2-');setRecipeUnit(s,'g');fillRecipeJug(s);for(const page of ['measure','tray','keep']){setRecipePage(s,page);const raw=JSON.stringify(s),html=measuringRecipesPage(s);ok(html.includes(c.purpose)&&html.includes(`${c.targets['cloud-water']} mL`)&&html.includes('Measuring jug'),'each turn retains request and apparatus');eq(JSON.stringify(s),raw,'render creates no answer/support');const imported=prepareProgressImport(raw);ok(imported.ok,'case/page imports');eq(imported.state.measuringRecipes,s.measuringRecipes,'raw draft/source/page exact');}keepRecipe(s);eq(prepareProgressImport(JSON.stringify(s)).state.measuringRecipes,s.measuringRecipes,'unfinished kept draft transfers');}
{
 const s=fresh();nextGuest(s);adjustBite(s,ingredients[0].id,1);startPostOffice(s,deliveries[0].id);startShow(s,'welcome');setSceneDialogue(s,'A fictional measuring show.');drawLetter(s,'post');chooseSharingCase(s,'quarter-basket');shareSharingRound(s);chooseRainCase(s,'space-12');nextRainPhase(s);const before=structuredClone(s);delete before.measuringRecipes;
 for(const c of RECIPE_CASES){chooseRecipe(s,c.id);for(let i=0;i<3;i++)fillRecipeJug(s);setRecipeReading(s,'150');setRecipeUnit(s,'mL');checkRecipeReading(s);pourRecipeJug(s);useRecipeSupport(s,'difference');checkRecipeTray(s);keepRecipe(s);setRecipePage(s,'keep');measuringRecipesPage(s);}
 const after=structuredClone(s);delete after.measuringRecipes;eq(after,before,'all actual café, story, letters, fractions and rain drafts unchanged');const imported=prepareProgressImport(JSON.stringify(s));const other=structuredClone(imported.state);delete other.measuringRecipes;eq(other,before,'import retains unrelated work');
}
{
 const s=fresh();chooseRecipe(s,'welcome-broth');for(let i=0;i<4;i++)fillRecipeJug(s);setRecipeReading(s,'200');setRecipeUnit(s,'g');checkRecipeReading(s);let v=recipeView(s);ok(v.latestReading.assessment.numberRead&&!v.latestReading.assessment.unitNamed,'reading200 at200 correct independently of wrong unit/150 target');ok(measuringRecipesPage(s).includes('That number matches'),'render does not grade reading against target');returnRecipeJug(s);pourRecipeJug(s);chooseRecipeIngredient(s,'star-water');fillRecipeJug(s);fillRecipeJug(s);pourRecipeJug(s);returnRecipePortion(s,'cloud-water');eq(recipeView(s).work.selectedIngredient,'cloud-water','return into empty jug restores correct source identity');pourRecipeJug(s);fillRecipeJug(s);checkRecipeTray(s);v=recipeView(s);ok(v.latestTray.assessment.portionsMatch&&!v.latestTray.assessment.ready,'extra jug amount distinct from matching tray');setRecipePage(s,'tray');ok(measuringRecipesPage(s).includes('still extra liquid'),'view explains matching-but-not-ready');returnRecipeJug(s,true);checkRecipeTray(s);keepRecipe(s);const frozen=structuredClone(s.measuringRecipes.cases['welcome-broth'].kept);fillRecipeJug(s);useRecipeSupport(s,'intervalStrip');eq(s.measuringRecipes.cases['welcome-broth'].kept,frozen,'later apparatus/help cannot mutate kept ready tray');setRecipePage(s,'measure');setRecipeReading(s,'2-');useRecipeSupport(s,'workedExample');eq(prepareProgressImport(JSON.stringify(s)).state.measuringRecipes.cases['welcome-broth'].reading.text,'2-','pending input remains exact after support/import');
}
for(const payload of [null,[],3,{version:99,earlier:'<img src=x onerror="fictional()">'}]){const s=fresh();s.measuringRecipes=payload;const raw=JSON.stringify(s);ok(!recipeState(s),'unknown unavailable');ok(!measuringRecipesNotes(s).includes('<img src=x')&&!destinationNotes(s).includes('<img src=x'),'raw escaped');measuringRecipesPage(s);eq(JSON.stringify(s),raw,'recovery view read-only');const imported=prepareProgressImport(raw);ok(imported.ok,'future root imports');eq(imported.state.measuringRecipes,payload,'future payload exact');recoverRecipes(s);eq(s.measuringRecipes.recovered,payload,'recovery retains full old root');}
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
{
 const disk=new Storage(),store=new ExplorerStore(disk);let s=initializeExplorerState(store.load());const id=store.active.id;chooseRecipe(s,'welcome-broth');fillRecipeJug(s);setRecipeReading(s,'2-');store.save(s);eq(new ExplorerStore(disk).load().measuringRecipes,s.measuringRecipes,'apparatus/raw reading reload');const other=store.add({},s);ok(!other.measuringRecipes,'new explorer separate');s=store.select(id,other);eq(recipeView(s).model.jug.amount,50,'same jug resumes');store.setPersistence(false,s);store.save(s);eq(store.load().measuringRecipes,s.measuringRecipes,'save-off session remains playable');ok(!new ExplorerStore(disk).load().measuringRecipes,'save-off not persisted');ok(!store.clearActive().measuringRecipes,'active reset clears recipe');
}
{
 const app=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8'),ending=app.match(/function endingFilm\(\)\{[\s\S]*?\n\}/)?.[0],s=fresh();let calls=0;const ctx=vm.createContext({state:s,choosingExplorer:false,location:{hash:'#cafe/recipes'},cafeSupper(){calls++;return {complete:true,round:1};}});ok(ending,'host endingFilm function extracted');vm.runInContext(ending,ctx);eq(vm.runInContext('endingFilm()',ctx),null,'preparation does not trigger supper film');eq(calls,0,'recipe does not inspect supper goal');
}
for(let n=0;n<=500;n+=50){const art=recipeJugArt(n,'cloud-water');ok(art.includes(`contains ${n} milliliters`),'drawing accessible current volume exact');}
ok(measuringRecipesEntry().includes('#cafe/recipes'),'entry reaches kitchen');
console.log(`Measuring Kitchen UI/storage integration: ${checks} passed.`);
