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
