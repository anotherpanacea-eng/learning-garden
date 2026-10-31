// Original finite teaching material reviewed under spec297. No saved learner records.
export const hingeCases = [
  {
    "id": "same-turn",
    "title": "Same turn, different arms",
    "request": "Keep the same selected turn while changing either visible arm length.",
    "explanation": "The drawn ends can move farther apart or closer together while the directions stay fixed. When only lengths change and their directions stay fixed, the selected turn stays the same.",
    "reference": {
      "opening": 60,
      "goldLength": 2,
      "blueLength": 2,
      "tilt": 0
    },
    "initial": {
      "opening": 60,
      "goldLength": 1,
      "blueLength": 3,
      "tilt": 0
    }
  },
  {
    "id": "tips-trick",
    "title": "The far-apart tips",
    "request": "Which model has the bigger turn? Press Compare turns to line them up instead of comparing the distance between their tips.",
    "explanation": "In this starting pair the long arms have farther-apart tips, but their 45° turn is smaller than the short arms’ 110° turn. If you change the working hinge, compare its current turn instead.",
    "reference": {
      "opening": 110,
      "goldLength": 1,
      "blueLength": 1,
      "tilt": 0
    },
    "initial": {
      "opening": 45,
      "goldLength": 3,
      "blueLength": 3,
      "tilt": 0
    }
  },
  {
    "id": "tilted-square",
    "title": "A tilted square corner",
    "request": "Make the selected turn match the reference. Try the quarter-turn card, even when the picture is tilted.",
    "explanation": "A quarter turn stays a right angle when the whole picture turns. Longer arms do not make it a larger angle.",
    "reference": {
      "opening": 90,
      "goldLength": 2,
      "blueLength": 3,
      "tilt": 0
    },
    "initial": {
      "opening": 110,
      "goldLength": 3,
      "blueLength": 1,
      "tilt": 60
    }
  },
  {
    "id": "near-right",
    "title": "Either side of a quarter turn",
    "request": "Compare these almost-square openings. Show the quarter-turn card on your hinge, then press Compare turns to line the reference up so the card can check it too.",
    "explanation": "85° is a little less than a quarter turn; 95° is a little more. Only exactly 90° is a right angle. Use the current measured settings if you change the hinge.",
    "reference": {
      "opening": 85,
      "goldLength": 2,
      "blueLength": 2,
      "tilt": 0
    },
    "initial": {
      "opening": 95,
      "goldLength": 2,
      "blueLength": 2,
      "tilt": 0
    }
  },
  {
    "id": "straight",
    "title": "A half turn",
    "request": "Move the blue arm until the marked sweep is a half turn. Leave the lengths alone if you like.",
    "explanation": "A 180° half turn puts the rays in opposite directions along one straight line. The amount of turn does not depend on the drawn lengths.",
    "reference": {
      "opening": 180,
      "goldLength": 2,
      "blueLength": 2,
      "tilt": 15
    },
    "initial": {
      "opening": 150,
      "goldLength": 3,
      "blueLength": 3,
      "tilt": 15
    }
  },
  {
    "id": "long-way",
    "title": "Beyond a half turn",
    "request": "Follow the whole marked sweep. Match it without replacing it with the shorter route between the rays.",
    "explanation": "The reference marks 270°: three quarter turns. That selected turn is reflex. The other way between these rays is 90° going clockwise; it is not the marked reference sweep.",
    "reference": {
      "opening": 270,
      "goldLength": 2,
      "blueLength": 2,
      "tilt": 0
    },
    "initial": {
      "opening": 90,
      "goldLength": 2,
      "blueLength": 2,
      "tilt": 0
    }
  },
  {
    "id": "full-turn",
    "title": "Back to the starting direction",
    "request": "Compare no turn with one full turn. The rays can end in the same direction; what does the sweep tell us?",
    "explanation": "In the starting pair, 0° has made no turn. 360° has gone once all the way round. Matching final directions does not make these selected turns equal.",
    "reference": {
      "opening": 360,
      "goldLength": 2,
      "blueLength": 2,
      "tilt": 0
    },
    "initial": {
      "opening": 0,
      "goldLength": 1,
      "blueLength": 3,
      "tilt": 0
    }
  }
];
export const hingeCopy = {
  "title": "Hinge Bench",
  "opening": "Turn the blue arm around the pin with the buttons. Change an arm’s length, then change the turn. What changes? What stays the same?",
  "notice": "A made-up pointer model. The arms show parts of rays that continue beyond the drawing. This bench stops after one full turn; mathematical turns can go further. This is not a tool for measuring real objects.",
  "direction": "Follow the curved arrow from the gold starting arm to the blue moving arm. It marks the counterclockwise turn we are comparing.",
  "units": "A degree is one of 360 equal parts of a full turn. 90° is a quarter turn, 180° a half turn, and 360° one full turn. Four quarter turns make a full turn.",
  "coincident": "Gold and blue point along the same ray. The marked sweep tells us whether this is no turn or one full turn.",
  "lengths": "Short / Medium / Long · visible arm length, not angle size",
  "card": "This card shows one 90° quarter turn from the starting arm. Compare the whole marked sweep with it. A bigger sweep can contain a quarter turn without being a right angle.",
  "overlay": "Dashed reference: its pin and starting direction are lined up with yours. Turning the whole reference to align it does not change its selected turn.",
  "visit": "Settings last for this visit. They are not added to your notes. Trying another hinge revisits this small collection; it is not a new assessment.",
  "parent": "Ask what would change if only one arm became longer, and what would change if the blue arm turned while both lengths stayed fixed. A spoken explanation is welcome; this bench does not record or grade it. Paper-and-card turning can be explored together offscreen; the screen does not establish real-tool skill."
};
export const hingeFrames = [
  {
    "title": "A small opening.",
    "text": "Both example turns are 60°. Start with short visible arms. The blue ray has turned through the same amount from its starting ray in each model.",
    "reference": {
      "opening": 60,
      "goldLength": 1,
      "blueLength": 1,
      "tilt": 0
    },
    "working": {
      "opening": 60,
      "goldLength": 1,
      "blueLength": 1,
      "tilt": 0
    }
  },
  {
    "title": "Stretch without turning.",
    "text": "Keep 60° and extend both visible arms from short to long. The ends spread farther apart; the selected turn stays 60°. Length is changing here, not angle measure.",
    "reference": {
      "opening": 60,
      "goldLength": 1,
      "blueLength": 1,
      "tilt": 0
    },
    "working": {
      "opening": 60,
      "goldLength": 3,
      "blueLength": 3,
      "tilt": 0
    }
  },
  {
    "title": "Long arms, smaller turn.",
    "text": "The 110° reference has short arms. The 45° working example has long arms and a bigger distance between its tips. Follow the turns or align the starting rays: 45° is still the smaller turn.",
    "reference": {
      "opening": 110,
      "goldLength": 1,
      "blueLength": 1,
      "tilt": 0
    },
    "working": {
      "opening": 45,
      "goldLength": 3,
      "blueLength": 3,
      "tilt": 0
    }
  },
  {
    "title": "Turn the whole picture.",
    "text": "Rotate both arms of a 60° example together by 120°. Its direction on the page changes; the turn from its starting ray to its moving ray stays 60°.",
    "reference": {
      "opening": 60,
      "goldLength": 2,
      "blueLength": 2,
      "tilt": 0
    },
    "working": {
      "opening": 60,
      "goldLength": 2,
      "blueLength": 2,
      "tilt": 120
    }
  },
  {
    "title": "Same direction, different sweep.",
    "text": "In one example the moving ray has not turned: 0°. In the other it has gone once all the way round: 360°. The final rays point the same way, but the marked sweeps differ.",
    "reference": {
      "opening": 0,
      "goldLength": 2,
      "blueLength": 3,
      "tilt": 0
    },
    "working": {
      "opening": 360,
      "goldLength": 2,
      "blueLength": 3,
      "tilt": 0
    }
  }
];
export const hingeTypeText = {
  "zero": "Zero turn · no turn.",
  "acute": "Acute · less than a quarter turn.",
  "right": "Right angle · exactly a quarter turn.",
  "obtuse": "Obtuse · between a quarter and a half turn.",
  "straight": "Straight angle · half a turn.",
  "reflex": "Reflex · between a half and a full turn.",
  "full": "Full turn · once all the way round."
};
