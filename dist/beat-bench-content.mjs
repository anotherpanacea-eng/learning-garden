// Spec341: original finite printed comparisons; every response is supported.
// No voice or clap count is captured. Content and lexical audit are in docs/content/341 and docs/source-audits/341.
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
export const BEAT_BENCH_SOURCE=freeze({
  "v": 1,
  "id": "beat-bench-1",
  "title": "The Beat Bench",
  "fer": [
    {
      "v": 1,
      "parts": [],
      "steps": [],
      "id": "fer-referring",
      "section": "fer",
      "kind": "choice",
      "title": "Refer and -ing",
      "prompt": "We are referring to the letter. Try a letter card.",
      "guide": "The strong part stays on fer. The r at the join doubles.",
      "contextLabel": "A true thing about language",
      "pictureId": "word-cards",
      "pictureAlt": "An open book beside two printed letter cards.",
      "hint": "Look at the written stress guide. Is the strong part on fer or somewhere else?",
      "example": "In referring, fer stays strong and the r at the join doubles. In reference, the strong part is at the start.",
      "explanation": "Our printed form is referring. The strong part stays on fer. The r at the join doubles.",
      "teach": [
        {
          "id": "card11",
          "title": "When fer stays strong",
          "text": "Read the whole word together. When fer stays strong, r usually doubles at the join. When the strong part moves, the r at the join stays single.",
          "example": "Refer, referring, reference.",
          "steps": [
            "In referring, the strong part is fer.",
            "The r at the join doubles: referring.",
            "In reference, the strong part is at the start. The r at the join stays single."
          ]
        }
      ],
      "choices": [
        {
          "id": "a",
          "text": "refering"
        },
        {
          "id": "b",
          "text": "referring"
        }
      ],
      "key": "b",
      "different": {
        "a": "Look at the r before ing."
      },
      "copy": {
        "incomplete": "Choose a letter card to compare. You can keep this turn unfinished.",
        "partDifferent": "Look at the printed word and the letters at the join."
      },
      "base": "refer",
      "ending": "ing",
      "word": "referring",
      "stress": {
        "start": 2,
        "end": 5,
        "label": "fer",
        "note": "The strong part stays on fer. The r at the join doubles."
      }
    },
    {
      "v": 1,
      "parts": [],
      "steps": [],
      "id": "fer-reference",
      "section": "fer",
      "kind": "choice",
      "title": "Refer and -ence",
      "prompt": "This book is a useful reference. Try a letter card.",
      "guide": "The strong part is at the start. The r at the join stays single.",
      "contextLabel": "A true thing about language",
      "pictureId": "word-cards",
      "pictureAlt": "An open book beside two printed letter cards.",
      "hint": "Look at the written stress guide. Is the strong part on fer or somewhere else?",
      "example": "In referring, fer stays strong and the r at the join doubles. In reference, the strong part is at the start.",
      "explanation": "Our printed form is reference. The strong part is at the start. The r at the join stays single.",
      "teach": [
        {
          "id": "card11",
          "title": "When fer stays strong",
          "text": "Read the whole word together. When fer stays strong, r usually doubles at the join. When the strong part moves, the r at the join stays single.",
          "example": "Refer, referring, reference.",
          "steps": [
            "In referring, the strong part is fer.",
            "The r at the join doubles: referring.",
            "In reference, the strong part is at the start. The r at the join stays single."
          ]
        }
      ],
      "choices": [
        {
          "id": "a",
          "text": "reference"
        },
        {
          "id": "b",
          "text": "referrence"
        }
      ],
      "key": "a",
      "different": {
        "b": "Look at the r before ence."
      },
      "copy": {
        "incomplete": "Choose a letter card to compare. You can keep this turn unfinished.",
        "partDifferent": "Look at the printed word and the letters at the join."
      },
      "base": "refer",
      "ending": "ence",
      "word": "reference",
      "stress": {
        "start": 0,
        "end": 3,
        "label": "at the start",
        "note": "The strong part is at the start. The r at the join stays single."
      }
    },
    {
      "v": 1,
      "parts": [],
      "steps": [],
      "id": "fer-preferred",
      "section": "fer",
      "kind": "choice",
      "title": "Prefer and -ed",
      "prompt": "The librarian preferred the quiet desk. Try a letter card.",
      "guide": "The strong part stays on fer. The r at the join doubles.",
      "contextLabel": "A true thing about language",
      "pictureId": "word-cards",
      "pictureAlt": "An open book beside two printed letter cards.",
      "hint": "Look at the written stress guide. Is the strong part on fer or somewhere else?",
      "example": "In referring, fer stays strong and the r at the join doubles. In reference, the strong part is at the start.",
      "explanation": "Our printed form is preferred. The strong part stays on fer. The r at the join doubles.",
      "teach": [
        {
          "id": "card11",
          "title": "When fer stays strong",
          "text": "Read the whole word together. When fer stays strong, r usually doubles at the join. When the strong part moves, the r at the join stays single.",
          "example": "Refer, referring, reference.",
          "steps": [
            "In referring, the strong part is fer.",
            "The r at the join doubles: referring.",
            "In reference, the strong part is at the start. The r at the join stays single."
          ]
        }
      ],
      "choices": [
        {
          "id": "a",
          "text": "preferred"
        },
        {
          "id": "b",
          "text": "prefered"
        }
      ],
      "key": "a",
      "different": {
        "b": "Look at the r before ed."
      },
      "copy": {
        "incomplete": "Choose a letter card to compare. You can keep this turn unfinished.",
        "partDifferent": "Look at the printed word and the letters at the join."
      },
      "base": "prefer",
      "ending": "ed",
      "word": "preferred",
      "stress": {
        "start": 3,
        "end": 6,
        "label": "fer",
        "note": "The strong part stays on fer. The r at the join doubles."
      }
    },
    {
      "v": 1,
      "parts": [],
      "steps": [],
      "id": "fer-preference",
      "section": "fer",
      "kind": "choice",
      "title": "Prefer and -ence",
      "prompt": "Dot has a preference for blue cloth. Try a letter card.",
      "guide": "The strong part is at the start. The r at the join stays single.",
      "contextLabel": "A true thing about language",
      "pictureId": "word-cards",
      "pictureAlt": "An open book beside two printed letter cards.",
      "hint": "Look at the written stress guide. Is the strong part on fer or somewhere else?",
      "example": "In referring, fer stays strong and the r at the join doubles. In reference, the strong part is at the start.",
      "explanation": "Our printed form is preference. The strong part is at the start. The r at the join stays single.",
      "teach": [
        {
          "id": "card11",
          "title": "When fer stays strong",
          "text": "Read the whole word together. When fer stays strong, r usually doubles at the join. When the strong part moves, the r at the join stays single.",
          "example": "Refer, referring, reference.",
          "steps": [
            "In referring, the strong part is fer.",
            "The r at the join doubles: referring.",
            "In reference, the strong part is at the start. The r at the join stays single."
          ]
        }
      ],
      "choices": [
        {
          "id": "a",
          "text": "preferrence"
        },
        {
          "id": "b",
          "text": "preference"
        }
      ],
      "key": "b",
      "different": {
        "a": "Look at the r before ence."
      },
      "copy": {
        "incomplete": "Choose a letter card to compare. You can keep this turn unfinished.",
        "partDifferent": "Look at the printed word and the letters at the join."
      },
      "base": "prefer",
      "ending": "ence",
      "word": "preference",
      "stress": {
        "start": 0,
        "end": 4,
        "label": "at the start",
        "note": "The strong part is at the start. The r at the join stays single."
      }
    },
    {
      "v": 1,
      "parts": [],
      "steps": [],
      "id": "fer-conferred",
      "section": "fer",
      "kind": "choice",
      "title": "Confer and -ed",
      "prompt": "The librarians conferred about the letter. Try a letter card.",
      "guide": "The strong part stays on fer. The r at the join doubles.",
      "contextLabel": "A true thing about language",
      "pictureId": "word-cards",
      "pictureAlt": "An open book beside two printed letter cards.",
      "hint": "Look at the written stress guide. Is the strong part on fer or somewhere else?",
      "example": "In referring, fer stays strong and the r at the join doubles. In reference, the strong part is at the start.",
      "explanation": "Our printed form is conferred. The strong part stays on fer. The r at the join doubles.",
      "teach": [
        {
          "id": "card11",
          "title": "When fer stays strong",
          "text": "Read the whole word together. When fer stays strong, r usually doubles at the join. When the strong part moves, the r at the join stays single.",
          "example": "Refer, referring, reference.",
          "steps": [
            "In referring, the strong part is fer.",
            "The r at the join doubles: referring.",
            "In reference, the strong part is at the start. The r at the join stays single."
          ]
        }
      ],
      "choices": [
        {
          "id": "a",
          "text": "confered"
        },
        {
          "id": "b",
          "text": "conferred"
        }
      ],
      "key": "b",
      "different": {
        "a": "Look at the r before ed."
      },
      "copy": {
        "incomplete": "Choose a letter card to compare. You can keep this turn unfinished.",
        "partDifferent": "Look at the printed word and the letters at the join."
      },
      "base": "confer",
      "ending": "ed",
      "word": "conferred",
      "stress": {
        "start": 3,
        "end": 6,
        "label": "fer",
        "note": "The strong part stays on fer. The r at the join doubles."
      }
    },
    {
      "v": 1,
      "parts": [],
      "steps": [],
      "id": "fer-referee",
      "section": "fer",
      "kind": "choice",
      "title": "Refer and -ee",
      "prompt": "The referee watched the match. Try a letter card.",
      "guide": "The strongest part is the final ee. The r before ee stays single.",
      "contextLabel": "A true thing about language",
      "pictureId": "word-cards",
      "pictureAlt": "An open book beside two printed letter cards.",
      "hint": "Look at the written stress guide. Is the strong part on fer or somewhere else?",
      "example": "In referring, fer stays strong and the r at the join doubles. In reference, the strong part is at the start.",
      "explanation": "Our printed form is referee. The strongest part is the final ee. The r before ee stays single.",
      "teach": [
        {
          "id": "card11",
          "title": "When fer stays strong",
          "text": "Read the whole word together. When fer stays strong, r usually doubles at the join. When the strong part moves, the r at the join stays single.",
          "example": "Refer, referring, reference.",
          "steps": [
            "In referring, the strong part is fer.",
            "The r at the join doubles: referring.",
            "In reference, the strong part is at the start. The r at the join stays single."
          ]
        }
      ],
      "choices": [
        {
          "id": "a",
          "text": "referee"
        },
        {
          "id": "b",
          "text": "referree"
        }
      ],
      "key": "a",
      "different": {
        "b": "Look at the r before ee."
      },
      "copy": {
        "incomplete": "Choose a letter card to compare. You can keep this turn unfinished.",
        "partDifferent": "Look at the printed word and the letters at the join."
      },
      "base": "refer",
      "ending": "ee",
      "word": "referee",
      "stress": {
        "start": 5,
        "end": 7,
        "label": "final ee",
        "note": "The strongest part is the final ee. The r before ee stays single."
      }
    }
  ],
  "meanings": [
    {
      "v": 1,
      "parts": [],
      "steps": [],
      "id": "meaning-recover",
      "section": "meanings",
      "kind": "choice",
      "title": "recover: which meaning is clearest here?",
      "prompt": "recover: which meaning is clearest here?",
      "guide": "The spelling and picture give a clue. The other spelling in this pair can tell another story.",
      "contextLabel": "A story from Willowbank",
      "pictureId": "returned-book",
      "pictureAlt": "A librarian holds a book that had been lost.",
      "hint": "Look at the hyphen and read the picture note.",
      "example": "Re-sign has re- for again. Resign usually means leave a job.",
      "explanation": "Recover can mean get something back. Here it is the lost book.",
      "teach": [
        {
          "id": "card12",
          "title": "A hyphen can help a reader",
          "text": "A hyphen can make a meaning clear. Re-cover shows cover again. Recover usually means get well or get back. Re-sign shows sign again; resign usually means leave a job.",
          "example": "Dot puts new cloth on a chair.",
          "steps": [
            "Dot will cover the chair again.",
            "Re- can mean again.",
            "Re-cover makes that meaning clear."
          ]
        }
      ],
      "choices": [
        {
          "id": "a",
          "text": "get that book back"
        },
        {
          "id": "b",
          "text": "cover it once more"
        }
      ],
      "key": "a",
      "different": {
        "b": "That meaning is clearer with re-cover."
      },
      "copy": {
        "incomplete": "Choose a meaning to compare. You can keep this turn unfinished.",
        "partDifferent": "Read the picture note and try the other meaning."
      },
      "pairId": "recover",
      "word": "recover"
    },
    {
      "v": 1,
      "parts": [],
      "steps": [],
      "id": "meaning-re-cover",
      "section": "meanings",
      "kind": "choice",
      "title": "re-cover: which meaning is clearest here?",
      "prompt": "re-cover: which meaning is clearest here?",
      "guide": "The spelling and picture give a clue. The other spelling in this pair can tell another story.",
      "contextLabel": "A story from Willowbank",
      "pictureId": "chair-cloth",
      "pictureAlt": "Dot has a chair with torn cloth and a sheet of new fabric.",
      "hint": "Look at the hyphen and read the picture note.",
      "example": "Re-sign has re- for again. Resign usually means leave a job.",
      "explanation": "For cover again, re-cover makes the meaning clear.",
      "teach": [
        {
          "id": "card12",
          "title": "A hyphen can help a reader",
          "text": "A hyphen can make a meaning clear. Re-cover shows cover again. Recover usually means get well or get back. Re-sign shows sign again; resign usually means leave a job.",
          "example": "Dot puts new cloth on a chair.",
          "steps": [
            "Dot will cover the chair again.",
            "Re- can mean again.",
            "Re-cover makes that meaning clear."
          ]
        }
      ],
      "choices": [
        {
          "id": "a",
          "text": "get that book back"
        },
        {
          "id": "b",
          "text": "cover it once more"
        }
      ],
      "key": "b",
      "different": {
        "a": "That meaning is clearer with recover."
      },
      "copy": {
        "incomplete": "Choose a meaning to compare. You can keep this turn unfinished.",
        "partDifferent": "Read the picture note and try the other meaning."
      },
      "pairId": "recover",
      "word": "re-cover"
    },
    {
      "v": 1,
      "parts": [],
      "steps": [],
      "id": "meaning-resign",
      "section": "meanings",
      "kind": "choice",
      "title": "resign: which meaning is clearest here?",
      "prompt": "resign: which meaning is clearest here?",
      "guide": "The spelling and picture give a clue. The other spelling in this pair can tell another story.",
      "contextLabel": "A story from Willowbank",
      "pictureId": "leaving-job",
      "pictureAlt": "A worker hands over a letter and leaves a desk.",
      "hint": "Look at the hyphen and read the picture note.",
      "example": "Re-sign has re- for again. Resign usually means leave a job.",
      "explanation": "Here resign means leave a job.",
      "teach": [
        {
          "id": "card12",
          "title": "A hyphen can help a reader",
          "text": "A hyphen can make a meaning clear. Re-cover shows cover again. Recover usually means get well or get back. Re-sign shows sign again; resign usually means leave a job.",
          "example": "Dot puts new cloth on a chair.",
          "steps": [
            "Dot will cover the chair again.",
            "Re- can mean again.",
            "Re-cover makes that meaning clear."
          ]
        }
      ],
      "choices": [
        {
          "id": "a",
          "text": "sign it again"
        },
        {
          "id": "b",
          "text": "leave the job"
        }
      ],
      "key": "b",
      "different": {
        "a": "That meaning is clearer with re-sign."
      },
      "copy": {
        "incomplete": "Choose a meaning to compare. You can keep this turn unfinished.",
        "partDifferent": "Read the picture note and try the other meaning."
      },
      "pairId": "resign",
      "word": "resign"
    },
    {
      "v": 1,
      "parts": [],
      "steps": [],
      "id": "meaning-re-sign",
      "section": "meanings",
      "kind": "choice",
      "title": "re-sign: which meaning is clearest here?",
      "prompt": "re-sign: which meaning is clearest here?",
      "guide": "The spelling and picture give a clue. The other spelling in this pair can tell another story.",
      "contextLabel": "A story from Willowbank",
      "pictureId": "signature",
      "pictureAlt": "A pen waits beside a paper that will be signed again.",
      "hint": "Look at the hyphen and read the picture note.",
      "example": "Re-sign has re- for again. Resign usually means leave a job.",
      "explanation": "Re-sign makes sign again clear.",
      "teach": [
        {
          "id": "card12",
          "title": "A hyphen can help a reader",
          "text": "A hyphen can make a meaning clear. Re-cover shows cover again. Recover usually means get well or get back. Re-sign shows sign again; resign usually means leave a job.",
          "example": "Dot puts new cloth on a chair.",
          "steps": [
            "Dot will cover the chair again.",
            "Re- can mean again.",
            "Re-cover makes that meaning clear."
          ]
        }
      ],
      "choices": [
        {
          "id": "a",
          "text": "sign it again"
        },
        {
          "id": "b",
          "text": "leave the job"
        }
      ],
      "key": "a",
      "different": {
        "b": "That meaning is clearer with resign."
      },
      "copy": {
        "incomplete": "Choose a meaning to compare. You can keep this turn unfinished.",
        "partDifferent": "Read the picture note and try the other meaning."
      },
      "pairId": "resign",
      "word": "re-sign"
    },
    {
      "v": 1,
      "parts": [],
      "steps": [],
      "id": "meaning-coop",
      "section": "meanings",
      "kind": "choice",
      "title": "coop: which meaning is clearest here?",
      "prompt": "coop: which meaning is clearest here?",
      "guide": "The spelling and picture give a clue. The other spelling in this pair can tell another story.",
      "contextLabel": "A story from Willowbank",
      "pictureId": "hen-house",
      "pictureAlt": "Hens stand beside a small wooden house.",
      "hint": "Look at the hyphen and read the picture note.",
      "example": "Re-sign has re- for again. Resign usually means leave a job.",
      "explanation": "A coop can be a home for hens.",
      "teach": [
        {
          "id": "card12",
          "title": "A hyphen can help a reader",
          "text": "A hyphen can make a meaning clear. Re-cover shows cover again. Recover usually means get well or get back. Re-sign shows sign again; resign usually means leave a job.",
          "example": "Dot puts new cloth on a chair.",
          "steps": [
            "Dot will cover the chair again.",
            "Re- can mean again.",
            "Re-cover makes that meaning clear."
          ]
        }
      ],
      "choices": [
        {
          "id": "a",
          "text": "a house for a hen"
        },
        {
          "id": "b",
          "text": "a shop we all own"
        }
      ],
      "key": "a",
      "different": {
        "b": "That meaning is clearer with co-op."
      },
      "copy": {
        "incomplete": "Choose a meaning to compare. You can keep this turn unfinished.",
        "partDifferent": "Read the picture note and try the other meaning."
      },
      "pairId": "coop",
      "word": "coop"
    },
    {
      "v": 1,
      "parts": [],
      "steps": [],
      "id": "meaning-co-op",
      "section": "meanings",
      "kind": "choice",
      "title": "co-op: which meaning is clearest here?",
      "prompt": "co-op: which meaning is clearest here?",
      "guide": "The spelling and picture give a clue. The other spelling in this pair can tell another story.",
      "contextLabel": "A story from Willowbank",
      "pictureId": "shared-shop",
      "pictureAlt": "The members stand outside the shop they own together.",
      "hint": "Look at the hyphen and read the picture note.",
      "example": "Re-sign has re- for again. Resign usually means leave a job.",
      "explanation": "This co-op is a shop its members own together.",
      "teach": [
        {
          "id": "card12",
          "title": "A hyphen can help a reader",
          "text": "A hyphen can make a meaning clear. Re-cover shows cover again. Recover usually means get well or get back. Re-sign shows sign again; resign usually means leave a job.",
          "example": "Dot puts new cloth on a chair.",
          "steps": [
            "Dot will cover the chair again.",
            "Re- can mean again.",
            "Re-cover makes that meaning clear."
          ]
        }
      ],
      "choices": [
        {
          "id": "a",
          "text": "a house for a hen"
        },
        {
          "id": "b",
          "text": "a shop we all own"
        }
      ],
      "key": "b",
      "different": {
        "a": "That meaning is clearer with coop."
      },
      "copy": {
        "incomplete": "Choose a meaning to compare. You can keep this turn unfinished.",
        "partDifferent": "Read the picture note and try the other meaning."
      },
      "pairId": "coop",
      "word": "co-op"
    }
  ],
  "jobs": [
    {
      "v": 1,
      "parts": [],
      "steps": [
        "Read preferring together.",
        "The strong part is fer.",
        "The r at the join doubles."
      ],
      "id": "C1",
      "section": "practice",
      "kind": "choice",
      "title": "Prefer and -ing",
      "prompt": "Prefer plus -ing. The strong part stays on fer. Which spelling?",
      "guide": "Read the whole word with someone. The stress clue is already printed here.",
      "contextLabel": "A true thing about language",
      "pictureId": "word-cards",
      "pictureAlt": "An open book beside printed letter cards.",
      "hint": "Look at fer in the written stress guide.",
      "example": "Read referring and reference together. The written guide shows where the strong part is.",
      "explanation": "The strong part stays on fer, so r doubles at the join: preferring.",
      "teach": [
        {
          "id": "card11",
          "title": "When fer stays strong",
          "text": "Read the whole word together. When fer stays strong, r usually doubles at the join. When the strong part moves, the r at the join stays single.",
          "example": "Refer, referring, reference.",
          "steps": [
            "In referring, the strong part is fer.",
            "The r at the join doubles: referring.",
            "In reference, the strong part is at the start. The r at the join stays single."
          ]
        }
      ],
      "choices": [
        {
          "id": "a",
          "text": "prefering"
        },
        {
          "id": "b",
          "text": "preferring"
        },
        {
          "id": "c",
          "text": "preffering"
        }
      ],
      "key": "b",
      "different": {
        "a": "The strong part stays on fer. The r at the join doubles.",
        "c": "Double r at the join, not f."
      },
      "copy": {
        "incomplete": "Choose before comparing. You can keep an unfinished version.",
        "partDifferent": "Read the clue, then try another choice."
      }
    },
    {
      "v": 1,
      "parts": [],
      "steps": [],
      "id": "C2",
      "section": "practice",
      "kind": "choice",
      "title": "Prefer and -ence",
      "prompt": "Prefer plus -ence. The strong part moves to the start. Which spelling?",
      "guide": "The stress clue is printed here. Look at the ending as well.",
      "contextLabel": "A true thing about language",
      "pictureId": "word-cards",
      "pictureAlt": "An open book beside printed letter cards.",
      "hint": "In this word, the strong part is at the start.",
      "example": "Read referring and reference together. The written guide shows where the strong part is.",
      "explanation": "The r at the join stays single. The ending is -ence: preference.",
      "teach": [
        {
          "id": "card11",
          "title": "When fer stays strong",
          "text": "Read the whole word together. When fer stays strong, r usually doubles at the join. When the strong part moves, the r at the join stays single.",
          "example": "Refer, referring, reference.",
          "steps": [
            "In referring, the strong part is fer.",
            "The r at the join doubles: referring.",
            "In reference, the strong part is at the start. The r at the join stays single."
          ]
        }
      ],
      "choices": [
        {
          "id": "a",
          "text": "preference"
        },
        {
          "id": "b",
          "text": "preferrence"
        },
        {
          "id": "c",
          "text": "preferance"
        }
      ],
      "key": "a",
      "different": {
        "b": "The strong part moved. Keep a single r at the join.",
        "c": "The ending here is -ence, as in reference."
      },
      "copy": {
        "incomplete": "Choose before comparing. You can keep an unfinished version.",
        "partDifferent": "Read the clue, then try another choice."
      }
    },
    {
      "v": 1,
      "parts": [],
      "steps": [],
      "id": "C3",
      "section": "practice",
      "kind": "choice",
      "title": "New cloth for Dot",
      "prompt": "Dot puts new cloth over the chair. Which spelling makes cover again clearest?",
      "guide": "Read for the meaning the notice should make clear.",
      "contextLabel": "A story from Willowbank",
      "pictureId": "chair-cloth",
      "pictureAlt": "Dot has a chair with torn cloth and a sheet of new fabric.",
      "hint": "Which spelling shows re- joined with cover?",
      "example": "Re-sign makes sign again clear. Now look at the meaning in Dot's notice.",
      "explanation": "For cover again, re-cover makes the meaning clear.",
      "teach": [
        {
          "id": "card12",
          "title": "A hyphen can help a reader",
          "text": "A hyphen can make a meaning clear. Re-cover shows cover again. Recover usually means get well or get back. Re-sign shows sign again; resign usually means leave a job.",
          "example": "Dot puts new cloth on a chair.",
          "steps": [
            "Dot will cover the chair again.",
            "Re- can mean again.",
            "Re-cover makes that meaning clear."
          ]
        }
      ],
      "choices": [
        {
          "id": "a",
          "text": "recover"
        },
        {
          "id": "b",
          "text": "re cover"
        },
        {
          "id": "c",
          "text": "re-cover"
        }
      ],
      "key": "c",
      "different": {
        "a": "Recover can mean get well or get back. Here the hyphen makes cover again clear.",
        "b": "The hyphen joins re- and cover and makes again clear."
      },
      "copy": {
        "incomplete": "Choose before comparing. You can keep an unfinished version.",
        "partDifferent": "Read the clue, then try another choice."
      }
    },
    {
      "v": 1,
      "parts": [],
      "steps": [],
      "id": "C4",
      "section": "practice",
      "kind": "choice",
      "title": "A parcel at the library",
      "prompt": "The library can ___ a parcel. Which spelling uses the ee-after-c clue?",
      "guide": "These examples spell ee after c with ei.",
      "contextLabel": "A story from Willowbank",
      "pictureId": "parcel",
      "pictureAlt": "A parcel arrives at the library desk.",
      "hint": "Think of ceiling and deceive.",
      "example": "Ceiling has c, then ei for ee. Now look at the letters in your word.",
      "explanation": "In receive, ee after c is spelled ei, as in ceiling.",
      "teach": [
        {
          "id": "card13",
          "title": "A clue for ie and ei",
          "text": "When i and e spell ee, try ie; after c, try ei. Some words need a separate memory: seize and protein.",
          "example": "Receipt.",
          "steps": [
            "In receipt, the ee sound comes after c.",
            "The letters for that sound are ei.",
            "Receipt has a quiet p too. That is a different clue."
          ]
        }
      ],
      "choices": [
        {
          "id": "a",
          "text": "recieve"
        },
        {
          "id": "b",
          "text": "receive"
        },
        {
          "id": "c",
          "text": "receeve"
        }
      ],
      "key": "b",
      "different": {
        "a": "In receive, the letters after c are ei.",
        "c": "The ee in these examples is spelled ei after c."
      },
      "copy": {
        "incomplete": "Choose before comparing. You can keep an unfinished version.",
        "partDifferent": "Read the clue, then try another choice."
      }
    },
    {
      "v": 1,
      "parts": [
        {
          "id": "science",
          "text": "Science breaks the ee-after-c clue"
        },
        {
          "id": "seize",
          "text": "Seize has ei, though no c comes before it"
        },
        {
          "id": "rhyme",
          "text": "Though, through and thought all rhyme"
        }
      ],
      "steps": [],
      "id": "C5",
      "section": "practice",
      "kind": "match",
      "title": "Three spelling ideas",
      "prompt": "Read each idea. Is it true or not true in these printed examples?",
      "guide": "The ei-after-c clue here is for ee. Use the letter cards and word families as clues. You can read the words with someone.",
      "contextLabel": "A true thing about language",
      "pictureId": "word-cards",
      "pictureAlt": "Three printed ideas wait beside a book.",
      "hint": "Read the ee condition, then look at the printed word families.",
      "example": "Ceiling fits the ee-after-c clue; science is outside its sound condition.",
      "explanation": "The ee condition matters. Seize needs its own memory, and ough appears in several word families.",
      "teach": [
        {
          "id": "card13",
          "title": "A clue for ie and ei",
          "text": "When i and e spell ee, try ie; after c, try ei. Some words need a separate memory: seize and protein.",
          "example": "Receipt.",
          "steps": [
            "In receipt, the ee sound comes after c.",
            "The letters for that sound are ei.",
            "Receipt has a quiet p too. That is a different clue."
          ]
        },
        {
          "id": "card15",
          "title": "One string, several families",
          "text": "Ough belongs to several sound families. Though, through, thought, tough, cough and bough are printed anchors here. Say the whole words with someone and notice the differences.",
          "example": "The baker mixed dough.",
          "steps": [
            "Dough and though rhyme in this guide.",
            "Their ough letters go together in this wall.",
            "Other ough words belong to other printed families."
          ]
        }
      ],
      "choices": [
        {
          "id": "true",
          "text": "True"
        },
        {
          "id": "not-true",
          "text": "Not true"
        }
      ],
      "key": {
        "science": "not-true",
        "seize": "true",
        "rhyme": "not-true"
      },
      "different": {
        "science": "Science does not have the ee sound in this clue, so it is outside that clue.",
        "seize": "Seize is one of the words to remember separately.",
        "rhyme": "These printed words belong to different ending families."
      },
      "copy": {
        "incomplete": "Choose before comparing. You can keep an unfinished version.",
        "partDifferent": "Read the clue, then try another choice."
      }
    }
  ],
  "cards": [
    {
      "id": "card11",
      "title": "When fer stays strong",
      "text": "Read the whole word together. When fer stays strong, r usually doubles at the join. When the strong part moves, the r at the join stays single.",
      "example": "Refer, referring, reference.",
      "steps": [
        "In referring, the strong part is fer.",
        "The r at the join doubles: referring.",
        "In reference, the strong part is at the start. The r at the join stays single."
      ]
    },
    {
      "id": "card12",
      "title": "A hyphen can help a reader",
      "text": "A hyphen can make a meaning clear. Re-cover shows cover again. Recover usually means get well or get back. Re-sign shows sign again; resign usually means leave a job.",
      "example": "Dot puts new cloth on a chair.",
      "steps": [
        "Dot will cover the chair again.",
        "Re- can mean again.",
        "Re-cover makes that meaning clear."
      ]
    },
    {
      "id": "card13",
      "title": "A clue for ie and ei",
      "text": "When i and e spell ee, try ie; after c, try ei. Some words need a separate memory: seize and protein.",
      "example": "Receipt.",
      "steps": [
        "In receipt, the ee sound comes after c.",
        "The letters for that sound are ei.",
        "Receipt has a quiet p too. That is a different clue."
      ]
    },
    {
      "id": "card15",
      "title": "One string, several families",
      "text": "Ough belongs to several sound families. Though, through, thought, tough, cough and bough are printed anchors here. Say the whole words with someone and notice the differences.",
      "example": "The baker mixed dough.",
      "steps": [
        "Dough and though rhyme in this guide.",
        "Their ough letters go together in this wall.",
        "Other ough words belong to other printed families."
      ]
    }
  ],
  "lookalikes": [
    {
      "id": "offering",
      "word": "offer",
      "form": "offering",
      "note": "The strong part is at the start. The r at the join stays single in offering; the ff in offer stays."
    },
    {
      "id": "suffering",
      "word": "suffer",
      "form": "suffering",
      "note": "The strong part is at the start. The r at the join stays single in suffering; the ff in suffer stays."
    }
  ],
  "letters": [
    {
      "id": "receive",
      "word": "receive",
      "sentence": "The library can receive a parcel.",
      "pair": {
        "start": 3,
        "end": 5
      },
      "note": "In receive, the ee after c is spelled ei."
    },
    {
      "id": "ceiling",
      "word": "ceiling",
      "sentence": "The library has a high ceiling.",
      "pair": {
        "start": 1,
        "end": 3
      },
      "note": "Ceiling has c, then ei for ee."
    },
    {
      "id": "deceive",
      "word": "deceive",
      "sentence": "A disguise might deceive someone.",
      "pair": {
        "start": 3,
        "end": 5
      },
      "note": "Deceive has c, then ei for ee."
    },
    {
      "id": "receipt",
      "word": "receipt",
      "sentence": "Keep the receipt for the cloth.",
      "pair": {
        "start": 3,
        "end": 5
      },
      "note": "Receipt has c, then ei for ee. Its p is quiet."
    },
    {
      "id": "seize",
      "word": "seize",
      "sentence": "Seize the chance to read a new book.",
      "pair": {
        "start": 1,
        "end": 3
      },
      "note": "Seize has ei for ee without c before it. Remember it separately."
    },
    {
      "id": "protein",
      "word": "protein",
      "sentence": "Beans can give us protein.",
      "pair": {
        "start": 4,
        "end": 6
      },
      "note": "Protein has ei without c before it. Remember the letters, and say the word naturally."
    },
    {
      "id": "science",
      "word": "science",
      "sentence": "The science book is on the shelf.",
      "pair": {
        "start": 2,
        "end": 4
      },
      "note": "Science has ie after c, but it does not have the ee sound in this clue."
    },
    {
      "id": "field",
      "word": "field",
      "sentence": "A path crosses the field.",
      "pair": {
        "start": 1,
        "end": 3
      },
      "note": "Field is an ie example for ee."
    }
  ],
  "wall": {
    "v": 1,
    "id": "beat-ough-wall-1",
    "title": "The ough wall",
    "trays": [
      {
        "id": "though",
        "label": "Like though",
        "description": "Try though and dough together."
      },
      {
        "id": "through",
        "label": "Like through",
        "description": "Use through as this group's anchor."
      },
      {
        "id": "thought",
        "label": "Like thought",
        "description": "Try thought and bought together."
      },
      {
        "id": "tough",
        "label": "Like tough",
        "description": "Try tough and rough together."
      },
      {
        "id": "cough",
        "label": "Like cough",
        "description": "Use cough as this group's anchor."
      },
      {
        "id": "bough",
        "label": "Like bough",
        "description": "Use bough as this group's anchor."
      }
    ],
    "words": [
      {
        "id": "though",
        "text": "though",
        "sentence": "The library opened, though it was raining.",
        "clues": [
          {
            "trayId": "though",
            "note": "Though is this printed group's anchor."
          }
        ]
      },
      {
        "id": "dough",
        "text": "dough",
        "sentence": "The baker mixed the dough.",
        "clues": [
          {
            "trayId": "though",
            "note": "Dough and though rhyme in this printed guide."
          }
        ]
      },
      {
        "id": "through",
        "text": "through",
        "sentence": "Light shines through the window.",
        "clues": [
          {
            "trayId": "through",
            "note": "Through is this printed group's anchor."
          }
        ]
      },
      {
        "id": "thought",
        "text": "thought",
        "sentence": "Dot thought about the new cloth.",
        "clues": [
          {
            "trayId": "thought",
            "note": "Thought is this printed group's anchor."
          }
        ]
      },
      {
        "id": "bought",
        "text": "bought",
        "sentence": "The librarian bought a book.",
        "clues": [
          {
            "trayId": "thought",
            "note": "Bought and thought rhyme in this printed guide."
          }
        ]
      },
      {
        "id": "tough",
        "text": "tough",
        "sentence": "The rope is tough.",
        "clues": [
          {
            "trayId": "tough",
            "note": "Tough is this printed group's anchor."
          }
        ]
      },
      {
        "id": "rough",
        "text": "rough",
        "sentence": "The path is rough.",
        "clues": [
          {
            "trayId": "tough",
            "note": "Rough and tough rhyme in this printed guide."
          }
        ]
      },
      {
        "id": "cough",
        "text": "cough",
        "sentence": "A cough interrupted the reading.",
        "clues": [
          {
            "trayId": "cough",
            "note": "Cough is this printed group's anchor."
          }
        ]
      },
      {
        "id": "bough",
        "text": "bough",
        "sentence": "A bough stretches over the path.",
        "clues": [
          {
            "trayId": "bough",
            "note": "Bough is this printed group's anchor."
          }
        ]
      }
    ],
    "copy": {
      "incomplete": "Some cards are not placed yet. Keep this arrangement or try another group.",
      "discussion": "Some choices use another idea. Talk about your groups, or try another arrangement.",
      "listedSummary": "These placements follow the printed groups. You can still try another arrangement.",
      "partialIncomplete": "In the readable part, some cards are not placed yet. Earlier material stays in Notes.",
      "partialDiscussion": "In the readable part, some choices use another idea. Earlier material stays in Notes.",
      "partialListed": "The readable placements follow printed groups. Earlier material stays in Notes.",
      "partial": "This shows the readable part of your earlier wall. Nothing has been removed from Notes.",
      "listed": "A listed family in this collection.",
      "discuss": "This uses another group. What connection did you notice?",
      "unplaced": "This card is not placed yet."
    },
    "help": {
      "hint": "Say an anchor and your word together. The printed note is another clue.",
      "example": "Dough and though can stand together in this collection. Both words are ready to read with someone."
    }
  },
  "story": {
    "hook": "The librarian is writing to the library downriver. Dot brings a chair needing new cloth.",
    "short": "The librarian opened a reference book beside a new letter. Dot carried in a chair. “Can we put new cloth on this?” Dot asked. “We can re-cover it,” said the librarian. “That hyphen helps our reader.” The letter and the chair could both have a fresh start.",
    "longer": "A new letter waited on the library desk, ready for the library downriver. The librarian preferred a quiet moment to check it. Dot arrived with a chair and folded cloth. “The chair can stay,” said Dot. “The cloth needs changing.” The librarian wrote re-cover on a paper tag. “Recover might make a reader think we are getting something back. This hyphen makes our meaning clear.” Then the librarian set two word cards beside the letter. Some words kept their strong part; some shifted it. There was time to say them together, try a letter card, and think again.",
    "note": "A story from Willowbank. This is the librarian's new letter, not a Keeper page. Spoken words may have different numbers of claps. The app compares printed choices."
  },
  "offscreen": {
    "text": "Make a paper library notice with someone. Choose a meaning, write a word or phrase, and check it in a dictionary. If a hyphen helps the reader, try it. Keep your own writing on paper."
  },
  "grownup": "These activities offer US printed spellings, meaning contrasts and anchor word families. Every response is supported by supplied forms and guides. Adult-led saying and clapping are optional and are not captured, counted or judged. Natural pronunciations vary; reference, preference and protein need no fixed clap count. The stress highlights mark letters on a printed guide, not universal syllable boundaries. The wall compares placements with its own finite notes and never scores a voice. Cases and wall work can be kept unfinished or revised; original writing remains on paper. Phonics recordings follow their separate production, rights and listening review, with General American selected as a reference. This slice records no pronunciation, independent spelling, dictation or full-topic attainment."
});
export const makeBeatBenchSource=()=>structuredClone(BEAT_BENCH_SOURCE);
