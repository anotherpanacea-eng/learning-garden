// Child-facing copy uses US spelling (roadmap lane A, step 4). A bounded source scan: it flags the
// British forms the 2026-10-22 text review found, inside dist sources, and skips identifier-shaped
// uses (ids, data attributes, object keys, file names) whose change would break saves or markup.
import {readFileSync,readdirSync} from 'node:fs';
import assert from 'node:assert/strict';

const british=['labelled','labelling','pencilled','neighbour','neighbours','neighbouring','coloured','colour','colours',
  'centimetre','centimetres','millimetre','millimetres','millilitre','millilitres','metre','metres','litre','litres',
  'theatre','catalogue','practising','recognise','recognised','favourite','behaviour'];
const word=new RegExp(`\\b(${british.join('|')})\\b`,'gi');

export function britishSpellings(text,path='fixture'){
  const flags=[];
  for(const m of text.matchAll(word)){
    const a=m.index,b=a+m[0].length,p=text[a-1]??'',q=text[b]??'';
    const before=text.slice(0,a),after=text.slice(b);
    // Exempt the stored unit literal itself, never its entire source line.
    const unitStart=text.lastIndexOf("'model metres'",a);
    if(unitStart>=0&&a>=unitStart&&b<=unitStart+14&&/distanceUnit\s*(?::|[!=]==?)\s*$/.test(text.slice(0,unitStart)))continue;
    const token=text.slice(0,a).match(/[\w./-]*$/)[0]+m[0]+after.match(/^[\w./-]*/)[0];
    if(['new-neighbour','data-lift-metre','./shadow-theatre-ui.mjs','./shadow-theatre-core.mjs','./shadow-theatre.css'].includes(token))continue;
    // Bare JS bindings, keys, calls and member references, not punctuation in prose.
    if(/(?:const|let|var)\s+$/.test(before)||/[A-Za-z_$][\w$]*\.$/.test(before)||
      (/^\s*[:=(]/.test(after)&&/(?:^|[{},;])\s*$/.test(before))||
      (q==='('&&p!=="'"&&p!=='"')||
      (q===':'&&/[{,]\s*$/.test(before)))continue;
    if((p==='{'&&text[a-2]==='$')||((q==='}'||q==='|')&&p!==' '))continue;
    // Existing answer parser accepts both spellings; it is not a display string.
    if(m[0]==='metres'&&after.startsWith('?|meters?|m)'))continue;
    flags.push(`${path}:${text.slice(0,a).split('\n').length}: ${m[0]}`);
  }
  return flags;
}

assert.deepEqual(britishSpellings("title:'Shadow Theatre: move a card'"),['fixture:1: Theatre'],'prose before a colon is flagged');
assert.deepEqual(britishSpellings("{id:'new-neighbour',colour:'#729faf'}"),[],'ids and keys are left alone');
assert.deepEqual(britishSpellings("'The per-metre part. A 24-metre span.'"),['fixture:1: metre','fixture:1: metre'],'hyphenated prose is flagged');
assert.deepEqual(britishSpellings("s.distanceUnit!=='model metres'"),[],'saved unit codes are not rewritten');

assert.deepEqual(britishSpellings("distanceUnit:'model metres',title:'A colour guide'"),['fixture:1: colour'],'unit code does not exempt neighboring copy');
assert.deepEqual(britishSpellings("'<p>Pick colour?</p>'"),['fixture:1: colour'],'question punctuation is prose');
assert.deepEqual(britishSpellings("'<p>Colour-coded cards. Theatre:move a card.</p>'"),['fixture:1: Colour','fixture:1: Theatre'],'hyphens and unspaced colons do not hide prose');
assert.deepEqual(britishSpellings('const colour = 1;'),[],'bare binding is not copy');
assert.deepEqual(britishSpellings('item.colour; colour(value); ${colour}'),[],'members, calls and interpolation remain identifiers');
assert.deepEqual(britishSpellings('<g data-lift-metre="0">'),[],'markup attribute name stays stable');
assert.deepEqual(britishSpellings("import x from './shadow-theatre-core.mjs';"),[],'module path stays stable');

const dist=new URL('../dist/',import.meta.url);
const flags=readdirSync(dist).filter(f=>/\.(mjs|html)$/.test(f))
  .flatMap(f=>britishSpellings(readFileSync(new URL(f,dist),'utf8'),`dist/${f}`));
// Existing display miss outside PR #265's editable files. Keep it visible and bounded;
// do not silently treat hyphenated prose as an identifier. Remove when that copy is fixed.
assert.deepEqual(flags,['dist/life-stages-ui.mjs:23: neighbour'],`British spellings in child-facing sources:\n${flags.join('\n')}`);
console.log('US spelling: sources checked; known out-of-scope Chart-neighbour remains in life-stages-ui.mjs:23.');
