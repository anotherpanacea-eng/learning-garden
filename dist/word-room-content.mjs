// Original adult-read Prop Box projection of brief55; no recordings or pronunciation model.
// Literal card and shared-text projection: docs/content/320-word-room-text.md.
const ADULT_SUPPLIED_ROLE = 'adult-supplied';
const collection = {
  "id": "theater-props",
  "revision": 1,
  "alphabet": [
    "a",
    "b",
    "c",
    "f",
    "h",
    "i",
    "m",
    "n",
    "o",
    "p",
    "s",
    "t"
  ],
  "words": {
    "mat": {
      "id": "mat",
      "label": "mat",
      "letters": [
        "m",
        "a",
        "t"
      ],
      "textId": "props",
      "meaning": "A mat lies on the floor.",
      "alt": "A small rectangular floor mat has a woven edge.",
      "art": "mat",
      "guidance": "Say mat, then its three sounds from left to right. Let the first sound lead into the vowel. Show a floor mat, not a blanket."
    },
    "sat": {
      "id": "sat",
      "label": "sat",
      "letters": [
        "s",
        "a",
        "t"
      ],
      "textId": "props",
      "meaning": "The puppet sat down.",
      "alt": "Before: a puppet stands. After: it sits on a low stool.",
      "art": "sat",
      "guidance": "Read both pictures together to show the earlier action. Model sat and its three sounds. Compare mat and sat only after both words have been said; their first sounds differ."
    },
    "cat": {
      "id": "cat",
      "label": "cat",
      "letters": [
        "c",
        "a",
        "t"
      ],
      "textId": "props",
      "meaning": "A cat waits by the prop box.",
      "alt": "One cat sits by a wooden box.",
      "art": "cat",
      "guidance": "Say cat naturally, then model its three sounds while pointing. The letter c represents the k sound in this word; that is not a rule for every c."
    },
    "bat": {
      "id": "bat",
      "label": "bat",
      "letters": [
        "b",
        "a",
        "t"
      ],
      "textId": "props",
      "meaning": "This bat is a toy for hitting a ball.",
      "alt": "A toy sporting bat lies next to a ball.",
      "art": "bat",
      "guidance": "Establish the sporting-prop meaning. The animal is another legitimate meaning, not a reading mistake. Model the three sounds without turning the first into a separate buh syllable."
    },
    "fin": {
      "id": "fin",
      "label": "fin",
      "letters": [
        "f",
        "i",
        "n"
      ],
      "textId": "box",
      "meaning": "The toy fish has a fin.",
      "alt": "An outlined fin on the back of a toy fish has a pointing arrow.",
      "art": "fin",
      "guidance": "Indicate the fin rather than the whole fish. Say fin, model its three sounds, then put them together. The picture explains meaning; it does not prove the label was decoded."
    },
    "pin": {
      "id": "pin",
      "label": "pin",
      "letters": [
        "p",
        "i",
        "n"
      ],
      "textId": "box",
      "meaning": "A badge pin is a pretend theater prop.",
      "alt": "A round badge has a pin fitting shown beside its back.",
      "art": "pin",
      "guidance": "Establish the badge-pin meaning from the picture. Say pin and model its three sounds. This is a picture activity, not a request to handle a pin."
    },
    "tin": {
      "id": "tin",
      "label": "tin",
      "letters": [
        "t",
        "i",
        "n"
      ],
      "textId": "box",
      "meaning": "This tin is a small metal box.",
      "alt": "A small silver-colored metal container has a fitted lid.",
      "art": "tin",
      "guidance": "Explain this meaning if tin is unfamiliar. Say tin naturally, then model its three sounds; letter names are a different activity."
    },
    "bin": {
      "id": "bin",
      "label": "bin",
      "letters": [
        "b",
        "i",
        "n"
      ],
      "textId": "box",
      "meaning": "The props go in a storage bin.",
      "alt": "An open storage bin holds a ball and a folded cloth.",
      "art": "bin",
      "guidance": "Establish a storage bin, rather than assuming a waste-bin meaning. Say bin naturally and model its three sounds without adding a separate buh syllable."
    },
    "mop": {
      "id": "mop",
      "label": "mop",
      "letters": [
        "m",
        "o",
        "p"
      ],
      "textId": "puppet",
      "meaning": "This mop cleans a pretend stage.",
      "alt": "A cleaning mop has a long handle and bundled strands.",
      "art": "mop",
      "guidance": "Say mop naturally, model the three sounds, and blend again. A sustained beginning does not mean every consonant can be prolonged in the same way."
    },
    "top": {
      "id": "top",
      "label": "top",
      "letters": [
        "t",
        "o",
        "p"
      ],
      "textId": "puppet",
      "meaning": "This toy is a spinning top.",
      "alt": "A spinning toy has a broad conical body, short stem and pointed base.",
      "art": "top",
      "guidance": "Establish the spinning-toy meaning rather than the highest point. Model top and its three sounds without adding a separate tuh syllable."
    },
    "pop": {
      "id": "pop",
      "label": "pop",
      "letters": [
        "p",
        "o",
        "p"
      ],
      "textId": "puppet",
      "meaning": "A bubble goes pop.",
      "alt": "Before: one whole bubble. After: its outline breaks into short marks.",
      "art": "pop",
      "guidance": "Say the word pop, not a bubble sound effect. Its first and last sound occupy different positions even though the same letter appears twice. Do not add a separate puh syllable."
    },
    "hop": {
      "id": "hop",
      "label": "hop",
      "letters": [
        "h",
        "o",
        "p"
      ],
      "textId": "puppet",
      "meaning": "The puppet makes a little hop.",
      "alt": "Before: a puppet stands on the floor. After: it is just above the floor.",
      "art": "hop",
      "guidance": "Model hop in context, letting its beginning lead into the vowel. Do not demand an isolated breath sound or physical hopping. Keep all three printed positions visible."
    }
  },
  "texts": {
    "props": {
      "id": "props",
      "title": "A place for the props",
      "text": "The cat sat on a mat. A bat is by the mat.",
      "tokens": [
        {
          "text": "The",
          "start": 0,
          "end": 3,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "cat",
          "start": 4,
          "end": 7,
          "role": "target"
        },
        {
          "text": "sat",
          "start": 8,
          "end": 11,
          "role": "target"
        },
        {
          "text": "on",
          "start": 12,
          "end": 14,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "a",
          "start": 15,
          "end": 16,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "mat",
          "start": 17,
          "end": 20,
          "role": "target"
        },
        {
          "text": "A",
          "start": 22,
          "end": 23,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "bat",
          "start": 24,
          "end": 27,
          "role": "target"
        },
        {
          "text": "is",
          "start": 28,
          "end": 30,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "by",
          "start": 31,
          "end": 33,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "the",
          "start": 34,
          "end": 37,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "mat",
          "start": 38,
          "end": 41,
          "role": "target"
        }
      ],
      "prompt": "Where is the bat?",
      "art": "scene-props-v1",
      "alt": "A cat sits on a mat. A toy sporting bat is beside the mat."
    },
    "box": {
      "id": "box",
      "title": "The little tin",
      "text": "A pin is in a tin. A toy fish has a fin. The tin and the fish are by the bin.",
      "tokens": [
        {
          "text": "A",
          "start": 0,
          "end": 1,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "pin",
          "start": 2,
          "end": 5,
          "role": "target"
        },
        {
          "text": "is",
          "start": 6,
          "end": 8,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "in",
          "start": 9,
          "end": 11,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "a",
          "start": 12,
          "end": 13,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "tin",
          "start": 14,
          "end": 17,
          "role": "target"
        },
        {
          "text": "A",
          "start": 19,
          "end": 20,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "toy",
          "start": 21,
          "end": 24,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "fish",
          "start": 25,
          "end": 29,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "has",
          "start": 30,
          "end": 33,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "a",
          "start": 34,
          "end": 35,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "fin",
          "start": 36,
          "end": 39,
          "role": "target"
        },
        {
          "text": "The",
          "start": 41,
          "end": 44,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "tin",
          "start": 45,
          "end": 48,
          "role": "target"
        },
        {
          "text": "and",
          "start": 49,
          "end": 52,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "the",
          "start": 53,
          "end": 56,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "fish",
          "start": 57,
          "end": 61,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "are",
          "start": 62,
          "end": 65,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "by",
          "start": 66,
          "end": 68,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "the",
          "start": 69,
          "end": 72,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "bin",
          "start": 73,
          "end": 76,
          "role": "target"
        }
      ],
      "prompt": "What is in the tin?",
      "art": "scene-box-v1",
      "alt": "A badge pin is in an open tin. A toy fish and the tin sit beside a storage bin."
    },
    "puppet": {
      "id": "puppet",
      "title": "The puppet’s turn",
      "text": "A puppet can hop. A mop and a top wait by the stage. A bubble goes pop.",
      "tokens": [
        {
          "text": "A",
          "start": 0,
          "end": 1,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "puppet",
          "start": 2,
          "end": 8,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "can",
          "start": 9,
          "end": 12,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "hop",
          "start": 13,
          "end": 16,
          "role": "target"
        },
        {
          "text": "A",
          "start": 18,
          "end": 19,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "mop",
          "start": 20,
          "end": 23,
          "role": "target"
        },
        {
          "text": "and",
          "start": 24,
          "end": 27,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "a",
          "start": 28,
          "end": 29,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "top",
          "start": 30,
          "end": 33,
          "role": "target"
        },
        {
          "text": "wait",
          "start": 34,
          "end": 38,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "by",
          "start": 39,
          "end": 41,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "the",
          "start": 42,
          "end": 45,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "stage",
          "start": 46,
          "end": 51,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "A",
          "start": 53,
          "end": 54,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "bubble",
          "start": 55,
          "end": 61,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "goes",
          "start": 62,
          "end": 66,
          "role": ADULT_SUPPLIED_ROLE
        },
        {
          "text": "pop",
          "start": 67,
          "end": 70,
          "role": "target"
        }
      ],
      "prompt": "What can the puppet do?",
      "art": "scene-puppet-v1",
      "alt": "A puppet makes a little hop. A mop and a spinning top stand by the stage. A bubble bursts nearby."
    }
  }
};
export const makeWordRoomSource = () => structuredClone(collection);
