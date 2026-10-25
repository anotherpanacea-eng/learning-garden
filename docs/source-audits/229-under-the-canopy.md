# Under the Canopy: source audit

Audit for [spec 229](../specs/229-under-the-canopy.md) and its [companion text](../content/229-under-the-canopy-text.md). Date: 2026-10-25. All proposed copy, characters, scenes and the five bench models (`stage-light-v1`, `one-tree-v1`, `rainforest-key-v1`, `spot-v1`, `slice-v1`) are original. No learner or family record, image, worksheet or lesson code is included.

## Verification method (read first)

- Writer: 18 web searches (standard mode); no page opened in full; claims judged from search-result excerpts.
- **Independent review (2026-10-25):** the reviewer opened National Geographic Education, Wikipedia "Amazon rainforest", Wikipedia "Maria Sibylla Merian", the Dartmouth Merian exhibit biography, JSTOR Daily, ScienceDaily (Yasuní), Guinness (titan beetle) and Wikipedia "Henry Wickham" in full, and ran further searches on the 6% figure, Amazon fish counts and Merian's voyage. Rows marked **(opened)** were read on the page; the rest are still excerpt-only. Where sources disagree, the text takes the cautious reading, gives a range, or leaves the figure out of child text.
- Biology and pedagogy rest on (a) the refreshed Marble teaching-research records (paraphrased only, CC BY-SA, no text copied) and (b) standard textbook natural history. Both still need the subject check.
- Numbers and text rules were checked with the writer's `check218.py` (420 checks) and again with the reviewer's fresh `rv218.py` (scratch area, `python3 -I`): 362 checks covering item count, one right answer per three-choice item, A 9 / B 10 / C 9, tagged distractors, per-choice feedback, prompt length, Sprout digits, house style, glossary coverage and 6-word overlap with the Marble records. A second script, `len218.py`, checks that option length does not give the answer away: the right option was uniquely longest in 19 of 28 three-choice items before rebalancing and in 5 of 28 after (uniquely shortest in 5; the rest in the middle or tied), with positions still A 9, B 10, C 9. In `rv218.py`, before fixes 18 failed (research-text overlaps, one UK spelling in a chapter name, missing glossary words); after fixes the only flags are meta-lines that name the rules themselves ("no Hollis", "no \"wrong\"") and "sap", which is explained where it first appears. The crosswalk was rechecked with `crosswalk2.py`: nothing missing.

## Local material read

| Material | Used for |
| --- | --- |
| Spec 120 and `docs/content/120-story/` (acts 1-3, 5) | Cast and pronouns; Act I ch. 3, Act II chs. 1 and 4, Act III chs. 1 and 4, Act V paths 2 and 4; scene lengths; the Hollis rule (the old Keeper does not appear). |
| Spec 152 (*Up Through the Canopy*) | Owns What Is a Rainforest?, Where Rainforests Are, Rainforest Layers, Everyday Foods; names lianas, bromeliads, Brazil nut tree; Futures card on drivers. Met-elsewhere crosswalk rows; route `#library/canopy`. |
| Spec 144 (*The Ways of the Birds*) | Rainforest postcard; claims Rainforest Animals `mt_DCelLx_H1A` (Animals of the World), not `mt_xVW5U41tbp`. |
| Specs 150, 166, 175 | Insect body plan and camouflage (150), nocturnal animals (166), trays and Branch Book (175): revisited, not re-taught. |
| Spec 179 | Template for structure, depth and the saved-work contract. |
| Pinned `curriculum/marble/topics.json`, `dependencies.json` | Ids, names, descriptions, hard prerequisites (10 edges). A grep of `docs/` found no spec mentioning any target id. |
| Marble `data/teaching-research.json` at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` | Records for all seven targets (best practices, misconceptions, constraints, error patterns). |
| Jane `LESSONS.md` at `0ec55f7e083976e6fcc3977fca460b1f5e199d91` | Teach, guided, practice; the "I'm stuck" ladder; three options; writing style; glossary. |

## Sources (judged from search excerpts)

| Source | URL | Supports |
| --- | --- | --- |
| American Society for Microbiology, "The Leaf-cutter Ant's 50 Million Years of Farming" (quotes Smithsonian curator Ted Schultz) | https://asm.org/articles/2017/september/the-leaf-cutter-ant-s-50-million-years-of-farming | Ants farm fungus with cut leaves. |
| Smithsonian Tropical Research Institute caption (via EurekAlert) | https://www.eurekalert.org/multimedia/866096 | Leaves fertilize the fungus garden; ants eat the fungus, not the leaves. |
| McGill Office for Science and Society | https://www.mcgill.ca/oss/article/did-you-know/did-you-know-leafcutter-ants-are-farmers-who-grow-fungi | Fungus feeds the larvae; adults also take leaf sap. Child text says the fungus "feeds the colony, especially the young". |
| National Geographic Education, "Rain forests" **(opened)** | https://education.nationalgeographic.org/resource/rain-forests/ | "Just 6 percent" of Earth's surface (the page says surface, not land, and does not say tropical); more than half of the world's plant and animal species. |
| Guinness World Records, biome with the greatest biodiversity; search excerpts from textbook chapters | https://www.guinnessworldrecords.com/world-records/100813-biome-with-the-greatest-biodiversity | Land share estimates run from about 2% to 7% (6 to 7% in Guinness); species share 50% or more. Child text says "about 6 in 100" and "over half", both called estimates. |
| Nat Geo Kids rainforest facts | https://www.natgeokids.com/uk/?p=356 | 6% is of the land surface. |
| Wikipedia, "Amazon rainforest" **(opened)** | https://en.wikipedia.org/wiki/Amazon_rainforest | Nine nations (Bolivia, Brazil, Colombia, Ecuador, French Guiana, Guyana, Peru, Suriname, Venezuela); about 60% in Brazil; "one in ten known species"; at least 40,000 plant species; 1,294 birds classified. Rainforest area about 5.5 to 6 million km² (not used in child text). |
| WWF India, "The amazing Amazon" (404 at review) | https://academy.wwfindia.org/2020/08/10/the-amazing-amazon | Writer's excerpt: 10% of known species; 40,000 plants; 3,000 fish. The 3,000 fish figure is not used. |
| Dagosta and de Pinna 2019, *Bulletin of the American Museum of Natural History* 431; FAPESP report on the Amazon Fish project | https://digitallibrary.amnh.org/handle/2246/6940 ; https://agencia.fapesp.br/31956 | 2,716 valid fish species in the Amazon basin (2019); another dataset gives 2,257 described. Child text: "about 2,700", so item 5.4 is now 2,700 − 1,300 = 1,400. |
| WWF Living Amazon report (via India Environment Portal) | https://indiaenvironmentportal.org.in/reports-and-documents/living-amazon-report-2016 | One-tenth of the world's species; eight countries and one overseas territory (same set). |
| EPFL Wikispeedia copy of "Amazon Rainforest" | https://dlab.epfl.ch/wikispeedia/wpcd/wp/a/Amazon_Rainforest.htm | 1,294 bird species scientifically classified (rounded to about 1,300). |
| Wikipedia mirror, "Amazon River" | https://solarspell-dls.sfis.asu.edu/mea/wikipedia/wp/a/Amazon_River.htm | Largest river by discharge (about 209,000 m³/s); more flow than the next several rivers combined (count varies; kept out). |
| Aguas Amazónicas | https://aguasamazonicas.org/?p=17299 | Share of world river discharge 15-20% (a range; kept out of child text). |
| Bass and colleagues 2010, PLoS ONE (University of Texas release, 404 at review) | https://news.utexas.edu/2010/01/19/scientists-identify-ecuadors-yasuni-national-park-as-one-of-most-biodiverse-places-on-earth | See ScienceDaily. |
| ScienceDaily (same study) **(opened)** | https://sciencedaily.com/releases/2010/01/100119133510.htm | An average upland hectare holds 655 tree species, more than are native to the continental US and Canada combined. Child card fixed: it said "one patch" and "the United States and Canada"; it now says "a typical patch" and "the whole US and Canada mainland". |
| Guinness World Records, longest beetle body **(opened)** | https://www.guinnessworldrecords.com/world-records/445501-longest-beetle-body-specimen | Titan beetle 16.7 cm (French Guiana specimen, 1989). |
| Earth.com encyclopedia, *Theraphosa blondi* | https://earthpedia.earth.com/animal-encyclopedia/undefined/theraphosidae/theraphosa-blondi | Goliath birdeater: largest spider by mass (175 g) and body length; not by leg span. Child text says "a huge spider" only. |
| Wikipedia, "Prehensile tail" | https://en.wikipedia.org/wiki/Prehensile_tail | Spider and howler monkeys (Atelidae) have gripping tails; Old World monkeys do not; can hold body weight. |
| American Museum of Natural History, "You Are What You Eat" | https://amnh.org/exhibitions/frogs-a-chorus-of-colors/poison-dart-frog-vivarium/you-are-what-you-eat | Wild poison frogs get toxins from their diet; captive frogs are harmless. |
| Smithsonian National Zoo, poison frogs | https://nationalzoo.si.edu/node/7688 | Brightly colored; toxins linked to diet. |
| Wikipedia, "Maria Sibylla Merian" **(opened)** | https://en.wikipedia.org/wiki/Maria_Sibylla_Merian | Sailed 1699 with her younger daughter Dorothea Maria; home 1701 (illness, left out); *Metamorphosis insectorum Surinamensium* (1705), 60 plates of insect life cycles with Suriname's plants; "Amerindian and African slaves in the colony" assisted her; helpers unnamed. |
| Dartmouth Library Merian exhibit, biography **(opened)**; Rijksmuseum and search excerpts | https://exhibits.library.dartmouth.edu/s/merian/page/biography | 1699 with Dorothea, two years of drawing and notes; she "noted using the help" of enslaved Indigenous people, unnamed. Departure from Amsterdam (June 1699) is from search excerpts (Royal Collection Trust, Heppner). |
| JSTOR Daily, "The Peacock Flower and Reproductive Resistance" **(opened)** | https://daily.jstor.org/the-peacock-flower-and-reproductive-resistance-under-slavery/ | Not used. Its "enslaved African and Indigenous women" are her sources for one plant's use in ending pregnancies, not her helpers in general, and the topic is out of scope. The card's claim that "many" helpers were women rested on this and is removed. |
| Wikipedia, "Henry Walter Bates" | https://en.wikipedia.org/wiki/Henry_Walter_Bates | 1848 with Wallace; home 1859; over 14,712 species, mostly insects; the 8,000-new figure is his own and disputed; mimicry paper 1861. |
| Wikipedia, "Mesoamerican rubber balls" | https://en.wikipedia.org/wiki/Mesoamerican_rubber_balls | El Manatí balls about 1600 BCE; *Castilla elastica* latex with morning glory juice. |
| Wikipedia, "Hevea brasiliensis" and "Henry Wickham (explorer)" (Wickham **opened**) | https://en.wikipedia.org/wiki/Henry_Wickham_(explorer) | About 70,000 seeds reached Kew in June 1876; seedlings went to Ceylon, Malaya, Singapore, the Dutch East Indies and elsewhere. Hevea page (excerpt): native to the Amazon; plantations now mostly in South and Southeast Asia. |
| Databoks summary of Our World in Data | https://databoks.katadata.co.id/en/agroindustry/statistics/bce530248aa9d8f/soybeans-are-largely-used-for-animal-feed-not-processed-into-tofu-and-tempeh | 77% of world soy fed to livestock (child text: "most"). |
| Eco-Business and supermarket analysis on palm oil | https://www.yourweather.co.uk/news/leisure/how-many-products-on-the-supermarket-shelves-actually-contain-palm-oil.html | WWF's "half of products" is contested (one audit found 7.9% listing it by name); child text says "many" and "often under other names". |
| Statista chart of WWF 2020 oil yields | https://www.statista.com/statistics/1263201/vegetable-oil-yields-per-hectare-worldwide-by-type-globally | Oil palm about 3.3 t of oil per hectare, soy about 0.4: "much more oil from each field". Numbers kept out. |
| Union of Concerned Scientists, drivers of deforestation (cited in 152's audit) | https://www.ucs.org/sites/default/files/2019-09/DriversofDeforestation_Factsheet_Summary.pdf | Pasture over three-quarters of deforested area in Brazil. |
| Mongabay, Amazon deforestation drivers by country (2019) | https://news.mongabay.com/2019/05/new-report-examines-drivers-of-rising-amazon-deforestation-on-country-by-country-basis/ | Ranching the main driver; soy (notably Bolivia), palm oil, mining and logging vary by country. |

## Open checks

1. **Fluent readers:** Nuria's "¡Qué río!" and Léon's « La France a un morceau de l'Amazonie ! » need Spanish and French readers before build.
2. **"Most cleared land becomes pasture"** across all nine countries, not only Brazil (review ask 3). Kept, because every source names ranching as the leading driver for the Amazon as a whole.
3. **Subject check** on the key's order and side shelf, the 50/50 bench split, and "insects far outnumber the bigger animals" without a number. **Changed after Codex review (PR #176):** the pack first said insects are the most numerous rainforest animals, echoing the Marble topic description; nematodes (tiny soil worms) are more numerous, so T4, item 2.2, the tally explanation, the spec and the grown-up panel now say insects far outnumber the bigger animals (birds, monkeys, frogs).
4. **Excerpt-only rows** (not reopened at review): leaf-cutter ants (ASM, STRI, McGill; "a big nest can hold millions" rests on these), goliath birdeater, prehensile tails, poison frogs (AMNH, National Zoo), Bates, Olmec rubber balls, soy (77%), palm oil, oil yields, drivers of deforestation. All are standard facts; open the ant and Olmec pages before build.
5. **Not used, by choice:** the Amazon's area, the Amazon's share of world river flow, "more than the next N rivers", the 10 million hectares a year of global forest loss, palm oil in "half of products", and Bates's 8,000-new count. None appears in child text.

No `[check]` items remain in child text.

## Privacy and safety notes

- Products research starts from the learner's own shopping basket; this pack replaces it with Willowbank's market, the café's chocolate and Hob Pennick's hens. Nothing asks what a household buys or eats.
- No animal is handled; the care line repeats on three screens. Off-screen invitations use paper, crayons, toys and fingertip rain, with nothing recorded.
- Loss (cleared forest, lost species) appears once at Keeper's Desk depth, in one plain sentence followed by what people do about it. No illness, medicine or diet content: medicines from rainforest plants are left out because every clear example names an illness.

## Rights notes

No images are embedded. If art is wanted: Merian's 1705 plates are public domain (check the scanning institution's terms); Bates portraits and Olmec ball photographs need per-item license checks (prefer museum open-access images). All Willowbank art and puppets are original.
