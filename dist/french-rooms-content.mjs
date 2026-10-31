// Original French and aligned meanings. Meanings require explicit support request.
export const frenchRoomsLessons = [
  {
    "id": "plan",
    "title": "Lire le plan",
    "intro": "Voici le plan de la maison. Le salon est à gauche de la cuisine. Sur le plan, la chambre est en dessous du salon. Dans le salon, il y a une table et une chaise.",
    "teach": "Une pièce fait partie de la maison. « Dans le salon » indique une pièce. « En dessous du salon » décrit la position sur la page.",
    "meaning": "Here is the house plan. The living room is to the left of the kitchen. On the plan, the bedroom is below the living room. In the living room there is a table and a chair.",
    "teachMeaning": "A room is part of the house. “In the living room” identifies a room. “Below the living room” describes a position on the page.",
    "items": [
      {
        "id": "lit",
        "prompt": "Choisis la pièce où se trouve le lit.",
        "meaning": "Choose the room where the bed is.",
        "choices": [
          {
            "id": "choice-1",
            "text": "le salon",
            "meaning": "the living room",
            "outcome": "different",
            "feedback": "Relis le texte et regarde le plan. Tu peux demander de l’aide."
          },
          {
            "id": "choice-2",
            "text": "la chambre",
            "meaning": "the bedroom",
            "outcome": "match",
            "feedback": "Ce choix correspond au message et au plan."
          },
          {
            "id": "choice-3",
            "text": "la cuisine",
            "meaning": "the kitchen",
            "outcome": "different",
            "feedback": "Relis le texte et regarde le plan. Tu peux demander de l’aide."
          }
        ],
        "guided": "Où est la tasse ? Elle est dans la cuisine.",
        "hint": "Cherche le meuble pour dormir.",
        "example": "La porte est dans l’entrée.",
        "guidedMeaning": "Where is the cup? It is in the kitchen.",
        "hintMeaning": "Look for the piece of furniture for sleeping.",
        "exampleMeaning": "The door is in the entrance hall."
      }
    ],
    "rooms": [
      {
        "id": "salon",
        "name": "le salon",
        "objects": [
          [
            "table",
            "la table"
          ],
          [
            "lampe",
            "la lampe · sur la table"
          ],
          [
            "livre",
            "le livre · sous la table"
          ],
          [
            "chaise",
            "la chaise"
          ]
        ]
      },
      {
        "id": "cuisine",
        "name": "la cuisine",
        "objects": [
          [
            "etagere",
            "l’étagère"
          ],
          [
            "tasse",
            "la tasse · sur l’étagère"
          ],
          [
            "petite-table",
            "la petite table"
          ]
        ]
      },
      {
        "id": "chambre",
        "name": "la chambre",
        "objects": [
          [
            "lit",
            "le lit"
          ],
          [
            "sac",
            "le sac · à côté du lit"
          ]
        ]
      },
      {
        "id": "entree",
        "name": "l’entrée",
        "objects": [
          [
            "porte",
            "la porte"
          ],
          [
            "manteau",
            "le manteau · derrière la porte"
          ]
        ]
      }
    ]
  },
  {
    "id": "positions",
    "title": "Donner une position précise",
    "intro": "La lampe est sur la table du salon. Le livre est sous cette table. Le sac est à côté du lit. Le manteau est derrière la porte.",
    "teach": "Sur la table : la lampe. Sous la table : le livre. À côté du lit : le sac. Derrière la porte : le manteau. Pour le trajet, gauche et au-dessus sont les directions sur la page du plan.",
    "meaning": "The lamp is on the living-room table. The book is under that table. The bag is beside the bed. The coat is behind the door.",
    "teachMeaning": "On the table: the lamp. Under the table: the book. Beside the bed: the bag. Behind the door: the coat. For the route, left and above refer to directions on the plan page.",
    "items": [
      {
        "id": "lampe",
        "prompt": "Dans le salon, choisis l’objet qui est sur la table.",
        "meaning": "In the living room, choose the object that is on the table.",
        "choices": [
          {
            "id": "choice-1",
            "text": "la lampe",
            "meaning": "the lamp",
            "outcome": "match",
            "feedback": "Ce choix correspond au message et au plan."
          },
          {
            "id": "choice-2",
            "text": "le livre",
            "meaning": "the book",
            "outcome": "different",
            "feedback": "Relis le texte et regarde le plan. Tu peux demander de l’aide."
          },
          {
            "id": "choice-3",
            "text": "le sac",
            "meaning": "the bag",
            "outcome": "different",
            "feedback": "Relis le texte et regarde le plan. Tu peux demander de l’aide."
          }
        ],
        "guided": "Entre dans le salon. Cherche sous la table. Tu trouves le livre.",
        "hint": "« Sur » n’est pas « sous » : cherche ce qui est posé sur la table.",
        "example": "La tasse est sur l’étagère, dans la cuisine.",
        "guidedMeaning": "Enter the living room. Look under the table. You find the book.",
        "hintMeaning": "“On” is not “under”: look for what is resting on the table.",
        "exampleMeaning": "The cup is on the shelf, in the kitchen."
      },
      {
        "id": "route",
        "prompt": "Pars de l’entrée. Va dans la pièce à gauche sur le plan, puis dans la pièce juste au-dessus. Où arrives-tu ?",
        "meaning": "Start in the entrance hall. Go into the room to the left on the plan, then the room just above. Where do you arrive?",
        "choices": [
          {
            "id": "choice-1",
            "text": "la cuisine",
            "meaning": "the kitchen",
            "outcome": "different",
            "feedback": "Relis le texte et regarde le plan. Tu peux demander de l’aide."
          },
          {
            "id": "choice-2",
            "text": "la chambre",
            "meaning": "the bedroom",
            "outcome": "different",
            "feedback": "Relis le texte et regarde le plan. Tu peux demander de l’aide."
          },
          {
            "id": "choice-3",
            "text": "le salon",
            "meaning": "the living room",
            "outcome": "match",
            "feedback": "Ce choix correspond au message et au plan."
          }
        ],
        "guided": "Sur le plan : entrée → chambre → salon.",
        "hint": "Suis une direction à la fois sur la page.",
        "example": "Autre trajet : cuisine → salon → chambre.",
        "guidedMeaning": "On the plan: entrance hall → bedroom → living room.",
        "hintMeaning": "Follow one direction at a time on the page.",
        "exampleMeaning": "Another route: kitchen → living room → bedroom."
      }
    ],
    "rooms": [
      {
        "id": "salon",
        "name": "le salon",
        "objects": [
          [
            "table",
            "la table"
          ],
          [
            "lampe",
            "la lampe · sur la table"
          ],
          [
            "livre",
            "le livre · sous la table"
          ],
          [
            "chaise",
            "la chaise"
          ]
        ]
      },
      {
        "id": "cuisine",
        "name": "la cuisine",
        "objects": [
          [
            "etagere",
            "l’étagère"
          ],
          [
            "tasse",
            "la tasse · sur l’étagère"
          ],
          [
            "petite-table",
            "la petite table"
          ]
        ]
      },
      {
        "id": "chambre",
        "name": "la chambre",
        "objects": [
          [
            "lit",
            "le lit"
          ],
          [
            "sac",
            "le sac · à côté du lit"
          ]
        ]
      },
      {
        "id": "entree",
        "name": "l’entrée",
        "objects": [
          [
            "porte",
            "la porte"
          ],
          [
            "manteau",
            "le manteau · derrière la porte"
          ]
        ]
      }
    ]
  },
  {
    "id": "clarify",
    "title": "Demander une précision",
    "intro": "Un message dit : « Pose le carnet sur la table. » Mais il y a deux tables : une dans le salon et une dans la cuisine. Tu peux demander une précision avant de choisir.",
    "teach": "Une instruction peut manquer de précision. Demander « quelle table ? » aide à trouver le bon endroit.",
    "meaning": "A message says: “Put the notebook on the table.” But there are two tables: one in the living room and one in the kitchen. You can ask for clarification before choosing.",
    "teachMeaning": "An instruction can lack precision. Asking “which table?” helps find the right place.",
    "items": [
      {
        "id": "question",
        "prompt": "Choisis la question utile pour préciser le lieu.",
        "meaning": "Choose the useful question to clarify the place.",
        "choices": [
          {
            "id": "choice-1",
            "text": "De quelle couleur est le carnet ?",
            "meaning": "What color is the notebook?",
            "outcome": "different",
            "feedback": "La couleur ne précise pas quelle table utiliser."
          },
          {
            "id": "choice-2",
            "text": "Quelle table : celle du salon ou celle de la cuisine ?",
            "meaning": "Which table: the one in the living room or the one in the kitchen?",
            "outcome": "match",
            "feedback": "Cette question distingue les deux tables par leur pièce."
          },
          {
            "id": "choice-3",
            "text": "À quelle heure faut-il poser le carnet ?",
            "meaning": "At what time should the notebook be put down?",
            "outcome": "different",
            "feedback": "L’heure ne précise pas quelle table utiliser."
          }
        ],
        "guided": "Un message dit : « Pose le sac sur le lit. » S’il y a deux chambres, tu demandes : « Dans quelle chambre ? »",
        "hint": "Il faut préciser la pièce, pas la couleur.",
        "example": "Près de quelle porte ?",
        "guidedMeaning": "A message says: “Put the bag on the bed.” If there are two bedrooms, you ask: “In which bedroom?”",
        "hintMeaning": "You need to specify the room, rather than the color.",
        "exampleMeaning": "Near which door?"
      },
      {
        "id": "place",
        "prompt": "Après la précision, où faut-il poser le carnet ?",
        "meaning": "After the clarification, where should the notebook be put?",
        "choices": [
          {
            "id": "choice-1",
            "text": "la table du salon",
            "meaning": "the living-room table",
            "outcome": "match",
            "feedback": "Ce choix correspond au message et au plan."
          },
          {
            "id": "choice-2",
            "text": "la petite table de la cuisine",
            "meaning": "the small kitchen table",
            "outcome": "different",
            "feedback": "Relis le texte et regarde le plan. Tu peux demander de l’aide."
          },
          {
            "id": "choice-3",
            "text": "le lit de la chambre",
            "meaning": "the bedroom bed",
            "outcome": "different",
            "feedback": "Relis le texte et regarde le plan. Tu peux demander de l’aide."
          }
        ],
        "guided": "La réponse précise une table et une pièce.",
        "hint": "Lis la précision : quelle pièce est nommée ?",
        "example": "Autre précision : sur la petite table de la cuisine.",
        "guidedMeaning": "The reply specifies a table and a room.",
        "hintMeaning": "Read the clarification: which room is named?",
        "exampleMeaning": "Another clarification: on the small kitchen table."
      }
    ],
    "rooms": [
      {
        "id": "salon",
        "name": "le salon",
        "objects": [
          [
            "table",
            "la table"
          ],
          [
            "lampe",
            "la lampe · sur la table"
          ],
          [
            "livre",
            "le livre · sous la table"
          ],
          [
            "chaise",
            "la chaise"
          ]
        ]
      },
      {
        "id": "cuisine",
        "name": "la cuisine",
        "objects": [
          [
            "etagere",
            "l’étagère"
          ],
          [
            "tasse",
            "la tasse · sur l’étagère"
          ],
          [
            "petite-table",
            "la petite table"
          ]
        ]
      },
      {
        "id": "chambre",
        "name": "la chambre",
        "objects": [
          [
            "lit",
            "le lit"
          ],
          [
            "sac",
            "le sac · à côté du lit"
          ]
        ]
      },
      {
        "id": "entree",
        "name": "l’entrée",
        "objects": [
          [
            "porte",
            "la porte"
          ],
          [
            "manteau",
            "le manteau · derrière la porte"
          ]
        ]
      }
    ],
    "newMessage": "Sur la table du salon, à côté de la lampe.",
    "newMeaning": "On the living-room table, beside the lamp."
  },
  {
    "id": "return",
    "title": "Un retour et un projet",
    "intro": "Je viens de rentrer. Je viens de poser le carnet sur la table du salon. Je vais chercher le sac dans la chambre. Ensuite, je vais revenir dans le salon.",
    "teach": "« Je viens de rentrer » indique une action très récente. « Je vais chercher » indique une action à venir. Devant une voyelle, « de » devient « d’ » : « Je viens d’arriver. »",
    "meaning": "I have just come home. I have just put the notebook on the living-room table. I am going to get the bag in the bedroom. Then I am going to return to the living room.",
    "teachMeaning": "“I have just come home” describes a very recent action. “I am going to get” describes a coming action. Before a vowel, “de” becomes “d’”: “Je viens d’arriver” means I have just arrived.",
    "items": [
      {
        "id": "plan",
        "prompt": "Quelle action est prévue ?",
        "meaning": "Which action is planned?",
        "choices": [
          {
            "id": "choice-1",
            "text": "rentrer",
            "meaning": "to come home",
            "outcome": "different",
            "feedback": "Relis le texte et regarde le plan. Tu peux demander de l’aide."
          },
          {
            "id": "choice-2",
            "text": "poser le carnet",
            "meaning": "to put down the notebook",
            "outcome": "different",
            "feedback": "Relis le texte et regarde le plan. Tu peux demander de l’aide."
          },
          {
            "id": "choice-3",
            "text": "chercher le sac",
            "meaning": "to get the bag",
            "outcome": "match",
            "feedback": "Ce choix correspond au message et au plan."
          }
        ],
        "guided": "Je viens de rentrer : juste avant maintenant. Je vais chercher : un projet.",
        "hint": "Cherche les mots « je vais ».",
        "example": "Je viens de lire le message. Je vais répondre.",
        "guidedMeaning": "I have just come home: just before now. I am going to get something: a plan.",
        "hintMeaning": "Look for the words “je vais”.",
        "exampleMeaning": "I have just read the message. I am going to reply."
      },
      {
        "id": "new-place",
        "prompt": "Où vas-tu chercher le sac maintenant ?",
        "meaning": "Where are you going to look for the bag now?",
        "choices": [
          {
            "id": "choice-1",
            "text": "dans l’entrée",
            "meaning": "in the entrance hall",
            "outcome": "match",
            "feedback": "Ce choix correspond au message et au plan."
          },
          {
            "id": "choice-2",
            "text": "dans la chambre",
            "meaning": "in the bedroom",
            "outcome": "different",
            "feedback": "Relis le texte et regarde le plan. Tu peux demander de l’aide."
          },
          {
            "id": "choice-3",
            "text": "dans la cuisine",
            "meaning": "in the kitchen",
            "outcome": "different",
            "feedback": "Relis le texte et regarde le plan. Tu peux demander de l’aide."
          }
        ],
        "guided": "Le nouveau message change le lieu du sac.",
        "hint": "Lis le nouveau message, pas seulement le premier.",
        "example": "Si le livre est déplacé dans la cuisine, cherche-le dans la cuisine.",
        "guidedMeaning": "The new message changes the bag’s location.",
        "hintMeaning": "Read the new message, rather than only the first one.",
        "exampleMeaning": "If the book is moved to the kitchen, look for it in the kitchen."
      }
    ],
    "rooms": [
      {
        "id": "salon",
        "name": "le salon",
        "objects": [
          [
            "table",
            "la table"
          ],
          [
            "lampe",
            "la lampe · sur la table"
          ],
          [
            "livre",
            "le livre · sous la table"
          ],
          [
            "chaise",
            "la chaise"
          ]
        ]
      },
      {
        "id": "cuisine",
        "name": "la cuisine",
        "objects": [
          [
            "etagere",
            "l’étagère"
          ],
          [
            "tasse",
            "la tasse · sur l’étagère"
          ],
          [
            "petite-table",
            "la petite table"
          ]
        ]
      },
      {
        "id": "chambre",
        "name": "la chambre",
        "objects": [
          [
            "lit",
            "le lit"
          ],
          [
            "sac",
            "le sac · à côté du lit"
          ]
        ]
      },
      {
        "id": "entree",
        "name": "l’entrée",
        "objects": [
          [
            "porte",
            "la porte"
          ],
          [
            "manteau",
            "le manteau · derrière la porte"
          ]
        ]
      }
    ],
    "newMessage": "Le sac n’est plus à côté du lit. Je viens de le mettre dans l’entrée, derrière la porte.",
    "newMeaning": "The bag is no longer beside the bed. I have just put it in the entrance hall, behind the door.",
    "writing": "Écris un court message : une action récente et un projet. Tes mots sont lus par une personne, sans note automatique."
  }
];
