# Equal Blocks 288 · source and model audit

2026-10-28. This audit supports the bounded Equal Blocks tool at `#studio/mixing/bars`, within the Mixing Table family, under [spec 288](../specs/288-ratio-bars.md). It selects the bar-allocation operation from proposal 201, not the broader proposal's rates, graphs, historical scenes or conversions. This is source study and authoring analysis. Independent mathematical/content review, specification clearance and runtime verification remain separate gates.

## New operation and existing overlap

The learner constructs labelled bars from equal blocks, chooses a common number of model scoops per block and proposes which blocks the supplied known amount spans. One job gives the whole; another gives one named ingredient's share. The supplied fact stays fixed when the learner proposes the wrong brace scope. The purpose is to expose how the same ratio structure supports different unknowns.

The following actual implementations were inspected on main `797c3abf9ee567ebbc946836056750414dec8b35`:

| Existing work | Reused understanding and limit |
| --- | --- |
| Sharing Counter, spec 43, `sharing-counter-content.mjs` and core | Equal loaf partitions, selected fractions and twelve buns in four equal groups already connect group count with group value. Equal Blocks adds unequal labelled shares and the placement of a known-whole or known-share brace. It is not the first equal-sharing lesson. |
| Join the Portions, spec 103, `join-portions-core.mjs` | Moving already-cut equal-size pieces preserves their unit and total inventory. It does not derive an unknown unit value from a ratio and a given whole or share. |
| Fraction Trail and the recutting contrasts in spec 103 | Equal intervals, fraction position, same-whole equivalence and changed-whole distinctions are existing supports. They do not supply the selected unequal-allocation operation. |
| Whole Batches, spec 50, `whole-batches-content.mjs` and core | Repeating 100/150 mL recipe cards, recovering a base and contrasting equal additions with another complete batch already teach substantial scaling and inverse reasoning. Equal Blocks changes the given quantity and requires the learner to construct the ratio units and locate the known amount. A new recipe wrapper alone would duplicate this work. |
| Keeper's Desk Case 1, `keepers-desk-content.mjs` | Actual crossing tasks simplify 45:135 and 2:38, express the cart counts as 1/4 and 1/20 of their combined wholes, and distinguish ratio from difference. Proposal 201's part-to-whole item B3 and simplification item B6 are reprises, not new quizzes or capabilities. |
| Mixing Table 287, its content, core, UI and art | Editable two-ingredient composition, equal ratios at different totals, near-miss repair, ordered comparisons and the equal-addition exception are already available. Its count controls and grouping support do not impose a supplied whole, find an unknown block value or allocate three labelled shares. Preserve its existing pots, stripes and display model. |

The six selected original jobs use **model scoops**, not measured liquid volume: whole 20 with white:blue 2:3; whole 24 with white:blue 1:2; whole 60 with red:blue:white 1:2:3; white 8 in white:blue 2:3; yellow 12 in yellow:blue 3:2; and blue 20 in red:blue:white 1:2:3. They share one allocation operation with a changed known quantity. They do not commission a three-pigment color simulation.

## Fresh upstream inspection

Public default-branch metadata was refreshed on 2026-10-28. Relevant files were read at these exact revisions:

- Jane [`e88f81a00553fb87818ef84c77a8800f0dcb33e4`](https://github.com/kentlangley/Jane/commit/e88f81a00553fb87818ef84c77a8800f0dcb33e4), committed at 14:55:13 UTC: `LESSONS.md`, `LICENSING.md`, `src/stuck.js` and `public/app.js`.
- Marble [`e9b97a3533de81bc3939f6cb417da4e83f865217`](https://github.com/withmarbleapp/os-taxonomy/commit/e9b97a3533de81bc3939f6cb417da4e83f865217), committed at 17:43:43 UTC: `data/topics.json`, `data/dependencies.json` and selected complete records in `data/teaching-research.json`. Same-day full file reads at this exact revision were used after confirming that the current head was unchanged.

Jane's actual `fracbar` renderer fixes the number of pieces, lets the learner toggle shaded pieces and submits shaded pieces divided by all pieces. It cannot construct independently labelled ratio bars, place a known-share brace or assign an unknown block value. Its short teaching, visible guided work and subsequent practice are useful design references. `src/stuck.js` prioritizes authored examples and steps; generic fallback help may reveal an answer, so it is support rather than evidence of an independent attempt. Original native controls, diagrams and finite local records are appropriate here. No Jane engine, rewards, mastery labels, locks, remote learner behavior, prose or assets are adopted.

## Selected Marble meanings and prerequisites

Titles alone were not used to select records. The actual descriptions, evidence, incoming edges and relevant teaching research were inspected.

| Record | Actual scope | Incoming dependencies at the refreshed pin |
| --- | --- | --- |
| Bar Models for Ratios `mt_ePXg_XyCKU` | Construct equal labelled blocks; find one block's value; solve and explain; compare representations. Reading a prepared bar alone does not observe construction. | None listed. This is not evidence that prior understanding is unnecessary. |
| Dividing Quantities by Ratio `mt_nOCPx5qw0Z` | Allocate a whole using the sum of all ratio terms, state shares and their fractions of the whole, and express completed shares as a simplest ratio. Its evidence includes three-part allocation. | Hard: vocabulary `mt_ATYLKt0je-`, bars `mt_ePXg_XyCKU`, unequal-sharing/fractions `mt_FnUJMXPUZX`, notation `mt_XWSGuFW7It`. |
| Ratio Notation and Relationships `mt_yK51ZnKA8m` | Ordered multiplicative relationships, fractions of another quantity, constant multipliers and connections to linear functions. This is broader than the selected tool. | Hard: vocabulary, proportion graphs `mt_FspV_imUGK`, one quantity as a fraction `mt_xAf2bu9wYK`, notation. Soft: linear functions `mt_WBdHkc2HTf`. |
| Ratio Notation `mt_XWSGuFW7It` | Ordered notation, common-factor simplification and fractions of the combined whole. Decimal/fraction ratios are also in its evidence and are not taught here. | Hard: vocabulary, factors `mt_FHIAv6dfhU`, unequal sharing. Soft: proportion graphs. |
| Understanding fractions `mt_FnUJMXPUZX` | Unequal sharing and grouping using fractions and multiples, rather than generic introductory fraction recognition. | Hard: simplification/common denominators `mt_b7T-CjOYUR`, bars, ratio vocabulary `mt_ESgc4YBw-a`, ratio reasoning `mt_h0gJcSuwdL`. |

These five records' names, descriptions, evidence and full incoming prerequisite/strength/reason lists match the bundled `96a7933754af672e1bfdbf7ecb05c325860c6e0d` pin. Direct prerequisite meanings were also inspected. This is not a claim that the entire transitive graph is unchanged. Keep the existing bundled pin, with no access lock or full-topic completion claim.

The research recommends constructing before calculating, making equal units explicit, counting every ratio term, finding a block's value and checking the shares against the given amount. It distinguishes forward allocation from shares-to-simplest-ratio work. Snapping blocks, propagating values and toggling layouts are optional mechanisms, not requirements. Its records disclose agent semantic rewriting without fresh source verification and proposed activities without empirical validation. They do not establish efficacy.

The relationship record's inherited expression `y = (a/b)x` for `x:y = a:b` has its direction reversed; the appropriate expression is `y = (b/a)x`. A fraction of the combined whole uses all parts in its denominator. Equal Blocks need not teach a graph or formula to use the narrower relationship correctly.

## Primary institutional sources read

| Source | Selected support and limit |
| --- | --- |
| [NCETM 3.1, Understanding multiplicative relationships](https://www.ncetm.org.uk/media/mqfp3xb3/ncetm_ks3_cc_3_1.pdf), printed pages 2 and 28–30 | PDF text was read. It connects representations, treats given-share problems, notes the usefulness of bars for three-way sharing and changes the referent whole. This supports the changed-unknown return. The material is teacher development and cautions against lifting it directly into lessons. Diagram screenshot retrieval failed, so visual inspection of those diagrams is not claimed. |
| [DfE mathematics programmes of study](https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study), KS3 ratio section | Explicitly includes dividing a given quantity into two parts in a part:part or part:whole ratio and expressing completed division as a ratio. Early three-part allocation is a selected generalization, not a quotation of that two-part statutory statement. |
| [Common Core 6.RP.A.3](https://www.thecorestandards.org/Math/Content/6/RP/) | Names tape diagrams among representations for ratio reasoning. This is curriculum context, not certification of complete standards coverage or game effectiveness. |

The NRICH article cited by Marble, *Ratio or Proportion?*, returned HTTP 403 during this study. Its content was not independently verified and is not used to close a source gate. No historical, agronomic or fluent-language claim is selected. No external lesson strings, diagrams, worksheets, assets or interactive code are incorporated.

## Exact model boundaries and mathematical checks

Every block in a proposed plan has the same positive integer number of model scoops. The proposed finite limits are 12 blocks per ingredient and 1–20 scoops per block. These are interaction bounds for exact whole-number examples, not a statement that ratios require integer quantities or a complete fractional-ratio course.

Authoring arithmetic gives:

| Given fact and ordered ratio | One-block example | Resulting shares and whole |
| --- | --- | --- |
| Whole 20, white:blue 2:3 | 5 blocks, 4 scoops each | White 8, blue 12; whole 20 |
| Whole 24, white:blue 1:2 | 3 blocks, 8 scoops each | White 8, blue 16; whole 24 |
| Whole 60, red:blue:white 1:2:3 | 6 blocks, 10 scoops each | Red 10, blue 20, white 30; whole 60 |
| White 8, white:blue 2:3 | White's 2 blocks hold 8, so 4 each | White 8, blue 12; whole 20 |
| Yellow 12, yellow:blue 3:2 | Yellow's 3 blocks hold 12, so 4 each | Yellow 12, blue 8; whole 20 |
| Blue 20, red:blue:white 1:2:3 | Blue's 2 blocks hold 20, so 10 each | Red 10, blue 20, white 30; whole 60 |

These are example constructions, not mandatory canonical paths. For whole 20 in 2:3, 2:3 blocks with 4 scoops each and 4:6 blocks with 2 scoops each are both valid within the selected limits. A successful plan must preserve ordered ratio equivalence, a common unit value, and the supplied known amount under its actual whole/share scope. Matching the whole alone is insufficient; matching the ratio alone is insufficient. The learner's proposed brace never changes which quantity the job supplied. A whole brace and an ingredient brace therefore test different facts even if a guessed calculation happens to produce a familiar number.

The authoring calculations above are not independent mathematical clearance. The separate mathematical reviewer must check the complete finite contract, all permitted equivalent plans and misleading feedback cases. Supplied worked examples and automatic readouts are not independently produced explanations or proof of the learner's mental method.

## Attribution, custody and remaining gates

Jane's [path-specific licensing map](https://github.com/kentlangley/Jane/blob/e88f81a00553fb87818ef84c77a8800f0dcb33e4/LICENSING.md) assigns application code MIT, documentation and example packs CC BY-SA 4.0, and derived glossary/taxonomy databases ODbL 1.0 with CC BY-SA 4.0 text. Marble database/edges are ODbL 1.0 and Marble-authored topic/research text is CC BY-SA 4.0; cited external works retain their own terms. Preserve existing [NOTICE](../../NOTICE), license files and the bundled pin. Design study imports no new upstream code, prose, assets or dataset. Any later actual incorporation must identify its paths and applicable terms.

The route and separate `ratioBars` notebook owner belong to the bounded specification. They do not authorize a shared game engine, taxonomy migration, generic studio hub or rewriting Mixing Table 287 work. Parent-guided exploration, open destinations and separate support/familiarity/attempt records remain required. No story plan, Act III/IV contribution, history scene, exchange rate, graph, conversion or three-paint display model is cleared by this audit.

The selected source gate is addressed for the elementary bar-allocation mathematics and original model context, subject to independent content/specification review. Independent mathematical/content review and specification review must precede build. Runtime checks must subsequently cover actual construction and brace behavior, equivalent valid plans, equal geometry and labels, tablet/keyboard controls, support distinctions, retained work, actual notebook transfer and existing route preservation. Exact-candidate Claude implementation clearance and the established merge/deploy verification remain required. AI review is not qualified-human approval; browser checks do not establish physical iPad/Safari behavior, audible quality, physical paint or measuring skill, learning efficacy or full ratio mastery.
