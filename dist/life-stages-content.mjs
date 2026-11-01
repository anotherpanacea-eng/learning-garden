// Original supplied chart of one named species. No source art/prose or rearing schedule.
export const lifePages=['inspect','connect','meaning','kept'];
export const stageIds=['egg','larva','pupa','adult'];
export const lifeMeanings=[{id:'same',label:'Same individual growing/changing'},{id:'offspring',label:'Offspring: another generation'},{id:'unsure',label:'Not sure yet'}];
const stages=[
 {id:'egg',label:'Egg',text:'A female small white butterfly can lay single yellow eggs under cabbage leaves. A caterpillar can hatch from an egg. Our picture shows one egg.',pictureText:'One yellow egg on the labeled underside of a cabbage leaf. This enlarged schematic is not a size comparison or a field observation.',drawing:{version:1,kind:'egg'}},
 {id:'larva',label:'Caterpillar (larva)',text:'This small white caterpillar eats cabbage leaves and grows. It can later form a chrysalis. It does not have the adult’s wings.',pictureText:'A pale green segmented caterpillar with fine short hairs on a cabbage leaf. The leaf hides its underside; hidden appendages are not counted or declared absent.',drawing:{version:1,kind:'larva'}},
 {id:'pupa',label:'Chrysalis (pupa)',text:'The chrysalis is the pupa stage. It is attached to a support while the body changes. An adult butterfly can later emerge.',pictureText:'An angular chrysalis attached to a vertical support. It is a changing life stage, not a fabric bag or a different butterfly entering a cocoon.',drawing:{version:1,kind:'pupa'}},
 {id:'adult',label:'Adult butterfly',text:'This adult small white has wings. Adult females can lay eggs that begin the lives of offspring. An adult does not turn back into an egg.',pictureText:'A schematic female small white butterfly with pale wings and dark forewing tips. It is a stage picture, not a spot-count or species-identification test.',drawing:{version:1,kind:'adult'}},
];
const links=[
 {from:'egg',to:'larva',meaning:'same',text:'A caterpillar can hatch from an egg.'},
 {from:'larva',to:'pupa',meaning:'same',text:'A grown caterpillar can form a chrysalis.'},
 {from:'pupa',to:'adult',meaning:'same',text:'An adult can emerge from its chrysalis.'},
 {from:'adult',to:'egg',meaning:'offspring',text:'Adult females can lay eggs; offspring begin another generation.'},
];
const overview='Our pictures show a possible life story. Egg, caterpillar, chrysalis and adult are different stages. The caterpillar, chrysalis and emerging adult can be the same individual. An adult female’s eggs begin offspring: another generation.';
const help=overview+' Looking back through a chart is not growing backward. For a before-question, put the earlier chosen stage before our reference picture in the forward biological link. Offspring are a new generation; the adult does not turn into an egg. Our original diagrams and words are not observations of a tracked animal. This is the small white, also called cabbage white, Pieris rapae; other butterflies can have other host plants.';
const rows=[
 ['egg-next','After the egg','Which stage comes next after the egg on this chart?','egg','next','larva','same',0],
 ['larva-next','After the caterpillar','Which stage comes next after the caterpillar on this chart?','larva','next','pupa','same',3],
 ['pupa-next','After the chrysalis','Which stage comes next after the chrysalis on this chart?','pupa','next','adult','same',3],
 ['adult-next','Offspring after the adult','Which stage follows the adult on the life-cycle chart, beginning offspring?','adult','next','egg','offspring',2],
 ['larva-before','Before the caterpillar','Looking back through the chart, which stage came before the caterpillar?','larva','before','egg','same',2],
 ['pupa-before','Before the chrysalis','Looking back through the chart, which stage came before the chrysalis?','pupa','before','larva','same',1],
 ['adult-before','Before the adult','Looking back through the chart, which stage came before the adult?','adult','before','pupa','same',3],
 ['egg-before','A parent before the new eggs','Which parent stage comes before a new generation’s eggs on this chart?','egg','before','adult','offspring',2],
];
export const lifeCases=rows.map(([id,title,question,reference,direction,neighbor,meaning,offset])=>({version:1,id,chartId:'small-white-life-stages',title,species:'Pieris rapae',commonName:'Small White / Cabbage White',question,reference,direction,stages:structuredClone(stages),links:structuredClone(links),options:[...stageIds.slice(offset),...stageIds.slice(0,offset)],expected:{neighbor,meaning},overview,help}));
export const lifeSource=id=>{const s=lifeCases.find(x=>x.id===id);return s?structuredClone(s):null;};
