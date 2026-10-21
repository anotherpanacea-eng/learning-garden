# Phonics content/audio source audit — 2026-10-21

> Independent specification checkpoint: [review receipt](../reviews/52-55-independent-spec-review.md) accepts the bounded curriculum/access dispositions; earlier pending labels below preserve the authoring baseline. This does not approve runtime behavior or, for55, phonetic recordings/rights.

**Author research and proposed dispositions, pending independent review.** Supports [brief55](../specs/55-phonics-content-audio-brief.md) and its12-word content audit. This is not linguistic clearance, audio listening, runtime coverage or a complete phonics sequence.

## Actual sources and boundaries

Refreshed Jane and Marble remotes during this pass. Jane remains [`d4903954d7c4d8118cbd1d2f7ed770544fd4ac81`](https://github.com/kentlangley/Jane/tree/d4903954d7c4d8118cbd1d2f7ed770544fd4ac81); Marble remains [`87118bb0a87374f9dec3940d91e4319ce6b05da2`](https://github.com/withmarbleapp/os-taxonomy/tree/87118bb0a87374f9dec3940d91e4319ce6b05da2),1,837 topics /3,853 edges. Read actual topic descriptions, evidence and incoming dependency reasons, not titles alone. The bundled pin stays`96a7933754af672e1bfdbf7ecb05c325860c6e0d`,1,590 topics /3,221 edges.

Started with [upstream opportunities](../upstream-opportunities.md) and inspected spec04, spec34 and `dist/word-garden-ui.mjs`/`word-garden-content.mjs`. Word Garden uses device-local whole-word/sentence speech for meaning-bearing parts; it explicitly does not teach isolated phonemes. Reuse its independent-door, support and preservation principles, not its narration as verified phonics. The candidate does not overwrite or reclassify its saved work.

Jane `LESSONS.md`, `src/stuck.js` and `LICENSING.md` were inspected alongside the engine study recorded for spec54. Stable authored content, optional explanation and separate help are relevant design references. This inspection does not supply an isolated-sound library, a pronunciation-variety review or a license to copy someone else's recordings. No new Jane code, lesson prose or audio is incorporated; its creative grader, points/mastery and timed response assumptions are not adopted.

The official [Common Core RF.K page](https://www.thecorestandards.org/ELA-Literacy/RF/K/) was fetched/read for onset-rime blending, individual CVC phonemes, sound substitution and letter-sound correspondences (RF.K.2c–e, RF.K.3a–b). The official [RF.1 page](https://www.thecorestandards.org/ELA-Literacy/RF/1/) was read for complete single-syllable segmentation and regular one-syllable decoding (RF.1.2d, RF.1.3b). Their wider vowel/digraph/fluency scope is not met by twelve words. Codes describe source scope, not a child's age or grade. The [IES foundational-reading guide21 URL](https://ies.ed.gov/ncee/wwc/PracticeGuide/21) returned HTTP200 with **scheduled-maintenance content**. Its recommendations2–4 were not reverified; do not substitute that response for reading the guide.

Read Cambridge Dictionary entries for [cat](https://dictionary.cambridge.org/dictionary/english/cat), [pin](https://dictionary.cambridge.org/dictionary/english/pin) and [hop](https://dictionary.cambridge.org/dictionary/english/hop) as limited checks of proposed vowel notation: /kæt/, /pɪn/, and UK /hɒp/ versus US /hɑːp/ (also /hɑp/ in a US entry). These three entry checks do **not** verify all12 words, segmentation, teaching blends, accent suitability or performer output. No dictionary recording was downloaded, listened to, copied or commissioned for reuse. The phoneme strings in the word audit are author proposals; broad /ɑ/ rather than dictionary /ɑː/ is a stated notation choice requiring human review.

## Complete selected hard closure

Three targets have **five distinct transitive hard predecessors**, including one target (Single Letter Sounds). Their union is **seven unique nodes**, with **seven hard edges**. Names, descriptions, evidence and all incoming `(prerequisiteId,strength,reason)` triples match the bundled pin for these seven nodes. This narrow equality does not declare the rest of upstream or its metadata unchanged.

| ID / role | Actual source meaning, paraphrased | Proposed content opportunity/disposition | Limit and independent-review question |
| --- | --- | --- | --- |
|`mt_F978c32kDr`, target and ancestor|Common consonant sounds, short/long vowel sounds and quick response to single letters.|Brief55's12 selected grapheme/sound pairs, with optional adult explanation before use.|**Scope exception:** nine consonants and three short vowels only; no long vowels, all-letter coverage or speed criterion. Does the introduction provide enough correspondence teaching?|
|`mt__KHQttMde3`, target|Blend unfamiliar words containing taught correspondences; respond readily across40+ phonemes.|Whole-word, segmented and blend requests for12 CVC words; one-sound substitutions within each family.|**Scope exception:** twelve phonemes, repeated/supplied words and family familiarity do not meet40+ phonemes or establish unfamiliar-word decoding.|
|`mt_BhYJZUsErp`, target|Segment spoken words and encode CVC/regular words with letters, including writing from dictation.|Three ordered sound positions; proposed adult-led segmentation and optional paper-word invitation.|**Modality/scope exception:** supplied tiles or listening are not free spelling, dictation or handwriting evidence. No child recording or automatic oral judgment.|
|`mt_PvU3eoikev`, ancestor|Blend/segment onset-rime, isolate CVC initial/medial/final sounds and substitute phonemes.|Distinguish rime-family navigation from all three individual phonemes; compare cat→bat, pin→tin and hop→mop after teaching the changed correspondence.|Rimes are not phonemes or suffixes; no unreviewed arbitrary word generator. Are examples sufficient to avoid memorizing only the family ending?|
|`mt_EqXlZfB4jp`, ancestor|Understand phonics/word-structure vocabulary: phoneme, grapheme, blend, segment, CVC, digraph, syllable, affixes and more.|Adult notes and optional explanations name sound/phoneme, letter/grapheme, blend and segment; explain three-sound CVC here.|**Vocabulary exception:** digraphs, homophones and morphological analysis remain later/separate; term recall is not a gate.|
|`mt_frDIaXzWbx`, ancestor|Recognize/name all26 uppercase/lowercase letters and use letter names in spelling discussion.|Introduce the selected lowercase graphemes, with optional names distinct from sounds.|**Scope exception:** this pack does not require or demonstrate the entire alphabet or uppercase fluency. A future player must not silently presume unknown selected letters are taught.|
|`mt_1KCwbGvm1F`, ancestor|Print carries meaning and follows English page/word directionality.|Point to the real-word picture/meaning and track its three printed positions left to right; shared text has separate adult-supplied words.|**Scope exception:** no full book-handling or independent print-concept assessment; support is available.|

Exact incoming hard edges, written **dependent → prerequisite**:

- `mt_F978c32kDr` → `mt_frDIaXzWbx`: letter recognition supports learning their sounds.
- `mt_frDIaXzWbx` → `mt_1KCwbGvm1F`: print direction/meaning precedes useful letter identification.
- `mt__KHQttMde3` → `mt_F978c32kDr`, `mt_PvU3eoikev`: blending needs correspondences and phoneme awareness.
- `mt_BhYJZUsErp` → `mt_EqXlZfB4jp`, `mt_F978c32kDr`, `mt_PvU3eoikev`: encoding needs phonics terms, correspondence knowledge and segmentation skill.

The other three union nodes have no incoming hard edges. No dependent-to-prerequisite arrow is reversed to manufacture an easier progression; instead the narrow exceptions above need explicit independent acceptance. All destinations remain open. No source prerequisite becomes a claim of prior learner attainment.

Read the actual soft-adjacent descriptions for `mt_4GiE83rJF_` (rhyming, predictable phrases and poems), `mt_UvNrOXny1i` (spoken/written syllable division) and `mt_WBfj79OqXz` (pencil posture and lowercase formation). They explain useful support or separate motor work, not additional selected targets. One-syllable word families do not teach poetry/recitation; three phonemes are not three syllables; tapping letters is not letter formation. These nodes are outside the seven-node hard-closure count.

## Reviewable artifacts and checks

- [Word audit](../content/phonics/words.csv):12 proposed words, each with three graphemes and three positional phonemes, intended meaning and review question. Mechanical alignment checks cannot validate speech.
- [Audio request ledger](../content/phonics/audio-requests.csv):51 unique proposed IDs, covering12 sound requests,36 word/segmentation/blend requests and3 full shared texts. All pending; isolated /h/ is conditional. A request is not an existing asset.
- [Shared texts](../content/phonics/shared-texts.json):three exact original texts with token offsets and explicit target/adult-supplied classifications. All four target types appear in their family text. None is labeled fully decodable.
- [Manifest example](../content/phonics/manifest-example.json):documentation-only, runtime-ready false, no media location/checksum/timing/license, no approved review. Repeated /p/ positions in pop remain separate tokens referencing the same proposed sound ID.

Check unique IDs, cross-references, exact family membership, grapheme/phoneme lengths, token coverage/offsets, pending statuses and absence of media/approval values, then validate relative links and the unchanged atlas. These are authoring/accounting checks only. Independent reviewers must still approve the pronunciation model, exact linguistic content, scope exceptions, every actual recording and rights. No listening, runtime, browser, physical-device or learning-gain check is performed by producing this packet.

Author checks performed:12 word rows /36 positional grapheme–phoneme pairs;51 unique pending audio requests with the stated category totals; all50 shared-text tokens accounted for (14 target occurrences,36 adult-supplied); exact offsets and audio/text references; pending, non-loadable manifest; exact seven-node/seven-hard-edge source table and bundled comparison;94 relative file links; unchanged atlas (118 references /62 topics); whitespace. These counts validate documentation structure, not the pronunciation or teaching efficacy of any row.

Marble-derived names, meanings and relations retain attribution to Generative Spark, Inc. (Marble), ODbL1.0 database and CC BY-SA4.0 text, under the existing repository notices. Original candidate words-as-examples, miniatures and production decisions are distinguished from the taxonomy-derived crosswalk. Jane application MIT and document/lesson CC BY-SA layers remain separate. Dictionary/standards references are studied and linked; no media license is inferred from access. Rights for future performances remain unresolved.
