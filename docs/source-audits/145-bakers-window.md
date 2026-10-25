# The Baker's Window: source audit

For [spec 145](../specs/145-bakers-window.md) and its [companion text](../content/145-bakers-window-text.md). Written 2026-10-25. Writing only; independent science review is still required.

## Verification status: read this first

**First draft (2026-10-25):** live checks were unavailable (the session's search allowance was exhausted and page fetches failed at the proxy), so claims were split into locally corroborated ones and `[check]` items.

**Fact-check pass (same day):** a fresh search allowance was used for 18 standard web searches. Page fetches stayed blocked, so every confirmation below rests on **search-result excerpts**, not full pages read. All nine former `[check]` items were confirmed and the markers removed; no claim was cut; one wording changed ("room temperature" became "20 °C" for the salt figure). Where the best source found was secondary or a cooking reference, the table says so. A reviewer should open the key pages before build.

No primary source, quotation, diary or eyewitness voice is invented. The town, the baker, his bench, Hollis's pages and all characters are fiction and are labeled "A story from Willowbank."

## Sources from the first draft (locally corroborated)

| Source | Publisher | URL | Supports | How corroborated |
| --- | --- | --- | --- | --- |
| Evaporation and the Water Cycle | USGS Water Science School | https://www.usgs.gov/water-science-school/science/evaporation-and-water-cycle | Evaporation changes liquid water to gas (vapor); condensation is the reverse; evaporation below boiling. Supports the pages drying, the open jar, C4-C6. | Opened 2026-10-22 for [audit 102](102-cold-window-same-water.md); also cited in the built Water Lab evaporate visit. |
| Condensation and the Water Cycle | USGS Water Science School | https://www.usgs.gov/water-science-school/science/condensation-and-water-cycle | Vapor in air becomes liquid on a cold surface; vapor is usually unseen. Supports "window water came from the air," the white-cloud item A5 and the glossary. | Opened 2026-10-22 for audit 102. |
| The water cycle | NOAA Education | https://www.noaa.gov/education/resource-collections/freshwater/water-cycle | Condensation depends on conditions; simple cycle diagrams understate the real cycle. Supports the "revisit only, no full water-cycle claim" boundary. | Opened 2026-10-22 for audit 102. |
| National curriculum in England: science programmes of study (KS1 and KS2) | UK Department for Education | https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study | Y4: group materials as solids, liquids, gases; observe changes of state on heating and cooling and measure the temperature in °C; evaporation and condensation. Y5: dissolving and recovery by evaporation; separating by filtering, sieving, evaporating; dissolving, mixing and changes of state are reversible; some changes form new materials and are not usually reversible, including burning and acid on bicarbonate of soda. | Cited (verified: true) in the Marble records for all ten targets. |
| Science programmes of study: Key Stage 3 | UK Department for Education | https://assets.publishing.service.gov.uk/media/5a7d563de5274a2af0ae2ffa/SECONDARY_national_curriculum_-_Science_220714.pdf | Particle model: arrangement, motion and closeness explain states and changes; conservation of mass in changes of state and dissolving. Supports section (d), set E. | Cited in Marble records `mt_ehC1wsdmUz`, `mt_htAYR-iCFF`. |
| NGSS 2-PS1-4, 5-PS1-2, 5-PS1-3, 5-PS1-4, MS-PS1-4 | Next Generation Science Standards | https://www.nextgenscience.org/pe/5-ps1-2-matter-and-its-interactions (and sibling pages) | Some heating and cooling changes can be reversed and some cannot; total weight of matter is conserved when substances are heated, cooled, mixed or dissolved; properties identify materials; mixing can make new substances; particle models of state change. | Cited (verified: true) in Marble records. |
| Common Misconceptions About States and Changes of Matter | Beyond Penguins and Polar Bears, Ohio State University | https://beyondpenguins.ehe.osu.edu/issue/water-ice-and-snow/common-misconceptions-about-states-and-changes-of-matter-and-the-water-cycle | Powders called liquids; white "steam" taken for vapor; melting confused with dissolving; "sweating" glass. Supports misconception tags. | Cited in Marble records `mt_1JFUNQDwAJ`, `mt_YQkUdIHO8L`, `mt_Pl-nsjYGZ3`, `mt_Qkewo5M3_c`. |
| Marble teaching-research records, `data/teaching-research.json` at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` | Generative Spark (Marble), CC BY-SA 4.0 | https://github.com/withmarbleapp/os-taxonomy | Learn constraints and misconceptions for each target (paraphrased in the spec's upstream table). Also internally states: water 0 °C / 100 °C at normal atmospheric pressure; chocolate melts over a range; one sign of change is not proof; fizzy-drink bubbles are already-dissolved gas; cooking egg and cake makes new materials; dissolving salt in water gives a slightly smaller total volume. | Read locally from the refreshed clone. The records say their own sources were not re-fetched in their last rewrite, so these are secondary corroboration. No record text is copied. |

## Claims and their status

| Claim in the text | Status |
| --- | --- |
| Solids keep shape; liquids take the container's shape and keep volume; gases fill the space | Corroborated: DfE Y4 via Marble. |
| Powder grains are solids | Corroborated: Marble records, OSU misconceptions page. |
| Water vapor is invisible; the white cloud is tiny liquid drops | Corroborated: USGS condensation (audit 102); Marble constraints. |
| Window drops come from vapor in the air, not through the glass | Corroborated: USGS (audit 102). |
| Evaporation happens below boiling, faster when warmer | Corroborated: USGS; DfE Y4 rate-with-temperature. |
| Pure water freezes at 0 °C and boils at 100 °C at sea-level pressure | Corroborated by Marble record citing DfE; standard. Reviewer should confirm wording "at sea level." |
| Melting and freezing are reversible; melted chocolate sets again | Corroborated: DfE Y5 via Marble. |
| Chocolate and butter melt over a range of temperatures | Chocolate corroborated by Marble record; butter confirmed in the fact-check pass below. |
| Dissolving keeps the solid present; recovered by evaporation | Corroborated: DfE Y5, NGSS 5-PS1-2. |
| Mass conserved in a closed jar when dissolving or melting | Corroborated: NGSS 5-PS1-2; DfE KS3. |
| Sieve / filter / evaporate by property difference; filter passes dissolved salt | Corroborated: DfE Y5 via Marble. |
| Irreversible changes make new substances; burning, cooking examples; matter not destroyed | Corroborated: DfE Y5; Marble irreversible record. |
| Clues to a new substance are not proof; fizzy drinks hold dissolved gas | Corroborated: Marble irreversible record. |
| Particle-picture conventions (same size and number, empty gaps, solids vibrate, melting keeps particles close) | Corroborated: DfE KS3, NGSS MS-PS1-4 via Marble. |
| Salt water's volume is slightly less than water plus salt separately | Corroborated: Marble particles record (salt in water named as an observable case). Older-depth note only. |

## Fact-check pass: former open checks (search excerpts, 2026-10-25)

| Former `[check]` | Result | Sources (from search excerpts) |
| --- | --- | --- |
| Yeast makes carbon dioxide gas; bubbles make dough rise | **Confirmed.** Yeast ferments sugars to carbon dioxide (and ethanol); gluten traps the gas. | Britannica, "leavening agent" https://www.britannica.com/topic/leavening-agent ; Britannica Kids https://kids.britannica.com/students/article/leavening-agent/631623 ; David Moore, fungi4schools (bread) https://davidmoore.org.uk/assets/fungi4schools/Documentation/04Favourite_Fungus/FF05_bread.pdf |
| Baking makes new substances; bread cannot become dough | **Confirmed, secondary sources.** Maillard browning makes new color, flavor and aroma compounds in the crust; protein and starch setting form the crumb; not reversible. DfE Y5 names cooking-type changes as not usually reversible (via Marble). | ScienceABC, Maillard reaction in toast https://www.scienceabc.com/pure-sciences/why-does-bread-turn-so-crispy-and-tasty-when-toasted-maillard-reaction ; Biology Insights, "Is baking a chemical reaction?" https://biologyinsights.com/is-baking-a-chemical-reaction/ . A food-science text would be stronger. |
| About 36 g salt dissolves in 100 g water | **Confirmed;** wording set to "at 20 °C". 36.0 g/100 mL at 20 °C (about 35.9 g/100 g); changes little with temperature. | PMC solubility table https://pmc.ncbi.nlm.nih.gov/articles/PMC9301692/table/tbl3 ; AUS-e-TUTE solubility table https://www.ausetute.com.au/soltable.html |
| Water boils a little below 100 °C higher up | **Confirmed,** kept qualitative. Lower air pressure lowers the boiling point; about 1 °C per roughly 300 m is a common rule of thumb. | Engineering ToolBox, boiling points vs altitude https://www.engineeringtoolbox.com/boiling-points-water-altitude-d_1344.html ; Vedantu, evaporation vs boiling https://www.vedantu.com/chemistry/difference-between-evaporation-and-boiling . No USGS page surfaced. |
| Cooled chocolate can look dull or streaky; still chocolate | **Confirmed.** Melting and re-setting without tempering can cause fat bloom: cosmetic, still chocolate. | Michigan State University Extension, "Blooming chocolate" https://www.canr.msu.edu/news/blooming_chocolate ; The Conversation https://theconversation.com/whats-this-white-stuff-on-my-easter-chocolate-and-can-i-still-eat-it-181274 |
| Butter melts over a range | **Confirmed.** Milk fat is a blend of fats; butter has no single melting point (roughly 28-36 °C, sources vary). | University of Richmond, chemistry of cooking handout https://blog.richmond.edu/chemistryofcooking/files/2021/04/20S-10.3-Cooking-with-Fat.pdf ; MSU Extension https://www.canr.msu.edu/news/buttergate ; The Physics Factbook https://hypertextbook.com/facts/2003/JessicaCheung.shtml |
| Melted butter can separate as it sets | **Confirmed, cooking references.** Butter is butterfat, milk solids and water (about 15-20%); melting separates them (the basis of clarified butter). | CooksInfo https://www.cooksinfo.com/clarified-butter ; Nigella Lawson, "melted butter" https://www.nigella.com/ask/melted-butter |
| Paper does not melt; too much heat scorches or burns it | **Confirmed.** Cellulose decomposes before reaching a melting temperature under ordinary heating (research lasers are a special exception, not relevant here). | Fraunhofer IWS, melting of paper materials https://iws.fraunhofer.de/en/technologyfields/cutting-and-joining/microprocessing/schmelzen-von-papierwerkstoffen.html |
| Sugar dissolves faster when warm or stirred | **Confirmed.** | Lumen Learning, rate of dissolving https://courses.lumenlearning.com/umes-cheminter/chapter/rate-of-dissolving/ ; Curriculum Visions, speeding up dissolving https://www.curriculumvisions.com/newhome/science/yr6/6C/4detail2Text.html |

### Re-confirmed corroborated claims (search excerpts)

| Claim | Sources |
| --- | --- |
| Condensation: vapor in air becomes liquid on a cool surface | USGS, condensation (kids' Water Science School) https://water.usgs.gov/edu/gallery/watercyclekids/condensation-beg.html ; USGS image, condensing on chilled glasses https://www.usgs.gov/media/images/water-condensing-chilled-eye-glasses-can-be-annoying |
| Steam is invisible; the white cloud is liquid drops | Indiana Public Media, A Moment of Science https://indianapublicmedia.org/amomentofscience/clouds-kitchen.php ; Curriculum Visions https://curriculumvisions.com/search/S/steam/steam.html |
| Evaporation at the surface below boiling; boiling throughout at the boiling point | Vedantu https://www.vedantu.com/chemistry/difference-between-evaporation-and-boiling (secondary) |
| 0 °C / 100 °C at standard pressure | Results were low-authority; the claim rests on the DfE curriculum via Marble. Britannica did not surface. Reviewer: cite NIST or Britannica. |
| Mass conserved when salt dissolves in a closed container | Utah Education Network lesson plan https://www.uen.org/lessonplan/print/33067.pdf ; NGSS 5-PS1-2 (above) |
| Filter passes dissolved salt; evaporation recovers it; filter sand first | Classroom sources only (Vedantu; school worksheet); DfE Y5 via Marble remains the main support. |
| Cooking an egg is irreversible (protein denaturation and coagulation) | Nature abstract https://www.nature.com/articles/204287a0 ; Wellesley College chemistry blog https://blogs.wellesley.edu/chem106/2015/03/30/reversible-irreversible-denaturation-of-proteins |
| Fizzy-drink bubbles are dissolved carbon dioxide released when opened | Live Science https://www.livescience.com/32492-why-does-soda-fizz.html |

### Still open

- No claim is marked `[check]`. Because every confirmation came from search excerpts, a reviewer should open the full pages, starting with the 0 °C / 100 °C citation (add NIST or Britannica), baking chemistry and melted butter separating.

## Numbers

All problem-set and scale numbers are made-up model values chosen for whole-gram arithmetic, labeled as a made-up model in the text. They were checked by a scratch script (`check145.py`, run with `python3 -I`, 17 checks passed): 100 + 20 = 120; 250 + 15 = 265; 30 → 30; 180 − 150 = 30; 7 − 4 = 3; 120 − 100 = 20 (water left, 80 g water and 20 g salt remain); thermometer halfway 20-30 = 25; 100 − 0 = 100; 300 − 50 = 250; 20 + 10 + 100 = 130 with 10 g salt recovered; 50 → 50; 120 + 5 = 125. The page masses (7 g wet, 4 g dry) are illustrative, not measured.

## Images and rights

No image is embedded or proposed from an outside source. All bench art (cases, scale, filter, particle boxes) is to be original, simplified drawing. If a later pass wants a real photograph (for example of salt crystals or a salt pan), prefer public-domain government images (USGS, NPS) or museum open-access images with asset-specific rights checked, as in [audit 106](106-fossil-close-look.md). Marble and Jane supply no art, copy or code here.

## Upstream licenses

Marble taxonomy and research: ODbL 1.0 database / CC BY-SA 4.0 descriptive content, © Generative Spark, Inc.; paraphrased only. Jane (`0ec55f7e083976e6fcc3977fca460b1f5e199d91`): code MIT, lesson and docs CC BY-SA 4.0; design patterns referenced, no text or code copied.

## Review pass, 2026-10-25 (independent reviewer)

No new searches: the remaining claims are standard school science already corroborated above. Every number in the scale model and sets C and D re-run with `python3 -I` (reviewer scratch `review-145/`); all correct. A stale "120 + 5 = 125" entry with no matching item was removed from the spec's check list. Target ids and every hard prerequisite re-checked by script against the pinned Marble files; the crosswalk is complete and correctly named.

Fixed: Scene 1 aligned with spec 138's version of the same beat (there the baker already knows paper likes slow, warm air), so Pip now fears the pages will melt and the baker knows the rule but not the reason; the spec's Act I link moved to chapter 3, *investigate and plant*, where spec 138 places the drying pages; B6 sorts "a cake baking" instead of "dough rising" (rising alone is a contestable case at this depth, as the spec's own review ask noted), and dough enters the bench sort only after baking; the optional "say it" prompt no longer asks about the child's home (it uses the bakery picture).
