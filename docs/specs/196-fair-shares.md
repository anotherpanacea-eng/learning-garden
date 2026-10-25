# 196. Fair Shares: fractions as numbers at the pie counter

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a math check.** Part of the [math build-out](https://github.com/anotherpanacea-eng/learning-garden/pull/154). Every child-facing line is in [the companion text](../content/196-fair-shares-text.md); sources and open checks are in the [source audit](../source-audits/196-fair-shares.md).

**Commissioning boundary:** a proposal only. Select a bounded first slice after independent content, model and save review; the five benches do not commission each other. All Act and chapter links are future adapters to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (draft PR #127). Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter. **Fact-check status:** both history anchors checked against search excerpts on 2026-10-25 (fetches blocked); no `[check]` item is in child text. The arithmetic is checked by script; the teaching still needs the math check.

## Purpose

Learning Garden already makes halves and quarters of one loaf and of 12 buns (spec 43, `#cafe/sharing`), builds equal spaces on a 0-2 ribbon line with halves, thirds, quarters and sixths, past 1 to 5/4 (spec 52, `#cafe/fractions`), rematches one amount in new cuts (specs 70 and 100), joins same-size pieces on a tray (spec 103, `#cafe/portions`), compares one share with another cut of the same loaf (spec 74's `share-compare`) and reads a 500 mL jug (spec 45). Each of those specs fences off what this pack takes up: spec 43 does not teach equal shares of different shapes, thirds, eighths or different wholes; spec 52 names circles, different-shaped equal areas and general fraction-of-quantity work as scope exceptions. Nobody yet teaches fractions **as numbers that compare, order and measure**.

A child comes to understand that equal parts are equal in **size**, whatever their shape, and that the denominator counts parts, not cuts; that a fraction of a set or an amount is found through equal groups (1/4 of 12, then 3/4 of 12); that the same fraction of a different whole is a different amount; that sharing several wholes gives a fraction (3 ÷ 4 = 3/4); that a recipe scales from the amount for one, and a ratio share counts all the parts; that a/b is a jumps of 1/b on a number line, which carries on past 1 (4/4 = 1, 8/4 = 2, 3 = 3/1) and always has room for more fractions between two others; that fractions, decimals and negative numbers share one line; that fractions compare by part size (same numerator or same denominator), by landmarks (half, one) and by same-size parts; and that lengths can be measured to the nearest quarter inch and shown on a line plot.

**Builds on, never re-teaches:** spec 43's equal loaf cuts and quarter baskets (here: different shapes, thirds, any whole); spec 52's equal spaces and flag steps on 0-2 (here: a 0-3 line, a/b as unit-fraction sums, whole numbers as fractions, zooming, negatives); specs 70 and 100's same point, new cuts (here: used only to compare, never taught as a rule); spec 74's same-loaf comparison (here: same numerator, same denominator, benchmarks, common denominators); spec 103's joined pieces (here: only to total a line plot); spec 45's jug scale (here: inches). The recipe card mode scales by whole-number reasoning (find one, then multiply); sibling 198's Scaling Dial (`#cafe/scaling`) owns multiplying an amount by a fraction and predicting bigger or smaller, so the two recipe cards never share a case. Sibling 197 owns equivalence, simplifying, mixed numbers and adding fractions; sibling 198 owns multiplying and dividing fractions. Where an item needs those (a mixed-number ruler label, a total in eighths, five lots of 3/8), the step is shown as counting same-size parts and the topic is recapped, not claimed.

**Not targeted:** *Understanding fractions (age 10+)* (`mt_9KmVWCuh5_`). Its pinned description and research are about equations kept balanced (4x + 27 = 87 as a bar and an equation), coordinate grids and pie-chart percentages; only its title is about fractions. It is dropped and offered to sibling 205 (math build-out), the multi-step and representation pack. Its hard prerequisite, `mt_CUmjcE7W6c`, is taught here, so a later pack can take it. Also narrowed: the 4 × 23 area model in `mt_3VmBdlAeOZ` and the long multiplication in `mt_CUmjcE7W6c` (left to the multiplication packs); the angle and long-multiplication critiques in `mt_2ESZh70NyS` (fractions only here).

## Place and story

**Host:** the **Pie Counter**, the café's pie-and-bread counter run by the baker (he/him), with a brass measuring line along its edge. Route `#cafe/pies`, linked from the café, the Sharing Counter's end screen (spec 43), the Fraction Trail (spec 52) and Join the Portions (spec 103). The route is free on main and in every draft. (The writer's `#cafe/shares` was changed in review: it differs from spec 43's `#cafe/sharing` only by word ending, and the two would read as one place in links and history; `#cafe/pies` matches the place title "The Pie Counter".) Open from the start; no bench requires another.

| Act and chapter (future adapters to spec 120) | Beat (full text in the companion) | Job depths |
| --- | --- | --- |
| II, ch. 3 *Ember's birthday* | The baker quarters Ember's square tart corner to corner. Bramble says quarters must be little squares; a grid shows each piece covers 4 squares. Three quarters of 12 honey buns go to guests. | Sprout: the Cut Board. Seedling: the Share Tray's 3/4 of 12. |
| III, ch. 1 *the floating market* | Four Vadoalto traders, three pies: Pip says someone gets none; each gets 3/4. Two boats share 40 apples by their 3 and 5 bundles of reed. | Sapling: pie mode, recipes. Keeper's Desk: the bundle share (C5), the rowers' loaves (C4). |
| III, ch. 4 *letters up and down the river* | Nuria writes: Vadoalto cuts pies in thirds; is 2/3 more than 3/4? And their pies are bigger. | Sapling, Keeper's Desk: the Comparing Shelf; E7 spoken reasoning. |
| V, *a question of your own* | Measuring and plotting breadsticks becomes a small data page. | Seedling, Sapling: the Measuring Strip. |

One shared scene per chapter; any job is a whole contribution; nothing locks a story place. Act II ch. 3 already lists a Sharing Counter cake job; this pack's jobs sit beside it, never replacing it. The town, café, pies, traders and letters are fiction, labeled apart from math, history and models. The old Keeper does not appear (Hollis rule). The Vadoalto baker of Act III is not used, so the only baker on screen is Willowbank's (he/him).

## The knowledge

**Equal parts.** A fraction names equal parts of one whole. **Equal means equal size** (equal area for a flat shape), never equal shape: a square tart of 16 grid squares quartered corner to corner, in strips or in small squares gives pieces of 4 squares each, so all are quarters. Size is checked by counting grid squares or cutting and rearranging, never by eye. Four pieces are not quarters unless they are equal. The denominator counts **parts (regions), not cuts**: three parallel cuts make four parts, so each is 1/4, not 1/3. Thirds come early (two cuts across a tray bake), so halves and quarters are not the only fractions.

**Naming.** *Numerator* (top) counts the parts we mean; *denominator* (bottom) says how many equal parts make the whole. *Unit fraction*: one part (1/3, 1/8). *Non-unit fraction*: several (3/4 is three quarters).

**Fractions of a set and an amount.** Share the set into equal groups; one group is the unit fraction: 1/4 of 12 buns is 3, so 3/4 of 12 is 9. A bar model shows it for an amount: 3/5 of 20 loaves is 20 ÷ 5 = 4, then 3 × 4 = 12. A fraction less than one of an amount is less than the amount (a plausibility check). **Same fraction, different whole:** half a big pie is more than half a small one; 1/2 of 8 rolls and 1/3 of 12 rolls are both 4. Every fraction is "of" something.

**Sharing several wholes.** 3 pies among 4: cut each into quarters, deal 12 quarters, 3 each, so 3 ÷ 4 = 3/4; check 4 × 3/4 = 12/4 = 3. A smaller number can be divided by a bigger one; 4/3 (the reversal) would give each more than a pie. 6 loaves among 10: 6/10 each, which the Rhind papyrus writes as 1/2 + 1/10.

**Scaling and rates** (`mt_ZOJ6EbdPOb`). Find the amount for one, then multiply: 4 pies need 8 cups of flour, so 1 pie needs 2 and 6 pies need 12 (a non-whole factor, 6/4). Half the recipe is 4 cups. Adding the difference (8 + 2 = 10) is the additive trap. Rate: 3 loaves for $12 is $4 each, so 5 cost $20, not $14.

**Unequal sharing** (`mt_FnUJMXPUZX`). Share 40 apples between boats that brought 3 and 5 bundles: 3 + 5 = 8 equal parts of 5, shares 15 and 25, and the first boat's fraction is 3/8 (the whole is all 8 parts), never 3/5. Formal ratio notation is not used.

**Fraction times a whole number, as counting** (`mt_HJA2Oz-Zh1`). Five traders each eat 3/8 of a pie: 3/8 five times is 15 eighths, 15/8; the pieces stay eighths (not 15/40). 15/8 is one pie and 7/8, so bake 2 pies: rounding up belongs to things bought whole.

**The number line.** 0 to 1 is one whole; split it into b equal spaces; a jumps of 1/b from 0 land on a/b, so 3/5 = 1/5 + 1/5 + 1/5. Jumps carry on past 1: 4/4 = 1, 5/4, 7/4 (between 1 and 2), 8/4 = 2, and 3 = 3/1 (wholes cut into one piece). 6/3 is a whole number; 5/2 is not. 3/4 is one number less than 1, never "between 3 and 4". Between any two fractions there are more: zoom quarters into eighths and 3/8 sits between 1/4 and 1/2; zoom again for 5/16. 0.3 and 3/10 are one point; so are 0.5, 5/10 and 1/2 (a recap of specs 52 and 70, not an equivalence rule). At Keeper's Desk the line stretches left past 0: −1 < −1/2 < 0.5 < 3/4 < 7/4, ordered by position (leftmost is least), with =, ≠, <, >, ≤ and ≥; 1/4, 0.25 and 25% are one point with three names (percent as "out of a hundred", a recap of sibling 200).

**Comparing.** Pictures compare only on the **same whole**. *Same denominator:* same-size parts, so the bigger numerator is more (5/6 > 2/6). *Same numerator:* the same count of parts, so the bigger parts win, and a bigger denominator means smaller parts (3/4 > 3/8). These are two different comparisons, never one "flip" rule. *Benchmarks:* half of 7 is 3.5, so 3/7 is below half; 5/8 is above, so 5/8 > 3/7. *Same-size parts* (common denominators) always work: 2/3 = 8/12 < 3/4 = 9/12; 3/5 < 2/3 < 7/10 in thirtieths (18, 20, 21). Past 1: 7/5 = 21/15 > 4/3 = 20/15. *Gap to one:* 3/4 < 5/6 < 7/8 < 11/12, since the missing pieces 1/4, 1/6, 1/8, 1/12 shrink. A drawing or one example does not prove a comparison; a reason about the numbers does (E7).

**Measuring and line plots.** An inch splits into halves and quarters; read the mark nearest the end and say its value and unit ("4 1/2 inches"), never "the third line". 4 1/2 and 4 2/4 are the same mark. A line plot is a number line with one X per object, every quarter mark present, empty marks included. Combining and sharing measurements: four jugs of 3/4, 1/2, 7/8 and 7/8 cup are 6, 4, 7 and 7 eighths, 24/8 = 3 cups, shared by 4: 3/4 cup each.

**Saying it exactly** (`mt_HY8Yycu_rz`). Units on every measure (9 inches); dollars with two decimal places ($3.50, or 350¢, never $3.5 or $3.50¢; in value $3.5 equals $3.50, but it invites a misreading as $3.05); numerator and denominator named by role.

**Real anchors (see audit).**
- **Bread for ten: the Rhind papyrus.** Copied by the scribe Ahmes (also Ahmose) in Egypt about 1550 BCE from an older text; Henry Rhind bought it in Luxor in 1858 and most of it has been in the British Museum since 1865 (MacTutor gives 1863; child text gives no year). Its first six problems divide 1, 2, 6, 7, 8 and 9 loaves among 10 men; problem 3 gives 6 loaves as 1/2 + 1/10 each. Scribes wrote fractions as sums of different unit fractions, with 2/3 as a special case; the papyrus's 2/n table splits 2/5 into 1/3 + 1/15. Child text: H1 (Sapling up) and C4. The popular "Eye of Horus fractions" story is left out: scholars describe the link between the eye and the grain-measure fractions as a later, discredited theory.
- **Which is more, and by how much: *The Nine Chapters on the Mathematical Art*.** A Chinese problem book compiled over centuries and in its final form about 2,000 years ago; Liu Hui wrote a commentary explaining its methods in 263 CE. Chapter 1, *Fangtian* (field measurement), holds its fraction rules, including one (*kefen*) for finding which of two fractions is larger and by how much. Child text: H2 (Keeper's Desk). The book's own worked example and the exact wording of its method are `[check]` and stay out of child text.

## The lesson

Jane's **teach → guided → practice** order on every bench: a teach card with a step-revealed worked example, a guided first item with 3 visible steps, then practice.

| Bench | Teach | Guided | Practice |
| --- | --- | --- | --- |
| Cut Board | T1-T3 | Quarter the square a new way (3 steps) | Set A |
| Share Tray | T4-T8 | 3/4 of 12 honey buns (3 steps) | Sets B, C |
| Counter Line | T9-T11 | Where does 3/4 go? (3 steps) | Set D |
| Comparing Shelf | T12-T14 | 3/8 or 3/4 of a pie (3 steps) | Set E |
| Measuring Strip | T15-T17 | The honey breadstick (3 steps) | Set F |

**"I'm stuck" ladder** on every item: (1) the hint; (2) an easier worked case plus how to start this one (the companion lists ten by item family); (3) **Skip for now**, no penalty, nothing recorded against the child.

**Contrasts:** same size vs same shape; parts vs cuts; four pieces vs four equal parts; one group vs three groups; half of a big whole vs half of a small one; 3 ÷ 4 vs 4 ÷ 3; one first vs adding the difference; 3/8 of all vs 3/5; eighths stay eighths vs 15/40; 3/4 vs "between 3 and 4"; a line that stops at 1 vs one that carries on; next door vs zoom in; same denominator vs same numerator; close to half vs either side of half; digit reasoning vs same-size parts; a drawing vs a reason; the tick vs its value; a line plot vs a bar chart.

**Top misconceptions designed against** (each tagged on a distractor or a feedback line): equal means same shape; counting cuts for the denominator; any four pieces are quarters; any piece is a half; reading the denominator as the answer; stopping at one group; ignoring the whole; looking only at the whole; "can't divide a smaller number by a bigger"; dividing bigger by smaller; stopping at a remainder; the additive scaling trap; sharing equally when the deal is unequal; one share as the denominator; scaling the denominator; adding the whole number; 3/4 placed between 3 and 4; adding denominators when jumping; fractions stop at 1; fractions are never whole; decimals and fractions on separate lines; no room between fractions; ordering negatives by size; bigger denominator means bigger; the same-numerator rule over-applied to same denominators; benchmark misread; close means equal; digit reasoning that lands right; a drawing as proof; recording the tick; plotting like a bar chart; adding tops and bottoms; "altogether" means add; reading 25% as 25.

## The game or activity

**(a) Cut Board, model `fair-cut-v1`.** A square tart (4 × 4 grid), a round pie and a 3 × 4 tray bake. The child places straight cuts from a set of authored guide lines (edge to edge, corner to corner, through the center); **Show the grid** overlays squares and **Count squares** labels each piece's area. **Check sizes** reports equal or unequal by area only, never by shape. A gallery asks for a second way to make the same fair shares. Round pies use center cuts only, so equal angle means equal size. *A made-up model: tarts on an exact grid; no crumbs.*

**(b) Share Tray, model `share-tray-v1`.** Three modes. **Set mode:** 12 buns (or 8, 20, 40 items) dealt into 2-10 group mats, one round at a time; packing groups shows "3/4 of 12 is 9". **Pie mode:** 3 pies among 4 traders or 6 loaves among 10 rowers: each whole is cut into as many parts as people, then dealt; the plate shows "3 pies shared by 4 is 3/4 each" and a check row multiplies back. **Recipe card mode:** a card for 4 pies on a double number line; the child finds one pie first, then any count from 1 to 8. A bundle share (Keeper's Desk) sets a bar of 3 + 5 parts under 40 apples. *A made-up model: identical buns and same-size pies; recipes are not real baking amounts.*

**(c) Counter Line, model `counter-line-v1`.** A brass line from 0 to 3 along the counter edge, every whole the same length. **Split each whole** into 2, 3, 4, 5, 6, 8 or 10 equal spaces; **Jump** from 0 one space at a time, with a spoken count ("one fifth, two fifths, three fifths") and a readout that names whole-number landings (4/4 lands on 1). **Zoom in** splits every space in two again (quarters to eighths to sixteenths). **Name the point** offers two labels for a tenths point (0.3 and 3/10). Keeper's Desk extends the line left to −2 for the cold cellar and adds a symbol strip (=, ≠, <, >, ≤, ≥). Unlike spec 52's ribbon, the child does not construct the partition by cut guides here; spec 52 remains the construction bench. *A made-up model: an exact line; the cold cellar is pretend.*

**(d) Comparing Shelf, model `compare-shelf-v1`.** Two or more fraction bars on **one** whole of fixed length. **Mark half** and **Mark one** draw landmarks; **Cut to same-size parts** re-cuts every bar into a shared denominator chosen by the child from offered multiples (12, 24, 30, 15), showing each new count; **Order them** places cards on a line. Bars on different wholes (Nuria's bigger pie) appear only side by side with their own outlines and a "different wholes" label. *A made-up model: exact bars; Vadoalto's pie size is invented.*

**(e) Measuring Strip, model `measure-strip-v1`.** A strip marked in inches with half and quarter marks, labeled at first and fading to unlabeled. Authored breadsticks snap to the nearest quarter inch; the child reads the end and says the value. **Add an X** places one X per breadstick on a line plot whose marks match the strip, every quarter mark present; **Show the totals** opens the jug-sharing extension in eighths. *A made-up model: lengths are authored, not measured; a real ruler is the off-screen invitation.*

No timers, scores, streaks, medals or locks. Every bench is open from the first visit.

## Problem sets

Six sets, **37 items**, full text in the companion:

| Set | Depth | Items | Formats |
| --- | --- | --- | --- |
| A. Equal parts | Sprout (A1-A3), Seedling (A4-A6) | 6 | 3-choice (pictures), sort |
| B. Parts of a set, parts of an amount | Seedling (B1-B3), Sapling (B4, B5) | 5 | number, 3-choice, number with bar model |
| C. Sharing several wholes, recipes and traders | Sapling (C1-C3), Keeper's Desk (C4-C6) | 6 | 3-choice, number with worked steps |
| D. The Counter Line | Seedling (D1, D2), Sapling (D3-D5), Keeper's Desk (D6, D7) | 7 | 3-choice, sort, order with symbols |
| E. Which is more? | Seedling (E1, E2), Sapling (E3, E4), Keeper's Desk (E5-E7) | 7 | 3-choice, order, *say why* |
| F. Measures and mixed problems | Seedling (F1), Sapling (F2, F3), Keeper's Desk (F4-F6) | 6 | 3-choice, plot then number, fix it, number |

Sprout items use no numbers. Over the 21 three-choice items the right answer sits at A, B and C seven times each. Evidence-specific withholding distractors: A2 ("can't know without tasting"; the grid shows sizes), B3 ("can't tell until cut"; both wholes are shown), D6 ("only 1/3"; zooming shows more). E5 offers the right fraction with digit reasoning beside the right fraction with a size reason, as the comparison research asks. Construction sits beside selection: A5 sort, D4 sort, D7 and E4, E6 orders, F2 plot, F3 fix. *Say why* (E7) is spoken to a grown-up and never stored or graded.

## Saved work

Optional root `fairShares` per explorer, absent until a first explicit action.

```
fairShares: {
  version: 1,
  cuts:    { [shapeId]: { source, cuts: [guideId], at } },                 // latest per shape, max 6 cuts
  trays:   { [caseId]: { source, groups: [0-40], packed: [index], at } },   // max 10 groups
  line:    { [caseId]: { source, spaces: 2|3|4|5|6|8|10|16, jumps: 0-48, at } },
  shelf:   { [caseId]: { source, common: 12|15|24|30|null, order: [cardId], at } },
  plots:   { [plotId]: { source, marks: [0-24], at } },                     // quarter-inch index from 3 in
  answers: { [itemId]: { source, choice | value | order | sort | fix | plot, support: ['hint'|'example'|'skip'], at } }
}
```

`source` freezes the model version and the item's choices, cards and order. Codes and numbers only: guide, group, card and mark ids and integers, never free text (fraction answers are stored as integer numerator and denominator pairs). Never recompute or rewrite saved results on load (a saved cut set keeps its guides, not a fairness verdict); validate ids and ranges only. An unreadable entry stays raw and exportable while the rest stays open. Support stays separate from answers; no mastery flag. Shared export, import, reset and explorer switching. No state is read from or written to `sharingCounter`, `fractionTrail` or any other root.

## Curriculum fit

**Strands:** **M3** fractions (meaning, of a set and amount, number line, comparison); **M2** division as sharing and scaling; **M5** measurement and line plots; **H1** a papyrus and a problem book as sources. Act families: II, III, with revisits in V.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Make and judge equal parts by size; name unit and non-unit fractions; find fractions of sets and amounts; compare the same fraction of different wholes; share several wholes as a fraction; scale from one and share in a ratio; place a/b by unit jumps, past 1, between fractions, with decimals and negatives; compare and order fractions by part size, landmarks and same-size parts, and justify; measure to the nearest quarter inch and plot; say it exactly. |
| Teaching encounter | T1-T17 with step-revealed worked examples; a guided first item per bench. |
| Contrast | As listed in The lesson. |
| Supported practice | Grid counts; dealt groups; double number line; spoken jump counts; zoom; landmarks and re-cut bars; snapping strip; the "I'm stuck" ladder. |
| New application | Bramble's square tart; the traders' pies and bundle share; the rowers' loaves (Rhind); Nuria's thirds; the cold cellar; the breadstick plot and jug share. |
| Purposeful revisit | Spec 43 (loaf and bun shares); spec 52 (ribbon line, 5/4); specs 70 and 100 (same point, new cuts); spec 74 (same-loaf comparison); spec 103 (joined pieces); spec 45 (reading a scale). |
| Data boundary | Cuts, groups, jumps, orders, marks, choices, values and support codes, all local. No timing, free text or location. |

## Upstream check

Refreshed upstreams: Jane `0ec55f7e083976e6fcc3977fca460b1f5e199d91` and Marble `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (both 2026-10-24). Ids confirmed in the pinned `curriculum/marble/topics.json`. Many targets share a title; each is named here by its description.

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Fractions as parts of shapes (`mt_idbKDrf9qZ`) | Equal area throughout; look-alike first, then varied cuts; check by grid or rearranging before naming; count regions, not lines. Cut Board, T1-T2, A1-A6, paper-tart invitation. |
| Fractions of a whole: whole numbers as fractions (`mt_AYzE1EAvI0`) | Iterate to a whole; a·b/b beyond 4/4; denominator 1 means uncut; informal division test. T10, D4, Counter Line readout. |
| Understanding fractions: a/b as unit sums (`mt_09sySPqM9Z`) | Jumps of 1/b from 0, spoken aloud, crossing 1; denominator fixed; line long enough. T9-T10, D2, D3. |
| Understanding fractions: representations, 7-8 (`mt_dXq9VWm31W`) | Number line as fraction magnitude; contrast 3/4 with 3 and 4; units kept on every number; bar model before equation. D1, B5's bar, T17. |
| Fractions on a number line: representations, 8-9 (`mt_3VmBdlAeOZ`) | Same point for 0.3 and 3/10; exact scales; build, not only match. D5, Name the point. 4 × 23 area model narrowed out. |
| Fractions on a number line: representations, 9-10 (`mt_CUmjcE7W6c`) | One representation for fraction, decimal and percent as one magnitude; "per hundred" first. F6, Counter Line labels. Long multiplication narrowed out. |
| Fractions on a number line: one line for all numbers (`mt_PsylzZ9lHW`) | One line for negatives, decimals, fractions; zoom shows no smallest step; leftmost is least. T11, D6, D7. Large whole numbers left to spec 188. |
| Fractions on a number line: ordering with symbols (`mt_uDJY0X0hgo`) | Order by position; convert to compare; ≠, ≤, ≥ beside <, >, =; bait digit-size errors with negatives. D7. |
| Comparing fractions: same numerator or denominator (`mt_HnKbuCliNS`) | Same whole only; reason by part size and count; the two cases are different comparisons. T12, E1, E2, guided shelf item. |
| Comparing fractions: different numerators and denominators (`mt_SXbZ3bC9z7`) | Both benchmark and common denominator; justify with a model; no flip rule. T13-T14, E3, E4. |
| Comparing fractions: including past 1 (`mt_PL9VkDwXfh`) | Common denominator as the general method; gap-to-one only for clustered sets; one set where digits and value diverge. E5, E6. |
| Understanding fractions: argument and critique (`mt_2ESZh70NyS`) | A drawing or example is not a proof; a reason that holds without the picture; right verdict, wrong reason is not enough. E7 (spoken), E5 choice C, Scene 3. |
| Understanding fractions: precise language (`mt_HY8Yycu_rz`) | Produce or repair notation; numerator and denominator by role; units on answers; money with two places. F3 (fix it), T3, T17. Money is US dollars and cents. |
| Fractions of a whole: fraction as division (`mt_4Km38F4L-6`) | Share several wholes; feel "not enough" first; close with the inverse check; reversal and "impossible" only as distractors. Pie mode, T6, C1, C4, Scene 2. |
| Understanding fractions: scaling and rates (`mt_ZOJ6EbdPOb`) | Multiplicative, not additive; up and down; a non-whole factor; find one first. T7, C2, C3, recipe card mode. |
| Understanding fractions: unequal sharing (`mt_FnUJMXPUZX`) | The child chooses the number of bar parts; part-to-whole fraction contrasted with 3/5; check the shares sum. T8, C5, Scene 2. |
| Fractions of a whole: fraction times whole number (`mt_HJA2Oz-Zh1`) | Denominator fixed while counting groups; interpret eaten vs bought; round only whole-bought things. C6. Formal multiplication left to sibling 198. |
| Halves and quarters: measuring (`mt_ghK1mnEstc`) | Labeled quarter marks first, then faded; strip and plot share one spacing; one X per object; 4 1/2 = 4 2/4 at one mark. T15-T16, F1, F2, Measuring Strip. |
| Understanding fractions: line plots of measures (`mt_IHipFGTFEY`) | A true scale with empty marks; combine in a common unit; redistribute as total ÷ count. F2, F4. Adding unlike fractions recapped in eighths only. |
| Comparing fractions: mixed fraction problems (`mt_SsLWS_APM7`) | Mixed problem types; misleading key words; plausibility check every time; sense-making before operation. Set F mix, F5, B5 explanation, stuck ladder step 2. |

Research text (CC BY-SA 4.0, © Generative Spark, Inc.) is paraphrased as design notes, never reproduced; worked numbers differ from the research's own examples except where a standard case (3/8 vs 3/4, 3 ÷ 4) is the point of the contrast.

**Jane:** adopted teach → guided → practice, the three-step "I'm stuck" ladder, short second-person prompts, three-option choices with misconception-tagged distractors and per-choice feedback, step-revealed worked examples and a glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, points, streaks. No Jane code or text copied.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| `mt_idbKDrf9qZ` | Fractions of a whole (`mt_ndGqFPWyen`) | Met elsewhere: spec 52 (Fraction Trail, main); T3 recap. |
| `mt_idbKDrf9qZ` | Splitting shapes into equal parts, age 7+ (`mt_Xp-rj46S2w`) | Supported inline (T1-T2, Cut Board); no claim. Documented gap: spec 43 declines to map it, spec 52 lists it as a scope exception (different-shaped equal shares), and it is in no build-out pack. |
| `mt_AYzE1EAvI0` | Fractions of a whole (`mt_ndGqFPWyen`) | Met elsewhere: spec 52. |
| `mt_09sySPqM9Z` | Fractions of a whole (`mt_ndGqFPWyen`) | Met elsewhere: spec 52. |
| `mt_dXq9VWm31W` | Connecting Representations (`mt_EBYGhd8X3x`) | Met elsewhere: proposed spec 204 (math build-out); story, bar and sentence linked inline. |
| `mt_3VmBdlAeOZ` | Understanding fractions (`mt_dXq9VWm31W`) | Taught here (D1 before D5). |
| `mt_CUmjcE7W6c` | Fractions on a number line (`mt_3VmBdlAeOZ`) | Taught here (D5 before F6). |
| `mt_PsylzZ9lHW` | Reading and writing numbers to 10,000,000 (`mt_Gag_h98jWP`) | Met elsewhere: proposed spec 188 (math build-out). |
| `mt_uDJY0X0hgo` | Positive and Negative Numbers (`mt_9QzSnn8m80`) | Met elsewhere: proposed spec 189 (math build-out); recap in D7's steps. |
| `mt_uDJY0X0hgo` | Fractions on a number line (`mt_PsylzZ9lHW`) | Taught here (D6 before D7). |
| `mt_uDJY0X0hgo` | Measuring temperature (`mt_RVK655t391`) | Met elsewhere: proposed spec 189; the cold cellar is a recap. |
| `mt_HnKbuCliNS` | Comparing fractions, unit fractions (`mt_IfEgu0X449`) | Met elsewhere: spec 74 (`share-compare`, main). |
| `mt_HnKbuCliNS` | Fractions of a whole (`mt_ndGqFPWyen`) | Met elsewhere: spec 52. |
| `mt_SXbZ3bC9z7` | Equivalent fractions, age 9+ (`mt_ebPelt-qAl`) | Met elsewhere: proposed spec 197 (math build-out); same-size re-cuts recapped in T14. |
| `mt_SXbZ3bC9z7` | Comparing fractions, age 8+ (`mt_HnKbuCliNS`) | Taught here (E1-E2 before E3-E4). |
| `mt_PL9VkDwXfh` | Simplifying Fractions (`mt_b7T-CjOYUR`) | Met elsewhere: proposed spec 197. No item needs simplest form. |
| `mt_PL9VkDwXfh` | Comparing fractions, age 9+ (`mt_SXbZ3bC9z7`) | Taught here (E3-E4 before E5-E6). |
| `mt_2ESZh70NyS` | Justifying mathematical reasoning, age 8+ (`mt_a3dov8CZkq`) | Met elsewhere: proposed spec 205 (math build-out). |
| `mt_HY8Yycu_rz` | Precise Maths Communication (`mt_TMoHjMhRS2`) | Met elsewhere: specs 50 and 51 (main). |
| `mt_4Km38F4L-6` | Multiplying fractions (`mt_TgHxujL81r`) | Met elsewhere: proposed spec 198 (math build-out); the check 4 × 3/4 is shown as four lots of 3 quarters. |
| `mt_HJA2Oz-Zh1` | Multiplying fractions (`mt_TgHxujL81r`) | Met elsewhere: proposed spec 198; C6 counts eighths. |
| `mt_ZOJ6EbdPOb` | Multiplicative Comparison (`mt_6-j1NO2ZUH`) | Met elsewhere: proposed spec 191 (math build-out). |
| `mt_FnUJMXPUZX` | Simplifying Fractions (`mt_b7T-CjOYUR`) | Met elsewhere: proposed spec 197. |
| `mt_FnUJMXPUZX` | Bar Models for Ratios (`mt_ePXg_XyCKU`) | Met elsewhere: proposed spec 201 (math build-out); bar shown in T8. |
| `mt_FnUJMXPUZX` | Percentages, age 9+ (`mt_ESgc4YBw-a`) | Met elsewhere: proposed spec 200 (math build-out). Not used in C5. |
| `mt_FnUJMXPUZX` | Ratio Problems (`mt_h0gJcSuwdL`) | Met elsewhere: proposed spec 118 (draft PR #126, Keeper's Desk 2). Documented gap if 118 does not ship. |
| `mt_IHipFGTFEY` | Adding Fractions, unlike denominators (`mt_14T5yPXUq_`) | Met elsewhere: proposed spec 197; F4 recaps by counting eighths. |
| `mt_IHipFGTFEY` | Measurement Line Plots (`mt_42QD6nYjiZ`) | Met elsewhere: proposed spec 203 (math build-out); T16 recap. |
| `mt_ghK1mnEstc` | Measuring & Plotting Lengths (`mt_mayItsxMUu`) | Met elsewhere: proposed spec 203. |
| `mt_SsLWS_APM7` | Simple Fraction Sums (`mt_a1FdAsRKOF`) | Met elsewhere: proposed spec 197 (spec 103 supplies joins on main). |
| `mt_SsLWS_APM7` | Unit fractions (`mt_k2WE0-22-4`) | Met elsewhere: specs 43 and 74 (main). |
| `mt_HJA2Oz-Zh1`, `mt_4Km38F4L-6` and the rest | Soft prerequisites | Not crosswalked (soft edges are context, not access). |

Claim check, 2026-10-25: no spec on main or any draft PR (126, 128, 137-151) claims the 20 targets. Spec 103's audit lists `mt_09sySPqM9Z` as an inspected predecessor with "no assessed notation or number-line construction", and draft spec 187 supports `mt_uDJY0X0hgo` inline with no claim; neither is a claim.

## Checks for implementation

- **Numbers script (2026-10-25):** `check196.py` (`python3 -I`), 110 checks passing: grid areas (each corner-to-corner triangle, strip and small square of a 16-square tart is 4); three cuts make 4 parts; 3 of 12 squares is 1/4; 1/4 and 3/4 of 12 are 3 and 9 (wrong 4, 8); 1/2 of 8 = 1/3 of 12 = 4; 3/5 of 20 = 12 (wrong 4, 15); 3 ÷ 4 = 3/4 with 4 × 3/4 = 3 (wrong 4/3); 6/10 = 3/5 = 1/2 + 1/10; the Rhind 7, 8, 9 loaf answers (2/3 + 1/30; 2/3 + 1/10 + 1/30; 2/3 + 1/5 + 1/30) and 2/5 = 1/3 + 1/15, 2/3 = 1/2 + 1/6, 2/7 = 1/4 + 1/28; recipe 12 cups (wrong 10), half recipe 4; 5 loaves $20 (wrong $14); 40 in 3:5 is 15 and 25, 3/8 (wrong 20 and 20; 3/5 of 40 = 24); 5 × 3/8 = 15/8, bake 2 (wrong 15/40); 3 × 1/5 = 3/5 (wrong 3/15); 7/4 between 1 and 2; 4/4, 8/4, 6/3, 3/1 whole, 5/2 not; 0.3 = 3/10; 3/8 halfway between 1/4 and 1/2, and 1/3 and 5/16 also between; −1 < −1/2 < 0.5 < 3/4 < 7/4 (unique); 1/4 = 25/100 = 0.25; 5/6 > 2/6; 3/4 > 3/8; 3/7 < 1/2 < 5/8; 3/5 < 2/3 < 7/10 as 18, 20, 21 thirtieths (denominator and numerator orders differ); 7/5 = 21/15 > 4/3 = 20/15; 3/4 < 5/6 < 7/8 < 11/12 as 18, 20, 21, 22 twenty-fourths; 2/3 = 8/12 < 3/4 = 9/12; breadstick end nearer 4 1/2; 3 of 6 breadsticks longer than 4 1/2, empty mark at 4 1/4; jugs 6 + 4 + 7 + 7 eighths = 3 cups, 3/4 each (wrong 18/22); 3/4 of 20 = 15 (wrong 23, 80); $3.5 = $3.50 ≠ $3.05; 21 three-choice items at A, B, C seven each; 37 items. Audit-only: 5/8 = 125/200 < 16/25 = 128/200, difference 3/200 (the `[check]` Nine Chapters example).
- Cut Board judges fairness by area only; round pies use center cuts. Pictured comparisons always share one whole; different wholes stay labeled. Line spacing exact; zoom never relabels a point. Model lines show on every bench. Sprout items show no numbers; feedback never says "wrong".
- Style check (`style196.py`) run on all three files: 0 em-dashes; teach cards at most 30 words; prompts at most 15 words; feedback and explanations at most 20 words; scene Short at most 30, Longer at most 150, notes at most 80; no "wrong" in child text; Hollis never named; 172 checks, 0 problems.
- Browser at 320 and 820 px: targets 44 px; cuts, deals, jumps and orders by tap as well as drag; every picture has a text equivalent ("Four triangles, each 4 squares: quarters"); symbols are read aloud ("less than or equal to").
- Nuria's Spanish lines checked by a fluent reader before build.

- **Independent review, 2026-10-25.** Recomputed every item, worked example, model number and "I'm stuck" case in a separate reviewer script (`python3 -I`, scratch area; 205 checks across specs 196-198, all passing after fixes), recounted positions (21 three-choice items, A/B/C 7/7/7) and items (37), and re-checked distractor feedback, Marble descriptions and research records, hard prerequisites against the pinned `dependencies.json`, claims, story adapters (spec 120 act and chapter names, pronouns, Hollis rule), style (0 em-dashes in all three files; word limits) and saved-work rules. Rhind problem 3 (1/2 + 1/10) was re-confirmed by search. Changed: C1 feedback A (four traders at 4/3 need 16/3 pies, not 4); E4's second distractor order (7/10, 3/5, 2/3); E6's distractor tag (ordering by top number gives the right order here; the tag now names the 1/8-vs-1/6 gap error); F1 choice B now names the tick correctly as the second line after 4; route `#cafe/shares` changed to `#cafe/pies` so it does not read as spec 43's `#cafe/sharing`; `mt_9KmVWCuh5_` offered to sibling 205; a boundary line with sibling 198's Scaling Dial; spec 52's scope exception added to the `mt_Xp-rj46S2w` gap row. Benches checked against specs 43, 45, 52, 70, 74, 79, 100, 103 and siblings 197 and 198: no bench repeats theirs.

## Review asks

**Math expert:**
1. Is grid-square counting with corner-to-corner cuts (half-squares paired) a fair equal-area check at Sprout, or should Sprout see only cut-and-rearrange?
2. Is it right to keep 4/3 and "can't be done" as C1 distractors, given the research's instruction to show reversal only as a labeled option?
3. Does E5's choice C (right fraction, digit reason) read clearly as not the right choice, without feeling like a trick?
4. Are the Rhind loaf answer and the Nine Chapters card fair at this depth?

**Owner questions, with defaults:**
1. Route `#cafe/pies` (changed in review from `#cafe/shares`, which read as spec 43's `#cafe/sharing`)? *Default: yes, with the place title "The Pie Counter" on every link.*
2. Twenty targets in one pack, or split the Keeper's Desk number-line and ratio items into a later slice? *Default: one pack; the Counter Line's negative extension and C5 can ship later.*
3. Drop `mt_9KmVWCuh5_` (equations and coordinates under a fractions title)? *Default: yes; offered to sibling 205.*
4. First slice? *Default: the Cut Board with Set A, then the Share Tray with Set B.*
