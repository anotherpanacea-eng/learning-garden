# 116. Field Guide Almanac: look outside, come back tomorrow

Status: **proposed; awaiting independent spec review and a science-content check.** Part of the [new kinds of play proposal](../new-game-kinds.md). Adopts the weather log proposed in [spec 33](33-rebuilding-the-town.md) and hosts the Keeper's Pages from [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127). Every child-facing line is in [the companion text](../content/116-field-guide-almanac-text.md); this spec holds the model and rules. Code and art are for the implementation pass.

## Purpose

Every destination today is finished in one sitting. The almanac is the first that grows across **real days**: the child looks at the real sky, weather and minibeasts outside, notes what they saw, and later counts, sorts and graphs it. Dot keeps the book.

Four pages belong to this spec:

1. **Weather.** One note per day of what the sky is doing.
2. **Sky.** One note per night of the moon's shape.
3. **Garden neighbors.** A yes/no key for minibeasts found outdoors, and a card for each find.
4. **Data desk.** A tally, a pictogram and a bar graph built from the child's own log.

Everything is a report by the explorer or their grown-up. The game never checks a report against the real world, never fetches weather and never asks for a location.

## Place and story

`#almanac`, linked from Home as **Dot's Field Guide**. When spec 33's town exists, its almanac link opens this page. This increment ships its four pages and their tab bar. Future adapters may add spec 33's Town, Garden, Café, Words and Thinking stickers and spec 120's **Keeper's Pages**. Those adapters and story/calendar scenes are owned by their specs and are not prerequisites or acceptance requirements for this Field Guide increment. Weather pictures needed by spec 117 are reusable assets, not a dependency on a story adapter.

In spec 120, Hollis kept Willowbank's flood records and the reveal is that the explorer has been keeping the record too. The weather and sky notes are that record. This spec does not count them toward any act; spec 120 decides what a story contribution is. Two of spec 120's calendar moments read from this spec's data:

- **Storm Day** (each explorer's first-visit anniversary) shows a one-page comparison of this year's weather log against last year's, built from the Data desk's month graphs.
- **Lantern Night** (winter) reads the almanac aloud; the Weather and Sky pages supply one line each (in the companion text).

The almanac opens in Act I and deepens with the acts: noticing in Act I, keeping records and graphing them in Act II (spec 120 names S7-II local records as Act II's), weather versus climate in Act III, and in Act IV the moon table's disagreement with a child's note is a small lesson in evidence. Act V's sky-watching night and night garden can start from the Sky page. All pages are open from the start.

## 1. Weather

Once per calendar date on the device, the page asks what the weather is doing, after asking the child to look outside first. Five codes, kept from spec 33: `sun`, `clouds`, `rain`, `wind`, `snow`. One per day; when two apply, the child picks the one that stands out most. The child may change **today's** note; earlier dates are read-only. A missed day stays blank and is never nagged about.

**Optional temperature**, typed by a grown-up from a thermometer, with a unit choice of °C or °F and no default. Stored as reported and labeled as reported. Readings outside −60 to 60 °C or −76 to 140 °F are refused. The game never converts units, and no graph mixes them.

**Season line** from the device month and an explicit northern/southern setting (default northern; the story's valley is northern). Reuse spec 33's hemisphere setting if present; otherwise this increment supplies the local setting, with the future adapter sharing it rather than maintaining two conflicting values. The line has three rotating noticing prompts per season. The prompts are talk invitations and record nothing. They stay descriptive and never explain why seasons happen.

## 2. Sky

Once per calendar date, the child picks the moon shape that looks most like what they saw, from seven shapes or **I couldn't see the moon**. Codes: `thin-growing`, `half-growing`, `fat-growing`, `full`, `fat-shrinking`, `half-shrinking`, `thin-shrinking`, `not-seen`. In the southern setting, pictures and wording swap left and right. Pictures show the lit shape only, never a face. A safety line about never looking at the sun is always shown.

The page shows the month as a strip of days with each noted shape drawn small.

**Explanations.** For Sprout and Seedling, three observational panels: it's the same moon; at new moon it's still there; the pattern repeats in about 29 and a half days. They never explain the cause and never show a shadow. For Sapling only, **Why it changes shape** shows a view from above (moon half-lit at eight places around Earth) beside the matching sky views, explains the lit half, and says plainly that the dark part is not Earth's shadow and that a lunar eclipse is a different, rarer event.

**The moon table** (Sapling page). For each date the child logged, the page shows the shape calculated for that night beside the child's own note, labeled as calculated and usually right to within a day. The child's note is never changed, flagged or hidden. The table and the prediction are computed when opened and never stored.

The model, fixed so that every build gives the same answer:

| Part | Rule |
| --- | --- |
| Epoch | The new moon of 2000-01-06 18:14 UTC. |
| Cycle | The mean synodic month, 29.530588853 days. No other correction. |
| Time of day | 21:00 device-local time on the logged calendar date, converted to UTC with the device's offset for that date. The game stores no time zone and no location. |
| Date domain | 2000-01-01 to 2099-12-31. Outside it, the page says *The table only covers 2000 to 2099* and shows no comparison. |
| Age | Days since the epoch at that moment, modulo the cycle. The phase fraction is age ÷ cycle, from 0 up to 1. |
| Bins | Eight equal bins centered on the eight principal shapes: bin = floor(fraction × 8 + 0.5) mod 8, giving 0 `new`, 1 `thin-growing`, 2 `half-growing`, 3 `fat-growing`, 4 `full`, 5 `fat-shrinking`, 6 `half-shrinking`, 7 `thin-shrinking`. `new` is a table value only; the child's choices stay the seven shapes and `not-seen`. |
| Distance | Circular steps between bins: the smaller of the two ways round the eight. `thin-shrinking` and `thin-growing` are two steps apart through `new`. |
| Hemisphere | The bins are the same in both settings; only the pictures and left/right wording swap, as for the log. |

**Prediction** (optional; offered only when the child logs `half-growing` **and** the table's bin for that night is also `half-growing`; otherwise the note is kept and no prediction is offered): the child picks a number of days from 1 to 14 until the moon looks full. The table's answer is round((0.5 − fraction) × cycle) days for that logged night, which for a growing half is always 5 to 9 days, and the page names the date that many days on. The child's number is shown beside it and is not saved, scored or marked.

**Accuracy, checked for this spec** with a full ephemeris (PyEphem, Sun-Moon elongation) on 20,000 random dates from 2000 to 2099 at 21:00 local in five time zones from UTC−8 to UTC+10: the calculated age was never more than 0.97 days from the true one (median 0.34, 99th percentile 0.90), so "usually right to within a day" is honest and conservative. The table's bin matched the true bin on about 9 nights in 10 (18,097 of 20,000) and was never more than one step off. On 5,000 `half-growing` nights, the predicted full-moon date was the true local date in 71%, one day early in 24% and one day late in 5%, which is why the copy says *around* that date.

**Reference dates** (UTC, so time-zone offset 0; the table's bin at 21:00 on that date). Each published phase instant comes from the same ephemeris and should be rechecked against a published phase table at science review:

| Date | Published phase (UTC) | Table bin | Table age (days) |
| --- | --- | --- | --- |
| 2000-01-06 | New moon 18:13 | `new` | 0.12 |
| 2010-06-19 | First quarter 04:29 | `half-growing` | 7.67 |
| 2020-03-09 | Full moon 17:47 | `full` | 15.00 |
| 2024-04-02 | Last quarter 03:14 | `half-shrinking` | 23.47 |
| 2025-09-21 | New moon 19:54 | `new` | 28.92 |
| 2026-01-26 | First quarter 04:47 | `half-growing` | 8.27 |
| 2026-10-26 | Full moon 04:11 | `full` | 15.49 |
| 2030-07-22 | Last quarter 08:07 | `half-shrinking` | 22.08 |
| 2040-11-04 | New moon 18:55 | `new` | 0.17 |
| 2060-02-08 | First quarter 21:41 | `half-growing` | 6.89 |
| 2080-08-30 | Full moon 10:40 | `full` | 15.12 |
| 2099-11-05 | Last quarter 19:41 | `half-shrinking` | 22.37 |

**Does it feel like a correction?** The copy is written so that it doesn't: the child's note always comes first, the table is introduced as a calculation that can be a day off, a one-step difference is explained by shapes near a change being hard to tell apart, and a bigger difference is framed as two questions to wonder about with no answer stored. Science review should still read it with this question in mind.

## 3. Garden neighbors

A field-guide key for minibeasts found **outside**, with a grown-up. No camera, no photos, no location. An opening card says what a minibeast is; a care card (look, don't touch; ask before lifting stones; put things back) is always shown before the key.

**The key** has fourteen two-way questions about visible features, one per screen, each answer with a lifelike picture, and **Go back** at every step. It reaches fifteen groups: snail, slug, earthworm, woodlouse, millipede, centipede, spider, harvestman, ladybug, beetle, butterfly or moth, bee or wasp, fly, ant, caterpillar. **I can't tell** at any step explains why that feature is hard to see and offers Go back or finish as **something else**, with an optional local label in the child's own words. There is no picture gallery to match against, because a key identifies by questions about features.

**Adding a find** records the date, the group and where it was, from seven places. The guide shows one card per group with its fact, a look-for line, the number of finds and the first date. A group not yet found shows a grey outline. A find records that the explorer used the key and chose this group; the card says "You identified it as…", never that the identification is right.

**Build a key** (Sapling page, after the key has been used once): four group cards and a list of candidate questions, some that split the set and some that don't (vague, no clear answer, or clear but sending every card the same way). The child adds a question at any ending that still holds two or more cards, recursively, until each ending has one. With four cards, at most three useful question nodes are needed. The page shows where each card lands, points out any unresolved ending, and permits changing a node or making a second working tree. The companion supplies two complete three-node examples. The saved work retains each node's question and its yes/no branches, not just an unordered question list.

## 4. Data desk

Choose a month from the weather log. With fewer than five readable entries, the desk offers **Dot's practice month** instead, labeled as made up. Starting a Data desk sheet freezes a source of at most 31 dated reports (including reported temperatures), the category codes and their display labels, practice/source version and chosen month. Each sheet has an independent stable ID; a second sheet for the same month is a new sheet, never a replacement. Resume uses this snapshot even if today's note, the practice month or category wording later changes.

Keep tally counts, pictogram scale and half-picture counts, bar counts and axis scale with the sheet. At scale 1 each day is two half-pictures; at scale 2 each day is one half-picture. Add/remove one whole picture at scale 1 and one half-picture at scale 2, so every count from 0 to 31 is representable. Scale choices survive resume. Bar axes may count in twos, but bars can still move by one day so odd totals are representable. A kept sheet and any recorded check facts are frozen; revising it creates a new sheet. There are at most 24 sheets; at capacity, retain all work and offer export or explicit deletion before creating another.

1. **Tally.** Days appear one at a time; the child taps a row to add a mark; marks group in fives (four strokes and a crossing stroke). **Back** undoes the last mark. At the end, a row that differs from the log is named and can be recounted. A finished tally is stored as built.
2. **Pictogram.** The key comes first and stays on screen. One picture per day, equal in size and aligned to a baseline. The child adds or removes pictures per row until it matches the tally. Sapling option: each picture stands for two days, previewed with a question before building; odd counts use a half picture with its own key line.
3. **Bar graph.** The child raises each bar with + and − to the tally's count, counting in ones (Sapling option: twos).
4. **Questions** about the child's own graph: most, least, how many more, how many altogether. Answers are revealed from the graph.

The desk never says a tally is wrong; it names the row that differs.

**Comparing months** (Sapling page): two logged months side by side on one scale, a weather-and-climate Details panel, and **Which timescale?**, a sort of five statements into Weather or Climate. **Temperature**, when a month has five or more readings in one unit: dots in date order joined by a line, with the warmest and coolest marked and their difference named.

## Off-screen invitations

Four, in the companion text. Nothing is recorded.

## Saved work

Per explorer, each root is absent until its first explicit choice, note or constructed sheet. The local hemisphere setting is optional (`north | south`) and writes only on explicit choice:

```
weather:  [ { date: 'YYYY-MM-DD', weather: code, temp?: { value, unit: 'C'|'F' } } ] // up to 400
sky:      [ { date, shape: code } ]                                                  // up to 400
finds:    [ { date, group: code, place: code, label?: string } ]                      // up to 500
dataDesk: [ { id, source: { month, practice, version, categories, days },
              tally: {code: n}, pictogram: { halfPictures: {code: n}, scale: 1|2 },
              bars: { counts: {code: n}, scale: 1|2 }, kept: bool, checks, at } ]      // up to 24 sheets
keyBuilds: [ { cards: [code], tree: node, at } ]                                      // up to 20
// node = { question: id, yes: node|{group: code}, no: node|{group: code} }
// up to 3 question nodes, 4 group leaves; unfinished branches may be null
```

- If spec 33 ships first, both specs read and write one `weather` array. Optional `temp` is additive; spec 33 ignores it.
- Validate dates, codes and bounded numbers in read-only views. An unknown code, malformed entry or missing temperature unit makes only that item/temperature unavailable to current displays; preserve the original JSON value unchanged and exportable. A new known group list never deletes a prior find.
- For `weather` and `sky`, display at most one readable entry per date, using the last readable entry in stored array order. Preserve every duplicate in raw storage. View/import does not deduplicate or rewrite. An explicit change to today's note changes only the selected readable entry, preserving other raw entries.
- All saves follow an explicit action and preflight the whole candidate using `dist/progress-limits.mjs` and the existing export-size limit before mutation. At an array/sheet capacity or export limit, refuse the addition with no data change; explain export/explicit deletion options. Never silently trim older or unreadable work. Labels are at most 120 characters, each sheet source at most 31 days and five categories, counts 0–31, half-picture counts 0–62, and each sheet retains at most eight frozen checks. At a check limit, refuse the new check without losing the sheet; keep editing available.
- Never check a find against today's key. A group code no longer in the key shows as a group from an older field guide.
- Data desk sheets retain their frozen source, scales, constructed counts and recorded outcomes. Checks compare with that sheet's own source, never today's log or rules, and never regrade recorded outcomes on load. Live month summaries may be computed separately and must be labeled as current summaries; future Storm Day adapters do not rewrite sheets.
- Notes export, import, reset and explorer switching include all of these. The hemisphere is a setting, never a location.

## Grown-up notes

One line and one Details panel, in the companion text.

## Curriculum fit

| Page | Strand families ([six-act strands](../six-act-strands.md)) |
| --- | --- |
| Weather | S7-I weather observations; S7-II local records and reported temperatures |
| Sky | S8-I sky observations; S8-II moon models (Sapling panel only) |
| Garden neighbors | S3-I local organisms; S3-II classification keys and observations |
| Data desk | M6-I sort, record, read; M6-II scaled pictograms and bars; S7-III weather versus climate |

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Record real observations over days; follow a two-way key; build and read a tally, pictogram and bar graph from one's own record; tell weather from climate. |
| Teaching encounter | The first weather and moon notes with their explanations; the first walk through the key; the practice month. |
| Contrast | Growing and shrinking moon; a key question that splits the set and one that doesn't; one picture per day and two days per picture; weather and climate statements. |
| Supported practice | I can't tell; Recount that row; the practice month. |
| New application | The child's own month; a second month; building a key for four new cards. |
| Purposeful revisit | Spanish errand 4 ([spec 117](117-spanish-river-market.md)) reuses the weather pictures; Storm Day compares a year; Rain Paths and the Field Notebook charts link to the desk. |
| Data boundary | Dates, codes, optional reported temperatures, optional free-text labels. No location, photo, name or health data. All local. |

## Upstream check

Refreshed 2026-10-23: Marble `f186a79a9525c189e2d423e31613c62b6805416f`, Jane `1927912b8d9cd4f7df6e7fbe8416521194743060`. Marble's `data/teaching-research.json` has records for each topic below; this spec follows their `learn` constraints, as Jane's review of that research recommends where fields disagree.

| Topic | What the research asks, and how this spec does it |
| --- | --- |
| Moon Phases (`mt_ByXgbTld6R`), Phases of the Moon (`mt_4V-vYhFUcm`) | Younger work observational with growing/shrinking names, no shadows, new moon still there, change is slow; older work shows orbit and sky views together and keeps phases apart from eclipses. Done as described in section 2. |
| Classification Keys (`mt_brgde1Vx0P`) | Two-way, observable questions that split the set; follow before building; identify by questions, not picture matching. Done in section 3. |
| Common minibeasts (`mt_yR1moI5kX1`) | Unloved creatures with calm, caring language; lifelike art with countable legs; bee, wasp and hoverfly confusion. The fly card names hoverflies; art direction below. |
| Local weather patterns (`mt_HZvTriQWTh`), Recording Data (`mt_ZFwPZaDJ0_`) | Real outdoor observation; children record the weather they wish for; categories fixed before collecting; read the record afterward. The look-first prompt, five fixed codes and desk questions. |
| Pictograms and tally charts (`mt_c29FaCTNsx`), Bar graphs (`mt_ChjMU2GDJa`) | Build charts from data the children tallied; read the key first; preview many-to-one keys; equal symbols on a baseline; gated fives; both read and build. Section 4. |
| Weather vs climate (`mt_Gm12BzcCfX`), Seasonal changes (`mt_go5i87u2b9`) | Make the timescale explicit; climate is more than temperature; never explain seasons by distance from the Sun. Which timescale?; the climate panel; descriptive season prompts. |

Jane's glossary convention (short definitions for *pictogram*, *tally*, *climate*, *minibeast*) and three-choice questions are design references. Its mastery, medals, bosses and quest schedule are not adopted. No upstream code or prose is copied.

### Hard-prerequisite crosswalk

[Spec 49 §8](49-six-act-curriculum.md#8-existing-plans-bounded-next-increment-and-delivery-order) asks each hard prerequisite in the pinned graph (`curriculum/marble/dependencies.json`) to have an earlier or same-unit lesson, explicit support or a documented exception:

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| Local weather patterns | Seasonal changes (`mt_go5i87u2b9`) | Same unit: season line and prompts, descriptive only. |
| Weather vs climate | Seasonal changes, age 8+ (`mt_NYsz6QgaaE`) | Partly: season prompts and month comparison. Supplied explanation; no topic claim until a seasons lesson exists. |
| Moon Phases | Sun, Moon & Stars (`mt_PiWZA8Z0ZJ`) | Partly: the same-moon and daytime-moon lines. Sun and stars not taught; documented gap. |
| Phases of the Moon | The solar system (`mt_5l7iGkf1Tp`), Earth & Space Vocabulary (`mt_LQt4vnKeB4`) | Not taught. The Sapling panel is a supplied explanation with no topic claim. |
| Classification Keys | Animal Classification Vocabulary (`mt_1J5fwxNDxL`), Grouping Living Things (`mt_AylKwhbDWM`) | Partly: group cards supply names and features; Body Clues covers the soft prerequisite Sorting and Identifying Minibeasts. Only "follow a key" is a candidate reference; Build a key claims nothing. |
| Common minibeasts | What is a minibeast? (`mt_BI6oGIO-xM`) | Same unit: the opening card. |
| Pictograms and tally charts | Age 6+ version (`mt_u5HkSxZECM`), Sorting into categories (`mt_xppl18avyY`) | Same unit: one picture per day; sorting days into five fixed categories. |
| Bar graphs | Representing numbers with objects, age 8+ (`mt_r8XnXwRA6g`), Pictograms age 6+ | Field Notebook's existing scoped reference; pictogram before bars. |
| Recording Data | Simple tests and experiments (`mt_Wa44s-f8Ws`) | Not met: the almanac records observations, not tests. No claim. |

**Art direction.** Minibeast pictures are lifelike illustrations with countable legs and visible body sections. Weather and moon pictures are simple and equal in size so pictogram rows line up.

## Checks for implementation

- One weather and one sky note per date; today editable, earlier dates read-only; a device clock change never rewrites an earlier entry.
- Hemisphere swaps the moon pictures, wording and season names.
- Every key path reaches a group or "something else"; Go back works at each step; the fourteen questions and fifteen endings match the companion text.
- Tally, pictogram and bars work from an empty log (practice month), a five-day log and a full month; half pictures appear only for odd counts at scale 2.
- The moon table gives exactly the bins and ages in the reference-date table above, and is within one step of a published phase table on all twelve dates.
- A `half-growing` note on a night whose table bin is not `half-growing` (for example 2024-04-02, table `half-shrinking`) offers no prediction and names no date.
- Distance is circular through `new`; dates outside 2000 to 2099 show the out-of-range line; nothing from the table or prediction is saved.
- Both authored three-node key trees separate all four cards, recursive edits preserve the branch structure, and an unfinished tree survives reload.
- A saved Data desk sheet survives today's observation changing, a practice-source edit, scale changes on a different sheet and a second sheet for the same month. Recorded outcomes are unchanged. Test 24 sheets and capacity/export refusal with the original state unchanged.
- Unknown codes, duplicated dates, a missing temperature unit and spec-33-only saves all load; readable items stay open and raw unavailable items/duplicates remain exportable without a load-time rewrite. The four pages work with no spec 33/120 adapter.
- Browser at 320 and 820 px: key answers at least 44 px; the month strip wraps without horizontal scrolling.

## Review follow-up, 2026-10-23

Made key-building recursive with saved branches; deferred calculated moon work (restored 2026-10-24 at Joshua's request, with the model fixed in section 2); separated future shared-tab/story adapters; specified frozen, bounded Data desk sheets and non-destructive observation views with capacity preflight. The fifteen-group field key and its facts remain a draft needing qualified science review; these repairs do not validate its biological classifications or any child identification. Independent implementation review and science-content clearance remain open.

## Review asks

- Science content: are the key questions, fifteen facts and moon wording accurate and fair for children? The companion flags the lines most worth checking.
- The moon table: recheck the twelve reference dates against a published phase table, and read the comparison copy for whether it feels like a correction.
