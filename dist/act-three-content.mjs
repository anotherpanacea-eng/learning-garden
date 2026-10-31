// Original finite story from spec326 and its named 120 sources. Reading is not assessment.
export const actThreeContent={
  "title": "Act III · Beyond Willow Bridge",
  "hook": "A letter came from Vadoalto, up the river. The storm hit them too. The old path by the high ford is marked with faded ribbons.",
  "question": "The question the town is carrying: What does upstream know?",
  "opening": {
    "short": [
      "Vadoalto is a day's walk upstream, by the high ford. Nobody has walked it in years. The old fence posts have faded ribbons on them."
    ],
    "longer": [
      "Upstream is closer than it sounds. Vadoalto is a day's walk by the high ford, or half a day by boat if the river is kind. Nobody in Willowbank has made the trip in years, and nobody can quite say why. \"We just stopped,\" says the miller. \"People used to come and go all the time. When I was small.\" On the old fence posts along the river path there are ribbons, faded almost white, tied in neat, careful knots. Pip holds one next to the bow Bramble tied on the parcel. They're the same knot."
    ]
  },
  "chapters": {
    "market": {
      "title": "The floating market",
      "short": [
        "Boats come down from Vadoalto with reed baskets and big round loaves. Everyone wants to trade. Nobody agrees on sizes."
      ],
      "longer": [
        "One morning there are boats at the landing: flat, wide boats from Vadoalto, loaded with reed baskets, round loaves as big as cartwheels, and jars of dark honey. The traders call out their wares in Spanish and English. *\"¡Pan, cestas, miel!\"* Bread, baskets, honey. Pip tries to trade one apple for one loaf. The baker from Vadoalto laughs so hard she has to sit down. \"One of your apples,\" she says, \"for one of my loaves? We'll need to talk about sizes.\""
      ],
      "intro": "Marisol's barge is unloading at the landing. Help with the cargo, then bring that errand here.",
      "hostLabel": "Visit the River Market",
      "hostHref": null,
      "offer": "Offer this unloading",
      "kept": "Marisol ticks the cargo off her list and waves from the barge.",
      "keeperNote": "Trade between towns needs a rate everyone agrees on: how much of one thing is worth how much of another. A fair rate isn't always one-for-one."
    },
    "seeds": {
      "title": "The seed exchange",
      "short": [
        "Vadoalto grows a tall reed that loves wet ground. Willowbank grows apples. Each wants what the other has."
      ],
      "longer": [
        "Nuria comes down on one of the boats, carrying a bundle of tall green reeds taller than she is. \"*Carrizo*,\" she says. \"Reed. We grow it by the river, where the ground is always wet. It's good for baskets and roofs, and it doesn't mind a flood.\" The orchard keeper looks at the reeds, then towards the low corner of her orchard, then back at the reeds. Vadoalto wants apple seedlings; their orchard was flattened in the storm. Willowbank wants reed for baskets and roofs. Everyone wants honey."
      ],
      "intro": "Apple seedlings for Vadoalto, reed for Willowbank. Bring an exchange plan you kept.",
      "hostLabel": "Visit the seed exchange table",
      "hostHref": "#desk/exchange",
      "offer": "Offer this exchange plan",
      "kept": "Nuria tucks your plan into her bundle of reeds, to take upstream.",
      "keeperNote": "Reeds are wetland plants. The orchard keeper has just noticed something about her low corner."
    },
    "route": {
      "title": "The route by the high ford",
      "short": [
        "{courier} sets off for Vadoalto by the old path. At every fork, there's a faded ribbon. Someone tied them to show the way."
      ],
      "longer": [
        "The first letter to Vadoalto goes by land, by the old path through the high ford, because Dot says a courier should know the way and not just the river. {courier} sets off with a map, a sandwich and a parcel of seedlings. At the first fork there's a post with a faded ribbon on it. Blue, on the left. At the second, gold, on the right. \"Bramble's grandmother,\" says {guide}. \"She marked the whole way.\" Halfway there, the ribbons stop. A new path has been cut straight across the old one, and nobody tied anything to it."
      ],
      "intro": "A courier who knows the times knows the way. Bring a walk you kept.",
      "hostLabel": "Visit the Courier Clock Walk",
      "hostHref": "#post/clock-walk",
      "offer": "Offer this walk",
      "kept": "On time. Dot writes the time in the post office book.",
      "keeperNote": "A path, a timetable and a map all describe the same journey in different ways. A map shows where; a timetable shows when; a scale tells you how far one step on the map is in the real valley."
    },
    "letters": {
      "title": "Letters up and down the river",
      "short": [
        "Letters go up the river to Nuria in Vadoalto and down the river to Léon in Les Saules. Some are in Spanish. Some are in French."
      ],
      "longer": [
        "Once the path is open, letters start to travel. Nuria writes from upstream, half in Spanish and half in English, with drawings of her flood post in the margins. Then a letter arrives from the other direction: Léon, who keeps the ferry at Les Saules, where Willow Brook meets the big river. His letters are in French and English and always slightly damp. \"Willowbank is in the middle,\" says Dot, sorting the post. \"Everyone's letters come through us.\" She says it as if she's just been given an important job. She has."
      ],
      "intro": "Dot has a post bag for Vadoalto. Bring a question you posted to Nuria.",
      "hostLabel": "Write to Nuria",
      "hostHref": "#almanac/upstream-reply",
      "offer": "Offer this question",
      "kept": "A clear question, sent upstream. Dot pins your copy next to Nuria's letter."
    }
  },
  "ui": {
    "start": "Go beyond Willow Bridge",
    "fromWork": "From your work",
    "back": "← Back to Beyond Willow Bridge",
    "return": "Bring work to Beyond Willow Bridge",
    "short": "Short",
    "longer": "Longer",
    "original": "Hollis's page",
    "hear": "Read this aloud",
    "how": "Bring work from any three chapters. Then the seedlings can go up the river.",
    "count": "{n} of 4 chapters have work in this story.",
    "send": "Send the seedlings up the river",
    "beforeSend": "When three chapters have work, the seedlings can go.",
    "replay": "Read the ending again",
    "reveal": "Read the third page",
    "keepers": "Back to the Keeper's Pages",
    "explore": "Keep exploring"
  },
  "candidate": {
    "market": "La carga, try {tryId} ({amount})",
    "seeds": "Exchange plan {visitId}, {edition}",
    "route": "{title}, kept walk",
    "letters": "Your question to Nuria: {label}"
  },
  "kinds": {
    "market": "unloading",
    "seeds": "exchange plan",
    "route": "walk",
    "letters": "question"
  },
  "activities": {
    "market": "the River Market",
    "seeds": "the seed exchange table",
    "route": "the Courier Clock Walk",
    "letters": "the upstream post"
  },
  "messages": {
    "noWork": "Nothing from {activity} is ready to bring yet. Visit, keep some work, and come back. Every activity is open.",
    "offered": "Your {kind} is part of this story.",
    "badReceipt": "An earlier offer here can't be read in this version. It stays in your notes. The other chapters are open.",
    "refused": "This couldn't be kept. Your work is unchanged. Download your notes.",
    "unreadableWork": "Some earlier work cannot be read by this version. It stays in your notes. You can choose other saved work or another chapter.",
    "missing": "That saved work is no longer available here. Choose another; your earlier work stays.",
    "unreadableAct": "This part of your earlier story cannot be continued here. Its original record stays in your notes. The Keeper's Pages and every game remain available.",
    "unreached": "This page is still drying. Return to Beyond Willow Bridge whenever you like.",
    "badPreference": "An earlier reading choice stays in your notes. This version is showing Short."
  },
  "ending": {
    "title": "Both Ways Across Willow Bridge",
    "short": [
      "Seedlings go up the river. Reeds and honey come down. Nuria comes to visit, and the third page comes free. She knows the handwriting."
    ],
    "longer": [
      "A parcel of apple seedlings goes up the river path. A bundle of reeds and a jar of Vadoalto honey come back down. Nuria comes with them, to see the mill and the famous Willowbank flood post. She stands in front of it for a long time, reading the marks.",
      "\"Ours has marks like this,\" she says. \"Somebody taught me to read them.\"",
      "While she's reading the drying pages over your shoulder, the third one comes free."
    ],
    "seasons": {
      "spring": "The brook is high and fast, and the boats go home quicker than they came.",
      "summer": "Nuria swims in the millpond. The miller pretends not to see.",
      "autumn": "The seedlings go up the river just in time for planting.",
      "winter": "The boats can't run in the cold, so Nuria walks home by the high ford, following the ribbons."
    },
    "alt": "Seedlings in a crate go up the river path while a barge comes down with reeds and a honey jar. Nuria stands at the Willowbank flood post, reading the marks."
  },
  "page": {
    "title": "The Ways",
    "edge": "ways",
    "reveal": "Nuria is reading the drying pages over your shoulder when the third one comes free. She goes very still. \"I know this writing,\" she says.",
    "short": [
      "A letter about *the Ways*: the paths between the river towns, and the paths the water takes. Nuria knows who wrote it."
    ],
    "longer": [
      "The page is a letter. It says there are three Ways between Willowbank and the towns upstream: the river path, the bridge road and the high ford. Then it says there are other ways too: \"the water's ways, which are where it goes when there is too much of it.\" Nuria puts her paw on the signature, a long thin H. \"That's Hollis,\" she says. \"Hollis taught me to read our flood post. Then they went to live by the sea.\""
    ],
    "original": [
      "There are three Ways between Willowbank and Vadoalto: the river path, the bridge road and the high ford. Keep them open, even in winter, even when nobody seems to need them. Someone always does. There are also the water's ways, which are where it goes when there is too much of it. Those need keeping too. A town that closes them [smudged] finds out where the water goes instead. H."
    ],
    "after": [
      "\"Hollis taught me,\" says Nuria. \"Every spring they came up the river path to check our post. Then one year they said their legs wanted the seaside, and they went. They never said they were the Keeper of anything.\" She laughs. \"They wouldn't. Hollis didn't like titles.\"",
      "Act III: Beyond Willow Bridge. Three pages are dry. We know who wrote them.",
      "Hollis. Pip says the name to himself, to see how it sounds. Tomorrow there may be another page."
    ]
  },
  "notes": {
    "line": "Act III, Beyond Willow Bridge: {state}.",
    "details": "The story collects work the explorer chose to bring. It doesn't check or score that work, and finishing an act isn't a measure of learning. Every activity stays open before, during and after the story."
  }
};
