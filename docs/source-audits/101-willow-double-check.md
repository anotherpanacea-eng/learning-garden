# 101 · Willow Double Check source and overlap audit

Checked 2026-10-22 for [spec 101](../specs/101-willow-double-check.md), from Learning Garden main `526210ac97e8a39eecea4ae32ab55ca23238aeb6`. This is a narrow design audit, not a coverage or learning-outcome claim.

## Existing local action

`dist/sorting-desk-content.mjs` owns one star-stamp request, four stamp/wrap cards and two baskets. `dist/sorting-desk-core.mjs` validates/copies a version-1 source and runs a **single** selected test (`stamp-star`, `stamp-circle`, `wrap-blue` or `wrap-yellow`), then takes exactly one branch; it has no two-clue connector. `dist/sorting-desk-ui.mjs` supplies selector, prediction, trace, history, recovery and its own `sortingDesk` root. That saved program and its immutable checks must remain v1. `dist/repeat-deliveries-core.mjs` repeats a literal route, not a conditional, and `dist/post-office-core.mjs` remains a delivery runner. Double Check reuses visible trace and guarded save/notes patterns, but its new action is to **combine two independently read supplied features** and compare two connectors on the **same** parcel. A second optional root avoids regrading or silently upgrading original Sorting Desk saves. No real parcel or child data is introduced.

## Refreshed upstream and exact limits

Jane public main was [`1a555c1236e4b18babcc78d14307682755576e45`](https://github.com/kentlangley/Jane/tree/1a555c1236e4b18babcc78d14307682755576e45). I read its [`LESSONS.md`](https://github.com/kentlangley/Jane/blob/1a555c1236e4b18babcc78d14307682755576e45/LESSONS.md), [`src/engine.js`](https://github.com/kentlangley/Jane/blob/1a555c1236e4b18babcc78d14307682755576e45/src/engine.js), and [`LICENSING.md`](https://github.com/kentlangley/Jane/blob/1a555c1236e4b18babcc78d14307682755576e45/LICENSING.md). Stable authored stages and optional help are useful design references; its grades, stage gates, adaptation, lesson prose, code and media are not adopted. Jane code is MIT; lesson/docs and Marble-derived layers have separate CC BY-SA/ODbL terms. This proposal uses original story text, cards and mock art rather than copying any source's protected lesson expression.

Marble public main was [`a8719737ff86ef7940ba5feca11940de1204103e`](https://github.com/withmarbleapp/os-taxonomy/tree/a8719737ff86ef7940ba5feca11940de1204103e). I read the exact `data/topics.json` records and *all incoming edges* in `data/dependencies.json` for the relevant IDs. The local pinned graph remains separately owned; this proposal does not repin it or add atlas references.

| Current Marble topic | Actual description/evidence and full incoming edges | Limit here |
| --- | --- | --- |
| `mt__p5n8z5soJ` · Step-by-Step Instructions | Precise everyday steps and exact computer following; hard incoming `mt_XbGfVhfiUz` (computers exist). | The existing delivery and instruction activities already give a stronger literal-step example. This does not newly claim the whole topic. |
| `mt_iqmt8wL26h` · Decisions and repeats in algorithms | Follow/describe a sequence, a branch and an iteration; one evidence example is an if/otherwise sorting decision. Hard incoming `mt__p5n8z5soJ` (step-by-step instructions). | Two supplied tests and one branch, but **no iteration**, so partial only. |
| `mt_sPV503BQnI` · My first visual program | Start, block sequence, run/observe and swap blocks. Soft incoming `mt_iqmt8wL26h` and `mt_o0vTMl8vj5`; hard incoming `mt__p5n8z5soJ`. | A radio connector is not general block construction. |
| `mt_nfGAtwqSvP` · Decisions and input in programs | Input and if/then/else comparisons in a visual program. Soft incoming `mt_o0vTMl8vj5` and `mt_zQfWqImxva`; hard incoming `mt_sPV503BQnI`. | The two parcel features are supplied, finite inputs, not user sensors or open programming. |
| `mt_5UtPmgdoQ9` · Testing and debugging programs | Predict, run, find a differing behavior and fix one change at a time. Soft incoming `mt_8dstvf-KKb` and `mt_TDUpy57QVM`; hard incoming `mt_sPV503BQnI`. | A connector switch is a narrow contrast; it cannot establish independent debugging. |

These incoming edges are taxonomy dependency descriptions, not app prerequisites or locks. Current topic descriptions do not yield a dedicated Boolean-operator proficiency claim for four pictured parcels, and the locally pinned graph does not contain the newer branching/visual-program IDs above. No generated counts, topic additions or coverage changes follow.

## Primary computing guidance

[Microsoft MakeCode, “Complex conditionals”](https://makecode.microbit.org/v1/courses/blocks-to-javascript/complex-conditionals) explains combining two yes/no conditions with AND/OR. [Code.org, “Conditionals Explore” teacher lesson](https://lesson-plans.code.org/csp4-2023/fallback/teacher-lesson-plans/Conditionals-Explore.pdf) distinguishes both-true AND from either-true OR using four Boolean combinations and says memorizing a truth table is not the goal. These sources ground the logical truth rows only. They do not prove this prototype's pedagogy, require a Code.org classroom activity, or justify importing their sample stories, code, images or slide designs. This finite desk deliberately excludes the sources' wider language/runtime topics, including NOT, nesting, iteration and short-circuit execution. Its four parcel cards, Pip request, copy and visual mock are original.
