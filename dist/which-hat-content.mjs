// Original project fiction/model, adapted from PR182's bounded262(a)/A1–A5.
export const hatSource={
 version:1,id:'six-party-hats',title:'Which Hat?',
 hats:[
  {id:'peg-1',label:'Peg 1',owner:'Dot',size:'small',age:'old',color:'blue',ribbon:'none'},
  {id:'peg-2',label:'Peg 2',owner:'The baker',size:'small',age:'new',color:'blue',ribbon:'gold'},
  {id:'peg-3',label:'Peg 3',owner:'Puff',size:'big',age:'old',color:'blue',ribbon:'gold'},
  {id:'peg-4',label:'Peg 4',owner:'Ember',size:'big',age:'new',color:'red',ribbon:'none'},
  {id:'peg-5',label:'Peg 5',owner:'The miller',size:'small',age:'old',color:'red',ribbon:'blue'},
  {id:'peg-6',label:'Peg 6',owner:'The orchard keeper',size:'big',age:'new',color:'blue',ribbon:'blue'}
 ],
 tiles:[
  {id:'lovely',text:'lovely',property:null,value:null,rank:0,after:false},
  {id:'small',text:'small',property:'size',value:'small',rank:1,after:false},
  {id:'big',text:'big',property:'size',value:'big',rank:1,after:false},
  {id:'old',text:'old',property:'age',value:'old',rank:2,after:false},
  {id:'new',text:'new',property:'age',value:'new',rank:2,after:false},
  {id:'blue',text:'blue',property:'color',value:'blue',rank:3,after:false},
  {id:'red',text:'red',property:'color',value:'red',rank:3,after:false},
  {id:'gold-ribbon',text:'with a gold ribbon',property:'ribbon',value:'gold',rank:4,after:true},
  {id:'blue-ribbon',text:'with a blue ribbon',property:'ribbon',value:'blue',rank:4,after:true}
 ],
 frame:{before:'the',noun:'hat'},
 copy:{
  welcome:'The storm is over, and neighbors have been gathering at the café. Dot brought six hats left at the café to the pegs beside the Post Office. Describe one so its owner can find it.',
  job:'An owner points to a peg. Choose words that fit that hat. Can your description pick it out from all six?',
  limit:'A made-up rack: size and age are supplied labels. Lovely is an opinion; in this model it rules no hat out. Pictures and printed clues tell the same story.',
  hint:'Start with a word that fits the requested hat. Look at the hats that still match. What detail would separate them?',
  example:'A different shelf has a small red cup and a big red cup. Red cup fits both. Small red cup fits one. Small blue cup fits neither.',
  guided:'For Dot on peg 1, try blue: four fit. Add small: two fit. Add old: only Dot’s fits. Adding gold ribbon would leave none.',
  usual:'This follows the usual order: opinion, size, age, color, then hat. A ribbon phrase follows the noun.',
  other:'Your words still describe the same hats. Most speakers put opinion, size, age, then color before hat. Try moving a word and listen to the difference.',
  goal:'One description, one requested hat. Dot can return it! Try another owner, or discover a shorter description.',
  scaffold:'The rack and live count are always available to help. These observations do not measure independent reading or writing.',
  results:{none:'No hats fit every word. That is a discovery: look for two clues that cannot both fit.',several:'Several hats fit. Which useful detail could help the reader choose?',target:'Only the requested hat fits. This description does its job.',other:'One hat fits, but it is a different peg. Compare it with the owner’s requested hat.'}
 },
 questions:[
  {id:'a1',context:'Dot’s hat is on peg 1. Use the rack and count the hats that fit each phrase.',prompt:'Which description fits only Dot’s hat?',key:'b',
   choices:[{id:'a',text:'the small blue hat',feedback:'Two hats are small and blue. One is new.'},{id:'b',text:'the small old blue hat',feedback:'Small, old and blue together fit only Dot’s hat.'},{id:'c',text:'the small old blue hat with a gold ribbon',feedback:'Dot’s hat has no ribbon. No hat fits all these words.'}],
   together:'1. Look at the six pegs. 2. Count the hats each description fits. 3. Pick the one that fits only Dot’s: blue fits four, small blue fits two, and small old blue fits one.',hint:'Count the hats each description fits.',example:'Small red cup fits just the small red cup on our example shelf.',explanation:'Useful details separate things that otherwise match.'},
  {id:'a2',context:'Ember’s hat is big, new and red. All three phrases can be understood.',prompt:'Which puts the describing words in the usual order?',key:'c',
   choices:[{id:'a',text:'a new big red hat',feedback:'Understandable. Most speakers put size before age.'},{id:'b',text:'a red big new hat',feedback:'Understandable. Color usually comes after size and age.'},{id:'c',text:'a big new red hat',feedback:'Big is size, new is age, red is color: the usual order.'}],
   hint:'Size, then age, then color.',example:'A small old green cup follows the usual order.',explanation:'The usual order is a habit, not a rule that makes every other order meaningless.'},
  {id:'a3',context:'the big old blue hat with a gold ribbon',prompt:'Which word is the head noun of this whole phrase?',key:'c',
   choices:[{id:'a',text:'ribbon',feedback:'The ribbon tells us which hat. The whole phrase is about a hat.'},{id:'b',text:'blue',feedback:'Blue is an adjective. It tells about the hat.'},{id:'c',text:'hat',feedback:'Hat is the head noun. All the other details help describe the hat.'}],
   hint:'What thing is the whole phrase about?',example:'In the little cup with a red handle, cup is the head noun.',explanation:'A phrase inside the description can have its own noun: ribbon. The whole phrase still names a hat.'},
  {id:'a4',context:'the party hat',prompt:'What job does party do in this phrase?',key:'a',
   choices:[{id:'a',text:'It tells what kind of hat',feedback:'Yes. Party is a noun describing another noun: hat.'},{id:'b',text:'It is the head noun',feedback:'The phrase is about a hat. Party tells what kind.'},{id:'c',text:'It tells how something happened',feedback:'Nothing happens in this phrase. Party tells what kind of hat.'}],
   hint:'Is the whole phrase about a party, or a hat?',example:'In stone bridge, stone tells what kind of bridge.',explanation:'A noun can describe another noun. The head here is hat.'},
  {id:'a5',context:'Put my with the describing words small and old.',prompt:'Which is the usual order?',key:'c',
   choices:[{id:'a',text:'small my old hat',feedback:'My is a determiner. It goes before the describing words.'},{id:'b',text:'small old my hat',feedback:'My goes before small and old.'},{id:'c',text:'my small old hat',feedback:'My is a determiner before the adjectives small and old.'}],
   hint:'Words like the, my and Dot’s go at the front.',example:'My little green cup begins with my.',explanation:'A determiner comes before the words describing the noun.'}
 ]
};
