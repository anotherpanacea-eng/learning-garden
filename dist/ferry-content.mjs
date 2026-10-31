// Original finite material; reviewed authoring is in docs/specs/298-ferry-deck.md.
export const ferryCases = [
  {
    "id": "riding",
    "title": "Riding together",
    "ferryVelocity": 2,
    "courierWalk": 0,
    "otherVelocity": 1,
    "courierStart": 2,
    "request": "The courier rides without walking. Step a second from the bank, then change to the ferry at the same moment.",
    "explanation": "Relative to the bank, the ferry and courier both move right at 2 m/s. Relative to the ferry, the courier stays at the same deck position: 0 m/s. Neither description has to be called the real one."
  },
  {
    "id": "with-ferry",
    "title": "Walking with the ferry",
    "ferryVelocity": 2,
    "courierWalk": 1,
    "otherVelocity": -1,
    "courierStart": 2,
    "request": "The courier walks toward the ferry's front. What changes when you watch from the other boat?",
    "explanation": "The courier moves right 1 m/s relative to a ferry moving right 2 m/s relative to the bank. That is right 3 m/s relative to the bank. The other boat moves left 1 m/s relative to the bank, so courier relative to it is 3 − (−1) = +4 m/s."
  },
  {
    "id": "against-ferry",
    "title": "Walking toward the back",
    "ferryVelocity": 2,
    "courierWalk": -1,
    "otherVelocity": 1,
    "courierStart": 8,
    "request": "The courier walks toward the back. Can leftward walking on the ferry go with rightward motion past the bank?",
    "explanation": "The courier moves left 1 m/s relative to the ferry, while the ferry moves right 2 m/s relative to the bank. Courier relative to bank is still right 1 m/s. The other boat also moves right 1 m/s relative to bank, so its position relative to the courier stays the same."
  },
  {
    "id": "side-by-side",
    "title": "Boats together",
    "ferryVelocity": 2,
    "courierWalk": 0,
    "otherVelocity": 2,
    "courierStart": 2,
    "request": "Both boats travel together. Watch from either boat, then return to the bank view.",
    "explanation": "Both boats move right 2 m/s relative to bank. Their velocity relative to each other is 0 m/s, although their marked origins are not at the same position. The courier is riding without walking."
  },
  {
    "id": "opposite-boats",
    "title": "Passing the other way",
    "ferryVelocity": 1,
    "courierWalk": 0,
    "otherVelocity": -2,
    "courierStart": 2,
    "request": "The boats pass in opposite directions. How quickly does the ferry's position change compared with the other boat?",
    "explanation": "Ferry-bank is +1 m/s and other-boat-bank is −2 m/s. Ferry relative to other boat is 1 − (−2) = +3 m/s. Their relative speed is 3 m/s. The other boat relative to the ferry is −3 m/s, the opposite direction."
  },
  {
    "id": "hold-bank",
    "title": "Walking to keep a place by the bank",
    "ferryVelocity": -1,
    "courierWalk": 1,
    "otherVelocity": 0,
    "courierStart": 2,
    "request": "The ferry moves left while the courier walks right on its deck. Try watching from the bank and the ferry.",
    "explanation": "The ferry’s −1 m/s and the courier’s +1 m/s walking add to 0 m/s relative to bank. The courier still moves right 1 m/s relative to ferry. The bank marker and other boat are at rest relative to one another here; their different origins shift positions without changing relative velocities."
  }
];
export const ferryCopy = {
  "title": "Ferry Deck",
  "reason": "Dot at the Willowbank Post Office has a puzzle. The courier and the people on the bank describe the same ferry crossing differently. Why?",
  "opening": "The same crossing can look different when you compare it with something else. Step the clock, then watch from the ferry or the other boat. What moves compared with you?",
  "notice": "A made-up model: straight, steady motions for six seconds. The boats are in separate lanes. This is not a picture of water currents or a plan for a real crossing.",
  "viewCaption": "Watching from {observer} · clock {clock}. Right is positive. Zero is the marked point you are watching from.",
  "axisCaption": "Position in meters from {observer}. A position tells where something is now; it does not tell which way it is moving.",
  "velocityLegend": "The arrow shows the courier's velocity compared with {observer}, in meters per second. Its length uses a different scale from the position ruler. It is not a trail the courier has already traveled.",
  "position": "Courier: {signed q} m from {observer}.",
  "velocity": "{signed u} m/s compared with {observer}: {right / left / staying at the same position in this view}.",
  "sameMoment": "Same clock moment. We changed what we compare the motion with.",
  "endpoint": "This little model ends at six seconds. That does not mean the boats stop there.",
  "units": "A meter is a unit of length. Meters per second tells how much a position changes in each second, including direction here. Speed is the size of that velocity, without its left/right sign.",
  "visit": "These settings last for this visit. They are not added to your notes.",
  "parent": "Invite a prediction aloud, then step one second or change views. “Still compared with what?” is a useful question. The readings are supplied by the model; this bench does not record, grade or diagnose an explanation. The bank is a convenient reference, not an absolute view. These frames keep the same directions and move steadily; turning or accelerating viewers need more careful models.",
  "table": "The same moment, compared with {observer}. Columns: Thing · Position (m) · Velocity (m/s). Rows Bank marker / Ferry origin / Courier / Other-boat origin. Each velocity cell includes right, left, or no position change relative to this observer. Signed 0 is printed 0, never −0. Name both units above the values; do not require a reader to infer which numbers are positions.",
  "arithmetic": "Courier relative to {observer}: courier relative to bank ({signed vC} m/s) minus {observer} relative to bank ({signed vA} m/s) = {signed uC} m/s. Parenthesize a negative operand. This combines signed velocities, not a rule to subtract unsigned speeds in every situation.",
  "explanation": "Changing views did not change what happens. Each position and velocity is now measured from {observer}. A number to the right of zero can still be moving left in this view."
};
export const ferryFrames = [
  {
    "caseId": "riding",
    "time": 0,
    "frame": "bank",
    "title": "Start with the bank view.",
    "text": "Clock 0 s. Ferry origin −4 m, courier −2 m, other-boat origin +6 m, bank 0 m. The courier sits 2 m along the ferry's deck. Both courier and ferry move right 2 m/s compared with bank."
  },
  {
    "caseId": "riding",
    "time": 1,
    "frame": "bank",
    "title": "Let one second pass.",
    "text": "Same bank view, clock 1 s. Ferry origin −2 m, courier 0 m, other boat +7 m, bank 0 m. Courier and ferry each changed position by +2 m. Being at position 0 m does not mean being at rest."
  },
  {
    "caseId": "riding",
    "time": 1,
    "frame": "ferry",
    "title": "Keep the moment; change the view.",
    "text": "Still clock 1 s, now watch from ferry. Ferry origin 0 m, courier +2 m, other boat +9 m, bank +2 m. Courier-ferry is 0 m/s. The bank is to the right of the origin now but moves left 2 m/s compared with ferry. Position and velocity tell different things."
  },
  {
    "caseId": "riding",
    "time": 2,
    "frame": "ferry",
    "title": "Another second from the ferry.",
    "text": "Clock 2 s, ferry view. Ferry origin 0 m, courier +2 m, other boat +8 m, bank 0 m. Courier stays at the same deck position. Bank moved from +2 m to 0 m, a leftward change of 2 m. This view and the bank view describe the same crossing."
  }
];
export const ferryNames = {
  "bank": "Bank marker",
  "ferry": "Ferry origin",
  "courier": "Courier",
  "other": "Other-boat origin"
};
