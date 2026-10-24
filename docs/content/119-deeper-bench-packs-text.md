# Deeper bench packs: item text

Companion to [spec 119](../specs/119-deeper-bench-packs.md), which owns the models, cases and acceptance; where this file and the spec disagree, the spec's numbers govern. Status: **proposed child-facing text, 2026-10-23. Not reviewed, not build-ready.** Every pack needs content review, and the benches' own specs govern layout, saves and accessibility.

Every pack follows the same order:

1. **Learn card** with one worked example, revealed a line at a time. **I know this, show me the question** folds it; **Show me how** reopens it and is recorded as support.
2. **Guided first item**, with its working lines shown unless folded.
3. **Unguided items.**
4. Each checked item has **I'm stuck**: hint, then a similar easier example with how to start this one, then **Skip for now**.
5. Wrong entries tagged with a misconception get a reply of 20 words or fewer.

Prompts are second person and 15 words or fewer where possible. Multiple-choice items have three choices; their order varies across items and stays fixed within a saved item. The fitting choice is marked ← here for reviewers only.

---

## 1. Balance Stall: unknowns on both sides

**Pack title:** Parcels on both pans · **Card line:** Same parcels, both sides. Find what one weighs.

### Learn card

> Every parcel in this pack weighs the same. We don't know how much yet.
>
> Take the same off both pans, and they stay level. That works for parcels too.
>
> Worked example. Left: 2 parcels and 3 units. Right: 1 parcel and 7 units. Level.
> Take 1 parcel off each side. Left: 1 parcel and 3 units. Right: 7 units. Still level.
> Take 3 units off each side. Left: 1 parcel. Right: 4 units.
> One parcel weighs 4.
>
> Check: put 4 back in. Left: 4 + 4 + 3 = 11. Right: 4 + 7 = 11. Level.
>
> The ledger writes each step as a line: `2P + 3 = P + 7`, `P + 3 = 7`, `P = 4`.

### Guided first item: `both-sides-1`

**Prompt:** The pans are level. Find what one parcel weighs.
**Setup:** Left 3 parcels + 4 units. Right 1 parcel + 12 units.
**Working lines (shown unless folded):**
1. Take 1 parcel off each side. → `2P + 4 = 12`
2. Take 4 units off each side. → `2P = 8`
3. Split both sides in two. → `P = 4`

**Check line after solving:** "Put 4 back in: 3 × 4 + 4 = 16 and 4 + 12 = 16. Level."

### Unguided items

| ID | Prompt | Setup | Answer | Check |
| --- | --- | --- | --- | --- |
| `both-sides-2` | The pans are level. What does one parcel weigh? | Left 2 parcels + 9 units. Right 5 parcels. | P = 3 | 15 = 15 |
| `both-sides-3` | Find one parcel's weight. Take the fewer parcels off first. | Left 4 parcels + 1 unit. Right 2 parcels + 11 units. | P = 5 | 21 = 21 |
| `bags-of-three` | Each bag holds 1 parcel and 2 units. Open them, then solve. | Left 3 bags. Right 1 parcel + 14 units. | P = 4 | 18 = 18 |

### I'm stuck

**`both-sides-2`**
1. *Hint:* "Which side has fewer parcels? Take that many off both sides."
2. *Similar:* "Left 1 parcel + 6 units, right 3 parcels. Take 1 parcel off each: 6 units = 2 parcels, so one is 3. Now take 2 parcels off each side."
3. **Skip for now.**

**`both-sides-3`**
1. *Hint:* "Take 2 parcels off each side first. What's left?"
2. *Similar:* "Left 3 parcels + 2, right 1 parcel + 8. Take 1 parcel off each: 2 parcels + 2 = 8. Take 2: 2 parcels = 6, so one is 3. Now yours."
3. **Skip for now.**

**`bags-of-three`**
1. *Hint:* "Open the three bags. How many parcels and units are on the left now?"
2. *Similar:* "2 bags, each 1 parcel + 1 unit, is 2 parcels + 2 units. Now open 3 bags of 1 parcel + 2 units."
3. **Skip for now.**

### Replies to tagged wrong moves

| Move or entry | Misconception | Reply |
| --- | --- | --- |
| A parcel taken off one pan only | Doing something to one side only | "Now the two sides aren't the same mass. Put it back, or take one off the other side too." |
| Ledger line `2P = 8 = 4` | Run-on equals | "Each line should be true by itself. 2P isn't 4; P is." |
| P = 8 in `both-sides-1` | Stopping at 2P | "That's two parcels. What does one weigh?" |
| P = 12 in `both-sides-1` | Reading off a pan total | "12 is the units on the right. Remove the same from both sides first." |
| P = 4 in `both-sides-3` (from 4P + 1 = 2P + 11 → 2P = 10 → P = 4) | Arithmetic slip in the last step | "Check it: 4 × 4 + 1 and 2 × 4 + 11. Are they level?" |
| `bags-of-three`: 3 parcels + 2 units on the left | Opening the bags but adding the units once | "Each bag has 2 units. Three bags have how many?" |

### Deferred authored idea: Bramble's labels

Outside the first balance extension. These proposed no/every-mass tasks need a separate model and teaching review and commission, as specified in spec 119; their presence here does not clear them for the first pack.

**Prompt:** Bramble wrote two labels but hasn't tried them. Can each balance ever be level?

| ID | Setup | Choices | Fitting |
| --- | --- | --- | --- |
| `never-level` | Left 2 parcels + 3 units. Right 2 parcels + 5 units. | Yes, for one mass · No, never · Yes, for every mass | No, never |
| `always-level` | Left 2 parcels + 6 units. Right 2 bags, each 1 parcel + 3 units. | Yes, for one mass · No, never · Yes, for every mass | Yes, for every mass |

**Replies:** to "for one mass" on `never-level`: "Take 2 parcels off each side. Is 3 ever equal to 5?" To "never" on `always-level`: "Open the bags. Do the pans look different?"
**After both:** "Some balances have one answer, some have none, and some work for every mass. If the parcels cancel and the units don't match, there's no answer. If everything cancels, every mass works."

---

## 2. Seed Stall: drawing without putting back

**Pack title:** Keep it out · **Card line:** Draw two seeds without putting the first back.

### Learn card

> When you put a seed back, the bag is the same for every draw.
> When you keep it out, the second draw comes from a smaller bag.
>
> Worked example. A bag has 1 sun and 2 moon seeds. Draw two, keeping the first out.
> Chance the first is sun: 1 out of 3, so 1/3.
> If the first was sun, the bag has 2 left, both moon. Chance the second is sun: 0/2.
> Sun, then sun: 1/3 × 0/2 = 0. It can't happen.
>
> Along a branch, both things must happen: multiply.
> To join different paths, add.

### Guided first item: `tree-first-branch`

**Prompt:** A bag has 2 sun and 4 moon seeds. What's the chance the first seed is sun?
**Working lines:** "How many seeds altogether?" (6) → "How many are sun?" (2) → `2/6`.
**Answer:** 2/6 (1/3 accepted, with the reply "Keep it as 2/6 for now. Sixths will make the next step easier to add.")

### Unguided items

| ID | Prompt | Answer |
| --- | --- | --- |
| `tree-sun-then-sun` | First seed was sun. Chance the second is sun? | 1/5 |
| `tree-moon-then-sun` | First seed was moon. Chance the second is sun? | 2/5 |
| `tree-path-sun-sun` | Chance of sun, then sun? | 2/6 × 1/5 = 2/30 |
| `tree-path-mixed` | Chance of one of each, in either order? | 8/30 + 8/30 = 16/30 |
| `tree-path-moon-moon` | Chance of moon, then moon? | 4/6 × 3/5 = 12/30 |
| `tree-total` | Add all three. What do you get? | 30/30 = 1 |
| `predict` | Which is most likely? Two suns · one of each · two moons | One of each |
| `compare-replacement` | Is sun-sun less likely when you keep the first seed out? Yes · No · The same | Yes (1/15 against 1/9) |
| `expected-15` | In 15 trials, about how many of each would you expect? | 1 sun-sun, 8 mixed, 6 moon-moon |

**Trial runs:** up to three sets of 15, each tallied beside the expected counts.

### I'm stuck

**`tree-sun-then-sun`**
1. *Hint:* "One sun is already out. How many seeds are left? How many are sun?"
2. *Similar:* "Bag of 3 sun, 2 moon. First is sun. Left: 2 sun, 2 moon, so 2/4. Now our bag after one sun."
3. **Skip for now.**

**`tree-path-mixed`**
1. *Hint:* "There are two paths: sun then moon, and moon then sun. Find each, then add."
2. *Similar:* "Sun then moon: 2/6 × 4/5 = 8/30. Now moon then sun: 4/6 × ?"
3. **Skip for now.**

**`expected-15`**
1. *Hint:* "Change each thirtieth into fifteenths first. 2/30 is how many fifteenths?"
2. *Similar:* "16/30 = 8/15, so about 8 in 15 trials. Now 2/30 and 12/30."
3. **Skip for now.**

### Replies to tagged wrong entries

| Entry | Misconception | Reply |
| --- | --- | --- |
| 2/6 for `tree-sun-then-sun` | Reusing the first draw's chance | "One sun is already out. How many seeds are left, and how many are suns?" |
| 2/6 + 1/5 for sun-sun | Adding along a branch | "Along a branch, both must happen: multiply. Add only when joining paths." |
| 8/30 for `tree-path-mixed` | Forgetting the second order | "That's sun then moon. Moon then sun is one of each too." |
| 1/5 for `tree-moon-then-sun` | Copying the other branch | "The first was moon, so both suns are still in. How many seeds left?" |
| "Moon is due" after three sun-suns | Gambler's fallacy | "The bag doesn't remember. Each trial starts with 2 sun and 4 moon." |
| A run of 15 that doesn't match | Expecting a short run to match | "Fifteen trials is short. The fractions describe very many trials, not any one run." |

---

## 3. Willow Sorting Desk: rules with order

**Pack title:** Which test first? · **Card line:** Three baskets, two tests. The order matters.

### Learn card

> The machine checks the tests from the top. It stops at the first one that's true.
>
> Worked example. Rule: *If it's blue, put it in Lantern. Otherwise, if it's small, put it in Leaf. Otherwise, Cart.*
> A small blue parcel: is it blue? Yes. Lantern. The machine never asks about size.
> A small yellow parcel: blue? No. Small? Yes. Leaf.
> A large yellow parcel: blue? No. Small? No. Cart.
>
> If one parcel could pass both tests, the test you put first wins.

### Guided first item: `order-star-small`

**Prompt:** Wren's request: Large parcels in Cart. Of the rest, star stamps in Lantern. Everything else in Leaf.
**Rule template:** If [test 1], put it in [basket]; else if [test 2], put it in [basket]; otherwise put it in [basket].
**Guided working (the first slot filled step by step):** "What does Wren care about first?" → large → Cart. "Then?" → star → Lantern. "Everything else?" → Leaf.
**Answer:** *If large → Cart; else if star → Lantern; otherwise → Leaf.*

### Unguided items

Run the explorer's rule on these, then compare with Wren's request:

| ID | Parcel | Wren's basket |
| --- | --- | --- |
| `p-small-blue-star` | Small, blue, star | Lantern |
| `p-large-yellow-circle` | Large, yellow, circle | Cart |
| `p-small-yellow-square` | Small, yellow, square | Leaf |
| `p-large-blue-star` | Large, blue, star | Cart |

`order-question`: "Which parcel would both tests catch?" Choices: small blue star · large blue star ← · small yellow square. Reply to the first: "It's a star, but is it large?"

`not-rule`: Wren's second request: "Anything that isn't blue goes in Leaf. Blue parcels go in Lantern." Build it. Both *If not blue → Leaf, otherwise Lantern* and *If blue → Lantern, otherwise Leaf* are accepted. Reply after either: "Both rules sort every parcel the same way. Try the other one and see."

### I'm stuck

**`order-star-small`**
1. *Hint:* "Read Wren's request again. Which basket does she mention first, and for what?"
2. *Similar:* "Request: 'Heavy ones in the barrow. Of the rest, red ones in the box.' Rule: If heavy → barrow; else if red → box. Now Wren's."
3. **Skip for now.**

### Replies

| Entry | Misconception | Reply |
| --- | --- | --- |
| Star test first; large blue star goes to Lantern | Test order doesn't matter | "The machine did exactly what the rule said. It checked the stamp first. Which test does Wren care about first?" |
| *If large → Cart; if star → Lantern* (no else) | Treating each test as separate | "Without *else*, a large star passes both tests. Which basket does it end in?" |
| *If not blue → Lantern* in `not-rule` | Swapping the branches | "Run a yellow parcel. Where does Wren want it?" |

**Closing card:** "A person who knows what matters can write the rule. A machine that copies examples has to be shown what matters." Links to the Keeper's Desk case *The borrowed sorting machine* when it is in the explorer's casebook.

---

## 4. Count Collection: a usual value, and when it misleads

**Pack title:** Usual, or average? · **Card line:** Five parcels. One is very heavy.

### Learn card

> Stack each parcel's kilograms as a tower: 2, 3, 3, 4 and 18.
> Move kilograms from tall towers to short ones until all five are level.
> They level at 6. That's the **mean**: the total, 30, shared evenly between 5.
>
> Line the parcels up from lightest to heaviest. The one in the middle is the **median**: 3.
>
> One very large value pulls the mean towards it. The median barely notices.

### Guided first item: `mean-five`

**Prompt:** Find the mean mass of the five parcels.
**Working lines:** `2 + 3 + 3 + 4 + 18 = ?` (30) → `30 ÷ 5 = ?` (6).
**Answer:** 6 kg.

### Unguided items

| ID | Prompt | Answer |
| --- | --- | --- |
| `median-five` | Find the median mass. | 3 kg |
| `usual-parcel` | {courier} asks: how heavy is a usual parcel? 6 kg · 3 kg · 10 kg | 3 kg ← (see replies) |
| `mean-question` | Which question does the mean answer best? | "Shared evenly between five bags, how much in each?" ← · "How heavy is a usual parcel?" · "Which parcel is heaviest?" |
| `mean-without` | Take away the 18 kg bearing. New mean? | 3 kg |
| `median-without` | And the new median? | 3 kg |
| `moved-by` | How far did the mean move? And the median? | 3 kg; 0 kg |
| `reverse-sixth` | A sixth parcel arrives. Now the mean of six is 7 kg. How heavy is it? | 12 kg |
| `mean-is-a-value` | Is any parcel 6 kg? Yes · No · Can't tell | No |

### Second dataset: rain and delays

| Week | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rain (mm) | 5 | 12 | 20 | 8 | 30 | 25 | 2 | 15 |
| Days delayed | 0 | 1 | 2 | 0 | 3 | 3 | 0 | 1 |

**Learn card (scatter):**

> Each week is one dot: across for rain, up for delays.
> If the dots climb from left to right, wetter weeks had more delays. That's a **positive correlation**.
> A correlation says two things went together. It doesn't say why. There are four kinds of why:
> rain caused the delays; something else caused both; the delays caused the rain; or chance.

| ID | Prompt | Answer |
| --- | --- | --- |
| `plot-eight` | Plot the eight weeks. | All eight dots placed (checked by position) |
| `describe` | Describe the pattern in words. | Wetter weeks had more delays · Delays had no pattern · Drier weeks had more delays → first ← |
| `name-it` | Name it. Positive correlation · Negative correlation · No correlation | Positive |
| `markets` | Market weeks were also the wet weeks. Can this table tell rain from markets? | Not from this table alone ← · Yes, it's rain · Yes, it's the markets |
| `reverse-arrow` | Could the delays have caused the rain? | No, and that's worth checking anyway ← · Yes · Can't tell |
| `steep-loose` | Two scatters, one tight, one loose, same slope. Which shows the stronger correlation? | The tight one |

### I'm stuck

**`median-five`**
1. *Hint:* "Line them up from lightest to heaviest. Which is in the middle?"
2. *Similar:* "Parcels 1, 5, 2: in order 1, 2, 5. Middle: 2. Now 2, 3, 3, 4, 18."
3. **Skip for now.**

**`reverse-sixth`**
1. *Hint:* "If six parcels average 7 kg, what's their total?"
2. *Similar:* "Three parcels average 4: total 12. Two of them make 7, so the third is 5. Now: six parcels averaging 7."
3. **Skip for now.**

### Replies

| Entry | Misconception | Reply |
| --- | --- | --- |
| 6 for `usual-parcel` | The mean is always the "usual" value | "Four of the five weigh 4 kg or less. Is 6 kg usual?" |
| 10 for `usual-parcel` | Median as the middle of the range | "That's halfway between lightest and heaviest. The median is the middle parcel when lined up." |
| 3.5 or 4 for `median-five` | Not ordering, or averaging the middle two of an odd set | "Five parcels have one middle. Line them up and count to the third." |
| 7 for `reverse-sixth` | Confusing the new mean with the new value | "That's the new mean. If six share 42 kg, what must the new one add?" |
| 42 for `reverse-sixth` | Stopping at the total | "42 kg is all six together. What did the new one bring?" |
| Yes for `mean-is-a-value` | Expecting the mean to be one of the values | "The mean is a share-out. It needn't match any parcel." |
| "Yes, it's rain" for `markets` | Correlation as cause | "Rain and markets rose together. Which one did it? The table can't say." |
| The loose one for `steep-loose` | Slope as strength | "Steepness isn't strength. Strength is how close the dots sit to a line." |

---

## 5. Sentence Bridges: joining words that change the weight

**Pack title:** Although, unless, whereas · **Card line:** Three new joining words. Each changes what matters.

### Learn card

> *Although* joins two things that pull against each other. It tells the reader which one to keep in mind.
> *Unless* names the one case where something doesn't happen.
> *Whereas* sets two things side by side to show a difference.
>
> Worked example. "The café is small. It's always full."
> *Although the café is small, it's always full.* The reader keeps "always full".
> *The café is always full, although it's small.* Same facts. Now "small" is the afterthought.

### Guided first item: `although-1`

**Prompt:** Join them with *although*. Keep the flooding as the main point.
**Sentences:** The causeway is cheaper. It floods.
**Guided working:** "Which fact should the reader keep?" (It floods.) → "Put *although* in front of the other one." → *Although the causeway is cheaper, it floods.*
**Accepted:** *Although the causeway is cheaper, it floods.* · *The causeway floods, although it is cheaper.* (Reply to the second: "Also correct. Here the flooding comes first, and the price trails after.")

### Unguided items

| ID | Prompt | Sentences | Fitting |
| --- | --- | --- | --- |
| `although-2` | Which sentence makes price the afterthought? | (two orders of the causeway sentence, plus a *because* version) | *The causeway floods, although it is cheaper.* |
| `unless-1` | Join with *unless*. Keep what the source says. | The courier normally crosses at the ford. When water covers the stones, the courier turns back. | *The courier crosses at the ford unless the water is over the stones.* |
| `unless-if` | Does the *if* sentence say the same as the *unless* one? Yes · No, the opposite · Partly | — | No, the opposite |
| `whereas-1` | Join with *whereas* to show the difference. | The footbridge takes walkers. The causeway takes carts. | *The footbridge takes walkers, whereas the causeway takes carts.* |
| `whereas-better` | Does the *whereas* sentence say one is better? Yes · No · Only the footbridge | — | No |
| `choose-joiner` | Choose the joining word: "The ford is fine ___ it has rained for days." although · unless · whereas | — | unless |

### I'm stuck

**`unless-1`**
1. *Hint:* "*Unless* names the case when something doesn't happen. When doesn't the courier cross?"
2. *Similar:* "'We usually walk to school. On rainy days we take the bus.' → 'We walk to school unless it rains.' The source gives the exception. Now the courier."
3. **Skip for now.**

**`choose-joiner`**
1. *Hint:* "Is days of rain a case when the ford is *not* fine?"
2. *Similar:* "'The shop is open ___ it's Sunday.' *Unless*: Sunday is when it isn't. Now the ford."
3. **Skip for now.**

### Replies

| Entry | Misconception | Reply |
| --- | --- | --- |
| *…if the water is over the stones* for `unless-1` | *If* and *unless* swap freely | "That says high water is when the courier crosses. The source says the opposite." |
| "Yes" for `unless-if` | Same as above | "Read both aloud. When does the courier cross in each?" |
| "Yes" for `whereas-better` | *Whereas* as a judgment | "*Whereas* shows a difference. It doesn't pick a winner." |
| *although* for `choose-joiner` | Choosing a contrast word for a condition | "*Although* would mean the ford is fine even after days of rain. Is that what you mean?" |

**Note:** Sentence Bridges' supplied sentences don't count as independent composition (spec 109).

---

## 6. Cartographer's Table: choosing a scale

**Pack title:** Choose your scale · **Card line:** The river won't fit. Choose how much each centimetre means.

### Learn card

> A scale says how much ground one centimetre stands for.
> A big area needs each centimetre to stand for more. Then small things get tiny.
>
> Worked example. A garden 40 m long, on a sheet 25 cm wide.
> 1 cm for 1 m: needs 40 cm. Too big.
> 1 cm for 2 m: needs 20 cm. Fits.
> At that scale, a 3 m pond is 3 ÷ 2 = 1.5 cm.
>
> Check the size first: the map distance should be much smaller than the real one.

### Guided first item: `choose-scale`

**Prompt:** Wren wants the river, mill to the far bend: 600 m on a 30 cm sheet. Choose a scale.
**Choices:** 1 cm for 10 m · 1 cm for 20 m · 1 cm for 50 m
**Guided working:** "How many centimetres would 600 m need at each scale?" → 60 cm, 30 cm, 12 cm.
**Replies:** 10 m: "60 cm won't fit on a 30 cm sheet." 20 m: "Fills the sheet exactly. Big enough to see detail, with no room for a key." 50 m: "Fits in 12 cm, with room for a key. Small things will be tiny." Both fitting scales are accepted.

### Unguided items (on the 1 cm for 20 m map)

| ID | Prompt | Answer |
| --- | --- | --- |
| `narrows` | The narrows are 24 m across. How wide on the map? | 1.2 cm |
| `ford` | The ford is 15 m. How wide on the map? | 0.75 cm |
| `see-difference` | Could you see the difference on this map? Easily · Only just · Not at all | Unscored observation. The calculated difference is0.45 cm; screen size, zoom and vision affect visibility. |
| `inset-narrows` | An inset at 1 cm for 5 m. The narrows? | 4.8 cm |
| `inset-ford` | And the ford? | 3 cm |
| `reverse` | Mill to library measures 7.5 cm. How far really? | 150 m |
| `reverse-check` | Before working it out: bigger or smaller than 7.5? Bigger · Smaller · Same | Bigger |

### I'm stuck

**`narrows`**
1. *Hint:* "Each centimetre is 20 m. How many 20s in 24?"
2. *Similar:* "40 m at 1 cm for 20 m: 40 ÷ 20 = 2 cm. Now 24 m."
3. **Skip for now.**

**`reverse`**
1. *Hint:* "Each map centimetre stands for 20 m. You have 7.5 of them."
2. *Similar:* "3 cm on the map is 3 × 20 = 60 m. Now 7.5 cm."
3. **Skip for now.**

### Replies

| Entry | Misconception | Reply |
| --- | --- | --- |
| 480 for `narrows` | Multiplying for real-to-map | "A map should be smaller than the ground. Divide by 20 instead." |
| 0.375 for `reverse` | Dividing for map-to-real | "The real distance should be bigger. One centimetre stands for 20 metres: multiply." |
| 150 cm for `reverse` | Losing the unit | "Right number, wrong unit. Each centimetre stands for 20 *metres*." |
| 1.5 for `ford` | Rounding too early, or 15 ÷ 10 | "Check: 1.5 cm × 20 is 30 m. The ford is 15 m." |
| Any choice for `see-difference` | Unscored visibility report | "The two drawn lengths differ by0.45 cm at the stated physical scale. Screens and zoom may show them differently. An inset can help; your eyesight is not being checked." |

---

## 7. What still needs review

- Content review of every pack, against spec 119's acceptance list.
- **Sentence Bridges:** the exact Marble topic for subordinating conjunctions is still to be found (spec 119 §6), and the pack needs an English subject reviewer.
- **Sorting Desk:** no Marble research record was used; needs a computing reviewer.
- **Seed Stall:** confirm that keeping thirtieths uncancelled until `expected-15` reads well on screen.
