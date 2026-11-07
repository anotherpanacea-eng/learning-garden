// Original finite net summaries and teaching, independently reviewed in spec386.
export const leafCases=[
 {id:'leaf-light',title:'A green leaf in the light'},
 {id:'leaf-respiration',title:'A leaf needs energy too'},
 {id:'root-respiration',title:'The root below the soil'}
];
const species=[
 {id:'co2',label:'carbon dioxide',atoms:{C:1,H:0,O:2}},
 {id:'water',label:'water',atoms:{C:0,H:2,O:1}},
 {id:'glucose',label:'glucose',atoms:{C:6,H:12,O:6}},
 {id:'oxygen',label:'oxygen',atoms:{C:0,H:0,O:2}}
];
const energyOptions=[
 {id:'light',label:'Light energy',description:'Energy arriving as light; no carbon, hydrogen or oxygen atom tile represents it here.'},
 {id:'sugar',label:'Chemical energy in sugar',description:'Sugar is matter. Its arrangement of atoms, together with oxygen, is linked to energy that cells can transfer.'},
 {id:'activity-heat',label:'Energy for cell activity and heat to surroundings',description:'During aerobic respiration, energy is transferred for cell activity through ATP, and some goes to the surroundings as heat. This board does not count ATP molecules or measure energy.'}
];
const teaching=[
 'One water molecule has two hydrogen atoms and one oxygen atom. Two water molecules have four hydrogen atoms and two oxygen atoms. They are still two water molecules.',
 'In a chemical change, atoms are rearranged. Count each kind on both sides. Matching numbers check the bookkeeping; they do not show that a real cell carries out the change.',
 'Light supplies energy for photosynthesis. Food contains matter and has chemical energy. Keeping these two accounts separate helps us avoid turning sunlight into an extra material ingredient.'
];
const photoSlots=[
 {id:'co2-in',speciesId:'co2',side:'in',referenceCount:6},
 {id:'water-in',speciesId:'water',side:'in',referenceCount:6},
 {id:'glucose-out',speciesId:'glucose',side:'out',referenceCount:1},
 {id:'oxygen-out',speciesId:'oxygen',side:'out',referenceCount:6}
];
// Respiration is authored independently, not produced by reversing photosynthesis.
const respirationSlots=[
 {id:'glucose-in',speciesId:'glucose',side:'in',referenceCount:1},
 {id:'oxygen-in',speciesId:'oxygen',side:'in',referenceCount:6},
 {id:'co2-out',speciesId:'co2',side:'out',referenceCount:6},
 {id:'water-out',speciesId:'water',side:'out',referenceCount:6}
];
const respirationNote='Aerobic respiration transfers some chemical energy from food for cell activity through ATP; some is transferred as heat to the surroundings. Glucose represents a sugar here, including sugars transported through the plant in other forms. Oxygen gas helps form water; the carbon in carbon dioxide comes from the sugar. Six and six does not mean each oxygen molecule becomes a carbon dioxide molecule. The matter summary leaves ATP and the many intermediate steps out. Energy is transferred, not created or destroyed.';
const cases={
 'leaf-light':{
  context:'A selected green leaf has cells with chloroplasts. In adequate light, those cells can use carbon dioxide and water to make sugars. Help explain where the matter comes from.',
  process:'Photosynthesis',location:'Photosynthesis in this example happens in chloroplasts.',
  task:'Build a net photosynthesis summary. Which whole molecules belong on each side? Their kinds are given; you choose how many.',
  notice:'A net chemical summary, not a growing plant, a measured rate or a map of individual atoms.',
  about:'The net water amount leaves out water made and reused during the steps. Oxygen gas released in photosynthesis comes from water. This net equation does not show the route of each oxygen atom. Soil still supplies water and mineral nutrients; it is not simply irrelevant. The carbon in the sugars comes from carbon dioxide, not light.',
  returnQuestion:'Look at a selected leaf cell and a selected non-green root cell in Cell Studio. Which has chloroplasts? Why would that difference matter to this process? A drawing does not measure whether photosynthesis is happening.',
  slots:photoSlots,energyReference:{fromId:'light',toId:'sugar',note:'Light energy helps make energy-storing carbohydrates from carbon dioxide and water. Glucose stands for a sugar in this net summary. Real photosynthesis has many steps; a whole glucose molecule is not made in one step.'}
 },
 'leaf-respiration':{
  context:'Living leaf cells respire in light and in darkness. Photosynthesis does not replace respiration when the sun shines. Make another account for sugar and oxygen being used.',
  process:'Aerobic cellular respiration',location:'Respiration begins in cytoplasm; important later steps happen in mitochondria. This leaf cell has mitochondria as well as chloroplasts.',
  task:'Build a net aerobic respiration summary. Keep the matter account separate from the energy transfer.',
  notice:'A simplified net summary. Matching the atoms does not explain the mechanism or show how fast a cell respires.',
  about:'The net matter summaries for photosynthesis and respiration look like reversals. The real processes follow different pathways with different enzymes and locations. This board does not run one process backward.',
  returnQuestion:'Find mitochondria in the selected leaf cell. Then compare the human-body carbon dioxide route in Air and blood. Plants have no lungs or blood, but moving a gas and making it in a chemical change are different explanations.',
  slots:respirationSlots,energyReference:{fromId:'sugar',toId:'activity-heat',note:respirationNote}
 },
 'root-respiration':{
  context:'This selected non-green underground root cell has no chloroplasts. Sugars made elsewhere in the plant can be transported to it. It still needs energy for cell activity.',
  process:'Aerobic cellular respiration',location:'Respiration begins in cytoplasm; important later steps happen in mitochondria. This selected root cell has mitochondria.',
  task:'Can you make a respiration account for a cell that does not photosynthesize?',
  notice:'One selected non-green root cell, not every kind of root. This is a chemical summary, not a soil or plant-growth measurement.',
  about:'Some roots can be green. Our selected cell is not. Transported sugar supplies matter and chemical energy; absence of chloroplasts does not mean the cell has no energy transfers. Water and mineral nutrients are also needed by the plant.',
  returnQuestion:'Compare your kept account with the selected root illustration. How could transported sugar help explain what this cell does without chloroplasts? Return to Seedlings after the storm: can pictured stem lengths alone show these chemical changes? What further evidence would you need?',
  slots:respirationSlots,energyReference:{fromId:'sugar',toId:'activity-heat',note:respirationNote}
 }
};
export function leafSource(caseId='leaf-light'){
 const c=leafCases.find(c=>c.id===caseId);if(!c)return null;
 return structuredClone({v:1,model:'leaf-accounts-v1',id:c.id,title:c.title,...cases[c.id],species,energyOptions,teachingDemo:{speciesId:'water',count:2},teaching});
}
export const leafCopy=Object.freeze({
 label:"A leaf's two accounts",
 story:'The town collection needs a guide to how plants make food and use it. Build a summary for the next keeper.',
 firstTask:'Change the number of each kind of molecule. Then look at the matter and energy accounts separately.',
 matterHeading:'Matter: count the atoms',energyHeading:'Energy: follow the transfer',energyNotice:'Energy is not an atom tile. Light does not turn into the plant’s matter.',
 diagramNote:'Each outlined group represents one molecule’s composition, not its shape or bonds. The number outside the formula counts whole molecules. The small numbers inside the formula stay the same.',
 empty:'No molecules selected. Zero matches zero, but this is an empty summary.',match:'The atom counts match. Matching atoms is a bookkeeping check. It does not show that this process happens.',
 different:'These atom counts do not match yet. The table shows how your selected amounts differ. This is your unfinished summary, not a claim that a plant creates or destroys atoms.',
 captionNote:'These are your chosen captions. Compare with the reference or talk them through with someone. They are not scored.',
 atomNames:Object.freeze({C:'Carbon',H:'Hydrogen',O:'Oxygen'}),atomColumns:Object.freeze(['Atom','Used','Made','Made minus used']),
 referenceHeading:'Reference summary, separate from yours',referenceIntro:'This is a simplified net account of many steps. Your summary stays as you made it. Doubling every count keeps the same ratio; it does not show a faster or measured plant.',
 keepNote:'Unfinished and unexpected summaries are welcome. Keeping one is not a score.',draftWarning:'Keep work you want to return to. Leaving or reloading loses drafts that have not been kept.',
 makeTurn:'Make a summary',readTurn:'Read both accounts',used:'Used in this summary',made:'Made in this summary',energyFrom:'Energy at the start',energyTo:'Energy transferred to',notChosen:'Not chosen',countAction:'Count atoms',referenceAction:'Show the reference summary'
});
