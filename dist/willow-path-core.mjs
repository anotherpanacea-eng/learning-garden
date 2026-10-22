// A walk carries all of its own words and events. Reading never repairs saved data.
export const WILLOW_SOURCE={version:1,id:'willow-ten',squares:10,spinner:[1,2],text:{
 title:'The path to Willow Bridge',invitation:'The stones lead from the garden gate to Willow Bridge. Leaf and Lantern can walk together.',tokenLeaf:'Leaf',tokenLantern:'Lantern',modeTwo:'Two walkers, two tokens',modeSolo:'One walker, two tokens',modeTip:'Choose a way to play. With two walkers, share the tokens. One walker can move both.',startButton:'Start a walk',gateLabel:'Garden gate',bridgeLabel:'Willow Bridge',adultTip:'Say the number on each stone as the token lands. You can say it together.',spinButton:'Spin for {token}',spinResult:'{token} spun {value}.',oneWord:'one',twoWord:'two',stepButton:'Step to {square}',turnLine:"{token}'s turn.",atGate:'{token} is at the garden gate.',atStone:'{token} is on stone {square}.',leafArrives:'Leaf is at Willow Bridge. Lantern keeps walking.',lanternArrives:'Lantern is at Willow Bridge. Leaf keeps walking.',ending:'Both walkers are at Willow Bridge. The path is ready whenever you want another walk.',helpTitle:'Why is the path straight?',helpBody:'Each stone is the same size. The numbers grow by one as you move right. Seven is farther along than three. If a token is on three and moves twice, name four, then five. Take a turn together or just watch the stones.',eventButton:"What's here on stone {square}?",eventHearButton:'Hear stone {square}',stepVoiceOff:'Hear each step (off)',stepVoiceOn:'Hear each step (on)',newButton:'Start a new walk',replaceWarning:'A walk is here already. Starting again replaces its position. Download your notes first if you want to keep this walk.',keepButton:'Keep this walk',replaceButton:'Start again'
},events:[{square:3,title:'A robin',body:'A robin rests on the fence post beside the path.'},{square:6,title:'Pip at the window',body:'Pip waves from the café window as the walkers pass.'},{square:8,title:'Warm bread',body:'The café smells of warm bread near the bridge.'}]};

const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&Object.getPrototypeOf(x)===Object.prototype;
const bytes=x=>new TextEncoder().encode(x).length;
const required=Object.keys(WILLOW_SOURCE.text);
const placeholders={spinButton:['token'],turnLine:['token'],atGate:['token'],spinResult:['token','value'],atStone:['token','square'],stepButton:['square'],eventButton:['square'],eventHearButton:['square']};
export function validWillowSource(source){
 if(!object(source)||source.version!==1||!(/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/).test(source.id)||source.squares!==10||!Array.isArray(source.spinner)||source.spinner.length!==2||source.spinner[0]!==1||source.spinner[1]!==2||!object(source.text)||!Array.isArray(source.events)||source.events.length>10)return false;
 for(const key of required){const value=source.text[key];if(typeof value!=='string'||!value.trim()||bytes(value)>512||placeholders[key]?.some(name=>!value.includes(`{${name}}`)))return false;}
 const seen=new Set();for(const event of source.events){if(!object(event)||!Number.isInteger(event.square)||event.square<1||event.square>source.squares||seen.has(event.square)||typeof event.title!=='string'||!event.title.trim()||bytes(event.title)>120||typeof event.body!=='string'||!event.body.trim()||bytes(event.body)>512)return false;seen.add(event.square);}
 try{return bytes(JSON.stringify(source))<=16384;}catch{return false;}
}
export function validWillowWalk(walk){
 if(!object(walk)||!validWillowSource(walk.source)||!['two','solo'].includes(walk.mode)||!object(walk.positions)||!['leaf','lantern'].includes(walk.turn)||typeof walk.done!=='boolean')return false;
 const {leaf,lantern}=walk.positions,n=walk.source.squares;if(![leaf,lantern].every(x=>Number.isInteger(x)&&x>=0&&x<=n)||walk.done!==(leaf===n&&lantern===n))return false;
 if(walk.spin!==null){if(!object(walk.spin)||!walk.source.spinner.includes(walk.spin.value)||!Number.isInteger(walk.spin.stepsLeft)||walk.spin.stepsLeft<1||walk.spin.stepsLeft>walk.spin.value||walk.done||walk.positions[walk.turn]===n)return false;}
 if(!walk.done&&walk.positions[walk.turn]===n)return false;
 return true;
}
export function willowStatus(state){
 if(!Object.hasOwn(state,'willowPath'))return 'empty';const root=state.willowPath;
 if(!object(root)||root.version!==1||!Object.hasOwn(root,'walk'))return 'recovery';
 return root.walk===null?'empty':validWillowWalk(root.walk)?'current':'recovery';
}
export function willowWalk(state){return willowStatus(state)==='current'?state.willowPath.walk:null;}
export function startWillowWalk(state,mode='two'){
 if(!['two','solo'].includes(mode)||!validWillowSource(WILLOW_SOURCE))return false;
 const prior=state.willowPath,status=willowStatus(state);
 const walk={source:structuredClone(WILLOW_SOURCE),mode,positions:{leaf:0,lantern:0},turn:'leaf',spin:null,done:false};
 state.willowPath=status==='recovery'?{version:1,walk,retainedRaw:prior}:status==='current'||Object.hasOwn(state,'willowPath')?{...prior,version:1,walk}:{version:1,walk};return true;
}
export function spinWillow(state,random=Math.random){const walk=willowWalk(state);if(!walk||walk.done||walk.spin)return false;const value=random()<0.5?1:2;walk.spin={value,stepsLeft:value};return value;}
export function stepWillow(state){const walk=willowWalk(state);if(!walk?.spin)return null;const token=walk.turn,n=walk.source.squares;walk.positions[token]++;walk.spin.stepsLeft--;const square=walk.positions[token],arrived=square===n;
 if(arrived||walk.spin.stepsLeft===0){walk.spin=null;if(walk.positions.leaf===n&&walk.positions.lantern===n)walk.done=true;else walk.turn=token==='leaf'?'lantern':'leaf';if(walk.positions[walk.turn]===n)walk.turn=token;}
 return {token,square,arrived,done:walk.done,turn:walk.turn,passed:!walk.spin};
}
export function willowText(template,values={}){return String(template).replace(/\{(token|value|square)\}/g,(whole,key)=>Object.hasOwn(values,key)?String(values[key]):whole);}
export function willowNotes(state){if(!Object.hasOwn(state,'willowPath'))return '<details class="panel"><summary>Willow Path</summary><p>No Willow Path walk has started.</p></details>';const status=willowStatus(state),root=state.willowPath;
 if(status==='recovery')return '<details class="panel"><summary>Willow Path</summary><p>An earlier Willow Path record is kept in this download.</p></details>';
 const walk=willowWalk(state),retained=Object.hasOwn(root,'retainedRaw')?'<p>An earlier Willow Path record is kept in this download.</p>':'';
 if(!walk)return `<details class="panel"><summary>Willow Path</summary><p>No Willow Path walk has started.</p>${retained}</details>`;
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const place=n=>n===0?'at the gate':n===walk.source.squares?'at the bridge':`on stone ${n}`;
 const leaf=esc(walk.source.text.tokenLeaf),lantern=esc(walk.source.text.tokenLantern);
 const line=walk.done?`The Willow Path walk is complete. ${leaf} at the bridge; ${lantern} at the bridge.`:`A Willow Path walk is waiting. ${leaf} ${place(walk.positions.leaf)}; ${lantern} ${place(walk.positions.lantern)}.`;
 return `<details class="panel"><summary>Willow Path</summary><p>${line}</p>${retained}</details>`;
}
