# 186. The Wheel and the Stones: leaning shapes, fraction sides, pi and prisms

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a math check.** Part of the [math build-out](https://github.com/anotherpanacea-eng/learning-garden/pull/154). Every child-facing line is in [the companion text](../content/186-wheel-and-stones-text.md); sources and open checks are in the [source audit](../source-audits/186-wheel-and-stones.md).

**Commissioning boundary:** a proposal only. Select a bounded first slice after independent content, model and save review; the four benches do not commission each other. All Act and chapter links are future adapters to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (draft PR #127). Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter. **Fact-check status:** the three history anchors were checked against search excerpts on 2026-10-25 (page fetches blocked); no `[check]` item is in child text. The math is standard and still needs the math check.

## Purpose

Sibling spec 185 (Fences and Plots, this build-out) teaches area as unit squares, rectangles by tiling, compound rectilinear area and perimeter. Nobody yet takes area **past the rectangle**: to leaning shapes, triangles, sides that are not whole numbers, and the circle. This pack takes three untouched Marble topics there, plus a fourth reassigned on review: the formula family for triangles, parallelograms and trapezoids and the volume of prisms and cylinders (four claimed targets).

A child comes to understand that a parallelogram can be cut and slid into a rectangle with the same area, so its area is base × **perpendicular** height and never base × slant side; that a triangle is half of a parallelogram made from two copies of it; that any side can be the base, each with its own height; that a rectangle with fraction sides is counted in small tiles made by cutting one square unit both ways, so the area is the product of the sides; that round ÷ across is the same for every circle, a little over 3, called pi; that a wheel's rim travels pi × diameter in one turn; that a circle sliced into sectors lines up into a near-rectangle pi × r long and r tall, so its area is pi × r × r; that 3.14 and 22/7 are close, chosen approximations; that each formula asks for the radius or the diameter, so the first move is to check which one you have; that a trapezoid is half of the leaning plank two copies make, so its area is (top + bottom) × height ÷ 2; and (Keeper's Desk) that right prisms and right cylinders, the millstone included, hold their end area times their perpendicular length.

**Builds on, never re-teaches:** spec 185's unit squares, tiling, the distributive split and rectangle formulas (here: fraction tiles and mixed-number sides); spec 184's unit cubes, layers and cuboid volume l × w × h (here: right prisms and cylinders as end area × perpendicular length); spec 183's names for circle parts (here: recapped in T7 and used); spec 181's right angles (here: the square corner that marks a height); spec 96's countable tiles. **Also targeted (reassigned to this pack on review, 2026-10-25):** *Angles in triangles (age 11+)* (`mt_tAJH5BrpOx`), whose pinned description is the area formulas for triangles, parallelograms and trapezia and the volume of prisms and cylinders, despite its name (T1-T4, T14-T16; Sets A and F). **Not targeted:** *Multiplying fractions (age 10+)* (`mt_AabJisinfi`, claimed by sibling spec 198; the tile model here is supported practice, no claim); rectangle area itself (`mt_eiB3-6pu6a`, claimed by sibling spec 185); cuboid volume (`mt_nTL-owFJTF`, claimed by sibling spec 184); cones and spheres. Energy, flour and the wheel's power belong to spec 147; gears and the sack cart to spec 123; the hoist to spec 154.

## Place and story

**Host:** the **waterwheel and millstones**, route `#mill/wheel`, linked from spec 123's `#mill` page, spec 147's `#mill/energy` and spec 154's `#mill/hoist` if they ship, and from sibling 181's `#mill/angles`. It stands alone otherwise. Open from the start; no bench requires another.

| Act and chapter (future adapters to spec 120) | Beat (full text in the companion) | Job depths |
| --- | --- | --- |
| II, ch. 1 *the weekly market* | The wheel turns again: the only planks left are sawn on a slant, so the miller cuts a triangle off one end and fits it on the other. Bramble says it got bigger. | Sprout: same wood. Seedling: squares, base × height. |
| II, ch. 2 *a garden across the seasons* | The town keeps records. The miller ties a ribbon to the rim: how far does it go in one turn? Pip says "across"; the cat disagrees. | Sprout: round vs across. Seedling: pi from the tape. Sapling: 12.56 m. |
| II, ch. 3 *Ember's birthday* | The baker needs a cloth 2½ m by 1¾ m for the cake table; Dot chalks quarter-meter squares. | Seedling: fraction tiles. Sapling: 4 3/8 m². |
| III, ch. 1 *the floating market* | Vadoalto brings grain. Their stone is half as wide; does ours grind twice as much? | Sapling: stone area. Keeper's Desk: four times. |
| III, ch. 4 *letters up and down the river* | Nuria writes: Vadoalto's wheel is 3½ m across; how far is one turn? (Spanish greeting.) | Seedling, Sapling: 22/7 × 3½ = 11 m. Keeper's Desk: how much stone is in a millstone (Set F). |

One shared scene per chapter; any job is a whole contribution; nothing locks a story place. The mill, wheel, stones, cloth and grain amounts are fiction, labeled apart from math, history and models. The old Keeper is not named (Hollis rule); none of these scenes needs the Keeper.

## The knowledge

**Base and perpendicular height.** Choose any side as the base. The height is the distance from that base to the opposite side (or vertex), measured at a right angle; a small square marks it. A leaning side is longer than the height. Any side can be the base, each with its own height, and the area is the same either way (sides 6 and 5 with heights 4 and 4.8: 6 × 4 = 5 × 4.8 = 24).

**Parallelogram by cut and slide.** Drop a perpendicular from a top corner, cut off the right triangle, slide it to the other end: a rectangle base long and height tall. Nothing is added or lost, so area = base × perpendicular height. The model plank: base 6, height 4, slant 5 (offset 3, a true 3-4-5 drawing): 24 squares, not 30 (slant) or 10 (adding).

**Triangle as half.** Two copies of a triangle, one turned, make a parallelogram with the same base and height, so area = base × height ÷ 2. Halving belongs to triangles only. When a triangle is obtuse, the height can fall outside it, on the extended base line; the rule still holds (base 4, height 3: 6).

**Area with fraction sides.** Keep one square unit outlined in bold. Cut it into b parts one way and d the other: b × d tiles, each 1/(b × d) of the unit. A rectangle a/b by c/d covers a × c tiles: (a × c)/(b × d). Worked: 2/3 × 3/4 gives 12 tiles, 6 shaded, 6/12 = 1/2 m². With both sides under 1 the area is smaller than either side; that is not true in general (1½ × 2/3 = 1). Mixed sides: either a finer grid (2½ m × 1¾ m in quarter meters is 10 × 7 = 70 tiles of 1/16 m² = 4 3/8 m²) or the distributive split from spec 185 (2 + 1½ + ½ + 3/8). Area stays separate from perimeter (the cloth's edge is 8½ m).

**Circle parts in use.** Center, radius, diameter (two radii), circumference (the way around). Recap only; spec 183 teaches the names.

**Pi by measuring and dividing.** Wrap a tape around, unroll it, lay diameters along it: a little more than three fit, for every circle. The Rim Tape's authored table (made-up measurements, each within 1 cm of the true value): cat's bowl 44/14, bucket 94/30, sieve 126/40, hub 157/50, millstone 440/140, waterwheel 1257/400 cm; every ratio lies between 3.13 and 3.15, mean 3.14. Differences are tape wobble; pi does not change with size.

**Circumference.** C = pi × d = 2 × pi × r. The wheel is 4 m across: 3.14 × 4 = 12.56 m per turn (12.57 with pi), and 10 turns is 125.6 m. Nuria's wheel, 3½ m: 22/7 × 7/2 = 11 m (three diameters would be only 10½).

**Area of a circle by sectors.** Slice a circle into 8, 16, 32 sectors and line them up, alternately point up and point down. Half the circumference runs along the top and half along the bottom, so the near-rectangle is pi × r long and r tall: area = pi × r × r. More sectors, straighter edges; the spec says "gets closer and closer" and makes no limit argument. Millstone 1.4 m across: r = 0.7, 22/7 × 0.49 = 1.54 m² (3.14 gives 1.5386).

**3.14 and 22/7.** Both are approximations; pi is neither. 22/7 is about 0.0013 too big, 3.14 about 0.0016 too small. Choose 22/7 when the length goes into sevens (2.1 m: 22 × 0.3 = 6.6 m) and 3.14 for decimals. Choosing a close-enough value is part of the job; for a 4 m wheel either is within a centimeter.

**Radius or diameter; length or cover.** First move on every circle item: which do I have, which does the rule need? Area squares the radius (r × r, not 2 × r); circumference is a length in m, area a cover in m². Twice as wide gives four times the face: the Stone Floor's made-up grinding model (grain in step with face area) turns this into 5 sacks vs 20.

**Trapezoids.** A trapezoid (UK: trapezium) has one pair of parallel sides, top and bottom. Two copies, one turned, make a leaning plank (top + bottom) long and as tall: area = (top + bottom) × height ÷ 2, with the perpendicular height, never a slanted side. Worked: top 3, bottom 7, height 4 gives 20. F1's paddle end: top 3, bottom 9, height 4, slanted sides 5 (offsets 3 and 3, true to the grid): 24, not 48 (no halving) or 30 (slant as height).

**Prisms and the cylinder (Keeper's Desk).** This pack uses right prisms: matching parallel polygon ends joined by rectangles. A right cylinder has matching parallel circle ends and a curved side. Both keep the same cross-section along their length; both have volume end area × perpendicular length (the distance square to the ends): spec 184's crate is 4 × 3 = 12 per layer, 5 layers, 60. A feed trough with a triangle end (base 2 ft, height 1 ft, so 1 ft²) and 6 ft long holds 6 ft³ (12 forgets to halve; 9 adds). The cylindrical millstone, 1.4 m across and 0.5 m thick, is 1.54 × 0.5 = 0.77 m³ (3.08 uses the diameter as radius; 2.2 uses the circumference). Twice as thick doubles the volume; twice as wide quadruples it. Volume is in cubic units.

**Composite (Keeper's Desk).** A 1 m by 2 m door with a half circle on top: 2 + ½ × 3.14 × 0.5² ≈ 2.39 m²; its trim (two sides and the arch, not the floor) is 2 + 2 + 1.57 = 5.57 m.

**Real anchors (see audit).**
- **The Rhind papyrus round field (Egypt).** Copied by the scribe Ahmes, dated about 1550 BCE (some sources say about 1650 BCE), mostly held at the British Museum. Problem 50: a round field 9 khet across; take away a ninth (8) and square it: 64 setat. This treats the circle as a square of side 8/9 of the diameter, the same as using about 256/81 ≈ 3.16 for pi. Child text says "more than 3,500 years ago".
- **Archimedes, *Measurement of a Circle* (Syracuse, 3rd century BCE).** Inscribed and circumscribed regular 96-sided polygons, starting from hexagons, bound the circumference: 3 10/71 < pi < 3 1/7. The upper bound is 22/7. He did not claim either was exact. Child text: "more than 2,200 years ago".
- **Zu Chongzhi (China, born 429 CE).** Gave 22/7 as the "approximate ratio" and 355/113 as the "close ratio", and is credited with 3.1415926 < pi < 3.1415927. His book is lost; the polygon size he used is disputed, so child text gives none. 355/113 = 3.14159292 is right to six decimal places (it sits just above his upper bound, which the child text does not claim otherwise). Some sources credit his son Zu Geng as well; child text says only "he gave".

## The lesson

Jane's **teach → guided → practice** order on every bench: a teach card with a step-revealed worked example, a guided first item with 1-4 visible steps, then practice.

| Bench | Teach | Guided | Practice |
| --- | --- | --- | --- |
| Paddle Bench | T1-T4, T14 | Plank 7 by height 3, slant 5 (3 steps) | Set A; F1, F2 |
| Cloth Grid | T5, T6 | 2/3 m by 3/4 m (3 steps) | Set B |
| Rim Tape | T7-T10 | The hub, 157 ÷ 50 (3 steps) | Set C, E1, E6 |
| Stone Floor | T11-T13, T15, T16 | Millstone 1.4 m across (3 steps) | Set D, E2, E4; F3-F6 |

**"I'm stuck" ladder** on every item: (1) the hint, aimed at the item's top misconception (the square corner, the bold unit square, "radius or diameter?"); (2) an easier worked case done the recommended way plus how to start this one (the companion lists ten); (3) **Skip for now**, no penalty, nothing recorded against the child.

**Contrasts:** slant side vs height; looks bigger vs same pieces; plank vs brace (halve only triangles); base at the bottom vs any side; adding cuts vs multiplying them; tile count vs square units; area vs perimeter; round vs across; doubling vs a little over three times; radius vs diameter; squaring vs doubling; length (m) vs cover (m²); twice as wide vs twice the area; close enough vs exact.

**Top misconceptions designed against** (from the three Marble records): uses the slant side, believing every given number is needed; forgets to halve; thinks the base must be at the bottom; reads a tile as 1/(b + d); cuts one way only; loses the unit square (6 tiles read as 6 m²); confuses area with perimeter; distrusts an area smaller than the sides; pi changes with circle size; confuses radius and diameter; swaps circumference and area rules; squares by doubling; gives area in linear units; uses the whole circle or the diameter as radius in a composite. Added here: 3.14 is pi exactly; a bound is the value; twice as wide is twice the area. For trapezoids and prisms (from the reassigned record): dropping the ÷ 2; the slanted side as height; perimeter for end area; adding dimensions; doubling thickness read as four times.

## The game or activity

**(a) The Paddle Bench, model `paddle-cut-v1`.** Slanted planks on a square grid. *A made-up model: cut pieces move whole; no wood is added or lost.* **Pick a base**, **Draw the height** (snaps only at a right angle; a leaning line is shown as "leaning side", never accepted as height), **Cut** along the drawn height, **Slide** the triangle; the count updates only on **Count squares**. **Brace mode** cuts a plank corner to corner; **Copy and turn** joins two triangles into a plank. Planks include rotated ones and an obtuse triangle whose height falls outside. **Trapezoid mode**: a paddle end with two parallel sides; **Copy and turn** joins two into a leaning plank, and the count shows half. Sprout uses pictures and "same / more / less"; numbers from Seedling. Planks are drawn true to the grid (6/4/5 uses offset 3).

**(b) The Cloth Grid, model `cloth-grid-v1`.** One square meter outlined in bold, always labeled "1 m²". Sliders **Cuts across** and **Cuts down** (2-8 each) redraw the tiles and label one tile 1/(b × d). **Shade** a rectangle by tapping column and row counts; **Add a square meter** extends past 1 for mixed sides (up to 3 m by 2 m, quarter-meter grid). **Draw your own** (Sapling): the child picks both cuts and the shading for a card's product; nothing is graded except the tapped final value, and the drawing itself is saved as codes. *A made-up model: one bold square is one square meter.*

**(c) The Rim Tape, model `rim-tape-v1`.** Six round things from the mill (table above). **Wrap**, **Unroll**, **Lay acrosses** (copies of the diameter snap end to end along the tape), **Divide** (Seedling and up) fills the ratio column. **Roll the wheel** (Sprout): a 4 m wheel rolls once along the bank with a ribbon; marks every "across" on the ground. Sapling adds **Use 3.14 / Use 22/7** on the wheel and Nuria's wheel. *A made-up model: lengths were measured for this game; real tapes wobble.*

**(d) The Stone Floor, model `stone-slices-v1`.** A millstone drawing. **8 / 16 / 32 slices** and **Line up** animate the near-rectangle, labeling its long side "half the way around = pi × r" and short side "r". **Radius or diameter?** is a first-step chip on every computation. **Compare stones** (Keeper's Desk) sets Vadoalto's 0.7 m stone beside the 1.4 m one: four small faces tile the big one's near-rectangle, and the grinding gauge shows 5 vs 20 sacks. *A made-up model: grain ground is in step with face area; real stones vary.* A door-and-arch card supports T13. **Thickness** (Keeper's Desk): a slider stacks copies of a face, layer by layer as in spec 184's crates, for the trough (triangle end), the crate and the millstone; the readout shows end area × length in cubic units.

No timers, scores, streaks, medals or locks. Every bench is open from the first visit.

## Problem sets

Six sets, **36 items**, full text in the companion:

| Set | Depth | Items | Formats |
| --- | --- | --- | --- |
| A. Paddles and braces | Sprout (A1-A3), Seedling (A4-A6) | 6 | 3-choice |
| B. The Cloth Grid | Seedling (B1-B3), Sapling (B4-B6) | 6 | 3-choice, number |
| C. Round and across | Sprout (C1, C2), Seedling (C3, C4), Sapling (C5, C6) | 6 | 3-choice, number |
| D. The Stone Floor | Sapling (D1-D3), Keeper's Desk (D4-D6) | 6 | 3-choice, number with worked steps |
| E. Old rules for round things | Sapling (E1), Keeper's Desk (E2-E6) | 6 | number, true / not true from this source, 3-choice, *say why* |
| F. Trapezoids, prisms and the millstone | Sapling (F1, F2), Keeper's Desk (F3-F6) | 6 | number, 3-choice |

Sprout items use no numbers. Over the 21 three-choice items the right answer sits at A, B and C seven times each. Two distractors withhold more than the evidence requires (A6 "the height is outside, so you can't", D6 "only exact pi gives an answer"). Every three-choice item has at least one distractor tagged to a named misconception, most taken from the three Marble records. *Say why* (E5) is spoken to a grown-up and never stored or graded.

## Saved work

Optional root `millWheel` per explorer, absent until a first explicit action; separate from spec 123's `mill`, spec 147's `millEnergy` and spec 154's `millHoist`.

```
millWheel: {
  version: 1,
  paddle:  [{ source, plankId, base: sideId, height: bool, cut: bool, slid: bool, at }],   // latest 12
  cloth:   [{ source, cardId, across: 2-8, down: 2-8, shadeCols: 0-24, shadeRows: 0-16, units: 1-6, at }],  // latest 12
  rim:     { [thingId]: { source, unrolled: bool, acrosses: 0-4, divided: bool, at } },
  stones:  { source, slices: 8|16|32, lined: bool, compared: bool, at },
  prisms:  { [shapeId]: { source, layers: 1-10, at } },
  answers: { [itemId]: { source, choice | value | marks, support: ['hint'|'example'|'skip'], at } }
}
```

`source` freezes the model version and the item's choices and order. Codes and numbers only (number answers stored as entered, fractions as numerator and denominator integers). Never recompute or rewrite saved results on load; validate ids and ranges only. An unreadable entry stays raw and exportable while the rest stays open. Support stays separate from answers; no mastery flag. Shared export, import, reset and explorer switching.

## Curriculum fit

**Strands:** **M** measurement and geometry (area, circles), fractions (multiplying in an area model), decimals (3.14 products); **H1** a papyrus and two mathematicians as sources. Act families: II, III.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Derive and use parallelogram, triangle and trapezoid area with perpendicular height; find prism and cylinder volume as end area × length; find area with fraction and mixed-number sides by tiling; find pi as round ÷ across; compute circumference and circle area; choose radius or diameter, 3.14 or 22/7; combine a rectangle and a half circle. |
| Teaching encounter | T1-T16 with step-revealed worked examples; live cut and slide, two-way tiling, unrolling tape, lining up sectors; a guided first item per bench. |
| Contrast | As listed in The lesson. |
| Supported practice | Right-angle snap for heights; bold unit square; "Radius or diameter?" chip; the "I'm stuck" ladder. |
| New application | Obtuse brace (A6); Draw your own tiling (B6); Nuria's 3½ m wheel; Vadoalto's stone (D4); the arched door (D5); Ahmes's field (E1, E2). |
| Purposeful revisit | Spec 185 tiling and the distributive split; spec 183 circle parts; spec 181 right angles; spec 147's wheel (same wheel, energy left to 147). |
| Data boundary | Settings, choices, values and support codes, all local. No free text, timing or location. |

## Upstream check

Refreshed upstreams: Jane `0ec55f7e083976e6fcc3977fca460b1f5e199d91` and Marble `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (both 2026-10-24). Ids confirmed in the pinned `curriculum/marble/topics.json`.

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Area of Triangles & Parallelograms (`mt_ML5t7n2-U8`) | Derive by dissection before any formula drill; perpendicular height marked with a right angle, with non-examples; any side as base, rotated and obtuse shapes; tie ÷2 to two congruent triangles; decoy slant lengths; let the learner perform the rearrangement. Paddle Bench Cut / Slide / Copy and turn; T1-T4; A1-A6 with slant decoys and an obtuse brace. |
| Area with Fractions (`mt_gx6KQK5-Kx`) | Start from a whole labeled unit square cut in two directions; link b × d to the tile and a × c to the shaded count; both read and produce a tiling; show simplification by eye; extend past one unit for mixed sides; scope "smaller than both sides" to proper fractions; recognition items as checks only. Cloth Grid with the bold 1 m²; T5, T6; B1-B6; Draw your own; B3 scopes the claim. |
| Angles in triangles (age 11+) (`mt_tAJH5BrpOx`; description: area formulas for triangles, parallelograms, trapezia; prism and cylinder volume) | Derive each formula from the rectangle (shear, halve, average the parallel sides); perpendicular height every time with slant decoys; right prisms and cylinders as end area × perpendicular length, with polygon ends versus circle ends; square vs cubic units; redundant measurements. T1-T4, T14-T16; A4-A6, F1-F6 (F1 carries a slant decoy, F4 a perimeter decoy). |
| Circles: Circumference & Area (`mt_svFa6_mjO_`) | Pi as a measured ratio of round to across; area by rearranged wedges into a pi r by r near-rectangle; drill d = 2r and "which does the rule need?"; squaring vs doubling; keep units in view; decompose composites into rectangle plus semicircle. Rim Tape, Stone Floor, T7-T13; Sets C, D; E2, E6. Static labeled circles serve only as reference. |

**Jane:** adopted teach → guided → practice, the three-step "I'm stuck" ladder, short second-person prompts, three-option choices with misconception-tagged distractors and per-choice feedback, step-revealed worked examples, research-led hints, and a glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, points. No Jane or Marble text copied.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`. Two prerequisite titles do not match their descriptions (a known pinned-data issue, see `docs/six-act-math-literacy.md`); content controls.

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| Area of Triangles & Parallelograms | Estimating answers (age 9+) (`mt_eiB3-6pu6a`; content: rectangle area l × w and perimeter) | Met elsewhere: proposed spec 185 (math build-out), which now claims it; recapped in T2. |
| Area with Fractions | Multiplying fractions (age 10+) (`mt_AabJisinfi`) | Met elsewhere: sibling spec 198 (Parts of Parts, math build-out, draft PR #158) claims it; the tile model here is the same area model, used without a claim. |
| Area with Fractions | Estimating answers (age 9+) (`mt_eiB3-6pu6a`) | Met elsewhere: proposed spec 185 (math build-out). |
| Circles: Circumference & Area | Angles in triangles (age 11+) (`mt_tAJH5BrpOx`; content: area formulae for triangles, parallelograms, trapezia and prism volume) | Taught here (T1-T4, T14 before the circle; T15 prisms). The pinned edge is partly circular, since cylinder volume needs circle area: T16 and F5-F6 come after T12. |
| Angles in triangles (age 11+) | Estimating answers (age 9+) (`mt_eiB3-6pu6a`) | Met elsewhere: proposed spec 185 (math build-out). |
| Angles in triangles (age 11+) | Area of Triangles & Parallelograms (`mt_ML5t7n2-U8`) | Taught here (Paddle Bench). |
| Angles in triangles (age 11+) | Estimating answers (age 10+) (`mt_nTL-owFJTF`, cuboid volume) | Met elsewhere: proposed spec 184 (math build-out); recapped in T15. |
| Circles: Circumference & Area | Parts of a circle (`mt_xq3YHZ2zeR`) | Met elsewhere: sibling spec 183 (Stamp Drawer, this build-out, draft); recapped in T7 and the glossary. |

Claim check, 2026-10-25: no spec on main or any draft PR (126, 127, 128, 137-151) claims these four targets; spec 182 dropped `mt_tAJH5BrpOx` as a misfit, and the build-out's topic map assigns all four to this spec only.

## Checks for implementation

- **Numbers script (2026-10-25):** `check186.py` (`python3 -I`, scratch area, not in the repo), 131 checks passing, 0 failing. Key results: plank 6 × 4 = 24 (wrong 30, 10), slant 5 from offset 3 and height 4; brace 12 (wrong 24, 15); 6 × 4 = 5 × 4.8; obtuse brace 6 (wrong 12); tile 1/12 (wrong 1/7); 2/3 × 3/4 = 1/2 (wrong 5/7); 1½ × 2/3 = 1 (wrong 13/6, 2/3); 2½ × 1¾ = 35/8 = 4 3/8 by 70 sixteenths and by four partial products (wrong 19/8, perimeter 17/2); 1/2 × 4/5 = 2/5; all six rim ratios in 3.13-3.15 (inclusive) and within 1 cm of pi × d, mean 3.14; 22/7 × 14 = 44; wheel 12.56 m (wrong 25.12, 50.24), 10 turns 125.6 m; 22/7 × 3½ = 11 (three diameters 10½); millstone 1.54 m² (3.14: 1.5386; wrong 6.16, 4.4); small stone 0.385 m², ratio exactly 4, 20 sacks (wrong 10); door 2.3925 m² (wrong 2.785, 3.57), trim 5.57 m; 22/7 × 2.1 = 6.6 (3.14: 6.594); Rhind 64 (wrong 81, 72), implied 256/81 = 3.16049; 3.14 × 4.5² = 63.585 (wrong 254.34, 28.26); 223/71 = 3.1408 < pi < 3.1429 = 22/7; 22/7 error 0.00126 vs 3.14 error 0.00159; 22/7 × 7 = 22 (wrong 21, 44); 355/113 = 3.14159292, right to six decimals, best fraction with denominator up to 113 (brute force over all denominators 1-113), and just above Zu's upper bound 3.1415927; A/B/C balance 6/6/6 (18 items, before Set F; 7/7/7 over 21 after the review below). No item is a unique-answer puzzle, so no other uniqueness search was needed.
- Heights snap only at right angles; leaning sides never accepted as heights. The bold unit square never disappears. Sector animation never claims an exact rectangle. Model lines show on every bench. Sprout items show no numbers; feedback never says "wrong".
- **Style check** (`style186.py`) on the companion: 0 em-dashes; teach and history cards at most 30 words; prompts at most 15 words; hints, feedback and explanations at most 20 words; short scenes at most 30 words, longer scenes within 150; no "not X, but Y" constructions; 30 items found.
- Browser at 320 and 820 px: targets 44 px; tap-to-place as well as drag for slides and sectors; every diagram has a text equivalent ("Base 6, height 4 with a square corner, leaning side 5").
- Nuria's Spanish greeting checked by a fluent reader before build.
- **Independent review, 2026-10-25.** Reviewer recomputed every item, worked example and model number with an independent script (`rcheck.py`, `python3 -I`, scratch area; 37 checks for this pack, all passing: fractions exactly with `Fraction`, the rim table against pi, 22/7 and 3.14 products, Archimedes' bounds, 355/113, and the new trapezoid, trough, crate and millstone volumes with their distractors). Recounted positions (7/7/7 over 21 three-choice items, after the additions); checked distractor feedback, pronouns, spec 120 chapter names, word limits and em-dashes (0 in all three files); spot-checked Zu Chongzhi by web search. Changed: claimed `mt_tAJH5BrpOx` with upstream and crosswalk rows; added T14 (trapezoid), T15 (prisms), T16 (cylinder) and Set F (F1-F6), with Trapezoid mode, Thickness and a `prisms` save entry; the guided plank was not drawable on the grid (base 5, slant 4, height 3), now base 7, slant 5, height 3; A6 given a question; American "around" and "gray"; resolved owner question 2.

## Review asks

**Math expert:**
1. Is "more slices, straighter edges, closer and closer" an honest sector argument at this level without a limit?
2. Is the 22/7 "pick it when the length fits sevens" heuristic sound guidance, given 3.14 is equally acceptable?
3. Is the obtuse triangle (height outside) right for Seedling, or should it move to Sapling?
4. Does B3's scoped "part of a part" explanation avoid the overgeneralization the research warns about?

**Owner questions, with defaults:**
1. Route `#mill/wheel` beside `#mill`, `#mill/energy`, `#mill/hoist` and `#mill/angles`? *Default: yes; it stands alone if none ship.*
2. Resolved on review: rectangle area (`mt_eiB3-6pu6a`) is claimed by sibling 185; this pack keeps the inline recap.
3. Four targets in one pack, or split circles from leaning shapes? *Default: one pack; the Rim Tape and Stone Floor can ship as a second slice.*
4. First slice? *Default: the Paddle Bench with Set A, then the Rim Tape with Set C.*
