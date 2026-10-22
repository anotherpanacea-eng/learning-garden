# Preparation Clock: independent implementation and art review

**Verdict: cleared for a local draft after one verified P2 repair. No unresolved P1/P2 findings.** This is an independent review of the current local implementation, not Claude clearance, exact-commit release clearance, merge approval or deployment approval.

The reviewer read the complete clock content/core/art/UI/CSS, cleared spec68, current tests and actual Workshop/Post/storage integration. It independently ran the core and integration suites, a separate response oracle, and synthetic local Chrome probes. It actually viewed a contact sheet containing all24 rendered faces, the real phone Set page and before/after kept-work captures. Only this review document was changed by this reviewer; root authored the runtime repair. No private data or external learner service was used.

## Required finding, repaired and independently verified

**P2 — support changes left a stale visible check heading.** On a fresh maps visit, keep a blank check, then open help on Kept. The original listener saved support=['help'] and `clockCheckMatches` correctly became false, but the already-rendered heading still said “Latest check of these choices.” This was reproduced in actual Chrome and captured before repair. It violated the spec's support-sensitive relevance contract even though saved results and the core comparator were correct.

Root added the local `saveSupport` helper in `bindPreparationClock`: after saving requested help/digital/audio support it refreshes the visible current check heading from `clockCheckMatches`. It does not rerender the page during a native toggle. The reviewer re-read the actual repair and independently verified in Chrome that opening help immediately changes the heading to **Earlier recorded check**, preserves the open fold and summary focus, and that audio does not restore a stale latest label. No source, answer or prior check is rewritten. The regression is also present in the current checked-in browser suite.

## Content, clock geometry and response evidence

All four actual source cards match the reviewed pack: labels9:00→9:30; maps9:30→10:00; books10:00→11:00; notes10:00→10:30. Stories/titles describe fictional jobs without printing the fixed reading answer. Default Read offers the frozen three labels against its unchanged preparation figure; Set supplies the departure goal against a separate proposed model. Help and check feedback deliberately supply answers and explain the supported-reading limits. The digital model readout is an explicit support fold rather than a default answer above Read.

The reviewer actually inspected every rendered position on the24-face contact sheet. Numerals run clockwise with12 at the top; minute hands point12 at :00 and6 at :30; short hour hands reach the correct numeral or midpoint, including9:30 between9/10 and11:30 between11/12. Unequal lengths and the visible hour/minute legend distinguish the hands without relying only on colour. The clockwise SVG transforms agree with the independently checked mathematics. No animation implies a backward minute-hand movement at wrap.

The actual core keeps the two response axes independent. A separate temporary implementation oracle compared all1,440 combinations with a minutes-based expected table, rather than reusing the production matching helpers. It passed, including wrong reading/fitting setting and both nullable axes. The own-source label/option checks also passed: historical09:30 remains valid for slot19, a changed30-minute identity is refused, and a globally valid reading slot outside its source's three options is refused. Untouched positions remain unobserved until movement or explicit proposal; unsure retains position; later movement activates it. These results establish implementation behavior, not independent reading, hand drawing, strategy or elapsed-duration competence.

## Frozen state, actions and actual seams

Source validation enforces distinct understood option slots, mathematical label identity and30/60/24 unit identities without current-catalog equality. A source ID and older wording/positions can survive independently of today's cases. Check labels, descriptions, feedback and contradictory recorded booleans are shape-admitted and not regraded. New checks clone their own source/input; source/reading/position/setting/support determine relevance, while page alone does not. Future pictures withhold SVG and retain descriptions, numeric model-position text and playable choices.

The core has no missing-root auto-start fallback. Only Start allocates, safe-ID failure precedes eviction, raw/duplicate siblings remain separately escaped, and oversized readable-round eviction is disclosed. Existing source and test inspection confirms the12-round/eight-check behavior and pure rendering. The generic persistence/transfer/explorer path carries the optional root without a new registry. The independently run integration suite exercises actual restore/import/store/save-off functions and verifies older game state and suggestions remain unchanged.

Workshop routing, notes and binding compose the clock locally, with an early binding return for its sheet. The Post addition is a plain invitation rather than a mutation of courier time, route steps or Bramble. Held shared app/media/global-style paths are not changed. Atlas scope says coupled setting, supported representation and supplied hour/half-hour units; it excludes independent drawing,24-hour-day conversion, real schedules and broader duration attainment. Source drift remains documented rather than hidden by a pin change.

## Actual browser scope and phone geometry

The final independent browser probe passed **56 assertions** across320,390,820 and1440px widths. On each of Read/Set/Kept it opened the native control-bearing folds, explicitly created and confirmed visible global voice controls, then measured their targets and overflow. Visible tested buttons/selects/summaries/back links met44px dimensions, and none of those tested pages overflowed horizontally. This also independently repeated the support-heading repair/fold/focus check at each width.

Measured Set question-top→Check-bottom heights were approximately **895 / 823 / 457 / 470px** at those widths. The actual viewed390px page keeps goal, model, four controls and proposal/check in one coherent turn with optional help afterward. It involves vertical scrolling; this is not a claim that the complete page fits a phone screen. The depicted model remains visibly proposed when it differs from the supplied goal. Open retained histories can be long by design and remain outside the active Read/Set turn.

Executed evidence:

- Current core suite: **9,387 assertions**, covering1,440 complete responses,24 labels and96 reversible steps.
- Current integration suite: **146 assertions**, including frozen/future/raw work, source/options, retention and generic persistence behavior.
- Separate temporary oracle: **1,440 actual implementation response comparisons**, plus own-source label/unit/refusal probes.
- Final temporary Chrome follow-up: **56 assertions** with explicit visible voice controls and opened folds; actual all24-face and phone-image inspection.

The reviewer read the root's broader browser suite, including all four cases, queued old help/audio events, native taps, future pictures, long saved wording and a real Post invitation return. Root's final complete run and separate actual Claude review remain distinct gates and are not claimed as independently executed here. No additional scope is requested. There is no physical Safari/iPad, human screen-reader, audible-quality, hosted-CI, independent-competence or learning-effect claim. Nothing is merged or deployed by this review.

## Root final follow-up and actual Claude clearance

Actual restricted local Claude initially requested three bounded P2 repairs: distinguish the latest stale check from genuinely older checks, seed Bramble preservation explicitly and record phone-turn measurements. Root folded all three. A shared local heading now says **Latest check · choices or support changed since** for the newest stale snapshot; genuinely older checks alone say **Earlier recorded check**. Native help/audio updates this heading and a live status without rerendering, moving focus or reopening folds. This supersedes the earlier wording in the independent probe above; its actual visual/geometry inspection remains valid. The new browser regression observes current→stale on an audio-only request after a fresh keep and preserves that label on reload. An integration check also confirms older records stay labelled earlier.

The preservation fixtures now use the actual adaptive **bramble-2** start API and its notebook, not just the legacy rival. The browser asserts that a real clover-buns delivery retains packing input8, rival input17, bramble-2 revision and its notebook **before** leaving through the actual Post invitation, then compares the complete Post root after clock practice and return. Core/notes/transfer tests keep all other roots and suggestions untouched.

Actual Claude follow-up re-read the repaired implementation/tests and confirmed **all P2s repaired, no remaining P1/P2**, with local-draft clearance conditional on the final root browser pass. Its review was read-only; it did not execute tests or view images. Optional advice on comparator key ordering, repeated selected-state wording and fallback notices does not add a migration or canonicalization requirement. Root actually viewed phone Read/Set and desktop Set captures, separately from the independent all24-face inspection.

Final root results after runtime repairs: **100 source suites pass;9,387 core/150 integration assertions;292 actual-browser assertions**. The browser includes all four cards and blank/uncertain/wrong/fitting repairs, explicit unchanged proposal, model wrap, fixed-versus-movable figures, future/raw preservation, native taps, support/fold/old-event behavior, actual adaptive Bramble/Post preservation, reload and the real Café→Living incoming-offer positive control. Global voice controls and all control-bearing folds are visibly opened and measured on320/390/820/1440; long admitted source strings wrap without horizontal overflow. Story-pack and deterministic atlas checks pass: **151 scoped references across83 topics**. Full source/runtime pins remain unchanged.

Ordinary question-top→action-bottom measurements at320px are **Read855 / Set895px**; at390px **Read787 / Set823px**. Goal/model/step controls remain a bounded local cluster. These are measured ordinary turns, not a promise that long historical imported prompts or the whole page fit one viewport. Admitted long wording is checked for wrapping/controls/overflow; full source descriptions/history remain readable. Phone vertical scrolling remains.

Root has reverified local draft readiness only. Exact-commit GitHub clearance, composed release and production verification remain separate. Nothing is merged or deployed.
