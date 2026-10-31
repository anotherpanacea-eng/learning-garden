// Spec337: original project-owned finite word-study and glossary copy.
// No learner data, upstream prose, audio assets or runtime content imports.
function deepFreeze(value) {
  if (value && typeof value === "object") {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

export const LONG_WORD_SOURCE = deepFreeze({
  "v": 1,
  "id": "long-word-workshop-1",
  "title": "The Long-Word Workshop",
  "copy": {
    "title": "The Long-Word Workshop",
    "storyLabel": "A story from Willowbank",
    "instruction": "Build with the pieces. Compare with the printed word. You can change your version or keep it to discuss.",
    "wholeWordNote": "You do not have to break every word into smaller pieces.",
    "partsNote": "Some pieces help with meaning. Some only help us check the letters. These cuts do not tell us how many beats to say.",
    "wordEmpty": "Your rail is empty. Choose a piece, or keep this empty version for later.",
    "wordDifferent": "This differs from the printed word. Look along both versions. Your pieces can stay while you discuss them.",
    "wordMatches": "Your pieces make the printed word. Which clue helps you remember it?",
    "uncheckedKeep": "Not compared",
    "keepAcknowledgment": "This version is kept. You can keep working.",
    "glossaryIncomplete": "Some sentences are waiting for a choice. You can keep an unfinished glossary.",
    "glossaryDiscussion": "Some choices differ from the checked glossary. Keep them to discuss, or try another choice.",
    "glossaryMatching": "These choices match the checked glossary. Read the sentences together.",
    "partialNotice": "Some earlier material cannot be opened here. Its original stays in your notes. This comparison covers only the readable part.",
    "partialMatching": "The readable choices match the checked glossary. Some earlier material is outside this comparison.",
    "unavailable": "This part of the earlier workshop cannot be played here. Its original stays in your notes. Other readable parts are still open.",
    "refusal": "This change could not fit safely in your downloadable notes. Your work stays as it was. Download your notes or visit another place.",
    "unknownVersion": "This earlier workshop uses a format we cannot open here. Its exact work stays in your downloadable notes.",
    "application": "Make a word label on paper, or explain one word to a person. What clue helped? Nothing you say or write is recorded here.",
    "words": "Build a word",
    "glossary": "Revise the glossary",
    "jobs": "Try a job",
    "hearStory": "Hear the story",
    "hearSentence": "Hear this sentence",
    "hearInstruction": "Hear the instruction",
    "hearPrompt": "Hear this prompt",
    "previousWord": "Previous word",
    "nextWord": "Next word",
    "wordPicker": "Word to build",
    "moveLeft": "Move left",
    "moveRight": "Move right",
    "putBack": "Put back",
    "clearWord": "Clear this word",
    "compareWord": "Compare with the card",
    "keepWord": "Keep this word",
    "example": "Show one way",
    "nextStep": "Next step",
    "first": "First kept",
    "latest": "Latest kept",
    "restoreWord": "Use these pieces",
    "overview": "See all words",
    "compareGlossary": "Compare this glossary",
    "keepGlossary": "Keep this glossary",
    "restoreGlossary": "Use these choices",
    "previousSentence": "Previous sentence",
    "nextSentence": "Next sentence",
    "sentencePicker": "Sentence to revise",
    "compare": "Compare",
    "keep": "Keep",
    "skip": "Skip for now",
    "jobPicker": "Choose a job",
    "back": "Back to the workshop",
    "pieces": "Letter pieces",
    "yourWord": "Your word",
    "selectedPiece": "Selected piece",
    "printedWord": "Printed word",
    "chooseSentence": "Choose a sentence",
    "yourVersion": "Your version",
    "earlierVersion": "Earlier version",
    "optionalHelp": "Optional help",
    "endingsShelf": "Visit the Endings Shelf",
    "stainedMap": "Visit the Stained Map",
    "wordListShelf": "Visit the Word List Shelf",
    "waterLab": "Visit the Water Lab",
    "wordGarden": "Word Garden",
    "notes": "Grown-up notes",
    "glossaryTitle": "Words for the water and garden tables",
    "glossaryInstruction": "Read one sentence. Choose a spelling. Then read your version. Your other sentences will wait.",
    "glossaryPrompt": "Find three slips on this glossary. You can revise, compare or keep it unfinished.",
    "leaveAsPrinted": "Choose the printed word again if you want to leave it as it is.",
    "jobIncomplete": "Choose a word, or skip for now.",
    "jobDifferent": "Look at the clue and your choice. You can revise or keep this version."
  },
  "story": {
    "short": "The librarian is making a glossary for the water and garden tables. Some long words have useful little pieces. Some need a family clue, and one brings a story about a name. Can we make the words clear enough for our next reader?"
  },
  "teaching": {
    "title": "Look for a useful piece",
    "steps": [
      "Look at catchment on its card. Find catch and ment.",
      "Put catch before ment. Check the whole word against the card.",
      "The pieces help us check letters. We still need the meaning note."
    ]
  },
  "words": [
    {
      "id": "catchment",
      "text": "catchment",
      "meaning": "Here, land whose water drains toward a common outlet.",
      "sentence": "We are drawing the river's catchment on our map.",
      "clue": "Catch stays whole before the ending -ment. Our meaning note tells us which kind of catchment this is.",
      "pieces": [
        {
          "id": "ment",
          "text": "ment"
        },
        {
          "id": "catch",
          "text": "catch"
        }
      ],
      "example": {
        "title": "One way to check catchment",
        "steps": [
          "Look at the printed word and its clue.",
          "Try catch + ment.",
          "Compare every letter with catchment. Another grouping may help too."
        ],
        "order": [
          "catch",
          "ment"
        ]
      }
    },
    {
      "id": "embankment",
      "text": "embankment",
      "meaning": "A raised bank, used to carry a road or hold water back.",
      "sentence": "A raised embankment runs beside the road.",
      "clue": "Bank is inside embank. The word finishes with -ment. You can check embank as one piece or look at em and bank separately.",
      "pieces": [
        {
          "id": "ment",
          "text": "ment"
        },
        {
          "id": "bank",
          "text": "bank"
        },
        {
          "id": "em",
          "text": "em"
        },
        {
          "id": "embank",
          "text": "embank"
        }
      ],
      "example": {
        "title": "One way to check embankment",
        "steps": [
          "Look at the printed word and its clue.",
          "Try embank + ment.",
          "Compare every letter with embankment. Another grouping may help too."
        ],
        "order": [
          "embank",
          "ment"
        ]
      }
    },
    {
      "id": "permeable",
      "text": "permeable",
      "meaning": "It lets liquid or gas pass through.",
      "sentence": "Water can pass through this permeable layer.",
      "clue": "Permeation and permeable share perme. The ending here is -able. Perme is a letter group here, not a word you need to use alone.",
      "pieces": [
        {
          "id": "able",
          "text": "able"
        },
        {
          "id": "perme",
          "text": "perme"
        }
      ],
      "example": {
        "title": "One way to check permeable",
        "steps": [
          "Look at the printed word and its clue.",
          "Try perme + able.",
          "Compare every letter with permeable. Another grouping may help too."
        ],
        "order": [
          "perme",
          "able"
        ]
      }
    },
    {
      "id": "precipitation",
      "text": "precipitation",
      "meaning": "In this weather note, water falling from clouds, such as rain or snow.",
      "sentence": "The weather notebook records precipitation.",
      "clue": "Look for the ending -ation. Precipit is a letter group for checking this spelling, not a little word with its own meaning here.",
      "pieces": [
        {
          "id": "ation",
          "text": "ation"
        },
        {
          "id": "precipit",
          "text": "precipit"
        }
      ],
      "example": {
        "title": "One way to check precipitation",
        "steps": [
          "Look at the printed word and its clue.",
          "Try precipit + ation.",
          "Compare every letter with precipitation. Another grouping may help too."
        ],
        "order": [
          "precipit",
          "ation"
        ]
      }
    },
    {
      "id": "photosynthesis",
      "text": "photosynthesis",
      "meaning": "A process in which plants use light to help make sugars.",
      "sentence": "The plant label uses the word photosynthesis.",
      "clue": "Photo- relates to light; synthesis relates to putting together. Older Greek syn means together, and thesis relates to putting or placing. This spelling has ph and y. You may check synthesis whole or check syn and thesis separately.",
      "pieces": [
        {
          "id": "synthesis",
          "text": "synthesis"
        },
        {
          "id": "thesis",
          "text": "thesis"
        },
        {
          "id": "photo",
          "text": "photo"
        },
        {
          "id": "syn",
          "text": "syn"
        }
      ],
      "example": {
        "title": "One way to check photosynthesis",
        "steps": [
          "Look at the printed word and its clue.",
          "Try photo + synthesis.",
          "Compare every letter with photosynthesis. Another grouping may help too."
        ],
        "order": [
          "photo",
          "synthesis"
        ]
      }
    },
    {
      "id": "algorithm",
      "text": "algorithm",
      "meaning": "An ordered method of steps for doing a job.",
      "sentence": "Dot follows an algorithm to sort the pretend parcels.",
      "clue": "This word's history starts with al-Khwarizmi's name. Its spelling changed as it travelled between languages. Later it was made to look like a Greek word for number. Keep the whole word together here.",
      "pieces": [
        {
          "id": "algorithm",
          "text": "algorithm"
        }
      ],
      "example": {
        "title": "One way to check algorithm",
        "steps": [
          "Look at the name in its history note.",
          "Keep algorithm as one piece.",
          "Not every long word needs the same kind of clue."
        ],
        "order": [
          "algorithm"
        ]
      }
    }
  ],
  "glossary": [
    {
      "id": "g1",
      "title": "Catchment",
      "before": "Catchment: the land wich drains toward a common river outlet.",
      "flagged": "wich",
      "frame": [
        "Catchment: the land ",
        " drains toward a common river outlet."
      ],
      "choices": [
        {
          "id": "a",
          "text": "which"
        },
        {
          "id": "b",
          "text": "witch"
        },
        {
          "id": "c",
          "text": "wich"
        }
      ],
      "fits": "a",
      "feedback": {
        "a": "Which fits this sentence. It points to the land being described.",
        "b": "Witch names a kind of person, often in a story. Here the sentence needs which to describe the land.",
        "c": "This glossary uses which here. Compare the letters in your version with which."
      },
      "hint": "Which word links land to the words describing it?",
      "example": [
        "Look at “the path which floods.” Which links path to its description.",
        "Now look at the land in this sentence."
      ]
    },
    {
      "id": "g2",
      "title": "Permeable",
      "before": "Permeable: lets water pass through. Our garden path is permiable.",
      "flagged": "permiable",
      "frame": [
        "Permeable: lets water pass through. Our garden path is ",
        "."
      ],
      "choices": [
        {
          "id": "a",
          "text": "permeible"
        },
        {
          "id": "b",
          "text": "permeable"
        },
        {
          "id": "c",
          "text": "permiable"
        }
      ],
      "fits": "b",
      "feedback": {
        "a": "This word uses -able. The family word permeation is a clue, not a rule for every word.",
        "b": "Permeable matches the checked spelling. Permeation helps us notice perme.",
        "c": "Compare permeation and permeable: both keep perme before the ending."
      },
      "hint": "Look at perme in permeation, then check the ending.",
      "example": [
        "Find perme in permeation.",
        "Find able on the word card.",
        "Put the letter groups together and check permeable."
      ]
    },
    {
      "id": "g3",
      "title": "Embankment",
      "before": "Embankment: a raised bank. It has an affect on where floods go.",
      "flagged": "affect",
      "frame": [
        "Embankment: a raised bank. It has an ",
        " on where floods go."
      ],
      "choices": [
        {
          "id": "a",
          "text": "affect"
        },
        {
          "id": "b",
          "text": "efect"
        },
        {
          "id": "c",
          "text": "effect"
        }
      ],
      "fits": "c",
      "feedback": {
        "a": "Here “an effect” names a result. Affect is usually a verb in sentences like “Floods affect the road.”",
        "b": "The noun effect has two f's. Compare it with the checked word.",
        "c": "Effect names the result here: an effect on where floods go."
      },
      "hint": "The words “has an” need a noun naming a result here.",
      "example": [
        "“The wall affects the flow.” Affects is the doing word there.",
        "“The wall has an effect.” Effect names the result.",
        "Now read this sentence."
      ]
    }
  ],
  "jobs": [
    {
      "v": 1,
      "id": "F1",
      "kind": "choice",
      "title": "A family clue",
      "prompt": "Permeation is in its family. Our word ends in -able. Which spelling matches these clues?",
      "choices": [
        {
          "id": "a",
          "text": "permeable"
        },
        {
          "id": "b",
          "text": "permeible"
        },
        {
          "id": "c",
          "text": "permiable"
        }
      ],
      "key": "a",
      "different": {
        "b": "This ending is -able, not -ible. Check the word card.",
        "c": "Permeation has perme. Keep those letters here."
      },
      "hint": "Check the family letters and then the ending.",
      "explanation": "The checked spelling is permeable: perme and able.",
      "example": "A family can help",
      "steps": [
        "Find perme in permeation.",
        "This word uses -able.",
        "Check both parts in your chosen spelling."
      ],
      "teach": [
        {
          "id": "F1-example",
          "title": "A family can help",
          "text": "A family word can remind us of letters. Check the ending against the word card too.",
          "example": "A family can help",
          "steps": [
            "Define and definition share defin.",
            "A family may show a useful letter group.",
            "Still check the whole word and its ending."
          ]
        }
      ],
      "parts": [],
      "supported": true,
      "guided": true,
      "copy": {
        "incomplete": "Choose a word, or skip for now.",
        "partDifferent": "Look at the clue and your choice. You can revise or keep this version."
      }
    },
    {
      "v": 1,
      "id": "F2",
      "kind": "choice",
      "title": "A plant word",
      "prompt": "This plant word has ph at the start and y in synthesis. Which spelling matches?",
      "choices": [
        {
          "id": "a",
          "text": "fotosynthesis"
        },
        {
          "id": "b",
          "text": "photosynthesis"
        },
        {
          "id": "c",
          "text": "photosinthesis"
        }
      ],
      "key": "b",
      "different": {
        "a": "The word card starts photo, with ph.",
        "c": "Synthesis has y after s. Look at that letter group."
      },
      "hint": "Check photo, then synthesis.",
      "explanation": "Photosynthesis keeps ph in photo and y in synthesis.",
      "example": "Look at a spelling clue",
      "steps": [],
      "teach": [
        {
          "id": "F2-example",
          "title": "Look at a spelling clue",
          "text": "A word's history can offer spelling clues. The checked spelling is still our reference.",
          "example": "Look at a spelling clue",
          "steps": [
            "Photograph begins with photo.",
            "Point to its ph.",
            "A clue helps us look closely; it does not settle every word's spelling."
          ]
        }
      ],
      "parts": [],
      "supported": true,
      "guided": true,
      "copy": {
        "incomplete": "Choose a word, or skip for now.",
        "partDifferent": "Look at the clue and your choice. You can revise or keep this version."
      }
    },
    {
      "v": 1,
      "id": "F3",
      "kind": "choice",
      "title": "Two kinds of history",
      "prompt": "Which note describes a word whose spelling was reshaped to resemble a Greek word?",
      "choices": [
        {
          "id": "a",
          "text": "photosynthesis"
        },
        {
          "id": "b",
          "text": "catchment"
        },
        {
          "id": "c",
          "text": "algorithm"
        }
      ],
      "key": "c",
      "different": {
        "a": "This note describes Greek-derived parts, not the reshaping named in the question.",
        "b": "This note describes catch with -ment, not that reshaping."
      },
      "hint": "Read the note about a name.",
      "explanation": "Algorithm's history starts with a name. Its later Greek-looking spelling is a different story from building photosynthesis from Greek-derived parts.",
      "example": "Read what a history note actually says",
      "steps": [],
      "teach": [
        {
          "id": "F3-example",
          "title": "Read what a history note actually says",
          "text": "Photosynthesis: Greek-derived parts. Catchment: catch with -ment. Algorithm: from al-Khwarizmi's name; its later spelling was reshaped to resemble a Greek word.",
          "example": "Read what a history note actually says",
          "steps": [
            "One note may name a word's parts.",
            "Another may describe a later spelling change.",
            "Use the note's evidence; length alone cannot tell the history."
          ]
        }
      ],
      "parts": [],
      "supported": true,
      "guided": true,
      "copy": {
        "incomplete": "Choose a word, or skip for now.",
        "partDifferent": "Look at the clue and your choice. You can revise or keep this version."
      }
    }
  ]
});

export function makeLongWordSource() { return structuredClone(LONG_WORD_SOURCE); }

export const LONG_WORD_GROWN_UP = deepFreeze([
  "These are six visible subject-word cards, an authored glossary with three revisions and three supplied recognition jobs. The printed spellings, hints and clues are support. Piece boundaries are teaching choices, not a complete morphological or syllable analysis. Matching a card is not spelling from memory; choosing a supplied correction is not proofreading the child's own writing. No science investigation, pronunciation assessment or full spelling-topic coverage is observed. Invite a spoken explanation or an off-screen label if useful; neither is captured.",
  "These short meanings identify the intended sense. They do not explain a complete water cycle, photosynthesis mechanism, flood-protection design or algorithm theory. Permeable does not mean every amount of rain will soak in at any rate. The glossary and parcels are fictional; real flood conditions need real evidence.",
  "arrival story; current instruction; each card's context sentence only; current F1/F2/F3 prompt only. Excluded: printed spelling-only labels; piece/choice lists; trials; clues and histories; teaching/examples; glossary alternatives/readbacks; feedback/check/keep summaries. Visible Hear buttons name only the allowed text. Browser voice quality is unqualified; no recording is made."
]);
