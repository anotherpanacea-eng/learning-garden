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

export const matchingCopy=freeze({
 "title": "Matching triangles",
 "instruction": "Start with fixed parts. Build an outline, compare another build, then follow the point pairs.",
 "modelNote": "Ideal paper triangles in a flat plane. Exact parts define the model; the screen is not a ruler or protractor. Guided builds and poses are help, not assessment or construction advice.",
 "adultNote": "Matching triangles provides ideal constructions, rigid-motion support and provided correspondence. A missed manual overlap is not a noncongruence result. Circle facts support the stated criteria; this does not qualify independent compass/protractor work, all congruence problems, real material or mastery.",
 "nullContext": "Your waiting panel could not be copied. Choose Parts cards, or go back to Copy Frame.",
 "modes": {
  "parts": "Parts cards",
  "panel": "My waiting panel"
 },
 "views": {
  "build": "Build",
  "fit": "Compare",
  "letters": "Letters"
 },
 "circleRay": "A circle marks all points at one fixed distance from its center. A ray fixes a direction from a point.",
 "circleFacts": "Two different straight lines intersect in at most one point. Two distinct circles meet in at most two points; with a fixed center-to-center baseline, the meeting pair is reflected across that baseline. A line meets a circle in at most two points, symmetric about the perpendicular from its center.",
 "uniqueness": "Any valid triangle satisfying this card can be moved and turned so its fixed first side lies on DE (DF for RHS). Its remaining point must lie on the same determining guides. They permit one point or a reflected pair, hence one shape and size up to rigid motion. These chosen valid parts supply a triangle; the intersection facts explain why its shape and size are fixed.",
 "definition": "Congruent triangles have the same shape and size. One can be moved, turned or reflected exactly onto the other.",
 "naming": "The order ABC ↔ DEF pairs A with D, B with E, C with F. Lowercase side a is BC, opposite A; d is EF, opposite D. Likewise b = CA ↔ e = FD and c = AB ↔ f = DE. In ∠BAC the middle letter A names the angle’s vertex; ∠EDF is at D. Point names, side names and angle names do different jobs.",
 "notation": "To say they are congruent in this order, write △ABC ≅ △DEF. This says all corresponding sides and angles match, not merely the three parts on the card.",
 "miss": "A missed overlap is not proof that two triangles differ. These controls are help, not a test.",
 "panelReason": "The opposite rectangle sides match and the included corners B/E are 90°. Two sides and their included angle give SAS. Both halves also share the diagonal, so their three corresponding sides match for SSS. Their right corners, common hypotenuse and one equal leg also support RHS. We can reason without a numeric diagonal length."
});

export const matchingCases=freeze({
 "sss": {
  "title": "SSS — three sides",
  "givens": [
   "AB = DE = 5",
   "AC = DF = 4",
   "BC = EF = 3"
  ],
  "firstPart": "DE 5",
  "guide": "F must be 4 units from D and 3 from E, so it must lie on both circles.",
  "reason": "Fix DE, then draw the circle of distance 4 from D and the circle of distance 3 from E. F must lie on both. Their two meetings are reflections across DE, so they make the same shape and size. Three valid side lengths fix one triangle up to sliding, turning or flipping; one shape does not mean one drawing."
 },
 "sas": {
  "title": "SAS — two sides and the included angle",
  "givens": [
   "AB = DE = 8",
   "AC = DF = 5",
   "∠A = ∠D = 60°, between those sides"
  ],
  "firstPart": "DE 8",
  "guide": "Follow the 60° ray from D to the circle 5 units from D.",
  "reason": "Fix DE 8 and the 60° angle at D. F must be 5 units from D along that ray. One point on the chosen ray has that distance. The other side of DE reflects the whole construction. Two sides and the angle between them fix one triangle shape and size. The included angle matters."
 },
 "asa": {
  "title": "ASA — two angles and their included side",
  "givens": [
   "∠A = ∠D = 50°",
   "∠B = ∠E = 60°",
   "AB = DE = 5, the side between these angles"
  ],
  "firstPart": "DE 5",
  "guide": "Follow the 50° ray from D and 60° ray from E toward their meeting.",
  "reason": "Fix DE 5. The 50° ray from D and 60° ray from E can meet only once on the chosen side of DE, because two different straight lines meet at most once. Reflecting gives the other placement. Two angles and their included side fix one triangle shape and size."
 },
 "aas": {
  "title": "AAS — two angles and a corresponding side",
  "givens": [
   "∠A = ∠D = 50°",
   "∠C = ∠F = 70°",
   "AB = DE = 5"
  ],
  "firstPart": "DE 5",
  "guide": "The missing angle at E is 180° − 50° − 70° = 60°. Keep the 50° ray from D; the next step adds E’s ray.",
  "reason": "The third angle is 180°−50°−70°=60°. Now the known side DE lies between the 50° and 60° angles. The same ASA construction applies. Two angles and a corresponding side can fix the triangle even if that side was not between the two originally given angles."
 },
 "rhs": {
  "title": "RHS — right angle, hypotenuse and side",
  "givens": [
   "∠C = ∠F = 90°",
   "AB = DE = 5, the hypotenuse",
   "AC = DF = 4, one leg"
  ],
  "firstPart": "DF 4",
  "guide": "E must lie on the perpendicular through F and on the circle 5 units from D.",
  "reason": "Fix leg DF 4. The right corner at F puts E on the perpendicular through F. The circle of distance 5 from D meets that line at two reflected points, one on either side of DF. They make the same shape and size. A valid hypotenuse, one leg and the right angle fix one triangle. The hypotenuse is across the right angle, not a fixed screen direction."
 },
 "ssa": {
  "title": "SSA — two sides and a non-included angle",
  "givens": [
   "AC = DF = 6",
   "BC = EF = 4",
   "∠A = ∠D = 30°, not between the two known sides"
  ],
  "firstPart": "DF 6 at 30° from the DE ray",
  "guide": "Both light meeting points lie on the positive DE ray and 4 units from F. Which base is shorter?",
  "reason": "The circle of distance 4 from F meets the positive DE ray twice. Both closures, near and far, keep DF 6, EF 4 and the 30° angle at D. Their DE lengths differ, so the near and far closures are not congruent. That angle is not between the two known sides. These parts do not force one triangle; other non-included-angle data can have a different number of solutions."
 },
 "aaa": {
  "title": "AAA — three angles, no length",
  "givens": [
   "∠A = ∠D = 50°",
   "∠B = ∠E = 60°",
   "∠C = ∠F = 70°",
   "No length given"
  ],
  "firstPart": "",
  "guide": "The chosen base and 50°/60° rays locate this particular size; the angles alone did not choose that base.",
  "reason": "Both chosen sizes keep 50°, 60° and 70°. Enlarging every length keeps the directions and angles but changes the size. The parts card fixed no length, so more sizes are possible. Matching angles alone do not force congruent triangles."
 }
});

export const matchingPrompts=freeze([
 {
  "title": "Lay the parts",
  "text": "Use Build. Predict where the missing point can meet every given part, then reveal the guides."
 },
 {
  "title": "Another valid build",
  "text": "Try Another build. Is it only a turn or reflection, or can the shape or size change? Use Compare to investigate."
 },
 {
  "title": "Between which sides?",
  "text": "Compare SAS and SSA. Which given angle lies between the two given sides? Use Another build in SSA to see both the near and far closure. Why does that matter?"
 },
 {
  "title": "Angles and size",
  "text": "Choose AAA and change the build size. Line up the given parts. What did the angles fix, and what can still change?"
 },
 {
  "title": "Read the order",
  "text": "Use Letters and trace each point pair. Which side is opposite each point?"
 },
 {
  "title": "Back to the design",
  "text": "Choose My waiting panel. Find a SAS or SSS reason for its two halves to match."
 }
]);

export const matchingPanelPrompts=freeze([
 {
  "title": "Lay the parts",
  "text": "Add the diagonal. Which opposite sides match?"
 },
 {
  "title": "Another valid build",
  "text": "The two halves are fixed here. Turn and flip the copy, then use Line up the given parts."
 },
 {
  "title": "Between which sides?",
  "text": "The width and height sides meet at right corners. Which parts give the SAS reason?"
 },
 {
  "title": "Angles and size",
  "text": "Change a side in Copy Frame and return. What can change even though each half still has a right corner?"
 },
 {
  "title": "Read the order",
  "text": "Use Letters. Match the two widths, the two heights and the same diagonal."
 },
 {
  "title": "Back to the design",
  "text": "Return to Copy Frame, change one side and re-enter. Compare the new frozen dimensions with the unchanged rectangle reasoning."
 }
]);

// Original finite Angle Chase sketches. Keys are authored integers, never measurements.
export const chaseCopy=freeze({title:'Angle Chase',instruction:'The workshop needs notes on a batch of sketches. Find angles from the marked facts, then carry a fact to the next angle.',modelNote:'An invented diagram, not to scale. Use the stated facts, not the drawing’s size.',question:'Which relationship explains this step?',first:'Use the marked facts. You can choose another angle at any time.',retained:'Each sketch keeps its own work during this visit.',exampleTitle:'A different worked sketch',exampleNotice:'These numbers belong to another sketch. Your answers are kept.',polygonReturnInvitation:'For the triangle fan, choose Triangle corners → Polygon frames → Free frame → Split the frame. Your sketch stays here during this visit.',returnInvitation:'Back in Copy Frame, explore the right corners of a rectangle. These invented diagonal numbers are not measurements of a panel.',adultNote:'These finite number-and-reason checks do not grade an original proof, diagnose a level or establish learning. Another valid method can be discussed with an adult. A provided value is help; a draft is not a mathematical fact. The diagrams are not measurements or building instructions.',complete:'This sketch has a value and a reason at every marked angle. Shown solutions are help. Pick another sketch or change one.'});
export const chaseRules=freeze({regular:"A regular polygon's equal corners share its inside angle total.",equalOutside:'Equal positive outside turns of a regular polygon share 360°.',quad:'The four inside corners of a quadrilateral total 360°.',quadOutside:'Four positive outside turns of a convex quadrilateral total 360°.',line:'Angles on a straight line total 180°.',point:'Angles all the way around a point total 360°.',opposite:'Vertically opposite angles at the same crossing match.',triangle:'The three inside angles of a triangle total 180°.',parts:'Parts of a marked angle add to its whole.',exterior:'An outside triangle angle equals the sum of the two far inside angles.',corresponding:'Corresponding angles on parallel lines match.',alternate:'Alternate interior angles on parallel lines match.',cointerior:'Co-interior angles on parallel lines total 180°.',corner:'A rectangle corner is 90°.',insufficient:'These marked facts do not determine the angle.'});
const chaseTarget=(name,offered,accepted,hint,relations)=>({name,offered,accepted,hint,relations});
const relation=(text,formula,predecessor=null)=>({text,formula,predecessor});
const chaseFamilies=[
 {family:'crossing',familyLabel:'Across or beside?',facts:'A–O–C and B–O–D are straight lines crossing at O. a is AOB, x is BOC and y is DOA.',targets:[
 chaseTarget('x',['line','triangle','point'],['line'],'Which two marked angles fill the half turn on A–O–C?',{line:relation('A–O–C is straight: a + x = 180°.','a + x = 180°')}),
 chaseTarget('y',['opposite','line','triangle'],['opposite','line'],'Look across the crossing from x, or use the straight line B–O–D.',{opposite:relation('x and y are opposite at O: y = x.','y = x','x'),line:relation('B–O–D is straight: a + y = 180°.','a + y = 180°')})]},
 {family:'hub',familyLabel:'Around the hub',facts:'C–O–E is straight. p is the whole AOB angle containing y = AOE and z = EOB. q is BOC; x runs from OC through the lower part of the turn to OA.',targets:[
 chaseTarget('x',['point','opposite','triangle'],['point'],'The outer p arc includes y and z. Which three marked parts fill one whole turn?',{point:relation('p, q and x fill one whole turn at O: p + q + x = 360°.','p + q + x = 360°')}),
 chaseTarget('y',['line','opposite','triangle'],['line'],'C–O–E is straight. Which two marked parts fill its half turn?',{line:relation('C–O–E is straight: x + y = 180°.','x + y = 180°','x')}),
 chaseTarget('z',['parts','line','opposite'],['parts','line'],'The whole p contains y and z. There is also a straight line E–O–C.',{parts:relation('y and z are parts of p: y + z = p.','y + z = p','y'),line:relation('E–O–C is straight: z + q = 180°.','z + q = 180°')})]},
 {family:'triangle',familyLabel:'Inside, then outside',facts:'ABC is a triangle. A–B–D is straight with B between A and D. a is BAC, c is ACB, x is ABC and y is the outside angle CBD.',targets:[
 chaseTarget('x',['triangle','opposite','point'],['triangle'],'Use all three inside corners of ABC.',{triangle:relation('The inside corners of ABC total 180°: a + c + x = 180°.','a + c + x = 180°')}),
 chaseTarget('y',['line','exterior','opposite'],['line','exterior'],'y is outside beside x. You can also add the two far inside angles.',{line:relation('A–B–D is straight: x + y = 180°.','x + y = 180°','x'),exterior:relation('The outside angle CBD equals the two far inside corners: y = a + c.','y = a + c')})]},
 {family:'parallel',familyLabel:'Between parallel lines',facts:'A–P–B and C–Q–D are straight parallel lines, marked with matching arrows. R–P–Q–S is straight. a is BPQ; x is DQS, y is CQP and z is PQD.',targets:[
 chaseTarget('x',['corresponding','alternate','cointerior'],['corresponding'],'Find the matching parallel arrows. Trace the same position at P and Q.',{corresponding:relation('a and x are corresponding angles on the marked parallel lines: x = a.','x = a')}),
 chaseTarget('y',['opposite','alternate','triangle'],['opposite','alternate'],'y is opposite x at Q, and alternate to a between the marked parallel rails.',{opposite:relation('x and y are opposite at Q: y = x.','y = x','x'),alternate:relation('a and y are alternate interior angles on the marked parallel lines: y = a.','y = a')}),
 chaseTarget('z',['line','cointerior','opposite'],['line','cointerior'],'y and z share the half turn on P’s side of C–Q–D. Also compare a and z inside the rails.',{line:relation('C–Q–D is straight: y + z = 180°.','y + z = 180°','y'),cointerior:relation('a and z are co-interior angles on the marked parallel lines: a + z = 180°.','a + z = 180°')})]},
 {family:'rectangle',familyLabel:'Rectangle corners',facts:'ABCD is a rectangle with diagonal AC. All four whole corners are right. AB ∥ DC and AD ∥ BC. a is BAC, x is CAD, y is ACD and z is ACB.',targets:[
 chaseTarget('x',['corner','point','insufficient'],['corner'],'The two marked parts at A share one right corner, not a whole turn.',{corner:relation('a and x fill the right corner at A: a + x = 90°.','a + x = 90°')}),
 chaseTarget('y',['triangle','alternate','opposite'],['triangle','alternate'],'Triangle ADC has a right corner at D. The opposite rectangle sides are parallel too.',{triangle:relation('Triangle ADC has a right corner at D: x + 90° + y = 180°.','x + 90° + y = 180°','x'),alternate:relation('AB ∥ DC makes a and y alternate interior angles: y = a.','y = a')}),
 chaseTarget('z',['corner','alternate','opposite'],['corner','alternate'],'At C, the diagonal splits one right corner. You can also trace AD ∥ BC.',{corner:relation('y and z fill the right corner at C: y + z = 90°.','y + z = 90°','y'),alternate:relation('AD ∥ BC makes x and z alternate interior angles: z = x.','z = x','x')})]},
 {family:'regular',familyLabel:'Equal corners',facts:'This convex regular polygon has {n} sides. Regular means all sides and all inside corners are equal. n counts sides, not degrees. C–A–D is straight, with A between C and D. x is the inside angle BAC; y is the adjacent outside turn DAB. Equal angles let us share the inside total equally; equal sides alone would not.',targets:[
 chaseTarget('x',['regular','line','point'],['regular','line'],'Count n − 2 triangles for the inside total. Why may these corners share it equally?',{regular:relation('The inside total is (n − 2) × 180°. The equal inside corners share it: x = (n − 2) × 180° ÷ n.','x = (n − 2) × 180° ÷ n'),line:relation('C–A–D is straight: x + y = 180°.','x + y = 180°','y')}),
 chaseTarget('y',['line','equalOutside','opposite'],['line','equalOutside'],'Use the straight line at A, or share one full turn among the equal outside turns.',{line:relation('C–A–D is straight: x + y = 180°.','x + y = 180°','x'),equalOutside:relation('One positive outside turn at each corner totals 360°. These n turns are equal: y = 360° ÷ n.','y = 360° ÷ n')})]},
 {family:'quadrilateral',familyLabel:'Unequal corners',facts:'ABCD is a convex quadrilateral with unequal known inside corners: a is BAD, b is CBA and c is DCB. C–D–E is straight, with D between C and E. x is the inside angle ADC; y is the adjacent outside turn EDA. No equal sides, equal corners, right corners or parallel sides are given.',targets:[
 chaseTarget('x',['quad','regular','line'],['quad','line'],'The four inside corners total 360°. Which three are already known?',{quad:relation('The four inside corners of ABCD total 360°: a + b + c + x = 360°.','a + b + c + x = 360°'),line:relation('C–D–E is straight: x + y = 180°.','x + y = 180°','y')}),
 chaseTarget('y',['line','quadOutside','equalOutside'],['line','quadOutside'],'Use the straight line at D, or first find the outside turn beside each known inside corner.',{line:relation('C–D–E is straight: x + y = 180°.','x + y = 180°','x'),quadOutside:relation('One positive outside turn at each corner totals 360°: (180° − a) + (180° − b) + (180° − c) + y = 360°.','(180° − a) + (180° − b) + (180° − c) + y = 360°')})]}
];
const chasePackets=[
 [{a:43},{x:137,y:137}],[{a:68},{x:112,y:112}],[{a:117},{x:63,y:63}],
 [{p:105,q:135},{x:120,y:60,z:45}],[{p:115,q:120},{x:125,y:55,z:60}],[{p:125,q:140},{x:95,y:85,z:40}],
 [{a:37,c:68},{x:75,y:105}],[{a:42,c:61},{x:77,y:103}],[{a:29,c:84},{x:67,y:113}],
 [{a:35},{x:35,y:35,z:145}],[{a:52},{x:52,y:52,z:128}],[{a:68},{x:68,y:68,z:112}],
 [{a:25},{x:65,y:25,z:65}],[{a:37},{x:53,y:37,z:53}],[{a:58},{x:32,y:58,z:32}],
 [{n:5},{x:108,y:72}],[{n:6},{x:120,y:60}],[{n:8},{x:135,y:45}],
 [{a:80,b:110,c:95},{x:75,y:105}],[{a:95,b:100,c:85},{x:80,y:100}],[{a:105,b:80,c:70},{x:105,y:75}]
];
export const chaseCases=freeze(chasePackets.map(([givens,key],i)=>({...chaseFamilies[Math.floor(i/3)],givens,key,facts:chaseFamilies[Math.floor(i/3)].facts.replace('{n}',givens.n),variantLabel:givens.n?`Regular polygon · ${givens.n} sides`:`${chaseFamilies[Math.floor(i/3)].familyLabel} · sketch ${i%3+1}`,targets:chaseFamilies[Math.floor(i/3)].targets.map((t,j)=>({...t,offered:t.offered.map((_,k)=>t.offered[(k+i+j)%3])}))})));
export const chaseExamples=freeze(Object.fromEntries([
 ['crossing',{a:50},{x:130,y:130}],['hub',{p:110,q:132},{x:118,y:62,z:48}],['triangle',{a:40,c:64},{x:76,y:104}],['parallel',{a:40},{x:40,y:40,z:140}],['rectangle',{a:30},{x:60,y:30,z:60}],['regular',{n:10},{x:144,y:36}],['quadrilateral',{a:85,b:115,c:65},{x:95,y:85}]
].map(([family,givens,key],i)=>[family,{...chaseFamilies[i],givens,key,facts:chaseFamilies[i].facts.replace('{n}',givens.n)}])));
