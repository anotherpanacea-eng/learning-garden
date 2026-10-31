# 338 · Market Signs: the Ending Signs

Draft 2026-10-31 against main `db53402`. LG-10 / LG-G1. **Specification only; independent specification and subject review precede code.** A bounded second slice of [263](263-market-signs.md), extending the built [325](325-prefix-signs-and-dictionary.md) room. [Finite text](../content/338-ending-signs-text.md); [source audit](../source-audits/338-ending-signs.md).

## 1. Problem and teaching job

Market Signs (325) teaches that a prefix usually changes no letters. Its natural contrast is missing: at the other end of a word, an ending often does change the root. Parcel Labels (314) shows one such change (y to ies) on nouns, and the Endings Shelf (331) already turns reasonable and visible into reasonably and visibly. Nothing yet teaches -ly, -ous or -ation as endings with a choice of root change. This bench is a purposeful revisit of 331's -ably/-ibly pairs (le to ly is the same move) and 314's y change, not a first encounter. Add a third bench to the same room: pick a root word, an ending and a tool, and see exactly what letters the tool writes. Fit is about the tool, not about guessing the answer word.

This is written spelling work on supplied words. It does not isolate, synthesize or assess sounds, and brief 55's audio gate is unchanged: -sion, which is told apart from -tion by sound, appears only in the grown-up text. No Hear button or speech request is commissioned; adult shared reading and ordinary text accessibility remain. No child or family records, typed prose, microphone, remote model, telemetry, score, timer, lock, age gate or mastery label.

**Contrast the slice must make visible:** *completely* (keep the e before a consonant ending) beside *invitation* (drop it before a vowel ending); *joyous* (vowel, then y: keep it) beside *glorious* (consonant, then y: change it); *dramatically* (-ic adds -ally) beside the odd *publicly*; and 325's "nothing falls off" beside this bench's tools.

**Story.** 263 scene 2, *Rapped in paper*, at the bakery stall of spec 120's Act II chapter 1, the weekly market: Pip paints FRESHLEY and the board is fixed. It is an original revisit, not a chapter step, counter, Keeper page or ending, and it works at every story arrival. Its dictionary is 325's "bigger book", not the tiny model. Scene 4 (the Vadoalto trader, Spanish) is not commissioned.

## 2. Scope and material

At the existing `#words/signs`, Market Signs gains one arrival action, **Make an ending sign**, and one bench. Commission exactly:

- 263 cards 10, 11, 12, 13, 14 and 21, worked examples revealed one step per explicit tap.
- Ending bench (c): the 24 roots in the companion's table, three endings (-ly, -ous, -ation), five tools in fixed order (just add, drop the e, y to i, le to ly, ic to ically), the 24 authored joins, the no-root shelf (enormous, jealous) and the odd-ones shelf (truly, publicly, courageous). Any of the 72 root and ending pairs can be tried with any tool.
- Practice C1-C7, in that order: six three-choice tasks and the C6 placement task.
- The selected story, help, glossary, off-screen card and grown-up text in the companion.

Not commissioned: 263 benches (a) and (d), sets A and D, scene 4, Spanish, E5/E6, any new route, sibling link or audio. 331's Endings Shelf (-ant/-ance, -ible) and 337's Long-Word Workshop are separate rooms; link neither from here until a later reviewed slice says so.

All practice is supplied, supported and guided, including a response made before the learner opens a card. No independent spelling inference.

## 3. Turn structure and interface

Reuse the built room's sign-and-paper identity, controls and focus rules: one active job per screen, explicit Back/Next, native controls 44 px high, visible focus, selected states that do not rely on color, no horizontal overflow at 320×600, 820×1000 and 1024×768. Original SVG bakery board and paint pot, with a text alternative.

### Ending bench

Three labelled native selects: **Root word**, **Ending**, and a **Tools** group of five native pressed buttons, the fifth under **A harder tool**. Blank initially. Changing any selection persists it after preflight and changes no kept sign.

Below them the board shows, live, what the selected tool writes:

- Every letter of the made spelling, with root letters and ending letters in two labelled colors and a text label for each part. A changed or removed root letter is named in text with exactly one of the companion's four lines. No animation is required.
- **Tool rules are literal and fixed in code**, never data: just add writes root + ending; drop the e needs a final e and removes it first; y to i needs a final y and writes i in its place; le to ly works with -ly only and swaps a final le for ly; ic to ically works with -ly only and writes root + ally after a final ic. When a tool cannot work for the current root and ending, its button stays enabled for focus but selecting it writes nothing and shows the finite reason. A tool is never hidden.
- For an **authored pair with its authored tool**, show the word and its rule line (a fit).
- **A retained join is readable only if the fixed rule for its own tool, applied to its own root and ending, writes exactly its stored word.** A join that fails this (for example a hostile or corrupted retained `fresh` + -ly + just add with stored word `freshley`) is paused for that pair only: show the literal letters the selected tool writes and the finite line **This older sign note does not match its own tool. It is kept as it was.** No fit, mismatch hint or discovery line is shown for that pair. Keep is disabled for this paused pair; existing kept triples stay visible/exportable and selection controls still lead to other pairs. The saved source, kept triples and every practice record stay exactly as saved; nothing is regraded or normalized.
- For an **authored pair with another working tool**, show the made letters, then 263's exact hint line if the companion lists one for that root and tool, else the finite template naming the authored tool. It names the move; it never prints the answer word except where 263's own hint already does.
- For an **unauthored pair**, show the made letters and the discovery line. Never a lexical verdict; some such combinations are real words.

**Keep this sign** requires all three selections and a tool that can work; it adds that triple once to the **Kept ending signs** shelf, including discoveries and authored mismatches, without calling any of them correct. Reopen restores the three selections. Clear my sign clears the selections, not kept signs. Switching to another bench or a job preserves the waiting sign. The two read-only shelves are folded panels.

### Practice

The built practice shelf gains a second group, **Ending sign jobs**, listing C1-C7. **Which group is active.** Add optional `signs.practiceGroup: 'prefix' | 'endings'`. Absent, or any other value, reads as `'prefix'`, so a 325-only root behaves exactly as now. Under `view:'practice'`, the active job is the active group's own `currentId` (`signs.currentId` for prefix, `signs.endings.currentId` for endings); the other group's pointer and all records in both groups are kept untouched. Selecting a job from either group sets `practiceGroup` and that group's pointer only. Next job and Skip walk one combined order, the retained 325 jobs then the retained ending jobs, and wrap; crossing the boundary switches `practiceGroup`. If the active group's pointer is missing or unreadable, show the chooser with both groups, never create work. Opening the ending bench or the prefix bench changes neither pointer. Test B1 then C1 then the ending bench then reload: the saved ending-bench view remains selected, and explicitly returning to practice resumes C1 with B1’s record intact. Also test the wrap from C7 to B1. C1 shows its three guided steps first. The teach card for each job (companion) stays nearby. Three-choice jobs use 325's choice controls; C6 uses 325's match mechanics with six parts and four destinations in the companion's order, reusable, keyed by the complete part-to-destination mapping. An ending match task without its three readable instruction strings is retained read-only as that job only; never substitute B5’s prefix/meaning wording. Its instructions are its own finite copy (companion); the shared renderer must take the instruction and destination-prompt lines from the job, and B5 keeps its existing prefix/meaning wording unchanged. Check, Keep this version, help ladder, first/latest keeps, retained checks and feedback semantics are exactly 325's.

## 4. Persistence

Use the existing optional `signs` root and its existing preflight, stale-callback and failure contract unchanged. Add one **optional sibling section**, `signs.endings`, absent until the first explicit ending-bench or ending-job selection. If `signs` itself is absent at that moment, the existing mutate path creates it with today's 325 collection as it does now; that is not new behavior.

```
signs.endings: {
 v:1,
 source:{v:1, story:{short,longer}, roots:[{id,text}], endings:[{id,text,label}], tools:[toolId...],
         joins:[{id,rootId,endingId,toolId,word}], shelves:{noRoot:[{id,word,note}], odd:[{id,word,note}]},
         hints:[{rootId,toolId,text}], cards:[card...], jobs:[taskSource...]},
 draft:{rootId:null|id, endingId:null|id, toolId:null|toolId},
 kept:[{rootId,endingId,toolId}],
 currentId:null|id,
 records:{[jobId]:record}
}
```

- The whole section source is frozen once, on that first explicit action; reopening never merges today's content. A later content collection needs its own reviewed choice, not an automatic upgrade.
- `toolId` is one of the five fixed code ids. An unknown retained tool id is shown as an unavailable older tool; it is never reinterpreted. Joins store their expected word, so a fit is "chosen tool equals the join's tool". The made letters are recomputed by the fixed tool rules for display only and never change a kept record.
- `card`, `taskSource`, `work`, `check`, `snapshot` and `record` reuse 325's validators and limits exactly; ending jobs and their records live in this section, so the 325 jobs list, its 64-record cap and its Earlier jobs behavior are untouched.
- Bounds: roots, joins up to 64 each; endings up to 8; shelves up to 16 each; hints up to 32; cards up to 16; jobs up to 32; records up to 32; kept up to 256 unique triples; ids and text as in 325. Validation is structural and against the section's own source only; never against today's catalog.
- A malformed or unknown-version `endings` section stays exact, exportable and read-only; the prefix bench, dictionary and 325 jobs stay open. One unreadable ending record pauses only that job. A valid 325-only root is not normalized by visiting the room.
- `practiceGroup` is described under Practice; unknown values read as `'prefix'` and are kept as saved.
- `view` gains `'endings'`. Older code reading `view:'endings'` shows the chooser, which is acceptable.

Every mutation goes through the existing clone, `prepareProgressImport(JSON.stringify(notesReport(candidate),null,2))` preflight and commit. Readers and Notes are pure. The Notes reader lists kept ending signs and ending job records beside the 325 sections.

## 5. Integration and files

Runtime extends `dist/market-signs-{content,core,ui}.mjs`, `dist/market-signs.css`, `test/market-signs-checks.mjs` and `test/market-signs-browser.py`. No new route, so no change to app.mjs's route lists, index.html or progress-transfer is expected; if the build finds one is needed, take custody for it separately. Update the README's Market Signs line and the child-copy check scope if its renderer registry needs the new bench. No roadmap edit, atlas claim, curriculum coverage update or story counter.

## 6. Sources, prerequisites and revisits

Jane `e88f81a00553fb87818ef84c77a8800f0dcb33e4` (LESSONS.md teach / guided / stuck / writing-style sections) and Marble `5e23196fa60050433f1440057f65a978d39e63fc` (topics, dependencies, teaching-research), both freshly resolved 2026-10-31. Design reference only; no code, prose or research text incorporated. Details in the audit.

Candidate only: Suffixes (age 7+) `mt_tHtjfjjFrl`, strands E1-III (morphology and exception spellings) and E2-II (affixes). **Partial:** -sion is grown-up text only; the topic's sound-based phrasing is not taught. No complete-topic coverage or attainment claim; Marble has no English teaching research, which is not evidence either way.

**Pinned hard-prerequisite crosswalk** (recomputed against the bundled pin; identical upstream): Suffixes `mt_FYK8m6eHQm` → Suffixes (age 7+). Met elsewhere in part by built 314 (y to ies after a consonant, with its stated equivalence to y to i); supported inline by cards 11-13 and the tools. Soft: Spelling Verb Endings `mt_QdMMLRYWhn`. Context only, never a gate.

**Spec 49 teaching contract:** target, choose the tool that joins a root word and -ly, -ous or -ation, and spell six learned-family words; teaching encounter, cards 10-14 and 21 and scene 2; contrast, as in §1; supported practice, C1's guided steps, the ladder, per-choice feedback, live tool results; new application, the 48 unauthored pairs on the bench and the off-screen paper card; purposeful revisit, 325's "nothing falls off" and 314's y to ies; data boundary, codes only, local. **Spec 120:** Act II chapter 1 setting only; no chapter completion, unlock or page.

## 7. Acceptance and review

Independent content read must check every selected 263 line, the five tool rules and "usually" wording, all 24 joins, the odd and no-root shelves, C1-C7 keys and cues, and re-check keyed forms and distractors against a primary dictionary (this session could not; see the audit). Six review lenses stay distinct; implementation needs fresh exact-head Claude clearance.

Pure checks: all 360 root × ending × tool combinations against an independent oracle (made letters, cannot-work reasons, the exact partition of 24 fits, 19 authored mismatches with the four exact 263 hints or the template, 78 discoveries and 239 cannot-work cases, 121 working in all); no authored pair fits two tools; the odd-ones and no-root words sit only on their read-only shelves, with no root true, public or courage on the bench and no authored join for them (literal tools can make truly, publicly and courageous; they are exceptions to the cards' generalizations, not unreachable spellings); a retained join whose stored word disagrees with its own tool pauses only that pair; C1-C5 and C7 every choice; C6 all 24 single-placement assignments, the fitting mapping, every one-part error and incomplete or reused mappings without enumerating all 4,096; key positions and single-longest rule; word limits. Persistence: frozen section, unknown tool id, malformed section beside a readable 325 root, unknown sibling fields kept, a 325-only root left untouched by a visit, first/latest keeps and retained checks, and actual pretty Notes export/import of the full authored section with every job checked twelve times and all 121 working triples kept (the maximum authored fixture).

Native browser at the three viewports: selects and tool buttons by touch and keyboard, the live board for a fit, a mismatch, a cannot-work tool and a discovery; keep, reopen, clear; shelves; all seven jobs and the combined Next wrap; storage off/failure, preflight refusal, explorer switch, import, reset and stale controls. Synthetic fixtures only. Inspect the rendered board, not only HTML strings.

Run all source checks and touched browser regressions on the final tree, credential scan, independent review, and the ordinary merge, deploy and byte-match procedure. Physical iPad/Safari/VoiceOver and learning effect remain separate evidence. A receipt closes only this slice; 263 benches (a) and (d), 268 bench (c) and the 250 audio work stay open under LG-10.
