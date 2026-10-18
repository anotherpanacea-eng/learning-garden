# Regrowing the garden and open number tasks

Status: implemented; independent spec and implementation reviews cleared. Depends on [spec 16](16-explorer-profiles-and-progress-safety.md) (per-explorer state) and [spec 20](20-number-garden-voice-and-art.md) (art).

## Problem

After the Storm gives the app a shared story, but nothing the child does in Number Garden changes that world, and nothing persistent shows a child how much they have explored. Most Number Garden tasks also have one right answer, while its best prompts ("Invent a label where the same digit appears twice") appear only on end screens.

## Regrowing the storm garden

The opening garden scene shows storm damage. Taking part replants it:

| Event | Planting |
| --- | --- |
| Finishing a Number Garden walk, with any outcome including skips | A plant from that area |
| Finishing a Number Garden adventure or open task | A plant from that area |
| First use of a new kind of help (first hint, first model change, first smaller example) | A decoration: birdbath, bench, scarecrow |

Plants depend on the area, never on correctness: sunflowers for Bundle Burrow, strawberries for Picnic Clearing, water lilies for Sharing Pond, moss stones for the Stepping-stone Path, tulips in shaped pots for the Shape Pavilion, climbing beans for the Ribbon Workshop, mushrooms for Puzzle Hollow. The end screen offers a seed packet with **Plant it**, and the child taps an empty plot in the garden scene to choose where it grows. Beds of 4 × 3 plots extend as they fill. Plants never wilt, nothing is lost for time away, and there are no counts, levels, streaks or comparisons between explorers. Plantings never appear as evidence or influence suggestions.

State lives per explorer in a new `plantings:{plots:[{bed,slot,kind,area,at}],pending:[{kind,area,at}]}` field, separate from the story `garden` field, with additive normalization (earlier shared saves are already backed up by the spec 16 migration); the established state version stays compatible.

## Open number tasks

Add an unscored Number Garden item kind, recorded like story project nodes (an invitation acknowledged, never proof of work or skill):

| Format | Example |
| --- | --- |
| Which one doesn't belong? | Four arrays (2 × 6, 3 × 4, 4 × 3, 5 × 2); every choice can be defended, and Dot asks why |
| Estimate first | "About how many seeds are in the jar?" then count in the playground and compare |
| Many ways | "Make 24 in the array model three different ways"; each new rectangle is kept on screen |
| Find a counterexample | "Pip says every four-sided shape has four mirror lines. Can you find one that doesn't?" |

Existing `wonder` prompts become open tasks reachable from each area's adventure list. Each area gains at least one, and every open task ends with **We tried it** or **Not today**.

## Verification

Each earning event adds exactly one pending seed and planting moves it into a plot; a skipped walk earns the same as an answered one; the planting code reads no correctness, independence or support field; open tasks record no correctness and never feed independent or fresh evidence; save-off, export and reset include plantings. Browser: earn and plant on a phone and a tablet, reload, and switch explorers.

## Build clarification

Persist a unique participation event key with each pending/placed seed so rerender, reload and repeated clicks cannot mint duplicates. Walk keys include the area and visit number; adventure/open-task keys identify a new explicit visit. Hint/model/helper decorations each earn once per explorer. An open task explicitly acknowledged with either We tried it or Not today counts as participation; it records only that invitation response, never correctness. Each area exposes its existing wonder invitation as an open task; the four illustrated formats add further options. Planting does not read learning results. The dedicated garden route renders one 4-by-3 bed at a time with open navigation to earlier beds as more beds are added, avoiding unbounded rendered grids.
