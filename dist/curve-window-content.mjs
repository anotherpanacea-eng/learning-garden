// Original finite square-rule windows. Saved sources freeze their own model and teaching.
const tag={v:1,model:'square-window-v1'};
const axes={xMin:-4,xMax:4,yMin:-6,yMax:26,xTick:1,yTick:2};
const inputs=(lo,hi)=>Array.from({length:hi-lo+1},(_,i)=>lo+i);
const jobs=[
 {id:'same',title:'First window',h:0,k:0,question:'Could different inputs give the same output? Mark your ideas on both sides.'},
 {id:'two',title:'Near the line',h:0,k:-4,question:'How many different inputs might give zero? Mark your ideas, then explore the rule.'},
 {id:'touch',title:'A second window',h:1,k:0,question:'What might this picture look like near zero? Show your ideas before comparing.'},
 {id:'above',title:'Another height',h:0,k:2,question:'Which inputs, if any, could give zero? What could the rule tell us beyond a table?'},
 {id:'shift',title:'Move the fold?',h:1,k:-4,question:'Where would you put a fold? Use points on each side to explore.'},
 {id:'between',title:'A further window',h:-1,k:-2,question:'Which inputs, if any, give zero? Could intervals help you describe what you find?'}
];
const example=(h,k,probe4,zeroes=false,wide=false)=>({...tag,h,k,axes:{xMin:-3,xMax:wide?4:3,yMin:-6,yMax:wide?20:18,xTick:1,yTick:2},plotXs:inputs(-3,wide?4:3),probe4,zeroes});
const teaching=[
 {words:'Squaring means multiplying a number by itself. A negative number times itself gives a positive result. Two different inputs can give the same square. A few plotted points are a start; here we know the rule for every input.',example:example(0,0,-8)},
 {words:'Our input is first changed by subtracting the fixed number written inside the brackets. Equal distances on opposite sides of the fold give the same output. The lowest point is called the vertex. A fold line need not be the y-axis.',example:example(1,-4,0,false,true)},
 {words:'At the vertex, this curve reaches zero and turns upward. It touches the x-axis without changing from negative to positive. We count one different input that gives zero.',example:example(1,0,4,true,true)},
 {words:'A square can equal 4 in two ways: the changed input can be positive or negative. Both marked points give output zero. Zeroes are inputs; the output is zero at each.',example:example(0,-4,8,true)},
 {words:'A real square is zero or positive. Adding a positive amount keeps this output above zero for every real input. The known rule explains more than a few positive table entries could.',example:example(0,2,0,true)},
 {words:'A graph reading can give a useful interval. Here the endpoint calculations put zero between quarter marks. Each zero is inside its own interval; it is not exactly at its middle just because we drew a band.',example:example(0,-2,5,true)}
];
export const curveCases=Object.freeze(jobs.map(({id,title})=>Object.freeze({id,title})));
export function makeCurveSource(id='same'){
 const j=jobs.find(j=>j.id===id);return j?structuredClone({...tag,...j,axes,plotXs:inputs(-4,4),teaching,story:'The traveling library needs a window into square rules. Make a picture another visitor can explore. These curves describe number rules, not the strength or shape of a real building.'}):null;
}
export const curveCopy=Object.freeze({
 title:'Curve Window',entry:'Make points, folds and zero intervals for a square rule.',return:'Show someone your picture. Which marks are your ideas, and which came from the rule?',
 plot:'Choose an input and your proposed output, then add the point. You can keep unexpected points.',
 compare:'Your marks stay here. The solid curve and table come from the written rule.',
 zeroes:'Mark your idea, or choose to show the rule’s curve. Your marks stay yours either way.',
 model:'A known number rule, not measured data. A few dots alone do not prove a smooth continuation.',
 provenance:'The curve and its values are supplied by the written rule. Your points, fold, idea and intervals stay unchanged; they are not a score.',
 fallback:'Your new marks are still here. The model view could not be reopened safely, so this page shows your picture alone. Download Notes or retry the model view.',
 refused:'This model view could not be opened safely. Your picture and earlier work are unchanged. Download Notes or try again.',
 keepRefused:'This picture could not be kept safely. Your marks and earlier versions are unchanged.',
 limit:'This picture holds eight proposed points. Remove a point or start a new blank picture before adding one.',
 bandOrder:'Choose a left end that is no farther right than the right end. Your earlier intervals are unchanged.',
 exampleUnavailable:'This earlier example picture cannot be drawn. Its words and your picture are still here.',
 unknown:'This earlier format stays unchanged in Notes. You can still make another picture.',
 stale:'The kept pictures changed. Reopen them before continuing.',
 saved:'When kept, this picture was saved on this device.',session:'When kept, saving was off. Download Notes to keep a file.',uncertain:'When kept, device saving was not confirmed. Download Notes to keep a file.',
 grownup:'Supplied-reference views and constructed marks are not independent calculation, oral explanation, attention or mastery. The multiplications shown here may count as exposure to those facts elsewhere in this explorer’s notebook. No new answer or attempt is recorded.'
});
