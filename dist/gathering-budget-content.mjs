// Original, finite pretend-stall content. These prices are a model, not real offers.
export const gatheringCases=Object.freeze([
 Object.freeze({
  id:'welcome-table',title:'Welcome table',limit:16,
  request:'The neighbors are setting a pretend welcome table. Bring at least three place cards and one welcome sign. You can spend up to 16 pretend cents.',
  needs:[{id:'cards',name:'Place cards',singular:'place card',minimum:3},{id:'signs',name:'Welcome signs',singular:'welcome sign',minimum:1}],
  items:[
   {id:'plain-card',name:'Plain card',units:[1,0],price:3,stock:3},
   {id:'folded-pair',name:'Folded card pair',units:[2,0],price:5,stock:2},
   {id:'paper-sign',name:'Paper welcome sign',units:[0,1],price:6,stock:1},
   {id:'leaf-sign',name:'Leaf-shaped welcome sign',units:[0,1],price:7,stock:1}
  ]
 }),
 Object.freeze({
  id:'path-gathering',title:'Path gathering',limit:18,
  request:'The neighbors are marking a pretend path to the gathering. Bring at least four path markers and two map copies. You can spend up to 18 pretend cents.',
  needs:[{id:'markers',name:'Path markers',singular:'path marker',minimum:4},{id:'maps',name:'Map copies',singular:'map copy',minimum:2}],
  items:[
   {id:'star-marker',name:'Star marker',units:[1,0],price:3,stock:4},
   {id:'diamond-pair',name:'Diamond marker pair',units:[2,0],price:5,stock:2},
   {id:'map-copy',name:'Map copy',units:[0,1],price:4,stock:2},
   {id:'map-pair',name:'Map pair',units:[0,2],price:7,stock:1}
  ]
 })
]);

export const gatheringCase=id=>gatheringCases.find(c=>c.id===id)||null;
