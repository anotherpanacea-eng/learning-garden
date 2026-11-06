// Complete original narratives and supplied arrangements; no inferred reading outcomes.
const source={
 "v": 1,
 "model": "two-threads-v1",
 "id": "second-knock",
 "title": "The Second Knock",
 "context": "At the library's new town collection, an old photograph is due before the doors open. Two people are close enough to hear each other, but neither has the whole picture.",
 "task": "Move whole scenes. Read your order. Where do you leave a question waiting?",
 "notice": "This is reading order, not a change to when the events happened. The scene words and thread labels are given. Your arrangement is not scored.",
 "returnQuestion": "Choose a place where your reading leaves one thread and later returns. What does a reader know by then? What might the person in the story still not know? In Story Loft, could you try a cut between two scenes of your own? Your words and your response to this story are for a person to read, not for the app to grade.",
 "definitions": [
  {
   "term": "Scene",
   "meaning": "A connected part of the story shown here as one movable piece. Its words stay together when you move it."
  },
  {
   "term": "Thread",
   "meaning": "Connected events following a person or group. Our labels are given; a scene can belong to both threads."
  },
  {
   "term": "Reading order",
   "meaning": "The order in which the reader meets the scenes. It need not be the order in which the events happened."
  },
  {
   "term": "Interruption or cut",
   "meaning": "A place where this reading leaves one thread to follow another. A cut can leave a question waiting, but not every reader will feel the same way."
  },
  {
   "term": "Return",
   "meaning": "A thread appears again after one or more scenes without it. Its first appearance and adjacent appearances are not returns on this map."
  },
  {
   "term": "Gap",
   "meaning": "The number of intervening scenes without a thread before it returns. It is not a measure of time or suspense."
  }
 ],
 "threads": [
  {
   "id": "leena",
   "label": "Leena outside",
   "symbol": "stripe"
  },
  {
   "id": "rowan",
   "label": "Rowan inside",
   "symbol": "dots"
  }
 ],
 "scenes": [
  {
   "id": "a1",
   "title": "A careful delivery",
   "threadIds": [
    "leena"
   ],
   "paragraphs": [
    "Leena carried the photograph flat between two boards. It showed the old footbridge before the storm, with three people standing where the water now ran. The archivist had asked her to bring it to the library before the collection opened. At the courtyard entrance, she found the door shut."
   ]
  },
  {
   "id": "b1",
   "title": "The voice in the headphones",
   "threadIds": [
    "rowan"
   ],
   "paragraphs": [
    "Inside, Rowan was testing a recording for the photograph's display. He put on the headphones. An unfamiliar voice described the footbridge, then stopped halfway through a sentence. Rowan wound the recording back. He wanted visitors to hear the whole account, not just the part that sounded certain."
   ]
  },
  {
   "id": "a2",
   "title": "No answer",
   "threadIds": [
    "leena"
   ],
   "paragraphs": [
    "Leena knocked with her free hand. A burst of laughter came from somewhere inside, but nobody opened the door. She checked the address on the folder. Perhaps they had forgotten her. She could leave the photograph on the step, but the first spots of rain were darkening the stone."
   ]
  },
  {
   "id": "b2",
   "title": "The wrong entrance",
   "threadIds": [
    "rowan"
   ],
   "paragraphs": [
    "Rowan lifted one ear of the headphones. Was that a knock? He went to the front entrance and looked down the empty steps. The courtyard was on the other side of the building. He did not think of the courtyard door. He went back for the recording sheet."
   ]
  },
  {
   "id": "a3",
   "title": "A second pattern",
   "threadIds": [
    "leena"
   ],
   "paragraphs": [
    "Leena tucked the boards under her coat. This time she knocked twice, waited, then knocked twice again. Through the glass she could see a strip of bright wall and the edge of an empty frame. Someone had made room for the photograph. She decided to wait a little longer."
   ]
  },
  {
   "id": "b3",
   "title": "The pause between knocks",
   "threadIds": [
    "rowan"
   ],
   "paragraphs": [
    "At the desk, Rowan heard two taps, a pause, and two more. The sound came from behind the display wall. He took off the headphones completely and walked around it. A dark shape moved beyond the courtyard glass. He reached for the latch."
   ]
  },
  {
   "id": "together",
   "title": "The whole account",
   "threadIds": [
    "leena",
    "rowan"
   ],
   "paragraphs": [
    "“I thought you had gone,” Rowan said when the door opened. “I thought you hadn't heard,” Leena answered. He had heard part of her knocking; she had seen part of his work. They set the photograph beside the recording sheet. Before the first visitors arrived, they wrote a clear sign for the courtyard door."
   ]
  }
 ],
 "startOrder": [
  "a1",
  "a2",
  "a3",
  "b1",
  "b2",
  "b3",
  "together"
 ],
 "authorOrder": [
  "a1",
  "b1",
  "a2",
  "b2",
  "a3",
  "b3",
  "together"
 ],
 "writerNote": "I left Leena waiting while the reader met Rowan and the headphones. The reader could then know something Leena did not. Later I returned to each person before they met. Another order might delay that information or make the misunderstanding feel different.",
 "demo": {
  "title": "The Blue Key",
  "threads": [
   {
    "id": "jo",
    "label": "Jo's search",
    "symbol": "stripe"
   },
   {
    "id": "ari",
    "label": "Ari's find",
    "symbol": "dots"
   }
  ],
  "scenes": [
   {
    "id": "j1",
    "title": "An empty hook",
    "threadIds": [
     "jo"
    ],
    "paragraphs": [
     "Jo reached for the blue key. Its hook was empty."
    ]
   },
   {
    "id": "r1",
    "title": "Under the bench",
    "threadIds": [
     "ari"
    ],
    "paragraphs": [
     "Ari found a blue key under the post-office bench."
    ]
   },
   {
    "id": "j2",
    "title": "Another place to look",
    "threadIds": [
     "jo"
    ],
    "paragraphs": [
     "Jo checked the coat pockets, then walked to the post office."
    ]
   },
   {
    "id": "r2",
    "title": "The notice",
    "threadIds": [
     "ari"
    ],
    "paragraphs": [
     "Ari put a found-key notice beside the counter and waited."
    ]
   },
   {
    "id": "meet",
    "title": "One key, two accounts",
    "threadIds": [
     "jo",
     "ari"
    ],
    "paragraphs": [
     "Jo read the notice. Ari held up the key, and Jo recognized the chipped blue paint."
    ]
   }
  ]
 },
 "teaching": [
  {
   "text": "First we follow Jo twice, then Ari twice. These are two threads: connected events following different people. They meet at the end. A scene can belong to both.",
   "order": [
    "j1",
    "j2",
    "r1",
    "r2",
    "meet"
   ]
  },
  {
   "text": "Now we leave Jo, meet Ari and return to Jo. The reader has seen the key before Jo sees the notice. The events have not changed, but the reader gets information in a different order.",
   "order": [
    "j1",
    "r1",
    "j2",
    "r2",
    "meet"
   ]
  },
  {
   "text": "The map shows where a thread disappears for one or more scenes and returns. It can locate a cut. It cannot tell us that every reader will feel suspense. Try reading both arrangements.",
   "order": [
    "j1",
    "r1",
    "j2",
    "r2",
    "meet"
   ]
  }
 ]
};
// Anchored passages and possible readings; the complete scene text above is unchanged.
source.echoStudy={
 "v": 1,
 "title": "Follow an Echo",
 "notice": "These passages and questions are given. Your connections are choices to discuss, not a reading score or proof of a theme. Share your spoken or written explanation with a person.",
 "invitations": [
  {
   "id": "sound",
   "prompt": "Who makes or hears a sound in these scenes? Choose two moments and describe what each person can hear."
  },
  {
   "id": "knowledge",
   "prompt": "Choose two passages where someone has only part of the picture. What might the other scene add, or leave unknown?"
  },
  {
   "id": "door",
   "prompt": "Where does a door or entrance appear? What is it doing for the person there?"
  }
 ],
 "cards": [
  {
   "id": "shut",
   "sceneId": "a1",
   "paragraphIndex": 0,
   "text": "At the courtyard entrance, she found the door shut."
  },
  {
   "id": "laughter",
   "sceneId": "a2",
   "paragraphIndex": 0,
   "text": "A burst of laughter came from somewhere inside, but nobody opened the door."
  },
  {
   "id": "wrong-entrance",
   "sceneId": "b2",
   "paragraphIndex": 0,
   "text": "Rowan lifted one ear of the headphones. Was that a knock? He went to the front entrance and looked down the empty steps. The courtyard was on the other side of the building."
  },
  {
   "id": "pattern",
   "sceneId": "a3",
   "paragraphIndex": 0,
   "text": "This time she knocked twice, waited, then knocked twice again."
  },
  {
   "id": "taps",
   "sceneId": "b3",
   "paragraphIndex": 0,
   "text": "At the desk, Rowan heard two taps, a pause, and two more."
  },
  {
   "id": "whole",
   "sceneId": "b1",
   "paragraphIndex": 0,
   "text": "He wanted visitors to hear the whole account, not just the part that sounded certain."
  },
  {
   "id": "part",
   "sceneId": "together",
   "paragraphIndex": 0,
   "text": "He had heard part of her knocking; she had seen part of his work."
  },
  {
   "id": "opened",
   "sceneId": "together",
   "paragraphIndex": 0,
   "text": "“I thought you had gone,” Rowan said when the door opened. “I thought you hadn't heard,” Leena answered."
  },
  {
   "id": "headphones",
   "sceneId": "b3",
   "paragraphIndex": 0,
   "text": "He took off the headphones completely and walked around it."
  },
  {
   "id": "guess",
   "sceneId": "a2",
   "paragraphIndex": 0,
   "text": "Perhaps they had forgotten her."
  },
  {
   "id": "frame",
   "sceneId": "a3",
   "paragraphIndex": 0,
   "text": "Through the glass she could see a strip of bright wall and the edge of an empty frame. Someone had made room for the photograph."
  }
 ],
 "references": [
  {
   "title": "A pattern heard two ways",
   "left": "pattern",
   "right": "taps",
   "lens": "image",
   "text": "These passages describe a two-knock pattern from Leena’s and Rowan’s sides. “knocked twice” and “two taps” can point to the same sound without repeating the same word. In the first-knock scene, Rowan wondered whether he heard a knock and checked the front entrance; with the two-tap pattern he goes toward the courtyard glass. The pattern connects the accounts. Read those scenes to compare his responses."
  },
  {
   "title": "Whole and part",
   "left": "whole",
   "right": "part",
   "lens": "idea",
   "text": "While testing the recording, Rowan wants visitors to hear the “whole account”, “not just the part that sounded certain”. When Leena and Rowan meet, each person has heard or seen only part of the other’s actions. A reader could connect these words to the misunderstanding and to the value of looking again. The voice stopped halfway through a sentence, but the story does not say what the rest of the recording contains or whether visitors will hear all of it."
  },
  {
   "title": "The courtyard door",
   "left": "shut",
   "right": "opened",
   "lens": "words",
   "text": "When Leena arrives, the shut courtyard door separates Leena from the people inside. When Rowan reaches Leena, the door opens and two mistaken beliefs are spoken aloud. One possible reading is that the doorway moves from a barrier into a place to compare what each knows. A reader could focus instead on the mix-up between entrances. The closing sign may matter to that reading, but the story does not show how later visitors use it."
  },
  {
   "title": "A question about partial knowledge",
   "left": "laughter",
   "right": "whole",
   "lens": "idea",
   "text": "Laughter without an answer leaves Leena guessing, while Rowan wants to give visitors a whole account. A reader might connect these passages through the problem of hearing too little. A different question is whether the laughter came from the recording. Its source is never identified, and Rowan’s headphones matter when weighing that guess. This pair can raise that question, but it does not settle where the laughter came from."
  }
 ],
 "demo": {
  "title": "The Doorstep",
  "text": "At dawn, Neri placed an empty bowl on the doorstep. At noon, the bowl held a gift of seed, but the path was empty. Neri set another chair beside her own and waited.",
  "first": "an empty bowl",
  "second": "the path was empty",
  "steps": [
   "The word empty appears twice in this story, but it describes different things: first the bowl, then the path. A repeated word need not name the same object.",
   "At noon, the bowl holds a gift of seed, but the path is empty. Neri puts out another chair and waits. One reading is that she hopes someone will join her. The extra chair and the contrast between a bowl holding seed and an empty path support that reading; the story does not state her thoughts.",
   "We know what Neri does: she sets another chair and waits. We can discuss whether that waiting feels hopeful, lonely, or both, and point to words for a reading. The story does not say who left the seed."
  ]
 }
};
export const threadEchoCopy={
 "intro": "The town collection needs readers who notice how a story works. Pair two passages, read their scenes, and tell someone what returns or changes.",
 "definition": "An echo in a story is a returning word, image, sound, or idea. It may change meaning in a new context. Repetition by itself does not prove a theme or the writer’s intention.",
 "topic": "A topic names a subject, such as partial knowledge. An interpretation says something about how the story develops that subject. Use the story’s words and explain your connection.",
 "task": "Choose what you want to follow. Tell someone what connects these words—and what changes.",
 "same": "Choose two different cards to make a connection. Different lines from the same scene are welcome.",
 "connected": "This connection is in your draft. Tell someone why you chose it.",
 "duplicate": "That pair and lens are already in your draft. Here is the earlier connection.",
 "removed": "This connection was removed from your draft. The other connections and reading order are unchanged.",
 "absent": "This earlier story has no echo cards. Its scenes and reading order are still open.",
 "unavailable": "These echo notes cannot be shown here. Their originals stay unchanged in Notes. The scenes and reading order are still open.",
 "referenceHeading": "One reader’s connections",
 "referenceNote": "These are possible readings, not an answer key. You can keep a different connection and explain it.",
 "kept": "Work on a copy to change connections or see new help. You can revisit help already shown on this sheet.",
 "lensNeeded": "Choose a lens before connecting these passages. It tells us what you want to follow, not whether your interpretation is right."
};
export const threadCases=[{id:source.id,title:source.title}];
export const threadCopy={
 "title": "Two Threads",
 "story": "The town collection needs stories for its next readers. Try changing where a story leaves one person and returns to another.",
 "comparison": "The writer chose one order. Yours may change when a reader learns something, or may make the story harder to follow. Matching the writer is not the goal. Read and discuss what changes.",
 "draftWarning": "Keep an order to return to it later. Leaving English or reloading loses orders that have not been kept. Back to English keeps them waiting during this visit.",
 "readHeading": "Read this arrangement",
 "referenceHeading": "The writer's arrangement",
 "mapHeading": "Where the threads return",
 "mapNote": "A gap counts scenes between appearances of a thread. It does not measure suspense, reading time or how much someone understands.",
 "noReturn": "This thread has not been left and returned to in this order. That is a structural description, not a score.",
 "bothLabel": "Both threads"
};
export function makeThreadSource(caseId='second-knock'){return caseId===source.id?structuredClone(source):null;}
