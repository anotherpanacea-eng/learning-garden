// Original spec342 adult-led material. No phonics playback or oral assessment.
const alphabet = ['a','b','c','f','h','i','m','n','o','p','s','t'];
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
    tokens:[...text.matchAll(/[A-Za-z]+/g)].map(m=>({text:m[0],start:m.index,end:m.index+m[0].length,role:targets.has(m[0])?'target':'adult-supplied'})),
    prompt:'Where is the pretend map? Tell your partner how you know.',
    art:'show-message342',alt:'A theater prop corner. A cat sits on a mat. A cap rests on a folding bed. A rolled pretend map sticks out of a tin.'},
};
export const makeSoundMessageSource = () => structuredClone(collection);
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
