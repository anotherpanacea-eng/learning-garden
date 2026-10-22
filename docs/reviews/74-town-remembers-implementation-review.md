# Town Remembers: implementation review and verification

Separate read-only Claude reviews, invoked by Codex on 2026-10-22, approved `0663944` and the final bounded history repair at `11ee575`, with no outstanding P1/P2. The reviewer inspected all six finite forms, own-source eligibility, choice rotations, frozen examples, support, explicit Start, optional kept dates, caps and recovery. It did not execute tests.

The final follow-up removes an unrequired 200-total-record cap that could hide a notebook after adding an errand beside many raw siblings. The 12-readable-history and 48-used-key caps remain, with disclosure before trimming a closed readable record. Global import limits remain unchanged.

Root verification: 113 source suites passed on the implementation. The final history fold passed 374 core checks and 72 UI/storage checks, including 200 raw siblings plus a new readable errand. Real Chrome journeys passed 230 assertions across all six forms at phone and tablet sizes. They cover the home invitation, actual Keep buttons in all three source games, same-day waiting, changed answers, separate support, reload, source-game preservation, keyboard Keep, touch targets, unknown-form recovery and actual notebook download/import. Synthetic screenshots were inspected. No physical iPad/Safari, audible narration or learning-effect claim is made.

All fixtures are synthetic. No runtime taxonomy change, identity field, network service, source-game outcome update or café stock change is introduced. This is draft-PR preparation, not merge or deployment.

## American-spelling follow-up

A separate Claude review of `d8686c9` checked the requested display-copy changes against saved-record validation and the earlier approved runtime. It found one introduced accessibility typo: the fixed HTML attribute `aria-labelledby` had been respelled. Commit `93d047a` restores the standard attribute, satisfying the reviewer's explicit approval condition, and adds a browser assertion for the named errand region. All other changes were approved as wording only; older frozen strings remain unchanged. Root verified 374 core checks, 72 UI/storage checks and 242 browser assertions after the correction. This is still a draft, with no merge or deployment.

## Visible fact exposure repair

The reviewed spec 74 fold at `cb178b3` limits prior multiplication-fact exposure to actually displayed, complete equal-group explanations in `share-buns` and `trays-reverse`. The runtime at `851dc87` adds frozen-text and helper-shape guards, passes qualifying facts through the existing bridge on Check, visible Help, reopened detail, or expanded readable notes, and excludes choices, hidden Help, collapsed notes and raw records. It does not regrade the Town errand or earlier observations. Independent read-only Claude implementation review **approved `851dc87` with no P1/P2 findings**. The reviewer did not run tests.

Local verification passed 453 Town core assertions, 72 Town UI/storage assertions, and 258 Chrome browser assertions. The browser exercised an actual checked 3-by-4 bun explanation, a waiting broad draft becoming known, a later correct answer losing the false “fresh” label, separate 2-by-6 Help, reload, collapsed and expanded notes, and raw-history exclusion. Related broad, story, garden, facts, café, source-game, bundle-exposure, progress-transfer and core checks passed. After the independent review, only browser assertions were strengthened; runtime code did not change. These synthetic checks do not establish learning benefit or physical-device behavior. The repair remains unpushed pending root verification.
