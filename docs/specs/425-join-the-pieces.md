# 425 · Join the Pieces

Status: proposed for independent specification and mathematical review. Baseline main `5d783d8df158e69a5aab543b634d664c4b31933a`. Existing LG-1 / LG-G1; operational Fleet1630. This commissions a new material operation, not the whole of proposal197.

## The gap and story job

Common Cuts292 repartitions two fixed amounts and compares them. Join the Portions103 moves supplied pieces of one size. Neither lets the explorer construct a common unit and then physically join the two amounts. Joining Fractions197 proposes this bridge but is not an implemented owner of it. This increment fills that gap using Common Cuts' actual five case sources and pure cutting functions.

In Act III, Willowbank is preparing ribbons for a gathering beyond the bridge. Two usable lengths can be laid end to end. The explorer needs the combined length, measured against the same reference whole. A join in this model loses no ribbon; it is a screen model, not a measurement of real cloth. This is M3-II equivalence revisited in M3-III unlike-denominator addition, under [49](49-six-act-curriculum.md) and [120](120-keeper-of-the-ways.md). It neither advances an act nor supplies an ending, film, café inventory, kept plan or mastery claim. Every destination and case stays open.

## Upstream and prerequisite crosswalk

Refreshed upstream heads on 2026-11-07: Jane `c681f6bf2f2adf2aa032f765983a4691774cfba5`, Marble `04962c78ccb8bd52b236512d3362405bace98d2a`. Studied Jane `docs/LESSONS.md` (blob `4d6add1b23c32ed6167c2358d763db05474e23d9`): separate introduction, guided encounter and practice, with an easier worked example available. Adapt that sequence into optional manually stepped material; do not incorporate its prose/code, generated quest scheduling, grades, bosses, medals, KV or gates. Marble topics blob `a1d3bf978d95f9240b7b43f1dd09a7f61541630a` and dependencies blob `c65f65131ac90d7f1cb0791aa35e1ed97e3e7c1f` were inspected. Descriptions below are paraphrased design references, with the repository's existing upstream attribution/licenses; no upstream research prose is copied.

Candidate topics, not coverage declarations:

- `mt_-V7EnqU7gG`: related-denominator addition/subtraction by equivalent names. This table supplies addition construction, not subtraction or a general written algorithm.
- `mt_14T5yPXUq_`: unlike-denominator operations, including mixed numbers. This table supplies proper starting fractions and some totals above one; it does not cover mixed-number inputs, subtraction, arbitrary denominators or the complete topic.
- `mt_ebPelt-qAl`: equivalent fractions explained through unchanged amounts and renamed pieces. Revisit in Common Cuts' actual splitter.
- `mt_VgOePicFYK`: joining/separating unit-fraction parts and multiple decompositions. Piece moves support this bounded meaning, not all decompositions.

Direct hard edges from the installed `curriculum/marble/dependencies.json` and their treatment:

| Target | Hard prerequisite | Support in this encounter |
| --- | --- | --- |
| `mt_-V7EnqU7gG` | `mt_ebPelt-qAl` | Both original shaded ends and whole lengths remain fixed while cuts change. Original/current names and an inline explanation make equivalence available without a prior visit. |
| `mt_-V7EnqU7gG` | `mt_VgOePicFYK` | A transferred piece is one current unit. Count on the joined strip, return it with Undo, and retain which source contributed it. |
| `mt_14T5yPXUq_` | `mt_-V7EnqU7gG` | Separate quarter example; related-denominator live case; then two-denominator cuts. No dependency on an earlier recorded result. |
| `mt_14T5yPXUq_` | `mt_b7T-CjOYUR` | Installed source combines common multiples and simplification. Mechanically offer splitting each piece in two or three; show equal-size counts once they match. Lowest terms are not needed and not required. This is a documented narrower support, not full factors/simplification instruction. |
| `mt_ebPelt-qAl` | `mt_Ep7TDFuYUa`, `mt_FP-mjXaq3B` | Aligned 0/1 whole markers and unchanged endpoints explain equal size and simple generation; optional Common Cuts remains open. No full number-line equivalence claim. |
| `mt_VgOePicFYK` | `mt_09sySPqM9Z`, `mt_CBHwluE6Lp` | Each movable piece is explicitly 1/current-denominator. Joining counts equal-sized pieces, keeping that denominator; the example shows three quarters. More than one whole is shown with the same scale. |

Upstream now marks simplification soft and makes common multiples `mt_FHIAv6dfhU` hard for `mt_14T5yPXUq_`. The installed edge is not silently rewritten. The common-cut construction supplies this bounded multiples support; full factors/primes and simplest-form methods remain separate work. Soft mixed/improper conversion is supported only by fixed whole markers/counts, not a mixed-input method. This increment changes no graph pins, atlas ownership or coverage labels.

## Material and five open jobs

Use `commonCases`, `createCommonPair`, `commonPairModel`, `splitCommonPair` and `undoCommonPair` from `common-cuts-core.mjs`. Do not duplicate its fraction catalogue, row validity rules, cut histories, endpoint arithmetic or comparison engine. A small new core owns only transfer order, conservation and the supplied sum. Current shared originals are:

| Existing case ID | A + B | One matching unit | Combined amount (supplied reference) |
| --- | --- | --- | --- |
| `half-and-third` | 1/2 + 1/3 | 3/6 + 2/6 | 5/6 |
| `equal-banners` | 2/3 + 4/6 | 4/6 + 4/6 | 8/6 |
| `quarter-third` | 3/4 + 2/3 | 9/12 + 8/12 | 17/12 |
| `sixth-quarter` | 5/6 + 3/4 | 10/12 + 9/12 | 19/12 |
| `quarter-and-third` | 1/4 + 1/3 | 3/12 + 4/12 | 7/12 |

These are two separate pieces of ribbon, even when their lengths are equal. Preserve existing IDs; supply joining-specific job titles/descriptions rather than comparison instructions. Sixth and twelfth common units both remain valid where reachable, without favoring the least denominator. Every original amount is a proper fraction; joined output can exceed one. Preserve an exact fraction name at the chosen denominator, without automatic simplification or mandatory lowest terms.

Original A and B reference ribbons are always shown against an identical 0–1 whole. Their pattern/letter and fixed shaded endpoint remain. Clearly label them **Original lengths**: these are references, not a second pile of usable pieces. Separate labeled source trays show pieces still available. Unmoved slots are filled/patterned; moved slots are outlined and described in text. The output **Joined so far** shows transferred unit pieces in move order, with A/B letters or patterns and a source/count equivalent in HTML. Colour alone never distinguishes sources.

Native **Split A pieces in 2**, **Split A pieces in 3**, **Undo A cut** (and B equivalents) reuse the Common Cuts operations and denominator≤12 limit. While any piece is transferred, cuts/undo-cut disable, with the visible explanation **Return the joined pieces before changing the cuts.** Native **Undo last move** returns exactly the last source's piece. **Return all pieces** restores both trays without undoing cuts. Thus no action silently discards work. Unavailable/invalid actions refuse, never clamp or partially apply.

Native **Move one A piece** / **Move one B piece** transfer one current 1/d piece only if denominators match and that tray has remaining pieces. Each move grows the joined shaded prefix by exactly that unit. When denominators differ, these buttons disable and the visible instruction explains why matching counts alone is insufficient. All cutting detours stay open; different units are not treated as a failed answer. Once denominators match, no separate correctness gate is needed to start moving. Empty tray buttons disable; full transfer shows **Both lengths are joined.** Undo/return stay available. No auto-next, celebratory credit, score, retry or independent-answer record.

The joined length uses up to two aligned 0–1 strips, each at exactly the reference scale. Show the second whole only when needed; never squeeze 17/12 into one whole or resize A relative to B. At an exact whole the second strip is absent; a later move adds it. Reference originals keep their ends while source availability and output change. HTML states A remaining/moved, B remaining/moved, total transferred count, denominator and same-whole unit. On every successful move, A remaining + A moved = A current numerator, likewise B; output count = total moves; total supplied length is unchanged. The sequence can interleave A and B; no prescribed order. Reversing every move recovers the exact recut starting material.

**See the whole sum** is optional and always available on a chosen job. At unmatched units it supplies the original-addend expression and explains matching units, but does not construct a common cut or move pieces. At matched units it displays both renamed addends and the full sum, labelled **Reference — the whole sum**, independently of the partial work. **Joined so far** remains the actual partial amount and is never replaced by that reference. Further cuts/moves/Undo/return hide the reference until requested again. This is supplied reasoning, never a child's answer or proof of recall. Keep a completed sum visible in the work readout even without opening the reference.

No multiplication/division question is asked or standalone numeric multiplication/division fact displayed: cut labels describe splitting, fraction names describe amounts, and supplied equations use addition. This is representational addition/equivalence support, not multiplication recall. Existing explicit provided-fact exposure rules remain intact; if implementation adds a numeric product/quotient, it must first use the existing exposure seam rather than bypass it. Do not add those equations merely as incidental decoration.

## Teaching encounter and finite copy boundary

The main instructions are short and action-specific:

- Chooser: **Join the Pieces**; **Lay two ribbon lengths end to end. First make their pieces the same size. Then move the pieces into one joined length.**
- Whole note: **Each full strip stands for the same whole length. A join in this model loses no ribbon.**
- Cutting stage: **Try cuts on A and B until their pieces are the same size. The original lengths stay the same.**
- Matching stage: **The pieces match. Move one piece at a time from either tray. Keep counting pieces of this size.**
- Transfer notice: **The outlined slots show pieces already moved. The original strips above are references, not extra ribbon.**
- Visit notice: **Your cuts and moves stay while you are at this table. Leaving starts a fresh table; this work is not saved in Notes.**
- Optional talk: **Why does the piece size stay the same when you join? Where did each piece come from? Try returning the pieces in reverse order.**
- Grown-up boundary: **A movable model of joining lengths. The displayed totals and reference are supplied reasoning. This does not measure independent calculation, learning, real cloth or a general level.**

UI copy may be edited for brevity without changing these meanings; core action labels, whole/unit distinctions, original/available/joined/reference labels and exposed facts require substantive review. No free-text marking or authored historical/scientific claims are introduced.

An optional separate **Show me with quarters** uses 1/2 + 1/4, not a live job. Five manually stepped frames, with Previous/Next and Back to my ribbons:

1. A original half and B original quarter, same-size whole. **A half and a quarter use different-sized pieces. We cannot call them two equal pieces.** No transferred pieces.
2. Split A into quarters; fixed endpoints unchanged, A 2/4 and B 1/4. **Two quarters name the same length as one half. Now each small piece is one quarter of the same whole.**
3. Transfer A's two quarters into the output. Source A empty; B still one quarter. **Two quarters have moved. One quarter is still in B's tray. The joined length so far is 2/4.**
4. Transfer B's quarter. **Two quarters and one quarter make three quarters: 2/4 + 1/4 = 3/4. The pieces are still quarters.** Display source empty and 3/4 output.
5. Keep that correct construction, alongside a separately labelled **Different claim: 2/6** short strip at the identical whole scale. **Adding both counts would say 2/6. But sixths are smaller than quarters, and 2/6 is shorter than the length we joined. Joining changes the count of pieces, not their size.** The false claim is not a live piece, answer choice or transferable source. No equation asserts 1/2 + 1/4 = 2/6.

Closing/reopening the example resets only its frame and preserves live cuts/moves. Example speech includes only its current frame, not the live result or later frames. No auto animation/advance.

49 §5 sequence: teaching = separate example; contrast = frame5 plus unmatched-unit instructions; supported practice = optional help and freely selected related case `equal-banners`; new use = `quarter-and-third` and the gathering-length purpose; return = choose `quarter-third` / `sixth-quarter`, cross one whole, then undo/rejoin in another order or unit. This finite visit can be replayed but is not an adaptive curriculum, spaced schedule or coverage-completion claim. Learners may choose any sequence.

## State, integration and native controls

New exact route `#workshop/join-pieces`; ordinary link from Common Cuts beside existing nearby tables, and links back to Common Cuts and Join the Portions. Do not replace their behaviours. New `join-pieces-{content,core,ui}.mjs`, CSS, affected tests and README/roadmap. App owns import, stylesheet and explicit early-route/render/reset hooks, including the existing direct-entry/no-unrelated-initialization/no-welcome-film/explorer-destination route lists. No new global routing framework.

One transient visit bound to exact notebook object and explorer ID, selected case, per-case `{pair, moves}` and optional reference/example view/frame. A pair is the actual existing Common Cuts state. `moves` is a bounded array of A/B codes, no greater per source than the current renamed numerator; it must be empty to change cuts. Validate unknown case, invalid pair, moved excess, bad code and unmatched moves as refusals; successful pure functions return fresh objects and preserve previous input. Do not deserialize these values from a notebook. UI-only disclosure state is transient.

Choosing another job retains that job's work within the visit. Example/reference views do not rewrite it. Route departure/reload/explorer chooser or switch/confirmed import/reset clear the visit and stop speech/sound. A direct unseen visit does not create unrelated story/film/activity state. Confirmed import/reset keep their existing explicit whole-notebook effects; this activity adds none. No new notebook field, callback writer, export format, Notes section, retained-source registry, grading engine or atlas entry. All unknown notebook fields remain untouched by playing, help and speech.

Guard native actions against old notebook/owner/route/case/view/material snapshots and obsolete roots. Detached, hidden/inert, externally hidden-and-restored and replaced controls cannot act or speak; an observed invalidation retires that binding even when later restored. Preserve real native disclosure open/close and the independently owned global speech controls; don't treat a normal disclosure close as loss of activity ownership. Guard both parent-root replacement and old enabled button events, and verify a subsequent legitimate action still works. Disconnect observers when the binding is retired. Do not add a new permanent lifecycle framework merely for this table.

Use the existing local speech resolver through first native Hear, once, without rerendering away its delegated click. Speak visible material/readouts and an opened reference, or the current example frame. Closed disclosures/later teaching/live hidden material are excluded. Stop audio on work/view/case transitions and owner/route changes. Voice fallback remains readable; a call is not proof of audible playback. No remote voice/model or assets.

Material-first design: workshop slate/green paper, A striped dark green, B dotted blue, brass whole markers; HTML uses app type, ≥16px essential text, ≥44px targets. Keep the two references compact above source trays and joined strip; case chooser and grown-up detail fold away after selection. At 820portrait/1024landscape, prioritize the active cutting or moving actions next to the current material. At320px allow natural vertical scrolling, no horizontal overflow and no thin-target/hover/drag dependence. All material-changing controls native buttons with clear disabled reasons. Keyboard Enter/Space and visible focus; after disabling an action focus a valid reverse/adjacent action or heading, never BODY. Support reduced motion with the same static views. Essential source/unit/count information has HTML equivalents to SVG. No tab bar with merely different prose and no modal puzzle gate.

## Verification and delivery

Before build: six independent spec lenses grounded in actual parent modules, plus independent Claude mathematical/content review. Resolve genuine P1/P2 ambiguities before implementation.

Source checks use independent rational/count oracles, not the rendered result helper: all five source sums, every reachable recut pair, all legal transfer counts and representative interleavings/undo paths, both sixth/twelfth units where possible, crossing/exactly-one-whole, invalid/mismatched/excess moves, immutable input, empty/refilled trays, cut refusal during transfer, complete reversal, example isolation and false-claim magnitude. No prose snapshots or assertion-count targets. Parent Common Cuts checks remain intact.

Actual-app browser journey: direct entry, native cuts/moves/undo/return/reference, partial-work vs full-reference distinction, each case available, case/example preservation, both matching units, all teaching frames, meaningful material geometry/conservation and same whole scale, crossing one; native keyboard/focus; 320/820/1024 representative layout samples. Probe actual in-memory notebook, both browser storages and real Notes exports before/after play (ignore only export timestamp), rather than a fake writer callback. Use a synthetic read-only actual-app notebook getter solely in the test harness. Test route/chooser/switch/import/reset/reload and obsolete enabled controls, hidden/restored roots, native disclosure reopening and global voice-control independence. Verify speech once against current visible material, not an audible-quality assertion.

Run affected source/browser checks while editing; full integrated source runner once before landing and affected reruns after bounded fixes. Independently review exact candidate with Claude, fix, recheck any delta, mark ready and release own custody, merge-commit, deploy clean merged tracked `dist/` to canonical account, compare every hosted asset and smoke Home plus this route. Publish one canonical PR release comment linked once from roadmap. Keep 197's broader subtraction/mixed-number/method work and graph coverage open; do not claim this closes M3-III.
