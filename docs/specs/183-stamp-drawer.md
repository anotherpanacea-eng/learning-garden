# 183. The Stamp Drawer: sorting shapes by what they have

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a math check.** Part of the [math build-out](https://github.com/anotherpanacea-eng/learning-garden/pull/154). Every child-facing line is in [the companion text](../content/183-stamp-drawer-text.md); sources and open checks are in the [source audit](../source-audits/183-stamp-drawer.md).

**Commissioning boundary:** a proposal only. Select a bounded first slice after independent content, model and save review; the six benches do not commission each other. All Act and chapter links are future adapters to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (draft PR #127). Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter. **Fact-check status:** the three history anchors were checked against search excerpts on 2026-10-25 (fetches blocked); no `[check]` item is in child text. The geometry is standard and still needs the math check.

## Purpose

Shapes appear across the garden as things to fit, fold, flip and pave (specs 125, 126, 96). Nobody yet asks the question a classifier asks: **what does this shape have, and which families does that put it in?** This pack takes ten untouched Geometry topics there, from building a triangle out of sticks to the quadrilateral family tree, the marks and letter names geometry uses, and drawing a triangle to order with a ruler and protractor.

A child comes to understand that a shape is named by its **properties** (sides, vertices, equal sides, right angles, parallel sides, lines of symmetry), never by how it is turned or how wide it looks; that each property has its own **check** (count, tick marks, a square corner, a sliding ruler, a fold); that one shape can belong to several families at once, and a smaller family keeps every property of the bigger one (a square is a rectangle **and** a rhombus, and not every rectangle is a square); that **regular** needs two keys at once, equal sides and equal angles; that a circle has a **center**, and its **radius** and **diameter** are tied (diameter = 2 × radius); that a shape outside a family is found by leaving out its properties; that letters, arrows, ticks and small squares state properties precisely enough for someone else to draw the shape; that a shape may fit its outline before a full turn (turn symmetry, with an order); and that a shape can be built or drawn from its properties alone.

**Builds on, never re-teaches:** spec 125's mirror lines and fold check (here: a count of lines of symmetry, used as one more property); spec 126's window pieces and parcel nets (here: the pieces and boxes are named by their properties); spec 96's square tiles; sibling spec 181's angle words, right-angle checks, parallel and perpendicular lines and the protractor (here: used as checks and tools); sibling spec 182's angle sums (never computed here); sibling spec 184's faces, edges and vertices of solids (here: one cube frame). **Not targeted:** circumference as a measured length and pi (sibling spec 186; this pack only names the circumference); kites (left out of the family tree; see Review asks); tessellation (spec 125's older benches); turning shapes on a grid (sibling spec 187). Turn symmetry appears here only as a property to count. **Map reassignments applied:** this pack now also owns `mt_Xt1cRqaBOW` (the quadrilateral hierarchy, including drawing quadrilaterals outside the subcategories) and `mt_WtIFJSCQIT` (conventional terms and notation; parallel and perpendicular marks; regular and symmetric polygons).

## Place and story

**Host:** **Dot's stamp drawer** at Willow Post Office, route `#post/stamps`, linked from the Post Office counter, spec 126's Parcel boxes (`#post/boxes`) and spec 125's Sign Painter. Willowbank has never had stamps of its own; Dot keeps a long wooden drawer of blank stamp shapes, a tray of sticks and clay, a compass, a ruler and a protractor. Open from the start; no bench requires another.

| Act and chapter (future adapters to spec 120) | Beat (full text in the companion) | Job depths |
| --- | --- | --- |
| II, ch. 1 *the weekly market* | Stallholders send parcels again. Dot opens her stamp drawer and finds it full of blank shapes and no stamps: Willowbank needs its own. | Sprout: build and draw a stamp shape. Seedling: check a stamp's properties. |
| II, ch. 4 *the first show* | After "I already unpacked", Dot designs a sheet of town stamps. Bramble says the square cannot go on the rectangle shelf. | Seedling: sort in the Venn drawer. Sapling: the family tree. |
| II ending, into III | The letter from Vadoalto arrives with a stamp shaped unlike any in the drawer. | Any depth: a "describe it by properties" card. |
| III, ch. 4 *letters up and down the river* | Nuria and Léon describe their own stamps by properties only; Willowbank sends round stamps and drawn-to-order triangles back. | Sapling: riddles and the two-key check. Keeper's Desk: draw to order, the Euclid card. |

One shared scene per chapter; any job is a whole contribution; nothing locks a story place. The town, stamps and letters are fiction, labeled apart from math, history and models. The old Keeper is not named (Hollis rule).

## The knowledge

**Building and drawing (Sprout, Seedling).** A straight side is a stick; a vertex (corner) is a clay ball where two sticks meet. A triangle needs 3 sticks and 3 balls, joined into a **closed** loop; a V with a gap does not count until a third stick closes it. A pentagon needs 5 and 5. A long thin triangle and a tall rectangle are still a triangle and a rectangle. A shape turned upside down keeps its name, because turning changes no side and no corner. A cube frame for Dot's stamp crate needs 12 sticks and 8 balls, making 6 square faces; one square of 4 sticks is a face, not yet a cube (faces, edges and vertices are spec 184's).

**Properties and their checks (Seedling, Sapling).** Count the **sides** and **vertices**. Tick marks show **equal sides**. A **right angle** is a square corner: check it with the corner of a card. Two sides are **parallel** when the gap between them stays the same all along: check by sliding a ruler. Parallel sides can be different lengths and can be tilted. Lines of symmetry, from spec 125's fold check, are one more property to count: the 4 by 2 rectangle stamp has 2 (its diagonals are not mirror lines).

**Triangle families.** By sides: **equilateral** (3 equal sides), **isosceles** (at least 2 equal sides), **scalene** (no equal sides). By angles: a **right triangle** has one right angle. The two sortings are separate questions, so a triangle can be right **and** isosceles (`s11`) or right **and** scalene (`s10`, sides 3, 4, 5). A right triangle stood on its point is still a right triangle.

**Sorting (Venn and Carroll).** A **Venn drawer** has two overlapping loops, each with a property; a shape goes where its properties put it, and the overlap holds shapes with both. A **Carroll grid** splits the drawer by two yes/no properties into four boxes, and every shape lands in exactly one. An empty box is a finding, not a mistake: in the "regular" and "has a right angle" box only the square fits, because no other regular polygon has a square corner.

**Regular and irregular.** A polygon is **regular** when **all sides are equal and all angles are equal**. The rhombus passes the sides key and fails the angles key; the non-square rectangle passes angles and fails sides; the square passes both. "Irregular" is the math word for failing either key, and has nothing to do with looking odd or untidy: the house-shaped pentagon has a line of symmetry and is irregular. Regular polygons have as many lines of symmetry as sides; other shapes need not (the parallelogram has none).

**The quadrilateral family tree (Sapling, Keeper's Desk).** **Trapezoid convention (math-check ruling, 2026-10-25): inclusive.** A trapezoid has **at least one** pair of parallel sides, the US Common Core-aligned modern convention, so every parallelogram (and so every rectangle, rhombus and square) is also a trapezoid; every item, card and tag uses this. Definitions used here, all inclusive: a **trapezoid** has at least one pair of parallel sides; a **parallelogram** has two pairs; a **rectangle** is a parallelogram with four right angles; a **rhombus** is a parallelogram with four equal sides; a **square** is both a rectangle and a rhombus. Properties flow **down** the tree: whatever every parallelogram has, every rectangle, rhombus and square has too. The arrows go one way: every square is a rectangle; most rectangles are not squares. Inclusion chains: a square is a rhombus, a rhombus is a parallelogram, so a square is a parallelogram. Euclid's own list (H2) sorted the other way, with "oblong" meaning a rectangle that is not a square; definitions are choices, and modern math chooses the inclusive ones because properties then pass down.

**Outside the families.** A quadrilateral with no four right angles and no four equal sides is not a rectangle, rhombus or square; drawing one (D7) checks which properties define each family. A square turned on its corner (a "diamond") is still a square.

**Marks, names and turn symmetry (Sapling, Keeper's Desk).** Capital letters name vertices; AB is the side from A to B; ABCD names a quadrilateral in order round it. Arrows mark parallel sides (AB ∥ DC), a small square marks a right angle (AB ⊥ AD), tick marks equal sides; ∠ABC (vertex in the middle) is recapped from spec 181. A shape has **turn symmetry** when it fits its own outline after less than a full turn about its center; its **order** is the number of fits in one full turn (order 1 means none). A regular polygon with n sides has n lines of symmetry and order n; the parallelogram has order 2 and no line of symmetry; the trapezoid with equal slants has 1 line and order 1. **Describe it** tasks make the notation useful: a description must let someone else draw only the intended stamp.

**Diagonals (Keeper's Desk).** Checked by folding and measuring on the board, never asserted from a picture: every parallelogram's diagonals cut each other in half; a rectangle's diagonals are equal (4 by 2 stamp: both about 4.5 cm); every rhombus's diagonals cross at a right angle; a non-square rhombus's are unequal; a plain parallelogram's are neither equal nor at right angles. A square's diagonals are equal, perpendicular and bisect each other.

**Parts of a circle.** The **center** is the point every edge point is the same distance from. A **radius** goes from the center to the edge. A **diameter** goes edge to edge **through the center**, so it is two radii: diameter = 2 × radius, and radius = diameter ÷ 2 (r 4.5 cm gives d 9 cm; d 10 cm gives r 5 cm). A line edge to edge that misses the center is a **chord**, shorter than the diameter; the diameter is the longest line across. The **circumference** is the distance all the way round; measuring it is spec 186's.

**Drawing to order (Sapling, Keeper's Desk).** With spec 181's protractor routine (estimate first: more or less than a right angle; center on the vertex; zero line along the side) and a ruler read from its zero mark: a rectangle 6 cm by 4 cm, checked by equal diagonals (both about 7.2 cm); a triangle with sides 5 cm and 7 cm and 60° between them (base first, angle at one end, the second side, then close it; the third side measures about 6.2 cm; reading the other scale gives 120° and about 10.4 cm, a triangle that looks wrong); a regular polygon by **side and turn**: draw a side, turn the same amount, repeat. The turns make one whole turn, so a regular pentagon turns 72° at each corner (the inside angle is 108°), a hexagon 60°, a square 90°.

**Real anchors (see audit).**
- **The Cape triangles.** On 1 September 1853 the Cape of Good Hope (in what is now South Africa) issued its first postage stamps, a 1d and a 4d, and they were triangles, printed in London by Perkins, Bacon & Co. They had no perforations, so postmasters cut them apart. Later printings ended in 1863-64 and the Cape moved to rectangular, perforated stamps. Why a triangle is disputed (a revenue office's triangular cancelling device of 1839; letting people who could not read tell them apart); child text says nobody is sure.
- **Euclid's definitions.** Book I of Euclid's *Elements* (Alexandria, about 300 BCE) defines the circle, its center and its diameter, which "bisects the circle"; sorts triangles into equilateral, isosceles ("two of its sides alone equal") and scalene; and names four quadrilaterals: square, oblong (right-angled, not equilateral), rhombus (equilateral, not right-angled) and rhomboid, calling all others trapezia. Euclid's sorting is exclusive, the opposite of the family tree here.
- **Abu al-Wafa's book for craftsmen.** Abu al-Wafa al-Buzjani, working in Baghdad, wrote about 990 a book of geometric constructions for craftspeople, including how to draw regular polygons with a ruler and a compass whose opening stays fixed (the "rusty compass").

## The lesson

Jane's **teach → guided → practice** order on every bench: a teach card with a step-revealed worked example, a guided first item with 1-4 visible steps, then practice.

| Bench | Teach | Guided | Practice |
| --- | --- | --- | --- |
| Stick and Clay Table | T1, T2 | Pip's open V (3 steps) | Set A |
| Stamp Checker | T3-T6, T18 | The rhombus stamp's property card (4 steps) | Set B, F2, F3 |
| Sorting Drawer | T7, T8 | The right triangle in the Venn drawer (3 steps) | Set C |
| Two-Key Press | T9 | The rhombus at the press (2 steps) | Set C |
| Family Tree | T10-T12 | Drag the rectangle into a square (3 steps) | Set D (D7 on dot paper) |
| Drawing Board | T13-T17 | Radius 3 cm, find the diameter (3 steps) | Set E, F1, F4 |

**"I'm stuck" ladder** on every item: (1) the hint; (2) an easier worked case plus how to start this one (the companion lists them); (3) **Skip for now**, no penalty, nothing recorded against the child.

**Contrasts:** open V vs closed triangle; wide vs tall rectangle; upright vs turned; same length vs parallel; isosceles vs equilateral; right isosceles vs right scalene; sides key vs angles key; regular vs tidy-looking; "all squares are rectangles" vs "all rectangles are squares"; Euclid's exclusive list vs the inclusive tree; rectangle diagonals vs parallelogram diagonals; radius vs diameter vs chord; 60° vs its supplement 120°; arrows vs ticks vs small squares; line symmetry vs turn symmetry; a description that fits one shape vs one that fits two.

**Top misconceptions designed against:** an open shape counts; the wrong number of parts; a shape is named by its usual position; one square is a cube; parallel means same length or level; mixing up parallel and perpendicular; a tilted right triangle is not right; each shape has only one name; equilateral and isosceles never overlap; regular means equal sides only, or equal angles only, or tidy; regular shapes are the only symmetric ones; a square is not a rectangle; class inclusion runs both ways; inclusion is not passed down a chain; diagonals of every parallelogram are equal; radius and diameter swapped; any line across is a diameter; reading the wrong protractor scale; a nearly closed triangle is fine; a turned square is a "diamond", not a square; parallel marks read as equal lengths; turn symmetry and line symmetry assumed to come together; everyday words in place of terms and marks.

## The game or activity

**(a) Stick and Clay Table, model `stick-clay-v1`.** A tray of equal and unequal sticks and clay balls. Sticks join only end to end at a ball; a shape lights its name only when it closes. **Build mode** (Sprout): copy a stamp outline from a card, including a long thin triangle and a tall rectangle. **Turntable**: turn a finished shape or Dot's pyramid paperweight; its name stays. **Dot paper** (Seedling): draw a shape by tapping dots; each side is marked as drawn. **Crate frame** (Seedling): build a cube frame; a count strip shows sticks and balls used beside 12 and 8. *A made-up model: sticks snap only at balls, and a shape counts when every ball joins exactly two sticks.*

**(b) Stamp Checker, model `stamp-props-v1`.** One stamp at a time from the drawer's 15 blank shapes (`s1`-`s15`, exact coordinates in the numbers script). Six tools: **Count** (taps each side and vertex), **Tick** (marks equal sides), **Corner card** (fits a square corner), **Slide ruler** (slides along one side to test another for a steady gap), **Fold** (spec 125's fold check, here counting lines), **Turn** (turns the stamp about its center and counts the fits in one full turn). Each tool fills one row of the stamp's **property card**. Triangle stamps add a **family line**: equilateral, isosceles or scalene, and right or not. Stamps appear turned, tilted and in unusual proportions. *A made-up model: perfect drawn shapes; real cut stamps are never exact.*

| Stamp | Sides | Right angles | Parallel pairs | Lines of symmetry | Turn order | Regular |
| --- | --- | --- | --- | --- | --- | --- |
| `s1` square 3 cm | 4 | 4 | 2 | 4 | 4 | yes |
| `s2` rectangle 4 by 2 | 4 | 4 | 2 | 2 | 2 | no |
| `s3` rhombus, sides 5 | 4 | 0 | 2 | 2 | 2 | no |
| `s4` parallelogram | 4 | 0 | 2 | 0 | 2 | no |
| `s5` trapezoid (equal slants) | 4 | 0 | 1 | 1 | 1 | no |
| `s6` right trapezoid | 4 | 2 | 1 | 0 | 1 | no |
| `s7` equilateral triangle | 3 | 0 | 0 | 3 | 3 | yes |
| `s8` isosceles triangle | 3 | 0 | 0 | 1 | 1 | no |
| `s9` scalene triangle | 3 | 0 | 0 | 0 | 1 | no |
| `s10` right scalene (3, 4, 5) | 3 | 1 | 0 | 0 | 1 | no |
| `s11` right isosceles | 3 | 1 | 0 | 1 | 1 | no |
| `s12` regular hexagon | 6 | 0 | 3 | 6 | 6 | yes |
| `s13` regular pentagon | 5 | 0 | 0 | 5 | 5 | yes |
| `s14` house pentagon | 5 | 3 | 1 | 1 | 1 | no |
| `s15` regular octagon | 8 | 0 | 4 | 8 | 8 | yes |

**(c) Sorting Drawer, model `sort-drawer-v1`.** Dot's drawer with movable dividers. **Picture sort** (Sprout): "round" and "has corners", no numbers. **Venn drawer** (Seedling up): two loops, each with a property label from the checker; the child drags stamps in, and **Check one** opens that stamp's property card beside the loops. **Carroll grid** (Sapling up): two yes/no properties, four boxes. The child may choose labels and must then sort every stamp; empty boxes stay visible with "Can anything go here?" *A made-up model: a fixed set of stamps; real sorting has borderline cases.*

**(d) Two-Key Press, model `two-key-v1`.** A stamp press with two keys: **Equal sides?** and **Equal angles?** Each key turns only after the child runs its check (tick tool or corner and angle tool) on the stamp. The press prints "regular" when both turn, and "irregular: sides key" or "irregular: angles key" otherwise, naming the key that failed. Key cases: rhombus, non-square rectangle, square, the house pentagon, regular and irregular hexagons. *A made-up model: a press that reads properties; real presses just print.*

**(e) Family Tree, model `quad-tree-v1`.** A quadrilateral with draggable corners above a tree of five name tags (trapezoid, parallelogram, rectangle, rhombus, square). Tags light when their properties are met and stay lit while still met; dragging a rectangle until its sides are equal lights **square** while **rectangle** stays on. **Property table** (Sapling) shows ticks gathering down the tree. **Always, sometimes, never** cards (Keeper's Desk). **Diagonal lens** (Keeper's Desk): draws both diagonals with length labels, a midpoint marker and a corner card where they cross. *A made-up model: snapped grid corners and lengths to the nearest millimeter.*

**(f) Drawing Board, model `draw-board-v1`.** **Compass** (Sapling): set an opening on the ruler, place the point, draw a circle; the opening is the radius. Tap to draw a radius, a diameter or a chord; each gets its label and length, and a **Longest line** challenge asks the child to predict before lines are measured. A radius and diameter table fills as circles are drawn (r 1-5 cm, d 2-10 cm). **Ruler and protractor** (Sapling, Keeper's Desk): spec 181's protractor, snapping to whole millimeters and whole degrees, with an estimate-first prompt ("more or less than a square corner?") before the scale is read. Orders: a 6 by 4 rectangle, the 5-7-60° triangle, a regular pentagon by side and turn. A **closure check** shows any gap at the last corner; a near-closing figure is shown as a gap to find, never as done. **Describe it** (Sapling, Keeper's Desk): the child builds a stamp's description from word and mark tiles (AB, ∥, ⊥, ticks, small square, regular, lines of symmetry, turn order); Léon's pen draws what the tiles allow and shows a second shape whenever the description fits more than one stamp. *A made-up model: perfect tools, whole degrees and millimeters only.*

No timers, scores, streaks, medals or locks. Every bench is open from the first visit.

## Problem sets

Six sets, **36 items**, full text in the companion:

| Set | Depth | Items | Formats |
| --- | --- | --- | --- |
| A. Build it, draw it | Sprout (A1-A3), Seedling (A4-A6) | 6 | 3-choice, number, draw |
| B. What does it have? | Seedling (B1-B3), Sapling (B4-B6) | 6 | 3-choice, number, property table |
| C. Sorting, and two keys | Seedling (C1, C2), Sapling (C3-C6) | 6 | 3-choice, sort, Carroll count |
| D. The family tree | Sapling (D1-D3, D7), Keeper's Desk (D4-D6) | 7 | 3-choice, true / not true from this source, *say why*, draw |
| E. Circles and drawing to order | Sapling (E1-E3), Keeper's Desk (E4-E7) | 7 | number, 3-choice, draw and measure, true / not true from this source |
| F. Words, marks and turns | Sapling (F1, F2), Keeper's Desk (F3, F4) | 4 | 3-choice, number |

Sprout items use no numbers. Over the 21 three-choice items the right answer sits at A, B and C seven times each. *Say why* is spoken to a grown-up and never stored or graded.

## Saved work

Optional root `stampDrawer` per explorer, absent until a first explicit action.

```
stampDrawer: {
  version: 1,
  builds:  [{ source, mode: 'build'|'dots'|'crate', shapeId, sticks: 0-24, balls: 0-16, closed: bool, at }],  // latest 12
  cards:   { [stampId]: { source, rows: { sides, vertices, equal, right, parallel, lines, turns }, at } },
  describe:{ [taskId]: { source, tiles: [tileId], at } },
  sorts:   { [sortId]: { source, kind: 'picture'|'venn'|'carroll', labels: [propId], placed: { [stampId]: cellId }, at } },
  press:   { [stampId]: { source, sides: bool, angles: bool, at } },
  drawings:{ [orderId]: { source, lengths: [mm], angles: [deg], gap: mm, at } },
  answers: { [itemId]: { source, choice | value | order | placed, support: ['hint'|'example'|'skip'], at } }
}
```

`source` freezes the model version, the stamp's coordinates and the item's choices and order. Codes and numbers only; no free text, drawings are stored as lengths and angles. Ranges are validated (stamp ids `s1`-`s15`, property values 0-8 (turn order 1-8), tile ids from the fixed tile list, lengths 1-200 mm, angles 1-179). Never recompute or rewrite saved results on load: a property card or a gap is shown as the child left it. An unreadable entry stays raw and exportable while the rest stays open. Support stays separate from answers; no mastery flag. Shared export, import, reset and explorer switching.

## Curriculum fit

**Strands:** **M5** shapes and properties (M5-I building and naming, M5-II properties and sorting, M5-III families and inclusion), **M7** definitions and "always, sometimes, never" reasoning, **M6** measuring lengths and angles to draw; **H1** a stamp and two old books as sources. Act families: II, III.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Build and draw closed shapes from their parts, in any orientation; check and record sides, vertices, equal sides, right angles, parallel sides and lines of symmetry; name triangle families on two separate sortings; sort in Venn and Carroll drawers; judge regular and irregular on two keys; place quadrilaterals in an inclusive family tree and use inherited properties, including diagonals; name and relate center, radius, diameter, chord and circumference; draw rectangles, triangles and regular polygons to order; draw a quadrilateral outside the rectangle, rhombus and square families; read and use AB, ∥, ⊥, ticks and small squares to describe a shape; find lines of symmetry and the order of turn symmetry. |
| Teaching encounter | T1-T18 with step-revealed worked examples; a guided first item per bench. |
| Contrast | As listed in The lesson. |
| Supported practice | Closing light; property card tools; Check one in the drawer; the two keys naming the failed one; lit tags that stay lit; estimate-first prompt; closure gap; the "I'm stuck" ladder. |
| New application | Turned and tilted stamps; Nuria's and Léon's property riddles; empty Carroll boxes; Euclid's exclusive list; the 120° triangle; the pentagon by side and turn; Describe it for Léon (F4). |
| Purposeful revisit | Spec 125's fold check; spec 126's window pieces and parcel boxes, now named by properties; spec 181's protractor; spec 184's cube; spec 186's circles, where radius and diameter are used. |
| Data boundary | Shape choices, counts, placements, lengths, angles and support codes, all local. No timing, free text, drawings as images, or location. |

## Upstream check

Refreshed upstreams: Jane `0ec55f7e083976e6fcc3977fca460b1f5e199d91` and Marble `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (both 2026-10-24). Ids confirmed in the pinned `curriculum/marble/topics.json`.

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Building & Drawing Shapes (`mt_2VR963szuk`) | Name and count parts before building; insist on closure; straight sides on a grid; ask for non-standard versions. Stick and Clay Table counts before closing, lights only closed shapes, uses dot paper and asks for a long thin triangle and a tall rectangle (A1, A2, A6). |
| 2-D shapes (age 7+) (`mt_vJUa62bxeR`) | Draw accurately on dots; build a solid frame by counting edges and vertices; name a shape the same when it is turned. Dot paper, Crate frame (A5) and Turntable (A3). The screen rehearses; the off-screen straws card gives real handling. |
| Classifying shapes by line properties (`mt_r8c43QB6wx`) | A physical check for each relation; unequal and tilted parallel sides; near misses so the check is needed; right triangles rotated and scalene. Corner card and Slide ruler, tilted stamps, B3, B4, C1, C2. |
| Regular and irregular polygons (`mt_8H2kO4k2B9`) | Regular as two conditions checked together; rhombus and rectangle as the key cases flanking the square; separate the everyday meaning; avoid only regular examples. Two-Key Press names the failed key; C3-C5; the house pentagon. |
| Classifying shapes by properties (`mt_liIW336odh`) | Inheritance down a family tree; confront the one-way inclusion; ask for defining vs shared properties; counterexamples. Family Tree's lit tags, property table, D1-D3, D6; D2's hint asks for a rectangle that isn't a square. |
| Properties of triangles and quadrilaterals (`mt_DNYQLahbfa`) | Derive by construction and measurement; inclusive definitions contrasted with exclusive ones; dynamic shapes; transitive inclusion; diameter = 2 × radius. Diagonal lens, Euclid card (D5), D3, D4, E1, E2. Interior angles are used from spec 182; circumference ÷ diameter is spec 186's. |
| Parts of a circle (`mt_xq3YHZ2zeR`) | Each word anchored in where the line starts and ends; d = 2r both ways; longest line through the center; a word bank. Drawing Board's compass, Longest line, the r and d table, E1-E4. |
| Understanding angles (age 8+), actual content: quadrilateral hierarchy (`mt_Xt1cRqaBOW`) | Decide membership by a property checklist, not the look; overlapping loops so one shape sits in two families; non-prototypes (square, tilted rectangle, near-square); draw a quadrilateral that is none of the subcategories; justify in words. Family Tree lit tags; Venn drawer; T10, T11; D1-D3, D6, D7. |
| Types of angles (age 11+), actual content: terms and notation (`mt_WtIFJSCQIT`) | Terms for use, through describe-and-draw tasks; tilted shapes and non-examples; ∥ and ⊥ tied to never-meeting and square corners, never equal length; ∠ABC vertex in the middle (spec 181); justify symmetry by folding and turning. Describe it; Turn and Fold tools; T17, T18; F1-F4, C3-C5. |
| 2-D shapes (age 10+) (`mt_hdrMoiTgqu`) | Estimate before reading the protractor; center on vertex, zero on line; ruler from zero; base first, then angles; check the figure closes; regular polygons by side and turn. Drawing Board's estimate prompt, closure gap, E5, E6, T15, T16. |

**Jane:** adopted teach → guided → practice, the three-step "I'm stuck" ladder, short second-person prompts, three-option choices with misconception-tagged distractors, step-revealed worked examples and a glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, points. No Jane code or text copied.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| Building & Drawing Shapes | 3-D shapes (age 5+) (`mt_yGv8doDAmp`) | Met elsewhere: proposed sibling spec 184 (grain loft). Supported inline: T1 names sides and corners. Documented gap if 184 does not ship. |
| 2-D shapes (age 7+) | Edges, vertices, and faces (`mt_Mnodea7mG_`) | Met elsewhere: proposed sibling spec 184; the crate frame recaps 12, 8 and 6 inline. Documented gap if 184 does not ship. |
| 2-D shapes (age 7+) | 2-D shapes (age 6+) (`mt_sBcRdUfAzV`) | Supported inline (T1, T2, T3) and by the existing Number Garden "Corners count" task named in the learning atlas; no claim. |
| Classifying shapes by line properties | Lines, Rays & Angles (`mt_QysgF57dxh`) | Met elsewhere: proposed sibling spec 181 (turning tower). Supported inline: T4, T5 recap right angles and parallel lines. |
| Classifying shapes by line properties | Understanding angles (age 8+) (`mt_Xt1cRqaBOW`) | Taught here (T10, T11, Family Tree; all benches are open, so the property cards and the tree can be met in either order). |
| Regular and irregular polygons | Understanding angles (age 8+) (`mt_Xt1cRqaBOW`) | Taught here. |
| Quadrilateral hierarchy (`mt_Xt1cRqaBOW`) | 2-D shapes (age 6+) (`mt_sBcRdUfAzV`) | Supported inline (T1-T3); no claim; unclaimed in the map (documented gap). |
| Quadrilateral hierarchy | Angles in triangles (age 7+), drawing shapes by attributes (`mt_zuOGOGFAKb`) | Met elsewhere: proposed spec 182 (math build-out, Corner Pegs). Documented gap if 182 does not ship. |
| Terms and notation (`mt_WtIFJSCQIT`) | Regular and irregular polygons (`mt_8H2kO4k2B9`) | Taught here (Two-Key Press). |
| Terms and notation | Classifying shapes by properties (`mt_liIW336odh`) | Taught here (Family Tree). |
| Classifying shapes by properties | Regular and irregular polygons (`mt_8H2kO4k2B9`) | Taught here (Two-Key Press before Family Tree). |
| Classifying shapes by properties | Classifying shapes by line properties (`mt_r8c43QB6wx`) | Taught here (Stamp Checker before Family Tree). |
| Properties of triangles and quadrilaterals | Classifying shapes by properties (`mt_liIW336odh`) | Taught here (T10-T11 before T12). |
| Properties of triangles and quadrilaterals | Types of angles (age 11+) (`mt_WtIFJSCQIT`) | Taught here (T17, T18, Describe it). |
| Parts of a circle | none listed | n/a |
| 2-D shapes (age 10+) | Measuring angles (`mt_4MFUAsbx_6`) | Met elsewhere: proposed sibling spec 181 (protractor); T15 recaps the placement routine. Documented gap if 181 does not ship. |

Claim check, 2026-10-25: no spec on main or any draft PR (126, 128, 137-151) claims these ten targets, and the build-out map assigns all ten here (two by reassignment); specs 125 and 126 claim neighboring topics (2-D shapes, Lines of symmetry, Composing Shapes, Nets) only. Sibling specs 181, 182, 184 and 186 in this build-out claim the prerequisites and neighbors named above, not these targets.

## Checks for implementation

- **Numbers script (2026-10-25):** `check183.py` (`python3 -I`), 87 checks passing: every row of the 15-stamp property table recomputed from coordinates (sides, right angles, parallel pairs, regularity, lines of symmetry found by brute-force reflection), including the rectangle's 2 lines (wrong 4), the parallelogram's 0 and the house pentagon's 3 right angles and 1 line; triangle families (s10 sides 3, 4, 5; s11 right isosceles); the two keys (rhombus sides yes, angles no; rectangle the reverse); C5 3 regular of 6; C6 Carroll counts 1, 3, 2, 2 and "only n = 4 gives a regular polygon with a right angle" (n from 3 to 999); family-tree tags (the square lights all five; the parallelogram two); diagonals (all four parallelograms bisect; rectangle and square equal, about 4.47 cm; rhombus √80 and √20, perpendicular); cube frame 12, 8, 6; E1 9 (wrong 2.25), E2 5 (wrong 20); r and d table; chords 6, 5.66, 4.47, 3.32 for a 3 cm circle; E5 √39 ≈ 6.2 cm, supplement √109 ≈ 10.4 cm, wrong sum 12; turns 120, 90, 72, 60, 45 with inside angles 60, 90, 108, 120, 135; rectangle 6 by 4 diagonals 7.2 cm; four riddles each with exactly one stamp in the drawer (brute force over all 15); 18 three-choice items at A, B, C six times each; 31 items (writer's draft; after review, 36 items with 21 three-choice items at 7/7/7, as in Problem sets).
- Every stamp is shown at least once turned or tilted. Lit tags never switch off while their properties hold. The closure check never calls a gap closed. Model lines show on every bench. Sprout items show no numbers; feedback never says "wrong".
- Style check run on the companion: no em-dashes; teach cards at most 30 words; prompts at most 15 words; feedback and explanations at most 20 words; scenes within spec 120 limits.
- Browser at 320 and 820 px: targets 44 px; tap-to-place as well as drag in every drawer; every shape and property card has a text equivalent ("Rhombus: 4 equal sides, no right angles, 2 pairs of parallel sides, 2 lines of symmetry").
- Nuria's Spanish and Léon's French lines checked by fluent readers before build.
- **Independent review, 2026-10-25.** Checked against the writers' brief: every item, worked example and model number recomputed with a separate reviewer script (`rcheck.py`, `python3 -I`, scratch area; 184 checks across specs 181-183, all passing), including all 15 stamps rebuilt from coordinates (sides, right angles, parallel pairs, lines of symmetry and turn order by brute-force reflection and rotation), both riddles' uniqueness, F3's uniqueness (only the parallelogram has turn symmetry and no line), F4 (a rhombus with one right angle has four), the Carroll counts 1/3/2/2, diagonals, chords, E5's 6.2 and 10.4 cm and the side-and-turn angles; distractor feedback; answer balance (recounted, now 7/7/7 over 21); Marble descriptions, research records and hard prerequisites; the build-out map; spec 120 chapter names; pronouns; the Hollis rule; routes; saved work; style (0 em-dashes in all three files). Changed: applied the map's reassignments (added `mt_Xt1cRqaBOW` and `mt_WtIFJSCQIT` with upstream and crosswalk rows, T17, T18, the Turn tool, a turn-order column, Describe it, D7 and Set F); ruled the trapezoid inclusive and stated it once, adding an "always" card (a parallelogram is a trapezoid); crosswalk rows that pointed `mt_Xt1cRqaBOW` and `mt_WtIFJSCQIT` to spec 181 now say taught here; Euclid source-item note in D5 reworded.

## Review asks

**Math expert:**
1. Trapezoid convention. *Resolved by the math check, 2026-10-25: inclusive (at least one pair of parallel sides), stated once in The knowledge and used throughout.*
2. Is "isosceles: at least two equal sides" (so equilateral triangles are isosceles) right to teach beside Euclid's exclusive "two sides alone"?
3. Is the side-and-turn pentagon (72° turns) acceptable here, given spec 182 owns interior angle sums?
4. Are the diagonal facts pitched right for Keeper's Desk, checked by measuring rather than proved?

**Owner questions, with defaults:**
1. Route `#post/stamps` beside the Post Office? *Default: yes.*
2. Leave kites out of the family tree? *Default: yes, for a first slice; add a kite branch later beside spec 125's symmetry.*
3. Ten targets in one pack, or split building (Sprout, Seedling) from the family tree and drawing to order? *Default: one pack; the Stick and Clay Table can ship alone first.*
4. First slice? *Default: the Stamp Checker and Sorting Drawer with Sets B and C, then the Family Tree.*
