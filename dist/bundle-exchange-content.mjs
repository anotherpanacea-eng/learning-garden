// Original finite conservation activities. Design/source references: spec 53.
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
const define=(id,title,total,initialWrapped,initialLoose)=>freeze({id,title,request:`Arrange the same ${total} individual seed counters. A wrapped bundle holds exactly ten.`,modelRevision:1,total,initialWrapped,initialLoose,initialFrame:0});
export const bundleCases=freeze([
 define('thirteen','Thirteen counters',13,0,13),
 define('twenty-seven','Twenty-seven counters',27,1,17),
 define('twenty','Twenty counters',20,2,0),
 define('thirty','Thirty counters',30,0,30),
 define('seven','Seven counters',7,0,7),
 define('empty','No counters',0,0,0),
 define('forty-two','Forty-two counters',42,3,12)
]);
export const bundleCase=id=>bundleCases.find(c=>c.id===id)||null;
export const bundlePages=freeze(['exchange','read','digits','keep']);
export const bundleKinds=freeze(['wrapped-count','total-count','tens-digit','tens-value']);
export const bundleUnits=freeze(['wrapped bundles','individual counters','digit']);
export const bundleHelpTopics=freeze(['units','digits','example']);
export const bundleExample=freeze({title:'A separate sixteen-counter example',total:16,steps:[
 {wrapped:0,loose:6,frame:10,text:'Sixteen counters: ten individual counters in the full frame and six loose counters.'},
 {wrapped:1,loose:6,frame:0,text:'Wrap the same ten. One wrapped ten and six loose counters still make sixteen.'},
 {wrapped:0,loose:6,frame:10,text:'Unwrap that ten into the empty frame. All sixteen counters are still here.'}
]});
