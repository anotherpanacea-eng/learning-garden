# 194. Ribbon Patterns: repeats, growing patterns, sequences and every way to choose

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a math check.** Part of the [math build-out](https://github.com/anotherpanacea-eng/learning-garden/pull/154). Every child-facing line is in [the companion text](../content/194-ribbon-patterns-text.md); sources and open checks are in the [source audit](../source-audits/194-ribbon-patterns.md).

**Commissioning boundary:** a proposal only. Select a bounded first slice after independent content, model and save review; the five benches do not commission each other. All Act and chapter links are future adapters to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (draft PR #127). Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter. The existing Post Office ribbon gate ([specs 25](25-sky-post.md) and [26](26-bramble-changing-challenges.md)) and Bramble's Games Table ([specs 131](131-ribbon-rows.md), [132](132-three-row-ribbons.md)) are untouched. **Fact-check status:** history facts checked against search excerpts on 2026-10-25 (fetches blocked); no `[check]` item is in child text. The math is standard and still needs the math check.

## Purpose

Patterns and sequences have one partial home in the garden: an authored pattern task and Garden Paving's single growing square ([spec 96](96-garden-paving.md)), both anchored on *Shape patterns* (`mt_A-FyLLLLzy`). Proposed [spec 125](https://github.com/anotherpanacea-eng/learning-garden/pull/128) teaches the smallest repeating unit in borders. Nobody teaches **predicting from a pattern**, **saying and testing a rule**, **term-to-term and position-to-term rules**, **the nth term** or **listing every possibility**. This pack takes eight untouched Mathematical Thinking and Algebra topics there.

A child comes to understand that a repeating pattern is known by its repeating part, so a far term can be found by counting whole parts; swapping two groups keeps the amount; a growing pattern is described by a start and what each step adds, and a rule should be tested on a fresh case; a table's column pattern can check an answer; two rules compared pair by pair can show a "twice" relationship that plots as a straight line through (0, 0); a linear sequence is a start and a signed step, which may be a decimal or cross zero; a position-to-term rule gives any term directly, its multiplier is the common difference because each step adds that amount, and its constant is the zeroth term; a number is in a sequence only if its position comes out whole; a systematic list holds one choice still, and a grid shows the total is a product and the list is complete.

**Builds on, never re-teaches:** spec 125's smallest repeating unit (here: predicting far terms and mending a broken row); spec 96's growing square (here: a full rule and nth term); [spec 53](53-bundle-exchange.md)'s teen numbers; sibling spec 190's times-table patterns and square numbers (here: a table pattern used as a check, squares only as a "neither" sequence); sibling spec 193's substitution (here: only n into a position rule); sibling spec 187's coordinate grid (here: plotting pairs only); [spec 121](https://github.com/anotherpanacea-eng/learning-garden/pull/128)'s *Generalising with repeated reasoning* in the games (a different topic id). **Not targeted:** *Shape patterns* (`mt_DW2D1c0fKx`) and *Shape patterns (age 7+)* (`mt_FAXjFkgG6X`), dropped after reading their pinned descriptions and research: despite the names, both ask for using structure in commutativity, place-value columns, multiplication fact families and property-based shape classification, with no sequence work. The build-out map first assigned both to this pack; it now assigns both to sibling spec 204, and this pack's +10 and table work makes no claim on them.

## Place and story

**Host:** the **Ribbon Gate**, route `#gate/patterns`, at the meadow edge where Bramble keeps her grandmother's gate. Linked from the Post Office's ribbon gate encounter, the Games Table (`#orchard/games/rows`) and the Riddles in the Hedge end card ([spec 94](94-riddles-in-the-hedge.md)). Open from the start; no bench requires another.

| Act and chapter (future adapters to spec 120) | Beat (full text in the companion) | Job depths |
| --- | --- | --- |
| I, ch. 2 *deliver and explain* | The storm untied Bramble's gate; the magpie tied it back with one ribbon wrong. | Sprout: find the breaker, say what comes next. Seedling: the 10th ribbon. |
| II, ch. 3 *Ember's birthday* | Bramble ties ribbon squares on the café chairs ("each new square needs three more"); Pip tries every hat-and-ribbon outfit and repeats one. She says her grandmother showed her how to list. | Seedling: next step, list outfits. Sapling: step 10, rule in words, the grid. |
| VI, ch. 2 *compare routes and keep a plan*; ending | Bramble ties ribbons on posts 1, 4, 7, 10 of the river path. Will post 100 get one? | Sapling: the next posts. Keeper's Desk: 3n − 2 = 100, the 34th ribbon. |

One shared scene per chapter; any job is a whole contribution; nothing locks a story place. The town, gate, magpie and Bramble's grandmother are fiction, labeled apart from math, history and models. The old Keeper is not named (Hollis rule); no scene here mentions the Keeper.

## The knowledge

**Repeating patterns.** A repeating pattern has a **repeating part** (unit of repeat): red, blue; red, red, blue; red, gold, blue. Say it aloud, find the part, then continue. Continuing by copying the last item is the top error. A far term is found by counting whole parts: in red, gold, blue, 9 ribbons is 3 parts, so the 10th is red (doubling the 5th, gold, is wrong). In 12 ribbons of red, red, blue there are 4 parts, so 4 blues. A broken pattern is found by saying the part along the row. *Swap the groups* (Sprout): moving a group of red bows and a group of blue bows past each other adds and removes nothing, so the amount is the same (the early-commutativity strand of `mt_uG2mjHFOlO`, in pictures).

**Growing patterns and rules in words.** Ribbon squares in a row share sides: 4, 7, 10, 13 ribbons for 1-4 squares. Each new square adds 3. A good rule names a start and a step ("start with 4, each new square adds 3"); "it goes up" cannot rebuild the pattern, and "add 4" builds a different one. Step 10 by structure: one ribbon on the left, then 3 per square, 1 + 3 × 10 = 31 (not 40, which forgets shared sides; not 32, which doubles step 5). The ladder's easier pattern: ribbon triangles, 3, 5, 7 (2n + 1).

**Testing a rule.** A rule seen in two cases may fail. Taking 10 from 47, 57, 67 drops the tens digit by 1; test it on 82 before trusting it. Counting in 5s, the last digit goes 5, 0, 5, 0. 1, 2, 4 fits doubling (next 8) **and** "add 1, then 2, then 3" (next 7): three terms cannot choose between two rules, so the honest answer is "we need the rule".

**Table patterns.** Posts to ribbons, 4 per post: 4, 8, 12, 16, 20. Every 4s number is even, which checks answers (Pip's 27 for 7 posts must be off; it is 28). The reverse fails: 30 is even but not in the 4s (28, 32). A hard fact is two known facts: 8 × 7 = 8 × 5 + 8 × 2 = 40 + 16 = 56 (not 8 × 5 + 2 = 42). A growing rule in tens: the magpie's stash 120, 170, 220, adding 50; the 6th number is 370 (five steps; 320 is the 5th; 420 adds six 50s).

**Two rules.** Both rules are given; the child generates, lines up corresponding terms and compares. Bramble: start 0, add 3 (0, 3, 6, 9); magpie: start 0, add 6 (0, 6, 12, 18). Each magpie term is **twice** Bramble's, because its step is twice hers and both start at 0. "Always 3 more" fits only the first pair (the differences grow 3, 6, 9). Pairs (Bramble's, magpie's) plot across then up: (3, 6), (6, 12), (9, 18), on a straight line through (0, 0). If the magpie started at 2, "twice" would fail (2 vs 0, 8 vs 3).

**Linear sequences.** A term-to-term rule is a start and a signed step: 2.5, 4.0, 5.5, 7.0, 8.5 (start 2.5, add 1.5); 7, 4, 1, −2 (start 7, subtract 3), on a number line with zero in the middle so the step carries on past zero. "Subtract 2" alone does not rebuild 5, 3, 1, −1 (9, 7, 5 also subtracts 2). A decreasing sequence is adding a negative step, the same structure.

**Position-to-term rules and the nth term.** A position rule turns the position n into the term: 3n − 2 gives 1, 4, 7 (reading it as "start at 3, subtract 2" gives 3, 1, −1). The ribbon squares are 3n + 1 **because** each square adds 3, so n squares add n lots of 3, plus the 1 ribbon there before the first square: the multiplier is the common difference and the constant is the **zeroth term**, one step before the first (4 − 3 = 1). For 3, 7, 11, 15: step 4, so 4n gives 4, 8, 12, 16; each term is 1 less, so 4n − 1 (zeroth term 3 − 4 = −1; not n + 4, not 4n + 3). Always check by putting in n = 1, 2, 3. Far terms come straight from the rule; the 10th is never twice the 5th unless the sequence starts from 0.

**Is it in the sequence?** Set the rule equal to the number: 4n − 1 = 99 gives n = 25, so 99 is the 25th term; 4n − 1 = 100 gives n = 25.25, not a whole position, so 100 is not in. "Goes up by 4" is not "multiples of 4". Scene 3: posts 3n − 2 = 100 gives n = 34, so post 100 gets the 34th ribbon; post 50 gives n = 52 ÷ 3, not whole.

**Not every sequence adds the same (Keeper's Desk preview).** Write differences and multipliers: 3, 6, 12, 24 multiplies by 2 (geometric); 1, 4, 9, 16, 25 has differences 3, 5, 7, 9 and changing multipliers (neither: the square numbers, sibling 190's topic). Triangular numbers 1, 3, 6, 10 and the rhythm counts 1, 2, 3, 5, 8 are shown as patterns with their own rules. No nth-term work on them.

**Systematic listing.** Hold one choice still, run through every other choice, then move on. Three hats and two ribbons: 6 outfits (not 5 = 3 + 2; not 3, one ribbon per hat). A grid of 3 rows and 4 columns holds 3 × 4 = 12, so the list is complete when the grid is full, and a list of 10 is missing exactly 2. Keeper's Desk: choosing two **different** colors from four, where order does not matter: 3 + 2 + 1 = 6 (not 12, both orders; not 16, the grid with same-color pairs). Rhythms of short (1 beat) and long (2 beats) beats totaling 5: sorted by number of longs, 1 + 4 + 3 = 8; 4 beats give 5; 6 beats give 8 + 5 = 13, because a rhythm ends short (rest: 5 beats) or long (rest: 4 beats).

**Real anchors (see audit).**
- **Counting rhythms in India.** Sanskrit prosody counted the meters that can be made from light and heavy syllables, a heavy one lasting two light ones; the counts for each total follow the rule "add the two before". Gopala (before 1135) and Hemachandra (about 1150) are credited with the numbers 1, 2, 3, 5, 8, 13, 21 (the explicit list rests on Knuth's account; child text says only that Hemachandra gave the rule and that the counts run 1, 2, 3, 5, 8, 13, 21); Virahanka stated the rule earlier (usually dated 6th-8th century CE), and the setting goes back to Pingala's *Chandahshastra*. Child text names Hemachandra and Gopala only, with "about 1150".
- **Fibonacci's rabbits.** Leonardo of Pisa's *Liber Abaci* (1202), chapter 12, asks how many pairs one pair produces in a year when each grown pair has a new pair monthly and none die; the monthly totals run 2, 3, 5, ... 233, 377, and the book gives 377. The card says the rule is pretend, and that the numbers are the ones India's poets listed.
- **The number triangle.** Yang Hui's 13th-century work (1261 per one secondary source, `[check]`) shows the triangle and credits the 11th-century Jia Xian, whose books are lost; Zhu Shijie's *Jade Mirror of the Four Unknowns* (1303) draws it as an "ancient" method; al-Karaji (about 1000, in a lost work, later reproduced by Omar Khayyam) described it in the Islamic world; Europe named it after Blaise Pascal. Child text says "in the 1200s", names Yang Hui and Jia Xian, and links the row 1, 4, 6, 4, 1 to E5's six bows.

## The lesson

Jane's **teach → guided → practice** order on every bench: a teach card with a step-revealed worked example, a guided first item with 3 visible steps, then practice.

| Bench | Teach | Guided | Practice |
| --- | --- | --- | --- |
| Gate Row | T1-T3 | Red, blue, red, blue, red (3 steps) | Set A |
| Growing Ribbons | T4-T6 | Why 7, not 8? (3 steps) | Set B |
| Magpie's Table | T7-T10 | 4 ribbons on 5 posts (3 steps) | Set C |
| Number Ribbon | T11-T14, T17 | 7, 4, 1, next? (3 steps) | Set D |
| Every Way to Choose | T15, T16, H1-H3 | Three hats, two ribbons (3 steps) | Set E |

**"I'm stuck" ladder** on every item: (1) the hint; (2) an easier worked case plus how to start this one (twelve families in the companion); (3) **Skip for now**, no penalty, nothing recorded against the child.

**Contrasts:** copy the last vs read the part; double the place vs count whole parts; moved vs added; 4 per square vs 3 new; "goes up" vs start and step; fits twice vs tested; every 4s is even vs every even is 4s; 8 × 5 + 2 vs 8 × 5 + 8 × 2; "3 more" vs "twice"; (x, y) vs (y, x); stop at zero vs keep stepping; first term vs zeroth term; step as the whole rule vs step times n; goes up by 4 vs multiples of 4; add the choices vs multiply; both orders vs one pair.

**Top misconceptions designed against:** continuing by copying the last item; a far term by doubling the position; moving changes the amount; the first term is the step; a vague rule; trusting a rule from two cases; reversing a pattern ("every even is a 4s number"); splitting a fact wrongly; describing two rules additively; comparing within a row; reversing an ordered pair; sequences stop at zero; reading −2 as 2; a step with no start; reading 3n − 2 as term-to-term; using the step as the whole nth term; using the first term as the constant; "goes up by 4" means multiples of 4; rounding a position; classifying by "it goes up"; adding the options instead of multiplying; stopping a list before it is complete; counting both orders of a pair.

## The game or activity

**(a) The Gate Row, model `gate-row-v1`.** A long gate with bars; the child picks a ribbon color and ties it on the next bar; **Show the part** brackets the repeating unit. **Mend mode**: tap the ribbon that breaks the pattern. **Swap the groups** (Sprout): two bow groups slide past each other, nothing added. *A made-up model: units of 2-4 ribbons, every row authored.* Rows (R red, B blue, G gold): RB; RRB; RGB; mend row R B R B B B R B (5th ribbon).

**(b) Growing Ribbons, model `growing-ribbons-v1`.** **Next step** adds a square; **Show what's new** highlights the 3 new ribbons; **Make a table** fills step and ribbons; **Say the rule** fills "Start with ___. Each new step adds ___." *A made-up model: squares in a row share a side; ribbons never run out.* Patterns: squares 3n + 1 (4, 7, 10, 13 ... 31 at step 10); triangles 2n + 1 (3, 5, 7) for the ladder. A rule-test strip holds the 5s and −10 cases.

**(c) The Magpie's Table, model `magpie-table-v1`.** Posts/ribbons table for 4 and 8 per post; **Split the posts** draws 7 posts as 5 and 2 with their ribbons; column patterns (all even) highlighted on request. **Two rules** mode: two given rules generate side by side in a two-row table, corresponding columns outlined; **Plot the pairs** places (Bramble, magpie) on a first-quadrant grid, across then up, points not joined. *A made-up model: each post gets the same number of ribbons.* Data: 4s to 40; 8 × 7 split; stash 120 + 50 per step; rules 0 + 3k and 0 + 6k for k = 0-5; a contrast rule 2 + 6k.

**(d) The Number Ribbon, model `number-ribbon-v1`.** A number line from −20 to 40, zero in the middle; **Add a step** lays equal hops with a "+d" or "−d" arrow chain; **Show differences** writes differences (and at Keeper's Desk multipliers) under any sequence; **Position table** shows n = 0-4 with an explicit zeroth column; **Test a number** solves rule = target and says whether n is whole. *A made-up model: steps in halves and tenths, positions 1-100.* Sequences: 2.5 + 1.5; 7 − 3; 5 − 2; 3n − 2; 3n + 1; 4n − 1; 3 × 2ⁿ⁻¹; squares; triangular numbers.

**(e) Every Way to Choose, model `every-way-v1`.** Bramble's hat box: hats down, ribbons across; **Hold this one still** locks a hat while the child runs through ribbons; **Show the grid** and **Show the tree** draw the same list two ways and mark empties and repeats. Keeper's Desk adds a **pair picker** (two different colors, order ignored) and the **rhythm strip** (short = 1 beat, long = 2), sorted by number of long beats. *A made-up model: any hat goes with any ribbon.* Data: 3 hats × 2 ribbons; 3 knots × 4 colors; 4 colors choose 2; rhythms of 4, 5 and 6 beats.

No timers, scores, streaks, medals or locks. Every bench is open from the first visit.

## Problem sets

Five sets, **34 items**, full text in the companion:

| Set | Depth | Items | Formats |
| --- | --- | --- | --- |
| A. The Gate Row | Sprout (A1-A4), Seedling (A5, A6) | 6 | 3-choice, tap, number |
| B. Growing Ribbons and rules in words | Seedling (B1-B3), Sapling (B4-B6) | 6 | 3-choice, number |
| C. The Magpie's Table and two rules | Seedling (C1, C2), Sapling (C3-C6) | 6 | 3-choice, number |
| D. The Number Ribbon | Sapling (D1-D3), Keeper's Desk (D4-D8) | 8 | number with worked steps, 3-choice |
| E. Every Way to Choose | Seedling (E1, E2), Sapling (E3, E4), Keeper's Desk (E5-E8) | 8 | 3-choice, order, number, true / not true from this source, *say why* |

Sprout items use pictures and color words, no numbers. Over the 20 three-choice items the right answer sits at A seven times, B seven times and C six times. Distractors that withhold more than the evidence requires: B6's "only one rule can be right" pair, C2's "nobody can tell without counting" and E4's "nobody can tell". *Say why* (E8) is spoken to a grown-up and never stored or graded.

## Saved work

Optional root `ribbonPatterns` per explorer, absent until a first explicit action.

```
ribbonPatterns: {
  version: 1,
  gate:    [{ source, rowId, tied: [colorCode], mended: barIndex|null, at }],      // latest 12
  growing: { [patternId]: { source, steps: 1-10, rule: { start, step }|null, at } },
  tables:  { [tableId]: { source, filled: { [row]: value }, pairs: [[x, y]], at } },
  ribbon:  { [seqId]: { source, terms: [number], tested: [{ value, inSeq }], at } },
  lists:   { [listId]: { source, order: [[choiceA, choiceB]], at } },
  answers: { [itemId]: { source, choice | value | order | tap | marks, support: ['hint'|'example'|'skip'], at } }
}
```

`source` freezes the model version and the item's choices and order. Codes and numbers only; numbers are finite, within each model's stated range (steps 1-10, values −20 to 999, positions 1-100), validated on read and never recomputed. Never rewrite saved results on load; an entry whose model version is unknown is shown as kept, not re-graded. An unreadable entry stays raw and exportable while the rest stays open. Support stays separate from answers; no mastery flag. Shared export, import, reset and explorer switching. *Say why* answers and the spoken rule are never stored.

## Curriculum fit

**Strands:** **M7** spotting, generalising and testing patterns; **M4** sequences, nth term, systematic listing; **M2** table patterns and derived facts; **M5** plotting pairs (use only); **H1** real documents as sources. Act families: I, II, VI.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Continue and mend repeating patterns by their part; find far terms; notice swapped groups keep the amount; describe growing patterns with a start and step and test the rule; use table patterns as checks and derive facts; compare two given rules multiplicatively and plot pairs; generate linear sequences with decimal and negative steps; use and derive position-to-term rules with the multiplier as the common difference; test membership; list systematically and argue completeness. |
| Teaching encounter | T1-T17 with step-revealed worked examples; a guided first item per bench. |
| Contrast | As listed in The lesson. |
| Supported practice | Show the part; Show what's new; Split the posts; outlined corresponding columns; differences row; zeroth column; Hold this one still; the "I'm stuck" ladder. |
| New application | The 10th ribbon; step 10; Pip's 27; the magpie at start 2; post 100; 99 and 100; the six bows; 6-beat rhythms. |
| Purposeful revisit | Spec 125 (repeating unit); spec 96 (growing square); spec 53 (teen numbers); siblings 187 (grid), 190 (tables, squares), 193 (substitution); spec 121 (repeated reasoning in games). |
| Data boundary | Ribbons tied, steps, rules as numbers, table values, pairs, terms, list orders, choices and support codes, all local. No timing, free text or location. |

## Upstream check

Refreshed upstreams: Jane `0ec55f7e083976e6fcc3977fca460b1f5e199d91` and Marble `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (both 2026-10-24). Ids confirmed in the pinned `curriculum/marble/topics.json`.

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Spotting mathematical patterns (`mt_uG2mjHFOlO`) | Arrange experiences so the child notices; predict and justify, then a deliberately broken pattern; swap groups and ask "still the same?"; noticing over speed. Gate Row, Mend mode, Swap the groups; A1-A4. The teen-number strand is met by spec 53, not re-taught. |
| Generalising Patterns (`mt_fZTn0W_iZR`) | State a rule in the child's words and test it on a fresh case; −10 drops the tens digit; +5 alternates the ones digit; known fact beside the derived one. T6 and the rule-test strip; B3, B6. Near doubles are not re-taught (its soft prerequisite, deriving facts within 20, lives in addition packs). |
| Extending Table Patterns (`mt_2jbUekyTu4`) | Derive from anchor facts with an array split; a pattern as a reasonableness check; probe the reverse ("every even a 4s?"); describe a growing rule like "add 50" and predict. Split the posts; T7, T8; C1-C4. |
| Linear number sequences (`mt_hBZwbst0ow`) | Start and signed step; decreasing as adding a negative; zero-central number line; decimal steps; predict a far term. Number Ribbon; T11; D1-D3. |
| Number Pattern Relationships (`mt_fxPtngwUfz`) | Both rules given; two-row table compared column by column; "twice", with why; contrast additive; (x, y) order; points on a line through the origin; the start-at-0 caveat. Two rules mode; T9, T10; C5, C6. |
| Generating Sequences (`mt_yXO7lQ9Yn7`) | Same sequence two ways; substitute n = 1, 2, 3; differences and ratios rows to classify; "multiples of 3" vs "increases by 3"; varied diet. Position table; T12, T17; D4, D8. |
| Nth-Term Rules (`mt_HRKzwEQJgO`) | Build from a growing pattern so the multiplier is the repeated group; zeroth term; "as n goes up by one, the term goes up by d"; always check n = 1, 2, 3; points not joined; membership by solving with whole n. Growing Ribbons into Number Ribbon; T13, T14; B5, D5-D7; Scene 3. |
| Systematic Listing (`mt_gu0NPDvlhY`) | Fixed order holding one choice; grid or tree; "how do you know you've found them all?"; product, not sum; repair random lists. Every Way to Choose; T15, T16; E1-E5. |

**Jane:** adopted teach → guided → practice, the three-step "I'm stuck" ladder, short second-person prompts, three-option choices with misconception-tagged distractors, step-revealed worked examples and a glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, points. No Jane code or text copied.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| Spotting mathematical patterns | none listed | n/a |
| Generalising Patterns | Finding efficient methods (`mt_RFeVlw0QvX`) | Met elsewhere: proposed spec 204 (math build-out). Recap inline only (T3, A6: count in whole parts instead of ones); no claim. |
| Extending Table Patterns | Generalising Patterns (`mt_fZTn0W_iZR`) | Taught here (Growing Ribbons before the Magpie's Table). |
| Linear number sequences | Shape patterns (`mt_A-FyLLLLzy`) | Met elsewhere, partly: existing authored pattern task (`#checkin/patterns`) and spec 96 Garden Paving. Supported inline by Growing Ribbons; no claim. |
| Number Pattern Relationships | Shape patterns (`mt_A-FyLLLLzy`) | As above. |
| Number Pattern Relationships | Coordinates (age 8+) (`mt_i5_HnoFOYw`) | Met elsewhere: sibling spec 187 (math build-out, draft). T10 recaps across-then-up. Documented gap if 187 does not ship. |
| Generating Sequences | Linear number sequences (`mt_hBZwbst0ow`) | Taught here (T11 before T12). |
| Nth-Term Rules | Generating Sequences (`mt_yXO7lQ9Yn7`) | Taught here (T12 before T13). |
| Systematic Listing | none listed (Long multiplication is soft) | n/a |

Claim check, 2026-10-25: no spec on main or any draft PR (126, 128, 137-151) claims these eight targets; spec 125's *Patterns & Sequences* (`mt_WXW0hjNhph`) and spec 121's *Generalising with repeated reasoning* (`mt_iyovKgZC1q`) are different ids.

## Checks for implementation

- **Numbers script (2026-10-25):** `check194.py` (`python3 -I`), 86 checks passing: gate rows (A1, A2 blue; A3 5th bar; A5 10th red, 5th gold; A6 4 blues; 12th blue); ribbon squares counted as unit-square edges equal 3n + 1 for n = 1-20 (4, 7, 10, 13; step 10 = 31, wrong 40 and 32; B2 wrongs 14, 20); triangles 2n + 1; −10 cases 37, 47, 57, 72; 1, 2, 4 fits both 8 and 7; 4s all even, 30 not in, 27 odd vs 28; 8 × 5 + 8 × 2 = 56 (wrong 42, 15); stash 6th = 370 (wrong 320, 420); 6k = 2 × 3k with differences 3, 6, 9, (9, 18), the start-2 contrast fails; 2.5 + 1.5 steps 7.0, 8.5 (wrong 6.5, 5.6); 7, 4, 1, −2; 5, 3, 1, −1 vs 9, 7, 5; 3n − 2 = 1, 4, 7 vs misread 3, 1, −1; 3n + 1 zeroth term 1; 4n − 1 with zeroth term −1, 99 the 25th, 100 at 25.25; squares' differences 3, 5, 7, 9; geometric 3, 6, 12, 24; triangular 1, 3, 6, 10, 15; post 100 the 34th, post 50 not; outfits 6 (wrong 5), 12 (wrong 7), list order; 4 choose 2 = 6 (wrong 12, 16); rhythms by brute force 1, 2, 3, 5, 8, 13, 21, 5 beats = 1 + 4 + 3, 6 beats = 8 + 5 with 8 ending short; rabbits reach 377 after 12 months; triangle row 1, 4, 6, 4, 1. Uniqueness: A3's broken bar, A5, the rhythm and pair counts are brute-forced.
- Every sequence item has one intended answer under its stated rule; B6 is the one item where two rules fit, and its right answer says so. Plotted points are never joined. Sprout items show no numerals; feedback never says "wrong". Model lines show on every bench.
- Style check run on the companion: no em-dashes; teach cards at most 30 words; prompts at most 15 words; feedback and explanations at most 20 words; short scenes at most 30 words; no "not X, but Y".
- Browser at 320 and 820 px: targets 44 px, tap-to-place as well as drag; colors always named in text (red, blue, gold) for colorblind explorers; every grid, number line and tree has a text equivalent ("Point (9, 18): across 9, up 18").
- Independent review, 2026-10-25: a separate reviewer recomputed every pattern, sequence, membership test, listing count and history number with an independent `python3 -I` script (119 checks across specs 192-195, all passing, including A3's single breaker, the rhythm counts by recursion, 4 choose 2 and the rabbits reaching 377), recounted the three-choice balance (A 7, B 7, C 6), reran the style check (0 em-dashes in all three files; word limits met) and checked the Marble records and hard prerequisites. Changed: `mt_DW2D1c0fKx` and `mt_FAXjFkgG6X` recorded as now owned by sibling spec 204 (owner question removed); A1, A2 and A5 rebalanced so the short right answer is no giveaway; Scene 1's math note relabeled "A true thing about math"; "wrong" removed from Scene 1; E5's prompt now asks its question; H1 and E7 softened to what the sources support (Hemachandra gave the rule; the explicit list rests on one account); the off-screen activity no longer suggests beads and buttons. No math errors found.

## Review asks

**Subject expert:**
1. Is "the constant is the zeroth term" the right framing for this audience, beside "check n = 1"?
2. Is B6 (1, 2, 4 fits two rules) fair, and should it appear before or after the nth term?
3. Is choosing two colors from four (E5) a fair Keeper's Desk extension of a two-category topic, or does it belong to a combinations pack?
4. Are the rhythm-count and Fibonacci cards fair to the Indian sources, given the uncertain dating of Pingala and Virahanka?

**Owner questions, with defaults:**
1. Route `#gate/patterns` as a new meadow-edge place, linked from the Post Office gate? *Default: yes.*
2. First slice? *Default: Growing Ribbons with Set B, then the Number Ribbon with Set D.*
3. Name the Act VI ribbon colors (blue, gold, red) on the Number Ribbon's posts as spec 120's ending does? *Default: yes, blue on the river path only.*
