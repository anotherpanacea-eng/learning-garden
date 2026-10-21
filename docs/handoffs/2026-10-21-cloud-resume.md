# Cloud handoff: film roadmap, gathering trays and parcel packing

**Paused at the user's request on 2026-10-21, approximately15:36UTC.** Resume only on the user's instruction. The requested roughly five-hour build window was interrupted and then paused; do not report five continuous hours of work. This packet contains generic project information only.

## Resume point

Repository: https://github.com/anotherpanacea-eng/learning-garden

Working branch: **`build/parcel-packing`**. This branch contains spec51, its six-lens review receipt, the unfinished packing implementation and this handoff. It was created from `main` at `9613085125d3b8f2ddf9e1ecadd108eb14a054db` and does **not** include PR31–33. The exact handoff commit is the commit adding this file; inspect it with `git log` rather than assuming the branch has not advanced.

Read `AGENTS.md` and `CONTRIBUTING.md` first. This public, browser-local app contains no real learner identity, uploads, analytics or runtime AI. Preserve parent-guided exploration, open destinations and distinctions between support, prior exposure and independent attempts. Substantive specification and implementation reviews must use independent contexts. Do not merge or deploy an uncleared candidate.

For a fresh cloud checkout:

```sh
git clone https://github.com/anotherpanacea-eng/learning-garden.git
cd learning-garden || exit 1
git switch --track origin/build/parcel-packing
```

Read `docs/specs/51-parcel-packing-and-remainders.md`, `docs/reviews/51-parcel-packing-spec.md`, then the packing modules/tests and their small app/import/notes integrations. Check current GitHub heads and review threads before acting; this is a dated handoff.

## Completed and pushed in this pass

| PR | Branch / head at pause | Actual state |
| --- | --- | --- |
| [31 — film milestones and authoring order](https://github.com/anotherpanacea-eng/learning-garden/pull/31) | `docs/story-milestones-films` / `dd79f5d1b6b26ca9dccf48abb7c05f68ae87067e` | Draft. Film needs inventoried across current loops/all six acts, producer briefs and delivery/fallback requirements; roadmap reordered. Claude cleared89fa8e2; dd79f5d only folds its optional playback-control wording correction. Atlas/whitespace and78relative file links passed. |
| [32 — frozen Bramble wording](https://github.com/anotherpanacea-eng/learning-garden/pull/32) | `fix/bramble-frozen-text` / `a4565daddc9f92eec9dea113d1d095d13e287b01` | Draft, independently cleared by actual Claude. Saved prompt/explanation/labels can survive copy edits while math, scene, units, shapes and practice stay exact. All67existing check scripts passed; focused core28,031/UI786assertions, story-pack/atlas checks passed. |
| [33 — whole-batch gathering trays](https://github.com/anotherpanacea-eng/learning-garden/pull/33) | `build/whole-batch-gathering` / `dc77b3a429f71de0ce382ed36f459393c56d643a` | Draft, exact head independently cleared by actual Claude follow-up. Spec50 and its review receipt included. All69scripts pass, including3,872apparatus transitions and146UI/storage assertions. Isolated Chrome desktop/tablet/phone journeys57assertions pass; no page errors/overflow, keyboard/error/result focus, reload and waiting café/Post Office preservation checked. No physical-iPad/audio/effectiveness claim. |

All three were verified pushed, clean and mergeable at pause. No new PR in this pass was merged or deployed. Current `main` was verified as9613085. The public site remains https://after-the-storm-learning.anotherpanacea.workers.dev/ . The new activities are not live.

An unrelated open [PR30](https://github.com/anotherpanacea-eng/learning-garden/pull/30), `fix/cloud-mobile-quality` at9355b58b54a48d1dbb3a64eef56d87e9060d8f52, preserves narration choices and reports save failures. It was noticed but not reviewed or changed in this pass. Do not silently omit it when reconciling future releases.

## Film and curriculum decisions

Read `docs/story-milestones-and-films.md` on PR31's branch. Commission the ActII **A Town of Our Own** celebration anchor and optionally the12–20second **A tray for the gathering** vignette; develop ActIII exchange and finale storyboards. Later milestones concern reciprocal exchange, evidence/disagreement, a learner-authored project, then welcoming a new apprentice. The town stays rebuilt after ActI. Every cinematic ending has a complete still/text/skip/replay route; films never certify mastery.

The existing four films are self-contained HTML players, not interchangeable MP4 files. The commissioning document gives the actual iframe/control/message contract and accessibility/sound behavior. A conventional video asset needs a reviewed adapter. No learner artwork, dialogue, voices or progress go to a producer.

The roadmap continues with contextual remainders/multi-digit foundations, fractions on a line and fraction–decimal bridges, purposeful multi-sentence writing, learner-chosen fair comparisons, classification, coin values and cartography. Reviewed phonics content/audio remains a parallel priority; browser narration is not systematic phonics instruction.

## Packing work in progress

A second unit was begun after gathering cleared. **It is implemented locally, but NOT implementation-reviewed or browser-verified.** The cloud handoff is a WIP source snapshot, not clearance to publish it.

Four requests:17/capacity5,23/6,29/4,20/5. Children pack countable seed envelopes into eight bag spaces and choose either full welcome kits or carrying every envelope with the fewest loaded trips. A trip means one bag carried outward; empty returns are excluded. The exact-fit case prevents teaching “always add one.” Noncanonical5/4/4/4packing of17is valid for four loaded trips, but not for three full kits plus two loose spares.

Files:

- `dist/parcel-packing-content.mjs`, `parcel-packing-core.mjs`: exact finite model, separate readings and purpose answers, strict historical semantics, support chronology, keep/seal and raw recovery.
- `dist/parcel-packing-ui.mjs`, `parcel-packing-art.mjs`, `parcel-packing.css`: Pack/Read/Purpose/Keep pages, original bag/envelope pictures, optional worked example, narration and explicit supported preparation. Pure `renderParcelPacking(state)` returns `{html,facts}` from the actual visible components, avoiding the separate manual exposure list that missed examples in gathering's first review.
- `dist/app.mjs`: route `#post/packing`, entry, binder and rendered-fact wiring; exclusion from generic connection actions and Bramble ending-film detection.
- `dist/post-office.css`: imports the scoped packing stylesheet. No new indexHTML dependency.
- `dist/progress-transfer.mjs`, `dist/notebook-sections.mjs`: optional root, raw unsupported import/recovery and escaped notes; no eager initialization.
- `test/parcel-packing-checks.mjs`, `test/parcel-packing-integration-checks.mjs`; scoped README/atlas/source-opportunity updates.

### Verified so far

- Six independent specification lenses completed; threeP2requirements and oneP3grammar clarification were folded before build. Receipt records each lens and limits.
- Core suite: **19,600finite transition boundary checks** passed, including every selected-bag index, conservation/capacity boundaries, noncanonical delivery, actual readings versus goal predictions, numeric grammar, immutable artifacts, history/support consistency and recovery.
- UI/storage integration: **129assertions** passed, including real explorer/import/save-off/reset paths, unsupported raw data, and a genuine incoming café connection plus resolved waiting rival fixture.
- The existing message integration suite passes **265assertions** after the route guard fix below.
- Story-pack validator, atlas regeneration/check and whitespace check passed. Packing-only atlas has124references across65topics; this is a declaration count, not full coverage. PR33's separate atlas has123references across65topics. Neither includes the other's new mappings.

### Not finished — next actions in order

1. **Run the full suite again.** Its first69-script sweep stopped at a brittle exact-string assertion in `message-integration-checks.mjs` after the Bramble exclusion array changed. Root changed the implementation to a separate `slug!=='packing'` guard, preserving that existing array. Targeted message265and packing129checks now pass, but the full sweep was **not rerun** before pause. Do not claim all69packing scripts passed.
2. **Inspect and exercise the actual browser UI.** A local preview was started but no packing browser journey ran. Check Chrome/tablet/phone widths, real touch-sized/keyboard controls, correct CSS bag-card classes, selected-bag/disabled-control focus, raw input/caret, invalid error correction, help/example steps, keep/seal focus, both purposes, exact fit, noncanonical packing and reload. Seed only fictional/synthetic explorers. Enter directly with a resolved paused Bramble visit and an incoming connection; no Bramble film/connection panel should appear and waiting game data must stay exact.
3. **Independently review the final packing implementation.** Use actual Claude if available under the established project gate. It has received no implementation review yet. Review strict saved-source/assessment semantics, support timing, displayed facts, source scope and preservation; fix real findings and verify the exact final head. Do not substitute builder reports or schema checks for substantive review.
4. **Reconcile branches before any release.** PR33and packing independently edit common app/import/notes/atlas files. They are separate branches from main; resolve their integration deliberately and retain both sets of references/tests. Reverify a combined candidate and clear the actual integrated head as required. PR32's repair should also survive release composition. Do not force-push or discard another branch's changes.
5. Update the WIP PR with actual validation/review results. Further roadmap work follows only after the bounded unit is correct. Merges/deployment were not newly authorized by this handoff; obtain/respect the user's resumed scope.

Useful checks from the repository root (Node is the only requirement for these scripts):

```sh
node test/parcel-packing-checks.mjs
node test/parcel-packing-integration-checks.mjs
for check in test/*checks.mjs; do node "$check" || exit 1; done
node scripts/check-story-packs.mjs
node scripts/build-learning-atlas.mjs --check
git diff --check
```

Browser tools vary in cloud environments. Use an isolated test browser/profile and synthetic records. The Mac's first temporary Python preview server dropped parallel imports; a queued/threaded server fixed it. That was a preview-server defect, not a production loading fix. All local preview servers were stopped for this pause. Do not depend on private scratch files, local browser sessions or machine credentials.

## Sources and deployment boundary

Specs50/51refresh Jane `d4903954d7c4d8118cbd1d2f7ed770544fd4ac81` and Marble `40372cfe9531b4f94a3e5fe0a6ff2b22f6d62c6b`; the bundled graph stays at96a7933754af672e1bfdbf7ecb05c325860c6e0d. Source descriptions/edges were checked, not inferred from names. Spec51documents its exact26-IDhard predecessor closure and formal-method exceptions. Its remainder topic is explanation only; no long/short division, broad multistep solving, rapid recall or independent decoding claim. No new upstream code/prose/assets were incorporated.

Production is the existing personal Cloudflare Worker named `after-the-storm-learning` on the `anotherpanacea.workers.dev` subdomain. The Mac's default Wrangler account was the wrong organization; cloud must verify intended authorized project/account rather than assuming a default login. Credentials and deployment config are intentionally outside this public repository and are not portable via this packet. No deployment should copy local account identifiers, tokens, test files or QA output into public assets.
