import assert from 'node:assert/strict';
import {readdirSync,readFileSync} from 'node:fs';

// Board back links name the Workshop the way docs/child-copy-glossary.md does.
// "Storm Workshop" is the home-tile title only; a link back says Workshop.
const dist=new URL('../dist/',import.meta.url);
const allowed=/^(← )?(Back to the )?Workshop$|^← More workshop tables$/;
let links=0;
for(const file of readdirSync(dist).filter(name=>name.endsWith('.mjs'))) {
  const text=readFileSync(new URL(file,dist),'utf8');
  for(const match of text.matchAll(/href="#workshop"[^>]*>([\s\S]*?)<\/a>/g)) {
    const label=match[1].replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
    assert.match(label,allowed,`${file}: Workshop back link reads "${label}"`);
    links++;
  }
}
assert.ok(links>=20,`expected the board back links, found ${links}`);
console.log(`Destination link check: ${links} Workshop back links use one name.`);
