# The Town Remembers: an earlier idea, returned in a new form

Status: **proposed draft for independent specification review** (Claude, Code-Mac, 2026-10-22). Unnumbered: the builder assigns a spec number. Not built, not reviewed. Strategy 3.1 of [the proposal](../../other-routes-through-the-acts.md).

## Purpose and story

Neighbours remember what the learner made for them. A day or more after a tray, a share or a jug reading was kept, one neighbour comes back with a small errand about *that same artefact*, asked a different way: a different unknown, a different representation or a tempting wrong move to judge. The errand is optional, untimed and unscored. Whatever the learner answers, or if they skip it, nothing changes except what the neighbour says next.

This is retrieval after a gap, mixed across games, which the proposal grounds in retrieval practice (Roediger & Karpicke, 2006), distributed practice (Cepeda et al., 2006) and interleaved mathematics practice (Rohrer & Taylor, 2007). Those studies motivate the design; this slice makes no efficacy claim for the app.

Reuse, don't replace. [Spec 31](../31-learning-between-games.md) already carries a finished idea into another game, as a one-off, explicitly chosen task with frozen provenance. [Spec 30](../30-adaptive-living-garden.md) already offers optional suggestions without levels. This slice adds two things only: a **gap** (the errand waits until a later local day) and a **change of form** (the same artefact, asked differently). It adds no scheduler, due queue, overdue state, learner model, level, streak, count shown to the child, lock, timer or reward.

## Sources on main and the gap rule

Three games already on main supply artefacts. Each keeps an explicit, learner-chosen record:

- **Gathering trays** ([spec 50](../50-whole-batch-gathering.md), `whole-batches`): a kept tray snapshot with its frozen source and the learner's actual jar portions (`input.model.portions`).
- **Sharing Counter** ([spec 43](../43-sharing-counter.md)): a kept loaf snapshot with its frozen whole and the learner's actual cuts and selected pieces (`model`).
- **Measuring Kitchen** ([spec 45](../45-measuring-recipes.md)): a kept tray snapshot with the learner's actual cloud-water and star-water portions in mL.

Each game keeps **one** snapshot per case, and a later keep replaces it. Keeping unfinished work is allowed: a kept tray can hold empty jars, and a kept loaf can be split unevenly. The errands therefore never assume a kept snapshot is complete or correct.

Each of the three games adds one **optional** field to *newly* kept records: `keptDay`, the learner's local calendar day (`YYYY-MM-DD`, the same local-day form `facts-core` already uses). Existing kept records without it stay exactly as they are and count as "kept on an earlier, unknown day". Each source's validator accepts the field when present and well formed, and its absence. Nothing else in the source games changes.

**Gap rule:** an artefact is eligible once today's local day is later than its `keptDay`, or when `keptDay` is absent. There is no expiry and no "overdue". Changing the device clock can make an errand appear early or late; that is harmless.

**Form eligibility comes only from the snapshot's own frozen values,** never from the case's targets or today's catalogue. A snapshot that fits no form is simply skipped: nothing is written to it, it isn't marked used, and the learner sees no message about it.
- **Tray forms** need frozen portions that are exactly *c* complete batches of the snapshot's own frozen base (*c*×100 mL cloud-water and *c*×150 mL star-water for the version-1 base), with *c* from 1 to 3. *c* comes from the portions, not from the case's planned copies. Empty, partial or mismatched jars are skipped.
- **Share forms** need frozen cuts that divide the snapshot's frozen whole into *n* pieces of equal width, with *n* in {2, 3, 4, 6}. `share-buns` also needs exactly one selected piece. Unequal cuts, or a different number of selected pieces, are skipped.
- **Jug forms** use one frozen portion *a* (cloud-water first, then star-water) with 50 ≤ *a* ≤ 450. Empty (0 mL) and full (500 mL) readings are skipped, so every scale distractor below stays in range.

**Artefact identity** needs no record id, which none of the three schemas has. An artefact's key is its kind, its case id and a fingerprint of the frozen values the forms read (tray portions; loaf whole, cuts and selection; kitchen portions), as canonical JSON with sorted keys.
- Replacing a case's snapshot with **different** values creates a new artefact.
- Re-keeping **identical** values, the same day or later, is the same artefact.
- Legacy snapshots without `keptDay` get keys the same way.

So `keptDay` stays the only change to the source schemas. A replaced snapshot stops being offered; an errand already started from it keeps its own frozen copy.

## Complete finite first pack

Six errand forms, two per source. Every number comes from the kept artefact, so the neighbour's question is about *the learner's own* earlier work, but each form asks for something the original task did not.

| Form id | Source | Neighbour and change of form | What the learner does |
| --- | --- | --- | --- |
| `trays-reverse` | kept tray whose frozen jars hold exactly *c* complete batches (1–3) | Purl holds the two jars from that tray, showing *c*×100 mL and *c*×150 mL: "How many guests can these jars serve?" The unknown moves from the jars to the guests. | Choose a guest count from three supplied options: 2*c*, *c* and 2*c*+1. |
| `trays-shortcut` | as above, with *c* = 1 or 2 | Wisp goes from *c* to *c*+1 copies by adding 100 mL to *both* jars: "Is that one more whole batch?" | Judge the move. One choice explains the additive error (a batch adds 100 mL *and* 150 mL), one accepts the shortcut, and one rejects it for a wrong reason ("the jars would overflow"; at most 300 and 400 mL, both under 500, so the evidence rules it out). |
| `share-compare` | kept loaf cut into *n* equal pieces (2, 3, 4 or 6) | Clover cuts **the same loaf** into *m* shares, a different count from the pack (*m* ≠ *n*): "Is one of my shares bigger or smaller than one of yours?" | Choose bigger, smaller or "can't tell". "Can't tell" is wrong for an evidence-specific reason: the loaf is stated to be the same whole. |
| `share-buns` | kept loaf cut into *n* equal pieces with exactly one selected (every eligible *n* divides 12) | Ember packs the same fraction of the 12-bun basket: "How many buns is that?" The representation changes from a length to a set. | Choose 12/*n* from three supplied counts. The distractors are *n* (share count taken as bun count) and 1 (one share taken as one bun), which are distinct from 12/*n* for every *n* in {2, 3, 4, 6}. |
| `jug-coarser` | kept portion *a*, 50 ≤ *a* ≤ 450 | Wisp's spare jug is marked every 100 mL with unnumbered midpoints, holding the same *a* mL. "Read my jug." | Choose the amount. Distractors are the nearest 100 mL mark strictly below *a* and the nearest strictly above it. Both are always within 0–500 mL and distinct from *a*. |
| `jug-more` | kept portion *a*, 50 ≤ *a* ≤ 450 | Purl needs a round amount *t*, the next multiple of 100 above *a*: "How much more do I pour to reach *t*?" This is counting on, not reading. | Choose *t*−*a* from three supplied amounts. Distractors are *t* (the target taken as the pour) and *t*−*a*+50 (counting one interval too many; when that equals *t*, which happens only at *a* = 50, use *t*−*a*+100). All three are then distinct for every *a*. |

A form is offered only when the snapshot meets its eligibility rule above (for example `trays-shortcut` needs *c* ≤ 2, and `share-buns` needs one selected equal piece). Following [AGENTS.md](../../../AGENTS.md):
- authored option orders vary the fitting choice's position across forms, and each saved errand keeps its order;
- no wrong choice is merely cautious; each fails for a reason the supplied evidence shows.

All wording is original; every neighbour already exists in these games.

## Choosing the next errand (interleaving without a queue)

At most **one** errand card is offered at a time, among the existing [learning invitations](../31-learning-between-games.md) on the home invitation surface. It reads like the other invitations ("Purl remembers your tray from the rehearsal table…"); it never says "review", "due" or "practice again".

Selection is a pure function of current saved state and today's date:
1. Take sources in a fixed rotation (trays, shares, jugs). Start after the source kind of the most recently *started* errand, and skip kinds with no eligible, unused artefact.
2. Within the chosen kind, take the **oldest** eligible artefact not yet used by an errand. Legacy undated records count as oldest.
3. Each kind alternates its two forms: use the form the previous errand of that kind did not use, if this artefact meets its condition; otherwise the other form. If neither applies (for example `trays-shortcut` for *c* = 3 is not offered), use the one that does. An artefact seeds one errand and is not offered again after its errand starts.

Rendering computes the card; it allocates and records nothing. Only an explicit **Start** creates an errand. A started, unfinished errand is the card until it is kept or set aside. Setting it aside is allowed and leaves the artefact used; the next card moves on.

## Actions, contrasts and feedback

An errand page shows:
- the remembered artefact, as a small frozen picture with the original case title and "kept on an earlier day";
- the neighbour's question in the changed form;
- the supplied choices;
- optional help;
- **Check**, **Keep this answer** and **Set aside**.

**Check** records the choice with feedback that explains the relation using the artefact's own numbers, then invites a revision. Examples:
- "Each whole batch is 100 mL cloud-water *and* 150 mL star-water. Adding 100 mL to both would leave star-water 50 mL short of another batch."
- "Same loaf, more shares: each share is smaller."

A wrong choice gets the explanation, not a penalty. A skipped errand gets a friendly neighbour line ("Another time, then"). Nothing in any source game, café stock, parcels, suggestions, depth or exposure changes.

Help offers one worked example built on a *different* artefact value than the learner's, plus optional local narration. Support is recorded only when actually used. "We worked it out together" is a separate support record. Familiarity is recorded when the same form was already seen on an earlier errand; it is not independent success.

## Small optional saved state and boundaries

Optional root `townRemembers: {version: 1, rotation, used, errands}`:
- `rotation` is the source kind of the most recently started errand, or null.
- `used` holds artefact keys (kind, case id and value fingerprint, as defined above). It is bounded to the 48 most recent; trimming it can only let an old artefact return, which is harmless.
- `errands` holds at most 12 readable errands. Each errand carries:
  - a positive safe id;
  - its form id;
  - a **frozen copy** of every artefact value and label it uses, so the errand never re-reads the source game;
  - its frozen choices and their order;
  - the current choice or null;
  - status: open, kept or set aside;
  - support codes and a familiarity boolean;
  - at most 8 checks, each with choice, fit and frozen feedback text.

Validation follows AGENTS.md:
- Each errand is checked against itself: ids, counts, choice membership within its own frozen choices, and fit flags matching its own frozen expected value.
- Nothing is checked against today's case catalogues, today's wording or today's lists of sources and forms. A form id this version doesn't know makes that one errand unavailable and leaves the rest readable.
- An unreadable errand is kept as a raw sibling, escaped in notes and export.

There is no new identity, network, upload or analytics. Existing explorer switching, export, reset and save-off apply. Grown-up notes list each errand's source, gap ("kept on 2026-10-20; returned on 2026-10-22", or "earlier, date unknown"), form, choices, support and checks. They state plainly that this records exploration after a gap, not mastery.

Candidate Marble references, partial, to be confirmed by source audit:
- `mt_IfEgu0X449` Comparing fractions (unit fractions), for `share-compare`;
- `mt_k2WE0-22-4` Unit fractions of a discrete set, for `share-buns`;
- `mt_PZ909yPrEC` Multiplication as repeated addition / grouping equal sets, for the tray forms;
- `mt_4lp_b5Pzik` Capacity and volume, for the jug forms.

No runtime graph change.

## Acceptance and gates

Independent specification and content review must check all six forms across every artefact value they can receive:
- *c* from 1 to 3;
- *n* in {2, 3, 4, 6} with every *m* ≠ *n*;
- every kitchen amount the source can keep.

Check that each form's fitting answer, distractors and feedback are correct and that no distractor is cautious without an evidence-specific reason. Resolve findings before build; then independent implementation review, root browser verification and a draft PR. No merge or deployment.

Tests:
- **Gap rule:** same day versus a later local day, absent `keptDay`, and a malformed `keptDay` (that record is ineligible; the source game's own validator decides whether the record itself loads).
- **Eligibility:** skip empty, partial and mismatched trays, unequal or wrongly selected loaves, and 0 or 500 mL portions, without writing to them. Check jug distractors numerically for every eligible *a*.
- **Identity:** a replaced snapshot with new values becomes a new artefact; a re-keep of identical values does not. Legacy snapshots get keys too.
- **Selection:** rotation and skipping, oldest-first, one card at a time, used-once, `used` trimming, and purity (no state change on render).
- **Exact-once:** Start, Set aside and Keep.
- **Frozen values:** frozen artefact values survive changes to source-game content and to the source record itself (deleted or replaced kept work).
- **Recovery:** unknown form ids and raw siblings, plus per-errand recovery.
- **Source games:** each game's kept records still load with and without `keptDay`, and their own outcomes, stock and suggestions are untouched.
- **Notes and devices:** notes text, explorer reload, switch, export and save-off, phone and tablet fit, 44px targets, keyboard and native controls.

Synthetic fixtures only. Passing tests establish neither retrieval benefit nor mastery.
