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
