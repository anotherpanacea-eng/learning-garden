// Original fictional teaching copy and ribbon art. No imported lesson prose.
export const rowDials=[['sleepy','Bramble is sleepy','She chooses any legal move.'],['attention','Bramble is paying attention','She spots a win this turn. Otherwise, she guesses.'],['plan','Bramble has a plan','She follows a strategy.']];
export function rowsSource(){return {model:'ribbon-rows-v1',id:'two-rows',title:'Ribbon Rows',rule:'Take any number of ribbons from just one row. Take the last ribbon to win.',childWin:'You take the last ribbon. You win this one!',brambleWin:'Bramble takes the last ribbon. She wins this one.',frames:[
 {rows:[3,3],moves:[],text:'Two rows with three ribbons each. Your turn. Bramble wants to hand you matching rows.'},
 {rows:[3,3],moves:[{who:'child',row:0,take:2}],text:'You take two from Row 1. Now one row has one ribbon and the other has three. You could take a different number, but the rows would still stop matching.'},
 {rows:[1,3],moves:[{who:'bramble',row:1,take:2}],text:'Bramble takes the same two from Row 2. One and one: the rows match again. She can copy your take from the other row.'},
 {rows:[1,1],moves:[{who:'child',row:0,take:1},{who:'bramble',row:1,take:1}],text:'You take one ribbon. Bramble takes the other and wins. To try her plan yourself, make the rows match on your turn. If you already have matching rows, no move can keep them matching.'}
]};}
