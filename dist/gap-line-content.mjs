export const gapLineSource = {
  "id": "between-the-marks",
  "version": 1,
  "title": "Between the Marks",
  "origin": "Invented number-line invitations",
  "notice": "These are invented number-line invitations. Start and Finish are fixed source marks. The learner moves a separate ruler end in whole-unit or half-unit steps. Equal pieces show the unsigned length from Start to that actual end. The optional move display shows signed change from Start. Length is never negative; a leftward change is negative.",
  "model": {
    "id": "signed-gap-ruler-v1",
    "minHalf": -20,
    "maxHalf": 20
  },
  "cases": [
    {
      "id": "guided-cross",
      "title": "Across zero",
      "fromHalf": -8,
      "toHalf": 18,
      "stepHalf": 2,
      "initial": {
        "endHalf": -8,
        "split": false,
        "showMove": false
      },
      "prompt": "Start is −4 and Finish is +9. Build a ruler from Start to Finish. How long is it?",
      "clue": "You can count from −4 to zero, then from zero to +9. Zero itself adds no step.",
      "guided": [
        "The length from −4 to +9 is 13 units.",
        "There are 4 units from −4 to zero and 9 more from zero to +9: 4 + 9 = 13.",
        "Move the ruler end right to +9 and compare. Your ruler stays editable."
      ],
      "explanation": "One fitting ruler ends at +9. It covers 4 units to zero and 9 units beyond zero, so its length is 13 units. The move from −4 to +9 has signed change +13. Zero is a boundary, not an extra unit.",
      "reasonPrompt": "Where are the 4 units and the 9 units in this ruler? What does the plus sign in +13 tell us?"
    },
    {
      "id": "same-below",
      "title": "Two marks below zero",
      "fromHalf": -4,
      "toHalf": -16,
      "stepHalf": 2,
      "initial": {
        "endHalf": -4,
        "split": false,
        "showMove": false
      },
      "prompt": "Start is −2 and Finish is −8. Build a ruler from Start to Finish. How long is it?",
      "clue": "Both marks are left of zero. Count the equal spaces between them.",
      "guided": [],
      "explanation": "One fitting ruler ends at −8. It covers 6 units from −2 to −8, so its length is 6 units. The move goes left and has signed change −6. Zero is outside this span; splitting at zero does not add a part.",
      "reasonPrompt": "Why is the length 6 while the signed change is −6? Is zero inside this ruler?"
    },
    {
      "id": "reverse",
      "title": "Back across zero",
      "fromHalf": 18,
      "toHalf": -8,
      "stepHalf": 2,
      "initial": {
        "endHalf": 18,
        "split": false,
        "showMove": false
      },
      "prompt": "Start is +9 and Finish is −4. Build a ruler from Start to Finish. How long is it?",
      "clue": "These are the same two places as Across zero, with Start and Finish exchanged. What stays the same?",
      "guided": [],
      "explanation": "One fitting ruler ends at −4. It covers 9 units to zero and 4 more to −4, so its length is 13 units. The move goes left and has signed change −13. Across zero already showed the length between these same two places. Reversing the move changes its sign, while the length stays 13.",
      "reasonPrompt": "What stays the same when Start and Finish exchange places? What changes?"
    },
    {
      "id": "positive",
      "title": "Two marks above zero",
      "fromHalf": 6,
      "toHalf": 16,
      "stepHalf": 2,
      "initial": {
        "endHalf": 6,
        "split": false,
        "showMove": false
      },
      "prompt": "Start is +3 and Finish is +8. Build a ruler from Start to Finish. How long is it?",
      "clue": "Both marks are right of zero. Count only the spaces from Start to Finish.",
      "guided": [],
      "explanation": "One fitting ruler ends at +8. It covers 5 units from +3 to +8, so its length is 5 units. The move goes right and has signed change +5. Zero is outside this span.",
      "reasonPrompt": "Which spaces belong to the ruler? Why do the spaces from zero to +3 stay outside it?"
    },
    {
      "id": "coincident",
      "title": "One shared place",
      "fromHalf": -6,
      "toHalf": -6,
      "stepHalf": 2,
      "initial": {
        "endHalf": -6,
        "split": false,
        "showMove": false
      },
      "prompt": "Start and Finish are both −3. Does the starting ruler already fit? Compare it, or explore and come back.",
      "clue": "The marks share one place. A ruler can have length zero.",
      "guided": [],
      "explanation": "The starting ruler end at −3 already meets Finish. Its length is 0 units, and its signed change is 0. No movement is needed. Comparing that initial ruler is a valid comparison.",
      "reasonPrompt": "How can a ruler fit without covering any space?"
    },
    {
      "id": "halves",
      "title": "Half-unit pieces",
      "fromHalf": -3,
      "toHalf": 4,
      "stepHalf": 1,
      "initial": {
        "endHalf": -3,
        "split": false,
        "showMove": false
      },
      "prompt": "Start is −1½ and Finish is +2. Use half-unit pieces to build a ruler from Start to Finish. How long is it?",
      "clue": "Each piece is half a unit. Two half-unit pieces make one whole unit.",
      "guided": [],
      "explanation": "One fitting ruler ends at +2. It covers 1½ units to zero and 2 more beyond zero, making 3½ units. There are 7 half-unit pieces: 7 × ½ = 3½. The move goes right and has signed change +3½. Zero adds no piece.",
      "reasonPrompt": "How many half-unit pieces make your length? How can you group them into whole units and a half?"
    }
  ],
  "feedback": {
    "endMeets": "Recorded endpoint result: meets.",
    "endDifferent": "Recorded endpoint result: different.",
    "lengthMatches": "Recorded length result: matches.",
    "lengthDifferent": "Recorded length result: different."
  },
  "helpers": {
    "crossing": {
      "title": "Build through zero",
      "steps": [
        {
          "caseId": "guided-cross",
          "plan": {
            "endHalf": 0,
            "split": false,
            "showMove": false
          },
          "text": "From −4 to zero, this example ruler covers 4 units. Zero adds no step."
        },
        {
          "caseId": "guided-cross",
          "plan": {
            "endHalf": 8,
            "split": true,
            "showMove": false
          },
          "text": "The example end is now +4. Its two parts cover 4 + 4 = 8 units."
        },
        {
          "caseId": "guided-cross",
          "plan": {
            "endHalf": 18,
            "split": true,
            "showMove": false
          },
          "text": "The example end meets +9. Its parts cover 4 + 9 = 13 units. The signed change is +13."
        }
      ]
    },
    "sameBelow": {
      "title": "Stay below zero",
      "steps": [
        {
          "caseId": "same-below",
          "plan": {
            "endHalf": -6,
            "split": false,
            "showMove": false
          },
          "text": "From −2 to −3, this example ruler covers 1 unit to the left."
        },
        {
          "caseId": "same-below",
          "plan": {
            "endHalf": -12,
            "split": false,
            "showMove": false
          },
          "text": "The example end is now −6. The ruler covers 4 units, all below zero."
        },
        {
          "caseId": "same-below",
          "plan": {
            "endHalf": -16,
            "split": false,
            "showMove": false
          },
          "text": "The example end meets −8. Its length is 6 units and its signed change is −6. Zero is outside the span."
        }
      ]
    },
    "halves": {
      "title": "Count half-unit pieces",
      "steps": [
        {
          "caseId": "halves",
          "plan": {
            "endHalf": -2,
            "split": false,
            "showMove": false
          },
          "text": "From −1½ to −1, this example ruler covers 1 half-unit piece. Its length is ½ unit."
        },
        {
          "caseId": "halves",
          "plan": {
            "endHalf": 0,
            "split": true,
            "showMove": false
          },
          "text": "At zero, the ruler covers 3 half-unit pieces: 1½ units. Zero is an end, so there is no interior split yet."
        },
        {
          "caseId": "halves",
          "plan": {
            "endHalf": 4,
            "split": true,
            "showMove": false
          },
          "text": "At +2, the ruler covers 7 half-unit pieces: 3½ units. The parts have lengths 1½ and 2. Its signed change is +3½."
        }
      ]
    }
  }
};

export const gapLineCopy = {
  "Draft status": "Your ruler or help context changed. Compare when you want to keep this version.",
  "No-op": "This construction and help context are already recorded. Move the ruler end or change the context before recording another comparison.",
  "Unsupported root": "Earlier Gap Line data are retained in your notes. This format cannot be edited here. Other places are still open.",
  "Unreadable source": "This earlier invitation cannot be opened here. Its original stays in your downloadable notes. Other places are still open.",
  "Unreadable case": "Some earlier work for this invitation cannot be read here. Its original stays in your notes. Other readable work remains open.",
  "Unreadable teaching context": "Some earlier example context cannot be read. Comparing is unavailable; readable worked examples keep their available buttons.",
  "Missing helper": "This earlier worked example cannot be shown here. Your ruler is still open, and the original stays in your notes.",
  "Unreadable section": "Some retained entries cannot be read or matched to an invitation. Their originals stay in your notes.",
  "Report refusal": "This change could not fit safely in your downloadable notes. Your ruler and earlier comparisons stay as they were. Download your notes or visit another place.",
  "Count ceiling": "This invitation cannot keep another comparison here. Its first and latest comparisons stay in your notes. You can still change the ruler or try another invitation.",
  "Save-off": "Saving is off. This ruler stays in this session. Download your notes if you want a copy.",
  "Storage failure": "This ruler is in this session, but it could not be saved on this device. Download your notes.",
  "Reset note": "The game's confirmed reset removes this explorer's ruler records from this device. It does not remove another explorer's work or files already downloaded.",
  "literals": [
    "Gap Line",
    "Between the Marks",
    "Build a ruler between two marks. Explore its length and the direction of the move.",
    "Open Gap Line",
    "Invented number-line invitations",
    "Start and Finish stay fixed. Move your ruler end, then compare your construction with the invitation.",
    "Your ruler stays editable. Notes keep your first comparison, latest retry, and comparison count. They do not keep every version in between.",
    "The invitation's marks",
    "Start: {A}",
    "Finish: {B}",
    "Start mark",
    "Finish mark",
    "Your ruler",
    "Ruler end: {C}",
    "Your ruler's length: {length} units.",
    "Your ruler's length: 1 unit.",
    "Your ruler's length: ½ unit.",
    "Your ruler's length: 0 units.",
    "Your ruler begins at Start. Its length is 0. You can compare it now or move its end.",
    "Starting ruler end: {initial C}. You can change this ruler or compare it.",
    "0 pieces",
    "1 equal piece",
    "{n} equal pieces",
    "Equal ruler pieces",
    "Each piece is 1 unit long.",
    "Each piece is ½ unit long.",
    "Move ruler end left",
    "Move ruler end right",
    "Move by 1 unit.",
    "Move by ½ unit.",
    "Split the ruler at zero",
    "Show the move",
    "Zero can be a boundary between two parts of your ruler. It is a mark, not an extra step.",
    "Two parts meet at zero. Their lengths add to your ruler's length.",
    "Part from {A} to 0: {x} units.",
    "Part from {A} to 0: 1 unit.",
    "Part from {A} to 0: ½ unit.",
    "Part from 0 to {C}: {y} units.",
    "Part from 0 to {C}: 1 unit.",
    "Part from 0 to {C}: ½ unit.",
    "Zero is not inside your ruler's span. The ruler stays in one part.",
    "The move from Start",
    "Length counts the space covered. Signed change also tells the direction.",
    "Your move: {C} − ({A}) = {change} units.",
    "The ruler end moved right from Start.",
    "The ruler end moved left from Start.",
    "The ruler end is at Start. There is no change.",
    "Compare",
    "Choose an invitation",
    "Previous invitation",
    "Next invitation",
    "The ruler end is at −10. Move right to change it.",
    "The ruler end is at +10. Move left to change it.",
    "Your ruler or help context changed. Compare when you want to keep this version.",
    "No comparison recorded here yet. Your ruler is ready to change.",
    "Your checked ruler",
    "Your ruler changed since this comparison",
    "This comparison used a ruler end at {C}, with Split at zero {on/off} and Show the move {on/off}.",
    "Across zero",
    "Two marks below zero",
    "Back across zero",
    "Two marks above zero",
    "One shared place",
    "Half-unit pieces",
    "Start is −4 and Finish is +9. Build a ruler from Start to Finish. How long is it?",
    "You can count from −4 to zero, then from zero to +9. Zero itself adds no step.",
    "Guided example",
    "The length from −4 to +9 is 13 units.",
    "There are 4 units from −4 to zero and 9 more from zero to +9: 4 + 9 = 13.",
    "Move the ruler end right to +9 and compare. Your ruler stays editable.",
    "One fitting ruler ends at +9. It covers 4 units to zero and 9 units beyond zero, so its length is 13 units. The move from −4 to +9 has signed change +13. Zero is a boundary, not an extra unit.",
    "Where are the 4 units and the 9 units in this ruler? What does the plus sign in +13 tell us?",
    "Start is −2 and Finish is −8. Build a ruler from Start to Finish. How long is it?",
    "Both marks are left of zero. Count the equal spaces between them.",
    "One fitting ruler ends at −8. It covers 6 units from −2 to −8, so its length is 6 units. The move goes left and has signed change −6. Zero is outside this span; splitting at zero does not add a part.",
    "Why is the length 6 while the signed change is −6? Is zero inside this ruler?",
    "Start is +9 and Finish is −4. Build a ruler from Start to Finish. How long is it?",
    "These are the same two places as Across zero, with Start and Finish exchanged. What stays the same?",
    "One fitting ruler ends at −4. It covers 9 units to zero and 4 more to −4, so its length is 13 units. The move goes left and has signed change −13. Across zero already showed the length between these same two places. Reversing the move changes its sign, while the length stays 13.",
    "What stays the same when Start and Finish exchange places? What changes?",
    "Start is +3 and Finish is +8. Build a ruler from Start to Finish. How long is it?",
    "Both marks are right of zero. Count only the spaces from Start to Finish.",
    "One fitting ruler ends at +8. It covers 5 units from +3 to +8, so its length is 5 units. The move goes right and has signed change +5. Zero is outside this span.",
    "Which spaces belong to the ruler? Why do the spaces from zero to +3 stay outside it?",
    "Start and Finish are both −3. Does the starting ruler already fit? Compare it, or explore and come back.",
    "The marks share one place. A ruler can have length zero.",
    "The starting ruler end at −3 already meets Finish. Its length is 0 units, and its signed change is 0. No movement is needed. Comparing that initial ruler is a valid comparison.",
    "How can a ruler fit without covering any space?",
    "Start is −1½ and Finish is +2. Use half-unit pieces to build a ruler from Start to Finish. How long is it?",
    "Each piece is half a unit. Two half-unit pieces make one whole unit.",
    "One fitting ruler ends at +2. It covers 1½ units to zero and 2 more beyond zero, making 3½ units. There are 7 half-unit pieces: 7 × ½ = 3½. The move goes right and has signed change +3½. Zero adds no piece.",
    "How many half-unit pieces make your length? How can you group them into whole units and a half?",
    "What this comparison recorded",
    "Computed endpoint for this checked ruler: {C}.",
    "Computed unsigned length for this checked ruler: {length} units.",
    "Computed signed change for this checked ruler: {change} units.",
    "This earlier ruler's model is not supported here. Its raw source, construction and recorded results stay in your notes. No picture or calculation is shown for it.",
    "A ready-made example and a reason to discuss",
    "Example ruler",
    "This is a ready-made ruler that fits the invitation. It does not describe your own ruler.",
    "Tell a grown-up, or point to the pieces. Nothing spoken is recorded or marked.",
    "Your ruler stays as you made it. Change its end or request another idea, then compare again. Your first comparison stays in Notes.",
    "This construction and help context are already recorded. Move the ruler end or change the context before recording another comparison.",
    "No comparison recorded here",
    "First comparison here",
    "Compared before here",
    "Clue",
    "Hear",
    "Working together",
    "Across zero example",
    "Below zero example",
    "Half-unit example",
    "Previous step",
    "Next step",
    "Back to my ruler",
    "Close this idea",
    "Choose Working together if a grown-up is helping with this invitation. This records your report.",
    "Working together reported",
    "Working together is reported for this invitation.",
    "Hear requested",
    "Build through zero",
    "From −4 to zero, this example ruler covers 4 units. Zero adds no step.",
    "The example end is now +4. Its two parts cover 4 + 4 = 8 units.",
    "The example end meets +9. Its parts cover 4 + 9 = 13 units. The signed change is +13.",
    "Stay below zero",
    "From −2 to −3, this example ruler covers 1 unit to the left.",
    "The example end is now −6. The ruler covers 4 units, all below zero.",
    "The example end meets −8. Its length is 6 units and its signed change is −6. Zero is outside the span.",
    "Count half-unit pieces",
    "From −1½ to −1, this example ruler covers 1 half-unit piece. Its length is ½ unit.",
    "At zero, the ruler covers 3 half-unit pieces: 1½ units. Zero is an end, so there is no interior split yet.",
    "At +2, the ruler covers 7 half-unit pieces: 3½ units. The parts have lengths 1½ and 2. Its signed change is +3½.",
    "This is a ready-made worked example. Your own ruler stays unchanged. Return at any step.",
    "This example uses this invitation's own marks. It may supply part or all of a fitting construction. Opening it does not show which steps were viewed.",
    "Your ruler is here. Earlier comparisons still show the constructions and help context they used.",
    "Keeper's Desk",
    "Number explorations",
    "Math pathways",
    "Keep exploring. Your work stays with this tool.",
    "Current editable ruler",
    "Ruler end now: {C}",
    "Split at zero now: {on/off}",
    "Show the move now: {on/off}",
    "First comparison",
    "Latest retry",
    "{n} comparisons",
    "1 comparison",
    "Source Start",
    "Source Finish",
    "Source unit size",
    "Supplied ruler end",
    "Ruler end used",
    "Split at zero in this comparison",
    "Show the move in this comparison",
    "Recorded endpoint result",
    "Recorded length result",
    "Clue opened",
    "Across zero example opened",
    "Below zero example opened",
    "Half-unit example opened",
    "Feedback available for this comparison",
    "Across zero example opened for this invitation's own marks",
    "Below zero example opened for this invitation's own marks",
    "Half-unit example opened for this invitation's own marks",
    "This example may supply part or all of a fitting construction. Opening does not show which steps were viewed.",
    "Earlier opened-example details are unavailable. Whether it used this invitation's own marks is unknown.",
    "Supplied ruler end: {initial C}",
    "Supplied Split at zero: {on/off}",
    "Supplied Show the move: {on/off}",
    "Guided example supplied with this invitation",
    "This invitation reverses the two places used in the supplied {guided title} guidance.",
    "The supplied zero-length ruler already fits this invitation.",
    "The supplied ruler end already meets Finish.",
    "Not recorded before this comparison",
    "These are retained records, not a new comparison.",
    "Notes keep the whole current draft, the first comparison, the latest retry, their help context, and the comparison count. The first comparison stays unchanged. Middle retries are not all retained.",
    "Earlier Gap Line data are retained in your notes. This format cannot be edited here. Other places are still open.",
    "This earlier invitation cannot be opened here. Its original stays in your downloadable notes. Other places are still open.",
    "Some earlier work for this invitation cannot be read here. Its original stays in your notes. Other readable work remains open.",
    "An earlier comparison cannot be read here. Its original stays in your notes. A new comparison is unavailable for this invitation.",
    "Some earlier example context cannot be read. Comparing is unavailable; readable worked examples keep their available buttons.",
    "This earlier worked example cannot be shown here. Your ruler is still open, and the original stays in your notes.",
    "Some retained entries cannot be read or matched to an invitation. Their originals stay in your notes.",
    "This change could not fit safely in your downloadable notes. Your ruler and earlier comparisons stay as they were. Download your notes or visit another place.",
    "This invitation cannot keep another comparison here. Its first and latest comparisons stay in your notes. You can still change the ruler or try another invitation.",
    "Saving is off. This ruler stays in this session. Download your notes if you want a copy.",
    "This ruler is in this session, but it could not be saved on this device. Download your notes.",
    "The game's confirmed reset removes this explorer's ruler records from this device. It does not remove another explorer's work or files already downloaded.",
    "These are invented number-line invitations. Start and Finish are fixed source marks. The learner moves a separate ruler end in whole-unit or half-unit steps. Equal pieces show the unsigned length from Start to that actual end. The optional move display shows signed change from Start. Length is never negative; a leftward change is negative.",
    "Compare records two separate results: whether the constructed end meets Finish and whether its unsigned length matches the invitation's length. A construction can have the right length on the wrong side of Start. A zero-length ruler is a valid construction and already fits the shared-place invitation. Zero is a boundary, not an extra counted step. An optional split applies only when zero is inside the actual constructed span.",
    "Across zero supplies its length and construction guidance from the outset. Back across zero reuses those same two places in reverse; it is not evidence of an independent new use. Optional clues, examples, narration requests, reported together-work, requested presentations and prior feedback remain part of the recorded context. An example may supply part or all of a fitting construction; opening it does not establish which steps were viewed, heard or understood.",
    "The current draft and first/latest comparisons retain their own source and context. Earlier statuses are literal records, not new calculations or grades. Unknown retained models remain raw data without reconstructed formulas or pictures. Missing or unreadable support details mean unknown support, not no support.",
    "This tool does not certify an independent method, explanation or mastery. All invitations stay open. There is no timer, score, gate, typed answer, microphone, voice recording, upload or automatic sharing. Only the supplied source, local construction drafts, first/latest comparison records, counts and support reports are stored for this explorer. Existing notes download, transfer and confirmed reset apply.",
    "0",
    "½",
    "1½",
    "2½",
    "−1½",
    "zero",
    "half a unit",
    "one and a half units",
    "4 + 9",
    "4 positive nine",
    "Start: {spoken A}. Finish: {spoken B}.",
    "Ruler end: {spoken C}.",
    "Your move: from {spoken A} to {spoken C}. Signed change: {spoken change} units.",
    "unit"
  ],
  "invitation": "Start and Finish stay fixed. Move your ruler end, then compare your construction with the invitation.",
  "beforeStart": "Your ruler stays editable. Notes keep your first comparison, latest retry, and comparison count. They do not keep every version in between."
};
