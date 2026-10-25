# Source audit: 141, The Sky-Watching Night

Dates: first pass and fact-check pass, both 2026-10-25. Spec: [141](../specs/141-sky-watching-night.md). Companion: [141 text](../content/141-sky-watching-night-text.md).

**How checking was done.** WebFetch and direct downloads were blocked for this session (nasa.gov, wikipedia.org, britannica.com and other hosts were refused), so every web check below rests on search-result excerpts and the URLs those results cited. The pages themselves were not opened. Where only secondary sources came back, the table says so. Dates and positions were computed with the PyEphem astronomy library, and all arithmetic was checked by script. No `[check]` tags remain in the spec or companion. The items still worth a specialist's eye are listed under Residual review points.

## Science sources

| Source | Publisher | URL | Supports |
| --- | --- | --- | --- |
| Planetary Fact Sheet, Metric | NASA NSSDC | https://nssdc.gsfc.nasa.gov/planetary/factsheet/ | Planet diameters (4,879; 12,104; 12,756; 6,792; 142,984; 120,536; 51,118; 49,528 km) and mean distances (57.9; 108.2; 149.6; 228.0; 778.5; 1,432.0; 2,867.0; 4,515.0 million km). |
| Planetary Fact Sheet Notes | NASA NSSDC | https://nssdc.gsfc.nasa.gov/planetary/factsheet/planetfact_notes.html | Diameter is equatorial; distance is the semi-major axis. |
| Sun Fact Sheet | NASA NSSDC | https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html | Sun's volumetric mean radius is 695,700 km, so its diameter is 1,391,400 km. |
| Lunar Eclipses and the Moon's Orbit | NASA Scientific Visualization Studio | https://svs.gsfc.nasa.gov/4158/ | The Moon's orbit is tilted about 5°, so eclipses happen only at some new and full moons. |
| Periodicity of Lunar Eclipses (F. Espenak) | NASA GSFC | https://eclipse.gsfc.nasa.gov/LEsaros/LEperiodicity.html | The tilt is 5.1°; full moon must fall near a node for a lunar eclipse. |
| Is Venus the hottest planet? | UCL Culture Online | https://www.ucl.ac.uk/culture-online/case-studies/2022/sep/venus-hottest-planet | Venus is the hottest planet; its CO2 atmosphere traps heat. Corroborated by Sky at Night and the Natural History Museum (https://www.nhm.ac.uk/discover/planet-venus.html). |
| To Mars and back blog | ESA | https://blogs.esa.int/to-mars-and-back/?p=851 | Mars's red color comes from rusted iron minerals in the dust. |
| Great Red Spot and Uranus pages | NASA Science (search excerpts) | https://science.nasa.gov/?p=470342 | Jupiter's Great Red Spot is a giant storm (now shrinking). Uranus rolls on its side (tilt about 98°; EBSCO gives 97.8°). |
| What is a planet? (11 October 2006) | AAS Division for Planetary Sciences | https://dps.aas.org/education/what_is_a_planet | The IAU's 2006 classes: planet, dwarf planet, small bodies. Pluto became a dwarf planet. |
| IAU0603 press release (mirror) | IAU, via govdocs corpus | https://corpora.tika.apache.org/base/docs/govdocs1/168/168014.pdf | The first dwarf planets named were Ceres, Pluto and 2003 UB313 (now Eris). |
| Stellar Neighbors of the Sun | HyperPhysics, Georgia State University | https://hyperphysics.gsu.edu/hbase/Starlog/strclos.html | Proxima Centauri is about 4.24 light years away. Sky at Night (https://skyatnightmagazine.com/space-science/proxima-centauri) gives 4.243 ly. Scaled to the 20 cm Sun this is 5,766 km (script). |
| Western Slope Skies; Utah State University Extension | KVNF; USU | https://www.kvnf.org/short-features/2020-10-30/western-slope-skies-seeing-in-the-dark ; https://extension.usu.edu/iort/cp-darkskies/spotlights/guided-stargazing.php | The eye's rods need about 30 minutes to adapt fully to the dark, so the text says "about half an hour". |
| planet (etymology) | Merriam-Webster; Etymonline | https://www.merriam-webster.com/dictionary/planet ; https://www.etymonline.com/word/planet | "Planet" comes from the Greek for "wanderer". |
| Constellation guides | Liverpool Astronomical Society; Noozhawk; Milton Observer; Sky at Night | https://liverpoolas.org/?p=5065 ; https://www.noozhawk.com/?p=523066 ; https://skyatnightmagazine.com/advice/skills/best-winter-constellations | The Big Dipper (the Plough in Britain) is an asterism within Ursa Major. Cassiopeia is a W, on the far side of Polaris from the Big Dipper. Orion's three-star belt is best seen on northern winter evenings, and the Greek story names him a hunter. |
| Cassiopeia, the seated queen | Deep Sky Corner; Astronomy magazine | https://deepskycorner.ch/con/cassiopeia.en.php ; https://www.astronomy.com/observing/sighting-the-queen/ | In Greek myth Cassiopeia is a queen, shown seated on a throne. |
| Grande Ourse | EPFL Graph Search; Futura-Sciences; Techno-Science | https://graphsearch.epfl.ch/fr/concept/3444568 ; https://www.techno-science.net/fr/definitions/grande-ourse | French names: *la Grande Casserole* (a modern name) and *le Grand Chariot*. Corrected Léon's line from "la Casserole" to "la Grande Casserole". |
| Osa Mayor | Star Walk (Spanish); Etymonline | https://starwalk.space/es/news/ursa-major-constellation-guide ; https://www.etymonline.com/es/word/dipper | Spanish: *el Carro* is the best-known name; *el Cazo* and *Gran Cucharón* are used in some places. Added *el Cazo* to the spec. |
| PyEphem 4.2.1 | open source, from PyPI | https://pypi.org/project/ephem/ | Computations (below). |

## History sources

| Source | Publisher | URL | Supports |
| --- | --- | --- | --- |
| *Sidereus Nuncius* facsimile, catalogue entry | Museo Galileo, Florence | https://catalogue.museogalileo.it/object/GalileoGalileiSidereusNunciusFacsimile.html | Galileo announced Jupiter's moons in *Sidereus Nuncius*, from observations made in Padua in early 1610. |
| What's Up, February 2010 | NASA JPL | https://www.jpl.nasa.gov/videos/whats-up-february-2010-galileos-first-telescopic-view-of-jupiter | His first observation was on 7 January 1610, in Padua. |
| Jan. 7, 1610: Galileo sees four moons of Jupiter; Galileo observes the satellites of Jupiter | Astronomy magazine; History Today | https://www.astronomy.com/today-in-the-history-of-astronomy/jan-7-1610-galileo-sees-four-moons-of-jupiter ; https://www.historytoday.com/node/48551 | On the first night he saw three small stars, two east and one west. A fourth appeared by 13 January. By about 15 January he concluded they orbit Jupiter. The two-east, one-west layout matches the PyEphem reconstruction. |
| Sidereus Nuncius summaries | Library of Congress blog; Cambridge IAU proceedings | https://blogs.loc.gov/inside_adams/2010/02/stars-in-his-eyes/ ; https://www.cambridge.org/core/services/aop-cambridge-core/content/view/60C0A0DA460FEDE58BB84BAC99DB17CC/S1743921310007234a.pdf/the-telescope-in-the-making-the-galileo-first-telescopic-observations.pdf | The book is dated 13 March 1610 and was published in Venice. Galileo was in Padua in late 1609. |
| The telescope and the Moon | Universe Today; Ohio State Astronomy 161; History.com | https://www.universetoday.com/675 ; https://www.astronomy.ohio-state.edu/pogge.1/Ast161/Unit3/galileo.html ; https://history.com/this-day-in-history/galileo-begins-observing-the-moon | Lipperhey sought a patent in 1608 and is usually credited with the invention. Galileo built his first telescope in summer 1609, showed an 8-power instrument to the Venetian Senate in August, and built a 20-power one that autumn. He observed the Moon around 30 November 1609 and saw mountains and craters along the terminator. |
| De revolutionibus, 1543 | Lehigh University Libraries exhibit; Cambridge HPS *Starry Messenger* site | https://exhibits.lib.lehigh.edu/exhibits/show/heavenlyspheres/copernicus/copernicus1543 ; https://www.sites.hps.cam.ac.uk/starry/copernicus.html | Copernicus's Sun-centered book was printed in Nuremberg in 1543. |
| Sputnik and Gagarin | Sky at Night; EBSCO Research Starters; AP | https://www.skyatnightmagazine.com/space-missions/yuri-gagarin-first-human-in-space ; https://www.ebsco.com/research-starters/astronomy-and-astrophysics/first-human-orbits-earth | Sputnik 1, the first artificial satellite, was Soviet and launched on 4 October 1957. Gagarin was first in space on 12 April 1961. Secondary sources only, but consistent. |
| Apollo 11 | Britannica Explore; ESA; NBC News | https://explore.britannica.com/explore/space/apollo-11 ; https://www.esa.int/ESA_Multimedia/Videos/1992/01/Apollo_11_For_All_Mankind | The landing was on 20 July 1969. Armstrong and Aldrin walked on the Moon; Collins stayed in orbit. |
| ISS continuous occupation | NASA Science; NASA Night Sky Network; House Science Committee | https://science.nasa.gov/3d-resources/international-space-station-iss-d-igoal/ ; https://csastro.org/cms/wp-content/uploads/NightSkyNotesNovember2020.pdf | The station has been continuously crewed since Expedition 1 arrived on 2 November 2000. |
| Perseverance landing | NASA Science; Live Science; Sci.News | https://science.nasa.gov/?p=388757 ; https://www.livescience.com/perseverance-landing-success.html | Perseverance landed in Jezero Crater on 18 February 2021. |
| Self-driving Perseverance | NASA JPL | https://www.jpl.nasa.gov/news/nasas-self-driving-perseverance-mars-rover-takes-the-wheel | The radio delay rules out joystick driving. Teams plan routes, and the rover drives itself between waypoints. |
| Teaching-research records | Marble at `7bd8b67` (CC BY-SA; paraphrased only) | local clone, `data/teaching-research.json` | The teaching approach and misconceptions for the ten target topics. |
| Spec 116 (draft) | this repo, `origin/claude/project-thread-88brkk` | `docs/specs/116-field-guide-almanac.md` | Ownership boundary for real moon notes and the Moon Phases topic. |

## Computations (2026-10-25, scratch scripts, `python3 -I`)

| Check | Result | Used for |
| --- | --- | --- |
| Earth-Sun distance, hourly, 2026-2027 | Perihelion 3 Jan, 147.1 million km. Aphelion 5-6 Jul, 152.1 million km. | "Closest in early January"; item A5 |
| Mean obliquity, 2026 | 23.44° | Tilt |
| Mean synodic month, 100 lunations | 29.53 days | About 29.5 days |
| Mars-Earth distance, 2020-2039 | 56.9 to 400.2 million km | Item D7 |
| Day length and noon Sun at 42.5°N, solstices | June: 15.30 h, 70.9°. December: 9.06 h, 24.1°. | Seasons panel; torch squares |
| Jupiter's four large moons, Padua, 7-15 Jan 1610 | Table in the spec | Galileo's notebook (labelled reconstruction) |
| Light time for 1 au at c | 499.0 s (8 min 19 s) | "About 8 minutes 20 seconds" |
| `check141.py` | 36 of 36 pass, re-run after this pass with the Proxima scale distance added | Every numeric answer and the scale table |

## Residual review points (not tagged in text)

1. **Calendar behind Galileo's dates.** Venice kept its own year-start (*more veneto*, the year began on 1 March), and the search did not settle which day-count Galileo used. His dates are normally given as Gregorian. The PyEphem reconstruction for Gregorian 7 January matches the published two-east, one-west layout, which supports this. A historian should confirm.
2. **PyEphem's moon model for 1610.** It may not be accurate enough at whole-Jupiter-width rounding. The 7 January match is encouraging but not proof.
3. **Star stories.** Only the Greek stories (bear, hunter, seated queen) are used, each labelled "A story people told". A reviewer may want one non-Greek star story with a museum or community source; none is invented here.
4. **Secondary sources only.** The Sputnik and Gagarin dates came only from secondary outlets in the search results. Confirm them against NASA History before build.
5. **Languages.** The French and Spanish star names need the fluent readers spec 120 already requires.

## Rights notes for images

No images are embedded. NASA images are generally not copyrighted; check each image's credit line. Galileo's 1610 sketches are public domain as works; use a scan with open-access terms from a museum or library (for example Museo Galileo or the Library of Congress), credit it, and keep it separate from the reconstruction. Constellation art, planet markers and benches should be original drawings.

## Review pass (independent review, 2026-10-25)

- **Facts.** No new searches; Galileo, space-milestone, planet and seasons claims were read against the audit and left as written. Teach 9 no longer calls lunar eclipses "rare" without qualification; it now says most full moons miss Earth's shadow, which is the point the bench makes.
- **Math.** Recomputed with `python3 -I` (reviewer scratch `review-141/math.py`): full scale table for 10, 20 and 30 cm Suns from NSSDC figures (matches the companion to its rounding), light times 499.0 s and 1.28 s, Mars 3.2 to 22.2 minutes, D1 1.83 mm, D2 21.5 m, D3 645 (exact 649) m, D6 12.5 minutes, A7 2.5, noon Sun 70.9° and 24.1°. Proxima at a 20 cm Sun is about 5,775 km (4.2465 light-years); the spec's 5,766 was changed to "about 5,770." **Found an inconsistency:** the spec said the seasons panel uses a 71° high Sun and gets 4 → about 10 squares, but that only holds for a straight-down beam (4 ÷ sin 24° = 9.8; from 71° it is 9.3). The companion already says "straight down"; the spec now matches and notes the slight exaggeration.
- **Pedagogy.** A1's hint and feedback asked about the child's bedtime; now about summer and winter evenings. A2's right answer moved to position 1 (positions now 5 / 6 / 6).
- **Contract and links.** Crosswalk re-run by script: complete and correctly named. Links to specs 120 and 116 pointed at files that do not exist on this branch; now the draft PR links.
