import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as film from '../dist/mill-film.mjs';
import {freshEnergyBook,changeEnergyBook,energyView,millEnergyPage,resetMillEnergy} from '../dist/mill-energy.mjs';
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
const text=readFileSync(new URL('../docs/content/309-mill-film-text.md',import.meta.url),'utf8');
const expected=[...text.matchAll(/^\|([\d.]+)\|([\d.]+)\|([^|]+)\|$/gm)].map(m=>({start:+m[1],end:+m[2],text:m[3]}));
eq(Object.keys(film).sort(),['bindMillFilm','millFilmCaptions','millFilmEntry','millFilmPage','pauseMillFilm','stopMillFilm'],'bounded adapter exports');
eq(film.millFilmCaptions,expected,'every cue and window matches the authored exact copy');
ok(expected.length===12&&expected[0].start===.2&&expected.at(-1).end===32,'complete twelve-cue 32s film');
ok(Object.isFrozen(film.millFilmCaptions),'caption sequence is immutable');
for(let i=0;i<expected.length;i++){const c=expected[i];ok(c.start<c.end&&c.start>=(expected[i-1]?.end||0),'ordered nonoverlapping windows');ok(Object.isFrozen(film.millFilmCaptions[i]),'each supplied cue is immutable');}
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const html=film.millFilmPage();
for(const c of expected)ok(html.includes(`<li>${escape(c.text)}</li>`),'complete transcript survives without a decoder');
for(const m of text.matchAll(/^(?:Visible framing|Second paragraph|Credit): \*\*(.*?)\*\*|^\*\*(.*?)\*\*$/gm))ok(html.includes(escape(m[1]||m[2])),'exact visible framing, about paragraph or credit');
for(const label of ['The mill wheel: where the energy goes','Return to my mill','Play','Replay','Retry loading','Read the complete transcript below at any time.','Read the complete film transcript','About these drawings'])ok(html.includes(label),'required film copy');
for(const hook of ['movie','return','caption','transcript','load-status'])ok(html.includes(`data-mill-film-${hook}`),'integration hook');
for(const a of ['play','replay','retry'])ok(html.includes(`data-mill-film-action="${a}"`),'finite transport action');
ok(/<video controls playsinline muted preload="none" tabindex="0"/.test(html),'silent focusable native scrubber');
ok(html.includes('aria-describedby="mill-film-caption"')&&html.includes('aria-label="The mill wheel: where the energy goes, silent corrected film"'),'caption and video description');
ok(!/<audio|<script|<iframe|autoplay|aria-live/.test(html),'no automatic media or live caption announcements in markup');
ok(!/<source|<track|\.mp4|\.vtt/.test(html),'source and track deferred to an entered film turn');
ok(html.includes('poster="./assets/mill-energy-corrected.jpg"'),'local corrected poster');
const entry=film.millFilmEntry();ok(entry.includes('data-energy-action="watch"')&&entry.includes('Watch the mill film')&&entry.includes('Optional silent film · 32 seconds'),'exact optional invitation');
ok(!/<video|<img|\.mp4|\.jpg|\.vtt/.test(entry),'invitation itself requests no film asset');
const source=readFileSync(new URL('../dist/mill-film.mjs',import.meta.url),'utf8');
for(const ext of ['mp4','vtt'])ok(source.includes(`./assets/mill-energy-corrected.${ext}`),'only local corrected source paths');
ok(!/https?:|localStorage|sessionStorage|indexedDB|AudioContext|speechSynthesis|freshEnergyBook|normalizeNotebook/.test(source),'standalone helper has no remote runtime, saved records or audio service');
// These are module/pure-model checks, not film-turn integration or native lifecycle proof.
for(const size of [8,12,16]){
 let s=changeEnergyBook(freshEnergyBook(),'size',size);s=changeEnergyBook(s,'pour');s=changeEnergyBook(s,'grind');
 const v=energyView(s);eq([v.work.waiting,v.work.moving,v.work.grinding,v.work.rubbing,v.total],[size-2,1,1,0,size],'existing finite energy transition remains available');
 const before=JSON.stringify(s);film.millFilmEntry();film.millFilmPage();eq(JSON.stringify(s),before,'standalone explanatory rendering does not consume a model step');
}
const book=new Proxy({}, {get(){throw Error('notebook data must not be read');},set(){throw Error('notebook data must not be written');}});resetMillEnergy();const page=millEnergyPage(book,'synthetic');ok(page.includes('data-energy-action="watch"')&&page.includes('Optional silent film · 32 seconds'),'real manual page offers optional film without reading notebook');ok(!/<video|<audio|<img|mill-energy-corrected/.test(page),'manual entry contains no movie/poster/source');resetMillEnergy();
film.pauseMillFilm();film.stopMillFilm();film.stopMillFilm();ok(true,'unbound pause/disposal are safe');
const vttPath=new URL('../dist/assets/mill-energy-corrected.vtt',import.meta.url);
{
 const vtt=readFileSync(vttPath,'utf8');
 const actual=[...vtt.matchAll(/(\d{2}):(\d{2}):(\d{2}\.\d{3}) --> (\d{2}):(\d{2}):(\d{2}\.\d{3})\n([^\n]+)/g)].map(m=>({start:+m[1]*3600 + +m[2]*60 + +m[3],end:+m[4]*3600 + +m[5]*60 + +m[6],text:m[7]}));
 eq(actual,expected,'shipped VTT matches every exact cue/window');
}
console.log(checks,'mill-film standalone source assertions; native lifecycle, integration, pictures and release gates remain separate');
