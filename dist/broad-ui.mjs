import {areas} from './broad-content.mjs';
import {areaById,areaEvidence,broadDescribe,suggestActivity} from './broad-core.mjs';
export const escapeHtml = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const e=escapeHtml;
const title=(h,p)=>`<div class="page-heading"><a href="#home" class="back">← Back to the garden</a><h1>${h}</h1><p>${p}</p></div>`;
const faces=`<span class="friends" aria-hidden="true"><span>🦊</span><span>🐞</span></span>`;
const trailCount=s=>areas.filter(a=>s.broad.trails[a.id]?.complete).length;

export function broadHome(state,graph,gardenArt) {
  const count=trailCount(state),last=state.broad.journey;
  const resume=last?.active?last.ids[last.index]:areas.find(a=>state.broad.trails[a.id]&&!state.broad.trails[a.id].complete)?.id;
  return `<section class="hero broad-hero"><div><div class="hello">Number Garden. Seven math patches.</div><h1>Big ideas.<br>Your own pace.</h1><p class="intro">Pip packed a picnic. Dot packed seventeen spoons.<br>Come help them make sense of a wonderfully mathematical garden.</p><div class="hero-actions"><a class="primary" href="#checkin">${count?'Choose a little check-in':'Let’s explore together'} <span aria-hidden="true">↗</span></a><a class="text-button" href="#activities">Find an adventure</a></div><p class="tiny status-note">One small trail at a time. ${count?`${count} of 7 areas visited.`:'Start wherever you are curious.'}</p></div>${gardenArt()}</section><section class="resume-strip"><span>Every multiplication fact from 1 × 1 through 12 × 12, with pictures and your choice of practice.</span><a class="primary" href="#facts">Visit the multiplication garden</a></section><section class="paths"><div class="section-intro"><h2>Pick a patch of possibility</h2><p>Every garden is open.</p></div><div class="area-grid">${areas.map(a=>`<article class="area-card" style="--area-color:${color(a.id)}"><span class="area-icon" aria-hidden="true">${a.icon}</span><h3>${e(a.name)}</h3><p>${e(a.description)}</p><div class="area-actions"><button class="text-button" data-trail="${a.id}">${state.broad.trails[a.id]?.complete?'See our observations':state.broad.trails[a.id]?'Continue this trail':'Try two little questions'}</button><a href="#activities/${a.id}">Adventures ↗</a></div></article>`).join('')}</div></section>${resume?`<div class="resume-strip"><span>There’s a trail waiting for you in ${e(areaById(resume).name)}.</span><button class="secondary" data-trail="${resume}">Keep exploring</button></div>`:''}<div class="home-foot"><span><span aria-hidden="true">✦</span> Think out loud. Make a model. Change your mind.</span><a href="#map">Grown-ups: explore the learning connections</a></div>`;
}
export function checkinHub(state) {
  return `${title('A little look around.','Choose an area, sit together, and try two questions. The second question responds to the first. You can stop, skip, or change paths.')}<section class="journey-banner">${faces}<div><h2>A wander through seven gardens</h2><p>Fourteen questions in little pairs, with a stopping place after each pair. There is no need to do them all today.</p></div><button class="primary" id="begin-journey">${state.broad.journey?.active?'Resume our wander':'Explore all seven'}</button></section><div class="area-grid">${areas.map(a=>{const t=state.broad.trails[a.id];return `<article class="area-card"><span class="area-icon" aria-hidden="true">${a.icon}</span><h2>${e(a.name)}</h2><p>${e(a.place)} · ${t?.complete?'Two observations recorded':t?`${t.index} of 2 recorded`:'Two little questions'}</p><button class="secondary" data-trail="${a.id}">${t?.complete?'See what we noticed':t?'Continue this trail':'Explore this area'}</button></article>`;}).join('')}</div><p class="status-note">This is a small informal sample in each area, not a grade-level test. Drawing, counting, and asking for help are welcome.</p><details class="panel"><summary>Looking for the original multiplication check-in?</summary><p>Your earlier work is still here, along with the multiplication workshop.</p><a href="#multiplication">Open the multiplication check-in</a></details>`;
}
export function activityLibrary(state,graph,selected='all') {
  return `${title('Adventures with Pip & Dot.','A short story, an idea to try, a picture you can change, and something to wonder about. Pick whatever looks interesting.')}<div class="level-options" aria-label="Filter activities"><a class="level-choice ${selected==='all'?'selected':''}" href="#activities">All gardens</a>${areas.map(a=>`<a class="level-choice ${selected===a.id?'selected':''}" href="#activities/${a.id}">${e(a.name)}</a>`).join('')}</div>${areas.filter(a=>selected==='all'||a.id===selected).map(a=>{const s=suggestActivity(state,a.id,graph);return `<section class="adventure-section"><div class="section-intro"><h2>${a.icon} ${e(a.place)}</h2><a href="#map/${a.checkin[1].topicId}" class="tiny">See the learning connections</a></div><p class="suggestion-reason">${e(s.reason)} <button class="text-button" data-adventure="${s.item.id}">Try ${e(s.item.title)}</button></p><div class="adventure-grid">${a.activities.map(q=>`<article class="adventure-card"><span class="tag">${q.tier==='support'?'Build an idea':q.tier==='stretch'?'Explore further':'Make a connection'}</span><h3>${e(q.title)}</h3><p>${e(q.prompt)}</p><button class="secondary" data-adventure="${q.id}">Try this adventure</button></article>`).join('')}</div></section>`;}).join('')}<section class="panel"><h2>A little multiplication, too</h2><p>The original six-fact practice sets and puzzles are still available.</p><div class="summary-links"><a href="#practice" class="secondary">Multiplication workshop</a><a href="#puzzles" class="secondary">Original puzzles</a></div></section>`;
}
export function trailSummary(state,id,graph) {
  const a=areaById(id), t=state.broad.trails[id], obs=areaEvidence(state,id).slice(-Math.min(2,t?.index||0)), s=suggestActivity(state,id,graph), j=state.broad.journey;
  const next=j?.active&&j.ids[j.index]===id&&j.index<j.ids.length-1;
  return `${title('A few things we noticed.','Two questions give us ideas for what to try next. They don’t define what you can do in this whole area.')}<section class="summary-callout"><h2>${a.icon} ${e(a.name)}</h2>${obs.map(o=>`<p><strong>${e(o.label)}:</strong> ${e(broadDescribe(o))}.</p>`).join('')}<p class="tiny">New numbers, a different representation, and another day can tell us more.</p></section><div class="notes-grid"><section class="panel"><h2>One possible next adventure</h2><h3>${e(s.item.title)}</h3><p>${e(s.reason)}</p><button class="primary" data-adventure="${s.item.id}">Try this adventure</button></section><section class="panel"><h2>Where shall we wander?</h2><div class="summary-links">${next?'<button class="primary" id="next-garden">Visit the next garden</button>':''}<a class="secondary" href="#activities">Choose any adventure</a><a href="#map/${a.checkin[1].topicId}" class="secondary">See the map</a><a href="#home" class="text-button">Finish for now</a></div><button class="text-button" data-revisit="${id}">Try another little check-in here</button></section></div>`;
}
export function broadObservationDetails(o) {
  const labels=o.attempts.map(n=>o.choices?.[n]??n);
  return `<div class="evidence-item"><strong>${e(o.label)} — ${e(broadDescribe(o))}</strong><p>${e(o.prompt)}</p><p>${o.status==='skipped'?'Skipped.':`Answers tried: ${e(labels.join(', ')||'None')}.`}${o.hinted?' Hint used.':''}${o.modelUsed?' Picture playground used.':''}${o.revealed?' Worked solution opened.':''}${o.source==='activity'?' After a teaching activity.':''}${o.familiar?' This question appeared earlier.':''}${o.knownFact?' This fact appeared earlier.':''}${o.priorExposureUnknown?' Earlier familiarity was not recorded.':''}</p></div>`;
}
export function broadNotes(state,graph) {
  return `<section class="panel"><h2>Our wider math explorations</h2><p class="tiny">Observations belong to the individual tasks. They do not establish mastery of a topic or its prerequisites.</p>${areas.map(a=>{const obs=areaEvidence(state,a.id);return `<div class="skill-row"><strong>${a.icon} ${e(a.name)}</strong>${obs.length?obs.slice(-2).map(o=>`<p>${e(o.label)}: ${e(broadDescribe(o))}.</p>`).join(''):'<p>Not explored yet.</p>'}<div class="area-actions"><button class="text-button" data-trail="${a.id}">Visit this area</button><a href="#map/${a.checkin[1].topicId}">Learning connections ↗</a></div></div>`;}).join('')}</section><details class="panel"><summary>Wider check-in details (${state.broad.observations.length} recorded)</summary>${state.broad.observations.map(broadObservationDetails).join('')||'<p>No wider check-in questions recorded yet.</p>'}</details><details class="panel"><summary>Adventure details (${state.broad.activityObservations.length} recorded)</summary><p class="tiny">These are learning attempts after explanations, kept separate from check-in observations.</p>${state.broad.activityObservations.map(broadObservationDetails).join('')||'<p>No adventures recorded yet.</p>'}</details>`;
}
export function learningMap(state,graph,selected) {
  if(!graph)return `${title('The learning connections','The map is unavailable right now. The check-ins and adventures still work.')}<a href="#checkin">Choose a check-in</a>`;
  const nodes=new Map(graph.topics.map(t=>[t.id,t])), first=areas[0].checkin[1].topicId, node=nodes.get(selected)||nodes.get(first);
  const incoming=graph.dependencies.filter(d=>d.topicId===node.id), outgoing=graph.dependencies.filter(d=>d.prerequisiteId===node.id);
  const obs=[...state.broad.observations,...state.broad.activityObservations].filter(o=>o.topicId===node.id);
  const activities=areas.flatMap(a=>a.activities).filter(q=>q.topicId===node.id);
  const link=(d,id)=>`<li><a href="#map/${id}">${e(nodes.get(id)?.name||id)}</a><span class="edge-kind">${d.strength==='hard'?'Foundation link':'Helpful link'}</span><p>${e(d.reason)}</p></li>`;
  return `${title('How the ideas connect.','A parent-facing slice of Marble’s map, with our local observations alongside. A connection is a teaching suggestion, never a locked gate.')}<div class="map-area-links">${areas.map(a=>`<a href="#map/${a.checkin[1].topicId}">${a.icon} ${e(a.name)}</a>`).join('')}</div><div class="map-focus"><div class="map-branch"><h2>Builds on</h2><ul>${incoming.map(d=>link(d,d.prerequisiteId)).join('')||'<li>No prerequisite links are included here.</li>'}</ul></div><section class="map-center"><span class="tag">${e(node.domain)}</span><h2>${e(node.name)}</h2><p>${e(node.description)}</p><p class="tiny">${node.focus?'Linked to a check-in or adventure here.':'Context concept: no check-in is attached here.'}</p><h3>What we have actually observed</h3>${obs.length?obs.map(o=>`<p class="map-observation">${e(o.label)}: ${e(broadDescribe(o))}${o.source==='activity'?' (after teaching)':''}.</p>`).join(''):'<p>No observations for this concept yet.</p>'}${activities.map(q=>`<button class="secondary" data-adventure="${q.id}">${e(q.title)}</button>`).join('')}<p class="tiny status-note">${node.outsidePrerequisites?`${node.outsidePrerequisites} further direct prerequisite link(s) lie outside this slice. `:''}Nothing here infers that other connected concepts have been mastered.</p></section><div class="map-branch"><h2>Connects next</h2><ul>${outgoing.map(d=>link(d,d.topicId)).join('')||'<li>No next links are included here.</li>'}</ul></div></div><details class="panel"><summary>About this map & open data</summary><p>We use ${graph.topics.length} concepts from Marble’s ${graph.totalTopics}-concept v1 map. Task-linked concepts and their direct prerequisites are included; further branches may be outside this slice. Names can be broader than the example we sampled.</p><p>Marble Skill Taxonomy v1 © Generative Spark, Inc. (Marble). This subset and its relationships are shared under ODbL 1.0; Marble’s descriptive text and link reasons are CC BY-SA 4.0. The activities are original.</p><p><a href="./marble-map.json" download>Download this map data</a> · <a href="https://github.com/withmarbleapp/os-taxonomy/tree/${graph.commit}" target="_blank" rel="noopener">Pinned source</a> · <a href="https://opendatacommons.org/licenses/odbl/1-0/" target="_blank" rel="noopener">Database license</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">Content license</a></p><p>The map data download contains curriculum data only. Device-local observations are exported separately from Grown-up notes.</p></details>`;
}
export function renderModel(q,active,editable=false) {
  const m=active.model||q.model;if(!m)return '';
  const button=(action,label,disabled=false)=>`<button type="button" class="model-button" data-model-action="${action}" ${disabled?'disabled':''}>${label}</button>`;
  let visual='',controls='',readout='';
  if(m.type==='place'){
    visual=`<div class="place-board" role="img" aria-label="${m.hundreds||0} hundreds, ${m.tens||0} tens, ${m.ones||0} ones">${[['hundreds','100'],['tens','10'],['ones','1']].map(([k,v])=>`<div><span>${k}</span><div class="place-tokens">${Array.from({length:m[k]||0},()=>`<i>${v}</i>`).join('')||'<em>—</em>'}</div></div>`).join('')}</div>`;
    readout=`${(m.hundreds||0)*100+(m.tens||0)*10+(m.ones||0)} altogether`;
    controls=button('hundred-add','Add a hundred',m.hundreds>=9)+button('hundred-remove','Remove a hundred',!m.hundreds)+button('ten-add','Add a ten',m.tens>=12)+button('ten-remove','Remove a ten',!m.tens)+button('one-add','Add a one',m.ones>=20)+button('one-remove','Remove a one',!m.ones)+button('trade','Trade 10 ones for a ten',(m.ones||0)<10||m.tens>=12)+button('trade-tens','Trade 10 tens for a hundred',m.tens<10||m.hundreds>=9);
  } else if(m.type==='array'){
    visual=`<div class="model-array" role="img" aria-label="${m.rows} rows with ${m.cols} in each row" style="grid-template-columns:repeat(${m.cols},1fr)">${'<span></span>'.repeat(m.rows*m.cols)}</div>`;
    readout=`${m.rows} rows × ${m.cols} in each = ${m.rows*m.cols}`;
    controls=button('row-add','Add a row',m.rows>=9)+button('row-remove','Remove a row',m.rows<=1)+button('col-add','Add a column',m.cols>=9)+button('col-remove','Remove a column',m.cols<=1)+button('rotate','Turn the array');
  } else if(m.type==='fraction'){
    visual=`<div class="fraction-bar" role="img" aria-label="One whole divided into ${m.parts} equal pieces; ${m.shaded} shaded" style="grid-template-columns:repeat(${m.parts},1fr)">${Array.from({length:m.parts},(_,i)=>`<span class="${i<m.shaded?'shaded':''}"></span>`).join('')}</div>`;
    readout=`${m.shaded}/${m.parts} of the same whole is shaded`;
    controls=button('shade-add','Shade one more',m.shaded>=m.parts)+button('shade-remove','Shade one fewer',m.shaded<=0)+button('parts-add','Add a piece',m.parts>=12)+button('parts-remove','Remove a piece',m.parts<=2);
  } else if(m.type==='pattern'){
    visual=`<div class="pattern-tiles" role="img" aria-label="Pattern: ${m.values.join(', ')}">${m.values.map(v=>`<span>${v}</span>`).join('')}</div>`;
    readout=`The same jump each time: ${m.step>=0?'+':''}${m.step}`;
    controls=button('pattern-next','Add the next step',m.values.length>=10)+button('pattern-back','Remove the last step',m.values.length<=2);
  } else if(m.type==='shape'){
    const hexagon=Array.from({length:6},(_,i)=>{const angle=(i*60-90)*Math.PI/180;return `${100+85*Math.cos(angle)},${100+85*Math.sin(angle)}`;}).join(' ');
    const shapes={triangle:'100,22 185,162 15,162',rectangle:'20,45 180,45 180,145 20,145',square:'35,35 165,35 165,165 35,165',hexagon};
    const pointer=q.topicId==='mt_MFfYcnv6Tv'?'<path d="M100 53V19m0 0l-8 10m8-10l8 10" stroke="#b93e2c" stroke-width="4" fill="none"/>':'';
    visual=`<svg class="shape-model" viewBox="0 0 200 200" role="img" aria-label="${e(m.shape)} turned ${m.turns||0} quarter turns"><g transform="rotate(${(m.turns||0)*90} 100 100)"><polygon points="${shapes[m.shape]||shapes.rectangle}" fill="#e9b84a" stroke="#183f39" stroke-width="3"/>${pointer}</g></svg>`;
    readout=`${m.turns||0} quarter turns clockwise from the starting picture`;
    controls=button('turn','Make a quarter turn')+button('change-shape','Try another shape');
  } else if(m.type==='ruler'){
    const x=n=>20+n/m.max*300;
    visual=`<svg class="ruler-model" viewBox="0 0 340 105" role="img" aria-label="Diagram of a ruler, with a strip from ${m.start} to ${m.end} centimetres"><path d="M20 64H320" stroke="#183f39" stroke-width="2"/><rect x="${x(m.start)}" y="22" width="${x(m.end)-x(m.start)}" height="23" fill="#e9b84a"/>${Array.from({length:m.max+1},(_,n)=>`<path d="M${x(n)} 58v${n%5?10:16}" stroke="#183f39"/>${n%5===0||n===m.start||n===m.end?`<text x="${x(n)}" y="94" text-anchor="middle" font-size="12">${n}</text>`:''}`).join('')}</svg>`;
    readout=`From ${m.start} to ${m.end}: ${m.end-m.start} centimetres long`;
    controls=button('start-left','Move start left',m.start<=0)+button('start-right','Move start right',m.start>=m.end)+button('end-left','Move end left',m.end<=m.start)+button('end-right','Move end right',m.end>=m.max);
  } else {
    visual=`<div class="counter-model" role="img" aria-label="${m.count||0} counters">${'<span></span>'.repeat(Math.min(40,m.count||0))}</div>`;
    readout=`${m.count||0} counters`;controls=button('counter-add','Add a counter',m.count>=40)+button('counter-remove','Remove a counter',m.count<=0);
  }
  return `<section class="picture-playground" aria-label="Picture playground">${visual}${editable?`<p class="model-readout" aria-live="polite">${readout}</p><div class="model-controls">${controls}<button class="model-button" data-model-action="reset">Reset the picture</button></div><p class="tiny">Change this picture to explore. The question still uses its original numbers.</p>`:''}</section>`;
}
export function adjustModel(q,active,action) {
  active.model??=structuredClone(q.model);const m=active.model;
  if(action==='reset'){active.model=structuredClone(q.model);return;}
  if(m.type==='place'){
    if(action==='hundred-add')m.hundreds=Math.min(9,(m.hundreds||0)+1);
    if(action==='hundred-remove')m.hundreds=Math.max(0,(m.hundreds||0)-1);
    if(action==='ten-add')m.tens=Math.min(12,(m.tens||0)+1);
    if(action==='ten-remove')m.tens=Math.max(0,(m.tens||0)-1);
    if(action==='one-add')m.ones=Math.min(20,(m.ones||0)+1);
    if(action==='one-remove')m.ones=Math.max(0,(m.ones||0)-1);
    if(action==='trade'&&m.ones>=10&&m.tens<12){m.ones-=10;m.tens++;}
    if(action==='trade-tens'&&m.tens>=10&&m.hundreds<9){m.tens-=10;m.hundreds++;}
  }else if(m.type==='array'){
    if(action==='row-add')m.rows=Math.min(9,m.rows+1);if(action==='row-remove')m.rows=Math.max(1,m.rows-1);
    if(action==='col-add')m.cols=Math.min(9,m.cols+1);if(action==='col-remove')m.cols=Math.max(1,m.cols-1);
    if(action==='rotate')[m.rows,m.cols]=[m.cols,m.rows];
  }else if(m.type==='fraction'){
    if(action==='shade-add')m.shaded=Math.min(m.parts,m.shaded+1);if(action==='shade-remove')m.shaded=Math.max(0,m.shaded-1);
    if(action==='parts-add')m.parts=Math.min(12,m.parts+1);if(action==='parts-remove'){m.parts=Math.max(2,m.parts-1);m.shaded=Math.min(m.parts,m.shaded);}
  }else if(m.type==='pattern'){
    if(action==='pattern-next'&&m.values.length<10)m.values.push(m.values.at(-1)+m.step);
    if(action==='pattern-back'&&m.values.length>2)m.values.pop();
  }else if(m.type==='shape'){
    if(action==='turn')m.turns=((m.turns||0)+1)%4;
    if(action==='change-shape'){const all=['triangle','rectangle','square','hexagon'];m.shape=all[(all.indexOf(m.shape)+1)%4];}
  }else if(m.type==='ruler'){
    if(action==='start-left')m.start=Math.max(0,m.start-1);if(action==='start-right')m.start=Math.min(m.end,m.start+1);
    if(action==='end-left')m.end=Math.max(m.start,m.end-1);if(action==='end-right')m.end=Math.min(m.max,m.end+1);
  }else {if(action==='counter-add')m.count=Math.min(40,m.count+1);if(action==='counter-remove')m.count=Math.max(0,m.count-1);}
}
function color(id){return {number:'#e9b84a',operations:'#d8e8dc',fractions:'#f1d9d4',patterns:'#dce6f1',geometry:'#e3def2',measurement:'#d8ebe8',reasoning:'#f3e4bc'}[id]||'#eaf4ef';}
