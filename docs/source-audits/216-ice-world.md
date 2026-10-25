# Ice World: source audit

Audit for [spec 216](../specs/216-ice-world.md) and its [companion text](../content/216-ice-world-text.md). Date: 2026-10-25. All proposed copy, characters, scenes, the voice cards and the six bench models (`float-v1`, `tundra-v1`, `beam-v1`, `melt-v1`, `sink-v1`, `shine-v1`) are original. No learner or family record, image, worksheet or lesson code is included.

## Verification method (read first)

- About 30 web searches (standard mode) and 8 page fetches. **WebFetch worked for some pages** (USGS, NSIDC ice-sheet and permafrost facts, Wikipedia's Köppen, Heroic Age and Japanese Antarctic Expedition articles, the Arctic Council's Permanent Participants page) and was refused for others (Britannica tundra 403, CCAMLR 403, a Wikipedia Ross Sea page 404). The rest were judged from search-result excerpts of the named pages. The session's search budget ran out before three checks (sea-water freezing point, penguin tobogganing, little penguin size); those stay out of child text.
- Pedagogy rests on the refreshed Marble teaching-research records for all nine targets (paraphrased only, CC BY-SA, no text copied) and Jane's lesson-pack notes.
- **Independent review, 2026-10-25:** a fresh reviewer re-checked the writer's open items with new searches and fetches (rows marked *reviewer* below), recomputed every number with a new script (`review-216/nums.py`, 22 checks) and re-linted the items (`review-216/lint.py`, 213 checks). Fixes: option lengths rebalanced (the right answer had been the longest option in 11 of 27 items; now strictly longest in 7, strictly shortest in 6, middle in 12, all three equal in 2); 6-word runs shared with the Marble research records reworded; the high-ford scene made season-neutral and given the `{courier}` token; the penguin range softened; six glossary words added.
- Numbers, models and the item lint were checked with `check216.py` (scratch area, `python3 -I`): 346 checks, all passing (see the spec).

## Local material read

| Material | Used for |
| --- | --- |
| Spec 120 §§4-8 and writing rules | Cast and pronouns, Act II chapters 2 and 4, Act III chapters 3 and 4, Act IV chapter 3, Act V; scene lengths; the Hollis rule (the old Keeper is not mentioned). |
| Spec 144 (The Ways of the Birds) | Owns Arctic vs Antarctic (`mt_aO018DkCun`), a narrow polar-animal slice, birds as vertebrates and `penguins-north`; met-elsewhere entry for Penguins. |
| Spec 153 (The Cold Shelf) | Owns Comparing Arctic & Antarctic, Midnight Sun, Cold-Weather Adaptations, Polar Food Chains, Glaciers & Ice Sheets, Inuit & Sámi, the Race to the South Pole and the Antarctic Treaty; met-elsewhere entries; the nine-tenths iceberg figure and sea-ice trend are left there, not repeated. |
| Specs 140, 145, 168, 179 | Water cycle and weather vs climate (140); states of matter (145, 168); the January perihelion card (179). |
| Pinned `curriculum/marble/topics.json`, `dependencies.json` | Ids, descriptions, hard prerequisites. `grep -rl` over `docs` found no spec mentioning any of the nine ids. Crosswalk checked with `crosswalk2.py`: nothing missing. |
| Marble `data/teaching-research.json` at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` | Records for all nine targets. |
| Jane `LESSONS.md` at `0ec55f7e083976e6fcc3977fca460b1f5e199d91` | Three-option questions; quests, medals and gates noted and not adopted. |

## Sources

| Source | URL | Supports |
| --- | --- | --- |
| USGS Water Science School, ice, snow and glaciers (fetched) | https://www.usgs.gov/special-topics/water-science-school/science/ice-snow-and-glaciers-and-water-cycle | 68.7% of fresh water in ice caps and glaciers (2.5% fresh share: see open check 4). |
| NSIDC, ice sheet quick facts (fetched) | https://nsidc.org/learn/parts-cryosphere/ice-sheets/ice-sheet-quick-facts | Antarctic 58 m, Greenland 7.4 m; the two sheets hold over 68% of fresh water. |
| NSIDC, frozen ground quick facts (fetched) | https://nsidc.org/learn/parts-cryosphere/frozen-ground-permafrost/quick-facts-frozen-ground | Permafrost definition (0 °C or below for at least two years); active layer; about 25% of exposed Northern Hemisphere land. |
| SEOS Project, why sea ice matters (credits NSIDC); NSIDC albedo glossary; Wikipedia, Albedo | https://seos-project.eu/timeseries/timeseries-c05-s01-p01.html · https://nsidc.org/learn/cryosphere-glossary/albedo | Ocean about 6%, sea ice 50-70%, snow-covered ice up to 90%. |
| Wikipedia, Köppen climate classification (fetched) | https://en.wikipedia.org/wiki/K%C3%B6ppen_climate_classification | Five groups A-E; polar warmest month below 10 °C; ET 0-10 °C, EF below 0 °C. |
| Britannica, how deserts form (excerpt) | https://britannica.com/story/how-do-deserts-form | Desert under about 250 mm; Antarctic interior under about 50 mm; areas 14.2 and 8.6 million km². |
| One Earth ecoregion; NASA Earth Observatory caption (excerpts) | https://www.oneearth.org/ecoregions/east-sahara-desert/ | Sahara hyper-arid core under 25 mm. Why the pinned "less rain than the Sahara" is **not** taught. |
| Hinterland Who's Who tundra fact sheet; NH PBS NatureWorks (excerpts, weak) | https://www.hww.ca/assets/pdfs/factsheets/tundra-en.pdf · https://natureworks.nhpbs.org/concepts/tundra/ | Active layer 25-100 cm; growing season 6-10 weeks. Child text says only "a few weeks". |
| *Reviewer:* National Geographic, emperor penguin (fetched) | https://www.nationalgeographic.com/animals/birds/facts/emperor-penguin | Largest penguin, average about 45 in (1.15 m); huddlers take turns in the warm middle; males hold the egg on their feet under a brood pouch for about two months without food; mothers return with food. Reconfirms the huddle turns. |
| *Reviewer:* Wikipedia, Galápagos penguin; Galápagos travel and conservation pages (search excerpts) | https://en.wikipedia.org/wiki/Galapagos_penguin | Its range straddles the equator at Isabela; the only penguin found north of it. So child text says "in the south", not "only in the south". |
| *Reviewer:* Live Science, largest desert; Guinness World Records, largest cold desert (search excerpts) | https://www.livescience.com/largest-desert-on-earth · https://www.guinnessworldrecords.com/world-records/largest-desert-cold | Antarctica 14.2 million km²; Sahara 9.1 to 9.2 million km² (Britannica's 8.6 also circulates); interior about 50 mm a year. Child text says only "bigger than the Sahara". |
| *Reviewer:* SEOS Project, ice in the Arctic (NSIDC-based); FAO water and ice facts (search excerpts) | https://seos-project.eu/timeseries/timeseries-c05-p03.html · https://www.fao.org/4/T0713E/T0713E0c.htm | Polar sea water starts to freeze at about −1.8 °C (FAO: about −1.9 °C at 3.5% salt); the value depends on salinity. |
| Britannica penguin article; SeaWorld emperor penguin; PBS penguin fact sheet (excerpts) | https://britannica.com/EBchecked/topic/449815/penguin · https://seaworld.org/animals/facts/birds/emperor-penguin/ · https://pbs.org/wnet/nature/blog/penguin-fact-sheet | Male emperor incubates about 65 days in the brood pouch; female returns near hatching; both sexes incubate in every other species; emperor about 1.1-1.3 m; Galápagos (about 49 cm) and African penguins in warm places. |
| Discover Wildlife and Oceanwide Expeditions on Antarctic plants; Wikipedia and Live Science on *Belgica antarctica* (excerpts) | https://discoverwildlife.com/environment/flowering-plant-adaptation-antarctica · https://en.wikipedia.org/wiki/Belgica_antarctica | Two native flowering plants; wingless midge 2-6 mm, largest year-round land animal. |
| Arctic Council, Permanent Participants (fetched); Ottawa Declaration 1996 | https://arctic-council.org/about/permanent-participants/ · https://www.international.gc.ca/world-monde/international_relations-relations_internationales/arctic-arctique/declaration_ac-declaration_ca.aspx | Six Permanent Participants with full consultation rights; eight member states; about 4 million Arctic people, about 500,000 Indigenous. |
| Rantanen and others 2022, via University of Eastern Finland release | https://www.uef.fi/en/article/warming-in-the-arctic-region-has-been-four-times-faster-than-the-global-average | Arctic warmed nearly four times faster than the globe, 1979-2021. |
| Pew, Ross Sea designated (excerpts) | https://www.pewtrusts.org/it/research-and-analysis/articles/2016/10/28/ross-sea-designated-as-worlds-largest-marine-protected-area | 28 October 2016, about 1.55 million km², in force December 2017, 35 years, CCAMLR consensus. Member count differs across sources; not used. |
| *Reviewer, after Codex review of PR #178:* CCAMLR Conservation Measure 91-05 (2016), text via FAOLEX (fetched); NZ MFAT and NIWA Ross Sea MPA pages (search excerpts) | https://faolex.fao.org/docs/pdf/mul164258.pdf · https://www.mfat.govt.nz/en/environment/antarctica-and-the-southern-ocean/ross-sea-region-marine-protected-area | Three zones. §7: fishing is prohibited in the MPA except as paragraphs 8, 9 and 21 authorize; §6: research fishing in the General Protection Zone must follow CM 24-01. MFAT/NIWA: the General Protection Zone is about 1.12 million km² of the 1.55 million and closed to commercial fishing; the Special Research Zone and Krill Research Zone allow limited fishing. 1.12 ÷ 1.55 ≈ 72%, so the 72% and 1.1 million both refer to the General Protection Zone. Child text now says "closed to fishing for sale" with "small, approved" science catches, never "bans all fishing". |
| Georgetown ILJ, Northwest Passage; UK P&I (excerpts) | https://www.law.georgetown.edu/international-law-journal/blog/agree-to-disagree-revisiting-the-legal-status-of-canadas-northwest-passage-claim/ | Canada: internal waters; US: international strait; 1988 agreement. |
| UN, Paris Agreement into force; Wikipedia, Paris Agreement | https://www.un.org/sustainabledevelopment/blog/2016/10/paris-climate-agreement-to-enter-into-force-on-4-november/ | Adopted 12 December 2015; in force 4 November 2016; well below 2 °C, pursue 1.5 °C. |
| Wikipedia, Heroic Age of Antarctic Exploration (fetched; *reviewer* re-fetched) | https://en.wikipedia.org/wiki/Heroic_Age_of_Antarctic_Exploration | 1897 Belgian expedition (*Belgica*) generally taken as the start; end debated (the Endurance expedition, or Shackleton's death in January 1922); "17 major Antarctic expeditions launched from ten countries"; 22 expedition members died in the period; much science. |
| Wikipedia, Japanese Antarctic Expedition (fetched); Dictionary of Sydney | https://en.wikipedia.org/wiki/Japanese_Antarctic_Expedition | Shirase, *Kainan Maru*, 80°5′ S on 28 January 1912, Yamato Yukihara, no deaths. |
| NSF, "One giant leap for womankind"; *Eos* | https://www.nsf.gov/science-matters/one-giant-leap-womankind-women-south-pole | Six women at the Pole, 12 November 1969, arms linked. |
| Wikipedia, Liz Thomas; BAS newsroom (excerpts) | https://en.wikipedia.org/wiki/Liz_Thomas_(scientist) | Heads the BAS ice-core team; sub-Antarctic island cores 2016-17. |
| Springer review on dense-water formation; University of Washington lecture notes | https://link.springer.com/article/10.1186/s40562-016-0045-4 · https://www.atmos.washington.edu/academics/classes/2002Q1/211/notes_thermohaline.html | 70-90% of salt rejected from new sea ice; dense water sinks; overturning on 1,000-2,000 years. |
| Discovering Antarctica (BAS/RGS); Nature 1998 (excerpt) | https://discoveringantarctica.org.uk/ecosystems-and-foodwebs/ecosystems/the-marine-environment/ | Southern Ocean upwelling and nutrient supply feeding phytoplankton and krill. |
| Aragonese heritage article; Euskadi snow-well study (excerpts) | https://lamagiadeviajar.com/wp-content/uploads/2024/01/magia141pozosdenieve_ok.pdf · https://www.euskadi.eus/contenidos/informacion/kultura_ondare_argitalpenak/eu_def/adjuntos/pozos_nieve.pdf | About 150 snow and ice wells in Huesca; protected 2021; snow layered with straw; ice cut in summer and carried by night. |
| Wikipedia, Gyeongju Seokbinggo (*reviewer* fetched); Atlas Obscura; Stony Brook, yakhchāl (excerpts) | https://en.wikipedia.org/wiki/Gyeongju_Seokbinggo · https://www.atlasobscura.com/places/gyeongju-seokbinggo · https://www.stonybrook.edu/commcms/nacil/Iran/architecture/yakhchaal.php | Korean stone ice store: first built of wood at Wolseong in 1738 by magistrate Jo Myeong-gyeom, moved to its present site in 1742 (keystone inscription), Treasure No. 66; Iranian domed ice houses, one at Meybod about 400 years old. |
| PBS NewsHour and *Quanta* on snowflakes; Wikipedia, Ukichiro Nakaya; *CS Monitor* on Bentley | https://www.pbs.org/newshour/science/the-science-of-snowflakes · https://en.wikipedia.org/wiki/Ukichiro_Nakaya | Six-fold symmetry from molecular stacking; Kepler 1611; Bentley 1885; Nakaya 1936. |
| Pyrenean river-regime study, 2017 (excerpt) | https://portalcienciaytecnologia.jcyl.es/documentos/5f1cd8de29995265e44d1f5e | High and eastern Pyrenean rivers peak in late spring with snowmelt. |

Spec 179's audit carries the January perihelion card; spec 153's audit carries the huddle turns ("birds shuffle so all get turns"), which my search did not reconfirm.

## Open checks

1. **Sea water's freezing point:** cleared by the reviewer (about −1.8 °C for polar sea water, varying with salt; SEOS/NSIDC, FAO). Still not needed in child text; T15 says only that salt stays in the water.
2. **Penguin tobogganing** `[check]`: cut from child text (waddling kept, from the Marble record).
3. **Little penguin as smallest** `[check]`: replaced by the Galápagos penguin (49 cm, checked).
4. **USGS 2.5% fresh-water share:** cleared. USGS "How much water is there on Earth?" (fetched, https://www.usgs.gov/special-topics/water-science-school/science/how-much-water-there-earth) gives oceans 96.5%; its table's fresh-water rows sum to about 2.5% (the page states no single figure, so a reviewer should confirm the sum).
5. **Seokbinggo's date:** reviewer confirmed 1738 (wood, at Wolseong) and the move to the present site in 1742. When the stone structure was built is still `[check]`: no source found states it, and Wikipedia's "at least 1,500 years" line is unexplained. Child text gives no date and says only that a stone ice store still stands.
6. **Sylvia Earle** (named in the pinned topic): her polar work was not checked, so she is not named.
7. **Paris Agreement withdrawal** (one excerpt: the United States' withdrawal took effect 27 January 2026) `[check]`: child text names no country.
8. **Northern Sea Route** regulation by Russia: not checked; not used.
9. **Heroic Age countries:** the article's text says ten (reviewer re-fetched); child text says "many countries".
10. **Heroic Age deaths:** 22 confirmed (reviewer re-fetch). Shown only in a Keeper's note at Sapling and Keeper's Desk, with no names, causes or details.

## Lint notes

Right answers A 9 / B 9 / C 9. Option lengths rebalanced in review: the right option is strictly the longest in 7 items (1.1, 1.4, 2.5, 3.3, 4.2, 4.4, 6.5), strictly the shortest in 6 (1.2, 2.3, 4.3, 5.2, 5.4, 6.1), in the middle in 12, and 4.5 and 5.6 have three equal-length options. Companion is about 750 lines, above the 450-600 template range, because the brief's 30-36 items and nine targets need it.

## Rights notes

No images are embedded. Snowflake photographs (Bentley's are old enough to be public domain in the US; check each scan), Shirase's expedition photographs and the 1969 photograph (US Navy/NSF) should be checked item by item if art is wanted. All Willowbank art is original.
