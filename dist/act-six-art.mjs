// Spec 606 · the post office map, an original illustration. The map unrolls on the café table, honey jars land on its
// corners, then the three Ways draw themselves in Bramble's ribbon colors: blue for the river path, gold for the bridge
// road, red for the high ford. A chosen Way can be picked out. Everything settles within a few seconds; reduced motion
// shows the finished map.
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const WAYS={
 river:{color:'#3d7fb5',d:'M110 250 C 196 274 226 140 328 164 C 426 188 442 82 540 72',delay:1.2},
 bridge:{color:'#c9962e',d:'M110 250 C 240 334 468 306 522 204 C 546 158 548 112 540 72',delay:1.8},
 ford:{color:'#c0453a',d:'M110 250 L 540 72',delay:2.4}
};
const jar=(x,y,d)=>`<g class="a6-jar" style="--d:${d}s"><rect x="${x-14}" y="${y-16}" width="28" height="30" rx="6" fill="#e8b84a" stroke="#a7792a" stroke-width="2"/><rect x="${x-15}" y="${y-22}" width="30" height="8" rx="2" fill="#b5653a"/></g>`;
export function waysMap(label,caption,{chosen=null}={}){
 const ways=Object.entries(WAYS).map(([id,w])=>`<path class="a6-way${chosen===id?' a6-chosen':''}" data-a6-way="${id}" pathLength="1" style="--d:${w.delay}s" d="${w.d}" stroke="${w.color}" stroke-width="${chosen===id?9:6}" fill="none" stroke-linecap="round"${id==='ford'?' stroke-dasharray="0.04 0.025"':''}/>`).join('');
 return `<figure class="a6-map" data-a6-map${chosen?` data-a6-chosen="${esc(chosen)}"`:''}><svg viewBox="0 0 640 320" role="img" aria-label="${esc(label)}"><rect width="640" height="320" fill="#a5774f"/><g class="a6-paper"><rect x="60" y="24" width="520" height="272" rx="4" fill="#f6efdc" stroke="#c9b48e" stroke-width="2"/><path d="M64 296 C 200 300 220 126 330 150 C 440 174 424 44 576 34" stroke="#9fc6dc" stroke-width="16" fill="none" stroke-linecap="round"/><rect x="140" y="270" width="36" height="10" rx="2" fill="#8a6a3a" transform="rotate(-28 158 275)"/><g fill="#8b8b80"><circle cx="318" cy="160" r="4"/><circle cx="330" cy="155" r="4"/><circle cx="342" cy="150" r="4"/></g><g fill="#7a8a5a"><circle cx="110" cy="250" r="12"/><circle cx="540" cy="72" r="12"/></g><g font-family="Georgia,serif" font-size="15" fill="#3a3029"><text x="62" y="228">Willowbank</text><text x="452" y="66" text-anchor="end">Vadoalto</text></g>${ways}</g>${jar(78,40,.7)}${jar(562,40,.8)}${jar(78,282,.9)}${jar(562,282,1)}</svg><figcaption>${esc(caption)}</figcaption></figure>`;
}
