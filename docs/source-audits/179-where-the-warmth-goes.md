# Where the Warmth Goes: source audit

Audit for [spec 179](../specs/179-where-the-warmth-goes.md) and its [companion text](../content/179-where-the-warmth-goes-text.md). Date: 2026-10-25. All proposed copy, characters, scenes and the four bench models (`shade-v1`, `clack-v1`, `teapot-v1`, the Watts Desk) are original. No learner or family record, image, worksheet or lesson code is included.

## Verification method (read first)

- 15 web searches (standard mode), within the wave budget of 18. **WebFetch was blocked, so no page was opened in full.** Each claim below was judged from search-result excerpts of the named pages. Several excerpts came from secondary or school-level pages; a reviewer should open the key pages before build. Where excerpts disagreed, the text takes the cautious reading or carries `[check]`.
- Physics and pedagogy rest on (a) the refreshed Marble teaching-research records (paraphrased only, CC BY-SA, no text copied) and (b) standard textbook physics. Both still need the subject check.
- Numbers were checked with `check179.py` (scratch area, `python3 -I`); all checks passed (see the spec's checks).

## Local material read

| Material | Used for |
| --- | --- |
| Draft spec 120 (`origin/claude/project-thread-zpfie6`) §§4-8 and writing rules | Cast, pronouns, Act I chapter 4, Act II chapters 1-2, festivals, scene lengths, the Hollis rule. |
| Spec 147 (`origin/claude/project-thread-pj161v-life-matter`) | Owns speed and energy, stores and transfers, conservation; met-elsewhere entries in the crosswalk. Same vocabulary ("movement energy", "spread out"). |
| Spec 145 (same branch) | Host link `#science/bakery`; the baker's window; no kitchen tasks off screen. |
| Specs 167, 168 (`...-materials`) | Thermal conductor and insulator as property words (167); particle model (168). Cited, not re-taught. |
| Spec 169 (`...-earth-and-sky`) | Sea breeze and Sun angle; convection's outdoor case. |
| Spec 153 (`...-living-world`) | Owns insulation (keep-warm bench); revisited once by the teapot cozy. |
| Spec 163 (`...-light-power-space`) | Confirms it does not target *More batteries, brighter bulb* or *Drawing circuits with proper symbols*, keeps brightness out by design and never tests mains. |
| Spec 141 (`...-earth-sky`) | Owns seasons from tilt; this pack keeps the pattern only. |
| Specs 112, 140, 102 | "Opaque" (Shadow Theatre), the thermometer (weather station), Cold Window link. |
| Pinned `curriculum/marble/topics.json`, `dependencies.json`, `curriculum/topic-coverage.csv` | Ids, names, hard prerequisites; all six targets "not yet mapped". A `git grep` across main and every `pj161v` branch found no spec claiming any target id. |
| Marble `data/teaching-research.json` at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` | Records for `mt_go5i87u2b9`, `mt_iGSfQg3g5c`, `mt_2agkUcdah9`, `mt_1MLi55bPnt`, `mt_ySnOkVIu22`, `mt_ckpA3oZQ44`. |
| Jane at `0ec55f7e083976e6fcc3977fca460b1f5e199d91` | Teach, guided, practice; the "I'm stuck" ladder; three options; glossary. |

## Sources (judged from search excerpts)

| Source | URL | Supports |
| --- | --- | --- |
| Wikipedia, "An Inquiry Concerning the Source of the Heat Which Is Excited by Friction" | https://en.wikipedia.org/wiki/An_Inquiry_Concerning_the_Source_of_the_Heat_Which_Is_Excited_by_Friction | Rumford's 1798 paper; cannon boring at the Munich arsenal; heat as motion against caloric. |
| Linda Hall Library, Scientist of the Day: Benjamin Thompson | https://www.lindahall.org/about/news/scientist-of-the-day/benjamin-thompson/ | Rumford biography and the cannon-boring observations. |
| Royal Society record via Philosophical Transactions OCR index | https://jimclifford.ca/philosophical-transactions-ocr-1665-1869/articles/jstor-106970/ | Paper read 25 January 1798. Water boiled in about two and a half hours; heat seemingly inexhaustible (secondary summaries; one source dates the experiments c. 1797). |
| Wikipedia, "Rumford fireplace" | https://en.wikipedia.org/wiki/Rumford_fireplace | Tall, shallow fireplace with angled sides reflecting heat into the room; papers of 1796 and 1798. |
| Buckley Rumford Company, history articles | https://rumford.com/articleRumford.html | Radiant heat as Rumford's aim; Rumford-style fireplaces still built (a maker's page: commercial, used only for "still built"). |
| NASA Space Place, "Herschel Discovers Infrared Light" | https://spaceplace.nasa.gov/review/posters/herschel/Herschel-ir-activity.pdf | 1800; prism; blackened thermometers; warmer reading beyond the red. |
| Caltech IPAC, Herschel experiment | https://www.ipac.caltech.edu/Outreach/Edu/Herschel/experiment.html | Same, and that the beyond-red thermometer began as a control. |
| American Physical Society, "This Month in Physics History: Joule and the mechanical equivalent of heat" | https://www.aps.org/apsnews/2015/06/joule-mechanical-equivalent-heat | Falling weights turned a paddle in water; British Association, Cambridge, June 1845; Royal Society report 1849; step toward the first law. |
| Science Museum Group, mechanical equivalent of heat apparatus | https://collection.sciencemuseumgroup.org.uk/objects/co2526 | The paddle apparatus as a real object (museum record; image rights not checked). |
| Physics Review (Hodder), "James Prescott Joule 1818-89" | https://www.hoddereducationmagazines.com/magazine/physics-review/24/4/james-prescott-joule-1818-89/ | Honeymoon waterfall story, "no record of any results". |
| Wikipedia, "Watt" | https://en.wikipedia.org/wiki/Watt | Name proposed by C. William Siemens, August 1882; adopted 1889; 1 W = 1 J/s; in SI from 1960. |
| Royal Institution collection, Dewar flask (1892) | https://rigb.org/node/3131 | First shown at the Ri on Christmas Day 1892; later improvements including silvering. |
| Britannica print article on the vacuum flask | https://www.britannica.com/print/article/621382 | Vacuum between walls cuts conduction and convection; silvering cuts radiation. |
| National Geographic, "What is perihelion" | https://www.nationalgeographic.com/science/article/what-is-perihelion-earth-orbit | Perihelion in early January (3 January 2026); seasons from tilt, not distance. |
| NASA StarChild, January 2003 question | https://starchild.gsfc.nasa.gov/docs/StarChild/questions/question53.html | Same explanation, NASA page. |
| Mills Archive, "Remains of the bread oven at the Mill House" | https://new.millsarchive.org/product/remains-of-the-bread-oven-at-the-mill-house | Fire lit to heat the bricks, raked out; hot enough for baking up to six hours. |
| Forno Bravo, wood-fired bread temperatures | https://www.fornobravo.com/wood-fired-cooking/temperatures-both-the-oven-and-your-bread/ | Retained-heat baking after the coals are raked out (maker's guide; supporting only). |
| tec-science, why metal feels colder than wood | https://www.tec-science.com/?p=7687 | Same temperature; metal conducts warmth from skin faster. |
| Study Mind, thermal radiation (GCSE) | https://studymind.co.uk/notes/thermal-radiation/ | Dark matte surfaces are better absorbers and emitters than light shiny ones. |
| Brainscape GCSE flashcards (weak) | https://brainscape.com/flashcards/conduction-convection-and-radiation-4767862/packs/7065993 | Radiators warm a room mostly by convection. Weak source; standard textbook point; reviewer to confirm. |
| Oak National Academy, specific heat capacity lessons | https://www.thenational.academy/teachers/programmes/physics-secondary-ks4-foundation-aqa/units/energy-of-moving-particles/lessons/calculating-specific-heat-capacity-e-equals-m-c | E = mcΔT; water about 4,184 J per kg per °C (rounded to 4,200 in items). |
| Absurdly Optimized, "Boiling water on a 15-amp circuit" (blog) | https://www.absurdlyoptimized.com/articles/electric-kettle | Kettles about 1,500 W in the US and up to about 3,000 W in the UK. Blog source; product labels should confirm. |
| 2030 Palette, "Vegetative cooling" | https://2030palette.org/vegetative-cooling/ | Shaded surfaces 11-25 °C (20-45 °F) cooler. EPA attribution not confirmed; kept out of child text except as `[check]`. |
| Royal Museums Greenwich, winter solstice | https://www.rmg.co.uk/discover/explore/when-winter-solstice | Day length grows more extreme with latitude (London figures). Used only as a bracket. |

## Open checks

1. **Bread oven "up to six hours":** one museum record (Mills Archive); text now says "for hours (one museum account says up to six; it depends on the oven)".
2. **Radiator and stove convection:** sources disagree on the convection/radiation split; text now says "partly this way, partly by radiation; the share varies".
3. **Subject check** on the awning placement rule, the clack tally and the oven account (spec review asks).

## Review pass (independent review and fact-check, 2026-10-25)

Ten WebSearch calls (standard mode); WebFetch blocked, so judged from excerpts. Numbers re-run with a fresh `python3 -I` script: teapot 84/52/36/28 and 84/68/56/47; 336,000 J; 168 s and 336 s; 120,000 J; 259,200 J vs 240,000 J; 1,000 J falling (981 J for 1 kg, 100 m) gives about 0.24 °C. All match.

- **Day length at 42.5° N:** computed by script (declination ±23.44°, sunrise at −0.833°): about 9.1 h and 15.3 h (8.9 h and 15.1 h for the Sun's center at the horizon). "About 9" and "about 15" stand; `[check]` removed.
- **Shade cooling figure (11-25 °C):** found only in secondary guides (2030 Palette, a city energy guide); no EPA primary located. **Cut** from spec and companion. 2030 Palette above is no longer relied on.
- **Rumford:** paper read 1798 (Phil. Trans. 88, pp. 80-102); water boiled in about two and a half hours with a blunt borer (Wikipedia summary of the paper). Fireplace essays dated 1796, second 1798 (Wikipedia; rumford.com). Confirmed.
- **Herschel 1800:** Phil. Trans. 90 (1800); heating greatest beyond the red (IOP Spark, https://spark.iop.org/william-herschel-and-discovery-infra-red-radiation; APS News, https://www.aps.org/apsnews/2024/02/william-herschel-invisible-light). Confirmed.
- **Joule 1845:** paddle and falling weights confirmed (chemteam.info reprint, https://www.chemteam.info/Chem-History/Joule-Heat-1845.html). "About a degree" not confirmed; spec now says "a tiny amount".
- **1847 waterfall:** Thomson's memoir describes meeting Joule in the Alps in 1847 and a failed attempt at a cascade (APS News, https://www.aps.org/apsnews/2009/12/joule-abstract-converting-mechanical-heat); IOP Spark (https://spark.iop.org/unsettling-james-joule) reports the honeymoon account surfaced decades later and calls it likely a fable. Child card labels it a story told years later with no result.
- **Watt:** Siemens proposed it in August 1882 at the British Association, which approved it that year (Wikipedia "Watt"; Athenaeum report quoted at wehd.com); the 1889 International Electrical Congress adoption rests on one source (EPFL Graph Search). Text changed from "the British Association adopted it in 1889" to "approved it [1882]; an international electrical congress adopted it in 1889".
- **Dewar 1892:** Royal Institution record says silvering came later; others disagree. "Added later" kept, attributed.
- **Kettle and LED wattage:** the real-kitchen kettle card and the spec's kettle/LED ratings were **cut** to keep clear of spec 163's mains rule (sockets and plug-ins never for experiments); the kettle survives only as a number in Keeper's Desk items. The blog kettle source above is no longer relied on.
- **Physics wording:** hotter-to-cooler stated as the one rule; "the cold is getting in" appears only as Pip's line, corrected in scene; the clack tally always totals ten.
- **Story:** `{guide}` lost "their head" and "a paw" (never gendered, species unknown). Hard-prerequisite crosswalk re-verified by script against pinned files; right answers A5/B5/C5.

## Rights notes

No images are embedded. If art is wanted: Herschel and Rumford portraits and Joule's apparatus exist in museum collections (Science Museum Group, Royal Institution); check each item's licence and prefer public-domain or open-access images. All Willowbank art is original.
