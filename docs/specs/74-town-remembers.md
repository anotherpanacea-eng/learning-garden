# The Town Remembers: an earlier idea, returned in a new form

Status: numbered implementation candidate, 2026-10-22. The architecture was independently reviewed in [PR62](https://github.com/anotherpanacea-eng/learning-garden/pull/62). Claude independently approved the final content and source appendix at `244cbb4` after the three P2 findings were resolved; see [the review receipt](../reviews/74-town-remembers-spec-review.md). Implementation independently cleared at `11ee575`; [implementation and browser receipt](../reviews/74-town-remembers-implementation-review.md). Integration remains pending. No merge or deployment is claimed. Strategy 3.1 of [the proposal](../other-routes-through-the-acts.md).

## Purpose and story

Neighbors remember what the learner made for them. A day or more after a tray, a share or a jug reading was kept, one neighbor comes back with a small errand about *that same artifact*, asked a different way: a different unknown, a different representation or a tempting wrong move to judge. The errand is optional, untimed and unscored. Whatever the learner answers, or if they skip it, nothing changes except what the neighbor says next.

This is retrieval after a gap, mixed across games, which the proposal grounds in retrieval practice (Roediger & Karpicke, 2006), distributed practice (Cepeda et al., 2006) and interleaved mathematics practice (Rohrer & Taylor, 2007). Those studies motivate the design; this slice makes no efficacy claim for the app.

Reuse, don't replace. [Spec 31](31-learning-between-games.md) already carries a finished idea into another game, as a one-off, explicitly chosen task with frozen provenance. [Spec 30](30-adaptive-living-garden.md) already offers optional suggestions without levels. This slice adds two things only: a **gap** (the errand waits until a later local day) and a **change of form** (the same artifact, asked differently). It adds no scheduler, due queue, overdue state, learner model, level, streak, count shown to the child, lock, timer or reward.

## Sources on main and the gap rule

Three games already on main supply artifacts. Each keeps an explicit, learner-chosen record:

- **Gathering trays** ([spec 50](50-whole-batch-gathering.md), `whole-batches`): a kept tray snapshot with its frozen source and the learner's actual jar portions (`input.model.portions`).
- **Sharing Counter** ([spec 43](43-sharing-counter.md)): a kept loaf snapshot with its frozen whole and the learner's actual cuts and selected pieces (`model`).
- **Measuring Kitchen** ([spec 45](45-measuring-recipes.md)): a kept tray snapshot with the learner's actual cloud-water and star-water portions in mL.

Each game keeps **one** snapshot per case, and a later keep replaces it. Keeping unfinished work is allowed: a kept tray can hold empty jars, and a kept loaf can be split unevenly. The errands therefore never assume a kept snapshot is complete or correct.

Each of the three games adds one **optional** field to *newly* kept records: `keptDay`, the learner's local calendar day (`YYYY-MM-DD`, the same local-day form `facts-core` already uses). Existing kept records without it stay exactly as they are and count as "kept on an earlier, unknown day". Each source's validator accepts the field when present and well formed, and its absence. Nothing else in the source games changes.

**Gap rule:** an artifact is eligible once today's local day is later than its `keptDay`, or when `keptDay` is absent. There is no expiry and no "overdue". Changing the device clock can make an errand appear early or late; that is harmless.

**Form eligibility comes only from the snapshot's own frozen values,** never from the case's targets or today's catalogue. A snapshot that fits no form is simply skipped: nothing is written to it, it isn't marked used, and the learner sees no message about it.
- **Tray forms** require the snapshot's frozen source to say `modelId: 'whole-batches-v1'`, `revision: 1`, `unit: 'mL'`, `baseGuests: 2`, `base['cloud-water']: 100` and `base['star-water']: 150`. That model revision pins the 500 mL jar capacity; a capacity change must also change the source case revision. The hardcoded version-1 questions and feedback apply only to that model and base. The frozen portions must then be exactly *c*×100 mL cloud-water and *c*×150 mL star-water, with *c* from 1 to 3. *c* comes from the portions, not the case's planned copies. A different frozen base or unit, empty, partial or mismatched jars are skipped.
- **Share forms** need frozen cuts that divide the snapshot's frozen whole into *n* pieces of equal width, with *n* in {2, 3, 4, 6}. `share-buns` also needs exactly one selected piece. Unequal cuts, or a different number of selected pieces, are skipped.
- **Jug forms** require the frozen kitchen source's apparatus to say `unit: 'mL'`, `jarCapacity: 500`, `jugCapacity: 500` and `transfer: 50`. They use one frozen portion *a* (cloud-water first, then star-water) that is a multiple of 50 with 50 ≤ *a* ≤ 450. Empty (0 mL) and full (500 mL) readings are skipped, so every scale distractor below stays in range.

**Artefact identity** needs no record id, which none of the three schemas has. Use the kind, case id and a fixed-order tuple of saved primitive values: tray `[cloud-water portion, star-water portion]`; loaf `[whole id, whole width, cuts in order, selected piece indices in order]`; kitchen `[cloud-water portion, star-water portion]`. Keep tuple boundaries and lengths distinct when comparing keys. No generic JSON canonicalizer or new persisted fingerprint is needed.
- Replacing a case's snapshot with **different** values creates a new artifact.
- Re-keeping **identical** values, the same day or later, is the same artifact.
- Legacy snapshots without `keptDay` get keys the same way.

So `keptDay` stays the only change to the source schemas. A replaced snapshot stops being offered; an errand already started from it keeps its own frozen copy.

## Complete finite first pack

Six errand forms, two per source. Every number comes from the kept artifact, so the neighbor's question is about *the learner's own* earlier work, but each form changes the question or response action. The shortcut revisits a contrast already available in Gathering Trays; judging a supplied proposal is distinct from adjusting those jars, and the same numbers remain familiar practice.

| Form id | Source | Neighbor and change of form | What the learner does |
| --- | --- | --- | --- |
| `trays-reverse` | kept tray whose frozen jars hold exactly *c* complete batches (1–3) | Purl holds the two jars from that tray, showing *c*×100 mL and *c*×150 mL: "How many guests can these jars serve?" The unknown moves from the jars to the guests. | Choose a guest count from three supplied options: 2*c*, *c* and 2*c*+1. |
| `trays-shortcut` | as above, with *c* = 1 or 2 | Wisp goes from *c* to *c*+1 copies by adding 100 mL to *both* jars: "Is that one more whole batch?" | Judge the move. One choice explains the additive error (a batch adds 100 mL *and* 150 mL), one accepts the shortcut, and one rejects it for a wrong reason ("the jars would overflow"; at most 300 and 400 mL, both under 500, so the evidence rules it out). |
| `share-compare` | kept loaf cut into *n* equal pieces (2, 3, 4 or 6) | Clover cuts **the same loaf** into *m* shares, the next count *m* in the cyclic list [2, 3, 4, 6] after *n* (so 6 wraps to 2): "Is one of my shares bigger or smaller than one of yours?" | Choose bigger, smaller or "can't tell". "Can't tell" is wrong for an evidence-specific reason: the loaf is stated to be the same whole. |
| `share-buns` | kept loaf cut into *n* equal pieces with exactly one selected (every eligible *n* divides 12) | Ember packs the same fraction of the 12-bun basket: "How many buns is that?" The representation changes from a length to a set. | Choose 12/*n* from three supplied counts. The distractors are *n* (share count taken as bun count) and 1 (one share taken as one bun), which are distinct from 12/*n* for every *n* in {2, 3, 4, 6}. |
| `jug-coarser` | kept portion *a*, 50 ≤ *a* ≤ 450 | Wisp's spare jug is marked every 100 mL with unnumbered midpoints, holding the same *a* mL. "Read my jug." | Choose the amount. Distractors are the nearest 100 mL mark strictly below *a* and the nearest strictly above it. Both are always within 0–500 mL and distinct from *a*. |
| `jug-more` | kept portion *a*, 50 ≤ *a* ≤ 450 | Purl needs a round amount *t*, the next multiple of 100 above *a*: "How much more do I pour to reach *t*?" This is counting on, not reading. | Choose *t*−*a* from three supplied amounts. Distractors are *t* (the target taken as the pour) and *t*−*a*+50 (counting one interval too many; when that equals *t*, which happens only at *a* = 50, use *t*−*a*+100). All three are then distinct for every *a*. |

At **Start**, freeze the chosen *m* and both share counts in the errand; resuming never chooses *m* again.

A form is offered only when the snapshot meets its eligibility rule above (for example `trays-shortcut` needs *c* ≤ 2, and `share-buns` needs one selected equal piece). Following [AGENTS.md](../../AGENTS.md):
- authored base orders below receive a left rotation across cases, then freeze at Start: use zero-based c-index in [1,2,3] for trays, n-index in [2,3,4,6] for shares, and a-index in [50,100,150,200,250,300,350,400,450] for jugs, modulo 3. Left rotation means [A,B,C]→[B,C,A]→[C,A,B]. Neither selection nor answer correctness chooses the rotation; each saved errand keeps its order;
- no wrong choice is merely cautious; each fails for a reason the supplied evidence shows.

All wording is original; these neighbors already appear in the café, sharing or kitchen activities.

## Choosing the next errand (interleaving without a queue)

At most **one** errand card is offered at a time, among the existing [learning invitations](31-learning-between-games.md) on the home invitation surface. It reads like the other invitations ("Purl remembers your tray from the rehearsal table…"); it never says "review", "due" or "practice again".

Selection is a pure function of current saved state and today's date:
1. Take sources in a fixed rotation (trays, shares, jugs). Start after the source kind of the most recently *started* errand, and skip kinds with no eligible, unused artifact.
2. Within the chosen kind, take the **oldest** eligible artifact not yet used by an errand. Legacy undated records count as oldest; if dates tie or are both absent, use the saved case id in ascending order so selection is stable.
3. Each kind alternates its two forms: use the form the previous errand of that kind did not use, if this artifact meets its condition; otherwise the other form. If neither applies (for example `trays-shortcut` for *c* = 3 is not offered), use the one that does. An artifact seeds one errand and is not offered again after its errand starts.

Rendering computes the card; it allocates and records nothing. Only an explicit **Start** creates an errand. A started, unfinished errand is the card until it is kept or set aside. Setting it aside is allowed and leaves the artifact used; the next card moves on.

## Actions, contrasts and feedback

An errand page shows:
- the remembered artifact, as a small frozen picture with the original case title and "kept on an earlier day";
- the neighbor's question in the changed form;
- the supplied choices;
- optional help;
- **Check**, **Keep this answer** and **Set aside**.

**Check** records the choice with feedback that explains the relation using the artifact's own numbers, then invites a revision. Examples:
- "Each whole batch is 100 mL cloud-water *and* 150 mL star-water. Adding 100 mL to both would leave star-water 50 mL short of another batch."
- "Same loaf, more shares: each share is smaller."

A wrong choice gets the explanation, not a penalty. A skipped errand gets a friendly neighbor line ("Another time, then"). Nothing in any source game, café stock, parcels, suggestions or depth changes. The visible equal-group explanations below do affect *prior fact exposure*, never Town correctness or independent evidence.

Help offers one worked example built on a *different* artifact value than the learner's, plus optional local narration. Support is recorded only when actually used. "We worked it out together" is a separate support record. Familiarity is recorded when the same form was already seen on an earlier errand; it is not independent success.

**Visible fact exposure:** The existing `exposeStoryFacts` bridge records a complete multiplication relation when Town actually shows it. For `share-buns`, Check feedback states that 12 buns form frozen `n` equal groups of `12/n`: expose `[n, 12/n]` when that frozen checked feedback is visible. The separate worked Help states frozen `example.n` equal groups of `12/example.n`: expose `[example.n, 12/example.n]` only when Help is visibly open. For `trays-reverse`, Check feedback states frozen `c` whole batches of 2 guests giving `2c`: expose `[c, 2]` when that checked feedback is visible. Its separate worked Help states frozen `h` batches of 2 guests giving `2h`: expose `[h, 2]` only when Help is visibly open. A one-batch relation may be recorded, but never promoted to success. Use the frozen errand values and the explanation actually shown; do not re-read the current source game, infer a relation from choices or co-occurring numbers, or require frozen wording to match today's catalog. An earlier frozen text that does not clearly state the complete relation does not justify an exact fact exposure.

This exposure is idempotent across re-render and reload. A checked open errand, or a readable finished errand opened at its detail route, restores the checked-feedback exposure when that feedback is shown. Help is exposed on its actual reveal and on reload only if the Help remains visible there; a support flag in closed or hidden history is insufficient. A chooser card, collapsed grown-up notes, another errand's hidden history, an unreadable/raw errand and a set-aside errand without displayed Check feedback expose nothing. The existing bridge updates broad, story and baseline prior-exposure qualifiers for open drafts and future tasks; it does not change the Town answer, source artifacts or recorded earlier outcomes. No new global exposure schema or evidence category is needed.

## Small optional saved state and boundaries

Optional root `townRemembers: {version: 1, rotation, used, errands}`:
- `rotation` is the source kind of the most recently started errand, or null.
- `used` holds artifact keys (kind, case id and fixed-order value tuple, as defined above). It is bounded to the 48 most recent; trimming it can only let an old artifact return, which is harmless.
- `errands` holds at most 12 readable errands. Before Start would create a thirteenth, the card discloses that the oldest kept or set-aside errand will be removed (lowest saved errand id). Only that explicit Start trims it. Never trim on render or remove an open errand; finish or set aside the current open errand before another can start. Each errand carries:
  - a positive safe id;
  - its form id;
  - a **frozen copy** of every artifact value and label it uses, so the errand never re-reads the source game;
  - its frozen choices and their order;
  - the current choice or null;
  - status: open, kept or set aside;
  - support codes and a familiarity boolean;
  - at most 8 checks, each with choice, fit and frozen feedback text.

Validation follows AGENTS.md:
- Each errand is checked against itself: ids, counts, choice membership within its own frozen choices, and fit flags matching its own frozen expected value.
- Nothing is checked against today's case catalogues, today's wording or today's lists of sources and forms. A form id this version does not know makes that one errand unavailable and leaves the rest readable. An unavailable open errand can still be set aside without interpreting its answer, so it never blocks another Start.
- An unreadable errand is kept as a raw sibling, escaped in notes and export.

There is no new identity, network, upload or analytics. Existing explorer switching, export, reset and save-off apply. Grown-up notes list each errand's source, gap ("kept on 2026-10-20; returned on 2026-10-22", or "earlier, date unknown"), form, choices, support and checks. They state plainly that this records exploration after a gap, not mastery.

Candidate Marble references, partial, to be confirmed by source audit:
- `mt_IfEgu0X449` Comparing fractions (unit fractions), for `share-compare`;
- `mt_k2WE0-22-4` Unit fractions of a discrete set, for `share-buns`;
- `mt_PZ909yPrEC` Multiplication as repeated addition / grouping equal sets, for the tray forms;
- `mt_4lp_b5Pzik` Capacity and volume, for the jug forms.

No runtime graph change.

## Acceptance and gates

The architectural specification has independent review; final content review must check all six forms across every artifact value they can receive:
- *c* from 1 to 3;
- *n* in {2, 3, 4, 6} with its next distinct cyclic *m*;
- every kitchen amount the source can keep, plus changed apparatus values and non-50-mL values that must remain ineligible.

Check that each form's fitting answer, distractors and feedback are correct and that no distractor is cautious without an evidence-specific reason. Resolve findings before build; then independent implementation review, root browser verification and a draft PR. No merge or deployment.

Tests:
- **Gap rule:** same day versus a later local day, absent `keptDay`, and a malformed `keptDay` (that record is ineligible; the source game's own validator decides whether the record itself loads).
- **Eligibility:** skip a tray with any changed frozen base constant, empty, partial and mismatched trays, unequal or wrongly selected loaves, and 0 or 500 mL portions, without writing to them. Check jug distractors numerically for every eligible *a*.
- **Choice rotation:** exercise every eligible c, n and a; verify fitting positions vary, choice order does not depend on the answer selected, and the frozen order survives reload.
- **Identity:** a replaced snapshot with new values becomes a new artifact; a re-keep of identical values does not. Legacy snapshots get keys too. Check fixed tuple boundaries so distinct values cannot collide.
- **Selection:** rotation and skipping, oldest-first with saved case-id tie-break, one card at a time, used-once, `used` trimming, and purity (no state change on render).
- **Exact-once:** Start, Set aside and Keep. At the cap, disclose and remove only the oldest finished errand on Start; preserve an open errand and never trim on view.
- **Share comparison:** all four *n* values choose the next distinct cyclic *m*, both counts freeze on Start and remain unchanged after reload.
- **Frozen values:** frozen artifact values survive changes to source-game content and to the source record itself (deleted or replaced kept work).
- **Recovery:** unknown form ids and raw siblings, plus per-errand recovery.
- **Source games:** each game's kept records still load with and without `keptDay`, and their own outcomes, stock and suggestions are untouched.
- **Visible exposure:** for each `share-buns` n in {2,3,4,6} and each `trays-reverse` c in {1,2,3}, assert no Town fact on the chooser or before Check; exact current fact after visible Check; exact separate fact only after visible Help; restoration on open/detail reload; no fact from hidden history or raw errands. Exercise a synthetic future broad 3×4 after a checked three-share bun errand: it is known, not fresh. A matching already-open broad or story draft becomes known; no earlier observation is rewritten. Repeat a previously exposed route to verify idempotence and preserve source-game state.
- **Notes and devices:** notes text, explorer reload, switch, export and save-off, phone and tablet fit, 44px targets, keyboard and native controls.

Synthetic fixtures only. Passing tests establish neither retrieval benefit nor mastery.


## Final authored content and interaction appendix

This appendix supplies the exact finite templates for independent content review. Values in braces come only from the eligible kept snapshot. Each picture has the same information as nearby text; color alone carries no quantity or selection. These are pretend exact picture amounts, not food safety, real pouring or measuring claims.

**Shared turn.** Heading: “A neighbor remembers.” Under the frozen case title: “An idea you kept on an earlier day.” A visibly separate second panel carries the changed question. No answer is selected at start. Choice selection alone records no check. “Check this idea” requires a selected choice and appends one frozen feedback check; choices stay editable afterwards. “Keep this answer” requires a selected choice but does not require a check or claim correctness; it freezes the final selection and closes the errand. “Set aside” is always available, including for an unreadable open errand. Keep and Set aside are terminal and idempotent; a finished errand remains readable. Help button: “Try a different example.” Together button: “We worked it out together.” Narration records a request, not verified listening. Help never changes the remembered artifact or its source game.

### 1. trays-reverse — Purl's table

Picture: two separately labeled jars, `{100c} mL cloud-water` and `{150c} mL star-water`, and a reference card `2 guests: 100 mL cloud-water and 150 mL star-water`. The source title identifies the saved tray; the picture describes actual kept portions, not whether the old request was met.

Question: “Purl has these two jars. Each whole batch serves 2 guests. How many guests can these jars serve?”

Base choices before the specified rotation: `{c} guests`, `{2c} guests` (fitting), `{2c+1} guests`.

Feedback: “These jars hold {c} whole batch(es). Each batch serves 2 guests, so they can serve {2c} guests. {c} counts batches, not guests; {2c+1} would need more ingredients.” Use singular batch and guest when their displayed count is 1. Help uses c=2 when the kept c=1, otherwise c=1: “In this separate example, {h} batch(es) use {100h} mL and {150h} mL. Two guests per batch means {2h} guests.” Show two small separate labeled jars and equal guest groups; never animate the waiting jars changing.

### 2. trays-shortcut — Wisp's extra batch

Remembered picture: the two saved jars. Changed proposal: separate outlined jars labeled `{100c+100} mL cloud-water` and `{150c+100} mL star-water`, plus `Jar capacity: 500 mL each`. Reference card: `One batch: 100 mL cloud-water and 150 mL star-water`.

Question: “Wisp adds 100 mL to each jar. Is that one more whole batch?”

Base choices before the specified rotation: “Yes. Adding the same amount to both makes one more batch.” / “No. The jars would overflow.” / “No. One more batch needs 100 mL cloud-water and 150 mL star-water.” (fitting)

Feedback: “One more batch adds 100 mL cloud-water and 150 mL star-water. Wisp's star-water is 50 mL short. The proposed jars hold {100c+100} mL and {150c+100} mL, both below their 500 mL capacity.” Help uses the other c in {1,2}, with the same separate before/addition/result picture and the worked conclusion. Label it “A different tray.” No correctness inference transfers to the waiting case.

### 3. share-compare — Clover's same loaf

Show the actual saved whole and its n equal pieces, alongside another outline of the **same width and same named whole** with m equal pieces. Mark one piece in each; distinguish that comparison marking from the saved selection. Label “Kept loaf: {n} equal pieces” and “Clover's cuts: {m} equal pieces.”

Question: “Clover cuts the same loaf into {m} equal pieces. Is one of Clover's pieces bigger or smaller than one of yours?”

Base choices: “Smaller”, “Bigger”, “We cannot compare these pieces.” Rotate by the n-index rule above, never by which relation is fitting. Bigger fits if m<n; Smaller fits if m>n.

Feedback: “Both pictures show the same whole loaf. Cutting into {m} equal pieces makes each piece {bigger/smaller} than cutting into {n}. We know the whole is the same, so we can compare.” Help uses n=3 if kept n=2, otherwise n=2, and that n's cyclic next m. Show a separate same-whole pair and the worked relation. Ask no question about different-sized wholes in this slice.

### 4. share-buns — Ember's basket

Show the actual kept loaf with its one selected equal piece and the label “One of {n} equal parts: 1/{n} of this loaf.” Beside it show twelve unselected buns in a clearly counted basket.

Question: “Ember wants the same fraction of this 12-bun basket. How many buns are 1/{n} of 12?”

Base choices before the specified rotation: `{n} buns`, `1 bun`, `{12/n} buns` (fitting).

Feedback: “Split 12 buns into {n} equal groups. Each group has {12/n} buns. One whole group is 1/{n} of the basket. One share does not always mean one bun.” Help uses n=4 if the kept n=2, otherwise n=2, and shows a separate twelve-bun basket with equal groups and one group outlined. Do not silently highlight the waiting answer when opening help.

### 5. jug-coarser — Wisp's spare jug

Before Check, identify the remembered kitchen jar by its saved case title and ingredient, using an opaque unmarked jar icon without an amount label. A separate straight-sided model jug contains the same amount a. The jug marks 0,100,200,300,400,500 mL and has unnumbered midpoint ticks at 50,150,250,350,450; liquid height is proportional. Caption: “The same amount, shown on another scale.” Before Check, its text alternative describes the level by the scale: at a numbered mark, or at the unnumbered mark halfway between the two named numbered marks. Do not separately print the amount a or expose it in the remembered jar label/alternative until Check. After Check, reveal the exact saved amount alongside feedback. The scale remains visible and accessible throughout; no independent recall claim is made.

Question: “Wisp's spare jug holds the same amount. Read its scale. How many milliliters are inside?”

Base choices before the specified rotation: the nearest strictly lower 100 mL mark, `{a} mL` (fitting), the nearest strictly higher 100 mL mark.

Feedback: “Each numbered interval is 100 mL. The unnumbered midpoint is 50 mL past the lower numbered mark. The liquid reaches {a} mL. The marks just below and above are {lower} mL and {upper} mL.” When a is a numbered mark, instead say “The liquid meets the numbered {a} mL line; the neighboring numbered marks are {lower} mL and {upper} mL.” Help uses 350 mL if a=200, otherwise 200 mL, on a separate jug and names the relevant scale position.

### 6. jug-more — Purl's next pour

Show the kept amount a, a separate jug model containing a, a dashed target line t, and label “Start: {a} mL · Target: {t} mL.” Show no transfer animation until optional help; the saved apparatus never changes.

Question: “Purl has {a} mL and needs {t} mL. How much more should Purl pour?”

Base choices before the specified rotation: `{t-a} mL` (fitting), `{t} mL`, `{extra} mL`, with extra defined in the finite-form table above.

Feedback: “Count on from {a} mL to {t} mL: add {t-a} mL. {t} mL is the final amount, not the extra pour. Adding {extra} mL would pass the target.” Help deliberately uses the other extra amount: when the waiting answer is 50 mL, show a separate 200→300 mL example adding 100 mL; when it is 100 mL, show 150→200 mL adding 50 mL. Its separate picture labels the starting liquid, extra pour and final amount; never print the waiting numerical answer as its worked answer.

### Limits, dates and history

Keep the six complete forms; do not replace them with a subset merely because a source game starts with particular defaults. All source-supported eligible amounts and cuts must be exercised. A kept selection can be offered whether or not its former request was met; only the form's stated eligibility matters. Inspect raw kept snapshots without normalizing/mutating source roots as a side effect of invitation rendering.

For new keptDay writes, use the existing local-day convention and an optional field accepted only on kept artifacts. Older nested checks and offered trays remain unchanged; do not accidentally require keptDay on them or propagate it into a schema that rejects it. The new root stores the selected date and complete source/choices/help/feedback needed to resume. Unknown forms are recoverable per errand. The history cap disclosure belongs on the explicit Start card and removes only the oldest closed record; never trim open/raw work during render.

Attribution and source dispositions are in [the source audit](../source-audits/74-town-remembers.md). This appendix makes no learning-effect claim. Browser tests must exercise real links from the home invitation and source-game Keep actions, in addition to synthetic older-kept records.
