// Original Field Kit cards and replies, reviewed in spec 75.
export const FIELD_MISSIONS=Object.freeze([
 {
  id:'jug',version:1,title:'A real jug and our picture jug',host:'Measuring Kitchen',hostHash:'#cafe/recipes',
  purpose:'Our picture jug has exact 50 mL steps. Look at how a real jug shows its own marks.',
  materials:'A measuring jug with numbered mL marks, cold tap water and a towel. An adult helps.',
  steps:[
   'Put the jug on a flat, steady surface. Find two numbered mL marks.',
   'With an adult, pour cold water to one mark. Look level with the water and the mark.',
   "Say what the jug's marks show. Compare their spacing with our picture's even 50 mL steps."
  ],
  safety:'Use cold tap water. An adult handles glass or heavy jugs. Wipe spills before moving.',
  contrast:'The game has an exact drawn scale; this jug is real and may have different marks.',
  missing:'You can read and talk about our picture today. Choose Not today for the real-jug mission.',
  replies:{
   done:'The café cook sets our picture jug beside your place at the table. ‘Thanks for trying a real one together. What did its marks look like?’',
   surprised:'The cook leans closer. ‘A surprise is worth talking about. What did you expect to see on the jug?’',
   'not-today':'The cook puts the picture jug back on its shelf. ‘The real jug can wait. We can still read this card together.’'
  }
 },
 {
  id:'cress',version:1,title:'Two pots, two kinds of light',host:'Seedling Study',hostHash:'#living/plants',
  purpose:'Our garden game uses invented plant numbers. Watch two real pots without sending their results here.',
  materials:'Two clean small containers, cotton wool or folded kitchen paper, untreated garden-cress seed sold for growing and water. An adult helps.',
  steps:[
   'Put the same damp cotton or folded paper in both containers. Sprinkle a few cress seeds on each.',
   'Keep one pot near a bright indoor window. Put the other in a dimmer indoor spot, not a closed cupboard.',
   'Keep both beds damp, not flooded. Look together over several days; growth may take time.',
   'Tell each other what you notice. You do not need to measure, photograph or report it here.'
  ],
  safety:'Use untreated seed. Seeds and these experiment plants are not for eating. An adult keeps the seed packet. If mold appears, an adult throws the bed away. Wash hands after handling seed or growing material.',
  contrast:"The game sets the plant lengths; your two pots may grow in ways the game cannot predict.",
  missing:'Read or talk about the game plants. Choose Not today for real sowing.',
  replies:{
   done:'The garden keeper makes room on the sill. ‘You tried the real-pot activity. You can watch any plants at your own pace.’',
   surprised:'The keeper smiles at the two empty spaces on the sill. ‘Tell someone what surprised you, if you want. I cannot see your pots from here.’',
   'not-today':'The keeper folds the seed card into the box. ‘Seeds can wait. We can talk about the picture garden today.’'
  }
 },
 {
  id:'notice',version:1,title:'A café notice by hand',host:'Post Office Letters',hostHash:'#post/letters',
  purpose:'A real reader can tell you whether a handwritten notice makes sense to them.',
  materials:'Paper and a pencil or crayon. An adult can help write or read.',
  steps:[
   'Make a short notice for an imaginary café board, such as ‘Soup today.’',
   'Write it yourself or copy words with help. Show the paper to your adult reader.',
   'Ask what the reader understands. You may change one word if you want.'
  ],
  safety:'Use ordinary paper and a pencil or crayon. An adult chooses a comfortable place to work.',
  contrast:'The game arranges ready-made screen words; this paper is your own mark-making for a reader.',
  missing:'Talk about what a café notice might say. Choose Not today for the paper mission.',
  replies:{
   done:'The café cook clears a place on the imaginary notice board. ‘You tried making a paper notice. Keep it with you if you like.’',
   surprised:'The cook turns the empty board toward you. ‘Did your reader understand something unexpected? You can talk it over together.’',
   'not-today':'The cook leaves the imaginary board open. ‘No paper mission today. A spoken idea is welcome too.’'
  }
 },
 {
  id:'weather',version:1,title:'Three weather windows',host:'Rain Paths',hostHash:'#science/rain',
  purpose:"Our rain game moves invented rain tokens. An available window can show today's real weather.",
  materials:'A safe window view with an adult. No other equipment is needed.',
  steps:[
   'On an available day, look through the closed window together.',
   'Say one word for weather you can see, such as sunny, cloudy, rainy, windy or foggy.',
   'If you like, look on one or two other days. Each day can be different.'
  ],
  safety:'Stay indoors; do not open or climb to a window. Never look straight at the sun. An adult chooses a safe view.',
  contrast:"These are brief real views, not the game's rain tokens or proof of a weather pattern.",
  missing:'Read and talk about weather words. Choose Not today for real watching.',
  replies:{
   done:'The rain keeper closes the model-rain box. ‘You looked at real weather together. We need not put its words into this game.’',
   surprised:'The keeper glances toward the window. ‘Weather can surprise us. What did you expect before you looked?’',
   'not-today':'The keeper sets the window card aside. ‘No weather watching today is fine. Our pretend rain stays in its own game.’'
  }
 },
 {
  id:'walk',version:1,title:'Look, then guess',host:'Living Garden',hostHash:'#living',
  purpose:'First say what you see. Then name a possible reason as a guess.',
  materials:'An adult-led path walk or a safe window view. No objects need collecting.',
  steps:[
   'Look from a safe window, or walk with an adult on a path.',
   'Look for a place that appears damp and a place that appears dry. If you see only one, describe that one.',
   'Say what you see first. Then offer a possible reason and call it a guess.',
   'Ask whether another reason might fit. You do not need to touch anything.'
  ],
  safety:'Stay with the adult on a path away from traffic and water. At a window, do not open or climb to it. Do not touch animals, fungi or unknown plants. Wash hands after an outdoor walk.',
  contrast:'Our garden scene is drawn; a real view gives observations, while reasons remain guesses.',
  missing:'Talk about the drawn garden. Choose Not today for real looking.',
  replies:{
   done:'The garden keeper points to the drawing, then leaves space for your real view. ‘You tried looking at a real place. What did you notice?’',
   surprised:'The keeper nods. ‘A surprising view can start a good question. What did you see, and what is still a guess?’',
   'not-today':'The keeper closes the little gate in the drawing. ‘The path or window can wait. We can look at the picture now.’'
  }
 }
]);
export const fieldMission=id=>FIELD_MISSIONS.find(m=>m.id===id)||null;
export const FIELD_OUTCOMES=Object.freeze({done:'We did it',surprised:'It surprised us','not-today':'Not today'});
