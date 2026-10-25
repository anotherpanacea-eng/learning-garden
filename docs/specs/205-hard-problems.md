# 205. The Problem Shelf: multi-step problems, reasons, precision, tools, structure and models

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a math check.** Part of the [math build-out](https://github.com/anotherpanacea-eng/learning-garden/pull/154). Every child-facing line is in [the companion text](../content/205-hard-problems-text.md); sources and open checks are in the [source audit](../source-audits/205-hard-problems.md).

**Commissioning boundary:** a proposal only. Select a bounded first slice after independent content, model and save review; the six trays do not commission each other. The Problem Shelf sits inside the Keeper's Desk proposed by [spec 118](https://github.com/anotherpanacea-eng/learning-garden/pull/126) (draft PR #126) and reuses its conventions; it does not require Case 1 or any casebook case to ship first. All Act and chapter links are future adapters to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (draft PR #127). Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter. **Fact-check status:** real-world facts checked against search excerpts on 2026-10-25 (page fetches blocked); no `[check]` item is in child text. The math is standard and still needs the math check.

## Purpose

Pinned Marble's **Mathematical Thinking** domain holds the practices that sit on top of every strand: plan a multi-step problem, justify, be precise, choose a tool, use structure, model the real world, move between representations. Its older-learner topics have no reference and no claim. Spec 118's desk claims *Constructing mathematical arguments* through one counterexample in Case 1; sibling spec 204 takes the young problem-solving topics. This pack takes fifteen older practice topics to the desk, including *Understanding fractions (age 10+)*, whose description is representation fluency (bar, equation, table, grid), not fractions.

A child comes to understand that a multi-step problem is read twice, planned in named steps from its structure (never from cue words), estimated first and checked after by undoing or another method; that a problem can carry extra facts or lack one; that an argument links reasons so a skeptic can check them, and that critiquing means finding the first broken step; that one example never proves "always" and an estimate never proves the last digit; that a unit, a word or a rounded figure says exactly what is meant; that the numbers decide the tool, and a calculator checks while the solver judges; that structure turns long work short (47 × 99 = 4,700 − 47; 1/8 = 12.5%; a square keeps every rectangle fact); and that a model states its assumptions, meets real data and is revised, with rounding set by the story.

**Builds on, never re-teaches:** spec 118's desk conventions (fold-away learn card, guided first task, **I'm stuck**, **Check my working**, reasons never marked), its Case 1 counterexample (here: a one-line recap, T8, with a different claim; C3 is practice), its Case 1 *expression* vs *equation* learn card (here: D5 adds *formula*), its Case 1 linear-equation working (here: equations only as one form of a slip, T18, B6, B7) and its Case 3 seed-exchange ratio table and 5 : 3 nursery share (here: one ratio table in a recipe, B5, and one ratio-as-fraction form choice, E6, with different contexts and numbers; Scene 1 uses the same chapter but no ratio); sibling spec 204's first plan-and-check routine and its Pólya card (here: three or more steps, fractions, percents, ratio, letters; H1 revisits only the look-back step); sibling 191's estimating to check and remainder meanings (here: an estimate as a check that cannot prove, and rounding against measured or decimal results); sibling 192's order of operations and inverse checks and sibling 193's expanding brackets (here: 3(n + 5) is only recalled as one structure among several); sibling 185's split rectangle (here: choosing to split); sibling 200's fraction-decimal-percent equivalents and sibling 201's ratio bars (here: choosing the form that makes a job easy); spec 104's Gathering Budget and spec 63's learner-posed problems (here: town slips of the same kind, longer). **Not targeted:** every topic owned by another pack in the build-out. Volume (sibling 184) and circle facts appear only as material for precise words and units.

## Place and story

**Host:** the **Problem Shelf** beside the Keeper's Desk, route `#desk/problems`, a tall shelf of town problem slips that need more than one step. **Wren Halloway** (she/her) hands them over and reads Look-back answers aloud. Linked from `#desk`, spec 104's Gathering Budget, sibling 192's Order Slip Counter and sibling 191's Exchange Shed. Open from the start; no tray requires another.

| Act and chapter (future adapters to spec 120) | Beat (full text in the companion) | Job depths |
| --- | --- | --- |
| III, ch. 2 *the seed exchange* | Wren gathers the exchange's scraps; the top slip (the baker's buns) has a squeaky wheel in it. "The old Keeper kept a shelf just like this." | Seedling: plan and check. Sapling: extra and missing facts. Keeper's Desk: a recipe ratio and a slip in four forms, set up first. |
| IV, ch. 4 *the proposal for the low fields* | The meeting board says the marsh "holds 60,000". Bramble: "Sixty thousand what? And why should we believe it?" | Seedling: units. Sapling: convince a friend. Keeper's Desk: convince a skeptic; estimate vs proof. |
| VI, ch. 2 *compare routes and keep a plan*; ch. 4 *the first journey* | Dot's plan: 120 kg at 30 a trip, four trips. The first week's trips carry 26, 24, 27 and 23 kg; Wren: "Test the model, and change it." | Sapling: round for the story. Keeper's Desk: revise the model; a Fermi estimate of Vadoalto's apples. |

One shared scene per chapter; any job is a whole contribution; nothing locks a story place. The town, its trades, prices and trips are fiction, labeled apart from math, history and models. **Hollis rule:** Act III text says "the old Keeper"; Hollis (they/them) is named only in the Act IV and VI scenes. Scene 3 keeps Hollis offstage so spec 120's homecoming stays its own.

## The knowledge

**Planning a multi-step problem (Pólya's four steps).** *Understand*: read twice; list what is known and what is asked. *Plan*: draw a bar (or table, or letter) and name each step before calculating. The story's structure decides the operation; cue words such as "left" do not (keyword matching fails on multi-step problems). *Do*: work each step, keeping **Found** and **Still to find** lists. *Look back*: compare with the estimate made before calculating, then check by undoing (inverse operations, last step first) or by a different method; if they disagree, look again. A stalled plan is a cue to re-represent (swap the bar for a table, work backward), never a dead end.

**Longer problems.** Some slips carry **extra** facts (the oven's age) or lack a **needed** one (how many sacks a load holds); asking for a fact that changes nothing (the trip's distance, when the question is how many trips) is its own slip. Percent, fraction, decimal and ratio problems get a size check: a part of a fixed group cannot exceed 100% (60 of 80 trees is 75%, never 133%), though a percent of a reference unit can (2.5 jugs is 250%), so "over 100% is always impossible" is never taught. Ratio and letter problems are **set up before solving**: a ratio table for 2 jars of honey : 3 cups of oats (14 jars → 21 cups), a bar or letter for "Bramble has 6 more" (p + p + 6 = 30, p = 12). Answers return to the question asked, in its unit (the price paid, $64.80, not the discount, $21.60).

**One slip, many forms.** A slip can be shown as a bar, an equation, a table and a point on a grid; each part keeps its meaning in every form, and = says both sides are the same amount (relational, never "work it out"). Hob's 3 sacks and 5 loose apples, 41 in all: 3s + 5 = 41, the grid point (3, 36) means 3 sacks hold 36 apples, so s = 12. The pie-chart strand of this topic is left to the data packs (narrowed).

**Justifying.** Three audiences: **yourself** (try it), **a friend** (show it on a shared picture), **a skeptic** (a reason that works every time). Facts become an argument when linked with *since* and *so* (since 6 × 10 = 60 and 6 × 2 = 12, 6 × 8 = 48). **Critique** means finding the first step that stops making sense and saying why; a different answer alone shows neither where nor why (Pip's 71 − 26: "6 − 1" swaps the digits instead of exchanging a ten). One example never proves "always"; one counterexample settles "not always" (recap of spec 118); an estimate near 4,700 checks the size of 47 × 99 but cannot tell 4,653 from 4,663. Spoken "say why" answers are never stored or graded.

**Precision.** Units match what is measured: cm for length, cm² for area (counted squares), cm³ for volume (filled cubes); a bare number cannot be checked. 24-hour time has no am or pm (15:45 = 3:45 pm). Words have one meaning: factor (fits into) against multiple (in the times table), 5² (5 × 5) against 5 × 2, expression (no equals sign) against equation (two things equal) against formula (a rule linking quantities), radius against diameter (twice the radius) against circumference, acute and obtuse measured against a right angle. Estimates are marked "about" or ≈; a figure is rounded to what the job can measure (a pond path is about 22 m, not 21.99114858 m), and a rounded figure is never called exact.

**Choosing tools.** Read the numbers first: friendly numbers mentally (25 × 4), awkward ones written (167 × 3, 4,752 ÷ 13), shapes and fractions in a diagram, many cases or ratios in a table, moved shapes on a grid. A calculator **checks** written work; the solver still judges whether its output is sensible. Every tool card names its limit (a table shows only the rows you made; a grid is only as good as the plotting).

**Using structure.** Before a long method, ask what this is like. 99 is 100 − 1, so 47 × 99 = 4,700 − 47 = 4,653; 101 is 100 + 1, so 23 × 101 = 2,323; 36 is 4 × 9, so 25 × 36 = 100 × 9 = 900. A split shares the multiplier with every part (25 × 30 + 6 forgets the 6's share). Forms of one quantity: 1/8 = 0.125 = 12.5%, so 1/8 of $64 ($8) beats 12% of it ($7.68); a 3 : 4 ratio is 3/7 and 4/7 of the whole (12 sunflower seeds of 28). The shape family runs one way: a rectangle is a parallelogram, so its opposite sides are parallel; equal sides belong to squares, further down. 3(n + 5) = 3n + 15 is recalled from sibling 193's area picture as one more case of a multiplier shared by every part.

**Modelling.** The cycle: **assume**, **build**, **work out**, **test against data**, **revise**. Dot's plan assumed 30 kg a trip; the first week's trips averaged 25 kg, so four trips carry only 100 kg and the revised plan is five (120 ÷ 25 = 4.8). Scaling is multiplicative (a cake for 6 with 150 g of flour needs 375 g for 15, never 159 g). **Rounding is the story's choice**: 75 people in boats of 8 need 10 boats (round up), 75 apples fill 9 crates of 8 (round down), 48 people fill exactly 6 boats (no rounding). **Fermi estimates** (Keeper's Desk) break an unanswerable question into guessable pieces, multiply, and aim for the right size: 400 people (a stated made-up figure) eating an apple every 2 days eat about 1,400 apples a week; anything from about 1,000 to 2,000 is the right size, and the solver names which guess matters most.

**Real anchors (see audit).**
- **Pólya's four steps.** George Pólya, a mathematician at Stanford University, published *How to Solve It* (Princeton University Press, 1945). Its four phases are understand the problem, devise a plan, carry out the plan, and look back (check the result, derive it differently, reuse the method). Sibling spec 204 introduces the four steps (its card H1); card H1 here only revisits the look-back step, and the Plan Card's boxes follow them.
- **The Nine Chapters.** *The Nine Chapters on the Mathematical Art* (*Jiuzhang suanshu*), compiled in China over several centuries and in its final form by the Han dynasty (about 2,000 years ago), sets out problems with their answers and methods: fields, grain, fair shares, taxes, canals. Liu Hui's commentary (traditionally dated 263 CE, from a later record) explains why the methods work. Child text gives no problem count (the often-quoted 246 was not confirmed) and calls Liu Hui's notes "much later".
- **Fermi problems.** Enrico Fermi, a physicist who taught at the University of Chicago, was known for asking students questions that seemed impossible and showing them how to answer by breaking them into pieces; such questions are now called Fermi problems. Science Olympiad, a US contest for school teams, still runs an event called Fermi Questions, answered as a power of ten. Keeper's Desk only (card H3). The piano-tuner question is traditionally attributed to Fermi but has no primary record, so it is not used; no weapons history appears anywhere in the pack (independent review, 2026-10-25).

## The lesson

Jane's **teach → guided → practice** order on every tray, inside spec 118's desk conventions: a foldable teach card with a step-revealed worked example (**I know this, show me the question**), a guided first item with 2-4 visible steps, then practice.

| Tray | Teach | Guided | Practice |
| --- | --- | --- | --- |
| Plan Card | T1-T5, T18 | Pip's pies and change (4 steps) | Sets A, B |
| Convince Corner | T6-T8 | Even + even, three audiences (3 steps) | Set C |
| Say It Exactly | T9-T11 | A 4 m by 3 m rug (3 steps) | Set D |
| Tool Rack | T12 | 398 + 247 (3 steps) | Set E (E1, E2) |
| Shortcut Lens | T13, T14 | 23 × 101 (3 steps) | Set E (E3-E7) |
| Model Workshop | T15-T17 | 48 people, boats of 8 (3 steps) | Set F |

**"I'm stuck" ladder** on every checked item: (1) the hint; (2) an easier worked case plus how to start this one (fifteen in the companion); (3) **Skip for now**: "Leave this question open. Your other work stays here." Each rung is recorded as separate support. Worked examples are references; each is followed by an item the child plans and checks.

**Contrasts:** cue word vs story structure; = as "work it out" vs = as "the same amount"; estimate vs exact; undo vs redo; extra vs missing vs irrelevant-but-asked-for; part of a group vs reference unit for percents; different answer vs broken step; one example vs counterexample; estimate vs proof; cm vs cm² vs cm³; factor vs multiple; 5² vs 5 × 2; expression vs equation vs formula; about vs exact; mental vs written; calculator to check vs to do; long method vs structure; round up vs down vs exact; additive vs multiplicative scaling; first model vs revised model.

**Top misconceptions designed against** (from the Marble records): keyword-to-operation matching; computing with no estimate or check; losing track across steps; stopping at a number without its meaning or unit; a part over 100% accepted (and its over-correction, "over 100% is always wrong"); judging an argument by answer agreement; one example as proof; restating instead of reasoning; area with a length unit; 15:45 pm; factor/multiple swapped; 5² read as 5 × 2; 3x + 5 called an equation; an estimate presented as exact; writing out friendly sums; trusting a calculator unjudged; splitting without sharing the multiplier; refusing that a rectangle is a parallelogram; comparing 1/8 and 12% by their digits; bare quotients (9.375 boats); rote rounding against the story; additive scaling; keeping a model the data contradict; reading = as "work out the left side"; misreading what a grid point stands for.

## The game or activity

**(a) The Plan Card, model `plan-card-v1`.** Four boxes (Understand, Plan, Do, Look back), side lists (Found, Still to find, Extra, Missing), a bar tool, an estimate field before **Check my working**, and **Try another way**, which swaps the representation. *A made-up model: town problems with authored numbers.* The child names steps from tiles before calculating; a planning step can be skipped, and nothing is gated on it.

**(b) Convince Corner, model `convince-v1`.** A board of claims and worked steps from Bramble, Pip and Dot. The child picks an audience (yourself, a friend, a skeptic), tries examples, builds a chain from *since / so / because* tiles, or taps **Mark the broken step** on someone's working. Built chains and spoken reasons are never marked; only "which step" choices have authored replies. *A story from Willowbank: the claims are made up.*

**(c) Say It Exactly, model `exact-words-v1`.** Answers from town notebooks missing a unit, using a loose word, or carrying false precision. Unit tiles, word cards and an **Exact or about?** toggle with a rounding dial. *A made-up model.*

**(d) The Tool Rack, model `tool-rack-v1`.** Six tool cards (in your head, written, calculator, diagram, table, grid), each with "good for" and "its limit". The child reads a calculation, hangs a tool on it, and says why; the calculator appears only after a written answer exists, as a checker.

**(e) The Shortcut Lens, model `structure-lens-v1`.** **Split it**, **Round and fix**, **Change the form** (fraction, decimal, percent, ratio part), **Shape family** (quadrilateral → parallelogram → rectangle → square, facts flowing down) and **Show the area picture**. The child chooses the split point; the lens shows both parts recombining.

**(f) The Model Workshop, model `model-cycle-v1`.** A cycle strip (Assume, Build, Work out, Test against data, Revise) with assumptions on sliders and a **Round for the story** panel (up, down, exact). The **Fermi panel** (Keeper's Desk) lists pieces to guess, multiplies them, and asks which guess changes the answer most. *A made-up model: Vadoalto's 400 people and every trip weight are authored.*

No timers, scores, streaks, medals or locks. Every tray is open from the first visit.

## Problem sets

Six sets, **37 items**, full text in the companion:

| Set | Depth | Items | Formats |
| --- | --- | --- | --- |
| A. Plan, do, look back | Seedling (A1-A3), Sapling (A4, A5) | 5 | 3-choice, number with worked steps |
| B. Extra, missing and longer problems | Sapling (B1, B2), Keeper's Desk (B3-B7) | 7 | 3-choice, number, match |
| C. Convince me | Seedling (C1, C2), Sapling (C3), Keeper's Desk (C4, C5) | 5 | 3-choice, *say why* |
| D. Say it exactly | Seedling (D1, D2), Sapling (D3, D4), Keeper's Desk (D5-D7) | 7 | 3-choice, match, number |
| E. Tools and shortcuts | Seedling (E1, E2), Sapling (E3, E4), Keeper's Desk (E5-E7) | 7 | 3-choice, number |
| F. Model it | Sapling (F1-F3), Keeper's Desk (F4-F6) | 6 | 3-choice, number, Fermi estimate, true / not true from this source |

No Sprout items: these practices need a problem to practice on. Over the 22 three-choice items the right answer sits at A seven times, B eight times and C seven times, and the right choice is never the longest alone except D1, where the unit (cm²) is the point being taught. B2 and C3 each carry a distractor that asks for more than the evidence needs (a distance that cannot change the trip count; a hundred examples where one counterexample suffices). *Say why* is spoken to a grown-up and never stored or graded. F5 accepts any whole number from 1,000 to 2,000 as the right size and shows the model's 1,400 with its stated guesses.

## Saved work

Optional root `problemShelf` per explorer, absent until a first explicit action.

```
problemShelf: {
  version: 1,
  plans:   { [slipId]: { source, steps: [stepId], estimate, found: [stepId], at } },
  marks:   { [claimId]: { source, step: 1-6, audience: 'self'|'friend'|'skeptic', at } },
  models:  { [modelId]: { source, assume: { [sliderId]: number }, round: 'up'|'down'|'exact', at } },
  answers: { [itemId]: { source, choice | value | match | sort, support: ['card'|'guided'|'hint'|'example'|'skip'], at } }
}
```

`source` freezes the model version and the item's choices and order. B7 stores its `match` and its follow-up `value` in the same entry. Codes and numbers only: no free text (chains are tile ids; "say why" is never stored). Validate ids and ranges only (estimate and value within the item's stated range; slider values within their authored bounds); never recompute or rewrite saved results on load, even if an answer key changes. An unreadable entry stays raw and exportable while the rest stays open. Support stays separate from answers, and folding a card never clears support already shown (spec 118 convention 1); no mastery flag. Shared export, import, reset and explorer switching. If spec 118's `desk` root exists, this root sits beside it and never writes into it.

## Curriculum fit

**Strands:** **M** (all number strands as material; the Mathematical Thinking practices as the target), **E3/E4** argument and audience, **S1** testing a model against data, **H1** an old book and a real estimate as sources. Act families: III, IV, VI.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Plan, estimate, solve and check multi-step problems with extra or missing facts; set up ratio and letter problems first; move one slip between bar, equation, table and grid; build and critique arguments for three audiences; state units, words and rounding precisely; choose and justify a tool; use structure to shorten work; model, test, revise, round for the story and make Fermi estimates. |
| Teaching encounter | T1-T18 with step-revealed worked examples; a guided first item per tray. |
| Contrast | As listed in The lesson. |
| Supported practice | Found / still-to-find lists; estimate field; Try another way; tool cards with limits; the Shortcut Lens; assumption sliders; the "I'm stuck" ladder. |
| New application | The same 75 split three ways (boats, crates, exactly 48); Dot's revised plan; Hob's slip in four forms; a Fermi question; the off-screen street estimate. |
| Purposeful revisit | Spec 118 Case 1 (cost rules, counterexample); spec 104 budget; siblings 191 (estimate, remainders), 192 (inverse checks), 193 (brackets), 200 (percents), 201 (ratio bars); spec 120 Act VI ch. 4 (revise the plan). |
| Data boundary | Steps, estimates, choices, values, tile ids, slider values and support codes, all local. No free text, timing or location. |

## Upstream check

Refreshed upstreams: Jane `0ec55f7e083976e6fcc3977fca460b1f5e199d91` and Marble `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (both 2026-10-24). Ids confirmed in the pinned `curriculum/marble/topics.json`. Every target has a Marble research record; all are paraphrased here, none copied (CC BY-SA).

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Multi-Step Problem Solving, 7-8 (`mt_RKeheOL9uo`) | Structure over keywords; estimate before, inverse check after; switching strategy is normal; worked examples only as references. T1-T3, Plan Card, Try another way; A1-A3. |
| Multi-Step Problem Solving, 8-9 (`mt_SmghasIvbT`) | Child names sub-steps and a plan; bracket the answer's size; found / still-to-find; compare diagram and equation. Plan tiles, side lists; A4, A5 (3/5 of 40 is more than half). |
| Complex Multi-Step Problems (`mt_GpltXPoaoc`) | Known vs unknown first; rounding benchmark; magnitude sense for percents without "over 100% is always wrong". T4, B1-B4 (2.5 jugs named in B4's feedback). |
| Advanced Multi-Step Problems (`mt_FieL-vVTI_`) | Represent the relationship (ratio table, bar, letter) before computing; interpret the answer in context. T5, B5, B6. |
| Justifying mathematical reasoning, 8+ (`mt_a3dov8CZkq`) | Find the faulty step, not re-solve; since/therefore chains; convince a doubter; one example is not proof; scribe, never score talk. T6-T8, Convince Corner, C1-C5; C4 spoken. |
| Mathematical Precision (`mt_mywsN77hGZ`) | Area needs a square unit; 24-hour time has no pm; angle names against a right angle; two names for one value. T9, D1, D2; word cards. |
| Precise Maths Vocabulary (`mt_xfwv0M83mJ`) | Factor vs multiple with direction; 5² as a square; unit matches dimension; mark estimates "approximately". T10, T11, D3, D4, D7. |
| Advanced Maths Vocabulary (`mt_3rTIyJDw7-`) | Expression / equation / formula by the role of "="; radius, diameter, circumference; volume in cm³. D5-D7. |
| Choosing mathematical tools (`mt_d-WZC2OyMB`) | Read the numbers to route mental or written; calculator to check; name each tool's limit. T12, Tool Rack, E1, E2. |
| Choosing Maths Tools (`mt_ZJC7JnnPCu`) | Judge when to use an already-known method (long division, formula, grid); justify; never reteach the method. Tool cards, E1 (4,752 ÷ 13), the grid card. |
| Using Mathematical Structure (`mt__Itf4aQZUj`) | Look for a known structure before a procedure; split must share the multiplier; no "add a zero"; nested shape families. T13, Shortcut Lens, E3, E4, E7. |
| Order of operations, 10+ (`mt_hImiKNiaNh`) | Despite its name: shape hierarchy as deduction, 3(n + 5) by area, fluent FDP and ratio forms. T14, E5-E7; the order-of-operations sense belongs to sibling 192. |
| Real-World Maths Modelling (`mt_8xVHooT4aI`) | Choose the representation; return the answer to the quantity asked, with its unit; multiplicative scaling. B3, F3, the Model Workshop. |
| Real-World Mathematical Modelling (`mt_yqZiX6vS7D`) | Rounding decided by the situation: one round-up, one round-down, one exact case; estimate first; keep units. T16, F1, F2, guided item, F4, F5. |
| Understanding fractions, 10+ (`mt_9KmVWCuh5_`) | Despite its name: translate a word problem into a bar and an equation with a letter, mapping each symbol; a relational equals sign; name what a grid point means in the situation; move among situation, bar, equation, table and grid. T18, B6, B7, Try another way. Narrowed: the pie-chart/percentage strand is not covered here. Added at independent review (2026-10-25) after spec 196 dropped it. |

**Jane:** adopted teach → guided → practice, the three-step "I'm stuck" ladder, short second-person prompts, three-option choices with misconception-tagged distractors and per-choice feedback, step-revealed worked examples and a glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, points. No Jane code or text copied.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| Multi-Step Problem Solving, 7-8 | Guided Multi-Step Problem Solving (`mt_O_UOTiMvT_`) | Met elsewhere: proposed spec 204 (math build-out); recap inline in T1-T3. |
| Multi-Step Problem Solving, 8-9 | Multi-Step Problem Solving, 7-8 (`mt_RKeheOL9uo`) | Taught here (Set A, A1-A3, before A4-A5). |
| Complex Multi-Step Problems | Multi-Step Problem Solving, 8-9 (`mt_SmghasIvbT`) | Taught here (A4-A5 before Set B). |
| Advanced Multi-Step Problems | Complex Multi-Step Problems (`mt_GpltXPoaoc`) | Taught here (B1-B4 before B5-B6). |
| Justifying mathematical reasoning, 8+ | Justifying mathematical reasoning (`mt_pyMD_SIiYO`) | Documented gap: in neither the build-out map nor any spec's claim (main's strand map lists it as an anchor with "structured mathematical explanation" missing). Taught inline with no claim (T6, T7, guided item). |
| Mathematical Precision | Understanding fractions, 7+ (`mt_HY8Yycu_rz`) | Met elsewhere: proposed spec 196 (math build-out); recap inline in T9 and D1. |
| Precise Maths Vocabulary | Mathematical Precision (`mt_mywsN77hGZ`) | Taught here (T9, D1-D2 before D3-D4). |
| Advanced Maths Vocabulary | Precise Maths Vocabulary (`mt_xfwv0M83mJ`) | Taught here (T10-T11, D3-D4 before D5-D7). |
| Choosing mathematical tools | Choosing the right strategy (`mt_mQcWGh02no`) | Met elsewhere: referenced by spec 130 (Shutters, main) and claimed by proposed spec 121 (draft PR #128); recap inline in T12. |
| Choosing Maths Tools | Choosing representations strategically (`mt_IwEOCN6bL1`) | Met elsewhere: as above (spec 130 main; spec 121, draft PR #128); tool cards recap it. |
| Using Mathematical Structure | Shape patterns, 7+ (`mt_FAXjFkgG6X`) | Met elsewhere: proposed spec 204 (math build-out; reassigned there from 194); recap inline in T13. |
| Order of operations, 10+ | Fractions, Decimals & Percentages (`mt_hlGKg5M7qJ`) | Met elsewhere: proposed spec 200 (math build-out); 1/8 = 12.5% recapped in T14. |
| Real-World Maths Modelling | Modelling with multiplication and fractions (`mt_K3R0yaHVcx`) | Met elsewhere: proposed spec 198 (math build-out); recap inline in T15. |
| Real-World Mathematical Modelling | Real-World Maths Modelling (`mt_8xVHooT4aI`) | Taught here (T15, F3 before F1-F2 and F4-F5). |
| Understanding fractions, 10+ | Fractions on a number line, 9+ (`mt_CUmjcE7W6c`) | Met elsewhere: proposed spec 196 (math build-out); the bar-to-sentence move is recapped inline in T18. |

Claim check, 2026-10-25: no spec on main or any draft PR (126, 128, 137-151) claims these fifteen targets. Sibling spec 192 names `mt_hImiKNiaNh` only to drop it; the build-out map now assigns it here. Sibling spec 196 drops `mt_9KmVWCuh5_`; it is claimed here at the coordinator's request. Spec 118 (draft PR #126) claims *Expressions & Equations Vocabulary*, *Solving Linear Equations*, *Ratio Notation*, *Ratio Problems* and *Constructing mathematical arguments*; this pack uses those only as material and recaps (see Builds on).

## Checks for implementation

- **Numbers script (2026-10-25):** `check205.py` (`python3 -I`), 77 checks passing: A1 320 − 4 × 50 = 120 (wrong 270, 520); A2 estimate $15, exact $14.55 (wrong 12, 8); A3 480 − 195 = 285, Pip's 385 + 195 = 580; A4 156 ÷ 12 = 13, 9 × 12 = 108 (wrong 9, 152); A5 3/5 of 40 = 24, half 12 (wrong 20, 8, 24); B1 $108 − $40 = $68; B3 36 × $2.40 = $86.40, × 0.75 = $64.80 (wrong $21.60, $86.40, $5.40); B4 60/80 = 75%, 80/60 ≈ 133%; B5 14 jars → 21 cups (wrong 15, 9.33), 14 : 21 = 2 : 3; B6 p = 12 (unique in 0-30; wrong 15, 18); C2 71 − 26 = 45; C4 odd + odd even for all pairs to 199; C5 47 × 99 = 4,653, 4,663 also near 4,700; D6 50 × 40 × 30 = 60,000 cm³ = 60 L; D7 π × 7 = 21.99114858 ≈ 22, radius 3.5; D5 3x + 5 = 11 unique x = 2; E3 4,700 − 47 = 4,653 (wrong 4,601, 4,606); E4 25 × 4 × 9 = 900 (wrong 756); E5 $8 vs $7.68; E6 3/7 of 28 = 12, 12 : 16 = 3 : 4 (wrong 21); F1 75 ÷ 8 = 9.375 → 10, 9 boats carry 72; F2 9 full crates, 3 over; F3 150 ÷ 6 × 15 = 375 (wrong 159, 2.5); F4 mean 25, 120 ÷ 25 = 4.8 → 5, four trips carry 100; F5 400 ÷ 2 × 7 = 1,400 (wrong 2,800, 200); T17 50 × 3 × 7 = 1,050 ≈ 1,000; every teach-card, guided, scene and stuck-ladder number.
- Right-answer length check: no right choice is the longest alone among the 22 three-choice items, except D1 (63 cm², where the unit is the point).
- Style check run on the companion (`style205.py`): 0 em-dashes; teach and history cards at most 30 words; prompts at most 15 words; feedback, hints and explanations at most 20 words; "wrong" absent from feedback, hints and explanations.
- Model and source lines show on every tray. Feedback never says "wrong"; reasons and chains are never marked. The calculator appears only after a written answer exists.
- Browser at 320 and 820 px: targets 44 px, tap-to-place as well as drag for tiles and the step marker; the bar, ratio table, area picture, grid and shape family each have a text equivalent ("Bar: 320 apples, split into packed 200 and left 120").

**Independent review, 2026-10-25.** Checked: every item, worked example, teach card, scene and stuck-ladder number recomputed by the reviewer's own `review204_205.py` (`python3 -I`, scratch area; 1,176 checks across specs 204 and 205, 0 failing, including brute-force uniqueness for B6, B7 and D5), distractor feedback against each distractor, the A/B/C balance (recounted 7/8/7), length giveaways, word limits, em-dashes (0 in all three files), the Marble descriptions, records and hard prerequisites for all fifteen targets, overlap with spec 118 (draft PR #126) and sibling 204, routes, cast pronouns and the Hollis rule. Changed: the Trinity-test card H3 and item F6 replaced by a non-weapons Fermi anchor (Fermi's Chicago teaching questions and Science Olympiad's Fermi Questions event, both search-checked); Scene 1's slip, B5 and E6 moved off spec 118 Case 3's reed rate and 5 : 3 nursery numbers; T8's worked example changed so it no longer gives away C3; H1 now revisits spec 204's Pólya card instead of re-introducing it; the `mt_FAXjFkgG6X` crosswalk row now points to spec 204 (reassigned); `mt_9KmVWCuh5_` claimed at the coordinator's request with T18, B7, an upstream row and a crosswalk row (37 items); the length-check claim corrected for D1.

## Review asks

**Math expert:**
1. Is the formula entry for D5 ("a rule linking quantities") a fair boundary with "equation" at this level, given that a formula is also an equation?
2. Is B4's feedback (a part of a group stays at or under 100%; a jug filled 2.5 times is 250%) the right fence against both errors?
3. Is F5's accepted range (1,000 to 2,000) a sensible "right size" band for a Fermi item, or should any answer within a factor of 2 of the model count?
4. Does C2 (the 71 − 26 slip) risk being a prerequisite gap rather than a critique task, as the research warns?

**Owner questions, with defaults:**
1. Route `#desk/problems` as a shelf inside the Keeper's Desk? *Default: yes; linked from `#desk` and listed in All places.*
2. Fifteen targets in one pack, or split justification and precision into their own pack? *Default: one pack; trays ship separately.*
3. Keep *Understanding fractions (age 10+)* here (added at review, pie-chart strand narrowed)? *Default: yes; if declined, drop T18 and B7 and return the id to the coordinator.*
4. First slice? *Default: the Plan Card with Set A and the Model Workshop's rounding panel (F1-F2).*
