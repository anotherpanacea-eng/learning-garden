# Source audit: spec 250, Sounds in the Seed Packets

Date: 2026-10-26. Writer's first pass for [spec 250](../specs/250-sounds-in-the-seed-packets.md) and its [companion text](../content/250-sounds-in-the-seed-packets-text.md).

**Method and limits.** Two Common Core pages were fetched and read. English Appendix 1 was read in full from a school-hosted copy of the DfE PDF (the gov.uk asset URL returned 404 this session); its rows match the statutory publication named below, but a reviewer should confirm against the gov.uk copy. Dictionary pages (Cambridge) refused fetches (HTTP 403), so the word table's transcriptions are **author proposals in the declared General American model, not dictionary-checked**; the linguistic reviewer confirms them by ear, as brief 55 requires. Variety facts were confirmed from search excerpts only. Five web searches and seven fetch attempts (three succeeded) in all. **Independent review (2026-10-26):** every word in the table below was checked against Wiktionary's US/GA IPA through the MediaWiki API; all agree in GA except food, which Wiktionary also gives as dialectal US /fʊd/ and which was replaced by zoo. S5 and S8 were opened. This audit is not linguistic, audio or rights clearance.

## Fiction (no source needed; labeled in the text)

Willowbank, the orchard keeper's seed shed and its washed-out packets, Pip's misreadings, Hob Pennick's sow, Wren Halloway's seed list. All are labeled "A story from Willowbank". No made-up numbers or models appear.

## Sources consulted and what each supports

| # | Source (publisher) | URL | Supports |
| --- | --- | --- | --- |
| S1 | English Appendix 1: Spelling, *National curriculum in England: English programmes of study* (DfE, 2013; Open Government Licence). Read from a school-hosted copy. | https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study ; copy read: https://kennschool.co.uk/wp-content/uploads/2024/01/Appendix-1-and-2-NC-Writing.pdf | Year 1: ck after a single vowel letter in short words; tch after a single vowel letter, exceptions rich, which, much, such; ph and wh; k (not c) before e, i, y; final -y; the vowel digraph and trigraph table (ai and oi virtually never word-final; ay and oy at the end; a-e to u-e, with u-e as both /u:/ and /ju:/; ar; ee; ea two ways; er stressed and unstressed; ir; ur; oo two ways; oa; oe; ou; ow two ways; ue; ew; ie two ways; igh; or; ore; aw; au; air; ear two ways; are). Year 2: /dʒ/ as -dge after short vowels, -ge elsewhere at the end, g "often (but not always)" before e, i, y; /s/ as c before e, i, y; kn and gn, "sounded hundreds of years ago"; wr, "probably" an old pronunciation; /ʒ/ as s (treasure, usual). Its IPA chart (44 symbols, RP-based, "could be significantly different in other accents") supports "more sounds than letters". Example words were used as a guide; the pack chooses its own. |
| S2 | Common Core State Standards, RF.1 (CCSSO and NGA) | https://www.thecorestandards.org/ELA-Literacy/RF/1/ | RF.1.2a (long vs short vowels in spoken words); RF.1.3a (consonant digraphs); RF.1.3b (regular one-syllable words); RF.1.3c (final -e and common vowel teams for long vowels). Fetched and read. |
| S3 | Common Core State Standards, RF.2 | https://www.thecorestandards.org/ELA-Literacy/RF/2/ | RF.2.3a (long and short vowels in one-syllable words); RF.2.3b (additional vowel teams); RF.2.3e (inconsistent but common spelling-sound correspondences). Fetched and read. |
| S4 | Brief 55, its source audit and `docs/content/phonics/` (this repo) | `docs/specs/55-phonics-content-audio-brief.md` ; `docs/source-audits/55-phonics-content-audio.md` | The gate; the General American model with /æ ɪ ɑ/; broad notation without length marks; letter names apart from sounds; stops not prolonged; the five asset kinds and the CSV columns; no recording of a child. |
| S5 | Steacy, Edwards, Rigobon and colleagues (Compton senior author), "Set for Variability as a Critical Predictor of Word Reading: Potential Implications for Early Identification and Treatment of Dyslexia", *Reading Research Quarterly* 58(2), 2023 (online 2022) | https://pmc.ncbi.nlm.nih.gov/articles/PMC10195062 | In grades 2-5, skill at turning a regularized pronunciation into the real word uniquely predicted word reading. Correlational: it supports the try-one-then-the-other strategy (card 19, F2) as reasonable, not as a tested intervention. Opened by the reviewer. |
| S6 | Cot-caught merger (Wikipedia, summarizing Labov, Ash and Boberg, *Atlas of North American English*, 2006) | https://en.wikipedia.org/wiki/Cot%E2%80%93caught_merger | Many US and most Canadian speakers do not distinguish the vowels of cot and caught; hence aw and au are never contrasted with short o. Search excerpt; no percentage used. |
| S7 | Bridwell and Renwick, NWAV 49 (2021) slides on the wine-whine merger, citing the *Atlas* | https://openscholar.uga.edu/record/26887/files/NWAV49%20Bridwell%20Renwick%202021.pdf | /hw/ to /w/ spread across the continental US in the 20th century; wh modeled as /w/, /hw/ named as fine. Search excerpt. |
| S8 | Grammarphobia, "Silent w" (2024, citing the OED); Encyclopedia.com, "W" (Oxford Companion to the English Language) | https://grammarphobia.com/blog/2024/10/silent-w.html ; https://www.encyclopedia.com/arts/culture-magazines/w | Grammarphobia (opened by the reviewer): the w of wr- was dropped in standard English in the 17th century, with signs from the mid-15th. Wiktionary etymologies give Old English *wrenna* and *wrītan*. Supports scene 4's "long ago, people said it" and the Keeper's note's "hundreds of years ago" (changed from "about four hundred years ago", which the 17th-century date does not fix). |
| S9 | RHS, Chives growing guide | https://rhs.org.uk/herbs/chives/grow-your-own | Chives (*Allium schoenoprasum*) are in the onion family (scene 2). Search excerpt. |

## Correspondences and key words (author proposals, General American)

Every key word contains its stated spelling (checked by `check250.py`). The sound column was checked by the independent reviewer against Wiktionary US/GA IPA (see Method); by-ear confirmation still belongs to the linguistic reviewer.

| Spelling | Sound | Key word | Other words used |
| --- | --- | --- | --- |
| sh, ch, tch, th, th | /ʃ/, /tʃ/, /tʃ/, /θ/, /ð/ | ship, chip, patch, thin, this | shed, fish, chick, chest, bath, chives, chard, birch, thick, ninth |
| ck, k, ng, ph, wh | /k/, /k/, /ŋ/, /f/, /w/ | duck, kit, ring, photo, wheat | pack, pocket, kick |
| ai, ay, ee, ea, ea | /eɪ/, /eɪ/, /i/, /i/, /ɛ/ | rain, day, tree, leaf, bread | snail, sail, tray, bean, pea, leaves, thread, spread |
| oa, oe, oo, oo, oi, oy | /oʊ/, /oʊ/, /u/, /ʊ/, /ɔɪ/, /ɔɪ/ | boat, hoe, moon, book, coin, boy | goat, spoon, zoo, wood, hook |
| a-e, e-e, i-e, o-e, u-e, u-e | /eɪ/, /i/, /aɪ/, /oʊ/, /ju/, /u/ | cake, these, bike, home, cube, June | cape, mate, kite, pine, hope; give, have keep short vowels (come dropped: its o is /ʌ/) |
| ow, ow, ou, ew, ew, ue, ie, ie, aw, au, y, y | /aʊ/, /oʊ/, /aʊ/, /u/, /ju/, /u/, /aɪ/, /i/, /ɔ/, /ɔ/, /i/, /aɪ/ | cow, snow, out, grew, few, blue, pie, field, saw, haul, happy, my | sow (both), row, town, bowl, house, cloud, glow, claw, chief, sunny, poppy, fly, sky |
| ar, or, ore, er, ir, ur | /ɑr/, /ɔr/, /ɔr/, /ɝ/, /ɝ/, /ɝ/ | car, fork, more, her, bird, turn | barn, chard, corn, horse, store, fern, birch, turnip, farm |
| igh, air, ear, ear, are | /aɪ/, /ɛr/, /ɪr/, /ɛr/, /ɛr/ | night, chair, hear, bear, care | light, high, pair, year, near, pear, wear, share; learn /lɝn/ as a distractor |
| c, g, ge, dge, kn, gn, wr, s | /s/, /dʒ/, /dʒ/, /dʒ/, /n/, /n/, /r/, /ʒ/ | city, giant, cage, badge, knot, gnat, wren, treasure | celery, ginger, sage, hedge, knife, gnaw, write, measure; get, give, girl keep /g/ |

**Words avoided because American speakers vary** (author's judgment, partly confirmed in Wiktionary): room, roof, root, broom, food (oo); moth, long, dog, cross (cloth vowel); carry, arrow, berry (r between vowels); new, tube, Tuesday (yod); with (th voicing); bench, lunch (nch often said with sh); herb (silent h in US). bath is used with its GA /æ/; the grown-up panel notes the southern English vowel.

## Open checks

- Every transcription in the word table: checked against Wiktionary US/GA (independent review); by ear still open. Wiktionary also lists minority US variants that do not change any key (measure /ˈmeɪʒɚ/, keeps /ʒ/).
- `[check]` The variety notes in the grown-up panel (rhoticity regions, Mary, marry, merry and horse, hoarse mergers, yod-dropping after t, d, n): standard in Wells, *Accents of English* (1982), not consulted this session. None is a child-facing claim.
- `[check]` Appendix 1 rows against the gov.uk copy rather than the school-hosted copy.
- Scene 4's history claims: S8 opened (see above). The chives line rests on S9's excerpt; Wiktionary's chive entry agrees (*Allium schoenoprasum*).

## Rights notes

No images, audio or third-party text are embedded. All scene text, teach cards and items are newly written for this pack. Appendix 1 example words informed the choice of words; words themselves are not copyrightable, and no table or guidance text is reproduced. Pictures (packets, a bird bath, a chick, a tool chest, a snail, a goat and others) are to be drawn as original art. Audio: no dictionary recording is downloaded, reused or imitated; every request in the companion's table is for an original adult human recording under brief 55's rights review, with no voice cloning or synthetic voice.

## Marble and Jane

Marble `data/teaching-research.json` at `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` has no English research (0 of 331 English topics); the seven targets' topic records (description, evidence, standards; CC BY-SA, ODbL) were read and paraphrased only. Jane at `0ec55f7e083976e6fcc3977fca460b1f5e199d91` has no phonics content; its lesson shape informed the cards and ladder. No Jane text or code is used.
