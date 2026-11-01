# Spelling for a reader: source and integration study

Author pass, 2026-11-01 UTC; specification independently cleared; runtime implementation in progress. This commissions original-message transfer from existing spelling study, not a new spelling curriculum or assessment. No child/family information, external lesson prose, dictionary definition, audio or learner model is incorporated.

## Real integration surfaces

Main inspected at `a83fa0a9afe23a585919a8f7a60afe0c3d7b3951`.

- `dist/message-core.mjs`: version1 `messages`, per-case Post Office/Loft work, optional 600-unit `original`, reading/help context, fixed supplied-card tests. Its strict `workValid` currently permits no `spelling` field; implementation must admit it opaquely and validate the new subrecord locally. It does not already retain first/latest original prose. `carryMessage` clones the whole work; the new field must be omitted from newly created destination copies. `setMessageText` clears temporary supplied-card feedback on original edits; the bridge preserves this established behavior.
- `dist/message-ui.mjs`: `revise`, `human`, `source`, `messagePage`, `bindMessages`, optional composer and actual reader stage. Its existing supplied-card results do not evaluate original text. Reuse these surfaces; original card/play/Loft behavior stays separate.
- `dist/word-list-shelf-core.mjs`: `wordListShelfSource` exposes frozen readable words and authored clues, skipping ambiguous addresses; `wordListShelfView` supplies the current shelf/job view. No preexisting carry API is assumed. `word-list-shelf-ui.mjs` selects the active word in explorer/root-keyed transient view state; the new carry must use that readable selection, not assume the view itself selects a word.
- `dist/pips-copy-core.mjs`: `pipsPostcardSource` supplies readable slot `clue`, `key`, choices and authored context. The child's selected word can be a nonword or wrong meaning and must not become a reference. Instead the explicitly revealed authored key/context example transfers, with no learner answer or correctness. Actual source inspection confirms high/advice/effect/led have keyed readable models and before/after context strings. `pips-copy-ui.mjs` has the selected slot. No page3 reveal is needed or granted; only the existing standalone deck1 is in scope.
- Existing whole-notebook preflight, owner save settings, conflict controls and Notes remain the write boundary, but `bindMessages` does not currently clone/preflight text edits. The Post Office binding must pass the gate and active-owner context and guard its shared original handler, with Seed Exchange's visible unsaved-field pattern on refusal. Loft and changing-letter adapter behavior remain unchanged. A new optional subrecord needs no new root/transfer destination or migration framework. Existing reset is whole-explorer Clear progress, not a nonexistent scoped message reset.

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

## Independent specification review and repairs

Claude Opus5.5 independently reviewed `d4eb353e75504e4f4bf366c4f91bb7f32953c4b8`, read the docs and actual message/word-study/app/letter wiring, and ran no code. Four P1 findings prevent building that original candidate: cloned Loft records, overclaimed oral privacy, learner-selected Pip errors presented as references, and an assumed preflight missing from the real typing handler. Nine P2 integration/copy gaps concerned actual readers, supplied-note labels, feedback invalidation, help semantics, carry disclosure, transient storage, reset, vocabulary fit and route isolation. The reviewer called its overall verdict BUILD-READY-WITH-FIXES; root treats its explicit P1s as requiring spec repair before runtime.

The current revision repairs those contracts rather than starting code around them: omit the new field on ordinary carries; narrow oral privacy to spoken/paper words; carry an explicitly revealed authored Pip example; guard the shared Post Office original handler with atomic preflight and visible dirty-state refusal. It also supplies readers, route/memory/reset boundaries and cumulative help semantics. Upstream refresh/graph calculations and actual Pip model inspection are root-executed, separate from Claude's read-only review. A focused independent delta review is required before this revision is build clearance.

The independent delta review of `874d17625de393fb5e18cb87752006bba2520cc4` confirmed all four P1 repairs and the major integration boundaries. Two residual P2s were a contradictory attribution of the basket question to Rabbit and ambiguity between keyed choice.text and the button label high (leave it). Both are corrected; the high-model probe is explicit. Bounded P3 clarifications cover dirty-field action blocking, gate/owner callbacks, render purity, oral help without a bridge, replacing duplicate help, reference bounds and unreadable destination refusal. These clarify the existing contract; no additional feature or review framework is commissioned. The final narrow delta review is recorded below.

Claude Opus5.5's final narrow review cleared exact specification head `909ef1bf5fd6065cf2c59d7374bf62d412950537`: SPEC BUILD-READY, no remaining P1/P2. It inspected the supplied actual diff, specification/finite copy and relevant core code, ran nothing and did not re-audit the whole UI/app or upstream pins. Earlier passes covered the actual integration seams. The absent-root versus present-unreadable-root distinction is an explicit implementation probe. This is specification clearance only; the implementation still needs independent exact-head Claude review and native interaction/performance checks.

## Implementation validation checkpoint (before independent code review)

The existing editor now serves a four-turn own-message flow, with persistent reader/reference access, explicit typed consent, literal kept versions, readable sibling isolation, source invitations and guarded original edits. A narrow explorer return-path repair keeps the own/carry routes after choosing a child. No new destination, storage root, scorer, live model, audio asset or mastery claim. Plain child labels use “Pip's example” rather than the review aid's flagged “supplied”; the provenance line still says it is not the child's answer.

Root-executed native Chromium checks pass: the message journey (59 targeted checks, one full journey plus short1024×768/320×800 samples), existing Word List Shelf suite (293) and existing Pip's Copy suite (298). They cover actual Notes download/import, first/latest/revision/restore, oral words unrecorded, source data unchanged, pending reference lifetime, saving off, owner and detached/hidden/modal controls, real preflight refusal, ordinary-composer refusal and competing-tab save protection. Browser speech is intercepted for request/exposure testing, never accepted as audible phonics or pronunciation evidence. Tablet geometry is sampled, not physical-device qualification.

A separate temporary actual-handler probe, with saving off and10 edits per condition, measured ordinary-notebook median1.1ms/max1.4ms and a synthetic notebook with4,600,000bytes of padding median30.2ms/max35.6ms on this Mac's Chromium. This isolates the guarded input/preflight path; it is not physical iPad typing evidence, a storage-quota guarantee or a stable benchmark. No performance harness is added to the repo. Full integrated source validation and independent exact-head implementation review follow; this checkpoint does not clear or publish runtime.

## Independent implementation review repairs

Claude reviewed runtime candidate `c82c59d2289cbddb5bacfd583fa0467ccdf7533e`, reading actual code/tests but executing nothing:0P1/2P2, not cleared. The textarea parser could strip an initial line break; inserted already-open teaching panels could record help from a redraw, including across cases. Both are repaired: an initial sentinel newline preserves the actual textarea value, and transient turn/panel state is tied to the selected case. Redraw toggle events do not write help; an explicit post-record opening or worked-step action can record its actual exposure. No historical flags or prose are rewritten.

The full atlas/story/254-suite source run passed at c82c59d2. After these localized repairs, the message model/storage suites and changing-letter model/integration suites pass, and the native message journey passes64 targeted checks. New real-browser regressions restore a version beginning with a line break, keep pre-record help unrecorded when typing starts, and change cases through the ordinary chooser without fabricating exposure. Existing source-activity browser results and other unchanged code results are reused under the audited check policy. Final independent delta clearance remains pending before landing.
