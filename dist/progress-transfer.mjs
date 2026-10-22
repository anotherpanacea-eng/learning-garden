import {ensureBellStudio} from './bell-studio-core.mjs';
import {ensureTravelersArchive} from './travelers-archive-core.mjs';
import {ensureRecipes} from './measuring-recipes-core.mjs';
import {ensureRainPaths} from './rain-paths-core.mjs';
import {ensureSharing} from './sharing-counter-core.mjs';
import {ensureFieldNotebook} from './field-notebook-core.mjs';
import {ensurePlantStudy} from './plant-study-core.mjs';
import {ensureLetters} from './letter-trail-core.mjs';
import {ensureMessages} from './message-core.mjs';
import {ensureEqualGroups} from './equal-groups-core.mjs';
import {restoreStateResult} from './core.mjs';
import {ensureBroad} from './broad-core.mjs';
import {ensureGarden} from './garden-core.mjs';
import {ensureCafe} from './cafe-core.mjs';
import {ensureScience} from './science-core.mjs';
import {ensureFacts} from './facts-core.mjs';
import {ensureForage} from './forage-core.mjs';
import {ensureWorkshop} from './workshop-core.mjs';
import {ensurePostOffice} from './post-office-core.mjs';
import {ensurePlantings} from './plantings.mjs';
import {destinationNotes} from './notebook-sections.mjs';
import {EXPLORER_COLORS,EXPLORER_SYMBOLS} from './explorer-storage.mjs';
import {MAX_IMPORT_BYTES,boundedProgressValue} from './progress-limits.mjs';

export {MAX_IMPORT_BYTES} from './progress-limits.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const destinations={hundredthsBridge:'Hundredths Bridge',tenthsTable:'Tenths Table',willowPath:'Willow Path',townRemembers:'The Town Remembers',fieldKit:'Field Kit',parcelPacking:'Parcel packing',wholeBatches:'Whole-batch gathering trays',broad:'Number Garden',garden:'Stories and Paris',cafe:'Café',science:'Water Lab',facts:'Multiplication Garden',workshop:'Storm Workshop',postOffice:'Post Office',plantings:'Planting beds',livingGarden:'Living Garden',livingExploration:'Living Garden trails',words:'Word Garden',loft:'Story Loft',equalGroups:'Equal-group benches',messages:'Messages for a reader',letterTrail:'Changing letter rounds',plantStudy:'Seedling investigation',fieldNotebook:'Field Notebook',sharingCounter:'Sharing Counter',rainPaths:'Rain Paths',measuringRecipes:'Measuring Kitchen',travelersArchive:'Travelers’ Archive',bellStudio:'Bell Studio',fractionTrail:'Fraction Trail',bundleExchange:'Bundle Exchange',joiningOrders:'Joining Supply Orders',returningOrders:'Returning Supply Orders',instructionNotes:'Instructions for a Reader'};
export function initializeExplorerState(state){
 ensureBellStudio(state);ensureTravelersArchive(state);ensureRecipes(state);ensureRainPaths(state);ensureSharing(state);ensureFieldNotebook(state);ensurePlantStudy(state);ensureLetters(state);ensureMessages(state);ensureEqualGroups(state);ensureBroad(state);ensureGarden(state);ensureCafe(state);ensureScience(state);ensureFacts(state);ensureForage(state);ensureWorkshop(state);ensurePostOffice(state);ensurePlantings(state);return state;
}
// File contents remain local. These limits also bound work before destination restore.
export function prepareProgressImport(raw){
 const fail=message=>({ok:false,message});
 if(typeof raw!=='string'||new TextEncoder().encode(raw).length>MAX_IMPORT_BYTES)return fail('Choose a notes JSON file smaller than 5 MB. The original file is unchanged.');
 let source;
 try{source=JSON.parse(raw.replace(/^\uFEFF/,''));}catch{return fail('This file is not readable JSON. Choose the file from “Download our notes” on the old site.');}
 if(!object(source)||!boundedProgressValue(source))return fail('This file has an unsupported or overly complex structure. No progress was changed.');
 if(source.version!==1)return fail('This notebook version is not supported here. Keep the original file; no progress was changed.');
 for(const key of Object.keys(destinations))if(!['hundredthsBridge','tenthsTable','willowPath','townRemembers','fieldKit','parcelPacking','wholeBatches','loft','equalGroups','messages','letterTrail','plantStudy','fieldNotebook','sharingCounter','rainPaths','measuringRecipes','travelersArchive','bellStudio','fractionTrail','bundleExchange','joiningOrders','returningOrders','instructionNotes'].includes(key)&&Object.hasOwn(source,key)&&!object(source[key]))return fail('A saved destination has an unreadable structure. Keep the original file; no progress was changed.');
 if(!Number.isSafeInteger(source.sessions)||source.sessions<0)return fail('The original task counts are unreadable. No progress was changed.');
 const restored=restoreStateResult(JSON.stringify(source));
 if(restored.reason)return fail('This is not a supported complete notebook. Choose “Download our notes” on the old site. No progress was changed.');
 const records=[...source.baseline.observations,...source.practice,...source.puzzles];
 if(records.some(o=>['label','prompt','method','source','at'].some(k=>Object.hasOwn(o,k)&&o[k]!==null&&typeof o[k]!=='string')))return fail('Some original task details have an unreadable format. Keep your original file; no progress was changed.');
 const state=restored.state;
 for(const key of ['title','exportedAt','note','explorer','recommendation'])delete state[key];
 try{initializeExplorerState(state);destinationNotes(structuredClone(state));}catch{return fail('This notebook could not be opened safely with this game version. Keep the original file; no progress was changed.');}
 const profile=object(source.explorer)?source.explorer:{},avatar=profile.avatar||source.garden?.avatar;
 const choice={avatar:['fern','reed','sky'].includes(avatar)?avatar:'sky',color:EXPLORER_COLORS.includes(profile.color)?profile.color:'gold',symbol:EXPLORER_SYMBOLS.includes(profile.symbol)?profile.symbol:'leaf'};
 return {ok:true,raw,state,choice,summary:{tasks:source.baseline.observations.length+source.practice.length+source.puzzles.length,destinations:Object.keys(destinations).filter(key=>Object.hasOwn(source,key)).map(key=>destinations[key])}};
}
