import assert from 'node:assert/strict';
import {createLetterpressVisit,changeLetterpress,letterpressPair,letterpressChoices,letterpressComparison,letterpressStrip,letterpressCapitalWord} from '../dist/letterpress-core.mjs';
import {letterpressPage,resetLetterpressView} from '../dist/letterpress-ui.mjs';
const lower='abcdefghijklmnopqrstuvwxyz',upper='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
// Literal independent order oracle from the reviewed finite companion, not a second copy of the generator.
const orders=['abc','cdb','ecd','def','fge','hfg','ghi','ijh','kij','jkl','lmk','nlm','mno','opn','qop','pqr','rsq','trs','stu','uvt','wuv','vwx','xyw','zxy','ayz','bza'];
let v=createLetterpressVisit();assert.deepEqual(v.source.pairs.map(p=>[p.id,p.capital,p.lowercase]),[...lower].map((id,i)=>[id,upper[i],id]));
assert.deepEqual(Object.keys(v.source.labels),['cat','pin','mop','bat']);
assert.deepEqual(Object.values(v.source.labels).map(w=>w.meaning),['A cat waits by the prop box.','A badge pin is a pretend theater prop.','This mop cleans a pretend stage.','This bat is a toy for hitting a ball.']);
const positions=new Set();let mats=0;
for(let i=0;i<26;i++)for(const direction of ['capital-target','lowercase-target']){
 v=createLetterpressVisit();v=changeLetterpress(v,'letter',lower[i]);v=changeLetterpress(v,'try');if(direction==='lowercase-target')v=changeLetterpress(v,'flip');
 assert.deepEqual(letterpressChoices(v).map(p=>p.id),[...orders[i]]);positions.add(orders[i].indexOf(lower[i]));mats++;
 for(const id of orders[i]){const chosen=changeLetterpress(v,'choose',id),result=letterpressComparison(chosen),j=lower.indexOf(id);
  const target=direction==='capital-target'?upper[i]:lower[i],choice=direction==='capital-target'?id:upper[j];
  assert.equal(result.literal,'You put '+(direction==='capital-target'?'capital ':'lowercase ')+target+' with '+(direction==='capital-target'?'lowercase ':'capital ')+choice+'.');
  if(id===lower[i])assert.equal(result.text,'These are two forms of the same letter. Your partner can name it with you.');
  else assert.equal(result.text,'Our drawer pairs capital '+upper[i]+' with lowercase '+lower[i]+'. You can swap your choice or keep looking.');
 }
 const outsider=[...lower].find(id=>!orders[i].includes(id));assert.equal(changeLetterpress(v,'choose',outsider),null);
}
assert.deepEqual([...positions].sort(),[0,1,2]);assert.equal(mats,52);
let patterns=0;
for(const [id,caps]of Object.entries({cat:'CAT',pin:'PIN',mop:'MOP',bat:'BAT'}))for(let mask=0;mask<8;mask++){
 let s=changeLetterpress(createLetterpressVisit(),'print');s=changeLetterpress(s,'label',id);
 const before=structuredClone(s);let expected='';for(let i=0;i<3;i++){expected+=mask&(1<<i)?caps[i]:id[i];if(mask&(1<<i))s=changeLetterpress(s,'place',i);}
 assert.equal(s.labels[id].pattern,expected);assert.deepEqual(before.labels[id].pattern,id);assert.equal(letterpressCapitalWord(s),caps);
 const pinned=changeLetterpress(s,'pin');assert.equal(pinned.wall[id],expected);assert.equal(pinned.wallOpen,true);assert.equal(Object.keys(pinned.wall).length,1);
 const compared=changeLetterpress(pinned,'poster');assert.equal(compared.labels[id].pattern,expected);assert.deepEqual(compared.wall,pinned.wall);assert.equal(compared.labels[id].posterOpen,true);
 assert.equal(changeLetterpress(compared,'posterBack').labels[id].posterOpen,false);
 assert.equal(changeLetterpress(s,'all','capital').labels[id].pattern,caps);assert.equal(changeLetterpress(s,'all','lowercase').labels[id].pattern,id);patterns++;
}
assert.equal(patterns,32);
// Real input state is preserved by a transition; separate visits own separate sources.
v=createLetterpressVisit();const before=structuredClone(v),next=changeLetterpress(v,'try');assert.deepEqual(v,before);assert.notEqual(v,next);
const other=createLetterpressVisit();other.source.pairs[0].capital='!';assert.equal(v.source.pairs[0].capital,'A');
v=changeLetterpress(next,'choose','b');const work=structuredClone(v.letters.a);v=changeLetterpress(v,'look');assert.equal(changeLetterpress(v,'choose','a'),null);v=changeLetterpress(v,'contrast','bd');v=changeLetterpress(v,'back');assert.deepEqual(v.letters.a,work);
v=changeLetterpress(v,'letter','i');v=changeLetterpress(v,'try');v=changeLetterpress(v,'flip');v=changeLetterpress(v,'choose','i');v=changeLetterpress(v,'letter','a');assert.deepEqual(v.letters.a,work);v=changeLetterpress(v,'letter','i');assert.equal(v.letters.i.direction,'lowercase-target');assert.equal(v.letters.i.choice,'i');v=changeLetterpress(v,'model');v=changeLetterpress(v,'try');assert.equal(v.letters.i.choice,'i');v=changeLetterpress(v,'flip');assert.equal(v.letters.i.choice,null);
v=changeLetterpress(v,'letter','z');v=changeLetterpress(v,'next');assert.equal(v.selected,'a');
v=changeLetterpress(v,'print');assert.equal(v.labels.cat.pairsOpen,true);assert.equal(v.labels.pin.pairsOpen,true);assert.equal(v.labels.mop.pairsOpen,false);assert.equal(v.labels.bat.pairsOpen,false);
v=changeLetterpress(v,'all','capital');v=changeLetterpress(v,'pin');v=changeLetterpress(v,'all','lowercase');v=changeLetterpress(v,'label','pin');assert.equal(v.labels.cat.pairsOpen,false);assert.equal(v.labels.pin.pairsOpen,true);assert.equal(v.wall.cat,'CAT');v=changeLetterpress(v,'place',1);v=changeLetterpress(v,'pin');
assert.equal(letterpressStrip(v,v.wall.pin,'pin'),'Your printing: lowercase p, capital I, lowercase n.');
v=changeLetterpress(v,'wallSelect','cat');assert.equal(v.labels.cat.pattern,'cat');assert.equal(v.wall.cat,'CAT');assert.equal(v.labels.pin.pattern,'pIn');assert.equal(v.labels.pin.pairsOpen,false);
assert.equal(changeLetterpress(v,'wallSelect','mop'),null);assert.equal(changeLetterpress(v,'place',-1),null);assert.equal(changeLetterpress(v,'place',3),null);assert.equal(changeLetterpress(v,'place',1.2),null);assert.equal(changeLetterpress(v,'label','fox'),null);assert.equal(changeLetterpress(v,'all','mixed'),null);assert.equal(changeLetterpress(v,'unknown'),null);
resetLetterpressView();const html=letterpressPage({},'synthetic');assert.ok(html.includes('data-lp-root'));assert.ok(html.includes('Capital A and lowercase a'));assert.match(html,/<p id="lp-status"[^>]*><\/p>/);assert.ok(html.includes('Nothing here is saved.'));
console.log('Letterpress source:26 literal pairs,52 independent choice mats,32 label patterns, rendering, visit isolation and state-preserving returns passed.');
