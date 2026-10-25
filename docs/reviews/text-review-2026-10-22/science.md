# Text review: science, living garden, workshop, notebooks, rain, bell studio

Scope: child- and grown-up-visible strings in `dist/` living-*, science-*, workshop-*, plant-study-*, field-notebook-*, notebook-sections, rain-paths-*, rain-notebook-*, bell-studio-*. Line numbers refer to the main snapshot. Grown-up-only panels ("Grown-ups: ...", "Grown-up notes") were read lightly; their density is fine for adults and is flagged only where it leaks into the child's path.

## Top issues

1. **Disclaimers crowd the child's path.** Nearly every child-facing screen carries a "this is a model, not a measurement" sentence. They are accurate, but a young reader meets them before the fun part and they read like spec text. Examples:
   - `science-content.mjs:41` "They are a drawing choice, not measurements of individual speeds."
   - `bell-studio-content.mjs:8` "A schematic of the source signal changing over the same short time, not a measurement of the speaker or a drawing of air moving up and down."
   - `bell-studio-ui.mjs:15` "This is practice with a supplied model, not a hearing test."
   - `plant-study-content.mjs:38` "That is an observation of our invented model, not a measurement of a real plant."
   - `rain-paths-content.mjs:9` "These are arbitrary model-water tokens in an invented closed machine, not measured rain or a flood forecast."
   - Suggestion: keep one short, warm framing line per activity on the child's screen (e.g. "These are pretend seedlings we drew for this game.") and move every other caveat into the existing Grown-ups panel.

2. **"Water Lab" names two different places.** The in-game destination is "Water Lab" (`index.html` nav, `rain-paths-ui.mjs:23,27` "Return to Water Lab", "Take a break in Water Lab"), while the science missions send children to Marble's external site with "In the Water Lab, tap Ice (−5°C)" (`science-content.mjs:13`) and stage name "Try the Water Lab" (`science-ui.mjs:9`). The same screen's heading is "The water field notebook" (`science-ui.mjs:12`), which also collides with the plant "Field Notebook". Suggestion: call the external site "Marble's Water Lab" every time (instructions included), and either retitle the in-game heading to match the nav ("Water Lab") or rename the nav.

3. **Plant Study and Field Notebook instructions use adult research vocabulary.** "specimen", "adequate light", "source rows", "quantity", "unit", "applied entries", "requested pair", "absolute difference", "relevant conditions".
   - `field-notebook-ui.mjs:23` "Copy each selected stem length in mm into a bar. Set a bar to update the picture, or apply both entries when you check. Choose its quantity and unit labels. A blank is waiting for a value; zero is a value." Four steps and a philosophy point in one block. Rewrite: "Type each stem length into a bar." / "Pick a label: what are you measuring?" / "Tap Check my chart." Keep the blank/zero idea for the feedback only.
   - `field-notebook-ui.mjs:18` "Do both numerical bars, the quantity label and the unit agree with the supplied table?" Rewrite: "Do your bars and labels match the table?"
   - `field-notebook-core.mjs:48`, `rain-notebook-core.mjs:42` "The absolute difference is {n} mm." Rewrite: "They are {n} mm apart."
   - `plant-study-content.mjs:4` label "Adequate light" vs "Too little light". Rewrite: "Enough light" / "Too little light".

4. **Rain Paths uses three names for one object and several for its parts.** The same apparatus is a "machine", a "tray" and a "chamber" (`rain-paths-content.mjs:35` "the same chamber and outlet"; `rain-paths-ui.mjs:16` "Matched machine counts"; question "Which tray sent more..."). The charting area is "Rain Paths charts" (`rain-notebook-ui.mjs:29,31,33`), "Field Notebook · a familiar result" (`rain-notebook-ui.mjs:33`), "water-chart record" (`rain-notebook-ui.mjs:30`) and "Carry these counts to the Field Notebook" (`rain-notebook-bridge.mjs:10`). Suggestion: pick "tray" for the child (two trays, A and B) and "Rain charts" for the chart area, and use them everywhere.

5. **Bell Studio button group has a wrong accessible name.** `bell-studio-ui.mjs:13` wraps all four add buttons (Low, Middle, High, Rest) in `aria-label="Add a silent composition slot"`. A screen reader user hears "silent" for sounding notes. Rewrite: `aria-label="Add a note or a rest"`. Same file line 15: group labels "Choose a finite computer-tone pair" and "A comparison draft" are spec words; use "Choose two tones to compare" and "Your answer".

6. **Science mission instructions cram several steps into one item and lean on external-UI jargon.** `science-content.mjs:13` "In the Water Lab, tap Ice (−5°C). Look at Glass, then tap Atoms to inspect the model’s tiny water molecules." and `:14` "Compare the arrangement and movement with the ice view. You can switch between the two presets as often as you like." Rewrite as one action per line: "1. Open Marble's Water Lab. 2. Tap Ice. 3. Tap Atoms to see the tiny water bits up close. 4. Now tap Your room. What looks different?" Replace "presets", "arrangement", "sample", "vigorously" (`:32`, `:38`, `:41`).

7. **Process-record text leaks into the child's flow.** These read like notes to the developer and appear beside the child's buttons:
   - `science-ui.mjs:51` "This prediction was selected after this visit’s explanation was opened."
   - `science-ui.mjs:52` "Choosing this link only records that it was selected, not whether you visited or tried anything."
   - `plant-study-ui.mjs:15` "Earlier model viewing is uncertain; this is not labelled before-looking."
   - `rain-paths-ui.mjs:18` "Earlier result exposure is uncertain."
   - `living-adaptive-core.mjs:18` "Two different new tasks matched on the first response without scoped support. Try a deeper question." (shown under the trail picker in `living-adaptive-ui.mjs:16`)
   - Suggestion: move these to Grown-up notes. For the adaptive picker, child-safe reasons like "You found these quickly. Ready for a harder one?" and "Let's try a few more like this."

8. **British spellings and em-dashes in visible text.** See Typos section; "labelled", "millimetres", "recognise" and "judgement" all appear on child screens, and four visible labels use an em-dash.

## Instruction clarity

9. `rain-paths-ui.mjs:17` "Bring four new rain tokens down onto EACH tray. Batch {n} of {m}. A batch is a group of tokens, not a time interval." Rewrite: "Drop four raindrops on each tray. (Round {n} of {m}.)" and drop the batch definition.
10. `rain-paths-content.mjs:35` "Which single factor changed between these matched machines?" Rewrite: "What is different about Tray A and Tray B?"
11. `rain-paths-content.mjs:38` "How many more new-runoff tokens did B collect than A? (Optional)". Rewrite: "How many more tokens ran off Tray B? (You can skip this.)"
12. `rain-paths-ui.mjs:19` "Restart explicitly refills the cloud for familiar practice." Rewrite: "Start over fills the cloud again. Your notes stay safe."
13. `plant-study-content.mjs:36` "Model day {d}: which sentence reports something directly shown in this invented picture?" Rewrite: "Day {d}: Which sentence tells only what you can see?"
14. `plant-study-content.mjs:43` "A proposed water test: which comparison could help us investigate water amounts? We have no water-result data." and choice "Keep light and other relevant conditions alike; compare two measured water amounts." Rewrite: "Want to test water? Which plan is fair?" / "Keep the light the same. Give two pots different amounts of water." / "Change the light and the water together."
15. `plant-study-content.mjs:9` controls text "Already-emerged cress seedlings: same variety, starting stage, containers, growing medium, elapsed time..." Rewrite for the child panel: "Both groups get the same seeds, pots, soil, air and warmth. Only the light is different." Keep the full list for grown-ups.
16. `living-adaptive-ui.mjs:29` legend "Which sentence is your evidence?" while the prompt in `living-adaptive-content.mjs:25` asks "Which sentence is your clue?" Use "clue" in both.
17. `living-adaptive-ui.mjs:26` "Compare our clues" is the step heading, the step tab and the submit button. Rename the button "Check my choice".
18. Check-button names drift across one activity: "Check our idea" (`living-adaptive-ui.mjs:34`), "Check our count" (`living-spiral-ui.mjs:59`), "Check our note" (`living-adaptive-ui.mjs:29`), "Compare with the source" (`bell-studio-ui.mjs:15`), "Compare with the frozen source" (`rain-notebook-ui.mjs:25`). Suggest a single "Check" verb pattern: "Check my count", "Check my answer".
19. `living-adaptive-content.mjs:6` depth labels shown as an eyebrow on the child's screen: "Use picture evidence", "Find the pack count". Rename to "Look for clues", "How many packs?" or hide from the child.
20. `living-adaptive-ui.mjs:33` "One unit pack holds {n} bites." Drop "unit": "One pack holds {n} bites."
21. `workshop-ui.mjs:20` "When changing height, keep this surface / When changing surface, keep this height ... Both choices are open. Only the fixed setting for your chosen investigation is used." Rewrite: "What will you change?" then show only the matching "Keep this the same:" picker.
22. `bell-studio-ui.mjs:15` "In this computer pair, how is the second tone set?" Rewrite: "Is the second tone higher, lower, or the same?"
23. `living-spiral-content.mjs:31` "Would the same food necessarily suit a caterpillar? Ask what its own host plant is." "Host plant" is unsupported. Rewrite: "Would a caterpillar eat the same food? Caterpillars often eat the leaves of one special plant."
24. `rain-notebook-bridge.mjs:10` "Returning keeps your chart, entries and place. To start a new chart from this shown result, replace the current draft explicitly. This clears this case’s selected rows, bar values and unfinished answers..." Rewrite: "Start a new chart? Your old bars and answers will be cleared. Kept charts stay safe."

## Descriptive voice

25. `science-content.mjs:9` "Pip and Dot investigate what changes inside the water as they plan the garden’s recovery." Reads like a brief. Try: "Pip kneels by the puddle's frosty rim. 'It was hard this morning,' he says. 'Where did the hard go?'"
26. `rain-paths-ui.mjs:27` "The low path is wet. What could change the amount that reaches an outlet?" Flat. Try: "Rain keeps finding the low path. Where does it go when the ground is full?"
27. `living-content.mjs:3` "Its surface is drawn dry, with no cover overhead." and `living-spiral-content.mjs:12` "The pictured surface and ground are dry and exposed." The "drawn"/"pictured" hedge kills the image. Try: "The sun bakes this patch. Nothing shades the dry dirt."
28. `living-content.mjs:8` welcome packs snail, beds, café parcel and clue into five sentences ("A missing café parcel is beside damp shelter on land."). Split the mood from the task: "Moss is planning new beds. But the garden already has neighbors. Somewhere, a land snail is looking for a cool, damp place to rest." Then the parcel clue on its own line.
29. `living-content.mjs:10` "Our rows of counters tell us how many spaces are on a plan. They do not tell us what a real plant or animal needs." Abstract for a closing beat. Try: "A plan can count beds. Only looking closely tells us who needs the shady corner."
30. `field-notebook-ui.mjs:26` "Help rebuild the growing shelf with an observation we can explain." and `workshop-ui.mjs:20` "Our parcel cart needs a new ramp after the storm. Choose one thing to investigate." Serviceable; each could take one sensory line ("The old ramp washed into the hedge. The cart waits, wheels muddy.").

## Accessibility

31. `rain-paths-ui.mjs:17` ALL CAPS "EACH" will be spelled or shouted by some screen readers. Use plain "each" (bold if emphasis is needed).
32. `plant-study-art.mjs:4` axis tick labels use `font-size="9"` inside a small SVG; at phone width they are tiny. The paler leaf color is also the only visible cue for leaf color (the visible caption says only "A · 38 mm"). Raise tick size and add "paler leaves" to the visible caption for the dim group.
33. `bell-studio-content.mjs:16` and `bell-studio-ui.mjs:15` the pitch comparison is audio-first. The shapes and Low/Middle/High labels are a good text equivalent, but they appear only when the ladder support is opened. Show the pair's names ("Low, then High") by default so a child with sound off or a hearing difference can still answer. (Note `bell-studio-ui.mjs:15` already prints "Source pair: ..."; rename it "The two tones: Low, then High.")
34. Long child-facing paragraphs: `science-ui.mjs:18` hub intro plus three blocks before the first button; `rain-notebook-ui.mjs:17` "Full frozen machine source and controls" block. Break into short lines or collapse behind "More about this".

## Typos, spelling and style

35. British spelling (the game otherwise uses American, e.g. "neighbors", and `plant-study-ui.mjs:12` uses "millimeters"):
    - "labelled": `living-spiral-content.mjs:18`, `plant-study-content.mjs:38`, `plant-study-ui.mjs:15`, `plant-study-ui.mjs:16`, `rain-paths-ui.mjs:25`, `living-spiral-ui.mjs:62` (grown-up). Use "labeled".
    - "Millimetres (mm)", "Centimetres (cm)": `field-notebook-content.mjs:4`; "millimetres": `field-notebook-core.mjs:30`, `field-notebook-ui.mjs:15,18,24`; "millimetre", "litre": `rain-paths-content.mjs:13`. Use "millimeters", "centimeters", "liter".
    - "recognise": `bell-studio-content.mjs:13`. Use "recognize".
    - "judgement": `bell-studio-core.mjs:68`. Use "judgment".
36. Em-dashes in visible labels:
    - `workshop-ui.mjs:29` button "Comparison kept — keep exploring". Use "Kept! Keep exploring".
    - `field-notebook-art.mjs:8` "Blank — no value entered" and `rain-notebook-art.mjs:6` "Blank — no applied value". Use "Blank: no number yet".
    - `rain-notebook-content.mjs:14` row label "Tray A — new runoff". Use "Tray A: new runoff".
    - `rain-paths-ui.mjs:17` " — zero move; none are added". Use ". None move."
37. "Not X" corrections stacked in child feedback, e.g. `living-spiral-content.mjs:29` "Find dark, damp cover, not simply a familiar object.", `living-spiral-content.mjs:3` "not just the name of an object", `science-content.mjs:42` "changes their motion, not the identity or size of each water molecule". State the positive: "Find a dark, damp hiding place." / "Warming makes them move more. They stay the same size."
38. Odd or slightly scolding tone:
    - `rain-notebook-ui.mjs:28` "Read your applied values, not the numbers you wish were there." Rewrite: "Read the bars you made."
    - `rain-paths-ui.mjs:23` "Both routes honestly have no new tokens." "Honestly" implies a suspicion of cheating. Rewrite: "No new water came, so both paths stay empty."
39. Personal details: nothing invites real family details. `living-content.mjs:10` "What might you leave undisturbed beside your new bed?" could read as the child's real bedroom; use "beside the new garden bed".

## Lines worth keeping (voice reference)

- `living-spiral-ui.mjs:59` "A neighbor stays. A parcel travels."
- `living-ui.mjs:34` "Room for beds. Room for neighbors."
- `living-spiral-ui.mjs:66` "Same garden. New things to notice."
- `science-content.mjs:20,28` frame and mission titles "Still ice, still moving" and "A little warmer, a little livelier"
- `bell-studio-ui.mjs:16` "A call can hold an unfinished idea." and `science-ui.mjs:58` "A visit can end without an answer to everything."

Also good: `living-ui.mjs:39` "Who else calls this garden home?" and `rain-paths-ui.mjs:26` "Follow the rain, token by token." Science accuracy checked: ice open lattice and denser liquid, evaporation below boiling, vapor invisible, woodlouse seven leg pairs, etiolated dim-light seedlings (longer, thinner, paler), and frequency-to-pitch in Bell Studio are all stated correctly.
