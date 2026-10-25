# 182. The Truss Yard: angle facts, triangles and parallel beams

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a math check.** Part of the [math build-out](https://github.com/anotherpanacea-eng/learning-garden/pull/154). Every child-facing line is in [the companion text](../content/182-angle-rules-text.md); sources and open checks are in the [source audit](../source-audits/182-angle-rules.md).

**Commissioning boundary:** a proposal only. Select a bounded first slice after independent content, model and save review; the seven benches do not commission each other. All Act and chapter links are future adapters to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (draft PR #127). Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter. **Fact-check status:** history facts checked against search excerpts on 2026-10-25 (page fetches blocked); no `[check]` item is in child text. The mathematics is standard school geometry and still needs the math check.

## Purpose

Geometry has no angle-reasoning pack. Spec 126 (Shape Bench, draft PR #128) fits, turns and folds shapes; spec 125 (Sign Painter, same PR) paints, reflects and tiles them; sibling spec 181 (this build-out) teaches what an angle is, angle types, degrees and the protractor; sibling spec 183 classifies 2-D shapes by properties. Nobody yet teaches **angles you can work out without measuring**. This pack takes ten untouched topics there, with a younger on-ramp and a Keeper's Desk bench on which three parts fix a triangle.

A child comes to understand that a triangle is any closed shape with three straight sides, whatever its size, color or direction, and that polygons are named by counting sides (corners match); that a triangle frame cannot lean while a four-sided one can; that angles on a straight line share 180° and angles round a point share 360°, so a missing part is found by taking away; that opposite angles at a crossing are equal, because each sits beside the same neighbor; that a triangle's angles add to 180° whatever its size, a quadrilateral's to 360°, and any polygon's to (n − 2) × 180° because it splits into n − 2 triangles; that each angle of a **regular** polygon is the total ÷ n, and the outside angles of any polygon add to 360°; that a line crossing two parallel lines makes equal corresponding and alternate angles and co-interior angles adding to 180°; that a rectangle's right angles and equal opposite sides decide its missing angles and sides; that an angle chase gives a named reason for each step, never "it looks like it", and can end in a short equation; and that three sides, two sides and the angle between, two angles and the side between, or a right angle, the longest side and one more side fix a triangle, while two sides with an angle not between them, or three angles alone, do not.

**Builds on, never re-teaches:** spec 181's angle, right angle, degrees and protractor (recapped once in T3); spec 125's shape names and turns; spec 126's turning and flipping pieces; spec 154's Workshop beams (here: the joints between them); spec 181's SAS brace construction (here: the Twin Trusses build from given parts); spec 185's perimeter (here: undone to find a rectangle's missing side). **Not targeted:** similar triangles and Pythagoras (proposed spec 206); area formulas (proposed specs 185 and 186). The cube part of `mt_zuOGOGFAKb` is left to spec 126's Parcel boxes. **Map reassignments applied:** this pack now also owns `mt_QDTO3GAgcq` and `mt_tedML_iu4Y` (angle facts at a point, on a line and vertically opposite, then multi-step chains), `mt_KFKUR_gBg_` (rectangle properties for missing lengths and angles) and `mt_167X6Ax8P7` (triangle congruence, SSS, SAS, ASA, RHS, with labeling), which an earlier draft had dropped and now keeps with its own bench.

## Place and story

**Host:** the **Truss Yard** behind the Storm Workshop, route `#workshop/truss`, where the footbridge's side frames and the market's roof frames are being rebuilt. Linked from the Workshop hub, spec 126's `#workshop/shapes`, spec 154's `#mill/hoist` (beams) and, if it ships, spec 181's angle bench. Open from the start; no bench requires another.

| Act and chapter (future adapters to spec 120) | Beat (full text in the companion) | Job depths |
| --- | --- | --- |
| II, ch. 1 *the weekly market* | Market stalls need roofs. Pip's square frame flops; Hob Pennick adds a diagonal pole and it holds. | Sprout: is it a triangle; the Wobble test. Seedling: build a pentagon or hexagon frame. |
| III, ch. 3 *the route by the high ford* | The footbridge's side frames are rebuilt so the path upstream can open. The miller: "Find a few angles. Reason out the rest." | Seedling: straight line and point. Sapling: triangle sums, parallel beams. |
| III, ch. 2 *the seed exchange* | Nuria's steep Vadoalto reed roofs: sharper top, same 180° total. | Sapling: size doesn't change the sum; missing angles. |
| IV, ch. 1 *the old map and Hollis's account* | Hollis's ledger drawing of the bridge frame. Bramble's two "matching" angles disagree, so the bottom beam must sag; a straightedge confirms it. | Keeper's Desk: angle chases with reasons; using the parallel rule backwards. |

One shared scene per chapter; any job is a whole contribution; nothing locks a story place. The town, footbridge, roofs and characters are fiction, labeled apart from math, history and models. **Hollis rule:** Act II and III scenes say "the old Keeper"; Hollis is named only in the Act IV beat.

## The knowledge

**Defining a triangle (on-ramp).** A triangle is any closed figure with three straight sides. Size, color, direction and sitting on a flat base are "doesn't-matter" attributes. Near-misses are the teaching edge: a curved side, a gap at a corner. A long thin, right-angled, obtuse or point-down triangle is still a triangle; a square turned onto its corner is still a square and a quadrilateral.

**Naming by counting.** Count sides, marking each once from a start corner; corners always match sides. Three: triangle; four: quadrilateral; five: pentagon; six: hexagon. Irregular and squashed versions count as much as neat ones. A **square corner** is a right angle (recap of spec 181), checked with a carpenter's square.

**Rigidity.** A frame of three fixed bars cannot change shape, because three side lengths fix a triangle (the SSS case, taught at the Twin Trusses); four bars can lean into a diamond. One diagonal turns a square frame into two triangles and it holds.

**Angles on a line and at a point.** A straight line is a half turn, 180°; a point is a whole turn, 360°. Angle measure adds: parts share a fixed whole, so a missing part is the whole minus the known parts. Two right angles fill a line, four fill a point, three make 270°. **Opposite angles** at a crossing are equal, derived: each makes 180° with the same neighbor. Neighbors on a line are the pair that adds to 180°; opposite angles add to 180° only when both are 90°.

**Triangle angle sum.** Torn corners fitted point to point fill a straight line: a **demonstration** for that triangle. Euclid's argument (H1, E6) is the **reason** for every triangle: through one corner draw a line parallel to the opposite side; alternate angles put the other two corners beside the third on that straight line. Enlarging a triangle keeps its angles, so the sum is 180° whatever the size. Missing angle = 180° − the two known. Not-to-scale diagrams force use of the numbers. The outside angle at a corner equals the two far inside angles (Euclid I.32, first part).

**Polygon sums.** A diagonal splits a quadrilateral into two triangles: 360°. From one corner, an n-sided polygon splits into n − 2 triangles (the two sides at that corner start no new triangle): sum (n − 2) × 180°. Table used: 3: 180°; 4: 360°; 5: 540°; 6: 720°; 8: 1080°; 10: 1440°; 12: 1800°. **Regular** (all sides and angles equal) only: each inside angle = sum ÷ n (60, 90, 108, 120, 135, 144, 150 for 3, 4, 5, 6, 8, 10, 12 sides). Inside + outside = 180° at **one** corner; all outside angles of **any** polygon add to 360° (walking the edge, you turn once round). The sum depends on the number of sides, never on size. Irregular shapes: subtract the known angles from the sum; never divide.

**Parallel lines.** A diagonal (transversal) crosses two parallel beams. Sliding the four-angle cluster at the top crossing along the diagonal lands it exactly on the bottom cluster, so angles in matching positions are equal (**corresponding**). Opposite angles then make **alternate** angles (between the beams, opposite sides of the diagonal) equal. **Co-interior** angles (between the beams, same side) add to 180°. Equal family and 180° family are colored apart. Names are said in words; the "F" and "Z" letter shapes are not taught. Off-set and rotated beams are used so parallel lines that barely overlap are still seen as parallel. When the beams are not parallel, the slid cluster does not fit; and if corresponding angles are unequal, the lines cannot be parallel (Act IV's sagging beam).

**Rectangle facts.** A rectangle has four right angles and two pairs of equal opposite sides. So one given side fixes its opposite, a missing corner is 90°, the parts of a split corner add to 90°, and a missing side comes from the perimeter by halving first (24 cm with a 7 cm side: 12 − 7 = 5 cm); subtracting straight from the perimeter is the classic slip. Diagrams are not to scale.

**Angle chasing.** On a not-to-scale diagram, find one angle, name the rule that gives it, write it on, use it for the next. Reasons come from a fixed list of nine tiles (the eight angle rules plus rectangle facts). Longer chains name the whole each time and keep the crossing's two relations apart: opposite angles are set **equal** (2x + 10 = 130, so x = 60), neighbors on a line add to 180°. The pack's worked chain is Euclid's picture: bottom angles 50° and 60° beside the triangle's corner on a line parallel to the top, middle 70°, top corners 50° and 60° by alternate angles, total 180°.

**Matching triangles (Keeper's Desk).** Two triangles are **congruent** (≅) when one fits exactly on the other, turned or flipped. A triangle has six parts (three sides, three angles), but three are enough in four cases: SSS, SAS (the angle **between** the two sides), ASA (the side between the two angles; AAS follows, because the third angle is forced) and RHS (right angle, hypotenuse, one side). Two cases are not enough: two sides with an angle **not** between them (sides 6 m and 4 m with 30° can close at a third side of about 7.8 m or 2.6 m) and three angles (same shape, any size, as Triangle Corners' Stretch shows). Labeling: corners A, B, C, side a opposite A; △ABC ≅ △DEF pairs A with D, B with E, C with F, so the letter order states the match. Determination is found by building, never asserted.

**Real anchors (see audit).**
- **Euclid, *Elements* Book I, Proposition 32.** Written in Alexandria about 300 BCE, the *Elements* has 13 books. I.32 states that a side produced makes an outside angle equal to the two inside opposite angles, and that the three inside angles equal two right angles; the proof draws a line through one vertex parallel to the opposite side (I.31) and uses alternate and corresponding angles (I.29). Euclid organized many earlier results. Proclus's commentary on I.15 reports that Eudemus credited Thales with first discovering that vertically opposite angles are equal, while the scientific proof is Euclid's; Eudemus's history is lost, so this is second-hand.
- **The Saint Catherine's Monastery truss (Sinai, Egypt).** The basilica's wooden roof, dated 548-565, uses king post trusses (two rafters, a tie beam, a central post) and is widely cited as the oldest surviving roof truss; a conservation text says "reputed to be", so child text says "often called".
- **The Japanese carpenter's square (sashigane, also kanejaku).** An L-shaped square with arms of about 49 cm and 24 cm, used to measure, make right angles and mark with an ink line; scales on the back were devised for roof corners at the eaves (JAANUS).

## The lesson

Jane's **teach → guided → practice** order on every bench: a teach card with a step-revealed worked example, a guided first item with 2-3 visible steps, then practice.

| Bench | Teach | Guided | Practice |
| --- | --- | --- | --- |
| Corner Pegs | T1-T3 | Long thin point-down shape (3 steps) | Set A |
| Straight Beam and Hub | T4-T6 | Strut at 110° (3 steps) | Set B |
| Triangle Corners | T7-T10 | 55° and 70° (3 steps) | Set C |
| Polygon Frames | T11, T12 | Pentagon from one corner (3 steps) | Set D |
| Parallel Beams | T13, T14 | a = 50°: find e, then c (3 steps) | Set E1-E4 |
| The Chase Board | T15-T17, H1 | Euclid's picture (3 steps) | Set E5-E8, Set F |
| Twin Trusses | T18, T19 | Sticks of 3, 4 and 5 m (3 steps) | Set G |

**"I'm stuck" ladder** on every item: (1) the hint; (2) an easier worked case plus how to start this one (twelve families in the companion); (3) **Skip for now**, no penalty, nothing recorded against the child.

**Contrasts:** straight vs curved side; closed vs gap; turned vs changed; four bars vs three; line (180°) vs point (360°); opposite vs neighbor; torn corners (one triangle) vs Euclid (every triangle); small vs enlarged triangle; regular (divide) vs irregular (subtract); inside vs outside at a corner; outside at one corner vs all the way round; equal family vs 180° family; parallel vs tilted beams; looks vs reasons; halve the perimeter vs subtract from all of it; angle between vs angle not between; same shape vs same shape and size.

**Top misconceptions designed against:** orientation, size or color decides the shape; near-misses accepted; only prototype shapes count; miscounted sides; a straight line isn't an angle; 360° on a line or 180° at a point; parts must be equal; opposite angles add to 180°; all four angles at a crossing are equal; triangle angles add to 360°; bigger triangles have bigger angle sums; equal-looking angles assumed equal; the polygon sum reported as one angle; dividing for an irregular polygon; n triangles instead of n − 2; inside and outside confused; all parallel-line angles equal; corresponding and alternate confused; rules applied to non-parallel lines; reasons from appearance; a demonstration treated as a proof; subtracting a rectangle's side straight from the perimeter; a diagonal assumed to halve a rectangle's corner; vertically opposite angles found by taking away; two sides and any angle treated as SAS; matching angles taken as congruence; any three parts assumed to fix a triangle; letter order ignored in △ABC ≅ △DEF.

## The game or activity

**(a) Corner Pegs, model `peg-board-v1`.** A 9 × 9 peg board with string. *A made-up model: pegs and string; the board counts sides and never says which shape is best.* **Sort**: drag 12 shape cards (varied triangles; near-misses with a curved side, a gap or four sides) into *Triangle* / *Not a triangle*. **Change it**: Turn it, Make it bigger and Paint it leave the label unchanged; bending a side or opening a corner flips it, with the broken feature highlighted. **Build orders**: a triangle unlike mine, four corners, a pentagon, a hexagon, one square corner; any valid shape counts, and a side tally marks each side once. **Square check** lays a carpenter's square on a corner. **Wobble test**: push a frame; four-bar frames lean, triangles hold; add a diagonal to make the square hold.

**(b) Straight Beam and Hub, model `beam-hinge-v1`.** Three modes: a strut on a rail (two angles), three or four beams at a hub, and two crossed braces. Beams turn on pins in 5° steps between 10° and 170° per part. *A made-up model: exact angles in 5° steps; the total stays locked.* A banner ("These share 180°" / "These share 360°") stays fixed while parts trade size. **Hide one angle** and predict it before **Show it**. Crossed braces color opposite pairs and keep them equal as the brace turns.

**(c) Triangle Corners, model `torn-corners-v1`.** A triangle the child reshapes by dragging corners. **Tear the corners** and **Fit them on the line** animate the three angles onto a straight edge. **Stretch** enlarges without changing shape; a line reports "Sides: growing. Angles: the same. Total: 180°." A quadrilateral mode adds one diagonal and shows 2 × 180°. *A made-up model: the screen fits the corners exactly; paper fits nearly.*

**(d) Polygon Frames, model `polygon-frame-v1`.** Frames with 3 to 12 sides. **Pick a corner** and **Draw a line** to split into triangles with a running tally (triangles, then × 180°). **Regular / Irregular** drags one corner and keeps the total. **Walk the edge** sends a marker round, turning by each outside angle and summing to 360°. Heptagon (128.6°, not a whole number) appears only at Keeper's Desk, labeled "about". *A made-up model: idealized straight beams and exact angles.*

**(e) Parallel Beams, model `parallel-beams-v1`.** Two beams with matching arrow marks and a diagonal at 20° to 160° in 5° steps; default 50°. Angles named a-d (top) and e-h (bottom) by position: above-left, above-right, below-left, below-right. **Slide the crossing** carries a copy of the top cluster down the diagonal. **Color equal pairs** and **Color pairs that make 180°** separate the families. **Shift the beams** off-sets or rotates the whole picture. **Tilt the bottom beam** (±2° to ±8°) breaks parallel: the slid copy no longer fits. *A made-up model: perfect straight beams; a real frame is checked with a straightedge.*

**(f) The Chase Board, model `chase-board-v1`.** Not-to-scale diagrams built from the benches above. The child picks an angle, enters a number and chooses one of eight reason tiles; the found angle is written onto the diagram and becomes an input for the next step. Every step has a reason slot; a number without a reason stays marked "reason?" (never "wrong"). Rectangle diagrams (a frame with a diagonal, sides and perimeter given) add the **rectangle facts** tile, and a chain may end in an equation box ("2x + 10 = 130"). *A made-up model: diagrams are not to scale on purpose.*

**(g) Twin Trusses (Keeper's Desk), model `twin-truss-v1`.** Given three parts (sides in whole meters from 2 to 9, angles in 5° steps), the child builds a truss triangle with sticks and a protractor, then presses **Try another** to build a different triangle from the same parts. **Swing the side** shows a free side meeting the base at two points, one point or none. The outcome card reads *one triangle only*, *two different triangles* or *same shape, many sizes*, built by the child, never a verdict. **Match the letters** lays △ABC on △DEF and pairs corners by letter order. Cases: SSS 3-4-5; SAS 8 m, 60°, 5 m (spec 181's brace); ASA; RHS with the 3-4-5 right triangle; two sides with an angle not between (6, 4, 30°); three angles 50-60-70 at two sizes. *A made-up model: perfect sticks and exact angles; real timber bends a little.*

No timers, scores, streaks, medals or locks. Every bench is open from the first visit.

## Problem sets

Seven sets, **40 items**, full text in the companion:

| Set | Depth | Items | Formats |
| --- | --- | --- | --- |
| A. Triangles and corners | Sprout (A1-A3), Seedling (A4-A6) | 6 | 3-choice, match |
| B. Lines, points and crossings | Seedling (B1, B2), Sapling (B3-B6) | 6 | 3-choice, number |
| C. Triangles and quadrilaterals | Sapling (C1-C5), Keeper's Desk (C6) | 6 | number with worked steps, 3-choice |
| D. Polygon frames | Sapling (D1, D2), Keeper's Desk (D3-D6) | 6 | number, 3-choice |
| E. Parallel beams and angle chasing | Sapling (E1-E3), Keeper's Desk (E4-E8) | 8 | 3-choice, number with reasons, *say why*, true / not true from this source |
| F. Rectangles and longer chains | Sapling (F1-F3), Keeper's Desk (F4, F5) | 5 | number, equation, number with reasons |
| G. Matching triangles | Keeper's Desk (G1-G3) | 3 | 3-choice |

Sprout items use pictures and words, no digits. Over the 18 three-choice items the right answer sits at A, B and C six times each. Four items (B6, C2, E4, G1) include a distractor that withholds more than the evidence requires: "you can't know without measuring", wrong because the rules already decide it. *Say why* (E6) is spoken to a grown-up and never stored or graded.

## Saved work

Optional root `trussYard` per explorer, absent until a first explicit action.

```
trussYard: {
  version: 1,
  pegs:    [{ source, order: orderId, pegs: [[x 0-8, y 0-8]], closed: bool, at }],   // latest 12
  sorts:   { [sortId]: { source, placed: { [cardId]: 'tri'|'not' }, at } },
  frames:  [{ source, bench: 'beam'|'corners'|'polygon'|'parallel', setting: { [key]: int }, predict: int|null, at }], // latest 12
  chases:  { [chaseId]: { source, steps: [{ angleId, value: int, reason: reasonId }], at } },
  twins:   { [caseId]:  { source, builds: [{ sides: [int 2-9], angles: [int 5-175] }], outcome: 'one'|'two'|'many', at } },
  answers: { [itemId]: { source, choice | value | values | match | marks, support: ['hint'|'example'|'skip'], at } }
}
```

`source` freezes the model version, the diagram's given angles and the item's choices and order. Codes and numbers only: angles are integers 0-360 (polygon totals up to 1800), polygon sides 3-12, stick lengths 2-9 m, lengths up to 100 cm, x up to 360, reasons from the fixed nine-tile list. Never recompute or rewrite saved results on load (a saved chase step is not re-judged against today's diagram); validate ids and ranges only. An unreadable entry stays raw and exportable while the rest stays open. Support stays separate from answers; no mastery flag. Shared export, import, reset and explorer switching.

## Curriculum fit

**Strands:** **M5** shapes, angles and parallel lines; **M7** reasoning and justification (angle chases with reasons; demonstration versus proof); **M1** addition and subtraction within 360 and multiplication by 180; **M4** a first equation for an unknown angle (F4); **H1** a 2,300-year-old proof and a 1,400-year-old roof as sources. Act families: II, III, IV.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Define a triangle by its attributes; draw and name polygons by side count; find missing angles on a line, at a point and at a crossing; derive and use the triangle sum; find quadrilateral and polygon sums and regular inside and outside angles; use corresponding, alternate and co-interior angles; chase angles with a named reason per step, including a short equation; find missing sides and angles in rectangles; decide by building which given parts fix a triangle, and read △ABC ≅ △DEF by letter order. |
| Teaching encounter | T1-T19 with step-revealed worked examples; a guided first item per bench. |
| Contrast | As listed in The lesson. |
| Supported practice | Change-it buttons; side tally; locked-total banner; torn corners; running triangle tally; Slide the crossing; reason tiles; the "I'm stuck" ladder. |
| New application | Wobble test; regular octagon; irregular pentagon; sides from an outside angle; the sagging beam (E4); Euclid's picture (E5, E6); outside angle of a triangle (E8); the split strut (F5); the swinging side (G2). |
| Purposeful revisit | Spec 181's protractor (measure one angle, reason the rest); spec 126's shapes; spec 125's floor tiles (why regular hexagons fit: 3 × 120° = 360°); spec 154's beams; Act IV evidence. |
| Data boundary | Settings, peg positions, predictions, chase steps, choices, values and support codes, all local. No timing, free text or location. |

## Upstream check

Refreshed upstreams: Jane `0ec55f7e083976e6fcc3977fca460b1f5e199d91` and Marble `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (both 2026-10-24). Ids confirmed in the pinned `curriculum/marble/topics.json`.

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Angles in triangles (age 6+), actual content: defining attributes (`mt_bfhng6mOuy`) | Must-have versus doesn't-matter attributes; near-miss non-examples; rotate and resize the same shape; build to a spec and say why. Corner Pegs' Sort and Change it; A1, A2, A6. |
| Angles in triangles (age 7+), actual content: drawing shapes by attributes (`mt_zuOGOGFAKb`) | Build to a side count; demand irregular and turned examples; mixed find-them-all sets; mark each side once. Build orders with side tally; A4, A5. Cubes left to spec 126. |
| Angle Sum Rules (`mt_oqziWKry-L`) | Ground 180° and 360° in turns; additivity; fixed whole shared out; contrast the two totals; derive opposite angles. Straight Beam and Hub with locked banner; T4-T6; B1-B6. |
| Angles in triangles (age 10+), actual content: missing angles in polygons (`mt_cdMlC7EpTJ`) | Derive 180° (torn corners); build 360° and polygon sums by splitting; confront size; not-to-scale items; regular = sum then divide. Triangle Corners' Stretch; C1-C6. |
| Angle sums in triangles and polygons (`mt_J03RFlVdas`) | n − 2 triangles from one corner; demonstration versus proof; keep the one-corner 180° apart from the all-round 360°; "regular" on every ÷ n; walk the edge; sum depends on sides, not size. Polygon Frames; T11, T12; D1-D6; E6. |
| Angles with parallel lines (`mt_H_pNJ3ZI_S`) | Ground equality in translating the crossing; color equal versus 180° families; precise names and full reasons, no F/Z; off-set diagrams; non-parallel contrast. Parallel Beams; T13, T14; E1-E5. |
| Understanding angles (age 10+), actual content: angles at a point, on a line, vertically opposite (`mt_QDTO3GAgcq`) | Hold "opposite equal" and "neighbors add to 180°" apart on one crossing; hinged sticks so opposite angles stay equal as the crossing turns; given one angle, find and justify the rest; tilted crossings; derive opposite-equal from the line rule. Crossed braces mode; T6; B5, B6, F1. |
| Understanding angles (age 11+), actual content: multi-step chains (`mt_tedML_iu4Y`) | A named reason per step, no mnemonics; name the whole first; not-to-scale diagrams; an equation for an unknown (opposite pair set equal); carry each found angle forward. Chase Board; T15, T17; E5, F4, F5. |
| Understanding angles (age 9+), actual content: rectangle properties (`mt_KFKUR_gBg_`) | Deduce from four right angles and equal opposite sides; mark them first; keep perimeter apart from area; undo the perimeter by halving, then subtracting; diagrams not to scale; units. Chase Board rectangle diagrams; T16; F2, F3. Area is used only from spec 185, not here. |
| Angles in triangles (age 12+), actual content: congruence (`mt_167X6Ax8P7`) | Construct from given conditions to discover one, two or many triangles; included versus non-included angle; the swinging side; congruence versus similarity (AAA); correspondence notation; AAS from ASA. Twin Trusses; T18, T19; G1-G3; Match the letters. |

**Jane:** adopted teach → guided → practice, the three-step "I'm stuck" ladder, short second-person prompts, three-option choices with misconception-tagged distractors, step-revealed worked examples and a glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, points. No Jane code or text copied.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| Defining attributes (`mt_bfhng6mOuy`) | 2-D shapes (`mt_KJeEeTutJI`) | Met elsewhere: proposed specs 125 and 126 (draft PR #128); shape names supported inline here. |
| Defining attributes | 3-D shapes (age 5+) (`mt_yGv8doDAmp`) | Met elsewhere: proposed spec 184 (math build-out); informal side and corner words supported inline on the peg board. |
| Drawing shapes by attributes (`mt_zuOGOGFAKb`) | Defining attributes (`mt_bfhng6mOuy`) | Taught here (Corner Pegs Sort before Build orders). |
| Drawing shapes by attributes | 2-D shapes (age 6+) (`mt_sBcRdUfAzV`) | Supported inline (T2 side counting); no claim. No spec or map row claims it (spec 183 also supports it inline): documented gap. |
| Angle Sum Rules (`mt_oqziWKry-L`) | Types of angles (age 8+), diagram conventions (`mt_e4V6hvcuEJ`) | Met elsewhere: proposed spec 181 (math build-out, Mark-up Board); squares, arcs and parallel arrows recapped in the diagram convention and T3. |
| Angle Sum Rules | Degrees and turns (`mt_qUGMyMYn9m`) | Met elsewhere: proposed spec 165 (draft PR #145, Shadow Bench), recapped by spec 181's T12 and here in T3-T5. Documented gap if 165 does not ship. |
| Missing angles in polygons (`mt_cdMlC7EpTJ`) | Types of angles (age 8+) (`mt_e4V6hvcuEJ`) | Met elsewhere: proposed spec 181. |
| Missing angles in polygons | Classifying shapes by properties (`mt_liIW336odh`) | Met elsewhere: proposed spec 183 (math build-out); "regular" defined inline (T12, glossary). |
| Missing angles in polygons | Angle Sum Rules (`mt_oqziWKry-L`) | Taught here (bench b before bench c). |
| Angle sums in triangles and polygons (`mt_J03RFlVdas`) | Missing angles in polygons (`mt_cdMlC7EpTJ`) | Taught here (bench c before bench d). |
| Angle sums in triangles and polygons | Understanding angles (age 11+), multi-step chains (`mt_tedML_iu4Y`) | Taught here (Chase Board, T15, T17). |
| Angles with parallel lines (`mt_H_pNJ3ZI_S`) | Understanding angles (age 11+) (`mt_tedML_iu4Y`) | Taught here. |
| Angles at a point, on a line, vertically opposite (`mt_QDTO3GAgcq`) | Measuring angles (age 9+) (`mt_89riIKwGYp`) | Met elsewhere: proposed spec 181 (math build-out, T15, D4-D6). |
| Angles at a point, on a line, vertically opposite | Types of angles (age 8+) (`mt_e4V6hvcuEJ`) | Met elsewhere: proposed spec 181. |
| Angles at a point, on a line, vertically opposite | Angle Sum Rules (`mt_oqziWKry-L`) | Taught here (bench b). |
| Multi-step chains (`mt_tedML_iu4Y`) | Angle Sum Rules (`mt_oqziWKry-L`) | Taught here. |
| Multi-step chains | Understanding angles (age 10+) (`mt_QDTO3GAgcq`) | Taught here (crossed braces before the Chase Board). |
| Rectangle properties (`mt_KFKUR_gBg_`) | Understanding angles (age 8+), quadrilateral hierarchy (`mt_Xt1cRqaBOW`) | Met elsewhere: proposed spec 183 (math build-out, Family Tree); T16 recaps the rectangle's properties. Documented gap if 183 does not ship. |
| Congruence (`mt_167X6Ax8P7`) | Measuring angles (age 11+) (`mt_Jf8xcX4UTq`) | Met elsewhere: proposed spec 181 (math build-out, Millwright's Table SAS brace). Documented gap if 181 does not ship. |
| Congruence | Types of angles (age 11+), terms and notation (`mt_WtIFJSCQIT`) | Met elsewhere: proposed spec 183 (math build-out); corner and side labels recapped on the Twin Trusses. Documented gap if 183 does not ship. |

Claim check, 2026-10-25: no spec on main or any draft PR (126, 128, 137-151) claims the ten targets; `math-claims.txt` lists none of them, the build-out map assigns all ten here (four by reassignment), and `#workshop/truss` is unused. Sibling 181 and 183 claim none of them; sibling 187 recognizes congruence by tracing with no claim; `mt_tAJH5BrpOx` (area formulas) is proposed spec 186's.

## Checks for implementation

- **Numbers script (2026-10-25):** `check182.py` (`python3 -I`, scratch area, not the repo), 111 checks passing: 2 × 90 = 180, 4 × 90 = 360, 3 × 90 = 270; B3 70 (wrong 250); T5 120; B4 145 (wrong 215; 180 gives a negative); T6 140 and 40; B5 130 (wrong 50, 90); T7 a 50-60-70 triangle built from coordinates measures 50, 60, 70 and sums to 180; enlargements by 0.4, 2 and 3.5 keep all three angles; 20 random triangles sum to 180; T9 60; C1 55 (wrong 235, 125); C3 55 (wrong 145, 235); C4 65 (wrong 70, 245); T10 90; C5 65 (wrong 295); polygon sums for 3-10 and 12 sides; regular inside angles 60, 90, 108, 120, 135, 140, 144, 150 each matching 180 − 360/n; heptagon about 128.6; C6 120 (wrong 720, 60); D1 3 triangles, 540 (wrong 900); D2 72 (wrong 252); D3 135 (wrong 1080, 45); D4 360 (wrong 1800); D5 115 (wrong 108; convex); D6 12 (wrong 6); brute force over n = 3 to 999 confirms 360/n = 30 only at 12, a 135° regular polygon only at 8, a 540° sum only at 5; parallel beams at 50° give a-h = 50, 130, 130, 50 at both crossings, checked by vectors, with corresponding, alternate, opposite and co-interior relations; E3 50 (wrong 230); E4's tilted beam gives 54 ≠ 50; E5 geometry from coordinates gives 50, 60, 70 with bottom angles 50 and 60; E8 105 (wrong 75); T15 115.
- Diagrams say "not drawn to scale" and never let a measurement replace a given number; parallel beams always carry arrow marks; outside angles are always drawn on the extended side. Model lines show on every bench. Sprout items show no digits; feedback never says "wrong".
- Style check (`style182.py`) run on the companion: 0 em-dashes; teach and history cards at most 30 words; prompts and hints at most 15 words; feedback and explanations at most 20 words; scenes within spec 120's 30/150/80 limits; 15 three-choice items balanced 5/5/5 (writer's draft; after review, 18 items at 6/6/6, re-checked by the reviewer's style pass).
- Browser at 320 and 820 px: targets 44 px; tap-to-place pegs and tap-to-select angles as well as drag; every diagram has a text equivalent ("Top beam: a is 50°, above-left").
- Nuria's Spanish (*¡Triángulos!*, *Siempre.*) checked by a fluent reader before build.
- **Independent review, 2026-10-25.** Checked against the writers' brief: every item, worked example and model number recomputed with a separate reviewer script (`rcheck.py`, `python3 -I`, scratch area; 184 checks across specs 181-183, all passing, including the 50-60-70 triangle and enlargements from coordinates, 20 random triangles, the parallel-beam cluster by vectors, brute-force uniqueness for 12 sides and the octagon, and every new item: F1 137/43/137, F2 5 cm (wrong 17, 10), F3 55° (wrong 145), F4 x = 60 (wrong 85, 70), T17 x = 30, F5 45° (wrong 110), G1 SSS, G2's two third sides 7.8 and 2.6 m by the law of cosines, G3 50 + 60 + 70); distractor feedback; answer balance (recounted, now 6/6/6 over 18); Marble descriptions, research records and hard prerequisites; the build-out map; spec 120 chapter names; pronouns; the Hollis rule; routes; saved work; style (0 em-dashes in all three files). Changed: applied the map's reassignments (added `mt_QDTO3GAgcq`, `mt_tedML_iu4Y`, `mt_KFKUR_gBg_` and `mt_167X6Ax8P7` with upstream and crosswalk rows; removed `mt_tAJH5BrpOx`, now spec 186's); added T16-T19, rectangle diagrams and a ninth reason tile on the Chase Board, the Twin Trusses bench, and Sets F and G (8 items); re-anchored Scene 2 from a non-chapter ("Act III, opening and ending") to Act III, chapter 3; corrected crosswalk owners (Degrees and turns is spec 165's, not 181's; 3-D shapes (age 5+) is spec 184's; 2-D shapes (age 6+) is unclaimed).

## Review asks

**Subject expert:**
1. Is "three side lengths fix a triangle, so a triangle frame can't lean" right as the Wobble test's reason, with SSS named only on the Twin Trusses?
2. Is the slide-the-crossing argument for corresponding angles presented honestly as a demonstration, with Euclid's I.32 as the proof of the triangle sum (which itself rests on the parallel postulate)?
3. Is the a-h position naming (above-left, above-right, below-left, below-right) clear enough, or should diagrams use arcs and colors only?
4. Are the E6 "say why" model answer and E7's Thales statement fair to the sources?

**Owner questions, with defaults:**
1. Route `#workshop/truss` beside the Storm Workshop? *Default: yes.*
2. Ten targets in one pack, or split the Twin Trusses (congruence) into a later construction pack beside spec 181's Millwright's Table? *Default: one pack; the Twin Trusses ship last.*
3. First slice? *Default: Straight Beam and Hub with Set B, then Triangle Corners with Set C; Corner Pegs as the Sprout slice.*
