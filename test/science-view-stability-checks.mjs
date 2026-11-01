import assert from 'node:assert/strict';
import {freshState} from '../dist/core.mjs';
import {liftYardPage,resetLiftYard} from '../dist/lift-yard.mjs';
import {waterPhasePage,resetWaterPhase} from '../dist/water-phase.mjs';
import {soundWindowPage,resetSoundWindow} from '../dist/sound-window.mjs';
import {switchTablePage,resetSwitchTable} from '../dist/switch-table.mjs';
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;};
for(const [render,reset,label] of [[liftYardPage,resetLiftYard,'lift'],[waterPhasePage,resetWaterPhase,'water'],[soundWindowPage,resetSoundWindow,'sound'],[switchTablePage,resetSwitchTable,'switch']]){
 const book=freshState(),before=JSON.stringify(book);reset();render(book,'synthetic-owner');
 ok(JSON.stringify(book)===before,label+' visit-only view does not write notebook');reset();
}
console.log(`${checks} science view stability source checks passed; native focus and preserved visits checked separately.`);
