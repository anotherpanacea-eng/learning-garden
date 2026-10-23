import {fossilObject,fossilDetail} from './fossil-close-content.mjs';
export const initialFossil=()=>({photo:'body',view:'look',detail:null,pins:{body:null,trace:null},sourceOpen:false});
// This finite presentation state never enters the learner notebook.
export function changeFossil(s,action,value){
 if(!s||!fossilObject(s.photo))return null;
 if(action==='photo'&&fossilObject(value))return {...s,photo:value,view:'look',detail:null,sourceOpen:false};
 if(action==='view'&&['look','compare'].includes(value))return {...s,view:value,sourceOpen:false};
 if(action==='detail'&&s.view==='look'&&(value===null||fossilDetail(s.photo,value)))return {...s,detail:value};
 if(action==='pin'&&s.view==='look'&&fossilDetail(s.photo,s.detail))return {...s,pins:{...s.pins,[s.photo]:s.detail}};
 if(action==='remove'&&fossilObject(value))return {...s,pins:{...s.pins,[value]:null}};
 if(action==='back'&&fossilObject(value))return {...s,photo:value,detail:s.pins[value],view:'look',sourceOpen:false};
 if(action==='source'&&s.view==='look')return {...s,sourceOpen:!s.sourceOpen};
 return null;
}
