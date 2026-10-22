# Coin Counter: implementation review and checks

Local build of [spec57](../specs/57-market-day-coin-counter.md), following [independent specification review](57-coin-counter-spec-review.md) and [source audit](../source-audits/57-market-day-coin-counter.md). It is stacked on PR42's `337c8c17480cff140465064fbd2b2d7d8b8f7cdb`; other runtime/reliability branches are not composed here.

## Actual independent Claude review

The installed Claude reviewer read the public candidate in a separate context with read-only tools. It found two P2s: restoring an open help panel could mark a new/resumed round as helped, and the exchange sentence described whole-mat counts as though they were the traded coins. Both were fixed. A second read-only Claude pass **approved for draft**, confirmed both repairs, the steady action/result focus and safe id allocation, and found no remaining P1/P2. Claude did not run tests/browser or inspect a full Git diff; those checks below are the root's work. This is not a GitHub approval or permission to merge/deploy.

Related small fixes: singular coin/cent/dot labels and coin-name plurals; one-shot support buttons no longer claim to be reversible toggles; fractional unreadable ids permit a safe larger integer while enormous ids still refuse allocation. An initial Coins/read-aloud action can create an empty first practice round, as the spec permits; no additional view-state machinery was added to remove this nonblocking behavior. Root browser checks reproduce the actual help/exchange bugs and verify their repairs.

## Verification

- All78 existing/new `test/*.mjs` scripts pass. Core:18,003 assertions across642 bounded vectors, all six directed conserved exchanges, eight requests and their exact alternatives, historical outcome/price mutations, caps, unsafe/fractional ids and sibling isolation. Integration:40 assertions using real storage, transfer, explorer switching/save-off and paused Café/Post/Loft/Workshop/Fair Test state.
- Full Chrome flow:133 assertions across desktop1280×900, touch-enabled tablet820×1180 and phone390×844, with reduced motion. Includes repeated additions without scrolling to the top, exact drawn counts, alternative payments, revisions and earlier-check labels, conserved exchanges, identical exact payments,25pennies versus1quarter, limits, dots, reload, old-state preservation, future-root escaping and44px/no-overflow checks. Root inspected tablet compare and phone Make screenshots.
- Targeted Chrome flow:15 assertions for the two Claude repairs, resuming an unhelped round, singular units, remove-to-zero focus, unsafe-id refusal and narration routing with a synthetic speech API. No actual audibility claim.
- Reusable browser regressions:8 assertions in [coin-counter-browser.js](../../test/coin-counter-browser.js), exercising actual native help toggles, new/resumed rounds, exchange wording and action focus. This is an optional developer test, not a runtime dependency. With `dist` served locally and Playwright available: `COIN_TEST_URL=http://127.0.0.1:8000/ node test/coin-counter-browser.js`. Optional `PLAYWRIGHT_MODULE` and `CHROME_PATH` select an already-installed test runtime; no machine-specific paths are committed.
- Story packs, atlas generation/check,352 changed-document file links, whitespace and staged privacy inspection passed before publication. The unchanged source graph remains1,590 topics /3,221 edges /54 domains; two bounded references bring the local atlas to135 references across71 topics. No source pin, license, real learner content or upstream assets are added.

## Limits and continuation

This is supported US-cent practice with original schematic art. No real-coin recognition, independent arithmetic, UK notation, change, budgeting, real economy or learning-effectiveness claim follows. Physical Safari/iPad, human screen readers and actual spoken voice quality remain unverified. The Café invitation changes no meals, inventory, serving goal or numerical evidence. The separate mobile task's held paths remain untouched.

The draft is ready for the existing review/release process. Root re-verification of an exact release candidate, composition, merge authorization and deployment remain separate. The bounded overnight work can continue with a Cartographer's Table specification; this coin slice does not complete the money strand.
