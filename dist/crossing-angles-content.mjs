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
 sharedRotation:'Turning this picture also turns Explore and Triangle corners. Your waiting Copy Frame panel stays unchanged.',
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
export const triangleCopy=freeze({
 instruction:'A triangle’s corners can fill a straight turn. Gather them, then use parallel lines to explain why.',
 modelNote:'An exact paper model of straight sides in a flat plane. Model pieces fit exactly; cut paper fits approximately. This is not a building plan.',
 definition:'A closed shape with three straight sides',
 naming:'A, B, C name points; a, b, c name their interior angles.',
 nullContext:'Your waiting panel could not be copied. Choose Free triangle, or go back to Copy Frame.',
 freeCaption:'Choosing a and b fixes the third corner. Why every triangle? explains the connection.',
 panelCaption:'This half uses the width and height sides meeting at the right-angle corner B, and one diagonal of your copied rectangle. Turning the picture does not change those parts.',
 sizeNote:'These display copies change drawing size, not angle.',
 rotationNote:'Turning this picture also turns Explore and Two crossings. Its copied dimensions stay unchanged.',
 settingsNote:'Your free triangle settings are waiting. This triangle uses half of your copied rectangle.',
 workedExample:'To find a missing interior angle, take the two known angles from 180°. For example, 180°−45°−60°=75°. You can try a=45° and b=60° in Free triangle, then explain why the total is a half turn.',
 adultNote:'Its triangle views distinguish gathering one example from a parallel-line argument for all triangles in the stated flat model. Its values, diagrams and worked subtraction are support, not evidence of independent angle reasoning. Those triangle views do not qualify physical cutting, real structures, polygons or a full geometry course.',
 modes:{free:'Free triangle',panel:'My waiting panel'},views:{gather:'Gather corners',reason:'Why every triangle?',outside:'Outside corner'},
 gather:[
 'Look at the three inside corners. The introduction tells us the destination is a straight turn. Predict how each corner would need to move or turn to join the others.',
 'These are copies of this triangle’s corners. They keep their angles when moved or turned. Next, turn the a and b copies a half turn and bring all three to one point.',
 'The three corners fill a straight turn: a+c+b=180°. This exact model arranges them for us. It demonstrates this triangle; trying more triangles is useful, but examples alone do not explain every triangle. Choose Why every triangle? for a reason.'
 ],reason:[
 'Start with any triangle with three straight sides in this flat plane. Through C, we can draw a line parallel to AB. The next step adds it.',
 'AC crosses the two parallel lines. The angle beside c on the left of this unturned construction equals a: they are alternate interior angles. Turning the whole construction does not change that relation.',
 'BC crosses the same parallel lines, so the angle beside c on the other side equals b, also by alternate interior angles. Those two copied angles and c fill the straight turn at C. Therefore a+c+b=180°. The argument uses the parallel directions, not this triangle’s chosen sizes, so it works for every nondegenerate triangle in this flat model.'
 ],
 outside:'Extend the side from B through C. The marked outside angle sits beside c on a straight line, so c+outside=180°. The triangle also gives a+b+c=180°. Taking the same c away from both totals leaves outside=a+b: the two far inside corners.',
 outsideSummary:'One adjacent exterior angle, not all the space outside the triangle.'
});
export const trianglePrompts=freeze([
 {title:'Make a prediction',text:'Use Gather corners. Before the last move, predict which copies need turning and where they will meet.'},
 {title:'Find the reason',text:'Use Why every triangle? Explain how each side crossing the parallel lines gives a matching angle.'},
 {title:'A different triangle',text:'Try a=15°, b=150°, then b=45°, a=90°. How does the shape change? Which part of the explanation stays?'},
 {title:'Bigger, same corners',text:'Change Drawing size, then turn the picture. Do the chosen angle values change? Why does the total stay the same?'},
 {title:'The outside shortcut',text:'Use Outside corner. Explain why its value equals a+b without adding c. Try a triangle with an obtuse corner too.'},
 {title:'Return to the design',text:'Choose My waiting panel. Find the right corner and explain why its other two angles add to 90°.'}
]);
export const trianglePanelPrompts=freeze([
 {title:'Make a prediction',text:'Gather the three corners of this half-panel. Which copies need turning? What does its right corner contribute?'},
 {title:'Find the reason',text:'Use Why every triangle? Follow AC and BC across the parallel lines. Which copied angle matches each inside corner?'},
 {title:'A different triangle',text:'Change a copied side back in Copy Frame and return. The shape can change: does the straight-turn argument still apply?'},
 {title:'Bigger, same corners',text:'Turn this picture. Which dimensions and right-angle fact stay the same?'},
 {title:'The outside shortcut',text:'Use Outside corner. Explain outside=a+90° and why that does not give a numeric value for a.'},
 {title:'Return to the design',text:'Go back to Copy Frame. Which side or diagonal became each part of this triangle? Return to compare the new copied dimensions.'}
]);

export const polygonCopy=freeze({
 header:'Polygon frames',
 instruction:'A triangle contributes 180°. Split a larger frame to find all its corners, then compare one corner with a whole lap.',
 modes:{free:'Free frame',panel:'My waiting panel'},
 views:{split:'Split the frame',corner:'One corner',walk:'Walk the edge'},
 definition:'A polygon is a closed shape with straight sides that do not cross. These frames are convex: no inward dents or straight-through corners.',
 regularDefinition:'Regular means all sides equal and all corners equal.',
 naming:'A is the chosen corner, not a fixed screen position.',
 freeCaption:'This is a chosen paper frame, not a measured sign.',
 panelCaption:'Your free frame is waiting. This outline uses your copied rectangle.',
 stretched:'Irregular: a stretched regular frame.',
 cornerNote:'Changing the chosen corner starts a new split and walk. Your other mode is kept.',
 sidesNote:'Changing the side count starts a new frame. Your Triangle corners choices and waiting-panel work are kept.',
 rotationNote:'Turning the whole picture also turns the other Crossing Angles views; copied dimensions stay unchanged.',
 walkLegend:'Hollow ring: start A. The marker’s leader shows the current corner; its arrow points along the next side.',
 modelNote:'Ideal straight-sided polygons in a flat plane. These frames stay convex. Drawings and formulas are help, not measurements or building plans.',
 nullContext:'Your waiting panel could not be copied. Choose Free frame, or go back to Copy Frame.',
 adultNote:'Polygon frames teaches a convex fan argument and total-versus-one-corner reasoning. Regularity is sufficient for equal corners; rectangles have their own right-angle facts. Guided splits and turns are not independent fluency, physical measurement, polygon mastery or complete geometry coverage.'
});
export const polygonPrompts=freeze([
 {title:'Count the pieces',text:'Use Split the frame. If a diagonal is needed, add one at a time. Which pieces are triangles, and when are they all triangles?'},
 {title:'Another starting corner',text:'Finish a split, then choose another corner. Why do you still get the same total?'},
 {title:'Regular or stretched?',text:'Keep the side count and switch Regular to Stretched. Which total stays? Can you still divide to find every corner?'},
 {title:'One corner, all corners',text:'Use One corner. For a regular pentagon, compare the 540° total with the 108° corner. Try 7 sides: keep the answer as a division; do not round.'},
 {title:'One complete turn',text:"Walk the edge. At the end, why is the arrow's original direction back even though the turns add to 360°?"},
 {title:'Back to the design',text:'Choose My waiting panel. Use its sides and diagonal to explain a polygon total, then return to your free frame.'}
]);
export const polygonPanelPrompts=freeze([
 {title:'Count the pieces',text:'Split this rectangle from A. How many triangles fill it?'},
 {title:'Another starting corner',text:'Split from another rectangle corner. Explain why both triangles still give 360°.'},
 {title:'Regular or stretched?',text:'This rectangle has four right corners. Does that alone tell you all four sides are equal? Explain the square case too.'},
 {title:'One corner, all corners',text:'Use One corner. Explain the difference between 360° total and 90° at each corner.'},
 {title:'One complete turn',text:'Walk the four quarter turns (90° each). Explain why one full lap is 360°.'},
 {title:'Back to the design',text:'Change a side in Copy Frame and return. What can change, and which rectangle angle facts remain?'}
]);
