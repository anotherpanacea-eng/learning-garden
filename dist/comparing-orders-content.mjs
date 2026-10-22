export const comparisonModes=Object.freeze(['compare','return']);
export const comparisonSupport=Object.freeze(['picturedSource','handling','help','together','narrationRequested','feedback']);
export const comparisonSignatures=Object.freeze(['bundle:0:2:3','bundle:0:1:1','bundle:0:2:2','bundle:0:1:3','bundle:0:1:2','bundle:0:1:0']);

const text=Object.freeze({
 entryTitle:'Comparing supply orders',entryIntro:'Two questions can use the same numbers. Open either picture to see what the answer counts.',
 chooseCompare:'Pip 23, Dot 11: compare two crates',chooseReturn:'Pip 23, return 11: change one crate',start:'Start these pictures',
 pipCrate:"Pip's crate",dotCrate:"Dot's crate",pipTable:"Pip's table",storeTray:'Store tray',answerTitle:'Our answer for this question',currentCheck:'Current check',earlierCheck:'Earlier check',keptTitle:'Kept draft',
 compareTitle:'Match two crates',comparePrompt:'Pip has 23 pretend seed counters. Dot has 11. Match the counters they both have. How many more counters does Pip have than Dot?',
 compareSource:"Pip's crate: two tens and three ones make 23. Dot's crate: one ten and one one make 11.",
 compareStatus:'Matched: {paired} counters in each crate. Pip has {extra} unmatched. Dot has {dotLeft} unmatched.',
 matchTen:'Match one ten from each crate',undoTen:'Undo one matched ten pair',matchOne:'Match one loose counter from each crate',undoOne:'Undo one matched loose pair',resetCompare:'Reset this matching picture',
 returnTitle:'Return from one crate',returnPrompt:'Pip starts with 23 pretend seed counters. Return 11 to the store tray. How many remain with Pip?',
 returnSource:"Pip's table starts with two tens and three ones: 23 counters. The store asks for 11.",
 returnStatus:"Pip's table: {tableTens} tens and {tableOnes} ones, {table} counters. Store tray: {storeTens} tens and {storeOnes} ones, {store} counters.",
 returnTen:'Return one wrapped ten',bringTen:'Bring back one wrapped ten',returnOne:'Return one loose counter',bringOne:'Bring back one loose counter',resetReturn:'Reset this returning picture',
 numberLabel:'Our proposed number',meaningLabel:'What does our number count?',check:'Check our number and meaning',keep:'Keep this draft',replace:'Replace our kept draft',other:'Choose the other question',
 compareBoth:'All counters in both crates together',compareExtra:"Pip's extra counters compared with Dot's crate",compareRemaining:'Counters left after Pip returned some',
 returnExtra:"The gap between Pip's and Dot's separate crates",returnStart:'All counters Pip started with',returnRemaining:"Counters still on Pip's table after the return",
 syntax:'Enter a whole number from 0 to 99 using digits, then choose what it counts. You can revise or keep a draft.',
 numberMatch:'Your number matches the supplied result: 23 − 11 = 12.',numberDifferent:'Your number differs from the supplied result: 23 − 11 = 12. You can revise or keep it.',
 compareMeaning:"Here, 12 counts Pip's extra counters compared with Dot's crate. Matching did not take any counters away.",
 returnMeaning:"Here, 12 counts the counters still on Pip's table after 11 moved to the store tray.",
 meaningMatch:'Your chosen meaning fits this story.',meaningDifferent:'Your chosen meaning describes a different story.',
 compareComplete:'The comparison picture is complete: all 11 Dot counters are matched. Pip has 12 unmatched.',
 compareIncomplete:'The comparison picture is still being matched. A number answer did not finish the picture.',
 returnComplete:'The return picture is complete: 11 are in the store tray and 12 remain with Pip.',
 returnIncomplete:'The return picture is still in progress. A number answer did not move counters.',
 helpTitle:'Look at what changes',helpBody:"For comparison, pair equal amounts but leave both crates full. Pip's unmatched counters show how many more. For return, move counters out of Pip's table; the ones still there show how many remain.",
 talk:'How can the same number count different things in these two pictures?',together:'We worked together',hear:'Hear this request',
 history:'Earlier checks and kept copy',earlier:'Earlier picture at this check',keptNotice:'A copy of this draft is kept.',
 replacePrompt:"Replace this question's earlier kept draft with the current picture, number, and meaning? The earlier copy will leave local history. Download notes first if you want it.",
 replaceConfirm:'Replace kept draft',cancel:'Cancel',
 cap:'The next check will replace this question\'s oldest local check. Download notes first if you want that earlier check.'
});
export const comparisonTextKeys=Object.freeze(Object.keys(text));
export function comparisonSource(){return {version:1,id:'crate-23-11',pip:23,other:11,pipTens:2,pipOnes:3,otherTens:1,otherOnes:1,answer:12,text:{...text},choiceOrder:{compare:['both','extra','remaining'],return:['extra','start','remaining']}};}
