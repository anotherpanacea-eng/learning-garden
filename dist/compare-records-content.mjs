import {referenceScaleSource} from './reference-scales-content.mjs';
// Original invented observations adapted from proposal203; see spec369.
export const COMPARE_TEXT={title:'The Compare Shelf',invitation:'Dot has kept trip times for two routes. Wren needs more than one “average” before talking about a route. Put the drawings side by side.',origin:'Invented observations for this workbench.',notice:"These are not real measurements or the town's official route decision."};
const records=(prefix,values)=>values.map((value,i)=>({id:`${prefix}${i+1}`,value}));
export function compareSource(id){
 if(id==='reference-scales')return referenceScaleSource();
 if(!['courier','parcels'].includes(id))return null;
 const courier=id==='courier';
 return {v:1,id,title:courier?'Courier trips':'Market parcels',origin:COMPARE_TEXT.origin,notice:COMPARE_TEXT.notice,
  purpose:courier?'Compare Bridge and Ford trips. Then inspect one separately noted long journey.':'Compare North and South parcel trips. Can the same center hide different spreads?',
  axis:{max:courier?80:40,tick:courier?10:5},
  groups:courier?[{id:'bridge',label:'Bridge',records:records('b',[38,40,41,42,43,44,46])},{id:'ford',label:'Ford',records:records('f',[31,32,33,34,36,38,76])}]:[{id:'north',label:'North',records:records('n',[20,22,24,26,28])},{id:'south',label:'South',records:records('s',[10,20,24,30,36])}],
  ...(courier?{comparison:{groupId:'ford',recordId:'f7',note:'The ford was closed. This recorded journey includes the wait before reopening.'}}:{}),
  worked:{steps:[
   'Different example: 10, 20, 30 minutes. The total is 60. 60 ÷ 3 = 20 minutes is the mean.',
   'The ordered values are 10, 20, 30. The median is 20. The range is 30 − 10 = 20 minutes.',
   'Change the example’s 30 to 90. The mean becomes 120 ÷ 3 = 40. The median is still 20; the range is 80. This changes an example, not a source record. Other lists need not keep the same median.',
   'With 10, 20, 30, 40 minutes, there are two middle values: 20 and 30. Their halfway value is (20 + 30) ÷ 2 = 25 minutes.'
  ],factsByStep:[[],[],[],[]]}};
}
