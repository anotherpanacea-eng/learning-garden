# 92. Riddles in the Hedge: multiple-choice riddle cards

Status: **implemented in a draft branch; not merged or deployed.** Requested as a just-for-fun activity: riddles with multiple-choice answers. The riddles are play first, and each answer opens a short "why it fits" line that connects to an existing destination.

## What the learner sees

`#riddles`, linked from the home page under the Word Garden invitation. Story frame: the storm blew the library's riddle cards into the hedge, and Dot pulls them out one at a time.

- **Pull out a riddle** shows one card: a riddle, a hear button for the riddle and its answers, and three answer buttons.
- A non-fitting pick stays visible as **(not this one)**, cannot be picked again, and shows Dot's nudge for that specific choice. Each nudge names the clue in the riddle that the choice misses, so wrong choices are wrong for a reason the riddle itself shows.
- **Ask Dot for a clue** and **Show the answer** are always available while a card is open. No timer, score, streak, lock or penalty.
- A fitting pick, or a shown answer, reveals the explanation and a link to the related place (Water Lab, Living Garden, Number Garden, Willow Path, Word Garden, orchard maps, Café, Fraction Trail, Post Office or French Paris).
- **A riddle of your own** is an unsaved invitation to make up a riddle together.

## Cards and challenge bands

18 original cards in `dist/riddles-content.mjs`, six per authoring band, spread over the math, reading, science, world and French strands. Every card has exactly three choices, one fitting.

| Band (authoring label) | Child-facing card choice | Shape |
|---|---|---|
| `sprout` | Short riddles | Two or three short clue sentences about concrete things |
| `seedling` | Riddles with more clues | Combine clues, a homophone, early fractions, a first French word |
| `sapling` | Wordplay riddles | Double meanings, two-condition number riddles, a French false friend |

This follows the [challenge-bands proposal](proposed/challenge-bands.md): bands describe tasks, never the child, and every card stays open. The card choice is a local, saved, explicit control (`riddles.size`: `any | sprout | seedling | sapling`, default `any`). It does not read `garden.start`; a later reading-strand shortcut can map onto it without migrating saved work. Changing the choice never alters the card that is out.

## Saved work

Optional root `riddles`, absent until the first **Pull out a riddle**:

```
{version:1, size, met:[cardId], current:null|{id, order:[choiceCode], picks:[choiceCode], clue, outcome:null|'solved'|'shown'}, log:[{id, tries, clue, outcome:'solved'|'shown'|'skipped'}]}
```

- Codes only. Text, the fitting answer and the explanation come from today's cards at render time.
- The choice order is shuffled once when a card is pulled out and saved, so reload and resume keep it. The fitting choice therefore lands in different positions across cards.
- Validation checks shape, ids, counts and self-consistency (`picks` within `order`, a solved card has a pick). It never checks saved work against today's cards or answer key.
- A saved card that today's cards cannot show exactly (retired id or changed choice codes) reads as "this riddle card has blown away" with **Pull out another riddle**; nothing is rewritten on view.
- An unreadable root pauses only this activity and is kept unchanged. The importer allows a non-object `riddles` root so the rest of a notebook still imports.
- `log` keeps first-pick, later-pick, after-clue, shown and moved-on rounds separate. Grown-up notes report those counts and say the picks are not a reading or reasoning assessment.

## Upstream check

Jane `LESSONS.md` was refreshed at `60d864fb9004d7090c7ea2f595f679b35bc566ad` on 2026-10-22. Its `mc` conventions (three options with one right and two plausible, a hint that nudges without giving the answer, a one- or two-sentence explanation, showing the answer as a learning moment) are design references. Its points, mastery and step-down rules are not adopted, and no Jane code or prose is incorporated. Pinned Marble topics `mt_37QCuGOxFe` (Homophones) and `mt_lp3qyEujIv` (Inference vs Explicit Meaning) are partial thematic references only; no atlas mapping is added.

## Checks

`node test/riddles-checks.mjs` covers card integrity, no em-dashes in kid copy, view without allocation, saved order through reload, varied fitting positions, miss/clue/shown/skip outcomes, card choice and rotation, retired cards, unreadable roots and import. `test/riddles-browser.js` plays a card at 320 px against a local server: no horizontal overflow, 44 px choice targets, focus moves, reload keeps order, and notes report the round.
