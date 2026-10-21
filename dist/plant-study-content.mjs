// Original illustrative pack. These numbers are invented, not measured cress results.
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const PLANT_DAYS=freeze([0,2,4,6]);
export const PLANT_CONDITIONS=freeze([{id:'light',label:'Adequate light'},{id:'dim',label:'Too little light'}]);
export const PLANT_SPECIMENS=freeze(['A','B']);
export const PLANT_MODEL=freeze({
 id:'illustrative-cress-light-v1',label:'Invented seedling comparison',
 notice:'These pictures and numbers were invented for comparing. They are not measured cress results or a growth forecast.',
 controls:'Already-emerged cress seedlings: same variety, starting stage, containers, growing medium, elapsed time, air and suitable temperature. Both groups have suitable moisture; this does not mean identical watering volumes.',
 sources:[
  {title:'RHS: How plants sense and respond to the environment',url:'https://www.rhs.org.uk/advice/understanding-plants/how-plants-sense-the-environment'},
  {title:'RHS: How plants use light to grow',url:'https://www.rhs.org.uk/advice/understanding-plants/how-plants-use-light-to-grow'},
  {title:'University of Minnesota Extension: Starting seeds indoors',url:'https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/starting-seeds-indoors'},
  {title:'ESA: AstroFarmer teacher guide',url:'https://climatedetectives.esa.int/wp-content/uploads/2023/09/PR42_AstroFarmer-1.pdf'}
 ]
});
const lengths={0:{light:[20,19],dim:[20,19]},2:{light:[25,24],dim:[34,32]},4:{light:[31,29],dim:[49,46]},6:{light:[38,36],dim:[65,61]}};
// Spread is the illustrated width across the two leaves, not leaf area.
const leaves={0:{light:[12,11],dim:[12,11]},2:{light:[16,15],dim:[12,11]},4:{light:[21,20],dim:[13,12]},6:{light:[27,25],dim:[14,13]}};
const widths={0:{light:[1.2,1.1],dim:[1.2,1.1]},2:{light:[1.5,1.4],dim:[1.1,1]},4:{light:[1.9,1.8],dim:[1,.9]},6:{light:[2.4,2.2],dim:[.9,.8]}};
const observations=[];
for(const day of PLANT_DAYS)for(const condition of PLANT_CONDITIONS)for(const [i,specimen] of PLANT_SPECIMENS.entries()){
 const stemMm=lengths[day][condition.id][i],leafSpreadMm=leaves[day][condition.id][i],stemWidthMm=widths[day][condition.id][i];
 const leafColour=day===0||condition.id==='light'?'green':'paler green';
 const stemForm=day===0?'matching starting stem':condition.id==='light'?'more compact, broader stem':'longer, thinner stem';
 observations.push({id:`day-${day}-${condition.id}-${specimen}`,day,condition:condition.id,conditionLabel:condition.label,specimen,stemMm,leafSpreadMm,leafColour,stemWidthMm,stemForm,
  description:`Stem ${stemMm} mm from soil surface; ${leafColour} leaves spread ${leafSpreadMm} mm across; stem width ${stemWidthMm} mm; ${stemForm}.`,
  modelId:PLANT_MODEL.id,notice:PLANT_MODEL.notice,sources:PLANT_MODEL.sources});
}
export const PLANT_OBSERVATIONS=freeze(observations);
export function plantObservation(day,condition,specimen){return PLANT_OBSERVATIONS.find(o=>o.day===day&&o.condition===condition&&o.specimen===specimen)??null;}
export function plantObservationById(id){return PLANT_OBSERVATIONS.find(o=>o.id===id)??null;}
export function plantQuestions(day){
 if(!PLANT_DAYS.includes(day))return [];
 const light=plantObservation(day,'light','A'),dim=plantObservation(day,'dim','A');
 return [{id:`observation-${day}`,day,prompt:`Model day ${day}: which sentence reports something directly shown in this invented picture?`,
  choices:[{id:'visible',label:`The too-little-light specimen A has a ${dim.stemMm} mm stem.`},{id:'cause',label:'Too little light caused these seedlings to stretch.'},{id:'future',label:'Every seedling in dim light will grow this way.'}],answer:'visible',
  feedback:{visible:`The labelled picture shows ${dim.stemMm} mm. That is an observation of our invented model, not a measurement of a real plant.`,cause:day===0?'That offers an explanation, and on day 0 the two groups still match: nothing has stretched yet. A cause is not something directly visible in one picture.':'That offers an explanation. The model illustrates a source-informed pattern, but a cause is not something directly visible in one picture.',future:'That predicts beyond the picture. Other plants and conditions can differ; these invented examples cannot tell us what every plant will do.'}},
 {id:`length-${day}`,day,prompt:day===0?'Model day 0: can the starting pictures show how the groups changed later?':`Model day ${day}: does the longer stem alone show which seedling is doing better?`,
  choices:day===0?[{id:'later',label:'No. We need later observations to compare change.'},{id:'taller',label:'Yes. A longer starting stem tells the whole story.'},{id:'dim',label:'Yes. The dim group has already stretched more.'}]:[{id:'features',label:'No. Compare the leaves and stem form too.'},{id:'taller',label:'Yes. The longest stem must be the best.'},{id:'always',label:'Yes. All plants need the brightest possible light.'}],answer:day===0?'later':'features',
  feedback:day===0?{later:'Both groups start with matching A and B pictures: A is 20 mm and B is 19 mm. A later day can show change in this model.',taller:'A starts at 20 mm and B at 19 mm in both conditions. Those starting lengths do not show later change or overall plant condition.',dim:'The starting groups match. No dim-versus-light difference is shown yet.'}:{features:`In this model, dim A is ${dim.stemMm} mm and adequate-light A is ${light.stemMm} mm. The dim example is longer but has paler, smaller-spread leaves and a thinner stem. Length alone does not tell the whole story.`,taller:'The dim examples stretch more while their leaves stay smaller-spread and become paler. A longer stem alone is not a health score.',always:'Light needs differ between species and situations. This comparison is about inadequate versus adequate light for these illustrative seedlings, not “more is always better.”'}}];
}
export const waterComparisonQuestion=freeze({id:'water',day:null,prompt:'A proposed water test: which comparison could help us investigate water amounts? We have no water-result data.',
 choices:[{id:'controlled',label:'Keep light and other relevant conditions alike; compare two measured water amounts.'},{id:'confounded',label:'Change the light and the water amount at the same time.'}],answer:'controlled',
 feedback:{controlled:'This supplied plan changes water amount while keeping other relevant conditions alike. It could help investigate water. Choosing a plan is different from conducting the test; no water results are supplied.',confounded:'Changing light and water together makes a result hard to explain: either change could matter. Try a plan that changes water amount while keeping light and other relevant conditions alike.'}});
export function plantQuestionById(id){return id==='water'?waterComparisonQuestion:PLANT_DAYS.flatMap(plantQuestions).find(q=>q.id===id)??null;}
