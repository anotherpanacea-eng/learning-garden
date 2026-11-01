# 358 · New for you: show what is new, and calm the Workshop list

Proposed 2026-11-01 on main `35f9341705c574cd8023ec55f8bc3a4a32fe2983`, under admitted LG-55. Fleet issue anotherpanacea-eng/fleet-coordination#1406. The spec and its build share one branch; Codex reviews this spec before the build starts.

## Purpose

The owner reports that players cannot tell when there is something new to try, and that pages feel busy. Both observations are true on current main:

- Every room in the app first shipped between 2026-10-18 and 2026-11-01, at several rooms a day. Each new room is hand-added to a fixed list of links on one or more place pages. Nothing marks a room as new, and nothing records which rooms an explorer has opened, so a room added this morning looks the same as one from last week.
- The Workshop shows 22 "Other tables" links as identical chips in no particular order, so the newest tables come last.

This spec adds one signal, "New for you", and regroups the Workshop list. It changes no activity, no saved activity work, no story state and no Grown-up notes content.

## Room registry

A new module, `dist/room-registry.mjs`, exports a frozen list of rooms:

```js
{route:'#workshop/design', title:'The Design Table', places:['#workshop'], added:'2026-10-31'}
```

- `route` is the exact hash a place page links to. Routes are unique.
- `title` is the link's visible text on the place page (one title even when several places link the room).
- `places` lists every place page whose own room list links the route.
- `added` is the date the route first shipped on main, taken once from git history (`git log --reverse -S'"<route>"' -- dist`). It is written as a literal date and is never computed at runtime.

The registry covers every `#place/room` link on these place pages: Café, Water Lab, Workshop, Post Office, Number Garden, Word Garden, Keeper's Desk, Living Garden, Story Loft, Cloud Orchard, Field Kit, Keeper's Pages, Travelers' Archive, Choose a starting point, and all four subject pages (`#pathways/math`, `#pathways/english`, `#pathways/science`, `#pathways/french`), which list different rooms. Links that open another place page (for example `#activities/fractions`, the `#pathways/...` pages themselves or `#wonder/...`) and the orchard's per-fruit gathering links are not rooms, and the registry leaves them out.

A browser check visits each listed page for a fresh explorer, collects its room links independently of the registry, and fails if one is missing from the registry or if the registry's `places` for it disagree. A room link that appears only after story progress (for example the Keeper's Pages link to `#workshop/old-map`) is covered when the same route is also linked from an always-visible place, as that one is. Story-gated room lists are not fixtures for this check. This check is how a newly built room gets its New marker: without it, the next room would silently miss the signal this spec exists for.

## What "new for you" means

Each explorer gets one small record, stored beside the notebook in its own key, `number-garden-v1:<explorer id>:rooms`:

```js
{explorer:'<profile createdAt>', opened:{'#workshop/design':'2026-11-01', ...}, since:'2026-10-31', lastDay:'2026-11-01'}
```

The record is not part of the notebook. Existing journeys require that entering a room leaves every notebook root unchanged, and this record changes on nearly every visit. (The first build put it in the notebook; thirteen existing browser suites caught it.) Because the key shares the notebook prefix, clearing every explorer or turning saving off removes it with the notebooks. While saving is off it lives in memory only. The app's other-tab conflict check watches only the registry and notebook keys, so writing this record never reads as another tab's change. `explorer` is the profile's `createdAt`, so an explorer id that is reused after a deletion starts fresh instead of inheriting an old record. Downloads do not carry it.

All dates are local calendar dates, `YYYY-MM-DD`.

- **Only the chosen explorer.** All bookkeeping below (first use, visits and opening) runs only on a render for the chosen explorer, never while the explorer picker is showing. The app loads the previous explorer's notebook before the picker appears, so updating there would move the wrong explorer's dates.
- **Opening.** When a registry route renders for the chosen explorer, `opened[route]` is set to today if it is absent. The record is written only when it actually changes.
- **Visits.** On the first render of a new local day, `since` becomes the previous `lastDay` and `lastDay` becomes today. So `since` is the day of the explorer's previous visit, and it stays fixed for the rest of the day.
- **First use.** An explorer with no record starts with `since` set three days before today and `lastDay` set to today, with nothing opened. Three days is short enough that an explorer who has used the app all week sees a handful of rooms, not all of them.
- **New for you.** A room is new for this explorer when `added >= since` and the explorer has not opened it.
- **Restore.** Restore checks the shape only, never registry membership. A record that is not this shape (unreadable JSON, a non-object, an `opened` key that is not a `#`-route string, a malformed or impossible date, `since` after `lastDay`, or another profile's `explorer`) is replaced with a fresh first-use record. Routes in `opened` that the current registry does not list (a removed room, or a record from a newer release) are kept as written, because they might return.

Grown-up notes show nothing new. The record is about which links to highlight, not about learning.

## Presentation

**Home shelf.** When at least one room is new for this explorer, the home page shows a "New for you" shelf directly below the "Ways to explore" switch, above the switch's panel. (The first draft put it above the switch. That pushed the three choices off the first phone screen, which the home-entry spec guarantees against.) It lists the newest new rooms, newest first, at most four, each as a card with the room title and its first place name ("in the Workshop"). With no new rooms there is no shelf and no empty-state text. A room leaves the shelf once it is opened. When more than four rooms are new, the shelf has one more link, "See all new rooms", which opens a plain list of every new room at `#new`.

**New marks.** On every page, each link to a room that is new for this explorer gets a small "New" mark inside the link: a filled dot in the accent color followed by the word "New", plus screen-reader text so the link reads as "The Design Table, new". In the top bar, a place that links at least one new room gets the same dot (without the word) on its icon, and its accessible name gains ", something new inside". Marks are added after each render by one function in the app shell, so no activity module changes. There is no animation, and reduced motion changes nothing.

**Workshop shelves.** The 22 "Other tables" links become three labeled groups, in this order:

- **Build and test:** Lift Yard, Mill Energy Book, Lantern Circuit Bench, Fair Test Bench, Hinge Bench, The Mending Shed, The Design Table, Balance Stall.
- **Measure, count and share:** Same Amount, New Cuts; Ribbon Recut Table; Ribbon Measures; Same ground, different fence; Copy Frame; Coin Counter; Gathering Budget; Repeat a Delivery Block; Preparation Clock.
- **Maps, sources and stories:** Cartographer's Table; Same route, different scale; Reading the old map; Follow the Source Trail; Two Windows story desk.

Within each group, links that are new for this explorer come first, then the rest in their current order. Link text, routes and the room pages are unchanged. Each group heading is plain text, not a control. The build PR may move a table between groups if its page shows it belongs elsewhere, and must say so.

## Out of scope

- Regrouping other long pages (Post Office, Number Garden, Keeper's Desk). They get New marks now; whether they need groups is a follow-up once the marks have been used.
- Reducing the home page's other menus.
- Any count, badge total, streak, reward or reminder. "New" is a pointer, not a goal.
- Server storage, accounts or anything that leaves the device.

## Verification

- A source suite, `test/new-for-you-checks.mjs`, covers:
  - registry shape, unique routes and literal dates;
  - the opened, visit and first-use rules, including a day rollover;
  - a shared device: explorer A last visits on Monday, B chooses themselves on Tuesday, and A returns on Wednesday with `since` still Monday;
  - restore of malformed `rooms` values without touching other notebook keys, and of unknown but well-formed routes, which are kept;
  - shelf ordering and the four-room limit;
  - Workshop grouping, where every current table is in exactly one group and links are unchanged.
- A browser suite, `test/new-for-you-browser.py`, runs against the real app at tablet and phone widths. It checks that:
  - a fresh explorer sees the shelf;
  - opening a shelf room removes it from the shelf and removes its marks;
  - top-bar dots follow;
  - the place-page registry check passes;
  - a second explorer on the same device keeps their own record.
- The existing home-entry suites still pass, and `node scripts/run-checks.mjs` passes.
