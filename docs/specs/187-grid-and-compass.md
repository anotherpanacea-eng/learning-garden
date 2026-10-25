# 187. Grid and Compass: position, turns, coordinates and moving shapes

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a math check.** Part of the [math build-out](https://github.com/anotherpanacea-eng/learning-garden/pull/154). Every child-facing line is in [the companion text](../content/187-grid-and-compass-text.md); sources and open checks are in the [source audit](../source-audits/187-grid-and-compass.md).

**Commissioning boundary:** a proposal only. Select a bounded first slice after independent content, model and save review; the six benches do not commission each other. All Act and chapter links are future adapters to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (draft PR #127). Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter. **Fact-check status:** history facts checked against search excerpts on 2026-10-25 (fetches blocked); no `[check]` item is in child text. The math is standard and still needs the math check.

## Purpose

Position and direction has a long Marble chain: words for where, turns, grid moves, coordinates in one quadrant and then four, and the three rigid moves. The garden already has a slice of it: the Cartographer's Table ([spec 58](58-cartographers-table.md), built) reads and places landmarks at first-quadrant points 0-5 and walks north/east/south/west unit routes; [spec 61](61-map-reader-dispatcher.md) adds an information gap; [spec 111](111-same-route-different-scale.md) changes a route's drawing scale. Nobody teaches **where words**, **turns as amounts**, **moves described as numbers**, **polygons from coordinates**, **four quadrants**, or **how coordinates change when a shape slides, flips or turns**. This pack takes nine untouched topics there, plus two it teaches in full that no spec claims: transformations on a grid and translating and reflecting with coordinates (eleven claimed targets).

A child comes to understand that a position word names a relation to a landmark; that left and right depend on the viewer's facing; that a turn is an amount of spin on one spot (whole, half, quarter, three-quarter, clockwise or counterclockwise) and a quarter turn leaves a right angle; that a grid move is "across, then up or down", counted in line jumps; that coordinates are read along first, then up, from a chosen zero; that a minus sign is a direction; and that a slide, a mirror and a turn about a point each have a number rule, keep size and shape, and only the mirror flips a shape over.

**Builds on, never re-teaches:** spec 58's first-quadrant point reading and placing, its intersections-not-cells rule and its unit direction chips (here: a bigger 10 × 8 map, compressed "4 right" moves, polygons); spec 111's "steps along lines, not squares" (here: the same counting rule); draft spec 123's Trundle relative turns and "three rights make a left" (here: named turn amounts, clockwise, and the right angle); draft spec 125's shape flips, half-turn borders and fold-checked mirror paintings (here: coordinates, rotation about a point, and rules). Sibling spec 181 measures angles in degrees; this pack stops at "a quarter turn is a right angle" and names 90° only in the Keeper's Desk rule table.

**Also targeted (added on review, 2026-10-25):** *Transformations on a grid* (`mt_SH7QgFl8-v`) and *Translating and reflecting shapes* (`mt_lxaM6iVpdr`). Draft spec 125 (PR #128) lists both only as references ("No claim beyond candidate reference"; "no coordinate claim"), so they are claimed here, and 125's mirror and half-turn benches are built on, not re-taught. **Not targeted:** *Coordinates (age 12+)* (`mt_y-BuQAfw4B`), whose pinned description is similarity and enlargement; it is owned by proposed spec 206 (math build-out), which can reuse the Shape Mover.

## Place and story

**Host:** **the Floor Map** inside Willow Post Office: Dot has pushed the benches to the walls and chalked the valley on the floor in squares. Linked from the Post Office, the Cartographer's Table and the Courier Yard. Open from the start; no bench requires another.

**Route:** **`#post/floor-map`**, beside spec 178's `#post/yard` (`#map/...` is reserved for the grown-up learning map's `#map/<topicId>` links). The Cartographer's Table stays at `#workshop/maps` and gains one quiet link: "A bigger map, on the post office floor."

| Act and chapter (future adapters to spec 120) | Beat (full text in the companion) | Job depths |
| --- | --- | --- |
| II, ch. 1 *the weekly market* | Dot chalks the valley on the floor so the stalls can be placed. "Over there is everywhere." Pip's old map shows a marsh the chalk map lacks. | Sprout: Where-Is-It Shelf, Turning Spot. Seedling: Floor Map Walk. |
| II, ch. 1 (second scene) | Bramble traces the market plan through the back of the paper and gets a mirror copy. | Sapling: Shape Mover (mirror). |
| III, ch. 3 *the route by the high ford* | Dot moves zero to Willow Bridge. The old map marks the ford "4 right, 3 down": below the mill. The librarian sees the writing is upside down; a half turn about the bridge puts the ford at (−4, 3). Hob Pennick confirms it. | Sapling: Whole Valley. Keeper's Desk: half turn about the origin (F1). |
| VI, ch. 2 *compare routes and keep a plan* | The exchange plan's routes written as grid moves: hill path 1 left, 5 up (6 steps); bridge way 12 steps, but dry. | Any depth: route moves; Keeper's Desk: rules. |

One shared scene per chapter; any job is a whole contribution; nothing locks a story place. The town, map, landmarks and characters are fiction, labeled apart from math, history and models. **Hollis rule:** Acts II and III say only "the old map"; nobody in child text names the old Keeper, and this pack never needs the name.

## The knowledge

**Position words.** On top of, under, above, below, beside, next to, between, in front of, behind, left, right. Each names a relation to a **landmark**: thing + word + landmark ("the letter is under the shelf"). "Over there" with a point is not yet a position. *Between* holds two relations at once. Left and right depend on facing: when Pip faces you, his right paw is on your left. In front of and behind, for a plain box, depend on where the viewer stands.

**Turns.** A turn spins on one spot; walking or stepping sideways is not a turn. Whole turn: same facing again. Half turn: the opposite way. Quarter turn: the next side around; it leaves a **right angle** between start and end. Three-quarter turn: three quarters on, the same facing as one quarter the other way. **Clockwise** is the way clock hands go seen from above; **counterclockwise** the other way. Two quarters make a half.

**Grid moves.** On a squared grid, describe a move across first, then up or down: "5 right, 1 up". Count jumps from line to line from the start (the start line is zero), never squares crossed or the landing number.

**Coordinates, first quadrant.** From the origin (0, 0): along the corridor first, then up the stairs. (5, 4) and (4, 5) are different points. Plot by finding the along line, then rising to the up line; points sit where lines cross (as in spec 58).

**Plotting and completing shapes.** Join plotted points in order. An upright rectangle's missing corner takes its first number from one neighbor and its second from the other; check side lengths and square corners rather than judging by eye. A tilted square (E4) needs equal sides and square corners, not shared numbers.

**Four quadrants.** Two number lines crossing at zero. A minus first number is left; a minus second number is down. The quadrant is read from the two signs: up right (+, +), up left (−, +), down left (−, −), down right (+, −); a point with a zero sits on an axis, in no quadrant. "Along the corridor, up the stairs" fails for negatives (sometimes you go *down* the stairs), so the four-quadrant bench says "first number across, second up or down". Keeper's Desk adds axes whose lines are worth 2 or 5, and half-way (decimal) coordinates. Moving zero from the corner to the bridge subtracts 5 and 3 from every coordinate while the places stay put (a grown-up line, not an item).

**Slides (translations).** Every point moves the same amount: right adds to x, left takes from x, up adds to y, down takes from y. The rule for "3 right, 1 down" is (x + 3, y − 1). Keeper's Desk sees the same move written as a column vector (3 above −1). Describing a move (how far) differs from naming where it lands.

**Mirrors (reflections).** Each point lands the same distance on the other side of the mirror line, along a line meeting the mirror at a right angle; points on the mirror stay put. In the y-axis: (−x, y). In the x-axis: (x, −y). In the upright line through a: (2a − x, y). In the line y = x (Keeper's Desk): (y, x). A mirror reverses a shape's **sense** (which way around it reads).

**Turns about a point (rotations).** A rotation needs a center, an amount and a direction. About (0, 0): half turn (−x, −y); quarter turn clockwise (y, −x); quarter turn counterclockwise (−y, x). About another center, measure from that center (F4: (3, 3) half-turned about (2, 2) is (1, 1)). A half turn flips both signs; a mirror in an axis flips one, which is how Scene 3 tells a turned map from a mirrored one.

**Congruence and sense.** Slides, mirrors and turns keep every length and angle: the image is congruent. Only a mirror reverses sense; tracing paper laid over a turned image fits without flipping, but a mirrored image needs the paper flipped. The flag A (1, 1), B (1, 4), C (3, 3) is scalene, so a flip shows.

**Real anchors (see audit).**
- **Pei Xiu's grid (China, 3rd century).** Pei Xiu (224-271), a minister of the Jin court, wrote six principles of mapmaking, among them an even rectangular grid and a graduated scale. His maps are lost; his preface survives in the *Book of Jin*. A stone map carved in 1136, the *Yu ji tu* (Map of the Tracks of Yu), has a grid whose squares each stand for 100 li. Child text says "about 1,800 years ago" and does not claim Pei Xiu invented the grid (some historians credit Zhang Heng earlier).
- **Stamma's chess squares (Aleppo, 1737).** Philipp Stamma, a chess player from Aleppo in Ottoman Syria, published an *Essai sur le jeu des échecs* in France in 1737 with an early algebraic notation: squares named by a file letter a-h and a rank number 1-8, across first, then up. His piece letters differed from today's. Seedling and up.
- **Descartes' La Géométrie (France, 1637).** Published in 1637 as an appendix to the *Discourse on Method*; it described curves with algebra, and "Cartesian" coordinates are named after Descartes. His own work used slanted axes and no drawn second axis; the four-quadrant picture came later. Keeper's Desk only, and F5 tests exactly that limit.

## The lesson

Jane's **teach → guided → practice** order on every bench: a teach card with a step-revealed worked example, a guided first item with 3 visible steps, then practice.

| Bench | Teach | Guided | Practice |
| --- | --- | --- | --- |
| Where-Is-It Shelf | T1, T2 | Letter under the shelf (3 steps) | Set A (A1-A4) |
| Turning Spot | T3, T4 | Quarter turn clockwise from the door (3 steps) | Sets A (A5, A6), B (B1-B3) |
| Floor Map Walk | T5, T6 | Post Office to Bakery (3 steps) | Sets B (B4-B6), C (C1-C3) |
| Corner Finder | T7 | Tent (3, 1), (3, 3), (7, 3) (3 steps) | Set C (C4-C6), E4 |
| Whole Valley | T10, T11 | Plot (−3, 4) (3 steps) | Set E |
| Shape Mover | T8, T9, T12-T14 | Slide B 3 right, 1 down (3 steps) | Sets D, F |

**"I'm stuck" ladder** on every item: (1) the hint; (2) an easier worked case plus how to start this one (the companion lists ten); (3) **Skip for now**, no penalty, nothing recorded against the child.

**Contrasts:** "over there" vs a landmark; my right vs your right; a turn vs a walk; clockwise vs counterclockwise; a quarter turn vs a half; the move vs the landing point; along-then-up vs up-then-along; lines vs squares; by eye vs by numbers; plus vs minus as direction; line worth 1 vs worth 2; one sign flipped (mirror) vs both (half turn); slide vs mirror (sense); turned vs mirrored (tracing paper).

**Top misconceptions designed against:** vague deictic words; one relation only for *between*; egocentric left/right; turning by travelling; turn amounts miscounted; clockwise confused with counterclockwise; a quarter turn unlinked to a right angle; the landing number given as the move; x and y reversed; counting squares, or counting the origin as 1; completing a shape by eye; joining corners out of order; a minus read as decoration; the corridor rhyme applied to negatives; ignoring an axis scale; a slide that flips; the mirror image at the wrong distance; a rotation with no center; a rigid move that changes size; a reflection mistaken for a rotation.

## The game or activity

**(a) Where-Is-It Shelf, model `place-words-v1`.** Dot's sorting shelf with a cup, lamp, box, letter, stamp, hat, parcel and bell. *A made-up model: pictures only, no numbers.* **Follow mode:** a spoken instruction (thing + word + landmark); the child places the thing; a placement in another relation outlines where the named relation is and invites another try. **Tell mode** (role flip, after the research's barrier game): the shelf hides; the child builds a sentence from thing, word and landmark tiles for Dot, who places hers to match. **Turn Pip around** shows Pip facing the child, so his left and right swap on screen. Open to a co-present grown-up; no partner recorded.

**(b) Turning Spot, model `turn-spot-v1`.** Pip on a chalk spot; door at the top, window right, stove at the bottom, counter left (seen from above). Turn buttons by amount and direction; Pip pivots without travelling; **Show the corner** draws the right angle between start and end facings after any quarter turn and counts quarters aloud for three-quarter turns. **Route mode** (Seedling): forward-1 and quarter-turn tiles on the floor squares to reach a named place, then follow Dot's route. *A made-up model: four facings only, no degrees.* Spec 123's Trundle remains the programming bench; this one names amounts and directions.

**(c) Floor Map Walk, model `floor-walk-v1`.** A 10 × 8 first-quadrant map with nine landmarks: Post Office (2, 1), Café (6, 1), Mill (9, 2), Bakery (2, 4), Willow Bridge (5, 3), Honey stall (6, 3), Library (7, 5), Orchard (3, 6), High ford (1, 6). Right/left/up/down counters build a move ("5 right, 1 up"); **Walk it** animates line jumps from the start with a running count; **Show coordinates** reads the landing point along-then-up; **Plot a point** places a named pair. The Orchard (3, 6) and Honey stall (6, 3) are a deliberate reversal pair. *A made-up valley: steps go line to line; real valleys are not this tidy.*

**(d) Corner Finder, model `corner-finder-v1`.** Market tents on the same grid with one corner missing. The child **says** the corner (typed pair or picker) before plotting it, then **Join the sides** in order and **Check the sides**, which reads side lengths and square corners as text. Upright rectangles and squares at Seedling and Sapling; the tilted square (E4) on the Whole Valley grid at Keeper's Desk.

**(e) Whole Valley, model `valley-grid-v1`.** Zero moves to Willow Bridge; the grid runs −6 to 6 across and −5 to 5 up. Valley key: Post Office (−3, −2), Café (1, −2), Mill (4, −1), Bakery (−3, 1), Willow Bridge (0, 0), Honey stall (1, 0), Library (2, 2), Orchard (−2, 3), High ford (−4, 3): every quadrant, plus an axis point. **Plot** replays the two signed moves from zero; **Read a point** works the other way; **Which part?** names the quadrant from the signs. Keeper's Desk adds **Line value 2 or 5** and half-way points. *A made-up model: the same valley with a new zero; the places do not move.*

**(f) Shape Mover, model `shape-mover-v1`.** Dot's scalene flag A (1, 1), B (1, 4), C (3, 3) on the four-quadrant grid. **Slide** by "n right/left, m up/down"; **Mirror** in an upright or across line through an offered whole number, or y = x at Keeper's Desk; **Turn** a quarter or half, clockwise or counterclockwise, about a chosen center point. **Predict a corner** comes first: the child states one image corner, then **Move it** animates and lists every image corner. **Trace and lay on top** shows a tracing that fits after a slide or turn but must flip after a mirror. **Show the rule** reveals the rule table row (companion). *A made-up model: whole-number moves; mirror lines upright, across or y = x; turns of a quarter or half only.* Point items move their named point; flag items move every vertex. Offer only transformations whose entire image fits the frozen grid (−6 to 6 across, −5 to 5 up); do not clip or clamp a transformed corner. D4 uses (2, 2) reflected in x = 4 to (6, 2), so its exact result remains on this grid.

No timers, scores, streaks, medals or locks. Every bench is open from the first visit.

## Problem sets

Six sets, **36 items**, full text in the companion:

| Set | Depth | Items | Formats |
| --- | --- | --- | --- |
| A. Where and which way | Sprout (A1-A6) | 6 | 3-choice, place |
| B. Turns and grid steps | Seedling (B1-B6) | 6 | 3-choice, move builder |
| C. Points and shapes | Seedling (C1-C3), Sapling (C4-C6) | 6 | 3-choice, plot, number pair |
| D. Moving points and shapes | Sapling (D1-D6) | 6 | number pair, 3-choice |
| E. The whole valley | Sapling (E1-E3), Keeper's Desk (E4-E6) | 6 | 3-choice, plot, number pair |
| F. Turns, mirrors and rules | Keeper's Desk (F1-F6) | 6 | 3-choice, number pair, true / not true from this source, *say why* |

Sprout items use no numbers. Over the 24 three-choice items the right answer sits at A, B and C eight times each. Four items carry a distractor that withholds more than the evidence requires (A1 "over there", A3 "you can't tell", C3 "the map has no (3, 6)", D5 "you can't tell without measuring"), each wrong for a reason the item states. *Say why* is spoken to a grown-up and never stored or graded.

## Saved work

Optional root `floorMap` per explorer, absent until a first explicit action.

```
floorMap: {
  version: 1,
  shelf:   [{ source, mode: 'follow'|'tell', item, word, landmark, at }],          // latest 12
  turns:   [{ source, start: 'door'|'window'|'stove'|'counter', amount: 1-4, dir: 'cw'|'ccw', at }],  // latest 12
  walks:   [{ source, from, to, moves: [{ dir: 'r'|'l'|'u'|'d', n: 0-10 }], at }],  // latest 12
  shapes:  [{ source, move: 'slide'|'mirror'|'turn', params, predict: [x, y] | null, at }],  // latest 12
  answers: { [itemId]: { source, choice | pair | points | moves | place | marks, support: ['hint'|'example'|'skip'], at } }
}
```

`source` freezes the model version (`place-words-v1`, `turn-spot-v1`, `floor-walk-v1`, `corner-finder-v1`, `valley-grid-v1`, `shape-mover-v1`), the landmark key, and an item's choices and their order. Codes and numbers only: coordinates are integers in each model's frozen range (or halves at E6), directions and words are codes mapped to text in the UI. Never recompute or rewrite saved results on load; validate ids and ranges only. An unreadable entry stays raw and exportable while the rest stays open. Support stays separate from answers; no mastery flag. Shared export, import, reset and explorer switching. Tell mode stores tile codes, never free text.

## Curriculum fit

**Strands:** **M5-I** position and turns; **M5-III** coordinates and transformations (with spec 181's angles); the **Cartography / geography** extension (position and landmarks, then coordinates, then a justified route plan); **H1** an old map rule, a chess book and a printed geometry as sources. Act families: II, III, VI.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Follow and give position instructions with a landmark; name left and right from another facing; make and name turns by amount and direction, linking a quarter turn to a right angle; describe grid moves; read and plot first-quadrant and four-quadrant coordinates; complete polygons; slide, mirror and turn shapes and state how coordinates change; recognize congruence and sense. |
| Teaching encounter | T1-T14 with step-revealed worked examples; a guided first item per bench. |
| Contrast | As listed in The lesson. |
| Supported practice | Tell mode tiles; Show the corner; Walk it line counts; Check the sides; signed replay from zero; Predict a corner; Trace and lay on top; the "I'm stuck" ladder. |
| New application | The reversal pair (3, 6)/(6, 3); the tilted square; axes worth 2; half-way points; the upside-down old map; rotation about (2, 2); the exchange plan's routes. |
| Purposeful revisit | Spec 58 Cartographer's Table (first-quadrant points, unit routes); spec 111 (line counting); draft spec 123 (relative turns); draft spec 125 (flips and half turns); spec 181 (angles); Act VI route plan. |
| Data boundary | Placements, turn settings, moves, coordinates, choices and support codes, all local. No timing, free text, voice or location. |

## Upstream check

Refreshed upstreams: Jane `0ec55f7e083976e6fcc3977fca460b1f5e199d91` and Marble `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (both 2026-10-24). Ids and descriptions confirmed in the pinned `curriculum/marble/topics.json`. Research text paraphrased, never copied.

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Positional Language (`mt_qeZYF6HZ4o`) | Thing + landmark + relation; recast vague answers; both follow and give; left/right on the body first, errors expected; dual relations hard. Follow and Tell modes; "Next to what?"; A1-A4; Turn Pip around; off-screen sticker note. |
| Turns & Directions (`mt_Y9XKzLrUAZ`) | Whole-body turns on a marked spot to fixed facings; whole, then half, then quarter; turning is not travelling; follow and give routes. Turning Spot facings; A5, A6; off-screen turn invitation; route mode. |
| Position, direction, and movement (`mt_TdV9YGJEoY`) | Clockwise from a clock, contrasted each time; mark the right angle a quarter turn leaves; count quarters aloud; routes someone else can follow. T4, Show the corner, B1-B3, route mode. |
| Describing Movements (`mt_Uq5vYqboCR`) | Right changes only x, up only y, one part at a time; predict before plotting; count lines from the start; move vs destination. Walk it counts, B4-B6, D1-D3 with tests for reversal and landing-number errors. |
| Coordinates, age 8+ (`mt_i5_HnoFOYw`) | Plot along-then-up; state a missing vertex before plotting; check sides and right angles, not looks; contrast (5, 4) with (4, 5); join in order. Corner Finder's say-then-plot; C2, C4-C6. |
| Coordinates, age 10+ (`mt_R4AY0LKxfl`) | Axes as signed number lines; minus as direction; quadrant from the sign pair; a cross-quadrant square; link a sign flip to reflection. Whole Valley; E1-E4; Scene 3 and F1. |
| Coordinates, age 11+ (`mt_hVpGOEz2kG`) | First number on x, second on y, taught structurally since the corridor rhyme fails below zero; all quadrants together; read and plot; axis scale and fractional values; compare a pair with its reversal. "First number across" wording on the Whole Valley; E2, E5, E6. |
| Transformations on a Grid (`mt_efOeaGFyGM`) | Reflection by the perpendicular, equal-distance point rule (avoid "straight across"); translation as every point moving the same; sense shows a true reflection; congruence by tracing; coordinates across-then-up. T8, T9, T14; D3-D6; Trace and lay on top. |
| Coordinate Transformations (`mt_K0Y15w48SY`) | Full data for each move (vector; mirror line; center, angle, direction); sense separates reflection from rotation; diagonal mirror y = x; centers off the shape; congruence checked. T12, T13 rule table and column note; F1-F4, F6. |
| Transformations on a grid (`mt_SH7QgFl8-v`) | Name a move from object and image and produce an image from a description; sense decides mirror vs turn; a rotation needs center, amount and direction; mirror by perpendicular, equal distance (no "straight across"); tracing paper for turns and congruence. Shape Mover's Predict a corner and Trace and lay on top; T8, T9, T12, T14; D3-D6, F1-F4, F6. |
| Translating and reflecting shapes (`mt_lxaM6iVpdr`) | Translate by signed changes to the matching coordinate; reflect in an axis by negating exactly one coordinate, derived from equal distance; contrast the same point in each axis; predict before plotting; points on the mirror stay. T8, T9, T13 rule table; D1, D3, D4, F1 (one-sign distractor), F3. |

**Jane:** adopted teach → guided → practice, the three-step "I'm stuck" ladder, short second-person prompts, three-option choices with misconception-tagged distractors, step-revealed worked examples and a glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, points, hearts. No Jane code or text copied.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json` (soft edges omitted):

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| Positional Language | none listed | n/a |
| Turns & Directions | Positional Language (`mt_qeZYF6HZ4o`) | Taught here (Where-Is-It Shelf). |
| Position, direction, and movement | Positional Language (`mt_qeZYF6HZ4o`) | Taught here. |
| Position, direction, and movement | Turns & Directions (`mt_Y9XKzLrUAZ`) | Taught here (T3 before T4). |
| Describing Movements | First Quadrant Coordinates (`mt_jBQS-CicNn`) | Met elsewhere: spec 58 (built locally); recapped in T6. |
| Describing Movements | Transformations on a grid (`mt_SH7QgFl8-v`) | Taught here (T8, T9, T12; Shape Mover; claimed). |
| Coordinates, age 8+ | First Quadrant Coordinates (`mt_jBQS-CicNn`) | Met elsewhere: spec 58; recapped in T6. |
| Coordinates, age 10+ | Coordinates, age 8+ (`mt_i5_HnoFOYw`) | Taught here (Corner Finder). |
| Coordinates, age 10+ | Measuring temperature (`mt_RVK655t391`, negative numbers in context) | Met elsewhere: sibling draft spec 189 (*below-zero*, math build-out); supported inline by T10. Documented gap if 189 does not ship. |
| Coordinates, age 10+ | Plotting points in the first quadrant (`mt_snlqRCiA1R`) | Met elsewhere: spec 58 (built locally); extended in C2. |
| Coordinates, age 11+ | Coordinates, age 8+ (`mt_i5_HnoFOYw`) | Taught here. |
| Coordinates, age 11+ | Coordinates, age 10+ (`mt_R4AY0LKxfl`) | Taught here (Whole Valley). |
| Coordinates, age 11+ | Fractions on a number line, age 11+ (`mt_uDJY0X0hgo`, ordering signed numbers) | Met elsewhere: sibling spec 196 (Fair Shares, math build-out, draft PR #158) claims it (ordering on a number line, negatives included, D7); supported inline here (T10 builds each axis as a number line through zero), no claim. |
| Transformations on a Grid | Lines of symmetry (`mt_hR2Y7NhMSY`) | Met elsewhere: draft spec 125 (Mirror signs, fold to check), PR #128. Documented gap if 125 does not ship. |
| Transformations on a Grid | Coordinates, age 8+ (`mt_i5_HnoFOYw`) | Taught here. |
| Transformations on a Grid | Transformations on a grid (`mt_SH7QgFl8-v`) | Taught here. |
| Transformations on a Grid | Describing Movements (`mt_Uq5vYqboCR`) | Taught here (Floor Map Walk, D1-D2). |
| Coordinate Transformations | Coordinates, age 11+ (`mt_hVpGOEz2kG`) | Taught here. |
| Coordinate Transformations | Translating and reflecting shapes (`mt_lxaM6iVpdr`) | Taught here (axis reflections, translations with coordinates: D-set, rule table). |
| Transformations on a grid | none listed | n/a |
| Translating and reflecting shapes | Transformations on a Grid (`mt_efOeaGFyGM`) | Taught here (Shape Mover, D3-D6). |
| Translating and reflecting shapes | Coordinates, age 10+ (`mt_R4AY0LKxfl`) | Taught here (Whole Valley before the axis mirrors). |
| Translating and reflecting shapes | Transformations on a grid (`mt_SH7QgFl8-v`) | Taught here. |

Claim check, 2026-10-25: no spec on main or any draft PR (126, 128, 137-151) claims these eleven targets (draft spec 125 names `mt_SH7QgFl8-v` and `mt_lxaM6iVpdr` only as references, read by the reviewer at `pr/128`); `mt_y-BuQAfw4B` is not claimed here; specs 58, 61 and 63 cite the first three only as hard ancestors with no claim; the sibling math-pack list assigns them only to this pack.

## Checks for implementation

- **Numbers script (2026-10-25):** `check187.py` (`python3 -I`, scratch area, not in the repo), 88 checks passing: nine landmarks inside 0-10 × 0-8 and distinct; bridge coordinates by subtracting (5, 3), with quadrants (−,−), (+,−), (+,−), (−,+), axis, (+,+), (−,+), (−,+); facings: quarter clockwise door → window, counterclockwise → counter, half → stove, three quarters clockwise = one counterclockwise = counter; moves B4 4 right (wrong 6 right), B5 3 up (wrong 4 up), B6 5 right 1 up; C1 (9, 2); C3 Orchard (3, 6) vs Honey (6, 3); **brute-force uniqueness** of every missing corner: C4 (5, 1), T7 (7, 1), C5 (5, 2) with distractors (6, 2) and (5, 3) not squares, E4 (0, −3) over the whole −6..6 × −5..5 grid; C6 a 3 × 2 rectangle, not a square; D1 (6, 5) (wrong (4, 7), (6, 3)); D2 3 right; D3 (4, 3) (wrong (4, 5), (0, 7)); D4 (7, 2), now (2, 2) in x = 4 to (6, 2) after the in-grid repair, and T9 (6, 4); E5 (6, −4); E6 −0.5; F1 (4, −3) → (−4, 3), the High ford (one-sign (−4, −3) is the y-axis mirror; the swap distractor is (−3, 4), the y = x mirror); F2 (1, −2) (ccw (−1, 2), half (−2, −1)); F3 (4, 1); F4 (1, 1) (wrong (−3, −3)); the quarter-clockwise rule turns north to east; the full rule table; the flag scalene, all six images congruent, sense kept by slide and turns and reversed by the three mirrors; Act VI routes 6 and 12 steps; moves identical in both map frames; Pei Xiu 1,755-1,802 years ago ("about 1,800"); 8 × 8 = 64 chess squares; answer positions 8/8/8.
- Turns pivot in place; Pip never travels during a turn. Coordinates always read along (across) first. Points sit on line crossings, never in cells. Mirror images land perpendicular to the line at equal distance. Model lines show on every bench. Sprout items show no numbers; feedback never says "wrong".
- Style check run on the companion (`style187.py`): 0 em-dashes and 0 en-dashes; 14 teach cards at most 30 words; 36 prompts at most 15 words; 144 hints, explanations and feedback lines at most 20 words; scene shorts at most 30 words, longers at most 150, Keeper's notes at most 80.
- Browser at 320 and 820 px: targets 44 px; tap-to-place and button alternatives to every drag; every grid and move has a text equivalent ("Flag corner B moved from (1, 4) to (4, 3)"); turns and quadrants never shown by color alone; minus signs rendered as true minus (−) and read aloud as "minus".
- **Independent review, 2026-10-25.** Reviewer recomputed every item, worked example, landmark and rule with an independent script (`rcheck.py`, `python3 -I`, scratch area; 52 checks for this pack, all passing: both landmark keys, every missing corner by brute force, all six rule-table rows, congruence and sense for each move, routes and turns). Recounted positions (8/8/8 over 24 three-choice items); checked distractor feedback, Hollis rule, pronouns, spec 120 chapter names, word limits and em-dashes (0 in all three files); spot-checked Stamma and Descartes by web search. Changed: claimed `mt_SH7QgFl8-v` and `mt_lxaM6iVpdr` (spec 125 does not claim them) with upstream and crosswalk rows; recorded `mt_y-BuQAfw4B` as spec 206's; route settled as `#post/floor-map` only; Scene 3's old-map point (4, −3) is nearest the mill, not the café, so the scene now says "below the mill"; T13's worked steps now each start from the same corner (step 3 was wrong if read in sequence); E5 given a question; "around" for "round"; removed an "at this age" phrase.

## Review asks

**Math check:**
1. Are the rule forms right as worded for children, especially quarter turn clockwise (y, −x) and the upright mirror (2a − x, y)?
2. Is "a minus sign is a direction" a fair first framing for four-quadrant reading?
3. Is the tilted-square item (E4) fair at Keeper's Desk, given its corner shares no numbers with its neighbors?
4. Is the Descartes card's limit ("his own drawings did not use our two crossed number lines") accurate enough for child text?

**Owner questions, with defaults:**
1. Settled on review: route `#post/floor-map`; `mt_y-BuQAfw4B` belongs to spec 206; `mt_SH7QgFl8-v` and `mt_lxaM6iVpdr` are claimed here. Keep the Floor Map inside the post office? *Default: yes, linked from the Post Office and the Cartographer's Table.*
2. First slice? *Default: the Floor Map Walk with Sets B and C, then the Whole Valley.*
