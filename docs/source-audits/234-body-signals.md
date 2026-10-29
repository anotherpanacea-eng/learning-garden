# Body Signals: source audit

Audit for [spec 234](../specs/234-body-signals.md) and its [companion text](../content/234-body-signals-text.md). Date: 2026-10-25. All proposed copy, characters, scenes and the four bench models (`path-v1`, `snip-v1`, `steady-v1`, `sprint-v1`) are original. No learner or family record, image, worksheet or lesson code is included.

## Verification method (read first)

- 19 web searches (standard mode). **WebFetch was not used, so no page was opened in full.** Each claim below was judged from search-result excerpts of the named pages. Several excerpts came from secondary or school-level pages; a reviewer should open the key pages before build. Where excerpts disagreed, the text takes the cautious reading.
- Physiology and pedagogy rest on (a) the refreshed Marble teaching-research records (paraphrased only, CC BY-SA, no shared run of six or more words) and (b) standard school biology. Both still need the subject check.
- Numbers and models were checked with `check223.py` (scratch area, `SCRATCH/oca13/223/`, `python3 -I`): **676,419 checks, all passing**, including 1,160 `steady-v1` runs (every event order and wait of 0-7 steps) and 87,380 `sprint-v1` pace sequences (every sequence up to 8 steps). The first run caught a real model fault (lactic acid could overshoot the "heavy legs" mark); the rule was changed to rise one mark a step with heavy legs at three, and re-run.
- The crosswalk was checked with `crosswalk2.py`: nothing missing, no stray prerequisite.
- **Independent review (2026-10-25).** A fresh reviewer re-ran 15 web searches (lactic acid and EPOC, earthworm photoreceptors, bread ethanol, taste buds, Payen, Cannon, Hill, Vesalius) and wrote its own script, `SCRATCH/oca13/review-223/rcheck.py` (`python3 -I`): **683,987 checks, 0 failing** after fixes (1 false positive in the reviewer's own first run, none in the pack). It covers 36 items, 24 three-choice with one right answer each at A 8, B 8, C 8; no Sprout digits; prompt, teach-card and feedback lengths; privacy phrases; every arithmetic answer and distractor value; every `steady-v1` run (1,160) and `sprint-v1` sequence (87,380); and no shared run of six words with the seven Marble records. Changes from review are listed under Open checks.

## Local material read

| Material | Used for |
| --- | --- |
| Spec 120 and `docs/content/120-story/` | Cast, pronouns, chapter names (Act I ch. 1, Act II ch. 3-4, Act III ch. 3, Act IV ch. 3, Act V paths, Market Fair), the Hollis rule. |
| Spec 148 | The fold-out book *A Person's Body*, `#living/journey`, the food tube; its *Digestive Journey* claim supports the Digestive System prerequisite. |
| Spec 159 | The Traveler (it), the three skeleton jobs, the sense-brain-muscle relay, 100 m/s example; owns *Bones & Muscles* and *The Brain Controls the Body*. Its exclusion of "brain parts and neurons" leaves bench (d) unduplicated. |
| Spec 162 | Owns *How the Eye Works* (Eye Card, T10, C3). |
| Spec 174 | Owns *Aerobic Respiration* and *Body Temperature Regulation*; its hold-at-37 dial and Pip's panting are revisited; its "never the child's body" rule is followed. |
| Specs 145, 146, 175 | The baker's window; Dot's bell; template for scene tables. |
| `docs/history-and-science-buildout.md`, spec 49 §5, spec 179 | Labels, privacy, wave rules (puberty left to families), teaching contract, file structure. |
| Pinned `curriculum/marble/topics.json`, `dependencies.json` | Ids, names, ages, hard prerequisites. `git grep` on main: no spec mentions any of the seven target ids. |
| Marble `data/teaching-research.json` at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` | Records for `mt_83gRQ9OPkc`, `mt_OMmiuv9ZLH`, `mt_qzbgwaUQOA`, `mt_okUMpHsV-P`, `mt_J40cOn7VWn`, `mt_0NlbulkB5P`, `mt_TKZefYXaVS`. |
| Jane `LESSONS.md` at `0ec55f7e083976e6fcc3977fca460b1f5e199d91` | Teach, guided, practice; the "I'm stuck" ladder; three options; glossary. |

## Sources (judged from search excerpts)

| Source | URL | Supports |
| --- | --- | --- |
| Hektoen International, "The neuron doctrine: Cajal and Golgi" | https://hekint.org/2023/02/16/the-neuron-doctrine-santiago-ramon-y-cajal-and-camillo-golgi/ | Shared 1906 Nobel Prize; Golgi's reticular view vs Cajal's separate cells; Cajal used Golgi's stain. |
| SRUK exhibition, "The Nobel Prize" | https://sruk.org.uk/the-nobel-prize-rycl-srukceru-exhibition/ | Same; Nobel lectures disagreed. |
| Wikipedia, "Moon illusion" | https://en.wikipedia.org/wiki/Moon_illusion | Ibn al-Haytham's perceived-distance account in *Optics* book 7 (interpretation disputed). |
| The Schools' Observatory, Ibn al-Haytham | https://www.schoolsobservatory.org/learn/history/biographies/al-haytham | Light travels in straight lines and enters the eye. |
| Wikipedia, "Diastase"; "Anselme Payen" | https://en.wikipedia.org/wiki/Diastase | Payen and Persoz, 1833, from malt; starch to sugar; "first enzyme" is a retrospective label (one French source dates publication 1834). |
| PMC review on homeostasis | https://pmc.ncbi.nlm.nih.gov/articles/PMC4868097 | Cannon coined homeostasis extending Bernard's *milieu intérieur*. |
| BMJ blog, J. Aronson, "Homeostasis and allostasis" | https://blogs.bmj.com/bmj/2021/03/19/jeffrey-aronson-when-i-use-a-word-homeostasis-and-allostasis/ | First written use 1926; *The Wisdom of the Body* 1932. |
| Nobel Prize, Physiology or Medicine 1922 | https://www.nobelprize.org/prizes/medicine/1922/summary/ | Hill (heat in muscle) and Meyerhof (oxygen and lactic acid); awarded in 1923. |
| Sportscience, "A. V. Hill" | https://sportsci.org/news/history/hill/hill.html | Hill introduced "oxygen debt" (1922); studied trained runners. |
| PMC review (2022) on the 1922 prize | https://pmc.ncbi.nlm.nih.gov/articles/PMC9304278/ | The prize ideas were superseded within a decade. |
| Outside Online and coaching reviews on lactate (popular sources summarizing the research) | https://www.outsideonline.com/health/training-performance/lactic-acid-muscle-fatigue/ | In the body lactic acid is mostly lactate plus hydrogen ions; lactate is reused as fuel; the burn is put mostly on acid build-up, itself debated. Historical basis for the earlier caveat; the repair below removes the causal interaction itself. |
| Sportscience Hill page; di Prampero review (1999); EPOC study notes | https://sportsci.org/news/history/hill/hill.html | Hill and Lupton's oxygen debt was later judged too simple; EPOC has a fast part (refilling phosphocreatine and ATP) and a slower part including lactate clearance. Basis for "helps clear". |
| Houston Methodist, lactic acid and soreness | https://houstonmethodist.org/blog/articles/2021/oct/is-lactic-acid-buildup-really-what-causes-muscle-soreness-after-a-workout | Lactate does not cause next-day soreness; clears well before. Clearance times vary across sources (15 min to 2 h; most 40-60 min): spec says "within about an hour". |
| OpenAnesthesia, aerobic vs anaerobic | https://www.openanesthesia.org/keywords/aba_aerobic_vs/ | 2 ATP anaerobic; about 32 aerobic (other sources 36-38). Grown-up panel says "roughly 30 to 38"; child text uses only model tokens. |
| UWO fiber-type table (J. Kiernan) | https://publish.uwo.ca/~jkiernan/fibrtyp.htm | Fastest fibers 70-120 m/s; unmyelinated about 0.5-2 m/s. |
| Snopes, giraffe neck bones | https://www.snopes.com/fact-check/giraffes-neck-bones-humans/ | Seven neck vertebrae in giraffes and people; most mammals share it (sloths and manatees differ). |
| Maguire et al., PNAS 2000 | https://pmc.ncbi.nlm.nih.gov/articles/PMC18253 | Posterior hippocampus larger in London taxi drivers; correlates with years driving; authors discuss causation. |
| Wikipedia, "Andreas Vesalius" | https://en.wikipedia.org/wiki/Andreas_Vesalius | 1543 *Fabrica*; mandible one bone, correcting Galen, whose anatomy drew on animals. |
| Lander University, *Lumbricus terrestris* (R. S. Fox); NC State Extension, "Wormy facts" | https://lanwebs.lander.edu/faculty/rsfox/invertebrates/lumbricus.html ; https://composting.ces.ncsu.edu/vermicomposting-2/wormy-facts-and-interesting-tidbits/ | No eyes; single light-sensitive cells in the skin, most on the front end; they move away from light; touch sense. Hess's older *Lumbricus* study agrees. Confirmed on review; child text says only "can tell light from dark". |
| Lumen Learning, "The Endocrine Pancreas" | https://courses.lumenlearning.com/nemcc-ap2/chapter/the-endocrine-pancreas/ | Islet alpha cells (glucagon) and beta cells (insulin); insulin lowers via uptake and glycogen storage; glucagon raises via the liver; each loop self-limits. |
| MIT CBMM, "How many neurons are there in human brain?" | https://cbmm.mit.edu/node/5328 | About 86 billion (Azevedo 2009); an Oxford paper questions how general the figure is. Spec only, with "roughly". |
| Neuromyths (UNESCO IBE) | https://ibe-unesco.org/solportal-sub/articles/how-many-neurons-do-we-have-and-why-does-this-matter-to-education | The 10% claim is a myth; imaging shows wide activity. |
| Wikipedia, "Müller-Lyer illusion" | https://en.wikipedia.org/wiki/M%C3%BCller-Lyer_illusion | Devised 1889; equal shafts look unequal; causes debated. |
| MCAT/AP study pages on bile | https://premierexamprep.com/mcat/books/biology/the-digestive-system/the-liver-and-gallbladder | Bile from liver, stored in gallbladder, emulsifies (not an enzyme); pancreatic lipase digests fat. School-level sources; textbook-standard. |
| York University, Classics in the History of Psychology, *De Anima* III | https://psychclassics.yorku.ca/Aristotle/De-anima/de-anima3.htm | Five senses listed; Aristotle argues there is no sixth. |
| Fungi4Schools, bread | https://www.davidmoore.org.uk/21st_Century_Guidebook_to_Fungi_PLATINUM/Ch17_23.htm | Yeast makes ethanol and carbon dioxide; the baker uses the gas. |
| Science ABC, ethanol in bread | https://www.scienceabc.com/pure-sciences/does-your-bread-contain-alcohol | Most ethanol bakes off; a little (roughly 0.04 to 1.9 percent by weight) can stay. Hence "most of the ethanol bakes off". Popular source; the direction is uncontested. |
| Wikipedia, "Taste bud" | https://en.wikipedia.org/wiki/Taste_bud | Most taste buds are on the tongue, some on the palate and throat; the visible bumps are papillae. Hence "mostly on the tongue" in the glossary and 1.5's hint. |
| Britannica, "Anselme Payen" | https://www.britannica.com/biography/Anselme-Payen | Diastase (1833) the first enzyme obtained in concentrated form. |
| Save My Exams, yeast in food production | https://www.savemyexams.com/igcse/biology/edexcel/19/revision-notes/5-use-of-biological-resources/food-production/yeast-in-food-production | Ethanol evaporates during baking. |
| Simply Psychology and Kenhub, lobes of the brain | https://www.kenhub.com/en/library/anatomy/lobes-of-the-brain | Lobe jobs; limbic system with amygdala and hippocampus for emotion and memory; most tasks use many areas. |

## Open checks

No `[check]` item is in the child text. For the subject reviewer:

1. **Earthworm light sense**: confirmed on review (Lander University, NC State Extension). Reworded to "its skin can tell light from dark"; Scene 1 now adds that some animals lack some of the five senses.
2. **Lactic acid wording**: revised on review. Child text says "linked to" heavy legs and "extra oxygen helps clear the lactic acid". The grown-up panel adds lactate, acid build-up, EPOC and "not next-day soreness". "Clears within about an hour" stays in the spec only (sources range from 15 minutes to 2 hours).
3. **Brain map simplifications**: "temporal: hearing, memory, words" and "brainstem: breathing and heartbeat" are school-level; the card says most tasks use many parts.
4. **Insulin wording**: "helps cells take in glucose and the liver store it" is the record's canonical fed-state account; no illness is mentioned anywhere.
5. **"First enzyme found"** for diastase: Britannica and other sources agree; kept.
6. **Ethanol**: the child text no longer says "a kind of alcohol". The glossary reads "a chemical yeast makes along with the gas. Most of it bakes off in the oven" (corrected from "it bakes off"). Drinks and brewing stay out.
7. **Other review fixes**: the dough has "hardly any air inside", not "no air in that bowl"; "eyes send out no beams" replaces "eyes send nothing out", since T7 has eyes sending messages in; the crab has a "hard outer case", so it does not collide with the snail's *Shell* bin; the reflex timing reads "a fraction of a second"; the sugar loop needs no nerve message (record constraint, now in T20); distractor tags fixed on 1.6, 4.4, 5.6 and 6.4; 6.7's distractor now matches the recorded misconception ("catching up on missed breaths"); the 3.6 hint was rewritten; the Market Fair fountain, not in spec 120, became the green. The saved `links` field and an unused read of 159's `puppetBones` were cut.
8. **Codex review on PR #177 (2026-10-25)**: (a) every bone/job pairing is now listed (skull 1 job, spine 3, ribcage 2, pelvis 2, femur 2, humerus 1); any listed job is accepted, and every other pairing has its own try-again line. The script checks that all 18 pairs are covered exactly once. (b) Item 4.4 now asks which *label on our map* groups the deep emotion-and-memory parts, because the cerebellum also takes part in emotional learning (Frontiers in Systems Neuroscience reviews, 2022-2023; the 2016 cerebellum-and-emotion consensus paper). (c) Amylase now cuts starch into short chains, mostly sugar pairs, and **maltase** on the small-intestine wall finishes them into single sugars (Tymoczko, *Biochemistry: A Short Course*, 14.3, https://digfir-published.macmillanusa.com/tymoczko3e/tymoczko3e_ch14_4.html; Reactome R-HSA-191114). Item 5.4 counts 5 amylase cuts and 6 maltase cuts, 11 in all, and the bench gained a maltase button and a pair reply. The reviewer script now runs 683,998 checks, 0 failing.

## Privacy and safety notes

- Every Marble record here anchors on the learner's own body (pointing to parts, feeling bones, a nose-pinch taste test, a knee-jerk, a felt sprint). Each is replaced by the drawn person, the Traveler, Pip or another animal. The script scans child text for "your" with body words; none remain (story lines addressed to Pip were reworded too).
- The illusion card says "most people see" and offers a ruler; it never asks or stores what the explorer sees.
- No diet advice: food appears only as the drawn person's bread and supper; no food is judged. No illness, medicine, puberty or reproduction; the endocrine system appears only as insulin and glucagon.
- Off-screen cards are grown-up-led, use beads, paper and magazine pictures, and record nothing. No tasting or smelling.

## Rights notes

No images are embedded. If art is wanted: Cajal's drawings are public domain by age (Instituto Cajal holds originals; check reproduction terms); Vesalius's *Fabrica* plates are public domain; the Müller-Lyer figure is a simple redraw. All Willowbank art is original.

## Bounded authoring repair, 2026-10-25

The wave's public spec identifiers and companion/audit links were renumbered to avoid existing specs. Historical private checker filenames and scratch paths above retain their original names; reported authoring checks describe those earlier runs, not a fresh implementation or complete-source review. The selected build still requires its stated subject, primary-source, cultural and fluent-reader gates, independent review and actual runtime/browser verification. The owning spec now requires complete authored source freezing and explicit capacity refusal/download/selected-confirmed removal, with no silent kept-work eviction. No code, route, taxonomy pin or coverage declaration is commissioned by this repair.

**Sprint-model repair:** removed the lactic-acid-threshold forced jog and the heavy-legs transition. Pace remains learner-selected; the marker is schematic, recovery is a separate explanatory card, and fatigue/breathing are not computed. The earlier sprint enumeration must be rerun for a selected implementation; its old pass count is not clearance of this changed model. Published physiological reviews reject treating lactate as a direct fatigue toxin and discuss reuse as fuel: Robergs et al. (2004), https://pubmed.ncbi.nlm.nih.gov/15308499/ ; Hall et al. (2016), https://pubmed.ncbi.nlm.nih.gov/26972271/ . Only the indexed abstracts were available during this bounded repair. Full subject/source review remains required before this bench is built.
