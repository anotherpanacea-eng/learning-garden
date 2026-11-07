// Original finite relative-clause packet reviewed under spec424. No runtime language parsing.
const freeze=value=>{if(value&&typeof value==='object'){for(const item of Object.values(value))freeze(item);Object.freeze(value);}return value;};
export const groupCopy=freeze({
  "label": "Which Ones?",
  "tab": "Groups and commas",
  "opening": "Which people or things do these words include? Try the detail with and without its commas.",
  "messagePage": "Build message",
  "meaningPage": "See meaning",
  "scene": "Scene",
  "facts": "Scene facts",
  "sentence": "Message we are trying",
  "detail": "Detail to add",
  "sceneNotice": "The picture stays the same when the words change.",
  "attach": "Add the detail",
  "addCommas": "Add both commas",
  "removeCommas": "Remove both commas",
  "remove": "Remove the detail",
  "undo": "Undo wording change",
  "needDetail": "Add the detail first.",
  "noUndo": "No wording change to undo.",
  "markPrompt": "Mark the people or things this main statement explicitly includes.",
  "yourMarks": "Your marks",
  "messageIncludes": "Message includes",
  "noneMarked": "None marked",
  "check": "Check my group",
  "reveal": "See meaning",
  "changeMarks": "Change my marks",
  "matched": "Your marks match this message.",
  "compare": "Compare your marks with the message’s group.",
  "teaching": "Try a lantern example",
  "previousTeaching": "Previous card",
  "nextTeaching": "Next card",
  "backToMessage": "Back to my message",
  "teachingCount": "Lantern example {n} of 5",
  "teachingIntro": "These are the three lanterns in this example.",
  "hear": "Hear this page",
  "talkLabel": "Try it with someone",
  "talk": "Say or write a new message for someone with you. Ask which people or things they thought it included.",
  "grownupLabel": "For grown-ups",
  "exit": "Return to Story Loft",
  "visit": "Your trials wait while you switch between the Sentence Bridges modes. Leaving this room, changing explorer or reloading starts fresh. Nothing here is added to Notes.",
  "hint": "Read the noun group first. Is the detail identifying which ones, or adding information about an already identified group?",
  "sceneAnnouncement": "{title}. Your message and marks are here.",
  "wordingAnnouncement": "Message changed. Your marks are kept. Check the group when you’re ready.",
  "markedAnnouncement": "{label} marked.",
  "unmarkedAnnouncement": "{label} unmarked.",
  "checkAnnouncement": "Your marks are compared with this message.",
  "revealAnnouncement": "Meaning opened. Your marks are unchanged.",
  "teachingAnnouncement": "Lantern example {n} of 5.",
  "returnAnnouncement": "Your waiting message is here.",
  "editAnnouncement": "Your message is ready for editing. Your marks are kept.",
  "grownup": "This is a finite model of reference and comma meaning in prepared sentences. The pictured three establish our local noun group; real language can depend on a wider context. Identifying clauses do not assert that everyone else fails the main statement. Both “that” and “which” can introduce identifying details about things; some US style guides prefer “that”. We keep “which” in the object contrasts so the commas change while the relative word stays the same. This is not a grammar parser, original-writing grader or reading-level assessment. No work from this mode is saved or sent anywhere."
});
export const groupScenes=freeze([
  {
    "id": "couriers-mixed",
    "title": "Couriers with mixed bags",
    "story": "The librarian is preparing a route-card message. Decide which couriers its words include.",
    "noun": "The couriers",
    "clause": "who have blue bags",
    "predicate": "will get route cards.",
    "singular": "courier",
    "plural": "couriers",
    "members": [
      {
        "id": "a",
        "label": "Courier A",
        "kind": "courier",
        "feature": {
          "id": "blue-bag",
          "text": "blue bag",
          "color": "blue",
          "icon": "bag"
        }
      },
      {
        "id": "b",
        "label": "Courier B",
        "kind": "courier",
        "feature": {
          "id": "gold-bag",
          "text": "gold bag",
          "color": "gold",
          "icon": "bag"
        }
      },
      {
        "id": "c",
        "label": "Courier C",
        "kind": "courier",
        "feature": {
          "id": "blue-bag",
          "text": "blue bag",
          "color": "blue",
          "icon": "bag"
        }
      }
    ],
    "targetFeature": "blue-bag",
    "matches": [
      "a",
      "c"
    ],
    "factsIntro": "These are the three couriers in this made-up scene.",
    "facts": [
      "Courier A has a blue bag.",
      "Courier B has a gold bag.",
      "Courier C has a blue bag."
    ],
    "forms": {
      "identify": {
        "sentence": "The couriers who have blue bags will get route cards.",
        "reference": [
          "a",
          "c"
        ],
        "status": "fits",
        "explanation": "The detail identifies Courier A and Courier C. This message says they will get route cards. It does not say that Courier B will not get route cards."
      },
      "extra": {
        "sentence": "The couriers, who have blue bags, will get route cards.",
        "reference": [
          "a",
          "b",
          "c"
        ],
        "status": "conflicts",
        "explanation": "Here the noun group is all three couriers. This message says they will get route cards. With the commas, the detail adds that all three have blue bags. That detail does not fit Courier B’s gold bag. The sentence is grammatical, but its extra detail disagrees with our scene."
      },
      "plain": {
        "sentence": "The couriers will get route cards.",
        "reference": [
          "a",
          "b",
          "c"
        ],
        "status": "omitted",
        "explanation": "Here the noun group is all three couriers. This message says they will get route cards. It says nothing about their bags. The picture still shows the same bags."
      }
    }
  },
  {
    "id": "couriers-all",
    "title": "Couriers with blue bags",
    "story": "The librarian is preparing a route-card message. Everyone here has a blue bag. Compare what the versions say.",
    "noun": "The couriers",
    "clause": "who have blue bags",
    "predicate": "will get route cards.",
    "singular": "courier",
    "plural": "couriers",
    "members": [
      {
        "id": "a",
        "label": "Courier A",
        "kind": "courier",
        "feature": {
          "id": "blue-bag",
          "text": "blue bag",
          "color": "blue",
          "icon": "bag"
        }
      },
      {
        "id": "b",
        "label": "Courier B",
        "kind": "courier",
        "feature": {
          "id": "blue-bag",
          "text": "blue bag",
          "color": "blue",
          "icon": "bag"
        }
      },
      {
        "id": "c",
        "label": "Courier C",
        "kind": "courier",
        "feature": {
          "id": "blue-bag",
          "text": "blue bag",
          "color": "blue",
          "icon": "bag"
        }
      }
    ],
    "targetFeature": "blue-bag",
    "matches": [
      "a",
      "b",
      "c"
    ],
    "factsIntro": "These are the three couriers in this made-up scene.",
    "facts": [
      "Courier A has a blue bag.",
      "Courier B has a blue bag.",
      "Courier C has a blue bag."
    ],
    "forms": {
      "identify": {
        "sentence": "The couriers who have blue bags will get route cards.",
        "reference": [
          "a",
          "b",
          "c"
        ],
        "status": "fits",
        "explanation": "All three couriers here have blue bags, so this identifying detail includes Courier A, Courier B, and Courier C. This message says they will get route cards. Both versions, with and without commas, include all three here: one identifies the group by its feature; the other adds information about the group already identified."
      },
      "extra": {
        "sentence": "The couriers, who have blue bags, will get route cards.",
        "reference": [
          "a",
          "b",
          "c"
        ],
        "status": "fits",
        "explanation": "Here the noun group is all three couriers. This message says they will get route cards and adds that they all have blue bags. That detail fits our scene. Both versions, with and without commas, include all three here, but the detail has a different job in each."
      },
      "plain": {
        "sentence": "The couriers will get route cards.",
        "reference": [
          "a",
          "b",
          "c"
        ],
        "status": "omitted",
        "explanation": "Here the noun group is all three couriers. This message says they will get route cards. It says nothing about their bags. The picture still shows the same bags."
      }
    }
  },
  {
    "id": "parcels-mixed",
    "title": "Parcels with mixed labels",
    "story": "The librarian is preparing a cart-loading message. Decide which parcels its words include.",
    "noun": "The parcels",
    "clause": "which have star labels",
    "predicate": "will go on the cart.",
    "singular": "parcel",
    "plural": "parcels",
    "members": [
      {
        "id": "a",
        "label": "Parcel A",
        "kind": "parcel",
        "feature": {
          "id": "plain-label",
          "text": "plain label",
          "color": "neutral",
          "icon": "plain"
        }
      },
      {
        "id": "b",
        "label": "Parcel B",
        "kind": "parcel",
        "feature": {
          "id": "star-label",
          "text": "star label",
          "color": "neutral",
          "icon": "star"
        }
      },
      {
        "id": "c",
        "label": "Parcel C",
        "kind": "parcel",
        "feature": {
          "id": "star-label",
          "text": "star label",
          "color": "neutral",
          "icon": "star"
        }
      }
    ],
    "targetFeature": "star-label",
    "matches": [
      "b",
      "c"
    ],
    "factsIntro": "These are the three parcels in this made-up scene.",
    "facts": [
      "Parcel A has a plain label.",
      "Parcel B has a star label.",
      "Parcel C has a star label."
    ],
    "forms": {
      "identify": {
        "sentence": "The parcels which have star labels will go on the cart.",
        "reference": [
          "b",
          "c"
        ],
        "status": "fits",
        "explanation": "The detail identifies Parcel B and Parcel C. This message says they will go on the cart. It does not say that Parcel A will not go on the cart."
      },
      "extra": {
        "sentence": "The parcels, which have star labels, will go on the cart.",
        "reference": [
          "a",
          "b",
          "c"
        ],
        "status": "conflicts",
        "explanation": "Here the noun group is all three parcels. This message says they will go on the cart. With the commas, the detail adds that all three have star labels. That detail does not fit Parcel A’s plain label. The sentence is grammatical, but its extra detail disagrees with our scene."
      },
      "plain": {
        "sentence": "The parcels will go on the cart.",
        "reference": [
          "a",
          "b",
          "c"
        ],
        "status": "omitted",
        "explanation": "Here the noun group is all three parcels. This message says they will go on the cart. It says nothing about their labels. The picture still shows the same labels."
      }
    }
  },
  {
    "id": "parcels-all",
    "title": "Parcels with star labels",
    "story": "The librarian is preparing a cart-loading message. Every parcel here has a star label. Compare what the versions say.",
    "noun": "The parcels",
    "clause": "which have star labels",
    "predicate": "will go on the cart.",
    "singular": "parcel",
    "plural": "parcels",
    "members": [
      {
        "id": "a",
        "label": "Parcel A",
        "kind": "parcel",
        "feature": {
          "id": "star-label",
          "text": "star label",
          "color": "neutral",
          "icon": "star"
        }
      },
      {
        "id": "b",
        "label": "Parcel B",
        "kind": "parcel",
        "feature": {
          "id": "star-label",
          "text": "star label",
          "color": "neutral",
          "icon": "star"
        }
      },
      {
        "id": "c",
        "label": "Parcel C",
        "kind": "parcel",
        "feature": {
          "id": "star-label",
          "text": "star label",
          "color": "neutral",
          "icon": "star"
        }
      }
    ],
    "targetFeature": "star-label",
    "matches": [
      "a",
      "b",
      "c"
    ],
    "factsIntro": "These are the three parcels in this made-up scene.",
    "facts": [
      "Parcel A has a star label.",
      "Parcel B has a star label.",
      "Parcel C has a star label."
    ],
    "forms": {
      "identify": {
        "sentence": "The parcels which have star labels will go on the cart.",
        "reference": [
          "a",
          "b",
          "c"
        ],
        "status": "fits",
        "explanation": "All three parcels here have star labels, so this identifying detail includes Parcel A, Parcel B, and Parcel C. This message says they will go on the cart. Both versions, with and without commas, include all three here: one identifies the group by its feature; the other adds information about the group already identified."
      },
      "extra": {
        "sentence": "The parcels, which have star labels, will go on the cart.",
        "reference": [
          "a",
          "b",
          "c"
        ],
        "status": "fits",
        "explanation": "Here the noun group is all three parcels. This message says they will go on the cart and adds that they all have star labels. That detail fits our scene. Both versions, with and without commas, include all three here, but the detail has a different job in each."
      },
      "plain": {
        "sentence": "The parcels will go on the cart.",
        "reference": [
          "a",
          "b",
          "c"
        ],
        "status": "omitted",
        "explanation": "Here the noun group is all three parcels. This message says they will go on the cart. It says nothing about their labels. The picture still shows the same labels."
      }
    }
  },
  {
    "id": "books-mixed",
    "title": "Books with mixed covers",
    "story": "The librarian is preparing a display-table message. Decide which books its words include.",
    "noun": "The books",
    "clause": "which have red covers",
    "predicate": "will go on the display table.",
    "singular": "book",
    "plural": "books",
    "members": [
      {
        "id": "a",
        "label": "Book A",
        "kind": "book",
        "feature": {
          "id": "red-cover",
          "text": "red cover",
          "color": "red",
          "icon": "cover"
        }
      },
      {
        "id": "b",
        "label": "Book B",
        "kind": "book",
        "feature": {
          "id": "red-cover",
          "text": "red cover",
          "color": "red",
          "icon": "cover"
        }
      },
      {
        "id": "c",
        "label": "Book C",
        "kind": "book",
        "feature": {
          "id": "green-cover",
          "text": "green cover",
          "color": "green",
          "icon": "cover"
        }
      }
    ],
    "targetFeature": "red-cover",
    "matches": [
      "a",
      "b"
    ],
    "factsIntro": "These are the three books in this made-up scene.",
    "facts": [
      "Book A has a red cover.",
      "Book B has a red cover.",
      "Book C has a green cover."
    ],
    "forms": {
      "identify": {
        "sentence": "The books which have red covers will go on the display table.",
        "reference": [
          "a",
          "b"
        ],
        "status": "fits",
        "explanation": "The detail identifies Book A and Book B. This message says they will go on the display table. It does not say that Book C will not go on the display table."
      },
      "extra": {
        "sentence": "The books, which have red covers, will go on the display table.",
        "reference": [
          "a",
          "b",
          "c"
        ],
        "status": "conflicts",
        "explanation": "Here the noun group is all three books. This message says they will go on the display table. With the commas, the detail adds that all three have red covers. That detail does not fit Book C’s green cover. The sentence is grammatical, but its extra detail disagrees with our scene."
      },
      "plain": {
        "sentence": "The books will go on the display table.",
        "reference": [
          "a",
          "b",
          "c"
        ],
        "status": "omitted",
        "explanation": "Here the noun group is all three books. This message says they will go on the display table. It says nothing about their covers. The picture still shows the same covers."
      }
    }
  },
  {
    "id": "books-all",
    "title": "Books with red covers",
    "story": "The librarian is preparing a display-table message. Every book here has a red cover. Compare what the versions say.",
    "noun": "The books",
    "clause": "which have red covers",
    "predicate": "will go on the display table.",
    "singular": "book",
    "plural": "books",
    "members": [
      {
        "id": "a",
        "label": "Book A",
        "kind": "book",
        "feature": {
          "id": "red-cover",
          "text": "red cover",
          "color": "red",
          "icon": "cover"
        }
      },
      {
        "id": "b",
        "label": "Book B",
        "kind": "book",
        "feature": {
          "id": "red-cover",
          "text": "red cover",
          "color": "red",
          "icon": "cover"
        }
      },
      {
        "id": "c",
        "label": "Book C",
        "kind": "book",
        "feature": {
          "id": "red-cover",
          "text": "red cover",
          "color": "red",
          "icon": "cover"
        }
      }
    ],
    "targetFeature": "red-cover",
    "matches": [
      "a",
      "b",
      "c"
    ],
    "factsIntro": "These are the three books in this made-up scene.",
    "facts": [
      "Book A has a red cover.",
      "Book B has a red cover.",
      "Book C has a red cover."
    ],
    "forms": {
      "identify": {
        "sentence": "The books which have red covers will go on the display table.",
        "reference": [
          "a",
          "b",
          "c"
        ],
        "status": "fits",
        "explanation": "All three books here have red covers, so this identifying detail includes Book A, Book B, and Book C. This message says they will go on the display table. Both versions, with and without commas, include all three here: one identifies the group by its feature; the other adds information about the group already identified."
      },
      "extra": {
        "sentence": "The books, which have red covers, will go on the display table.",
        "reference": [
          "a",
          "b",
          "c"
        ],
        "status": "fits",
        "explanation": "Here the noun group is all three books. This message says they will go on the display table and adds that they all have red covers. That detail fits our scene. Both versions, with and without commas, include all three here, but the detail has a different job in each."
      },
      "plain": {
        "sentence": "The books will go on the display table.",
        "reference": [
          "a",
          "b",
          "c"
        ],
        "status": "omitted",
        "explanation": "Here the noun group is all three books. This message says they will go on the display table. It says nothing about their covers. The picture still shows the same covers."
      }
    }
  }
]);
export const groupTeaching=freeze([
  {
    "title": "Start with a sentence.",
    "intro": "These are the three lanterns in this example.",
    "members": [
      {
        "id": "a",
        "label": "Lantern A",
        "kind": "lantern",
        "feature": {
          "id": "silver-handle",
          "text": "silver handle",
          "color": "silver",
          "icon": "handle"
        }
      },
      {
        "id": "b",
        "label": "Lantern B",
        "kind": "lantern",
        "feature": {
          "id": "wooden-handle",
          "text": "wooden handle",
          "color": "neutral",
          "icon": "handle"
        }
      },
      {
        "id": "c",
        "label": "Lantern C",
        "kind": "lantern",
        "feature": {
          "id": "silver-handle",
          "text": "silver handle",
          "color": "silver",
          "icon": "handle"
        }
      }
    ],
    "blocks": [
      {
        "kind": "sentence",
        "text": "The lanterns will hang by the door."
      },
      {
        "kind": "comment",
        "text": "This sentence names a group and says something about it. It starts with a capital and ends with a period. Here are two sentences we can join."
      },
      {
        "kind": "sentence",
        "text": "The lanterns will hang by the door."
      },
      {
        "kind": "sentence",
        "text": "They will light the entrance."
      },
      {
        "kind": "sentence",
        "text": "The lanterns will hang by the door, and they will light the entrance."
      },
      {
        "kind": "comment",
        "text": "List commas have another job."
      },
      {
        "kind": "sentence",
        "text": "The shelf holds a map, a pencil, and a bell."
      },
      {
        "kind": "comment",
        "text": "Those commas separate list items. The pair we try next brackets extra information."
      }
    ],
    "facts": [
      "Lantern A has a silver handle.",
      "Lantern B has a wooden handle.",
      "Lantern C has a silver handle."
    ]
  },
  {
    "title": "A detail identifies which ones.",
    "intro": "These are the three lanterns in this example.",
    "members": [
      {
        "id": "a",
        "label": "Lantern A",
        "kind": "lantern",
        "feature": {
          "id": "silver-handle",
          "text": "silver handle",
          "color": "silver",
          "icon": "handle"
        }
      },
      {
        "id": "b",
        "label": "Lantern B",
        "kind": "lantern",
        "feature": {
          "id": "wooden-handle",
          "text": "wooden handle",
          "color": "neutral",
          "icon": "handle"
        }
      },
      {
        "id": "c",
        "label": "Lantern C",
        "kind": "lantern",
        "feature": {
          "id": "silver-handle",
          "text": "silver handle",
          "color": "silver",
          "icon": "handle"
        }
      }
    ],
    "blocks": [
      {
        "kind": "sentence",
        "text": "The lanterns which have silver handles will hang by the door."
      },
      {
        "kind": "comment",
        "text": "This sentence identifies Lantern A and Lantern C. “Which have silver handles” is a relative clause about the noun group here, not a complete main sentence. The Which One? tab uses the word “that” for some identifying details. “That” also works without commas. With a pair of commas, use “who” for people or “which” for things."
      }
    ],
    "facts": [
      "Lantern A has a silver handle.",
      "Lantern B has a wooden handle.",
      "Lantern C has a silver handle."
    ]
  },
  {
    "title": "Remove the identifying detail.",
    "intro": "These are the three lanterns in this example.",
    "members": [
      {
        "id": "a",
        "label": "Lantern A",
        "kind": "lantern",
        "feature": {
          "id": "silver-handle",
          "text": "silver handle",
          "color": "silver",
          "icon": "handle"
        }
      },
      {
        "id": "b",
        "label": "Lantern B",
        "kind": "lantern",
        "feature": {
          "id": "wooden-handle",
          "text": "wooden handle",
          "color": "neutral",
          "icon": "handle"
        }
      },
      {
        "id": "c",
        "label": "Lantern C",
        "kind": "lantern",
        "feature": {
          "id": "silver-handle",
          "text": "silver handle",
          "color": "silver",
          "icon": "handle"
        }
      }
    ],
    "blocks": [
      {
        "kind": "sentence",
        "text": "The lanterns will hang by the door."
      },
      {
        "kind": "comment",
        "text": "This sentence now talks about all three lanterns. It is still a sentence, but the group changed. The earlier message did not say that Lantern B will not hang by the door. Removing words can change meaning even when the sentence still works."
      }
    ],
    "facts": [
      "Lantern A has a silver handle.",
      "Lantern B has a wooden handle.",
      "Lantern C has a silver handle."
    ]
  },
  {
    "title": "Add both commas.",
    "intro": "These are the three lanterns in this example.",
    "members": [
      {
        "id": "a",
        "label": "Lantern A",
        "kind": "lantern",
        "feature": {
          "id": "silver-handle",
          "text": "silver handle",
          "color": "silver",
          "icon": "handle"
        }
      },
      {
        "id": "b",
        "label": "Lantern B",
        "kind": "lantern",
        "feature": {
          "id": "wooden-handle",
          "text": "wooden handle",
          "color": "neutral",
          "icon": "handle"
        }
      },
      {
        "id": "c",
        "label": "Lantern C",
        "kind": "lantern",
        "feature": {
          "id": "silver-handle",
          "text": "silver handle",
          "color": "silver",
          "icon": "handle"
        }
      }
    ],
    "blocks": [
      {
        "kind": "sentence",
        "text": "The lanterns, which have silver handles, will hang by the door."
      },
      {
        "kind": "comment",
        "text": "This sentence talks about the established group of all three and adds that they have silver handles. Lantern B’s wooden handle conflicts with that detail. The sentence is grammatical, but its extra detail does not fit this scene. Both commas bracket the clause; a comma is not just a place to breathe. Grammar names: identifying or defining clause; extra-information or non-defining clause."
      }
    ],
    "facts": [
      "Lantern A has a silver handle.",
      "Lantern B has a wooden handle.",
      "Lantern C has a silver handle."
    ]
  },
  {
    "title": "Another scene: all silver.",
    "intro": "These are the three lanterns in this example.",
    "members": [
      {
        "id": "a",
        "label": "Lantern A",
        "kind": "lantern",
        "feature": {
          "id": "silver-handle",
          "text": "silver handle",
          "color": "silver",
          "icon": "handle"
        }
      },
      {
        "id": "b",
        "label": "Lantern B",
        "kind": "lantern",
        "feature": {
          "id": "silver-handle",
          "text": "silver handle",
          "color": "silver",
          "icon": "handle"
        }
      },
      {
        "id": "c",
        "label": "Lantern C",
        "kind": "lantern",
        "feature": {
          "id": "silver-handle",
          "text": "silver handle",
          "color": "silver",
          "icon": "handle"
        }
      }
    ],
    "blocks": [
      {
        "kind": "comment",
        "text": "In this different scene all three lantern handles are silver. Both versions can fit:"
      },
      {
        "kind": "sentence",
        "text": "The lanterns which have silver handles will hang by the door."
      },
      {
        "kind": "sentence",
        "text": "The lanterns, which have silver handles, will hang by the door."
      },
      {
        "kind": "comment",
        "text": "Both versions, with and without commas, include all three, but the detail has a different job in each. Removing the extra detail keeps that group and leaves the handle information out. Return to your waiting message."
      }
    ],
    "facts": [
      "Lantern A has a silver handle.",
      "Lantern B has a silver handle.",
      "Lantern C has a silver handle."
    ]
  }
]);
export const groupScene=id=>groupScenes.find(scene=>scene.id===id)||null;
