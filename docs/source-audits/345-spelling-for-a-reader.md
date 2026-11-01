# Spelling for a reader: source and integration study

Author pass, 2026-11-01; independent review pending. This commissions original-message transfer from existing spelling study, not a new spelling curriculum or assessment. No child/family information, external lesson prose, dictionary definition, audio or learner model is incorporated.

## Real integration surfaces

Main inspected at `a83fa0a9afe23a585919a8f7a60afe0c3d7b3951`.

- `dist/message-core.mjs`: version1 `messages`, per-case Post Office/Loft work, optional 600-unit `original`, reading/help context, fixed supplied-card tests. Its strict `workValid` currently permits no `spelling` field; implementation must admit it opaquely and validate the new subrecord locally. It does not already retain first/latest original prose.
- `dist/message-ui.mjs`: `revise`, `human`, `source`, `messagePage`, `bindMessages`, optional composer and actual reader stage. Its existing supplied-card results do not evaluate original text. Reuse these surfaces; original card/play/Loft behavior stays separate.
- `dist/word-list-shelf-core.mjs`: `wordListShelfSource` exposes frozen readable words and authored clues, skipping ambiguous addresses; `wordListShelfView` supplies the current shelf/job view. No preexisting carry API is assumed. `word-list-shelf-ui.mjs` selects the active word in explorer/root-keyed transient view state; the new carry must use that readable selection, not assume the view itself selects a word.
- `dist/pips-copy-core.mjs`: `pipsPostcardSource`, `pipsWord`, readable slot `clue`, choices and context. The selected spelling may be meaning-inappropriate; carry is reference material, never transferred correctness. `pips-copy-ui.mjs` has selected slot and source-derived text. No page3 reveal is needed or granted; only the existing standalone deck1 is in scope.
- Existing whole-notebook preflight, owner save settings, conflict controls and Notes remain the write boundary. A new optional subrecord needs no new root/transfer destination or migration framework.

## Upstream study

Fresh commit and actual file reads 2026-11-01: Jane [`e88f81a00553fb87818ef84c77a8800f0dcb33e4`](https://github.com/kentlangley/Jane/tree/e88f81a00553fb87818ef84c77a8800f0dcb33e4), `LESSONS.md` teaching/worked-step and stuck-help sections; Marble [`5e23196fa60050433f1440057f65a978d39e63fc`](https://github.com/withmarbleapp/os-taxonomy/tree/5e23196fa60050433f1440057f65a978d39e63fc), parsed actual `data/topics.json`, `data/dependencies.json` and `data/teaching-research.json`. Bundled pins remain unchanged.

Jane's concrete teaching/worked-step/help approach is a design reference, not incorporated code or prose. Use it for a short teaching encounter and optional reversible steps. No mastery, boss, penalty, lock, remote state or automatic original-prose evaluator is adopted.

Marble's candidate targets are `mt_6W5zzDIGZH` Using a Dictionary to Check Spellings, `mt_cB7hV8sw7X` Writing for an audience and adjacent `mt_4PA9IrxtCQ` Applying Spelling Rules to Complex Words. Actual descriptions concern checking with references, matching a task/purpose/audience and applying patterns in complex vocabulary. Each has **zero teaching-research records** and appears in `coverage.missingTopicIds`; no English teaching-research passage is invented. This narrow task supplies an opportunity to use a reference in original writing; it does not teach all dictionary lookup, extended composition, complex vocabulary or the target prerequisites. E1-III/IV and E2/E4 revisit checking, purpose and revision; no completed-topic/atlas claim. Definitions/relations are paraphrased under the existing Marble NOTICE/attribution; no external lesson prose or code is incorporated.

## Prerequisites and scope of support

The bundled transitive hard union for those three candidate topics has **21 nodes / 24 edges**. The complex-spelling target is an adjacent future destination, included to make its missing prerequisites explicit, not a claim this short note teaches it. The retained graph is interpreted as teaching dependencies, never entry locks.

The refreshed hard union has **20 nodes / 23 edges**: Knowing all letters → Understanding print is now soft upstream; the other hard edges agree. Understanding print remains an adjacent support, not a new lock. The literal bundled hard crosswalk is below; repeated prerequisites are shown because these are actual edges, not a count inferred from topic names.

| Topic | Hard prerequisite |
| --- | --- |
| `mt_4PA9IrxtCQ` Complex-word spelling | `mt_sJyZW4qYUG` Word lists9+ |
| `mt_4PA9IrxtCQ` Complex-word spelling | `mt_y8sicbhMci` Greek/French/Latin spellings |
| `mt_6W5zzDIGZH` Dictionary spelling checks | `mt_frDIaXzWbx` Knowing all letters |
| `mt_9P9o6d0Qm3` Planning | `mt_PJyCGJz5Hv` Oral rehearsal |
| `mt_9P9o6d0Qm3` Planning | `mt_o8ciHks8t2` Writing process vocabulary |
| `mt_BhYJZUsErp` Segmenting | `mt_EqXlZfB4jp` Phonics vocabulary |
| `mt_BhYJZUsErp` Segmenting | `mt_F978c32kDr` Single-letter sounds |
| `mt_BhYJZUsErp` Segmenting | `mt_PvU3eoikev` Onsets/rimes |
| `mt_F978c32kDr` Single-letter sounds | `mt_frDIaXzWbx` Knowing all letters |
| `mt_FYK8m6eHQm` Suffixes | `mt_BhYJZUsErp` Segmenting |
| `mt_FYK8m6eHQm` Suffixes | `mt_EqXlZfB4jp` Phonics vocabulary |
| `mt_FYK8m6eHQm` Suffixes | `mt_QdMMLRYWhn` Verb endings |
| `mt_Jq0MjURrRC` Tricky words | `mt_frDIaXzWbx` Knowing all letters |
| `mt_O2dS6gvClw` Word lists7+ | `mt_Jq0MjURrRC` Tricky words |
| `mt_PJyCGJz5Hv` Oral rehearsal | `mt_N8CpN1EJrP` Sentences |
| `mt_PJyCGJz5Hv` Oral rehearsal | `mt_o8ciHks8t2` Writing process vocabulary |
| `mt_QdMMLRYWhn` Verb endings | `mt_BhYJZUsErp` Segmenting |
| `mt_QdMMLRYWhn` Verb endings | `mt_EqXlZfB4jp` Phonics vocabulary |
| `mt_cB7hV8sw7X` Audience | `mt_82KKv0Fca3` Writing craft vocabulary |
| `mt_cB7hV8sw7X` Audience | `mt_9P9o6d0Qm3` Planning |
| `mt_frDIaXzWbx` Knowing all letters | `mt_1KCwbGvm1F` Understanding print |
| `mt_sJyZW4qYUG` Word lists9+ | `mt_O2dS6gvClw` Word lists7+ |
| `mt_tHtjfjjFrl` Suffixes7+ | `mt_FYK8m6eHQm` Suffixes |
| `mt_y8sicbhMci` Greek/French/Latin spellings | `mt_tHtjfjjFrl` Suffixes7+ |

The bridge supplies a reader/purpose, oral rehearsal, a short worked revision, and optional previously authored spelling clues. Constituent print/letters/sound/segmenting, exception words, word lists, suffix and etymological patterns, sentence/grammar vocabulary and broader planning programmes remain elsewhere or unfinished. A child may ask an adult for any of that support without the app inventing completion. This table makes those missing steps visible; it does not commission their full implementation in one short-message build.

## Finite copy and evidence limits

All added child lines are in the companion. Existing three purposes/requests/questions are original project content from `message-content.mjs`. The coat example reuses its already-authored reader-revision idea as project-owned content. No new etymological or pronunciation claim, dictionary definition or phonics sample needs sourcing here. Word references retain existing335/336 source context and attribution; their earlier dictionary/source audits remain authoritative for those authored clues.

A real person reads/hears original prose and discusses meaning/spelling. Stored opened controls and kept versions cannot establish decoding, memory spelling, mastery or improvement. Chromium verifies interaction/preservation, not physical-device usability, audible speech or educational outcomes. An independent reviewer must examine these boundaries and the actual strict message-owner integration, not merely the existence of a schema.
