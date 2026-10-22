import {PLANT_DAYS,PLANT_SPECIMENS,plantObservation,plantObservationById,PLANT_MODEL} from './plant-study-content.mjs';
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
export const FIELD_QUANTITIES=freeze([{id:'stem',label:'Stem length'},{id:'leaf',label:'Leaf spread'},{id:'plants',label:'Number of plants'}]);
export const FIELD_UNITS=freeze([{id:'mm',label:'Millimeters (mm)'},{id:'cm',label:'Centimeters (cm)'},{id:'plants',label:'Plants'}]);
export const FIELD_TASKS=freeze(['data','chart','draft','source','model','keep']);
export const FIELD_CASES=freeze(PLANT_DAYS.flatMap(day=>PLANT_SPECIMENS.map(specimen=>{const a=plantObservation(day,'light',specimen),b=plantObservation(day,'dim',specimen);return {id:`light-day-${day}-${specimen}`,day,specimen,question:`On day ${day}, how long is seedling ${specimen}’s stem in enough light, and in too little light?`,targetIds:[a.id,b.id],difference:Math.abs(a.stemMm-b.stemMm),longer:a.stemMm===b.stemMm?'same':a.stemMm>b.stemMm?'light':'dim'};})));
export const FIELD_SOURCE_MODEL=freeze({id:PLANT_MODEL.id,notice:PLANT_MODEL.notice,sources:PLANT_MODEL.sources});
export function fieldCaseById(id){return FIELD_CASES.find(c=>c.id===id)??null;}
export function fieldExampleCase(id){const c=fieldCaseById(id);return c?fieldCaseById(`light-day-${c.day===0?6:0}-A`):null;}

export function fieldExample(id){const definition=fieldExampleCase(id);return definition?{definition,rows:definition.targetIds.map(plantObservationById)}:null;}
