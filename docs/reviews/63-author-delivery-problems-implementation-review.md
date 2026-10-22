# Author delivery problems: implementation review and verification

Status: **APPROVED FOR DRAFT by actual local Claude follow-up; root verification complete**. This is local draft readiness, not exact-head GitHub clearance, merge or deployment.

## Independent review and fixes

The separate [specification/content review](63-author-delivery-problems-spec-review.md) cleared the conditions, feasibility proof, historical boundaries and original/source capacity disclosure before build. Its independent breadth-first search checked all42,840 distinct grid-position triples without using the implementation's Manhattan-distance formula. Minor preview-copy and route-ending wording were resolved before implementation.

Actual local Claude performed a restricted read-only implementation review and approved for draft with no P1/P2 findings. Root folded its P3 suggestions: the current feasibility preview is also placed in the action status after a selector change; closing authoring focuses the placement prompt; and origin navigation requires a different readable free map both when displayed and when activated. Self and other-job metadata remain escaped and visible without disabling the job's own frozen map.

Actual phone screenshots exposed the compact map being buried below the form. A dedicated original authoring diagram now sits beside selectors or before them at very narrow widths, with readable axis numbers and landmark letters. The full coordinate key and generated request remain below both. The ordinary placement/route figure is unchanged. Native help and audio are bound to their connected originating map, preventing a queued old control from marking the newly created job. Same-map help open state stays transient rather than being reconstructed from support history.

A fresh actual Claude follow-up read the final UI/CSS, browser suite, relevant integration cases, source audit and specification/helper sections. It approved for draft with no P1/P2. It did not rerun core review, execute tests or view screenshots; root separately did those checks. Remaining minor notes are that a boundary marker may obscure an axis arrowhead while its axis letter remains visible, and human screen-reader announcements of a freshly rendered status region are unverified. Root added the suggested narrow-breakpoint checks. No repeated full specification review or new framework was necessary.

## Root verification

- All90 `test/*.mjs` scripts passed after the final UI changes. Story-pack validation and deterministic atlas checks passed.
- New core:168,474 assertions, including independent breadth-first feasibility checks across42,840 triples, exact canonical requests,6/12/19-move examples, invalid/incomplete drafts, one allocation, cap/source eviction, raw/future preservation and old over-limit sources/contradictory recorded outcomes.
- New integration:78 assertions, including actual generic transfer/reload, explorer isolation, save-off, pure page/notes rendering, old free-map and authored-source independence, raw optional formats, self/other-job origin metadata and preservation of unrelated games, supplies and exposure records.
- New browser suite:182 assertions across desktop1440×1100, touch tablet820×1180 and touch phone390×844. It covers selectors, invalid/valid creation, actual route solving, frozen jobs after source revision, exact history warnings, local focus, saved draft/reload, notes, unsafe IDs, native help boundaries, narration request routing,44px controls and no horizontal overflow.
- An additional root browser probe passed66 assertions across widths320,375,380,381,400,650,651,820 and1280. Controls, arrow room, map position and legibility pass; all12 ordinary map figures are byte-identical to the parent across free/supplied jobs and the three pages.
- Parent browser suites each passed17 assertions; parent core/integration checks passed too. Final phone and desktop authoring screenshots were actually viewed.
- Atlas remains144 scoped references across77 source topics; no new reference or runtime source pin. The four existing map references describe bounded coordinate/length practice, not general problem posing or independent writing.

Reproduce with `node test/cartographer-author-checks.mjs` and `node test/cartographer-author-integration-checks.mjs`. The optional `test/cartographer-author-browser.js` accepts MAP_AUTHOR_TEST_URL, PLAYWRIGHT_MODULE and CHROME_PATH for an installed local test browser; no browser dependency enters the website.

Verification uses synthetic local state. Narration uses a synthetic local voice stub, not an audible quality check. Touch emulation is not physical Safari/iPad testing; human VoiceOver, learning effects, independent authorship, partner participation, hosted CI, composed release and production behavior are unverified. Held app/media/global-style/README/mobile paths are unchanged. No merge or deployment.
