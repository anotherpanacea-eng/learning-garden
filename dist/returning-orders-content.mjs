export const returnIds=Object.freeze(['return-12','return-17']);

const common=Object.freeze({
 title:'Returning seed counters',
 intro:"Pip's planning table has 42 pretend seed counters. The store tray waits beside it.",
 start:'Start this return',tableName:"Pip's table",storeName:'Store tray',
 sourceLine:'Start: four tens and two ones make 42 counters.',
 modelTip:"Opening a ten makes ten loose counters without changing the table's total. Returning counters changes how many remain on the table.",
 openTen:'Open one table ten into ten ones',makeTen:'Make one table ten from ten ones',
 returnTen:'Return one ten to the store tray',returnOne:'Return one loose counter to the store tray',
 bringTen:'Bring back one returned ten',bringOne:'Bring back one returned loose counter',
 resetModel:'Reset this table arrangement',
 tableLine:"Pip's table: wrapped tens {tens}; loose counters {ones}; all counters {table}.",
 storeLine:'Store tray: wrapped tens {tens}; loose counters {ones}; all counters {returned}.',
 targetLine:'Return {target} counters in all.',needLine:'Counters still to return: {left}.',
 doneLine:'The store tray has exactly {target}. The table has {remaining} left.',
 entryLabel:'Our proposed number remaining',check:'Check our number',keep:'Keep this draft',
 syntax:'Enter a whole number from 0 to 99 using digits. You can revise or keep your draft.',
 match:'Your number matches: 42 − {target} = {answer}.',
 different:'Your number is different from 42 − {target} = {answer}. You can revise or keep it.',
 modelIncomplete:'The pictured return is still in progress. A number answer does not move counters.',
 modelFinished:'The pictured return is complete. The number answer is a separate check.',
 helpTitle:'Why open a ten?',
 helpBody:"A ten has ten counters inside. You can open one ten to make ten loose ones without changing the table's total. Then move only the counters you return to the store tray. Check both trays together to find all 42.",
 exampleTitle:'A different example',
 exampleBody:'Start with 31 counters. Return 16: one ten and six ones. Open one ten, return a ten and six loose ones. Fifteen remain. Opening was a regroup; returning changed the table amount.',
 talk:'What changed when a ten opened? What changed when counters went to the store tray?',
 together:'We worked together',newCase:'Choose another return',hear:'Hear this request'
});
export const returnTextKeys=Object.freeze([...Object.keys(common),'caseLabel','prompt']);
export function returningCase(id){
 if(!returnIds.includes(id))return null;
 const target=id==='return-12'?12:17,ones=target-10;
 return {version:1,id,start:42,target,returnedTens:1,returnedOnes:ones,text:{...common,caseLabel:`Return ${target}: one ten and ${ones===2?'two':'seven'} ones`,prompt:`Pip starts with 42 pretend seed counters. Return ${target} to the store tray. How many remain on Pip's table?`}};
}
