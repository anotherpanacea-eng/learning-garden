export const fieldStripsSource = {
  "id": "field-strips",
  "version": 1,
  "title": "Field Strips",
  "origin": "Invented field plans",
  "notice": "These are invented field plans. The outer frame is one original whole. Equal vertical strips make the first amount. Equal rows divide that first amount. The hatched cells show the part taken, measured against the original whole. This drawing is a mathematical model, not a measured field or a growing experiment.",
  "model": {
    "id": "nested-field-grid-v1",
    "maxColumns": 6,
    "maxRows": 6
  },
  "cases": [
    {
      "id": "half-three-quarters",
      "title": "Half of three quarters",
      "columns": 4,
      "rows": 2,
      "firstTaken": 3,
      "secondTaken": 1,
      "initial": {
        "columnsTaken": 0,
        "rowsTaken": 0
      },
      "prompt": "Shade 3/4 of the original field. Then take 1/2 of that first amount. How much of the original field is taken?",
      "clue": "Three of four first strips make 3/4. Take one of the two equal rows inside that amount. Count the hatched cells against all eight cells.",
      "guided": [
        "Take three first strips out of four.",
        "Take one row out of two equal rows of that amount.",
        "Three of eight whole-field cells are taken: 3/8 of the original field."
      ],
      "explanation": "One fitting plan has three first strips and one taken row. It takes 1/2 of 3/4. The first amount covers six of eight cells; half of that is three cells. The taken amount is 3/8 of the original field.",
      "reasonPrompt": "Point to the first amount, then the taken amount. Why is the answer 3/8 of the original field, rather than 1/2 of it?"
    },
    {
      "id": "two-thirds-twice",
      "title": "A part of two thirds",
      "columns": 3,
      "rows": 3,
      "firstTaken": 2,
      "secondTaken": 2,
      "initial": {
        "columnsTaken": 0,
        "rowsTaken": 0
      },
      "prompt": "Shade 2/3 of the original field. Then take 2/3 of that first amount. How much of the original field is taken?",
      "clue": "Start with two of three first strips. Take two of three equal rows of that amount. The whole field has nine equal cells.",
      "guided": [],
      "explanation": "One fitting plan has two first strips and two taken rows. Four of nine equal whole-field cells are taken: 4/9 of the original field. Taking 2/3 of 2/3 gives less than the first 2/3.",
      "reasonPrompt": "Why do nine equal cells belong in the whole-field count? What would 2/3 of the original field look like instead?"
    },
    {
      "id": "half-a-field",
      "title": "Another way to a half",
      "columns": 4,
      "rows": 3,
      "firstTaken": 3,
      "secondTaken": 2,
      "initial": {
        "columnsTaken": 0,
        "rowsTaken": 0
      },
      "prompt": "Shade 3/4 of the original field. Then take 2/3 of that first amount. How much of the original field is taken?",
      "clue": "The first amount has three of four strips. Take two of its three equal rows. Count six taken cells among twelve in the original field.",
      "guided": [],
      "explanation": "One fitting plan has three first strips and two taken rows. Six of twelve equal whole-field cells are taken. Six twelfths and one half name the same amount: six selected cells and six remaining cells make the whole field.",
      "reasonPrompt": "How can 6/12 and 1/2 name this same amount? You do not need a simpler name to keep a comparison."
    },
    {
      "id": "three-quarters-half",
      "title": "The same amount, another way",
      "columns": 2,
      "rows": 4,
      "firstTaken": 1,
      "secondTaken": 3,
      "initial": {
        "columnsTaken": 0,
        "rowsTaken": 0
      },
      "prompt": "Shade 1/2 of the original field. Then take 3/4 of that first amount. How much of the original field is taken?",
      "clue": "Take one first strip out of two. Within that first amount, take three equal rows out of four.",
      "guided": [],
      "explanation": "One fitting plan has one first strip and three taken rows. Three of eight equal whole-field cells are taken: 3/8 of the original field. This uses a different first amount from taking half of three quarters, while the final amount is the same.",
      "reasonPrompt": "What is different about the two first amounts? What stays the same about their taken amounts?"
    },
    {
      "id": "keep-it-all",
      "title": "Take all of this part",
      "columns": 3,
      "rows": 3,
      "firstTaken": 2,
      "secondTaken": 3,
      "initial": {
        "columnsTaken": 0,
        "rowsTaken": 0
      },
      "prompt": "Shade 2/3 of the original field. Then take 3/3 of that first amount. How much of the original field is taken?",
      "clue": "Three out of three rows means all the rows of the first amount. None of that first amount is left untaken.",
      "guided": [],
      "explanation": "One fitting plan has two first strips and all three taken rows. Six of nine equal whole-field cells are taken: 6/9, also named 2/3. Taking all of an amount keeps that amount.",
      "reasonPrompt": "Why does taking 3/3 leave the taken amount the same size as the first amount?"
    },
    {
      "id": "empty-first",
      "title": "An empty first amount",
      "columns": 4,
      "rows": 2,
      "firstTaken": 0,
      "secondTaken": 1,
      "initial": {
        "columnsTaken": 0,
        "rowsTaken": 0
      },
      "prompt": "Shade 0/4 of the original field. Then take 1/2 of that first amount. How much of the original field is taken?",
      "clue": "No first strips are shaded. Taking half of an empty amount still takes no cells. Keep the original whole in view.",
      "guided": [],
      "explanation": "One fitting plan has no first strips and one of the two rows selected. The first amount and taken amount are both zero. The original field is still one whole, with eight equal cells. Half of zero is zero; it is not smaller than zero.",
      "reasonPrompt": "Can a smaller part be taken when the first amount is already empty? What does the unchanged outer frame mean?"
    }
  ],
  "feedback": {
    "firstMatches": "The first amount matches the requested first fraction.",
    "firstDifferent": "The first amount differs from the requested first fraction. You can change the first strips.",
    "secondMatches": "The selected fraction of the first amount matches the request.",
    "secondDifferent": "The selected fraction of the first amount differs from the request. You can change the taken rows.",
    "wholeMatches": "The final amount of the original whole matches the requested final amount. Check the two construction steps too: another plan can have the same final amount.",
    "wholeDifferent": "The final amount of the original whole differs from the requested final amount. Your field stays editable."
  },
  "helpers": {
    "equalParts": {
      "title": "Equal parts and the whole",
      "steps": [
        {
          "caseId": "half-three-quarters",
          "plan": {
            "columnsTaken": 1,
            "rowsTaken": 0
          },
          "text": "The frame is one original whole. Four equal first strips run down the field. This example selects one of them."
        },
        {
          "caseId": "half-three-quarters",
          "plan": {
            "columnsTaken": 1,
            "rowsTaken": 1
          },
          "text": "Two equal rows cross every strip. Each small cell is one of eight equal parts of the original whole."
        },
        {
          "caseId": "half-three-quarters",
          "plan": {
            "columnsTaken": 1,
            "rowsTaken": 2
          },
          "text": "Taking both rows takes all of this first strip: two of eight cells, also named one quarter of the original field."
        }
      ]
    },
    "nested": {
      "title": "Take a part of the first amount",
      "steps": [
        {
          "caseId": "half-three-quarters",
          "plan": {
            "columnsTaken": 3,
            "rowsTaken": 0
          },
          "text": "This example starts with three quarters of the original field. Look at its six cells."
        },
        {
          "caseId": "half-three-quarters",
          "plan": {
            "columnsTaken": 3,
            "rowsTaken": 1
          },
          "text": "Take half of that first amount: one of its two equal rows. Three cells are hatched."
        },
        {
          "caseId": "half-three-quarters",
          "plan": {
            "columnsTaken": 3,
            "rowsTaken": 1
          },
          "text": "There are eight cells in the original whole. The three taken cells make three eighths of that original whole."
        }
      ]
    },
    "equivalent": {
      "title": "One amount, two names",
      "steps": [
        {
          "caseId": "half-a-field",
          "plan": {
            "columnsTaken": 3,
            "rowsTaken": 2
          },
          "text": "This example takes six of twelve equal cells: six twelfths of the original whole."
        },
        {
          "caseId": "half-a-field",
          "plan": {
            "columnsTaken": 3,
            "rowsTaken": 2
          },
          "text": "Count six taken cells and six remaining cells. They are two equal amounts of the same whole, even though their shapes differ."
        },
        {
          "caseId": "half-a-field",
          "plan": {
            "columnsTaken": 3,
            "rowsTaken": 2
          },
          "text": "Six twelfths and one half name the same amount. Keeping six twelfths is enough; a new name is not a new amount."
        }
      ]
    }
  }
};

export const fieldStripsCopy = {
  "invitation": "Shade a first amount. Then take part of that amount. How much of the original field have you taken?",
  "beforeStart": "After the storm, the orchard keeper is planning small patches within the field. Try a field on this work mat. The frame always shows one whole field.",
  "beforeOpen": "These are invented field plans, not measurements or planting advice. Open a plan to begin; you can change it and try the others whenever you like.",
  "cuts": "The equal cuts are supplied. You choose how many strips and rows to take.",
  "Unsupported root": "This saved Field Strips format cannot be used by this version. Your original data is kept in our notes. Other places remain open.",
  "Unreadable source": "This saved field source cannot be read here. Its original data is kept in our notes. Other places remain open.",
  "Unsupported model": "This saved field uses a model this version does not compute. Its original source, plans and recorded results are kept as data in our notes.",
  "Unreadable section": "Some earlier Field Strips data cannot be read here. Its original data is kept in our notes. Readable invitations remain open.",
  "Unreadable case": "Part of this invitation's saved work cannot be read here. Its original data is kept in our notes.",
  "Unreadable history": "Earlier comparisons are retained but cannot be read here. They have not been treated as no comparison.",
  "Unreadable teaching context": "Earlier example-opening details cannot all be read. Comparing is unavailable while this context is unknown. Readable examples and other places remain open.",
  "Report refusal": "This change could make our whole notes file unsafe to bring back, so the field has stayed as it was. Download our notes before changing or resetting anything.",
  "Count ceiling": "This invitation has reached the comparison limit. Its field and earlier comparisons are kept. You can explore another invitation or download our notes.",
  "Save-off": "Saved progress is off. This field stays in this visit; download our notes to keep a copy.",
  "Storage failure": "This device could not save the change. It remains in this visit; download our notes to keep a copy.",
  "Notes preface": "These are retained records, not a new comparison. Notes keep the whole current draft, the first comparison, the latest retry, their help context and the comparison count. Middle retries are not all retained.",
  "Reset note": "The existing full-progress reset clears this explorer's work. Download our notes before resetting if you want to keep it.",
  "Draft status": "Your field or help context changed. Compare when you want to keep this version.",
  "No comparison": "No comparison recorded here yet. Your field is ready to change.",
  "Own helper": "This example uses this invitation's field. It may supply a fitting construction. Opening does not show which steps were viewed.",
  "Unknown helper": "Earlier opened-example details are unavailable. Whether the example used this invitation's own field is unknown.",
  "No help edit": "No plan was changed by opening this help.",
  "guide": [
    "Field Strips keeps one original whole visible while taking part of a fractional amount. The supplied cuts make equal cells. A drawing here is not evidence that a child can independently make equal partitions or use a model elsewhere.",
    "Compare records the first construction, second construction and final amount separately. Matching the final amount alone does not show the requested two steps. The field remains editable.",
    "The first invitation supplies an answer. Examples, clues, requested narration, working-together reports, retries and unobserved explanation are not independent achievements. This tool assigns no grade, placement or mastery.",
    "The current draft and first/latest comparisons are different records. Results are shown as recorded; they are not regraded against today's catalogue. Later opened help does not rewrite earlier support context. Original data remains in downloaded notes.",
    "Explain together if you like: what is the original whole, what is the first amount, and which part of that amount has been taken? A returned explanation is a conversation, not an automatically marked response."
  ]
};
