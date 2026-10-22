# Library read-alouds: a flood almanac at Lucie’s bookstall

Status: **revised proposal after bounded independent Codex specification review** (2026-10-22; [receipt](../../reviews/proposed-specs-2026-10-22.md)). Unnumbered: the builder assigns a spec number. Not built or build-ready; saved-visit repair, final content/source checks remain pending. Independent Claude specification review cleared the revised candidates recorded in the receipt. Source: strategy 3.5 and the corrected 3.6 plan in [the proposal](../../other-routes-through-the-acts.md).

## Purpose and story

The proposal names a knowledge route: short nonfiction books that an adult reads aloud. This first pack is text-only within the existing story-pack format. It carries talk prompts, and later play asks about what it taught. Background knowledge strongly affects comprehension (Recht & Leslie, 1988), and the prompts follow the shape of dialogic reading (Whitehurst et al., 1988). Both are design references only; this spec makes no efficacy claim for the app.

The pack itself is **content-only: no new engine, field or state**. But it is not build-ready against main until one bounded prerequisite repair to saved Paris visits lands (see the saved-state section). It uses the existing reviewed story-pack format ([spec 12](../12-reviewed-story-packs.md), [story packs](../../story-packs.md)): one new plain-data module, `dist/packs/flood-almanac.mjs`, registered in `parisPacks`. That format supports exactly one shape today: a Paris story at a known destination, with three passage lengths, one `mc` question, one `order` question with three items, optional `connections` and two helpers. The book lives at the existing **bookstall** destination (“Lucie’s bookstall”): Lucie lends a small almanac about the river.

**Topic and why.**
- **The Seine flood of January–March 1910.**
- The pack format is Paris-only, so a Paris topic needs no format change.
- The facts and the one CC0 photograph were already source-reviewed for the Travelers’ Archive ([spec 46](../46-travelers-archive-first-visit.md)).
- Weather & Climate is one of the 34 domains with no activity reference.
- Polar and ocean books are better second packs, but they need a non-Paris destination, which is a format change for a later spec.

**What the book is, and isn't.**
- This is real history in original modern summary, not a costume for the town story.
- It is not flood-safety guidance: no advice about water depth, evacuation or what to do in a flood.
- There are no casualty or fear details.
- No new historical claim enters without a primary source.

**This spec does not author the final prose.** It fixes the pack's shape, length limits, prompt types, fact boundary and review gates. Every word is written later and independently content-reviewed.

## Complete finite first pack

One pack, one story, stable new IDs. Pack id `flood-almanac`, story id `flood-almanac`, helper ids `flood-almanac-evidence` and `flood-almanac-sequence`. Released ids are never reused with a different meaning.

**Passages.** The compiler allows 1–20 sentences per variant, and there are no pages in the format, so length limits are set in sentences and words. Every sentence is at most 18 words.

The compiler shares the same two questions across all three variants. Before drafting variants, fix three distinct dated sentences for the multiple-choice question: the 28 January highest mark, the 9 February commission and the 15 March return. **Include all three sentences verbatim in every variant**, so every offered choice occurs exactly in the displayed passage. Their order may change: variant 3 puts the March sentence first. Each variant also includes a plain source-credit sentence and distinguishes real historical Paris from the imagined skyline of our town. These are passage sentences, not metadata or optional adult prompts.

| Variant | Sentences | Content it must carry |
| --- | --- | --- |
| 1 (short) | 6–7; at most 100 words | The three verbatim dated choice sentences, one sentence describing what the archival photograph shows at a single quay, one source-credit sentence, and one sentence distinguishing that real Paris view from our imagined town skyline. The three events appear in date order. |
| 2 (middle) | 8–9; at most 140 words | The same six required sentences, plus a bounded explanation of what one photograph cannot show and why the commission studied the flood, only as the source states it. The three events stay in date order. |
| 3 (long) | 10–12; at most 180 words | The same six required sentences and explanations, opening with the **exact March choice sentence** before the exact January and February choice sentences. The ordering question then needs dates, not mention order. |

**Permitted facts.** All are already sourced in spec 46's audit:
- the Austerlitz highest mark on 28 January 1910;
- the government commission on 9 February 1910;
- the Seine returning to its riverbed on 15 March 1910, with rail and metro services resuming (not a date when every street was dry);
- photograph PH8646 (Quai des Grands-Augustins, January 1910; Identité judiciaire; CC0 as labelled by the museum), with water, boats and buildings at one quay.

Anything else needs a new primary source recorded in this pack's source audit before it can appear. That covers rainfall amounts, a height figure, wooden walkways, animals, statues used as gauges, and named people. No figure is rounded or embellished.

**Image.** None in this first pack. The reviewed PH8646 record supports a textual sentence about one quay; no photograph, drawing, map, new asset or image field is added to the existing story-pack format.

**Question 1, `mc`** (`readingSkill`: find a sentence that answers a question about a detail).
- Prompt example: “Which sentence tells us when the river reached its highest mark?”
- Three choices are the three fixed dated sentences, copied verbatim from the passage displayed in **each** variant. Keep their supplied choice order frozen in a paused visit.
- The fitting choice is **not** at index 0 (use 1 or 2).
- The other two dated sentences are wrong for an evidence-specific reason, not for tone or length.

**Question 2, `order`** (`readingSkill`: order events using dates).
- Exactly three items in true chronological order: highest mark, commission formed, river back in its bed.
- The compiler supplies a stable shuffled display that is never already in order.

**Connections.** Each is a partial reference, to be confirmed by the source audit:
- `mt_6EfevRyeFW` Extreme Weather Events: one historical flood's dates only. Hurricanes, tornadoes, droughts, causes and forecasting stay unobserved.
- `mt_mLPEMpYb_R` Listening to Texts Read Aloud: a non-fiction text heard with an adult.
- `mt_VEwM7ClYYE` Story Sequence and Central Message: only how three items of information relate in time.

None of these is a mastery or coverage claim. Each `scope` string states what stays unobserved.

**Helpers.** These are the two smaller examples the format requires. Both are original and fictional, and neither uses flood content, so they never pre-teach the answer:
- an evidence helper: find the sentence with the time detail;
- a sequence helper: order three dated invented events, one sentence mentioning a later date first.

**Collectable card: not in this slice.** The pack format has no card field, and main has no collection engine. The book's keepsake is the existing pack visit and its Grown-up notes entry. A filed card needs a later spec once there is a home for it.

## Actions and contrasts

The learner listens or reads, then answers through the existing pack interactions: choosing a sentence, and tapping cards into ordered positions with remove and change. Three contrasts are built into the content:

1. **Date order versus mention order.** Variant 3 deliberately mentions March first, so the learner uses dates and order words, not sentence position.
2. **One photograph record versus the whole city.** The passage describes one real Paris quay; that source does not show every street, how deep the water was, or how people felt. Our town skyline is imagined, and the passage says so.
3. **A source versus our summary.** The book's wording is an original modern summary based on named sources, not a quotation. Every variant says so in its own source-credit sentence.

**Talk prompts: the adult's voice comes first.** The format offers three prompt slots: the story `invitation`, each question's `talk`, and each question's `hint`. Use them for three prompt kinds:

- **What** (recall, in the `invitation`): “What do you think a river does after a lot of rain?” This sets up the topic without needing an answer.
- **Why** (open-ended, in question 1's `talk`): “Why might people have used boats beside the buildings?” The answer is discussed with the adult, never graded.
- **What next** (a connection, in question 2's `talk`): “If our town's river rose, what would we want to know first?” This is a thinking prompt, not safety instruction. Reviewers must reject any wording that reads as advice.

Hints point back to the passage; they never give the answer. A fuller printed prompt card is out of scope, because the format has no field for it.

## Manageable turns, support and history

Everything is the existing Paris pack behaviour:
- the passage stays visible for both questions;
- the second question is rereading practice;
- sentence focus, hints, explanations, smaller examples and reported reading remain separate observations.

**A human voice comes first.** The adult reads the book aloud. Optional local narration is used only where the Paris engine already offers it. It is never a decoding, fluency or independent-reading claim, and reported reading stays an adult report.

There is no timer, score, reward, mastery label, lock or streak. The book is one more option in the bookstall's regular rotation; the child can choose a length, stop, return or skip it.

## Small optional saved state and boundaries

**Saved state.** The pack adds no new state, schema or root. Visits use the existing Paris story storage and the existing explorer, transfer and save-off behaviour.

**Prerequisite repair (confirmed defect on main).** `garden-core.mjs` stores a paused visit's choice and order answers as indices and resumes them against the *current* `storyNodes` content. A Codex probe saved choice 1, changed that choice's authored text, and resumed: the replacement sentence showed as selected. A content-only pack can't be released on top of that, because any later wording fix to this book would silently change what a paused child appears to have chosen. This breaks the AGENTS.md rule that saves are checked against themselves, not today's wording. The repair is a separate, bounded change landed **before** this pack, specified in [Paris saved-visit source, spec 73](../73-paris-saved-visit-source.md). That spec is authoritative for the whole-visit copy and legacy handling:

- **Freeze on start.** When a Paris visit starts, copy the complete selected route's supplied content (both question pages, their shared passage and helpers) into that visit: prompt, choices, fitting index, order items and the compiler's display permutation. Resume renders from that frozen copy, never from the current catalogue.
- **Legacy drafts.** Existing index-only drafts have no frozen copy, and their original wording and order can't be recovered: a wording change or reorder keeps the same ids and counts while changing what an index points to. So never freeze them from current content and never attribute their answers to today's wording. Keep each one as a legacy record in Grown-up notes, showing its stored indices only as positions ("choice position 2"; the original choice count was not saved), offer a fresh start for that story only, and leave every other visit open.
- **Tests.**
  - Save a choice and an order, change the authored text and the order of choices, then reload: the frozen sentences and arrangement show unchanged.
  - Load a legacy index-only draft after a wording change and after a reorder that keep the same ids and counts: the draft is kept as a legacy record, no answer is shown against the replacement wording, a fresh start is offered for that story, and other stories load untouched.
  - Confirm other stories' visits still load untouched.

That repair gets its own small spec or increment, independent review and tests. The pack spec's scope does not grow to include it. This pack stays content-only and waits on it.

**Data boundary.** No free-text field, no learner data in the pack, no network content, upload, scheduler or automatic author. The pack is a reviewed repository source file.

## Acceptance and gates

0. **The prerequisite saved-visit repair has landed** (see the saved-state section), with its own review and its reload-after-content-change tests passing. Until then this pack is not build-ready against main.
1. **Independent specification review of this document**, including:
   - the topic choice;
   - the permitted-fact boundary;
   - the variant-3 mention-order contrast (is it fair at that length?);
   - the three prompt slots and the six required passage sentences within each length budget.
2. **Content authoring and independent content review.** Read every sentence, choice, item, hint, explanation, talk prompt and helper.
   - Check each fact against the Archives de Paris chronology and the Carnavalet record already cited in spec 46.
   - Confirm all three `mc` choices occur verbatim in every passage, the fitting choice is not first, and the distractors are evidence-specific.
   - Confirm every passage includes the source-credit and real-Paris-versus-imagined-town sentences within its sentence and word limits; do not add an image asset.
   - Confirm no sentence reads as safety advice, fear or casualty detail.
   - Record a source audit: facts and source credits, the confirmed or rejected Marble references with their scope, and what stays unobserved.
3. **`node scripts/check-story-packs.mjs` and the README test suites pass.** The validator checks structure only, not whether an answer is sound.
4. **Browser check**, per [story packs](../../story-packs.md) step 4: the bookstall invitation, all three lengths, both questions, support, pause and reload, the ending and notes. Run on desktop, tablet and phone with 44px targets and no overflow.
5. **Independent implementation review, then a draft PR.** No merge or deployment without the owner.

**What this slice does not claim:** flood science, weather knowledge beyond one event's dates, historical inquiry coverage, comprehension or knowledge gains, or independent reading. Its value is one reviewed nonfiction book through an existing format. It proves that a knowledge pack can be content-only, which is the throughput test the proposal sets.
