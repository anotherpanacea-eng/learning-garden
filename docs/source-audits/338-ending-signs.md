# Source audit: 338, Market Signs' Ending Signs

Checked 2026-10-31. Original teaching, fiction and items are selected from [263](../specs/263-market-signs.md) and [its audit](263-market-signs.md); nothing is copied from a commercial dictionary. No Jane runtime or lesson prose is incorporated; Marble remains a licensed curriculum reference at its existing pin.

## Primary sources (from 263's audit, still the governing record)

- [DfE English Appendix 1: Spelling](https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/239784/English_Appendix_1_-_Spelling.pdf), Years 3-4 suffixes: -ation added to verbs to form nouns, with the usual rules (information, preparation, admiration); -ly added to an adjective to form an adverb, usually straight on (sadly, completely, usually, finally); a root ending in a consonant and y of more than one syllable changes y to i (happily); a root ending -le changes -le to -ly (gently, simply); a root ending -ic adds -ally (basically, dramatically), with publicly an exception; truly, duly and wholly as exceptions; -ous with the usual vowel-suffix rules (famous, various), some with no obvious root (enormous, jealous), courageous keeping its e. Less common spellings: y in myth and gym, ou in young and touch, endings -sure (measure, treasure) and -ture (picture, nature). Year 2's -ly rule is the source of "y to i only for roots of more than one syllable", which is why card 11 says "usually" (shyly).
- [Common Core Language 3](https://www.thecorestandards.org/ELA-Literacy/L/3/) L.3.2e (suffixes on base words) and L.3.2f (spelling patterns and generalizations); [RF.3.3a](https://www.thecorestandards.org/ELA-Literacy/RF/3/) (common derivational suffixes). These motivate the tasks; they do not validate them as assessments.
- 263's word table records Wiktionary status for every C1-C5 and C7 distractor (freshley, freshlee, happyly, happly, gentlely, gentley, fameous, famus, inviteation, invitasion, dramaticly, drammatically: no entry), checked 2026-10-26.

**Later refresh (Codex, on PR338):** all 35 target headwords (24 joins, three odd ones, enormous, jealous, six C6 words) refreshed at Merriam-Webster and supported; the English Wiktionary query API returned missing entries for all 12 authored distractors (an entry-status observation, not proof a string never occurs); the DfE appendix was refreshed at its current GOV.UK link, and its "no obvious root word" wording is now used on screen.

**Original refresh limit, stated plainly:** this session could not reach Wiktionary or Merriam-Webster (network refused). No headword was re-fetched here. The independent subject reviewer must re-check all 24 keyed joins, the three odd ones, the two no-root words, the six C6 words and the twelve distractors against a primary dictionary before runtime is commissioned. This audit makes no new lexical claim beyond 263's record.

## Mechanical checks run for this slice

`check338.py` (writer's scratch, `python3 -I`, 2026-10-31):

- All 24 authored joins reproduce exactly from their root, ending and the one authored tool, under the literal tool rules in the spec.
- For every authored pair, no other tool produces the same word, so a fit names exactly one tool.
- The odd ones are exceptions to the cards' generalizations, not spellings the tools cannot make: drop the e on true + -ly writes truly (card 10 says a consonant ending usually just adds), just add on public + -ly writes publicly (card 21 says -ic usually adds -ally), and just add on courage + -ous writes courageous (card 12 says a final e usually drops). true, public and courage are therefore not bench roots and have no authored join; the three words sit only on the read-only shelf. (Corrected after Codex spec review of 188e7e3, which found the earlier "unreachable" claim false.)
- 24 roots x 3 endings x 5 tools = 360 combinations: 24 authored fits, 19 authored mismatches (the root's own ending with another working tool; these get 263's four exact hints or the template, never the discovery line), 78 discoveries (an unauthored ending with a working tool) and 239 cannot-work cases; 121 working in all.
- The six three-choice items key A 2 / B 3 / C 1; none has the right answer as the single longest choice (C2's happily ties happyly).
- C6's six parts fill to treasure, measure, picture, nature, young, gym; 4^6 = 4,096 complete mappings, of which one fits.

## Concrete adaptations and boundaries

263's bench (c), cards 10-14 and 21, set C and scene 2 are reused. The Keeper's Desk tool is offered from arrival under a plain label, because this project gates nothing by age or depth. C6's two tagged feedback lines are joined into one general line to fit the merged 325 match shape. Scene 4 (Spanish) is left out; its lines still wait for the language panel and no Spanish-to-English ending rule is taught. -sion is named in the grown-up text only, because -sion and -tion are told apart by sound and brief 55's sound gate is unchanged. The bench's tools are spelling actions on written letters, not sound teaching.

No actual child work, family record, remote data, fonts, recordings or dictionary scans are part of the commission. Original art (the bakery board, a paint pot) will be drawn.

## Upstream refresh and graph

Jane HEAD freshly resolved at `e88f81a00553fb87818ef84c77a8800f0dcb33e4`; actual `LESSONS.md` "Teach, guided practice, graded, boss", "When the kid gets stuck", "Writing style" and "Fill-ins" sections read. Adopted as design reference: one idea per card with a worked example revealed a step per tap, a guided first item with visible steps, three-option misconception-tagged choices, the hint / easier example / skip ladder, second-person prompts of 15 words or fewer. Not adopted: graded bosses, medals, mastery, requeue, level step-downs, points, timers.

Marble HEAD freshly resolved at `5e23196fa60050433f1440057f65a978d39e63fc`; `data/topics.json`, `data/dependencies.json` and `data/teaching-research.json` fetched and parsed. Target `mt_tHtjfjjFrl` (Suffixes, age 7+) is unchanged in description and evidence from the bundled pin; upstream adds ACARA standards and widens the age range end from 9 to 10. The teaching-research file has no record for it (0 of 336 English topics have research); its id appears only in coverage. No research text is used and its absence is not evidence for or against this lesson.

**Hard-prerequisite crosswalk** (bundled pin `curriculum/marble/dependencies.json`, recomputed 2026-10-31; identical upstream): one hard edge, Suffixes (`mt_FYK8m6eHQm`, "Y3 suffix/sound-spelling builds directly on Y2 suffix rules with root changes"), and one soft edge, Spelling Verb Endings (`mt_QdMMLRYWhn`). How met: built [314](../specs/314-parcel-plural-labels.md) Parcel Labels already teaches y to ies after a consonant on written nouns and names its equivalence to y to i; drop e and y to i are restated inline on cards 11-13 and every tool. Not assessed and never a gate. Downstream hard dependents (Suffixes age 9+, -able and -ible, Converting Words into Verbs, Greek/French/Latin spellings) are context for 331, 337 and later 268 work.

## Subject and content review still required

Independently verify every keyed form, the five tool rules and their "usually" wording, the odd ones and their one-line reasons, C1-C7 keys, cues and feedback, and the C6 families. This audit is not implementation clearance.
