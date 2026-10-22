// Original content; Jane is a design reference only. Scoped Marble references,
// formal-method exceptions and unchanged source licensing are documented in spec 51.
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
export const PACKING_CASES=freeze([
 ['lantern-seeds','Lantern welcome seeds','Prepare seed envelopes for the lantern welcome.',17,5],
 ['bridge-seeds','Bridge garden seeds','Prepare seed envelopes for the bridge garden.',23,6],
 ['meadow-seeds','Meadow seed delivery','Prepare seed envelopes for the meadow.',29,4],
 ['exact-seeds','An exact-fit seed request','Prepare an exact-fit seed request.',20,5]
].map(([id,title,purpose,total,capacity])=>({id,title,purpose,total,capacity,modelRevision:1,objectUnit:'envelopes'})));
export const packingById=id=>PACKING_CASES.find(c=>c.id===id)||null;
export const PACKING_PAGES=freeze(['choose','pack','read','purpose','keep']);
export const PACKING_PURPOSES=freeze(['kits','all']);
export const PACKING_UNITS=freeze(['full bags','loose envelopes','loaded trips']);
export const PACKING_KINDS=freeze(['read-full','read-loose','kits','all']);
export const PACKING_HELP=freeze(['group','partial','capacity','meaning','example']);
export const PACKING_SUPPORT=freeze(['visual','handling','countedFill','workedExample','group','partial','capacity','meaning','narration','together','readFullFeedback','readLooseFeedback','kitsFeedback','allFeedback']);
export const PACKING_EXAMPLE=freeze({id:'fourteen-four',title:'A separate supplied example',total:14,capacity:4,kits:3,remainder:2,all:4,notice:'Supplied support with different quantities. Your packing table stays as it was.'});
export const PACKING_TEACHING=freeze({group:'A full bag is one complete group of the stated size. Count the bags separately from the envelopes in them. This is grouping by a given size, not sharing between a given number of people.',partial:'A partly filled bag is not a complete kit. Envelopes inside partial bags are not in the loose pile. A delivery may carry a partly filled bag.',capacity:'Capacity here means the greatest number of envelopes permitted in one bag. One bag fits on the broom per outward loaded trip. Empty returns and empty bags are not counted as loaded trips.',meaning:'For kits, find the greatest number of complete full bags and leave spare envelopes loose. For delivery, carry every envelope using the fewest loaded trips. The same objects can need different answers because the purposes differ.',exact:'When the full bags use every envelope, none remain loose. Both purposes use the same count; adding another trip would invent an empty journey.',ending:'The seed-envelope plan is sealed. A small contribution is ready for its own next journey; other Post Office work stays open.'});
