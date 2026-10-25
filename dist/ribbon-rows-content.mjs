// Original fictional teaching copy and ribbon art. No imported lesson prose.
export const rowDials=[['sleepy','Bramble is sleepy','She chooses any legal move.'],['attention','Bramble is paying attention','She spots a win this turn. Otherwise, she guesses.'],['plan','Bramble has a plan','She follows a strategy.']];
export function rowsSource(count=2){if(count===3)return threeRowsSource();if(count!==2)return null;return {model:'ribbon-rows-v1',id:'two-rows',title:'Ribbon Rows',rule:'Take any number of ribbons from just one row. Take the last ribbon to win.',childWin:'You take the last ribbon. You win this one!',brambleWin:'Bramble takes the last ribbon. She wins this one.',frames:[
 {rows:[3,3],moves:[],text:'Two rows with three ribbons each. Your turn. Bramble wants to hand you matching rows.'},
 {rows:[3,3],moves:[{who:'child',row:0,take:2}],text:'You take two from Row 1. Now one row has one ribbon and the other has three. You could take a different number, but the rows would still stop matching.'},
 {rows:[1,3],moves:[{who:'bramble',row:1,take:2}],text:'Bramble takes the same two from Row 2. One and one: the rows match again. She can copy your take from the other row.'},
 {rows:[1,1],moves:[{who:'child',row:0,take:1},{who:'bramble',row:1,take:1}],text:'You take one ribbon. Bramble takes the other and wins. To try her plan yourself, make the rows match on your turn. If you already have matching rows, no move can keep them matching.'}
]};}

export function threeRowsSource(){return {model:'ribbon-rows-three-v1',id:'three-rows',title:'Ribbon Rows: three rows',rule:'Take any number of ribbons from just one row. Take the last ribbon to win.',childWin:'You take the last ribbon. You win this one!',brambleWin:'Bramble takes the last ribbon. She wins this one.',practiceStart:[1,2,4],frames:[
 {rows:[1,2,4],moves:[],text:'Think in bundles of 4, 2 and 1. In each row, use the biggest bundle that fits, then the next size. Seven splits into 4 + 2 + 1; six into 4 + 2; five into 4 + 1. Keep each row separate.'},
 {rows:[1,2,4],moves:[{who:'child',row:2,take:1}],text:'Take one from Row 3. Its three ribbons split into 2 + 1. Now there are two bundles of 2 and two bundles of 1. Every size has a partner; no bundle of 4 is left unpaired.'},
 {rows:[1,2,3],moves:[{who:'child',row:0,take:1},{who:'bramble',row:2,take:1}],text:'You take the one in Row 1. In the middle picture, one 1-bundle is now unpaired. Bramble takes one from Row 3, changing its three to two. The two 2-bundles pair again.'},
 {rows:[3,5,7],moves:[{who:'child',row:0,take:1}],text:'Three becomes two. Now there are two bundles of each size: two 4s, two 2s and two 1s. Find partners in the same size column, even when their rows have different totals.'},
 {rows:[1,1,2],moves:[{who:'child',row:2,take:2}],text:'Four ribbons altogether is an even total. But the single 2-bundle has no partner! Take those two ribbons to leave two 1-bundles. An even total is not enough: every bundle size must pair.'},
 {rows:[1,2,3],moves:[],text:'These rows do not match, but their bundles pair. If all sizes already pair on your turn, every take breaks the pattern and a careful rival can restore it. Matching whole rows is not enough: 3, 3, 2 leaves an unpaired 2-bundle. Try 1, 2, 4 on the practice board: can you leave all sizes paired?'}
]};}
