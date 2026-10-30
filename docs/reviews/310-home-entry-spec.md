# 310 · Home entry specification review

2026-10-30; independent of the spec author. Six separate read-only Sol reviewer contexts inspected [spec310](../specs/310-home-entry.md) and its actual repository seams. No reviewer built code, executed browser tests, inspected private learner material, or cleared a held PR.

| Lens | Findings | Result |
| --- | --- | --- |
| Completeness | P2: the allegedly complete Explore list missed Post/Workshop and did not explicitly account for story/curiosity chooser links. | Folded into finite list. |
| Dependency/integration | P2: existing start/replay bindings lacked the assumed ownership guard. P2: old Home and appended Archive/Bell/Rhythm destinations needed explicit replacement. Pure readers and subject-current routes verified. | Both folded. |
| Scope/overlap | P3: same finite-list ambiguity; global navigation still retained those places. No Field Journal, save-state or route-framework expansion found. | Superseded by the more specific P2 inventory fold. |
| Firewall | P2: stale Home callbacks could affect another explorer; the strongest risk was only rhetorically covered by assumed guards. Story inheritance, private drafts and no inferred ability were otherwise bounded. | Binding-time ownership contract added. |
| Mechanical validatability | No findings. Real destinations, whole-book nonmutation, actual browser transfer, save counts and stated physical-device limits give substantive evidence seams. | Clear. |
| Adversarial | P2: retained story-start callback could mutate a newly selected explorer with saving off. P2: same missing destination inventory. | Explicit direct-callback test and owned binding required; list completed. |

**Synthesis:** initial **BUILD-READY-WITH-FIXES**, no P1; two deduplicated P2s (ownership and complete destination replacement), now resolved in the specification. Final **BUILD-READY**. No lens was absent. The independent dependency reviewer rechecked both folds against the binding/list seams and confirmed them resolved before implementation; this does not require repeating the whole panel for these bounded clarifications.

The most dangerous edge is an old Home callback acting on another explorer’s notebook. The spec now requires guarding at the actual existing app binding sites, not relying solely on event bubbling/capture, and testing both retained callbacks and detached clicks. The finite Explore inventory now includes the current appended Home-only invitations and explicitly replaces that tail.

Limits: source review establishes specification readiness. Exact-head independent Claude implementation clearance, native visual/interaction checks, privacy inspection, merged-asset equality and hosted acceptance remain required. Physical iPad/Safari, VoiceOver and learning effects remain unproven by Chrome tests.
