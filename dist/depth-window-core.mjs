import {depthDefaults,depthCopy} from './depth-window-content.mjs';

const fields=['level','a','b','width'];
const integer=Number.isInteger;
const valueOK=(field,value)=>field==='width'?['narrow','wide'].includes(value):integer(value)&&value>=(field==='level'?0:1)&&value<=6;
export function validDepth(work){return !!work&&typeof work==='object'&&Object.keys(work).length===4&&fields.every(k=>Object.hasOwn(work,k)&&valueOK(k,work[k]));}
export function createDepth(){return {...depthDefaults};}
export function cloneDepth(work){return validDepth(work)?{...work}:null;}
export function changeDepth(work,field,value){return validDepth(work)&&fields.includes(field)&&valueOK(field,value)&&work[field]!==value?{...work,[field]:value}:null;}
export function depthModel(work){
 if(!validDepth(work))return null;
 const gauge=height=>height>work.level?{height,status:'dry',depth:null,pressureTenths:null}:{height,status:height===work.level?'surface':'water',depth:work.level-height,pressureTenths:98*(work.level-height)};
 return {work:{...work},...work,empty:work.level===0,gauges:{a:gauge(work.a),b:gauge(work.b)}};
}
export function compareDepth(pin,current){
 const pinned=depthModel(pin),now=depthModel(current);if(!pinned||!now)return null;
 const changed=fields.filter(k=>pin[k]!==current[k]),kind=changed.length===0?'same':changed.length===1?changed[0]:'multiple';
 let text;
 switch(kind){
  case 'same':text='These settings are the same.';break;
  case 'width':{
   const a=now.gauges.a.status!=='dry',b=now.gauges.b.status!=='dry';
   text=!a&&!b?'Width changed. Both locations still have no water reading.':a&&b?'Width changed while both depths stayed the same. This model gives the same pressure readings.':`Width changed. Gauge ${a?'A':'B'} keeps the same depth and reading; Gauge ${a?'B':'A'} still has no water reading.`;break;
  }
  case 'level':text=current.level===0?'This tank now has no water. Neither location has a water reading.':now.gauges.a.status==='dry'&&now.gauges.b.status==='dry'?'The waterline is below both locations. Neither has a water reading.':pin.level===0?'This setup now has water; the gauge heights stayed fixed. Check which locations are in water or at its surface.':'The waterline moved while the gauges kept their heights. Compare depths where water readings are available.';break;
  case 'a':case 'b':text=`Only Gauge ${kind.toUpperCase()} moved. The other location stayed fixed as a reference.`;break;
  default:text='More than one setting changed. We can compare these setups; to investigate one change, hold the other settings steady.';
 }
 return {kind,changed,pinned,current:now,text};
}
export function depthTankGeometry(work){
 const m=depthModel(work);if(!m)return null;
 const xLeft=work.width==='narrow'?180:100,tankSpan=work.width==='narrow'?240:400,surfaceY=m.empty?null:400-50*work.level;
 const gauge=(key,index)=>({x:xLeft+tankSpan*index/3,y:400-50*work[key],bracket:m.gauges[key].status==='dry'?null:{x:key==='a'?xLeft-24:xLeft+tankSpan+24,y1:surfaceY,y2:400-50*work[key],zero:m.gauges[key].status==='surface'}});
 return {tank:{xLeft,tankSpan,top:50,bottom:400},water:m.empty?null:{x:xLeft,y:surfaceY,width:tankSpan,height:50*work.level},surfaceY,ruler:{x:565,ticks:Array.from({length:8},(_,height)=>({height,y:400-50*height}))},gauges:{a:gauge('a',1),b:gauge('b',2)}};
}
export function depthFace(work,probe,face){
 const m=depthModel(work);if(!m||!['a','b'].includes(probe)||!['top','bottom','left','right'].includes(face))return null;
 const horizontal=face==='top'||face==='bottom';
 const segment=horizontal?{x1:120,y1:105,x2:180,y2:105}:{x1:150,y1:75,x2:150,y2:135};
 const backing={top:{x:120,y:105,width:60,height:20},bottom:{x:120,y:85,width:60,height:20},left:{x:150,y:75,width:20,height:60},right:{x:130,y:75,width:20,height:60}}[face];
 const [x1,y1]={top:[150,45],bottom:[150,165],left:[90,105],right:[210,105]}[face];
 const dx=(150-x1)/60,dy=(105-y1)/60;
 const arrow=m.gauges[probe].status!=='water'?null:{x1,y1,x2:150,y2:105,head:[{x:150,y:105},{x:150-dx*12-dy*6,y:105-dy*12+dx*6},{x:150-dx*12+dy*6,y:105-dy*12-dx*6}]};
 return {probe,orientation:face,status:m.gauges[probe].status,reading:m.gauges[probe],segment,backing,arrow};
}
const examples=Object.freeze([
 [4,3,1,'narrow'],[4,1,1,'narrow'],[4,1,1,'wide'],[6,1,1,'wide'],[6,6,1,'wide'],[5,6,1,'wide']
].map(([level,a,b,width])=>Object.freeze({level,a,b,width})));
export function depthExample(frame){return integer(frame)&&frame>=0&&frame<6?{work:{...examples[frame]},previousLevel:frame===3?4:null,text:depthCopy.frames[frame]}:null;}
