// Original, finite first pack. Saved desks use their own copied source.
export const sortingSource={
 version:1,id:'willow-stamps',
 request:'Pip asks: Put parcels with a star stamp in the Lantern basket. Put every other stamp in the Leaf basket. Look at the stamp, not the wrapping color.',
 baskets:[{id:'lantern',label:'Lantern basket'},{id:'leaf',label:'Leaf basket'}],
 parcels:[
  {id:'star-blue',title:'Blue parcel, star stamp',stamp:'star',wrap:'blue'},
  {id:'circle-yellow',title:'Yellow parcel, circle stamp',stamp:'circle',wrap:'yellow'},
  {id:'star-yellow',title:'Yellow parcel, star stamp',stamp:'star',wrap:'yellow'},
  {id:'circle-blue',title:'Blue parcel, circle stamp',stamp:'circle',wrap:'blue'}
 ],
 requestRule:{condition:'stamp-star',then:'lantern',else:'leaf'},
 text:{
  intro:'Pip has four made-up parcels. Build a rule, predict one basket, then watch the machine follow your rule. A machine follows the rule you set, even if Pip wanted something else.',
  help:'A condition asks one yes-or-no question about this parcel. If it is true, the machine takes Then. If it is false, it takes Otherwise. Only one basket is used for a parcel. You can change your rule and try again.',
  predictionPrompt:'Before stepping, where do you think your rule will send this parcel?',
  otherBranch:'The other branch does not run for this parcel.',
  fit:'This rule serves this parcel\'s request.',
  mismatch:'These baskets differ. You can change the rule and test again.',
  counterexample:'Two parcels can fit a rule by coincidence. Try a parcel with the other color and the same stamp.'
 }
};
