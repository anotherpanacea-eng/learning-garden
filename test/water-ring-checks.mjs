// Finite teaching/media consistency and generated diagram boundaries; synthetic only.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {drawnHowto} from '../dist/drawn-howtos-content.mjs';
import {loadArt} from '../dist/drawn-howto.mjs';
import {waterRingFilmCaptions} from '../dist/water-ring-film.mjs';
import {weatherPage} from '../dist/weather-tally-ui.mjs';
const h=drawnHowto('water-ring'),a=await loadArt('water-ring');
const bounds=d=>{const ns=d.match(/-?\d+(?:\.\d+)?/g).map(Number),xs=ns.filter((_,i)=>i%2===0),ys=ns.filter((_,i)=>i%2===1);return {x:Math.min(...xs),y:Math.min(...ys),right:Math.max(...xs),bottom:Math.max(...ys)};};
const wash=i=>bounds(a.steps[i].find(([k])=>k[0]==='w')[1]);
assert.ok(wash(2).bottom<wash(0).y,'generated cloud is above generated brook/ground');
assert.ok(!a.steps[1].some(([k])=>k[0]==='w'||k==='bg'),'generated vapor stage and incoming arrow have no filled wash');
assert.ok(a.steps[1].some(([k,d])=>k==='l'&&(d.match(/M/g)||[]).length>15),'vapor outline has separated short strokes');
assert.equal(h.at,undefined,'weather ring is hand-placed, not offered on other routes');
for(const weather of [undefined,{version:99,original:'keep me'},[{unreadable:true}]]){
 const state={weather,untouched:{note:'invented',unknown:7}},before=JSON.stringify(state),html=weatherPage(state,'synthetic');
 assert.match(html,/data-how="water-ring"/);assert.match(html,/data-water-ring-watch/);
 assert.equal(JSON.stringify(state),before,'pure explanatory entry never changes even unsupported weather');
}
const text=await readFile(new URL('../docs/content/346-water-cycle-ring-text.md',import.meta.url),'utf8');
const expected=[...text.matchAll(/^\d+\. ([\d.]+)–([\d.]+) s: (.+)$/gm)].map(([,start,end,text])=>({start:+start,end:+end,text}));
assert.equal(expected.length,14);assert.deepEqual(waterRingFilmCaptions,expected,'runtime uses accepted finite cue list');
const vtt=await readFile(new URL('../dist/media/water-ring.vtt',import.meta.url),'utf8');
const seconds=t=>t.split(':').reduce((n,x)=>n*60+Number(x),0);
const actual=[...vtt.matchAll(/([\d:.]+) --> ([\d:.]+)\n([^\n]+)/g)].map(([,start,end,text])=>({start:seconds(start),end:seconds(end),text}));
assert.deepEqual(actual,expected,'published caption track uses accepted windows and corrected text');
assert.ok(actual.every((c,i)=>c.end>c.start&&c.start>=(actual[i-1]?.end??0)&&c.end<=37));
console.log('Water ring: generated science orientation, unfilled vapor, unsupported weather purity and14 accepted caption windows passed.');
