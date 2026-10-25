# Where the Mill's Energy Goes: source audit

Audit for [spec 147](../specs/147-mills-energy.md) and its [companion text](../content/147-mills-energy-text.md). Date: 2026-10-25. All proposed copy, machines, characters and the wheel-bench model are original. No learner or family record, image, worksheet or lesson code is included.

## Verification method (read first)

- **First draft:** written with no web access (search budget exhausted, page fetches refused by the session proxy). Real-world specifics were marked `[check]`.
- **Fact-check pass, same day:** 12 web searches (standard mode). **WebFetch was still blocked, so no page was opened in full.** Each claim below was judged from search-result excerpts of the named pages. The sources are reputable (Britannica, a museum, peer-reviewed or university pages, government guidance), but a reviewer should open the key pages before build. Where excerpts disagreed or did not support a draft claim, the text was corrected or cut.
- Physics and pedagogy claims rest on (a) the refreshed Marble teaching-research records, which cite the sources under "Sources cited through Marble" (not re-opened here), and (b) standard textbook physics. These still need the subject check.

## Local material read

| Material | Used for |
| --- | --- |
| Draft spec 120, `origin/claude/project-thread-zpfie6:docs/specs/120-keeper-of-the-ways.md` §§2, 4, 7, 8 and writing rules | Cast, pronouns, acts and chapters, scene lengths, the long rain, "nobody dies", the mill's flood post. |
| Spec 123 Clockwork Mill, `origin/claude/project-thread-88brkk` | Boundary: 123 owns Trundle, gears and programming at `#mill`. This spec takes energy only and uses a separate save root. |
| Spec 124 Bank Builder and its companion, same branch | Format model. |
| Spec 98 Lantern Circuit Bench and its source audit | Link, not repeat: 98 teaches a complete path and declines energy movement. Used in the crosswalk for *How energy travels around*. |
| Specs 56 and 60 Fair Test Bench | Link for item 4.6 (fair test of two wheel designs). |
| Spec 102 Cold Window | Link for evaporation and condensation. |
| `docs/six-act-strands.md` | Energy domain: 28 topics, none covered; S6 and S7 family codes. |
| Pinned `curriculum/marble/topics.json` and `dependencies.json` | Target ids, names and every hard prerequisite in the crosswalk. |
| Marble `data/teaching-research.json` at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` | Records for `mt_akBotspaf2`, `mt_2Um22lTBZV`, `mt_Jvg_r4yWaY`, `mt_68pIoiiG4g`, `mt_JyfLtl_nhw`, `mt_w2A8D76ymp`, `mt_-p_xp4hMvh`, plus `mt_X_aDUBh-HF` and `mt_K1-HopEJAB` (related, no claim). Paraphrased only (CC BY-SA); no text copied. |
| Jane `LESSONS.md` at `0ec55f7e083976e6fcc3977fca460b1f5e199d91` | Teach → guided → practice, the "I'm stuck" ladder, writing style, three options, glossary. |

## Sources from the fact-check pass (judged from search excerpts)

| Source | URL | Supports |
| --- | --- | --- |
| Britannica, "closed-cycle water mill" | https://britannica.com/technology/closed-cycle-water-mill | Robert Fludd, English physician, proposed a closed-cycle water mill in 1618; he wrongly thought the water passing over the wheel would give more energy than lifting it back with an Archimedes screw needs. |
| Britannica, "perpetual motion" | https://www.britannica.com/facts/perpetual-motion | Perpetual motion is impossible by the first and second laws of thermodynamics; the overbalanced wheel is the oldest and most common type. |
| Museo Galileo, "Mechanical overbalanced wheel" and "Perpetual motion in the Middle Ages" | https://mostre.museogalileo.it/motoperpetuo/en/before-leonardo/perpetual-motion-in-the-middle-ages/mechanical-overbalanced-wheel.html | Bhāskara II (12th century) and Villard de Honnecourt (notebook c. 1225-1235) drew overbalanced wheels. Supports "people drew wheels like this for over 800 years". |
| P. Hibbert, UNSW perpetual-motion pages; Bradburne, Drebbel paper | https://www.chem.unsw.edu.au/staff/Hibbert/perpetual/1stviol.htm ; https://drebbel.net/Bradburne%20DrebbelPerMobDRAFT2_OK.pdf | Fludd's design appeared in his 1618 *Tractatus Secundus*; the lifter is described as a screw in some accounts and a bucket chain in others. The child text therefore says only "pumps". |
| JSTOR Daily, "The scientists, the engineers and the water wheel"; Newcastle University Co-Curate, John Smeaton; Hutton's *Mathematical and Philosophical Dictionary*, "Mill" | https://daily.jstor.org/the-scientists-the-engineers-and-the-water-wheel ; https://co-curate.ncl.ac.uk/john-smeaton ; https://words.fromoldbooks.org/Hutton-Mathematical-and-Philosophical-Dictionary/m/mill.html | Smeaton's model experiments (paper 1759, Copley Medal) showed overshot wheels about twice as efficient as undershot, against common opinion of the time. Hutton notes the paper also gives larger ratios in places; "about twice" is the figure Smeaton himself reckons and modern sources repeat. |
| Müller, University of Southampton eprint; 2018 review in *Renewable and Sustainable Energy Reviews* (Politecnico di Torino record) | https://eprints.soton.ac.uk/53600 ; https://iris.polito.it/handle/11583/2712517 | Modern well-designed wheels: about 85% overshot and about 75% undershot (Müller); the review gives maximum efficiencies around 85% for both. This **contradicts** the draft's "undershot 20-30%" range, which was cut. |
| Wikipedia, "Hydropower"; Energy Education (University of Calgary), "Hydroelectric discharge" | https://en.wikipedia.org/wiki/Hydropower ; https://energyeducation.ca/encyclopedia/Flow_rate | Available hydro power depends on flow rate and head (P = η ρ g Q H). |
| Wigan Archaeological Society, Arley Mills sluice gate; Settle Hydro, weir and sluice gate; Wikipedia, "Mill race"; US patent 85048 | https://wiganarchsoc.co.uk/content/Projects/Arley_Mills/Sluice_gate.htm ; https://settlehydro.org.uk/weir-sluicegate-headrace.html ; https://en.wikipedia.org/wiki/Mill_race | Sluice gates control the water level in a millrace; flood gates drain the race in high water; a modern hydro scheme partly lowers a manual sluice in extreme river levels. Supports scene 3 and its Keeper's note. |
| SEPA, *Guidance for developers of run-of-river hydropower schemes*; Colorado Water Conservation Board document; Virbickas et al. 2020; University of Hull eel study | https://www.sepa.org.uk/media/383805/guidance-_for_developers_of_run_of_river_hydropower_schemes.pdf ; https://iris.polito.it/bitstream/11583/2865892/1/Virbickas_et_al_2020_SREP.pdf | Run-of-river schemes divert part of the flow; instream (environmental) flow and fish passage are central concerns, and evidence on mitigation is limited. The draft's "often leave most of the river flowing" was **not supported** and was replaced. |
| New Hall Mill, "Dressing the millstones"; LancasterHistory article | https://www.newhallmill.uk/dressing-the-millstones/ ; https://collections.lancasterhistory.org/media/library/docs/edit_vol55no5pp125_136.pdf | Millstone faces have furrows and lands; furrows shear grain, carry it outward and help keep the stones from overheating; lands do the grinding. Supports T6 and the "grinding warms the stones" point. |
| Eni Scuola, "Energy from water"; LibreTexts, "The origin of hydropower" | https://eniscuola.eni.com/en-IT/energy/hydroelectric/energy-from-water.html ; https://eng.libretexts.org/Bookshelves/Environmental_Engineering_(Sustainability_and_Conservation)/Energy_Alternatives/05:_Hydropower/5.02:_The_Origin_of_Hydropower | Hydropower's energy comes from the Sun driving the water cycle: evaporation, condensation, precipitation on high ground, then water losing potential energy as it runs down. The draft's latent-heat simplification was **not confirmed** and was cut from the spec. |
| Little Bins for Little Hands, "How to make a water wheel"; Outdoor Classroom Day, "Science: mini water wheel" | https://littlebinsforlittlehands.com/how-to-make-a-water-wheel/ ; https://outdoorclassroomday.com/wp-content/uploads/2016/05/Science-Mini-Water-Wheel.pdf | Paper-plate and cup wheels on a straw axle, tested under a sink stream or a poured can, varying pour height, are a common children's activity. The adult-led invitation now matches this design; the safety notes (cool water, no electrical things near, mop spills) are ordinary precautions. |

## Sources cited through Marble (not re-opened here)

| Source | URL | Supports in this spec |
| --- | --- | --- |
| Institute of Physics, Spark: "What's wrong with forms of energy?" | https://spark.iop.org/whats-wrong-forms-energy | Light, sound and current as ways energy travels; avoiding "changes form"; the T8 matching panel. |
| Institute of Physics, Spark: "Pathways and stores" | https://spark.iop.org/pathways-and-stores | Store and pathway names; one process at a time (T9). |
| Institute of Physics, Spark: "Conservation and dissipation" | https://spark.iop.org/conservation-and-dissipation | Energy conserved but dissipated; fuels used up, energy not (T7, items 1.3, 2.4). |
| Institute of Physics, Spark: friction pages | https://spark.iop.org/many-students-see-friction-phenomenon-rather-force | Friction as a force; slip warms surfaces (T5, T6). |
| Department for Education, National curriculum in England: science programmes of study | https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study | KS3 energy changes and transfers; KS4 efficiency and renewable/non-renewable sources. |
| NGSS 4-PS3-1, 4-PS3-2, MS-PS3, MS-ESS3 | https://www.nextgenscience.org/pe/4-ps3-2-energy ; https://www.nextgenscience.org/topic-arrangement/msenergy ; https://www.nextgenscience.org/dci-arrangement/ms-ess3-earth-and-human-activity | Speed and energy at grade 4; energy transfer at middle school; resources. |

## What changed in the fact-check pass

| Former `[check]` | Outcome |
| --- | --- |
| Fludd 1618 | **Cleared** (Britannica). Lifter mechanism disputed, so the text keeps the neutral "pumps". |
| Overbalanced wheels "for centuries" | **Cleared and made specific**: case 3 label now reads "people drew wheels like this for over 800 years" (Bhāskara II, 12th century). |
| Overshot 60-80% / undershot 20-30% | **Corrected.** Ranges cut. Now: Smeaton (1759) found overshot about twice as efficient; modern well-designed wheels of both kinds do much better. Item 3.8 changed from 70/25 (difference 45) to 60/30 (difference 30, twice as many); the numbers script was updated and re-run, and all checks passed. |
| Smeaton figures | **Cleared** for "about twice"; no percentages are given for his tests. |
| Hydro power ∝ flow × head | **Cleared.** |
| Spill gates and channels | **Cleared**; the Keeper's note was reworded to "control how much water reaches the machinery and send extra water past it". |
| Small hydro and fish passage | **Corrected**: "leave most of the river flowing" was replaced with "take some of the river's water; the river needs enough left in it, and fish need a way past". |
| Millstone grooves | **Corrected and cleared**: T6 now says the grooves cut the grain and carry it to the edge. |
| Evaporation wording | **Cleared** for the short account; the latent-heat aside was **cut** as unconfirmed. |
| Paper wheel safety | **Cleared** against published versions; the activity now uses cups and a straw or pencil axle over the sink. |

## Open checks

None remain in the text. Before build, a reviewer should (1) open the Britannica, Smeaton/JSTOR, Müller and SEPA pages in full, since this pass relied on search excerpts, and (2) complete the physics subject check listed in the spec's review asks.

## Rights notes for images

No images are embedded or proposed from outside sources. Art should be original: the mill, wheel, tokens, Sankey strip and the three detective machines. If a later pass wants a historical illustration (Fludd's 1618 engraving, or a Villard de Honnecourt page), prefer a public-domain scan from a museum or library open-access collection, record its credit and license here, and keep it labeled "A true thing from history".

## Review pass (independent reviewer, 2026-10-25)

- **Math:** all 36 bench settings re-enumerated in a separate reviewer script (`scratchpad/review-147/math147.py`, `python3 -I`, exact fractions): whole numbers throughout, flour 2 to 48, 24 scoops at four settings; teaching step, 3.1 to 3.8, T11, T12, Case 1 tokens and every misconception value (10, 10, 5) confirmed. No change.
- **Crosswalk:** every hard prerequisite re-read from the pinned `dependencies.json` by script; names and ids match. Renewable vs non-renewable has two soft and no hard prerequisites, as stated.
- **Facts:** Fludd 1618, Smeaton 1759 "about twice", Bhāskara II and Villard de Honnecourt, and the flow-times-head rule are consistent with the cited sources; no web search spent. No fact changed.
- **Text fixes:** four cards over 30 words trimmed (station 6, wheat branch, older card, modern turbine card); the cat's pronoun removed (spec 120 gives none); "got there" changed to US usage; station 1's start no longer names the Sun as a store; Case 1, Case 3, 1.5 and 4.4 rebalanced so the right answer is not the longest choice; grown-up panel's stale "marked for checking" line updated; spec links to unmerged specs 120 and 123 no longer point at missing files; UK spellings in this audit corrected.
