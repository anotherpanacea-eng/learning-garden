// Original, independently reviewed finite Moonlight Bench material (spec406).
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
export const moonlightCopy=freeze({
  "title": "Moonlight Bench",
  "entry": "Why does the Moon’s shape seem to change?",
  "opening": "Dot’s sky notes show different Moon shapes. Explore a model of the sunlight and our view.",
  "model": "A simplified non-eclipse model, not tonight’s sky. Sizes and distances are not to scale.",
  "tilt": "The real Moon’s path is tilted. Most new and full moons do not make an eclipse. This flat model does not simulate eclipses.",
  "places": "Eight possible places for the same Moon, not eight moons at once.",
  "above": "From above Earth’s north side",
  "earthView": "View from Earth",
  "sunlight": "Sunlight comes from the right.",
  "viewLine": "The dashed line shows the viewing direction from Earth, not sunlight or a shadow.",
  "hidden": "The view from Earth is hidden. Imagine the lit part you could see, then show the view.",
  "show": "Show view from Earth",
  "hide": "Hide view from Earth",
  "flip": "Flip Earth view",
  "north": "Northern-style drawing",
  "south": "Southern-style drawing",
  "orientation": "The phase stays the same when we flip the drawing. The real Moon can look tipped in the sky.",
  "previous": "Previous place",
  "next": "Next place",
  "another": "Another invitation",
  "teaching": "Why the shape changes",
  "back": "Back to Sky notes",
  "explore": "Back to my model",
  "hear": "Hear this page",
  "example": "Separate example",
  "selected": "Selected place",
  "visit": "Your model waits while you stay in Sky notes. Leaving Sky notes or changing explorer clears it.",
  "returnPrompt": "When you look at the real sky, record what you actually see in Sky notes. This model does not fill in or correct an observation.",
  "grownup": "This qualitative model explains non-eclipse phases with parallel sunlight and schematic disks. It omits orbital tilt in the drawing, eclipses, Earthshine, exact distances, timing, lunar features and viewing orientation. The northern/southern drawings are simplified styles, not a location. All model choices are visit-local; the observation notebook and its picture setting are unchanged. No attempt, support or learning record is made. A not-seen observation may involve clouds, timing or new Moon; this model cannot tell which.",
  "orbitMotion": "Next place follows the Moon’s direction around Earth in this view. The real change is smooth; these buttons sample eight places.",
  "orbitDescription": "Earth is in the middle. Eight balls mark possible places for one Moon around Earth. Each ball’s right half faces the sunlight. The outlined ball is the place being shown.",
  "previousStep": "Previous step",
  "nextStep": "Next step",
  "grownupLabel": "For grown-ups",
  "stepTemplate": "Step {number} of 4.",
  "placeTemplate": "{label}: {location}."
});
export const moonlightPlaces=freeze([
  {
    "index": 0,
    "code": "new",
    "name": "New Moon",
    "location": "Right side",
    "description": "The lit half faces away from Earth. The Moon is still there, though direct sunlight lights none of this ideal view. In the real sky, a new Moon is very hard to see near the bright Sun.",
    "amount": "None of this ideal view is sunlit."
  },
  {
    "index": 1,
    "code": "thin-growing",
    "name": "Thin and growing (waxing crescent)",
    "location": "Upper right",
    "description": "From Earth we see a thin part of the sunlit half. Waxing means the bright part is growing.",
    "amount": "Less than half of this view is sunlit."
  },
  {
    "index": 2,
    "code": "half-growing",
    "name": "Half and growing (first quarter)",
    "location": "Top",
    "description": "Half of the disk we see is sunlit. First quarter names the place in the phase cycle, not a quarter-lit disk.",
    "amount": "Half of this view is sunlit."
  },
  {
    "index": 3,
    "code": "fat-growing",
    "name": "Nearly full and growing (waxing gibbous)",
    "location": "Upper left",
    "description": "We see more of the lit half than at first quarter, but not a full sunlit disk.",
    "amount": "More than half of this view is sunlit."
  },
  {
    "index": 4,
    "code": "full",
    "name": "Full Moon",
    "location": "Left side",
    "description": "Earth is on the Sun-facing side of the Moon. Outside an eclipse, the disk we see looks fully sunlit.",
    "amount": "All of this ideal view is sunlit."
  },
  {
    "index": 5,
    "code": "fat-shrinking",
    "name": "Nearly full and shrinking (waning gibbous)",
    "location": "Lower left",
    "description": "We still see more than half a sunlit disk, but the bright part is shrinking. Waning means shrinking.",
    "amount": "More than half of this view is sunlit."
  },
  {
    "index": 6,
    "code": "half-shrinking",
    "name": "Half and shrinking (last quarter)",
    "location": "Bottom",
    "description": "Half of the disk we see is sunlit again, now in the shrinking part of the cycle. Last quarter also names a place in the cycle.",
    "amount": "Half of this view is sunlit."
  },
  {
    "index": 7,
    "code": "thin-shrinking",
    "name": "Thin and shrinking (waning crescent)",
    "location": "Lower right",
    "description": "We see a thin part of the sunlit half. It is shrinking toward new Moon.",
    "amount": "Less than half of this view is sunlit."
  }
]);
export const moonlightTeaching=freeze([
  {
    "title": "One half faces the Sun",
    "position": 1,
    "both": false,
    "text": "Earth is our planet. The Sun is a star that gives light. The Moon travels around Earth on a path called its orbit. All three are roughly shaped like balls. Outside eclipses, sunlight lights half the Moon. Moonlight is reflected sunlight."
  },
  {
    "title": "Our view is another half",
    "position": 2,
    "both": false,
    "text": "A phase is the shape of the sunlit part we see. From Earth, we face one half of the Moon. The visible half and the sunlit half can overlap in different amounts as the Moon moves around Earth."
  },
  {
    "title": "A phase is not Earth’s shadow",
    "position": 4,
    "both": false,
    "text": "Ordinary phases come from our view of the sunlit half. During a lunar eclipse, Earth’s shadow does reach the Moon. The real tilted path means that does not happen at every full Moon."
  },
  {
    "title": "Same phase, flipped drawing",
    "position": 1,
    "both": true,
    "text": "Both drawings show the same thin, growing phase. Flipping the picture changes its orientation, not the amount of sunlit Moon we see. Waxing means growing; waning means shrinking."
  }
]);
export const moonlightInvitations=freeze([
  "Find a place where the view from Earth is half lit. Can you find another?",
  "Make a thin shape grow into a full circle. What stays the same in the view from above?",
  "Compare a growing crescent with a shrinking crescent. What changes when you flip the drawing?",
  "Find new Moon, then full Moon. In this flat drawing they line up with Earth and the sunlight. Why don’t real new and full moons make an eclipse every time?"
]);
export function moonlightPlace(index){return Number.isInteger(index)&&index>=0&&index<moonlightPlaces.length?structuredClone(moonlightPlaces[index]):null;}
