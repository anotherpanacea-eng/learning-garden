// Spec 603 · the Willowbank Gazette's front page, an original illustration. Story art: two headlines side by side, as the
// librarian printed them, with neither marked right. The page settles in and the headlines appear; reduced motion shows it set.
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const lines=(x,y,n,w)=>Array.from({length:n},(_,i)=>`<path d="M${x} ${y+i*9} h${w-((i*37)%40)}" stroke="#9a9384" stroke-width="2.4" stroke-linecap="round"/>`).join('');
// Breaks a headline into short lines that fit a column.
const wrap=(text,max)=>text.split(' ').reduce((rows,word)=>{const last=rows[rows.length-1];if(last&&(last+' '+word).length<=max)rows[rows.length-1]=last+' '+word;else rows.push(word);return rows;},[]);
const headline=(text,x,delay)=>`<g class="a4g-head" style="--d:${delay}s">${wrap(text,16).map((row,i)=>`<text x="${x}" y="${108+i*22}" font-family="Georgia, serif" font-size="19" font-weight="700" fill="#2b2a28">${esc(row)}</text>`).join('')}</g>`;
export function gazetteScene(C){
 return `<figure class="a4-gazette" data-a4-gazette><svg viewBox="0 0 640 300" role="img" aria-label="${esc(C.scene)}"><rect width="640" height="300" fill="#e7e1d3"/><g class="a4g-paper"><rect x="70" y="18" width="500" height="268" fill="#fbf8ef" stroke="#cfc6b2" stroke-width="2"/><text x="320" y="56" text-anchor="middle" font-family="Georgia, serif" font-size="30" font-style="italic" fill="#2b2a28">${esc(C.masthead)}</text><path d="M90 68 h460 M90 72 h460" stroke="#2b2a28" stroke-width="1.5"/><path d="M320 84 v186" stroke="#cfc6b2" stroke-width="2"/>${headline(C.headlines[0],92,.5)}${headline(C.headlines[1],338,1.1)}<g class="a4g-copy">${lines(92,178,9,200)}${lines(338,178,9,200)}</g></g></svg><figcaption>${esc(C.caption)}</figcaption></figure>`;
}
