# Source audit: spec 177, Moons, Comets and Other Suns' Planets

Date: 2026-10-25. Writer pass, then the review pass below. WebFetch was unavailable, so claims were checked with 17 WebSearch queries (budget 18) against the result snippets and the pages they name. Where only secondary pages turned up, that is said. Numbers derived from checked inputs were computed with `python3 -I check177.py` (scratch only; 31 of 31 checks passed).

## Sources consulted

| Source | Publisher | URL | Supports |
| --- | --- | --- | --- |
| Tidal Locking | NASA Science | https://science.nasa.gov/moon/tidal-locking/ | The Moon spins once per orbit and keeps one face toward Earth; far side hidden, not dark. |
| Tidal locking (Moon in Motion) | NASA | https://moon.nasa.gov/moon-in-motion/earth-and-tides/tidal-locking | Same. |
| Moon study guide; phases page | RemNote; SkySafari user guide | https://www.remnote.com/learn/science/earth-and-space-science/astronomy/moon/moon-study-guide ; https://userguide.skysafariastronomy.com/general/basic-concepts/phases-and-tides-of-the-moon | Sidereal month 27.32 days, synodic 29.53 days (secondary; the synodic value is also reproduced by script from 27.3217 and 365.256, and matches spec 141's PyEphem mean). |
| Halley's Comet; Johann Georg Palitzsch | Wikipedia (summarizing Britannica-level sources) | https://en.wikipedia.org/wiki/Halley%27s_Comet ; https://en.wikipedia.org/wiki/Johann_Georg_Palitzsch | 1705 analysis of 1531, 1607, 1682 comets; return predicted for 1758 (some say 1757); Halley died 1742; Palitzsch, farmer and amateur, Christmas Day 1758; perihelion 13 March 1759 delayed by Jupiter and Saturn, computed by Clairaut, Lalande, Lepaute; first non-planet shown to orbit the Sun; last perihelion 9 Feb 1986, next 28 July 2061. |
| Halley predicts return of comet | EBSCO Research Starters | https://www.ebsco.com/research-starters/history/halley-predicts-return-comet | Same story, independent summary. |
| See You in 2061 | Star Walk | https://starwalk.space/en/news/halleys-comet | 2061 return; Eta Aquariids (May) and Orionids (October) from Halley's debris. |
| Clyde Tombaugh; Venetia Burney | Wikipedia | https://en.wikipedia.org/wiki/Clyde_Tombaugh ; https://en.wikipedia.org/wiki/Venetia_Burney | Lowell Observatory, Flagstaff; blink comparison of plates; 18 Feb 1930; announced 13 March 1930; Burney, Oxford, suggested the name; adopted 1 May 1930. |
| Feb 18, 1930: Discovery of Pluto | Astronomy.com | https://www.astronomy.com/today-in-the-history-of-astronomy/feb-18-1930-discovery-of-pluto/ | Discovery date. |
| Pluto features given first official names | NASA | https://www.nasa.gov/solar-system/pluto-features-given-first-official-names | Burney crater and Tombaugh Regio honor the two. |
| Ceres (dwarf planet); Giuseppe Piazzi | Wikipedia; Linda Hall Library | https://en.wikipedia.org/wiki/Ceres_(dwarf_planet) ; https://www.lindahall.org/about/news/scientist-of-the-day/giuseppe-piazzi/ | Piazzi, Palermo, 1 Jan 1801; first took it for a comet; dwarf planet in 2006. |
| 51 Pegasi b | Wikipedia; Museum of Science Boston | https://en.wikipedia.org/wiki/51_Pegasi_b ; https://www.mos.org/article/exoplanet-anniversary-30-years-discovery-51-pegasi-b | Mayor and Queloz; announced 6 Oct 1995 (Nature 378, 355); radial velocity with ELODIE at Observatoire de Haute-Provence; period about 4.23 days; first around a main-sequence Sun-like star; 2019 Nobel shared. |
| Prix Nobel de physique 2019 | Encyclopaedia Universalis | https://www.universalis.fr/encyclopedie/prix-nobel-de-physique-2019/2-des-planetes-hors-du-systeme-solaire-une-revolution/ | 4.23-day orbit; Nobel. |
| HD 209458 b; STARE project paper | Wikipedia; arXiv astro-ph/0005009 | https://en.wikipedia.org/wiki/HD_209458_b ; https://arxiv.org/pdf/astro-ph/0005009 | First transit, 9 and 16 Sept 1999 (Charbonneau et al.), about 1.7% dip; Henry et al. partial transit, Nov 1999; published 2000. |
| 6,000 exoplanets confirmed | EarthSky; Sky at Night | https://earthsky.org/space/6000-exoplanets-confirmed-worlds-outside-solar-system/ ; https://www.skyatnightmagazine.com/news/6000-confirmed-exoplanets | NASA count reached 6,000 (announced 17 Sept 2025); over 8,000 candidates; fewer than 100 directly imaged. |
| Kepler confirms planet in habitable zone | Space.com / Live Science | https://space.com/13821-nasa-kepler-alien-planets-habitable-zone.html | Kepler launched March 2009; transit dips; habitable zone as where liquid water could exist; candidates need confirmation. |
| Why is Venus hotter than Mercury? | USC Dornsife; Big Think; Popular Science | https://dornsife.usc.edu/news/stories/why-is-venus-hotter-than-mercury-when-mercury-is-closer-to-the-sun/ ; https://www.popsci.com/science/why-is-venus-hotter-than-mercury-when-mercury-is-closer-to-the-sun/ | Venus hotter than Mercury; thick CO2 atmosphere traps heat; Venus about 462-467 °C day and night; Mercury about 430 °C by day, about −180 °C at night (attributed to NASA's Mercury page). |
| Hubble shows Great Red Spot smaller than ever | NASA / JPL | https://science.nasa.gov/missions/hubble/nasas-hubble-shows-jupiters-great-red-spot-is-smaller-than-ever-measured ; https://jpl.nasa.gov/news/jupiters-great-red-spot-is-smaller-than-ever-measured | Storm shrinking; 2014 about 10,250 miles across, still wider than Earth (about 7,900 miles). |
| Which planets have rings? | Live Science; NASA rings study page | https://www.livescience.com/space/planets/which-planets-have-rings ; https://solarsystem.nasa.gov/studies/29/rings-research-in-the-next-decade | All four giants have rings; Jupiter's faint and dusty; Uranus's (found 1977) and Neptune's (1984) dark. |
| Mars's moons and rings | EarthSky; Astronomy.com | https://earthsky.org/space/did-ancient-mars-have-rings-deimos/ ; https://www.astronomy.com/science/ancient-mars-may-have-once-had-rings-then-moons-then-rings/ | Phobos and Deimos; discovered 1877. |
| Moons: active worlds; Galilean moons notes | NASA (Webb asset); Ohio State course notes | https://science.nasa.gov/asset/webb/moons-active-worlds ; https://www.astronomy.ohio-state.edu/gaudi.1/Ast2291/Docs/GiantMoons.pdf | Io more than 400 active volcanoes, tidal heating; Europa ice shell over a global ocean; Titan's methane and ethane lakes, methane rain. |
| Voyager 2 | NASA Science; Space.com | https://science.nasa.gov/mission/voyager/voyager-2 ; https://www.space.com/17693-voyager-2.html | Launch 20 Aug 1977; gravity assists from planet to planet; flybys 1979, 1981, 1986, 1989; only craft to visit Uranus and Neptune. |
| ISS speed and altitude | issinfo.net; MSU course key (secondary) | https://issinfo.net/blog/tracking-the-iss-why-its-orbit-altitude-and-speed-constantly-change | About 400-420 km; about 7.66 km/s, 27,600 km/h; about 90-93 min. Cross-checked by script (circular speed 7.67 km/s at 400 km). Spec 164's audit holds the NASA citation for "about 90 minutes". |
| Asteroids, comets and meteors | NASA ("We asked a NASA scientist") | https://www.nasa.gov/science-research/planetary-science/whats-the-difference-between-asteroids-comets-and-meteors-we-asked-a-nasa-scientist-episode-16 | Meteoroid, meteor, meteorite by location; asteroids rocky, comets icy. |
| Sibling specs 141, 162, 164, 172 and their audits | this repo, draft branches | see spec links | The Sun rule wording (162); phases, planets order, Uranus on its side, Pluto 2006 (141); comet tail, planet tests, cannonball (172); floating, telescopes, 90-minute orbit (164). |
| Marble teaching research records | Marble `data/teaching-research.json` at `7bd8b67` (CC BY-SA 4.0) | local clone | Paraphrased in the upstream check only; no text copied. |

## Computed (script, not sourced)

Synodic month from sidereal; 50.5-minute average moonrise delay; Halley gaps and 1758; Pluto 76 years; station loop 42,544 km and 92.6 minutes; transit depths for Jupiter (1.01%, 1 in 99) and Earth (0.0084%, 1 in 11,920) from NSSDC radii (Sun 695,700 km, Jupiter 69,911 km, Earth 6,371 km, as used in specs 141 and 172); grid-star squares.

## Open checks

- **Biosignatures**: Keeper's note only, hedged ("non-living causes can mimic them"); no NASA wording quoted.
- **Venus temperature**: sources give 462 to 467 °C; spec says about 465 °C; child text gives no number.
- **Mars moons discovery by Asaph Hall**: year 1877 confirmed; the discoverer's name is left out.

## Review pass (2026-10-25, independent reviewer)

Seven WebSearch queries (standard). Settled:

- **Great Red Spot**: NASA's Hubble pages now describe it as about one Earth wide (2014 figure 16,500 km; later sizes vary by year and method). Child text changed from "wider than Earth" to "about as wide as Earth"; [check] removed.
- **New Horizons**: closest approach 14 July 2015, about 12,500 km above Pluto (NASA release; National Geographic). [check] removed.
- **Halley**: *A Synopsis of the Astronomy of Comets* (1705) linked 1531, 1607 and 1682 and forecast 1758 (Smithsonian Libraries copy; Wikipedia; EBSCO). "1757" aside cut. Palitzsch (Prohlis, near Dresden) saw it on the night of 25 December 1758; text now says "Christmas night" everywhere.
- **Harvest-moon delay**: NASA (as reported by Fox News and Space.com) gives about 25-30 minutes across the northern US and 10-20 farther north, versus a 50-minute average. Scene 1 was at Harvest Supper yet showed a 50-minute delay; it now shows a shorter harvest-moon delay (about 25 minutes) and the Keeper's note teaches the average and the exception.
- **Sidereal / synodic month**: 27.3217 and 29.53 days (NASA Moon Fact Sheet as quoted by the Physics Factbook; Wikipedia citing NSSDC).
- **Biosignatures**: Rein, Fujii and Spiegel (2014) and Meadows (NASA ExoPAG 2015) describe abiotic false positives for O2/CH4; wording hedged.
- **Voyager 2**: assists were used at Jupiter, Saturn and Uranus to reach Neptune; text no longer says it "borrowed speed" at Neptune.
- Already sourced and kept: Ceres 1801 (Piazzi), Pluto 1930 and IAU 2006, Venetia Burney (no age), 51 Pegasi b 1995 at Haute-Provence, first transit 1999 (HD 209458 b).

Math re-run (`review-177/math.py`, scratch): all numbers reproduce except the station loop, which is 92.4 minutes at 7.67 km/s (was 92.6); fixed in the spec. B8's 92 minutes stands.

Cross-pack: Sun rule matches 162/172 wording; "about 90 minutes, about 16 sunrises" matches 164; Venus hottest and Mars rust match 141; 29.5-day cycle matches 141; Pluto 2006 and Neptune facts match 141 and 172 (this pack uses no scale-walk numbers). Child text keeps the old Keeper unnamed.

## Images and rights

No images are embedded. Proposed: NASA planet, moon and comet images (NASA imagery is generally not copyrighted; check each item's credit line, since some are ESA or partner images); Halley's comet 1986 images from NASA or ESA Giotto with ESA's terms checked; an exoplanet light curve drawn fresh from the model, not copied. Portraits of Halley, Piazzi and Tombaugh only from public-domain or museum open-access collections, with the source stated on the card.

## Fiction

Willowbank, Harvest Supper, Pip's moon wait, Bramble's headline, Ember's lantern dip and Léon's letter are fiction. No real person is given invented words; Léon's teacher's slip (dip versus wobble) is corrected in the Keeper's note.
