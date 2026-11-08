# 603 · The Town Has Two Stories: chapter 3, the Gazette's two explanations

Proposed 2026-11-08 by Claude (OCA seat). Base inspected: `44cd441d`, the head of [602](602-act-four-meeting.md)'s branch, on which this is stacked (602 itself is stacked on [601](601-act-four-orchard.md)). **Specification and a bounded build, not release clearance.** The finite text is in [the 603 companion](../content/603-act-four-gazette-text.md); the chapter text, Keeper's note, headlines and kept line come from the reviewed [act-4.md](../content/120-story/act-4.md) chapter 3. It follows [352](352-act-four-opening.md) and 601 everywhere this spec does not say otherwise. Numbered 603, outside the run Codex uses for new benches.

**Commission.** The owner, 2026-11-07 and 08: "do a deep dive into the Learning Garden and do some creative work. Build animations, story beats, games, and lessons. Identify big picture stuff and spec, build, and PR it." With 601 and 602, this completes Act IV's four chapters. Roadmap lane B (LG-G2).

## Purpose and boundary

1. **Chapter 3, *The newspaper's two explanations, and what other places did*,** at `#almanac/two-stories/gazette`: the chapter text at both frame amounts, the Keeper's note and read-aloud, as chapters 1 and 2 have.
2. **An animated front page of the *Willowbank Gazette*:** the masthead and the two headlines side by side, JUST A BAD STORM, SAYS MILLER and WE MADE IT WORSE, SAYS LIBRARIAN, as the librarian printed them. Neither is marked right. The page settles and the headlines appear within about three seconds; reduced motion shows it set.
3. **A chapter reader that takes the Travelers' Archive's kept reply** (the Sprout job's host, *Paris 1910*), by its pack id.
4. **After an offer,** the script's kept line and one new guide line. The pinned guess stays pinned; the guide is still checking it ([366](366-guide-changes-their-mind.md)).
5. **A way back from the Travelers' Archive** once Act IV has started.

Out of scope, each a separate commission: chapter 3's Seedling job (an Exhibit Label pack for the Paris photograph; the Label Maker has only its writing-board case today), the Sapling job (a Source Trail pack for the Gazette's two headlines), the Valencia Keeper's Desk case, and the Dutch archive pack. That pack is what the ending's miller line needs, so 602's mind-change order is unchanged: this slice ships no Dutch pack, and the miller's line still waits.

Offering a reply is story progress, not a curriculum milestone or a learning measure.

## Chapter 3 reader (saved-shape research, 352)

- **Artifact.** `travelersArchive.kept`, written by `keepArchiveReply` as `{packId, reply, sources, support, reading, familiar, checks, notice}`. Each keep replaces it. The receipt names only the pack, so a later keep never changes what was offered.
- **Identity.** The pack id. The archive keeps one reply per root, so `{packId}` names it.
- **Validator.** A snapshot check in `act-four-core.mjs` that mirrors the archive's own catalog-free checks, for the fields the story needs:
  - a pack id;
  - a reply with exactly its three coded fields (each empty or a saved id) and a text field that is a string;
  - at most sixteen source snapshots with unique saved ids. None is fine: the archive allows it.

  Fields the story never uses (support, reading, familiarity, checks) are not gates. The reply's free text is **never read, shown or copied**: not in a label, a receipt, a render or Notes. Nothing is compared with today's pack, sources or answers.
- **Reading.** The reader is pure and reads `state.travelersArchive` directly. A root that is not a version-1 object with a `kept` field is unreadable and offers nothing. `kept:null` means nothing is kept yet. A kept reply that fails its snapshot check is reported as retained-unreadable and left exactly as saved.
- **Candidate.** One at most, key `JSON.stringify(['gazette',packId])`. It is labelled *Kept archive reply: {pack}* with today's visit label for a known pack (*Paris, 1910*), or *Kept archive reply from an earlier version* for a pack today's archive doesn't know.

## State

As in 352 and 601. A chapter 3 receipt is `{kind:'act-four-offer', version:1, chapter:'gazette', activity:'travelers-archive', artifactKind:'kept-reply', ref:{packId}}`, validated by shape only: a nonempty pack id of at most 160 characters and no other ref key, never matched against today's pack. `actFourLiveChapters` becomes `['account','orchard','gazette']`; `meeting` still has no receipt, since chapter 4 keeps a plan (602). The first receipt counts once, a repeat is a no-op, an unreadable receipt is never replaced, and host removal or a later keep never revokes it. The receipt counts towards 602's ending condition: work in any two of chapters 1 to 3. The Notes line names chapter 3.

## Presentation and integration

- `act-four-content.mjs` gains a `gazette` block.
- `act-four-core.mjs` gains the archive reader and validator.
- `act-four-ui.mjs` renders chapter 3 with the other reading chapters, through one `offerChapter` whitelist (`orchard`, `gazette`, else chapter 1) that also keys selections, notices and the return link.
- `act-four-gazette-art.mjs` draws the front page, and `act-four.css` animates it.
- `app.mjs` changes one line: the archive render appends `actFourReturn(state,'gazette')`, which is empty until Act IV starts.
- The hub lists all four chapters, in order.
- The scene is an `svg role="img"` with a description that reads both headlines, and a caption.
- 44 px targets, 16 px text, visible focus, read-aloud of visible prose only, checks at 320 and 820.

## Upstream study and curriculum place

**Jane**, refreshed at `c681f6bf2f2adf2aa032f765983a4691774cfba5`, studied only, as in 352, 601 and 602. No Jane code, prose or assets.

**Marble**, refreshed at `04962c78ccb8bd52b236512d3362405bace98d2a`; the repository pin `96a7933754af672e1bfdbf7ecb05c325860c6e0d` is unchanged. Candidates only; no atlas mapping and no claim. Strands come from `curriculum/six-act-topic-plan.csv` ([six-act strands](../six-act-strands.md)); both sit in S1, scientific inquiry, and the chapter touches its Act IV family S1-IV (alternative explanations; revise claims). The Travelers' Archive owns its declarations.

| Topic | Strand | Why it is near |
| --- | --- | --- |
| Could there be another explanation? `mt_QrVF5n7vci` | S1 | Two headlines, two explanations; the guide's "Maybe they can. A bit." Not yet mapped. |
| Observation vs Interpretation `mt_Hw70LI5xza` | S1 | The Sprout job: what can you see in the 1910 photograph? Already declared by Rain Paths and the plant study. |

**Spec 49.** Act IV, evidence and disagreement. Chapter 3 adds no lesson; the Travelers' Archive owns the teaching. This chapter is the purposeful revisit (§5 step 6) that brings a kept reply into the town's argument. No free text is read (step 7).

**Hard-prerequisite crosswalk.** As 352 records: Could there be another explanation? ← Changing Your Mind with Evidence ← Observation vs Interpretation. 603 claims none of these, so none gates it.

**Spec 120.** Act IV chapter 3 and its jobs (§7, §8); the librarian as the Gazette's editor (§4); the archive's real history (§9). The Keeper's note drops the script's editorial parenthetical *(check each pack against its sources)*. That is an instruction to writers, not child-facing text; the three historical statements stay as written.

All new prose and the illustration are original project material.

## Gates and acceptance

Before build: an independent spec review of this spec and its companion.

Pure checks (`test/act-four-gazette-checks.mjs`, fixtures from the real Act IV and Travelers' Archive APIs; a fixture reply carries a private sentence the story must never read):
- No root, or nothing kept, offers nothing, and the page says so.
- A kept reply gives one candidate, named by its pack and labelled by the visit.
- The reply text never reaches a candidate, page or receipt. Reads and renders write nothing.
- A refused export writes nothing. An offer writes the pack-id receipt and leaves the archive unchanged; a repeat, or offering another pack later, leaves the first receipt exactly as it was.
- A later keep or removing the archive never revokes the receipt.
- A pack from another version, and a reply kept with no sources, are offered. Seven malformed snapshots are not offered and are reported (no pack id, a non-object or empty reply, a numeric coded field, non-string text, a source with no id, a duplicated source id). An unsupported root is unreadable.
- Receipt validation is shape only; nothing can be offered before Act IV starts.
- Chapters 1 and 3 with a plan can end the meeting, and with no chapter 2 rain result Pip changes his mind.
- Rendering: the hub links all four chapters. The Gazette is described with both headlines. The chapter links the archive and shows the kept line and the named guide line. Notes name chapter 3, and the archive offers the way back.

Existing suites still pass, with their reserved-chapter assertions updated: `act-four-checks` (chapter 3 routed; an unknown segment falls back; this companion added to its reviewed sources), `act-four-orchard-checks` and `act-four-meeting-checks`.

Browser journey (`test/act-four-gazette-browser.py`), at 820 and 320:
- The hub links chapter 3, and the chapter shows its heading, the described Gazette and both headlines side by side.
- The kept reply is labelled by its visit. 44 px targets and no overflow; reading writes nothing.
- Offering writes the pack-id receipt, shows the named guide line, leaves the archive unchanged and survives a reload. The archive offers the way back.
- Motion settles within five seconds; reduced motion shows the page set.
- With no kept reply, the chapter says so and shows no offer.

Physical iPad, Safari, VoiceOver and learning effects remain unqualified. This is followed by an exact-head implementation review and the repository's landing procedure.
