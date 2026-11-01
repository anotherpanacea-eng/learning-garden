# Spelling for a reader

Status: **draft for independent specification review, 2026-11-01**. Next productive-writing slice of [the literacy plan](../literacy-next-steps.md), serving admitted LG-10 / LG-G1. [Finite copy](../content/345-spelling-for-a-reader-text.md); [source study and prerequisite crosswalk](../source-audits/345-spelling-for-a-reader.md). No runtime or coverage is cleared by this draft.

## The learning action

Use a spelling clue while writing something a reader needs, rather than choosing another printed answer. A child chooses a purpose, tells or writes a message, consults a clue or dictionary if useful, hears a reader question, and revises. Unexpected wording is something to discuss. No automatic spelling, meaning, reading-level or authorship judgment.

This extends the existing Post Office letter-mending desk at `#post/messages`, not a new destination or editor. The first slice uses only its three existing cases: basket / Rabbit, seed-packet / Pip, flags / Dot. Their requests supply the purpose; the child chooses which reader to help. Every case remains open. Reuse its puppets, scene parts, `original` textarea, human-reader page, navigation and optional read-aloud. The supplied-card simulation remains separate and never acts out this original prose.

## Encounter and small-screen flow

The existing desk gains **My own message** alongside the supplied-card rehearsal. Four manual turns, with a persistent reader/purpose card and an optional reference tucked beside it:

1. **Plan.** Choose one of the three purposes. Say the message or use paper by default. **Write on this device** deliberately opens the existing optional composer; it explains local saving and download inclusion first. Do not create a new text field or record an oral/paper response, completion or correctness.
2. **Write.** The composer remains the existing `work.original`, at its existing 600 UTF-16-code-unit bound. Preserve any earlier text exactly; never prefill, replace or clear it on entering this mode. For typed work, **Keep this version** elects a first/latest snapshot. A blank string is allowed as meaningful unfinished work; no minimum words or required target spelling.
3. **Read together.** Show the child's exact words, or the oral/paper invitation. The authored question comes from the selected frozen purpose, not analysis of the child's text. A real person asks what they would do, then asks whether a spelling needs checking. Opening a question does not claim a person actually read or answered. No automated reply, simulated delivery success or typed reader assessment.
4. **Revise.** Return to the same composer and selected reader, with the question and optional reference visible. Keep an elected revision or leave it unfinished. First stays fixed; latest changes only on an explicit Keep. Return later to another purpose; do not generate difficulty or promote a level from the writing.

Use the existing message workspace, with one clear primary action per turn and Back/Next available without a check or score. Browser-local turn state may reset to Plan on reload; saved text/reference/versions must not. At 820×1180 and 1024×768 show the current instruction, reader, primary action and active writing area without a long introductory scroll; at 320×800 allow vertical scrolling and no horizontal overflow. Keep reference/question access during revision, native controls, 44px targets, keyboard focus and reduced-motion support. Touch is sufficient; no dragging, hover task or timed typing.

## Optional word-study bridge

The Word List Shelf336 and Pip's Copy335 gain **Use this clue in a message**, only for a currently readable word/slot and displayed authored clue. This is an explicit source-copy invitation, never an outcome transfer. Carry exactly one reference: `{origin:'word-list-shelf'|'pips-copy', itemId, label, word, clue}`. Bound each text string at 4000 code points and itemId by the source's existing safe-id rule. Copy the actual displayed frozen source strings, not today's catalogue substitutions, chosen-result feedback, a check, a score, placements, personal prose or an entire owner. Require no completed check.

For336, the learner explicitly chooses one of that word's readable authored clues before carrying it; do not infer the best clue from its placement. For335, carry the selected readable slot's authored `clue` and explicitly chosen readable spelling from its choices, with no claim it is correct; retain the source's word/meaning context in `label` so a context-sensitive spelling is not presented as a universal rule. Show the full reference for confirmation before choosing the destination purpose. Skip opaque or duplicate-addressed source items; leave their raw records untouched.

The pending reference lives only in browser-local memory keyed to the current explorer and notebook object; clear it on owner switch, import, reset or reload. The chooser states that closing/reloading discards this pending carry, while the original study work stays. Only choosing a destination commits it. Navigate back to the known origin on Cancel. No URL carries prose or clue text.

If that purpose already has a bridge record/reference, offer **Open my waiting message** or **Cancel**; opening it does not replace its source/reference/text. Trying a different reference on that same purpose is deferred. The three separate purposes permit three bounded messages without introducing an unbounded notebook. Entering the desk directly needs no reference. No write is made to335/336 and no carrier change automatically overwrites an ordinary message, Story Loft draft or other explorer.

The reference is optional help, never a required word list or proof of memory spelling. A physical dictionary and adult can supply an unrecorded checking plan (263 E6). The built five-page stall dictionary need not contain this word; don't promise that it does. No new dictionary API, external model, recording, speech recognition or phonics voice is commissioned.

## Saved contract: additive to the existing message work

Add optional `spelling` to a Post Office case work object in `state.messages.cases[caseId].post`. Do not change version1 or migrate/rewrite old records. `work.original` remains the sole editable text; `reason`/`reply`, supplied-card attempts, feedback and all Loft work stay untouched. The three admitted case IDs are those above, not the whole changing-letter catalogue.

```
spelling: {
  format: 1,
  source: {caseId, reader, purpose, question, checkQuestion, teaching, contrast},
  reference: null | {origin, itemId, label, word, clue},
  help: {teaching: boolean, reference: boolean, audio: boolean},
  first: null | snapshot,
  latest: null | snapshot
}
snapshot: {text, helpBefore: {teaching, reference, audio}}
```

Freeze literal source strings from the finite companion/current selected base case at record creation, never resolve old wording through current copy. Every source string ≤4000 code points; `text` has the composer's existing 600-code-unit bound. Reference visibility is supplied help: when a reference is displayed, set reference true; teaching/example and read-aloud flags mean opened, not understood. The reader question is always supplied and described as such in Notes. Human talk, paper use, dictionary use and browser/OS spelling suggestions are unrecorded; false flags do not establish independence. Do not disable OS spelling assistance or characterize it as cheating.

Create the optional record only on explicit **Write on this device** or committed carry, preserving earlier `original`. Oral/paper mode is ephemeral and introduces no saved bridge root. Existing save-off/explorer settings still govern persistence. For each typed edit, preflight the complete proposed notebook through `prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok` and existing recovery limits before atomically installing it. Reuse the established save-conflict controls; never let a new handler bypass the two-tab write protection. Failed preflight keeps prior text/source/snapshots unchanged and offers Notes.

First Keep sets both first and latest to separate copies of `{text,helpBefore}`; future Keeps replace only latest when that exact tuple differs. No timestamp, count, middle-version array or score. Editing never updates a snapshot. Reopening a kept version is a separate explicit **Use this version** action which changes only `work.original` after preflight, not history/help/source. Preserve whitespace exactly. No-op Keep is harmless. Both versions render as escaped text, never HTML, and download/import round-trip literally.

An unreadable optional `spelling` stays raw/exportable and disables just these new version/reference controls for that case. Its presence must not make `messageState` reject the existing work or erase other messages; accept the optional field opaquely there, then read it locally. Independently readable source/reference/first/latest should remain displayable even when a sibling field is unreadable; no mutation of an unreadable bridge. No recovery/reset button silently drops it. Existing opaque message roots retain their present recovery path; this slice does not rewrite that owner.

Notes describe exact original prose, first/latest, supplied reader question, selected reference and recorded opened help; say intermediate drafts and oral/paper/dictionary use are not recorded. Existing whole-notebook export/import carries the optional field inside `messages`; no new transfer destination or root. Scoped message reset removes it under the existing explicit reset action, not on navigation.

## Teaching, contrasts, story and return

Spec49 §5: teach purpose/reader plus one checking strategy; contrast a useful detail with spelling alone (a perfectly spelled vague note still leaves a reader guessing); supported practice consults the optional clue; new use is the child's own message; return chooses a different one of the three purposes and compares versions with an adult. Do not claim extended writing, complete spelling rules or general dictionary proficiency.

E1-III/IV checking and E2/E4 purpose/revision supply narrow revisits, usable at different starting ages without locks. Spec120's early welcome-back errands provide existing story purpose; later acts can revisit useful messages without pretending these three errands are chapter completion. No canonical Keeper's Page, ending film, atlas declaration or coverage CSV change. A quiet kept-version acknowledgment suffices.

## Proportionate verification and delivery

Independent Claude spec/content/integration review before runtime. Codex-built code receives independent Claude clearance on the exact final head before merge/deploy.

Focused model checks: old message states remain accepted, optional opaque sibling isolation, no-op/first/latest/restoration, blank/Unicode/600-unit boundaries, original text unchanged by mode/carry, references from actual frozen source only, duplicate/unreadable items unavailable, failed whole-notebook gate atomicity. Verify an old bridge after current teaching/reference copy changes without regrading/rewording it. Reuse the existing message checks rather than copying their entire catalogue.

One native browser journey covers tell/paper mode's absence of a new record, explicit typing, carry confirmation/cancel/reopen, reader question/revision and two versions, source owner unchanged, export/import/reload, two explorers, save-off, pending-reference clearing, conflict protection and escaped markup. Reuse established lifecycle tests where they genuinely exercise these handlers. Add short narrow/tablet layout samples, not the entire journey at each width. Run affected suites while editing, one full source run on the integrated runtime candidate, and the touched browser suite under AGENTS.md. Docs-only review needs relevant links/content and diff checks. No physical iPad, audible voice or learning-outcome claim follows from Chromium.

Uncommissioned: arbitrary readers, unbounded messages, automatic adaptation, subject-specific writing packs, dictionary search, new animation/audio, original-prose grading, and automatic carries into the Loft.
