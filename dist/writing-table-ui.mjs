import {writingTasks,writingCopy} from './writing-table-content.mjs';
import * as core from './writing-table-core.mjs';
import {researchCopy} from './writing-research-content.mjs';
import {revisionCopy} from './writing-revision-content.mjs';
import {summaryCopy} from './writing-summary-content.mjs';
import {quotationCopy} from './writing-quote-content.mjs';
import {hearButton} from './play-media.mjs';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plainP=s=>`<p>${esc(s)}</p>`;
const p=s=>`<p data-writing-read>${esc(s)}</p>`;
const button=(action,label,disabled=false)=>`<button type='button' data-writing-action='${action}'${disabled?' disabled':''}>${esc(label)}</button>`;
const title=s=>`<h2 id='writing-task-title' tabindex='-1' data-writing-read>${esc(s)}</h2>`;
let views=new WeakMap();
function local(state,owner){let v=views.get(state),id=state.writingDesk?.currentId||'';const savedBench=state.writingDesk?.records?.[id]?.source?.bench,bench=['paragraphs','linking','holding','research','revision','point-quote','summary'].includes(savedBench)?savedBench:null;if(!v||v.owner!==owner){v={owner,id,selected:'',bench:bench||'paragraphs',panels:[],teachingStep:0,inspector:null,summaryTurn:'story',sentence:0,storyPage:0,examplePage:0,comparisonPage:0};views.set(state,v);}if(v.id!==id){v.id=id;v.selected='';v.panels=[];v.teachingStep=0;v.inspector=null;v.summaryTurn='story';v.sentence=0;v.storyPage=0;v.examplePage=0;v.comparisonPage=0;if(bench)v.bench=bench;}return v;}
function cardBody(card,lineIds=[],summary=false){
 return `<h3 data-writing-read>${esc(card.title)}</h3>${p(card.origin)}${p(card.notice)}<ol class='wt-source-lines'>${card.lines.map(line=>`<li data-writing-line='${esc(line.id)}' class='${lineIds.includes(line.id)?'wt-referenced':''}'><span data-writing-read>${esc(line.text)}</span>${lineIds.includes(line.id)?(summary?'<strong>Referenced story part</strong>':"<strong>Referenced line</strong>"):''}</li>`).join('')}</ol>`;
}
function referenceControls(s,noteId,scope,interactive=true){
 const result=core.writingReferences(s,noteId);
 if(result.status==='none')return '';
 if(result.status!=='ready')return `<p class='wt-reference-unavailable'>${esc(researchCopy.unavailableReference)}</p>`;
 return `<div class='wt-note-references'>${result.refs.map((ref,i)=>{const label=`Compare with ${ref.card.title}, ${s.bench==='summary'?(ref.lineNumbers.length===1?'story part':'story parts'):(ref.lineNumbers.length===1?'line':'lines')} ${ref.lineNumbers.join(', ')}`;return interactive?`<button type='button' data-writing-reference='${esc(noteId)}' data-writing-reference-index='${i}' data-writing-reference-scope='${scope}'>${esc(label)}</button>`:`<details><summary>${esc(label)}</summary>${cardBody(ref.card,ref.lineIds,s.bench==='summary')}</details>`;}).join('')}</div>`;
}
const summaryPager=(kind,index,total,unit)=>`<div class='wt-actions wt-summary-pager'><button type='button' data-writing-summary-nav='${kind}-prev'${index===0?' disabled':''}>Previous ${esc(unit)}</button><button type='button' data-writing-summary-nav='${kind}-next'${index>=total-1?' disabled':''}>Next ${esc(unit)}</button></div>`;
function summaryPreview(s,w,label,scope,interactive,panels){
 const view=core.writingSummaryPreview(s,w);if(!view)return null;
 const current=scope==='current'&&interactive&&label==='Your page',words=current?p:plainP;
 const sentence=part=>`${current?`<button type='button' data-writing-read data-writing-summary-sentence='${esc(part.id)}'>${esc(part.text)}</button>`:plainP(part.text)}${referenceControls(s,part.id,scope,interactive)}`;
 const group=(key,heading,parts,empty)=>`<details data-writing-panel='${key}'${panels.includes(key)?' open':''}><summary>${esc(heading)} (${parts.length})</summary>${parts.length?parts.map(part=>`<div class='wt-summary-tray-sentence'>${sentence(part)}</div>`).join(''):words(empty)}</details>`;
 return `<section class='wt-page-preview wt-summary-paper' data-writing-summary-preview='${scope}'><h3>${esc(label==='Your page'?'Your summary':label)}</h3><div class='wt-summary-kept' data-writing-summary-kept>${view.keep.parts.length?`<p data-writing-summary-paragraph='${scope}'${current?' data-writing-read':''}>${view.keep.parts.map(part=>current?`<button type='button' data-writing-summary-kept-part='${esc(part.id)}' data-writing-summary-sentence='${esc(part.id)}'>${esc(part.text)}</button>`:`<span data-writing-summary-kept-part='${esc(part.id)}'>${esc(part.text)}</span>`).join(' ')}</p><div class='wt-summary-locators'>${view.keep.parts.map(part=>`<div>${referenceControls(s,part.id,scope,interactive)}</div>`).join('')}</div>`:words(summaryCopy.empty)}</div>${words(summaryCopy.aside)}${view.other.map(grouping=>group(`summary-${scope}-${grouping.id}`,grouping.text,grouping.parts,'No sentences here yet.')).join('')}${group(`summary-${scope}-waiting`,summaryCopy.waiting,view.waiting,summaryCopy.waitingEmpty)}</section>`;
}
function summaryExample(s,v){
 const study=core.writingSummaryStudy(s);if(study.status!=='ready')return '';
 const {demo,comparisons}=study.study,index=Math.max(0,Math.min(v.examplePage,demo.steps.length)),comparison=Math.max(0,Math.min(v.comparisonPage,comparisons.length-1)),card=comparisons[comparison];
 return `<aside id='writing-example' tabindex='-1' class='wt-summary-example'><h3 data-writing-read>${esc(demo.title)}</h3>${p(demo.brief)}<p>Example part ${index+1} of ${demo.steps.length+1}</p>${p(index===0?demo.story:demo.steps[index-1])}${summaryPager('example',index,demo.steps.length+1,'example part')}<section class='wt-summary-comparison'><h4 data-writing-read>${esc(card.title)}</h4><p>Version ${comparison+1} of ${comparisons.length}</p>${p(card.text)}${p(card.notice)}${summaryPager('comparison',comparison,comparisons.length,'version')}</section></aside>`;
}
function summarySurface(r,v){
 const s=r.source,{study}=core.writingSummaryStudy(s),cards=core.writingResearchCards(s),card=cards[0],turn=v.summaryTurn||'story';
 const tabs=`<nav class='wt-actions wt-summary-turns' aria-label='Summary turns'>${[['story','Read story'],['choose','Choose sentences'],['summary','Read your summary']].map(([id,label])=>`<button type='button' data-writing-summary-turn='${id}' aria-pressed='${turn===id}'>${label}</button>`).join('')}</nav>`;
 let surface='';
 if(turn==='story'){
  const index=Math.max(0,Math.min(v.storyPage,(card?.lines.length||1)-1)),whole=v.panels.includes('summary-whole');
  surface=card?`<section class='wt-summary-story' data-writing-summary-story><h3 id='writing-summary-turn-title' tabindex='-1' data-writing-read>${esc(card.title)}</h3>${p(card.notice)}<p>Story part ${index+1} of ${card.lines.length}</p>${p(card.lines[index].text)}${summaryPager('story',index,card.lines.length,'story part')}<details data-writing-panel='summary-whole'${whole?' open':''}><summary>Whole story</summary>${whole?card.lines.map((line,i)=>`<section><h4>Story part ${i+1}</h4>${p(line.text)}</section>`).join(''):''}</details></section>`:p(researchCopy.unavailableCard);
 }else if(turn==='choose'){
  const index=Math.max(0,Math.min(v.sentence,s.parts.length-1)),part=s.parts[index],destination=s.choices.find(c=>c.id===r.work.placements[part.id]);v.selected=part.id;
  surface=`<div class='wt-summary-layout'><section class='wt-summary-tools'><h3 id='writing-summary-turn-title' tabindex='-1'>Choose sentences</h3><p>Sentence ${index+1} of ${s.parts.length}</p><article class='wt-summary-sentence' id='writing-move-tools' tabindex='-1' data-writing-summary-part='${esc(part.id)}'>${p(part.text)}<p>${destination?'Chosen tray: '+esc(destination.text):'Waiting sentence'}</p>${referenceControls(s,part.id,'current')}<div class='wt-destinations'>${s.choices.map(choice=>`<button type='button' data-writing-destination='${esc(choice.id)}' aria-pressed='${destination?.id===choice.id}'>${esc(choice.text)}</button>`).join('')}${button('put-back','Put back',!destination)}</div></article>${summaryPager('sentence',index,s.parts.length,'sentence')}</section>${summaryPreview(s,r.work,'Your page','current',true,v.panels)}</div>`;
 }else surface=`<h3 id='writing-summary-turn-title' tabindex='-1'>Read your summary</h3>${summaryPreview(s,r.work,'Your page','current',true,v.panels)}`;
 return `<article class='wt-work wt-summary-work' data-writing-summary><div class='wt-summary-press' aria-hidden='true'><i></i><i></i><i></i></div>${title(s.title)}${p(s.prompt)}<aside class='wt-summary-brief'><h3 data-writing-read>This reader needs…</h3>${p(study.brief)}</aside>${tabs}${surface}${inspector(s,v)}<div class='wt-actions'>${button('check','Check this draft')}${button('keep','Keep this version')}${button('next','Next draft')}${hearButton('','Hear this task')}</div>${feedback(r)}</article>`;
}

function noticePreview(s,w,label,scope,interactive,panels){
 const notice=core.writingNoticePreview(s,w);if(!notice)return null;
 const read=scope==='current'&&label==='Your page'&&interactive,words=read?p:plainP;
 const heading=(tag,text)=>`<${tag}${read?' data-writing-read':''}>${esc(text)}</${tag}>`;
 const lines=parts=>parts.map(part=>`<p data-writing-notice-part='${esc(part.id)}'${read?' data-writing-read':''}>${esc(part.text)}</p>`).join('');
 const asideKey=`notice-aside-${scope}`;
 return `<section class='wt-page-preview wt-notice-preview' data-writing-notice='${scope}'>${heading('h3',label==='Your page'?'Your notice':label)}<div class='wt-notice-paper' data-writing-notice-kept>${heading('h4',notice.keep.text)}${notice.keep.parts.length?lines(notice.keep.parts):words('No lines on this notice yet.')}</div><div class='wt-notice-waiting' data-writing-notice-waiting>${heading('h4','Waiting lines')}${notice.waiting.length?lines(notice.waiting):words('No lines waiting.')}</div><details data-writing-panel='${asideKey}' data-writing-notice-aside${panels.includes(asideKey)?' open':''}><summary>${esc(notice.aside.text)} (${notice.aside.parts.length})</summary>${words('These lines are set aside for this reader. They are still here, not marked false or deleted.')}<div class='wt-aside-lines'>${notice.aside.parts.length?lines(notice.aside.parts):words('No lines set aside.')}</div></details>${notice.other.map((group,i)=>{const key=`notice-extra-${scope}-${i}`;return `<details data-writing-panel='${key}' data-writing-notice-extra='${esc(group.id)}'${panels.includes(key)?' open':''}><summary>${esc(group.text)} (${group.parts.length})</summary>${group.parts.length?lines(group.parts):words('No lines here yet.')}</details>`;}).join('')}</section>`;
}
function quotePreview(s,w,label,scope,interactive){
 const read=scope==='current'&&interactive&&label==='Your page',blocks=core.writingPreview(s,w);
 const locator=(id,index)=>{const refs=referenceControls(s,id,scope,interactive);return refs?`<div class='wt-quote-locator' data-writing-quote-reference-part='${esc(id)}'><p>${s.kind==='order'?`Sentence ${index+1}`:'Selected words'}</p>${refs}</div>`:'';};
 if(s.kind==='order')return `<section class='wt-page-preview wt-quote-paper' data-writing-quote-preview='${esc(scope)}'><h3>${esc(label==='Your page'?quotationCopy.paragraphLabel:label)}</h3><p data-writing-quote-paragraph='${esc(scope)}'${read?' data-writing-read':''}>${w.order.map(id=>`<span data-writing-quote-part='${esc(id)}'>${esc(s.parts.find(part=>part.id===id).text)}</span>`).join(' ')}</p><div class='wt-quote-locators'>${w.order.map(locator).join('')}</div></section>`;
 return `<section class='wt-page-preview wt-quote-paper' data-writing-quote-preview='${esc(scope)}'><h3>${esc(label==='Your page'?quotationCopy.choiceLabel:label)}</h3>${blocks.map(block=>`<div>${block.heading&&block.heading!==quotationCopy.choiceLabel?`<h4>${esc(block.heading)}</h4>`:''}${(read?p:plainP)(block.text)}${(block.noteIds||[]).map(locator).join('')}</div>`).join('')}</section>`;
}
function preview(s,w,label='Your page',scope='current',interactive=true,panels=[]){
 if(s.bench==='summary'){const summary=summaryPreview(s,w,label,scope,interactive,panels);if(summary!==null)return summary;}
 if(s.bench==='point-quote')return quotePreview(s,w,label,scope,interactive);
 const notice=noticePreview(s,w,label,scope,interactive,panels);if(notice!==null)return notice;
 return `<section class='wt-page-preview'><h3>${esc(label)}</h3>${core.writingPreview(s,w).filter((block,i)=>!(s.kind==='tap'&&s.bench!=='research'&&label==='Your page'&&i===0)).map((block,i)=>{
 const read=label==='Your page'&&!(s.kind==='choice'&&!s.preview&&i===0);
 const notes=['research','summary'].includes(s.bench)&&Array.isArray(block.noteIds)?block.noteIds:null;
 const material=notes?.length?notes.map(id=>{const item=(s.kind==='choice'?s.choices:s.parts).find(x=>x.id===id);return `<div class='wt-note'>${(read?p:plainP)(item?.text||'')}${referenceControls(s,id,scope,interactive)}</div>`;}).join(''):(read?p:plainP)(block.text||(s.bench==='research'?'No notes here yet.':'No strips here yet.'));
 return `<div>${block.heading?`<h4${read?' data-writing-read':''}>${esc(block.heading)}</h4>`:''}${material}</div>`;
 }).join('')}</section>`;
}
function sourceMaterials(s){
 if(s.bench==='point-quote'){
  const cards=core.writingResearchCards(s);
  if(s.kind==='order')return cards.length?cards.map(card=>`<section class='wt-research-card'>${cardBody(card)}</section>`).join(''):p(researchCopy.unavailableCard);
  return s.parts.map(part=>{const card=cards.find(card=>card.id===part.id);if(card)return `<section class='wt-research-card'>${cardBody(card)}</section>`;const raw=Array.isArray(s.research?.cards)?s.research.cards.find(card=>card&&typeof card==='object'&&card.id===part.id):null;return `<section class='wt-research-card'>${typeof raw?.title==='string'&&Array.from(raw.title).length<=160?`<h3>${esc(raw.title)}</h3>`:''}${typeof raw?.origin==='string'&&Array.from(raw.origin).length<=1000?p(raw.origin):''}${typeof raw?.notice==='string'&&Array.from(raw.notice).length<=1000?p(raw.notice):''}${p(part.text)}${p(researchCopy.unavailableCard)}</section>`;}).join('');
 }
 if(s.bench!=='research')return s.parts.map((x,i)=>p(s.numbered===true?`${i+1}. ${x.text}`:x.text)).join('');
 const cards=core.writingResearchCards(s);
 return s.parts.map(part=>{const card=cards.find(c=>c.id===part.id);if(!card)return p(part.text);const comparisons=s.choices.map(choice=>{const result=core.writingReferences(s,choice.id);return result.status==='ready'?result.refs.find(ref=>ref.card.id===card.id):null;}),first=comparisons[0];const shared=first&&comparisons.every(ref=>ref&&JSON.stringify(ref.lineIds)===JSON.stringify(first.lineIds))?first.lineIds:[];return `<section class='wt-research-card'>${cardBody(card,shared)}</section>`;}).join('');
}
function sources(s,v){
 if(s.bench==='point-quote'){
  const cards=core.writingResearchCards(s);
  return `<details data-writing-panel='sources'${v.panels.includes('sources')?' open':''}><summary>${esc(quotationCopy.sourcesLabel)}</summary>${p(quotationCopy.sourcesIntro)}<div class='wt-actions'>${cards.map(card=>`<button type='button' data-writing-card='${esc(card.id)}'>Open ${esc(card.title)}</button>`).join('')}</div>${sourceMaterials(s)}</details>`;
 }
 if(s.bench!=='research'||s.kind==='tap')return '';
 const cards=core.writingResearchCards(s);
 return `<details data-writing-panel='sources'${v.panels.includes('sources')?' open':''}><summary>Sources beside these supplied notes</summary><p>These activity cards model sources; they are not a record of sources you read.</p>${cards.length?cards.map(card=>`<button type='button' data-writing-card='${esc(card.id)}'>Open ${esc(card.title)}</button>`).join(''):p(researchCopy.unavailableCard)}</details>`;
}
function inspector(s,v){
 if(!v.inspector)return '';
 const card=core.writingResearchCards(s).find(c=>c.id===v.inspector.cardId);if(!card)return '';
 return `<aside class='wt-source-inspector'><h2 id='writing-source-title' tabindex='-1'>Source for ${esc(v.inspector.label)}</h2>${cardBody(card,v.inspector.lineIds,s.bench==='summary')}${p(s.bench==='summary'?'These story parts belong to this complete original story. They are scene references, not numbered lines in an outside book.':'These line numbers belong to this activity card. They are not line numbers in an outside book or website.')}${button('close-source','Close source')}</aside>`;
}
function researchReturn(state,r){
 if(!r||r.source.id==='research-organise')return '';
 const earlier=state.writingDesk?.records?.['research-organise'];
 if(!core.validWritingRecord(earlier))return '';
 const kept=['firstKept','latestKept'].filter(k=>core.validWritingSnapshot(earlier.source,earlier[k]));
 const usable=kept.some(k=>core.writingPreview(earlier.source,earlier[k].work).some(block=>block.noteIds?.some(id=>core.writingReferences(earlier.source,id).status==='ready')));
 if(!usable)return '';
 return `<aside class='wt-research-return'>${p(researchCopy.returnInvitation)}${p(earlier.source.title)}${p(earlier.source.reader)}${button('research-return','Return to your source-linked notes')}</aside>`;
}
function quoteReturn(state){
 const target=core.writingQuoteReturn(state);if(!target)return '';
 return `<aside class='wt-quote-return'>${p(quotationCopy.returnInvitation)}${p(target.title)}${p(target.reader)}${button('quote-return','Return to your kept paragraph')}</aside>`;
}
function teaching(s,v){
 if(!['holding','research','revision'].includes(s.bench))return s.teach.map(p).join('');
 const last=Math.max(0,s.teach.length-2),step=Math.min(v.teachingStep,last);
 return `${s.bench!=='revision'&&s.teach[0]?p(s.teach[0]):''}${s.teach[1]?`<h3 data-writing-read>Worked example</h3><p data-writing-read><em>${esc(s.teach[1])}</em></p><ol class='wt-teaching-steps'>${s.teach.slice(2,2+step).map(x=>`<li data-writing-read>${esc(x)}</li>`).join('')}</ol><div class='wt-actions'>${button('teaching-prev','Previous example part',step===0)}${button('teaching-next','Next example part',step===last)}</div>`:''}`;
}
function snapshot(s,k,label,scope='current',interactive=true,panels=[]){return `<section class='wt-kept' data-writing-version='${scope}'><h3>${esc(label)}</h3>${core.validWritingSnapshot(s,k)?`${p(k.check?'Practice with this draft':'Not checked in this version')}${preview(s,k.work,'Kept page',scope,interactive,panels)}`:'<p>This earlier version stays in your Notes download, but cannot be read here.</p>'}</section>`;}
function controls(r,v){
 const s=r.source,w=r.work;
 if(s.kind==='tap'){
  if(s.bench==='research'){
   const cards=s.research?.cardChoices===true?core.writingResearchCards(s):[];
   return `<div class='wt-card-choices'>${s.parts.map(part=>{const card=cards.find(c=>c.id===part.id),tapped=w.taps.includes(part.id);return `<article class='wt-research-card'>${part.tap===true?`<button type='button' data-writing-tap='${esc(part.id)}' aria-pressed='${tapped}'><span class='wt-card-selection'>${tapped?'Selected source card':'Select source card'}</span>${card?cardBody(card):p(part.text)}</button>`:p(part.text)}${card?`<button type='button' data-writing-card='${esc(card.id)}'>Inspect ${esc(card.title)}</button>`:''}</article>`;}).join('')}${button('clear-taps','Clear my selection',!w.taps.length)}</div>`;
  }
  let prefix='';const words=s.parts.map(x=>{const sentence=1+(prefix.match(/[.!?](?=\s|$)/g)||[]).length;prefix+=x.text;if(x.tap!==true)return esc(x.text);const tapped=w.taps.includes(x.id),name=`${x.text.trim()}, sentence ${sentence}${tapped?', tapped':''}`;return `<button type='button' class='wt-tap-word' data-writing-tap='${esc(x.id)}' aria-pressed='${tapped}' aria-label='${esc(name)}'>${esc(x.text)}${tapped?`<span class='wt-tap-marker' aria-hidden='true'>tapped</span>`:''}</button>`;}).join('');
  return `<div class='wt-tap-material'><p class='wt-tap-draft' data-writing-read>${words}</p>${button('clear-taps','Clear my taps',!w.taps.length)}</div>`;
 }
 if(s.kind==='sort')return `<div class='wt-sorting'><div class='wt-move-tools' tabindex='-1' id='writing-move-tools'><p data-writing-selected>${v.selected?'Moving: '+esc(s.parts.find(x=>x.id===v.selected)?.text):'Choose a strip first.'}</p><div class='wt-destinations'>${s.choices.map(h=>`<button type='button' data-writing-destination='${esc(h.id)}'${!v.selected?' disabled':''}>${esc(s.bench==='revision'?core.writingRevisionDestinationLabel(s,h.id):'Put under '+h.text)}</button>`).join('')}${button('put-back','Put back',!v.selected)}</div></div><div class='wt-strip-bank' role='group' aria-label='${s.bench==='research'?'Notes':s.bench==='revision'?'Lines and changes':'Sentence strips'}'>${s.parts.map((x,i)=>`<button type='button' class='wt-strip' data-writing-strip='${esc(x.id)}' aria-pressed='${v.selected===x.id}'><span>${i+1}</span><span>${esc(x.text)}<small>${esc(s.choices.find(h=>h.id===(own(w.placements,x.id)?w.placements[x.id]:null))?.text||(s.bench==='research'?'Waiting note':'Waiting strip'))}</small></span></button>`).join('')}</div></div>`;
 if(s.kind==='order')return `<ol class='wt-order'>${w.order.map((id,i)=>{const x=s.parts.find(x=>x.id===id),quote=s.bench==='point-quote',role=quote&&r.help.hint?core.writingQuoteRole(s,id):null;return `<li${quote?` data-writing-quote-control-part='${esc(id)}'`:''}>${quote?`<strong class='wt-quote-sentence'>Sentence ${i+1}</strong>`:''}${role?`<span class='wt-quote-role' data-writing-quote-role='${esc(role)}'>${esc(quotationCopy.roleLabels[role])}</span>`:''}<p>${esc(x.text)}</p><div><button type='button' data-writing-move='${esc(id)}' data-writing-direction='-1'${i===0?' disabled':''} aria-label='Move earlier, ${quote?'sentence':'paragraph'} ${i+1}'>Move earlier</button><button type='button' data-writing-move='${esc(id)}' data-writing-direction='1'${i===w.order.length-1?' disabled':''} aria-label='Move later, ${quote?'sentence':'paragraph'} ${i+1}'>Move later</button></div></li>`;}).join('')}</ol>`;
 if(s.kind==='break')return `<div class='wt-breaks'>${s.parts.map((x,i)=>`${i?`<button type='button' data-writing-boundary='${esc(x.id)}' aria-pressed='${w.boundary===x.id}'>Start a paragraph here, before sentence ${i+1}</button>`:''}${plainP(x.text)}`).join('')}</div>`;
 return `<div class='wt-choices'>${s.choices.map(x=>`<button type='button' data-writing-read data-writing-choice='${esc(x.id)}' aria-pressed='${w.choice===x.id}'>${esc(x.text)}</button>`).join('')}</div>`;
}
function feedback(r){
 const last=r.checks.at(-1);if(!last)return '';let body=last.feedback.map(p).join('');
 if(r.source.kind==='sort'&&last.outcome!=='fit'&&last.feedback.length>1){
  const summary=last.outcome==='incomplete'?(r.source.bench==='summary'?summaryCopy.incomplete:writingCopy.incomplete):r.source.bench==='summary'?summaryCopy.different:r.source.bench==='revision'?revisionCopy.summary:'Compare each strip with its heading.',editable='Your draft is still here. You can change it.';let messages=last.feedback;
  if(messages[0]===summary)messages=messages.slice(1);
  if(last.outcome==='different'&&messages.at(-1)===editable)messages=messages.slice(0,-1);
  body=p(summary)+(messages.length?`<details data-writing-strip-notes><summary>${esc(r.source.bench==='summary'?summaryCopy.feedbackDetails:r.source.bench==='revision'?revisionCopy.feedbackDetails:'Look at the strip notes')}</summary>${messages.map(p).join('')}</details>`:'')+(last.outcome==='different'?p(editable):'');
 }
 return `<aside class='wt-feedback' id='writing-feedback' tabindex='-1'><h3>Last check</h3>${!core.sameWritingWork(last.work,r.work)?p('Checked before your last change'):''}${body}<small>Practice with this draft</small></aside>`;
}
function shelf(state,v){const view=core.writingView(state);return `<details data-writing-panel='shelf'${v.panels.includes('shelf')?' open':''}><summary>Choose a draft</summary><div class='wt-benches'>${[['paragraphs','Paragraph Sort'],['linking','The Linking Word'],['holding','Holding It Together'],['research','Research Corner'],['revision',revisionCopy.label],['point-quote',quotationCopy.label],['summary',summaryCopy.label]].map(([id,label])=>`<button type='button' data-writing-bench='${id}' aria-pressed='${v.bench===id}'>${label}</button>`).join('')}</div>${v.bench==='summary'?p(summaryCopy.invitation):v.bench==='holding'?p(writingCopy.holdingHeader):v.bench==='revision'?p(revisionCopy.header):v.bench==='point-quote'?p(quotationCopy.header):''}<div class='wt-shelf'>${writingTasks.filter(x=>x.bench===v.bench).map(x=>`<button type='button' data-writing-open='${x.id}' aria-pressed='${state.writingDesk?.currentId===x.id}'>${esc(core.validWritingRecord(state.writingDesk?.records?.[x.id])?state.writingDesk.records[x.id].source.title:x.title)}</button>`).join('')}</div>${view.records.filter(x=>!writingTasks.some(t=>t.id===x.id)||!x.readable).map(x=>x.readable?`<button type='button' data-writing-open='${esc(x.id)}'>${esc(x.title)}</button>`:`<p>${esc(x.id)} is kept unchanged in your Notes download.</p>`).join('')}<p>Every draft stays open. Earlier work waits while you try another.</p></details>`;}
export function writingEntry(){return `<aside class='writing-entry'><h2>The Writing Table</h2><p>The librarian needs a page visitors can use. Arrange paper strips and help a reader follow the report.</p><a href='#desk/writing'>Try the Writing Table</a></aside>`;}
function otherReader(state,s){
 if(s?.bench!=='revision')return '';const target=core.writingOtherReader(state,s);
 if(target.status==='absent')return '';
 return `<aside class='wt-other-reader'>${target.status==='unavailable'?p(revisionCopy.unavailableReader):''}<button type='button' data-writing-other-reader${target.status==='ready'?'':' disabled'}>${esc(target.label||revisionCopy.label)}</button></aside>`;
}
function revisionInvitation(){return `<aside class='wt-revision-invitation'>${p(revisionCopy.invitation)}<a href='#post/messages/own' data-writing-own-message>${esc(revisionCopy.messageLabel)}</a></aside>`;}
function workSurface(state,r,v){
 if(r.source.bench==='summary'&&core.writingSummaryStudy(r.source).status==='ready')return summarySurface(r,v);
 const s=r.source,revision=s.bench==='revision',quote=s.bench==='point-quote',notice=!!core.writingNoticePreview(s,r.work);
 const intro=revision&&s.teach[0]?`<p class='wt-revision-intro' data-writing-read>${esc(s.teach[0])}</p>`:'';
 const materials=`${quote?`<div class='wt-quote-source-entry'>${button('quote-source',quotationCopy.readSourceLabel)}</div>`:''}${s.kind==='choice'&&!quote?`<div class='wt-source'>${s.preview?'<h3>Original draft</h3>':''}${sourceMaterials(s)}</div>`:''}${s.changes?`<p class='wt-changes' data-writing-read>What changes: ${esc(s.changes)}</p>`:''}${sources(s,v)}`;
 const currentPreview=preview(s,r.work,'Your page','current',true,v.panels);
 const actions=`<div class='wt-actions'>${button('check','Check this draft',s.bench==='summary'&&core.writingSummaryStudy(s).status!=='ready')}${button('keep','Keep this version')}${button('next','Next draft')}${hearButton('','Hear this task')}</div>`;
 return `<article class='wt-work'${s.bench==='research'?" data-writing-research":revision?" data-writing-revision":quote?" data-writing-quote":''}>${title(s.title)}${p(s.prompt)}${s.bench==='summary'?p(summaryCopy.unavailable):''}${intro}${s.steps?`<ol class='wt-guided'>${s.steps.map(x=>`<li data-writing-read>${esc(x)}</li>`).join('')}</ol>`:''}${materials}${quote?`<div class='wt-quote-layout' data-writing-quote-layout>${currentPreview}<div class='wt-quote-tools'>${controls(r,v)}</div></div>${inspector(s,v)}${actions}`:notice?`<div class='wt-revision-layout'>${controls(r,v)}${currentPreview}</div>${actions}`:`${controls(r,v)}${inspector(s,v)}${actions}${currentPreview}`}${feedback(r)}${otherReader(state,s)}</article>`;
}
export function writingPage(state,owner=''){
 const view=core.writingView(state),r=view.record,v=local(state,owner);
 const heading=`<header class='wt-heading'><a href='#desk'><span aria-hidden='true'>←</span> Keeper’s Desk</a><h1>The Writing Table</h1><a href='#post/letters'>Letters for a reader</a>${view.status!=='unsupported'?button('research','Research Corner')+button('revision',revisionCopy.label)+button('quote',quotationCopy.label)+button('summary',summaryCopy.label):''}</header>`;
 if(view.status==='unsupported')return `<section data-writing-root class='wt-room'>${heading}<p>This writing notebook needs another version of the game. It stays in your Notes download. Other places are open.</p><a href='#notes'>Download your Notes</a></section>`;
 const s=r?.source,bakeryBlocked=own(state.writingDesk?.records||{},'bakery')&&!core.validWritingRecord(state.writingDesk.records.bakery),revision=s?.bench==='revision',quote=s?.bench==='point-quote';
 return `<section data-writing-root class='wt-room'${revision?' data-writing-revision-room':quote?' data-writing-quote-room':s?.bench==='summary'?' data-writing-summary-room':''}>${heading}<p class='wt-fiction'>${quote?esc(quotationCopy.frameLabel):'A story from Willowbank'}</p>${!r&&state.writingDesk?.currentId?`<aside class='wt-unavailable'>${p('This earlier draft cannot be changed here. It is still in your Notes download. Try another draft.')}<a href='#notes'>Download your Notes</a></aside>`:''}${!r?`<div class='wt-arrival'>${title('A page for the visitors')}${p(writingCopy.intro)}<div class='wt-paper-stack' aria-hidden='true'><span>Opening times</span><span>Finding the bakery</span><span>What’s for sale</span></div>${bakeryBlocked?button('choose','Choose another draft'):button('start','Open the bakery draft')}${hearButton(writingCopy.intro,'Hear the invitation')}</div>`:`<div class='wt-reader'>${p(s.reader)}${view.familiar?`<small>${s.bench==='summary'?'You have opened another summary brief':'A draft you have seen'}</small>`:''}</div>${workSurface(state,r,v)}`}<p id='writing-status' role='status' tabindex='-1' aria-live='polite'></p>${r?`<details data-writing-panel='teaching'${v.panels.includes('teaching')?' open':''}><summary>How writing works</summary>${teaching(s,v)}</details><details data-writing-panel='help'${v.panels.includes('help')?' open':''}><summary>Help and a separate example</summary>${button('hint','A hint')}${button('example','Try a separate example')}${button('together',r.help.together?'Reading together':'Read together')}${r.help.hint?`<aside id='writing-hint' tabindex='-1'>${p(s.hint)}</aside>`:''}${r.help.example?(s.bench==='summary'?summaryExample(s,v):`<aside id='writing-example' tabindex='-1'>${p(s.example)}</aside>`):''}${revision&&r.help.together?p(revisionCopy.together):''}</details><details data-writing-panel='versions'${v.panels.includes('versions')?' open':''}><summary>Kept versions</summary><div class='wt-versions'>${own(r,'firstKept')?snapshot(s,r.firstKept,'First kept version','first',true,v.panels):p('Keep any version, including an unfinished one.')}${own(r,'latestKept')?snapshot(s,r.latestKept,'Latest kept version','latest',true,v.panels):''}</div></details>${s.bench==='summary'?p(core.writingSummaryStudy(s).study?.returnPrompt||summaryCopy.returnPrompt)+p(summaryCopy.support):revision?revisionInvitation():p(s.bench==='research'?researchCopy.invitation:quote?quotationCopy.invitation:s.bench==='holding'?writingCopy.holdingInvitation:writingCopy.invitation)}`:''}${researchReturn(state,r)}${quoteReturn(state)}${shelf(state,v)}<details data-writing-panel='grownup'${v.panels.includes('grownup')?' open':''}><summary>For grown-ups</summary>${s?.bench==='summary'?p(summaryCopy.grownup):revision?p(revisionCopy.grownup):s?.bench==='research'?p(researchCopy.grownup):quote?p(quotationCopy.grownup):s?.bench==='holding'?p(writingCopy.holdingGrownup):''}${p(writingCopy.grownup)}<a href='#notes'>Notes and downloads</a></details></section>`;
}
const own=(x,k)=>Object.hasOwn(x,k);
export function writingNotes(state){
 if(!own(state,'writingDesk'))return '';const view=core.writingView(state);let raw;try{raw=JSON.stringify(state.writingDesk,null,2);}catch{raw='Original writing notebook remains in the full Notes download.';}
 return `<details class='panel'><summary>Writing Table: supplied drafts and kept versions</summary><p>${esc(writingCopy.grownup)}</p>${view.records.map(x=>{const r=state.writingDesk.records[x.id];return `<section><h3>${esc(x.title||x.id)}</h3>${x.readable?`${['revision','summary'].includes(r.source.bench)?plainP(r.source.reader):''}${preview(r.source,r.work,'Current page','current',false)}${own(r,'firstKept')?snapshot(r.source,r.firstKept,'First kept version','first',false):''}${own(r,'latestKept')?snapshot(r.source,r.latestKept,'Latest kept version','latest',false):''}`:'<p>Earlier unreadable work is retained unchanged.</p>'}</section>`;}).join('')}<details><summary>Full retained source and practice checks</summary><pre>${esc(raw)}</pre></details><a href='#desk/writing'>Return to the Writing Table</a></details>`;
}
const errors={unavailable:'This earlier draft cannot be changed here. It is still in your Notes download. Try another draft.',full:'There is no room for another draft in this writing notebook. Your earlier work is still here. Download your Notes.',unexportable:'This change could not be kept. Your earlier draft is still here. Download your Notes.',selection:'Choose an available draft.',material:'Choose a part of this draft.','kept-unavailable':'An earlier kept version cannot be read here. It stays unchanged. Your current draft is still editable; download your Notes.'};
export function bindWriting(state,ctx={}){
 const root=document.querySelector('[data-writing-root]');if(!root)return;
 let owner;try{owner=typeof ctx.explorerId==='function'?ctx.explorerId():null;}catch{owner=null;}
 const notebook=ctx.notebook,explorerId=ctx.explorerId,isActive=ctx.isActive,canExport=ctx.canExport,v=local(state,owner),route=location.hash,parents=new WeakMap();
 let ownedRoot,ownedRecord,ownedSource,ownedWork,current,rootPresent,rootBytes,readableBytes=false;
 const adopt=()=>{try{rootPresent=own(state,'writingDesk');ownedRoot=state.writingDesk;current=ownedRoot?.currentId;ownedRecord=core.writingView(state).record;ownedSource=ownedRecord?.source;ownedWork=ownedRecord?.work;rootBytes=JSON.stringify(ownedRoot);readableBytes=true;}catch{readableBytes=false;}};
 adopt();
 const chain=el=>{const result=[];for(let node=el;node&&node!==document;node=node.parentNode)result.push([node,node.parentNode]);return result;};
 const rootChain=chain(root),unchanged=links=>links.every(([node,parent])=>node.parentNode===parent);
 const visible=el=>{try{for(let node=el;node;node=node.parentElement){if(node.hidden||node.getAttribute?.('aria-hidden')==='true'||getComputedStyle(node).display==='none'||getComputedStyle(node).visibility==='hidden')return false;if(node.tagName==='DETAILS'&&!node.open&&node!==el){const summary=[...node.children].find(child=>child.tagName==='SUMMARY');if(!summary?.contains(el))return false;}}return true;}catch{return false;}};
 const owned=()=>{try{return readableBytes&&typeof owner==='string'&&owner.trim().length>0&&typeof notebook==='function'&&typeof explorerId==='function'&&typeof isActive==='function'&&typeof canExport==='function'&&ctx.notebook===notebook&&ctx.explorerId===explorerId&&ctx.isActive===isActive&&ctx.canExport===canExport&&notebook()===state&&explorerId()===owner&&isActive()===true&&root.isConnected&&document.querySelector('[data-writing-root]')===root&&unchanged(rootChain)&&route==='#desk/writing'&&location.hash===route&&own(state,'writingDesk')===rootPresent&&state.writingDesk===ownedRoot&&state.writingDesk?.currentId===current&&JSON.stringify(state.writingDesk)===rootBytes&&core.writingView(state).record===ownedRecord&&ownedRecord?.source===ownedSource&&ownedRecord?.work===ownedWork;}catch{return false;}};
 const bound=new Set(),retired=new WeakSet();
 const retire=records=>{for(const record of records)for(const removed of record.removedNodes)for(const el of bound)if(removed===el||removed.contains?.(el))retired.add(el);if(retired.has(root)||!root.isConnected)observer.disconnect();};
 const observer=new MutationObserver(retire);observer.observe(document,{childList:true,subtree:true});
 const attached=el=>{retire(observer.takeRecords());return !retired.has(el)&&!retired.has(root)&&owned()&&el?.isConnected&&root.contains(el)&&parents.has(el)&&unchanged(parents.get(el));};
 const live=el=>attached(el)&&!el.disabled&&visible(el);
 const guard=el=>{bound.add(el);parents.set(el,chain(el));for(const type of ['click','input','change','toggle','keydown','focusin'])el.addEventListener(type,event=>{if(!live(el)){event.preventDefault();event.stopImmediatePropagation();}},{capture:true});};
 guard(root);root.querySelectorAll('button,a,details,summary,select,[data-speak]').forEach(guard);
 const stop=()=>{ctx.stopSpeech?.();ctx.stopSound?.();};
 root.querySelectorAll('summary').forEach(el=>el.addEventListener('click',()=>{if(live(el))stop();}));
 const status=(message,focus=false)=>{const el=root.querySelector('#writing-status');if(el){el.textContent=message;if(focus)el.focus();}};
 const persistence=()=>{const saved=ctx.save?.();return saved?.enabled===false?'This draft is in this session. Download Notes before leaving.':saved?.ok===false?'This draft is in this session but could not be saved on this device. Download Notes.':'';};
 const panels=()=>{v.panels=[...root.querySelectorAll('details[data-writing-panel][open]')].filter(attached).map(d=>d.dataset.writingPanel);};
 const redraw=(message='',focus='')=>{panels();stop();ctx.render?.();const next=document.querySelector('[data-writing-root]');if(next){const el=next.querySelector('#writing-status');if(el)el.textContent=message;const target=focus&&(Array.isArray(focus)?focus:[focus]).map(x=>next.querySelector(x)).find(el=>el&&!el.disabled&&visible(el));if(target){target.focus();if(target.getBoundingClientRect().top<0||target.getBoundingClientRect().bottom>innerHeight)target.scrollIntoView({block:'center'});}}};
 root.querySelector('[data-writing-panel=summary-whole]')?.addEventListener('toggle',event=>{const el=event.currentTarget;if(!live(el))return;const open=el.open;if(open!==v.panels.includes('summary-whole')){stop();redraw('',"[data-writing-panel=summary-whole] summary");}});
 const options={canExport:ctx.canExport};
 root.querySelectorAll('[data-writing-reference],[data-writing-card]').forEach(el=>el.addEventListener('click',()=>{
  if(!live(el)||el.closest('details:not([open])'))return;
  const record=core.writingView(state).record;if(!record)return;
  let card,lineIds=[],label='this draft';
  if(el.hasAttribute('data-writing-reference')){
   const scope=el.dataset.writingReferenceScope,work=scope==='current'?record.work:record[scope==='first'?'firstKept':'latestKept']?.work;
   if(!work||!core.writingPreview(record.source,work).some(b=>b.noteIds?.includes(el.dataset.writingReference)))return;
   const result=core.writingReferences(record.source,el.dataset.writingReference),ref=result.status==='ready'&&result.refs[Number(el.dataset.writingReferenceIndex)];if(!ref)return;
   card=ref.card;lineIds=ref.lineIds;label=scope==='first'?'the first kept version':scope==='latest'?'the latest kept version':'this draft';
  }else card=core.writingResearchCards(record.source).find(c=>c.id===el.dataset.writingCard);
  if(!card)return;
  const returnSelector=el.hasAttribute('data-writing-reference')?`[data-writing-reference='${CSS.escape(el.dataset.writingReference)}'][data-writing-reference-scope='${CSS.escape(el.dataset.writingReferenceScope)}'][data-writing-reference-index='${Number(el.dataset.writingReferenceIndex)}']`:`[data-writing-card='${CSS.escape(el.dataset.writingCard)}']`;
  v.inspector={cardId:card.id,lineIds,label,returnSelector};
  redraw('','#writing-source-title');
 }));
 const act=(el,fn,message='',focus='')=>{if(!live(el))return false;stop();const result=fn();if(!result.ok){status(core.writingView(state).record?.source.bench==='summary'&&core.writingSummaryStudy(core.writingView(state).record.source).status!=='ready'?summaryCopy.checkUnavailable:errors[result.error]||errors.unavailable,true);return false;}adopt();const saved=result.changed===false?'':persistence();redraw([result.changed===false?'Your draft is unchanged.':message,saved].filter(Boolean).join(' '),focus);return true;};
 root.querySelectorAll('[data-writing-summary-turn],[data-writing-summary-nav],[data-writing-summary-sentence]').forEach(el=>el.addEventListener('click',()=>{
  if(!live(el))return;const record=core.writingView(state).record;if(!record||core.writingSummaryStudy(record.source).status!=='ready')return;stop();
  if(el.dataset.writingSummaryTurn){v.summaryTurn=el.dataset.writingSummaryTurn;return redraw('','#writing-summary-turn-title');}
  if(el.dataset.writingSummarySentence){v.sentence=record.source.parts.findIndex(p=>p.id===el.dataset.writingSummarySentence);v.selected=el.dataset.writingSummarySentence;v.summaryTurn='choose';return redraw('','#writing-move-tools');}
  const nav=el.dataset.writingSummaryNav,[kind,direction]=nav.split('-'),key={story:'storyPage',sentence:'sentence',example:'examplePage',comparison:'comparisonPage'}[kind];if(!key)return;
  v[key]+=direction==='prev'?-1:1;if(kind==='sentence')v.selected=record.source.parts[v.sentence]?.id||'';
  redraw('',[`[data-writing-summary-nav='${nav}']:not(:disabled)`,`[data-writing-summary-nav='${kind}-${direction==='prev'?'next':'prev'}']:not(:disabled)`]);
 }));
 root.querySelectorAll('[data-writing-open]').forEach(el=>el.addEventListener('click',()=>{if(!live(el))return;act(el,()=>core.openWritingTask(state,el.dataset.writingOpen,options),'Your draft is waiting.',['#writing-summary-turn-title','#writing-task-title']);}));
 root.querySelectorAll('[data-writing-other-reader]').forEach(el=>el.addEventListener('click',()=>{if(!live(el)||el.disabled)return;const target=core.writingOtherReader(state,core.writingView(state).record?.source);if(target.status!=='ready')return;act(el,()=>core.openWritingTask(state,target.taskId,options),'The other reader’s draft is here.','#writing-task-title');}));
 root.querySelectorAll('[data-writing-bench]').forEach(el=>el.addEventListener('click',()=>{if(!live(el))return;stop();v.bench=el.dataset.writingBench;redraw('',`[data-writing-bench='${v.bench}']`);}));
 root.querySelectorAll('[data-writing-strip]').forEach(el=>el.addEventListener('click',()=>{if(!live(el))return;stop();v.selected=el.dataset.writingStrip;redraw('','#writing-move-tools');}));
 root.querySelectorAll('[data-writing-destination]').forEach(el=>el.addEventListener('click',()=>{const key=v.selected;if(!key)return;const record=core.writingView(state).record,summary=record?.source.bench==='summary',label=record?.source.choices.find(c=>c.id===el.dataset.writingDestination)?.text;act(el,()=>core.setWritingMaterial(state,{strip:key,heading:el.dataset.writingDestination},options),summary?`Sentence moved to ${label}.`:'The strip moved.',summary?`[data-writing-destination='${el.dataset.writingDestination}']`:`[data-writing-strip='${key}']`);}));
 root.querySelectorAll('[data-writing-move]').forEach(el=>el.addEventListener('click',()=>{const id=el.dataset.writingMove,d=Number(el.dataset.writingDirection);act(el,()=>core.setWritingMaterial(state,{part:id,direction:d},options),core.writingView(state).record?.source.bench==='point-quote'?'Sentence moved.':'Paragraph moved.',[`[data-writing-move='${id}'][data-writing-direction='${d}']:not(:disabled)`,`[data-writing-move='${id}']:not(:disabled)`]);}));
 root.querySelectorAll('[data-writing-boundary]').forEach(el=>el.addEventListener('click',()=>{const id=el.dataset.writingBoundary,r=core.writingView(state).record;act(el,()=>core.setWritingMaterial(state,{boundary:r?.work.boundary===id?null:id},options),'Paragraph break changed.',`[data-writing-boundary='${id}']`);}));
 root.querySelectorAll('[data-writing-tap]').forEach(el=>el.addEventListener('click',()=>{const id=el.dataset.writingTap;act(el,()=>core.setWritingMaterial(state,{tap:id},options),'',`[data-writing-tap='${id}']`);}));
 root.querySelectorAll('[data-writing-choice]').forEach(el=>el.addEventListener('click',()=>{const id=el.dataset.writingChoice;act(el,()=>core.setWritingMaterial(state,{choice:id},options),'Choice kept in your draft.',`[data-writing-choice='${id}']`);}));
 root.querySelectorAll('[data-writing-action]').forEach(el=>el.addEventListener('click',()=>{
  if(!live(el))return;stop();const action=el.dataset.writingAction;
  if(action==='choose'){v.panels=[...new Set([...v.panels,'shelf'])];const shelf=root.querySelector('[data-writing-panel=shelf]');if(shelf)shelf.open=true;return redraw('Choose another draft. Your earlier work stays in Notes.',"[data-writing-bench='paragraphs']");}
  if(action==='close-source'){
   const selector=v.inspector?.returnSelector;v.inspector=null;redraw();const next=document.querySelector('[data-writing-root]');const origin=selector&&next?.querySelector(selector);const target=origin&&!origin.disabled&&visible(origin)?origin:next?.querySelector('#writing-task-title');target?.focus();target?.scrollIntoView({block:'nearest'});return;
  }
  if(action==='summary')return act(el,()=>core.openWritingTask(state,'summary-knock',options),'Your story is ready.',['#writing-summary-turn-title','#writing-task-title']);
  if(action==='quote')return act(el,()=>core.openWritingTask(state,'quote-build',options),"Dot's sentences are ready to move.",'#writing-task-title');
  if(action==='quote-return'){
   const target=core.writingQuoteReturn(state);if(!target||!act(el,()=>core.openWritingTask(state,target.id,options),'Your kept paragraph is here.'))return;
   if(notebook()!==state||explorerId()!==owner||isActive()!==true||location.hash!==route||state.writingDesk!==ownedRoot||state.writingDesk?.currentId!==target.id)return;
   const next=document.querySelector('[data-writing-root]'),versions=next?.querySelector('[data-writing-panel=versions]');if(!versions)return;
   const view=local(state,owner);view.panels=[...new Set([...view.panels,'versions'])];versions.open=true;
   const summary=versions.querySelector(':scope > summary');summary?.focus();summary?.scrollIntoView({block:'nearest'});return;
  }
  if(action==='quote-source'){
   const record=core.writingView(state).record;if(record?.source.bench!=='point-quote')return;const cards=core.writingResearchCards(record.source);
   if(cards.length===1){v.inspector={cardId:cards[0].id,lineIds:[],label:'this draft',returnSelector:"[data-writing-action='quote-source']"};return redraw('','#writing-source-title');}
   const list=root.querySelector('[data-writing-panel=sources]');if(list)list.open=true;v.panels=[...new Set([...v.panels,'sources'])];return redraw('',["[data-writing-panel=sources] [data-writing-card]","[data-writing-panel=sources] summary"]);
  }
  if(action==='revision')return act(el,()=>core.openWritingTask(state,'pencil-notice',options),'Your notice is here.','#writing-task-title');
  if(action==='research'||action==='research-return')return act(el,()=>core.openWritingTask(state,'research-organise',options),'Your source-linked notes are here.','#writing-task-title');
  if(action==='clear-taps')return act(el,()=>core.setWritingMaterial(state,{clear:true},options),'Your taps are cleared.',"[data-writing-tap]");
  if(action==='teaching-prev'||action==='teaching-next'){if(el.closest('details:not([open])'))return;const r=core.writingView(state).record;if(!['holding','research','revision'].includes(r?.source.bench))return;v.teachingStep=Math.max(0,Math.min(Math.max(0,r.source.teach.length-2),v.teachingStep+(action==='teaching-next'?1:-1)));return redraw('',[`[data-writing-action='${action}']:not(:disabled)`,`[data-writing-action='${action==='teaching-next'?'teaching-prev':'teaching-next'}']:not(:disabled)`]);}
  if(action==='start')return act(el,()=>core.openWritingTask(state,'bakery',options),'','#writing-task-title');
  if(action==='check')return act(el,()=>core.checkWritingTask(state,options),'','#writing-feedback');
  if(action==='keep')return act(el,()=>core.keepWritingTask(state,options),'This version is in your notebook.','#writing-status');
  if(action==='next'){return act(el,()=>core.nextWritingTask(state,options),'Your earlier draft is waiting.',['#writing-summary-turn-title','#writing-task-title']);}
  if(action==='put-back')return act(el,()=>core.setWritingMaterial(state,{strip:v.selected,heading:null},options),core.writingView(state).record?.source.bench==='summary'?'The sentence is waiting again.':'The strip is waiting again.',core.writingView(state).record?.source.bench==='summary'?["[data-writing-destination]","[data-writing-summary-nav='sentence-next']:not(:disabled)"]:`[data-writing-strip='${v.selected}']`);
  if(['hint','example','together'].includes(action))return act(el,()=>core.showWritingHelp(state,action,options),action==='hint'?'A hint is below.':action==='example'?'A separate example is below.':'Read this draft together.',action==='hint'?'#writing-hint':action==='example'?'#writing-example':`[data-writing-action='${action}']`);
 }));
 root.addEventListener('click',event=>{
  const el=event.target.closest('[data-speak]');if(!el||!root.contains(el))return;
  if(!live(el)){event.preventDefault();event.stopImmediatePropagation();return;}
  if(core.writingView(state).record){const result=core.showWritingHelp(state,'narration',options);if(!result.ok){event.preventDefault();event.stopImmediatePropagation();status(errors[result.error]||errors.unavailable,true);return;}adopt();if(result.changed!==false){const message=persistence();if(message)status(message);}}
  el.dataset.speak=[...root.querySelectorAll('[data-writing-read]')].filter(n=>n.closest('.wt-work,.wt-reader,.wt-arrival,[data-writing-panel=teaching],[data-writing-panel=help],.wt-source-inspector')&&!n.closest('details:not([open]),[hidden]')&&n.getClientRects().length>0).map(n=>{const copy=n.cloneNode(true);copy.querySelectorAll('[aria-hidden=true]').forEach(el=>el.remove());return copy.textContent.trim();}).join(' ');
 },{capture:true});
 root.querySelectorAll('a').forEach(el=>el.addEventListener('click',e=>{if(!live(el))e.preventDefault();else stop();}));
}
