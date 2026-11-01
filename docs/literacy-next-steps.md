# Literacy: the next bridges

Audit of main `b3883ad12c6c7358a9335e58132bf9e147664043`, 2026-10-31, for admitted LG-10 / LG-G1. This is a source-grounded build recommendation, not a placement assessment, complete course or permission to produce phonics recordings. The roadmap’s canonical release receipt establishes publication separately from this audit.

## Follow-on status, 2026-11-01 (UTC)

The base inventory below records `b3883ad`. [Labels for the Show342](specs/342-prop-box-sound-messages.md) subsequently shipped, adding the adult-spoken/print-first action and middle/final substitutions recommended in priority1. [Market Labels343](specs/343-prop-box-market-labels.md), tracked in [PR365](https://github.com/anotherpanacea-eng/learning-garden/pull/365), is the next foundation build: six contrasts and explicit adult-led e/u/d/g cards, retained in a second packet without replacing342. The PR owns its independent review and release evidence. These are selected contexts, not completed single-letter, blending, segmenting or all-correspondence topics. Remaining r/l/w/y, j/k/v/z, q/qu, x, uppercase and long-vowel commissions are named in343; accepted audio still follows55. Productive writing priority2 is now the independently cleared [Spelling for a reader345](specs/345-spelling-for-a-reader.md) build in [PR367](https://github.com/anotherpanacea-eng/learning-garden/pull/367): original messages, optional authored references and elected revisions in the existing Post Office composer. Runtime review/release remain pending; this does not close the broad target topics.

## What exists, and what it does

The omnibus proposals describe their original starting point. Their “nothing on main” passages are not current inventories. The bounded implementation specifications and actual content factories give the following picture:

| Proposal | Built slice and action | Remaining boundary |
| --- | --- | --- |
| Brief55 foundation | [Prop Box320](specs/320-word-room.md), `#words/props`: twelve CVC labels, manual three-position pointing/building, onset comparisons and three adult-supported miniatures. | Displayed models and tile matching do not establish decoding or dictated spelling. Only onset substitutions exist in this inventory. |
| 263 Prefix Signs and dictionary | [325](specs/325-prefix-signs-and-dictionary.md): prefix constructions, dictionary pages, B1–B6 and E1–E4. | E5 and E6 remain below; no general dictionary proficiency claim. |
| 263 Ending Signs | [338](specs/338-ending-signs.md): literal letter tools for -ly, -ous and -ation; C1–C7. | Printed forms and adult reading do not supply the missing sound contrasts. |
| 263 Pattern Stall | [339](specs/339-pattern-stall.md): sign meanings, family clues, letter tiles, A1–A5. | Unexpected forms remain discoveries to discuss; this is not free spelling. |
| 263 Word-List Crate | [340](specs/340-word-list-crate.md): printed cards, flexible grouping, letter marking, D1–D4. | Memory-strategy exploration does not demonstrate recall from memory. |
| 268 Stained Map | [330](specs/330-stained-map.md): standalone history labels and family pairs, A1–A5. | Standalone material is not an edit to a canonical Keeper’s Page. |
| 268 Endings Shelf | [331](specs/331-endings-shelf.md): revise a supplied letter, ending trays, word pairs, B1–B6. | Earlier suffix prerequisites remain broader than this finite slice. |
| 268 Pip’s Copy | [335](specs/335-pips-copy.md): postcard deck1, keep or revise supplied words by meaning, D1–D5. | Page3 deck2 and a productive Post Office transfer are not implemented here. |
| 268 Word List Shelf | [336](specs/336-word-list-shelf.md): printed cards/trays, E1–E3. | Using a chosen clue in original writing remains a follow-on. |
| 268 Long-Word Workshop | [337](specs/337-long-word-workshop.md): move, reorder and remove word pieces; revise a glossary; F1–F3 and F4’s same glossary. | Construction already exists. Another tile bench alone would add little; neither copied forms nor recognition are spelling from memory. |
| 268 Beat Bench | [341](specs/341-beat-bench.md): written stress guides, meaning decisions, letter clues and an ough wall, C1–C5. | No accepted spoken model, pronunciation judgment or independent spelling evidence. |

Checked implementation entry points: `dist/app.mjs` and the word-room, market-signs, stained-map, endings-shelf, pips-copy, word-list-shelf, long-word-workshop and beat-bench content/core/UI modules. All five 263 bench families and all six 268 bench families have a local implementation. That does not mean every original item, story adapter, prerequisite or target topic is complete.

## Precisely what remains from those commissions

| Unbuilt item | Purpose and priority | Gate before implementation |
| --- | --- | --- |
| 263 E5: order world, word, work by the fourth letter | A later-letter dictionary contrast; a small extension, not the next major loop. | New bounded specification; preserve supplied order and source. Earlier second-letter ordering is not this item. |
| 263 E6: explain how to check an uncertain spelling | An adult hears a checking plan, then the pair actually consults a dictionary. Useful within a productive writing task. | Preserve the original no-storage/no-grading oral boundary. No dictionary service or API is necessary. |
| 263 scene4: the bilingual trader | Add when the market chapter needs that scene; it is not missing core spelling mechanics. | Finite language/source review and a separately commissioned story adapter. |
| 268 Pip’s Copy deck2 | A delayed revisit to eight corrections in the actual third page. | The page must really be visible under `pageVisible`; use canonical text, preserve saved sources and avoid spoilers. Deck1 is not an implementation of deck2. |
| 268 original page-bound scenes and chapter contributions | Later story adapters, when their chapters need them. | Actual page/readiness checks and separate contribution design. Standalone map/glossary work must not be counted as canonical-page work. |
| Post Office transfer from 335/336 | Use a spelling clue or reference while composing/revising a different message for a reader. This adds production and transfer. | New reviewed contract, explicit child choice, separate destination draft, no automatic posting or overwrite, human response and ungraded original prose. |

The original finite items are in [263’s text](content/263-market-signs-text.md) and [268’s text](content/268-old-keepers-spellings-text.md). E5/E6 and the unselected adapters remain proposals; this audit does not silently commission them.

## The more important prerequisite gaps

The [Prop Box source study](source-audits/320-word-room.md) and [brief55 written panel](reviews/55-phonics-content-2026-10-30.md) identify a supported foundation, not a full phonics sequence:

- Selected lowercase letters and three short vowels do not cover all letters, uppercase forms, remaining consonants or long vowels.
- Same-family onset changes do not teach medial/final phoneme changes.
- Building beside an already displayed label does not demonstrate segmenting a spoken word and encoding it without a printed answer.
- Familiar pictures and labels do not establish blending an unfamiliar word from taught correspondences.
- The miniatures remain shared reading: every non-target token is adult-supplied. They are not independently decodable passages or a fluency assessment.
- All seven target topics in [250](specs/250-sounds-in-the-seed-packets.md), arranged across six proposed benches, remain unfinished. Its first consonant-digraph slice must not leapfrog the incomplete foundation or bypass its commissioning gate.

Later word study also leaves broad homophone/alternative-spelling work, Greek/French ch, -gue/-que, Latin sc, dictated spelling and application in original longer writing unfinished. Correct printed choices do not close those gaps.

### Prerequisite crosswalk, not entry locks

For E1-I/II, study `mt_F978c32kDr` Single Letter Sounds, `mt__KHQttMde3` Blending Sounds to Read Words, `mt_BhYJZUsErp` Segmenting words into sounds and `mt_PvU3eoikev` Onsets & Rimes. The bundled graph’s transitive hard union for the first three has seven nodes/seven edges; the refreshed upstream has six/six. The difference is Knowing all letters → Understanding print, now soft upstream. The bundled pin remains unchanged. Understanding print remains a useful adjacent encounter, not a newly imposed lock.

Both versions require authored support for constituent letter sounds, phoneme awareness and vocabulary. Neither graph licenses declaring these taught from a completed sorting bench. E1-III/IV word history and checking work remains useful alongside the foundation; an older arrival may choose it directly. E1-V/VI original application needs writing for an actual reader. Presentation and access remain independent of age, gender and task familiarity.

## Recommended tracks and build priorities

The foundation and productive-writing tracks serve different starting needs and may progress in parallel; neither is a required child pathway through the other. The next bounded foundation build is first below because it adds a missing learning action to an existing room.

**1. Extend the Prop Box with one adult-led sound-change/message investigation.** Write and independently review a bounded specification and finite text before code. Teach one medial and one final CVC substitution using reviewed words made from already introduced correspondences, contrast them with the existing onset change, and keep the three sound positions distinct. Give the adult a way to supply a spoken word before its printed answer is shown; let the child build a label, then compare/revise it. Offer a print-first try before revealing a new word’s picture, without claiming the app knows the word is unfamiliar to this child. Finish with a short shared message whose adult-supplied tokens are explicit. Keep meaningful unfinished attempts and optional help, and return to a different contrast on a later visit. The adult hears oral work; the app retains literal material and disclosed support, with no automatic oral score or inferred level.

This is an extension of 320’s explicit adult-read pattern, not permission to ship 250 or substitute browser speech for phonics assets. The finite new words, senses, changed phoneme positions and text classifications need independent linguistic/content review. Review the actual interaction for answer leakage: headings, selectors, accessible labels, pictures and read-aloud must not secretly supply an answer while the UI calls it hidden. An adult may deliberately reveal help. A hidden answer never proves independence or unfamiliarity. Record supported material honestly and preserve prior sources rather than converting an old label into a different word.

**Foundation follow-on, before a 250 build:** commission a reviewed Prop Box series for short e and u and the remaining consonant correspondences, with uppercase/lowercase letter recognition kept distinct from sound demonstrations. Select and sequence real words and shared messages around those correspondences, and name the constituent help required by each later 250 slice. This is scheduled foundation work, not an indefinite “later” gap or a requirement to pass an alphabet test. Long-vowel patterns need their own reviewed teaching, including the eventual end-e slice; teaching every possible sound of a letter is not an entry requirement. Each foundation commission remains bounded and open, with its own finite content and reviews.

**2. Connect spelling strategies to an original message.** Specify one optional Post Office/word-study bridge: choose a purpose and reader, write a short message, use a clue or dictionary if desired, receive an authored reader question, revise and keep both versions. Reuse the existing reader-revision pattern rather than another destination or text editor. Carry a source/reference only by explicit choice; never transfer correctness, mastery or the whole notebook. E6’s oral checking plan can accompany this without being recorded or scored. This supplies a different learning action from printed recognition and can serve later E1/E2/E4 writing. The English build-out defaults to spoken or paper responses with nothing stored; the new spec must explicitly justify optional saved prose by reusing the already-built Post Office composer, preserve that default as an available choice, and specify exactly which first/latest drafts the child elects to retain.

**3. Add narrow revisits when they earn their place.** E5 can accompany an actual dictionary need; deck2 can follow the real page reveal. Broader letter teams, additional correspondences, vocabulary histories and connected reading still require their own reviewed teaching sequences. Do not fill a proposal checklist at the expense of the missing foundation or productive transfer.

For each build, spec49 §5 still requires teaching, contrast, supported practice, new use and return. Spec120 supplies purpose: useful labels and messages as the library/theater and weekly market return. These two bridges need task-local illustrations and optional manual steps; no new ending film, reward video or phonics audio is commissioned. A quiet kept-work acknowledgment suffices. They do not grant chapter completion or a Keeper’s Page.

## Audio decisions: completed versus pending

The three-provider written review for brief55 is complete. The owner subsequently selected General American English, as recorded in the roadmap. The dated panel’s “owner selection pending” line describes its earlier checkpoint; it is not current authority to ask that question again.

Actual takes, recognizer targets/normalization and a failure/hold path, rights, owner speaker/headphone listening and a separately reviewed player remain pending. Stock whole-word/narration synthesis is allowed by the [brief55 amendment](specs/55-phonics-content-audio-brief.md#owner-amendment--2026-10-30-production-and-review-path); consenting-adult recordings are the default for sound samples/segmentation/blends. A screening pass is not acceptance. Browser speech, a model’s text verdict and an adult-read design cannot satisfy these gates. No recordings or learner voice capture are requested by this audit.

## Upstream study and verification limits

Refreshed 2026-10-31: Jane [`e88f81a00553fb87818ef84c77a8800f0dcb33e4`](https://github.com/kentlangley/Jane/tree/e88f81a00553fb87818ef84c77a8800f0dcb33e4), actual `LESSONS.md` teaching/worked steps and help ladder; Marble [`5e23196fa60050433f1440057f65a978d39e63fc`](https://github.com/withmarbleapp/os-taxonomy/tree/5e23196fa60050433f1440057f65a978d39e63fc), actual topics and dependencies for the crosswalk above. Adopt teaching before practice, explicit contrasts and optional help as design references. No Jane prose/code, graded bosses, mastery, penalties, remote learner state or copied research is incorporated. Marble meanings/relations are paraphrased under the existing NOTICE and database/content attribution; no taxonomy repin or new coverage claim.

This audit combines direct code/content inspection and separate read-only foundation/spelling reviews. It establishes a current source inventory and next design questions, not observed learning, an accepted pronunciation model, physical-device qualification or a new hosted release. Independent cross-vendor review precedes landing. LG-10 stays in build because its remaining commissions and foundational/audio work are incomplete.
