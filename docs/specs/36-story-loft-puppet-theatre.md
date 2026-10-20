> Extended by [spec 37](37-growing-stories-and-clear-turns.md): optional authored dialogue, one to twelve scenes, version-aware save adaptation and focused task pages. The original three-scene/no-text scope below records the first release.

# 36 · Story Loft: a little puppet theatre

Status: implemented; independent content/spec and implementation reviews cleared. First creative Story Loft increment; the six paired-perspective reading stories in spec 06 remain later scope.

## Purpose and loop

The storm scattered the library puppets. The loft now hosts little shows for the neighbors. A child chooses an invitation, composes three illustrated scenes, performs them at their own pace, considers an audience question and revises or starts another show. This supplies the atlas's Create → perform → reflect pattern, distinct from answer-checking, word building and reading errands.

First release: five invitations (welcome a neighbor, find a shelter, deliver a surprise, a wonderfully odd picnic, an open stage); five puppets (Pip, Dot, Rabbit, Kitten, Dragon); four settings (garden, café, footbridge, sheltered log); five actions (finds, carries, offers, plays with, wonders about); six props (letter, umbrella, basket, blanket, teacup, moon crunch). All combinations stay valid, including fantastical or unexpected choices. This is pretend theatre, not habitat/diet or physical-safety instruction. Each setting has an authored sentence lead and each prop an article-inclusive noun phrase so every generated caption is grammatical. No free text, recorded audio, external media or remote AI.

Each invitation has an original three-scene starter, explicitly labelled as a starter. Open stage uses three identical neutral scenes. A child can keep it, replace any scene fields, move a scene earlier/later, revisit any scene and perform before/without edits. Three acts supply a sequence, not an automated judgement about a 'proper' story. No compulsory conflict/resolution and no similarity/coherence/correctness score. Grown-ups can invite an oral retelling, drawing or writing off-screen; no completion/proficiency is inferred from choosing it.

## Interaction and visual design

The memorable element is a wooden puppet stage, not a quiz card. Reuse the established garden ink #183f39, leaf #397958, rain #abc4da, honey #e9b84a, and paper #fffef9, adding curtain plum #695477 and warm wood #c3a77b. Existing system body typography and a locally available Georgia stage heading avoid new font requests. A large stage sits above/beside three selectable illustrated scene tickets. Left-aligned editing controls are grouped by Who / Where / What happens / What to bring, with picture choices and short words; the current caption has optional local narration. The layout becomes one column on small screens. No stock dashboard counters or progress bars.

Tap or keyboard buttons do everything; no drag dependency. All actions ≥44px, pressed/current states have labels and outlines, and stage art has a full caption/text equivalent. Existing Pip/Dot SVG and original puppet/prop/backdrop art. A short CSS movement can illustrate an action once after an explicit scene step; reduced motion leaves a complete static scene. No autoplay, timing demands, looping animation or speech. 'Perform our show' opens act 1; Previous scene/Next scene are manual, and the final 'Meet our audience' saves the show and opens discussion. 'Back to making' returns to any editor scene without losing work. Scene ordering offers explicit earlier/later buttons.

Six rotating, freely selectable audience questions: identify a character/action; describe a setting clue; imagine before/after; try a puppet's spoken line; point out a surprise; consider a clarity revision. Each invites choosing ANY scene ticket, then talking/acting/drawing. Feedback describes the chosen scene and invites explanation, never marks an interpretation right/wrong. 'Change this scene' jumps to that exact editable frame. 'Another audience question' cycles; no discussion response/quality is assessed or recorded. Questions are shown as invitations, not fake AI feedback.

Connect from home and Explore. Invite Word Garden for an expressive word, Paris for another story, and the café for a post-show snack; no supply bonus, fact-exposure mutation or waiting-order reset. New shows can continue without a limit; the shelf keeps the latest 12 snapshots plus the working draft.

## State and evidence

An additive `loft` version 1 contains `nextId`, `draft` (null or show), and `shelf` (≤12 unique show snapshots). A show has numeric `id` < nextId; invitation ID; exactly three `{actor,place,action,prop}` frames (catalog IDs only); selected frame 0–2; mode edit/perform/audience; stage 0–2; question index 0–5; spotlight null/0–2; bounded nonnegative `changes`; Boolean `shared` and `heard`. Strict validation rejects other shapes/extra keys as unsupported, preserving any present-invalid/future extension verbatim and blocking its edits. Absent state stays absent until an action. Rendering/notes are pure. No per-frame correctness, mastery, reading mode, independence or default topic-observation records are created.

Any actual frame change/reordering increments changes and resets shared=false (the new arrangement has not yet been performed). Completing the third manually advanced scene sets shared=true and snapshots it. Starting a new show first snapshots the old draft even if unfinished. Reopening a shelf show restores its choices without replacing the shelf until it is saved again, and first snapshots a different current draft. The shelf is recent work, not exhaustive history; replacing its same-id snapshot is revision, not a second learner. Voice request is only heard=true, never proof of listening/reading. Discussion and off-screen creativity remain unobserved.

Use the existing explorer storage, save-off, full notes export/reset and local import. Add loft to the import preview and shared destination notes, exempting this preserve-invalid extension from the importer’s object-only module gate; unsupported state remains safe/exportable rather than being reset. Starting or revising a story never mutates another destination. Pending café, Paris, Bramble, Living Garden and Word Garden states remain unchanged.

## Pedagogy, upstream and limits

Refreshed Jane `LESSONS.md` at `0a2acf3efbf81f00027afd6bdd108c0f89f7c3cc`: short purposeful quest hooks, stepwise worked examples and the rule against one-right-answer creative prompts inform the starter and open discussion. Its creative grader, points, penalty/boss, identity and server storage do not fit this unscored construction toy. No new Jane code or prose is incorporated.

Refreshed Marble topics at `96a7933754af672e1bfdbf7ecb05c325860c6e0d`: Narrative Writing (`mt_vauULTecMH`) and Reviewing Own Writing (`mt_U_8iVFZuHH`) inform scoped authoring references only. The former describes developed narrative writing, which this finite picture/phrase builder does not demonstrate; the latter's evidence list is bibliographic, not an assessable child rubric. Map only arranging a setting/actor/action sequence and revisiting it for an audience. No independent composition, decoding, punctuation, spelling, character-development, retelling or full-topic coverage claim. Keep the runtime prerequisite graph unchanged.

IES [elementary writing guide](https://ies.ed.gov/ncee/wwc/PracticeGuide/17) supports teaching the writing process for different purposes; its handwriting/spelling/sentence fluency recommendation is beyond this increment. [Comprehension guide](https://ies.ed.gov/ncee/wwc/PracticeGuide/14) informs attention to structure and focused discussion, not an efficacy claim for this toy. Original content and art are reviewed; this is guided playful composition, not a validated literacy intervention.

## Verification and delivery

Independent spec/content review before build; independent implementation review after. Synthetic checks cover the full actor/action/prop/place caption domain, catalog references, starter coherence, all mode transitions, revisions after performing, reorder boundaries, repeated new/reopened shows and bounded shelf, no mutation of other games, pure rendering, invalid/future preservation, actual ExplorerStore round trips, save-off/reset/export/import and current-show recovery. No real learner data in tools, fixtures, repository or screenshots.

Browser QA: make an unexpected scene, reorder it, perform all three manually, choose a discussion scene, jump back to revise it, save/new/reopen/reload, keyboard focus, 768px and 390px layouts without horizontal overflow, speech optional, reduced-motion static alternative. Run existing suites and atlas checks once. Publish reviewed assets only to the current personal Cloudflare game, keep earlier sites intact and create a draft stacked PR. Merge remains separately gated by exact-head Claude clearance and authorization. Later Story Loft increments can add paired viewpoints, richer language, poetry or story packs while reusing this loop; they are not part of this release.

## Verification receipt

New checks pass across all 600 single-scene combinations; all 38 logic suites pass. Root browser QA covers an unexpected scene, ordering, all manual performance steps, scene-specific audience revision, new/shelf/reopen/reload, Enter/Tab editing, 768px/390px layouts with no horizontal overflow, and visible preview feedback. Sticky preview is disabled on very short viewports. Reduced-motion CSS retains a complete static picture and disables action motion; no physical iPad Safari or audio-device test is claimed. Existing state, local transfer and notes are exercised with synthetic fixtures only. The standalone storm intro and previous destinations are preserved.
