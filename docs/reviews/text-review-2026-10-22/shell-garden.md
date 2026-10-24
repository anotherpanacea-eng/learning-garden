# Text review: shell, garden home, help, progress, Number Garden

Scope: `dist/` app.mjs, index.html, storm-intro.html, companions.mjs, explorer-*.mjs, progress*.mjs, help*.mjs, learning-*.mjs, play-media.mjs, garden-*.mjs, plantings.mjs, orchard-ui.mjs, core.mjs, content.mjs. Snapshot of `main`, read-only. Line numbers refer to the dist files. Many dist lines are long template literals, so one line can hold a whole screen.

I found nothing in these files that asks for or invites real personal or family details. The explorer picker deliberately has no name field, and prompts like "tell someone what you notice" stay general.

## Top issues

1. **Grown-up disclaimers sit inside child screens.** Several child-facing pages end with sentences that explain the recording model, in adult vocabulary:
   - garden-ui.mjs:84 "Choosing or continuing records an invitation, not proof that you made something. You do not need to send us your work."
   - plantings.mjs:72 "These buttons remember only that you visited the invitation, not what you know or what you made."
   - help-ui.mjs:19 "This example is support. It does not answer or finish your waiting question."
   - plantings.mjs:39 "Plants stay when you take a break. They never measure what you know."

   A young reader or listener can't use these, and they flatten the scene. Move them into the existing "Grown-ups:" disclosures. Where a child line is still needed, keep it short and warm: "Your plants will be here when you come back." / "Your question is still waiting for you."

2. **"Explorer" names two different things, and the guide has two names.** garden-ui.mjs:55 says "Your explorer. Choose the character you would like to be." explorer-ui.mjs:7 uses "explorer" for a save slot: "Each explorer has a separate garden and notebook on this device." In companions.mjs:5, Ari is also "A young explorer". The guide is called "guide" (garden-ui.mjs:55 "Your guide"), "companion" (garden-ui.mjs:22 "Mira, your companion", index.html:26 nav "Companions", "Change companions"), and "{guide}" in the guide rails. Pick one word for each:
   - **guide** for Mira, Rowan or Ari
   - **your character** (or keep "explorer") for the avatar
   - **notebook** for the save slot: "Whose notebook is this?" / "Start a new notebook"

   Then rename the nav item to match.

3. **The same action has many labels.** A break or exit is "Take a break" (app.mjs:122), "Pause in the garden" (garden-ui.mjs:86), "Pause here" (help-ui.mjs:19), "Finish for now" (app.mjs:140), "Not today" (plantings.mjs:72), "Skip for now" / "Leave this one for now" / "Leave this question for now" (app.mjs:122, garden-ui.mjs:86). Help gets the same treatment:
   - The "A little hint" button opens a box titled "A little nudge" (app.mjs:119-120).
   - Help to work it out is "Work through it together" (app.mjs:119), "Think it through together" (garden-ui.mjs:84), or "Think through this example" (help-ui.mjs:19).

   Settle on one set and use it everywhere: "Take a break", "Skip for now", "A little hint" (the box title matches the button), and "Work it out together".

4. **The error text names a button that may not be on screen.** app.mjs:395 "Write a whole number, or use “Skip for now.”" After one try, that button turns into "Leave this one for now" (app.mjs:122). Either keep the label fixed as "Skip for now", or reword the message: "Write a whole number, or skip this one for now."

5. **Home page path names don't match the cards.** The intro at garden-ui.mjs:22 offers "follow a message, or imagine a cozy shelter". The cards just below say "Investigate a note", "Make a hideaway" and "Follow a creature". The story-paths heading at garden-ui.mjs:62 says "Follow a neighbor’s tracks, read a message, imagine a shelter". A child who hears "follow a message" can't find that button. Use one verb phrase per path in all three places, for example "Follow a creature", "Read a note", "Make a hideaway".

6. **A picture label gives away an answer, and the labels use the wrong nouns.**
   - **Mystery beds** (content.mjs:45) asks "How many rows are there?" The "Show a picture" view prints "6 rows, 4 in each row" (app.mjs:104) and announces "6 rows with 4 seeds in each row" (app.mjs:103). Hide the row count for this item: "Rows of 4 carrots".
   - **The array aria-label** always says "seeds", including for carrots and flowers. Use the item's noun.
   - **Patchwork** (content.mjs:52) colors rows 6 and 7 differently. The label doesn't mention the split, so the yellow/pink difference relies on color alone. Use "5 rows of yellow flowers and 2 rows of pink flowers, 6 in each row".

7. **Symbol glyphs are read aloud as part of button names.** app.mjs:186 has "✧ A little hint", "↗ Show me the first step", "▦ A smaller example", "▦ Picture playground" and "☷ Work through it together". Screen readers announce "sparkles", "north east arrow", "square with crosshatch fill" and so on. Two different buttons also share "▦". Wrap each glyph in `<span aria-hidden="true">`, the way the hear button already does. Give "Picture playground" its own icon, and say what it does: "Play with a picture".

8. **Some guidance is garbled or uses jargon.**
   - core.mjs:29 "Give a few facts that needed another look some room to grow, with a useful strategy alongside." This shows on the child's practice page under "A useful place to start", and even an adult has to read it twice. Suggest: "Some facts need another look. Let’s practice them with a helpful trick."
   - learning-connections-ui.mjs:8 "Let’s revisit the relationship with different objects." / "A first response fit. Let’s try a neighboring arrangement in another place." Suggest: "Let’s try the same idea with new things to count." / "That fit! Let’s try a close cousin of that problem somewhere new."

## Instruction clarity

- content.mjs:8 "Which expression would help you find 6 × 7?" and app.mjs:395 "Choose an expression to try." For 5 to 9 year olds, "expression" is jargon. Try "Which number sentence helps you find 6 × 7?"
- help-content.mjs:10 "Compare the results we have. Keep the conclusion about this trial." Suggest: "Look at what happened this time. Only say what we saw."
- help-content.mjs:13 "a guest can tell us which properties matter", and help-ui.mjs:9 "Tap a dish to check its properties." Suggest: "Tap a dish. Is it soft? Is it round?" or "check what it is like".
- garden-ui.mjs (readingLabels, near line 72) "Reading not observed" / "I read it independently". These are child-tappable buttons. Suggest: "We didn’t notice" / "I read it myself". Also garden-ui.mjs:84 "Leave “not observed” if you did not notice." becomes "If you’re not sure, leave it."
- learning-connections.mjs:60 "Solve it together, answer it, or take the quiet route first." It's unclear what "the quiet route" is, and "solve" and "answer" read as the same thing. Name the real button.
- learning-connections.mjs:53 "An earlier garden search needs its kept notes." This is opaque. Suggest: "An earlier garden search could not be opened. Grown-ups can find it in the notes."
- learning-connections-ui.mjs:13 "Finding packs and counting a total use related directions; this next task asks for a total." and "One chosen task. Our usual number choices stay the same." Suggest: "Last time you found how many packs. This time, find how many in all."
- plantings.mjs:72 "We can keep up to three different rectangles with 24 places to discuss." Suggest: "Keep up to three rectangles to talk about." Also "Could someone defend another choice?" uses debate vocabulary. Try "Could a different choice also make sense?"
- garden-ui.mjs:22 The home screen gives the "choose one" instruction twice ("Choose one small thing to try..." in the narration, then "Choose one small thing. There is no hurry, and help is always welcome." below the buttons), and then a long column of destination cards. Keep one short line next to the path buttons.
- companions.mjs:8-10 The explorer picture choices are labeled "Girl explorer", "Boy explorer" and "Gender-neutral explorer" (shown on explorer-ui.mjs:7 buttons). "Gender-neutral" is adult vocabulary on a child button. Use the characters' names, which already exist: "Fern", "Reed", "Sky".
- explorer-ui.mjs:7 "Earlier shared play stays together in its first explorer." This is cryptic even for grown-ups. Suggest: "Play saved before notebooks were separate is kept in the first notebook."
- learning-invitations.mjs:3, 4, 7, 8 The grown-up scope notes read like a spec: "Revisit a finite picture-and-phrase sequence for an audience. Discussion quality, independent narrative writing and the wider topic remain unobserved." Grown-ups deserve plain words too. Suggest: "Practices telling a story in order with picture cards. It doesn't check free writing."
- progress-transfer-ui.mjs:5 Six or more steps are packed into one paragraph ("On the old site, use the browser... Open Grown-up notes, switch to the explorer... Save that JSON file... Choose it below... Check the preview..."). Make it a numbered list. Write "5 MB" in place of "5 MiB" (also progress-transfer.mjs:33, app.mjs:302).
- explorer-storage.mjs:104 has four sentences of error ("The import may have been saved, but could not be verified..."), and explorer-storage.mjs:58/68 "Some saved progress could not be read. It has been kept." sounds contradictory. Lead with what to do, for example: "We couldn’t open some saved progress. We kept a copy, so nothing is lost."
- play-media.mjs:69 "No replacement will play silently." This is hard to parse. Suggest: "We won’t switch to another voice without telling you."

## Descriptive voice

- learning-invitations.mjs:12 "Explore lengths, a garden border, and an area to cover." and :13 "Explore halves, equal parts, and sharing-pond adventures." These read like a syllabus. Suggest: "How long is a snail’s path? How much mulch covers a bed?" / "One pie, two friends, and a pond that wants sharing."
- learning-invitations.mjs:5 "Meet different animals, compare changing clues, and find café parcels." Suggest: "Follow a snail’s silver trail to a lost café parcel."
- plantings.mjs:36, plantings.mjs:39 and app.mjs:257 repeat the same reassurance: "Every way of trying belongs here." / "Every kind of taking part is welcome." / "Every kind of trying helps our garden recover." Three versions of one abstract sentence start to sound preachy. Keep one, or replace it with an image: "Every seed you plant is a small hello to the garden."
- garden-ui.mjs:91 "Your Paris errand has reached a place to pause. There is room to talk about what happened, imagine a postcard, or wander somewhere else." This reads flat. Suggest: "The parcel is home, and the river is quiet. What would you draw on a postcard?"
- companions.mjs:5 Ari is "A young explorer who collects stories and surprising ideas." It's generic next to Rowan's line, and "explorer" collides with the avatar word. Suggest: "Keeps a pocket full of odd pebbles and odder questions."
- orchard-ui.mjs:9 and :11 "Imagine a cool, sweet bite. It is cold, soft, and sweet." The second sentence repeats the first and changes "cool" to "cold". Suggest: "Imagine a cool, sweet bite, soft as a cloud."
- garden-ui.mjs:22 Café card "Luckily, the cupboard holds some wonderfully odd alternatives." "Alternatives" is a flat word in a lively card. Suggest: "wonderfully odd swaps".

## Accessibility

- storm-intro.html:54 `<canvas aria-label="Animated film...">` has no `role="img"`, so many screen readers skip the label. The film is wordless, and listeners get no story. Add `role="img"`, and add a two-line text description under the film (app.mjs:488 "A little story about how our garden begins" could carry it).
- plantings.mjs:39 Empty patches show "＋ Plant here", while the aria-label is "Plant in row 1, column 1". Voice-control users who say "Plant here" won't match. Use "Plant here, row 1, column 1". Planted patches put `aria-label` on a plain `div` (often ignored), and the raw value is "water-lily" or "moss-stone". Add `role="img"` and replace the hyphens.
- play-media.mjs:45 "Voice stopped. Tap Hear to listen again." No button is labeled just "Hear". The real labels are "Hear it", "Hear the question" and "Hear passage and question". Suggest: "Tap a Hear button to listen again."
- garden-ui.mjs:22 The home narration skips the visible line "The garden needs a hand." and adds sentences that aren't on screen. A child reading along will lose their place. Make the spoken text match the visible text.
- index.html:26 The header shows "Grown-up notes ↗". The arrow means "opens elsewhere", but this is an in-app link. Drop the arrow.
- index.html:26 The About dialog's second paragraph runs about 170 words. Split it into short paragraphs or a list (what is saved, read-aloud, what is never collected, downloads).
- Back links ("← Back to the garden", app.mjs:107 and elsewhere) are read as "leftwards arrow, Back to the garden". Wrap the arrow in `aria-hidden`.

## Typos, spelling, style

- garden-ui.mjs:22 "Our hungry neighbors fancy dishes we haven’t got." This is British idiom. In American English: "Our hungry neighbors want dishes we don’t have."
- garden-ui.mjs:22 "Meet snails, woodlice and adult butterflies." "Woodlice" is British, and "adult butterflies" sounds clinical. Suggest: "Meet snails, roly-polies and butterflies."
- play-media.mjs:66 "Saved voice — unavailable in this browser" and :67 "— device default". These em-dashes are in the voice menu a child may open. Use "Saved voice (not on this browser)" and "(device default)". The grown-up notes rows (app.mjs:142, garden-ui.mjs:93) and the export title (app.mjs:401) also use em-dashes. Use a colon there.
- help-content.mjs:7 "named before “there”. Now look..." For American punctuation, put the period inside the quotes. Also "your original sign" just means "your sign".
- app.mjs:490 The film is titled "the café supper film", but its heading says "The welcome-back dinner". Pick one word.
- garden-ui.mjs:22 "First morning in the Learning Garden" is lowercase, but garden-ui.mjs:84 and index.html:26 use "First Morning" as a title. Capitalize it consistently.
- The owner dislikes the "not X, but Y" pattern, and it shows up in short contrast phrases on screens a child might hear read aloud: app.mjs:139 "This is a starting point, not a grade.", explorer-ui.mjs:7 "These are local game slots, not accounts.", learning-connections-ui.mjs:11 "Talking invitations, not scored habitat or reading observations." Restate them positively, for example "This helps us choose what to try next."

## Lines worth keeping (voice reference)

- companions.mjs:4 "I have a pencil, three ideas, and absolutely no idea where my other sock went."
- learning-invitations.mjs:37 "Follow a curiosity. A parcel, a puddle, a hungry visitor."
- garden-ui.mjs:22 "Puddles, frost, and a good question." and "The post must fly. Borrow a broom at Willow Post Office."
- plantings.mjs:39 "After the rain, we plant. The storm left bare patches."
- orchard-ui.mjs:10 "Tap: the pod snaps into crisp little curls."

Also good: app.mjs:140 "A little practice, planted.", app.mjs:109 "Behind the library, words are growing.", app.mjs:490 "Six tables, six lanterns.", garden-ui.mjs:51 "There are stories beside the river, among the books, and above the rooftops.", and the index.html footer "A little space for big thinking."
