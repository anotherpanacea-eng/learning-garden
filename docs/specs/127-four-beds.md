# 127. The Four Beds: a garden planned across the seasons

Status: **proposed; awaiting independent spec review and a science content check.** Part of the [new kinds of play proposal](../new-game-kinds.md). Fits Act II, chapter 2, *a garden across the seasons*, and Act V's night garden in [spec 120](120-keeper-of-the-ways.md). Every child-facing line is in [the companion text](../content/127-four-beds-text.md); this spec holds the model, the modes and the saves. Code and art are for the implementation pass.

**Commissioning boundary:** this is a proposal for separately selected, bounded increments. Later benches, editors and story adapters are not commissioned by the presence of their prose. Story links depend on the separately proposed spec 120; standalone activities remain open without that shell. The named content/model/source reviews below remain required before build.

## Purpose

A slow planning game. Moss gives the explorer four garden beds. Each year the child chooses what model crop group grows in each bed; at the harvest, an authored soil model reports how each bed did and what the soil now holds. Over several years the child discovers that the same crop in the same bed does worse each year, that beans give something back to the soil, that hungry crops do best right after beans, and that a plan which moves each family round the beds keeps every harvest good.

It teaches systems thinking, trade-offs, crop rotation and soil, and planning across time. Older explorers add neighbors that share pests, a wet bed, and weather they can't know in advance.

## Place and story

Four raised beds at the edge of the regrown garden ([spec 21](21-regrowing-the-garden.md)), looked after by Moss. Route: `#regrow/beds`, linked from the garden and from the Field Guide Almanac's season line ([spec 116](116-field-guide-almanac.md)). Open from the start.

- **Act II, chapter 2:** each kept year's plan is a festival job for *Flood Boards and Planting* (spring) and its harvest report for *Harvest Supper* (autumn), and either counts toward the chapter.
- **Act IV link:** the older wet bed sits at the low corner of the orchard, where only wet-loving plants thrive; Vadoalto's reed seed from the Act III seed exchange grows there.
- **Act V:** the night garden project path can start from a kept plan.

## Two ways to play

- **Play the years** (default). **Grow this year** runs the model at once; the next year opens straight away. A plan can run for up to eight years.
- **Grow with the seasons.** The child plans in the real spring, and the harvest report appears from the first day of real autumn on the device calendar (southern hemisphere flips with the almanac setting). Missing a season leaves the saved garden unchanged. No unplanted/rest year is simulated or inserted without an explicit grow action.

The child can switch modes between years. Each mode keeps its own garden.

## The model, `beds-v1`

Each bed has a **soil goodness** from 0 to 4, starting at 3. Goodness stands for the minerals in the soil that plants need to be healthy, a deliberately simplified meter, not a complete measure of fertility. Plants make their own food from air, water and light; the text says so and never says plants eat soil.

| Model crop group (not a botanical family) | Examples in pictures | Needs goodness | After the year |
| --- | --- | --- | --- |
| Beans | peas, runner beans, broad beans | 0 | +2 |
| Leaves | cabbage, kale, lettuce | 3 | −1 |
| Fruit | squash, tomatoes, courgettes | 2 | −1 |
| Roots | carrots, beetroot, parsnips | 1 | 0 |
| Clover (a rest year) | clover and grass | 0 | +2, no harvest |

**Harvest:** **good** if goodness is at least the need; **fair** if one short; **poor** if two or more short. If the same family grew in that bed last year, the harvest is one step worse: pests and diseases that like that family wait in the soil. Goodness never goes below 0 or above 4.

**Compost:** the town heap has enough for one bed a year. Compost adds 1 before planting, up to 4. Compost on a bed already at 4 does nothing, and the text says why: more is not always better.

**Checked by simulation** (2026-10-23):

- Moving each family round the four beds in the order beans → leaves → fruit → roots gives every bed a good harvest every year for eight years, whichever bed starts where. Beans → roots → leaves → fruit does too.
- Beans → fruit → leaves → roots gives one bed a fair year every four years, because leaves follow fruit there. Compost on that bed before the leaves, or a clover year, fixes it.
- Leaves in the same bed four years running: good, poor, poor, poor.
- Beans in the same bed four years running: good, then fair each year (the pests, though the soil is rich).

These are properties of the model, which is a simple story about real gardens; the companion text says so on every report.

## Older depth

- **Neighbors** (toggle): beds stand in a row. Two neighboring beds growing the same family in the same year are each one step worse that year: pests hop next door. A four-bed plan where each family is in a different bed each year, and each bed has each family once in four years, avoids it. Only after checking the actual kept four-year grid has exactly the four crop groups, each once in every row and column, does the page identify it as a Latin square. Avoiding same-group neighbors alone is insufficient. Other plans get a neutral invitation to compare rows and columns, never this automatic claim.
- **The wet bed** (Act IV link): a fifth bed at the low corner. Every family from the table is one step worse there; reeds and watercress, a sixth family called *wet-lovers*, are good there and poor anywhere else. The question at harvest: *What grows best depends on the place. What would you grow in the low corner?*
- **Weather you can't know** (toggle): in Play the years, a fixed authored sequence brings a wet summer in years 3 and 7 (fruit and roots one step worse) and a dry summer in year 5 (leaves one step worse). The plan is chosen before the year's weather shows. In Grow with the seasons, any optional almanac comparison shows only the counts of reported rain days, sun days and unreported dates, from a frozen date range and source. It does not measure rainfall amount or classify the real summer as wet/dry. The garden's fictional weather must instead be explicitly chosen from a supplied model scenario before running, with **Use an ordinary model year** available. No reports means **not observed**, not an ordinary real summer. This remains separate from the real observations and never writes invented days into the almanac. A plan that does well in every kind of year is the older goal.

**Bounded rule/authoring details:** apply the chosen compost to pre-year goodness, then compute baseline harvest from that value and the group's need. Clamp a grade downgrade at poor; same-group, neighbor, wet-bed and weather penalties each add one downgrade when applicable. Update goodness once from the group table after computing harvest and clamp 0–4; penalties do not change that update. Clover has no harvest or pest penalty. Wet-lovers have need 0/change 0, baseline good only in bed 5 and poor in beds 1–4; this fictional special group receives weather penalties only if separately authored and reviewed, and is exempt from repetition/neighbor penalties in this version. Freeze options at the beginning of each year: adding the fifth bed starts it at goodness 3 with no previous crop; hiding it retains its earlier work and does not delete it. Only an explicit new-year confirmation runs a model; elapsed calendar time never inserts planted/rest years or evidence.

The eight-year immediate cycle ends with **Keep this garden** and **Start another garden**; it does not overwrite its kept plans. Seasonal date rules must be fixed in a commissioning mini-spec (month boundaries/hemisphere, first autumn after the chosen spring, missed seasons, and explicit switching to immediate play). Until that exists, commission only Play the years; Grow with the seasons is on the [roadmap for much later](../roadmap.md#much-later-parts-held-back-from-the-new-game-kinds). Science/content review must also check the grouping (these are game groups, not taxonomic families), nitrogen/soil explanation and every because-line; no grade promises actual gardening results.

## Saved work

Optional root `beds` per explorer, absent until the first plan:

```
beds: {
  mode: 'years' | 'seasons',
  gardens: { years: garden, seasons: garden },
  options: { neighbors: bool, wetBed: bool, weather: bool },
  earlier: [garden]
}
garden: { mode, year: n, plans: [{ year, source, beds: [familyId], compost: bedIndex | null, at }],
          reports: [{ year, source, plan, soilBefore, harvest: [grade], goodness: [n], support, at }], kept: [year], startedSeason? }
```

- Every year's `source` freezes the understood model/version, crop-group and grade tables, update/penalty order, actual options and active/retained bed layout, starting soil/previous crops, fictional weather scenario and the displayed task/help/report explanations. Each source is at most 16 KiB; a supported garden has at most eight model years and five beds, including a hidden fifth bed's retained history. A change of options affects only the next explicitly confirmed year, never a stored one.
- Seasonal sources additionally freeze the hemisphere, chosen planting/growing season, device-calendar date boundaries and mode-switch context under the separately commissioned seasonal rules. Any almanac comparison freezes the exact date range and reported rain/sun/unreported counts plus source identity actually used; it is a reported-log comparison, not rainfall amount or a real-summer classification. The fictional scenario selected for the garden is stored separately. A lack of reports stays **not observed** and creates no observation or weather day.
- Reports are computed once at the authorized grow action from the frozen source, exact plan and pre-year soil. Store the resulting grades and soil, support context and timestamp alongside those inputs. Never recompute a stored report with today's model, options, almanac or clock. **Keep this garden** retains these same plans/reports; a later garden cannot overwrite their evidence. An untested plan has no invented harvest.
- Validate known family ids, bed counts, compost indices and year order against each saved source. A broken/unknown year and every later entry remain exact and exportable; never drop a year or reset its historical grades. Independently readable later reports can still be viewed as historical reports, but continuation is unavailable where the preceding soil/model cannot be understood. Show that local limitation and leave the other garden usable. Starting another supported garden is an explicit choice that moves the complete prior garden into `earlier`; if it cannot be retained, refuse without altering it.
- In Grow with the seasons, a device clock change never re-grows, inserts or rewrites a year. Missing dates or seasons are not fabricated planted/rest years, attempts or evidence. The seasonal mini-spec is still required before that mode is built.
- Preflight new year sources/reports and retained new gardens against the actual pretty `notesReport` export and `prepareProgressImport` whole-notebook limits; refuse atomically with the existing export/reset choices if they would not fit. Export, import, reset, save-off and explorer switching include the full raw `beds` root through the existing generic notebook transfer, including unsupported years and unknown fields; never trim on load.

## Curriculum fit

**Strands** ([six-act strands](../six-act-strands.md)): **S3-I** what plants need; **S3-III** environmental change; **S3-IV** matter cycling and human impacts (compost and clover returning goodness); **S7-I** rocks and soil; **M6** reading a record over years; **M4/M7-III** spotting a pattern and generalising it (the rotation); **L1-II** plan and revise; **L2-II** plan steps.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)):

| Part | In this spec |
| --- | --- |
| Target | Plan beds over several years; read a harvest report; explain why rotating families keeps harvests good. |
| Teaching encounter | Moss's first-year walk-through and the first harvest report, read line by line (companion text). |
| Contrast | The same family in the same bed and families that move; beans and leaves; compost on poor soil and on rich soil. |
| Supported practice | Moss's suggestion before planting (optional); the goodness meter on each bed; the report's because-lines. |
| New application | Neighbors; the wet bed; weather you can't know; Grow with the seasons. |
| Purposeful revisit | Spring and autumn festivals; the almanac's weather log; the reed seed from Vadoalto; Act V's night garden. |
| Data boundary | Plans, reports and options, all local. No location; the season comes from the hemisphere setting. |

## Upstream check

Refreshed 2026-10-23: Marble `f186a79a9525c189e2d423e31613c62b6805416f`, Jane `1927912b8d9cd4f7df6e7fbe8416521194743060`.

| Topic | What the research asks, and how this spec does it |
| --- | --- |
| What Plants Need to Thrive (`mt_lutxvMlkwS`) | "Nutrients from soil" are minerals for health, not the plant's food or mass, so the later idea that plants make food from air and water stays open; more of a requirement is not always better; a static chart supports but doesn't replace comparison. Goodness is introduced as vitamins with the food line beside it; compost at 4 does nothing; the child compares years in their own garden. |
| Rocks and soil (`mt_yhhprm7dZK`) | Real soil work is the hands-on complement; avoid any one soil as "best". The off-screen invitation with real soil, and the wet bed's "what grows best depends on the place". |
| Matter Cycling in Ecosystems (`mt_0ajzcoKAKw`) | Older: matter cycles back to the soil. The compost heap and clover lines, for older players only, without a claim. |

Jane's step-by-step reveal shaped Moss's first-year walk-through; its points, medals and schedules are not adopted, and no Jane code or text is used.

### Hard-prerequisite crosswalk

| Target | Hard prerequisite in `curriculum/marble/dependencies.json` | How it's met |
| --- | --- | --- |
| What Plants Need to Thrive | What Plants Need to Grow (`mt_3v0VNkwquK`) | Existing plant destinations (Seedlings after the storm, `#living/plants`) are linked from the first visit. |
| Rocks and soil | Properties of materials (`mt_R6YoRXkRxS`) | Not taught here. No claim. |

## Checks for implementation

- A test runs the four bullet facts in "Checked by simulation" and gets the stated results.
- The neighbor, wet-bed and weather rules change results only when their toggles are on.
- In Grow with the seasons, the report appears on the first autumn day after planting, once, and is stored.
- A stored report is never recomputed; a model version change shows "grown with an earlier model".
- Browser at 320 and 820 px: the beds stack into a list on narrow screens with family, goodness and harvest readable as text.

## Review asks

- Science check: is the model's story (beans giving back, hungry leaves, pests in the soil) fair to real gardening for children, given that it is deliberately simple?
- Should Grow with the seasons be the default for younger children, since it ties to the real year?
