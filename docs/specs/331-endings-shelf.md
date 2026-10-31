# 331 · The Endings Shelf

Draft 2026-10-31 against main `bb7979a3e95fe332667288205d1d5d9d7e0187a9`. **Specification, not implementation or release proof.** Bounded text-only slice of [268](268-old-keepers-spellings.md), serving LG-10 / LG-G1. [Finite commission](../content/331-endings-shelf-text.md); [source audit](../source-audits/331-endings-shelf.md). Independent exact-head clearance belongs in the owning PR.

## Purpose and boundary

Help the librarian check a newly written letter to Vadoalto's library. Choose endings for seven words, turn four word-pair cards, read six teaching cards with worked examples, and try supported jobs B1–B6. Contrast useful family/letter clues with words and exceptions that need remembering or a dictionary. This is supplied written-spelling practice, not independent spelling, pronunciation, vocabulary placement or a full suffix curriculum.

Commission268 scene2, bench(b), cards5–10 and setB only, with the explicit331 amendments. No Beat Bench, Pip's Copy, word-list shelf, long-word workshop, new generated words, audio assets, microphone, films, chapter adapter, Keeper's page edit or automatic delivery. No score, timer, age or mastery gate. All three views and all six jobs are directly available, without completing Stained Map. A fit has no story or shared-skill effect. Brief55's audio gate is unchanged.

## Entry and visual interaction

Exact open route **`#library/endings`**, page title **The Endings Shelf**. Add a labelled Word Garden entry and links between this page, Stained Map and Word Garden; no Library hub or unbuilt sibling links. The librarian's letter is newly written, not a copy of the old Keeper's Pages. It works at every story arrival without revealing or changing one.

Three plain table controls: **Check the letter**, **Turn a word pair**, **Try a job**. One table is current; switching preserves its draft and local selected gap/card. Use an original library desk/letter-and-envelope illustration, not a wall of navigation cards. At tablet width, the letter sits beside the selected word, its written clue and its two ending tiles. On a phone, the selected word/clue/tray comes first, with a compact letter and native gap picker available. Previous/Next and the picker reach every retained readable gap. Every selected ending remains visible in the full letter and a text list. Null and an actual selected ending have distinct text; no color-only state.

Use native tap/keyboard controls,44px targets,16px text, visible focus, reduced motion and no horizontal page overflow at320/820/1024. Keep focus on the selected tile/part after a change. Put back focuses the gap picker or answer control after disabling its own empty action. At the ends of a worked example, focus falls back to its visible container rather than body. Check can focus its result, Keep its status. Import, reset and owner changes reset local selection/reading/teaching state; ordinary same-owner table returns retain it. Do not force reading the story before play.

## The letter and its four trays

The finite companion supplies the full text, seven gap addresses, literal prefixes, intended complete words, per-gap written clues, and frozen keys. A gap uses just its own two-choice tray: cious/tious, cial/tial, ant/ent or able/ible, in the supplied order. Trays are reusable; this is choosing an ending, not consuming materials. Changing a gap never edits another. **Put back** clears only that response.

Render an unanswered word as its saved prefix plus **[ending]**, not a guessed number of missing letters. A chosen ending is appended literally, including an unfitting trial. Do not replace it with the intended complete word. In particular `pre + tious` displays `pretious`, not `precious`; `offi + tial` displays `offitial`. Do not call a trial a nonexistent word in every language; the check compares it with this English letter's saved note. Selection-only navigation neither checks nor changes the earlier-check flag.

**Check this version** covers all readable retained gaps. Outcome is `incomplete` if any has no response, otherwise `different` if any differs from its frozen key, otherwise `fit`. Null gaps get only the aggregate incomplete notice. Each answered mismatch gets its source-owned line, prefixed by its gap's original prefix-plus-[ending] form, in retained source order. Complete fitting work gets the finite fit line. A partially unreadable source is flagged beside the work; never announce that the whole letter is ready if some source gap is unavailable. A source may have a different valid number/order of gaps from today's seven.

**Keep this version** accepts incomplete, different and unchecked work. Keep first/latest versions, inspect them separately, and reopen either as a working copy without altering the snapshots or checks. A keep includes only the latest readable check whose work matches that copy; otherwise it is unchecked. No automatic correction, check eviction or invented delivery receipt.

## Word pairs, teaching and supported jobs

Four teaching pairs in source order: observant/observance, innocent/innocence, reasonable/reasonably, visible/visibly. Each card starts with its saved front word; Turn shows its saved back word, Turn back reverses it. This is supplied teaching, not a question or a recorded correct response. Its local side survives same-owner view changes but creates no check or attainment. Use the finite ordinary-prose caption for narration, not an arrow glyph. The Latin-linked English/Spanish/French visible note is an optional fact, not pronunciation or foreign-language assessment.

Cards5–10 are available throughout the letter/pairs views and in the designated job's example. Show one worked step per explicit tap, reversible and foldable. Use the amended cards and exact steps in the companion; don't expand letter clues into universal spelling rules. Explain usual, likely and exception honestly. No runtime dictionary API or model-generated feedback is needed.

Offer B1–B6 in source order; each is a native three-choice job with its saved prompt, choices/order, key, hint, steps, feedback and explanation. B1's three current-target guided steps are visible before answering. B4's soft-c premise is visible beside its prompt. The fitting positions are B,A,C,B,A,C; preserve them on resume. An empty check shows only the incomplete line. A different choice shows its source-owned feedback, or the finite neutral fallback, then the explanation once; a fit shows the explanation once. No check changes the response. These are all `supported:true,guided:true`, even when the later hint/example flags are false.

Optional **A hint**, **Show an example**, **Skip for now** follow Jane's help shape. Hint shows the authored hint. Example shows the designated card's full ordinary text and its first worked step, with next/previous controls, not only the example's title. Skip opens the next readable job and preserves all current work; wrap when necessary, and refuse safely when none is readable. Job first/latest keeps, earlier-check detection and reopen semantics match the letter; help flags are ORed on reopen so later requested help never disappears.

## Narration and shared reading

A grown-up can read together. Optional local narration uses the existing speech preference and playback controls; no new recording or isolated phoneme player. Read only the explicitly marked, visible story, written clue, teaching and prompt prose. Never concatenate response tiles/choice labels, current trial answers, answer lists or saved work into the speech string. The letter narration is assembled from its retained fixed text segments with every gap spoken as **a missing ending**, irrespective of the current selection; it must not complete the word. Full-letter reading is optional and separate from the current prompt. Work-pair narration uses its own supplied prose only after the card is turned. Reading an answer clue is support, never independent evidence.

Stop narration on route/owner change, redraw, reset/import or film. Capture guards before the shared speech binder runs, so a stale, hidden or film-blocked narration control cannot speak for either owner. No listening or spoken-response claim is stored.

## Source and saved-work contract

Use a new optional explorer root **`endingsShelf`**. **Do not extend or write `spellings`.** Stained Map330 already owns that deployed v1 root and requires its own collection; creating a source-less spellings root from an Endings-first visit would prevent a later Stained Map start. Separate ownership is the smallest way to keep either entry order and unsupported roots independent. This supersedes268's undeployed all-benches sketch for this slice. No migration, regrading or general spelling framework.

```
endingsShelf:{v:1,source,view:'letter'|'pairs'|'practice',currentId:null|jobId,
 letter?:{work:{placements:{[gapId]:null|endingId}},checks:[check],
          firstKept:null|keep,latestKept:null|keep},
 items:{[jobId]:{source,work:{choice:null|choiceId},help:{hint:bool,example:bool},
                checks:[check],firstKept:null|keep,latestKept:null|keep}}}
check:{work,help?:{hint,example},outcome:'incomplete'|'different'|'fit',
       feedback:[text],supported:true,guided:true}
keep:{work,help?:{hint,example},check:null|check}
```

Freeze the entire collection on the first **explicit table or job selection**, not arrival/render/story read/Notes. Create the letter draft only on explicit letter opening; create a job record only on explicit job selection, freezing its own source from that retained collection. Pairs can open without creating a letter/job draft. Never merge today's catalog into a saved collection or silently fill a missing source. A missing draft may be created only on explicit open from its own readable source. Current selection, flipped side, unfolded teaching steps and short/longer reading are local view state.

Collection source schema:

- `{format:1,id,story:{hook,short:[text],longer:[text]},letter:{id,segments:[segment],gaps:[gap],trays:[tray]},pairs:[pair],cards:[card],jobs:[job],copy:{...finite named strings}}`.
- `segment` is exactly one of `{text}` or `{gapId}`. Gap references resolve only within this retained letter; no current-catalog fallback. The commissioned letter uses each gap once, but validators do not require today's seven. Malformed or ambiguous references disable that letter source, not the jobs/pairs/other destinations.
- `gap:{id,prefix,complete,trayId,key:endingId,note,different}`. `tray:{id,choices:[{id,text}]}`; a gap's response must belong to its own tray. Pair endpoints are `{id,front,back,spoken}`; `spoken` is the finite caption. `card:{id,title,text,example,steps:[text]}`.
- `job` uses the existing Stained Map/Market Signs vocabulary: `{v:1,id,kind:'choice',title,prompt,hint,example,explanation,steps:[text],teach:[card],parts:[{id,text}],choices:[{id,text}],key:choiceId,different:{[choiceId]:text},copy:{incomplete,partDifferent}}`. B4's premise is a visible part. Each job's designated teach card is retained with it; present any parts before responses, as331 requires. Existing exported pure job validators/results may be reused where they match this contract, without a cross-game state mutation or a new engine.

Require unique nonempty ASCII ids up to80 characters (letters/digits/hyphens/underscores, exclude unsafe object keys), source text strings up to4000 characters, up to64 entries per source list and a96KiB source envelope, as330. Derived saved feedback can concatenate a label and source message: allow up to128 feedback lines of up to16000 characters, within the real shared notebook bound. Do not reject a valid64-gap check merely because it also has an aggregate line. Use own-property lookups so inherited methods cannot become responses, feedback or step counts. Count duplicate addresses before filtering malformed bodies and omit all ambiguous candidates; preserve the raw originals. Validate retained source membership/shape and recorded outcomes without recomputing historical correctness against today's key/text. Store check feedback and choice order with their own source. Unknown fields remain raw and unchanged.

Isolate malformed fields: unreadable collection sections don't block independently frozen readable jobs; an unreadable letter/work/checks collection disables only its own actions; unreadable first keep does not disable a readable working copy or replacing readable/missing latest keep. Omitted source rows and unreadable checks receive a notice. Keep/display use the same latest readable matching check. Unsupported endingsShelf versions stay raw/read-only with a Notes link and leave Stained Map open. A source cannot be reconstructed merely from its id. No hard-coded seven-gap/six-job validator, no auto-eviction, no rewriting earlier history after a wording fix.

Every growing mutation clones the entire notebook, validates the owned proposal, runs `recoveryFitsProgressLimits` plus actual `prepareProgressImport(JSON.stringify(notesReport(candidate),null,2))` through a **required** `canExport` callback, captures the proposed endingsShelf before handing the disposable clone to that callback, then commits only endingsShelf. Missing/false/throwing preflight refuses atomically across every root. The real notebook/export byte/node/depth limit is the capacity gate, not an arbitrary check count. Save-off stays in memory and in actual Notes downloads. Display normal host save-off/conflict/failure notices next to the activity, including after a page-changing action, without carrying a status to another page.

Binders capture notebook, owner, endingsShelf root, route, current record/material and connected visible controls. Changed/imported/reset notebooks, stale callbacks, CSS-hidden or closed-panel controls, explorer chooser and open films cannot write or speak. A refused write neither changes the previous work nor creates a root. Render/Notes lookups are read-only. No identifying learner text, name, age, grade, school, voice, recording or device identity is introduced.

## Integration, curriculum and evidence boundary

New scoped content/core/UI/CSS modules and exact-route early return. Reuse ExplorerStore, real Notes export/import, existing local speech and header/film guards. Register #library/endings in startup initialization exemption, owner/chooser restoration, welcome-film exclusion, focus and reset/import lifecycle. Add Notes destination summary and started/kept/incomplete/help distinctions; the actual download retains raw endingsShelf. An encounter-only atlas entry may name read/build patterns; do not add a topic-coverage claim or repin the taxonomy.

**Upstream study refreshed2026-10-31:** Jane `e88f81a00553fb87818ef84c77a8800f0dcb33e4`, actual LESSONS teaching/guided/misconception help; Marble `5e23196fa60050433f1440057f65a978d39e63fc`, actual topics, dependencies and research. Jane is a design reference only: no code, prose, boss, medal, level or mastery gate is imported. Marble's target research records are absent; do not imply a supplied English teaching brief. The audit records primary spelling/dictionary checks and the corrections to overbroad source evidence.

Candidate topics **Suffixes (age9+) `mt_2X9Cd38eSJ`** and **Spelling -able & -ible `mt_9hBs430cU4`**, strand **E1-III**. These labels are upstream metadata, not learner gates. Both hard-prerequisite edges point to **Suffixes (age7+) `mt_tHtjfjjFrl`**. That broader prerequisite remains a gap: the letter clues and cards offer narrow inline support, not its -ation/-ly/-ous and sound-spelling curriculum. No complete target/prerequisite or independent spelling attainment is claimed. Card9's keep-e example and card10's adverb change are supplied teaching; dropping e generally and all exceptions remain unobserved.

Spec49 §5 encounter: target = use supplied ending/family/letter clues; teaching = cards5–10 with stepwise worked cases; contrast = the four paired endings plus remembering exceptions; supported practice = seven letter gaps and B1–B6; new use = different letter words, jobs and flipped pairs; purposeful revisit = reread/reopen first/latest versions in a practical correspondence task; evidence = finite supplied responses/support, not independent writing. Place it in spec49 ActIII connection/transfer, E1-III, and spec120 ActIII chapter4's letters up/down the river. The letter creates no chapter contribution or delivery receipt. No culmination film is commissioned.

## Acceptance before build/release

Before build: inspect primary-source support for the commissioned generalizations and the visible note; review amended finite text/keys, six distinct spec-review lenses and independent exact-head Claude clearance. Resolve findings in the spec, not with uncommissioned builder copy. Existing audio owner gates remain.

Pure oracles: exact prefixes, tray order and literal unfitting strings; all seven gaps × both endings × null, whole-letter precedence/source-order feedback, source-only key changes and history not regraded; all six job keys/positions/parts and empty-check behavior; actual designated worked example steps; first/latest/unchecked/incomplete/reopen/help OR; changed valid counts/order; ambiguous/partial/unsupported sources; inherited-property ids; read-only views; real Notes import preparation and exact capacity refusal, missing/throwing/callback-mutating preflight; every unrelated root, including spellings, unchanged in both first-entry orders.

Native journeys at320/820/1024: letter gap change/repair/clear and all four trays; visible full-letter selections and readable clue; four pair flips without skill claims; all six jobs including visible B4 premise; actual example ladder and skip; keyboard focus after selection, clear and both step endpoints; narration excludes tiles/trials/choices and speaks only frozen gap placeholders; first/latest inspection/reopen; two explorers, reset/import/reload, actual Notes download/import, save-off/failure/refusal, hidden/stale/film controls; unsupported one root leaves the other spelling game open. Inspect the original letter artwork and reading panels. Automated checks do not qualify physical iPad/Safari, audible quality, VoiceOver or learning.
