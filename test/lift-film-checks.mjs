import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {liftFilmCaptions,liftFilmEntry,liftFilmPage} from '../dist/lift-film.mjs';
import {liftYardPage,resetLiftYard,freshLiftYard,changeLift,liftView} from '../dist/lift-yard.mjs';
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;};
const vtt=readFileSync(new URL('../dist/assets/ramp-lever-corrected.vtt',import.meta.url),'utf8');
const cues=[...vtt.matchAll(/(\d{2}):(\d{2}):(\d{2}\.\d{3}) --> (\d{2}):(\d{2}):(\d{2}\.\d{3})\n([^\n]+)/g)].map(m=>({start:+m[1]*3600 + +m[2]*60 + +m[3],end:+m[4]*3600 + +m[5]*60 + +m[6],text:m[7]}));
assert.deepEqual(cues,liftFilmCaptions);checks++;ok(cues.length===6&&cues.at(-1).end===38,'complete six-cue full38s film');
for(let i=0;i<cues.length;i++){const c=cues[i];ok(c.start<c.end&&c.start>=(cues[i-1]?.end||0),'ordered nonoverlapping exact windows');ok(Object.isFrozen(liftFilmCaptions[i]),'finite teaching is immutable');}
ok(cues[3].text.includes('distance pushed down')&&!cues[5].text.includes('a bit'),'force direction and friction corrections retained');
const html=liftFilmPage();for(const c of cues)ok(html.includes(c.text),'complete readable transcript independent of loading');
ok(html.includes('In the lever scenes')&&html.includes('not the whole weight')&&html.includes('sideways distance arrow'),'scoped force/area distinctions');
ok(html.includes('different examples and numbers')&&html.includes('Your ramp and lever jobs will wait'),'separate teaching/model boundary');
ok(html.includes('data-lift-film-return')&&html.includes('preload="none"')&&!/autoplay|<audio|data-speak|<script/.test(html),'silent explicit transport, no sound/autoplay service');
ok(/data-lift-action="watch"/.test(liftFilmEntry()),'shared optional invitation');
const book=new Proxy({}, {get(){throw Error('notebook is identity only');},set(){throw Error('no saved write');}});resetLiftYard();const entry=liftYardPage(book,'synthetic');ok(entry.includes('data-lift-action="watch"')&&!entry.includes('<video'),'entry offers optional film without rendering asset');
let s=changeLift(freshLiftYard(),'start');s=changeLift(s,'pull');ok(liftView(s).distance===1&&!liftView(s).done,'existing trip remains a partial delivery');resetLiftYard();
console.log(checks,'lifting-film source checks; native/media/release evidence separate');
