// Original finite teaching content; authored in docs/content/408-leaf-kitchen-text.md.
export const leafKitchenCopy = {
  "title": "Leaf Kitchen",
  "entry": "Explore how a green leaf makes food",
  "back": "Back to Living Layers",
  "story": "The town collection needs a clear picture of how a green leaf makes food. Build an explanation for the next visitor.",
  "notice": "A simplified teaching model of photosynthesis in a rooted green plant. Cards name kinds of things, not molecule counts or measured amounts. This is not an experiment or a growth forecast.",
  "build": "Arrange the cards",
  "buildInstruction": "Choose a card, then choose its place. You can move it again or return it to the tray. Unfinished and unexpected arrangements are welcome to compare.",
  "yourIdea": "Your arrangement",
  "yourNotice": "These are your current placements, not a checked scientific explanation.",
  "selected": "Selected card",
  "noneSelected": "Choose a card first.",
  "unplaced": "Still in the tray",
  "remove": "Return selected card to the tray",
  "compare": "Compare explanations",
  "compareInstruction": "Keep your arrangement beside a simplified reference. Your cards stay where you put them.",
  "showReference": "Show the reference",
  "reference": "Scientific reference",
  "referenceHidden": "The reference is not shown yet.",
  "referenceNotice": "This reference shows the overall roles in photosynthesis, not its many chemical steps. The plant also uses food and exchanges gases through other processes.",
  "wordEquation": "Carbon dioxide plus water, using light energy, gives glucose and oxygen.",
  "wordEquationNote": "Glucose is one kind of sugar. Light supplies energy; chlorophyll helps capture it inside chloroplasts. Minerals are needed for plant growth and working parts, but are not a raw material in this basic word equation.",
  "learn": "See how it works",
  "learnInstruction": "Turn one teaching picture at a time. These examples explain the reference; they do not change your arrangement.",
  "previousStep": "Previous picture",
  "nextStep": "Next picture",
  "questions": "Try a question",
  "questionsInstruction": "Use the model and any help you want. Each question is a chance to explain a contrast, not a grade.",
  "nextQuestion": "Another question",
  "tryAgain": "Choose another idea",
  "fits": "This fits the explanation.",
  "different": "Let’s compare that idea.",
  "edit": "Change my arrangement",
  "hear": "Hear this page",
  "returnTitle": "Return to the seedlings",
  "returnText": "The invented seedling pictures show pictured stem lengths and other features. They supply no sugar measurement. What else would an investigation need?",
  "returnLink": "Leave for the growing shelf",
  "grownupTitle": "For grown-ups: what this model can show",
  "grownup": "This is a qualitative role model, not a molecular mechanism, gas-exchange balance, rate model or practical test. Card placement and question choices stay in this room visit and create no learning record. The existing Living Layers guide and its saved versions are unchanged. General plant knowledge is separate from invented pictured stem lengths or measurements from a real investigation.",
  "visitNote": "This arrangement waits while you explore this model. Leaving the room or reloading starts a fresh model visit.",
  "materialArrow": "Materials used in photosynthesis",
  "energyArrow": "Light energy into the process",
  "foodArrow": "Food made in the plant",
  "gasArrow": "Oxygen released by this process",
  "mineralsArrow": "Other mineral needs, taken up by roots",
  "leafLabel": "A green leaf",
  "rootsLabel": "Roots",
  "airLabel": "Air",
  "diagramCaption": "A diagram of roles, not a view inside a leaf. Solid paths show substances; the separate dashed ray shows light energy. Line widths and card sizes do not show quantities.",
  "newArrangement": "Start a new empty arrangement",
  "nextTitle": "Go on to molecule counts",
  "nextText": "A Leaf’s Two Accounts lets you build molecule summaries and check atom counts. It offers a more detailed representation of these ideas. In Body Clues, choose A leaf’s two accounts.",
  "nextLink": "Leave for Body Clues",
  "leaveTitle": "Leave this room",
  "leaveWarning": "Leaving clears this model and any Living Layers guide you have not kept. To keep working on that guide, use Back to Living Layers first.",
  "emptyRole": "No cards here yet",
  "parentLeaveWarning": "Leaving, reloading, importing or changing explorer clears guides you have not kept."
};

export const leafKitchenCards = [
  {
    "id": "carbon-dioxide",
    "label": "Carbon dioxide",
    "icon": "gas"
  },
  {
    "id": "water",
    "label": "Water",
    "icon": "drop"
  },
  {
    "id": "light",
    "label": "Light",
    "icon": "sun"
  },
  {
    "id": "minerals",
    "label": "Mineral nutrients",
    "icon": "dissolved"
  },
  {
    "id": "glucose",
    "label": "Glucose · a sugar",
    "icon": "sugar"
  },
  {
    "id": "oxygen",
    "label": "Oxygen",
    "icon": "gas"
  }
];

export const leafKitchenRoles = [
  {
    "id": "materials",
    "label": "Materials used to make food"
  },
  {
    "id": "energy",
    "label": "Energy source"
  },
  {
    "id": "nutrients",
    "label": "Other mineral needs"
  },
  {
    "id": "food",
    "label": "Food made"
  },
  {
    "id": "gas",
    "label": "Gas released by photosynthesis"
  }
];

export const leafKitchenReference = {
  "carbon-dioxide": "materials",
  "water": "materials",
  "light": "energy",
  "minerals": "nutrients",
  "glucose": "food",
  "oxygen": "gas"
};

export const leafKitchenTeaching = [
  {
    "id": "materials",
    "title": "Air and roots bring materials",
    "text": "For photosynthesis, this green leaf uses carbon dioxide from the air and water taken up through the roots. Soil is not a ready-made meal for the plant. Roots also take up dissolved mineral nutrients, which have other essential jobs.",
    "picture": "materials",
    "caption": "The carbon dioxide path starts in air. The water path starts at roots. Minerals have a separate role, though they travel dissolved in water."
  },
  {
    "id": "energy",
    "title": "Light supplies energy",
    "text": "Chlorophyll is a light-absorbing pigment inside chloroplasts. It helps capture light energy for photosynthesis. Light is not a material such as water and is not the sugar the plant makes. Many cells in green leaves, such as mesophyll cells, have chloroplasts; animal cells do not. Many plant cells, such as the nongreen root cells in our example, also lack chloroplasts.",
    "picture": "energy",
    "caption": "A dashed ray represents energy from light, separately from the material paths."
  },
  {
    "id": "food",
    "title": "Sugars are made",
    "text": "Using light energy, photosynthesis makes carbohydrates from carbon dioxide and water. Plants can form glucose, a sugar, from this process. Sugars provide material for growth and store chemical energy. The word equation summarizes the overall change; a leaf carries out many chemical steps.",
    "picture": "food",
    "caption": "The sugar is made in the plant. It is not a meal drawn from soil."
  },
  {
    "id": "oxygen",
    "title": "Oxygen is a product",
    "text": "Photosynthesis releases oxygen. This is a role in the selected process, not every gas movement of the whole plant. Living plant cells also use oxygen in aerobic respiration, which releases energy from food. A plant does not only make food or only use it.",
    "picture": "gas",
    "caption": "The oxygen path points out for photosynthesis. It is not a diagram of all gas exchange."
  },
  {
    "id": "night",
    "title": "A plant still uses food at night",
    "text": "Without light, a plant cannot keep making food by photosynthesis. Its living cells can still release energy from stored food. Respiration happens in light as well as darkness; it is not a night-only replacement for photosynthesis. Roots also need energy, although they do not make food by photosynthesis in our pictured plant. The pictured roots use sugars made in green parts and carried through the plant.",
    "picture": "night",
    "caption": "In the dark picture there is no light-energy ray. Stored food and living-cell activity remain; the plant has not switched off. This picture does not show the gas exchanges of respiration."
  }
];

export const leafKitchenInvitations = [
  {
    "id": "air-material",
    "prompt": "In our pictured rooted plant, which material comes from the air for photosynthesis?",
    "choices": [
      {
        "id": "choice-1",
        "label": "Carbon dioxide, taken in from the air.",
        "outcome": "fits",
        "feedback": "Carbon dioxide supplies carbon for making sugars. In this example water and mineral nutrients enter through the roots."
      },
      {
        "id": "choice-2",
        "label": "Oxygen, taken in from the air.",
        "outcome": "different",
        "feedback": "Living cells use oxygen in aerobic respiration. Photosynthesis releases oxygen; the material it uses from the air is carbon dioxide."
      },
      {
        "id": "choice-3",
        "label": "Glucose, collected ready-made from the air.",
        "outcome": "different",
        "feedback": "Glucose is a sugar the plant can make. The carbon-containing material coming from the air is carbon dioxide."
      }
    ]
  },
  {
    "id": "light-role",
    "prompt": "What role does light have in this green-leaf process?",
    "choices": [
      {
        "id": "choice-1",
        "label": "Light is a soil mineral that is taken up with water through roots.",
        "outcome": "different",
        "feedback": "Roots take up water and dissolved mineral nutrients. Water is a raw material in this photosynthesis word equation; minerals have other jobs. Light reaches green parts as energy."
      },
      {
        "id": "choice-2",
        "label": "Light supplies energy; water and carbon dioxide supply materials.",
        "outcome": "fits",
        "feedback": "The separate dashed ray shows energy. The material paths name water and carbon dioxide used in photosynthesis."
      },
      {
        "id": "choice-3",
        "label": "Light is the sugar made in the leaf and sent to the roots as food.",
        "outcome": "different",
        "feedback": "Glucose is a sugar; light supplies energy for making carbohydrates. The names describe different roles."
      }
    ]
  },
  {
    "id": "night",
    "prompt": "What can a living plant do when its leaf is in darkness?",
    "choices": [
      {
        "id": "choice-1",
        "label": "It starts respiring, a process that living plants do only at night.",
        "outcome": "different",
        "feedback": "Respiration happens in light and in darkness. In the dark the plant keeps respiring but cannot keep photosynthesizing."
      },
      {
        "id": "choice-2",
        "label": "Every process in the whole living plant stops until light returns again.",
        "outcome": "different",
        "feedback": "Living cells still need energy and can release it from stored food. Darkness is not a switch that stops every process."
      },
      {
        "id": "choice-3",
        "label": "It can use stored food, although it cannot keep photosynthesizing without light.",
        "outcome": "fits",
        "feedback": "Food-making by photosynthesis needs light energy. Respiration releases energy from food in light and darkness."
      }
    ]
  },
  {
    "id": "measurement",
    "prompt": "In the invented seedling pictures, does a longer stem show which plant made more sugar?",
    "choices": [
      {
        "id": "choice-1",
        "label": "Yes. The longer pictured stem shows that plant made more sugar.",
        "outcome": "different",
        "feedback": "Stem length and sugar production are different quantities. Our invented seedling pictures supply no sugar measurement."
      },
      {
        "id": "choice-2",
        "label": "No. Pictured stem length does not measure how much sugar the plant made.",
        "outcome": "fits",
        "feedback": "A general explanation of photosynthesis does not turn stem length into a sugar measurement. Another investigation would need suitable evidence."
      },
      {
        "id": "choice-3",
        "label": "No. Because it is a model, it cannot explain anything about food-making.",
        "outcome": "different",
        "feedback": "That withholds more than needed. A simplified model can explain roles without measuring a particular plant’s sugar production."
      }
    ]
  }
];
