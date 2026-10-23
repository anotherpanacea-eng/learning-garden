# 122. The Lost and Found Board: deduction mysteries

Status: **proposed; awaiting independent spec review.** Part of the [new kinds of play proposal](../new-game-kinds.md). Fits Acts II and IV of [spec 120](https://github.com/anotherpanacea-eng/learning-garden/blob/claude/project-thread-zpfie6/docs/specs/120-keeper-of-the-ways.md). Every clue, note and message is in [the companion text](../content/122-lost-and-found-text.md); this spec holds the rules, the checker and the saves. Code and art are for the implementation pass.

**Commissioning boundary:** this remains a proposal. Select a bounded first slice after independent content/model/save review; the presence of later games, levels or designers does not commission them all. All Act/chapter links and contributions below are future adapters to the separately proposed spec120. Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter.

## Purpose

Small town mysteries solved with a logic grid. A note says something went missing or something odd happened; witnesses leave short notes; the child sorts what each witness **saw** from what they **think**, then crosses out possibilities on a grid until one answer is left, or until it is clear the clues don't decide yet.

The mysteries teach careful reading, inference, elimination as a method, observation versus interpretation, and, for older explorers, weighing a source that might be wrong and writing clues that lead to exactly one answer.

## Place and story

Dot, as postmaster, keeps a **Lost and Found Board** in Willow Post Office. After the storm, things are borrowed, moved and mixed up all over town, and people pin notes to the board. Route: `#post/lost-and-found`, linked from the `#post` hub and from the market scene in Act II. Open from the start. A solved mystery with its answer kept is a contribution to Act II, chapter 1 (the weekly market) for mysteries 1 to 4.

Mystery 6, *The wet corner*, belongs to Act IV, chapter 2 (spec 120 §8's Seedling job) and counts there.

## How a mystery works

1. **The board note.** What happened, in two or three sentences, with a picture.
2. **The witness notes.** Short notes, one per witness, each a sentence or two. Some sentences are things a witness saw; some are what the witness thinks.
3. **Sort the sentences.** The child drags or taps each sentence into **I SAW** or **I THINK** (older mysteries add **I HEARD**). Sorting is supported: **Why?** under each sentence explains the sort after a choice. A sentence sorted into I THINK is not used on the grid. The child can skip sorting; the clues then appear already sorted, marked as supported.
4. **The grid.** Rows are people (or baskets, or trails); columns are things and places. The child marks cells **yes** or **no**. Marks belong to the child: the game never fills, corrects or removes a mark on its own.
5. **Can we tell yet?** Clues for `ladder` and `stalls` arrive in two rounds. After the first round the child is asked whether the clues decide the answer yet. Choices: *Yes, I know who* · *Not yet: it could be more than one way*. The second fits and gets a short why; the first opens **Show me another way that fits**, which displays a second arrangement that fits every clue so far.
6. **My answer.** The child sets one answer per row. **Does it fit?** checks the answer against the sorted clues and names the first clue it breaks, if any. Answers can be changed freely.
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

**Checked by brute force over every arrangement** (2026-10-23; the implementation's tests repeat it): each grid mystery has exactly one arrangement that fits all its clues, and removing any one clue leaves more than one. After the first round, `ladder` has two arrangements (four after only two clues) and `stalls` has twelve. In `prints`, the five trusted clues have one arrangement; adding the magpie's secondhand clue leaves none; setting aside the magpie's clue restores exactly one, and setting aside any other single clue leaves none or two.

## The secondhand clue

In `prints`, the magpie repeats something it heard. With it, no arrangement fits. The child is told: *These clues can't all be true. Which one would you set aside?* Each clue can be set aside in turn to see what happens. The text helps the child weigh sources: the post office ledger is written down on the day; the magpie repeats words it heard somewhere, sometime. Setting aside the magpie's clue gives one answer, which the reveal confirms. Setting aside a trusted clue is allowed and shows the result honestly (no arrangement, or two).

## The wet corner (Act IV)

Three neighbors write about the low corner of the orchard that is always wet now. The child sorts each sentence into I SAW and I THINK. The game then asks for explanations: the child picks from five supplied explanations (and may add one in their own words) and, for each chosen explanation, picks what could be checked to tell it apart from the others, from a supplied list. Nothing is graded. The page ends with *Which check would you do first, and why?*, free text, kept with the Keeper's Pages if the child chooses. Several explanations are reasonable; the page says so.

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
    version, sort: { [sentenceId]: 'saw' | 'think' | 'heard' } | 'skipped',
    marks: { [cellId]: 'yes' | 'no' },
    round: 1 | 2, tellYet: 'yes' | 'not-yet' | null,
    setAside: [clueId], answer: { [rowId]: [thingId, placeId] } | null,
    revealSeen: bool, explanations: [explanationId], checks: { [explanationId]: checkId },
    ownExplanation: string, firstCheck: string, at
  } },
  written: [{ rows, columns, answer, clues: [clue], at }]   // latest 6
}
```

- `version` freezes the case text in use, following spec 83. A content change never alters a started case.
- Validate ids and counts. Unknown cell, sentence or clue ids are dropped on read without rewriting the save. Never recheck stored marks against the answer on load.
- Export, import, reset and explorer switching include `mysteries`.

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

- Are the secondhand clue and the wet corner right for Act IV's older players, and gentle enough for younger ones who meet them early?
