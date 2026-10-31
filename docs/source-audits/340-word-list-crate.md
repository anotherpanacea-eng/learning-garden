# 340 · Word-List Crate: source audit

Sources refreshed2026-10-31. Companion to [spec340](../specs/340-word-list-crate.md). Public sources and generic original content only; this is a bounded factual audit, not independent spec clearance.

## Refreshed immutable sources

Fresh upstream HEAD resolutions match the immutable source snapshots studied for339; the exact pinned files were read:

- Jane `e88f81a00553fb87818ef84c77a8800f0dcb33e4`: [LESSONS](https://github.com/kentlangley/Jane/blob/e88f81a00553fb87818ef84c77a8800f0dcb33e4/LESSONS.md), [LICENSING](https://github.com/kentlangley/Jane/blob/e88f81a00553fb87818ef84c77a8800f0dcb33e4/LICENSING.md).
- Marble `5e23196fa60050433f1440057f65a978d39e63fc`: [topics](https://github.com/withmarbleapp/os-taxonomy/blob/5e23196fa60050433f1440057f65a978d39e63fc/data/topics.json), [dependencies](https://github.com/withmarbleapp/os-taxonomy/blob/5e23196fa60050433f1440057f65a978d39e63fc/data/dependencies.json), [research](https://github.com/withmarbleapp/os-taxonomy/blob/5e23196fa60050433f1440057f65a978d39e63fc/data/teaching-research.json), [database licence](https://github.com/withmarbleapp/os-taxonomy/blob/5e23196fa60050433f1440057f65a978d39e63fc/LICENSE), [content licence](https://github.com/withmarbleapp/os-taxonomy/blob/5e23196fa60050433f1440057f65a978d39e63fc/LICENSE-CONTENT).
- Local bundled topics/dependencies remain the existing licensed source; no update is proposed. Compare the full files, not a runtime subset.

Jane's actual teaching shape is `learn` plus `example:{prompt,steps}`, then guided practice with visible `steps`; stuck help separates hints, a worked example and start steps. Stable reached/current work, explicit teaching and separate support are useful design references. Jane also specifies bosses, medals, mastery, review gates, daily budgets and remote KV. None is required by the useful design reference. No Jane code, prose, lesson pack, image or audio incorporation is needed.

## Target meaning and crosswalk

`mt_O2dS6gvClw`, **Spelling Word Lists (age 7+)**, English, PROCEDURAL, Spelling & Word Study; source age metadata7–9. Description concerns spelling the Years3–4 statutory list, including commonly misspelt irregular words. Its evidence requires (a) at least20 correctly spelled list words, (b) identification of tricky parts and a remembering strategy, (c) accurate use in original cross-subject writing. Assessment asks about spelling from memory while writing. Actual standards codes are `uk-nc-2013:Eng_App1_Sp_Y34_18` and `uk-nc-2013:Eng_LKS2_Write_Trans_Spell_3`. These codes express source alignment, not an independently checked equivalence or an app attainment claim.

Current and bundled target name/type/domain/description/evidence/assessment/standards and age bounds match; centrality differs. Nineteen visible sorting cards plus four helper cards are supported pattern recognition, not a twenty-word spelling-from-memory test. D1–D4 are supplied choice questions. Original writing and dictation remain unobserved even if every placement and choice matches.

The edge schema states that `topicId` depends on `prerequisiteId`. **Direct incoming edges match in both sources:**

| Dependent | Prerequisite | Strength | Reason, paraphrased |
| --- | --- | --- | --- |
| mt_O2dS6gvClw | mt_Jq0MjURrRC Tricky words | hard | Y3–4 spelling builds on earlier exception-word spelling. |
| mt_O2dS6gvClw | mt_p_jxNLdus4 Alternative Spellings for Sounds | soft | Alternative spelling knowledge supports statutory words. |

**Hard closure is separate from that direct list.** Current: target → Tricky words → Knowing all letters (`mt_frDIaXzWbx`),3nodes/2hard edges. Bundle: the same chain plus Knowing all letters → Understanding print (`mt_1KCwbGvm1F`),4nodes/3hard edges. Current removes that latter hard edge; do not silently change the retained bundle or declare its closure met.

| Ancestor | Actual scope | Disposition for this slice |
| --- | --- | --- |
| Tricky words | Spell common exception words and days from memory; evidence includes dictated sentences. | Letter helpers offer support, not completion of earlier memory/dictation requirements. |
| Knowing all letters | Recognise/name both cases, alphabet sequence, letter names for spelling alternatives. | Assumed or adult-supported access; not assessed by placing supplied cards. |
| Understanding print, bundle only | Meaning of print, English page direction and book sequence. | Assumed access; a screen sort does not assess book/page handling. |
| Alternative Spellings for Sounds, direct soft | Choosing spelling graphemes for familiar phonemes and written homophones. | Pattern Stall339 is a partial purposeful sibling; this activity does not close its sound-linked scope. |

All those nodes' descriptions/evidence/assessment match current against bundle. Tricky words and Knowing all letters have ageRangeEnd, standards and centrality drift; Understanding print and Alternative Spellings for Sounds have standards/centrality drift. Do not use source ages as placement or access rules.

## Local originals and overlap

Original263(d) explicitly calls for eigh/ough/ear/double-letter crates and four helper cards. Teach15 names visible letter families and uses weight; Teach16 uses separate/business and a dif/fer/ent letter grouping. D1 weight, D2 enough, D3 different and D4 separate are the fixed original recognition jobs. The original broad pack already calls the list partial and declines the20-word attainment target. Preserve that limit rather than the original Targets line's shorthand claim.

The nineteen supplied sorting words support these literal finite pairs:

- eigh: eight, eighth, weight, height.
- ough: enough, though, although, thought, through.
- ear: early, earth, heard, learn, **appear**.
- double-letter: address (dd and ss), appear (pp), different (ff), difficult (ff), possible (ss), opposite (pp).

Thus19cards have20accepted word/tray pairs if these four trays are used. Appear fits two literal clues; address has two double groups within one tray. Shared letters are not a claim of shared sound or common morphological/etymological family. Do not force appear to one tray or say another visible clue is false.

The four helpers separate/business/island/believe can use visible-letter memory devices: separate includes a-r-a-t; business begins b-u-s; island can be viewed as is/land letters; believe contains l-i-e. Mark these as memory tricks. None establishes meaning decomposition, historical derivation or pronunciation. dif/fer/ent likewise is an authored spelling grouping, not a universal syllable/morpheme analysis. No source here validates mnemonic efficacy.

Shelf336 is built: `dist/word-list-shelf-{content,core,ui}.mjs`, stylesheet and the roadmap receipt show its existing revisable printed-clue shelf and E1–E3 jobs. Its source spec calls it20visible older-list cards, five trays, multiple accepted clues, optional help, retained first/latest work and supported recognition only.340 should reuse that useful local interaction convention instead of designing another compulsory exclusive taxonomy.336 serves the candidate older list `mt_sJyZW4qYUG` (age9+) and has the earlier list as a hard predecessor. A return from market words to the library's older collection is a purposeful invitation, not proof that either topic or dependency is complete. Current older-list record is also about memory/dictation and proofreading original extended writing, beyond the supplied shelf. That record's evidence even includes a separate mnemonic; it must not be treated as proof of list membership or age placement.

Candidate strand E1-III is exception spellings/strategies; E1-II supplies the earlier written-pattern bridge, while E1-IV deliberate revision/dictionary use is a future return. This slice does not cover all morphology/etymology/transcription in E1-III. Story placement: spec120 ActII chapter1, weekly market; returned stalls give useful spelling on labels a concrete purpose.263's pumpkin weight story is optional fiction, not required Keeper narrative progress.

## Primary checks and their limits

The live [DfE publication page](https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study) links its actual [Appendix1PDF](https://assets.publishing.service.gov.uk/media/5a7ccc06ed915d63cc65ce61/English_Appendix_1_-_Spelling.pdf). Printed p16 (PDF index15) contains all23literal spellings; eight/eighth, though/although and busy/business are grouped entries. Printed p1 distinguishes statutory word lists from non-statutory guidance/examples. Printed p14 gives eigh among alternatives for one sound; p20 explicitly shows ough across different sounds. Thus a same-letters crate is an original bounded adaptation, not the source's complete sound-based teaching. England curriculum authority does not establish US placement or this game's efficacy.

All23official Merriam-Webster headword pages opened successfully2026-10-31; no definition is copied. Exact URLs are `https://www.merriam-webster.com/dictionary/<word>` for: eight, eighth, weight, height, enough, though, although, thought, through, early, earth, heard, learn, address, appear, different, difficult, possible, opposite, separate, business, island, believe. These verify conventional headword spellings; they do not verify authored distractors, every contextual sense, the final text's key, pronunciation by a browser voice or pedagogy. No lexical absence claim about any distractor is made.

Current teaching-research.json has no active record for either list topic; all336English topics are without research in its coverage inventory. The export describes its guidance as agent-authored, untested, with historical source-verification metadata. No effectiveness claim or independent evidence rating follows.

## Licensing and scope conclusion

Jane's LESSONS/docs/packs are CC BY-SA4.0; its code is MIT and its Marble material has separate terms. Marble database is ODbL1.0 and Marble-authored text CC BY-SA4.0. Preserve existing attribution for IDs/names/derived mappings; paraphrase source research rather than copying. Dictionary definitions and upstream prose/code/assets are not incorporated. Official Crown source is linked for reference; no source layout or text blocks are proposed for copying.

No meaningful unresolved factual uncertainty remains within this bounded study. Final authored item sentences, distractor feedback, saved schema and implementation still need their own spec/subject/independent reviews. This report is factual preparation, not that clearance or a learning outcome validation.
