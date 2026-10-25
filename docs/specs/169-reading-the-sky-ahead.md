# 169. Reading the Sky Ahead: forecasts, weather maps, the Sun's engine and building for weather

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a subject check.** Part of the [history and science build-out](https://github.com/anotherpanacea-eng/learning-garden/pull/137). Every child-facing line is in [the companion text](../content/169-reading-the-sky-ahead-text.md); sources are in [the source audit](../source-audits/169-reading-the-sky-ahead.md). Code and art are for the implementation pass.

**Commissioning boundary:** this is a proposal only. Select a bounded first slice (we suggest bench (a), *The forecast chain*, with problem set A) after independent content, model and save review; five benches do not commission each other. Every Act and chapter link is a future adapter to the separately proposed [spec 120](https://github.com/anotherpanacea-eng/learning-garden/pull/127) (draft). Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter.

## Purpose

S7 (Earth, water, weather and hazards) has 30 Marble topics in Weather & Climate. Draft [spec 140](https://github.com/anotherpanacea-eng/learning-garden/pull/138) (Hollis's Weather Station) now teaches instruments, the water cycle, and weather versus climate. Nothing teaches what the town does **next** with its readings: forecast, read a map, understand why the air moves, and build for what is coming. The game is called *After the Storm*; this pack is the valley learning to see the next one coming and to meet it calmly.

A child comes to understand that:

1. A forecast is a chain: measure in many places, gather the readings in one place, spot the pattern, warn people. It says what is **likely**, and it gets less sure further ahead.
2. A weather map is a snapshot read through a key: H and L, fronts, isobars (crowded lines, strong wind).
3. The Sun heats the Earth unevenly (land faster than water, the Equator more than the poles); warm air rises, pressure differs, and air flows from high to low pressure. That flow is wind.
4. Thunder is only a sound. Weather services send color-coded warnings, and grown-ups decide what everyone does.
5. Each hazard needs its own fix; every design has a limit; a warning protects people, not buildings; a claim says only what was tested.
6. (Sprout) Look at the forecast first, then choose what to wear or pack.

**What it builds on, not repeated:** spec 140's instruments, units and barometer (a falling barometer "promises nothing" is kept); spec 163's spark card (how lightning forms) at `#workshop/switches`; spec 146's Thunder counter (divide by 3 or 5, closer or farther); spec 124's Bank Builder for flood banks (this pack's design bench is about wind, rain and lightning on buildings, and links to 124 for floods); spec 116's own weather log for the child's real observations.

## Place and story

**Route:** `#science/forecast`, **the Forecast Room** above Willow Post Office: a long table with a painted valley map (Vadoalto in the hills, Willowbank, Les Saules downriver), the old Keeper's *Sky books*, and a barometer. Linked from `#science/station` (spec 140), the Post Office hub, and (bench e) the Storm Workshop hub. Open from the start. Readings travel by letter faster than weather, as they once did by telegraph.

| Act and chapter | Beat (full text in the companion) | Job depths |
| --- | --- | --- |
| II, *the Market Fair* (summer) | A gust lifts the baker's new stall roof; the orchard keeper's grandmother's hedge suggests a second fix. | Seedling: match fix to hazard. Sapling: the stall test. |
| III, *letters up and down the river* | A postcard from the coast signed only "H." (spec 143's device; sender unnamed): every sunny afternoon the wind blows in off the sea. Why? | Seedling: the trays. Sapling: sea breeze. Sprout: Pip packs for the high ford. |
| V, *a Willowbank newspaper* path | Bramble says the *Gazette*'s "70%" forecast lied. Wren asks what 70% means. | Seedling: chance card. Keeper's Desk: why one dry day can't judge a forecast. |
| VI, *the long rain* | Days of rain on the map; Nuria's runner; Willowbank acts, then sends the warning on to Léon. | Sapling: moving map. Keeper's Desk: say why a warning helps. |

The Act VI beat is an adapter for spec 120's own long-rain chapter and changes nothing in it. No cast member is ever in danger: the storm in bench (d) is watched from inside the café; the long rain damages nothing (spec 120 §11).

## The knowledge

Sources and open items are in the [source audit](../source-audits/169-reading-the-sky-ahead.md).

**Forecasting, history.** On 14 November 1854 a storm that had crossed Europe for days wrecked ships of the allied fleets in the Black Sea. The Paris Observatory's director, Urbain Le Verrier, collected reports and showed the storm could have been tracked; from 1855 he built a network of weather stations reporting to Paris by telegraph (sources give different early station counts). In Britain, Robert FitzRoy (head of the Board of Trade's Meteorological Department, set up in 1854, forerunner of the Met Office) began telegraphed storm warnings to ports in February 1861, after the Royal Charter storm of 1859, and published the first public forecast in *The Times* on 1 August 1861. Taught only as "he called them forecasts" (the Met Office says he chose the term; the word itself is older). Ship losses and FitzRoy's death are left out.

**Forecasting today.** Forecasts combine observations from weather stations, **weather balloons** (radiosondes, launched at 00:00 and 12:00 UTC from roughly 800 to 900 sites; counts vary and some sites launch once a day, so the child text says "hundreds"), **radar** (radio waves reflected by rain show where it falls), and **satellites** (clouds seen from above; the first successful weather satellite, TIROS-1, launched 1 April 1960), run forward by **computer models**. Forecasts get less sure with lead time; no accuracy percentages are given (published figures lack a stated definition).

**Chance of rain.** The US National Weather Service defines probability of precipitation as the chance of at least 0.01 inch at a given point in the area during the period. Taught as: on 10 days like this, rain on about 7. Common errors designed against: "70% of the day", "the forecaster is 70% sure", and "a dry day proves it wrong".

**Weather maps.** A key is required. H marks high pressure (often settled), L low pressure (often unsettled). Isobars join equal pressure; close together means strong wind. Cold front: blue line with triangles; warm front: red line with half-circles; symbols point the way the front moves (NOAA JetStream). **Wind arrows:** map arrows (and the H-to-L pressure arrows) show where the air is going; spec 140's vane points to where it comes from, and winds keep spec 140's "named from" rule. The key says both in one line, so a west wind's map arrow points east.

**The Sun's engine.** Land heats and cools faster than water (water mixes and stores heat). By day, air over land warms and rises and cooler sea air flows in (sea breeze); at night the flow can reverse. Near the Equator sunlight arrives nearly head-on; near the poles it arrives low and spreads over more ground, so each patch gets less (NASA Earth Observatory; daily totals at high latitudes in summer are a nuance left to the Keeper's note line "season and cloud"). Warm rising air leaves lower pressure; air flows from high toward low pressure (Earth's spin turning large-scale winds is left out).

**Storms and warnings.** Thunder is the sound of lightning and cannot hurt anyone. Météo-France and AEMET both use green, yellow, orange, red; AEMET sets zone thresholds partly by how rare the weather is there (the recurrence figures in the draft were not confirmed, so D3 uses a made-up Willowbank number). Safety advice is never written by this game: the grown-up card points to national services and reports one NWS statement (hearing thunder means you are probably within striking distance).

**Building for weather.** Wind blowing over a roof pulls up on it (uplift); roof-to-wall connections are often the weak link, and straps that make a continuous path from roof to foundation help (UF/IFAS Extension). Windbreaks slow wind. Gutters and raised floors deal with rain. Benjamin Franklin proposed pointed rods joined to the ground around 1750 and printed instructions in 1753; a lightning rod gives lightning a path to ground. Early warning (detect, warn, act) protects people and movable goods, not structures. No design removes a hazard; each holds to a limit.

## The lesson

Jane's order: **teach** (one idea, one worked example, steps revealed per tap), **guided** (first item shows 1 to 4 steps), then **practice**.

| Bench | Teach card and worked example | Guided item | Contrast |
| --- | --- | --- | --- |
| (a) The forecast chain | Measure, send, spot, warn; worked through Vadoalto's falling barometer reaching Willowbank's map. | A2: order the chain, first card placed. | A forecast vs a record of the past; likely vs certain; tomorrow vs ten days ahead. |
| (b) The map table | A map is one time, read with a key; read Les Saules (rain, 14 °C) in four taps. | B2: what L means, steps "find L in the key". | Isobar vs front; crowded vs spread isobars; map arrow (going to) vs vane (coming from). |
| (c) The Sun's engine | Same Sun, different warming; sand +10 °C vs water +2 °C. | C1: which tray warmed faster. | Day breeze vs night breeze; straight vs tilted flashlight. |
| (d) Storm day, calmly | Thunder is only a sound; warnings come from the weather service. | none needed (Sprout card first) | Thunder (sound) vs lightning; a warning vs a rule from the game. |
| (e) Building for weather | Each hazard its own fix; match "wind lifting a roof" to straps. | E2: hold number, steps "2 on its own, +1 per pair". | Wind fix vs rain fix; held in a test vs storm-proof. |

**"I'm stuck" ladder** on every practice item: a hint; then an easier worked example plus how to start this one; then **Skip for now**, no penalty, nothing recorded against the explorer.

**Top misconceptions** (tags in the companion): `forecast-certain`, `forecast-guess`, `forecast-past`, `percent-of-day`, `long-range-same`, `forecast-controls`, `symbol-self-evident`, `front-color-swap`, `isobar-front`, `spacing-reversed`, `water-heats-faster`, `even-heating`, `breeze-reversed`, `wind-no-cause`, `distance-cold`, `pressure-unrelated`, `thunder-hurts`, `one-fix-all`, `fix-wrong-hazard`, `weatherproof`, `one-test-proves-all`, `ignore-forecast`, with the underclaim `forecast-useless` (it might be wrong, so ignore it).

## The game or activity

**(a) The forecast chain.** A strip of four empty slots and four cards (drag or tap-to-place). Five tool cards open close-ups (station, balloon, radar, satellite, model), each with one job line. A history card (*A true thing from history*) with Le Verrier and FitzRoy. A chance card shows 10 day icons, 7 wet and 3 dry.

**(b) The map table.** The valley map with a tappable key. **Moving map** (Sapling): a rain band three squares west of Willowbank; **Next 6 hours** moves it one square east. **Stated model `valley-map-v1`:** one square per 6 hours, steady speed and direction; made-up map squares. Line on every screen: *A made-up map of a made-up valley. Real weather maps use these same symbols.* **Pip packs** (Sprout): drag four items into Pip's bag after reading a three-icon forecast strip; each item answers with its reason. Nothing about the child's own clothes.

**(c) The Sun's engine.** Two trays with readouts; **One hour of Sun** runs a fixed animation to 30 °C and 22 °C (*Made-up readings that show a real pattern*). A day/night toggle on a beach cross-section reverses the breeze arrows. The **flashlight** (Keeper's Desk): straight lights 1 square, tilted lights 2, each at half brightness (*A simplified picture*). A pressure picture with H and L and arrows from H to L.

**(d) Storm day, calmly.** A café-window scene, cards only: thunder, who decides, warning colors, how rare. Buttons link to spec 146's Thunder counter and spec 163's sparks card. The grown-up card sits in the room's Grown-up panel, labeled *For grown-ups*; nothing is locked. No sound effects of thunder by default.

**(e) Building for weather.** **Stated model `stall-v1`:** the stall roof's hold number is 2; each pair of straps adds 1 (at most 2 pairs); the grown hedge adds 1; the gutter adds nothing for wind. Gust dial 1 to 5 (made-up, unitless, not Beaufort). The roof holds if gust ≤ hold number. Budget 4 coins: straps 1 per pair, hedge 2, gutter 2. Exactly one design within budget holds gust 5 (two pairs and the hedge), confirmed by enumeration. A lightning card and a warning card sit beside the stall to show fixes that don't change the hold number. Line on every result: *A made-up model with simple rules. Real buildings are tested by engineers.*

## Problem sets

Five sets, 22 items, full text in the companion. Every numeric answer was checked by script.

| Set | Items | Sprout | Seedling | Sapling | Keeper's Desk | Formats |
| --- | --- | --- | --- | --- | --- | --- |
| A. The forecast chain | 5 | 1 | 2 | 1 | 1 | 3-choice, order the cards |
| B. The map table | 5 | 1 | 2 | 2 | 0 | 3-choice, number with steps |
| C. The Sun's engine | 4 | 0 | 1 | 1 | 2 | 3-choice |
| D. Storm day, calmly | 3 | 1 | 1 | 1 | 0 | 3-choice, number with steps |
| E. Building for weather | 5 | 0 | 1 | 2 | 2 | 3-choice, number, say why |

Right answers sit 6 in position A, 6 in B and 5 in C across the 17 three-choice items. Real numbers: 1854, 1861, 70%, 4 hPa isobar steps. Model numbers, and D3's, are labeled made-up.

## Saved work

Optional root `forecastRoom`, per explorer, absent until the first explicit keep. Sketch for review:

```
forecastRoom: {
  version: 1,
  answers: [{ itemId, source, entry, support: 'none'|'hint'|'example', skipped, at }],  // latest 40
  stall:   [{ source: 'stall-v1', design: { straps: 0|1|2, hedge: bool, gutter: bool },
              gustTried: [n], at }]                                                     // latest 10
}
```

- Codes, numbers and stable ids only. No free text: E5 is spoken to a grown-up and not saved.
- Support, skips and independent attempts are separate fields; nothing derives a score or mastery. Familiarity is not stored here.
- Never rewrite a saved entry on load. An unknown version or malformed entry stays exact and exportable and makes only that entry unavailable; one unreadable item never closes the room.
- Saves follow an explicit action and the shared limits, export, import and reset.

## Curriculum fit

**Strands:** **S7-II/III** forecasting, maps and the Sun as weather engine; **S7-IV** hazards and preparation (calm); **S7-VI** comparing designs with evidence; **S1-III** predict then check; **M5/M6** rate (squares per hours), division, chance as "about 7 in 10"; **H2** a short, checked history of forecasting; **E4** a spoken claim with a reason. Act families: II, III, V, VI.

| Part | In this spec |
| --- | --- |
| Target | Explain the forecast chain and chance; read a map key, fronts and isobars; explain uneven heating and high-to-low flow; know thunder is a sound and warnings come from weather services; match fixes to hazards and judge a design's limit. |
| Teaching encounter | Chain worked example; Les Saules map read; the trays; thunder and warning cards; fix-to-hazard example. |
| Contrast | Likely vs certain; tomorrow vs ten days; isobar vs front; land vs water; day vs night breeze; straight vs tilted flashlight; wind fix vs rain fix; tested vs storm-proof. |
| Supported practice | Guided A2, B2, C1, E2; the I'm stuck ladder; the moving map; the gust dial. |
| New application | H.'s postcard; the *Gazette* argument; the long rain; E3 budget design. |
| Purposeful revisit | Spec 140 (instruments, barometer); 146 (thunder count); 163 (spark); 124 (flood banks); 116 (own log); spec 120 Acts II, III, V, VI. |
| Data boundary | Codes and numbers, local only. No location, no real forecast, no network. |

## Upstream check

Jane refreshed at `0ec55f7e083976e6fcc3977fca460b1f5e199d91` (2026-10-24); Marble at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (2026-10-24). Each target's record in `data/teaching-research.json` was read; paraphrased below (CC BY-SA; no text copied).

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Weather Forecasting (`mt_AghN5YcCHX`) | A data-to-pattern-to-prediction-to-action chain, one job per tool, forecasts' value made concrete, honest probability and growing uncertainty, predict then check. Bench (a), A1 to A5, the *Gazette* scene, the off-screen week. |
| Reading Weather Maps (`mt_3pgTpuetKi`) | Key first, then one map, then trend, then a prediction framed as likely; fronts, pressure and wind symbols decoded. Bench (b)'s key, four-tap read, moving map with its assumption, B2 to B5; no real data stored. |
| Sun-Driven Weather Systems (`mt_-YYnLLIZh5`) | Build the full causal chain with pressure as the new idea, anchor in the land-sea breeze, then scale to Equator and poles, with a fair land-water comparison. Bench (c): the trays (same Sun, same hour), sea breeze, pressure card, flashlight; C1 to C4. Ocean currents are named in no item; documented as left out. |
| Storm Safety (`mt_4pLvMN8uzL`), **partial** | Asks for a few correct rules with reasons, myth-busting and calm reassurance. This spec gives the reassurance (thunder is only a sound) and the "services warn, grown-ups decide" frame; rules stay on a grown-up card citing national services (wave 4 rule), so no full claim. |
| Designing for Weather Hazards (`mt_JmMtZCifJB`) | Claim, evidence, reasoning; compare at least two solutions on shared criteria; generate evidence by testing; hazards are reduced, never removed. The stall test, E3 and E4. |
| Weather-Resistant Engineering (`mt_iiUdDUEEGY`) | Tie each feature to the mechanism it counters, push designs past their limit, weigh advantages and limits, include early warning as a distinct kind of solution. Fix cards, gust dial, E1 to E5, Act VI. |
| Dressing for the Weather (`mt_Dj2xr8CoI0`) | Look first, then choose, with a reason for each item; layers trap warmth (clothes are not heaters). Pip packs and B1, with Pip as the subject so the child's own body and clothes are never asked about. Sun safety is left to the grown-up; no health advice. |

Not targeted: Thunder & Lightning (`mt_BO_AHGLCk0`), taught by specs 163 and 146 and only linked here. Weather Forecasting & Safety (`mt_URezjbU-6f`), The Atmosphere, Climate Zones, Extreme Weather Events and What Causes Wind are not claimed.

**Jane:** adopted the teach, guided, practice order; the I'm stuck ladder; misconception-tagged three-option questions; second-person prompts of 15 words or fewer; a key-terms glossary. Not adopted: medals, bosses, mastery, gates, timers, step-downs, points or requeued weak spots. No Jane code or text copied.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it's met |
| --- | --- | --- |
| Weather Forecasting | Cloud Types (`mt_IhWzO4sQPg`) | Met in part elsewhere: spec 140's cloud card. Cloud identification is a documented gap; satellites "see clouds" only. |
| Weather Forecasting | Using Weather Instruments (`mt_sA0RvWXSYY`) | Met elsewhere: spec 140 bench (a); the station tool card revisits it. |
| Reading Weather Maps | Weather Forecasting (`mt_AghN5YcCHX`) | Taught inline (bench a). |
| Reading Weather Maps | Using Weather Instruments (`mt_sA0RvWXSYY`) | Met elsewhere: spec 140 (hPa and the barometer). |
| Sun-Driven Weather Systems | The Water Cycle (`mt_fhqVdj4BYr`) | Met elsewhere: spec 140 bench (b). |
| Sun-Driven Weather Systems | What Causes Wind (`mt_-UAxilUtUt`) | Taught inline (warm air rises, cooler air flows in) as support; no claim on that topic. |
| Designing for Weather Hazards | Weather Forecasting & Safety (`mt_URezjbU-6f`) | Supported: bench (a)'s purpose of forecasts and Act VI's preparation; no claim. |
| Weather-Resistant Engineering | Extreme Weather Events (`mt_6EfevRyeFW`) | Documented gap: hurricanes, tornadoes and blizzards are not taught. The claim covers wind, heavy rain and lightning on small buildings only. |

Storm Safety and Dressing for the Weather have no hard prerequisites in the pinned file.

## Checks for implementation

- **Script check, run 2026-10-25** (`python3 -I`, scratch area, not in the repo) confirmed, rerun at review: 3 dry days in 10 at 70%; isobars at 4 hPa steps (1000 to 1012); B5 3 × 6 = 18 hours; trays +10 and +2 (five times); flashlight half per square; D3 12 ÷ 4 = 3; `stall-v1` hold numbers 2, 3, 4, 5; E2 = 4; E3: enumerating all 12 designs, only two pairs of straps plus hedge (4 coins) holds gust 5; one pair plus hedge holds 4 for 3 coins. A build test repeats these from shipped data.
- Every map, tray, flashlight and stall screen shows its model line.
- No screen gives storm-safety rules, a real forecast or a flood prediction; the grown-up card names services and quotes no rule beyond the cited NWS line.
- No thunder audio by default; the café scene shows the cast indoors and calm.
- D3 accepts 3 only; B5 accepts 18 only.
- Browser at 320 and 820 px; touch targets at least 44 px; drag actions have tap alternatives.

## Review asks

- **Subject check:** the probability wording "on 10 days like this"; the map-arrow vs vane line; AEMET's recurrence basis, if a real D3 number is wanted.
- **Owner, Storm Safety:** claim it as partial (default), or leave it unclaimed until a storm-safety pack with reviewed grown-up material exists?
- **Owner, history depth:** Le Verrier and FitzRoy on one card at Seedling and up (default), or Keeper's Desk only?
- **Owner, Thunder & Lightning:** leave the topic to specs 146 and 163 (default), or let this pack target it with no new teaching?
