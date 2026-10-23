# 124. The Bank Builder: design, build and test along Willow Brook

Status: **proposed; awaiting independent spec review and a science content check.** Part of the [new kinds of play proposal](../new-game-kinds.md). Fits Acts II, IV and VI of [spec 120](https://github.com/anotherpanacea-eng/learning-garden/blob/claude/project-thread-zpfie6/docs/specs/120-keeper-of-the-ways.md), and gives Act IV's three plans a model the child can run. Every child-facing line is in [the companion text](../content/124-bank-builder-text.md); this spec holds the model, the levels and the saves. Code and art are for the implementation pass.

**Commissioning boundary:** this remains a proposal. Select a bounded first slice after independent content/model/save review; the presence of later games, levels or designers does not commission them all. All Act/chapter links and contributions below are future adapters to the separately proposed spec120. Standalone play stays open without that shell, and no story completion is inferred from an unavailable adapter.

## Purpose

The Storm Workshop and Fair Test benches compare set-ups the game supplies. Here the child designs one: protect a stretch of Willow Brook's bank with a budget, run an authored flood model, see where water gets through and what it costs, and revise. The model is openly simple and says so on every result.

The bench teaches the design cycle (goal, design, test, revise), trade-offs between cost, land and protection, that a wall protects what is behind it and can send water elsewhere, that a hazard can be reduced but never removed, and that a claim about a design needs evidence from tests.

## Place and story

The bench is a long table in the Storm Workshop with a clay model of the brook's bank. Route: `#workshop/levee`, linked from the Workshop hub, from Rain Paths, and from Act IV's meeting. Open from the start.

- **Act II:** levels `b1` to `b3` are repairs after the storm. A kept design counts toward chapter 2, *a garden across the seasons*, which lists flood preparation among its spring jobs.
- **Act IV:** level `b4`, *The low fields*, loads the three plans on the table at the town meeting (spec 120, chapter 4) as starting designs. Running them is the Sapling job for chapter 4. The kept design is the child's own; it does not set the story's `plan`, which is kept at the meeting.
- **Act VI:** in the model, the long rain is a *big flood* (level 3). All three plans keep the homes, the bridge and the mill path dry in it, each at its own cost, which is what spec 120's Act VI scenes show.

## The model, `bank-v1`

The bank has six sections, upstream to downstream. Heights are in fictional model *boards*. They have no conversion to the story ledger's centimetres or to real flood measurements.

| Section | What's behind it | Natural height |
| --- | --- | --- |
| A | The meadow (hay and the meadow path) | 2 |
| B | The top of the orchard | 3 |
| C | The low corner of the orchard | 1 |
| D | The mill path | 2 |
| E | The bridge road | 3 |
| F | The homes lane | 2 |

**Builds**, at most one per section:

| Build | Adds | Coins |
| --- | --- | --- |
| Sandbags | 1 board | 1 |
| Stone wall | 2 boards | 3 |
| Wall and sandbags | 3 boards | 4 |
| **Room for the brook** (A and C only) | The section is given to the water on purpose and floods. Each one lowers the water by 1 board for every section downstream of it. In a great flood or What if? (levels4 and5), room lowers the water by at most1 board in all, because a full marsh holds no more. | 2 (moving fences and paths) |

**Budget:** 8 coins, unless a level says otherwise.

**Floods:** spring flood (water at 2 boards), big flood (3), great flood (4, the size of the storm). Older players also have **What if?** (5), a flood bigger than any in Hollis's ledger.

**Rules, applied section by section from A to F:**
1. The water level at a section is the flood level, lowered by the room sections upstream of it (as above).
2. If the water level is higher than the section's height, water gets through, and the land behind it is wet. Water exactly at the top holds.
3. A build that holds back water the natural bank would not have held **sends water on downstream**. For each non-room section, count one if its raised bank holds at the locally reduced level but its natural bank would not. Subtract the number of room sections and clamp to zero. Show this unitless, fictional **downstream impact score for Les Saules**. It is an authored trade-off rule, not water volume, a hydrological prediction, or an input to a second river simulation. Room sections always count as wet and lower only later sections.

Results show which sections held, which land got wet, the coins spent, the land given to the brook, and the fictional downstream impact score for Les Saules. Every result has the line: *This is a made-up model with simple rules. Real rivers are more complicated.*

**Checked by enumerating every design** (all 1,152 designs within 8 coins, 2026-10-23):

| Design | Builds | Coins | Land given | Spring flood | Big flood | Great flood |
| --- | --- | --- | --- | --- | --- | --- |
| Nothing built | | 0 | 0 | C wet | A, C, D, F wet | everything wet |
| **The Wall** | Sandbags A, B, D, F; wall and sandbags C | 8 | 0 | all dry; impact score1 | all dry; score4 | A, D, E, F wet; score2 |
| **The Sponge** | Room at A and C; sandbags D, F | 6 | 2 | A, C wet (given) | A, C wet (given) | A, C wet (given) |
| **Some of Each** | Room at C; sandbags A, D, F | 5 | 1 | C wet (given) | C wet (given) | A, B, C wet; score1 |

- No design keeps the meadow and everything else dry in the big flood on 5 coins; keeping all but the meadow dry costs at least 3.
- In *What if?*, no design within 8 coins keeps the homes lane, the bridge road and the mill path all dry.
- No design is best on every count. That is checked, and it is the point.

## The levels

| ID | Title | Floods | Budget | Goal on the card |
| --- | --- | --- | --- | --- |
| `b1` | The low spot | spring | 3 | Keep everything dry in a spring flood. |
| `b2` | A bigger flood | big | 5 | Keep the homes lane, bridge road and mill path dry. Choose what else to protect. |
| `b3` | The wearing bank | three pours | none | Compare bare soil, sandbags, and grass with willow roots on the same slope. |
| `b4` | The low fields (Act IV) | all three | 8 | Try the three plans from the town meeting. Then make the design you'd choose, and say why. |
| `b5` | Open bank | any | 8 | Your own goal. |

**`b3`, the wearing bank**, is a fair-test bench beside the main model: three model strips with the same starting soil, bank dimensions and slope and the same pour of water three times. The authored results, shown after each pour: bare soil wears a groove and the water runs off muddy; sandbags hold the water back for two pours, and on the third the water goes over the top and one bag slips; grass with willow roots lets water run over the top every time, the soil stays put and the water runs clearer. The child records what they saw on each strip (I SAW sentence stems, as in [spec 122](122-lost-and-found-mysteries.md)) and then answers *Which strip would you use where?* with a free choice for three places. These are fictional authored animation outcomes, not measured observations from a real classroom trial. Their science review must check the sequence and its stated limitations before commissioning. The bench says that plants can help against wind and water both, that sandbags and plants do different jobs, and that the right choice depends on the place.

## Choosing and saying why

At the end of `b2`, `b4` and `b5`, **Keep my design** asks for a short claim from stems:

- *I'd choose this design because, in the {flood} test, …*
- *What it costs is …*
- *A worry about it is …*

The test results the child ran are shown beside the stems, so the claim can cite them. Free text completes each stem. Nothing grades the claim. In `b4`, the page also shows one sentence from each plan's speaker at the meeting (Bramble for the Wall, Moss for the Sponge, the miller for Some of Each), so the child's claim can answer a real objection.

## Saved work

Optional root `bank` per explorer, absent until a level opens:

```
bank: {
  levels: { [levelId]: {
    source, design: { [sectionId]: 'none' | 'bags' | 'wall' | 'wall-bags' | 'room' },
    runs: [{ source, design, flood: 2 | 3 | 4 | 5, result, support, at }], // latest 12 readable runs
    kept: { source, design, runs, claim: { because, cost, worry }, at } | null,
    strips: { [pour]: { source, notes: { [stripId]: [stemId, text] } } }, // b3 only
    earlier: [level]
  } }
}
```

- `source` freezes the understood model/level version, six section definitions/heights, build IDs/costs/locations, flood definitions, budget, rule parameters and displayed goal/model notices (at most 16 KiB UTF-8). Validate supported sources on that own finite shape, not today's budget/catalog. No imported expression or source prose is executed.
- Every explicit run copies the tested design, that source, flood, support and computed result once. `result` holds each section's water/height/held/wet state, spend, land given and the model's downstream-impact count. Render historical tests from this result: never recompute them from an edited design, current model or later source. A kept claim copies its own design/source and the exact tests it cites; ordinary edits and twelve-run rollover cannot remove that evidence. Display an earlier-model notice when appropriate without rewriting the claim/result. A partial kept design cites no invented test.
- The twelve-readable-run window changes only after an explicit new test, with oldest-readable replacement disclosed first; unreadable/raw slots are never evicted. Strip notes retain their own authored pour/strip source and optional prose, bounded to 2,000 characters per field. Claims use the same prose bound.
- An unknown version, malformed design/run or unsupported build remains exact and exportable, with only the affected actions read-only/unavailable. Never drop a design, reopen its saved level as empty, or rewrite historical outcomes. **Start a fresh model version** explicitly retains the complete prior level entry in `earlier` before opening a separate supported draft; if retention fails, preserve the old entry and refuse the start. Other levels stay usable.
- New sources, tests, keeps and retained copies preflight the whole notebook and actual formatted `notesReport` through existing `prepareProgressImport` limits. Export/import preserves raw optional data/unknown fields; reset, save-off and explorer switching use the existing shared behavior. No new storage backend or general model-history framework is needed.

## Curriculum fit

**Strands** ([six-act strands](../six-act-strands.md)): **S1-II/III** choose a comparison and run a fair test (`b3`); **S1-IV** revise a claim after a test; **S7-II** erosion; **S7-IV** human impacts and hazards; **S6** engineered systems; **L1-II** budget, plan and revise; **E4** a short claim with evidence and a worry; **M7-V** compare models and their assumptions (the "made-up model" line and What if?).

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Design to a goal under a budget; test and revise; compare solutions on several counts; support a choice with test evidence and name its cost. |
| Teaching encounter | `b1`'s worked first test (companion text) and the wearing bank's three pours. |
| Contrast | Raising the bank and giving the brook room; protecting here and sending water downstream; a design that holds in the big flood and fails in the great one. |
| Supported practice | Show where water got through; the builder's hint after two runs; the claim stems with test results alongside. |
| New application | `b4`'s three plans; What if?; `b5`'s own goal. |
| Purposeful revisit | Act IV's meeting and Act VI's long rain (spec 120); Rain Paths and the Water Lab; the wet corner in spec 122. |
| Data boundary | Designs, runs, claims and strip notes, all local. No location; the brook is fictional. |

## Upstream check

Refreshed 2026-10-23: Marble `f186a79a9525c189e2d423e31613c62b6805416f`, Jane `1927912b8d9cd4f7df6e7fbe8416521194743060`.

| Topic | What the research asks, and how this spec does it |
| --- | --- |
| Preventing Erosion (`mt_m6UaSmrQVG`) | Show water carrying soil away first; compare at least two or three solutions; judge from a fair test, not looks; keep it concrete; do not pin one agent to one fix, since plants help against wind and water both. `b3` shows soil washing away, compares three strips in a fair test, and asks where each would be used. |
| Designing for Weather Hazards (`mt_JmMtZCifJB`) | Claim, evidence and reasoning over model-building; compare at least two solutions on shared criteria; hazards are reduced, never eliminated, and the hazard still occurs; weigh trade-offs and the weaker option; use challenges after test data exists. The results table, the claim stems beside the runs, What if?, and `b4`'s objections after testing. |
| Weather-Resistant Engineering (`mt_iiUdDUEEGY`) | Older follow-on to the above. Covered only by `b4` and What if?; no topic claim. |

Jane's staged worked example shaped `b1`'s first test. Its points and medals are not adopted, and no Jane code or text is used.

### Hard-prerequisite crosswalk

| Target | Hard prerequisite in `curriculum/marble/dependencies.json` | How it's met |
| --- | --- | --- |
| Preventing Erosion | Shapes of land and water (`mt_KsKLVW_ssY`) | Partly: the bank, brook, meadow and marsh are named and pictured on the model; no lesson on landforms. Documented gap. |
| Designing for Weather Hazards | Weather Forecasting & Safety (`mt_URezjbU-6f`) | Partly: the almanac's weather pages (spec 116) and the floods' names. Forecasting is not taught here; no topic claim beyond candidate reference. |
| Weather-Resistant Engineering | Extreme Weather Events (`mt_6EfevRyeFW`) | Not taught. No claim. |

## Checks for implementation

- A test enumerates every design within 8 coins and confirms the results table and the three bullet facts above.
- Room is offered only at A and C; the total1-board reduction cap applies at both flood4 and flood5.
- The unitless downstream-impact score never goes below0; it is not presented as a measured volume.
- A kept design and claim reload exactly; a model version change shows the earlier-model note without changing them.
- Every result shows the made-up-model line.
- Browser at 320 and 820 px: the six sections stack vertically on narrow screens with their builds and results readable as a list.

## Review asks

- Science check: are the model's simplifications honest for children, especially room lowering the water downstream and walls sending water on?
- Is 8 coins the right budget, so that each plan is possible and choices still bite?
