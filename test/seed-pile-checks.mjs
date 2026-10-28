import assert from 'node:assert/strict';
import {freshState,restoreState} from '../dist/core.mjs';
import {pileRules,pileSource} from '../dist/seed-pile-content.mjs';
import {gamesView,newPileGame,pilePosition,losingPile,brambleTake,startPile,movePile,explainPile,stepPile,keepPileNote,resumePile,removePileRecord,MAX_GAMES_BYTES} from '../dist/seed-pile-core.mjs';
import {prepareProgressImport} from '../dist/progress-transfer.mjs';
import {practicePile} from '../dist/seed-pile-ui.mjs';
const admit=s=>prepareProgressImport(JSON.stringify({...s,title:'Synthetic notebook'},null,2)).ok;
let checks=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;},ok=(a,m)=>{assert.ok(a,m);checks++;};
// Independent recursive game tree, rather than copying the implementation's recurrence table.
function winner(n,max,misere){if(!n)return misere;for(let t=1;t<=Math.min(n,max);t++)if(!winner(n-t,max,misere))return true;return false;}
for(const r of pileRules){
 for(let n=1;n<=30;n++){
  eq(losingPile(n,r.maxTake,r.lastLoses),!winner(n,r.maxTake,r.lastLoses));
  const g=newPileGame({variant:r.id,start:Math.max(5,n),first:'bramble',dial:'plan'});
  // Reach smaller positions with a legal prefix rather than mutating its starting range.
  if(n<5){g.moves=[{who:'bramble',take:1},{who:'child',take:1}];g.start=n+2;if(n+2<5){g.start=5;g.moves=[{who:'bramble',take:2},{who:'child',take:5-n-2}];}}
  else g.start=n;
  const p=pilePosition(g);if(!p||p.left!==n)continue;
  const t=brambleTake(g);ok(t>=1&&t<=Math.min(n,r.maxTake));
  if(winner(n,r.maxTake,r.lastLoses))ok(!winner(n-t,r.maxTake,r.lastLoses),'planned move leaves a losing position');
 }
 const s=freshState();ok(startPile(s,{variant:r.id,start:13,first:'child',dial:'plan'},admit));
 while(!pilePosition(s.games.current).winner){const p=pilePosition(s.games.current);ok(movePile(s,p.turn,1,admit,()=>0.99));}
 ok(!movePile(s,'child',1,admit));eq(restoreState(JSON.stringify(s)).games,s.games,'resume exact game');
 ok(keepPileNote(s,'I noticed a pattern.',admit));ok(!keepPileNote(s,'Duplicate',admit));
 const before=structuredClone(s.games);ok(!startPile(s,{},()=>false));eq(s.games,before,'refused start atomic');
 ok(startPile(s,{first:'bramble'},admit));eq(s.games.earlier[0],before.current);
 ok(resumePile(s,0,admit));eq(s.games.current,before.current);
 ok(removePileRecord(s,'notes',0,admit));eq(s.games.notes,[]);
}
const s=freshState();eq(gamesView(s).absent,true);ok(!Object.hasOwn(s,'games'),'view is not a write');
ok(startPile(s,{},admit));ok(explainPile(s,'pile',2,admit));ok(s.games.current.support.includes('explanation'));
ok(startPile(s,{},admit));ok(s.games.current.support.includes('explanation-before'));
ok(startPile(s,{variant:'pile-two'},admit));eq(s.games.current.support,[],'other rule is not same strategy');
ok(explainPile(s,'pile-two',0,admit));ok(startPile(s,{variant:'pile'},admit));ok(s.games.current.support.includes('explanation-before'),'earlier same-rule explanation survives lesson switches');
s.games.current.support=Array.from({length:12},(_,i)=>'future-support-'+i);const fullSupport=structuredClone(s.games);ok(!explainPile(s,'pile',0,admit));eq(s.games,fullSupport,'support cap refusal preserves readable game');
const raw={version:99,privateFuture:{opaque:'keep exact'}};s.games=raw;ok(startPile(s,{},admit));eq(s.games.retained,raw);
s.games.current.source.model='future-pile';const older=structuredClone(s.games.current);ok(startPile(s,{},admit));eq(s.games.earlier.at(-1),older);
s.games.current.source.rule='<img src=x onerror=alert(1)>';eq(pilePosition(s.games.current).left,13,'saved prose not checked against today');
const before=structuredClone(s);s.other={large:'x'.repeat(5*1024*1024)};const snapshot=structuredClone(s);ok(!movePile(s,'child',1,admit));eq(s,snapshot,'whole notebook refusal atomic');
s.games={...before.games,padding:'x'.repeat(MAX_GAMES_BYTES)};const cap=structuredClone(s.games);ok(!startPile(s,{},()=>true));eq(s.games,cap,'games budget does not grow without bound');
s.other={};s.games={...before.games,earlier:[newPileGame()],notes:[{text:'Keep',game:newPileGame()}],padding:'x'.repeat(MAX_GAMES_BYTES)};
const largeStart=JSON.stringify(s.games).length;ok(removePileRecord(s,'earlier',0,admit),'decreasing removal allowed above games cap');ok(JSON.stringify(s.games).length<largeStart&&JSON.stringify(s.games).length>MAX_GAMES_BYTES,'removal can make partial progress');ok(removePileRecord(s,'notes',0,admit),'second decreasing removal allowed');
const m=newPileGame({variant:'pile-last-loses',first:'bramble',dial:'attention',start:5});m.moves=[{who:'bramble',take:1},{who:'child',take:1}];eq(brambleTake(m),2,'attention leaves one in last-loses');
const one={...m,moves:[{who:'bramble',take:1},{who:'child',take:3}]};eq(pilePosition(one).left,1);eq(brambleTake(one),1,'forced last seed');
// After any explanation, the practice board must be winnable for the child against Bramble's plan.
for(const r of pileRules){const g=practicePile(pileSource(r.id));ok(pilePosition(g),r.id+' practice board is a legal game');eq(g.first,'child');ok(winner(g.start,r.maxTake,r.lastLoses),r.id+' practice start is winnable for the child');}
const retired=newPileGame();retired.dial='retired-synthetic-dial';ok(pilePosition(retired),'a retired dial does not hide a frozen game');ok(!newPileGame({dial:'retired-synthetic-dial'}),'new games still use current dial choices');
{
 // A saved explanation keeps its own frozen rule and wording while stepping, even with no current game.
 const s=freshState(),frozen=structuredClone(pileSource(pileRules.find(r=>r.id!=='pile').id));frozen.frames[1].text='Synthetic earlier wording.';
 s.games={version:1,current:null,earlier:[],notes:[],lesson:{source:structuredClone(frozen),step:0}};
 ok(stepPile(s,1,admit));eq(s.games.lesson,{source:frozen,step:1},'step keeps the saved lesson source');
 ok(!stepPile(s,4,admit));s.games.lesson=null;const before=structuredClone(s.games);ok(!stepPile(s,1,admit),'no saved lesson to step');eq(s.games,before);
}
console.log(`Seed Pile: ${checks} assertions passed.`);
