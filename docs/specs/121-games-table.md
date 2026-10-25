# 121. The Games Table: strategy games against Bramble

Status: **proposed; awaiting independent spec review.** Part of the [new kinds of play proposal](../new-game-kinds.md). Fits Act II of [spec 120](120-keeper-of-the-ways.md). Every child-facing line is in [the companion text](../content/121-games-table-text.md); this spec holds the rules, the opponent and the saves. Code and art are for the implementation pass.

**Commissioning boundary:** this remains a proposal. Select a bounded first slice after independent content/model/save review; the presence of later games, levels or designers does not commission them all. All Act/chapter links and contributions below are future adapters to the separately proposed spec 120. Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter.

**Bounded first candidate:** Seed Pile and Ribbon Rows, including their listed variants, plus solo Shutters. Seed Holes and Hex are on the [roadmap for much later](../roadmap.md#much-later-parts-held-back-from-the-new-game-kinds): their rules and companion copy are drafts, not selectable games in this increment. Before either is commissioned, a separate model review must pin board coordinates, legal/terminal states, search depth including extra turns, evaluation and move ordering, and a bounded fallback. The proposed four-move/two-move descriptions below are not opponent guarantees.

## Purpose

The garden has rivals who ask questions, but nobody who plays *against* the child and plans. The Games Table adds five small two-sided and solo games, with Bramble as an opponent whose strength the child sets. The games teach thinking ahead, working backwards from the end, number bonds through use, and, for older explorers, finding and testing a winning rule.

Every game here is finite, short and has no luck except the dice in Shutters. Nothing is timed. Nothing is scored across games. A game can be left at any move and resumed, or abandoned without a word.

## Place and story

The table stands under the old pear tree at the edge of the Cloud Orchard, where the weekly market sets up (spec 120, Act II, chapter 1). Bramble brings the games in a ribbon-tied box; her magpie keeps the seeds and sometimes steals one back, only in pictures and never from a game in play. Route: `#orchard/games`, linked from the orchard hub and from the market scene. Open from the start.

In Act III, the crew of *La Garza* ([spec 117](117-spanish-river-market.md)) plays Ribbon Rows on deck, and the River Market links back here with a Spanish number card for the rows (companion text). A finished game at the table counts as an Act II chapter 1 contribution when the explorer keeps a game note (below).

## Bramble's dial

Before each game the child sets how Bramble plays. The dial describes Bramble, never the child, and can change between games, never within one.

| Setting | What Bramble does |
| --- | --- |
| **Bramble is sleepy** | Picks uniformly among the legal moves. |
| **Bramble is paying attention** | Takes the first immediate winning move in the order below; otherwise picks uniformly among legal moves. Taking the last seed is not a winning move in last-seed-loses. |
| **Bramble has a plan** | Takes the first move leaving a losing position under the exact Seed Pile/Ribbon Rows rules below. If none exists, takes the first legal move in the same order. This fallback is a convention, not a claim that it gives the child the most room. |

**Move order for the first candidate:** Seed Pile: take 1, then 2, then 3 where allowed. Ribbon Rows: ascending row index, then ascending number taken. A move always removes a positive available number. Starting rows are each 1–7; a dealt row is uniform in that range. Rows may reach zero during play. Shutters has no opponent dial. The later Seed Holes/Hex candidates do not inherit an undefined "smallest move" policy.

Bramble's lines (companion text) comment on the game, never on the child: "I'm counting backwards from the end. Don't tell my magpie."

The child chooses who starts in every two-sided game. The setup screen says, once, that in Seed Pile and Ribbon Rows the start can decide the game when both players play their best, and that finding out how is the point of the explains pages.

## The games

| ID | Game | Rules | Bramble's plan |
| --- | --- | --- | --- |
| `pile` | **Seed Pile** | One pile of seeds. Players take turns taking 1, 2 or 3. Whoever takes the last seed wins. Start sizes: 9, 13, 15, 17, 20, or any from 5 to 30. | Leave a multiple of 4. |
| `pile-two` | Seed Pile, *take 1 or 2* | As above, taking 1 or 2. | Leave a multiple of 3. |
| `pile-last-loses` | Seed Pile, *last seed loses* | As `pile`, but whoever takes the last seed loses. | Leave one more than a multiple of 4 (1, 5, 9, …). |
| `rows` | **Ribbon Rows** | Two rows of ribbons. On a turn, take any number of ribbons from one row. Whoever takes the last ribbon wins. Starting rows from 1 to 7 each, chosen by the child or dealt. | Make the rows equal. |
| `rows-three` | Ribbon Rows, *three rows* | As above with three rows of 1 to 7. | Leave every size of bundle (4, 2, 1) in pairs; see below. |
| `shutters` | **Shutters** (solo) | Nine shutters numbered 1 to 9 (small box: 1 to 6). Roll two dice; shut any open shutters that add to the roll. Once the open shutters add to 6 or less, roll one die. The game ends when no shutters can make the roll. | None: a solo game. Bramble watches and comments. |
| `holes` | **Seed Holes** | A small mancala: four holes a side and a store at each end, three seeds per hole. Sow a hole's seeds one per hole anticlockwise, skipping the other player's store. Last seed in your store: go again. Last seed in an empty hole on your side, with seeds opposite: put both in your store. When one side is empty, each player stores what is left on their own side. More seeds in your store wins; equal stores are a draw. | Looks four moves ahead, counting store seeds. |
| `hex` | **Hex**, 5 by 5 (older depth) | Take turns placing a ribbon knot on an empty hexagon. The child joins left to right; Bramble joins top to bottom. Whoever links their two sides first wins. | Looks two moves ahead, using the shortest unfinished path for each player. |

**The three-row rule.** Split each row into bundles of 4, 2 and 1 (5 is 4 and 1; 6 is 4 and 2; 7 is 4, 2 and 1). If every bundle size appears an even number of times across the rows, the player about to move can always be beaten. Bramble's plan moves to such a position whenever she can. This is the binary rule for Nim, taught as bundles; the word *binary* appears only in the grown-up note.

**Reviewed finite checks** (2026-10-23; implementation tests must repeat them): losing positive positions through 30 are multiples of 4 for `pile`, multiples of 3 for `pile-two`, and one more than a multiple of 4 for `pile-last-loses`; equal rows lose in `rows`, and exactly the bundle-rule positions lose in `rows-three` (all row sizes 0–7). A bounded review probe did not establish the proposed Seed Holes optimal opening or six-seed margin; those claims are removed from child facts and require a complete independent solution before reuse.

**Shutters comparison contract.** A legal action is a nonempty subset of open shutters summing exactly to the roll. Habit A chooses the lexicographically largest descending list of shutter numbers; Habit B chooses the largest number of shutters, then the lexicographically smallest ascending list. The objective of "best play" is maximizing the probability of shutting every shutter, not minimizing the remaining sum. Exact enumeration under the stated one-die switch gives about 22.08% (small) and 9.76% (full) for that objective, 21.65%/9.48% for A and 11.16%/1.13% for B. These are model-specific calculations, not empirical win rates or guarantees.

The full-box worked comparison uses these twenty ordered die pairs, in order: `(3,6), (5,2), (1,4), (6,6), (2,3), (4,1), (5,5), (2,6), (3,3), (1,2), (6,1), (4,4), (2,2), (5,3), (1,6), (3,4), (6,2), (4,5), (2,1), (5,6)`. Each replay consumes one pair per turn: use both faces while two dice are required and only the first face when one die is required. Stop that replay as soon as it cannot move or all shutters close; never consume another pair after its ending. Habit A finishes with shutters 1 and 6 (sum 7); B with 7, 8 and 9 (sum 24). Unused pairs stay unused. These authored rolls illustrate one comparison and do not estimate the probabilities above.

## Explains pages

Each of Seed Pile, Ribbon Rows and Shutters has a **Bramble explains** page, opened from the game or the table. Each one is a short worked walk in steps the child reveals one at a time (the Listen first pattern from [spec 115](115-rhythm-studio.md)), then a **Test it** game, where the child plays a few positions using the rule and Bramble plays her plan.

- **Seed Pile:** work backwards. 1, 2 or 3 seeds left on your turn: you win. 4 left: whatever you take, your rival wins. 5, 6 or 7: take enough to leave 4. 8: stuck again. Then the question: *what do 4, 8, 12 and 16 have in common?*
- **Ribbon Rows:** copy the other player. If the rows are equal, whatever your rival takes from one row, take the same from the other. Then three rows and bundles, for the older page.
- **Shutters:** there is no sure win, because the dice decide. Some choices make the next roll easier. The page compares two habits (big shutters first, or many small ones) over the same 20 practice rolls, and states the best-play figures above in plain words.

Explains pages never test the child. Test it records nothing beyond "played."

## Origin cards

Each game has a short origin card. Text that names real history carries a `[check]` mark in the companion and needs a source check before build:

- Nim-type take-away games are old and widespread; the name *Nim* and the full rule for many rows were published by Charles Bouton in 1901–1902.
- Mancala is a family of sowing games played across Africa and western Asia for well over a thousand years, with many local names and rules, such as oware and bao. Seed Holes is a small modern version, close to the twentieth-century game Kalah, and the card says so.
- Shut the Box is a pub and family dice game with an uncertain origin.
- Hex was invented by Piet Hein in 1942 and, separately, by John Nash in 1948.

## Older depth

- **Why can't Hex end in a draw?** A page with a full board picture: once every hexagon is filled, one color always links its sides. The page asks the child to try to fill a small 3 by 3 board with no winner, then explains in two sentences why a wall that blocks one player is itself a path for the other. No proof claim beyond that.
- **Design a pile game** (later candidate). Take limit `k` is an integer 1–6; the table is positions 0–30. A positive position is winning if some legal take leaves a losing position. Zero is a terminal convention: losing for the player to move in last-seed-wins, winning in last-seed-loses because the previous player took the last seed and lost. Explain zero separately rather than asking for a move there. Optional rule text is at most 2,000 characters. This designer needs its own content acceptance before commissioning.
- **Who should go first?** For a dealt Ribbon Rows position, predict whether the first player can win, then play it against Bramble's plan.

## Game notes and saved work

A finished game offers **Keep a note**: one optional sentence chosen from stems ("I won when I left…", "Bramble won because…", "Next time I'll try…") with an optional free-text ending. A kept note is the story contribution. Wins and losses are never collected into totals.

Optional root `games` per explorer, absent until the first game starts:

```
games: {
  dial: 'sleepy' | 'attention' | 'plan',     // last used
  current: { source, setup, moves: [move], firstPlayer: 'child' | 'bramble', dial, at } | null,
  earlier: [game],                          // retained prior versions, not automatically trimmed
  notes: [{ gameId, stem, text, proof, at }], // latest 24 readable notes
  explains: { [pageId]: { stepsSeen, testPlayed: bool } },
  designs: [{ k, lastLoses: bool, table: [cell], text, at }]   // latest 6
}
```

- `source` freezes the game ID, understood rule/model version and parameters, setup choices and rule/ending text used by this game. A model ID selects only a supported finite interpreter; imported source text is never executable code. Source is at most 16 KiB UTF-8; a supported current replay holds at most 512 finite moves, including the actual dice rolls and Bramble moves. New moves preflight this cap before changing anything; a cap refusal keeps the current game intact. Replay uses its own supported source and stored moves, never today's rules or a fresh random draw.
- Validate IDs, finite setup/move shapes and legality only under that saved source. An unknown model, malformed move or unsupported replay remains exact, read-only and exportable; do not drop `current` or change a recorded outcome. Other games and notes stay usable. **Start a fresh game** explicitly moves the entire prior current entry unchanged to `earlier` before creating a separate supported game; if retention cannot fit, refuse the start without overwriting it. Loading/rendering never trims `earlier` or repairs a source.
- A note's `proof` is a bounded copy of its own source/setup, actual moves, requested support and literal ending/result, if a result exists. A partial note has no invented outcome. Notes retain their own text and context when current work changes; no totals or learning-level inference is derived from wins/losses. Note/rule prose is at most 2,000 characters. Designer tables keep their own take/terminal rules, entered cells and recorded checks; earlier checks are not regraded on load.
- The latest-24 notes and latest-6 designs windows apply only on an explicit new keep, with any oldest readable replacement disclosed before the action. Never evict an unreadable/raw sibling to make room. New starts, keeps and retained copies preflight the whole candidate through the existing limits and actual formatted `notesReport`/`prepareProgressImport` download path; refusal is atomic and offers Download notes. No new storage service is needed.
- Export/import preserve the entire optional root and opaque unknown fields. Reset, save-off and explorer switching follow the existing shared notebook behavior; recovery never resets another game or silently changes historical evidence.

## Curriculum fit

**Strands** ([six-act strands](../six-act-strands.md)): **M7-I** explain a chosen move; **M7-II** check and revise; **M7-III** choose a strategy and generalise a pattern (the explains pages and Design a pile game); **M7-IV** find a counterexample (a "rule" that fails at one pile size); **M1-I/II** number bonds within 12 and to 30 in Seed Pile and Shutters; **M6** chance in Shutters, descriptive only; **L2-III** choose and compare strategies, learn from an error.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Plan a move by thinking about the end of the game; find and test a rule; make sums within 12 several ways. |
| Teaching encounter | Each Bramble explains page, revealed a step at a time, with a worked position. |
| Contrast | Winning and losing positions; *last seed wins* and *last seed loses*; big-shutters-first and many-small-shutters over the same rolls. |
| Supported practice | The sleepy and paying-attention dial settings; Test it with Bramble's commentary. |
| New application | Changing the take limit; three rows; Design a pile game; Hex. |
| Purposeful revisit | The River Market's Ribbon Rows on deck (Act III); Lantern Night's festival table brings back Seed Pile with a new start size each year. |
| Data boundary | Game setups, moves, dial setting and the child's notes, all local. No totals, rankings, names or timings. |

## Upstream check

Refreshed 2026-10-23: Marble `f186a79a9525c189e2d423e31613c62b6805416f`, Jane `1927912b8d9cd4f7df6e7fbe8416521194743060`.

| Topic | What the research asks, and how this spec does it |
| --- | --- |
| Choosing the right strategy (`mt_mQcWGh02no`) | The reason for a choice matters more than the result; a correct answer by an inefficient route does not show strategy. Notes ask *why*, Bramble's commentary names reasons, and Test it uses positions where the reason shows. |
| Choosing representations strategically (`mt_IwEOCN6bL1`) | Know when a shortcut works and when it fails. The pile rule is shown failing when the take limit changes, before the child finds the new one. |
| Generalising with repeated reasoning (`mt_iyovKgZC1q`) | Test a rule on a fresh case before trusting it; reason from structure, not only from the fitted cases. Design a pile game checks each cell, and the explains page gives the *why* (a rival can always restore the gap of 4). |
| Addition and subtraction strategies (`mt_PpWSHA-0kv`, `mt_zxST3MarI9`) | Bonds practised in use. Shutters shows every way to make the roll before the child chooses. |

Choosing a Strategy (`mt_q7zxOloj_L`, Learning to Learn) has no teaching-research record yet; its topic description fits the notes. Jane's learn-card pattern shaped the explains pages; its points, medals and bosses are not adopted, and no Jane code or text is used.

### Hard-prerequisite crosswalk

| Target | Hard prerequisite in `curriculum/marble/dependencies.json` | How it's met |
| --- | --- | --- |
| Choosing the right strategy (`mt_mQcWGh02no`) | Numbers on a number line (`mt_zMEvtigoM3`) | Existing number-line destinations (the Numbers path). The games make no topic claim for it. |
| Generalising with repeated reasoning (`mt_iyovKgZC1q`) | Reasoning with Equivalences (`mt_jCy07DyBNU`) | Not taught here. The explains pages are supplied reasoning with no topic claim; Design a pile game is open play. |
| Choosing a Strategy (`mt_q7zxOloj_L`) | Trying a New Approach (`mt_95zxYqpP7m`), Learning from Mistakes (`mt_TDUpy57QVM`) | Same unit, informally: the Next time I'll try… note stem and the changed-rule step, where the old rule fails and a new one is found. No topic claim. |

## Checks for implementation

- Each game's rule engine accepts exactly the moves above; a brute-force test confirms Bramble's plan wins every winnable position up to pile 30, rows up to 7 and three rows up to 7, 7, 7.
- Seed Holes and Hex stay unavailable in the first candidate; later model review must name a device/work budget and honest fallback before any lookahead claim ships.
- Shutters reproduces the fixed comparison (A: 1 and 6; B: 7, 8 and 9), the exact subset policy and the model-specific closure probabilities. No pair is used after an ending.
- Resuming replays to the identical position, including dice.
- Dial setting changes are refused mid-game and offered at the end.
- The setup message about first player appears for Seed Pile and Ribbon Rows only.
- Browser at 320 and 820 px: seeds, ribbons, holes and hexagons are at least 44 px targets or have a list alternative; the move list reads in order to a screen reader.

## Review asks

- The first candidate's rules/policies and comparison fixture are specified; this is not implementation or specialist content clearance. Seed Holes, Hex and the designer retain their separate commissioning gates.

- Is "Bramble has a plan" too discouraging for a younger child even with the dial? The default is "paying attention."
- Origin card facts: see the `[check]` lines in the companion.
