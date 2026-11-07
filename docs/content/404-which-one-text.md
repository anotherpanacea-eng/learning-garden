#404 · Which One? Complete finite scene and language packet

Status: proposed for independent grammar, meaning and specification review. All pictures will be original schematics; all words below are original. The source scene remains fixed under all sentence trials. Tokens are complete authored sentence segments, not a grammar generator.

```json
{
  "copy": {
    "label": "Which One?",
    "joins": "Joining words",
    "details": "Which One?",
    "opening": "Give the detail to a noun, then try the other one. What does the sentence describe now?",
    "scene": "Our imagined scene",
    "sceneNotice": "The picture and scene facts stay the same when you change the words.",
    "purpose": "For this reader",
    "detail": "Detail to move",
    "sentence": "Sentence we are trying",
    "meaning": "Meaning to notice",
    "sceneNote": "Beside the scene",
    "purposeNote": "Beside the request",
    "attach": "Describe",
    "remove": "Remove the detail",
    "undo": "Undo last move",
    "noUndo": "No move to undo in this scene.",
    "noDetail": "No detail is attached.",
    "pointsTo": "In this version, the detail describes",
    "separateMeaning": "The base sentence names the two figures and where they are. It does not attach the movable detail to either noun.",
    "previousScene": "Previous scene",
    "nextScene": "Next scene",
    "sceneCount": "Scene",
    "teaching": "How does the detail work?",
    "teachingCount": "Teaching card",
    "previousTeaching": "Previous card",
    "nextTeaching": "Next card",
    "model": "Try a separate model",
    "modelCount": "Model part",
    "previousModel": "Previous model part",
    "nextModel": "Next model part",
    "hear": "Hear this version",
    "visit": "Your Which One? trials wait while you try its other scenes or switch to Joining words. Leaving Sentence Bridges or changing explorer clears this visit. Nothing here is added to Notes.",
    "returnPrompt": "Try both places for the detail. Then ask someone to draw what each version describes. If a real message could mean two things, ask the writer or make it clearer.",
    "grownup": "This is a finite model of relative-clause attachment in prepared sentences, with an explicit link showing the structure being tried. It is not a parser or a rule that every clause must refer to the nearest noun. Real sentences, even short ones, can sometimes be read more than one way. These clauses use the no-comma form; here the nouns already tell the figures apart, so the clauses add detail rather than choosing among same-kind figures. Both “that” and “which” can introduce restrictive clauses about things; some style guides prefer “that.” We do not grade that choice here. “Who” is used with people in one case, and “that” with the pictured animals. No general pronoun rule, comma course, independent reading or writing level is assessed. All figures, facts and messages are made up. Original sentences stay aloud or on paper with a person.",
    "leftWaiting": "Choose a noun for the detail to describe.",
    "modes": "Sentence Bridges modes",
    "attachedAnnouncement": "Detail attached to {noun}. Sentence and meaning updated.",
    "removedAnnouncement": "Detail removed. The base sentence is showing.",
    "undoAnnouncement": "Last detail move undone.",
    "sceneAnnouncement": "{title}. Your trial is here."
  },
  "teach": [
    "A relative clause adds detail about a noun. In “The duck that was splashing stood beside the swan,” “that was splashing” gives detail about the duck.",
    "In our prepared versions, we put the detail just after the noun we want it to describe. The link on the board shows the attachment we are trying. Real sentences, even short ones, can sometimes be read more than one way.",
    "“The duck stood beside the swan that was splashing” gives the splashing detail to the swan in this version. Moving the same words can change who or what is described.",
    "The sentence can be grammatical but disagree with the scene, or tell the reader about a different thing. Read the picture facts and the request as well as the words."
  ],
  "model": [
    {
      "title": "Two birds",
      "text": "Our separate model has a duck beside a swan. The swan was splashing; the duck was standing still. Start with: “The duck stood beside the swan.”"
    },
    {
      "title": "A detail for the duck",
      "text": "“The duck that was splashing stood beside the swan.” In this version, “that was splashing” describes the duck. That does not agree with our model’s scene."
    },
    {
      "title": "Move it to the swan",
      "text": "“The duck stood beside the swan that was splashing.” In this version, the detail describes the swan. That agrees with our model’s scene."
    },
    {
      "title": "Take it out",
      "text": "“The duck stood beside the swan.” Removing the detail does not say that no bird was splashing. It simply leaves that information out. Ask a person what each version would lead them to picture."
    }
  ],
  "cases": [
    {
      "id": "parcel",
      "title": "The star label",
      "context": "A parcel with a star label rests beside a crate with a plain label. The crate has no star label.",
      "purpose": "Describe the parcel’s label for the delivery driver.",
      "clause": "that has a star label",
      "entities": [
        {
          "id": "parcel",
          "text": "The parcel",
          "label": "the parcel",
          "kind": "parcel",
          "feature": {
            "icon": "star",
            "text": "Star label"
          }
        },
        {
          "id": "crate",
          "text": "the crate",
          "label": "the crate",
          "kind": "crate",
          "feature": {
            "icon": "plain",
            "text": "Plain label"
          }
        }
      ],
      "base": [
        {
          "text": "The parcel",
          "noun": "parcel"
        },
        {
          "text": " rests beside "
        },
        {
          "text": "the crate",
          "noun": "crate"
        },
        {
          "text": "."
        }
      ],
      "trials": {
        "parcel": {
          "tokens": [
            {
              "text": "The parcel",
              "noun": "parcel"
            },
            {
              "text": " that has a star label",
              "detail": true
            },
            {
              "text": " rests beside "
            },
            {
              "text": "the crate",
              "noun": "crate"
            },
            {
              "text": "."
            }
          ],
          "meaning": "This version gives the star-label detail to the parcel.",
          "sceneNote": "That agrees with the parcel’s label in our scene.",
          "purposeNote": "The detail is about the parcel, as this reader requested."
        },
        "crate": {
          "tokens": [
            {
              "text": "The parcel",
              "noun": "parcel"
            },
            {
              "text": " rests beside "
            },
            {
              "text": "the crate",
              "noun": "crate"
            },
            {
              "text": " that has a star label",
              "detail": true
            },
            {
              "text": "."
            }
          ],
          "meaning": "This version gives the star-label detail to the crate.",
          "sceneNote": "Our scene gives the crate a plain label, not a star. Moving the words does not change the crate.",
          "purposeNote": "This tells the reader about the crate instead of the parcel’s label."
        }
      }
    },
    {
      "id": "scarf",
      "title": "A striped scarf",
      "context": "A courier in a striped scarf waits beside a gardener in a plain scarf. Only the courier’s scarf is striped.",
      "purpose": "Describe the courier’s scarf for the visitor.",
      "clause": "who is wearing a striped scarf",
      "entities": [
        {
          "id": "courier",
          "text": "The courier",
          "label": "the courier",
          "kind": "courier",
          "feature": {
            "icon": "stripes",
            "text": "Striped scarf"
          }
        },
        {
          "id": "gardener",
          "text": "the gardener",
          "label": "the gardener",
          "kind": "gardener",
          "feature": {
            "icon": "plain",
            "text": "Plain scarf"
          }
        }
      ],
      "base": [
        {
          "text": "The courier",
          "noun": "courier"
        },
        {
          "text": " waits beside "
        },
        {
          "text": "the gardener",
          "noun": "gardener"
        },
        {
          "text": "."
        }
      ],
      "trials": {
        "courier": {
          "tokens": [
            {
              "text": "The courier",
              "noun": "courier"
            },
            {
              "text": " who is wearing a striped scarf",
              "detail": true
            },
            {
              "text": " waits beside "
            },
            {
              "text": "the gardener",
              "noun": "gardener"
            },
            {
              "text": "."
            }
          ],
          "meaning": "In this version, the courier is the person wearing the striped scarf.",
          "sceneNote": "That agrees with our scene.",
          "purposeNote": "The added detail describes the courier, as requested."
        },
        "gardener": {
          "tokens": [
            {
              "text": "The courier",
              "noun": "courier"
            },
            {
              "text": " waits beside "
            },
            {
              "text": "the gardener",
              "noun": "gardener"
            },
            {
              "text": " who is wearing a striped scarf",
              "detail": true
            },
            {
              "text": "."
            }
          ],
          "meaning": "In this version, the gardener is the person wearing the striped scarf.",
          "sceneNote": "Our gardener’s scarf is plain. The sentence and the scene disagree about that detail.",
          "purposeNote": "This adds a description of the gardener, not the courier’s scarf."
        }
      }
    },
    {
      "id": "spoon",
      "title": "A spoon for supper",
      "context": "A kitten with empty paws sits beside a bunny carrying a spoon.",
      "purpose": "Tell the café helper what the bunny is carrying.",
      "clause": "that is carrying a spoon",
      "entities": [
        {
          "id": "kitten",
          "text": "The kitten",
          "label": "the kitten",
          "kind": "kitten",
          "feature": {
            "icon": "empty",
            "text": "Empty paws"
          }
        },
        {
          "id": "bunny",
          "text": "the bunny",
          "label": "the bunny",
          "kind": "bunny",
          "feature": {
            "icon": "spoon",
            "text": "Carrying a spoon"
          }
        }
      ],
      "base": [
        {
          "text": "The kitten",
          "noun": "kitten"
        },
        {
          "text": " sits beside "
        },
        {
          "text": "the bunny",
          "noun": "bunny"
        },
        {
          "text": "."
        }
      ],
      "trials": {
        "kitten": {
          "tokens": [
            {
              "text": "The kitten",
              "noun": "kitten"
            },
            {
              "text": " that is carrying a spoon",
              "detail": true
            },
            {
              "text": " sits beside "
            },
            {
              "text": "the bunny",
              "noun": "bunny"
            },
            {
              "text": "."
            }
          ],
          "meaning": "This version describes the kitten as carrying a spoon.",
          "sceneNote": "The kitten has empty paws in our scene; the bunny carries the spoon.",
          "purposeNote": "This tells the helper about the kitten instead of the bunny."
        },
        "bunny": {
          "tokens": [
            {
              "text": "The kitten",
              "noun": "kitten"
            },
            {
              "text": " sits beside "
            },
            {
              "text": "the bunny",
              "noun": "bunny"
            },
            {
              "text": " that is carrying a spoon",
              "detail": true
            },
            {
              "text": "."
            }
          ],
          "meaning": "This version describes the bunny as carrying a spoon.",
          "sceneNote": "That agrees with the bunny in our scene.",
          "purposeNote": "The detail is about the bunny, as the helper requested."
        }
      }
    },
    {
      "id": "tag",
      "title": "The circle tag",
      "context": "A basket with a circle tag sits beside a stool with a triangle tag. Neither tag changes while you move the words.",
      "purpose": "Describe the basket’s tag for the stock keeper.",
      "clause": "that has a circle tag",
      "entities": [
        {
          "id": "basket",
          "text": "The basket",
          "label": "the basket",
          "kind": "basket",
          "feature": {
            "icon": "circle",
            "text": "Circle tag"
          }
        },
        {
          "id": "stool",
          "text": "the stool",
          "label": "the stool",
          "kind": "stool",
          "feature": {
            "icon": "triangle",
            "text": "Triangle tag"
          }
        }
      ],
      "base": [
        {
          "text": "The basket",
          "noun": "basket"
        },
        {
          "text": " sits beside "
        },
        {
          "text": "the stool",
          "noun": "stool"
        },
        {
          "text": "."
        }
      ],
      "trials": {
        "basket": {
          "tokens": [
            {
              "text": "The basket",
              "noun": "basket"
            },
            {
              "text": " that has a circle tag",
              "detail": true
            },
            {
              "text": " sits beside "
            },
            {
              "text": "the stool",
              "noun": "stool"
            },
            {
              "text": "."
            }
          ],
          "meaning": "This version gives the circle-tag detail to the basket.",
          "sceneNote": "The basket’s circle tag agrees with that description.",
          "purposeNote": "It describes the basket’s tag for the stock keeper."
        },
        "stool": {
          "tokens": [
            {
              "text": "The basket",
              "noun": "basket"
            },
            {
              "text": " sits beside "
            },
            {
              "text": "the stool",
              "noun": "stool"
            },
            {
              "text": " that has a circle tag",
              "detail": true
            },
            {
              "text": "."
            }
          ],
          "meaning": "This version gives the circle-tag detail to the stool.",
          "sceneNote": "The stool has a triangle tag in our scene.",
          "purposeNote": "It describes a tag on the stool instead of the basket’s tag."
        }
      }
    },
    {
      "id": "moon",
      "title": "A painted moon",
      "context": "A lantern painted with a star rests beside a small boat painted with a moon.",
      "purpose": "Describe the boat’s painted mark for its passenger.",
      "clause": "that has a painted moon",
      "entities": [
        {
          "id": "lantern",
          "text": "The lantern",
          "label": "the lantern",
          "kind": "lantern",
          "feature": {
            "icon": "star",
            "text": "Painted star"
          }
        },
        {
          "id": "boat",
          "text": "the boat",
          "label": "the boat",
          "kind": "boat",
          "feature": {
            "icon": "moon",
            "text": "Painted moon"
          }
        }
      ],
      "base": [
        {
          "text": "The lantern",
          "noun": "lantern"
        },
        {
          "text": " rests beside "
        },
        {
          "text": "the boat",
          "noun": "boat"
        },
        {
          "text": "."
        }
      ],
      "trials": {
        "lantern": {
          "tokens": [
            {
              "text": "The lantern",
              "noun": "lantern"
            },
            {
              "text": " that has a painted moon",
              "detail": true
            },
            {
              "text": " rests beside "
            },
            {
              "text": "the boat",
              "noun": "boat"
            },
            {
              "text": "."
            }
          ],
          "meaning": "This version gives the painted-moon detail to the lantern.",
          "sceneNote": "Our lantern has a painted star. The boat has the moon.",
          "purposeNote": "This describes a mark on the lantern rather than the boat’s mark."
        },
        "boat": {
          "tokens": [
            {
              "text": "The lantern",
              "noun": "lantern"
            },
            {
              "text": " rests beside "
            },
            {
              "text": "the boat",
              "noun": "boat"
            },
            {
              "text": " that has a painted moon",
              "detail": true
            },
            {
              "text": "."
            }
          ],
          "meaning": "This version gives the painted-moon detail to the boat.",
          "sceneNote": "That agrees with the boat in our scene.",
          "purposeNote": "It describes the boat’s mark, as its passenger requested."
        }
      }
    },
    {
      "id": "bridge",
      "title": "Two bridge pictures",
      "context": "A book lies beside a map. A bridge is shown in the book and on the map.",
      "purpose": "Tell the visitor what the book shows.",
      "clause": "which shows a bridge",
      "entities": [
        {
          "id": "book",
          "text": "The book",
          "label": "the book",
          "kind": "book",
          "feature": {
            "icon": "bridge",
            "text": "Shows a bridge"
          }
        },
        {
          "id": "map",
          "text": "the map",
          "label": "the map",
          "kind": "map",
          "feature": {
            "icon": "bridge",
            "text": "Shows a bridge"
          }
        }
      ],
      "base": [
        {
          "text": "The book",
          "noun": "book"
        },
        {
          "text": " lies beside "
        },
        {
          "text": "the map",
          "noun": "map"
        },
        {
          "text": "."
        }
      ],
      "trials": {
        "book": {
          "tokens": [
            {
              "text": "The book",
              "noun": "book"
            },
            {
              "text": " which shows a bridge",
              "detail": true
            },
            {
              "text": " lies beside "
            },
            {
              "text": "the map",
              "noun": "map"
            },
            {
              "text": "."
            }
          ],
          "meaning": "This version says the book shows a bridge.",
          "sceneNote": "Our book shows a bridge, so this agrees with the scene. The map shows one too.",
          "purposeNote": "This version adds the requested information about the book."
        },
        "map": {
          "tokens": [
            {
              "text": "The book",
              "noun": "book"
            },
            {
              "text": " lies beside "
            },
            {
              "text": "the map",
              "noun": "map"
            },
            {
              "text": " which shows a bridge",
              "detail": true
            },
            {
              "text": "."
            }
          ],
          "meaning": "This version says the map shows a bridge.",
          "sceneNote": "That also agrees with the scene. Both things show a bridge.",
          "purposeNote": "It describes the map, while this reader asked about the book."
        }
      }
    }
  ]
}
```
