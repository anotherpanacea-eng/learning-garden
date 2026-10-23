# 110 — Write what remains

**Status: specification candidate; independent spec, mathematics, content and rendered static-art review required before runtime build.** Base: main `c022b060` (includes reviewed Join writing turn 107). [Source/overlap audit](../source-audits/110-write-what-remains.md). Original static design frames: [320 opened](assets/110-remains-opened-320.svg), [320 finished](assets/110-remains-finished-320.svg), [820 opened](assets/110-remains-opened-820.svg), [820 finished](assets/110-remains-finished-820.svg), [320 no-exchange](assets/110-remains-steady-320.svg), [820 no-exchange](assets/110-remains-steady-820.svg). These drawings are proposals, not browser/runtime verification.

## One supplied strategy, beside the old return

Add **“Write what this returning picture means”** inside a started Returning Supply Orders case, leading to `#numbers/return/ledger`. The page heading is **“Write what remains”**. It uses the existing frozen version 1 `return-12` / `return-17` source for 42−12 and 42−17, and a fresh transient picture. It does not reinterpret the saved working arrangement as a learner's written method. **“Return to the returning table”** goes to `#numbers/return` with its model, raw number, checks, support, familiar flag and Keep intact. The notice is **“This fresh writing picture starts again when you leave. Your returning table stays as you left it.”**

This is **one supplied ones-first strategy**, explicitly named on the page. Other mathematically valid orders and regroupings remain possible in the original Returning table. This small guided companion supplies group counts and digits; it does not collect a typed answer, independent calculation, handwriting, strategy choice or an explanation. No new saved root/version, history, score, notes section, atlas mapping, reward or access prerequisite. Both Picture and Write are open immediately; Picture starts selected. There is one current 42-counter picture, using two visibly separate trays, in either turn. Write keeps that same countable picture beside or above the notation. Switching turns changes no mathematical state.

A direct entry without an active readable source shows **“Choose a return”**, **“42 − 12”**, **“42 − 17”**, **“Either return can be opened.”** and **“Start this writing picture”**. No counter picture, group breakdown, worked result or help example appears before Start. A readable active source opens its own fresh picture after the source-exposure preflight below. A readable inactive root may contain older cases: choosing one uses its existing frozen source read-only, without calling `startReturning` on that existing case (that function marks it familiar). A new case is frozen using `startReturning` on a whole-notebook candidate. The old case's own model/raw/checks/support/Keep/familiar fields never change. Temporary selected case ID is allowed; it is not persisted or used to change `root.active` for an already existing case. The original table's case picker stays the place to change its active working case.

The source strip says **“Start: 42 counters. Return: 12 [or 17].”** A native **“Read the original return request”** disclosure shows the selected frozen `source.text.prompt` verbatim, escaped. Its current text is “Pip starts with 42 pretend seed counters. Return 12 [or 17] to the store tray. How many remain on Pip's table?” No current catalog wording silently replaces a historical source. Existing unsupported/future/raw roots use their current read-only recovery/notes path, with no ledger picture and no automatic fresh source.

## Exact finite mathematics

Every pictured mark belongs to exactly one of **Pip's table** and **Store tray**. Every wrapped ten encloses ten countable marks; the wrapper is not an extra counter. Opening a ten removes one wrapper and exposes those same ten on the table. Transferring a group moves its marks to Store; there is never a second source or target collection. The 12/17 request and written group counts are labels, not extra counters. Use tray labels and distinct table/store outlines or patterns as well as color. All 42 constituent marks remain countable across both trays at every step.

| Case and stage | Table: wrapped tens, loose ones | Store: wrapped tens, loose ones | Meaning |
| --- | --- | --- | --- |
| Either, source |4,2|0,0|42 on the table; nothing returned. |
| `return-17`, opened |3,12|0,0|Same 42, a different grouping. No subtraction yet. |
| `return-12`, ones returned |4,0|0,2|Two original loose ones moved to Store. |
| `return-17`, ones returned |3,5|0,7|Seven loose ones moved to Store after opening. |
| `return-12`, all returned |3,0|1,2|Exactly 12 returned;30 remain. |
| `return-17`, all returned |2,5|1,7|Exactly 17 returned;25 remain. |

The current-picture readout reports group counts for each tray and **“Together: 42 counters.”** Its purpose is to connect grouping and places, so it does not print intermediate table numerals 40/35. The digits/column counts already describe those groups. This is a display choice, not a claim that those totals are unsuitable: if a later implementation adds a full numeral beside a canonical grouping, the exact existing allowed exposure and atomic preflight must follow that actual display. Never emit `bundle:0:3:12`, nor normalize three tens/twelve ones into a newly shown canonical 4:2 example.

The Write turn contains fixed **Tens** and **Ones** columns, with two visibly different sections:

- **Working groups before returning**: row **“Use”** is 4|2 initially and throughout the no-exchange case; in the exchange case it becomes 3|12 only after Open. Row **“− Return”** is 1|2 or 1|7, with the subtraction sign in the row label. These are **group counts**, not two-digit numbers. The visible label is **“Group counts; 12 here means twelve loose ones.”** only when 12 is present. A plain line explains **“The same 42 can be 3 tens and 12 ones.”** The layout must not concatenate 3 and 12 as 312 or imply the original request changed. The row describes the prepared groups *before* the returning moves, even after those moves; a label with “before returning” remains visible. At source 17, the row 4|2 is not a valid completed column subtraction; the nearby line is **“Two loose ones are not enough to return seven. Open one table ten in Picture.”** No negative or result digit is supplied then.
- **Digits left on the table**: a ruled result row starts blank in both cells. Only supplied ones digit 0/5 and tens digit 3/2 can be placed there from the current picture. No 12 appears in a result digit cell. Once both digits are present, show **“Supplied writing: 42 − 12 = 30.”** or **“Supplied writing: 42 − 17 = 25.”**, with ordinary readable spaces. This is model writing, not a recorded learner answer.

The 3|12 row is a deliberately expanded group-count bridge, not a claim to teach the full conventional crossing-out algorithm. It makes `12−7=5` and `3−1=2` visible while the original 42 remains the source. For 12, `2−2=0` and `4−1=3`. All source/use/return/result columns stay fixed at 320 and 820; the long group-count label sits outside cells. The screen-reader description says both trays' current group counts, the before-return working counts, whether a ten was opened, and which result digits are blank. Do not use color or a tiny superscript alone to explain the exchange.

## Transient actions and undo

The temporary state is `{caseId,stage:source|opened|ones-returned|returned,onesPlaced,tensPlaced,turn:picture|write}`, owned by the current explorer and frozen source. Initially `source,false,false,picture`. The no-exchange case cannot enter `opened`. Derived tray counts are exactly the table above; no separate mutable counter arrays or saved action log are needed.

| Action | Enabled precondition | Exact change / reverse boundary |
| --- | --- | --- |
| **Open one table ten** |17, source, both digits blank|source→opened;4t 2→3t 12 on the table. Nothing enters Store. |
| **Close those ten ones again** |17, opened, both digits blank|opened→source; those same ten loose marks become one table ten. |
| **Return the two loose ones** / **Return the seven loose ones** |12 source /17 opened, digits blank|→ones-returned; move the specified 2/7 marks from Table to Store in one supplied step. |
| **Bring those ones back** |ones-returned, both digits blank|→source for 12 /opened for 17. The returned ten must be brought back first if present. |
| **Return one table ten** |ones-returned|→returned, moving one existing ten to Store; ones digit may stay placed because its count has not changed. Preflight the newly visible completed Store grouping before display. |
| **Bring that ten back** |returned, tens digit blank|→ones-returned; ones digit may stay placed. |
| **Place the ones digit from this picture** |ones-returned or returned; ones blank|onesPlaced=true, displaying 0 or 5. |
| **Lift the ones digit** |onesPlaced, tens blank|onesPlaced=false. |
| **Place the tens digit from this picture** |returned, ones placed, tens blank|preflight the newly visible complete remainder, then tensPlaced=true, displaying 3 or 2 and the supplied equality. |
| **Lift the tens digit** |tensPlaced|tensPlaced=false; hide the complete supplied equality. |

Picture owns the grouping/transfer controls; Write owns place/lift controls. Turn buttons stay available. No automatic Open/Return/Place, typed parser, forced correct-response gate or scoring. An unavailable action is disabled with a nearby explanation; a stale or refused action changes no transient or saved state. After a successful action focus its enabled inverse, or the current turn heading if that inverse lives in the other turn. Switching turns focuses that turn heading. Result digits cannot survive an undo that changes their meaning: bring back the ten only after lifting tens; bring back ones only after bringing back the ten and lifting ones; Close only after all returned counters and writing have been undone. A full reverse always reaches the original 42.

## Exact original caption and speech copy

Use the current row below beside the picture and for **Hear this step**. A visible completed supplied equation may be appended to speech; no other hidden step, request help example or earlier state is spoken. Place-value 12 is spoken as twelve loose ones, never a single ones digit. The captions are original teaching copy.

| State |12 caption |17 caption |
| --- | --- | --- |
| Source |“Four tens and two ones are on Pip's table. The store tray is empty. This strategy returns the ones first.”|“Four tens and two ones are on Pip's table. Two loose ones are not enough to return seven. Open one ten without returning anything.”|
| Opened |Not available.|“Three tens and twelve ones are still 42 on the table. Opening changed the grouping. Nothing went to the store tray.”|
| Ones returned, ones blank |“Two ones went to the store tray. No loose ones remain on the table. The four tens are still there.”|“Seven ones went to the store tray. Five loose ones and three tens remain on the table.”|
| Ones returned, ones placed |“Zero goes under ones because no loose ones remain. The return of one ten is still to come.”|“Five goes under ones because five loose ones remain. The return of one ten is still to come.”|
| Returned, ones blank |“One ten and two ones are in the store tray. Three tens and no loose ones remain on the table.”|“One ten and seven ones are in the store tray. Two tens and five loose ones remain on the table.”|
| Returned, only ones placed |“The zero under ones matches the empty loose-ones place. Three tens remain to write.”|“The five under ones matches the five loose ones. Two tens remain to write.”|
| Both placed |“Four tens minus the returned ten leaves three tens. The table's three tens and zero ones read 30. Together with the store tray, all 42 counters are still here.”|“After opening, three tens were available. One ten went to the store tray. Two tens and five ones remain: 25. Both trays still account for all 42.”|

The optional final discussion is **“What stayed the same when a ten opened? What changed when counters moved to the store tray?”**, with no collected response. For 12 substitute **“Why could these two ones be returned without opening a ten?”** The fresh-picture notice and original-request disclosure remain reachable in both turns.

Local speech reuses `hearButton`/`bindSpeech`. Render/turn/route/explorer changes stop old speech. As established in reviewed 107, each local Hear node needs a capture guard for connected scope, exact route, current explorer and source identity before the shared listener; obsolete Hear, turn and action nodes cannot act after rerender/import/explorer change. No global speech rewrite. No support/narrationRequested flag is written by this transient companion.

## Exposure and actual-file transaction

Reuse only `returningOrders.shownBundleExamples`, `noteReturningExamples` and `noteBundleDisplay(candidate,[])` with **no live argument**. Hash navigation parks a generated broad question in the notebook and clears external `active` before the ledger renders. A newly displayed complete canonical number-and-constituent-picture can make a matching waiting/future bundle question familiar; it cannot rewrite attempts, raw answers, checks, support or independent observations. Keep `retainedRaw`/unknown-history qualification unchanged. No multiplication fact or general subtraction result is inferred.

The finite source-owned signatures, all already in `knownReturningSignatures`, are:

| Actual display | Signature and disclosure moment |
| --- | --- |
| Initial four tens/two ones, with source 42 |`bundle:0:4:2`, on successful source entry/Start. |
| Complete Store tray one ten/two or seven ones, with actual requested 12/17 |`bundle:0:1:2` / `bundle:0:1:7`, when Return one ten completes the tray. The numeric request or written 1|2/7 row **alone** is not another pictured supply and emits none. |
| Canonical Table three tens/zero ones or two tens/five ones, with supplied full writing 30/25 |`bundle:0:3:0` / `bundle:0:2:5`, only when both result digits and full supplied writing are visible. Group counts with no full numeral do not emit this early. |

Before **any new such disclosure**, clone the whole notebook, apply only the proposed source creation/selection if necessary and exact display signatures, sync matching waiting Broad familiarity through the existing bridge, and check **`prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok`** using the actual app wrapper. Include all wrapper overhead, UTF-8 bytes, retained raw/depth and any matching draft flag growth; a helper's internal root-only limit is insufficient. Only on success commit the candidate Returning root and Broad familiarity, then the proposed transient stage/turn/digits and visible page; save if enabled. The source-creating Start must never call old Returning Start on live state before preflight. A new source is frozen through the existing `startReturning` on the candidate; an existing case is read without its familiarity-changing Start. Commit no unrelated roots. If signatures are already recorded, no new exposure write is needed, but the current visible speech/control guard still applies.

If initial route entry with a readable source cannot record the required 42 exposure, render a source-free refusal page under the ledger route: the page heading, the exact notice below, **“Grown-up notes”** (`#notes`) and **“Return to the returning table”** (`#numbers/return`) links. Focus the notice and preserve the entire original notebook. Show no new counter picture, working-group row, result or blocked caption; do not retain another route’s UI under the ledger hash.

For an **in-visit** Start, Store-completion or final-digit refusal, preserve the entire original notebook, missing root if absent, case selection, current transient stage/turn/digits and current DOM. Show and focus **“This notebook is too large or complex to show another complete picture safely. Your work is unchanged. Download notes, or use a separate explorer.”**, with a real `#notes` link. The initial source-free refusal page uses this same exact notice. A refused direct Start stays numeric-only; a refused completed Store transfer keeps its ten on Table; a refused final writing leaves tens blank. Do not flash then hide a source/tray/result or expose its blocked caption to speech. Save-off permits successful in-memory disclosure; capacity refusal, not persistence preference, is the stopping condition. The old `#numbers/return` flow retains its existing behavior.

The new route must precede generic Returning dispatch and be excluded from old Returning bind/exposure/help and the general Number Garden invitations. Reset temporary state on route departure, same-route restart, source/case change, chooser/explorer change, import, reset and reload. Preserve parent/explorer UI and ordinary notes/export behavior; do not add this temporary state to downloads or notebooks. Valid raw roots remain exportable; no recovery normalization occurs from opening this route.

## Layout and acceptance gate

Reuse the Garden/107 paper and forest vocabulary: forest `#183f39`, paper `#fffdf5`, pale leaf `#eef5e9`, table green `#7d987d`, store blue `#4f748f`, and ochre `#9a6d18` for the group-count note/focus. Georgia headings and native/Trebuchet body controls. The distinct element is the two-tray conservation picture next to **before-returning group counts** and **digits left**, not a copied quiz or extra target tokens. At 820: `[current Table + Store | working counts / result digits / controls]`; at 320: stack those same sections. Left align labels; fixed place columns, legible countable marks,16px body and 44px native button/summary/link targets, visible focus, text labels independent of color and no page overflow. No external font, animation, illustration service, dragging or graph framework. The static SVG art is original vector drawing; its tokens/labels must agree with this state table. It is not an HTML/browser preview or a workaround for any atlas preview restriction.

Before build, independent six-lens specification review plus substantive math/content/static-art inspection must settle any discrepancy. Root owns review and later build authorization; no author self-clearance. Later implementation requires its own exact-head review and actual browser checks:

- Exhaust both cases' reachable states, turns and inverses; assert all 42 marks across trays, no duplicate wrapper supply, exact table/store counts, before-return working rows and result digit alignment. Explicitly distinguish opening from return; inspect 12 in group counts versus an invalid result digit 12, no negative supplied answer, and no final equality surviving an undo.
- Verify fresh direct chooser, existing active source, readable inactive root with an older existing case, absent root, raw/future/null roots, retained recovery and changed-current-wording with an older frozen source. Old Returning partially moved model, incorrect checks, raw draft, Keep, support/familiarity and sibling roots stay unchanged except the bounded actual display list and genuinely matching Broad familiarity. No root/version/notes section is added.
- Test exact source 42/Store 12/17/result 30/25 disclosure, no target signature from a numeric chooser or count row without the matching tray picture, no 3:12 or unseen/intermediate signature. Park matching and unrelated generated Broad drafts; only matching familiarity may rise, attempts/answers unchanged. Near-cap actual pretty-report refusals at initial source, direct Start, completing the Store tray and final writing must preserve each original DOM/turn/state/root absence and not speak the blocked caption. Download/reimport the actual notes file; test UTF-8/depth and save-off success.
- At 320/820, both turns from source, Open/Close, both returns and their reverses, place/lift, keyboard/focus/touch, labels and countable compact picture, source disclosure, narration with/without a local voice, retained obsolete Hear/action nodes, route/explorer/import/reset/reload and returning to unchanged old work. Run existing Returning, Join writing, exposure, speech, transfer/recovery checks and both actual app routes together. Static frames do not establish those behaviors, physical-device compatibility, audible quality, learning attainment or hosted deployment.
