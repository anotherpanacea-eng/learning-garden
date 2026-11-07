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
 {title:'Crossed ribbons on my panel',text:'Here are the original and my waiting copy from Copy Frame. Join each rectangle’s opposite corners. At each crossing, opposite angles match. A rectangle’s four outside corners are right angles, but its diagonal crossing need not be a right angle. Among rectangles, only a square has perpendicular diagonals. Try changing one panel side in Copy Frame, then return to compare again.'},
 {title:'Same position, same turn',steps:[
  {text:'A straight line keeps the same direction all along. These two lines are parallel in this flat paper model. A half turn is 180°; beside a 60° angle at one crossing sits 120°, and the opposite angle is 60°. Each step has a reason.',equations:['b = 180° − 60° = 120°','c = a = 60°']},
  {text:'Slide a tracing of crossing O along the transversal to P without turning it. Its transversal direction stays on the same straight line. Because the other two lines are parallel, their directions match too.',equations:[]},
  {text:'Both directions match, so the angle between them is unchanged. Angles a and e have the same relative position: corresponding angles. In this example both are 60°. The same direction argument works for any two parallel straight lines in this flat plane.',equations:['a = e','a = 60° so e = 60°']}
 ]},
 {title:'Inside, opposite sides',text:'Angles a and g lie between the parallel lines on opposite sides of the transversal. They are alternate interior angles. First use corresponding angles: a=e. At P, e and g are opposite, so e=g. Therefore a=g. In this example, both are 60°. The equality needs the two lines to be parallel.',equations:['a = e','e = g','a = g']},
 {title:'Inside, same side',text:'Angles a and h lie between the parallel lines on the same side of the transversal. They are co-interior angles. First a=e because the lines are parallel. At P, e and h fill a straight turn: e+h=180°. Replace e with the equal a, so a+h=180°. Here, 60°+120°=180°. Equal angles and angles making 180° are different relationships.',equations:['a = e','e + h = 180°','a + h = 180°','60° + 120° = 180°']},
 {title:'What a lean changes',text:'Keep angle a at 60° and lean the second line counterclockwise 10°. Now corresponding angle e is 50°, not 60°. The traced first-line direction does not line up with the second. These two lines are not parallel, so the parallel-angle rule cannot be used. Opposite angles at either single crossing still match. A diagram can show only short pieces: nonparallel lines may meet outside the picture.',equations:['a = 60°','e = 50°','a ≠ e']}

]);

export const twoCrossingsCopy=freeze({
 instruction:'Compare two crossings. Keep the lines parallel, or lean one line to see which rule needs that condition.',
 modelNote:'An exact paper model of straight lines in a flat plane. The drawn portions can be extended. This is not a protractor or a building plan.',
 legend:'The highlights pick two angles to compare. They do not say the angles are equal. Matching arrow marks on the two lines mean parallel.',
 header:'Follow a two-crossing example. The worked settings stay fixed here.',
 sharedAngle:'This free angle is shared with Explore. Here a, b, c and d name the angles that Explore calls AOB, BOC, COD and DOA.',
 sharedRotation:'Turning this picture also turns Explore. Your waiting Copy Frame panel stays unchanged.',
 leanNote:'Clockwise and counterclockwise are relative to the first line. Turning the whole picture keeps that relative turn.',
 retained:'This view keeps my copied panel dimensions. Return to Free strips to change those choices.',
 inside:'Inside means between the two width-side lines, even past the rectangle’s corners.',
 panelCaption:'These are the dimensions copied from my waiting Copy Frame panel. Opposite sides of this rectangle are parallel. The diagonal crosses them. Angle letters show relationships; this picture does not measure them. Inside means between the two width-side lines, even past the rectangle’s corners.',
 symbolicTable:'a: first angle; c = e = g = a; b = d = f = h = 180° − a.',
 tracingCaption:'The gray tracing copies the directions at O. It slides without turning. At the last position, compare its line direction with the second line.',
 aligned:'The directions line up: the lines are parallel.',
 leaning:'The second line leans: the traced line direction does not line up.',
 nullContext:'Your waiting panel could not be copied. Choose Free strips to explore two crossings, or go back to Copy Frame.',
 adultNote:'Two crossings teaches relationships in a chosen Euclidean line model. The copy and worked values are support. It does not assess unknown-angle fluency, certify the real panel or establish full geometry coverage.',
 workedCaption:'Worked example, not my settings.'
});
export const twoCrossingsPrompts=freeze([
 {title:'Find the condition',text:'Try 60° with Parallel. Compare the two angles in the same position. Now lean the second line 10°. What changed?'},
 {title:'Follow the tracing',text:'With Parallel selected, move the gray tracing from O to P. Which directions stay the same?'},
 {title:'Use opposite angles again',text:'Choose Inside, opposite sides. Use a matching-position pair and an opposite pair to explain why these two angles match when the lines are parallel.'},
 {title:'A total instead of equality',text:'Choose Inside, same side. At 60° with Parallel, explain 60°+120°=180°. Try a lean: does that total stay 180°?'},
 {title:'Turn and spread',text:'Keep Parallel and one angle. Change spacing or turn the picture. Which angle facts stay the same?'},
 {title:'Back to my panel',text:'Choose My waiting panel. Use its opposite sides and diagonal to explain one angle relationship. Change a side in Copy Frame and return: do the dimensions change, and does the parallel rule still apply?'}
]);
export const twoPanelPrompts=freeze([
 {title:'Find the condition',text:'The given outline is a rectangle. Which opposite sides stay parallel when extended?'},
 {title:'Follow the tracing',text:'Move the gray tracing from O to P. Which directions line up?'},
 {title:'Use opposite angles again',text:'Choose Inside, opposite sides. Use a=e and e=g to explain a=g.'},
 {title:'A total instead of equality',text:'Choose Inside, same side. Explain a+h=180° without measuring the picture.'},
 {title:'Turn the picture',text:'Turn this picture. Which dimensions and angle relationships stay the same?'},
 {title:'Back to my panel',text:'Go back to Copy Frame, change a side and return. Do the dimensions change, and are the opposite sides still parallel?'}
]);
