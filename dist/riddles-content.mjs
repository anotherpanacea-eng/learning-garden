// Original riddle cards. Each card has one fitting choice and two choices that are
// wrong for a reason the riddle's own clues show. Picks are play, not assessment.
// band is an authoring label for the challenge-bands proposal, never shown as a level.
const card=(id,band,strand,prompt,answer,choices,clue,why,place)=>({id,band,strand,prompt,answer,choices:choices.map(([code,text,nudge])=>({code,text,nudge})),clue,why,place});
export const riddleSizes=[
 {id:'any',label:'Any riddle'},
 {id:'sprout',label:'Short riddles'},
 {id:'seedling',label:'Riddles with more clues'},
 {id:'sapling',label:'Wordplay riddles'}
];
export const riddlePlaces={
 science:{href:'#science',label:'Visit the Water Lab'},
 living:{href:'#living',label:'Visit the Living Garden'},
 numbers:{href:'#numbers',label:'Visit the Number Garden'},
 path:{href:'#numbers/path',label:'Walk the path to Willow Bridge'},
 words:{href:'#words',label:'Visit Word Garden'},
 orchard:{href:'#orchard',label:'Visit the orchard maps'},
 cafe:{href:'#cafe',label:'Visit the Café'},
 fractions:{href:'#cafe/fractions',label:'Walk the Fraction Trail'},
 post:{href:'#post',label:'Visit the Post Office'},
 french:{href:'#french',label:'Visit Paris in French'}
};
export const riddles=[
 card('rain','sprout','science','I fall from the clouds. I fill the puddles. Plants drink me up. What am I?','rain',[
  ['rain','Rain',null],
  ['sand','Sand','Sand can fill a bucket, but it does not fall from the clouds.'],
  ['leaf','A leaf','Leaves fall from trees, not clouds. Plants do not drink them either.']
 ],'Look up on a grey day. Splash!','Rain is water falling from clouds. It soaks into the soil, and roots drink it up.','science'),
 card('four','sprout','math','I am one more than three. I am how many legs a cat stands on. What number am I?','four',[
  ['three','3','Three is where we started. Count on one more.'],
  ['four','4',null],
  ['five','5','Five is two more than three. Count on just one.']
 ],'Start at three and count one more.','Counting on one from three lands on four. A cat stands on four legs.','path'),
 card('cat','sprout','reading','I rhyme with hat. I say meow. What am I?','cat',[
  ['dog','A dog','A dog says woof. Does dog rhyme with hat?'],
  ['bat','A bat','Bat rhymes with hat! But a bat does not say meow.'],
  ['cat','A cat',null]
 ],'Say hat slowly. Now change the first sound.','Cat and hat end with the same sound, at. Words that end with the same sound rhyme.','words'),
 card('caterpillar','sprout','science','I munch on leaves. Then I wrap up and rest. I wake up with wings. What am I?','caterpillar',[
  ['grasshopper','A grasshopper','A grasshopper munches leaves and grows wings, but it never wraps up to rest.'],
  ['caterpillar','A caterpillar',null],
  ['bird','A bird','A bird has wings, but it hatches from an egg. It never wraps up to rest.']
 ],'Think of a butterfly when it was very small.','A caterpillar makes a chrysalis. Inside, it changes into a butterfly. That change is part of its life cycle.','living'),
 card('triangle','sprout','math','I have three sides and three corners. What shape am I?','triangle',[
  ['triangle','A triangle',null],
  ['square','A square','A square has four sides. Count the sides in the riddle.'],
  ['circle','A circle','A circle has no corners at all.']
 ],'Tri means three, like a tricycle with three wheels.','A triangle has three straight sides that meet at three corners.','numbers'),
 card('map','sprout','world','Streets and rivers are drawn on me, but I fold into your pocket. What am I?','map',[
  ['book','A book','A book folds shut, but it holds stories, not streets.'],
  ['kite','A kite','A kite flies above the streets. Nobody draws them on it.'],
  ['map','A map',null]
 ],'Travelers use me to find their way.','A map is a flat picture of a place, as if you saw it from above.','orchard'),
 card('ice','seedling','science','I am water, but you can hold me in your hand. Leave me in the sun and I turn back into a puddle. What am I?','ice',[
  ['cloud','A cloud','A cloud is made of water too, but you cannot hold it in your hand.'],
  ['ice','Ice',null],
  ['stone','A stone','A stone stays a stone in the sun. It does not melt into a puddle.']
 ],'Think of the cold box in the kitchen.','Ice is frozen water. When it warms up, it melts back into liquid water.','science'),
 card('clock','seedling','math','I have a face and two hands, but I cannot smile or clap. The café looks at me to know when the bread is ready. What am I?','clock',[
  ['mirror','A mirror','A mirror shows a face, but it has no hands.'],
  ['glove','A glove','A glove fits a hand, but it has no face.'],
  ['clock','A clock',null]
 ],'Tick, tock.','A clock’s hands point to numbers on its face. The short hand shows the hour.','cafe'),
 card('half','seedling','math','Cut a pie into two equal parts. Each part has my name. What am I?','half',[
  ['half','A half',null],
  ['third','A third','A third is one of three equal parts. This pie has two.'],
  ['whole','A whole','The whole is the full pie before you cut it.']
 ],'Two equal parts. What do we call each one?','Two equal parts are called halves. Two halves fit back together into one whole.','fractions'),
 card('sea','seedling','reading','I sound just like see, but I am full of water and waves. Which word am I?','sea',[
  ['see','see','See sounds right, but see is what your eyes do.'],
  ['she','she','She starts with a different sound, sh.'],
  ['sea','sea',null]
 ],'Boats sail on me.','Sea and see sound the same, but they are spelled differently and mean different things. Words like that are called homophones.','words'),
 card('compass','seedling','world','I have a needle, but I never sew. I always know which way is north. What am I?','compass',[
  ['sewing','A sewing kit','The needles in a sewing kit are made for sewing. This needle never sews.'],
  ['compass','A compass',null],
  ['clock','A clock','A clock’s hands point to the time, not to north.']
 ],'Explorers carry me on a map hunt.','A compass needle is a tiny magnet. It swings to point north, so travelers can find their way.','orchard'),
 card('bonjour','seedling','french','People in Paris say me when they meet you. I mean hello, or good day. Which word am I?','bonjour',[
  ['merci','merci','Merci is how you say thank you.'],
  ['aurevoir','au revoir','Au revoir is for leaving. It means goodbye.'],
  ['bonjour','bonjour',null]
 ],'I start with bon, which means good.','Bonjour joins bon, good, and jour, day. You can say it when you meet someone.','french'),
 card('footprints','sapling','science','The farther you walk on the muddy path, the more of me you leave behind you. What am I?','footprints',[
  ['puddles','Puddles','You might splash through puddles, but walking does not make them.'],
  ['footprints','Footprints',null],
  ['pebbles','Pebbles','The pebbles were already on the path. You do not leave them behind.']
 ],'Look behind you after a walk in the mud.','Each step presses a print into the soft mud. More steps leave more footprints.','living'),
 card('six','sapling','math','I am an even number. I am more than 5 and less than 8. What number am I?','six',[
  ['seven','7','Seven fits between 5 and 8, but seven is odd.'],
  ['four','4','Four is even, but it is less than 5.'],
  ['six','6',null]
 ],'Try each number between 5 and 8. Which one splits into two equal groups?','Six is between five and eight. Six splits into two equal groups of three, so it is even.','numbers'),
 card('envelope','sapling','reading','I start with E and end with E, and I carry one letter. The Post Office takes me far away. What am I?','envelope',[
  ['envelope','An envelope',null],
  ['eagle','An eagle','Eagle starts and ends with E too, but nobody posts an eagle.'],
  ['engine','An engine','Engine starts and ends with E too, but an engine does not carry a letter.']
 ],'Think about two meanings of the word letter.','The joke is in the word letter. It can mean one letter of the alphabet, or a note you send. An envelope holds a letter you post.','post'),
 card('shadow','sapling','science','I follow you on sunny days, but I disappear when clouds cover the sun. I grow long in the evening. What am I?','shadow',[
  ['echo','Your echo','An echo follows your voice, and the sun does not change it.'],
  ['scarf','Your scarf','A scarf stays with you on cloudy days too.'],
  ['shadow','Your shadow',null]
 ],'I am dark, and I am the same shape as you.','Your body blocks the sunlight and makes a shadow. When the sun is low in the evening, shadows stretch long.','science'),
 card('river','sapling','world','I have a mouth, but I never eat. I have a bed, but I never sleep. I run all the way to the sea. What am I?','river',[
  ['river','A river',null],
  ['road','A road','A road can run far, but it has no bed of water.'],
  ['cave','A cave','A cave has a mouth, but it does not run to the sea.']
 ],'I am full of water, and fish live in me.','People borrow body words for rivers. A river’s mouth is where it meets the sea, and its bed is the ground under the water.','science'),
 card('chat','sapling','french','In French, chat is not talking. A chat says meow. What is a chat?','cat',[
  ['dog','A dog','A dog in French is un chien.'],
  ['cat','A cat',null],
  ['parrot','A parrot','A parrot can talk, but it does not say meow.']
 ],'Listen to the riddle again. What says meow?','Chat is the French word for cat. It looks like an English word, but it means something different.','french')
];
export const ownRiddle='Make up your own riddle. Pick something in the garden. Give one clue about how it looks and one about what it does. Then ask: what am I?';
