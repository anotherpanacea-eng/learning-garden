// Original finite supplied toy cases; source freezes on first lesson open.
export const motionLessons = [
  {
    "id": "arrows",
    "title": "Two arrows, one object",
    "intro": "Read two horizontal forces on the same cart. Right is positive; left is negative.",
    "teach": "Net force = right force − left force, in newtons (N). Equal opposite forces cancel. This toy omits friction and air resistance; vertical forces balance.",
    "meaning": "",
    "teachMeaning": "",
    "items": [
      {
        "id": "net",
        "prompt": "left 6 N, right 2 N. What is the net horizontal force?",
        "meaning": "",
        "choices": [
          {
            "id": "choice-1",
            "text": "+8 N · right",
            "meaning": "",
            "outcome": "different",
            "feedback": "Compare this choice with the supplied evidence and teaching."
          },
          {
            "id": "choice-2",
            "text": "−4 N · left",
            "meaning": "",
            "outcome": "match",
            "feedback": "This fits the supplied case."
          },
          {
            "id": "choice-3",
            "text": "0 N",
            "meaning": "",
            "outcome": "different",
            "feedback": "Compare this choice with the supplied evidence and teaching."
          }
        ],
        "guided": "Left 2 N, right 6 N: 6 − 2 = +4 N, to the right.",
        "hint": "Subtract the leftward magnitude from the rightward magnitude.",
        "example": "Left 4 N, right 4 N: 4 − 4 = 0 N. The forces balance.",
        "guidedMeaning": "",
        "hintMeaning": "",
        "exampleMeaning": ""
      }
    ]
  },
  {
    "id": "balanced",
    "title": "Balanced can still move",
    "intro": "Zero net force describes change in motion, not whether an object is moving.",
    "teach": "With zero net force, velocity does not change: rest stays rest; motion keeps the same speed and direction. Velocity in m/s includes direction. Acceleration in m/s² is velocity change per second.",
    "meaning": "",
    "teachMeaning": "",
    "items": [
      {
        "id": "motion",
        "prompt": "6 N each way; the cart initially moves at −2 m/s. What is its velocity after one second?",
        "meaning": "",
        "choices": [
          {
            "id": "choice-1",
            "text": "−2 m/s · unchanged leftward motion",
            "meaning": "",
            "outcome": "match",
            "feedback": "This fits the supplied case."
          },
          {
            "id": "choice-2",
            "text": "0 m/s · it stops",
            "meaning": "",
            "outcome": "different",
            "feedback": "Compare this choice with the supplied evidence and teaching."
          },
          {
            "id": "choice-3",
            "text": "+2 m/s · it turns right",
            "meaning": "",
            "outcome": "different",
            "feedback": "Compare this choice with the supplied evidence and teaching."
          }
        ],
        "guided": "With 4 N each way and an initial velocity +2 m/s, velocity stays +2 m/s.",
        "hint": "Ask whether velocity changes, not whether the cart moves.",
        "example": "With 2 N each way and initial velocity 0 m/s, the cart remains at rest.",
        "guidedMeaning": "",
        "hintMeaning": "",
        "exampleMeaning": ""
      }
    ]
  },
  {
    "id": "acceleration",
    "title": "A fixed mass changes velocity",
    "intro": "Follow a constant force for exactly one second on a 2 kg cart.",
    "teach": "Acceleration = net force ÷ mass. Here the mass stays 2 kg. Velocity after one second = starting velocity + acceleration × 1 s. A leftward acceleration can slow rightward motion without instantly reversing it.",
    "meaning": "",
    "teachMeaning": "",
    "items": [
      {
        "id": "velocity",
        "prompt": "net force −4 N, mass 2 kg, initial velocity +3 m/s. After one second, what is the velocity?",
        "meaning": "",
        "choices": [
          {
            "id": "choice-1",
            "text": "−1 m/s",
            "meaning": "",
            "outcome": "different",
            "feedback": "Compare this choice with the supplied evidence and teaching."
          },
          {
            "id": "choice-2",
            "text": "+3 m/s",
            "meaning": "",
            "outcome": "different",
            "feedback": "Compare this choice with the supplied evidence and teaching."
          },
          {
            "id": "choice-3",
            "text": "+1 m/s",
            "meaning": "",
            "outcome": "match",
            "feedback": "This fits the supplied case."
          }
        ],
        "guided": "+4 N ÷ 2 kg = +2 m/s². Starting at +1 m/s gives +1 + 2 = +3 m/s after one second.",
        "hint": "−4 N ÷ 2 kg = −2 m/s². Add that one-second change to +3 m/s.",
        "example": "−2 N ÷ 2 kg = −1 m/s². Starting at 0 gives −1 m/s after one second.",
        "guidedMeaning": "",
        "hintMeaning": "",
        "exampleMeaning": ""
      }
    ]
  },
  {
    "id": "collisions",
    "title": "Read collision evidence carefully",
    "intro": "Supplied invented trials: the same 2 kg cart starts at +2 m/s and stops at 0 m/s. Same target and measurement method. These numbers are not real test results.",
    "teach": "Shape change is observed deformation, not a force measurement. For equal mass and equal velocity change, longer stopping time gives a smaller magnitude of average net stopping force: 2 kg × 2 m/s ÷ time. Peak force, injury, durability and real safety are unmeasured.",
    "meaning": "",
    "teachMeaning": "",
    "items": [
      {
        "id": "shape",
        "prompt": "“B changes shape by 3 cm.”",
        "meaning": "",
        "choices": [
          {
            "id": "choice-1",
            "text": "Observation",
            "meaning": "",
            "outcome": "match",
            "feedback": "This fits the supplied case."
          },
          {
            "id": "choice-2",
            "text": "Unsupported claim",
            "meaning": "",
            "outcome": "different",
            "feedback": "Compare this choice with the supplied evidence and teaching."
          },
          {
            "id": "choice-3",
            "text": "Model inference",
            "meaning": "",
            "outcome": "different",
            "feedback": "Compare this choice with the supplied evidence and teaching."
          }
        ],
        "guided": "B takes four times A’s stopping time. Its average net force magnitude is one quarter of A’s; this says nothing about every instant of force.",
        "hint": "Observation reports a measurement. Inference uses a model. Unsupported claims go beyond this evidence.",
        "example": "At the same mass and velocity change, 0.40 s instead of 0.20 s gives half the average force magnitude. Peak force remains unknown.",
        "guidedMeaning": "",
        "hintMeaning": "",
        "exampleMeaning": ""
      },
      {
        "id": "average",
        "prompt": "“B has a smaller magnitude of average net stopping force than A, under these assumptions.”",
        "meaning": "",
        "choices": [
          {
            "id": "choice-1",
            "text": "Unsupported claim",
            "meaning": "",
            "outcome": "different",
            "feedback": "Compare this choice with the supplied evidence and teaching."
          },
          {
            "id": "choice-2",
            "text": "Observation",
            "meaning": "",
            "outcome": "different",
            "feedback": "Compare this choice with the supplied evidence and teaching."
          },
          {
            "id": "choice-3",
            "text": "Model inference",
            "meaning": "",
            "outcome": "match",
            "feedback": "This fits the supplied case."
          }
        ],
        "guided": "B takes four times A’s stopping time. Its average net force magnitude is one quarter of A’s; this says nothing about every instant of force.",
        "hint": "Observation reports a measurement. Inference uses a model. Unsupported claims go beyond this evidence.",
        "example": "At the same mass and velocity change, 0.40 s instead of 0.20 s gives half the average force magnitude. Peak force remains unknown.",
        "guidedMeaning": "",
        "hintMeaning": "",
        "exampleMeaning": ""
      },
      {
        "id": "injury",
        "prompt": "“B prevents every injury.”",
        "meaning": "",
        "choices": [
          {
            "id": "choice-1",
            "text": "Model inference",
            "meaning": "",
            "outcome": "different",
            "feedback": "Compare this choice with the supplied evidence and teaching."
          },
          {
            "id": "choice-2",
            "text": "Unsupported claim",
            "meaning": "",
            "outcome": "match",
            "feedback": "This fits the supplied case."
          },
          {
            "id": "choice-3",
            "text": "Observation",
            "meaning": "",
            "outcome": "different",
            "feedback": "Compare this choice with the supplied evidence and teaching."
          }
        ],
        "guided": "B takes four times A’s stopping time. Its average net force magnitude is one quarter of A’s; this says nothing about every instant of force.",
        "hint": "Observation reports a measurement. Inference uses a model. Unsupported claims go beyond this evidence.",
        "example": "At the same mass and velocity change, 0.40 s instead of 0.20 s gives half the average force magnitude. Peak force remains unknown.",
        "guidedMeaning": "",
        "hintMeaning": "",
        "exampleMeaning": ""
      }
    ],
    "data": [
      {
        "id": "a",
        "name": "Rigid pad A",
        "shape": 0,
        "time": 0.1,
        "cost": 1,
        "depth": 1,
        "average": 40
      },
      {
        "id": "b",
        "name": "Foam B",
        "shape": 3,
        "time": 0.4,
        "cost": 3,
        "depth": 4,
        "average": 10
      },
      {
        "id": "c",
        "name": "Spring C",
        "shape": 2,
        "time": 0.2,
        "cost": 2,
        "depth": 3,
        "average": 20
      }
    ]
  },
  {
    "id": "design",
    "title": "Choose, explain, revise",
    "intro": "Choose within an invented design brief, then reconsider when a requirement changes. No real protective device is approved by this toy.",
    "teach": "First filter the constraints, then compare the average net stopping-force magnitudes among fitting options. These supplied cases cannot establish injury prevention, peak force or real durability.",
    "meaning": "",
    "teachMeaning": "",
    "items": [
      {
        "id": "first",
        "prompt": "Initial brief: cost at most 3 tokens; depth at most 4 cm. Which fitting design has the smallest average net stopping-force magnitude?",
        "meaning": "",
        "choices": [
          {
            "id": "choice-1",
            "text": "Foam B",
            "meaning": "",
            "outcome": "match",
            "feedback": "This fits the supplied case."
          },
          {
            "id": "choice-2",
            "text": "Rigid pad A",
            "meaning": "",
            "outcome": "different",
            "feedback": "Compare this choice with the supplied evidence and teaching."
          },
          {
            "id": "choice-3",
            "text": "Spring C",
            "meaning": "",
            "outcome": "different",
            "feedback": "Compare this choice with the supplied evidence and teaching."
          }
        ],
        "guided": "All three fit the initial limits. B has 10 N average magnitude, A 40 N, C 20 N.",
        "hint": "Filter by both limits before comparing the average force magnitudes.",
        "example": "A cost limit of 1 token admits only A. Being the only fitting option does not mean safest.",
        "guidedMeaning": "",
        "hintMeaning": "",
        "exampleMeaning": ""
      },
      {
        "id": "revised",
        "prompt": "Revised brief: cost at most 3 tokens; depth at most 3 cm. Which fitting design now has the smallest average net stopping-force magnitude?",
        "meaning": "",
        "choices": [
          {
            "id": "choice-1",
            "text": "Rigid pad A",
            "meaning": "",
            "outcome": "different",
            "feedback": "Compare this choice with the supplied evidence and teaching."
          },
          {
            "id": "choice-2",
            "text": "Foam B",
            "meaning": "",
            "outcome": "different",
            "feedback": "Compare this choice with the supplied evidence and teaching."
          },
          {
            "id": "choice-3",
            "text": "Spring C",
            "meaning": "",
            "outcome": "match",
            "feedback": "This fits the supplied case."
          }
        ],
        "guided": "The new depth limit excludes B. Of A and C, C has the smaller average magnitude.",
        "hint": "Check the new depth limit first; the measurements themselves have not changed.",
        "example": "If a brief allowed only 1 cm depth, A alone would fit, without a claim of real safety.",
        "guidedMeaning": "",
        "hintMeaning": "",
        "exampleMeaning": ""
      }
    ],
    "data": [
      {
        "id": "a",
        "name": "Rigid pad A",
        "shape": 0,
        "time": 0.1,
        "cost": 1,
        "depth": 1,
        "average": 40
      },
      {
        "id": "b",
        "name": "Foam B",
        "shape": 3,
        "time": 0.4,
        "cost": 3,
        "depth": 4,
        "average": 10
      },
      {
        "id": "c",
        "name": "Spring C",
        "shape": 2,
        "time": 0.2,
        "cost": 2,
        "depth": 3,
        "average": 20
      }
    ],
    "newMessage": "New requirement: depth at most 3 cm, cost at most 3 tokens. Measurements are unchanged.",
    "writing": "Explain your initial choice and the limits of the evidence. Your own words are human-read and ungraded."
  }
];
