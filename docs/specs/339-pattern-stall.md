# 339 · Market Signs: the Pattern Stall

Draft 2026-10-31 against main `658eec0689d2d4c58330b6aaf5c62dfe72ff6b13`. LG-10 / LG-G1. **Specification only. Independent specification and subject review precede code.** A bounded slice of [263](263-market-signs.md), extending the built [325](325-prefix-signs-and-dictionary.md) and [338](338-ending-signs.md) room. [Finite text](../content/339-pattern-stall-text.md); [source audit](../source-audits/339-pattern-stall.md).

## 1. Teaching and story job

The prefix and ending benches show what happens when word parts join. This slice turns back to the letters inside a word and to what a whole sign means. Repair pictured signs for the returning weekly market: a warm loaf and a worm are different things; a pay sign points here, while a listener can hear. The live board accepts unexpected combinations as things to inspect and keep. Its finite spelling note is about the intended sign, never a verdict that another spelling cannot be a word.

This is **written-pattern and meaning practice with adult shared reading**. Printed families are useful examples, not universal rules or sound instruction. Honey and money belong to both the Monday and key groups. The three after-w groups share one family card but need different letters. No isolated sound, blend, pronunciation scoring, dictation capture, speech request or new audio. Brief55's production/listening gates remain separate. All task checks are supplied, supported and guided, even before a teaching panel opens. No independent spelling or reading inference.

263 scene1, *Worm bread*, supplies an Act II chapter1 weekly-market revisit under [spec120](120-keeper-of-the-ways.md). It is available at every story arrival. There is no chapter receipt, Keeper page, counter, unlock or completion award. Pip, Dot, the miller and the baker are fictional. No Spanish trader scene, other new room, model call, telemetry, learner identity field, typed prose, microphone, score, timer or access lock.

## 2. Commissioned slice

At existing `#words/signs`, add **Visit the Pattern Stall** and one bench, plus a **Pattern sign jobs** group:

- Cards1–5 from263, with manual stepwise examples.
- Eleven pictured gapped signs in the companion; five family cards and six letter tiles. Every complete case/family/letters combination can be tried and kept.
- A folded meaning shelf of nine picture sentences: here/hear, two/too/to, bee/be, blue/blew. The added *Go to the stall* sentence makes the third to/two/too spelling explicit. These are read-only examples, not separately assessed answers.
- Practice A1–A5: four three-choice jobs and one six-sign placement job.
- Selected original story, glossary, help and paper activity, with their finite text.

263's Word-List Crate, D1–D4, E5/E6, other rooms, 268's Beat Bench and250's audio remain open. No atlas or topic-coverage update. 336's later Word List Shelf remains a separate room; no new link is commissioned.

## 3. Turn and visual contract

Reuse the room's paper/sign identity and existing native controls. One active sign or job at a time. A folded chooser lists sign titles and pictures; selecting one explicitly resumes its own draft. A labelled **Another sign** button cycles readable retained cases in source order and wraps. **Back to Market Signs** returns to the arrival without changing a draft or either practice pointer.

The selected sign shows its picture and text alternative, its clue, five native family buttons and six native letter buttons. No default family or letters. The board starts with the literal prefix, a visible gap and suffix. Picking letters replaces the gap live with **exactly prefix + tile.text + suffix**, in that order, with the inserted letters labelled as well as coloured. Family selection never changes letters; changing letters never changes the family. No automatic paint, erasure, replacement or next turn. **Clear this sign** clears only this case's two selections.

A selected family displays its own example words as a flat list in stored order, with no catalogue-derived subgroup boundaries. Card3 and the case notes carry the a/ar/or contrast. Family choice and letter choice have separate readouts; a fitting spelling with another family is not called wholly wrong. If either selection is missing, show its finite invitation. Once both are present, show the literal board, one family line and one letter line, using the companion's templates and this case's stored note. With only a family selected, show its examples and the missing-letters invitation; with only letters selected, show the literal board and missing-family invitation. Neither fit line appears until both are selected. Only the eleven authored sign notes are modeled. In particular, AR/OR on the warm board distinguishes WARM/WORM; every other unlisted fill has a neutral discovery line, not a lexical verdict. The supplied target remains available in its spelling note: this is supported comparison, not recall assessment.

**Keep this sign** requires a complete readable triple (case, family, letters), and keeps it once whether or not it fits the note. The folded **Kept pattern signs** shelf labels it by sign title + chosen family + chosen letters, not by presenting an unexpected spelling as a conventional word. Reopening restores that case and its two selections. Paging is presentation-only, six per page, with usable focus at either boundary. Changing benches resets the shelf page but does not change kept work.

Original simple SVG pictures: apples, open-day calendar, payment box, cautious walking feet, steaming bread, repair tools, key, donkey, section-B apples, station sign, honey jar; the A2 walking-path arrow and A5 six waiting signs. No external image or audio asset. The paired meaning shelf has original pictures for place/listener, two pies/shared pie/path, hive/caution and blue sign/wind. Picture alt text and adjacent sentence carry the meaning; colour alone never determines an answer. Missing/unfamiliar picture codes use the stored text alternative and retain the text activity, with no remote fetch.

Native controls at least44px high and type at least16px; visible focus, pressed states with a noncolour cue, no overflow at320×600,820×1000,1024×768. Use existing sticky bench navigation and explicit focus/scroll handling so the current heading and feedback are reachable. Family and letter buttons support keyboard activation. No drag is required. Story Short/Longer, glossary, worked steps and picture-shelf paging make no learner record. Manual turns only.

### Jobs and existing groups

Add optional `signs.practiceGroup:'patterns'`, and `view:'patterns'`. Absent/unknown group still reads as prefix. Active pointers remain separate: `signs.currentId` for prefix, `signs.endings.currentId` for endings, `signs.patterns.currentId` for patterns. Selecting a job changes only its group's pointer and the active group. Opening a bench changes none of the three job pointers. Practice resumes the active group, or shows the chooser if that pointer/record is unreadable; never invent a job.

Next/Skip walk the combined retained order:325 jobs,338 ending jobs,339 pattern jobs. Missing sections contribute no jobs and are not allocated by traversal. With no pattern section, existing325/338 traversal is byte-for-byte unchanged in saved meaning. Selecting the new bench or a named A job is its first explicit opening. Last pattern job wraps to the first eligible prefix job; an unavailable section does not close other groups. Reset selected matching part, panels, teaching steps and focus when group/current job changes, so B5 or C6 cannot carry a selection into A5.

Reuse325's job work/check/help/first/latest semantics, not a new progress API. Pattern jobs require their own nonempty bounded `contextLabel`, safe-id `pictureId` and nonempty bounded `pictureAlt`; tagged jobs require `tagLabel`. An unfamiliar pictureId uses the stored text alternative, not a current picture catalogue replacement. A5 requires its own `matchCopy:{instruction,destinationPrompt,destinationLabel}`. Do not use B5 prefix/meaning instructions. Missing/unreadable owned copy pauses only that job, retaining it and other jobs. For A5, compare the whole six-part mapping; every destination may be reused. Finite general feedback replaces all263 per-gap different-placement lines, including its unreachable u feedback (A5 offers a/o/ar/or, not u); no per-gap diagnosis is claimed. All four A5 letters and all supplied choices stay in their retained order. Pattern job IDs never activate325 dictionary panels or prefix labels: dictionary affordances belong only to the active prefix group, not merely to a job named E1/E3/E4. Test retained pattern jobs with those colliding ids. A1 shows the first two worked steps before choices. Correct choice positions remain B/A/C/B, none single-longest.

## 4. Source-owned persistence

Use the existing clone/preflight/commit and actual Notes report/import limit. Do not change other rooms, the Word Garden root or existing saved sources. First explicit opening creates only the optional section, using the existing root creation path if `signs` is absent. Readers and Notes never allocate or normalize.

```
signs.patterns:{
 v:1,
 source:{v:1,
   families:[{id,label,words:[text...]}], letters:[{id,text}],
   cases:[{id,title,prefix,suffix,targetLettersId,targetLine,familyIds:[id...],
           clue,familyNote,letterNote,pictureId,pictureAlt}],
   cards:[card...], jobs:[taskSource...],
   meanings:[{id,word,sentence,pictureId,pictureAlt}],
   story:{hook,short,longer,note,dictionaryNote}, glossary:[{term,text}], offscreen, grownup},
 currentCaseId:null|id,
 drafts:{[caseId]:{familyId:null|id,lettersId:null|id}},
 kept:[{caseId,familyId,lettersId}],
 currentId:null|jobId, records:{[jobId]:record}
}
```

Schema text is at most4000 code points, ids use325's safe-id bound, all named scalar copy fields are nonempty except prefix/suffix (empty allowed). Family words are nonempty strings. Arrays/objects retain unknown sibling fields exactly. Source is frozen once for this section: reopening never merges the current catalogue or demands today's counts/keys/wording.

Bounds: families16 unique IDs,32 words each; letters16 unique IDs; cases64; source cards16; jobs32; records32; drafts64; meanings32; glossary32; kept512. Source jobs/cards/cases/meaning rows count duplicate ids before choosing any: duplicated or unreadable rows are unavailable individually, not silently first-wins. Jobs/records reuse325's structural bounds; source-owned A5 copy extends the reader as above.

A readable bench requires structurally valid family and letter lists. Parse each case independently: references must be in its own retained family/letter lists, familyIds unique/nonempty, and `targetLine` must equal its own prefix + its own target letter text + suffix. Otherwise pause that case, not all cases or jobs. New content is not used to repair it. Drafts are absent until a case is selected; absence reads as empty. A malformed per-case draft or its references pauses editing only that case. A malformed/over-limit drafts container pauses bench editing, not jobs. A missing/unreadable currentCaseId shows the chooser and does not create a replacement.

Kept rows are read independently against their own retained case/family/letters. A kept row pointing at a paused/unreadable case is also unreadable. An unreadable row remains exact in Notes and is unavailable only as that shelf item; it does not block another case's draft or Keep. Valid new triples are appended only if not already present; no imported duplicate is removed or rewritten. Every raw row counts toward512. If kept is not an array or is over the bound, Keep/reopen are unavailable, while case selection, painting/clear and jobs still work; show the finite kept-material line. No history is evicted. Display reads may show a different live combination, but never rewrite an earlier check or kept row.

Whole-section read-only only when patterns is not an object, section v is not1, source is not an object, or source.v is not1. Preserve the raw section, leave325/338 open. Bad families/letters pause the bench only. Malformed jobs/records, meaning rows, cards, story, glossary and adult material have their own read boundaries; raw sections remain exportable. Story includes its frozen dictionaryNote; show it below the story and Keeper note. A broken story/card does not disable cases or jobs. No save is compared with today's catalogue; historical ids and source wording remain their owners.

Every successful mutation preflights the exact pretty Notes report through the app's existing importer before commit. Refusal, exception or size failure changes nothing, including before first allocation. Saving off or storage failure still permits session work and actual RAM Notes export with truthful status. Keep raw support, checks and outcome codes as325 does; do not infer independence from no later hint. Read-only presentation changes never write. Notes list pattern drafts/kept signs/first/latest jobs beside existing sections and retain the complete raw material.

Extend the existing connected-owner/route/notebook/root/source/group/pointer/material guards to the new section, case draft and active record. Controls from a changed source, different explorer, closed/hidden/inert panel, open welcome film, import/reset, departed route or earlier render cannot write or request speech. No new callback registry or global state system.

## 5. Integration boundary

Extend `dist/market-signs-{content,core,ui}.mjs`, `dist/market-signs.css`, `test/market-signs-checks.mjs`, `test/market-signs-browser.py`, the README's Market Signs paragraph and `scripts/check-child-copy.mjs` only if needed. No new route or app integration is expected; if one proves necessary, widen custody first and resolve the dependency rather than silently broadening this slice. No shared learning graph/mastery model, generic game engine, catalogue updater or permanent verification framework.

## 6. Curriculum, upstream and prerequisites

Jane `e88f81a00553fb87818ef84c77a8800f0dcb33e4` and Marble `5e23196fa60050433f1440057f65a978d39e63fc` refreshed2026-10-31; exact source files and comparison in the audit. Jane's small teaching steps, stable pending task, separate worked example and voluntary Skip inform this design. No upstream code, prose or research text copied; bundled taxonomy/licenses unchanged. Do not adopt points, bosses, access gates or mastery labels.

Candidate only: **Alternative Spellings for Sounds `mt_p_jxNLdus4`**, strand **E1-II** spelling alternatives and purposeful review in **E1-III**. The source topic includes sound-to-spelling and from-memory expectations that this printed supported slice does not meet. No full-topic coverage, diagnosis, statutory-list or attainment claim. Meaning examples revisit the existing Riddles room's homophones without claiming sound discrimination. Spoken rendering may be read with an adult; this is not reviewed phonics audio.

Pinned direct prerequisites: hard `mt_BhYJZUsErp`, `mt_EqXlZfB4jp`, `mt_F978c32kDr`; soft `mt_OgJPbGkrYk`. The audit names the actual topics and distinguishes unchanged direct edges from the changed transitive hard closure. Sound/encoding/terminology work remains an external or separately commissioned prerequisite for the full topic; printed examples and shared reading provide access to this bounded activity, not proof those prerequisites are met. They never gate entry.

Spec49 §5 contract: target, compare written families and choose words for meaning; teaching, cards1–5 and pictured story; contrast, warm/worm, here/hear, one word in two families; supported practice, live letter board, A1 guided steps, examples/hint/Skip and A1–A5; new use, unmodeled board combinations and a paper sign read with someone; return,325 no-letter-change and338 root changes revisited beside internal spelling. Spec120 ActIIchapter1 setting only, no chapter contribution.

## 7. Acceptance

Independent subject check: every family membership including both honey/money groups, eleven target spellings, nine sentence meanings and picture alternatives, the selected263 lines/adaptations, all job choices/keys, and no promise of one accent or a universal rule. Primary dictionary checks support spellings/meanings, not efficacy or distractor nonexistence. Six independent spec-review lenses and other-vendor clearance precede runtime work. Runtime needs fresh exact-head Claude review.

Pure checks use an independent11-case table, not the runtime catalogue as oracle. All330 case×family×letter combinations: literal board letters; independent family/letter readouts;13 both fit,65 family-only,42 letters-only,210 neither. Every case/family/letter remains keepable, with no not-a-word verdict. All33 family memberships (31 distinct words), honey/money in both groups, the three different after-w fills and all nine meaning cards. Four three-choice jobs: every supplied choice/incomplete, keyed positions and no single-longest. A5: all24 single-part assignments around the fitting map (six unchanged fitting cases and18 changed different cases), fitting complete/reused mapping, each incomplete part; do not enumerate4096. Cards and fixed text checked against the companion. Old325 and338 suites preserved.

Persistence: untouched old-only roots on arrival; absent new section not allocated by Next; all three job pointers, including historical pattern jobs named E1/E3/E4 that never open the325 dictionary; unknown group fallback; A5 selected part reset crossing B5/C6; absent/unknown section, family/letter lists, duplicated or broken individual cases, draft, case target disagreement, kept rows/container, job owned copy, story/card/meaning independently recoverable; missing current pointer; omitted/unknown own source rows without catalogue injection; historical job key/feedback unchanged; first/latest and first+eleven recent checks; atomic refusal before/after allocation. Actual pretty Notes download/import on top of `fullEndingSignsNotebook()` with all330 triples kept and all five jobs checked16times (12retained), both help flags and first/latest keeps. Demonstrate this maximum authored fixture fits the real importer; do not assume capacity. Over-limit refusal preserves every field.

Native browser at three viewports: pictured clues and literal A/O/AR/OR/EY/TION by touch/keyboard; honey/money's two accepted families; warm→worm meaning contrast; incomplete, unfamiliar fill, keep/reopen/clear; resume each case's own pending draft through Another sign/reload/other bench; all jobs and combined wrap; story/shelf/teaching no evidence writes; actual Notes import/export, saving off/failure, refusal, two explorers, stale source/hidden/film controls and reset. Inspect actual viewport pictures, inserted-letter labels, focused heading/feedback and touch targets, not only HTML strings. Missing picture text path stays usable.

Run `node scripts/run-checks.mjs` and the touched browser suite on the final combined current-main release tree; ordinary independent review, repairs, merge-commit/deploy/byte-match/receipt. Only this slice closes. Physical iPad/Safari, audible reading, VoiceOver and measured learning remain separate evidence.
