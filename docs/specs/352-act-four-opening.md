# 352 · The Town Has Two Stories: opening and chapter 1

Proposed 2026-11-01. Base inspected: `92dafbc`. This is the first bounded Act IV commission from [spec 120](120-keeper-of-the-ways.md) §§5, 6, 7 and 12, and the roadmap's lane B. **Specification, not implementation or release clearance.** The complete finite text is in [the 352 companion](../content/352-act-four-opening-text.md). It follows [326](326-both-ways-across-willow-bridge.md)'s Act III pattern, and through it [248](248-a-town-of-our-own.md)'s contribution, state and recovery contract, wherever this spec does not say otherwise. It does not restate those rules.

## Purpose and boundary

Act IV gets its start, its first page and its first chapter:
1. **Continue the story** after Act III, which starts Act IV and frees Page 4, *The year of the fine harvest*.
2. The Page 4 reveal, then the act's hook and opening.
3. An act hub with chapter 1, *The old map and Hollis's account*, live.
4. A chapter 1 reader that takes a kept evidence note from the built [ledger and rain gauge](246-ledger-gauge.md) case.

Page 4 sets the year the Sponge was drained beside the first big flood five years later, and Bramble says one does not prove the other. Chapter 1 is where the town asks "So how *would* we know?" The 246 case already teaches the comparison that answers it. This slice gives that work a place in the story without changing it.

As in 248 and 326, the explorer explicitly brings retained work to the story. The story never checks or scores it, and every activity stays open throughout.

Out of scope, each needing its own commission:
- Chapters 2, 3 and 4, their readers, and the meeting board (chapter 4), which 120 §12 lists as an unbuilt dependency.
- The ending, *The Map We Changed*, its mind-change lines, season line and almanac line. 120 §6 opens the ending only with a plan kept at the meeting, so it cannot ship before the meeting board.
- `story.plan`. Nothing in this slice writes or reads a plan. A plan chosen inside a 246 evidence note stays local to that case, as 246 requires.
- The chapter 1 jobs in [act-4.md](../content/120-story/act-4.md) (Travelers' Archive ordering, Two Windows, My Count Collection) and the Keeper's Desk Hollis-pages case. Their hosts would each need saved-shape research first; see "Later readers".
- Letters, the rain-gauge letter's delivery, and any Act IV arrival. 120 §10 gives Act IV no arrival point.
- Any change to 246's saved work, routes or preview notice.

Reaching the hub or offering a note is story progress. It is not a curriculum milestone or a learning measure.

## Start and routes

All routes stay inside the existing `almanac` family:

| Route | View |
| --- | --- |
| `#almanac/fine-harvest` | The Page 4 reveal, then rereading |
| `#almanac/two-stories` | The hook, the opening and the chapter list |
| `#almanac/two-stories/account` | Chapter 1. Any other chapter segment falls back to the hub without a write. |

Act IV may start once `actThreeView(state).pageVisible` is true, meaning the explorer has ended Act III and explicitly read Page 3. The companion's **Continue the story** appears under Page 3, after Act III's between-acts line and beside the existing **Pause here**, and on the Keeper's Pages. 120 §6 allows Page 4 to wait for a later visit after a pause. This slice does not add that wait: the invitation shows whenever Act IV can start, and a calendar date never changes readiness.

**Continue the story** is the explicit start. In one write it records `acts.IV.started:true` and the scene `harvest-page-revealed`, then opens `#almanac/fine-harvest`. That page shows the "When it comes free" line and the chosen Page 4 reading, then **Hear what the village says**, which opens the hub. The hub shows the hook, the opening at the chosen frame amount and the chapter list.

A readable `acts.IV.started` stays reached even if Act III or its page scene later becomes unreadable, as 326 does for Act III. A route alone never starts the act or reveals the page.

## Chapter 1 reader

Chapter id `account`. The reader is pure and follows 326's reader rules: it never initializes a host; it reads only the fields named here; it does not judge correctness or compare against today's catalog; an unreadable sibling is omitted and kept raw; labels are escaped and built from the companion and the saved identity.

| Host | What counts | Ref |
| --- | --- | --- |
| The ledger and the rain gauge ([246](246-ledger-gauge.md)), activity `ledger-gauge`, artifact kind `evidence-note` | Requires a `ledgerGauge` root that passes 246's wrapper check (`version:1`, `ledgerView(state).status` not `'unavailable'`). A visit key matches `ledger-N`, with N a positive safe integer, and its value is an object. Each of the visit's `firstKept` and `kept` is independently accepted by the exported `validLedgerKeep`, without requiring readable current work (`validLedgerWork`) or the other edition. `sourceId` is that snapshot's frozen `source.id`. | `{visitId, edition:'first'\|'latest', sourceId}` |

`kept` is the `latest` edition. When both editions are readable and their `JSON.stringify` forms are identical, only `latest` is listed, so one keep shows as one note. A note's chosen plan, writing and responses are never read, shown or copied. The ledger revision snapshots are not read in this slice.

Identity is visit id plus edition. Candidate keys are deterministic serialized address tuples, as in 248. The label shows the friendly kind, the visit number N and the edition from the companion, never an outcome or a plan.

A missing or unsupported `ledgerGauge` root shows the companion's "nothing ready yet" line and the Visit link. A host save alone creates no receipt.

### Later readers

The act's other chapter 1 hosts are built but are not read here. Before a later slice adds one, it needs the same saved-shape research 326 did: which saved artifact counts, its frozen identity and its exported validator. In particular, Two Windows and My Count Collection must name a kept artifact that does not depend on the explorer's free text for its label. Adding a reader to chapter 1 never changes the one-receipt-per-chapter rule.

## State

The story stays at version 1. Add an optional `acts.IV` object with known fields `started` and `contributions`, using 248's per-field readability and its preservation of unknown keys. `ended` and `season` are reserved for the ending commission. This slice never writes them and keeps any present value raw.

A receipt is `{kind:'act-four-offer', version:1, chapter, activity, artifactKind, ref}`. Chapter ids `account`, `orchard`, `gazette` and `meeting` are reserved for the act's four chapters, in that order. In this slice `validActFourOffer` accepts only `account` with activity `ledger-gauge`, artifact kind `evidence-note` and the ref shape above, shape-checked against its own activity and never against current host data. A later slice that adds a chapter extends the validator; this version keeps an unrecognized receipt raw and treats its chapter as unreadable, without blocking `account`.

As in 326:
- The first valid receipt for `account` counts once, and offering again is a no-op.
- An unreadable known receipt cannot be replaced.
- Host removal or later edits never revoke a receipt.

New scene: `harvest-page-revealed`. Pages remain derived, as 120 §12 requires. Page 4 is visible when `acts.IV.started` is readable and true and the scene is present. If the act is started but the scene is missing, the hub offers **Read the fourth page**, which records only the scene. Page 4 uses the existing `story.pageAmount` (Short, Longer, or Hollis's page) and the hub and chapter use `story.frameAmount`. No new preference, root or transfer membership is added. The existing setters' eligibility extends to Act IV: frame controls work once Act IV can start or is started, and page controls once Page 4 is visible, even when an earlier act is unreadable. Changing an amount never starts the act or records a scene.

Mutators take the options-last `{canExport}` convention:
- `startActFour`: records `started:true`, an empty `contributions` when absent, and the scene, in one write.
- `revealHarvestPage`: records the scene only, when the act is started.
- `offerActFour(chapter, key)`.

Pure views:
- `actFourView`, with `canStart`, `started`, `pageVisible`, `chapterStatus`, `contributions` and the source views, mirroring `actThreeView`.
- `actFourCandidates(state, chapter)`.
- `validActFourOffer`.

Every growing write follows 248's whole-notebook clone, `recoveryFitsProgressLimits` and real Notes preflight before committing only `state.story`. A refusal leaves every byte unchanged.

## Presentation and integration

The new modules are `act-four-content.mjs`, `act-four-core.mjs`, `act-four-ui.mjs` and scoped CSS, using the Keeper palette. No new still or film ships in this slice. `{guide}` resolves read-only as in 248.

Integration points:
- Thread the three routes through the almanac renderer, and through 248's welcome-film and stale-owner guards.
- Add **Continue the story** under Page 3 and on the Keeper's Pages once Act IV can start.
- Add Page 4 to the Keeper's Pages list once visible.
- Add a small **Bring work to The Town Has Two Stories** link on the 246 case page once Act IV has started. That link changes nothing in the host.
- Add Act IV to the Keeper Notes section, keeping receipts separate from learning evidence.
- Add the README line.
- Make no atlas or coverage change.

The layout rules are those of 248: 44 px targets, 16 px text and visible focus; one stage at a time; read-aloud of visible prose only, with speech stopped on navigation; checks at 320 and 820.

## Upstream study and curriculum place

**Jane**, refreshed at `e88f81a00553fb87818ef84c77a8800f0dcb33e4` (unchanged since 326 and 344), studied only. This slice keeps the shape 326 took from `LESSONS.md`: a story hook, then a path of finite stages, with a reached beat that stays reached. It does not adopt review gates, bosses, medals, or age or mastery locks. No Jane code, prose or assets are copied.

**Marble**, refreshed at `5e23196fa60050433f1440057f65a978d39e63fc`. The repository pin `96a7933754af672e1bfdbf7ecb05c325860c6e0d` is unchanged. These are candidates, not coverage claims, and there is no new atlas mapping:

| Topic | Strand | Why it is near |
| --- | --- | --- |
| Correlation vs Causation `mt_X0Tr8IYaEd` | Scientific Inquiry | Page 4 and chapter 1 are a correlation in time (drained in year 22, flood in year 27). The 246 case does the comparison; reading the story does not perform the topic. |
| Could there be another explanation? `mt_QrVF5n7vci` | Scientific Inquiry | Bramble's hat-and-boots line and the Keeper's note ("ruling out other causes, such as wetter years"). |

The upstream teaching research for `mt_X0Tr8IYaEd` asks for three things to check before claiming a cause (a hidden common cause, coincidence, reversed direction) and links a real cause to a fair test. The story matches the first two: Bramble's wet hat and boots share a common cause, the rain, and the Keeper's note asks for a pattern that holds more than once. Reversed direction does not arise, since the flood came after the draining. The note's "a reason it could (a mechanism)" points ahead to chapter 2's model and fair test, which a later slice owns. Upstream's Geography topic Managing natural hazards `mt_9wfokahWw6` is near the whole act but is absent from the pinned graph, so it is recorded only as a future candidate.

**Spec 49.** This is Act IV, *The Town Has Two Stories*: evidence and disagreement. 49 introduces the act with "an unexpected observation or conflicting account", which Page 4 supplies. In 49's teaching contract (§5), 352 adds no lesson. It serves as the purposeful revisit (step 6) for 246, which owns the teaching encounter, contrast and practice for comparing the records; 49's "explicit lessons teach these operations before the larger dilemma relies on them" is met because 246 is built and open before this slice. On the data boundary (step 7), 352 adds no free-text field. Receipts hold only ids, versions and codes, and copy no free text.

**Hard-prerequisite crosswalk** against the pinned `curriculum/marble/dependencies.json`. The hard closure of `mt_X0Tr8IYaEd` is three edges: Correlation vs Causation ← Could there be another explanation? `mt_QrVF5n7vci` ← Changing Your Mind with Evidence `mt_obF-6VYRya` ← Observation vs Interpretation `mt_Hw70LI5xza`. The upstream closure is the same. In `curriculum/topic-coverage.csv` the first three are *not yet mapped* and Observation vs Interpretation is a *scoped practice reference* (plant study). 352 claims none of these topics, so none of them gates it. A later lesson that claims one must teach or check its hard prerequisites.

**Spec 120.** Page 4's place in the run of pages (§5), the pause between acts (§6), Act IV's chapters and ending rule (§7) and the state sketch (§12). 120's 246 boundary says later page availability and meeting or plan adapters are owned by 120; this is that adapter for chapter 1 only. The 246 preview notice ("Reading or keeping a note here does not move the story on") stays true: keeping a note does nothing to the story, and only the explicit offer in chapter 1 does. Whether that notice's heading should change once Act IV has started is a 246 copy question, left to a separate change.

All new prose is original project material.

## Gates and acceptance

Before build:
1. An independent spec review of this spec and its companion.
2. No language panel is needed: the companion ships no non-English text.

Pure checks:
- The reader's positive case comes from the real 246 API (start a visit, keep a note, keep again after an edit). One keep yields one `latest` candidate; two different keeps yield `first` and `latest`.
- A kept edition still counts when the current work or the other edition is unreadable. A visit key that does not match `ledger-N`, a non-object visit, an unsupported root and a missing root are skipped, and the raw entries stay.
- A note's plan id, writing and responses never reach a label, receipt or Notes line.
- Repeated offers keep the first receipt. Host removal or later edits never revoke it.
- Malformed `acts.IV` fields behave per 248's matrix, and present `ended` or `season` values stay raw and unused.
- Act IV cannot start before Page 3 is visible. A route or scene alone cannot start it. Page 4 needs a readable `started:true` and its scene. `startActFour` writes both atomically, and `revealHarvestPage` repairs only a missing scene.
- Act IV reached on its own survives damage to Acts I to III, and its page and frame preferences stay usable there.
- An invalid chapter route falls back to the hub without a write.
- A receipt for a reserved but unread chapter is kept raw, shown as unreadable, and does not block `account`.
- Real-transfer refusal is atomic; renders and Notes make no write; every story action leaves `ledgerGauge` unchanged.
- Every shipped string and placeholder matches the companion or its named source.

Browser journeys at 320 and 820:
- End Act III, read Page 3, choose **Continue the story**, read Page 4 at each amount, then the hub.
- **Pause here** after Page 3, reload, and continue from the Keeper's Pages.
- Visit the 246 case, keep a note, return through **Bring work to The Town Has Two Stories**, and offer it.
- Reload, then check that Pages 1 to 4 stay readable.
- Stale controls, reset, saving off, a forced preflight refusal, and a Notes download and import of a started Act IV beside a fresh one, with reload, explorer switch and download again leaving both unchanged.
- Focus, target size, no overflow, the welcome-film guards, and read-aloud stopping on navigation.

Physical iPad, VoiceOver and learning effects remain unqualified until checked. This is followed by exact-head implementation review and the repository's landing procedure.
