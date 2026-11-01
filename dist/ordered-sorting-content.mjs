// Original bounded first-match investigations. Each started case keeps its own source.
export const orderedTests=[
 {id:'size-small',label:'Small parcel',feature:'size',value:'small'},
 {id:'size-large',label:'Large parcel',feature:'size',value:'large'},
 {id:'stamp-star',label:'Star stamp',feature:'stamp',value:'star'},
 {id:'stamp-circle',label:'Circle stamp',feature:'stamp',value:'circle'},
 {id:'stamp-square',label:'Square stamp',feature:'stamp',value:'square'},
 {id:'wrap-blue',label:'Blue wrap',feature:'wrap',value:'blue'},
 {id:'wrap-yellow',label:'Yellow wrap',feature:'wrap',value:'yellow'}
];
const baskets=[{id:'cart',label:'Cart basket'},{id:'lantern',label:'Lantern basket'},{id:'leaf',label:'Leaf basket'}];
const parcels=[];
for(const size of ['small','large'])for(const wrap of ['blue','yellow'])for(const stamp of ['star','circle','square'])parcels.push({id:`${size}-${wrap}-${stamp}`,title:`${size==='small'?'Small':'Large'} ${wrap} parcel, ${stamp} stamp`,size,wrap,stamp});
const row=(test,basket,not=false)=>({test,not,basket});
const program=(first,second,otherwise)=>({first,second,otherwise});
const off=()=>row('off',null);
const card=id=>structuredClone(parcels.find(p=>p.id===id));
const blueExample={program:program(row('wrap-blue','lantern'),row('size-small','leaf'),'cart'),parcels:['small-blue-star','small-yellow-circle','large-yellow-square'].map(card),steps:[
 {parcelId:'small-blue-star',text:'Blue? Yes. Choose Lantern. The size test is not tested because the first rule matched.'},
 {parcelId:'small-yellow-circle',text:'Blue? No. Small? Yes. Choose Leaf.'},
 {parcelId:'large-yellow-square',text:'Blue? No. Small? No. Choose Otherwise: Cart.'}
]};
const generalLearn=[
 'Read the rules from top to bottom. Each test asks one Yes-or-No question about a parcel.',
 'Stop at the first Yes and use that row’s basket. The second test is not tested when the first test matches.',
 'If neither active test matches, use Otherwise. Exactly one basket is chosen.',
 'NOT reverses one test’s Yes-or-No answer. You can switch off the second test for a one-test rule.',
 'A prediction is just your guess about the machine. Compare the machine’s destination with Wren’s request after you send a parcel.'
];
const commonText={
 match:'This recorded route agrees with Wren’s request for this parcel.',
 mismatch:'These destinations differ. Revise the rule and try another parcel.',
 firstMatch:'The first rule matched. The second row was not tested.',
 overlap:'Both tests can catch this parcel. Which test comes first decides its route.',
 finite:'This rule fits every parcel card in this comparison. It tells us about these cards; try another request to explore a different rule.',
 equivalent:'Different programs can agree on every parcel card here.',
 notReply:'NOT reverses the answer to one test. It does not reverse the program or swap baskets.'
};
const skip='Skip for now. Your rule and parcel wait here; try another case or return later.';
export const orderedSources=[
 {
  version:1,id:'large-first',title:'Size first',request:'Large parcels go in Cart. Of the rest, star stamps go in Lantern. Everything else goes in Leaf.',baskets:structuredClone(baskets),parcels:structuredClone(parcels),
  requestProgram:program(row('size-large','cart'),row('stamp-star','lantern'),'leaf'),learn:[...generalLearn,'Wren gives large parcels first priority. “Of the rest” means parcels still waiting after that first rule.'],
  guided:['Guided first rule: choose Large parcel as the first test, with Cart basket.','Choose Star stamp as the second test, with Lantern basket. Choose Leaf basket for Otherwise.','Select a large star parcel. It has both clues. Read the first test: Yes means the second row is not tested.','Send the parcel, compare its destination with Wren’s request, then try swapping the two complete rules.'],
  hint:'Which feature does Wren give priority to before saying “of the rest”?',example:structuredClone(blueExample),start:'Start by putting large in the first row and compare its destination with the request.',skip,
  text:{...commonText,overlap:'This parcel passes both of your tests, so the first matching rule chooses its basket. Wren’s request gives size priority before checking stars.'}
 },
 {
  version:1,id:'star-first',title:'Stamp first',request:'Star stamps go in Lantern. Of the rest, large parcels go in Cart. Everything else goes in Leaf.',baskets:structuredClone(baskets),parcels:structuredClone(parcels),
  requestProgram:program(row('stamp-star','lantern'),row('size-large','cart'),'leaf'),learn:[...generalLearn,'This request gives star stamps first priority. The large-parcel rule only sees parcels that did not match the star rule.'],
  guided:['Try a large star: both clues fit, so the order matters.','Read the first matching rule before considering the next row.','A fitting small star alone does not test which rule has priority for a large star.'],
  hint:'Which parcels are already routed before Wren mentions size?',example:{program:program(row('size-small','leaf'),row('stamp-circle','cart'),'lantern'),parcels:['small-yellow-circle','large-blue-circle'].map(card),steps:[{parcelId:'small-yellow-circle',text:'Small? Yes. Choose Leaf. The circle test is not tested.'},{parcelId:'large-blue-circle',text:'Small? No. Circle? Yes. Choose Cart.'}]},start:'Start with the star rule before the size rule.',skip,
  text:{...commonText,overlap:'This parcel passes both of your tests, so priority chooses its basket. Wren’s request gives star stamps priority before checking size.'}
 },
 {
  version:1,id:'not-blue',title:'Turn one test around',request:'Anything that is not blue goes in Leaf. Blue parcels go in Lantern.',baskets:structuredClone(baskets),parcels:structuredClone(parcels),
  requestProgram:program(row('wrap-blue','leaf',true),off(),'lantern'),learn:[...generalLearn,'For NOT blue, a blue parcel answers No and a yellow parcel answers Yes in this two-wrap space.','Blue → Lantern; otherwise Leaf can give the same routes as NOT blue → Leaf; otherwise Lantern.'],
  guided:['Switch the second test to No second test.','Try one yellow parcel and one blue parcel before comparing all the source’s parcel kinds.','Changing NOT without changing the destinations can change the routes.'],
  hint:'Read NOT as reversing the answer to “is this blue?”',example:{program:program(row('size-small','cart',true),off(),'leaf'),parcels:['large-yellow-star','small-blue-square'].map(card),steps:[{parcelId:'large-yellow-star',text:'Small? No, so NOT small is Yes. Choose Cart. The second row is off.'},{parcelId:'small-blue-square',text:'Small? Yes, so NOT small is No. The second row is off. Choose Otherwise: Leaf.'}]},start:'Start by running one yellow and one blue parcel.',skip,
  text:{...commonText,notReply:'A yellow parcel passes NOT blue. Compare its basket with Wren’s request. Blue is No under NOT blue; yellow is Yes. Positive blue with the destinations swapped can agree on all this source’s parcel kinds.'}
 }
];
