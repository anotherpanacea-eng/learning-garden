# Ramps, Levers and the Mill Hoist: source audit

Audit for [spec 154](../specs/154-ramps-levers-hoist.md) and its [companion text](../content/154-ramps-levers-hoist-text.md). Date: 2026-10-25. All proposed copy, characters, scenes, the Arrow Board, the Drop Door results and the `hoist-lever-v1` model are original. No learner or family record, image, worksheet or lesson code is included.

## Verification method (read first)

- **11 web searches** (standard mode) on the first pass, and **4 more** in a second fact-check pass the same day that settled every open item. **WebFetch was blocked, so no page was opened in full.** Each claim below was judged from search-result excerpts of the named pages. Several sources are encyclopedias, museums, mill-heritage groups, a university physics department and a central bank; a few are secondary (popular science sites, manufacturer blogs) and are flagged. A reviewer with ordinary web access should open the key pages before build.
- Physics and pedagogy rest on (a) the refreshed Marble teaching-research records (paraphrased, CC BY-SA, no text copied) and (b) standard textbook physics (ideal levers, ramps, pulleys and gears; free fall without air). These still need the subject check.
- Every number in the problem sets was checked by `check154.py` (scratch area, `python3 -I`): 30 checks, all passing.

## Local material read

| Material | Used for |
| --- | --- |
| Draft spec 120, `origin/claude/project-thread-zpfie6:docs/specs/120-keeper-of-the-ways.md` (cast, acts, chapters, writing rules) | The miller (she/her) and her cat, Pip, Bramble and the magpie, the librarian (they/them), Act I ch. 4, Act II ch. 1, Act VI ch. 3 (the long rain; the mill holds). |
| Spec 147, `origin/claude/project-thread-pj161v-life-matter:docs/specs/147-mills-energy.md` and companion | Boundary: 147 owns energy, "friction warms things" (its T5), the greased axle and perpetual motion. This pack never teaches energy or work and points to 147 for why push × distance stays the same. |
| Spec 123 Clockwork Mill, `origin/claude/project-thread-88brkk` | Boundary: 123 owns programming the sack cart Trundle at `#mill`. Trundle appears here only as an object on the Arrow Board. Separate save root. |
| Built Workshop ramp (`dist/learning-invitations.mjs`, `#workshop`), specs 56 and 60 | The existing friction work: a model cart on smooth or rough surfaces, and comparison design. Revisited, not re-taught. |
| `docs/six-act-strands.md`, `curriculum/topic-coverage.csv` | Forces & Motion: 27 topics, one covered (`mt_-p_xp4hMvh`, scoped practice from the Workshop). S6 family codes. |
| Pinned `curriculum/marble/topics.json` and `dependencies.json` | Target ids and names; every hard prerequisite in the crosswalk. |
| Marble `data/teaching-research.json` at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` | Records for `mt_lcf8lx-LkZ`, `mt_3WMADSy0mA`, `mt_k7GOtslF-x`, `mt_AvrQauS_zX`, `mt_Y9k86G8BBT`, `mt_Q2k3fSwyzQ`, `mt_9NvuqZKNiV`, plus `mt_B3W5EfimJw` and `mt_jgNB2752b9` (related, no claim). Paraphrased only. |
| Jane `LESSONS.md` at `0ec55f7e083976e6fcc3977fca460b1f5e199d91` | Teach → guided → practice, the "I'm stuck" ladder, writing style, three options, glossary. |
| `docs/history-and-science-buildout.md` (PR #137) | Format, labels, status line, threads. |

## Sources (judged from search excerpts)

| Source | URL | Supports |
| --- | --- | --- |
| Mental Floss, "Hammer and Feather Drop on the Moon" (quotes the Apollo 15 Preliminary Science Report via Joe Allen) | https://www.mentalfloss.com/article/22913/hammer-and-feather-drop-moon | 1.32 kg aluminum geological hammer; 0.03 kg falcon feather; dropped together from about 1.6 m; same acceleration, landed together. |
| Atlas Obscura, "The Falcon Feather on the Moon" | https://www.atlasobscura.com/articles/objects-of-intrigue-the-falcon-feather-on-the-moon | The feather was left on the Moon. |
| Nautilus, "55 years ago an Apollo 15 astronaut dropped a hammer on the Moon"; STAO | https://nautil.us/55-years-ago-an-apollo-15-astronaut-dropped-a-hammer-on-the-moon-1283339 ; https://stao.ca/hammer-feather-experiment-on-the-moon-1971/ | David Scott; 2 August 1971; near the end of the third moonwalk, facing the TV camera. |
| Wikipedia, "Galileo's Leaning Tower of Pisa experiment" | https://en.wikipedia.org/wiki/Galileo%27s_Leaning_Tower_of_Pisa_experiment | The story comes from Viviani's biography (composed about 1654); Galileo's own writings do not mention the tower; many historians treat it as doubtful or a thought experiment. |
| Physics World, "The legend of the leaning tower" | https://physicsworld.com/a/the-legend-of-the-leaning-tower/ | Viviani as the only source for the tower; historians' doubt. |
| Wikipedia, "Delft tower experiment"; Amusing Planet; UA Magazine | https://en.wikipedia.org/wiki/Delft_tower_experiment ; https://www.amusingplanet.com/2024/10/the-delft-tower-experiment.html ; https://www.ua-magazine.com/2021/04/23/galileo-tower-of-pisa-experiment-done-in-delft/ | 1586; Simon Stevin and Jan Cornets de Groot; two lead balls, one about ten times heavier; about 30 feet onto a wooden platform; landed at nearly the same time; published in *De Beghinselen der Weeghconst* (1586). |
| Galileo Unbound blog, "The Surprising Simon Stevin of Bruges" | https://galileo-unbound.blog/tag/delft/ | Which Delft church (Nieuwe or Oude Kerk) is disputed; the text says only "a church tower in Delft". |
| University of Virginia physics, Galileo lectures (Fowler) | https://galileoandeinstein.phys.virginia.edu/lectures/gal_accn96.htm ; https://galileoandeinstein.phys.virginia.edu/tns61.htm | Inclined plane to slow the fall; water clock; distances in equal times in the odd-number ratio 1, 3, 5, 7; the *Two New Sciences* dialogue on heavy and light balls dropped from 200 cubits (landing nearly together); doubt that Aristotle tested his rule. |
| University of Oklahoma Libraries, inclined-plane instrument exhibit; University of Florence abstract | https://galileo.ou.edu/exhibits/inclined-plane-instrument.html ; https://flore.unifi.it/handle/2158/906376 | Grooved board about 12 cubits long lined with parchment; bronze ball; water-clock timing. |
| Wikipedia, "Two New Sciences" | https://en.wikipedia.org/wiki/Two_New_Sciences | Publication 1638 (one other excerpt said 1634; treated as an error). |
| Banco de España, "Euro coins" guide (2026, English) | https://www.bde.es/f/webbe/EFE/BilletesYMonedas/monedas_en_euros/Monedas_en_euros_2026_ingles.pdf | The 1, 2 and 5 cent coins are strongly magnetic. |
| Wikipedia, "1 euro cent coin", "5 euro cent coin"; Stanford Advanced Materials coin test | https://en.wikipedia.org/wiki/1_euro_cent_coin ; https://en.wikipedia.org/wiki/5_euro_cent_coin ; https://www.samaterials.com/content/magnetic-response-video-test-of-euro-coins.html | Copper-covered steel; 10, 20, 50 cent coins (Nordic gold, a copper alloy) not magnetic. |
| Metal Supermarkets; Fractory; Langley Alloys (industry sources, secondary) | https://www.metalsupermarkets.com/which-metals-are-magnetic/ ; https://fractory.com/magnetic-metals-non-magnetic-metals-with-examples/ ; https://www.langleyalloys.com/knowledge-advice/what-makes-austenitic-stainless-steel-non-magnetic/ | Iron, nickel, cobalt magnetic; copper, brass, aluminum, lead, gold, silver, tin, zinc not; austenitic stainless (many 304/316 grades) usually non-magnetic or weakly so. Consistent with the Marble record's IOP-based list. |
| Hampshire Mills Group newsletter | https://hampshiremills.org/Newsletters/117%20Summer%2017%20Newsletter/117%20Page%207.htm | Waterwheel power used for the sack hoist, engaged by a rope from the bin floor; trap doors close by gravity after the sack passes. |
| Canmore (Historic Environment Scotland) site records | https://canmore.org.uk/site/38689 ; https://canmore.org.uk/site/138367 | Sack hoists driven from the main shaft or main waterwheel, controlled by cords from every floor; trapdoor with a central hole. |
| Mills Archive, sack hoist with slack-belt drive | https://millsarchive.org/product/sack-hoist-with-slack-belt-drive-tower-mill-thelnetham/ | Belt drive with a loose-belt clutch worked by cords (a windmill example; the text only says "in some mills"). |
| Newhall Mill, "Sack Hoist" | https://newhallmill.uk/sack-hoist | Chain winds on a drum to pull the sack through trap doors; the miller counted the bangs of the closing doors. (This mill's hoist is diesel-driven, so the text says only "at one mill".) |
| MacTutor (St Andrews), Archimedes (DSB) | https://mathshistory.st-andrews.ac.uk/DSB/Archimedes.pdf | Archimedes credited with the compound pulley; Plutarch's ship story; the "place to stand" saying known from Pappus. |
| Heath, *Archimedes* (Project Gutenberg) | https://www.gutenberg.org/files/35550/35550-h/35550-h.htm | Plutarch's account of moving a loaded ship with a compound pulley; the saying and its later sources. |
| NASA NSSDC Moon Fact Sheet; NASA Science, "Moon Facts" | https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html ; https://science.nasa.gov/moon/facts/ | Moon surface gravity 1.62 m/s² against Earth's 9.80 (ratio 0.165); "one-sixth of Earth's". |
| Museo Galileo catalogue, Viviani's *Racconto istorico*; IMSS biography of Viviani | https://catalogue.museogalileo.it/indepth/RaccontoIstoricoVitaGalileoByViviani.html ; https://brunelleschi.imss.fi.it/pencil/eng/html/People/16 Viviani.htm | Viviani's account is dated 29 April 1654, written as a letter to Prince Leopold de' Medici, unpublished in his lifetime, first printed in 1717 in the *Fasti consolari*. |
| "Water Weighing" (excerpt of a 1968 *Isis* article quoting *Two New Sciences*) | https://mesures.hpdst.gr/node/74 | Galileo's timing: a jet of water from a large vessel caught in a small glass during each roll, then weighed on a very accurate balance. |
| Wikipedia, "On the Equilibrium of Planes"; MacTutor, "Archimedes on statics" | https://en.wikipedia.org/wiki/On_the_Equilibrium_of_Planes ; https://mathshistory.st-andrews.ac.uk/Extras/Archimedes_on_statics/ | Archimedes proves the law of the lever (Book I, Propositions 6-7): magnitudes balance at distances inversely proportional to them. |

## Claims from standard physics (no web source; subject check)

Free fall without air, t = √(2h/g); ideal lever balance (weight × distance); ideal ramp (push = weight × height ÷ length); ideal pulley (pull = load ÷ supporting sections; rope = lift × sections); gear ratios; air resistance opposing motion and growing with area and speed; terminal speed; balanced forces and unchanged motion; like poles repel, opposite poles attract.

## Open checks

None remain. The second pass settled or cut each first-pass item:

1. **Galileo weighed the water:** confirmed (Isis excerpt quoting *Two New Sciences*). `[check]` removed.
2. **Archimedes on levers:** confirmed (*On the Equilibrium of Planes*, Book I). `[check]` removed; the spec now names the work.
3. **Viviani's date:** confirmed as dated 1654, first printed 1717 (Museo Galileo). The spec now says so.
4. **Moon gravity:** confirmed from NASA's fact sheet (1.62 against 9.80 m/s²).
5. **Kitchen spoon:** cut. Industry sources could not settle which stainless grades a child would meet, so the Magnet Sweep now uses a real silver spoon (silver is non-magnetic in every source above).
6. **Stevin's two balls:** the text keeps only "one about ten times heavier", which every source supports; the conflicting size detail is not used.

The trims in the second pass removed repetition only (duplicate Keeper's notes, restated contrasts, compressed upstream rows); no checked fact was added. `check154.py` was re-run afterwards: 30 checks, all passing.

## Rights notes for images

No image is embedded. If a build wants pictures: the Apollo 15 hammer-and-feather footage and stills are NASA media, generally not copyrighted (follow NASA's media usage guidelines and do not imply endorsement). Portraits of Galileo and Stevin and the title page of *Two New Sciences* (1638) are public domain by age; use museum open-access scans and record the institution. Mill sack-hoist photographs on heritage sites are usually copyrighted: commission original art instead. Coin images: original drawings are preferred to photographs of real coins.

## Review pass (independent reviewer, 2026-10-25)

Two web searches (standard mode; WebFetch blocked, so excerpts only):

| Checked | Result | Change |
| --- | --- | --- |
| Do Galileo's own writings mention a tower? | Yes, in a limited way. His early manuscript *De Motu* (about 1590, unpublished until the 19th century) mentions drops from an unnamed "high tower" and claims, wrongly, to have "often tested" that wood at first falls ahead of lead (Lane Cooper's reading; Nature 1936 notes; finestresullarte.info). He never says he used the Leaning Tower. Sources: https://www.nature.com/articles/137488a0 ; https://www.finestresullarte.info/en/news-focus/between-science-and-legend-galileo-s-experiment-from-the-tower-of-pisa ; https://geosirius.ifz.ru/galileo-tower-pisa | "Never mention the tower" was too strong. The spec now names *De Motu*; the 4.1 source card says he "never said he used that tower", and its statement now reads "Galileo wrote that he dropped balls from the Leaning Tower" (not true from this source). |
| Did Stevin record the two balls as landing exactly together ("one sound")? | Not confirmed from excerpts; accounts say "nearly the same time" (Wikipedia, Delft tower experiment; Amusing Planet). | Kept "nearly"; item 4.2's Aristotle distractor shortened. |

Other fixes, no search needed: "Air barely touches either" (wrong: air touches everything) became "barely slows"; the balls feedback no longer says air "slows them about the same" (the drag is similar, but its effect on the heavier ball is smaller); "Trundle coasting" with a forward push became "rolling steadily"; T7 says falling was too fast "for the clocks of his day"; Galileo's water "ran", not "dripped" (a jet, per the *Isis* excerpt); item 1.6 now asks whether sticking *shows* the nail is a magnet (a nail held to a magnet is in fact temporarily magnetized, so "does that make it a magnet?" had no clean answer); item 4.3's right answer no longer claims a feather "falls slowest"; item 3.4's child-facing explanation no longer names "Spec 147"; item 3.5's right answer is no longer the longest; the unused "A story people told" label and the Archimedes mention in the grown-up panel were cut, since the companion has no Archimedes card. T12 "round" became "over" (US). Three cards trimmed to 30 words or fewer.

Numbers: every answer and wrong-choice value recomputed independently (`review-154/math.py`, `python3 -I`): all agree (lever 3.1-3.4, ramps, pulleys, gears, Galileo 80 cm, tug-of-war 1 and 7, airless falls 1.0 s / 2.46 s / 1.41 s / 0.57 s, 9.80/1.62, 1.32/0.03 = 44, 30 ft = 9.1 m). Right answers: 5 A, 5 B, 5 C.

Contract: the crosswalk was re-derived from the pinned `curriculum/marble/dependencies.json` by script; all 13 hard edges for the 7 targets match, with correct names; every id exists in the pinned `topics.json`; 27 Forces & Motion topics, 1 mapped.

Cross-pack: spec 147 says the Clockwork Mill (123) owns gears, but 123 is a programming spec with no gear teaching, so this pack's gear panel duplicates nothing. 147 also says it keeps work = force × distance out; this pack's "push × distance stays the same" is a model pattern only and never names work, so the two agree. Spec 133's Long Line has no 1586, 1638 or 1971 card, and spec 141's Galileo card is the telescope (1609-1610); the spec's revisit row now says so.
