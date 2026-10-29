# 244 · Presentation styles: Storybook, Field Journal and a Mystery candidate

Status: proposed, 2026-10-26. **Writing only: a plan, not a build commission.** It develops the short [audience presentation](../audience-presentation.md) contract into a full design: what each style changes, what never changes, how styles meet challenge bands, the Keeper's Desk and the story spine, and the order to build them in. The first build slice is still course route CR1 in [course routes](../course-routes.md), and CR1 still needs its own bounded implementation spec and independent review before code. Codex owns code, art, film, merge and deployment. Draft copy for each style is in the companion [244-presentation-styles-text.md](../content/244-presentation-styles-text.md).

Single device, offline, single player. A style is a per-explorer look and voice. It needs no account, name, age, grade, gender or other demographic fact, and it collects none.

## 1. The question this answers

The owner asked whether the game could be "reskinned" for different audiences, perhaps by age or gender. This plan answers yes to the reskin and no to the sorting:

- **Styles are chosen, never assigned.** Any explorer can pick any style at any time and change it back. No code path picks a style from age, gender, pronouns, avatar, guide, challenge band, course route, reading amount, language choice, story progress or performance.
- **Styles are looks and voices, not difficulty.** Harder work comes from the [challenge bands](proposed/challenge-bands.md), the [course routes](../course-routes.md) and the [Keeper's Desk](118-keepers-desk-entry.md). A style never adds or removes teaching, help or depth.
- **Representation is a separate job.** Mira, Rowan and Ari, and the girl, boy and neutral explorer avatars, stay selectable in every style. Broader representation (more hair, clothing, skin tones, portraits) is art work for every style, not a feature of one.

Why not sort by age or gender: children mature unevenly and like what they like; a label like "for older kids" or "for girls" turns a look into a verdict about the child. A style named for what it looks like ("notebook pages and maps") lets a child who wants a quieter page take it without having to claim an identity, and lets a child who loves the bright café keep it for as long as they want.

## 2. Five axes, held apart

| Axis | Owned by | What it changes | What a style may do to it |
| --- | --- | --- | --- |
| **Presentation style** | this spec | Look, voice of frame copy, celebration register | (itself) |
| **Challenge** | [challenge bands](proposed/challenge-bands.md), [course routes](../course-routes.md), [spec 217](217-subject-pathway-entry.md), [spec 118](118-keepers-desk-entry.md) | Quantities, task depth, which destinations a learner is pointed toward | Nothing. Never reads or writes `garden.start`, `garden.cafeStart` or a pathway choice |
| **Reading support** | spec 120 §16 page amounts, spec 114 reading amounts, read-aloud | Text length, speech | Nothing. A style never changes a default reading amount or read-aloud prominence |
| **Language** | French and Spanish strands | Which language a task uses | Nothing |
| **Guide and avatar** | [first visit](../first-visit.md) | Companion and explorer art | Redraws them in the style's art set later (§7), never swaps or hides one |

Two consequences follow. The settings screen must never place the style choice so it reads as part of a band or pathway choice (no "Sapling · Field Journal" pairing, no shared Apply). And no default couples them: picking Field Journal does not suggest Sapling, and picking Sapling does not suggest Field Journal.

## 3. The layer model: what a style may change

Every string, color and picture in the game belongs to one of four layers. A style may change only the first.

| Layer | Contents | Style may change it? |
| --- | --- | --- |
| **Frame** | Place arrival lines, café guest arrival and thank-you lines, section eyebrows, transition lines, celebration and receipt lines, empty-state lines, decorative art, palette, type scale, borders, motifs, celebration motion | **Yes**, within §4's rules |
| **Story** | Spec 120 scenes, pages, letters, act endings, recaps, character names, species, pronouns, personalities, reveal order, scene ids | **No** in phases 1 to 4 (§9, owner decision O1) |
| **Task** | Task statements, quantities, units, supplied choices and their order, ingredient properties, source passages, model labels ("story", "model", "source"), hints, the I'm stuck ladder, worked examples, glossary control and place names, drawn how-tos, feedback and explanations | **No** |
| **Record** | Saves, support and familiarity records, story receipts, evidence, exports | **No**. A style is never evidence and is never read by evidence code |

Rules at the boundary, because that is where mistakes happen:

1. **A frame line that states a goal, quantity or action keeps it.** The café supper line "Serve six tables..." may change voice in Field Journal, but "six tables" and "serve" stay. If a frame line cannot be revoiced without changing the task, it stays Storybook.
2. **Context that carries meaning is task.** Ingredient properties ("cold, soft, sweet") are what a guest's wish is checked against; a guest's kind is part of the order's picture. A style may redraw a guest in its art set but never changes which guest it is or what they want. Marble's teaching research treats context the same way (§11).
3. **Control names come from the shared glossary.** Push C's glossary of control and place names applies in every style. Field Journal does not rename **Keep it safe** to "File it" or the Café to "the tasting counter" on a control. Prose around a control can use the style's voice; the control's label cannot.
4. **Help stays equally obvious.** Field Journal's quieter voice must not make **I'm stuck**, hints, read-aloud or **Skip for now** smaller, paler or harder to find. A quieter page is not a sparser one.
5. **Storybook is today's game.** Storybook means the copy and look currently shipped, exactly. No new Storybook copy is written by this spec; Storybook frame copy changes only through ordinary reviewed PRs, as now.
6. **Missing variant falls back to Storybook.** Any frame string, token or picture without a variant in the chosen style shows the Storybook version. Partial coverage is safe and never blank.

## 4. The styles

### 4.1 Storybook (current game, default)

**Premise.** A picture book you can walk into. Warm, funny, expressive, with the town's neighbors close to the reader.

- **Art.** The existing original SVG set: rounded shapes, the garden palette from the first-visit spec, expressive faces, scene backgrounds.
- **Type and layout.** The existing local system typography and layout.
- **Voice.** Spec 120's writing rules: warm, dry, specific; jokes from character, never at a child's expense. Frame lines can be playful ("The seat looks mildly surprised").
- **Celebration.** Short visible flourishes and a character response. Respects reduced motion.
- **Films.** As made. Storybook is the reference for every film.

Storybook needs no new work. It is defined here so the other styles have a fixed reference.

### 4.2 Field Journal

**Premise.** The same town, seen through a keeper's notebook. Maps, labels, specimen sketches, pinned notes and stamped receipts. Quieter humor, more room on the page, a reader treated as a colleague. Warm, never gray.

- **Art.** Same characters and places, drawn as notebook sketches: ink line over watercolor washes, ruled or gridded paper behind panels, map pins, paper tabs, tape, rubber stamps. Character art keeps the same faces, species, clothes and expressions; it is a different drawing of the same person, not a different person. Decorative scene backgrounds can become annotated sketches with labels. Labels added to art are frame, so they must not answer a question on the same screen.
- **Palette.** A paper-and-ink family built from colors the game already uses on its story surfaces: paper `#fffdf6`, library-blue ink `#203f58`, river `#78b7cf`, reed green `#496b4d`, wrapping brown `#b99b73` (all from spec 120 §16), plus one stamp red for focus and receipts. Body text stays dark on light at 4.5:1 or better; focus rings stay at least as visible as today's. Exact values are fixed in the implementation spec after a contrast check.
- **Type and layout.** Same font stack and the same minimum sizes. Headings may become smaller-caps labels over a rule; panels may sit as notebook pages with a margin. Never smaller body text, never lower contrast, never a handwriting font for anything a child must read.
- **Voice.** Second person and plain, like a field note written for the reader. Fewer exclamation marks, fewer sound effects, more specific nouns. Characters still have their personalities; the frame just lets them speak without a narrator nudging. Same word limits as spec 120 §8 (hooks 30 words at most).
- **UI framing.** Places may show as tabs or pinned map labels; the café counter as a ledger page with the guest's order card clipped on; Grown-up notes stay exactly as they are in every style.
- **Story framing.** Spec 120's scenes, pages and letters appear unchanged, set on notebook paper. The Keeper's Pages already look like a keeper's record, so Field Journal suits them without new text.
- **Celebration.** A receipt: a stamp lands on the page, an artifact is filed, a pin is added to the map. Visible and meaningful, never removed. Spec 120's local made/shared/received moments map naturally to stamps and filed pages (see the [joined media inventory](../story-milestones-and-films.md#joined-media-inventory)).
- **Films.** Same films. Field Journal can wrap a film's opening and end card in a notebook frame. New key art only after a comparison shows a concrete need (§8).
- **What it is not.** Not "the older kids' mode", not grown-up mode, not harder, not text-heavier, not colorless, not the Keeper's Desk.

### 4.3 Mystery & Adventure (candidate only)

**Premise.** The town as a case file. Clue cards, an open-questions board, graphic-novel panels, journeys along the post road.

It fits the story better than most themes would: the parcel is a real mystery, the pages arrive slowly, Act IV is an honest argument and Act III is a journey. It also carries the largest risks, which is why it stays a candidate:

- **Early reveal.** A mystery frame invites "solve it" prompts. The Keeper's identity and Hollis's name are reveal-timed by spec 120; a clue board may only show what the pages have already shown.
- **Invented villains.** Bramble is a rival who never needs redeeming, and her Act IV points are partly right. A mystery frame must not make her a suspect or turn the wall-versus-Sponge debate into a crime.
- **Pressure.** No timers, countdowns, "case closed" scores, bosses or locks. Clues are kept work under each activity's own rules, never a gate.
- **Fiction and history.** Archive packs are real history. A case-file frame must not dress a real flood with real deaths as an adventure.

If commissioned (phase 5), it needs its own narrative review against spec 120 §11 before any copy is written. The owner expects a mystery frame to need text changes beyond the frame layer (O3), so that review also decides whether it needs authored story variants (O1). A different universe or cast is a separate, much larger project and is out of scope.

### 4.4 Styles considered and set aside

- **A gendered pair** (for example a "princess" and an "explorer" skin). Rejected: it encodes the sorting this spec rules out, and every look should be open to everyone.
- **A plain "grown-up" or minimal mode.** Rejected as a style. Legibility, larger text and reduced motion are accessibility settings available in every style, not a separate look.
- **Many small themes** in the manner of Jane's pirates, space and dinosaurs. Set aside for now: each theme multiplies art and copy upkeep across about a hundred surfaces (§8), and the town already has a strong world. Revisit only if phases 1 to 3 show styles are cheap to maintain.

## 5. How styles meet the rest of the game

### 5.1 Challenge bands and course routes

Fully independent (§2). A style never changes a range, pool, task depth or suggestion. The Café's range explanation and band-free child screen are unchanged in every style. Course route CR1 is the first build slice of this spec; no other course slice depends on a style.

### 5.2 The Keeper's Desk (spec 118)

The Desk's conventions in spec 118 §3 (teach first, the stuck ladder, steps in any order, mechanical checks only where mechanical, adults lead, disagreement is normal, keep then revise) are **task-shape** conventions. They hold in every style. So:

- The Desk is open and pointed out in every style. Field Journal is not a route to the Desk and the Desk is not Field Journal.
- In Storybook the Desk keeps its denser, plainer text; Pip and Dot can appear in the frame but still do not narrate or explain (spec 118 §3.5).
- In Field Journal the Desk's chrome can become a case folder with ruled pages. Its text, checks, learn cards and records do not change.
- A child in Storybook can work every Desk case. A child in Field Journal can serve every café guest.

### 5.3 The story spine (spec 120)

Spec 120 §8.1 says every chapter has one shared scene: "Same event, same characters, same jokes, same page." Styles keep that rule literally. In phases 1 to 4, **story-layer text is identical across styles**; only the frame around it changes (§3). That keeps the sibling conversation spec 120 §8.5 wants ("Which plan did you keep?") about the same scene, and it means no style can leak or delay a reveal. The original audience proposal's sample parcel hooks are concept examples only and are not adopted as replacement script.

Further consequences:

- Page reading lengths (Short, Longer, Original) and their default stay the same in every style.
- Arrival points in spec 120 §10 are independent of style. "Arrive with the letter from upstream" is not a Field Journal arrival.
- Story receipts, scene ids and act endings are never written or read by style code. Switching style never replays a scene or ending, and a replay shows the current style's frame around unchanged text.
- If the owner later wants authored scene variants (decision O1), each one amends the owning spec 120 section, keeps §8.1's events, characters, jokes and page content, and passes the same story review as the original.

### 5.4 Spec 49's six acts

Styles are not mapped to acts, just as acts are not age grades. Reconciliation, act by act:

| Act (spec 49 purpose) | What every style keeps | Storybook frame | Field Journal frame |
| --- | --- | --- | --- |
| I · After the Storm (participation) | Parcel scene, first supper, Page 1 | Garden map with three paths, warm supper flourish | Annotated garden sketch, supper stamped in the café ledger |
| II · A Town of Our Own (belonging, making) | Market, garden, gathering, show; Page 2; Ember's birthday | Bright stalls and a party flourish | Market sketches with price tags, a pinned program for the show |
| III · Beyond Willow Bridge (exchange) | Letters from Vadoalto and Les Saules, the courier's route | Letters with stamps and a flying courier | Post road map with pins and a route log |
| IV · The Town Has Two Stories (evidence, disagreement) | Wall, Sponge, Some of Each; Gazette; Bramble's fair objections | Town meeting with expressive faces | Meeting notes in two columns, labeled as notes |
| V · A Question of Your Own (authorship) | The explorer's chosen project and its stated limit | Project corner in the Loft | Project page in the notebook |
| VI · The Opening of the Ways (shared agency) | Long rain, warning passed on, Hollis's return, the apprentice | Lanterns along the open ways | The completed map, every pin the explorer placed |

In every row the act's purpose, events and contributions are identical; only the frame differs. Spec 49 §5's teaching contract is untouched: a style never supplies or removes a teaching encounter, contrast, supported practice, application or revisit.

### 5.5 Clarity sweep (Push C)

Both styles follow the child-screen rules from the [2026-10-22 text review](../reviews/text-review-2026-10-22/README.md): grown-up language off the child's screen, the shared glossary, US spelling, symbols that read well aloud, no answer giveaways. A Field Journal string is reviewed against the same rules as its Storybook twin. A style variant never lands before the Storybook string it varies has passed its Push C pass, so the sweep is never done twice for one surface.

### 5.6 Films, songs and drawn how-tos

- One film per story beat, shared by every style. Styles may frame a film's opening and end card and the 1 to 4 second receipt motifs; the film's content, captions, still and text fallback stay the same.
- Drawn how-tos (83 live) are instruction, so they are task layer. They are not restyled.
- Songs are unchanged.
- No style authorizes new recorded voices or voice cloning. A voice change needs its own voice, rights and content decision.

### 5.7 Guides, avatars and representation

Style never changes which guide or avatar is chosen. When a style later gets its own character art (phase 3 or later), every guide and every avatar is drawn in that style, with equal care, before the style covers any surface where they appear. A style never ships with one guide drawn and another missing.

## 6. Choosing a style

- **Where.** In Grown-up notes, beside the other explorer preferences, with a live preview of one café card in each style. A child can ask to switch; the preview is child-readable. Phase 1 adds no Home prompt and no new step in the `#begin` flow (owner decision O2 can add a child-facing switch later).
- **Names and descriptions.** **Storybook**: "Bright pictures and playful lines." **Field Journal**: "Notebook pages, maps and quieter lines." Descriptions name the look, never a reader. Forbidden in any style copy, label or help text: "for older kids", "for little ones", "grown-up", "big kid", "for girls", "for boys", "simple", "advanced", "baby".
- **Default.** Storybook for every explorer, new or existing, until someone chooses otherwise. No first-run question.
- **Switching.** Any time, freely reversible, per explorer. The frame changes on the next render. A pending task, open order, plate, typed answer, attempt history, support record, open scene and current film stay exactly as they are; a film in progress is never restarted or interrupted by a switch.
- **No nudging.** The game never suggests switching, never remarks on a choice and never ties a style to progress ("You've grown up enough for the Journal").

## 7. State contract (for the implementation spec to confirm)

- One optional field: `garden.style`, exact code `storybook | field-journal`. A later Mystery style would add `mystery`. The name avoids the existing café supper `theme` and the films' `data-theme` attributes, and the word "presentation", which other activities already use for oral presentations.
- Missing means Storybook (legacy behavior). An unknown or malformed value is kept verbatim and displayed as Storybook; it is never rewritten on load, view or export. That makes an older build safe with a newer save that holds `mystery`.
- Written only by the explicit choice in §6. Choosing the current value is a no-op and does not save. Follows the preservation rules already used for `garden.start` in the challenge-bands spec and spec 114: preserve siblings, decline rather than replace an unreadable `garden`, follow the existing storage-failure warning.
- Travels in the explorer's ordinary save and notes export. Never copied to another explorer. Saving-off keeps it for the session only.
- **Never read by evidence, adaptation or suggestion code.** The implementation must include a check that switching style alone writes no observation, support, familiarity, exposure, story or pathway record.

## 8. Implementation shape (advisory for Codex)

The cost of a style is mostly upkeep, so the plan keeps the machinery small:

- **Tokens.** `style.css` defines eleven root color tokens, but the 98 stylesheets in `dist/` hold about 2,900 hard-coded hex colors (about 1,100 distinct values) against roughly 340 `var(--…)` uses (counted 2026-10-26). A whole-game restyle is therefore a token migration across every stylesheet. Migrate **one surface at a time, only when that surface joins a style**, converting its colors to tokens and adding a `[data-style="field-journal"]` override block. No global rewrite.
- **Root attribute.** Set `data-style` on the document root from `garden.style` when an explorer is active, and clear it when switching explorers.
- **Frame copy.** Per surface, a small keyed map whose Storybook entry is the existing string, with optional variants. Missing variant falls back to Storybook (§3.6). Strings keep `lang="en"` and the same read-aloud path. No generic theme or content framework.
- **Art.** Field Journal art lives beside the existing SVG modules and is chosen by the same key; missing art falls back to Storybook art.
- **Coverage list.** One table (in this spec or its implementation spec) lists which surfaces have a Field Journal frame. Everything else shows Storybook.
- **Upkeep rule.** A new game or pack needs only Storybook. A Field Journal variant is optional, added in its own small PR, and never blocks review, merge or deployment of the game.

## 9. Build phases

Each phase is its own bounded spec or PR with independent review, under owner priority 4 as course-routes CR1 already places it. Nothing here outranks priorities 1 to 3; a phase starts only when those have no ready work.

| Phase | Finish line | Gate to start |
| --- | --- | --- |
| **P0 · This plan** | Spec 244, companion copy, roadmap entry | Owner answered O1 to O3 on 2026-10-26 (§12); review |
| **P1 · CR1 comparison** | `garden.style`, the Grown-up notes choice with preview, Field Journal tokens and frame copy on two surfaces: the Home parcel area (frame only; spec 120 text unchanged) and one café turn (guest arrival and thanks lines, supper eyebrow and progress line, receipt). Acceptance from the audience proposal: switch mid-order including the arithmetic stage, reload, explorer switch, export and import, keyboard, touch, 320 and 820 widths, read-aloud, reduced motion, synthetic before/after records showing no evidence writes | Bounded implementation spec reviewed; the café and Home strings involved have passed their Push C pass |
| **P2 · Try it** | The owner watches real play at home and decides: continue, adjust, or stop. Nothing about who chose what goes on GitHub, and the game records nothing beyond the preference | P1 deployed |
| **P3 · Field Journal across the shell** | One surface per PR: Home map and All places, Keeper's Pages, Post Office, Garden, Keeper's Desk chrome, then the rest of the Café. Each PR lists the frame strings it varies and the colors it tokenizes | Owner says continue after P2 |
| **P4 · Receipts and character art** | The receipt motif family (stamps, filed pages, map pins) and Field Journal drawings of every guide and avatar together; film end-card frames | P3 covers the surfaces where these appear |
| **P5 · Mystery & Adventure decision** | A narrative review of the candidate against spec 120 §11, then either a P1-sized comparison or a recorded decision to drop it | Owner call after P3 shows upkeep is manageable |

Stop rule: if Field Journal coverage starts lagging new games so far that most new surfaces show Storybook inside a Field Journal shell, or if variants keep failing Push C review, pause styles and record why. A style that cannot be kept up is worse than one good look.

## 10. Evaluation without data

Browser checks cannot tell which style children prefer, and the game will not count. Evidence comes from the owner watching play: does a child choose, switch, stay; does a page feel too busy or too bare; do help buttons stay easy to find. Ask players "Which look do you want today?" and never "Which one is for you?" No telemetry, no switch counts, no notes about real children in the repository.

## 11. Upstream overlap (AGENTS.md)

Refreshed 2026-10-26: Jane `286300f822944b8c039d5ea8d483a6cb52759f51` (`LESSONS.md`) and Marble `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` (`data/teaching-research.json`, `data/topics.json`). Design study only; no Jane or Marble code, prose or assets are incorporated, and research text is paraphrased.

**Jane.** Jane has the closest prior art: in its market a learner can pick a **story theme** (pirates, space, dungeon, jungle, ocean, dinosaurs, detective, sports) that sets the next quest's title, hook, stage names and intro stories while the topics stay fixed, and the pick is honored at the next new quest rather than by rewriting stages already reached.

- *Adopted as design reference:* the learner chooses; a theme changes the story world around fixed topics; a choice never rewrites reached work. Here that becomes "frame changes, task and story stay" (§3) and "a pending task is frozen across a switch" (§6). Jane's writing style (second person, short, one idea per prompt, never naming the learner) already matches spec 120 §8 and applies in every style.
- *Not adopted:* buying themes with points; many small themes (§4.4); reading levels from a configured learner grade; bosses, medals, gates or mastery; filling in the learner's name.

**Marble.** Marble's per-topic teaching research is about teaching moves, not looks, but it bears on one boundary. Several records treat the context of a task as part of how the idea is taught: reading an answer back into the story it came from (`mt_fLOkq-HfPB`); teaching negative numbers through temperature, sea level and money (`mt_1KkvzwYxbR`, `mt_RVK655t391`); and treating a narrative or role-play as a motivating complement while the core links are practiced directly (`mt_NZHFcEtTyI`). That supports §3's rules 1 and 2: a style may revoice the frame but never swap the context a task's teaching relies on. Marble's age bands are reference metadata and are not used to choose or suggest a style.

**Prerequisite crosswalk.** Not applicable: this spec teaches no topic, so it adds no topic references, coverage claims or prerequisite edges, and changes nothing in `curriculum/marble/`. Any future style-specific teaching content (there is none planned) would need its own crosswalk.

## 12. Owner decisions

Answered by the owner on 2026-10-26.

| # | Question | Decision |
| --- | --- | --- |
| O1 | Should story text (spec 120 scenes, pages, letters) ever differ by style? | **Not at first.** Phases 1 to 4 vary the frame only. Authored scene variants stay possible someday, through the route in §5.3 (amend spec 120, keep §8.1's events and jokes, same story review) |
| O2 | Where is the style chosen? | **Grown-up notes with a child-readable preview** for phase 1, as §6 says. A child-reachable switch can be reconsidered after phase 2 |
| O3 | What happens to Mystery & Adventure? | **Keep it as a later candidate** (phase 5). The owner expects it to need text changes, so its phase-5 review must also decide whether it needs authored story variants under O1 |

## 13. Acceptance for this planning increment

- Every style element in §4 is classified against §3's layers, and nothing in the task, story or record layer varies by style.
- No sentence ties a style to an age, gender, band, route, act or arrival.
- §5 states the interaction with challenge bands, spec 118, spec 120, spec 49, Push C, films and representation.
- §9's phases each have a finish line and a gate; none bypasses the owner priority order.
- Jane and Marble revisions are recorded, with what was adopted and what was not.
- No real child's name, age or data appears anywhere.

## 14. Boundaries

Offline, local, per explorer. No demographic, name, age, grade or free-text profile field. No locks, timers, scores or inferred ability. A style is never learning evidence and never changes a saved result. Every destination stays open in every style. New capabilities follow the independent specification and implementation review gates before release.
