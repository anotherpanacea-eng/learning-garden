# 371 · Reference Scales: agreement is not closeness

Status: bounded LG-G1 specification, 2026-11-04. Independent specification and finite science/mathematics/content review precede code. [Original packet](../content/371-reference-scales-text.md).

## Job, overlap and boundary

The baker wants to understand two invented scale records before discussing parcel amounts. This is Act IV evidence work and S1-III/IV measurement/evidence, revisiting M6-III summaries; it is open before any story milestone. No story contribution, official weighing, real calibration, recipe, trade certification or physical-equipment instruction.

Fair Test already supplies controlled comparisons, repeats and overlapping ranges. Motion Evidence already supplies net force, balanced motion and collision claims. Measuring Desk92 already keeps two adult-reported jug readings and explains that agreement does not prove an exact amount. Compare Shelf369 already supplies exact mean/median/range, original dot positions, center/spread contrast and a separately labelled set-aside comparison. Do not call those missing. The new action is moving a common numerical adjustment over an unchanged reading list and comparing agreement between repeats with closeness to an explicitly stipulated model reference.

Adapt the precision/reference encounter proposed in155, using original smaller mass values. The entire scales activity stays in **The Compare Shelf**, `#learn/math/compare-records`, reached through a third chooser button **Reference Scales**. Add a quiet invitation from `#science/measure`; keep its jug workflow, `measurementNotes`, safety and support untouched. Return to the jug limitation after the model, not to calibrating a real jug. No new route, root, generic lesson framework, prose editor, automatic grader, age placement or prerequisite lock.

## Finite original model

All numbers are invented model data. The reference value is a stipulation, not a verified physical weight. Grams measure mass here. Original groups (stable IDs `blue,copper`, three individually identified readings each):

| Stage | Stipulated reference | Blue readings | Copper readings | Original means / ranges |
| --- | --- | --- | --- | --- |
| Parcel example | 100 g | 111,112,113 g | 94,100,106 g | Blue112 /2 g; Copper100 /12 g |
| Different check example | 50 g | 61,62,63 g | 44,50,56 g | Blue62 /2 g; Copper50 /12 g |

Both use the same horizontal 0…150 g axis, tick25 g. Three observations are illustrative, not estimates of long-run instrument performance. Tighter agreement can coexist with all readings being away from the reference. Copper's sample mean equals the reference; its individual readings are not all exact. Never call that set simply “accurate” because its mean matches. Accuracy is qualitative closeness to a reference, not a score in grams. Label numerical quantities **mean minus model reference** and **range**. Do not label range a standard deviation, uncertainty interval or calibrated precision rating.

A signed adjustment from −20 to +20 g, step1, applies to **Blue only**, separately from originals. Add the chosen number to every Blue reading. At −12 g the parcel preview is99,100,101 g (mean100, range2); the check preview is49,50,51 g (mean50, range2). Constant translation changes center and preserves range. Any permitted adjustment can be kept, including zero or one that increases distance. No fitting key, answer score, pass or automatic success. It is a numerical preview, not a change to an instrument or its original records.

The check is a new supplied context, not newly collected measurements. Two stipulated examples do not establish that a correction works at all masses, in all conditions or on a real instrument. Do not imply that repeating a measurement shrinks the instrument's spread. Averaging may reduce uncertainty of a mean under suitable assumptions; this slice neither estimates that uncertainty nor simulates unlimited repeats. Formal uncertainty, significant figures, resolution selection, calibration curves and complete measurement practice remain outside scope.

## Three manual turns and return

1. **Agreement between repeats.** Plot originals, allow existing mean/median/range highlights and explicit Show how. Ask which list is tighter and what is unknown without a reference. **Reveal the model reference** explicitly reveals100 g and a vertical reference marker. No automatic animation or timing.
2. **A separate adjustment.** After reference reveal, **Try an adjustment** opens the signed control, original/preview summary and overlay. Original solid marks never move or disappear; adjusted Blue uses a different shape and text legend. Show ±1 g buttons and Reset adjustment; keyboard/touch work without dragging. The existing Show how toggle reveals arithmetic using actual source values, and recalculates only the preview. A reader compares the mean's signed reference difference AND all individual dots, not just the center.
3. **Try a different reference.** Explicit **Open the check example** reveals the second frozen dataset and its50 g marker, using the same chosen adjustment and common axis. It remains adjustable in a draft; changing it never rewrites a kept comparison. Before opening it, show an invitation rather than its numbers. Ask what changed, what stayed and what is still unproved. Offer Keep unfinished, Try this comparison again, and return to the original parcel turn or real Measuring Desk.

The separate worked example and glossary in the companion use manual parts, with no automatic narration. All displayed calculations are supplied support, not independent computation. Original explanations stay spoken or on paper, read by a person. The50 g context is the new application. On a LATER Measuring Desk visit, if a readable kept reference comparison exists, show the companion's optional return prompt with that kept source's own title and a normal Compare Shelf link. Ask the learner to reopen/bring that frozen comparison, then explain to an adult what matching entered jug readings establish and what remains unknown. The last readable reference entry in append order is a convenient named artifact, not evidence of the latest visit or attainment. No kept artifact means no kept-work promise; the ordinary model invitation remains open. This later cross-game use is the purposeful revisit; it creates no tracker, assessment or cross-root write and never copies model readings into the real notebook.

## Source and work contracts

Reuse `compareSource`, `recordSummary`, exact rational formatting, `compareGeometry`, existing session/draft/kept lifecycle, `keepComparison`, `compareRecordsView` and `compareNotes`. Add dedicated reference-scale rendering helpers rather than replacing route-specific minutes/trips/purposes with a generic activity configuration. Existing courier/parcels content and previews remain unchanged.

New source retains369's existing v1 shape/limits plus:
```
model: 'reference-scales-v1',
referenceScales: {
 v:1, unit:'g', reference:100,
 adjustableGroupId:'blue', adjustment:{min:-20,max:20},
 check:{reference:50, groups:[{id,label,records:[{id,value}]}]},
 copy:{intro,limit,reflection},
 teaching:{steps:[string],factsByStep:[pairs]},
 glossary:[{term,meaning}]
}
```
All data freeze in EACH kept source. Never render a reference, record, unit, adjustment bound or teaching from today's catalogue for a kept/reopened example. Bounds: plain own-property objects; dense two groups, unique group IDs, each3…12 uniquely identified records with integer values0…axis.max; check group IDs match the source-owned group identities (order/count/labels may differ). Reference values are integers0…axis.max. The adjustable group exists in both datasets. Adjustment min/max are integers −120…120, min≤0≤max; every adjustable reading plus either bound remains within the fixed axis. Source axis retains existing369 limits. Display strings follow existing nonempty text bounds: intro/limit/reflection≤1000 characters;1…8 teaching steps≤1000, matching dense factsByStep with existing1…12 integer-factor-pair rules;1…8 dense glossary entries with nonempty term≤80/meaning≤1000 under the existing text-length convention. Unknown fields stay retained. The companion supplies complete current strings; it is not a lookup table used to validate older data. All numerical comparison/result sentences are templates filled from the actual frozen source, current visible stage and selected adjustment. The companion's100/50/−12 illustrations must not be rendered as fixed feedback at a different adjustment or for historical labels/readings. Group names resolve by their source-owned IDs, not array position or today's Blue/Copper labels.

New work retains the existing valid369 fields and adds:
```
referenceView:{v:1,referenceShown:false,correctionShown:false,adjustment:0,checkShown:false}
```
Booleans describe panels explicitly opened, not proof of reading/knowledge. They are retained on Keep/Try again, never inferred from a catalogue or raw Notes access. Adjustment is an integer inside this frozen source's own limits. Do not add flag-consistency rules that nothing reads; rendering uses the relevant shown flag. Unknown fields inside referenceView remain exact.

**Known-mode interpretation:** source model strings in the reserved `reference-scales-v` family dispatch through narrowly named reference-source/work guards. Version1 requires the contracts above. Unsupported/malformed source or reference work is retained as an unavailable comparison; never reinterpret it as minutes or substitute a fresh source. Other records remain open and raw Notes/export retain the entire value. Legacy sources without that reserved model family use369's existing predicates unchanged; unrelated unknown fields cannot close them. Keep refuses a malformed new-mode draft without mutation. No migration, evictions, current catalogue counts or regrading of saved results. These are new-mode structural guards, not validators of scientific truth or real instrument quality.

Use the existing immutable append owner `compareRecords`, cap24, explicit Keep and real pretty Notes `canExport` gate. No eager saved source on render, no replacement of earlier records. **Try again** copies the full referenceView, source and existing work fields from the kept entry, with no new defaults for historical sources. Kept panels cannot reveal arithmetic/worked teaching/reference/check content beyond their saved flags; trying again can explicitly open more. A manual **Words for this comparison** disclosure reads the source-owned glossary. It can open in drafts or kept views as reference help, without a notebook write or inference that it was previously read; this nonnumeric glossary is explicitly outside worked-step disclosure tracking. Notes retains the full source regardless of panel flags, so flags never mean the source was unknowable elsewhere.

## Integration, disclosure and interaction

Add `reference-scales-content.mjs` and `reference-scales-ui.mjs`; narrowly scoped derived source/summary/overlay/display-pair functions live in `compare-records-core.mjs` to avoid a circular core import. Root Compare UI retains its exports and identity/session/rollback/Keep/speech bindings, with source-specific rendering and controls for this mode. Existing route set-aside and route-purpose controls do not appear in scales mode. The source fold lists the stage's own original records and units; hidden check values stay outside child speech until that panel opens. No automatic selection on arrival. The Measuring Desk link reaches the normal chooser, then the learner explicitly chooses Reference Scales.

Given arithmetic must pass the existing `recordGivenMath(..., normalize:false)` path BEFORE it appears in the next view, using the actual pretty report preflight. Extend display-pair derivation for the reference mode: every displayed original and adjusted mean formula AND even-count median formula for the currently visible stage, plus the currently revealed worked step (or retained extent for read-only kept work). Only actual integer-factor pairs1…12 qualify waiting work; never record a recall response. Source-current means are above12, but historical finite examples may have small means. Test a historical3×2 mean formula and a four-reading list [0,2,4,9], whose mean15/4 has no integer pair but median3 supplies2×3. Include the adjusted even-median formula when shown. Refusal restores local selection, page, reference/adjustment/check/teaching flags and chosen adjustment as well as every notebook root. Existing route qualification and secondary-disclosure behavior remain unchanged.

All controls preserve selected source/work while paging. Stop speech on source/page/adjustment/owner/import/route changes; detached or stale nodes cannot act/narrate. Speech reads only the current visible turn, including open source/context and shown arithmetic, with units and signed adjustments spoken clearly. Do not narrate hidden later examples or old speech-control text. All source strings are escaped, no HTML/eval, remote media or requests. Use original SVG plots, no copied NIST/BIPM diagrams.

At820px keep the common-scale plot and current question/adjustment together; stack at320px with no horizontal overflow. Minimum44px controls and16px instructional text, visible focus, separate non-color legends. Manual step changes and parameter endpoints keep focus on a usable control. No precision tapping, hover, drag-only control or moving real-time target. Existing route screenshots/controls and real Measuring Desk entry still need regression checks.

## Upstream and primary sources

Refreshed2026-11-04: Jane `5f4ccb3f9842c9ae8d44ebdd9a16de60afa7ad56` LESSONS.md; Marble `fdcc958385af80a263795246449c41cb76da2ae0` topics/dependencies/teaching-research. Jane's separate examples and manual parts inform the encounter; no code/prose, penalties, grades or gates adopted. Marble candidate `mt_auJqTemMpI` Repeated tests for reliability has current teaching research proposing independent spread/offset manipulation and repeat/reference comparison. We adapt that action, but use a shared reading axis rather than darts; no efficacy claim or full-topic completion. We explicitly avoid the shorthand that repeats shrink an instrument's spread or a centered finite mean makes every reading accurate. Original code/content only; existing NOTICE remains.

Repository pin `96a7933754af672e1bfdbf7ecb05c325860c6e0d` and current graph agree on the full HARD chain: Repeated tests for reliability `mt_auJqTemMpI` → Accurate Measurement `mt_Psun-u_lPf` → Measuring accurately `mt_nUnowllzaN` → Observing with simple equipment `mt_vJO5Bxk4z-` → Asking scientific questions `mt_XirhnAB6Ye`. Four prerequisite nodes/four edges. Inline scale, units and mean/range help plus the existing adult-guided jug invitation supply support, not evidence of these practical prerequisites. No new atlas coverage claim or gate.

Directly opened primary references, rather than155's search-excerpt audit:
- [NIST: Bias and accuracy](https://www.itl.nist.gov/div898/handbook/mpc/section1/mpc113.htm): qualitative agreement with a reference, systematic effects and limits of correction. Our finite sample mean difference is labelled as such, not a laboratory bias estimate.
- [NIST: Variability](https://www.itl.nist.gov/div898/handbook/mpc/section1/mpc114.htm): short-/long-term variability and repeatability. Range is our visible illustration, not NIST's standard-deviation measure.
- [JCGM VIM, §§2.13–2.18 and2.53](https://www.bipm.org/documents/20126/2071204/JCGM_200_2012.pdf): distinguish accuracy, trueness, precision and correction. No quoted definitions, diagrams, logos, publication remake or claim of endorsement. The old NIST glossary link in155 returns404; it is not relied on.

## Acceptance and release

Before code, six independent spec lenses plus independent science/mathematics/finite-content review. Verify every numerical claim, ranges/means, translation invariance, individual-versus-mean language, reference stipulation, correction limits, direct sources and upstream departure above.

Source checks use independent expected original and adjusted numbers across all41 adjustments, both finite stages, inclusive bound/refusal cases and rational historical means. Prove original coordinates/records/notes remain unchanged, source-owned references/labels/check datasets survive historical changed order/counts, unsupported reserved modes and malformed siblings are isolated and retained, legacy unknown fields remain readable, no hidden-stage arithmetic qualification, historical3×2 mean and2×3 even-median given qualification without recall attempts, later Measuring Desk return naming its frozen kept source without model-to-real writes, actual pretty Notes capacity refusal/rollback, cap24 and unrelated≥500KB siblings. No source-spelling synchronization machinery.

Native Chrome: one complete820 journey opens the new source, reveals reference, changes adjustment, toggles arithmetic, opens50g check, keeps an unfinished/wrong adjustment, reopens/Try again without replacing source, then follows the real-jug limitation.320 samples inspect shared scale, labels/targets/focus/no-overflow. Exercise actual two-owner Notes import/reload/redownload with historical source and malformed siblings; saving off/quota; stale task/owner/import/route controls and current-only requested narration; explicit preflight faults separately. Run existing Compare Shelf browser suite and touched Measuring Desk browser suite; use representative widths rather than repeated full flows. Full source runner once on main-integrated runtime candidate, affected reruns for repairs, independent exact-head Claude implementation clearance, ordinary merge/deploy/full-asset+Home/touched smoke receipt. These checks do not qualify physical iPad/Safari/VoiceOver/audible quality, learning or physical measurement.
