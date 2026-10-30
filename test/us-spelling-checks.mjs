// Child-facing copy uses US spelling (roadmap lane A, step 4). A bounded source scan: it flags the
// British forms the 2026-10-22 text review found, inside dist sources, and skips identifier-shaped
// uses (ids, data attributes, object keys, file names) whose change would break saves or markup.
import {readFileSync,readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';

const british=['labelled','labelling','pencilled','neighbour','neighbours','neighbouring','coloured','colour','colours',
  'centimetre','centimetres','millimetre','millimetres','millilitre','millilitres','metre','metres','litre','litres',
  'theatre','catalogue','practising','recognise','recognised','favourite','behaviour'];
const word=new RegExp(`\\b(${british.join('|')})\\b`,'gi');

export function britishSpellings(text,path='fixture'){
  const flags=[];
  for(const m of text.matchAll(word)){
    const a=m.index,b=a+m[0].length,p=text[a-1]??'',q=text[b]??'',q2=text[b+1]??'';
    const prose=p==='-'&&(/\d/.test(text[a-2]??'')||text.slice(a-4,a)==='per-');
    if(('-_./{$'.includes(p)&&p&&!prose)||'-_=?}('.includes(q)&&q||(q===':'&&!' \n'.includes(q2))||(q==='.'&&!' \n<"`\''.includes(q2)))continue;
    const line=text.slice(text.lastIndexOf('\n',a)+1,(text.indexOf('\n',b)+1||text.length+1)-1);
    if(line.includes('distanceUnit'))continue;
    flags.push(`${path}:${text.slice(0,a).split('\n').length}: ${m[0]}`);
  }
  return flags;
}

assert.deepEqual(britishSpellings("title:'Shadow Theatre: move a card'"),['fixture:1: Theatre'],'prose before a colon is flagged');
assert.deepEqual(britishSpellings("{id:'new-neighbour',colour:'#729faf'}"),[],'ids and keys are left alone');
assert.deepEqual(britishSpellings("'The per-metre part. A 24-metre span.'"),['fixture:1: metre','fixture:1: metre'],'hyphenated prose is flagged');
assert.deepEqual(britishSpellings("s.distanceUnit!=='model metres'"),[],'saved unit codes are not rewritten');

const dist=new URL('../dist/',import.meta.url);
const flags=readdirSync(dist).filter(f=>/\.(mjs|html)$/.test(f))
  .flatMap(f=>britishSpellings(readFileSync(new URL(f,dist),'utf8'),`dist/${f}`));
assert.deepEqual(flags,[],`British spellings in child-facing sources:\n${flags.join('\n')}`);
console.log('US spelling: dist sources clear.');
