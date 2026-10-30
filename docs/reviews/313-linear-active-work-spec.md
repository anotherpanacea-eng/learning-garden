# 313 · Independent specification review

2026-10-30. Six distinct read-only contexts reviewed the spec against actual Linear rendering/controller/test seams.

| Lens | Findings and resolution |
| --- | --- |
| Completeness | P2: transient selects across redraw unspecified. Preserve explicit challenge selection and valid removal target; untouched defaults may follow new suggestions. Folded. |
| Dependency | P2: remove active A while previewing B creates closed-chooser/hidden-focus ambiguity. Every confirmed removal now forces chooser open and visible focus. P3: anchors need liveness checks too; explicitly folded and regression required. |
| Scope/overlap | Clear. Native disclosure/current controller; no new state or navigation framework. Existing teaching/context retained. |
| Firewall | Clear after folds. Closed/stale callbacks and refused input protected; no save/evidence on disclosure/jumps. |
| Mechanical validatability | Clear. Actual viewport, element identity, writes and focus checks establish behavior; summaries included in target measurements. |
| Adversarial | Clear after folds. Preview-removal, stale anchors, transient values and refused-DOM-text cases are specified without saved state. |

Verdict: **BUILD-READY** after bounded folds, noP1/unresolved materialP2. Implementation requires independent exact-head review and native/hosted verification. Physical iPad/Safari/VoiceOver and learning effects remain unqualified by Chrome.
