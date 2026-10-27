// Original finite fictional content; each new visit receives its own source snapshot.
const authored={
  "version": 1,
  "id": "timing-source-1",
  "title": "The message and the water",
  "preview": "This case looks ahead to records from later in Willowbank's story. You can explore it now. The journey numbers and copied times were invented for this case. Opening it does not deliver Nuria's letters or finish a story act.",
  "notice": "Story model: Willow Brook is made up.",
  "introduction": "The miller has written ‘about six hours’ on a scrap of paper. Underneath, someone has added: ‘Six hours after what?’ Sit with the two journeys, then leave the miller a note about what the numbers can and cannot say.",
  "adultNote": "Real flood warnings come from official services. This case is about how to reason with uncertain timing, not about what to do in a flood.",
  "labels": {
    "story": "Story model: Willow Brook is made up.",
    "openParts": "All four parts are open. Begin anywhere, ask for help, or leave a question for another visit.",
    "drawerTitle": "Where these numbers come from",
    "drawerIntroduction": "These are the supplied sheets for this fictional investigation. Keep a sheet beside your question.",
    "numberInstruction": "Enter a number, a fraction such as 3/2 with a positive denominator, or a decimal with up to three places. Units are beside the box. Enter a value, not a calculation.",
    "invalid": "Use a number, a fraction with a positive denominator, or a decimal with up to three places. Leave out units and calculation signs. This has not added a checked response.",
    "clockInstruction": "Use two digits for the hour and two for the minutes: HH:MM. This sheet uses 00:00 to 23:30, with minutes 00 or 30. Also choose Same day or Next day. For example, 07:30 needs its day label.",
    "clockInvalid": "Use HH:MM from 00:00 to 23:30, with minutes 00 or 30, and choose the day. This sheet writes a new day's midnight as 00:00, Next day. This has not added a checked response.",
    "choiceInstruction": "Choose one sentence, then check it against the sheet.",
    "choiceInvalid": "Choose a supplied sentence before checking. This has not added a checked response.",
    "keepConfirmation": "This provisional note is kept in this explorer's notes. The first kept version and the latest kept version stay available.",
    "noKeep": "No provisional note has been kept yet. Your writing drafts can still be here.",
    "starterConfirmation": "Replace your current writing draft for this part with the selected supplied words? Your selected supplied words will also stay available.",
    "starterReceipt": "Supplied words were used as a starting draft for this part.",
    "modeReceipt": "Both versions stay available. The selected mode is the version shown in a kept note.",
    "claimsIntroduction": "Put a claim beside a tray and read the reply. This keeps a discussion choice, not a right-answer score. You may change your mind.",
    "journeyCaption": "Same day means the day the card starts. Next day begins at the following midnight. “Water arrival” below is shorthand for the corresponding rise being noticed at Willowbank, not a parcel of water being tracked.",
    "recordCaption": "Each row is a separate selected entry, including both six-hour entries."
  },
  "units": {
    "hours": "hours",
    "entries": "entries",
    "clock": "HH:MM and day"
  },
  "pages": [
    {
      "id": "journeys",
      "role": "journeys",
      "title": "Two journeys",
      "purpose": "The water's journey and the message's journey start together on these cards. They do not have the same length.",
      "learn": [
        {
          "id": "journey-learn-1",
          "text": "A 24-hour day starts at midnight, 00:00. Noon is 12:00. One in the afternoon is 13:00, and nine in the evening is 21:00.",
          "facts": []
        },
        {
          "id": "journey-learn-2",
          "text": "From 1 p.m. to 11:59 p.m., the 24-hour hour is twelve more than the p.m. hour. The noon hour stays 12: 12:30 p.m. is 12:30. The midnight hour is 00: 12:30 a.m. is 00:30.",
          "facts": []
        },
        {
          "id": "journey-learn-3",
          "text": "Count forward along a journey. At midnight the clock returns to 00:00 and the day changes. For 21:00 plus six hours, three hours reach the next midnight; three more reach 03:00, Next day.",
          "facts": []
        },
        {
          "id": "journey-learn-4",
          "text": "The messenger leaves immediately on every card. The water duration begins when the rise is noticed at Vadoalto. The time between message arrival and model water arrival is the lead. A positive lead is time between arrivals; it does not promise enough time for any job.",
          "facts": []
        }
      ],
      "guided": [
        {
          "id": "journey-guide-1",
          "text": "Start at 09:00, Same day. Three hours forward reaches noon, 12:00.",
          "facts": []
        },
        {
          "id": "journey-guide-2",
          "text": "Three more hours reaches 15:00, Same day. The two jumps total six hours. That is the six-hour card's model water arrival.",
          "facts": []
        }
      ],
      "guidedFor": {
        "kind": "task",
        "id": "day-water"
      }
    },
    {
      "id": "rates",
      "role": "rates",
      "title": "A rate for the journey",
      "purpose": "Try an exact constant rate, then compare its journey with the messenger's. A calculation can be exact while the model stays invented.",
      "learn": [
        {
          "id": "rate-learn-1",
          "text": "A rate of three kilometers per hour means three kilometers in one hour. In this model the rate stays constant, so each equal hour adds an equal distance.",
          "facts": []
        },
        {
          "id": "rate-learn-2",
          "text": "Use the line to count equal groups of distance. At three kilometers each hour, how many hours make eighteen kilometers? Divide the distance by the distance for one hour: 18 ÷ 3.",
          "facts": []
        },
        {
          "id": "rate-learn-3",
          "text": "Check a proposed duration by multiplying it by the rate. Six hours at three kilometers per hour gives 6 × 3 = 18 kilometers. For the same distance, a larger constant rate takes less time.",
          "facts": [
            [
              3,
              6
            ]
          ]
        },
        {
          "id": "rate-learn-4",
          "text": "The two other supplied rates are four and a half kilometers per hour, written 4.5 km/h, and two kilometers per hour. These are separate invented alternatives. This sheet does not tell us what weather would produce them.",
          "facts": []
        }
      ],
      "guided": [
        {
          "id": "rate-guide-1",
          "text": "Count the distances: 3, 6, 9, 12, 15, 18 kilometers. Each step uses one hour.",
          "facts": []
        },
        {
          "id": "rate-guide-2",
          "text": "There are six steps. 18 ÷ 3 = 6 hours, checked by 6 × 3 = 18 kilometers.",
          "facts": [
            [
              3,
              6
            ]
          ]
        }
      ],
      "guidedFor": {
        "kind": "task",
        "id": "rate-three"
      }
    },
    {
      "id": "record",
      "role": "record",
      "title": "Five copied times",
      "purpose": "Read what five entries say. Then separate a description of those entries from a promise about another rise.",
      "learn": [
        {
          "id": "record-learn-1",
          "text": "To find the median of five values, put all five in order from shortest to longest. Keep repeated values. The third value is the middle one, with two entries on each side.",
          "facts": []
        },
        {
          "id": "record-learn-2",
          "text": "For example, durations eight, three, five, five and nine go in order as three, five, five, eight, nine. The median is five. This example is separate from the copied sheet.",
          "facts": []
        },
        {
          "id": "record-learn-3",
          "text": "The shortest duration is the minimum. The range is one difference: longest minus shortest. In that separate example, the minimum is three and the range is 9 − 3 = 6 hours.",
          "facts": []
        },
        {
          "id": "record-learn-4",
          "text": "A median describes a middle value; a minimum describes the shortest listed value. Neither promises a future duration. A count below six describes this selected copy, not a chance for the next rise.",
          "facts": []
        }
      ],
      "guided": [
        {
          "id": "record-guide-1",
          "text": "Keep the two sixes as separate entries. Begin with the shortest copied duration, four, then five.",
          "facts": []
        },
        {
          "id": "record-guide-2",
          "text": "The complete ordered copy is 4, 5, 6, 6, 7 hours. The middle of this five-entry line is six hours.",
          "facts": []
        }
      ],
      "guidedFor": {
        "kind": "task",
        "id": "ordered-times"
      }
    },
    {
      "id": "note",
      "role": "note",
      "title": "A provisional note",
      "purpose": "Leave the miller a short note for a human to read. Explain one result, name a limit, and suggest a better record. You may write, use supplied words, mix the routes, or leave a part open.",
      "learn": [
        {
          "id": "note-learn-1",
          "text": "Give your reader the assumption as well as the answer. ‘On the six-hour day card…’ tells the miller which calculation you mean.",
          "facts": []
        },
        {
          "id": "note-learn-2",
          "text": "Keep a description and a promise separate. ‘The shortest listed time is four hours’ describes the copy. It does not promise a future arrival.",
          "facts": []
        },
        {
          "id": "note-learn-3",
          "text": "A useful next-record question names information that is missing. You do not have to solve the uncertainty to describe it clearly.",
          "facts": []
        }
      ],
      "guided": [
        {
          "id": "note-guide-1",
          "text": "A possible opening is: ‘On the six-hour day card, the message arrives at noon and the model water arrival is 15:00, leaving three hours between them.’",
          "facts": []
        },
        {
          "id": "note-guide-2",
          "text": "You can keep that supplied wording, edit a copy as your own draft, or explain a different result. The note is not graded.",
          "facts": []
        }
      ],
      "guidedFor": {
        "kind": "part",
        "id": "calculation"
      }
    }
  ],
  "sources": [
    {
      "id": "story",
      "title": "A story estimate",
      "text": "A later story idea says that a rise noticed at Vadoalto is noticed at Willowbank about six hours later. ‘About’ is an estimate. This desk sometimes asks you to assume exactly six hours so that you can compare the journeys.",
      "limit": "An exact calculation using an assumption does not make the assumption an exact prediction."
    },
    {
      "id": "journeys",
      "title": "Four supplied journey cards",
      "text": "For each card, the messenger leaves as soon as the rise is noticed at Vadoalto. There is no dispatch delay. A day journey takes three hours; a night journey takes four hours. These are fixed journey lengths on these cards. A journey does not change length when midnight passes. The water-duration assumptions are six hours or four hours, as each question says.",
      "limit": "The cards do not tell us how long a real messenger or a real rise would take. They do not promise time for any town job."
    },
    {
      "id": "rate",
      "title": "An invented constant-rate route",
      "text": "For these examples only, the route is eighteen kilometers long. Try rates of three, four and a half, or two kilometers in each hour. Each rate stays the same for the whole example.",
      "limit": "This is a constant-rate arithmetic model. It does not explain how a real river moves."
    },
    {
      "id": "record",
      "title": "An undated English desk copy",
      "text": "Five selected entries give times between corresponding notices of rising water at the two posts: A seven hours; B six hours; C five hours; D six hours; E four hours. The dates, copier and original selection coverage are not given. Neither the exact rule for noticing a rise nor the timing precision is given.",
      "limit": "A to E are labels, not dates. This is not a list of every rise and it is not part of Nuria's first letter. It cannot be placed on the ledger's year-line."
    },
    {
      "id": "adult",
      "title": "For a grown-up",
      "text": "Real flood warnings come from official services. This case is about how to reason with uncertain timing, not about what to do in a flood.",
      "limit": "No kept note here becomes the town's official rule. Story events remain part of the authored story."
    }
  ],
  "scenarios": [
    {
      "id": "day-six",
      "title": "Six-hour day card",
      "start": {
        "day": 0,
        "minute": 540
      },
      "dispatchMinutes": 0,
      "messageMinutes": 180,
      "waterMinutes": 360,
      "journeyLabel": "Day journey",
      "assumptions": "The rise is noticed at Vadoalto at the start time. The messenger leaves immediately. Both journey durations stay fixed for the whole card.",
      "limit": "Time between arrivals is not a promise of enough time for a town job."
    },
    {
      "id": "night-six",
      "title": "Six-hour night card",
      "start": {
        "day": 0,
        "minute": 1230
      },
      "dispatchMinutes": 0,
      "messageMinutes": 240,
      "waterMinutes": 360,
      "journeyLabel": "Night journey",
      "assumptions": "The rise is noticed at Vadoalto at the start time. The messenger leaves immediately. Both journey durations stay fixed for the whole card.",
      "limit": "Time between arrivals is not a promise of enough time for a town job."
    },
    {
      "id": "day-four",
      "title": "Four-hour day card",
      "start": {
        "day": 0,
        "minute": 540
      },
      "dispatchMinutes": 0,
      "messageMinutes": 180,
      "waterMinutes": 240,
      "journeyLabel": "Day journey",
      "assumptions": "The rise is noticed at Vadoalto at the start time. The messenger leaves immediately. Both journey durations stay fixed for the whole card.",
      "limit": "Time between arrivals is not a promise of enough time for a town job."
    },
    {
      "id": "night-four",
      "title": "Four-hour night card",
      "start": {
        "day": 0,
        "minute": 1230
      },
      "dispatchMinutes": 0,
      "messageMinutes": 240,
      "waterMinutes": 240,
      "journeyLabel": "Night journey",
      "assumptions": "The rise is noticed at Vadoalto at the start time. The messenger leaves immediately. Both journey durations stay fixed for the whole card.",
      "limit": "Time between arrivals is not a promise of enough time for a town job."
    }
  ],
  "rateModel": {
    "mode": "constant-rate",
    "id": "constant-route",
    "title": "Eighteen kilometers at three kilometers per hour",
    "rate": {
      "n": 3,
      "d": 1
    },
    "route": {
      "n": 18,
      "d": 1
    },
    "stages": [
      {
        "id": "rate-stage-0",
        "hours": {
          "n": 0,
          "d": 1
        },
        "distance": {
          "n": 0,
          "d": 1
        },
        "text": "At the start: zero hours, zero kilometers.",
        "facts": []
      },
      {
        "id": "rate-stage-1",
        "hours": {
          "n": 1,
          "d": 1
        },
        "distance": {
          "n": 3,
          "d": 1
        },
        "text": "After one hour: 1 × 3 = 3 kilometers.",
        "facts": [
          [
            3,
            1
          ]
        ]
      },
      {
        "id": "rate-stage-2",
        "hours": {
          "n": 2,
          "d": 1
        },
        "distance": {
          "n": 6,
          "d": 1
        },
        "text": "After two hours: 2 × 3 = 6 kilometers.",
        "facts": [
          [
            3,
            2
          ]
        ]
      },
      {
        "id": "rate-stage-3",
        "hours": {
          "n": 3,
          "d": 1
        },
        "distance": {
          "n": 9,
          "d": 1
        },
        "text": "After three hours: 3 × 3 = 9 kilometers.",
        "facts": [
          [
            3,
            3
          ]
        ]
      },
      {
        "id": "rate-stage-4",
        "hours": {
          "n": 4,
          "d": 1
        },
        "distance": {
          "n": 12,
          "d": 1
        },
        "text": "After four hours: 4 × 3 = 12 kilometers.",
        "facts": [
          [
            3,
            4
          ]
        ]
      },
      {
        "id": "rate-stage-5",
        "hours": {
          "n": 5,
          "d": 1
        },
        "distance": {
          "n": 15,
          "d": 1
        },
        "text": "After five hours: 5 × 3 = 15 kilometers.",
        "facts": [
          [
            3,
            5
          ]
        ]
      },
      {
        "id": "rate-stage-6",
        "hours": {
          "n": 6,
          "d": 1
        },
        "distance": {
          "n": 18,
          "d": 1
        },
        "text": "After six hours: 6 × 3 = 18 kilometers. This model has reached the route's end.",
        "facts": [
          [
            3,
            6
          ]
        ]
      }
    ]
  },
  "records": {
    "id": "selected-times",
    "title": "Selected copied durations",
    "selectionNote": "Each row is a separate selected entry, including both six-hour entries.",
    "unknowns": "Dates, copier, original selection coverage, detection threshold and timing resolution are not given.",
    "entries": [
      {
        "id": "A",
        "hours": {
          "n": 7,
          "d": 1
        },
        "date": null
      },
      {
        "id": "B",
        "hours": {
          "n": 6,
          "d": 1
        },
        "date": null
      },
      {
        "id": "C",
        "hours": {
          "n": 5,
          "d": 1
        },
        "date": null
      },
      {
        "id": "D",
        "hours": {
          "n": 6,
          "d": 1
        },
        "date": null
      },
      {
        "id": "E",
        "hours": {
          "n": 4,
          "d": 1
        },
        "date": null
      }
    ],
    "summary": {
      "ordered": [
        {
          "n": 4,
          "d": 1
        },
        {
          "n": 5,
          "d": 1
        },
        {
          "n": 6,
          "d": 1
        },
        {
          "n": 6,
          "d": 1
        },
        {
          "n": 7,
          "d": 1
        }
      ],
      "median": {
        "n": 6,
        "d": 1
      },
      "range": {
        "n": 3,
        "d": 1
      },
      "min": {
        "n": 4,
        "d": 1
      },
      "belowThreshold": {
        "hours": {
          "n": 6,
          "d": 1
        },
        "count": 2
      }
    }
  },
  "tasks": [
    {
      "id": "day-water",
      "pageId": "journeys",
      "kind": "numeric",
      "prompt": "Using this assumption, what is the model water-arrival time?",
      "context": "Six-hour day card: rise noticed and messenger sent at 09:00, Same day. Assume six hours until the rise is noticed at Willowbank.",
      "contextRefs": [
        "journeys",
        "day-six"
      ],
      "facts": [],
      "hintId": "day-water-hint",
      "exampleId": "day-water-example",
      "skipId": "day-water-skip",
      "match": "09:00 plus six hours is 15:00, Same day. That is the result under the six-hour assumption.",
      "different": "Count forward six hours from 09:00. Three hours reach noon, then three more reach 15:00, Same day.",
      "matchFacts": [],
      "differentFacts": [],
      "errors": [
        {
          "fieldId": "water",
          "value": {
            "minute": 180
          },
          "reply": "03:00 is three in the morning on its chosen day. Six hours after 09:00 is three in the afternoon: 15:00, Same day.",
          "facts": []
        }
      ],
      "fields": [
        {
          "id": "water",
          "label": "Model water arrival",
          "type": "clock",
          "unit": "clock",
          "answer": {
            "day": 0,
            "minute": 900
          }
        }
      ]
    },
    {
      "id": "day-message",
      "pageId": "journeys",
      "kind": "numeric",
      "prompt": "When does the message arrive?",
      "context": "Six-hour day card: messenger sent at 09:00, Same day. The supplied day journey lasts three hours.",
      "contextRefs": [
        "journeys",
        "day-six"
      ],
      "facts": [],
      "hintId": "day-message-hint",
      "exampleId": "day-message-example",
      "skipId": "day-message-skip",
      "match": "09:00 plus three hours is 12:00, Same day: noon.",
      "different": "Follow the message's three-hour journey from 09:00. It reaches 12:00, Same day.",
      "matchFacts": [],
      "differentFacts": [],
      "errors": [],
      "fields": [
        {
          "id": "message",
          "label": "Message arrival",
          "type": "clock",
          "unit": "clock",
          "answer": {
            "day": 0,
            "minute": 720
          }
        }
      ]
    },
    {
      "id": "day-gap",
      "pageId": "journeys",
      "kind": "numeric",
      "prompt": "How many hours lie between those arrivals?",
      "context": "On the six-hour day card the message arrives at 12:00, Same day, and the model water arrival is 15:00, Same day.",
      "contextRefs": [
        "journeys",
        "day-six"
      ],
      "facts": [],
      "hintId": "day-gap-hint",
      "exampleId": "day-gap-example",
      "skipId": "day-gap-skip",
      "match": "From 12:00 to 15:00 is three hours. The message's journey used three of the original six hours.",
      "different": "Start this count at message arrival, 12:00, and stop at model water arrival, 15:00. The interval is three hours.",
      "matchFacts": [],
      "differentFacts": [],
      "errors": [
        {
          "fieldId": "lead",
          "value": {
            "n": 6,
            "d": 1
          },
          "reply": "Six hours starts at Vadoalto's noticed rise. The interval asked for begins later, when the message arrives at 12:00; it lasts three hours.",
          "facts": []
        }
      ],
      "fields": [
        {
          "id": "lead",
          "label": "Time between arrivals",
          "type": "number",
          "unit": "hours",
          "answer": {
            "n": 3,
            "d": 1
          }
        }
      ]
    },
    {
      "id": "night-arrivals",
      "pageId": "journeys",
      "kind": "numeric",
      "prompt": "Give both arrival times, including their days.",
      "context": "Six-hour night card: rise noticed and messenger sent at 20:30, Same day. Assume a six-hour water journey and a fixed four-hour message journey.",
      "contextRefs": [
        "journeys",
        "night-six"
      ],
      "facts": [],
      "hintId": "night-arrivals-hint",
      "exampleId": "night-arrivals-example",
      "skipId": "night-arrivals-skip",
      "match": "Six hours after 20:30 is 02:30, Next day. Four hours after 20:30 is 00:30, Next day. Both journeys cross midnight.",
      "different": "From 20:30, three and a half hours reach the next midnight. Another two and a half give 02:30 for the water; another half hour gives 00:30 for the message. Both are Next day.",
      "matchFacts": [],
      "differentFacts": [],
      "errors": [
        {
          "fieldId": "water",
          "value": {
            "minute": 870,
            "day": 0
          },
          "reply": "14:30 on the starting day is earlier than 20:30. Count forward six hours: the model water arrival is 02:30, Next day.",
          "facts": []
        }
      ],
      "fields": [
        {
          "id": "water",
          "label": "Model water arrival",
          "type": "clock",
          "unit": "clock",
          "answer": {
            "day": 1,
            "minute": 150
          }
        },
        {
          "id": "message",
          "label": "Message arrival",
          "type": "clock",
          "unit": "clock",
          "answer": {
            "day": 1,
            "minute": 30
          }
        }
      ]
    },
    {
      "id": "night-gap",
      "pageId": "journeys",
      "kind": "numeric",
      "prompt": "How many hours lie between those arrivals?",
      "context": "On the six-hour night card the message arrives at 00:30, Next day. Model water arrival is 02:30, Next day.",
      "contextRefs": [
        "journeys",
        "night-six"
      ],
      "facts": [],
      "hintId": "night-gap-hint",
      "exampleId": "night-gap-example",
      "skipId": "night-gap-skip",
      "match": "00:30 to 02:30 on the same next day is two hours.",
      "different": "Both arrivals have the same day label. Count from 00:30 to 02:30: two hours.",
      "matchFacts": [],
      "differentFacts": [],
      "errors": [],
      "fields": [
        {
          "id": "lead",
          "label": "Time between arrivals",
          "type": "number",
          "unit": "hours",
          "answer": {
            "n": 2,
            "d": 1
          }
        }
      ]
    },
    {
      "id": "which-origin",
      "pageId": "journeys",
      "kind": "choice",
      "prompt": "Which sentence describes the supplied six-hour duration?",
      "context": "The six-hour cards assume six hours from a noticed rise at Vadoalto to the corresponding notice at Willowbank. The message takes part of that interval.",
      "contextRefs": [
        "journeys",
        "day-six",
        "night-six"
      ],
      "facts": [],
      "hintId": "which-origin-hint",
      "exampleId": "which-origin-example",
      "skipId": "which-origin-skip",
      "match": "",
      "different": "",
      "matchFacts": [],
      "differentFacts": [],
      "errors": [],
      "choices": [
        {
          "id": "after-message",
          "text": "It begins when the message reaches Willowbank.",
          "reply": "That would start the interval after the messenger's journey. These cards start the six hours at Vadoalto's noticed rise."
        },
        {
          "id": "after-rise",
          "text": "It begins when the rise is noticed at Vadoalto.",
          "reply": "Yes. The water-duration clock starts at Vadoalto's noticed rise. The message travels during part of those six hours."
        },
        {
          "id": "not-computable",
          "text": "Its beginning cannot be found on these cards.",
          "reply": "The cards do give a beginning: the noticed rise and immediate dispatch at Vadoalto. What they cannot give is an exact prediction for a real river."
        }
      ],
      "fit": "after-rise"
    },
    {
      "id": "rate-three",
      "pageId": "rates",
      "kind": "numeric",
      "prompt": "How many hours does this model journey take?",
      "context": "The invented route is 18 km long. Constant rate: 3 km/h.",
      "contextRefs": [
        "rate",
        "constant-route"
      ],
      "facts": [],
      "hintId": "rate-three-hint",
      "exampleId": "rate-three-example",
      "skipId": "rate-three-skip",
      "match": "18 ÷ 3 = 6 hours. Check: 6 × 3 = 18 kilometers.",
      "different": "Count groups of three kilometers until you reach eighteen. Six groups give 6 × 3 = 18, so the duration is six hours.",
      "matchFacts": [
        [
          3,
          6
        ]
      ],
      "differentFacts": [
        [
          3,
          6
        ]
      ],
      "errors": [
        {
          "fieldId": "duration",
          "value": {
            "n": 54,
            "d": 1
          },
          "reply": "54 does not give eighteen kilometers when multiplied by the three-kilometer hourly rate. Six hours does: 6 × 3 = 18.",
          "facts": [
            [
              3,
              6
            ]
          ]
        },
        {
          "fieldId": "duration",
          "value": {
            "n": 1,
            "d": 6
          },
          "reply": "That value is less than one hour. At three kilometers per hour, the model has covered only three kilometers after one hour. Eighteen kilometers takes six hours.",
          "facts": []
        },
        {
          "fieldId": "duration",
          "value": {
            "n": 17,
            "d": 100
          },
          "reply": "That value is less than one hour. At three kilometers per hour, the model has covered only three kilometers after one hour. Eighteen kilometers takes six hours.",
          "facts": []
        }
      ],
      "fields": [
        {
          "id": "duration",
          "label": "Journey duration",
          "type": "number",
          "unit": "hours",
          "answer": {
            "n": 6,
            "d": 1
          }
        }
      ]
    },
    {
      "id": "rate-four-half",
      "pageId": "rates",
      "kind": "numeric",
      "prompt": "How many hours does this model journey take?",
      "context": "The same invented route is 18 km long. This separate constant rate is 4.5 km/h.",
      "contextRefs": [
        "rate",
        "constant-route"
      ],
      "facts": [],
      "hintId": "rate-four-half-hint",
      "exampleId": "rate-four-half-example",
      "skipId": "rate-four-half-skip",
      "match": "Four hours at 4.5 kilometers each hour gives 4 × 4.5 = 18 kilometers. The duration is four hours.",
      "different": "Two hours give nine kilometers; two more give eighteen. At 4.5 kilometers per hour, this route takes four hours.",
      "matchFacts": [],
      "differentFacts": [],
      "errors": [
        {
          "fieldId": "duration",
          "value": {
            "n": 6,
            "d": 1
          },
          "reply": "Six hours belonged to the three-kilometer rate. At this larger rate, four hours already give eighteen kilometers.",
          "facts": []
        }
      ],
      "fields": [
        {
          "id": "duration",
          "label": "Journey duration",
          "type": "number",
          "unit": "hours",
          "answer": {
            "n": 4,
            "d": 1
          }
        }
      ]
    },
    {
      "id": "rate-two",
      "pageId": "rates",
      "kind": "numeric",
      "prompt": "How many hours does this model journey take?",
      "context": "The same invented route is 18 km long. This separate constant rate is 2 km/h.",
      "contextRefs": [
        "rate",
        "constant-route"
      ],
      "facts": [],
      "hintId": "rate-two-hint",
      "exampleId": "rate-two-example",
      "skipId": "rate-two-skip",
      "match": "18 ÷ 2 = 9 hours. Check: 9 × 2 = 18 kilometers. This smaller rate takes longer for the same route.",
      "different": "Count groups of two kilometers. Nine groups give 9 × 2 = 18 kilometers, so the duration is nine hours.",
      "matchFacts": [
        [
          2,
          9
        ]
      ],
      "differentFacts": [
        [
          2,
          9
        ]
      ],
      "errors": [],
      "fields": [
        {
          "id": "duration",
          "label": "Journey duration",
          "type": "number",
          "unit": "hours",
          "answer": {
            "n": 9,
            "d": 1
          }
        }
      ]
    },
    {
      "id": "fast-day",
      "pageId": "rates",
      "kind": "numeric",
      "prompt": "Give the model water arrival, message arrival and hours between them.",
      "context": "Assume the 18 km route at 4.5 km/h takes 4 hours. Rise noticed and message sent at 09:00, Same day; the supplied day message journey takes 3 hours.",
      "contextRefs": [
        "rate",
        "constant-route",
        "day-four"
      ],
      "facts": [],
      "hintId": "fast-day-hint",
      "exampleId": "fast-day-example",
      "skipId": "fast-day-skip",
      "match": "Model water arrival: 13:00, Same day. Message arrival: 12:00, Same day. One hour lies between them. The faster model leaves a smaller interval.",
      "different": "Add four hours to 09:00 for 13:00, and three hours for 12:00. From message arrival at noon to model water arrival at 13:00 is one hour.",
      "matchFacts": [],
      "differentFacts": [],
      "errors": [],
      "fields": [
        {
          "id": "water",
          "label": "Model water arrival",
          "type": "clock",
          "unit": "clock",
          "answer": {
            "day": 0,
            "minute": 780
          }
        },
        {
          "id": "message",
          "label": "Message arrival",
          "type": "clock",
          "unit": "clock",
          "answer": {
            "day": 0,
            "minute": 720
          }
        },
        {
          "id": "lead",
          "label": "Time between arrivals",
          "type": "number",
          "unit": "hours",
          "answer": {
            "n": 1,
            "d": 1
          }
        }
      ]
    },
    {
      "id": "fast-night",
      "pageId": "rates",
      "kind": "numeric",
      "prompt": "Give both arrivals and the hours between them.",
      "context": "Four-hour night card: rise noticed and message sent at 20:30, Same day. Assume four hours for the water and a fixed four-hour night message journey.",
      "contextRefs": [
        "rate",
        "constant-route",
        "night-four"
      ],
      "facts": [],
      "hintId": "fast-night-hint",
      "exampleId": "fast-night-example",
      "skipId": "fast-night-skip",
      "match": "Both arrive at 00:30, Next day. The interval is zero hours: on this card the message gives no advance time.",
      "different": "Both journeys start together and last four hours. Both end at 00:30, Next day. Equal arrival times leave zero hours between them.",
      "matchFacts": [],
      "differentFacts": [],
      "errors": [],
      "fields": [
        {
          "id": "water",
          "label": "Model water arrival",
          "type": "clock",
          "unit": "clock",
          "answer": {
            "day": 1,
            "minute": 30
          }
        },
        {
          "id": "message",
          "label": "Message arrival",
          "type": "clock",
          "unit": "clock",
          "answer": {
            "day": 1,
            "minute": 30
          }
        },
        {
          "id": "lead",
          "label": "Time between arrivals",
          "type": "number",
          "unit": "hours",
          "answer": {
            "n": 0,
            "d": 1
          }
        }
      ]
    },
    {
      "id": "ordered-times",
      "pageId": "record",
      "kind": "numeric",
      "prompt": "Enter all five durations in order, shortest first. Keep repeated values.",
      "context": "The copied durations are A: 7, B: 6, C: 5, D: 6 and E: 4 hours.",
      "contextRefs": [
        "record",
        "selected-times"
      ],
      "facts": [],
      "hintId": "ordered-times-hint",
      "exampleId": "ordered-times-example",
      "skipId": "ordered-times-skip",
      "match": "The ordered durations are 4, 5, 6, 6, 7 hours. Both six-hour entries remain.",
      "different": "Order every listed entry, including both sixes: 4, 5, 6, 6, 7 hours.",
      "matchFacts": [],
      "differentFacts": [],
      "errors": [],
      "fields": [
        {
          "id": "first",
          "label": "First duration",
          "type": "number",
          "unit": "hours",
          "answer": {
            "n": 4,
            "d": 1
          }
        },
        {
          "id": "second",
          "label": "Second duration",
          "type": "number",
          "unit": "hours",
          "answer": {
            "n": 5,
            "d": 1
          }
        },
        {
          "id": "third",
          "label": "Third duration",
          "type": "number",
          "unit": "hours",
          "answer": {
            "n": 6,
            "d": 1
          }
        },
        {
          "id": "fourth",
          "label": "Fourth duration",
          "type": "number",
          "unit": "hours",
          "answer": {
            "n": 6,
            "d": 1
          }
        },
        {
          "id": "fifth",
          "label": "Fifth duration",
          "type": "number",
          "unit": "hours",
          "answer": {
            "n": 7,
            "d": 1
          }
        }
      ]
    },
    {
      "id": "median",
      "pageId": "record",
      "kind": "numeric",
      "prompt": "What is their median?",
      "context": "Use all five copied durations: 7, 6, 5, 6, 4 hours.",
      "contextRefs": [
        "record",
        "selected-times"
      ],
      "facts": [],
      "hintId": "median-hint",
      "exampleId": "median-example",
      "skipId": "median-skip",
      "match": "In order, 4, 5, 6, 6, 7. The third value is six hours, so the median is six hours.",
      "different": "Put the five values in order first. In 4, 5, 6, 6, 7 the third value is six hours.",
      "matchFacts": [],
      "differentFacts": [],
      "errors": [
        {
          "fieldId": "median",
          "value": {
            "n": 5,
            "d": 1
          },
          "reply": "Five sits in the middle of the copy as first written. The median uses the ordered list: 4, 5, 6, 6, 7, whose third value is six.",
          "facts": []
        }
      ],
      "fields": [
        {
          "id": "median",
          "label": "Median duration",
          "type": "number",
          "unit": "hours",
          "answer": {
            "n": 6,
            "d": 1
          }
        }
      ]
    },
    {
      "id": "range",
      "pageId": "record",
      "kind": "numeric",
      "prompt": "What is the range, as one number of hours?",
      "context": "Use all five copied durations: 7, 6, 5, 6, 4 hours.",
      "contextRefs": [
        "record",
        "selected-times"
      ],
      "facts": [],
      "hintId": "range-hint",
      "exampleId": "range-example",
      "skipId": "range-skip",
      "match": "The longest is seven hours and the shortest is four. 7 − 4 = 3 hours is the range.",
      "different": "The range is a difference, not either end: seven minus four is three hours.",
      "matchFacts": [],
      "differentFacts": [],
      "errors": [],
      "fields": [
        {
          "id": "range",
          "label": "Range",
          "type": "number",
          "unit": "hours",
          "answer": {
            "n": 3,
            "d": 1
          }
        }
      ]
    },
    {
      "id": "minimum",
      "pageId": "record",
      "kind": "numeric",
      "prompt": "What is the shortest recorded duration on this copy?",
      "context": "The five selected entries are A: 7, B: 6, C: 5, D: 6 and E: 4 hours.",
      "contextRefs": [
        "record",
        "selected-times"
      ],
      "facts": [],
      "hintId": "minimum-hint",
      "exampleId": "minimum-example",
      "skipId": "minimum-skip",
      "match": "Entry E lists four hours, the shortest duration on this copy. That is an observed minimum here, not a guaranteed minimum for another rise.",
      "different": "Compare the five listed values. Four hours in entry E is the shortest; that describes this copy only.",
      "matchFacts": [],
      "differentFacts": [],
      "errors": [],
      "fields": [
        {
          "id": "minimum",
          "label": "Shortest listed duration",
          "type": "number",
          "unit": "hours",
          "answer": {
            "n": 4,
            "d": 1
          }
        }
      ]
    },
    {
      "id": "below-six",
      "pageId": "record",
      "kind": "numeric",
      "prompt": "How many entries took less than six hours?",
      "context": "The copied durations are A: 7, B: 6, C: 5, D: 6 and E: 4 hours.",
      "contextRefs": [
        "record",
        "selected-times"
      ],
      "facts": [],
      "hintId": "below-six-hint",
      "exampleId": "below-six-example",
      "skipId": "below-six-skip",
      "match": "C took five hours and E took four: two of these five entries were below six. The two six-hour entries are equal to six, not below it.",
      "different": "Count only values strictly below six. Five and four qualify, so two entries qualify.",
      "matchFacts": [],
      "differentFacts": [],
      "errors": [
        {
          "fieldId": "count",
          "value": {
            "n": 1,
            "d": 1
          },
          "reply": "There are two qualifying entries: C at five hours and E at four. Count both, rather than only the shortest.",
          "facts": []
        }
      ],
      "fields": [
        {
          "id": "count",
          "label": "Number of entries below six hours",
          "type": "number",
          "unit": "entries",
          "answer": {
            "n": 2,
            "d": 1
          }
        }
      ]
    },
    {
      "id": "what-copy",
      "pageId": "record",
      "kind": "choice",
      "prompt": "Which description fits the supplied source?",
      "context": "The sheet is an undated English desk copy of five selected entries. The copier and original selection coverage are not given.",
      "contextRefs": [
        "record",
        "selected-times"
      ],
      "facts": [],
      "hintId": "what-copy-hint",
      "exampleId": "what-copy-example",
      "skipId": "what-copy-skip",
      "match": "",
      "different": "",
      "matchFacts": [],
      "differentFacts": [],
      "errors": [],
      "choices": [
        {
          "id": "every-rise",
          "text": "Five dated entries covering every rise in the valley.",
          "reply": "The copy has no dates and says the entries are selected. It does not establish a complete record of every rise."
        },
        {
          "id": "nothing-known",
          "text": "Five entries from which no duration can be read.",
          "reply": "The copy does supply a duration for each labeled entry. What it lacks includes dates, selection coverage and timing precision."
        },
        {
          "id": "selected-undated",
          "text": "Five selected entries with durations but no dates.",
          "reply": "Yes. You can read the listed durations while keeping the missing dates and selection information open."
        }
      ],
      "fit": "selected-undated"
    }
  ],
  "trays": [
    {
      "id": "support",
      "label": "Supported by this sheet"
    },
    {
      "id": "against",
      "label": "Counted against by this sheet"
    },
    {
      "id": "open",
      "label": "Not settled by this sheet"
    }
  ],
  "claims": [
    {
      "id": "all-at-least-four",
      "text": "Every duration on this copy is at least four hours.",
      "replies": {
        "support": "The listed values are 7, 6, 5, 6 and 4. Each is at least four. This supports a description of this copy, without setting a bound for another rise.",
        "against": "To count against this wording, the copy would need a listed value below four. None is listed. Notice the claim says ‘on this copy’.",
        "open": "The copy can settle this narrow description: every listed duration is at least four. What happens beyond the copy remains open."
      },
      "hintId": "all-at-least-four-hint",
      "exampleId": "all-at-least-four-example",
      "skipId": "all-at-least-four-skip"
    },
    {
      "id": "all-six",
      "text": "All five listed entries took six hours.",
      "replies": {
        "support": "B and D list six, but A lists seven, C five and E four. Those entries count against ‘all five’.",
        "against": "A, C and E are counterexamples to ‘all five’. Six is the median, not the duration of every entry.",
        "open": "The listed durations settle this claim: three of them differ from six. Missing dates do not stop that comparison."
      },
      "hintId": "all-six-hint",
      "exampleId": "all-six-example",
      "skipId": "all-six-skip"
    },
    {
      "id": "next-bound",
      "text": "The next rise will take at least four hours.",
      "replies": {
        "support": "Four is the shortest on this copy, but the copy supplies no guaranteed bound for the next rise. Supporting that promise would need evidence beyond these five entries.",
        "against": "The copy does not prove that the next rise will take less than four hours either. It leaves that future duration unresolved.",
        "open": "The next duration is not settled here. Four is an observed minimum in the selected copy, and no guaranteed future minimum is supplied."
      },
      "hintId": "next-bound-hint",
      "exampleId": "next-bound-example",
      "skipId": "next-bound-skip"
    }
  ],
  "parts": [
    {
      "id": "calculation",
      "title": "What the calculations show",
      "prompt": "Choose a result and tell the miller which assumption produced it. Include the units or the clock's day when they matter.",
      "helpId": "calculation-help",
      "exampleId": "calculation-example",
      "skipId": "calculation-skip",
      "ownReply": "Your words are here for the miller and you to read together. The game does not grade the explanation.",
      "options": [
        {
          "id": "day-result",
          "label": "Compare the day arrivals",
          "text": "On the six-hour day card, the message arrives at 12:00 and the model water arrival is 15:00 on the same day. Three hours lie between them.",
          "reply": "This names the six-hour day card and the two arrivals. It describes the supplied calculation."
        },
        {
          "id": "zero-result",
          "label": "Explain the zero interval",
          "text": "On the four-hour night card, both arrivals are 00:30 on the next day. There are zero hours between them, so this card gives no advance time.",
          "reply": "This keeps the next-day label and explains what zero means on that card."
        },
        {
          "id": "record-result",
          "label": "Describe the selected copy",
          "text": "The copied durations in order are 4, 5, 6, 6 and 7 hours. Their median is 6 hours, their range is 3 hours, and two entries are below 6 hours.",
          "reply": "This describes the five selected entries. A next event still needs its own evidence."
        }
      ]
    },
    {
      "id": "uncertainty",
      "title": "What stays uncertain",
      "prompt": "What should the miller avoid treating as a promise? Name one limit of a model or of the copied record.",
      "helpId": "uncertainty-help",
      "exampleId": "uncertainty-example",
      "skipId": "uncertainty-skip",
      "ownReply": "This uncertainty is kept in your words. The game does not decide whether your whole note is a good plan.",
      "options": [
        {
          "id": "minimum-limit",
          "label": "A minimum on this copy",
          "text": "Four hours is the shortest duration in these five selected entries. The copy does not guarantee that a later rise will take at least four hours, or prove that it will take less.",
          "reply": "This leaves both future possibilities open while keeping the observed minimum."
        },
        {
          "id": "assumption-limit",
          "label": "A fixed model assumption",
          "text": "The cards assume immediate dispatch and fixed journey durations. If those assumptions change, the time between the arrivals can change too.",
          "reply": "This names the assumptions without inventing a different real-world duration."
        },
        {
          "id": "copy-limit",
          "label": "An incomplete record",
          "text": "The copied sheet has no dates or full selection rule, and its timing precision is not given. Two of five entries below six hours is a count of these entries, not a probability for the next rise.",
          "reply": "This separates a selected count from a forecast."
        }
      ]
    },
    {
      "id": "next-record",
      "title": "What to record next",
      "prompt": "Suggest information that would make a later comparison clearer. You can leave a question rather than a rule.",
      "helpId": "next-record-help",
      "exampleId": "next-record-example",
      "skipId": "next-record-skip",
      "ownReply": "Your next-record suggestion is kept for a human conversation. It has not changed the town's records.",
      "options": [
        {
          "id": "dispatch-record",
          "label": "Separate the message's times",
          "text": "I would ask the story's record-keepers to record when the rise was noticed, when the message left and when it arrived, with dates and day labels.",
          "reply": "Those separate times would make dispatch delay and message travel time distinguishable."
        },
        {
          "id": "paired-record",
          "label": "Define the paired notices",
          "text": "I would ask how a rise is defined at each post and how precisely the two times were recorded, so we know what each duration compares.",
          "reply": "This asks what was timed, rather than assuming every recorder used the same rule."
        },
        {
          "id": "selection-record",
          "label": "Explain what was selected",
          "text": "I would ask who copied the entries, which dates they cover, how they were selected and whether any entries are missing. I would keep the original record beside the copy.",
          "reply": "This could make the copy's coverage clearer without turning it into a guaranteed future bound."
        }
      ]
    }
  ],
  "help": {
    "audio-journeys": {
      "title": "Read aloud",
      "text": "Read-aloud support recorded for this part.",
      "facts": []
    },
    "together-journeys": {
      "title": "We read this together",
      "text": "Reading together recorded as support for this part.",
      "facts": []
    },
    "audio-rates": {
      "title": "Read aloud",
      "text": "Read-aloud support recorded for this part.",
      "facts": []
    },
    "together-rates": {
      "title": "We read this together",
      "text": "Reading together recorded as support for this part.",
      "facts": []
    },
    "audio-record": {
      "title": "Read aloud",
      "text": "Read-aloud support recorded for this part.",
      "facts": []
    },
    "together-record": {
      "title": "We read this together",
      "text": "Reading together recorded as support for this part.",
      "facts": []
    },
    "audio-note": {
      "title": "Read aloud",
      "text": "Read-aloud support recorded for this part.",
      "facts": []
    },
    "together-note": {
      "title": "We read this together",
      "text": "Reading together recorded as support for this part.",
      "facts": []
    },
    "source-story": {
      "title": "A story estimate",
      "text": "A later story idea says that a rise noticed at Vadoalto is noticed at Willowbank about six hours later. ‘About’ is an estimate. This desk sometimes asks you to assume exactly six hours so that you can compare the journeys.\n\nAn exact calculation using an assumption does not make the assumption an exact prediction.",
      "facts": []
    },
    "source-journeys": {
      "title": "Four supplied journey cards",
      "text": "For each card, the messenger leaves as soon as the rise is noticed at Vadoalto. There is no dispatch delay. A day journey takes three hours; a night journey takes four hours. These are fixed journey lengths on these cards. A journey does not change length when midnight passes. The water-duration assumptions are six hours or four hours, as each question says.\n\nThe cards do not tell us how long a real messenger or a real rise would take. They do not promise time for any town job.",
      "facts": []
    },
    "source-rate": {
      "title": "An invented constant-rate route",
      "text": "For these examples only, the route is eighteen kilometers long. Try rates of three, four and a half, or two kilometers in each hour. Each rate stays the same for the whole example.\n\nThis is a constant-rate arithmetic model. It does not explain how a real river moves.",
      "facts": []
    },
    "source-record": {
      "title": "An undated English desk copy",
      "text": "Five selected entries give times between corresponding notices of rising water at the two posts: A seven hours; B six hours; C five hours; D six hours; E four hours. The dates, copier and original selection coverage are not given. Neither the exact rule for noticing a rise nor the timing precision is given.\n\nA to E are labels, not dates. This is not a list of every rise and it is not part of Nuria's first letter. It cannot be placed on the ledger's year-line.",
      "facts": []
    },
    "source-adult": {
      "title": "For a grown-up",
      "text": "Real flood warnings come from official services. This case is about how to reason with uncertain timing, not about what to do in a flood.\n\nNo kept note here becomes the town's official rule. Story events remain part of the authored story.",
      "facts": []
    },
    "day-water-hint": {
      "title": "A hint",
      "text": "Where does three hours from 09:00 land? There are three more hours to add.",
      "facts": []
    },
    "day-water-example": {
      "title": "A different example",
      "text": "A library opens at 08:00 and a four-hour visit ends at 12:00, Same day. Count forward rather than reading the starting hour as a duration.",
      "facts": []
    },
    "day-water-skip": {
      "title": "Skip for now",
      "text": "Left open for another visit. Your draft stays here; this has not added a checked response.",
      "facts": []
    },
    "day-message-hint": {
      "title": "A hint",
      "text": "Use the message's duration, not the water's six hours.",
      "facts": []
    },
    "day-message-example": {
      "title": "A different example",
      "text": "A parcel leaves at 10:30 for a two-hour trip. It arrives at 12:30, Same day; the noon hour is still written 12.",
      "facts": []
    },
    "day-message-skip": {
      "title": "Skip for now",
      "text": "Left open for another visit. Your draft stays here; this has not added a checked response.",
      "facts": []
    },
    "day-gap-hint": {
      "title": "A hint",
      "text": "Which arrival starts this interval?",
      "facts": []
    },
    "day-gap-example": {
      "title": "A different example",
      "text": "A visitor arrives at 11:00 and a show starts at 13:00. The visitor has two hours between arrival and the show, even if their trip began earlier.",
      "facts": []
    },
    "day-gap-skip": {
      "title": "Skip for now",
      "text": "Left open for another visit. Your draft stays here; this has not added a checked response.",
      "facts": []
    },
    "night-arrivals-hint": {
      "title": "A hint",
      "text": "First count from 20:30 to the next midnight. Then finish each journey separately.",
      "facts": []
    },
    "night-arrivals-example": {
      "title": "A different example",
      "text": "A five-hour trip starts at 22:00. Two hours reach midnight; three more reach 03:00, Next day. A different two-hour trip from 22:00 ends at 00:00, Next day.",
      "facts": []
    },
    "night-arrivals-skip": {
      "title": "Skip for now",
      "text": "Left open for another visit. Your draft stays here; this has not added a checked response.",
      "facts": []
    },
    "night-gap-hint": {
      "title": "A hint",
      "text": "The day has changed for both arrivals. Count forward from the message.",
      "facts": []
    },
    "night-gap-example": {
      "title": "A different example",
      "text": "A night parcel arrives at 01:30 and its reader wakes at 04:30 on that day. The interval is three hours.",
      "facts": []
    },
    "night-gap-skip": {
      "title": "Skip for now",
      "text": "Left open for another visit. Your draft stays here; this has not added a checked response.",
      "facts": []
    },
    "which-origin-hint": {
      "title": "A hint",
      "text": "Find the event named at the start of the water-duration assumption.",
      "facts": []
    },
    "which-origin-example": {
      "title": "A different example",
      "text": "A three-hour baking schedule begins when the dough is put in the oven. A message sent about the bread halfway through does not restart the baking schedule.",
      "facts": []
    },
    "which-origin-skip": {
      "title": "Skip for now",
      "text": "Left open for another visit. Your draft stays here; this has not added a checked response.",
      "facts": []
    },
    "rate-three-hint": {
      "title": "A hint",
      "text": "How many groups of three make eighteen?",
      "facts": []
    },
    "rate-three-example": {
      "title": "A different example",
      "text": "A model boat travels twenty kilometers at five kilometers each hour. Four hours gives 4 × 5 = 20 kilometers, so 20 ÷ 5 = 4 hours.",
      "facts": [
        [
          5,
          4
        ]
      ]
    },
    "rate-three-skip": {
      "title": "Skip for now",
      "text": "Left open for another visit. Your draft stays here; this has not added a checked response.",
      "facts": []
    },
    "rate-four-half-hint": {
      "title": "A hint",
      "text": "How far do two hours at 4.5 kilometers per hour go? How many more such hours reach eighteen?",
      "facts": []
    },
    "rate-four-half-example": {
      "title": "A different example",
      "text": "At 2.5 kilometers per hour, two hours cover five kilometers and four hours cover ten. Equal hours add equal distances.",
      "facts": []
    },
    "rate-four-half-skip": {
      "title": "Skip for now",
      "text": "Left open for another visit. Your draft stays here; this has not added a checked response.",
      "facts": []
    },
    "rate-two-hint": {
      "title": "A hint",
      "text": "How many twos make eighteen?",
      "facts": []
    },
    "rate-two-example": {
      "title": "A different example",
      "text": "A six-kilometer model route at two kilometers per hour takes three hours: 3 × 2 = 6 kilometers.",
      "facts": [
        [
          2,
          3
        ]
      ]
    },
    "rate-two-skip": {
      "title": "Skip for now",
      "text": "Left open for another visit. Your draft stays here; this has not added a checked response.",
      "facts": []
    },
    "fast-day-hint": {
      "title": "A hint",
      "text": "Use the new four-hour water duration. Keep the message's three-hour duration separate.",
      "facts": []
    },
    "fast-day-example": {
      "title": "A different example",
      "text": "Two scheduled journeys leave at 08:00. One takes five hours and arrives at 13:00; one takes two hours and arrives at 10:00. Their arrivals are three hours apart.",
      "facts": []
    },
    "fast-day-skip": {
      "title": "Skip for now",
      "text": "Left open for another visit. Your draft stays here; this has not added a checked response.",
      "facts": []
    },
    "fast-night-hint": {
      "title": "A hint",
      "text": "If two journeys have the same start and the same duration, compare their ends.",
      "facts": []
    },
    "fast-night-example": {
      "title": "A different example",
      "text": "Two three-hour deliveries leave at 23:00. Both arrive at 02:00, Next day, so there are zero hours between their arrivals.",
      "facts": []
    },
    "fast-night-skip": {
      "title": "Skip for now",
      "text": "Left open for another visit. Your draft stays here; this has not added a checked response.",
      "facts": []
    },
    "ordered-times-hint": {
      "title": "A hint",
      "text": "Find the shortest first, then the next shortest. Use each row once.",
      "facts": []
    },
    "ordered-times-example": {
      "title": "A different example",
      "text": "Durations 8, 2, 5, 2, 9 sort as 2, 2, 5, 8, 9. Sorting does not merge the repeated twos.",
      "facts": []
    },
    "ordered-times-skip": {
      "title": "Skip for now",
      "text": "Left open for another visit. Your draft stays here; this has not added a checked response.",
      "facts": []
    },
    "median-hint": {
      "title": "A hint",
      "text": "After ordering five entries, which position has two entries on each side?",
      "facts": []
    },
    "median-example": {
      "title": "A different example",
      "text": "For 2, 8, 4, 4, 9, the ordered list is 2, 4, 4, 8, 9. Its third value, four, is the median.",
      "facts": []
    },
    "median-skip": {
      "title": "Skip for now",
      "text": "Left open for another visit. Your draft stays here; this has not added a checked response.",
      "facts": []
    },
    "range-hint": {
      "title": "A hint",
      "text": "Find the longest and shortest, then subtract shortest from longest.",
      "facts": []
    },
    "range-example": {
      "title": "A different example",
      "text": "Durations 3, 8, 5 have range 8 − 3 = 5 hours. ‘Three to eight’ gives the ends; five gives their difference.",
      "facts": []
    },
    "range-skip": {
      "title": "Skip for now",
      "text": "Left open for another visit. Your draft stays here; this has not added a checked response.",
      "facts": []
    },
    "minimum-hint": {
      "title": "A hint",
      "text": "Which value is smaller than all the other listed values?",
      "facts": []
    },
    "minimum-example": {
      "title": "A different example",
      "text": "A selected list of journey durations 3, 5, 8 has minimum three hours. It does not prove that another journey could never take two hours.",
      "facts": []
    },
    "minimum-skip": {
      "title": "Skip for now",
      "text": "Left open for another visit. Your draft stays here; this has not added a checked response.",
      "facts": []
    },
    "below-six-hint": {
      "title": "A hint",
      "text": "Point to every value less than six. Leave the values equal to six out of this count.",
      "facts": []
    },
    "below-six-example": {
      "title": "A different example",
      "text": "In 2, 4, 4, 7, there is one value below four. The two fours are equal to four, not below it.",
      "facts": []
    },
    "below-six-skip": {
      "title": "Skip for now",
      "text": "Left open for another visit. Your draft stays here; this has not added a checked response.",
      "facts": []
    },
    "what-copy-hint": {
      "title": "A hint",
      "text": "Separate what is printed in each row from what the source note says is missing.",
      "facts": []
    },
    "what-copy-example": {
      "title": "A different example",
      "text": "A shelf list says ‘three selected books: 40, 50 and 60 pages’, with no dates. You can compare those page counts. You cannot turn it into every book read that year.",
      "facts": []
    },
    "what-copy-skip": {
      "title": "Skip for now",
      "text": "Left open for another visit. Your draft stays here; this has not added a checked response.",
      "facts": []
    },
    "all-at-least-four-hint": {
      "title": "A hint",
      "text": "Check the words ‘on this copy’, then look for a counterexample.",
      "facts": []
    },
    "all-at-least-four-example": {
      "title": "A different example",
      "text": "On a card listing 3, 5 and 8, ‘every listed value is at least three’ is supported. It says nothing about an unlisted value.",
      "facts": []
    },
    "all-at-least-four-skip": {
      "title": "Leave this card open",
      "text": "This card stays open. No tray choice or checked response was added.",
      "facts": []
    },
    "all-six-hint": {
      "title": "A hint",
      "text": "One entry different from six would be enough to challenge ‘all five’.",
      "facts": []
    },
    "all-six-example": {
      "title": "A different example",
      "text": "A card listing 2, 2 and 5 counts against ‘all three are two’, even though two occurs more often.",
      "facts": []
    },
    "all-six-skip": {
      "title": "Leave this card open",
      "text": "This card stays open. No tray choice or checked response was added.",
      "facts": []
    },
    "next-bound-hint": {
      "title": "A hint",
      "text": "Does the claim describe these rows, or make a promise about a new event?",
      "facts": []
    },
    "next-bound-example": {
      "title": "A different example",
      "text": "Five deliveries took at least two hours. That list alone proves neither that the next takes at least two hours nor that it will take less.",
      "facts": []
    },
    "next-bound-skip": {
      "title": "Leave this card open",
      "text": "This card stays open. No tray choice or checked response was added.",
      "facts": []
    },
    "calculation-help": {
      "title": "Help with this part",
      "text": "You can compare the two arrivals, explain a rate, or describe the five copied times. Use one of the actual cards rather than combining different cards by accident.",
      "facts": []
    },
    "calculation-example": {
      "title": "A different note example",
      "text": "For a four-hour library visit starting at 10:00, a clear note could say: ‘Using a four-hour visit, it ends at 14:00 on the same day.’ The assumption makes the answer readable.",
      "facts": []
    },
    "calculation-skip": {
      "title": "Leave this part open",
      "text": "This part can stay open. Keeping the note does not require an answer here.",
      "facts": []
    },
    "uncertainty-help": {
      "title": "Help with this part",
      "text": "The model holds its rate and dispatch time fixed. The copy lacks dates, selection coverage and timing precision. A shortest listed duration is not a guaranteed shortest future duration.",
      "facts": []
    },
    "uncertainty-example": {
      "title": "A different note example",
      "text": "A card says a walk usually takes twenty minutes. A note can say: ‘Twenty minutes is an estimate; this card has no guarantee for every walk.’ That is different from predicting that the next walk must be late.",
      "facts": []
    },
    "uncertainty-skip": {
      "title": "Leave this part open",
      "text": "This part can stay open. You can name a limit later.",
      "facts": []
    },
    "next-record-help": {
      "title": "Help with this part",
      "text": "Name an event, a time or a source detail you would want recorded. This is a story-record suggestion, not instructions for going near water.",
      "facts": []
    },
    "next-record-example": {
      "title": "A different note example",
      "text": "For library deliveries, a clearer record might give the date, the dispatch time and the arrival time for every selected parcel, with a note explaining how the parcels were selected.",
      "facts": []
    },
    "next-record-skip": {
      "title": "Leave this part open",
      "text": "This question can remain open. The miller can read an unfinished note.",
      "facts": []
    }
  },
  "closing": "The miller reads the page slowly. ‘There is room here for a calculation, a limit, and a question to carry on with,’ she says. ‘I'll leave room in the margin.’ Your note stays with this timing sheet for another conversation.",
  "connections": [
    {
      "id": "desk",
      "title": "Back to the desk",
      "text": "The timing question can wait while you explore somewhere else.",
      "href": "#desk"
    },
    {
      "id": "math",
      "title": "Math paths",
      "text": "",
      "href": "#pathways/math"
    },
    {
      "id": "science",
      "title": "Science paths",
      "text": "",
      "href": "#pathways/science"
    },
    {
      "id": "ledger",
      "title": "The ledger and the rain gauge",
      "text": "Read a different fictional source: heights and copied rain counts. Those years do not date the timing entries here.",
      "href": "#learn/science/ledger"
    },
    {
      "id": "notes",
      "title": "My notes",
      "text": "",
      "href": "#notes"
    }
  ]
};
export function createTimingSource(serial=1){const source=structuredClone(authored);source.id=`timing-source-${serial}`;return source;}
