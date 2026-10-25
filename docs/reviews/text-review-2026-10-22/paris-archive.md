# Text review: Paris, Paris en français, Travelers' Archive

Scope: `dist/paris-content.mjs`, `paris-core.mjs`, `paris-library.mjs`, `paris-pack-core.mjs`, `packs/puppet-post.mjs` (the Paris pack it compiles), `paris-film.html`, `paris-scene.svg`, `french-content.mjs`, `french-core.mjs`, `french-library.mjs`, `french-story-data.mjs`, `travelers-archive-*.mjs`. Read-only review of a snapshot of main. Line numbers refer to that snapshot.

Overall: the English Paris stories are the strongest writing here. They are short, concrete and often funny in just the right way. The French is correct and well pitched, with a few stiff sentences. The Travelers' Archive is the weak spot. Its text was written for an adult historian, and the spec vocabulary ("source", "chronology", "production date", "capture moment", "schematic", "supplied") leaks straight into what a young reader is asked to read and tap.

---

## Top issues

1. **The Travelers' Archive reads at an adult level throughout.** Examples: `travelers-archive-content.mjs:11` "These are two different kinds of source, not two independent eyewitness accounts."; `:50` "Not by itself; the exact capture moment is not established here."; `travelers-archive-ui.mjs:20` "Photo object: museum production date 29 January 1910. Scene: January flood; exact capture moment not established here." A 5 to 9 year old cannot decode this, and when it is read aloud it is just as hard to follow. Suggestion: keep one plain idea per line. "This photo shows one street by the river." "The date cards tell us when things happened." "Some questions these clues cannot answer." Move the provenance detail (production date versus scene date, creator attribution, reuse notices) into the "Who made this?" `<details>` and the grown-up notes.

2. **The same things have different names on different screens in the Archive.** One source is called "the chronology" (questions, feedback), "Date cards" (tab, `ui.mjs:22`), "The archive's date cards" (`ui.mjs:21`), "Highest-mark card" (`ui.mjs:23`) and "my evidence cards" (`ui.mjs:26`). The photo is "Photograph card" (`content.mjs:39`), "Photo card" (`ui.mjs:23`) and "Photograph" (`ui.mjs:22`). A child told to "use the chronology" will not find a button with that name. Suggestion: pick **"the photo"** and **"the date cards"** and use only those two names everywhere, in prompts, feedback, tabs and the reply.

3. **French "hint" turns into one long paragraph that also gives away the answer.** `french-content.mjs:53` and `french-library.mjs:27` build the hint as `hint + " English meaning: " + full translation + " Words to borrow: " + glossary`, and it renders as a single `<p>`. That can be 80 or more words of mixed French and English, and the full translation answers the question. Suggestion: give the hint, the English meaning and the word list their own short blocks, each with a heading ("A clue", "In English", "Word help"). Or show the clue first and the translation on a second tap. Rename "Words to borrow" to "Word help" so it matches the button label "English meaning & word help".

4. **French inside English text has no language markup.** Hints, explanations and helper lessons mix French phrases into English sentences with « » (for example `french-content.mjs:9` "« Le sac est sous la table. » The bag is under the table."). Screen readers and the Hear buttons will say the French in an English voice, and some voices read « » out as "left-pointing double angle quotation mark". The French project and ending titles ("Une carte pour le jardin" `french-content.mjs:61`, "Un message à emporter" `french-library.mjs:33`, "Une petite pause à Paris" `french-content.mjs:31`, "Une pause à Paris" `french-library.mjs:9`) also render in `<h2>` without `lang="fr"`, because the UI only adds it for passages, prompts and choices. Suggestion: write the French fragments as `<span lang="fr">…</span>` in the data (or mark them up, for example `[fr:Le sac]`), and use English quotation marks inside English sentences.

5. **The text that explains the suggested passage length leaks the spec.** `french-core.mjs:38` "Two different new stories had a first answer found on the first try, reported read independently without recorded help. Try a little more connected French; every choice stays open." and `paris-core.mjs:35` "Two different new stories were answered on a first try without recorded help." Even a grown-up has to read these twice. `paris-core.mjs:24` "Begin with a little more text." is confusing on a first visit (more than what?). Suggestion: "You found two new answers on your own. Want to try a longer story? You can pick any length." / "Let's start with a medium story. You can pick any length."

6. **Order choices use the "→" arrow as their only separator.** `paris-content.mjs:123-125`, `paris-library.mjs:68,80`, and the generated order choices in `paris-pack-core.mjs:87` and `french-library.mjs:22`. Screen readers say "right arrow" or skip it, so a listener hears "Tie the ribbon put in the pages attach the label". Suggestion: use "Tie the ribbon, then put in the pages, then attach the label" for the spoken or accessible text, or put an `aria-label` with "then" on each choice.

7. **A historical label is reversed.** `travelers-archive-content.mjs:38` "The bridge named for the river measuring scale." It is the other way around: the Austerlitz scale is named for the bridge, Pont d'Austerlitz. Suggestion: "The bridge where the river's height was measured."

8. **The Archive never tells a child what happened.** The header says "Paris and the Seine flood, 1910" (`ui.mjs:34`) and the parcel story (`content.mjs:9`) talks about "a modern archive's dates", but no line says that the river rose and water filled the streets. Suggestion for `story`: "In January 1910, the river Seine rose over its banks and water filled streets in Paris. A parcel at Lucie's bookstall holds a real photo from that winter and some date cards. A reader has a question. Can you help answer it?"

---

## Instruction clarity

9. `travelers-archive-ui.mjs:24` "Select a card to add it to your order. Use the movement buttons to change it." The buttons are labeled "Earlier" and "Later". The words "movement buttons" appear nowhere else. Rewrite: "Tap a card to add it. Tap Earlier or Later to move it."

10. `travelers-archive-ui.mjs:26` "A human can read this with you; the game does not grade your words. Up to 2,000 characters, saved only on this device." "A human" is odd, and "characters" is a hard word for this age. Rewrite: "You can write, or tell a grown-up out loud. Your words stay on this device." Show the character count only near the limit.

11. `travelers-archive-ui.mjs:27` "A reply draft is kept. Keeping again replaces that snapshot with this draft." / `:27` "Kept locally with source labels and support. These words were not automatically checked." / "Your reply is not sent or inserted into an existing delivery." This is storage-model language. Rewrite: "Your reply is saved." / "Saving again keeps your newest reply." Drop the delivery sentence, or move it to grown-up notes.

12. `travelers-archive-ui.mjs:18` "Earlier check. These comments refer to an earlier draft. Compare again when you want feedback on this draft." Rewrite: "You changed your answer. Tap Check again to hear about the new one."

13. Archive buttons for checking answers each use a different verb: "Compare this place label", "Compare my date order", "Think about my evidence cards" (`ui.mjs:23,24,26`). Use one verb everywhere: "Check my place", "Check my order", "Check my reply".

14. `travelers-archive-content.mjs:43` "The picture shows boats and water beside buildings. Is that shown?" The question answers itself. Rewrite: "Can you see boats in this photo?"

15. `travelers-archive-content.mjs:50` The correct choice, "Not by itself; the exact capture moment is not established here.", is the longest one and the only hedged one, so its tone gives it away (AGENTS.md asks that it not). The same pattern shows in `:49` and `:54`. Rewrite the question as "The museum's date is January 29. Does that tell us the exact day the photo was taken?" with choices "Yes, exactly that day" / "Not for sure" / "The gray colors tell us the day" / "Not sure yet". Note that "Not for sure" and "Not sure yet" now sound alike, so consider removing "Not sure yet" from this one question.

16. `travelers-archive-ui.mjs:28` The support example "an original modern drawing of a closed shop shows its door in that drawing. It does not tell us what the shopkeeper was thinking…" is confusing, and the help text "A symbol has a particular job." is vague. Rewrite the example: "Imagine a drawing of a shop with its door shut. We can see the door. We can't see what the shopkeeper is thinking." Rewrite the help: "The camera shows where the photo was taken. The gauge shows where the river was measured."

17. `travelers-archive-ui.mjs:28` The grown-up reading report sits inside the child's support panel: "How did we read this visit?" "This is a separate report, not a reading assessment." "Reported read independently". Label it as being for grown-ups ("For grown-ups: who did the reading?") and use plain options: "Read together", "Child read alone", "Didn't notice".

18. `paris-content.mjs:158` "Try the meaning of the same small word part in your waiting message." and `:190` "Look for the order words in the separate waiting passage." "Waiting message/passage" is internal vocabulary. Rewrite: "Now try re- in Lucie's note." / "Now find the order words in Lucie's story."

19. `paris-content.mjs:136` The postcard prompt is 40 words long and packs three options plus an opt-out into one block, with "Optional idea" and "dictate" for a young reader. Rewrite: "Make a postcard about your Paris trip. You can say it, draw it, or tell a grown-up what to write. Or save the idea for another day."

20. `french-story-data.mjs:45` "Read the map and choose another way." and `:105` "Read the evidence before opening it." The child does neither of these things (there is no map and nothing to open). Rewrite: "A gate is closed. How will Nora get in?" / "Something rattles in a box. What could it be?" Also `:65` "Match a written clue to its owner." Rewrite: "Whose scarf is it? Look for a name."

21. `paris-library.mjs:7` "Find evidence and put a small adventure in order." and `paris-content.mjs:98` title "Point to the evidence". "Evidence" has no support at this age. Rewrite: "Find the words that show it, and put a small adventure in order." / "Which words show it?" The same applies to the skill labels "Identify evidence in a French passage" and "Find an action and its subject in French" (`french-story-data.mjs:78`, `french-content.mjs:18`) if they are shown in grown-up notes; plainer versions work for grown-ups too.

22. `french-content.mjs:9` The question title "Find the parcel" sits on "Où est le sac ?" (where is the bag). The parcel and the bag are different things in the passage. Retitle: "Find the bag".

23. `paris-content.mjs:91` The explanation says "The cover is not described as a handle", but the wrong choice was "To make the box easier to carry". Rewrite: "Nothing says the cover makes the box easier to carry, and Pip can still see the ribbon."

---

## Descriptive voice

24. **The colon-gloss pattern inside the stories reads like a worksheet and gives away the vocabulary answer.** `paris-library.mjs:14-16` "Lucie must rewrap it: she wraps the same book again."; `:26-28` "Dot will reuse an old curtain: she will use it again as a rug."; `:38-40` "Water in a little tray … was still: no ripples moved across it." Let the context carry the meaning, the way the "narrow" passage already does so well. Suggestions: "The cloth slips off. Lucie sighs and begins to rewrap it, round and round, a second time." / "Dot drags out an old curtain. She will reuse it, and today it can be a rug." / "The water in the little tray was still. Not one ripple moved." (Short sentence fragments like this are fine in story text.)

25. Story bodies on the second question are spec text: "The same passage stays open for another question." (`paris-library.mjs:108`, `paris-pack-core.mjs:116`) and "The same passage stays open while Pip and Dot look for evidence." (`paris-content.mjs:99`). Suggestion: "The story is still here. Let's look again." or a small line in the story's own voice: "Dot flips back to the first page."

26. `paris-content.mjs:85` "Lucie gets the parcel ready to carry beyond the bookstall." and the rain passage are flat compared with the rest. One lyrical touch would lift the scene without changing the clue: "Rain began tapping on the bookstall roof, one patient finger at a time."

27. `travelers-archive-content.mjs:19` The photo summary ("This photograph records one view … that does not by itself fix the exact moment pictured.") could be the most evocative passage in the Archive and is the flattest. Suggestion: "Water lies where people usually walk. Boats float beside the buildings. Someone has built a wooden walkway above the water. This is one corner of Paris, on one winter day."

28. Explanations sometimes slip into adult phrasing: "Re- contributes the meaning 'again.'" (`paris-library.mjs:32`); "No request for a suitcase is given, and the fountain has water." (`:44`); "Those details concern width" (`paris-content.mjs:77`); "describes Lucie's protective action" (`:105`). Suggestions: "Re- adds 'again.'" / "Nobody asks for a suitcase, and the fountain is full." / "Those clues are about how wide the path is." / "shows Lucie keeping the pages safe."

29. `travelers-archive-content.mjs:44` "Everyone in Paris was happy." This is a strange claim to put next to a flood photo, and it may read as glib. Use a claim a child might actually make: "Everyone in this photo felt cold. Does the photo show that?" The feedback "We do not know what these particular people thought from their appearance." becomes: "A photo shows faces and coats. It can't show what people felt inside."

---

## Accessibility

30. `travelers-archive-content.mjs:23` The photo alt text ends with teaching caveats: "This one view does not show all Paris or establish an exact street depth." Alt text should describe the picture. Keep the description, add a little more of what is visible, and move the caveat into the figure caption: "Old black-and-white photo. Floodwater fills a street beside tall buildings. Boats and people are near a raised wooden walkway." Similarly, `paris-scene.svg:2` desc "…with no answers to the reading tasks" is a note for authors and should be cut.

31. `paris-film.html:54` The `<canvas>` has an `aria-label` but no `role="img"`, so many screen readers will ignore the label. Add `role="img"`. The label itself is lovely: keep it.

32. Archive links open new tabs with no warning, and they lead away from an offline child game: "Museum record", "CC0 licence", "Archives de Paris source page", "Read the official chronology PDF" (`ui.mjs:20-21`). Put them under the grown-up details, and add "(opens a new tab)" to the visible or accessible name.

33. The Archive page tabs (`ui.mjs:34`) use `aria-pressed` buttons with numbers ("1. Open the parcel"). For page navigation, `aria-current="page"` on the active item reads better. Also check that the destination emoji symbols (📚 🌊 🌱 ⛵ 🌿, `paris-library.mjs:5-7`, `french-library.mjs:5-7`) are `aria-hidden` wherever they render. Otherwise a listener hears "books, water wave".

34. Reading load: a single Archive screen can stack the h2, a question, a source panel with three notices, a support panel and a footnote ("sourceNotice", "mapNotice", "timelineNotice"). For a listener, each Hear button reads paragraphs like `ui.mjs:20` "…but that alone does not fix the exact moment pictured." Cut each narration down to what a child needs for the current task.

---

## French

35. `french-story-data.mjs:29` "Enfin, il accroche l'affiche sur le mur, car les passants peuvent la lire ici." "Car … ici" sounds stiff. Rewrite: "Enfin, il accroche l'affiche sur le mur. Là, les passants peuvent la lire." (Gloss: "There, people walking by can read it.")

36. `french-story-data.mjs:69` "Elle ne sait pas à qui elle appartient." Here "elle … elle" is ambiguous (Mila or the scarf?). The sentence "Comme le nom est le sien, Léa reconnaît son écharpe." is stilted. Rewrite: "Elle ne sait pas à qui est l'écharpe." / "Léa voit son nom et reconnaît son écharpe." In the gloss (`:74`), "whom it belongs to" should become "who it belongs to", and with American punctuation the period goes inside the quotes: "reads the name “Léa.”"

37. `french-story-data.mjs:89` "Amir organise leur goûter pour leur pause." The repeated "leur" is heavy. Rewrite: "Amir prépare le goûter des musiciens." (Gloss: "Amir gets the musicians' snack ready.")

38. Word lists: `french-story-data.mjs:56` glosses "apporte" but never "une porte = a gate" (the two look alike to a beginner). Add it. `:156` "un appareil = a camera here": teach the everyday form instead, "son appareil photo" in the passage and "un appareil photo = a camera" in the word list. `:5` The invitation says "among the maps" but the passage has only one "petite carte". Rewrite the invitation: "A message hides near a map. Follow the clues at the bookstall."

39. `french-content.mjs:19` contains an em dash: "« dans un petit bassin » — in a small pool." Rewrite: "Pip puts the boat in a small pool: « dans un petit bassin »." Typography: the spaces before "?", ":" and "»" are ordinary spaces, so a line can wrap and leave "?" or "»" alone at the start of a line. Use U+202F (narrow no-break space) or U+00A0.

French that is already right and well pitched: the question forms ("Où Pip met-il le bateau ?", "Qu'est-ce qui tombe dans le bateau ?"), the D'abord / Ensuite / Enfin sequences, and the three-tier passages, which grow by adding clauses rather than harder words.

---

## Typos, spelling, style

40. Spelling and typos:
- "Paris1910" is missing a space (`travelers-archive-ui.mjs:65`).
- British spellings that should be American:
  - "labelled" (`travelers-archive-core.mjs:23`, `travelers-archive-art.mjs:4`) should be "labeled".
  - "catalogue" (`travelers-archive-content.mjs:18,23`) should be "catalog".
  - "licence" (`content.mjs:23`, `ui.mjs:20` link text "CC0 licence") should be "license".
  - "colourization" (`content.mjs:23`) should be "colorization".
  - "metre" (`content.mjs:45`) should be "meter". For this age, "as deep as a grown-up is tall" is easier still.
  - "fitted inside" (`paris-library.mjs:88`, twice) should be "fit inside".
- Phrasings that read as British:
  - "all Paris" (`content.mjs:23,43,49,53`, `core.mjs:27`) should be "all of Paris".
  - "to stop it blowing away" / "stop the card blowing away" (`paris-library.mjs:74-79`) should be "stop it from blowing away".
  - Dates such as "28 January 1910" (throughout the Archive) should be "January 28, 1910".
- Serial commas are mixed: "first, next, and last" (`paris-content.mjs:120`) but "First, next and last" (`paris-library.mjs:91`, `puppet-post.mjs:20`). Pick one style.
- "Not X" contrast constructions in child-facing text: `content.mjs:11` "…kinds of source, not two independent eyewitness accounts"; `:43` "a local picture detail, not a statement about all Paris"; `ui.mjs:23` "where the photo was taken, not where the museum is"; `core.mjs:24` "show order, not equal lengths of time". Rewrite each as a plain positive statement: "The photo shows one street." / "The camera shows where the photo was taken." / "The spaces between the cards don't mean anything. Only the order matters."
- Grown-up text: `puppet-post.mjs:16` "…remain unobserved; this is no mastery claim." Rewrite: "This story practices putting three steps in order. It doesn't check retelling or reading speed."

Tone check: I found no scolding, no inflated praise and no condescension. Nothing invites real personal or family details: the postcard and reply prompts ask about the story and leave the child free to keep an idea for later. "Not sure yet" and "An unfinished or uncertain draft is welcome." handle uncertainty well.

---

## Lines worth keeping (voice reference)

- "Dot rode on the parcel and made no traffic complaints." (`paris-content.mjs:71`)
- "“I like to meet the ending first,” the fox explains, turning the book upside down." (`paris-library.mjs:28`)
- "Pip suggested a very determined ribbon." (`paris-library.mjs:52`)
- "The beetle climbed aboard, carrying a suitcase no bigger than a bean." (`paris-library.mjs:39`)
- "Behind the curtain, a sock puppet peeks out and asks whether anyone has borrowed a puddle." (`packs/puppet-post.mjs:10`)
- Also good: "The parcel gives one quiet sniff and settles down." (`paris-library.mjs:16`); "A sparrow … tilted its head at every knot." (`:64`); "La rivière traverse son image comme un long ruban." (`french-story-data.mjs:149`); "A picture. A question." (`travelers-archive-ui.mjs:30`); "There is room on a postcard for a small idea." (`paris-content.mjs:9`).

Historical accuracy: the peak date (January 28, 1910, at the Austerlitz scale), the February flood commission and the mid-March return of the Seine to its bed match the Archives de Paris chronology as summarized. Two lines need a fix or a check. Item 7 is reversed and must be fixed. In `content.mjs:36`, "with railway and metro services resuming" on March 15 may overclaim, because metro lines reopened gradually into spring. Check it against the PDF, or soften it to "and trains and the metro began running again, line by line."
