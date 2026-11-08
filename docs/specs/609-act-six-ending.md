# 609 · The Opening of the Ways: Hollis's letter and the Act VI ending

Proposed 2026-11-08 by Claude (OCA seat). Base inspected: `686f88fa`, the head of [608](608-act-six-journey.md)'s branch, on which this is stacked. **Specification and a bounded build, not release clearance.** New finite text is in [the 609 companion](../content/609-act-six-ending-text.md). The ending text, season lines, almanac line and village line come from the reviewed [act-6.md](../content/120-story/act-6.md). Page 6 comes from the [120 companion](../content/120-keeper-of-the-ways-text.md). Numbered 609, outside the range Codex uses.

**Commission.** The owner, 2026-11-08: "Build the ending". With 606–608 this completes Act VI, and with it the six-act story's last ending (spec 120). Roadmap lane B (LG-G2).

## Purpose and boundary

1. **After supper.** Act VI's ending condition (120 §6) is a kept exchange plan, the long rain (the warning sent) and the first journey. Once all three hold, chapter 4 offers **Read Hollis's letter** under *They stay for supper*. Reading it ends the act in one atomic write: `ended`, the season it ended in (never replacing a saved one) and the scene `ways-open`. It then opens Page 6.
2. **Page 6, *Hollis's letter*,** at `#almanac/hollis-letter`. A new reveal line follows the companion's note that Hollis gives the letter at supper. Then comes the whole letter, one version, with read-aloud, and **Go down to the bridge**.
3. **The ending, *The Opening of the Ways*,** at `#almanac/ways-open`:
   - an animated scene: three ribbon posts, where Bramble's ribbons tie on one by one (blue, gold, red) and lift once in the wind, with a season mark;
   - the ending at both frame amounts;
   - the season line;
   - the almanac line, *Act VI: The Opening of the Ways. The Ways are open. Hollis came home.*;
   - the village line, *Willowbank, by Willow Brook. The Ways are open.*
4. **Afterwards:**
   - the hub and chapter 4 link back to Page 6 and the ending;
   - the Keeper's Pages show the village line and **Reread the ending** instead of Continue the story;
   - Grown-up notes say the Ways are open.

**Out of scope:**
- **The new apprentice as a playable character.** They appear only in the ending text.
- **Festival visits by Hollis,** from festivals-and-storm-day.md.
- **A site-wide village line.** No such element exists today, so the line appears on the ending and the Keeper's Pages.
- **Letters 7 and 8 in French,** and Hollis's line about the unbuilt spec 118 case.
- **Any film.** LG-G5's film timing stays as the roadmap sets it.

The story never re-breaks the town, and play continues (120 §1).

## State

- **Writes.** `story.acts.VI.ended: true`, `story.acts.VI.season` (when absent) and `seenScenes: 'ways-open'`, written by `endActSix`.
- **Conditions.** The write needs a started act, a kept exchange plan, `warned` and `journey`. It also needs `ended` and `season` to be absent or well formed.
- **Refusals.** A refused export, an impossible month, a malformed `ended` or a malformed `season` each write nothing.
- **Repeats.** Ending again is a no-op that keeps the season.
- **Saved shapes.** `ended` without `started` is not an ending. Reading Page 6 or the ending writes nothing.

## Presentation

- **Code.**
  - `act-six-content.mjs` gains the `ending` block.
  - `act-six-core.mjs` gains the ending view and `endActSix`.
  - `act-six-ui.mjs` gains the two routes and pages, the after-supper offer, the hub and invitation changes, the Notes line and the binder.
  - `act-six-ending-art.mjs` (`waysOpenScene`) and `act-six.css` add the picture and its animation.
- **Tests.** `ending-film-checks` covers the two new routes, so no welcome film opens there.
- **Hollis's pronouns.** Hollis is they/them throughout.
- **Accessibility.**
  - The scene is an `svg role="img"` with a description.
  - Read-aloud covers visible prose. Targets are 44 px, checked at 320 and 820.
  - The ribbons tie once and settle within five seconds; reduced motion shows them tied.

## Upstream study and curriculum place

**Jane**, refreshed at `c681f6bf2f2adf2aa032f765983a4691774cfba5`, is studied only: its quests end in a reward. Here the ending gives the explorer a role ("Anyone can be the Keeper of the Ways") and a newcomer to help. No Jane code, prose or assets are used.

**Marble**, refreshed at `04962c78ccb8bd52b236512d3362405bace98d2a`. The repository pin `96a7933754af672e1bfdbf7ecb05c325860c6e0d` is unchanged. Nothing is mapped or claimed.

**Spec 120.** This slice covers:
- §5, Page 6;
- §6, Act VI's ending and its condition;
- the ending's season, almanac and village lines.

All new prose and the illustration are original project material.

## Gates and acceptance

Before build: an independent spec review of this spec and its companion.

**Pure checks** (`test/act-six-ending-checks.mjs`):
- **Routes.** Page 6 and the ending each have a route.
- **Before the condition holds.**
  - There is no ending before the first journey, no letter offer, and Page 6 and the ending wait.
  - Four broken conditions each refuse and write nothing: no exchange plan, no warning, a malformed `ended`, a malformed `season`.
- **After supper.**
  - The letter is offered. A refused export and an impossible month are refused.
  - Ending writes `ended`, the season and the scene, and nothing else changes. A repeat keeps the season, and a saved season is never replaced.
- **Page 6 and the ending.**
  - Page 6 has the whole letter and the way to the bridge.
  - The ending has the described ribbons in their season, the season, almanac and village lines, and the text with the guide named.
  - The hub, chapter 4, the Keeper's Pages and Notes link back or say so.
  - Reading writes nothing, and `ended` without `started` is not an ending.
- **Text tracing.** Every string traces to act-6.md, letters.md, the 120 companion, or the 606–609 companions (`test/act-six-checks.mjs`).

**Browser journey** (`test/act-six-ending-browser.py`):
- After supper, reading the letter ends the act with a season and leaves Act V unchanged. The letter is given after supper.
- The ending shows the almanac and village lines, and the picture wears its season.
- The Keeper's Pages show the village line and the ending.
- Page 6 and the winter ending render at 320.
- Targets are 44 px and nothing overflows.
- Motion: each ribbon ties once and settles within five seconds; reduced motion shows them tied.

Existing suites still pass. Physical iPad, Safari, VoiceOver and learning effects remain unqualified. An exact-head implementation review and the repository's landing procedure follow.
