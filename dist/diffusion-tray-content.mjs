// Original, finite teaching copy for an invented two-space exchange model.
export const diffusionCases=[
 {id:'left',title:'More circles on the left'},
 {id:'right',title:'More circles on the right'},
 {id:'even',title:'Equal starting counts'},
 {id:'closed',title:'No crossings allowed'}
];
const contexts={
 left:'The town collection asks: does every marker travel from the more crowded side? Follow a marker and compare both crossing counts.',
 right:'Try the opposite starting pattern. Does a different starting side change which overall direction is expected?',
 even:'The two sides start with equal circle counts. Are the markers finished moving? Advance several snapshots and look again.',
 closed:'This invented boundary lets neither marker kind cross. Moving within a space and crossing a boundary are different things.'
};
export function diffusionSource(id,seed){
 const entry=diffusionCases.find(item=>item.id===id);
 if(!entry||!Number.isInteger(seed)||seed<1||seed>4294967295)return null;
 const left={left:12,right:4,even:8,closed:12}[id];
 return {v:1,model:'diffusion-two-space-v1',id,title:entry.title,context:contexts[id],
  notice:'Two equal-volume model spaces. These are symbols, not molecules drawn to scale or microscope views. One step is not a second. This model has no temperature setting. The crossing chance is invented, not a measured diffusion rate. Wiggles and straight crossing paths are diagram cues, not realistic molecular trajectories. Trials are pseudo-random and can differ. No directed pump or ATP use is represented; thermal motion still involves energy. Solvent particles are not drawn.',
  ruleNotice:'At each step, a crossing-enabled marker has about a one-in-four chance to change sides, whatever side it is on and however crowded either side is. A marker that cannot cross stays in its original space. All markers represent moving matter, even when none crosses. A kept snapshot saves the starting setup, this and the preceding snapshot, and cumulative crossings, not every earlier step. Both model volumes are held fixed. Water movement and changes in volume are left out.',
  membraneRole:'A thin boundary helps regulate what enters and leaves the cell. It is different from a plant cell wall.',
  teaching:[
   'Random movement has no goal. Our markers stand for dissolved particles; they do not choose where to go.',
   "For one substance, concentration means how much is in a given volume. Our two spaces have equal volume, so compare that substance's counts.",
   'When markers can cross and one side is more crowded, more crossings are expected from that side over many steps. One short step can go the other way.',
   'Equal starting counts do not freeze the particles. When markers can cross, the counts in this small model can fluctuate even when neither side is favored.',
   'A real cell membrane lets some substances cross more easily than others. Our invented boundary rule is not a real membrane test.',
   'Oxygen and carbon dioxide can cross cell membranes by simple diffusion. We are not modeling a lung, blood flow, water movement or a glucose transporter.'
  ],
  kinds:[{id:'circle',label:'Circle markers',symbol:'circle',canCross:id!=='closed'},{id:'diamond',label:'Diamond markers',symbol:'diamond',canCross:false}],
  particles:[...Array.from({length:16},(_,i)=>({id:`circle-${i+1}`,kindId:'circle',side:i<left?'left':'right'})),...Array.from({length:8},(_,i)=>({id:`diamond-${i+1}`,kindId:'diamond',side:i<4?'left':'right'}))],
  seed,equalVolumes:true
 };
}
