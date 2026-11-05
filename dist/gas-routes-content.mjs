// Original schematic routes and independently reviewed finite teaching copy.
export const gasCases=[
  {
    "v": 1,
    "model": "gas-route-v1",
    "id": "oxygen",
    "title": "Oxygen to a body cell",
    "context": "Help the librarian make a guide for the town collection. Follow a gas, then choose words for the kinds of movement along its route.",
    "notice": "A simplified route, not an anatomical map or a timed simulation. The badge represents a gas or its transport, not a blood cell. Arrows show a selected overall pathway; molecules can move both ways. The two routes do not show one gas changing into the other. Your guide labels are choices to discuss, not answers checked by the game.",
    "returnQuestion": "Compare this kept route with a Diffusion Tray run. Which parts involve diffusion, and which need moving air or flowing blood? The tray counts markers in equal spaces. Whole-blood oxygen totals include oxygen bound to hemoglobin, so they do not tell us the gas-exchange direction. Our arrows select an overall pathway; molecules still move both ways.",
    "loopNote": "Blood flows one way around a continuous loop: from the lungs through the left side of the heart to the body, then through the right side back to the lungs. Each route shows part of that loop; the line between blood stops stands for the heart and vessels.",
    "gradientNote": "At the lungs, oxygen's partial pressure is higher in alveolar air than in arriving blood; carbon dioxide's is higher in arriving blood than in alveolar air. At body tissues, oxygen's is higher in arriving blood than in cells; carbon dioxide's is higher in cells than in arriving blood. In a gas mixture, partial pressure is one gas's share of the pressure. For gas dissolved in blood, it is the pressure it would balance with in surrounding gas at equilibrium. Bound oxygen is not free dissolved oxygen. Compare the same gas across a surface, not oxygen with carbon dioxide. No pressures are measured here.",
    "gas": {
      "label": "oxygen",
      "symbol": "circle"
    },
    "world": {
      "width": 1400,
      "height": 500
    },
    "nodes": [
      {
        "id": "outside",
        "label": "Outside air",
        "art": "outside",
        "x": 100,
        "y": 230,
        "description": "Start with oxygen in the air. Air is a mixture, not just oxygen. Breathing moves some of this air toward the lungs."
      },
      {
        "id": "sac",
        "label": "Air sac",
        "art": "sac",
        "x": 375,
        "y": 230,
        "description": "Air reaches tiny air sacs called alveoli through branching airways. Gas exchange happens across the thin air-to-blood surface here."
      },
      {
        "id": "lung",
        "label": "Lung blood",
        "art": "blood",
        "x": 650,
        "y": 230,
        "description": "Oxygen diffuses from alveolar air into nearby capillaries, the tiniest blood vessels. Most oxygen carried by blood attaches to hemoglobin inside red blood cells. Red blood cells stay inside the capillaries."
      },
      {
        "id": "body",
        "label": "Body blood",
        "art": "blood",
        "x": 925,
        "y": 230,
        "description": "Blood travels through the left side of the heart and vessels to capillaries in body tissues. Circulation carries oxygen over distances too large for fast diffusion alone."
      },
      {
        "id": "cell",
        "label": "Body cell",
        "art": "cell",
        "x": 1200,
        "y": 230,
        "description": "Oxygen lets go of hemoglobin, then diffuses from tissue capillaries through surrounding fluid into body cells. Cells use oxygen in aerobic respiration to release energy from food. Breathing and aerobic respiration are different processes."
      }
    ],
    "legs": [
      {
        "id": "leg-1",
        "from": "outside",
        "to": "sac",
        "methodId": "air",
        "text": "Air moves through the airways toward the alveoli."
      },
      {
        "id": "leg-2",
        "from": "sac",
        "to": "lung",
        "methodId": "diffusion",
        "text": "Oxygen crosses the thin surface between alveolar air and blood, then can enter red blood cells."
      },
      {
        "id": "leg-3",
        "from": "lung",
        "to": "body",
        "methodId": "blood",
        "text": "Flowing blood passes through the left heart and vessels to tissue capillaries."
      },
      {
        "id": "leg-4",
        "from": "body",
        "to": "cell",
        "methodId": "diffusion",
        "text": "Oxygen lets go of hemoglobin, then passes through surrounding fluid into cells."
      }
    ],
    "methods": [
      {
        "id": "air",
        "label": "Air moves",
        "description": "Breathing moves a mixture of gases in and out of the lungs. This is also called ventilation."
      },
      {
        "id": "diffusion",
        "label": "Gas crosses a thin surface",
        "description": "Molecules move both ways. A partial-pressure difference for that same gas can give an overall transfer across a thin surface."
      },
      {
        "id": "blood",
        "label": "Blood carries material",
        "description": "The heart pumps blood one way around a continuous loop of connected vessels."
      }
    ],
    "transportNote": "The blue circle is an oxygen symbol. Most oxygen in blood is carried by hemoglobin inside red blood cells; the badge does not show binding or count molecules.",
    "teaching": [
      "First ask what is moving. Breathing moves air; circulation moves blood; diffusion exchanges gas across surfaces.",
      "Our route is an overview. Diffusion still includes motion both ways, and a selected overall arrow is not a rule for every molecule.",
      "Use a method label to explain a link, then compare the route notes if you want. An unexpected label can stay in your guide for discussion.",
      "In aerobic respiration, oxygen helps form water. The carbon in carbon dioxide comes from food molecules. An oxygen molecule does not simply become a carbon dioxide molecule. These routes explain transport, not all the chemical reactions."
    ]
  },
  {
    "v": 1,
    "model": "gas-route-v1",
    "id": "carbon",
    "title": "Carbon dioxide toward the air",
    "context": "Help the librarian make a guide for the town collection. Follow a gas, then choose words for the kinds of movement along its route.",
    "notice": "A simplified route, not an anatomical map or a timed simulation. The badge represents a gas or its transport, not a blood cell. Arrows show a selected overall pathway; molecules can move both ways. The two routes do not show one gas changing into the other. Your guide labels are choices to discuss, not answers checked by the game.",
    "returnQuestion": "Compare this kept route with a Diffusion Tray run. Which parts involve diffusion, and which need moving air or flowing blood? The tray counts markers in equal spaces. Whole-blood oxygen totals include oxygen bound to hemoglobin, so they do not tell us the gas-exchange direction. Our arrows select an overall pathway; molecules still move both ways.",
    "loopNote": "Blood flows one way around a continuous loop: from the lungs through the left side of the heart to the body, then through the right side back to the lungs. Each route shows part of that loop; the line between blood stops stands for the heart and vessels.",
    "gradientNote": "At the lungs, oxygen's partial pressure is higher in alveolar air than in arriving blood; carbon dioxide's is higher in arriving blood than in alveolar air. At body tissues, oxygen's is higher in arriving blood than in cells; carbon dioxide's is higher in cells than in arriving blood. In a gas mixture, partial pressure is one gas's share of the pressure. For gas dissolved in blood, it is the pressure it would balance with in surrounding gas at equilibrium. Bound oxygen is not free dissolved oxygen. Compare the same gas across a surface, not oxygen with carbon dioxide. No pressures are measured here.",
    "gas": {
      "label": "carbon dioxide",
      "symbol": "diamond"
    },
    "world": {
      "width": 1400,
      "height": 500
    },
    "nodes": [
      {
        "id": "cell",
        "label": "Body cell",
        "art": "cell",
        "x": 1200,
        "y": 230,
        "description": "Many body cells produce carbon dioxide during aerobic respiration. This route starts with that different gas; its carbon comes from food molecules, not from an oxygen molecule turning into carbon dioxide."
      },
      {
        "id": "body",
        "label": "Body blood",
        "art": "blood",
        "x": 925,
        "y": 230,
        "description": "Carbon dioxide diffuses from cells through surrounding fluid into capillaries, the tiniest blood vessels in tissues."
      },
      {
        "id": "lung",
        "label": "Lung blood",
        "art": "blood",
        "x": 650,
        "y": 230,
        "description": "Blood returns through the right side of the heart to lung capillaries. Much carbon dioxide travels as bicarbonate, a dissolved form made from it, and is changed back near the lungs."
      },
      {
        "id": "sac",
        "label": "Air sac",
        "art": "sac",
        "x": 375,
        "y": 230,
        "description": "Carbon dioxide diffuses from lung capillary blood into alveolar air. Oxygen can cross the same overall air-to-blood surface the other way, following its own difference."
      },
      {
        "id": "outside",
        "label": "Outside air",
        "art": "outside",
        "x": 100,
        "y": 230,
        "description": "Breathing out moves some air from the alveoli through the airways to the outside. It carries carbon dioxide along with the other gases in that air."
      }
    ],
    "legs": [
      {
        "id": "leg-1",
        "from": "cell",
        "to": "body",
        "methodId": "diffusion",
        "text": "Carbon dioxide spreads from tissues into blood."
      },
      {
        "id": "leg-2",
        "from": "body",
        "to": "lung",
        "methodId": "blood",
        "text": "Blood returns through the right heart and vessels to lung capillaries; carbon dioxide transport includes changed chemical forms."
      },
      {
        "id": "leg-3",
        "from": "lung",
        "to": "sac",
        "methodId": "diffusion",
        "text": "Carbon dioxide crosses from blood into alveolar air."
      },
      {
        "id": "leg-4",
        "from": "sac",
        "to": "outside",
        "methodId": "air",
        "text": "Air moves out through the airways."
      }
    ],
    "methods": [
      {
        "id": "air",
        "label": "Air moves",
        "description": "Breathing moves a mixture of gases in and out of the lungs. This is also called ventilation."
      },
      {
        "id": "diffusion",
        "label": "Gas crosses a thin surface",
        "description": "Molecules move both ways. A partial-pressure difference for that same gas can give an overall transfer across a thin surface."
      },
      {
        "id": "blood",
        "label": "Blood carries material",
        "description": "The heart pumps blood one way around a continuous loop of connected vessels."
      }
    ],
    "transportNote": "The diamond is a carbon dioxide transport symbol. Much is carried as bicarbonate before changing back near the lungs. The badge does not show that chemistry or track one unchanged molecule.",
    "teaching": [
      "First ask what is moving. Breathing moves air; circulation moves blood; diffusion exchanges gas across surfaces.",
      "Our route is an overview. Diffusion still includes motion both ways, and a selected overall arrow is not a rule for every molecule.",
      "Use a method label to explain a link, then compare the route notes if you want. An unexpected label can stay in your guide for discussion.",
      "In aerobic respiration, oxygen helps form water. The carbon in carbon dioxide comes from food molecules. An oxygen molecule does not simply become a carbon dioxide molecule. These routes explain transport, not all the chemical reactions."
    ]
  }
];
export const gasSource=id=>{const source=gasCases.find(s=>s.id===id);return source?structuredClone(source):null;};
