I couldn't write the plan file or call ExitPlanMode in this read-only, plan-mode session, so the review is below. I only used Read, Grep and Glob on the spec, the companion text, the prior review JSON, and `dist/{app.mjs,french-rooms-ui.mjs,play-media.mjs,index.html}`. I didn't run or check anything else, and I didn't read any other provider report.

# 382 · French Parcel Questions: recheck of candidate `0678634f`

## A. Language: **CLEAR**

**Remaining P1:** none.

**Remaining P2 (1), recommended but not blocking:**
- **L-P2-1 · The note's wording doesn't match the destination question.** The notes say **Apporte le colis pour le café / pour le jardin / pour la bibliothèque / pour l’atelier.** The teaching line says the note "names the parcel’s destination," and the destination reply says **Le colis va au café.**
  - "pour X" names who or what the parcel is for, not where it goes. A beginner has to work out that "pour le jardin" means the same as "va au jardin" before the destination reply clearly repeats the note.
  - "pour le café" can also be read as "for the coffee."
  - Nothing is ungrammatical, and the "Où va" change does fix the earlier problem of the garden as a recipient. Every line is now true.
  - **Smallest fix:** **Apporte le colis au café / au jardin / à la bibliothèque / à l’atelier.** / Bring the parcel to the café / garden / library / workshop. This makes the note and the destination reply say exactly the same thing and removes the coffee reading.

**P3 (rendering only):** use a non-breaking space (U+00A0 or U+202F) before "?" in all three questions so the "?" can't wrap onto its own line at 320px.

**Lines re-reviewed and correct:**
- **Questions and glosses:**
  - **De quelle couleur est le colis ?** / What colour is the parcel?
  - **Dans quelle pièce est le colis ?** / Which room is the parcel in?
  - **Où va le colis ?** / Where is the parcel going?
- **Destination replies:** *va au café / au jardin / à la bibliothèque / à l’atelier*. The contractions and elision are correct, and so is the gloss "is going to."
- **Colour and room replies:** *bleu/rouge* agree with *colis*; *dans la cuisine / dans le salon* are correct.
- **Example:** **Le colis est vert. Il est dans la chambre.**
- **Labels and case names:** bleu/rouge, la cuisine/le salon; Le café / Le jardin / La bibliothèque / L’atelier.
- **Supporting English:** the line explaining that the room and the destination are different facts (line 35) is accurate.
- **Optional spoken invitation:** it now reads "Try asking one of these questions aloud…", which deals with the earlier A3 note.
- **Targets match the replies in all four cases:** café blue/kitchen, jardin red/living room, bibliothèque blue/living room, atelier red/kitchen.

## B. Spec build-readiness: **READY, with one P2 to fix in the spec text**

**Remaining P1:** none.

**Remaining P2 (1):**
- **S-P2-1 · When the no-voice line appears isn't specified.** The spec says to "replace each unavailable child Hear control with the companion's no-voice line" but not when voice availability is decided.
  - `speechSynthesis.getVoices()` often returns `[]` until `voiceschanged` fires. The shared binder handles this by refreshing on that event (`dist/play-media.mjs:106-107`).
  - If the child checks voices once at render, it can replace every Hear control on a device that does have a French voice, and nothing brings the buttons back without a re-render.
  - If it checks only when Hear is clicked, a plain `data-speak` button falls through to the shared fallback message (`play-media.mjs:93`), which the spec says to avoid.
  - **Fix (one sentence):** choose either (a) check at render and re-check on `voiceschanged` through a child listener that the existing route cleanup removes, or (b) always render Hear and use a capture-phase check at click time that shows the companion line and stops the event before the shared handler, without incrementing `speechRequests`. Test both orders: voices arriving late, and voices genuinely missing.

**P3 (wording or implementation notes, not blocking):**
1. `bindFrenchRooms` stops at `if(!root)return` when there is no `[data-rooms-root]` (`dist/french-rooms-ui.mjs:17`). If the child's markup doesn't keep that attribute, the hand-off to the child has to happen before that line. If it does keep it, the parent's capture-phase speech listener (`:19`) would call `showFrenchRoomsHelp` with a missing audio code and block playback. Say which it is.
2. The spec says `selected` may be unexpected, but the companion only has copy for "no selection" and "match/differ." Name the read-only Compare line for a selection that doesn't resolve, or say it's treated as "different."
3. Direct lesson routes are unchanged, so the **Which parcel?** button presumably appears only on the base `#learn/french` route. Say so explicitly.

**Repairs checked against the code and confirmed:**
- **Notebook option:** the app passes `notebook:()=>state` (`dist/app.mjs:800`), but the binder's current argument list doesn't accept it (`french-rooms-ui.mjs:17`). The spec now explicitly says to add and forward it.
- **Save message:** the binder receives a plain `save` (`app.mjs:819`). The fixed message "Conversation kept. If saving is off, download Notes before leaving." doesn't claim the notebook was saved, so this is consistent.
- **Stylesheet:** `french-rooms.css` is already linked in the `index.html` head (line 95), and the new stylesheet follows the same pattern.
- **Ferry link:** `app.mjs:812` adds `frenchFerryEntry()` whenever there's no lesson in the route. The spec now says it stays, and the only app change is passing the explorer id.
- **Shared voice controls:** the shared toolbar's "Try this voice" French preview (`play-media.mjs:104`) is now explicitly host-owned and outside this language review.
- **Remaining items:** these are all written into the spec now, with nothing contradicting them:
  - The A–D orders are four fixed arrangements, and each case's target lands on A, B, C and D respectively.
  - Compare checks colour and room values rather than parcel ids.
  - English meanings appear only for replies that have been asked.
  - Read-only sheets play speech without changing anything.
  - Each case has a French `title` and an English `titleMeaning`.
  - There is an explicit Working drafts selector.

## Summary
- **Language:** CLEAR. No P1. One P2: changing "pour" to "au/à la/à l’" would make the destination contrast exact.
- **Spec:** build-ready apart from one P2, when voice availability is checked. No P1.
- **Still pending:** the third-provider panel. That's an approval and credits step outside the spec, not a gap in the design.
