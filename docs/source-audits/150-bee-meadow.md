# Source audit: spec 150, The Bee Meadow

Date: 2026-10-25. Covers [spec 150](../specs/150-bee-meadow.md) and [its companion text](../content/150-bee-meadow-text.md).

## Verification status

- **Method:** two passes on 2026-10-25: 18 web searches while writing, then 17 in a fact-check pass (35 in all). Page fetching was blocked, so **claims were checked against search-result excerpts and summaries, not full pages or papers.** Each confirmed claim cites a source number below.
- **Result:** every `[check]` item from the first pass was confirmed, corrected or cut (see "Fact-check pass" below). None remain in the spec or companion.
- **Quality caveat:** some excerpts came from secondary or popular sites. Where that is the only support, the table says so (S14, S15, S16, S26 are the weakest). A reviewer with ordinary web access should open S1, S3, S5, S6, S8, S12, S13, S28 and S29 before build.
- **Arithmetic:** every numeric answer and the Dance Floor table were checked with `python3 -I` (writer's scratch `work-150/check150.py`; all 19 checks passed). The fact-check pass changed no numbers.
- **Pedagogy, not facts:** Marble topic descriptions and `data/teaching-research.json` records (CC BY-SA) shaped the lesson design. They are not cited as factual sources, and no text is copied.

## Fiction (no source needed)

Labeled as fiction wherever it appears: Willowbank's meadow, the orchard keeper's hives and observation shed, the storm and the meadow's one-week recovery, the night-garden lantern, the four named flower patches with their bearings and distances, the Sun's set position on the Dance Floor, the robin's-eye hedge scene, all town characters and dialogue, Hollis's margin line, and the made-up rule "1 second of waggling means 1 kilometer".

## Sources and the claims they support

| # | Source (as found in search) | Supports |
| --- | --- | --- |
| S1 | Nobel Prize press release, Physiology or Medicine 1973, https://www.nobelprize.org/prizes/medicine/1973/press-release/ | Karl von Frisch shared the 1973 prize with Konrad Lorenz and Nikolaas Tinbergen, for discoveries on the organization and elicitation of individual and social behavior patterns. |
| S2 | Linda Hall Library, Scientist of the Day: Karl von Frisch, https://www.lindahall.org/about/news/scientist-of-the-day/karl-von-frisch/ ; Simple English Wikipedia, Karl von Frisch (secondary) | Von Frisch decoded the dance and revised his first reading; his interpretation was doubted and later confirmed. |
| S3 | Schürch lab, Virginia Tech, "Honey bee waggle dance calibration," https://schurch.ento.vt.edu/project/waggle_calibration/ | Distance is encoded in waggle-run duration; calibration is done with feeders at known distances; each bee has her own calibration. |
| S4 | "The miscalibration of the honeybee odometer," arXiv 2405.12998, https://arxiv.org/pdf/2405.12998 ; biorxiv 10.1101/2020.12.17.423277 (Asian honey bees) | No single universal seconds-per-kilometer value; slope and intercept differ by study, colony and landscape. |
| S5 | SARE, "The life cycle of honey bees," https://projects.sare.org/media/pdf/T/h/e/The-life-cycle-of-honey-bees.pdf ; WSU CAHNRS transcript, https://cahnrs.wsu.edu/descriptive-transcripts/?p=818 | Egg to adult about 16 days (queen), 21 (worker), 24 (drone); eggs hatch in about 3 days. Per-stage pupal figures conflict between sources and are not used. |
| S6 | University of Delaware MAAREC, "The Colony and Its Organization," https://canr.udel.edu/maarec/honey-bee-biology/the-colony-and-its-organization/ | Queen, workers and drones; queens lay most eggs in spring and early summer, up to about 1,500 a day at peak. |
| S7 | University of Arizona, Activity Sheet 12, https://cales.arizona.edu/pubs/insects/ahb/act12.html ; Irish Beekeeping, "The honey bee colony: a brief outline" (secondary) | Summer colonies of tens of thousands of workers (figures from about 50,000-60,000 up to 80,000), a few hundred drones; a higher theoretical egg maximum (2,500), not used. |
| S8 | Klein, A.-M. et al. (2007), "Importance of pollinators in changing landscapes for world crops," *Proc. R. Soc. B* 274: 303-313, https://doi.org/10.1098/rspb.2006.3721 (HAL: https://hal.inrae.fr/hal-02669190); UC Berkeley news release, https://newsarchive.berkeley.edu/news/media/releases/2006/10/25_pollinator.shtml | 87 of 115 leading crops depend on animal pollination for fruit, vegetable or seed production, 28 do not; 35% of global production volume comes from pollinator-dependent crops, 60% from crops that do not depend on them, 5% unevaluated. |
| S9 | Wildlife Trusts, "Identify solitary bees in the UK," https://wildlifetrusts.org/node/11042 ; National Bee Unit Fact Sheet 23, https://www.nationalbeeunit.com/assets/PDFs/3_Resources_for_beekeepers/Fact_Sheets/Fact_23_solitary_bees.pdf ; GWCT blog 2022 | About 270 UK bee species (NBU: about 267), just under 250 solitary; about 90% solitary; about 20,000 described species worldwide. UK counts vary by scope. |
| S10 | Australian Museum, "What are the differences between flies and wasps?", https://australian.museum/learn/animals/insects/what-are-the-differences-between-flies-and-wasps/ ; Agriculture Victoria, "Hover flies," https://agriculture.vic.gov.au/biosecurity/pest-insects-and-mites/non-pest-insects-and-invertebrates/hover-flies | Flies have one pair of wings (hind wings reduced to halteres), wasps and bees two pairs; hoverflies usually have short antennae and large eyes, cannot bite or sting, and are Batesian mimics of bees and wasps. Antennae are not conclusive alone. |
| S11 | Wikipedia, "Henry Walter Bates," "Batesian mimicry," "Müllerian mimicry," https://en.wikipedia.org/wiki/Batesian_mimicry (secondary) | Bates described mimicry among Amazon butterflies in an 1862 paper to the Linnean Society of London; Fritz Müller proposed shared warning among defended species in 1878 (English translation 1879). |
| S12 | Hallmann, C. A. et al. (2017), "More than 75 percent decline over 27 years in total flying insect biomass in protected areas," *PLOS ONE* 12(10): e0185809, https://pubmed.ncbi.nlm.nih.gov/29045418/ | Malaise traps at 63 German protected areas over 27 years; 76% seasonal decline and 82% midsummer decline in biomass; not explained by the weather, land-use and habitat changes measured. |
| S13 | Boyes, D. H. et al. (2021), "Street lighting has detrimental impacts on local insect populations," *Science Advances*, https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8386932/ ; UKCEH archive, https://nora.nerc.ac.uk/id/eprint/531169/ | Southern England: 47% fewer moth caterpillars in lit hedgerows and 33% fewer in lit grass margins; stronger effects under white LEDs than sodium lamps. Press reports give 37% for grass margins; the paper excerpt gives 33%, used here. |
| S14 | Wikipedia, "Holometabolism," https://en.wikipedia.org/wiki/Holometabolism (secondary); Manthey et al. (2024), "Rapid growth and the evolution of complete metamorphosis in insects," PNAS (Princeton listing: https://collaborate.princeton.edu/en/publications/rapid-growth-and-the-evolution-of-complete-metamorphosis-in-insec/); bioRxiv 10.1101/2024.02.12.579885 | Beetles, flies, butterflies, moths, fleas, ants, bees and wasps have complete metamorphosis; these groups make up more than half of all animal species (PNAS figure; the preprint says above 60% and about 80% of insects). The spec uses "more than half". |
| S15 | NHBS, *Beetles of the World* book description, https://www.nhbs.com/en/beetles-of-the-world-book (secondary) | About 400,000 described beetle species, about a quarter of known animals. Not used in child text; cut from the spec's knowledge section. |
| S16 | Keystone Foundation, "Bee Vision," https://pollinators.keystone-foundation.org/bee-vision/ ; gardening sources (Laidback Gardener, Gardening Know How) (weak) | Bees see ultraviolet and not red; many flowers carry UV nectar guides. Spec text only; not used in child items. |
| S17 | Wikipedia, "Task allocation and partitioning in social insects" (secondary); University of Florida / *American Bee Journal*, "Tasks of Worker Bees" (2015), https://entnemdept.ufl.edu/media/entnemdeptifasufledu/honeybee/pdfs/abj-field-guide-to-beekeeping/22,-October-2015,-Tasks-of-Worker-Bees,-low-res.pdf ; Calderone (1998), *Apidologie*, https://www.apidologie.org/10.1051/apido:19980108 | Age-linked sequence: cell cleaning, brood care, food handling and other in-hive tasks, guarding, then foraging from about day 20; the link between age and task is flexible and colonies adjust. Wax-building ages not confirmed; the companion gives no ages. |
| S18 | Loreto, R. G. et al. (2013), carpenter ant trails, Penn State, https://ento.psu.edu/files/foraging-ants-trade-off-further-for-faster-use-of-natural-bridges-and-trunk-trail-permanency-in-carpenter-ants | Trail pheromone is reinforced by returning foragers and decays by evaporation; faster (often shorter) trails are reinforced more. |
| S19 | University of Pennsylvania, "Dragonflies and butterflies," https://www.sas.upenn.edu/~tait/dragonfliesandbutterflies.html ; other life-cycle pages (weaker) | Dragonflies have no pupa; nymphs live in water for anywhere from about 3 months to 10 years depending on species; the nymph climbs a stem and molts into the adult. |
| S20 | Live Science, "Bee-harming pesticides face complete ban in Europe," https://www.livescience.com/62426-eu-bans-pesticides-that-harm-bees.html ; IFT news, 30 April 2018 | April 2018 EU vote to ban outdoor use of imidacloprid, clothianidin and thiamethoxam after EFSA's February 2018 review confirmed risks to honeybees and wild bees; greenhouse use allowed. |
| S21 | Hopkins, J. et al. (2015), *Biology Letters*, https://pmc.ncbi.nlm.nih.gov/articles/PMC4650175 ; Wikipedia, "Lampyris noctiluca" | European glow-worm females are wingless and glow to attract flying males, which generally do not glow. |
| S22 | Smithsonian National Museum of Natural History, insect pages, https://naturalhistory.si.edu/node/12414 ; British Museum (Natural History) exhibit guide via archive.org, https://www.archive.org/download/guidetoexhibite00brit/guidetoexhibite00brit.pdf ; Wikipedia, "Insect morphology" | Three body parts (head, thorax, abdomen); six legs attached to the three thoracic segments; the thorax carries legs and wings; a hard exoskeleton shed as the insect grows. |
| S23 | Wikipedia, "Spider anatomy"; University of Kentucky Entomology, Kentucky Critter Files: spiders, https://www.uky.edu/Ag/CritterFiles/casefile/spiders/spiderfile.htm ; Royal Ontario Museum exhibition page | Spiders are arachnids with two body parts (cephalothorax and abdomen), eight legs all on the cephalothorax, no antennae or wings. |
| S24 | CSIRO, "Opiliones," https://www.ento.csiro.au/education/allies/opiliones.html ; Colorado State University AgBio, harvestmen | Harvestmen are arachnids but not spiders; the two body sections join broadly so the body looks like one oval; no silk, no venom glands. |
| S25 | UC IPM caterpillar key, https://ipm.ucanr.edu/PMG/G/I-LP-GENL-KC.001.html ; Britannica, "caterpillar," https://www.britannica.com/science/caterpillar ; Butterfly House FAQ, https://www.lepidoptera.butterflyhouse.com.au/faqs/legs.html | Caterpillars have three pairs of jointed true legs on the thorax and unjointed prolegs on the abdomen (usually five pairs or fewer); fly larvae have no true legs. |
| S26 | Grasshopper life-cycle pages (educational sites, weak; e.g. Vedantu) | Nymphs look like small wingless adults; wing pads grow with each of about five or six molts; no pupa. Weak sources; flagged as a subject-review ask. |
| S27 | University of Sussex, LASI, "Organisation," https://www.sussex.ac.uk/lasi/research/organisation ; Reason review of Seeley, *Honeybee Democracy*; *American Bee Journal* March 2024 | Insect societies are not run top-down by the queen; workers adjust to labor needs themselves; the queen's pheromones influence the colony. |
| S28 | NC State Extension, "Honey Bee Dance Language," https://content.ces.ncsu.edu/honey-bee-dance-language ; *American Bee Journal* July 2009, p. 652 | The run's angle from vertical matches the flowers' angle from the Sun's direction; food toward the Sun gives a straight-up run, food directly away gives straight down; the dance changes as the Sun moves. (One popular blog in the search had this reversed; the university and journal sources agree with the text.) |
| S29 | Holloway, G. J. et al. (1991), "Chemical defence in ladybird beetles," *Chemoecology* 2: 7-14, https://www.zin.ru/animalia/coleoptera/addpages/andrey_ukrainsky_library/References_files/Holloway91.pdf ; Buglife, "Seven-spot ladybird" | Seven-spot ladybirds release alkaloid-rich reflex blood from leg joints; the species is distasteful and toxic to some bird predators (citing Marples et al. 1989); bright colors warn predators. Some aerial-feeding birds are not deterred. |
| S30 | European Ladybirds survey, https://european-ladybirds.brc.ac.uk/ ; Wikispecies, *Coccinella septempunctata* | The seven-spot is the most common ladybird in Europe, native to Europe, Asia and North Africa, from lowland farmland to montane regions. No Pyrenees-specific record was found; Europe-wide and montane range is taken as sufficient. |
| S31 | INPN (French national inventory), *Pseudochorthippus parallelus*, https://inpn.mnhn.fr/espece/cd_nom/66163 ; Wikipedia, "Pseudochorthippus parallelus" | Meadow grasshopper ranges from Scandinavia to southern Spain, in the south in valleys and mountains up to about 2,000 m; the Iberian subspecies occurs in France in the Hautes-Pyrénées and Cerdagne. |
| S32 | data.gouv.fr, "Suivi photographique des insectes pollinisateurs (SPIPOLL)," https://www.data.gouv.fr/datasets/suivi-photographique-des-insectes-pollinisateurs-spipoll ; Collège de France symposium page; Vigie-Nature École | Spipoll is a French citizen-science survey run by MNHN and OPIE since 2010: photograph insects visiting one flowering plant for 20 minutes. MNHN pages noted a service disruption; check current status before naming it in a build. |
| S33 | UC ANR, "The Queen Bee," https://ucanr.edu/node/154496 ; Wikipedia, "Drone (bee)" | Drones are males without a sting (the sting is a modified egg-laying organ); workers are sterile females. |
| S34 | University of Florida EDIS IN342 (hover flies), https://edis.ifas.ufl.edu/publication/IN342 ; Pacific Pests, Pathogens and Weeds, hoverflies | Hoverflies: egg, legless aphid-eating maggot larva, puparium (pupa inside the hardened last larval skin), adult that feeds on nectar and pollen. |
| S35 | Couvillon, M. J. et al. (2014), "Waggle dance distances as integrative indicators of seasonal foraging challenges," *PLOS ONE*, https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3973573/ ; Garbuzov, Schürch and Ratnieks (2014), urban foraging; Schürch et al. (2021), non-linear waggle duration, https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8029670/ | Decoded dances: mean foraging distance about 493 m in spring, 2,156 m in summer, 1,275 m in autumn; urban monthly means 0.5-1.2 km; the duration-distance relationship bends near 1 km. The Dance Floor patches (0.5 to 2.5 km) sit in this range. |
| S36 | Wikipedia, "Clonopsis gallica"; Faune-France stick insect identification sheet | France's commonest stick insect is widespread in the south except in mountains and large forests. Reason the stick insect was replaced in a Pyrenees valley scene. |
| S37 | Biostor archive, paper on *Chorthippus brunneus* nymphal development (Aberystwyth trials), https://archive.org/download/biostor-129575/biostor-129575.pdf (search excerpt only) | Notes in passing that both sexes of *C. parallelus* (meadow grasshopper) have four nymphal stages. An aside in a paper on a related species; replaces the weak "five or six molts". |
| S38 | Penn State Extension, "An introduction to queen honey bee development," https://extension.psu.edu/an-introduction-to-queen-honey-bee-development ; UC ANR, https://ucanr.edu/node/154564 | A good queen can lay about 2,000 or more eggs a day at peak; 1,500 is a typical strong-colony rate, not the maximum. |

## Fact-check pass (the former open checks)

| Former `[check]` | Outcome |
| --- | --- |
| Insect body plan citation | Confirmed (S22). |
| Spider body plan | Confirmed (S23). |
| Harvestman wording | Corrected to "one oval body; related to spiders but not one" (S24). |
| Caterpillar prolegs | Confirmed; added that fly maggots have no true legs (S25). |
| Grasshopper nymph wing pads and molts | Confirmed only by weak sources (S26); kept, and listed as a subject-review ask. |
| The queen gives no orders | Confirmed and refined: her scent influences the colony, workers sort out jobs (S27). Companion lines updated. |
| Waggle-dance direction rule | Confirmed: straight up means toward the Sun (S28). |
| Stick insect in the camouflage scene | Cut: the common French species avoids mountains (S36). Replaced by a meadow grasshopper in grass (S31). |
| Ladybirds taste bad to birds | Confirmed for the seven-spot (S29). |
| Citizen-science survey | Named Spipoll (France) in the spec and the Grown-up panel (S32); child text stays generic. |
| Ladybird and grasshopper fit the Pyrenees | Seven-spot: Europe-wide, lowland to montane (S30). Meadow grasshopper: recorded in the Pyrenees (S31). |
| Hoverfly larva and pupa | Confirmed; the companion now calls the larva a legless, aphid-eating maggot (S34). |
| Drone role ("from another hive") | Cut earlier; drones confirmed as males without a sting (S33). |

Also added: realistic foraging distances for the Dance Floor (S35).

## Changed while writing

- The waggle-dance distance is taught only as a labeled made-up rule, because S3 and S4 show there is no single conversion.
- Honeybee stage splits (larva and pupa days) were dropped because sources conflict; only totals (16, 21, 24) and the 3-day egg stage are used.
- The 35% figure is presented as share of production volume, separate from the 87-of-115 crop count (S8).
- The street-light figure for grass margins uses the paper's 33%, not the press 37% (S13).
- The beetle species count (S15) was cut from the spec as weakly sourced.

## Review pass (independent reviewer, 2026-10-25)

Five standard web searches for this pack (search excerpts only), the rest of the shared budget going to spec 149.

| Checked | Result |
| --- | --- |
| Boyes et al. 2021 street-light figures | Confirmed: 47% fewer caterpillars in lit hedgerows, 33% in grass margins (overall lit vs unlit), stronger under white LED than yellow sodium; 55 sites in southern England. The press release's 52% / 41% are lamp-specific hedgerow figures. Sources: Newcastle University press release https://www.ncl.ac.uk/press/articles/archive/2021/08/ledstreetlights/ ; NORA https://nora.nerc.ac.uk/id/eprint/531169/ |
| Hallmann et al. 2017 | Confirmed: 63 German protected areas, 27 years, 76% seasonal and 82% midsummer biomass decline, not explained by weather, land use or habitat measured. Source: PLOS ONE https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0185809 |
| Seven-spot "Europe's most common ladybird" | Supported by iNaturalist guide pages (weak). Softened in the spec to "common across Europe". |
| Queen's daily eggs | **Corrected.** Peak is commonly given as about 2,000 a day (S38); "up to about 1,500" understated it. Spec now says 1,500 to 2,000; the queen's job card says "often 1,500 or more"; B8 keeps the 1,500 × 10 arithmetic as a labeled steady-rate simplification, with a corrected explanation. |
| Grasshopper molts | **Corrected.** "Five or six molts" came from weak sources; the meadow grasshopper has four nymph stages (S37). Spec rewritten; A7 feedback now says "several times" for a cricket. Still a subject-review ask. |

**Math:** every answer re-run (`review-149-150/math.py`): 40, 18, 8, 3 km and 500 m, 15,000, dance angles 0° / 90° right / 90° left / 180° for a Sun at 135°, 60°, 28, 24, 53, and the stuck-ladder examples (14, 8, 150, 90). All correct.

**Cross-pack (with spec 149):** the companion said pollen goes to "the next flower of the same kind", and the Pollen Path's two blossoms could be read as one tree, which spec 149's bench says makes no apple. Fixed: "same kind of plant" (apple to apple) throughout, every Pollen Path blossom sits on a different apple tree, and a link line sends the variety question to spec 149 instead of teaching it here. Checked against spec 151: no overlap beyond the shared meadow grasshopper and dead-wood action, which 151 owns as decomposer content.

**Style:** "ladybird" changed to "ladybug" in the spec and companion (US usage, and it matches Dot), keeping "ladybird" only as the British name in the knowledge section and in source titles.

## Images and rights

No images are embedded. Art is to be original: lifelike insects with countable legs attached to the thorax, a hoverfly with one pair of wings beside a wasp with two, ladybird and grasshopper stage cards, a glass-hive cutaway. If reference photographs are wanted for the illustrator, prefer public-domain or museum open-access images (for example Smithsonian Open Access or Wikimedia Commons files marked public domain or CC0) and record each file's license; do not copy textbook diagrams.
