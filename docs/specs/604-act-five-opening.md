# 604 · A Question of Your Own: Act V opening, Page 5 and the six project paths

Proposed 2026-11-08 by Claude (OCA seat). Base inspected: `fbbc53df`, the head of [603](603-act-four-gazette.md)'s branch, on which this is stacked. 603 sits on [602](602-act-four-meeting.md), and 602 on [601](601-act-four-orchard.md). It needs 602's `acts.IV.ended`. **Specification and a bounded build, not release clearance.** The finite text not copied unchanged from its sources is in [the 604 companion](../content/604-act-five-opening-text.md). The rest comes from the reviewed [act-5.md](../content/120-story/act-5.md) and the [120 companion](../content/120-keeper-of-the-ways-text.md)'s Page 5. It follows [352](352-act-four-opening.md)'s pattern for an act opening. Numbered 604, outside the range Codex uses.

**Commission.** The owner, 2026-11-07 and 08: "do a deep dive into the Learning Garden and do some creative work. Build animations, story beats, games, and lessons. Identify big picture stuff and spec, build, and PR it." Also 2026-11-07: "It's not always clear WHY they should play another game." Act V's paths are the story's reason to go into a game: each path's jobs are existing activities, framed as a project the child chose. Roadmap lane B (LG-G2).

## Purpose and boundary

1. **Continue the story** after the Act IV ending starts Act V and frees Page 5, *For the next Keeper*. This mirrors 352, where Act IV's start frees Page 4.
2. **Page 5** at `#almanac/next-keeper`:
   - the reveal line, the leaf with its edge word *next*, and the guide line;
   - an animated stack of blank pages that lift apart one by one, then the heading writes itself across the first page. It settles within about three seconds; reduced motion shows it finished.
3. **The Act V hub** at `#almanac/own-question`:
   - the carried question, the hook and the opening at both frame amounts, with read-aloud;
   - the six project paths, each with its invitation (one current path; a second project at once is out of scope, so the copy does not offer it);
   - spec 49's six project steps, with the script's shared guide lines.
4. **A page for each path** at `#almanac/own-question/<path>`:
   - its invitation, its text at both frame amounts, and its Keeper's note;
   - its jobs, each linking to an activity that exists today;
   - the Ask step's guide line, with a link to the built Question Bench.
   - **Choose this path** stores one code. Choosing again switches, and nothing else changes.
5. **Continue the story** appears under the Act IV ending and on the Keeper's Pages. Grown-up notes get a line.

**Out of scope**, each a separate commission:
- The project page: Make with an offered artifact, Show with the path's response line, Change, and Keep with a limit (the Sprout limit cards and Seedling sentences).
- The Act V ending, *A Question of Our Own*, with its season and almanac lines. 120 §12 lists the project page as an unbuilt dependency, and the ending opens only when a project is kept with a stated limit.
- "Big or small": a smaller version of a path. The guide line is shown; no size is stored.
- A second project at the same time.
- Path 6's letter from Nuria (letters.md, letter 5). Its sentence is left out of the path text, because no letter is delivered.
- The two **hours clock** jobs (Paths 3 and 5, marked *new* in the script). No such activity exists, so those jobs are not listed.
- The Keeper's Desk projects.
- The Show lines. They describe the project being shown, so they belong to the project page.

Choosing a path is story progress, not a curriculum milestone or a learning measure.

## Routes and start

| Route | View |
| --- | --- |
| `#almanac/next-keeper` | Page 5 (reveal, then rereading) |
| `#almanac/own-question` | Hook, opening, six paths, six steps |
| `#almanac/own-question/<path>` | One path. An unknown segment falls back to the hub without a write. |

**Start condition.** Act V may start once `actFourView(state).ended` is true, so it needs a started and ended Act IV. Before then the hub says the act opens after the town meeting, and nothing is offered or written.

**Writes.** Continue the story writes `story.acts.V={started:true}` and adds the scene `next-keeper-page-revealed`, in one atomic write. Like 352 there is a separate reveal, for a started act whose page scene is missing. Neither write touches Act IV.

## State

- **`story.acts.V`.** The act starts as `{started:true}`, and after a choice it is `{started:true, path:'<code>'}`. The six codes are `night-garden`, `gazette`, `sky-night`, `travelling-show`, `courier-route` and `sponge-again`.
- **Reading a saved path.**
  - A path is read by shape: a lowercase code of at most 64 characters.
  - A well-formed code that today's list doesn't know reads as no path. The hub says it came from an earlier version, and nothing rewrites it until the explorer chooses a path.
  - A malformed path is unreadable and cannot be overwritten. A malformed act root is unreadable, and the page says so.
- **Writes.** All writes go through the same atomic step as 352:
  - the notebook is cloned and the story checked;
  - `recoveryFitsProgressLimits` and the export preflight run;
  - a refusal writes nothing;
  - choosing the current path again is a no-op.
- **Shared preference.** The frame amount is `story.frameAmount`, shared with Acts II–IV. `setActTwoFrameAmount`'s eligibility adds a started Act V, read directly from the story, so the reading controls work even when an earlier act's record is absent or unreadable.

## Presentation

- **New modules:**
  - `act-five-content.mjs` holds the text;
  - `act-five-core.mjs` holds the view and the writes;
  - `act-five-ui.mjs` holds the routes, pages, invitation, notes and binder;
  - `act-five-art.mjs` draws the blank pages;
  - `act-five.css` styles them.
- **Changes to existing files:**
  - `app.mjs` adds one route block, like Act IV's, and adds Act V routes wherever Act IV's appear: deferred explorer initialization (so a story choice never normalizes unrelated saves), the automatic welcome-film exclusions, film blocking and explorer destination;
  - `act-two-core.mjs` adds a started Act V to the frame-amount eligibility;
  - `bindActFive` runs wherever `bindActFour` does, so the invitation works under the Act IV ending and on the Keeper's Pages;
  - `act-four-ui.mjs` adds the invitation under the ending;
  - `keeper-story-ui.mjs` adds the invitation and the notes line;
  - `index.html` links the stylesheet.
- **Names.** `{guide}` and `{courier}` resolve as in Act III: an unrecognized saved courier reads as *the courier*, capitalized at the start of a sentence.
- **Job links.** A job links only to an activity that can do something close to what it asks; the browser suite opens each one and checks its title. A job that no activity can do today is marked *away from the screen* (on paper, outdoors or out loud) with no link, and the path's intro says some jobs happen there:

| Path | Jobs |
| --- | --- |
| A night garden | Living Garden habitat trail `#living` · dusk notes, away from the screen · Plant investigation `#living/plants` |
| The Willowbank Gazette | Puppet Notice Printer `#loft/printer` · Messages for a Reader `#post/messages` · Water Evidence Shelf `#science/evidence` |
| A sky-watching night | Sky notes `#almanac/sky`, for both Moon jobs: it records the Moon's shape night after night, which the script's Field Notebook and My Count Collection cannot |
| A travelling show | Story Loft `#loft` · Equal Groups `#post/groups` · the welcome, away from the screen (said out loud; spec 277's rule that a child's own writing is spoken or on paper) |
| A new courier route | Cartographer's Table `#workshop/maps` (the script's Map Reader Dispatcher is its clue-card view) · Same Route, Different Scale `#workshop/scale` |
| The Sponge, again | Living Garden habitat trail `#living` · My Count Collection `#living/collection` · the flood post, away from the screen |

- **Accessibility.**
  - The scene is an `svg role="img"` with a description and a caption.
  - Targets are 44 px and text is 16 px, with visible focus.
  - Read-aloud captures the visible prose when Hear is pressed, as in Act IV. Focus moves to the choice after choosing.
  - Checks run at 320 and 820.

## Upstream study and curriculum place

**Jane**, refreshed at `c681f6bf2f2adf2aa032f765983a4691774cfba5`, is studied only, as in 352 and 601–603: a quest hub with several open quests. Unlike Jane, no path is locked or ranked. Switching costs nothing. No Jane code, prose or assets are used.

**Marble**, refreshed at `04962c78ccb8bd52b236512d3362405bace98d2a`. The repository pin `96a7933754af672e1bfdbf7ecb05c325860c6e0d` is unchanged. Nothing here is mapped or claimed. Each linked activity owns its own declarations, and the hub only links to them. Strands come from `curriculum/six-act-topic-plan.csv` ([six-act strands](../six-act-strands.md)). Act V's project steps are spec 49 §5's project cycle across strands, with no single topic.

**Spec 49.** Act V, a question of your own. §5's project steps are shown as the steps, but only *Choose* is interactive in this slice. The other five steps are named, not tracked. No free text is read or stored.

**Spec 120.** This slice covers:
- §6, Act V and its "Ending opens when" line (not built here);
- page 5, *For the next Keeper*;
- §12: the project page is an unbuilt dependency, so the ending waits for it.

The two Keeper's notes drop the script's editorial parentheticals, *(check: …)*. They are instructions to writers, not child-facing text. The statements they qualify make no claim about a particular flower or a Marble topic.

All new prose and the illustration are original project material.

## Gates and acceptance

Before build: an independent spec review of this spec and its companion.

**Pure checks** (`test/act-five-checks.mjs`, with fixtures from the real Act IV APIs):
- **Routes.** Page 5, the hub and six path routes resolve. An unknown segment falls back to the hub, and Act IV routes are not Act V's.
- **Before the ending.** Nothing is offered or written.
- **After the ending.** The invitation appears under the Act IV ending and on the Keeper's Pages. Reads and renders write nothing. A refused export writes nothing.
- **Starting.** The start writes `{started:true}` and the page scene, leaves Act IV unchanged, and a repeat is a no-op.
- **Page 5.** It has the described scene, the heading, the edge word and the guide line.
- **The hub.** It links all six paths, shows the six steps, names the guide and leaves no placeholder.
- **Path pages.** Jobs no activity can do are marked away from the screen with no link, and both Moon jobs go to Sky notes. The courier falls back to *the courier*.
- **Choosing.**
  - An unknown path is refused, and so is a refused export.
  - Choosing writes one code, and repeating the choice is a no-op.
  - Switching changes only the path.
  - The hub marks the chosen path, and Notes name it.
- **Saved shapes.**
  - A future path code reads as no path and is not rewritten.
  - A malformed path is unreadable and cannot be overwritten. A malformed act is unreadable.
  - Act V cannot start without the Act IV ending.
- **Text tracing.** Every content string appears in act-5.md, the 120 companion or this companion.

**Browser journey** (`test/act-five-browser.py`), at 820 and 320:
- Continue the story, under the Act IV ending, starts the act and opens Page 5. It writes the right story fields and leaves Act IV unchanged.
- The scene is described, with the heading on the first page inside the picture, and the guide line names the guide.
- The hub has six paths and six steps.
- Every linked job opens a page with that activity's title. Hear speaks the visible prose. The frame controls work with only Act V readable.
- A path page links its jobs and the Question Bench. Choosing keeps a code, moves focus, touches only the story and survives a reload. Switching keeps one path.
- The Keeper's Pages link to Act V. Targets are 44 px and nothing overflows.
- Motion is finite and settles within five seconds. Reduced motion shows the page still and finished.

Existing suites still pass. Physical iPad, Safari, VoiceOver and learning effects remain unqualified. An exact-head implementation review and the repository's landing procedure follow.
