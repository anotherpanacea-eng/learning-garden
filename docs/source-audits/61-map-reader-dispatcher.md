# Map Reader / Dispatcher: source and overlap audit

Author source preparation for spec61, 2026-10-21. Independent specification and implementation review remain separate. This audit edits no runtime, specification, existing map, saved route or taxonomy pin.

## Fresh source check and reuse

Fresh public GitHub `commits/HEAD` reads and exact-commit raw-file reads return unchanged Jane [`d4903954d7c4d8118cbd1d2f7ed770544fd4ac81`](https://github.com/kentlangley/Jane/tree/d4903954d7c4d8118cbd1d2f7ed770544fd4ac81) and Marble [`3de50367b23be6a03d1a8385daae16d5eed2675d`](https://github.com/withmarbleapp/os-taxonomy/tree/3de50367b23be6a03d1a8385daae16d5eed2675d). Jane `LESSONS.md`, `src/engine.js`, `src/stuck.js`, `LICENSING.md` and Marble `data/topics.json`, `data/dependencies.json` are byte-identical to the cache freshly checked for [spec60](60-fair-test-apprentice.md). Host read access was used because the earlier sandbox diagnostic established GitHub DNS was unavailable there.

Jane short purposeful stages, stable work and separate optional support remain design references. No new Jane engine, lesson prose, art, identity/storage, mastery gates or reward model is incorporated. Its code/content have path-specific licenses; no blanket MIT-content reuse is inferred. Original fictional job cards and deterministic map tasks are authored for this game.

Actual implementation reuse is the existing `dist/cartographer-{content,core,ui}.mjs` seam: native N/E/S/W commands, A/B route editor, integer intersection positions, symbol key, 0..5 bounds, 12-command cap, current path calculation, model-unit interval count, separate support and frozen check snapshots. Reader/dispatcher cards are an information-presentation extension around those actions, not a new route simulator, partner service or evidence of cooperation.

## Four existing references suffice

Retain the three coordinate references `mt_jBQS-CicNn`, `mt_oDlduFnemk`, `mt_snlqRCiA1R` and the equal-unit length reference `mt_cqSf213hSa`. The three coordinate targets plus all transitive hard prerequisites form **11 nodes**; length plus its three hard ancestors adds **four**, giving **15 unique nodes**. All 15 descriptions and evidence arrays still match the full vendored `curriculum/marble` source at `96a7933754af672e1bfdbf7ecb05c325860c6e0d`. Fourteen names match; `mt_oDlduFnemk` is now **The coordinate grid**, replacing vendored **Numbers on a number line**, without changing its actual coordinate-system description/evidence. Incoming triples match except the known added soft `mt_snlqRCiA1R` → `mt_ejht12jhm2` edge, reason “Grid references that name cells precede plotting points with coordinates.” No hard relation changed. The complete incoming triples and ancestor dispositions are in [audit58](58-cartographers-table.md); this pass rechecked the entire union, not just the four titles.

Runtime `dist/marble-map.json` remains pinned unchanged and contains only `mt_8OAGVdeTJ_`, `mt_MFfYcnv6Tv`, `mt_TdV9YGJEoY`, `mt_cqSf213hSa`, `mt_KaF0SQvaiu` from this union. These five descriptions match; the length titles omit source age suffixes. No runtime evidence arrays exist. Angle-node and equal-unit-length incoming triples are present; direction and beginning-length incoming prerequisites are outside the subset (counts 2 and 1). Full source equality does not mean runtime closure/evidence completeness. No graph expansion or mapping of cooperation is required.

| Existing ID / actual source title | Actual description/evidence meaning | Narrow application and exception |
| --- | --- | --- |
| `mt_jBQS-CicNn` · First Quadrant Coordinates | Read coordinates horizontal-first; source evidence also identifies vertices of plotted shapes. | Read four fixed landmark positions and relate them to route movement. Fixed positions are supplied, not independent map authorship; no shape-vertex task. |
| `mt_oDlduFnemk` · The coordinate grid | Understand perpendicular axes, origin and ordered pairs; identify axes/origin, explain horizontal/vertical distances and distinguish reversed pairs. | Keep origin/axes/intersections explicit. Role cards do not demonstrate independent axis construction or explanation. |
| `mt_snlqRCiA1R` · Plotting points in the first quadrant | Plot/read ordered pairs and interpret context; evidence includes plotting points, data pairs and contextual coordinate meaning. | Read positions in a fictional spatial job and use those points; supplied positions do not establish independent plotting, data graphs, rates or the full topic. |
| `mt_cqSf213hSa` · Measuring length (age 6+) | Iterate same-size units end-to-end without gaps/overlaps and count units spanning a length. | Count traversed intervals, including retracing, in fictional model metres. No physical scale, ruler/tool measurement, diagonal distance or independently measured real data. |

Full refreshed hard-union inventory (titles are source titles; audit58 contains the description/evidence dispositions):

- `mt_8OAGVdeTJ_` — Understanding angles.
- `mt_KaF0SQvaiu` — Measuring length and height (age 5+).
- `mt_MFfYcnv6Tv` — Right Angles & Turns.
- `mt_NtJYlJdUe9` — Measurable Attributes of Objects.
- `mt_QysgF57dxh` — Lines, Rays & Angles.
- `mt_TdV9YGJEoY` — Position, direction, and movement.
- `mt_Y9XKzLrUAZ` — Turns & Directions.
- `mt_cqSf213hSa` — Measuring length (age 6+).
- `mt_h0CVtqI2xo` — Types of angles.
- `mt_jBQS-CicNn` — First Quadrant Coordinates.
- `mt_oDlduFnemk` — The coordinate grid.
- `mt_qeZYF6HZ4o` — Positional Language.
- `mt_snlqRCiA1R` — Plotting points in the first quadrant.
- `mt_u23IGDxOpk` — Parallel and perpendicular lines.
- `mt_uhuxX8sg9f` — Comparing Lengths & Heights.

Angle classification, body turns, handwriting, geometric construction, broad shape recognition and general independent spatial ability remain unobserved ancestors, not newly taught/assessed requirements. Cardinal absolute N/E/S/W moves do not establish clockwise/anticlockwise or relative-heading turn competence. No source prerequisite becomes an access lock.

## Candidates considered without adding mappings

- `mt__p5n8z5soJ`, **Step-by-Step Instructions**: everyday procedures and computers following exact instructions; evidence asks for writing/describing a task, predicting a missing/wrong-order step and explaining that a computer cannot guess intention. Its hard prerequisite is `mt_XbGfVhfiUz` (computers existing). Route sequencing is related, but it already exists in Cartographer/Post; adding a supplied stop constraint and role cards alone does not establish the broader computer/everyday-task criteria. No new computing mapping/closure is needed.
- `mt_r-BgS-lqTe`, **Giving and following instructions**: receive/give **spoken** instructions, listen stepwise, ask for clarification and give clear instructions to others. Actual evidence includes four spoken instructions, partner picture-drawing and checking a partner’s result. Hard prerequisites are `mt_f8n4txtLej` and `mt_mB7DVai-Uf` (Asking Questions; Listening and responding). A one-device solo mode does not observe those interactions. Optional real conversation is welcome, but opening two cards or tapping routes is not partner participation, listening or collaboration attainment.
- `mt_TMoHjMhRS2`, **Precise Maths Communication**: accurate vocabulary, units and symbols; actual evidence includes equality meaning, measured-answer units and precise geometry/comparison terms. Supplied coordinates/units support this context but do not newly establish those criteria. Existing coordinate/unit references suffice.
- Narrator’s Point of View is about literary narration, not role-specific app cards. Neither fictional roles nor limited display establishes empathy, trust, theory of mind or secure information separation. No new social/communication topic is inferred merely from the two seats.

These candidates are inspected references, not new mapped nodes. Their transitive closures are not adopted or recursively expanded.

## Job truth and route semantics

The fixed fictional map is Post Office `(1,1)`, Bridge `(4,1)`, Café `(4,4)`, Garden `(1,4)`. The three supplied jobs are Post → Bridge → Café; Post → Garden → Café; Garden → Post → Bridge. This is authored schematic geography, not a real delivery map, real scale or source-derived route. Existing free-map rounds remain independently editable and must not be silently overwritten by a fixed job.

The map-reader card shows positions; the dispatcher card shows the requested intermediate/final stops. Both cards can be opened freely on one device, separately or together. Solo use is fully supported. Their visibility is presentation, not a security boundary; no hidden-information integrity, partner participation or cooperation grade is asserted. Seeing both cards does not invalidate an attempt or count as a failed social task.

Existing `walkMap` returns final arrival only when the path ends at the target and has no blocked command; it counts actually travelled unit intervals. It **does not check an intermediate job stop**. The new job condition is therefore separate: route complete, unblocked, at most12 native commands, and the required intermediate point appears in the path **before the final endpoint**. Preserve final-arrival feedback independently from stop-order feedback. A visited stop is recorded even at the last travelled point; service separately requires that visit before the final delivery point. This keeps a real stop visit visible even when a route ends or blocks before reaching its destination. A same-coordinate visit is a path event, not an implicit stop inferred from a direct line or a name on the request.

Concrete semantic probes for the first job: `eee nnn` reaches Bridge then Café in6 moves; `nnn eee` ends at Café in6 but misses Bridge and must retain “arrived” while failing the requested intermediate-stop condition. `nnn eee sss nnn` is12 moves: it passes Café early, later visits Bridge and finishes at Café, so it satisfies the stated completion-time-delivery rule. Do not stop execution at the earlier Café visit or impose an unrequested “never pass destination first” rule. All three jobs have straightforward6-command routes and fit the12-command limit; retraced intervals still count.

Saved checks must retain job/request identity, map positions, actual route and the independently recorded arrival/stop condition in whatever reviewed implementation shape is chosen. Do not reinterpret an earlier free-route arrival as a completed job, retrofit current job conditions into old records, or report simply opening a role card as independent reading/communication evidence. Card visibility, help, narration requests and familiarity remain separate from route outcomes. No shortest-route score, reflex task, decoding/fluency, real-world delivery skill or cooperation assessment follows.

## Licenses and evidence boundary

Retain existing Jane path notices and Marble attribution © Generative Spark, Inc. (Marble), ODbL1.0 database and CC BY-SA4.0 descriptive content. The source comparisons above are audit evidence; no new upstream lesson prose, code or assets are incorporated into the game. Keep the bundled pin unchanged. Source ages do not become placement/routing rules. This audit adds no learning-effect, transfer or collaboration-benefit claim, and does not import an unverified research claim from a prior PR.
