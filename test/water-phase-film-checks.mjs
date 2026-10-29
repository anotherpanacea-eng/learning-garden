import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {waterFilmCaptions,waterFilmEntry,waterFilmPage} from '../dist/water-phase-film.mjs';
import {waterPhasePage,resetWaterPhase} from '../dist/water-phase.mjs';
let n=0;const ok=(v,m)=>{assert.ok(v,m);n++;};
const vtt=readFileSync(new URL('../dist/assets/water-molecules-corrected.vtt',import.meta.url),'utf8'),copy=readFileSync(new URL('../docs/content/304-water-film-text.md',import.meta.url),'utf8');
const times=[...vtt.matchAll(/(\d\d):(\d\d):(\d\d\.\d{3}) --> (\d\d):(\d\d):(\d\d\.\d{3})/g)].map(m=>[+m[1]*3600+ +m[2]*60+ +m[3],+m[4]*3600+ +m[5]*60+ +m[6]]);
assert.deepEqual(times,[[.3,5.9],[6.3,11.65],[11.65,15.9],[16.3,22.9],[23.3,29.9],[30,35]]);n++;assert.deepEqual(waterFilmCaptions.map(c=>[c.start,c.end]),times);n++;
ok(waterFilmCaptions.length===6&&waterFilmCaptions.every(c=>vtt.includes(c.text)&&copy.includes(c.text)),'all reviewed words remain in captions and copy');
ok(waterFilmCaptions[4].text.includes('jar’s water')&&waterFilmCaptions[4].text.includes('still vibrate'),'corrected freezing words');ok(!/lock back/.test(vtt),'misleading locked/still wording absent');
const entry=waterFilmEntry(),page=waterFilmPage();ok(!/<video|\.mp4|fetch\(/.test(entry),'passive invitation never embeds or fetches film');ok(entry.includes('36 molecule symbols')&&entry.includes('12')&&entry.includes('not the particle you selected'),'different representations not same selected identity');
ok((page.match(/<li>/g)||[]).length===6&&waterFilmCaptions.every(c=>page.includes(c.text)),'complete transcript even before loading');ok(page.includes('ordinary pressure')&&page.includes('not outdoor air'),'sample assumptions visible');ok(page.includes('does not mean water from the icicle')&&page.includes('no water gets in or out'),'generic symbol and matter/energy boundary folds');ok(page.includes('retrac')&&page.includes('spacing and speeds are not measurements'),'no measured microscopic paths/density');ok(!/data-[^=]*sound|<audio/.test(page),'silent film without a Sound control');ok(!/aria-live/.test(page),'caption not repeatedly announced');
for(const science of [undefined,{version:99,visits:'kept'},{future:'opaque'}]){const book={science,bellStudio:{version:99,future:'kept'},rhythm:{version:99},sibling:'x'.repeat(550000)},before=JSON.stringify(book),html=waterPhasePage(book,'synthetic-owner');ok(before===JSON.stringify(book),'entry preserves every unknown owner');ok(!/<video|\.mp4/.test(html)&&html.includes('Watch ice change'),'manual entry has invitation only');resetWaterPhase();}
ok(readFileSync(new URL('../dist/assets/water-molecules-corrected.mp4',import.meta.url)).length===2511180,'candidate file size only; actual codec/full-decode and pictures separate');
console.log(`${n} Water film source assertions passed; native/media/physical evidence separate`);
