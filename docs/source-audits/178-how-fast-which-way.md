# Source audit 178: How Fast, Which Way

Date: 2026-10-25. Spec: [178](../specs/178-how-fast-which-way.md). Companion: [178 text](../content/178-how-fast-which-way-text.md).

**Method.** Eight web searches (WebSearch; page fetches were blocked in this session, so claims rest on search-result excerpts and should be re-read at the source in the second pass). The physics (speed = distance ÷ time; average speed as total ÷ total; graph slope as speed; adding and subtracting speeds along a line; adding collinear forces; zero resultant means no change in motion) is standard school physics, cross-checked against UK teaching resources below. All journeys, roll distances, forces and speeds in problem items are **made-up labeled data**, verified by `check178.py` (49 checks, all passing; scratch area, not in the repo).

## Sources consulted

| # | Source | Publisher | URL | Supports |
| --- | --- | --- | --- | --- |
| 1 | "Galileo's ship" | Wikipedia | https://en.wikipedia.org/wiki/Galileo%27s_ship | Passage is in the *Dialogue Concerning the Two Chief World Systems* (1632), Day Two; a closed cabin below deck with flies, butterflies, fish and a dripping bottle; uniform motion cannot be detected inside; Galileo did not claim to have performed it. |
| 2 | "Galileo's Dialogue" (extract) | MacTutor History of Mathematics, University of St Andrews | https://mathshistory.st-andrews.ac.uk/Extras/Galileo_Dialogue | Older English translation of the passage; speaker is Salviati. |
| 3 | "Dialogue Concerning the Two Chief World Systems" | Wikipedia | https://en.wikipedia.org/wiki/Dialogue_Concerning_the_Two_Chief_World_Systems | Publication 1632 (Florence); characters Salviati, Sagredo, Simplicio. |
| 4 | Galileo quotation handout | York University (course page) | https://www.yorku.ca/menary/courses/phys1000/galquote.pdf | Modern translation of the ship passage (corroborates 1-2). |
| 5 | "Knot (unit)" | Wikipedia | https://en.wikipedia.org/wiki/Knot_(unit) | Chip log method; knots 47 ft 3 in (14.4018 m) apart with a 28-second glass, older accounts 30 s; log gives speed through the water; 1 knot = 1.852 km/h exactly. |
| 6 | Navy history note on the log | Naval Historical Society of Australia | https://navyhistory.au/?p=18251 | Early log in use by about the early 17th century (dating differs between sources). |
| 7 | "Adoption of international nautical mile" | US Metric Association | https://usma.org/adoption-of-international-nautical-mile | International nautical mile = 1852 m, set at the 1929 International Extraordinary Hydrographic Conference, Monaco. |
| 8 | "Nautical mile" | IALA dictionary | https://www.iala.int/wiki/dictionary/index.php/Nautical_mile | Nautical mile 1852 m (corroborates 7). |
| 9 | "Ferries" | Basel Tourismus (official) | https://www.basel.com/en/attractions/ferries-1c2b0d1624 | Four Rhine ferries (Wilde Maa, Leu, Vogel Gryff, Ueli) between Grossbasel and Kleinbasel, driven by the current on a cable; first ferry link 1854. |
| 10 | "The ferries of Basel" | Swiss Spectator | https://www.swiss-spectator.ch/the-ferries-of-basel/ | Ferry angled by its rudder and pushed across by the current; history including an 1847 first ferry and the Künstlergesellschaft origin. |
| 11 | "Münster Reaction Ferry" | Atlas Obscura | https://www.atlasobscura.com/places/munster-reaction-ferry | Reaction ferry on a cable, no motor (corroborates 9-10). |
| 12 | "Interpreting distance-time graphs" (KS3 lesson) | Oak National Academy | https://www.thenational.academy/teachers/programmes/science-secondary-ks3/units/moving-by-force/lessons/interpreting-distance-time-graphs | Stationary = speed 0; pupils often read an axis value as the speed. |
| 13 | Unit 39 Distance-Time Graphs (knowledge organiser) | Wilmslow High School | https://www.wilmslowhigh.com/content/uploads/2019/03/Unit-39-Distance-Time-Graphs.pdf | Horizontal line = stationary; speed from gradient (distance ÷ time). |
| 14 | "Balanced and unbalanced forces" (KS3 lesson) | Oak National Academy | https://thenational.academy/teachers/programmes/science-secondary-ks3/units/forces/lessons/balanced-and-unbalanced-forces | Opposite forces subtract, resultant toward the larger; balanced forces give no change in speed; the resultant gives the direction of the change. |
| 15 | KS3 Physics knowledge organiser | King Edward VI School, Suffolk | https://king-ed.suffolk.sch.uk/wp-content/uploads/2020/07/KS3-Physics-Knowledge-Organiser-gravity.pdf | Balanced: stationary or constant speed. |
| 16 | "Addition of Velocities" (OpenStax *College Physics* mirror) | Michigan State University Libraries Open Books | https://openbooks.lib.msu.edu/collegephysics1/chapter/addition-of-velocities-2 | Boat velocity relative to water combines with water velocity relative to shore (relative-velocity basis for the river items). |
| 18 | Galileo, *Dialogue*, Day Two, Drake translation as quoted in course handouts and the Galileo's ship article | via search excerpts | n/a | Salviati: "shut yourself up with some friend in the main cabin below decks"; the reader is asked to observe, then set the ship moving. |
| 19 | "Chip log"; "William Bourne (mathematician)" | Wikipedia; Maritime Archaeology Trust | https://en.wikipedia.org/wiki/Chip_log | Bourne's *A Regiment for the Sea* (1574) is the first printed description of the log and line, with a half-minute glass. |
| 20 | "knot" | Etymonline | https://www.etymonline.com/word/knot | Nautical speed sense from the 1630s, from knots tied along the log line. |
| 17 | Marble teaching-research records for the seven targets | Marble repo at `7bd8b67` (CC BY-SA; paraphrased, not copied) | local clone | Pedagogy summarized in the spec's upstream check. |

## Claims and status

| Claim | Sources | Status |
| --- | --- | --- |
| Galileo's ship passage, 1632 *Dialogue*, closed cabin, flies, fish, dripping bottle; motion undetectable inside | 1, 2, 3, 4 | Checked |
| Speaker is Salviati | 1, 2 (one summary site says Sagredo) | Checked against the two stronger sources; second pass to confirm in a translation |
| Told as a test for the reader to picture; no trial on a real ship reported | 1, 4, 18 | Checked (softened in review: the passage invites the reader to try it) |
| Chip log method; 47 ft 3 in and 28 s; older 30 s; speed through water | 5 | Checked (single source excerpt; ratio verified by script) |
| First printed description of the log and line: Bourne, 1574; "knot" as a speed in English from the 1630s; inventor unknown | 19, 20 | Checked in review (child text says only "an English book from 1574") |
| Nautical mile 1852 m since 1929; 1 knot = 1.852 km/h | 5, 7, 8 | Checked |
| Four Basel ferries, names, cable and current, no motor | 9, 10, 11 | Checked |
| First Basel ferry link 1854 (tourism office) vs 1847 (another account) | 9, 10 | Unsettled; spec gives both, child text gives no year |
| Distance-time graph conventions; resultant rules | 12-16 | Checked (standard physics; subject check still requested) |

## Open checks

1. First Basel ferry: 1854 or 1847. Not in child text.
2. Léon's French line, *Bonjour des Saules !*, for a fluent French reader (spec 120 rule).

## Rights notes for images

No images are embedded. For build art, prefer original drawings. If a real image is wanted: the Basel ferries have freely licensed photographs on Wikimedia Commons (check each file's license); a chip log and sandglass are held by maritime museums with open-access collections (for example Royal Museums Greenwich), to be confirmed per object. Galileo portraits of the period are public domain. No photograph of a real child or real family appears.

## Review pass (independent review, 2026-10-25)

Five WebSearch calls (fetches blocked). **Galileo:** passage, speaker (Salviati) and 1632 confirmed; "did not claim to have performed it" softened to "the reader is asked to picture it; no trial on a real ship is reported", since the text invites the reader to try it. **Chip log:** settled to Bourne 1574 (first printed description, half-minute glass) and "knot" as a speed from the 1630s; added to H2's note and the spec; inventor left unnamed. **Basel:** basel.com gives 1854 (Künstlergesellschaft, near today's Wettsteinbrücke); Swiss Spectator gives 1847; unsettled, no year in child text. **Physics:** zero resultant = steady motion (D2, T12, Léon's letter) and "resultant points the way the motion changes" (D4) read correctly; no "force keeps it moving" in right answers or hints; D4's "about 200 N" cut, since the water push need not equal the earlier figure. **Numbers:** every ramp mean, Trip A/B slope, average (2.4; wrong 3 and 4), river speed (8, 4, 3 h, 5.33), force (100, 0, 70, 80, 60) and knot (11.112; 14.40 m; 28 s ratio) recomputed independently; all correct. **Wording:** Scene 1 note no longer calls a speed a time; T9 states the barge drifts at 2 km/h; H3 uses a defined label; D6 prompt separates the rope's knots from the unit. **French:** *Bonjour des Saules !* is grammatical (de + les); still needs the fluent reader per spec 120.
