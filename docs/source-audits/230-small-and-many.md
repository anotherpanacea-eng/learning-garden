# Small and Many: source audit

Audit for [spec 230](../specs/230-small-and-many.md) and its [companion text](../content/230-small-and-many-text.md). Date: 2026-10-25. All proposed copy, characters, scenes and the three bench models (`scale-v1`, `twig-v1`, `orchard-v1`) are original. No learner or family record, image, worksheet or lesson code is included.

## Verification method (read first)

- 18 web searches (standard mode). **No page was opened in full** (WebFetch was not used); each claim below was judged from search-result excerpts of the named pages. Several excerpts came from press coverage or secondary pages; a reviewer should open the key pages before build. Where excerpts disagreed, the text takes the cautious reading or carries `[check]`.
- Biology and pedagogy rest on (a) the refreshed Marble teaching-research records for all eight targets (paraphrased only, CC BY-SA, no shared run of six or more words) and (b) standard school biology (spiracles, mouthparts, molting, pollination and fertilization). Both still need the subject check.
- Numbers were checked with `check219.py` (scratch area, `oca13/219/`, `python3 -I`): 33 checks passed, including a brute force over all 31 starting splits of the twig model and all 81 orchard runs. The companion was linted with `lint219.py` (prompt, teach-card, feedback and scene lengths; no em-dashes; positions; right answer never the single longest; no digits in Sprout items): clean. A six-word overlap scan of the spec and companion against the eight Marble records found five shared runs, all reworded; a rerun found none.

- **Independent review (2026-10-25).** A fresh reviewer opened the key pages (Wikipedia "Edmond Albius" and "Nanfang Caomu Zhuang") with WebFetch and re-searched the dung beetle, flea, insect-count, mammal-count, beetle-count, stick-insect, honeybee-eye and ant-mimic claims. Rows below marked *(review)* changed. Numbers were recomputed with a new script (`oca13/review-219/check.py`, `python3 -I`): 132 checks, 4 real failures before fixes, none after.

## Local material read

| Material | Used for |
| --- | --- |
| Spec 120 (main) §§4-8, 11 and `docs/content/120-story/act-5.md` | Cast and pronouns (Dot a ladybug, she/her), Act I ch. 3, Act II chs. 1-2, Act III chs. 2-3, Act V path 1 (night garden), writing lengths, the Hollis rule, nobody dies in the fiction. |
| Spec 150 (Bee Meadow) | Owns the body plan, metamorphosis, hive, dance, Pollen Path, hide/warn/copy, threats; claims `mt_oNWXXAn3cn` and `mt_07Geg7LITa` (met-elsewhere rows). The 87 of 115 crops figure is cited from it. |
| Spec 161 (Like and Unlike) | Owns the peppered moth and natural selection's evidence; linked read-only, not retold. |
| Spec 116 (Field Guide Almanac) | Garden key and care card; claims `mt_yR1moI5kX1`; supports `mt_BI6oGIO-xM` inline without a claim. |
| Specs 62, 65, 28, 66, 88, 151 | Leg key and partial `mt_4vHa3I5bNj`; one butterfly; the damp-shelter snail; aphid and hoverfly food links; decomposers in food webs. |
| Spec 144 | Claims `mt_v3Vz_Pgjjv` (Animals Everywhere). |
| Spec 149 | Claims `mt_WNBHZ1d94L`; owns the plant side of pollination and fruit. |
| Spec 179 | Structure, depth and length template; save and lesson patterns. |
| Pinned `curriculum/marble/topics.json`, `dependencies.json` | Ids, names, ages and the eight hard edges. A grep of `docs/` found no spec claiming or mentioning any of the eight target ids; `#living/small` is unused. |
| Marble `data/teaching-research.json` at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` | Records for `mt_LTb0ZReMR2`, `mt_zir5yyAzUB`, `mt_R7LEuZjTmx`, `mt_M7YrfAZk8u`, `mt_7_XXh9NCp0`, `mt_Oz8yNPNtub`, `mt_5_Zr9xXDNH`, `mt_wWpa5fFDZP`. |
| Jane `LESSONS.md` at `0ec55f7e083976e6fcc3977fca460b1f5e199d91` | Teach, guided, practice; the "I'm stuck" ladder; three options; writing limits; glossary. |

## Sources (judged from search excerpts)

| Source | URL | Supports |
| --- | --- | --- |
| Smithsonian, "Numbers of Insects (Species and Individuals)" | https://www.si.edu/spotlight/buginfo/bugnos | About 900,000 named living insect kinds; older estimates up to 30 million (Erwin). |
| Wikipedia, "Insect biodiversity" | https://en.wikipedia.org/wiki/Insect_biodiversity | 950,000 to 1,000,000 described insects. *(review)* With about 2.1 million named species in all (Catalogue of Life), the spec now says "about half", not "more than half". |
| Macmillan *Life* (11e), "More than half of all described species are insects" | https://digfir-published.macmillanusa.com/life11e/life11e_ch31_24.html | Same, textbook source. |
| Stork 2018, *Annu. Rev. Entomol.* 63:31-45, abstract (Griffith repository); HKU seminar abstract | https://research-repository.griffith.edu.au/handle/10072/376764 | *(review)* Citation confirmed: about 1.5 million beetle, 5.5 million insect and 7 million terrestrial arthropod species; about 1 million insects named; 30 million or more statistically unlikely. The 5.5 million mean is from Stork et al. 2015 (PNAS), range 2.6 to 7.8 million. |
| Mammal Diversity Database | https://mammaldiversity.org | About 6,700 living mammal species. *(review)* v2.1 (Zenodo) lists 6,689 extant (6,672 wild); "about 6,700" holds. |
| Queen Mary University of London news, Rob Knell; Live Science; Gizmodo | https://qmul.ac.uk/sbbs/news/items/super-bug-worlds-strongest-insect-revealed-by-dr-rob-knell.html | *Onthophagus taurus* males pulled 1,141 times body weight (Knell and Simmons 2010, *Proc. R. Soc. B*): strongest **insect**. *(review)* Coverage says the researchers found one mite slightly stronger, so the Keeper's note's "No animal yet tested beats that" was changed to "No insect". A 2007 mite figure (about 1,180 times) seen only in secondary coverage stays `[check]` and out of child text. |
| Oxford University Museum of Natural History learning zone; *Parasite* 2004 review of Cadiergues et al. 2000 | https://www.parasite-journal.org/articles/parasite/pdf/2004/04/parasite2004114p387.pdf | Cat fleas: about 200 body lengths (OUMNH). *(review)* Measured horizontal jumps average about 20 cm (range 2 to 48 cm), so best jumps, not averages, pass 100 lengths; Scene 3 now says a flea "can jump" more than a hundred lengths. The springy-pad catapult (resilin; Bennet-Clark and Lucey 1967, Sutton and Burrows 2011) is standard and added to the flea card. |
| Guinness World Records, fastest flying insect | https://www.guinnessworldrecords.com/world-records/70635-fastest-flying-insect | 58 km/h for *Austrophlebia costalis* in bursts; a 1917 98 km/h figure was ground speed. |
| American Museum of Natural History (Tumblr) | https://tumblr.amnh.org/tagged/dragonfly | Dragonflies up to about 50 km/h (30 mph). Used for "about 50 km/h". |
| Eisner and Aneshansley, PNAS (via PMC) | https://pmc.ncbi.nlm.nih.gov/articles/PMC22274 | Bombardier spray ejected at about 100 °C. |
| Science News, bombardier beetle | https://www.sciencenews.org/blog/science-ticker/beetles-toxic-explosive-vapor-explained | Spray released in pulses. |
| Streinzer et al. 2013, PLoS ONE (honeybee eyes) | https://pmc.ncbi.nlm.nih.gov/articles/PMC3584085/ | *(review)* *A. mellifera* workers about 5,375 ommatidia per eye (n = 4); older reviews say about 4,500. "About 5,000" holds. |
| Illinois Grainger news, arthropod-eye camera (Song et al. 2013, *Nature* 497) | https://grainger.illinois.edu/news/stories/2013-04-29-bugs-view-inspires-new-digital-cameras-unique-imaging-capabilities | 180 lens units on a dome; the paper says about 160° view. Text says "very wide". |
| Wikipedia, "Mick Pearce"; Nautilus | https://en.wikipedia.org/wiki/Mick_Pearce | Eastgate Centre, Harare, 1996; termite-mound inspiration; chimneys and building mass. |
| Puget Sound Museum of Natural History; Natural England review | https://www.pugetsound.edu/puget-sound-museum-natural-history/exhibits/terrestrial-panel/common-woodlouse | Woodlice are crustaceans with poorly waterproofed skin and gill-like parts that must stay moist. |
| Australian Museum, care of stick insects; Phasmida Species File (Catalogue of Life 2018) | https://australian.museum/learn/animals/insects/care-of-stick-insects/ | Twig and leaf mimicry; swaying. *(review)* The Species File lists 3,196 living species (2018), so the text now says "more than 3,000". |
| Shamble et al. 2017 (*Proc. R. Soc. B*), via PMC; Cornell news | https://pmc.ncbi.nlm.nih.gov/articles/PMC5524487/ | *Myrmarachne formicaria* walks on all eight legs in winding ant-like paths and raises its front legs when stopped. *(review)* Confirmed: predatory jumping spiders shown animations attacked mimics no more often than ants (no significant difference); non-mimics about three times more than mimics. |
| FAO newsroom, IPBES 2016 | https://www.fao.org/newsroom/detail/Pollinators-vital-to-our-food-supply-under-threat/en | Animal pollination directly responsible for 5-8% of global crop production by volume, US$235-577 billion a year; three quarters of leading crop types depend at least partly. |
| Wikipedia, "List of crop plants pollinated by bees"; USDA Handbook 496 (via ECHO) | https://en.wikipedia.org/wiki/List_of_crop_plants_pollinated_by_bees | Wheat, rice and maize are wind- or self-pollinated. |
| Wikipedia, "Nanfang Caomu Zhuang" (opened in full); Encyclopedia.com, "Hsi Han" | https://en.wikipedia.org/wiki/Nanfang_Caomu_Zhuang | Traditionally Ji Han, about 304 CE; ants sold in rush-mat bags to guard oranges. *(review)* Authorship and date are disputed (one study calls it a 12th-century compilation; a symposium found later additions and a Southern Song final form), and "earliest biological control" is some scholars' claim. Card reworded: "said to be about 1,700 years old, though scholars still debate its age" and "may be the oldest record". |
| University of Michigan library blog; NLM, Hooke | https://www.nlm.nih.gov/exhibition/historicalanatomies/hooke_home.html | *Micrographia* (1665 imprint): flea plate, fly's compound eye, fold-out plates. |
| Oklahoma State psychology museum; Biodiversity Heritage Library | https://www.biodiversitylibrary.org/part/341824 | Charles Henry Turner, "Experiments on color-vision of the honey bee", *Biol. Bull.* 19 (1910); St. Louis teacher; barred from a university post. |
| Wikipedia, "Edmond Albius" (opened in full); National Geographic | https://en.wikipedia.org/wiki/Edmond_Albius | *(review)* Born about 1829; 1841, about twelve, enslaved on Réunion; vanilla brought in the 1820s set no fruit because its pollinator was absent outside its native range; a thin stick or grass blade and a thumb; nearly all vanilla is still hand-pollinated; freed when France ended colonial slavery in 1848; locals sought a reward or stipend for him without success; a rival claim (Richard) is described as debunked. Card now names him in its body, gives the reason, the tool and his freedom, and keeps his later hardships out. |
| Mountain Research and Development (2012), Maoxian human pollinators; American Bee Journal | https://complete.bioone.org/journals/Mountain-Research-and-Development/volume-32/issue-2/MRD-JOURNAL-D-11-00108.1/The-Human-Pollinators-of-Fruit-Crops-in-Maoxian-County-Sichuan/10.1659/MRD-JOURNAL-D-11-00108.1.full | Hand pollination of pears and apples in Maoxian; five to ten trees a person a day; causes disputed (pesticides vs economics). |
| Quote Investigator; Linda Hall Library | https://quoteinvestigator.com/2010/06/23/beetles/ | "Inordinate fondness for beetles": most likely Haldane, unconfirmed, "possibly apocryphal" in the earliest print (1959). Labeled a story people tell. |

## Open checks

1. **Flea jump** `[check]`: sources range from about 40 to 200 body lengths. Child text says "well over 100"; the bench's 2 mm, 30 cm flea is a labeled model.
2. **Dragonfly lens count** `[check]`: "about 30,000 per eye" appears only in weak sources; kept out of child text ("many more").
3. **Stork 2018 citation** `[check]`: the 5.5 million figure is confirmed from an abstract; volume and pages are from memory.
4. **Spanish line** (Scene 6) needs a fluent reader, per spec 120: "¿Quién lleva el polen del carrizo?" / "El viento." *(review: "caña" changed to spec 120's own word, *carrizo*; the scene now has Nuria bring a bundle of reeds, as in spec 120's Act III chapter 2, not reed seed.)*
5. **Orchard rule** (10, 25, 40 apples per 100 blossoms) is a made-up model; real fruit set varies with variety and weather (subject check).
6. **Hand-pollination helper rate** (10 trees a day) uses the top of the Maoxian range (five to ten) as a round model number.
7. **Ant-mimic test** used video animations, not live animals; the text says "about as rarely as real ants" without a number.
8. **Mite strength** `[check]`: one mite may out-hold the dung beetle (about 1,180 times its weight, 2007, secondary source only). Child text claims only "no insect".
9. **Flea mills** *(review, fixed)*: 225 m is about 22 of spec 156's made-up 10 m mills, not 15.

## How facts were kept honest

- Numbers that sources give as ranges are rounded or said with "about"; the 30 million insect figure is mentioned only in the spec as an older guess.
- The Sichuan note says plainly that people disagree why hand pollination started and continues.
- The Eastgate card says scientists still study how mounds move air, rather than claiming the building copies a solved mechanism.
- The Haldane line is a "story people tell", never "a true thing from history".
- Woodlice are called crustaceans, not insects; the ant-mimic is called a spider throughout.

## Rights notes

No images are embedded. Hooke's *Micrographia* plates (1665) are public domain; check each scan's licence before use and prefer open-access library scans. Turner and Albius portraits, if wanted, need a licence check. All Willowbank art and the drawn figure are original. Marble records are CC BY-SA and are paraphrased only.

## Privacy and safety review

- The drawn figure in the Hall of Records stands in for the research's "scale it to the child's own body"; nothing is measured on the child.
- No screen shows a creature drying out, hurt or kept; the mismatch is reasoned and the woodlouse walks back to the shade.
- Off-screen cards are grown-up-led, look-only, and unrecorded; no sightings, photos or places are stored.
- Edmond Albius's enslavement appears once, gently, at Keeper's Desk depth only, named person first ("a boy ... named Edmond Albius, who was enslaved") and ending with his freedom; "enslaved" is in the glossary.
- *(Codex review, PR #176)* The mouthpart table and item 4.2 matched each mouth to one food and rejected a butterfly drinking spilled sugar water, which butterflies do (fed sugar water through the proboscis is standard butterfly husbandry). Both now match each mouth to a feeding way (cut and chew a leaf; sip nectar from deep in a flower; mop up a spill on a flat surface), which stays one-to-one: jaws and a housefly's short sponging pad cannot reach deep nectar, a proboscis cannot cut or sponge, and jaws do not sponge. A shared-food line says sugar water suits both butterfly and housefly. The saved `mouths` map now stores a way id.
- *(review)* Item 4.5 and the new-part card now ask about "a newly found insect", not "a new beetle": every beetle has chewing jaws, and long-snouted weevils drill into seeds, which made distractor B arguably right.

## Bounded repair note (2026-10-25)

The twig model keeps an inherited twiggy/plain category fixed for an individual; it no longer claims that an insect’s body cannot change during its lifetime. Growth, molting and metamorphosis remain explicit and distinct from changes in a population’s inherited-trait mix. NC State’s General Entomology account describes gradual and complete changes of form: https://genent.cals.ncsu.edu/bug-bytes/morphogenesis/ (opened in this repair review). This scoped repair is not a full biology/source or fluent-language clearance; the open checks above remain open.
