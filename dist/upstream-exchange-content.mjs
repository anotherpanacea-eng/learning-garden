import {actTwoContent} from './act-two-content.mjs';
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
export const upstreamCopy=freeze({
  "title": "Upstream Post.",
  "introduction": "Nuria wants to compare storm notes. What would you like to ask her?",
  "start": "Start a reply.",
  "post": "Put in the postbag.",
  "postbag": "To Nuria · Vadoalto. The courier will carry this question in our story.",
  "openReply": "Open Nuria's reply at the next post round.",
  "rereadReply": "Reread Nuria's reply.",
  "ownWords": "You can say or write a question in your own words with someone beside you. The postbag here keeps the supplied sentence you choose.",
  "help": "A useful question tells your reader which event or place you mean, and what information you need. A careful answer can still be an estimate.",
  "together": "We are exploring together.",
  "notesDisclaimer": "These are local story actions with supplied questions and replies. Posting and opening do not establish independent writing, comprehension or measurement skill. Support at posting is kept separately from later help. No actual message was sent.",
  "shorter": "Shorter",
  "longer": "More detail"
});
export const upstreamSource=freeze({...{
  "id": "vadoalto-first-exchange",
  "version": 1,
  "title": "Upstream Post",
  "origin": "Original fictional English story correspondence, Learning Garden.",
  "post": {
    "reference": "ordinary level",
    "unit": "cm",
    "step": 50,
    "max": 250,
    "estimate": 240,
    "approximate": true
  },
  "questions": [
    {
      "id": "height",
      "label": "Height and starting line",
      "question": "Nuria, how high did the brook reach at Vadoalto during this storm, which units did you use, and where did you start measuring?",
      "short": [
        "Hello again! For this storm's highest mark at Vadoalto, my estimate is about 240 cm above our fixed line labelled ordinary level. That is our own starting line. I have drawn the post so you can see what I mean. —Nuria"
      ],
      "longer": [
        "Hello again! I mean this storm at our Vadoalto post. My estimate is about 240 cm above a fixed line we label ordinary level. The unit is centimetres, written cm. That line is our own reference, not today's water surface. My sketch shows the marks and the reported estimate. It does not show the brook's depth or the town's height above the sea. —Nuria"
      ],
      "help": [
        "Ask for a number, its unit, and what it is measured from. A number alone leaves part of the story missing."
      ]
    },
    {
      "id": "marks",
      "label": "Marks and estimates",
      "question": "Nuria, could you draw the marks on Vadoalto's post and explain how exact your storm report is?",
      "short": [
        "Here is my sketch! The marks are 50 cm apart, starting at our fixed line labelled ordinary level. My estimate is about 240 cm above that line. I judged the storm mark by eye: between 200 and 250 cm, closer to 250 cm. The sketch alone does not tell you exactly 240 cm. —Nuria"
      ],
      "longer": [
        "The positive marks are 50, 100, 150, 200 and 250 cm above our fixed line labelled ordinary level. Five equal intervals reach 250 cm. My storm estimate is about 240 cm above that line. I judged the storm mark by eye: between 200 and 250 cm, closer to 250 cm. The dashed mark is a picture of that report. You cannot recover exactly 240 cm from these 50 cm marks alone. A specific question can still have an approximate answer. —Nuria"
      ],
      "help": [
        "Look for the distance between marks. Then ask whether a reported number is exact or approximate."
      ]
    },
    {
      "id": "record",
      "label": "What the record covers",
      "question": "Nuria, does your note describe this storm's highest mark at Vadoalto, or the water level now, and what does it leave unknown?",
      "short": [
        "My note is about this storm's highest mark at our post, not the water now. My estimate is about 240 cm above our fixed line labelled ordinary level. That number alone does not tell us why it rose or how dangerous the flood was. —Nuria"
      ],
      "longer": [
        "I am reporting this storm's highest mark at the Vadoalto post, about 240 cm above our fixed line labelled ordinary level. I am not sending a reading of the water now. This letter does not give the brook's depth, the amount of water flowing, the damage, or a proven cause. Those would need other evidence and perhaps another question. —Nuria"
      ],
      "help": [
        "Ask what event a record describes. Keep what it says separate from what you still wonder."
      ]
    },
    {
      "id": "compare",
      "label": "Comparing places",
      "question": "Nuria, what would we need to know to compare the two towns' storm records fairly?",
      "short": [
        "We need the event, units and starting line for each record. My estimate is about 240 cm above Vadoalto's own fixed line labelled ordinary level. What is your record measured from? Local rises do not tell us the towns' heights or rank the danger. —Nuria"
      ],
      "longer": [
        "First, check which event each record describes and how it was made. My estimate for this storm is about 240 cm above Vadoalto's own fixed line labelled ordinary level. Please ask what starting line and units your record uses. Each town can have its own reference. Local rises do not decide absolute water elevations, brook depths, flow or danger. We would need more evidence for those questions. —Nuria"
      ],
      "help": [
        "The same unit helps, but a unit is not a shared starting line. Ask what each number is measured from."
      ]
    }
  ]
},letter:[...actTwoContent.letter.longer]});
