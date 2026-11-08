// Spec 607 · the flood post in the long rain, an original illustration. Before the water arrives, rain falls for a few
// beats over the brook and the post with its old marks. When the water arrives, the brook rises up the post and stops
// below the top marks, then a new mark is scratched and the words *Warned in time* appear beside it. The picture shows
// this invented rain only; it measures nothing. Everything settles within a few seconds; reduced motion shows it finished.
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const marks=[230,200,170,140,110].map((y,i)=>`<path d="M300 ${y} h22" stroke="#4a4036" stroke-width="3"/><text x="330" y="${y+5}" font-family="Georgia,serif" font-size="13" fill="#4a4036">${i+1}</text>`).join('');
const rain=Array.from({length:18},(_,i)=>{const x=24+i*35,d=(i%6)*.18;return `<path class="a6r-drop" style="--d:${d.toFixed(2)}s" d="M${x} 0 l-8 22" stroke="#7fa6c4" stroke-width="2.5" stroke-linecap="round"/>`;}).join('');
export function floodPostScene(label,caption,{arrived=false}={}){
 const water=arrived?`<rect class="a6r-rise" x="0" y="176" width="640" height="144" fill="#7fb0cf" opacity=".85"/><path class="a6r-mark" pathLength="1" d="M296 176 h30" stroke="#8a3b2e" stroke-width="4"/><text class="a6r-words" x="336" y="168" font-family="Georgia,serif" font-style="italic" font-size="18" fill="#8a3b2e">Warned in time</text>`:`<rect x="0" y="246" width="640" height="74" fill="#7fb0cf" opacity=".85"/>`;
 return `<figure class="a6r-post" data-a6r-post data-arrived="${arrived}"><svg viewBox="0 0 640 320" role="img" aria-label="${esc(label)}"><rect width="640" height="320" fill="#c9d6dc"/><path d="M0 250 Q160 236 320 248 T640 246 V320 H0Z" fill="#8a9a6a"/><rect x="286" y="70" width="16" height="230" fill="#8a6a4a"/>${marks}${arrived?'':`<g class="a6r-rain">${rain}</g>`}${water}</svg><figcaption>${esc(caption)}</figcaption></figure>`;
}
