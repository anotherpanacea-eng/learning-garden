# 279 · Route registry for the app host

Commissioned 2026-10-26 by the owner after the [outside review triage](../reviews/2026-10-26-outside-review-fixes.md). This is a maintenance spec. It changes how `dist/app.mjs` finds and runs a route. It changes no route, screen, text, save record or learning content.

## Problem

`dist/app.mjs` is 816 lines. Its `render()` (lines 281–525 at `b441107`) does four jobs in one function:

1. Fifteen `if(… ||choosingExplorer)reset…()` lines reset every bench's in-memory visit on each render.
2. Eight early-return blocks (`#science/water-shares`, `#post/descriptions`, `#post/codes`, `#begin`, `pathways`/`learn`, `#cafe/units`, `#loft/shadows`, `#workshop/scale`) each copy the explorer chip, guide link, nav highlight, chooser branch and binders. Two copies had drifted before PR186: the guide link was missing on two routes, and one route let the chooser fall through to the host normalizers.
3. A long `if/else` chain picks the page HTML for every other route.
4. Two 39-term `!choosingExplorer&&!pileBench&&…` guards decide where shared invitation panels appear.

`bind()` (line 589) then calls 71 different `bind*()` functions on every render, whatever the route. `needsExplorerInitialization` (line 156) keeps its own list of routes that must skip normalization, and `useExplorer` keeps another. Because importing `app.mjs` touches the DOM, 35 test files read it as text and slice functions out with `indexOf` or regexes.

Every new early-return route repeats the pattern, so the same class of bug keeps coming back.

## What the registry is

One table in a new side-effect-free module, `dist/routes.mjs`. Each entry describes one route or route family:

| Field | Meaning |
| --- | --- |
| `match(hash, parts)` | True when this entry owns the route. Entries are tried in order; the first match wins. Exact hashes come before prefix families. |
| `nav` | The header nav item marked `aria-current`, such as `'#post'`. |
| `independent` | True for routes that must never run `initializeExplorerState` or the host `ensure*` normalizers. Replaces the hash lists in `needsExplorerInitialization` and `useExplorer`. |
| `page(ctx)` | Returns the page HTML. Pure apart from the reads it already does. |
| `bind(ctx)` | Binds only this route's controls. |
| `reset()` | Optional. Clears this route's in-memory visit when the learner leaves it or opens the explorer chooser. |
| `shared` | Optional. Which shared panels (invitations, connections, seed offer) the route shows. Replaces the two 39-term guards. |

`ctx` carries what binders already receive: `state`, `save`, `render`, `focus`, `canExport`, `explorerId`, `isActive`, `navigate`.

The host keeps everything that is not per-route: the explorer chip, the guide link, the chooser, the storage notice, `offerHowto`, speech binding, `hashchange` guards and film playback. It does this once, for every route.

## Host rules the registry must keep

These are the behaviors tests already protect. A step that breaks one is wrong.

- **Chooser:** when the explorer chooser is open, every route shows the chooser, binds only `bindExplorers`, and runs no route binder. An independent route still skips normalization while the chooser is open.
- **Leaving a route:** an entry's `reset()` runs when the hash leaves it or the chooser opens, exactly as the current reset lines do.
- **Independent routes:** never call `initializeExplorerState` or `ensure*` on render. They do their own exposure checks before any save, as now.
- **Header:** every route fills the explorer chip, the guide link (from the saved guide id, falling back to the first guide) and the nav highlight.
- **Saves and exposures:** the refactor adds no new writes. Preserve each route’s existing display/preflight checks and any conditional save of newly revealed teaching, support or fact exposures; entering through `render()` must not suppress those records. Page HTML, previews and notes remain read-only where they are read-only now. Frozen sources, kept copies and unreadable records stay untouched.
- **URLs:** every current hash keeps working. No route is renamed or removed.

## Steps

Each step is one PR. Each must leave all `test/*checks*.mjs` suites and the browser journeys for the routes it touches passing.

1. **Header helper.** One `routeHeader(nav)` function replaces the eight copied chip, guide-link and nav blocks. No other change. This is also maintenance item M3 in the roadmap.
2. **Host core.** Extract the host helpers (`notesReport`, `exposeStoryFacts`, `endingFilm`, route matching) into `dist/host-core.mjs` only after making their dependencies explicit. `notesReport` needs the notebook, explorer metadata and time it uses; `endingFilm` needs the route and story/garden state it reads. `exposeStoryFacts` intentionally mutates its notebook target: require that target explicitly and preserve its return value, normalization option and pending-Bramble qualification. It is not a pure function. Keep small host wrappers where needed rather than silently changing which state is read or written. The module has no top-level DOM access. Tests that slice these helpers out of `app.mjs` as text switch to importing them. Do not keep a text-slicing test for a helper that can now be imported.
3. **Early-return routes into the table.** Move the eight early-return routes into `routes.mjs` with `independent` set where it applies. Delete `needsExplorerInitialization`'s hash list and `useExplorer`'s matching list once every entry carries the flag.
4. **The main chain, one place at a time.** Move the `if/else` branches into entries, one hub and its benches per PR (Post Office, Café, Number Garden, Workshop, Living Garden, Water Lab, the rest). The route's `bind` moves with it, so `bind()` stops calling that place's binders on other routes.
5. **Shared panels.** Replace the two 39-term guards with each entry's `shared` field, once every route is an entry.

Steps 1 and 2 are independent. Step 3 needs step 1. Steps 4 and 5 need step 3.

## Tests

- Each step proves it changed no behavior with the existing browser journeys for the routes it moves. If a moved route has no browser journey covering direct load, chooser open and cancel, and one ordinary action, add one in that step.
- Add one check over the table itself: every hash linked from `dist/` resolves to exactly one entry, and the first-match order has no entry that can never win.
- Do not add tests that compare the table to a hand-written copy of itself.

## Not in scope

- Route-based dynamic `import()` and CSS bundling. The registry makes them easy later; they wait for a measured slow cold load on an iPad, as the triage recommended.
- A lighter `canExport` preflight.
- Any change to screens, text, routes, saves, the learning atlas or the six acts. This spec places no activity in the six acts of spec 49 and changes none of them.
- A bundler or build step. `dist/` stays directly servable.

## Upstream check

This is host plumbing, not a learning capability, so there is no Marble topic to study. Jane was checked on 2026-10-26: its client (`public/app.js`, 585 lines) switches among a few tabs by clicking them from `location.hash` checks and has no route table to reuse. It bundles with esbuild, which this app avoids on purpose. Nothing from Jane is incorporated.
