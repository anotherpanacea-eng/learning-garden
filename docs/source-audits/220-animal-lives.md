# Animal Lives: source audit

Audit for [spec 220](../specs/220-animal-lives.md) and its [companion text](../content/220-animal-lives-text.md). Date: 2026-10-25. All proposed copy, characters, scenes and the two bench models (`lookout-v1`, `ocean-year-v1`) are original. No learner or family record, image, worksheet or lesson code is included.

## Verification method (read first)

- 33 WebSearch calls (standard mode) and 3 WebFetch calls. WebFetch opened two NOAA Fisheries species pages in full (blue whale, humpback whale); a third NOAA sanctuary URL returned "page not found". **Every other claim was judged from search-result excerpts of the named pages**, several from secondary or press pages. A reviewer should open the key primary papers before build. Where excerpts disagreed, the text takes the cautious reading or carries `[check]`.
- Biology and pedagogy rest on (a) the refreshed Marble teaching-research records for the six targets (paraphrased only, CC BY-SA, no text copied) and (b) standard school biology. Both still need the subject check.
- Numbers were computed with `numbers220.py` (scratch area, `SCRATCH/oca13/220/`, `python3 -I`; 38 checks passed) and the companion was checked with `lint220.py` (316 checks; one false positive, "compass point north").

## Independent review (2026-10-25)

A fresh reviewer re-checked the pack with about 12 WebSearch calls and 1 WebFetch (NOAA humpback page, reopened: 3,000 miles in as few as 28 days, 5,000-mile populations, blubber sustains them through winter). Confirmed from search excerpts: magpies 2 of 5 hand-raised (2008) and wild-caught adults not passing (2020, FLoRA); Smithsonian cheetah 64 mph; Clever Hans (Pfungst's tests 1904, book 1907); Carr's Tortuguero figures; chamois alarm whistle. Corrected: Betty caveat year (2016, not 2018); Herodotus's bird eats leeches; wolves sentence; Tortuguero "ever". Moved to `[check]`: izard herd size. A fresh script (`SCRATCH/oca13/review-220/check.py`, `python3 -I`) recomputed every model output, answer key, count and position balance and checked style and six-word overlap with the Marble records: 178 checks, 4 failed before fixes (spec, companion and audit six-word runs; a "breed" misconception tag), 0 after.

## Local material read

| Material | Used for |
| --- | --- |
| Spec 120 and `docs/content/120-story/` | Cast and pronouns, Act II ch. 2 and 4, Act III ch. 3 and 4, Act IV ch. 3, Act VI ch. 4; the Hollis rule; scene lengths; Les Saules and Léon; the *Gazette* from Act IV. |
| Spec 143 (Letters from the Coast) | Owns Whales & Dolphins Are Mammals and The Five Oceans; leaves Ocean Animal Variety and Ocean Animal Adaptations unclaimed. Revisited, not re-taught. |
| Spec 144 (The Ways of the Birds) | Owns Animals Everywhere, Animal Migration (birds) and a narrow slice of Structural Adaptations; round-trip definition reused. |
| Spec 166 (The Valley Animal Book) | Owns Animal Communication; "watch wild animals from afar". |
| Spec 171 (Down to the Deep) | Leaves Ocean Animal Variety and Ocean Animal Adaptations unclaimed; coral as an animal. |
| Spec 175 (Sorting Life) | Vertebrate groups, branching key, claim-evidence-reason frame; Act II ch. 4 already hosts "Bramble's Great Fish", so this pack's Act II ch. 4 scene is a different job. |
| Spec 150 (The Bee Meadow) | Waggle dance, hive roles, pollination: cited from the group and partner cards. |
| Specs 28-29 and `curriculum/topic-coverage.csv` | Habitats & Basic Needs as a scoped practice reference in the built Living Garden spiral. |
| Specs 49 §5, 179, 174, 175 and `docs/history-and-science-buildout.md` | Templates, labels, privacy and the teaching contract. |
| Pinned `curriculum/marble/topics.json`, `dependencies.json` | Ids, names and hard prerequisites; `git grep` on main finds no spec naming any of the six target ids. `crosswalk2.py` reports nothing missing. |
| Marble `data/teaching-research.json` at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` | Records for `mt_goZW_hQUa4`, `mt_fpPLWFIRVo`, `mt_H8OgKZbgGe`, `mt_i4bDqjyglj`, `mt__aHSZTm5k5`, `mt_Te-ulgYMUd`. |
| Jane `LESSONS.md` at `0ec55f7e083976e6fcc3977fca460b1f5e199d91` | Teach, guided, practice; the "I'm stuck" ladder; three options; writing limits; glossary. |

## Sources

| Source | URL | Supports |
| --- | --- | --- |
| NOAA Fisheries, Blue whale (opened) | https://www.fisheries.noaa.gov/species/blue-whale | Up to 110 ft and 330,000 lb (Antarctic); about 90 ft in the North Atlantic and Pacific; "largest animals ever to live". |
| NOAA Fisheries, Humpback whale (opened) | https://www.fisheries.noaa.gov/species/humpback-whale | Some groups swim 5,000 miles; Alaska to Hawaii about 3,000 miles, as few as 28 days; cold productive feeding grounds; warm shallow calving waters; blubber sustains them through winter. |
| NOAA Sanctuaries, "Humpback whales are navigating an ocean of change" | https://sanctuaries.noaa.gov/news/sep18/humpback-whales-navigating-an-ocean-of-change.html | Summer feeding in Alaska; winter in Hawaii to give birth and raise calves. |
| Guinness World Records, smallest bird | https://www.guinnessworldrecords.com/world-records/smallest-bird | Bee hummingbird, Cuba; male about 57 mm and 1.6 g. Earth.com gives females to about 2.6 g, so "lighter than a penny" (2.5 g) was dropped for "lighter than a nickel" (5 g). |
| Smithsonian National Zoo (via newsdesk and Live Science) | https://si.edu/newsdesk/photos/amani | Cheetah: fastest land mammal, about 64 mph documented, short bursts. |
| San Diego Zoo Wildlife Alliance fact sheet, giraffe | https://ielc.libguides.com/sdzg/factsheets/giraffes | Tallest mammal; adult males to about 18 ft (news excerpt). |
| Sharon Audubon Center, peregrine falcon | https://sharon.audubon.org/node/4491 | Stooping speeds far above level flight; fastest in a dive. No mph figure used in child text. |
| Wikipedia, "Tool use in primates"; History.com, Goodall 1960 | https://en.wikipedia.org/wiki/Tool_use_in_primates | David Greybeard fishing termites with grass stems, Gombe, 1960 (exact day disputed; text says 1960). |
| Weir, Chappell and Kacelnik, *Science* 297 (2002), via Oxford group page | https://users.ox.ac.uk/~kgroup/tools/tool_manufacture.shtml | Betty bent wire into a hook and lifted a food bucket. |
| Rutz et al., "Tool bending in New Caledonian crows", *R. Soc. Open Sci.* 3 (2016); St Andrews news release | https://news.st-andrews.ac.uk/archive/tool-bending-birds-prompt-clever-crow-rethink/ | Wild-caught crows bend stick tools as part of normal tool-making, which puts Betty's wire bending in context (the case file's "simpler idea"). Reviewer corrected the year from 2018 to 2016. |
| Prior, Schwarz and Güntürkün, *PLoS Biology* (2008); Soler et al., *J. Comp. Psych.* (2020), via FLoRA Replication Atlas | https://forrt.org/flora-replication-atlas/doi/10.1371/journal.pbio.0060202/ | Two of five hand-raised magpies passed; wild-caught magpies did not pass in the replication. |
| Reiss and Marino, *PNAS* 98 (2001) | https://pmc.ncbi.nlm.nih.gov/articles/PMC33317 | Dolphins used mirrors to inspect marked body parts. |
| Gallup, *Science* 167 (1970), via the mirror test summary | https://en.wikipedia.org/wiki/Mirror_test | Chimpanzees marked with red dye touched the marks using a mirror. |
| Thornton and McAuliffe, *Science* (2006), Cambridge news release | https://www.cam.ac.uk/research/news/wild-meerkats-school-their-young | Helpers give dead or disabled (stingless) scorpions first, live ones later; practice speeds learning; teaching by stated criteria. |
| Bird and Emery, *Current Biology* (2009), via National Geographic | https://www.nationalgeographic.com/science/article/confirming-aesop-rooks-use-stones-to-raise-the-level-of-water-in-a-pitcher | Rooks dropped stones to raise a floating worm; chose larger stones; stopped when in reach. |
| The Cephalopod Page; Richter et al. (PMC4803207) | https://thecephalopodpage.org/OctopusSmarts.php | Octopuses open screw-top jars in aquariums and in container tasks. Escape stories were not confirmed and are not used. |
| Goldenberg and Wittemyer, *Primates* (2019), San Diego Zoo story | https://stories.sdzwa.org/2020/02/08/researchers-study-elephants-unique-interactions-with-their-dead/ | Elephants approach, touch and examine carcasses and bones; motives unknown; grief open. |
| Wikipedia and Britannica, "Clever Hans" | https://www.britannica.com/topic/Clever-Hans | Pfungst 1907; failure when the asker didn't know or couldn't be seen; involuntary cues. |
| Wikipedia, "Symbiosis" | https://en.wikipedia.org/wiki/Symbiosis | De Bary's broad term (1879; proposed at an 1878 meeting), including parasitism. Text says 1879. |
| NOAA Ocean Service, corals tutorial; NOAA Florida Keys | https://oceanservice.noaa.gov/education/tutorial_corals/coral02_zooxanthellae.html | Algae make food inside coral; coral gives a protected home. |
| RHS, *Viscum album* | https://www.rhs.org.uk/plants/138826/wd/details | Mistletoe is semi-parasitic, most often on apple; weakens but rarely kills. |
| Imperial College thesis and journal papers on ant-aphid mutualism | https://spiral.imperial.ac.uk/entities/publication/94aa13e4-2e69-45ab-b083-572f08c9e9b7 | Ants take honeydew and guard aphids, reducing ladybug attacks; protection varies by ant species. |
| Indiana Public Media, "Swimming with sharks" | https://indianapublicmedia.org/amomentofscience/swimming-sharks.php | Remoras ride sharks and take scraps; the shark's gain is debated (hence "?"). |
| Wikipedia, "Egyptian plover" and "Trochilus (crocodile bird)"; Herodotus 2.68 (Macaulay translation, Lexundria) | https://lexundria.com/hdt/2.68/mcly | Herodotus says the bird enters the crocodile's mouth to eat leeches (not "clean its teeth"); no photographic support. Whether Herodotus saw it himself is not established, so child text no longer says he didn't. |
| arXiv, "The naval battle of Actium and the myth of the ship-holder" | https://arxiv.org/pdf/1905.13024 | Pliny's ship-stopping fish; *remora* is Latin for delay. |
| Carr, Carr and Meylan (1978), AMNH Bulletin; Carr (1980) | https://digitallibrary.amnh.org/items/1afd606b-cf77-426a-8cc5-98129f68837b/full | About 12,000 females tagged 1955-1976; 1,412 seen back nesting; none reported nesting on any other shore by 1978 (reviewer: confirmed from the bulletin's abstract via search excerpt; child text now says "in all those years" rather than "ever"). |
| UNC-Chapel Hill news, Brothers and Lohmann (2018) | https://www.unc.edu/posts/2018/04/12/unc-chapel-hill-study-finds-genetic-evidence-that-magnetic-navigation-guides-loggerhead-sea-turtles-home/ | Loggerheads use Earth's magnetic field to return to their natal beach region (within roughly 40-50 miles). |
| Animal Diversity Web and Dalmau et al. (2010), Pyrenean chamois | https://animaldiversity.org/site/accounts/information/Rupicapra_pyrenaica.html | Female-and-young herds; males mostly alone. Herd size 5-15 rests on one nature-site page only, so the number is out of child text. |
| Ultimate Ungulate, *Rupicapra rupicapra*; Alpenzoo Innsbruck; Darwin note CUL-DAR189.76 | https://ultimateungulate.com/Artiodactyla/Rupicapra_rupicapra.html | Chamois alarm signals include a nasal whistle and foot stamping. |
| Kalahari Research Centre and PMC5358691 | https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5358691/ | Meerkat sentinels watch from a raised spot while the group forages and call. |
| USGS, Yellowstone wolf restoration | https://www.usgs.gov/centers/northern-prairie-wildlife-research-center/science/yellowstone-wolf-restoration | Wolves' main prey is elk; packs hunt together. |
| MacNulty et al., *Behavioral Ecology* (2012), via Utah State University news | https://www.usu.edu/today/story/strength-in-numbers-for-wolves-maybe-not-says-usu-researcher | Elk-hunting success rises with group size up to about four wolves, then levels off. Supports "a few wolves catch elk more often than one"; the earlier "one wolf alone could rarely catch" was not supported and was cut. |
| University of Hawaii, *Exploring Our Fluid Earth*; University of Miami collection | https://manoa.hawaii.edu/exploringourfluidearth/biological/invertebrates/introduction-invertebrates | Invertebrates are the great majority of animal species, and of known marine species. No percentage used in child text. |
| Seahorse anatomy (Wikipedia; Discover Wildlife) | https://www.discoverwildlife.com/animal-facts/fish/why-is-seahorse-a-fish | Seahorses are bony fish with gills and a backbone; skin over bony plates, no ordinary scales. |

## Open checks

1. `[check]` **Humpbacks hardly feed in Hawaiian water.** Widely stated; not confirmed from an opened NOAA page. Kept out of child text, which says only that stored blubber carries the whale through the winter (NOAA Fisheries).
2. **Izard whistle.** Alarm whistling and stamping are confirmed for chamois (*Rupicapra*) in general sources; the Pyrenean study found covers group size and vigilance only. A regional source would strengthen the story's whistle.
3. `[check]` **Goodall's exact date** (October or 4 November 1960). Child text says only "1960".
4. **Octopus escapes** (named in the topic description): not confirmed from a primary source, so the pack uses jar-opening only.
5. `[check]` **Izard herd size** ("often five to fifteen"): one secondary page only; removed from child text.
6. **Blue whale and buses.** "Longer than two school buses" assumes a big whale (80 ft or more) and 40 ft buses. North Atlantic and Pacific adults reach about 90 ft (NOAA); subject reviewer to confirm the wording.
7. **Tortuguero dates.** Carr's papers start tagging in 1955; the Sea Turtle Conservancy newsletter dates its northern-beach program to 1959. The text uses Carr's 1955.
8. **Subject check** on the Lookout model's simplifications, the remora and oak cards, and "teaching" for meerkats (spec review asks).

## Rights notes

No images are embedded. If art is wanted, prefer public-domain or open-licensed images (NOAA photos are generally public domain; check each). Goodall, Gallup and museum images need individual licence checks. All Willowbank art and the bench diagrams are original. The Marble research records are CC BY-SA and are paraphrased only; no shared run of six or more words was copied.

## Wording decisions from the fact pass

- **Blue whale:** "bigger or heavier than any animal ever found", not "longest"; a few long-necked dinosaurs might have matched its length (Marble constraint and NOAA). The dinosaur card says "no dinosaur yet found was as heavy".
- **Tallest and biggest on land (Codex review, PR #175):** sauropods such as *Brachiosaurus* and *Giraffatitan* held their heads far higher than a giraffe (estimates run from about 9 to 15 m, against a giraffe's 5.5 m or so; Britannica Kids, https://kids.britannica.com/students/article/Brachiosaurus/310341), and several were heavier than an elephant. So the giraffe is "the tallest animal alive today" and the elephant "the biggest on land today" wherever a record sits beside the dinosaur card. Dot now says some dinosaurs were taller. Item 1.5 now asks "about as long as", so only two buses fits; a small car is too short rather than also true.
- **Cheetah:** "fastest on land, for a short dash"; the falcon card says only "dives faster", with no speed, because sources range from about 99 to over 200 mph.
- **Bee hummingbird:** a weight claim (lighter than a nickel) and a size claim (small enough to perch on a pencil) kept apart; no coin is used to show size.
- **Seahorse:** "bony plates instead of ordinary scales", resolved by backbone and gills, as the research asks.
- **Remora:** commensalism with a note that some scientists think the shark gains a little; "?" accepted.
- **Mutualism:** described as each partner doing what helps itself, never as an agreement (ants and aphids, item 4.6).
- **Magpie mirror test:** told as two studies with two results; "not settled" is the right answer (5.4).
- **Betty the crow:** the case file names the 2016 caveat (wild crows bend stick tools as part of normal tool-making).
- **Elephants:** Keeper's Desk only; "nobody knows yet if this is grief"; no death described beyond "elephant bones".
- **Turtles:** "the beach where she hatched, or very near it", because homing is to a stretch of coast (2018 study: roughly 40-50 miles).
- **Herodotus and Pliny:** labeled "A story people told", each with what we know now. Herodotus wrote about Egypt as a Greek visitor; Goodall's card is set in Tanzania and Carr's in Costa Rica, so history comes from more than one culture.
- **Partners Grid:** the bee-and-blossom pair was cut at review. A pollinator's visit is brief, so it fails the pack's own "long life side by side" test that rules out owl and mouse; it is a mutualism but not a symbiosis by the definition taught. Nine pairs remain.
- **Disease spread** as a cost of groups (named by the research) is left out under wave 5's no-illness rule; owner question 3.
