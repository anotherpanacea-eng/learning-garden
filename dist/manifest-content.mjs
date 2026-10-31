// Spec 319: the market list slice of spec 278. Child text is the 278 companion's after its print rule
// (typographic quotes, *italics*, **bold**); the few other strings are the spec's exact exceptions.
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
const slot=id=>({slot:id}),word=t=>({t}),COMMA={fixed:','},AND={and:true};
export const MANIFEST_TEXT=freeze({
 title:'The Exchange Manifest',
 storyLabel:'A story from Willowbank',
 languageLabel:'A true thing about language',
 firstVisit:['It’s market day. The baker has a list for the miller, and the miller has a list for the baker. Pip has offered to carry both.','“Lists are easy,” says Pip. Dot raises one eyebrow.'],
 every:'Marks tell a reader where one thing ends and the next begins. Try any mark. Nothing here is scored.',
 storyAgain:'Read the market story again',
 back:'← Post Office',
 hook:'The baker writes a list for the miller. Pip carries it. Pip goes looking for four things, and one of them is “one dozen.”',
 shortLabel:'Short',longerLabel:'Longer',
 short:'The baker’s list says flour, two sacks, eggs, one dozen. Pip comes back puzzled. Semicolons show where each item ends.',
 longer:['The baker’s list says: *flour, two sacks, eggs, one dozen.*','Pip runs to the mill. He comes back with flour, two sacks, some eggs, and a worried face.','“What’s a one dozen?” he asks. “The miller didn’t have any.”','The baker takes the list. He adds a colon and a semicolon.','*I need two things: flour, two sacks; eggs, one dozen.*','“Oh,” says Pip. “Twelve eggs. That’s one dozen.” He looks at the eggs he brought. There are three. He goes back.'],
 workedLabel:'Worked example',
 nextStep:'Next step',
 cards:[
  {id:'card1',title:'Card 1. A colon opens a list',text:'A colon ( : ) can open a list. In most school writing, the words before it make a whole sentence. The list comes after.',example:'*The miller sells three things: flour, oats and bran.*',steps:['Cover the list. Read what’s left: “The miller sells three things.”','That’s a whole sentence, so a colon can open the list.','“We need” isn’t a whole sentence. In a sentence like that, most writers leave the colon out.']},
  {id:'card2',title:'Card 2. Commas in a short list',text:'Commas split a short list into items. Some writers put a comma before the last “and.” Some don’t. Both are fine. Pick one way and keep it.',example:'*apples, honey cake, and seeds* or *apples, honey cake and seeds*',steps:['Three items: apples, honey cake, seeds.','The first has a comma before “and.” The second doesn’t.','Both are fine. Keep one way in one piece of writing.']},
  {id:'card3',title:'Card 3. Semicolons split big items',text:'When list items have commas of their own, semicolons ( ; ) split the items. Then a reader can tell where each item ends.',example:'*The cart carries three loads: apples, six baskets; honey cake, two boxes; and seeds, one tin.*',steps:['With commas only, a reader sees six bits.','Each load has a name and an amount, joined by a comma.','Semicolons go between the loads. Now there are three.']}
 ],
 benchTitle:'The Manifest List',
 header:'Put a mark in each gap, or leave it empty. Then tap **Load it**.',
 loadButton:'Load it',
 tiles:{colon:'colon ( : )',semicolon:'semicolon ( ; )',comma:'comma ( , )',empty:'leave it empty'},
 whatFitsTitle:'What fits',
 whatFits:{lead:'Lines with a lead-in sentence: slot 1 takes a colon.',short:'Short lists (manifest 1, market 1): slot 2 takes a comma; slot 3 takes a comma or nothing. Both are fine.',big:'Lists of big items: slots 2 and 3 take semicolons.',weNeed:'*We need* lines: slot 1 stays empty.'},
 load:{'semicolon-lead':'A semicolon joins two whole sentences. The list isn’t one.','colon-cut':'Pip stops after “We need.” Need what? The colon cut the sentence in half.',fits:'Pip loads one crate for each item. Every label makes sense.','lead-merged':'Pip reads the lead-in and the first item as one long item. Where does the list start?','loads-merged':'Pip can’t tell where one load ends and the next begins.','as-it-stands':'Pip loads it just as it stands.'},
 crates:(n,labels)=>n?`Pip loads ${n} crates: ${labels.join(' · ')}.`:'Pip loads no crates.',
 setTitle:'Practice: colons and lists',
 check:'Check',tryAgain:'Try again',stuck:'I’m stuck',skip:'Skip for now',
 ladderStep3:'Skip for now. You can come back any time.',
 ladderStep2:{colon:'Try this one first: We need two things: bread and jam. Now cover your list.',semicolon:'Try this one first: Paris, France; Rome, Italy. Two places, one semicolon. Now count yours.'},
 glossaryTitle:'Key terms',
 glossary:[['Manifest','a list of everything a cart or boat carries.'],['Colon ( : )','two dots. It opens a list or an explanation.'],['Semicolon ( ; )','a dot over a comma. It joins two whole sentences or splits big list items.'],['Whole sentence','words that make sense standing alone, with a subject and a verb.'],['Lead-in','the words before a list that tell what the list is.']],
 offScreenLabel:'with a grown-up',
 offScreen:'Make a packing list for a pretend trip up a river. Write it once as bullets and once as a sentence with a colon. Which is easier to read?',
 offScreenGrownUp:'Nothing is recorded. Keep it pretend; there’s no need to list real belongings.',
 grownUpTitle:'Grown-up panel',
 grownUp:['**What this teaches:** a colon to introduce a list after a whole sentence; semicolons between list items that contain commas.','**Terms:** England’s national curriculum teaches these in Year 6 and calls a period a full stop; the child text uses American terms. In the Common Core, colons and semicolons for lists and clauses appear in grades 9 to 10, so this pack runs ahead of the US grade order for some children.','**What it does not claim:** style guides differ. The colon is keyed only in running sentences: Chicago leaves it out after *We need*, but some house styles (Microsoft’s, for one) allow a colon after a short lead-in such as “You can:” above a bulleted list. The comma before “and” in a list (the serial comma) is a choice and is never marked.'],
 unreadable:'This saved work can’t be opened here. It is kept as it is, and you can still download it from Grown-up notes.',
 unknownVersion:'This saved work is from a different version. It is kept as it is, and you can still download it from Grown-up notes.',
 refused:'That didn’t save, so nothing changed. Your marks are still here.',
 notesHeading:'Market list marks'
});
// Each line is a lead-in, slot 1 and the list. `kind` picks the What fits bullets.
export const MANIFEST_LINES=freeze([
 {id:'m1',kind:'short',lead:'The miller sells three things',parts:[slot('s1'),word('flour'),slot('s2'),word('oats'),slot('s3'),AND,word('bran')],fits:{s1:['colon'],s2:['comma'],s3:['comma','empty']}},
 {id:'m2',kind:'big',lead:'The baker needs three loads',parts:[slot('s1'),word('flour'),COMMA,word('two sacks'),slot('s2'),word('eggs'),COMMA,word('one dozen'),slot('s3'),AND,word('butter'),COMMA,word('one block')],fits:{s1:['colon'],s2:['semicolon'],s3:['semicolon']}},
 {id:'m3',kind:'big',lead:'The cart stops at three places',parts:[slot('s1'),word('the mill'),COMMA,word('at nine'),slot('s2'),word('the bakery'),COMMA,word('at ten'),slot('s3'),AND,word('the café'),COMMA,word('at noon')],fits:{s1:['colon'],s2:['semicolon'],s3:['semicolon']}},
 {id:'m4',kind:'weNeed',lead:'We need',parts:[slot('s1'),word('flour'),COMMA,word('eggs'),AND,word('oats')],fits:{s1:['empty']}}
]);
const choice=(id,text,feedback=null)=>({id,text,feedback});
// Choices stay in the companion's order: the fitting one is first in A1, second in A2 and third in A4.
export const MANIFEST_ITEMS=freeze([
 {id:'A1',kind:'choice',ladder:'colon',guided:true,steps:['Cover the list.','Is what’s left a whole sentence?','Then a colon can open the list.'],card:'*We need three things ___ apples, reed and honey.*',prompt:'Which mark fits the gap?',choices:[choice('a','A colon'),choice('b','A semicolon','A semicolon joins two whole sentences. The list isn’t one.'),choice('c','No mark at all','Then “three things apples” runs together.')],fits:'a',hint:'Is “We need three things” a whole sentence?',explanation:'“We need three things” is a whole sentence, so a colon opens the list.'},
 {id:'A2',kind:'choice',ladder:'colon',card:'',prompt:'Which sentence uses its colon correctly?',choices:[choice('a','We need: apples, letters and seeds.','“We need” isn’t a whole sentence. Leave the colon out.'),choice('b','We need three things: apples, letters and seeds.'),choice('c','We need three: things, apples, letters and seeds.','“Things” belongs before the colon, not in the list.')],fits:'b',hint:'Cover each list. Which leaves a whole sentence?',explanation:'“We need three things” stands alone. The colon then opens the list.'},
 {id:'A3',kind:'tiles',ladder:'semicolon',tiles:['colon','semicolon','comma'],lead:'The cart carries three loads',parts:[slot('s1'),word('apples'),COMMA,word('six baskets'),slot('s2'),word('honey cake'),COMMA,word('two boxes'),slot('s3'),AND,word('seeds'),COMMA,word('one tin')],prompt:'Put a mark in each gap.',answer:{s1:'colon',s2:'semicolon',s3:'semicolon'},commaFeedback:{s2:'Now “six baskets” and “honey cake” run together. Try a semicolon.',s3:'Now “two boxes” and “seeds” run together. Try a semicolon.'},hint:'Each load has a comma inside it already.',explanation:'A colon opens the list. Semicolons split the three loads.'},
 {id:'A4',kind:'choice',ladder:'semicolon',card:'*These come down the river: reed, four bundles; honey, two jars; and letters, one bag.*',prompt:'How many loads does this list name?',choices:[choice('a','6','That counts every bit between commas. Look at the semicolons.'),choice('b','2','Two semicolons split the list into three parts.'),choice('c','3')],fits:'c',hint:'Read between the semicolons. Each part is one load.',explanation:'Reed, honey and letters: three loads, each with its amount.'}
]);
