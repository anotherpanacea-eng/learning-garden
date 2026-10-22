# Hundredths Bridge: independent specification review

A separate internal Codex reviewer examined spec 85 and its source audit at `55cf72b66b611b7533680acb26a3bb2a5e94676d`. The first verdict found no P1 and two P2 ambiguities: the proposed square could be read as physically the same-size strip as Tenths Table, and the chooser exposed decimal notation without allocating a case or setting `sourceShown`.

The author clarified the same conceptual whole redrawn as a square, gave the exact frozen `wholeLabel` and a bridge-only `wholeId`, and made the chooser's decimal exposure explicitly untracked and unknown. `sourceShown` now means only that the full active panel appeared. The reviewer cleared both findings on exact docs head `318cecbedca66718e8eb9c58d8f50893a6396e8f`, with no remaining P1/P2 from that focused pass and a build-ready verdict.

This is an internal specification review. It does not claim runtime, browser, hosted CI, external-model, merge, or deployment clearance. The content uses original diagrams and copy; the source audit identifies the limited Jane, Marble, and primary-standard references.
