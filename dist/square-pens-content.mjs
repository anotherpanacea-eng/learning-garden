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
