# 321 · The Writing Table: holding it together

Proposed 2026-10-31. Base inspected: `8ddd5e07505fce1eb33a0df4e24f52e8f6b70195`. Lane C's second runtime commission from [277](277-for-the-next-keeper.md), after [317](317-writing-table.md) built Paragraph Sort and The Linking Word. **Specification, not implementation or release clearance.** [Finite text](../content/321-writing-table-holding-text.md).

## Purpose and boundary

A reader follows a draft when they can tell what each word points back to and how two paragraphs connect. Teach four cohesion moves on supplied drafts: a key word kept going with synonyms and a pronoun; a pronoun that could mean two things, fixed by naming the thing; an opener that shows a contrast, a result or one more point; and ellipsis, leaving out words the reader can fill in. The stated link between the two parts decides each fitting answer.

Build 277's third bench, **Holding It Together**, with all of set C. Nine tasks: two tap tasks (the parcel words; the unclear "it"), one fix choice, three paragraph joins (C2, C3 and the show), two shorter-version choices (C4 and the mill), and the guided item C1. 277 lists C2 to C4 both as set items and as bench tasks; here each is one task, so no content is shown twice under two names. The bun card appears in three tasks and is card 6's worked example; those tasks are worked-example practice and say so. The new applications are the show join and the mill dialogue. No task or bench is locked by results.

This commissions supplied-text cohesion practice: E4-II's link between paragraphs and the Year 4 and Year 6 cohesion devices of 277's knowledge section. It is a bridge toward a child holding their own writing together, not evidence of it. It does not deliver The Red Pencil, research, Point and Quote, Form and Effect, Your Page, Act V, a chapter contribution, Keeper page 5 or an ending. The title stays **The Writing Table**; neither Hollis nor the future page heading appears. 317's fifteen tasks, records and controls are unchanged.

## Experience

Same route `#desk/writing`, same shell as 317. The bench selector gains a third button, **Holding It Together**, after The Linking Word. Its shelf lists the nine tasks in the order below; **Next draft** continues through the whole twenty-four-task order (317's fifteen, then these nine) and wraps, as 317 does. Arrival is unchanged: a new explorer still opens the bakery draft. A returning explorer whose current task is in this bench returns to it.

Order and kinds:

| # | Task | Kind | Set | Family |
| --- | --- | --- | --- | --- |
| 1 | One parcel, four words | tap | bench | parcel |
| 2 | Which word is unclear? | tap | bench | bun |
| 3 | Fix the unclear word | choice | bench | bun |
| 4 | The other side | choice | C2 | roof |
| 5 | Because of the rain | choice | C3 | rain |
| 6 | One more thing to enjoy | choice | bench | show |
| 7 | Leave it out | choice | C4 | show-trip |
| 8 | Where are you going? | choice | bench | mill |
| 9 | What could "it" mean? | choice, guided | C1 | bun |

**Tap tasks** are new. The draft shows as running text in which some words are native toggle buttons (`aria-pressed`) and the rest is plain text. Tapping toggles a word; a tapped word gets a visible underline and a text marker as well as its pressed state, never color alone. The order of taps is not graded. **Clear my taps** empties the selection. At every width the tappable words wrap with the text and keep a 44px tap target through padding, so a line may grow taller; no horizontal scroll. Each tappable word's accessible name is the word plus its place, for example "package, sentence 2". Only the authored words are tappable, so the child chooses among the nouns and pronouns in the draft, not every word.

**Fix, join and shorter-version tasks** reuse 317's `choice` kind: three native answer buttons in authored order. A join shows paragraph 1, the **What changes** line, the choices, and a preview of paragraph 2 that starts with the chosen opener, as 317's joins do. A shorter-version task shows the long sentence, the choices, and a preview that puts the chosen version in place. The fix task shows the draft with the chosen fix in place of its second sentence. Wrong choices stay selected and previewed exactly as chosen.

The visible payoff is the draft as it now reads. Nothing moves on Check; per-choice or per-word feedback explains, and the child can try again. Keep, first-kept and latest-kept versions, **A draft you have seen**, help, Hear and the human invitation work as in 317. This bench's invitation is in the companion.

## Teaching, content and checks

Teach cards 5 to 8 from 277 are this bench's teaching, one card per task group: card 5 for task 1, card 6 for tasks 2, 3 and 9, card 7 for tasks 4 to 6, card 8 for tasks 7 and 8. Worked examples reveal one step per tap. C1 keeps its three visible guided steps. All text, keys, choice order and feedback are 277's set C and bench (c) unchanged, plus the commission additions listed in the companion (task titles, reader lines, the join and preview paragraphs, tap feedback, two easier examples and the invitation). As in 317, every check records `supported:true, guided:true`, help flags are kept separately, and nothing infers independent writing, reading, age, mastery or a completed topic.

Keys and their reasons:

- Task 1: exactly **parcel, package, it, bundle**. "He" points back to Pip; "bridge", "bakery", "baker" and "windowsill" are other things. Missing words give a count-free line ("Some words that mean the parcel are not tapped yet."), never which ones.
- Task 2: exactly **it**. The named nouns are not the unclear word.
- Task 3: **Then the bun slid off the table.** Both other fixes leave two possible referents.
- C1: **Either one: the reader can't tell.** Both readings fit; this item teaches the ambiguity, not a preferred referent.
- C2 contrast, C3 result, task 6 addition, as each **What changes** line states. The dragon does not cause the fox, and the fox is not the other side.
- C4 and task 8: the version a reader can fill in. "To the mill." answers "Where are you going?"; "Going." leaves out the place; "I'm going there." does not say where.

Feedback is per choice or per tapped word, followed by 317's **Your draft is still here. You can change it.** No whole-draft red X. A tap task with no taps is incomplete, not different. A tap task with every key word and an extra word is different, and names only the extra word.

## Notebook contract

Same optional `writingDesk` root and `{v:1,currentId,records}` shape as 317. Do not add a root or change the version. The nine new tasks are new records under new ids; 317's records stay exact.

**One addition, the `tap` kind.** A tap source has `kind:'tap'`, `parts` as the draft's ordered segments, each `{id,text}` with optional `tap:true`, and `key` as a non-empty array of unique tappable part ids. A tap source may hold up to 32 segments, at most 12 of them tappable; every other source keeps 317's 12-part bound. `feedback.different` maps a tappable id to its line, and `feedback.missing` holds the count-free missing line. Tap work is `{taps:[partId]}`: unique, each a tappable part of the record's own source, at most 12. Order in the array follows tap order and is never graded. Outcome: empty is `incomplete`; the same set as the key is `fit`; anything else is `different`. Feedback lists, in draft order, the line for each tapped non-key word, then the missing line if any key word is untapped. Validation, freezing, first and latest checks, Keep, and refusal behave exactly as 317's other kinds. A record of an unknown kind stays exact and read-only, so a build before this one keeps a tap record exact and keeps every other task open.

Choice tasks here are 317's `choice` kind with its existing optional `after` and `changes` fields. The shorter-version and fix tasks cannot preview with `after`, because the chosen text replaces part of the draft instead of starting the next paragraph. Their previews come from a frozen `preview` map, `{[choiceId]: text}`, an optional field added to the choice source, each string within 317's 4000-code-point limit. When present it must be complete: exactly one entry for each of the record's own choice ids, and no other keys. A source with `preview` must not also have `after`. Before a choice is made, the preview shows the draft as given (the source parts, unchanged). After a choice, it shows that choice's entry. **Hear this task** reads the preview as it is shown, the same way it reads a join's assembled paragraph. Do not tighten `validWritingSource` on `feedback.different` keys. A retained source may hold bounded `feedback.different` entries whose keys match none of its choice or tappable ids, as it may today. The reader keeps them verbatim and never selects them, because no work can choose that key. Its existing type and size bounds stay as they are. Instead, the source gate checks the authored bank. For each of the nine new sources, the `feedback.different` keys must be exactly the source's own non-key choice ids (choice tasks) or its non-key tappable part ids (tap tasks): every one has a line, and there are no other keys.

Records rise from 15 to 24, inside 317's 64-record bound. Verify `prepareProgressImport` accepts a notebook holding all 24 records at their maximum retained checks before shipping.

## Integration and authoring surfaces

Extend `dist/writing-table-content.mjs` (nine sources, the bench id `holding`, teach cards 5 to 8), `dist/writing-table-core.mjs` (the `tap` kind in validation, empty work, Check and the assembled preview; the choice `preview` map), `dist/writing-table-ui.mjs` (the third bench button, the bench whitelist in its local view, tap rendering and **Clear my taps**) and `dist/writing-table.css`. No change to `app.mjs` routes, `progress-transfer.mjs` roots or other games. Add the new bench to the README's Writing Table entry. No roadmap, atlas or coverage edit while their reservation is held; the release receipt says this slice adds bench (c) and set C only. Recheck current custody before any runtime edit.

## Sources and overlap

Jane `LESSONS.md` at `e88f81a00553fb87818ef84c77a8800f0dcb33e4` and Marble `data/topics.json` at `5e23196fa60050433f1440057f65a978d39e63fc`, as in 317. Marble's Paragraph Cohesion (`mt_hjtbA3g-Nn`) lists the three moves this bench practices (on the other hand and as a consequence, ellipsis, repeated key words and synonyms); its `research` is null, so it is a curriculum reference, not validation. Its two hard prerequisites are Cohesion within paragraphs (`mt_4-vfMgmCVB`), which tasks 1 to 3 and C1 practice inline, and Linking paragraphs with adverbials (`mt_uvILgZq9HN`), which 317 built. Its dependent, Cohesion and Transitions Across Writing (`mt_tn1rY9GbEZ`), stays unbuilt. No taxonomy, coverage or vendored-pin change.

The knowledge claims are 277's audited cohesion section: the DfE glossary's cohesion, reference and ellipsis entries and Appendix 2 Years 4 and 6. Nothing here is new to that audit. Overlap: 269 owns joining clauses inside a sentence, and C4's ellipsis is the Year 6 cohesion device, not sentence combining. 317 owns time, place and number signposts; this bench's openers show meaning (contrast, result, addition) and do not repeat 317's.

## Acceptance

1. Pure tests for each of the nine tasks: every key, every choice and tappable word's feedback, the incomplete, different and fit outcomes for tap tasks (including all keys plus one extra, and a strict subset), untimed order of taps, the missing line naming no word, choice previews exact, and supported and guided flags. A historical tap source with a different tappable set or key stays correct under its own rule.
2. Native browser journeys at 320×600, 820×1000 and 1024×768: real taps toggle and clear, pressed state and marker visible, 44px targets in wrapped text, no horizontal overflow, the third bench reachable from the selector and from Next, all twenty-four tasks reachable, keyboard and screen-reader names for tappable words. Inspect rendered boards, not only source.
3. Real save and reload, a notebook with all 24 records, Notes download, import, reset and save-off, an older-build-style record of unknown kind kept exact, and a forced preflight refusal that leaves work unchanged. An older choice record whose source has a bounded `feedback.different` entry under a key that is not one of its choice ids (for example `earlierUnused`) stays readable, open and checkable with its ordinary outcomes and feedback. It survives a real Notes download and import with its source, work and checks unchanged, the unused entry included. 317's fifteen-task regressions stay green.
4. Existing source gate and affected Writing Table, Desk and Notes regressions. Independent review of the exact candidate, then the repository's landing procedure. Physical iPad, audible speech and VoiceOver remain unqualified until checked.
