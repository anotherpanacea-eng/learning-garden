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

The registry covers every `#place/room` link on these place pages: Café, Water Lab, Workshop, Post Office, Number Garden, Word Garden, Keeper's Desk, Living Garden, Story Loft, Cloud Orchard, Field Kit, Keeper's Pages, Travelers' Archive and Choose a starting point. Links that open another place page (for example `#activities/fractions`, `#pathways/math` or `#wonder/...`) and the orchard's per-fruit gathering links are not rooms, and the registry leaves them out.

A browser check visits each listed place page and fails if a room link there is missing from the registry or has no date. This check is how a newly built room gets its New marker: without it, the next room would silently miss the signal this spec exists for.

## What "new for you" means

Each explorer's notebook gains one additive object:

```js
rooms:{opened:{'#workshop/design':'2026-11-01', ...}, since:'2026-10-31', lastDay:'2026-11-01'}
```

All dates are local calendar dates, `YYYY-MM-DD`.

- **Opening.** When a registry route renders for the active explorer (not while the explorer picker is showing), `opened[route]` is set to today if it is absent. The notebook is saved only when this record actually changes.
- **Visits.** On the first render of a new local day, `since` becomes the previous `lastDay` and `lastDay` becomes today. So `since` is the day of the explorer's previous visit, and it stays fixed for the rest of the day.
- **First use.** A notebook with no `rooms` object starts with `since` set three days before today and `lastDay` set to today, with nothing opened. Three days is short enough that an explorer who has used the app all week sees a handful of rooms, not all of them.
- **New for you.** A room is new for this explorer when `added >= since` and the explorer has not opened it.
- **Restore.** A `rooms` value that is not this shape (non-object, an unknown route key, a malformed date, `since` after `lastDay`) is replaced with a fresh first-use object, and the rest of the notebook is kept unchanged. Routes in `opened` that are no longer in the registry are kept as written, because they might return. Downloads and restores carry the object like any other notebook key.

Grown-up notes show nothing new. The record is about which links to highlight, not about learning.

## Presentation

**Home shelf.** When at least one room is new for this explorer, the home page shows a "New for you" shelf between the welcome header and the "Ways to explore" switch. It lists the newest new rooms, newest first, at most four, each as a card with the room title and its first place name ("in the Workshop"). With no new rooms there is no shelf and no empty-state text. A room leaves the shelf once it is opened. When more than four rooms are new, the shelf has one more link, "See all new rooms", which opens a plain list of every new room at `#new`.

**New marks.** On every page, each link to a room that is new for this explorer gets a small "New" mark inside the link: a filled dot in the accent colour followed by the word "New", plus screen-reader text so the link reads as "The Design Table, new". In the top bar, a place that links at least one new room gets the same dot (without the word) on its icon, and its accessible name gains ", something new inside". Marks are added after each render by one function in the app shell, so no activity module changes. There is no animation, and reduced motion changes nothing.

**Workshop shelves.** The 22 "Other tables" links become three labelled groups, in this order:

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
  - the opened, visit and first-use rules, including a day rollover and an explorer switch;
  - restore of malformed `rooms` values without touching other notebook keys;
  - shelf ordering and the four-room limit;
  - Workshop grouping, where every current table is in exactly one group and links are unchanged.
- A browser suite, `test/new-for-you-browser.py`, runs against the real app at tablet and phone widths. It checks that:
  - a fresh explorer sees the shelf;
  - opening a shelf room removes it from the shelf and removes its marks;
  - top-bar dots follow;
  - the place-page registry check passes;
  - a second explorer on the same device keeps their own record.
- The existing home-entry suites still pass, and `node scripts/run-checks.mjs` passes.
