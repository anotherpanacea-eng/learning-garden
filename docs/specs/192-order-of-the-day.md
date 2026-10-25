# 192. The Order of the Day: number sentences, brackets and the agreed order

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a math check.** Part of the [math build-out](https://github.com/anotherpanacea-eng/learning-garden/pull/154). Every child-facing line is in [the companion text](../content/192-order-of-the-day-text.md); sources and open checks are in the [source audit](../source-audits/192-order-of-the-day.md).

**Commissioning boundary:** a proposal only. Select a bounded first slice after independent content, model and save review; the five benches do not commission each other. All Act and chapter links are future adapters to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (draft PR #127). Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter. **Fact-check status:** both history anchors checked against search excerpts on 2026-10-25 (fetches blocked); no `[check]` item is in child text. The arithmetic is checked by script; the teaching still needs the math check.

## Purpose

Learning Garden already has equal groups (spec 38), whole batches and multi-step multiply-and-add (spec 50), parcels and remainders (spec 51), a balance with one mystery parcel (spec 64) and a written strategy for what remains (spec 110). Nobody yet teaches how to **write** a calculation down so that someone else reads it the same way: what a number sentence says, what brackets do, why there is an agreed order, how to undo a calculation to check it, and how to put a box or a letter where the unknown goes. This pack takes seven untouched topics there.

A child comes to understand that a number sentence is a story told in numbers and signs, and can be read without being worked out; that the same numbers in a different order can give a different answer; that brackets say "do this part first", innermost first; that the order of operations (brackets, then × and ÷ left to right, then + and − left to right) is an **agreement** so writers and readers get one answer, and that a mnemonic's letter order is not a queue; that a multi-step problem is a chain where each answer feeds the next and the final answer should make sense; that addition and subtraction, multiplication and division undo each other, and a multi-step calculation is undone last step first; and that a box or a letter can stand for an unknown **number**, found by undoing and checked by putting it back. At the Keeper's Desk the agreed order gains one more step: powers and roots, between brackets and × ÷, with a root sign grouping everything under it and a reciprocal undoing a number by multiplying.

**Builds on, never re-teaches:** spec 38's equal groups and unknown factor (here: written as × and ÷ in a sentence); spec 50's multiply-and-add trays and its equals sign (here: one sentence for the whole tray); spec 51's remainders in context (here: one step of a plan); spec 64's balance (here: the undo moves written as lines, with no balance drawn); spec 104's budget lists and spec 63's learner-posed delivery problems (here: revisited as slips). **Stops at one-step and two-step equations** with a box or a letter and whole-number answers; general linear equations, algebraic notation and the crossover case belong to draft PR #126 specs 118 and 119, which list *Writing Algebraic Equations* and *Using inverse operations* as untaught hard prerequisites. This pack is where those get taught. Sibling spec 193 owns formulae, like terms and brackets in algebra (expanding 3(n + 5)).

**Not targeted:** *Order of operations (age 10+)* (`mt_hImiKNiaNh`). Despite its name, its pinned description and evidence are a structure topic about shape hierarchy, fraction-decimal-percent equivalence and the distributive law 3(n + 5) = 3n + 15; its hard prerequisite is a fractions, decimals and percentages structure topic. It is dropped here and is now owned by sibling spec 205 (math build-out map). Powers appear only at the Keeper's Desk (T13, C8, C9, for *Ratio (age 11+)*, below); squaring and square-rooting as inverses, a negative sign beside a power (−3² against (−3)²) and powers of fractions are left out (documented narrowings).

## Place and story

**Host:** the **Order Slip Counter** in the café bakehouse, run by the baker (he/him), route `#numbers/sentences`. Linked from the café, spec 50's tray, spec 104's Gathering Budget and the Workshop's Balance Stall. Open from the start; no bench requires another.

| Act and chapter (future adapters to spec 120) | Beat (full text in the companion) | Job depths |
| --- | --- | --- |
| II, ch. 3 *Ember's birthday* | Ember writes 2 + 3 × 4 honey buns. The baker bakes 14; she meant 20. She adds brackets. | Seedling: build Ember's slip. Sapling: Bracket Board targets. |
| III, ch. 1 *the floating market* | A Vadoalto trader's slip says 20 ÷ 4 × 5 loaves. Pip multiplies first and gets one loaf; it is 25. | Sapling: Two Readers. Keeper's Desk: Nuria's crate plan (D4, D6). |
| III, ch. 2 *the seed exchange* | Nuria's 23 seedlings: bundles of 4 and 3 loose. Dot writes 4 × ☐ + 3 = 23 and they undo it. | Sapling: the Undo Oven. Keeper's Desk: the heap problem (H2, E6). |
| II, ch. 1 *the weekly market*; V, VI | Revisit: the baker's budget list (spec 104) and later route plans written as one sentence. | Any depth; Story Slips for Sprout. |

One shared scene per chapter; any job is a whole contribution; nothing locks a story place. The town, café, slips, trader and seedlings are fiction, labeled apart from math, history and models. The old Keeper does not appear (Hollis rule). The Vadoalto baker of Act III is not used, so the only baker on screen is Willowbank's (he/him).

## The knowledge

**Number sentences.** A number sentence records a calculation with numbers and signs. *Expression*: no equals sign (3 × 4 + 2). *Equation*: an equals sign saying both sides are the same amount (3 × 4 + 2 = 14). A story is written by its structure, never by keywords: equal groups mean × or ÷; "share" can mean each table gets 6, which is 4 × 6. One story can fit more than one correct sentence (12 − 3 = 9 and 9 + 3 = 12). **Reading without working out:** 3 × (1,248 + 965) is three times 1,248 + 965, and that can be said from the structure alone, with awkward numbers that discourage computing. "Three times as much" (× 3) is different from "three more" (+ 3).

**Brackets.** Brackets mean "do this part first": work out the inside, replace it with its number, then carry on. They override the agreed order, so where they go changes the result: 2 + 3 × 4 = 14 but (2 + 3) × 4 = 20. Nested brackets are resolved innermost first: 2 × [3 + (7 − 1)] = 2 × [3 + 6] = 18. Round and square brackets are the same idea at different levels. Inserting brackets to hit a target proves they reorder a calculation; because strict left to right also reaches 25 for 1 + 4 × 5, the child must place and say the brackets, and the board shows that only (1 + 4) × 5 makes 25 under the agreement.

**The agreed order.** First the need: 8 + 2 × 5 read two ways gives 18 or 50, so readers and writers need one agreement. Then the agreement as a three-step staircase: **brackets**; then **× and ÷ together, left to right**; then **+ and − together, left to right**. Worked as a rewrite chain, one step per line: 12 ÷ 3 + 4 × 2 → 4 + 8 → 12. Counterexamples against reading a mnemonic as a queue: 12 ÷ 2 × 3 = 18 (not 2), 20 ÷ 4 × 5 = 25 (not 1), 10 − 4 + 3 = 9 (not 3), 15 − 6 + 2 = 11 (not 7). PEMDAS and BIDMAS are named once, as memory aids whose letters list two shared steps in a row. Multiplication comes first by agreement, not because it is "stronger" or makes bigger numbers; brackets are the way to say otherwise. **Keeper's Desk extension (powers, roots, reciprocals).** Powers and roots take their own step between brackets and × ÷: 5 + 2³ × 3 → 5 + 8 × 3 → 5 + 24 → 29. 2³ is 2 × 2 × 2 = 8, never 2 × 3. A root sign groups everything under it, like brackets: √(36 + 64) = √100 = 10, never 6 + 8 = 14. The reciprocal of 5 is 1/5 because 5 × 1/5 = 1, so dividing by 4 is the same as multiplying by 1/4 (20 ÷ 4 = 20 × 1/4 = 5); a reciprocal is never the negative (−5). The extended staircase is the same agreement with one step added, not a new rule set.

**Multi-step problems.** Understand, draw (bar or group picture), plan each step and its reason, do it, check it makes sense. Each step's answer feeds the next: 4 boxes of 18 rolls = 72, shared by 6 tables = 12, each eats 5 → 7 left. A whole plan can be one sentence with brackets: (7 × 12 − 20) ÷ 4 = 16. A remainder is read from the story: 50 rolls on trays of 12 need 5 trays. **Reasonableness check:** estimate (7 × 12 is about 80; (80 − 20) ÷ 4 = 15, close to 16). An inverse check confirms the arithmetic, not the choice of operation, and a wrong-operation step must be found by reading the story (D4).

**Inverse operations.** + and − undo each other; × and ÷ (by a non-zero number) undo each other. To check 144 ÷ 8 = 18, multiply 18 × 8; redoing the same division, or swapping the numbers (8 ÷ 144), is not a check. Either 18 × 8 = 144 or 144 ÷ 18 = 8 is a valid inverse check. **Last done, first undone:** a machine × 3 then + 2 turns 6 into 20; undo + 2 then ÷ 3. Undoing in forward order gives 20 ÷ 3 − 2, which is not 6.

**Box and letter.** A box or a letter stands for a **number** (n is the number of bundles, not "bundles"). One step: ☐ + 9 = 23 → 23 − 9 = 14. Two steps: 4 × n + 3 = 23 → 20 → 5; 6 × n + 5 = 41 → 36 → 6. Always check by putting the number back. Comparison sentences are built from numbers first: "3 times as many rolls as loaves" → with 2 loaves there are 6 rolls → r = 3 × l, never 3 × r = l (the word-order reversal, which predicts fewer rolls than loaves). Both sides are kept equal by doing the same to each; equation lines are written one true equation per line, as in spec 119's ledger.

**Real anchors (see audit).**
- **The equals sign.** Robert Recorde (Welsh, about 1510-1558), physician and mathematics teacher, introduced the sign in *The Whetstone of Witte* (London, 1557), the first printed algebra book in English. He drew a pair of parallel lines of equal length to avoid repeating "is equal to", because, in his words, no two things can be more equal. His sign was much longer than today's. It did not appear in print again until 1618. Child text: Seedling up (H1), with a source-reading item (E7).
- **The Rhind papyrus "aha" problems.** An Egyptian scribe, Ahmes (also given as Ahmose), copied the papyrus about 1550 BCE from an older text; most of it is in the British Museum, which acquired it in 1865. Problem 24: a quantity (*aha*) and its seventh together make 19. The scribe guesses 7, which gives 8, then scales the guess by 19 ÷ 8, reaching 16 5/8. Guessing and fixing is called **false position**; Britannica notes similar methods in Chinese, Indian, Islamic-world and Renaissance European arithmetic. Keeper's Desk only (H2, E6). E6 uses a made-up heap that comes out whole (24 → 21); child text gives the real problem's 19 and 16 5/8 only in the note.

## The lesson

Jane's **teach → guided → practice** order on every bench: a teach card with a step-revealed worked example, a guided first item with 1-4 visible steps, then practice.

| Bench | Teach | Guided | Practice |
| --- | --- | --- | --- |
| Story Slips | T1, T2 | 3 trays of 6 buns (2 steps) | Set A, B5 |
| Bracket Board | T3, T4 | Brackets in 1 + 4 × 5 to make 25 (3 steps) | Set B |
| Two Readers | T5-T7; T13, T14 (Keeper's Desk) | 8 + 2 × 5 (3 steps) | Set C |
| Plan Board | T8 | 5 tables of 6, then 4 more (2 steps) | Set D |
| Undo Oven | T9-T12 | × 3, + 2, out 20 (3 steps) | Set E |

**"I'm stuck" ladder** on every item: (1) the hint; (2) an easier worked case plus how to start this one (the companion lists them by item family); (3) **Skip for now**, no penalty, nothing recorded against the child.

**Contrasts:** times vs plus for equal groups; "3 times as much" vs "3 more"; with and without brackets on the same numbers; innermost vs outermost first; along the line vs the agreement; agreement vs "× is stronger"; the mnemonic's letters vs its two shared steps; keyword vs structure ("share" meaning each gets); undo vs redo; forward order vs last done, first undone; letter as a number vs letter as a label; story order of words vs the relationship.

**Top misconceptions designed against:** order of steps never matters; only one sentence can fit a story; computing when asked to read; leaving out brackets for "add, then double"; × 3 read as 3 more; same numbers, same value; ignoring brackets; outside-in nesting; strict left to right; × always before ÷ (PEMDAS) or ÷ before × (BIDMAS); + before −; × first because it is stronger; keyword matching; grabbing the easy numbers; losing a step in a chain; blaming the step where the wrong number shows up; mishandled remainders; checking by repeating; swapping numbers as a check; undoing in forward order; the reversal error; letter as object.

**Error responses** follow the research split: an arithmetic slip inside a correct order gets "work out that part again"; an order or grouping error gets the relevant step of the staircase or the innermost-first card. A planning error gets "what does the story say happens here?"

## The game or activity

**(a) Story Slips, model `slip-match-v1`.** A café story card beside three slips. **Match** picks the slip that fits (or, in A5's form, the one that does not). **Build a slip** snaps number, sign and bracket tiles into a sentence; the slip is read back in words as it grows ("4 bags of 5, then add 2"). **Don't work it out** covers the answer line and asks only what the sentence says, with large awkward numbers and a bar drawing (one bar against three bars). Sprout uses picture slips: steps in order, a pancake jammed then folded, a tray matching a list. *A made-up model: authored stories and slips, not real café orders.*

**(b) Bracket Board, model `bracket-board-v1`.** A slip with movable bracket handles. Each placement redraws the value and a rewrite chain ("inside first", one line per step). **Target** mode asks for a value; the board accepts any placement that hits it and, where only one pair works, says so. Round and square brackets color-match their partners and also differ in shape, so color is never the only cue. Practice slips include 1 + 4 × 5 (21 or 25), 12 − 4 − 2 (6 or 10) and 2 + 3 × 4 − 1 (13, 19, 11, or 15 with two pairs). *A made-up model: the board evaluates by the agreed order; the slips are authored.*

**(c) Two Readers, model `order-steps-v1`.** One slip, two readers: Pip reads along the line, the baker reads the agreed way, and both chains show side by side with their answers. A staircase (brackets; × and ÷ shared; + and − shared) sits beside the slip. **Mark the steps** lets the child circle brackets, underline the × ÷ step and box the + − step before any number is computed, then step through the rewrite chain. No timer; the child moves each line. *A made-up model: two readers in a story; the agreed order is real.*

**(d) Plan Board, model `plan-board-v1`.** Step boxes, each holding an operation, a reason chosen from short cards ("equal groups", "some are kept", "shared equally", "more arrive") and the result that feeds the next box. **Draw it** offers a bar or group picture. **Check it makes sense** asks for a rough estimate and shows it beside the answer. **Find the step** shows a worked plan with one wrong-operation line. Remainder steps ask what the leftover means in the story. *A made-up model: authored café and trade plans.*

**(e) Undo Oven, model `undo-machine-v1`.** A two-step number machine (× then +, or + then ×). **Forward** runs a number through; **Backward** asks the child to choose each inverse, last step first, and shows the number at each stage. Box and letter equations appear beside the machine as one true line per step (4 × n + 3 = 23; 4 × n = 20; n = 5), and **Check by putting it back** runs the answer forward. Whole numbers from 1 to 100 only; division only where it comes out whole. *A made-up model: an oven that does arithmetic.*

No timers, scores, streaks, medals or locks. Every bench is open from the first visit.

## Problem sets

Five sets, **34 items**, full text in the companion:

| Set | Depth | Items | Formats |
| --- | --- | --- | --- |
| A. Story and sentence | Sprout (A1-A3), Seedling (A4-A6) | 6 | order, 3-choice (pictures), build a slip |
| B. Brackets | Seedling (B1-B3), Sapling (B4-B6) | 6 | number, 3-choice, place brackets |
| C. The agreed order | Sapling (C1-C4), Keeper's Desk (C5-C9) | 9 | 3-choice, number, rewrite chain, find the step, *say why* |
| D. Plan the steps | Sapling (D1-D3), Keeper's Desk (D4-D6) | 6 | number, 3-choice, order the plan, find the step, build with check |
| E. Undo and unknowns | Seedling (E1, E2), Sapling (E3-E5), Keeper's Desk (E6, E7) | 7 | 3-choice, number, true / not true from this source |

Sprout items use no numbers. Over the 16 three-choice items the right answer sits at A five times, B six times and C five times. A5 asks which slip does **not** match and includes a correct-but-unexpected slip (9 + 3 = 12) as the evidence-specific distractor; C1 has two choices with the right number, one with the agreement and one with the "× is stronger" reason. Build and place items are open construction, as the research asks, beside the selection items. *Say why* (C7) is spoken to a grown-up and never stored or graded.

## Saved work

Optional root `orderSlips` per explorer, absent until a first explicit action.

```
orderSlips: {
  version: 1,
  slips:   { [slipId]: { source, tiles: [tileId], at } },                // latest build per slip
  board:   { [puzzleId]: { source, pairs: [[open, close]], at } },      // token positions, max 2 pairs
  machine: [{ source, machineId, input: 1-100, at }],                   // latest 12
  plans:   { [planId]: { source, steps: [{ op, reasonId }], estimate, at } },
  answers: { [itemId]: { source, choice | value | order | tiles | pairs | marks, support: ['hint'|'example'|'skip'], at } }
}
```

`source` freezes the model version and the item's choices, tiles and order. Codes and numbers only: tile, reason and operation ids, never free text. Never recompute or rewrite saved results on load (a saved board keeps its bracket positions, not a value); validate ids and ranges only (positions within the slip's token count, inputs 1-100). An unreadable entry stays raw and exportable while the rest stays open. Support stays separate from answers; no mastery flag. Shared export, import, reset and explorer switching.

## Curriculum fit

**Strands:** **M2** operations and their relationships; **M4** expressions, equations and early algebra (M4-III); **H1** a printed book and a papyrus as sources. Act families: II, III, with revisits in V and VI.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Write and read number sentences for stories without computing; place and evaluate brackets, nested innermost first; apply the agreed order with × ÷ and + − as shared left-to-right steps, and say why it is an agreement; at the Keeper's Desk, add powers and roots as their own step and use a reciprocal; plan multi-step problems with reasons and a sense check; undo calculations to check and solve, last step first; write and solve one- and two-step equations with a box or letter. |
| Teaching encounter | T1-T14 with step-revealed worked examples; a guided first item per bench. |
| Contrast | As listed in The lesson. |
| Supported practice | Live rewrite chains; movable brackets; Mark the steps; reason cards; Backward mode; the "I'm stuck" ladder. |
| New application | Don't-work-it-out comparisons; Ember's and the trader's slips; Nuria's crate plan as one sentence; the heap problem by false position; the Recorde source item. |
| Purposeful revisit | Spec 38 (equal groups, unknown factor); spec 50 (tray sentences, equals sign); spec 51 (remainders); spec 64 (balance moves as inverse operations); spec 104 (budget list); draft specs 118 and 119 (equations at the Keeper's Desk). |
| Data boundary | Tiles, bracket positions, machine inputs, plan codes, choices, values and support codes, all local. No timing, free text or location. |

## Upstream check

Refreshed upstreams: Jane `0ec55f7e083976e6fcc3977fca460b1f5e199d91` and Marble `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (both 2026-10-24). Ids confirmed in the pinned `curriculum/marble/topics.json`.

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Brackets in Expressions (`mt_8jFSnXxqQD`) | Grouping overrides the default order; nested inside-out; insert brackets to hit a target and explain; open tasks beside selection; separate a slip inside a bracket from a grouping error. Bracket Board targets, T3-T4, B1, B3, B4, B6; error responses split. |
| Order of operations (`mt_jHgRQ4hR0g`) | Feel the ambiguity (18 or 50) before naming the rule; × ÷ and + − as shared tiers swept left to right with counterexamples; an agreement, not "stronger"; staircase used beside live evaluation; ask for the sequence and reason, not only the value. T5-T7, Two Readers, C1-C7. |
| Writing Number Sentences (`mt_4WaKWECpcv`) | Keep writing separate from evaluating; awkward numbers; "add then multiply" needs brackets; contrast look-alike structures; words to symbols and back; construction beside matching. Story Slips (Don't work it out, Build), T1-T2, A4-A6, B2, B5. |
| Multi-step problems: choosing operations (`mt_RXnyhCRYXA`) | Structure, not keywords (a misleading "share"); understand → represent → plan → do → check; reasons per step; find a wrong-operation step; remainders read from context; an inverse check confirms arithmetic, not the operation. Plan Board, T8, D1-D6. |
| Using inverse operations (`mt_VUQNveSYjQ`) | Machine run backward; reverse both operations and order; checking by redoing or swapping numbers is not a check; both inverse checks valid; same to both sides. Undo Oven, T9-T11, E1-E3. Squaring and square roots (with their ± subtlety) are a documented narrowing. |
| Ratio (age 11+) (`mt_X5cypSGoGU`) | Despite its name, its pinned description and research are the order of operations extended to powers, roots and reciprocals. Slot powers and roots in as one new step of the known staircase, not a new acronym; keep × ÷ and + − as shared steps; confront 2³ read as 2 × 3 and a root sign treated as covering only its first number; reciprocal via n × 1/n = 1 and ÷ n = × 1/n; a rewrite chain one step per line. T13, T14, C8, C9 (Keeper's Desk). The −3² against (−3)² trap is a documented narrowing (no negatives with powers here). Added at review after the build-out map reassigned it to this pack. |
| Writing Algebraic Equations (`mt_i9rJbuFO3p`) | Letters are numbers of things; build numbers before writing comparisons; test by substitution (a whole answer alone does not prove it); equation needs an equals sign; process equations step by step with a machine. T11-T12, E4, E5, Scene 3; one- and two-step only, onward to specs 118 and 119. |

Research text (CC BY-SA 4.0, © Generative Spark, Inc.) is paraphrased as design notes, never reproduced; worked numbers differ from the research's own examples except where a standard case (8 + 2 × 5, 12 ÷ 2 × 3) is the point of the contrast.

**Jane:** adopted teach → guided → practice, the three-step "I'm stuck" ladder, short second-person prompts, three-option choices with misconception-tagged distractors and per-choice feedback, step-revealed worked examples and a glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, points, streaks. No Jane code or text copied.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| Brackets in Expressions | Division with remainders (`mt_p-nbe0w_lf`) | Met elsewhere in part: spec 51 on main (a scoped conceptual rehearsal, by its own account). The multi-step and letter-equation parts of that topic's description are supported inline here (Set D, Set E); no claim. |
| Order of operations | Brackets in Expressions (`mt_8jFSnXxqQD`) | Taught here (Bracket Board before Two Readers). |
| Writing Number Sentences | Brackets in Expressions (`mt_8jFSnXxqQD`) | Taught here. |
| Multi-step problems: choosing operations | Division with remainders (`mt_p-nbe0w_lf`) | As above: spec 51 in part; D5 rehearses a remainder in context. |
| Multi-step problems: choosing operations | Division with remainders (age 10+) (`mt_WsM4EmdOLe`) | **Documented gap:** formal long division is claimed by no spec on main or any draft. Every division here is a known fact or comes out whole; no long division is needed. |
| Using inverse operations | Order of operations (`mt_jHgRQ4hR0g`) | Taught here (Two Readers before the Undo Oven's two-step machines). |
| Using inverse operations | Multi-step problems: choosing operations (`mt_RXnyhCRYXA`) | Taught here (Plan Board). |
| Writing Algebraic Equations | Writing Number Sentences (`mt_4WaKWECpcv`) | Taught here (Story Slips). |
| Ratio (age 11+) | Order of operations (`mt_jHgRQ4hR0g`) | Taught here (T5-T7 and Set C before T13 and C8). |

Soft prerequisites (long multiplication for brackets; order of operations for multi-step and equations) are noted, not required: no item needs a written long multiplication.

**Claim check, 2026-10-25:** no spec on main or any draft PR (126, 128, 137-151) claims these seven targets. Sibling 190 names `mt_X5cypSGoGU` as an unclaimed prerequisite of its square and cube numbers; with this claim, that row can read "met elsewhere: proposed spec 192". Draft PR #126 lists *Multi-step problems: choosing operations* and *Using inverse operations* only as candidate references in two Keeper's Desk cases (pending semantic review), and its specs 118 and 119 record *Writing Algebraic Equations* and *Using inverse operations* as hard prerequisites with no reference in the app; this pack supplies them and those cases can revisit it. `#numbers/sentences` is unused.

## Checks for implementation

- **Numbers script (2026-10-25):** `check192.py` (`python3 -I`, scratch area, not in the repo), 109 checks passing: T5 8 + 2 × 5 = 18 (left to right 50); T6 12 ÷ 3 + 4 × 2 → 4 + 8 → 12; T7 12 ÷ 2 × 3 = 18 (wrong 2), 10 − 4 + 3 = 9 (wrong 3); T4 2 × [3 + (7 − 1)] = 18; Scene 1 14 vs 20; Scene 2 25 vs 1; Scene 3 and T12 4 × 5 + 3 = 23; A6 22 (wrong 14); B1 24 (wrong 12); B2 30, 24, 21; B3 21 and 25, **exactly one** single-pair placement of 1 + 4 × 5 gives 25; B4 6, 4, 12 (wrong 24); B5 3 × 2,213 (not 2,216); B6 **exactly one** placement of 12 − 4 − 2 gives 10; C1 17 (left to right 32); C2 25 (wrong 1); C3 11 (wrong 7); C5 22 (wrong 40); C6 15, Bramble's left-to-right chain 27 with each line's arithmetic correct; D1 34 (wrong 15, 50); D3 72, 12, 7; D4 84, 64, 16 (flawed 104, 26); D5 50 = 4 × 12 + 2, 5 trays; D6 (7 × 12 − 20) ÷ 4 = 16 (no brackets 79), estimate 15; E1 9 × 8 = 72; E2 14 (wrong 32); E3 8 (wrong 3.5, 158); E4 2 loaves → 6 rolls, reversal → 2/3 roll, +3 → 5; E5 6 (wrong 36, 46 ÷ 6 not whole); E6 21 + 3 = 24, **unique** over rationals with denominators under 50 (wrong 3, 17); Rhind 133/8 + its seventh = 19, 133/8 = 16 5/8 = 19/8 × 7; bench board 2 + 3 × 4 − 1 single-pair values {11, 13, 19}, two pairs 15; every stuck-ladder easier case; 15 three-choice items at A/B/C 5 each.
- Style check run on the companion (`style192.py`): 0 em-dashes; 12 teach cards, longest 20 words (limit 30); 32 prompts, longest 15 (limit 15); 109 hints, feedback and explanations, longest 18 (limit 20); scene Short, Longer and Keeper's notes within 30, 150 and 80; American spelling; Hollis not named.
- Every rewrite chain does one step per line. The board never shows a value without its chain. Feedback never says "wrong". Sprout items show no numbers.
- Browser at 320 and 820 px: targets 44 px; tiles and brackets tap-to-place as well as drag; bracket pairs differ in shape as well as color; every staircase and bar drawing has a text equivalent ("Middle step: × and ÷, left to right").
- The Spanish lines (*¡Veinticinco panes!*, *Cinco manojos*) checked by a fluent reader before build.
- Independent review, 2026-10-25: a separate reviewer recomputed every item, worked example, bracket placement and stuck-ladder case with an independent `python3 -I` script (119 checks across specs 192-195, all passing, including brute-force uniqueness of B3, B6 and E6 and the new powers items), recounted the three-choice balance (now 16 items: A 5, B 6, C 5), reran the style check (0 em-dashes in all three files; word limits met), checked the Marble descriptions, research records and hard prerequisites, the spec 120 chapter names and the Recorde and Rhind facts against search excerpts. Changed: added `mt_X5cypSGoGU` (named *Ratio (age 11+)*, described as the order of operations with powers, roots and reciprocals), reassigned by the build-out map, with an upstream row, a crosswalk row, T13, T14, C8 and C9 and a four-step Keeper's Desk staircase (34 items); recorded `mt_hImiKNiaNh` as now owned by sibling spec 205; replaced "wrong" in the C6, C7 and D4 prompts and hints. No math errors found.

## Review asks

**Math expert:**
1. Is the staircase (brackets; × ÷ shared; + − shared) an honest first statement of the convention, with powers and roots added as one step only at the Keeper's Desk (T13)?
2. Is "an agreement, not a law" right without overclaiming that the convention is arbitrary in every respect (it fits how × distributes over +)?
3. Is C1's split (right number with the agreement vs right number with "× is stronger") fair as a three-choice item?
4. Is E6's whole-number heap a fair stand-in for false position, with the real 16 5/8 kept in the note?

**Owner questions, with defaults:**
1. Route `#numbers/sentences` with the bakehouse as its scene? *Default: yes.*
2. Drop `mt_hImiKNiaNh` (a structure topic named "Order of operations (age 10+)") and claim `mt_X5cypSGoGU` (named "Ratio (age 11+)", described as order of operations with powers)? *Default: yes, as the build-out map now assigns: 205 owns the first, this pack the second.*
3. Name PEMDAS and BIDMAS on screen at all? *Default: yes, once, in C4 and T7's "whatever a song says", to warn against the letter queue.*
4. First slice? *Default: Two Readers with Set C, then the Bracket Board.*
