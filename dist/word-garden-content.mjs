// Original, finite word-part content. Encounters and discussion are not reading assessments.
export const roots=['pack','tie','lock','read','build','paint','kind','help','play','care'];
export const parts=[
 {id:'un',label:'un-',position:'front',meaning:'At the front: undo an action, or mean not.'},
 {id:'re',label:'re-',position:'front',meaning:'At the front: do something again.'},
 {id:'er',label:'-er',position:'end',meaning:'At the end of an action word: a person who does it. Some words use a different -er.'},
 {id:'ful',label:'-ful',position:'end',meaning:'At the end: full of, or having, something.'},
 {id:'less',label:'-less',position:'end',meaning:'At the end: without something.'},
 {id:'ness',label:'-ness',position:'end',meaning:'At the end of a describing word: the quality or state it describes.'}
];
export const blooms=[
 ['pack','un','unpack','take things out of a bag, box or basket','Pip unpacks the basket. The tools are dry, and so is his sandwich.','basket'],
 ['pack','re','repack','pack again','Dot repacks the basket with the hammer beside the sandwich.','basket'],
 ['pack','er','packer','a person who packs','The careful packer puts the cups in a snug box for the café.','basket'],
 ['tie','un','untie','undo a knot','Pip unties the rope so the bridge plank can be moved.','bridge'],
 ['tie','re','retie','tie again','Dot reties the knot around the bridge post.','bridge'],
 ['lock','un','unlock','undo a lock so something can open','The librarian unlocks the door. The reading corner is ready.','library'],
 ['lock','re','relock','lock again','The librarian relocks the cupboard after putting away the tools.','library'],
 ['read','re','reread','read again','Dot rereads the note to find where the lost recipe belongs.','library'],
 ['read','er','reader','a person who reads','The reader finds a story about a duck who builds a boat.','library'],
 ['build','re','rebuild','build again after damage or taking apart','The neighbors rebuild the storm-damaged bridge.','bridge'],
 ['build','er','builder','a person who builds','The builder fits a new plank into the bridge.','bridge'],
 ['paint','re','repaint','paint again','Pip repaints the library sign in bright blue.','sign'],
 ['paint','er','painter','a person who paints','The painter adds a little leaf beside the word LIBRARY.','sign'],
 ['kind','un','unkind','not kind','It would be unkind to laugh at a neighbor who is finding a job difficult.','tea'],
 ['kind','ness','kindness','the quality of being kind','The neighbors show kindness by bringing warm drinks to the bridge crew.','tea'],
 ['help','ful','helpful','giving help; useful','The helpful duck holds one end of the measuring ribbon.','bridge'],
 ['help','er','helper','a person who helps','A helper carries the library books away from a leaky window.','library'],
 ['helpful','un','unhelpful','not helpful','Standing on the map is unhelpful. The duck steps aside.','sign'],
 ['play','re','replay','play again','The bell keeper asks to replay the little welcome tune.','bell'],
 ['play','er','player','a person who plays','The drum player makes a gentle rhythm for the welcome dinner.','bell'],
 ['play','ful','playful','full of play; wanting to play','The playful kitten chases a leaf beside the café.','tea'],
 ['care','ful','careful','taking care; paying attention to avoid harm or mistakes','The careful painter puts a cloth under the paint pot.','sign'],
 ['care','less','careless','not taking enough care','A careless splash leaves blue dots on the floor. Pip gets a cloth.','sign']
].map(([base,part,id,meaning,scene,art])=>({base,part,id,meaning,scene,art}));
export const extras=[
 {base:'read',part:'un',word:'unread',meaning:'not yet read',note:'This real word describes something: an unread letter is a letter nobody has read yet. Here un- means not, rather than undo.',scene:'An unread letter waits on the library desk.',art:'library'},
 {base:'build',part:'un',word:'unbuild',meaning:'take apart something that was built',note:'This is a less common real word. We might usually say take apart.',scene:'The crew can unbuild the crooked frame and use its pieces again.',art:'bridge'},
 {base:'paint',part:'un',word:'unpaint',meaning:'remove paint from something',note:'A less common real word! Removing paint is different from painting again.',scene:'The crew unpaints the old board before making a fresh sign.',art:'sign'},
 {base:'kind',part:'er',word:'kinder',meaning:'more kind',note:'You found another job for -er: comparing. This -er does not mean a person who does something.',scene:'A kinder reply helps the worried neighbor feel welcome.',art:'tea'},
 {base:'care',part:'er',word:'carer',meaning:'a person who cares for someone who needs support',note:'Drop the final e of care before adding -er. This real word is especially common in British English. Caregiver is another word you may know.',scene:'A carer brings a warm blanket to a neighbor.',art:'tea'},
 {base:'lock',part:'er',word:'locker',meaning:'a small cupboard or box that can be locked',note:'This -er names a thing, rather than a person who does the action.',scene:'The builder keeps her tools in a locker beside the bridge.',art:'bridge'},
 {base:'helpful',part:'ness',word:'helpfulness',meaning:'the quality of being helpful',note:'Three parts grew this word: help + -ful makes helpful, then -ness makes helpfulness.',scene:'Everyone thanks the duck for her helpfulness at the bridge.',art:'bridge'},
 {base:'help',part:'less',word:'helpless',meaning:'unable to do something without help',note:'Needing help is ordinary. A word can describe one situation, rather than everything about a person.',scene:'Pip feels helpless with the heavy box until Dot offers to carry one end.',art:'basket'}
];
export const discoveryInvitation="What could these parts mean together? You might discover an unusual word, or invent one for a story. Try a meaning in a sentence together.";
export const questions=[
 {id:'again',title:'Read a map again',prompt:'Pip rereads the map. What does re- add to read?',choices:['He reads it again.','He reads it for the first time.','He puts the map away.'],explanation:'Re- means again here. Reading the same map again is rereading it.'},
 {id:'undo',title:'Before the door opened',prompt:'The librarian unlocks the door. What does un- tell us about the lock?',choices:['The lock was undone.','A second lock was added.','The door was painted.'],explanation:'In unlock, un- reverses locking. The lock is undone so the door can open.'},
 {id:'person',title:'A useful job',prompt:'A painter paints. What might a packer do?',choices:['Pack things.','Eat only packed lunches.','Always open packs.'],explanation:'Here -er names a person who does the action. A packer packs. Kinder uses a different -er: more kind.'},
 {id:'care',title:'Two kinds of care',prompt:'Compare careful and careless. How might each painter handle a full paint pot?',choices:['Talk about a careful painter.','Talk about a careless painter.','Try both in a little story.'],explanation:'Careful means taking care. Careless means not taking enough care. Neither word says that someone is always that way.'},
 {id:'two-parts',title:'Two cuttings together',prompt:'We made helpful from help, then added un-. What does unhelpful mean?',choices:['Not helpful.','Helpful again.','A person who helps.'],explanation:'Help plus -ful makes helpful. Un- plus helpful makes unhelpful: not helpful. We added two meaning-bearing parts.'},
 {id:'unhappy',title:'A word beyond this garden',prompt:'We did not plant happy here. What might un- add to make unhappy?',choices:['Not happy.','Happy again.','A person who is happy.'],explanation:'Here un- means not. Unhappy means not happy. You can explore this new example without growing it first.'},
 {id:'thankful',title:'Another new word',prompt:'What part can you spot in thankful? What might it add to thank?',choices:['-ful: feeling thanks.','re-: thanking again.','-er: a person who thanks.'],explanation:'Thankful contains -ful. It means feeling or showing thanks. Parts can help us wonder about a new word; a sentence helps us check its meaning.'},
 {id:'invent',title:'Invent a meaning together',prompt:'Choose a plant and cutting you have not tried together. What could their combination mean in your story?',choices:['We wondered together.','Another day.'],explanation:'You can invent a meaning, or look for a real use of the word together. The garden does not decide whether your idea is a real word.'}
];
