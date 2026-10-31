// Spec325: original selected263 material, with its exact bounded commission exceptions.
// No sound, dictionary service or learner data. Each new notebook clones this collection.
const cards=[
{"id": "card-6", "title": "A prefix goes at the front", "text": "A prefix goes at the start of a word and changes its meaning. Re- often means again: reopen. Pre- usually means before: preheat.", "example": "The stalls ____open after the storm.", "steps": ["They were open before the storm.", "Now they open again.", "Re- means again: reopen."]},
{"id": "card-7", "title": "Not, and wrongly", "text": "Un- and dis- usually mean not: unsold, dislike. Mis- usually means wrongly: misprint, mislabel.", "example": "A jar with the wrong label", "steps": ["The label is wrong.", "Mis- means wrongly.", "The jar is mislabeled."]},
{"id": "card-8", "title": "Against, self, above", "text": "Anti- usually means against: antifreeze works against freezing. Auto- usually means self: an autograph is your own name, written by you. Super- often means above or more: superstar.", "example": "Bramble's star act", "steps": ["A star is famous.", "A superstar is more famous still.", "Super- means more."]},
{"id": "card-9", "title": "Nothing falls off", "text": "Adding a prefix usually changes no letters. If the prefix ends with the letter the word starts with, keep both: misspell, unnamed.", "example": "mis + spell", "steps": ["Write the prefix: mis.", "Write the word with no change: spell.", "Misspell, with two s's."]},
{"id": "card-17", "title": "ABC order", "text": "A dictionary lists words in ABC order. If the first letters match, look at the next letter: fig before flour; wall before warm.", "example": "flour or fig?", "steps": ["Both start with f.", "Next letters: l and i.", "i comes first: fig, then flour."]},
{"id": "card-18", "title": "Guide words", "text": "The two words at the top of a dictionary page are guide words: the first and last words on it. Your word fits between them, in ABC order.", "example": "Is honey on the page heard to honey?", "steps": ["Honey starts with h, like both guide words.", "Honey is the last guide word.", "Yes, it is the last word on the page."]},
{"id": "card-19", "title": "Check a spelling", "text": "Not sure how to spell a word? Find its first two or three letters. Then read down the page until you find it.", "example": "Pip wrote freind.", "steps": ["Find f, then fr.", "Read down: fresh, friend, fruit.", "The page says friend."]},
{"id": "card-20", "title": "Try another start", "text": "Can't find a word? Its start may be spelled another way. Knock, knot and knife start with kn. Write and wrap start with wr.", "example": "The word for covering bread in paper", "steps": ["It isn't under ra.", "Try wr, like write.", "Wrap is on the w pages."]}
];
const prefix={
 "prefixes": [
  {
   "id": "re",
   "text": "re",
   "label": "re-",
   "meaning": "again or back"
  },
  {
   "id": "pre",
   "text": "pre",
   "label": "pre-",
   "meaning": "before"
  },
  {
   "id": "un",
   "text": "un",
   "label": "un-",
   "meaning": "not"
  },
  {
   "id": "dis",
   "text": "dis",
   "label": "dis-",
   "meaning": "not"
  },
  {
   "id": "mis",
   "text": "mis",
   "label": "mis-",
   "meaning": "wrongly"
  },
  {
   "id": "anti",
   "text": "anti",
   "label": "anti-",
   "meaning": "against"
  },
  {
   "id": "auto",
   "text": "auto",
   "label": "auto-",
   "meaning": "self"
  },
  {
   "id": "super",
   "text": "super",
   "label": "super-",
   "meaning": "above or more"
  }
 ],
 "parts": [
  {
   "id": "open",
   "text": "open"
  },
  {
   "id": "use",
   "text": "use"
  },
  {
   "id": "heat",
   "text": "heat"
  },
  {
   "id": "pay",
   "text": "pay"
  },
  {
   "id": "view",
   "text": "view"
  },
  {
   "id": "sold",
   "text": "sold"
  },
  {
   "id": "wrapped",
   "text": "wrapped"
  },
  {
   "id": "named",
   "text": "named"
  },
  {
   "id": "noticed",
   "text": "noticed"
  },
  {
   "id": "like",
   "text": "like"
  },
  {
   "id": "obey",
   "text": "obey"
  },
  {
   "id": "print",
   "text": "print"
  },
  {
   "id": "label",
   "text": "label"
  },
  {
   "id": "spell",
   "text": "spell"
  },
  {
   "id": "freeze",
   "text": "freeze"
  },
  {
   "id": "graph",
   "text": "graph"
  },
  {
   "id": "pilot",
   "text": "pilot"
  },
  {
   "id": "star",
   "text": "star"
  },
  {
   "id": "market",
   "text": "market"
  }
 ],
 "joins": [
  {
   "id": "re-open",
   "prefixId": "re",
   "partId": "open",
   "meaning": "open again"
  },
  {
   "id": "re-use",
   "prefixId": "re",
   "partId": "use",
   "meaning": "use again"
  },
  {
   "id": "pre-heat",
   "prefixId": "pre",
   "partId": "heat",
   "meaning": "heat before"
  },
  {
   "id": "pre-pay",
   "prefixId": "pre",
   "partId": "pay",
   "meaning": "pay before"
  },
  {
   "id": "pre-view",
   "prefixId": "pre",
   "partId": "view",
   "meaning": "a look before"
  },
  {
   "id": "un-sold",
   "prefixId": "un",
   "partId": "sold",
   "meaning": "not sold"
  },
  {
   "id": "un-wrapped",
   "prefixId": "un",
   "partId": "wrapped",
   "meaning": "not wrapped"
  },
  {
   "id": "un-named",
   "prefixId": "un",
   "partId": "named",
   "meaning": "with no name"
  },
  {
   "id": "un-noticed",
   "prefixId": "un",
   "partId": "noticed",
   "meaning": "not noticed"
  },
  {
   "id": "dis-like",
   "prefixId": "dis",
   "partId": "like",
   "meaning": "not like"
  },
  {
   "id": "dis-obey",
   "prefixId": "dis",
   "partId": "obey",
   "meaning": "not obey"
  },
  {
   "id": "mis-print",
   "prefixId": "mis",
   "partId": "print",
   "meaning": "a mistake in printing"
  },
  {
   "id": "mis-label",
   "prefixId": "mis",
   "partId": "label",
   "meaning": "label wrongly"
  },
  {
   "id": "mis-spell",
   "prefixId": "mis",
   "partId": "spell",
   "meaning": "spell wrongly"
  },
  {
   "id": "anti-freeze",
   "prefixId": "anti",
   "partId": "freeze",
   "meaning": "a liquid that helps stop freezing"
  },
  {
   "id": "auto-graph",
   "prefixId": "auto",
   "partId": "graph",
   "meaning": "your own name, written by you"
  },
  {
   "id": "auto-pilot",
   "prefixId": "auto",
   "partId": "pilot",
   "meaning": "a device that steers a plane automatically"
  },
  {
   "id": "super-star",
   "prefixId": "super",
   "partId": "star",
   "meaning": "a very famous star"
  },
  {
   "id": "super-market",
   "prefixId": "super",
   "partId": "market",
   "meaning": "a very big food store"
  }
 ]
};
prefix.cards=cards.filter(c=>Number(c.id.slice(5))<10);
const dictionary={pages:[
{"id": "page-1", "entries": [{"id": "fair", "word": "fair", "definition": "a big market with games and shows, held now and then."}, {"id": "famous", "word": "famous", "definition": "known by many people."}, {"id": "february", "word": "February", "definition": "the second month of the year."}, {"id": "fig", "word": "fig", "definition": "a soft, sweet fruit full of tiny seeds."}, {"id": "flour", "word": "flour", "definition": "grain ground into powder, for baking."}, {"id": "freeze", "word": "freeze", "definition": "to turn hard and icy from cold."}, {"id": "fresh", "word": "fresh", "definition": "newly made or picked; not old."}, {"id": "friend", "word": "friend", "definition": "a person you know well and like."}, {"id": "fruit", "word": "fruit", "definition": "the part of a plant that holds its seeds, like an apple."}, {"id": "fudge", "word": "fudge", "definition": "a soft, sweet candy."}]},
{"id": "page-2", "entries": [{"id": "heard", "word": "heard", "definition": "from hear, when it already happened. Dot heard the bell."}, {"id": "heavy", "word": "heavy", "definition": "hard to lift."}, {"id": "height", "word": "height", "definition": "how tall something is."}, {"id": "here", "word": "here", "definition": "in this place."}, {"id": "hive", "word": "hive", "definition": "a home for bees."}, {"id": "honey", "word": "honey", "definition": "a sweet, sticky food that bees make."}]},
{"id": "page-3", "entries": [{"id": "knife", "word": "knife", "definition": "a tool with a sharp blade, for cutting."}, {"id": "knit", "word": "knit", "definition": "to make cloth from yarn with long needles."}, {"id": "knob", "word": "knob", "definition": "a round handle, like on a drawer."}, {"id": "knock", "word": "knock", "definition": "to tap hard on something, like a door."}, {"id": "knot", "word": "knot", "definition": "a tie made by looping string or ribbon."}]},
{"id": "page-4", "entries": [{"id": "wall", "word": "wall", "definition": "a side of a room or a building, or a fence made of stone or brick."}, {"id": "want", "word": "want", "definition": "to wish to have."}, {"id": "warm", "word": "warm", "definition": "a little hot, but not too hot."}, {"id": "watch", "word": "watch", "definition": "to look at something for a while."}, {"id": "weight", "word": "weight", "definition": "how heavy something is."}, {"id": "word", "word": "word", "definition": "a part of what we say or write that has its own meaning, like cat."}, {"id": "work", "word": "work", "definition": "a job; to do a job."}, {"id": "world", "word": "world", "definition": "the Earth and everything on it."}]},
{"id": "page-5", "entries": [{"id": "wrap", "word": "wrap", "definition": "to cover something with paper or cloth."}, {"id": "wreath", "word": "wreath", "definition": "a ring of leaves or flowers."}, {"id": "wren", "word": "wren", "definition": "a small brown bird with a tail that sticks up."}, {"id": "write", "word": "write", "definition": "to put words on paper."}, {"id": "wrong", "word": "wrong", "definition": "not right."}]}
],cards:cards.filter(c=>Number(c.id.slice(5))>=17)};
const jobs=[
{"v": 1, "id": "B1", "kind": "choice", "title": "Open again", "prompt": "The stalls open again after the storm. Which prefix fits?", "parts": [], "choices": [{"id": "a", "text": "re-"}, {"id": "b", "text": "un-"}, {"id": "c", "text": "dis-"}], "key": "a", "steps": ["They were open before the storm.", "Now they open again."], "hint": "Which prefix means again?", "example": "Try this one first: re + open = reopen, open again. Now find your prefix’s meaning.", "explanation": "Re- means again: reopen.", "different": {"b": "Un- usually means not. These stalls are opening again.", "c": "Dis- usually means not or the opposite. This is again."}, "tag": "open", "teach": [{"id": "card-6", "title": "A prefix goes at the front", "text": "A prefix goes at the start of a word and changes its meaning. Re- often means again: reopen. Pre- usually means before: preheat.", "example": "The stalls ____open after the storm.", "steps": ["They were open before the storm.", "Now they open again.", "Re- means again: reopen."]}]},
{"v": 1, "id": "B2", "kind": "choice", "title": "Before the bread", "prompt": "The baker heats the oven before the bread goes in. Which prefix?", "parts": [], "choices": [{"id": "a", "text": "re-"}, {"id": "b", "text": "anti-"}, {"id": "c", "text": "pre-"}], "key": "c", "steps": [], "hint": "Which prefix means before?", "example": "Try this one first: re + open = reopen, open again. Now find your prefix’s meaning.", "explanation": "Pre- means before: preheat.", "different": {"a": "Re- often means again. This heat comes before the baking.", "b": "Anti- usually means against. Look for before."}, "tag": "heat", "teach": [{"id": "card-6", "title": "A prefix goes at the front", "text": "A prefix goes at the start of a word and changes its meaning. Re- often means again: reopen. Pre- usually means before: preheat.", "example": "The stalls ____open after the storm.", "steps": ["They were open before the storm.", "Now they open again.", "Re- means again: reopen."]}]},
{"v": 1, "id": "B3", "kind": "choice", "title": "Keep both s letters", "prompt": "When Pip rushes, he spells words wrong. He ___ them.", "parts": [], "choices": [{"id": "a", "text": "mispells"}, {"id": "b", "text": "misspells"}, {"id": "c", "text": "missspells"}], "key": "b", "steps": [], "hint": "Write mis. Then write spells with no change.", "example": "Try this one first: re + open = reopen, open again. Now find your prefix’s meaning.", "explanation": "Mis + spells = misspells. Nothing falls off.", "different": {"a": "A common slip. Mis plus spells keeps every letter: two s's.", "c": "Mis has one s, and spells starts with one. That's two."}, "tag": "spells", "teach": [{"id": "card-9", "title": "Nothing falls off", "text": "Adding a prefix usually changes no letters. If the prefix ends with the letter the word starts with, keep both: misspell, unnamed.", "example": "mis + spell", "steps": ["Write the prefix: mis.", "Write the word with no change: spell.", "Misspell, with two s's."]}]},
{"v": 1, "id": "B4", "kind": "choice", "title": "The pumpkin’s name", "prompt": "Nobody has named Bramble's pumpkin yet. It is ___.", "parts": [], "choices": [{"id": "a", "text": "unamed"}, {"id": "b", "text": "misnamed"}, {"id": "c", "text": "unnamed"}], "key": "c", "steps": [], "hint": "Is the name wrong, or not there yet?", "example": "Try this one first: re + open = reopen, open again. Now find your prefix’s meaning.", "explanation": "Un + named = unnamed: not named, with two n's.", "different": {"a": "Un plus named. Keep both n's.", "b": "A real word, for a wrong name. This pumpkin has no name yet."}, "tag": "named", "teach": [{"id": "card-7", "title": "Not, and wrongly", "text": "Un- and dis- usually mean not: unsold, dislike. Mis- usually means wrongly: misprint, mislabel.", "example": "A jar with the wrong label", "steps": ["The label is wrong.", "Mis- means wrongly.", "The jar is mislabeled."]}, {"id": "card-9", "title": "Nothing falls off", "text": "Adding a prefix usually changes no letters. If the prefix ends with the letter the word starts with, keep both: misspell, unnamed.", "example": "mis + spell", "steps": ["Write the prefix: mis.", "Write the word with no change: spell.", "Misspell, with two s's."]}]},
{"v": 1, "id": "B5", "kind": "match", "title": "Match the prefixes", "prompt": "Match each prefix to its usual meaning.", "parts": [{"id": "re", "text": "re-"}, {"id": "pre", "text": "pre-"}, {"id": "un", "text": "un-"}, {"id": "dis", "text": "dis-"}, {"id": "mis", "text": "mis-"}, {"id": "anti", "text": "anti-"}, {"id": "auto", "text": "auto-"}, {"id": "super", "text": "super-"}], "choices": [{"id": "more", "text": "above or more"}, {"id": "self", "text": "self"}, {"id": "against", "text": "against"}, {"id": "wrongly", "text": "wrongly"}, {"id": "not", "text": "not"}, {"id": "before", "text": "before"}, {"id": "again", "text": "again or back"}], "key": {"re": "again", "pre": "before", "un": "not", "dis": "not", "mis": "wrongly", "anti": "against", "auto": "self", "super": "more"}, "steps": [], "hint": "Say a sign word that uses the prefix.", "example": "Try this one first: re + open = reopen, open again. Now find your prefix’s meaning.", "explanation": "Each prefix adds its meaning to the front of a word.", "different": {"general": "Try a sign word: reopen, preheat, unsold, dislike, misspell, autograph."}, "teach": [{"id": "card-6", "title": "A prefix goes at the front", "text": "A prefix goes at the start of a word and changes its meaning. Re- often means again: reopen. Pre- usually means before: preheat.", "example": "The stalls ____open after the storm.", "steps": ["They were open before the storm.", "Now they open again.", "Re- means again: reopen."]}, {"id": "card-7", "title": "Not, and wrongly", "text": "Un- and dis- usually mean not: unsold, dislike. Mis- usually means wrongly: misprint, mislabel.", "example": "A jar with the wrong label", "steps": ["The label is wrong.", "Mis- means wrongly.", "The jar is mislabeled."]}, {"id": "card-8", "title": "Against, self, above", "text": "Anti- usually means against: antifreeze works against freezing. Auto- usually means self: an autograph is your own name, written by you. Super- often means above or more: superstar.", "example": "Bramble's star act", "steps": ["A star is famous.", "A superstar is more famous still.", "Super- means more."]}]},
{"v": 1, "id": "B6", "kind": "choice", "title": "Your own name", "prompt": "Pip signs his own name for Dot to keep. Which prefix fits?", "parts": [], "choices": [{"id": "a", "text": "auto-"}, {"id": "b", "text": "anti-"}, {"id": "c", "text": "super-"}], "key": "a", "steps": [], "hint": "Which prefix means self?", "example": "Try this one first: re + open = reopen, open again. Now find your prefix’s meaning.", "explanation": "In autograph, auto- means self: your own name, written by you.", "different": {"b": "Anti- usually means against. This is Pip's own name.", "c": "Super- often means above or more. Look for self."}, "tag": "graph", "teach": [{"id": "card-8", "title": "Against, self, above", "text": "Anti- usually means against: antifreeze works against freezing. Auto- usually means self: an autograph is your own name, written by you. Super- often means above or more: superstar.", "example": "Bramble's star act", "steps": ["A star is famous.", "A superstar is more famous still.", "Super- means more."]}]},
{"v": 1, "id": "E1", "kind": "choice", "title": "Find fresh", "prompt": "Which page would have fresh?", "parts": [], "choices": [{"id": "a", "text": "fair to fudge"}, {"id": "b", "text": "heard to honey"}, {"id": "c", "text": "wall to world"}], "key": "a", "steps": ["Fresh starts with f.", "Find guide words that start with f.", "That's the page."], "hint": "What letter does fresh start with?", "example": "Try this one first: apple, bread, cake. a, b, c. Now look at your words’ letters.", "explanation": "Fresh starts with f, so it fits between fair and fudge.", "different": {"b": "Those words start with h. Fresh starts with f.", "c": "Those words start with w. Fresh starts with f."}, "teach": [{"id": "card-17", "title": "ABC order", "text": "A dictionary lists words in ABC order. If the first letters match, look at the next letter: fig before flour; wall before warm.", "example": "flour or fig?", "steps": ["Both start with f.", "Next letters: l and i.", "i comes first: fig, then flour."]}, {"id": "card-18", "title": "Guide words", "text": "The two words at the top of a dictionary page are guide words: the first and last words on it. Your word fits between them, in ABC order.", "example": "Is honey on the page heard to honey?", "steps": ["Honey starts with h, like both guide words.", "Honey is the last guide word.", "Yes, it is the last word on the page."]}]},
{"v": 1, "id": "E2", "kind": "order", "title": "Four f words", "prompt": "Put these in ABC order.", "parts": [{"id": "fudge", "text": "fudge"}, {"id": "fig", "text": "fig"}, {"id": "fresh", "text": "fresh"}, {"id": "flour", "text": "flour"}], "choices": [], "key": ["fig", "flour", "fresh", "fudge"], "steps": [], "hint": "Look at the second letters: u, i, r, l.", "example": "Try this one first: apple, bread, cake. a, b, c. Now look at your words’ letters.", "explanation": "i, l, r, u: fig, flour, fresh, fudge.", "different": {"general": "They all start with f. Look at the second letter."}, "teach": [{"id": "card-17", "title": "ABC order", "text": "A dictionary lists words in ABC order. If the first letters match, look at the next letter: fig before flour; wall before warm.", "example": "flour or fig?", "steps": ["Both start with f.", "Next letters: l and i.", "i comes first: fig, then flour."]}]},
{"v": 1, "id": "E3", "kind": "choice", "title": "Check Pip’s spelling", "prompt": "Pip wrote freind. Find fr in the dictionary. Which spelling is there?", "parts": [], "choices": [{"id": "a", "text": "freind"}, {"id": "b", "text": "frend"}, {"id": "c", "text": "friend"}], "key": "c", "steps": [], "hint": "Read down from fresh.", "example": "Try this one first: apple, bread, cake. a, b, c. Now look at your words’ letters.", "explanation": "The page says friend: f, r, i, e, n, d.", "different": {"a": "That's Pip's spelling. Compare letter by letter with the page.", "b": "Look again: there's an i after the r."}, "teach": [{"id": "card-19", "title": "Check a spelling", "text": "Not sure how to spell a word? Find its first two or three letters. Then read down the page until you find it.", "example": "Pip wrote freind.", "steps": ["Find f, then fr.", "Read down: fresh, friend, fruit.", "The page says friend."]}]},
{"v": 1, "id": "E4", "kind": "choice", "title": "Try another start", "prompt": "Pip wants the word for covering bread in paper. It's not under ra. Which start?", "parts": [], "choices": [{"id": "a", "text": "kn"}, {"id": "b", "text": "wr"}, {"id": "c", "text": "qu"}], "key": "b", "steps": [], "hint": "Think of write.", "example": "Try this one first: apple, bread, cake. a, b, c. Now look at your words’ letters.", "explanation": "Wrap starts with wr, like write. It's on the w pages.", "different": {"a": "Kn starts knock and knot.", "c": "Qu starts quick and quiet."}, "teach": [{"id": "card-20", "title": "Try another start", "text": "Can't find a word? Its start may be spelled another way. Knock, knot and knife start with kn. Write and wrap start with wr.", "example": "The word for covering bread in paper", "steps": ["It isn't under ra.", "Try wr, like write.", "Wrap is on the w pages."]}]}
];
const initial={v:1,story:{"short": "Pip says UNNAMED has too many n's. Bramble says un plus named keeps both. The dictionary agrees with Bramble.", "longer": "Bramble's pumpkin sits on a hay bale, round, orange and very large. Her sign reads:\n\nGUESS ITS WEIGHT. NAME THE UNNAMED PUMPKIN.\n\n\"Unnamed has too many n's,\" says Pip. \"Take one out.\"\n\n\"Un, plus named,\" says Bramble. \"Nothing falls off either part. So both n's stay.\"\n\nThe magpie pecks at the second n, as if it agrees with Pip.\n\n\"Let's check,\" says {guide}. Dot finds u, then un, then a long row of un- words. Unnamed. Two n's.\n\n\"Told you,\" says Bramble.\n\nPip thinks hard. \"So misspell is mis plus spell? Two s's?\"\n\n\"Two s's,\" says Dot.\n\n\"Then I've been misspelling misspell,\" says Pip.\n\nBramble writes his guess on a card: EIGHT POUNDS. \"Weight has eigh, like eight,\" she says. \"And your guess is low.\"\n\nThe pumpkin weighs forty-one pounds. Nobody guesses it. It stays unnamed for one more week."},prefix,dictionary,jobs};
export const marketSignsCopy=Object.freeze({
 "title": "Market Signs",
 "arrival": "The stalls are back on the green, and every stall wants a sign. A paint pot, a ladder, and a small fat dictionary wait on the sign bench.",
 "arrival2": "\"Paint is easy,\" says Dot. \"Spelling is the hard part. That's what the dictionary is for.\"",
 "recall": "In the Word Garden, un- and re- made new words: unlock, rebuild. Here they come back, with more parts and more signs.",
 "every": "Spelling rules usually work. A dictionary has the last word.",
 "discovery": "A word to wonder about. What could these parts mean together? Check a dictionary to see if it's there.",
 "bigger": "This tiny book has only selected words. Try a bigger dictionary together.",
 "model": "A tiny dictionary, written for this market. Real dictionaries have many more words on every page.",
 "storyBook": "Dot uses a bigger dictionary in the story. This tiny book has only selected pages.",
 "alphabet": "a b c d e f g h i j k l m n o p q r s t u v w x y z",
 "incomplete": "Some parts are still waiting. You can keep this version or keep trying.",
 "editable": "Your work is still here. You can change it.",
 "refused": "This change could not be kept. Download your Notes, then try another job.",
 "savingOff": "Saving is off. Your work is here for this session; download your Notes to keep it.",
 "savingFailed": "This browser could not save the change. Your work is here for this session; download your Notes.",
 "prefixUnavailable": "This earlier sign bench cannot be changed here. It is still in your Notes. You can use another bench.",
 "pageUnavailable": "This earlier page cannot be read here. It is still in your Notes. Choose another page.",
 "jobUnavailable": "This earlier job cannot be changed here. It is still in your Notes. Choose another job.",
 "missingJob": "That earlier job is not available here. Choose a job; your earlier work stays in Notes.",
 "emptyPage": "There are no readable words on this earlier page. Try another page.",
 "emptyParts": "There are no readable parts in this earlier collection. Your work stays in Notes.",
 "targetUnavailable": "This earlier word cannot be checked here. Choose another word. It stays in your Notes.",
 "pageDifferent": "Keep looking. Compare your word with the guide words, one letter at a time.",
 "offscreen": "Try a real sign together. Say what you want it to mean. Check one spelling in a bigger dictionary.",
 "grownup": "This room explores prefix meanings, keeping letters when parts join, ABC order and checking a spelling. All checks are guided practice with supplied words, not independent reading or spelling assessment. The tiny book is a made-up model with selected pages. A word missing from it may still be a real word. Keep an unexpected combination, talk about it, or check a bigger dictionary together. No sound samples play here. Your child’s own writing stays on paper or aloud, read by a person. First and latest kept versions show changes; each job keeps its first and up to eleven recent checks, not every try. No story chapter is unlocked.",
 "glossary": [
  {
   "term": "Prefix",
   "text": "letters added at the start of a word that change its meaning, like re- in reopen."
  },
  {
   "term": "Root word",
   "text": "a word before any prefix or suffix is added, like spell in misspell."
  },
  {
   "term": "Word part",
   "text": "a piece that helps build a word, like graph in autograph."
  },
  {
   "term": "Dictionary",
   "text": "a book or screen that lists words in ABC order and tells what they mean."
  },
  {
   "term": "ABC order",
   "text": "the order of the alphabet. Also called alphabetical order."
  },
  {
   "term": "Guide words",
   "text": "the first and last words on a dictionary page, shown at the top."
  },
  {
   "term": "Autograph",
   "text": "your own name, written by you, for someone to keep."
  },
  {
   "term": "Antifreeze",
   "text": "a liquid that keeps water from freezing."
  },
  {
   "term": "Preheat",
   "text": "to heat an oven before you bake in it."
  }
 ]
});
export function marketSignsCollection(){return structuredClone(initial);}
