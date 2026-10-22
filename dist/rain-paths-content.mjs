// Original arbitrary token apparatus. Sources inform its limits, not its capacities.
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const RAIN_PAGES=freeze(['predict','rain','compare','plan']);
export const RAIN_ROUTES=freeze(['straight','holding12']);
export const RAIN_SUPPORT=freeze(['help','example','audio','together']);
export const RAIN_MODEL=freeze({
 id:'closed-tray-rain-paths-v1',capacity:12,batchSize:4,
 label:'Invented tabletop rain trays',
 notice:'These are arbitrary model-water tokens in an invented closed machine, not measured rain or a flood forecast.',
 limitation:'Our pretend rain trays hold water in spaces. Real ground has more paths, and water can keep moving.',
 controls:'Each machine has 12 numbered storage slots in 3 rows of 4, the same entrance geometry, outlet and collector. Each receives the stated new rain separately. Only the named factor changes.',
 details:[
  'One token is the same arbitrary amount of model water. It is not a molecule, a raindrop, a millimeter, a liter or a unit of time. Four-token batches are not rainfall speed.',
  'We chose these capacities and routes. An open entrance fills available slots before surface water moves to the outlet. A sealed lid admits none. Real runoff can begin before storage fills.',
  'Already-stored tokens stay in place in this closed toy. In real ground, water can mix, move onward and drain; wet ground can transmit water. This model leaves out deep drainage, evaporation, plants and changing rain speed.',
  'Different starting water can be a limited analogy for earlier wetness in the same material. Very dry ground does not always absorb readily: texture, compaction and water-repellent dry surfaces can change what happens.',
  'The planning board tries a copy of a completed result. Its holding cup has no leak or outlet during this demonstration. Holding some model tokens cannot tell us that a real path is safe or prevent real flooding.'
 ],
 sources:[
  {title:'USGS: Infiltration and the Water Cycle',url:'https://www.usgs.gov/water-science-school/science/infiltration-and-water-cycle'},
  {title:'USGS: Surface Runoff and the Water Cycle',url:'https://www.usgs.gov/water-science-school/science/surface-runoff-and-water-cycle'},
  {title:'EPA CADDIS: Urbanization—Stormwater Runoff',url:'https://www.epa.gov/caddis/urbanization-stormwater-runoff'},
  {title:'EPA: Infiltration Models',url:'https://www.epa.gov/water-research/infiltration-models'},
  {title:'USGS Unsaturated Zone Flow Project: drought',url:'https://wwwrcamnl.wr.usgs.gov/uzf/investigations/drought.html'},
  {title:'EPA: Streams in the City (design reference)',url:'https://www.epa.gov/sites/default/files/2015-10/documents/streams_city_activity.pdf'}
 ]
});
const tray=(id,cover,priorStored)=>({id,cover,priorStored,label:`${id}: ${cover==='open'?'Open entrance':'Sealed lid'}, ${priorStored} already stored`});
export const RAIN_CASES=freeze([12,24].map(n=>({id:`cover-${n}`,label:`Cover · ${n} new tokens per tray`,factor:'cover',newRainTotal:n,trays:[tray('A','open',0),tray('B','sealed',0)],modelId:RAIN_MODEL.id})).concat([12,24].map(n=>({id:`space-${n}`,label:`Starting storage · ${n} new tokens per tray`,factor:'priorStored',newRainTotal:n,trays:[tray('A','open',0),tray('B','open',8)],modelId:RAIN_MODEL.id}))));
export const RAIN_COLUMNS=freeze([{id:'cover',label:'Entrance / lid'},{id:'priorStored',label:'Already stored before this rain'},{id:'newRainTotal',label:'New rain input'},{id:'storedNew',label:'Newly stored'},{id:'runoffNew',label:'New runoff'}]);
export function rainCaseById(id){return RAIN_CASES.find(c=>c.id===id)??null;}
export function rainQuestions(id){
 const c=rainCaseById(id);if(!c)return [];
 return [
  {id:'factor',prompt:'What is different about Tray A and Tray B?',choices:[{id:'cover',label:'Open entrance or sealed lid'},{id:'priorStored',label:'Starting stored water'},{id:'rain',label:'New rain amount'},{id:'rain-and-cover',label:'Rain and cover together'},{id:'unsure',label:'Not sure'}],answer:c.factor,feedback:'Both trays get the same new rain and have the same outlet. If the rain and the cover both changed, either change could matter, so we could not tell which one did it.'},
  {id:'runoff',prompt:'Which tray sent more of this new rain to the outlet?',choices:[{id:'A',label:'Tray A'},{id:'B',label:'Tray B'},{id:'same',label:'The same amount'},{id:'unsure',label:'Not sure'}],answer:'B',feedback:'Look at the New runoff column for each tray.'},
  {id:'columns',prompt:'Which two columns show where this new rain went?',choices:RAIN_COLUMNS,answer:['storedNew','runoffNew'],feedback:'All the new rain ended up newly stored or as new runoff. Already stored water was there before this rain started.'},
  {id:'difference',prompt:'How many more tokens ran off Tray B? (You can skip this.)',choices:[],answer:c.factor==='cover'?12:8,feedback:'Take the smaller New runoff number away from the bigger one.'}
 ];
}
