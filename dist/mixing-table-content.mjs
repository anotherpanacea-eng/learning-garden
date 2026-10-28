// Original finite picture-model content for spec 287.
export const mixingTableSource = {
  "id": "mixing-table-shades",
  "version": 1,
  "title": "The Mixing Table",
  "origin": "Original pretend recipes and equal-scoop picture model.",
  "notice": "A mathematical color toy, not real paint. Match means the same relative amounts. Screen colors alone are not enough: different ratios can look the same.",
  "model": {
    "id": "toy-scoop-rgb-v1",
    "maxPerIngredient": 24
  },
  "pairs": [
    {
      "id": "wb",
      "ingredients": [
        {
          "id": "white",
          "label": "white",
          "pattern": "dots",
          "rgb": [
            244,
            240,
            223
          ]
        },
        {
          "id": "blue",
          "label": "blue",
          "pattern": "stripes",
          "rgb": [
            48,
            91,
            148
          ]
        }
      ]
    },
    {
      "id": "yb",
      "ingredients": [
        {
          "id": "yellow",
          "label": "yellow",
          "pattern": "crosshatch",
          "rgb": [
            240,
            198,
            58
          ]
        },
        {
          "id": "blue",
          "label": "blue",
          "pattern": "stripes",
          "rgb": [
            48,
            91,
            148
          ]
        }
      ]
    },
    {
      "id": "ry",
      "ingredients": [
        {
          "id": "red",
          "label": "red",
          "pattern": "chevrons",
          "rgb": [
            194,
            67,
            55
          ]
        },
        {
          "id": "yellow",
          "label": "yellow",
          "pattern": "crosshatch",
          "rgb": [
            240,
            198,
            58
          ]
        }
      ]
    }
  ],
  "cases": [
    {
      "id": "guided-heron",
      "title": "A bigger heron blue",
      "pairId": "wb",
      "sample": {
        "a": 2,
        "b": 3
      },
      "initial": {
        "a": 0,
        "b": 6
      },
      "goal": {
        "comparison": "same",
        "b": 6
      },
      "prompt": "Keep 6 blue. Make the same proportions as 2 white for every 3 blue.",
      "clue": "Six blue can make two groups of three.",
      "guided": [
        "6 blue is two groups of 3 blue.",
        "Each group goes with 2 white.",
        "Try 4 white with the 6 blue, then paint a stripe."
      ],
      "feedback": {
        "same-fit": "Same proportions as the sample. The pot can hold a different total and still keep the recipe. Your pot fits this invitation's amounts and comparison.",
        "same-miss": "Same proportions as the sample. The pot can hold a different total and still keep the recipe. The proportions match, but this invitation still asks for different amounts. Keep its goal in view while you change the scoops.",
        "different-fit": "Different proportions from the sample. The ingredient groups have changed. Your pot fits this invitation's amounts and comparison.",
        "different-miss": "Different proportions from the sample. The ingredient groups have changed. This pot does not fit the invitation yet. Keep its goal in view while you change the scoops."
      },
      "explanation": "Two groups of 3 blue need two groups of 2 white: 4 white and 6 blue.",
      "reasonPrompt": "Point to one group. What goes with its three blue?"
    },
    {
      "id": "more-heron",
      "title": "Nine blue",
      "pairId": "wb",
      "sample": {
        "a": 2,
        "b": 3
      },
      "initial": {
        "a": 0,
        "b": 0
      },
      "goal": {
        "comparison": "same",
        "b": 9
      },
      "prompt": "Make the same proportions, using 9 blue scoops.",
      "clue": "How many groups of 3 blue fit into 9?",
      "guided": [],
      "feedback": {
        "same-fit": "Same proportions as the sample. The pot can hold a different total and still keep the recipe. Your pot fits this invitation's amounts and comparison.",
        "same-miss": "Same proportions as the sample. The pot can hold a different total and still keep the recipe. The proportions match, but this invitation still asks for different amounts. Keep its goal in view while you change the scoops.",
        "different-fit": "Different proportions from the sample. The ingredient groups have changed. Your pot fits this invitation's amounts and comparison.",
        "different-miss": "Different proportions from the sample. The ingredient groups have changed. This pot does not fit the invitation yet. Keep its goal in view while you change the scoops."
      },
      "explanation": "Three groups of 3 blue go with three groups of 2 white: 6 white and 9 blue.",
      "reasonPrompt": "How do the white groups match the blue groups?"
    },
    {
      "id": "repair-sky",
      "title": "Repair the sky pot",
      "pairId": "wb",
      "sample": {
        "a": 2,
        "b": 3
      },
      "initial": {
        "a": 4,
        "b": 5
      },
      "goal": {
        "comparison": "same",
        "a": 4
      },
      "prompt": "Keep 4 white. Repair this pot to match the sample's proportions.",
      "clue": "Four white makes two groups of two. What blue goes with those groups?",
      "guided": [],
      "feedback": {
        "same-fit": "Same proportions as the sample. The pot can hold a different total and still keep the recipe. Your pot fits this invitation's amounts and comparison.",
        "same-miss": "Same proportions as the sample. The pot can hold a different total and still keep the recipe. The proportions match, but this invitation still asks for different amounts. Keep its goal in view while you change the scoops.",
        "different-fit": "Different proportions from the sample. The ingredient groups have changed. Your pot fits this invitation's amounts and comparison.",
        "different-miss": "Different proportions from the sample. The ingredient groups have changed. This pot does not fit the invitation yet. Keep its goal in view while you change the scoops."
      },
      "explanation": "Adding 2 to both parts of 2 white and 3 blue makes 4 white and 5 blue, a different recipe. One more blue makes 4 white and 6 blue, two whole sample groups. You can repair a pot without emptying it.",
      "reasonPrompt": "Which scoop would you change, and why?"
    },
    {
      "id": "one-two",
      "title": "Three little groups",
      "pairId": "wb",
      "sample": {
        "a": 1,
        "b": 2
      },
      "initial": {
        "a": 0,
        "b": 0
      },
      "goal": {
        "comparison": "same",
        "a": 3
      },
      "prompt": "Make the same proportions, using 3 white scoops.",
      "clue": "For each white scoop, find two blue.",
      "guided": [],
      "feedback": {
        "same-fit": "Same proportions as the sample. The pot can hold a different total and still keep the recipe. Your pot fits this invitation's amounts and comparison.",
        "same-miss": "Same proportions as the sample. The pot can hold a different total and still keep the recipe. The proportions match, but this invitation still asks for different amounts. Keep its goal in view while you change the scoops.",
        "different-fit": "Different proportions from the sample. The ingredient groups have changed. Your pot fits this invitation's amounts and comparison.",
        "different-miss": "Different proportions from the sample. The ingredient groups have changed. This pot does not fit the invitation yet. Keep its goal in view while you change the scoops."
      },
      "explanation": "Three groups of 1 white and 2 blue make 3 white and 6 blue. More paint can keep the same proportions.",
      "reasonPrompt": "How many blue go with each white?"
    },
    {
      "id": "white-change",
      "title": "Change just the white",
      "pairId": "wb",
      "sample": {
        "a": 1,
        "b": 2
      },
      "initial": {
        "a": 1,
        "b": 2
      },
      "goal": {
        "comparison": "different",
        "a": 2,
        "b": 2
      },
      "prompt": "Make 2 white and 2 blue. Compare its proportions with the 1 white, 2 blue sample.",
      "clue": "Keep the two blue and add one white.",
      "guided": [],
      "feedback": {
        "same-fit": "Same proportions as the sample. The pot can hold a different total and still keep the recipe. Your pot fits this invitation's amounts and comparison.",
        "same-miss": "Same proportions as the sample. The pot can hold a different total and still keep the recipe. This invitation asks for different proportions. Keep its goal in view while you change the scoops.",
        "different-fit": "Different proportions from the sample. The ingredient groups have changed. Your pot fits this invitation's amounts and comparison.",
        "different-miss": "Different proportions from the sample. The ingredient groups have changed. This pot does not fit the invitation yet. Keep its goal in view while you change the scoops."
      },
      "explanation": "The sample has twice as many blue as white. A pot with 2 white and 2 blue has equal amounts. Adding only white changed this recipe.",
      "reasonPrompt": "What changed? What stayed the same?"
    },
    {
      "id": "equal-green",
      "title": "The equal-parts return",
      "pairId": "yb",
      "sample": {
        "a": 1,
        "b": 1
      },
      "initial": {
        "a": 1,
        "b": 1
      },
      "goal": {
        "comparison": "same",
        "a": 2,
        "b": 2
      },
      "prompt": "Make 2 yellow and 2 blue. Does the equal-parts recipe stay the same?",
      "clue": "Give each yellow one blue. Are any left over?",
      "guided": [],
      "feedback": {
        "same-fit": "Same proportions as the sample. The pot can hold a different total and still keep the recipe. Your pot fits this invitation's amounts and comparison.",
        "same-miss": "Same proportions as the sample. The pot can hold a different total and still keep the recipe. The proportions match, but this invitation still asks for different amounts. Keep its goal in view while you change the scoops.",
        "different-fit": "Different proportions from the sample. The ingredient groups have changed. Your pot fits this invitation's amounts and comparison.",
        "different-miss": "Different proportions from the sample. The ingredient groups have changed. This pot does not fit the invitation yet. Keep its goal in view while you change the scoops."
      },
      "explanation": "1 yellow for every 1 blue and 2 yellow for every 2 blue have the same proportions. Adding one to both keeps this equal-parts recipe. For 2 white and 3 blue, adding one to both makes 3 white and 4 blue, a different recipe.",
      "reasonPrompt": "Why does adding one to each work for this recipe?"
    },
    {
      "id": "orange-difference",
      "title": "One more yellow",
      "pairId": "ry",
      "sample": {
        "a": 1,
        "b": 2
      },
      "initial": {
        "a": 1,
        "b": 2
      },
      "goal": {
        "comparison": "different",
        "a": 3,
        "b": 4
      },
      "prompt": "Make 3 red and 4 yellow. Compare its proportions with the 1 red, 2 yellow sample.",
      "clue": "Both recipes have one more yellow than red. Does that make the groups the same?",
      "guided": [],
      "feedback": {
        "same-fit": "Same proportions as the sample. The pot can hold a different total and still keep the recipe. Your pot fits this invitation's amounts and comparison.",
        "same-miss": "Same proportions as the sample. The pot can hold a different total and still keep the recipe. This invitation asks for different proportions. Keep its goal in view while you change the scoops.",
        "different-fit": "Different proportions from the sample. The ingredient groups have changed. Your pot fits this invitation's amounts and comparison.",
        "different-miss": "Different proportions from the sample. The ingredient groups have changed. This pot does not fit the invitation yet. Keep its goal in view while you change the scoops."
      },
      "explanation": "Both have one more yellow than red. But three copies of 1 red and 2 yellow would need 3 red and 6 yellow, not 4 yellow. Same difference, different proportions.",
      "reasonPrompt": "Which comparison tells us the difference? Which tells us the recipe?"
    },
    {
      "id": "one-group",
      "title": "Back to one group",
      "pairId": "wb",
      "sample": {
        "a": 2,
        "b": 3
      },
      "initial": {
        "a": 6,
        "b": 9
      },
      "goal": {
        "comparison": "same",
        "a": 2,
        "b": 3
      },
      "prompt": "Change this pot to 2 white and 3 blue. Keep the same proportions.",
      "clue": "The starting pot has three whole sample groups. Leave one group.",
      "guided": [],
      "feedback": {
        "same-fit": "Same proportions as the sample. The pot can hold a different total and still keep the recipe. Your pot fits this invitation's amounts and comparison.",
        "same-miss": "Same proportions as the sample. The pot can hold a different total and still keep the recipe. The proportions match, but this invitation still asks for different amounts. Keep its goal in view while you change the scoops.",
        "different-fit": "Different proportions from the sample. The ingredient groups have changed. Your pot fits this invitation's amounts and comparison.",
        "different-miss": "Different proportions from the sample. The ingredient groups have changed. This pot does not fit the invitation yet. Keep its goal in view while you change the scoops."
      },
      "explanation": "6 white and 9 blue can be split into three equal groups of 2 white and 3 blue. Taking away two complete groups leaves the same proportions. Taking the same number from both is not the rule.",
      "reasonPrompt": "What did you take away together?"
    }
  ],
  "helpers": {
    "teaching": {
      "title": "Repeat the whole group",
      "steps": [
        {
          "pairId": "wb",
          "diagrams": [
            {
              "a": 2,
              "b": 3,
              "label": "One group"
            }
          ],
          "text": "One group has 2 white and 3 blue."
        },
        {
          "pairId": "wb",
          "diagrams": [
            {
              "a": 4,
              "b": 6,
              "label": "Two groups"
            }
          ],
          "text": "Two whole groups have 4 white and 6 blue. Repeating the whole group makes more paint with the same proportions."
        },
        {
          "pairId": "wb",
          "diagrams": [
            {
              "a": 4,
              "b": 5,
              "label": "Different proportions"
            },
            {
              "a": 4,
              "b": 6,
              "label": "Same proportions"
            }
          ],
          "text": "Adding 2 to both parts of 2 white and 3 blue makes 4 white and 5 blue, a different recipe. One more blue repairs it to 4 white and 6 blue."
        }
      ]
    },
    "example": {
      "title": "A separate 1-for-2 pot",
      "steps": [
        {
          "pairId": "wb",
          "diagrams": [
            {
              "a": 1,
              "b": 2,
              "label": "One group"
            }
          ],
          "text": "One group: 1 white and 2 blue."
        },
        {
          "pairId": "wb",
          "diagrams": [
            {
              "a": 2,
              "b": 4,
              "label": "Two groups"
            }
          ],
          "text": "Repeat the entire group: 2 white and 4 blue."
        },
        {
          "pairId": "wb",
          "diagrams": [
            {
              "a": 2,
              "b": 4,
              "label": "Two groups"
            }
          ],
          "text": "Both ingredients doubled. The proportions stayed the same. Now return to your pot."
        }
      ]
    }
  }
};
export const mixingTableCopy = {
  "Title": "The Mixing Table",
  "Source origin": "Original pretend recipes and equal-scoop picture model.",
  "Invitation": "Scoop, change, and paint a stripe. Can a bigger pot keep the same recipe?",
  "Opening action": "Open the table",
  "Compact nearby model notice": "Picture paint. Compare the scoop proportions.",
  "Model fold label": "How this picture works",
  "Inside the model fold": "A mathematical color toy, not real paint. Match means the same relative amounts. Screen colors alone are not enough: different ratios can look the same.",
  "Before opening": "Your pots stay editable. Notes keep your first stripe, latest retry, and number of paints, not every stripe in between.",
  "Sample heading": "The sample recipe",
  "Recipe line": "{a} {first ingredient} for every {b} {second ingredient}",
  "Order label": "Ratio order: {first ingredient} : {second ingredient}",
  "Pot heading": "Your pot",
  "Primary action": "Paint a stripe",
  "Empty pot label": "Empty pot",
  "Empty instruction": "Add a scoop before painting. An empty pot has no recipe to compare.",
  "Capacity": "This picture table holds up to 24 scoops of each ingredient. Take one back to make room.",
  "Remove boundary": "There are no {ingredient} scoops to take back.",
  "Picture-editing notice, in grown-up fold and first removal's nearby caption": "Taking a scoop back edits the picture. It does not show how to separate real mixed paint.",
  "Saved draft status": "Your pot changed. Paint when you want to test this version.",
  "Earlier-stripe label": "Pot changed since this stripe",
  "Stripe heading": "Your painted stripe",
  "Stripe input line": "This stripe used {a} {first ingredient} and {b} {second ingredient} scoops.",
  "No stripe": "No stripe painted here yet. Your pot is ready to change.",
  "Endpoint notice": "One ingredient only. Its ordered counts are still shown.",
  "Feedback heading": "What these amounts show",
  "Revision invitation": "Your pot stays as you made it. Add or take back a scoop, then paint again. Your first stripe stays in your notes.",
  "Composition-band caption": "Total scoops: {total}. {first ingredient}: {a}; {second ingredient}: {b}. The patterns name the ingredients.",
  "Teaching heading": "Repeat the whole group",
  "Teaching footer": "This worked example leaves your own pot unchanged. You can return at any step.",
  "Example heading": "A separate 1-for-2 pot",
  "Groups caption": "Whole sample groups in this pot",
  "Zero groups": "No complete sample group fits yet. Your scoops are still shown.",
  "Leftovers": "Left over: {a} {first ingredient} and {b} {second ingredient} scoops.",
  "No leftovers": "No scoops left over.",
  "Grouping limit": "This view makes whole sample groups. Leftovers are kept, not rounded or removed.",
  "Table heading": "Same recipe, several amounts",
  "Column labels": "{first ingredient} scoops** · **{second ingredient} scoops** · **Recipe row",
  "Table footer": "The supplied rows repeat the whole recipe. Your pot's row shows what you made; it may differ.",
  "Current-pot ratio line, when its first ingredient is positive": "{second ingredient} divided by {first ingredient}: {b}/{a}. This row describes your pot.",
  "For a current pot with first ingredient0": "Division by zero is not defined. Use the ordered counts and the picture instead.",
  "Together explanation": "Choose Working together if a grown-up is helping with this invitation. It is your report, not a test.",
  "Optional spoken reason note": "Tell a grown-up in your own words or point to a group. Nothing spoken is recorded or marked.",
  "Return greeting": "Your pots are here. Keep changing them. Earlier stripes still show the amounts they used.",
  "Bridge action": "Take this group to Whole Batches",
  "Bridge heading": "A complete group in another game",
  "Bridge text": "Here is this table's saved sample and your {painted stripe/current unpainted pot}. Whole Batches repeats a complete recipe too, using separate preparation jars. This toy makes one combined color pot. The amounts and jobs in the two games are different. No answer travels with this link.",
  "Unsupported root": "Earlier Mixing Table data are retained in your notes. This format cannot be edited here. Other places are still open.",
  "Unreadable source": "This table's earlier source cannot be opened here. Its original stays in your downloadable notes. Other places are still open.",
  "Unreadable case": "This part of the earlier table cannot be changed safely. Its original stays in your notes. Other readable invitations are still open.",
  "Unknown model": "This earlier model's color picture is unavailable here. Its counts and recorded results stay in your notes. This source cannot be changed or painted here.",
  "Missing helper": "This earlier example cannot be shown here. Your pot is still open, and the original stays in your notes.",
  "Whole-report refusal": "This change could not fit safely in your downloadable notes. Your pot and earlier stripes stay as they were. Download your notes or visit another place.",
  "Count ceiling": "This invitation cannot keep another painted observation here. Its first and latest stripes stay in your notes. You can still change the pot or try another invitation.",
  "Save-off": "Saving is off. This table stays in this session. Download your notes if you want a copy.",
  "Storage failure": "This table is in this session, but it could not be saved on this device. Download your notes.",
  "Unreadable section": "Some retained entries cannot be read or matched to an invitation. Their originals stay in your notes.",
  "Reset explanation": "The game's confirmed reset removes this explorer's table records from this device. It does not remove another explorer's work or files already downloaded.",
  "title": "The Mixing Table",
  "invitation": "Scoop, change, and paint a stripe. Can a bigger pot keep the same recipe?",
  "beforeStart": "Your pots stay editable. Notes keep your first stripe, latest retry, and number of paints, not every stripe in between.",
  "notice": "Picture paint. Compare the scoop proportions.",
  "unreadable": "This table's earlier source cannot be opened here. Its original stays in your downloadable notes. Other places are still open."
};
