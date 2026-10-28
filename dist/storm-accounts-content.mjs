// Original project fiction adapted from draft273's selected storm pair.
// Separate short-source practice; not part of the complete-story catalog.
export const stormAccountsSource = {
 id:'storm-accounts',kind:'account-pair',title:'Two records of storm night',
 notice:'A story from Willowbank: these people and records are fictional. The town is open again. At the archive, the librarian has two records of storm night. A visiting neighbor wants to know what happened near the mill before planning deliveries. Can you help them read the records carefully?',
 chapters:[
  {id:'mill-book',title:'The mill book',paragraphs:[
   {id:'mill-context',label:'About this record',text:'The miller was inside the mill on storm night. She wrote this note then, describing what she saw and did. She could not see the footbridge from her window.'},
   {id:'mill-record',label:'The miller’s words',text:'Storm night. Writing by lamp at the mill. The brook is over the second flood board. I set the third board in place at nine. Rain on the roof like gravel. The cat will not leave my lap. Water at the bottom step now, and rising. I can see no further than the window.'}
  ]},
  {id:'post-notice',title:'The Post Office notice',paragraphs:[
   {id:'post-context',label:'About this record',text:'Dot was not at the mill that night. A week later she asked people what they had seen and used their reports for this notice. Her closing lines announce Post Office service.'},
   {id:'post-record',label:'Dot’s notice',text:'NOTICE. On the night of the storm, Willow Brook rose over the mill’s flood boards. Water reached the mill steps. The footbridge was damaged. The low road was under water until morning. People say it was the worst storm in years. The Post Office is open again. Letters may be late. Dot, Postmaster.'}
  ]}
 ],
 lessons:[
  {id:'before',title:'Where did the detail come from?',chapters:['mill-book','post-notice'],fields:['interpretation'],
   prompt:'Read the two records and the context above each one. How did each writer learn about the water at the mill?',
   learn:'A firsthand statement comes from what someone directly experienced or witnessed. A secondhand statement comes from other people’s accounts or records. One text can contain both. Neither kind is automatically accurate or complete.',
   guided:'1. Find the water detail in each record. 2. Read its context: what could this writer see, and whom did they ask? 3. Trace this particular detail back to its source.',
   hint:'Look above each record for how its writer learned about the mill. Paper type, the word “I,” and writing date do not decide the relationship.',
   example:'Weeks after seeing a flour cart arrive, the baker writes down that memory: a firsthand observation. On the morning of the delivery, Hob writes what the carter told him: secondhand information. Later can be firsthand; immediate can be secondhand.'},
  {id:'compare',title:'Only here, or in both?',chapters:['mill-book','post-notice'],fields:['comparison'],
   prompt:'Read both records. Find one detail only the mill book gives and another only the notice gives. Some details appear in both.',
   learn:'To find a detail only one account gives, check the other account too. Similar wording can describe the same thing: “bottom step” and “mill steps” both place water at the mill.',
   guided:'1. Choose a detail. 2. Look for it in each record, including different words for the same thing. 3. Decide whether it appears only here or in both. An omission does not show the detail is false.',
   hint:'Read the actual records as well as their context. A place mentioned in a context is not the same as a claim that something happened there.',
   example:'The baker’s later memory says, “The flour cart arrived. Its wheel squeaked.” Hob’s same-day summary from two reports says, “The flour cart arrived. The lane reopened.” The arrival is in both; the squeak and reopening are each only in one.'},
  {id:'later',title:'What can each record tell us?',chapters:['mill-book','post-notice'],fields:['reconsideration'],
   prompt:'Ask what a writer directly reports seeing, what is outside their view, and what the notice’s closing lines help its readers do.',
   learn:'A source can be useful and limited. Being at the mill does not give someone a view of the footbridge. A notice can combine reports and also tell people what service to expect. Firsthand does not mean the whole story; secondhand does not mean false.',
   guided:'1. Ask how each statement is known, not just whether it says “I.” 2. Find the miller’s limit of view. 3. Read the last two notice sentences and ask what they help a reader plan.',
   hint:'“I heard from someone” and “I read a record” still use other sources. For the last question, focus on the closing service lines, not the notice’s earlier storm report.',
   example:'The baker later remembers seeing the cart. Hob’s same-day note gathers reports and ends, “The bakery is open. Bread may be late.” Those closing lines help customers plan; they do not prove why the bread is late or whether every earlier report is accurate.'},
  {id:'write',title:'Help the visiting neighbor',chapters:['mill-book','post-notice'],fields:['claim','detail','reasoning','paragraph'],
   prompt:'Explain one thing the mill book contributes and one thing the notice contributes. Use a precise detail from each. Name something these records do not settle for a neighbor planning deliveries.',
   learn:'A useful explanation connects a claim to a particular source detail and explains the connection. Keep the source’s limits in view. Your own words are ungraded and can be read with someone beside you.',
   guided:'1. Choose a detail from each record. 2. Explain how each helps the neighbor. 3. Name a remaining question. Write, dictate to someone beside you, or discuss aloud.',
   hint:'Does either record tell the neighbor whether the footbridge is usable now? Separate what a record says from a new question you would ask.',
   example:'A customer could use Hob’s opening-hours notice to plan a bakery visit and the baker’s recollection to learn about the cart. Neither source says whether tomorrow’s flour will arrive on time. That would need another check.'},
  {id:'revise',title:'Keep a careful message',chapters:['mill-book','post-notice'],fields:['objection','revision','change'],
   prompt:'A reader asks, “Does being there make the miller’s account the whole story?” Keep or revise your explanation to distinguish firsthand knowledge, useful reports and limits. A kept message is a good stopping point; every turn stays open.',
   learn:'Revision can clarify a fair point rather than choose a winning writer. Your first kept draft stays available. A grown-up or another reader can discuss your explanation; the game does not grade it.',
   guided:'1. Read your first kept draft. 2. Consider the reader’s question. 3. Keep what the sources support, clarify a claim if needed, and save your revised message.',
   hint:'A record can help without answering every question. You do not need to decide which person is better or why the footbridge was damaged.',
   example:'“Hob’s notice is useless because he was away” overlooks the reports he gathered and the service information. A revision could explain what each part contributes and which question still needs a fresh check.'}
 ],
 questions:[
  {id:'a1',lesson:'before',prompt:'The mill book says, “Water at the bottom step now, and rising.” How does the miller know this?',choices:[
   {id:'a1-seen',label:'She saw it from inside the mill — firsthand',outcome:'fits',feedback:'The mill-book context says she describes what she saw and did. This water detail comes from her own observation; that does not make every possible claim firsthand.'},
   {id:'a1-told',label:'A neighbor told her at the mill — secondhand',outcome:'different',feedback:'The context supplies her own observation of the water. It does not describe a neighbor supplying this detail.'},
   {id:'a1-copied',label:'She copied Dot’s later notice — secondhand',outcome:'different',feedback:'She wrote during the storm; Dot’s notice was written a week later. It could not supply this earlier note. The source relationship still depends on how she knew, not simply on the date.'}
  ]},
  {id:'a2',lesson:'before',prompt:'Dot’s notice says, “Water reached the mill steps.” How does Dot know this?',choices:[
   {id:'a2-seen',label:'She watched it herself at the mill — firsthand',outcome:'different',feedback:'The notice’s context says Dot was not at the mill. This statement comes from the reports she gathered.'},
   {id:'a2-reports',label:'People told her what they had seen — secondhand',outcome:'fits',feedback:'The context says Dot asked people what they saw. Her water statement is secondhand even if the miller was one of those people. Secondhand does not mean invented.'},
   {id:'a2-unknown',label:'We cannot tell how she learned about the mill',outcome:'different',feedback:'The context does tell us: Dot asked people what they had seen. There is enough information to trace this statement to gathered reports.'}
  ]},
  {id:'b1',lesson:'compare',prompt:'Which detail appears in the mill book but not the notice?',choices:[
   {id:'b1-water',label:'Water at the mill steps',outcome:'different',feedback:'Both records describe water at the mill steps. The mill book calls it the bottom step; different wording can describe the same detail.'},
   {id:'b1-bridge',label:'The damaged footbridge',outcome:'different',feedback:'The notice reports footbridge damage. The mill-book context mentions that bridge as outside the miller’s view; her note does not report damage there.'},
   {id:'b1-cat',label:'The cat on the miller’s lap',outcome:'fits',feedback:'The mill book says the cat will not leave her lap. The notice does not include that detail.'}
  ]},
  {id:'b2',lesson:'compare',prompt:'Which detail appears in the notice but not the mill book?',choices:[
   {id:'b2-road',label:'The low road under water',outcome:'fits',feedback:'Dot’s notice reports the low road under water until morning. The mill book does not describe that road.'},
   {id:'b2-boards',label:'The brook over the flood boards',outcome:'different',feedback:'Both accounts describe the brook above flood boards. One describes the second board while water is rising; the other summarizes the night. That wording is not itself a contradiction.'},
   {id:'b2-rain',label:'Rain on the roof like gravel',outcome:'different',feedback:'That comparison appears in the mill book. The notice does not describe the sound on the mill roof.'}
  ]},
  {id:'a4',lesson:'later',prompt:'Which statement reports the writer directly seeing the water?',choices:[
   {id:'a4-told',label:'“I was told the water rose.”',outcome:'different',feedback:'This writer reports being told something. The word “I” does not turn another person’s report into the writer’s own observation.'},
   {id:'a4-watched',label:'“I watched the water rise.”',outcome:'fits',feedback:'This statement reports the writer watching the water. “I was told” and “I read” report other sources. In a real investigation you would still check a witness’s claim.'},
   {id:'a4-records',label:'“I read in the records that the water rose.”',outcome:'different',feedback:'This writer learned the detail from records. All three statements say “I,” but their source relationships differ.'}
  ]},
  {id:'a5',lesson:'later',prompt:'What does the miller’s limited view mean for her note?',choices:[
   {id:'a5-undamaged',label:'It shows the footbridge was not damaged',outcome:'different',feedback:'She could not see the footbridge. Not reporting damage beyond her view does not establish that the bridge was undamaged.'},
   {id:'a5-useless',label:'It has no useful detail about the mill',outcome:'different',feedback:'Her note gives direct details about water at the step and what she did with the board. A limited view does not make that information useless.'},
   {id:'a5-limit',label:'It gives no view of the footbridge either way',outcome:'fits',feedback:'The context and note limit her view to the mill. This note does not establish the footbridge’s condition; Dot’s notice supplies a different report.'}
  ]},
  {id:'b3',lesson:'later',prompt:'What purpose fits the closing lines, “The Post Office is open again. Letters may be late”?',choices:[
   {id:'b3-service',label:'Tell people what postal service to expect',outcome:'fits',feedback:'The closing lines announce opening and possible delays. They help people plan for service; they do not settle the accuracy of every storm report.'},
   {id:'b3-storm',label:'Report what people saw on storm night',outcome:'different',feedback:'The earlier notice sentences report storm events. These particular closing lines announce current postal service.'},
   {id:'b3-damage',label:'Show the storm damaged the Post Office',outcome:'different',feedback:'The notice says service has reopened and letters may be late. Those lines do not say what caused delays or whether the building was damaged.'}
  ]}
 ]
};
