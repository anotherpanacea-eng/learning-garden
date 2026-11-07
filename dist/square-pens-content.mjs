// Original, finite paper-model teaching. No learner or notebook data.
export const squarePensInvitations=Object.freeze([[3,4],[5,12],[6,8],[1,1],[2,3],[4,3]].map(Object.freeze));
export const squarePensWhy=Object.freeze([
 'This right triangle has short sides 3 and 4 units. The square marks its right angle.',
 'Four copies fit inside a square frame, 7 units on each side. Each triangle is half a 3-by-4 rectangle.',
 'Each middle side is a copy of the triangle’s long side. A triangle’s angles total 180°. Take away its square corner: its other two angles, α and β, total 90°. At each middle corner, one of each meets on a straight edge. The middle corner is 180° minus 90°: another 90°.',
 'Move the same pieces. The frame and the four triangles keep the same areas.',
 'The empty squares are 9 and 16 square units. Together they make 25 square units, just like the middle square.',
 'Area is not side length. The middle square has area 25 square units. Because 5 × 5 = 25, its side is 5 units.',
]);

// A separate unknown and material within the same visit-local paper board.
export const missingSquareInvitations=Object.freeze([[5,3],[13,5],[10,8],[5,4],[4,2],[2,1]].map(Object.freeze));
export const missingSquareCopy=Object.freeze({
 title:'Find a short side',
 intro:'Pip knows the long side and one short side of a right-triangle paper plan. What is the other short side?',
 buildKept:'Your Build pieces are kept.',
 c:'Long side c',a:'Known short side a',turn:'Turn this triangle',another:'Try another triangle',
 steps:Object.freeze(['Compare areas','Take away','Find the side']),
 prompts:Object.freeze([
  'In a right triangle, the long-side square has the same area as the two short-side squares together. Build shows why. Which area will be left when we take away the known square?',
  'Take away the known square’s area. The area left is the same as the other short-side square’s area.',
  'Now find a length whose square has that area.',
 ]),
 lShape:'The L-shaped space has that area; it is not itself a square. We are comparing areas.',
 separate:'A separate square with the remaining area.',
 positive:'We choose the positive length.',
 contrast:'Add the two small square areas to find the long-side area. Subtract one small square area from the long-side area to find the other.',
});

// Original two-position plans; the cursor advances before choosing its next row.
export const gridDistanceInvitations=Object.freeze([[1,1,4,5],[10,9,4,1],[2,8,7,8],[6,6,6,6],[3,3,5,6],[0,0,12,12]].map(Object.freeze));
export const acrossPlanCopy=Object.freeze({
 title:'Across the plan',
 intro:'Pip is comparing two connections on a paper plan for the library garden. How does a straight segment compare with following the grid edges?',
 reminder:'A coordinate pair gives a position: x across first, then y up from zero. To measure between two positions, count the intervals between them.',
 steps:Object.freeze(['Count intervals','Compare squares','Find the distance']),
 moveA:'Move A',moveB:'Move B',x:'x across',y:'y up',corner:'Use the other corner',another:'Try another plan',
 edge:'Following the grid edges',straight:'Straight segment',unitKey:'One grid interval is 1 length unit.',
 coincident:'A and B share this position.',
 traceNext:'Trace next interval',traceBack:'Trace back',traceWhole:'Show the whole edge route',traceZero:'There are no edge intervals between these positions.',
 kept:'Your other triangle plans are kept.',
 return:'When there is room, move both points the same amount. What stays the same, and why?',
 returnTriangle:'Keep the endpoints and try the other corner. What changes in the route, and what stays the same?',
 model:'This is a made-up paper plan, not a real path to walk.',
 count:'The edge route changes one direction at a time. Count the intervals, not the endpoint dots. Which connection looks shorter?',
 squareCorner:'The turn on the grid edges makes a square corner. The straight segment is across from that corner.',
 squares:'This is a right triangle. Build shows why the square on its long side has the area of the two short-side squares together. Use the horizontal and vertical changes as its short sides.',
 areaQuestion:'is an area, not the distance. What positive length has that square?',
 positive:'We choose the positive length.',
 shorter:'Both direction changes are positive. Going around the corner is longer than the straight segment.',
 axisCount:'These points share one grid line. There is no turn. The straight and edge lines overlap here.',
 axisSquares:'Only one direction changes. There is no two-leg right triangle here, so no square calculation is needed.',
 sameCount:'A and B are at the same position. There are zero intervals between them.',
 sameSquares:'There is no triangle here and no square calculation is needed.',
 sameDistance:'The straight distance is 0 units. The edge route is also 0 units. Changing a point’s name does not move it.',
 adult:'This open paper model connects coordinate differences with the right-triangle square-area relationship. The complete plan is invented; it cannot tell anyone which real route is usable or safe. Coordinates are positions, while h and v are lengths between coordinates. For h,v>0, the edge route has length h+v and its square exceeds h²+v² by 2hv, so it is longer than the positive straight distance. When one difference is zero the distances are equal; when both are zero both are 0. The displayed counts, diagrams and roots are support, not an independent answer or course result. This first grid stays in nonnegative whole-number coordinates; it does not teach every quadrant, scale, radical simplification or surveying method. No new construction or reading response is saved.',
});
