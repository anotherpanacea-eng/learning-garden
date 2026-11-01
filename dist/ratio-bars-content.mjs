export const ratioBarsSource = {
  "id": "mixing-equal-blocks",
  "version": 1,
  "title": "Equal Blocks at the Mixing Table",
  "origin": "Original pretend orders and an equal-block mathematical model.",
  "notice": "Model scoops. Every block has the same value.",
  "model": {
    "id": "equal-ratio-blocks-v1",
    "maxBlocks": 12,
    "maxUnit": 20
  },
  "ingredients": [
    {
      "id": "white",
      "label": "white",
      "pattern": "dots"
    },
    {
      "id": "blue",
      "label": "blue",
      "pattern": "stripes"
    },
    {
      "id": "yellow",
      "label": "yellow",
      "pattern": "crosshatch"
    },
    {
      "id": "red",
      "label": "red",
      "pattern": "chevrons"
    }
  ],
  "cases": [
    {
      "id": "guided-twenty",
      "title": "Twenty altogether",
      "ingredientIds": [
        "white",
        "blue"
      ],
      "ratio": [
        2,
        3
      ],
      "given": {
        "amount": 20,
        "reference": "whole"
      },
      "initial": {
        "blocks": [
          2,
          2
        ],
        "unit": null,
        "reference": "whole"
      },
      "prompt": "Make 20 model scoops altogether, with 2 white for every 3 blue. Build the bars, choose the value of every block, and show what the 20 names.",
      "clue": "The recipe's 2 white parts and 3 blue parts make 5 equal parts altogether.",
      "guided": [
        "Try 2 white blocks and 3 blue blocks: 5 equal blocks altogether.",
        "The given 20 names the whole. 20 ÷ 5 = 4 scoops in every block.",
        "Choose 4, put the marker on all bars together, and compare. Your bars stay editable."
      ],
      "explanation": "One fitting example uses 2 white blocks and 3 blue blocks. Five equal blocks share the whole 20: 20 ÷ 5 = 4 scoops in every block. White is 8 and blue is 12. The whole is 20.",
      "reasonPrompt": "What does your brace cover? How does every block get the same value?"
    },
    {
      "id": "twenty-four",
      "title": "Twenty-four altogether",
      "ingredientIds": [
        "white",
        "blue"
      ],
      "ratio": [
        1,
        2
      ],
      "given": {
        "amount": 24,
        "reference": "whole"
      },
      "initial": {
        "blocks": [
          0,
          0
        ],
        "unit": null,
        "reference": null
      },
      "prompt": "Make 24 model scoops altogether, with 1 white for every 2 blue. Build and value the equal blocks.",
      "clue": "Count the white and blue blocks when the given amount is the whole.",
      "guided": [],
      "explanation": "One fitting example uses 1 white block and 2 blue blocks. 24 ÷ 3 = 8 scoops in every block. White is 8 and blue is 16, making 24 altogether.",
      "reasonPrompt": "How do your two shares add back to the given whole?"
    },
    {
      "id": "three-sixty",
      "title": "Three colors, sixty",
      "ingredientIds": [
        "red",
        "blue",
        "white"
      ],
      "ratio": [
        1,
        2,
        3
      ],
      "given": {
        "amount": 60,
        "reference": "whole"
      },
      "initial": {
        "blocks": [
          1,
          2,
          2
        ],
        "unit": null,
        "reference": null
      },
      "prompt": "Make 60 model scoops altogether. Keep red : blue : white at 1 : 2 : 3. Include all three bars.",
      "clue": "The whole includes red, blue, and white. Count every term.",
      "guided": [],
      "explanation": "One fitting example uses 1 red block, 2 blue blocks, and 3 white blocks: 6 equal blocks altogether. 60 ÷ 6 = 10 scoops in every block. The shares are 10 red, 20 blue, and 30 white. They sum to 60.",
      "reasonPrompt": "Where is each of the three parts in your whole?"
    },
    {
      "id": "white-eight",
      "title": "Eight white",
      "ingredientIds": [
        "white",
        "blue"
      ],
      "ratio": [
        2,
        3
      ],
      "given": {
        "amount": 8,
        "reference": "white"
      },
      "initial": {
        "blocks": [
          2,
          3
        ],
        "unit": null,
        "reference": "whole"
      },
      "prompt": "White is 8 model scoops. Keep white : blue at 2 : 3. Show which bar the 8 names, then find blue and the whole.",
      "clue": "The 8 names white alone. Divide it among the blocks in your white bar.",
      "guided": [],
      "explanation": "One fitting example uses 2 white blocks and 3 blue blocks. The given 8 belongs to the 2 white blocks: 8 ÷ 2 = 4 scoops in every block. Blue is 12 and the whole is 20. The marker belongs on white, not the whole.",
      "reasonPrompt": "Why does the given amount name one share this time?"
    },
    {
      "id": "yellow-twelve",
      "title": "Twelve yellow",
      "ingredientIds": [
        "yellow",
        "blue"
      ],
      "ratio": [
        3,
        2
      ],
      "given": {
        "amount": 12,
        "reference": "yellow"
      },
      "initial": {
        "blocks": [
          0,
          0
        ],
        "unit": null,
        "reference": null
      },
      "prompt": "Yellow is 12 model scoops. Keep yellow : blue at 3 : 2. Find blue and the whole with equal blocks.",
      "clue": "The 12 belongs to yellow. Which blocks share those 12 scoops?",
      "guided": [],
      "explanation": "One fitting example uses 3 yellow blocks and 2 blue blocks. 12 ÷ 3 = 4 scoops in every block. Blue is 8 and the whole is 20. Dividing the given 12 by all 5 blocks would treat yellow as the whole.",
      "reasonPrompt": "Which blocks do you divide the yellow amount among?"
    },
    {
      "id": "blue-twenty",
      "title": "Twenty blue, three colors",
      "ingredientIds": [
        "red",
        "blue",
        "white"
      ],
      "ratio": [
        1,
        2,
        3
      ],
      "given": {
        "amount": 20,
        "reference": "blue"
      },
      "initial": {
        "blocks": [
          1,
          1,
          3
        ],
        "unit": null,
        "reference": "blue"
      },
      "prompt": "Blue is 20 model scoops. Keep red : blue : white at 1 : 2 : 3. Find red, white, and the whole.",
      "clue": "The given amount names only the middle, blue share. All three shares still use equal-value blocks.",
      "guided": [],
      "explanation": "One fitting example uses 1 red block, 2 blue blocks, and 3 white blocks. Blue's 20 is shared by its 2 blocks: 20 ÷ 2 = 10 scoops in every block. Red is 10, blue is 20, white is 30, and the whole is 60.",
      "reasonPrompt": "What changed when only the blue share was given?"
    }
  ],
  "feedback": {
    "ratioSame": "Recorded proportions: same.",
    "ratioDifferent": "Recorded proportions: different.",
    "referenceFits": "Recorded reference result: fits. Marker used: {recorded reference}.",
    "referenceDifferent": "Recorded reference result: different. Marker used: {recorded reference}.",
    "amountFits": "Recorded given-amount result: fits. Source given: {given amount} scoops for {source reference}.",
    "amountDifferent": "Recorded given-amount result: different. Source given: {given amount} scoops for {source reference}."
  },
  "helpers": {
    "whole": {
      "title": "Share a whole across equal blocks",
      "steps": [
        {
          "caseId": "guided-twenty",
          "plan": {
            "blocks": [
              2,
              3
            ],
            "unit": null,
            "reference": "whole"
          },
          "text": "This recipe has 2 white blocks and 3 blue blocks. The given 20 is the whole."
        },
        {
          "caseId": "guided-twenty",
          "plan": {
            "blocks": [
              2,
              3
            ],
            "unit": 4,
            "reference": "whole"
          },
          "text": "Five blocks share 20 scoops equally. 20 ÷ 5 = 4 scoops in every block."
        },
        {
          "caseId": "guided-twenty",
          "plan": {
            "blocks": [
              2,
              3
            ],
            "unit": 4,
            "reference": "whole"
          },
          "text": "White is 2 × 4 = 8. Blue is 3 × 4 = 12. Together they make 20."
        }
      ]
    },
    "share": {
      "title": "Start from the named share",
      "steps": [
        {
          "caseId": "yellow-twelve",
          "plan": {
            "blocks": [
              3,
              2
            ],
            "unit": null,
            "reference": "yellow"
          },
          "text": "The given 12 names yellow, not the whole. These 3 yellow blocks share the 12."
        },
        {
          "caseId": "yellow-twelve",
          "plan": {
            "blocks": [
              3,
              2
            ],
            "unit": 4,
            "reference": "yellow"
          },
          "text": "12 ÷ 3 = 4 scoops in every block. Both colors use that same block value."
        },
        {
          "caseId": "yellow-twelve",
          "plan": {
            "blocks": [
              3,
              2
            ],
            "unit": 4,
            "reference": "yellow"
          },
          "text": "Blue is 2 × 4 = 8, and the whole is 12 + 8 = 20. Dividing 12 by all 5 blocks would change what the given amount names."
        }
      ]
    },
    "three": {
      "title": "Count all three parts",
      "steps": [
        {
          "caseId": "three-sixty",
          "plan": {
            "blocks": [
              1,
              2,
              3
            ],
            "unit": null,
            "reference": "whole"
          },
          "text": "Red, blue, and white have 1 + 2 + 3 = 6 equal blocks altogether. The given 60 is the whole."
        },
        {
          "caseId": "three-sixty",
          "plan": {
            "blocks": [
              1,
              2,
              3
            ],
            "unit": 10,
            "reference": "whole"
          },
          "text": "60 ÷ 6 = 10 scoops in every block."
        },
        {
          "caseId": "three-sixty",
          "plan": {
            "blocks": [
              1,
              2,
              3
            ],
            "unit": 10,
            "reference": "whole"
          },
          "text": "Red is 10, blue is 20, and white is 30. All three shares sum to 60."
        }
      ]
    }
  }
};
export const ratioBarsCopy = {
  "Title": "Equal Blocks at the Mixing Table",
  "Origin": "Original pretend orders and an equal-block mathematical model.",
  "Invitation": "Build the recipe with equal blocks. How many scoops will each block stand for?",
  "Action": "Open the blocks",
  "Before opening": "Your bars stay editable. Notes keep your first comparison, latest retry, and number of comparisons, not every version in between.",
  "Compact notice": "Model scoops. Every block has the same value.",
  "Model fold": "How these blocks work",
  "Notice inside": "A block is a group of equal model scoops. You choose how many scoops every block stands for. These pictures do not measure real paint or predict its color.",
  "Family links": "Shade pots",
  "Open navigation": "Choose an invitation",
  "Recipe heading": "The ordered recipe",
  "Recipe": "{ratio terms joined by :}, in this order: {ingredient labels joined by :}.",
  "Fact for whole": "Given: {amount} model scoops altogether.",
  "Fact for share": "Given: {amount} {ingredient} model scoops.",
  "Heading": "What this model shows",
  "Starting context": "Ready-made starting blocks",
  "Each bar": "{ingredient}: {n} blocks",
  "Controls, using only source ingredients": "Add one white block",
  "Unit label": "Scoops in every block",
  "Unit chosen caption": "Every block stands for {u} model scoops.",
  "Unit missing": "Value not chosen",
  "Amount readout": "{ingredient}: {blocks} × {u} = {amount} scoops.",
  "Whole readout": "All bars together: {total} scoops.",
  "Block total": "{n} blocks in all",
  "Reference legend": "Place the given-amount brace",
  "Reference choices": "All bars together",
  "Placed marker caption": "Your reference marker: {reference}.",
  "Unplaced": "Given-amount brace not placed",
  "Reference reminder": "The Given line tells us what the source amount means. Your marker shows where you think it belongs.",
  "Primary action": "Compare",
  "Boundary12": "This picture board holds up to 12 blocks in each bar. Take one back to make room.",
  "Boundary0": "There are no {ingredient} blocks to take back.",
  "Picture-editing note in grown-up help": "Taking a block back changes the model. It does not separate mixed paint.",
  "Incomplete messages, show all relevant ones without grading": "Add at least one block before comparing.",
  "Draft status": "Your bars changed. Compare when you want to test this version.",
  "No comparison": "No comparison recorded here yet. Your bars are ready to change.",
  "Checked heading": "Your checked model",
  "Changed heading": "Bars changed since this comparison",
  "Checked readout": "This comparison used {ordered named block counts}, {u} scoops in every block, and your marker on {reference}.",
  "Separate arithmetic labels for a supported checked model": "Computed shares for this checked model: {ordered named amounts}.",
  "Longer fold": "A ready-made example and a reason to discuss",
  "Before case explanation": "One example that fits",
  "After explanation": "Tell a grown-up in your own words or point to the blocks. Nothing spoken is recorded or marked.",
  "Revision": "Your bars stay as you made them. Change a block, its value, or your marker, then compare again. The first comparison stays in your notes.",
  "No-op": "This comparison is already shown. Change your model or request another idea before comparing a new version.",
  "Local familiarity": "No comparison recorded here",
  "Controls": "Try a worked example",
  "Whole helper title": "Share a whole across equal blocks",
  "1. Picture guided-twenty2:3/u null/reference whole": "This recipe has 2 white blocks and 3 blue blocks. The given 20 is the whole.",
  "2. Picture2:3/u4/reference whole": "Five blocks share 20 scoops equally. 20 ÷ 5 = 4 scoops in every block.",
  "3. Picture2:3/u4/reference whole": "White is 2 × 4 = 8. Blue is 3 × 4 = 12. Together they make 20.",
  "Share helper title": "Start from the named share",
  "1. Picture yellow-twelve3:2/u null/reference yellow": "The given 12 names yellow, not the whole. These 3 yellow blocks share the 12.",
  "2. Picture3:2/u4/reference yellow": "12 ÷ 3 = 4 scoops in every block. Both colors use that same block value.",
  "3. Picture3:2/u4/reference yellow": "Blue is 2 × 4 = 8, and the whole is 12 + 8 = 20. Dividing 12 by all 5 blocks would change what the given amount names.",
  "Three-part helper title": "Count all three parts",
  "1. Picture three-sixty1:2:3/u null/reference whole": "Red, blue, and white have 1 + 2 + 3 = 6 equal blocks altogether. The given 60 is the whole.",
  "2. Picture1:2:3/u10/reference whole": "60 ÷ 6 = 10 scoops in every block.",
  "3. Picture1:2:3/u10/reference whole": "Red is 10, blue is 20, and white is 30. All three shares sum to 60.",
  "Every helper footer": "This is a ready-made worked example. Your own bars stay unchanged. Return at any step.",
  "Own-invitation helper notice, when its frozen steps refer to the current case": "This example uses this invitation’s own recipe and given amount. It may supply part or all of a fitting plan. Your own bars stay yours to change.",
  "Together": "Choose Working together if a grown-up is helping with this invitation. It is your report, not a test.",
  "Greeting": "Your bars are here. Earlier comparisons still show the models they used.",
  "Bridge fold": "Back at the shade pots",
  "Bridge text": "These bars allocate a specified amount in an ordered recipe. The shade pots let you change scoop amounts and compare their proportions. Both use relative amounts, but their jobs differ. Your work stays in each tool.",
  "Bridge labels": "Recipe from these bars",
  "Discovery": "Equal Blocks",
  "Notes": "Ungraded bars",
  "Notes helper-overlap labels, derived from frozen helper steps when the corresponding teaching-before flag is true": "Whole example opened for this invitation’s own recipe and given amount",
  "Notes supplied context": "Supplied starting blocks: {ordered named counts}",
  "Unsupported root": "Earlier Equal Blocks data are retained in your notes. This format cannot be edited here. Other places are still open.",
  "Unreadable source": "This earlier source cannot be opened here. Its original stays in your downloadable notes. Other places are still open.",
  "Unreadable case": "This part of the earlier block work cannot be changed safely. Its original stays in your notes. Other readable invitations are still open.",
  "Unknown model": "This earlier block model's picture is unavailable here. Its counts, values, reference and recorded results stay in your notes. This source cannot be changed or compared here.",
  "Missing helper": "This earlier worked example cannot be shown here. Your bars are still open, and the original stays in your notes.",
  "Unreadable section": "Some retained entries cannot be read or matched to an invitation. Their originals stay in your notes.",
  "Whole-report refusal": "This change could not fit safely in your downloadable notes. Your bars and earlier comparisons stay as they were. Download your notes or visit another place.",
  "Count ceiling": "This invitation cannot keep another comparison here. Its first and latest comparisons stay in your notes. You can still change the bars or try another invitation.",
  "Save-off": "Saving is off. These bars stay in this session. Download your notes if you want a copy.",
  "Storage failure": "These bars are in this session, but they could not be saved on this device. Download your notes.",
  "Reset note": "The game's confirmed reset removes this explorer's block records from this device. It does not remove another explorer's work or files already downloaded.",
  "literals": [
    "Equal Blocks at the Mixing Table",
    "Original pretend orders and an equal-block mathematical model.",
    "Build the recipe with equal blocks. How many scoops will each block stand for?",
    "Open the blocks",
    "Your bars stay editable. Notes keep your first comparison, latest retry, and number of comparisons, not every version in between.",
    "Model scoops. Every block has the same value.",
    "How these blocks work",
    "A block is a group of equal model scoops. You choose how many scoops every block stands for. These pictures do not measure real paint or predict its color.",
    "Shade pots",
    "Equal blocks",
    "Choose an invitation",
    "Previous invitation",
    "Next invitation",
    "The ordered recipe",
    "{ratio terms joined by :}, in this order: {ingredient labels joined by :}.",
    "Given: {amount} model scoops altogether.",
    "Given: {amount} {ingredient} model scoops.",
    "Your bars",
    "Ready-made starting blocks",
    "Starting value: not chosen",
    "Starting marker: not placed",
    "Starting marker: {reference}",
    "{ingredient}: {n} blocks",
    "1 block",
    "Add one white block",
    "Take one white block back",
    "Add one blue block",
    "Take one blue block back",
    "Add one yellow block",
    "Take one yellow block back",
    "Add one red block",
    "Take one red block back",
    "Scoops in every block",
    "Choose a value",
    "{n}",
    "Every block stands for {u} model scoops.",
    "Every block stands for 1 model scoop.",
    "Value not chosen",
    "{ingredient}: {blocks} × {u} = {amount} scoops.",
    "All bars together: {total} scoops.",
    "{n} blocks in all",
    "1 block in all",
    "Place the given-amount brace",
    "All bars together",
    "Your reference marker: {reference}.",
    "all bars together",
    "Amount under your marker: {n} scoops.",
    "Amount under your marker: value not chosen.",
    "Given-amount brace not placed",
    "The Given line tells us what the source amount means. Your marker shows where you think it belongs.",
    "Compare",
    "This picture board holds up to 12 blocks in each bar. Take one back to make room.",
    "There are no {ingredient} blocks to take back.",
    "Taking a block back changes the model. It does not separate mixed paint.",
    "Add at least one block before comparing.",
    "Choose how many scoops every block stands for.",
    "Place your reference marker before comparing.",
    "Your bars changed. Compare when you want to test this version.",
    "No comparison recorded here yet. Your bars are ready to change.",
    "Your checked model",
    "Bars changed since this comparison",
    "This comparison used {ordered named block counts}, {u} scoops in every block, and your marker on {reference}.",
    "Twenty altogether",
    "Make 20 model scoops altogether, with 2 white for every 3 blue. Build the bars, choose the value of every block, and show what the 20 names.",
    "The recipe's 2 white parts and 3 blue parts make 5 equal parts altogether.",
    "One fitting example uses 2 white blocks and 3 blue blocks. Five equal blocks share the whole 20: 20 ÷ 5 = 4 scoops in every block. White is 8 and blue is 12. The whole is 20.",
    "What does your brace cover? How does every block get the same value?",
    "Twenty-four altogether",
    "Make 24 model scoops altogether, with 1 white for every 2 blue. Build and value the equal blocks.",
    "Count the white and blue blocks when the given amount is the whole.",
    "One fitting example uses 1 white block and 2 blue blocks. 24 ÷ 3 = 8 scoops in every block. White is 8 and blue is 16, making 24 altogether.",
    "How do your two shares add back to the given whole?",
    "Three colors, sixty",
    "Make 60 model scoops altogether. Keep red : blue : white at 1 : 2 : 3. Include all three bars.",
    "The whole includes red, blue, and white. Count every term.",
    "One fitting example uses 1 red block, 2 blue blocks, and 3 white blocks: 6 equal blocks altogether. 60 ÷ 6 = 10 scoops in every block. The shares are 10 red, 20 blue, and 30 white. They sum to 60.",
    "Where is each of the three parts in your whole?",
    "Eight white",
    "White is 8 model scoops. Keep white : blue at 2 : 3. Show which bar the 8 names, then find blue and the whole.",
    "The 8 names white alone. Divide it among the blocks in your white bar.",
    "One fitting example uses 2 white blocks and 3 blue blocks. The given 8 belongs to the 2 white blocks: 8 ÷ 2 = 4 scoops in every block. Blue is 12 and the whole is 20. The marker belongs on white, not the whole.",
    "Why does the given amount name one share this time?",
    "Twelve yellow",
    "Yellow is 12 model scoops. Keep yellow : blue at 3 : 2. Find blue and the whole with equal blocks.",
    "The 12 belongs to yellow. Which blocks share those 12 scoops?",
    "One fitting example uses 3 yellow blocks and 2 blue blocks. 12 ÷ 3 = 4 scoops in every block. Blue is 8 and the whole is 20. Dividing the given 12 by all 5 blocks would treat yellow as the whole.",
    "Which blocks do you divide the yellow amount among?",
    "Twenty blue, three colors",
    "Blue is 20 model scoops. Keep red : blue : white at 1 : 2 : 3. Find red, white, and the whole.",
    "The given amount names only the middle, blue share. All three shares still use equal-value blocks.",
    "One fitting example uses 1 red block, 2 blue blocks, and 3 white blocks. Blue's 20 is shared by its 2 blocks: 20 ÷ 2 = 10 scoops in every block. Red is 10, blue is 20, white is 30, and the whole is 60.",
    "What changed when only the blue share was given?",
    "Guided example",
    "Try 2 white blocks and 3 blue blocks: 5 equal blocks altogether.",
    "The given 20 names the whole. 20 ÷ 5 = 4 scoops in every block.",
    "Choose 4, put the marker on all bars together, and compare. Your bars stay editable.",
    "What this model shows",
    "Recorded proportions: same.",
    "Recorded proportions: different.",
    "Recorded reference result: fits. Marker used: {recorded reference}.",
    "Recorded reference result: different. Marker used: {recorded reference}.",
    "Recorded given-amount result: fits. Source given: {given amount} scoops for {source reference}.",
    "Recorded given-amount result: different. Source given: {given amount} scoops for {source reference}.",
    "whole",
    "Computed shares for this checked model: {ordered named amounts}.",
    "Computed whole for this checked model: {total} scoops.",
    "Amounts are not recomputed for this earlier model. Its recorded counts, value, marker and results stay here.",
    "A ready-made example and a reason to discuss",
    "One example that fits",
    "Here is one model that fits. It is an example, not a description of your bars. Other equal-block models can fit too.",
    "Tell a grown-up in your own words or point to the blocks. Nothing spoken is recorded or marked.",
    "Your bars stay as you made them. Change a block, its value, or your marker, then compare again. The first comparison stays in your notes.",
    "This comparison is already shown. Change your model or request another idea before comparing a new version.",
    "No comparison recorded here",
    "First comparison here",
    "Compared before here",
    "Try a worked example",
    "A share is given",
    "Three parts",
    "Clue",
    "Hear",
    "Working together",
    "Previous step",
    "Next step",
    "Back to my bars",
    "Close this idea",
    "Share a whole across equal blocks",
    "This recipe has 2 white blocks and 3 blue blocks. The given 20 is the whole.",
    "Five blocks share 20 scoops equally. 20 ÷ 5 = 4 scoops in every block.",
    "White is 2 × 4 = 8. Blue is 3 × 4 = 12. Together they make 20.",
    "Start from the named share",
    "The given 12 names yellow, not the whole. These 3 yellow blocks share the 12.",
    "12 ÷ 3 = 4 scoops in every block. Both colors use that same block value.",
    "Blue is 2 × 4 = 8, and the whole is 12 + 8 = 20. Dividing 12 by all 5 blocks would change what the given amount names.",
    "Count all three parts",
    "Red, blue, and white have 1 + 2 + 3 = 6 equal blocks altogether. The given 60 is the whole.",
    "60 ÷ 6 = 10 scoops in every block.",
    "Red is 10, blue is 20, and white is 30. All three shares sum to 60.",
    "This is a ready-made worked example. Your own bars stay unchanged. Return at any step.",
    "This example uses this invitation’s own recipe and given amount. It may supply part or all of a fitting plan. Your own bars stay yours to change.",
    "Choose Working together if a grown-up is helping with this invitation. It is your report, not a test.",
    "Your bars are here. Earlier comparisons still show the models they used.",
    "Back at the shade pots",
    "These bars allocate a specified amount in an ordered recipe. The shade pots let you change scoop amounts and compare their proportions. Both use relative amounts, but their jobs differ. Your work stays in each tool.",
    "Recipe from these bars",
    "Latest checked model",
    "Current model, not compared",
    "Visit the shade pots",
    "Return to equal blocks",
    "Equal Blocks",
    "Build equal blocks to share a whole, then try a given share.",
    "Visit Equal Blocks",
    "Ungraded bars",
    "First comparison",
    "Latest retry",
    "{n} comparisons",
    "1 comparison",
    "Recorded proportions",
    "Recorded reference",
    "Recorded given amount",
    "Block counts",
    "Scoops in every block",
    "Reference marker",
    "Clue opened",
    "Hear requested",
    "Working together reported",
    "Whole example opened",
    "Share example opened",
    "Three-part example opened",
    "Feedback available for this comparison",
    "Whole example opened for this invitation’s own recipe and given amount",
    "Share example opened for this invitation’s own recipe and given amount",
    "Three-part example opened for this invitation’s own recipe and given amount",
    "The example may supply part or all of a fitting plan; opening does not show which steps were viewed.",
    "Earlier opened-example details are unavailable; overlap with this invitation is unknown.",
    "Supplied starting blocks: {ordered named counts}",
    "Supplied value: {u} scoops in every block",
    "Supplied value: not chosen",
    "Supplied reference: {reference}",
    "Supplied reference: not placed",
    "Guided example shown with this invitation",
    "Not recorded before this comparison",
    "Earlier Equal Blocks data are retained in your notes. This format cannot be edited here. Other places are still open.",
    "This earlier source cannot be opened here. Its original stays in your downloadable notes. Other places are still open.",
    "This part of the earlier block work cannot be changed safely. Its original stays in your notes. Other readable invitations are still open.",
    "This earlier block model's picture is unavailable here. Its counts, values, reference and recorded results stay in your notes. This source cannot be changed or compared here.",
    "This earlier worked example cannot be shown here. Your bars are still open, and the original stays in your notes.",
    "Some retained entries cannot be read or matched to an invitation. Their originals stay in your notes.",
    "This change could not fit safely in your downloadable notes. Your bars and earlier comparisons stay as they were. Download your notes or visit another place.",
    "This invitation cannot keep another comparison here. Its first and latest comparisons stay in your notes. You can still change the bars or try another invitation.",
    "Saving is off. These bars stay in this session. Download your notes if you want a copy.",
    "These bars are in this session, but they could not be saved on this device. Download your notes.",
    "The game's confirmed reset removes this explorer's block records from this device. It does not remove another explorer's work or files already downloaded.",
    "These are invented exact model-scoop jobs. Equal blocks have a common value chosen by the learner. A block can stand for several scoops; the number of blocks and value of a block are different quantities. There is no real paint-volume, pigment-strength or color prediction.",
    "A given whole is shared across all the blocks. A given named share is shared across that share's blocks first. All ingredient amounts then use the same block value. A three-part whole includes all three terms.",
    "Different subdivisions can fit: 2 white and 3 blue blocks with 4 scoops in every block make the same 8 and 12 as 4 white and 6 blue blocks with 2 in every block. The supplied example is one construction, not a unique answer or a description of the learner's method.",
    "The source fact stays fixed. A learner's reference marker is a proposal, and its status is separate from the recipe and source-given amount. A right numeric whole does not make a wrong marker right.",
    "Existing Sharing Counter, fraction tools, Whole Batches, Keeper's Desk and shade pots already supply related experiences. This tool adds constructed allocation from a supplied whole and recovery from a supplied share, including three parts. It does not certify a complete topic, mental method, independent explanation or mastery. Guided starts, optional help and prior feedback remain visible in Notes.",
    "Only the frozen supplied source, local drafts, first/latest comparisons, counts and support reports are stored for this explorer. There is no typed answer, microphone, recording, upload or automatic sharing. Intermediate comparisons are not all retained. Existing notes download, transfer and confirmed reset apply."
  ],
  "title": "Equal Blocks at the Mixing Table",
  "invitation": "Build the recipe with equal blocks. How many scoops will each block stand for?",
  "beforeStart": "Your bars stay editable. Notes keep your first comparison, latest retry, and number of comparisons, not every version in between.",
  "notice": "Model scoops. Every block has the same value.",
  "unreadable": "This earlier source cannot be opened here. Its original stays in your downloadable notes. Other places are still open."
};
