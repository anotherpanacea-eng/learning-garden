// Original, finite model plans. No learner data or external lesson text.
export const pavingCopy={
 idea:'Keep the old square. Count only the new tiles when you ask what was added. Old and new together make the whole finished square.',
 patches:'The bottom patch has one tile for each old column. The right patch has one for each old row. Neither patch includes the missing corner. Count that corner once.',
 reminder:'Keep the old tiles. Add or remove the three new pieces.',
 reference:'Old square: {n} by {n}. Finished goal: {next} by {next}.',
 addedPrompt:'How many NEW tiles are needed to finish the bigger square?',
 totalPrompt:'How many tiles will the FINISHED square have altogether?',
 help:'The old square stays in the top left. Count each new piece once: the bottom patch, the right patch, and the one corner. The two long patches stop before the corner. Added tiles do not include the old square. The finished total includes both old and new. You may keep a plan with pieces missing.',
 addedBlank:'No definite new-tile count was proposed.',addedFits:'The proposed new-tile count fits the finished goal.',addedDifferent:'The proposed new-tile count differs from what the finished goal needs.',
 totalBlank:'No definite finished total was proposed.',totalFits:'The proposed finished total fits the goal square.',totalDifferent:'The proposed finished total differs from the goal square.',
 modelComplete:'All three new pieces are in place; our model is the finished square.',modelIncomplete:'Our model is not the finished square yet. Missing pieces may stay open to change.',
 counts:'Old {oldCount} + bottom {rowCount} + right {columnCount} + corner {cornerCount} = {totalNow} tiles now; {addedNow} were added. The finished goal needs {addedNeeded} new tiles and has {targetTotal} tiles altogether.',
 ending:'These are separate descriptions: what was proposed, and what was built. Count the pictured pieces together.',
 currentCounts:'Old: {oldCount}. Added now: {addedNow}. Tiles now: {totalNow}.',
 narration:'Bottom patch: {rowCount} tiles. Right patch: {columnCount} tiles. Corner: {cornerCount} tile. Old: {oldCount}. Added now: {addedNow}. Tiles now: {totalNow}.'
};
const example={n:3,masks:[0,3,7],captions:[
 'Keep these 9 old tiles. We are planning a 4-by-4 square.',
 'Add 3 below and 3 to the right. That is 6 new tiles and 15 tiles now. One corner is still missing.',
 'Add the one corner. 3 + 3 + 1 makes 7 new tiles. 9 old + 7 new makes 16 tiles in the finished square.'
]};
export const pavingCases=Array.from({length:11},(_,i)=>{const n=i+1;return {version:1,model:'square-growth-v1',id:`paving-${n}`,title:`Plan ${n}: grow a square`,n,request:`Keep the old ${n}-by-${n} square. Make a ${n+1}-by-${n+1} square by adding tiles below and to the right.`,copy:structuredClone(pavingCopy),example:structuredClone(example)};});
