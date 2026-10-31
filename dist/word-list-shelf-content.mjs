// Spec336: original project-owned word-study cards. No learner data or audio assets.
function freeze(value) {
 if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
 return value;
}
const source = freeze({
  "v": 1,
  "id": "word-list-shelf-1",
  "title": "The Word List Shelf",
  "copy": {
    "title": "The Word List Shelf",
    "instruction": "Pick a word. Read its clue. Choose a tray that helps you remember its spelling.",
    "footer": "Rules usually work. A dictionary has the last word.",
    "listed": "This matches a printed clue.",
    "discuss": "That clue is not printed on this card. You may have noticed something else. Explain it together, or compare the printed clues. Your placement can stay.",
    "unplaced": "This word is still on the table.",
    "incomplete": "Some words are still on the table. You can keep this shelf or carry on.",
    "discussion": "Some placements have a different idea to discuss. You can keep them or change them.",
    "listedSummary": "All placed cards match printed clues.",
    "partialIncomplete": "Some readable words are still on the table. Earlier unreadable cards stay in your notes.",
    "partialDiscussion": "Some readable placements have a different idea to discuss. Earlier unreadable cards stay in your notes.",
    "partialListed": "The readable placements match printed clues. Earlier unreadable cards stay in your notes.",
    "kept": "This shelf is kept. You can keep exploring and change it later.",
    "partial": "Some earlier cards cannot be used here. Their saved work is retained in your notes.",
    "contextUnavailable": "This card's sentence cannot be shown here. Its readable word and clues are still available.",
    "unavailable": "This saved shelf cannot be edited here. Its work is still in your notes. Other activities remain open.",
    "refused": "This change could not be kept safely. Your earlier work is unchanged. Open your notes to keep a copy.",
    "jobIncomplete": "Choose a spelling first. You can also leave this job for later.",
    "jobKept": "This job is kept. You can return and try again.",
    "neutral": "Compare the letters with this job's clue.",
    "stamp": "A clue worth keeping.",
    "shelf": "Sort the shelf",
    "jobs": "Try a job",
    "previous": "Previous word",
    "next": "Next word",
    "picker": "Choose a word",
    "clear": "Put back",
    "overview": "See my shelf",
    "check": "Check my clues",
    "keep": "Keep this shelf",
    "first": "First kept",
    "latest": "Latest kept",
    "reopen": "Use these placements",
    "readStory": "Read the short story",
    "readSentence": "Read this sentence",
    "readInstruction": "Read the instruction",
    "readPrompt": "Read this question",
    "contrast": "Compare two words",
    "example": "Show an example",
    "step": "Next step",
    "stepBack": "Previous step",
    "hint": "Hint",
    "jobCheck": "Check",
    "jobKeep": "Keep this job",
    "skip": "Skip",
    "notes": "Grown-up notes",
    "jobReopen": "Use this kept choice"
  },
  "story": {
    "short": "The town is writing new notices. The librarian has gathered words that can trip a writer up. Find a clue worth keeping beside each word.",
    "longer": "Rain left the old noticeboard blank. Now there are invitations, boat timetables and plans for the garden. “A useful spelling clue is a little tool,” says the librarian. “Some words can use more than one. Let's give each word a place, and change our minds whenever we want.”"
  },
  "contrast": "Embarrass has two r's. Harass has one. Both have two s's. Harass means to keep bothering someone; embarrass can mean to make someone feel awkward. Different words need different clues.",
  "example": {
    "title": "More than one useful clue",
    "steps": [
      "Look at sufficient: it has ff.",
      "It also ends in -cient.",
      "It also has ie. “Double letters”, “These endings” and “ie or ei” can all help. Choose one."
    ]
  },
  "invitation": "Pick a tricky word. With a grown-up, make up a silly sentence or picture to help you remember it. We won't record it.",
  "trays": [
    {
      "id": "double",
      "label": "Double letters",
      "description": "Look for two matching letters side by side."
    },
    {
      "id": "quiet",
      "label": "Quiet letters",
      "description": "Notice a written letter that adds no separate sound here."
    },
    {
      "id": "family",
      "label": "Family word",
      "description": "Compare the letters with the family word on the card."
    },
    {
      "id": "ending",
      "label": "These endings",
      "description": "Look for -cious, -cient, -ant, -ence or -able."
    },
    {
      "id": "ie",
      "label": "ie or ei",
      "description": "Look closely at the order of i and e."
    }
  ],
  "words": [
    {
      "id": "accommodate",
      "text": "accommodate",
      "sentence": "The hall can accommodate our guests.",
      "clues": [
        {
          "trayId": "double",
          "note": "Accommodate has cc and mm."
        }
      ]
    },
    {
      "id": "committee",
      "text": "committee",
      "sentence": "The committee will plan the new noticeboard.",
      "clues": [
        {
          "trayId": "double",
          "note": "Committee has mm, tt and ee."
        }
      ]
    },
    {
      "id": "embarrass",
      "text": "embarrass",
      "sentence": "We do not want to embarrass a nervous speaker.",
      "clues": [
        {
          "trayId": "double",
          "note": "Embarrass has rr and ss."
        }
      ]
    },
    {
      "id": "necessary",
      "text": "necessary",
      "sentence": "Warm coats are necessary on the boat.",
      "clues": [
        {
          "trayId": "double",
          "note": "Necessary has one c and two s's."
        }
      ]
    },
    {
      "id": "recommend",
      "text": "recommend",
      "sentence": "We recommend the riverside path.",
      "clues": [
        {
          "trayId": "double",
          "note": "Recommend has one c and two m's."
        }
      ]
    },
    {
      "id": "muscle",
      "text": "muscle",
      "sentence": "Lifting the crate takes muscle.",
      "clues": [
        {
          "trayId": "quiet",
          "note": "The c adds no separate sound in muscle."
        },
        {
          "trayId": "family",
          "note": "Compare muscle with muscular: both keep c."
        }
      ]
    },
    {
      "id": "yacht",
      "text": "yacht",
      "sentence": "The yacht is moored beside the ferry.",
      "clues": [
        {
          "trayId": "quiet",
          "note": "The ch is written but not said in yacht."
        }
      ]
    },
    {
      "id": "rhythm",
      "text": "rhythm",
      "sentence": "Tap a gentle rhythm before the song.",
      "clues": [
        {
          "trayId": "quiet",
          "note": "Rhythm starts rh; the h adds no separate sound."
        }
      ]
    },
    {
      "id": "foreign",
      "text": "foreign",
      "sentence": "Visitors brought books in foreign languages.",
      "clues": [
        {
          "trayId": "quiet",
          "note": "The g is not said in foreign."
        },
        {
          "trayId": "ie",
          "note": "Foreign has ei, not ie."
        }
      ]
    },
    {
      "id": "definite",
      "text": "definite",
      "sentence": "We need a definite time for the meeting.",
      "clues": [
        {
          "trayId": "family",
          "note": "Compare definite with definition: both keep i after n."
        }
      ]
    },
    {
      "id": "desperate",
      "text": "desperate",
      "sentence": "The damaged garden was in desperate need of rain.",
      "clues": [
        {
          "trayId": "family",
          "note": "Compare desperate with desperation: both keep e after p."
        }
      ]
    },
    {
      "id": "familiar",
      "text": "familiar",
      "sentence": "A familiar tune welcomes the ferry home.",
      "clues": [
        {
          "trayId": "family",
          "note": "Compare familiar with family: both begin famil."
        }
      ]
    },
    {
      "id": "conscious",
      "text": "conscious",
      "sentence": "We are conscious of the sleeping animals.",
      "clues": [
        {
          "trayId": "ending",
          "note": "Conscious ends in -cious."
        }
      ]
    },
    {
      "id": "sufficient",
      "text": "sufficient",
      "sentence": "We have sufficient paper for the notices.",
      "clues": [
        {
          "trayId": "double",
          "note": "Sufficient has ff."
        },
        {
          "trayId": "ending",
          "note": "Sufficient ends in -cient."
        },
        {
          "trayId": "ie",
          "note": "Sufficient has ie, not ei."
        }
      ]
    },
    {
      "id": "relevant",
      "text": "relevant",
      "sentence": "Add only details relevant to the trip.",
      "clues": [
        {
          "trayId": "ending",
          "note": "Relevant ends in -ant."
        }
      ]
    },
    {
      "id": "existence",
      "text": "existence",
      "sentence": "The old map shows the bridge's existence.",
      "clues": [
        {
          "trayId": "ending",
          "note": "Existence ends in -ence."
        }
      ]
    },
    {
      "id": "available",
      "text": "available",
      "sentence": "Blank cards are available at the desk.",
      "clues": [
        {
          "trayId": "ending",
          "note": "Available ends in -able."
        }
      ]
    },
    {
      "id": "achieve",
      "text": "achieve",
      "sentence": "Together we can achieve our plan.",
      "clues": [
        {
          "trayId": "ie",
          "note": "Achieve has ie, not ei."
        }
      ]
    },
    {
      "id": "mischievous",
      "text": "mischievous",
      "sentence": "A mischievous kitten hid the string.",
      "clues": [
        {
          "trayId": "ie",
          "note": "Mischievous has ie, not ei."
        }
      ]
    },
    {
      "id": "leisure",
      "text": "leisure",
      "sentence": "Leave time for leisure after the work.",
      "clues": [
        {
          "trayId": "ie",
          "note": "Leisure has ei, not ie."
        }
      ]
    }
  ],
  "jobs": [
    {
      "v": 1,
      "id": "e1",
      "kind": "choice",
      "title": "Room for our guests",
      "prompt": "Which spelling completes “The hall can ___ our guests”?",
      "hint": "Two c's and two m's.",
      "example": "A committee card",
      "explanation": "Accommodate has double c and double m.",
      "steps": [
        "Find the double letters.",
        "Two c's.",
        "Two m's."
      ],
      "teach": [
        {
          "id": "e1-example",
          "title": "A committee card",
          "text": "Double letters can hide inside a long word.",
          "example": "A committee card",
          "steps": [
            "Committee starts com.",
            "Keep the second m: comm.",
            "It also keeps tt and ee: committee."
          ]
        }
      ],
      "parts": [],
      "choices": [
        {
          "id": "a",
          "text": "accomodate"
        },
        {
          "id": "b",
          "text": "accommodate"
        },
        {
          "id": "c",
          "text": "accommadate"
        }
      ],
      "key": "b",
      "different": {
        "a": "This spelling needs two m's: accommodate.",
        "c": "Keep o after the double m: accommodate."
      },
      "copy": {
        "incomplete": "Choose a spelling first. You can also leave this job for later.",
        "partDifferent": "Compare the letters with this job's clue."
      }
    },
    {
      "v": 1,
      "id": "e2",
      "kind": "choice",
      "title": "A definite plan",
      "prompt": "Definition is in its family. Which spelling completes “We need a ___ plan”?",
      "hint": "Compare the letters in definition.",
      "example": "Familiar and family",
      "explanation": "The family word definition can help you remember the i letters in definite.",
      "steps": [],
      "teach": [
        {
          "id": "e2-example",
          "title": "Familiar and family",
          "text": "A family word can help you remember shared letters.",
          "example": "Familiar and family",
          "steps": [
            "Look at family.",
            "Keep its first five letters: famil.",
            "Familiar begins with the same letters: familiar."
          ]
        }
      ],
      "parts": [],
      "choices": [
        {
          "id": "a",
          "text": "definite"
        },
        {
          "id": "b",
          "text": "definate"
        },
        {
          "id": "c",
          "text": "defenite"
        }
      ],
      "key": "a",
      "different": {
        "b": "Definition keeps i after n. Definite does too.",
        "c": "Definition begins defi. Definite does too."
      },
      "copy": {
        "incomplete": "Choose a spelling first. You can also leave this job for later.",
        "partDifferent": "Compare the letters with this job's clue."
      }
    },
    {
      "v": 1,
      "id": "e3",
      "kind": "choice",
      "title": "The quiet letters",
      "prompt": "Which word has a written consonant with no sound of its own here?",
      "hint": "Say yacht with a grown-up. Its ch is not said.",
      "example": "Foreign on a card",
      "explanation": "Yacht keeps the letters ch, although they are not said here.",
      "steps": [],
      "teach": [
        {
          "id": "e3-example",
          "title": "Foreign on a card",
          "text": "Some written letters have no sound of their own in a word.",
          "example": "Foreign on a card",
          "steps": [
            "Read foreign with a grown-up.",
            "The g is written but not said.",
            "Keep the g when writing foreign."
          ]
        }
      ],
      "parts": [],
      "choices": [
        {
          "id": "a",
          "text": "average"
        },
        {
          "id": "b",
          "text": "category"
        },
        {
          "id": "c",
          "text": "yacht"
        }
      ],
      "key": "c",
      "different": {
        "a": "Average does not have yacht's quiet ch. Compare the written letters in yacht.",
        "b": "Category does not have yacht's quiet ch. Compare the written letters in yacht."
      },
      "copy": {
        "incomplete": "Choose a spelling first. You can also leave this job for later.",
        "partDifferent": "Compare the letters with this job's clue."
      }
    }
  ]
});
export const wordListShelfCopy = source.copy;
export function makeWordListShelfSource() { return structuredClone(source); }
