# 119. Deeper bench packs: harder cases for benches that already exist

Status: **proposed content specification, 2026-10-23. Documentation review repairs drafted; independent follow-up and content review remain open. Not build-ready.** Written by Claude as a writing-first deliverable; code and art are for the builder. Each proposal below needs independent content review. Existing bench specs continue to govern the unchanged old packs. The new modes require the explicit bounded extensions described below before implementation; this document is not a substitute for those model/UI/source/preservation contracts. Companion to [spec 118](118-keepers-desk-entry.md), whose first case proposes later revisits at several of these benches. The new [119-deeper-bench-packs-text.md](../content/119-deeper-bench-packs-text.md) preserves proposed child-facing learn cards, guided/unguided items, stuck ladders and replies. It is unreviewed authored material for those future commissions, not implementation clearance. Where numbers differ, this spec's numbers govern and the text must be corrected and reviewed; deferred modes remain deferred even if their prose is already written.

## 1. Purpose

Several benches offer a useful first encounter and could host harder work. These proposals reuse their purpose and visual language, but several require new model capabilities, not content-only packs. The [packs strategy](../other-routes-through-the-acts.md#36-packs-not-shells-throughput) is a direction, not evidence that the current runtime can execute these cases.

A later, separately specified extension may add an optional **Harder cases** choice on its bench. Every pack is open to every explorer. When the per-strand starting choices in the [challenge-bands proposal](proposed/challenge-bands.md) reach a bench, its Sapling suggestion may point here; that mapping is a later, separate decision, and a local choice always wins. Each saved new mode must have an explicit understood model/source version and preserve its complete source and outcomes; unchanged v1 work remains readable under the old contract. A source version label alone is not preservation. Transient benches remain transient unless a separately reviewed saved mode is commissioned.

Each pack lists its teaching encounter, contrast, cases with worked answers, and the authored replies that matter most. Numbers are checked; wording is a draft for review.

Each future extension should author the same Jane-derived shape as [spec 118's desk](118-keepers-desk-entry.md#3-conventions-that-make-the-desk-feel-different): a learn card with one worked example first (foldable with **I know this, show me the question**), a guided first case, then unguided cases, and the **I'm stuck** ladder of hint, similar worked example, then skip. Where the Marble teaching research bundled with Jane has a record for a pack's topic, the pack's representations and replies follow it; section 9 says which.

### Implementation boundaries still to specify

Before implementing any row, write and independently review its bounded model, actions/UI, source shape/version, validation, kept-result and recovery behavior. Use the existing bench spec for unchanged behavior; explicitly supersede only the old exclusions needed by the new optional mode. No current pack or historical result is migrated, regraded or rewritten just to fit a new mode. Each row needs a complete finite teaching/help/feedback pack before its own build. This does not call for a generic migration or pack framework.

The new companion text is a draft with representative help/replies, not proof that every offered item has a complete path. Before a particular extension is commissioned, enumerate its finite offered item IDs and check that each checked item has its own authored hint, similar example/start line and skip path, and that every offered choice or tagged error has the required keyed response. Folded initial guidance retains its supplied-support context. This is a bounded content review for the chosen pack, not permission to create a generic coverage system or to build all six at once. Deferred Bramble labels remain outside the first balance extension even though their proposed text exists.

| Proposal | Required extension; current capability is narrower |
| --- | --- |
| Balance | Per-pan counts of equal-mass parcels, bags/opening, paired parcel removal and a ledger; spec 64 v1 has exactly one fixed parcel. Define finite counts/masses and atomic moves. Bramble's no/every-mass labels below are a separately deferred extension. |
| Seed | A distinct two-draw-without-replacement model and 15-trial sets; spec 87 v1 returns each seed and permits six draws per run. Keep old run shapes intact. |
| Sorting | Size and square-stamp features, three baskets, two ordered tests and NOT; spec 84 v1 has two baskets and one stamp/wrap if/else. Define the new trace and saved source/program shape. |
| Count Collection | Mean/median remains proposed here; the first paired-point/scatter slice is handed to spec283 as a separate bench. A numeric-observation dataset is needed; spec 86 v1 stores categorical imaginary-button counts 0–12. Define units, numerical ranges, chart actions and the precise frozen source/results; do not relabel the old button dataset. |
| Sentence Bridges | A new finite transient scene/conjunction catalog and complete meaning notes; spec 109's current route/session, no-save/no-learning-record behavior stays unchanged. No per-question saved pack or independent-attempt record is added here. A persisted extension would need a separate commission. |
| Cartographer / Scale | A bounded map/physical-unit scale-selection and conversion model for the new questions; current map-grid routes and spec 111's fixed 2/4 m-per-edge drawings cannot supply centimetre measurements. Keep existing routes/transient behavior and old saved maps unchanged. |

## 2. Balance Stall: unknowns on both sides

Bench: [spec 64](64-balance-stall.md). The existing pack has one parcel on one pan and loose units. This pack puts identical parcels on both pans and then writes the result as an equation.

**Teaching encounter (Show me how):**

> Every parcel in this pack has the same mass, which we don't know yet. Whatever you take off one pan, take the same off the other, and the pans stay level. That works for parcels too: one parcel off each side keeps the balance, because both parcels have the same mass, even though you don't know what it is.

**Contrast:** taking a parcel off one pan only. The pan rises and the reply says: "Now the two sides aren't the same mass any more. Put it back, or take a parcel off the other side too."

**Cases** (all begin level; P is one parcel's mass in model units):

| ID | Left | Right | Moves that solve it | P | Check |
| --- | --- | --- | --- | --- | --- |
| `both-sides-1` | 3 parcels + 4 units | 1 parcel + 12 units | Remove 1 parcel and 4 units from each side: 2 parcels = 8 | 4 | 16 = 16 |
| `both-sides-2` | 2 parcels + 9 units | 5 parcels | Remove 2 parcels from each side: 9 units = 3 parcels | 3 | 15 = 15 |
| `both-sides-3` | 4 parcels + 1 unit | 2 parcels + 11 units | Remove 2 parcels and 1 unit from each side: 2 parcels = 10 | 5 | 21 = 21 |
| `bags-of-three` | 3 bags, each holding 1 parcel + 2 units | 1 parcel + 14 units | Open the bags (3 parcels + 6 units), then as above: 2 parcels = 8 | 4 | 18 = 18 |

After each solved case, the stall's ledger shows the equation beside the balance, for example `3P + 4 = P + 12`, then each move as a line (`2P + 4 = 12`, `2P = 8`, `P = 4`). The explorer can step through the lines and see each one's balance.

**Deferred authored idea: Bramble's labels** (outside the first new pack; retain for a separate model/teaching review and commission). No/every-mass cases need symbolic solution-class semantics and cannot be shown honestly as a fixed positive-mass apparatus that always begins level:

> Bramble has written labels for two balances but hasn't tried them. Can each one ever be level?

- `never-level`: left 2 parcels + 3 units, right 2 parcels + 5 units. Removing 2 parcels from each side leaves 3 against 5. *No parcel mass makes these level.*
- `always-level`: left 2 parcels + 6 units, right 2 bags each holding 1 parcel + 3 units. Opening the bags gives the same pans. *Any parcel mass keeps these level.*

Reply after both: "Some balances have one answer, some have none, and some work for every mass. The ledger shows which: if the parcels cancel and the units don't match, there's no answer; if everything cancels, every mass works."

**Marble research notes (Solving Linear Equations):** the pack follows its recommended balance model, one true equation per ledger line, collecting the unknown on the side with more by taking the smaller number of parcels from both pans, checking by putting the answer back into the starting balance, with one positive-mass solution in the first proposed pack. Naming the none/every-mass cases belongs only to the separately deferred Bramble's labels extension. Its listed misconceptions get authored replies: an operation on one pan only (the contrast above), and a run-on ledger line such as `2P = 8 = 4` ("Each line should be true by itself. 2P isn't 4; P is."). Its advice to handle negative answers explicitly is a **documented exception**: positive masses only, so negative solutions wait for a separate pack with a model that can show them, such as algebra tiles with zero pairs.

**Hard prerequisites:** Writing Algebraic Equations, Substituting into Formulae and Using inverse operations have no declared reference in the app. The ledger lines teach the first two inline. The removal moves are inverse operations made concrete.

**Candidate topics:** `mt_QhFEDyIwSO` Solving Linear Equations; `mt_z5iwdZyeDr` Algebraic Transformations; `mt_KwdjWEmMNo` Algebraic Notation. Positive whole-number masses only; negative quantities remain outside the model.

## 3. Seed Stall: drawing without putting back

Bench: [spec 87](87-seed-stall-chance.md), which deliberately deferred the without-replacement contrast to its own review. This pack is that contrast.

**Setup:** a frozen bag of 6 seeds, 2 sun and 4 moon. A trial is **two draws, keeping the first seed out**. The bag refills before the next trial.

**Teaching encounter:**

> When you put a seed back, the bag is the same for every draw. When you keep it out, the second draw comes from a smaller bag, and what's left depends on what came out first.
>
> Draw a sun first: 5 seeds are left, and only 1 is a sun. Draw a moon first: 5 are left, and 2 are suns.

A tree diagram is built branch by branch as the explorer chooses first and second draws:

| Outcome | Without putting back | Putting back (for comparison) |
| --- | --- | --- |
| Sun, sun | 2/6 × 1/5 = 2/30 = 1/15 | 2/6 × 2/6 = 1/9 |
| One of each (either order) | 2 × (2/6 × 4/5) = 16/30 = 8/15 | 2 × (2/6 × 4/6) = 4/9 |
| Moon, moon | 4/6 × 3/5 = 12/30 = 2/5 | 4/6 × 4/6 = 4/9 |
| Total | 30/30 | 9/9 |

**Tasks:** predict which outcome is most likely; fill the tree's branches (Check my working for each fraction); run up to three sets of 15 trials with a tally; compare the tallies with 1/15, 8/15 and 2/5 of 15 (1, 8 and 6 trials).

**Contrast:** "Is sun-sun less likely when you keep the first seed out?" Yes: 1/15 against 1/9, because after one sun there's only one left.

**Reply when a run of 15 doesn't match the expected counts:** "Fifteen trials is a short run. The fractions say what happens on average over very many trials, not what any one run must show."

**Marble research notes (Tree diagrams; Experimental vs Theoretical):** multiply along a branch and add across paths; recompute the second branch from the smaller bag; keep fractions uncancelled until the end (thirtieths here) so the paths add easily. Tagged wrong choices with replies:

| Wrong entry | Misconception | Reply |
| --- | --- | --- |
| 2/6 on the sun-then-sun branch | Reusing the first draw's probability for the second draw | "One sun is already out. How many seeds are left, and how many are suns?" |
| 2/6 + 1/5 for sun, sun | Adding along a branch | "Along a branch you need both to happen: multiply. Add only when you join different paths." |
| "Moon is due after three suns" | The gambler's fallacy | "The bag doesn't remember. Each trial starts with a full bag of 2 sun and 4 moon." |

**Hard prerequisites:** Tree diagrams needs Sets & Venn Diagrams and Experimental probability, and Experimental probability needs The Probability Scale. None has a declared reference in the app. The existing Seed Stall covers simple chance experiments (referenced). This pack lists outcomes systematically and shows each result on a 0 to 1 line in its learn card. Venn diagrams are a **documented exception**, and the tree here is a two-stage ordered list, not a general sample-space method.

**Candidate topics:** `mt_GDtFU5fyUv` Tree diagrams; `mt_-bMnJcPJy8` Experimental vs Theoretical; `mt_sHJqh6UUya` Experimental probability. Still a screen model, never evidence about a real bag.

## 4. Willow Sorting Desk: rules with order

Bench: [spec 84](84-willow-sorting-desk.md) and [Willow Double Check, spec 101](101-willow-double-check.md). This pack adds a third basket and a rule with two tests, where the order of the tests matters.

**Parcels** have three visible features: stamp (star, circle or square), wrap (blue or yellow), size (small or large).

**Request:**

> Wren asks: Large parcels go in the Cart basket, whatever their stamp. Of the rest, star stamps go in the Lantern basket. Everything else goes in the Leaf basket.

**Rule template:** **If [test 1], put it in [basket]; else if [test 2], put it in [basket]; otherwise put it in [basket].**

**Cases and contrasts:**

| Parcel | Request's basket | What it tests |
| --- | --- | --- |
| Small, blue, star | Lantern | The star test |
| Large, yellow, circle | Cart | The size test |
| Small, yellow, square | Leaf | Neither test: the otherwise branch |
| **Large, blue, star** | Cart | **Order.** A rule that tests the star first sends this to Lantern |

**Teaching encounter:**

> The machine checks the tests from the top and stops at the first one that's true. If two tests could both be true for one parcel, the one you put first wins. Ask: which parcel would both tests catch?

**Reply when star-first sends the large star parcel to Lantern:** "The machine did exactly what the rule said. The rule checked the stamp before the size. Which test does Wren care about first?"

**Second request, for NOT:** "Anything that isn't blue goes in the Leaf basket; blue parcels go in the Lantern basket." The explorer can build it as *If not blue → Leaf, otherwise Lantern* or *If blue → Lantern, otherwise Leaf*. Both are accepted. The reply says they sort every parcel the same way.

**Candidate topics:** C1-II deterministic rules; a later machine-learning case (spec 118 §8, "The sorting machine") contrasts these hand-written rules with a sorter that learned from examples.

## 5. Count Collection: a usual value, and when it misleads

Bench: [My Count Collection, spec 86](86-count-collection.md). This pack supplies a fixed dataset and asks which summary describes it fairly.

**Dataset:** the masses of five parcels waiting at the post office, in kilograms: **2, 3, 3, 4, 18.** (The 18 kg parcel is an iron bearing for the mill.)

**Tasks:**

- Find the **mean**: (2 + 3 + 3 + 4 + 18) ÷ 5 = 30 ÷ 5 = **6 kg**.
- Find the **median**: middle value in order = **3 kg**.
- "The courier asks: how heavy is a usual parcel?" Choices: 6 kg (the mean); 3 kg (the median); 10 kg (the midrange misconception). The authored replies explain that four of the five parcels weigh 4 kg or less, so the median describes a usual parcel better here, and that the mean is still the right number for a different question: "If the five parcels were shared evenly between five bags, how much would each bag hold?"
- Remove the iron bearing: mean (2 + 3 + 3 + 4) ÷ 4 = **3 kg**, median (3 + 3) ÷ 2 = **3 kg**. One unusual value moved the mean by 3 kg and the median not at all.

- **Reverse problem** (the research's test of meaning): "A sixth parcel arrives. Now the mean of all six is 7 kg. How heavy is the new parcel?" *Total 6 × 7 = 42; 42 − 30 = **12 kg**.* Reply to an entry of 7: "That's the new mean, not the new parcel. If six parcels share 42 kg evenly, what must the new one add?"
- Notice that the mean of the first five, 6 kg, is not the mass of any parcel. The reply says so plainly, because expecting the mean to be one of the values is a listed misconception.

**Teaching encounter** (Marble research for Calculating the Mean: the levelling model first, and the total = mean × count relationship):

> Stack the five parcels' kilograms as towers: 2, 3, 3, 4 and 18. Level them out by moving kilograms from tall towers to short ones until all five are the same height. They level at 6. That's the mean: the total, 30, shared fairly between 5.
>
> The mean shares everything out evenly. The median is the one in the middle when you line them up. One very large value pulls the mean towards it; the median barely notices.

**First scatter-slice handoff:** [spec283](283-paired-points.md) owns the bounded paired-points build, with original invented datasets and a separate root. Mean/median remains deferred in this section. The rain/delay table below is historical proposal material, not a second build commission; broader negative/no-association, best-fit and prediction lessons still need their own contracts.

**Deferred association dataset:** eight invented weeks of courier records.

| Week | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rain (mm) | 5 | 12 | 20 | 8 | 30 | 25 | 2 | 15 |
| Days delayed | 0 | 1 | 2 | 0 | 3 | 3 | 0 | 1 |

Plot the points; describe the pattern in words first (wetter weeks had more delays), then name it as a positive correlation. A causal-reasoning card must stay within this invented table: "Wetter weeks have more recorded delays here. Does that show what caused the delays?" The fitting explanation is that the table shows association, while records about conditions and how the observations were collected are absent. A possible unrecorded factor is a hypothesis, not supplied evidence. Do not assert that market weeks cause rain, invent market counts absent from the table, or present a physically incoherent reverse-cause story as an equally plausible explanation. This draft still needs its finite causal text and subject/model review before build; naming four generic explanations does not establish any of them for these records. A second card shows two scatters with lines of the same steepness, one tight and one loose, because the steepness of a line is often mistaken for the strength of a correlation.

**Hard prerequisites:** Coordinates (age 11+) and Comparing measurements have no declared reference; plotting in the first quadrant does. Eight whole-number points need only first-quadrant plotting, so this is a documented narrowing. No line of best fit is drawn in this pack.

**Candidate topics:** `mt_Cg8VPguS_V` Calculating the Mean remains here; the first `mt_8atyuvPUZc` Scatter Graphs & Correlation foothold is scoped in283, without claiming the complete topic. Supplied example data, never a survey of real people.

## 6. Sentence Bridges: joining words that change the weight

Bench: [spec 109](109-sentence-bridges.md), which uses *and*, *because* and *but*. This pack adds *although*, *unless* and *whereas*, using spec 118's case so the sentences have stakes.

**Scenes, with exact meaning notes:**

| Two sentences | Joined | Meaning note |
| --- | --- | --- |
| The causeway is cheaper. It floods. | **Although** the causeway is cheaper, it floods. | The flooding is the point the writer wants you to keep. |
| | The causeway floods, **although** it is cheaper. | The same two facts; now the price is the afterthought. |
| The courier normally crosses at the ford. When water covers the stones, the courier turns back. | The courier crosses at the ford **unless** the water is over the stones. | High water stops the courier. |
| | The courier crosses at the ford **if** the water is over the stones. | This says high water is when the courier crosses; the source instead says the courier turns back then. |
| The footbridge takes walkers. The causeway takes carts. | The footbridge takes walkers, **whereas** the causeway takes carts. | A contrast between two things, without saying either is better. |

**Teaching encounter:**

> *Although* joins two things that pull against each other and tells the reader which one to keep in mind. *Unless* names the one case where something doesn't happen. *Whereas* sets two things side by side to show a difference.

**Contrast:** the *unless*/*if* pair above, checked against the unchanged source sentences.

**Candidate topics:** E2 subordinating conjunctions (the exact Marble topic to be located in review). Supplied sentences do not establish independent composition.

## 7. Cartographer's Table: choosing a scale

Bench: [spec 58](58-cartographers-table.md) and [Same route, different scale, spec 111](111-same-route-different-scale.md), which change a supplied scale. This pack asks the explorer to choose one.

**Task:**

> Wren wants a map of the river from the mill to the far bend, **600 metres**, on a sheet **30 centimetres** wide.

- Choose a scale from: 1 cm for 10 m; 1 cm for 20 m; 1 cm for 50 m. *1 cm for 10 m needs 60 cm and won't fit. 1 cm for 20 m fills the sheet exactly. 1 cm for 50 m fits in 12 cm, leaving room for the key.* Both fitting scales are accepted; the reply names what each gains.
- With 1 cm for 20 m: the narrows (24 m) are **1.2 cm** and the ford (15 m) is **0.75 cm**. "Would you be able to see the difference between the narrows and the ford at this scale?"
- An inset at 1 cm for 5 m: narrows **4.8 cm**, ford **3 cm**.
- **Reading the other way:** "On the 1 cm for 20 m map, the mill to the library measures 7.5 cm. How far is that?" *7.5 × 20 = **150 m**.* Reply to 0.375 (dividing): "The real distance should be bigger than the map distance. One centimetre stands for 20 metres, so multiply." Reply to 150 cm: "That's the map count times 20, but in which unit? Each centimetre stands for 20 *metres*."

The research for this topic recommends practising both directions, map to real and real to map, checking the size of an answer before working it out, and converting units as a separate last step. The pack does all three.

**Teaching encounter:**

> A scale says how much ground one centimetre stands for. A big area needs each centimetre to stand for more, and then small things get tiny. Maps often add a second, closer map for the part that matters.

**Candidate topics:** `mt_1badik7iKJ` Scale and similar shapes (age 11+), already the one referenced topic in this source range, now with a chosen scale.

## 8. Gates for a future extension (not current build acceptance)

1. Before build, the extension has its own independently reviewed bounded model/UI/source/preservation contract and complete authored content. It is optional and open to every explorer; existing packs and records stay unchanged.
2. Its newly specified model reproduces the worked values for the commissioned slice. The old bench model is not claimed to do so; deferred Bramble labels are excluded.
3. Choice order varies across questions, stays fixed within a saved question, and the fitting choice is not given away by length or tone.
4. For a commissioned saved mode, work keeps its complete understood frozen source/model and version; a later wording, key or pack edit never rewrites it. Existing transient Sentence Bridges and Scale remain transient; no save requirement is imposed on them by this proposal.
5. In saved modes, initially shown teaching/guided work and later requested help remain distinct support context, and familiarity stays separate from attempts. Folding never clears shown support or makes an attempt independent. Transient benches keep their existing no-learning-record contract.
6. No band, age or level is written by choosing a pack.

## 9. Upstream overlap (AGENTS.md)

Refreshed 2026-10-23: Jane at `1927912b8d9cd4f7df6e7fbe8416521194743060` (`LESSONS.md` and its bundled Marble teaching research, `data/marble/teaching-research.json`, os-taxonomy `a871973`). The app's vendored Marble pin and the topic IDs above are unchanged.

- **Jane conventions adopted as design:** teach, guided, then independent; the stuck ladder; misconception-tagged wrong choices with short replies; second person and short prompts. Its bosses, medals, review gates and mastery inference are not adopted. No Jane code or prose is copied.
- **Marble research records used:** Solving Linear Equations (section 2), Tree diagrams and Experimental vs Theoretical (section 3), Calculating the Mean (section5); Scatter Graphs & Correlation informed this historical proposal, with its bounded first runtime slice now handed to283, Scale and similar shapes, age 11+ (section 7). Their representations and misconceptions are paraphrased as design notes. The research text (CC BY-SA 4.0, © Generative Spark, Inc.) is not reproduced.
- **No research record consulted** for the Sorting Desk and Sentence Bridges packs. Those rest on the earlier benches' own reviewed sources and need a subject reviewer.
- **Hard prerequisites:** each pack names the hard prerequisites from `curriculum/marble/dependencies.json` that the app does not yet reference, and how the pack supports them or why it narrows them, as spec 49 section 8 requires.
