import {ribbonMeasureCases,ribbonMeasureCase,ribbonMeasureCopy as copy} from './ribbon-measure-content.mjs';
import {createRibbonMeasure,ribbonMeasureModel,splitRibbonMeasure,undoRibbonSplit,layRibbonPiece,liftRibbonPiece,returnRibbonPieces,ribbonLayAdvice,ribbonPieceName,ribbonReading,ribbonCompletion,ribbonMeasureExample,ribbonLengthName,ribbonGroupName} from './ribbon-measure-core.mjs';
import {hearButton} from './play-media.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let visit=null;
export function resetRibbonMeasures(){visit=null;}
function current(notebook,owner){
 if(!visit||visit.notebook!==notebook||visit.owner!==owner)visit={notebook,owner,caseId:'unit-quarter',cases:new Map(),example:false,frame:0,pending:''};
 if(!visit.cases.has(visit.caseId))visit.cases.set(visit.caseId,{material:createRibbonMeasure(visit.caseId),read:false});
 return visit;
}
const button=(action,label,disabled=false,description='')=>`<button type="button" data-rmeasure-action="${action}"${disabled?' disabled':''}${description?` aria-describedby="${description}"`:""}>${esc(label)}</button>`;
function splitButton(factor,disabled){return `<button type="button" data-rmeasure-split="${factor}"${disabled?' disabled':''}>Split each piece in ${factor}</button>`;}
function drawing(m){
 const cuts=Array.from({length:m.q-1},(_,i)=>`<path data-rmeasure-cut d="M${20+(i+1)*m.group/m.q} 100V124" stroke="#16645b" stroke-width="2"/>`).join('');
 const laid=m.segments.map((p,i)=>`<rect data-rmeasure-laid data-q="${p.q}" x="${20+p.start}" y="160" width="${p.length}" height="24" fill="${i%2?'#c5e3d9':'url(#rmeasure-hatch)'}" stroke="#183430" stroke-width="1.5"/>`).join('');
 const sixths=m.showSixths?Array.from({length:5},(_,i)=>`<path data-rmeasure-sixth d="M${20+(i+1)*48} 28V42" stroke="#52675e" stroke-width="1.5"/>`).join(''):'';
 return `<figure class="rmeasure-figure"><div class="rmeasure-axis" aria-label="Ruler in original length units"><span>0</span><span>1</span><span>2</span></div><svg class="rmeasure-art" viewBox="0 0 632 210" role="img" aria-labelledby="rmeasure-art-title"><title id="rmeasure-art-title">Original length-unit ruler, fixed ribbon ${esc(ribbonLengthName(m.amount))}, measuring group ${esc(ribbonLengthName(m.group))}, ${m.q===1?"one whole measuring group":`${m.q} equal template pieces`}; covered ${esc(ribbonLengthName(m.covered))}; gap ${esc(ribbonLengthName(m.gap))}.</title><defs><pattern id="rmeasure-hatch" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#fff"/><path d="M0 10L10 0" stroke="#16645b" stroke-width="1.5"/></pattern></defs><path data-rmeasure-unit d="M20 18V8H308V18" fill="none" stroke="#183430" stroke-width="3"/><text x="164" y="24" text-anchor="middle" font-size="11" fill="#183430">1 original length unit</text><path d="M20 36H596M20 27V45M308 27V45M596 27V45" fill="none" stroke="#183430" stroke-width="2"/>${sixths}<rect data-rmeasure-amount x="20" y="60" width="${m.amount}" height="24" fill="#f4df9c" stroke="#183430" stroke-width="2"/><path d="M${20+m.amount} 54V194" stroke="#b18424" stroke-width="2" stroke-dasharray="5 4"/><circle cx="${20+m.amount}" cy="58" r="5" fill="#b18424" stroke="#183430"/><rect data-rmeasure-group x="20" y="100" width="${m.group}" height="24" fill="#eaf4ef" stroke="#16645b" stroke-width="2"/><rect data-rmeasure-selected x="20" y="100" width="${m.pieceLength}" height="24" fill="url(#rmeasure-hatch)"/>${cuts}<path data-rmeasure-group-bracket d="M20 132V140H${20+m.group}V132" fill="none" stroke="#16645b" stroke-width="2"/><text x="20" y="153" font-size="11" fill="#16645b">1 whole measuring group</text><rect x="20" y="160" width="${m.amount}" height="24" fill="#eaf4ef" stroke="#52675e" stroke-width="1.5"/>${laid}${m.gap?`<rect data-rmeasure-gap x="${20+m.covered}" y="160" width="${m.gap}" height="24" fill="none" stroke="#183430" stroke-width="2" stroke-dasharray="4 3"/>`:''}</svg><figcaption>Top: ribbon to measure. Middle: reusable measuring group. Bottom: laid pieces and the remaining gap. The top bracket marks one original length unit; the lower bracket marks one whole measuring group.</figcaption></figure>`;
}
function references(m){return `<div class="rmeasure-references" data-rmeasure-read><p><strong>Ribbon to measure:</strong> ${esc(ribbonLengthName(m.amount))}.</p> <p><strong>One whole measuring group:</strong> ${esc(ribbonLengthName(m.group))}.</p></div>`;}
function liveBoard(v,entry){
 const material=entry.material,m=ribbonMeasureModel(material),c=ribbonMeasureCase(v.caseId),reason=ribbonLayAdvice(material);
 const finite=!m.canSplit2||!m.canSplit3;
 return `<h2 id="rmeasure-title" tabindex="-1" data-rmeasure-read>${esc(c.prompt)}</h2>${references(m)}<div class="rmeasure-actions"><div class="rmeasure-buttons">${button('lay','Lay one piece',!m.canLay,reason?'rmeasure-lay-reason':'')}${button('lift','Lift last piece',!m.canLift)}${button('return','Return all pieces',!m.canLift)}</div><fieldset><legend>Cut the reusable measuring group</legend><div class="rmeasure-buttons">${splitButton(2,!m.canSplit2)}${splitButton(3,!m.canSplit3)}${button('undo','Undo last split',!m.canUndo)}</div></fieldset></div>${reason?`<p id="rmeasure-lay-reason" class="rmeasure-reason" data-rmeasure-read>${esc(reason)}</p>`:''}${finite?`<p class="rmeasure-limit" data-rmeasure-read>This board offers whole-group, half-group, third-group, quarter-group and sixth-group pieces. ${m.canSplit2||m.canSplit3?'The other split is still available.':'Use Undo last split to try another path.'}</p>`:''}<p data-rmeasure-read>${esc(ribbonPieceName(material))}</p><p class="rmeasure-reminder">${copy.unchanged}</p>${drawing(m)}<p class="rmeasure-covered" data-rmeasure-read>${m.pieces.length?`Covered: ${esc(ribbonLengthName(m.covered))}. Remaining length: ${esc(ribbonLengthName(m.gap))}.`:`No pieces laid yet. ${m.canLay?'Lay a piece to begin.':''}`}</p>${m.complete?`<p class="rmeasure-complete" data-rmeasure-read>${esc(ribbonCompletion(material))}</p>`:m.pieces.length&&!entry.read?'<p data-rmeasure-read>The ribbon is not fully measured yet.</p>':''}<div class="rmeasure-buttons">${button('read','Read the measurement')}${button('example','Show another example')}${hearButton('','Hear this ribbon')}</div>${entry.read?`<div class="rmeasure-reading" tabindex="-1" data-rmeasure-read>${esc(ribbonReading(material))}</div>`:''}`;
}
function exampleBoard(v){
 const m=ribbonMeasureExample(v.frame);
 return `<h2 id="rmeasure-title" tabindex="-1">Worked example: a half-unit ribbon with a third-unit measure</h2><p>${copy.exampleNotice}</p><div class="rmeasure-buttons">${button('previous','Previous picture',v.frame===0)}${button('next','Next picture',v.frame===3)}${button('close','Return to my ribbon')}${hearButton('','Hear this example')}</div><p data-rmeasure-read>Worked example, picture ${m.displayIndex} of 4. ${esc(m.text)}</p>${references(m)}${drawing(m)}`;
}
export function ribbonMeasurePage(notebook,owner){
 const v=current(notebook,owner),entry=v.cases.get(v.caseId);
 return `<section class="panel rmeasure-board" data-rmeasure-root data-rmeasure-view="${v.example?'example':'live'}"><div class="section-heading"><div><h1>${copy.title}</h1><p data-rmeasure-read>${copy.job}</p></div><a class="pill" href="#workshop">Storm Workshop</a></div><label class="rmeasure-selector">Choose a ribbon <select data-rmeasure-case>${ribbonMeasureCases.map(c=>`<option value="${c.id}"${c.id===v.caseId?' selected':''}>${c.title}</option>`).join('')}</select></label>${v.example?exampleBoard(v):liveBoard(v,entry)}<p class="rmeasure-status" role="status" aria-live="polite" aria-atomic="true"></p><p class="rmeasure-reference" data-rmeasure-read>${copy.reference}</p><p class="rmeasure-visit">${copy.visit}</p><a class="pill" href="#workshop/common-cuts">Explore Common Cuts</a><details><summary>For grown-ups</summary><p>${copy.grownup}</p></details></section>`;
}
export function bindRibbonMeasures(notebook,ctx){
 const root=document.querySelector('[data-rmeasure-root]');if(!root||!visit)return;
 const v=visit,owner=v.owner,id=v.caseId,entry=v.cases.get(id),material=entry.material,example=v.example,frame=v.frame;
 const live=()=>root.isConnected&&document.querySelector('[data-rmeasure-root]')===root&&location.hash==='#workshop/ribbon-measures'&&visit===v&&v.caseId===id&&v.cases.get(id)===entry&&entry.material===material&&v.example===example&&v.frame===frame&&(!ctx.isActive||ctx.isActive())&&ctx.notebook()===notebook&&ctx.explorerId()===owner;
 const stop=()=>{ctx.stopSpeech?.();ctx.stopSound?.();};
 if(v.pending)requestAnimationFrame(()=>requestAnimationFrame(()=>{if(live()){root.querySelector('.rmeasure-status').textContent=v.pending;v.pending='';}}));
 function redraw(selector='#rmeasure-title'){ctx.render();const candidate=document.querySelector(selector),node=candidate&&!candidate.disabled?candidate:document.querySelector('#rmeasure-title');if(node){node.focus({preventScroll:true});const box=node.getBoundingClientRect();if(box.top<0||box.bottom>innerHeight)node.scrollIntoView({block:'nearest'});}}
 const firstSplit=()=>{const m=ribbonMeasureModel(entry.material);return m.canSplit2?'[data-rmeasure-split="2"]':m.canSplit3?'[data-rmeasure-split="3"]':'[data-rmeasure-action="undo"]';};
 function edit(next,action,factor){
  if(!next)return;stop();entry.material=next;entry.read=false;
  const m=ribbonMeasureModel(next),gap=ribbonLengthName(m.gap);
  v.pending=action==='split'?`The group now has ${m.q} equal pieces. Already laid pieces keep their sizes.`:action==='undo'?m.q===1?'Last split undone. The measuring group is whole again.':`Last split undone. The group now has ${m.q} equal pieces.`:action==='return'?'All measuring pieces returned. The ribbon itself has not changed.':`${action==='lay'?'Piece laid.':'Last piece lifted.'} Remaining length: ${gap}.`;
  if(m.unfillableGap)v.pending+=' '+ribbonLayAdvice(next);
  let focus=action==='split'?`[data-rmeasure-split="${factor}"]`:`[data-rmeasure-action="${action}"]`;
  if(action==='lay'&&!m.canLay)focus=m.canLift?'[data-rmeasure-action="lift"]':firstSplit();
  if(action==='lift'&&!m.canLift||action==='return')focus=m.canLay?'[data-rmeasure-action="lay"]':firstSplit();
  if(action==='split'&&!(factor===2?m.canSplit2:m.canSplit3)||action==='undo'&&!m.canUndo)focus=firstSplit();
  redraw(focus);
 }
 root.querySelector('[data-rmeasure-case]').addEventListener('change',e=>{if(!live()||!ribbonMeasureCase(e.target.value))return;stop();v.caseId=e.target.value;v.example=false;v.frame=0;v.pending='';if(!v.cases.has(v.caseId))v.cases.set(v.caseId,{material:createRibbonMeasure(v.caseId),read:false});redraw('[data-rmeasure-case]');});
 root.querySelectorAll('[data-rmeasure-split]').forEach(b=>b.addEventListener('click',()=>{if(!live()||example||b.disabled)return;const f=Number(b.dataset.rmeasureSplit);edit(splitRibbonMeasure(material,f),'split',f);}));
 const moves={lay:layRibbonPiece,lift:liftRibbonPiece,return:returnRibbonPieces,undo:undoRibbonSplit};
 root.querySelectorAll('[data-rmeasure-action]').forEach(b=>b.addEventListener('click',()=>{
  if(!live()||b.disabled)return;const action=b.dataset.rmeasureAction;
  if(!example&&moves[action]){edit(moves[action](material),action);return;}
  if(action==='read'&&!example){stop();entry.read=true;v.pending='Current measurement shown.'+(ribbonMeasureModel(material).complete?'':' The ribbon is not fully measured yet.');redraw('[data-rmeasure-action="read"]');}
  if(action==='example'&&!example){stop();v.example=true;v.frame=0;v.pending='Worked example, picture 1 of 4.';redraw();}
  if(action==='close'&&example){stop();v.example=false;v.pending='';redraw('[data-rmeasure-action="example"]');}
  if(example&&['previous','next'].includes(action)){const next=frame+(action==='next'?1:-1);if(!ribbonMeasureExample(next))return;stop();v.frame=next;v.pending=`Worked example, picture ${next+1} of 4.`;redraw(next===0?'[data-rmeasure-action="next"]':next===3?'[data-rmeasure-action="previous"]':`[data-rmeasure-action="${action}"]`);}
 }));
 root.addEventListener('click',e=>{const b=e.target.closest('[data-speak]');if(!b||!root.contains(b))return;if(!live()){e.preventDefault();e.stopImmediatePropagation();return;}b.dataset.speak=[...root.querySelectorAll('[data-rmeasure-read]')].map(x=>x.textContent.trim()).join(' ');},{capture:true});
}
