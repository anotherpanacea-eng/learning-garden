// Original supplied drafts selected from277;317 commissions only these first two benches.
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
const catalog=[bakery,day,...breaks,...joins,...questions];
export const writingTasks=Object.freeze(catalog.map(({id,title,bench})=>Object.freeze({id,title,bench})));
export function taskSource(id){const source=catalog.find(s=>s.id===id);return source?structuredClone(source):null;}
export const writingCopy=Object.freeze({
 title:'The Writing Table',
 intro:"The librarian has a tray of drafts from all over town. Visitors need to find the bakery's opening times. Can you make the page easier to use?",
 invitation:'Which part helps the visitor? Try a short report on paper, then ask someone to read it.',
 incomplete:'Some parts are still waiting. You can keep this version or keep arranging.',
 grownup:"This table uses drafts we wrote. All checks are practice with supplied material and teaching, not independent writing or reading assessments. Talk, point, read together or leave a draft unfinished. Your child's own report stays on paper or aloud, read by a person. First and latest kept versions show changes; checks keep the first and up to 23 recent checks per task, not every try. The table does not certify paragraph writing or unlock a story chapter."
});
