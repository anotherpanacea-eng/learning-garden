# Panel review of 382 · Parcel questions, revision 1

**Reviewer:** Anthropic, Claude Opus 5.5 (`claude-opus-5-5`). I didn't read any other review, and I didn't run the launcher snippet at the end of the prompt. I only used read-only Read, Grep and Glob on the repository.

**Language verdict: NOT CLEAR.** One line needs a small repair; everything else is acceptable.

## A. Language findings

**Confidence:** high on grammar, spelling and glosses; moderate on the naturalness judgement in L1.

### Required repair

**L1 · The jardin case under "Pour qui est le colis ?"**
- Lines affected:
  - **Apporte le colis pour le jardin.** / Bring the parcel for the garden.
  - **Le colis est pour le jardin.** / The parcel is for the garden.
  - Case name **Le jardin** / The garden.
- **Problem:** "Pour qui" asks about a person. Café, bibliothèque and atelier work as stand-ins for the people who run them. A garden doesn't really, and the story is about "collecting supplies", so "pour le jardin" reads as a purpose ("for use in the garden") rather than a recipient. That works against the destination-based reading the panel note promises. The English gloss has the same problem ("Who is it for?" / "For the garden.").
- **Smallest repair:** replace the destination with a staffed place, for example **la boulangerie** / the bakery:
  - **Apporte le colis pour la boulangerie.** / Bring the parcel for the bakery.
  - **Le colis est pour la boulangerie.** / The parcel is for the bakery.
  - Case name **La boulangerie** / The bakery.
  - Colour, room and target stay the same (red, living room), so the four combinations are unaffected.
- **Precedent:** shipped content already uses "au jardin" for the place and "pour le club de lecture" for the people (`dist/french-story-data.mjs:49`).

### Acceptable lines, with notes on wording

- **A1 · café can mean coffee.** "Apporte le colis pour le café" could be read as "for the coffee" by beginners, who usually learn café as coffee first. The case name and the "Pour qui" framing make the meaning clear, so no change is needed.
- **A2 · The teaching line gives the answer away.** "A question about the recipient repeats something you already know" settles in advance which question is redundant, which weakens "learners decide what information to gather." It's defensible as explicit beginner teaching. If you want to keep the inquiry open, an optional softer line is: "Think about what the note already tells you."
- **A3 · "in your own words" asks too much.** "Try saying a question in your own words to someone with you" asks for free production with no support, and a child might do it in English. Optional repair: "Try asking one of these questions aloud to someone with you."
- **A4 · French spacing.** The space before "?" should be a non-breaking space (U+00A0 or U+202F) so the "?" can't wrap onto its own line at 320px. This is a rendering note, not a wording change.

### Lines checked and acceptable

- **Example:** "Le colis est vert. Il est dans la chambre." It is separate from every case, which is correct.
- **Notes:** Apporte… café / bibliothèque / l'atelier. The imperative "Apporte" is correctly spelled without -s, and the elision is correct.
- **Replies:** the colour, room and recipient replies all agree (*bleu/rouge* are masculine to match *colis*; *dans la cuisine*, *dans le salon*).
- **Questions:** "De quelle couleur est le colis ?", "Dans quelle pièce est le colis ?" and "Pour qui est le colis ?" are natural and correct. Their glosses are accurate.
- **Labels and case names:** bleu, rouge, la cuisine, le salon; Le café, La bibliothèque, L'atelier. The glosses (living room, workshop, library) are accurate.

### Pedagogy checks

- **Each question does what it should:**
  - The note gives only the recipient.
  - The parcel labels show only colour and room, so nothing gives the answer away.
  - Colour alone narrows four parcels to two; room alone also narrows to two; both together pick out one.
  - The recipient question truthfully repeats the note, which is a good contrast.
- **The four targets are distinct:** blue/kitchen, red/living room, blue/living room, red/kitchen.
- **Beginner load is low.** Every reply uses the same frame ("Le colis est …"), and the new vocabulary is small.
- **Compare can reveal the target.** Picking a parcel and opening Compare shows the answer. That's acceptable because it's explicit and recorded permanently as `compared:true`.

## B. Spec build-readiness findings

**Verdict:** not build-ready until S1–S4 are fixed in the spec text. All four are small.

- **S1 · The binder doesn't accept a `notebook` option yet.** The spec says "its notebook option already exists." The app does pass `notebook:()=>state` (`dist/app.mjs:800`), but `bindFrenchRooms` never reads it (`dist/french-rooms-ui.mjs:17` takes only save, render, focus, canExport, explorerId, isActive and entryLesson). **Fix:** say the binder must start accepting `notebook`. `bindEquality` → `bindInequality` already does this (`dist/equality-desk-ui.mjs:41`).
- **S2 · The binder can't tell when saving is off.** The French Rooms binder gets a plain `save` (`app.mjs:819`), so it can't choose between "Conversation kept" and "Saving is off." Equality gets `save:()=>{save();return {enabled:persist,ok:storageOK}}`, and inequality reads both values (`dist/inequality-ui.mjs:95`). **Fix:** add the `app.mjs` change to the Integration list. Also add English copy for the case where saving is on but the storage write fails; the companion has no line for it.
- **S3 · The stylesheet seam is wrong.** No UI module adds CSS to its rendered HTML. Every stylesheet is a global `<link>` in `dist/index.html` (lines 38, 82, 95). **Fix:** "Add `french-questions.css` to `dist/index.html`, following `french-rooms.css`."
- **S4 · The Ferry link would show inside child mode.** `app.mjs:812` adds `frenchFerryEntry()` whenever there's no lesson in the route. An early return inside `frenchRoomsPage` won't stop that, so the Ferry link would appear under the child. **Fix:** decide whether to hide it there; either way the change goes in `app.mjs`, which the spec doesn't list.
- **S5 · The parcel order for each case isn't written down.** "A, B, C and D each fit once" needs a fixed A–D order per case. Neither the spec nor the companion gives one, so reviewers can't check it and the "independently asserted" tests have nothing to assert against. **Fix:** add a 4×4 table.
- **S6 · The no-voice message would duplicate the existing one.** The shared `bindSpeech` already shows its own no-voice message (`dist/play-media.mjs:78`). It also has a "Try this voice" preview that speaks unreviewed French ("Bienvenue à Paris…", `:104`). **Fix:** state whether the companion's message replaces or adds to the shared one. Also exempt the existing shared voice controls from the "no further French" rule, or keep them out of the child.
- **S7 · Minor clarifications:**
  - The entry guard reuses `dirtyFields`. That set only holds fields whose write *failed*, because input is saved on every keystroke (`:25`). "Not committed" should be reworded to "a failed draft write."
  - Say whether Hear is available on read-only sheets, given that `speechRequests` must not be written there.
  - Say whether `source.title` is the French name or the English one.

**Spec claims that checked out:**
- `localVoices` and `chooseLocalVoice` have the strict `fr` filter (`dist/play-media.mjs:35-48`).
- `recoveryFitsProgressLimits` exists (`dist/progress-limits.mjs:13`), and `canExport` comes in via `priceOptions()`.
- The WeakMap keyed by notebook and owner is the same pattern as `dist/inequality-ui.mjs:5,32`.
- `progress-transfer.mjs:30` uses a label map (`inequalitySheets:"Which values fit sheets"`), so adding the destination label is enough.
- `test/french-rooms-browser.py` exists.
- The anchor link to spec 117 resolves (line 122).
