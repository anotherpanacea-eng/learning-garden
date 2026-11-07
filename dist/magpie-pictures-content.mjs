// Original, finite scenes and picture descriptions for the make-believe party.
export const magpieCopy = {
 entryTitle: "The magpie's pictures",
 entryIntro: "Visit a make-believe party. What pictures do the guests' sayings make?",
 intro: 'A make-believe party. These pictures are imagined, not things that happened.',
 learnIntro: 'Look at words, pictures and the words around a saying.',
 sortIntro: 'Compare three sayings used literally with their party uses. Keep your own idea, then open another reading if you wish.',
 uncertainty: 'Not sure yet. We can look together.',
 lifetime: 'Your pictures and trays stay while you visit Riddles. Leaving the room or opening the explorer chooser clears them. Your riddle cards and notes are not changed.'
};

export const magpieScenes = [
 {title:'Supper',context:'Pip has carried chairs all afternoon. Supper smells good, and Pip is waiting eagerly for a bowl of soup.',quote:'Pip: “I could eat a horse.”',choices:[
  {text:'I am very hungry.',image:'hungry'},
  {text:'I could eat a whole horse.',image:'horse-plate'},
  {text:'I want to ride a horse.',image:'horse-ride'}
 ],bird:'horse-plate',meaning:'Pip means Pip is very hungry, using an exaggerated saying.',clue:'Pip has worked all afternoon and is waiting for supper.',referenceImage:'hungry'},
 {title:'New guests',context:'The new guests sit quietly. Dot smiles and asks everyone about favorite games.',quote:'Dot: “Let\'s break the ice.”',choices:[
  {text:'Leave before the party starts.',image:'leaving'},
  {text:'Start a friendly conversation.',image:'greeting'},
  {text:'Break a real piece of ice.',image:'ice-bowl'}
 ],bird:'ice-bowl',meaning:'Dot means helping the guests begin talking comfortably.',clue:'The guests are quiet, and Dot asks a friendly question.',referenceImage:'greeting'},
 {title:'Welcome speech',context:'Ember is about to give a first welcome speech. Ember worries about forgetting the words and holds the speech card tightly.',quote:'Ember: “I\'ve got butterflies in my stomach.”',choices:[
  {text:'Butterflies inside my body.',image:'butterfly-outline'},
  {text:'Hoping to see butterflies.',image:'butterfly-garden'},
  {text:'Nervous before my speech.',image:'nervous-speech'}
 ],bird:'butterfly-outline',meaning:'Ember means feeling nervous about the speech.',clue:'Ember is worried about forgetting the words.',referenceImage:'nervous-speech'},
 {title:'Surprise news',context:'The welcome song was meant to be a surprise for Ember. Pip told Ember about it before the party began. Bramble points at the song banner.',quote:'Bramble: “Pip let the cat out of the bag.”',choices:[
  {text:'Pip let a real cat out.',image:'cat-bag'},
  {text:'Pip told the surprise early.',image:'song-news'},
  {text:'Pip mended a torn paper bag.',image:'mend-bag'}
 ],bird:'cat-bag',meaning:'Bramble means Pip revealed the surprise.',clue:'Pip told Ember about the song before it was time.',referenceImage:'song-news'},
 {title:'Easy riddle',context:'Dot reads a riddle once and answers right away. No one is serving dessert right now.',quote:'Dot: “That riddle was a piece of cake.”',choices:[
  {text:'That riddle felt easy.',image:'easy-riddle'},
  {text:'That riddle needs icing.',image:'icing-card'},
  {text:'That riddle was dessert.',image:'riddle-cake'}
 ],bird:'riddle-cake',meaning:'Dot means the riddle felt easy.',clue:'Dot answered the riddle right away.',referenceImage:'easy-riddle'},
 {title:'Outside the window',context:'Rain hits the café window loudly. Big puddles cover the path. The guests stay indoors and look out at the rain.',quote:'The miller: “It\'s raining cats and dogs.”',choices:[
  {text:'Only a little rain is falling.',image:'light-rain'},
  {text:'Cats and dogs come down from clouds.',image:'rain-animals'},
  {text:'Rain is falling very heavily.',image:'heavy-rain'}
 ],bird:'rain-animals',meaning:'The miller means the rain is very heavy.',clue:'The scene already tells us about loud rain and big puddles.',referenceImage:'heavy-rain'}
];

export const magpieLessons = [
 {title:'Words and feelings.',text:'Read or hear these make-believe scenes together. Hungry can mean wanting food. Here, nervous means worried about the coming speech. Which words tell you how Pip or Ember feels? You can ask what a new word means.',images:['hungry','nervous-speech']},
 {title:'A saying can make a picture.',text:'Words used literally mean just what they name. Words used figuratively mean something more than, or different from, that exact picture. Some English sayings are idioms: a whole phrase has a learned meaning. Compare Dot\'s easy riddle with the magpie\'s picture of a riddle on cake.',images:['easy-riddle','riddle-cake']},
 {title:'Context matters.',text:'A real slice of cake can be dessert. ‘A piece of cake’ can also describe an easy task. Ice in a bowl can really be broken. When Dot greets the quiet guests, ‘break the ice’ means starting a conversation. Don\'t only ask, ‘Could this really happen?’ Read the words around it. If you do not know a saying, ask or look it up with a person.',images:['ice-bowl','greeting']},
 {title:'Compare without erasing your idea.',text:'Keep your idea beside another reading. Try three sayings used literally beside their party uses. Literal and figurative describe how words are used, not whether someone is honest or a story is true. Another language or community may use different sayings. You can talk about other imagined meanings too.',images:['cat-bag','song-news']}
];

export const magpieSortCards = [
 {id:'cake-food',context:'A real cake is on the café table. Dot points at one slice:',quote:'“Please pass a piece of cake.”',reference:'literal',reason:'Dot asks for a real slice of food.',image:'cake-slice'},
 {id:'cake-task',context:'Dot read a riddle once and answered right away:',quote:'“That riddle was a piece of cake.”',reference:'figurative',reason:'The phrase describes an easy task here, not dessert.',image:'easy-riddle'},
 {id:'cat-news',context:'Pip announced the surprise song to Ember before the party began. Bramble had meant the news to wait:',quote:'“Pip let the cat out of the bag.”',reference:'figurative',reason:'Pip revealed the surprise.',image:'song-news'},
 {id:'cat-animal',context:'The miller\'s cat is curled in an open paper bag. Dot holds the bag wide:',quote:'“Let the cat out of the bag.”',reference:'literal',reason:'A real cat is leaving a real open bag.',image:'cat-bag'},
 {id:'ice-object',context:'A big lump of ice sits in a lemonade bowl. Dot asks Pip to crack it with a wooden spoon:',quote:'“Break the ice.”',reference:'literal',reason:'Dot means a real piece of ice.',image:'ice-bowl'},
 {id:'ice-talk',context:'New guests sit quietly. Dot smiles and asks everyone about favorite games:',quote:'“Let\'s break the ice.”',reference:'figurative',reason:'Dot means starting conversation.',image:'greeting'}
];

export const magpieArtDescriptions = {
 hungry:'Pip waits beside an empty plate, soup and a bun.',
 'horse-plate':'An imagined smiling horse stands safely on an oversized plate.',
 'horse-ride':'Pip stands beside a wooden hobby horse.',
 'ice-bowl':'A wooden spoon cracks a real piece of ice in a lemonade bowl.',
 greeting:'Dot waves to two quiet guests at the party table.',
 leaving:'Dot takes a coat toward the café doorway.',
 'butterfly-outline':'Imagined butterflies sit inside a paper drawing of a dragon.',
 'butterfly-garden':'Ember watches butterflies above flowers.',
 'nervous-speech':'Ember holds a speech card tightly beside a waiting podium.',
 'cat-bag':'A cat steps freely out of an open paper bag.',
 'song-news':'Pip shows Ember a musical banner before the surprise song.',
 'mend-bag':'Pip patches an empty torn paper bag.',
 'easy-riddle':'Dot smiles calmly beside a riddle card.',
 'riddle-cake':'An imagined riddle card rests on a slice of cake.',
 'icing-card':'The magpie draws an icing swirl on a paper card.',
 'light-rain':'A few imagined raindrops fall outside a window.',
 'rain-animals':'Imagined cats and dogs drift safely down under tiny umbrellas.',
 'heavy-rain':'Heavy rain and big puddles are outside; the guests are dry indoors.',
 'cake-slice':'A real slice of cake rests on a café plate.'
};
