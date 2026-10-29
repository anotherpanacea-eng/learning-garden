# 185. Fences and Plots: covering, going around, and sharing land fairly

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a math check.** Part of the [math build-out](https://github.com/anotherpanacea-eng/learning-garden/pull/154). Every child-facing line is in [the companion text](../content/185-fences-and-plots-text.md); sources and open checks are in the [source audit](../source-audits/185-fences-and-plots.md).

**Commissioning boundary:** a proposal only. Select a bounded first slice after independent content, model and save review; the five benches do not commission each other. All Act and chapter links are future adapters to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (draft PR #127). Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter. **Fact-check status:** history facts checked against search excerpts on 2026-10-25 (fetches blocked); no `[check]` item is in child text. The math is standard and still needs the math check.

## Purpose

Measurement has seven pinned area and perimeter topics with no reference. The built Number Garden measurement area asks three single rectangle items (a tiled mat, a fence around a bed, a missing fence side), and merged [spec 96](96-garden-paving.md) grows an n-by-n square of countable tiles while explicitly claiming no area. Nobody yet teaches **what area is**, **why rows × columns counts the squares**, **splitting a rectangle** (the distributive property), **L-shapes**, **missing sides on a fence**, or **why the same ground can need different fences**. This pack takes those seven topics, plus the two whose pinned descriptions are rectangle area and perimeter by formula (nine claimed targets).

A child comes to understand that area is covering with unit squares, edge to edge, with no gaps or overlaps; that moving the same squares keeps the area; that a rectangle's squares sit in equal rows, so rows × squares in a row counts them, and then length × width does too, in square units fit for the job (cm², m²); that one cut splits a rectangle into two areas that add back to the whole (7 × 8 = 7 × 5 + 7 × 3); that an L-shape's area comes from splitting or from taking the missing corner away, with one answer either way; that perimeter is the once-around distance, a length, found by adding every side once after finding the missing ones; that the formulas length × width and 2 × length + 2 × width work both ways (a missing side from the area); that a bumpy shape's area can be estimated by counting part squares; and that area and perimeter can change separately.

**Builds on, never re-teaches:** spec 96's conserved old tiles and counted patches (here: tiles become unit squares, and the count becomes an area with a unit); the Number Garden's tiled mat, fence-around and missing-width items (here: the reasons behind them and compound shapes); spec 38's equal groups and unknown factors (here: B6); spec 45's measuring with standard units; spec 134's Nile flood year (here: re-measuring land after the flood, card H1). **Also targeted (reassigned to this pack on review, 2026-10-25; pinned names mislead, descriptions decide):** *Understanding angles (age 8+)* (`mt_GzcJEVkNRn`, whose pinned description is rectangle area by multiplying side lengths, and the reverse; T5-T6, B1-B6) and *Estimating answers (age 9+)* (`mt_eiB3-6pu6a`, whose description is the rectangle area and perimeter formulas with cm² and m², used both ways, and estimating irregular areas; T6, T7, T10, T13, B6, B7, D1). **Not targeted:** *Perimeters of polygons* and *Area (age 8+)* (declared Number Garden references); triangle, parallelogram and circle area (sibling spec 186); unit conversion between cm² and m².

## Place and story

**Host:** the **Allotment Plots**, the community plots past the four beds at the edge of the regrown garden, route `#regrow/plots`, linked from the garden scene (spec 21), spec 127's Four Beds (`#regrow/beds`, draft PR #128) and spec 96's paving table. Open from the start; no bench requires another. The allotments are a separate scene from spec 21's planting plots and do not touch `plantings`.

| Act and chapter (future adapters to spec 120) | Beat (full text in the companion) | Job depths |
| --- | --- | --- |
| I, ch. 4 *mend the village* | The storm washed the plot pegs into the brook and knocked the fences flat. Hob Pennick: every plot was 6 m by 4 m. How much ground inside, and how much fence around? | Sprout: Tile Tray. Seedling: Row Planter. Sapling: Fence Walk. |
| II, ch. 2 *a garden across the seasons* | Three new families get 24 squares each. Bramble's 2 by 12 strip "is biggest, it has the most fence". Same ground, different fence. | Seedling: count and compare. Sapling: Same Ground table. |
| IV, ch. 4 *the proposal for the low fields* | The orchard keeper asks how much of her L-shaped low field *Some of Each*'s wet meadow would take, so she can say a number at the meeting. | Sapling: split or subtract. Keeper's Desk: area and fence of the low field, the acre card. |
| V, *a night garden* (project path) | A kept plot plan can start the night garden's layout. | Any depth. |

One shared scene per chapter; any job is a whole contribution; nothing locks a story place. The town, plots, fields and numbers are fiction, labeled apart from math, history and models. The old Keeper is not named in Acts I and II (Hollis rule); the Act IV scene says only "the old map" and needs no name.

## The knowledge

**Area as covering.** Area is the amount of flat surface inside a boundary. Choose a unit, a square, and count how many cover the shape **edge to edge, with no gaps and no overlaps**. One unit square has area 1 square unit; a shape covered by 12 has area 12 square units. A gap leaves ground uncounted; an overlap counts ground twice. Moving the same squares into a new shape keeps the area (12 squares as 3 × 4, 2 × 6 or 1 × 12). "Longer" or "taller" is not "more ground": a 1 × 10 strip covers 10, a 3 × 4 block 12. Every area answer carries square units.

**Rows and columns, then length × width.** A rectangle's unit squares sit in equal rows. Count one row, then count on by rows (6, 12, 18, 24), then multiply: 4 rows of 6 is 4 × 6 = 24. Turning the rectangle (6 rows of 4) keeps the squares, so 4 × 6 = 6 × 4. When the sides are lengths, each meter along one side is one more square in a row, and the other side counts the rows: area = length × width (7 m by 5 m is 35 m²). Adding the sides (12) or going around (24) measures something else. The multiplication grows from the array; it is never given as a bare rule first.

**Estimating a bumpy shape (T13, B7).** A pond is not a rectangle. On a 1 m grid, count whole squares, then count a part square only if at least half of it is covered, and leave slivers out. The answer is an estimate and says so: B7's pond is 10 whole squares plus 4 more than half covered, about 14 m² (10 forgets the parts; 16 counts every touched square).

**Choosing the square.** Small things in square centimeters (cm²), plots and fields in square meters (m²); a length unit (cm, m) never measures area. Conversions between them are out of scope.

**Splitting a rectangle (distributive property).** One straight cut makes two rectangles that keep the uncut side: 7 × 8 split as 8 = 5 + 3 gives 7 × 5 + 7 × 3 = 35 + 21 = 56. Splitting at ten is a calculation strategy: 6 × 13 = 6 × 10 + 6 × 3 = 60 + 18 = 78. Both directions are practiced: read a cut picture into numbers, and cut a picture for given numbers. Every split of 7 × 8 totals 56. The repeated factor stays on both pieces (the common slip writes 6 × 10 + 3).

**L-shapes (compound area).** Area is additive. Split a rectilinear shape into rectangles that do not overlap, find each area, and **add** (never multiply). Or take the missing corner away from the surrounding rectangle. The pack's Plot L (made-up): 8 m along the bottom, 6 m up the left, a 3 m by 2 m corner missing at the top right. Split: 8 × 4 + 5 × 2 = 32 + 10 = 42 m²; split the other way: 5 × 6 + 3 × 4 = 30 + 12 = 42; subtract: 48 − 6 = 42. The top piece's width is not printed: 8 − 3 = 5. Pieces that overlap (8 × 4 and 5 × 6 give 62) count a 5 × 4 block twice. Treating the L as its whole rectangle (48) forgets the notch. The Act IV low field (made-up): 60 m by 40 m with a 20 m by 20 m corner missing: 2400 − 400 = 2000 m², or 1200 + 800; the wet meadow, 30 m by 20 m, takes 600 m² and leaves 1400.

**Perimeter.** Perimeter is the distance once around the boundary, a length, in cm or m. Add every side once. A rectangle with two sides labeled has two more equal to them (6 m by 4 m: 6 + 4 + 6 + 4 = 20 m, not 10). For a rectangle, 2 × length + 2 × width gives the same total (D1: 2 × 6 + 2 × 4 = 20 m). Equal sides: number of sides × side (a six-sided herb bed with 2 m sides: 12 m). **Missing sides on an L:** across the shape in each direction, the sides on one edge add up to the sides on the opposite edge, so a missing side is found by adding or taking away (Plot L: top 8 − 3 = 5, right 6 − 2 = 4; fence 8 + 6 + 5 + 2 + 3 + 4 = 28 m). Inside cut lines are not fence (counting the 8 m cut gives 36). A corner cut out of a rectangle moves the fence in without shortening it: Plot L and the low field have the same perimeter as their rectangles (28 m; 200 m).

**Same ground, different fence.** Knowing one of area or perimeter does not fix the other. With area fixed at 12 m², rectangles 3 × 4, 2 × 6 and 1 × 12 need 14, 16 and 26 m of fence; at 24 m², 4 × 6, 3 × 8, 2 × 12 and 1 × 24 need 20, 22, 28 and 50 m. With 20 m of fence fixed, whole-meter rectangles hold 9, 16, 21, 24 and 25 m² (1 × 9 to 5 × 5). More ground can need less fence (1 × 9: 9 m², 20 m; 4 × 4: 16 m², 16 m). They are not wholly unrelated: a fixed fence limits how much it can hold, and the square holds the most of these rectangles. The intuition "same area, same perimeter" is confronted with built cases and a table, and the reasoning is probed (E6, say why), since a right answer can come from the wrong rule.

**Real anchors (see audit).**
- **Measuring after the flood.** In *Histories* book 2 (section 109), written in the 5th century BCE, Herodotus reports what he was told in Egypt: a king gave each Egyptian an equal plot and taxed its yield; when the Nile carried part of a plot away, measurers were sent to find how much land remained so the tax could be lowered. Herodotus offers his own view that the Greeks learned land measuring (geometry) from this. Translations differ on whether the plots were square, so child text says "a plot". Scholars note later writers may simply repeat Herodotus. The tomb chapel of Menna (TT69, Sheikh Abd el-Qurna, Luxor; 18th Dynasty), whose owner was an overseer of fields, has a scene of men measuring a field with a rope. Child text says only "more than 3,000 years old" and "with a rope". The Greek word *harpedonaptai* ("rope stretchers") rests on a fragment of doubtful authenticity and stays in the audit.
- **The acre.** The English acre began as about the land a team of oxen could plow in a day, with no fixed dimensions; it was later fixed by statute. One customary shape was a long strip 1 furlong by 1 chain (40 by 4 rods, 660 by 66 ft). The modern acre is 4,840 square yards (22 × 220 = 10 square chains), about 4,047 m² or 0.4 hectare, and any shape with that area is one acre. E4 compares a 1 × 10 chain strip (22 chains of fence) with a 2 × 5 shape (14 chains). Keeper's Desk only.
- **The Rhind papyrus.** An Egyptian book of worked problems, copied about 1550 BCE by the scribe Ahmes (Ahmose), mostly held at the British Museum, includes a problem (number 49) on the area of a rectangular plot of land. Its stated dimensions and a scribal slip are unsettled across sources, so child text gives no numbers. Keeper's Desk only.

## The lesson

Jane's **teach → guided → practice** order on every bench: a teach card with a step-revealed worked example, a guided first item with 1-4 visible steps, then practice.

| Bench | Teach | Guided | Practice |
| --- | --- | --- | --- |
| Tile Tray | T1-T3 | Block or long strip? (3 steps) | Set A |
| Row Planter | T4-T7, T13 | 4 rows of 6 (3 steps) | Set B |
| Split Board | T8, T9 | 4 × 12 as 4 × 10 + 4 × 2 (3 steps) | Set C |
| Fence Walk | T10, T11 | A 5 m by 2 m plot (3 steps) | Set D |
| Same Ground | T12 | 12 squares, two rectangles (3 steps) | Set E, puzzles P1-P2 |

**"I'm stuck" ladder** on every item: (1) the hint; (2) an easier worked case plus how to start this one (the companion lists eleven); (3) **Skip for now**, no penalty, nothing recorded against the child.

**Contrasts:** covered vs gapped vs overlapped; longer vs more ground; moved vs added squares; count by ones vs by rows; rows × in a row vs adding sides; m² vs cm² vs m; one factor on both pieces vs dropped; split vs subtract; non-overlapping vs overlapping pieces; inside line vs fence; labeled sides vs all sides; cut corner vs shorter fence; same area vs same fence.

**Top misconceptions designed against:** gaps and overlaps don't matter; longer or taller means more area; rearranging changes area; area as a bare number or in a length unit; adding the sides for area; turning changes area; 4 × 6 is a rule with no reason; dropping the factor on one piece; adding side lengths instead of areas; forgetting to add the pieces; the L as its whole rectangle; overlapping pieces; multiplying the pieces; adding only the labeled sides; copying a nearby number for a missing side; counting inside lines; a cut corner shortens the fence; same area means same perimeter (and the reverse); bigger area means bigger perimeter.

## The game or activity

**(a) Tile Tray, model `plot-tiles-v1`.** A plot outline on a tray and a box of square tiles. Tap a cell to place a tile, tap again to lift it; **Move** slides a tile. Gaps show as bare soil, overlaps as a raised double tile, each with its own text label. **Count** numbers the tiles only when there are no gaps or overlaps. **Compare two plots** puts two outlines side by side (the guided pair: a 3 × 4 block and a 1 × 10 strip). *A made-up model: each tile is one square unit and snaps edge to edge.* Sprout plays with pictures and no numerals; Seedling sees counts.

**(b) Row Planter, model `plot-rows-v1`.** A rectangle builds one full row at a time; the running line reads "4 rows of 6: 24 squares", and skip-counts appear under each row. **Turn the plot** rotates 90 degrees and swaps the numbers. **Show the side lengths** labels the edges in meters, connecting rows × squares in a row to length × width. A **units** toggle shows a seed tray in cm² and a plot in m², and a fence in m to show what a length is. Rectangles 1-10 by 1-10. **Pond mode** lays a curved pond outline on the grid; the child marks whole squares and half-or-more squares, and the readout says "about". *A made-up model: each square is 1 m by 1 m (or 1 cm by 1 cm on the tray).*

**(c) Split Board, model `plot-split-v1`.** A rectangle or L on squares. **Cut here** places one grid-line cut; each piece shows its own "rows × in a row" and area, and **Write it as numbers** shows the matching equation (7 × 8 = 7 × 5 + 7 × 3). The child can also go the other way: given an equation card, place the cut that matches. **Take away a corner** shades the missing corner of the surrounding rectangle and shows the subtraction. Overlapping pieces are allowed so their shared block can be highlighted. Cases: 7 × 8, 6 × 13, 4 × 12, Plot L, a T-shape (6 × 2 bar on a 2 × 4 stem: 12 + 8 = 20). *A made-up model: cuts follow grid lines only.*

**(d) Fence Walk, model `plot-fence-v1`.** Pip walks the boundary; each side lights once and adds to a running total; the walk will not pass an unnumbered side until the child finds it from the opposite edge (**Find a missing side** shows the opposite sides lined up). **Show inside lines** draws the Split Board's cuts so the child sees they are not fence. Cases: rectangles with two sides labeled, a square bed, the six-sided herb bed, Plot L, the low field. *A made-up model: whole-meter sides, sides meet at square corners except the herb bed.*

**(e) Same Ground, model `plot-share-v1`.** Two modes. **Keep the ground**: the same 12 or 24 tiles rearrange into rectangles (and free rectilinear shapes on the grid); each new shape adds a row to a table of length, width, area and fence. **Keep the fence**: a 20 m rope bends into whole-meter rectangles; the table fills with areas. Puzzles P1 (24 squares, 20 m: 4 × 6) and P2 (15 m², 16 m: 3 × 5) each have one answer (brute-force checked). An open challenge (draw a rectilinear plot with 40 m of fence) stores nothing. *A made-up model: one square is one square meter; the rope stays the same length.*

No timers, scores, streaks, medals or locks. Every bench is open from the first visit.

## Problem sets

Five sets, **31 items**, full text in the companion, plus two bench puzzles:

| Set | Depth | Items | Formats |
| --- | --- | --- | --- |
| A. Covering and counting | Sprout (A1-A3), Seedling (A4-A6) | 6 | 3-choice, number |
| B. Rows, columns and length times width | Seedling (B1-B3), Sapling (B4-B7) | 7 | number, 3-choice |
| C. Splitting rectangles and L-shapes | Sapling (C1-C4), Keeper's Desk (C5, C6) | 6 | number with worked steps, 3-choice |
| D. Around the edge | Seedling (D1, D2), Sapling (D3-D5), Keeper's Desk (D6) | 6 | number, 3-choice |
| E. Same ground, different fence | Sapling (E1-E3), Keeper's Desk (E4-E6) | 6 | 3-choice, number, true / not true from this source, *say why* |

Sprout items use no numbers. Over the 15 three-choice items the right answer sits at A, B and C five times each. Three items (A2, C6, E1) carry a distractor that withholds more than the evidence requires ("you can't tell until..."), wrong because the tiles or side lengths already answer it. *Say why* is spoken to a grown-up and never stored or graded.

## Saved work

Optional root `allotmentPlots` per explorer, absent until a first explicit action.

```
allotmentPlots: {
  version: 1,
  trays:   [{ source, plotId, tiles: [cellIndex], at }],                     // latest 12
  splits:  [{ source, caseId, cuts: [{ axis: 'x'|'y', at: int }], mode: 'split'|'subtract', at }],  // latest 12
  fences:  [{ source, caseId, found: { [sideId]: int }, at }],                // latest 12
  table:   { [mode: 'ground'|'fence']: { source, rows: [{ w: 1-24, h: 1-24 }], at } },
  answers: { [itemId]: { source, choice | value | marks, support: ['hint'|'example'|'skip'], at } }
}
```

`source` freezes the model version, the case geometry and the item's choices and order. Codes and numbers only; no drawings, names or free text. Validate ids, cell indices against the frozen case and integer ranges only. Never recompute or rewrite saved results on load: a stored table row keeps its own sizes even if today's case list changes. An unreadable entry stays raw and exportable while the rest stays open. Support stays separate from answers; no mastery flag. Rolling lists announce what rolls off before a new entry. Shared export, import, reset and explorer switching through the existing notebook transfer.

## Curriculum fit

**Strands:** **M5** space, geometry and measurement (area, perimeter, units); **M2** multiplicative structure (arrays, the distributive property, unknown factors); **M7** mathematical practices (two methods, one answer; counterexamples); **H1** historical inquiry (a source read for what it does and does not say). Act families: I, II, IV, V.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Say what area measures and cover without gaps or overlaps; find rectangle area by rows × columns and length × width with square units; split a rectangle to show a × (b + c) = a × b + a × c both ways; find L-shape area by splitting or subtracting; find perimeter, including missing sides of L-shapes, and use l × w and 2l + 2w both ways; estimate a bumpy area by part squares; show that equal areas can have different perimeters and the reverse. |
| Teaching encounter | T1-T13 with step-revealed worked examples; a guided first item per bench. |
| Contrast | As listed in The lesson. |
| Supported practice | Live tile counts; row-by-row running line; cut pieces with their own equations; the Fence Walk's missing-side pause; the Same Ground table; the "I'm stuck" ladder. |
| New application | The low field (Act IV); the acre strip (E4); the T-shape; P1-P2; the 40 m open challenge. |
| Purposeful revisit | Spec 96 paving squares; Number Garden tiled mat and fence items; spec 127's beds (a kept plot plan); spec 134's Nile flood drawer (card H1); spec 186's triangle and circle area. |
| Data boundary | Tile cells, cuts, found side lengths, table sizes, choices, values and support codes, all local. No timing, free text, drawings or location. |

## Upstream check

Refreshed upstreams: Jane `0ec55f7e083976e6fcc3977fca460b1f5e199d91` and Marble `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (both 2026-10-24). Ids confirmed in the pinned `curriculum/marble/topics.json`.

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Understanding Area (`mt_6xNmQLzuqm`) | Start from covering; name the unit square; separate area from perimeter on the same shape; area kept under rearrangement; square units in every answer; predict before counting a compact block against a spread-out strip. Tile Tray's gap and overlap labels, Compare two plots, T1-T3, A1-A6. |
| Area by Tiling (`mt_Jvvh5P06NV`) | Complete rows; count by ones, then by rows, then multiply; explain why; rotate for 4 × 6 = 6 × 4; contrast with adding the sides. Row Planter's running line and Turn; T4-T6; B1-B4. |
| Area and the distributive property (`mt_AQo4u7O4sM`) | Tile, then cut; translate both ways (picture to equation, equation to cut); split at ten; keep the repeated factor on both pieces; different splits, same total. Split Board's equation cards; T8; C1, C2. |
| Area of compound shapes (`mt_eMtV6tBSJm`) | Cut before calculating; two splits, same total; derive the missing inner length; no overlaps; add, not multiply; square units. Split Board's L and T, Take away a corner; T9; C3-C6. |
| Measuring Perimeters (`mt_wE7-Gs9ENL`) | Walk around back to the start; label every side; supply the unlabeled opposite sides; equal sides × number of sides; contrast with area; keep the length unit. Fence Walk; T10; D1-D3. |
| Perimeter of Compound Shapes (`mt_n0AlyLQwC9`) | Name rectilinear and compound shapes; deduce missing sides from opposite edges; tick each side once; inside lines are not boundary; keep cm and cm² apart. Fence Walk's missing-side pause and Show inside lines; T11; D4-D6. |
| Perimeter (age 10+) (`mt_MJZA90uc6H`) | Fix one quantity and vary the shape systematically in a table; confront "same A, same B" with counterexamples; build, don't recall; probe reasoning; the fence-around-a-field intuition; note a fixed perimeter does limit area. Same Ground's two modes and table; T12; E1-E6; acre card. |
| Understanding angles (age 8+) (`mt_GzcJEVkNRn`; description: rectangle area by multiplying sides) | Keep the array meaning (squares in a row × rows) under side × side; square units every time; work in reverse (a given area to its rectangles and sides); contrast multiplying for area with adding for perimeter. T5, T6; B1-B6 (B6 in reverse); Same Ground's 12- and 24-square rectangles; P1, P2. |
| Estimating answers (age 9+) (`mt_eiB3-6pu6a`; description: area and perimeter formulas, irregular estimates) | Keep each formula tied to its meaning (covering vs going around); label cm² vs cm; use both directions (missing side from area); estimate an irregular area by whole and at-least-half squares, called an estimate. T6, T7, T10, T13; B4-B7, D1-D6; Same Ground table. |

**Jane:** adopted teach → guided → practice, the three-step "I'm stuck" ladder, short second-person prompts, three-option choices with misconception-tagged distractors, step-revealed worked examples and a glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, points. No Jane code or text copied; Marble research paraphrased, not copied.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| Understanding Area | none listed (Measuring length is soft) | n/a |
| Area by Tiling | Area (age 8+) (`mt_y1n0Zwhoca`) | Met elsewhere: built Number Garden *A tiled mat* (`#adventure/measurement-explore`, declared reference); counting unit squares also rehearsed here in T1, no claim. |
| Area and the distributive property | Understanding angles (age 8+) (`mt_GzcJEVkNRn`; pinned description: multiply side lengths for rectangle area) | Taught here (Row Planter, T5-T6, B1-B6, before the Split Board). |
| Area of compound shapes | Understanding angles (age 8+) (`mt_GzcJEVkNRn`) | Taught here (as above). |
| Measuring Perimeters | Calculating with measurements (`mt_6oxQPNLHNv`) | Met elsewhere: merged spec 45 Measuring Kitchen (`#cafe/recipes`, declared reference); adding lengths supported inline. |
| Perimeter of Compound Shapes | Perimeters of polygons (`mt_WtcFrxGOgw`) | Met elsewhere: built Number Garden fence items (`#checkin/measurement`, `#adventure/measurement-stretch-activity`, declared references); also rehearsed here in D1. |
| Perimeter (age 10+) | Estimating answers (age 9+) (`mt_eiB3-6pu6a`; pinned description: rectangle area and perimeter formulas, cm² and m²) | Taught here (T6, T7, T10, T13; Sets B and D) before Same Ground. |
| Understanding angles (age 8+) | Area by Tiling (`mt_Jvvh5P06NV`) | Taught here (T4, Row Planter rows before side lengths). |
| Estimating answers (age 9+) | Understanding angles (age 8+) (`mt_GzcJEVkNRn`) | Taught here. |
| Estimating answers (age 9+) | Perimeters of polygons (`mt_WtcFrxGOgw`) | Met elsewhere: built Number Garden fence items (declared reference); rehearsed in D1, D3. |

Claim check, 2026-10-25: no spec on main or any draft PR (126, 128, 137-151) claims the nine targets (spec 181 dropped `mt_GzcJEVkNRn` as a misfit; the build-out map now assigns both added ids here); spec 96 explicitly claims no area; the built Number Garden declares only `mt_y1n0Zwhoca` and `mt_WtcFrxGOgw`.

## Checks for implementation

- **Numbers script (2026-10-25):** `check185.py` (`python3 -I`, scratch area, not in the repo), 71 checks passing: 3 × 4 = 12 and its rearrangements 2 × 6 and 1 × 12; skip-count 6, 12, 18, 24; 4 × 6 = 6 × 4 = 24 (wrong 10, 20); 7 × 5 = 35 (wrong 12, 24); 7 × 8 = 35 + 21 = 56 and every split of 7 × 8 totals 56 (wrong 38, 15); 6 × 13 = 60 + 18 = 78 (distractors 63, 19); 4 × 12 = 40 + 8; T-shape 12 + 8 = 20 (fence 24); Plot L = 42 by cell count, by both splits and by 48 − 6 (wrong 48, 28); missing width 8 − 3 = 5 (wrong 11); overlapping split 62 with a 20-square overlap; Plot L perimeter 28 by edge count and by sides (wrong 19, 36), equal to the 8 × 6 rectangle's; right side 6 − 2 = 4 (wrong 8); B6 32 ÷ 8 = 4 (wrong 24, 16); D1 20 (wrong 10, 24); hexagon 6 × 2 = 12 (wrong 8, 4); low field 2000 m² by cell count, subtraction and split (wrong 2400, 2800), fence 200 m (wrong 140, 160); wet meadow 600 m² fits inside, leaving 1400; 12-tile rectangles 26/16/14 m; 24 m² rectangles 50/28/22/20 m; 20 m fence areas 9/16/21/24/25 with a unique maximum 5 × 5; puzzles P1 (4 × 6) and P2 (3 × 5) unique by brute force; E6 1 × 9 vs 4 × 4; acre 22 × 220 = 4840 sq yd, 4046.86 m², about 0.4 ha, 660 × 66 ft; E4 fences 22 and 14 chains, difference 8; low field about 0.49 acre; three-choice answers A5/B5/C5.
- Area answers always show a square unit and perimeter answers a length unit. Inside lines never add to a fence total. Model lines show on every bench. Sprout items show no numerals; feedback never says "wrong".
- Style check run on the companion: no em-dashes; teach and history cards at most 30 words; prompts and guided steps at most 15 words; feedback, hints and explanations at most 20 words; no "not ..., but" correctio.
- Browser at 320 and 820 px: targets 44 px; tap-to-place tiles and cuts as well as drag; every grid has a text equivalent ("Plot L: 8 m bottom, 6 m left, 3 by 2 corner missing; 42 squares").
- Nuria's Spanish line checked by a fluent reader before build.
- **Independent review, 2026-10-25.** Reviewer recomputed every item, worked example and model number with an independent script (`rcheck.py`, `python3 -I`, scratch area; 36 checks for this pack, all passing: Plot L and the low field by cell sets and boundary-edge counts, the overlap block, the T-shape, the fence tables, P1 and P2 unique by brute force, the acre and half-acre figures, B7's 10 + 4 = 14 estimate). Recounted positions (5/5/5 over 15 three-choice items); checked distractor feedback, Hollis rule, pronouns, spec 120 chapter names, word limits and em-dashes (0 in all three files); spot-checked Herodotus 2.109 and the Menna rope scene by web search. Changed: claimed `mt_GzcJEVkNRn` and `mt_eiB3-6pu6a` with upstream and crosswalk rows; added T13 and B7 (estimating a bumpy area) and 2 × length + 2 × width on D1; "plow" for "plough"; shortened the correct options of A1 and A6, which were giveaways by length.

## Review asks

**Subject expert:**
1. Is "area = length × width" introduced late enough, after rows × squares in a row, to keep the multiplication grounded in the array?
2. Is the six-sided herb bed a fair place for "equal sides × number of sides" in an otherwise rectilinear pack?
3. Is "a cut corner moves the fence in without shortening it" stated safely, given it holds only for a corner notch, not for every rectilinear cut?
4. Is the Herodotus card fair as a reported tradition with his own guess, given scholars doubt it is independent evidence?

**Owner questions, with defaults:**
1. Route `#regrow/plots` beside the Four Beds? *Default: yes.*
2. Resolved on review: `mt_GzcJEVkNRn` and `mt_eiB3-6pu6a` (both rectangle area and perimeter formulas despite their names) are claimed here, per the build-out map.
3. First slice? *Default: the Tile Tray and Row Planter with Sets A and B, then the Fence Walk.*
