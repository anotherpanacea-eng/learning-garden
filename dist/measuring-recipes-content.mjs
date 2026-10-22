// Original mathematical picture content. Jane, Marble and the teaching sources
// in spec 45 informed the design; no upstream code, text or artwork is copied.
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
export const RECIPE_MODEL_ID='measuring-kitchen-v1';
export const RECIPE_INGREDIENTS=freeze([
 {id:'cloud-water',name:'cloud-water',pattern:'dots',colour:'#729faf'},
 {id:'star-water',name:'star-water',pattern:'stripes',colour:'#b69b58'}
]);
export const RECIPE_MODEL=freeze({id:RECIPE_MODEL_ID,unit:'mL',jugCapacity:500,jarCapacity:500,sourceAmount:1000,transfer:50,
 notice:'Pretend ingredients, exact picture amounts. We are practicing reading a scale.',
 details:'Capacity is the most a container can hold. Contained volume is how much liquid is in it now. Our straight-sided picture jug has ten equal 50 mL intervals between eleven marks. This exact picture machine omits real pouring uncertainty, wet surfaces and meniscus reading. The two preparation jars stay separate; their combined amounts on the tray are not a measured mixture volume.'});
export const RECIPE_CASES=freeze([
 ['welcome-broth','Welcome-back tray','Purl sets out a welcome-back broth tray.',150,100],
 ['lantern-supper','Lantern supper','Wisp prepares the lantern-menders’ supper tray.',250,150],
 ['bridge-picnic','Bridge picnic','Clover packs a tray for the bridge crew.',300,200],
 ['moonlight-toast','Moonlight celebration','Ember prepares a moonlight celebration tray.',100,200],
 ['rainy-rehearsal','Puppet rehearsal','Dot prepares a tray for the puppet rehearsal.',350,100],
 ['garden-thanks','Gardeners’ thanks','Pip prepares the gardeners’ thank-you tray.',200,250]
].map(([id,title,purpose,cloud,star])=>({id,title,purpose,modelId:RECIPE_MODEL_ID,unit:'mL',targets:{'cloud-water':cloud,'star-water':star},apparatus:RECIPE_MODEL})));
export const recipeById=id=>RECIPE_CASES.find(c=>c.id===id)||null;
export const RECIPE_PAGES=freeze(['choose','measure','tray','keep']);
export const RECIPE_UNITS=freeze(['mL','g','items']);
export const RECIPE_SUPPORT=freeze(['visual','handling','intervalStrip','audio','together','readingReveal','difference','workedExample','readingFeedback','trayFeedback']);
export const RECIPE_EXAMPLE=freeze({id:'four-hundred-ml-example',title:'A different picture request',request:'Fill the example jug to 400 mL. Each fill transfers 50 mL.',target:400,transfer:50,steps:8,notice:'Supplied example: this jug is separate from your recipe apparatus.'});
export const RECIPE_CONVERSATION='Which scale did you read, and what would you change?';
