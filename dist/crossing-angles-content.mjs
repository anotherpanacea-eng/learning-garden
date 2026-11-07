// Original paper-model teaching copy. These are invitations and help, not assessment.
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const crossingCopy=freeze({
 title:'Crossing Angles',
 instruction:'Turn two straight strips. Compare angles across the crossing and beside each other.',
 modelNote:'An exact paper model of two straight lines. The screen is not a protractor or a building plan.',
 arcLegend:'Matching arc marks show equal angles. A square mark shows 90°.',
 straightTurn:'A straight turn is a half turn of 180°.',
 lifetime:'This work stays during your Copy Frame visit. Leaving or reloading clears it; nothing is saved in Notes.',
 adultNote:'An exact paper model, not measurement or construction advice. Worked values and Hear are help. Exploration here is not assessed or evidence of independent understanding, and creates no Notes record.',
 panelNote:'Panels are fitted to separate frames. Use their written dimensions to compare sizes.',
 panelWaitingNote:'These are my waiting panel dimensions, not the worked example.',
 panelLabel:'My waiting Copy Frame panel',
 insetLabel:'Crossing enlarged: same angles',
 subscriptNote:'x₁ + y₁ = 180° and x₂ + y₂ = 180°. The subscripts keep the two pictures separate; different names do not prove different sizes.',
 nullContext:'Your waiting panel could not be copied. Go back to Copy Frame to choose a panel, or keep exploring crossing angles here.'
});
export const crossingPrompts=freeze([
 {title:'Across or beside?',text:'Try 60°. Which angle is opposite AOB? Name either angle beside AOB. Use their rays to explain.'},
 {title:'A common neighbor',text:'Try 60°. Compare AOB and COD using their common neighbor BOC. Both complete a straight turn with BOC.'},
 {title:'Four right angles',text:'Try 90°, then 60°. At which setting are all four angles equal?'},
 {title:'A narrow crossing',text:'Try 15°. Name the smaller opposite pair. Now try 165°: which pair is smaller? Do neighbors still make 180°?'},
 {title:'Turn the picture',text:'Turn the whole picture. Do the measures change when the picture turns?'},
 {title:'Try another crossing',text:'Choose 135° or another angle. Explain the opposite pair using a shared straight turn, without measuring the picture.'}
]);
export const crossingCards=freeze([
 {title:'Which angle?',text:'The middle letter names the corner: angle AOB turns from OA to OB at O. At a crossing, opposite angles meet only at O. Adjacent angles also share a ray. AOB and COD are opposite. AOB and BOC are adjacent. This rule needs two straight lines crossing.'},
 {title:'Why opposite angles match',steps:[
  {text:'A, O and C lie on one straight line. AOB + BOC = 180°. In this example, 60° + 120° = 180°.',equations:['AOB + BOC = 180°','60° + 120° = 180°']},
  {text:'B, O and D also lie on one straight line. BOC + COD = 180°. Here, 120° + 60° = 180°.',equations:['BOC + COD = 180°','120° + 60° = 180°']},
  {text:'AOB and COD each fill what is left after the same BOC angle is taken from 180°. They must be equal. The numbers may change; the same reasoning works whenever two straight lines cross. The other opposite pair matches for the same reason.',equations:['AOB = 180° − BOC','COD = 180° − BOC','AOB = COD']}
 ]},
 {title:'Equal does not always make 180°',text:'Where two straight lines cross, opposite angles are equal and each neighboring pair sums 180°. At 60°, AOB and COD are 60° and 60°; those two do not make 180°. At 90°, every angle is 90°. Only at this setting does an opposite pair also make 180°, and neighbors are equal too. Turning the drawing changes neither rule.'},
 {title:'Crossed ribbons on my panel',text:'Here are the original and my waiting copy from Copy Frame. Join each rectangle’s opposite corners. At each crossing, opposite angles match. A rectangle’s four outside corners are right angles, but its diagonal crossing need not be a right angle. Among rectangles, only a square has perpendicular diagonals. Try changing one panel side in Copy Frame, then return to compare again.'}
]);
