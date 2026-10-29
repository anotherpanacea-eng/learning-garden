# 206. The Surveyor's Triangle: similar shapes, Pythagoras and first trigonometry

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a math check.** Part of the [math build-out](https://github.com/anotherpanacea-eng/learning-garden/pull/154). Every child-facing line is in [the companion text](../content/206-surveyors-triangle-text.md); sources and open checks are in the [source audit](../source-audits/206-surveyors-triangle.md).

**Commissioning boundary:** a proposal only. Select a bounded first slice after independent content, model and save review; the five benches do not commission each other. All Act and chapter links are future adapters to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (draft PR #127). Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter. **Fact-check status:** history facts checked against search excerpts on 2026-10-25 (page fetches blocked); no `[check]` item is in child text. The geometry is standard and still needs the math check.

## Purpose

The garden draws to scale but never asks why a scaled copy is the **same shape**. [Spec 111](111-same-route-different-scale.md) (merged) redraws one route at two edge keys; [spec 119](https://github.com/anotherpanacea-eng/learning-garden/pull/126) §7 (draft PR #126) adds a chosen map scale for *Scale and similar shapes (age 11+)*; [spec 112](112-shadow-theatre.md) (merged) grows a card's shadow from a point lamp without numbers; proposed [spec 165](https://github.com/anotherpanacea-eng/learning-garden/pull/145) (draft PR #145) measures the Earth with one shadow angle. Nobody teaches **similar shapes**, **enlargement from a center**, **heights from shadows**, **Pythagoras' theorem** or **right-triangle ratios**. This pack takes four untouched topics there, for the older learner's door (Sapling and Keeper's Desk), with a Seedling on-ramp.

A child comes to understand that similar shapes are the same shape at another size: every length times **one** scale factor, every angle unchanged; that the scale factor is new ÷ old from one matching pair, then applied to every side; that adding the same amount to each side distorts a shape (checked by dividing); that area grows by the factor times itself; that an enlargement from a center multiplies each corner's distance from that center; that at one sunny moment every upright thing and its shadow make similar triangles, so a stick's ratio gives a tree's height; that the hypotenuse is found by **position**, across from the right angle; that the squares on the two shorter sides fill the square on the hypotenuse, so you add to find the hypotenuse and take away to find a shorter side, then find the side of the square; that a straight grid distance is a hypotenuse; that opposite and adjacent are named from the **marked angle** and swap when it moves; and that right triangles with the same angle are similar, so one rounded table of tangents, then sines and cosines, gives heights and distances, and reading it backwards gives an angle.

**Builds on, never re-teaches:** spec 111's edge-key scale and spec 119 §7's map scale (here: a scale factor on shapes, not map reading); spec 112's point lamp (here: the lamp becomes a center of enlargement with numbers); spec 165's degree and Shadow Bench (here: shadows at one moment, no Earth measurement, Eratosthenes not retold); sibling spec 181's protractor and right angle; sibling spec 182's triangle angle sum; sibling spec 187's grid coordinates and rigid moves (here: the non-rigid enlargement it set aside); sibling spec 193's formula rearranging (here: only a numerator unknown). **Not targeted:** map scales and unit conversion (spec 119 §7); scaling solids (volume ×k³, research marks it a later extension); calculator inverse keys and the unit circle.

**Assignment changes:** the coordinator added two targets whose pinned names mislead: *Coordinates (age 12+)* (`mt_y-BuQAfw4B`), whose description is enlargement from a center with a scale factor (dropped by sibling spec 187), and *Types of angles (age 13+)* (`mt_1VmTUxBrNd`), whose description is Pythagoras' theorem (dropped by sibling spec 181). Pythagoras is therefore taught here, not only previewed.

## Place and story

**Host:** the **Survey Shed** at the back of the Workshop, route `#workshop/survey`: a tape, sticks, a lamp on a hook and a straw clinometer made in the workshop. Linked from spec 111's `#workshop/scale` ("Same shape, new size"), spec 112's `#loft/shadows` end screen, the Cartographer's Table (`#workshop/maps`), sibling spec 182's `#workshop/truss` and, if it ships, spec 165's Shadow Bench. Open from the start; no bench requires another.

| Act and chapter (future adapters to spec 120) | Beat (full text in the companion) | Job depths |
| --- | --- | --- |
| IV, ch. 1 *the old map and Hollis's account* | Wren Halloway wants Hollis's postcard-sized map three times bigger for the library wall. Pip adds 20 cm to each side and the marsh looks squashed. | Seedling: same shape? (A1-A3). Sapling: scale factor (A4); the Lamp Grid copy. |
| IV, ch. 4 *the proposal for the low fields* | The Wall plan needs the old brook wall's height and Hob Pennick's poplar. Nobody climbs: a stick's shadow on a sunny morning, the clinometer on a cloudy afternoon. | Seedling, Sapling: Shadow Yard (C1-C5). Sapling, Keeper's Desk: Survey Bench heights (E4); Keeper's Desk case: a bank-height sheet for the meeting board. |
| VI, ch. 2 *compare routes and keep a plan* | Dot's route plan: the high ford is 4 km east and 3 km north, so 5 km as the crow flies against 6 km by the river path. Hob measures the brook's width at the ford. | Sapling: Square Pens (D2-D4). Keeper's Desk: D5, E5; route-plan note. |

One shared scene per chapter; any job is a whole contribution; nothing locks a story place. The town, banks, trees, paths and letters are fiction, labeled apart from math, history and models. **Hollis rule:** Hollis is named only in the Act IV and Act VI scenes (after Act III's end); bench text, which a child can open at any time, never names the old Keeper. The 6 km river path matches spec 178's courier trip to the high ford.

## The knowledge

**Similar shapes.** Two shapes are similar when one is a scaled copy of the other: corresponding angles are equal and every pair of corresponding sides has the same ratio, the **scale factor**. Find it from one matched pair (new ÷ old, always in that direction), then multiply every other side by it. A factor below 1 shrinks; dividing by 3 is the same as multiplying by ⅓. Adding a constant to each side changes a non-square rectangle's shape (2 by 5 plus 4 is 6 by 9; 6 ÷ 2 = 3 but 9 ÷ 5 = 1.8); the research asks for the additive version only as a flagged error, so here it appears only as a tagged distractor whose feedback names the distortion, never as a model answer. One matching pair is not enough evidence: check every pair and the angles. Area grows by k × k (a 2 by 3 card doubled is 4 by 6: area 6 becomes 24, four copies fit).

**Enlargement from a center.** On a grid, count across and up from the center to a corner, multiply both by the scale factor, and count again from the center. Center (1, 1), triangle (2, 2), (4, 2), (2, 3), factor 2: image (3, 3), (7, 3), (3, 5), every side doubled. Doubling the coordinates instead treats (0, 0) as the center. Without a grid, the light lines from a lamp show it: a card 20 cm from the lamp and a screen 60 cm away make a shadow 3 times as wide. Corresponding angles are unchanged because every side scales together.

**Shadows and similar triangles.** Sunlight arrives in effectively parallel lines, so at one moment every upright thing on flat ground makes a triangle of the same shape with its shadow. A 1 m stick with a 2 m shadow says every shadow is twice its height: an 18 m shadow means 9 m. Measurements at different times do not match. When a person's shadow equals their height, every shadow equals its height (the earliest Thales report). Spec 165 owns Eratosthenes; this pack keeps to one place and one moment.

**Pythagoras' theorem.** In a right triangle the **hypotenuse** is across from the right angle and is the longest side; identify it by position, never by its label or the diagram's orientation. The square on the hypotenuse equals the two other squares together. Hypotenuse unknown: square, **add**, then find the side (6, 8: 36 + 64 = 100, so 10). Shorter side unknown: hypotenuse squared **minus** the known square (13, 5: 169 − 25 = 144, so 12). Every answer ends with finding the side of the square and a longest-side check. A straight grid distance is a hypotenuse: (2, 1) to (8, 9) is 6 across, 8 up, so 10, not 14. If the squares fit (30, 40, 50: 900 + 1600 = 2500), the corner is square (the converse, used for a shelf bracket). Non-whole answers are estimated between whole numbers (2 and 3: √13 ≈ 3.6).

**Right-triangle ratios.** Mark the angle first. **Opposite** is across from it; **adjacent** is next to it and is not the hypotenuse; move the mark to the other acute angle and opposite and adjacent swap while the hypotenuse stays. Right triangles with the same angle are similar, so opposite ÷ adjacent (the **tangent**) is fixed by the angle alone (up 3, across 4 and up 6, across 8 both give 0.75). This invariance comes **before** any mnemonic; the pack never teaches SOHCAHTOA as a chant. Unknown side: choose the ratio holding the known and wanted sides, then multiply (height above eye = distance × tangent, then add eye height; ladder height = length × sine). Unknown angle: work out the ratio, then read the table backwards (6 ÷ 8 = 0.75 lies between 35° and 40°, nearer 35°; exact 36.87°). Reasonableness: an opposite side is never longer than the hypotenuse, and an acute angle is between 0° and 90°. All values come from **the Surveyor's Table**, 5° to 85° in 5° steps, rounded to two places (companion); answers are approximate and say so.

**The clinometer.** A straw taped along a protractor's straight edge, with a weighted string from the center hole. Held level, the string hangs at 90; tilted up at a treetop, the sight angle is how far the string has moved from 90. The screen clinometer reads the angle directly (model card). Never sight the sun.

**Real anchors (see audit).**
- **Thales and the pyramid (reported).** Diogenes Laertius, citing the much earlier Hieronymus, reports that Thales measured the pyramids by their shadows at the hour when a person's shadow equals their height; Pliny gives the same method; Plutarch's later version sets a stick at the shadow's tip and compares two triangles. Nothing survives from Thales himself, so child text says "writers long after Thales told how".
- **Liu Hui's *Sea Island Mathematical Manual* (263).** Written as part of his commentary on the *Nine Chapters* and named after its first problem: two poles 3 zhang (30 chi, 5 bu) high and 1000 bu apart in line with an island; sighting the peak from ground level over each pole's top needs offsets of 123 and 127 bu. The answer: height 4 li 55 bu (1255 bu), distance 102 li 150 bu. Height = pole × gap ÷ difference + pole: 5 × 1000 ÷ 4 + 5 = 1255. Child text translates bu as "paces" and gives the rule as a supplied source (E8).
- **Aryabhata's sine table (about 499).** The *Aryabhatiya*, a Sanskrit work in verse, gives in one verse of its opening section a table for 24 sines at steps of 3¾° up to 90°, for a circle of radius about 3438. Scholars read the listed numbers as sine differences; child text says only "one verse holds a table for sines". The date comes from the text's own statement of the author's age, 23, 3600 years into the Kali Yuga; some give about 510 for composition, so child text says "around the year 500".

## The lesson

Jane's **teach → guided → practice** order on every bench: a teach card with a step-revealed worked example, a guided first item with 1-4 visible steps, then practice.

| Bench | Teach | Guided | Practice |
| --- | --- | --- | --- |
| Copy Frame | T1-T5 | 2 by 3 card twice as big (3 steps) | Set A; B5 |
| Lamp Grid | T6 | Center (1, 1), corner (2, 2), factor 2 (3 steps) | Set B |
| Shadow Yard | T7 | Shadow as long as you (3 steps) | Set C |
| Square Pens | T8-T11 | Sides 6 and 8 (3 steps) | Set D |
| Survey Bench | T12-T16 | Tree at 45°, 9 m away (3 steps) | Set E |

**"I'm stuck" ladder** on every item: (1) the hint; (2) an easier worked case plus how to start this one (the companion lists ten); (3) **Skip for now**, no penalty, nothing recorded against the child.

**Contrasts:** times vs plus; one pair vs every pair; same size vs same shape; length factor vs area factor; from the center vs from (0, 0); same moment vs different times; position vs biggest label; add vs take away; the square vs its side; walking the corner vs cutting it; named from the angle vs from the right angle; the ratio vs the angle.

**Top misconceptions designed against:** additive enlargement; scaling one side; angles grow with size; similar means identical; one pair proves similarity; area doubles when lengths double; enlarging from the origin; shadows from different times; "you can't know without climbing"; the hypotenuse is the biggest label or the bottom side; always add; forgetting the square root; adding grid steps for a straight distance; adding lengths to test a right angle; opposite and adjacent named from the right angle; labels glued to the shape; the ratio grows with the triangle; forgetting eye height; the ratio reported as the angle.

## The game or activity

**(a) Copy Frame, model `copy-frame-v1`.** Rectangles and triangles on a screen grid with a **Times** and an **Add** control, an **Overlay** that shows a true copy's corner on the original's diagonal, a live **Ratio table** (side, old, new, new ÷ old) and **Area tiles** that fill the copy with originals. Add mode on a non-square rectangle visibly leaves the diagonal and the ratio column disagrees. *A made-up model: shapes on a screen grid, made-up centimeters.* Seedling: Times 2 and 3 only, and the same-shape sort.

**(b) Lamp Grid, model `lamp-grid-v1`.** A 12 × 10 first-quadrant grid (spec 187's along-then-up convention) with a lamp at a chosen center. The child places each image corner by tapping; **Show light lines** draws rays from the lamp through original and image corners. Factors 2, 3 and ½. A side panel shows the shadow version: lamp, card, screen on a line, with distances. *A made-up model: a tiny lamp at the center, made-up grid units.*

**(c) Shadow Yard, model `shadow-yard-v1`.** A flat yard at one sunny moment: place a stick, measure shadows with a tape, draw the parallel sun line, compare the two triangles on a ratio strip. Cases: shadow equals height; stick 1 m / 2 m; stick 2 m / 3 m; a mixed-time pair that the strip refuses to compare ("These came from different moments"). *A made-up model: one moment, parallel sunlight, flat ground, upright things.*

**(d) Square Pens, model `square-pens-v1`.** A right triangle with square pens on its sides; **Mark the hypotenuse** first (the pens stay closed until a side is marked, and marking a leg reopens the choice with "That side touches the right angle"); **Pour the tiles** moves the two small squares' tiles into the big pen; **Turn the triangle** rotates it so the right angle is not always bottom left; a grid mode builds the triangle between two points. *A made-up model: made-up units, tiles show areas.*

**(e) Survey Bench, model `survey-bench-v1`.** A right triangle from an eye point to a treetop with a draggable angle mark; labels re-attach and swap live as the mark moves; **Grow the triangle** scales it while the ratio readout stays fixed; **Open the table** shows the Surveyor's Table; **Sight** runs a case (distance, eye height, clinometer angle) and the child writes the height. A flat-protractor mode measures across a brook. *A made-up model: the clinometer reads the angle directly, ground is flat, the table is rounded.*

No timers, scores, streaks, medals or locks. Every bench is open from the first visit; the Square Pens and Survey Bench open at Sapling items, with Seedling items on the other three.

## Problem sets

Five sets, **34 items**, full text in the companion:

| Set | Depth | Items | Formats |
| --- | --- | --- | --- |
| A. Same shape, scaled | Seedling (A1-A3), Sapling (A4-A6) | 6 | 3-choice, number |
| B. Grow from a point | Sapling (B1-B3), Keeper's Desk (B4-B6) | 6 | number, 3-choice, coordinates |
| C. Shadows tell heights | Seedling (C1, C2), Sapling (C3-C5), Keeper's Desk (C6) | 6 | 3-choice, number, true / not true from this source |
| D. Squares on the sides | Sapling (D1-D4), Keeper's Desk (D5-D7) | 7 | 3-choice, number |
| E. The Surveyor's Table | Sapling (E1-E4), Keeper's Desk (E5-E9) | 9 | 3-choice, number, number with a given rule, *say why* |

Sprout is not offered here (all tasks need lengths). Over the 18 three-choice items the right answer sits at A, B and C six times each. Production items (number and coordinate entry) sit beside the choices in every set, as both research records ask: two or three in Sets A to D, and five, outnumbering the choices, in Set E. Four items (C1, C5, D6, and A5's evidence check) include a choice that withholds more than the evidence requires or claims more than one pair shows. *Say why* (E9) is spoken to a grown-up and never stored or graded.

## Saved work

Optional root `surveyShed` per explorer, absent until a first explicit action.

```
surveyShed: {
  version: 1,
  frames:    { [taskId]: { source, mode: 'times'|'add', factor, sides: [number], at } },
  lamp:      { [taskId]: { source, center: [x, y], factor: 2|3|0.5, placed: [[x, y]], at } },
  shadows:   [{ source, caseId, at }],                                   // latest 12
  pens:      { [taskId]: { source, marked: sideId, at } },
  sightings: [{ source, caseId, angle: 5-85 step 5, height, at }],       // latest 12
  answers:   { [itemId]: { source, choice | value | point | marks, support: ['hint'|'example'|'skip'], at } }
}
```

`source` freezes the model version, the table version (`survey-table-v1`), and the item's choices and order. Codes and numbers only. Never recompute or rewrite saved results on load (a later table or key change does not regrade a kept answer); validate ids and ranges only. An unreadable entry stays raw and exportable while the rest stays open. Support stays separate from answers; no mastery flag. Shared export, import, reset and explorer switching.

## Curriculum fit

**Strands:** **M** geometry (similarity, enlargement, Pythagoras, trigonometry), ratio and proportion, measurement; **S1** measuring with an instrument; **H1** reports written long after the event, a third-century problem book and a verse table as sources. Act families: IV, VI.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Recognize and make similar shapes with one scale factor; find missing lengths; reject additive copies; area by k²; enlarge from a center on a grid; find heights from shadows; apply Pythagoras for the hypotenuse, a shorter side, a grid distance and a right-angle check; name sides from an angle; use a rounded tangent, sine and cosine table for sides and, backwards, for angles. |
| Teaching encounter | T1-T16 with step-revealed worked examples; a guided first item per bench. |
| Contrast | As listed in The lesson. |
| Supported practice | Ratio table and overlay; light lines; ratio strip; tile pouring; swapping labels and the growing triangle; the "I'm stuck" ladder. |
| New application | Wren's wall map; the poplar and the brook wall; the straight distance to the high ford; the brook's width; the Sea Island rule. |
| Purposeful revisit | Spec 111 (edge keys); spec 112 (lamp and shadow); spec 165 (degrees, Shadow Bench); sibling 181 (protractor), 182 (angle sum), 187 (grid). |
| Data boundary | Settings, placements, choices, values and support codes, all local. No timing, free text, photos or location. |

## Upstream check

Refreshed upstreams: Jane `0ec55f7e083976e6fcc3977fca460b1f5e199d91` and Marble `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (both 2026-10-24). Ids confirmed in the pinned `curriculum/marble/topics.json`.

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Scale and similar shapes (`mt_2OtRUM_0zW`) | Definition and a stretched contrast before calculation; scale factor first (new ÷ old), applied to every side; confront the additive error on a non-square rectangle, shown only as a flagged error; k² for area from tiling; production items beside recognition. T1-T5, Copy Frame's Add mode and Area tiles, A1-A6, B5. |
| Coordinates (age 12+) (`mt_y-BuQAfw4B`) | Learners compute corresponding-side ratios themselves and see the additive fake fail; check every pair; keep a genuine similar contrast; pair classification with live enlargement from a center. Lamp Grid's tap-to-place corners and light lines, T6, B1-B6, A5, A6. |
| Types of angles (age 13+) (`mt_1VmTUxBrNd`) | Identify the hypotenuse by position before choosing an operation; vary orientation; end with a square root and a longest-side check; see the squares fill; grid distance as a hypotenuse; no 3D. Square Pens' mark-first gate, Turn, Pour; T8-T11, D1-D7. |
| Trigonometry basics (`mt_KB_Czd7RQH`) | Mark the angle first; opposite and adjacent swap when it moves; ratio invariance and similarity before any mnemonic; standard orientation first, then rotated; keep unknown side and unknown angle distinct; reasonableness checks. Survey Bench's movable mark and Grow; T12-T16, E1-E9. The inverse function is taught as reading the table backwards; a calculator's inverse key is left to a later pack (review ask 2). |

**Jane:** adopted teach → guided → practice, the three-step "I'm stuck" ladder, short second-person prompts, three-option choices with misconception-tagged distractors, step-revealed worked examples and a glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, points. No Jane code or text copied.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| Scale and similar shapes | Percentages (age 9+) (`mt_ESgc4YBw-a`; actually ratio and scale vocabulary) | Met elsewhere: proposed spec 200 (math build-out). "Scale factor", "similar" and "corresponding" recapped in T1-T2 and the glossary. |
| Scale and similar shapes | Ratio Problems (`mt_h0gJcSuwdL`) | Met elsewhere: draft spec 118 (PR #126). Integer multiply/divide ratios recapped in T2. |
| Scale and similar shapes | Classifying shapes by properties (`mt_liIW336odh`) | Met elsewhere: proposed spec 183 (math build-out). Equal angles and side lengths used as properties inline. |
| Coordinates (age 12+) | Scale and similar shapes (`mt_2OtRUM_0zW`) | Taught here (Copy Frame before Lamp Grid). |
| Coordinates (age 12+) | Coordinate Transformations (`mt_K0Y15w48SY`) | Met elsewhere: proposed spec 187 (math build-out). Along-then-up reading recapped in T6. |
| Types of angles (age 13+) | Angle sums in triangles and polygons (`mt_J03RFlVdas`) | Met elsewhere: proposed spec 182 (math build-out). Right angle and "longest side across from the biggest angle" used inline. |
| Trigonometry basics | Types of angles (age 13+) (`mt_1VmTUxBrNd`) | Taught here (Square Pens before Survey Bench; hypotenuse in T8). |
| Trigonometry basics | Simple formulae (`mt_3qrCtdoVAU`) | Met elsewhere: proposed spec 193 (math build-out). Only numerator unknowns are asked (side = known × ratio); E8's rule is supplied. Unknowns in a denominator are left out. |

Claim check, 2026-10-25: no spec on main or any draft PR (126, 128, 137-151) claims the four targets; main mentions them only in planning and audit notes (spec 111's audit, the six-act bridges and literacy notes). Sibling specs 181 and 187 list two of them as dropped, and the build-out map reassigns them here.

## Checks for implementation

- **Numbers script (2026-10-25):** `check206.py` (`python3 -I`, scratch area, not in the repo), 154 checks passing: every Surveyor's Table entry (17 angles × tangent, sine, cosine) against rounded `math` values; A4 30 ÷ 10 = 3, 15 × 3 = 45 (additive 35; scene's 35 ÷ 15 ≈ 2.3); T3 6 ÷ 2 = 3 vs 9 ÷ 5 = 1.8; T5/B5 area 6 → 24 (wrong 12, perimeter 20); A6 ratios 2, 2, 2 against 1.5/1.25; B2 (3, 3) (wrong (4, 4)); B4 image (3, 3), (7, 3), (3, 5) with every side exactly doubled (wrong (8, 4)); B6 (3, 2); B3 60 ÷ 20 = 3, 12 cm (wrong 44, 7); C3 9 (wrong 17, 36); C4 1.5 and 3 (wrong 3.5, 6.75); T9 25; D2 10 (wrong 14, 100); D3 12 (wrong ≈13.9, 144); D4 10 (wrong 14); D5 5 km (wrong 7) and the 6 km path longer; D6 2500; D7 √13 ≈ 3.61; D1's 5-12-13 diagram; E3 6 (0.75); T14 10.5; E4 9.9 (wrong 8.4, 7.9; exact 9.89); E5 14 (wrong 11.4, 16.4); E6 4.7 (wrong 1.7, 13.75); T15 2.5; E7 0.75 between the 35° and 40° entries and nearer 35° (exact 36.87°; other angle 53.13°); scene 2 5 × 0.36 + 1.2 = 3.0; Sea Island 5 bu poles, 1255 bu = 4 li 55 bu, 30750 bu = 102 li 150 bu, 7530 chi, and a forward check that a 1255-high peak 30750 bu away gives offsets 123 and 127; Aryabhata 24 × 3.75 = 90 and R ≈ 3437.75; the companion's 34 items, its 18 right-answer positions (6/6/6) and no em-dash.
- No puzzle with a claimed unique answer; table look-ups round consistently to two places and items say "about" where the table rounds.
- Diagrams: hypotenuse never always bottom-right; at least D1, D4 and Square Pens' Turn show other orientations. Model lines show on every bench. Feedback never says "wrong".
- Style check (`style206.py`) on the companion: 0 em-dashes; 16 teach cards, longest 23 words (limit 30); 34 prompts, longest 15 (limit 15); 122 hints, explanations and feedback lines, longest 16 (limit 20); 12 scene blocks within 30/150/80; Hollis named only in the Act IV scene.
- Browser at 320 and 820 px: targets 44 px; tap-to-place as well as drag; every diagram has a text equivalent ("Right angle at top right; the slanted side is across from it"); the table is a real HTML table.
- Safety line on the clinometer and shadow invitations: never look at the sun.
- **Independent review, 2026-10-25:** recomputed every item, worked example, scene note, the Surveyor's Table (all 51 entries) and the Sea Island forward check (exact: 5 × 30873 ÷ 123 = 1255) with a separate reviewer script (`rcheck206.py`, `python3 -I`, 104 checks passing, including the 6/6/6 answer balance and 34 items); checked distractor feedback, the four Marble records and hard prerequisites (crosswalk confirmed against the build-out map), spec 120 chapter names and the Hollis rule (named only in Act IV and VI scenes), route uniqueness, and that spec 165's Eratosthenes is not retold (draft PR #145 has no Thales). Facts spot-checked by search (Sea Island figures corroborated only by the audit's recomputation sources). Changed: E2's two short distractors lengthened so the right answer is no longer the only long option. No em-dashes.

## Review asks

**Math expert:**
1. Is a two-place table (tangent, sine, cosine every 5°) a fair first trigonometry tool, with "about" answers and E7 read between rows?
2. Is "read the table backwards" an acceptable stand-in for the inverse function at this depth, leaving calculator keys to a later pack?
3. Is the Sea Island rule (pole × gap ÷ difference + pole) stated fairly as a supplied source rule, without its derivation?
4. Is "sunlight arrives in parallel lines" acceptable without discussing the Sun's angular size and soft shadow edges?

**Owner questions, with defaults:**
1. Route `#workshop/survey` in the Workshop? *Default: yes, beside `#workshop/scale` and `#workshop/truss`.*
2. Four targets in one pack, or split Pythagoras and trigonometry from similar shapes? *Default: one pack; Copy Frame and Lamp Grid ship first, Square Pens and Survey Bench second.*
3. A screen clinometer plus an off-screen paper one, or only the off-screen one? *Default: both; the off-screen one is grown-up-led with the sun warning.*
4. First slice? *Default: the Copy Frame with Set A, then the Shadow Yard.*
