import assert from 'node:assert/strict';
import {freshState} from '../dist/core.mjs';
import {invitations} from '../dist/loft-content.mjs';
import {loftState,validLoft,startShow,setLoftEditor,setSceneDialogue,chooseScene,addScene,removeScene,moveScene,performShow,stepShow,meetAudience,spotlightScene,reviseShow,reopenShow} from '../dist/loft-core.mjs';
import {loftPage,loftNotes} from '../dist/loft-ui.mjs';
import {prepareProgressImport} from '../dist/progress-transfer.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(a,m)=>{assert.ok(a,m);n++;};
const s=freshState();startShow(s,'welcome');setLoftEditor(s,'words');const line='Hello, moon!\n<svg onload="fiction()"> & "tea" 🐉';
ok(setSceneDialogue(s,line));eq(s.loft.draft.frames[0].dialogue,line);const h=loftPage(s);ok(h.includes('&lt;svg onload=&quot;fiction()&quot;&gt;'));ok(!h.includes('<svg onload='));ok(loftNotes(s).includes('&lt;svg onload='));
const before=structuredClone(s);ok(!setSceneDialogue(s,'x'.repeat(401)));ok(!setSceneDialogue(s,{}));eq(s,before,'reject invalid dialogue without loss');
ok(setSceneDialogue(s,'x'.repeat(400)));ok(setSceneDialogue(s,line));
ok(addScene(s));eq(s.loft.draft.frames[1].dialogue,line);ok(moveScene(s,-1));eq(s.loft.draft.frames[0].dialogue,line);ok(setSceneDialogue(s,'A separate voice.'));eq(s.loft.draft.frames[1].dialogue,line,'copy is independent');
while(s.loft.draft.frames.length<12)ok(addScene(s));ok(!addScene(s));eq(s.loft.draft.frames.length,12);ok(validLoft(s.loft));
performShow(s);for(let i=1;i<12;i++){ok(!meetAudience(s),'must reach last scene');ok(stepShow(s,1));}ok(meetAudience(s));spotlightScene(s,11);reviseShow(s,11);ok(removeScene(s));eq([s.loft.draft.selected,s.loft.draft.stage,s.loft.draft.spotlight],[10,10,10]);
while(s.loft.draft.frames.length>1)ok(removeScene(s));ok(!removeScene(s));performShow(s);ok(!stepShow(s,1));ok(meetAudience(s),'one-scene show performs');
const saved=structuredClone(s.loft.draft);startShow(s,'open');reopenShow(s,saved.id);eq(s.loft.draft.frames,saved.frames);eq(prepareProgressImport(JSON.stringify(s)).state.loft,s.loft,'new schema imports exact');
// A real v1 shape, including paused performance and shelf, adapts without source mutation.
const oldShow={id:1,invitation:'welcome',frames:structuredClone(invitations[0].frames),selected:2,mode:'perform',stage:1,question:3,spotlight:0,changes:7,shared:false,heard:true};
const v1={version:1,nextId:3,draft:oldShow,shelf:[{...structuredClone(oldShow),id:2,mode:'audience',stage:2,shared:true}]};
const old={...freshState(),loft:structuredClone(v1)},exact=JSON.stringify(old);ok(validLoft(v1));const adapted=loftState(old);loftPage(old);loftNotes(old);eq(JSON.stringify(old),exact,'read adapter pure');
eq(adapted.version,2);eq(adapted.draft.stage,1);eq(adapted.draft.frames.map(({dialogue,...f})=>f),v1.draft.frames);eq(adapted.shelf[0].frames.map(({dialogue,...f})=>f),v1.shelf[0].frames);
eq(prepareProgressImport(exact).state.loft,v1,'import preserves original v1 until mutation');ok(stepShow(old,1));eq(old.loft.version,2);eq(old.loft.draft.stage,2);eq(old.loft.draft.changes,7);eq(old.loft.shelf[0].id,2);
for(const bad of [{...v1,version:3},{...v1,draft:{...oldShow,frames:[oldShow.frames[0]]}},{...s.loft,draft:{...s.loft.draft,frames:[{...s.loft.draft.frames[0],dialogue:3}]}}]){const x={...freshState(),loft:bad},raw=JSON.stringify(x);ok(!loftState(x));ok(!startShow(x,'open'));eq(JSON.stringify(x),raw);}
console.log(`${n} growing Story Loft checks passed.`);
