// Specs 319, 329 and 349: the market list slices of spec 278. Child text is the 278 companion's after its print rule
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
 ladderStep2:{colon:'Try this one first: We need two things: bread and jam. Now cover your list.',semicolon:'Try this one first: Paris, France; Rome, Italy. Two places, one semicolon. Now count yours.',join:'Try this one first: cover one side with your hand. Can the other stand alone?',title:'Try this one first: is it a whole book, or a part inside one?'},
 glossaryTitle:'Key terms',
 glossary:[['Manifest','a list of everything a cart or boat carries.'],['Colon ( : )','two dots. It opens a list or an explanation.'],['Semicolon ( ; )','a dot over a comma. It joins two whole sentences or splits big list items.'],['Dash ( – )','a short line between words. Here, one dash joins two whole sentences.'],['Whole sentence','words that make sense standing alone, with a subject and a verb.'],['Lead-in','the words before a list that tell what the list is.'],['Italics','slanted letters, *like these*.'],['Quotation marks','the marks that go around a poem’s or chapter’s title, or someone’s exact words.'],['Title','the name of a book, poem, chapter, song or newspaper.']],
 offScreenLabel:'with a grown-up',
 offScreen:'Make a packing list for a pretend trip up a river. Write it once as bullets and once as a sentence with a colon. Which is easier to read?',
 offScreenGrownUp:'Nothing is recorded. Keep it pretend; there’s no need to list real belongings.',
 grownUpTitle:'Grown-up panel',
 grownUp:['**What this teaches:** a colon to introduce a list after a whole sentence; semicolons between list items that contain commas; semicolons, colons and dashes between independent clauses; titles of works in italics or quotation marks.','**Terms:** England’s national curriculum teaches these in Year 6 and calls a period a full stop; the child text uses American terms. In the Common Core, colons and semicolons for lists and clauses appear in grades 9 to 10, and titles of works in grade 5, so this pack runs ahead of the US grade order for some children.','**What it does not claim:** style guides differ. The colon is keyed only in running sentences: Chicago leaves it out after *We need*, but some house styles (Microsoft’s, for one) allow a colon after a short lead-in such as “You can:” above a bulleted list. The comma before “and” in a list (the serial comma) is a choice and is never marked. Title styles differ a little between guides such as Chicago, MLA and APA, and newspapers often use quotation marks instead of italics; the pack teaches the common school convention. American books usually print a long dash with no spaces; this pack shows a spaced short dash. Where two marks both work, both are accepted.'],
 unreadable:'This saved work can’t be opened here. It is kept as it is, and you can still download it from Grown-up notes.',
 unknownVersion:'This saved work is from a different version. It is kept as it is, and you can still download it from Grown-up notes.',
 refused:'That didn’t save, so nothing changed. Your marks are still here.',
 notesHeading:'Market list marks',
 // Spec 329: bench (b) and set C.
 joinCards:[
  {id:'card7',title:'Card 7. A semicolon between sentences',text:'A semicolon can join two whole sentences that belong together. Each side must make sense on its own. A comma alone can’t do this job.',example:'*The river path is fast; the bridge road is dry.*',steps:['Cover the right side. “The river path is fast.” A whole sentence.','Cover the left side. “The bridge road is dry.” A whole sentence.','Both stand alone, and they belong together. A semicolon can join them.']},
  {id:'card8',title:'Card 8. A colon between sentences',text:'A colon can join two whole sentences when the second one explains the first. Read the colon as “here’s why” or “here’s what.”',example:'*The bridge is closed: the miller is painting it.*',steps:['“The bridge is closed.” Why?','“The miller is painting it.” That’s why.','The second explains the first, so a colon fits.']},
  {id:'card9',title:'Card 9. A dash for a sharp break',text:'A dash ( – ) can join two whole sentences too. It makes a sharper break, so the second part lands harder. Dashes feel less formal.',example:'*We packed two honey cakes – Pip ate one.*',steps:['Two whole sentences: “We packed two honey cakes.” “Pip ate one.”','The dash makes a sudden stop before the surprise.','A period or semicolon would also be correct. The dash adds the jolt.']}
 ],
 joinTitle:'Joining Dot’s Notes',
 joinHeader:'Dot’s notes join two sentences. Choose a mark for the gap. Then tap **Read it**.',
 readButton:'Read it',
 joinTiles:{period:'period ( . )',semicolon:'semicolon ( ; )',colon:'colon ( : )',dash:'dash ( – )',comma:'comma ( , )',nothing:'nothing'},
 read:{'because-alone':'“Because the river path floods” can’t stand alone. A comma fits here.','because-usually':'A “because” part that comes first usually takes a comma. It helps a reader.','because-comma':'A comma fits here. It shows where the “because” part ends.','comma-alone':'A comma alone can’t join two whole sentences. Try a stronger mark.',crash:'The sentences crash together. A reader can’t tell where one ends.',explain:'A colon promises “here’s why.” Does the second part explain the first?',period:'Two separate sentences, a clean stop between them.',semicolon:'Two equal ideas, closely linked.',colon:'Here’s why, or here’s what.',dash:'A sudden break. The second part lands hard.'},
 setCTitle:'Practice: joining two sentences',
 joinNotesHeading:'Joining Dot’s notes'
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
// Spec 329's notes: a first part, one gap and a second part. `because` marks note 4's fronted clause.
export const JOIN_NOTES=freeze([
 {id:'n1',first:'The river path is fast',second:'the bridge road is dry.',fits:['period','semicolon','dash'],explain:false},
 {id:'n2',first:'The bridge is closed',second:'the miller is painting it.',fits:['period','semicolon','colon','dash'],explain:true},
 {id:'n3',first:'We packed two honey cakes',second:'Pip ate one.',fits:['period','semicolon','dash'],explain:false},
 {id:'n4',first:'Because the river path floods',second:'we take the bridge road.',fits:['comma','nothing'],because:true},
 {id:'n5',first:'Dot has one rule',second:'letters always go first.',fits:['period','semicolon','colon','dash'],explain:true}
]);
// Set C, in the companion's order: the fitting choice is second in C1, third in C2, first in C3 and second in C4.
export const JOIN_ITEMS=freeze([
 {id:'C1',kind:'choice',ladder:'join',guided:true,steps:['Cover the right side.','Cover the left side.','Do both stand alone?'],card:'*The river path is fast ___ the bridge road is dry.*',prompt:'Which mark can join these two whole sentences?',choices:[choice('a','A comma','A comma alone can’t join two whole sentences.'),choice('b','A semicolon'),choice('c','Nothing between them','The sentences crash together.')],fits:'b',hint:'Which mark is stronger than a comma?',explanation:'Both sides stand alone and belong together. A semicolon joins them.'},
 {id:'C2',kind:'choice',ladder:'join',card:'',prompt:'Which sentence uses its semicolon correctly?',choices:[choice('a','Because the path floods; we take the bridge road.','“Because the path floods” can’t stand alone.'),choice('b','We take; the bridge road on wet days.','“We take” can’t stand alone either.'),choice('c','The river path is fast; the bridge road is slow.')],fits:'c',hint:'Cover each side. Both must stand alone.',explanation:'“The river path is fast.” “The bridge road is slow.” Both stand alone.'},
 {id:'C3',kind:'choice',ladder:'join',card:'*The bridge is closed ___ the miller is painting it.*',prompt:'The second part explains the first. Which mark shows that?',choices:[choice('a','A colon'),choice('b','A comma','A comma alone can’t join two whole sentences.'),choice('c','No mark at all','The two sentences run together.')],fits:'a',hint:'Which mark means “here’s why”?',explanation:'The painting is why the bridge is closed. A colon says “here’s why.”'},
 {id:'C4',kind:'choice',ladder:'join',card:'*We packed two honey cakes. Pip ate one.*',prompt:'Join them with a dash. Which is right?',choices:[choice('a','We packed two – honey cakes Pip ate one.','The dash splits “two honey cakes” apart.'),choice('b','We packed two honey cakes – Pip ate one.'),choice('c','We packed – two honey cakes – Pip ate one.','Paired dashes hold extra information. Here we join two sentences.')],fits:'b',hint:'Where does the first sentence end?',explanation:'The dash sits where the first sentence ends. Then Pip’s part lands hard.'},
 {id:'C5',kind:'tiles',ladder:'join',tiles:['period','semicolon','colon','dash','comma'],card:'*The bridge road is slow, it is always dry.*',first:'The bridge road is slow',second:'it is always dry.',prompt:'Swap the comma for a mark that works between two whole sentences.',accept:['semicolon','dash','period'],tileFeedback:{comma:'That’s the comma we’re fixing. Try a stronger mark.',colon:'A colon promises “here’s why.” Dry doesn’t explain slow.'},hint:'Which marks can join two whole sentences?',explanation:'Two whole sentences need a stronger join than a comma.'}
]);
// Spec 349: card 10, the Book Crate and set D. The seven strings outside the companion are the spec's exact exceptions.
export const CRATE_TEXT=freeze({
 card:{id:'card10',title:'Card 10. Titles of works',text:'In most school writing, titles of books and newspapers go in italics (slanted letters). Titles of poems, chapters and songs go in quotation marks. By hand, underline instead of italics.',example:'*The Wind in the Willows* and “The River Bank”',steps:['*The Wind in the Willows* is a whole book: italics.','“The River Bank” is its first chapter: quotation marks.','A part inside a bigger work gets quotation marks.']},
 benchTitle:'The Book Crate',
 header:'The librarian is labeling a crate of books. Tap how each title should look.',
 hand:'Writing it by hand?',
 historyLabel:'A true thing from history',
 tiles:{italics:'italics',quotes:'quotation marks',plain:'plain',underline:'underline'},
 said:{plain:'Plain letters hide that it’s a title. Pick a mark.','whole-newspaper-quotes':'This is a whole newspaper. Most school writing uses italics.','whole-quotes':'This is a whole book. Most school writing uses italics.','short-italics':'A part, or a short work, goes in quotation marks.','part-italics':'This one lives inside a bigger work. Try quotation marks.','whole-underline':'By hand, a whole work is underlined.','whole-italics':'A whole work leans over in italics.','part-quotes':'A part, or a short work, goes in quotation marks.'},
 underlined:title=>`${title}, underlined`,
 setTitle:'Practice: titles of works',
 notesHeading:'The book crate'
});
// The eight titles as four pairs. `kind` is whole, part or short; `story` marks the two Willowbank titles.
export const CRATE_TITLES=freeze([
 {id:'t1',title:'The Wind in the Willows',note:'a book by Kenneth Grahame, 1908',kind:'whole'},
 {id:'t2',title:'The River Bank',note:'its first chapter',kind:'part'},
 {id:'t3',title:'A Child’s Garden of Verses',note:'a book of poems by Robert Louis Stevenson, 1885',kind:'whole'},
 {id:'t4',title:'The Swing',note:'a poem in that book',kind:'part'},
 {id:'t5',title:'Just So Stories',note:'a book by Rudyard Kipling, 1902',kind:'whole'},
 {id:'t6',title:'How the Whale Got His Throat',note:'a story in that book',kind:'part'},
 {id:'t7',title:'The Willowbank Gazette',note:'the town’s newspaper',kind:'whole',story:true},
 {id:'t8',title:'Willow Brook Runs Down',note:'a song the town sings at the Market Fair',kind:'short',story:true}
]);
// Set D, in the companion's order: the fitting choice is first in D1, third in D2, second in D3 and first in D4.
export const TITLE_ITEMS=freeze([
 {id:'D1',kind:'choice',ladder:'title',guided:true,steps:['Is it a whole book?','Or a part inside one?','Whole books lean.'],card:'The librarian types the title of a book: The Wind in the Willows.',prompt:'In school writing, how do you show a typed book title?',choices:[choice('a','Slanted letters, in italics'),choice('b','In quotation marks','Most school writing saves those for parts, like poems.'),choice('c','Plain letters, no marks at all','Plain letters hide that it’s a title.')],fits:'a',hint:'Is it a whole book or a part?',explanation:'A whole book’s title goes in italics: *The Wind in the Willows*.'},
 {id:'D2',kind:'choice',ladder:'title',card:'“The Swing” is a poem inside *A Child’s Garden of Verses*.',prompt:'How do you show a poem’s title in school writing?',choices:[choice('a','Slanted letters, in italics','The poem lives inside a book. Parts get quotation marks.'),choice('b','Plain letters, no marks at all','Plain letters hide that it’s a title.'),choice('c','In quotation marks')],fits:'c',hint:'Is a poem a whole book, or a part?',explanation:'A poem’s title goes in quotation marks: “The Swing.”'},
 {id:'D3',kind:'choice',ladder:'title',card:'“The River Bank” is the first chapter of *The Wind in the Willows*.',prompt:'In school writing, which sentence shows the chapter and the book?',choices:[choice('a','“The River Bank” is the first chapter of “The Wind in the Willows.”','The book is a whole work. School writing gives it italics.'),choice('b','“The River Bank” is the first chapter of *The Wind in the Willows*.'),choice('c','*The River Bank* is the first chapter of “The Wind in the Willows.”','The chapter is the part. It takes the quotation marks.')],fits:'b',hint:'Which is the whole, and which is the part?',explanation:'The chapter, a part, gets quotation marks. The book gets italics.'},
 {id:'D4',kind:'choice',ladder:'title',card:'',prompt:'You write a book title by hand for school. What do you do?',choices:[choice('a','Underline it'),choice('b','Try to write it slanted','Slanted handwriting is hard to spot. Underline instead.'),choice('c','Put it in quotation marks','School writing saves those for parts, like poems and chapters.')],fits:'a',hint:'What stands in for italics when you write by hand?',explanation:'By hand, underline the title of a whole book.'}
]);
