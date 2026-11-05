// Original selected-path content; kept guides carry their own frozen source.
const sources=[
  {
    "v": 1,
    "model": "living-layers-v1",
    "id": "heart",
    "title": "From a heart cell to a person",
    "context": "The town collection needs a guide to one path through a person's body. Explore a selected heart muscle cell and its larger contexts.",
    "notice": "Conceptual illustrations of selected examples, not microscope views or measured magnification. Colors, sizes and numbers of symbols are chosen for drawing. The path shows selected parts rather than every component. Changing the view changes context; it does not show a cell growing into an organ or a whole body.",
    "partDirection": "Part to larger context",
    "wholeDirection": "Whole to smaller part",
    "partConnector": "is part of",
    "wholeConnector": "includes",
    "plantReturnNote": "In the seedling model, stem length describes a plant organ. That one measurement does not describe every part or the whole plant's condition.",
    "nodes": [
      {
        "id": "h-cell",
        "label": "Cardiac muscle cell",
        "kind": "cell",
        "levelLabel": "Cell",
        "role": "This selected heart muscle cell can contract. Coordinated activity of many such cells helps the heart pump.",
        "art": "heartCell",
        "others": []
      },
      {
        "id": "h-tissue",
        "label": "Cardiac muscle tissue",
        "kind": "tissue",
        "levelLabel": "Tissue",
        "role": "Cardiac muscle tissue contains specialized muscle cells and supporting material. It helps the heart contract.",
        "art": "heartTissue",
        "others": []
      },
      {
        "id": "h-organ",
        "label": "Heart",
        "kind": "organ",
        "levelLabel": "Organ",
        "role": "The heart combines several tissue types and pumps blood. Cardiac muscle tissue is one part of this organ.",
        "art": "heart",
        "others": [
          {
            "label": "Connective tissue",
            "role": "Supports and connects structures in the heart."
          },
          {
            "label": "Nervous tissue",
            "role": "Carries signals that can speed up or slow down the heartbeat. Each beat starts in specialized heart muscle cells."
          },
          {
            "label": "Epithelial tissue",
            "role": "Covers or lines surfaces in parts of the heart."
          }
        ]
      },
      {
        "id": "h-system",
        "label": "Circulatory system",
        "kind": "system",
        "levelLabel": "Organ system",
        "role": "The heart and blood vessels are parts of the circulatory system. Blood moves through this connected system.",
        "art": "circulation",
        "others": [
          {
            "label": "Blood vessels",
            "role": "Carry blood through the body."
          }
        ]
      },
      {
        "id": "h-person",
        "label": "A person",
        "kind": "organism",
        "levelLabel": "Organism",
        "role": "A person is one multicellular organism with many organ systems working together. Our guide follows one selected path.",
        "art": "person",
        "others": []
      }
    ],
    "trayIds": [
      "h-organ",
      "h-cell",
      "h-person",
      "h-tissue",
      "h-system"
    ],
    "teaching": [
      {
        "text": "A cell is a basic unit of life. Some organisms have one cell. Our selected person and bean plant examples have many.",
        "art": "none"
      },
      {
        "text": "A tissue is a group of cells and associated material working together. Here tissue means a biological structure; paper tissues use a different meaning.",
        "art": "none"
      },
      {
        "text": "An organ contains different tissues. The highlighted tissue is one example, so this path does not show everything in the organ.",
        "art": "none"
      },
      {
        "text": "An organ system includes organs working together. Real systems can share organs; one path is not a full map of all their connections.",
        "art": "none"
      },
      {
        "text": "These images show different organizational levels. A cell does not turn into an organ or a whole organism when we look at its larger context.",
        "art": "none"
      },
      {
        "text": "One baker's yeast cell is a whole organism. It does not have tissues or organs, so our five-level path does not describe every living thing.",
        "art": "yeast"
      }
    ]
  },
  {
    "v": 1,
    "model": "living-layers-v1",
    "id": "leaf",
    "title": "From a leaf cell to a bean plant",
    "context": "Try the same levels in a different living thing. Follow one selected photosynthetic cell through a leaf to this bean plant.",
    "notice": "Conceptual illustrations of selected examples, not microscope views or measured magnification. Colors, sizes and numbers of symbols are chosen for drawing. The path shows selected parts rather than every component. Changing the view changes context; it does not show a cell growing into an organ or a whole body.",
    "partDirection": "Part to larger context",
    "wholeDirection": "Whole to smaller part",
    "partConnector": "is part of",
    "wholeConnector": "includes",
    "plantReturnNote": "In the seedling model, stem length describes a plant organ. That one measurement does not describe every part or the whole plant's condition.",
    "nodes": [
      {
        "id": "l-cell",
        "label": "Photosynthetic mesophyll cell",
        "kind": "cell",
        "levelLabel": "Cell",
        "role": "This selected cell inside a green leaf has chloroplasts that use light in photosynthesis. Other cells can have different jobs.",
        "art": "leafCell",
        "others": []
      },
      {
        "id": "l-tissue",
        "label": "Mesophyll tissue",
        "kind": "tissue",
        "levelLabel": "Tissue",
        "role": "Mesophyll tissue contains many leaf cells involved in photosynthesis. Our drawing shows only a few symbols for them.",
        "art": "mesophyll",
        "others": []
      },
      {
        "id": "l-organ",
        "label": "Leaf",
        "kind": "organ",
        "levelLabel": "Organ",
        "role": "A leaf contains mesophyll, protective epidermal tissue and transport tissue. Different tissues help this organ do several jobs.",
        "art": "leaf",
        "others": [
          {
            "label": "Epidermal tissue",
            "role": "Helps protect the leaf and regulate exchange with its surroundings."
          },
          {
            "label": "Vascular tissue",
            "role": "Transports water, minerals and sugars through the plant."
          }
        ]
      },
      {
        "id": "l-system",
        "label": "Shoot system",
        "kind": "system",
        "levelLabel": "Organ system",
        "role": "This bean plant's leaves and stem are parts of its shoot system. Flowers and fruits can also belong to a shoot system.",
        "art": "shoot",
        "others": [
          {
            "label": "Stem",
            "role": "Supports and connects parts of the shoot system."
          },
          {
            "label": "Other leaves",
            "role": "This plant has more leaves than the selected one. Each is an organ in the same shoot system."
          }
        ]
      },
      {
        "id": "l-plant",
        "label": "A bean plant",
        "kind": "organism",
        "levelLabel": "Organism",
        "role": "This bean plant is one multicellular organism with shoot and root systems. Our guide follows a selected path through a leaf.",
        "art": "plant",
        "others": []
      }
    ],
    "trayIds": [
      "l-system",
      "l-tissue",
      "l-plant",
      "l-cell",
      "l-organ"
    ],
    "teaching": [
      {
        "text": "A cell is a basic unit of life. Some organisms have one cell. Our selected person and bean plant examples have many.",
        "art": "none"
      },
      {
        "text": "A tissue is a group of cells and associated material working together. Here tissue means a biological structure; paper tissues use a different meaning.",
        "art": "none"
      },
      {
        "text": "An organ contains different tissues. The highlighted tissue is one example, so this path does not show everything in the organ.",
        "art": "none"
      },
      {
        "text": "An organ system includes organs working together. Real systems can share organs; one path is not a full map of all their connections.",
        "art": "none"
      },
      {
        "text": "These images show different organizational levels. A cell does not turn into an organ or a whole organism when we look at its larger context.",
        "art": "none"
      },
      {
        "text": "One baker's yeast cell is a whole organism. It does not have tissues or organs, so our five-level path does not describe every living thing.",
        "art": "yeast"
      }
    ]
  }
];
export const layerCases=structuredClone(sources);
export function layerSource(id){return structuredClone(sources.find(source=>source.id===id)??null);}
