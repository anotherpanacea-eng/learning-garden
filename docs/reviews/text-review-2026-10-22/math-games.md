# Text review: math games

Scope: `dist/broad-*.mjs` (Number Garden), `dist/facts-*.mjs` (multiplication garden), `dist/bramble-film.html`, `dist/equal-groups-*.mjs`, `dist/random.mjs`, `dist/forage-*.mjs`. This was a read-only review of strings a child or grown-up sees or hears. `random.mjs` has no user-facing text. Line numbers refer to the minified `dist/` files, so one "line" can hold a whole screen; the quoted text is the search key.

Audience rule applied: instruction text should be short, concrete and decodable. Descriptive text should be evocative.

---

## Top issues

1. **Assessment vocabulary on the child's practice screen (multiplication garden).** The play view reads like a research protocol: "This practice visit is a few observations, not a verdict about what you know." (`facts-ui.mjs:33`), "One observation kept" (33), "Keep this observation · method optional" (35), "Leave method unobserved" (28), "A correct number does not tell us which method you used." (28), "Opening this picture is recorded as support, even if you close it or count again." (25), "All activity here is practice, not fresh assessment evidence." (35), "This ordered fact has no earlier opening recorded in this garden." (35). A young reader can't decode this, and "recorded" lines make the child feel watched. Move all of it to Grown-up notes, and use child wording on the play screen:
   - "Keep this observation · method optional" -> "Save this one"
   - "Leave method unobserved" -> "Skip this"
   - "How did you find it? Optional." -> "How did you find it? (You can skip this.)"
   - Pause sheet heading -> "Nice place to rest." or simply "4 × 6 is done for now."

2. **The "Marble" and "level judgment" wording shows up on child pages.** `broad-core.mjs:195` "Marble connects {topic} as a foundation for {topic}. Try a smaller related idea together." and `:201` "it is a suggestion, not a level judgment." render as `.suggestion-reason` in the Adventures library and trail summary (`broad-ui.mjs:28,33`). A child will hear "Marble" as a new character. "Foundation", "level judgment" and the taxonomy topic names are adult planning words. Suggested child text: "Next, try a smaller idea with Pip." / "Ready for something new? Try this one." Keep the Marble explanation on the grown-up map page.

3. **"Fresh box:", "Fresh picnic:", "Fresh claim:" prefixes leak the spec term "fresh question."** This shows up in about 20 activity prompts in `broad-content.mjs` (50, 58, 66, 102, 110, 118, 154, 162, 170, 206, 214, 222, 258, 266, 311, 319, 327, 364, 372, 380), and it is read aloud. "Fresh label: in 583, what is the value of the digit 8?" is clumsy to hear. Drop the prefix, or use a story bridge: "Now it's your turn. In 583, what is the 8 worth?"

4. **"Ten bundles" is ambiguous math wording.** `broad-variants.mjs:100` "Pip added ten bundles, not loose seeds. How much does each bundle add?" is shown when Pip added, say, 3 bundles of ten. A child hears "ten bundles" and thinks the answer is 10 bundles. The same problem appears at `:113` "Add ten bundles; trade a full set of ten tens if needed." and `:113` "Think of a ten bundle for each digit on that shelf." Rewrite: "Pip added bundles of ten, not single seeds. How much does each bundle add?" and "Add the bundles of ten. If you have ten tens, trade them for a hundred."

5. **The generated shape questions have a grammar error and use technical names.** `broad-variants.mjs:82` builds "How many lines of symmetry does a ${shapeNames[...]} have?", which gives **"does a equilateral triangle have?"** and "How many corners does a equilateral triangle have?". The names themselves (`:16`, "equilateral triangle", "regular hexagon", "rectangle that is not a square") are too technical for ages 5 to 9. As answer choices (`:81`), "rectangle that is not a square" is odd and stands out. Use "triangle / square / long rectangle / hexagon" in prompts and choices, and keep "equal sides" in the hint. If a technical name stays, compute the article.

6. **In the claim questions, the correct choice is the longest and most specific.** `broad-variants.mjs:89`: "An extra dot in each row adds 3, making 15." vs "Only one dot is added, making 13." vs "Changing rows or columns never changes the total." `:90` and `broad-content.mjs:357, 384` show the same pattern ("Each original row has one matching extra row, adding the original total again" against "The dots grow bigger."). AGENTS.md asks that tone and length not give away the fitting choice. Make the distractors equally concrete, for example "Each column gets one more dot, making 16." or "The new column adds 4 dots, making 16."

7. **The same activity has a different name on almost every screen.** The two-question sample is a "check-in" (`broad-core.mjs:188`, `broad-ui.mjs:44,47`), a "garden walk" (`broad-ui.mjs:28,33`, which uses `replaceAll('check-in','garden walk')`), a "math walk" ("Choose a math walk", `:22`), "A little look around." (`:25`), a "trail" ("Continue this trail"), and "Explore this area" or "Two little questions". The places are also called "area", "garden" and "patch" ("Pick a patch of possibility", "You visited this garden", "7 areas visited"). Pick one child word for the activity (for example **garden walk**) and one for the place (for example **garden**). Use "check-in" only in grown-up notes. Other inconsistent pairs:
   - Answer buttons: "Try my number" (facts), "Try my answer" (equal groups), "Check our harvest" (forage).
   - Error text: "Enter a whole number from 0 to 144." (`equal-groups-core.mjs:53`), "Use a whole number from 0 to 999, or leave this fact for now." (`facts-ui.mjs:56`), "Use a whole number, or pack with help." (`forage-ui.mjs:58`).
   - Forage storage: "jar" and "cupboard" are used for the same store ("12 in the jar" vs "12 bites in the cupboard", `forage-ui.mjs:12,34`).

8. **Equal-groups feedback says "objects" and puts ribbons "on" bundles.** `equal-groups-core.mjs:51`: "The arrangement fits: all the objects are in equal groups." / "Use all 12 objects. Make groups of 4; every group needs that same amount." The rest of the screen says bites or ribbons, and plates or bundles. `equal-groups-content.mjs:16` also gives "There are 3 bundles, with 4 ribbons **on** each bundle" and "Put 12 bites into plates of 4. How many plates can you make?" Pass the unit words into the feedback ("Use all 12 ribbons. Make bundles of 4."), use "in each bundle", and write "Put 4 bites on each plate. How many plates can you fill?"

---

## Instruction clarity

9. `facts-ui.mjs:16` "Each row tells how many groups. Each column tells how many in a group. A reversed fact has its own place; answering one does not fill in the other." The third sentence is a design rule written for adults, and the hear-button narration repeats the first two out of context. Suggest: "Pick any square to try a fact." The row and column meaning can go in the table caption.

10. `facts-ui.mjs:16` caption "Rows: groups. Columns: number in each group. Cells show questions, not answer keys." and help "Keyboard: focus a fact, then use arrow keys to move between facts. Every cell is a button." Too much reading for a child-facing map. Suggest: "Use the arrow keys to move around the table." Put the caption detail in Grown-up notes.

11. `facts-ui.mjs:35` "All multiplication facts · this draft keeps its place". "Draft" is app jargon. Suggest: "Back to all facts (this one will wait)".

12. `equal-groups-ui.mjs:15` "Choose some supplies. Small and big ideas are all open." and "These are pretend practice supplies. They use no cupboard stock and don’t finish an order or open Bramble’s gate." The first is vague and the second is a grown-up rule. Suggest: "Pick a table to set." The rule can move to notes or be cut.

13. `equal-groups-ui.mjs:14` "Your guest and plate will wait." / "Your delivery and other challenges will wait." "Other challenges" is vague. Suggest: "Your delivery will wait for you."

14. `equal-groups-ui.mjs:22` example step 3: "2 groups × 3 in each = 6. Share 6 between 2 groups: 3 in each. Make groups of 3 from 6: 2 groups." This is three facts in one status line with colons. Split it across the steps, or show three short lines:
    - "2 groups of 3 make 6."
    - "6 shared into 2 groups is 3 in each."
    - "6 in groups of 3 makes 2 groups."

15. `equal-groups-ui.mjs:22` heading "One arrangement, related questions" and button "Show what these numbers mean". The heading is abstract. Suggest heading "Same groups, three questions".

16. `equal-groups-ui.mjs:18` "Share one to every plate" (button). Suggest: "Give one to each plate". "Put one ribbon on bundle 1" (aria) should be "in bundle 1".

17. `forage-ui.mjs:24` spoken clue: "...Work out both clues, then inspect that plot. You can ask to walk the clues together." That is six sentences of narration, with "inspect" and "plot". Suggest: "Find the apples. Row: 2 plus 1. Column: 4 minus 1. Rows count up from the bottom. Columns count across from the left. Then lift the leaves at that spot."

18. `forage-ui.mjs:12` "A new trip starts only while a jar has 144 or fewer; a full jar never needs gathering." and "Each trip fills one jar." These contradict the "Harvest packed" screen ("This trip cannot fill it again.", `:35`), because a trip adds to a jar and doesn't fill it. Suggest: "Each trip adds food to one jar. A jar holds up to 180 bites." and "This trip is done. Start a new trip to gather more."

19. `forage-ui.mjs:26` "Find this food using the field notes." Nothing else on screen is called "field notes", so a child won't know what to look at. Suggest: "Use the two clues to find this food."

20. `broad-content.mjs:196` and `broad-variants.mjs:80` "Start at 3 and add 5 each time: 3, 8, 13, … . Counting 3 as the first term, what is the fifth term?" (generated form: "what is term 5?"). "Term" and the "… ." punctuation are heavy going. Suggest: "Start at 3 and add 5 each time: 3, 8, 13. Stone 1 says 3. What number is on stone 5?" This matches the stepping-stone story.

21. `broad-variants.mjs:105` / `:113` "How many jumps reach the requested term?" and "Count one fewer jump than the requested term number." These are adult wording. Suggest: "To get to stone 5, how many jumps do you make?"

22. `broad-content.mjs:369` "spoken explanations are for you to discuss together." and `:377` "Choose the explanation that actually accounts for every group; discuss your own explanation afterwards." Both sound like grown-up guidance placed inside the child's lesson. Suggest cutting the clause, or "Then tell someone why."

23. `broad-ui.mjs:25` "The second question responds to the first." and the card status "1 of 2 recorded"; `:33` "New numbers, a different representation, and another day can tell us more." These are adult framing on child pages. Suggest "1 of 2 done", and move the rest to notes.

24. `broad-help.mjs:16` "Which description matches this chosen share?" with choice "The entire whole". This is abstract. Suggest: "How much is colored in?" with choices "One of 3 equal parts" / "All of it".

---

## Descriptive voice

25. `equal-groups-content.mjs:4,8` case names "Another way to share" and "Festival preparation" are flat next to "Welcome-back supper". Suggest "Four little tables" and "The great festival spread". Also `equal-groups-ui.mjs:14` "Bramble needs equal ribbon bundles to mend the garden’s decorations." could be "The storm knotted every ribbon on the gate. Bramble needs them bundled, the same in each, before they can fly again."

26. `forage-ui.mjs:12` shelf intro "Read two number clues, search a covered orchard map, and count the harvest you find. Each trip fills one jar." This is a feature list. The page header already has the better voice ("Read a map. Find a patch. Count a harvest. Bring it home."). Reuse that, and add one sensory line, for example "The orchard keeps its fruit under leaves until you ask the right way."

27. `facts-ui.mjs:16` "A whole garden of equal groups" is a lovely heading, but the body under it is rules only. Add one image line before the rules, for example "Every square is a little bed. Some hold one row; some hold twelve."

28. `bramble-film.html:409` end card "Through the Ribbon Gate" / "BRAMBLE'S CHALLENGE". "Challenge" is generic and nothing in the film is framed as one. Suggest a subtitle in the film's own image: "Every ribbon finds its arc." (The code comment at `:329`, "every ribbon finds its own clean arc", is better than any visible text.)

29. `broad-ui.mjs:22` "Meet a snail, woodlouse or adult butterfly. Compare changing picture clues and find café parcels." The second sentence is a feature list. Suggest: "A snail, a pill bug and a butterfly are looking for homes. Can you spot what changed?"

---

## Accessibility

30. `facts-ui.mjs:11` every one of the 144 cells has the aria-label "3 times 4. No retained answer observation. 0 distinct observation days retained." A screen-reader child hears this jargon on every arrow key press. Suggest "3 times 4, not tried yet" / "3 times 4, tried with help". Keep day counts in notes.

31. `facts-ui.mjs:16` table header "Groups ↓<br>In each →" and the legend symbols "R", "＋" (fullwidth plus), "↩", "○". Arrows and symbols read badly aloud ("down arrow"), and "R" is meaningless to a non-reader. Give the corner cell an aria-label ("Groups down, number in each across"). Replace "R" with a picture-plus-word mark.

32. `facts-ui.mjs:25` `.facts-picture` has an `aria-label` but no role, so most screen readers ignore it. Add `role="img"`, as the other models do.

33. Blanks and fractions written as symbols: "6 + __ = 10" (`broad-content.mjs:338`, `broad-variants.mjs:87`, `broad-help.mjs:18,24`) is read as "underscore underscore". "Find 2/3 of the collection" (`broad-variants.mjs:79`) is read as "2 slash 3". The authored item uses words ("two thirds"). Give hear-buttons a spoken form ("6 plus what makes 10?", "two thirds") or wrap the blank in a span with `aria-label="blank"`.

34. Picture-dependent prompts: "Which name matches this flat shape?" (`broad-variants.mjs:81`, `broad-content.mjs:233`). When narrated, the child has no shape to work from unless the model's label is read. Add a spoken clue that keeps the question open, for example "It has 3 straight sides. Which name matches?"

35. Color-only cues: the hero garden's "Show colors" button (`broad-art.mjs:41`) groups flowers by color, but each flower's aria-label is only "Flower in row 1, column 2". Add the color ("yellow flower, row 1, column 2"). The fold readout "Pink shows any part that misses." (`broad-ui.mjs:116`) needs a text result too ("This fold does not match").

36. Visible text and accessible name don't match (WCAG 2.5.3): equal-groups buttons show "−1" and "+1" but are named "Take one bite from plate 1" (`equal-groups-ui.mjs:18`). Forage plot buttons show "Look" but are named "Row 2, column 3: covered plot" (`forage-ui.mjs:26`). Start the names with the visible word: "Look: row 2, column 3", "minus 1: take one bite from plate 1".

37. `bramble-film.html:54` the canvas has an aria-label but no `role="img"`. The counting beat (the numbers 4, 8, 12 drawn at `:348`) is visual only, and the film has no words or captions. Add `role="img"`, and either a short text caption track under the film ("4, 8, 12 ribbons: three bundles of four") or a "What happens" details block. The end card "BRAMBLE'S CHALLENGE" is ALL CAPS in canvas text, so some readers will see it as shouting. Use title case.

38. `forage-ui.mjs:26` "Rows go **up ↑** from 1. Columns go **right →** from 1." Arrows are read aloud. Mark them `aria-hidden`. Also `broad-ui.mjs:95` uses `<em>—</em>` as an empty-place placeholder, which screen readers announce as "em dash". Use "none" or "0" with `aria-label`.

---

## Typos, spelling and style

39. `broad-content.mjs:300` "Fence all the way **round**" is British usage; write "all the way around". `broad-ui.mjs:22` "woodlouse" is mostly British; write "pill bug" (or "roly-poly").

40. Grammar slips in prompts:
    - `broad-content.mjs:206` "add 2 each time, starting 10, 12, 14, __." should be "starting at 10: 10, 12, 14."
    - `:214` "use add 4 each time" should be "add 4 each time".
    - `broad-help.mjs:18` "Start ${start} and add 2" should be "Start at 1 and add 2".
    - `broad-variants.mjs:101` "Does adding the row counts count every thing inside?" should be "Does adding those two numbers count every cup?"
    - `broad-ui.mjs:97` button "Add a one" should be "Add one".

41. "Not X, but Y" style contrasts in child text (the owner dislikes these): "Its name depends on its properties, not which way it points." (`broad-content.mjs:255`, which could be "Turning a shape never changes its name."), "The fraction strip shows the chosen share of a whole, not a count of individual seeds." (`:159`), "Cells show questions, not answer keys." (`facts-ui.mjs:16`), "not a verdict about what you know" (`:33`), "not a grade-level test" (`broad-ui.mjs:25`), "not the end label alone" (`broad-variants.mjs:84`). Rephrase each as a single positive statement.

42. Semicolons in child-facing feedback slow decoding: "Keep exploring; your arrangement stays as you made it." (`equal-groups-core.mjs:51`), "A check gives help; it never moves your supplies." (`equal-groups-ui.mjs:18`), "The picture still has a different arrangement; you can change it without losing that answer." (`equal-groups-ui.mjs:28`). Split each into two short sentences.

No em-dashes were found in child-facing strings in these files. The only one is the `<em>—</em>` placeholder covered in item 38.

---

## Lines worth keeping (voice reference)

- "A tiny beetle can manage a very large warehouse." (`broad-content.mjs:55`)
- "Pip makes equal rows so nobody gets a mysterious extra cracker." (`broad-content.mjs:107`)
- "A two-step story deserves two steps, even if Pip wants lunch immediately." (`broad-content.mjs:115`)
- "No shape gets dizzy here." (`broad-content.mjs:255`)
- "Read a map. Find a patch. Count a harvest. Bring it home." (`forage-ui.mjs:31`)

Close runners-up: "Pip calls this “sharing with a second helping.”" (`broad-content.mjs:167`), "Beetles can enjoy either walk." (`:324`), "Count what we have. Plan what can grow." (`broad-ui.mjs:22`), and "Their crossing fits both clues. Tap it to look under the leaves." (`forage-ui.mjs:26`). These pair a small creature-scale joke with a concrete math idea, which is the voice to spread into the equal-groups and multiplication-garden screens. Those screens currently have almost none of it.
