import assert from 'node:assert/strict';
import {groundCases} from '../dist/same-ground-content.mjs';
import {sameGroundPage,resetSameGround} from '../dist/same-ground-ui.mjs';
import {createGroundPlot,groundModel,outsideEdges,setGroundWidth,layGroundRow,liftGroundRow,returnGroundTiles,walkGroundEdge,restartGroundWalk,revealGroundEdges,keepGroundPicture,clearGroundPicture,groundComparison,groundShortcut} from '../dist/same-ground-core.mjs';

let checks=0,states=0,pairs=0;
const ok=(value,message)=>{checks++;assert.ok(value,message);};
const eq=(a,b,message)=>{checks++;assert.deepEqual(a,b,message);};
const key=([x,y,a,b])=>[[x,y],[a,b]].map(p=>p.join(',')).sort().join('|');
// Independent oracle: each tile contributes four edges; shared edges cancel.
function exposed(w,h){const counts=new Map();for(let y=0;y<h;y++)for(let x=0;x<w;x++)for(const e of [[x,y,x+1,y],[x+1,y,x+1,y+1],[x+1,y+1,x,y+1],[x,y+1,x,y]]){const k=key(e);counts.set(k,(counts.get(k)||0)+1);}return [...counts].filter(([,n])=>n===1).map(([k])=>k).sort();}
const nonempty=[];
for(const c of groundCases){
 const empty=createGroundPlot(c.id);eq(groundModel(empty).tray,c.stock);eq(groundModel(empty).perimeter,0);eq(groundModel(empty).budget,null,'empty is not within-budget plan');ok(groundShortcut(empty).includes('no outside boundary'));
 eq(keepGroundPicture(empty),null);eq(walkGroundEdge(empty),null);eq(liftGroundRow(empty),null);
 const all=[];
 for(let w=1;w<=12;w++){
  let p=setGroundWidth(empty,w),h=0;
  do{
   states++;const before=structuredClone(p),m=groundModel(p),oracle=exposed(w,h);
   eq(m.area,w*h);eq(m.tray+m.area,c.stock);eq(m.edges.map(key).sort(),oracle,'actual boundary equals cancelled unit-square edges');eq(m.perimeter,oracle.length);eq(new Set(m.edges.map(key)).size,m.perimeter);
   eq(m.canLay,h<12&&m.tray>=w);eq(m.canLift,h>0);
   if(h){
    eq(m.edges[0].slice(0,2),[0,0]);eq(m.edges.at(-1).slice(2),[0,0]);
    for(let i=1;i<m.edges.length;i++)eq(m.edges[i-1].slice(2),m.edges[i].slice(0,2),'walk is continuous');
    let walked=p;for(let k=1;k<=oracle.length;k++){walked=walkGroundEdge(walked);eq(groundModel(walked).walked,k);}
    eq(walkGroundEdge(walked),null,'no extra lap is counted');eq(groundModel(restartGroundWalk(walked)).walked,0);
    const revealed=revealGroundEdges(walked,true);eq(groundModel(revealed).walked,m.perimeter,'help does not walk');
    const lifted=liftGroundRow(revealed);eq(lifted.rows,h-1);eq(lifted.walked,0);eq(lifted.reveal,false);eq(layGroundRow(lifted).rows,h);
    eq(setGroundWidth(p,w===12?1:w+1),null,'width cannot resize placed stock');
    const kept=keepGroundPicture(p),cleared=returnGroundTiles(kept);eq(cleared.kept,{width:w,rows:h});eq(cleared.rows,0);eq(groundModel(cleared).tray,c.stock);eq(clearGroundPicture(cleared).kept,null);
    kept.kept.width=99;eq(p,before,'keeping returns an independent picture, not an alias into the build');
    all.push({...p});nonempty.push({...p});
   }
   eq(p,before,'model and actions leave previous construction unchanged');
   const next=layGroundRow(p);if(!next){ok(!m.canLay);break;}p=next;h++;
  }while(true);
 }
 for(const live of all)for(const picture of all){
  pairs++;const p={...live,kept:{width:picture.width,rows:picture.rows}},m=groundModel(p),text=groundComparison(p),both=m.area===c.stock&&m.kept.area===c.stock;
  eq(text.startsWith('Both cover'),both,'same-stock completion needs both full constructions');
  eq(text.includes('At least one arrangement'),!both,'partial qualifiers remain visible');
 }
}
eq(states,266);eq(pairs,8074);
function built(id,w,h){let p=setGroundWidth(createGroundPlot(id),w);for(let i=0;i<h;i++)p=layGroundRow(p);return p;}
for(const [id,w,h,p] of [['four',4,1,10],['four',2,2,8],['six',6,1,14],['six',3,2,10],['twelve',6,2,16],['twelve',4,3,14],['turn',4,3,14],['turn',3,4,14],['sixteen',8,2,20],['sixteen',4,4,16],['twenty-four',12,2,28],['twenty-four',6,4,20]])eq(groundModel(built(id,w,h)).perimeter,p);
const budget=nonempty.filter(p=>p.caseId==='twenty-four'&&groundModel(p).budget.within&&groundModel(p).budget.allUsed).map(p=>[p.width,p.rows]).sort();eq(budget,[[4,6],[6,4]]);
eq(groundModel(built('twenty-four',3,8)).budget,{within:false,allUsed:true});eq(groundModel(built('twenty-four',3,1)).budget,{within:true,allUsed:false});
const turn={...built('turn',3,4),kept:{width:4,rows:3}};ok(groundComparison(turn).includes('the same number of length units'));
for(const invalid of [null,{},createGroundPlot('missing'),{...createGroundPlot('four'),width:0},{...createGroundPlot('four'),width:13},{...createGroundPlot('four'),rows:5},{...createGroundPlot('four'),walked:1},{...createGroundPlot('four'),kept:{width:1,rows:0}}])eq(groundModel(invalid),null);
eq(outsideEdges(0,2),null);eq(outsideEdges(2,-1),null);eq(setGroundWidth(createGroundPlot('four'),1.5),null);eq(revealGroundEdges(createGroundPlot('four'),'yes'),null);
// Render a source-neutral page against a notebook that refuses any property read.
// A transient drawing has no reason to inspect or normalize saved learner fields.
const unreadableNotebook=new Proxy({}, {get(){throw new Error('Unexpected notebook read');},set(){throw new Error('Unexpected notebook write');}});
const html=sameGroundPage(unreadableNotebook,'synthetic-owner');
ok(html.includes('data-ground-root'));ok(html.includes('1 square unit')&&html.includes('1 length unit'));
ok(!html.includes('Walked 0 of 0'),'empty rendering offers no fictitious walk');
eq((html.match(/<option value="(?:four|six|twelve|turn|sixteen|twenty-four)"/g)||[]).length,6,'all encounters openly offered');
ok(html.includes('aria-live="polite" aria-atomic="true"></p>'),'announcement target starts empty for a connected update');
ok(html.includes('it is not saved in Notes'),'transient retention is disclosed');
const other={sameGround:{version:77,width:'unreadable'},unrelated:{keep:'synthetic'}};const prior=JSON.stringify(other);
sameGroundPage(other,'second-owner');eq(JSON.stringify(other),prior,'another owner and unknown fields remain untouched');resetSameGround();
console.log(`Same Ground: ${checks} checks; ${states} constructions, ${pairs} live/picture pairs.`);
