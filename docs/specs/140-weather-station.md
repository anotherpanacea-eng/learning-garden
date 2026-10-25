# 140. Hollis's Weather Station: instruments, the water cycle, and weather versus climate

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a subject check.** Part of the [history and science build-out](../history-and-science-buildout.md). Every child-facing line is in [the companion text](../content/140-weather-station-text.md); sources are in [the source audit](../source-audits/140-weather-station.md). Code and art are for the implementation pass.

**Commissioning boundary:** this is a proposal only. Select a bounded first slice (we suggest bench (a), *Read the instruments*, with problem set A) after independent content, model and save review; the presence of four benches does not commission them all. Every Act and chapter link below is a future adapter to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (draft). Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter.

## Purpose

S7 (Earth, water, weather and hazards) has the most Marble topics of any science strand and almost no built lessons in its Weather & Climate domain ([six-act strands](../six-act-strands.md): 30 source topics, 0 placed). The built benches touch water states ([Cold Window](102-cold-window-same-water.md)) and runoff ([Rain Paths](44-rain-paths.md)); the draft [Field Guide Almanac, spec 116](https://github.com/anotherpanacea-eng/learning-garden/pull/128) proposes a real weather log the child keeps from outside. Nothing yet teaches **how weather is measured**, the **whole water cycle**, or **why one wet year is not a climate**.

This spec owns those three things, at the mill where the story's flood records live. A child comes to understand that:

1. Each instrument measures one thing, in one unit: a thermometer measures air temperature (°C, with °F shown for US readers), a rain gauge measures rain as a depth (mm), a wind vane shows the direction the wind comes **from**, an anemometer shows how fast it blows, and a barometer measures air pressure (hPa).
2. Where an instrument stands changes what it reads: a thermometer in the sun measures sunshine on the glass, and a gauge under a tree misses rain.
3. The same water goes round: evaporation, condensation, precipitation, collection. Clouds are tiny drops, and water vapor is invisible.
4. Weather is what happens on a day; climate is the long-run pattern, conventionally described from 30 years of records. One rainy month or one cold day does not make a climate.
5. An average describes a record, and one difference between two averages does not, by itself, prove a trend.

**Not duplicated from spec 116:** 116 owns the child's own real-world log, its tally/pictogram/bar desk, and a five-card *Which timescale?* sort. This spec owns no real log and stores no real observation. Its record is a **supplied fictional record** for Willowbank, labeled made up on every screen, and its weather-or-climate cards are different cards. Where 116 ships, its Data desk links here for "why 30 years?", and this spec links back to 116 for "keep your own record".

## Place and story

**Route:** `#science/station`, a sibling of `#science/window` and `#science/rain`, linked from the Water Lab hub, from Rain Paths, from Cold Window, and (when spec 123 or spec 33's mill exists) from the mill's flood post. Open from the start.

**The place:** a small fenced patch of grass by the mill's flood post. Hollis's old station: a white louvered box on legs (a Stevenson screen) with a thermometer inside, a rain gauge on a post in the open, a wind vane on a pole, a homemade cup anemometer, and a barometer hanging inside the mill door. A brass plate reads *Willowbank weather, kept by H.*

**Story links (future adapters to spec 120):**

| Act and chapter | Beat (full text in the companion) | Job depths |
| --- | --- | --- |
| I, *mend the village* | After the storm the miller and Hob Pennick find the vane snapped off its pole. Pip mends it and insists the arrow points where the wind is going. It doesn't. | Sprout: which tool tells which thing. Seedling: read the vane. |
| II, *a garden across the seasons*, and the Act II ending | When page 2 (the flood ledger) dries, the librarian lays it beside Hollis's rain record from the station. The town starts reading the instruments again "so next time we'll know". | Seedling: a week of rain in mm. Sapling: why the gauge stands away from the trees. |
| III, *letters up and down the river* | Nuria writes that rain fell in Vadoalto first. The flood post at the mill rose later. Hollis's note: *Rain up there is the brook down here, later.* | Sapling: the rain-to-brook lag card (qualitative). |
| IV, *the old map and Hollis's account* | Bramble reads two decade averages off the long record and says "wetter". Wren Halloway asks whether one difference proves it. | Keeper's Desk: bench (d), older part. |

One shared scene per chapter; any job is a whole contribution; nothing here opens or locks a story place. The station's record is Willowbank fiction; the instruments, units and science are real.

## The knowledge

All facts below are checked in the [source audit](../source-audits/140-weather-station.md); remaining `[check]` items are listed there.

**Instruments and siting.**
- **Thermometer** measures air temperature. Read it with your eye level with the top of the liquid. In science and in most countries, degrees Celsius (°C); in the US, degrees Fahrenheit (°F). °F = °C × 9 ÷ 5 + 32, so 0 °C = 32 °F and 20 °C = 68 °F.
- **Stevenson screen**: a white box with louvered (slatted) sides, on legs over grass. White reflects sunlight, the louvers let air through and keep sun and rain off, so the thermometer measures the air, not sunshine on the glass. The UK Met Office places its thermometers about 1.25 m above the ground. The screen was designed by the Scottish engineer Thomas Stevenson (father of the writer Robert Louis Stevenson) and reported in 1864.
- **Rain gauge** collects rain in a funnel and measures it as a **depth** in millimeters: how deep the rain would be if none ran off, soaked in or dried up. 1 mm of rain over 1 square meter is 1 liter. It is read, then emptied, once per period (usually each day), so each reading is that period's rain only. It stands in the open: a common rule is at least twice an obstacle's height away from it (some guides say two to four times). A gauge under a tree catches less rain than falls.
- **Wind vane** turns on a pivot. Its tail has the larger surface, so the wind swings the tail away and the **arrow points into the wind**, toward where the wind comes from. Winds are named for where they come **from**: a west wind blows from the west, toward the east.
- **Anemometer** measures wind speed. A cup anemometer spins faster in a faster wind. Hollis's homemade one is counted in turns per 30 seconds, which compares windier and calmer moments but is not a calibrated speed.
- **Barometer** measures air pressure, in hectopascals (hPa; 1 hPa = 1 millibar). Average sea-level pressure is about 1013 hPa. Low pressure tends to bring unsettled weather (cloud and rain), high pressure settled weather. A falling barometer makes unsettled weather more likely; it promises nothing.
- **Units matter more than size.** 15 means nothing alone: 15 mm of rain and 15 °C are different things.

**The water cycle** (simplified picture). The Sun warms water in the brook, the ground, puddles and leaves; some **evaporates** into invisible water vapor. Air carrying vapor rises and cools; the vapor **condenses** into tiny drops (or ice crystals) that we see as cloud. Drops join and fall as **precipitation** (rain, snow, sleet, hail). Water **collects**: it runs off into the brook, soaks into the ground, or is taken up by plants, and some evaporates again. The cycle has no start and no end, and no water is used up. Clouds and the white mist above a kettle are liquid drops, not vapor. Cold Window (spec 102) shows condensation at one surface; this bench connects it to the rest of the loop.

**Clouds, briefly.** Luke Howard named the three main kinds in 1802 and 1803: **cumulus** (heaped, fluffy, often fair weather), **stratus** (a flat gray layer, can bring drizzle) and **cirrus** (thin, high wisps made of ice). This is one card, not a cloud-identification lesson.

**Rain and the brook.** Rain that falls upstream reaches the brook at the mill later, after it has run over and through the ground. How much later depends on the ground, the slope and how wet it already is. The station treats this as a qualitative idea only, with no hours, rates or forecast.

**Weather and climate.** Weather is the state of the air on a day: temperature, rain, wind, cloud. Climate is the pattern of weather in a place over a long time, described by averages and ranges. The World Meteorological Organization's standard climate "normals" are averages over 30 years, currently 1991 to 2020, updated each decade. Contrasts: one rainy month vs a wet climate; one cold day vs a cold place. A climate includes rain, wind and seasons as well as temperature.

**The long record (made up).** Thirty yearly rainfall totals for Willowbank, Hollis's record years 1 to 30. These numbers were made up for this game; they are not data for any real place.

| Years | Yearly rain (mm) | Mean |
| --- | --- | --- |
| 1-10 | 812, 945, 760, 1010, 868, 702, 990, 835, 921, 997 | 884 |
| 11-20 | 874, 1265, 798, 905, 640, 1032, 861, 958, 779, 928 | 904 |
| 21-30 | 1004, 836, 1118, 765, 882, 953, 694, 1071, 897, 900 | 912 |

Whole record: total 27,000 mm, mean 900 mm, median 898.5 mm, range 625 mm (640 in year 15 to 1,265 in year 12). Year 30 is the storm year: its total is 900 mm, exactly the average, because a storm is a few days of rain, not a whole year. The first and last decade means differ by 28 mm, while single years swing by hundreds; that difference alone does not show a trend.

**Climate change (one Keeper's note, older readers only).** The IPCC's 2021 assessment found that 2011 to 2020 was about 1.1 °C warmer, globally, than 1850 to 1900, and that human influence has unequivocally warmed the atmosphere, ocean and land. Those findings rest on thousands of stations, ships, satellites and many decades. One village gauge cannot show a global trend, and nothing in this game says the fictional storm was caused by climate change.

## The lesson

Jane's order throughout: **teach** (one idea and one worked example, steps revealed one tap at a time), **guided** (the first item shows 1 to 4 steps before answering), then **practice**.

| Bench | Teach card and worked example | Guided item | Contrast |
| --- | --- | --- | --- |
| (a) Read the instruments | One card per instrument: what it measures, its unit. Worked example: reading a thermometer between two marks (marks every 2 °C; liquid halfway between 8 and 10, so 9 °C). | Liquid halfway between 14 and 16: steps "Marks go up in 2s", "Halfway between 14 and 16 is…". | Thermometer in the sun vs in the screen; gauge under the tree vs in the open; vane arrow vs where the leaves blow. |
| (b) Water cycle loop | Evaporation and condensation on opposite arrows of one loop. Worked example: the puddle by the mill door, followed round once. | Order four cards with the first one placed. | Roof vs field (where rain goes next); vapor (invisible) vs cloud (drops). |
| (c) Weather or climate? | "Weather is a day. Climate is many years." Worked example: "It rained all April" sorted with reasons. | First card sorted with its question shown: "Is this about one time, or many years?" | One rainy month vs a wet climate; one cold day vs a cold place. |
| (d) The long record | The mean as leveling bars. Worked example: three years leveled to 900. | Mean of three bars with the steps shown. | One wet year vs the average; two decade averages vs a trend. |

**"I'm stuck" ladder** on every practice item: (1) a hint; (2) a worked example of an easier similar case plus how to start this one; (3) **Skip for now**, with no penalty and nothing recorded against the explorer. Help is optional and kept separate from independent attempts.

**Top misconceptions designed against** (tags on wrong choices in the companion): `vane-going` (Pip's: the vane points where the wind goes), `vane-speed`, `gauge-total` (the gauge holds all rain ever), `sun-thermometer`, `shelter-better`, `lower-warmer`, `water-vanishes`, `soaks-only`, `cloud-vapor`, `seeps-through`, `cycle-start`, `one-day-climate`, `mean-is-a-value`, `zero-no-change`, `blank-is-zero`, and `one-difference-trend` with its underclaim twin `record-proves-nothing`.

## The game or activity

**(a) Read the instruments.** Five instrument cards around the station picture; tapping one opens its close-up. Each close-up has a scale drawn with real tick spacing:
- Thermometer: a vertical scale from −10 to 40 °C, minor ticks every 1 °C at Seedling (labels every 10) and every 2 °C at Sapling (labels every 10). The child drags a sight line to the top of the liquid and enters a whole number. A °F scale appears beside it only at Sapling and Keeper's Desk, and only when the child taps **Show °F too**. At Sprout the thermometer has no numbers: a warm-to-cold band and two scenes, warmer or cooler (Marble's younger-learner constraint).
- Rain gauge: a clear tube marked 0 to 25 mm, ticks every 1 mm, labels every 5. Reading is at the flat part of the water surface. **Empty after reading** is a separate button; emptying before entering the reading shows the "you lost that reading" note (no penalty).
- Wind vane: a top-down vane with N, E, S, W. Leaves blowing across the picture show the wind. The child names the wind: "from the west" etc.
- Anemometer: the child taps once per turn for 30 seconds of animation (or reads a counter). Compare two moments; never shown as km/h.
- Barometer: a dial in hPa (960 to 1050), with a second "last time" needle. Compare rising or falling.
- **Placement bench:** drag the screen and the gauge to spots on the station map (under the oak, against the mill wall, open grass, on the stone path). Each spot shows a made-up reading beside the "open grass" reading with the reason. Line on every placement result: *These are made-up readings to show the idea.*

**(b) Water cycle loop.** A cross-section of the valley: sun, brook, meadow, mill roof, clouds over the hills. The child drags six step cards onto a ring of arrows; the ring has no start marker, and any correct rotation is accepted. Then **Follow one drop**: a tagged drop goes round, faint while it is vapor. Then the **roof or field** contrast: rain on the mill roof runs into the gutter and quickly to the brook; on the meadow some soaks in, some runs off more slowly, some evaporates later. A link offers Rain Paths for the tray model. Line: *A simplified picture. Real water takes many more paths.*

**(c) Weather or climate?** Eight cards, sorted into two baskets (Weather / Climate), with per-card feedback and a **Why?** reveal. A card can be moved back. Nothing is scored.

**(d) The long record.** Hollis's record as a bar chart of 30 years (equal intervals, axis labeled mm, made-up label on screen). Tools: **Level the bars** (drag any set of selected bars into a common height, which shows the mean), **Line at the mean** toggle, **Sort the bars** (for median and range). Older part: two decade boxes; the child computes both means, then answers "Does this difference prove Willowbank is getting wetter?" with three choices and a grown-up-read **Say why** box. Every screen: *Made-up numbers for a made-up village.*

## Problem sets

Four sets, 30 items in all, full text in the companion. Every numeric answer was checked by script (see Checks).

| Set | Items | Sprout | Seedling | Sapling | Keeper's Desk | Formats |
| --- | --- | --- | --- | --- | --- | --- |
| A. Reading the station | 12 | 2 | 5 | 3 | 2 | 3-choice, number with steps, say why |
| B. Where the water goes | 6 | 1 | 3 | 2 | 0 | 3-choice, order the cards |
| C. Weather or climate? | 3 (one is an 8-card sort) | 0 | 2 | 1 | 0 | sort, 3-choice |
| D. The long record | 9 | 1 | 1 | 4 | 3 | read a bar, number with steps, 3-choice, say why |

Real numbers used: 25.4 mm per inch (exact), °F = °C × 9 ÷ 5 + 32, 1013 hPa, 30-year normals. All rain and record numbers are labeled made up.

## Saved work

Optional root `station`, per explorer, absent until the first explicit keep. A sketch for review:

```
station: {
  version: 1,
  readings: [{ itemId, source, entry, support: 'none'|'hint'|'example', skipped, at }],   // latest 40
  sorts:    [{ setId, source, placed: { [cardId]: 'weather'|'climate' }, at }],          // latest 10
  record:   [{ source, leveled?: [yearIds], means?: { [boxId]: n }, choice?: code,
               sayWhy?: string /* ≤ 1,000 chars */, at }]                                // latest 10
}
```

- Store codes, numbers and stable ids; the only prose is the optional **Say why** text. `source` freezes the item or card version and the record version (`willowbank-rain-v1`) that the work was done against.
- Support, skips and independent attempts are separate fields; nothing derives a mastery or score. Familiarity (that a bench was opened) is not stored here.
- Never rewrite a saved entry on load. An unknown version or malformed entry stays exact and exportable and makes only that entry unavailable; one unreadable item never closes the bench.
- Saves follow an explicit action and preflight through the existing progress limits; at a cap, the oldest readable entry is replaced only after a disclosed notice, and unreadable entries are never evicted. Export, import, reset and explorer switching use the shared behavior.

## Curriculum fit

**Strands** ([six-act strands](../six-act-strands.md)): **S7-II** water cycle, temperature and instruments, local records; **S7-III** weather vs climate; **S7-IV** patterns and uncertainty, one careful climate-change note; **S1-II** measure in units and record conditions (siting); **S1-III** repeated measurements and variation; **M6-II** blank vs zero; **M6-III** means and distributions; **M6-V** uncertainty (one difference is not a trend). Act families: II (records), III (climate), IV (evidence).

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Read five instruments in their units; explain siting; order the water cycle as a loop; sort weather from climate; compute and interpret a mean, median and range; judge what one difference between averages can show. |
| Teaching encounter | The five instrument cards; the between-marks thermometer worked example; the puddle followed round the loop; the leveled bars. |
| Contrast | Screen vs sun; open gauge vs under the tree; arrow vs where the wind goes; vapor vs cloud; roof vs field; one rainy month vs a wet climate; one cold day vs a cold place; one wet year vs the average; two decade means vs a trend. |
| Supported practice | Guided first items with visible steps; the I'm stuck ladder; sight line on the thermometer; Level the bars. |
| New application | Placement bench spots; the 30-year record's own questions; Act IV's decade argument. |
| Purposeful revisit | Cold Window (condensation); Rain Paths (roof vs field); spec 116's own log and Data desk; spec 120 Acts II to IV; spec 124's floods for the rain-to-brook idea. |
| Data boundary | Codes, numbers and optional say-why text, all local. No location, no real weather, no network. |

## Upstream check

Refreshed 2026-10-24: Jane `0ec55f7e083976e6fcc3977fca460b1f5e199d91`, Marble `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac`. Each target's record in Marble's `data/teaching-research.json` was read; below is our own paraphrase (the research is CC BY-SA; no text is copied).

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Using Weather Instruments (`mt_sA0RvWXSYY`) | Tie each tool to its quantity and unit; practice careful scale reading at eye level; read the gauge then empty it; keep measurements consistent; build tables over time. Bench (a)'s cards, sight line, Empty after reading button and placement bench. The real week-long diary belongs to spec 116; here the week is supplied. |
| Temperature & Thermometers (`mt_PrWc-HZzDl`) | For younger learners keep it felt and relative (warmer, cooler), with no precise degrees or negatives; the thermometer only measures. Sprout's numberless warm-to-cold band and two scenes; °C appears from Seedling. |
| What Is Wind? (`mt_j7cj9eWN7w`) | Wind is moving air known by its effects; strength is a spectrum; leave the cause for later. The vane picture uses blowing leaves; the anemometer compares calmer and windier; no cause is taught (What Causes Wind, `mt_-UAxilUtUt`, is not claimed). |
| Rain & Puddles (`mt_TlLE4cZgOr`) | The drying puddle as the hook for conservation: the water went up into the air, and not only into the ground; everyday words for younger learners. Set B's Sprout item and the worked example's puddle; formal words wait for Seedling. |
| The Water Cycle (`mt_fhqVdj4BYr`) | A continuous, Sun-driven loop with no water lost; ask why each step happens; vapor is invisible and clouds are drops; follow one drop. Bench (b)'s startless ring, Follow one drop, and the cloud card. |
| Evaporation and condensation (`mt_zCGwH1OQZa`) | Pin each word to where it happens and what changes; put the confusable pair on opposite arrows of one loop; precipitation includes snow and hail. The teach card and the six step cards; the glossary. |
| Weather vs Climate (`mt_AB-TEMXSGJ`) | Timescale and aggregation; climate as the long-run average (about 30 years); address "one cold day disproves warming" gently; keep climate change light. Bench (c), bench (d)'s leveled record, and a single older-reader note. |
| Calculating the Mean (`mt_Cg8VPguS_V`) | Build the mean as leveling before the rule; ask what it tells us; the mean need not be a data value; use the reverse problem and the effect of adding 0. Level the bars, items D2 to D9 (including the missing-year item D8 and the broken-gauge zero item D9). |

Not claimed, used as references: Cloud Types (`mt_IhWzO4sQPg`, one card only), Weather vs climate (`mt_Gm12BzcCfX`, spec 116's target, revisited here), Climate Change Basics (`mt_DbI1kNg_0R`: its research asks for the greenhouse "blanket" mechanism, which this spec does not teach), and Finding patterns in data (`mt_-G6erQvLig`: its record is about patterns in maps of Earth's features, so it does not fit a rainfall table).

**Jane:** adopted the teach, guided, practice order; the I'm stuck ladder (hint, easier worked example plus how to start, skip with no penalty); misconception-tagged three-option questions; prompts in the second person of 15 words or fewer; and a key-terms glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, points or requeued "weak spots". No Jane code or text is copied.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| Using Weather Instruments | Types of Weather (`mt_jc9k_HJQGd`) | Supported: the opening card names rain, sun, wind, cloud and temperature as kinds of weather; spec 116's five codes are a related revisit. No topic claim. |
| Using Weather Instruments | Temperature & Thermometers (`mt_PrWc-HZzDl`) | Taught inline (same unit, Sprout thermometer job). |
| The Water Cycle | Cloud Types (`mt_IhWzO4sQPg`) | Partly supported: the cloud card (drops not vapor; three kinds). Identification from a real sky is not taught; documented gap. |
| The Water Cycle | Rain & Puddles (`mt_TlLE4cZgOr`) | Taught inline (same unit, puddle item and worked example). |
| Weather vs Climate | Geography & Local Weather (`mt_hjJkBWruO6`) | Partly: the "cold day vs cold place" contrast and Hollis's coast vs Willowbank card. No lesson on why places differ; documented gap. |
| Weather vs Climate | Types of Weather (`mt_jc9k_HJQGd`) | Supported, as above. |
| Calculating the Mean | Statistical Analysis Vocabulary (`mt_fmm-P17Vka`) | Taught inline: mean, median, range and average in the glossary and teach card. |
| Calculating the Mean | Addition and subtraction strategies, age 10+ (`mt_JH_6RpNWjr`) | Avoided by design: all data are whole numbers. The claim covers whole-number means only. |
| Calculating the Mean | Division with Decimals (`mt_lU-2aTRB9f`) | Avoided by design: every mean asked for divides exactly. The record's median (898.5) is shown, never asked. No claim for decimal means. |

Temperature & Thermometers, What Is Wind?, Rain & Puddles and Evaporation and condensation have no hard prerequisites in the pinned file.

## Checks for implementation

- **Script check, run 2026-10-25** (`python3 -I`, scratch area, not in the repo): confirmed the record's 30 values total 27,000 (mean 900), decade means 884, 904 and 912, median 898.5, range 625 (640 to 1,265), year 30 = 900; and every numeric answer in the companion: A3 15 °C, A4 7 mm, A7 26 mm, A8 7 mm, A9 6 mm, A10 2 in, A11 68 °F and 23 °F, A12 a 12 hPa fall, D1 year 12 tallest of years 11 to 15, D2 900, D3 921, D4 median 882 and range 353, D5 365, D6 year 30 = 900, D7 28 mm, D8 missing year 800, D9 broken-gauge mean 720; teach examples 9 °C, 25.4 mm and 254 mm. A build test repeats these from the shipped data.
- Thermometer and gauge scales use equal tick spacing; at 320 px wide each minor tick is at least 6 px apart, otherwise the scale scrolls vertically, never squeezes.
- The wind vane accepts only "from" names as correct, and every vane feedback names both where the wind comes from and where it goes.
- The water-cycle ring accepts any rotation of the correct order.
- Every placement result, the long record and the roof-or-field contrast show their made-up or simplified line.
- No screen gives safety advice, a forecast, or a flood prediction; the barometer copy never promises weather.
- Saved entries reload unchanged after a record or item version bump, with an earlier-version note.
- Browser at 320 and 820 px; touch targets at least 44 px; drag actions have tap alternatives.

## Review asks

- **Subject check:** the siting rules (gauge at least twice an obstacle's height away; thermometer height), the vane explanation, the barometer wording, and the climate-change Keeper's note. Is the rain-to-brook lag honest as a qualitative card?
- **Owner, °F:** we show °F only on request at Sapling and above, and in the grown-up panel. Default: as written. Alternative: a dual scale from Seedling.
- **Owner, barometer:** keep it (default), or leave it out of the first slice to keep bench (a) to four instruments?
- **Owner, climate-change note:** one Keeper's note in bench (d) only (default), or leave it out until a Climate Change Basics spec exists?
