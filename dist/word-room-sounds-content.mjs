// Original spec342 adult-led material. No phonics playback or oral assessment.
const alphabet = ['a','b','c','f','h','i','m','n','o','p','s','t'];
const adultRole='adult-supplied';
const word = (label, meaning, art, guidance) => ({label,letters:[...label],meaning,alt:meaning,art,guidance});
const words = {
  mat:word('mat','A small woven mat for the theater floor.','mat','Say mat naturally, then model its three sounds.'),
  sat:word('sat','Before, the puppet stands. After, it sits on a low stool.','sat','Say sat naturally. Explain that it tells about an earlier action.'),
  cat:word('cat','A cat waits near the theater’s prop box.','cat','Say cat naturally. The c represents the sound at the start of cat here, not in every c-word.'),
  tin:word('tin','A small metal container for the theater props.','tin','Say tin naturally, then model its three sounds.'),
  pin:word('pin','A badge pin for a costume, not a handling task.','pin','Say pin naturally, then model its three sounds.'),
  cot:word('cot','A little folding bed made from cloth on a frame, ready for a puppet.','cot342','Say cot, meaning the small folding bed. Use the short vowel in hop in the selected reference. Do not contrast cot with caught or judge another accent.'),
  cap:word('cap','A soft costume cap with a short visor, resting on a peg.','cap342','Say cap, meaning a hat. Compare the end of cat and cap after the child’s attempt if they want help.'),
  map:word('map','A made-up paper map for the show, with a path, a tree and the theater. It has no Keeper’s writing.','map342','Say map, meaning a picture showing where places are. Compare the end of mat and map when help is wanted.'),
};
const teaching = [
  'Say tin together. Point to its three letters as your partner models the sounds.',
  'Now say pin. Listen to the start.',
  'The first sound changed. The middle and last stayed the same. These words have three letters for three sounds. Other words can work differently.',
];
const example = {title:'Try a different pair',left:words.tin,right:words.pin,position:0,frames:teaching};
const makeCase = (id,title,left,right,position,frames) => structuredClone({id,title,alphabet,left:words[left],right:words[right],position,frames,example});
const text = 'A cat sat on a mat. A cap is on a cot. A map is in a tin.';
const targets = new Set(['cat','sat','mat','cap','cot','map','tin']);
const collection = {
  id:'show-labels',revision:1,
  cases:{
    start:makeCase('start','First sound','mat','sat',0,['Say mat together.','Listen to the first sound.','Say sat. What stayed the same?']),
    middle:makeCase('middle','Middle sound','cat','cot',1,['Say cat together.','Listen to the middle sound.','Say cot. What stayed the same?']),
    end:makeCase('end','Last sound','cat','cap',2,['Say cat together.','Listen to the last sound.','Say cap. What stayed the same?']),
    show:makeCase('show','A label for the show','mat','map',2,['Say mat together.','Listen to the last sound.','Say map. What stayed the same?']),
  },
  message:{id:'show-note',title:'Dot’s note for the show',text,
    tokens:[...text.matchAll(/[A-Za-z]+/g)].map(m=>({text:m[0],start:m.index,end:m.index+m[0].length,role:targets.has(m[0])?'target':adultRole})),
    prompt:'Where is the pretend map? Tell your partner how you know.',
    art:'show-message342',alt:'A theater prop corner. A cat sits on a mat. A cap rests on a folding bed. A rolled pretend map sticks out of a tin.'},
};
export const makeSoundMessageSource = (pack='show') => pack==='show'?structuredClone(collection):pack==='market'?structuredClone(marketCollection):pack==='garden'?structuredClone(gardenCollection):null;
export const soundMessageCopy = {
  title:'Labels for the show',story:'Dot is getting the library show ready. Some prop labels got wet. Can you and your reading partner make new ones?',
  entry:'Try a sound-changing label',chooser:'Choose a label game. You can try any one.',
  setup:'Pass this to your reading partner. They will say a word for you.',
  build:'Listen to your partner. Choose a place, then tap a letter. You can change your idea.',
  read:'Try this word with your partner. Then uncover its picture.',
  reminder:'Your partner can help. Keeping a label does not tell the game how you read it.',
  grownup:'Say each whole word naturally. Help the child listen to and blend its three sounds, without replacing sounds with letter names. No app recording is provided. A letter place is a visual aid, not a measured sound boundary. We keep material and help, not oral reading results.',
  incomplete:'Some places are empty. You can keep this idea or add letters.',
  different:'Your label and our card are different. Compare them with your partner, or keep your idea.',
  match:'Your letters match our card. Say the word together if you want.',
  kept:'Your label is kept for the show. You can visit it again or try another idea.',
  unavailable:'An earlier label cannot open here. Your other labels are still waiting. You can keep a copy in Grown-up notes.',
  capacity:'There is not enough room to keep that change. Your label is still here. Download Grown-up notes before starting a fresh box.',
  notes:'Sound-changing prop labels. These are arrangements and task-local help, not oral reading or spelling results. A missing help flag does not mean a word was new or read independently.',
};

// Original343 packet; old342 collection and saved sources stay unchanged.
const marketAlphabet=['a','b','c','d','e','f','g','h','i','m','n','o','p','s','t','u'];
const marketWords={
 pan:word('pan','A shallow pretend cooking pan for the toy market.','pan343','Say pan naturally. Model three sounds without adding uh after p.'),
 pen:word('pen','An ink pen used to write the market labels.','pen343','Say pen, the writing tool. Here e is the short vowel heard in hen.'),
 cap:words.cap,
 cup:word('cup','An empty drinking cup with a handle for the pretend café.','cup343','Say cup naturally. Here u is the short vowel heard in bud.'),
 bed:word('bed','A little bed and pillow for a puppet to sleep in.','bed343','Say bed. Here d gives its final sound; a natural final stop need not have a loud release.'),
 bud:word('bud','A closed flower bud on a small model plant.','bud343','Say bud, meaning a new plant growth, not a seed. Point out the pictured closed flower.'),
 bag:word('bag','A cloth bag used to carry the toy props.','bag343','Say bag naturally. The last sound is hard g here. Different regional vowel qualities are not errors.'),
 bug:word('bug','A toy beetle with six legs for the show.','bug343','Say bug in the ordinary broad sense. A beetle is not necessarily a true bug in scientific naming.'),
 hen:word('hen','A toy hen, meaning a grown female chicken.','hen343','Say hen. Let h flow into the vowel rather than adding a separate uh.'),
 cub:word('cub','A small bear cub puppet, meaning a young bear.','cub343','Say cub. Compare its end with cup if the child wants help.'),
};
const marketCase=(id,title,left,right,position)=>({id,title,alphabet:marketAlphabet,left:marketWords[left],right:marketWords[right],position,
 frames:[`Say ${left} together.`,`Listen to the ${['first','middle','last'][position]} sound.`,`Say ${right}. What stayed the same?`],example});
const marketText='A bug is on a bud. A pen is in a cup. A cub is on a mat.';
const marketTargets=new Set(['bug','bud','pen','cup','cub','mat']);
const lesson=(id,context,position,guidance)=>({id,glyph:id,word:marketWords[context],position,guidance});
const marketCollection={id:'market-labels',revision:1,
 cases:{
  'e-middle':marketCase('e-middle','Middle sound 1','pan','pen',1),
  'u-middle':marketCase('u-middle','Middle sound 2','cap','cup',1),
  'two-vowels':marketCase('two-vowels','Middle sound 3','bed','bud',1),
  'g-word':marketCase('g-word','Middle sound 4','bag','bug',1),
  'e-start':marketCase('e-start','First sound','hen','pen',0),
  'u-end':marketCase('u-end','Last sound','cup','cub',2),
 },
 teaching:{
  e:lesson('e','hen',1,'Say hen naturally. Point to e and model its middle sound, not its letter name. Here e represents that short vowel.'),
  u:lesson('u','cup',1,'Say cup naturally. Point to u and model its middle sound, not its letter name. Here u represents that short vowel.'),
  d:lesson('d','bed',2,'Say bed naturally. Point to d and model its last sound. Keep it short; do not add uh.'),
  g:lesson('g','bug',2,'Say bug naturally. Point to g and model its last sound. This is hard g here; other words can use g differently.'),
 },
 message:{id:'market-note',title:"Dot's market note",text:marketText,
  tokens:[...marketText.matchAll(/[A-Za-z]+/g)].map(m=>({text:m[0],start:m.index,end:m.index+m[0].length,role:marketTargets.has(m[0])?'target':adultRole})),
  prompt:'Where did Dot put the pen? Read the note together and show your partner.',art:'market-message343',
  alt:'A toy beetle rests on a closed model flower bud. An ink pen sticks out of an empty handled cup. A bear cub puppet sits on a woven mat.'},
};
export const marketSoundCopy={
 title:'Market labels',story:'Dot is setting up the toy market for our show. Help make labels so the puppets can find their props.',
 letters:'Meet letter sounds',letterIntro:'Read this card with your partner. Your partner can say the sounds. You can point, join in, or listen.',
 grownup:'This packet offers e, u, d and g in selected words. We keep the letters you arrange and the help opened here. Earlier teaching, pictures or other games may already have made a word familiar. This does not show how a child read or spelled it. The note is shared reading; your partner supplies the other words.',
};

// Original347: a third finite packet in the existing room. Left-only words need no new art.
const gardenAlphabet=["a", "b", "c", "d", "e", "f", "g", "h", "i", "l", "m", "n", "o", "p", "r", "s", "t", "u", "w", "y"];
const gardenWords={
  "ram": {
    "label": "ram",
    "letters": [
      "r",
      "a",
      "m"
    ],
    "meaning": "A ram is a male sheep. This one is a puppet.",
    "alt": "A woolly ram puppet has two curved horns.",
    "art": "ram347",
    "guidance": "Establish the animal meaning, not bumping something. Keep the first sound joined to the vowel. Do not correct how your partner says r here."
  },
  "ham": {
    "label": "ham",
    "letters": [
      "h",
      "a",
      "m"
    ],
    "meaning": "Ham is meat from a pig. This slice is a pretend prop.",
    "alt": "A pink ham-slice prop lies on a small plate.",
    "art": "reference-only347",
    "guidance": "Use the food meaning, not a showy actor."
  },
  "lip": {
    "label": "lip",
    "letters": [
      "l",
      "i",
      "p"
    ],
    "meaning": "A lip is one edge of the mouth.",
    "alt": "A puppet face has its lower lip marked by a small pointer.",
    "art": "lip347",
    "guidance": "Point to one lip. The printed word is singular. Do not evaluate articulation or correct l here."
  },
  "sip": {
    "label": "sip",
    "letters": [
      "s",
      "i",
      "p"
    ],
    "meaning": "To sip is to take a small drink.",
    "alt": "Two pictures: a puppet lifts a cup, then takes a small drink.",
    "art": "reference-only347",
    "guidance": "Model the action or explain it; do not infer the verb from a still cup alone."
  },
  "wet": {
    "label": "wet",
    "letters": [
      "w",
      "e",
      "t"
    ],
    "meaning": "The cloth is wet with water.",
    "alt": "A small cloth has water drops on it and a puddle underneath.",
    "art": "wet347",
    "guidance": "Here wet describes the cloth, not an object called a wet. A final t can have little or no audible release; do not add uh or demand a sharp release."
  },
  "pet": {
    "label": "pet",
    "letters": [
      "p",
      "e",
      "t"
    ],
    "meaning": "A pet is an animal someone cares for at home.",
    "alt": "A toy cat sits beside its little home basket.",
    "art": "reference-only347",
    "guidance": "Use the animal noun, not the action of stroking."
  },
  "yam": {
    "label": "yam",
    "letters": [
      "y",
      "a",
      "m"
    ],
    "meaning": "A yam is a food that grows underground. This one is a prop.",
    "alt": "A rough brown yam prop has a pale cut end.",
    "art": "yam347",
    "guidance": "Name this unfamiliar food before the activity if needed. Here y begins the word; it is not the vowel sound in my."
  },
  "red": {
    "label": "red",
    "letters": [
      "r",
      "e",
      "d"
    ],
    "meaning": "This cloth is red.",
    "alt": "A red cloth swatch hangs from a short thread.",
    "art": "reference-only347",
    "guidance": "Name the color when needed. The task does not assess color vision or how r is spoken."
  },
  "rod": {
    "label": "rod",
    "letters": [
      "r",
      "o",
      "d"
    ],
    "meaning": "A rod is a long, thin stick.",
    "alt": "A plain wooden rod lies across two small supports.",
    "art": "rod347",
    "guidance": "Use the stick sense, not a fishing rod or a measuring unit. Local vowel realizations are not graded; do not correct r here."
  },
  "web": {
    "label": "web",
    "letters": [
      "w",
      "e",
      "b"
    ],
    "meaning": "A spider makes a web from silk. This one is pretend.",
    "alt": "A thread web stretches between two model twigs.",
    "art": "reference-only347",
    "guidance": "Use the spider-web meaning, not the internet. No animal is collected."
  }
};
const gardenCase=(id,title,left,right,position,frames)=>structuredClone({id,title,alphabet:gardenAlphabet,left:gardenWords[left],right:gardenWords[right],position,frames,example});
const gardenText="Put the yam on the mat. The ram has a red rod. The cup is wet.";
const gardenTargets=new Set(["yam","mat","ram","red","rod","cup","wet"]);
const gardenCollection={id:"garden-stage-labels",revision:1,
 cases:{
  "first-1":gardenCase("first-1","First sound 1","ham","ram",0,["Say ham, the food, together.", "Say ram, a male sheep. Listen to the first sound.", "The first sound changed. The middle and last stayed the same."]),
  "first-2":gardenCase("first-2","First sound 2","sip","lip",0,["Say sip: take a small drink.", "Say lip, an edge of the mouth. Listen to the first sound.", "The first sound changed. The middle and last stayed the same."]),
  "first-3":gardenCase("first-3","First sound 3","pet","wet",0,["Say pet, an animal cared for at home.", "Now say wet: a cloth has water on it. Listen to the first sound.", "The first sound changed. The middle and last stayed the same."]),
  "first-4":gardenCase("first-4","First sound 4","ham","yam",0,["Say ham, the food, together.", "Say yam, a food grown underground. Listen to the first sound.", "The first sound changed. The middle and last stayed the same."]),
  "middle":gardenCase("middle","Middle sound","red","rod",1,["Say red, a color.", "Say rod, the long stick. Listen to the middle sound.", "The middle sound changed. The first and last stayed the same."]),
  "last":gardenCase("last","Last sound","web","wet",2,["Say web, the threads a spider makes.", "Now say wet: a cloth has water on it. Listen to the last sound.", "The last sound changed. The first and middle stayed the same."]),
 },
 teaching:{
  "r": {
    "id": "r",
    "glyph": "r",
    "word": {
      "label": "ram",
      "letters": [
        "r",
        "a",
        "m"
      ],
      "meaning": "A ram is a male sheep. This one is a puppet.",
      "alt": "A woolly ram puppet has two curved horns.",
      "art": "ram347",
      "guidance": "Establish the animal meaning, not bumping something. Keep the first sound joined to the vowel. Do not correct how your partner says r here."
    },
    "position": 0,
    "guidance": "Say ram naturally. Point to r and model its first sound, not the letter name. Do not add uh. Do not correct how your partner says r here."
  },
  "l": {
    "id": "l",
    "glyph": "l",
    "word": {
      "label": "lip",
      "letters": [
        "l",
        "i",
        "p"
      ],
      "meaning": "A lip is one edge of the mouth.",
      "alt": "A puppet face has its lower lip marked by a small pointer.",
      "art": "lip347",
      "guidance": "Point to one lip. The printed word is singular. Do not evaluate articulation or correct l here."
    },
    "position": 0,
    "guidance": "Say lip naturally. Point to l and model its first sound. Do not add uh or ask for a perfect mouth shape. Do not correct how your partner says l here."
  },
  "w": {
    "id": "w",
    "glyph": "w",
    "word": {
      "label": "wet",
      "letters": [
        "w",
        "e",
        "t"
      ],
      "meaning": "The cloth is wet with water.",
      "alt": "A small cloth has water drops on it and a puddle underneath.",
      "art": "wet347",
      "guidance": "Here wet describes the cloth, not an object called a wet. A final t can have little or no audible release; do not add uh or demand a sharp release."
    },
    "position": 0,
    "guidance": "Say wet naturally. Point to w and model its first sound, not the name double-u. Join it into the word."
  },
  "y": {
    "id": "y",
    "glyph": "y",
    "word": {
      "label": "yam",
      "letters": [
        "y",
        "a",
        "m"
      ],
      "meaning": "A yam is a food that grows underground. This one is a prop.",
      "alt": "A rough brown yam prop has a pale cut end.",
      "art": "yam347",
      "guidance": "Name this unfamiliar food before the activity if needed. Here y begins the word; it is not the vowel sound in my."
    },
    "position": 0,
    "guidance": "Say yam naturally. Point to y and model its first sound, not the name why. This is y at the start of yam."
  }
},
 message:{id:"garden-show-note",title:"Dot's garden-show note",text:gardenText,
  tokens:[...gardenText.matchAll(/[A-Za-z]+/g)].map(m=>({text:m[0],start:m.index,end:m.index+m[0].length,role:gardenTargets.has(m[0])?"target":adultRole})),
  prompt:"What does the ram have? Read together, then show or tell your partner.",art:"garden-message347",
  alt:"A yam prop lies on a mat. A ram puppet holds a red rod. Drops of water cover the outside of a cup."},
};
export const gardenSoundCopy={
  "title": "Garden-stage labels",
  "story": "Dot is helping the puppets put on a garden show. Make labels and read their little note together.",
  "noteButton": "Read Dot's garden-show note",
  "noteHeading": "The garden-show note",
  "noteIntro": "Underlined words are our prop labels. Your partner can read any words with you.",
  "noteName": "garden-show note",
  "grownup": "This packet offers r, l, w and y in selected words. We keep the letters you arrange and the help opened here. Earlier teaching, pictures or other games may already have made a word familiar. A sound comparison can also give a word's meaning. This does not show how a child read, spoke or spelled it. Read the note together; your partner supplies the other words."
};
