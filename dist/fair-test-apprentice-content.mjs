import {configurations} from './workshop-core.mjs';
export const apprenticePages=['notice','show','explain'];
export const apprenticeCases=[
 {id:'height',title:'Taller ramp, or something else?',mission:'height',question:'Does changing from a low ramp to a high ramp change the landing distance?',original:{a:'low-smooth',b:'high-rough'},claim:'Every B distance is larger. That proves the taller ramp alone caused the difference.',cards:[
  {id:'height-incomplete',fits:false,text:'B traveled farther in the shown trials. Tell the crew that observation, without addressing Moss’s explanation of what caused the difference.',feedback:'Moss: That preserves the observation, but I still need help with my height-only explanation.'},
  {id:'height-useful',fits:true,text:'B went farther in these trials. Height and surface both changed; compare low and high ramps on the same surface.',feedback:'Moss: We can retain the distance observation and repair the comparison before isolating height.'},
  {id:'height-discard',fits:false,text:'Keep the distances in our notes, but leave them out of the crew’s message until height’s effect has been isolated.',feedback:'Moss: We can report the shown distance difference now, while explaining that this comparison does not isolate height.'},
  {id:'height-overclaim',fits:false,text:'B traveled farther each time, so tell the crew that raising the ramp caused the difference, even with the changed surface.',feedback:'Moss: Height and surface changed together. These results do not identify height as the sole cause.'},
 ]},
 {id:'surface',title:'Which surface helped?',mission:'surface',question:'Does changing the rough landing surface to smooth change the distance?',original:{a:'low-rough',b:'high-smooth'},claim:'Every B distance is larger. The smooth surface alone must be the reason. Shall we tell the porch crew?',cards:[
  {id:'surface-overclaim',fits:false,text:'Tell the crew the smooth surface caused the extra distance; the high smooth setup went farther in every shown trial.',feedback:'Moss: Height changed too, so this comparison does not isolate surface.'},
  {id:'surface-incomplete',fits:false,text:'Choose A for the porch because its shown stopping distances are shorter; that gives the crew a practical recommendation to use.',feedback:'Moss: That addresses the porch’s purpose, but does not explain whether surface caused the difference.'},
  {id:'surface-discard',fits:false,text:'Since these are model trials, wait for real measurements before saying anything about the shown distances from A and B.',feedback:'Moss: We can compare these authored model distances without claiming they are physical measurements.'},
  {id:'surface-useful',fits:true,text:'B went farther in these trials, but height changed too. Compare rough and smooth at the same height.',feedback:'Moss: That retains the observation and proposes a comparison that isolates surface within this model.'},
 ]},
 {id:'careful',title:'A careful message worth keeping',mission:'height',question:'Does changing from a low ramp to a high ramp change the landing distance?',original:{a:'low-smooth',b:'high-smooth'},claim:'I kept both surfaces smooth. In these shown model examples, every distance from the high ramp is larger.',cards:[
  {id:'careful-cautious',fits:false,text:'Hold back this message until more trials are shown; the present results are too limited to describe any distance difference.',feedback:'Moss: More trials could extend the investigation, but the present message already limits itself to the shown examples.'},
  {id:'careful-overclaim',fits:false,text:'Keep the message and extend it: these results show that every real cart should travel farther from any high ramp.',feedback:'Moss: The model examples do not establish that universal real-cart claim.'},
  {id:'careful-useful',fits:true,text:'Keep this message: height changed, the surface stayed smooth, and the distance claim refers only to these shown model examples.',feedback:'Moss: The comparison changes height while controlling surface, and the wording stays within the supplied evidence.'},
  {id:'careful-wrong',fits:false,text:'Choose a different surface for one ramp before keeping the message; identical surfaces prevent a useful comparison of the two heights.',feedback:'Moss: Keeping surface the same is useful when investigating height. Changing it would introduce another difference.'},
 ]},
];
// Freeze this complete original model with each explicit encounter, not with each render.
export function apprenticeSource(id){const item=apprenticeCases.find(x=>x.id===id);return item?{version:1,...structuredClone(item),model:configurations.map(c=>({...structuredClone(c),unit:'model-cm',source:'authored-ramp'}))}:null;}
