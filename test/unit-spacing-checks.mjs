// Readings keep a space between words, numbers and units, so "right at 2 m/s" never shows as
// "right at2m/s" (roadmap lane A, recent-board sweep). A bounded scan of dist sources for m/s readings.
import {readFileSync,readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';

const joined=/[A-Za-z’:][+−]?\d+(?:\.\d+)? ?m\/s|\d(?:m\/s)\b/g;
export function joinedReadings(text,path='fixture'){
  return [...text.matchAll(joined)].map(m=>`${path}:${text.slice(0,m.index).split('\n').length}: ${m[0]}`);
}

assert.equal(joinedReadings('both move right at2m/s').length,1,'word and number run together');
assert.equal(joinedReadings('the ferry’s−1m/s').length,1,'signed number runs into the unit');
assert.deepEqual(joinedReadings('right at 2 m/s; the ferry’s −1 m/s; (${v} m/s)'),[],'spaced readings pass');

const dist=fileURLToPath(new URL('../dist/',import.meta.url));
const flags=readdirSync(dist).filter(f=>f.endsWith('.mjs')).flatMap(f=>joinedReadings(readFileSync(dist+f,'utf8'),f));
assert.deepEqual(flags,[],'readings without spaces:\n'+flags.join('\n'));
console.log('unit spacing checks passed');
