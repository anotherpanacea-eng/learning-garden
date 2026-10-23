# 123. The Clockwork Mill: programming with loops, new moves and debugging

Status: **proposed; awaiting independent spec review.** Part of the [new kinds of play proposal](../new-game-kinds.md). Fits Acts II and V of [spec 120](https://github.com/anotherpanacea-eng/learning-garden/blob/claude/project-thread-zpfie6/docs/specs/120-keeper-of-the-ways.md). Every child-facing line is in [the companion text](../content/123-clockwork-mill-text.md); this spec holds the machine, the levels and the saves. Code and art are for the implementation pass.

**Commissioning boundary:** this remains a proposal. Select a bounded first slice after independent content/model/save review; the presence of later games, levels or designers does not commission them all. All Act/chapter links and contributions below are future adapters to the separately proposed spec120. Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter.

## Purpose

The garden already teaches literal instructions ([Instructions for a Reader, spec 54](54-instructions-for-a-reader.md)), absolute-direction repeats ([Repeat a Delivery Block, spec 71](71-repeat-delivery-block.md)) and one condition with two branches ([Willow Sorting Desk, spec 84](84-willow-sorting-desk.md)). Spec 71 deliberately left out turns relative to the machine, nesting, named moves and debugging someone else's program. The Clockwork Mill adds exactly those, on a small grid with sacks to carry.

## Place and story

The mill's clockwork sack cart, **Trundle**, was knocked over in the storm. The miller has wound it up again but has forgotten how to set its program drum. Trundle reads a row of command tiles and does them in order. Route: `#mill`, linked from the town map's mill and from spec 71's end screen ("Try a machine that turns"). Open from the start.

- **Act II:** a kept solved level (any of 1 to 10) counts toward chapter 1, the weekly market, since the mill is getting flour and sacks to the stalls.
- **Act V:** the level designer is one of the "new courier route" project paths' companions; a kept level with its check is a project first version (spec 120, Act V).

## The machine, `trundle-v1`

The floor is a grid of squares, at most 9 by 9 for authored levels (the designer remains 3–8 per side). Each square is **floor**, **wall** (sack piles, posts, the mill wheel), **millpond** or holds a number of **sacks**. Trundle stands on one floor square facing one of four directions, and carries at most one sack.

| Tile | What Trundle does |
| --- | --- |
| **Forward** | Moves one square the way it faces. A wall, the millpond or the grid edge stops the program with a bump. |
| **Turn left** / **Turn right** | Turns a quarter turn in place, relative to the way it faces. |
| **Lift** | Picks up one sack from its square. Stops with a message if there is no sack or it is already carrying one. |
| **Drop** | Puts its sack down on its square. Stops with a message if it carries nothing. |
| **Repeat** *n* | Runs the tiles inside its bracket *n* times, *n* from 2 to 9. Repeats can nest, up to three deep. |
| **New move** | A named row of tiles, made on the side table and used like any tile. Names are pictures: star, moon, leaf, acorn. A new move can use another only if the complete call graph is acyclic; direct and indirect recursion are refused without changing the draft. |
| **New move with a number** (from level 9) | A new move whose inside uses a number slot, *n*, in one Repeat. Using it asks for the number: *Go 3*. |

A level is solved only when its program terminates normally on the goal square, carrying nothing, with exactly the requested sack counts and any required final facing/route visits. The starting state alone is not a completed run. For m5, visit (0,3), (3,3), (3,0), then (0,0) in that order during the run; simply remaining at the start does not solve it. m10 additionally ends facing east. Trundle runs at one move per half second, or one move per tap with **Step**. At 300 moves it stops: "Trundle needs winding up again." The 300-move limit counts primitive actions, including failed actions, not Repeat/call wrappers. Acyclic calls and bounded repeats make evaluation finite. Run starts from the unchanged initial grid; Step advances the same run one primitive at a time; Reset returns to that initial state without erasing the program. Editing stops the transient run; the next Run/Step starts fresh.

**Finite program contract:** each level offers F/L/R, adding lift/drop only for sack levels, Repeat from m4, the four picture-named moves from m8 and numeric moves from m9; m8/m9 exclude L even inside a named move. Custom levels offer these same finite tiles subject to a kept allowed-tile set. Numeric arguments are integers2–9; each parameterized move uses its own n only as a Repeat count. Undefined names, cycles, empty Repeat/move bodies or out-of-range arguments are refused in an editable draft without executing them. At most4 move definitions; at most60 AST tiles in the main program and12 per definition; repeat nesting at most3 after following calls (not merely per definition). A Repeat node counts as one source tile plus its body; a call as one source tile, with the separately authored definition excluded from the main challenge count. At most300 primitive actions run, with normal termination after exactly300 allowed; stop before a301st action.

## The levels

Maps: `.` floor, `#` wall, `~` millpond, a digit is that many sacks. Rows are listed top to bottom. Trundle starts facing east (right) unless noted. Each level's solution was run in a simulator of the rules above (2026-10-23).

| ID | Title | Map | Start → goal | New idea | A program that solves it |
| --- | --- | --- | --- | --- | --- |
| `m1` | Straight to the door | `.....` | (0,0) → (0,4) | Order of tiles | F F F F |
| `m2` | Round the corner | `....#` `###.#` `###.#` | (0,0) → (2,3) | Turning relative to Trundle | F F F R F F |
| `m3` | One sack | `..1..` | (0,0) → (0,4), sack to (0,4) | Lift and Drop | F F Lift F F Drop |
| `m4` | The long aisle | `.........` | (0,0) → (0,8) | Repeat | Repeat 8 [F] |
| `m5` | Round the millpond | `....` `.~~.` `.~~.` `....` | (0,0) → back to (0,0) | A repeated group | Repeat 4 [F F F R], or Repeat 4 [Repeat 3 [F] R] |
| `m6` | The steps | `####.` `###..` `##..#` `#..##` `..###` | (4,0) → (0,4) | Spotting the repeating unit | Repeat 4 [F L F R] |
| `m7` | Three sacks, one step each | `.1.1.1.` | (0,0) → (0,6), sacks to (0,2), (0,4), (0,6) | Repeat with Lift and Drop | Repeat 3 [F Lift F Drop] |
| `m8` | The rusty left turn | `...#####` `##.#####` `##......` `#######.` | (0,0) → (3,7) | New move (Turn left is stuck; make *Left* from three rights) | F F R F F *Left* F F F F F R F, with *Left* = R R R |
| `m9` | Go how far? | `....####` `###.####` `###.....` `#######.` `#######.` | (0,0) → (4,7) | New move with a number | *Go* 3, R, *Go* 2, *Left*, *Go* 4, R, *Go* 2, with *Go n* = Repeat n [F] |
| `m10` | Fill the store | `3...` | (0,0) → (0,0), all three sacks to (0,3) | A long loop body | Repeat 3 [Lift F F F Drop R R F F F R R] |

Each level shows the miller's request, the tiles allowed (Turn left is hidden in `m8` and `m9`), and an optional **Challenge** line where one is checked: `m4` in 2 tiles, `m5`, `m6` and `m7` in 5 tiles. Challenge lines are invitations. Solving without them is solving.

## Pip's programs (debugging)

Pip has written programs for four levels, and each has one mistake. The child runs Pip's program, watches where it goes wrong, and fixes it by changing as few tiles as possible. **Step** and a highlighted current tile are the main tools.

| ID | Level | Pip's program | What happens (simulated) | The fix |
| --- | --- | --- | --- | --- |
| `d1` | `m6` The steps | Repeat 4 [F R F L] | Bump into the edge on move 3 | Swap R and L |
| `d2` | `m7` Three sacks | Repeat 4 [F Lift F Drop] | Bump into the grid edge on move 13, after all three sacks are moved | Repeat 3 |
| `d3` | `m3` One sack | F F Drop F F Lift | "Nothing to drop" on move 3 | Swap Drop and Lift |
| `d4` | `m5` Round the millpond | Repeat 4 [F F F L] | Bump into the top edge on move 5 | L to R |

A fixed program counts as solving the level. The companion text gives Pip's note for each one, and his reply when it's fixed.

## The level designer (older depth, Act V)

The child makes a level: grid size (3 to 8 on each side), walls, millpond, sacks, start, facing, goal and where sacks should end. **Check my level** then asks the child for a program that solves it and runs it. A level is **ready** once the child's own program solves it. **Make it tricky** suggests, never requires, one of: a sack behind a corner, a missing turn tile, a challenge line. The designer never solves the level for the child.

A kept level shows on a shelf for the explorer, with the solving program hidden behind **Show my solution**.

## Saved work

Optional root `mill` per explorer, absent until a level opens:

```
mill: {
  levels: { [levelId]: { program: [tile], moves: { [name]: { param: bool, body: [tile] } },
                         solved: bool, challengeMet: bool, at } },
  designs: [{ size, cells, start, facing, goal, sacksEnd, program, moves, ready: bool, at }]   // latest 8
}
// tile: 'F' | 'L' | 'R' | 'lift' | 'drop' | { repeat: n | 'n', body: [tile] } | { move: name, n? }
```

- A saved program is kept exactly as the child built it, including a nested repeat or new move they used.
- Validate tile names, repeat counts 2 to 9, nesting at most 3 deep, at most 60 tiles per program and 12 per new move, and that named moves exist and are not self-referring. A failing program is dropped and its level shows unsolved; the rest of the save stays.
- `solved` is set by a run the child started. It is not recomputed on load.
- Export, import, reset and explorer switching include `mill`.

## Curriculum fit

**Strands** ([six-act strands](../six-act-strands.md)): the **Programming beyond AI literacy** extension pathway, steps 3 (selection and repetition, the repetition half), 4 (decomposition and debugging) and 5 (functions and tests, as new moves and checking a designed level); **C1-I** literal step-by-step instructions; **M5-I/III** position, turns and grid movement; **M4** finding the repeating unit (`m6`); **L2-III** learn from an error.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Write a sequence for a machine that turns relative to itself; use a counted repeat and a nested repeat; name a new move; trace and fix a program. |
| Teaching encounter | Each new tile's first level opens with a worked run that the child steps through (companion text). |
| Contrast | Turn left and turn right as Trundle sees them; eight Forward tiles and Repeat 8; a new move and a repeat; Pip's program and the fixed one. |
| Supported practice | Step, the highlighted tile, the bump message naming the move number, and the miller's hint after two runs that don't solve. |
| New application | New moves with a number; the level designer. |
| Purposeful revisit | Spec 71's Repeat a Delivery Block links here; Act V's designer; Act VI's exchange plan reuses "a plan for a machine" language for routes. |
| Data boundary | Programs, new moves, level designs, solved flags, all local. No timings or run counts beyond the latest program. |

## Upstream check

Refreshed 2026-10-23: Marble `f186a79a9525c189e2d423e31613c62b6805416f`, Jane `1927912b8d9cd4f7df6e7fbe8416521194743060`.

Marble's refreshed graph has dedicated topics for this work that the pinned vendor lacks: **Decisions and repeats in algorithms** (`mt_iqmt8wL26h`, ages 6 to 8), **Loops in programs** (`mt_6XbAmdmjDb`, 8 to 12) and **Testing and debugging programs** (`mt_5UtPmgdoQ9`, 6 to 12). None has a teaching-research record yet, so the design follows their descriptions and the pinned **Step-by-Step Instructions** (`mt__p5n8z5soJ`). Updating the pin is a separate review; nothing here depends on it. Jane's short staged lessons and its reveal-one-step pattern shaped the worked runs; no Jane code or text is used.

### Hard-prerequisite crosswalk

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| Step-by-Step Instructions (`mt__p5n8z5soJ`, pinned) | Computers in Everyday Life (`mt_XbGfVhfiUz`) | Not taught. Trundle is a fictional clockwork machine and claims nothing about computers. |
| Loops in programs (`mt_6XbAmdmjDb`, upstream only) | My first visual program (`mt_sPV503BQnI`) | Levels 1 to 3 and spec 71 are the first visual programs. Upstream-only topic: no claim until the pin moves. |
| Decisions and repeats (`mt_iqmt8wL26h`, upstream only) | Step-by-Step Instructions | Levels 1 to 3. The decisions half is spec 84. |
| Testing and debugging (`mt_5UtPmgdoQ9`, upstream only) | My first visual program | Levels 1 to 3 before Pip's programs. |

## Checks for implementation

- A test runs every program in the two tables above and gets the stated result, including the move on which each of Pip's programs stops.
- Turn left is unavailable in `m8` and `m9`; the level is still solvable with a new move.
- Programs over 300 moves stop with the winding message and keep the program.
- A saved program with a nested repeat and a new move reloads and runs identically.
- The designer refuses to mark a level ready until a child-started run solves it; editing the level clears ready.
- Browser at 320 and 820 px: tiles at least 44 px; tiles can be added by tap as well as drag; the program reads in order to a screen reader with bracket contents announced.

## Review asks

- Is `m6` (the steps) the right place for spotting a repeating unit, or should it follow `m7`?
- Should a conditional ("if there's a sack here") join later, or stay with spec 84?
