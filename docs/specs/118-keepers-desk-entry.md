# 118. The Keeper's Desk: a real entry for longer, less-guided work

Status: **proposed specification and authored text, 2026-10-23. Specification review repairs drafted; independent follow-up and content review remain open. Not build-ready.** Written by Claude as a writing-first deliverable; code, art and layout are for the builder. It needs independent specification and content review before any build. The story home comes from the act-structure work in [spec 120 in draft PR #127](https://github.com/anotherpanacea-eng/learning-garden/pull/127/files) which owns the six-act spine, the waterlogged parcel addressed "To the Keeper of the Ways", and the Keeper role. This spec owns the desk's entry, its working conventions, its records, Case 1 and the proposed casebook index (section 8). The later case files in `docs/content/118-*-case.md` are commissioning dossiers that refer to these conventions; each still needs its own complete reviewed activity/source/save contract. Spec 120 owns their referenced act and scene text. Companion: [spec 119](119-deeper-bench-packs.md) proposes separately reviewed bench extensions.

## 1. The problem

An explorer who is ready for long, demanding work has no real way in. Concretely:

- **The tasks stop early.** Of the 265 pinned topics whose source metadata starts at age 11 or later, one has a declared activity reference. Of the 120 that start at 12 or later, none does ([atlas](../learning-atlas.md), `curriculum/topic-coverage.csv`, counted 2026-10-23). Source ages are authoring metadata, never a learner's level; the count shows where authored content runs out.
- **The hard part is rarely the thinking.** Most activities make one distinction visible with a supplied model. That is right for a first encounter. An explorer who already has the idea finds the action trivial and the framing young.
- **"Sapling" is a label without content.** The Café's Sapling choice uses the same full range as Seedling ([challenge bands](proposed/challenge-bands.md)). No bench has a genuinely harder pack.
- **The story offers no reason to arrive later.** Every route begins in recovery. The roadmap names authored later-act arrivals as missing work ([roadmap](../roadmap.md#different-starting-points-current-capability-and-next-work), item 3).
- **Nothing is the explorer's own.** Free composition exists only in the Story Loft. There is no place to build an argument, make a recommendation or leave a decision that the town reads.

A real point of entry needs all four: a story reason to be there, tasks where the difficulty is in the reasoning, teaching that comes first but can be folded away by a learner who already has the idea, and work that belongs to the explorer.

## 2. What this adds

One new destination, **the Keeper's Desk**, holding a **casebook**. A case is a longer, multi-step question from the town, in which several strands meet: some arithmetic or algebra, some data, some reading of sources, and a written decision. Each case ends when the explorer keeps a recommendation, which the town receives in story.

The desk is described by the shape of its tasks, never by age or ability:

> **Longer cases, less guidance.** Each case asks a real question the town hasn't answered. You choose where to start, skip the teaching when you already know it, and finish by recommending what the town should do.

The desk is open to every explorer from the first visit. An explorer can open it with a grown-up; the same case completes with the supported route in section 5.5. Nothing is locked, scored or required.

**Commissioning boundary:** the first implementation increment is the desk and Case 1, *Bridge or ford?*, only. All later cases in section 8 are proposed research/content dossiers for separate commissions. Each needs its own complete task/support/source/save contract and applicable historical source, subject, fluent-language and content reviews. Their presence in this PR does not add them to the first build. The casebook's story invitation column is planning metadata, not an implementation/content clearance or a learning prerequisite. No later case is automatically commissioned by reaching an act or page. Spec 119 and the later story jobs are separately reviewed dependencies, not capabilities supplied by Case 1.

## 3. Conventions that make the desk feel different

These apply to every case. They are what makes this an entry for a more independent learner without adding a band or a level.

1. **Teach first, and let the explorer skip it.** This follows Jane's teach, guided practice, then independent order (`LESSONS.md`, "Teach → guided practice → graded → boss"). Each step opens with a short **learn card**: one idea and one worked example, revealed a line at a time. The first task in the step is **guided**, with one to three working lines shown before answering. Record the initial learn-card lines and guided lines actually shown as supplied support context for that task; later tasks retain any relevant worked-example exposure. Then come the unguided tasks. The departure from Jane is one button: **I know this, show me the question** folds the learn card and the guided lines away, and the explorer goes straight to the tasks. Folding is a display action, not a new help event, and never clears support or exposure already shown. They stay one tap away as **Show me how**, and opening them afterwards is recorded as additional support for that step only. A hidden card is not proof it was unseen; folding cannot turn a supported attempt into an independent one. Where a relevant solution/model was supplied, describe that context instead of claiming independent discovery.
2. **When stuck, one rung at a time.** This is Jane's "I'm stuck" ladder without hearts or points. Every checked task has **I'm stuck**, and each tap moves down one rung: first a hint, then a worked example of a similar, easier problem with the first line of this one, then **Skip for now**. A skipped task stays open in the case, and the record shows each rung that was used.
3. **Steps in any order.** The case page lists its steps. The explorer can open any step first, leave a step unfinished, and return. The recommendation step reads whatever the explorer has kept so far and says plainly which steps are still open.
4. **Mechanical checks only where the answer is mechanical.** Arithmetic and equations get **Check my working**, which compares the entered value with the authored model. Readings of sources, choices among plans and written reasons are never marked right or wrong. Authored replies respond to the choice made, with the same tone for every choice.
5. **The town's adults lead.** Cases come from named adults in town with a real stake. Pip and Dot can appear, but they do not narrate or explain. Text is denser and plainer than in early activities; read-aloud remains available wherever the rest of the app offers it.
6. **Disagreement is normal.** Sources disagree, and Bramble often raises the best objection. The desk distinguishes a contradiction (two claims that cannot both be true) from a disagreement (claims that measure different things, cover different times, or rest on different values).
7. **Keep, then revise.** Every kept answer, reading and recommendation can be reopened and changed. The earlier version stays visible as "your first version" (the existing keep/replace pattern).

## 4. Arrival text

Spec 120 in [draft PR #127](https://github.com/anotherpanacea-eng/learning-garden/pull/127) owns the parcel, the old Keeper and the reveal. Desk access does not require that story implementation. Use the fresh arrival below by default. Add only the conditional recap justified by this explorer's explicit story arrival/reached pages, once that integration exists; opening the desk never marks earlier acts, repairs or activities completed.

**Home invitation (one line, below the existing "Find a place to begin"):**

> **The Keeper's Desk** · Longer cases from the town, with less guidance.

**First visit, arrival panel:**

> The desk stands in a corner of the Willowbank library, beside books waiting to be put back. Its drawers hold survey maps, a courier's logbook and questions nobody has had time to answer. Wren has cleared a space for a casebook.
>
> Wren Halloway has kept the town's ledgers since the storm. She pushes the chair out for you.
>
> "The town keeps asking questions that need someone to sit with them. Which crossing do we rebuild? Whose account of the flood do we trust? I can do the sums. I can't do the sitting. Will you take the desk?"

Buttons: **Take the desk** · **Look around first**.

**"What's happened in town" card** (available at any time):

> A storm damaged the town. People are working out what to mend and what to build. The desk is where you can sit with one question before the town meeting.

This fresh recap claims no completed work. Once spec 120 is built, append one of these story recaps only when justified:

- Explicit `mended` arrival or reached Act I ending: "The welcome-back supper has happened. Pip has one dry page from the parcel: an old map."
- Explicit `letter` arrival or reached Act II ending: "A letter has come from upstream. Pip has two dry pages: an old map and a flood ledger."
- Otherwise: no parcel-page recap.

Further proposed recap lines are shown only if the corresponding story page/letter is actually available; they are never unconditional fresh-arrival text:

- After page 2: "One page is a list of floods at the mill's flood post. The last line says Ask upstream." *(Builder note: take any values from spec 120's versioned page; the card adds no claim of its own.)*
- After Nuria's first letter: "Vadoalto, upstream in Spain, had the storm too. Nuria keeps its flood post and writes in Spanish and English."
- After Léon's first letter: "Les Saules, downstream in France, keeps a ferry. Léon writes in French and English."
- After page 4: "The town drained a marsh called the Sponge in year 22 of the old Keeper's records. People are arguing about whether that made the floods worse."

The library may be called mended only if its own completed repair state supports that description. Neither an act ending nor a later arrival marks every repair completed.

An arrival recap describes earlier story events as before you came, never as this explorer's completed work. It does not claim that all town repairs are done. Page text and availability remain owned by spec 120; later pages are never named here. Reading the card records no learning attempt or completed activity.

**"Take the desk" response:**

> Wren hands you the casebook. "One case is open. Start anywhere. I'll open each part with a little worked example. Fold it away when you want the question, and open it again whenever you like."

## 5. Case 1: Bridge or ford?

### 5.1 The question

> **Case 1 · Bridge or ford?**
>
> The storm took the footbridge at the narrows. People have been wading the old ford downstream, but carts can't manage the bank, and the courier has turned back more than once. The town fund can pay for **one crossing this year: 2,700 coins.**
>
> Two plans are on the table:
>
> - **A timber footbridge at the narrows.** High banks, so it stays above floods. Walkers and hand-carts only.
> - **A stone causeway at the ford.** A raised stone path across the shallows. Carts can use it. In a flood it goes under.
>
> Wren needs a recommendation for the town meeting.

Steps, listed on the case page in this order but open in any order:

1. **What does each plan cost?** (algebra and linear relationships)
2. **Who crosses, and how?** (ratio and sampling)
3. **How often does the ford flood?** (sources and evidence)
4. **Your recommendation** (argument and writing)

All quantities, people and records in this case are fictional and labelled as such. The town's accounts train the reasoning; they are not historical evidence.

### 5.2 Step 1: What does each plan cost?

**Question panel:**

> The builders' price sheet:
>
> | Plan | To set up | For each metre of crossing |
> | --- | --- | --- |
> | Timber footbridge | 1,200 coins | 60 coins |
> | Stone causeway | 400 coins | 100 coins |
>
> The narrows are **24 metres** across. The ford is **15 metres** across.
>
> Bramble has left a note on the sheet: *"The causeway is cheaper. Look at the setup cost."*

Tasks:

- **1a.** Cost of the footbridge at the narrows (24 m). *Answer: 1,200 + 60 × 24 = 2,640.*
- **1b.** Cost of the causeway at the ford (15 m). *Answer: 400 + 100 × 15 = 1,900.*
- **1c.** Would both fit in the fund? *Answer: each fits on its own (2,640 ≤ 2,700; 1,900 ≤ 2,700); both together do not (4,540).*
- **1d.** Bramble's claim, tested properly. "If both plans had to cross the **same** gap, would the causeway always be cheaper?" The explorer can enter a whole-number length from 0 to 100 metres and see both totals in a table that keeps each try. Then: "At what length do they cost the same?" *Answer: 1,200 + 60L = 400 + 100L, so 800 = 40L and L = 20 m. Below 20 m the causeway is cheaper; above 20 m the footbridge is.*
- **1e.** Write each plan's cost as a rule for any length L. Supplied tiles let the explorer build `1200 + 60 × L` and `400 + 100 × L`; a keyboard field accepts the same expressions. **Check my working** parses the bounded affine grammar below and compares its exact coefficient and constant with the price sheet. It does not require one written form: `60L + 1200` is equally correct. A table at example lengths may illustrate the rule, but agreement at selected lengths is not the equivalence test.

**Expression input contract (1e):** without `eval`, parse whole-number literals, `L`, parentheses, signs, addition/subtraction and multiplication (including `60L`) to exact `(coefficient of L, constant)` pairs. Compare with `(60,1200)` or `(100,400)`; equivalent affine forms fit. Reject nonlinear or malformed input with "Use whole numbers, L, +, −, × and brackets to write a linear rule." Keep the entered draft when it cannot be checked.

**Learn card (folds away; reopens as Show me how):**

> A price like this has two parts. The **setup** is paid once, however long the crossing. The **per-metre** part grows with every metre.
>
> Try a tiny crossing, 1 metre. Footbridge: 1,200 + 60 = 1,260. Causeway: 400 + 100 = 500. The causeway wins easily.
>
> Now a long one, 50 metres. Footbridge: 1,200 + 3,000 = 4,200. Causeway: 400 + 5,000 = 5,400. Now the footbridge wins.
>
> So the cheaper plan depends on the length. Somewhere in between they cost the same. Each extra metre costs the causeway 40 coins more than the footbridge (100 − 60). The footbridge starts 800 coins behind (1,200 − 400). How many metres until the causeway has used up that 800-coin head start?

**Guided first task (1a):** shown above the answer box unless folded: `1,200 + 60 × 24`, then `60 × 24 = ?`, then `1,200 + that = ?`.

**Working shown one equality per line.** For 1d the desk lays the working out the way the Marble research for Solving Linear Equations recommends: each line is a true equation in its own right, the same thing is done to both sides, and the answer is checked in the original rule.

```
1200 + 60L = 400 + 100L
 800 + 60L = 100L          take 400 from both sides
       800 = 40L           take 60L from both sides
        20 = L             divide both sides by 40
Check: 1200 + 60 × 20 = 2400, and 400 + 100 × 20 = 2400
```

A supplied contrast card shows the chain `800 = 40L = 20` beside the true separate lines and says: "Each line should be true by itself. 40L isn't 20; L is. Try writing L = 20 on its own line."

**Contrast (after 1d, shown whatever the explorer answered):**

> Bramble compared the setup costs and stopped. The setup is only part of the price. Comparing two plans means comparing their totals at the length you actually need.

**Authored replies to likely errors** (keyed to the entered value):

| Entered for 1a | Reply |
| --- | --- |
| 1,440 | "That's the per-metre part. The setup is paid too." |
| 1,260 | "That's the price for one metre. The narrows are 24 metres." |
| 30,240 | "That multiplies the setup by the length as well. The setup is paid once." (Tags the Marble Algebraic Notation misconception of reading left to right: `(1200 + 60) × 24` against `1200 + 60 × 24`.) |

### 5.3 Step 2: Who crosses, and how?

**Question panel:**

> Wren asked two volunteers to count crossings at the ford on two different days.
>
> | Day | Crossings with a cart | Crossings on foot | Total |
> | --- | --- | --- | --- |
> | Market Saturday | 45 | 135 | 180 |
> | A rainy Tuesday | 2 | 38 | 40 |
>
> The footbridge can't take carts.

Tasks:

- **2a.** On Market Saturday, write carts to walkers as a ratio in its simplest form. *Answer: 45 : 135 = 1 : 3.*
- **2b.** What fraction of Saturday's crossings used a cart? *Answer: 45/180 = 1/4, or 25%.*
- **2c.** The same for the rainy Tuesday. *Answer: 2 : 38 = 1 : 19; 2/40 = 1/20, or 5%.*
- **2d.** Wren asks: "So what share of the town's crossings need a cart?" Choices (order varied per AGENTS.md):
  - "Use Saturday's quarter for a usual week; it counted more people."
  - "Keep both days' figures; neither tells us a usual week's share." ← fits the evidence
  - "Discard both days' figures; neither tells us anything useful about crossings."

  Authored replies: to the first, "Saturday tells us about Saturday. More people counted does not make it a usual day." To the fitting choice, "These are the shares observed on those days. We have no basis for bounding the town's usual share between them." To discarding both, "The counts do describe those two days. Keep them, and ask for more days before describing a usual week."
- **2e.** "Who might these counts miss?" Free choice of any that apply, each with an authored reply; none is marked wrong:
  - People who stayed home because the ford was too high.
  - Carts that took the long road round instead.
  - People who crossed before the volunteers arrived.
  - The volunteers counted everyone, so no one is missed.

  The reply to the last option: "They counted everyone who crossed while they were there. The question is about who didn't cross, or crossed somewhere else."

**Authored replies to the ratio misconceptions in the Marble research for Ratio Notation:**

| Entered | Reply |
| --- | --- |
| 3 : 1 for 2a | "Carts were asked for first, so carts go first: carts to walkers." |
| 9 : 27 or 15 : 45 for 2a | "Those are equal to the right ratio but not simplest. Can both numbers still be divided by the same number?" |
| 1/3 for 2b | "1 : 3 compares carts with walkers. A fraction of all crossings compares carts with everyone: 1 cart in every 4 crossings." |
| 0 : 90 or 44 : 134 for 2a | "Taking the same amount off both parts changes the comparison. Divide both parts by the same number instead." |

The learn card for 2a draws 45 : 135 as a bar of 1 block against 3 blocks, so the four blocks of the whole are visible before 2b asks for a fraction of all crossings.

**Learn card:**

> A **ratio** compares parts with each other: 45 carts to 135 walkers. Dividing both by 45 gives 1 to 3. For every cart, three people walked.
>
> A **difference** compares by subtracting: 135 − 45 = 90 more walkers than carts. On Tuesday the difference is 36, which sounds smaller, yet carts were a much smaller share of the crossings. Ratios let you compare days with very different totals.
>
> A **count from one day** tells you about that day. To say something about a usual week you'd want several days, chosen so busy days and quiet days both appear.

**Contrast:** the ratio-versus-difference panel above is shown beside 2c so both comparisons are visible for both days.

### 5.4 Step 3: How often does the ford flood?

**Question panel:** three records from the desk's drawers, each with its kind and date visible.

> **1. Hob Pennick, who farms beside the ford, talking to Wren last week.**
> "I've lived by that ford forty years. I've seen it go right under twice. Once was this storm. It's a fine crossing."
>
> **2. The courier's logbook, last two winters.** Seven entries in all, for example:
> *12 Nov: Ford too high, turned back, went round by the hill road (two hours).*
> *3 Feb: Water over the stones at dawn. Waited till noon.*
>
> **3. The town survey map, 1898.** Beside the ford, in small print: *Impassable in spate.*

Tasks:

- **3a.** For each record, choose its kind from *a memory told later*, *a log written at the time*, *a survey warning that dates no flood*. Then place its two supplied claim cards under **Can tell us** or **Cannot tell us**. All six cards and the authored readings are in the table below. The source type is an authored description, not proof of accuracy. These reading choices get the authored explanation without a right/wrong mark.

| Record | Kind and guided line | Can tell us card | Cannot tell us card | Reply after keeping |
| --- | --- | --- | --- | --- |
| Hob | Memory told later. Guided: "Hob is speaking now about forty years. A remembered account looks back." | `hob-experience`: How the ford seemed to Hob over decades. | `hob-days`: How many days each winter it could not be crossed. | "Hob tells us what he remembers and values. He has not listed every day or defined right under." |
| Courier | Log written at the time. | `courier-delays`: The courier recorded seven interruptions over two winters. | `courier-depth`: The measured water depth on each of those days. | "The log records interrupted journeys. It does not give measured depths or every crossing." |
| Survey map | Survey warning that dates no flood. | `map-warning`: The survey warned that high water could make the ford impassable. | `map-frequency`: How often the ford flooded after 1898. | "The warning names a risk. It supplies no dated flood list or later frequency." |

Show the same source-specific reply after either arrangement; keep the explorer's reading as chosen. The table describes the supplied evidence, not an automatically scored interpretation.
- **3b.** "Do Hob and the courier contradict each other?" Choices:
  - "Yes. Twice in forty years can't fit seven high-water days in two winters."
  - "No. 'Right under' and 'too high to cross' may differ, over different years." ← fits the evidence
  - "Yes. One of them must be remembering or reporting it wrong."

  The reply for the third choice: "That could be true, but nothing in these records shows it. What else could explain both?"
- **3c.** "What would you want to know that none of these records tells you?" Free choice, authored replies: the depth of water on the courier's days; whether the causeway would stay passable when the shallows are too deep to wade; records from other years; what the hill farms say.

**Learn card:**

> Two accounts **disagree** when they seem to point different ways. They **contradict** only if both can't be true at once. Before deciding someone is wrong, check three things: Are they measuring the same thing? Do they cover the same time? Was each written when it happened, or remembered later?

This step is where the case connects to spec 120's flood story, where Case 1 is Act I's desk case. The parcel's flood ledger (page 2) belongs to the end of Act II, so this case does not use it; a revisit after that page could add the ledger as a fourth record.

### 5.5 Step 4: Your recommendation

**Question panel:**

> The meeting is tomorrow. Wren wants one page she can read out.
>
> What you've kept so far: *[a short list generated from the explorer's kept answers, or "not yet" for each open step]*

The recommendation has four parts. Each part offers a **Write it yourself** field and a **Choose and adapt** set of supplied sentences, which the explorer can edit after choosing.

1. **What should the town build?** Choices: the footbridge; the causeway; the causeway now and a footbridge later; neither yet (spend on something else first). Another plan can be written in.
2. **Your strongest reason.** Supplied starters draw on each step: "The causeway costs 740 coins less, which leaves money for…"; "A quarter of Saturday's crossings needed a cart, and the footbridge can't take carts, so…"; "The courier was stopped seven times in two winters, so a crossing that floods…".
3. **The best objection, and your answer.** Bramble supplies one objection matched to the plan chosen. For example, for the causeway: *"And when it's under water? The courier turns back, same as now."* For the footbridge: *"So carts keep wading the ford. You've built a bridge for walkers and left the farms where they were."* The explorer answers it, concedes it, or changes plan.
4. **What you're not sure about.** One sentence, written or chosen: "We only counted two days"; "We don't know how deep the water was on the courier's days"; another.

**Keep this recommendation** saves it. **Read it to Wren** shows the page as she would read it, in the explorer's words, with no marking.

**Wren's response (the same for every plan):**

> Wren reads it twice. "Good. Whatever they choose tomorrow, they'll know what each crossing costs, who it leaves out, and what we still don't know. That's what the desk is for."

**Story closure:** the recommendation is pinned to the library noticeboard. Spec 120 decides what the town meeting does next; this case must not imply that one plan was correct.

**Supported route** (for an explorer working with a grown-up, or anyone who wants it): every part can be completed with **Choose and adapt** alone, and steps 1–3 can be left open. The same closure follows. A grown-up reading aloud and talking it through is a full way to finish.

### 5.6 First-case teaching and help text

This table completes the guided/hint/similar-example authoring list for Case 1's checked tasks. Learn cards are those above; Step 2 first shows its ratio definition and four-block bar, Step 3 first shows its three-question source comparison, and Step 4 first shows the four-part recommendation frame. Their guided first tasks are respectively 2a, Hob's 3a row and the plan choice in 5.5. Step 4 says: "Start with a plan. You can choose one below and change it later." Supplied starters remain visibly supplied support. Steps 3 and 4 have no scored checks or numeric stuck ladder; **Keep**, **Leave this step open**, **Show me how** and the complete authored choices stay available.

For each checked task, **I'm stuck** first shows the Hint column, then the Similar example and first line, then **Skip for now**. Each shown rung is separate support, and the final rung keeps the task open. The shared skip line is "Leave this question open. Your other work stays here." None of the help text depends on a live model or generated prose.

| Task | Hint | Similar example, then first line of this task |
| --- | --- | --- |
| 1a | "Pay the setup once, then the price for every metre." | "A stall costs 100 to set up and 10 per metre. At 3 metres: 100 + 10 × 3 = 130. Your first line: 1,200 + 60 × 24." |
| 1b | "The causeway has its own setup and per-metre price." | "A path costs 50 to start and 20 per metre. At 4 metres: 50 + 20 × 4 = 130. Your first line: 400 + 100 × 15." |
| 1c | "Compare each price with 2,700, then compare their sum with 2,700." | "With 100 coins, plans costing 60 and 80 each fit alone; together 140 does not. Your first line: 2,640 + 1,900 = ?" |
| 1d | "How much does the causeway gain on the bridge for each extra metre?" | "100 + 10L = 40 + 20L gives 60 = 10L, so L = 6. Your first line: 1,200 + 60L = 400 + 100L." |
| 1e | "The fixed part is the setup; the coefficient of L is the price per metre." | "A plan with setup 80 and 5 per metre has rule 80 + 5L. Your first line: footbridge setup + footbridge rate × L." |
| 2a | "Divide both parts by the same common factor." | "6 carts : 18 walkers becomes 1 : 3 by dividing both by 6. Your first line: 45 : 135, divide both by 45." |
| 2b | "The whole is carts and walkers together." | "2 carts among 8 crossings is 2/8 = 1/4. Your first line: 45 / (45 + 135)." |
| 2c | "Keep the ratio's order; for the fraction, use all Tuesday crossings." | "3 carts : 27 walkers is 1 : 9; the cart share is 3/30 = 1/10. Your first lines: 2 : 38; 2 / (2 + 38)." |

1c uses three separate choices, **Each on its own fits / does not fit** for each plan and **Both together fit / do not fit**, with the comparisons in 1c as its mechanical model. 1d checks the entered crossover length only; its trial table and the supplied equation lines are teaching, not independently composed algebra. 1e checks each plan's expression separately under the bounded grammar.

The remaining source/interpretation choices and recommendation text are authored drafts. This list is not content clearance: independent Case 1 review must inspect every learn/guided/help line, source card, response and supported closure before build, including whether choice wording/order gives the response away.

### 5.7 Revisits

The case keeps its own frozen answers. The following are proposed later revisits, each requiring its own reviewed integration and any model extension in spec 119; no current bench automatically reads desk artifacts:

- **Balance Stall:** the crossover equation as a two-sided balance (spec 119 proposes a separately reviewed extension).
- **Count Collection:** chart the two days' counts and choose a fair representation.
- **Cartographer's Table:** plot the narrows and the ford on a scaled town map.
- **The town remembers** (proposed strategy): weeks later, the courier asks which crossing she should use on a flood day, given the explorer's kept recommendation.

## 6. Records, privacy and saves

Stored per explorer in existing local storage, following the AGENTS.md saved-work rule:

- `desk.arrived` (the arrival panel was answered) and `desk.cases['bridge-or-ford']` in the first increment, holding the case's source IDs/version and frozen task quantities, model parameters and choice order (message/help codes map to UI text); each step's kept answers and attempts; the initial learn/guided lines actually shown and relevant prior worked-example exposure; each later help rung and skip; and familiarity. Preserve those distinct contexts on resume. Folding never clears them, and supplied work is never relabeled independent. This is a new case-specific record using the existing separation principles, not an existing generic desk API. A separately commissioned case would use its own ID from section 8 and reviewed contract; a reading case may keep its chosen language/length as a local preference, never evidence of reading level.
- **Free text:** Case 1's expression field in 1e and four recommendation fields stay local, appear in Grown-up notes and the existing JSON export, are removed by explicit deletion, and are never sent anywhere or reused as content. The expression is checked only for exact affine coefficient/constant agreement under 1e's bounded grammar; this checks a supplied mathematical rule, not prose quality or ability. Recommendation fields are never graded. Any later commissioned case must name and bound its own free-text fields and checking boundary. Prompts are about a fictional town and never invite personal or family details.
- A save is validated on IDs, counts and outcomes. A later wording or answer-key change never rewrites a kept answer or recommendation. If one step can't be read, the rest of the case stays open.
- No age, grade, ability label or band is read or written by the desk.

## 7. Topic references (candidates, pending semantic review)

Per spec 49 §5, each is a candidate encounter that review must confirm against the full Marble description before any atlas declaration:

| Step | Candidate topics |
| --- | --- |
| 1 | `mt_KwdjWEmMNo` Algebraic Notation; `mt_QhFEDyIwSO` Solving Linear Equations (one bounded case); `mt_g_fkAqmz72` Expressions & Equations Vocabulary |
| 2 | `mt_XWSGuFW7It` Ratio Notation; `mt_h0gJcSuwdL` Ratio Problems; `mt_xAf2bu9wYK` One Quantity as a Fraction |
| 3 | `mt_Lu4H4mbsqO` Evidence Versus Interpretation; `mt_JVVKT-_AD9` Using Multiple Sources |
| 4 | `mt_gMSFymQlrW` Evaluating Arguments in Non-Fiction; `mt_Qxyikkkzam` Persuasive Writing; `mt_j5YqQnN6xe` Constructing mathematical arguments |

One case is one encounter. It does not cover any of these topics.

### 7.1 Marble prerequisite crosswalk

Spec 49 (section 8) requires every hard prerequisite of a selected topic to have a reviewed earlier lesson, explicit support in the same unit, or a documented exception. The pinned graph (`curriculum/marble/dependencies.json`) gives these hard prerequisites. "In app" means the topic already has a declared reference in `curriculum/topic-coverage.csv`.

| Topic | Hard prerequisites (in app?) | How this case handles them |
| --- | --- | --- |
| Solving Linear Equations | Writing Algebraic Equations (no); Substituting into Formulae (no); Using inverse operations (no) | Support in the same unit: the learn card for 1d works an equation from words, 1a and 1e substitute lengths into a rule, and each line of the working names its inverse operation. The Balance Stall (spec 64, and spec 119 section 2) gives a concrete model of equality. Positive whole-number solutions only, so negatives are a documented exception. |
| Algebraic Notation | Writing Algebraic Equations (no); Using Simple Formulae (no) | 1e builds the formula from tiles before typing, and the price sheet is itself a simple formula in words. |
| Expressions & Equations Vocabulary | Algebraic Notation (this case) | The learn card for 1e names *expression* (a rule with no equals sign) against *equation* (1d). |
| Ratio Notation | Proportional Reasoning Vocabulary (no); Factors, multiples and primes (no); Understanding fractions (no) | Support in the same unit: the 2a learn card defines *ratio*, *simplify* and *equivalent*, and finds the common factor 45 explicitly. Fraction meaning is assumed from Tenths Table and Lantern Line, so this is a documented exception for an explorer who has not met them. |
| Ratio Problems | Bar Models for Ratios (no); Percentages (age 9+) (no); Multiplicative Comparison (yes) | The bar model appears in the 2a learn card. Percentages are given alongside fractions in 2b and 2c and are not required. |
| One Quantity as a Fraction | Adding Fractions, Unlike Denominators (no); Decimals and fractions (no) | Documented exception: 2b and 2c need neither. Narrow the reference to "a part as a fraction of its whole" in review. |
| Evidence Versus Interpretation | Questioning Historical Sources (yes); Vocabulary: historical thinking (no); Checking Sources Against Each Other (yes) | Step 3 defines *evidence*, *account* and *record* in its learn card. The town records are fiction, so any atlas reference must be narrowed to reasoning about evidence and must not claim historical knowledge. |
| Evaluating Arguments in Non-Fiction | Using and Evaluating Textual Evidence (no); Purpose, audience and context (no); Fact vs opinion (no) | Step 3a's "what can it tell us" cards practise textual evidence. Purpose and fact against opinion are supported only lightly, through Hob's "It's a fine crossing". Treat this as a partial candidate. |
| Persuasive Writing | Writing for an audience (no); Justifying Views About Texts (no); Cohesion and Transitions Across Writing (no); Choosing Form and Tone for Your Audience (yes) | Step 4 supplies a reader (Wren and the meeting), a claim/reason/objection/uncertainty frame and chosen starters. Cohesion is not taught here, which is a documented exception. Writing is human-read, so no attainment is inferred. |
| Constructing mathematical arguments | Understanding fractions (age 9+) (no) | Bramble's claim in 1d is a false conjecture that the explorer disproves with a counterexample length, which matches this topic's evidence. |

Most hard prerequisites have no declared reference in the app. That is the gap this desk exposes. The case covers them with inline support, and review should decide whether any of them needs its own earlier lesson before the desk is built.

### 7.2 Where this sits in the six-act strands

The [strand families](../six-act-strands.md) place this content mostly in Acts III and IV: M4-III (expressions and formulae), M4-IV (linear equations), M3-III (ratio against difference), M6-II (choosing relevant data), E3-IV (relevant and sufficient evidence), H1-III (evidence against interpretation) and E4-IV (argument with counterclaims). Spec 120 makes Case 1 the desk's opening in Act I. Spec 49 (section 3) keeps story acts and teaching sequences separate, so this is allowed. It also means the desk is the route by which an explorer meets Act III and IV teaching in an Act I setting. The roadmap's ordering rule, unknown relations before algebra and fractions before ratio, is met through the Balance Stall, Tenths Table and the inline learn cards. It does not depend on story order.

## 8. The casebook

This is a proposed commissioning and story-invitation catalog, preserving the later authored dossiers for review. Only Case 1 belongs to the first implementation increment. The column below describes when a future commissioned case would be invited without spoiling its source pages; it does not create an activity gate, claim current availability or approve any case for build. Case numbers are file references, never learner labels. Each separately commissioned case needs its own complete understood source/model version and preservation contract consistent with sections 3 and 6; section 10 currently verifies Case 1 only. A later arrival can supply story context without marking earlier work completed.

| No. | Case ID | Title | Proposed story invitation | Main strands | Written in | Review needed before build |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `bridge-or-ford` | Bridge or ford? | From the first visit (Act I) | Linear relationships, ratio, sources, argument | Section 5 | Case-specific authoring |
| 6 | `hollis-pages` | What did Hollis write? | When page 1 dries; each later page joins as it dries | Transcription, inference from context, certainty | [118-hollis-pages-case.md](../content/118-hollis-pages-case.md) | Case-specific authoring |
| 7 | `sorting-machine` | The borrowed sorting machine | After Act I | AI literacy (C1), rules against learned examples, sampling | [118-sorting-machine-case.md](../content/118-sorting-machine-case.md) | subject reviewer for C1 |
| 10 | `town-record` | What should Willowbank write down? | Act II, "A garden across the seasons" | Measurement, data design, records | [118-town-record-case.md](../content/118-town-record-case.md) | Case-specific authoring |
| 4 | `flood-bell` | When should the bell ring? | After Nuria's first letter (end of Act II) | Time and rates, upstream timing, uncertainty | [118-flood-bell-case.md](../content/118-flood-bell-case.md) | the case must not read as flood-safety advice (spec 120, S7) |
| 3 | `seed-exchange` | The seed exchange ledger | Act III, "The seed exchange" | Ratio, proportion, percentages, sample size | [118-seed-exchange-case.md](../content/118-seed-exchange-case.md) | Spanish reader for Nuria's note |
| 9 | `flood-marks` | Marks on the wall | After Léon's first letter (Act III) | Reading French sources, measurement, history | [118-flood-marks-case.md](../content/118-flood-marks-case.md) | **Source and fluent French review** |
| 2 | `valencia-1957` | Where did Valencia's river go? | Act IV, after page 4 | History, Spanish reading, compound units, perspective | [118-valencia-1957-case.md](../content/118-valencia-1957-case.md) | **Source and fluent Spanish review** |
| 8 | `room-for-the-river` | A country that gave its rivers room | Act IV, "What other places did" | History, scale and area, trade-offs | [118-room-for-the-river-case.md](../content/118-room-for-the-river-case.md) | **Historical-source review** |
| 5 | `ledger-and-gauge` | The ledger and the rain gauge | Act IV, after page 4 and Nuria's rain gauge letter | Mean, comparison of groups, confounding, argument | [118-ledger-and-gauge-case.md](../content/118-ledger-and-gauge-case.md) | Case-specific authoring |
| 11 | `exchange-plan` | Keeping the Ways open | Act VI, "Compare routes and keep a plan" | Rates, scheduling, constraints, written plan | [118-exchange-plan-case.md](../content/118-exchange-plan-case.md) | Case-specific authoring |

Act V's desk depth, the Gazette opinion piece, belongs to spec 49's authored project path and is not a casebook case. Case 5 is the "full dossier" spec 120 names for Act IV's older learner; it reads its plans and the town meeting from spec 120 and writes no act text of its own.

The authored files propose the following parts, whose presence is not proof of completeness or review: why the case exists, its hook, its steps, each step's learn card, guided first task, tasks with worked answers, stuck ladder and misconception replies, the recommendation or closing step, its supported route, topic candidates with the hard-prerequisite crosswalk, and what still needs review.

The later dossiers currently contain representative help and replies, not a complete deployable content set. Before each separate case build, its author and independent reviewer must resolve the applicable finite content gaps: Case 5 needs all three statement-tray reply columns; Case 9 needs every offered French/English choice and keyed reply at each supported passage amount; Case 3 needs the offered control/reason choices and their authored responses for its fair-trial plan. Case 6 needs source-page-specific tasks/help that work when only page 1 is available and never reveal undried pages.

## 9. Entry points

- Home: the one-line invitation in section 4.
- Spec 114's "How shall we begin?" flow: add a fifth destination on its Begin page, **Open the Keeper's Desk** → `#desk`. It follows spec 114's existing destination-button contract: first apply the entire temporary Math/Reading/French draft atomically, then navigate only if Apply succeeds. Preserve all-Keep/no-op and refused-Apply behavior. Opening the desk itself writes no starting preference; it does not bypass the flow's deliberate Apply.
- All places: the desk is listed with every other destination.

## 10. Acceptance

1. A fresh explorer can open `#desk` from Home, Begin and All places, and can open any step of Case 1 first.
2. Every task in 1a–1e and 2a–2c has an authored answer; **Check my working** agrees with the worked values above, and 1e accepts exactly equivalent affine coefficient/constant pairs within its stated grammar and bounds, and rejects nonlinear expressions rather than sampling them.
3. Each step opens with its learn card and guided first task. **I know this, show me the question** folds them without a new help event or clearing initially shown support/exposure; reopening them through **Show me how**, and each rung of **I'm stuck**, is recorded as additional support for that step only. Folding never supplies evidence of unseen work or independence.
4. No reading, choice or recommendation is marked right or wrong; Wren's closing response is identical for every plan.
5. The case completes through the supported route with no free text and steps 1–3 open.
6. Kept answers and the recommendation survive reload, explorer switch, export and import, and a changed answer key; an unreadable step leaves the others open.
7. Choice order varies across questions and stays fixed within a saved question.
8. Arrival and the "What's happened" card spoil nothing beyond the story pages/letters actually reached or supplied by the explicit arrival. The section 8 catalog is planning material; uncommissioned cases are not inserted into the first build.
9. No age, band or ability field appears in the desk's code, saves or copy.
10. Before any later case is commissioned, real history (Cases 2, 8 and 9) must carry the History label and fiction the Story label; no historical claim reaches a child without its independent source/content review. A fluent reader must review each applicable Spanish/French line. These future gates do not expand the Case 1 acceptance increment.

## 11. Upstream overlap (AGENTS.md)

Refreshed 2026-10-23: Jane at `1927912b8d9cd4f7df6e7fbe8416521194743060` (`LESSONS.md` and the Marble teaching-research records it bundles, `data/marble/teaching-research.json`, os-taxonomy `a871973`). The app's vendored Marble pin is unchanged.

**Adopted as design (no Jane code or prose is copied):** teach, then guided practice, then independent tasks (convention 1); the "I'm stuck" ladder of hint, then a similar worked example, then skip (convention 2); at least one wrong choice per checked question taken from a listed misconception, with its own short reply (steps 1 and 2). The Marble research records for Solving Linear Equations, Algebraic Notation, Ratio Notation and Ratio Problems supplied the balance model, the one-equality-per-line working, the substitution check, the bar model and the misconceptions answered in the reply tables. These are paraphrased design notes. The research text (CC BY-SA 4.0, © Generative Spark, Inc.) is not reproduced.

**Not adopted:** boss stages, medals, Leitner review gates, mastery inference, a configured learner grade and fixed daily quests. Jane's writing rules (second person, prompts of 15 words or fewer, three choices) apply to the desk's questions and replies. Scene-setting panels are deliberately longer, because the desk is built for longer reading.

**No research record exists** in the bundled research for Evidence Versus Interpretation, Evaluating Arguments in Non-Fiction or Persuasive Writing. Steps 3 and 4 rest on the topic descriptions and evidence lists in the pinned graph, and they need a subject reviewer for that reason.

## 12. Boundaries

Single device, offline, local saves. No accounts, uploads, multiplayer or live AI. No timers, scores, streaks or locks. The desk adds a destination and a way of working; it does not assign anyone to it.
