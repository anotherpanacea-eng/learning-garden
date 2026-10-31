// Original flat SVG scenes for the Number Garden puzzle cards; decorative, no counts that answer or contradict a prompt.
const ink='#183f39';
const g=body=>`<svg class="puzzle-scene" viewBox="0 0 160 80" aria-hidden="true" focusable="false"><g stroke="${ink}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`;
const beetle=(x,y)=>`<ellipse cx="${x}" cy="${y}" rx="11" ry="8" fill="#b93e2c"/><path d="M${x} ${y-8}v16" fill="none"/><circle cx="${x+12}" cy="${y-2}" r="4" fill="${ink}"/><path d="M${x+14} ${y-6}l4-5m-6 4l1-6" fill="none"/>`;
const scenes={
 // Three beetles at a blanket with a covered basket of berries, so no berries can be counted.
 picnic:g(`<path d="M18 62l62-10 64 10-62 12Z" fill="#fbf3dd"/><path d="M49 57l64 9m-31-14l-2 22" fill="none" stroke-width="1.3"/>${beetle(36,46)}${beetle(78,38)}${beetle(120,46)}<path d="M66 60h28l-4 12H70Z" fill="#b69068"/><path d="M68 60q12-12 24 0" fill="none"/><path d="M65 61q15-9 30 0l-3 4q-12-5-24 0Z" fill="#da8d8d"/>`),
 // A frog on the bank and unnumbered stones that fade into the distance; its first jump lands three stones on.
 paths:g(`<path d="M0 60h160" fill="none" stroke="#abc4da" stroke-width="10"/><ellipse cx="22" cy="48" rx="12" ry="8" fill="#75a183"/><circle cx="18" cy="40" r="4" fill="#75a183"/><circle cx="27" cy="40" r="4" fill="#75a183"/><circle cx="18" cy="40" r="1.5" fill="${ink}"/><circle cx="27" cy="40" r="1.5" fill="${ink}"/>${[48,63,78,93,108,123,138,153].map((x,i)=>`<ellipse cx="${x}" cy="62" rx="6" ry="4" fill="#cbdcd3" opacity="${(1-i*.1).toFixed(1)}"/>`).join('')}<path d="M30 42q24-36 48 14" fill="none" stroke-dasharray="3 4" stroke-width="1.5"/>`),
 // One scarecrow wearing one hat and one scarf.
 outfits:g(`<path d="M80 30v46M56 44h48" fill="none" stroke="#b69068" stroke-width="4"/><circle cx="80" cy="28" r="11" fill="#fbf3dd"/><path d="M64 20h32M70 20l4-14h12l4 14" fill="#e9b84a"/><path d="M70 40h20l-2 6h-16Zm14 6l4 16 6-3-4-13" fill="#b93e2c"/><path d="M68 44l-2 22h28l-2-22" fill="#abc4da" fill-opacity=".6"/>`),
 // A basket of carrots beside an empty bed waiting to be planted.
 mystery:g(`<path d="M70 34h82v38H70Z" fill="#b69068" fill-opacity=".45"/><path d="M8 50h44l-6 22H14Z" fill="#b69068"/>${[16,26,36,46].map((x,i)=>`<path d="M${x} 50l4-18 4 18" fill="#e08a3c"/><path d="M${x+4} 32l-3-7m3 7l3-7" fill="none" stroke="#397958"/>`).join('')}`),
 // A rectangular flower bed with a fence all the way round.
 fence:g(`<path d="M30 16h100v52H30Z" fill="#d7e8cf"/>${[0,1,2,3,4,5,6].map(i=>`<path d="M${30+i*16.6} 12v8" fill="none"/>`).join('')}${[0,1,2,3,4,5,6].map(i=>`<path d="M${30+i*16.6} 64v8" fill="none"/>`).join('')}<path d="M26 16v52m108-52v52" fill="none"/><circle cx="58" cy="36" r="5" fill="#e9b84a"/><circle cx="80" cy="46" r="5" fill="#da8d8d"/><circle cx="104" cy="34" r="5" fill="#e9b84a"/>`),
 // A garden split into a large yellow patch and a smaller pink patch; sprigs echo the prompt's 5 yellow and 2 pink rows.
 patchwork:g(`<path d="M20 12h120v42H20Z" fill="#f4dc8e"/><path d="M20 54h120v16H20Z" fill="#f2c4c4"/><path d="M30 26q8-8 16 0M72 24q8-8 16 0M114 28q8-8 16 0M48 44q8-8 16 0M94 42q8-8 16 0" fill="none" stroke="#397958" stroke-width="1.5"/><path d="M48 62q6-5 12 0M100 62q6-5 12 0" fill="none" stroke="#397958" stroke-width="1.5"/>`)
};
export const puzzleArtIds=Object.freeze(Object.keys(scenes));
export function puzzleArt(id){return scenes[id]||'';}
