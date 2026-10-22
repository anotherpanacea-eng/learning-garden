// Original closed-picture knowledge pack; primary fact references are in source audit62.
// Version1 drawing identities refer to the stable original renderer, never imported SVG.
export const bodyPages=['inspect','key','keep'];
export const bodyLegOptions=[{id:'0',label:'0'},{id:'6',label:'6 · three pairs'},{id:'14',label:'14 · seven pairs'},{id:'other',label:'A different count'},{id:'unsure',label:'I cannot tell'}];
export const bodyKey=[
 {id:'snail',legs:'0',body:'shell',label:'Garden land snail',clue:'Coiled shell'},
 {id:'worm',legs:'0',body:'rings',label:'Earthworm',clue:'Long ringed body, no external coiled shell'},
 {id:'ladybird',legs:'6',body:'cases',label:'Ladybird beetle',clue:'Paired hard wing cases meeting in the middle'},
 {id:'woodlouse',legs:'14',body:'plates',label:'Woodlouse',clue:'Flattened body with overlapping plates'}
];
const help='Use our four-picture key, not a rule for every animal outdoors. Count jointed walking legs in the detail, not feelers, tentacles, spots or a muscular foot. Then use a second body clue. Zero legs alone cannot tell our snail and earthworm apart. If a clue is unclear or different, stop and look again. A hidden leg is not an absent leg.';
const specimens=[
 {id:'snail',title:'Picture A',label:'Garden land snail',inspection:'A soft body moves on a broad muscular foot. A coiled shell sits above it. The feelers are tentacles; the foot and tentacles are not jointed walking legs.',bodyText:'Adult garden land snail teaching diagram: a soft body beneath a coiled shell, with tentacles at the head and no jointed walking legs.',detailText:'Walking-leg teaching detail: a broad muscular foot and tentacles, with zero jointed walking legs.',legs:'0',body:'shell'},
 {id:'worm',title:'Picture B',label:'Earthworm',inspection:'The long body has many ring-like divisions. There is no external coiled shell and no jointed walking legs. We do not need to count the rings.',bodyText:'Adult earthworm teaching diagram: a long soft body with ring-like divisions and no external coiled shell.',detailText:'Walking-leg teaching detail: the long ringed body has zero jointed walking legs. The rings are body divisions, not legs.',legs:'0',body:'rings'},
 {id:'ladybird',title:'Picture C',label:'Ladybird beetle',inspection:'Three pairs of jointed walking legs attach beneath the body. Two antennae are feelers, not legs. The paired hard wing cases meet along the middle. A ladybird is a beetle; spots and color alone are not our identifying rule.',bodyText:'Adult ladybird beetle teaching diagram: paired hard wing cases meet along the middle. Six jointed walking legs and two separate antennae are shown.',detailText:'Underside teaching view of the same adult: three pairs, six jointed walking legs, attach beneath the body. The two thinner antennae are feelers, not walking legs.',legs:'6',body:'cases'},
 {id:'woodlouse',title:'Picture D',label:'Woodlouse',inspection:'Seven pairs of jointed walking legs attach beneath the body. Overlapping plates cover the flattened body. Feelers and other appendages are not extra walking legs. This picture shows an adult.',bodyText:'Adult woodlouse teaching diagram: overlapping plates cover a flattened body, with seven pairs of walking legs beneath.',detailText:'Underside teaching view of the same adult: seven pairs, fourteen jointed walking legs. Feelers and other appendages are outside this walking-leg count.',legs:'14',body:'plates'}
];
export const bodyCatalog=specimens.map(({legs,body,...s})=>({version:1,...s,drawing:{version:1,kind:s.id},expected:{legs,body},help,key:structuredClone(bodyKey)}));
export function bodySource(id){const source=bodyCatalog.find(s=>s.id===id);return source?structuredClone(source):null;}
export function bodyFeatureChoices(source,legs){return ['0','6','14'].includes(legs)?[...source.key.filter(k=>k.legs===legs).map(k=>({id:k.body,label:k.clue})),{id:'other',label:'Something else'},{id:'unsure',label:'I cannot tell'}]:[];}
