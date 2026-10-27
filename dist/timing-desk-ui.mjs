import * as C from './timing-desk-core.mjs';
import {hearButton,stopSpeech} from './play-media.mjs';

const own=(x,k)=>x!==null&&typeof x==='object'&&Object.hasOwn(x,k);
const get=(x,k,f='')=>own(x,k)?x[k]:f;
const list=x=>Array.isArray(x)?x:[];
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const b=(a,t)=>'<button type="button" class="secondary" '+a+'>'+esc(t)+'</button>';
const p=(t,c='')=>'<p data-timing-read'+(c?' class="'+esc(c)+'"':'')+'>'+esc(t)+'</p>';
const h=(t,n=3)=>'<h'+n+' data-timing-read>'+esc(t)+'</h'+n+'>';
const retained=t=>'<p class="timing-retained" data-timing-unreadable>'+esc(t)+': this saved item cannot be read here. Its original data stays in your notes.</p>';
const openList=(w,key)=>!own(w,key)?[]:Array.isArray(w[key])&&w[key].every(x=>typeof x==='string')?w[key]:null;
const activeTask=(w,page)=>['journeys','rates','record'].includes(page.role)&&(page.role!=='record'||get(w,'recordMode','numbers')==='numbers')?w.source.tasks.find(t=>t.pageId===page.id&&t.id===get(w.tasks,page.id)):null;
const latestFor=(w,id)=>w.checks.filter(c=>c&&typeof c==='object'&&c.taskId===id).at(-1);
const q=v=>C.formatTimingNumber(v);
const minutes=v=>String(Math.floor(v/60)).padStart(2,'0')+':'+String(v%60).padStart(2,'0');
const hours=v=>q({n:v,d:60});
const unit=(s,key)=>get(s.units,key,key);

function choose(items,current,attr,label,text=x=>x.title||x.prompt||x.text){
 const i=items.findIndex(x=>x.id===current);
 return '<nav class="timing-chooser" aria-label="'+esc(label)+'"><label>'+esc(label)+'<select data-timing-'+attr+'><option value="" disabled'+(i<0?' selected':'')+'>Choose</option>'+items.map(x=>'<option value="'+esc(x.id)+'"'+(x.id===current?' selected':'')+'>'+esc(text(x))+'</option>').join('')+'</select></label><div class="timing-actions">'+b('data-timing-'+attr+'-go="'+esc(items[i-1]?.id||'')+'"'+(i<=0?' disabled':''),'Previous '+(attr==='task'?'question':attr==='claim'?'claim':'part'))+b('data-timing-'+attr+'-go="'+esc(items[i+1]?.id||'')+'"'+(i<0||i===items.length-1?' disabled':''),'Next '+(attr==='task'?'question':attr==='claim'?'claim':'part'))+'</div></nav>';
}
function helpButton(w,id,label){
 return own(w.source.help,id)?b('data-timing-help="'+esc(id)+'"'+(openList(w,'helpOpen')===null?' disabled':''),label):'';
}
function helpers(w,ids){
 const opened=openList(w,'helpOpen');
 if(opened===null)return retained('Earlier help view');
 return [...new Set(ids)].filter(id=>opened.includes(id)&&own(w.source.help,id)).map(id=>'<section class="timing-help">'+h(w.source.help[id].title,4)+p(w.source.help[id].text)+b('data-timing-close-help="'+esc(id)+'"','Close this help')+'</section>').join('');
}
function scenarioTable(s,rows=s.scenarios){
 return '<div class="timing-table" data-timing-read><table><caption>Supplied journey assumptions</caption><thead><tr><th>Card</th><th>Start</th><th>Water duration</th><th>Message duration</th></tr></thead><tbody>'+rows.map(r=>'<tr><th>'+esc(r.title)+'</th><td>'+minutes(r.start.minute)+', Same day</td><td>'+esc(hours(r.waterMinutes))+' hours</td><td>'+esc(hours(r.messageMinutes))+' hours</td></tr>').join('')+'</tbody></table></div>'+p(get(s.labels,'journeyCaption'));
}
function recordTable(r){
 return '<div class="timing-table" data-timing-read><table><caption>'+esc(r.title)+'</caption><thead><tr><th>Entry</th><th>Duration</th><th>Date</th></tr></thead><tbody>'+r.entries.map(e=>'<tr><th>'+esc(e.id)+'</th><td>'+esc(q(e.hours))+' hours</td><td>Not given</td></tr>').join('')+'</tbody></table></div>'+p(r.selectionNote)+p(r.unknowns);
}
function journeyLine(w,t){
 const r=w.source.scenarios.find(r=>list(t?.contextRefs).includes(r.id));
 if(!r)return '';
 const end=Math.max(r.waterMinutes,r.messageMinutes,60),span=Math.max(end,Math.ceil((1440-r.start.minute)/60)*60>540?end:1440-r.start.minute);
 const x=n=>30+260*n/span,mid=1440-r.start.minute;
 const ticks=[...new Set([0,...Array.from({length:Math.floor(span/60)},(_,i)=>(i+1)*60),span])].filter((n,i,a)=>i===0||n-a[i-1]>=50);
 const midnight=mid<=span;
 return '<figure class="timing-journeys"><svg viewBox="0 0 320 184" role="img" aria-label="Two supplied journey durations, counted from the same start"><title>Two journeys from the same start</title>'+ (midnight?'<rect class="timing-night" x="'+x(mid)+'" y="25" width="'+(300-x(mid))+'" height="112"/><line class="timing-midnight" x1="'+x(mid)+'" x2="'+x(mid)+'" y1="21" y2="139"/>':'')+'<line class="timing-axis" x1="30" x2="290" y1="138" y2="138"/>'+ticks.filter((_,i)=>i%2===0||i===ticks.length-1).map(n=>'<line class="timing-axis" x1="'+x(n)+'" x2="'+x(n)+'" y1="135" y2="143"/><text x="'+x(n)+'" y="164" text-anchor="middle">'+esc(hours(n))+'</text>').join('')+'<line class="timing-water-line" x1="30" x2="'+x(r.waterMinutes)+'" y1="57" y2="57"/><circle class="timing-water-dot" cx="'+x(r.waterMinutes)+'" cy="57" r="6"/><line class="timing-message-line" x1="30" x2="'+x(r.messageMinutes)+'" y1="108" y2="108"/><circle class="timing-message-dot" cx="'+x(r.messageMinutes)+'" cy="108" r="6"/><text x="30" y="40">Model water arrival</text><text x="30" y="91">Message arrival</text></svg><figcaption>'+p(r.title)+p('Journey starts: '+minutes(r.start.minute)+', Same day. Both leave at the same starting point in time.')+p('Hours since the start. Blue is the assumed water journey; purple is the message journey.'+(midnight?' The shaded area begins at midnight: the next day.':''))+'</figcaption></figure>';
}
function rateModel(definition,stageId,controls=false){
 if(!C.validTimingModel(definition))return retained('Earlier rate model');
 const at=definition.stages.findIndex(x=>x.id===stageId);
 if(at<0)return retained('Earlier model stage');
 const shown=definition.stages.slice(0,at+1),maxH=Math.max(1,...definition.stages.map(x=>x.hours.n/x.hours.d)),maxD=Math.max(1,...definition.stages.map(x=>x.distance.n/x.distance.d));
 const x=v=>38+244*(v.hours.n/v.hours.d)/maxH,y=v=>150-115*(v.distance.n/v.distance.d)/maxD;
 return '<section class="timing-model">'+h(definition.title)+ '<svg viewBox="0 0 320 196" role="img" aria-label="Displayed constant-rate points"><title>Hours and distance</title><line class="timing-axis" x1="38" y1="150" x2="282" y2="150"/><line class="timing-axis" x1="38" y1="150" x2="38" y2="27"/><polyline class="timing-rate-line" points="'+shown.map(v=>x(v)+','+y(v)).join(' ')+'"/>'+shown.map(v=>'<circle class="timing-water-dot" cx="'+x(v)+'" cy="'+y(v)+'" r="5"/>').join('')+'<text x="160" y="184" text-anchor="middle">Hours</text><text x="38" y="18">Kilometers</text><text x="30" y="165" text-anchor="end">0</text><text x="282" y="165" text-anchor="middle">'+esc(q(definition.stages.at(-1).hours))+'</text></svg><div class="timing-table" data-timing-read><table><caption>Hours and kilometers shown so far</caption><thead><tr><th><abbr title="Hours">h</abbr></th><th><abbr title="Kilometers">km</abbr></th><th>Equal groups</th></tr></thead><tbody>'+shown.map(v=>'<tr><td>'+esc(q(v.hours))+'</td><td>'+esc(q(v.distance))+'</td><td>'+esc(q(v.hours))+' × '+esc(q(definition.rate))+' = '+esc(q(v.distance))+'</td></tr>').join('')+'</tbody></table></div>'+p(shown.at(-1).text)+(controls?'<div class="timing-actions">'+b('data-timing-model="next"'+(at===definition.stages.length-1?' disabled':''),'Next hour')+b('data-timing-model="reset"','Start the line again')+'</div>':'')+'</section>';
}
function teaching(w,page){
 const l=get(w.learn,page.id),g=page.guidedFor;
 if(!C.validTimingLearn(l,page))return retained('Earlier teaching card');
 const active=!g||(g.kind==='part'?w.partId===g.id:activeTask(w,page)?.id===g.id);
 return '<section class="timing-teaching">'+h('Learn this in small steps')+(l.folded?p('The teaching is folded. Earlier support stays recorded.'):page.learn.slice(0,l.count).map(x=>p(x.text)).join('')+(l.guided&&active?'<div class="timing-guided">'+h('Shown example · supported practice',4)+page.guided.map(x=>p(x.text)).join('')+'</div>':'')+(page.role==='rates'?rateModel(w.source.rateModel,w.modelStage,true):''))+'<div class="timing-actions">'+b('data-timing-fold="'+(!l.folded)+'"',l.folded?'Open the teaching again':'Fold the teaching')+(!l.folded&&l.count<page.learn.length?b('data-timing-learn="next"','Next idea'):'')+(page.guided.length&&active?b('data-timing-learn="guided"','Show the guided example'):'')+b('data-timing-learn="question"','Back to my question')+'</div></section>';
}
function task(w,page){
 const t=activeTask(w,page);
 if(!t)return w.source.tasks.some(x=>x.pageId===page.id)?retained('Current question'):'';
 const raw=get(w.answers,t.id),valid=!own(w.answers,t.id)||C.validTimingAnswer(raw,t),a=valid&&raw?raw:{fields:{},clocks:{},choiceId:''};
 const latest=latestFor(w,t.id),feedback=C.validTimingCheck(latest)&&C.validTimingAnswer(raw,t)&&JSON.stringify(latest.raw)===JSON.stringify(raw);
 return choose(w.source.tasks.filter(x=>x.pageId===page.id),t.id,'task','Choose a question')+journeyLine(w,t)+'<section class="timing-task"><h3 id="timing-question" tabindex="-1" data-timing-read>'+esc(t.prompt)+'</h3>'+p(t.context)+p('Supported practice','timing-caption')+(!valid?retained('Earlier response draft'):'')+'<fieldset'+(!valid?' disabled':'')+'><legend>Your response</legend>'+(t.kind==='choice'?'<label>Choose one sentence<select data-timing-answer="'+esc(t.id)+'"><option value="">Leave open</option>'+t.choices.map(c=>'<option value="'+esc(c.id)+'"'+(a.choiceId===c.id?' selected':'')+'>'+esc(c.text)+'</option>').join('')+'</select></label>':t.fields.map(f=>{const v=get(a.clocks,f.id,{}),id='timing-field-'+f.id;return '<div class="timing-field"><label for="'+esc(id)+'">'+esc(f.label)+(f.type==='number'?' ('+esc(unit(w.source,f.unit))+')':'')+'</label>'+(f.type==='clock'?'<input id="'+esc(id)+'" data-timing-clock="'+esc(f.id)+'" data-task="'+esc(t.id)+'" data-timing-draft inputmode="numeric" maxlength="40" value="'+esc(v.time)+'"><label>Which day?<select data-timing-day="'+esc(f.id)+'" data-task="'+esc(t.id)+'" data-timing-draft><option value="">Choose a day</option><option value="same"'+(v.day==='same'?' selected':'')+'>Same day</option><option value="next"'+(v.day==='next'?' selected':'')+'>Next day</option></select></label>':'<input id="'+esc(id)+'" data-timing-field="'+esc(f.id)+'" data-task="'+esc(t.id)+'" data-timing-draft inputmode="decimal" maxlength="40" value="'+esc(get(a.fields,f.id))+'">')+'<p class="timing-field-error" data-timing-error="'+esc(f.id)+'" aria-live="polite"></p></div>';}).join(''))+'</fieldset>'+p(t.kind==='choice'?get(w.source.labels,'choiceInstruction'):t.fields.some(f=>f.type==='clock')?get(w.source.labels,'clockInstruction'):get(w.source.labels,'numberInstruction'),'timing-caption')+'<div class="timing-actions">'+(valid?b('data-timing-check="'+esc(t.id)+'"','Check my working'):'')+helpButton(w,t.hintId,'A hint')+helpButton(w,t.exampleId,'A different example')+b('data-timing-skip="'+esc(t.id)+'"','Skip for now')+'</div>'+helpers(w,[t.hintId,t.exampleId,t.skipId])+'<section id="timing-result" tabindex="-1">'+(feedback?h('Latest checked response',4)+p(latest.outcome==='match'?'Matches the supplied working':'Different from the supplied working','timing-caption')+p(latest.feedback)+b('data-timing-open-response="'+esc(t.id)+'"','Original question and reply'):latest!==undefined&&!C.validTimingCheck(latest)?retained('Latest response'):p('No checked response is shown for this draft.'))+'</section></section>';
}
function claims(w){
 const c=w.source.claims.find(x=>x.id===w.claimId);
 if(!c)return retained('Current claim');
 const latest=w.claimHistory.filter(x=>x&&typeof x==='object'&&x.cardId===c.id).at(-1);
 return choose(w.source.claims,c.id,'claim','Choose a claim')+h('What does this sheet support?')+p(get(w.source.labels,'claimsIntroduction'))+'<section class="timing-claim"><h3 id="timing-question" tabindex="-1" data-timing-read>'+esc(c.text)+'</h3><div class="timing-trays">'+w.source.trays.map(t=>b('data-timing-tray="'+esc(t.id)+'" data-card="'+esc(c.id)+'" aria-pressed="'+(get(w.claims,c.id)===t.id)+'"',t.label)).join('')+'</div>'+(latest===undefined?'':C.validTimingClaim(latest)?p(latest.reply):retained('Latest claim reply'))+'<div class="timing-actions">'+helpButton(w,c.hintId,'A hint')+helpButton(w,c.exampleId,'A different example')+b('data-timing-leave-claim="'+esc(c.id)+'"','Leave this card open')+'</div>'+helpers(w,[c.hintId,c.exampleId,c.skipId])+b('data-timing-note-link','Take this question to my note')+'</section>';
}
function writing(w){
 const part=w.source.parts.find(x=>x.id===w.partId);
 if(!part)return retained('Current note part');
 const raw=get(w.writing,part.id),valid=!own(w.writing,part.id)||C.validTimingPart(raw,part),a=valid&&raw?raw:{mode:'own',own:'',choiceId:''},selected=part.options.find(x=>x.id===a.choiceId);
 return choose(w.source.parts,part.id,'part','Choose a note part')+'<section class="timing-writing"><h3 id="timing-question" tabindex="-1" data-timing-read>'+esc(part.title)+'</h3>'+p(part.prompt)+(!valid?retained('Earlier writing draft'):'')+'<fieldset'+(!valid?' disabled':'')+'><legend>Both versions stay available</legend><div class="timing-actions">'+['own','supplied'].map(mode=>b('data-timing-mode="'+mode+'" data-part="'+esc(part.id)+'" aria-pressed="'+(a.mode===mode)+'"',mode==='own'?'My writing draft':'Supplied words')).join('')+'</div><label>Choose supplied words<select data-timing-writing-choice="'+esc(part.id)+'"><option value="">No supplied words chosen</option>'+part.options.map(x=>'<option value="'+esc(x.id)+'"'+(a.choiceId===x.id?' selected':'')+'>'+esc(x.label)+'</option>').join('')+'</select></label>'+(selected?'<blockquote data-timing-read>'+esc(selected.text)+'</blockquote>'+p(selected.reply):'')+b('data-timing-starter="'+esc(part.id)+'"'+(!selected?' disabled':''),'Use as a starting draft')+'<label for="timing-own-'+esc(part.id)+'">My words for this part<textarea id="timing-own-'+esc(part.id)+'" data-timing-own="'+esc(part.id)+'" data-timing-draft maxlength="1600" rows="5">\n'+esc(a.own)+'</textarea></label>'+(a.starterUsed?p(get(w.source.labels,'starterReceipt'),'timing-caption'):'')+p(a.mode==='own'?part.ownReply:'The selected supplied version will appear in your kept note.','timing-caption')+'</fieldset><div class="timing-actions">'+helpButton(w,part.helpId,'Help with this part')+helpButton(w,part.exampleId,'A different note example')+b('data-timing-leave-part="'+esc(part.id)+'"','Leave this part open')+'</div>'+helpers(w,[part.helpId,part.exampleId,part.skipId])+'</section>'+p('A note can be unfinished. The version selected for each part will be kept, with any supplied-word support marked.')+b('data-timing-keep','Keep this provisional note')+'<section id="timing-keep-result" tabindex="-1">'+(own(w,'kept')?C.validTimingKeep(w.kept)?p(get(w.source.labels,'keepConfirmation'))+p(w.kept.closing):retained('Latest kept note'):p(get(w.source.labels,'noKeep')))+'</section>';
}
function sources(w){
 const opened=openList(w,'sourceOpen'),s=w.source;
 return '<section class="timing-sources">'+h(get(s.labels,'drawerTitle','Where these numbers come from'))+p(get(s.labels,'drawerIntroduction'))+(opened===null?retained('Earlier sheet view'):s.sources.map(card=>'<section class="timing-source"><h4>'+esc(card.title)+'</h4>'+b('data-timing-source="'+esc(card.id)+'" data-open="'+!opened.includes(card.id)+'" aria-expanded="'+opened.includes(card.id)+'"',opened.includes(card.id)?'Close this sheet':'Open this sheet')+(opened.includes(card.id)?p(card.text)+p(card.limit)+(card.id==='journeys'?scenarioTable(s):card.id==='record'?recordTable(s.records):''):'')+'</section>').join('')+(opened.length?b('data-timing-close-sources','Close the sheets'):''))+'</section>';
}
function originalResponse(c){
 if(!C.validTimingCheck(c))return retained('Original response');
 const s=c.source,t=s.task;
 const raw=t.kind==='choice'?p(t.choices.find(x=>x.id===c.raw.choiceId)?.text||'Left open'):t.fields.map(f=>p(f.label+': '+(f.type==='clock'?get(get(c.raw.clocks,f.id),'time')+', '+(get(get(c.raw.clocks,f.id),'day')==='next'?'Next day':'Same day'):get(c.raw.fields,f.id)+' '+unit(s,f.unit)))).join('');
 return '<article class="timing-original">'+h(t.prompt)+p(t.context)+raw+p(c.feedback)+p('Supported practice · original question and reply','timing-caption')+h('Earlier teaching and help kept with this response',4)+Object.values(s.shown).map(x=>p(x.text)).join('')+Object.entries(s.help).filter(([id])=>!/^(audio|together)-/.test(id)).map(([,x])=>h(x.title,4)+p(x.text)).join('')+list(s.sources).map(x=>h(x.title,4)+p(x.text)+p(x.limit)).join('')+(s.scenarios.length?scenarioTable(s,s.scenarios):'')+(s.records?recordTable(s.records):'')+(s.rateModel?rateModel(s.rateModel.definition,s.rateModel.stageId):'')+'</article>';
}
function history(w){
 const r=get(w,'review',{kind:'closed'}),valid=r&&(['closed'].includes(r.kind)||['response','note'].includes(r.kind)&&['first','latest'].includes(r.version)&&typeof (r.kind==='response'?r.taskId:r.partId)==='string');
 if(!valid)return retained('Earlier review view');
 const ids=[...new Set([...Object.keys(w.firstChecks),...w.checks.filter(x=>x&&typeof x==='object'&&typeof x.taskId==='string').map(x=>x.taskId)])];
 let html='<section class="timing-history">'+h('Kept work')+p('Open one original response or one part of a kept note. Complete records also stay in your download.','timing-caption');
 if(ids.length)html+='<label>Choose an earlier question<select data-timing-history-task>'+ids.map(id=>{const c=get(w.firstChecks,id)||latestFor(w,id);return '<option value="'+esc(id)+'"'+(r.kind==='response'&&r.taskId===id?' selected':'')+'>'+esc(C.validTimingCheck(c)?c.source.task.prompt:'Retained response')+'</option>';}).join('')+'</select></label><div class="timing-actions">'+b('data-timing-history="first"','Show first response')+b('data-timing-history="latest"','Show latest response')+'</div>';
 const keeps=[['first','First kept note',w.firstKept],['latest','Latest kept note',w.kept]].filter(x=>x[2]!==undefined);
 if(keeps.length){const version=r.kind==='note'?r.version:keeps.at(-1)[0],k=version==='first'?w.firstKept:w.kept;html+='<label>Choose kept version<select data-timing-history-version>'+keeps.map(x=>'<option value="'+x[0]+'"'+(version===x[0]?' selected':'')+'>'+x[1]+'</option>').join('')+'</select></label>'+ (C.validTimingKeep(k)?'<label>Choose a kept part<select data-timing-history-part>'+k.renderedParts.map(x=>'<option value="'+esc(x.id)+'"'+(r.kind==='note'&&r.partId===x.id?' selected':'')+'>'+esc(x.title)+'</option>').join('')+'</select></label>'+b('data-timing-open-note','Open a kept note'):retained('Selected kept note'));}
 if(r.kind!=='closed'){html+=b('data-timing-close-review',r.kind==='note'?'Close the kept note':'Close response history')+'<div class="timing-review-body" tabindex="-1">'+p('These are the original questions, words and replies kept at the time. A later wording change has not rechecked them.');if(r.kind==='response')html+=originalResponse(r.version==='first'?get(w.firstChecks,r.taskId):latestFor(w,r.taskId));else{const k=r.version==='first'?w.firstKept:w.kept,part=C.validTimingKeep(k)?k.renderedParts.find(x=>x.id===r.partId):null;html+=!part?retained('Kept note part'):h(part.title)+(part.unreadable?retained('Kept writing'):p(part.text||'Left open'))+p(part.mode==='supplied'?'Supplied words':'My writing draft','timing-caption')+(part.starterUsed?p('Supplied words used as a starting draft','timing-caption'):'');}html+='</div>';}
 return html+'</section>';
}
function visits(v){
 return '<details class="timing-visits"><summary>Choose a saved sheet</summary>'+v.visits.map(x=>x.readable?b('data-timing-resume="'+esc(x.id)+'" aria-pressed="'+(x.id===v.current)+'"',x.title):retained(x.title)).join('')+b('data-timing-start','Start a new timing sheet')+'</details><details class="timing-grownups"><summary>For a grown-up · saved work</summary><p>Each sheet keeps its original sources, supported checks, ungraded claims and both writing versions. Available teaching does not prove it was read. First and latest versions remain separate.</p><p>Up to 8 sheets, 40 checked responses and 24 claim selections per sheet are retained. The shared notes limit can refuse changes sooner. Nothing is evicted automatically.</p><label>Sheet to remove<select data-timing-remove-choice><option value="">Choose one sheet</option>'+v.visits.map(x=>'<option value="'+esc(x.id)+'">'+esc(x.title)+'</option>').join('')+'</select></label>'+b('data-timing-remove','Remove this sheet')+'<a href="#notes">Download saved notes</a></details>';
}
export const timingEntry=()=>'<p class="timing-entry"><a href="#learn/math/timing-desk">The message and the water</a> · compare two journeys and five copied times.</p>';
export const timingRefusal=()=>'<section class="timing-page"><h1>The message and the water</h1><h2>Earlier work is safe</h2><p>Newly shown support could not be kept within the notes limit. Download saved notes before making room.</p><a href="#notes">Download saved notes</a><a href="#desk">Back to the desk</a></section>';
export function timingPage(state){
 const v=C.timingView(state),w=v.work,s=w?.source||C.createTimingSource();
 const head='<div class="timing-page" data-timing-root><header><a href="#desk">Back to the desk</a><h1 data-timing-read>'+esc(s.title)+'</h1></header>';
 const foot='<p id="timing-status" role="status" aria-live="polite" tabindex="-1"></p><div data-timing-pending-actions hidden><p>There are unsaved words here. Stay to copy them, or restore the saved version before leaving.</p>'+b('data-timing-stay','Stay with these words')+b('data-timing-restore','Restore saved words')+'<a href="#notes" data-timing-download>Download saved notes</a></div><footer><a href="#desk">Back to the desk</a><a href="#pathways/math">Math paths</a><a href="#pathways/science">Science paths</a><a href="#learn/science/ledger">The ledger and the rain gauge</a><a href="#notes">My notes</a></footer></div>';
 if(v.status==='unavailable')return head+retained('Earlier timing format')+foot;
 if(!w)return head+'<h2 id="timing-heading" tabindex="-1">A look at later records</h2>'+p(s.preview)+p(s.introduction)+p(get(s.labels,'openParts'))+(v.status==='unreadable'?retained('Selected timing sheet'):'')+b('data-timing-start','Open this later-record preview')+visits(v)+foot;
 const page=s.pages.find(x=>x.id===w.pageId),mode=get(w,'recordMode','numbers');
 let content=head+p(s.notice,'timing-notice')+'<nav class="timing-pages" aria-label="Open parts">'+s.pages.map(x=>b('data-timing-page="'+esc(x.id)+'" aria-current="'+(x.id===page.id?'page':'false')+'"',x.title)).join('')+'</nav><h2 id="timing-heading" tabindex="-1" data-timing-read>'+esc(page.title)+'</h2>'+p(page.purpose)+hearButton('','Read this aloud').replace('data-speak-lang=','data-timing-audio="audio-'+esc(page.id)+'" data-speak-lang=')+helpButton(w,'together-'+page.id,'We read this together');
 if(page.role==='record')content+=recordTable(s.records)+'<div class="timing-actions">'+['numbers','claims'].map(x=>b('data-timing-record-mode="'+x+'" aria-pressed="'+(mode===x)+'"'+(!['numbers','claims'].includes(mode)?' disabled':''),x==='numbers'?'Work with the numbers':'Discuss a claim')).join('')+'</div>';
 content+=teaching(w,page)+(page.role==='note'?writing(w):page.role==='record'&&mode==='claims'?claims(w):task(w,page))+sources(w)+history(w)+ (page.role==='note'?s.connections.map(c=>'<details><summary>'+esc(c.title)+'</summary>'+p(c.text)+'<a href="'+esc(c.href)+'">'+esc(c.title)+'</a></details>').join(''):'')+visits(v)+foot;
 return content;
}
export function timingNotes(state){
 if(!own(state,'timingDesk'))return '';
 const v=C.timingView(state);
 return '<details class="panel timing-notes"><summary>The message and the water · local timing sheets</summary><p>Original supported responses, ungraded discussion and first/latest notes are retained separately. Open one original item at the timing desk.</p><a href="#learn/math/timing-desk">Review a timing sheet</a>'+v.visits.map(x=>{const w=v.root.visits[x.id];return '<section>'+h(x.title)+(!x.readable?retained('Timing sheet'):p('All checked responses are supported practice. First responses: '+Object.keys(w.firstChecks).length+'. Later responses stay in their original order; an unreadable latest item remains unreadable.')+p('First kept note: '+(own(w,'firstKept')?(C.validTimingKeep(w.firstKept)?'retained':'retained, unreadable'):'not yet kept')+'. Latest kept note: '+(own(w,'kept')?(C.validTimingKeep(w.kept)?'retained':'retained, unreadable'):'not yet kept')+'. Supplied words and original drafts remain distinct.'))+'</section>';}).join('')+'<details><summary>Exact saved timing work</summary><pre>'+esc(JSON.stringify(state.timingDesk,null,2))+'</pre></details></details>';
}
let removeGuards=()=>{},pendingNavigation=()=>false;
export const guardTimingNavigation=()=>pendingNavigation();
export function bindTiming(state,{save,render,focus,canExport,exposeFacts,explorerId,isActive}={}){
 removeGuards();removeGuards=()=>{};
 const root=document.querySelector('[data-timing-root]');if(!root)return;
 const owner=explorerId?.(),route=location.hash,o={canExport,exposeFacts},dirty=new Set(),saved=new Map([...root.querySelectorAll('[data-timing-draft]')].map(x=>[x,x.value]));
 let expected=C.timingView(state).work;
 const work=()=>C.timingView(state).work;
 const live=el=>root.isConnected&&el?.isConnected&&root.contains(el)&&document.querySelector('[data-timing-root]')===root&&location.hash===route&&explorerId?.()===owner&&(!isActive||isActive())&&work()===expected;
 const update=()=>{expected=work();};
 const say=(text,take=false)=>{const el=root.querySelector('#timing-status');if(el&&root.isConnected){el.textContent=text;if(take)el.focus();}};
 const message='There are unsaved words here. Stay to copy them, or restore the saved version before leaving.';
 const pending=()=>{const el=root.querySelector('[data-timing-pending-actions]');if(el)el.hidden=!dirty.size;};
 const fail=()=>say('This change could not be saved within the notes limit. Your saved work is unchanged. These unsaved words are still here to copy.',true);
 const redraw=(text='',target='#timing-heading')=>{stopSpeech();save?.();render?.();const next=document.querySelector('[data-timing-root]');const status=next?.querySelector('#timing-status');if(status)status.textContent=text;const el=next?.querySelector(target);if(el){el.focus();if(document.activeElement!==el)focus?.(target);}else focus?.('#timing-heading');};
 const act=(el,fn,text='',target='#timing-heading')=>{if(!live(el))return false;if(dirty.size){say(message,true);return false;}const result=fn();if(!result){fail();return false;}update();redraw(text,target);return true;};
 const on=(sel,fn)=>root.querySelectorAll(sel).forEach(el=>el.addEventListener('click',()=>{if(live(el))fn(el);}));
 on('[data-timing-start]',el=>act(el,()=>C.startTiming(state,o),'Timing sheet open. All four parts are available.'));
 on('[data-timing-resume]',el=>act(el,()=>C.resumeTiming(state,el.dataset.timingResume,o),'Original sheet resumed.'));
 on('[data-timing-page]',el=>act(el,()=>C.pageTiming(state,el.dataset.timingPage,o)));
 on('[data-timing-fold]',el=>act(el,()=>C.foldTiming(state,work().pageId,el.dataset.timingFold==='true',o)));
 on('[data-timing-learn]',el=>act(el,()=>C.learnTiming(state,work().pageId,el.dataset.timingLearn,o)));
 on('[data-timing-model]',el=>act(el,()=>C.modelTiming(state,el.dataset.timingModel,o),el.dataset.timingModel==='reset'?'The displayed line is back at zero. Earlier recorded support stays in your notes.':'Next hour shown.','[data-timing-model="next"]'));
 on('[data-timing-help]',el=>act(el,()=>C.helpTiming(state,el.dataset.timingHelp,o),'Requested support recorded before it was shown.','[data-timing-help="'+el.dataset.timingHelp+'"]'));
 on('[data-timing-close-help]',el=>act(el,()=>C.closeHelpTiming(state,el.dataset.timingCloseHelp,o)));
 on('[data-timing-source]',el=>act(el,()=>C.sourceTiming(state,el.dataset.timingSource,el.dataset.open==='true',o),'Source sheet view updated.','[data-timing-source="'+el.dataset.timingSource+'"]'));
 on('[data-timing-close-sources]',el=>act(el,()=>C.closeSourcesTiming(state,o),'Sheets closed. Earlier support stays recorded.'));
 on('[data-timing-record-mode]',el=>act(el,()=>C.recordModeTiming(state,el.dataset.timingRecordMode,o)));
 for(const type of ['task','claim','part']){
  const select=id=>type==='task'?C.taskTiming(state,work().pageId,id,o):type==='claim'?C.claimTiming(state,id,o):C.partTiming(state,id,o);
  root.querySelectorAll('[data-timing-'+type+']').forEach(el=>el.addEventListener('change',()=>{if(!live(el))return;const old=type==='task'?get(work().tasks,work().pageId):type==='claim'?work().claimId:work().partId;if(!act(el,()=>select(el.value),'','#timing-question'))el.value=old;}));
  on('[data-timing-'+type+'-go]',el=>act(el,()=>select(el.getAttribute('data-timing-'+type+'-go')),'','#timing-question'));
 }
 on('[data-timing-skip]',el=>act(el,()=>C.skipTiming(state,el.dataset.timingSkip,o),'Left open for another visit. Your draft stays here.','#timing-question'));
 on('[data-timing-tray]',el=>act(el,()=>C.assignTiming(state,el.dataset.card,el.dataset.timingTray,o),'Discussion choice kept. It has no score.','#timing-question'));
 on('[data-timing-leave-claim]',el=>act(el,()=>C.leaveClaimTiming(state,el.dataset.timingLeaveClaim,o),'This card stays open. No checked response was added.','#timing-question'));
 on('[data-timing-note-link]',el=>{const page=work().source.pages.find(p=>p.role==='note');if(page)act(el,()=>C.pageTiming(state,page.id,o));});
 on('[data-timing-mode]',el=>act(el,()=>C.writingModeTiming(state,el.dataset.part,el.dataset.timingMode,o),get(work().source.labels,'modeReceipt'),'#timing-question'));
 on('[data-timing-starter]',el=>{if(dirty.size)return say(message,true);const part=el.dataset.timingStarter,raw=get(work().writing,part),confirm=raw?.own?.length?window.confirm(get(work().source.labels,'starterConfirmation')):false;if(raw?.own?.length&&!confirm)return;act(el,()=>C.starterTiming(state,part,confirm,o),get(work().source.labels,'starterReceipt'),'#timing-own-'+part);});
 on('[data-timing-leave-part]',el=>act(el,()=>C.leavePartTiming(state,el.dataset.timingLeavePart,o),'This part can stay open. Both drafts remain.','#timing-question'));
 on('[data-timing-keep]',el=>act(el,()=>C.keepTiming(state,o),get(work().source.labels,'keepConfirmation'),'#timing-keep-result'));
 const selection=(selector,fn,previous)=>root.querySelectorAll(selector).forEach(el=>el.addEventListener('change',()=>{if(!live(el))return;const old=previous(el);if(!act(el,()=>fn(el),'','#timing-question'))el.value=old;}));
 selection('[data-timing-answer]',el=>C.choiceTiming(state,el.dataset.timingAnswer,el.value,o),el=>get(get(work().answers,el.dataset.timingAnswer,{}),'choiceId'));
 selection('[data-timing-writing-choice]',el=>C.suppliedTiming(state,el.dataset.timingWritingChoice,el.value,o),el=>get(get(work().writing,el.dataset.timingWritingChoice,{}),'choiceId'));
 const input=(el,fn)=>el.addEventListener(el.tagName==='SELECT'?'change':'input',()=>{if(!live(el))return;if(!fn(el.value)){dirty.add(el);el.setAttribute('aria-invalid','true');pending();say(message);return;}update();saved.set(el,el.value);dirty.delete(el);el.removeAttribute('aria-invalid');save?.();pending();say(dirty.size?message:'Words saved.');});
 root.querySelectorAll('[data-timing-field]').forEach(el=>input(el,raw=>C.answerTiming(state,el.dataset.task,el.dataset.timingField,raw,o)));
 root.querySelectorAll('[data-timing-clock],[data-timing-day]').forEach(el=>input(el,()=>{const field=el.dataset.timingClock||el.dataset.timingDay,clock=root.querySelector('[data-timing-clock="'+field+'"]'),day=root.querySelector('[data-timing-day="'+field+'"]');const result=C.clockTiming(state,el.dataset.task,field,clock.value,day.value,o);if(result)for(const paired of [clock,day]){saved.set(paired,paired.value);dirty.delete(paired);paired.removeAttribute('aria-invalid');}return result;}));
 root.querySelectorAll('[data-timing-own]').forEach(el=>input(el,raw=>C.writingTiming(state,el.dataset.timingOwn,raw,o)));
 on('[data-timing-check]',el=>{
  const t=work().source.tasks.find(t=>t.id===el.dataset.timingCheck),a=get(work().answers,t.id,{fields:{},clocks:{},choiceId:''});let invalid=false;
  root.querySelectorAll('[data-timing-error]').forEach(x=>x.textContent='');
  if(t.kind==='choice'){if(!a.choiceId)return say(get(work().source.labels,'choiceInvalid'),true);}
  else for(const f of t.fields){const clock=get(a.clocks,f.id,{}),bad=f.type==='clock'?C.parseTimingClock(clock.time,clock.day)===null:C.parseTimingNumber(get(a.fields,f.id))===null;if(bad){invalid=true;const text=get(work().source.labels,f.type==='clock'?'clockInvalid':'invalid','Enter a valid response before checking. This has not added a checked response.');const error=root.querySelector('[data-timing-error="'+f.id+'"]');if(error)error.textContent=text;}}
  if(invalid)return say('Check the marked response fields. This has not added a checked response.',true);
  if(work().checks.length>=40)return say('This sheet has reached its checked-response limit. Your draft remains. You can still read the sheets and keep a note.',true);
  act(el,()=>C.checkTiming(state,t.id,o),'Original response kept.','#timing-result');
 });
 on('[data-timing-open-response]',el=>act(el,()=>C.reviewTiming(state,{kind:'response',taskId:el.dataset.timingOpenResponse,version:'latest'},o),'Original response opened.','.timing-review-body'));
 on('[data-timing-history]',el=>{const id=root.querySelector('[data-timing-history-task]')?.value;if(id)act(el,()=>C.reviewTiming(state,{kind:'response',taskId:id,version:el.dataset.timingHistory},o),'Original response opened.','.timing-review-body');});
 on('[data-timing-open-note]',el=>{const version=root.querySelector('[data-timing-history-version]')?.value,partId=root.querySelector('[data-timing-history-part]')?.value;if(partId)act(el,()=>C.reviewTiming(state,{kind:'note',partId,version},o),'Kept part opened.','.timing-review-body');});
 root.querySelector('[data-timing-history-version]')?.addEventListener('change',function(){if(!live(this)||dirty.size)return;const k=this.value==='first'?work().firstKept:work().kept;if(C.validTimingKeep(k)&&k.renderedParts.length)act(this,()=>C.reviewTiming(state,{kind:'note',partId:k.renderedParts[0].id,version:this.value},o),'Kept version opened.','.timing-review-body');});
 on('[data-timing-close-review]',el=>act(el,()=>C.reviewTiming(state,{kind:'closed'},o),'Review closed.'));
 on('[data-timing-remove]',el=>{const id=root.querySelector('[data-timing-remove-choice]')?.value;if(!id)return say('Choose one sheet to remove.',true);if(!window.confirm("Remove this timing sheet from this explorer's notes? Other sheets stay. Download notes first if you want a copy."))return;act(el,()=>C.removeTimingVisit(state,id,true,o),'Selected sheet removed.');});
 on('[data-timing-stay]',()=>{say(message,true);root.querySelector('[aria-invalid="true"]')?.focus();});
 on('[data-timing-restore]',el=>{if(!live(el)||!window.confirm('Replace the unsaved words on this screen with their saved version?'))return;for(const field of dirty){field.value=saved.get(field)??'';field.removeAttribute('aria-invalid');}dirty.clear();pending();say('Last saved words restored.',true);});
 root.addEventListener('click',event=>{
  const el=event.target.closest?.('[data-speak]');if(!el)return;
  if(!live(el)||dirty.size||!el.dataset.timingAudio){event.preventDefault();event.stopImmediatePropagation();if(dirty.size)say(message,true);return;}
  if(!C.helpTiming(state,el.dataset.timingAudio,o)){event.preventDefault();event.stopImmediatePropagation();fail();return;}
  update();const words=[...root.querySelectorAll('[data-timing-read]')].map(x=>x.innerText).filter(Boolean);
  const current=work(),page=current.source.pages.find(x=>x.id===current.pageId),t=activeTask(current,page);
  if(t){const raw=get(current.answers,t.id);if(t.kind==='choice')words.push(...t.choices.map(x=>x.text));else if(raw&&C.validTimingAnswer(raw,t))words.push(...t.fields.map(f=>f.type==='clock'?f.label+': '+get(get(raw.clocks,f.id),'time')+', '+get(get(raw.clocks,f.id),'day'):f.label+': '+get(raw.fields,f.id)+' '+unit(current.source,f.unit)));}
  if(page.role==='note'){const part=current.source.parts.find(x=>x.id===current.partId),draft=part&&get(current.writing,part.id);if(draft&&C.validTimingPart(draft,part))words.push(draft.own);}
  el.dataset.speak=words.join('\n\n');save?.();
 },true);
 const guard=e=>{if(e.type==='keydown'&&!['Enter',' '].includes(e.key))return;if(!root.isConnected||explorerId?.()!==owner||!dirty.size)return;if(e.target?.closest?.('[data-timing-draft],[data-timing-restore],[data-timing-stay]'))return;if(e.target?.closest?.('button,a,input,select,summary')){e.preventDefault();e.stopImmediatePropagation();say(message,true);}};
 pendingNavigation=()=>{if(!root.isConnected||document.querySelector('[data-timing-root]')!==root||explorerId?.()!==owner||!dirty.size)return false;window.history.replaceState(null,'',route);stopSpeech();say(message,true);return true;};
 const leave=e=>{if(dirty.size&&root.isConnected&&explorerId?.()===owner){e.preventDefault();e.returnValue='';}};
 document.addEventListener('click',guard,true);document.addEventListener('keydown',guard,true);window.addEventListener('beforeunload',leave);
 removeGuards=()=>{document.removeEventListener('click',guard,true);document.removeEventListener('keydown',guard,true);window.removeEventListener('beforeunload',leave);pendingNavigation=()=>false;};
}
