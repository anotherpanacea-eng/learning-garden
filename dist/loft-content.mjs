// Original puppet-theatre invitations and finite language; every combination is welcome.
export const puppets=[{id:'pip',name:'Pip'},{id:'dot',name:'Dot'},{id:'rabbit',name:'Rabbit'},{id:'kitten',name:'Kitten'},{id:'dragon',name:'Dragon'}];
export const settings=[{id:'garden',name:'Garden',lead:'In the garden'},{id:'cafe',name:'Café',lead:'At the café'},{id:'bridge',name:'Footbridge',lead:'On the footbridge'},{id:'log',name:'Sheltered log',lead:'Beside the sheltered log'}];
export const actions=[{id:'finds',name:'Finds',verb:'finds'},{id:'carries',name:'Carries',verb:'carries'},{id:'offers',name:'Offers',verb:'offers'},{id:'plays',name:'Plays with',verb:'plays with'},{id:'wonders',name:'Wonders about',verb:'wonders about'}];
export const props=[{id:'letter',name:'Letter',phrase:'a letter'},{id:'umbrella',name:'Umbrella',phrase:'an umbrella'},{id:'basket',name:'Basket',phrase:'a basket'},{id:'blanket',name:'Blanket',phrase:'a blanket'},{id:'teacup',name:'Teacup',phrase:'a teacup'},{id:'moon',name:'Moon crunch',phrase:'a Moon crunch bite'}];
const frame=(actor,place,action,prop)=>({actor,place,action,prop});
export const invitations=[
 {id:'welcome',title:'A welcome for a new neighbor',hook:'Someone new has arrived at the café. What welcome will your puppets invent?',frames:[frame('pip','garden','finds','basket'),frame('dot','cafe','offers','basket'),frame('rabbit','cafe','plays','teacup')]},
 {id:'shelter',title:'Room under the leaves',hook:'The rain has passed. Make a pretend story about finding somewhere cozy.',frames:[frame('kitten','garden','finds','blanket'),frame('dragon','log','carries','blanket'),frame('kitten','log','plays','blanket')]},
 {id:'delivery',title:'A surprising delivery',hook:'A letter has landed on the bridge. Who will carry it, and where will it go?',frames:[frame('dot','bridge','finds','letter'),frame('pip','garden','carries','letter'),frame('dragon','cafe','offers','letter')]},
 {id:'picnic',title:'A wonderfully odd picnic',hook:'An umbrella, a dragon, and a snack. What could possibly happen?',frames:[frame('rabbit','bridge','finds','umbrella'),frame('kitten','garden','plays','umbrella'),frame('dragon','cafe','offers','moon')]},
 {id:'open',title:'An open stage',hook:'Begin with three quiet scenes. Make a surprise, a repeating joke, or anything you imagine.',frames:Array.from({length:3},()=>frame('dot','garden','wonders','basket'))}
];
export const audienceQuestions=[
 {title:'Who is doing something?',text:'Choose a scene. Who is doing something here? Point, tell, or act it out.'},
 {title:'A place to notice',text:'Choose a scene. What place does it show? What detail makes that clear?'},
 {title:'Before or after',text:'Choose a scene. What might happen just before or just after it?'},
 {title:'Give a puppet a voice',text:'Choose a scene. What could this puppet say? Try a different voice together.'},
 {title:'A lovely surprise',text:'Choose a scene. What surprise would you like your audience to notice?'},
 {title:'Make an idea clearer',text:'Choose a scene. What small change could make your idea clearer to someone watching?'}
];
export const invitationById=id=>invitations.find(x=>x.id===id);
export function sceneCaption(f){
 const actor=puppets.find(x=>x.id===f?.actor),place=settings.find(x=>x.id===f?.place),action=actions.find(x=>x.id===f?.action),prop=props.find(x=>x.id===f?.prop);
 return actor&&place&&action&&prop?`${place.lead}, ${actor.name} ${action.verb} ${prop.phrase}.`:'';
}
