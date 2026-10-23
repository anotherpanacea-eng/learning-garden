# 116. Field Guide Almanac: look outside, come back tomorrow

Status: **proposed; awaiting independent spec review and a science-content check.** Part of the [new kinds of play proposal](../new-game-kinds.md). Adopts the weather log proposed in [spec 33](33-rebuilding-the-town.md) and hosts the Keeper's Pages from [spec 120](120-keeper-of-the-ways.md). Every child-facing line is in [the companion text](../content/116-field-guide-almanac-text.md); this spec holds the model and rules. Code and art are for the implementation pass.

## Purpose

Every destination today is finished in one sitting. The almanac is the first that grows across **real days**: the child looks at the real sky, weather and minibeasts outside, notes what they saw, and later counts, sorts and graphs it. Dot keeps the book.

Four pages belong to this spec:

1. **Weather.** One note per day of what the sky is doing.
2. **Sky.** One note per night of the moon's shape.
3. **Garden neighbors.** A yes/no key for minibeasts found outdoors, and a card for each find.
4. **Data desk.** A tally, a pictogram and a bar graph built from the child's own log.

Everything is a report by the explorer or their grown-up. The game never checks a report against the real world, never fetches weather and never asks for a location.

## Place and story

`#almanac`, linked from Home as **Dot's Field Guide**. When spec 33's town exists, its almanac link opens this page. Other specs add tabs here: spec 33's Town, Garden, Café, Words and Thinking stickers, and spec 120's **Keeper's Pages**. This spec owns only its four pages and the shared tab bar.

In spec 120, Hollis kept Willowbank's flood records and the reveal is that the explorer has been keeping the record too. The weather and sky notes are that record. This spec does not count them toward any act; spec 120 decides what a story contribution is. Two of spec 120's calendar moments read from this spec's data:

- **Storm Day** (each explorer's first-visit anniversary) shows a one-page comparison of this year's weather log against last year's, built from the Data desk's month graphs.
- **Lantern Night** (winter) reads the almanac aloud; the Weather and Sky pages supply one line each (in the companion text).

The almanac opens in Act I and deepens with the acts: noticing in Act I, keeping records and graphing them in Act II (spec 120 names S7-II local records as Act II's), weather versus climate in Act III, and in Act IV the moon table's disagreement with a child's note is a small lesson in evidence. Act V's sky-watching night and night garden can start from the Sky page. All pages are open from the start.

## 1. Weather

Once per calendar date on the device, the page asks what the weather is doing, after asking the child to look outside first. Five codes, kept from spec 33: `sun`, `clouds`, `rain`, `wind`, `snow`. One per day; when two apply, the child picks the one that stands out most. The child may change **today's** note; earlier dates are read-only. A missed day stays blank and is never nagged about.

**Optional temperature**, typed by a grown-up from a thermometer, with a unit choice of °C or °F and no default. Stored as reported and labeled as reported. Readings outside −60 to 60 °C or −76 to 140 °F are refused. The game never converts units, and no graph mixes them.

**Season line** from the device month and spec 33's hemisphere setting (default northern; the story's valley is northern), with three rotating noticing prompts per season. The prompts are talk invitations and record nothing. They stay descriptive and never explain why seasons happen.

## 2. Sky

Once per calendar date, the child picks the moon shape that looks most like what they saw, from seven shapes or **I couldn't see the moon**. Codes: `thin-growing`, `half-growing`, `fat-growing`, `full`, `fat-shrinking`, `half-shrinking`, `thin-shrinking`, `not-seen`. In the southern setting, pictures and wording swap left and right. Pictures show the lit shape only, never a face. A safety line about never looking at the sun is always shown.

The page shows the month as a strip of days with each noted shape drawn small.

**Explanations.** For Sprout and Seedling, three observational panels: it's the same moon; at new moon it's still there; the pattern repeats in about 29 and a half days. They never explain the cause and never show a shadow. For Sapling only, **Why it changes shape** shows a view from above (moon half-lit at eight places around Earth) beside the matching sky views, explains the lit half, and says plainly that the dark part is not Earth's shadow and that a lunar eclipse is a different, rarer event.

**The moon table** (Sapling page) shows, for each date the child logged, the phase calculated from an average 29.53-day cycle from a known new moon, labeled as calculated and usually right to within a day. A one-step difference and a larger one each get a message; the child's note is never changed, flagged or hidden. An optional prediction asks how many days until the next full moon after a growing half; the answer comes from the calculation.

## 3. Garden neighbors

A field-guide key for minibeasts found **outside**, with a grown-up. No camera, no photos, no location. An opening card says what a minibeast is; a care card (look, don't touch; ask before lifting stones; put things back) is always shown before the key.

**The key** has fourteen two-way questions about visible features, one per screen, each answer with a lifelike picture, and **Go back** at every step. It reaches fifteen groups: snail, slug, earthworm, woodlouse, millipede, centipede, spider, harvestman, ladybug, beetle, butterfly or moth, bee or wasp, fly, ant, caterpillar. **I can't tell** at any step explains why that feature is hard to see and offers Go back or finish as **something else**, with an optional local label in the child's own words. There is no picture gallery to match against, because a key identifies by questions about features.

**Adding a find** records the date, the group and where it was, from seven places. The guide shows one card per group with its fact, a look-for line, the number of finds and the first date. A group not yet found shows a grey outline. A find records that the explorer used the key and chose this group; the card says "You identified it as…", never that the identification is right.

**Build a key** (Sapling page, after the key has been used once): four group cards and a list of candidate questions, some that split the set and some that don't (vague, no clear answer, or clear but sending every card the same way). The child picks two; the page shows where each card lands, points out any ending with two cards, and says when the child finds a second working key.

## 4. Data desk

Choose a month from the weather log. With fewer than five entries, the desk offers **Dot's practice month** instead, labeled as made up.

1. **Tally.** Days appear one at a time; the child taps a row to add a mark; marks group in fives (four strokes and a crossing stroke). **Back** undoes the last mark. At the end, a row that differs from the log is named and can be recounted. A finished tally is stored as built.
2. **Pictogram.** The key comes first and stays on screen. One picture per day, equal in size and aligned to a baseline. The child adds or removes pictures per row until it matches the tally. Sapling option: each picture stands for two days, previewed with a question before building; odd counts use a half picture with its own key line.
3. **Bar graph.** The child raises each bar with + and − to the tally's count, counting in ones (Sapling option: twos).
4. **Questions** about the child's own graph: most, least, how many more, how many altogether. Answers are revealed from the graph.

The desk never says a tally is wrong; it names the row that differs.

**Comparing months** (Sapling page): two logged months side by side on one scale, a weather-and-climate Details panel, and **Which timescale?**, a sort of five statements into Weather or Climate. **Temperature**, when a month has five or more readings in one unit: dots in date order joined by a line, with the warmest and coolest marked and their difference named.

## Off-screen invitations

Four, in the companion text. Nothing is recorded.

## Saved work

Per explorer, absent until the first note:

```
weather:  [ { date: 'YYYY-MM-DD', weather: code, temp?: { value, unit: 'C'|'F' } } ]   // spec 33 shape plus optional temp; latest 400
sky:      [ { date, shape: code } ]                                                   // latest 400
finds:    [ { date, group: code, place: code, label?: string } ]                     // latest 500
dataDesk: { [ 'YYYY-MM' | 'practice' ]: { tally: {code: n}, pictogram: {code: n, scale}, bars: {code: n, scale}, at } }
moonPredictions: [ { madeOn, fromShape, days, at } ]                                 // latest 50
keyBuilds: [ { cards: [code], questions: [id], at } ]                                // latest 20
```

- If spec 33 ships first, both specs read and write one `weather` array. Optional `temp` is additive; spec 33 ignores it.
- Validate dates, codes and numbers only. Drop an entry with an unknown code or malformed date and keep the rest.
- One entry per date for `weather` and `sky`; a save with two for one date keeps the later.
- Never check a find against today's key. A group code no longer in the key shows as a group from an older field guide.
- The moon table, month graphs and Storm Day comparison are computed when opened and never stored.
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
- The moon table is within one step of a published phase table on at least twelve test dates.
- Unknown codes, a duplicated date, a missing temperature unit and spec-33-only saves all load.
- Browser at 320 and 820 px: key answers at least 44 px; the month strip wraps without horizontal scrolling.

## Review asks

- Science content: are the key questions, fifteen facts and moon wording accurate and fair for children? The companion flags the lines most worth checking.
- Does the moon table feel like a correction of a child's note, even with its wording?
