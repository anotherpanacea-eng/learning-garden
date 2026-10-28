// Original finite copy from docs/content/286-feeding-board-text.md; factual references in audit286.
export const feedingBoardSource = {
  "id": "feeding-board-usual-foods",
  "version": 1,
  "title": "The Feeding Board",
  "origin": "Supplied science examples",
  "notice": "These pictures show examples of foods these animals eat, not one meal or every food. The groups describe their diets.",
  "baskets": [
    {
      "id": "herbivore",
      "label": "Herbivore · plants",
      "meaning": "A herbivore mainly eats plant foods."
    },
    {
      "id": "carnivore",
      "label": "Carnivore · animals",
      "meaning": "A carnivore mainly eats animal foods, including animal remains."
    },
    {
      "id": "omnivore",
      "label": "Omnivore · plants and animals",
      "meaning": "An omnivore eats plant and animal foods."
    }
  ],
  "animals": [
    {
      "id": "rabbit",
      "name": "European rabbit",
      "scientificName": "Oryctolagus cuniculus",
      "foods": [
        {
          "id": "clover",
          "label": "Clover",
          "kind": "plant",
          "art": {
            "kind": "clover",
            "version": 1,
            "description": "Clover"
          }
        },
        {
          "id": "grass",
          "label": "Grass",
          "kind": "plant",
          "art": {
            "kind": "grass",
            "version": 1,
            "description": "Grass"
          }
        }
      ],
      "usualDiet": "European rabbits mainly eat plants. Clover and grass are examples.",
      "basketId": "herbivore",
      "guided": [
        "1. Clover and grass are plant foods.",
        "2. Look for the basket for plant-eaters. You can try it, then check."
      ],
      "feedback": [
        {
          "basketId": "herbivore",
          "outcome": "fits",
          "code": "rabbit-herbivore",
          "text": "Clover and grass are plant foods. Herbivore fits this rabbit's diet."
        },
        {
          "basketId": "carnivore",
          "outcome": "other",
          "code": "rabbit-carnivore",
          "text": "Clover and grass are plant foods. The source describes a plant-eater, not an animal-eater."
        },
        {
          "basketId": "omnivore",
          "outcome": "other",
          "code": "rabbit-omnivore",
          "text": "This source describes the rabbit's plant diet. Two plant foods do not make an omnivore."
        }
      ],
      "hint": "Are clover and grass plants or animals?",
      "sourceNote": "European rabbits mainly eat plants. Clover and grass are examples. These are supplied species facts, not an observation made in this game.",
      "reference": {
        "title": "Old world rabbit",
        "publisher": "Oregon Zoo",
        "url": "https://www.oregonzoo.org/animals/old-world-rabbit"
      },
      "art": {
        "kind": "rabbit",
        "version": 1,
        "description": "European rabbit with long ears and a short tail."
      }
    },
    {
      "id": "cow",
      "name": "Domestic cow",
      "scientificName": "Bos taurus",
      "foods": [
        {
          "id": "grass",
          "label": "Grass",
          "kind": "plant",
          "art": {
            "kind": "grass",
            "version": 1,
            "description": "Grass"
          }
        },
        {
          "id": "hay",
          "label": "Hay",
          "kind": "plant",
          "art": {
            "kind": "hay",
            "version": 1,
            "description": "Hay"
          }
        }
      ],
      "usualDiet": "Domestic cattle mainly eat plant foods. Grass and hay are examples. Hay is dried plant material.",
      "basketId": "herbivore",
      "guided": [],
      "feedback": [
        {
          "basketId": "herbivore",
          "outcome": "fits",
          "code": "cow-herbivore",
          "text": "Grass and hay are plant foods. Herbivore fits this cow's diet."
        },
        {
          "basketId": "carnivore",
          "outcome": "other",
          "code": "cow-carnivore",
          "text": "Grass and hay come from plants. The source describes a plant-eater."
        },
        {
          "basketId": "omnivore",
          "outcome": "other",
          "code": "cow-omnivore",
          "text": "Hay is dried plant material. Grass and hay are two plant foods, not plants and animals."
        }
      ],
      "hint": "Hay comes from plants. What about grass?",
      "sourceNote": "Domestic cattle mainly eat plant foods. Grass and hay are examples. Hay is dried plant material. These are supplied species facts, not an observation made in this game.",
      "reference": {
        "title": "Cow",
        "publisher": "Smithsonian National Zoo",
        "url": "https://nationalzoo.si.edu/animals/cow"
      },
      "art": {
        "kind": "cow",
        "version": 1,
        "description": "Domestic cow with a broad muzzle, hooves and a long tail."
      }
    },
    {
      "id": "elephant",
      "name": "Asian elephant",
      "scientificName": "Elephas maximus",
      "foods": [
        {
          "id": "leaves",
          "label": "Leaves",
          "kind": "plant",
          "art": {
            "kind": "leaves",
            "version": 1,
            "description": "Leaves"
          }
        },
        {
          "id": "grass",
          "label": "Grass",
          "kind": "plant",
          "art": {
            "kind": "grass",
            "version": 1,
            "description": "Grass"
          }
        },
        {
          "id": "bark",
          "label": "Bark",
          "kind": "plant",
          "art": {
            "kind": "bark",
            "version": 1,
            "description": "Bark"
          }
        }
      ],
      "usualDiet": "Asian elephants mainly eat plants. Leaves, grass and bark are examples.",
      "basketId": "herbivore",
      "guided": [],
      "feedback": [
        {
          "basketId": "herbivore",
          "outcome": "fits",
          "code": "elephant-herbivore",
          "text": "Leaves, grass and bark are plant foods. Huge, and a herbivore."
        },
        {
          "basketId": "carnivore",
          "outcome": "other",
          "code": "elephant-carnivore",
          "text": "Being huge does not decide the group. Leaves, grass and bark are plant foods."
        },
        {
          "basketId": "omnivore",
          "outcome": "other",
          "code": "elephant-omnivore",
          "text": "Leaves, grass and bark are all plant foods. Different plant parts do not make an omnivore."
        }
      ],
      "hint": "Set its size aside. What are leaves, grass and bark?",
      "sourceNote": "Asian elephants mainly eat plants. Leaves, grass and bark are examples. These are supplied species facts, not an observation made in this game.",
      "reference": {
        "title": "Asian elephant",
        "publisher": "Smithsonian National Zoo",
        "url": "https://nationalzoo.si.edu/animals/asian-elephant"
      },
      "art": {
        "kind": "elephant",
        "version": 1,
        "description": "Asian elephant with a trunk, broad feet and small rounded ears."
      }
    },
    {
      "id": "beaver",
      "name": "Eurasian beaver",
      "scientificName": "Castor fiber",
      "foods": [
        {
          "id": "bark",
          "label": "Bark",
          "kind": "plant",
          "art": {
            "kind": "bark",
            "version": 1,
            "description": "Bark"
          }
        },
        {
          "id": "twigs",
          "label": "Twigs",
          "kind": "plant",
          "art": {
            "kind": "twigs",
            "version": 1,
            "description": "Twigs"
          }
        },
        {
          "id": "water-plants",
          "label": "Water plants",
          "kind": "plant",
          "art": {
            "kind": "water-plants",
            "version": 1,
            "description": "Water plants"
          }
        }
      ],
      "usualDiet": "Eurasian beavers mainly eat plants. Bark, twigs and water plants are examples.",
      "basketId": "herbivore",
      "guided": [],
      "feedback": [
        {
          "basketId": "herbivore",
          "outcome": "fits",
          "code": "beaver-herbivore",
          "text": "Bark, twigs and water plants are plant foods. Big teeth, and a herbivore."
        },
        {
          "basketId": "carnivore",
          "outcome": "other",
          "code": "beaver-carnivore",
          "text": "Big teeth do not decide the group. This beaver's food source describes plant foods."
        },
        {
          "basketId": "omnivore",
          "outcome": "other",
          "code": "beaver-omnivore",
          "text": "Bark and twigs are plant parts too. The source describes a plant-eater."
        }
      ],
      "hint": "Is bark part of a plant or an animal?",
      "sourceNote": "Eurasian beavers mainly eat plants. Bark, twigs and water plants are examples. These are supplied species facts, not an observation made in this game.",
      "reference": {
        "title": "Beaver",
        "publisher": "Wildlife Trusts",
        "url": "https://www.wildlifetrusts.org/wildlife-explorer/mammals/beaver"
      },
      "art": {
        "kind": "beaver",
        "version": 1,
        "description": "Eurasian beaver with a broad flat tail and large front teeth."
      }
    },
    {
      "id": "owl",
      "name": "Barn owl",
      "scientificName": "Tyto alba",
      "foods": [
        {
          "id": "mice",
          "label": "Mice",
          "kind": "animal",
          "art": {
            "kind": "mice",
            "version": 1,
            "description": "Mice"
          }
        },
        {
          "id": "voles",
          "label": "Voles",
          "kind": "animal",
          "art": {
            "kind": "voles",
            "version": 1,
            "description": "Voles"
          }
        }
      ],
      "usualDiet": "This British barn owl example mainly eats small animals. Mice and voles are examples.",
      "basketId": "carnivore",
      "guided": [],
      "feedback": [
        {
          "basketId": "herbivore",
          "outcome": "other",
          "code": "owl-herbivore",
          "text": "Mice and voles are animals. This owl's source describes an animal-eater."
        },
        {
          "basketId": "carnivore",
          "outcome": "fits",
          "code": "owl-carnivore",
          "text": "Mice and voles are animals. Carnivore fits this barn owl example."
        },
        {
          "basketId": "omnivore",
          "outcome": "other",
          "code": "owl-omnivore",
          "text": "This source describes mainly animal foods. It does not describe a plant-and-animal diet."
        }
      ],
      "hint": "Mice and voles are small, but are they plants?",
      "sourceNote": "This British barn owl example mainly eats small animals. Mice and voles are examples. These are supplied species facts, not an observation made in this game.",
      "reference": {
        "title": "Barn Owl hunting and feeding",
        "publisher": "Barn Owl Trust",
        "url": "https://www.barnowltrust.org.uk/barn-owl-facts/barn-owl-hunting-feeding/"
      },
      "art": {
        "kind": "owl",
        "version": 1,
        "description": "Barn owl with a pale heart-shaped face, folded wings and two visible feet."
      }
    },
    {
      "id": "shrew",
      "name": "Common shrew",
      "scientificName": "Sorex araneus",
      "foods": [
        {
          "id": "beetles",
          "label": "Beetles",
          "kind": "animal",
          "art": {
            "kind": "beetles",
            "version": 1,
            "description": "Beetle"
          }
        },
        {
          "id": "earthworms",
          "label": "Earthworms",
          "kind": "animal",
          "art": {
            "kind": "earthworms",
            "version": 1,
            "description": "Earthworm"
          }
        }
      ],
      "usualDiet": "Common shrews mainly eat small animals. Beetles and earthworms are examples.",
      "basketId": "carnivore",
      "guided": [],
      "feedback": [
        {
          "basketId": "herbivore",
          "outcome": "other",
          "code": "shrew-herbivore",
          "text": "Tiny does not mean plant-eater. Beetles and earthworms are animals."
        },
        {
          "basketId": "carnivore",
          "outcome": "fits",
          "code": "shrew-carnivore",
          "text": "Beetles and earthworms are animals. Tiny, and a carnivore."
        },
        {
          "basketId": "omnivore",
          "outcome": "other",
          "code": "shrew-omnivore",
          "text": "Beetles and earthworms are different kinds of animals. The source describes an animal-eater."
        }
      ],
      "hint": "Insects and earthworms count as animals.",
      "sourceNote": "Common shrews mainly eat small animals. Beetles and earthworms are examples. These are supplied species facts, not an observation made in this game.",
      "reference": {
        "title": "Common Shrew",
        "publisher": "Cornwall Mammal Group",
        "url": "https://www.cornwallmammalgroup.org/common-shrew"
      },
      "art": {
        "kind": "shrew",
        "version": 1,
        "description": "Common shrew with a pointed snout, small eyes and a tail."
      }
    },
    {
      "id": "ladybird",
      "name": "Seven-spot ladybird",
      "scientificName": "Coccinella septempunctata",
      "foods": [
        {
          "id": "aphids",
          "label": "Aphids",
          "kind": "animal",
          "art": {
            "kind": "aphids",
            "version": 1,
            "description": "Tiny aphid insect"
          }
        },
        {
          "id": "pollen",
          "label": "Pollen",
          "kind": "plant",
          "art": {
            "kind": "pollen",
            "version": 1,
            "description": "Pollen grains from a flower"
          }
        }
      ],
      "usualDiet": "Seven-spot ladybirds hunt aphids and can also eat pollen from plants. This food record includes animal and plant foods. It does not tell us how much pollen a wild ladybird eats.",
      "basketId": "omnivore",
      "guided": [],
      "feedback": [
        {
          "basketId": "herbivore",
          "outcome": "other",
          "code": "ladybird-herbivore",
          "text": "Pollen is plant food, but aphids are animals. This record includes both."
        },
        {
          "basketId": "carnivore",
          "outcome": "other",
          "code": "ladybird-carnivore",
          "text": "Aphids are animals, but this ladybird can also eat pollen from plants. Use both food clues."
        },
        {
          "basketId": "omnivore",
          "outcome": "fits",
          "code": "ladybird-omnivore",
          "text": "Aphids are animals and pollen is plant food. Omnivore fits this food record. Both does not mean equal amounts."
        }
      ],
      "hint": "One clue is an insect. The other comes from a flower.",
      "sourceNote": "Seven-spot ladybirds hunt aphids and can also eat pollen from plants. This food record includes animal and plant foods. It does not tell us how much pollen a wild ladybird eats. These are supplied species facts, not an observation made in this game.",
      "reference": {
        "title": "Estimating the effect of plant-provided food supplements on pest consumption by omnivorous predators: lessons from two coccinellid beetles",
        "publisher": "Pest Management Science · PubMed",
        "url": "https://pubmed.ncbi.nlm.nih.gov/27470503/"
      },
      "art": {
        "kind": "ladybird",
        "version": 1,
        "description": "Adult seven-spot ladybird with red wing covers, seven black spots in total and six legs."
      }
    },
    {
      "id": "heron",
      "name": "Grey heron",
      "scientificName": "Ardea cinerea",
      "foods": [
        {
          "id": "fish",
          "label": "Fish",
          "kind": "animal",
          "art": {
            "kind": "fish",
            "version": 1,
            "description": "Fish"
          }
        },
        {
          "id": "frogs",
          "label": "Frogs",
          "kind": "animal",
          "art": {
            "kind": "frogs",
            "version": 1,
            "description": "Frogs"
          }
        }
      ],
      "usualDiet": "Grey herons mainly eat animals. Fish and frogs are examples.",
      "basketId": "carnivore",
      "guided": [],
      "feedback": [
        {
          "basketId": "herbivore",
          "outcome": "other",
          "code": "heron-herbivore",
          "text": "Fish and frogs are animals. This source describes an animal-eater."
        },
        {
          "basketId": "carnivore",
          "outcome": "fits",
          "code": "heron-carnivore",
          "text": "Fish and frogs are animals. Carnivore fits this heron's diet."
        },
        {
          "basketId": "omnivore",
          "outcome": "other",
          "code": "heron-omnivore",
          "text": "Fish and frogs are two animal foods. The source describes an animal-eater."
        }
      ],
      "hint": "Fish and frogs look different. Are either of them plants?",
      "sourceNote": "Grey herons mainly eat animals. Fish and frogs are examples. These are supplied species facts, not an observation made in this game.",
      "reference": {
        "title": "Grey heron",
        "publisher": "Game & Wildlife Conservation Trust",
        "url": "https://www.gwct.org.uk/wildlife/species-of-the-month/2021/grey-heron/"
      },
      "art": {
        "kind": "heron",
        "version": 1,
        "description": "Grey heron with a long neck, long legs and a pointed bill."
      }
    },
    {
      "id": "vulture",
      "name": "Adult bearded vulture",
      "scientificName": "Gypaetus barbatus",
      "foods": [
        {
          "id": "bones-of-dead-animals",
          "label": "Bones of dead animals",
          "kind": "animal",
          "art": {
            "kind": "bones-of-dead-animals",
            "version": 1,
            "description": "Bones of dead animals"
          }
        }
      ],
      "usualDiet": "Adult bearded vultures eat animal remains, mainly bones. A bone is part of an animal.",
      "basketId": "carnivore",
      "guided": [],
      "feedback": [
        {
          "basketId": "herbivore",
          "outcome": "other",
          "code": "vulture-herbivore",
          "text": "Bones are parts of animals, not plants. This vulture eats animal remains."
        },
        {
          "basketId": "carnivore",
          "outcome": "fits",
          "code": "vulture-carnivore",
          "text": "Bones are animal remains. A scavenger can be a carnivore without hunting its food."
        },
        {
          "basketId": "omnivore",
          "outcome": "other",
          "code": "vulture-omnivore",
          "text": "Dead animal remains are still animal material. This source describes an animal-eater."
        }
      ],
      "hint": "Where did the bones come from?",
      "sourceNote": "Adult bearded vultures eat animal remains, mainly bones. A bone is part of an animal. These are supplied species facts, not an observation made in this game.",
      "reference": {
        "title": "Bearded Vulture",
        "publisher": "Vulture Conservation Foundation",
        "url": "https://4vultures.org/vultures/bearded-vulture/"
      },
      "art": {
        "kind": "vulture",
        "version": 1,
        "description": "Adult bearded vulture with long wings, a wedge-shaped tail and dark feathers beside its beak."
      }
    },
    {
      "id": "fox",
      "name": "Red fox",
      "scientificName": "Vulpes vulpes",
      "foods": [
        {
          "id": "berries",
          "label": "Berries",
          "kind": "plant",
          "art": {
            "kind": "berries",
            "version": 1,
            "description": "Berries"
          }
        },
        {
          "id": "beetles",
          "label": "Beetles",
          "kind": "animal",
          "art": {
            "kind": "beetles",
            "version": 1,
            "description": "Beetle"
          }
        },
        {
          "id": "mice",
          "label": "Mice",
          "kind": "animal",
          "art": {
            "kind": "mice",
            "version": 1,
            "description": "Mice"
          }
        }
      ],
      "usualDiet": "Red foxes eat plant and animal foods. Berries, beetles and mice are examples.",
      "basketId": "omnivore",
      "guided": [],
      "feedback": [
        {
          "basketId": "herbivore",
          "outcome": "other",
          "code": "fox-herbivore",
          "text": "Berries are plant food, but beetles and mice are animals. The source includes both."
        },
        {
          "basketId": "carnivore",
          "outcome": "other",
          "code": "fox-carnivore",
          "text": "Beetles and mice are animals, but berries are plant food. Use all the food clues."
        },
        {
          "basketId": "omnivore",
          "outcome": "fits",
          "code": "fox-omnivore",
          "text": "Berries are plant food; beetles and mice are animals. Omnivore fits this fox's diet."
        }
      ],
      "hint": "Find a plant food and an animal food.",
      "sourceNote": "Red foxes eat plant and animal foods. Berries, beetles and mice are examples. These are supplied species facts, not an observation made in this game.",
      "reference": {
        "title": "Red Fox",
        "publisher": "NPS",
        "url": "https://www.nps.gov/cwdw/learn/nature/red-fox.htm"
      },
      "art": {
        "kind": "fox",
        "version": 1,
        "description": "Red fox with pointed ears, a narrow muzzle and a bushy tail."
      }
    },
    {
      "id": "badger",
      "name": "European badger",
      "scientificName": "Meles meles",
      "foods": [
        {
          "id": "earthworms",
          "label": "Earthworms",
          "kind": "animal",
          "art": {
            "kind": "earthworms",
            "version": 1,
            "description": "Earthworm"
          }
        },
        {
          "id": "fruit",
          "label": "Fruit",
          "kind": "plant",
          "art": {
            "kind": "fruit",
            "version": 1,
            "description": "Fruit"
          }
        }
      ],
      "usualDiet": "European badgers eat plant and animal foods. Earthworms and fruit are examples.",
      "basketId": "omnivore",
      "guided": [],
      "feedback": [
        {
          "basketId": "herbivore",
          "outcome": "other",
          "code": "badger-herbivore",
          "text": "Fruit is plant food, but earthworms are animals. The source includes both."
        },
        {
          "basketId": "carnivore",
          "outcome": "other",
          "code": "badger-carnivore",
          "text": "Earthworms are animals, but fruit is plant food. Use both food clues."
        },
        {
          "basketId": "omnivore",
          "outcome": "fits",
          "code": "badger-omnivore",
          "text": "Fruit is plant food and earthworms are animals. Omnivore fits this badger's diet."
        }
      ],
      "hint": "A fruit grows on a plant. What is an earthworm?",
      "sourceNote": "European badgers eat plant and animal foods. Earthworms and fruit are examples. These are supplied species facts, not an observation made in this game.",
      "reference": {
        "title": "European badger",
        "publisher": "Wildlife Trusts",
        "url": "https://www.wildlifetrusts.org/wildlife-explorer/mammals/european-badger"
      },
      "art": {
        "kind": "badger",
        "version": 1,
        "description": "European badger with a low broad body and black-and-white face stripes."
      }
    },
    {
      "id": "hen",
      "name": "Domestic hen",
      "scientificName": "Gallus gallus domesticus",
      "foods": [
        {
          "id": "seeds",
          "label": "Seeds",
          "kind": "plant",
          "art": {
            "kind": "seeds",
            "version": 1,
            "description": "Seeds"
          }
        },
        {
          "id": "insects",
          "label": "Insects",
          "kind": "animal",
          "art": {
            "kind": "insects",
            "version": 1,
            "description": "Small insects"
          }
        }
      ],
      "usualDiet": "Domestic hens eat plant and animal foods. Seeds and insects are examples. A hen is an adult female chicken.",
      "basketId": "omnivore",
      "guided": [],
      "feedback": [
        {
          "basketId": "herbivore",
          "outcome": "other",
          "code": "hen-herbivore",
          "text": "Seeds are plant food, but insects are animals. The source includes both."
        },
        {
          "basketId": "carnivore",
          "outcome": "other",
          "code": "hen-carnivore",
          "text": "Insects are animals, but seeds are plant food. Use both food clues."
        },
        {
          "basketId": "omnivore",
          "outcome": "fits",
          "code": "hen-omnivore",
          "text": "Seeds are plant food and insects are animals. Omnivore fits this hen's diet."
        }
      ],
      "hint": "Insects are animals, even when they are very small.",
      "sourceNote": "Domestic hens eat plant and animal foods. Seeds and insects are examples. A hen is an adult female chicken. These are supplied species facts, not an observation made in this game.",
      "reference": {
        "title": "Domestic Chicken",
        "publisher": "Emirates Park Zoo",
        "url": "https://emiratesparkzooandresort.com/animals/domestic-chicken/"
      },
      "art": {
        "kind": "hen",
        "version": 1,
        "description": "Domestic hen with a short beak, wings and two scaly legs."
      }
    },
    {
      "id": "boar",
      "name": "Wild boar",
      "scientificName": "Sus scrofa",
      "foods": [
        {
          "id": "acorns",
          "label": "Acorns",
          "kind": "plant",
          "art": {
            "kind": "acorns",
            "version": 1,
            "description": "Acorns"
          }
        },
        {
          "id": "roots",
          "label": "Roots",
          "kind": "plant",
          "art": {
            "kind": "roots",
            "version": 1,
            "description": "Roots"
          }
        },
        {
          "id": "earthworms",
          "label": "Earthworms",
          "kind": "animal",
          "art": {
            "kind": "earthworms",
            "version": 1,
            "description": "Earthworm"
          }
        }
      ],
      "usualDiet": "Wild boar eat plant and animal foods. Acorns, roots and earthworms are examples.",
      "basketId": "omnivore",
      "guided": [],
      "feedback": [
        {
          "basketId": "herbivore",
          "outcome": "other",
          "code": "boar-herbivore",
          "text": "Acorns and roots are plant foods, but earthworms are animals. The source includes both."
        },
        {
          "basketId": "carnivore",
          "outcome": "other",
          "code": "boar-carnivore",
          "text": "Earthworms are animals, but acorns and roots are plant foods. Use all the clues."
        },
        {
          "basketId": "omnivore",
          "outcome": "fits",
          "code": "boar-omnivore",
          "text": "Acorns and roots are plant foods; earthworms are animals. Omnivore fits this boar's diet."
        }
      ],
      "hint": "Look for the food that is not part of a plant.",
      "sourceNote": "Wild boar eat plant and animal foods. Acorns, roots and earthworms are examples. These are supplied species facts, not an observation made in this game.",
      "reference": {
        "title": "Wild boar",
        "publisher": "Parc Animalier Sainte-Croix",
        "url": "https://parcsaintecroix.com/en/animals/wild-boar"
      },
      "art": {
        "kind": "boar",
        "version": 1,
        "description": "Wild boar with a bristly body, a long snout and short tusks."
      }
    },
    {
      "id": "magpie",
      "name": "Eurasian magpie",
      "scientificName": "Pica pica",
      "foods": [
        {
          "id": "seeds",
          "label": "Seeds",
          "kind": "plant",
          "art": {
            "kind": "seeds",
            "version": 1,
            "description": "Seeds"
          }
        },
        {
          "id": "fruit",
          "label": "Fruit",
          "kind": "plant",
          "art": {
            "kind": "fruit",
            "version": 1,
            "description": "Fruit"
          }
        },
        {
          "id": "beetles",
          "label": "Beetles",
          "kind": "animal",
          "art": {
            "kind": "beetles",
            "version": 1,
            "description": "Beetle"
          }
        }
      ],
      "usualDiet": "Eurasian magpies eat plant and animal foods. Seeds, fruit and beetles are examples.",
      "basketId": "omnivore",
      "guided": [],
      "feedback": [
        {
          "basketId": "herbivore",
          "outcome": "other",
          "code": "magpie-herbivore",
          "text": "Seeds and fruit are plant foods, but beetles are animals. The source includes both."
        },
        {
          "basketId": "carnivore",
          "outcome": "other",
          "code": "magpie-carnivore",
          "text": "Beetles are animals, but seeds and fruit are plant foods. Use all the clues."
        },
        {
          "basketId": "omnivore",
          "outcome": "fits",
          "code": "magpie-omnivore",
          "text": "Seeds and fruit are plant foods; beetles are animals. Omnivore fits this magpie's diet."
        }
      ],
      "hint": "Beetles count as animals. Seeds and fruit come from plants.",
      "sourceNote": "Eurasian magpies eat plant and animal foods. Seeds, fruit and beetles are examples. These are supplied species facts, not an observation made in this game.",
      "reference": {
        "title": "Eurasian Magpie Life History",
        "publisher": "Cornell Lab of Ornithology",
        "url": "https://blog.allaboutbirds.org/guide/Eurasian_Magpie/lifehistory"
      },
      "art": {
        "kind": "magpie",
        "version": 1,
        "description": "Eurasian magpie with black-and-white feathers and a long tail."
      }
    }
  ],
  "contrasts": [
    {
      "id": "large-small",
      "title": "Big and tiny",
      "animalIds": [
        "elephant",
        "shrew"
      ],
      "prompt": "What do these food clues tell us?",
      "options": [
        {
          "id": "a",
          "text": "The elephant eats plant foods; the shrew eats animals. Food decides their groups.",
          "outcome": "fits",
          "code": "large-small-a",
          "feedback": "Leaves, grass and bark are plant foods. Beetles and earthworms are animals. The big one is a herbivore; the tiny one is a carnivore."
        },
        {
          "id": "b",
          "text": "The big elephant is a carnivore; the tiny shrew is a herbivore. Size decides their groups.",
          "outcome": "other",
          "code": "large-small-b",
          "feedback": "Size gives the opposite answer here. Use the elephant's plants and the shrew's animal foods."
        },
        {
          "id": "c",
          "text": "We cannot group either animal until we watch one of its meals.",
          "outcome": "other",
          "code": "large-small-c",
          "feedback": "We have supplied information about their diets already. We can use that source here; we are not pretending we watched a meal."
        }
      ],
      "hint": "Which statement uses leaves, grass, bark, beetles and earthworms?"
    },
    {
      "id": "teeth-food",
      "title": "Teeth and foods",
      "animalIds": [
        "beaver",
        "heron"
      ],
      "prompt": "Which reason fits these food clues?",
      "options": [
        {
          "id": "a",
          "text": "The beaver has big teeth, so it belongs with the animal-eating heron.",
          "outcome": "other",
          "code": "teeth-food-a",
          "feedback": "The beaver's bark, twigs and water plants are plant foods. Big teeth do not put it with an animal-eater."
        },
        {
          "id": "b",
          "text": "We cannot group the beaver until we inspect all of its teeth.",
          "outcome": "other",
          "code": "teeth-food-b",
          "feedback": "The supplied diet note already describes plant foods. We can use the foods without a tooth inspection."
        },
        {
          "id": "c",
          "text": "The beaver eats plant foods; the heron eats animals. Their foods give different groups.",
          "outcome": "fits",
          "code": "teeth-food-c",
          "feedback": "Bark, twigs and water plants support herbivore for the beaver. Fish and frogs support carnivore for the heron."
        }
      ],
      "hint": "Compare bark and twigs with fish and frogs."
    },
    {
      "id": "hunter-scavenger",
      "title": "Hunting is not the rule",
      "animalIds": [
        "vulture",
        "owl"
      ],
      "prompt": "Can these animals share a food group?",
      "options": [
        {
          "id": "a",
          "text": "Only the owl is a carnivore, because a carnivore must hunt its own food.",
          "outcome": "other",
          "code": "hunter-scavenger-a",
          "feedback": "A carnivore eats animal foods. It does not have to hunt them. The vulture eats animal remains."
        },
        {
          "id": "b",
          "text": "Both are carnivores: the owl eats small animals and the vulture eats animal remains.",
          "outcome": "fits",
          "code": "hunter-scavenger-b",
          "feedback": "Mice, voles and bones of dead animals all supply animal material. A hunter and a scavenger can share this group."
        },
        {
          "id": "c",
          "text": "We cannot group the vulture because dead bones tell us nothing about food.",
          "outcome": "other",
          "code": "hunter-scavenger-c",
          "feedback": "The source says the vulture eats those bones. Bones are animal remains, so this is useful food evidence."
        }
      ],
      "hint": "Does animal food have to be alive when it is eaten?"
    },
    {
      "id": "different-omnivores",
      "title": "Two kinds of both",
      "animalIds": [
        "fox",
        "ladybird"
      ],
      "prompt": "Which idea uses all the food clues?",
      "options": [
        {
          "id": "a",
          "text": "Both are omnivores: foxes eat berries and animals; these ladybirds eat aphids and can also eat pollen.",
          "outcome": "fits",
          "code": "different-omnivores-a",
          "feedback": "Berries and pollen are plant foods; mice, beetles and aphids are animals. The animals look very different, but both records include plant and animal foods."
        },
        {
          "id": "b",
          "text": "The fox is a carnivore and the tiny ladybird is a herbivore. Their looks tell us enough.",
          "outcome": "other",
          "code": "different-omnivores-b",
          "feedback": "Looks miss foods here. The fox eats berries too, and the ladybird hunts aphids as well as eating pollen."
        },
        {
          "id": "c",
          "text": "We cannot call the ladybird an omnivore until its plant and animal foods are equal amounts.",
          "outcome": "other",
          "code": "different-omnivores-c",
          "feedback": "An omnivore does not need equal amounts. This record includes aphids and pollen without claiming how much pollen a wild ladybird eats."
        }
      ],
      "hint": "Both kinds of food can count without being equal amounts."
    }
  ],
  "helpers": {
    "teaching": [
      {
        "animalIds": [
          "rabbit"
        ],
        "text": "The rabbit eats plant foods, so the rabbit goes in Herbivore."
      },
      {
        "animalIds": [
          "owl"
        ],
        "text": "The barn owl eats animal foods, so the barn owl goes in Carnivore."
      },
      {
        "animalIds": [
          "fox"
        ],
        "text": "The red fox eats plant and animal foods, so the red fox goes in Omnivore."
      }
    ],
    "workedExample": {
      "animalId": "fox",
      "steps": [
        "1. Berries come from plants.",
        "2. Mice are animals.",
        "3. This source includes both. Red fox: Omnivore. Now return to the food clues in your waiting case."
      ]
    },
    "glossary": [
      {
        "term": "Diet",
        "text": "The foods an animal eats. Here we use information about its usual foods, not just one meal."
      },
      {
        "term": "Aphid",
        "text": "A tiny insect. Insects are animals."
      },
      {
        "term": "Vole",
        "text": "A small furry animal with a short tail."
      },
      {
        "term": "Scavenger",
        "text": "An animal that eats animal remains. It does not need to kill that animal."
      }
    ]
  }
};
export const feedingBoardCopy = {
  "title": "The Feeding Board",
  "invitation": "Who eats plants? Who eats animals? Who eats both? Make a board from the food clues.",
  "boundary": "This board is about what animals eat. It never asks what you eat.",
  "source label": "Supplied science examples",
  "persistent qualifier": "These pictures show examples of foods these animals eat, not one meal or every food. The groups describe their diets.",
  "scale label": "Pictures are not to scale.",
  "before start": "Notes keep your first check, your latest retry, and how many checks you made. They do not keep every try. Your first check stays in your notes when you try again.",
  "buttons tabs": "Start a board** · **Animal baskets** · **Looks and food** · **Previous animal** · **Next animal** · **Previous idea** · **Next idea** · **Check this basket** · **Check this idea** · **Download our notes",
  "current instruction": "Look at the animal's foods. Choose a basket. Then check.",
  "herbivore": "Herbivore · plants",
  "carnivore": "Carnivore · animals",
  "omnivore": "Omnivore · plants and animals",
  "basket key": "A herbivore mainly eats plant foods. A carnivore mainly eats animal foods, including animal remains. An omnivore eats plant and animal foods. Both does not mean equal amounts or both at every meal.",
  "food heading": "Food examples",
  "source heading": "About this food clue",
  "board heading": "Your basket board",
  "waiting heading": "Waiting",
  "preview labels": "Trying here · not checked** · **Checked here** · **Earlier check",
  "draft status labels": "Not checked yet** · **Changed since check** · **Checked here",
  "preview status": "Trying {animal} in {basket}. This has not been checked.",
  "draft explanation before first choice": "Moving an animal keeps your arrangement. Check records an answer. You can move it again.",
  "committed status": "Your checked basket: {basket}.",
  "no selection": "Choose a basket before checking.",
  "no idea selection": "Choose an idea before checking.",
  "check heading": "Your basket and the food clue",
  "idea feedback heading": "Your idea and the food clues",
  "recorded choice": "You chose: {literal supplied basket or idea text}",
  "retry invitation": "Your animal stays where you put it. You can choose another basket and check again.",
  "idea retry invitation": "You can choose another idea and check again.",
  "visible optional reason operation on every animal": "Point to the foods. Tell a grown-up: “I chose ___ because it eats ___.” You can say it in your own words.",
  "grown up note beside that invitation": "Listen for a food-based reason. Nothing spoken is recorded or marked by the game.",
  "no check": "No check recorded",
  "guided rabbit label": "Guided example",
  "guided rabbit lines": "1. Clover and grass are plant foods.** / **2. Look for the basket for plant-eaters. You can try it, then check.",
  "tab instruction": "Two animals, two food clues. Choose the idea that uses the foods.",
  "prompt": "Which idea uses all the food clues?",
  "a fits": "Both are omnivores: foxes eat berries and animals; these ladybirds eat aphids and can also eat pollen.** Feedback: **Berries and pollen are plant foods; mice, beetles and aphids are animals. The animals look very different, but both records include plant and animal foods.",
  "b other appearance": "The fox is a carnivore and the tiny ladybird is a herbivore. Their looks tell us enough.** Feedback: **Looks miss foods here. The fox eats berries too, and the ladybird hunts aphids as well as eating pollen.",
  "c other underclaim": "We cannot call the ladybird an omnivore until its plant and animal foods are equal amounts.** Feedback: **An omnivore does not need equal amounts. This record includes aphids and pollen without claiming how much pollen a wild ladybird eats.",
  "clue": "Both kinds of food can count without being equal amounts.",
  "a other appearance": "The beaver has big teeth, so it belongs with the animal-eating heron.** Feedback: **The beaver's bark, twigs and water plants are plant foods. Big teeth do not put it with an animal-eater.",
  "b other underclaim": "We cannot group the beaver until we inspect all of its teeth.** Feedback: **The supplied diet note already describes plant foods. We can use the foods without a tooth inspection.",
  "c fits": "The beaver eats plant foods; the heron eats animals. Their foods give different groups.** Feedback: **Bark, twigs and water plants support herbivore for the beaver. Fish and frogs support carnivore for the heron.",
  "a other hunting": "Only the owl is a carnivore, because a carnivore must hunt its own food.** Feedback: **A carnivore eats animal foods. It does not have to hunt them. The vulture eats animal remains.",
  "b fits": "Both are carnivores: the owl eats small animals and the vulture eats animal remains.** Feedback: **Mice, voles and bones of dead animals all supply animal material. A hunter and a scavenger can share this group.",
  "controls": "Try the idea** · **Clue** · **Another example** · **Source** · **Word help** · **Hear** · **Working together** · **Skip for now** · **Back to my animal** · **Back to my idea** · **Previous step** · **Next step** · **Close this example** · **Close this source",
  "together explanation": "Choose Working together if a grown-up is helping with this case. This is a report from you, not a test.",
  "teaching title": "Food decides the group",
  "1 rabbit clover picture basket supplied": "The rabbit eats plant foods, so the rabbit goes in Herbivore.",
  "2 barn owl mouse picture basket supplied": "The barn owl eats animal foods, so the barn owl goes in Carnivore.",
  "3 red fox berries and mouse picture basket supplied": "The red fox eats plant and animal foods, so the red fox goes in Omnivore.",
  "teaching footer": "These are worked examples. You can return to your own choice at any step.",
  "different worked example heading": "Try a fox example",
  "steps": "1. Berries come from plants.** / **2. Mice are animals.** / **3. This source includes both. Red fox: Omnivore. Now return to the food clues in your waiting case.",
  "returning line": "Your board is here. Choose any animal to move it or check again. Your first checks stay in your notes.",
  "bridge control": "Take this food clue to Food Links",
  "bridge heading": "One food clue, another question",
  "missing bridge card": "This board has no readable ladybird card. Food Links is still open.",
  "bridge buttons": "Visit Food Links** · **Return to this board",
  "unsupported root": "Earlier Feeding Board data are retained in your notes. This board cannot be edited in this format. Other places are still open.",
  "unreadable board source": "This board cannot be opened here. Its original stays in your downloadable notes. Other places are still open.",
  "unreadable section case": "This part of the earlier board cannot be changed safely. Its original stays in your notes. Other readable parts are still open.",
  "missing helper": "This earlier example cannot be shown here. Your board is still open, and the original stays in your notes.",
  "unknown art": "The original picture description is shown here. Your earlier answer is retained.",
  "check count cap": "This case cannot keep another check here. Your first check and latest retry stay in your notes, and the other cases are still open.",
  "report safety refusal": "This change could not fit safely in your downloadable notes. Your earlier work stays as it was. Download your notes or visit another place.",
  "save off": "Saving is off. This board stays in this session. Download your notes if you want a copy.",
  "save failure": "This board is in this session, but it could not be saved on this device. Download your notes.",
  "reset explanation in grown up help": "The game's confirmed reset removes this explorer's board records from this device. It does not remove another explorer's work or files you already downloaded.",
  "qualifier": "These pictures show examples of foods these animals eat, not one meal or every food. The groups describe their diets.",
  "artCredit": "Original labelled drawing for this board.",
  "scale": "Pictures are not to scale.",
  "beforeStart": "Notes keep your first check, your latest retry, and how many checks you made. They do not keep every try. Your first check stays in your notes when you try again.",
  "instruction": "Look at the animal's foods. Choose a basket. Then check.",
  "basketKey": "A herbivore mainly eats plant foods. A carnivore mainly eats animal foods, including animal remains. An omnivore eats plant and animal foods. Both does not mean equal amounts or both at every meal.",
  "reason": "Point to the foods. Tell a grown-up: “I chose ___ because it eats ___.” You can say it in your own words.",
  "reasonNote": "Listen for a food-based reason. Nothing spoken is recorded or marked by the game.",
  "returning": "Your board is here. Choose any animal to move it or check again. Your first checks stay in your notes.",
  "unsupported": "Earlier Feeding Board data are retained in your notes. This board cannot be edited in this format. Other places are still open.",
  "unreadable": "This board cannot be opened here. Its original stays in your downloadable notes. Other places are still open.",
  "unreadableCase": "This part of the earlier board cannot be changed safely. Its original stays in your notes. Other readable parts are still open.",
  "missingHelper": "This earlier example cannot be shown here. Your board is still open, and the original stays in your notes.",
  "unknownArt": "The original picture description is shown here. Your earlier answer is retained.",
  "countCap": "This case cannot keep another check here. Your first check and latest retry stay in your notes, and the other cases are still open.",
  "reportRefusal": "This change could not fit safely in your downloadable notes. Your earlier work stays as it was. Download your notes or visit another place.",
  "saveOff": "Saving is off. This board stays in this session. Download your notes if you want a copy.",
  "saveFailure": "This board is in this session, but it could not be saved on this device. Download your notes.",
  "bridgeText": "Your board's food clue is shown here. Food Links pictures a seven-spot ladybird larva, a young stage. It asks who can feed whom. One possible feeding link does not describe an animal's whole diet. Here we group animals using food records. There we can look at a feeding link.",
  "missingBridge": "This board has no readable ladybird card. Food Links is still open.",
  "grownup": [
    "This is a supplied-evidence science board. The animal names and foods are given. The first rabbit is guided; optional teaching, help, source rereading, requested narration, working together, feedback and familiar cases are recorded separately. A fitting basket or idea is a response to this task. It does not show independent reading, animal identification, dietary expertise, an explanation in the child's own words, or mastery.",
    "Invite a reason: “Which foods helped you decide?” Listen for plants, animals or both, using a food on the card. For an omnivore, invite a plant food and an animal food. Speaking, pointing, a grown-up reading, and leaving the question open are all welcome. Spoken words are not recorded, scored or automatically interpreted.",
    "These three groups simplify usual diets. The cards do not list every food, show one observed meal, give equal portions or claim that an animal never eats anything else. The seven-spot ladybird hunts aphids and can also eat pollen; the source does not measure how often wild ladybirds eat pollen. Bones are animal remains. Carnivore does not mean the animal must hunt.",
    "The drawings are labelled examples, not a field-identification test. This board does not teach food energy, complete food chains, habitat engineering, teeth functions or family nutrition. It never asks what your child eats and gives no animal-care or feeding instructions.",
    "Work stays in the current explorer's local notebook. There is no typed answer, child recording, upload or automatic sharing. Downloaded notes contain saved ungraded basket and idea choices, actual first checks, latest retries, check counts, supplied sources and support reports, not every intermediate try. Existing reset and transfer controls apply."
  ]
};
