// Original Willow Post Office orders and worked examples.
export const POST_REVISION='willow-1';
const freeze=x=>{if(x&&typeof x==='object'){for(const v of Object.values(x))freeze(v);Object.freeze(x);}return x;};
export const places=freeze([
 {id:'post',name:'Willow Post Office',x:115,y:260,emoji:'✉️'},
 {id:'cafe',name:'Almost-Right Café',x:490,y:260,emoji:'☕'},
 {id:'orchard',name:'Cloud Orchard',x:150,y:90,emoji:'🌳'},
 {id:'hill',name:'Lantern Hill',x:450,y:90,emoji:'🏮'},
]);
export const recipients=freeze([
 {id:'clover',name:'Clover',kind:'bunny',place:'cafe',emoji:'🐰'},
 {id:'ember',name:'Ember',kind:'dragon',place:'hill',emoji:'🐉'},
 {id:'purl',name:'Purl',kind:'kitten',place:'orchard',emoji:'🐱'},
 {id:'moss',name:'Moss',kind:'gardener',place:'orchard',emoji:'🧑‍🌾'},
 {id:'wren',name:'Wren',kind:'bird',place:'hill',emoji:'🐦'},
 {id:'dot',name:'Dot',kind:'ladybug',place:'cafe',emoji:'🐞'},
]);
const helper=(destination,recipient)=>({destination,recipient,clauses:[`go:${destination}`,`give:${recipient}`]});
export const deliveries=freeze([
 {id:'clover-buns',title:'Buns for a welcome-back table',request:'Clover the bunny is at Almost-Right Café. Please bring 5 seed buns and 3 berry buns for the welcome-back table.',start:'post',recipient:'clover',destination:'cafe',math:{kind:'add',a:5,b:3,answer:8,unit:'buns',prompt:'How many buns go in the parcel?',explanation:'Put 5 seed buns beside 3 berry buns: 5 + 3 = 8 buns.',pictures:{kind:'add',groups:[{label:'Seed buns',count:5},{label:'Berry buns',count:3}]}},helper:helper('hill','ember')},
 {id:'ember-ribbons',title:'Ribbons for the lanterns',request:'Ember the dragon is at Lantern Hill. At the sorting counter, 9 lantern ribbons are ready. Reserve 2 for Post Office repairs, then deliver the remaining ribbons to Ember.',start:'post',recipient:'ember',destination:'hill',math:{kind:'subtract',a:9,b:2,answer:7,unit:'ribbons',prompt:'How many ribbons are left to deliver?',explanation:'Keep 2 of the 9 ribbons at the counter for repairs. The other 7 go to Ember: 9 − 2 = 7.',pictures:{kind:'subtract',groups:[{label:'Ribbons at the counter',count:9,reserved:2}]}},helper:helper('orchard','moss')},
 {id:'purl-blankets',title:'Soft blankets in baskets',request:'Purl the kitten is at Cloud Orchard. Please bring 3 baskets with 5 soft blankets in each basket.',start:'post',recipient:'purl',destination:'orchard',math:{kind:'multiply',a:3,b:5,answer:15,unit:'blankets',prompt:'How many blankets are in all 3 baskets?',explanation:'Each basket has 5 blankets. Count 5, 10, 15: 3 × 5 = 15 blankets.',pictures:{kind:'multiply',groups:Array.from({length:3},(_,i)=>({label:`Basket ${i+1}`,count:5}))}},helper:helper('cafe','dot')},
 {id:'moss-seeds',title:'Seed packets for new beds',request:'Moss the gardener is at Cloud Orchard. Please bring 4 bundles with 6 seed packets in each bundle.',start:'post',recipient:'moss',destination:'orchard',math:{kind:'multiply',a:4,b:6,answer:24,unit:'seed packets',prompt:'How many seed packets are in all 4 bundles?',explanation:'Four equal bundles of 6 make 6 + 6 + 6 + 6 = 24 seed packets.',pictures:{kind:'multiply',groups:Array.from({length:4},(_,i)=>({label:`Bundle ${i+1}`,count:6}))}},helper:helper('hill','wren')},
 {id:'wren-flags',title:'Flags for the safe landing',request:'Wren the bird is at Lantern Hill. Please bring 6 blue flags and 4 yellow flags to mark the safe landing.',start:'post',recipient:'wren',destination:'hill',math:{kind:'add',a:6,b:4,answer:10,unit:'flags',prompt:'How many flags go in the parcel?',explanation:'Six blue flags and 4 yellow flags make 10 flags: 6 + 4 = 10.',pictures:{kind:'add',groups:[{label:'Blue flags',count:6},{label:'Yellow flags',count:4}]}},helper:helper('cafe','clover')},
 {id:'dot-stars',title:'Paper stars for the café',request:'Dot the ladybug is at Almost-Right Café. There are 12 paper stars at the sorting counter. Reserve 5 for the Post Office sign and deliver the remaining stars to Dot.',start:'post',recipient:'dot',destination:'cafe',math:{kind:'subtract',a:12,b:5,answer:7,unit:'paper stars',prompt:'How many paper stars are left to deliver?',explanation:'Reserve 5 of the 12 stars for the sign. The remaining 7 go to Dot: 12 − 5 = 7.',pictures:{kind:'subtract',groups:[{label:'Stars at the counter',count:12,reserved:5}]}},helper:helper('orchard','purl')},
]);
