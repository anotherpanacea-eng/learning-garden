# Paris saved pages: implementation review and verification

Separate read-only Claude review, invoked by Codex on 2026-10-22.

- `2c7679e`: no P1/P2 runtime finding, but one P2 acceptance-coverage finding. Reset, legacy/recovery explorer switching, full-size pretty-printed downloads and removed exploration stories needed stronger tests.
- `40f64d7`: approved. The missing tests now exercise the actual loaders, report wrapper, import byte limit and explorer controls. The postcard helper lookup cannot fall back to current content. Malformed support remains stored unchanged but is interpreted cautiously in notes and text-length suggestions.
- `923ba4e`: approved final wording fold. Unknown support no longer produces a claim that help was used. No outstanding P1/P2 remains.

Root verification: 112 source suites passed after the substantive repair, including 287 saved-source checks. The final wording fold passed all 103 Paris exploration checks. Real Chromium journeys passed 60 assertions across phone and tablet sizes: captured choice/order/helper reload, changed-catalogue scoring, first-to-second passage continuity, recovery, keyboard fresh start, touch targets and actual notebook download/import. Synthetic screenshots were inspected. This does not establish physical iPad/Safari or audible-speech behavior.

The 200-visit/two-explorer probe retains all visits below the specified 3 MiB compact-storage budget; each 100-visit pretty-printed report fits the existing import cap and round-trips through prepare/import. These are representative finite probes, not unlimited storage claims. No caching layer was added.

## Overlap with PR65

[PR65](https://github.com/anotherpanacea-eng/learning-garden/pull/65), at `abe2649`, independently addresses the same starting defect with per-question snapshots. Its useful same-ID/reordered-choice scenarios were compared with this implementation. A probe and [review finding](https://github.com/anotherpanacea-eng/learning-garden/pull/65#issuecomment-6338798086) show that its current-catalogue route filter can still delete a saved visit; unopened pages and helpers remain live.

This candidate supplies the reviewed whole-visit boundary. A synthetic PR65-style question snapshot is retained byte-for-byte as a recovery record, without reconstructing missing pages or helpers. Neither draft has been deployed; PR65 is left intact for coordination. Use one integrated candidate, not sequential competing repairs.

New code and all tests use synthetic records only. This receipt prepares a draft PR; it does not merge, deploy, or clear French’s separately named preservation follow-up.
