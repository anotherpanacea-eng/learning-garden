# Proposal: where pixel art fits Learning Garden (three linked phases)

Status: proposal, 2026-11-06. **Writing only. Nothing here commissions a build, a publication or a sitewide redesign.** Fleet card LG-39.
- **Owner, 2026-11-05:** roadmap all three surfaces in sequence, one leading to the next rather than stopping after the game; game first.
- **Card requirements:** ownership and transitions are defined; spec 244's style rules, repo-held assets and invented characters are preserved; art is authored as SVG at build time, with no runtime dependency.
- **Relationship to spec 244:** this proposal sits under [spec 244](../244-presentation-styles.md) and changes none of it. Pixel art enters as **game art first, frame art second, a style last**, so every step is small, reversible and reviewed before the next.

## Shared rules (all phases)

- **Art is original SVG held in the repo, with no runtime dependency.** Pixel art is authored as SVG and checked in, as the existing art modules are (for example `dist/companions.mjs`). There is no canvas, no runtime renderer and no external asset. One shared palette and pixel scale keep the phases consistent. Whether LG-40's kit also adds tooling (a JSON sprite grid, a render script, rebuild checks) is decided in LG-40's own review, by whether phase 1 shows it is needed. It is optional, not a prerequisite.
- **Original and invented only.** Bramble, the magpie, Mira, Rowan, Ari, the three explorer avatars, and the town's places are redrawn as pixel sprites. No new species or cast, no borrowed game look, no named game's tiles or characters.
- **Accessibility does not get smaller.**
  - Sprites carry the same text alternatives as today's art.
  - Pixel scale is chosen so that nothing a child must read or tap is smaller than today (44 CSS pixel targets, 16px body text at 320 and 820 widths).
  - Pixel lettering is never used for anything a child must read.
  - Reduced motion is respected, and frame-by-frame animation stops at its last frame.
- **Spec 244's layers hold.** Pixel art may change the **frame**, which covers art, palette, motif and celebration motion. It never changes the story, task or record layers. Decorative pixel art must not reveal an answer or a recommended move. Task-bearing pixel art preserves the task’s visible game state, including seed counts and board positions, without adding clues or changing the rules. A missing pixel variant falls back to Storybook.

## Phase 1: one Games Table game drawn in pixel art

- **What:** **Seed Holes**, the small mancala already drafted in spec 121 (four holes a side, a store at each end, three seeds per hole), built as the first Games Table game whose *native* art is pixel. It is a new game, so no existing surface is restyled. A sowing board is a natural grid.
- **Its prerequisite, which comes first:** spec 121 holds Seed Holes for "much later". Before it is commissioned, a **separate model review** must pin:
  - board coordinates;
  - legal and terminal states;
  - search depth, including extra turns;
  - evaluation and move ordering;
  - a bounded fallback.

  The earlier optimal-opening claims were removed and need a complete independent solution before reuse. So phase 1 is two steps: (1a) that model review, as its own spec and review, then (1b) the game build.
- **How (1b):**
  - Its own bounded implementation spec, under spec 121's rules: Bramble's dial, the explanation pages, saved work, no scores or locks.
  - The checks spec 121 requires for implementation ("Checks for implementation"), plus the finite checks the 1a model review pins.
  - Art follows the shared palette and pixel scale, authored as SVG in the repo.
- **Smaller alternative (owner call 1):** redraw one *built* game, Ribbon Rows, in pixel art instead. That skips 1a. But it restyles an existing surface, so it becomes a style variant under spec 244 and needs its fallback and parity rules. That blurs the game-first, style-last order this proposal keeps.
- **Finish line:**
  - the game ships at `#orchard/games`;
  - browser checks pass at 320 and 820 with keyboard, touch and reduced motion;
  - the owner has watched real play at home.
- **Transition to phase 2:** the owner says the pixel look reads well in play, and the art needed no runtime code. If the look doesn't read, stop here: Seed Holes keeps its art and nothing else changes.

## Phase 2: receipt motifs in pixel art

- **What:** pixel versions of spec 244 P4's **receipt motif family**: the 1–4 second stamps, filed pages and map pins.
  - They are **authored samples, not a selectable option.** Spec 244's style key accepts only `storybook` and `field-journal` (with `mystery` reserved), and unknown values show as Storybook. Making pixel receipts selectable would introduce a Pixel style before phase 3's gate, and reusing an existing value would change that style's look.
  - The samples are reviewed as a static comparison sheet beside the Storybook and Field Journal motifs. They ship to players only in phase 3, if the Pixel style is approved.
- **Why second:** receipts are frame-layer, small and bounded. Authoring them tests whether the pixel look carries spec 244's receipt meanings (stamped, filed, pinned) before any style work.
- **Gate to start:** spec 244 P4's receipt family exists, with its motif ids, triggers and Storybook and Field Journal versions, so pixel variants fill an existing contract rather than invent one. **Phase 1's transition must also be met.**
- **Finish line:** every receipt motif has an authored pixel sample, reviewed against spec 244 §3's rules, and the owner has seen the comparison sheet.
- **Transition to phase 3:** the owner judges the samples worth a style. Spec 244 §4.4's upkeep evidence comes from spec 244's own phases (gate 1 below), not from these unshipped samples.

## Phase 3: a fourth sitewide style, "Pixel"

- **What:** a style alongside Storybook, Field Journal and, if it survives P5, Mystery & Adventure. Its first PR adds the `pixel` style value to spec 244 §7's contract, and the phase-2 samples become its receipt variants. It is held to all of spec 244:
  - chosen, never assigned;
  - frame layer only;
  - help equally obvious;
  - Storybook fallback;
  - built one surface per PR, as spec 244 P3 does.
- **Gate to start:**
  1. spec 244 §4.4's condition: phases 1–3 of spec 244 show styles are cheap to keep up;
  2. this proposal's phase 2 transition is met;
  3. the owner decides how Pixel orders against Mystery & Adventure (P5).
- **Finish line and stop rule:** spec 244's own. If Pixel coverage lags new games so far that most new surfaces show Storybook inside a Pixel shell, pause and record why.

## Ownership

| Role | Who | Does |
|---|---|---|
| Decisions at each gate | the owner | watches play, says continue or stop, orders Pixel against Mystery |
| Code, art, merge, deploy | Codex (per spec 244 and AGENTS.md) | the Seed Holes build, the motif samples, style PRs, and LG-40 if commissioned |
| Specs and independent review | Claude | the Seed Holes implementation spec, the art and accessibility review of each phase, and this roadmap's upkeep |

## Owner calls

1. Phase 1's game: Seed Holes after its model review (proposed), or Ribbon Rows redrawn (smaller, but a style variant).
2. Whether LG-40's kit is commissioned with phase 1 as just a palette and scale, or with sprite tooling, decided in its own review.
3. Later, at phase 3's gate: how Pixel orders against Mystery & Adventure.

## What this proposal does not do

- It commissions no build, adds no runtime dependency, and approves no publication or sitewide redesign.
- It touches no story, task or record text.
- It creates no new cast and imports no asset.
