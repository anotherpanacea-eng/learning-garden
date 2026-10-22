# 81. Tenths Table

Status: **bounded specification awaiting independent review**. No implementation is authorized by this document before that review. The [source audit](../source-audits/81-tenths-table.md) records current upstream and primary curriculum references. This is one M3-II / M3-fractions9 foothold connecting tenths with decimal notation, with M1-number10 as a secondary connection. It is not full decimal, division, ratio or curriculum coverage.

## One whole, two names

At `#numbers/tenths`, the workshop needs labels for imaginary repair strips. One bracketed rectangle is **one whole standard repair strip**. Its ten equal spaces stay the same size. The learner can select or clear any space, check an amount, ask for help, keep an unfinished attempt, switch requests or leave. No timer, stock, reward, unlock or learner level is involved. Link openly from Number Garden and Fraction Trail; both remain independently usable.

The contrast is explicit: **“At Bundle Exchange, ten ones make ten. Here, ten tenths make one whole. Our whole strip stays the same size.”** Reuse reversible tapping, scoped help and saved-work patterns, not the existing 12-tick Fraction Trail or whole-counter models. A tenth is an equal part of the strip, not one of ten unrelated objects. There is no drag-only control.

An initial chooser names the requests below but shows no completed equivalence. Viewing the route allocates no `tenthsTable` root. Start is an explicit action. Every case is open and can be resumed; there is no sequence prerequisite. Show only one work panel at a time: request, fixed-whole board, immediate next action. Help and earlier work are native folds. Choices and progress remain when a fold closes.

## Complete finite first pack

All eight sources use `wholeId='repair-strip-one'`, `partCount=10`, source version 1 and the same mathematical whole. Request text is original supplied content.

| Stable ID | Title | Exact request | Target tenths | Form |
|---|---|---|---:|---|
| `one-fraction` | One little part | “Make 1/10 of this whole repair strip.” | 1 | fraction |
| `four-fraction` | Four tenths | “Make 4/10 of this whole repair strip.” | 4 | fraction |
| `four-decimal` | A second name | “Make 0.4 of this whole repair strip.” | 4 | decimal |
| `seven-decimal` | Seven tenths in decimal writing | “Make 0.7 of this whole repair strip.” | 7 | decimal |
| `whole-fraction` | All ten parts | “Make 10/10 of this whole repair strip.” | 10 | fraction |
| `whole-decimal` | One whole in decimal writing | “Make 1.0 of this whole repair strip.” | 10 | decimal |
| `zero-fraction` | No strip selected | “Make 0/10 of this whole repair strip.” | 0 | fraction |
| `zero-decimal` | Zero in decimal writing | “Make 0.0 of this whole repair strip.” | 0 | decimal |

Chooser order interleaves forms as above; the two four-tenths requests share a target and make changed notation the contrast. No case is called easier. Keep a saved request's wording/form unchanged after content edits. Mathematical identities are stable; changing the target or whole requires a new source ID/version.

## Actual learner action and feedback

The board is one rectangular strip divided into **two rows of five equal, touching cells**, all inside one clearly labeled outer border/bracket. Both rows together are the one whole, not two separate strips. Keep this same arrangement at phone and tablet widths. A persistent label says **“One whole repair strip; ten equal parts across both rows.”** Each cell is a native button at least 44px square, named “Part N of 10, selected/not selected,” with `aria-pressed`; numeral N identifies the cell, not a decimal value. Selected parts have a redundant fill/pattern. Any subset of n cells represents n tenths; contiguity is not required. Count each selected cell once. Do not duplicate the selected amount as another countable board. The five-across layout fits a 320px viewport without horizontal scrolling. Reduced motion needs no animation.

Before a check, show only the request and “N parts selected.” **Clear selection** reversibly sets zero without changing the request or earlier checks. No typed decimal input or answer-choice distractor list is introduced. This practices making an amount from a supplied notation, then reading the feedback; it does not assess independently writing a decimal.

**Check this amount** compares selected count with the frozen source's target. Zero selected is a legitimate explicit answer, not a missing answer. A mismatch remains editable and keepable. Feedback gives the selected amount as `n/10 = decimal`, and the requested amount in both forms, using canonical strings `0.0` through `0.9` and `1.0`. The full case says **“Ten tenths make one whole: 10/10 = 1.0 = 1.”** The empty case says **“No parts selected is zero: 0/10 = 0.0 = 0.”** Do not call 1 or 0 mathematically wrong for lacking a decimal point. Editing the board hides the latest feedback as current feedback; earlier checks stay available, with their saved board and feedback text. Nothing is silently resubmitted.

Help is optional and supplies the explanation: **“One tenth is one of ten equal parts of this same whole. Count one tenth, two tenths, and so on. Decimal writing gives another name for the amount. Four tenths is 4/10, also written 0.4. Ten tenths is one whole, written 1 or 1.0.”** It is clearly an explanation containing an answer, not a separate unseen test. Local narration of the request is optional and recorded as requested, not verified playback. **We worked together** records reported together support. No compulsory adult report or handwriting claim.

## Practice, familiarity and bounded saving

Use one optional `tenthsTable` root. It is absent until Start. A readable version-1 root holds `currentCase`, at most eight `cases`, and `shownValues` (unique integers 0–10); optional `recovered` preserves an earlier raw root. Each case stores its own frozen source (`version,id,title,request,wholeId,wholeLabel,partCount,targetTenths,form`), ten-cell selection as unique indices 0–9, monotonic support codes (`help`, `narrationRequested`, `together`, `feedback`), `helpOpen`, up to four checks, a safe `nextCheckId`, optional current feedback ID, and one kept draft. A case initially has no selected cells, checks or kept work. Reopening a case preserves its work; it does not create another history.

A check freezes the selection, response-time support, familiarity, count-match outcome and generated feedback text; it records `practiceOnly:true`. IDs increase within that case. After four retained checks, the next check explicitly warns that it replaces the oldest check; the kept draft remains. A kept draft copies current selection, support and the latest check if any, and remains readable even if that check later falls out of the four-check history. Keeping an unchecked or mismatched draft is allowed. Next edits never mutate that kept copy. ID exhaustion refuses a new check with clear wording; it does not hide existing work.

A case reopened from earlier work or whose target has already been supplied as a complete fraction/decimal pair is familiar practice. Every check reveals complete pairs for the selected and target values; add both to `shownValues` **after** recording response-time familiarity. Opening help adds 4 and 10, whose paired names it supplies. Subsequent checks qualify these encounters without rewriting earlier outcomes. Feedback/help support is monotonic for later responses. Keeping/viewing an existing check does not create an assessment response. All records remain pictured, supplied practice: do not infer independent decimal recall, fluency, placement or mastery. No record contributes to another game's adaptive evidence or stock. There is no generic cross-game exposure service in this increment; any future assessed decimal task must explicitly consider prior supplied examples.

Validate historical work against its own supported source, selection bounds, IDs/counts, and stored outcomes, not today's request wording or catalog. `wholeId` is a bounded saved identifier; supported whole/parts semantics are one whole in ten equal parts. A retired source with those semantics remains readable, even if its ID is absent from today's chooser. Do not require all eight current cases in a save. Invalid sibling cases stay verbatim in earlier-work notes without hiding readable siblings; an unreadable root is not repaired on view. New cases must not overwrite retained raw entries. Use simple own-source views and existing escaped JSON notes, not a new generic validation framework.

An explicit **Keep earlier record and start a fresh table** may nest an unreadable root in `recovered` only after the resulting whole notebook passes existing depth/node/UTF-8 limits and the host's actual formatted `notesReport` import preflight, as Joining Orders does. Failure leaves the original exactly unchanged and shows focused download/separate-explorer guidance. Use the same preflight if allocating a new case alongside retained invalid siblings would exceed existing import limits; refuse that new case atomically. Ordinary selection edits do not trim or repair records. Save-off, explorer isolation, reload, notes download/import and existing confirmed explorer reset include this root. Add it to the optional-raw-root importer allow-list and pure destination-notes preview. No learner free text or identifying profile fields.

## Verification and release boundary

Before building, independent review clears this spec and the complete finite source/help copy. Then use focused synthetic checks for all 1024 board subsets and all eight targets; equal-space/whole invariants; zero/full cases; fraction/decimal same-amount pair; repeat/help/feedback familiarity timing; support and retry separation; four-check trimming notice and kept-copy survival; ID exhaustion; old/missing/changed catalog sources; malformed siblings/root; no mutation on view; refused recovery/allocation at actual report byte/depth boundary; reload, explorer switch, save-off and real export/import. No test needs to establish learning efficacy.

Browser-check both request forms, zero/full/partial amounts, reversible taps, kept stale work, help/read-aloud request, narrow/tablet layout, native keyboard/focus, 44px targets, source notes and actual downloaded report. No physical iPad/audio-quality claim follows from a desktop check. Independent implementation review and root composed verification precede release. This increment does not add hundredths, decimal ordering, percentages, number-line placement, measures, ratio, adaptive progression or atlas coverage claims.
