# 119. Deeper bench packs: harder cases for benches that already exist

Status: **proposed content specification, 2026-10-23. Not reviewed, not build-ready.** Written by Claude as a writing-first deliverable; code and art are for the builder. Each pack below needs independent content review, and the benches' own specs govern their models, saves and accessibility. Companion to [spec 118](118-keepers-desk-entry.md), whose first case revisits several of these benches.

## 1. Purpose

Several benches teach a real idea with a model that would carry much harder work, but stop at the first encounter. An explorer who has the idea needs harder cases in the same model, so the bench stays worth visiting. This is the "packs, not shells" strategy from [other routes through the acts](../other-routes-through-the-acts.md#36-packs-not-shells-throughput): new authored content in a proven interaction, with no new game.

Each bench gets one optional **Harder cases** pack, chosen locally on the bench like any other pack. Every pack is open to every explorer. When the per-strand starting choices in the [challenge-bands proposal](proposed/challenge-bands.md) reach a bench, its Sapling suggestion may point here; that mapping is a later, separate decision, and a local choice always wins. Each pack has its own source ID and version, and saved work keeps the pack version it was started with.

Each pack lists its teaching encounter, contrast, cases with worked answers, and the authored replies that matter most. Numbers are checked; wording is a draft for review.

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

**Bramble's labels** (a new mode in this pack; the bench review must decide whether it fits, since these cases do not begin level):

> Bramble has written labels for two balances but hasn't tried them. Can each one ever be level?

- `never-level`: left 2 parcels + 3 units, right 2 parcels + 5 units. Removing 2 parcels from each side leaves 3 against 5. *No parcel mass makes these level.*
- `always-level`: left 2 parcels + 6 units, right 2 bags each holding 1 parcel + 3 units. Opening the bags gives the same pans. *Any parcel mass keeps these level.*

Reply after both: "Some balances have one answer, some have none, and some work for every mass. The ledger shows which: if the parcels cancel and the units don't match, there's no answer; if everything cancels, every mass works."

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

**Dataset:** the masses of five parcels waiting at the post office, in kilograms: **2, 3, 3, 4, 18.** (The 18 kg parcel is a millstone for the mill.)

**Tasks:**

- Find the **mean**: (2 + 3 + 3 + 4 + 18) ÷ 5 = 30 ÷ 5 = **6 kg**.
- Find the **median**: middle value in order = **3 kg**.
- "The courier asks: how heavy is a usual parcel?" Choices: 6 kg (the mean); 3 kg (the median); 18 kg (the heaviest); "it depends what you need to know". The authored replies explain that four of the five parcels weigh 4 kg or less, so the median describes a usual parcel better here, and that the mean is still the right number for a different question: "If the five parcels were shared evenly between five bags, how much would each bag hold?"
- Remove the millstone: mean (2 + 3 + 3 + 4) ÷ 4 = **3 kg**, median (3 + 3) ÷ 2 = **3 kg**. One unusual value moved the mean by 3 kg and the median not at all.

**Teaching encounter:**

> The mean shares everything out evenly. The median is the one in the middle when you line them up. One very large value pulls the mean towards it; the median barely notices.

**Second dataset (association, not cause):** eight weeks of the courier's records.

| Week | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rain (mm) | 5 | 12 | 20 | 8 | 30 | 25 | 2 | 15 |
| Days delayed | 0 | 1 | 2 | 0 | 3 | 3 | 0 | 1 |

Plot the points; describe the pattern (wetter weeks had more delays). Then a contrast card: "The same weeks also had the most market stalls, because market weeks happened to be wet. Can we tell from this table whether rain or markets caused the delays?" The fitting reply: not from this table alone; both rose together.

**Candidate topics:** `mt_Cg8VPguS_V` Calculating the Mean; `mt_8atyuvPUZc` Scatter Graphs & Correlation. Supplied example data, never a survey of real people.

## 6. Sentence Bridges: joining words that change the weight

Bench: [spec 109](109-sentence-bridges.md), which uses *and*, *because* and *but*. This pack adds *although*, *unless* and *whereas*, using spec 118's case so the sentences have stakes.

**Scenes, with exact meaning notes:**

| Two sentences | Joined | Meaning note |
| --- | --- | --- |
| The causeway is cheaper. It floods. | **Although** the causeway is cheaper, it floods. | The flooding is the point the writer wants you to keep. |
| | The causeway floods, **although** it is cheaper. | The same two facts; now the price is the afterthought. |
| The courier crosses at the ford. The water is over the stones. | The courier crosses at the ford **unless** the water is over the stones. | High water stops her. |
| | The courier crosses at the ford **if** the water is over the stones. | The opposite: high water is when she crosses. The source doesn't say this. |
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

**Teaching encounter:**

> A scale says how much ground one centimetre stands for. A big area needs each centimetre to stand for more, and then small things get tiny. Maps often add a second, closer map for the part that matters.

**Candidate topics:** `mt_1badik7iKJ` Scale and similar shapes (age 11+), already the one referenced topic in this source range, now with a chosen scale.

## 8. Acceptance (for each pack)

1. The pack is optional, reachable from its bench, and open to every explorer; the existing packs are unchanged.
2. Every worked value above is reproduced by the bench's model and **Check my working**.
3. Choice order varies across questions, stays fixed within a saved question, and the fitting choice is not given away by length or tone.
4. Saved work keeps its pack source ID and version; a later wording or pack edit never rewrites it.
5. Show me how is recorded as support; familiarity and independent attempts stay separate.
6. No band, age or level is written by choosing a pack.

## 9. Upstream overlap (AGENTS.md)

Studied from the pinned notes in `docs/upstream-opportunities.md`; not refreshed. Marble topic IDs are candidate encounters only. Jane's balance stages and worked-example formats informed the earlier benches; nothing new from Jane is incorporated here. Refresh before building.
