import {groundCase,units} from './same-ground-content.mjs';

const integer=(n,min,max)=>Number.isInteger(n)&&n>=min&&n<=max;
const rectangle=(w,h,stock)=>integer(w,1,12)&&integer(h,0,12)&&w*h<=stock;
// Clockwise unit segments, beginning at the upper-left corner. No internal edges.
export function outsideEdges(width,rows){
 if(!integer(width,1,12)||!integer(rows,0,12))return null;
 if(!rows)return [];
 const edges=[];
 for(let x=0;x<width;x++)edges.push([x,0,x+1,0]);
 for(let y=0;y<rows;y++)edges.push([width,y,width,y+1]);
 for(let x=width;x>0;x--)edges.push([x,rows,x-1,rows]);
 for(let y=rows;y>0;y--)edges.push([0,y,0,y-1]);
 return edges;
}
export function createGroundPlot(caseId){const c=groundCase(caseId);return c?{caseId,width:c.width,rows:0,walked:0,reveal:false,kept:null}:null;}
export function groundModel(plot){
 const c=groundCase(plot?.caseId);if(!c||!rectangle(plot.width,plot.rows,c.stock)||typeof plot.reveal!=='boolean')return null;
 const edges=outsideEdges(plot.width,plot.rows),perimeter=edges.length;
 if(!integer(plot.walked,0,perimeter))return null;
 if(plot.kept!==null&&(!plot.kept||!rectangle(plot.kept.width,plot.kept.rows,c.stock)||!plot.kept.rows))return null;
 const area=plot.width*plot.rows;
 return {caseId:c.id,stock:c.stock,width:plot.width,rows:plot.rows,area,tray:c.stock-area,perimeter,edges,walked:plot.walked,reveal:plot.reveal,
  kept:plot.kept?{...plot.kept,area:plot.kept.width*plot.kept.rows,perimeter:2*(plot.kept.width+plot.kept.rows)}:null,
  canLay:plot.rows<12&&area+plot.width<=c.stock,canLift:plot.rows>0,canWalk:plot.walked<perimeter,complete:area===c.stock,
  budget:c.id==='twenty-four'&&plot.rows>0?{allUsed:area===c.stock,within:perimeter<=20}:null};
}
function edit(plot,fn,construction=false){if(!groundModel(plot))return null;const next={...plot,kept:plot.kept?{...plot.kept}:null};if(!fn(next))return null;if(construction){next.walked=0;next.reveal=false;}return groundModel(next)?next:null;}
export const setGroundWidth=(p,w)=>edit(p,n=>{if(n.rows||!integer(w,1,12))return false;n.width=w;return true;},true);
export const layGroundRow=p=>edit(p,n=>{if(!groundModel(n).canLay)return false;n.rows++;return true;},true);
export const liftGroundRow=p=>edit(p,n=>{if(!n.rows)return false;n.rows--;return true;},true);
export const returnGroundTiles=p=>edit(p,n=>{n.rows=0;return true;},true);
export const walkGroundEdge=p=>edit(p,n=>{if(!groundModel(n).canWalk)return false;n.walked++;return true;});
export const restartGroundWalk=p=>edit(p,n=>{n.walked=0;return true;});
export const revealGroundEdges=(p,reveal)=>edit(p,n=>{if(typeof reveal!=='boolean')return false;n.reveal=reveal;return true;});
export const keepGroundPicture=p=>edit(p,n=>{if(!n.rows)return false;n.kept={width:n.width,rows:n.rows};return true;});
export const clearGroundPicture=p=>edit(p,n=>{n.kept=null;return true;});
export function groundComparison(plot){
 const m=groundModel(plot);if(!m)return null;
 if(!m.kept)return 'Keep a picture, return the tiles and try another arrangement.';
 if(!m.rows)return 'Lay some rows to compare them with the picture.';
 const k=m.kept,areaRelation=Math.sign(m.area-k.area),edgeRelation=Math.sign(m.perimeter-k.perimeter);
 const edge=edgeRelation>0?'more':edgeRelation<0?'fewer':'the same number of';
 if(m.complete&&k.area===m.stock)return `Both cover ${units(m.stock,'square unit')}. This plot needs ${units(m.perimeter,'length unit')} of fence; the picture needs ${k.perimeter}. This plot needs ${edge} length units of fence.`;
 return `This plot uses ${m.area} of ${m.stock} tiles (${m.tray} left). The picture uses ${k.area} of ${m.stock} tiles (${m.stock-k.area} left). Compare ${m.area} and ${k.area} square units; ${m.perimeter} and ${k.perimeter} length units. ${areaRelation===0?'Covered area is the same':areaRelation>0?'This plot covers more':'This plot covers less'}. Its outside length is ${edgeRelation===0?'the same':edgeRelation>0?'longer':'shorter'}. At least one arrangement does not use all ${m.stock} tiles yet.`;
}
export function groundShortcut(plot){const m=groundModel(plot);if(!m)return null;return m.rows?`${units(m.rows,'row')} of ${units(m.width,'square')} gives ${units(m.area,'square unit')}. The outside has ${m.width} + ${m.rows} + ${m.width} + ${m.rows} = ${units(m.perimeter,'length unit')}. These are two different things to count, even when the numbers happen to match.`:'There is no plot yet: no covered squares and no outside boundary. Lay a row first.';}
