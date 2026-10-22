# Paris saved-visit source: independent specification review

2026-10-22. Scope: [spec 73](../specs/73-paris-saved-visit-source.md), the preservation prerequisite for the proposed Library pack. Review was performed in separate read-only Claude contexts, invoked by Codex. This is a specification review, not a test or deployment receipt.

- Initial candidate `f8c2e7b`: needs attention, three P2 findings. Existing load-time cleanup could still reshape legacy helper/reading records; the original Paris route lacked its own stored route; copied content needed a bounded storage probe.
- Fold `1218ad1`: Claude confirmed those changes, but identified one remaining part of the load boundary: current-catalogue visit deletion, recorded/draft filtering and progress traversal must also be bypassed for retained records. It requested explicit removed-story and changed-original-route fixtures and stated that approval required this wording, with no further design cycle.
- Resolution `2c2971f`: added each requested bypass, retained legacy node/finished progress, source-only route linkage, the two fixtures, explicit cross-visit writers, and a catalogue-wide new-source-size check. Root verified the narrow changes against the review. No unresolved P1/P2 specification finding remains; implementation still needs its own independent review.

The scope includes English Paris exploration, reviewed packs and the original English route. French's similar shared-code issue remains a named follow-up. No broad reading-level, coverage or upstream-source equality claim is made. Legacy choice counts cannot be reconstructed, so the Library proposal was corrected to say choice position rather than infer a total from current content.
