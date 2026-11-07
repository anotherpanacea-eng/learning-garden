# 410 · Spinner Table

Status: proposed bounded implementation, independent specification and complete mathematics/model review before code. Serves admitted LG-1 / LG-G1; selects the editable spinner and short-run contrast from [202](202-chance-scale.md), without commissioning its other benches.

## Purpose and scope

Beside Chance Line in canonical Seed Stall `#numbers/seeds`, offer **Build and try a spinner** in every parent state. Nuria's sign has three picture marks, but the shares may differ. Help the orchard keeper redesign it and compare short screen-draw runs. Sun, Cloud and Rain are picture marks, not a weather forecast. This is an optional visit-local experiment, not assessment, an access gate, a score or a story outcome.

Willow Path already has a fixed counting-on spinner; this is not the first spinner in the app. Seed Stall87 already has six-position replacement draws; Seed Pairs119/215 already has two-draw fractions, branches and recorded runs; Chance Line409 already has count/whole comparisons and a manipulable probability line. This adds a circular, editable three-mark model and live finite trials whose frozen design stays beside the tally. No new persistent notebook, seed inventory, weather observation or mastery claim. No external art/voice/network service.

## Model and complete finite mathematics

A wheel always has **12 equal slices**, numbered 1–12 clockwise from the top. There are three named marks in stable order Sun, Cloud, Rain, with integer counts in 0–12 summing to 12. Default counts `[6,3,3]`; presets **Equal shares** `[4,4,4]`, **Half for Sun** `[6,3,3]`, **Mostly Sun** `[10,1,1]`. Mark the first count slices Sun, next Cloud, last Rain. Each slice is one stop. A screen draw chooses one of the 12 stops uniformly and independently, always from the same frozen wheel for that run. This discrete-stop model is not a claim about continuous landing angles or a real spinner's mechanics.

Visible model rule on Design and Runs, included in their narration: **This make-believe wheel has 12 equal stops. Each stop has the same chance on every screen draw, regardless of earlier results. Sun, Cloud and Rain are picture marks, not weather forecasts.**

For mark count k: chance k/12, reduced by gcd; 0 renders as 0, 12/12 as 1, and already-simple fractions do not repeat. All three chances sum to 1 because exactly one mark belongs to each available stop. Distinguish equally likely stops from possibly unequal named marks. **Equal chance for all three marks** means counts `[4,4,4]` and chances 1/3 each, not an even chance of 1/2 each. The named comparison includes all three marks even when one has zero slices. No claim that a child choosing one favored mark is unfair behavior.

Editable design: choose **Take one slice from** and **Give it to**, each a three-option native select; **Move one slice** transfers exactly one if distinct and donor count >0. Same mark or empty donor disables the move with a plain reason. All 91 nonnegative count triples summing to 12 are valid. Colors accompany distinct sun/cloud/drop shapes and labels; number positions or radial subdivisions stay visible and countable. Presets replace only the current design, not any run. No cramped 12-button ring, dragging requirement or continuous-angle input. The wheel is a passive original SVG diagram with HTML count/fraction keys at effective 16px. Use 44px native controls.

Crypto selection adopts the existing `browserSeedSlot` rejection-sampling algorithm locally for 12 stops. `browserSpinnerSlot(random=globalThis.crypto)` reads one Uint32 at a time, accepts only values `<4294967292`, returns value modulo 12, and makes at most 32 reads in total. Missing source, throw or exhausted rejects returns null; never fall back to authored outcomes, Math.random or the seeded variation helper. Tests use explicitly synthetic entropy, never presented as authentic random results. Zero-based slot s is slice s+1; Sun iff s < counts[0], Cloud iff s < counts[0]+counts[1], otherwise Rain. Slot s maps to the center angle `(s+0.5)*30` degrees clockwise from top. Pointer, selected slice, named outcome and tally must agree.

## Run loop and local state

Reuse `chanceFraction` or `chancePoint` from Chance Line for reduced display; show any sum in twelfths, for example 10/12 + 1/12 + 1/12 = 12/12 = 1. The tally contains integer counts only, no observed fractions or percents.

Three freely reachable pages: **Design the wheel**, **Try runs**, **See why**. Questions are part of See why as a separately turned question subpage, never a long stack; four visible teaching pictures and four supported questions turn independently. Optional Hear covers only the current panel. Back to Seed Stall is always a button.

Constructor `createSpinnerTable()` returns finite local state: `{page:'design',counts:[6,3,3],from:0,to:1,runs:[],active:null,lesson:0,question:0,learnPanel:'pictures',answers:[null,null,null,null],explanations:[false,false,false,false],confirmReset:false,notice:null,summaryOpen:false}`. No dates, IDs or wall-clock scheduling. Also export `spinnerTableModel`, `spinnerTableNarration`, `spinnerSlotMark(counts,slot)` returning mark index 0–2, and `spinnerSlotAngle(slot)` for the center. The model exposes design marks/chances, selected frozen run/last result/tally, per-run summary and eligibility; no current-design relabeling of recorded slots. Reducer `changeSpinnerTable(work,action,value)` is immutable, same object for invalid/no-op actions; only finite enums/ranges are needed, no generic save schema or descriptor framework.

| action | behavior |
| --- | --- |
| page | design/runs/learn only; current design, runs and teaching choices stay |
| from/to | set mark index 0–2; no transfer yet |
| move | transfer one slice donor→recipient when valid; keep every run unchanged; clear transient notice |
| preset | index 0–2 selects the named counts above; keep every run unchanged |
| start | when fewer than three runs, append `{counts:[...current counts],draws:[]}`, select it, show Runs; no RNG call |
| active | select an existing run 0–2; old runs can also continue until 20 draws |
| spin | value integer 0–11 appends one selected slot to active run if fewer than 20 draws; use that run's frozen counts, not editable design; clear notice |
| entropy-failure | only for a live spin-eligible run; set notice code `entropy-unavailable`, keep all counts/draws untouched |
| reset-request | if runs exist, open explicit local reset confirmation; retain runs |
| reset-cancel | close confirmation only |
| reset-confirm | only when confirmation open; clear all local runs and active selection, retain current design/teaching answers, close confirmation; never call parent writer |
| summary | toggle the visible all-runs summary; retain its open state during the room visit |
| learn-panel | pictures/questions only |
| lesson/question | valid index 0–3, bounded Previous/Next controls |
| answer | choice index 0–2 for current question; retain own selection and its specific feedback, revision allowed |
| explanation | toggle current question's optional fitting-answer explanation; revision never conceals already-open help |

Every successful state-changing action other than `reset-request` and `reset-confirm` closes `confirmReset`; invalid/no-op actions leave it unchanged. This includes spin, start, active, page, move, preset, from/to, summary and entropy-failure. Back closes it with `reset-cancel` before returning; re-entry never restores an open confirmation. Ordinary successful changes clear `notice` too; reset-request/cancel may retain the current failure, while reset-confirm must clear it. A repeated live eligible entropy failure may leave the same core object, but the UI still renders/refocuses `#sp-status` so the visible error is available again, without a new draw.

**Begin a fresh set** is on Runs only, available whenever at least one run exists and is required at three runs. Confirmation says **This clears these N runs from this visit. It does not change your saved Seed Stall experiments.** Substitute the actual count, using “this 1 run” for one. Buttons **Keep these runs** / **Clear these local runs**. Replace the request control in place with Keep these runs at the same location, put confirmation copy and Clear below it, focus Keep, and reject Keep and confirmation clicks with `event.detail > 1`. A double-click/tap at the old request location cannot confirm a clear. No automatic eviction and no limit on fresh sets. Allow requesting/resetting an unfinished run set; its clearing must be explicit. Hidden or old confirmation controls cannot clear newer work. A run reaches 20 draws then stays available to compare; no forced completion, record of attainment, penalty, animation lock or training gate.

With no run, Runs shows the current design, **Start a run with this wheel**, and **Not drawn yet**, with no tally or Spin. Start is available on Design and Runs while fewer than three runs exist. An empty selected run has no selected/highlighted slice and no outcome-pointing arrow; caption **Not drawn yet**. A run switch shows its own last result at rest, with no new animation.

Each run owns its frozen counts and ordered chosen slots. Runs page shows the selected run's wheel, counts/chances, ordered result marks and a tally with a fixed 0–20 count scale. Empty positions are **Not drawn**, not zero observations. Label tally as recorded screen draws; fractions as model chances. Run tabs show run number and draw count. Design changes never recolor previous results or relabel them under a new wheel. Always label the pictured frozen wheel **Run N's wheel**, apart from **Current design**. “Differs” means any count differs elementwise. If selected run differs from design and fewer than three runs exist, show **This run uses its earlier wheel. Start another run to use your current design.** At the three-run cap, instead say **This run uses its earlier wheel. Begin a fresh set to use your current design.** Hide the mismatch message if counts match again, but keep the labels. Draws may continue from that earlier wheel. A visible design/run distinction is mandatory even if counts happen to match later.

The summary is omitted when no runs exist. A folded **Compare these runs** summary on Runs lists up to three rows: run number, its frozen Sun/Cloud/Rain stop counts, and its actual Sun/Cloud/Rain tally (or Not drawn yet for an empty run). No estimated chances. `summaryOpen` retains its state across redraws; narration includes these rows only when open. This enables real side-by-side comparison without a long mandatory stack.

Before any entropy request, require live listener/frame and eligible run. A successful click commits exactly one outcome immediately, focuses `#sp-result`, whose heading text is **Screen draw D: MARK mark. Tally: Sun S, Cloud C, Rain R.**, then may animate the pointer through two extra turns for at most 500ms. Hear never starts automatically. The result heading is followed by the Spin control in keyboard order, so a new deliberate activation is easy. Use a capture keydown handler to reject repeated activations (`event.repeat`) on Spin and destructive confirmation. Motion is cosmetic; no delayed result/state callback, await, timer, auto-spin or background loop. `prefers-reduced-motion` disables turns; final pointer/readout remains exact. Rapid clicks count one per live activation. If entropy is unavailable, say **This browser could not make a screen draw. Your wheel and earlier results are still here. Try again, or compare the chances together.** No fake result. Optional visual animation uses the actual slot, never decides it. Trigger it one-shot in the live Spin handler after synchronous render, only if `Element.animate` exists and reduced motion is off; no motion flag in the core state. Page/run/Back/re-entry/Hear redraws never replay it. The resting/final pointer must align with the actual slot; the transient angle does not determine the text/tally.

Lifetime copy: **Your wheel and runs stay while you visit Seed Stall. Leaving the room clears them. Your saved experiments stay as they are.** Leave means any hash other than exact `#numbers/seeds`, including Seed Pairs; owner/notebook/import/reset also clear this visit's child work. Returning to parent and entering Chance Line or Spinner Table retains each child's own work within the same room visit.

## Complete finite teaching and questions

Original pictures and wording; equivalent short splitting is allowed, with normal number/word spacing. No lesson/choice copied from upstream.

1. **Count equal stops, not names.** Show `[6,3,3]`, all 12 slices, Sun 6/12 = 1/2, Cloud 3/12 = 1/4, Rain 3/12 = 1/4. One of twelve equal stops is 1/12 of the whole; six such stops make 6/12. Three marks can have unequal chances. The 12 stops have equal chances by the screen rule.
2. **Redesign the shares.** Show `[4,4,4]` beside `[6,3,3]`. Each named mark has 1/3 on the first. Sun has 1/2 on the second, each other mark 1/4. Equal chance for three marks is thirds, not halves. Each transfer preserves all 12 stops. Two transfers, Sun→Cloud then Sun→Rain, turn [6,3,3] into [4,4,4].
3. **A run is not a promise.** Show `[6,3,3]` with explicitly authored illustration Sun, Sun, Sun, Cloud; label it **An example, not your run and not a fresh random draw**. Next Sun chance still 1/2; neither a streak nor Cloud/Rain being owed a turn changes the wheel. The picture makes no claim about a typical 20-draw tally.
4. **Keep the old wheel with its results.** Show frozen `[6,3,3]` and a separately edited `[4,4,4]`. The earlier run's Sun chance remains 1/2; a new run from the edited design gives 1/3. Observed counts may vary between runs. A short run can look uneven; this screen wheel still follows its equal-stop rule, and its marks are pictures, not weather.

Question choices are fixed, three each, fitting positions 2,1,3,2 (zero-based keys 1,0,2,1). All revisable, supported and ungraded. Each selection shows only its own feedback; optional explanation shows the fitting answer/reason. No learner support/exposure/attempt records.

Q1 **The wheel has 6 Sun, 3 Cloud and 3 Rain stops. Which statement fits?**
1. **Each mark has a 1/3 chance** — There are three names, but the shares differ: Sun has six of the twelve stops.
2. **Sun has a 1/2 chance; each other mark has 1/4** — Count all twelve stops: six Sun, three Cloud and three Rain.
3. **Random means we cannot compare the chances** — The next result is uncertain, but the equal-stop rule lets us compare the shares.
Explanation: Sun is 6/12 = 1/2; Cloud and Rain are each 3/12 = 1/4.

Q2 **Which design gives all three named marks the same chance?**
1. **4 Sun, 4 Cloud, 4 Rain** — Each mark has four of twelve stops, a 1/3 chance.
2. **6 Sun, 3 Cloud, 3 Rain** — Cloud and Rain match, but Sun has more stops.
3. **10 Sun, 1 Cloud, 1 Rain** — Sun has ten stops; Cloud and Rain have one each.
Explanation: Equal shares of twelve among three marks are four stops each: 1/3 each.

Q3 **Three Sun marks appeared from a frozen 6 Sun, 3 Cloud, 3 Rain wheel. What is Sun's chance next?**
1. **More than 1/2** — Earlier results do not add Sun stops to this wheel.
2. **Less than 1/2** — No mark is owed a turn. The same twelve stops remain available.
3. **A 1/2 chance** — Six of the same twelve equal-chance stops are Sun on every draw.
Explanation: Still 6/12 = 1/2 under this model's independent equal-stop rule.

Q4 **No Rain mark appeared in a short run from a frozen 6 Sun, 3 Cloud, 3 Rain wheel. What follows?**
1. **Rain's next chance is 0** — Rain still owns three available stops; zero recorded Rain results is not zero chance.
2. **Rain's next chance is 1/4** — Its three of twelve stops remain available, whatever the earlier tally.
3. **Rain's next chance is 1** — A mark is not owed the next turn. Sun and Cloud remain possible too.
Explanation: Rain's next chance remains 3/12 = 1/4. A short run can have no Rain.

Narration follows visible current page/panel only: relevant counts/fractions/rule; selected run number and frozen wheel, actual result/tallies/current entropy notice and mismatch message; current picture (including authored-example label) or question/choices/selected feedback/revealed explanation; navigation, reset confirmation only when open, and lifetime/Back message. No hidden teaching answer, a hidden summary or another run's hidden outcome, implied real weather or fake observation. Shared Hear uses existing local voice service. Voice/speed preferences and daily room bookkeeping remain separate existing app-wide writers; no-write checks cover Hear, not deliberate preference changes.

## Parent integration and preservation

Extend existing Seed Stall's two child modes, no new route or general activity registry. Use a local `activeBench:null|'chance'|'spinner'`, one captured return frame and existing `bindingGuard`, independent `chanceWork`/`spinnerWork`, and remembered entry for return focus. Existing `resetChanceVisit` may be renamed to an accurate Seed Stall bench reset together with its app import/call; it must clear both children on exact-room departure. Parent turn reset and legacy aliases keep their behavior. `seedPage` selects child page or parent; bind selects matching child binder. Keep source identity/value, local count/choosing/pending/notice and keyed history/talk folds exactly as409 does. Listener retirement and changed-frame recovery remain separate. Parent writers, Seed Pairs entry and unrelated six-draw how-to are absent during either child.

Spinner scope `[data-sp-root]`; entry `[data-sp-entry]`; h1 `#sp-title`. Add spinner scope to both synchronous and observed how-to suppression in app. Entry and current actions are guarded against render generation, visibility, removal/reinsertion/ancestor change, exact route, notebook and owner before RNG, speech or state change. Source identity/raw value change exits to the current parent without replay, discards stale choosing/pending/notice/folds and focuses the correct child entry; preserve both child works only for same notebook/owner/room. Back is a button and restores captured parent including pending replacement, without save. Entry/re-entry focuses h1, Back/recovery focuses remembered entry. Page/lesson/question changes focus their current heading. Stable direction selectors for Previous/Next and useful select fallback at boundaries; never restore focus using a target value that changes on redraw. Transfer/preset/run/Spin/reset controls retain a useful active control or named result heading after redraw, including when a cap disables the acting button.

Name the integration boundary: `bindSpinnerTable(work,ctx)` receives only live, change, render, focus, back, stopSpeech and stopSound, not save/canExport/downloadNotes or the parent's six-position `randomSlot`. Spinner UI directly calls its own imported `browserSpinnerSlot()` after live/eligibility checks; app leaves that helper unchanged. Actual-app tests inject a queue of Uint32 values with a page init-script stub of `crypto.getRandomValues`, never a production test hook. Exercise all12 stops through the actual binder. Rename `allowChance` to cover both child entries; both are omitted on legacy aliases. Replace every hard-coded `[data-cl-entry]` recovery/focus selector with the remembered child entry.

Exact focus targets: entry/re-entry `#sp-title`; pages `#sp-page-title`; learn-panel `#sp-panel-title`; picture/question turns `#sp-lesson` / `#sp-question`; from/to keep their select (`#sp-from` / `#sp-to`); Move keeps the Move control if still eligible, otherwise `#sp-from`; preset keeps its stable-index button; start/active `#sp-run-title`; every successful Spin `#sp-result`; entropy failure `#sp-status`; reset-request Keep button; reset-cancel request button; reset-confirm `#sp-start` on empty Runs. Answer/explanation/summary retain the acting control. Do not rely on a newly inserted role=status alone for result announcements. A visible result heading plus focus is the specified mechanism; native tests do not prove screen-reader speech.

Slice numbers may be SVG text only if actual effective font size is at least16px in the narrow layout; otherwise use an HTML number/range key. Decorative art never carries the sole outcome label.

Use original scoped CSS and SVG icons/shapes; diagram has an honest text equivalent and HTML16px keys, minimum44px controls, no labels shrunk by SVG scaling, no hover-only/drag-only step or horizontal overflow. Design and Runs keep relevant wheel and controls beside each other on tablet, stack on phone; one current lesson or question at a time. No generic hero, new font download or new media pipeline.

## Curriculum, upstream and source boundary

[49](49-six-act-curriculum.md) §5: teach equal stops vs unequal marks; contrast three names vs thirds, model shares vs recorded tally, old vs edited wheel; supported design/three presets/Hear/choice-specific feedback; new use editable allocations and fresh runs; purposeful revisit Chance Line and original Seed Stall/Seed Pairs. M6-III/IV, M3 fraction share, M7 justification. [120](120-keeper-of-the-ways.md) Act III/IV: an orchard sign/table contribution, open independently of any chapter. No claim of a finished course, physical fair-test competence, statistical estimation or story completion.

Refreshed2026-11-07: Jane `c681f6bf2f2adf2aa032f765983a4691774cfba5` LESSONS.md; Marble `04962c78ccb8bd52b236512d3362405bace98d2a` topics/dependencies. Same heads as409; their current captured files were inspected. Jane ordered encounters, separate examples and optional support are design references only. No Jane/Marble lesson prose, research text, code or images incorporated; bundled graph stays pinned.

Partial target/hard-prerequisite crosswalk, checked against bundled `curriculum/marble/dependencies.json` plus refreshed graph:

| target | hard prerequisites | bounded support |
| --- | --- | --- |
| Likelihood Language `mt_iFFKZd-Vgv` | none | picture1/3 recaps uncertainty;409 revisitable |
| Ordering Likelihoods `mt_UcGn2hjhYU` | likelihood above | picture1/2 compares named shares; no broad ordering assessment |
| Equally Likely Outcomes `mt_xSgAgg9Ej_` | ordering above | explicit equal stops vs unequal marks; no real-device fairness proof |
| Probability as a Fraction `mt_-c4Ca_nBzX` | equally likely above; bundled Unit fractions `mt_k2WE0-22-4`, refreshed Fractions of a whole `mt_ndGqFPWyen` |12 equal parts; count one and multiple parts; k/12 and reduced form;409 gives fuller count/whole recap |

No full target coverage claim: coin/die/unequal continuous devices, decimals/percent, probability-scale placement, formal estimation, Venn/conditional events and all broader202 work remain separate. Three fractions summing to one is explained for this exclusive/exhaustive three-mark wheel, not a general union rule.

Math/model source studied: [OpenStax Introductory Statistics2e §3.1](https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology): inclusive0–1 bounds and favorable/whole counting only when stops equally likely. Original discrete-stop random implementation follows our existing Seed Stall rejection-sampling pattern, not copied external software. No claim that twelve positions represent a real weather system. Independent finite review must recompute all presets, all91 design triples under the same rule, point/mark alignment, authored sample, all questions/feedback, entropy boundary and run-source separation.

## Acceptance and publication

Meaningful deterministic checks:91 admissible designs and transfer invariants with independent count/slot oracle; presets/reduced fractions/all-three sum; boundary zero/certain/thirds; every slot maps to its correct mark/center; rejection boundary and exhaustion/no-source/failure; no RNG on view/ineligible/stale controls; 31 rejects then accepted slot, exactly32 rejected reads then null, accepted maximum value; frozen old runs survive design changes; per-run20 and three-run cap; selected old run continuation; explicit cancel/confirm reset, request→spin/start/page/Back cancels confirmation and a later confirm no-ops, actual double-click at request location cannot clear, no silent evictions; immutable/no-op bounds; fixed question keys/feedback/help and visible-only narration. Register all new prose modules with existing child-copy check, preserving its first adult-scope fixture.

Actual-app Chrome: editablewheel → explicit run → deterministic synthetic outcomes → independent tally/reference count expectations; earlier-run ownership while design changes; select/continue older run; three-run reset/cancel; entropy failure and rapid activation; motion reduced/on correctness; pointer/slot/outcome agreement; parent pending replacement/folds and other child work retained; actual in-memory notebook, persisted learner data, Notes and relevant storage unchanged across child actions; source identity/value invalidation explicitly labeled synthetic; owner/import/route/reset and stale/hidden/detached Spin/Hear/confirm controls inert before RNG; no parent how-to in child. One complete tablet journey and focused phone geometry/keyboard samples, with root screenshot inspection. Run existing Chance Line and Seed Stall/Seed Pairs regressions for changed wrapper, full source once stable/integrated with current main, affected checks after bounded repairs. Tests do not measure learning or qualify physical iPad/audio.

Independent six-lens spec review and complete finite math/model review before code. Independent exact-head Claude implementation clearance after repair, ready/release custody, merge commit, clean authorized deployment, all tracked hosted assets byte-match and Home/touched-game smoke. One canonical PR receipt linked once from roadmap. French462 keeps its Gemini hold; pixel487 stays draft. No new permanent manifests, general registries, schema layers or receipts framework.
