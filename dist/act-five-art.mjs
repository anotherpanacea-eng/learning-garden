// Spec 604 · the blank pages, an original illustration. The stack lifts apart one page at a time, "the way a stack of
// pancakes does when you lift the top one", then the heading writes itself across the first page. Everything settles
// within a few seconds; reduced motion shows the finished picture.
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Each loose page rests at its own place and tilt; CSS lifts it there from the stack. The outer group places the page and
// the inner group is what CSS moves, so the two transforms never clash.
const LEAVES=[[66,178,-9,.15],[140,156,6,.45],[500,162,-5,.75],[574,182,8,1.05]];
const leaf=([x,y,rot,d])=>`<g transform="translate(${x} ${y}) rotate(${rot})"><g class="a5-leaf" style="--d:${d}s;--fx:${320-x}px;--fy:${150-y}px"><rect x="-46" y="-58" width="92" height="116" rx="3" fill="#fffdf6" stroke="#c9b48e" stroke-width="2"/><path d="M-34 -36 h68 M-34 -20 h68 M-34 -4 h68 M-34 12 h68 M-34 28 h68" stroke="#ece2cc" stroke-width="1.5"/></g></g>`;
export function blankPagesScene(label,caption,heading){
 return `<figure class="a5-pages" data-a5-pages><svg viewBox="0 0 640 300" role="img" aria-label="${esc(label)}"><rect width="640" height="300" fill="#f3ead8"/><rect y="236" width="640" height="64" fill="#cdb48f"/><path d="M0 236 H640" stroke="#a88a62" stroke-width="3"/>${LEAVES.map(leaf).join('')}<g class="a5-first" transform="translate(320 150)"><rect x="-136" y="-96" width="272" height="176" rx="4" fill="#fffdf6" stroke="#b9a27e" stroke-width="2.5"/><path d="M-114 -24 h228 M-114 0 h228 M-114 24 h228 M-114 48 h228" stroke="#ece2cc" stroke-width="1.5"/><clipPath id="a5-ink-clip"><rect class="a5-ink-wipe" x="-130" y="-80" width="260" height="44"/></clipPath><text class="a5-heading" x="0" y="-50" text-anchor="middle" clip-path="url(#a5-ink-clip)">${esc(heading)}</text><path class="a5-rule" pathLength="1" d="M-104 -38 h208" stroke="#4a4036" stroke-width="1.6" fill="none"/></g></svg><figcaption>${esc(caption)}</figcaption></figure>`;
}

// Spec 605 · the ending: an open book. A new page slides in behind *For the next Keeper* and a line of stitches runs down
// the spine to hold it. A small mark in the corner wears the season the act ended in (a geranium, a long evening, a
// pressed leaf, a café fire). Everything settles within a few seconds; reduced motion shows the bound page.
const motif={
 spring:'<g data-a5-season-art="spring"><path d="M560 250 v-26" stroke="#5f7d3f" stroke-width="3"/><circle cx="552" cy="220" r="7" fill="#d9534f"/><circle cx="566" cy="216" r="7" fill="#e06a5f"/><circle cx="560" cy="206" r="7" fill="#d9534f"/><rect x="544" y="248" width="32" height="18" rx="3" fill="#b5653a"/></g>',
 summer:'<g data-a5-season-art="summer"><circle cx="570" cy="44" r="18" fill="#f3c96b"/><path d="M520 70 q50 -14 100 0" stroke="#e8a85a" stroke-width="3" fill="none"/></g>',
 autumn:'<g data-a5-season-art="autumn"><path d="M470 196 q14 -22 30 0 q-14 22 -30 0z" fill="#c9773a" transform="rotate(-20 485 196)"/><path d="M472 198 l26 -4" stroke="#8a4f22" stroke-width="1.5"/></g>',
 winter:'<g data-a5-season-art="winter"><path d="M548 262 q12 -30 24 0z" fill="#e8783a"/><path d="M554 262 q6 -18 12 0z" fill="#f6c453"/><rect x="536" y="260" width="48" height="8" rx="3" fill="#6b4a32"/></g>'
};
export function bindingScene(label,caption,heading,season=null){
 const stitches=Array.from({length:9},(_,i)=>`<path class="a5-stitch" style="--d:${(1.4+i*.12).toFixed(2)}s" d="M320 ${54+i*22} v12" stroke="#8a3b2e" stroke-width="3" stroke-linecap="round"/>`).join('');
 return `<figure class="a5-binding" data-a5-binding data-a5-season="${season||'none'}"><svg viewBox="0 0 640 300" role="img" aria-label="${esc(label)}"><rect width="640" height="300" fill="#efe6d4"/><path d="M80 40 Q200 28 320 44 Q440 28 560 40 V270 Q440 258 320 274 Q200 258 80 270Z" fill="#8a6a4a"/><path d="M92 48 Q206 38 318 52 V264 Q206 252 92 262Z" fill="#fffdf6" stroke="#c9b48e" stroke-width="2"/><text x="205" y="96" text-anchor="middle" class="a5-binding-head">${esc(heading)}</text><path d="M140 108 h130" stroke="#4a4036" stroke-width="1.4"/><g class="a5-newpage"><path d="M322 52 Q434 38 548 48 V262 Q434 252 322 264Z" fill="#fffdf6" stroke="#b9a27e" stroke-width="2"/><path d="M352 92 q30 -10 60 0 t60 0 M352 120 h150 M352 146 h120 M352 172 h140" stroke="#9a8a70" stroke-width="2" fill="none"/><path d="M352 222 h150" stroke="#4a4036" stroke-width="2" stroke-dasharray="4 4"/></g>${stitches}${season&&motif[season]?motif[season]:''}</svg><figcaption>${esc(caption)}</figcaption></figure>`;
}
