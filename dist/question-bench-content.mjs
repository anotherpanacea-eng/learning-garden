// Reviewed story plans from spec 373 and its finite text companion.
const sources = [
  {
    "v": 1,
    "model": "question-bench-v1",
    "id": "seedlings",
    "title": "Seedlings: what counts as doing well?",
    "wonder": "Which seedling setup is doing better?",
    "origin": "A plan about the Field Notebook's invented seedling records. They are not measured growth results or a forecast. The setups with enough light and with too little light have separate illustrated seedlings.",
    "notice": "“Better” needs a meaning. Stem length and leaf spread describe different features. A bigger number is not automatically “better”. Decide what “doing well” means before reading the rows. Leaf spread here means the width across the two leaves, not leaf area. A comparison of model records is not a new experiment.",
    "methodNotice": "Method notes describe this supplied story example, not an analysis or judgement of wording you write.",
    "focusLabel": "What to notice",
    "contextLabel": "Which context",
    "focus": [
      {
        "id": "stem",
        "label": "Stem length"
      },
      {
        "id": "leaf",
        "label": "Leaf spread"
      }
    ],
    "contexts": [
      {
        "id": "setups",
        "label": "Enough light and too little light on day 6"
      },
      {
        "id": "time",
        "label": "Days 0 and 6 with enough light"
      }
    ],
    "questions": [
      {
        "focusId": "stem",
        "contextId": "setups",
        "text": "On day 6, how long are the stems of the model seedlings labelled A in the setups with enough light and with too little light?"
      },
      {
        "focusId": "stem",
        "contextId": "time",
        "text": "How does model seedling A's stem length in the setup with enough light change from day 0 to day 6?"
      },
      {
        "focusId": "leaf",
        "contextId": "setups",
        "text": "On day 6, how wide is the leaf spread of the model seedlings labelled A in the setups with enough light and with too little light?"
      },
      {
        "focusId": "leaf",
        "contextId": "time",
        "text": "How does model seedling A's leaf spread in the setup with enough light change from day 0 to day 6?"
      }
    ],
    "ways": [
      {
        "id": "watch",
        "label": "Watch and record",
        "icon": "watch",
        "can": "Follow the named feature at the specified times, using the same meaning and unit each time. Records can describe a pattern or change.",
        "limit": "A pattern alone does not establish why it happened. Check that the records include this seedling, feature and time."
      },
      {
        "id": "compare",
        "label": "Set up a fair comparison",
        "icon": "compare",
        "can": "Plan matched setups, change the chosen condition and keep other relevant conditions alike. Use the same measure and observation times.",
        "limit": "Change over time within one setup compares days, not light conditions. A planned test of light conditions would be a different question. It would require a suitable design and actual records; choosing the method does not create them. If other relevant conditions differ too, the cause stays uncertain."
      },
      {
        "id": "research",
        "label": "Look up sources",
        "icon": "research",
        "can": "A source may explain the feature or show how someone recorded it. The Field Notebook already holds supplied model rows you can inspect.",
        "limit": "A general guide cannot supply readings for a particular setup unless those records are actually included. Check the source and the question, not just a familiar plant word."
      },
      {
        "id": "ask",
        "label": "Ask people",
        "icon": "ask",
        "can": "A gardener can explain what was recorded and how the observations were made.",
        "limit": "A person's recollection is a report, not automatically the original measurement. Ask to see the relevant record if the question needs a value."
      }
    ],
    "teaching": [
      "“Doing better” is broad. Choose a feature before deciding what information would help.",
      "Suppose someone chose leaf spread and days 0 and 6 in the setup with enough light. The question now names a feature, a model seedling and two times.",
      "Look for those rows in the model record. If a row or feature is missing, say what else you would need. Do not turn the made-up values into claims about every real plant."
    ],
    "glossary": [
      {
        "term": "Feature",
        "meaning": "Something specified that you notice or measure."
      },
      {
        "term": "Record",
        "meaning": "An account of what was reported or supplied, with its source and context."
      },
      {
        "term": "Model",
        "meaning": "A deliberately simplified example; these seedling values were invented."
      }
    ]
  },
  {
    "v": 1,
    "model": "question-bench-v1",
    "id": "ramps",
    "title": "Ramps: what does better mean?",
    "wonder": "Which ramp works better?",
    "origin": "A planning story about the Fair Test Bench's model ramps. Its supplied trials contain made-up stopping distances, not real measurements; they do not contain measured stopping times.",
    "notice": "A useful question names what changes and what you will notice. “Farther” and “longer time” are different outcomes. Nothing on this card predicts which setup wins.",
    "methodNotice": "Method notes describe this supplied story example, not an analysis or judgement of wording you write.",
    "focusLabel": "What to notice",
    "contextLabel": "Which change",
    "focus": [
      {
        "id": "distance",
        "label": "Stopping distance"
      },
      {
        "id": "time",
        "label": "Time from release until stopping"
      }
    ],
    "contexts": [
      {
        "id": "height",
        "label": "Height, same surface"
      },
      {
        "id": "surface",
        "label": "Surface, same height"
      }
    ],
    "questions": [
      {
        "focusId": "distance",
        "contextId": "height",
        "text": "How does stopping distance compare between low and high ramps when the surface, cart and release procedure stay the same?"
      },
      {
        "focusId": "distance",
        "contextId": "surface",
        "text": "How does stopping distance compare between rough and smooth landing surfaces when the ramp height, cart and release procedure stay the same?"
      },
      {
        "focusId": "time",
        "contextId": "height",
        "text": "How does time from release until stopping compare between low and high ramps when the surface, cart and release procedure stay the same?"
      },
      {
        "focusId": "time",
        "contextId": "surface",
        "text": "How does time from release until stopping compare between rough and smooth landing surfaces when the ramp height, cart and release procedure stay the same?"
      }
    ],
    "ways": [
      {
        "id": "watch",
        "label": "Watch and record",
        "icon": "watch",
        "can": "Describe what happened to a cart and record the specified outcome.",
        "limit": "If several relevant things change together, watching the result does not isolate which change mattered."
      },
      {
        "id": "compare",
        "label": "Set up a fair comparison",
        "icon": "compare",
        "can": "Compare the chosen settings while keeping the other relevant conditions alike and recording the same outcome each time.",
        "limit": "The existing Fair Test model supplies distance examples only. A time question needs time records; repeated clicks are not measured seconds."
      },
      {
        "id": "research",
        "label": "Look up sources",
        "icon": "research",
        "can": "Read a description of how someone defined stopping distance or timed a cart, or inspect a recorded test.",
        "limit": "A method description does not give the result for a particular setup. Check which outcome and conditions the record actually contains."
      },
      {
        "id": "ask",
        "label": "Ask people",
        "icon": "ask",
        "can": "Ask the crew how it released the cart and where its distance measurement began.",
        "limit": "An explanation of the procedure does not replace the distances or times needed to answer the question."
      }
    ],
    "teaching": [
      "“Works better” might mean farther, quicker or easier to use. These are different questions.",
      "Suppose someone chose stopping distance and a surface change. Keep height, cart and release procedure alike.",
      "A fair comparison could help, but it still needs records. A supplied distance cannot silently stand in for a stopping time."
    ],
    "glossary": [
      {
        "term": "Outcome",
        "meaning": "The specified thing you record to address a question."
      },
      {
        "term": "Fair comparison",
        "meaning": "A comparison designed to separate the chosen change from other relevant differences."
      },
      {
        "term": "Procedure",
        "meaning": "The stated way the observations or test were carried out."
      }
    ]
  },
  {
    "v": 1,
    "model": "question-bench-v1",
    "id": "frogs",
    "title": "Frogs: what would we need to look up?",
    "wonder": "What are frogs and toads like?",
    "origin": "A fictional library question about real species named in British wildlife guides. This card gives no diet or habitat answer.",
    "notice": "A source needs to match the species, life stage and question. “An amphibian” is not enough detail to assume the same answer for every species.",
    "methodNotice": "Method notes describe this supplied story example, not an analysis or judgement of wording you write.",
    "focusLabel": "What to find out",
    "contextLabel": "Which animal",
    "focus": [
      {
        "id": "food",
        "label": "Adult food"
      },
      {
        "id": "habitat",
        "label": "Usual habitat"
      }
    ],
    "contexts": [
      {
        "id": "frog",
        "label": "Common frog in Britain"
      },
      {
        "id": "toad",
        "label": "Common toad in Britain"
      }
    ],
    "questions": [
      {
        "focusId": "food",
        "contextId": "frog",
        "text": "What foods does a British wildlife guide list for adult common frogs?"
      },
      {
        "focusId": "food",
        "contextId": "toad",
        "text": "What foods does a British wildlife guide list for adult common toads?"
      },
      {
        "focusId": "habitat",
        "contextId": "frog",
        "text": "What habitats does a British wildlife guide describe for adult common frogs?"
      },
      {
        "focusId": "habitat",
        "contextId": "toad",
        "text": "What habitats does a British wildlife guide describe for adult common toads?"
      }
    ],
    "ways": [
      {
        "id": "watch",
        "label": "Watch and record",
        "icon": "watch",
        "can": "An observation can describe what one observed animal did in a particular setting.",
        "limit": "One observation cannot tell you everything a species usually eats or every habitat it uses. This card supplies no animal observations."
      },
      {
        "id": "compare",
        "label": "Set up a fair comparison",
        "icon": "compare",
        "can": "Comparing the relevant sections of species guides may reveal similarities or differences.",
        "limit": "Comparing documents is not a controlled experiment on animals. A fair-test label alone does not answer this source-reading question."
      },
      {
        "id": "research",
        "label": "Look up sources",
        "icon": "research",
        "can": "Find a species-specific guide, locate the adult food or habitat section and keep the source label with the note.",
        "limit": "Check the life stage, place and reliability of the source. A page about tadpoles or another species may not answer this question."
      },
      {
        "id": "ask",
        "label": "Ask people",
        "icon": "ask",
        "can": "An expert can explain where to find a relevant guide or how a species is described.",
        "limit": "Keep track of who is reporting what and which evidence supports it. An unsupported recollection is not made certain by calling someone an expert."
      }
    ],
    "teaching": [
      "The broad wonder covers many animals and many features. Pick one species and one subject to research.",
      "Suppose someone asked what habitats a British wildlife guide describes for adult common toads.",
      "A relevant source can help. Read what it actually says and keep its label; this question card does not supply the biological answer."
    ],
    "glossary": [
      {
        "term": "Species",
        "meaning": "A named kind of organism; this card distinguishes common frog and common toad."
      },
      {
        "term": "Life stage",
        "meaning": "A part of an organism's life, such as the adult stage."
      },
      {
        "term": "Source",
        "meaning": "The guide, record or person from which information is obtained."
      }
    ]
  },
  {
    "v": 1,
    "model": "question-bench-v1",
    "id": "flowers",
    "title": "Flowers: whose favourite?",
    "wonder": "Which flowers are prettiest?",
    "origin": "An imagined survey in the town. There are no real respondents and no collected answers on this card.",
    "notice": "People can have different favourites. We can investigate what people report without proving that one flower is objectively prettiest.",
    "methodNotice": "Method notes describe this supplied story example, not an analysis or judgement of wording you write.",
    "focusLabel": "What to collect",
    "contextLabel": "Which flowers",
    "focus": [
      {
        "id": "counts",
        "label": "Count choices"
      },
      {
        "id": "reasons",
        "label": "Reported reasons"
      }
    ],
    "contexts": [
      {
        "id": "sunflower-poppy",
        "label": "Sunflower and poppy"
      },
      {
        "id": "daisy-iris",
        "label": "Daisy and iris"
      }
    ],
    "questions": [
      {
        "focusId": "counts",
        "contextId": "sunflower-poppy",
        "text": "In a story survey, how many people choose sunflower, poppy or neither as their favourite?"
      },
      {
        "focusId": "counts",
        "contextId": "daisy-iris",
        "text": "In a story survey, how many people choose daisy, iris or neither as their favourite?"
      },
      {
        "focusId": "reasons",
        "contextId": "sunflower-poppy",
        "text": "What reasons do people in a story survey give for choosing sunflower, poppy or neither as their favourite?"
      },
      {
        "focusId": "reasons",
        "contextId": "daisy-iris",
        "text": "What reasons do people in a story survey give for choosing daisy, iris or neither as their favourite?"
      }
    ],
    "ways": [
      {
        "id": "watch",
        "label": "Watch and record",
        "icon": "watch",
        "can": "Observe which flowers people look at or approach in a story scene.",
        "limit": "Looking at a flower does not establish that it is someone's favourite. The question asks about reported preferences."
      },
      {
        "id": "compare",
        "label": "Set up a fair comparison",
        "icon": "compare",
        "can": "Present the same choices in the same way and consider how wording or order might influence responses.",
        "limit": "This can make a survey more consistent, but it does not prove an objectively prettiest flower or represent people who were not asked."
      },
      {
        "id": "research",
        "label": "Look up sources",
        "icon": "research",
        "can": "A published survey might describe what its own respondents preferred and how they were asked.",
        "limit": "It does not automatically tell you what this town's respondents would report. Check whose preferences and which choices were recorded."
      },
      {
        "id": "ask",
        "label": "Ask people",
        "icon": "ask",
        "can": "Ask the same clear question and record the choices or reasons people report, including neither.",
        "limit": "Responses describe those reports in that survey. They need not represent everyone or reveal a single objective best choice. This activity collects no real answers."
      }
    ],
    "teaching": [
      "“Prettiest” does not mean the same thing to everyone. A report about preferences is a more specific question.",
      "Suppose someone asked what reasons story respondents give for choosing daisy, iris or neither.",
      "Asking could collect those reports. Counting choices is a different record from collecting reasons; neither decides what everyone ought to prefer."
    ],
    "glossary": [
      {
        "term": "Preference",
        "meaning": "What someone reports liking or choosing."
      },
      {
        "term": "Respondent",
        "meaning": "Someone who answers a survey question."
      },
      {
        "term": "Survey",
        "meaning": "A planned collection of responses; none is conducted here."
      }
    ]
  }
];

export const questionCases = sources.map(({id,title,wonder},index)=>({id,title,wonder,icon:['watch','compare','research','ask'][index]}));
export function questionSource(id){const source=sources.find(item=>item.id===id);return source?structuredClone(source):null;}
