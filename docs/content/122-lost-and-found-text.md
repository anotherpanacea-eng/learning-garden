# The Lost and Found Board: all child-facing text

Companion to [spec 122](../specs/122-lost-and-found-mysteries.md). Use as written, after the same independent review. `{guide}` is the explorer's chosen companion; `{courier}` is the explorer's chosen courier. Pip is a fox (he/him), Dot a ladybug (she/her), Bramble a girl witch (she/her) with a magpie. The miller, the baker, the orchard keeper and Moss have no pronouns in this text. Nothing here is scored.

Every clue below was checked by brute force: each mystery has exactly one arrangement that fits all its trusted clues.

## Arriving

**Place title:** The Lost and Found Board

**First visit:**
> Dot has pinned a big cork board beside the post office counter. It's already covered in notes.
>
> "Since the storm, everything's been borrowed, moved or mixed up," says Dot. "People keep asking me where things went. I'm the postmaster, not a detective." She looks at you. "But you could be."

**Later visits:** Dot has pinned up the notes. Which mystery shall we look at?

**Link from the post office hub:** The Lost and Found Board

## The two kinds of sentence

Shown before the first sort, one step per tap. Button: **Next**. Last button: **Start sorting**.

1. "Some sentences tell us what someone **saw** or **did**. 'I saw a blue basket on the counter.' That's an **I SAW** sentence."
2. "Some sentences tell us what someone **thinks**. 'I think the basket is Moss's.' That's an **I THINK** sentence."
3. "Thinking is good. Detectives think all the time. But an I THINK sentence is an idea to check. It isn't a clue yet."
4. "Let's sort the notes. Then open the clue cards, with an explanation from each note. Only the cards in Clues are used to check an answer."

**Sort buttons:** I SAW · I THINK (older mysteries add: I HEARD)
**Skip button:** Sort them for me
**Skipped note:** These are sorted for you. You can look at why under each one.

**I HEARD** (introduced in *Muddy prints*):
> "Some sentences tell us what someone **heard somebody else say**. 'The magpie keeps saying Pip.' That's an **I HEARD** sentence. It might be true. But the person who wrote it didn't see it themselves."

## Grid controls

| Control | Label |
| --- | --- |
| Cell marks | yes · no · (empty) |
| Cell help | Tap once for no, twice for yes, three times to clear. |
| List mode | Show as a list |
| List row | {row} and {thing}: yes · no · not sure |
| Clear | Clear my marks |
| Clear confirmation | Clear every mark on this grid? · Yes, clear them · Keep them |
| Clue list heading | Clues |
| Answer step | My answer |
| Answer check | Does it fit? |
| Reveal | Find out what happened |

**Does it fit? messages:**
- That fits every clue.
- That doesn't fit this clue: "{clue}". Have another look.
- Every row needs an answer first.
- Use each thing and each place once. One of yours is used twice.

**Source note for the builder:** the clue cards use the ordered IDs and finite predicates in spec 122. The child's sort is a preserved response, not an executable rule. Show the authored Why? before using a card and record support. Board introductions, pictures and reveals add no hidden predicates. If a clue is set aside, its repeated wording elsewhere is not another independent clue.

**Can we tell yet?**
- Question: Can we tell what happened yet?
- Choices: Yes, I know · Not yet: it could be more than one way
- On "Not yet": Right. These clues still allow more than one way. We need another clue.
- On "Yes": Let's check. Here's another way that fits every clue so far: {arrangement}. So we can't be sure yet.
- Button after either: Get the next clue

## Mystery 1: Who borrowed what?

**Board note:**
> After the storm, the ladder, the rope and the bucket all went missing from the shed by the mill. They're all back now. But who had which, and where did they go?

**Grid:** Pip, Bramble, the miller × ladder, rope, bucket × the footbridge, the orchard, the mill roof

**Witness notes (round 1):**

| Writer | Sentence | Sort | Why? |
| --- | --- | --- | --- |
| The miller | "I spent the whole morning up on the mill roof, putting the tiles back." | I SAW | This is something the miller did and knows. |
| The miller | "I think the wind will be back for those tiles." | I THINK | This is the miller's guess about what will happen. |
| Dot | "I flew past the footbridge and saw someone mending the rail with the rope. The willow branches hid who it was." | I SAW | Dot saw this. Notice what she couldn't see, too. |
| Pip | "I was in the orchard all morning, picking up fallen apples." | I SAW | Pip did this and knows it. |
| Pip | "I think Bramble took the ladder. She's always climbing things." | I THINK | This is Pip's idea. We'll check it at the end. |

**Clues from round 1:** The miller was on the mill roof. · Whoever had the rope was at the footbridge. · Pip was in the orchard.

**Worked first clue** (first visit only): "The miller was on the mill roof. So let's put **yes** where the miller meets the mill roof. And if the miller was on the roof, nobody else was. Put **no** for Pip and Bramble on the mill roof."

**Can we tell yet?** (Answer: not yet. Two ways fit: Pip had the bucket and the miller had the ladder, or Pip had the ladder and the miller had the bucket.)

**Round 2 note:**

| Writer | Sentence | Sort | Why? |
| --- | --- | --- | --- |
| The baker | "When I opened the bakery, I saw the ladder leaning up against a roof." | I SAW | The baker saw it. Which roof could it be? |

**Answer:** Pip had the bucket in the orchard. Bramble had the rope at the footbridge. The miller had the ladder on the mill roof.

**Reveal:**
> "The ladder? Of course I had the ladder," says the miller. "How else do you get on a roof?"
> "And I mended the rail with the rope," says Bramble. "The magpie supervised."
> Pip looks at the bucket by his feet. "I had the bucket. For the apples. I forgot I had it."

**Looking back:** Pip thought Bramble took the ladder. Was he right? · No, she had the rope · Yes
- On "No": Right. Pip's idea was worth checking, and the clues showed it was the miller.
- On "Yes": Look at the answer again. Who had the ladder?

## Mystery 2: Three baskets

**Board note:**
> Moss packed three baskets this morning: one of seeds, one of apples and one of wool. A red basket, a blue basket and a yellow basket. One went to the garden, one to the café and one to the post office. Which went where?

**Grid:** red, blue, yellow × seeds, apples, wool × the garden, the café, the post office

**Witness notes:**

| Writer | Sentence | Sort | Why? |
| --- | --- | --- | --- |
| Ember, at the café | "The apples arrived at the café just in time for the pie." | I SAW | Ember was there when they arrived. |
| Dot | "There's a blue basket sitting on my post office counter right now." | I SAW | Dot can see it. |
| Dot | "I think the seeds came here, because seeds always go in parcels." | I THINK | A guess from what usually happens. |
| Moss | "I packed the yellow basket myself. No apples in it, and no wool either." | I SAW | Moss did this and knows. |

**Answer:** The red basket had apples and went to the café. The blue basket had wool and went to the post office. The yellow basket had seeds and went to the garden.

**Reveal:**
> Dot lifts the cloth off the blue basket. Wool. "Oh," she says. "Not seeds at all. I'll knit something."

**Looking back:** Dot thought the seeds came to the post office. Was she right? · No, the seeds went to the garden · Yes

**Help line for the yellow basket** (after two **Does it fit?** misses): "Moss says no apples and no wool in the yellow basket. What's left?"

## Mystery 3: Trails in the mud

**Board note:**
> After last night's rain, three trails of footprints lead away from the bridge: trail A, trail B and trail C. Pip, Bramble and {courier} all crossed the bridge early this morning. Whose trail is whose, and where does each one end?

**Grid:** trail A, trail B, trail C × Pip, Bramble, {courier} × the library, the bakery, the footbridge

**Witness notes:**

| Writer | Sentence | Sort | Why? |
| --- | --- | --- | --- |
| {guide} | "Trail A is paw prints, with four toes and claw marks. Pip is the only fox in town." | I SAW | {guide} looked closely. The second sentence is something everyone knows. |
| Bramble | "I followed trail C for a bit. It ends at the footbridge." | I SAW | Bramble followed it. |
| Bramble | "I think trail C is {courier}'s. It's the longest, and couriers go a long way." | I THINK | Bramble's guess, from how long the trail is. |
| The baker | "{courier} came into the bakery for a bun this morning, with very muddy feet." | I SAW | The baker saw it. |

**Answer:** Trail A is Pip's and ends at the library. Trail B is {courier}'s and ends at the bakery. Trail C is Bramble's and ends at the footbridge.

**Reveal:**
> Bramble looks at her boots, then at trail C. "Ah," she says. "That's my trail. I followed myself."

**Looking back:** Bramble thought trail C was {courier}'s. Was she right? · No, it was hers · Yes

**Observation words card** (Details): paw print · claw mark · boot print · tread · heel · toe · smudge · trail

## Mystery 4: The market row

**Board note:**
> The market has four stalls in a row along the brook. Stall 1 is nearest the bridge, then 2, then 3, then stall 4 at the far end. The baker, the orchard keeper, Bramble and the miller each have a stall. They sell lanterns, seeds, baskets and maps. Who is where, selling what?

**Grid:** the baker, the orchard keeper, Bramble, the miller × lanterns, seeds, baskets, maps × stall 1, stall 2, stall 3, stall 4

**Witness notes (round 1):**

| Writer | Sentence | Sort | Why? |
| --- | --- | --- | --- |
| The baker | "My stall is stall 1, right by the bridge, so I can see the bakery." | I SAW | The baker knows where their own stall is. |
| The baker | "I think the maps stall is right next to the bridge, because that's where travellers come in." | I THINK | A guess from where travellers usually come in. |
| Dot | "I counted the stalls from the bridge. The miller's is the third." | I SAW | Dot counted. |
| Moss | "The orchard keeper gave me seeds from the stall this morning. That's all they sell." | I SAW | Moss was there. |

**Can we tell yet?** (Answer: not yet. Twelve ways still fit.)

**Round 2 notes:**

| Writer | Sentence | Sort | Why? |
| --- | --- | --- | --- |
| {guide} | "The lanterns are hanging at one end of the row. I could see them from the bridge." | I SAW | {guide} saw them. Which ends are there? |
| Pip | "I bought a basket at the stall just before the miller's, the one between the miller's and the bridge." | I SAW | Pip was there. "Just before" means right next to it, on the bridge side. |

**Answer:** Stall 1: the baker, lanterns. Stall 2: Bramble, baskets. Stall 3: the miller, maps. Stall 4: the orchard keeper, seeds.

**Reveal:**
> "Maps!" says the miller. "Old ones, from the mill's attic. People keep asking about the green patch on this one." It's the patch marked *the Sponge*.

(The Sponge line appears only if Keeper's Page 1 is dry; otherwise: "Maps!" says the miller. "Old ones, from the mill's attic.")

**Looking back:** The baker thought the maps stall was next to the bridge. Was the baker right? · No, maps are at stall 3 · Yes

**Help line for order clues:** "Just before the miller's stall, on the bridge side. The miller's is stall 3. So which number is just before it?"

## Mystery 5: Muddy prints

**Board note:**
> This morning someone left muddy prints all over the post office floor. Pip, Dot, Bramble and the orchard keeper were all out and about. Each was in one place: the bakery, the post office, the orchard or the library. Each wore red boots, green boots, yellow boots, or no boots at all. Who made the prints? Read the clue cards to find out.

**Grid:** Pip, Dot, Bramble, the orchard keeper × red boots, green boots, yellow boots, no boots × the bakery, the post office, the orchard, the library

**Witness notes:**

| Writer | Sentence | Sort | Why? |
| --- | --- | --- | --- |
| Dot | "I don't wear boots. Six feet, and not one of them likes boots." | I SAW | Dot knows this about herself. |
| Dot | "I think whoever it was didn't mean to make a mess." | I THINK | Dot's kind guess. |
| The miller | "Walking past the orchard, I saw yellow boots by the ladders." | I SAW | The miller saw them. |
| The library sign-in book | "Pip. In: 9 o'clock. Out: 12 o'clock." | I SAW | A record written down at the time. |
| Bramble | "Yellow boots? I'd never wear yellow boots. I don't own any." | I SAW | Bramble knows what she owns. |
| Dot | "The prints by my counter are red-boot prints, the kind with stars on the soles." | I SAW | Dot is looking at them. |
| Bramble | "My magpie keeps squawking 'Pip! Red boots! Pip! Red boots!' I don't know where it heard that." | I HEARD | Bramble heard the magpie, and the magpie heard it somewhere. Nobody here saw it. |

**When the child tries the clues together** (or on Does it fit? with every clue used):
> These clues can't all be true. No answer fits all of them. Which one would you set aside?

**Set aside buttons:** one per clue: Set this aside · Bring it back

**Messages when a clue is set aside:**
- Magpie's clue set aside: Now exactly one answer fits the rest.
- Library book set aside: Now two answers fit. We can't tell.
- Dot's red-prints clue (`red`) set aside: Now two answers fit. We can't tell.
- Only `dot`, `yellow` or `bramble` set aside: Still nothing fits. Setting this one aside hasn't settled it.

**Multiple cards set aside:** No answer fits these cards. / Exactly one answer fits these cards. / {n} answers fit these cards. The message follows the current active predicate set; do not reuse a one-card result.

**Weighing the sources** (Details, linked from the set-aside step):
> The library book was written at nine o'clock and at twelve o'clock, by Pip, in the library. Dot is looking at the prints right now. The magpie repeats words it hears, but we don't know when it heard them, or who said them. Which would you trust most?

**Answer:** Pip, green boots, the library. Dot, no boots, the bakery. Bramble, red boots, the post office. The orchard keeper, yellow boots, the orchard.

**Reveal:**
> Bramble sighs. "Fine. Those are my red boots. The stars are my grandmother's idea. I came in to post her a letter, and I didn't wipe my feet. Sorry, Dot."
> Dot hands her a mop.
> Pip looks a little guilty. "I think the magpie heard me in the library. I was telling the cushions I want red boots."

**Looking back:** The magpie said "Pip, red boots." Was it right? · No, Bramble wore the red boots · Yes
- On "No": Right. The magpie had mixed up words it heard. A record written at the time was more reliable.

## Mystery 6: The wet corner (Act IV)

**Board note:**
> The low corner at the bottom of the orchard is always wet now. Three neighbors have written about it. What do they know, and what do they think?

**Neighbor notes:**

| Writer | Sentence | Sort |
| --- | --- | --- |
| The orchard keeper | "Every spring now, the low corner stays wet for weeks." | I SAW |
| The orchard keeper | "My grandfather said it was never like this when he was young." | I HEARD (older) / I THINK (younger: "This is something someone said. We can't check it yet.") |
| The orchard keeper | "I think the mill's flood boards are holding the water back." | I THINK |
| Moss | "Reeds have come up there that nobody planted." | I SAW |
| Moss | "The soil there is dark and smells a bit like a pond." | I SAW |
| Moss | "I think the brook is trying to go back to where it used to be." | I THINK |
| Bramble | "My boots sank in up to the ankles there on Tuesday." | I SAW |
| Bramble | "I think it's just been a wet year." | I THINK |

**Why? lines:** As in the earlier mysteries: "Moss saw this" / "This is Bramble's idea, worth checking."

**Explanations step:**
> One wet corner, and lots of ideas about why. Choose every explanation you think is possible. You can add your own.

1. It has just been a wet year.
2. The mill's flood boards hold the water back up the brook.
3. The corner is low ground where the old marsh was, and water still gathers there.
4. A spring, water coming up from underground, has opened there.
5. The brook's bank is wearing away nearby, so water gets out.
6. My own idea: (free text)

**Check step, for each chosen explanation:**
> What could we check, to see if this explanation fits?

| Check | What it could show |
| --- | --- |
| Compare the number of logged days marked rainy in the almanac, with the number of days noted in each year. | Whether more of the recorded days were marked rainy. This doesn't measure how much rain fell or settle whether the whole year was wetter. |
| Look at the corner when the flood boards are out, and when they're in. | Whether the boards make a difference. |
| Look at Hollis's old map for where the Sponge was. | Whether the wet corner sits where the marsh used to be. |
| Check whether the corner stays wet through a dry week. | Whether the wetness lasts after rain stops. Held rain, slow drainage, a spring or several causes could all fit; this check alone can't choose among them. |
| Walk along the bank and look for worn or broken places. | Whether water is getting out through the bank. |

**Closing:**
> More than one explanation might be part of the story. That's normal for real questions. Which check would you do first, and why?

**Free text placeholder:** I would check… because…
**Keep button:** Keep this with the Keeper's Pages
**Kept:** Kept. You'll find it with the Keeper's Pages.

## Write a mystery (older page)

**Heading:** Write a mystery of your own
**Step 1:** What are the rows? (People, baskets, trails, or anything.) · Choose from the list · Use my own words
**Step 2:** What are the two kinds of thing to match? (Tools and places, colors and contents…)
**Step 3:** Choose the true answer. Only you know it.
**Step 4:** Write clues. Choose a clue shape, then fill it in.

**Clue shapes:**
- {row} has {thing}.
- {row} does not have {thing}.
- The one with {thing} went to {place}.
- The one with {thing} did not go to {place}.
- {row} went to {place} or {place}.

**Check my clues** results:
- These clues can't all be true. Look for two clues that fight each other.
- Exactly one answer fits. That's a fair mystery!
- Still open: {n} different answers fit. Add a clue that rules some out.
- (If the clues fit, but not with your true answer) These clues lead to a different answer from the one you chose. Check your clues against your answer.

**Which clues are needed?** results:
- Every clue is needed. Take any one away and the mystery opens up.
- You could take away "{clue}" and still have exactly one answer. You can keep it as an extra, or cut it.

**Keep button:** Keep my mystery
**Kept:** Kept. Your mystery is on the board. Read it to someone, or copy it out for them.

## Off-screen invitations

- Write a three-clue mystery on paper for someone at home. Check that your clues lead to exactly one answer.
- Next time someone says "I think…", ask them: "What did you see that made you think that?"
- Look for footprints after rain: paws, shoes, birds. Which way were they going?

Off-screen invitations record nothing.

## Grown-up notes

- These are logic-grid puzzles. The game never marks the grid for the child; it checks only an answer the child asks it to check, and names the first clue that answer breaks.
- *Can we tell yet?* teaches that "not enough evidence yet" is a real and correct answer.
- *Muddy prints* has clues that can't all be true. Setting aside the secondhand clue gives one answer; that is the lesson about sources, and the reveal confirms it.
- *The wet corner* has no official answer. It belongs to the town's flood question in Act IV.
