import {keeperStoryContent} from './keeper-story-content.mjs';

// Original teaching prose, independently reviewed with spec296. Story120 owns
// the canonical page; no invented letter patterns or reconstructed answers.
const strips = [
  {
    "id": "valley",
    "text": "The valley, drawn in my second year of keeping."
  },
  {
    "id": "brook",
    "text": "Willow Brook from the high ford to the mill."
  },
  {
    "id": "sponge",
    "text": "The Sponge holds the spring water and lets it go [smudged word], so the mill boards are seldom needed."
  },
  {
    "id": "herons",
    "text": "Reeds, frogs, a great many herons, one of them me."
  },
  {
    "id": "road",
    "text": "The bridge road runs on the dry side."
  },
  {
    "id": "scale",
    "text": "Scale: one finger to a [smudged word] walk."
  }
];
const teaching = {
  "intro": "An editor keeps the page's words apart from their own ideas. Copy a little, try a possible reading in the margin, or leave a gap. You can visit these steps in any order. Your writing is not automatically marked.",
  "copy": "Copy this sentence as it appears. Keep its words and punctuation. Keep [smudged word] where this copy marks a lost word; a possible replacement belongs in the margin.",
  "copySupport": "[smudged word] is an editor’s mark, not ink on the page. This printed copy lets us practise careful editing. It cannot teach us what the lost handwriting looked like. Read your copy beside the source. What did you keep? Is anything changed or missing?",
  "gaps": "Choose a gap. Write a possible reading if you want to. Explain what suggests it and what the page cannot tell you.",
  "gapSupport": "Neither gap has surviving letters in this copy, so this copy cannot tell us the lost word’s length. A sentence can suggest possibilities without identifying the word that was written. Leaving a gap is useful work too.",
  "gap1": "What might the missing word say about how, when or where the Sponge lets water go? Which words in the sentence support your idea? Could a different word change the meaning? The page does not explain mill boards. Is that something to leave as unknown or check in another Willowbank record?",
  "gap2": "The sentence gives a scale: one finger to a ___ walk. What kinds of words could fit? If the word were a measure, what would we still need before using it to work out a distance?",
  "gap2Support": "The writer gave the map a scale, but part of it is lost. The picture in this app is a story sketch and is not drawn to any scale. Even with a guessed word, a finger and a walk are rough measures. We cannot calculate a distance from this copy.",
  "retellings": "Read the original and a retelling. What was kept, left out or added? Where does an added detail come from?",
  "retellingSupport": "The short version says the orchard is there now. The longer story includes Pip pointing out today's orchard. Those are present-day story details; the old original does not mention an orchard. A retelling can add useful context. Label its source instead of treating every addition as a mistake. The original page is also a drawing. Some retelling details, such as the loops and reeds drawn across the patch, describe that picture rather than these written words. This workbench compares worded versions; you can visit the Keeper’s Page for picture context. These words alone cannot explain every pictured detail.",
  "further": "Does either version tell us when, why or how this place changed? What further record would help?",
  "note": "Tell the next reader what the page says, what you propose, and what is still unknown. What further source might help?",
  "noteSupport": "You can quote words that survive and label a possible reading as a guess. The writer's claim is evidence of what the writer says, not proof that every claim is true. “my second year of keeping” does not give us a calendar date.",
  "keep": "This edition will contain the saved writing shown below. Unsent changes are not included. You can keep a partial edition; no answer is required. Your words have not been automatically checked.",
  "exampleTitle": "A ferry note · invented example, not part of the Keeper’s story",
  "example": [
    "The ferry leaves after [smudged word]. Bring a lamp.",
    "The ferry leaves after [smudged word]. Bring a lamp.",
    "[sunset?] might fit because a lamp could help in the dark. But the note might say another time or event. The lamp does not recover the lost word.",
    "The note says to bring a lamp. I propose “sunset” for the gap, but no letters survive here. I would look for a ferry timetable before relying on that reading."
  ]
};
const notice = "Fictional story page. This is a typeset practice copy, not a picture of handwriting. The two missing words have no surviving letters here.";
export function makeMapReadingSource(){
 const page=keeperStoryContent.page, original=page.amounts.original.paragraphs.join(' ');
 if(strips.map(x=>x.text).join(' ')!==original)throw new Error('The map source needs an authoring review before a new edition can start.');
 return structuredClone({id:'old-map-page-one',version:1,title:'Reading the old map',notice,limitation:page.mapLimit,
  original,short:page.amounts.short.paragraphs.join(' '),longer:page.amounts.longer.paragraphs.join(' '),
  lines:strips,gaps:[{id:'water-release',lineId:'sponge'},{id:'walking-measure',lineId:'scale'}],teaching});
}
