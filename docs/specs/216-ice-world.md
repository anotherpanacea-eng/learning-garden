# 216. Ice World: the polar regions

Status: **proposed, 2026-10-25; writing only, awaiting independent spec review and a subject check.** Part of the [history and science build-out](../history-and-science-buildout.md) (wave 6). Every child-facing line is in [the companion text](../content/216-ice-world-text.md); sources and open checks are in the [source audit](../source-audits/216-ice-world.md).

**Commissioning boundary:** a proposal only. Select a bounded first slice after independent review; the nine activities do not commission each other. Story links are future adapters to [spec 120](120-keeper-of-the-ways.md); standalone play stays open and no completion is inferred from a missing adapter. Ice stays on screen; off-screen cards are grown-up-led. The Many Voices cards need review by Arctic Indigenous readers or organizations before build, as spec 153's book 6 does.

## Purpose

Polar Regions is half-covered. [Spec 144](144-ways-of-the-birds.md) owns Arctic vs Antarctic and a narrow polar-animal slice; [spec 153](153-cold-shelf.md) owns the two poles' structure, midnight sun, cold-weather adaptations, polar food chains, glaciers and ice sheets, the Inuit and Sámi, the race to the South Pole and the Antarctic Treaty. Nobody yet teaches the youngest polar ideas (ice floats, snow is crystals, penguins), the tundra as land, why polar climates are cold and dry, the cryosphere as one store, how polar oceans drive world climate, a whole-ecosystem comparison, exploration then and now, or the decisions that face the poles. This pack builds on 144 and 153 and re-teaches neither.

A child comes to understand that ice and snow are frozen water, that ice of any size floats with most of an iceberg hidden, and that snow is tiny ice crystals; that penguins are swimming birds of the south, the emperor the largest, huddling in winter with the father holding the egg; that the Arctic tundra is treeless land over permafrost with a short, busy summer; that slanted sunlight makes polar climates cold, and a desert is about dryness; that most fresh water is frozen in a cryosphere tied into the water cycle; that cold, salty polar water sinks, bright ice reflects sunlight and rising water feeds the Southern Ocean; that the two poles hold different ecosystems for a reason; that polar exploration turned from being first to understanding the ice; and, at the Keeper's Desk, that polar decisions weigh many real needs.

## Place and story

**Host:** **The Snow Well**, `#mill/snowwell` (new; no spec on main uses it). A round stone hut over the old snow pit up the hill from the mill, now holding a long table, a globe and a tank: fiction, labeled. Linked from `#library/poles` (153), `#living/pass` (144), `#science/station` (140) and `#mill/energy` (147). Open from the start; every activity is open on the first visit.

- **Act II, chapter 2 (a garden across the seasons), in winter:** ice on the garden trough bobs back up under Pip's paws; a snowflake on his sleeve shows six arms under the librarian's lens; the miller mentions the snow well. Opens (a).
- **Act II, chapter 4 (the first show):** Pip wants paper penguins to fly in on strings; Dot says they swim; Bramble plays the emperor father with a paper egg on her boots; the show becomes "a true show". Opens (b).
- **Act III, chapter 3 (the route by the high ford):** above the trees on the courier's path, moss, grass and late snow (season-neutral, since seasons follow the real calendar); "like the tundra, but cold because we're high". Opens (c) and (d).
- **Act III, chapter 4 (letters up and down the river):** Léon's damp letter asks why Les Saules's river runs full each spring. Opens (e).
- **Act IV, chapter 3 (the newspaper's two explanations, and what other places did):** the librarian adds *Many voices at the top of the world* to the Travelers' Archive. Explicitly someone else's question; it never feeds the low-fields meeting. Opens (i).
- **Act V (a question of your own):** "Why does cold water sink?" can start a project from (f) or (h).

Every scene is an optional job; none decides a town choice, and the old Keeper is not mentioned. Cast pronouns follow spec 120. The snow well, the show and the letters are fiction; the Pyrenean snow wells on the history card are real.

## The knowledge

**Ice and snow (Sprout).** Water can be liquid or solid (ice, snow); melting and freezing change the same water (states and particles are specs 145 and 168). A cup of ice is lighter than a cup of water, so ice of any size floats; a pebble sinks while a big block floats, so size does not decide. An iceberg is a huge floating chunk of ice; only the tip shows (153 gives the nine-tenths figure at Sapling; not repeated). Snow is tiny ice crystals; their six-fold shape comes from how water molecules stack.

**Penguins (Sprout).** Birds whose wings became flippers: no flying, excellent swimming (144's bird classification revisited). Wild penguins are a southern group, from Antarctica to warm coasts (African, Galápagos penguins); none in the Arctic. The Galápagos penguin's range straddles the equator, so child text says "in the south", never "only south of the equator". Emperors are the largest (an average bird stands about 1.15 m, 45 in, National Geographic). In winter they huddle and take turns in the warm middle. The female lays one egg and passes it to the male, who holds it on his feet under a fold of skin (the brood pouch) for about 65 days, living on his fat; she returns about when it hatches, after which both parents share the chick's care. In every other penguin species both parents share incubation. Waddling on land is shown; belly sliding is left out until checked.

**The Arctic tundra (Seedling).** Wide, treeless land around the Arctic Ocean. Permafrost is ground that stays at or below 0 °C for at least two years; it underlies about a quarter of exposed Northern Hemisphere land (NSIDC). Only the top active layer thaws each summer (about 25 to 100 cm, one Canadian fact sheet). Causes of treelessness: frozen ground blocking deep roots and drainage, cold, wind and a growing season of a few weeks (6 to 10 weeks in one education source; child text says "a few weeks"). Summer brings mosses, lichens, sedges and grasses, low flowering plants and dwarf shrubs, and snowy owls, lemmings, Arctic foxes, musk oxen and caribou (reindeer). Tundra is land, not sea ice. Treeless mountain slopes above the trees look similar but are cold because of height, not latitude.

**Polar climate (Sapling).** Latitude is the master control: near the equator noon sunlight arrives high; near the poles it arrives low and spreads over more ground (model `beam-v1` below). Five main Köppen groups: tropical, dry (arid), temperate, continental, polar; a polar climate's warmest month averages below 10 °C (tundra 0 to 10 °C, ice cap below 0 °C every month). Polar climates are dry and windy: a desert gets under about 250 mm of precipitation a year, and Antarctica's interior gets under about 50 mm, making Antarctica the largest desert (about 14.2 million km² against the Sahara's 8.6 to 9.2 million, by source). Thick ice comes from a little snow that never melts, over ages. Distance is not the cause (Earth is closest to the Sun in early January, spec 179's card). Weather and climate stay spec 140's. Willowbank's valley is temperate; its high peaks are cold because they are high.

**Earth's frozen water (Sapling).** The cryosphere is every store of frozen water: snow cover, sea ice, lake and river ice, glaciers, ice sheets and permafrost. About 2.5% of Earth's water is fresh; about 68.7% of that is in ice caps and glaciers (USGS); the Antarctic and Greenland ice sheets alone hold over 68% (NSIDC). Melting all Antarctic ice would raise the sea about 58 m and Greenland's about 7.4 m (NSIDC), so more than 65 m: taught as a thought experiment, never a forecast. The cryosphere is an active store in the water cycle (spec 140): evaporation, snowfall, ice, meltwater and icebergs back to the sea. Land ice raises the sea when it melts; floating ice already displaces its weight (153's say-why item, now enacted with two glasses). Pyrenean rivers fed by high snow run highest in late spring.

**Polar oceans and world climate (Sapling, Keeper's Desk).** Density depends on temperature **and** salt (never temperature alone). When sea ice forms, most of the salt (70 to 90% in one review) is left in the water below, which grows saltier, colder and denser and sinks; near Antarctica this feeds Antarctic Bottom Water. Sinking polar water drives the deep overturning circulation (the "conveyor"), which moves heat around the world on a timescale of about 1,000 to 2,000 years. Albedo: open ocean reflects about 6% of sunlight, bare sea ice 50 to 70%, snow-covered ice up to 90% (NSIDC via SEOS; Wikipedia table); losing ice exposes dark water, which absorbs more and warms, melting more ice (a feedback). Around Antarctica, deep nutrient-rich water rises; phytoplankton bloom and krill feed on them, making the Southern Ocean very productive (153's chain board carries the arrows).

**Two polar ecosystems (Sapling).** Cause first: the Arctic is an ice-covered ocean nearly surrounded by land that links to other continents; that is why it has tundra and sea, land mammals, sea-ice hunters and people (about 4 million, about 500,000 Indigenous; Arctic Council). Antarctica is a high, ice-covered continent isolated by the Southern Ocean: no land mammals, two native flowering plants (Antarctic hair grass, Antarctic pearlwort) plus mosses and lichens, and a wingless midge (*Belgica antarctica*, about 2 to 6 mm) as the largest year-round land animal; its life crowds into the sea. Both rest on phytoplankton; krill in the south, copepods especially in the north. Both are changing fast: the Arctic warmed nearly four times faster than the globe from 1979 to 2021 (Rantanen and others, 2022). Short chains make harm at the base spread upward in this teaching model; real webs have more links.

**Then and now (Sapling).** The Heroic Age (1897 to 1922, from the *Belgica* to Shackleton's death; the end date is debated): 17 major expeditions from many countries, wooden ships, dogs, skis, man-hauling, compass and sextant; real science, but being first and coming home dominated; 22 expedition members died (Wikipedia; Keeper's note at Sapling and Keeper's Desk only, no names or details). Amundsen, Scott and Shackleton stay spec 153's. Shirase's Japanese expedition (*Kainan Maru*, 1910 to 1912) reached 80°5′ S on 28 January 1912, named the plain Yamato Yukihara, and lost no one. Now: icebreakers, aircraft, heated stations, GPS, satellites (sea ice watched since 1979), ice-core drills; the question changed from "can we get there" to "what is the ice doing, and why". Who goes changed too: on 12 November 1969 six women (Lois Jones, Kay Lindsay, Eileen McSaveney, Terry Tickhill, Pam Young of New Zealand, and reporter Jean Pearson) stepped off a plane at the South Pole together; Liz Thomas leads the British Antarctic Survey's ice-core team. Teams are international.

**Many voices (Keeper's Desk).** Values with no single right answer, grounded in real mechanisms. The Antarctic Treaty (153) keeps Antarctica for peace and science. CCAMLR members agreed the Ross Sea MPA on 28 October 2016 (about 1.55 million km², about 72% no-take, in force December 2017, for 35 years); CCAMLR acts only by consensus, so one member can stall a proposal. In the Arctic the land and much of the sea belong to the Arctic states, and some waters are disputed: Canada treats the Northwest Passage as internal waters and the United States as an international strait; a 1988 agreement sets the question aside. The Arctic Council (1996) has eight member states and six Indigenous Permanent Participants with full consultation rights. The Paris Agreement (adopted 12 December 2015, in force 4 November 2016) aims at well below 2 °C and pursues 1.5 °C; countries can join and leave. Each stakeholder card states a need and a worry; no villain, no winner.

**History cards (real, checked).** Pyrenean snow wells (about 150 in Huesca province, protected in 2021; snow layered with straw, ice cut in summer and carried by night); Iran's domed yakhchāl and Gyeongju's stone ice store (Korea); the snowflake watchers (Kepler 1611; Bentley's first photograph, 1885; Nakaya's lab-grown crystal, Japan, 1936); Shirase; the Heroic Age; six women at the Pole; satellites since 1979; the Ross Sea; the Arctic Council; the Paris Agreement; the Northwest Passage disagreement.

## The lesson

Every activity follows Jane's **teach → guided → practice** order: a teach card with a worked example revealed a step per tap, a guided first item with 1-4 visible steps, then practice.

| Activity | Depth | Teach | Guided | Practice |
| --- | --- | --- | --- | --- |
| (a) Ice and Snow Table | Sprout | T1-T5 | Drop, push, let go (2 steps) | Set 1 |
| (b) The Penguin Show | Sprout | T6-T7 | Pick true scenes | Set 2 |
| (c) Tundra Year | Seedling | T8-T9 | January, then July (3 steps) | Set 3 |
| (d) The Climate Globe | Sapling | T10-T12 | 0° then 60° (3 steps) | 4.1-4.2, 6.1 |
| (e) The Frozen Water Store | Sapling | T13-T14 | Two glasses, predict then melt | 4.3-4.4, 6.2-6.3 |
| (f) The Cold Sea Engine | Sapling, Keeper's Desk | T15-T17 | Blue and yellow jars (2 steps) | 4.5-4.6, 5.1, 6.4-6.5 |
| (g) Two Poles Table | Sapling | T18 | Place the first card (2 steps) | 5.2-5.3 |
| (h) Then and Now | Sapling | T19 | Flip "Goal" (1 step) | 5.4-5.5 |
| (i) Many Voices | Keeper's Desk | T20 | Read two cards | 5.6, 6.6-6.7 |

**"I'm stuck" ladder** on every item: (1) the item's hint; (2) an easier worked case plus how to start this one (thirteen in the companion); (3) **Skip for now**, with nothing lost and nothing recorded against the child.

**Contrasts:** big vs sinks; tip vs whole; ice vs a new stuff; fly vs swim; north vs south; father vs nest; tundra land vs sea ice; height vs latitude; slant vs distance; hot vs dry desert; land ice vs floating ice; cold and salty vs warm; bright vs dark; Arctic vs Antarctic by cause; be first vs understand; protect vs use.

**Misconceptions designed against** (codes in the companion): ice-not-water, heavy-sinks, tip-is-all, snow-is-fluff, melting-destroys-water, penguins-north, all-birds-fly, swims-means-fish, mother-on-a-nest, alone-in-the-cold, no-trees-not-planted, never-thaws, tundra-is-sea-ice, distance-causes-cold, deserts-are-hot, lots-of-ice-lots-of-snow, fresh-water-in-rivers, all-ice-raises-sea, warm-water-sinks, only-salt-matters, albedo-is-minor, poles-same, then-was-climate-science, exploration-ended, poles-are-empty, one-decider, good-guys-and-bad-guys.

## The game or activity

**(a) Ice and Snow Table, model `float-v1`.** A clear tank with a dashed water line. Drop an ice cube, a big block, an iceberg or a pebble; push ice down and it bobs back; side view shows most of the ice below the line (about nine-tenths, drawn, not stated at Sprout). The lens zooms a flake to six arms. A melt strip runs ice → water → ice. The globe card places ice near both poles. Model line: "A drawing of a tank. Real ice floats a little higher or lower depending on the water."

**(b) The Penguin Show.** The child picks scene cards for a "true show": six true cards, three not-true cards read back, never refused. A size line-up (emperor to Galápagos penguin), a huddle board (tap an edge bird into the middle; everyone gets a turn) and the egg-on-feet card. Paper penguins are labeled as pretend.

**(c) Tundra Year, model `tundra-v1`.** *A made-up model.* A cutaway with a month dial. Thaw depth (cm): 0 from October to May, 20 in June, 45 in July, 60 in August, 40 in September. Plants grow when the thaw reaches 45 cm (July, August: about nine weeks, inside the 6-10 week range). **Plant a tree** needs 100 cm and never takes root. Tappable animals; a land-or-sea card. Model line: "A drawing with made-up depths. Real thaw depth changes from place to place and year to year."

**(d) The Climate Globe, model `beam-v1`.** A latitude slider (0° to 90°), five zone bands and data cards. The beam is noon at the March equinox, Sun altitude 90° − latitude; patches covered = 1 ÷ sin(altitude): 1.0 at 0°, 1.2 at 30°, 1.4 at Willowbank (42.5°), 2.0 at 60°, 2.9 at 70°, 5.8 at 80° (Sapling readout; Seedling sees the picture only). Model line: "The beam shows noon in March. Real zones bend around mountains, seas and winds."

**(e) The Frozen Water Store, model `melt-v1`.** Tap-to-reveal cryosphere map; fresh-water bars (frozen 69, underground 30, the rest 1 of 100); two glasses (ice floating; ice on a rock): predict up/same/down, then melt: the floating glass barely changes, the rock glass rises; a five-card water loop; the 65 m what-if card. Model line names the salty-ocean nudge.

**(f) The Cold Sea Engine, models `sink-v1` and `shine-v1`.** Four jars stack by density (standard values, kg/m³: cold salty 1028.1, warm salty 1024.8, cold fresh 999.9, warm fresh 998.2): one stable order of 24. **Freeze** shows salt left behind and the water sinking. Shine meter: snow on ice 90/10, bare ice 60/40, ocean 6/94 (reflect/absorb of 100). Keeper's Desk strip: ten patches, each melted patch adds 54 absorbed (400 to 940). Conveyor and upwelling cards. Model line: "Round numbers inside the real ranges."

**(g) Two Poles Table.** Seven rows × two columns of cards; a cause card and a shared-base card. Placements can change; a misplaced card asks "Which pole is ringed by land?"

**(h) Then and Now.** Six rows flip between 1897-1922 and today; a question card; the Liz Thomas card and the history cards.

**(i) Many Voices (Keeper's Desk).** Six voice cards (need and worry each), a protect/use/both board with no winner, four mechanism cards. Voice cards are invented people drawn from public positions, labeled.

No timers, scores, streaks, medals or locks.

## Problem sets

Six sets, **34 items**, full text in the companion:

| Set | Depth | Items | Formats |
| --- | --- | --- | --- |
| 1. Ice and snow | Sprout | 5 | 3-choice, order cards |
| 2. Penguins | Sprout | 5 | 3-choice |
| 3. Tundra Year | Seedling | 5 | 3-choice, sort |
| 4. Climate and frozen water | Sapling | 6 | 3-choice |
| 5. Two poles, then and now | Sapling | 6 | 3-choice |
| 6. Keeper's Desk | Keeper's Desk | 7 | 3-choice, number with steps, one *say why* |

Sprout items carry no digits. Right answers among the 27 three-choice items: **A 9, B 9, C 9**. Option length gives nothing away: the right answer is the strictly longest option in 7 items, the strictly shortest in 6, in the middle in 12, and two items (4.5, 5.6) have three equal-length options. Prompts are 15 words or fewer. *Say why* is spoken to a grown-up, never auto-graded or stored.

## Saved work

Optional root `iceworld` per explorer, absent until a first explicit action.

```
iceworld: {
  version: 1,
  tank:   { source, kept: [{ piece, pushed, view, at }] },          // latest 8 readable
  show:   { source, picked: [cardId], at } | null,
  tundra: { source, kept: [{ month, tree, at }] },                   // latest 8
  globe:  { source, kept: [{ lat, at }] },                           // latest 8; readout re-read from source
  store:  { source, predictions: { floating, rock }, loop: [cardId], at } | null,
  engine: { source, stack: [jarId], melted: 0..10, at } | null,
  poles:  { source, placed: { [cardId]: 'arctic' | 'antarctic' }, at } | null,
  thennow:{ source, flipped: [rowId], at } | null,
  voices: { source, sides: { [cardId]: 'protect' | 'use' | 'both' }, at } | null,
  answers:{ [itemId]: { source, choice | value | order | sort, support: ['hint'|'example'|'skip'], at } }
}
```

- `source` freezes the model version, its table and each item's choices and order. Codes and numbers only; *say why* is not stored.
- Never rewrite saved results on load; validate ids, months 1-12, latitudes 0-90, `melted` 0-10; an unreadable entry stays raw and exportable while everything else stays open.
- Support codes stay separate from answers; no mastery flag. Writes preflight through `prepareProgressImport`; export, import, reset and switching are shared.

## Curriculum fit

**Strands:** **S4** biomes and ecosystems (tundra, two poles); **S3** adaptation (penguins, revisiting 144 and 153); **S7** Earth's water, climate and oceans; **S5** states of matter at Sprout (145's); **S1** models and their limits, fair comparison (two glasses, jars); **H1/H2** exploration then and now, snow wells and ice houses in three cultures; **E4** spoken say-why; **M2/M3** sums, shares and a share of a share at Keeper's Desk. Act families: II (seasons, show), III (route, letters), IV (archive, reading only), V (projects).

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Ice and snow as water, floating and the hidden iceberg; penguin facts; the tundra and permafrost; latitude and the polar climate; the cryosphere in the water cycle; sinking, albedo and upwelling; two ecosystems by cause; then and now; many voices. |
| Teaching encounter | T1-T20 with step-by-step worked examples; each bench's guided first run. |
| Contrast | Pebble and block; true and not-true show cards; tundra and sea ice; height and latitude; two glasses; four jars; ice and ocean on the shine meter; then and now rows; protect and use. |
| Supported practice | Guided items with visible steps; the ladder; bench readouts; read-back cards. |
| New application | Alpine tundra on the high ford; Léon's spring river; the strip bench; the Ross Sea share; the Act V question. |
| Purposeful revisit | 144 (birds, penguins-north), 153 (two poles, chain board, glaciers, Treaty, sea-ice trend), 140 (water cycle, weather vs climate), 145/168 (states), 179 (the January card), 133's timeline (1897, 1912, 1969, 1979, 2016). |
| Data boundary | Bench settings, placements, choices and support codes, all local. No timing, free text, location or body data. |

## Upstream check

Jane refreshed at `0ec55f7e083976e6fcc3977fca460b1f5e199d91` and Marble at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac`. All nine ids are in the pinned `curriculum/marble/topics.json`, and no spec on main mentions any of them (`grep -rl` over `docs`, 2026-10-25). Each research record was read; paraphrases are mine and no record text is copied.

| Target (pinned id) | What the research asks, and how this spec does it |
| --- | --- |
| Ice & Snow (`mt_SrmHaJXKrX`) | Predict-then-check floating; "a cup of ice is lighter than a cup of water", never "heavy sinks"; the hidden bulk; magnified crystals; melting keeps the water. Tank bench with push-down and side view, lens, melt strip, off-screen cup; T2-T5, Set 1. |
| Penguins (`mt_CK2orHetl3`) | A few sticky true facts, picture first; birds with flipper wings; south only, some in warm places; emperor largest, huddle turns, father holds the egg, then shared care; props named as pretend. The Penguin Show, T6-T7, Set 2. |
| The Arctic Tundra (`mt_X4CJpPRxae`) | Causes over features; permafrost cutaway with a thawing top layer; winter-summer pulse; land, not sea ice; a small animal cast. Tundra Year, T8-T9, Set 3. |
| Earth's Frozen Water (`mt_cMmG8VLbAp`) | One umbrella word with its parts; proportion bars; store and flows; land vs floating ice; the 65 m figure as a thought experiment. The Store, T13-T14, 4.3-4.4, 6.2-6.3. |
| Polar Climate Zone (`mt_GbZFuGDFsa`) | Latitude as the master variable through sunlight angle; desert means dry; weather vs climate; not distance. Climate Globe, T10-T12, 4.1-4.2, 6.1. The pinned "less rain than the Sahara" is not taught: the Sahara's driest parts get less than 25 mm, so the child text compares area and the 250 mm line instead. "Above 60° N/S" is shown as a picture band, not a rule. |
| Polar Conservation & Future (`mt_7QeiS95TRC`) | Many legitimate perspectives, no single answer; Indigenous rights as central; real mechanisms (Ross Sea MPA, Treaty, Paris); cooperation essential but strained; trade-offs said aloud; gauges labeled as models. Many Voices, T20, 5.6, 6.6-6.7. |
| Polar Ecosystems Compared (`mt_kOYw43NPzr`) | Contrast with a cause (ocean ringed by land vs isolated continent); a systematic frame, not animal lists; the shared phytoplankton base, copepods in the north; people in the Arctic; both changing. Two Poles Table, T18, 5.2-5.3. |
| Polar Exploration Then & Now (`mt_I_c57p0aGN`) | Compare by dimension (goal, tools, danger, people); tools change the questions; the Heroic Age was mostly about being first though it did science; not luck or weakness; modern scientists including women; no unverified core age stated. Then and Now, T19, 5.4-5.5. |
| Polar Oceans and World Climate (`mt_g1qgxmlJQ2`) | Cold, salty, dense water sinks (temperature and salt both); albedo as a feedback; upwelling feeding plankton; outputs labeled as models. Cold Sea Engine, T15-T17, 4.5-4.6, 5.1, 6.4-6.5. |

**Not claimed:** none of the nine was dropped. *Liz Thomas and Sylvia Earle* are the pinned examples; only Liz Thomas is named (Earle's polar link was not checked). Climate Change at the Poles (`mt_Fqna9qHffr`) and Ice & States of Matter (`mt_scbDHJZZHK`) are supported below, not claimed.

**Jane:** adopted the teach → guided → practice order, the three-step "I'm stuck" ladder, short second-person prompts, three options with misconception-tagged distractors and kind per-choice feedback, worked examples revealed a step at a time, and a glossary. Not adopted: points, medals, mastery, gates, timers, locks, scores, step-downs. No Jane code or text copied.

### Hard-prerequisite crosswalk

From the pinned `curriculum/marble/dependencies.json`:

| Target | Hard prerequisite | How it is met |
| --- | --- | --- |
| Ice & Snow (`mt_SrmHaJXKrX`) | Where Are the Poles? (`mt_4uPnLieBPN`) | Supported inline, no claim: T1 and the globe card (also inline in 153's book 1, unclaimed there). |
| Penguins (`mt_CK2orHetl3`) | Arctic vs Antarctic (`mt_aO018DkCun`) | Met elsewhere: spec 144 claims it (contrast postcards, `penguins-north`); T6 and 2.1 restate north and south. |
| The Arctic Tundra (`mt_X4CJpPRxae`) | Comparing Arctic & Antarctic (`mt_z9jn9HogfE`) | Met elsewhere: spec 153 (book 1, Which pole?); the land-or-sea card restates it. |
| Earth's Frozen Water (`mt_cMmG8VLbAp`) | Glaciers & Ice Sheets (`mt_5_kErPeeNu`) | Met elsewhere: spec 153 (book 5). |
| Polar Climate Zone (`mt_GbZFuGDFsa`) | Comparing Arctic & Antarctic (`mt_z9jn9HogfE`) | Met elsewhere: spec 153 (book 1). |
| Polar Conservation & Future (`mt_7QeiS95TRC`) | Climate Change at the Poles (`mt_Fqna9qHffr`) | Supported inline, no claim: 153's book 9 (sea-ice trend) plus T14-T16 here (land ice and sea level, the albedo feedback) and the Arctic warming card. Permafrost methane is not taught: documented gap for that part. |
| Polar Conservation & Future (`mt_7QeiS95TRC`) | Antarctic Treaty & Research (`mt_itldWmVItr`) | Met elsewhere: spec 153 (book 8). |
| Polar Ecosystems Compared (`mt_kOYw43NPzr`) | Polar Food Chains (`mt_7nduoLvoB1`) | Met elsewhere: spec 153 (chain board). |
| Polar Ecosystems Compared (`mt_kOYw43NPzr`) | The Arctic Tundra (`mt_X4CJpPRxae`) | Taught here: (c), T8-T9, Set 3. |
| Polar Exploration Then & Now (`mt_I_c57p0aGN`) | The Race to the South Pole (`mt_islVn_P28Z`) | Met elsewhere: spec 153 (book 7). |
| Polar Oceans and World Climate (`mt_g1qgxmlJQ2`) | Ice & States of Matter (`mt_scbDHJZZHK`) | Supported inline, no claim: ice and water states here (Set 1), sea ice vs glacier ice in 153's book 5, salt left behind when sea ice forms (T15). "Salt lowers the freezing point" stays a documented gap. |

## Checks for implementation

- **Numbers script run (2026-10-25):** `check216.py` (scratch, `python3 -I`) ran 346 checks, all passing: beam spreads and readouts; 58 + 7.4 = 65.4; 25 fresh drops and about 17 frozen; shine absorb values and the 400-940 strip (54 a patch); the jar order, unique among 24 stacks; tundra thaw rules (July and August only; no month reaches 100 cm); Ross Sea no-take about 1.1 million km² (about 2.2 times Spain); date spans 25, 57 and 47 years; 1 in 8; and a companion lint: 34 items, 27 three-choice with exactly one right answer each, A 9 / B 9 / C 9, prompts ≤15 words, feedback parts ≤20, no digits in Sprout items, no em-dashes or banned words, scene and teach lengths.
- **Independent review (2026-10-25):** fresh scripts `review-216/nums.py` (22 checks) and `review-216/lint.py` (213 checks: items, one right answer each, positions, option lengths, prompts, Sprout digits, banned words, 6-word runs shared with the research records) pass after fixes.
- Model lines on every bench; no numbers on Sprout screens; not-true show cards are read back, never refused; the 65 m card always says "thought experiment".
- The Many Voices folder never links to the Act IV meeting board.
- At 320 and 820 px: 44 px targets, tap-to-place as well as drag, text equivalents for the tank, beam, jars and tables.

## Review asks

**Subject expert:** (1) Is "most salt stays in the water" fair for new sea ice? (2) Are the shine numbers (90, 60, 6) fair round values? (3) Is "a few weeks" fair for the tundra growing season? (4) Does the voice-card set represent Arctic Indigenous positions fairly (community review)?

**Owner questions, with my defaults:**
1. Name the Northwest Passage disagreement to children? *Default: yes, Keeper's Desk card only, stated as both sides' positions.*
2. Mention countries leaving the Paris Agreement? *Default: "countries can join and can leave", with no country named.*
3. Keep the Heroic Age death count (22)? *Default: Keeper's note only, older depth, no names or details.*
