# Changing Materials: source audit

Audit for [spec 235](../specs/235-changing-materials.md) and its [companion text](../content/235-changing-materials-text.md). Date: 2026-10-25. All proposed copy, characters, scenes and the bench models (`separate-v1`, `reaction-cards-v1`, `salt-namer-v1`, `rig-v1`, `spring-v1`, `cart-v1`, `gap-v1`, `tank-v1`, `motor-v1`) are original. No learner or family record, image, worksheet or lesson code is included.

## Verification method (read first)

- 17 web searches (standard mode), within the wave budget of 18. **No page was opened in full with WebFetch.** Each claim below was judged from search-result excerpts of the named pages. Several excerpts came from secondary pages; a reviewer should open the key pages before build. Where excerpts disagreed, the text takes the cautious reading or carries `[check]`.
- Chemistry and physics rest on (a) the refreshed Marble teaching-research records (paraphrased only, CC BY-SA, no text copied) and (b) standard school-level science (word equations, salt naming, reactivity order, expansion, pressure). Both still need the subject check.
- **Independent review, 2026-10-25.** A second reviewer opened the Science and Technology Daily, Le Moyne (Lavoisier) and Béarn des Gaves pages in full, read a scholarly English translation of Shen Kuo's entry (row below), checked salt-works production by search, and recomputed every number with a fresh script (`oca13/review-224/rcheck.py`, `python3 -I`; 200 checks). Corrections: the Shen Kuo card (the pan, not the boiled water, turned to copper; "blue-green" removed; date softened to "around 1088"); Lavoisier's tin (only some turned to powder); the spring bench's bend point (after 5 N, not 6 N); a Sprout oven distractor (silicone rubber dishes are oven-safe, so "rubber softens" was untrue); two distractor tags.
- Numbers were checked with `check224.py` (scratch area `oca13/224/`, `python3 -I`): 318 checks, all passed (see the spec's checks). Molar masses for the mass bars use standard atomic weights (Mg 24.305, O 15.999, Cu 63.546, C 12.011).

## Local material read

| Material | Used for |
| --- | --- |
| Spec 120 and `docs/content/120-story/` (acts 1-3, 5-6) | Cast, pronouns, Act I chapter 4, Act II chapters 1, 2 and 4, Act III chapters 3 and 4, Act V paths, Act VI chapter 3; scene lengths; the Hollis rule (Hollis is never named). |
| Spec 145 (The Baker's Window) | Claims *Separating Mixtures* (ages 9-10); sieve, filter, evaporating dish; no tasting; host link `#science/bakery`. |
| Spec 167 (The Mending Shed) | Property words (flexible, rigid, elastic); material choice; host link `#workshop/mending`. |
| Spec 168 (The Cabinet of Little Drawers) | Claims *Physical vs Chemical Changes*, *Acids, Alkalis & pH*, *Metals vs Non-Metals*; leaves *Pure Substances & Mixtures* unclaimed; particle pictures with same-size particles. |
| Specs 154, 178, 164 | Arrows and resultants (178 claims *Resultant Forces*); 154 only previews moments; 178 leaves *Deformation & Fluid Pressure* and *Investigating Forces* untargeted. |
| Spec 163 (Sparks and Switches) | Claims *Electromagnets*; the mains rule; "fields and motors come later". |
| Spec 179 | Template for structure, depth and the saved-work pattern. |
| Pinned `curriculum/marble/topics.json`, `dependencies.json`, `curriculum/topic-coverage.csv` | Ids, names, ages, hard prerequisites; all seven targets "not yet mapped". `grep` across `docs/` found no spec naming any target id. |
| Marble `data/teaching-research.json` at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` | Records for `mt_U_tJvy3cbB`, `mt_QKRYLwaOU8`, `mt_v0K6GRi4ZL`, `mt_w83U-_noVR`, `mt_fkwcCB5px7`, `mt_xkn2sf93WJ`, `mt__7BVYUN180`, and prerequisites `mt_MBTVB-E-S7`, `mt_vuNjYx3qOy`. |
| Jane `LESSONS.md` at `0ec55f7e083976e6fcc3977fca460b1f5e199d91` | Teach, guided, practice; the "I'm stuck" ladder; three options; writing style; glossary. |

## Sources (judged from search excerpts)

| Source | URL | Supports |
| --- | --- | --- |
| Wikipedia, "Mary the Jewess" | https://en.wikipedia.org/wiki/Mary_the_Jewess | Alexandria, first to third century CE; the tribikos (still) first described by her per Zosimos; the bain-marie named for her; contributions uncertain. |
| Chemistry World, "Classic kit: Mary's bath" | https://www.chemistryworld.com/opinion/classic-kit-marys-bath/3004925.article | Zosimos's account of her water bath. |
| Wikipedia, "History of chromatography" and "Mikhail Tsvet" | https://en.wikipedia.org/wiki/History_of_chromatography | Calcium carbonate column; plant pigments (carotenes, xanthophylls, chlorophylls); first presented 1901-03, term in print 1906. The pun on his surname is unsourced and not used. |
| Linda Hall Library, Scientist of the Day: Mikhail Tsvet | https://www.lindahall.org/about/news/scientist-of-the-day/mikhail-tsvet/ | Same; yellow, orange and green bands. |
| Béarn des Gaves tourism, "Salies-de-Béarn, the city of salt" | https://www.tourisme-bearn-gaves.com/en/discover/culture-and-heritage/bearn-des-gaves-cities/salies-de-bearn-the-city-of-salt/ | Salt spring; brine evaporated in pans today; the boar legend. Tourism source; the Bronze Age and "ten times saltier" claims are not used. |
| France Today, "Worth its Salt" | https://francetoday.com/culture/made_in_france/worth-its-salt-a-trip-to-salies-de-bearn/ | Same, secondary. |
| Produits de Nouvelle-Aquitaine, "A city with no shortage of salt" | https://produits-de-nouvelle-aquitaine.fr/?p=6485 | Today's salt is made by evaporating the spring brine with heat (about 2,000 tonnes a year); the card's "dried in big pans" stays general. |
| Science and Technology Daily, "Extracting Copper from Water: The Earliest Hydrometallurgy" | https://www.stdaily.com/web/English/2023-08/10/content_1931914.html | Opened in full by the reviewer: a bitter spring in present-day Yanshan county, Jiangxi; boiling gave copper; Shen Kuo went to see it and recorded it. Its "legend has it" framing is for the villagers' story, not Shen's record. No water color given, so "blue-green" was removed. |
| Hydrometallurgy (1990), "The history of copper cementation on iron: the world's first hydrometallurgical process from medieval China" | https://literature.wolkersdorfer.info/literature/The%20history%20of%20copper%20cementation%20on%20iron.pdf | Quotes a translation of Shen Kuo's entry: a bitter spring in Chhien-shan (Qianshan/Yanshan), Hsin-chou (Xinzhou); heating the water gives crystals (*tan fan*, blue vitriol); heating them gives copper; an iron pan used to heat them for a long time "is changed to copper". Dates the book 1086 (Wikipedia: 1088), so the card says "around 1088". |
| Toyo Bunko memoir (search excerpt) | https://toyo-bunko.repo.nii.ac.jp/record/3201/files/memoirs60_01.pdf | Places the entry in *Mengxi bitan* vol. 25; bitter spring in Yanshan county, Xinzhou. |
| Wikipedia, "Dream Pool Essays" | https://en.wikipedia.org/wiki/Dream_Pool_Essays | Shen Kuo (1031-1095); published 1088; covers metallurgy. |
| Le Moyne College classic chemistry, Lavoisier on tin | https://web.lemoyne.edu/GIUNTA/classicalcs/lavoisier.html | Opened in full: memoir in the Académie's volume for 1774, printed 1777; after heating, "tin plus a black powder" (only part reacted), so the card now says "some of the tin"; the solids' gain matched the air's loss. |
| Bristol chemistry pages, "Lavoisier and the discovery of combustion" | https://www.chm.bris.ac.uk/~paulmay/webprojects2001/hossain/combustion.htm | Sealed vessels; total mass unchanged; metal gained the mass of air used. |
| MIT News, "Ancient Mesoamericans made rubber" (1999) | https://news.mit.edu/1999/rubber-0714 | Latex of *Castilla elastica* mixed with *Ipomoea alba* juice; by about 1600 BCE; juice raised elasticity. |
| arXiv, "The Asian war bow" | https://arxiv.org/pdf/1101.1677 | Horn on the belly takes compression; sinew on the back takes tension; wood core. |
| UCL Discovery, composite bow in ancient Eurasia | https://discovery.ucl.ac.uk/id/eprint/10216659/1/Reassessing%20the%20Evidence%20for%20the%20Composite%20Bow%20in%20Ancient%20Eurasia.pdf | Steppe association; dating debated (card gives no date). |
| Wikipedia, "Joseph Monier" | https://en.wikipedia.org/wiki/Joseph_Monier | French gardener; iron-reinforced concrete pots and tubs; patent 16 July 1867. |
| ERIH, Joseph Monier biography | https://www.erih.net/how-it-started/stories-about-people-biographies/biography/monier | Same; pots cracked without reinforcement. |
| Science History Institute, Stephanie L. Kwolek | https://sciencehistory.org/historical-profile/stephanie-l-kwolek | Kevlar at DuPont; synthesis 1964, fiber 1965 (sources differ, so "1964-65"). |
| PBS NewsHour, Kwolek | https://www.pbs.org/newshour/show/the-life-and-achievements-of-chemist-stephanie-kwolek-inventor-of-kevlar | Lightweight, strong, used in protective vests. "Five times stronger than steel" not used. |
| Wikipedia, "Hooke's law" | https://en.wikipedia.org/wiki/Hooke%27s_law | Stated 1676 as a Latin anagram; solution 1678, *ut tensio, sic vis*. Sources differ on the anagram's letters, so the card gives none. |
| Science Museum blog, "A small revolution: Michael Faraday and the origins of the electric motor" | https://blog.sciencemuseum.org.uk/a-small-revolution-michael-faraday-and-the-origins-of-the-electric-motor/ | 3 September 1821; wire circling a magnet; electromagnetic rotations. |
| Royal Institution, Faraday's rotation apparatus | https://rigb.org/node/3128 | Surviving apparatus dated 1822; "first electric motor" framing (text says "often called"). |
| Wikipedia, "Edward W. Kellogg" | https://en.wikipedia.org/wiki/Edward_W._Kellogg | Rice and Kellogg (GE), moving-coil cone loudspeaker, 1925 AIEE paper; Wente arrived independently. |
| NOAA Ocean Service, ocean pressure | https://oceanservice.noaa.gov/facts/pressure.html | About one atmosphere more every 33 ft (10 m) of depth. |
| NOAA Ocean Explorer | https://oceanexplorer.noaa.gov/?p=1842 | Same rule; 100 m about 10 atmospheres. |
| OpenStax University Physics 2, 1.3 Thermal expansion | https://openstax.org/books/university-physics-volume-2/pages/1-3-thermal-expansion | Steel about 12 × 10⁻⁶ per °C; bridge expansion joints. |
| Wikipedia, "Lime (material)" | https://en.wikipedia.org/wiki/Lime_(material) | Heating limestone (calcium carbonate) gives quicklime (calcium oxide) and carbon dioxide; lime mortar. |

## Open checks

1. **Eiffel Tower summer growth** (popular "up to 15 cm"): only trivia and secondary pages found; one fact-check calls it exaggerated. `[check]`; **kept out** of child text. The bench uses a made-up handrail with steel's real rate.
2. **Salies-de-Béarn early dates** (Bronze Age, 13th-century boar hunt): tourism sources only. Kept out; the card says only that brine is still dried in pans, and the boar is labeled a story people tell.
3. **Shen Kuo detail:** cleared by the reviewer from a quoted translation (Hydrometallurgy 1990 row). The card now follows it: crystals from the heated water, and the iron pan used to heat them turned to copper. The exact year (1086 or 1088) differs between sources, so the card says "around 1088".
4. **Kevlar and porcelain claims:** "bullet-resistant vests" is standard; no strength ratio is stated.
5. **Rig cells** (nylon and polythene soften at oven heat; cob chips): typical behavior, not sourced to a test standard. Subject check asked in the spec.
6. **Subject check** on the still-only-for-clear-solutions rule, the 5 N/7 N spring limits and the ledge rule for the barrel (spec review asks).

## Facts kept out on purpose

- No real hazard numbers, concentrations or reaction temperatures in child text; acids and flames are named as on-screen only.
- No ethanol or alcohol distillation; liquids with different boiling points appear only as a Keeper's note in the spec.
- Mary the Jewess's reputed discovery of hydrochloric acid is not used (not accepted by most texts, per Wikipedia).
- Hooke's anagram letters are not given (sources disagree).
- No Tsvet surname pun (unsourced).

## Rights notes

No images are embedded. If art is wanted: Faraday's rotation apparatus (Royal Institution), Monier's patent drawings and museum composite bows exist in collections; check each item's licence and prefer public-domain or open-access images. All Willowbank art is original. Marble records are paraphrased; no shared run of six or more words was copied.

## Bounded authoring repair, 2026-10-25

The wave's public spec identifiers and companion/audit links were renumbered to avoid existing specs. Historical private checker filenames and scratch paths above retain their original names; reported authoring checks describe those earlier runs, not a fresh implementation or complete-source review. The selected build still requires its stated subject, primary-source, cultural and fluent-reader gates, independent review and actual runtime/browser verification. The owning spec now requires complete authored source freezing and explicit capacity refusal/download/selected-confirmed removal, with no silent kept-work eviction. No code, route, taxonomy pin or coverage declaration is commissioned by this repair.

**Tank-table repair:** depths0.2,0.5,0.8m now explicitly pair with drops1.8,1.5,1.2m and ranges1.20,1.73,1.96m. The previous descending range list was ambiguous against the ascending depth list. This corrects the pairing, not the conclusion that the deepest of these three holes reaches farthest. Derivation: https://openstax.org/books/college-physics/pages/12-3-the-most-general-applications-of-bernoullis-equation (Torricelli exit speed), combined with horizontal projectile motion. No physical apparatus or broader source check is commissioned.
