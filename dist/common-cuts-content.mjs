// Installed original copy. This catalog is never loaded from learner data.
export const commonCopy = Object.freeze({
 title:'Common Cuts',
 introduction:'Moss has two ribbons for the gathering. Change their equal pieces until the piece sizes match. Keep the colored ends still.',
 chooser:'Choose two ribbons.',
 whole:'Both ribbons use the same-sized whole, from 0 to 1. Their colored amounts can differ.',
 visit:'Your cuts stay while you are at this table. Leaving starts a fresh visit.',
 chooseAnother:'Choose another pair. Your cuts for each pair stay while you are at this table.',
 request:'Give both ribbons the same-sized pieces without moving either colored end.',
 split2:'Split each piece in 2',split3:'Split each piece in 3',undo:'Undo last cut',compare:'Compare the pieces',
 start:'These are the starting equal pieces. Count spaces, not dividing marks.',
 undoChange:'The last dividing marks were removed. The colored end stayed still; only the surviving larger-piece boundaries remain.',
 bound:'This table shows at most 12 equal pieces in a whole. You can undo a cut and try another way.',
 talk:'How did the labels change while the colored ends stayed still? What makes the counts comparable now?',
 grownUp:'All labels and explanations here are supplied model readouts. Button use and narration do not establish independent understanding. This explores a common-unit method; endpoints and benchmarks are useful ways to compare too.',
 exampleLabel:'A separate example: half and quarter.',
 exampleNotice:'These are different ribbons. Example controls do not change your chosen pair.',
 exampleFrames:Object.freeze([
  'A has 1/2 colored and B has 1/4. Each has one colored piece, but those pieces are different sizes. One piece each does not mean equal amounts.',
  "Split each of A’s halves in 2. A is now 2/4 and B is 1/4. Both count quarter-size pieces of the same-sized whole; 2/4 is greater than 1/4. Neither colored end moved.",
  'Undo that split. A has 1/2 again and B still has 1/4. We changed the dividing marks, not the amounts.'
 ]),
 previous:'Previous picture',next:'Next picture',back:'Back to our ribbons',hear:'Hear this picture.'
});
export const commonOriginalText=(letter,m)=>`Ribbon ${letter} started as ${m.originalNumerator}/${m.originalDenominator} of its whole.`;
export const commonCurrentText=m=>`Now ${m.coloredCount} of ${m.denominator} equal pieces are colored: ${m.numerator}/${m.denominator}. The colored end is still at ${m.originalNumerator}/${m.originalDenominator}.`;
export const commonUnitText=m=>`Each current piece is 1/${m.denominator} of this same-sized whole.`;
export const commonChangeText=m=>m.lastAction?.type==='split'?`Each old piece became ${m.lastAction.factor} smaller equal pieces. Both counts changed; the amount did not. Dashed marks are the cuts just added.`:m.lastAction?.type==='undo'?commonCopy.undoChange:commonCopy.start;
