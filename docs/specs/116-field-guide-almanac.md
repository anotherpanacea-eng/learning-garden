# 116. Field Guide Almanac: look outside, come back tomorrow

Status: **proposed; awaiting independent spec review.** Part of the [new kinds of play proposal](../new-game-kinds.md). Adopts the weather log proposed in [spec 33](33-rebuilding-the-town.md) and works whether or not spec 33's town scene is built. Text and design only here; code and art are for the implementation pass.

## Purpose

Every destination in the garden today is finished in one sitting. The almanac is the first that grows across **real days**: the child looks at the real sky, the real weather and the real minibeasts outside, notes what they saw, and later counts, sorts and graphs it. Dot keeps the book.

Four pages:

1. **Weather.** One note per day of what the sky is doing.
2. **Sky.** One note per night of the moon's shape.
3. **Garden neighbors.** A yes/no key for identifying minibeasts found outdoors, and a card for each find.
4. **Data desk.** Build a tally, a pictogram and a bar graph from the child's own log.

Everything is a report by the explorer or their grown-up. The game never checks a report against the real world, never fetches weather, and never asks for a location.

## Where it lives

`#almanac`, linked from Home as **"Dot's Field Guide"**. When spec 33's town exists, its almanac link opens this page and spec 33's other almanac pages (Town, Garden, Café, Words, Thinking stickers) appear as extra tabs. This spec owns the Weather, Sky, Garden neighbors and Data desk pages.

Opening line: **"Dot's Field Guide. Everything in here is something you noticed. Look outside, and tell Dot what you see."**

## 1. Weather

Once per calendar date on the device, the Weather page asks: **"What's the weather doing outside today?"** (spec 33's prompt), with the line **"Look out of a window or step outside first, then choose."** Children often record the weather they'd like; looking first keeps the log honest. Choices, using spec 33's five codes:

| Code | Button | Picture |
| --- | --- | --- |
| `sun` | Sunny | sun |
| `clouds` | Cloudy | cloud |
| `rain` | Rainy | rain cloud |
| `wind` | Windy | bending tree |
| `snow` | Snowy | snowflake |

After choosing: **"Noted. Dot has written it in the almanac."** Already logged: **"Today's weather is in the almanac. You can change today's note if the sky changed its mind."** The child may change **today's** note; earlier dates are read-only. A missed day stays blank and is never filled in or nagged about.

**Optional temperature.** Below the choice: **"Is there a thermometer at home? A grown-up can read it and type the number."** A number field and a unit choice, **°C** or **°F**, with no default unit. Stored as reported. The page labels it **"Temperature reported by a grown-up."** Values outside −60 to 60 °C or −76 to 140 °F are refused with **"That's a very unusual reading. Check the number and the unit."** The game never converts between units; graphs show each unit separately.

**Season line.** The page header names the season from the device month and the hemisphere setting (spec 33, default northern): **"It's autumn here. What's changing outside?"** with one rotating noticing prompt per season:

| Season | Prompts |
| --- | --- |
| Spring | "Are there buds on the trees?" · "Is it light when you wake up?" · "Have you heard more birds?" |
| Summer | "Where are the shadows at lunchtime?" · "Is it still light at bedtime?" · "Which flowers are out?" |
| Autumn | "What color are the leaves?" · "Is it getting darker earlier?" · "Have you seen any seeds blowing?" |
| Winter | "Can you see your breath?" · "Is the ground hard or soft?" · "Which trees still have leaves?" |

Prompts are talk invitations; nothing about them is recorded.

## 2. Sky

Once per calendar date: **"Did you see the moon? Pick the shape that looks most like it."**

| Code | Button |
| --- | --- |
| `thin-growing` | A thin curve, lit on the right |
| `half-growing` | Half, lit on the right |
| `fat-growing` | Nearly full, lit on the right |
| `full` | A full circle |
| `fat-shrinking` | Nearly full, lit on the left |
| `half-shrinking` | Half, lit on the left |
| `thin-shrinking` | A thin curve, lit on the left |
| `not-seen` | I couldn't see the moon |

In the southern hemisphere setting, the pictures and button text swap left and right. The pictures show the lit shape only, never a face.

After a shape: **"Noted. Dot drew it in the sky page."** After `not-seen`: **"That happens a lot. Clouds can hide it, and some nights the moon rises after bedtime. Sometimes it's up in the daytime instead. Have a look tomorrow afternoon."**

Safety line under the prompt, always shown: **"Only look at the moon. Never look straight at the sun."**

The sky page shows the month as a strip of days with each noted shape drawn small, blanks left blank.

### Explanations

The Sprout and Seedling explanations stay observational, as Marble's teaching research for Moon Phases advises: they describe the pattern and never explain its cause, and they never show a shadow.

- **"Is it the same moon?"** "Yes. It's always the same moon. It looks different on different nights, and it changes slowly, a little each night."
- **"Where does the moon go at new moon?"** "It's still there. On those nights we can't see the part that's lit, so it looks as if it's gone."
- **"Is there a pattern?"** "The moon grows from a thin curve to full, then shrinks back again. From one full moon to the next takes about 29 and a half days, close to a month. The word *month* comes from *moon*."

**Why it changes shape** (Sapling only). Two pictures side by side: a view from far above, with the Sun's light coming from one side and the moon at eight places around Earth, half-lit in every position; and the view from Earth's sky for each place. Text: "Sunlight always lights up half of the moon. As the moon travels around Earth, we see different amounts of that lit half. When we see all of it, that's a full moon. When the lit half faces away from us, that's a new moon." Then: **"The dark part is not Earth's shadow. When Earth's shadow really does fall on the moon, that's a lunar eclipse, and it only happens a few times a year."** This keeps the two views together and heads off the most common moon misconception, both flagged in the research.

### The moon table (Sapling page)

A separate page, shown under the strip as **"Compare with the moon table"**. For each date the child logged, it shows the approximate phase calculated from the date using an average 29.53-day cycle from a known new moon. Label: **"Calculated from the calendar. It's usually right to within a day."**

Text when a noted shape and the calculation differ by one step: **"Your note and the table are one step apart. Shapes near the change are hard to tell apart, and the table can be a day off."** By more than one step: **"Your note and the table are quite different. Was it the moon? Was it a different night? Both are worth wondering about."** The child's note is never changed, flagged as wrong or hidden.

Prediction, optional: **"You saw a half moon lit on the right on the 3rd. About how many days until it's full?"** The child enters a number; the page shows **"The table says about 7 days. Look on that night and see."** The answer comes from the calculation, and the prediction is stored with the date it was made.

## 3. Garden neighbors

A field-guide key for minibeasts the child finds **outside**, with a grown-up. No camera, no photos, no location.

Before the key, always shown: **"Look with your eyes, not your fingers. If you lift a stone or a log, ask a grown-up first, and put it back gently. Leave every minibeast where you found it."**

### The key

The child follows a ready-made key. Every question has two answers, each about a feature the child can see, which is how Marble's teaching research says a key should work. One question per screen, with a picture for each answer and **Go back** at every step.

1. **"Does it have legs?"** Yes → 4. No → 2.
2. **"Does it carry a shell on its back?"** Yes → **Snail**. No → 3.
3. **"Does it have feelers on its head?"** Yes → **Slug**. No → **Earthworm**.
4. **"Does it have more than eight legs?"** Yes → 5. No → 7.
5. **"Does it have more than twenty legs?"** Yes → 6. No → **Woodlouse** (fourteen legs).
6. **"Are there two pairs of legs on most body sections?"** Yes → **Millipede**. No, one pair → **Centipede**.
7. **"Does it have eight legs?"** Yes → 8. No, six → 9.
8. **"Is its body in two parts?"** Yes → **Spider**. No, one round piece → **Harvestman**.
9. **"Is its back hard and shiny, like a closed lid?"** Yes → 10. No → 11.
10. **"Does the lid have spots?"** Yes → **Ladybug**. No → **Beetle**. (Card note: "Most ladybugs have spots, but a few kinds don't.")
11. **"Can you see wings?"** Yes → 12. No → 14.
12. **"Are the wings big, with colors or patterns?"** Yes → **Butterfly or moth**. No → 13.
13. **"Does it have a narrow waist?"** Yes → **Bee or wasp**. No → **Fly**.
14. **"Does it have a narrow waist?"** Yes → **Ant**. No, it's soft and long → **Caterpillar** (note: "A caterpillar has six true legs at the front, plus soft stumpy legs behind. Count only the ones near its head.")

**"I can't tell"** is available at every step. It explains why that feature is hard to see on a moving creature ("Legs are hard to count when something is moving. Watch it for a moment, or look for where it stops.") and offers **Go back** or **Finish as "something else"**, which the child can label in their own words (kept local, never sent anywhere). There is no picture gallery to match against, because a key identifies by answering questions about features.

**Build a key** (Sapling page). After a child has used the key at least once, a page offers four group cards (spider, ant, snail, woodlouse) and asks the child to choose two yes/no questions from a list that sorts them into four separate endings. The list mixes questions that work ("Does it have a shell?", "Does it have eight legs?") with ones that don't: a vague one ("Is it big?"), one with no clear answer ("Is it nice?"), and a clear one that sends every card the same way ("Does it have a backbone?"). The page shows where each card lands and points out any ending with two cards in it. More than one key works, and the page says so when the child finds a second one.

### Group cards

Each card has a name, one true fact and a "look for" line. Facts are authored here for content review.

| Group | Fact | Look for |
| --- | --- | --- |
| Snail | "A snail's shell grows with it. It can never leave its shell." | "A silvery trail where it has been." |
| Slug | "A slug is a snail without an outside shell. It needs damp places to stay moist." | "Two long feelers and two short ones." |
| Earthworm | "Earthworms have no eyes, but they can sense light through their skin." | "A thicker band partway along its body." |
| Woodlouse | "Woodlice are crustaceans, cousins of crabs and shrimp. They need damp places to breathe." | "Some roll into a ball when they're worried." |
| Ant | "Ants live in big families called colonies." | "A line of ants following the same path." |
| Caterpillar | "A caterpillar is a young butterfly or moth. It eats and grows, then changes completely." | "Leaves with holes nibbled in them." |
| Ladybug | "Ladybugs are beetles. Their spotted wing cases open to let out thin wings for flying." | "Count the spots. Different kinds have different numbers." |
| Beetle | "Beetles have hard front wings called wing cases that close like a lid." | "A line down the middle of its back where the cases meet." |
| Butterfly or moth | "Butterfly and moth wings are covered in tiny scales, like colored dust." | "Most butterflies rest with wings up; many moths rest with wings flat." |
| Bee or wasp | "Bees and wasps have two pairs of wings and a narrow waist." | "Bees visit flowers. Watch from a safe distance and never touch." |
| Fly | "Flies have one pair of wings. Bees and wasps have two." | "Big eyes that cover much of its head. Hoverflies have yellow and black stripes like a wasp; count the wings." |
| Spider | "Spiders have eight legs and two body parts. Most spin silk." | "A web, especially in the morning when it has dew on it." |
| Harvestman | "Harvestmen have eight legs like spiders, but their body is one round piece and they don't spin silk." | "Very long, thin legs on a small body." |
| Centipede | "Centipedes have one pair of legs on each body section. They hunt other minibeasts." | "Long feelers and a fast, wriggling run." |
| Millipede | "Millipedes have two pairs of legs on most body sections. They eat dead leaves." | "Legs moving in waves along its body." |

### Adding a find

After the key reaches a group: **"Add it to your field guide?"** The child picks where it was from a list: **under a stone or log · on a leaf · in the soil · on a flower · on a wall or fence · in the air · somewhere else**. The find is stored with the date, the group and the place. The guide shows one card per group with the number of finds and the first date. A group the child hasn't found shows a grey outline: **"Not found yet."**

A find is a record that the explorer used the key and chose this group. The guide never claims the identification is correct; the card says **"You identified it as…"**.

## 4. Data desk

Choose a month from the weather log. If the log has fewer than five entries, the desk offers **Dot's practice month** instead, clearly labeled **"Made up by Dot for practice."**

**Dot's practice month** (30 days, made up): sun 11, clouds 9, rain 7, wind 2, snow 1. Authored day order: sun, sun, clouds, rain, rain, clouds, sun, wind, sun, clouds, rain, sun, sun, clouds, clouds, rain, sun, snow, clouds, sun, rain, rain, clouds, sun, wind, sun, clouds, rain, sun, clouds.

### Steps

1. **Tally.** The days appear one at a time with their picture. The child taps the matching row to add a tally mark. Marks group in fives (four strokes and a crossing stroke). **Next day** moves on; **Back** undoes the last mark. At the end: **"Every day is tallied."** If a row's tally differs from the log, the desk says which row and offers **Recount that row**. A finished tally is stored as the child built it.
2. **Pictogram.** The key comes first and stays on screen: **"Each picture stands for 1 day."** One picture per day, all the same size and lined up from the same edge. The child adds or removes pictures in each row with + and − until it matches their tally. Sapling option: **"Make each picture stand for 2 days."** The key changes first, and the page asks **"How many pictures will 7 days need now?"** before the child builds the row. Odd counts use a half picture, with the key **"Half a picture means 1 day."**
3. **Bar graph.** The child raises each bar with + and − to the tally's count. The scale counts in ones, with a Sapling option to count in twos.
4. **Questions**, chosen from these and answered by tapping, with the answer revealed from the child's own graph:
   - "Which weather did we see most?"
   - "Which did we see least?"
   - "How many more [most] days than [least] days?"
   - "How many days did we log altogether?"
   - (Sapling) "Which two kinds together make up about half the days?"

The desk never says a tally is wrong; it reports which row differs and lets the child recount.

### Comparing months (Sapling page)

With two logged months, show both bar graphs side by side on the same scale. Prompt: **"This month had more rain than last month. Does that mean it will be rainy next year too?"** Details panel, **"Weather and climate"**: **"Weather is what the sky is doing today. Climate is what the weather is usually like in a place over many years: how warm, how wet, how windy, season by season. One month of your log is weather. Scientists use about 30 years of records to describe a climate."**

**Which timescale?** Five statement cards to sort into **Weather** or **Climate**: "It's raining today." (weather) · "This month had more sunny days than last month." (weather) · "Summers here are usually warm and dry." (climate) · "It snowed once in a place where it hardly ever snows." (weather) · "Over many years, this town gets lots of rain in autumn." (climate). After sorting, the page names any card in a different pile, with its reason: **"One snowy day is weather. It doesn't change what a place is usually like."**

If the log has reported temperatures in one unit for at least five days in a month, a **Temperature** strip shows them as dots in date order, joined by a line because temperature is measured over time (a Details panel says so), with the warmest and coolest marked and the difference named: **"The warmest day was 9 degrees warmer than the coolest."** Celsius and Fahrenheit readings are never mixed on one strip.

## Off-screen invitations

- "Look out of the same window at the same time tomorrow. What's different?"
- "Find three different minibeasts this week. Which hiding place had the most?"
- "Look for the moon in the daytime. It happens more often than people think."
- (Sapling) "Put a cup outside on a rainy day and measure how much rain it catches. Compare with a different day."

## Saved work

Per explorer, absent until the first note:

```
weather: [ { date: 'YYYY-MM-DD', weather: code, temp?: { value, unit: 'C'|'F' } } ]   // spec 33 shape plus optional temp; latest 400
sky:     [ { date, shape: code } ]                                                   // latest 400
finds:   [ { date, group: code, place: code, label?: string } ]                     // latest 500
dataDesk:{ [month 'YYYY-MM' | 'practice']: { tally: {code:n}, pictogram: {code:n, scale}, bars: {code:n, scale}, at } }
moonPredictions: [ { madeOn, fromShape, days, at } ]                                 // latest 50
```

- If spec 33 ships first, this spec reads and writes the same `weather` array. Optional `temp` is additive, and spec 33's code ignores it.
- Validate dates, codes and numbers only. Drop an entry with an unknown code or a malformed date and keep the rest.
- One entry per date for `weather` and `sky`. Earlier dates are read-only in the UI; a save with two entries for one date keeps the later one.
- Never check finds against today's key wording. A group code no longer in the key shows as **"A group from an older field guide"**.
- The moon table and month graphs are computed when opened and never stored.
- Notes export, import, reset and explorer switching include all of these.
- The hemisphere is a device setting from spec 33, never a location.

## Grown-up notes

**"Field Guide: [n] weather notes, [n] moon notes, [n] minibeast finds in [n] groups. Data desk: [n] months graphed."** Details: **"Everything in the field guide is something your explorer reported. The game doesn't check it against real weather or the real sky. The best thing you can do is go outside together and look."**

## Curriculum fit

**Acts.** The almanac starts in Act I, when the storm has passed and the town is looking around again, and stays open through every act. Its pages deepen with the acts in the [roadmap's story order](../roadmap.md#story-order-and-review-rule): observing in Act I, keeping records and graphing them in Act II, weather versus climate in Act III, and in Act IV the moon table's "your note and the calculation disagree" becomes a small lesson in evidence. Act V's night garden and observatory project paths can start from the sky page.

**Strands** ([six-act strands](../six-act-strands.md)):

| Page | Strand families |
| --- | --- |
| Weather | S7-I weather observations; S7-II local records and temperature instruments (reported, never measured by the game) |
| Sky | S8-I sky observations; S8-II moon models (Sapling "why it changes shape" only) |
| Garden neighbors | S3-I local organisms; S3-II classification keys and observations |
| Data desk | M6-I sort, record, read tables and bars; M6-II scaled pictograms and bars, blank versus zero; S7-III weather versus climate |

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Record real observations over days; follow a two-way key; build and read a tally, pictogram and bar graph from one's own record; tell weather from climate. |
| Teaching encounter | The first weather and moon notes, each with its short explanation; the key's first walk-through; the data desk's practice month. |
| Contrast | Growing versus shrinking moon; a key question that splits the set versus one that doesn't; one picture per day versus two days per picture; weather versus climate statements. |
| Supported practice | "I can't tell" at every key step; **Recount that row**; the practice month when a log is short. |
| New application | The child's own month replaces the practice month; a second month to compare; building a key for four new cards. |
| Purposeful revisit | Spanish errand 4 ([spec 117](117-spanish-river-market.md)) reuses the weather pictures; Rain Paths and the Field Notebook charts can link to the data desk; the minibeast cards are a natural home for a later Minibeast Meadow with Dot. |
| Data boundary | Stored: dates, codes, optional reported temperatures, optional free-text labels for "something else" finds. No location, photo, name or health data. All local; export, reset and explorer switching cover it. |

## Upstream check

Refreshed 2026-10-23: Marble at `f186a79a9525c189e2d423e31613c62b6805416f` and Jane at `1927912b8d9cd4f7df6e7fbe8416521194743060`. Marble's new `data/teaching-research.json` has records for every topic below, and this spec follows their `learn` constraints, which Jane's own review of that research also recommends where the fields disagree:

| Topic | What the research says, and what changed here |
| --- | --- |
| Moon Phases (`mt_ByXgbTld6R`) and Phases of the Moon (`mt_4V-vYhFUcm`) | Keep younger work observational with growing/shrinking names; never show shadows; teach that new moon is still there and that phases change slowly. For older learners, show the orbit view and sky view together and keep phases distinct from eclipses. The explanations were rewritten to match, and the cause moved to a Sapling-only panel. |
| Classification Keys (`mt_brgde1Vx0P`) | Questions must be two-way, observable and actually split the set; follow a key before building one; a key works by questions, not by matching a picture. The key was rewritten as fourteen yes/no steps, the picture gallery was removed, and a Sapling "Build a key" page was added. |
| Common minibeasts (`mt_yR1moI5kX1`) | Include unloved creatures with calm, caring language; use lifelike art (cartoons distort legs and segments); flags bee/wasp/hoverfly confusion. The art direction below asks for lifelike pictures, and the fly card now mentions hoverflies. |
| Local weather patterns (`mt_HZvTriQWTh`), Recording Data (`mt_ZFwPZaDJ0_`) | Real outdoor observation is essential; children record the weather they wish for; categories are fixed before collecting; close the loop by reading the record. The prompt now asks the child to look first; the five codes are fixed. |
| Pictograms and tally charts (`mt_c29FaCTNsx`), Bar graphs (`mt_ChjMU2GDJa`) | Build charts from data the children tallied; read the key first and preview many-to-one keys; equal symbols on a baseline; tallies in gated fives; ask both to read and to build. The pictogram step now leads with its key and previews the two-day key. |
| Weather vs climate (`mt_Gm12BzcCfX`), Seasonal changes (`mt_go5i87u2b9`) | Make the timescale explicit; climate is more than temperature; don't explain why seasons happen, and never suggest summer is warmer because Earth is closer to the Sun. The "Which timescale?" sort was added; season prompts stay descriptive. |

Jane's `LESSONS.md` is a design reference for its glossary (short definitions for new words such as *pictogram*, *tally*, *climate*) and its three-choice questions. Its mastery, medals, bosses and daily quest schedule are not adopted. No upstream code or prose is copied. These are design references; any atlas declaration still needs its own source audit against the pinned graph.

**Art direction.** Minibeast pictures are lifelike illustrations with countable legs and visible body sections. Weather and moon pictures are simple and consistent in size so pictogram rows line up.

## Checks for implementation

- One weather and one sky note per date; today editable, earlier dates read-only; a device clock change never rewrites an earlier entry.
- Hemisphere swaps the moon pictures and text and the season names.
- Every key path reaches a group or "something else"; **Go back** works at each step.
- Tally, pictogram and bar steps work from an empty log (practice month), a five-day log and a full month.
- Pictogram half pictures appear only for odd counts at scale 2.
- The moon table's calculated phase is within one step of a published phase table for at least twelve test dates.
- Unknown codes, a duplicated date, a missing `temp` unit and spec-33-only saves all load.
- Browser at 320 and 820 px: key choices stay at least 44 px; the month strip wraps without horizontal scrolling.

## Review asks

- Science content: are the key questions, the fifteen facts and the moon wording accurate and fair for children?
- Is the moon table a good idea, or does showing a calculated phase beside a child's note feel like a correction?
