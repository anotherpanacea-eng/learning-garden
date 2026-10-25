# Source audit: spec 144, The Ways of the Birds

Date: 2026-10-25. Covers [spec 144](../specs/144-ways-of-the-birds.md) and [its companion text](../content/144-ways-of-the-birds-text.md).

## Verification status

- **First draft:** written without web access (the session's search budget was spent and direct fetches failed). At that stage every real-world claim was marked `[check]`.
- **Fact-check pass, 2026-10-25:** about 40 web searches. Page fetching was blocked, so **claims were checked against search-result excerpts and summaries, not full pages or papers.** Each confirmed claim now cites a source number below (S1 to S40). Claims the excerpts did not support were corrected or cut (listed under "Changed in the fact-check").
- **Quality caveat:** some excerpts came from secondary or popular sites (Live Science, zoo pages, birding forums, general Q&A pages). Where that is the only support, the table says so. The subject reviewer should read the primary papers for S1, S3, S7, S15 and S21 before build.
- **Arithmetic:** every numeric answer was re-checked with `python3 -I` (writer's scratch `work-144/check144.py`), including after the fact-check changes (alternate Strait width of 13 km; tern figures). The script also confirms 2π × 6,378.137 km ≈ 40,075 km.

## Fiction (no source needed)

Labeled as fiction wherever it appears: Willowbank, Vadoalto, the High Notch, the counting board, both made-up mornings and their numbers, Nuria's tally, the four made-up season totals, Hollis's margin line and the saying "Two eyes see half the sky", and the simplified map's rounded distances (900 km, 2,700 km, 600 km).

## Sources and the claims they support

| # | Source (as found in search) | Supports |
| --- | --- | --- |
| S1 | Egevang, C. et al. (2010), "Tracking of Arctic terns *Sterna paradisaea* reveals longest animal migration," *PNAS* 107: 2078 to 2081, https://doi.org/10.1073/pnas.0909493107 (PMC: https://pmc.ncbi.nlm.nih.gov/articles/PMC2836663/); Live Science summary, https://livescience.com/6022-record-migration-small-birds-travel-50-000-miles.html | 11 terns, 1.4 g geolocators; wintering at the Antarctic ice edge; North Atlantic stopover. The mean of about 70,900 km (range 59,500 to 81,600) is given by secondary summaries; the abstract excerpt says "more than 80,000 km" for some birds. Confirm the mean in the full paper. |
| S2 | Fijn, R. C. et al. (2013), *Ardea* 101(1), https://bioone.org/journals/ardea/volume-101/issue-1/078.101.0102/ ; BirdGuides summary | Dutch terns about 90,000 km; Wilkes Land; Indian Ocean staging. |
| S3 | Satellite tracking of white storks (ARGOS, 1991 to 1996), IOC Durban proceedings S49.5, https://internationalornithology.org/PROCEEDINGS_Durban/Symposium/S49/S49.5.htm ; Shamoun-Baranes et al. 2003, https://www.tau.ac.il/~pinhas/papers/2003/Shamoun-Baranes_et_al_JAB_2003.pdf | Mean daily distances of 218 km (Europe), 275 km (Middle East), 288 km (North Africa); some days over 500 km. Supports "about 200 to 300 km a day" in items 2.1 and 2.4. These are eastern-route birds; western-route figures may differ. |
| S4 | Trektellen, Organbidexka 2020 totals, https://www.trektellen.nl/site/totals/2133/2020 ; Noticias de Navarra, 26 Nov 2020, https://www.noticiasdenavarra.com/navarra/2020/11/26/1-millon-aves-migran-pirineo-2198724.html | Organbidexka autumn 2020: about 32,435 black kites, 19,146 honey buzzards, 31,183 wood pigeons; cranes about 6,502 with a peak of 1,880 on 5 November. |
| S5 | Organbidexka Col Libre 1999 newsletter (via search, Mines Paris archive), https://controverses.minesparis.psl.eu/prive/promo04/C04B7/Site/R%E9gions/Sud-Ouest/circu32.pdf ; LPO Aquitaine ORMO reports on migraction.net, e.g. https://cdnfiles2.biolovision.net/www.migraction.net/pdffiles/news/bilLAN_ormo_2016compressed-5880.pdf ; Trektellen Lindus 2025, https://beta.trektellen.nl/site/totals/2134/2025 ; Lindus radar report 2013 | Counting at Organbidexka began in 1979 when naturalists rented a hunting pass for observation; Lindus is an LPO-run migration watch point; about 5,561 white storks at Lindus July to September 2025; radar study at Lindus in September 2013. |
| S6 | Study comparing Organbidexka and Strait of Gibraltar trends 1999 to 2013, *Biodiversity and Conservation* (2016), https://rodin.uca.es/handle/10498/38561 | Counts as trend evidence; rising kite and stork counts linked to more birds wintering in southern Europe; honey buzzard stable. |
| S7 | Western Pyrenees studies (Somport and Portalet); crane phenology, *Acta Ornithologica* 46(1) (2011), https://www.bioone.org/journals/acta-ornithologica/volume-46/issue-1/000164511X589901/ ; BirdForum Opus "Organbideska" | Honey buzzard passage mid-August to mid-September; honey buzzard and black kite peak late August and early September; crane passage about 20 days earlier over 30 years. |
| S8 | Max Planck Institute of Animal Behavior, honey buzzard wintering, https://www.ab.mpg.de/555053/wintering-areas-and-habitats-of-european-honey-buzzards-in-western-africa ; *Ardea* 108(2) 2020 | Winter in West and Central Africa, mostly forest edges and clearings, moist woodland, sometimes lowland rainforest. |
| S9 | Black kite summaries and *European Zoological Journal* (2022), https://doaj.org/article/06beede31f05481bbe29b3de9aadab55 | Black kites winter mostly in sub-Saharan Africa; hundreds to thousands now winter in southern Europe. |
| S10 | Kraniche.de (crane protection), https://kraniche.de/en/wintering-cranes.html and Spanish census news; *Ornis Fennica* paper on southwest France | First Spanish census (2022) about 258,358 cranes, most in Extremadura; growing wintering in southwest France (Arjuzanx). |
| S11 | Swiss red kite tracking (Aebischer), https://cdnfiles2.biolovision.net/www.lecof.ch/userfiles/Publications/Aebischer-Wintering-Proc-RK-France.pdf ; Argos, https://www.argos-system.org/red-kites-wintering-in-spain/ | Spain the main red kite winter area (about 50,000); some winter in southern France. |
| S12 | Argos, wood pigeon tracking, https://www.argos-system.org/common-woodpigeons-keep-their-breeding-sites-change-their-wintering-ones/ ; *Naturwissenschaften* (2022), https://link.springer.com/10.1007/s00114-022-01812-x ; OFB *Faune Sauvage* 276 (2007) and 293 (2011) | East Atlantic flyway to southwest France, Spain and Portugal; Organbidexka and Iraty counts fell from the early 1980s, while other networks found no clear trend, with some birds possibly crossing further west. Passage timing mid-October to mid-November comes from a French hunting-pass guide and a Bird Watching magazine piece (weaker sources). |
| S13 | BTO, "History of ringing," https://www.bto.org/volunteer-surveys/ringing/about/history-ringing ; Northumberland National Park, "The Great Journey of the Swallow" | First British-ringed swallow found in South Africa in December 1912; swallows follow insects, which are scarce in winter; routes over France and Morocco and across the Sahara. |
| S14 | *Movement Ecology* (2016) and press coverage, e.g. https://www.thelocal.es/20220722/climate-change-in-spain-how-storks-have-given-up-migrating-to-live-off-garbage ; SEO/BirdLife census 2020 | Many white storks now stay all year in Spain and Portugal, feeding at landfills. |
| S15 | Eurasian griffon vulture (Wikipedia; BirdForum Opus), https://www.birdforum.net/opus/Griffon_Vulture ; Gibraltar birders' reports | Mostly resident; immature birds may wander or move south; most griffons crossing Gibraltar are young. Item 1.8 and key step 8 now say "most" stay. |
| S16 | Bairlein, garden warbler fuelling (Springer chapter), https://link.springer.com/doi/10.1007/978-3-662-05957-9_22 ; *Ornis Svecica* | Garden warblers about 16 to 18 g rising to up to 37 g before the Sahara, roughly doubling. |
| S17 | Britannica, "Strait of Gibraltar," https://www.britannica.com/print/article/233262 ; Wikipedia | Narrowest width about 13 km (Britannica) or 14.2 km (Wikipedia). Text now says "about 13 to 14 km"; item 2.5's "about 40 times" holds for both. |
| S18 | University of Exeter news (2024), https://news.exeter.ac.uk/?p=12947 ; Phys.org, https://phys.org/news/2024-06-millions-insects-migrate-meter-pyrenees.html (*Proceedings of the Royal Society B*) | More than 17 million insects a year through the Bujaruelo pass; about 90% flies, marmalade hoverflies prominent. |
| S19 | National Geographic, https://www.nationalgeographic.com/animals/article/animals-butterflies-migrations-europe-africa ; Stefanescu et al., *Biology Letters*; Harvard MCZ on Talavera | Painted lady migration between Europe and Africa over several generations; no single butterfly makes the round trip. |
| S20 | Chernetsov (2017) review, https://pure.spbu.ru/ws/files/9463709/Chernetsov_JPCA2017.pdf ; Wiltschko and Wiltschko, *Frontiers in Physiology* (2021), https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2021.667000/full | Sun compass (with internal clock), star compass, magnetic compass; how they interact still debated; magnetic sense light-dependent, cryptochrome proposed, mechanism not known. |
| S21 | Juvenile cuckoo satellite tracking, *PLoS ONE* (2016), https://doaj.org/article/36b47e8be9c24859a0a2a404e7c4449e ; Journey North (cranes); Ostrava zoo report, https://egc.ostrava.cz/cranes-ostrava-postponed-southward-migration/ | Young cuckoos migrate alone on an innate program. Young cranes spend their first winter with their parents (Journey North) and learn the route from them (Ostrava zoo report; whooping-crane studies). Weaker support; the text says "thought to learn". |
| S22 | British Birds, "Raptor migration across the Strait of Gibraltar," https://www.britishbirds.co.uk/journal/article/raptor-migration-across-strait-gibraltar ; white stork GPS study (2020), https://pmc.ncbi.nlm.nih.gov/articles/PMC7708975 | Soaring birds depend on updrafts, avoid long sea crossings, concentrate at Gibraltar and the Bosporus; crosswinds force lower, flapping crossings, and some kites drown; storks: large water bodies lack thermals. |
| S23 | Max Planck Institute, "Daylength drives migration," https://www.ab.mpg.de/309251/daylength-drives-migration ; Iowa DNR, https://www.iowadnr.gov/news-release/2015-03-27/how-do-birds-know-return-spring ; Cornell Lab guidance quoted on a Q&A site | Longer days give more foraging time; day length the main trigger of the migratory urge; birds tolerate cold when food is available. |
| S24 | Tulp and Schekkerman, *Arctic* (2008); USFWS, https://www.fws.gov/story/2024-05/world-migratory-bird-day-2024-protect-insects-protect-birds | Arctic breeding timed to a short insect burst on which chicks depend. ("Fed around the clock" was cut: not supported.) |
| S25 | Midnight sun summaries; Oak National Academy lesson on the Arctic | Midnight sun north of the Arctic Circle in summer; Arctic mostly ocean ringed by land, Antarctica mostly land ringed by ocean. |
| S26 | PBS Nature, https://www.pbs.org/wnet/nature/group/penguins/ ; SeaWorld | Penguins almost entirely Southern Hemisphere; the Galápagos penguin at the equator; none in the Arctic. |
| S27 | Britannica, "How do deserts form," https://britannica.com/story/how-do-deserts-form | Deserts defined by low precipitation (under about 250 mm a year), not temperature; cold deserts exist. |
| S28 | Songbird Sahara crossing studies (2016), https://pmc.ncbi.nlm.nih.gov/articles/PMC4881342 ; https://link.springer.com/article/10.1038/srep21560 | Many fly at night and rest by day; some extend flights into the day or fly 40 to 60 hours non-stop. Desert card reworded to "many". |
| S29 | White stork profiles (Maryland Zoo, https://marylandzoo.org/animal/white-stork ; EBSCO Research Starter) | Diet includes grasshoppers and locusts; gather in thousands at grass fires and locust swarms. Popular sources. |
| S30 | National Geographic Education, "Rain forest," https://education.nationalgeographic.org/resource/rain-forest/ ; other layer guides | Four layers; most species in the canopy; about 2% of sunlight reaches the floor. |
| S31 | RSPB, honey buzzard, https://www.rspb.org.uk/birds-and-wildlife/honey-buzzard ; BirdGuides ID tips; Naturalis species account; *British Birds* (1959) | Small protruding head likened to a pigeon's or cuckoo's; flat wings when soaring; eats wasp larvae and digs out nests. Head shape is hard to judge at distance. |
| S32 | eBird, common crane, https://ebird.org/species/comcra ; Wikipedia; A-Z Animals (stork vs crane) | Crane flies with neck outstretched, often in V-formation, loud trumpeting call, flapping with glides and soaring; storks communicate by bill-clattering instead of song (weak source). |
| S33 | BirdGuides, "Red and black kites photo ID guide" (Forsman), https://www.birdguides.com/articles/identification/red-and-black-kites-photo-id-guide/ | Red kite deeply forked tail and pale wing "windows"; black kite shallow fork. ("Rusty red" removed from the key, not confirmed.) |
| S34 | RSPB, woodpigeon, https://rspb.org.uk/birds-and-wildlife/woodpigeon | Largely grey, white neck patch, white wing patches visible in flight. |
| S35 | USGS Patuxent, barn swallow, https://www.mbr-pwrc.usgs.gov/id/htmid/h6130id.html ; Naturalis and BirdLife Cyprus (griffon) | Swallow's deeply forked tail with long streamers; griffon wingspan about 2.3 to 2.8 m, very long broad wings, soars in circles. |
| S36 | 1974 banding report, *Journal of Field Ornithology*, https://sora.unm.edu/sites/default/files/journals/jfo/v045n03/p0270-p0270.pdf ; All About Birds | Oldest known Arctic tern 34 years. The 30-year lifetime item is framed as a could-be case. |
| S37 | Light-level geolocator summaries; Lisovski et al. | Day length gives latitude and the midpoint of daylight gives longitude, about two rough fixes a day. |
| S38 | Sussex Wildlife Trust, hazel dormouse, https://sussexwildlifetrust.org.uk/species/hazel-dormouse/ | Hibernates about October to April or May. |
| S39 | General Q&A pages on bats and birds (weak) | Bats are mammals with fur that feed young milk; birds have feathers, beaks and hard-shelled eggs. Standard biology; the reviewer should cite a textbook or museum page. |
| S40 | NASA Space Place, https://spaceplace.nasa.gov/s/moon-distance ; JPL glossary, https://ssd.jpl.nasa.gov/glossary/LD.html ; NASA Earth Fact Sheet | Moon's average distance 384,400 km; Earth's equatorial radius 6,378.137 km. |
| S41 | NOAA Ocean Explorer, humpback whale tracking, https://oceanexplorer.noaa.gov/projects/02census/nekton/nekton.html ; University of Hawai'i, "Exploring Our Fluid Earth: animal migration," https://www.manoa.hawaii.edu/exploringourfluidearth/physical/navigation-and-transportation/wayfinding-and-navigation/weird-science-animal-migration | Humpbacks travel between summer feeding waters and winter breeding waters; salmon hatch in rivers, grow at sea and return to their home river to spawn. Added in the review pass. |

## Changed in the fact-check

- **Honey buzzard wintering:** "tropical forests" changed to forest edges, clearings and moist woodland in West and Central Africa (S8). The bird card, map line, rainforest bird line and spec table now say this.
- **Crane wintering:** now Spain and, increasingly, southwest France (S10).
- **Black kite:** most winter south of the Sahara, some now in southern Europe (S9).
- **Red kite:** the key uses the deep fork and pale wing windows; "rusty red" removed (S33).
- **Griffon vulture:** "lives here all year" softened to "mostly" (S15).
- **Strait of Gibraltar:** "about 14 km" changed to "about 13 to 14 km" (S17); item 2.5's explanation updated.
- **Polar card:** "chicks fed nearly all day" replaced with the short insect burst (S24).
- **Desert card:** "small birds cross at night" changed to "many", since some fly non-stop (S28).
- **Savanna card:** now white storks eating grasshoppers and locusts and gathering at grass fires (S29).
- **Why go cards:** the robin example (not confirmed) replaced with "many birds cope with frost if they find food" (S23). The nest card now says birds return north to breed.
- **Swallows:** "cross the sea, often at night" changed to "cross the sea and even the Sahara" (S13), in the companion and the spec's contrast.
- **Tern:** lifespan now "oldest known was 34"; explanations cite S1, S2 and S36.
- **Keeper's note:** adds the real 2020 Organbidexka counts (S4) and the 1979 start (S5).
- **Teach 5:** wildebeest dropped; whales and salmon kept with a `[check]`; adds the Bujaruelo insect count (S18).

## Open checks

1. ~~Whales and salmon as migrants (Teach 5)~~: cleared in the review pass (S41).
2. Spanish lines in Scene 3: fluent reader.
3. Tern mean of about 70,900 km: confirm in the full PNAS paper (S1). The problem items use "about 70,000 km" and stay valid unless the mean is very different.
4. Crane route learning (S21): weak sources.
5. Wood pigeon passage timing (S12): weaker sources.
6. Bats, birds and insects classification (S39): replace with a textbook citation.
7. Adaptation over generations (Structural Adaptations): this is standard evolutionary biology, taken from the Marble research record and not searched.

## Marble and Jane

Marble `data/teaching-research.json` at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` was read for the eight target topics and four candidate references; the spec paraphrases it and copies no text (CC BY-SA). Topic ids and hard prerequisites come from the pinned `curriculum/marble/topics.json` and `dependencies.json`. Jane `LESSONS.md` at `0ec55f7e083976e6fcc3977fca460b1f5e199d91` informed the teach, guided, practice order and the I'm stuck ladder; no Jane code or text is used.

## Image rights

Do not embed photographs. Prefer original illustrations drawn for the game from field-guide references: flight silhouettes, the counting board, the simplified map and the postcards. If reference photos are needed during art work, prefer public-domain or open-access sources (for example U.S. Fish and Wildlife Service public-domain images or museum open-access collections) and record each license in the art review. Wikimedia Commons licenses vary and must be checked one by one. The simplified map is original and must not trace a copyrighted map.

## Review pass, 2026-10-25 (independent reviewer)

Searches (6): Organbidexka 2020 totals (no independent confirmation found beyond S4's Trektellen page; kept, as Trektellen is the counters' own database), Lindus 2025 storks (nothing found; the figure rests on S5's Trektellen page, which a reviewer should open), Egevang et al. 2010 (confirms mean 70,900 km, range 59,500 to 81,600, in the paper's own table), the Spanish crane census (BirdGuides, https://www.birdguides.com/news/first-spanish-crane-census-completed : 258,358 in winter 2021-22; a later winter counted about 183,000, so the spec now says later winters counted fewer), whales and salmon (S41, open check 1 cleared).

Fixed: the Teach 5 and spec `[check]` tags removed (S41); crane census dated and qualified; duplicate Moon-distance entry removed from the spec's numbers list; the morning-to-depth sentence aligned with the companion (October morning written for Sapling, every morning open to all); bar-chart input made buildable (bars set in steps of 1 against labeled gridlines, since 36 and 24 are not multiples of 5); Arctic postcard "frozen ocean" softened to "icy ocean"; choice 3.3 reworded (the right answer was the longest; the bat option was mis-tagged `flying-means-bird`); 2.2's wrong option lengthened so the right one is not the longest; 4.3's right answer shortened; 3.7's duplicate tag renamed; 3.5's tag for a nonexistent "nothing lives there" line removed; 4.2 to 4.4 prompts brought to 15 words or fewer with a separate setup line. All numeric answers re-run with `python3 -I` (reviewer scratch `review-144/`) and correct. Target ids and hard prerequisites re-checked against the pinned Marble files; the crosswalk is complete and correctly named.
