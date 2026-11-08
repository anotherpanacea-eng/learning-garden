// Spec 609 · the Ways open, an original illustration. Three ribbon posts stand along the Ways; Bramble's ribbons tie on
// one by one (blue for the river path, gold for the bridge road, red for the high ford) and lift once in the wind. A small
// mark wears the season the act ended in. Everything settles within a few seconds; reduced motion shows the ribbons tied.
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const post=(x,color,d)=>`<g transform="translate(${x} 0)"><rect x="-5" y="120" width="10" height="120" fill="#8a6a4a"/><g transform="translate(5 136) scale(1.9)"><g class="a6e-ribbon" style="--d:${d}s"><path d="M0 0 c 12 -8 20 4 34 -2 c -10 10 -22 6 -34 10z" fill="${color}"/><path d="M0 4 c 10 8 16 22 26 28 c -12 -2 -22 -14 -26 -22z" fill="${color}" opacity=".85"/><circle cx="0" cy="3" r="4" fill="${color}"/></g></g></g>`;
const motif={
 spring:'<g data-a6e-season-art="spring"><path d="M0 30 C 40 40 80 46 120 64 M640 30 C 600 40 560 46 520 64" stroke="#7a5a3a" stroke-width="4" fill="none"/>'+[[30,38],[62,46],[96,56],[118,64],[610,38],[578,46],[544,56],[522,64]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6" fill="#f2b8c6"/>`).join('')+'</g>',
 summer:'<g data-a6e-season-art="summer"><circle cx="580" cy="48" r="20" fill="#f3d27a"/></g>',
 autumn:'<g data-a6e-season-art="autumn"><circle cx="560" cy="222" r="9" fill="#c0453a"/><circle cx="578" cy="226" r="9" fill="#d9773a"/><path d="M556 214 q4 -6 8 -4" stroke="#5f7d3f" stroke-width="2" fill="none"/></g>',
 winter:'<g data-a6e-season-art="winter">'+[[140,60],[260,40],[400,70],[520,50],[600,90]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3" fill="#ffffff"/>`).join('')+'<path d="M0 238 h640" stroke="#ffffff" stroke-width="6"/></g>'
};
export function waysOpenScene(label,caption,season=null){
 return `<figure class="a6e-ways" data-a6e-ways data-a6e-season="${season||'none'}"><svg viewBox="0 0 640 300" role="img" aria-label="${esc(label)}"><rect width="640" height="300" fill="#e6efe9"/><path d="M0 250 Q160 236 320 248 T640 246 V300 H0Z" fill="#8fb4cc"/><path d="M0 240 H640" stroke="#a6c08a" stroke-width="10"/>${post(170,'#3d7fb5',.3)}${post(320,'#c9962e',.9)}${post(470,'#c0453a',1.5)}${season&&motif[season]?motif[season]:''}</svg><figcaption>${esc(caption)}</figcaption></figure>`;
}
