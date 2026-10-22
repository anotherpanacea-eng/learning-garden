# Two Windows — original story and message content draft

**Status: reviewed for this bounded build; see [independent spec/content review](../reviews/59-two-windows-spec-review.md).**

Three original fictional market-day cases supply twelve claim tasks. They are a bounded first increment, not the six-story scope of spec06. These accounts are invented stories, not historical testimony. No upstream prose or artwork is incorporated. The source relationships and their limits are recorded in [audit59](../source-audits/59-two-windows.md).

An adult may read either form aloud. Form choice describes text length, not age, grade, decoding, fluency or attainment. The expanded form repeats the three core lines exactly and adds two lines per teller. Forms share claims, evidence relationships and messages. Account A and account B are two tellings of the same event within each case.

Every claim has scope **both accounts**. Evidence sets below are alternative minimal supports: accept any listed set. A selection containing a complete set can still contain extra lines; do not describe irrelevant extras as useful evidence. A missing detail is not a contradiction. Unknown claims have no required proof-of-absence selection: explain that neither account gives the requested fact. Reader-message cards rehearse supplied revision choices, not independently authored prose.

## 1. Baskets under the roof

### Concise form

**Account A — Dot**

| Line ID | Text |
| --- | --- |
| `baskets-A1` | At the market, I saw Pip carry the baskets away from the stall. |
| `baskets-A2` | I stayed beside the stall. |
| `baskets-A3` | I could not see under the Workshop roof. |

**Account B — Pip**

| Line ID | Text |
| --- | --- |
| `baskets-B1` | Wind pushed rain across the stall. |
| `baskets-B2` | I moved the baskets under the Workshop roof. |
| `baskets-B3` | I put a sign at the stall pointing to the Workshop. |

### Expanded form

**Account A — Dot**

| Line ID | Text |
| --- | --- |
| `baskets-A1` | At the market, I saw Pip carry the baskets away from the stall. |
| `baskets-A2` | I stayed beside the stall. |
| `baskets-A3` | I could not see under the Workshop roof. |
| `baskets-A4` | My scarf had a little knot at one end, and I kept turning it round and round. |
| `baskets-A5` | On the stall board, someone had drawn an apple and a pear with a piece of green chalk. |

**Account B — Pip**

| Line ID | Text |
| --- | --- |
| `baskets-B1` | Wind pushed rain across the stall. |
| `baskets-B2` | I moved the baskets under the Workshop roof. |
| `baskets-B3` | I put a sign at the stall pointing to the Workshop. |
| `baskets-B4` | My apron had a deep pocket, with a folded cloth inside and a button shaped like a leaf. |
| `baskets-B5` | Nearby, a baker hummed a tune while a friend wrapped a loaf in plain brown paper. |

### Claims and evidence

| Claim ID | Scope | Claim | Relationship | All minimal support sets | Explanation / feedback |
| --- | --- | --- | --- | --- | --- |
| `baskets-stated` | both accounts | Pip moved the baskets under the Workshop roof. | DIRECTLY STATED | `{baskets-B2}` | Pip gives the destination directly. Dot's limited view does not conflict with Pip's account. |
| `baskets-inferred` | both accounts | Pip may have moved the baskets to shelter them from the rain. | REASONABLE CLUE-BACKED INFERENCE | `{baskets-B1, baskets-B2}` | Rain at the stall and a move under a roof support this possible purpose. Pip does not state a purpose, so this is a plausible interpretation, not a known motive. The sign locates the Workshop but does not explain the move. |
| `baskets-contradicted` | both accounts | Dot could see under the Workshop roof from beside the stall. | CONTRADICTED BY EXPLICIT TEXT | `{baskets-A3}` | Dot explicitly says that this view was unavailable. This is an explicit limit, not a conclusion drawn from something Dot leaves out. |
| `baskets-unknown` | both accounts | Pip moved exactly four baskets. | NOT ENOUGH INFORMATION | No required line set. | Neither account gives the number of baskets. Several baskets could include four; it does not establish exactly four or show that four is false. |

### A note for Hedgehog

Hedgehog is a fictional reader who knows only Dot's account. Hedgehog wants to find the baskets and asks, **“Where should I look for the baskets now?”** Write a note that answers that question using the accounts. The original note says, **“Pip carried the baskets away from the stall.”**

| Card ID | Supplied message | Supported facts / line IDs | Fits reader goal? | Feedback |
| --- | --- | --- | --- | --- |
| `baskets-note-original` | Pip carried the baskets away from the stall. | Carrying away: `baskets-A1`. | false | This matches Dot's account. Hedgehog still needs the destination to know where to look. |
| `baskets-note-roof` | Look under the Workshop roof for the baskets. | Basket destination: `baskets-B2`. | true | This gives Hedgehog the place Pip names. |
| `baskets-note-sign` | The baskets are under the Workshop roof. The sign at the stall points to the Workshop. | Destination: `baskets-B2`; sign: `baskets-B3`. | true | This names the destination and a sign Hedgehog can look for at the stall. |
| `baskets-note-cafe` | Look inside the Café for the baskets. | No account supports this destination; Pip names the Workshop roof in `baskets-B2`. | false | The accounts do not place the baskets inside the Café. Use the destination Pip gives. |

## 2. The bridge flags

### Concise form

**Account A — Kitten**

| Line ID | Text |
| --- | --- |
| `flags-A1` | At noon, before the market bell, I saw no flags on the bridge line. |
| `flags-A2` | I left before the bell rang. |
| `flags-A3` | I did not return to the bridge that market day. |

**Account B — Rabbit**

| Line ID | Text |
| --- | --- |
| `flags-B1` | After the market bell, I saw yellow flags on the bridge line. |
| `flags-B2` | After the bell, I watched Dot tie another yellow flag onto the bridge line. |
| `flags-B3` | I leaned on the rail to watch. |

### Expanded form

**Account A — Kitten**

| Line ID | Text |
| --- | --- |
| `flags-A1` | At noon, before the market bell, I saw no flags on the bridge line. |
| `flags-A2` | I left before the bell rang. |
| `flags-A3` | I did not return to the bridge that market day. |
| `flags-A4` | My market bag kept bumping my knee, so I shifted its handle into my other paw. |
| `flags-A5` | As I walked, I made up a quiet tune about a boat with a very tall sail. |

**Account B — Rabbit**

| Line ID | Text |
| --- | --- |
| `flags-B1` | After the market bell, I saw yellow flags on the bridge line. |
| `flags-B2` | After the bell, I watched Dot tie another yellow flag onto the bridge line. |
| `flags-B3` | I leaned on the rail to watch. |
| `flags-B4` | The wooden rail felt smooth under my paws, and the water below made a soft chuckling sound. |
| `flags-B5` | My bag held a folded shopping list, with a small drawing of a loaf beside the words. |

### Claims and evidence

| Claim ID | Scope | Claim | Relationship | All minimal support sets | Explanation / feedback |
| --- | --- | --- | --- | --- | --- |
| `flags-stated` | both accounts | Rabbit saw a yellow flag on the bridge line after the bell. | DIRECTLY STATED | `{flags-B1}` OR `{flags-B2}` | Either line directly places at least one yellow flag on the bridge line after the bell. A statement about flags supports the statement about a flag. |
| `flags-inferred` | both accounts | The bridge flag display changed between Kitten's visit and Rabbit's visit. | REASONABLE CLUE-BACKED INFERENCE | `{flags-A1, flags-B1}` OR `{flags-A1, flags-B2}` | Kitten reports an empty line before the bell; Rabbit reports flags after it. The comparison is worked out by combining their details. Neither teller directly states this comparison. This is a strong conclusion from the accounts, not merely a possible guess. Either Rabbit line supplies the later flag evidence. |
| `flags-contradicted` | both accounts | Yellow flags were already on the bridge line when Kitten looked at noon. | CONTRADICTED BY EXPLICIT TEXT | `{flags-A1}` | Kitten explicitly reports no flags on that line at noon. Rabbit's later flags do not change the earlier report. |
| `flags-unknown` | both accounts | Dot tied exactly eight flags onto the bridge line that day. | NOT ENOUGH INFORMATION | No required line set. | Neither account gives a total. “Another” tells us there was more than one flag, not exactly how many Dot tied that day. |

### A note for Mole

Mole is a fictional reader who knows only Kitten's account. Mole is planning a visit after the bell and asks, **“Who was at the bridge flag line after the bell, and what were they doing?”** Write a note that answers with Rabbit's observation. The original note says, **“The bridge flag line was empty at noon.”**

| Card ID | Supplied message | Supported facts / line IDs | Fits reader goal? | Feedback |
| --- | --- | --- | --- | --- |
| `flags-note-original` | The bridge flag line was empty at noon. | Noon display: `flags-A1`. | false | This reports Kitten's earlier view correctly. Mole asks who was there and what they were doing after the bell. |
| `flags-note-dot` | After the bell, Dot was tying a yellow flag onto the bridge line. | Person, action, time and place: `flags-B2`. | true | This answers both parts of Mole's question at the requested time. |
| `flags-note-rabbit` | Rabbit watched Dot add a yellow flag to the bridge line after the bell. | Rabbit's observation of Dot: `flags-B2`. | true | This supplies the person and action, and tells Mole whose observation the message uses. |
| `flags-note-kitten` | After the bell, Kitten was hanging yellow flags on the bridge line. | No account supports this action by Kitten; `flags-A2` and `flags-A3` say Kitten left before the bell and did not return. | false | Kitten's account rules out this later visit. Rabbit describes Dot at the line. Check the teller and the person doing the action. |

## 3. The bottom of the sign

### Concise form

**Account A — Pip**

| Line ID | Text |
| --- | --- |
| `sign-A1` | From the Garden path, I could read Café on the market sign. |
| `sign-A2` | Bushes hid the bottom of that sign from me. |
| `sign-A3` | I could not see an arrow on the sign. |

**Account B — Dot**

| Line ID | Text |
| --- | --- |
| `sign-B1` | From the Bridge, I could see the whole market sign. |
| `sign-B2` | A blue arrow pointed left below the word Café. |
| `sign-B3` | I stood by the rail to read it. |

### Expanded form

**Account A — Pip**

| Line ID | Text |
| --- | --- |
| `sign-A1` | From the Garden path, I could read Café on the market sign. |
| `sign-A2` | Bushes hid the bottom of that sign from me. |
| `sign-A3` | I could not see an arrow on the sign. |
| `sign-A4` | A leaf had caught on my sleeve, and I brushed it away with the edge of my paw. |
| `sign-A5` | I was carrying a paper bag that crackled whenever I changed my grip on its folded top. |

**Account B — Dot**

| Line ID | Text |
| --- | --- |
| `sign-B1` | From the Bridge, I could see the whole market sign. |
| `sign-B2` | A blue arrow pointed left below the word Café. |
| `sign-B3` | I stood by the rail to read it. |
| `sign-B4` | A market tune drifted over the water, with a little pause that made me want to hum along. |
| `sign-B5` | I tapped its rhythm on my bag, then tucked the loose strap back over my shoulder. |

### Claims and evidence

| Claim ID | Scope | Claim | Relationship | All minimal support sets | Explanation / feedback |
| --- | --- | --- | --- | --- | --- |
| `sign-stated` | both accounts | The sign had a blue arrow pointing left below Café. | DIRECTLY STATED | `{sign-B2}` | Dot directly describes the arrow's colour, direction and position. |
| `sign-inferred` | both accounts | A view from the Bridge might help Pip see the arrow. | REASONABLE CLUE-BACKED INFERENCE | `{sign-B1}` | In the complete displayed sign context, Dot's view of the whole sign from the Bridge supports suggesting that viewpoint for Pip. The arrow's identity comes from the surrounding passage. Adding Pip's blocked-view lines is useful context, but the arrow-description line need not also be selected for this tentative suggestion. It does not guarantee Pip's view; neither teller describes Pip looking from the Bridge. |
| `sign-contradicted` | both accounts | There was no arrow anywhere on the market sign. | CONTRADICTED BY EXPLICIT TEXT | `{sign-B2}` | Dot explicitly describes an arrow on the same sign. Pip says the arrow was not visible to Pip, not that the sign had no arrow. |
| `sign-unknown` | both accounts | The market sign was exactly ten metres from the Garden path. | NOT ENOUGH INFORMATION | No required line set. | Neither account gives a distance. Seeing some of the sign does not establish exactly how far away it was. |

### A note for Squirrel

Squirrel is a fictional reader who knows only Pip's account. Squirrel wants to use the sign's direction and asks, **“Which way does the arrow below Café point?”** Write a note that answers that question from Dot's account. The original note says, **“The market sign says Café.”**

| Card ID | Supplied message | Supported facts / line IDs | Fits reader goal? | Feedback |
| --- | --- | --- | --- | --- |
| `sign-note-original` | The market sign says Café. | Visible word: `sign-A1`; also `sign-B2`. | false | This names the word correctly. Squirrel still needs the arrow's direction. |
| `sign-note-left` | The blue arrow below Café points left. | Colour, position and direction: `sign-B2`. | true | This gives the direction Squirrel asked for. |
| `sign-note-view` | Dot saw the whole sign from the Bridge. Its arrow below Café points left. | Viewpoint: `sign-B1`; arrow: `sign-B2`. | true | This answers the direction question and explains whose fuller view supplies the detail. |
| `sign-note-right` | The arrow below Café points right. | No account supports right; `sign-B2` explicitly says left. | false | Check Dot's arrow direction. Pip's limited view supplies no different direction. |

## Independent editorial review prompts

- Check that both forms preserve the same event facts and every listed minimal evidence alternative, including the two later-flag lines. Extra lines must not provide a new decisive route to a claim or supply an unknown total or distance.
- Check whether the baskets purpose is reasonably suggested by rain plus roof without becoming an explicit motive. Neither the sign nor an illustrated reaction should state the purpose as fact.
- Check that the flag comparison is treated as a strong combined-clue inference; it should not be weakened into “we cannot know because neither teller says changed.” Both accounts can be true at their stated times.
- Check that all sign references read as one market sign. Any illustration should preserve the hidden bottom from the Garden path and the whole sign from the Bridge, with left interpreted as the arrow's printed direction. Avoid implying a missing arrow or deception.
- Check every selected-evidence explanation for the difference between an unselected contextual line, a genuinely sufficient support set and an irrelevant extra. If another defensible minimal set is found, add it before implementation.
- Read the original notes against each reader's exact question: truth alone need not answer the question. Both useful revisions must answer it using supported facts, without inventing a future promise or assessing free prose.
- Confirm the length ranges by teller and keep the same core line IDs in both forms. Check narrated access and optional discussion without decoding, fluency, independent writing or general viewpoint-attainment claims.

These are continuing editorial prompts. The separate review receipt records the completed bounded spec/content review; implementation clearance remains separate.
