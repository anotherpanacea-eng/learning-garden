// Fictional browser QA state only; no personal records or production access.
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState} from '../dist/progress-transfer.mjs';
import {nextGuest,adjustBite,checkPlate,submitCafeNumber,skipCafeStage,serveCafe} from '../dist/cafe-core.mjs';
import {startPostOffice,setPostPage,currentPostOffice} from '../dist/post-office-core.mjs';
import {startAdaptiveRival,solveRivalTogether} from '../dist/post-rival.mjs';
import {connectionOffers} from '../dist/learning-connections.mjs';
import {startShow,setSceneDialogue} from '../dist/loft-core.mjs';
import {drawLetter} from '../dist/letter-trail-core.mjs';
const s=initializeExplorerState(freshState());
s.garden.welcomeFilmSeen=true;
nextGuest(s);Object.assign(s.cafe.current.params,{guests:3,bites:4,wanted:['warm','crunchy']});for(let i=0;i<4;i++)adjustBite(s,'moon-crunch',1);checkPlate(s);submitCafeNumber(s,12);skipCafeStage(s);s.cafe.stock['moon-crunch']=180;serveCafe(s);nextGuest(s);adjustBite(s,'moon-crunch',1);startPostOffice(s,'purl-blankets');setPostPage(s,'bramble');startAdaptiveRival(s);solveRivalTogether(s);startShow(s,'welcome');setSceneDialogue(s,'A fictional parcel show.');drawLetter(s,'post');
if(!connectionOffers(s,'bramble').length||currentPostOffice(s).rival.phase!=='resolved')throw Error('Invalid waiting fixture');
console.log(JSON.stringify(s));
