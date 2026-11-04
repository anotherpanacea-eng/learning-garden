// Original invented map distances and teaching. See spec368 for the study.
export const MAP_TEXT={title:'A Map That Fits',invitation:'Wren wants a useful drawing, not just a smaller one. Can you fit the whole route and still show a detail?',origin:'Invented distances for this workbench.',notice:"These are practice drawings, not surveyed places, real navigation or the town's official plan."};
export function mapSheetSource(id){
 if(!['wide','small'].includes(id))return null;
 const wide=id==='wide';
 return {v:1,id,title:wide?'Wide sheet':'Small sheet',origin:MAP_TEXT.origin,notice:MAP_TEXT.notice,
  purpose:wide?'Fit the Mill-to-Bend path on 30 centimeters of usable paper.':'Fit the same path on 12 centimeters of usable paper.',sheetWidthCm:wide?30:12,otherWidthCm:wide?12:30,
  route:{from:'Mill',to:'Bend',lengthM:600},keys:[10,20,50],features:[{id:'narrows',label:'Narrows',widthM:24},{id:'ford',label:'Ford',widthM:15}],detailWidthCm:6,insetKey:5,
  readback:{from:'Library',to:'Mill',groundM:150},worked:{steps:[
   'Different example: a 400-meter path on 25 centimeters of usable paper.',
   'Use 1 centimeter for 20 meters. 400 ÷ 20 = 20 centimeters of drawing.',
   'The 20-centimeter drawing fits, leaving 5 centimeters. Another key could leave a different amount of room.'
  ],factsByStep:[[],[],[]]}};
}
