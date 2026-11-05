// Original guided literary practice selected from277; source attribution is frozen with each card.
const p=(id,text)=>({id,text});
const goat={id:'goat',title:'The Goat in the Well',
 origin:"An excerpt from the project's newly written retelling in261's Fable Shelf, reused through277. A traditional fable, not an observation of real animals.",
 notice:'This extract leaves out the ending. Read what the goat says and does, not a rule about all goats or people.',
 lines:[p('g1','A fox falls into a deep well. The walls are smooth and wet. He cannot climb out.'),p('g2','A thirsty goat looks over the edge. "Is the water good?" "The best in the land," says the fox. "Jump in!" The goat jumps without a second thought. She never asks how to get out.'),p('g3',"The fox hops onto the goat's back, then her horns, and springs out. [...]")]};
const cat={id:'cat',title:"The Cat's One Trick",
 origin:"An excerpt from the project's newly written retelling in261's Fable Shelf, reused through277. A traditional fable, not an observation of real animals.",
 notice:'This extract leaves out the ending. A boast and what happens next are different kinds of evidence.',
 lines:[p('c1','"I know a hundred ways to escape," says the fox. "I know one," says the cat. "I climb."'),p('c2','Barking! The cat is up the tree in a flash. The fox thinks: run? hide? swim? dig?'),p('c3','The fox is still choosing when the hounds reach him. [...]')]};
const mole={id:'mole',title:'Mole and the sculls',
 origin:'Kenneth Grahame, The Wind in the Willows (1908), chapter1, abbreviated extract checked against Project Gutenberg eBook289 on2026-11-05. This is a novel, not Willowbank’s history.',
 notice:'Mole is watching Rat row. Mole takes Rat’s rowing place. Sculls are oars; sculling means rowing. Cuts are marked [...]. These few lines are not the whole chapter.',
 lines:[p('m1','The Mole was quiet for a minute or two. But he began to feel more and more jealous of Rat, sculling so strongly and so easily along, and his pride began to whisper that he could do it every bit as well.'),p('m2','He jumped up and seized the sculls, so suddenly, [...] while the triumphant Mole took his place and grabbed the sculls with entire confidence.'),p('m3','[...] Over went the boat, and he found himself struggling in the river.'),p('m4','[...] Then a firm paw gripped him by the back of his neck. It was the Rat, and he was evidently laughing [...]')]};
const teach=[
 'A point says what you want to say about a text. A quotation uses the text’s exact words. An explanation connects those words to your point.',
 'Point, quotation, explanation is one helpful pattern. It is the pattern Dot asks for in this draft, not the only good way to write a paragraph.',
 'A line can be in a story without showing the point you are making. Read the words around it too: who is speaking or acting?',
 'When a point is about two texts, bring relevant words from both. Our short extracts do not tell you everything about a whole book or character. You may have met some of these extracts before.',
 'These texts and sentence strips are provided. A person reads your own paragraph; selecting or ordering these words does not assess independent writing.'
];
const example='A tiny story says, “Nell counted the umbrellas twice before she left.” Point: Nell checks the umbrellas carefully. Quote: “counted the umbrellas twice”. Explanation: Counting again suggests she wants to avoid leaving one behind. This is an interpretation supported by that action, not proof she always behaves that way.';
const fallback=c=>p(c.id,[c.title,c.origin,c.notice,...c.lines.map((l,i)=>`${i+1}. ${l.text}`)].join('\n'));
const ref=(cardId,...lineIds)=>({cardId,lineIds});
const general='The selected words stay yours. Compare them with the whole extract; you can change or keep this choice.';
function task(id,title,cards,choices,key,extra){return {
 v:1,id,family:id,bench:'point-quote',kind:'choice',title,reader:'',prompt:'',teach:[...teach],example,
 parts:cards.map(fallback),choices,key,research:{v:1,cards:structuredClone(cards),links:{}},hint:'',
 feedback:{fit:'',different:{},general},...extra
};}
export const quotationTasks=[
 task('quote-build',"Build Dot's paragraph",[goat],[],['point','quote','explain'],{
  family:'quote-goat',kind:'order',reader:'Someone who has not read The Goat in the Well.',
  prompt:"Put Dot's sentences in her requested order: point, quotation, explanation. You can keep any order.",
  parts:[{...p('explain','This shows she jumped before she knew how to get out.'),role:'explanation'},{...p('point',"The goat doesn't think ahead."),role:'point'},{...p('quote','The story says she "jumps without a second thought."'),role:'quote'}],
  research:{v:1,cards:[structuredClone(goat)],links:{quote:[ref('goat','g2')]}},
  hint:'Find the point first. "The story says" introduces the words. "This shows" explains what they show.',
  feedback:{fit:'For this requested draft, the point comes first, then the story’s words, then an explanation linking them. Other paragraph patterns are possible.',different:{},general:'Dot asked for point, quotation, explanation in this draft. Your sentences are still here to move or keep; this is not a rule for every good paragraph.'}
 }),
 task('quote-goat',"Find the goat's words",[goat],[p('look','A thirsty goat looks over the edge.'),p('jump','The goat jumps without a second thought.'),p('fox-out',"The fox hops onto the goat's back, then her horns, and springs out.")],'jump',{
  family:'quote-goat',reader:'A reader checking the point that the goat does not pause to think ahead.',
  prompt:'Which of these lines most directly shows that point? Read the extract too.',
  research:{v:1,cards:[structuredClone(goat)],links:{look:[ref('goat','g2')],jump:[ref('goat','g2')],'fox-out':[ref('goat','g3')]}},
  hint:'Look at what the goat does after looking over the edge.',
  feedback:{fit:'The words "without a second thought" directly support this point about the goat’s action here. It does not prove what she always does.',different:{look:'Looking over the edge is in the story. By itself it does not show the goat acting without a pause to think.','fox-out':'That line describes the fox getting out. The requested point is about the goat’s earlier action.'},general}
 }),
 task('quote-fox',"The fox's hundred ways",[cat],[p('boast','"I know a hundred ways to escape," says the fox.'),p('climb','The cat is up the tree in a flash.'),p('choosing','The fox is still choosing when the hounds reach him.')],'choosing',{
  reader:'A reader checking whether the fox chooses in time.',
  prompt:"Which of these lines shows that the fox's many possible escapes do not help him choose in time?",
  research:{v:1,cards:[structuredClone(cat)],links:{boast:[ref('cat','c1')],climb:[ref('cat','c2')],choosing:[ref('cat','c3')]}},
  hint:'A boast tells what he claims. Which words show what happens when the hounds arrive?',
  feedback:{fit:'The fox is still choosing when the hounds arrive. That supports the point about not choosing in time, rather than just repeating his boast.',different:{boast:'This is the fox’s claim about his options. It does not show whether he chooses in time.',climb:'This shows the cat acting quickly. The requested point is about the fox’s delay.'},general}
 }),
 task('quote-mole',"Mole's confidence",[mole],[p('as-well','he could do it every bit as well'),p('sculling','sculling so strongly and so easily along'),p('laughing','he was evidently laughing')],'as-well',{
  reader:'A reader checking what Mole believes before he takes the oars.',
  prompt:'Which words directly show that Mole thinks he can row as well as Rat?',
  research:{v:1,cards:[structuredClone(mole)],links:{'as-well':[ref('mole','m1')],sculling:[ref('mole','m1')],laughing:[ref('mole','m4')]}},
  hint:'Read who is rowing, whose pride whispers, and who is laughing.',
  feedback:{fit:'The words about what his pride whispers show Mole’s belief. They do not show that his rowing skill equals Rat’s.',different:{sculling:'In this sentence the strong, easy rowing describes Rat, whom Mole is watching.',laughing:'This "he" refers to Rat after Rat grips Mole. It does not state Mole’s belief before he takes the oars.'},general}
 }),
 task('quote-two','Two stories, one point',[goat,mole],[p('descriptions','"The walls are smooth and wet." + "sculling so strongly and so easily along"'),p('both-jumps','"The goat jumps without a second thought." + "He jumped up and seized the sculls"'),p('one-jump','"The goat jumps without a second thought." + "his pride began to whisper"')],'both-jumps',{
  reader:'Someone comparing an action in two short extracts.',
  prompt:"Both extracts describe a jump by a character. Which pair supplies words about a jump from BOTH extracts? This point is about these actions, not each character's whole personality.",
  research:{v:1,cards:[structuredClone(goat),structuredClone(mole)],links:{descriptions:[ref('goat','g1'),ref('mole','m1')],'both-jumps':[ref('goat','g2'),ref('mole','m2')],'one-jump':[ref('goat','g2'),ref('mole','m1')]}},
  hint:'Find words about a jump in each extract. One relevant half is not evidence from both.',
  feedback:{fit:'Each half names a jump in its own extract. This pair supports that narrow comparison; it does not establish that the stories have the same ending or moral.',different:{descriptions:'The first half describes the walls; the second describes Rat’s rowing. Neither half gives the two jumps requested.','one-jump':'The first half gives the goat’s jump. The second half is about a thought, not Mole’s jump.'},general:'Both source links remain available even when a pair does not fit the stated point. Inspect the words around each quotation.'}
 })
];
export const quotationCopy=Object.freeze({
 label:'Point and Quote',
 intro:'The librarian wants a short paragraph for someone who has not read the story. Build Dot’s paragraph, or choose any of the other drafts.',
 header:'A reader should be able to see what your story words show.',
 invitation:'Tell someone, or write on paper: Make a point about a story, choose exact words that help show it, and explain the connection. Ask a reader whether the words support your point. You can choose a different interpretation.',
 grownup:'This bench models a provided literary paragraph and choosing quotations for stated points. The point/quote/explanation pattern is one scaffold. Checks concern the stated task with provided material; they are guided/supported, not an assessment of independent literary reading, quotation accuracy in original writing, or composition. Familiar excerpts may recur. Original interpretation, paragraphs and alternative readings need a person. Other writing and evidence activities stay open; no chapter or skill is awarded here.',
 returnInvitation:'Reopen your kept paragraph. Follow its quotation back to the story, then use or revise the paragraph for someone who has not read it. This is a new purpose for familiar text, not an unfamiliar-reading test.',
 sourcesIntro:'These are excerpts and provided writing strips. Follow a link to inspect the words around a quotation. Source labels do not certify that a selected line supports your point.',
 frameLabel:'Stories to write about',sourcesLabel:'Story extracts',readSourceLabel:'Read the story words',paragraphLabel:'Your paragraph',choiceLabel:'Your choice',
 roleLabels:Object.freeze({point:'Point',quote:'Quotation',explanation:'Explanation'})
});
