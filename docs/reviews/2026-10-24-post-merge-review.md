# Post-merge Claude review: PR123, PR125, PR129, PR130, PR131 (2026-10-24)

Main at `01ea5db` (after PR131). These five merges had no review file in this folder, so this is a fresh read of what is live: child-facing text, game logic and the 390px phone layout, with local Chrome play-throughs on synthetic notebooks. PR113 to PR121 already carry recorded Claude clearance (see the 2026-10-22 evening checkpoint) and were not re-read.

## Fixed in this branch

- **P2, Seed Pile practice board could not be won after the "Take 1 or 2" explanation.** The practice board always started at 6 seeds with the explorer moving first against Bramble's plan. Under "Take 1 or 2", 6 is a multiple of 3, so the explorer loses whatever they take, right after the explanation has told them how to win. Reproduced in Chrome: both first moves end with "Bramble wins this one." The practice board now starts at the explanation's worked-example pile (thought 3), moved up if needed so that it is always a winning pile for the explorer: 6 for "Take 1, 2 or 3" and "Last seed loses", 5 for "Take 1 or 2". A new check proves the start is winnable under every rule set with an independent game-tree search. The practice board still keeps no result.
- **P3, Same pour, new unit narration said "1 liters".** The spoken view reads "Jug capacity: 1 liters = 1000 milliliters" twice. The speech helper now says "1 liter"; decimals keep "liters".
- **P3, Shutters explanation missed a way to make seven.** Thought 2 lists one and six, two and five, and three and four, but not one, two and four, which the "Show ways" help does list. The thought now names the three-shutter way too, which also models the point that more than two shutters can make a roll. Saved lessons keep the source copy they were saved with, so older saves are unchanged.

## Found, not changed here

- **P2, one source-check suite fails on main.** `test/sentence-bridges-checks.mjs` fails from PR129 onward: it checks that `app.mjs` contains the exact text `!choosingExplorer&&!bridgesBench`, and PR129 inserted `!pileBench&&!shuttersBench&&` between them. Behaviour is unchanged; the check pins source text. Under the test value convention the assertion should go, or check behaviour instead. Every other suite passes (154 of 155).
- **P3, Seed Pile reads saved games against today's dial list.** `pilePosition` rejects a saved game whose `dial` is not in today's `pileDials`, so renaming or retiring a dial would hide waiting games. AGENTS.md asks saves not to be checked against today's content lists.
- **P3, Post Office route page repeats its launch paragraph.** PR131 renders the "Fly this route" block above and below the cards, each with the same sentence, so a screen reader hears it twice. A shorter second block (button only) would do.

## Checked and fine

- Seed Pile rules, Bramble's three dials, both explanations' arithmetic (multiples of 4 and 3; tricky piles 1, 5, 9, 13 when the last seed loses), and the ending text.
- Shutters dice switch (one die at six or less), blocked rounds, notes only after a round ends, and no page overflow at 390px.
- Starting choices: Keep and Skip leave settings alone, and waiting work keeps its own amounts.
- Capacity arithmetic: 20 spaces of 50 mL, 0.30 L and 0.35 L readings, reserve totals.

Not covered: physical iPad or Safari, human screen-reader delivery, audio quality.
