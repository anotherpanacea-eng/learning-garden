import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshState} from '../dist/core.mjs';
import {liftYardPage,resetLiftYard} from '../dist/lift-yard.mjs';
import {waterPhasePage,resetWaterPhase} from '../dist/water-phase.mjs';
import {soundWindowPage,resetSoundWindow} from '../dist/sound-window.mjs';
import {switchTablePage,resetSwitchTable} from '../dist/switch-table.mjs';
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;};
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8');
const index=read('dist/index.html');
for(const css of ['lift-yard','lift-lever','water-phase','sound-window','switch-table']){
 ok(index.split(`<link rel="stylesheet" href="./${css}.css">`).length===2,css+' has one document-level stylesheet');
 ok(index.indexOf(`href="./${css}.css"`)<index.indexOf('</head>'),css+' stylesheet lives in head');
}
for(const [render,reset,label] of [[liftYardPage,resetLiftYard,'lift'],[waterPhasePage,resetWaterPhase,'water'],[soundWindowPage,resetSoundWindow,'sound'],[switchTablePage,resetSwitchTable,'switch']]){
 const book=freshState(),before=JSON.stringify(book);reset();const html=render(book,'synthetic-owner');
 ok(!html.includes('<link '),label+' turn does not replace a stylesheet');
 ok(JSON.stringify(book)===before,label+' visit-only view does not write notebook');reset();
}
console.log(`${checks} science view stability source checks passed; native focus and preserved visits checked separately.`);
