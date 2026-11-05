# Photo Studies378 · independent specification review

Six separate reviewer contexts examined [the specification](../specs/378-photo-studies.md) against actual repository seams. This is a specification/content review, not implementation clearance.

| Lens | Finding | Resolution |
| --- | --- | --- |
| Completeness | P2: example reveal undefined for historical teaching lists shorter/longer than four frames. | Reveal at exampleSeen≥min(3, own teaching.length), retain afterward. Short/long-source checks required. |
| Dependency/integration | No findings. Existing Lens, Notes, Cell and bundled-photo seams verified. | No change. |
| Scope/overlap | No findings. Independent study root deepens existing room and read-only return. | No change. |
| Firewall | No findings. Greatest risk is treating learner labels as verified biological evidence. | Schema has no correctness/mastery fields; explicit limitation, blank Keep and frozen return retained. |
| Mechanizability | No findings. Structure and lifecycle are testable; scientific accuracy/learning are not claimed. | No change. |
| Adversarial | P2: pointer and keyboard could compete for one pending line. | One pending kind owns the line; ignore competing drawing input. Finish/Cancel settles once; late pointer completion is inert. Test both orders. |

No absent lens or P1 finding. Panel verdict after these bounded folds: BUILD-READY. Independent Claude science/interaction review identified one P1 (point objects could quickly exhaust the shared notebook) and fifteen P2 clarifications. The specification now uses bounded compact coordinate strings, a measured100KB compact-JSON study limit and twenty-study capacity fixture. It also specifies dots/line width, touch and keyboard arbitration, composition-aware text, data-derived speech, historical help, visible source attribution, truthful navigation and local field/reset disclosures. Claude’s repair review confirmed the P1 and earlier P2s resolved and made build readiness conditional on two precise sentences: compact JSON is the100KB measurement; switching saving off removes persistent copies while retaining memory, and blocked reset removes nothing. Those sentences are folded in. No unresolved review finding; BUILD-READY.
