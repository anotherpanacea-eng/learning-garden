I can't run your Python launcher in plan mode, so I did the recheck myself instead. I only read the spec, the revision 4 companion and my earlier review `/private/tmp/lg382-claude-recheck.json`. I didn't read any other provider's report or re-read code in `dist/`. Where a point depends on code (for example `french-rooms-ui.mjs:17/19`), I'm relying on the line references in my earlier review.

# 382 final recheck (revision 4)

## Language: CLEAR, no P1 or P2 left

- **The note wording (my earlier language P2) is fixed.** Companion lines 22–25 now read **Apporte le colis au café / au jardin / à la bibliothèque / à l’atelier.**, glossed "Bring the parcel to the café / garden / library / workshop."
  - The articles, contractions and elision are correct.
  - Each note now matches its **Le colis va au … / à la … / à l’…** reply, so the "for the coffee" reading is gone.
  - The teaching line "names the parcel’s destination" (line 10) and the line saying room and destination are different facts (line 35) are still true.
- I rechecked the questions, the colour and room replies, the example, the labels, the case names, the no-voice line and the Compare lines. They're unchanged and still correct.
- **P3, still open (rendering only):** use a non-breaking space before "?" in the three questions.

## Spec: CLEARED, no P1 or P2 left

- **The voice-timing gap (my earlier spec P2) is fixed** (spec line 17):
  - Hear controls are always rendered.
  - On every click, a capture-phase listener checks the current strict local French voice and the user's preference before the shared handler runs.
  - If no voice is usable, it stops propagation, prevents the default action, shows the companion's no-voice line and doesn't increment `speechRequests`. If a voice is usable, it records the request and then hands off.
  - Both late-arriving and genuinely missing voices are covered and named as tests. No persistent `voiceschanged` listener is needed.
- **All three earlier P3s are fixed** (spec line 33):
  1. `bindFrenchRooms` delegates to the child before the parent's early return. The child markup doesn't carry `data-rooms-root`, so the parent's speech capture can't fire inside the child.
  2. A selected id that doesn't resolve makes the item unreadable instead of producing made-up feedback.
  3. The **Which parcel?** button appears only on the base route, behind the existing dirtyFields guard.

**One new P3 wording note, not blocking:** spec line 25 still says "selected may be null or unexpected." With the new unreadability rule, "unexpected" should mean a parcel id that resolves within its own source but isn't the target. Adding "(resolving within own source)" would stop anyone reading "unexpected" as "nonresolving" and contradicting line 33.

## Status

Language CLEAR and spec cleared. The only gate left is the external three-provider language panel, which is an approval and credits step, not a design gap.
