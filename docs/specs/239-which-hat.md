# 239. Which Hat? · words that help a reader find one thing

Status: bounded runtime commission, 2026-10-25; independent specification review precedes implementation. Selected from draft PR182/spec262(a), companion six-hat model and A1–A5. The larger six-bench grammar pack, deduction board122 and act adapters remain proposals.

## Purpose and boundary

At `#post/descriptions`, six fictional hats hang beside the Post Office. Dot has brought the café’s unclaimed hats to pegs beside the Post Office. An owner points to a peg. Build a description, see which hats fit, and revise so another reader could identify that hat. This is a visual language loop: selecting properties intersects sets; a phrase may identify several things, none, or exactly one. Clear descriptions do useful work. Usual adjective order is a convention, not a condition of returning the right hat.

Use the draft's exact table: peg1 small/old/blue/no ribbon (Dot); peg2 small/new/blue/gold (baker); peg3 big/old/blue/gold (Puff); peg4 big/new/red/no ribbon (Ember); peg5 small/old/red/blue (miller); peg6 big/new/blue/blue (orchard keeper). Pictures have redundant printed descriptions and peg numbers: age and size are explicitly model labels, never inferred from an ambiguous picture. The rack remains visible on every working turn. All scenes and quantities are invented and labeled. No real learner data or free text is collected.

## Play contract

Three open turns: **Look and describe**, **Try a reader question**, **Kept discoveries**. No locked sequence, score, timer or mastery. A welcome explains one job and offers Start. Start freezes the selected complete source. A new visit retains earlier visits. Every target peg is selectable from the start; no forced repetition or reward gate.

In Look and describe, a visitor points to a numbered target peg. Tap any word tile to add/remove it: lovely, small, big, old, new, blue, red, with a gold ribbon, with a blue ribbon. Selected pre-noun tiles retain the child's order, with tap/keyboard Move earlier/later and Remove controls; ribbon phrases follow the noun. `the` and `hat` supply the phrase frame. Multiple contradictory modifiers are allowed: an empty matching set is a discovery. Lovely is an opinion and rules no model hat out. No owner name acts as a secret identifying predicate. All changes autosave working choices; Clear only clears the current phrase.

A live match count and highlighted rack reflect actual conjunction of every selected factual property. No selected modifiers fits every hat. Distinguish zero, several, one target, and one different hat. A phrase that uniquely identifies the wrong peg has not returned the requested hat. `Keep this discovery` records any phrase and its exact result; successful identification produces a small static return caption, no video or access unlock. Keep does not consume a hat. Select another owner or revisit the same one at any time. Results are model feedback, not proof of independent grammar/reading.

Offer `Read it back`: display the current phrase and an order explanation; usual opinion/size/age/color order is suggested, and an understandable other order still identifies the same hats. Do not grade unconventional order as an incorrect description. The ribbon phrase goes after hat. Changing targets preserves the current description until an explicit Clear, making over/under-specificity visible. Optional local speech uses the existing voice controls; no automatic audio or microphone.

Try a reader question supplies A1–A5 from262, with full source/context and three ordered choices. A1 compares two/one/no fits for Dot. A2 asks the usual size-age-color order, with other orders explicitly understandable. A3 asks head noun in the gold-ribbon phrase. A4 asks party's modifier job in party hat. A5 places my before modifiers. Explanations distinguish head hat from embedded noun ribbon. A1 is guided with optional steps, not an unseen independent test. Every task has Help, Different example, Work together and Skip; request observation is committed before reveal. Questions can be chosen freely and revised; choices and results remain visible. First response is immutable, latest distinct; a later skip/help never replaces the first answer. No automated judgement of original writing or inference of a child's level. Keep and supplied questions are separate evidence.

## Persistence and isolation

A new optional `descriptions` root per explorer: `{version:1,current,nextSerial,visits:{id:{source,page,target,tiles,support,claims,answers}}}`. Source includes full rack/property labels, tile predicates/ranks/wording, prompts, ordered choices/key/feedback, examples/help, result and teaching copy. Before first reveal, support records an affected target/question and kind; concept and reading requests stay separate. Empty tracked support is a request observation only; missing older observations remain unobserved.

Each kept claim and each first/latest supplied answer embeds its complete source, shown target/item, actual ordered selected tiles or choice, original outcome/feedback, support-before and phrase/order/match result. Every saved result is displayed from that record and never regraded against current rules. Working sources never refresh from the catalog. Validation uses structural bounds and the save's own IDs and property references, not today's IDs, table size, wording or key. Retired self-consistent sources open. Malformed optional claim/answer records remain raw/exportable without closing healthy siblings or the working rack. Unknown root version stays exact and read-only; unrelated destinations stay open.

All mutation happens on a clone, through structural recovery limits and the actual pretty-notes export/import preflight before committing only this root. Refusal preserves visible choices, source and earlier state. Pure render/read/preview does not mutate or normalize unrelated roots. Integration must cover fresh and existing explorer selection/creation, direct entry and both automatic welcome-film paths, with no film/exposure/initialization of foreign data. Opaque root participates in existing notes/download/import/save-off/reset; no new store or migration framework.

Finite capacity: eight visits,24 claims per visit, at most five distinct supplied item records and at most64 support requests (id/kind pairs). Existing duplicate requests/answers do not consume new slots. Full capacity refuses explicitly with notebook-download advice, never evicts or replaces a visit. An explicit confirmed removal of one readable visit is offered. A malformed history cannot be extended silently; other tasks/visits stay open.

## Reuse and curriculum

Reuse existing native buttons, local speech, notebook preflight and explorer guards; new bounded predicate model and original SVG hats. Study Jane's teach/guided/practice and support conventions; study Marble complete expanded-noun-phrase and adjective-order records/direct edges. Refresh exact relevant upstream records and scoped licenses before build. No external code/prose or curriculum pin update. This slice partially supplies expanded noun phrases and adjective order: no comprehensive grammar course, abstract nouns, comparatives, pronouns or finished notice. Head noun and determiner are taught in the selected questions; no unsupported coverage claim for whole topic mastery. Post Office entry and optional English pathway invitation connect descriptions to a reader's purpose; existing instruction/revision games keep their distinct jobs.

## Verification and release

Independent spec review with six lenses, then root folds. Source checks enumerate the finite tile subsets with an independent hat-property oracle, zero/one/multiple and wrong-target outcomes, opinion/no-property behavior, ordering invariance of meaning, stable A1–A5 keys/feedback, first/latest/support timing, frozen/retired sources, malformed siblings, capacity/refusal and unrelated roots. Actual notes transfer is exercised.

Browser checks at320/820: visual/text redundancy, touch targets, no horizontal overflow, empty/one/multiple/contradictory phrases, changing target and moving/removing words, return caption only for correct target, all question families/support/retry/skip, local speech preflight/refusal, refresh, separate explorers, malformed/raw imports, source preservation and no automatic films. Verify the Post Office hub, English pathway invitation and notes. Independent exact-head Claude clearance precedes expected-head merge, canonical personal-account deploy, tracked static byte comparison and hosted affected journeys. No new film is commissioned.

Implementation clarifications: support capacity64 covers all eleven target/question contexts without denying later help in a normal visit. Skip is a separate per-item observation, not an answered first/latest response. First/latest answer records exist only for actual selections. Read-back counts as concept support; listening is recorded separately before invocation. Match count is an immediately visible scaffold throughout this model, never evidence of unassisted identification.

### Pinned authored oracle

Draft PR182 head `e3a7c584a9d7cdbe8a87b7a0a93c92e0da35d888`, `docs/content/262-which-hat-text.md` §§(a), A1–A5 supplies the first source. Stable question order/keys:

| Item | Three choices, in order | Fitting slot |
| --- | --- | --- |
| A1 · Only Dot's peg1 hat | the small blue hat / the small old blue hat / the small old blue hat with a gold ribbon | 2 |
| A2 · Usual order for Ember's hat | a new big red hat / a red big new hat / a big new red hat | 3 |
| A3 · Head noun: the big old blue hat with a gold ribbon | ribbon / blue / hat | 3 |
| A4 · Job of party in the party hat | It tells what kind of hat / It is the head noun / It tells how something happened | 1 |
| A5 · Usual order | small my old hat / small old my hat / my small old hat | 3 |

Runtime IDs are not required to copy draft numbering. Feedback keeps all source distinctions: A1 two fit / only Dot / gold ribbon leaves none; A2 other orders understandable, usual size-age-color; A3 ribbon's phrase tells about head hat and blue is an adjective; A4 party modifies head hat and no event occurs; A5 my precedes modifiers. Tile ranks lovely0/size1/age2/color3; post-noun ribbon phrases do not change pre-noun order. Contradictory factual tiles still intersect to zero. This finite frame supports512 subsets and6 targets; no claim of testing all possible English descriptions.

Six independent lenses completed before build: completeness, dependency, scope/overlap, firewall, mechanizability and adversarial all CLEAR after support/skip and pinned-oracle clarifications. Independent enumeration found404 zero-match,76 unique and32 multiple-match subsets. Upstream refreshed2026-10-25: Jane `286300f822944b8c039d5ea8d483a6cb52759f51` (`LESSONS.md`, `LICENSING.md`, `LICENSE`); Marble `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (four complete selected noun-phrase/adjective-order records, all17 incident direct edges and teaching research, licenses/provenance). Study only: Jane's optional worked-example support and Marble's scope are design references; no external code or descriptive prose incorporated, and existing data pins/notices stay unchanged. Marble still has no English teaching-research records. This tile-and-supplied-choice slice does not satisfy its independent-writing criteria.

Primary content checks: [British Council adjective order](https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/adjective-order) and [University of Victoria](https://continuingstudies.uvic.ca/elc/studyzone/410/grammar/adjord) support usual size-age-color order; [DfE glossary](https://assets.publishing.service.gov.uk/media/5a7c8e4ded915d48c24108e2/English_Glossary.pdf) printed pp5,9,12 supports determiner placement and the head noun within nested phrases. Original source table and all A1–A5 counts/keys checked. Lovely's non-exclusion is explicitly a convention in this made-up rack.

Implementation review folds: preserve an open word-movement panel and focus after each move; keep only the record’s relevant context in new support snapshots (older full logs remain readable); A1 has an optional source-owned guided sequence with a fallback for old sources; notes omit activity-only heading IDs. Answer/skip records filed under a different item remain raw rather than being shown or extended as that question.
