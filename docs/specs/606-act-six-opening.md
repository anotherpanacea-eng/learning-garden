# 606 · The Opening of the Ways: Act VI opening, the exchange and the three Ways

Proposed 2026-11-08 by Claude (OCA seat). Base inspected: `413dc1df`, the head of [605](605-act-five-projects.md)'s branch, on which this is stacked. **Specification and a bounded build, not release clearance.** New finite text is in [the 606 companion](../content/606-act-six-opening-text.md). The rest comes from the reviewed [act-6.md](../content/120-story/act-6.md) and [letters.md](../content/120-story/letters.md) (letter 6, English). It follows the act-opening pattern of [352](352-act-four-opening.md) and [604](604-act-five-opening.md). Numbered 606, outside the range Codex uses.

**Commission.** The owner, 2026-11-08, answering whether to start Act VI's opening as another stacked slice: "Start Act VI". Roadmap lane B (LG-G2).

## Purpose and boundary

1. **Continue the story** under the Act V ending and on the Keeper's Pages, once a project is bound. It starts Act VI.
2. **The Act VI hub** at `#almanac/opening-ways`:
   - the carried question;
   - Nuria's letter 6 in English, short or longer to match the frame amount;
   - the hook and the opening at both frame amounts, with read-aloud;
   - links to chapters 1 and 2.
3. **Chapter 1, *Choose a partner and a purpose*** (`/exchange`):
   - the chapter text and the Keeper's note;
   - the Sprout job, played in the chapter as a game. The explorer sorts four goods, up the river to Vadoalto or down to Willowbank, and checks the piles. A wrong pile shows its hint, and right piles show the script's kept line;
   - the Seedling job (four reed for six apples) is marked away from the screen, because no activity does ratios today;
   - the Sapling job links to Messages for a Reader.
4. **Chapter 2, *Compare routes and keep a plan*** (`/routes`):
   - an animated post office map: the map unrolls, honey jars land on its corners, and the three Ways draw themselves in Bramble's ribbon colors (blue river path, gold bridge road, red high ford);
   - the Sprout job, played here: which Way keeps a parcel dry? Each wrong Way gives its reason from Dot's words, the bridge road gives the kept line, and the chosen Way is picked out on the map;
   - the Seedling (hours clock) and Sapling (route planner) jobs are marked away from the screen. Both are *new* in the script and are not built;
   - **Keeping the plan**: *Keep it*, *Make it smaller* or *Not yet*, with the script's lines.

The two games are play for this visit only. Nothing about them is saved, and they are not assessments.

**Out of scope**, each a separate commission:
- Chapter 3, *The long rain*. Its water-arrives scene is chosen by the Act IV plan and needs spec 120's reviewed fallback for a missing plan. It also needs the warning card in French (fluent review) and Léon's letter 7.
- Chapter 4: the first journey, Hollis's return and letter 8.
- Page 6, Hollis's letter, and the Act VI ending, *The Opening of the Ways*. These need chapters 2–4.
- Letter 6's Spanish, which needs a fluent reader.
- The hours clock and the route planner.
- The Keeper's Desk jobs.

## Routes and start

| Route | View |
| --- | --- |
| `#almanac/opening-ways` | Letter, hook, opening, chapters |
| `#almanac/opening-ways/exchange` | Chapter 1 |
| `#almanac/opening-ways/routes` | Chapter 2. Any other segment, the unbuilt chapters included, falls back to the hub without a write. |

**Start condition.** Act VI may start once `actFiveView(state).ended` is true, so it needs a bound Act V project. Continue the story writes `story.acts.VI={started:true}` and the scene `nurias-list` in one atomic write, and leaves Act V untouched.

## State

- **The plan.** `story.acts.VI.plan` holds `full` (Keep it) or `small` (Make it smaller). *Not yet* writes nothing. Keeping a plan again switches it, and keeping the same one again is a no-op.
- **Reading a saved plan.** A well-formed code today's list doesn't know reads as no plan, the chapter says so, and nothing rewrites it until the explorer keeps a plan. A malformed plan or act is unreadable and cannot be overwritten.
- **Writes** go through 604's atomic step: the notebook is cloned, `recoveryFitsProgressLimits` and the export preflight run, and a refusal writes nothing.
- **Shared preference.** The frame amount is `story.frameAmount`. `setActTwoFrameAmount`'s eligibility now reads a started Act V *or* VI directly from the story.

Act VI's ending condition (120 §6) is a kept plan, the long rain and the first journey. This slice writes only the first of those, and nothing reads it yet.

## Presentation

- **New modules:**
  - `act-six-content.mjs`, `act-six-core.mjs` and `act-six-ui.mjs`, with the routes, pages, games, invitation, notes and binder;
  - `act-six-art.mjs` (`waysMap`) and `act-six.css`.
- **Changes to existing files:**
  - `app.mjs` adds one route block, and Act VI routes everywhere Act V's appear: deferred initialization, the welcome-film exclusions, film blocking and explorer destination. `bindActSix` runs wherever `bindActFive` does;
  - `act-five-ui.mjs` adds the invitation under its ending;
  - `keeper-story-ui.mjs` adds the invitation and the notes line;
  - `act-two-core.mjs` adds the frame-amount eligibility;
  - `index.html` links the stylesheet;
  - `ending-film-checks` covers the new routes.
- **The map's geography is a picture, not a measurement.** The river path follows the brook, the high ford crosses the water on stepping stones, and the bridge road loops wide over a bridge.
- **Accessibility.**
  - The map is an `svg role="img"` with a description that names all three Ways, and a caption.
  - Sorting buttons and Way buttons are toggle buttons with `aria-pressed`. Focus moves to each result.
  - Targets are 44 px. Read-aloud covers visible prose only, and skips a closed Keeper's note.

## Upstream study and curriculum place

**Jane**, refreshed at `c681f6bf2f2adf2aa032f765983a4691774cfba5`, is studied only, as in 604: a hub of quests whose small games sit inside the story. No Jane code, prose or assets are used.

**Marble**, refreshed at `04962c78ccb8bd52b236512d3362405bace98d2a`. The repository pin `96a7933754af672e1bfdbf7ecb05c325860c6e0d` is unchanged. These are candidates only, with no atlas mapping and no claim. The games are story play, not lessons, and they declare nothing.

**Spec 49.** Act VI is the "exchange and opening" act: plan an exchange with constraints, weigh routes against conditions, and say what happens when something goes wrong. The which-Way puzzle is a small instance of choosing by a stated condition (*this parcel must stay dry*).

**Spec 120.** This slice covers:
- §6, Act VI's opening and chapters 1–2;
- §10's order of letters: letter 6 opens Act VI;
- §12: the exchange planner is a dependency. The kept plan here is that planner's first, story-level form, and the Sapling route planner remains unbuilt.

All new prose and the illustration are original project material.

## Gates and acceptance

Before build: an independent spec review of this spec and its companion.

**Pure checks** (`test/act-six-checks.mjs`, with fixtures from the real Act IV and V APIs):
- **Routes.** Every route resolves. An unbuilt chapter falls back to the hub, and Act V routes are not Act VI's.
- **Before a project is bound.** Nothing is offered or written.
- **After the bind.**
  - The invitation appears under the Act V ending and on the Keeper's Pages. Reads and renders write nothing, and a refused export writes nothing.
  - The start writes the act and its scene and leaves Act V untouched. A repeat is a no-op.
- **The hub.** It has the letter, links both chapters, and leaves no placeholder.
- **Chapter 1.** Every good can go either way, both piles are needed, and the jobs are honest about links.
- **Chapter 2.**
  - The map is described, with three Ways to choose and all three on the map. Only the bridge road keeps a parcel dry.
  - All three plan choices are offered.
- **The plan.**
  - *Not yet* is never saved, and a refusal writes nothing.
  - The smaller plan is kept as a code with the guide's line. Repeating it is a no-op, and switching changes only the plan.
  - *Not yet* disappears once a plan is kept. Notes and the hub say the plan is kept.
- **Saved shapes.**
  - A future plan reads as no plan and says so.
  - A malformed plan is not overwritten. A malformed act is unreadable.
  - Act VI needs the Act V ending.
  - The frame controls work with only Act VI readable.
- **Text tracing.** Every content string appears in act-6.md, letters.md or this companion.

**Browser journey** (`test/act-six-browser.py`), at 820 and 320:
- Continue the story under the Act V ending starts the act and leaves Act V unchanged. The hub shows the letter.
- **Sorting.** A wrong pile shows its hint. Right piles show the kept line, focus moves to the result, and the game writes nothing.
- **The Way puzzle.** The ford gives its reason and is picked out on the map. The bridge road gives the kept line, and the puzzle writes nothing.
- **The plan.**
  - *Not yet* says so and writes nothing.
  - *Make it smaller* keeps the plan, with the guide and kept lines, moves focus and survives a reload.
  - The Keeper's Pages link to Act VI.
- **Guards.** No welcome film opens. Unrelated saves are kept. Read-aloud skips the closed note.
- **Layout.** Targets are 44 px and nothing overflows.
- **Motion.** Every part animates once and settles within five seconds; reduced motion shows the map drawn.

Existing suites still pass. Physical iPad, Safari, VoiceOver and learning effects remain unqualified. An exact-head implementation review and the repository's landing procedure follow.
