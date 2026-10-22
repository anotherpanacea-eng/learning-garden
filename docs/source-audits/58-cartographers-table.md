# Cartographer’s Table: source and overlap audit

Author source audit for spec58, 2026-10-21. Independent specification review remains separate; this document does not constitute review clearance.

## Sources and comparison

Refreshed upstream bytes supplied by the root author were inspected from the temporary upstream cache. Jane pin: [`d4903954d7c4d8118cbd1d2f7ed770544fd4ac81`](https://github.com/kentlangley/Jane/tree/d4903954d7c4d8118cbd1d2f7ed770544fd4ac81); files `LESSONS.md`, `src/engine.js`, `src/stuck.js`, `LICENSING.md`. Short purposeful stages, a separate worked example, manual stepwise support and stable item/state conventions inform design only. No new Jane code, lesson prose, art, grader, learner identity/storage, mastery thresholds, points or access gates are incorporated. Jane’s code and content have different licenses; this is not a blanket MIT-content reuse claim. Existing incorporated-code notices remain applicable.

Marble pin: [`3de50367b23be6a03d1a8385daae16d5eed2675d`](https://github.com/withmarbleapp/os-taxonomy/tree/3de50367b23be6a03d1a8385daae16d5eed2675d), `data/topics.json` and `data/dependencies.json`. Target IDs: `mt_jBQS-CicNn`, `mt_oDlduFnemk`, `mt_snlqRCiA1R`. Their union with **all transitive hard prerequisites contains 11 nodes**. Adding the equal-unit length reference `mt_cqSf213hSa` and its hard ancestors gives **15 nodes total**, with no overlap between those two closures. Hard closure traversal follows prerequisite edges only; soft edges below are recorded but do not recursively enlarge that hard union. These source relations are not learner access gates or claims that this activity teaches every ancestor.

Compared refreshed source with full vendored `curriculum/marble/topics.json` and `dependencies.json` (existing pin `96a7933754af672e1bfdbf7ecb05c325860c6e0d`): all 15 descriptions and evidence arrays match exactly. Fourteen names match; `mt_oDlduFnemk` changed from **“Numbers on a number line”** to **“The coordinate grid”**, with the coordinate-system description/evidence unchanged. Its actual content, not the old generic title, controls interpretation. Incoming `(prerequisiteId, strength, reason)` triples match for 14 nodes. The refreshed plotting topic adds one soft grid-reference edge (`mt_ejht12jhm2`); its existing hard coordinate-system edge is unchanged. No hard prerequisite change was found in this union.

The runtime `dist/marble-map.json` is a smaller graph, not the full vendored source: it contains only `mt_8OAGVdeTJ_`, `mt_MFfYcnv6Tv`, `mt_TdV9YGJEoY`, `mt_cqSf213hSa`, `mt_KaF0SQvaiu` from this 15-node union. It omits evidence arrays for all nodes. The first three retain matching names/descriptions; length-node display names omit the source age suffixes. All five retained descriptions match. Incoming source triples are complete for the two angle nodes and `mt_cqSf213hSa`; incoming edges for `mt_TdV9YGJEoY` and `mt_KaF0SQvaiu` are absent and represented by `outsidePrerequisites` counts (2 and 1). Therefore neither complete closure nor evidence equality can be claimed for the runtime graph. This audit alone does not authorize or perform graph expansion or repinning.

Preserve Marble attribution: © Generative Spark, Inc. (Marble); database ODbL 1.0, descriptive content CC BY-SA 4.0. The source meanings/evidence below are paraphrased; activities and map content are original. Source taxonomy ages do not become age routing or readiness claims.

## Node dispositions

| ID / role / actual source title | Source meaning and evidence | Scoped disposition and exception |
| --- | --- | --- |
| `mt_jBQS-CicNn` · target · First Quadrant Coordinates | Read ordered pairs; horizontal coordinate first; identify coordinates of shape vertices. | Bounded landmark-point reading only. No shape-vertex task or wider attainment. |
| `mt_oDlduFnemk` · target · The coordinate grid | Identify perpendicular axes and origin; explain horizontal then vertical distance; distinguish reversed pairs. | Explicit origin (0,0), labelled x/y axes and ordered pairs on intersections. Supplied grid does not demonstrate independent axis construction. |
| `mt_snlqRCiA1R` · target · Plotting points in the first quadrant | Plot/read points and explain coordinates in context; source also includes data pairs such as time versus distance. | Freely place four fictional landmarks at intersections 0..5 and interpret their positions. No data graph, rates or full-topic attainment. |
| `mt_qeZYF6HZ4o` · hard ancestor · Positional Language | Use basic positional language and follow placements, including left/right. | North/up, east/right and labelled controls scaffold position. Adult reading/support permitted; no independent vocabulary claim. |
| `mt_Y9XKzLrUAZ` · hard ancestor · Turns & Directions | Follow directional movement; demonstrate whole/half/quarter turns bodily; describe routes. | Cardinal unit moves and route description only. No body movement or relative-heading/turn assessment. |
| `mt_TdV9YGJEoY` · hard ancestor · Position, direction, and movement | Use clockwise/anticlockwise and fractional-turn vocabulary; relate right angles to quarter-turns; follow routes. | Absolute N/E/S/W moves on a fixed orientation. Rotations, fraction turns and broad independent following remain unobserved. |
| `mt_8OAGVdeTJ_` · hard ancestor · Understanding angles | Identify shape-corner angles; describe turns; explain angle as amount of turn. | Supplied perpendicular axes and orthogonal routes are contextual support. No angle explanation or shape-corner assessment. |
| `mt_MFfYcnv6Tv` · hard ancestor · Right Angles & Turns | Check right angles, compare angles with a right angle and relate four right angles to a full turn. | Right-angle axes are supplied, not independently constructed or checked. No full-turn/degrees criterion. |
| `mt_h0CVtqI2xo` · hard ancestor · Types of angles | Classify and order acute/right/obtuse angles; identify angles in triangles/quadrilaterals. | Explicit geometry exception: no angle classification, ordering or triangle/quadrilateral task. |
| `mt_u23IGDxOpk` · hard ancestor · Parallel and perpendicular lines | Identify horizontal/vertical, parallel and perpendicular lines in shapes or contexts. | Horizontal/vertical axes are labelled and perpendicular. Parallel-line and general independent identification remain unobserved. |
| `mt_QysgF57dxh` · hard ancestor · Lines, Rays & Angles | Draw perpendicular/parallel lines and identify them and angle types in two-dimensional figures. | Explicit drawing/shapes exception: controls place supplied symbols and unit segments, not handwritten geometric constructions or full lines/rays/angles evidence. |
| `mt_cqSf213hSa` · additional length reference · Measuring length (age 6+) | Measure by iterating equal units without gaps/overlaps and count spanning units. | Each adjacent interval is one fictional model metre; route length counts traversed intervals, not point markers. No physical measuring/tool-use claim. |
| `mt_KaF0SQvaiu` · length hard ancestor · Measuring length and height (age 5+) | Measure with cubes/ruler and record number plus unit. | Supplied model units and recorded route totals support number-with-unit meaning. No ruler use or real-object measurement. |
| `mt_uhuxX8sg9f` · length hard ancestor · Comparing Lengths & Heights | Directly compare lengths/heights with longer/shorter language. | Compare route A/B totals. No general height, double/half or real-object comparison attainment. |
| `mt_NtJYlJdUe9` · length hard ancestor · Measurable Attributes of Objects | Identify measurable attributes, including length, weight and capacity, and describe several attributes. | Only model route length is selected. Weight, capacity and broad attribute identification are outside the slice. |

## Complete incoming source triples for the audited union

Each line gives `(topicId, prerequisiteId, strength, reason)` at the refreshed pin, including soft incoming edges. A soft prerequisite outside the hard union is a contextual relation, not a new required learner test. Source reasons are reproduced as attributed taxonomy content under the content license above.

- (`mt_jBQS-CicNn`, `mt_TdV9YGJEoY`, `soft`, Position/direction vocabulary supports understanding coordinate grid)
- (`mt_oDlduFnemk`, `mt_QysgF57dxh`, `hard`, Coordinate system builds on understanding perpendicular lines)
- (`mt_snlqRCiA1R`, `mt_ejht12jhm2`, `soft`, Grid references that name cells precede plotting points with coordinates)
- (`mt_snlqRCiA1R`, `mt_oDlduFnemk`, `hard`, Plotting points requires understanding the coordinate system)
- `mt_qeZYF6HZ4o`: no incoming edges.
- (`mt_Y9XKzLrUAZ`, `mt_-hTTat0mBR`, `soft`, Understanding half and quarter turns benefits from the concept of halves and quarters)
- (`mt_Y9XKzLrUAZ`, `mt_qeZYF6HZ4o`, `hard`, Describing movement and turns builds on positional language)
- (`mt_TdV9YGJEoY`, `mt_qeZYF6HZ4o`, `hard`, Position/direction vocabulary with right angles extends basic positional language)
- (`mt_TdV9YGJEoY`, `mt_Y9XKzLrUAZ`, `hard`, Right-angle turns (clockwise/anti-clockwise) build directly on whole/half/quarter turns from Year 1)
- (`mt_8OAGVdeTJ_`, `mt_sBcRdUfAzV`, `soft`, Understanding angles as shape properties requires knowing basic shape properties)
- (`mt_8OAGVdeTJ_`, `mt_TdV9YGJEoY`, `hard`, Recognising angles as turns extends Y2 work on quarter/half/three-quarter turns)
- (`mt_MFfYcnv6Tv`, `mt_8OAGVdeTJ_`, `hard`, Identifying right angles requires understanding what an angle is)
- (`mt_MFfYcnv6Tv`, `mt_e4V6hvcuEJ`, `soft`, Identifying right angles and turns is supported by the convention of marking right angles with a small square)
- (`mt_MFfYcnv6Tv`, `mt_TdV9YGJEoY`, `hard`, Right angles as quarter turns extends Y2 turn vocabulary)
- (`mt_h0CVtqI2xo`, `mt_MFfYcnv6Tv`, `hard`, Identifying right angles and greater/less than right angle is prerequisite to naming acute/obtuse)
- (`mt_u23IGDxOpk`, `mt_MFfYcnv6Tv`, `hard`, Perpendicular lines require understanding right angles)
- (`mt_u23IGDxOpk`, `mt_qeZYF6HZ4o`, `soft`, Horizontal/vertical builds on positional vocabulary)
- (`mt_QysgF57dxh`, `mt_h0CVtqI2xo`, `hard`, Y4 acute/obtuse angle identification is prerequisite to drawing and labelling angle types)
- (`mt_QysgF57dxh`, `mt_u23IGDxOpk`, `hard`, Y3 horizontal/vertical/perpendicular/parallel lines is prerequisite to drawing and identifying them formally)
- (`mt_cqSf213hSa`, `mt_KaF0SQvaiu`, `hard`, Measuring with iterated units extends Y1 beginning to measure length)
- (`mt_cqSf213hSa`, `mt_skYly2Qm01`, `soft`, Measuring with units benefits from ability to order and compare lengths)
- (`mt_KaF0SQvaiu`, `mt_uhuxX8sg9f`, `hard`, Measuring length with units requires first being able to compare lengths directly)
- (`mt_uhuxX8sg9f`, `mt_NtJYlJdUe9`, `hard`, Comparing lengths/heights requires first identifying length as a measurable attribute)
- `mt_NtJYlJdUe9`: no incoming edges.

## Product boundary and existing overlap

The proposed slice is an intersection grid with integer coordinates 0..5 on both axes (including the boundary axes), origin `(0,0)`, north/up and east/right. The learner freely places four landmarks, uses their symbol key, and constructs two routes A/B from adjacent unit moves, each at most 12 moves. One interval is **one fictional model metre**. Route length is traversed intervals, including every repeated traversal as explicitly required by spec58. The model does not establish real-map scale, screen-distance measurement, diagonal distance, negative quadrants, rates or general shortest-route proficiency. Static axes/key labels and supplied symbols are supports, not evidence of independently drawing a map, handwriting coordinates, constructing geometry or explaining concepts without help. Coordinate labels, landmark placement, route drafting, checked model lengths and support remain distinct from independent attainment. No length prediction or decoding assessment is implemented by this slice.

Willow Post Office (`dist/post-office-content.mjs`, `post-office-core.mjs`, `post-office-ui.mjs`) already has named-place messages, literal manual execution, clarification/revision, frozen visits and preserved drafts. Its `x/y` are SVG display pixels; all landmark pairs are possible direct flights. It has no equal-unit grid movement or accumulated distance. Reuse the interaction/state patterns, not an interpretation that existing named flights are unit edges. Editing a new table route must not rewrite an earlier delivery.

Orchard gathering (`dist/forage-core.mjs`, `forage-ui.mjs`) already uses a 4×4 **cell** grid with row/column clues, rows increasing up and columns right. Cartographer’s Table instead uses **intersection points** and `(x,y)` horizontal-first ordered pairs. Explicitly teach this difference; do not silently treat an Orchard plot ID as a plotted point. Its labelled tap controls and optional intersection help are design references, not evidence of prior coordinate attainment.

Number Garden (`dist/broad-ui.mjs`, `broad-content.mjs`, `broad-variants.mjs`) already supplies arrays, equal-unit ruler language, area and perimeter questions. Arrays count items/square units; route length counts intervals in linear model metres. Grid area is not route length. Workshop (`dist/workshop-core.mjs`, `workshop-ui.mjs`) already labels authored ruler distances **model cm** and supports stepped observation/replay. Reuse explicit model/unit disclosure and open cross-destination links without converting ramp results into map measurements. The existing open navigation and local explorer persistence preserve waiting work; no shared mastery label or forced prerequisite sequence is needed.

The distinct learner actions are authoring landmark positions and using a symbol key, reading/placing explicit ordered pairs, composing adjacent point-to-point paths, then counting and comparing equal-unit route lengths and revising. New scenery on the existing named-flight runner would not establish that distinction. A keyed authored map practices a bounded representation; it does not demonstrate field surveying or independent cartography.

## Official standards reference and limitations

The root author read the official [Common Core 5.G.A.1–2 reference](https://www.thecorestandards.org/Math/Content/5/G/). It is the primary design reference for perpendicular axes, origin, horizontal-first ordered pairs and interpreting plotted points in context. This audit did not independently fetch that page; the attribution is to the root’s source check. This bounded 0..5 fictional map supplies partial practice relevant to those ideas, not grade placement, standards completion or efficacy evidence. Time/distance data graphs, real-world scale, broader independent mathematical explanations and Marble shape/angle evidence remain outside the proposed slice.
