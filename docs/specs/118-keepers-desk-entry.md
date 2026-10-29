# 118. The Keeper's Desk: a real entry for longer, less-guided work

Status: **Case 1 specification and content independently reviewed, 2026-10-25; first runtime commission in sections 13–13.3. Implementation review remains a separate gate. Later case dossiers remain proposals.** Written by Claude as a writing-first deliverable; code, art and layout are for the builder. It needs independent specification and content review before any build. The story home comes from the act-structure work in [spec 120 in draft PR #127](https://github.com/anotherpanacea-eng/learning-garden/pull/127/files) which owns the six-act spine, the waterlogged parcel addressed "To the Keeper of the Ways", and the Keeper role. This spec owns the desk's entry, its working conventions, its records, Case 1 and the proposed casebook index (section 8). The later case files in `docs/content/118-*-case.md` are commissioning dossiers that refer to these conventions; each still needs its own complete reviewed activity/source/save contract. Spec 120 owns their referenced act and scene text. Companion: [spec 119](119-deeper-bench-packs.md) proposes separately reviewed bench extensions.

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
4. **Mechanical checks only where the answer is mechanical.** Arithmetic and equations get **Check my answer**, which compares the entered value with the authored model. Readings of sources, choices among plans and written reasons are never marked right or wrong. Authored replies respond to the choice made, with the same tone for every choice.
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
> The footbridge at the narrows had been closed as unsafe for two winters. The recent storm took what was left. People have been wading the old ford downstream, but farm carts struggle up the bank and sometimes get stuck, and the courier has turned back more than once. The town fund can pay for **one crossing this year: 2,700 coins.**
>
> Two plans are on the table:
>
> - **A timber footbridge at the narrows.** High banks, so it stays above floods. Walkers and hand-carts only; no farm carts.
> - **A stone causeway at the ford.** A raised stone path across the shallows. Farm carts can use it. In a flood it goes under.
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
> The bridge at the narrows must span **24 metres from bank-top to bank-top**; the shallow ford crossing downstream is **15 metres**. The sites measure different kinds of crossing width.
>
> Bramble has left a note on the sheet: *"The causeway is cheaper. Look at the setup cost."*

Tasks:

- **1a.** Cost of the footbridge at the narrows (24 m). *Answer: 1,200 + 60 × 24 = 2,640.*
- **1b.** Cost of the causeway at the ford (15 m). *Answer: 400 + 100 × 15 = 1,900.*
- **1c.** Would both fit in the fund? *Answer: each fits on its own (2,640 ≤ 2,700; 1,900 ≤ 2,700); both together do not (4,540).*
- **1d.** Bramble's claim, tested properly. "If both plans had to cross the **same** gap, would the causeway always be cheaper?" The explorer can enter a whole-number length from 0 to 100 metres and see both totals in a table that keeps each try. Then: "At what length do they cost the same?" *Answer: 1,200 + 60L = 400 + 100L, so 800 = 40L and L = 20 m. Below 20 m the causeway is cheaper; above 20 m the footbridge is.*
- **1e.** Write each plan's cost as a rule for any length L. Supplied tiles let the explorer build `1200 + 60 × L` and `400 + 100 × L`; a keyboard field accepts the same expressions. **Check my answer** parses the bounded affine grammar below and compares its exact coefficient and constant with the price sheet. It does not require one written form: `60L + 1200` is equally correct. A table at example lengths may illustrate the rule, but agreement at selected lengths is not the equivalence test.

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

> Bramble looked only at setup costs. At these two sites the causeway does cost less, but setup alone does not explain it. Across the same gap, beyond 20 metres the footbridge costs less. A claim about always needs every length, not just one.

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
> | Day | Crossings with a farm cart | Crossings on foot (including hand-carts) | Total |
> | --- | --- | --- | --- |
> | Market Saturday | 45 | 135 | 180 |
> | A rainy Tuesday | 2 | 38 | 40 |
>
> The footbridge cannot take farm carts. Hand-carts were counted in the on-foot group. The courier carries parcels on foot, so a footbridge would help that route.

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

> **1. Hob Pennick, who farms beside the ford, talking to Wren today.**
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
  - "No. 'Right under' may mean deeper water than 'too high for the courier'." ← fits the evidence
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
2. **Your strongest reason.** Supplied starters draw on each step: "The causeway costs 740 coins less, which leaves money for…"; "A quarter of Saturday's crossings needed a cart, and the footbridge can't take carts, so…"; "The courier was delayed or turned back seven times in two winters, so a crossing that floods…".
3. **The best objection, and your answer.** Bramble supplies one objection matched to the plan chosen. For example, for the causeway: *"And when it's under water? The courier turns back, same as now."* For the footbridge: *"So carts keep wading the ford. You've built a bridge for walkers and left the farms where they were."* The explorer answers it, concedes it, or changes plan.
4. **What you're not sure about.** One sentence, written or chosen: "We only counted two days"; "We don't know how deep the water was on the courier's days"; another.

**Keep this recommendation** saves it. **Read it to Wren** shows the page as she would read it, in the explorer's words, with no marking.

**Wren's response (the same for every plan):**

> Wren reads it twice. "Thank you. I’ll read this out tomorrow, as you set it out."

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
| 1d | "For each extra metre, how much more does the causeway cost than the footbridge?" | "100 + 10L = 40 + 20L gives 60 = 10L, so L = 6. Your first line: 1,200 + 60L = 400 + 100L." |
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

- `desk.arrived` (the arrival panel was answered) and one flat Case 1 source/steps record in the first increment (section 13), holding the case's source IDs/version and frozen task quantities, model parameters and choice order (message/help codes map to UI text); each step's kept answers and attempts; the initial learn/guided lines actually shown and relevant prior worked-example exposure; each later help rung and skip; and familiarity. Preserve those distinct contexts on resume. Folding never clears them, and supplied work is never relabeled independent. This is a new case-specific record using the existing separation principles, not an existing generic desk API. A separately commissioned case would use its own ID from section 8 and reviewed contract; a reading case may keep its chosen language/length as a local preference, never evidence of reading level.
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
| 7 | `sorting-machine` | The borrowed sorting machine | After Act I | AI literacy (C1), rules against learned examples, sampling | [118-sorting-machine-case.md](../content/118-sorting-machine-case.md) | Bounded runtime delivered under [243](243-borrowed-sorter.md), PR193 |
| 10 | `town-record` | What should Willowbank write down? | Act II, "A garden across the seasons" | Measurement, data design, records | [118-town-record-case.md](../content/118-town-record-case.md) | Bounded runtime delivered under [242](242-town-record.md), PR190 |
| 4 | `flood-bell` | When should the bell ring? | After Nuria's first letter (end of Act II) | Time and rates, upstream timing, uncertainty | [118-flood-bell-case.md](../content/118-flood-bell-case.md) | the case must not read as flood-safety advice (spec 120, S7) |
| 3 | `seed-exchange` | The seed exchange ledger | Act III, "The seed exchange" | Ratio, proportion, percentages, sample size | [118-seed-exchange-case.md](../content/118-seed-exchange-case.md) | Spanish reader for Nuria's note |
| 9 | `flood-marks` | Marks on the wall | After Léon's first letter (Act III) | Reading French sources, measurement, history | [118-flood-marks-case.md](../content/118-flood-marks-case.md) | **Source and fluent French review** |
| 2 | `valencia-1957` | Where did Valencia's river go? | Act IV, after page 4 | History, Spanish reading, compound units, perspective | [118-valencia-1957-case.md](../content/118-valencia-1957-case.md) | **Source and fluent Spanish review** |
| 8 | `room-for-the-river` | A country that gave its rivers room | Act IV, "What other places did" | History, scale and area, trade-offs | [118-room-for-the-river-case.md](../content/118-room-for-the-river-case.md) | Bounded runtime delivered under [245](245-room-for-river.md), PR199 |
| 5 | `ledger-and-gauge` | The ledger and the rain gauge | Act IV, after page 4 and Nuria's rain gauge letter | Mean, comparison of groups, confounding, argument | [118-ledger-and-gauge-case.md](../content/118-ledger-and-gauge-case.md) | Bounded standalone [246](246-ledger-gauge.md) delivered through [PR200](https://github.com/anotherpanacea-eng/learning-garden/pull/200#issuecomment-6415649110) |
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
2. Every task in 1a–1e and 2a–2c has an authored answer; **Check my answer** agrees with the worked values above, and 1e accepts exactly equivalent affine coefficient/constant pairs within its stated grammar and bounds, and rejects nonlinear expressions rather than sampling them.
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


## 13. First runtime commission (2026-10-25)

This section makes the first increment concrete; sections 2–6 and 10 remain its content and acceptance contract. Only Case 1 is commissioned. No story state, later cases, topic declarations or spec 119 extensions are added.

### Interaction and content

`#desk` is a casebook index and fresh Wren arrival, followed by four freely chosen step tabs. Within a step, show one task at a time with Back/Next, an index of that step's questions, and a persistent reference drawer. The drawer holds the map/price sheet, two count days, and all three fictional records; it is available without losing drafts. The first arrival offers Take the desk or Look around first; both leave all steps open. A separate What's happened card uses only the fresh recap in section 4. No parcel or completed-repair claim is inferred.

All content in section 5 is included, including the equality contrast, ratio/difference contrast, misconception replies, six source-claim cards, and four recommendation fields. Split composite checks into 1e-bridge/1e-causeway and 2c-ratio/2c-share so each has one answer. 1c retains three separate budget choices checked together. 2d and 3b receive authored evidence feedback, never correctness marks. 2e and 3c allow multiple choices and give a response for each; an empty selection may be kept. 3a gives a source-kind selection and two can/cannot placements per source; always give that source's neutral authored reply, without grading. Order the fitting response at different positions for 2d and 3b; freeze all offered IDs/order in the case source.

Each step first opens with the first learn-card line visible. The lines in the runtime content array are the frozen line segmentation for shown-line records. Next line reveals one more; the first task also shows its guided working. Record exactly which learn/guided lines were shown, on that step, before accepting an answer. Folding is a view action and preserves that exposure. Opening Show me how adds a help event; hints/similar examples/skips are task-specific events. Existing learn exposure remains relevant to later tasks on the same step; the current step’s price sheet, counts or source records are shown beside its prompt, without a help event. Opening the cross-step reference drawer records a neutral reference-view context, not a hint. Trial-table use is likewise recorded as supplied-model context. Hear this page and Thinking together record support too. No independent flag or inferred reading/mathematics proficiency is generated. A task's check/keep snapshots the support and prior-attempt context at that moment, not later support.

A 0–100 whole-metre trial table for 1d keeps the latest 20 trials, with the limit visible. The algebra checker accepts at most 160 characters, 96 tokens, nesting depth 12 and safe integer intermediate coefficient/constant pairs; recursive descent, never eval. Multiplication is allowed only if at least one factor is constant. Whole-number literals, L, unary signs, parentheses, +/− and multiplication (`*`, `×`, adjacency such as 60L) are allowed. Nonlinear expressions, including those that only coincide at sampled points, are rejected. For ratios accept colon pairs of nonnegative whole numbers and require simplest form for the ratio tasks; fraction/share tasks accept exact integer fractions, finite decimals or percentages and compare rationally (no float tolerance). Typed answers are bounded to 160 characters. Invalid syntax keeps the draft and gives a correction prompt. Arithmetic checks are mechanical model agreement only.

Recommendation fields are plan, reason, objection answer and uncertainty (each at most 1,000 characters). All have supplied editable starters, sufficient to finish with steps 1–3 open. The plan field offers the four authored plans plus another plan. Choosing a supplied starter records support, including plan and uncertainty. Bramble's objection follows the plan selection; custom/combined/deferred plans receive a neutral constraint question. The objection answer stores its objection code; changing the plan never silently pairs an old answer with a new objection. Keep the old draft visibly labelled with its captured objection; let an explicit “Answer this objection instead” action start an answer to the new question. Each kept page freezes the question and answer. Keeping requires four nonblank fields only, never semantic grading. Read it to Wren displays the exact text; her neutral response is identical for every plan. A noticeboard and first version remain available after revision. Keeping a recommendation completes this case artifact, not the prior steps, a learning level or a story act.

### State and preservation

Use one optional top-level `desk` record per existing explorer: version 1, arrived, current step/task, a frozen Case 1 source (ID/version/model quantities, source IDs, choice order and message codes), and independent step records. Creation occurs only on explicit desk entry action, never a page render, notes view or import. Drafts persist on input so navigation does not lose work. Each readable step holds its drafts, shown-line indices, support events, current help rung, checks/keeps and first kept version per task. Keep the latest 32 attempt records per task and the first separately; show the limit. Keep first/latest recommendation separately. Familiarity is prior attempts of that task, separate from support and value match.

Validate structural bounds and stored outcomes; do not recheck historical answers against today's catalog, answer key, words or model. New checks use that saved case's model parameters, not today's constants. Unknown choice IDs may render as saved IDs; never replace them with a current choice. Frozen source validation checks safe bounded types/quantities without requiring every current content-list item. A malformed step is retained raw and read-only while all other steps stay usable. An unsupported root/source is retained raw with an explanation; other destinations stay open. No normalization-on-load or automatic attempt writes. Existing whole-notebook export/import, explorer switching and explicit deletion carry/remove the record with the rest of the notebook. Grown-up notes show the free text, support context and kept outcomes and explain their limited meaning.

### Visual direction and verification

Use the existing garden typography, with a library-blue working surface (#203f58), paper (#fffdf6), decorative river blue (#78b7cf), pencil (#304341) and leaf accent (#496b4d). The memorable element is an original crossing sketch showing the two locations, their different widths and access trade-offs, explicitly not to scale. Below it, keep the active prompt left aligned with a maximum readable line length, large tap controls, visible keyboard focus, table overflow within its own region and no page overflow at 320px. River blue is decorative, never text on paper; leaf text appears on paper, not on library blue. Focus rings must contrast at least 3:1 on their adjacent surfaces. No automatic animation or dragging is required. The step/task controls carry actual page structure, not decorative numbering.

Verify independent arithmetic/parser oracles and nonlinear rejection; equivalent rules; ratio versus part/whole errors; all finite choice feedback; support before/after folding and checks; full supported closure; edit/reload/switch/export/import; malformed sibling isolation; saved model/key changes; stale event guards; HTML escaping; 320/820 layouts and keyboard/touch controls. Run affected existing suites and proportionate source regression checks. Independent implementation review inspects exact candidate content/code and browser evidence before merge/deploy.

### Upstream refresh

On 2026-10-25, refreshed Jane `0ec55f7e083976e6fcc3977fca460b1f5e199d91` LESSONS.md and Marble `7bd8b6794cb78d9ca18216adb935f3cfd59cf5ac` data/topics.json. Teach/guided/supported work and the selected algebra/ratio/evidence descriptions are design references, not incorporated code or prose. This first build uses original content and code under the existing project notices, leaves the licensed bundled taxonomy unchanged, and declares no new topic coverage. Prerequisite exceptions in section 7.1 remain visible teaching limitations; the desk does not test prerequisite attainment or require prior games.


### 13.1 Remaining finite text for Case 1

The drawer shows all seven fictional ford-interruption entries from the two winters while the footbridge was closed. The log does not record water depth or days without a delivery: first winter, 12 Nov “Ford too high; turned back and took the hill road (two hours)”; 19 Dec “Water over the stones; took the hill road”; 3 Feb “Water over the stones at dawn; waited until noon”; second winter, 8 Nov “Ford too high for this delivery; went round”; 21 Dec “Water covered the stepping stones; returned to the post office”; 17 Jan “Could not cross at the ford; used the hill road”; 4 Mar “Waited at the ford; crossed later that day.” These are seven interrupted journeys, not necessarily seven floods or seven whole impassable days. The model supplies no precise water depths or hours beyond the stated entries.

For 2e the replies, in the offered order in section 5.3, are: “People who stayed home would not appear in a count at the ford”; “A count at the ford misses people using the long road”; “We do not know the volunteers' counting hours”; and the existing reply for “everyone”. These are observations to consider, never scored choices.

For 3b the first reply is “Hob counts times it went right under; the courier records interrupted journeys. They may be counting different things.” The second reply is “Both accounts may fit: they count different things within overlapping years. That does not prove either account complete.” Keep the third reply in section 5.4. No reply marks a chosen interpretation correct.

For 3c the replies, in the offered order, are: “Measured depths could help compare the courier's days”; “A causeway changes the crossing, so its height and limits matter”; “Other years could show whether those winters were unusual”; “People using other routes may have different experiences.”

Additional Step 1 learn line: “An expression gives a rule, such as 1200 + 60L. An equation says two expressions are equal, such as 1200 + 60L = 400 + 100L.” Additional Step 2 lines: “A common factor divides both counts exactly. Divide both by it to make an equivalent ratio. Simplest means no factor greater than 1 still divides both”; “A fraction compares a part with its whole. Saturday's 45 carts are 45 of 180 crossings, one of four equal shares: 1/4. A percent says how many out of 100; 1/4 is 25 out of 100.” Additional Step 3 line: “A record preserves an account of something. Evidence is what in the record supports a claim. An account may include both observations and a person's interpretation.” These clarify the vocabulary promised in section 7.1 without claiming to teach every prerequisite.

Recommendation supported sentences: plans are “Build the timber footbridge”, “Build the stone causeway”, “Build the causeway now and consider a footbridge in a later year's budget”, and “Choose neither yet; gather more evidence before spending”. Reasons may use the three existing starters, plus a complete editable option “The causeway costs 740 coins less and allows carts to cross.” Objection answers include “I accept that drawback; the town would still need another route in some conditions”, “We should gather more evidence before deciding”, and “I would change my plan after considering this objection.” Uncertainty choices are the two existing sentences plus “We do not know how the people who stayed home would have travelled.” Each is explicitly supplied and editable. Footbridge/causeway objections are the quoted Bramble lines in section 5.5; combined plan: “Only one crossing fits this year's fund. What would wait?”; deferred plan: “What do people use while we wait for more evidence?”; custom plan: “What would this cost, who could cross, and when might it fail?” Wren's neutral reply is identical for every recommendation and does not assert that unvisited steps were completed. Before it, show which steps remain open and call chosen starters supplied text.


### 13.2 Review resolutions and final finite checking text

Section 13 supersedes earlier runtime shape and UI names: the first record is flat with a single Case 1 source; Begin navigation and rendering create nothing. Both Take the desk and Look around first explicitly create it. Look around first says “The casebook is open. Choose any part; you can return to Wren’s question whenever you like.” All record headers show “Story · invented town record”; the map date says “1898 (invented date in this story)”. This is not historical evidence or real flood-safety guidance.

For 3b the fitting choice is first, followed by twice/seven and unreliable-reporter choices; 2d keeps its fitting choice second. The time-span distinction is overlap, not different years. All references to carts in the counts and claim cards mean farm carts; on-foot includes hand-carts. Need a cart becomes used a farm cart; journeys do not establish need. The courier travels on foot. The contrast explicitly distinguishes actual sites from the hypothetical same-gap comparison. The map is not to scale and labels the bridge as bank-top span.

Common numerical feedback is “This answer matches the supplied model” or “This answer does not match the supplied model yet. Compare the quantities or open a hint.” Format replies: number “Enter a whole number, such as 130”; ratio “Use two whole numbers separated by a colon, such as 1:3”; share “Use a fraction, decimal or percent, such as 1/4, 0.25 or 25%”; share with a colon “Write a share as a fraction, decimal or percent, such as 1/4, not with a colon”; rule uses section 5.2's grammar message. Bounds/overflow: “That expression is too large to check here. Use a shorter linear rule with whole numbers.” Complete the three budget comparisons before checking; each comparison gets “matches the fund comparison” or “compare this total with the fund” separately. No source/interpretation/recommendation gets this mechanical match wording.

Additional misconception replies: 1b 1500 “That is the per-metre part. Include the setup once”; 500 “That is one metre. This crossing needs fifteen”; 7500 “The setup is paid once, not for every metre”. 1d 800 “That is the difference in setup costs. How many extra metres use it up?”; 40 “That is the extra cost per metre. Compare it with the setup difference”; 2400 “That is a shared cost. The question asks for the length”. 1e an equivalent wrong coefficient/constant pair receives the common mismatch plus “The fixed part is paid once; the coefficient is how much one extra metre adds.” A coefficient means the number multiplying L. For ratios compute any reversed or non-simplest equivalent pair instead of enumerating exact strings. For 2b 1/3 or 2c-share 1/19: “That compares carts with walkers. Which count includes everyone?”

The 1e tiles are a notation aid, available by tap and keyboard, using the displayed plan's setup, rate, +, ×, L and brackets; they do not preassemble a rule. Record tile use as supplied notation context. Accept correctly grouped thousands commas, lowercase l, spaced adjacency and U+2212 minus. Number input may strip the appropriate coins/m suffix and allow L = before a length; share input rejects ratio syntax with the above prompt. Reject a nonlinear multiplication at its operation, even if a later subtraction would cancel it. No division in rules. There is no promise to accept arbitrary mathematical typography.

The 1c worked example reveals earlier costs; record it as relevant worked-example exposure on every subsequent cost attempt, including reopened 1a/1b. Step 3's Hob guided line is its worked example of source kind, not an accuracy verdict. Step 4's supplied complete plan/reason pair is its worked example. Choosing any supplied sentence records support, and the plain Wren reply never claims steps 1–3 were done. Add the general complete reason “I am weighing who can cross, what it costs, and what remains uncertain” for combined, deferred or custom plans.

3a always returns the source-specific explanation after any selected kind or card arrangement; this is an explicit non-grading exception to choice-specific feedback. The source kind describes the authored document, not the explorer's success. Empty 2e/3c selection may be kept with “No questions chosen yet; you can add one later.” The existing cautious 2d discard choice remains: it is wrong for a specific evidence reason (two observed days still describe those days), as required by AGENTS. It is not a proficiency item.

The recommendation summary lists each step's task IDs with “open”, “kept model match”, “kept model mismatch” or “kept reading”; no learning-level summary. Include first versions and latest kept versions, saved source/model and support separately. A reference drawer can make cross-step information available but never marks a step done.


### 13.3 Final content follow-up

Spec 120's Act I begins on the morning after the storm, so Case 1 uses this consistent timeline: the footbridge was closed as unsafe for the two previous winters; the recent storm took the remaining structure. Record 2 is “The courier's logbook · the two winters while the footbridge was closed”. All seven entries in 13.1 appear in the drawer; those exact entry strings supersede the earlier two illustrative excerpts. The log does not enumerate all flood days. Use delayed or turned back throughout, not stopped or seven floods.

Complete supplied reasons replace dangling fragments: “The causeway costs 740 coins less, which leaves money for other repairs this year”; “A quarter of Saturday's crossings used a farm cart, so the footbridge would not serve those crossings”; “The courier was delayed or turned back seven times in two winters, so a crossing that stays above high water matters”; “The footbridge stays above floods in this story, so walkers and the courier could cross on high-water days”. Retain the complete causeway reason and make the general “I am weighing…” reason available for every plan. Step 4's initial worked example is a neutral writing frame: “My plan is __. My reason is __. One drawback is __. I am unsure about __.” It supplies no preferred decision.

Each split task has its own complete authored support:

| Task | Prompt | Hint | Similar example and first line |
| --- | --- | --- | --- |
| 1e-bridge | Write the footbridge's cost rule for any length L. | The setup is fixed; the coefficient of L is the price per metre. | A plan with setup 80 and 5 per metre has rule 80 + 5L. Your first line: footbridge setup + footbridge rate × L. |
| 1e-causeway | Write the causeway's cost rule for any length L. | The setup is fixed; the coefficient of L is the price per metre. | A plan with setup 80 and 5 per metre has rule 80 + 5L. Your first line: causeway setup + causeway rate × L. |
| 2c-ratio | On rainy Tuesday, write farm carts to walkers in simplest form. | Keep farm carts first; divide both by a common factor. | 3 carts : 27 walkers is 1 : 9. Your first line: 2 : 38. |
| 2c-share | What fraction of Tuesday's crossings used a farm cart? | Use all Tuesday crossings as the whole. | 3 carts among 30 crossings is 3/30 = 1/10. Your first line: 2 / (2 + 38). |

3b replies use IDs, never position: `different` gives “Both accounts may fit: they count different things within overlapping years. That does not prove either account complete”; `twice` gives “Hob counts times it went right under; the courier records interrupted journeys. They may be counting different things”; `wrong` gives the existing uncertainty reply. The source content array fixes the order and line positions at creation. Existing copied-topic learn examples remain deliberate supplied teaching, not independent probes; support records describe that exposure. No assessment claim is made.

Additional supplied objection answers are available to every plan, and none is scored: “The footbridge would help walkers and the courier, even though farm carts still need another route”; “I would accept flood-day detours to make farm-cart access easier on other days”; “The later bridge is a proposal for another year's budget, not a second purchase now”; “Gathering better evidence may avoid spending the fund on the wrong crossing”; “I would compare my other plan's cost, access and limits before proposing it.” Wren's neutral reply is “Thank you. I'll read this out tomorrow, as you set it out.” The current question's specific misconception reply replaces generic mismatch text; no interpretation uses model-match wording. Child-facing summaries use “kept; matches the supplied quantities”, “kept; does not match yet”, “kept reading”, or “open”, with kept values visible; no engineer wording or proficiency summary.

The open set of supplied objection answers is intentional: the UI says these ideas fit different plans and asks the explorer to choose and edit. The page is human-read, never semantically graded. The colon prompt replacement is in section 13.2 and the runtime content; it makes no claim that all ratios compare separate parts.
