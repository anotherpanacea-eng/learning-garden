# 602 · The Town Has Two Stories: the meeting board and *The Map We Changed*

Proposed 2026-11-08 by Claude (OCA seat). Base inspected: `cc85ff60`, the head of [601](601-act-four-orchard.md)'s branch, on which this is stacked. **Specification and a bounded build, not release clearance.** The finite text is in [the 602 companion](../content/602-act-four-meeting-text.md); almost all of it is extracted unchanged from the reviewed script, [act-4.md](../content/120-story/act-4.md) chapter 4 and ending. It follows [352](352-act-four-opening.md) and 601 everywhere this spec does not say otherwise, and through them [326](326-both-ways-across-willow-bridge.md) and [248](248-a-town-of-our-own.md). Numbered 602, outside the run Codex uses for new benches.

**Commission.** The owner, 2026-11-07 and 08: "do a deep dive into the Learning Garden and do some creative work. Build animations, story beats, games, and lessons. Identify big picture stuff and spec, build, and PR it." [Spec 120](120-keeper-of-the-ways.md) §12 lists the Act IV meeting board as an unbuilt dependency: "those endings ship only when they do." This slice builds it and the ending it unlocks. Roadmap lane B (LG-G2).

## Purpose and boundary

1. **Chapter 4, *The proposal for the low fields*,** at `#almanac/two-stories/meeting`: the meeting text at both frame amounts, Bramble's speech, and **the meeting board**, with three plans (the Wall, the Sponge, Some of Each). Each plan can be opened to read what it is, what it costs and what it protects. The explorer **keeps one plan**, optionally with **one worry** from that plan's list, and can choose again until the ending.
2. **An animated meeting scene:** the library on meeting night, lanterns along the shelves, the old map on the board and three plan cards (a wall of stones, reeds in water, half of each) that pin up one by one. It is story art: it shows the room and the board, never which plan is right.
3. **The Act IV ending, *The Map We Changed*,** at `#almanac/map-we-changed`. It is offered once a plan is kept and work has been offered in any two of chapters 1 to 3. It shows:
   - the one script line where *someone changes their mind*, chosen by matching offered work;
   - the guide unpinning the card from the library door and changing their mind, the [366](366-guide-changes-their-mind.md) arc this act set up, with the chosen guide's own tail;
   - the ending text;
   - the season line;
   - the almanac line naming the kept plan;
   - the between-acts line.
   
   The ending scene is the same board with new pencil drawing itself on the old map: "a line here, a question mark there, a small drawing of a reed".

The board is the game and the lesson: three plans that each cost something and protect something, and a worry that makes a plan honest. Nothing scores a plan. The script is explicit: "People will keep arguing. That's allowed." The librarian says "the worry is the most useful part."

Out of scope, each a separate commission: chapter 3 (the Gazette and the archive), its Dutch-archive mind-change line, chapter 4's Sapling job (a *because/but* sentence in Sentence Bridges) and Keeper's Desk dossier, the film *The Map We Changed* (LG-G5, once this ending is built), the Act V opening and Page 5, and Act VI's use of the plan.

Keeping a plan or reaching the ending is story progress. It is not a curriculum milestone, a judgment of the plan or a learning measure.

## Routes

`actFourRoute` returns `{part:'chapter',chapter:'meeting'}` for `#almanac/two-stories/meeting` and `{part:'ending'}` for `#almanac/map-we-changed`. Chapter 3 still falls back to the hub, as 352 requires. The hub links chapters 1, 2 and 4, and then shows one of three things:
- **Hear what the meeting decided**, when the ending can be reached;
- **Read the ending again**, once it has been reached;
- otherwise one line saying what the ending needs, and that every game is open.

## State

Story version 1, additive, following spec 120 §12 ("`plan` is one of `wall | sponge | some-of-each` once kept"):
- **`story.plan`:** one of the three plan ids. §12 fixes these ids for Acts IV and VI, so a saved plan outside them is unreadable, not a different plan.
- **`story.planWorry`:** `null` or a worry code (lowercase letters and hyphens, at most 40 characters). A saved worry is read by **shape only**, never against today's worry list, and mapped to text in the UI. A code today's list doesn't know shows as *a worry from an earlier version*.
- **`acts.IV.ended` and `acts.IV.season`:** reserved by 352 for this commission. `ended` counts only when the act has started, so a saved `ended` without a start is not an ending (352's rule). `season` is one of the four seasons.
- **New scene:** `map-changed`.

Mutators, options-last `{canExport}`, each through 248's whole-notebook clone, `recoveryFitsProgressLimits` and real Notes preflight; a refusal leaves every byte unchanged:
- **`keepActFourPlan(state, plan, worry)`.**
  - It needs Act IV started and not ended, readable `ended`, plan and worry fields, and a plan from the three.
  - A worry must come from that plan's list (new input is checked against today's offer; saved values are not).
  - It writes both codes, so choosing again replaces both. Repeating the same choice is a no-op.
  - An unreadable saved plan or worry is never replaced.
- **`endActFour(state, month)`.**
  - It needs a readable kept plan and readable receipts in at least two of chapters 1 to 3, which act-4.md sets: "a plan is kept at the meeting (chapter 4), plus a contribution in any two of chapters 1 to 3".
  - It writes `ended:true`, the season from the device month (Act III's `seasonForMonth`) if no season is saved, and the scene.
  - Ending again reports done and keeps the first season.
  - After the ending the plan is fixed.
  - Removing or damaging an activity never revokes the ending.

Pure views add `planStatus`, `worryStatus`, `plan`, `worry`, `earlierChapters`, `endedStatus`, `seasonStatus`, `ended`, `season`, `canKeepPlan` and `canEnd`. `actFourMindChange(view)` picks *someone changes their mind* in the script's order:
1. the orchard keeper, after a chapter 2 Rain Paths offer;
2. Pip, after the chapter 1 ledger offer;
3. otherwise, the librarian.

The Dutch-archive line waits for chapter 3. Every line refers only to work actually offered, as the script requires, "never merely an opened page." The guide's lines refer to the guide's own card, never the explorer's work. Chapter 4 adds no receipt: the kept plan is chapter 4's contribution, and `contributions.meeting` stays reserved and invalid. Notes add "a plan kept" or "no plan kept yet", and "the meeting has ended". No free-text field.

## Presentation and integration

- `act-four-content.mjs` gains `meeting` and `ending` blocks.
- `act-four-core.mjs` gains the plan and ending mutators and views.
- `act-four-ui.mjs` renders the meeting page, the board, the keep form and the ending.
- `act-four-meeting-art.mjs` draws the scene, and `act-four.css` styles and animates it.
- No shell change: the shell already routes every hash `actFourRoute` recognizes.
- **Keep form:** native radio groups in fieldsets. Choosing a plan shows only that plan's worries ("No worry for now" is the default), and **Keep this plan** becomes **Choose again** once a plan is kept.
- **Focus:** after keeping, it moves to the keeping section; after ending, to the ending heading.
- **Motion:** in the scene, cards pin and lanterns glow once and settle within about three seconds; in the ending, the pencil draws itself within three. Nothing loops, and reduced motion shows the finished pictures.
- 44 px targets, 16 px text, visible focus, read-aloud of visible prose only, checks at 320 and 820.

## Upstream study and curriculum place

**Jane**, refreshed at `c681f6bf2f2adf2aa032f765983a4691774cfba5`, studied only, as in 352 and 601: a story hook, stages and a reached beat that stays reached. Jane ends a quest with a boss and a medal; this act ends with a plan the explorer keeps and a worry they name, and no plan wins. No Jane code, prose or assets.

**Marble**, refreshed at `04962c78ccb8bd52b236512d3362405bace98d2a`; the repository pin `96a7933754af672e1bfdbf7ecb05c325860c6e0d` is unchanged. These are candidates only, with no atlas mapping and no claim. Each is *not yet mapped* in `curriculum/topic-coverage.csv`, with its owning strand from `curriculum/six-act-topic-plan.csv`:

| Topic | Why it is near |
| --- | --- |
| Changing Your Mind with Evidence `mt_obF-6VYRya` | The ending's mind-change lines and the guide unpinning the card. 352's crosswalk places it in the hard closure of Correlation vs Causation. |
| Could there be another explanation? `mt_QrVF5n7vci` | The guide's new idea: "the rain and the Sponge together." |
| Correlation vs Causation `mt_X0Tr8IYaEd` | The act's carried question, now answered with a plan and a stated uncertainty rather than a verdict. |

The meeting board itself is not a lesson in any one topic. It is spec 49 §5's *new application* and *purposeful revisit*: the evidence from chapters 1 and 2 meets a decision with costs. That is spec 49's Act IV purpose, "evidence and disagreement," and §7's council or dossier activity, with "authored objections and multiple defensible plans." No free text (step 7).

**Hard-prerequisite crosswalk** against the pinned `curriculum/marble/dependencies.json`, as in 352. The closure of `mt_X0Tr8IYaEd` is Correlation vs Causation ← Could there be another explanation? `mt_QrVF5n7vci` ← Changing Your Mind with Evidence `mt_obF-6VYRya` ← Observation vs Interpretation `mt_Hw70LI5xza`. 602 claims none of these, so none gates it; Observation vs Interpretation is already declared by Rain Paths and the plant study.

**Spec 120.**
- The chapter 4 jobs (§7, §8): this slice ships the Sprout and Seedling jobs ("new: the meeting board", with and without a worry).
- §11's rules: nobody is told their plan is wrong, every destination stays open, and a small supported plan reaches the same ending.
- §12's state sketch: the plan ids and pages derived, not stored.
- The ending frees no page. Page 5 belongs to Act V's opening (§5).

**Spec 366.** The guide pinned *Mostly the rain* in the hub (352) and kept checking it in chapters 1 and 2 (352, 601). The ending ships 366's change of mind, with the old card left showing.

All new prose and the illustrations are original project material. The four *new* strings in the companion are interface labels and scene descriptions.

## Gates and acceptance

Before build: an independent spec review of this spec and its companion. No language panel is needed: Nuria speaks English here, and no non-English text ships.

Pure checks (`test/act-four-meeting-checks.mjs`, fixtures from the real Act IV, ledger and Rain Paths APIs):
- **Keeping a plan:**
  - The three plan ids and three worries each match the script.
  - No plan before Act IV starts. A refused export, an unknown plan and another plan's worry write nothing.
  - Keeping stores codes, and adding a worry and choosing again replace both. Keeping touches no activity or receipt.
- **Reaching the ending:**
  - It needs a kept plan and two chapters of work; one chapter is refused.
  - The ending refuses an impossible month and a refused export.
  - It writes `ended`, the season (October is autumn) and its scene. A repeat keeps the first season.
  - The plan is fixed afterwards. Removing activities never revokes the ending.
- **Saved data read by shape:**
  - An unknown saved plan is unreadable and cannot be replaced or end the meeting.
  - A worry code from another version is read and shown plainly; a malformed worry blocks replacement.
  - A saved `ended` without a start is not an ending.
- **Mind change:** after a rain result, the orchard keeper; after only the ledger note, Pip; otherwise the librarian.
- **Rendering:**
  - The hub links chapter 4 and offers the ending only once it can be reached.
  - The meeting scene is described, with three plan cards, three choices and Bramble.
  - The kept plan and worry show.
  - The ending shows the penciled scene, the matching mind change, the guide named and unpinning the card with only that guide's tail, the season line, the almanac line with the plan and the between-acts line.
  - After the ending the plan shows as fixed, the hub offers the ending again, and Notes name the plan and the ending.
  - Renders and views write nothing.

Existing suites still pass: `test/act-four-checks.mjs` (chapter 4's route is now commissioned; chapter 3 still falls back; this companion joins its reviewed-source list) and `test/act-four-orchard-checks.mjs`.

Browser journey (`test/act-four-meeting-browser.py`), at 820 and 320:
- **Arrival:** the hub links chapter 4 with no ending offer yet. The meeting scene is described, and its three cards sit apart on the lower board. Opening a plan shows its costs. Reading writes nothing, with 44 px targets and no overflow.
- **Keeping:**
  - Choosing a plan shows only its worries.
  - Keeping stores the plan and worry codes, shows the worry, moves focus and leaves Rain Paths unchanged.
  - Choosing again with no worry clears the worry, and the plan survives a reload.
- **The ending:**
  - Ending records `ended`, a season and the scene.
  - The ending shows the orchard keeper's line, Mira unpinning the card with her own tail, the season line and the almanac line.
  - Afterwards the plan is fixed.
- **Motion:** reduced motion leaves the scene still; otherwise every part animates once and settles within five seconds.

Physical iPad, Safari, VoiceOver and learning effects remain unqualified. This is followed by an exact-head implementation review and the repository's landing procedure.
