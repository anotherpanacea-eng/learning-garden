# Source audit: spec 260, Then, Now and Next

Date: 2026-10-25. Writer's first pass for [spec 260](../specs/260-then-now-and-next.md) and its [companion text](../content/260-then-now-and-next-text.md).

**Method and limits.** The DfE English Appendix 2 and English Glossary were read in full text from copies downloaded for the earlier English packs (S1, S2). The Common Core Language standards pages for grades 1 to 5 were fetched directly (S3). The research and usage claims were checked against web-search result excerpts and one fetched news page (3 searches, 1 fetch); a reviewer with ordinary web access should open S4 to S6 before build. Claims not confirmed are marked `[check]` and kept out of child text.

## Fiction and models (no source needed; labeled in the text)

Willowbank, the library's *Willowbank Weather* book and every entry in it, Pip's windy-night entry and his two breakfasts, the thunder on the library roof, the spring boards and the painted marks on the mill's flood post, the brook's heights, Dot's letter and Nuria's reply, and the old Keeper's ledger and its *Ask upstream* note (from spec 120 §5, page 2). The Log Line is labeled "A made-up model". Every sample sentence was written new for this pack; no public-domain or living author's text is quoted. No real weather, place or date appears.

## Sources consulted and what each supports

| # | Source (publisher) | URL | Supports |
| --- | --- | --- | --- |
| S1 | *The national curriculum in England: English Appendix 2: Vocabulary, grammar and punctuation* (DfE, 2013, Open Government Licence) | https://assets.publishing.service.gov.uk/media/5a7d913aed915d3fb959486f/English_Appendix_2_-_Vocabulary_grammar_and_punctuation.pdf | Year 2: correct choice and consistent use of present and past tense; progressive in present and past for actions in progress (its own examples are not reused); term *tense (past, present)*. Year 3: present perfect instead of simple past, contrasted with simple past. Year 5: tense choices for linking across paragraphs (*had seen*). Paraphrased only. |
| S2 | *English Glossary* (DfE, 2013, Open Government Licence) | https://assets.publishing.service.gov.uk/media/5a7c8e4ded915d48c24108e2/English_Glossary.pdf | Tense as the present/past choice marked by inflection; English has no future inflection, unlike Spanish (its contrast of three Spanish forms supports the Spanish future card in kind); present tense for habits, states, schedules and future time; progressive (also "continuous") as *be* plus present participle, combinable with the perfect; perfect formed with *have* plus past participle, calling attention to a prior event's consequences (*has gone to lunch* implies still away; supports D4 and Where is she now?); past perfect takes a past reference point. |
| S3 | Common Core State Standards, English Language Arts, Language, grades 1 to 5 (NGA Center and CCSSO) | https://www.thecorestandards.org/ELA-Literacy/L/1/ ; .../L/2/ ; .../L/3/ ; .../L/4/ ; .../L/5/ | L.1.1e verbs for past, present and future; L.2.1d past tense of frequent irregular verbs; L.3.1d regular and irregular verbs; L.3.1e simple tenses (*walked, walk, will walk*); L.4.1b progressive tenses at three times; L.5.1b perfect tenses; L.5.1c tense for times, sequences, states and conditions; L.5.1d recognize and correct *inappropriate* shifts. Read on the pages 2026-10-25. |
| S4 | Marcus, G. F., Pinker, S., Ullman, M., Hollander, M., Rosen, T. J. and Xu, F. (1992), "Overregularization in language acquisition", *Monographs of the Society for Research in Child Development* 57(4) | https://stevenpinker.com/publications/year/1992 | About 11,500 irregular past-tense uses from 83 children; overregularization (*goed*) was uncommon, a median of about 2.5% of irregular past forms, at a low, fairly steady rate from age 2 into the school years. Later critics (Maratsos 2000) found higher rates in some individual children, so the panel says "fairly uncommon and usually temporary", not a figure. Figures seen in search excerpts only `[check]`; no number is in child text. |
| S5 | Lieberman, E., Michel, J.-B., Jackson, J., Tang, T. and Nowak, M. A. (2007), "Quantifying the evolutionary dynamics of language", *Nature* 449: 713-716; MIT News, 15 October 2007 | https://news.mit.edu/2007/language-1015 | Of 177 irregular Old English verbs, 145 stayed irregular in Middle English and 98 today; *help, laugh, reach, walk, work* became regular; a verb used 100 times less often regularizes about 10 times faster; the most common irregulars (*be, go* among them) are predicted to stay irregular. Supports scene 2's Keeper's note. The old past form *holp* appears only in a secondary source and is **not** used in child text `[check]`. |
| S6 | *Oxford Learner's Dictionaries*, usage notes at *already*, *yet* and *just* (Oxford University Press); British Council LearnEnglish, "Present perfect: just, yet, still and already" | https://www.oxfordlearnersdictionaries.com/us/definition/english/already ; https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/present-perfect-just-yet-still-already | North American English often uses the simple past with *just, already* and *yet* where British English prefers the present perfect, especially in speech. Supports the grown-up panel and the rule that items avoid those words. |
| S7 | Specs 47, 74, 80, 116, 120, 140, 269 and 274, and the English build-out plan (this repo; draft PR #172) | `docs/specs/`, packs 269 and 274 on their draft branches | Sibling boundaries; spec 120's cast, page 2 release at the end of Act II, Act II ch. 2's "so next time we'll know", the Spring Flood Boards festival, Act III ch. 4's letters, Nuria's Spanish; pack 269's *must have gone* and 274's tense-keeping flips and subjunctive. |

General knowledge not separately searched (reviewer to confirm against a dictionary, low risk): every irregular past and participle used (*went/gone, ran, sat, hid, told, saw/seen, came, ate, blew/blown, grew/grown, threw, flew, knew, sang, rang, drank, swam, began, thought, brought, caught, taught, bought, rose/risen, fell/fallen, put, cut, let, hit, set*); that *if it will rain* is nonstandard for a plain future condition; the past perfect for the earlier of two past events (S2 supports in general).

## Language lines needing a fluent reader

- Spanish: *Aquí ha llovido toda la semana* (Here it has rained all week). `[check]` word order and that the present perfect is natural here in the speaker's region (Peninsular Spanish uses it readily for "this week").
- Spanish: *llueve* (it rains), *llovió* (it rained), *lloverá* (it will rain). Standard forms of *llover*; confirm.

## Marble and Jane

Marble `data/teaching-research.json` at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` has no record for any of the seven targets: its coverage block lists 331 English topics, 0 with research, and all seven ids are in `missingTopicIds`. Topic descriptions and evidence lines (ODbL) were read and paraphrased only. Note: Marble attaches CCSS L.3.1d (regular and irregular verbs) to Past, Present and Progressive Tense, whose description matches DfE Year 2 better; the spec claims it for its description. Jane at `0ec55f7e083976e6fcc3977fca460b1f5e199d91` informed the lesson shape; no Jane text or code is used.

## Grammar judgment calls for the subject reviewer

| Item or card | Call made | Why |
| --- | --- | --- |
| Log Desk Sprout, "Every spring it ___ a lot here." | *rains* (habit) | The plain present for a repeated event (S2, present tense). |
| A5, Log Desk Seedling, "So far this week it ___ twice." | *has rained* only | *So far* reaches up to now; the simple past here is not idiomatic in either US or UK writing. |
| D1, "The sky is clear now, but the paths are muddy. It ___." | *has rained* | *Rained* would also be heard in US speech, so it is **not** offered as a choice; the distractors are *will rain* and *is raining*. |
| D4, "has gone": still away | Withholding choice wrong | S2's own gloss: *has gone* implies the person is still away. |
| Hold It Steady entry 2 | No slips | Three times (last spring, this week, tomorrow), three tenses; CCSS L.5.1d targets only *inappropriate* shifts. |
| Letter line "The old Keeper's ledger lists the floods" | Present kept | The ledger exists and lists them now; only the floods themselves are past (*came*). |
| E5, "If it rained tomorrow, we will check the post." | Wrong | Past for an imagined future pairs with *would*, not *will*; unreal conditions are pack 274's, so the feedback says only "for a plan, say if it rains". |
| E4, "have gone in before the water came" | Wrong | A present perfect cannot sit with a finished past reference point; the past perfect marks the earlier event (S2). |
| Card 1 and glossary, *will rain* as "future" | School name | S3 names it the simple future tense; S2's two-tense view is in the grown-up panel. |

## Rights notes

No images or quoted texts. DfE material is Open Government Licence and is paraphrased; its example sentences are not reused. Common Core standards are cited by code, not copied beyond short paraphrase. Draw the Log Line, the weather book and the flood post as original art.

## Open checks

- S4's 2.5% median and S5's *holp* are from search excerpts; neither number nor *holp* is in child text.
- The Spanish lines above.
