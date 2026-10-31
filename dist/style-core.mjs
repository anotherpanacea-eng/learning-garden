// Spec 322 §3: the one writer and the one reader of garden.style.
export const STYLES=Object.freeze(['storybook','field-journal']);
const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
export function styleOf(state){
 const g=state?.garden;
 return plain(g)&&g.style==='field-journal'?'field-journal':'storybook';
}
// Returns true on a change, false when nothing was written. An unreadable garden is declined, never replaced.
export function chooseStyle(state,style){
 if(!state||!STYLES.includes(style))return false;
 if(state.garden!==undefined&&!plain(state.garden))return false;
 if(state.garden?.style===style)return false;
 if(state.garden===undefined)state.garden={};
 state.garden.style=style;
 return true;
}
// Why a choice did nothing: 'same' when the look is already stored, 'unreadable' otherwise.
export function styleRefusal(state,style){
 return plain(state?.garden)&&state.garden.style===style?'same':'unreadable';
}
