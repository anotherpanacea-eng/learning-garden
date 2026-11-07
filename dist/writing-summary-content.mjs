// Original reviewed narrative-summary practice. Whole source scenes remain factory-owned.
import {makeThreadSource} from './two-threads-content.mjs';
const clone=structuredClone;
export const summaryCopy=Object.freeze({
  "label": "Summary Press",
  "invitation": "The next reader needs a short account. Which sentences carry what matters?",
  "prompt": "Choose sentences; their order is prepared. Keep what this reader needs, and leave the rest in a tray.",
  "reader": "For someone who needs a short account of this story.",
  "notice": "A complete original story from Willowbank. These are the story's words, not a real town record.",
  "aside": "These sentences stay here. A detail can be true without belonging in this short account. Some sentences go beyond what the story says; others go against it. Compare them with the story.",
  "fit": "These choices fit this reader's brief. The prepared sentences keep the important connections without adding a reader's judgment. Another brief may need different details.",
  "general": "Compare the sentence with this reader's brief and the complete story.",
  "hint": "Who is involved? What gets in the way, what changes and how does it end? If a sentence says someone thinks something, keep who thinks it.",
  "support": "The story and sentence wording are provided. Try your own words aloud or on paper with someone who can listen.",
  "returnPrompt": "Reopen another brief. Which detail matters now? Then tell someone a short account of a different whole story. Ask whether they can follow what changed and how it ended.",
  "unavailable": "This earlier draft has no usable summary guide here. Its sentences, story references and kept versions stay unchanged in Notes. You can still arrange and keep it.",
  "grownup": "Summary Press supports selecting prepared sentences for three finite reader briefs. Checks compare placements with the reviewed alternatives for that frozen brief. They do not evaluate original prose, prove whole-story reading, establish a level or identify a theme. Read together, hear, speak or work on paper. A child's own account needs a human reader. There is no word-count score or single required summary length.",
  "empty": "No sentences chosen for this summary yet.",
  "waiting": "Waiting sentences",
  "waitingEmpty": "No sentences waiting.",
  "different": "Some sentences fit another tray for this brief.",
  "feedbackDetails": "Compare these sentences.",
  "incomplete": "Some parts are still waiting. You can keep this version or keep arranging.",
  "checkUnavailable": "This earlier summary guide cannot check a draft here. Your work is still here to arrange or keep.",
  "example": "In The Spare Chair, “Mina replaced an unsteady meeting chair; everyone had a steady seat ready” keeps the problem and its outcome. “Mina had a chair” loses them. Now return to your whole story."
});
const demo={
  "title": "The Spare Chair",
  "brief": "A visitor wants a short account of the chair problem, Mina's change and the result.",
  "story": "Mina carried a blue chair to the meeting. At the doorway she saw that one leg wobbled. She put the chair aside and brought a steady one from the next room. When the visitors arrived, everyone had somewhere safe to sit.",
  "steps": [
    "A summary is a short account that keeps the important events and how they connect. For this reader, keep the chair problem, Mina's change and the result.",
    "Blue describes the chair, but taking out its color does not lose that connection. Taking out the change of chair does.",
    "Keep thoughts as thoughts when they matter: “Mina thought the chair would tip” would report a belief. It would not establish that it tipped. Our little story does not state that belief, so we cannot add it to this account.",
    "An objective summary keeps the story's account separate from our judgments. Objective does not mean that people have no feelings. A different reader's question can make a different detail important."
  ]
};
const comparisons=[
  {
    "title": "A short account",
    "text": "Mina found that a meeting chair was unsteady and replaced it; everyone had a steady seat ready.",
    "notice": "This keeps problem, change and result. It leaves out color and the doorway."
  },
  {
    "title": "Every little step",
    "text": "Mina carried a blue chair to the meeting, reached the doorway, saw its leg wobble, put it aside, went to the next room, brought a steady chair and had a seat ready when the visitors arrived.",
    "notice": "The events fit, but this reader does not need every movement or the color to follow the change."
  },
  {
    "title": "A reader's review",
    "text": "Mina is wonderful, and this is the best chair story ever.",
    "notice": "This gives a reader's judgment. It does not tell what happened with the chair."
  },
  {
    "title": "Too much left out",
    "text": "Mina had a chair.",
    "notice": "It is short, but loses the problem, the replacement and the result. Shorter is not always a better summary."
  }
];
const lantern=[
  {
    "id": "l1",
    "text": "On the evening of the town supper, Ivo brought a box of lanterns to the hall. The hooks above the long table were empty. ‘Perhaps nobody brought the hanging cord,’ he thought. He set the box on a green bench."
  },
  {
    "id": "l2",
    "text": "Across the hall, Suri checked a list beside a cupboard. She had put the cord in the cupboard to keep it out of the rain. She had not yet seen Ivo come in."
  },
  {
    "id": "l3",
    "text": "‘I have the lanterns, but I cannot hang them,’ Ivo called. Suri opened the cupboard and showed him the cord. They checked the list together: lanterns, cord and hooks were all ready."
  },
  {
    "id": "l4",
    "text": "They hung the lanterns above the table before the cooks brought supper. Beside the hall door they left the list, with a note saying where each spare item was stored."
  }
];
const jobs=[
  {
    "id": "summary-knock",
    "title": "A delivery that nearly missed",
    "brief": "A visitor wants a short account of why the photograph's delivery was delayed and how Leena and Rowan finally met. Keep the obstacle, the change and the outcome. The photograph's purpose can stay if you want that context.",
    "headings": [
      "keep",
      "extra",
      "opinion",
      "unknown"
    ],
    "rows": [
      {
        "id": "review",
        "text": "I found the repeated knocking pattern exciting.",
        "accepted": [
          "opinion"
        ],
        "refs": [
          "a3",
          "b3"
        ],
        "feedback": "That reports a reader's response to the repeated pattern, not an event in the delivery."
      },
      {
        "id": "delay",
        "text": "Leena waited with a photograph at the library's shut courtyard door while Rowan looked for a caller at the other entrance.",
        "accepted": [
          "keep"
        ],
        "refs": [
          "a1",
          "a2",
          "b2"
        ],
        "feedback": "This joins the waiting delivery to the wrong entrance. Without it, the reader loses why they missed each other."
      },
      {
        "id": "purpose",
        "text": "The photograph was for the library's collection.",
        "accepted": [
          "keep",
          "extra"
        ],
        "refs": [
          "a1"
        ],
        "feedback": "This purpose is supported context. For this brief you may keep it or leave it as extra detail."
      },
      {
        "id": "worry",
        "text": "When no one answered her knock at the library's courtyard door, Leena wondered whether they had forgotten her.",
        "accepted": [
          "extra"
        ],
        "refs": [
          "a2"
        ],
        "feedback": "This is Leena's uncertain thought. This brief can explain the delayed delivery without it; another brief asks specifically about her worry."
      },
      {
        "id": "motive",
        "text": "Rowan deliberately kept Leena waiting because he disliked her.",
        "accepted": [
          "unknown"
        ],
        "refs": [
          "b1",
          "b2",
          "b3",
          "together"
        ],
        "feedback": "The story shows what Rowan was doing and where he looked. It does not establish this hostile motive."
      },
      {
        "id": "signal",
        "text": "After Leena knocked in a repeated pattern, Rowan followed the sound to the courtyard door.",
        "accepted": [
          "keep"
        ],
        "refs": [
          "a3",
          "b3"
        ],
        "feedback": "This tells what changed. It connects the missed delivery with their meeting."
      },
      {
        "id": "rain",
        "text": "The first spots of rain darkened the stone.",
        "accepted": [
          "extra"
        ],
        "refs": [
          "a2"
        ],
        "feedback": "The rain is in the story. This brief can follow the delayed meeting without that small detail."
      },
      {
        "id": "outcome",
        "text": "They put the photograph beside the recording sheet and wrote a sign for the courtyard door before visitors arrived.",
        "accepted": [
          "keep"
        ],
        "refs": [
          "together"
        ],
        "feedback": "This keeps the shared outcome. A short account still needs how this delivery ended."
      },
      {
        "id": "refusal",
        "text": "Leena left the photograph on the step and went home.",
        "accepted": [
          "unknown"
        ],
        "refs": [
          "together"
        ],
        "feedback": "The final story part shows Leena and Rowan setting the photograph beside the recording sheet together; she did not leave it on the step."
      }
    ]
  },
  {
    "id": "summary-belief",
    "title": "What Leena could know",
    "brief": "A reader asks what Leena feared when nobody answered, what she noticed next and how the meeting ended. Keep her uncertain thought attributed to her. Do not turn it into a fact about the people inside.",
    "headings": [
      "unknown",
      "keep",
      "extra",
      "opinion"
    ],
    "rows": [
      {
        "id": "folder",
        "text": "Leena had checked the address on the folder.",
        "accepted": [
          "keep",
          "extra"
        ],
        "refs": [
          "a2"
        ],
        "feedback": "This supported detail can stay as context or be left as extra for this brief."
      },
      {
        "id": "worry",
        "text": "When no one answered her knock at the library's courtyard door, Leena wondered whether they had forgotten her.",
        "accepted": [
          "keep"
        ],
        "refs": [
          "a2"
        ],
        "feedback": "This reports Leena's uncertainty. The reader asked what she feared; it does not say she really was forgotten."
      },
      {
        "id": "fact",
        "text": "The library staff had forgotten Leena and her photograph.",
        "accepted": [
          "unknown"
        ],
        "refs": [
          "a2",
          "a3",
          "together"
        ],
        "feedback": "“Perhaps” gives Leena's thought, not a narrator's confirmation that the staff forgot her."
      },
      {
        "id": "praise",
        "text": "I find Leena's decision interesting.",
        "accepted": [
          "opinion"
        ],
        "refs": [
          "a2",
          "a3"
        ],
        "feedback": "This reports a reader's response, not the brief account of her uncertainty and decision."
      },
      {
        "id": "frame",
        "text": "After knocking again, she saw an empty frame inside, suggesting someone had made room for her photograph, and decided to wait longer.",
        "accepted": [
          "keep"
        ],
        "refs": [
          "a3"
        ],
        "feedback": "This keeps what Leena noticed and the decision that followed."
      },
      {
        "id": "boards",
        "text": "Leena carried the photograph flat between two boards.",
        "accepted": [
          "extra"
        ],
        "refs": [
          "a1"
        ],
        "feedback": "This is supported, but this reader can follow her thought and the meeting without the packing detail."
      },
      {
        "id": "unseen",
        "text": "Leena saw Rowan wearing headphones through the courtyard glass.",
        "accepted": [
          "unknown"
        ],
        "refs": [
          "a3",
          "b1",
          "b3"
        ],
        "feedback": "The story tells us about Rowan's headphones. Leena's story part only says she saw part of a wall and an empty frame; it does not say she saw him wearing them."
      },
      {
        "id": "meeting",
        "text": "Rowan opened the courtyard door; he and Leena set the photograph beside the recording sheet and wrote a clear sign together.",
        "accepted": [
          "keep"
        ],
        "refs": [
          "b3",
          "together"
        ],
        "feedback": "This keeps the eventual meeting and shared outcome; her worry was not the story's ending."
      }
    ]
  },
  {
    "id": "summary-lantern",
    "title": "The Lantern List",
    "brief": "A guest missed the preparations. Give a short account of the apparent missing-cord problem, how it was resolved and what was ready for supper. Keep Ivo's guess separate from what Suri actually had.",
    "headings": [
      "extra",
      "opinion",
      "unknown",
      "keep"
    ],
    "rows": [
      {
        "id": "bench",
        "text": "Ivo put the box on a green bench.",
        "accepted": [
          "extra"
        ],
        "refs": [
          "l1"
        ],
        "feedback": "The bench and color fit the story, but the guest does not need them to follow the preparations."
      },
      {
        "id": "guess",
        "text": "Ivo arrived with lanterns and thought the cord might be missing.",
        "accepted": [
          "keep"
        ],
        "refs": [
          "l1"
        ],
        "feedback": "This gives the apparent problem as Ivo's uncertain thought, not an established loss."
      },
      {
        "id": "lost",
        "text": "Suri had lost the cord in the rain.",
        "accepted": [
          "unknown"
        ],
        "refs": [
          "l1",
          "l2",
          "l3"
        ],
        "feedback": "Ivo's guess does not establish a lost cord. Suri had put it in the cupboard to keep it dry."
      },
      {
        "id": "storage",
        "text": "Suri had stored the cord in a cupboard to keep it dry.",
        "accepted": [
          "keep",
          "extra"
        ],
        "refs": [
          "l2"
        ],
        "feedback": "This supported context can stay or be left as extra; the sentence about checking the supplies still tells how the problem was resolved."
      },
      {
        "id": "check",
        "text": "Suri showed him the cord, and they checked the list: the lantern supplies were ready.",
        "accepted": [
          "keep"
        ],
        "refs": [
          "l3"
        ],
        "feedback": "This connects the apparent problem with what they discovered together."
      },
      {
        "id": "no-outcome",
        "text": "The lanterns were still in their box when supper arrived.",
        "accepted": [
          "unknown"
        ],
        "refs": [
          "l4"
        ],
        "feedback": "The final story part says they hung the lanterns before supper; they were no longer in the box."
      },
      {
        "id": "ready",
        "text": "They hung the lanterns before supper and left the list with a note saying where spare items were stored.",
        "accepted": [
          "keep"
        ],
        "refs": [
          "l4"
        ],
        "feedback": "This keeps the finished preparations and the information they left for others."
      },
      {
        "id": "favorite",
        "text": "I like the cupboard scene.",
        "accepted": [
          "opinion"
        ],
        "refs": [
          "l2",
          "l3"
        ],
        "feedback": "That is a reader's judgment, not the account of getting the lanterns ready."
      }
    ]
  }
];
const labels={keep:'In this summary',extra:'Extra detail',opinion:'Reader opinion',unknown:'Not supported by this story'};
function storyCard(transfer){
 if(transfer)return {id:'lantern',title:'The Lantern List',origin:'An original Willowbank story, written for After the Storm.',notice:summaryCopy.notice,lines:clone(lantern)};
 const source=makeThreadSource('second-knock');
 if(!source||!Array.isArray(source.authorOrder)||source.authorOrder.length<1||source.authorOrder.length>8||new Set(source.authorOrder).size!==source.authorOrder.length||!Array.isArray(source.scenes))return null;
 const lines=[];
 for(const id of source.authorOrder){const scene=source.scenes.find(x=>x.id===id);if(!scene||!Array.isArray(scene.paragraphs)||scene.paragraphs.length!==1||typeof scene.paragraphs[0]!=='string'||!scene.paragraphs[0].trim()||Array.from(scene.paragraphs[0]).length>4000)return null;lines.push({id,text:scene.paragraphs[0]});}
 return {id:'knock',title:source.title,origin:'An original Willowbank story, written for After the Storm.',notice:summaryCopy.notice,lines};
}
function makeTask(job){
 const card=storyCard(job.id==='summary-lantern');if(!card)return null;
 return {v:1,id:job.id,family:'summary-narrative',kind:'sort',bench:'summary',title:job.title,reader:summaryCopy.reader,prompt:summaryCopy.prompt,
 teach:['A short account keeps the important events and their connections for a reader.'],hint:summaryCopy.hint,example:summaryCopy.example,
 parts:job.rows.map(({id,text})=>({id,text})),choices:job.headings.map(id=>({id,text:labels[id]})),key:Object.fromEntries(job.rows.map(r=>[r.id,r.accepted[0]])),
 feedback:{fit:summaryCopy.fit,general:summaryCopy.general,different:Object.fromEntries(job.rows.map(r=>[r.id,r.feedback]))},
 research:{v:1,cards:[card],links:Object.fromEntries(job.rows.map(r=>[r.id,[{cardId:card.id,lineIds:[...r.refs]}]]))},
 summary:{v:1,keepId:'keep',brief:job.brief,returnPrompt:summaryCopy.returnPrompt,accepted:Object.fromEntries(job.rows.map(r=>[r.id,[...r.accepted]])),demo:clone(demo),comparisons:clone(comparisons)}};
}
export const summaryTasks=jobs.map(makeTask).filter(Boolean);
