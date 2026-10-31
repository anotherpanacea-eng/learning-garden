// Spec 322 §5: Field Journal frame copy, from docs/content/322-field-journal-cafe-text.md.
// Ember's arrival line is kept as Storybook, so it has no greeting here.
import {styleOf} from './style-core.mjs';
const line=(greeting,thanks)=>Object.freeze(greeting?{greeting,thanks}:{thanks});
export const fieldJournalCafe=Object.freeze({
 puff:line('A cloud-dragon settles at the counter, umbrella furled. “It is mostly decorative,” Puff admits.','“Thank you. A fine plate for a cloud-sized afternoon.”'),
 brolly:line('An umbrella-sprite folds up at the door. One raindrop stays on.','“Thank you. The raindrop can ring for dinner.”'),
 tangle:line('A ribbon-giant ties a bow to remember the order, then studies it. Which bow was that?','“Thank you. One knot fewer to keep track of.”'),
 pebble:line('A pebble-troll takes a seat. The seat looks a little surprised.','“A good pretend picnic. I brought my own mountain.”'),
 wisp:line('A lantern-sprite drifts to the window table. “I like to watch the road.”','“Thank you. A good view and a good plate.”'),
 bobble:line('A little comet leaves its tail outside, across two imaginary bicycle spaces.','“Thank you. Time for a small orbit before tea.”'),
 fern:line('A teacup-sprite arrives, saucer worn as a hat. “It keeps the thoughts in.”','“Thank you. My hat will want the details.”'),
 nib:line('A star-sprite looks over the counter. “I usually order by constellation.”','“Thank you. A small imaginary constellation of my own.”'),
 clover:line('A bunny settles on a cushion. “A table for me and my ears, please.”','“Hop, hop. Thank you. A very good pretend picnic.”'),
 ember:line(null,'“Thank you. That earns a small victory puff.”'),
 purl:line('A gray kitten looks over the counter. “A table for me and my invisible yarn, please.”','“Purr-fect. My invisible yarn would like the recipe.”'),
 biscuit:line('A ginger kitten settles on a cushion, kneading. “I’m helping with the pretend dough.”','“Mrrp. Very good. I’ll leave a tiny paw-print review.”'),
 supper:Object.freeze({
  eyebrow:'Café ledger',
  invitation:'The neighbors are back from mending the garden. Serve six tables for their welcome-back dinner.',
  ending:'The welcome-back dinner is ready. Lanterns lit, café open: the neighbors can rest and eat together.',
 }),
});
export function frameText(state,storybook,variant){
 return styleOf(state)==='field-journal'&&typeof variant==='string'&&variant!==''?variant:storybook;
}
// End of the Field Journal frame copy.
