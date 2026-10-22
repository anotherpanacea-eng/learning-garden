# Supplied choices: independent specification and content review

**Verdict: BUILD-READY after two P2 acceptance-boundary clarifications, both resolved and checked in the actual spec before build. No unresolved P1/P2 findings.** The28 proposed alternatives and their feedback are acceptable in their existing contexts. The fixes concern claims about existing narration/help behavior, not the proposed choice content or frozen-source contract.

This is independent pre-build specification/content review. The reviewer did not author spec72 or its source audit. Six separate focused passes were completed in this reviewer context, without further agent fan-out. Read surfaces include the local AGENTS/CONTRIBUTING rules, the complete spec/audit, both content factories, both cores and UIs, the authored ramp model, existing relevant checks/browser probes and source audits60/69/71. Only this review document is authored by the reviewer. No runtime, tests, specification, Git state, PR59, pin or assets were edited.

## Required fixes, resolved before build

### P2 — displayed-label narration is not an existing UI capability

**Evidence:** acceptance4 requires “optional narration of the displayed label,” while the build boundary confines product edits to the two content modules. `fair-test-apprentice-ui.mjs:notice` narrates the question/message; `explain` renders card labels without `hearButton`. `source-trail-ui.mjs:tryPage` narrates `r.source.prompt`, not the choices; both tools also narrate help. Neither binder supplies a separate label-reading action.

**Verified resolution:** the actual revised spec at its position summary and acceptance4 now states that existing prompt/help narration remains unchanged and displayed labels can be read aloud by an adult. It explicitly excludes a new automated answer-label narration claim. This resolves the acceptance mismatch without creating an audio feature. **Blocking: false.**

### P2 — “closable help” must not imply persistent Moss closure

**Evidence:** `fair-test-apprentice-ui.mjs:apprenticePage` emits `open` whenever `r.support.includes('help')`. Its help toggle records that support once opened. Closing the current view is possible, but a later selection/check renders it open again. Source Trail instead preserves the current open folds during its rerender. Spec72's unrestricted “closable help” acceptance can be read as promising persistence beyond the existing Moss behavior.

**Verified resolution:** actual revised acceptance4 limits closability to the current view and explicitly records Moss's existing reopen-on-rerender limitation, with no persistent-closure promise or behavior change. It distinguishes Source Trail's closure preservation. No new UI fix is needed to repair the content cues. **Blocking: false.**

## 1. Completeness pass

The exact replacement texts, orders, fitting IDs and feedback are fully specified for three Moss encounters and four Source Trail questions. The total is28 displayed alternatives: Moss12 definite cards, Source Trail12 definite choices and4 unsure choices. Moss blank and Trail blank/unsure semantics are explicitly separate. The old-source acceptance contract names original first-position fixtures, removed IDs, stored contradictions, fresh old-source checks, order/text preservation, no aliasing and retained familiarity.

There is no schema or runtime capability to design. The two existing module factories provide the required change surface. The proposed tests are bounded regression checks in existing suites; no new validator, randomizer, migration or generic distractor analyzer is needed. Phone reading load and actual post-build browser checks remain acceptance work, not proof already supplied by this review.

**Findings:** the two P2 boundary clarifications above, now resolved in the actual spec. **Blocking: false.**

## 2. Dependency and integration pass

`apprenticeSource` clones each case and all six configurations on explicit Start. `validApprenticeSource` requires four source-local bounded cards, not current catalog equality or exactly one historical fit. `checkApprenticeCard` selects and clones the round's own card. `validApprenticeRound` admits bounded recorded card prose/fit/feedback without deriving them again. A new packet can therefore use reviewed wording/order while an old packet retains `careful-incomplete` and its earlier metadata.

`sourceTrailSource` also clones the complete source. `validTrailSource` genuinely permits2–8 own choices, an own definite answer and an unsure choice. `evaluateTrail` resolves the selected label and expected ID from that source, and the existing prefix is combined with its own feedback. Historical checks retain independently bounded outcome/label/feedback instead of being regraded. The origin proposed-link strip uses the selected source-local label, so neutral source names preserve its “was made using” grammar.

A temporary read-only probe parsed all28 candidate alternatives from the spec and substituted them into cloned source packets. Every proposed packet passed its actual source validator; each new Moss packet had one fit. A separate synthetic seam probe retained reversed old sources, removed IDs, changed saved wording and contradictory recorded outcomes, then checked again from each old source and created a new familiar visit. The original round remained unchanged by the new Start. These probes establish existing seam suitability, not implementation completion or full import/browser coverage.

**Findings:** no additional issues. **Blocking: false.**

## 3. Scope and overlap pass

This is a repair of finite supplied answers in existing activities. Moss still separates observation, model-controlled comparison and limited explanation. Source Trail still traces an openly declared B→A origin and distinguishes two representations from independent observation; C's underlying records remain unavailable. No new corroboration capability, learner model, skill mapping, source card or research claim follows.

Varying authored position does not need a shuffle service. Comparable label lengths do not require word-count infrastructure. Current-case equality belongs only in narrow new-catalog regression assertions; it must not become historical admission policy. The spec states those boundaries correctly. PR59 is an identified proposed design reference, not a merged rule or an external-action authorization.

**Findings:** none beyond the acceptance-boundary fixes. **Blocking: false.**

## 4. Project commitments and evidence pass

The most dangerous boundary is **rewriting old learner records with current authored answers or interpreting a fitting supplied choice as independent reasoning**. The contract defends the first mechanically through own frozen sources/check snapshots and unchanged validators. It defends the second through limited outcome language and explicit separation of support, familiarity, model comparisons and ungraded prose; a choice check does not silently assess the repair or private words.

The proposed texts do not invent historical witnesses, physical measurements or private family information. Dependence does not become falsehood/uselessness, and unknown independence does not become proven dependence. The cautious distractors reject withholding in these specified situations, not caution as a general policy. A true but incomplete practical response is correctly treated as failing this reader's need rather than called factually false.

The source-grounding check independently read the exact-commit six-file audit71 copies and recomputed Marble's relevant hard closures: Moss6, sourcing11, union15; the full-vendor target union is10. Two sourcing ancestor meanings changed and five incoming triples were added, with none removed, agreeing with audit72. The runtime overlap is three topics out of its87 at pin `96a7933754af672e1bfdbf7ecb05c325860c6e0d`. Jane's authored choice/optional support patterns and choice-elimination scaffold are real; its source code is MIT while its lesson/docs text has CC BY-SA terms and taxonomy material has separate licenses. These are studied references, not imported lesson/code content or learning-effect evidence.

Audit72 distinguishes its author's fresh source retrieval from the prior asset-specific rights receipt and explicitly does not claim a new museum/chronology refresh. This reviewer has not performed a fresh museum-rights read or inspected the historical photograph in a browser for this content-only review. No changed photo, date fact or rights claim is proposed.

**Findings:** none. **Blocking: false.**

## 5. Mechanical validatability pass

Exact current choice IDs/order/text/feedback and new packet counts can be checked deterministically. So can blank/unsure behavior, old-source admission, fresh checks against frozen metadata, no aliasing, familiarity and recorded contradictions. The spec appropriately requires actual pre-change fixtures rather than recreating an allegedly old packet from a changed catalog. Existing own-source shape validation cannot and should not independently prove that historical outcome prose was logically consistent.

The semantic quality of the alternatives and whether a cautious distractor over-withholds are human content judgments; this review performs them below. Word counts are useful inventory, not a semantic validator. The temporary candidate parse gives Moss label counts21/20/20/21,20/21/20/18 and20/20/20/21; Source Trail's definite label counts are6/4/4,15/16/15,15/17/16 and19/18/20. The new fits are not uniquely longest. These counts do not show browser fit, decoding ability, independence or learning gain.

No heavy-model grading or external service is load-bearing. Actual UI width/focus/scroll checks remain the builder/root's browser gate; this review has not manufactured screenshot, audible speech, device or screen-reader evidence.

**Findings:** none. **Blocking: false.**

## 6. Adversarial content pass: all28 alternatives

The authored model matches the spec: height compares low/smooth12,13,12 against high/rough14,15,14; surface compares low/rough5,6,5 against high/smooth26,25,26; careful compares low/smooth12,13,12 against high/smooth26,25,26. All six configurations remain supplied authored examples. Source Trail's actual A/B/C texts establish B's declared use of A and leave C's underlying records unsupplied.

| Case / position / ID | Adjudication in the existing context |
| --- | --- |
| height1 · `height-incomplete` | True distance observation, explicitly declines the needed causal explanation. Non-fit and feedback are fair. |
| height2 · `height-useful` | Retains B's larger distances and names both changing factors; same-surface low/high repair isolates height in this model. Sole fit. |
| height3 · `height-discard` | Keeping notes is useful, but withholding the observable difference from the message is needless here. Feedback preserves bounded reporting. |
| height4 · `height-overclaim` | Larger distances do not isolate height when surface changed too. The causal conclusion is unsupported by this comparison. Non-fit. |
| surface1 · `surface-overclaim` | Correctly reports which setup went farther but attributes that difference to surface despite changed height. Non-fit. |
| surface2 · `surface-incomplete` | A's shorter model distances can support a practical choice, but this does not answer whether surface caused the difference. Feedback distinguishes incompleteness from falsehood. |
| surface3 · `surface-discard` | The authored rows can be compared without being mistaken for physical measurements. Waiting for real data is unnecessary for describing these rows. Non-fit. |
| surface4 · `surface-useful` | Keeps the observation and fixes the uncontrolled height by comparing surfaces at one height. Sole fit. |
| careful1 · `careful-cautious` | More trials may extend an investigation; they are not needed to retain the existing explicitly limited description. Non-fit without discouraging further inquiry. |
| careful2 · `careful-overclaim` | Universal real-cart prediction exceeds these few model examples. Non-fit and response are correctly limited. |
| careful3 · `careful-useful` | Height changes, smooth surface is controlled, and the claim stays local to shown model examples. Sole fit; no needless repair demanded. |
| careful4 · `careful-wrong` | Identical surfaces help isolate height; changing one introduces a second difference. Non-fit. |
| origin1 · `dates` | C is not B's declared source. Non-fit; source-name label retains proposed-link grammar. |
| origin2 · `photo` | B explicitly names A/PH8646 as the source used to make it. Sole fit. |
| origin3 · `new-witness` | No separate historical witness is supplied or declared as B's origin. Non-fit without inventing such a witness. |
| origin4 · `unsure` | Explicit uncertainty; null/unobserved outcome, never an incorrect definite assertion. |
| observation1 · `note-only` | Reverses provenance and treats the modern derivative as a new historical observation. Non-fit. |
| observation2 · `needs-confirmation` | Independent confirmation could add evidence but is unnecessary to describe the pictured boats/water. Its categorical withholding fails this question. |
| observation3 · `photo` | A supplies the pictured local detail and B restates that picture. Sole fit; no claim that photography establishes everything. |
| observation4 · `unsure` | Uncertainty stays unobserved, distinct from a definite non-fit. |
| independence1 · `shared` | Two cards share one photograph and B adds no separate historical observation. Sole fit. |
| independence2 · `independent` | Different creation times do not negate the declared derivation. The claimed independence is unsupported. Non-fit. |
| independence3 · `unresolved` | B's declared use of A already answers this dependency question; another historical record is not necessary to trace it. Non-fit. |
| independence4 · `unsure` | No definite relationship assertion; unobserved. |
| reply1 · `witnesses` | Card agreement/different publisher do not establish independent confirmation; C supplies dates rather than a second local pictured view. Non-fit. |
| reply2 · `qualified` | States A's local view, B's dependence and C's unresolved independence without collapsing unknown into dependent. Sole fit. |
| reply3 · `withhold` | Correctly identifies the shared photograph but needlessly excludes its bounded local view until corroboration. Non-fit; the shared feedback explains why. |
| reply4 · `unsure` | Unobserved; does not falsely record a definite label as fitting/non-fitting. |

The hostile shortcut “always choose the longest” no longer reliably identifies these fits. “Always pick the cautious wording” also fails because over-withholding alternatives are present where meaningful. This structural observation is not a claim that all superficial cues disappear or that any learner must reason independently. Origin deliberately retains short neutral source names rather than forcing a policy distractor into its source-link task.

A hostile preservation case is an old `careful-incomplete` or `worthless` choice with reversed source order and a contradictory saved fit/outcome. It must render its original source and recorded result; a fresh check must use its own frozen answer/metadata; a new Start must use revised content without changing the old round. The spec names this case and the actual validators/check paths can support it unchanged.

**Findings:** none in the28 content decisions. The two resolved P2 acceptance mismatches are the complete fix list. **Blocking: false.**

## Clearance boundary

The exact narration/help folds have been checked; the content-only builder may proceed. Independent implementation/content review and root's actual browser acceptance checks remain required before a draft. No merge, deployment, PR59 mutation, physical-device claim, research-effect finding or publication approval is granted.
