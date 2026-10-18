# Number Garden picture and text corrections

Status: proposed; awaiting independent spec review. Number Garden content and copy only. All examples are the existing authored items.

## Problem

Children read a picture beside a question as a picture of that question. In several Number Garden adventures the editable model shows a different object or different numbers from the question under it, and in check-ins the picture playground's readout states the answer. The comment at the top of `broad-content.mjs` says adventure models are deliberately separate teaching examples; the page does not show that separation, and the note under every model ("The question still uses its original numbers") is untrue for adventures.

## Pip's example and your turn

In adventures, label the model panel **Pip's example** with a one-line caption generated from the current model state ("Pip built 4 tens and 3 ones."), updated as the child changes it. Rename "Now try a new example" to **Your turn**. Replace the note under editable models: adventures say "This is Pip's example. Change it to explore. Your turn uses new numbers."; check-in playgrounds say "Change this picture to explore. The question keeps its own numbers."

An example may use different numbers but must show the same kind of object and structure as its question:

| Item | Question | Model now | Model after |
| --- | --- | --- | --- |
| `geometry-support` | Corners of any triangle | square | `shape('triangle')` |
| `geometry-explore` | Symmetry of an 8 × 3 rectangle | square | `shape('rectangle')` |
| `fractions-support` | One of 4 equal parts | 2 parts | `fraction(4,1)` |
| `patterns-stretch-activity` | Start 2, add 6 | 1, 6, 11 (step 5) | `pattern([1,7,13],6)` |
| `geometry-stretch-activity` | Facing after 3 quarter-turns | rotated triangle | `shape('triangle',0)` until the compass model in [spec 18](18-number-garden-interaction-and-wording.md) |

Place-value, array, counter and ruler examples that already share their question's concept keep their numbers and rely on the label.

## Check-in readouts

Opening the check-in playground is recorded as support, and its readout currently states the answer ("34 altogether" for `number-foundation`; "4 rows × 6 in each = 24" for `operations-anchor`). In check-ins, readouts describe structure only ("3 tens, 4 ones"; "4 rows, 6 in each"). A **Show the total** control reveals the total and records `revealed`, which notes already report as a worked solution. Adventures keep full readouts.

## Copy

| Where | Now | After |
| --- | --- | --- |
| `patterns-anchor` | "Use the same rule, add 4 each time" | "New rule: add 4 each time" |
| `patterns-anchor-alt` | "Use the same rule, add 8 each time" | "New rule: add 8 each time" |
| Grown-up notes, "What to try next" | "Ask her which part felt comfortable" | "Ask which part felt comfortable" |
| `number-explore` lesson | "Dot appoints each digit a shelf" | "Dot gives each digit a shelf" |
| Shape readout | "1 quarter turns" | Singular and plural forms |

A trail can begin on `patterns-anchor`, so "the same rule" is the first patterns text some children read. The Number Garden home gains one line introducing its creatures, "Pip is a fox who loves a plan. Dot is a ladybug who loves a question," so titles such as "Fox-length hops" make sense; ladybugs are beetles, so existing beetle references stay accurate.

Open question for the owner: the app mixes British spellings (practise, metre, centimetre, labelled, across Number Garden, café, science and story modules) with American ones (counterclockwise). Choose one form for child-facing text; this spec makes no spelling change until that choice is recorded.

## Verification

Checks: every adventure `shape` model matches a shape its question names; `pattern` model steps equal the question's step; no check-in readout contains its item's answer before Show the total; no learner-facing copy in `app.mjs` or `broad-ui.mjs` uses a gendered pronoun for the child. Existing broad checks keep passing. Browser: one adventure and one check-in per area at 375 px and 768 px.
