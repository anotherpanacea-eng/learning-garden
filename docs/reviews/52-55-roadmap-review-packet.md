# Roadmap candidates52–55 — independent review packet

**Updated checkpoint: six independent specification lenses completed and findings resolved; see the [review receipt](52-55-independent-spec-review.md).52–54are build-ready at their bounded scope;55is commissioning-only with linguistic/audio/rights/player gates pending.** The sections below retain the earlier author-prepared request and dated GitHub observations as provenance. No runtime implementation, media production, merge or release is cleared by this document.

The content anchor is commit[`061cf4e1e6ccd51b1dbc0bf7d7ddb96309efef06`](https://github.com/anotherpanacea-eng/learning-garden/tree/061cf4e1e6ccd51b1dbc0bf7d7ddb96309efef06) on `docs/next-roadmap-units`. The original reconciliation added an index, queue corrections and handoff. The new independent-review fold changes52–54teaching/matching/recovery wording and candidate/source status, recorded in the linked receipt; the old anchor is now a historical baseline, not a claim of unchanged current bytes. Phonics asset/word approval fields remain pending. Review the actual files, not just the summaries below.

## Candidate reading order and decisions

| Candidate | Read together | Exact decision needed before implementation |
| --- | --- | --- |
|52, Fraction Trail|[Specification](../specs/52-fraction-trail.md), [source audit](../source-audits/52-fraction-trail.md), [17-row crosswalk](../source-audits/52-fraction-trail.csv)|Accept or revise the length-only source exceptions; equal-space construction versus counting marks; actual-flag reading versus requested placement; half-equivalence and beyond-one cases; changed-whole comparison; raw-input/support/familiarity and preserved-state contracts.|
|53, Bundle Exchange|[Specification](../specs/53-bundle-exchange.md), [seven-node source audit](../source-audits/53-bundle-exchange.md)|Accept or revise fixed inventory and reversible exchange; full frame versus wrapped bundle; noncanonical quantity versus written digit/value; zero ones; teen-before-named-ten teaching bridge; motor/handwriting exception; exact shown-example familiarity.|
|54, Instructions for a Reader|[Specification](../specs/54-instructions-for-a-reader.md), [13-node source audit](../source-audits/54-instructions-for-a-reader.md)|Review every supplied sentence and scene premise; necessary versus flexible order; persistent early-invitation consequences; order versus cause; plan versus draft; reader knowledge; original/assembled/dictated/oral distinctions; accessible communication and vocabulary exceptions. The runner must never claim to parse original prose.|
|55, phonics commissioning|[Brief](../specs/55-phonics-content-audio-brief.md), [seven-node source audit](../source-audits/55-phonics-content-audio.md), [word audit](../content/phonics/words.csv), [audio requests](../content/phonics/audio-requests.csv), [shared texts](../content/phonics/shared-texts.json), [manifest example](../content/phonics/manifest-example.json)|Decide the pronunciation model and teaching sequence; audit all word/sound correspondences and meanings, conditional isolated /h/, stop samples, scope/access exceptions and adult-supplied text. Later exact recordings require linguistic/audio/rights clearance. This brief is not a player specification or permission to commission/produce media.|

Review each candidate's complete prerequisite closure against actual source descriptions/evidence and edge reasons. A count is not semantic clearance. Keep a separate decision for every scoped exception or proposed teaching bridge. No builder self-clearance and no broad “curriculum complete” conclusion.

The reviewed six-act programme and earlier games do not automatically approve these additions. Existing Number Garden, Sharing Counter, letters and Word Garden are useful foundations, not evidence that these new targets are already taught or that a learner has mastered their prerequisites.

## Source reconciliation at this checkpoint

Marble remote remained`87118bb0a87374f9dec3940d91e4319ce6b05da2` when refreshed for reconciliation. Recomputed all four selected hard closures against that snapshot and compared the crosswalk contents with their exact unions:

| Candidate | Targets | Distinct hard predecessors | Target/ancestor union | Current source comparison |
| --- | ---: | ---: | ---: | --- |
|52|5|16|17|All union names/descriptions/evidence and incoming edge triples match the bundled pin. The original audit retains its earlier dated snapshot; this is the later reconciliation.|
|53|3|6|7|All union names/descriptions/evidence and incoming edge triples match the bundled pin.|
|54|5|9|13|Twelve bundled nodes retain matching names/descriptions/evidence; the spoken-instruction target is upstream-only, and the feedback node has the documented soft-edge difference.|
|55|3|5|7|All union names/descriptions/evidence and incoming edge triples match the bundled pin.|

Targets can also be predecessors, so the last column of counts is not the sum of the first two. These checks preserve the existing bundled pin and its1,590 topics /3,221 edges. Jane design references and layered licenses remain as documented per candidate; no new upstream code or media is incorporated. IES maintenance responses remain source limitations, not verified recommendations. The candidate source audits preserve Marble ODbL database and CC BY-SA text attribution; public examples contain no learner records.

## Separate PRs and exact scope

GitHub metadata was read on2026-10-21 at approximately18:23 UTC. All six PRs were open drafts, unmerged. Formal GitHub review-submission lists were empty for PRs30–35; PR35 review threads and PR34/35 discussion timelines were also empty. That does not erase earlier external reviews documented in PR descriptions, and it does not create a new review clearance.

| PR / branch | Observed head | Base and recorded status |
| --- | --- | --- |
|[30](https://github.com/anotherpanacea-eng/learning-garden/pull/30), `fix/cloud-mobile-quality`|`9355b58b54a48d1dbb3a64eef56d87e9060d8f52`|main. Narration-choice/save-failure repair with prior reported tests; independent clearance not established here. Real audible/device checks remain limited as described in its evidence.|
|[31](https://github.com/anotherpanacea-eng/learning-garden/pull/31), `docs/story-milestones-films`|`dd79f5d1b6b26ca9dccf48abb7c05f68ae87067e`|main. PR description records Claude clearance of89fa8e2 followed by the optional control-wording correction indd79f5d. This is historical reported evidence, not a new exact-head review by this author.|
|[32](https://github.com/anotherpanacea-eng/learning-garden/pull/32), `fix/bramble-frozen-text`|`a4565daddc9f92eec9dea113d1d095d13e287b01`|main. PR description records independent Claude implementation clearance of this head. No new review or test run performed during reconciliation.|
|[33](https://github.com/anotherpanacea-eng/learning-garden/pull/33), `build/whole-batch-gathering`|`dc77b3a429f71de0ce382ed36f459393c56d643a`|main. PR description records independent spec lenses, implementation fixes and Claude follow-up clearance of this head. Preserve its own validation limitations.|
|[34](https://github.com/anotherpanacea-eng/learning-garden/pull/34), `build/parcel-packing`|`3149eada6e2aaea5a6b3844c97ce21fa5b95545c`|main. Prior full-suite/browser verification is documented; **Claude implementation review is still pending**. The user declined a Codex substitute.|
|[35](https://github.com/anotherpanacea-eng/learning-garden/pull/35), `docs/next-roadmap-units`|`061cf4e1e6ccd51b1dbc0bf7d7ddb96309efef06` before this reconciliation|`docs/story-milestones-films`. Documentation/content authoring only; all new specs/source dispositions pending. This head is the frozen candidate-content anchor above; the later reconciliation commit is recorded in the branch history.|

All five main-based PRs were based on`9613085125d3b8f2ddf9e1ecadd108eb14a054db` at inspection. Git ancestry confirms PR35 contains PR31's head and none of PR30/32/33/34's branch heads. The authoring delta before reconciliation consisted of16 documentation files and no runtime, tests, scripts, vendored graph or atlas changes. Do not treat PR35 as an integrated release of those games.

## Future release composition — work identified, not performed

Compared changed path sets from the separate branch heads to main. **Shared paths are potential reconciliation points, not proof of a merge conflict.** No merge simulation or integration branch was created.

- PR30 overlaps PR33 and PR34 at `dist/app.mjs` and `README.md`: preserve voice selection/lifecycle and save-failure behavior while adding routes/import/notes handlers.
- PR33 and PR34 overlap at `dist/app.mjs`, `dist/notebook-sections.mjs`, `dist/progress-transfer.mjs`, `curriculum/atlas.json`, `curriculum/topic-coverage.csv`, `docs/learning-atlas.md`, `docs/upstream-opportunities.md` and `README.md`. Preserve both optional state roots, import/recovery and notebook entries; regenerate atlas outputs from deliberately combined source references, rather than accepting one side's generated files.
- PR32 has no shared changed path with these four PRs in this comparison. That is not an integration-test result or permission to omit its saved-round preservation behavior.
- PR31 supplies the documentation base for PR35. Keep the planning chain explicit if a later authorized release changes the base; do not retarget/merge this PR merely to obtain a green conflict indicator.

A future authorized integration must preserve the separate review histories, run the relevant complete suites and real browser journeys on the composed candidate, exercise waiting café/delivery/Loft/word work and imports, and obtain the required exact-candidate independent implementation clearance. Individual branch tests and reviews do not automatically cover a combined release. This work window authorizes none of the merges/deployments/media publication.

## Completion and resume boundary

The requested authoring sequence is complete as a **pending-review packet**: fraction, exchange, multi-sentence instructions, phonics commissioning and queue reconciliation. At that authoring checkpoint the next implementation step was blocked on independent specification review. The linked updated receipt now clears bounded52–54builds; packing remains blocked on Claude implementation review. No suitable review has arrived during this pass, and no substitute review is manufactured.

For a future reviewer, record candidate commit, reviewed files/asset hashes, role/scope, findings, accepted/rejected exceptions, verification actually performed, and a clear disposition. Separate specification, content, audio/rights and implementation decisions. Do not mark pending rows approved based on mechanical checks. No review requests/messages are sent by the author.

During any remaining pass in the existing window, inspect changed heads/reviews and address concrete new evidence or documentation defects within this packet. An unchanged pending-review state is not a reason to generate more lessons, repeat tests, rewrite checkpoints or claim continuous work. Preserve the original end time: **2026-10-21 at17:03 America/New_York (21:03 UTC)**. At/after that point, make only the authorized final checkpoint/report and stop; do not extend or reschedule.
