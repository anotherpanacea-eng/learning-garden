// Original flat SVG illustrations for Number Garden; no external assets.
const ink='#183f39';
const poses={wave:'waving',think:'thinking',point:'pointing',cheer:'cheering',puzzled:'wondering'};
function friend(kind,pose,decorative){
 pose=poses[pose]?pose:'wave';
 const arm=pose==='cheer'?'M34 67L19 44m57 23l15-23':pose==='wave'?'M34 67L20 45m56 22l11 12':pose==='point'?'M34 67L20 76m56-9l23-8':pose==='think'?'M34 67L46 50m30 17l11 12':'M34 67L20 77m56-10l13 10';
 const eyes=pose==='puzzled'?'<path d="M44 39l8 2m9-1l7-3" fill="none"/>':'';
 const body=kind==='pip'?`<path d="M32 77Q1 83 15 53L32 65" fill="#ce8857"/><path d="M15 53Q8 63 12 69l9-8" fill="#fff3db"/><path d="M29 55L29 15L48 28Q58 23 67 28L85 15L84 55L58 69Z" fill="#ce8857"/><path d="M31 48L58 65L81 48L65 47L58 53L49 47Z" fill="#fff3db"/><path d="M39 69Q58 58 77 69L80 101H35Z" fill="#ce8857"/><path d="M39 69l37 20" fill="none"/><rect x="62" y="81" width="22" height="19" rx="3" fill="#b69068"/><path d="M64 86h18"/><circle cx="46" cy="43" r="2"/><circle cx="68" cy="43" r="2"/><path d="M54 52h8l-4 5Z"/>`:`<path d="M39 31l-7-12m41 12l8-12" fill="none"/><circle cx="32" cy="18" r="3"/><circle cx="81" cy="18" r="3"/><ellipse cx="57" cy="76" rx="29" ry="28" fill="#da8d8d"/><path d="M57 51v51"/><g fill="${ink}"><circle cx="43" cy="72" r="5"/><circle cx="71" cy="72" r="5"/><circle cx="42" cy="88" r="4"/><circle cx="72" cy="88" r="4"/></g><circle cx="57" cy="42" r="22" fill="#fff3db"/><g fill="none"><circle cx="47" cy="42" r="9"/><circle cx="67" cy="42" r="9"/><path d="M56 42h2"/></g><circle cx="47" cy="42" r="2"/><circle cx="67" cy="42" r="2"/><path d="M51 55q6 5 12-1" fill="none"/>`;
 return `<svg class="garden-friend garden-${kind}" viewBox="0 0 116 112" ${decorative?'aria-hidden="true"':`role="img" aria-label="${kind==='pip'?'Pip the fox':'Dot the ladybug'}, ${poses[pose]}"`}><g stroke="${ink}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">${body}<path d="${arm}" fill="none"/>${eyes}</g></svg>`;
}
export const pip=(pose='wave',decorative=true)=>friend('pip',pose,decorative);
export const dot=(pose='think',decorative=true)=>friend('dot',pose,decorative);
const objects={
 seed:'<ellipse cx="12" cy="12" rx="6" ry="9" fill="#e9b84a" transform="rotate(30 12 12)"/>',
 berry:'<circle cx="12" cy="14" r="8" fill="#da8d8d"/><path d="M12 7L6 4l6 1 5-3-2 6" fill="#75a183"/>',
 cup:'<path d="M4 5h12v14H5Z" fill="#abc4da"/><path d="M16 7h3q6 5-3 8" fill="none"/>',
 cracker:'<rect x="3" y="3" width="18" height="18" rx="3" fill="#e9b84a"/><path d="M8 8h1m6 0h1m-8 8h1m6 0h1"/>',
 muffin:'<path d="M5 12h15l-3 10H8Z" fill="#e9b84a"/><path d="M4 12Q0 5 7 5Q11-2 16 4Q24 3 21 12Z" fill="#b69068"/>',
 button:'<circle cx="12" cy="12" r="10" fill="#bdb3d6"/><path d="M8 8h1m6 0h1m-8 8h1m6 0h1"/>',
 pebble:'<path d="M2 16Q1 6 10 4Q20 1 22 15Q18 23 7 21Z" fill="#abc4da"/>',
 tile:'<path d="M3 3h18v18H3Z" fill="#abc4da"/><path d="M5 5h14v14H5Z" fill="none"/>',
 flower:'<path d="M12 13v10m0-5q7-6 9-2" fill="none" stroke="#397958"/><path d="M12 4C4-3 0 8 7 10C-1 17 10 22 12 14C16 23 26 15 18 10C27 5 16-3 12 4Z" fill="currentColor"/><circle cx="12" cy="9" r="3" fill="#b69068"/>'
};
export const objectItems=Object.keys(objects);
export function objectSymbols(){return `<svg class="garden-symbols" aria-hidden="true" width="0" height="0"><defs>${Object.entries(objects).map(([name,paths])=>`<symbol id="garden-object-${name}" viewBox="0 0 24 24"><g stroke="${ink}" stroke-width="1.3" stroke-linejoin="round">${paths}</g></symbol>`).join('')}</defs></svg>`;}
export function itemGlyph(item='seed'){item=Object.hasOwn(objects,item)?item:'seed';return `<svg class="garden-object" viewBox="0 0 24 24" aria-hidden="true"><use href="#garden-object-${item}"/></svg>`;}
export function areaScene(id){
 const scenes={
 number:'<path d="M15 23h90v49H15Z" fill="#b69068"/><path d="M17 47h86"/><g stroke="#fff3db" stroke-width="4"><path d="M25 30v13m6-13v13m6-13v13m20-13v13m6-13v13m6-13v13"/><path d="M25 55v12m6-12v12m6-12v12m20-12v12m6-12v12m6-12v12"/></g><path d="M22 36h18m14 0h18m-50 25h18m14 0h18" stroke="#397958"/>',
 operations:'<path d="M8 29h104v46H8Z" fill="#f1d9d4"/><g fill="#fff3db">'+[0,1].flatMap(r=>[0,1,2,3].map(c=>`<path d="M${18+c*25} ${38+r*23}h13l-2 15h-9Z"/>`)).join('')+'</g>',
 fractions:'<ellipse cx="60" cy="51" rx="45" ry="27" fill="#90b48f"/><path d="M60 24v54m-45-27h90"/><path d="M60 51V24Q105 24 105 51Z" fill="#e9b84a"/>',
 patterns:[2,5,8,11].map((v,i)=>`<ellipse cx="${17+i*29}" cy="${64-i*9}" rx="13" ry="10" fill="#abc4da"/><text x="${17+i*29}" y="${68-i*9}" font-size="12" text-anchor="middle" stroke="none" fill="${ink}">${v}</text>`).join(''),
 geometry:'<path d="M8 32L60 8l52 24Z" fill="#e9b84a"/><path d="M15 32v47m90-47v47M14 47h92"/><path d="M25 50l14 20H19Z" fill="#da8d8d"/><path d="M49 50h19v19H49Z" fill="#abc4da"/><path d="M81 50h20v13H81Z" fill="#bdb3d6"/>',
 measurement:'<rect x="9" y="61" width="104" height="16" fill="#e9b84a"/>'+[0,1,2,3,4,5,6,7,8,9,10].map(i=>`<path d="M${11+i*10} 62v${i%5?6:11}"/>`).join('')+'<ellipse cx="35" cy="32" rx="22" ry="18" fill="#da8d8d"/><ellipse cx="35" cy="32" rx="8" ry="9" fill="#fff3db"/><path d="M52 38Q86 24 96 55" fill="none" stroke="#da8d8d" stroke-width="7"/>',
 reasoning:'<path d="M11 41Q56 20 96 37v37Q49 61 11 76Z" fill="#b69068"/><ellipse cx="15" cy="58" rx="11" ry="19" fill="#fff3db"/><path d="M89 58l23 21" stroke-width="7"/><circle cx="82" cy="47" r="19" fill="#eaf4ef"/><circle cx="82" cy="47" r="14" fill="#abc4da"/>'
 };
 return `<svg class="area-scene" viewBox="0 0 120 90" aria-hidden="true"><g stroke="${ink}" stroke-width="2" stroke-linejoin="round">${scenes[id]||scenes.number}</g></svg>`;
}
export function countingGarden({selected=[],group=''}={}){
 const chosen=new Set(selected.filter(n=>Number.isInteger(n)&&n>=0&&n<12));
 return `<div class="hero-art counting-garden ${group==='rows'?'garden-show-rows':''}"><div class="garden-flower-rows" role="group" aria-label="Three rows of four flowers">${[0,1,2].map(r=>`<div class="garden-flower-row">${[0,1,2,3].map(c=>{const n=r*4+c,color=['#e9b84a','#da8d8d','#abc4da'][n%3];return `<button type="button" class="garden-flower ${group==='colors'?'garden-color-group':''}" style="--flower-color:${color}" data-garden-flower="${n}" aria-label="Flower in row ${r+1}, column ${c+1}" aria-pressed="${chosen.has(n)}"><svg viewBox="0 0 24 24" aria-hidden="true"><g stroke="${ink}" stroke-width="1">${objects.flower}</g></svg>${chosen.has(n)?`<span>${[...chosen].indexOf(n)+1}</span>`:''}</button>`;}).join('')}</div>`).join('')}</div><p class="garden-count" aria-live="polite">${chosen.size?`You counted ${chosen.size} flower${chosen.size===1?'':'s'}.`:'What do you notice in the garden?'}</p><div class="garden-group-controls"><button class="model-button" data-garden-group="rows" aria-pressed="${group==='rows'}">Show rows</button><button class="model-button" data-garden-group="colors" aria-pressed="${group==='colors'}">Show colors</button><button class="model-button" data-garden-group="clear">Clear counting</button></div></div>`;
}
