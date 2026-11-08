# 602 · Act IV chapter 4 and ending: finite text

Companion to [spec 602](../specs/602-act-four-meeting.md). Every new child-facing string in `dist/act-four-content.mjs` under `meeting` and `ending`, verbatim. Strings marked *script* are extracted unchanged from the reviewed [act-4.md](120-story/act-4.md) chapter 4 and ending; the rest are new for this slice. `{guide}` is the chosen guide; `{plan}` is the kept plan's name; `{worry}` is the kept worry. Asterisks mark italics.

## Chapter 4: the meeting

**Title** (script, from the chapter heading). The proposal for the low fields

**Short** (script). The bell rings for a town meeting. Three plans are on the board. Every plan costs something. Which would you keep?

**Longer** (script). The bell rings for a town meeting, the first anyone can remember that isn't about a fête. The whole village squeezes into the library. On the board at the front are three plans for the low fields, drawn in the librarian's best pen. Everyone gets a turn to speak. The orchard keeper speaks about her trees. The miller speaks about her mill. Nuria, visiting, speaks about Vadoalto's reed beds and turns pink when everyone listens. Then Bramble stands up, and the room gets quiet, because Bramble is not usually serious.

**Bramble** (script). "Everyone keeps talking about frogs. What about the orchard keepers? Those trees are their whole year. If you want them to give up their fields, you'd better be very sure, and you'd better help them with what comes after."

### The three plans (script)

| Code | Plan | What it is | What it costs | What it protects |
|---|---|---|---|---|
| `wall` | The Wall | A higher flood wall along the brook through town. | Stone, upkeep and many hands; possible effects downstream need investigation. | Intended to protect the orchard and town; its limits still matter. |
| `sponge` | The Sponge | Let the lowest orchard fields go back to marsh. | Some apple trees, and some of the orchard keepers' living; the reed trade is a proposed replacement, not a guaranteed income. | The marsh holds water and lets it go slowly, so less of it reaches the mill at once. Frogs. Herons. |
| `some-of-each` | Some of Each | A lower wall above the mill, and a smaller wet meadow at the orchard's low corner. | A little of both costs. Some trees, some stone. | Some of both protections. Nobody gets everything they wanted. |

### Worries (script text, new codes)

| Plan | Code | Worry |
|---|---|---|
| The Wall | `wall-downstream` | The water will go to Les Saules instead. |
| The Wall | `wall-upkeep` | A wall needs mending forever. |
| The Wall | `wall-higher` | What if the next flood is higher than the wall? |
| The Sponge | `sponge-money` | The orchard keepers will lose money. |
| The Sponge | `sponge-years` | It will take years for a marsh to grow back. |
| The Sponge | `sponge-alone` | What if it isn't enough on its own? |
| Some of Each | `some-too-little` | Half a wall and half a marsh might be too little of both. |
| Some of Each | `some-complicated` | It's complicated to build. |
| Some of Each | `some-unhappy` | Nobody will be fully happy. |

### Board and keeping

| Key | Text | Source |
|---|---|---|
| boardHeading | The meeting board | new |
| what | What it is | script (table headings) |
| costs | What it costs | script (table headings) |
| protects | What it protects | script (table headings) |
| prompt | Which plan would you keep for Willowbank? | script |
| worryPrompt | If something about it worries you, add the worry. Good plans have worries. | script (the Seedling job) |
| keepHeading | Keep a plan for Willowbank | new |
| noWorry | No worry for now | new |
| keep | Keep this plan | new |
| kept | Your plan goes in the almanac, under your name for it. People will keep arguing. That's allowed. | script |
| keptWorry | Your plan and your worry go in the almanac together. The librarian says the worry is the most useful part. | script |
| yourPlan | Your plan: {plan} | new |
| yourWorry | Your worry: {worry} | new |
| earlierWorry | a worry from an earlier version | new |
| change | Choose again | new |
| frozen | The meeting is over. Your plan stays in the almanac. | new |
| endOffer | Hear what the meeting decided | new |
| needMore | The meeting can end once you have kept a plan and brought work to two of the first three chapters. Every game is open. | new |
| scene | The library on meeting night. Three plans are pinned to the board at the front, and lanterns glow along the shelves. | new |
| caption | The meeting board, before anyone has decided. | new |

## Ending: The Map We Changed

**Title** (script). The Map We Changed

**Mind-change heading** (new). Someone changes their mind

**Someone changes their mind** (script; the first that fits is shown):

| When | Speaker | Line |
|---|---|---|
| A kept Rain Paths result was offered in chapter 2 | The orchard keeper | I thought the model could tell us when the mill would flood. It only counts water in trays. I've changed my mind about what it tells us. |
| Otherwise, the ledger evidence note was offered in chapter 1 | Pip | I was sure it was all the Sponge. Now I want to know how heavy those rains were. The counts don't tell us. |
| Otherwise | The librarian | I thought we had to choose between certainty and doing nothing. We can keep a plan and write down what we still need to know. |

The Dutch archive line belongs to chapter 3, which has no reader yet, so it is not shipped.

**The guide** (script and [spec 366](../specs/366-guide-changes-their-mind.md)):

> {guide} unpins the card from the library door. "I wrote *mostly the rain*. I was sure. I can't show that either."
>
> "So I've changed my mind. It could be the rain and the Sponge together. That's a better question than I had."
>
> {guide} writes the new idea under the old one, and leaves the old one showing.

**Tail by guide** (script): Mira: Mira draws a small question mark in the corner of her sketchbook, and smiles at it. · Rowan: Rowan grins. "Changing my mind is the thing I'm best at making." · Ari: Ari turns a pebble over in one hand. "I noticed something I hadn't noticed this morning."

**Short** (script). Nobody agrees about everything. But the map on the meeting board has new pencil on it now.

**Longer** (script).

> The meeting goes late. Nobody agrees about everything, and nobody pretends to. But somebody changed their mind tonight because of something they found out, and said so out loud, which takes nerve. By the time the lanterns are lit, the old map on the meeting board has new pencil on it: a line here, a question mark there, a small drawing of a reed. It isn't the same map it was this morning.
>
> "That's what Hollis's pages were for," says {guide} on the walk home. "I think."

**Season lines** (script):

| Season | Line |
|---|---|
| spring | Walking home, you can hear the brook. It sounds higher than yesterday. |
| summer | It's still warm when the meeting ends. People keep arguing on the green, happily. |
| autumn | Leaves blow across the meeting board as it's carried home. Someone pins them down with apples. |
| winter | Frost on the library windows, and everyone's breath in the lantern light as they argue all the way home. |

**Almanac line** (script). Act IV: The Town Has Two Stories. We kept a plan: {plan}.

**Between acts** (script). The pages are loosening on the windowsill. Pause here, or turn the story on.

| Key | Text | Source |
|---|---|---|
| reread | Read the ending again | new |
| pause | Pause here | new |
| scene | The same meeting board, later. The old map has new pencil on it: a line, a question mark and a small drawing of a reed. | new |
| caption | The old map, with new pencil on it. | new |
