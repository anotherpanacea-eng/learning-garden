// Original drawn how-to copy. Diagram text is laid out by scripts/drawn-howtos; pictures live in drawn-howtos-art.mjs.
// Each step lists the ids it draws. Captions are child text: one sentence or two, 15 words or fewer.
export const drawnHowtos=[
 {version:1,id:'life-ring',button:'Show me the life cycle',title:'How one small white butterfly’s life leads to the next',
  alt:'A ring of four stages: egg, caterpillar, chrysalis and butterfly. Arrows go around the ring, and the butterfly lays eggs that start it again.',
  ring:{stages:[['egg','egg'],['larva','caterpillar'],['pupa','chrysalis'],['adult','butterfly']],links:[['egg-larva','egg','larva','hatches'],['larva-pupa','larva','pupa','forms'],['pupa-adult','pupa','adult','comes out'],['adult-egg','adult','egg','lays eggs']]},
  steps:[
   {caption:'This is the egg of a small white butterfly.',draws:['egg']},
   {caption:'A caterpillar hatches out of the egg.',draws:['egg-larva','larva']},
   {caption:'The caterpillar eats and grows. Then it forms a chrysalis.',draws:['larva-pupa','pupa']},
   {caption:'Inside the chrysalis, its body changes. A butterfly comes out.',draws:['pupa-adult','adult']},
   {caption:'The butterfly lays eggs. Each egg starts a new butterfly’s life.',draws:['adult-egg']},
   {caption:'Follow the ring around. It keeps going, one life after another.',draws:['lap']},
  ]},
 {version:1,id:'shutters-play',button:'Show me how to play',title:'How a turn of Shutters works',
  alt:'A drawn flowchart. Roll the dice, pick open numbers that add to the roll, and shut them. Keep rolling until every shutter is shut, or until no open numbers make the roll.',
  mermaid:`flowchart TD
  roll[Roll the dice]
  pick[Pick open numbers<br>that make the roll]
  shut[Shut them]
  done([All shut?<br>You finished!])
  stuck([None fit?<br>Round over.])
  roll -->|3 + 4 = 7| pick
  pick -->|1 + 6 = 7| shut
  shut --> roll
  shut --> done
  pick -.-> stuck`,
  steps:[
   {caption:'Roll the dice. Here, a three and a four make seven.',draws:['roll']},
   {caption:'Pick open numbers that add up to your roll.',draws:['L_roll_pick_0','pick']},
   {caption:'One and six make seven, so shut those two.',draws:['L_pick_shut_0','shut']},
   {caption:'Some shutters are still open? Roll again.',draws:['L_shut_roll_0']},
   {caption:'Shut every number and you finish the box!',draws:['L_shut_done_0','done']},
   {caption:'If no open numbers make your roll, the round is over.',draws:['L_pick_stuck_0','stuck']},
  ]},
 {version:1,id:'rows-play',button:'Show me how to play',title:'How a turn of Ribbon Rows works',
  alt:'A drawn flowchart. Pick one row and take one or more ribbons from it. Then Bramble takes from one row. Whoever takes the last ribbon wins.',
  mermaid:`flowchart TD
  pick[Pick one row]
  take[Take 1 or more<br>from that row]
  bramble[Bramble takes<br>from one row]
  win([Whoever takes<br>the last one wins])
  pick --> take
  take --> bramble
  bramble --> pick
  take -->|last one| win
  bramble -->|last one| win`,
  steps:[
   {caption:'On your turn, pick one row.',draws:['pick']},
   {caption:'Take one ribbon or more, but only from that row.',draws:['L_pick_take_0','take']},
   {caption:'Then Bramble takes ribbons from one row.',draws:['L_take_bramble_0','bramble']},
   {caption:'Ribbons left? Now it is your turn again.',draws:['L_bramble_pick_0']},
   {caption:'Whoever takes the very last ribbon wins.',draws:['L_take_win_0','L_bramble_win_0','win']},
  ]},
];
export const drawnHowto=id=>drawnHowtos.find(h=>h.id===id)??null;
