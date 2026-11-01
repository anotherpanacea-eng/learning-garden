# Source audit · 344 The Rod Tray

Prepared 2026-11-01 for [spec 344](../specs/344-rod-tray.md) and its [companion copy](../content/344-rod-tray-text.md). Learning Garden main at `a83fa0a` (after PR365).

## Upstream refresh

| Upstream | Commit read | What was used |
| --- | --- | --- |
| Jane `LESSONS.md` | [`e88f81a00553fb87818ef84c77a8800f0dcb33e4`](https://github.com/kentlangley/Jane/blob/e88f81a00553fb87818ef84c77a8800f0dcb33e4/LESSONS.md) (2026-10-28) | Teach → guided → practice order; a learn card with a step-revealed worked example; one guided item with 1–4 visible steps; the three-step "I'm stuck" ladder (hint, different worked example, then a way forward); at least one misconception-tagged wrong answer with its own short feedback; prompts at most 15 words and cards at most 30. **Not adopted:** hearts, points, streaks, bosses, medals, mastery, step-downs, nightly requeueing, one-quest-at-a-time. No Jane code or text copied. |
| Marble `os-taxonomy` | [`5e23196fa60050433f1440057f65a978d39e63fc`](https://github.com/withmarbleapp/os-taxonomy/tree/5e23196fa60050433f1440057f65a978d39e63fc) (2026-10-30) | `data/teaching-research.json` records for `mt_9QzSnn8m80` Positive and Negative Numbers (confidence high) and `mt_RVK655t391` Measuring temperature; `data/dependencies.json` and `data/topics.json` for the crosswalk below. |

The repository pins Marble at `96a7933754af672e1bfdbf7ecb05c325860c6e0d` (`curriculum/README.md`). The pinned and refreshed graphs give the same hard-prerequisite closure for the target (below), so no re-pin is needed for this slice.

### What the Marble research asks, and where the spec answers it

| Research point for `mt_9QzSnn8m80` | In 344 |
| --- | --- |
| Zero is a real reference, not "nothing"; sign is direction, size is distance | T1 zero pairs; model line; arrow captions name size and direction |
| Adding a negative moves left/down; subtracting a negative reverses direction and should be derived, not memorized | T2, T3; take-black derives 1 − (−3) = 4 with zero pairs before any rule is stated; Show on the line draws the reversal |
| Distinguish the sign of a number from the subtraction operation (brackets, color, gesture) | T4; brackets on every negative operand; read-aloud says "take away" and "negative" separately |
| Key representations: number line spanning zero; two-color counters with zero pairs; bank balance and debt | Tray plus optional line; baker's account in cases 3 and 6 |
| Misconceptions: −7 > −3 by digit size; two minuses conflated; numbers stop at zero; subtracting always makes smaller; subtracting a negative makes it more negative | Case feedback values: pay-off 10 and −4, take-black −2 and −4, take-red 2, two-below 8, cross-down 11 and 3; cross-down's arrow goes through zero |
| Probe: "Does subtracting always send you left? What did 1 − (−3) do?" | Spoken invitation after each case; take-black/take-red contrast pair |

`mt_RVK655t391` research advises deferring signed arithmetic until intervals across zero are secure. That is why this slice follows, and does not replace, the built Gap Line (289), which constructs and measures intervals across zero.

## Hard-prerequisite crosswalk

Transitive hard closure of `mt_9QzSnn8m80`, identical in the pinned and refreshed graphs (7 edges, 8 nodes):

| Topic | Hard prerequisite | How 344 meets it |
| --- | --- | --- |
| Positive and Negative Numbers `mt_9QzSnn8m80` | Measuring temperature `mt_RVK655t391` (intervals across zero) | Prior foothold: Gap Line 289 at `#desk/gaps` constructs and measures cross-zero intervals; discovery sits beside it. Not claimed as taught here. |
| Measuring temperature `mt_RVK655t391` | Negative numbers in context `mt_1KkvzwYxbR` | Supported inline: the baker's account (cases 3, 6) and the model line. No thermometer or flood post in this slice. |
| Negative numbers in context `mt_1KkvzwYxbR` | Negative Numbers `mt_vXRzMbiPff` (count back through zero) | Supported inline: arrow captions and T2 count steps to zero and past it. |
| Negative Numbers `mt_vXRzMbiPff` | Counting Within 1,000 `mt_M2v1A9OEuM` | Below this slice; counting to 12 only. |
| Counting Within 1,000 → Counting in 2s → Rote counting to 100 → One-to-one counting | (chain) | Below this slice. |

All four negative-number topics are `not yet mapped` in `curriculum/topic-coverage.csv`. This slice changes no coverage file; any atlas declaration is a separate reviewed follow-up. Prerequisites are supports and contrasts, not entry locks: the bench is open from the first visit.

## Reconciliation with spec 49 and spec 120

- **Spec 49 §4–5:** signed quantities belong to strand family M1-IV, Act IV (*The Town Has Two Stories*, "explicit lessons teach these operations before the larger dilemma relies on them"). The §5 teaching contract is met as: target (spec "One missing operation"); teaching encounter (T1–T4, tray under learner control); contrast (take-black versus take-red, slogan in two-below); supported practice (hint, different example, return to exact tray); new application (remove-charge in a money setting); purposeful revisit (later Gap Line and Linear links, not built here); data boundary (spec "Saved work": integers and booleans only, no free text).
- **Spec 120:** the baker (he/him) is existing supporting cast. The intro line is act-agnostic: no Vadoalto, Hollis, page or chapter reference, so it cannot spoil Act III or IV. No chapter, unlock or saved story state changes. Act IV's ledger and dry-spell work can reuse this bench later through a separately designed adapter.

## Overlap with built and proposed work

| Item | Relation |
| --- | --- |
| [189 Below Zero](../specs/189-below-zero.md) (proposal, unbuilt) | Source of the Rod Tray idea, T8–T11 wording and set D's account items. 344 reuses 189's numbers for cases 1, 3, 4 and 6 (its guided item, D2, D4 and D5), adds cases 2 and 5 as the slogan and same-numerals contrasts, and writes new helpers and copy. It does not commission 189's other benches. |
| [289 Gap Line](../specs/289-gap-line.md) (built) | Prerequisite foothold for intervals across zero. Its saved owner, text and route are untouched. |
| [312 signed linear returns](../specs/312-signed-linear-returns.md) (built) | States "subtracting a negative adds its opposite" in generated equations; 344 supplies the concrete model that statement lacks. No data shared. |
| [proposal build queue](../proposal-build-queue.md) | Lists 189's smallest candidate as the cross-zero interval (now built as 289); 344 is the next 189 operation. |

## History

Liu Hui's red and black counting rods (commentary of 263 on *The Nine Chapters*) inspired the tray in proposal 189. 189's audit rests on search excerpts only. **This slice ships no history card**; a Keeper's note about the rods needs a second-pass source read before it is added.

## Numbers check

`check344.py` in the session scratch area, run with `python3 -I`, simulated every case and helper on the tray: results −3, −8, +4, +4, −2, +4 and helpers −1, +6, −4; zero pairs needed 0, 0, 0, 3, 2, 4 (helpers 0, 4, 4); no color above 12; all values within −12..12; zero-pair invariance over all 169 tray states. Style check on the companion (temporary script, not in the repo): no em-dashes, prompts at most 15 words, hints and feedback at most 20, explanations at most 25, teach cards at most 30, no UK spellings. Every targeted feedback value lies within the answer stepper's −12..12. Codex's independent specification review of 907cfcb reran the arithmetic and tray invariance; its repairs are recorded on the PR.
