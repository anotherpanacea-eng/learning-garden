# Math build-out: thirty-two packs

Proposal, 2026-10-25. **Writing only:** specs 181 to 212, each with a companion file holding every child-facing line (`docs/content/NNN-*-text.md`) and a source audit (`docs/source-audits/NNN-*.md`). Nothing here is built, scheduled or cleared. Each spec has had one independent review and a separate math recheck, and still needs a subject expert's math check; the owner chooses a first slice before Codex builds anything. Story links are future adapters to draft [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (the Keeper of the Ways); every pack also plays standalone from an open destination. This is the math companion to the [history and science build-out](history-and-science-buildout.md) (specs 133-180). The packs were written while PRs #126-#128 and #137-#151 were still drafts, so their text often says "draft PR #N"; all of those merged as proposed documentation on 2026-10-25, and the references hold.

## Why

The owner asked for the same treatment for math: "Much is built. Write the rest!" On the pinned Marble graph (`96a7933`), there are **503 Mathematics topics**. **148** already have a spec on main or in a draft PR, or a declared reference in `curriculum/topic-coverage.csv`. The other **355** had neither. Early number and the café's fraction benches are well served; angles, algebra, fraction operations, decimals past hundredths, percent, ratio, probability, data and the older problem-solving practices were nearly empty.

| Domain | Pinned topics | With a reference today | Untouched before this | Packs here |
| --- | ---: | ---: | ---: | --- |
| Geometry | 69 | 7 | 51 | 181, 182, 183, 184, 186, 187, 206 |
| Measurement | 68 | 12 | 45 | 184, 185, 186, 203, 207, 208, 209 (with 196, 199, 201, 212) |
| Fractions | 67 | 16 | 48 | 196, 197, 198 (with 186, 199, 200) |
| Multiplication & Division | 57 | 11 | 32 | 190, 191, 192 (with 189, 196, 212) |
| Addition & Subtraction | 52 | 8 | 40 | 210, 212 (with 189) |
| Number Representation & Place Value | 52 | 5 | 40 | 188, 189, 199, 211 (with 190, 196, 210) |
| Mathematical Thinking | 48 | 2 | 39 | 204, 205 (with 190, 194, 196, 198, 200, 209) |
| Algebra | 25 | 0 | 20 | 192, 193, 194, 195 (with 187) |
| Ratio & Proportion | 18 | 1 | 14 | 201 (with 196, 200, 206) |
| Data & Statistics | 18 | 3 | 9 | 203 (with 196) |
| Probability | 15 | 1 | 11 | 202 |
| Counting & Cardinality | 14 | 2 | 6 | 210, 211 (with 190) |

Every one of the 355 was assigned to exactly one pack. After review, **365 topic ids are targets**, each claimed by exactly one spec: 354 of the 355, plus 11 more that research showed a pack teaches in full and that nothing else claims. The target ids are candidates for a reviewed reference, never coverage claims. No atlas, coverage file, route table or Marble pin changes in this proposal.

## The packs

About 1,100 problem items across the 32 packs, each pack with four to seven sets from Sprout to Keeper's Desk.

| Spec | Pack | Home | What the child does | Strands |
| --- | --- | --- | --- | --- |
| [181](specs/181-turning-tower.md) | **The Turning Tower** | `#mill/angles` | Angles as turns and as corners: open and close a sail hinge, name and sort angles, estimate, then read a two-scale protractor; reflex angles; first constructions at Keeper's Desk. | M5 |
| [182](specs/182-angle-rules.md) | **The Truss Yard** | `#workshop/truss` | Angles you can work out without measuring: on a line, around a point, in triangles and quadrilaterals, parallel beams; reason tiles on a Chase Board; congruent trusses at Keeper's Desk. | M5, M7 |
| [183](specs/183-stamp-drawer.md) | **The Stamp Drawer** | `#post/stamps` | Dot's first town stamps: sort 2-D shapes by what they have, the quadrilateral family tree (trapezoids inclusive), marks and letter names, turns of a shape, drawing a triangle to order. | M5 |
| [184](specs/184-grain-loft.md) | **The Grain Loft** | `#mill/loft` | Solids, faces, edges and vertices; sorting by rule; nets and slices; volume by layers of cubes, then base area times height. | M5 |
| [185](specs/185-fences-and-plots.md) | **Fences and Plots** | `#regrow/plots` | Re-pegging the allotments after the storm: area as squares, rows times columns, compound plots, perimeter against area, estimating a curved pond. | M5, M2 |
| [186](specs/186-wheel-and-stones.md) | **The Wheel and the Stones** | `#mill/wheel` | Area past the rectangle: triangles, parallelograms and trapezoids, fraction-length sides, the circle and pi, the millstone as a cylinder. | M5, M3, H1 |
| [187](specs/187-grid-and-compass.md) | **Grid and Compass** | `#post/floor-map` | Dot's chalk floor map: position words, turns, grid routes, coordinates in one and then four quadrants, slides, flips and turns of shapes. | M5, M4 |
| [188](specs/188-long-count.md) | **The Long Count** | `#library/ledger` | Big numbers in Wren's town ledger: count, read, write and compare to millions, place value of each digit, rounding, Roman numerals. | M1, H1 |
| [189](specs/189-below-zero.md) | **Below Zero** | `#mill/post` | The flood post reads below zero in a dry summer: negatives in context, intervals across zero, signed adding and taking away, absolute value, sign rules at Keeper's Desk. | M1, M5 |
| [190](specs/190-planting-rows.md) | **Planting Rows** | `#orchard/planting` | Planting in equal rows: factors, multiples, primes, square and cube numbers, common factors and multiples. | M2 |
| [191](specs/191-long-orders.md) | **Long Orders** | `#numbers/long` | The river exchange's big orders: times and divide by 10s, written multiplication and division with remainders, lattice and Napier methods as history. | M2, H1 |
| [192](specs/192-order-of-the-day.md) | **The Order of the Day** | `#numbers/sentences` | The baker's order slips: what a number sentence says, brackets, the agreed order of operations, powers and roots at Keeper's Desk. | M2, M4 |
| [193](specs/193-letters-for-numbers.md) | **Letters for Numbers** | `#library/algebra` | Rules in words become formulas: substitution, like terms, single brackets and factoring, which pairs of numbers fit. | M4 |
| [194](specs/194-ribbon-patterns.md) | **Ribbon Patterns** | `#gate/patterns` | Bramble's gate ribbons: repeating units, growing patterns, saying and testing a rule, the nth term, and counting every way to choose. | M4, M7 |
| [195](specs/195-lines-and-graphs.md) | **Lines and Graphs** | `#library/graphs` | The Gazette's graph desk: plotting straight lines, gradient and crossing points, two lines at once, double brackets and the U-shaped graph. | M4, M6 |
| [196](specs/196-fair-shares.md) | **Fair Shares** | `#cafe/pies` | The Pie Counter: fractions as numbers on a line, comparing and ordering, fractions of a set and of an amount, fractions greater than one. | M3 |
| [197](specs/197-joining-fractions.md) | **Joining Fractions** | `#workshop/ropewalk` | Splicing ropes and ribbons: equivalent fractions by any factor, simplest form, mixed numbers, adding and subtracting with a common cut. | M3, M5 |
| [198](specs/198-parts-of-parts.md) | **Parts of Parts** | `#cafe/scaling` | The Scaling Bench: fractional batches, a part of a part, sharing a share, how many fit, multiplication as scaling. | M3 |
| [199](specs/199-decimal-scales.md) | **Decimal Scales** | `#numbers/decimals` | Nuria's weighing landing: tenths to thousandths, comparing and rounding, decimal arithmetic, number sets and why the square root of 2 never ends. | M3, M1 |
| [200](specs/200-out-of-a-hundred.md) | **Out of a Hundred** | `#library/percent` | Percent as out of a hundred, three names for one amount, percent of an amount, change and reverse percent, and honest percent claims in the Gazette. | M3, M6, E3 |
| [201](specs/201-mixing-and-matching.md) | **Mixing and Matching** | `#studio/mixing` | The Sign Painter's mixing table: ratio, scaling a mix, proportion, unit rates and converting between units. | M3, M5 |
| [202](specs/202-chance-scale.md) | **The Chance Window** | `#numbers/chance` | Likelihood words, the 0-to-1 line, equally likely outcomes, counting with tables and circles, and how likely a big flood is from Hollis's ledger. | M6 |
| [203](specs/203-reading-the-record.md) | **Reading the Record** | `#mill/records` | The flood record room: sorting and tallying, tables and timetables, bar, line and pie charts, line plots in eighths, comparing two sets, scatter graphs. | M6, H1 |
| [204](specs/204-first-problems.md) | **First Problems** | `#garden/puzzles` | Pip's puzzle basket for the youngest: what we know and want, drawing it, choosing a tool, telling a story for a sum, two-step plans, shape patterns. | M7 |
| [205](specs/205-hard-problems.md) | **The Problem Shelf** | `#desk/problems` | Multi-step town problems at Keeper's Desk: plan, justify, be precise, choose tools, use structure, model, estimate (Fermi questions), move between representations. | M7, E3 |
| [206](specs/206-surveyors-triangle.md) | **The Surveyor's Triangle** | `#workshop/survey` | Similar shapes, scale factor, Pythagoras by tiles, and first trigonometry with a straw clinometer. | M5, M3 |
| [207](specs/207-bells-and-calendars.md) | **Bells and Calendars** | `#tower/clock` | The bell tower's clock room: order of events, duration, the calendar and leap years, the clock to the minute, a.m. and p.m., 24-hour time, timetables. | M5, H1 |
| [208](specs/208-measuring-walk.md) | **The Measuring Walk** | `#field/measure` | An on-screen walk through the village: comparing lengths and weights directly, then with units, picking a tool, and good guesses with benchmarks. | M5 |
| [209](specs/209-market-till.md) | **Market Till** | `#cafe/till` | Dollars and cents at the café till: bills and coins, adding prices, change by counting on, estimating, best buys. Everything in integer cents. | L1, M3 |
| [210](specs/210-pairs-and-bonds.md) | **Pairs and Bonds** | `#garden/pond` | Matching and counting ducks and stones, partners of five and ten, one more and one less, and "=" as "the same as". | M1 |
| [211](specs/211-hundreds-house.md) | **The Hundreds House** | `#numbers/storehouse` | Seeds, packets of ten and boxes of a hundred: place value to 1000, the empty place, counting on and back, comparing three-digit numbers. | M1 |
| [212](specs/212-quick-sums.md) | **Quick Sums** | `#numbers/bridge` | The footbridge crossings ledger: mental moves (tens, bridging, counting up, compensation), column methods past three digits, checking. | M1 |

## Story hooks across the acts

Every pack hooks into spec 120's acts as optional jobs; none is required by the story and none decides a town choice. Highlights:

- **Act I After the Storm:** re-pegging the plots (185), the loft tipped over (184), seeds in drifts (211), scattered ducks (210), first crossings on the mended footbridge (212), Pip's puzzle basket (204), the bent sails (181).
- **Act II A Town of Our Own:** the weekly market's floor map (187), Ember's birthday ribbons, cloths and cakes (186, 194, 197, 204, 208), the weekly market till (209), the ledger room (188).
- **Act III Beyond Willow Bridge:** Vadoalto's weighing landing (199), splicing the mooring rope (197), the high ford on the grid (187), the river exchange's orders (191), the baker's slips (192).
- **Act IV The Town Has Two Stories:** Hollis's ledger read as charts, chances and signed numbers (189, 199, 202, 203), Hollis's bridge drawing (182), honest percents and the low-field proposal (185, 200, 205), a bigger map for the wall (206). Hollis is named only from the end of Act III, as spec 120 sets out.
- **Act V A Question of Your Own:** project paths that start from a kept plot plan, a formula column or a chart (185, 193, 195, 203).
- **Act VI The Opening of the Ways:** routes written as grid moves (187), ribbons on every third post (194), a plan that meets the rain (205).

## Teaching approach

Every pack follows the same contract as the history and science packs:

- **Spec 49 §5:** a teaching-contract table and a hard-prerequisite crosswalk against the pinned `curriculum/marble/dependencies.json`. Each prerequisite is taught here, met elsewhere (named spec or draft), supported inline with no claim, or listed as a documented gap. Gaps never gate play.
- **Jane** (`kentlangley/Jane` at `0ec55f7`, refreshed 2026-10-24): teach first with a worked example revealed a step at a time, then one guided item, then practice; the "I'm stuck" ladder (hint, then an easier worked case and how to start, then skip for now with nothing lost); three-option choices with distractors tagged to named misconceptions and kind per-choice feedback; short second-person prompts; a glossary. **Not adopted:** points, medals, bosses, mastery, gates, timers, step-downs.
- **Marble teaching research** (`withmarbleapp/os-taxonomy` at `7bd8b67`, refreshed 2026-10-24): every target's record was read and paraphrased (never quoted; CC BY-SA). Many Marble math topics carry names that do not match their descriptions (for example "Ratio (age 11+)" is order of operations, "Understanding angles (age 9+)" is angle rules). Each spec claims a topic for what its **description and research** say, and notes the mismatch.
- **Contrasting cases and misconceptions** are the core move: a fraction's top number against its size, perimeter against area, "twice as many" against "more by", percent of different wholes, a chart's height against its change.
- **A true thing from history** in every pack, from many cultures: the Rhind papyrus, Babylonian astronomical diaries, the Nine Chapters, Brahmagupta, al-Kashi, Ibn al-Banna, the suanpan, Maya and Roman numerals, Playfair and Nightingale, Pascal, Fermi questions.
- **Numbers checked twice:** each writer's script checked every item, worked example and model, with brute-force uniqueness checks for puzzles; an independent reviewer then wrote a fresh script and rechecked everything. Combined, more than 2,600 checks pass. Answer positions in three-choice items are balanced and stated per pack, with no length or tone giveaway.
- **Labels kept apart:** "A true thing about math", "A true thing from history", "A story from Willowbank" and "A made-up model". US spelling and US dollars; metric and customary both appear where a US reader needs them.

**Privacy and safety:** fictional people and data only. No pack asks about a child's body, family, age, money or location. "Say why" prompts are spoken to a grown-up and never stored or graded. Saved work follows AGENTS.md: codes and numbers only, validated ids and ranges, results never recomputed on load, unreadable entries kept raw, and `source` freezing each item's choices and order.

## Fact-checking status

This session could not open web pages directly, so facts were checked against search-result excerpts and each audit says so. Unconfirmed details stay marked `[check]` in the audit and out of child text (for example, Nightingale's "ten times" figure, the earliest suanpan date and Mahavira's division verse). Review corrections included softening "earliest" claims for lattice multiplication and signed numbers, replacing a Trinity atomic-bomb Fermi card with Fermi's own classroom questions, and fixing the Hollis ledger to spec 120's forty years. **Before build, a reviewer with ordinary web access should open the cited pages**, and fluent readers should check the few Spanish and French lines.

## Topics left open

- **`mt_gNUE4B3vuk`** ("Mixed & Improper Fractions"; its description is written methods with signed numbers and decimals). No pack teaches it. Default: leave it for a later written-methods pack.
- **Documented gaps** (taught inline or met only by an existing task reference, claimed by no spec): `mt_sBcRdUfAzV` 2-D shapes (age 6+), `mt_NSC3LT_-ch` estimating volume, `mt_aPBzD28_mT` three-digit digits, `mt_m1W6nTQJ2b` add and subtract within 20, `mt_yTWxkzzoOZ` two-step word problems, `mt_q9EaJc2FP8` long multiplication and `mt_MCu_SNg_OW` arrays (age 9+) in 191, `mt_5HV4mbgSGH` fractions on a number line in 201. Each is listed in its spec's crosswalk.

## Suggested order

Under the [roadmap priorities](roadmap.md#owner-priorities-in-order), these sit in priority 1 (advanced curriculum: every pack has Keeper's Desk depth) and priority 4 (new games and curricula, one at a time). A suggested order once reviewed: 211 and 212 first (they extend the most-played number benches), then 196 to 198 (the café's fraction line), 188 and 199 (place value both ways), then the geometry run 181 to 187, then 202, 203 and 200, which serve Act IV directly. Each spec names its own smallest first slice.

## Open owner questions (defaults in bold)

1. **181:** the mill gains four wind sails and a weathervane on its tower, beside the water wheel. **Keep them**; otherwise the sail hinge becomes the wheel's spokes.
2. **New routes:** `#tower/clock`, `#desk/problems`, `#gate/patterns`, `#post/floor-map`, `#cafe/pies` and the other new routes in the table. **Keep each as its own route** so built destinations stay untouched; `#field/measure` must be registered on spec 75's Field Kit index.
3. **Big packs:** several packs hold 10 to 24 targets. **Keep each as one pack**, with Keeper's Desk benches shipping last.
4. **182:** congruence. **Keep it in 182** as the last bench, rather than a separate construction pack.
5. **205** claims "moving between representations" (`mt_9KmVWCuh5_`). **Keep it.**
6. **212:** add two-step stories within 100 so it can claim `mt_yTWxkzzoOZ`? **No for now.**
7. **191:** claim long multiplication and arrays (age 9+), which it teaches inline? **No claim for now.**
8. **`mt_gNUE4B3vuk`:** **leave unclaimed** for a later pack.
9. **Measurement units:** line plots in inches and eighths (203), metric for the mill and plots. **Keep both**, metric first with customary where US rulers lead.
