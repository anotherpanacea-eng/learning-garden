# 195. Lines and Graphs: straight lines, crossings, two brackets and the U

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a math check.** Part of the [math build-out](https://github.com/anotherpanacea-eng/learning-garden/pull/154). Every child-facing line is in [the companion text](../content/195-lines-and-graphs-text.md); sources and open checks are in the [source audit](../source-audits/195-lines-and-graphs.md).

**Commissioning boundary:** a proposal only. Select a bounded first slice after independent content, model and save review; the six benches do not commission each other. All Act and chapter links are future adapters to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (draft PR #127). Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter. **Fact-check status:** history facts checked against search excerpts on 2026-10-25 (fetches blocked); no `[check]` item is in child text. The algebra is standard and still needs the math check.

## Purpose

Algebra's graph strand has no home yet. [Spec 118](https://github.com/anotherpanacea-eng/learning-garden/pull/126)'s Keeper's Desk Case 1 compares two affine cost rules and solves one crossover equation in a table; [spec 119](https://github.com/anotherpanacea-eng/learning-garden/pull/126) §5 plots scatter points; [spec 178](https://github.com/anotherpanacea-eng/learning-garden/pull/150) reads distance-time graphs with slope as speed. Sibling specs in this build-out add four-quadrant coordinates (187), substitution, like terms, single brackets and two-unknown listings (193), and sequences with "twice" pairs plotted as a line (194). Nobody teaches **a rule as a line**, **gradient and intercept**, **linear or not**, **two lines crossing as the answer to two rules**, **elimination and substitution**, **two brackets multiplied out**, **the U of a quadratic** or **reading estimates off a graph**. This pack takes six untouched Algebra topics there.

A learner comes to understand that each row of a table is a point; a steady rule gives points in a straight line, checked with a third point; in y = mx + c the gradient m is "up per one across" in axis units (negative means down) and the intercept c is the starting value at x = 0; changing m tilts the line and changing c slides it; gradient between two points is rise ÷ run, rise on top; a table is linear exactly when its steps are equal; one rule has a whole line of solutions and two lines share one pair (or none, if parallel), which must be checked in both rules; subtracting rules or putting one into the other finds that pair exactly; two brackets make a rectangle of four parts that must all be found and then collected; y = x² makes a smooth U because a negative squared is positive, with a fold line and roots where y = 0; and a graph gives a careful "about", read on its scale.

**Builds on, never re-teaches:** spec 118's affine cost rules and one-equality-per-line working (here: the same idea becomes two lines and a crossing point); spec 119 §2's balance moves for one-unknown equations (here: used in one line after elimination); spec 178's slope-as-speed and "the graph is a record, not a picture" (recap only, T3); sibling 187's four-quadrant plotting (recap in T1 and A6); sibling 193's substitution, like terms, single-bracket Area Board and Pair Finder (here: the Area Grid extends the board to two brackets; Where Lines Cross starts where "Add a second rule" stops); sibling 194's constant-difference test for sequences (here: T8's step test). **Not targeted:** factorising quadratics, the quadratic formula, inequalities on graphs and distance-time graphs (spec 178).

## Place and story

**Host:** the **Graph Desk** of the *Willowbank Gazette*, behind the printing press at the back of the library, run by the librarian (they/them), route `#library/graphs`. It sits beside sibling 193's Account Shelf (`#library/algebra`). Linked from the library, the Account Shelf's Pair Finder end screen, spec 118's Keeper's Desk (Case 1 step 1d), sibling 187's Whole Valley and spec 178's Trip Line. Open from the start; no bench requires another. `#library/graphs` does not collide with any listed route (the `#library/*` family holds canopy, deep, drawers, far, orrery, poles, rockets and roof).

| Act and chapter (future adapters to spec 120) | Beat (full text in the companion) | Job depths |
| --- | --- | --- |
| IV, ch. 4 *the proposal for the low fields* | Before the meeting the librarian draws the Wall (9000 + 600 a year) and the Sponge (3000 + 1200 a year) as two lines. Bramble: the Sponge starts lower. Pip: look at year twenty. They cross at year ten. Dot asks about Some of Each, the third plan: no line for it yet, and it stays on the board. "The graph says when. It doesn't say which plan to keep." No official answer. | Sapling: read gradient and start (B3, D3, F2). Keeper's Desk: find the crossing (D2) and answer Bramble (B6, spoken). |
| V, path 2 *a Willowbank newspaper* (first version) | The Gazette's back page carries one graph a week. The press table (2 copies, then 3 a minute) becomes points, a line and a caption with its limit ("if the press runs smoothly"). | Seedling: table to points (Set A). Sapling: the caption's gradient and start. Keeper's Desk: the copies-sold puzzle (D4). |
| V, path 2 (revision) | A square photo of Nuria's reed beds gets a border 2 cm one way and 3 cm the other: (x + 2)(x + 3). Bramble forgets the strips. | Sapling: Area Grid (E2). Keeper's Desk: (a + 3)² (E4). |

One shared scene per chapter; any job is a whole contribution; nothing locks a story place. Spec 120 owns the meeting board and its three plans; this pack adds a cost graph of two of them (Some of Each has no cost rule here, by design: the graph is a tool for one question, never the decision). Child text names the third plan wherever the graph appears (Scene 1, its Keeper's note, the plans mode's ending note and B6's model answer), so two lines never read as the whole choice, and no line, item or feedback says which plan the town should keep. The town, plans, prices and press are fiction, labeled apart from math, history and models. No Sprout job: these topics need numbers, and Sprout keeps spec 120's own meeting-board job. **Hollis rule:** Acts IV and V come after Act III's end, but no scene or item here names Hollis, and problem items never name the old Keeper, since standalone play can come first.

## The knowledge

**Tables become points.** Each row is an ordered pair: the first number across, the second up (sibling 187 owns plotting; recapped). The press table (made up): minutes 0, 1, 2, 3, 4 and copies 2, 5, 8, 11, 14. Plot at least three points; if they line up, join with a ruler; a fourth point off the line is a slip (Pip's (3, 10) where the table says 11), never a sign the line bends. The 0-minute row is a real point, (0, 2): lines need not start at (0, 0).

**Gradient and intercept.** The **gradient** is how far the line goes up for each one across, counted in axis units, never squares or angles: the press line climbs 3 copies per minute. The **intercept** is the up-axis crossing, where across is 0: the starting value (2 copies already on the stack). In **y = mx + c**, m is the gradient and c the intercept; a bigger m is steeper, a negative m goes down (y = −2x + 5: 5, 3, 1), and changing c slides the line without tilting it. Steeper is a property of m, never of which line is higher (y = x + 5 is higher at first and less steep than y = 3x + 1). In context m is a rate with units: the Wall's 600 is dollars per year.

**Gradient from two points; tidying.** Gradient = rise ÷ run, up on top: (1, 2) to (3, 8) gives 6 ÷ 2 = 3 (not 1/3 or 6); (0, 5) to (2, 1) gives −4 ÷ 2 = −2. The same line drawn on a stretched scale looks steeper and has the same gradient. Keeper's Desk tidies ax + by = c into y = mx + c by doing each step to every term: 4x + 2y = 10 gives 2y = 10 − 4x, then y = −2x + 5 (the common slip y = 10 − 4x forgets to halve).

**Linear or not.** Step x by one: equal changes in y mean a straight line (10, 7, 4, 1: −3 each); growing changes mean a curve (0, 1, 4, 9; and 1, 2, 4, 8). y = 5 is a flat straight line; y = 4 − x is straight; y = x² + 1 curves. An x² term is what bends a graph at this level.

**Two rules at once.** One rule has a whole line of pairs (sibling 193's Pair Finder lists them). Two lines share the pair that fits both: y = x + 2 and y = 3x − 2 cross at (2, 4). (1, 3) fits the first only; (0, 2) is where one line meets an axis. A drawn crossing is checked by putting the pair into **both** rules. Parallel lines (y = 2x + 1, y = 2x + 4) share no pair; the same line twice shares every pair (named, not drilled).

**The Act IV plans (made-up model).** Wall W = 600t + 9000; Sponge S = 1200t + 3000; t in years, dollars. The Sponge's $6,000 head start shrinks by $600 a year, so they meet at t = 10, both $15,000. Before year 10 the Sponge has cost less; after it, the Wall (year 15: $18,000 against $21,000). Read off the graph, year 7 on the Sponge line is "between $11,000 and $12,000" (the rule gives $11,400). The graph answers "when is each cheaper?" only. Frogs, apples, Les Saules and the orchard keepers' living are not on it, so the pack gives no official answer.

**Exact methods.** **Elimination**: line up the rules and add or subtract so one letter disappears. Gazette sales (made up): p + m = 40 copies and p + 3m = 64 dollars give 2m = 24, m = 12, p = 28. **Substitution**: a big ad costs twice a small one (b = 2s) and both cost $18 (b + s = 18), so 3s = 18, s = 6, b = 12. **Scaling first**: 2g + p = 11, g + 3p = 13; double the second, subtract: 5p = 15, p = 3, g = 4 (made-up numbers in the style of the fangcheng card). Every answer is checked in both rules; each puzzle's whole-number answer is unique (brute-forced).

**Two brackets.** Numbers first: 12 × 13 = (10 + 2)(10 + 3) = 100 + 30 + 20 + 6 = 156. Then (x + 2)(x + 3): a rectangle of four parts, x², 3x, 2x and 6, collected to x² + 5x + 6. Four parts always come before collecting (the research's chief error is x² + 6). Signs stay with their terms: (x + 4)(x − 1) = x² − x + 4x − 4 = x² + 3x − 4. (a + 3)² means (a + 3)(a + 3) = a² + 6a + 9, never a² + 9 (check at a = 2: 25 against 13). Check any expansion by putting a number in. Negative lengths are not real sides, so the signed grid is a multiplication table, labeled as such.

**Quadratic graphs.** y = x² from x = −3 to 3 gives 9, 4, 1, 0, 1, 4, 9: (−3)² = 9, so the two sides match and the curve folds on x = 0. Join with a **smooth** curve; the change between steps keeps growing. y = x² − 4 drops the U by 4, crossing at x = −2 and 2 (its **roots**) with lowest point (0, −4); this links to brackets: x² − 4 = (x + 2)(x − 2). Keeper's Desk: y = x² − 2x − 3 = (x + 1)(x − 3), table 5, 0, −3, −4, −3, 0, 5 for x = −2 to 4, roots −1 and 3, fold line x = 1 (halfway), lowest point (1, −4). A U can cross the axis twice, once or not at all (named).

**Reading estimates.** Read the scale first; find the value on one axis, go to the graph, then across; give a band, not false precision. Up axis in 2s: 3 squares is 6. y = x² − 5 crosses between 2 and 2.5 and between −2.5 and −2 (√5 ≈ 2.24). x² = 7 from the y = x² curve: about 2.6 (2.6² = 6.76). Crossings with the across axis and crossings of two graphs are both answers to read, then checked.

**Real anchors (see audit).**
- **Oresme's pictures of change.** Nicole Oresme (about 1320 to 1382, Normandy; later bishop of Lisieux) wrote the *Tractatus de configurationibus qualitatum et motuum* in the 1350s. He drew a quantity's extent (such as time) along a base line and its intensity (such as speed) as perpendicular heights; for speed growing steadily the tops form a straight slanting edge, and the figure's area gives the distance. Popular claims that he "invented graphs" are not used.
- **Fangcheng.** Chapter 8 of *The Nine Chapters on the Mathematical Art* (China, compiled about 2,000 years ago) is *fangcheng*, often translated "rectangular arrays": 18 problems, each a set of simultaneous linear equations, solved by arranging counting rods in columns and subtracting columns, a procedure close to what is now called Gaussian elimination. Problem 1: 3 top, 2 middle and 1 low bundles of grain give 39 *dou*; 2, 3, 1 give 34; 1, 2, 3 give 26; a top bundle holds 9¼ *dou*. Sibling 189 uses the same book's red and black rods; this card names that link.
- **Galileo's parabola.** In *Two New Sciences* (1638), Galileo combined a steady sideways motion with a fall that speeds up and showed the path is a semi-parabola (Fourth Day, Theorem I). Keeper's Desk only, as the U turned over.

Two European anchors and one Chinese; Descartes (1637) is left to sibling 187, which uses it for coordinates.

## The lesson

Jane's **teach → guided → practice** order on every bench: a teach card with a step-revealed worked example, a guided first item with 1-4 visible steps, then practice.

| Bench | Teach | Guided | Practice |
| --- | --- | --- | --- |
| Table to Points | T1, T2 | Plot (2, 8) (3 steps) | Set A |
| Line Slider | T3-T6, T9 | Make y = 3x + 2 (3 steps) | Set B, C5, C6 |
| Straight or Not? | T7, T8 | 2, 5, 8, 11 (2 steps) | Set C |
| Where Lines Cross | T10-T13 | y = x + 2 and y = 3x − 2 (3 steps) | Set D |
| Area Grid | T14-T16 | (x + 2)(x + 3) (3 steps) | E1-E4 |
| U Curve | T17-T19 | y = x² at −3 (3 steps) | E5-E7, Set F |

**"I'm stuck" ladder** on every item: (1) the hint; (2) an easier worked case plus how to start this one (the companion lists eleven); (3) **Skip for now**, no penalty, nothing recorded against the learner.

**Contrasts:** across vs up; higher vs steeper; m vs c; tilt vs slide; rise ÷ run vs run ÷ rise; equal steps vs growing steps; fits one rule vs fits both; an axis crossing vs two lines crossing; parallel vs the same line; four parts vs first-and-last; (a + 3)² vs a² + 9; straight pieces vs a smooth U; one root vs two; exact rule value vs a read band; when cheaper vs which to keep.

**Top misconceptions designed against:** swapping the pair's order; every line starts at (0, 0); an off-line point means a curve; m and c swapped; higher means steeper; judging gradient by angle; rise and run inverted; losing a gradient's minus; tidying without dividing every term; a pair fitting one rule is "the answer"; reading an axis crossing as the solution; trusting a drawn crossing unchecked; the start decides forever; dropping the middle parts; (a + 3)² = a² + 9; sign slips in the grid; (−3)² = −9; joining a U with straight pieces; stopping at one root; every U folds on the up axis; reading the wrong scale; false precision.

## The game or activity

**(a) Table to Points, model `table-points-v1`.** The press table on the left, a first-quadrant grid on the right (0-5 across, 0-20 up in 2s, labeled). **Plot this row** places a dot from a chosen row by tapping; **Check a third point** highlights whether the remaining point sits on the line through two; **Join with a ruler** draws only when three or more plotted points are collinear; otherwise the off-line point is outlined with "Check that row again." *A made-up model: the press starts with 2 copies and prints 3 a minute; real presses jam.* Sapling adds four-quadrant rows for y = 2x − 1 (x = −2 to 3).

**(b) Line Slider, model `line-slider-v1`.** y = mx + c with m from −3 to 3 in halves and c from −5 to 5 on a −6..6 grid. **Show up-per-one-across** draws a one-unit step triangle labeled "1 across, m up/down"; **Show where it crosses** marks (0, c); **Same line, new scale** redraws the line with the up axis stretched, keeping its gradient label. Keeper's Desk adds a **Tidy it** strip that applies one written step to every term of ax + by = c. *A made-up model: halves only; the grid is drawn to scale.*

**(c) Straight or Not?, model `straight-or-not-v1`.** Six cards (tables and rules); **Show the steps** writes each change under the table; **Plot it** draws the points; the learner sorts *Straight* / *Curved*. Two-point gradient mode: tap two lattice points, see rise and run drawn and the division written. Cards: 10, 7, 4, 1; 0, 1, 4, 9; 1, 2, 4, 8; y = 5; y = 4 − x; y = x² + 1. *A made-up model: every table steps across by 1.*

**(d) Where Lines Cross, model `two-lines-v1`.** Two rules drawn on one grid. **Show the crossing** marks the shared point; **Check in both** substitutes it into each rule and shows each line true or not true; **Subtract the rules** and **Put one into the other** lay out the working one equality per line (spec 118's convention). **The plans** mode draws the Wall and Sponge over 0-20 years ($0-$30,000 in $1,000s) with a year slider reading both totals; its ending note names Some of Each as the plan with no line and says the choice of plan is still the learner's. **Rods** card (Keeper's Desk) sets D6 as two columns of counting rods, with the column subtraction animated. *A made-up model: costs and sales are invented; real costs change with prices and floods.*

**(e) Area Grid, model `area-grid-v1`.** Extends sibling 193's Area Board to two brackets. **Split the sides** cuts a rectangle into four parts; **Fill a part** writes each product; **Collect** joins like terms only after all four parts are filled; **Check with a number** evaluates both forms. Numbers first (12 × 13), then letters; signed cases show as a labeled multiplication table. *A made-up model: letter sides can be any length; the picture is not to scale.*

**(f) U Curve, model `u-curve-v1`.** Table x = −3 to 4 for y = x², x² − 4, x² − 5 and x² − 2x − 3; **Plot** and **Join smoothly** (straight-piece joins are redrawn smoothly with a note); **Show the fold line**, **Show the crossings**, and **Read up, then across**, which drops guide lines from a chosen value and shows the read band. Keeper's Desk shows the Galileo card with a rolled-ball path as half a U turned over. *A made-up model: x from −3 to 4; smooth curves drawn through plotted points.*

No timers, scores, streaks, medals or locks. Every bench is open from the first visit. Every graph has a text equivalent ("At x = 2 the line is at 8").

## Problem sets

Six sets, **36 items**, full text in the companion:

| Set | Depth | Items | Formats |
| --- | --- | --- | --- |
| A. From a table to points | Seedling (A1-A4), Sapling (A5, A6) | 6 | 3-choice, number |
| B. What m and c mean | Sapling (B1-B5), Keeper's Desk (B6) | 6 | 3-choice, *say why* |
| C. Straight or not, gradient from two points | Sapling (C1-C3), Keeper's Desk (C4-C6) | 6 | 3-choice, number |
| D. Where two lines cross | Sapling (D1-D3), Keeper's Desk (D4-D7) | 7 | 3-choice, number with worked steps |
| E. Two brackets and the U | Sapling (E1-E3, E5), Keeper's Desk (E4, E6, E7) | 7 | 3-choice, number |
| F. Reading estimates from a graph | Sapling (F1, F2), Keeper's Desk (F3, F4) | 4 | 3-choice, number (band accepted) |

No Sprout items (see Place and story). Over the 24 three-choice items the right answer sits at A, B and C eight times each. C6 and F2 each carry one distractor that withholds more than the evidence requires ("graphs can't show a gradient"; false precision is its mirror). *Say why* is spoken to a grown-up and never stored or graded. Number items accept equivalent forms (12 and 12.0; F4 any value from 2.5 to 2.75; D2 "10" or "10 years").

## Saved work

Optional root `graphDesk` per explorer, absent until a first explicit action.

```
graphDesk: {
  version: 1,
  table:   { [tableId]: { source, plotted: [[x, y]], joined: bool, at } },            // x, y integers in grid range
  slider:  [{ source, m: -3..3 step 0.5, c: -5..5, scale: 'plain'|'stretched', at }], // latest 12
  sorts:   { [cardId]: { source, placed: 'straight'|'curved', at } },
  crosses: { [pairId]: { source, steps: [stepCode], at } },
  grids:   { [exprId]: { source, cells: [cellCode], collected: bool, at } },
  curves:  { [ruleId]: { source, plotted: [[x, y]], smooth: bool, at } },
  answers: { [itemId]: { source, choice | value | band, support: ['hint'|'example'|'skip'], at } }
}
```

`source` freezes the model version and the item's choices and order. Codes and numbers only; no free text, so B6 stores nothing. Validate ids and ranges only (grid coordinates, m in halves, c whole); never recompute or rewrite saved results on load, including a value that a later model version would mark differently. An unreadable entry stays raw and exportable while the rest stays open. Support stays separate from answers; no mastery flag. Shared export, import, reset and explorer switching.

## Curriculum fit

**Strands** ([six-act strands](../six-act-strands.md)): **M4-V** linear graphs and gradient, rearranging; **M4-VI** two constraints and graph intersections, quadratics as the optional stretch; **M4-IV** distributivity (two brackets); **E3-IV** a graph as relevant but not sufficient evidence for a decision; **H1** an old treatise, an old problem book and a printed proof as sources. Act families: IV, V.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Turn tables into points and lines; read and set gradient and intercept with meaning; find gradient from two points and tidy into y = mx + c; tell linear from not; solve two linear rules by a checked crossing, elimination and substitution; expand two brackets on an area grid; plot and read quadratic graphs (U, fold line, roots); estimate values and solutions from graphs. |
| Teaching encounter | T1-T19 with step-revealed worked examples; a guided first item per bench. |
| Contrast | As listed in The lesson. |
| Supported practice | Third-point check; step triangle; step row; Check in both; four-part grid; smooth-join redraw; read lines; the "I'm stuck" ladder. |
| New application | The meeting's plans as lines; the press caption with a limit; the photo border; the rods card; reading √7 off a curve. |
| Purposeful revisit | Spec 118 Case 1 (crossover in a table); spec 178 (slope as speed); sibling 187 (four quadrants); sibling 193 (substitution, Area Board, Pair Finder); sibling 194 (constant differences); spec 119 §5 (scatter points). |
| Data boundary | Plotted points, slider settings, sorts, step codes, choices, values, bands and support codes, all local. No timing, free text or location. |

## Upstream check

Refreshed upstreams: Jane `0ec55f7e083976e6fcc3977fca460b1f5e199d91` and Marble `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (both 2026-10-24). Ids confirmed in the pinned `curriculum/marble/topics.json`.

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Linear Function Graphs (`mt_WBdHkc2HTf`) | Build the line from a table so straightness is found; vary m and c separately; give the gradient a rate meaning; confront higher-vs-steeper and graph-as-picture; set a curve beside a line. T1-T5, Line Slider, B1-B5, the Wall's dollars per year, C3. |
| Plotting Linear Graphs (`mt_-3udyo6VyB`) | At least three points with a third checked; rise over run between lattice points with the scale read first; tidy ax + by = c applying steps to every term; translate both ways; same line, two scales. Table to Points, T7, T9, C2, C4-C6, Same line, new scale. |
| Simultaneous Equations (`mt_mqgu72aCMz`) | One rule has many pairs, two share one; plot both and verify in both; confront the fits-one-rule error with a contradiction; connect the crossing to elimination and substitution; name parallel and identical lines. T10-T13, Check in both, D1, D4-D7. |
| Quadratic Graphs (`mt_GZuoYaDdWd`) | Tables through negative x so symmetry emerges; smooth curves; line beside curve; the fold explicit; roots, with two, one or none. T17, T18, U Curve, E5-E7, F3. |
| Expanding Double Brackets (`mt_KhS7K1Mgrw`) | Area grid, linked to 12 × 13; four products before collecting; (a + 3)² as a product; directed-number care; collect as the last step; check by substituting. T14-T16, Area Grid, E1-E4. FOIL is not taught as a separate rule. |
| Estimating answers (age 13+) (`mt_Yw27nweoTj`) | A fixed up-and-across reading routine, scale stated first; bands, not false precision; two crossings on a U; axis crossings vs two-graph crossings; sense-check against context. T19, Read up, then across, F1-F4, D1's (0, 2) distractor. Added to this pack after sibling 193 dropped it (its description is graph-based). |

**Jane:** adopted teach → guided → practice, the three-step "I'm stuck" ladder, short second-person prompts, three-option choices with misconception-tagged distractors, step-revealed worked examples and a glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, points. No Jane code or text copied. Marble research is paraphrased (CC BY-SA); its worked numbers were not reused in items except where the pinned topic description itself names them, as in (x + 3)(x − 2) and 2x + 3y = 12, which this pack replaces with its own cases.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| Linear Function Graphs | Coordinates (age 11+) (`mt_hVpGOEz2kG`) | Met elsewhere: proposed spec 187 (math build-out). Recapped in T1. |
| Linear Function Graphs | Substituting into Formulae (`mt_vHzVa3SURC`) | Met elsewhere: proposed spec 193 (math build-out). Used in A5, A6. |
| Linear Function Graphs | Algebraic Transformations (`mt_z5iwdZyeDr`) | Met elsewhere: draft spec 119 §2 candidate (PR #126). Supported inline (rule ↔ table ↔ line on every bench); no claim. Documented gap if 119 does not ship. |
| Plotting Linear Graphs | Linear Function Graphs (`mt_WBdHkc2HTf`) | Taught here (Line Slider before T7, T9). |
| Simultaneous Equations | Plotting Linear Graphs (`mt_-3udyo6VyB`) | Taught here. |
| Simultaneous Equations | Solving Linear Equations (`mt_QhFEDyIwSO`) | Met elsewhere: draft specs 118 (Case 1) and 119 §2 (PR #126). Used in one line after each elimination. |
| Quadratic Graphs | Plotting Linear Graphs (`mt_-3udyo6VyB`) | Taught here. |
| Expanding Double Brackets | Expanding Single Brackets (`mt_FX4a2Q8XXN`) | Met elsewhere: proposed spec 193 (Area Board). Recapped in T14. |
| Expanding Double Brackets | Collecting Like Terms (`mt_nNNVrLqPW3`) | Met elsewhere: proposed spec 193 (Tile Tray). Used in Collect. |
| Estimating answers (age 13+) | Plotting Linear Graphs (`mt_-3udyo6VyB`) | Taught here. |

Soft prerequisites used but not claimed: Simple formulae (`mt_3qrCtdoVAU`, spec 193) for T9; Equations with Two Unknowns (`mt_YFS7JFk64p`, spec 193) for T10; Quadratic Graphs for estimating, taught here.

Claim check, 2026-10-25: no spec on main or any draft PR (126, 128, 137-151) claims these six targets; sibling 193 names them only as "a later spec"; `assignments.tsv` maps all six to this pack.

## Checks for implementation

- **Numbers script (2026-10-25):** `check195.py` (`python3 -I`, scratch area, not in the repo), 116 checks passing: press table 2, 5, 8, 11, 14 (wrong 12, 16), (3, 11) not (3, 10), intercept 2; A5 5 (wrong 6, 4); A6 (−2, −5) (wrong (−2, 3)); B1 3 (wrong 5); B4 slide 3; y = −2x + 5 gives 5, 3, 1; the plans cross only at t = 10 over 0-100 (both 15,000), Sponge lower for t < 10 and Wall lower for t > 10, wrongs 5 and 15; D3 18,000 vs 21,000; C1 steps (−3 constant; 0, 1, 4, 9 and 1, 2, 4, 8 not); C2 3 (wrong 1/3); C3 1, 2, 5, 10 curved and 4 − x straight; C4 −2 (wrong −1/2); C5 y = −2x + 5 satisfies 4x + 2y = 10 at x = −5..5 and both wrong forms fail; **brute-force uniqueness** of D1 (2, 4) over a −20..20 × −50..50 grid, D4 (28, 12), D5 (12, 6), D6 (4, 3), with D6 distractors each fitting one rule only; D7 parallel lines 3 apart at every x; the Nine Chapters problem 1 answer (9¼, 4¼, 2¾) satisfying 39, 34, 26; E1 156 (wrong 106, 25); E2, E3, E4, x² − 4 and x² − 2x − 3 expansions identical at x = −6..6, with wrong forms failing; E4 check 25 vs 13; y = x² table 9, 4, 1, 0, 1, 4, 9; E6 roots ±2, minimum −4; E7 roots −1, 3, fold 1, minimum −4, table 5, 0, −3, −4, −3, 0, 5; F1 6; F2 11,400 inside the band; F3 √5 between 2 and 2.5; F4 √7 between 2.5 and 2.75, 2.6² = 6.76; T19 6.5; Oresme about 670 years ago; answer positions 8/8/8.
- Lines never join points that are not collinear; the Area Grid's Collect waits for all four parts; U curves are always smooth; scales and axis labels always visible. Model lines show on every bench. Feedback never says "wrong". The plans' graph never names a "best" plan.
- Style check (`style195.py`) run on the companion: 0 em-dashes; teach cards at most 30 words; prompts at most 15 words; hints, feedback and explanations at most 20 words; scene Short at most 30, Longer at most 150, Keeper's notes at most 80; no "wrong" in feedback.
- Browser at 320 and 820 px: targets 44 px; tap-to-place as well as drag on every grid; sliders have step buttons; every graph has a text equivalent.
- Independent review, 2026-10-25: a separate reviewer recomputed every table, gradient, crossing, expansion, curve value and estimate band with an independent `python3 -I` script (119 checks across specs 192-195, all passing, including brute-force uniqueness of D1, D4, D5 and D6 and the Nine Chapters problem 1 answer), recounted the three-choice balance (A 8, B 8, C 8), reran the style check (0 em-dashes in all three files; word limits met, Scene 1's Longer trimmed back to 150 words) and checked the Marble records, the hard prerequisites and the fangcheng and Galileo facts against search excerpts. Changed: Some of Each, spec 120's third Act IV plan, is now named in Scene 1, its Keeper's note, the plans mode's ending note and B6, and no text implies the town's answer; F3's right answer is no longer the longest; "wrong" removed from A3; Scene 3 no longer reads as a pronoun for Bramble; H2 no longer cites a spec number in child text; the Act V adapters use spec 120's path name. No math errors found.

## Review asks

**Math expert:**
1. Is "up per one across" with "count in axis numbers" a sound gradient fence for a negative gradient and a stretched scale?
2. Is the signed area grid, labeled as a multiplication table, an acceptable bridge for (x + 4)(x − 1)?
3. Are F3 and F4's accepted bands (2 to 2.5; 2.5 to 2.75) fair for a hand-drawn curve on a 0.5 grid?
4. Is the Oresme card fair as worded (heights for intensity along a time line; area for distance), without claiming he invented graphs?

**Owner questions, with defaults:**
1. Route `#library/graphs`, beside sibling 193's `#library/algebra`? *Default: yes.*
2. Six targets in one pack, or split quadratics and brackets into a later pack? *Default: one pack; the Area Grid and U Curve can ship as a second slice.*
3. Keep `mt_Yw27nweoTj` here after sibling 193 dropped it? *Default: yes; Set F and T19 cover it.*
4. The Act IV graph shows two of the three plans (no cost rule for Some of Each). Acceptable? *Default: yes; a third line invites "cheapest wins" reading.*
5. First slice? *Default: Table to Points and the Line Slider with Sets A and B, then Where Lines Cross.*
