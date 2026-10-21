# Fraction Trail source audit — 2026-10-21

**Author research, pending independent review.** This supports [spec 52](../specs/52-fraction-trail.md), not a runtime mapping or permission to build. The [17-row crosswalk](52-fraction-trail.csv) records proposed teaching dispositions; every row remains `pending-independent-review`.

## Sources actually inspected

| Source | Revision / paths | What was checked |
| --- | --- | --- |
| Bundled Marble | `96a7933754af672e1bfdbf7ecb05c325860c6e0d`; `curriculum/marble/topics.json`, `dependencies.json` | Complete descriptions/evidence and incoming dependency reasons for the five selected targets and their transitive hard predecessors. |
| Refreshed Marble | [`2e6ced94833f0e48f6c1efad46e5f50c1f420f3c`](https://github.com/withmarbleapp/os-taxonomy/tree/2e6ced94833f0e48f6c1efad46e5f50c1f420f3c); `data/topics.json`, `data/dependencies.json` | 1,783 topics / 3,722 edges in this upstream snapshot. All 17 selected/ancestor nodes have unchanged names, descriptions, evidence and incoming dependency triples (ID, strength, reason) compared with the bundled pin. Metadata outside those fields is not declared unchanged. |
| Jane | [`d4903954d7c4d8118cbd1d2f7ed770544fd4ac81`](https://github.com/kentlangley/Jane/tree/d4903954d7c4d8118cbd1d2f7ed770544fd4ac81); `LESSONS.md`, `src/engine.js`, `src/stuck.js`, `LICENSING.md` | Authored number-line items, answer form/tolerance, optional help, separate examples and license layers. |
| Common Core 3.NF | [Official page](https://www.thecorestandards.org/Math/Content/3/NF/), fetched 2026-10-21 | 3.NF.A.1, A.2a/b and A.3 inform unit-fraction length, interval construction, iteration and same-point equivalence. These source criteria are studied; their prose is not copied into product content. |
| IES fractions guide | [Existing project reference](https://ies.ed.gov/ncee/wwc/PracticeGuide/15) | The refresh attempt returned a **scheduled-maintenance page**, despite HTTP 200. Its recommendations/evidence ratings were not reverified in this pass. Do not present that response as a successful source read. |

The upstream catalogue growth is not a vendored-pin refresh or evidence that new topics have been taught. Neither the 1,590-topic bundled graph, its 3,221 edges, the full-topic planning ledger nor the runtime atlas changes in this authoring pass.

## Exact source closure

Selected IDs: `mt_Kr3IyA6m-O`, `mt_NoB20kVa4w`, `mt_ndGqFPWyen`, `mt_Ep7TDFuYUa`, `mt_vKcxX6iNOA`.

Following incoming **hard** prerequisites transitively produces 16 distinct IDs. Four are themselves selected targets; the selected-plus-ancestor union is 17, not 21. The CSV contains that union exactly once. `mt_Ep7TDFuYUa` is the selected target not itself reached as an ancestor of these targets.

The proposed dispositions have three groups:

- **Needed meaning taught inline:** a fixed whole, zero, equal spaces, counting intervals rather than boundary marks, one unit fraction, repeated units from zero, and same-point equivalence. Earlier Sharing Counter visits are helpful but never assumed or required.
- **Optional support:** one-to-one counting/cardinality and reversible separation/equal-sharing meaning. The design does not demand fluent division or memorised facts to mark a line.
- **Explicit source-scope exceptions:** general fractions of sets, circular partitions, equal-area shares with different shapes, broad notation classification, arbitrary equivalence families and general fraction calculations. A length-only activity does not satisfy the full source evidence for these nodes. These exceptions need semantic review; the closure count cannot clear them.

Direct soft edges within the inspected union point to three additional ideas:

| Dependent → soft prerequisite | Design decision |
| --- | --- |
| `mt_Kr3IyA6m-O` → `mt_YzM5goBctT` (tenths) | Tenths can support number-line experience but are deferred to the later decimal bridge. This slice uses halves/thirds/quarters/sixths. No tenths coverage implied. |
| `mt_MyGblah2yY` → `mt_8RmpkDxT9L` (equality sign) | Explain `=` inline as the same numerical amount/point. No algebra or general missing-number equation criterion. |
| `mt_FbDKeLfBCo` → `mt_Kr3IyA6m-O`; `mt_cFltwUQi-d` → `mt_LpSuPgL31x` | Already present in the inspected union; explicit number-line/equal-sharing bridges are retained. |

The two soft-only nodes are not included in the 17-row hard-closure CSV. Their descriptions/evidence were read and also match the refreshed source: the first concerns equal tenths/counting/dividing by ten, the second interpreting +, − and = in number sentences. Only equality-as-same-value is used inline; full future units still need their own source review. This audit does not invent new taxonomy edges or turn graph prerequisites into learner access locks.

## Reuse decision

Jane's reviewed authored-item format supports a number line with min/max/step and an answer. Its engine grades by numeric tolerance; the generic hint narrows a zone around the answer and asks the learner to drag a flag. Those choices do not check whether equal intervals were constructed and would conflate placement with proximity for this task. A tiny original integer model is justified: 12 internal ticks per unit, two repeated units, editable boundaries and discrete reversible flag moves. No Jane code, text, diagrams or generated assets are incorporated. Stable work and separate worked examples are design references only; rewards, locks, timing and mastery inference are not adopted.

Marble-derived identifiers, names and dependency listings in the CSV retain the project's existing database ODbL 1.0 and authored-text CC BY-SA 4.0 notices and attribution to Generative Spark, Inc. (Marble). Original teaching dispositions are additions, not upstream claims. Jane application code is MIT while its lesson/docs paths are CC BY-SA 4.0; neither layer is silently relabelled as this app's MIT code.

## Mechanical checks and their limits

The author checked ID uniqueness, exact hard-predecessor closure, the selected/ancestor overlap, refreshed semantic-field/incoming-edge equality and that every CSV row points to numbered steps 1–9. The integer model can also enumerate all 2,048 internal-cut subsets and all their marker boundaries without approximation. These checks establish the finite model and accounting, not the educational suitability of the proposed exceptions, the quality of eventual teaching, or any runtime behavior.

The next reviewer should read the source descriptions and reasons, challenge the shape/set-to-length exceptions, inspect both the unequal-thirds and changed-whole contrasts, and confirm that supplied partitions and correct actual readings cannot become independent placement evidence. No independent reviewer has yet done that work for this candidate.
