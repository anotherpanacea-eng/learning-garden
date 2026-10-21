# Growing stories and clear turns

## Problem and intended behavior
Story Loft currently supplies every caption and fixes stories at three scenes. Let learners give puppets their own dialogue and extend a familiar show voluntarily. The Post Office currently stacks almost the entire delivery on one page; its step buttons only scroll. Replace that stack with actual task pages. Preserve work when navigating, pausing, reopening, exporting and importing.

## Story Loft
- Optional dialogue on each scene, up to 400 UTF-16 code units (the browser maxlength/count rule), including line breaks, spoken by that scene's selected puppet. Plain text only; keyboard input and device keyboard dictation work without app recording. Supplied picture captions remain available. No automatic grading, spelling correction, inferred independence or length requirement.
- Begin with the existing three scenes. Add a copied scene after the selected scene, up to 12; allow removing down to one scene, with an explicit remove confirmation. Moving scenes carries dialogue. All lengths are available immediately; optional prompts suggest an arrival, a complication, a response and an ending, without unlocking or automatic ability classification.
- Editor pages: Pictures, Puppet words, Story order. One pictured choice group at a time within Pictures. Compact scene selector and stage remain available, optional shelf/starters and onward invitations collapse while working. Performance shows one scene at a time with its caption and dialogue, then audience discussion. Instructions and next action name the current task.
- Introduce loft schema v2: scenes add `dialogue`; shows add editor page/choice index. Pure read adapter converts only strictly valid v1 notebooks, preserving every existing value and adding empty dialogue/default view fields. First successful edit persists the adapted version. Unsupported or malformed payloads remain untouched and exportable. Root explorer schema stays v1. Shelf remains 12 shows plus draft.
- Typing saves locally without rebuilding the input, dropping focus or moving the caret. Text is escaped in HTML, notes and speech attributes. Narration only on request. Exports may now include personal writing; explain that words stay on device with existing save controls and are included in downloads. No learner text in analytics, remote generation, repository or public fixtures.

## Post Office
- Pages: Pack, Plan, Fly, Bramble, Help. Order summary and parcel/location status remain visible. Courier choice stays on the sorting board and is collapsed during deliveries.
- Persist page per delivery, defaulting safely from saved work. Page changes never call start/restart, submit answers, change packing, clauses, route cursor, support flags or rival state. Resume/export/import preserve page and work. Existing unknown delivery fields remain tolerated by current validators.
- Each page shows its immediate instruction, main action and optional help. Plan keeps the editable instructions; Fly displays those instructions beside the map, and offers Change flight plan. Bramble stays separate from the flight, with Return to delivery always available. Help shows the separate example without replacing the real plan. Support only recorded when opened explicitly.
- Revisit any page at any time. No new access locks. Step actions focus a real heading on the newly rendered page; no hidden control receives focus. Keep feedback beside question/input, retain partially typed inputs.

## Living Garden and Café
- Living Garden adaptive visits show separate Notice, Compare clues, Read note, Pack pages. Notice shows one selectable habitat at a time; an always-available collected-clues disclosure keeps every inspected observation on Compare/Read/Pack. Reading retains its complete source note beside the question. Navigation itself neither inspects nor supports nor submits. Existing readiness requirements for opening the note/parcel remain; revisiting earlier pages remains possible. Preserve page and selected habitat in optional per-round presentation fields, tolerating old saves. No task regeneration or duplicate supplies on navigation.
- Café already has plate/count/stock phases. During count/stock, collapse the full cupboard and keep the order/recipe visible; put optional trip/settings tools after the active task. Preserve original stock snapshots and all plate-edit return paths.
- Paris and Water Lab already show individual saved questions/stages. Keep their source passages and materials together; avoid unrelated redesign. No universal workflow engine.

## References and limits
Refreshed Jane `LESSONS.md` at 0a2acf3efbf81f00027afd6bdd108c0f89f7c3cc and Marble topics at 96a7933754af672e1bfdbf7ecb05c325860c6e0d. Jane is a design reference for purposeful quests and small steps; no code or lesson prose incorporated. Marble Narrative Writing (mt_vauULTecMH) and Reviewing Own Writing (mt_U_8iVFZuHH) inform opportunities for dialogue, sequence and audience revision. No mastery score, minimum-word grading, rewards or access locks adopted. This is a supported composition opportunity, not a writing/reading assessment. Existing upstream attribution/licenses remain unchanged.

## Verification
Synthetic fixtures only: v1 lossless adaptation/pure reads, v2 strict validation and unsupported recovery, dialogue escaping/line breaks/limits, 1–12 scene navigation/reorder/remove confirmation, shelf/reload/import isolation. Post pages must preserve exact work except explicitly requested view state, including packing input, current route, pending Bramble question and helper. Browser check typing/caret, clear next/back, touch-sized controls, phone/tablet overflow and visible task context. Independent spec and implementation review; do not merge without the separate merge gate.

Independent spec review cleared this design before implementation. Review explicitly called for deletion index repair, pure legacy adaptation, navigation-only state changes and preserved source materials; these are covered in focused checks.

## Delivery verification
- Independent implementation review cleared Loft, Post Office, Living Garden and Café after fixes for readable textarea type and a visible per-plate recipe during multiplication.
- All 41 logic suites passed; story-pack and atlas checks passed; diff whitespace clean. Focused additions cover 88 growing-story, 157 Post Office pagination and 80 Garden/Café turn checks.
- Browser verification used synthetic local work: multiline text/caret, copied scene, saved reload/performance return, half-typed parcel and Bramble input across pages, collected clues staying open through comparison, source note, and parcel math input after revisiting reading. No browser console errors observed. Responsive checks at 768 and 390 pixels showed no horizontal overflow in sampled pages; physical iPad/Safari/audio-device behavior was not tested.
- Existing save controls and unsupported-format recovery remain in place. Learner writing stays local and in voluntary downloads; only fictional synthetic material was used for checks.
