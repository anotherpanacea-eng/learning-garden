// Original finite first pack. Existing Sorting Desk saves keep their own v1 source.
export const doubleSource={
 version:1,id:'willow-double-stamps',
 request:'Pip asks: Put a parcel in the Lantern basket if it has a star stamp or blue wrap, including when it has both. Put a parcel with neither clue in the Leaf basket.',
 clues:[
  {id:'stamp-star',feature:'stamp',value:'star',label:'a star stamp',question:'Star stamp?'},
  {id:'wrap-blue',feature:'wrap',value:'blue',label:'a blue wrap',question:'Blue wrap?'}
 ],
 baskets:[{id:'lantern',label:'Lantern basket'},{id:'leaf',label:'Leaf basket'}],
 parcels:[
  {id:'star-blue',title:'Blue parcel, star stamp',stamp:'star',wrap:'blue'},
  {id:'star-yellow',title:'Yellow parcel, star stamp',stamp:'star',wrap:'yellow'},
  {id:'circle-blue',title:'Blue parcel, circle stamp',stamp:'circle',wrap:'blue'},
  {id:'circle-yellow',title:'Yellow parcel, circle stamp',stamp:'circle',wrap:'yellow'}
 ],
 requestRule:{connector:'one-or-both',then:'lantern',else:'leaf'},
 text:{
  intro:'Pip has four made-up parcels. This desk reads two clues on each. Choose a connector, then watch your rule choose one basket.',
  predictionPrompt:'Before stepping, which basket do you think your rule will choose?',
  help:'Both needs two Yes answers. At least one needs one or two Yes answers, including two. Read both clues before choosing one branch.',
  requestMatch:'Your rule and Pip’s request chose the same basket for this parcel.',
  requestMismatch:'Your rule and Pip’s request chose different baskets for this parcel. You can change the connector and try again.',
  oneClueInvite:'This parcel has exactly one of the two clues. Try the other connector with this same parcel.',
  bothClueInvite:'This parcel has both clues. Either connector sends it to Lantern. Try a parcel with only one clue.',
  neitherClueInvite:'This parcel has neither clue. Either connector takes Otherwise. Try a parcel with only one clue.',
  talk:'Which one-clue parcel changes baskets when you switch connectors? What stays the same?'
 }
};
