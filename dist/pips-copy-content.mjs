// Original project-owned fiction and finite copy commissioned by spec 335.
// No learner data, upstream prose or audio assets. The second deck freezes the project-owned third page.
import {actThreeContent} from './act-three-content.mjs';
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function deepFreeze(value) {
  if (value && typeof value === "object") {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

const source = deepFreeze({
  "format": 1,
  "id": "pips-copy-1",
  "story": {
    "hook": "Pip has a postcard for Léon. Read for meaning. Some words need changing. One can stay: choose its leave-it form.",
    "short": [
      "Pip writes to Léon fast. Some words are mixed up with words that sound alike, or nearly alike. Meaning tells you which to choose."
    ],
    "longer": [
      "Pip's postcard says: Dear Léon, the river is high. Dot gave me some advise: write small. The rain had a big affect on the apples. Yesterday the baker lead us to the mill.",
      "\"I wrote that in a hurry,\" says Pip.",
      "\"Say advice and advise out loud,\" says Dot. \"One ends with a hiss. One ends with a buzz. Advice is the guidance I gave you. Advise is what I do.\"",
      "Pip tries them. \"So which other ones need changing?\"",
      "Read it for meaning, not just for sound."
    ]
  },
  "postcard": {
    "id": "postcard-1",
    "segments": [
      {
        "text": "Dear Léon, the river is "
      },
      {
        "slotId": "high"
      },
      {
        "text": ". Dot gave me some "
      },
      {
        "slotId": "advice"
      },
      {
        "text": ": write small. The rain had a big "
      },
      {
        "slotId": "effect"
      },
      {
        "text": " on the apples. Yesterday the baker "
      },
      {
        "slotId": "led"
      },
      {
        "text": " us to the mill."
      }
    ],
    "slots": [
      {
        "id": "high",
        "label": "The river",
        "original": "high",
        "clue": "This sentence describes how far up the river has risen.",
        "choices": [
          {
            "id": "hi",
            "text": "hi",
            "label": "hi"
          },
          {
            "id": "high",
            "text": "high",
            "label": "high (leave it)"
          },
          {
            "id": "hie",
            "text": "hie",
            "label": "hie"
          }
        ],
        "key": "high",
        "context": {
          "before": "The river is ",
          "after": "."
        },
        "different": {
          "hi": "Hi is a greeting. This sentence describes the river's height.",
          "hie": "Hie means hurry. This sentence describes the river's height."
        }
      },
      {
        "id": "advice",
        "label": "Dot's guidance",
        "original": "advise",
        "clue": "Dot gave guidance. Choose the word for the guidance, not the action of giving it.",
        "choices": [
          {
            "id": "advice",
            "text": "advice",
            "label": "advice"
          },
          {
            "id": "advize",
            "text": "advize",
            "label": "advize"
          },
          {
            "id": "advise",
            "text": "advise",
            "label": "advise (leave it)"
          }
        ],
        "key": "advice",
        "context": {
          "before": "Dot gave me some ",
          "after": ": write small."
        },
        "different": {
          "advize": "This sentence needs the noun advice, spelled with c.",
          "advise": "Advise names the action. Dot gave advice: guidance."
        }
      },
      {
        "id": "effect",
        "label": "The rain",
        "original": "affect",
        "clue": "The sentence names a result the rain had on the apples.",
        "choices": [
          {
            "id": "affect",
            "text": "affect",
            "label": "affect (leave it)"
          },
          {
            "id": "effect",
            "text": "effect",
            "label": "effect"
          },
          {
            "id": "efect",
            "text": "efect",
            "label": "efect"
          }
        ],
        "key": "effect",
        "context": {
          "before": "The rain had a big ",
          "after": " on the apples."
        },
        "different": {
          "affect": "Here the sentence names a result: an effect. Affect is usually the action.",
          "efect": "Here the word for the result is effect, with two f's."
        }
      },
      {
        "id": "led",
        "label": "The mill visit",
        "original": "lead",
        "clue": "The baker guided Pip's group yesterday. Choose the past of lead.",
        "choices": [
          {
            "id": "leed",
            "text": "leed",
            "label": "leed"
          },
          {
            "id": "lead",
            "text": "lead",
            "label": "lead (leave it)"
          },
          {
            "id": "led",
            "text": "led",
            "label": "led"
          }
        ],
        "key": "led",
        "context": {
          "before": "Yesterday the baker ",
          "after": " us to the mill."
        },
        "different": {
          "leed": "Here the past of lead is spelled led.",
          "lead": "Yesterday points to the past. The past of lead is led."
        }
      }
    ]
  },
  "cards": [
    {
      "id": "card14",
      "title": "Homophones, and pairs that get mixed up",
      "text": "Homophones sound the same but differ in spelling and meaning: need and knead. Some mixed-up pairs sound different: advice, advise. Read for meaning, then choose.",
      "example": "Advice or advise?",
      "steps": [
        "Advice ends with an s sound. Advise ends with a z sound.",
        "Here, advice names the guidance. To advise is to give guidance.",
        "Dot gave good advice. She gave guidance, so advice."
      ]
    }
  ],
  "jobs": [
    {
      "v": 1,
      "id": "d1",
      "kind": "choice",
      "title": "D1",
      "prompt": "The baker ___ the dough by pressing and folding it.",
      "choices": [
        {
          "id": "needs",
          "text": "needs"
        },
        {
          "id": "kneeds",
          "text": "kneeds"
        },
        {
          "id": "kneads",
          "text": "kneads"
        }
      ],
      "key": "kneads",
      "different": {
        "needs": "Needs means must have. Here the baker is pressing the dough.",
        "kneeds": "The k is right. The vowels are ea."
      },
      "hint": "Which word means press and fold?",
      "explanation": "Knead means press and fold. Need means must have.",
      "example": "Flour and dough",
      "steps": [
        "Pressing and folding dough is kneading.",
        "Kneading has a silent k.",
        "Choose the one with k and ea."
      ],
      "teach": [
        {
          "id": "card14-flour",
          "title": "Flour and dough",
          "text": "Homophones sound the same but differ in spelling and meaning: need and knead. Some mixed-up pairs sound different: advice, advise. Read for meaning, then choose.",
          "example": "Flour and dough",
          "steps": [
            "I need flour: I must have it.",
            "I knead dough: I press and fold it.",
            "The meaning decides which spelling fits."
          ]
        }
      ],
      "parts": [],
      "supported": true,
      "guided": true,
      "copy": {
        "incomplete": "Choose a word, or keep this job for later.",
        "partDifferent": "Read for the meaning this sentence needs."
      }
    },
    {
      "v": 1,
      "id": "d2",
      "kind": "choice",
      "title": "D2",
      "prompt": "Dot gave Pip some ___: \"Write small.\"",
      "choices": [
        {
          "id": "advice",
          "text": "advice"
        },
        {
          "id": "advise",
          "text": "advise"
        },
        {
          "id": "advize",
          "text": "advize"
        }
      ],
      "key": "advice",
      "different": {
        "advise": "Advise names the action. Here Dot gave guidance: advice.",
        "advize": "Here the noun is spelled advice, with c."
      },
      "hint": "Here the sentence names the guidance Dot gave.",
      "explanation": "Advice, with c and an s sound, is the noun. Advise, with a z sound, is the verb.",
      "example": "Advice or advise?",
      "steps": [],
      "teach": [
        {
          "id": "card14",
          "title": "Homophones, and pairs that get mixed up",
          "text": "Homophones sound the same but differ in spelling and meaning: need and knead. Some mixed-up pairs sound different: advice, advise. Read for meaning, then choose.",
          "example": "Advice or advise?",
          "steps": [
            "Advice ends with an s sound. Advise ends with a z sound.",
            "Here, advice names the guidance. To advise is to give guidance.",
            "Dot gave good advice. She gave guidance, so advice."
          ]
        }
      ],
      "parts": [],
      "supported": true,
      "guided": true,
      "copy": {
        "incomplete": "Choose a word, or keep this job for later.",
        "partDifferent": "Read for the meaning this sentence needs."
      }
    },
    {
      "v": 1,
      "id": "d3",
      "kind": "choice",
      "title": "D3",
      "prompt": "The storm had a big ___ on the orchard.",
      "choices": [
        {
          "id": "affect",
          "text": "affect"
        },
        {
          "id": "effect",
          "text": "effect"
        },
        {
          "id": "efect",
          "text": "efect"
        }
      ],
      "key": "effect",
      "different": {
        "affect": "Affect is usually a verb. Here the sentence names a result.",
        "efect": "Effect has two f's."
      },
      "hint": "Here the sentence names a result of the storm.",
      "explanation": "Here effect names a result. Affect usually names an action. They do not always sound alike.",
      "example": "Rain and a result",
      "steps": [],
      "teach": [
        {
          "id": "card14-rain",
          "title": "Rain and a result",
          "text": "Homophones sound the same but differ in spelling and meaning: need and knead. Some mixed-up pairs sound different: advice, advise. Read for meaning, then choose.",
          "example": "Rain and a result",
          "steps": [
            "Rain can affect apples: it can change them.",
            "A change caused by the rain is an effect.",
            "An effect is the result in this sentence."
          ]
        }
      ],
      "parts": [],
      "supported": true,
      "guided": true,
      "copy": {
        "incomplete": "Choose a word, or keep this job for later.",
        "partDifferent": "Read for the meaning this sentence needs."
      }
    },
    {
      "v": 1,
      "id": "d4",
      "kind": "choice",
      "title": "D4",
      "prompt": "Yesterday, Nuria ___ the boats down the river.",
      "choices": [
        {
          "id": "led",
          "text": "led"
        },
        {
          "id": "lead",
          "text": "lead"
        },
        {
          "id": "leaded",
          "text": "leaded"
        }
      ],
      "key": "led",
      "different": {
        "lead": "Yesterday is past. The past of lead is led.",
        "leaded": "Here lead means guide. Its past is led, with no -ed."
      },
      "hint": "Yesterday means the past. What is the past of lead?",
      "explanation": "Led is the past of lead. It sounds like the metal lead.",
      "example": "Today and yesterday",
      "steps": [],
      "teach": [
        {
          "id": "card14-today",
          "title": "Today and yesterday",
          "text": "Homophones sound the same but differ in spelling and meaning: need and knead. Some mixed-up pairs sound different: advice, advise. Read for meaning, then choose.",
          "example": "Today and yesterday",
          "steps": [
            "Today, I lead the way.",
            "Yesterday, I led the way.",
            "Led is the past form here."
          ]
        }
      ],
      "parts": [],
      "supported": true,
      "guided": true,
      "copy": {
        "incomplete": "Choose a word, or keep this job for later.",
        "partDifferent": "Read for the meaning this sentence needs."
      }
    },
    {
      "v": 1,
      "id": "d5",
      "kind": "choice",
      "title": "D5",
      "prompt": "\"___ path is safest in winter?\" asks Pip.",
      "choices": [
        {
          "id": "witch",
          "text": "Witch"
        },
        {
          "id": "wich",
          "text": "Wich"
        },
        {
          "id": "which",
          "text": "Which"
        }
      ],
      "key": "which",
      "different": {
        "witch": "A witch is a person, like Bramble. Pip is asking a question.",
        "wich": "The question word keeps an h: wh."
      },
      "hint": "Question words often start with wh.",
      "explanation": "Which asks a question here. Witch names a person. Some speakers say them alike; some do not.",
      "example": "Which or witch?",
      "steps": [],
      "teach": [
        {
          "id": "card14-which",
          "title": "Which or witch?",
          "text": "Homophones sound the same but differ in spelling and meaning: need and knead. Some mixed-up pairs sound different: advice, advise. Read for meaning, then choose.",
          "example": "Which or witch?",
          "steps": [
            "Bramble is a witch.",
            "Which path? asks about a choice of paths.",
            "The question needs which."
          ]
        }
      ],
      "parts": [],
      "supported": true,
      "guided": true,
      "copy": {
        "incomplete": "Choose a word, or keep this job for later.",
        "partDifferent": "Read for the meaning this sentence needs."
      }
    }
  ],
  "copy": {
    "title": "Pip's Copy",
    "teachingNote": "The words may be said with a grown-up. The app does not record or score a voice.",
    "postcardTitle": "Revise the postcard",
    "practiceTitle": "Try a job",
    "originalTitle": "Pip's original",
    "currentTitle": "This version",
    "picker": "Choose a word",
    "previous": "Previous word",
    "next": "Next word",
    "chosen": "Chosen: {word}",
    "unchosen": "Not chosen yet",
    "putBack": "Put back",
    "check": "Check this version",
    "keep": "Keep this version",
    "reopen": "Reopen this version",
    "first": "First kept version",
    "latest": "Latest kept version",
    "unchecked": "Not checked in this version",
    "incomplete": "Choose a form for each marked word. To keep a fitting word, choose its (leave it) form.",
    "different": "Some choices do not fit this postcard yet. Read the word notes for help.",
    "fit": "This version fits the sentence clues. You can keep it, or try another.",
    "partialFit": "These readable choices fit their sentence clues. Some of the earlier postcard is unavailable.",
    "partial": "Some of this earlier postcard cannot be shown. The readable words are still open; the original is kept in your notes.",
    "unavailableWord": "[earlier word unavailable]",
    "contextUnavailable": "This earlier word has no separate sentence view. Read it in the postcard.",
    "jobIncomplete": "Choose a word, or keep this job for later.",
    "neutral": "Read for the meaning this sentence needs.",
    "hint": "A hint",
    "example": "Show an example",
    "skip": "Skip for now",
    "step": "Next step",
    "stepBack": "Previous step",
    "kept": "This version is kept.",
    "reopened": "This version is open to revise.",
    "readPostcard": "Read the postcard with blanks",
    "readIntro": "Each marked word will be read as blank.",
    "readPrompt": "Read these words",
    "story": "A story from Willowbank",
    "grownups": "For grown-ups",
    "adultLine": "Supplied spelling choices with sentence clues and help. This does not show independent spelling, reading or pronunciation.",
    "adultDetails": "The postcard and jobs use authored examples. Earlier versions and requested hints are kept separately. No voice is recorded.",
    "unavailableSelection": "Some earlier work at this table cannot be shown. Its original is still kept in your notes. Other readable work stays open.",
    "unsupported": "This Pip's Copy notebook uses a format this version cannot read. Your original is still in your notes download.",
    "refused": "There isn't room to save this change yet. Your work is unchanged. Ask a grown-up to download the notes.",
    "wordGarden": "Word Garden",
    "stainedMap": "The Stained Map",
    "endingsShelf": "The Endings Shelf",
    "notes": "Your notes"
  }
});

export const pipsCopyCopy = source.copy;
export function makePipsCopySource() { return clone(source); }

// Spec357 finite choices and contexts. The actual page is frozen only by the explicit gated opening.
const pageThreeMaterial=deepFreeze({
  "format": 1,
  "id": "pips-page-three-357",
  "story": {
    "hook": "Pip copied the third page in a hurry. Check his spelling against the page, then read for meaning. You can keep a version and change it later.",
    "short": [
      "Nuria read the page while Pip copied it. Some spellings got mixed up. The librarian has the page here so you can check."
    ],
    "longer": [
      "The librarian reads Pip's words: \"Their are three Weighs.\" \"Weighs?\" asks the librarian. \"Like scales,\" says Pip. \"Those are for weighing,\" says Dot. \"Here the page means paths. Read the sentence and check its spelling.\""
    ]
  },
  "postcard": {
    "id": "page-three-copy",
    "slots": [
      {
        "id": "there",
        "label": "Paths that exist",
        "original": "Their",
        "choices": [
          {
            "id": "theyre",
            "text": "They're",
            "label": "They're"
          },
          {
            "id": "there",
            "text": "There",
            "label": "There"
          },
          {
            "id": "their",
            "text": "Their",
            "label": "Their (leave it)"
          }
        ],
        "key": "there",
        "clue": "This sentence says that three paths exist. It does not say the paths belong to someone.",
        "different": {
          "theyre": "They're means they are. This sentence already has are.",
          "their": "Their points to something belonging to them. Here the sentence says that paths exist."
        },
        "referenceText": "There are three Ways between Willowbank and Vadoalto: the river path, the bridge road and the high ford.",
        "context": {
          "before": "",
          "after": " are three Ways between Willowbank and Vadoalto: the river path, the bridge road and the high ford."
        }
      },
      {
        "id": "ways",
        "label": "Three paths",
        "original": "Weighs",
        "choices": [
          {
            "id": "ways",
            "text": "Ways",
            "label": "Ways"
          },
          {
            "id": "ways-possessive",
            "text": "Way's",
            "label": "Way's"
          },
          {
            "id": "weighs",
            "text": "Weighs",
            "label": "Weighs (leave it)"
          }
        ],
        "key": "ways",
        "clue": "The writer is naming more than one path. Weighs is something a person does with scales.",
        "different": {
          "ways-possessive": "The apostrophe does not make the plural this sentence needs. The page names three Ways.",
          "weighs": "Weighs tells about finding a weight. Here the writer is naming paths."
        },
        "referenceText": "There are three Ways between Willowbank and Vadoalto: the river path, the bridge road and the high ford.",
        "context": {
          "before": "There are three ",
          "after": " between Willowbank and Vadoalto: the river path, the bridge road and the high ford."
        }
      },
      {
        "id": "road",
        "label": "The bridge path",
        "original": "rode",
        "choices": [
          {
            "id": "rowed",
            "text": "rowed",
            "label": "rowed"
          },
          {
            "id": "rode",
            "text": "rode",
            "label": "rode (leave it)"
          },
          {
            "id": "road",
            "text": "road",
            "label": "road"
          }
        ],
        "key": "road",
        "clue": "This names the path by the bridge. It does not tell about riding or rowing.",
        "different": {
          "rowed": "Rowed can tell about moving a boat with oars. Here the word names a path.",
          "rode": "Rode tells about earlier riding. Here the word names a path."
        },
        "referenceText": "There are three Ways between Willowbank and Vadoalto: the river path, the bridge road and the high ford.",
        "context": {
          "before": "There are three Ways between Willowbank and Vadoalto: the river path, the bridge ",
          "after": " and the high ford."
        }
      },
      {
        "id": "high",
        "label": "The ford",
        "original": "hi",
        "choices": [
          {
            "id": "hie",
            "text": "hie",
            "label": "hie"
          },
          {
            "id": "high",
            "text": "high",
            "label": "high"
          },
          {
            "id": "hi",
            "text": "hi",
            "label": "hi (leave it)"
          }
        ],
        "key": "high",
        "clue": "This says the ford is up high. Hi is a greeting; hie means to hurry.",
        "different": {
          "hie": "Hie means to hurry. This sentence says the ford is up high.",
          "hi": "Hi is a greeting. This sentence says the ford is up high."
        },
        "referenceText": "There are three Ways between Willowbank and Vadoalto: the river path, the bridge road and the high ford.",
        "context": {
          "before": "There are three Ways between Willowbank and Vadoalto: the river path, the bridge road and the ",
          "after": " ford."
        }
      },
      {
        "id": "need",
        "label": "Keeping paths open",
        "original": "knead",
        "choices": [
          {
            "id": "need",
            "text": "need",
            "label": "need"
          },
          {
            "id": "kneed",
            "text": "kneed",
            "label": "kneed"
          },
          {
            "id": "knead",
            "text": "knead",
            "label": "knead (leave it)"
          }
        ],
        "key": "need",
        "clue": "Someone may require the paths. Nobody is pressing and folding them like dough.",
        "different": {
          "kneed": "Kneed can mean struck with a knee. Here someone may require a path.",
          "knead": "Knead can mean press and fold dough. Here someone may require a path."
        },
        "referenceText": "Keep them open, even in winter, even when nobody seems to need them.",
        "context": {
          "before": "Keep them open, even in winter, even when nobody seems to ",
          "after": " them."
        }
      },
      {
        "id": "which",
        "label": "The water's ways",
        "original": "witch",
        "choices": [
          {
            "id": "wich",
            "text": "wich",
            "label": "wich"
          },
          {
            "id": "witch",
            "text": "witch",
            "label": "witch (leave it)"
          },
          {
            "id": "which",
            "text": "which",
            "label": "which"
          }
        ],
        "key": "which",
        "clue": "This word connects the water's ways to the explanation that follows. It does not name a witch.",
        "different": {
          "wich": "Here the connecting word is spelled which, with wh. Compare it with the page.",
          "witch": "A witch is a person in our story. This word connects the ways to their explanation."
        },
        "referenceText": "There are also the water's ways, which are where it goes when there is too much of it.",
        "context": {
          "before": "There are also the water's ways, ",
          "after": " are where it goes when there is too much of it."
        }
      },
      {
        "id": "where",
        "label": "Place for the water",
        "original": "wear",
        "choices": [
          {
            "id": "where",
            "text": "where",
            "label": "where"
          },
          {
            "id": "ware",
            "text": "ware",
            "label": "ware"
          },
          {
            "id": "wear",
            "text": "wear",
            "label": "wear (leave it)"
          }
        ],
        "key": "where",
        "clue": "This points to the place the water goes. Wear can mean having clothes on.",
        "different": {
          "ware": "Ware can name goods. Here the sentence points to a place.",
          "wear": "Wear can mean having clothes on. Here the sentence points to a place."
        },
        "referenceText": "There are also the water's ways, which are where it goes when there is too much of it.",
        "context": {
          "before": "There are also the water's ways, which are ",
          "after": " it goes when there is too much of it."
        }
      },
      {
        "id": "too",
        "label": "The amount of water",
        "original": "to",
        "choices": [
          {
            "id": "two",
            "text": "two",
            "label": "two"
          },
          {
            "id": "too",
            "text": "too",
            "label": "too"
          },
          {
            "id": "to",
            "text": "to",
            "label": "to (leave it)"
          }
        ],
        "key": "too",
        "clue": "This says there is more water than is wanted. It is not counting two things.",
        "different": {
          "two": "Two is a number. This sentence means more water than is wanted.",
          "to": "Here too much means more than is wanted. The page spells too with two o's."
        },
        "referenceText": "There are also the water's ways, which are where it goes when there is too much of it.",
        "context": {
          "before": "There are also the water's ways, which are where it goes when there is ",
          "after": " much of it."
        }
      }
    ]
  },
  "cards": [
    {
      "id": "copy-source-357",
      "title": "Check meaning, check the page",
      "text": "When you copy a page, keep what you can read. Check a spelling in its sentence. Leave an unreadable place marked [smudged] rather than guessing.",
      "example": "Paths, not scales",
      "steps": [
        "Read Pip's phrase: three Weighs.",
        "The sentence names paths between towns. Weighs tells about finding a weight.",
        "The page spells the path word Ways. Choose Ways in this version.",
        "The end of the page still has [smudged]. Keep that mark; we do not know the missing words."
      ]
    }
  ],
  "copy": {
    "title": "Copy the third page",
    "instruction": "Choose a spelling for this sentence. Tell your partner why it fits.",
    "referenceTitle": "The page to copy",
    "originalTitle": "Pip's first copy",
    "currentTitle": "This version",
    "fullReferenceTitle": "Read the whole third page",
    "fullCopyTitle": "Read this whole version",
    "storyTitle": "Pip checks his copy",
    "caption": "Hollis's third page: {title}",
    "partial": "Some of this earlier copy cannot be shown. The readable words are still open; the full earlier material stays in your notes.",
    "contextUnavailable": "This earlier word has no separate sentence view. Read it in the full copy.",
    "referenceUnavailable": "This earlier page reference cannot open here. Your copy is kept in your notes. The postcard and other jobs are still open.",
    "hiddenNote": "Earlier page-copy work is retained in the full notes download.",
    "childUnavailable": "This earlier page copy cannot open here. The postcard and other jobs are still open. The earlier material stays in your notes.",
    "incomplete": "Choose a form for each marked word, or keep this copy for later.",
    "different": "Some choices differ from the page. Read the word notes and compare.",
    "fit": "These choices fit the supplied sentence clues. Read the copy with your partner. You can keep it, or try another.",
    "partialFit": "These readable choices fit their supplied sentence clues. Some of the earlier copy is unavailable.",
    "neutral": "Read for the meaning this sentence needs.",
    "readCopy": "Read this copy with blanks",
    "readIntro": "Each marked word will be read as blank.",
    "readSource": "Read this source sentence",
    "adultLine": "Supplied reference, spelling choices and meaning clues. This does not show independent spelling, reading, copying or pronunciation.",
    "adultDetails": "The page and each source sentence are provided. The task never judges a spoken explanation. A kept version is not an edit to Hollis's page. Earlier choices and checks stay as they were.",
    "contextTitle": "This word in the page's sentence",
    "contextNote": "The other words here come from the page. Your whole version keeps your choices.",
    "kept": "This version is kept.",
    "reopened": "This version is open to revise.",
    "newUseTitle": "A new errand for Pip",
    "newUsePrompt": "Tell Pip where to put a boat. Then tell him what to wear on a rainy walk. Your partner can write your words on paper. These words stay between you.",
    "newUseContrast": "Where points to a place. Wear can mean having clothes on. The words may sound alike; the sentence tells you which meaning you need.",
    "returnPrompt": "Choose another word, revisit a kept version, or return to the postcard.",
    "adultNote": "Some speakers distinguish which and witch, or where and wear. Model your natural speech; sound alone is not this task's check. The displayed reference supplies spellings. A child can match print without explaining meaning. Ask, listen and discuss; the app does not judge that explanation. The bracketed smudge marks missing writing, not a spelling to fix."
  },
  "jobs": []
});
export function makePipsPageThreeSource(){
 const result=clone(pageThreeMaterial);
 result.reference={title:actThreeContent.page.title,paragraphs:clone(actThreeContent.page.original)};
 const original=result.reference.paragraphs.join('\n\n'),segments=[];let at=0;
 for(const slot of result.postcard.slots){
  const word=slot.choices.find(c=>c.id===slot.key).text,index=original.indexOf(word,at);
  if(index<0)throw new Error('The authored page-copy slots no longer match the current page.');
  segments.push({text:original.slice(at,index)},{slotId:slot.id});at=index+word.length;
 }
 segments.push({text:original.slice(at)});result.postcard.segments=segments;
 return result;
}
