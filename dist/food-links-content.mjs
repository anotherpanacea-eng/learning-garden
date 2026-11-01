// Original named teaching pathway, not observed field data or complete diets.
export const foodPages=['inspect','connect','meaning','kept'];
export const cardIds=['bean','aphid','ladybird-larva'];
const meanings=[{id:'energy',label:'Food supplies energy to an eater.'},{id:'development',label:'One animal changes its life stage.'},{id:'travel',label:'An animal travels to a place.'},{id:'unsure',label:'Not sure yet.'}];
const cards=[
 {id:'bean',label:'Broad bean plant',scientificName:'Vicia faba',text:'A broad bean plant is one food source in our example. A black bean aphid can take sap from the plant. Sap is a liquid inside the plant; the aphid does not chew up the whole plant.',pictureText:'An original schematic broad bean stem with paired broad leaves. Plant sap, not a chewed whole plant or loose bean, supplies food in this example. Pictures are not to scale.',drawing:{version:1,kind:'bean'}},
 {id:'aphid',label:'Black bean aphid',scientificName:'Aphis fabae',text:'This named black bean aphid takes sap from a broad bean plant. It can be food for a seven-spot ladybird larva. A black body alone does not identify an aphid species.',pictureText:'An enlarged named wingless black bean aphid nymph with a pear-shaped body, six walking legs, antennae and two rear cornicles. A fine feeding mouthpart reaches a plant stem. This is a drawn diagram, not an identification or leg-count task.',drawing:{version:1,kind:'aphid'}},
 {id:'ladybird-larva',label:'Seven-spot ladybird larva',scientificName:'Coccinella septempunctata',text:'A seven-spot ladybird larva can eat black bean aphids. A larva is a young stage, not the red wing-covered adult. This example does not tell us every food of every ladybird.',pictureText:'An original elongated grey seven-spot ladybird larva with six front walking legs and four pairs of orange markings. No adult red wing cases or wings. This named schematic is not a species-identification task; pictures are not to scale.',drawing:{version:1,kind:'ladybird-larva'}},
];
const links=[{from:'bean',to:'aphid',text:'Sap from the broad bean plant provides food to the black bean aphid.'},{from:'aphid',to:'ladybird-larva',text:'The black bean aphid can be food for the seven-spot ladybird larva.'}];
const legend='Arrow: food → eater. Food supplies energy to the eater.';
const overview='This is one possible feeding path: sap from a broad bean plant provides food for a black bean aphid, and the aphid can be food for a seven-spot ladybird larva. Our food arrows show food supplying energy to an eater. These are different organisms, not one creature changing stage. This is not a complete list of their foods or an observation in our garden.';
const help=overview+' Look at the food-arrow legend. If our question names an eater, choose its food and put that food on the left. If it names a food source, choose the eater and put the eater on the right. Looking up either end does not reverse who eats whom. Our plant link means sap taken from the plant, not swallowing a whole plant. These names do not identify animals outdoors.';
const rows=[
 ['aphid-food','Food for the aphid','What provides food for the black bean aphid in our example?','aphid','eater','bean',1,0],
 ['bean-eater','An eater using the plant','Which animal can take food from the broad bean plant in our example?','bean','food','aphid',2,2],
 ['larva-food','Food for the larva','What can be food for the seven-spot ladybird larva in our example?','ladybird-larva','eater','aphid',1,1],
 ['aphid-eater','An eater of the aphid','Which animal can eat the black bean aphid in our example?','aphid','food','ladybird-larva',1,2],
];
const rotate=(xs,n)=>[...xs.slice(n),...xs.slice(0,n)];
export const foodCases=rows.map(([id,title,question,reference,role,neighbor,offset,meaningOffset])=>({version:1,id,pathId:'bean-aphid-ladybird-larva',title,question,reference,role,cards:structuredClone(cards),links:structuredClone(links),options:rotate(cardIds,offset),meanings:structuredClone(meanings),meaningOptions:rotate(['energy','development','travel'],meaningOffset),expected:{neighbor,meaning:'energy'},legend,overview,help}));
export const foodSource=id=>{const s=foodCases.find(x=>x.id===id);return s?structuredClone(s):null;};
