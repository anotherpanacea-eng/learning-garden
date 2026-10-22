# Willow Path: a ten-square walk to the bridge

Status: **proposal after bounded independent Codex specification review** (2026-10-22; [receipt](../../reviews/proposed-specs-2026-10-22.md)). Unnumbered: the builder assigns a spec number. Not built or build-ready; primary-source, content and separate Claude follow-up reviews remain pending. Source: game 4.1 and two-seat play (3.3) in [the proposal](../../other-routes-through-the-acts.md).

## Purpose and story

The footpath from the Number Garden gate to Willow Bridge has ten stepping stones, each with its number painted on it. Two walkers take turns spinning and stepping along it until both reach the bridge. This is a **linear number track played by counting on**, at a new route **#numbers/path** inside the existing Number Garden. It is not a quiz, a race, a fact drill or a new world. It is the first designed two-seat activity: a child and an adult share one device, or one child walks both tokens.

**Evidence boundary.** Siegler & Ramani (2008, 2009) found that young children who played a linear number board game improved their numerical magnitude estimation, and that a circular board helped less. In their design:
- ten squares sat in one horizontal row, numbered 1–10 left to right;
- a spinner showed 1 or 2;
- children said the numbers on the squares as they moved ("four, five" when moving two from three).

This first slice copies those features. The source audit must confirm each detail against the papers before build, especially the spinner values, the start position and how the numbers were said. That evidence covers the studied design only. This spec makes **no efficacy claim** for this app, and any later variant is an unvalidated adaptation.

## Complete finite first pack

One board, version 1, defined in content as a frozen source: `{version:1, id:'willow-ten', squares:10, spinner:[1,2], startLabel, finishLabel, events}`.

- **Track.** One horizontal row of ten equal-width squares, numbered 1–10 left to right in large numerals on every square. A token starts on an unnumbered gate space (position 0) to the left of square 1. Square 10 is Willow Bridge. On phones the row stays one row and scales down; it never wraps, curves or stacks. Numerals stay legible at 320 px wide, and the track scrolls with the page, not horizontally.
- **Spinner.** Two equal halves labelled **1** and **2** (as studied; the source audit must confirm). A spin picks uniformly between them. The result shows as a numeral, a word and a matching number of dots, never by colour alone.
- **Tokens.** Two original tokens, **Leaf** and **Lantern**, with distinct shapes and labels. The player picks who is who; nothing about the child is asked.
- **Arrival.** A token that reaches square 10 has arrived. Its turn ends at once and any unused steps are discarded, so a token on 9 that spins 2 arrives after one tap. The screen says "Leaf is at Willow Bridge" and passes the turn. Both tokens always reach the bridge.
- **End.** When both tokens stand on 10, an authored line ends the walk: "Both walkers are at Willow Bridge." No winner is named, no first-arrival order is shown and nothing is counted.
- **Squares 3, 6 and 8: town events.** Each has one short optional event, all original:
  - a robin on the fence post;
  - Pip waving from the café window;
  - the smell of bread.

  An event is a sentence behind a native "What's here?" fold, plus an optional narration button. **No event moves a token backward or forward, skips a turn or changes the spinner.** There are no chutes, ladders, penalties or bonuses.

## Actions and contrasts

A **turn** is one spin, then stepping the active token one square per tap:

1. **Spin.** A native button shows the result.
2. **Step.** A native button labelled "Step to 4" names the next square number and advances one square per tap until the spun amount is used. The track highlights the current square and its numeral. The number is spoken only if narration is on.
3. **Turn passes.** It passes automatically when the steps are used or the token arrives at 10, whichever comes first, with a visible line ("Lantern's turn"). Reset `spin` to null as the turn passes. Turns alternate only among tokens that haven't arrived. Once one token is at the bridge, every remaining turn goes to the other until it arrives too. Its line says so ("Leaf is at Willow Bridge. Lantern keeps walking."). Solo mode follows the same rule; the one player moves whichever token is still walking.

The token never jumps; it always travels one numbered square at a time. This is the counting-on action from the studied design, so the step button must show the number of the square it moves *to*, not a running count of steps taken. That keeps the child saying "four, five" rather than "one, two".

**Saying the numbers.** The adult is invited to say each number aloud with the child, and a one-line tip above the track says so. Optional local narration speaks each square's number as the token lands, and it is off by default so it doesn't replace the adult. There is no microphone or speech recognition, and nothing checks whether anything was said.

The contrast is spatial and built in: larger numbers lie farther right, and equal steps cover equal distances. No quiz states it. A help fold explains in adult-facing words why the board is a straight line with equal squares, and what the children might notice ("seven is farther along than three").

**What is recorded about the child's counting: nothing.** This slice offers no "where will you land?" or "how many steps?" choice. The studied mechanism is playing on the linear track while saying the numbers, not answering questions. A correctness check would change that design and invite scoring. An optional landing-prediction choice is a later slice that needs its own review (see below).

## Manageable turns, support and history

- **Layout.** One page: the track at the top, then the spinner, the step button and a turn line beside each other on wide screens and stacked on phones. Help, the adult tip, the events and "Start a new walk" live in native folds below.
- **Controls.** 44 px targets, native keyboard access, focus kept on the step button during a turn, reduced-motion support (the token moves without animation), and no dragging or hover.
- **Modes.**
  - **Two walkers** alternates Leaf and Lantern while both are walking.
  - **One walker, two tokens** lets a child play alone.

  The mode can change between walks, never mid-walk.
- **Starting and resuming.** Only the explicit "Start a walk" creates a walk. Opening the page or reading help allocates nothing. Leaving and returning resumes the walk in progress exactly as it was.
- **Support.** Help, narration and the adult tip are always open. Using them is not recorded as anything about the child. Each new walk is a fresh, familiar game, not a new level.

## Small optional saved state and boundaries

Use the optional root `willowPath:{version:1, walk}`, where `walk` is null or:

`{id, source, mode:'two'|'solo', positions:{leaf, lantern}, turn:'leaf'|'lantern', spin:null|{value, stepsLeft}, done:boolean}`.

- **The board travels with the walk.** `source` is the walk's frozen board. Validation checks the walk against **its own** source:
  - positions are integers from 0 to `source.squares`;
  - `spin.value` is one of `source.spinner`;
  - `stepsLeft` is between 0 and `spin.value`, and is 0 or `spin` is null whenever the token whose turn it is stands on `source.squares`;
  - `turn` never names an arrived token while the other is still walking;
  - `done` is true exactly when both positions equal `source.squares`.

  It is never checked against today's board, square count or event list. A later 20-square board leaves a saved 10-square walk readable.
- **Event text is not saved.** It's read from the frozen source, and event codes map to text in the UI.
- **No history.** There is no list of past walks, no count of walks and no first-arrival record. Spec 49 rules out participation counters, and none is needed.
- **Recovery.** An unreadable `walk` stays exact as raw data in grown-up notes beside an offer to start a fresh walk; nothing else in the Number Garden is touched.
- **Isolation.** No Café stock, fact exposure, suggestions, explorer evidence, upload, timer, reward or lock. Existing generic transfer, explorer and save-off behaviour applies unchanged. Grown-up notes show one line ("a walk is in progress" or "no walk in progress"), and the walk's positions only if one is in progress.

## Candidate references

Partial references only, to be confirmed by the source audit against full descriptions and evidence before anything is mapped. The track covers 1–10 only, so none of these is claimed in full:

| Topic | ID | Fit |
| --- | --- | --- |
| One More Each Time | `mt_sYpKWbq5ra` | each step is one more |
| Representing numbers with objects | `mt_pAcaehday5` | includes the number line |
| Two written numerals between 1 and 10 | `mt__YRJ23GuIK` | comparison by position only, with no comparison response |
| Rote counting to 100 | `mt_M5PPDJStGm` | forward counting from a given number, 1–10 only |
| Taking Turns and Sharing | `mt_FwI7q7DSIx` | two-walker mode; turn-taking is enacted, not observed |

Magnitude estimation itself, the outcome measured in the studies, is not observed by this activity and must not be claimed.

## Later slices, not specified here

Each needs its own spec and review, and each is an **unvalidated adaptation** of the studied design:
- an optional landing-prediction choice, with varied option positions and no score;
- a 1–20 or 1–100 track (still linear; never a wrapped board presented as equivalent);
- a fraction trail from 0 to 3 in eighths;
- a river track crossing zero for signed quantities.

## Acceptance and gates

**Before build:** independent specification and content review checks these against the source papers:
- the track and spinner;
- the counting-on step label;
- the no-recording decision;
- the town events;
- the saved-state shape.

Then a source audit for the candidate references, an independent implementation review, root browser verification and a draft PR, with no merge or deployment.

**Tests:**
- Every spin value from every position, with arrival capped at 10.
- A token on 9 that spins 2: one tap arrives, the turn ends, the unused step is discarded, the arrival line shows and the turn passes.
- Step-by-step movement, with no jump path.
- The step label names the destination square.
- Turn alternation in two-walker mode, and both tokens moving in solo mode.
- After one token arrives, every later turn goes to the other in both modes; the arrived token is never offered a spin.
- The end line appears only when both tokens are on 10, with no winner text anywhere.
- Events never change positions or turns.
- Resume after reload and transfer, including reload right after an arrival with steps discarded, and reload while one token is finished and the other is mid-turn.
- Walk validation against its own source, including a synthetic walk on a frozen 20-square source.
- Raw recovery of malformed walks.
- No allocation on render.
- Unrelated state preserved.

**Browser checks:**
- one-row layout at phone, tablet and desktop widths with no horizontal overflow;
- legible numerals;
- 44 px targets;
- keyboard-only play;
- reduced motion;
- narration off by default.

Synthetic fixtures only. Passing these checks establishes that the board works as specified, not that any child learned anything.
