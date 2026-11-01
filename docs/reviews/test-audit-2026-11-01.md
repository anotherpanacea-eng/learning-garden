# Test audit — 2026-11-01

## Judgment and scope

There is worthwhile coverage here, alongside some ceremony. Keep the simple
runner and independent mathematical/save-safety checks; cull assertions that
observe nothing, freeze source spelling, or repeat the same complete journey
solely because the viewport changed. A large assertion count is not itself
coverage, and reducing the number alone is not a performance improvement.

This audit inventoried all 253 source suites (19,511 physical lines), traced
the runner and cross-suite imports, measured every suite, and examined selected
high-count grids, source-text checks and repeated browser journeys in depth.
It is not a line-by-line semantic review of every assertion. Three independent
read-only audit passes informed the cuts below; implementation receives a
separate Claude review.

Baseline: main `11683ce548263e8f3336706103f96d2f24f56b84`.
No production code, learner records or curriculum content changes.

## Cuts made

| Suite | Removed | Coverage retained |
| --- | --- | --- |
| Style | A six-module allowlist and regex scan banning other modules from mentioning style access | Actual style selection, explorer isolation, saving, rendering and transfer behavior |
| Fossil Close-Look | Purity assertion on an object never passed to the renderer; app branch spelling/order checks | Finite selection/pinning model, bounded photographs, actual native route and host interactions |
| Science view stability | Exact stylesheet tag spelling/count/head-position and renderer substring checks | Notebook purity; native checks that original loaded stylesheet nodes survive real turns |
| Shadow Theatre | Prose-must-occur-in-spec synchronization | Independent geometry, visible rendering, narration, Undo and native notebook/exposure preservation |
| Learning Journeys | Constant-only arithmetic and app/Home source substring checks | Actual content model values, exposure refusal/atomicity, rendering, native navigation and persistence |
| Sound Window | Exact MP4 byte length | Caption/physics checks and unchanged native media decoding/seek/retry coverage |
| Lift Yard browser | Full five-shift catalogue at all three widths | Full catalogue at 820px; native 320/1024px samples with longest board, partial/completed trip, held grid, chooser, touch targets and both representations. Existing motion, owner, import/reset, detached-control and legacy-return tests unchanged |

The deleted source rules were not reliable security boundaries: aliases could
bypass them, while comments or harmless refactoring could fail them. Native
behavior checks and independent expected values carry the useful contract.
Deliberate reviewed-content identity contracts elsewhere are unchanged.
Claude identified a gap in the proposed Shadow Theatre lexical-guard removal:
notebook preservation alone would miss a write to another localStorage key.
That guard is retained for now. Replacing it with a full storage/network behavior
probe is a possible later improvement, not a prerequisite for the other cuts.

## Workflow reduction

AGENTS.md now calls for affected suites during editing and one full source run
on the integrated runtime/test candidate before landing. Identical already-tested
trees can reuse results. Documentation-only changes need relevant content/link
checks and a clean diff, rather than another full source/browser run. Repairs
still need affected tests, with broader checks when integration leaves uncertainty.
The independent review, exact-head clearance, custody, secret scan and live
verification gates remain. No test selector, dependency graph or new runner was
introduced.

## Keep, and why

- The runner starts each suite once. Imports of other check files are guarded;
  fixture reuse is not secretly rerunning the imported suites.
- Ratio Bars' dense grid has an independent ratio oracle. It took about a
  second, so reducing it is not a priority merely to shrink the assertion total.
- Common Cuts' rational arithmetic, Life Stages' finite combinations, three-row
  Ribbon Rows' recursive strategy and Switch Table reachability provide useful
  independent expected results.
- Historical saves, unknown/additive records, refusal atomicity, real Notes
  export/import, owner switching, reset and detached controls stay protected.
- Literal reviewed phonics mappings and deliberately frozen historical/content
  contracts stay. Not all source/content checks are ceremony.

## Deferred opportunities and discovered failures

The unmodified Mill Energy browser suite fails its initial 820px viewport
assertion: the picture and all four primary actions do not fit the claimed
1000px view. This was reproduced in the candidate before its proposed browser
reduction was withdrawn. Its suite is unchanged; do not delete the failing
assertion to obtain a pass. Revisit responsive layout before reducing its three
catalogue runs. Other possible reductions (Copy Frame's repeated catalogues and
Lift/Mill source drawing grids) are deferred rather than deleting independent
geometry coverage without a measured need.

The largest baseline source costs were Market Signs (32.3s), Balance Both
(21.6s), Beat Bench (15.3s), Mixing Table (9.4s), Ledger Gauge (7.2s) and Writing
Cohesion (6.2s). These are investigation candidates, not evidence of waste.
The first cuts below improve maintenance and the repeated landing workflow;
they do not claim to eliminate most source-run time.

## Validation and timings

Timings are single-host wall-clock observations, not stable benchmarks.
Baseline source runner: atlas + story packs + all 253 suites passed, **164.3s**.
Lift Yard baseline: **82.4s / 10,578 assertions**, passed. Reduced journey:
**33.7s / 3,758 assertions**, passed — about **59% less time**, while preserving
one complete catalogue and the safety/lifecycle paths described above.

The six edited source suites retain 1,174 assertions, down from 1,709
(**535 removed**). All 253 source suites plus atlas/story packs passed after
changes, **185.2s**. Concurrent browser/review work and single-run noise make
this unsuitable for claiming a source speedup; none is claimed.

Retained native suites passed: science stability 871 assertions, Learning
Journeys 424, Fossil Close-Look 241, Shadow Theatre 2,990. The first Fossil run
failed to load Notes with a default Python HTTP server; the established
128-request-backlog HTTP/1.1 server passed. No test was loosened for that retry.
`git diff --check` passed. Mill Energy's existing failure remains explicitly
unresolved and outside the changed suites.
No deployment is needed because `dist/` is unchanged.

## Follow-up inventory and cuts (main 0cc828fc)

The current runner discovers **257 source suites, 19,959 physical lines**.
79 suites read files; that is a review queue, not 79 bad suites. For example,
Equal Groups extracts a real app function and executes it to check exposure;
that is materially stronger than its separate `app.includes` routing assertion.
Rendered text, frozen historical source, independent subject oracles, and source
spelling must not be lumped together just because all involve strings.

This bounded second pass removes eleven constant-only assertions: eight
hard-coded arithmetic equalities in Balance Both and three assertions about
Copy Frame's test-local shape oracle/constants. None calls production code.
The actual authored Copy Frame examples are still compared through production
helpers. Lift Yard's identical unstarted rendering moves out of its 28-job ×
four-length loop: one assertion replaces 112 copies. Its exhaustive model,
drawing geometry, in-flight preservation and native lifecycle coverage remain.
These are maintenance cuts, not a claimed material source-run speedup.

### Prioritized further simplification

1. **Cumulative fixture construction.** `fullSignsNotebook` runs actual pretty
   Notes import preflight for each setup action. Ending, Pattern and Crate
   fixtures rebuild that base, and Beat Bench builds the combined fixture
   again. Imports are guarded, so this is repeated fixture work rather than
   accidental execution of whole imported suites. Use a cheap accepting gate
   for fixture construction, with explicit real-import/size/refusal tests at
   the integration boundary. Before changing it, compare resulting fixture
   values and demonstrate that real-gate refusal and historical transfer remain
   covered. This is the strongest concrete runtime candidate from this pass;
   it is not yet changed or benchmarked.
2. **Repeated browser catalogues.** Copy Frame still runs its journey at three
   widths. Retain one full catalogue and representative longest/edge-state
   responsive cases, as with Lift Yard. Mill Energy needs its existing layout
   failure resolved before making the same reduction; a failing check is not
   ceremony merely because it is inconvenient.
3. **Source-spelling checks.** Remove remaining app substring/route-order and
   literal stylesheet-tag checks when actual route/navigation/style-lifecycle
   tests cover the behavior. Keep executable host-function tests and narrow
   content identity checks until their particular contract has a replacement.
4. **Large arithmetic grids.** Balance Both currently exercises 1,579,152
   independent action cases. Its unary operations could potentially be checked
   against every single pan plus a small set of opposite-pan boundaries;
   paired sharing/removal needs separate joint-state coverage. Do not replace
   the Cartesian grid with arbitrary random sampling or delete it solely to
   lower the assertion total. Establish equivalent fault detection first.

Keep the existing runner. No test registry, selector, coverage dashboard or new
validation framework is needed. During editing run affected suites; run the
full source set once for the integrated candidate. Counts are diagnostics,
not evidence of educational effectiveness or a delivery quota.
