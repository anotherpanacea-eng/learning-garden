// Readings keep a space between words, numbers and units, so "right at 2 m/s" never shows as
// "right at2m/s" (roadmap lane A, recent-board sweep). A bounded scan of dist sources for m/s readings.
import {readFileSync,readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';

const joined=/[\p{L}\u2019':][+\u2212-]?\d+(?:\.\d+)?\s*m\/s\b|\d(?:\.\d+)?m\/s\b/gu;
export function joinedReadings(text,path='fixture'){
  return [...text.matchAll(joined)].map(m=>`${path}:${text.slice(0,m.index).split('\n').length}: ${m[0]}`);
}

for(const text of ['right at2m/s', 'ferry\u2019s\u22121m/s', 'right2 m/s', 'left-1 m/s',
  "ferry's+1 m/s", 'position:0 m/s', '2m/s', '\u22121.5m/s', '2m/s; 3m/s']) {
  assert.equal(joinedReadings(text).length,text.includes(';')?2:1,`joined reading detected: ${text}`);
}
assert.deepEqual(joinedReadings('right at 2 m/s; the ferry\u2019s \u22121 m/s; (${v} m/s); 1.5 m/s; \u22122 m/s; +3 m/s'),[], 'spaced readings pass');
assert.equal(joinedReadings('2m/s\n3m/s','fixture.mjs')[1], 'fixture.mjs:2: 3m/s', 'diagnostics preserve path and line');
assert.equal(joinedReadings('2m/s').length,1,'repeated scans do not retain regex state');

const dist=fileURLToPath(new URL('../dist/',import.meta.url));
const flags=readdirSync(dist).filter(f=>f.endsWith('.mjs')).flatMap(f=>joinedReadings(readFileSync(dist+f,'utf8'),f));
assert.deepEqual(flags,[],'readings without spaces:\n'+flags.join('\n'));
console.log('unit spacing checks passed');
