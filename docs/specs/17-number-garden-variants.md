# Number Garden question variants

Status: implemented; independent spec and implementation reviews cleared. Depends on [spec 15](15-number-garden-corrections.md). Multiplication facts are already covered by the [multiplication garden](07-cafe-expeditions-and-facts.md) and are out of scope.

## Problem

The seven Number Garden areas have 49 fixed items, and a trail revisit alternates between only two anchor questions per area (`beginTrail` picks `checkin[1]` or `checkin[2]`). Children who play often meet identical numbers, and the notes' advice to "try a fresh example on another day" has no fresh example to offer.

## Templates

An item may add `make(rng)` returning the fields that vary (`params`, `prompt`, `answer`, `model`, `solution`, and choices for choice items), plus an optional `constraints(params)` that rejects ambiguous draws such as a repeated digit in a place-value question. Unreturned fields (title, number-free hints, `talk`, `topicId`) come from the authored item. A small seeded generator in a new `random.mjs` supplies `int` and `pick`; after 50 rejected draws the item falls back to its authored numbers. Adventures vary the question only; Pip's example stays authored.

The first encounter with an item uses its authored numbers, so in-progress trails do not change. Later encounters seed from the explorer, item and encounter count, and drafts store `{variant:{seed,params}}` so a reload keeps the same numbers. Revisits stop alternating between two anchors: each starts from `checkin[1]` with new numbers and branches as today.

| Area | Variation |
| --- | --- |
| Number sense | 2- and 3-digit place value; adding tens with and without regrouping (`params.regroup`) |
| Operations | Sums and differences within 20 crossing ten; equal groups and sharing with factors 2 to 9; two-step totals under 100 |
| Fractions | Unit fractions (halves to fifths) of totals divisible by the denominator; non-unit fractions below one whole |
| Patterns | Start 0 to 12, step 2 to 9; nth term for n from 4 to 7 |
| Geometry | A fixed list of shapes for corners and sides; symmetry of square, non-square rectangle, equilateral triangle, regular hexagon; 1 to 3 quarter-turns either direction |
| Measurement | Ruler start 0 to 8, length 3 to 12, end at most 20; rectangle sides 2 to 9 for perimeter, area and a missing side |
| Reasoning | Missing addends within 20; three-event stories under 50 with no negative intermediate value |

Choice items generate their choices, place the correct one at a random index, and draw distractors from [spec 18](18-number-garden-help-and-feedback.md) where one applies.

## Evidence

Observations add `variant` (null for authored numbers); stored `prompt` and `answer` already show the exact question. `seenItems` continues to record template ids. Familiarity reports `familiar` only for the same template and seed, and a new `sameKind` for the same template with other numbers. `broadDescribe` reports that case as "Answered independently, a new example of a familiar kind of question," and `freshEvidence` stays false. Displayed multiplication pairs continue to feed the exact/commuted exposure store.

## Verification

For each template, 1,000 seeds: the answer is a non-negative integer or valid choice index, the solution contains it, every number is in range, and constraints hold. The same seed inputs reproduce identical output; the first encounter equals the authored item; a new seed of a seen template yields `sameKind` without fresh evidence. Existing branching and exposure checks pass with generated second questions.

## Build clarification

Generated fields include every operand-dependent field: fact(s), hint, talk, steps, misconception responses and speech overrides as well as prompt, answer, choices, solution and params. Persist a validated full question snapshot in the existing draft with variant metadata, not only a seed. Paused exposure and helper logic read that frozen question. Render/reload never increments an encounter; a newly opened draft reserves its encounter once and preserves it. Existing paused drafts without variants retain their authored question. A new variant of an already seen template is sameKind and never fresh evidence, even if its exact multiplication pair was unseen. Adventure examples stay separate authored examples, but their named shape/structure must remain compatible with the question. Numeric coincidence inside an instructional helper is permitted; helper prose must not solve the waiting question.

## Paused work after content updates

A frozen question that no longer matches the current authored/generated template stays closed in `broad.closedDrafts` with its exact original draft, including attempts, input and support. A dismissible notice links to Grown-up notes, which show that earlier work; the active explorer's normal download includes it. It is never scored against a replacement question or fed to suggestions. Strict question validation still applies to resumed work. Repeated normalization and reload do not duplicate the kept record.
