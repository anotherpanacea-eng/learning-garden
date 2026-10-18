# 02 — Willow Post Office

**Status: Planned; not implemented. Includes the Sky Post flying-courier direction; refresh and independently review the combined build spec before implementation.**

## Goal and play loop

Make instructions useful to a reader. The explorer becomes a courier for Willow Post Office, with an original flying-witch option and independent guide/avatar choices. Pip and Dot help at the sorting counter. The child reads or hears the request, predicts where a draft message will lead, builds instructions by tapping word chunks, runs one instruction at a time, observes the literal result, and revises. Prediction, discussion, and transfer are optional and unscored; every delivery can be left for later.

## One game, developed in stages

**Sky Post is the flying-delivery part of Willow Post Office, not a separate destination or game.** The first slice uses an illustrated courier flying between the same four landmarks, one instruction at a time. No flight physics or reflex controls are required. Reading the order, packing parcels, planning the route and revising instructions form one delivery loop; math can enter through how many parcels or supplies the recipient needs.

Later slices add the Learning Center, earned bonus play at its Play Center, and the rival witch's challenge route. A miss leads to short illustrated practice and a retry or another route, preserving the same parcel and earned credits. [Spec 25](25-sky-post.md) holds those later mechanics and unresolved decisions. Use the same delivery catalog, map and `postOffice` save extension; do not build a second courier engine, balance or parallel set of progress records. Keep math attempts and structured-composition observations distinct within that shared state.

## Content minimum and behavior

Provide six changing deliveries across four named, connected landmarks, with an explicit start, recipient, and destination. Use a finite, reviewed grammar: “Go to [place]”, “Then go to [place]”, “Go there”, and “Give the parcel to [character]”, up to six clauses. “There” refers to the most recent named place in an earlier clause of the same message; without one, execution asks which place before moving. It never borrows a referent from another delivery. A character follows the stated route, highlights the active words, and stops with a specific clarification request when a recipient is absent or “there” lacks a referent. It never guesses intent. Direct routes and routes through optional waypoints are equally valid when they meet the request. Tap-to-add, remove, and move-up/down controls replace dragging. Rerunning resets the character, not the draft. Each delivery supplies a shorter visual example and optional paper-message invitation. Parent reading or dictation is welcome; no microphone is required.

## State and evidence

Add a versioned `postOffice` extension containing delivery cursor, clause IDs, playback position, revision/check history, support flags, and separately reported reading mode. Keep the latest 24 delivery summaries. Preserve `number-garden-v1` and `number-garden-save`; pause/reload, saving-off, export, reset, and malformed-state recovery retain existing records. Executed instructions are structured-composition practice, not evidence of independent reading or free writing. Project acknowledgement establishes no off-screen completion.

## Accessibility, privacy, and non-goals

Untimed, parent-guided play; all guides equally capable and avatar choice independent. Label every touch/keyboard control; provide text route descriptions, visible focus, reduced motion, and manual stepping. No grades, locks, identity fields, shared learner data, uploads, analytics, server, AI parser, or new framework.

## Acceptance and dependencies

Test all six requests, multiple valid messages, literal misdelivery/clarification, revision, skip/resume, support retention, storage controls, and phone/tablet layouts. Refresh the [IES writing guide](https://ies.ed.gov/ncee/wwc/PracticeGuide/17) before authoring; its writing-process guidance informs purposeful audience and revision, not a claim that this builder measures writing proficiency. Refresh any [Marble topic/prerequisite mappings](https://github.com/withmarbleapp/os-taxonomy) before adding them; no age-based routing. Independently review spec, content, and implementation, keep the PR draft, publish through the existing Site after QA, and require exact-candidate Claude clearance before GitHub merge.
