# 184. The Grain Loft: solids, their faces and how much they hold

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a math check.** Part of the [math build-out](https://github.com/anotherpanacea-eng/learning-garden/pull/154). Every child-facing line is in [the companion text](../content/184-grain-loft-text.md); sources and open checks are in the [source audit](../source-audits/184-grain-loft.md).

**Commissioning boundary:** a proposal only. Select a bounded first slice after independent content, model and save review; the six benches do not commission each other. All Act and chapter links are future adapters to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (draft PR #127). Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter. **Fact-check status:** real-world facts checked against search excerpts on 2026-10-25 (fetches blocked); no `[check]` item is in child text. The geometry and arithmetic are standard and still need the math check.

## Purpose

Geometry and measurement have many pinned Marble topics about solids and volume, and almost none are taught. Proposed [spec 126](https://github.com/anotherpanacea-eng/learning-garden/pull/128) (the Shape Bench, draft PR #128) folds cube nets and names the card flat and the box solid, and says it makes no lesson on solids. Specs [45](45-measuring-recipes.md) and [113](113-capacity-unit-bridge.md) measure liquid capacity in mL and L. Nobody teaches **what solids are called**, **what their faces, edges and vertices are**, **how to sort and build with them**, **what a slice reveals**, or **volume as a count of unit cubes that adds up**. This pack takes those ten untouched topics, plus three it needs and teaches directly: naming solids, the unit cube and l × w × h (thirteen claimed targets).

A child comes to understand that a solid's surfaces decide what it does (curves roll; flat faces slide and stack); each flat face of a solid is a 2-D shape; faces, edges and vertices are three different things, hidden ones included; a sort needs one rule applied to every solid; a drawing or a set of card faces names a solid by its faces, not its look; a straight cut makes a new face whose shape depends on the direction; volume is the number of unit cubes that fill a solid, counted in layers, so length × width × height; volumes of non-overlapping parts add, and any fair split gives the same total; and (Keeper's Desk) for every flat-faced solid, vertices − edges + faces = 2.

**Builds on, never re-teaches:** spec 126's parcel boxes (nets and folding: here only face *sets*, never layouts or folding) and its flat-versus-solid naming; spec 125's and 126's 2-D shape names; spec 45's capacity and spec 113's liters (here: cubic units for solids, no liquid); spec 51's packing envelopes into bags (here: packing whole crates by volume, with edges checked); spec 154's mill hoist, which lifts sacks into this loft. **Also targeted (reassigned to this pack on review, 2026-10-25):** *3-D shapes* (`mt_Qcp2d_kuta`, naming solids; T1, A5), *Measuring length (age 10+)* (`mt_IuHa5UI5od`, whose pinned description is the unit cube and cubic units; T12, D3, D4) and *Estimating answers (age 10+)* (`mt_nTL-owFJTF`, whose pinned description is cuboid volume l × w × h and base area × height; T13, D5-D7). The pinned names mislead; the descriptions decide. **Not targeted:** volume of cylinders, cones and spheres (prism and cylinder volume build on this pack in sibling spec 186).

## Place and story

**Host:** the **Grain Loft**, the top floor of the mill under the roof, route `#mill/loft`, linked from spec 123's `#mill` (draft PR #128), spec 154's `#mill/hoist` ("Where do the sacks go?"), and the Shape Bench's parcel boxes (`#post/boxes`). Open from the start; no bench requires another.

| Act and chapter (future adapters to spec 120) | Beat (full text in the companion) | Job depths |
| --- | --- | --- |
| I, ch. 2 *deliver and explain* | The storm tipped the loft over. The miller wants everything that rolls kept from the hatch before the seed sacks go out; Pip's apple rolls off a crate. | Sprout: roll, slide or stack. Seedling: name the solids. |
| I, ch. 4 *mend the village* | The shelves are mended; the cat knocks the shape blocks into spilled flour. Bramble calls a round print "a cylinder". | Sprout: build a grain tower. Seedling: flour prints, counting faces. |
| II, ch. 2 *a garden across the seasons* | The harvest goes into seed blocks packed in crates. Pip counts only the blocks he can see. | Seedling: sort; Sapling: counting cubes in layers. |
| III, ch. 2 *the seed exchange* | Apple seedlings must fit in Nuria's boat hold for Vadoalto: crates, not sacks. Keeper's Desk: Wren finds an old chalk table on the beam. | Sapling: composite bins. Keeper's Desk: packing by volume; Euler's pattern. |

One shared scene per chapter; any job is a whole contribution; nothing locks a story place. The town, mill, loft, crates and boat are fiction, labeled apart from math, history and models. The old Keeper is not named (Hollis rule): Wren says only "the old Keeper, maybe".

## The knowledge

**Naming solids.** A solid (3-D shape) takes up space; a flat (2-D) shape has no thickness. Names used: **sphere**, **cube** (six square faces), **cuboid** (six rectangle faces; a cube is a special cuboid), **cylinder**, **cone**, **pyramid** (one base, triangles meeting at a point; square-based and triangular), **prism** (two matching ends joined by rectangles; triangular, pentagonal, hexagonal). Loft objects stand in: ball, seed block, crate, tin bin, grain scoop, dovecote roof, cheese wedge.

**Roll, slide, stack, build.** A curved surface can roll; a flat face can slide or stay; flat tops and bottoms stack. A tin does both. Building with anticipation: flat bottoms down, points and curves on top; name a build by its parts (cone on cylinder = grain tower).

**Faces are 2-D shapes.** Each flat face is a 2-D shape: the tin's end is a circle, the pyramid's sides are triangles. The solid and its face have different names (a cube is not "a square").

**Faces, edges, vertices.** Face: a flat surface. Edge: where two faces meet. Vertex: a corner where edges meet. Count in a fixed order, marking each, and turn the solid to find hidden ones. **Convention stated on the card:** we count flat faces, straight edges and vertices; a curved surface is named, never counted as a face (a cylinder has 2 faces and 1 curved surface). Items never ask for edge or vertex counts of curved solids, because schemes differ. Counts used: cube and cuboid 8, 12, 6; triangular prism 6, 9, 5; square-based pyramid 5, 8, 5; triangular pyramid 4, 6, 4; pentagonal prism 10, 15, 7; hexagonal prism 12, 18, 8; pentagonal pyramid 6, 10, 6 (V, E, F).

**Sorting.** One rule, applied to every solid, then re-sort the same set by another rule; guess someone else's rule. Rules are geometric properties (curved surface or not, number of faces, has a triangle face), never color or size.

**Solids from drawings and face sets.** Read a drawing (isometric) by its faces: rectangle faces not all squares make a cuboid. A **card kit** asks which set of flat pieces would make a solid (triangular prism: 2 triangles and 3 rectangles; square-based pyramid: 1 square and 4 triangles), then checks the built solid's counts. Arranging and folding a net stays with spec 126.

**Cross-sections.** A straight cut makes a **new** face, never one the solid already had. Its shape depends on the direction: cylinder across, a circle; top to bottom through the middle, a rectangle; on a slant through the curved side, an ellipse. Cone across, a smaller circle higher up; down through the point, a triangle. A cube's corner cut, a triangle (three faces meet there). Straight cuts before slanted ones.

**Volume as unit cubes.** Volume is how much space a solid fills: the number of unit cubes (1 unit on every edge) that fill it with no gaps, written in cubic units (cm³, ft³, m³; never cm² or cm). Count by **layers**: one layer is length × width (the base area), the height is the number of layers, so V = length × width × height = base area × height (D7: a 12 ft² floor, 4 ft deep, holds 48 ft³). Hidden cubes count: a 3 × 3 × 3 crate is 27, though only 19 show on three faces and one sits unseen in the middle. Doubling the height doubles the layers and the volume.

**Volume adds.** Split a composite of cuboids into non-overlapping boxes, find each volume, add. Missing lengths come from the whole (8 − 5 = 3). Overlapping pieces count shared space twice. Every fair split agrees: the step bin is 36 + 18 = 54 split flat or upright. **Packing** (Keeper's Desk): divide the space by one crate's volume (48 ÷ 8 = 6), then check the edges fit (3 along, 2 across, 1 deep), since volume alone does not guarantee a fit.

**Euler's pattern (Keeper's Desk discovery).** For a solid with only flat faces and no holes, V − E + F = 2. The child fills the beam's table from the Tally Beam's counts, looks across rows, states the pattern, uses it to find a missing count (12 vertices, 18 edges, so 8 faces), and tests it on a new solid (a cube with a pyramid roof: 9 − 16 + 9 = 2). The pattern is offered as a discovery to test, never as a rule to memorize; the curved solids are left out, with the reason.

**Real anchors (see audit).**
- **The Rhind papyrus's granaries.** An Egyptian scroll of math problems copied by the scribe Ahmes around 1550 BCE (some sources say 1650 BCE) from an older text, bought in Luxor in 1858 by Alexander Henry Rhind; most of it is in the British Museum. Problems 41-46 find the volume of granaries, round and box-shaped, in cubic cubits (some converted to *khar*). Child text gives no problem's dimensions, since the excerpts disagree on them.
- **Euler's letter.** In a letter from Berlin to Christian Goldbach in St. Petersburg, dated 14 November 1750 in one account, Leonhard Euler stated that in a solid bounded by flat faces, the faces and solid angles (corners) together exceed the edges by two. His sketched proof had a gap; Legendre gave the first accepted proof in 1811. Descartes had a related result earlier (about 1630) but did not state this formula.

## The lesson

Jane's **teach → guided → practice** order on every bench: a teach card with a step-revealed worked example, a guided first item with 1-4 visible steps, then practice.

| Bench | Teach | Guided | Practice |
| --- | --- | --- | --- |
| Rolling Plank | T1-T3 | Make the tin stay (3 steps) | Set A |
| Flour Prints | T4 | Every face of the pyramid (3 steps) | Set B (B1-B2) |
| Tally Beam (with Sorting Hoops) | T5-T8, T15 | Edges of the seed block (3 steps) | Set B (B3-B6); E6, E7 |
| Slicing Board (with Drawing Wall, Card Kit) | T9-T11 | The cheese wheel across (3 steps) | Set C |
| Seed-Block Crates | T12, T13 | 4 by 3 by 2 (3 steps) | Set D |
| Big Bins | T14 | The step bin (3 steps) | Set E |

**"I'm stuck" ladder** on every item: (1) the hint; (2) an easier worked case plus how to start this one (the companion lists them by item family); (3) **Skip for now**, no penalty, nothing recorded against the child.

**Contrasts:** curved vs flat; the solid vs its face; face vs edge vs vertex; seen vs hidden; cube vs cuboid; one rule vs drifting rules; how it looks vs what its faces are; prism vs pyramid; a new cut face vs an old face; across vs top to bottom vs slant; square units vs cubic units; one layer vs all layers; adding edges vs multiplying them; overlapping vs non-overlapping splits; volume fits vs edges fit.

**Top misconceptions designed against** (from the Marble records): judging by look or size; counting only visible faces, edges, vertices or cubes; "side" and "corner" blurring the three parts; calling a cube "a square" or a tin's end "a cylinder"; counting a curved surface as a face; sorting by color or size, or letting the rule drift; any six squares or any face set closes; a solid has one cross-section; the cut is a face the solid already had; a slanted cut copies the base; cm² for volume; adding l + w + h; one layer taken as the volume; overlapping pieces; using an overall length for a part; dividing space by an edge; a pattern fits only famous shapes.

## The game or activity

**(a) The Rolling Plank, model `loft-solids-v1`.** Seven loft solids (ball, seed block, crate, tin bin, grain scoop, dovecote roof, cheese wedge) on a plank the child tips. Each solid can be turned so a different surface touches; the child predicts *roll*, *slide* or *stay*, then tips. **Build mode** offers three target cards (grain tower, crate stack, dovecote); the child places solids and taps each part to hear its name. *A made-up model: the plank is smooth and each solid behaves in one fixed way per touching surface (curve rolls; flat face slides when steep, stays when gentle); real things wobble, tip or stick.* A cone on its side rolls in a circle; shown, never asked.

**(b) Flour Prints, model `flour-prints-v1`.** Press any face of a solid into a flour tray; the print stays, labeled "This face is a [shape]. The solid is a [solid]." Curved surfaces leave a smudge, labeled "curved surface: no flat print". Prints can be lifted onto a card to compare. *A made-up model: perfect clean prints of flat faces only.*

**(c) The Tally Beam, model `tally-beam-v1`.** A rotatable solid with three marking tools (chalk a face, string an edge, dot a vertex); marks stay as the solid turns, and a counter beside each tool shows only the child's own marks. A table fills from the child's counts. **Sorting Hoops** (`hoops-v1`): two hoops, *fits the rule* / *doesn't*, a rule chosen from six property cards; **Guess my rule** shows a pre-sorted set; **Re-sort** keeps the same solids. **Keeper's Desk pattern page**: the beam's chalk table (V, E, F for seven flat-faced solids, from the child's counts or revealed), a free column for "V − E + F", and a new-solid test (the house). *The counts are exact math, not a model.*

**(d) The Slicing Board, model `slice-board-v1`.** **Drawing Wall**: isometric drawings of loft solids in varied orientations; the child names each. **Card Kit**: pick flat card pieces from a tray to make a named solid; the kit checks the face *set* and then shows the built solid's V, E, F; no layout or folding. **Slicing**: cheese wheel (cylinder), butter block (cuboid), sugar cone (cone), seed block (cube); three cut buttons; predict, cut, lift; the cut face glows as new. *A made-up model: perfectly flat, straight cuts.*

**(e) Seed-Block Crates, model `seed-blocks-v1`.** Crates with whole-number edges from 1 to 6 blocks. **Fill one layer**, **Add a layer**, **Lift a layer** and **Show hidden** (ghosts the interior). A unit switch relabels the same count as blocks, cm³ (1 cm blocks) or ft³ (1-foot blocks) without changing it. Prediction before lifting. Cases: 2 × 2 × 2, 4 × 3 × 2, 3 × 3 × 3, 5 × 4 × 3, 4 × 3 × 5 and 4 × 3 × 10. *A made-up model: identical cubes, no gaps; real seed settles.*

**(f) The Big Bins, model `bins-v1`.** Composite bins made of 2 or 3 cuboids, whole feet: the step bin (6 × 3 × 2 under 3 × 3 × 2), the L-bin (5 × 4 × 3 with 3 × 2 × 3), two separate bins (4 × 3 × 2 and 3 × 3 × 4) and Nuria's hold (6 × 4 × 2 with 2-foot crates). **Draw a split**, **Pull apart** (exploded view), **Show measurements**, **Try another split**. Overlapping pieces are shaded with a gentle note. *A made-up model: bins of whole-foot boxes with no wall thickness.*

No timers, scores, streaks, medals or locks. Every bench is open from the first visit.

## Problem sets

Five sets, **33 items**, full text in the companion:

| Set | Depth | Items | Formats |
| --- | --- | --- | --- |
| A. Roll, stack and build | Sprout (A1-A4), Seedling (A5, A6) | 6 | 3-choice, match |
| B. Faces, edges, vertices and sorting | Seedling (B1-B4), Sapling (B5, B6) | 6 | 3-choice, number |
| C. Drawings, card kits and slices | Sapling (C1-C4), Keeper's Desk (C5, C6) | 6 | 3-choice, *say why* |
| D. Counting cubes | Seedling (D1), Sapling (D2-D4), Keeper's Desk (D5-D7) | 7 | number with worked steps, 3-choice |
| E. Big bins, packing and Euler | Sapling (E1, E2), Keeper's Desk (E3-E8) | 8 | number, 3-choice, true / not true from this source |

Sprout items use no numbers. Over the **18 three-choice items** the right answer sits at A, B and C **six times each**. E7 carries a distractor that withholds more than the evidence requires ("can't tell, the house is two solids": the counts are given). *Say why* (C6) is spoken to a grown-up and never stored or graded.

## Saved work

Optional root `grainLoft` per explorer, absent until a first explicit action.

```
grainLoft: {
  version: 1,
  plank:   [{ source, solidId, surface: 'curve'|'flat'|'point', predict: 'roll'|'slide'|'stay', at }],  // latest 12
  builds:  { [buildId]: { source, parts: [{ solidId, slot }], at } },
  prints:  { [solidId]: { source, pressed: [faceId], at } },
  tallies: { [solidId]: { source, v: 0-30, e: 0-30, f: 0-30, at } },
  sorts:   [{ source, ruleId, placed: { [solidId]: 'fits'|'not' }, at }],  // latest 8
  cuts:    [{ source, solidId, cut: 'across'|'down'|'slant'|'corner', predict: shapeId, at }],  // latest 12
  crates:  { [crateId]: { source, predict: 0-999, at } },
  splits:  { [binId]: { source, pieces: [{ l: 1-8, w: 1-8, h: 1-8, x, y, z }], at } },
  answers: { [itemId]: { source, choice | value | match | marks, support: ['hint'|'example'|'skip'], at } }
}
```

`source` freezes the model version and the item's choices and order. Codes and numbers only; no free text. Never recompute or rewrite saved results on load (a saved tally that disagrees with today's count stays as saved); validate ids and ranges only. An unreadable entry stays raw and exportable while the rest stays open. Support stays separate from answers; no mastery flag. Shared export, import, reset and explorer switching.

## Curriculum fit

**Strands:** **M5-I** shapes (naming, rolling, stacking, building); **M5-II** properties (faces, edges, vertices, sorting); **M5-IV** volume and solids from 2-D representations; **M7-III** generalizing a pattern (Euler); **M7-IV** checking a split and finding why a total is too big; **H1** an old scroll and a letter as sources. Act families: I, II, III.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Name solids and describe them informally; predict roll, slide or stack; build with anticipation and name the parts; name the 2-D faces of a solid; count faces, edges and vertices, hidden ones included; sort by one rule and re-sort; identify solids from drawings and face sets; predict cross-sections; find volume by counting unit cubes in layers and by l × w × h; find composite volumes by non-overlapping splits; test Euler's pattern. |
| Teaching encounter | T1-T15 with step-revealed worked examples; a guided first item per bench. |
| Contrast | As listed in The lesson. |
| Supported practice | Tip-and-see plank; marks that stay as the solid turns; Show hidden; Pull apart; the "I'm stuck" ladder. |
| New application | The house shape for Euler; the slanted cut; Nuria's hold; the L-bin's missing length; re-sorting the same set. |
| Purposeful revisit | Spec 126 parcel boxes (a folded box's faces counted here); spec 51 packing; spec 154 hoist (sacks arrive here); spec 45 capacity (liquid vs solid volume). |
| Data boundary | Settings, predictions, marks, placements, choices, values and support codes, all local. No timing, free text or location. |

## Upstream check

Refreshed upstreams: Jane `0ec55f7e083976e6fcc3977fca460b1f5e199d91` and Marble `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (both 2026-10-24). Ids confirmed in the pinned `curriculum/marble/topics.json`.

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| 3-D shapes (age 5+) (`mt_yGv8doDAmp`) | Move from look to countable parts; compare on one property; face vs solid; vary size and orientation. Rolling Plank and Flour Prints; A1-A4, A6. |
| 3-D shapes (age 9+) (`mt_wUSbRt3-qw`) | Identify solids from flat drawings; reason from faces, not "it looks like a box"; non-standard orientations. Drawing Wall; C1. Net work is spec 126's. |
| 3-D shapes (age 10+) (`mt_REwgr0d_ss`) | Build solids and check the built faces, edges and vertices against the target; right face set (two triangles, three rectangles). Card Kit; C2, B6. Constructing and folding nets is met by spec 126. |
| 3-D shapes (age 11+) (`mt_nRksLqt-iR`) | Predict then cut; the cut is a new surface; straight cuts before slanted; count in the round. Slicing Board; C3-C6. |
| 2-D faces on 3-D shapes (`mt_UooUHC_V7U`) | Take solids apart into faces; print a face; name the face apart from the solid; flat vs curved. Flour Prints; B1, B2, Scene 2. |
| Edges, vertices, and faces (`mt_Mnodea7mG_`) | Count by touch in a fixed order with marks; turn for hidden parts; state the curved-solid convention. Tally Beam; B3, B4, B6; T5-T7. |
| Building with 3-D Shapes (`mt_QNxFnxikCN`) | Build, then plan ahead; name parts; flat base. Build mode; A2, A4. The research prefers real blocks: the off-screen invitation. |
| Sorting 2-D and 3-D shapes (`mt_fEuoBYw6bU`) | One property rule, applied to all; re-sort; guess my rule; never color or size. Sorting Hoops; B5; T8. |
| Counting Unit Cubes (`mt_d7XktBQPxm`) | Count in layers, hidden cubes included; cubic notation; predict then check. Seed-Block Crates; D1-D4; Scene 3. |
| Volume as additive (`mt_5TBUFnCy5-`) | Decompose into non-overlapping cuboids; deduce missing lengths; any split agrees; overlap double counts. Big Bins; E1-E5. |
| 3-D shapes (`mt_Qcp2d_kuta`) | Name solids by property, never by a flat cousin's name (a ball is not "a circle"); everyday twins; vary proportions; rolls or not. T1, T2; A1-A6, B1; the off-screen kitchen solids. |
| Measuring length (age 10+) (`mt_IuHa5UI5od`; description: the unit cube and cubic units) | Pack unit cubes with no gaps; contrast cubic with square units; predict then unpack to reveal hidden and interior cubes; structure by layers. Seed-Block Crates (Show hidden, Lift a layer); T12; Scene 3; D3 (19 and 26 distractors), D4. |
| Estimating answers (age 10+) (`mt_nTL-owFJTF`; description: cuboid volume l × w × h and B × h) | Derive l × w × h from a base layer repeated; write it as base area × height; multiply, never add; real containers; cubic units. T13; D2, D5, D6 (height doubled), D7 (B × h); E5 packing. |

**Jane:** adopted teach → guided → practice, the three-step "I'm stuck" ladder, short second-person prompts, three-option choices with misconception-tagged distractors, step-revealed worked examples and a glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, points. No Jane code or text copied.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| 3-D shapes (age 5+) | 2-D shapes (`mt_KJeEeTutJI`) | Met elsewhere: proposed specs 125 and 126 (draft PR #128); shape names recapped in T4. |
| 3-D shapes (age 5+) | 3-D shapes (`mt_Qcp2d_kuta`) | Taught here (T1, A5; claimed). Spec 126 names solids but makes no lesson on them. |
| 3-D shapes (age 9+) | 2-D shapes (age 7+) (`mt_vJUa62bxeR`) | Met elsewhere: proposed spec 183 (math build-out). Documented gap if 183 does not ship. |
| 3-D shapes (age 9+) | Nets of 3-D Shapes (`mt_vnJEztczji`) | Met elsewhere: proposed spec 126 (parcel boxes). |
| 3-D shapes (age 10+) | Nets of 3-D Shapes (`mt_vnJEztczji`) | Met elsewhere: proposed spec 126. |
| 3-D shapes (age 10+) | 3-D shapes (age 9+) (`mt_wUSbRt3-qw`) | Taught here (Drawing Wall before Card Kit). |
| 3-D shapes (age 11+) | 3-D shapes (age 10+) (`mt_REwgr0d_ss`) | Taught here (Card Kit before Slicing). |
| 3-D shapes (age 11+) | 3-D shapes (age 9+) (`mt_wUSbRt3-qw`) | Taught here. |
| 2-D faces on 3-D shapes | 2-D shapes (`mt_KJeEeTutJI`) | Met elsewhere: specs 125, 126. |
| 2-D faces on 3-D shapes | Flat vs Solid Shapes (`mt_mnEVZNkX3p`) | Met elsewhere: spec 126; recapped in Scene 2 and T4. |
| 2-D faces on 3-D shapes | 3-D shapes (`mt_Qcp2d_kuta`) | Taught here (T1). |
| Edges, vertices, and faces | 3-D shapes (`mt_Qcp2d_kuta`) | Taught here (T1). |
| Edges, vertices, and faces | 3-D shapes (age 5+) (`mt_yGv8doDAmp`) | Taught here (Rolling Plank, Flour Prints before the Tally Beam). |
| Building with 3-D Shapes | 3-D shapes (`mt_Qcp2d_kuta`) | Taught here (T1, Build mode's part names). |
| Sorting 2-D and 3-D shapes | Edges, vertices, and faces (`mt_Mnodea7mG_`) | Taught here (Tally Beam before Sorting Hoops). |
| Sorting 2-D and 3-D shapes | 2-D shapes (age 6+) (`mt_sBcRdUfAzV`) | Documented gap: referenced but claimed by no spec found; supported inline (sorting here uses solids and their face shapes only). |
| Counting Unit Cubes | Measuring length (age 10+) (`mt_IuHa5UI5od`) | Taught here (T12, Seed-Block Crates). |
| Volume as additive | Estimating answers (age 10+) (`mt_nTL-owFJTF`, l × w × h by packing) | Taught here (T13, D5-D7). |
| 3-D shapes (`mt_Qcp2d_kuta`) | none listed | n/a |
| Measuring length (age 10+) (`mt_IuHa5UI5od`) | Estimating volume (`mt_NSC3LT_-ch`: estimate cuboid volume with 1 cm³ blocks; container capacity with water) | Cube half supported inline (the crates' guess-first prediction, no claim); the water-capacity half is a **documented gap**: no spec or sibling pack claims it, and spec 45 declines to map it. |
| Estimating answers (age 10+) (`mt_nTL-owFJTF`) | Counting Unit Cubes (`mt_d7XktBQPxm`) | Taught here (Seed-Block Crates, D1-D4, before T13). |

Claim check, 2026-10-25: no spec on main or any draft PR (126, 128, 137-151) claims these thirteen targets (draft spec 126 mentions `mt_Qcp2d_kuta` only as a prerequisite, "No claim"; reviewer re-checked); the math claims map lists none of them, and greps for cuboid, unit cube, vertices, polyhedron and cubic found no overlapping lesson.

## Checks for implementation

- **Numbers script (2026-10-25):** `check184.py` (`python3 -I`), 64 checks passing. V, E, F computed from built vertex-and-face lists (every edge shared by exactly two faces) for cube, cuboid, triangular, pentagonal and hexagonal prisms, triangular, square and pentagonal pyramids, each with V − E + F = 2; the house 9, 16, 9 (Euler 2); face sets 2 triangles + 3 rectangles and 4 triangles + 1 square; B3 6, B4 8, B6 9 (distractor 6); E6 2 − 12 + 18 = 8 (distractor 32). Unit cubes by enumeration: 3 × 3 × 3 = 27, 19 visible on three faces, exactly 1 hidden center (26); 4 × 3 × 2 = 24 (12, 9); 5 × 4 × 3 = 60 (12, 20); 4 × 3 × 10 = 120, double 60 (480); T12 8; T13 12 × 5 = 60. Composites by cell sets: E1 24 + 36 = 60 (864); step bin 54 with both splits 36 + 18, non-overlapping and covering; L-bin 8 − 5 = 3, 60 + 18 = 78, other split 48 + 30 = 78, distractor 108, overlap overcount 30; E5 48 ÷ 8 = 6 with an edge-by-edge fit (24, 12); scene crate 12. Answer positions 6/6/6 over 18 items.
- Curved solids never appear in an edge or vertex count; the convention card shows wherever counts appear. Cut faces glow as new. Saved tallies are never corrected on load. Model lines show on every bench. Sprout items show no numbers; feedback never says "wrong".
- Style check run on the companion (`style184.py`): no em-dashes; 15 teach cards at most 30 words; 32 prompts at most 15 words; 118 feedback, hint and explanation lines at most 20 words; scenes within 30/150/80 words; no British spellings; the old Keeper unnamed.
- Browser at 320 and 820 px: targets 44 px; turning by buttons as well as drag; every solid and cut has a text equivalent ("Cheese wheel cut top to bottom: the new face is a rectangle"); crate layers announced as counts.
- Nuria's Spanish line checked by a fluent reader before build.
- **Independent review, 2026-10-25.** Reviewer recomputed every item, worked example and model number with an independent script (`rcheck.py`, `python3 -I`, scratch area; 42 checks for this pack, all passing: V, E, F rebuilt from face lists for all seven solids and the house; 19 visible and 26 surface cubes by enumeration; every composite by cell sets, both step-bin and L-bin splits, the 30-cube overlap; E5 by volume and by edge fit; D7 12 × 4 = 48). Recounted answer positions (6/6/6 over 18 three-choice items); checked distractor feedback, Hollis rule, pronouns, spec 120 chapter names, word limits and em-dashes (0 in all three files); spot-checked the Rhind and Euler anchors by web search. Changed: claimed `mt_Qcp2d_kuta`, `mt_IuHa5UI5od` and `mt_nTL-owFJTF` with upstream and crosswalk rows (documented gap for `mt_NSC3LT_-ch`'s water half); added D7 (base area × height) and m³; American spellings ("around", "center", "die"); rebalanced A3's option lengths.

## Review asks

**Math check:**
1. Is the stated curved-solid convention (curved surface not a face; no edge or vertex counts for curved solids) acceptable, given that schools differ?
2. Is "a cube is a special cuboid" right to teach alongside "the block's faces are all squares: a cube"?
3. Is the Euler page fair as stated for solids "with only flat faces and no holes", and is the house a good test case?
4. Is the slanted cylinder cut correctly called an ellipse at Keeper's Desk depth?

**Owner questions, with defaults:**
1. Route `#mill/loft` at the top of the mill? *Default: yes, linked from `#mill` and `#mill/hoist`.*
2. Resolved on review: `mt_Qcp2d_kuta`, `mt_IuHa5UI5od` and `mt_nTL-owFJTF` are now claimed here (the build-out map reassigned the last two; no spec claims the first).
3. Six benches in one pack, or split shapes (a-d) from volume (e-f)? *Default: one pack, shipped in two slices.*
4. First slice? *Default: Seed-Block Crates and Big Bins with Sets D and E, then the Rolling Plank and Flour Prints for Sprout.*
