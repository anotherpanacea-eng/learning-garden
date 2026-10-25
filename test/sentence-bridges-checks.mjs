import assert from 'node:assert/strict';
import fs from 'node:fs';
import {bridgeScenes,bridgeWords,bridgeOpening,bridgeTeaching} from '../dist/sentence-bridges-content.mjs';
import {initialBridges,changeBridges,bridgesPresentation,bridgesNarration,bridgesAnnouncement} from '../dist/sentence-bridges-core.mjs';
import {bridgesPage,resetBridgesSession} from '../dist/sentence-bridges-ui.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;};
const spec=fs.readFileSync(new URL('../docs/specs/109-sentence-bridges.md',import.meta.url),'utf8');
for(const c of bridgeScenes){
 ok(spec.includes(c.context)&&spec.includes(c.purpose)&&spec.includes(c.a)&&spec.includes(c.b),'complete reviewed source is retained');
 for(const order of ['AB','BA'])for(const bridge of [null,...bridgeWords]){
  const s={caseId:c.id,order,bridge,previous:null},p=bridgesPresentation(s),first=order==='AB'?c.a:c.b,second=order==='AB'?c.b:c.a;
  if(bridge){const row=spec.split('\n').find(r=>r.startsWith(`| \`${c.id}\` | ${order} / **${bridge}**`));eq(p.trial,row.split('|')[3].trim(),'all18 exact joined sentences');eq(p.meaning,row.split('|')[4].trim(),'all18 exact meaning notes');eq(p.strips.map(x=>x.text),[first.slice(0,-1),second.replace(/^(The|Rain) /,x=>x.toLowerCase()).slice(0,-1)],'joined strip casing and punctuation preserve proper names');}
  else{eq(p.trial,`${first} ${second}`,'all6 complete separated presentations');eq(p.strips.map(x=>x.text),[first,second]);eq(p.meaning,'Two sentences. No joining word is selected.');}
  eq(p.strips.map(x=>x.id),order==='AB'?['A','B']:['B','A'],'source identifiers move with clauses');
  eq(bridgesNarration(s),`Our scene: ${c.context} Purpose: ${c.purpose} Sentence we are trying: ${p.trial} Meaning to notice: ${p.meaning}`,'scene and unsupported interpretation stay together in current speech');
  for(const [action,value] of [['word','and'],['word','because'],['word','but'],['swap'],['separate']]){
   const before=structuredClone(s),next=changeBridges(s,action,value);eq(s,before,'core never mutates the old session');
   if(next){const undo=changeBridges(next,'undo');eq({...undo,previous:null},s,'one Undo restores the last presentation exactly');eq(changeBridges(undo,'undo'),null,'Undo clears its single snapshot');}
  }
  eq(changeBridges(changeBridges(s,'swap'),'swap').order,order,'double swap restores source order');
  eq(changeBridges(s,'scene',c.id),null,'same case is a no-op');
  const other=bridgeScenes.find(x=>x.id!==c.id);eq(changeBridges(s,'scene',other.id),initialBridges(other.id),'new scene resets order bridge and Undo');
 }
}
eq(bridgeScenes.length,3);eq(bridgeWords,['and','because','but']);ok(spec.includes(bridgeOpening)&&spec.includes(bridgeTeaching));
const s=changeBridges(initialBridges(),'word','because');eq(changeBridges(s,'word','because'),null);eq(changeBridges(s,'word','unknown'),null);eq(changeBridges(s,'scene','unknown'),null);eq(changeBridges(initialBridges(),'separate'),null);
eq(bridgesAnnouncement(changeBridges(s,'undo'),'undo'),'Last change undone. Sentence order: A then B. Two sentences. No joining word is selected.');
resetBridgesSession();const html=bridgesPage('synthetic-owner');ok(html.includes('id="bridges-status" role="status" aria-live="polite"></p>'),'initial status is empty');ok(html.includes('<h2>Meaning to notice</h2><p>Two sentences. No joining word is selected.</p>'),'separate meaning is visible');ok(html.includes('<span aria-hidden="true">✓ </span>'),'check is decorative and native pressed state owns selection');
const ui=fs.readFileSync(new URL('../dist/sentence-bridges-ui.mjs',import.meta.url),'utf8');ok(!/\bsave\(|note.*Display\(|localStorage|fetch\(/.test(ui),'no persistence, exposure or network path');
const app=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');ok(app.includes("const bridgesBench=hash==='#loft/bridges'"),'exact hash only');ok(app.includes('!bridgesBench||choosingExplorer'),'route reset'); // Shared-panel exclusion is exercised in the Games Table browser journey, not by adjacency of source tokens.
console.log(`Sentence Bridges: ${n} finite-content/Undo/host assertions passed.`);
