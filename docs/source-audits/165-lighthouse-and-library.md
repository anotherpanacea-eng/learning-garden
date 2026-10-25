# Source audit: spec 165, The Lighthouse and the Library

Date: 2026-10-25. Writer: Claude (writing pass only). Covers [spec 165](../specs/165-lighthouse-and-library.md) and [its companion text](../content/165-lighthouse-and-library-text.md).

## How the checking was done

Facts were checked with 18 web searches on 2026-10-25 (the wave's budget). Direct page fetches are blocked by this session's network proxy, so each claim rests on the search engine's extracts from the named pages, not on a full read. Where sources disagreed, the text uses "about", a range or the narrower claim. A reviewer with ordinary web access should open the cited pages before build, and a second fact-check pass is planned.

Numbers: every numeric answer and every computed figure (date gaps, degrees, Eratosthenes' arithmetic, the stadion range, latitude gap, great-circle distance, obliquity) was confirmed by a Python script run with `python3 -I` on 2026-10-25, kept in the writer's scratch area, not the repo. See the spec's Checks for implementation.

## Sources consulted

### Alexander, the founding and the Ptolemies

| Source | Publisher | URL | Supports |
| --- | --- | --- | --- |
| History of Alexandria | Wikipedia (to locate scholarship) | https://en.wikipedia.org/wiki/History_of_Alexandria | Founding usually 331 BCE; seat of the Ptolemaic kingdom. |
| Alexandria, Egypt | World History Encyclopedia | https://www.worldhistory.org/Alexandria_of_Egypt/ | Founding 332-331 BCE on the site of Rhakotis; Alexander left within months; Cleomenes and the architect Dinocrates; Ptolemy I made it his capital after 323 BCE. |
| Alexandria | New World Encyclopedia | https://www.newworldencyclopedia.org/entry/alexandria | "Possibly 332 BCE" variant, hence "some say 332". |
| History of Persian Egypt | Wikipedia | https://en.wikipedia.org/wiki/History_of_Persian_Egypt | Cambyses II's invasion 525 BCE; Persian rule not continuous (independence 404, reconquest 343 BCE); the satrap Mazaces handed Egypt to Alexander without a fight; arrival late 332 BCE. |
| Imperialism: the Persians and Alexander the Great | Harvard Center for Hellenic Studies | https://chs.harvard.edu/chapter/4-imperialism-the-persians-and-alexander-the-great | Alexander ended Persian (31st dynasty) rule in Egypt. |
| Battle of the Hydaspes | Encyclopaedia Britannica | https://www.britannica.com/print/article/278047 | 326 BCE, against Porus; army refused to go on; death in Babylon 323 BCE; empire divided among generals. |
| Death of Alexander the Great | World History Encyclopedia | https://www.worldhistory.org/article/2366/death-of-alexander-the-great/ | Died in Babylon, June 323 BCE, aged 32. |
| Assyrian conquest of Egypt | Wikipedia; Britannica (Esarhaddon) | https://en.wikipedia.org/wiki/Assyrian_conquest_of_Egypt ; https://www.britannica.com/biography/Esarhaddon | Esarhaddon took Memphis in 671 BCE from the Nubian pharaoh Taharqa; Ashurbanipal later sacked Thebes. |

### The Pharos

| Source | Publisher | URL | Supports |
| --- | --- | --- | --- |
| Lighthouse of Alexandria | Wikipedia | https://en.wikipedia.org/wiki/Lighthouse_of_Alexandria | Construction 284-246 BCE; Sostratus of Cnidus; height at least 100 m; earthquake damage from 956, collapse dated 1303 or 1323; Qaitbay's fort, 1480, reusing stone; the word passed into French *phare*, Italian and Spanish *faro*. |
| Lighthouse of Alexandria | Structurae | https://structurae.net/en/structures/lighthouse-of-alexandria | Completion 279 BCE; height 120 m (one estimate). |
| Lighthouse of Alexandria | Art in Context | https://artincontext.org/lighthouse-of-alexandria/ | Completion about 280 BCE; estimates of 120-140 m. |
| Lighthouse of Alexandria (print article) | Encyclopaedia Britannica | https://www.britannica.com/print/article/455210 | 1994 survey by Jean-Yves Empereur before a planned breakwater; hundreds of masonry blocks; colossal king statue (thought to be Ptolemy II); breakwater dropped. |
| Alexandria, Egypt (underwater archaeology) | French Ministry of Culture | https://archeologie.culture.gouv.fr/archeo-sous-marine/en/alexandria-egypt | The Centre d'Études Alexandrines survey; thousands of objects documented. |
| Archaeology Magazine abstract (Empereur) | Archaeological Institute of America | https://archive.archaeology.org/9903/abstracts/alexandria.html | Context for the survey. |
| pharos | Online Etymology Dictionary | https://www.etymonline.com/word/pharos | Greek *pharos* "lighthouse", from the island; ultimate origin unknown. |

### The Library and the Museum

| Source | Publisher | URL | Supports |
| --- | --- | --- | --- |
| Library of Alexandria | Encyclopaedia Britannica | https://www.britannica.com/topic/Library-of-Alexandria | About 295 BCE Ptolemy charged Demetrius of Phalerum with founding the library and Mouseion; books from ships copied and labeled "from the ships"; Galen's account of Ptolemy III, Athens's official texts of Aeschylus, Sophocles and Euripides, the 15-talent pledge, originals kept. |
| Library of Alexandria | Wikipedia | https://en.wikipedia.org/wiki/Library_of_Alexandria | Library possibly built under Ptolemy II; collection estimates 40,000 to 400,000; purge of intellectuals under Ptolemy VIII about 145 BCE; 48 BCE fire, extent unclear. |
| Who burned the Library of Alexandria? | National Geographic | https://www.nationalgeographic.com/history/article/who-burned-library-of-alexandria-egypt | Context for the 48 BCE fire and the slow-decline view. |
| The Alexandrian Library: dissipation through neglect and apathy | Quintus Curtius (blog, secondary) | https://qcurtius.com/2019/04/14/the-alexandrian-library-dissipation-through-neglect-and-apathy/ | Gradual decline over generations; Gibbon and the Serapeum (391 CE). Secondary; used only alongside the above. |
| Callimachus produces the Pinakes | History of Information | https://www.historyofinformation.com/detail.php?id=136 | Callimachus's *Pinakes*; "120 rolls" is reported but hedged, so child text does not give the number. |
| Hypatia | Encyclopaedia Britannica | https://www.britannica.com/biography/Hypatia | Born about 355 CE, died 415 CE; mathematician, astronomer, philosopher; commentaries on Diophantus and Apollonius, lost. |
| Hypatia (Biographical Encyclopedia of Astronomers) | MacTutor, University of St Andrews | https://mathshistory.st-andrews.ac.uk/BEA/hypatia_bea.pdf | Theon her father; Theon's commentary on Ptolemy's *Almagest*. |

### Eratosthenes

| Source | Publisher | URL | Supports |
| --- | --- | --- | --- |
| Eratosthenes (Dictionary of Scientific Biography) | MacTutor, University of St Andrews | https://mathshistory.st-andrews.ac.uk/DSB/Eratosthenes.pdf | Life, librarianship, measurement. |
| Eratosthenes' method | Paris Observatory etymological dictionary | https://dictionary.obspm.fr/terms/eratosthenes-method/ | Gnomon at Syene casting no shadow at the summer solstice; 1/50 of a circle; 5,000 stadia; 250,000 stadia. |
| Eratosthenes and the measurement of the Earth (Convergence) | Mathematical Association of America | https://old.maa.org/node/116342 | Cleomedes as the main source and his three assumptions (same meridian, 5,000 stadia, parallel rays); Strabo's 252,000; stadion likely 155-185 m; errors partly cancel; latitude difference about 0.0198 of a circle. |
| Eratosthenes paper | MEMOCS (Mathematics and Mechanics of Complex Systems), 2013 | https://msp.org/memocs/2013/1-1/memocs-v1-n1-p04-p.pdf | Hultsch's 157.5 m (error under 1%, resting largely on Pliny) and the Attic 185 m (most widely accepted now; error about 17%). |
| Eratosthenes | New World Encyclopedia; Encyclopedia.com | https://www.newworldencyclopedia.org/entry/Eratosthenes ; https://www.encyclopedia.com/history/news-wires-white-papers-and-books/eratosthenes | Born about 276 BCE in Cyrene, died about 194 BCE; chief librarian from about 245-235 BCE (sources differ), hence "about 240 BCE". |
| Aristotle's arguments for a round Earth | Ohio State University, Astronomy 161 notes | https://www.astronomy.ohio-state.edu/pogge.1/Ast161/Unit2/notes.html | Greek scholars held the Earth was round before Eratosthenes. |

### Cleopatra VII and Roman Egypt

| Source | Publisher | URL | Supports |
| --- | --- | --- | --- |
| Cleopatra's languages (Rolf Strootman) | ASOR, *ANE Today*, 2024 | https://www.asor.org/anetoday/2024/02/cleopatras-languages | Plutarch's claims: many languages, first of her dynasty to learn Egyptian; scholars read his list cautiously. |
| Cleopatra VII | World History Encyclopedia | https://worldhistory.org/Cleopatra_VII | Death in 30 BCE ended the Ptolemaic line; Rome took Egypt. |
| Cleopatra | Wikipedia | https://en.wikipedia.org/wiki/Cleopatra | First language Koine Greek; Egypt became a Roman province. Reign 51-30 BCE, at first with Ptolemy XIII. |
| The Battle of Actium | HISTORY.com | https://www.history.com/this-day-in-history/september-2/the-battle-of-actium | Actium, 2 September 31 BCE; Octavian reached Alexandria in 30 BCE. |
| Roman Egypt | History Crunch (secondary) | https://historycrunch.com/roman-egypt/ | Egypt annexed after Cleopatra's death; grain supply for Rome. |

### Legacy

| Source | Publisher | URL | Supports |
| --- | --- | --- | --- |
| Luxor Obelisks | Wikipedia | https://en.wikipedia.org/wiki/Luxor_Obelisks | Arrived in Paris 1833, raised in the Place de la Concorde in 1836; its twin remains at Luxor Temple. |
| Erection of the Luxor Obelisk, 25 October 1836 | Baltimore Museum of Art | https://collection.artbma.org/objects/55347/erection-of-the-luxor-obelisk-at-the-place-de-la-concorde-on | The 1836 raising, a contemporary print. |
| Coptic language | Encyclopaedia Britannica; EBSCO Research Starters | https://www.britannica.com/topic/Coptic-language ; https://www.ebsco.com/research-starters/language-and-linguistics/coptic-language | Coptic is the last stage of Egyptian; no native speakers; used in Coptic church liturgy. |

## Second fact-check pass (2026-10-25)

Eight more searches settled all ten open items. No `[check]` remains in the spec or companion.

| # | Item | Result | Source |
| --- | --- | --- | --- |
| 1 | Ptolemy I's royal title | Confirmed: 305/304 BCE. | Wikipedia, Ptolemy I Soter (https://en.wikipedia.org/wiki/Ptolemy_I_Soter); New World Encyclopedia (https://www.newworldencyclopedia.org/entry/Ptolemy_I_Soter) |
| 2 | Ptolemies shown as pharaohs | Confirmed: they adopted pharaonic regalia and built Egyptian temples; Dendera relief of Cleopatra VII and Caesarion in pharaohs' crowns. | World History Encyclopedia image 8293 (https://worldhistory.org/image/8293/relief-of-cleopatra-vii-and-caesarion-at-the-dende/); National Geographic (https://www.nationalgeographic.com/history/history-magazine/article/egypt-last-pharaoh-caesarion-love-child-caesar-cleopatra) |
| 3 | Pharos among the Seven Wonders | Confirmed with a correction: it appears in wonder lists only from about the 500s CE; the earliest lists gave the walls of Babylon. Spec says so; child text keeps "later writers named it". | Center for Online Judaic Studies (https://cojs.org/The_Lighthouse_of_Alexandria-_285-247_BCE/) |
| 4 | Fire as the light; mirror legend | Fire at night confirmed; fuel raised by a shaft. The ship-burning mirror is told by Abu Hamid al-Gharnati (1100s) and is doubted. Board card now says "told by a writer in the 1100s; experts doubt it". | Muslim Heritage (https://muslimheritage.com/lighthouse-of-alexandria/); New World Encyclopedia (https://www.newworldencyclopedia.org/entry/Lighthouse_of_Alexandria) |
| 5 | 640s burning story | Confirmed late and rejected: first in Abd al-Latif (about 1203) and Ibn al-Qifti (about 1227); Britannica calls it a 12th-century fabrication. | Britannica, fate of the Library (https://www.britannica.com/topic/Library-of-Alexandria/The-fate-of-the-Library-of-Alexandria); New York Review of Books (https://www.nybooks.com/articles/1990/09/27/the-vanished-library-2/) |
| 6 | Governance of Roman Egypt | Confirmed: an equestrian prefect chosen by and answerable to the emperor. Spec now says "a prefect the emperor chose". | Wikipedia, List of governors of Roman Egypt (https://en.wikipedia.org/wiki/List_of_governors_of_Roman_Egypt); Cambridge History of Egypt chapter (https://www.cambridge.org/core/books/cambridge-history-of-egypt/egypt-under-roman-rule-the-legacy-of-ancient-egypt/29EF41B413D84B440F204EB45E3542B2) |
| 7 | Euclid in Alexandria | Confirmed: taught there under Ptolemy I, about 300 BCE (Proclus). | Britannica, Euclid (https://www.britannica.com/biography/Euclid-Greek-mathematician); MacTutor (https://mathshistory.st-andrews.ac.uk/Strick/euclid.pdf) |
| 8 | Day of the 1836 obelisk raising | Not settled (24 or 25 October); cut. Only the year is used. | (none needed) |
| 9 | Alexandria's Jewish community | Confirmed: present from the early 3rd century BCE, with its own quarter under the Ptolemies. No size claim is made. | Wikipedia, History of the Jews in Alexandria (https://en.wikipedia.org/wiki/History_of_the_Jews_in_Alexandria); Jewish Virtual Library (https://www.jewishvirtuallibrary.org/alexandria) |
| 10 | Library kept originals of ships' books | Confirmed as Galen's account (commentary on Hippocrates' *Epidemics* III): originals kept, copies returned to owners. Spec attributes it to Galen. | Cambridge, *New Surveys in the Classics* (https://www.cambridge.org/core/product/B0A11A27F3DDE4B5C2D4664BF9086ACD); Attalus.org translations (https://www.attalus.org/translate/extracts.html) |

Not used, because sources disagree or are weak: Cleopatra's exact death date; a single Pharos height; Callimachus's "120 rolls"; the claim that Eratosthenes used a well at Syene (later tellings add one; the account we have mentions pointers); the number of objects recorded in 1994 (3,300 or 3,500).

## Computed, not sourced

- Aswan latitude 24.09°N, Alexandria 31.20°N (standard coordinates): gap 7.11°, 1/50.6 of a circle; great-circle distance about 843 km; north-south component about 790 km.
- Earth's axial tilt about 240 BCE about 23.72° (polynomial approximation), placing Aswan about 0.4° north of the tropic of the time. A reviewer may prefer "a little north of the tropic".
- Modern pole-to-pole circumference about 40,008 km (child text: "about 40,000 km").

## Images and rights

No images are embedded. Suggested at build, rights to be confirmed: an **original** drawing of the Pharos labeled "one artist's guess"; an original schematic map; an original Shadow Bench diagram. Museum photographs of Ptolemaic objects only if open-access (for example the Metropolitan Museum's Open Access program, CC0) and confirmed at build. No photograph of human remains and no picture of Cleopatra presented as a likeness.

## Review pass (independent reviewer, 2026-10-25)

Five web searches; all numbers re-run with `python3 -I` (`review-165/nums.py`, scratch, not the repo): 301, 280, 641, 438, 10, 50, 250,000, 39,375 and 46,250 km (−1.6%, +15.6% against 40,008), 787.5 and 925 km, 7.11° (1/50.6), 843 km great-circle and 791 km north-south, 40,000 km for C7, 25 wedges at 14.4°. Hard prerequisites and names re-read from the pinned files by script; all match.

| Item | Finding | Change |
| --- | --- | --- |
| Sostratus as designer | Sources split: Pliny calls him the architect; Strabo and the Posidippus epigram make him dedicator and probably funder (Wikipedia, Sostratus of Cnidus, https://en.wikipedia.org/wiki/Sostratus_of_Cnidus; Society for Classical Studies abstract, https://classicalstudies.org/pharos-alexandria-interface-between-non-extant-inscription-and-other-written-evidence). | Reading now says "Old writers link it to a man named Sostratus". The underclaim board card "Nobody knows who designed it" (filed as We know) was itself an overclaim; replaced with "Nobody knows what the tower was for". |
| Cleopatra as "last Ptolemy to rule" | Caesarion (Ptolemy XV) was co-ruler from 44 BCE and nominal sole ruler for days before Octavian had him killed (World History Encyclopedia, https://www.worldhistory.org/Caesarion/). | "The last Ptolemy to hold real power". "End of the pharaohs" cut: Roman emperors were still shown as pharaohs. Caesarion named in the spec only. |
| Actium | Octavian's victory was over Cleopatra and Mark Antony together. | Antony named as her Roman ally; no romance framing. |
| Pharos in wonder lists | Philo and Antipater listed Babylon's walls; Gregory of Tours (500s CE) is the earliest surviving list with the Pharos (Wikipedia, Seven Wonders; BMCR 2026.08.21, https://bmcr.brynmawr.edu/2026/2026.08.21/). | Confirmed; no change. |
| Cleomedes' account | Gnomon at Syene with no shadow at solstice noon; 1/50 of a circle at Alexandria; scaphe use is a scholarly inference (MacTutor, https://mathshistory.st-andrews.ac.uk/SH/eratosthenes_sh.pdf; Paris Observatory dictionary). | Confirmed; text already says "pointer" and does not claim a scaphe. |
| Egypt's conquerors | Kushite (Nubian) kings ruled Egypt as pharaohs before the Assyrian conquest; Assyria ruled through vassals. | "Each ruler borrowed Egyptian ways" narrowed to Persian, Greek and Roman rulers; A8 explanation notes other conquerors. |
| Pip's "shadow almost gone" | At 42.5°N (spec 141) the June noon Sun is about 71° high: shadow about 0.35 of the post. | Now "so short"; C4's easier example matches. |
| Privacy | A7's easier example used "your family"; B1's used "you" copying a recipe. | Recast with a generic family and the baker. |
| Hypatia | Commentaries known through later records (the Suda). | Keeper's note says "Old records say she wrote". Death stays in the grown-up panel only. |
