// Original project-owned268 selection, amended by the reviewed330 finite commission.
// No learner data, response narration, dictionary prose or sound assets.
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
  "id": "stained-map-1",
  "story": {
    "before": {
      "arrival": [
        "The library has a new table by the window. On it: a big map of the valley, a pot of pencils and a dictionary as thick as a loaf.",
        "\"Spelling,\" says the librarian, \"is where old words keep their luggage.\""
      ],
      "hook": "Nuria asked what the valley looks like. The librarian draws a map of the valley to send her. Some labels get stained.",
      "short": [
        "The librarian draws a map of the valley for Nuria. Water has stained some labels. The missing letters are ones you can't hear."
      ],
      "longer": [
        "The librarian draws a map of the valley on thin paper, label by label. \"Nuria asked what our valley looks like,\" they say. \"So she gets the whole thing.\" Then the teapot tips over.",
        "Some labels have stains. Hi▢▢ Ford. ▢noll Wood. The I▢land.",
        "Pip squints. \"The water took the letters nobody says. That's suspicious.\"",
        "\"Those letters were spoken once,\" says {guide}. \"Long ago, people said the k in knoll.\"",
        "\"Not all of them,\" says Bramble, leaning in the doorway. \"My grandmother said someone just stuck the s into island.\"",
        "The librarian opens the thick dictionary. They read for a while.",
        "\"She's right,\" they say. \"Island's s came later. Writers added it to the spelling.\"",
        "Bramble looks very pleased. Her magpie looks pleased too, on principle."
      ]
    },
    "after": {
      "arrival": [
        "The library has a new table by the window. On it: a big tracing of the old map, a pot of pencils and a dictionary as thick as a loaf.",
        "\"Spelling,\" says the librarian, \"is where old words keep their luggage.\""
      ],
      "hook": "Nuria asked what the valley looked like long ago. The librarian traces the old Keeper's map to send her. Some labels are stained.",
      "short": [
        "The librarian traces the old map for Nuria. Water has stained some labels. The missing letters are ones you can't hear."
      ],
      "longer": [
        "The librarian copies the old Keeper's map onto thin paper, label by label. \"Nuria asked what our valley looked like before,\" they say. \"So she gets the whole thing.\"",
        "Some labels have stains. Hi▢▢ Ford. ▢noll Wood. The I▢land.",
        "Pip squints. \"The water took the letters nobody says. That's suspicious.\"",
        "\"Those letters were spoken once,\" says {guide}. \"Long ago, people said the k in knoll.\"",
        "\"Not all of them,\" says Bramble, leaning in the doorway. \"My grandmother said someone just stuck the s into island.\"",
        "The librarian opens the thick dictionary. They read for a while.",
        "\"She's right,\" they say. \"Island's s came later. Writers added it to the spelling.\"",
        "Bramble looks very pleased. Her magpie looks pleased too, on principle."
      ],
      "caption": "The librarian wrote these place-name labels on their copy."
    },
    "note": "Island was once written iland. Later, its spelling picked up an s from isle. The two words have different histories."
  },
  "cards": [
    {
      "id": "card-1",
      "title": "Silent letters",
      "text": "A silent letter is written but not said. In knoll, the k is silent. You have to remember it, because you can't hear it.",
      "example": "▢noll Wood on the map.",
      "steps": [
        "Say knoll. You hear n first.",
        "The note says: Once written cnoll. Its first sound, now spelled k, was said.",
        "Restore the k: Knoll Wood."
      ]
    },
    {
      "id": "card-2",
      "title": "Some silent letters were once said",
      "text": "Long ago, people said the k in knife, the w in write, the g in gnaw and the b in lamb. The sound left. The letter stayed.",
      "example": "Gnat Corner.",
      "steps": [
        "The note says: people once said the g in gnat.",
        "Speech changed. Spelling didn't.",
        "So the g stays: Gnat Corner."
      ]
    },
    {
      "id": "card-3",
      "title": "Some were added by writers",
      "text": "Some silent letters were added by writers to look like another word. Island, debt and doubt got letters this way.",
      "example": "Debt.",
      "steps": [
        "Old spelling: dette, no b.",
        "Writers added b to match the Latin word debitum.",
        "People kept saying det, with no b."
      ]
    },
    {
      "id": "card-4",
      "title": "Hear it in the family",
      "text": "A silent letter is often heard in a family word. In sign, the g is silent, but signal says it. In muscle, the c is silent, but muscular says it.",
      "example": "Bomb.",
      "steps": [
        "Find a family word: bombard.",
        "Say bombard. You hear the b.",
        "So bomb keeps its b."
      ]
    }
  ],
  "labels": [
    {
      "id": "high",
      "before": "Hi",
      "after": " Ford",
      "stains": 2,
      "complete": "High Ford",
      "capitalStart": false,
      "note": "Once said, like the end of Scottish loch.",
      "key": "gh"
    },
    {
      "id": "knoll",
      "before": "",
      "after": "noll Wood",
      "stains": 1,
      "complete": "Knoll Wood",
      "capitalStart": true,
      "note": "Once written cnoll. Its first sound, now spelled k, was said.",
      "key": "k"
    },
    {
      "id": "writing",
      "before": "The ",
      "after": "riting Stone",
      "stains": 1,
      "complete": "The Writing Stone",
      "capitalStart": true,
      "note": "People once said the w in write.",
      "key": "w"
    },
    {
      "id": "gnat",
      "before": "",
      "after": "nat Corner",
      "stains": 1,
      "complete": "Gnat Corner",
      "capitalStart": true,
      "note": "People once said the g in gnat.",
      "key": "g"
    },
    {
      "id": "lamb",
      "before": "Lam",
      "after": " Fold",
      "stains": 1,
      "complete": "Lamb Fold",
      "capitalStart": false,
      "note": "People once said the b in lamb.",
      "key": "b"
    },
    {
      "id": "thistle",
      "before": "This",
      "after": "le Bank",
      "stains": 1,
      "complete": "Thistle Bank",
      "capitalStart": false,
      "note": "A silent t, as in castle and listen.",
      "key": "t"
    },
    {
      "id": "island",
      "before": "The I",
      "after": "land",
      "stains": 1,
      "complete": "The Island",
      "capitalStart": false,
      "note": "Once written iland. Writers added the s.",
      "key": "s"
    },
    {
      "id": "sponge",
      "before": "The Sponge",
      "after": "",
      "stains": 0,
      "complete": "The Sponge",
      "capitalStart": false,
      "note": "No stain here. No letters were stained out or lost.",
      "key": "none"
    }
  ],
  "tiles": [
    {
      "id": "gh",
      "text": "gh",
      "kind": "letters"
    },
    {
      "id": "k",
      "text": "k",
      "kind": "letters"
    },
    {
      "id": "w",
      "text": "w",
      "kind": "letters"
    },
    {
      "id": "g",
      "text": "g",
      "kind": "letters"
    },
    {
      "id": "b",
      "text": "b",
      "kind": "letters"
    },
    {
      "id": "t",
      "text": "t",
      "kind": "letters"
    },
    {
      "id": "s",
      "text": "s",
      "kind": "letters"
    },
    {
      "id": "none",
      "text": "nothing missing",
      "kind": "none"
    }
  ],
  "histories": [
    {
      "id": "knoll",
      "word": "knoll",
      "note": "Once written cnoll. Its first sound, now spelled k, was said.",
      "key": "once"
    },
    {
      "id": "write",
      "word": "write",
      "note": "People once said the w in write.",
      "key": "once"
    },
    {
      "id": "gnat",
      "word": "gnat",
      "note": "People once said the g in gnat.",
      "key": "once"
    },
    {
      "id": "lamb",
      "word": "lamb",
      "note": "People once said the b in lamb.",
      "key": "once"
    },
    {
      "id": "high",
      "word": "high",
      "note": "Once said, like the end of Scottish loch.",
      "key": "once"
    },
    {
      "id": "island",
      "word": "island",
      "note": "Once written iland. Writers added the s.",
      "key": "added"
    },
    {
      "id": "debt",
      "word": "debt",
      "note": "Once written dette. Writers added the b.",
      "key": "added"
    },
    {
      "id": "doubt",
      "word": "doubt",
      "note": "Once written doute. Writers added the b.",
      "key": "added"
    }
  ],
  "historyPlaces": [
    {
      "id": "once",
      "text": "Once said"
    },
    {
      "id": "added",
      "text": "Added by writers"
    }
  ],
  "families": [
    {
      "id": "sign",
      "word": "sign",
      "letter": "g",
      "key": "signal"
    },
    {
      "id": "muscle",
      "word": "muscle",
      "letter": "c",
      "key": "muscular"
    },
    {
      "id": "bomb",
      "word": "bomb",
      "letter": "b",
      "key": "bombard"
    },
    {
      "id": "solemn",
      "word": "solemn",
      "letter": "n",
      "key": "solemnity"
    },
    {
      "id": "autumn",
      "word": "autumn",
      "letter": "n",
      "key": "autumnal"
    },
    {
      "id": "doubt",
      "word": "doubt",
      "letter": "b",
      "key": "dubious"
    },
    {
      "id": "debt",
      "word": "debt",
      "letter": "b",
      "key": "debit"
    }
  ],
  "familyWords": [
    {
      "id": "signal",
      "text": "signal"
    },
    {
      "id": "muscular",
      "text": "muscular"
    },
    {
      "id": "bombard",
      "text": "bombard"
    },
    {
      "id": "solemnity",
      "text": "solemnity"
    },
    {
      "id": "autumnal",
      "text": "autumnal"
    },
    {
      "id": "dubious",
      "text": "dubious"
    },
    {
      "id": "debit",
      "text": "debit"
    }
  ],
  "jobs": [
    {
      "v": 1,
      "id": "a1",
      "kind": "choice",
      "title": "A1",
      "prompt": "The stain hides two letters: Hi▢▢ Ford. Which two?",
      "hint": "Night and light end the same way.",
      "example": "▢noll Wood on the map.",
      "explanation": "High keeps gh. It was once a sound, like the end of loch.",
      "steps": [
        "The stain hides two letters.",
        "Say high.",
        "Which two letters aren't heard?"
      ],
      "teach": [
        {
          "id": "card-1",
          "title": "Silent letters",
          "text": "A silent letter is written but not said. In knoll, the k is silent. You have to remember it, because you can't hear it.",
          "example": "▢noll Wood on the map.",
          "steps": [
            "Say knoll. You hear n first.",
            "The note says: Once written cnoll. Its first sound, now spelled k, was said.",
            "Restore the k: Knoll Wood."
          ]
        }
      ],
      "parts": [],
      "choices": [
        {
          "id": "gh",
          "text": "gh"
        },
        {
          "id": "ge",
          "text": "ge"
        },
        {
          "id": "none",
          "text": "No letters: it says Hi Ford"
        }
      ],
      "key": "gh",
      "different": {
        "ge": "High ends like night and light. Which two letters do they share?",
        "none": "The stain hides two letters. Something is missing."
      }
    },
    {
      "v": 1,
      "id": "a2",
      "kind": "match",
      "title": "A2",
      "prompt": "Sort by the note on each card: once said, or added by writers.",
      "hint": "Does the note describe an old sound, or an added letter?",
      "example": "Debt.",
      "explanation": "Some silent letters were once said. Others were added by writers.",
      "steps": [],
      "teach": [
        {
          "id": "card-3",
          "title": "Some were added by writers",
          "text": "Some silent letters were added by writers to look like another word. Island, debt and doubt got letters this way.",
          "example": "Debt.",
          "steps": [
            "Old spelling: dette, no b.",
            "Writers added b to match the Latin word debitum.",
            "People kept saying det, with no b."
          ]
        }
      ],
      "parts": [
        {
          "id": "knife",
          "text": "knife (people once said the k)"
        },
        {
          "id": "write",
          "text": "write (people once said the w)"
        },
        {
          "id": "island",
          "text": "island (once written iland)"
        },
        {
          "id": "debt",
          "text": "debt (once written dette)"
        }
      ],
      "choices": [
        {
          "id": "once",
          "text": "Once said"
        },
        {
          "id": "added",
          "text": "Added by writers"
        }
      ],
      "key": {
        "knife": "once",
        "write": "once",
        "island": "added",
        "debt": "added"
      },
      "different": {
        "island": "Iland had no s. Writers added that letter later."
      }
    },
    {
      "v": 1,
      "id": "a3",
      "kind": "choice",
      "title": "A3",
      "prompt": "Which word's note says writers added a letter?",
      "hint": "Find the note with no letter in the old spelling.",
      "example": "Debt.",
      "explanation": "Island was once written iland. Its s was added later.",
      "steps": [],
      "teach": [
        {
          "id": "card-3",
          "title": "Some were added by writers",
          "text": "Some silent letters were added by writers to look like another word. Island, debt and doubt got letters this way.",
          "example": "Debt.",
          "steps": [
            "Old spelling: dette, no b.",
            "Writers added b to match the Latin word debitum.",
            "People kept saying det, with no b."
          ]
        }
      ],
      "parts": [
        {
          "id": "knight",
          "text": "knight: k once said"
        },
        {
          "id": "island",
          "text": "Island: once written iland; writers added the s later."
        },
        {
          "id": "lamb",
          "text": "lamb: b once said"
        }
      ],
      "choices": [
        {
          "id": "knight",
          "text": "knight"
        },
        {
          "id": "island",
          "text": "island"
        },
        {
          "id": "lamb",
          "text": "lamb"
        }
      ],
      "key": "island",
      "different": {
        "knight": "Its note says people once said the k.",
        "lamb": "Its note says people once said the b."
      }
    },
    {
      "v": 1,
      "id": "a4",
      "kind": "choice",
      "title": "A4",
      "prompt": "Which word lets you hear the g of sign?",
      "hint": "Say each one. Where do you hear a g?",
      "example": "Bomb.",
      "explanation": "Signal says the g. That's a clue to spell sign.",
      "steps": [],
      "teach": [
        {
          "id": "card-4",
          "title": "Hear it in the family",
          "text": "A silent letter is often heard in a family word. In sign, the g is silent, but signal says it. In muscle, the c is silent, but muscular says it.",
          "example": "Bomb.",
          "steps": [
            "Find a family word: bombard.",
            "Say bombard. You hear the b.",
            "So bomb keeps its b."
          ]
        }
      ],
      "parts": [],
      "choices": [
        {
          "id": "singer",
          "text": "singer"
        },
        {
          "id": "signing",
          "text": "signing"
        },
        {
          "id": "signal",
          "text": "signal"
        }
      ],
      "key": "signal",
      "different": {
        "singer": "Singer is about songs. It isn't in sign's family.",
        "signing": "Signing is family, but its g is silent too."
      }
    },
    {
      "v": 1,
      "id": "a5",
      "kind": "match",
      "title": "A5",
      "prompt": "Read each and choose True or Not true.",
      "hint": "Think of the three kinds: once said, added, heard in the family.",
      "example": "Debt.",
      "explanation": "Silent letters have different stories. Each story can help you remember.",
      "steps": [],
      "teach": [
        {
          "id": "card-3",
          "title": "Some were added by writers",
          "text": "Some silent letters were added by writers to look like another word. Island, debt and doubt got letters this way.",
          "example": "Debt.",
          "steps": [
            "Old spelling: dette, no b.",
            "Writers added b to match the Latin word debitum.",
            "People kept saying det, with no b."
          ]
        }
      ],
      "parts": [
        {
          "id": "statement-1",
          "text": "Every silent letter stayed after a spoken sound disappeared."
        },
        {
          "id": "statement-2",
          "text": "Writers added the b in debt."
        },
        {
          "id": "statement-3",
          "text": "You can hear the c of muscle in muscular."
        }
      ],
      "choices": [
        {
          "id": "true",
          "text": "True"
        },
        {
          "id": "false",
          "text": "Not true"
        }
      ],
      "key": {
        "statement-1": "false",
        "statement-2": "true",
        "statement-3": "true"
      },
      "different": {
        "statement-1": "The s in island was added to the spelling."
      }
    }
  ],
  "copy": {
    "placeTitle": "The Old Keeper's Spellings",
    "title": "The Stained Map",
    "fiction": "A story from Willowbank",
    "fact": "A true thing about language",
    "reminder": "Rules usually work. A dictionary has the last word.",
    "mapTitle": "Restore the map",
    "historiesTitle": "Read the word histories",
    "familiesTitle": "Find a family clue",
    "practiceTitle": "Try a job",
    "mapInstruction": "The water took some letters from the map. Restore each label. Then sort the silent letters.",
    "historyInstruction": "Sort by the note on each card: Once said or Added by writers",
    "familyInstruction": "Tap the family word that says the silent letter.",
    "mapPicker": "Choose a place name",
    "historyPicker": "Choose a word-history card",
    "familyPicker": "Choose a family clue",
    "unselected": "Not chosen yet",
    "chosen": "Chosen: {tile}",
    "putBack": "Put back",
    "check": "Check this version",
    "keep": "Keep this version",
    "chooseTable": "Choose another table",
    "next": "Next",
    "previous": "Previous",
    "firstKept": "First kept",
    "latestKept": "Latest kept",
    "inspectSnapshot": "Read this kept version",
    "restoreSnapshot": "Work from this version",
    "snapshotCopied": "Your working copy is ready. The kept versions are unchanged.",
    "incomplete": "There are still places to try. You can keep this version and come back.",
    "mapFitOne": "Restored. That letter is written, not said.",
    "mapFitTwo": "Restored. Those letters are written, not said.",
    "mapMissingOne": "The stain hides a letter. Which one isn't heard?",
    "mapMissingTwo": "The stain hides two letters. Which ones aren't heard?",
    "mapDifferent": "Check the written note. Which letters belong in this name?",
    "mapNoneFit": "The Sponge is complete. Nothing was missing.",
    "mapNoneDifferent": "Nothing is missing here. No letters were stained out or lost.",
    "mapComplete": "The labels are ready to travel.",
    "historyDifferent": "Look at the note on this card. Which history does it describe?",
    "familyDifferent": "Read the family note, then try another pair.",
    "familyNote": "Read the family note",
    "mappingComplete": "These cards fit their notes.",
    "partDifferent": "Have another look at this one.",
    "spokenOneStain": "one stained letter",
    "spokenTwoStains": "two stained letters",
    "unchecked": "This version has not been checked.",
    "earlierCheck": "That check belongs to an earlier version.",
    "kept": "This version is kept. You can change your working copy.",
    "hint": "A hint",
    "example": "Show an example",
    "nextStep": "Show the next step",
    "skip": "Skip for now",
    "unsupportedRecord": "This earlier work cannot be read here. It stays in your notes. Other tables are open.",
    "unsupportedNotebook": "This spelling notebook uses a format this version cannot read. Download your notes to keep it. Other places are open.",
    "preflightRefusal": "This change could not be kept. Your work is unchanged. Download your notes.",
    "unavailableSelection": "This part of the earlier table is not available here. Its original work stays in your notes.",
    "notes": "Download your notes",
    "wordGarden": "Back to Word Garden",
    "marketSigns": "Visit Market Signs",
    "readAloud": "Read this aloud",
    "adultLine": "The Stained Map keeps supplied spelling work, including unfinished versions. Written notes and offered choices make these supported activities; a fit is not evidence of independent spelling or historical knowledge.",
    "adultDetails": "Earlier checks and first/latest kept work belong to their own saved words and choices. Help flags describe later hint or example requests. Local narration records no listening or spoken response. A grown-up can read the ordinary words together. This activity records no pronunciation, microphone input, age or learner name. A word-family clue does not mean every related word pronounces the letter."
  }
});

export const stainedMapCopy = source.copy;
export function makeStainedMapSource() { return clone(source); }
