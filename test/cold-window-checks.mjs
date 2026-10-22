import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {coldWindowPage} from '../dist/cold-window-ui.mjs';

const empty={garden:{}};
const before=JSON.stringify(empty);
const page=coldWindowPage(empty);
assert.equal(JSON.stringify(empty),before,'the page accepts a state without science and does not allocate it');
assert.match(page,/Cool the pane/);
assert.match(page,/not every cooled pane will make drops/);
assert.match(page,/no need for real cold glass, water, heating, or equipment/);
for(const name of ['before','cool','return']){
 const art=readFileSync(new URL(`../dist/cold-window-${name}.svg`,import.meta.url),'utf8');
 assert.match(art,/<svg\b/);
 assert.match(art,/imagined tiny view/i);
 assert.match(art,/air-facing/i);
 assert.doesNotMatch(art,/<script\b|onload=|onerror=/i);
 const radii=[...art.matchAll(/<circle\b[^>]*\br="([^"]+)"/g)].map(match=>match[1]);
 assert.equal(radii.length,7,'the same small molecule sample appears in each frame');
 assert.deepEqual([...new Set(radii)],['5'],'the molecule dots retain one radius');
}
console.log('Cold Window source/page checks passed.');
