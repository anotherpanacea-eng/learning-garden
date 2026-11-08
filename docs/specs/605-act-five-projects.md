# 605 · A Question of Our Own: the Act V project page and ending

Proposed 2026-11-08 by Claude (OCA seat). Base inspected: `bd449314`, the head of [604](604-act-five-opening.md)'s branch, on which this is stacked. **Specification and a bounded build, not release clearance.** New finite text is in [the 605 companion](../content/605-act-five-projects-text.md). The Show lines, limit cards and ending text are copied unchanged from the reviewed [act-5.md](../content/120-story/act-5.md). Numbered 605, outside the range Codex uses.

**Commission.** As 604, from the owner on 2026-11-07 and 08. 604 explicitly left the project page and the ending out of scope. 120 §12 names the project page as Act V's unbuilt dependency, and this slice builds it, which lets the act end. Roadmap lane B (LG-G2).

## Purpose and boundary

Each chosen path gets its project, worked through spec 49's steps as act-5.md lays them out:
- **Choose** comes from 604.
- **Ask** stays a guide line with the Question Bench link (604). Nothing about it is stored, because the child's question is spoken or on paper ([277](277-for-the-next-keeper.md)'s rule).
- **Make.** The explorer says a first version is made (*I've made a first version*). Jobs mix on-screen and off-screen work, so the story takes the explorer's word, and never checks or scores the work.
- **Show.** The path's Show line from the script appears once a first version is made.
- **Change.** *We changed one thing* or *We kept it as it was*. No reason is typed.
- **Keep.** One of the path's three Sprout limit cards from the script. No sentence is typed, so Seedling uses the cards too.

A complete project (made, a change choice, a limit) shows **Your project page** and **Bind it into the Keeper's Pages**. Binding ends Act V. It writes `ended`, the bound path and the season, and opens the ending, *A Question of Our Own*, at `#almanac/question-of-our-own`:
- an animated binding scene: a new page slides in behind *For the next Keeper* and stitches run down the spine, with a season mark in the corner;
- the ending at both frame amounts;
- the season line, and the almanac line naming the project and its limit;
- the between-acts line.

**Out of scope**, each a separate commission:
- Act VI and anything that reads the bound project.
- Big or small project sizes.
- Typed Seedling sentences or Sapling and Keeper's Desk writing.
- Offered artifacts from job hosts as Make evidence.
- Two projects bound at once.

Making, choosing and binding are story progress, not curriculum milestones or learning measures.

## State

`story.acts.V` gains these fields:
- **`projects`.** A map from path code to `{made:true, change, limit}`. Each field appears only once its step is done, and every value is a code.
- **`ended`, `kept` and `season`**, written once by binding.

**Reading (by shape, never against today's lists).**
- `projects` must be an object.
- Each record must be an object with `made` true if present and `change` and `limit` as codes if present. Anything else is unreadable and cannot be written.
- A well-formed change or limit code that today's lists don't know still counts as chosen, because it was stated. The UI names it as being from an earlier version.
- A `kept` path that today's list doesn't know is named plainly on the ending.
- `ended` without `started` is not an ending, as in 352.

**Writes.** All writes go through 604's atomic step: a refusal writes nothing, and a repeat of the same value is a no-op.
- **Project steps:** only on the chosen path and in order (Make, then Change, then Keep). A limit must be one of that path's three cards.
- **Choices can change** until binding.
- **Switching paths** keeps each project exactly as it was.
- **Binding:** needs a complete project. It never replaces a saved season.
- **After binding,** every project and path write is refused, and the pages become a record.

## Presentation

- **Content.** `act-five-content.mjs` gains each path's Show line and limit cards, plus `project` and `ending` blocks.
- **Core.** `act-five-core.mjs` gains the project view, the three step writes, `canEndActFive` and `endActFive`.
- **UI.** `act-five-ui.mjs` renders the project on the chosen path's page, and a note on another path's page that its project is kept. It also renders the ending page and route, the hub's link to reread the ending, and the Notes line.
- **Art.** `act-five-art.mjs` adds `bindingScene`. The season mark is a geranium, a long evening, a pressed leaf or a café fire, after the script's season lines.
- **Accessibility.**
  - Radio groups have legends, and targets are 44 px.
  - Focus moves to the next step after each one.
  - Read-aloud covers visible prose only.
  - The scene is an `svg role="img"` with a description and a caption.

## Upstream study and curriculum place

**Jane**, refreshed at `c681f6bf2f2adf2aa032f765983a4691774cfba5`, is studied only, as in 604: a quest that ends in a reward. This act ends with an honest limit instead of a medal. No Jane code, prose or assets are used.

**Marble**, refreshed at `04962c78ccb8bd52b236512d3362405bace98d2a`. The repository pin `96a7933754af672e1bfdbf7ecb05c325860c6e0d` is unchanged. Nothing here is mapped or claimed. The project steps are spec 49 §5's cycle across strands ([six-act strands](../six-act-strands.md)), and the linked activities own their declarations.

**Spec 49.** Act V's purpose is to "originate a worthwhile project". Its steps are an intention, a knowledge gap, a first version, an audience response, revision and an honest limit. The familiar games become tools for a purpose the learner helped set. No free text is read or stored.

**Spec 120.** This slice covers:
- §6, Act V's ending condition: "One project is kept with a stated limit, in any project path";
- the ending, *A Question of Our Own*, with its before-version and one stated limit. "A small project is a whole ending";
- §12's dependency, now built.

All new prose and the illustration are original project material.

## Gates and acceptance

Before build: an independent spec review of this spec and its companion.

**Pure checks** (`test/act-five-projects-checks.mjs`, with fixtures from the real Act IV and V APIs):
- **Codes.** The limit codes match the text.
- **Order.** There is no project before a path is chosen. Make comes first and the Show line waits.
- **Refusals.** These all write nothing:
  - out-of-order steps;
  - another path's project;
  - an unknown change;
  - another path's limit card or an unknown card;
  - a refused export.
- **Writes.** Each step writes a code, repeats are no-ops, and Act IV is untouched.
- **Before binding.** The project page shows the limit and the bind button. Choices can change. Switching keeps the project.
- **Binding.**
  - Only a complete project can be bound. A refused bind and an impossible month write nothing, and the ending waits for a bind.
  - Binding writes `ended`, `kept`, the season and the scene. A repeat keeps the season.
  - A second bind, a new path or a project edit afterwards is refused.
- **The ending.** It has the described scene in its season, the season and almanac lines, and the ending text. The hub links it, the project page becomes a record, and Notes say so.
- **Saved shapes.**
  - A future limit code counts and is named plainly.
  - Four malformed shapes are unreadable and unchanged.
  - A saved season is never replaced.
  - A future `kept` path is named plainly.
  - `ended` without `started` is not an ending.

**`test/act-five-checks.mjs`.** Every content string, 605's included, traces to act-5.md, the 120 companion, or the 604 or 605 companion.

**Browser journey** (`test/act-five-projects-browser.py`), at 820 and 320:
- Make, the Show line, Change and Keep each write codes, and focus moves forward. The project page shows the limit and survives a reload.
- Binding ends the act with a season and leaves Act IV unchanged.
- The almanac line names the project and its limit, the picture wears its season, and afterwards the project is a record.
- The winter ending works at 320.
- Targets are 44 px and nothing overflows.
- Motion is finite and settles within five seconds; reduced motion shows the page bound.

Existing suites still pass. Physical iPad, Safari, VoiceOver and learning effects remain unqualified. An exact-head implementation review and the repository's landing procedure follow.
