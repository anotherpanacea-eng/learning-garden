import {cafeStartBands,cafeStartingBand,followsCafeStart,applyCafeStart} from './cafe-start-core.mjs';
export function cafeStartPanel(state){
 const chosen=cafeStartingBand(state)?.id||'seedling';
 return `<section class="panel"><h2>Café starting amounts</h2><p>Optional, for this explorer only. This changes amounts for the next new guest. Your current guest and earlier work stay as they are. Choosing amounts in the Café overrides this starting choice until you choose to use it again.</p><p>${followsCafeStart(state)?'Future Café orders follow this starting choice.':'The Café keeps its existing amount choice.'} Seedling and Sapling use the same full range in this first version.</p><form id="cafe-start-form"><label for="cafe-start-band">Starting amounts</label><select id="cafe-start-band" style="min-height:44px;max-width:100%;font-size:16px;margin:8px 0">${cafeStartBands.map(x=>`<option value="${x.id}"${chosen===x.id?' selected':''}>${x.label}</option>`).join('')}</select><button type="submit" class="secondary" style="min-height:44px;white-space:normal">Use this starting choice for future Café orders</button></form><p id="cafe-start-status" role="status" tabindex="-1"></p></section>`;
}
export function bindCafeStart(state,{save,render,focus}){
 document.querySelector('#cafe-start-form')?.addEventListener('submit',event=>{
  event.preventDefault();const value=document.querySelector('#cafe-start-band').value;
  const ok=applyCafeStart(state,value);if(ok){save();render();}
  const status=document.querySelector('#cafe-start-status');if(status)status.textContent=ok?'Starting amounts updated for future Café orders. Your current guest stays as they are.':'An earlier starting preference cannot be changed here. It stays unchanged; Café play remains available.';
  focus('#cafe-start-status');
 });
}
