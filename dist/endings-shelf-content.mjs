// Original project-owned268 selection, amended by the reviewed331 finite commission.
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
  "id": "endings-shelf-1",
  "story": {
    "hook": "The librarian writes to the library in Vadoalto. Long words, careful endings. Dot will not let it go out with a slip.",
    "short": [
      "The librarian writes a letter full of long words. You check the endings before Dot puts it in the post bag."
    ],
    "longer": [
      "\"Dear friends upstream,\" the librarian reads aloud. \"We have a precious map of our valley. It is not official, but it is essential to us.\"",
      "Dot lands on the letter. \"Endings first. Then the post bag.\"",
      "\"Every ending?\" says Pip.",
      "\"Every one. Each long word needs the ending the dictionary has.\"",
      "\"It's possible,\" says the librarian, \"that I preferred to write quickly.\"",
      "Dot gives them a look over her hat. The letter goes back on the table."
    ]
  },
  "letter": {
    "id": "letter-1",
    "segments": [
      {
        "text": "Dear friends upstream,\n\nWe have a "
      },
      {
        "gapId": "precious"
      },
      {
        "text": " map of our valley. It is not "
      },
      {
        "gapId": "official"
      },
      {
        "text": ", but it is "
      },
      {
        "gapId": "essential"
      },
      {
        "text": " to us. A "
      },
      {
        "gapId": "significant"
      },
      {
        "text": " part of it shows a marsh. Is it "
      },
      {
        "gapId": "possible"
      },
      {
        "text": " that you have a map like it? We would be grateful. We are being "
      },
      {
        "gapId": "cautious"
      },
      {
        "text": " with ours, and very "
      },
      {
        "gapId": "comfortable"
      },
      {
        "text": " with long letters.\n\nThe Willowbank librarian"
      }
    ],
    "gaps": [
      {
        "id": "precious",
        "prefix": "pre",
        "complete": "precious",
        "trayId": "cious-tious",
        "key": "cious",
        "note": "Precious is one to learn by heart.",
        "different": "Precious is one to learn by heart."
      },
      {
        "id": "official",
        "prefix": "offi",
        "complete": "official",
        "trayId": "cial-tial",
        "key": "cial",
        "note": "Office ends in -ce, and i before the ending is a vowel letter.",
        "different": "Office ends in -ce, and i before the ending is a vowel letter."
      },
      {
        "id": "essential",
        "prefix": "essen",
        "complete": "essential",
        "trayId": "cial-tial",
        "key": "tial",
        "note": "The letter before the ending is n, a consonant letter. After a consonant letter, -tial is common.",
        "different": "The letter before the ending is n, a consonant letter. After a consonant letter, -tial is common."
      },
      {
        "id": "significant",
        "prefix": "signific",
        "complete": "significant",
        "trayId": "ant-ent",
        "key": "ant",
        "note": "Here the c is hard, like cat. Significant ends in -ant.",
        "different": "Here the c is hard, like cat. Significant ends in -ant."
      },
      {
        "id": "possible",
        "prefix": "poss",
        "complete": "possible",
        "trayId": "able-ible",
        "key": "ible",
        "note": "Possible is one of the -ible words to remember.",
        "different": "Possible is one of the -ible words to remember."
      },
      {
        "id": "cautious",
        "prefix": "cau",
        "complete": "cautious",
        "trayId": "cious-tious",
        "key": "tious",
        "note": "Caution is in the family, so -tious is likely.",
        "different": "Caution is in the family, so -tious is likely."
      },
      {
        "id": "comfortable",
        "prefix": "comfort",
        "complete": "comfortable",
        "trayId": "able-ible",
        "key": "able",
        "note": "Comfort is a whole word, so -able is likely.",
        "different": "Comfort is a whole word, so -able is likely."
      }
    ],
    "trays": [
      {
        "id": "cious-tious",
        "choices": [
          {
            "id": "cious",
            "text": "cious"
          },
          {
            "id": "tious",
            "text": "tious"
          }
        ]
      },
      {
        "id": "cial-tial",
        "choices": [
          {
            "id": "cial",
            "text": "cial"
          },
          {
            "id": "tial",
            "text": "tial"
          }
        ]
      },
      {
        "id": "ant-ent",
        "choices": [
          {
            "id": "ant",
            "text": "ant"
          },
          {
            "id": "ent",
            "text": "ent"
          }
        ]
      },
      {
        "id": "able-ible",
        "choices": [
          {
            "id": "able",
            "text": "able"
          },
          {
            "id": "ible",
            "text": "ible"
          }
        ]
      }
    ]
  },
  "pairs": [
    {
      "id": "observant",
      "front": "observant",
      "back": "observance",
      "spoken": "The pair is observant and observance."
    },
    {
      "id": "innocent",
      "front": "innocent",
      "back": "innocence",
      "spoken": "The pair is innocent and innocence."
    },
    {
      "id": "reasonable",
      "front": "reasonable",
      "back": "reasonably",
      "spoken": "The pair is reasonable and reasonably."
    },
    {
      "id": "visible",
      "front": "visible",
      "back": "visibly",
      "spoken": "The pair is visible and visibly."
    }
  ],
  "cards": [
    {
      "id": "card-5",
      "title": "-cious or -tious?",
      "text": "If the root word ends in -ce, -cious is usual: space, spacious. If a -tion word is in the family, -tious is usual: caution, cautious.",
      "example": "Grace.",
      "steps": [
        "The root is grace. It ends in -ce.",
        "Swap -ce for -cious.",
        "Gracious."
      ]
    },
    {
      "id": "card-6",
      "title": "-cial or -tial?",
      "text": "After a vowel letter, -cial is common: official, special. After a consonant letter, -tial is common: partial, essential. Learn the odd ones: initial, financial.",
      "example": "Confidential.",
      "steps": [
        "The letter before the ending is n.",
        "n is a consonant letter.",
        "So -tial is likely: confidential."
      ]
    },
    {
      "id": "card-7",
      "title": "-ant or -ent?",
      "text": "In significant and elegant, hard c and g go with -ant. After soft c or g, -ent is usual. Some words need a dictionary.",
      "example": "Elegant and intelligent.",
      "steps": [
        "In elegant, the g sounds hard, like go.",
        "Elegant keeps -ant.",
        "In intelligent, the g sounds soft, like gem. So -ent."
      ]
    },
    {
      "id": "card-8",
      "title": "-able or -ible?",
      "text": "A familiar whole word can help: comfort becomes comfortable. Many other words use -ible, such as visible. These are clues, with exceptions.",
      "example": "Comfortable.",
      "steps": [
        "Cover the ending. Is comfort a whole word? Yes.",
        "So -able is the likely ending.",
        "Comfortable."
      ]
    },
    {
      "id": "card-9",
      "title": "Keep the e to keep it soft",
      "text": "Notice ends in -ce. Before -able, keep the e, or the c turns hard. Noticeable. Change and changeable work the same way.",
      "example": "Manageable.",
      "steps": [
        "Manage ends in -ge.",
        "Without the e, ga would sound hard, like gap.",
        "Keep the e: manageable."
      ]
    },
    {
      "id": "card-10",
      "title": "From -able/-ible to -ably/-ibly",
      "text": "For these -able and -ible words, change the final e to y: comfortable becomes comfortably; terrible becomes terribly.",
      "example": "Possible.",
      "steps": [
        "Possible ends in -ble.",
        "Change the e to y.",
        "Possibly."
      ]
    }
  ],
  "jobs": [
    {
      "v": 1,
      "id": "b1",
      "kind": "choice",
      "title": "B1",
      "prompt": "The root word is space. Which spelling is right?",
      "hint": "What does space end with?",
      "example": "Grace.",
      "explanation": "Space ends in -ce, so spacious.",
      "steps": [
        "The root is space.",
        "It ends in -ce.",
        "Swap -ce for -cious."
      ],
      "teach": [
        {
          "id": "card-5",
          "title": "-cious or -tious?",
          "text": "If the root word ends in -ce, -cious is usual: space, spacious. If a -tion word is in the family, -tious is usual: caution, cautious.",
          "example": "Grace.",
          "steps": [
            "The root is grace. It ends in -ce.",
            "Swap -ce for -cious.",
            "Gracious."
          ]
        }
      ],
      "parts": [],
      "choices": [
        {
          "id": "spaceous",
          "text": "spaceous"
        },
        {
          "id": "spacious",
          "text": "spacious"
        },
        {
          "id": "spatious",
          "text": "spatious"
        }
      ],
      "key": "spacious",
      "different": {
        "spaceous": "The -ce goes. -cious takes its place.",
        "spatious": "A -ce root usually takes -cious, not -tious."
      },
      "copy": {
        "incomplete": "Choose a spelling, or keep this version and come back.",
        "partDifferent": "Have another look at this one."
      }
    },
    {
      "v": 1,
      "id": "b2",
      "kind": "choice",
      "title": "B2",
      "prompt": "Caution is in its family. Which spelling is right?",
      "hint": "Look at the letter before -ion in caution.",
      "example": "Ambition.",
      "explanation": "A -tion family word usually means -tious.",
      "steps": [],
      "teach": [
        {
          "id": "card-5-tious",
          "title": "The -tious family clue",
          "text": "A word ending in -tion can help you remember -tious: ambition and ambitious.",
          "example": "Ambition.",
          "steps": [
            "Ambition is in the word family.",
            "A -tion family is a clue: -tious is usual.",
            "Ambitious."
          ]
        }
      ],
      "parts": [],
      "choices": [
        {
          "id": "cautious",
          "text": "cautious"
        },
        {
          "id": "caucious",
          "text": "caucious"
        },
        {
          "id": "cautous",
          "text": "cautous"
        }
      ],
      "key": "cautious",
      "different": {
        "caucious": "For cautious, the family clue is caution. The ending is -tious.",
        "cautous": "The ending needs an i: -tious."
      },
      "copy": {
        "incomplete": "Choose a spelling, or keep this version and come back.",
        "partDifferent": "Have another look at this one."
      }
    },
    {
      "v": 1,
      "id": "b3",
      "kind": "choice",
      "title": "B3",
      "prompt": "Which spelling means \"only part of something\"?",
      "hint": "Find the letter before the shul sound.",
      "example": "Confidential.",
      "explanation": "After a consonant letter, -tial is common: partial.",
      "steps": [],
      "teach": [
        {
          "id": "card-6",
          "title": "-cial or -tial?",
          "text": "After a vowel letter, -cial is common: official, special. After a consonant letter, -tial is common: partial, essential. Learn the odd ones: initial, financial.",
          "example": "Confidential.",
          "steps": [
            "The letter before the ending is n.",
            "n is a consonant letter.",
            "So -tial is likely: confidential."
          ]
        }
      ],
      "parts": [],
      "choices": [
        {
          "id": "parcial",
          "text": "parcial"
        },
        {
          "id": "partical",
          "text": "partical"
        },
        {
          "id": "partial",
          "text": "partial"
        }
      ],
      "key": "partial",
      "different": {
        "parcial": "The letter before the ending is r, a consonant letter. -tial is common there.",
        "partical": "There's no c in this word: par-tial."
      },
      "copy": {
        "incomplete": "Choose a spelling, or keep this version and come back.",
        "partDifferent": "Have another look at this one."
      }
    },
    {
      "v": 1,
      "id": "b4",
      "kind": "choice",
      "title": "B4",
      "prompt": "Which spelling is right for this word?",
      "hint": "Soft c, as in city. Which ending keeps it soft?",
      "example": "Elegant and intelligent.",
      "explanation": "The soft c is followed by -ent in magnificent. Significant has hard c and -ant.",
      "steps": [],
      "teach": [
        {
          "id": "card-7",
          "title": "-ant or -ent?",
          "text": "In significant and elegant, hard c and g go with -ant. After soft c or g, -ent is usual. Some words need a dictionary.",
          "example": "Elegant and intelligent.",
          "steps": [
            "In elegant, the g sounds hard, like go.",
            "Elegant keeps -ant.",
            "In intelligent, the g sounds soft, like gem. So -ent."
          ]
        }
      ],
      "parts": [
        {
          "id": "soft-c",
          "text": "The c in this word sounds soft, as in city."
        }
      ],
      "choices": [
        {
          "id": "magnificant",
          "text": "magnificant"
        },
        {
          "id": "magnificent",
          "text": "magnificent"
        },
        {
          "id": "magnifisent",
          "text": "magnifisent"
        }
      ],
      "key": "magnificent",
      "different": {
        "magnificant": "In magnificent, c has the city sound; the ending is -ent.",
        "magnifisent": "The soft sound is still spelled with c."
      },
      "copy": {
        "incomplete": "Choose a spelling, or keep this version and come back.",
        "partDifferent": "Have another look at this one."
      }
    },
    {
      "v": 1,
      "id": "b5",
      "kind": "choice",
      "title": "B5",
      "prompt": "Depend is a whole word. Which spelling is right?",
      "hint": "Cover the ending. Is a whole word left?",
      "example": "Comfortable.",
      "explanation": "Depend is whole, so -able: dependable.",
      "steps": [],
      "teach": [
        {
          "id": "card-8",
          "title": "-able or -ible?",
          "text": "A familiar whole word can help: comfort becomes comfortable. Many other words use -ible, such as visible. These are clues, with exceptions.",
          "example": "Comfortable.",
          "steps": [
            "Cover the ending. Is comfort a whole word? Yes.",
            "So -able is the likely ending.",
            "Comfortable."
          ]
        }
      ],
      "parts": [],
      "choices": [
        {
          "id": "dependable",
          "text": "dependable"
        },
        {
          "id": "dependible",
          "text": "dependible"
        },
        {
          "id": "dependeble",
          "text": "dependeble"
        }
      ],
      "key": "dependable",
      "different": {
        "dependible": "A whole word before the ending usually takes -able.",
        "dependeble": "This ending is spelled -able or -ible. Depend is whole, so -able."
      },
      "copy": {
        "incomplete": "Choose a spelling, or keep this version and come back.",
        "partDifferent": "Have another look at this one."
      }
    },
    {
      "v": 1,
      "id": "b6",
      "kind": "choice",
      "title": "B6",
      "prompt": "Turn terrible into a word that tells how. Which spelling?",
      "hint": "Possible becomes possibly. Do the same.",
      "example": "Possible.",
      "explanation": "Terrible becomes terribly: the e changes to y.",
      "steps": [],
      "teach": [
        {
          "id": "card-10",
          "title": "From -able/-ible to -ably/-ibly",
          "text": "For these -able and -ible words, change the final e to y: comfortable becomes comfortably; terrible becomes terribly.",
          "example": "Possible.",
          "steps": [
            "Possible ends in -ble.",
            "Change the e to y.",
            "Possibly."
          ]
        }
      ],
      "parts": [],
      "choices": [
        {
          "id": "terriblely",
          "text": "terriblely"
        },
        {
          "id": "terribley",
          "text": "terribley"
        },
        {
          "id": "terribly",
          "text": "terribly"
        }
      ],
      "key": "terribly",
      "different": {
        "terriblely": "For terrible, change the final e to y instead of adding -ly.",
        "terribley": "The e goes. The y takes its place."
      },
      "copy": {
        "incomplete": "Choose a spelling, or keep this version and come back.",
        "partDifferent": "Have another look at this one."
      }
    }
  ],
  "copy": {
    "title": "The Endings Shelf",
    "letterTitle": "Check the letter",
    "pairsTitle": "Turn a word pair",
    "practiceTitle": "Try a job",
    "instruction": "Choose a word. Read its written clue. Try an ending.",
    "picker": "Choose a word in the letter",
    "clue": "Written clue",
    "empty": "[ending]",
    "spokenGap": "blank",
    "letterReadIntro": "I'll say blank for each word we're checking.",
    "unavailableWord": "[word unavailable]",
    "partialFit": "The readable endings fit their notes.",
    "jobIncomplete": "Choose a spelling, or keep this version and come back.",
    "chosen": "Chosen: {ending}",
    "unselected": "Not chosen yet",
    "turn": "Turn the card",
    "turnBack": "Turn back",
    "pairPicker": "Choose a word pair",
    "incomplete": "There are still endings to try. You can keep this version and come back.",
    "fit": "This version fits the letter's notes.",
    "different": "Read the written clues, then try another ending.",
    "partial": "This part of the earlier letter cannot be read here. Its original work stays in your notes. Other tables are open.",
    "unsupported": "This endings notebook uses a format this version cannot read. Download your notes to keep it. Other places are open.",
    "refused": "This change could not be kept. Your work is unchanged. Download your notes.",
    "neutral": "Have another look at this one.",
    "kept": "This version is kept. You can change your working copy.",
    "copied": "Your working copy is ready. The kept versions are unchanged.",
    "earlier": "That check belongs to an earlier version.",
    "unchecked": "This version has not been checked.",
    "letterRead": "Read the letter aloud",
    "wordRead": "Read this aloud",
    "adultLine": "The Endings Shelf keeps supplied spelling choices and unfinished versions. Written clues and offered endings make this supported practice, not evidence of independent spelling or pronunciation.",
    "adultDetails": "Earlier checks and first/latest kept work belong to their own saved words and choices. Requested help stays recorded when a kept version is reopened. The word pairs are teaching, not assessed responses. A fitting letter does not send a delivery, reveal a page or establish a whole topic. Local narration records no listening or spoken answer.",
    "fiction": "A story from Willowbank",
    "fact": "A true thing about language",
    "reminder": "Rules usually work. A dictionary has the last word.",
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
    "hint": "A hint",
    "example": "Show an example",
    "nextStep": "Show the next step",
    "skip": "Skip for now",
    "notes": "Download your notes",
    "wordGarden": "Back to Word Garden",
    "unsupportedRecord": "This earlier work cannot be read here. It stays in your notes. Other tables are open.",
    "unavailableSelection": "This part of the earlier table is not available here. Its original work stays in your notes.",
    "visibleNote": "Visible is spelled alike in English, Spanish and French. Its history leads back to Latin. The words need not sound alike."
  }
});

export const endingsShelfCopy = source.copy;
export function makeEndingsShelfSource() { return clone(source); }
