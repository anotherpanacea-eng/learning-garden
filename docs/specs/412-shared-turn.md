# 412 · Shared Turn

Status: proposed bounded implementation under admitted LG-1 / LG-G1. Independent specification and complete finite mathematics/diagram review precede code. Selects the straight-line/point part of proposed [182](182-angle-rules.md), not its triangles, parallel lines, congruence or complete programme.

## Need and scope

[Hinge Bench297](297-hinge-bench.md) changes one selected turn, its visible arm lengths and orientation; it does not compose adjacent turns or solve an unknown part. Copy Frame keeps right angles; Shadow Yard405 uses right triangles; Across the plan400 measures distance. None supplies this operation. Optional **Share a turn** inside exact `#workshop/hinge` adds two adjacent counterclockwise parts that fill a named180° or 360° whole, then covers one measure. This is a M5-III / M1-II / M7-II bridge from additive part/whole arithmetic to geometric equations. No new destination, saved root, task outcome, grading, placement, unlock, story credit or assessment.

The miller is planning two colors for a turning town sign. This is an imagined drawing model, not an actual hinge, construction specification or measuring instrument. Act II/III under [120](120-keeper-of-the-ways.md): a new town display, independently open, with no story condition. The sign drawing does not decide later town plans.

## Complete interface and visit state

Entry title **Share a turn**. Entry copy: **The miller is trying two colors for a turning sign. How can two parts share the same turn?** Entry button **Share a turn**, outside all parent details, present in live and worked-example parent views. Child intro: **A drawing for the town sign. Explore two parts of one turn, then cover a label.**

Three freely reachable pages: **Build two parts**, **Cover a label**, **See why**. One current diagram/job/teaching card per page. Back button **Back to Hinge Bench**, Hear **Hear this page**, rotation **Turn the whole picture**. Rotation changes orientation only, never a measure or own idea. Page/card navigation keeps current context and all local work. No compulsory drag, animation, timer, penalty or automatic speech.

`createSharedTurn()` returns `{page:'build',whole:180,first:60,tilt:0,job:0,ideas:[null,null,null,null,null,null,null,null],readings:[false,false,false,false,false,false,false,false],lesson:0}`. Separate content/core/UI modules. Immutable `changeSharedTurn(work,action,value)` returns the same object on invalid/no-op input:

| action | allowed effect |
| --- | --- |
| page | build / cover / learn |
| whole | Build only;180 or360, permitted only if first<=new whole; preserve first, never silently clamp it |
| first | Build only; integer multiples of 15 from 0 to current whole |
| turn | any page; tilt=(tilt+90)%360 |
| job | Cover only; integer0–7, preserving all ideas/readings |
| idea | Cover only; integer0–360; own proposed missing measure, no comparison or auto-reveal |
| clear-idea | Cover only; current idea null |
| reading | Cover only; toggle current separate reference |
| lesson | See why only; integer0–3 |

Build controls: **Half turn ·180°** / **Full turn ·360°** with aria-pressed; first-part select label **First part in degrees** (0,15,…whole), **First part −15°** / **First part +15°** with bounded availability. Half-turn control is disabled when first>180, with visible reason **Your first part is larger than 180°. Choose a smaller first part before changing to a half turn.** Selecting a whole preserves degree measure rather than preserving fraction of the whole. A half/full choice is a geometry constraint, not a learning gate. No input silently normalizes an impossible request.

Cover input label **Your idea in degrees**; native number input `min=0 max=360 step=1` initially blank, plus **Keep my idea** and **Clear my idea**. No default0 or other guess; an empty input is not converted to0. Keep commits only a finite integer0–360, otherwise shows **Use a whole number from 0 to 360, or leave your idea blank.** Own kept caption **Your idea: N°.** Clear returns to **No idea kept yet. You can think together.** A pending typed value belongs to the input until Keep; other deliberate redraws may discard that unkept input, but must not change the kept idea. State explicitly **Tap Keep my idea before changing pages.** Clear button stays useful; focus falls back to input if it becomes disabled. No right/wrong result is derived.

Job selector **Choose a job**, options **Job N of8**; heading **Job N of8**. Teaching selector **Choose a teaching card**, options the four titles below. Both have bounded **Previous** / **Next**, stable directional focus and a selector fallback at edges. Selected own values are neutral, never red/green judgments. **Show missing measure** / **Hide missing measure** reveals a separate reference, never overwrites the idea and stays independently open per job.

Lifetime: **Your parts and ideas stay while you visit Hinge Bench. Leaving the room or opening the explorer chooser clears them. Your notes are not changed.** This includes explorer change, notebook import/replacement/reset. Back and re-entry preserve both parent settings and child work during the same visit.

## Mathematical model and exact geometry

Angles are amounts of turn in degrees. One full turn is 360°; half is 180°. In Build, A=first and B=whole−first. They share one vertex and a dividing ray, cover the named whole in order, with no gap or overlap. A+B=whole. The other measure follows from the whole and first part; this is an immediately visible relation, not a graded answer. Show actual integer measures and `A° + B° = W°` in ordinary HTML. At zero, say **No turn ·0°**; at360, say **One full turn ·360°**. Coincident endpoint directions do not make a full selected turn0°.

One common pin at(160,160) in a320×320 viewBox. Direction at angle α is(cosα,−sinα). Starting ray direction=tilt, divider=tilt+A, ending ray=tilt+whole. Use exact cardinal endpoints or reasonable float tolerance, never recover angle names by rounded pixels. Visible ray lengths115,135,100 respectively; widths10/2/6, gold starting ray solid, dark divider solid, blue ending ray dashed. Continuations/arrowheads follow the same mathematical rays, never offset them sideways. They stand for rays, not finite sticks. The end ray at a full turn overlays the start ray: distinct width/style and text identify both. Divider may coincide at A=0 orA=whole; identify all roles in the text, rather than separating their directions for visibility.

A's counterclockwise curved sweep has radius70, B's radius100, and target-whole outline radius 145. Different radii keep sweeps distinguishable; these are angle measures, not comparisons of arc length or colored area. Every positive sweep follows its selected counterclockwise path, including reflex portions. Arc helper splits into positive segments of at most180°; SVG y inversion uses sweep flag0;360° uses two180° arcs and0° none. Use distinct line patterns plus labels for A/B, not color alone; arrowheads show the direction without repeated internal SVG IDs. Do not replace a reflex sweep with its smaller complement. Diagram rotates rigidly with tilt; its labels remain readable HTML at least16px.

Cover uses the exact corresponding adjacent-part geometry, with first fixed by the job. While closed, B's visible/accessible measure is **?° · covered label**, and equation **G° + ?° = W°**. The drawing may help estimation; the exact answer follows from the sum. Do not write B's numeric degree value in alt text, figure caption, ordinary data attributes, speech or tables before reveal. SVG coordinates necessarily depict the actual sweep; hiding a verbal label does not hide the picture. The child's idea never changes the diagram. When open, a separate reference says **The other part is R°. W° − G° = R°. Together, G° + R° = W°.** and the main B label/equation may show R. Never label an own idea as the actual angle.

### Complete eight jobs

Every job context uses **The two marked parts fill one [half/full] turn. The first part is G°. What is the other part?** Supplied picture is exact geometry, not a physical measurement. The reference follows the fixed template above; these are the complete independently reviewable calculations:

| job | whole W | given G | reference R | subtraction | sum |
| --- | --- | --- | --- | --- | --- |
|1|180|30|150|180−30=150|30+150=180|
|2|180|90|90|180−90=90|90+90=180|
|3|180|120|60|180−120=60|120+60=180|
|4|180|150|30|180−150=30|150+30=180|
|5|360|45|315|360−45=315|45+315=360|
|6|360|120|240|360−120=240|120+240=360|
|7|360|225|135|360−225=135|225+135=360|
|8|360|300|60|360−300=60|300+60=360|

Purposeful returns: jobs3/6 keep first120° while changing whole; jobs3/8 keep missing60° while changing whole/given. No generated unseen practice or adaptation is claimed. Own answers can be any bounded integer, including unexpected ones. These jobs do not test independent degree measurement, visual estimation, algebra proficiency or recall.

## Four complete teaching cards

The quoted text is exact child copy; drawing instructions are author notes. All examples are labeled **Worked example · not your parts**. No lesson writes or fills a child's work.

1. **One whole, two parts.** “A half turn is 180°. These two parts meet at the same pin. They fill the half turn without a gap or overlap.60° + 120° =180°. We add amounts of turn, not the lengths of the drawn arms.” Diagram whole180, first60.
2. **All the way around.** “A full turn is 360°. The starting and ending rays point the same way after one full turn. That is still a full turn, not no turn. Here 120° + 240° =360°. Follow the marked second sweep all the way round; don't replace it with the smaller turn between its ends.” Diagram whole360, first120.
3. **Cover a label.** “The two parts fill 180°. One part is 120°. Call the missing measure x. That letter stands for a number we do not yet know.120° + x =180°, so x =180° − 120° =60°. Check:120° + 60° =180°.” Diagram whole180, first120, numeric second60 shown because this is an explicit worked example, never the current job.
4. **Check the gap.** “Do the marked parts fill the whole turn? Here two 60° parts leave a 60° gap inside a half turn.60° + 60° =120°, not 180°. We must count the gap too. Use a whole-turn rule only when the parts really fill that whole, with no gap or overlap.” Separate worked diagram: outer180; first arc from 0 to60 at radius70; second arc from120 to180 at radius100; dashed uncounted gap60 to120 at radius120. All three share the pin; show rays at0/60/120/180, third uncounted gap label **Gap60°**, textual equation **60° + 60°  + 60° =180°**. This finite gap illustration is not passed through the two-adjacent-parts pose as if it were adjacent. It rotates with the selected tilt. No overlapping-angle or vertically-opposite rule is commissioned.

Build teaching line: **A degree is one of 360 equal parts of a full turn. These two marked parts share one pin and fill the whole. Turn the whole picture: their measures stay the same.** Diagram description template: **A drawing of a W-degree [half/full] counterclockwise turn at one pin. Starting ray, dividing ray and ending ray show first part A degrees and second part [B degrees / covered]. Ray lengths do not set the angle measures.** Degenerate explanations add **The divider points along the [starting/ending] ray.** All text is original. Original diagram only, no external pictures/fonts.

## Modules, host and speech

Exports: content finite jobs/lessons/copy; core `createSharedTurn`, `changeSharedTurn`, `sharedTurnModel`, `sharedTurnGeometry`, `sharedTurnNarration`; UI `sharedTurnPage`, `bindSharedTurn`. Finite geometry helper may return rays/arc-segment coordinates and exact measures for rendering; it is not a saved schema. No fit/comparison outcome derived from own answers. Per-job current own idea/reference and current lesson resolve through model. Unknown art fallback is neutral. Full `shared-turn-` classes/data/IDs, checked against the loaded app. No broad framework or permanent registry.

Use Hinge Bench's existing visit object: add child work/active flag and captured parent details-fold state. Its per-case material/card/comparison, selected tool/case, worked-example/frame and pending announcement remain with their existing owner. Hinge has no saved learner root; do not copy Riddles' raw-notebook frame machinery here. Child markup replaces the whole parent while active. Back renders the unchanged parent and restores the two model/grown-up details folds; stops speech, focuses entry and retains child work. An old delayed parent announcement cannot change anything while the child is active; existing pending-announcement behavior may resume on Back.

`hingePage` retains `(notebook,owner)` and `bindHinge` retains actual existing callbacks (`notebook:()=>state`, explorerId, isActive, render/focus/stopSpeech/stopSound). No save or canExport is passed to this child. Extend current parent visit with a render-generation guard and a small local ancestor/removal/visibility guard for controls, including Hear, rather than extracting a new shared system. Generation, current root, exact route, current notebook/owner, selected parent view and active-child predicate prevent old callbacks from reviving. Current controls removed/reinserted/reparented or hidden/unhidden stay retired for that binding. Drop stale events before local state, render or speech. Parent controls cannot act behind a child. Shared voice preferences are newly inserted controls owned by the existing service and keep working. Parent material operations/math and open exits keep their meanings.

`resetHingeVisit` already runs before route/chooser returns and on notebook/import/owner changes; clear child work there too. Add `[data-shared-turn-root]` to observed generic how-to suppression; the early exact Hinge dispatch does not use the later generic insertion. No aliases or new routes. Parent human links keep ordinary behavior. No parent note writer, model normalization or initialization is added. Existing separate daily-room and deliberate voice-preference writes are not child's saved learning.

Focus: entry/re-entry `#shared-turn-title`, Back `[data-shared-turn-entry]`, page `#shared-turn-page-title`, selectors `#shared-turn-first`, `#shared-turn-job`, `#shared-turn-lesson-select`, idea `#shared-turn-idea`, current job heading `#shared-turn-job-title`, lesson `#shared-turn-lesson-title`; rotation retains acting button. Native inputs/selects have associated labels. Previous/Next hold stable direction until an edge, then focus relevant selector. Keep invalid input focuses its field/status without saving. Clear/ref controls keep focus with a useful enabled fallback. Honor44px targets/16px HTML text, tablet-side diagram/controls and phone normal-flow stacking. No text scaled inside SVG. Own/reference visual states distinct but never verdict colors.

Narration covers only the visible current page/context, exact degree values, selected sweep directions, current own idea as an idea, and reference only when open. Cover does not name B numerically until explicit reveal. Lesson narration says Worked example; gap text/diagram agree. Include lifetime and Back. No automatic narration or another job's hidden reference. On redraw stop old speech; native Hear capture guard runs before shared speech. Scoped static speech panel prevents it from covering diagrams.

## Curriculum, upstream and source boundary

[49](49-six-act-curriculum.md) §5: explicit benchmark/partition teaching; half/full and gap contrasts; supported worked unknown; build and eight covered jobs; purposeful returns at a changed whole or orientation. M5-III, M1-II, M7-II are partial candidates only; no course completion or learner-level claim.

Refreshed2026-11-07: Jane `c681f6bf2f2adf2aa032f765983a4691774cfba5` LESSONS.md (ordered teaching/guided work studied, no text/code imported); Marble `04962c78ccb8bd52b236512d3362405bace98d2a` data/topics.json and data/dependencies.json freshly read. No graphs, teaching research or upstream learner policies incorporated. Do not adopt Jane's grades/bosses/review gates. Both refreshed and bundled hard-prerequisite crosswalk:

| partial candidate | hard prerequisite | bounded support / honest gap |
| --- | --- | --- |
| Angle Sum Rules `mt_oqziWKry-L` | Types of angles `mt_e4V6hvcuEJ`; Degrees and turns `mt_qUGMyMYn9m` | parent297 quarter/half/full/reflex and degree teaching, visible benchmarks; this adds only adjacent line/point sums, not vertically-opposite angles |
| Understanding angles `mt_QDTO3GAgcq` | Measuring angles `mt_89riIKwGYp`; Types above; Angle Sum Rules above | explicit sum/missing-measure application only; protractor measurement remains unbuilt/unobserved, so do not claim full target/prerequisite coverage |

Primary sources studied, paraphrased only: [AMSI teacher resource](https://amsi.org.au/ESA_middle_years/Year5/Year5_1aT/Year5_1aT_R1_pg1.html), directly opened for360° revolution and180° straight turn; [NCETM geometry progression](https://www.ncetm.org.uk/media/45ggjxei/8-progression-map-geometry-properties-of-shapes.pdf), directly extracted text for line/point sums and missing-angle progression (PDF screenshots failed; no illustration/layout claim). No copied publisher prose, diagrams or activities; no structural-engineering advice, history, foreign language or physical-simulation claim. Adjacent addition and the finite arithmetic/coordinates require independent mathematics judgment, not a presence check.

## Acceptance and delivery

Independent six-lens specification review plus complete finite mathematics/geometry/copy review before code: all 38Build settings × 4 orientations (including0/whole), eight job differences/sums/hidden-label semantics,4teaching diagrams including gap, full/reflex/zero sweeps, preserved-unknown behavior and nonnormalizing whole change. Review facts, not merely count rows. Mechanical checks do not certify teaching quality.

Core tests: immutable bounded/page-local actions and noop identity, whole-first-second invariants, ideas initially null/not correctness flags, per-job retention, independent reveal, current-only speech and no verbal hidden measures, cardinal/reflex/full arc endpoints and zero/full distinction, gap does not masquerade as adjacent. Test finite math with independent expected values and geometry identities; no huge permutation/golden-prose suite.

Actual app Chromium: parent changed hinge arms/turn/tool/card/comparison and both open details → child parts → jobs/own input/reference → Back exact parent settings/folds; also Back from parent worked-example/frame. Re-entry keeps child work, leaving exact room/chooser/owner/import/notebook reset clears it. Initial blank, invalid decimal/empty/out-of-range and unexpected kept numbers; explicit refs preserve them. All8jobs/4teaching cards and degenerate/full/reflex diagrams; current Hear/alt and labels; actual in-memory notebook, all stored values and Notes unchanged. Parent pending announcements and old/hidden/detached/reinserted/reparented child/parent/Hear/entry controls cannot act. Verify shared voice preferences still work separately. One complete tablet journey plus focused phone/control/keyboard geometry and root visual inspection; no physical iPad/audio/learning claim. Existing Hinge browser/source regressions; full source runner once stable/integrated with current main, affected checks after bounded repair.

Independent Claude clearance of exact final candidate, ready/release custody, merge commit, clean authorized-account deploy, byte match every hosted asset and Home/touched-room smoke. One PR release-record comment linked once from roadmap, no copied counts in docs. Existing French Gemini and phonics owner holds remain separate.
