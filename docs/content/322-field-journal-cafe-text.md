# 322 · Field Journal café copy

Companion to [spec 322](../specs/322-field-journal-cafe.md). It completes the CR1 draft in [244's companion](244-presentation-styles-text.md) §3 and §4 for every café guest. Every Storybook line is the string on main at e0cc273, quoted from `dist/cafe-content.mjs` and `dist/cafe-ui.mjs`. 244's companion drafted Field Journal lines for four guests (Puff, Pebble, Wisp and Fern). This sheet supersedes those drafts: Puff's thanks, Pebble's two lines and Fern's arrival are revised here so each guest's original joke survives. The other eight guests are new first drafts. All Field Journal lines need the content review named in spec 322 §9 before a build uses them.

Rules (spec 244 §3 and §4.2): frame layer only. A guest keeps their kind, joke and personality in a quieter key. No line adds, removes or changes a dish, a wish, a property, a quantity, a hint or an instruction; incidental character details (Bobble's two bicycle spaces, the six tables) stay as they are. Second person or plain narration, US spelling, no em-dashes, 30 words at most, no exclamation marks.

## 1. The choice in Grown-up notes

Unchanged from 244's companion §1:

| Element | Text |
| --- | --- |
| Panel heading | How the town looks |
| Storybook option | **Storybook** · Bright pictures and playful lines. |
| Field Journal option | **Field Journal** · Notebook pages, maps and quieter lines. |
| Explanation | Change this any time. Your guide, your work and how hard things are stay the same. |
| Preview caption | One café order, shown both ways. |
| Saved confirmation | Look changed for this explorer. |

Two lines are new:

| Element | Text |
| --- | --- |
| Button | Use this look |
| No change | This explorer already uses this look. |

## 2. Guest arrival and thank-you lines

| Guest (id, kind) | Line | Storybook (shipped) | Field Journal |
| --- | --- | --- | --- |
| puff, cloud-dragon | arrival | A little cloud-dragon curls around the counter. “My umbrella is mostly decorative.” | A cloud-dragon settles at the counter, umbrella furled. “It is mostly decorative,” Puff admits. |
| | thanks | “Thank you! A fine plate for a cloud-sized afternoon.” | “Thank you. A fine plate for a cloud-sized afternoon.” |
| brolly, umbrella-sprite | arrival | An umbrella-sprite folds up politely. One small raindrop refuses to get off. | An umbrella-sprite folds up at the door. One raindrop stays on. |
| | thanks | “Lovely! I shall pretend the raindrop is my dinner bell.” | “Thank you. The raindrop can ring for dinner.” |
| tangle, ribbon-giant | arrival | A ribbon-giant ties a bow to remember the order. Then forgets which bow. | A ribbon-giant ties a bow to remember the order, then studies it. Which bow was that? |
| | thanks | “Thank you! One less knot to think about.” | “Thank you. One knot fewer to keep track of.” |
| pebble, pebble-troll | arrival | A pebble-troll takes a seat. The seat looks mildly surprised. | A pebble-troll takes a seat. The seat looks a little surprised. |
| | thanks | “A splendid pretend picnic. I brought my own mountain.” | “A good pretend picnic. I brought my own mountain.” |
| wisp, lantern-sprite | arrival | A lantern-sprite floats in. “A table by the window, please. I enjoy looking out.” | A lantern-sprite drifts to the window table. “I like to watch the road.” |
| | thanks | “Thank you! The view and the plate are both quite delightful.” | “Thank you. A good view and a good plate.” |
| bobble, little-comet | arrival | A little comet parks its tail outside. It takes up two imaginary bicycle spaces. | A little comet leaves its tail outside, across two imaginary bicycle spaces. |
| | thanks | “Lovely! I have time for a very small orbit before tea.” | “Thank you. Time for a small orbit before tea.” |
| fern, teacup-sprite | arrival | A teacup-sprite arrives wearing a saucer as a hat. “It keeps the thoughts in.” | A teacup-sprite arrives, saucer worn as a hat. “It keeps the thoughts in.” |
| | thanks | “Thank you! I shall tell my hat all about it.” | “Thank you. My hat will want the details.” |
| nib, star-sprite | arrival | A star-sprite peers over the counter. “I usually order by constellation.” | A star-sprite looks over the counter. “I usually order by constellation.” |
| | thanks | “A lovely plate. A small imaginary constellation, all to myself.” | “Thank you. A small imaginary constellation of my own.” |
| clover, bunny | arrival | A bunny hops onto a cushion. “A table for me and my ears, please.” | A bunny settles on a cushion. “A table for me and my ears, please.” |
| | thanks | “Hop, hop, hooray! That was a very good pretend picnic.” | “Hop, hop. Thank you. A very good pretend picnic.” |
| ember, pocket-dragon | arrival | A little dragon folds her wings beside the counter. “Only the waffles should be crispy.” | **Storybook line kept.** “Crispy” sits next to an order whose dish may be crunchy, so revoicing it risks changing a hint (spec 244 §3 rule 1). |
| | thanks | “Delicious! That deserves a very small victory puff.” | “Thank you. That earns a small victory puff.” |
| purl, kitten | arrival | A gray kitten peeks over the counter. “A table for me and my invisible ball of yarn, please.” | A gray kitten looks over the counter. “A table for me and my invisible yarn, please.” |
| | thanks | “Purr-fect! My invisible yarn would like the recipe.” | “Purr-fect. My invisible yarn would like the recipe.” |
| biscuit, kitten | arrival | A ginger kitten settles on a cushion and starts kneading. “I am helping with the pretend dough.” | A ginger kitten settles on a cushion, kneading. “I'm helping with the pretend dough.” |
| | thanks | “Mrrp! That was delicious. I shall leave a very tiny paw-print review.” | “Mrrp. Very good. I'll leave a tiny paw-print review.” |

## 3. Supper goal panel, first gathering only

| Element | Storybook (shipped) | Field Journal |
| --- | --- | --- |
| Eyebrow | Our café goal | Café ledger |
| Title | The welcome-back dinner | The welcome-back dinner (unchanged) |
| Invitation | Our neighbors are back from mending the garden after the storm. Serve six tables for their welcome-back dinner. | The neighbors are back from mending the garden. Serve six tables for their welcome-back dinner. |
| Progress | {n} of {target} tables served | unchanged |
| Ending | The welcome-back dinner is ready! The lanterns are lit, the café is open, and our neighbors can rest and eat together. | The welcome-back dinner is ready. Lanterns lit, café open: the neighbors can rest and eat together. |
| Served stamp | (none: Storybook has no served flourish today) | A decorative stamp on a served card that is not a recovered closed visit (`served && !x.recovered`), reading **Served**, hidden from assistive technology. The thank-you line carries the meaning. |

Gatherings 2 and later, the "Plan another gathering" lines, the completion and progress wording around the invitation and ending ("You did it!", "All six tables are ready!", the Hear suffixes) and every Café tools instruction, plate, cupboard, stage, repair and help string stay Storybook in both looks. The guest greeting printed inside Café tools uses the selected frame, as everywhere else.

## 4. Home parcel area

No copy changes (244 companion §2). In Field Journal the parcel panel sits on a notebook page: ruled margin, two strips of tape, paper luggage tag on the parcel art. No new label is drawn into the art.
