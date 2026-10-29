// Original finite, visit-local Switch Table model; no notebook operations.
export const switchLayouts=Object.freeze([
 {id:'lamp',title:'Switch beside the lamp'},
 {id:'cell',title:'Switch near the cell'},
 {id:'left',title:'Switch on the left'},
 {id:'two',title:'Two switches, one loop'}
].map(Object.freeze));
export const freshSwitchTable=()=>({layout:'lamp',a:false,b:false,representation:'sketch',trace:false});
export function validSwitchTable(s){return !!s&&switchLayouts.some(x=>x.id===s.layout)&&typeof s.a==='boolean'&&typeof s.b==='boolean'&&['sketch','symbols'].includes(s.representation)&&typeof s.trace==='boolean';}
export function changeSwitchTable(s,action,value){
 if(!validSwitchTable(s))return null;
 if(action==='reset')return freshSwitchTable();
 if(action==='layout'&&switchLayouts.some(x=>x.id===value))return {...s,layout:value};
 if(action==='representation'&&['sketch','symbols'].includes(value))return {...s,representation:value};
 if(['a','b','trace'].includes(action)&&typeof value==='boolean'&&(action!=='b'||s.layout==='two'))return {...s,[action]:value};
 return null;
}
export function switchTableModel(s){
 if(!validSwitchTable(s))return null;
 const nodes={P:{x:290,y:260,label:'Cell positive end'},N:{x:230,y:260,label:'Cell negative end'},BR:{x:420,y:260,label:'Bottom right wire bend'},TR:{x:420,y:70,label:'Top right wire bend'},T:{x:270,y:70,label:'Bulb tip contact'},S:{x:210,y:70,label:'Bulb side contact'},TL:{x:60,y:70,label:'Top left wire bend'},BL:{x:60,y:260,label:'Bottom left wire bend'}},edges=[];
 const edge=(id,from,to,kind='wire',active=true,owner=null)=>edges.push({id,from,to,kind,active,owner});
 const bridge=(id,from,to,p0,p1,closed)=>{
  nodes[id+'0']={x:p0[0],y:p0[1],label:`Switch ${id} first contact`};nodes[id+'1']={x:p1[0],y:p1[1],label:`Switch ${id} second contact`};
  edge(id+'-lead-0',from,id+'0');edge(id+'-bridge',id+'0',id+'1','switch',closed,id);edge(id+'-lead-1',id+'1',to);
 };
 edge('cell', 'N','P','cell');edge('wire-p-br','P','BR');
 if(s.layout==='lamp')bridge('A','BR','TR',[420,175],[420,125],s.a);
 else if(s.layout==='two')bridge('B','BR','TR',[420,175],[420,125],s.b);
 else edge('wire-br-tr','BR','TR');
 edge('wire-tr-t','TR','T');edge('filament','T','S','filament');edge('wire-s-tl','S','TL');
 if(['left','two'].includes(s.layout))bridge('A','TL','BL',[60,125],[60,175],s.a);else edge('wire-tl-bl','TL','BL');
 if(s.layout==='cell')bridge('A','BL','N',[110,260],[160,260],s.a);else edge('wire-bl-n','BL','N');
 const on=s.a&&(s.layout!=='two'||s.b),open=[...(!s.a?['A']:[]),...(s.layout==='two'&&!s.b?['B']:[])];
 return {nodes,edges,on,open,layout:switchLayouts.find(x=>x.id===s.layout),switches:s.layout==='two'?['A','B']:['A']};
}
