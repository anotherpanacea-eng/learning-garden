import {magpieScenes,magpieLessons,magpieSortCards,magpieArtDescriptions,magpieCopy} from './magpie-pictures-content.mjs';

export function createMagpiePictures(){
 return {page:'party',scene:0,ideas:Array(6).fill(null),references:Array(6).fill(false),lesson:0,sort:0,trays:Array(6).fill(null),sortReferences:Array(6).fill(false)};
}

const index=(value,length)=>Number.isInteger(value)&&value>=0&&value<length;
function replace(work,key,position,value){
 if(work[key][position]===value)return work;
 const next=work[key].slice();next[position]=value;return {...work,[key]:next};
}

// Visit work has no notebook, writer or comparison with a prepared answer.
export function changeMagpiePictures(work,action,value){
 if(action==='page')return ['party','learn','sort'].includes(value)&&work.page!==value?{...work,page:value}:work;
 if(work.page==='party'){
  if(action==='scene')return index(value,6)&&value!==work.scene?{...work,scene:value}:work;
  if(action==='idea'&&(index(value,3)||value==='unsure'))return replace(work,'ideas',work.scene,value);
  if(action==='clear-idea')return replace(work,'ideas',work.scene,null);
  if(action==='reference')return replace(work,'references',work.scene,!work.references[work.scene]);
 }
 if(work.page==='learn'&&action==='lesson')return index(value,4)&&value!==work.lesson?{...work,lesson:value}:work;
 if(work.page==='sort'){
  if(action==='sort')return index(value,6)&&value!==work.sort?{...work,sort:value}:work;
  if(action==='tray'&&['literal','figurative'].includes(value))return replace(work,'trays',work.sort,value);
  if(action==='clear-tray')return replace(work,'trays',work.sort,null);
  if(action==='sort-reference')return replace(work,'sortReferences',work.sort,!work.sortReferences[work.sort]);
 }
 return work;
}

export function magpiePicturesModel(work){
 const scene=magpieScenes[work.scene],sortCard=magpieSortCards[work.sort];
 return {page:work.page,scene,idea:Number.isInteger(work.ideas[work.scene])?scene.choices[work.ideas[work.scene]]:null,
  reference:work.references[work.scene]?{text:scene.meaning,clue:scene.clue,image:scene.referenceImage}:null,
  lesson:magpieLessons[work.lesson],sortCard,tray:work.trays[work.sort],
  sortReference:work.sortReferences[work.sort]?{type:sortCard.reference,reason:sortCard.reason,image:sortCard.image}:null};
}

const trayText={literal:'Words used literally here',figurative:'Words used figuratively here'};
export function magpiePicturesNarration(work){
 const m=magpiePicturesModel(work),parts=[magpieCopy.entryTitle,magpieCopy.intro];
 if(work.page==='party'){
  parts.push('Party pictures',m.scene.title,m.scene.context,m.scene.quote,"The magpie's word picture",magpieArtDescriptions[m.scene.bird],'Your idea');
  m.scene.choices.forEach(choice=>parts.push(choice.text));
  if(m.idea)parts.push('Your idea',m.idea.text);
  else if(work.ideas[work.scene]==='unsure')parts.push(magpieCopy.uncertainty);
  if(m.reference)parts.push(m.reference.text,magpieArtDescriptions[m.reference.image],m.reference.clue);
 }else if(work.page==='learn'){
  parts.push('See why',magpieCopy.learnIntro,m.lesson.title,m.lesson.text,...m.lesson.images.map(image=>magpieArtDescriptions[image]));
 }else if(work.page==='sort'){
  parts.push('Sort the sayings',magpieCopy.sortIntro,`Sorting card ${work.sort+1} of 6`,m.sortCard.context,m.sortCard.quote,'Words used literally here','Words used figuratively here');
  if(m.tray)parts.push('Your tray',trayText[m.tray]);
  if(m.sortReference)parts.push(trayText[m.sortReference.type],m.sortReference.reason,magpieArtDescriptions[m.sortReference.image]);
 }
 parts.push('Back to Riddles',magpieCopy.lifetime);
 return parts.join('. ');
}
