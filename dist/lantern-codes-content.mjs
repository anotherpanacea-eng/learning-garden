// Original project fiction/model, adapted from draft236(a); no upstream code or prose.
export const lanternCodeSource={
 version:1,id:'tower-four',model:'lamp-code-v1',title:'Lantern Codes',
 messages:[{id:'safe',label:'All safe'},{id:'water',label:'Water rising'},{id:'boards',label:'Boards in'},{id:'help',label:'Come help'}],
 rules:{maxFlashes:5,short:1,long:3,gap:1,rain:'long-only'},
 presets:[{id:'a',title:'Code A',patterns:{safe:'S',water:'L',boards:'SS',help:'SL'}},{id:'b',title:'Code B',patterns:{safe:'L',water:'LL',boards:'LLL',help:'LLLL'}}],
 copy:{
  welcome:'The storm cracked a pane in the Post Office tower. Dot has repaired the lantern. Pip flashes toward the bakery. The baker waves. “He understood!” says Pip. “Understood what?” asks Dot. Pip meant bread. Perhaps the baker thought hello. Help Dot agree on a code.',
  learn:'A flash is a signal. Dot needs the agreed code to read one of our four messages. A message is what you mean; its pattern is how you send it. A flag raised and a drum pattern could carry the same message if their readers knew each agreement.',
  guided:'Choose All safe. Add a short flash. Give Dot your card, then send. Try sending before you share the card, too. Seeing a signal and knowing its agreed meaning are different.',
  build:'Choose a message, then build its pattern. Short and long flashes are your building pieces. Give Dot a copy when you want her to use these meanings.',
  send:'Choose the message and weather, then send. Dot reads only what she sees using her own copy of the card. If you revise your code, her copy stays as it was until you share again.',
  compare:'Test all four messages, then compare codes for the job. A quick code may lose its differences in rain. Can you make another code Dot can read?',
  help:'Start with one message. Check the pattern, give Dot the card, and send. If several messages look the same to Dot, change a pattern so the visible parts differ. A blank message needs a pattern first.',
  example:'A different pair agree that a raised flag means the bakery is open and a lowered flag means it is closed. If the baker changes those meanings but the visitor keeps the old card, they may disagree even though the visitor sees the flag clearly.',
  limit:'A made-up model: real rain does not hide every short flash. Here, pretend rain hides short flashes; Dot sees only the long flashes, with no clues from the missing places. Each Send is one framed message. Sender beats do not include message-boundary time.',
  cost:'Sender beats: a short flash takes 1, a long flash 3, and each gap 1. Short, gap, long takes 1 + 1 + 3 = 5. This is a model cost, not a timed challenge.',
  goal:'Dot can read all the messages in this pretend rain. Keep this design, or try another. A different code might do the same job.',
  outcomes:{unassigned:'This message has no pattern yet. Add a short or long flash.',invisible:'No flashes reach Dot in this model rain. Silence is not an assigned message here.', 'no-card':'Dot sees the flashes, but has no agreed card. Give her a copy of your meanings.',unlisted:'Dot’s card has no matching pattern for what she sees. Compare the two cards.',ambiguous:'More than one meaning on Dot’s card looks like this. These messages need different visible patterns.',read:'Dot’s card gives the message you intended.', 'read-other':'Dot’s card gives a different message. Your two cards do not agree for this signal.'}
 }
};
