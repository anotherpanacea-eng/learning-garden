// Original supplied drafts selected from277;317 supplies the first two benches and321 adds Holding It Together.
// taskSource returns the complete words/key/order to freeze when a task is opened.
const paragraphTeaching=[
 'A paragraph is a group of sentences about one main thing. Writers usually start a new paragraph when the topic, the time, the place or the speaker changes.',
 'In a report, a heading names what the next paragraph is about. A reader can jump straight to the part they need.'
];
const linkingTeaching=[
 'Words at the start of a paragraph can tell the reader when, where, or which point is next: later that day, beyond the bridge, secondly.',
 '“Meanwhile” can mean at the same time. “Later” means after. Check when the new paragraph happens before you choose.'
];
const paragraphExample='Try this one first: “Pip ate. Pip slept.” Then: “Next morning, Dot came.” The time changed. Now find the change in yours.';
const linkingExample='Try this one first: the story jumps to the next day. “The next day” says so. Now read your “What changes” line.';
const part=(id,text)=>({id,text});
const headings=[part('sale',"What's for sale"),part('times','Opening times'),part('finding','Finding the bakery')];
const noon=[
 part('dawn','At dawn, Dot opened the post office.'),
 part('letters','She sorted the morning letters.'),
 part('stamps','Pip came in for stamps.'),
 part('noon','By noon, the square was full of stalls.'),
 part('buns','The baker sold out of buns.')
];
const dialogue=[part('pip','“Can I have a bun?” asked Pip.'),part('baker','“Not until noon,” said the baker.')];
const opener1=[part('meanwhile','Meanwhile, at the mill,'),part('later','Two days later, at the mill,'),part('first','Firstly, at the mill,')];
const opener2=[part('addition','In addition to that,'),part('contrast','On the other hand,'),part('place','Beyond the bridge,')];
const opener3=[part('place','Nearby,'),part('second','Secondly,'),part('time','Meanwhile,')];
function task(id,kind,title,parts,key,extra={}){
 const linking=id.startsWith('join-')||id.startsWith('b-');
 return {v:1,id,family:id,kind,bench:linking?'linking':'paragraphs',title,
  reader:linking?"For someone reading Dot's report":'For someone reading this story',
  prompt:'Choose the part that helps the reader.',teach:[...(linking?linkingTeaching:paragraphTeaching)],
  parts,choices:[],key,feedback:{fit:'This arrangement helps the reader follow the draft.',different:{},general:'Your draft is still here. You can change it.'},
  hint:linking?'Read what changes. Is it time, place, or the number of a reason?':'What stays the same here, and where does it change?',
  example:linking?linkingExample:paragraphExample,...extra};
}
const bakery=task('bakery','sort','Visit the bakery',[
 part('blue-door','Look for the blue door.'),
 part('opens','The bakery opens at seven.'),
 part('bread','The baker makes seed bread and soft rolls.'),
 part('sunday','On Sundays it stays shut.'),
 part('buns','The cherry buns are sticky and sweet.'),
 part('square','The bakery is on the square, next to the post office.'),
 part('crusts','The crusts are dark and crunchy.'),
 part('smell','If you smell bread, you are close.'),
 part('closes','It closes when the bread runs out.')
],{'blue-door':'finding',opens:'times',bread:'sale',sunday:'times',buns:'sale',square:'finding',crusts:'sale',smell:'finding',closes:'times'},
 {family:'bakery',reader:'For visitors to Willowbank',choices:headings,prompt:'Choose a strip, then choose its heading.',hint:'Is the sentence about what, when, or where?',example:'“The rolls are soft” tells visitors what is for sale. Put it under “What’s for sale.” Now read your strip.'});
const day=task('market-day','order',"Dot's market day",[
 part('noon','By noon, the square was full of stalls. The baker sold out of buns, and Pip helped him count the coins.'),
 part('dawn','At dawn, Dot opened the post office. She sorted the letters into neat piles.'),
 part('evening','That evening, the stalls packed up. Dot walked home under the lanterns.')
],['dawn','noon','evening'],{reader:"For someone reading Dot's report",prompt:"Put Dot's day in order. Look at the first words of each paragraph.",hint:'Dawn, noon, evening. Which comes first?',feedback:{fit:'Dawn, noon, evening. The first words told you the order.',different:{},general:'Read the first words. Your paragraphs are still here to move.'}});
const breaks=[
 task('break-noon','break','A change at noon',noon,'noon',{family:'noon',prompt:'Tap where a new paragraph should start.',feedback:{fit:'The time and the place change.',different:{},general:'Read on. What stays the same here, and where does it change?'}}),
 task('break-speaker','break','A new speaker',dialogue,'baker',{family:'speaker',prompt:'Tap where the next speaker’s paragraph should start.',hint:'Who says each line?',feedback:{fit:'A new person speaks. In a story, each new speaker usually gets a new paragraph.',different:{},general:'Find where the speaker changes.'}}),
 task('break-topic','break','The wheel and the flood post',[
  part('wheel','The mill has a big wooden wheel.'),part('water','Water from the stream turns it.'),part('post','The flood post stands beside the stream.'),part('height','It shows how high the water has risen.')
 ],'post',{prompt:'Tap where a new paragraph should start.',feedback:{fit:'The topic changes from the wheel to the flood post.',different:{},general:'Read on. What stays the same here, and where does it change?'}})
];
const joinFeedback=(different)=>({fit:'This opener tells the reader what changes.',different,general:'Read the “What changes” line. Does your opener say that?'});
const joins=[
 task('join-time','choice','At the same time',[part('before','Dot sorted letters all morning.')],'meanwhile',{
  family:'same-time',prompt:'Pick the opener that tells the reader what changes.',changes:'The next paragraph is at the mill, the same morning.',choices:opener1,
  after:'the miller checked the wheel. Her cat watched from the door.',hint:'Same time, new place. Which opener says both?',
  feedback:joinFeedback({later:"It's the same morning, not later.",first:"That counts points. It doesn't tell time."})}),
 task('join-place','choice','Across the bridge',[part('before','Pip ran onto Willow Bridge.')],'place',{
  family:'bridge',prompt:'Pick the opener that tells the reader what changes.',changes:'The next paragraph is on the far side, the same afternoon.',choices:opener2,
  after:'Pip found the path to the orchard. He followed the blue signs.',hint:'Which opener names a place?',
  feedback:joinFeedback({addition:"That adds a point. It doesn't say where.",contrast:"That's for a contrast, not a place."})}),
 task('join-second','choice','A second reason',[part('before','The first reason to visit the market is the bread.')],'second',{
  family:'second-reason',prompt:'Pick the opener that tells the reader what changes.',changes:'The next paragraph gives the second reason.',choices:opener3,
  after:'the stalls sell seedlings for the garden. You can ask the gardeners about them.',hint:'Which word counts?',
  feedback:joinFeedback({place:"That's a place. The report is counting reasons.",time:"That's a time. The report is counting reasons."})}),
 task('join-last','choice','The last reason',[part('before','The third reason is the music.')],'last',{
  prompt:'Pick the opener that tells the reader what changes.',changes:'The next paragraph gives the last reason.',choices:[part('last','Finally,'),part('first','Firstly,'),part('time','Later that day,')],
  after:'you can meet friends by the fountain. There is room to sit and talk.',hint:'Which word tells you this is the last reason?',
  feedback:joinFeedback({first:'This is the last reason, not the first.',time:'The report is counting reasons, not moving to a later time.'})})
];
const questions=[
 task('a-strip','choice','Where does this strip belong?',[part('strip','On Sundays it stays shut.')],'times',{
  family:'bakery',reader:'For visitors to Willowbank',choices:headings,prompt:'Which heading does this strip belong under?',hint:'Is it about what, when, or where?',steps:['Read the three headings.','Read the strip.','Which heading is it about?'],
  feedback:{fit:'Shut on Sundays tells you when to come. It goes with opening times.',different:{sale:"It doesn't say what you can buy.",finding:"It doesn't say where the bakery is."},general:'Read the heading. Is this sentence about that?'}}),
 task('a-break','choice','Where does the paragraph change?',noon,'four',{
  family:'noon',numbered:true,prompt:'Where should a new paragraph start?',choices:[part('two','Before sentence 2'),part('three','Before sentence 3'),part('four','Before sentence 4')],hint:'Find where the time or the place changes.',
  feedback:{fit:'“By noon” and “the square” change both time and place. New paragraph.',different:{two:'Still the post office, still dawn.',three:"Pip comes in, but it's the same place and time."},general:'Find where the time or the place changes.'}}),
 task('a-speaker','choice','Why start a new paragraph?',dialogue,'speaker',{
  family:'speaker',prompt:"Why does the baker's line start a new paragraph?",changes:'Both lines happen at the bakery counter, one after the other.',choices:[part('speaker','Someone new speaks'),part('time','The time has changed'),part('place','The place has changed')],hint:'Who says each line?',
  feedback:{fit:"It's a writing custom: in a story, each new speaker usually gets a new paragraph.",different:{time:'No time jumps. One line follows the other.',place:'Both are at the bakery counter.'},general:'Who says each line?'}}),
 task('b-time','choice','Which opener tells both?',[part('first','Dot sorts letters in the morning.')],'meanwhile',{
  family:'same-time',changes:'Paragraph 2 happens at the same time, at the mill.',prompt:'Which opener should start paragraph 2?',choices:opener1,hint:'Same time, new place. Which opener says both?',steps:['When does paragraph 2 happen?','Where?','Pick the opener that says both.'],
  feedback:{fit:'“Meanwhile” means at the same time. “At the mill” gives the new place.',different:{later:"It's the same morning, not later.",first:"That counts points. It doesn't tell time."},general:'Read when and where the next paragraph happens.'}}),
 task('b-place','choice','Which opener names the place?',[part('first','Pip ran onto Willow Bridge.')],'place',{
  family:'bridge',changes:'Paragraph 2 is on the far side of the bridge.',prompt:'Which opener moves the reader to the new place?',choices:opener2,hint:'Which opener names a place?',
  feedback:{fit:'“Beyond the bridge” takes the reader across. It’s a place signpost.',different:{addition:"That adds a point. It doesn't say where.",contrast:"That's for a contrast, not a place."},general:'Which opener names a place?'}}),
 task('b-second','choice','Which opener counts the reasons?',[part('report',"Dot's report gives three reasons to visit the market.")],'second',{
  family:'second-reason',changes:'Paragraph 2 gives the second reason.',prompt:'Which opener starts paragraph 2?',choices:opener3,hint:'Which word counts?',
  feedback:{fit:'“Secondly” tells the reader this is reason number two.',different:{place:"That's a place. The report is counting reasons.",time:"That's a time. The report is counting reasons."},general:'Which word counts?' }})
];
const holdingTeach={
 parcel:['Writing holds together when the reader can tell how the parts connect. Repeat a key word, or use a word that means the same thing.','The parcel.','“Pip found a parcel by the bridge.”','“The package was wet.”','“The package” means the same parcel. “The” tells us it’s the one we know.'],
 bun:['Words like it, she and they point back to someone or something. If two things could fit, the reader gets lost. Name the thing instead.','The bun and the plate.','“Pip set the bun on the plate. Then it slid off the table.”','“It” could be the bun or the plate.','Fix: “Then the bun slid off the table.”'],
 join:['Some openers show how two paragraphs connect: “On the other hand” for a contrast, “As a consequence” for a result, “In addition” for one more point.','The market roof.','Paragraph 1: the new roof keeps the stalls dry.','Paragraph 2: it cost more than the town planned.','A downside after a good point: “On the other hand, ...”'],
 short:['If the reader can fill in the missing words, you can leave them out. This is called ellipsis. It saves repeating yourself.','Pip and Dot.','“Pip wanted to see the show, and Dot wanted to see the show too.”','The reader can fill in “wanted to see the show.”','“Pip wanted to see the show, and Dot did too.”']
};
const holdingExample='Try this one first: “Dot has a hat. It is red.” “It” points back to the hat. Now check yours.';
const meaningExample='Try this one first: “Dot was tired. As a consequence, she went to bed early.” She went to bed early because she was tired. Now read your two paragraphs.';
const shorterExample='Try this one first: “Pip can whistle, and Dot can too.” The reader fills in “whistle.” Now check yours.';
const holdingTask=(id,kind,title,parts,key,card,extra)=>task(id,kind,title,parts,key,{
 bench:'holding',reader:'For someone reading this story',teach:holdingTeach[card],example:card==='join'?meaningExample:card==='short'?shorterExample:holdingExample,...extra
});
const tapPart=(id,text)=>({...part(id,text),tap:true});
const bunParts=[part('draft','Pip set the bun on the plate. Then it slid off the table.')];
const bunFixes=[part('edge','Then it slid off the edge of the table.'),part('that','Then that one slid off the table.'),part('bun','Then the bun slid off the table.')];
const shortVersions=[part('short','Pip wanted to see the show, and Dot did too.'),part('cut','Pip wanted to see the show, and Dot.'),part('changed','Pip wanted to see, and Dot wanted the show too.')];
const holding=[
 holdingTask('holding-parcel','tap','One parcel, four words',[
  tapPart('pip','Pip'),part('p1',' found a '),tapPart('parcel','parcel'),part('p2',' by the '),tapPart('bridge','bridge'),part('p3','. The '),tapPart('package','package'),part('p4',' was wet. '),tapPart('he','He'),part('p5',' carried '),tapPart('it','it'),part('p6',' to the '),tapPart('bakery','bakery'),part('p7',', and the '),tapPart('baker','baker'),part('p8',' dried the '),tapPart('bundle','bundle'),part('p9',' on the '),tapPart('windowsill','windowsill'),part('p10','.')
 ],['parcel','package','it','bundle'],'parcel',{
  family:'parcel',prompt:'Tap every word that means the parcel.',hint:'Find the parcel. Then look for other words that mean the same thing.',
  feedback:{fit:'Four words, one parcel. The reader never loses it.',different:{pip:'Pip is the one who found it.',bridge:'The bridge is where Pip found it.',he:'“He” points back to Pip.',bakery:'The bakery is where Pip took it.',baker:'The baker is the one who dried it.',windowsill:'The windowsill is where it dried.'},missing:'Some words that mean the parcel are not tapped yet.',general:'Your draft is still here. You can change it.'}}),
 holdingTask('holding-unclear','tap','Which word is unclear?',[
  tapPart('pip','Pip'),part('p1',' set the '),tapPart('bun','bun'),part('p2',' on the '),tapPart('plate','plate'),part('p3','. Then '),tapPart('it','it'),part('p4',' slid off the '),tapPart('table','table'),part('p5','.')
 ],['it'],'bun',{
  family:'bun',prompt:'Tap the word the reader could mix up.',hint:'Which word points back to something already named?',
  feedback:{fit:'“It” could be the bun or the plate. That’s the word to fix.',different:{pip:'Pip is named. There is only one Pip.',bun:'The bun is named. Look for a word that points back.',plate:'The plate is named. Look for a word that points back.',table:'The table is named. Nothing else could be the table.'},missing:'The unclear word is not tapped yet.',general:'Your draft is still here. You can change it.'}}),
 holdingTask('holding-fix','choice','Fix the unclear word',bunParts,'bun','bun',{
  family:'bun',prompt:'Choose a fix.',choices:bunFixes,hint:'Try each fix. Can you still read it two ways?',
  preview:{edge:'Pip set the bun on the plate. Then it slid off the edge of the table.',that:'Pip set the bun on the plate. Then that one slid off the table.',bun:'Pip set the bun on the plate. Then the bun slid off the table.'},
  feedback:{fit:'Now the reader knows the bun slid.',different:{edge:'The reader still can’t tell which one slid.',that:'The reader still can’t tell which one slid.'},general:'Your draft is still here. You can change it.'}}),
 holdingTask('holding-roof','choice','The other side',[part('first','The new market roof keeps the stalls dry, even in a storm.')],'contrast','join',{
  family:'roof',reader:'For someone reading this report',prompt:'Which opener signals that paragraph 2 is the other side?',changes:'Paragraph 2 gives a downside.',choices:[part('result','As a result of this,'),part('contrast','On the other hand,'),part('addition','In addition to this,')],after:'the roof cost more than the town had planned.',hint:'Is paragraph 2 more of the same, a result, or the other side?',
  feedback:{fit:'A downside after a good point is a contrast: “On the other hand.”',different:{result:'Dry stalls didn’t cause the cost.',addition:'It adds a fact, but doesn’t signal the other side.'},general:'Your draft is still here. You can change it.'}}),
 holdingTask('holding-rain','choice','Because of the rain',[part('first','Rain fell on Willowbank for three days.')],'result','join',{
  family:'rain',reader:'For someone reading this report',prompt:'Which opener starts paragraph 2?',changes:'Paragraph 2 tells what the rain caused.',choices:[part('result','As a consequence,'),part('contrast','On the other hand,'),part('place','Nearby,')],after:'the brook rose over the stepping stones.',hint:'Paragraph 2 is what the rain caused. Which opener means “because of that”?',
  feedback:{fit:'“As a consequence” tells the reader paragraph 2 happened because of paragraph 1.',different:{contrast:'Nothing is being contrasted.',place:'The link is cause, not place.'},general:'Your draft is still here. You can change it.'}}),
 holdingTask('holding-show','choice','One more thing to enjoy',[part('first','The show has a juggling dragon.')],'addition','join',{
  family:'show',reader:'For someone reading this report',prompt:'Pick the opener for paragraph 2.',changes:'Paragraph 2 gives one more thing to enjoy.',choices:[part('result','As a consequence,'),part('contrast','On the other hand,'),part('addition','In addition,')],after:'there is a singing fox.',hint:'Is paragraph 2 more of the same, a result, or the other side?',
  feedback:{fit:'“In addition” tells the reader here comes one more thing.',different:{result:'The dragon doesn’t cause the fox.',contrast:'The fox is one more good thing, not the other side.'},general:'Your draft is still here. You can change it.'}}),
 holdingTask('holding-short','choice','Leave it out',[part('first','Pip wanted to see the show, and Dot wanted to see the show too.')],'short','short',{
  family:'show-trip',prompt:'Which shorter version keeps the same meaning?',choices:shortVersions,preview:Object.fromEntries(shortVersions.map(x=>[x.id,x.text])),hint:'Which words can the reader fill in for themselves?',
  feedback:{fit:'“Did too” lets the reader fill in “wanted to see the show.” That’s ellipsis.',different:{cut:'The reader can’t tell what Dot did.',changed:'That changes the meaning.'},general:'Your draft is still here. You can change it.'}}),
 holdingTask('holding-mill','choice','Where are you going?',[part('first','“Where are you going?” “I’m going to the mill.”')],'mill','short',{
  family:'mill',prompt:'Which shorter answer keeps the meaning?',choices:[part('mill','“To the mill.”'),part('there','“I’m going there.”'),part('going','“Going.”')],preview:{mill:'“Where are you going?” “To the mill.”',there:'“Where are you going?” “I’m going there.”',going:'“Where are you going?” “Going.”'},hint:'What does the question ask for?',
  feedback:{fit:'The reader fills in “I’m going.” Only the new part is said.',different:{there:'“There” doesn’t say where. The reader still needs the place.',going:'The reader can’t fill that gap. Put a word back.'},general:'Your draft is still here. You can change it.'}}),
 holdingTask('holding-either','choice','What could “it” mean?',bunParts,'either','bun',{
  family:'bun',prompt:'What could “it” mean here?',steps:['Find “it.”','List what “it” could point back to.','Can the reader tell which?'],choices:[part('bun','The bun, because it comes first'),part('plate','The plate, because it is the nearest one'),part('either','Either one: the reader can’t tell')],hint:'Try “the bun” in place of “it.” Now try “the plate.”',
  feedback:{fit:'Both fit, so the reader can’t tell. Name the thing: “Then the bun slid off the table.”',different:{bun:'Maybe. The plate fits too.',plate:'Maybe. The bun fits too.'},general:'Your draft is still here. You can change it.'}})
];

const catalog=[bakery,day,...breaks,...joins,...questions,...holding];
export const writingTasks=Object.freeze(catalog.map(({id,title,bench})=>Object.freeze({id,title,bench})));
export function taskSource(id){const source=catalog.find(s=>s.id===id);return source?structuredClone(source):null;}
export const writingCopy=Object.freeze({
 title:'The Writing Table',
 holdingHeader:'Make the writing hold together, so the reader can follow.',
 holdingInvitation:'Write two sentences about something you found. Call it something new the second time. Read them to someone.',
 holdingGrownup:'This bench practices holding writing together: words that mean the same thing, a clear “it”, openers that show how paragraphs connect, and leaving out words a reader can fill in. Ellipsis here means leaving words out, not the three dots.',
 intro:"The librarian has a tray of drafts from all over town. Visitors need to find the bakery's opening times. Can you make the page easier to use?",
 invitation:'Which part helps the visitor? Try a short report on paper, then ask someone to read it.',
 incomplete:'Some parts are still waiting. You can keep this version or keep arranging.',
 grownup:"This table uses drafts we wrote. All checks are practice with supplied material and teaching, not independent writing or reading assessments. Talk, point, read together or leave a draft unfinished. Your child's own report stays on paper or aloud, read by a person. First and latest kept versions show changes; checks keep the first and up to 23 recent checks per task, not every try. The table does not certify paragraph writing or unlock a story chapter."
});
