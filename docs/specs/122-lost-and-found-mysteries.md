# 122. The Lost and Found Board: deduction mysteries

Status: **proposed; awaiting independent spec review.** Part of the [new kinds of play proposal](../new-game-kinds.md). Fits Acts II and IV of [spec 120](120-keeper-of-the-ways.md). Every clue, note and message is in [the companion text](../content/122-lost-and-found-text.md); this spec holds the rules, the checker and the saves. Code and art are for the implementation pass.

## Purpose

Small town mysteries solved with a logic grid. A note says something went missing or something odd happened; witnesses leave short notes; the child sorts what each witness **saw** from what they **think**, then crosses out possibilities on a grid until one answer is left, or until it is clear the clues don't decide yet.

The mysteries teach careful reading, inference, elimination as a method, observation versus interpretation, and, for older explorers, weighing a source that might be wrong and writing clues that lead to exactly one answer.

## Place and story

Dot, as postmaster, keeps a **Lost and Found Board** in Willow Post Office. After the storm, things are borrowed, moved and mixed up all over town, and people pin notes to the board. Route: `#post/lost-and-found`, linked from the `#post` hub and from the market scene in Act II. Open from the start. A kept mystery attempt or note, with unresolved work allowed, is a contribution to Act II, chapter 1 (the weekly market) for mysteries 1 to 4.

Mystery 6, *The wet corner*, belongs to Act IV, chapter 2 (spec 120 §8's Seedling job) and counts there.

## How a mystery works

1. **The board note.** What happened, in two or three sentences, with a picture.
2. **The witness notes.** Short notes, one per witness, each a sentence or two. Some sentences are things a witness saw; some are what the witness thinks.
3. **Sort the sentences.** The child drags or taps each sentence into **I SAW** or **I THINK** (older mysteries add **I HEARD**). Preserve that choice as the child's response. **Why?** explains the authored sort after the choice and before the clue card is used; viewing it is support. The solver uses the reviewed, tagged clue predicates below, never the child's sort as executable evidence. A guessed I SAW cannot become trusted; an observation marked I THINK is not removed. The child can skip sorting; show the authored sort and record support. Only explicit set-aside actions change the solver's active clue set.
4. **The grid.** Rows are people (or baskets, or trails); columns are things and places. The child marks cells **yes** or **no**. Marks belong to the child: the game never fills, corrects or removes a mark on its own.
5. **Can we tell yet?** Clues for `ladder` and `stalls` arrive in two rounds. After the first round the child is asked whether the clues decide the answer yet. Choices: *Yes, I know who* · *Not yet: it could be more than one way*. The second fits and gets a short why; the first opens **Show me another way that fits**, which displays a second arrangement that fits every clue so far.
6. **My answer.** The child sets one answer per row, using every thing and place exactly once. **Does it fit?** first asks for missing or duplicate assignments to be resolved, then checks the authored active predicates and names the first broken clue in clue order. Answers can be changed freely. Neither incomplete assignments nor grid marks become extra solver constraints.
7. **The reveal.** A short scene where the person involved explains. The I THINK sentences are then looked at again: "Pip thought Bramble took the ladder. Was he right?"

No timer, score or lock. A mystery can be left and resumed with its marks.

## The mysteries

| ID | Title | Grid | Clues | Teaching focus |
| --- | --- | --- | --- | --- |
| `ladder` | Who borrowed what? | 3 people × 3 tools × 3 places | 4 (a round of 3, then 1) | First grid; an I THINK that turns out wrong; *still open* after three clues |
| `baskets` | Three baskets | 3 baskets × 3 contents × 3 destinations | 3 | "Not apples and not wool" leaves one option |
| `trails` | Trails in the mud | 3 trails × 3 walkers × 3 ends | 3 | Paw prints, boots, the courier's tracks; observation words |
| `stalls` | The market row | 4 traders × 4 goods × 4 places in the row | 5 (rounds of 3 and 2) | Order clues ("just before", "at an end"); 4 × 4 grid |
| `prints` | Muddy prints | 4 visitors × 4 boots × 4 places | 5 plus one secondhand clue | A source that might be wrong; I HEARD; clues that can't all be true |
| `wet-corner` | The wet corner | No grid | 3 neighbor notes | Sort, then more than one explanation and what would tell them apart (Act IV) |

**Authoritative finite source.** Each arrangement is two bijections from rows to things and places. `T(row)` is its thing; `P(row)` its place; `rowWith(thing)` is the unique row assigned that thing. The following ordered clue IDs are the only solver predicates. Board introductions, pictures, Why? lines, guesses and reveals supply no extra constraints, even when they repeat a clue. Setting a clue aside must not silently retain it through board flavor. Show children: **Only the cards in Clues are used to check an answer.** Freeze these predicates, order and rounds with the case source.

| Case | Ordered clue IDs and predicates |
| --- | --- |
| `ladder` | `roof`: P(miller)=mill-roof; `rope`: P(rowWith(rope))=footbridge; `pip`: P(Pip)=orchard; round 2 `ladder-roof`: P(rowWith(ladder))=mill-roof. |
| `baskets` | `apples`: P(rowWith(apples))=cafe; `blue`: P(blue)=post-office; `yellow`: T(yellow)=seeds (no-apples/no-wool is one compound clue). |
| `trails` | `fox`: T(A)=Pip; `end-c`: P(C)=footbridge; `courier`: P(rowWith(courier))=bakery. |
| `stalls` | `baker`: P(baker)=1; `miller`: P(miller)=3; `seeds`: T(orchard-keeper)=seeds; round 2 `lanterns`: P(rowWith(lanterns)) is 1 or 4; `baskets-before`: P(rowWith(baskets))=P(miller)-1. |
| `prints` | `dot`: T(Dot)=no-boots; `yellow`: P(rowWith(yellow-boots))=orchard; `library`: P(Pip)=library; `bramble`: T(Bramble) is not yellow-boots; `red`: P(rowWith(red-boots))=post-office; secondhand `magpie`: T(Pip)=red-boots. |

**Independent enumeration, 2026-10-23:** every grid case has one answer using its complete trusted set. Removing each trusted clue in the order above gives ladder `2,2,2,2`; baskets `4,4,4`; trails `4,4,4`; stalls `4,4,8,2,6`; prints `8,6,8,2,4`. Thus each trusted clue is needed in that exact abstraction. Ladder round 1 has two answers (four after the first two clues); stalls round 1 has twelve. Prints with magpie added has zero. Removing one clue from that six-clue set gives `0,0,2,0,2,1`: library or red removal leaves two, magpie removal leaves one, other single removals leave none. Future implementation checks must reproduce these counts from the same source; this is not proof of implemented behavior.

## The secondhand clue

In `prints`, the magpie repeats something it heard. With it, no arrangement fits. The child is told: *These clues can't all be true. Which one would you set aside?* Each clue can be set aside in turn. The library sign-in book was written on the day; the magpie repeats words heard somewhere, sometime. Removing magpie leaves one answer, library or red leaves two, and dot, yellow or bramble leaves none. Multiple set-aside cards use their actual computed count, not a one-card canned reply. The reveal confirms the answer with magpie set aside.

## The wet corner (Act IV)

Three neighbors write about the low corner of the orchard that is always wet now. The child sorts each sentence into I SAW and I THINK. The game then asks for explanations: the child picks from five supplied explanations (and may add one in their own words) and, for each chosen explanation, picks what could be checked to tell it apart from the others, from a supplied list. Nothing is graded. The page ends with *Which check would you do first, and why?*, free text, kept with the Keeper's Pages if the child chooses. Several explanations are reasonable; the page says so.

The wet-corner weather categories can compare how many logged days were marked rainy, not rainfall amounts or a whole year's wetness. A measured rain-gauge record would be separate evidence. Wetness through a dry week shows persistence only: held rain, slow drainage, a spring and several causes together remain possible. No supplied check isolates a cause by itself.

## Write a mystery (older depth)

A builder for the child's own 3 × 3 or 4 × 4 mystery: name the rows and columns from word lists or own words, choose the true answer, then add clues from templates:

- *{row} has {thing}.* · *{row} does not have {thing}.*
- *The one with {thing} went to {place}.* · *The one with {thing} did not go to {place}.*
- *{row} went to {place} or {place}.*

**Check my clues** counts every arrangement that fits and reports one of: *These clues can't all be true* · *Exactly one answer: a fair mystery* · *Still open: {n} ways fit*. With one answer, **Which clues are needed?** marks any clue whose removal still leaves one answer. A kept mystery appears on the board for the explorer to give to a sibling on their own explorer, by reading it aloud or copying it. Nothing is shared by the game.

The checker runs over at most 4! × 4! = 576 arrangements, so it needs no clever solving.

## Saved work

Optional root `mysteries` per explorer, absent until a mystery is opened:

```
mysteries: {
  cases: { [caseId]: {
    source, sort: { [sentenceId]: 'saw' | 'think' | 'heard' } | 'skipped',
    marks: { [cellId]: 'yes' | 'no' },
    round: 1 | 2, tellYet: 'yes' | 'not-yet' | null,
    setAside: [clueId], answer: { [rowId]: [thingId, placeId] } | null,
    revealSeen: bool, explanations: [explanationId], checks: { [explanationId]: checkId },
    ownExplanation: string, firstCheck: check | null, earlier: [case], at
  } },
  written: [{ rows, columns, answer, clues: [clue], at }]   // latest 6
}
```

- `source` is the complete understood frozen case payload: case ID/model version, row/thing/place definitions, witness sentences and their authored roles, clue semantics/order and round boundaries, choices/order, teaching/help/feedback, reveal and the wet-corner explanation/check cards. Cap a new source at 32 KiB UTF-8, four rows/things/places, 32 witness sentences and 32 clues. It is a finite mystery source, not arbitrary executable constraints or a new catalog service. This implements spec 83's own-source preservation rather than treating a version number as stored text.
- Validate IDs/linkage, finite counts and stored outcome shapes against the saved source, never today's catalog or answer key. Preserve raw unknown cell/sentence/clue IDs and harmless fields exactly; supported views may omit unsupported controls with an unavailable notice but must not replace the original with a filtered object. An unsupported source makes only that case read-only/exportable. Marks, sorts, reveal state and prior check outcomes are never corrected, completed or regraded by loading.
- Keep the first explicit check's frozen source, input, support and result once. Later checks show current feedback without building a check ledger; edits do not rewrite the first attempt or clear support/reveal flags. A readable fresh case replaces the working draft after disclosure, retaining firstCheck and support/reveal latches; only unreadable/unsupported entries need recovery `earlier`.
- Written mysteries retain their own rows, columns, chosen answer, template clues, model version and recorded solution count/needed-clue result. Use 3 or 4 rows, at most 32 clues, and at most 2,000 characters per free-text answer (80 per authored label). Keep the latest six readable written mysteries only on an explicit keep with replacement disclosed; unreadable entries are not evicted.
- New sources, checks, keeps and fresh-version retention preflight the complete notebook and actual pretty `notesReport` through existing `prepareProgressImport` byte/depth/node limits. Refusal leaves all previous data unchanged and offers Download notes. Normal export/import retains the raw optional root; reset, save-off and explorer switching use existing notebook behavior. No new migration framework is required.

## Curriculum fit

**Strands** ([six-act strands](../six-act-strands.md)): **E3-I** explicit detail versus inference; **E3-II** monitoring and causal links; **E3-IV** relevant and sufficient evidence (Can we tell yet?, the secondhand clue); **S1-I** observation versus interpretation; **S1-IV** alternative explanations (the wet corner); **H1-II** check accounts against one another; **M7-II/IV** check and revise, counterexamples (Show me another way that fits); **E4** writing clues for a reader.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Separate what someone saw from what they think; eliminate possibilities from clues; say whether the clues decide; weigh a source. |
| Teaching encounter | The first mystery's sort with every Why? shown, then a worked first clue on the grid (companion text). |
| Contrast | I SAW and I THINK; decided and still open; a written record and a repeated rumour. |
| Supported practice | Why? on each sentence; the pre-sorted option; Show me another way that fits; Does it fit? naming a broken clue. |
| New application | A 4 × 4 grid; order clues; the wet corner's explanations; writing a mystery. |
| Purposeful revisit | Act IV's newspaper pages (spec 120) use the same I SAW and I THINK frame; the Keeper's Desk cases (spec 118) reuse the secondhand-source question. |
| Data boundary | Sorts, marks, answers, chosen explanations, free text, and written mysteries, all local. No names collected; a written mystery's words stay on the device. |

## Upstream check

Refreshed 2026-10-23: Marble `f186a79a9525c189e2d423e31613c62b6805416f`, Jane `1927912b8d9cd4f7df6e7fbe8416521194743060`.

| Topic | What the research asks, and how this spec does it |
| --- | --- |
| Observation vs Interpretation (`mt_Hw70LI5xza`) | Label interpretation rather than avoid it; affirm that thinking about why is valuable; use a consistent two-word frame (*I SAW* and *I THINK*); show one observation with several interpretations; pair recognition with the child's own sorting. The sort uses that exact frame, the Why? lines say an I THINK sentence is a good thought to check, and the wet corner shows one sight with several explanations. |
| Could there be another explanation? (`mt_QrVF5n7vci`) | Success is generating two or more plausible alternatives and recognising more evidence is needed; link each alternative to a check; use everyday mysteries with real alternatives; a fixed reveal is only a primer. The wet corner asks for several explanations, a check for each, and ends with no official answer; the grid mysteries' Can we tell yet? asks whether evidence is sufficient. |
| Inference vs Explicit Meaning (`mt_lp3qyEujIv`) | No teaching-research record yet. The topic description matches the sort and the reveal's look back at each I THINK. |

Jane's three-choice question style is used for Can we tell yet? and the guess step in the explains-style reveals. Its points and medals are not adopted, and no Jane code or text is used.

### Hard-prerequisite crosswalk

| Target | Hard prerequisite in `curriculum/marble/dependencies.json` | How it's met |
| --- | --- | --- |
| Observation vs Interpretation (`mt_Hw70LI5xza`) | None hard (soft: Feeling of not understanding) | Nothing to meet. |
| Could there be another explanation? (`mt_QrVF5n7vci`) | Changing Your Mind with Evidence (`mt_obF-6VYRya`) | Same unit: each grid mystery's reveal asks whether the I THINK sentence was right, and the secondhand clue asks the child to change a conclusion when a source is set aside. Spec 120's Act IV meeting, where someone changes their mind because of evidence, is the later lesson. |
| Inference vs Explicit Meaning (`mt_lp3qyEujIv`) | Monitoring Comprehension (`mt_GugVunb2lI`) | Partly: Can we tell yet? asks the child to notice when they don't yet know. No topic claim. |

## Checks for implementation

- A brute-force test over every arrangement confirms the counts in "The mysteries" above, for each round and with each clue removed.
- The game never changes a child's grid mark. Clearing marks needs **Clear my marks** and a confirmation.
- Show me another way that fits shows an arrangement that fits every clue in the current round and differs from the child's current answer if one is set.
- Does it fit? names the first broken clue in clue order and never reveals the full answer.
- Write a mystery reports 0, 1 or many arrangements correctly for 3 × 3 and 4 × 4, and the needed-clue marks are correct.
- Browser at 320 and 820 px: the 4 × 4 grid fits without horizontal scrolling, with a list mode ("Bramble and the maps: yes / no / not sure") as an alternative to tapping cells.

## Review asks

- Predicate boundaries, exact clue-removal counts and limited evidence checks are repaired in the proposal. Implementation and subject-content gates remain open.

- Are the secondhand clue and the wet corner right for Act IV's older players, and gentle enough for younger ones who meet them early?
