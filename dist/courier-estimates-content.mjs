// Original invented observations and teaching. See spec367 for the upstream study.
export const ESTIMATE_TEXT={
 title:'Courier Estimates',
 invitation:'Dot has some trip records and a new errand. Can a line help estimate the time?',
 origin:'Made-up courier records.',
 notice:'These numbers are invented for this workbench. They are not real delivery times or promises.',
 dot:'“A rule can be exact,” says Dot. “My trip records don’t all follow one exact rule. Let’s try a line without changing the records.”',
 temporary:'Changes stay in this visit until you keep a model. Leaving this place clears unkept changes.',
 saved:'Model kept. The records and this line stay together.',
 savingOff:'Model kept for this session. Saving on this device is off.',
 storageFailed:'This model is in this session, but it could not be saved on this device. Download your notes.',
 capacity:'Your earlier models are safe. This notebook cannot keep another model here. You can keep exploring in this visit and download your notes.',
 refused:'This model could not be kept. Nothing was changed. Your line is still here; open Grown-up notes to download your work.',
 unsupported:'Earlier estimates are kept in your notes. This format cannot accept another model here.',
 unavailable:'Earlier model retained · its original stays in your notes.',
 helperUnavailable:'The earlier example stays in your notes. This model is still open.',
 kept:'This kept model stays as it was. Try it again to make another version.'
};
const axes=()=>({x:{label:'Route length · model blocks',max:10},y:{label:'Trip time · minutes',max:28}});
const rows=ys=>ys.map((y,i)=>({id:`r${i+1}`,x:i+1,y}));
const questions=[
 'Why would you try this line? Point to the records.',
 'Which record disagrees with it? How large is the gap?',
 'What else would you want to know before promising an arrival time?'
];
function worked(){return {v:1,axes:axes(),rows:rows([4,7,7]),line:{start:2,rate:2},steps:[
 'Try estimate = 2 × blocks + 2. The 1-block estimate is 4 minutes, matching this example’s first record.',
 'At 2 blocks, the line gives 6 minutes. The record is 7: recorded minus estimated is +1 minute.',
 'At 3 blocks, the line gives 8 minutes. The record is 7: recorded minus estimated is −1 minute.',
 'The line does not pass through every record. We keep the records where they are and use the line as a rough model.'
]};}
export function estimateSource(id){
 const orchard=id==='orchard';if(!orchard&&id!=='library')return null;
 return {v:1,id,title:orchard?'Orchard rounds':'Library rounds',origin:ESTIMATE_TEXT.origin,notice:ESTIMATE_TEXT.notice,
  context:orchard?'Six invented orchard trips, on routes from one to six model blocks.':'Six different invented library trips, on routes from one to six model blocks.',
  axes:axes(),rows:rows(orchard?[5,7,6,9,9,12]:[7,6,9,10,10,11]),starts:[0,1,2,3,4,5,6],rates:[0,0.5,1,1.5,2],requests:[4.5,10],
  teaching:{questions:[...questions]},worked:worked()};
}
