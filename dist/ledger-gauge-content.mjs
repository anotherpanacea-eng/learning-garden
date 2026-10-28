// Original fictional case content; source freezes at explicit visit creation.
const authored={
  "version": 1,
  "id": "ledger-source-1",
  "title": "The ledger and the rain gauge",
  "preview": "This case shows fictional records from a later part of Willowbank's story. You can investigate them now. Reading or keeping a note here does not move the story on or choose the town's plan.",
  "story": "Wren has set out a flood ledger and a copied rain tally. What do their numbers show? Where do the records stop helping?",
  "notice": "Fictional case · later story records · your note stays in this case.",
  "introduction": "Look through the records, compare the numbers, weigh a claim, or begin a note for Wren. You can move between these pages whenever you like. Your unfinished work stays here.",
  "drawerIntroduction": "These are fictional case records and original English summaries. The summaries tell you what was copied and what is missing. Open a source while you work so someone else can follow the numbers you use.",
  "labels": {
    "year": "Hollis year",
    "height": "Height above the stated ordinary level (cm)",
    "ordinary": "The brook’s stated ordinary level at the mill post",
    "entries": "Recorded entries",
    "unavailable": "Not available from these records",
    "invalid": "Enter a number, a fraction with a positive denominator, or a decimal with up to three places. Do not enter an expression. This has not added a checked response."
  },
  "units": {
    "cm": "cm",
    "entries": "entries"
  },
  "pages": [
    {
      "id": "records",
      "role": "records",
      "title": "Read the ledger",
      "learn": [
        {
          "id": "records-learn-1",
          "text": "The bottom line marks Hollis's years. A gap of ten years takes the same space wherever it appears. Each bar is one recorded flood, placed at its year. The height scale is in centimeters above the stated ordinary level. Read the labelled scale to compare bar heights.",
          "facts": []
        },
        {
          "id": "records-learn-2",
          "text": "The year 22 marker shows when the two changes were recorded. A year without a bar means no flood was entered here. It does not mean the water height was zero.",
          "facts": []
        },
        {
          "id": "records-learn-3",
          "text": "The later 160 cm storm has its own labelled place beside the plot. It has no supplied Hollis year, so it does not sit on the year line.",
          "facts": []
        },
        {
          "id": "records-learn-4",
          "text": "A mean shares a total equally among its values. Add the values, then divide by how many values there are. A repeated value still counts each time it appears.",
          "facts": []
        },
        {
          "id": "records-learn-5",
          "text": "Imagine three marker strips with heights 30, 50 and 70. Moving pieces between the strips until they are level gives three strips of 50. This models the arithmetic of heights. It does not model moving real floodwater.",
          "facts": []
        },
        {
          "id": "records-learn-6",
          "text": "The same calculation is (30 + 50 + 70) ÷ 3 = 150 ÷ 3 = 50.",
          "facts": []
        },
        {
          "id": "records-learn-7",
          "text": "The range tells us the distance from the lowest recorded value to the highest: highest minus lowest. It is one way to describe the spread. It does not describe every detail of the group.",
          "facts": []
        },
        {
          "id": "records-learn-8",
          "text": "Before year 22, the ledger has two heights: 40 and 60 cm. Their total is 100 cm. Their mean is exactly 100 ÷ 2 = 50 cm. The lowest is 40 cm, the highest is 60 cm, and the range is 20 cm.",
          "facts": []
        },
        {
          "id": "records-learn-9",
          "text": "From year 22 through year 40, the ledger has five heights: 120, 80, 120, 140 and 100 cm. Count both entries of 120. Their total is 560 cm. Their mean is exactly 560 ÷ 5 = 112 cm. The lowest is 80 cm, the highest is 140 cm, and the range is 60 cm.",
          "facts": []
        },
        {
          "id": "records-learn-10",
          "text": "The later group's recorded mean and maximum are higher. The difference between the recorded means is 112 − 50 = 62 cm. These calculations describe the entries we have. They do not estimate how much a particular change caused the water to rise.",
          "facts": []
        },
        {
          "id": "records-learn-11",
          "text": "We can be certain that 40 and 60 have a mean of 50. A different question is whether those two selected entries describe all earlier floods well. Hollis may have left smaller floods unwritten, and the recording rule is unknown. One more entry could change the mean. More entries alone would not fix an unknown selection rule.",
          "facts": []
        },
        {
          "id": "records-learn-12",
          "text": "Before year 22 means years 1 through 21: 21 years. The later period means years 22 through 40: 19 years. There are two recorded floods in the first period and five in the second.",
          "facts": []
        },
        {
          "id": "records-learn-13",
          "text": "The recorded count more than doubled. Because the periods have different lengths, give both counts and both lengths when you compare them: “2 recorded floods in 21 years, then 5 in 19 years.” That lets a reader see what was counted.",
          "facts": []
        }
      ],
      "guided": [
        {
          "id": "records-guided-1",
          "text": "Count the written entries on each side of year 22: years 4 and 15 give two before; 27, 31, 34, 36 and 38 give five later. Unwritten years are not zero-height observations.",
          "facts": []
        }
      ],
      "guidedFor": {
        "kind": "task",
        "id": "entry-counts"
      }
    },
    {
      "id": "rain",
      "role": "rain",
      "title": "Set the records together",
      "learn": [
        {
          "id": "rain-learn-1",
          "text": "A ten-year group includes both of its named end years. Years 1 to 10 includes year 4. Years 11 to 20 includes year 15. Years 21 to 30 includes year 27. Years 31 to 40 includes years 31, 34, 36 and 38.",
          "facts": []
        },
        {
          "id": "rain-learn-2",
          "text": "To find a group's highest recorded flood, compare only the ledger entries inside that group. Do not enter zero for an unwritten year or add the separate later storm.",
          "facts": []
        },
        {
          "id": "rain-learn-3",
          "text": "Years 1 to 10 and years 21 to 30 each have six recorded big-rain events and one recorded flood. The recorded flood heights are 40 and 120 cm. The second recorded rise above ordinary level is three times the first. That does not mean three times the water, damage, or danger.",
          "facts": []
        },
        {
          "id": "rain-learn-4",
          "text": "The count of six does not hold rainfall constant. We do not know the amounts, durations, or threshold, and the tally comes from Vadoalto. Years 21 to 30 also straddles year 22. It is not a group made entirely of years after the changes.",
          "facts": []
        },
        {
          "id": "rain-learn-5",
          "text": "Years 31 to 40 has the largest recorded big-rain count, eight, and the largest recorded flood count, four. These quantities occur together in this table. The table does not show that one caused the other.",
          "facts": []
        }
      ],
      "guided": [
        {
          "id": "rain-guided-1",
          "text": "Years 1–10 contains year 4 only. The supplied first group therefore has 1 recorded entry and maximum 40 cm.",
          "facts": []
        }
      ],
      "guidedFor": {
        "kind": "task",
        "id": "period-one"
      }
    },
    {
      "id": "claims",
      "role": "claims",
      "title": "Weigh a claim",
      "learn": [
        {
          "id": "claims-learn-1",
          "text": "A claim is a sentence someone asks us to accept. Look for a number or a source phrase that bears on it.",
          "facts": []
        },
        {
          "id": "claims-learn-2",
          "text": "The records support this: the record gives evidence for the sentence as written.",
          "facts": []
        },
        {
          "id": "claims-learn-3",
          "text": "The records count against this: an entry or source phrase gives evidence against the sentence as written.",
          "facts": []
        },
        {
          "id": "claims-learn-4",
          "text": "The records cannot tell: the needed information is missing, or more than one explanation still fits.",
          "facts": []
        },
        {
          "id": "claims-learn-5",
          "text": "You can try any tray and read the reply. There is no score. The replies do not make every reading equally supported: they show what evidence fits, what conflicts, and what remains open.",
          "facts": []
        },
        {
          "id": "claims-learn-6",
          "text": "A pattern after year 22 can suggest a question about causes. It cannot separate two changes made in the same year. Rainfall, recording choices, and other differences may matter too. Uncertainty about cause is different from having no useful observations.",
          "facts": []
        }
      ],
      "guided": []
    },
    {
      "id": "note",
      "role": "note",
      "title": "Write an evidence note",
      "learn": [
        {
          "id": "note-learn-1",
          "text": "Give a reader a route from your claim to your evidence. Name the source and point to a number or phrase. Then explain why it matters.",
          "facts": []
        },
        {
          "id": "note-learn-2",
          "text": "A plan recommendation also contains a judgement about what to value. The records can inform that judgement without proving a plan will work. Call it provisional if you may revise it.",
          "facts": []
        },
        {
          "id": "note-learn-3",
          "text": "An objection is a serious reason someone could give against your recommendation. Answer it fairly. You can agree with part of it, say what is still missing, or change your recommendation.",
          "facts": []
        },
        {
          "id": "note-learn-4",
          "text": "State an uncertainty precisely. “The rain amounts are missing” tells us more than “we know nothing.” Propose a new record that addresses that gap, and say what it would still leave open.",
          "facts": []
        }
      ],
      "guided": []
    }
  ],
  "sources": [
    {
      "id": "H",
      "title": "Hollis's selected flood ledger",
      "label": "Selected flood ledger · fictional source",
      "text": "Hollis recorded these water heights at the mill's flood post. Each height is centimeters above the brook's stated ordinary level. The years count from the beginning of Hollis's keeping.\n\n“Years not written had no flood worth the ink.”\n\nThis is a selected record, not a list of every flood. Hollis does not say how a flood became “worth the ink” or whether that choice stayed the same. An unwritten year is not a height of zero. The extract also does not tell us whether the post, measuring method, or meaning of ordinary level stayed unchanged throughout the record.\n\nName Hollis's ledger and give the year or group you used. For example: “Hollis's ledger records 140 cm in year 36.”",
      "limit": "Name Hollis's ledger and give the year or group you used. For example: “Hollis's ledger records 140 cm in year 36.”",
      "reference": "Fictional case record; original English summary."
    },
    {
      "id": "Y",
      "title": "Hollis's year 22 note",
      "label": "Two changes in one year · fictional source",
      "text": "“Year 22. The Sponge is drained and the brook cut straight past the new fields.”\n\nHollis places two changes in year 22: draining the Sponge and straightening the brook. The Sponge was a marsh where some orchard fields now stand. This note records when the changes happened. It does not measure the separate effect of either change on later floods.\n\nA comparison across year 22 includes both changes, along with anything else that differed between those years. It cannot separate drainage from straightening by itself.",
      "limit": "A comparison across year 22 includes both changes, along with anything else that differed between those years. It cannot separate drainage from straightening by itself.",
      "reference": "Fictional case record; original English summary."
    },
    {
      "id": "N",
      "title": "Nuria's copied rain tally",
      "label": "Copied tally from Vadoalto · fictional source",
      "text": "Nuria's copy groups Vadoalto's recorded big-rain events into ten-year stretches aligned with Hollis's years. Vadoalto is upstream of Willowbank. This is a tally of events at another place.\n\nThe extract does not say what amount or duration counted as “big rain.” It gives no rainfall amounts, event dates, or storm durations. The missing threshold is part of this copied record. We must not fill it in with a guess.\n\nEqual event counts need not mean equal rainfall. These decade totals cannot tell us the exact number of big-rain events before and after year 22, or which event went with which flood. They do not measure rain at Willowbank.",
      "limit": "Equal event counts need not mean equal rainfall. These decade totals cannot tell us the exact number of big-rain events before and after year 22, or which event went with which flood. They do not measure rain at Willowbank.",
      "reference": "Fictional case record; original English summary."
    },
    {
      "id": "S",
      "title": "The later storm note",
      "label": "Later added measurement · fictional source",
      "text": "A town note added after Hollis's keeping records the later storm at 160 cm above the stated ordinary level. No Hollis-year coordinate is supplied for it.\n\nKeep this measurement separate from the seven dated ledger entries. It cannot be placed at year 40 or 41, and it is not one of the five entries used for the after mean of 112 cm. The extract does not establish instrument or baseline consistency between this note and Hollis's earlier measurements.\n\nLater storm: 160 cm · outside Hollis's keeping · year coordinate not supplied.",
      "limit": "Later storm: 160 cm · outside Hollis's keeping · year coordinate not supplied.",
      "reference": "Fictional case record; original English summary."
    },
    {
      "id": "P",
      "title": "Three fictional proposals",
      "label": "Proposed aims and costs · fictional case summary",
      "text": "These proposals describe choices the fictional town could consider. The ledger and tally have not tested how well any proposal would work. Choosing a draft recommendation means weighing an aim and a cost while keeping that uncertainty visible.\n\nBuild a higher flood wall along the brook. The proposal aims to protect the town while keeping the orchard as it is. It asks the town to build the wall. These records do not show what height would work or what would happen at its ends.\n\nLet the lowest orchard fields return to marsh. The proposal aims to give water more room. Some trees would be lost, and the proposal includes a reed trade with Vadoalto. These records do not show how much difference the marsh would make or whether the trade would replace what is lost.\n\nBuild a lower wall upstream of the mill and make a smaller wet meadow at the low corner. The proposal combines two aims on a smaller scale. It still asks for wall building and some orchard land. These records do not show whether that combination would be enough.",
      "limit": "These proposals describe choices the fictional town could consider. The ledger and tally have not tested how well any proposal would work. Choosing a draft recommendation means weighing an aim and a cost while keeping that uncertainty visible.",
      "reference": "Fictional case record; original English summary."
    }
  ],
  "records": {
    "firstYear": 1,
    "lastYear": 40,
    "changeYear": 22,
    "changeText": "Both changes: Sponge drained and brook straightened",
    "selectionNote": "Years not written had no flood worth the ink.",
    "limit": "Selected entries; missing years are not zero heights. The recording threshold and consistency of the measuring method are unknown.",
    "events": [
      {
        "id": "event-4",
        "year": 4,
        "height": 40
      },
      {
        "id": "event-15",
        "year": 15,
        "height": 60
      },
      {
        "id": "event-27",
        "year": 27,
        "height": 120
      },
      {
        "id": "event-31",
        "year": 31,
        "height": 80
      },
      {
        "id": "event-34",
        "year": 34,
        "height": 120
      },
      {
        "id": "event-36",
        "year": 36,
        "height": 140
      },
      {
        "id": "event-38",
        "year": 38,
        "height": 100
      }
    ],
    "intervals": [
      {
        "id": "interval-1",
        "label": "1–10",
        "firstYear": 1,
        "lastYear": 10,
        "rainCount": 6
      },
      {
        "id": "interval-2",
        "label": "11–20",
        "firstYear": 11,
        "lastYear": 20,
        "rainCount": 5
      },
      {
        "id": "interval-3",
        "label": "21–30",
        "firstYear": 21,
        "lastYear": 30,
        "rainCount": 6
      },
      {
        "id": "interval-4",
        "label": "31–40",
        "firstYear": 31,
        "lastYear": 40,
        "rainCount": 8
      }
    ],
    "storm": {
      "id": "later-storm",
      "height": 160,
      "label": "Later storm: 160 cm · outside Hollis’s keeping · year coordinate not supplied.",
      "limit": "Outside the seven dated entries and their means; instrument and baseline consistency are not established."
    }
  },
  "model": {
    "mode": "levelling",
    "id": "levelling",
    "title": "A supplied levelling example",
    "unitValue": 10,
    "unit": "cm",
    "stages": [
      {
        "id": "stage-1",
        "counts": [
          3,
          5,
          7
        ],
        "text": "Three stacks of 3, 5 and 7 blocks. Each block represents 10 cm of an example height."
      },
      {
        "id": "stage-2",
        "counts": [
          4,
          5,
          6
        ],
        "text": "Move one block from the tallest to the shortest: 4, 5 and 6 blocks. The total stays 15 blocks."
      },
      {
        "id": "stage-3",
        "counts": [
          5,
          5,
          5
        ],
        "text": "Move one more block: 5, 5 and 5. Three equal stacks share 15 blocks: 5 blocks, or 50 cm, each."
      }
    ],
    "limit": "This supplied example models arithmetic of heights. No real floodwater is moved, and a height mean is not a physical prediction."
  },
  "tasks": [
    {
      "id": "entry-counts",
      "pageId": "records",
      "kind": "numeric",
      "prompt": "How many recorded entries are before and after year 22?",
      "context": "Use the selected dated ledger entries; the separate later storm is excluded.",
      "facts": [],
      "hintId": "entry-counts-hint",
      "exampleId": "entry-counts-example",
      "skipId": "entry-counts-skip",
      "match": "Two entries are in years 1–21: 4 and 15. Five are in years 22–40: 27, 31, 34, 36, 38. These are recorded entries, not a complete flood count.",
      "different": "Count the written years on each side of 22. Years 4 and 15 are before; 27, 31, 34, 36, 38 are in the later period. An unwritten year is not another flood entry.",
      "errors": [],
      "fields": [
        {
          "id": "before",
          "label": "Earlier recorded entries",
          "unit": "entries",
          "answer": {
            "n": 2,
            "d": 1
          }
        },
        {
          "id": "after",
          "label": "Later recorded entries",
          "unit": "entries",
          "answer": {
            "n": 5,
            "d": 1
          }
        }
      ]
    },
    {
      "id": "mean-before",
      "pageId": "records",
      "kind": "numeric",
      "prompt": "Find the mean of the two earlier recorded heights.",
      "context": "Use the selected dated ledger entries; the separate later storm is excluded.",
      "facts": [],
      "hintId": "mean-before-hint",
      "exampleId": "mean-before-example",
      "skipId": "mean-before-skip",
      "match": "40 + 60 = 100 cm in total; 100 ÷ 2 = 50 cm. That is the exact mean of these two entries.",
      "different": "Add the two written heights, 40 and 60, then divide their 100 cm total by 2 entries. Dividing by 21 years answers a different question.",
      "errors": [],
      "fields": [
        {
          "id": "mean",
          "label": "Earlier mean",
          "unit": "cm",
          "answer": {
            "n": 50,
            "d": 1
          }
        }
      ]
    },
    {
      "id": "mean-after",
      "pageId": "records",
      "kind": "numeric",
      "prompt": "Find the mean of the five later recorded heights.",
      "context": "Use the selected dated ledger entries; the separate later storm is excluded.",
      "facts": [],
      "hintId": "mean-after-hint",
      "exampleId": "mean-after-example",
      "skipId": "mean-after-skip",
      "match": "120 + 80 + 120 + 140 + 100 = 560 cm; 560 ÷ 5 = 112 cm. Both 120 cm entries count. The separate storm is excluded.",
      "different": "Use the five dated later entries. Add both entries of 120 cm, then 80, 140 and 100 cm, then divide their 560 cm total by 5 entries. The later storm is a separate note.",
      "errors": [
        {
          "fieldId": "mean",
          "value": {
            "n": 120,
            "d": 1
          },
          "reply": "120 is the middle and most frequent later height. Including the separate 160 cm storm would also give a different six-entry mean of 120. We cannot tell how you found it. The question uses five dated ledger entries."
        },
        {
          "fieldId": "mean",
          "value": {
            "n": 140,
            "d": 1
          },
          "reply": "140 is the largest later height. The mean shares the total across all five entries."
        },
        {
          "fieldId": "mean",
          "value": {
            "n": 560,
            "d": 1
          },
          "reply": "560 is the total of the five heights. Divide that total by five to find their mean."
        }
      ],
      "fields": [
        {
          "id": "mean",
          "label": "Later mean",
          "unit": "cm",
          "answer": {
            "n": 112,
            "d": 1
          }
        }
      ]
    },
    {
      "id": "ranges",
      "pageId": "records",
      "kind": "numeric",
      "prompt": "Find the earlier and later recorded ranges.",
      "context": "Use the selected dated ledger entries; the separate later storm is excluded.",
      "facts": [],
      "hintId": "ranges-hint",
      "exampleId": "ranges-example",
      "skipId": "ranges-skip",
      "match": "The earlier range is 60 − 40 = 20 cm. The later range is 140 − 80 = 60 cm. These describe the two recorded groups.",
      "different": "Use highest minus lowest within each group. Earlier: 60 − 40. Later: 140 − 80. A maximum alone is not a range.",
      "errors": [],
      "fields": [
        {
          "id": "before",
          "label": "Earlier range",
          "unit": "cm",
          "answer": {
            "n": 20,
            "d": 1
          }
        },
        {
          "id": "after",
          "label": "Later range",
          "unit": "cm",
          "answer": {
            "n": 60,
            "d": 1
          }
        }
      ]
    },
    {
      "id": "mean-difference",
      "pageId": "records",
      "kind": "numeric",
      "prompt": "How far apart are the two recorded means?",
      "context": "Use the selected dated ledger entries; the separate later storm is excluded.",
      "facts": [],
      "hintId": "mean-difference-hint",
      "exampleId": "mean-difference-example",
      "skipId": "mean-difference-skip",
      "match": "The two recorded means are 112 and 50 cm. Their difference is 112 − 50 = 62 cm; this is not a measured causal effect.",
      "different": "Subtract the earlier mean 50 from the later mean 112. Reporting either mean alone does not give the difference.",
      "errors": [],
      "fields": [
        {
          "id": "difference",
          "label": "Difference in recorded means",
          "unit": "cm",
          "answer": {
            "n": 62,
            "d": 1
          }
        }
      ]
    },
    {
      "id": "count-periods",
      "pageId": "records",
      "kind": "choice",
      "prompt": "Which sentence keeps the counts and time periods clear?",
      "context": "Use the selected dated ledger entries; the separate later storm is excluded.",
      "facts": [],
      "hintId": "count-periods-hint",
      "exampleId": "count-periods-example",
      "skipId": "count-periods-skip",
      "match": "The selected sentence fits these supplied records.",
      "different": "Compare the selected sentence with the supplied records.",
      "errors": [],
      "fit": "count-periods-2",
      "choices": [
        {
          "id": "count-periods-1",
          "text": "Comparing 5 with 2 alone gives the change in floods per year.",
          "reply": "5 and 2 are counts. Their periods contain 19 and 21 years. A count-per-year comparison must also use those lengths."
        },
        {
          "id": "count-periods-2",
          "text": "There are 2 recorded entries in 21 years, then 5 in 19 years.",
          "reply": "This gives both counts and both period lengths. A reader can see the comparison without pretending every flood was recorded."
        },
        {
          "id": "count-periods-3",
          "text": "Different period lengths prevent any useful count comparison.",
          "reply": "We can still report 2 in 21 years and 5 in 19 years. Naming the lengths makes the limitation visible instead of discarding the counts."
        }
      ]
    },
    {
      "id": "mean-limit",
      "pageId": "records",
      "kind": "choice",
      "prompt": "What does the earlier 50 cm mean establish?",
      "context": "Use the selected dated ledger entries; the separate later storm is excluded.",
      "facts": [],
      "hintId": "mean-limit-hint",
      "exampleId": "mean-limit-example",
      "skipId": "mean-limit-skip",
      "match": "The selected sentence fits these supplied records.",
      "different": "Compare the selected sentence with the supplied records.",
      "errors": [],
      "fit": "mean-limit-3",
      "choices": [
        {
          "id": "mean-limit-1",
          "text": "It is the mean of every flood in those 21 years.",
          "reply": "Hollis did not record every flood. 50 cm is the mean of 40 and 60, not a known mean of all earlier floods."
        },
        {
          "id": "mean-limit-2",
          "text": "Nothing numerical can be said about just two recorded values.",
          "reply": "We can calculate the mean of these values: 100 ÷ 2 = 50 cm. The limit concerns generalising beyond them."
        },
        {
          "id": "mean-limit-3",
          "text": "It is the exact mean of the two written heights.",
          "reply": "40 and 60 have total 100; 100 ÷ 2 = 50 cm. The arithmetic is exact for those entries, while unwritten floods remain unknown."
        }
      ]
    },
    {
      "id": "unwritten-years",
      "pageId": "records",
      "kind": "choice",
      "prompt": "What height belongs to an unwritten year?",
      "context": "Use the selected dated ledger entries; the separate later storm is excluded.",
      "facts": [],
      "hintId": "unwritten-years-hint",
      "exampleId": "unwritten-years-example",
      "skipId": "unwritten-years-skip",
      "match": "The selected sentence fits these supplied records.",
      "different": "Compare the selected sentence with the supplied records.",
      "errors": [],
      "fit": "unwritten-years-1",
      "choices": [
        {
          "id": "unwritten-years-1",
          "text": "The height is not known from this ledger.",
          "reply": "The note says no flood was worth the ink. It gives no fixed threshold or height for an unwritten year."
        },
        {
          "id": "unwritten-years-2",
          "text": "Use 0 cm because there is no entry.",
          "reply": "No entry is missing information, not a measurement of 0 cm. Hollis's selection note does not give that height."
        },
        {
          "id": "unwritten-years-3",
          "text": "Use the nearest written year's height.",
          "reply": "A neighbouring entry does not measure this year. No interpolation rule or observation supplies its height."
        }
      ]
    },
    {
      "id": "period-one",
      "pageId": "rain",
      "kind": "numeric",
      "prompt": "How many recorded entries and what maximum height are in years 1–10?",
      "context": "Compare the supplied interval with Hollis’s ledger and Nuria’s copied event count. Rain-event counts are not rainfall amounts.",
      "facts": [],
      "hintId": "period-one-hint",
      "exampleId": "period-one-example",
      "skipId": "period-one-skip",
      "match": "Year 4 is the only entry in years 1–10. This group has 1 recorded entry and maximum 40 cm.",
      "different": "Use only years 1–10. The ledger entry at year 4 has height 40 cm. Unwritten years add no known heights.",
      "errors": [],
      "fields": [
        {
          "id": "count",
          "label": "Recorded entries",
          "unit": "entries",
          "answer": {
            "n": 1,
            "d": 1
          }
        },
        {
          "id": "maximum",
          "label": "Maximum recorded height",
          "unit": "cm",
          "answer": {
            "n": 40,
            "d": 1
          }
        }
      ]
    },
    {
      "id": "period-two",
      "pageId": "rain",
      "kind": "numeric",
      "prompt": "How many recorded entries and what maximum height are in years 11–20?",
      "context": "Compare the supplied interval with Hollis’s ledger and Nuria’s copied event count. Rain-event counts are not rainfall amounts.",
      "facts": [],
      "hintId": "period-two-hint",
      "exampleId": "period-two-example",
      "skipId": "period-two-skip",
      "match": "Year 15 is the only entry in years 11–20. This group has 1 recorded entry and maximum 60 cm.",
      "different": "Use only years 11–20. Year 15 belongs here; year 4 and year 27 do not. The one supplied height is 60 cm.",
      "errors": [],
      "fields": [
        {
          "id": "count",
          "label": "Recorded entries",
          "unit": "entries",
          "answer": {
            "n": 1,
            "d": 1
          }
        },
        {
          "id": "maximum",
          "label": "Maximum recorded height",
          "unit": "cm",
          "answer": {
            "n": 60,
            "d": 1
          }
        }
      ]
    },
    {
      "id": "period-three",
      "pageId": "rain",
      "kind": "numeric",
      "prompt": "How many recorded entries and what maximum height are in years 21–30?",
      "context": "Compare the supplied interval with Hollis’s ledger and Nuria’s copied event count. Rain-event counts are not rainfall amounts.",
      "facts": [],
      "hintId": "period-three-hint",
      "exampleId": "period-three-example",
      "skipId": "period-three-skip",
      "match": "Year 27 is the only entry in years 21–30. This group has 1 recorded entry and maximum 120 cm. The interval straddles year 22.",
      "different": "Use all of 21–30, not just the years before 22. The only written flood here is year 27 at 120 cm.",
      "errors": [],
      "fields": [
        {
          "id": "count",
          "label": "Recorded entries",
          "unit": "entries",
          "answer": {
            "n": 1,
            "d": 1
          }
        },
        {
          "id": "maximum",
          "label": "Maximum recorded height",
          "unit": "cm",
          "answer": {
            "n": 120,
            "d": 1
          }
        }
      ]
    },
    {
      "id": "period-four",
      "pageId": "rain",
      "kind": "numeric",
      "prompt": "How many recorded entries and what maximum height are in years 31–40?",
      "context": "Compare the supplied interval with Hollis’s ledger and Nuria’s copied event count. Rain-event counts are not rainfall amounts.",
      "facts": [],
      "hintId": "period-four-hint",
      "exampleId": "period-four-example",
      "skipId": "period-four-skip",
      "match": "Years 31, 34, 36, 38 give 4 entries. Their heights 80, 120, 140, 100 cm have maximum 140 cm.",
      "different": "Count 31, 34, 36, 38 and compare 80, 120, 140, 100 cm. Year 27 belongs to the preceding interval, and the separate storm has no supplied Hollis year.",
      "errors": [],
      "fields": [
        {
          "id": "count",
          "label": "Recorded entries",
          "unit": "entries",
          "answer": {
            "n": 4,
            "d": 1
          }
        },
        {
          "id": "maximum",
          "label": "Maximum recorded height",
          "unit": "cm",
          "answer": {
            "n": 140,
            "d": 1
          }
        }
      ]
    },
    {
      "id": "equal-tallies",
      "pageId": "rain",
      "kind": "choice",
      "prompt": "Which periods have the same recorded big-rain count?",
      "context": "Compare the supplied interval with Hollis’s ledger and Nuria’s copied event count. Rain-event counts are not rainfall amounts.",
      "facts": [],
      "hintId": "equal-tallies-hint",
      "exampleId": "equal-tallies-example",
      "skipId": "equal-tallies-skip",
      "match": "The selected sentence fits these supplied records.",
      "different": "Compare the selected sentence with the supplied records.",
      "errors": [],
      "fit": "equal-tallies-2",
      "choices": [
        {
          "id": "equal-tallies-1",
          "text": "Years 11–20 and 31–40.",
          "reply": "Those counts are 5 and 8. They differ; compare the event-count row rather than the flood-height row."
        },
        {
          "id": "equal-tallies-2",
          "text": "Years 1–10 and 21–30.",
          "reply": "Both copied tallies are 6. Equal counts do not establish equal rainfall amounts or duration."
        },
        {
          "id": "equal-tallies-3",
          "text": "Years 11–20 and 21–30.",
          "reply": "Those counts are 5 and 6. The two periods with 6 are 1–10 and 21–30."
        }
      ]
    },
    {
      "id": "recorded-changes",
      "pageId": "rain",
      "kind": "choice",
      "prompt": "Which changes does Hollis explicitly record at year 22?",
      "context": "Compare the supplied interval with Hollis’s ledger and Nuria’s copied event count. Rain-event counts are not rainfall amounts.",
      "facts": [],
      "hintId": "recorded-changes-hint",
      "exampleId": "recorded-changes-example",
      "skipId": "recorded-changes-skip",
      "match": "The selected sentence fits these supplied records.",
      "different": "Compare the selected sentence with the supplied records.",
      "errors": [],
      "fit": "recorded-changes-3",
      "choices": [
        {
          "id": "recorded-changes-1",
          "text": "The two periods had equal rainfall totals.",
          "reply": "The tally gives event counts, not rainfall totals. Neither record says those totals were equal."
        },
        {
          "id": "recorded-changes-2",
          "text": "The Sponge was drained; the brook otherwise stayed unchanged.",
          "reply": "The same sentence records that the brook was cut straight. Omitting it hides a simultaneous change."
        },
        {
          "id": "recorded-changes-3",
          "text": "The Sponge was drained and the brook was straightened.",
          "reply": "The year 22 sentence records both changes. It does not separate either one's effect on the later heights."
        }
      ]
    },
    {
      "id": "straddling-period",
      "pageId": "rain",
      "kind": "choice",
      "prompt": "Where does period 21–30 sit beside the change at 22?",
      "context": "Compare the supplied interval with Hollis’s ledger and Nuria’s copied event count. Rain-event counts are not rainfall amounts.",
      "facts": [],
      "hintId": "straddling-period-hint",
      "exampleId": "straddling-period-example",
      "skipId": "straddling-period-skip",
      "match": "The selected sentence fits these supplied records.",
      "different": "Compare the selected sentence with the supplied records.",
      "errors": [],
      "fit": "straddling-period-1",
      "choices": [
        {
          "id": "straddling-period-1",
          "text": "It includes years on both sides of 22.",
          "reply": "Year 21 is before 22; 22 through 30 belong to the later period. The whole interval cannot be called wholly before or wholly after."
        },
        {
          "id": "straddling-period-2",
          "text": "Every year in it is after the change.",
          "reply": "Year 21 is in the interval and comes before 22. The decade total cannot be treated as an entirely later rain total."
        },
        {
          "id": "straddling-period-3",
          "text": "Every year in it is before the change.",
          "reply": "Years 22 through 30 are also in this interval. It spans the boundary rather than ending before it."
        }
      ]
    }
  ],
  "trays": [
    {
      "id": "support",
      "label": "The records support this"
    },
    {
      "id": "against",
      "label": "The records count against this"
    },
    {
      "id": "unknown",
      "label": "The records cannot tell us"
    }
  ],
  "claims": [
    {
      "id": "C1",
      "text": "The recorded mean and maximum flood heights were higher after year 22.",
      "replies": {
        "support": "Hollis's two earlier entries have mean 50 cm and maximum 60 cm. The five later entries have mean 112 cm and maximum 140 cm. Both summaries are higher. This describes selected entries, not the cause of the difference or every flood that happened.",
        "against": "Compare the summaries in the ledger: 50 to 112 cm for the means, and 60 to 140 cm for the maxima. Those numbers support this sentence. Hollis's missing entries limit what we can say about all floods, but they do not reverse this comparison of the recorded groups.",
        "unknown": "We can calculate this comparison from the entries: mean 50 cm and maximum 60 cm before, mean 112 cm and maximum 140 cm after. What we cannot tell is how well the selected record describes all floods or what caused the difference."
      },
      "hintId": "claim-hint",
      "exampleId": "claim-example"
    },
    {
      "id": "C2",
      "text": "The last ten years had more recorded big-rain events at Vadoalto.",
      "replies": {
        "support": "Nuria's copied tally gives eight events in years 31 to 40, compared with six, five and six in the other ten-year groups. It supports a larger recorded event count, not a larger measured rainfall total.",
        "against": "The last tally is eight; the earlier tallies are six, five and six. Those counts support the sentence. The missing big-rain threshold limits what the counts mean, but there is no larger count elsewhere in this extract.",
        "unknown": "The tally does let us compare its recorded counts: eight is greater than six, five and six. It cannot tell us the rainfall amounts or whether the same threshold was used throughout. Those are different claims from this one."
      },
      "hintId": "claim-hint",
      "exampleId": "claim-example"
    },
    {
      "id": "C3",
      "text": "Rain alone explains the higher floods.",
      "replies": {
        "support": "Years 31 to 40 has eight big-rain events and four recorded floods. That gives a pattern to investigate, but it does not establish “rain alone.” The copy lacks rainfall amounts and durations, and Hollis records drainage and straightening in year 22.",
        "against": "The two groups with six big-rain events have recorded flood heights of 40 and 120 cm. That challenges an argument based only on event counts. It does not rule out rain alone, because six events could contain different amounts or durations of rain. We cannot settle the claim here.",
        "unknown": "The tally has counts of six, five, six and eight, but no amounts or durations. Hollis also records two changes in year 22. These sources do not establish or rule out rain as the sole explanation of the higher recorded mean and maximum."
      },
      "hintId": "claim-hint",
      "exampleId": "claim-example"
    },
    {
      "id": "C4",
      "text": "Draining the Sponge was the only cause.",
      "replies": {
        "support": "The ledger's mean rises from 50 to 112 cm across year 22, when the Sponge was drained. But Hollis's note also says the brook was cut straight that year, and the rain copy lacks amounts. The timing does not establish drainage as the only cause.",
        "against": "Hollis names straightening as well as drainage in year 22. That gives us another change to investigate, not proof that straightening caused the difference. These records cannot confirm “only,” and they cannot rule it out by measuring separate effects either.",
        "unknown": "Hollis's year 22 note places drainage and straightening together. Neither source separates their effects, and Nuria's event counts do not hold rainfall constant. “Only cause” goes beyond what the records can decide."
      },
      "hintId": "claim-hint",
      "exampleId": "claim-example"
    },
    {
      "id": "C5",
      "text": "Draining the Sponge made floods worse.",
      "replies": {
        "support": "The recorded mean is 50 cm before year 22 and 112 cm after. That makes drainage worth investigating. It does not show that drainage caused the rise: straightening happened in the same year, rainfall details are missing, and Hollis selected which floods to record.",
        "against": "The ledger does not show lower later summaries: its mean rises from 50 to 112 cm and its maximum from 60 to 140 cm. But those rises do not measure drainage's effect. The records leave this causal claim open rather than showing it false.",
        "unknown": "Hollis records higher later mean and maximum heights, and drainage in year 22. Straightening happened then too, and the rainfall and recording details are incomplete. We can describe the pattern without deciding whether drainage made the floods worse."
      },
      "hintId": "claim-hint",
      "exampleId": "claim-example"
    },
    {
      "id": "C6",
      "text": "Straightening the brook made floods worse.",
      "replies": {
        "support": "Hollis's note says the brook was cut straight in year 22, before the five later recorded floods. Their mean is 112 cm against 50 cm earlier. The same note records drainage too. The sources do not isolate straightening's effect.",
        "against": "The ledger's later mean and maximum are higher, so it does not supply a simple lower-after pattern against this claim. Yet the numbers do not measure the effect of straightening. With drainage in the same year and rain details missing, the claim remains unresolved.",
        "unknown": "Straightening and drainage share year 22 in Hollis's note. We have no separate comparison for one change without the other, and the rain tally gives no amounts. These records cannot identify whether straightening made floods worse."
      },
      "hintId": "claim-hint",
      "exampleId": "claim-example"
    },
    {
      "id": "C7",
      "text": "There were no small floods before year 22.",
      "replies": {
        "support": "Hollis lists 40 and 60 cm before year 22, but also writes “no flood worth the ink” about unwritten years. There is no definition of “small” or a complete list of smaller events. Two entries cannot establish that no small floods happened.",
        "against": "Hollis's phrase “worth the ink” allows for floods left unwritten, but it does not identify any small flood that happened. We should not invent one. Without a definition of “small” or more entries, the record neither establishes this absence nor directly disproves it.",
        "unknown": "The earlier recorded heights are 40 and 60 cm. Hollis gives no small-flood definition and says some years had no flood “worth the ink.” Small events could have gone unwritten. We cannot turn that possibility into either a known event or a known absence."
      },
      "hintId": "claim-hint",
      "exampleId": "claim-example"
    },
    {
      "id": "C8",
      "text": "The storm will happen again next year.",
      "replies": {
        "support": "The separate town note records a later storm at 160 cm. One recorded storm is evidence that it happened, not a schedule for another. The note supplies no Hollis-year coordinate or forecast for next year.",
        "against": "Neither Hollis's seven entries nor the separate 160 cm note says what next year will bring. They do not promise a repeat, but they do not show a repeat is impossible. This prediction remains beyond the supplied records.",
        "unknown": "The later note gives 160 cm for a storm that happened. The ledger gives seven earlier dated entries. Neither source predicts next year, so these records cannot decide whether a storm like it will happen then."
      },
      "hintId": "claim-hint",
      "exampleId": "claim-example"
    },
    {
      "id": "C9",
      "text": "No recorded flood after year 22 exceeded 60 cm.",
      "replies": {
        "support": "Look at year 27: Hollis records 120 cm, which exceeds 60 cm. The other later entries are 80, 120, 140 and 100 cm, also above 60. These entries count against the sentence even without the separate later storm.",
        "against": "Year 27 records 120 cm, already enough to contradict “no recorded flood.” The five later ledger heights are 120, 80, 120, 140 and 100 cm. All exceed 60 cm. This is about the recorded entries, not a claim that the ledger contains every flood.",
        "unknown": "We do have the entries needed for this claim: 120 cm in year 27 is greater than 60 cm. One such recorded flood contradicts “no recorded flood.” Unknown unrecorded floods do not remove the contradiction in the record we can read."
      },
      "hintId": "claim-hint",
      "exampleId": "claim-example"
    }
  ],
  "plans": [
    {
      "id": "wall",
      "title": "The Wall",
      "text": "Build a higher flood wall along the brook. The proposal aims to protect the town while keeping the orchard as it is. It asks the town to build the wall. These records do not show what height would work or what would happen at its ends."
    },
    {
      "id": "sponge",
      "title": "The Sponge",
      "text": "Let the lowest orchard fields return to marsh. The proposal aims to give water more room. Some trees would be lost, and the proposal includes a reed trade with Vadoalto. These records do not show how much difference the marsh would make or whether the trade would replace what is lost."
    },
    {
      "id": "some",
      "title": "Some of Each",
      "text": "Build a lower wall upstream of the mill and make a smaller wet meadow at the low corner. The proposal combines two aims on a smaller scale. It still asks for wall building and some orchard land. These records do not show whether that combination would be enough."
    }
  ],
  "parts": [
    {
      "id": "show",
      "title": "What the records show",
      "prompt": "What can you show someone in a source?",
      "helpId": "show-help",
      "options": [
        {
          "id": "show-1",
          "label": "Show A",
          "text": "Hollis's ledger records two floods in years 1 to 21 with mean height 50 cm, and five in years 22 to 40 with mean height 112 cm. The later recorded maximum is also higher, 140 cm against 60 cm. These are comparisons of the selected entries, not a measured effect of drainage."
        },
        {
          "id": "show-2",
          "label": "Show B",
          "text": "Nuria's tally lists six big-rain events in both years 1 to 10 and years 21 to 30. Hollis's ledger has one recorded flood in each group, at 40 and 120 cm. Equal event counts did not come with equal recorded heights, but the tally gives no rainfall amounts to compare."
        },
        {
          "id": "show-3",
          "label": "Show C",
          "text": "Years 31 to 40 has the largest recorded big-rain count in Nuria's tally, eight, and the largest recorded flood count in Hollis's ledger, four. Those counts occur together. The sources do not establish which conditions caused the floods."
        }
      ]
    },
    {
      "id": "reason",
      "title": "A provisional plan and a reason",
      "prompt": "Which proposal would you recommend for now, and why? You can leave the recommendation open while you read.",
      "helpId": "reason-help",
      "options": [
        {
          "id": "reason-1",
          "label": "Wall reason A",
          "text": "For now I would recommend the Wall because keeping the orchard as it is matters to me. The proposal asks for a higher wall rather than giving up orchard fields. Hollis's later recorded maximum of 140 cm gives a reason to examine protection, but this ledger does not tell us what wall height would work.",
          "planId": "wall"
        },
        {
          "id": "reason-2",
          "label": "Wall reason B",
          "text": "My provisional choice is the Wall. I want to take the cost of losing orchard trees seriously, so I would investigate the proposal that keeps them. I am choosing an aim to investigate, not claiming that the mean of 112 cm proves a wall would meet it.",
          "planId": "wall"
        },
        {
          "id": "reason-3",
          "label": "Wall reason C",
          "text": "I would keep the Wall as my draft recommendation because it puts preserving the existing orchard first. I would ask for a separate account of the proposed wall's costs and effects before treating it as a settled plan. The flood ledger contains past heights, not a trial of this wall.",
          "planId": "wall"
        },
        {
          "id": "reason-4",
          "label": "Sponge reason A",
          "text": "For now I would recommend the Sponge because I want to investigate giving water more room in the lowest fields. Hollis records drainage in year 22 and higher later mean and maximum heights, so that change deserves examination. The same note records straightening too, so it does not prove restoring marsh would lower floods.",
          "planId": "sponge"
        },
        {
          "id": "reason-5",
          "label": "Sponge reason B",
          "text": "My provisional choice is the Sponge because I give weight to trying a different use of the lowest land. I accept that some orchard trees would be lost. I would need a better account of that loss and of the proposed reed trade, as well as evidence about water, before settling the plan.",
          "planId": "sponge"
        },
        {
          "id": "reason-6",
          "label": "Sponge reason C",
          "text": "I would keep the Sponge as my draft recommendation because its aim of making room for water is worth investigating. The selected ledger has five later floods with mean 112 cm, but it has not tested this proposal. I would keep the uncertain benefit and the certain change to the orchard visible together.",
          "planId": "sponge"
        },
        {
          "id": "reason-7",
          "label": "Some of Each reason A",
          "text": "For now I would recommend Some of Each because I want to investigate a lower wall and a smaller wet meadow together. It asks for less marsh land than the Sponge proposal and a lower wall than the Wall proposal. That combination fits my provisional priorities, but the records do not show that it would be enough.",
          "planId": "some"
        },
        {
          "id": "reason-8",
          "label": "Some of Each reason B",
          "text": "My provisional choice is Some of Each because I want the discussion to consider both keeping much of the orchard and changing the low corner. I accept that the proposal still needs wall building and some land. Choosing two measures does not prove that either measure, or the pair, would work.",
          "planId": "some"
        },
        {
          "id": "reason-9",
          "label": "Some of Each reason C",
          "text": "I would keep Some of Each as my draft recommendation because I am willing to consider both kinds of change on a smaller scale. I would compare its aims and costs with the other proposals before settling it. Hollis's mean and maximum heights help describe the concern, but they do not choose the size of a wall or meadow.",
          "planId": "some"
        }
      ]
    },
    {
      "id": "objection",
      "title": "An objection and your answer",
      "prompt": "What is a serious objection to your provisional choice? Give the objection and an answer that takes it seriously.",
      "helpId": "objection-help",
      "options": [
        {
          "id": "objection-1",
          "label": "Wall objection A: where the wall ends",
          "text": "Objection: “And where does the water go when it reaches the end of your wall?” My answer: This is a fair question. Hollis's ledger measures water at one post, not the effect of a proposed wall elsewhere. I would keep the Wall provisional and ask for evidence about the rest of the brook before settling it.",
          "planId": "wall"
        },
        {
          "id": "objection-2",
          "label": "Wall objection B: choosing a height",
          "text": "Objection: The records do not tell us how high to build the wall. My answer: I agree. The later recorded maximum of 140 cm is a past entry, not a guaranteed future limit or a design instruction. I can prefer the Wall's aim while asking for the missing evidence about the proposal.",
          "planId": "wall"
        },
        {
          "id": "objection-3",
          "label": "Wall objection C: choosing before counting costs",
          "text": "Objection: Keeping the orchard does not tell us what building this wall would cost. My answer: That cost is missing from this case. I would request a clear account of the work and resources before settling the choice. Preserving the orchard is my reason for considering the Wall, not a reason to ignore its cost.",
          "planId": "wall"
        },
        {
          "id": "objection-4",
          "label": "Sponge objection A: losing trees",
          "text": "Objection: The proposal removes some trees, but these records do not prove the benefit. My answer: I agree that the tree loss is a serious cost. The later heights do not isolate drainage's effect. I would keep the Sponge provisional, investigate its proposed water effects, and ask how the loss would be addressed before settling it.",
          "planId": "sponge"
        },
        {
          "id": "objection-5",
          "label": "Sponge objection B: the reed trade",
          "text": "Objection: A proposed reed trade may not replace what the lost orchard provides. My answer: The ledger and rain tally cannot answer that. I would ask for a separate account of the orchard's contribution and what the trade could provide. I should not treat a named trade as proof that nobody bears a cost.",
          "planId": "sponge"
        },
        {
          "id": "objection-6",
          "label": "Sponge objection C: two simultaneous changes",
          "text": "Objection: The brook was straightened in year 22 too, so why focus on the Sponge? My answer: That is a limit on my evidence. I prefer investigating the Sponge's aim, but I cannot claim the ledger proved drainage caused the higher heights. I would compare evidence about both changes and revise the recommendation if it counted against my reason.",
          "planId": "sponge"
        },
        {
          "id": "objection-7",
          "label": "Some of Each objection A: enough",
          "text": "Objection: Will a lower wall and smaller wet meadow be enough? My answer: These records cannot tell us. I would keep the combination provisional and ask for a direct comparison of the three proposals. A compromise between two ideas is not evidence that the combined plan meets its aim.",
          "planId": "some"
        },
        {
          "id": "objection-8",
          "label": "Some of Each objection B: paying both costs",
          "text": "Objection: This choice still asks for wall building and the loss of some orchard land. My answer: I accept that it carries both kinds of cost. I would ask for a clear account of each rather than call the combination a free middle choice. My reason is to investigate the two aims together, not to pretend their costs disappear.",
          "planId": "some"
        },
        {
          "id": "objection-9",
          "label": "Some of Each objection C: splitting effort",
          "text": "Objection: Making each part smaller could leave us with two measures whose effects we do not understand. My answer: That is a reason to investigate the combination itself. Neither Hollis's heights nor Nuria's counts test the proposed sizes or their joint effect. I would compare the proposals before settling this preference, and change it if the evidence counted against it.",
          "planId": "some"
        }
      ],
      "openHelp": "You can leave the choice open and write the question that prevents you from deciding. For example: “I want a clearer account of each proposal's effects and costs before recommending one.” Your current writing and earlier kept notes remain available."
    },
    {
      "id": "uncertainty",
      "title": "An uncertainty",
      "prompt": "Which uncertainty matters to your note?",
      "helpId": "uncertainty-help",
      "options": [
        {
          "id": "uncertainty-1",
          "label": "Uncertainty A",
          "text": "I do not know the separate effects of draining the Sponge and straightening the brook, because Hollis records both changes in year 22. The higher later recorded mean and maximum do not pull those effects apart."
        },
        {
          "id": "uncertainty-2",
          "label": "Uncertainty B",
          "text": "I do not know whether rainfall amounts or durations differed between the groups. Nuria's copy gives event counts of six, five, six and eight, but omits the big-rain threshold, rainfall amounts, and individual event dates. It also describes Vadoalto rather than Willowbank."
        },
        {
          "id": "uncertainty-3",
          "label": "Uncertainty C",
          "text": "I do not know how well Hollis's selected entries describe all floods. “Worth the ink” gives no fixed recording rule, and the extract does not establish unchanged measuring methods. The mean of 40 and 60 is exactly 50 cm, but that does not make it the mean of every earlier flood."
        }
      ]
    },
    {
      "id": "next-record",
      "title": "A useful next record",
      "prompt": "What record would help investigate that uncertainty? Say what it would add and what it would leave open.",
      "helpId": "next-record-help",
      "options": [
        {
          "id": "next-record-1",
          "label": "Next record A",
          "text": "I would ask for a future water-height record with a stated rule for every event, including small ones, at the same labelled post and reference level. Each entry should give its date and measuring method, with any changes noted. That would make later comparisons clearer, but it could not recover every flood Hollis left unwritten or separate the two old changes by itself."
        },
        {
          "id": "next-record-2",
          "label": "Next record B",
          "text": "I would ask for dated rainfall amounts and durations at Willowbank and Vadoalto, using stated measuring methods and a defined event threshold. These could be set beside dated water heights. They would improve the comparison beyond big-rain counts, but would not by themselves prove which change caused the historical difference."
        },
        {
          "id": "next-record-3",
          "label": "Next record C",
          "text": "I would look for dated records of the brook and lowest fields from before and after year 22, including whether drainage and straightening happened together everywhere. A place or period with one change without the other could help investigate their separate effects. Other differences would still need examination, so finding such a record would not automatically settle the cause."
        }
      ]
    }
  ],
  "help": {
    "claim-C1-support": {
      "title": "Claim reply requested",
      "text": "A reply for this claim and tray was made available. The original reply stays with the selection.",
      "facts": []
    },
    "claim-C1-against": {
      "title": "Claim reply requested",
      "text": "A reply for this claim and tray was made available. The original reply stays with the selection.",
      "facts": []
    },
    "claim-C1-unknown": {
      "title": "Claim reply requested",
      "text": "A reply for this claim and tray was made available. The original reply stays with the selection.",
      "facts": []
    },
    "claim-C2-support": {
      "title": "Claim reply requested",
      "text": "A reply for this claim and tray was made available. The original reply stays with the selection.",
      "facts": []
    },
    "claim-C2-against": {
      "title": "Claim reply requested",
      "text": "A reply for this claim and tray was made available. The original reply stays with the selection.",
      "facts": []
    },
    "claim-C2-unknown": {
      "title": "Claim reply requested",
      "text": "A reply for this claim and tray was made available. The original reply stays with the selection.",
      "facts": []
    },
    "claim-C3-support": {
      "title": "Claim reply requested",
      "text": "A reply for this claim and tray was made available. The original reply stays with the selection.",
      "facts": []
    },
    "claim-C3-against": {
      "title": "Claim reply requested",
      "text": "A reply for this claim and tray was made available. The original reply stays with the selection.",
      "facts": []
    },
    "claim-C3-unknown": {
      "title": "Claim reply requested",
      "text": "A reply for this claim and tray was made available. The original reply stays with the selection.",
      "facts": []
    },
    "claim-C4-support": {
      "title": "Claim reply requested",
      "text": "A reply for this claim and tray was made available. The original reply stays with the selection.",
      "facts": []
    },
    "claim-C4-against": {
      "title": "Claim reply requested",
      "text": "A reply for this claim and tray was made available. The original reply stays with the selection.",
      "facts": []
    },
    "claim-C4-unknown": {
      "title": "Claim reply requested",
      "text": "A reply for this claim and tray was made available. The original reply stays with the selection.",
      "facts": []
    },
    "claim-C5-support": {
      "title": "Claim reply requested",
      "text": "A reply for this claim and tray was made available. The original reply stays with the selection.",
      "facts": []
    },
    "claim-C5-against": {
      "title": "Claim reply requested",
      "text": "A reply for this claim and tray was made available. The original reply stays with the selection.",
      "facts": []
    },
    "claim-C5-unknown": {
      "title": "Claim reply requested",
      "text": "A reply for this claim and tray was made available. The original reply stays with the selection.",
      "facts": []
    },
    "claim-C6-support": {
      "title": "Claim reply requested",
      "text": "A reply for this claim and tray was made available. The original reply stays with the selection.",
      "facts": []
    },
    "claim-C6-against": {
      "title": "Claim reply requested",
      "text": "A reply for this claim and tray was made available. The original reply stays with the selection.",
      "facts": []
    },
    "claim-C6-unknown": {
      "title": "Claim reply requested",
      "text": "A reply for this claim and tray was made available. The original reply stays with the selection.",
      "facts": []
    },
    "claim-C7-support": {
      "title": "Claim reply requested",
      "text": "A reply for this claim and tray was made available. The original reply stays with the selection.",
      "facts": []
    },
    "claim-C7-against": {
      "title": "Claim reply requested",
      "text": "A reply for this claim and tray was made available. The original reply stays with the selection.",
      "facts": []
    },
    "claim-C7-unknown": {
      "title": "Claim reply requested",
      "text": "A reply for this claim and tray was made available. The original reply stays with the selection.",
      "facts": []
    },
    "claim-C8-support": {
      "title": "Claim reply requested",
      "text": "A reply for this claim and tray was made available. The original reply stays with the selection.",
      "facts": []
    },
    "claim-C8-against": {
      "title": "Claim reply requested",
      "text": "A reply for this claim and tray was made available. The original reply stays with the selection.",
      "facts": []
    },
    "claim-C8-unknown": {
      "title": "Claim reply requested",
      "text": "A reply for this claim and tray was made available. The original reply stays with the selection.",
      "facts": []
    },
    "claim-C9-support": {
      "title": "Claim reply requested",
      "text": "A reply for this claim and tray was made available. The original reply stays with the selection.",
      "facts": []
    },
    "claim-C9-against": {
      "title": "Claim reply requested",
      "text": "A reply for this claim and tray was made available. The original reply stays with the selection.",
      "facts": []
    },
    "claim-C9-unknown": {
      "title": "Claim reply requested",
      "text": "A reply for this claim and tray was made available. The original reply stays with the selection.",
      "facts": []
    },
    "claim-hint": {
      "title": "Hint",
      "text": "Read the whole sentence, including words such as “recorded,” “only,” and “next year.” Find a number or source phrase that bears on that sentence. A missing cause is different from a missing count.",
      "facts": []
    },
    "claim-example": {
      "title": "Different example",
      "text": "A fictional garden sheet lists four bean plants in one bed and seven in another. It supports “the second bed has more recorded plants.” It counts against “both beds have four recorded plants.” Without other details, it cannot tell us “extra sunshine caused the difference.”",
      "facts": []
    },
    "claim-skip": {
      "title": "Leave this claim open",
      "text": "Leave this claim open. You can try a tray later or go to another page now.",
      "facts": []
    },
    "show-help": {
      "title": "Writing help",
      "text": "Start with a number you can point to. Name its source and the years it covers. If you use a mean, say how many entries it describes.",
      "facts": []
    },
    "reason-help": {
      "title": "Writing help",
      "text": "Name an aim you value and a cost you accept. Then say which part still needs investigation. You do not have to name a proven cause to explain a provisional preference.",
      "facts": []
    },
    "objection-help": {
      "title": "Writing help",
      "text": "Answer the objection you have written. You may concede a limit and still hold a provisional preference. If the objection changes your mind, you can change plans without losing this draft.",
      "facts": []
    },
    "uncertainty-help": {
      "title": "Writing help",
      "text": "Say what is missing and which conclusion it limits. You can still use the numbers that are present.",
      "facts": []
    },
    "next-record-help": {
      "title": "Writing help",
      "text": "Match the new record to your uncertainty. Ask for information the present sources lack. A useful record can narrow a question without settling everything.",
      "facts": []
    },
    "entry-counts-hint": {
      "title": "Hint",
      "text": "Count the written entries on each side. Do not count unwritten years as floods.",
      "facts": []
    },
    "entry-counts-example": {
      "title": "Different example",
      "text": "Entries in years 2, 6, 12 with a change at 10: two before, one after.",
      "facts": []
    },
    "entry-counts-skip": {
      "title": "Skipped question",
      "text": "This question stays open. You can return to it or choose another question.",
      "facts": []
    },
    "mean-before-hint": {
      "title": "Hint",
      "text": "Add 40 and 60, then divide by two entries.",
      "facts": []
    },
    "mean-before-example": {
      "title": "Different example",
      "text": "Example heights 20 and 40 have total 60; 60 ÷ 2 = 30 cm.",
      "facts": []
    },
    "mean-before-skip": {
      "title": "Skipped question",
      "text": "This question stays open. You can return to it or choose another question.",
      "facts": []
    },
    "mean-after-hint": {
      "title": "Hint",
      "text": "Add all five heights, including both entries of 120 cm; divide by five.",
      "facts": []
    },
    "mean-after-example": {
      "title": "Different example",
      "text": "Example heights 20, 40, 60 total 120; 120 ÷ 3 = 40 cm.",
      "facts": []
    },
    "mean-after-skip": {
      "title": "Skipped question",
      "text": "This question stays open. You can return to it or choose another question.",
      "facts": []
    },
    "ranges-hint": {
      "title": "Hint",
      "text": "In each group subtract the smallest height from the largest.",
      "facts": []
    },
    "ranges-example": {
      "title": "Different example",
      "text": "Heights 10, 30, 50 have range 50 − 10 = 40 cm.",
      "facts": []
    },
    "ranges-skip": {
      "title": "Skipped question",
      "text": "This question stays open. You can return to it or choose another question.",
      "facts": []
    },
    "mean-difference-hint": {
      "title": "Hint",
      "text": "Compare 112 with 50; do not report just one mean.",
      "facts": []
    },
    "mean-difference-example": {
      "title": "Different example",
      "text": "Means 75 and 45 differ by 75 − 45 = 30 cm.",
      "facts": []
    },
    "mean-difference-skip": {
      "title": "Skipped question",
      "text": "This question stays open. You can return to it or choose another question.",
      "facts": []
    },
    "count-periods-hint": {
      "title": "Hint",
      "text": "Put each count beside the length of its period.",
      "facts": []
    },
    "count-periods-example": {
      "title": "Different example",
      "text": "Two entries in 10 years and four in 20 years have different counts but the same count per year.",
      "facts": []
    },
    "count-periods-skip": {
      "title": "Skipped question",
      "text": "This question stays open. You can return to it or choose another question.",
      "facts": []
    },
    "mean-limit-hint": {
      "title": "Hint",
      "text": "Separate calculating these entries from describing unwritten floods.",
      "facts": []
    },
    "mean-limit-example": {
      "title": "Different example",
      "text": "The mean of 10 and 30 is 20. It need not be the mean of every event omitted from a record.",
      "facts": []
    },
    "mean-limit-skip": {
      "title": "Skipped question",
      "text": "This question stays open. You can return to it or choose another question.",
      "facts": []
    },
    "unwritten-years-hint": {
      "title": "Hint",
      "text": "Read “no flood worth the ink”; it does not define a numerical height.",
      "facts": []
    },
    "unwritten-years-example": {
      "title": "Different example",
      "text": "A blank thermometer entry is not a reading of 0 degrees or yesterday's temperature.",
      "facts": []
    },
    "unwritten-years-skip": {
      "title": "Skipped question",
      "text": "This question stays open. You can return to it or choose another question.",
      "facts": []
    },
    "period-one-hint": {
      "title": "Hint",
      "text": "Include only years 1–10.",
      "facts": []
    },
    "period-one-example": {
      "title": "Different example",
      "text": "Years 3, 12, 18: the first interval contains year 3 only.",
      "facts": []
    },
    "period-one-skip": {
      "title": "Skipped question",
      "text": "This question stays open. You can return to it or choose another question.",
      "facts": []
    },
    "period-two-hint": {
      "title": "Hint",
      "text": "Find the entries in 11–20, then their maximum.",
      "facts": []
    },
    "period-two-example": {
      "title": "Different example",
      "text": "Years 3, 12, 18: 11–20 contains two entries; heights 20 and 50 have maximum 50.",
      "facts": []
    },
    "period-two-skip": {
      "title": "Skipped question",
      "text": "This question stays open. You can return to it or choose another question.",
      "facts": []
    },
    "period-three-hint": {
      "title": "Hint",
      "text": "Use the whole interval without calling it wholly after 22.",
      "facts": []
    },
    "period-three-example": {
      "title": "Different example",
      "text": "Years 23 and 29 lie in 21–30; heights 30 and 40 have maximum 40.",
      "facts": []
    },
    "period-three-skip": {
      "title": "Skipped question",
      "text": "This question stays open. You can return to it or choose another question.",
      "facts": []
    },
    "period-four-hint": {
      "title": "Hint",
      "text": "Count 31, 34, 36, 38 and choose their highest height.",
      "facts": []
    },
    "period-four-example": {
      "title": "Different example",
      "text": "Heights 20, 50, 40 have three entries and maximum 50.",
      "facts": []
    },
    "period-four-skip": {
      "title": "Skipped question",
      "text": "This question stays open. You can return to it or choose another question.",
      "facts": []
    },
    "equal-tallies-hint": {
      "title": "Hint",
      "text": "Compare copied event counts, not recorded flood heights.",
      "facts": []
    },
    "equal-tallies-example": {
      "title": "Different example",
      "text": "Two periods each with 4 events can have different rainfall totals.",
      "facts": []
    },
    "equal-tallies-skip": {
      "title": "Skipped question",
      "text": "This question stays open. You can return to it or choose another question.",
      "facts": []
    },
    "recorded-changes-hint": {
      "title": "Hint",
      "text": "The change excerpt names two changes; the rain table gives counts.",
      "facts": []
    },
    "recorded-changes-example": {
      "title": "Different example",
      "text": "A new road and a timetable changed together; a later delay does not separate their effects.",
      "facts": []
    },
    "recorded-changes-skip": {
      "title": "Skipped question",
      "text": "This question stays open. You can return to it or choose another question.",
      "facts": []
    },
    "straddling-period-hint": {
      "title": "Hint",
      "text": "List where year 21 and year 22 fall.",
      "facts": []
    },
    "straddling-period-example": {
      "title": "Different example",
      "text": "Interval 9–12 crosses a change at 10.",
      "facts": []
    },
    "straddling-period-skip": {
      "title": "Skipped question",
      "text": "This question stays open. You can return to it or choose another question.",
      "facts": []
    },
    "audio-records": {
      "title": "Read aloud",
      "text": "The current displayed words were made available for local English read-aloud support.",
      "facts": []
    },
    "together-records": {
      "title": "Thinking together",
      "text": "A companion was invited to think through the current displayed records with you.",
      "facts": []
    },
    "audio-rain": {
      "title": "Read aloud",
      "text": "The current displayed words were made available for local English read-aloud support.",
      "facts": []
    },
    "together-rain": {
      "title": "Thinking together",
      "text": "A companion was invited to think through the current displayed records with you.",
      "facts": []
    },
    "audio-claims": {
      "title": "Read aloud",
      "text": "The current displayed words were made available for local English read-aloud support.",
      "facts": []
    },
    "together-claims": {
      "title": "Thinking together",
      "text": "A companion was invited to think through the current displayed records with you.",
      "facts": []
    },
    "audio-note": {
      "title": "Read aloud",
      "text": "The current displayed words were made available for local English read-aloud support.",
      "facts": []
    },
    "together-note": {
      "title": "Thinking together",
      "text": "A companion was invited to think through the current displayed records with you.",
      "facts": []
    },
    "source-H": {
      "title": "Hollis's selected flood ledger",
      "text": "Hollis recorded these water heights at the mill's flood post. Each height is centimeters above the brook's stated ordinary level. The years count from the beginning of Hollis's keeping.\n\n“Years not written had no flood worth the ink.”\n\nThis is a selected record, not a list of every flood. Hollis does not say how a flood became “worth the ink” or whether that choice stayed the same. An unwritten year is not a height of zero. The extract also does not tell us whether the post, measuring method, or meaning of ordinary level stayed unchanged throughout the record.\n\nName Hollis's ledger and give the year or group you used. For example: “Hollis's ledger records 140 cm in year 36.”",
      "facts": []
    },
    "source-Y": {
      "title": "Hollis's year 22 note",
      "text": "“Year 22. The Sponge is drained and the brook cut straight past the new fields.”\n\nHollis places two changes in year 22: draining the Sponge and straightening the brook. The Sponge was a marsh where some orchard fields now stand. This note records when the changes happened. It does not measure the separate effect of either change on later floods.\n\nA comparison across year 22 includes both changes, along with anything else that differed between those years. It cannot separate drainage from straightening by itself.",
      "facts": []
    },
    "source-N": {
      "title": "Nuria's copied rain tally",
      "text": "Nuria's copy groups Vadoalto's recorded big-rain events into ten-year stretches aligned with Hollis's years. Vadoalto is upstream of Willowbank. This is a tally of events at another place.\n\nThe extract does not say what amount or duration counted as “big rain.” It gives no rainfall amounts, event dates, or storm durations. The missing threshold is part of this copied record. We must not fill it in with a guess.\n\nEqual event counts need not mean equal rainfall. These decade totals cannot tell us the exact number of big-rain events before and after year 22, or which event went with which flood. They do not measure rain at Willowbank.",
      "facts": []
    },
    "source-S": {
      "title": "The later storm note",
      "text": "A town note added after Hollis's keeping records the later storm at 160 cm above the stated ordinary level. No Hollis-year coordinate is supplied for it.\n\nKeep this measurement separate from the seven dated ledger entries. It cannot be placed at year 40 or 41, and it is not one of the five entries used for the after mean of 112 cm. The extract does not establish instrument or baseline consistency between this note and Hollis's earlier measurements.\n\nLater storm: 160 cm · outside Hollis's keeping · year coordinate not supplied.",
      "facts": []
    },
    "source-P": {
      "title": "Three fictional proposals",
      "text": "These proposals describe choices the fictional town could consider. The ledger and tally have not tested how well any proposal would work. Choosing a draft recommendation means weighing an aim and a cost while keeping that uncertainty visible.\n\nBuild a higher flood wall along the brook. The proposal aims to protect the town while keeping the orchard as it is. It asks the town to build the wall. These records do not show what height would work or what would happen at its ends.\n\nLet the lowest orchard fields return to marsh. The proposal aims to give water more room. Some trees would be lost, and the proposal includes a reed trade with Vadoalto. These records do not show how much difference the marsh would make or whether the trade would replace what is lost.\n\nBuild a lower wall upstream of the mill and make a smaller wet meadow at the low corner. The proposal combines two aims on a smaller scale. It still asks for wall building and some orchard land. These records do not show whether that combination would be enough.",
      "facts": []
    }
  },
  "closing": "Wren lays the page beside the records. “We will keep them together. There is room to add a thought, change a reason, or leave a question open.”",
  "keepConfirmation": "Your case note is kept here. You can reopen it and revise any part, including the provisional plan.",
  "connections": [
    {"id":"timing-desk","title":"Open the timing preview","href":"#learn/math/timing-desk","text":"A height record asks how high. A timing sheet asks how long. Compare the message and the water in another fictional case."},
    {
      "id": "town-record",
      "title": "Open the Town Record",
      "text": "A new record needs a clear method as well as numbers. Visit the Town Record to choose what to observe and how to label it. Your evidence page stays here.",
      "href": "#learn/science/records"
    },
    {
      "id": "river",
      "title": "Open Room for the River",
      "text": "These Willowbank records are fictional. Room for the River uses documented Dutch history and separately labelled invented geometry. What changes when you ask who made a real source and what it can establish?",
      "href": "#learn/history/river-room"
    }
  ]
};
export function createLedgerSource(serial=1){const source=structuredClone(authored);source.id=`ledger-source-${serial}`;return source;}
