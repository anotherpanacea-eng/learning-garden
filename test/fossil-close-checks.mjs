import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {fossilObjects,fossilDetail,fossilTeaching,fossilComparison} from '../dist/fossil-close-content.mjs';
import {initialFossil,changeFossil} from '../dist/fossil-close-core.mjs';
import {fossilPage,resetFossilSession,fossilSession} from '../dist/fossil-close-ui.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;};
eq(fossilObjects.map(o=>o.id),['body','trace']);eq(fossilObjects.reduce((n,o)=>n+o.details.length,0),4);
for(const o of fossilObjects){
 ok(statSync(new URL('../dist/'+o.src.slice(2),import.meta.url)).size<250000,'bounded full-frame production photo');ok(o.original.startsWith('https://'));ok(o.credit.includes('Public domain'));eq(new Set(o.details.map(d=>d.id)).size,2);
 for(const d of o.details){const [x,y,w,h]=d.rect;ok(x>=0&&y>=0&&w>0&&h>0&&x+w<=1&&y+h<=1,'whole source rectangle');eq(fossilDetail(o.id,d.id),d);
  let s=changeFossil(initialFossil(),'photo',o.id);eq(s.detail,null);eq(s.sourceOpen,false);const b=structuredClone(s);s=changeFossil(s,'detail',d.id);eq(b,changeFossil(initialFossil(),'photo',o.id),'selection leaves earlier session untouched');eq(s.detail,d.id);eq(s.pins[o.id],null,'looking does not pin');
  const pinned=changeFossil(s,'pin');eq(pinned.pins[o.id],d.id);eq(pinned.view,'look','pin does not advance');eq(s.pins[o.id],null,'pin preserves older state');
  let compared=changeFossil(pinned,'view','compare');eq(compared.pins,pinned.pins);eq(changeFossil(compared,'pin'),null,'compare cannot fabricate a new pin');const back=changeFossil(compared,'back',o.id);eq(back.detail,d.id);eq(back.view,'look');eq(changeFossil(back,'remove',o.id).pins[o.id],null);
  const source=changeFossil(back,'source');eq(source.sourceOpen,true);eq(changeFossil(source,'source').sourceOpen,false);eq(changeFossil(source,'photo',o.id).sourceOpen,false);
 }
}
let s=initialFossil();for(const o of fossilObjects){s=changeFossil(s,'photo',o.id);s=changeFossil(s,'detail',o.details[0].id);s=changeFossil(s,'pin');}eq(s.pins,{body:'ridges',trace:'spread'});s=changeFossil(s,'detail','outside');s=changeFossil(s,'pin');eq(s.pins,{body:'ridges',trace:'outside'},'replace only one pin');eq(changeFossil(s,'detail','ridges'),null,'detail belongs to its own photo');eq(changeFossil(s,'photo','future'),null);eq(changeFossil(initialFossil(),'pin'),null);eq(changeFossil(s,'view','future'),null);
const empty={garden:{}};const before=JSON.stringify(empty);resetFossilSession();ok(fossilPage('synthetic').includes('Fossil Close-Look'));eq(JSON.stringify(empty),before);eq(fossilSession(),initialFossil());resetFossilSession();eq(fossilSession(),null);
ok(fossilTeaching.includes('other geological deposits'));ok(fossilComparison.includes('does not make every line a fossil'));
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');eq((app.match(/!comparisonBench&&!fossilBench/g)||[]).length,2,'both generic appenders excluded');ok(app.indexOf('else if(fossilBench)')<app.indexOf("else if(root==='living')"),'specific route bypasses old Living entries');ok(app.indexOf('bindFossil({')<app.indexOf(' bindSpeech();'),'capture guard binds before speech');
console.log(`Fossil Close-Look: ${n} finite-model/content/host checks passed.`);
