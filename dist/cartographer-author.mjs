// Original condition-authoring extension. Feasibility here is a NEW-creation rule only.
import {marks} from './cartographer-content.mjs';
import {validMapJobSource} from './cartographer-jobs.mjs';

const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const positive=value=>Number.isSafeInteger(value)&&value>0;
const known=value=>marks.some(mark=>mark.id===value);
const name=id=>marks.find(mark=>mark.id===id)?.name||id;
const point=value=>object(value)&&Number.isInteger(value.x)&&value.x>=0&&value.x<=5&&Number.isInteger(value.y)&&value.y>=0&&value.y<=5;

export function validMapAuthorDraft(draft){
 return object(draft)&&draft.version===1&&typeof draft.open==='boolean'&&[draft.from,draft.via,draft.to].every(known);
}

export function mapAuthorView(round){
 if(!object(round)||round.job!==undefined)return {status:'not-free',draft:null};
 if(Object.hasOwn(round,'authorDraft'))return validMapAuthorDraft(round.authorDraft)
  ?{status:'ready',draft:round.authorDraft}
  :{status:'unavailable',draft:null,raw:round.authorDraft};
 const from=known(round.from)?round.from:'post';
 const to=known(round.to)&&round.to!==from?round.to:marks.find(mark=>mark.id!==from).id;
 const via=marks.find(mark=>mark.id!==from&&mark.id!==to).id;
 return {status:'missing',draft:{version:1,open:false,from,via,to}};
}

export function mapProblemPlan(round){
 const view=mapAuthorView(round),base={status:view.status,draft:view.draft,request:'',minimum:null,legs:[],limit:12,source:null};
 if(view.status==='not-free'||view.status==='unavailable')return base;
 if(!positive(round.id)||!object(round.places)||!Object.entries(round.places).every(([id,p])=>known(id)&&(p===null||point(p))))return {...base,status:'missing-map'};
 const placed=Object.fromEntries(Object.entries(round.places).filter(([,p])=>p!==null));
 if(new Set(Object.values(placed).map(p=>`${p.x},${p.y}`)).size!==Object.keys(placed).length)return {...base,status:'missing-map'};
 const draft=view.draft;
 if(![draft.from,draft.via,draft.to].every(id=>point(round.places[id])))return {...base,status:'missing-map'};
 if(new Set([draft.from,draft.via,draft.to]).size!==3)return {...base,status:'distinct'};
 const request=`Start at ${name(draft.from)}. Collect a sealed parcel at ${name(draft.via)}, then deliver it to ${name(draft.to)}.`;
 const legs=[[draft.from,draft.via],[draft.via,draft.to]].map(([from,to])=>{
  const a=round.places[from],b=round.places[to],horizontal=Math.abs(a.x-b.x),vertical=Math.abs(a.y-b.y);
  return {from,to,horizontal,vertical,steps:horizontal+vertical};
 });
 const minimum=legs.reduce((sum,leg)=>sum+leg.steps,0);
 const plan={...base,status:minimum<=12?'ready':'too-long',request,legs,minimum};
 if(plan.status!=='ready')return plan;
 const positions=marks.filter(mark=>round.places[mark.id]).map(mark=>`${mark.name} is at (${round.places[mark.id].x}, ${round.places[mark.id].y}).`).join(' ');
 const source={version:1,id:'map-maker-job',title:'A delivery problem from our map',request,
  mapReaderText:`I have our map. ${positions} Read across first, then up. North is up and east is right. Each move travels one interval.`,
  places:structuredClone(round.places),from:draft.from,via:draft.via,to:draft.to,authored:{version:1,mapId:round.id}};
 return validMapJobSource(source)?{...plan,source}:{...plan,status:'missing-map'};
}

// Origin is a convenience reference, never task validity or proof of a person's authorship.
export function mapAuthorOrigin(source){
 if(!object(source)||!Object.hasOwn(source,'authored'))return {status:'missing'};
 const origin=source.authored;
 return object(origin)&&origin.version===1&&positive(origin.mapId)
  ?{status:'ready',mapId:origin.mapId}
  :{status:'unavailable',raw:origin};
}
