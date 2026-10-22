import {configurations} from './workshop-core.mjs';
export const apprenticePages=['notice','show','explain'];
export const apprenticeCases=[
 {id:'height',title:'Taller ramp, or something else?',mission:'height',question:'Does changing from a low ramp to a high ramp change the landing distance?',original:{a:'low-smooth',b:'high-rough'},claim:'Every B distance is larger. That proves the taller ramp alone caused the difference.',cards:[
  {id:'height-useful',fits:true,text:'B went farther in these examples, but both height and surface changed. Keep the surface the same to compare the low and high ramps.',feedback:'Moss: I can keep the distance observation and change the comparison before blaming one cause.'},
  {id:'height-incomplete',fits:false,text:'B went farther in these examples.',feedback:'Moss: That describes the distances. I still need help with my claim that height alone caused the difference.'},
  {id:'height-overclaim',fits:false,text:'The bigger B numbers prove that only height mattered.',feedback:'Moss: Both settings changed, so these numbers do not isolate height.'},
  {id:'height-discard',fits:false,text:'Two settings changed, so none of these distances tells us anything.',feedback:'Moss: The distances still describe these examples. They do not isolate which change caused the difference.'},
 ]},
 {id:'surface',title:'Which surface helped?',mission:'surface',question:'Does changing the rough landing surface to smooth change the distance?',original:{a:'low-rough',b:'high-smooth'},claim:'Every B distance is larger. The smooth surface alone must be the reason. Shall we tell the porch crew?',cards:[
  {id:'surface-useful',fits:true,text:'B went farther in these examples, but height changed too. Keep the height the same to compare rough and smooth.',feedback:'Moss: I can show the distance difference without claiming surface was the only cause.'},
  {id:'surface-incomplete',fits:false,text:"The porch needs a short stopping distance.",feedback:"Moss: That names the crew's purpose, but it does not explain what this comparison can tell us."},
  {id:'surface-overclaim',fits:false,text:'Only the surface matters, because B has the largest numbers.',feedback:'Moss: A and B also use different heights. The numbers alone do not separate those changes.'},
  {id:'surface-discard',fits:false,text:'No comparison is possible because the trials are made up.',feedback:'Moss: We can compare the shown model examples, while remembering that they are not physical measurements.'},
 ]},
 {id:'careful',title:'A careful message worth keeping',mission:'height',question:'Does changing from a low ramp to a high ramp change the landing distance?',original:{a:'low-smooth',b:'high-smooth'},claim:'I kept both surfaces smooth. In these shown model examples, every distance from the high ramp is larger.',cards:[
  {id:'careful-useful',fits:true,text:'That is careful: the surface stayed the same, height changed, and your message names these model examples.',feedback:'Moss: I can keep this limited claim. It does not promise what every real cart will do.'},
  {id:'careful-overclaim',fits:false,text:'This proves every real cart always travels farther from a high ramp.',feedback:'Moss: These are a few authored model examples, not evidence about every real cart.'},
  {id:'careful-wrong',fits:false,text:'Your comparison is confounded because both ramps use smooth ground.',feedback:'Moss: Keeping the ground the same is useful here. Height is the factor we changed.'},
  {id:'careful-incomplete',fits:false,text:'The high ramp is taller.',feedback:'Moss: That names a setting but does not explain why this is a useful comparison or how limited the claim is.'},
 ]},
];
// Freeze this complete original model with each explicit encounter, not with each render.
export function apprenticeSource(id){const item=apprenticeCases.find(x=>x.id===id);return item?{version:1,...structuredClone(item),model:configurations.map(c=>({...structuredClone(c),unit:'model-cm',source:'authored-ramp'}))}:null;}
