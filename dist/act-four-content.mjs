// Original finite story from specs352/366 and their named120 sources. Reading and offering are not assessment.
export const actFourContent={
  "title": "Act IV · The Town Has Two Stories",
  "question": "The question the town is carrying: Did we make the floods worse, and what should we do now?",
  "hook": "The pages say the town drained the Sponge, and then the floods got worse. Did one cause the other? Everyone has an opinion.",
  "opening": {
    "short": [
      "Now everyone has read the pages, and everyone has an opinion. Bramble says to look at the numbers. Then she shouts about the numbers."
    ],
    "longer": [
      "By lunchtime the whole village has read page 4, some of them twice, some of them out loud to people who had already read it. Some say the floods are just weather: storms come, storms go, nobody's fault. Some say the town brought them on itself, the year it drained the Sponge. The orchard keeper goes very quiet and walks down to look at her low corner. Bramble stands on the ribbon gate and tells everybody to stop shouting and look at the numbers. Then she starts shouting about the numbers."
    ]
  },
  "guideGuess": [
    "{guide} writes on a card, *Mostly the rain*, and pins it to the library door.",
    "\"I'll put my guess up first,\" says {guide}, \"so I can't pretend later.\""
  ],
  "guideChecking": [
    "{guide} reads the card on the library door again. \"Still my guess. I'll keep checking it.\""
  ],
  "chapter": {
    "title": "The old map and Hollis's account",
    "short": [
      "The year the Sponge was drained, the apples were wonderful. Five years later came the first big flood. Does that mean one caused the other?"
    ],
    "longer": [
      "{guide} lays page 1, page 2 and page 4 side by side on the library table. The map with the Sponge. The ledger of floods. The note about the fine harvest. \"Year 22, the Sponge is drained,\" reads Pip. \"Year 27, the biggest flood Hollis ever saw. That's it, then. Solved.\" Bramble, who has followed everyone into the library uninvited, shakes her head. \"Five years apart. My hat and my boots both got wet that year too, and I'll keep saying it: that doesn't mean my hat did it.\" Pip opens his mouth to argue, then shuts it again. She has a point. \"So how *would* we know?\" asks {guide}."
    ],
    "keeperNote": "Two things happening one after the other is a clue. It is not yet a proof. To argue that one caused the other, you want a reason it could (a mechanism), a pattern that holds more than once, and some way of ruling out other causes, such as wetter years.",
    "intro": "Wren keeps Hollis's ledger at the Keeper's Desk. Keep an evidence note there, then bring it to the library table.",
    "hostLabel": "Visit the ledger and the rain gauge",
    "hostHref": "#learn/science/ledger",
    "offer": "Offer this evidence note",
    "kept": "Your evidence note goes up on the library wall. People stand in front of it and argue more quietly than before."
  },
  "orchard": {
    "title": "A puzzling change at the bottom of the orchard",
    "short": [
      "The bottom corner of the orchard is always wet now. Reeds are coming up that nobody planted."
    ],
    "longer": [
      "\"The bottom corner of my orchard is always wet now,\" says the orchard keeper. \"Reeds are coming up. I never planted reeds.\" She leads everyone down to look. The grass squelches. Three of the oldest apple trees stand with their roots in a shallow puddle that never quite dries, and between them, tall and green and very pleased with themselves, are reeds. Nuria, who is visiting, crouches beside one. \"*Carrizo*,\" she says. \"It only grows where the ground is wet. It's as if the Sponge is trying to come back.\""
    ],
    "keeperNote": "Rain Paths uses invented water tokens and trays. It can compare newly stored tokens and new runoff. It has no river, mill or clock, so it cannot tell us when real floodwater arrives. A model is a way to ask a better question.",
    "intro": "Rain Paths gives two trays the same new rain. Keep a result there, then bring it down to the orchard.",
    "hostLabel": "Visit Rain Paths",
    "hostHref": "#science/rain",
    "offer": "Offer this rain result",
    "kept": "You kept a picture of the trays. Pip points at the storage spaces, then at the outlet.",
    "guideChecking": [
      "{guide} looks at the trays for a long time, then at the card on the library door. \"Still the rain,\" says {guide}. \"But I want to know where the rain is allowed to go.\""
    ],
    "scene": "The low corner of the orchard. Rain falls on three old apple trees that stand in a shallow puddle, and tall reeds grow up between them.",
    "caption": "The low corner, after the rain.",
    "noWork": "Nothing from Rain Paths is ready to bring yet. Finish a rain run, keep the result, and come back. Every activity is open.",
    "offered": "Your rain result is part of this story.",
    "candidate": "Kept rain result: {case}",
    "candidateEarlier": "Kept rain result from an earlier version",
    "unreadableWork": "Some earlier rain results cannot be read by this version. They stay in your notes. You can choose another."
  },
  "meeting": {
    "title": "The proposal for the low fields",
    "short": [
      "The bell rings for a town meeting. Three plans are on the board. Every plan costs something. Which would you keep?"
    ],
    "longer": [
      "The bell rings for a town meeting, the first anyone can remember that isn't about a fête. The whole village squeezes into the library. On the board at the front are three plans for the low fields, drawn in the librarian's best pen. Everyone gets a turn to speak. The orchard keeper speaks about her trees. The miller speaks about her mill. Nuria, visiting, speaks about Vadoalto's reed beds and turns pink when everyone listens. Then Bramble stands up, and the room gets quiet, because Bramble is not usually serious."
    ],
    "bramble": "\"Everyone keeps talking about frogs. What about the orchard keepers? Those trees are their whole year. If you want them to give up their fields, you'd better be very sure, and you'd better help them with what comes after.\"",
    "boardHeading": "The meeting board",
    "what": "What it is",
    "costs": "What it costs",
    "protects": "What it protects",
    "plans": [
      {
        "id": "wall",
        "name": "The Wall",
        "what": "A higher flood wall along the brook through town.",
        "costs": "Stone, upkeep and many hands; possible effects downstream need investigation.",
        "protects": "Intended to protect the orchard and town; its limits still matter.",
        "worries": [
          {
            "id": "wall-downstream",
            "text": "The water will go to Les Saules instead."
          },
          {
            "id": "wall-upkeep",
            "text": "A wall needs mending forever."
          },
          {
            "id": "wall-higher",
            "text": "What if the next flood is higher than the wall?"
          }
        ]
      },
      {
        "id": "sponge",
        "name": "The Sponge",
        "what": "Let the lowest orchard fields go back to marsh.",
        "costs": "Some apple trees, and some of the orchard keepers' living; the reed trade is a proposed replacement, not a guaranteed income.",
        "protects": "The marsh holds water and lets it go slowly, so less of it reaches the mill at once. Frogs. Herons.",
        "worries": [
          {
            "id": "sponge-money",
            "text": "The orchard keepers will lose money."
          },
          {
            "id": "sponge-years",
            "text": "It will take years for a marsh to grow back."
          },
          {
            "id": "sponge-alone",
            "text": "What if it isn't enough on its own?"
          }
        ]
      },
      {
        "id": "some-of-each",
        "name": "Some of Each",
        "what": "A lower wall above the mill, and a smaller wet meadow at the orchard's low corner.",
        "costs": "A little of both costs. Some trees, some stone.",
        "protects": "Some of both protections. Nobody gets everything they wanted.",
        "worries": [
          {
            "id": "some-too-little",
            "text": "Half a wall and half a marsh might be too little of both."
          },
          {
            "id": "some-complicated",
            "text": "It's complicated to build."
          },
          {
            "id": "some-unhappy",
            "text": "Nobody will be fully happy."
          }
        ]
      }
    ],
    "prompt": "Which plan would you keep for Willowbank?",
    "worryPrompt": "If something about it worries you, add the worry. Good plans have worries.",
    "keepHeading": "Keep a plan for Willowbank",
    "noWorry": "No worry for now",
    "keep": "Keep this plan",
    "kept": "Your plan goes in the almanac, under your name for it. People will keep arguing. That's allowed.",
    "keptWorry": "Your plan and your worry go in the almanac together. The librarian says the worry is the most useful part.",
    "yourPlan": "Your plan: {plan}",
    "yourWorry": "Your worry: {worry}",
    "earlierWorry": "a worry from an earlier version",
    "change": "Choose again",
    "frozen": "The meeting is over. Your plan stays in the almanac.",
    "endOffer": "Hear what the meeting decided",
    "needMore": "The meeting can end once you have kept a plan and brought work to two of the first three chapters. Every game is open.",
    "scene": "The library on meeting night. Three plans are pinned to the board at the front, and lanterns glow along the shelves.",
    "caption": "The meeting board, before anyone has decided."
  },
  "ending": {
    "title": "The Map We Changed",
    "mindHeading": "Someone changes their mind",
    "mind": {
      "orchard": {
        "speaker": "The orchard keeper",
        "line": "I thought the model could tell us when the mill would flood. It only counts water in trays. I've changed my mind about what it tells us."
      },
      "account": {
        "speaker": "Pip",
        "line": "I was sure it was all the Sponge. Now I want to know how heavy those rains were. The counts don't tell us."
      },
      "fallback": {
        "speaker": "The librarian",
        "line": "I thought we had to choose between certainty and doing nothing. We can keep a plan and write down what we still need to know."
      }
    },
    "guide": [
      "{guide} unpins the card from the library door. \"I wrote *mostly the rain*. I was sure. I can't show that either.\"",
      "\"So I've changed my mind. It could be the rain and the Sponge together. That's a better question than I had.\"",
      "{guide} writes the new idea under the old one, and leaves the old one showing."
    ],
    "tails": {
      "mira": "Mira draws a small question mark in the corner of her sketchbook, and smiles at it.",
      "rowan": "Rowan grins. \"Changing my mind is the thing I'm best at making.\"",
      "ari": "Ari turns a pebble over in one hand. \"I noticed something I hadn't noticed this morning.\""
    },
    "short": [
      "Nobody agrees about everything. But the map on the meeting board has new pencil on it now."
    ],
    "longer": [
      "The meeting goes late. Nobody agrees about everything, and nobody pretends to. But somebody changed their mind tonight because of something they found out, and said so out loud, which takes nerve. By the time the lanterns are lit, the old map on the meeting board has new pencil on it: a line here, a question mark there, a small drawing of a reed. It isn't the same map it was this morning.",
      "\"That's what Hollis's pages were for,\" says {guide} on the walk home. \"I think.\""
    ],
    "seasons": {
      "spring": "Walking home, you can hear the brook. It sounds higher than yesterday.",
      "summer": "It's still warm when the meeting ends. People keep arguing on the green, happily.",
      "autumn": "Leaves blow across the meeting board as it's carried home. Someone pins them down with apples.",
      "winter": "Frost on the library windows, and everyone's breath in the lantern light as they argue all the way home."
    },
    "almanac": "Act IV: The Town Has Two Stories. We kept a plan: {plan}.",
    "between": "The pages are loosening on the windowsill. Pause here, or turn the story on.",
    "reread": "Read the ending again",
    "pause": "Pause here",
    "scene": "The same meeting board, later. The old map has new pencil on it: a line, a question mark and a small drawing of a reed.",
    "caption": "The old map, with new pencil on it."
  },
  "page": {
    "title": "The year of the fine harvest",
    "edge": "harvest",
    "reveal": "The fourth page is short. Pip reads it out loud, then reads it again, slower.",
    "short": [
      "In the year the Sponge was drained, the orchard grew its best apples ever. Five years later came the first big flood."
    ],
    "longer": [
      "Hollis wrote that in their twenty-second year of keeping, the town drained the Sponge to make new orchard fields, and straightened the brook so it would run past them quickly. That autumn the orchard had the best harvest anyone remembered. Five years later, the brook came 120 centimeters up the flood post. \"So draining the Sponge caused the floods,\" says Pip. Bramble, who has been listening from the gate, snorts. \"My hat and my boots both got wet that year too. Doesn't mean my hat did it.\""
    ],
    "original": [
      "Year 22. The Sponge is drained and the brook cut straight past the new fields. The orchard keepers are very pleased and so, I admit, am I: the apples this autumn are [smudged]. Year 27. The brook to 120 at the post, the highest in my keeping. Wet years, or our doing? I have only my own post to go by. Vadoalto keeps a rain gauge. [smudged] someone should ask them."
    ]
  },
  "ui": {
    "start": "Continue the story",
    "pause": "Pause here",
    "keepers": "Back to the Keeper's Pages",
    "explore": "Keep exploring",
    "short": "Short",
    "longer": "Longer",
    "original": "Hollis's page",
    "hear": "Read this aloud",
    "village": "Hear what the village says",
    "reveal": "Read the fourth page",
    "reread": "Read the fourth page again",
    "back": "← Back to The Town Has Two Stories",
    "fromWork": "From your work",
    "return": "Bring work to The Town Has Two Stories",
    "later": "More of this act is still to come. Every game is open now."
  },
  "messages": {
    "noWork": "Nothing from the ledger and the rain gauge is ready to bring yet. Visit, keep a note, and come back. Every activity is open.",
    "offered": "Your evidence note is part of this story.",
    "badReceipt": "An earlier offer here can't be read in this version. It stays in your notes.",
    "refused": "This couldn't be kept. Your work is unchanged. Download your notes.",
    "unreadableWork": "Some earlier work cannot be read by this version. It stays in your notes. You can choose another note.",
    "missing": "That saved work is no longer available here. Choose another; your earlier work stays.",
    "unreadableAct": "This part of your earlier story cannot be continued here. Its original record stays in your notes. The Keeper's Pages and every game remain available.",
    "unreached": "This page is still drying. Return to the Keeper's Pages whenever you like.",
    "badPreference": "An earlier reading choice stays in your notes. This version is showing Short."
  },
  "notes": {
    "line": "Act IV, The Town Has Two Stories: {state}.",
    "details": "The story collects work the explorer chose to bring. It doesn't check or score that work. Any plan in an evidence note stays in that note; it is not the town's plan. Every activity stays open before, during and after the story."
  }
};
