#403 · Sentence Spotlight: complete finite material

Status: proposed for independent grammar and specification review. All activity words below are original. No learner data.

The shared copy, six-step lesson, separate Niko miniature, six constructive briefs and two contrast questions are the full first release. The planned UI renders slots in stored order, joins chosen phrase text with spaces, capitalizes the first Unicode letter for sentence display and appends one period. Phrase-bank labels keep their authored case. A missing slot is a labelled blank, never a word silently supplied from the key. No inflected form is generated.

```json
{
  "copy": {
    "label": "Sentence Spotlight",
    "invitation": "The same event can begin with a different person or thing. Move the sentence pieces and see what comes into view.",
    "prompt": "Choose a place in the sentence, then a phrase. Read the whole sentence before comparing.",
    "original": "Starting sentence",
    "draft": "Your sentence",
    "empty": "Choose a phrase for each space.",
    "waiting": "This space is waiting.",
    "clear": "Clear this space",
    "check": "Compare with this brief",
    "notice": "These are sentences we wrote about an imaginary town. Grammar describes the wording; it does not prove an event happened.",
    "comparison": "One prepared version for this brief",
    "support": "Words and phrases are provided. Try your own version aloud or on paper with a person.",
    "returnPrompt": "Return to another brief, or find two ways to describe an event together. What stays the same? What comes first? Is the doer still named?",
    "grownup": "This finite construction uses prepared phrase banks and exact requested versions. A different construction may be grammatical yet not meet this brief; the comparison is not a general grammar checker. Keeping or checking a draft does not establish independent writing, reading or mastery. A person reads original sentences. Passive voice does not prove concealment, blame, objectivity or truth. Not every sentence has an object; this small set uses selected action clauses. Historical phrases and kept choices retain their own source.",
    "unavailable": "This earlier draft has no usable sentence spotlight here. Its phrases, choices and kept work stay unchanged in Notes."
  },
  "teach": [
    "In these action sentences, find who or what acts and what the action affects. In “Pip carried the basket,” Pip acts and the basket is carried.",
    "An active version starts with its subject: “Pip carried the basket.” A passive version makes the basket its subject: “The basket was carried by Pip.” Both name the same action and doer here.",
    "For this passive version, use a form of be with a past participle: was carried. By Pip keeps the doer. The passive subject receives the action in these examples.",
    "Keep time and number: carried becomes was carried; wash becomes are washed for plural bowls; is sorting becomes are being sorted for plural letters.",
    "A passive can leave the doer unnamed. That does not tell us who did it or why the writer left them out. The word was alone does not make a passive: “The café was busy” describes a state.",
    "Choose wording for the reader. Beginning with the basket puts it first; naming Pip keeps the doer available. Either voice can be useful, and neither proves a statement true."
  ],
  "demo": {
    "original": "Niko delivered the lanterns.",
    "steps": [
      "Find Niko, who delivered, and the lanterns, which were delivered.",
      "Start with the lanterns: The lanterns.",
      "Keep the past action and plural subject: were delivered.",
      "Keep the known doer: by Niko. The lanterns were delivered by Niko."
    ],
    "contrast": "The lanterns were delivered. This still names the past action but no longer names the doer. It does not say nobody delivered them."
  },
  "tasks": [
    {
      "v": 1,
      "id": "voice-basket",
      "family": "voice-basket",
      "kind": "sort",
      "bench": "voice",
      "title": "Bring the basket into view",
      "reader": "Start with the basket. Keep the past action and name Pip as the doer.",
      "prompt": "Choose a place in the sentence, then a phrase. Read the whole sentence before comparing.",
      "teach": [
        "In these action sentences, find who or what acts and what the action affects. In “Pip carried the basket,” Pip acts and the basket is carried.",
        "An active version starts with its subject: “Pip carried the basket.” A passive version makes the basket its subject: “The basket was carried by Pip.” Both name the same action and doer here.",
        "For this passive version, use a form of be with a past participle: was carried. By Pip keeps the doer. The passive subject receives the action in these examples.",
        "Keep time and number: carried becomes was carried; wash becomes are washed for plural bowls; is sorting becomes are being sorted for plural letters.",
        "A passive can leave the doer unnamed. That does not tell us who did it or why the writer left them out. The word was alone does not make a passive: “The café was busy” describes a state.",
        "Choose wording for the reader. Beginning with the basket puts it first; naming Pip keeps the doer available. Either voice can be useful, and neither proves a statement true."
      ],
      "parts": [
        {
          "id": "start",
          "text": "Start"
        },
        {
          "id": "verb",
          "text": "Verb phrase"
        },
        {
          "id": "finish",
          "text": "Finish"
        }
      ],
      "choices": [
        {
          "id": "pip",
          "text": "Pip"
        },
        {
          "id": "past",
          "text": "was carried"
        },
        {
          "id": "basket",
          "text": "the basket"
        },
        {
          "id": "by-pip",
          "text": "by Pip"
        },
        {
          "id": "carry",
          "text": "carried"
        },
        {
          "id": "now",
          "text": "is carried"
        }
      ],
      "key": {
        "start": "basket",
        "verb": "past",
        "finish": "by-pip"
      },
      "feedback": {
        "fit": "The basket was carried by Pip. This passive starts with the basket, keeps the past action and names Pip.",
        "different": {
          "start": "Compare this place with the requested version. Another arrangement may make a sentence but change its focus, tense, doer or meaning.",
          "verb": "Compare this place with the requested version. Another arrangement may make a sentence but change its focus, tense, doer or meaning.",
          "finish": "Compare this place with the requested version. Another arrangement may make a sentence but change its focus, tense, doer or meaning."
        },
        "general": "Read the whole sentence and this brief. These prepared comparisons are not a general grammar checker."
      },
      "hint": "Keep the same action and time. Find what the brief asks you to put first and whether to name the doer.",
      "example": "Niko delivered the lanterns. The lanterns were delivered by Niko. Both name the same past action and doer.",
      "spotlight": {
        "v": 1,
        "slots": [
          "start",
          "verb",
          "finish"
        ],
        "original": "Pip carried the basket.",
        "context": "A visitor asks what happened to the picnic basket.",
        "agent": "Pip",
        "affected": "the basket",
        "action": "carried",
        "demo": {
          "original": "Niko delivered the lanterns.",
          "steps": [
            "Find Niko, who delivered, and the lanterns, which were delivered.",
            "Start with the lanterns: The lanterns.",
            "Keep the past action and plural subject: were delivered.",
            "Keep the known doer: by Niko. The lanterns were delivered by Niko."
          ],
          "contrast": "The lanterns were delivered. This still names the past action but no longer names the doer. It does not say nobody delivered them."
        }
      }
    },
    {
      "v": 1,
      "id": "voice-bowls",
      "family": "voice-bowls",
      "kind": "sort",
      "bench": "voice",
      "title": "Bowls on the washing board",
      "reader": "Start with the bowls. Keep the present action and name the kittens.",
      "prompt": "Choose a place in the sentence, then a phrase. Read the whole sentence before comparing.",
      "teach": [
        "In these action sentences, find who or what acts and what the action affects. In “Pip carried the basket,” Pip acts and the basket is carried.",
        "An active version starts with its subject: “Pip carried the basket.” A passive version makes the basket its subject: “The basket was carried by Pip.” Both name the same action and doer here.",
        "For this passive version, use a form of be with a past participle: was carried. By Pip keeps the doer. The passive subject receives the action in these examples.",
        "Keep time and number: carried becomes was carried; wash becomes are washed for plural bowls; is sorting becomes are being sorted for plural letters.",
        "A passive can leave the doer unnamed. That does not tell us who did it or why the writer left them out. The word was alone does not make a passive: “The café was busy” describes a state.",
        "Choose wording for the reader. Beginning with the basket puts it first; naming Pip keeps the doer available. Either voice can be useful, and neither proves a statement true."
      ],
      "parts": [
        {
          "id": "start",
          "text": "Start"
        },
        {
          "id": "verb",
          "text": "Verb phrase"
        },
        {
          "id": "finish",
          "text": "Finish"
        }
      ],
      "choices": [
        {
          "id": "kittens",
          "text": "the kittens"
        },
        {
          "id": "singular",
          "text": "is washed"
        },
        {
          "id": "by-kittens",
          "text": "by the kittens"
        },
        {
          "id": "bowls",
          "text": "the bowls"
        },
        {
          "id": "plural",
          "text": "are washed"
        },
        {
          "id": "wash",
          "text": "wash"
        }
      ],
      "key": {
        "start": "bowls",
        "verb": "plural",
        "finish": "by-kittens"
      },
      "feedback": {
        "fit": "The bowls are washed by the kittens. Bowls is plural, so this version uses are, not is. It keeps the present action.",
        "different": {
          "start": "Compare this place with the requested version. Another arrangement may make a sentence but change its focus, tense, doer or meaning.",
          "verb": "Compare this place with the requested version. Another arrangement may make a sentence but change its focus, tense, doer or meaning.",
          "finish": "Compare this place with the requested version. Another arrangement may make a sentence but change its focus, tense, doer or meaning."
        },
        "general": "Read the whole sentence and this brief. These prepared comparisons are not a general grammar checker."
      },
      "hint": "Keep the same action and time. Find what the brief asks you to put first and whether to name the doer.",
      "example": "Niko delivered the lanterns. The lanterns were delivered by Niko. Both name the same past action and doer.",
      "spotlight": {
        "v": 1,
        "slots": [
          "start",
          "verb",
          "finish"
        ],
        "original": "The kittens wash the bowls.",
        "context": "The café washing board describes the usual washing job.",
        "agent": "the kittens",
        "affected": "the bowls",
        "action": "wash",
        "demo": {
          "original": "Niko delivered the lanterns.",
          "steps": [
            "Find Niko, who delivered, and the lanterns, which were delivered.",
            "Start with the lanterns: The lanterns.",
            "Keep the past action and plural subject: were delivered.",
            "Keep the known doer: by Niko. The lanterns were delivered by Niko."
          ],
          "contrast": "The lanterns were delivered. This still names the past action but no longer names the doer. It does not say nobody delivered them."
        }
      }
    },
    {
      "v": 1,
      "id": "voice-bell",
      "family": "voice-bell",
      "kind": "sort",
      "bench": "voice",
      "title": "Who rang the bell?",
      "reader": "Start with Dot and keep the same past action. Finish by naming what she rang.",
      "prompt": "Choose a place in the sentence, then a phrase. Read the whole sentence before comparing.",
      "teach": [
        "In these action sentences, find who or what acts and what the action affects. In “Pip carried the basket,” Pip acts and the basket is carried.",
        "An active version starts with its subject: “Pip carried the basket.” A passive version makes the basket its subject: “The basket was carried by Pip.” Both name the same action and doer here.",
        "For this passive version, use a form of be with a past participle: was carried. By Pip keeps the doer. The passive subject receives the action in these examples.",
        "Keep time and number: carried becomes was carried; wash becomes are washed for plural bowls; is sorting becomes are being sorted for plural letters.",
        "A passive can leave the doer unnamed. That does not tell us who did it or why the writer left them out. The word was alone does not make a passive: “The café was busy” describes a state.",
        "Choose wording for the reader. Beginning with the basket puts it first; naming Pip keeps the doer available. Either voice can be useful, and neither proves a statement true."
      ],
      "parts": [
        {
          "id": "start",
          "text": "Start"
        },
        {
          "id": "verb",
          "text": "Verb phrase"
        },
        {
          "id": "finish",
          "text": "Finish"
        }
      ],
      "choices": [
        {
          "id": "bell",
          "text": "the bell"
        },
        {
          "id": "dot",
          "text": "Dot"
        },
        {
          "id": "rung",
          "text": "was rung"
        },
        {
          "id": "rang",
          "text": "rang"
        },
        {
          "id": "by-dot",
          "text": "by Dot"
        },
        {
          "id": "rings",
          "text": "rings"
        }
      ],
      "key": {
        "start": "dot",
        "verb": "rang",
        "finish": "bell"
      },
      "feedback": {
        "fit": "Dot rang the bell. This active version puts the doer first. Rang keeps the past time; rings would change it.",
        "different": {
          "start": "Compare this place with the requested version. Another arrangement may make a sentence but change its focus, tense, doer or meaning.",
          "verb": "Compare this place with the requested version. Another arrangement may make a sentence but change its focus, tense, doer or meaning.",
          "finish": "Compare this place with the requested version. Another arrangement may make a sentence but change its focus, tense, doer or meaning."
        },
        "general": "Read the whole sentence and this brief. These prepared comparisons are not a general grammar checker."
      },
      "hint": "Keep the same action and time. Find what the brief asks you to put first and whether to name the doer.",
      "example": "Niko delivered the lanterns. The lanterns were delivered by Niko. Both name the same past action and doer.",
      "spotlight": {
        "v": 1,
        "slots": [
          "start",
          "verb",
          "finish"
        ],
        "original": "The bell was rung by Dot.",
        "context": "The courier is asking what Dot did earlier.",
        "agent": "Dot",
        "affected": "the bell",
        "action": "rang",
        "demo": {
          "original": "Niko delivered the lanterns.",
          "steps": [
            "Find Niko, who delivered, and the lanterns, which were delivered.",
            "Start with the lanterns: The lanterns.",
            "Keep the past action and plural subject: were delivered.",
            "Keep the known doer: by Niko. The lanterns were delivered by Niko."
          ],
          "contrast": "The lanterns were delivered. This still names the past action but no longer names the doer. It does not say nobody delivered them."
        }
      }
    },
    {
      "v": 1,
      "id": "voice-letters",
      "family": "voice-letters",
      "kind": "sort",
      "bench": "voice",
      "title": "An action going on now",
      "reader": "Start with the letters. Keep the action going on now and name Dot.",
      "prompt": "Choose a place in the sentence, then a phrase. Read the whole sentence before comparing.",
      "teach": [
        "In these action sentences, find who or what acts and what the action affects. In “Pip carried the basket,” Pip acts and the basket is carried.",
        "An active version starts with its subject: “Pip carried the basket.” A passive version makes the basket its subject: “The basket was carried by Pip.” Both name the same action and doer here.",
        "For this passive version, use a form of be with a past participle: was carried. By Pip keeps the doer. The passive subject receives the action in these examples.",
        "Keep time and number: carried becomes was carried; wash becomes are washed for plural bowls; is sorting becomes are being sorted for plural letters.",
        "A passive can leave the doer unnamed. That does not tell us who did it or why the writer left them out. The word was alone does not make a passive: “The café was busy” describes a state.",
        "Choose wording for the reader. Beginning with the basket puts it first; naming Pip keeps the doer available. Either voice can be useful, and neither proves a statement true."
      ],
      "parts": [
        {
          "id": "start",
          "text": "Start"
        },
        {
          "id": "verb",
          "text": "Verb phrase"
        },
        {
          "id": "finish",
          "text": "Finish"
        }
      ],
      "choices": [
        {
          "id": "letters",
          "text": "the letters"
        },
        {
          "id": "sorted",
          "text": "are sorted"
        },
        {
          "id": "by-dot",
          "text": "by Dot"
        },
        {
          "id": "dot",
          "text": "Dot"
        },
        {
          "id": "ongoing",
          "text": "are being sorted"
        },
        {
          "id": "sort",
          "text": "is sorting"
        }
      ],
      "key": {
        "start": "letters",
        "verb": "ongoing",
        "finish": "by-dot"
      },
      "feedback": {
        "fit": "The letters are being sorted by Dot. Are being sorted keeps the ongoing action and agrees with plural letters.",
        "different": {
          "start": "Compare this place with the requested version. Another arrangement may make a sentence but change its focus, tense, doer or meaning.",
          "verb": "Compare this place with the requested version. Another arrangement may make a sentence but change its focus, tense, doer or meaning.",
          "finish": "Compare this place with the requested version. Another arrangement may make a sentence but change its focus, tense, doer or meaning."
        },
        "general": "Read the whole sentence and this brief. These prepared comparisons are not a general grammar checker."
      },
      "hint": "Keep the same action and time. Find what the brief asks you to put first and whether to name the doer.",
      "example": "Niko delivered the lanterns. The lanterns were delivered by Niko. Both name the same past action and doer.",
      "spotlight": {
        "v": 1,
        "slots": [
          "start",
          "verb",
          "finish"
        ],
        "original": "Dot is sorting the letters.",
        "context": "The post office board describes what is happening right now.",
        "agent": "Dot",
        "affected": "the letters",
        "action": "is sorting",
        "demo": {
          "original": "Niko delivered the lanterns.",
          "steps": [
            "Find Niko, who delivered, and the lanterns, which were delivered.",
            "Start with the lanterns: The lanterns.",
            "Keep the past action and plural subject: were delivered.",
            "Keep the known doer: by Niko. The lanterns were delivered by Niko."
          ],
          "contrast": "The lanterns were delivered. This still names the past action but no longer names the doer. It does not say nobody delivered them."
        }
      }
    },
    {
      "v": 1,
      "id": "voice-parcel",
      "family": "voice-parcel",
      "kind": "sort",
      "bench": "voice",
      "title": "An unnamed mover",
      "reader": "Start with the parcel. Keep the past action and time phrase; leave the doer unnamed.",
      "prompt": "Choose a place in the sentence, then a phrase. Read the whole sentence before comparing.",
      "teach": [
        "In these action sentences, find who or what acts and what the action affects. In “Pip carried the basket,” Pip acts and the basket is carried.",
        "An active version starts with its subject: “Pip carried the basket.” A passive version makes the basket its subject: “The basket was carried by Pip.” Both name the same action and doer here.",
        "For this passive version, use a form of be with a past participle: was carried. By Pip keeps the doer. The passive subject receives the action in these examples.",
        "Keep time and number: carried becomes was carried; wash becomes are washed for plural bowls; is sorting becomes are being sorted for plural letters.",
        "A passive can leave the doer unnamed. That does not tell us who did it or why the writer left them out. The word was alone does not make a passive: “The café was busy” describes a state.",
        "Choose wording for the reader. Beginning with the basket puts it first; naming Pip keeps the doer available. Either voice can be useful, and neither proves a statement true."
      ],
      "parts": [
        {
          "id": "start",
          "text": "Start"
        },
        {
          "id": "verb",
          "text": "Verb phrase"
        },
        {
          "id": "finish",
          "text": "Finish"
        }
      ],
      "choices": [
        {
          "id": "past",
          "text": "was moved"
        },
        {
          "id": "pip",
          "text": "by Pip"
        },
        {
          "id": "parcel",
          "text": "the parcel"
        },
        {
          "id": "time",
          "text": "before dinner"
        },
        {
          "id": "someone",
          "text": "someone"
        },
        {
          "id": "moves",
          "text": "moves"
        }
      ],
      "key": {
        "start": "parcel",
        "verb": "past",
        "finish": "time"
      },
      "feedback": {
        "fit": "The parcel was moved before dinner. The source does not name the mover. This version does not invent Pip or say that nobody moved it.",
        "different": {
          "start": "Compare this place with the requested version. Another arrangement may make a sentence but change its focus, tense, doer or meaning.",
          "verb": "Compare this place with the requested version. Another arrangement may make a sentence but change its focus, tense, doer or meaning.",
          "finish": "Compare this place with the requested version. Another arrangement may make a sentence but change its focus, tense, doer or meaning."
        },
        "general": "Read the whole sentence and this brief. These prepared comparisons are not a general grammar checker."
      },
      "hint": "Keep the same action and time. Find what the brief asks you to put first and whether to name the doer.",
      "example": "Niko delivered the lanterns. The lanterns were delivered by Niko. Both name the same past action and doer.",
      "spotlight": {
        "v": 1,
        "slots": [
          "start",
          "verb",
          "finish"
        ],
        "original": "Someone moved the parcel before dinner.",
        "context": "The story only says someone moved the parcel. It does not identify that person.",
        "agent": "someone, not named",
        "affected": "the parcel",
        "action": "moved",
        "demo": {
          "original": "Niko delivered the lanterns.",
          "steps": [
            "Find Niko, who delivered, and the lanterns, which were delivered.",
            "Start with the lanterns: The lanterns.",
            "Keep the past action and plural subject: were delivered.",
            "Keep the known doer: by Niko. The lanterns were delivered by Niko."
          ],
          "contrast": "The lanterns were delivered. This still names the past action but no longer names the doer. It does not say nobody delivered them."
        }
      }
    },
    {
      "v": 1,
      "id": "voice-wind",
      "family": "voice-wind",
      "kind": "sort",
      "bench": "voice",
      "title": "A doer need not be a person",
      "reader": "Start with wind. Keep the past action and finish by naming what it scattered.",
      "prompt": "Choose a place in the sentence, then a phrase. Read the whole sentence before comparing.",
      "teach": [
        "In these action sentences, find who or what acts and what the action affects. In “Pip carried the basket,” Pip acts and the basket is carried.",
        "An active version starts with its subject: “Pip carried the basket.” A passive version makes the basket its subject: “The basket was carried by Pip.” Both name the same action and doer here.",
        "For this passive version, use a form of be with a past participle: was carried. By Pip keeps the doer. The passive subject receives the action in these examples.",
        "Keep time and number: carried becomes was carried; wash becomes are washed for plural bowls; is sorting becomes are being sorted for plural letters.",
        "A passive can leave the doer unnamed. That does not tell us who did it or why the writer left them out. The word was alone does not make a passive: “The café was busy” describes a state.",
        "Choose wording for the reader. Beginning with the basket puts it first; naming Pip keeps the doer available. Either voice can be useful, and neither proves a statement true."
      ],
      "parts": [
        {
          "id": "start",
          "text": "Start"
        },
        {
          "id": "verb",
          "text": "Verb phrase"
        },
        {
          "id": "finish",
          "text": "Finish"
        }
      ],
      "choices": [
        {
          "id": "seeds",
          "text": "the seeds"
        },
        {
          "id": "wind",
          "text": "wind"
        },
        {
          "id": "passive",
          "text": "were scattered"
        },
        {
          "id": "by-wind",
          "text": "by wind"
        },
        {
          "id": "scattered",
          "text": "scattered"
        },
        {
          "id": "scatter",
          "text": "scatter"
        }
      ],
      "key": {
        "start": "wind",
        "verb": "scattered",
        "finish": "seeds"
      },
      "feedback": {
        "fit": "Wind scattered the seeds. The doer can be wind. This active sentence keeps the past action without claiming the wind intended anything.",
        "different": {
          "start": "Compare this place with the requested version. Another arrangement may make a sentence but change its focus, tense, doer or meaning.",
          "verb": "Compare this place with the requested version. Another arrangement may make a sentence but change its focus, tense, doer or meaning.",
          "finish": "Compare this place with the requested version. Another arrangement may make a sentence but change its focus, tense, doer or meaning."
        },
        "general": "Read the whole sentence and this brief. These prepared comparisons are not a general grammar checker."
      },
      "hint": "Keep the same action and time. Find what the brief asks you to put first and whether to name the doer.",
      "example": "Niko delivered the lanterns. The lanterns were delivered by Niko. Both name the same past action and doer.",
      "spotlight": {
        "v": 1,
        "slots": [
          "start",
          "verb",
          "finish"
        ],
        "original": "The seeds were scattered by wind.",
        "context": "A gardener describes what happened during a gust.",
        "agent": "wind",
        "affected": "the seeds",
        "action": "scattered",
        "demo": {
          "original": "Niko delivered the lanterns.",
          "steps": [
            "Find Niko, who delivered, and the lanterns, which were delivered.",
            "Start with the lanterns: The lanterns.",
            "Keep the past action and plural subject: were delivered.",
            "Keep the known doer: by Niko. The lanterns were delivered by Niko."
          ],
          "contrast": "The lanterns were delivered. This still names the past action but no longer names the doer. It does not say nobody delivered them."
        }
      }
    },
    {
      "v": 1,
      "id": "voice-busy",
      "family": "voice-busy",
      "kind": "choice",
      "bench": "voice",
      "title": "Is was enough?",
      "reader": "For someone inspecting what the wording can tell them.",
      "prompt": "Does was by itself make this a passive action sentence?",
      "teach": [
        "In these action sentences, find who or what acts and what the action affects. In “Pip carried the basket,” Pip acts and the basket is carried.",
        "An active version starts with its subject: “Pip carried the basket.” A passive version makes the basket its subject: “The basket was carried by Pip.” Both name the same action and doer here.",
        "For this passive version, use a form of be with a past participle: was carried. By Pip keeps the doer. The passive subject receives the action in these examples.",
        "Keep time and number: carried becomes was carried; wash becomes are washed for plural bowls; is sorting becomes are being sorted for plural letters.",
        "A passive can leave the doer unnamed. That does not tell us who did it or why the writer left them out. The word was alone does not make a passive: “The café was busy” describes a state.",
        "Choose wording for the reader. Beginning with the basket puts it first; naming Pip keeps the doer available. Either voice can be useful, and neither proves a statement true."
      ],
      "parts": [
        {
          "id": "sentence",
          "text": "The café was busy."
        }
      ],
      "choices": [
        {
          "id": "yes",
          "text": "Yes: every sentence with was is passive."
        },
        {
          "id": "no",
          "text": "No: this sentence describes the café as busy."
        },
        {
          "id": "unknown",
          "text": "We cannot inspect its wording without a witness."
        }
      ],
      "key": "no",
      "feedback": {
        "fit": "No. Busy describes the café. Was alone does not make a passive action sentence.",
        "different": {
          "yes": "A passive action here needs more than was. Compare was carried with was busy.",
          "unknown": "A witness could help check an event. The wording itself is available to inspect."
        },
        "general": "Compare the exact sentence with the question. Grammar does not settle what really happened."
      },
      "hint": "Look at the whole wording, not one word alone.",
      "example": "The café was noisy describes a state. A pie was carried by Dot describes a passive action."
    },
    {
      "v": 1,
      "id": "voice-truth",
      "family": "voice-truth",
      "kind": "choice",
      "bench": "voice",
      "title": "Wording is not proof",
      "reader": "For someone inspecting what the wording can tell them.",
      "prompt": "What can we tell from this sentence alone?",
      "teach": [
        "In these action sentences, find who or what acts and what the action affects. In “Pip carried the basket,” Pip acts and the basket is carried.",
        "An active version starts with its subject: “Pip carried the basket.” A passive version makes the basket its subject: “The basket was carried by Pip.” Both name the same action and doer here.",
        "For this passive version, use a form of be with a past participle: was carried. By Pip keeps the doer. The passive subject receives the action in these examples.",
        "Keep time and number: carried becomes was carried; wash becomes are washed for plural bowls; is sorting becomes are being sorted for plural letters.",
        "A passive can leave the doer unnamed. That does not tell us who did it or why the writer left them out. The word was alone does not make a passive: “The café was busy” describes a state.",
        "Choose wording for the reader. Beginning with the basket puts it first; naming Pip keeps the doer available. Either voice can be useful, and neither proves a statement true."
      ],
      "parts": [
        {
          "id": "sentence",
          "text": "The bridge was repaired by Pip."
        }
      ],
      "choices": [
        {
          "id": "proved",
          "text": "It proves Pip really repaired the bridge."
        },
        {
          "id": "hidden",
          "text": "It hides the doer because it is passive."
        },
        {
          "id": "wording",
          "text": "It names Pip as the doer, but is not proof."
        }
      ],
      "key": "wording",
      "feedback": {
        "fit": "The by phrase names Pip. The passive wording does not prove the event happened and does not hide the named doer.",
        "different": {
          "proved": "A grammatical statement can still be untrue. Evidence is separate from its form.",
          "hidden": "By Pip explicitly names the doer. Passive does not always leave the doer out."
        },
        "general": "Compare the exact sentence with the question. Grammar does not settle what really happened."
      },
      "hint": "Look at the whole wording, not one word alone.",
      "example": "The café was noisy describes a state. A pie was carried by Dot describes a passive action."
    }
  ]
}
```
