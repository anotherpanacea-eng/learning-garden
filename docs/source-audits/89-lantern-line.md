# Lantern Line: source and overlap audit

Prepared2026-10-22 for [spec89](../specs/89-lantern-line.md), based on the internally reviewed extended candidate `794b002`. This is author preparation, not independent review or a full-topic mapping.

## Existing local work

[Fraction Trail52](../specs/52-fraction-trail.md) and `dist/fraction-trail-ui.mjs` already teach whole/partition/flag/reading, accept equivalent fractions and compare kept/current routes at the same scale. [Same Amount, New Cuts70](../specs/70-same-amount-new-cuts.md) already matches a fixed equivalent reference under a new required partition. Tenths/Hundredths add part-whole notation and selected same-whole comparisons. A line, a flag, equivalent labels and compare/revise/keep are reused patterns, not new claims.

Lantern Line's selected gap is two independently placed fractions on one whole route, including **non-equivalent** fractions. It asks for their actual order while retaining separate placement accuracy. Existing Fraction Trail has one current flag and a kept snapshot within a request; ribbonMatches deliberately requires a representable equivalent goal and does not admit a non-equivalent ordering request. Extending those old strict source schemas would change their saved meaning. A small separate optional root keeps old work intact. The old12-tick integer-coordinate convention and native move/focus patterns are reused; all new copy/line drawings are original. No general fraction parser or engine is needed.

## Exact upstream study

Public source heads checked during this work were Jane [`b7617426`](https://github.com/kentlangley/Jane/tree/b7617426c1c015f2a97d492a992b70377dfa7873) and Marble [`a8719737`](https://github.com/withmarbleapp/os-taxonomy/tree/a8719737ff86ef7940ba5feca11940de1204103e). Exact Jane [LESSONS.md](https://github.com/kentlangley/Jane/blob/b7617426c1c015f2a97d492a992b70377dfa7873/LESSONS.md), [LICENSING.md](https://github.com/kentlangley/Jane/blob/b7617426c1c015f2a97d492a992b70377dfa7873/LICENSING.md), and Marble [topics](https://github.com/withmarbleapp/os-taxonomy/blob/a8719737ff86ef7940ba5feca11940de1204103e/data/topics.json)/[dependencies](https://github.com/withmarbleapp/os-taxonomy/blob/a8719737ff86ef7940ba5feca11940de1204103e/data/dependencies.json) were read. Jane's separate example, guided action and optional support informed the presentation; its generated lessons, prompts, engine, placement, rewards and gates are not copied.

| Current Marble ID | Source meaning studied | Limited relation and missing work |
| --- | --- | --- |
| `mt_IfEgu0X449` | Compare/order unit fractions and same-denominator fractions. | Two unit fractions and one same-denominator pair on a supplied common line. Not an independent explanation or systematic ordering sequence. |
| `mt_NoB20kVa4w` | Partition a unit interval and iterate unit-fraction lengths to locate a fraction. | Supplied equal-part movement and two marker placements. Child does not construct all partitions or explain a general method. |
| `mt_Ep7TDFuYUa` | Equivalent size or the same point on a line; diagram families. | One coincident2/4-and1/2 request plus whole endpoints. Not general equivalence generation, proof or complete families. |

Current incoming hard edges connect number-line experience and unit fractions to the placement topic, and placement/unit-fraction/diagram equivalence to equivalent points. Those are authoring dependencies: inline whole/part/iteration support stays open and no source edge becomes a child access lock. The fresh source names are not enough to infer complete teaching coverage. No atlas row, coverage count or upstream pin change is proposed here; broader fraction ordering, general algorithms, ratio and operations remain separate design.

Jane's application code is MIT; original lessons/docs are CC BY-SA4.0 and its embedded Marble-derived material has separate database/content terms. Marble database is ODbL1.0; authored text is CC BY-SA4.0,©Generative Spark,Inc.(Marble). This feature studies those source meanings and retains exact citations; it copies no lesson prose, prompt, code or art. Existing vendored taxonomy notices and pin remain unchanged. All learner scenarios and diagrams will be original fictional model work, not personal data or physical measurement.
