// Original fixed reader questions; never generated from or used to grade a draft.
const source={id:'ledger-reader-questions',title:'A reader asks',cards:[
 {id:'costs',name:'The orchard keeper',role:'Someone who may bear a cost',question:'Who would give up something under your proposal? What would you want them to know before asking for their support?',prompt:'Look at your reason and your answer to an objection. You may acknowledge a cost and still keep a provisional preference.'},
 {id:'evidence',name:'The librarian',role:'A reader checking the evidence',question:"Which record supports your reason? What can that record tell us, and what can't it settle?",prompt:'Look at your evidence and uncertainty. A useful fact can support part of a case without proving the whole proposal will work.'},
 {id:'next',name:'Wren',role:'A reader who needs a next step',question:'What should the town do or find out next? Which answer could make you change your recommendation?',prompt:'You can name an investigation, a question or a provisional action. Say what it would help you decide.'}
],closing:'Ask someone to read both versions. What is clearer? Which question is still open? You can keep your choice, change it, or leave it undecided.'};
export const createLedgerRevisionSource=()=>structuredClone(source);
