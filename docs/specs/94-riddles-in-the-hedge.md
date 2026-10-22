# 94. Riddles in the Hedge: multiple-choice riddle cards

Status: **repair amendment for an unmerged, undeployed draft; runtime changes await independent review.** Requested as a just-for-fun activity: riddles with multiple-choice answers. The riddles are play first, and each answer opens a short "why it fits" line that connects to an existing destination.

## What the learner sees

`#riddles`, linked from the home page under the Word Garden invitation. Story frame: the storm blew the library's riddle cards into the hedge, and Dot pulls them out one at a time.

- **Pull out a riddle** shows one card: a riddle, a hear button for the riddle and its answers, and three answer buttons.
- A non-fitting pick stays visible as **(not this one)**, cannot be picked again, and shows Dot's nudge for that specific choice. Each nudge names the clue in the riddle that the choice misses, so wrong choices are wrong for a reason the riddle itself shows.
- **Ask Dot for a clue**, **Show the answer**, and **Put this card back** are available while a card is unfinished. Putting it back keeps the frozen card, picks and support as a moved-on round, then pulls another. No timer, score, streak, lock or penalty.
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

Optional root `riddles`, absent until the first explicit card-band choice or **Pull out a riddle**. Merely viewing, hearing or following a link creates nothing. A band choice is saved even before a card is pulled:

```
{version:1, size, met:[cardId|raw], current:null|round|raw,
 log:[finishedRound|legacyCodeOnlyRound|raw], retainedRawCurrent?:[raw]}

round = {id, source, order:[choiceCode], picks:[choiceCode], clue:boolean,
 outcome:null|'solved'|'shown'}
finishedRound = {id, source, order, picks, tries, clue,
 outcome:'solved'|'shown'|'skipped'}
legacyCodeOnlyRound = {id, tries, clue, outcome:'solved'|'shown'|'skipped'}
```

- A new pulled card freezes its own `{id,prompt,answer,choices:[{code,text,nudge}],clue,why,place:{href,label}}` from the finite authored pack. Its saved `order` shuffles the three choice codes once. Current prompts, labels, nudges, key, clue, explanation and destination render only from that frozen source. The pack may change later without reinterpreting this card. Each finished round copies the complete source, picks and order before another card replaces it. The `met` list is a familiarity count only, not a reading assessment.
- Source IDs and choice codes use lowercase letters, digits and hyphens, length1–40; three unique choices include exactly one saved answer. Prompt, clue, explanation, choice text/nudge and destination label are nonempty strings of at most1600 UTF-8 bytes each; a fitting choice has a null nudge, the other two have bounded nonempty nudges. The complete source is at most16KiB. Destination hash is a bounded same-site route (`^#[a-z][a-z0-9/-]{0,80}$`), never a URL supplied from elsewhere. Display all saved prose escaped. Preserve harmless unknown keys in the source and round.
- Readability checks the round against its own frozen source: its ID matches the source ID; `order` contains the three source choice codes once; unique `picks` are in that order; `tries` equals picks length in a finished round; a solved outcome ends with its own saved answer, while shown and skipped remain distinct. Do not compare with today's wording or answer key. A contradictory round is unavailable/raw. Legacy code-only finished logs remain as honestly labeled historical outcome/try counts if their own small fields are readable; never reconstruct their source or present a current answer from today's catalog. A legacy code-only current card, including one whose catalog ID or choice codes changed or retired, or a malformed frozen current card is unavailable/raw, never silently upgraded, regraded or reworded. A readable frozen card remains readable when its catalog source retires.
- One malformed `met` or `log` item remains in its original position and does not close readable siblings or the current card. Summaries use only readable entries, distinguish legacy count-only rounds and state how many items are unavailable. Do not delete, normalize or rewrite raw siblings on view, import or notes. If the root envelope itself cannot be read, pause only Riddles and retain the exact root in the download; other destinations remain open. The importer accepts an unsupported `riddles` root so the rest of the notebook can import.
- An unavailable occupied current card shows **Keep this earlier card and pull another** behind a native confirmation. Confirming copies the complete prior value into `retainedRawCurrent` before drawing a new frozen card. Cancel, close, used or detached confirmations do nothing. For a readable unfinished card, **Put this card back** explicitly records a frozen skipped round, including its picks and clue use, then draws another. Completed cards already have their frozen finished round before the next draw. No action silently replaces an occupied card or loses raw work.
- Each write builds a detached full notebook candidate, checks existing depth/size limits and calls the app's actual `notesReport(candidate) -> prepareProgressImport` preflight before adopting `riddles` and saving. A refusal preserves all cards, logs, raw siblings, band choice and IDs, focuses an actionable download/separate-explorer message and makes no success claim. Use the existing limits and report callback; no new persistence service. Every action checks that its control is connected in the active `#riddles` route, the same explorer and the same captured current root before drawing randomness, changing a choice or writing. Old route/explorer/used controls are inert.

Two content repairs belong to this version. The map card asks: **Streets and rivers are drawn on me. I am one folded sheet with no pages to turn. What am I?** Its distractor is **A storybook**, with nudge **A storybook has pages to turn. This riddle says one folded sheet.** The butterfly card asks: **I munch leaves as a butterfly caterpillar. I become a chrysalis. Later, a butterfly emerges. What was I first?** Its clue is **Think of a butterfly before it formed a chrysalis.** Its explanation is **A butterfly caterpillar sheds its skin at its final molt and becomes a chrysalis. An adult butterfly later emerges.** The grasshopper nudge is **A grasshopper grows wings, but it does not become a butterfly chrysalis.** The bird nudge is **A bird hatches from an egg. It does not become a butterfly chrysalis.** These exact child lines replace the overbroad book/map and sleep/cocoon implications; no external prose is incorporated.

## Upstream check

Jane `LESSONS.md` was refreshed at `60d864fb9004d7090c7ea2f595f679b35bc566ad` on 2026-10-22. Its `mc` conventions (three options with one right and two plausible, a hint that nudges without giving the answer, a one- or two-sentence explanation, showing the answer as a learning moment) are design references. Its points, mastery and step-down rules are not adopted, and no Jane code or prose is incorporated. Pinned Marble topics `mt_37QCuGOxFe` (Homophones) and `mt_lp3qyEujIv` (Inference vs Explicit Meaning) are partial thematic references only; no atlas mapping is added.

## Checks

`node test/riddles-checks.mjs` must cover card integrity, no em-dashes in child copy, no allocation on view, frozen source/order across reload and catalog edits, varied fitting positions, miss/clue/shown/put-back outcomes, band choice and rotation, a legacy code-only current, raw current confirmation, mixed readable/legacy/raw logs, an unsupported root, and unchanged raw siblings through import and download. Exercise an importable near-5MiB actual report that refuses a new card or pick atomically. `test/riddles-browser.js` must cover phone/tablet layout, 44px controls, focus, actual file import/download, stale route/explorer controls, a canceled and used recovery confirmation, no horizontal overflow and truthful notes. Local checks do not establish physical iPad/Safari behavior or learning effects.
