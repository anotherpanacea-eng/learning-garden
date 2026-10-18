# 05 — Ecosystem Expeditions

**Status: Planned; not implemented.**

## Goal and play loop

Offer three parent-guided missions around Marble’s existing [Ecosystem Simulator](https://withmarble.com/ecosystem-simulator/). Our page supplies original prompts, optional unscored predictions, a small observation notebook, and a return path. The child opens the external model deliberately, pauses to inspect, changes one thing, observes, repeats, and discusses a limited conclusion. No mission requires surviving the external game’s timer or completing its challenge.

## Content minimum and external boundary

1. **One extra rabbit.** Pause/reset, inspect relationships, and compare a baseline with one added rabbit.
2. **One fewer fox.** Repeat with removal of one fox as the sole intervention.
3. **A sea-sized question.** Inspect krill relationships; compare baseline with one added krill.

Leave every other setting unchanged in each comparison.

Before implementation, verify those exact controls and relationships on the live page; revise missions if they differ. Offer two locally recorded runs per mission, with displayed day and up to three species counts. Use the same observation-day target; an overshoot must retain its actual day rather than manufacture matched evidence. Reset settings may not reproduce an identical random run: repeats are comparisons, not proof of causation. State “in these model runs,” distinguishing simulation rules from real ecological findings.

Link out without embedding, scraping, source copying, or assuming the simulator shares the taxonomy’s licence. Send no learner data or query parameters. Clearly label the external service boundary; unavailable controls/page yield a return/skip option, not a substitute invented result.

## State and evidence

A versioned `expeditions` extension stores mission, prediction choice, self-reported run/day/counts, support, and separate reading mode. Mark external observations self-reported; never claim automatic verification or independent ecology competence. Optional food-web drawing is an invitation only. Preserve legacy storage keys/records, pause/reload, saving-off, export/reset, and malformed-state recovery.

## Accessibility, privacy, and non-goals

Untimed local guidance uses touch/keyboard controls, text relationship descriptions, manual reveal, equal guides, and independent avatars. Parent operation is available for external accessibility limits. No grades, locks, identities, uploads, shared learner records, analytics, new server/AI backend, simulator fork, or broad ecology curriculum.

## Acceptance and dependencies

Refresh the external page, accessibility/privacy boundary, and [Marble taxonomy mappings/licences](https://github.com/withmarbleapp/os-taxonomy) before building. Test three missions, single interventions, actual-day labels, repeat limitations, link failure, return/resume, and storage controls. Independently review spec/content/implementation and root QA; deploy our reviewed local pages to the existing Site through a draft PR, with exact-candidate Claude clearance before merge.
