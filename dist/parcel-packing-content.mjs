// Original content; Jane is a design reference only. Scoped Marble references,
// formal-method exceptions and unchanged source licensing are documented in spec 51.
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
export const PACKING_CASES=freeze([
 ['lantern-seeds','Lantern welcome seeds','Prepare seed envelopes for the lantern welcome.',17,5],
 ['bridge-seeds','Bridge garden seeds','Prepare seed envelopes for the bridge garden.',23,6],
 ['meadow-seeds','Meadow seed delivery','Prepare seed envelopes for the meadow.',29,4],
 ['exact-seeds','Seeds for the long garden row','Twenty seed envelopes that fit their bags just right.',20,5]
].map(([id,title,purpose,total,capacity])=>({id,title,purpose,total,capacity,modelRevision:1,objectUnit:'envelopes'})));
export const packingById=id=>PACKING_CASES.find(c=>c.id===id)||null;
export const PACKING_PAGES=freeze(['choose','pack','read','purpose','keep']);
export const PACKING_PURPOSES=freeze(['kits','all']);
export const PACKING_UNITS=freeze(['full bags','loose envelopes','loaded trips']);
export const PACKING_KINDS=freeze(['read-full','read-loose','kits','all']);
export const PACKING_HELP=freeze(['group','partial','capacity','meaning','example']);
export const PACKING_SUPPORT=freeze(['visual','handling','countedFill','workedExample','group','partial','capacity','meaning','narration','together','readFullFeedback','readLooseFeedback','kitsFeedback','allFeedback']);
export const PACKING_EXAMPLE=freeze({id:'fourteen-four',title:'A different example',total:14,capacity:4,kits:3,remainder:2,all:4,notice:'An example with different numbers. Your packing table stays as it was.'});
export const PACKING_TEACHING=freeze({group:'A full bag is one whole group. Every full bag holds the same number of envelopes. Count the bags separately from the envelopes inside them. Here we make groups of a set size.',partial:'Only a full bag makes a kit. Envelopes inside a partly full bag are packed, so they are out of the loose pile. A partly full bag can still go on a trip.',capacity:'Capacity is the most envelopes one bag can hold. The broom carries one bag on each trip. Only trips that carry envelopes count.',meaning:'For kits, make as many full bags as you can and leave spare envelopes loose. For delivery, carry every envelope in the fewest trips. The same envelopes can need different answers, because the jobs are different.',exact:'When the full bags use every envelope, none are left loose. Both jobs have the same answer. An extra trip would carry an empty bag.',ending:'The bags are sealed. Somewhere a garden is waiting to be surprised.'});
