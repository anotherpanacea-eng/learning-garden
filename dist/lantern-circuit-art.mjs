import {circuitStatus} from './lantern-circuit-core.mjs';
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const circuitModelLabel=mask=>({open:'Open · no complete filament path',glow:'Glow · complete filament path',bypass:'Paused ‖ · wire-only bypass'})[circuitStatus(mask)];
// Original fixed cutaway. Only W2 crosses other wires, and each crossing is a nonjoining hop.
export function circuitDrawing(mask,highlight=false){
 const status=circuitStatus(mask),on=bit=>(mask&bit)!==0;
 const wire=(bit,d)=>`<path class="lc-wire" data-lc-wire="${bit}" d="${d}"/>`;
 const tags=[[1,166,76,170,91,'W1'],[2,281,235,285,250,'W2'],[4,196,178,200,193,'W3'],[8,115,282,119,297,'W4']];
 const w2=`M55 95 V65 H105 ${on(1)?'V89 Q113 95 105 101':''} ${on(4)?'V229 Q113 235 105 241':''} V260 ${on(8)?'H184 Q190 252 196 260':''} H330 V185 H290`;
 return `<svg class="lc-diagram ${highlight&&status==='glow'?'lc-highlight':''}" viewBox="0 0 354 310" role="img" aria-label="${esc(circuitModelLabel(mask))}. Installed external links: ${[1,2,4,8].filter(on).map(b=>'W'+({1:1,2:2,4:3,8:4})[b]).join(', ')||'none'}. Crossings are not junctions." data-lc-mask="${mask}" data-lc-model="${status}"><rect width="354" height="310" rx="12" fill="#fffdf7"/>
 ${on(1)?wire(1,'M55 95 H135 V105 H240 V145 H265'):''}${on(4)?wire(4,'M55 235 H155 V175 H250 V160 L265 145'):''}${on(8)?wire(8,'M55 235 V275 H190 V225 H290 V185'):''}
 ${on(2)?`${on(1)?'<path data-lc-gap="1" d="M95 95h20" stroke="#fffdf7" stroke-width="9"/>':''}${on(4)?'<path data-lc-gap="4" d="M95 235h20" stroke="#fffdf7" stroke-width="9"/>':''}${on(8)?'<path data-lc-gap="8" d="M190 250v20" stroke="#fffdf7" stroke-width="9"/>':''}${wire(2,w2)}`:''}
 <rect x="35" y="110" width="40" height="110" rx="6" fill="#dfc99d" stroke="#715b3e" stroke-width="2"/><path d="M55 95V110M55 220V235" class="lc-internal"/><text x="47" y="137" class="lc-nodeletter">+</text><text x="47" y="207" class="lc-nodeletter">−</text><text x="38" y="174" class="lc-small">cell</text>
 <circle cx="290" cy="85" r="35" data-lc-globe fill="${status==='glow'?'#ffe8a3':'#e9ede6'}" stroke="#715b3e" stroke-width="2"/><path d="M272 115v15h36v-15" fill="none" stroke="#715b3e" stroke-width="2"/>
 <rect x="265" y="130" width="50" height="28" fill="#a6b8a6" stroke="#526b58"/><rect x="265" y="158" width="50" height="8" fill="#fffdf7" stroke="#526b58"/><rect x="280" y="166" width="20" height="17" data-lc-tip fill="#a6b8a6" stroke="#526b58"/><rect x="284" y="130" width="12" height="36" data-lc-channel fill="#fffdf7"/>
 <path data-lc-filament d="M265 145H275V110l7-11 6 6 6-6 6 6 5 5-15 15V185" class="lc-internal lc-filament"/>
 ${status==='bypass'?'<g data-lc-pause><rect x="327" y="68" width="6" height="27" rx="1" fill="#715b3e"/><rect x="339" y="68" width="6" height="27" rx="1" fill="#715b3e"/></g>':''}
 ${[[55,95,25,92,'P'],[55,235,25,248,'N'],[265,145,241,133,'S'],[290,185,306,205,'T']].map(([x,y,tx,ty,label])=>`<circle cx="${x}" cy="${y}" r="4" class="lc-node"/><text x="${tx}" y="${ty}" class="lc-nodeletter">${label}</text>`).join('')}
 ${tags.filter(([bit])=>on(bit)).map(([,x,y,tx,ty,t])=>`<rect x="${x}" y="${y}" width="38" height="21" rx="3" fill="#fffdf7"/><text x="${tx}" y="${ty}" class="lc-tag">${t}</text>`).join('')}</svg>`;
}
