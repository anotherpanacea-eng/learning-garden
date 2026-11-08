import {springCases,springCopy} from './spring-bench-content.mjs';

const caseFor=id=>springCases.find(c=>c.id===id);
const plain=value=>value!==null&&typeof value==='object'&&Object.getPrototypeOf(value)===Object.prototype;
const keys=(value,names)=>plain(value)&&Reflect.ownKeys(value).length===names.length&&names.every(k=>Object.hasOwn(value,k));
const integer=value=>Number.isInteger(value)&&!Object.is(value,-0);
const markOK=value=>value===null||(integer(value)&&value>=0&&value<=20);
export function validSpring(id,work){const c=caseFor(id);return !!c&&keys(work,['force','phase','markSteps','previous'])&&integer(work.force)&&c.forces.includes(work.force)&&['fresh','loaded','released'].includes(work.phase)&&markOK(work.markSteps)&&(work.previous===null||(keys(work.previous,['markSteps'])&&markOK(work.previous.markSteps)));}
export function createSpring(id){return caseFor(id)?{force:1,phase:'fresh',markSteps:null,previous:null}:null;}
export function springModel(id,work){if(!validSpring(id,work))return null;const c=caseFor(id),i=c.forces.indexOf(work.force),length=work.phase==='fresh'?c.startLength:work.phase==='loaded'?c.loadedLengths[i]:c.releasedLengths[i];return {
 id,title:c.title,startLength:c.startLength,length,extension:length-c.startLength,pullNow:work.phase==='loaded'?work.force:0,testForce:work.force,mark:work.markSteps===null?null:work.markSteps/2,phase:work.phase,
 canSetForce:work.phase==='fresh',canApply:work.phase==='fresh',canRelease:work.phase==='loaded',canFresh:work.phase!=='fresh'||work.markSteps!==null||work.previous!==null,
 canAdd:work.markSteps===null,canDecrease:work.markSteps!==null&&work.markSteps>0,canIncrease:work.markSteps!==null&&work.markSteps<20,canClear:work.markSteps!==null,canUndo:work.previous!==null
 };}
export function changeSpring(id,work,action,value){const m=springModel(id,work);if(!m)return null;const next={...work,previous:work.previous===null?null:{...work.previous}};
 switch(action){
  case 'force':if(!m.canSetForce||!integer(value)||!caseFor(id).forces.includes(value)||value===work.force)return null;next.force=value;break;
  case 'apply':if(!m.canApply)return null;next.phase='loaded';break;
  case 'release':if(!m.canRelease)return null;next.phase='released';break;
  case 'fresh':if(!m.canFresh)return null;next.phase='fresh';next.markSteps=null;next.previous=null;break;
  case 'add':if(!m.canAdd)return null;next.markSteps=0;break;
  case 'decrease':if(!m.canDecrease)return null;next.markSteps--;break;
  case 'increase':if(!m.canIncrease)return null;next.markSteps++;break;
  case 'clear':if(!m.canClear)return null;next.markSteps=null;break;
  case 'undo':if(!m.canUndo)return null;next.markSteps=work.previous.markSteps;next.previous=null;break;
  default:return null;
 }
 if(['add','decrease','increase','clear'].includes(action))next.previous={markSteps:work.markSteps};
 return next;
}
const geometry=m=>({origin:{x:44,y:65},unloadedEnd:{x:44+26*m.startLength,y:65},end:{x:44+26*m.length,y:65},proposal:m.mark===null?null:{x1:44+26*m.startLength,x2:44+26*(m.startLength+m.mark),y:140,value:m.mark},reference:{x1:44+26*m.startLength,x2:44+26*m.length,y:180,value:m.extension}});
export function springGeometry(id,work){const m=springModel(id,work);return m?geometry(m):null;}
export function springPlot(id,work,axis){const m=springModel(id,work);if(!m||!['length','extension'].includes(axis))return null;const c=caseFor(id),point=(force,length)=>({force,length,extension:length-c.startLength,x:80+110*force,y:330-13*(axis==='length'?length:length-c.startLength)});return {axis,loading:c.forces.map((force,i)=>point(force,c.loadedLengths[i])),release:work.phase==='released'?point(0,m.length):null,proposal:m.mark===null?null:{force:m.pullNow,value:axis==='length'?m.startLength+m.mark:m.mark,x:80+110*m.pullNow,y:330-13*(axis==='length'?m.startLength+m.mark:m.mark)}};}
export function springExample(frame){if(!integer(frame)||frame<0||frame>4)return null;const length=frame===0||frame===4?5:7,model={id:null,title:'A separate example',startLength:5,length,extension:length-5,pullNow:frame>0&&frame<4?2:0,testForce:2,mark:frame===2?7:frame===3?2:null,phase:frame===0?'fresh':frame===4?'released':'loaded',canSetForce:false,canApply:false,canRelease:false,canFresh:false,canAdd:false,canDecrease:false,canIncrease:false,canClear:false,canUndo:false};return {frame,model,geometry:geometry(model),showReference:frame>=3,caption:springCopy.exampleCaptions[frame]};}
