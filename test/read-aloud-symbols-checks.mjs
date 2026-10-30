// Button and link labels read cleanly aloud (roadmap lane A, step 4). A bounded source scan: an arrow
// or tick glyph at the start or end of a button or link label sits in an aria-hidden span, so a
// screen reader says "Back to the garden" rather than "left arrow Back to the garden".
import {readFileSync,readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';

const glyph='[←→↗✓]';
const leading=new RegExp(`<(a|button)\\b[^<>]*>${glyph}`,'g');
const trailing=new RegExp(` ${glyph}</(a|button)>`,'g');
const helper=new RegExp(`['\`]${glyph} [A-Z]|[a-z] ${glyph}['\`]|'${glyph} Chosen'|<span>${glyph} Selected`,'g');

export function spokenGlyphs(text,path='fixture'){
  const flags=[];
  for(const re of [leading,trailing,helper])for(const m of text.matchAll(re))
    flags.push(`${path}:${text.slice(0,m.index).split('\n').length}: ${m[0]}`);
  return flags;
}

assert.equal(spokenGlyphs('<a href="#home" class="back">← Back to the garden</a>').length,1,'bare leading arrow is flagged');
assert.equal(spokenGlyphs('<button data-x="1">Next stop →</button>').length,1,'bare trailing arrow is flagged');
assert.equal(spokenGlyphs("button('out','← Energy out',false)").length,1,'helper label is flagged');
assert.deepEqual(spokenGlyphs('<a class="back"><span aria-hidden="true">←</span> Back</a>'),[],'hidden glyph passes');
assert.deepEqual(spokenGlyphs('<text x="55">← 4 N</text><p>food → eater</p>'),[],'arrows in drawings and prose are left alone');

const dist=fileURLToPath(new URL('../dist/',import.meta.url));
const flags=readdirSync(dist).filter(f=>f.endsWith('.mjs')).flatMap(f=>spokenGlyphs(readFileSync(dist+f,'utf8'),f));
assert.deepEqual(flags,[],'glyphs read aloud in labels:\n'+flags.join('\n'));
console.log('read-aloud symbol checks passed');
