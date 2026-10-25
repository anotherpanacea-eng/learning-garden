# Light, Stars and Signals: source audit

Audit for [spec 225](../specs/225-light-stars-signals.md) and its [companion text](../content/225-light-stars-signals-text.md). Date: 2026-10-25. All proposed copy, characters, scenes and the six bench models (`lamp-code-v1`, `sky-wheel-v1`, Star Seeds, `ray-v1`, `fates-v1`, `forge-v1`) are original. No learner or family record, image, worksheet or lesson code is included.

## Verification method (read first)

- Independent review, 2026-10-25: the reviewer opened Wikipedia "Jagadish Chandra Bose", "Camera obscura", "Magic lantern" and "Chappe telegraph", and the Stanford Encyclopedia of Philosophy "Mohist Canons", and searched the Library of Congress Morse record; results are in the rows below. The reviewer also recomputed every lens case, beat count, rain-proof count, the sky-wheel months, circumpolar stars, light times, the answer key, positions, prompt and card lengths and the six-word overlap with a fresh script (`review-225/rcheck.py`, 213 checks: 206 passed and 7 flags before fixes, all style false positives such as "points at" and "blocks", or the spec's own mention of the style rule).
- Writer's pass: 19 web searches (standard mode). **No page was opened in full with WebFetch**; each claim below was judged from search-result excerpts of the named pages. Where excerpts disagreed, the text takes the cautious reading or carries `[check]`. A reviewer should open the key pages before build.
- Physics and pedagogy rest on (a) the Marble teaching-research records for the seven targets (paraphrased only, CC BY-SA, no shared run of six words or more) and (b) standard textbook physics and astronomy. Both still need the subject check.
- Every number, model output, answer key and "only one answer" claim was computed by `check225.py` (scratch area `oca13/225/`, `python3 -I`): 13,388,419 checks passed, 13,388,280 of them a brute force over every four-message lamp code. Star declinations in the script are standard catalog values entered by hand (see open check 3).

## Local material read

| Material | Used for |
| --- | --- |
| Spec 120 §§4-8, writing rules; `docs/content/120-story/act-5.md`, `act-6.md`, `festivals-and-storm-day.md` | Cast and pronouns; Act I ch 4, Act II ch 2 and 4, Act III ch 4, Act V path 3 (Hollis's telescope, the mill roof), Act VI ch 3 (runner, courier, Léon, three days of rain); Lantern Night; the Hollis rule; scene lengths. |
| Spec 141 | Claims The Sun is a star and Earth's Spin & Orbit (met-elsewhere rows); lists Spotting Constellations as a candidate; owns tilt; the sky-night safety rule (never a roof). |
| Spec 146 | Records Communication with Light & Sound and Wave Properties & Types as documented gaps; sound is not re-taught. |
| Spec 162 | The Sun rule, word for word; mirrors, straight rays and prisms revisited; Reflection & Refraction related without a claim. |
| Spec 172 | Claims the older *Life Cycle of a Star* (`mt_lHasFmgvnT`) with Star Story; Payne card; the Sun's future told calmly; supernova mass threshold about 8 solar masses. |
| Spec 177 | Starlight as evidence; host neighbor. |
| Spec 179 | Template; Herschel's infrared card revisited. |
| Pinned `curriculum/marble/topics.json`, `dependencies.json`, `curriculum/topic-coverage.csv` | Ids, names, ages, hard edges; all seven targets "not yet mapped"; `grep -rn` over `docs/` finds none of the seven ids on main. |
| Marble `data/teaching-research.json` at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` | Records for `mt_FVERuBoCD1`, `mt_XSp-S0wter`, `mt_w5HzPpOUmj`, `mt_n5_Jt4ExUd`, `mt_iTjrKEdAOj`, `mt_9VZem2vUqk`, `mt_KYx0m4OyZv`. |
| Jane `LESSONS.md` at `0ec55f7e083976e6fcc3977fca460b1f5e199d91` | Teach, guided, practice; the stuck ladder; three options; prompt and card lengths; glossary. |

## Sources (judged from search excerpts)

| Source | URL | Supports |
| --- | --- | --- |
| Wikipedia, "Chappe telegraph" (opened at review); ETHW, "France Builds Visual Telegraph" | https://en.wikipedia.org/wiki/Chappe_telegraph ; https://ethw.org/France_Builds_Visual_Telegraph | Paris-Lille line of 15 towers, 1794; each tower relayed the one before. Wikipedia gives about 230 km against the writer's 210, so the distance was cut from child text. |
| Library of Congress, "First telegraphic message, 24 May 1844" | https://www.loc.gov/resource/mmorse.071009 | Morse, Capitol to Alfred Vail in Baltimore, 24 May 1844; the Library holds the paper tape. The 1844 register embossed dots and dashes on paper, so the card now says "raised dots and dashes on a paper strip", not "clicks". |
| Smithsonian Magazine, "How Does the West African Talking Drum Accurately Mimic Human Speech?" (2021) | https://www.smithsonianmag.com/smart-news/how-west-african-drums-really-talk-180978296/ | Dùndún drums copy the tones and timing of Yorùbá speech; study in Frontiers in Communication. |
| National Geographic; RNIB, on Louis Braille | https://www.nationalgeographic.com/history/article/louis-braille-writing-system-creator ; https://rnib.org.uk/practical-help/reading/braille-and-moon-tactile-codes/braille-past-present-future | Six-dot cell from Barbier's twelve, about 1824 (aged about 15); published 1829; 63 patterns. |
| Wikipedia, "Matariki"; NZ Defence Force health page | https://en.wikipedia.org/wiki/Matariki ; https://health.nzdf.mil.nz/resources/matariki-2022 | Pleiades; midwinter pre-dawn rising marks the Māori new year; first public holiday 24 June 2022. |
| Encyclopedia.com, "Mo Tzu"; Wikipedia, "Camera obscura" (opened at review); Stanford Encyclopedia of Philosophy, "Mohist Canons" | https://en.wikipedia.org/wiki/Camera_obscura ; https://plato.stanford.edu/entries/mohist-canons/ | Wikipedia, citing Needham, *Science and Civilisation in China* IV.1 p. 98: the *Mozi* text (4th century BC) is one of the earliest records of a pinhole image, inverted through the hole. SEP dates the Canons late 4th to mid 3rd century BC and lists optics among their topics. Confirmed at encyclopedia level; card cleared. |
| Wikipedia, "Magic lantern" (opened at review) | https://en.wikipedia.org/wiki/Magic_lantern | Huygens's skeleton sketches, believed 1659, for "convex glasses and a lamp"; called the oldest known document about the magic lantern. |
| Caltech IPAC Cool Cosmos, "The Ritter Experiment" | https://coolcosmos.ipac.caltech.edu/page/lesson_ritter_experiment | Ritter, 1801: silver chloride darkened beyond violet; follows Herschel 1800. |
| IEEE Milestone proposal, J. C. Bose millimeter-wave experiments 1894-96; SMECC | https://ieeemilestones.ethw.org/Milestone-Proposal:First_Millimeter-wave_Communication_Experiments_by_J.C._Bose,_1894-96 ; https://smecc.org/j_c__bose_-_radio_and_microwaves.htm | Calcutta 1895 public demonstration; signal through walls rang a bell. Wikipedia, "Jagadish Chandra Bose" (opened at review; https://en.wikipedia.org/wiki/Jagadish_Chandra_Bose, citing Ramaseshan 1996 and Kar 2022): Town Hall, November 1895, millimetre waves through two walls, 23 m, rang a bell and lit gunpowder. Card confirmed as written. |
| New World Encyclopedia, "Heinrich Hertz"; Röntgen summaries | https://www.newworldencyclopedia.org/entry/Heinrich_Hertz | Hertz produced and detected radio waves, 1887-88; Röntgen found X-rays at Würzburg, 1895 (Nobel 1901). Text says "late 1880s". |
| NASA Imagine the Universe, EM spectrum | https://imagine.gsfc.nasa.gov/science/toolbox/emspectrum1.html | Seven-band order by energy; one family; all at the speed of light. |
| EPA, radiation basics (archived snapshot) | https://19january2025snapshot.epa.gov/radiation/radiation-basics/index.html | Ionizing vs non-ionizing; UV non-ionizing in EPA's scheme yet can burn and damage tissue; ionizing can damage DNA. |
| Swinburne University physics note; Mental Floss | https://www.swinburne.edu.my/?p=4929 ; https://www.mentalfloss.com/science/physics/mesh-grate-microwave-purpose | Oven wavelength about 12.2 cm at 2.45 GHz; door mesh holes much smaller, so microwaves reflect and light passes. |
| US patent on glazing (glass IR opacity) | https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/6391400 | Ordinary glass transparent from about 0.2 to 3.5 µm, opaque beyond about 4 µm, so it blocks warm-object infrared. Weak source type; open check 4. |
| EarthSky, "Cassiopeia and Big Dipper" | https://earthsky.org/tonight/cassiopeia-and-big-dipper/ | Both circumpolar at 41° N and farther north; on opposite sides of Polaris. |
| Space.com, "Main sequence stars" | https://www.space.com/22437-main-sequence-stars.html | Sun about 10 billion years on the main sequence; a star of about 10 solar masses about 20 million years. |
| LBL "Origin of the Elements" wallchart; SFU text | https://www2.lbl.gov/abc/wallchart/chapters/10/0.html ; https://www.sfu.ca/~boal/120text/chap10.pdf | Big Bang mix about 75% hydrogen, 25% helium by mass, trace lithium; heavier nuclei made in stars. |
| Linda Hall Library, William A. Fowler; Chandra blog | https://lindahall.org/about/news/scientist-of-the-day/william-a-fowler ; https://chandra.harvard.edu/blog/node/206 | B²FH, *Synthesis of the Elements in Stars*, Reviews of Modern Physics, 1957. |
| NASA Goddard SVS, GW170817 | https://svs.gsfc.nasa.gov/12740/ | Neutron-star merger detected 17 August 2017; kilonova forged heavy elements such as gold and platinum. |

## Every number in child text, and where it comes from

| Number in child text | Basis |
| --- | --- |
| 1794; Paris to Lille | Chappe sources above (distance cut at review). |
| 24 May 1844 | Library of Congress. |
| 1824, about 15, 1829; six dot places | Braille sources above. |
| 63 Braille patterns; 64 with all-flat | `check225.py`, counted two ways. |
| 2022 (Matariki holiday) | Matariki sources above. |
| about 1659 (Huygens) | Wikipedia, "Magic lantern". |
| 1800, 1801 (Herschel, Ritter) | Spec 179's audit; Caltech IPAC. |
| 1895 (Bose; Röntgen); late 1880s (Hertz) | Bose and Hertz sources above. |
| 1925 (Payne), 1957 (B²FH), 17 August 2017 | Spec 172's audit; Linda Hall; NASA Goddard SVS. |
| about 300,000 km (186,000 miles) each second | Defined speed 299,792.458 km/s; conversion by script. |
| 150 million km; 500 s = 8 min 20 s | Rounded Earth-Sun distance; script gives 499 s exact. |
| 12 cm microwave wave | 2.45 GHz; script gives 0.122 m; Swinburne note. |
| about 10 billion years (Sun); about 20 million (ten times heavier); 500 times | Space.com; ratio by script. |
| about 5 billion years from now | Spec 172 (red giant in about 5 billion years); script: 10 − 4.6 = 5.4. |
| 3 parts hydrogen to 1 part helium; 25 kg and 75 kg | LBL and SFU (about 75% and 25% by mass); arithmetic by script. |
| Beats: 1, 3, 1 gap; 5; 12; 36 | `lamp-code-v1` rule; brute force by script. |
| Lens: F at 4; 12, 8, 6, 4, 2 squares; images 6, 8, 12, none, 4 behind | `ray-v1` rule; exact fractions and ray intersections by script. |
| 10 tokens in the fate bar | `fates-v1`, labeled made-up; only the largest share is a claim. |

Copying check: a six-word-window comparison of all three files against the seven Marble records (`overlap225.py`, scratch area) finds no shared run of six words.

## Open checks

1. **Mozi and the pinhole**: cleared at review (Wikipedia citing Needham; SEP for the Canons' date and optics). The card stays cautious: "old Chinese writings linked to the thinker Mozi, from more than 2,000 years ago". Graham's translation would still be the best page to cite if art or a quotation is added.
2. **Bose 1895**: confirmed at review (Town Hall, November 1895, two walls, bell). The card keeps only Calcutta, 1895, "through walls" and the bell; gunpowder stays out.
3. **Star declinations and constellation RAs** in `check225.py` are typed catalog values (e.g. Alkaid +49.3°, Antares −26.4°, Orion center about 5.6 h), not fetched. Results have wide margins (Alkaid clears +47.5° by 1.8°; each month's nearest pattern is unique by more than 4 h), but a reviewer should spot-check them.
4. **`fates-v1` cells**: glass and warm-object infrared, stone and radio, metal and infrared rest on excerpts and textbook knowledge; the largest-share claims need a subject check. Thickness, moisture and frequency within a band change real results; the model line says so.
5. **Betelgeuse distance and timing** (`[check]`): no distance or date is in child text; "probably not for a very long time" only.
6. **Hazard wording**: "from ultraviolet up, rays can harm living cells" follows Marble's threshold "around UV" and EPA's note that UV damages tissue; review ask 2.
7. **Gold and GW170817**: NASA says the merger forged heavy elements such as gold; gold was inferred, not seen line by line, so child text now says "probably" (T27, 6.3, the history card).
8. **Review changes to story and safety**: the Act III radio moved to Nuria's grandmother's city (spec 120's valley has no radios, and a valley radio would undercut the Act VI runner); Betelgeuse is "near the end of its life", not "very old" (it is far younger than the Sun); the Sun rule is now spec 162's companion text word for word; "Shade and screens help" was cut as on-screen sun-care advice.
9. **Spanish line** (*¡Hola desde Vadoalto!*) needs spec 120's fluent reader.

## Rights notes

No images are embedded. If art is wanted: the Library of Congress Morse tape, Huygens's sketch and Chappe tower drawings are old enough to be likely public domain, but check each item's listed rights; NASA images are generally public domain with credit. Matariki and Yorùbá drumming art should be reviewed by people from those communities before publication. All Willowbank art is original.
