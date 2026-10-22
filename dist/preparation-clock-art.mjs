const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Original version-one face. Angles run clockwise from twelve; no motion is implied.
export function preparationClockDiagram(slot,{pictureText='',label='Clock face'}={}){
 if(!Number.isInteger(slot)||slot<0||slot>23)return `<p class="clock-picture-fallback">${esc(pictureText||'This clock picture is unavailable.')}</p>`;
 const hour=slot*15,minute=(slot%2)*180;
 const numerals=Array.from({length:12},(_,i)=>{const n=i+1,a=n*Math.PI/6;return `<text x="${160+Math.sin(a)*112}" y="${160-Math.cos(a)*112+8}" text-anchor="middle">${n}</text>`;}).join('');
 const ticks=Array.from({length:12},(_,i)=>`<path d="M160 24V32" transform="rotate(${i*30} 160 160)"/>`).join('');
 return `<svg class="clock-diagram" viewBox="0 0 320 320" role="img" aria-label="${esc(label)}. ${esc(pictureText)}" data-clock-slot="${slot}" focusable="false"><circle class="clock-rim" cx="160" cy="160" r="149"/><circle class="clock-face" cx="160" cy="160" r="140"/><g class="clock-ticks">${ticks}</g><g class="clock-numerals">${numerals}</g><line class="clock-hour" x1="160" y1="169" x2="160" y2="93" transform="rotate(${hour} 160 160)" data-clock-hand="hour" data-angle="${hour}"/><line class="clock-minute" x1="160" y1="174" x2="160" y2="70" transform="rotate(${minute} 160 160)" data-clock-hand="minute" data-angle="${minute}"/><circle class="clock-pin" cx="160" cy="160" r="7"/></svg>`;
}
