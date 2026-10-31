# 326 · Both Ways Across Willow Bridge

Proposed 2026-10-31. Base inspected: `2457a2b`. This is the bounded Act III commission from [spec 120](120-keeper-of-the-ways.md) §§5, 7 and 12, and the roadmap's lane B step 5. **Specification, not implementation or release clearance.** The complete finite text is in [the 326 companion](../content/326-both-ways-across-willow-bridge-text.md). It follows [248](248-a-town-of-our-own.md)'s contribution, state and recovery contract wherever this spec does not say otherwise, and it does not restate those rules.

## Purpose and boundary

Act III gets its story path:
1. The opening.
2. Four chapters, each reading one built activity.
3. The ending, *Both Ways Across Willow Bridge*, on an explicit action once any three chapters hold a contribution.
4. Page 3, *The Ways*, with Nuria recognising Hollis's handwriting.

As in 248, the explorer explicitly brings retained work back to the story. The story never checks or scores it, and every activity stays open throughout.

Out of scope:
- The chapter jobs in [act-3.md](../content/120-story/act-3.md) (a reed-for-apples rate, word-card replies) and the Keeper's Desk case ideas.
- Léon's French letters, further letters, the Valencia teaser and Act IV.
- The anchor film. The still/text ending is the complete delivery; a future film (card LG-28) enhances this same ending and never decides eligibility.
- Any change to a host activity's saved work.

The ending is reached by story contribution. It is not a curriculum milestone or a learning measure.

## Start and routes

All routes stay inside the existing `almanac` family, beside 248's:

| Route | View |
| --- | --- |
| `#almanac/beyond` | The opening and the four chapter buttons |
| `#almanac/beyond/<chapter>` | One chapter at a time: `market`, `seeds`, `route` or `letters`. An invalid chapter falls back to the hub without a write. |
| `#almanac/both-ways` | The ending, after it is reached, with replay |
| `#almanac/the-ways` | The Page 3 reveal, then rereading |

Act III may start once `actTwoView(state).letterVisible` is true, meaning the explorer has explicitly opened the first upstream letter. That covers an explorer who ended Act II and one who arrived with the letter under [249](249-story-arrivals.md); the story text's "Continue the story after the Act II celebration" follows from it. The companion's invitation appears under the opened letter and on the Keeper's Pages. **Start** is explicit and records `acts.III.started:true`. A readable `acts.III.started` or `ended` stays reached even if the letter scene or an earlier act later becomes unreadable, as 248 does for Act II.

## The four chapter readers

Each reader is pure and follows 248's rules:
- it never initializes a host;
- it consumes only the identity fields named here;
- it does not judge correctness or compare against today's catalog;
- an unreadable sibling is omitted from the list and kept raw;
- a duplicated identity omits every entry that shares it;
- labels are escaped and taken from the frozen source.

| Chapter | Host and what counts | Ref |
| --- | --- | --- |
| `market` | The River Market's *La carga* ([324](324-river-market-cargo.md)). Requires `spanish.v:1`, read from `errands.carga` and each entry of `earlier`. An errand counts when its frozen source is readable, its `tryId` is a unique positive integer, and `taskEvidence.firstSubmission` is not null. A try that is still sorting counts. | `{tryId, amount}` |
| `seeds` | The seed exchange table ([316](316-seed-exchange-table.md)). Requires `seedExchange.version:1`. A visit key matches `exchange-N`, and each of its `firstKept` and `latestKept` is independently accepted by the exported `validSeedSnapshot`. Working plans count. | `{visitId, edition:'first'\|'latest', sourceId}` |
| `route` | Courier Clock Walk. `clockWalkView(state)` lists readable cases, and a case with a readable `kept` counts, whether or not it has a check. | `{caseId, sourceId}` |
| `letters` | The upstream post ([291](291-upstream-question.md)). `upstreamView(state)` must be ready, and each post whose `posted` is `{kind:'local-postbag-question', version:1}` counts. An opened reply is not required. | `{questionId, sourceId, sourceVersion}` |

Activities are named `river-market`, `seed-exchange`, `courier-clock-walk` and `upstream-post`; artifact kinds are `cargo-errand`, `exchange-plan`, `kept-walk` and `posted-question`. A chapter whose host root is missing or unsupported shows the companion's "nothing ready yet" line and its Visit link. That includes `market` until 324 is built, and nothing else is blocked by it.

## State

The story stays at version 1. Add an optional `acts.III` object, with known fields `started`, `contributions`, `ended` and `season`, using 248's per-field readability and its preservation of unknown keys. A receipt is `{kind:'act-three-offer', version:1, chapter, activity, artifactKind, ref}`. Its ref fields are shape-checked against its own activity and never against current host data. Act III follows 248 in four ways:
- The first valid receipt per chapter counts once, and offering again is a no-op.
- An unreadable known receipt can't be replaced, but the other chapters stay open.
- **Send the seedlings up the river** needs three distinct valid receipts and a started act. It records `ended:true` and the season once, using 248's `seasonForMonth`.
- A readable `ended:true` stays reached whatever happens to the receipts or hosts later.

New scenes are `both-ways-sent`, recorded with the first ending, and `ways-page-revealed`, recorded by **Read the third page** before Page 3 shows. Pages remain derived, as 120 §12 requires. Page 3 is available after a readable ended Act III, and visible after its reveal scene. It uses the existing `story.pageAmount`: Short, Longer, or the original as Hollis wrote it. The opening, chapters and ending share `story.frameAmount`. No new preference, root or transfer membership is added.

Mutators take the options-last `{canExport}` convention:
- `startActThree`
- `offerActThree(chapter, key)`
- `sendActThree(month)`
- `revealWaysPage`

Pure views:
- `actThreeView`
- `actThreeCandidates(state, chapter)`
- `validActThreeOffer`

Every growing write follows 248's whole-notebook clone, `recoveryFitsProgressLimits` and real Notes preflight before committing only `state.story`. A refusal leaves every byte unchanged.

## Presentation and integration

The new modules are `act-three-content.mjs`, `act-three-core.mjs`, `act-three-ui.mjs` and scoped CSS, using the Keeper palette. The ending's memorable element is one original still: seedlings going up the river path, a barge coming down, and Nuria at the flood post. Its prose equivalent and alt text are in the companion. `{guide}` and `{courier}` resolve read-only as in 248. Each host page gets a small **Bring work to Beyond Willow Bridge** link once Act III has started. That link changes nothing in the host.

Integration points:
- Thread the four routes through the almanac renderer, and through 248's welcome-film and stale-owner guards.
- Add Act III to the Keeper Notes section, keeping receipts separate from learning evidence.
- Add the README line.
- Make no atlas or coverage change.

The layout rules are those of 248:
- 44 px targets, 16 px text and visible focus;
- one chapter or stage at a time;
- read-aloud of visible prose only, with speech stopped on navigation;
- checks at 320 and 820.

## Gates and acceptance

Before build:
1. An independent spec review of this spec and its companion.
2. A spec 117 model-panel pass on the companion's two Spanish phrases, recorded beside [the 117 panel](../reviews/117-spanish-panel/resolution.md).

The build itself waits on 324 being built (card LG-29) only for the `market` reader's real-host tests. The other three readers can be built and tested first, with `market` showing its empty line.

Pure checks:
- Each reader's positive case comes from the real host API, as in 248's example. That covers a submitted but unsorted *La carga* try, a working seed plan, a kept walk without a check, and a posted question with no reply.
- Each reader skips a missing host, an unsupported version, a duplicated identity and an unreadable sibling, while the raw entries stay.
- Every three-of-four combination qualifies; zero, one or two do not.
- Repeated offers keep the first receipt.
- Host removal or later edits never revoke a receipt or an ending.
- Malformed `acts.III` fields behave per 248's matrix.
- Real-transfer refusal is atomic.
- Renders and Notes make no write.

Browser journeys at 320 and 820:
- Open the first letter, then start Act III.
- Visit three hosts and return through **Bring work to Beyond Willow Bridge**.
- Offer three chapters.
- Send the seedlings, reload, replay, read Page 3 at each amount, and check that Pages 1 and 2 stay readable.
- The letter-arrival path from 249.
- Stale controls, reset, saving off, a forced preflight refusal, and a Notes download and import of a partial Act III beside a complete one.

Physical iPad, VoiceOver and learning effects remain unqualified until checked. This is followed by exact-head implementation review and the repository's landing procedure.
