// Original, qualitative point-source picture. Drawing units are never child readouts.
export const positions=[{id:'lamp',label:'Near the lamp',d:80,caption:'Card near the lamp. The same card makes the largest shadow in this model.'},{id:'middle',label:'In the middle',d:120,caption:'Card in the middle. The shadow is between the two end sizes.'},{id:'screen',label:'Near the screen',d:160,caption:'Card near the screen. The same card makes the smallest shadow in this model.'}];
export const opening='Move one card. What changes on the screen?';
export const purpose='Give the same stage card a bigger shadow for its entrance and a smaller shadow for its exit.';
export const disclosure='A simplified light picture: one tiny point source, one opaque card and a flat screen. The lamp and screen stay fixed. Real lamps and rooms can make softer, lighter-edged shadows.';
export const explanation='Opaque means light does not pass through this card. Light from our point source travels along straight paths. The card blocks some paths to the screen. The dark rectangle is a place on the screen receiving no direct light from that source; it is not a dark object traveling from the card. Real rooms can add reflected light, and real lamps have size. This picture leaves those effects out.';
export const pathExplanation='These lines are selected paths from the lamp, not every light path. Arrows show the direction of light.';
export const initialShadow=()=>({position:'middle',present:true,paths:false,previous:null});
export const shadowPosition=s=>positions.find(p=>p.id===s.position);
export const shadowCaption=s=>s.present?shadowPosition(s).caption:'Card removed. Light reaches this part of the screen. No shadow from this card.';
export const shadowHeading=s=>s.present?shadowPosition(s).label:'Card removed';
export const waiting=s=>`Card waits at: ${shadowPosition(s).label}`;
export const pathNote=s=>s.present?'The middle path stops at the opaque card. The outer paths mark the shadow’s top and bottom edges.':'With the card out, these paths reach the screen.';
export function changeShadow(s,action){
 if(action==='undo')return s.previous?{...s.previous,previous:null}:null;
 const next={...s};
 if(action==='lamp'||action==='screen'){const i=positions.findIndex(p=>p.id===s.position),j=i+(action==='lamp'?-1:1);if(!s.present||j<0||j>=positions.length)return null;next.position=positions[j].id;}
 else if(action==='presence')next.present=!s.present;
 else if(action==='paths')next.paths=!s.paths;
 else return null;
 next.previous={position:s.position,present:s.present,paths:s.paths};return next;
}
export function shadowAnnouncement(s,action){if(action==='undo')return `Last change undone. ${shadowCaption(s)}`;if(action==='paths')return `Selected light paths ${s.paths?'shown':'hidden'}.`;if(action==='presence'&&!s.present)return 'Card removed. Its position is kept for returning.';return `${action==='presence'?'Card returned':'Card position'}: ${shadowPosition(s).label}. Shadow picture updated.`;}
export function shadowNarration(s){return `${opening} ${purpose} ${disclosure} Two views of one lamp, one card and one screen. ${shadowHeading(s)}. ${shadowCaption(s)}${s.present?'':` ${waiting(s)}`} ${s.paths?`${pathExplanation} ${pathNote(s)}`:''}`.trim();}
export function shadowGeometry(s){const d=shadowPosition(s).d;return {d,width:40*240/d,height:60*240/d};}
