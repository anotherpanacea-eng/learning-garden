# 126. The Shape Bench: window pieces, parcel boxes and floors

Status: **proposed; awaiting independent spec review.** Part of the [new kinds of play proposal](../new-game-kinds.md). Fits Acts I and II of [spec 120](120-keeper-of-the-ways.md). Every child-facing line is in [the companion text](../content/126-shape-puzzles-text.md); this spec holds the puzzles, the checks and the saves. Code and art are for the implementation pass.

## Purpose

Wordless shape puzzles for spatial reasoning: fitting, turning and flipping pieces; folding a flat net into a closed box; covering a floor exactly; and, for older explorers, proving that a covering can't exist. Geometry is thin across the garden, and these puzzles work for a child who can't yet read: every puzzle can be played from its picture alone, with read-aloud for the few words.

## Place and story

One bench in the Storm Workshop with three tables, plus a link from the post office. Open from the start.

| Table | Route | Story | Act |
| --- | --- | --- | --- |
| **Window pieces** | `#workshop/shapes` | The storm broke the town's windows into pieces. The glazier's kit has seven pieces that make a square, and every window is a shape made from all seven. | I, *mend the village* (counts there) |
| **Parcel boxes** | `#post/boxes` (also from the bench) | Dot's parcels need boxes folded from flat card. Which shapes of card fold into a closed box? | II, chapter 1 |
| **Floors** | `#workshop/shapes/floors` | New floors for the café and the mill loft, from tiles of five squares. | II, chapter 1 |

## Window pieces (tangram)

The seven pieces of a standard tangram: two large triangles, one middle triangle, two small triangles, one square and one parallelogram. Pieces move, turn in eighth turns and flip. A window is filled when the pieces cover the outline with no overlap; any covering counts, whether or not it matches the stored solution.

| ID | Window | Outline shows | Depth |
| --- | --- | --- | --- |
| `w1` | The bakery square | piece lines | Sprout |
| `w2` | The post office triangle | piece lines | Sprout |
| `w3` | The café rectangle | piece lines for three pieces | Sprout |
| `w4` | Pip's fox | outline only | Seedling |
| `w5` | The heron | outline only | Seedling |
| `w6` | The boat | outline only | Seedling |
| `w7` | The house | outline only | Seedling |
| `w8` | The parallelogram | outline only | Sapling |
| `w9` | The trapezoid | outline only | Sapling |
| `w10` | Square challenges | "Make a square from 2 pieces · 3 · 4 · 5 · 6 · 7" | Sapling |

Before a window is commissioned, supply its exact outline polygon, each piece's canonical vertices, one exact solution layout, and a test confirming that solution covers the outline exactly. This draft does not yet contain those window fixtures. Piece lines (`w1` to `w3`) are a support; **Show me one piece** places one piece of the stored solution, recorded as support.

`w10` includes the six-piece square, which cannot be made. The page lets the child try, then says so, and invites the child to find which counts are possible. `[check]` The known result is that a square can be made from 1, 2, 3, 4, 5 or 7 of the pieces, never 6; this needs a source or a computed check before build.

**First build and geometry gate:** the first build is **Parcel boxes** alone, whose nets need only six unit squares on a grid. Window pieces and Floors are on the [roadmap for much later](../roadmap.md#much-later-parts-held-back-from-the-new-game-kinds) and wait for the fixtures below. For windows, fix a common exact-coordinate lattice supporting the proposed eighth turns (or exact algebraic coordinates), placements, canonical flip/anchor semantics, and coverage/no-overlap comparison; do not compare rendered pixels or use an unspecified floating tolerance. For floors, supply the twelve canonical pentomino cell sets and exact puzzle domains. Every piece can be placed by tap and turn/flip buttons. The 6×6 contrast must name the two removed cell coordinates before it is offered; a count for an unnamed pair is not a fixture. The square-impossibility and published hall-count claims remain withheld from child copy until source/computation review; a failed search by the learner is not proof.

## Parcel boxes (cube nets)

Each card is six squares joined edge to edge. The child first **predicts**, *Will it fold into a closed box?* (Yes · No), and the prediction is fixed before **Fold** animates the folding. The fold shows faces landing, and where two faces would land on the same side, the box stays open.

| ID | Card (rows of squares, `#` is card) | Folds into a box? |
| --- | --- | --- |
| `n1` | `.#..` `####` `.#..` (the cross) | Yes |
| `n2` | `###.` `.#..` `.#..` `.#..` (the tall T) | Yes |
| `n3` | `##..` `.##.` `..##` (the staircase) | Yes |
| `n4` | `###..` `..###` (three and three) | Yes |
| `n5` | `##...` `.###.` `...#.` | Yes |
| `n6` | `######` (a line of six) | No |
| `n7` | `##..` `##..` `.##.` (with a 2 by 2 block) | No |
| `n8` | `####` `#..#` (two flaps on the same side) | No |

All eight were checked by a rolling-cube fold simulation (2026-10-23), which also confirms that of the 35 shapes of six joined squares, exactly 11 fold into a cube.

**Supports:** **Mark the bottom** lets the child pick the base square, and **Show where it goes** colors each square by the box face it becomes, tracked from that base, so the child can follow every square, including in nets without a line of four.

**Older depth:** **Find all eleven.** The child draws six-square cards on a grid; each new one is folded and, if it folds, added to a shelf of eleven outlines. Shapes that are the same after turning or flipping count once, and the page says so. The shelf fills only with the child's own finds.

## Floors (pentominoes and dominoes)

**Pentomino floors.** The twelve pieces of five squares, named by letters as is usual (F, I, L, N, P, T, U, V, W, X, Y, Z). Pieces move, turn and flip.

| ID | Floor | Pieces given | Checked |
| --- | --- | --- | --- |
| `f1` | Café step, 3 by 5 | L, P, V | 1 way, up to turning and flipping the floor |
| `f2` | Mill hatch, 3 by 5 | P, U, Y | 1 way, the same |
| `f3` | Library nook, 4 by 5 | I, L, P, V | 2 ways, the same |
| `f4` | Bakery floor, 4 by 5 | F, L, U, Y | 3 ways, the same |
| `f5` | The great hall, 6 by 10 | all twelve | Thousands of ways `[check: 2,339 is the published count]` |

Counts for `f1` to `f4` were computed by exact search (2026-10-23): the raw counts are 4, 4, 8 and 12, and the floor's own turns and flips account for a factor of 4.

**The floor that can't be done (older depth).** The mill loft floor is 4 by 4 squares, with two opposite corners taken by posts. Seven dominoes (two squares each) are in the box. The child tries; then the page offers the reason: color the floor like a chessboard, notice that both missing corners are the same color, and that every domino covers one light and one dark square. Contrast: the same floor with two corners on the *same side* taken can be covered, in 12 ways. Computed for this spec: 0 ways and 12 ways. Extension: a 6 by 6 floor with two opposite corners gone (0 ways) and with one light and one dark square gone (1,440 ways in the case shown).

## Saved work

Optional root `shapes` per explorer, absent until a table opens:

```
shapes: {
  windows: { [windowId]: { source, pieces: [{ pieceId, x, y, turn, flipped }], filled: bool, support, firstAttempt: attempt | null, at, earlier: [window] } },
  boxes: { [netId]: { current: foldAttempt, firstAttempt: foldAttempt | null, earlier: [box] } },
  ownNets: [{ source, cells, folds: bool, result?, support, at }], // latest 40 readable keeps
  floors: { [floorId]: { source, pieces: [placement], filled: bool, firstAttempt: attempt | null, at, earlier: [floor] } },
  firstFold: { source, tried: bool, reasonSeen: bool, support, at } | null
}
foldAttempt: { id, source, prediction: 'yes' | 'no' | null, folded: bool, result?, base: squareId | null, support, priorReveal: bool, at }
attempt: { source, pieces: [placement], filled: bool, support, at }
```

- `source` freezes the understood table/model/version and its finite piece and domain geometry, coordinate/turn/flip conventions, target/net/base identities, check rules and displayed task/help/reason text (at most 16 KiB per source). The selected table's commissioning gate supplies its exact finite placement bounds; saved geometry is not interpreted using a changed table. Sources are data for a known bounded model, not executable instructions.
- A prediction starts absent, is committed before folding, and the first input/source/support/result is kept once. Another prediction replaces only the working draft after disclosure; it keeps reveal/support flags and cannot become an unseen independent attempt. No per-net attempt history is needed.
- Validate ids, positions and turns against their own source. Set outcomes only at the explicit check/fold action, never on load. Keep the first window/floor attempt once, with its placements/source/support/result; later editing makes the current draft untested without rewriting that first attempt. Own-net keeps retain the six cells and any fold result actually tried; an untried drawing invents no result.
- Unknown model/ids, malformed placements and unreadable attempts remain exact, read-only and exportable at that entry; other readable work stays open. Never delete them, change a saved success to false or filter-install a cleaned root on load. An explicit fresh supported window/floor/box retains the complete prior entry in `earlier`. Neither the latest-40 own-net policy nor the readable keep caps evict unsupported siblings.
- Preflight new sources, attempts, own-net keeps and retained fresh versions against the actual pretty `notesReport` export and `prepareProgressImport` whole-notebook limits. If retention would not fit, refuse atomically with existing export/reset choices; do not trim on load. Export, import, reset, save-off and explorer switching include the complete raw `shapes` root through the existing generic notebook transfer.

## Curriculum fit

**Strands** ([six-act strands](../six-act-strands.md)): **M5-I** shapes and turns; **M5-II** properties; **M5-III** transformations (turns and flips); **M5-IV** nets; **M7-IV/V** a counterexample and an argument that something is impossible (the floor that can't be done); **L2-I** check and try again.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Fit, turn and flip pieces to fill an outline; predict and test whether a net folds into a cube; cover a floor exactly; explain why a covering is impossible. |
| Teaching encounter | Each table's first puzzle with a worked step (companion text). |
| Contrast | Piece lines and outline only; a net that folds and one that doesn't; a floor that can be covered and one that can't. |
| Supported practice | Piece lines; Show me one piece; Mark the bottom and Show where it goes. |
| New application | Square challenges; Find all eleven; the 6 by 10 hall; the 6 by 6 floors. |
| Purposeful revisit | Kept window pieces appear in the mended town; parcel boxes appear on Dot's counter; the floors appear in the café and the loft. |
| Data boundary | Piece placements, predictions and folds, all local. |

## Upstream check

Refreshed 2026-10-23: Marble `f186a79a9525c189e2d423e31613c62b6805416f`, Jane `1927912b8d9cd4f7df6e7fbe8416521194743060`.

| Topic | What the research asks, and how this spec does it |
| --- | --- |
| Composing Shapes (`mt_MqqR7VUoz1`) | The skill is the act of fitting, turning and flipping, not recognising; a flat surface; spoken prediction goes with placement; trial and error is an expected stage, met by an easier puzzle. Window pieces are all placement, flat, any covering counts, and the Sprout windows show piece lines. |
| Nets of 3-D Shapes (`mt_vnJEztczji`) | Commit and justify a prediction before folding; frame questions around the mathematical net; the "line of four" shortcut is not in every net, so track each square from the base. The prediction locks before Fold; Show where it goes tracks from a chosen base; `n3`, `n4` and `n5` have no line of four. |
| Flat vs Solid Shapes (`mt_mnEVZNkX3p`) | Younger work on naming flat and solid shapes. The parcel box table names the card as flat and the box as solid; no claim beyond that. |

Jane's worked-example pattern shaped each table's first step. Its points and medals are not adopted, and no Jane code or text is used.

### Hard-prerequisite crosswalk

| Target | Hard prerequisite in `curriculum/marble/dependencies.json` | How it's met |
| --- | --- | --- |
| Composing Shapes | 2-D shapes (`mt_KJeEeTutJI`); Combining Simple Shapes (`mt_XjwUlmxdCT`) | Same unit: piece names on first touch; `w3` combines three pieces before the full windows. |
| Nets of 3-D Shapes | None hard. | Nothing to meet. |
| Flat vs Solid Shapes | 2-D shapes; 3-D shapes (`mt_Qcp2d_kuta`) | Partly: the box is named as a cube; no lesson on solids. No claim. |

## Checks for implementation

- A test confirms each stored window solution covers its outline exactly, and accepts any other exact covering.
- The fold simulation agrees with the net table, and Find all eleven accepts exactly the eleven cube nets up to turning and flipping.
- Exact search confirms the floor counts above, and the 4 by 4 and 6 by 6 counts.
- A prediction cannot be changed after Fold.
- Browser at 320 and 820 px: every piece has turn and flip buttons and can be placed by tap-then-tap as well as dragging; pieces are at least 44 px at their smallest.

## Review asks

- Confirm the six-piece square result and the 6 by 10 count from a source.
- Is the impossible floor right for older players, and gentle enough as an optional page?
