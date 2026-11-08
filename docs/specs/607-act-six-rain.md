# 607 · The long rain: Act VI chapter 3

Proposed 2026-11-08 by Claude (OCA seat). Base inspected: `4a4a3dd4` (main, with Acts IV–VI's opening and spec 120's missing-plan fallback merged). **Specification and a bounded build, not release clearance.** New finite text is in [the 607 companion](../content/607-act-six-rain-text.md). The rest comes from the reviewed [act-6.md](../content/120-story/act-6.md) chapter 3, including its *No readable plan* fallback, whose rules are in spec 120 §12. The French went through the [language panel](../reviews/607-french-panel.md). It follows [606](606-act-six-opening.md). Numbered 607, outside the range Codex uses.

**Commission.** The owner, 2026-11-08: "Build the long rain", after "Draft the fallback" (merged as #525). Roadmap lane B (LG-G2).

## Purpose and boundary

Chapter 3 at `#almanac/opening-ways/long-rain` opens once the exchange plan (606) is kept. Before then it explains the gate and links to chapter 2. The chapter has four parts.

1. **The rain starts.**
   - The script's text at both frame amounts.
   - The runner's card: *The brook is rising at Vadoalto. You have until evening.*
   - The Keeper's note on what a warning is.
   - An animated flood post in the rain. Rain falls for three beats, then stops.
2. **Getting ready.**
   - The Sprout job, played here: *Up high and dry*. Flour bags go on the top shelf and jars on the middle, as the baker says. A wrong shelf shows its hint, and right shelves show the kept line.
   - The Seedling job (the hours clock) is marked away from the screen, because that activity is unbuilt.
   - The Sapling job links to Instructions for a Reader.
3. **Passing the warning on.**
   - The script's text, and the warning card in English and French. The French is marked `lang="fr"`.
   - Seedling, played here: choose which of three French cards matches the English. Each wrong card differs in one way and explains itself.
   - Sapling, played here: build the card from eight word cards with English glosses. *Baisse* and *ce soir* explain themselves, and a wrong order gets a starting hint.
   - **Send** (Sprout, and open to everyone) records the warning. Afterwards the script's line says the courier is halfway down the river path.
4. **The water arrives** (after sending), by spec 120 §12:
   - **One of today's three Act IV plans:** that plan's scene from the script.
   - **No plan stored:** the meeting, offered again. Dot finds an empty pin, and the explorer chooses one of the three plans, each shown with 602's description, costs and what it protects, or *Let the water come*. A chosen plan is written, and its scene plays after "Dot pins it up, just in time." *Let the water come* writes nothing, and the plain scene plays.
   - **A well-formed plan code from another version, or a malformed value:** the guide's line, then the plain scene. No choice is offered and nothing is written. Grown-up notes say a damaged plan is kept unchanged.

   Each version shows the flood post with the water rising and stopping, then *Warned in time* scratched beside it, and ends with the script's *Every version ends* lines.

The shelf game and the French card games are play for this visit only. They are not saved, they reset with explorer switches and progress resets (606), and they are not assessments.

**Out of scope**, each a separate commission:
- Léon's reply (letter 7).
- Chapter 4: the first journey, Hollis's return and letter 8.
- Page 6 and the Act VI ending.
- The hours clock.
- The Keeper's Desk job.

## State

- **`story.acts.VI.warned: true`** is written by **Send**, the chapter's one write. Send needs a started Act VI and a kept exchange plan. Sending again is a no-op, and a malformed `warned` is neither read as sent nor overwritten. The warning counts as *the long rain has played* for Act VI's ending condition (120 §6), which nothing reads yet.
- **The Act IV plan** is read **by shape** (`storyPlanKind`), as spec 120 §12 requires, not through Act IV's view. Its four kinds are:
  - absent;
  - known (`wall`, `sponge` or `some-of-each`);
  - a well-formed code from another version (`/^[a-z][a-z-]{0,39}$/`);
  - malformed.
- **Writing the plan.** `chooseRainPlan` writes only an absent `story.plan`, after the warning is sent, by explicit choice. It leaves any `story.planWorry` exactly as saved, and refuses every other case.
- **The atomic step.** All writes go through 606's atomic step: a refusal writes nothing.

## The French

The owner's 2026-10-30 decision (spec 117) replaces a fluent human reviewer with an independent three-model panel: OpenAI (Codex), Google (Gemini) and Anthropic (Claude), each reviewing separately.

- **Round 1** found no grammar errors, but flagged four things:
  - a giveaway, since only the right choice carried the signature;
  - *Il arrivera*, where it is the water, not the brook, that arrives;
  - *descend*, which means flowing downhill more than a falling level;
  - a three-way-wrong third choice.
- **The resolution:**
  - *L'eau arrivera chez vous demain matin*;
  - *baisse*;
  - *ce soir* as the third choice's only difference;
  - the signature on every choice.

  act-6.md's card and choices were updated to match.
- **Round 2,** on the changed lines: all three accept, with no errors.

The full record is in `docs/reviews/607-french-panel.md`.

## Presentation

- **Code.**
  - `act-six-content.mjs` gains the `rain` block.
  - `act-six-core.mjs` gains the chapter id, `storyPlanKind`, the rain view, `sendWarning` and `chooseRainPlan`.
  - `act-six-ui.mjs` gains the chapter, its games and its binders, and the hub's chapter 3 link.
  - `act-six-rain-art.mjs` (`floodPostScene`) and `act-six.css` add the pictures and their animation.
- **Integration.** No other module changes. 606 already routes every `#almanac/opening-ways/*` path and binds Act VI everywhere.
- **The picture.** The flood post shows this invented rain only. It measures nothing and gives no advice about real floods, as the script's authored-fiction caveat says.
- **Accessibility.**
  - Each shelf item labels its pair of buttons, and choices and cards are buttons with `aria-pressed` or disabled-when-used.
  - The built card is a live region. Focus moves to each result, and to the water after sending.
  - Targets are 44 px. Read-aloud covers visible prose only, and skips the closed Keeper's note.
  - Motion settles within five seconds; reduced motion shows the finished pictures.

## Upstream study and curriculum place

**Jane**, refreshed at `c681f6bf2f2adf2aa032f765983a4691774cfba5`, is studied only, as in 606. No Jane code, prose or assets are used.

**Marble**, refreshed at `04962c78ccb8bd52b236512d3362405bace98d2a`. The repository pin `96a7933754af672e1bfdbf7ecb05c325860c6e0d` is unchanged. Nothing is mapped or claimed; the games are story play.

**Spec 49.** Act VI is the act of exchange and preparation: a warning is time, and help that came down the river keeps going down it.

**Spec 120.** This slice covers:
- §6, chapter 3;
- §12's missing-plan fallback, built exactly as merged;
- §10's languages, with French under the owner's panel method.

All new prose and the illustration are original project material.

## Gates and acceptance

Before build: an independent spec review of this spec and its companion. The French already has its panel record.

**Pure checks** (`test/act-six-rain-checks.mjs`):
- **The gate.** The chapter waits for the exchange plan, and no warning can be sent before it.
- **Before sending.** The rain scene and runner's card, the shelf game and the honest jobs appear. The French card is marked as French. Exactly one choice matches the card, and the word cards build it. The water waits for Send.
- **Sending.** Reads write nothing, and a refused export writes nothing. Send writes only `warned`. A repeat is a no-op. Notes say the warning was sent, and an unchosen courier reads as *the courier*.
- **The three known plans.** Each plays its scene and *Every version ends*, with no fallback.
- **An absent plan.**
  - The meeting is offered with *Let the water come*, each plan showing what it is and what it costs, and no scene plays before the choice.
  - An unknown plan and a refused export are refused.
  - Choosing writes only the plan and keeps the saved worry. The chosen scene plays, and a plan once present is never replaced.
- **A later or malformed plan** (three fixtures). Each is read by shape, gets the guide's line and the plain scene with no choice, and is never overwritten. Notes say a damaged plan is kept.
- **The plain scene** names no plan feature. This makes concrete, for this reviewed text, the editorial check that 120 §12 requires.
- **A malformed `warned`** is not a warning and is not overwritten.
- **Text tracing.** Every content string traces to act-6.md, letters.md, or the 606 or 607 companion (`test/act-six-checks.mjs`).

**Browser journey** (`test/act-six-rain-browser.py`), at 820 and 320:
- **The games.** The shelf game, the French choice and the word cards each give their hints and right lines, and they write nothing.
- **Sending.** Send records only the warning. The courier line and *Warned in time* appear, and focus moves to the water.
- **An absent plan.** The meeting is offered before any scene. *Let the water come* plays the plain scene and writes nothing. After a reload, choosing the Sponge writes only the plan, keeps the worry and plays its scene.
- **A plan from another version.** It gets the line and the plain scene, with no choice, and stays as saved.
- **Layout and motion.** Targets are 44 px and nothing overflows. Motion is finite and settles within five seconds; reduced motion is still.

Existing suites still pass. Physical iPad, Safari, VoiceOver, audible French and learning effects remain unqualified. An exact-head implementation review and the repository's landing procedure follow.
