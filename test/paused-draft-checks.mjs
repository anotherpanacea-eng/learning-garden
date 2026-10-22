import assert from 'node:assert/strict';
import {freshState,restoreState} from '../dist/core.mjs';
import {ensureBroad,itemById,instantiateBroad,noteBroadExposure,familiarity} from '../dist/broad-core.mjs';
import {closedDraftNotes,broadNotes} from '../dist/broad-ui.mjs';
import {spoken} from '../dist/play-media.mjs';
let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++;};
for(const kind of ['checkin','activity']){
 const s=freshState();ensureBroad(s);const q=instantiateBroad(s,itemById('number-anchor'),kind),key=`${kind}:${q.id}`;
 // Wording edits keep a paused question open (see broad-variants checks); a changed answer closes it.
 q.answer+=1;
 const draft={question:q,attempts:[6],input:'60',hinted:true,helpUsed:true,helper:{attempts:[20],revealed:true},model:{type:'place',hundreds:4,tens:6,ones:2},knownFact:true};
 s.broad.drafts[key]=draft;noteBroadExposure(s,q,kind);ensureBroad(s);
 check(!s.broad.drafts[key]&&s.broad.closedDrafts.length===1&&s.broad.draftNotice,'changed question closes with a visible notice');
 assert.deepEqual(s.broad.closedDrafts[0],{key,draft});checks++;
 check(s.broad.observations.length===0&&s.broad.activityObservations.length===0,'kept work is never scored');
 ensureBroad(s);check(s.broad.closedDrafts.length===1,'normalizing again never duplicates kept work');
 const resumed=restoreState(JSON.stringify(s));ensureBroad(resumed);assert.deepEqual(resumed.broad.closedDrafts[0].draft,draft);checks++;
 const replacement=instantiateBroad(resumed,itemById(q.id),kind);check(replacement.answer!==q.answer&&!resumed.broad.drafts[key],'replacement never inherits old attempts');
 check(familiarity(resumed,replacement).sameKind,'earlier exposure stays conservative after the draft closes');
 const notes=broadNotes(resumed,null);check(notes.includes('Earlier paused work')&&notes.includes('Earlier answers tried: [6]')&&notes.includes('Unsubmitted input: 60'),'notes expose the earlier question and work');
 resumed.broad.draftNotice=false;ensureBroad(resumed);check(!resumed.broad.draftNotice&&resumed.broad.closedDrafts.length===1,'dismissing the notice keeps the original work');
}
{
 const s=freshState();ensureBroad(s);const q=instantiateBroad(s,itemById('number-anchor'));s.broad.drafts['checkin:number-anchor']={question:q,attempts:[],input:'6'};ensureBroad(s);
 check(s.broad.closedDrafts.length===0&&s.broad.drafts['checkin:number-anchor'].input==='6','unchanged paused questions still resume');
 s.broad.closedDrafts=[{key:'<img src=x onerror=alert(1)>',draft:{question:{title:'<script>bad()</script>',prompt:'<img src=x>'},attempts:['<b>bad</b>'],input:'<svg onload=bad()>'}}];
 const html=closedDraftNotes(s);check(!html.includes('<script>')&&!html.includes('<img ')&&!html.includes('<svg ')&&html.includes('&lt;script&gt;'),'kept hostile strings render only as escaped text');
}
for(const [text,want] of [['1 m and 1 cm','1 meter and 1 centimeter'],['2 m and 2 cm','2 meters and 2 centimeters'],['1.5 m','1.5 meters'],['1/3 and 2/3','1 third and 2 thirds']])check(spoken(text)===want,'spoken units/fractions '+text);
check(spoken('1 m et 2/3','fr')==='1 m et 2/3','French remains unchanged');
console.log(`${checks} paused-draft preservation and speech checks passed.`);
