# Number Garden helpers and targeted feedback

Status: implemented; independent spec and implementation reviews cleared. Extends the [responsive help](../responsive-help.md) pattern, already used by story and café tasks, to Number Garden. Works with authored items now and generated items after [spec 17](17-number-garden-variants.md).

## Problem

Every wrong Number Garden answer gets the same response: "Let's take another look." Many items have one predictable wrong answer that shows exactly what the child was thinking. Support is a one-line hint or the full worked solution, with nothing between; story and café tasks already offer a smaller parallel example, but Number Garden does not.

## Targeted feedback

Items may add `misconceptions`, a map from a wrong value to a short response that asks a question or points at the picture without giving the answer (a function of `params` for generated items). A matching wrong attempt shows that response in place of the generic one and records `misconception` on the attempt; notes show it plainly, such as "Tried 14 (the end mark) before finding 11." Choice items give each distractor its own response.

| Item pattern | Wrong value | Response |
| --- | --- | --- |
| Value of a digit | The digit itself | "The 6 is on the tens shelf. How much is each thing on that shelf worth?" |
| Adding tens | Added ones instead | "Pip added two ten bundles, not two loose seeds." |
| Two-step story | First step only | "That's the bags. Did Dot add anything else?" |
| One quarter of a total | 4 | "There are four groups. How many seeds are in one group?" |
| nth term | One jump too many | "The first stone is already there before any jumps. How many jumps reach the fifth?" |
| Square symmetry | 2 | "Try folding from corner to corner, too." |
| Rectangle symmetry | 4 | "Fold along a diagonal. Do the edges match?" |
| Shifted ribbon | End mark | "That is where the ribbon ends. Where did it start?" |
| Perimeter | Area | "That counts the squares inside. The fence goes around the outside." |
| Missing addend | The total | "Put 12 in the space and add 7. Is it still balanced?" |

## Smaller examples and steps

Each of the 28 check-in items and 21 adventures gains a helper in `help-content.mjs` using the existing helper contract and models (text, array, ruler, compare), adding `place`, `fraction` and `pattern` models where needed. Helper use follows the existing evidence rules: `helpUsed` makes the original observation supported, helper attempts are recorded separately, and helpers never advance the original question.

Items may also add `steps`, a list of partial worked steps ending before the answer. The support row becomes **A little hint**, **Show me the first step**, **A smaller example**, **Work through it together**; a child can stop at any level. Observations add `supportLevel` (0 none, 1 hint, 2 steps or helper, 3 full solution) alongside the existing `hinted` and `revealed`, so current descriptions keep their meaning.

## Verification

Every misconception key differs from the answer and no response, step or helper text contains the original answer. Matching and non-matching wrong attempts produce the right response and record. Every Number Garden item has a valid helper whose numbers differ from the original. `supportLevel` agrees with `hinted`, `revealed` and `helpUsed` on every path, and helper use never yields independent or fresh evidence.

## Build clarification

Use the established helper data/attempts contract in a Number Garden helper module; do not couple a broad task to a story visit. The waiting draft retains its answer input and all support when opening/closing a helper. A helper result never advances the waiting question. Support level is derived monotonically from flags, not a separately mutable score. No helper or step may solve the waiting question; literal number coincidences in unrelated text are not an answer leak. Record targeted feedback per attempt, without treating a proposed misconception as a diagnosis of the learner.

The explicit support scale is 0 none, 1 hint, 2 partial steps, model/playground use or a smaller helper, 3 full original solution/total reveal. Lesson exposure and together-method still mark supported even when this explicit scale is zero. Helper arithmetic exposure updates all waiting drafts through existing app-level exposure functions.
