// Original finite common-factor construction and reviewed per-paragraph arithmetic.
export const sharedCases = [
  {
    "id": "library",
    "title": "Library panel",
    "request": "Describe 6x + 9 using one outside factor and two inside terms.",
    "A": 6,
    "B": 9
  },
  {
    "id": "notices",
    "title": "Two useful sides",
    "request": "Find a factorization of 12x + 8. A shared factor can work even when a greater one exists.",
    "A": 12,
    "B": 8
  },
  {
    "id": "covers",
    "title": "Cover panels",
    "request": "Turn 9x + 12 into a product, then expand it to compare.",
    "A": 9,
    "B": 12
  },
  {
    "id": "small",
    "title": "A tempting match",
    "request": "Try a product for 6x + 3. Does it still work when x changes?",
    "A": 6,
    "B": 3
  },
  {
    "id": "coprime",
    "title": "No larger integer side",
    "request": "Explore 7x + 4. What positive integer divides both coefficients?",
    "A": 7,
    "B": 4
  },
  {
    "id": "posters",
    "title": "Poster panels",
    "request": "Give 10x + 15 a shared side. Compare both expanded terms.",
    "A": 10,
    "B": 15
  }
];
const common = {
  "notation": "Here x is a positive length in centimeters. k and b are lengths in centimeters; a counts x-lengths. A factor is a number or expression being multiplied. For Ax + B, A and B are its two coefficients: A multiplies x, and B multiplies 1. The expression gives a numerical area in square centimeters. k(ax + b) means k times everything inside the brackets.",
  "teaching": [
    "Start with 4x + 10. Their positive integer common divisors are 1 and 2. Check: 2 times 2 is 4, and 2 times 5 is 10. Try a side of length 2 centimeters.",
    "Divide both numbers by 2. The other side has numerical length 2x + 5. The proposal is 2(2x + 5).",
    "Expand to check: 2 times 2x is 4x; 2 times 5 is 10. The two terms return: 4x + 10.",
    "At x = 3, 4 times 3 is 12, plus 10 is 22. For the product, 2 times 3 is 6, plus 5 is 11; 2 times 11 is 22. The matching coefficients tell us more: these expressions agree for every positive x in this model."
  ],
  "teachingFacts": [
    [
      [
        2,
        2
      ],
      [
        2,
        5
      ]
    ],
    [
      [
        2,
        2
      ],
      [
        2,
        5
      ]
    ],
    [
      [
        2,
        2
      ],
      [
        2,
        5
      ]
    ],
    [
      [
        4,
        3
      ],
      [
        2,
        3
      ],
      [
        2,
        11
      ]
    ]
  ],
  "contrasts": [
    "A valid factor need not be the greatest. 18x + 12 = 2(9x + 6), and 18x + 12 = 6(3x + 2). Both factorizations work. Inside the first brackets, 9 and 6 still share 3. Divide inside: 9 divided by 3 is 3; 6 divided by 3 is 2. Move that factor outside: 2 times 3 is 6. Inside the new brackets, 3 and 2 share only 1, so the outside factor cannot grow. 6 is the greatest positive integer that divides both 18 and 12.",
    "One matching value is not enough. Compare 6x + 3 with 3(x + 2). At x = 1, both are 9. At x = 2, they are 15 and 12. Expanding gives 3x + 6, whose coefficients differ from 6x + 3."
  ],
  "contrastFacts": [
    [
      [
        2,
        9
      ],
      [
        2,
        6
      ],
      [
        6,
        3
      ],
      [
        6,
        2
      ],
      [
        3,
        3
      ],
      [
        3,
        2
      ],
      [
        2,
        3
      ]
    ],
    [
      [
        6,
        1
      ],
      [
        3,
        3
      ],
      [
        6,
        2
      ],
      [
        3,
        4
      ],
      [
        3,
        2
      ],
      [
        3,
        1
      ]
    ]
  ],
  "referenceIntro": "A shared side must multiply every inside term. Expand both terms to check your proposal.",
  "example": {
    "A": 4,
    "B": 10,
    "k": 2,
    "a": 2,
    "b": 5,
    "x": 3
  }
};
export const sharedCopy = {
  "label": "Shared Side",
  "entry": "Factor an expression: turn two area terms into one rectangle.",
  "title": "Find a shared side.",
  "story": "The traveling library is planning print panels. Can two area terms describe one rectangle?",
  "instruction": "Choose the outside factor and both terms inside the brackets. You can try an unfinished idea and keep it.",
  "session": "Keep stores a sheet. Changes you have not kept stay only in this visit.",
  "build": "Build",
  "compare": "Compare",
  "learn": "Learn",
  "shelf": "Kept sheets",
  "choose": "Choose",
  "clear": "Clear",
  "back": "Return to Equality Desk",
  "keep": "Keep this sheet",
  "copy": "Copy to Build",
  "reference": "Show a shared-side reference",
  "next": "Read the next step",
  "retry": "Retry this view",
  "notes": "Open Notes",
  "download": "Download Notes",
  "reopen": "Reopen Shared Side",
  "openSheet": "Open this sheet",
  "previousShelf": "Previous shelf page",
  "nextShelf": "Next shelf page",
  "working": "Choose a working draft",
  "sheets": "Shared Side sheets",
  "missing": "Not chosen",
  "formFit": "Both coefficients match. The product expands to the target expression.",
  "formDifferent": "These coefficient pairs differ. Try changing a term, or keep this idea to look at later.",
  "valueFit": "The numerical areas match at this x. Check the coefficients before calling the expressions identical.",
  "valueDifferent": "The numerical areas differ at this x.",
  "smaller": "This product matches. Its outside factor is a common factor; a greater positive integer common factor also exists.",
  "zero": "This region has zero area. It has no width in the drawing.",
  "empty": "Both inside terms are zero, so this proposal has zero area. No positive-width rectangle is drawn.",
  "saved": "Sheet saved. You can reopen it or copy it to try another proposal.",
  "off": "Sheet kept for this session. Saving is off; download Notes to bring it back later.",
  "uncertain": "Sheet kept in this open notebook, but saving could not be confirmed. Download Notes before closing it.",
  "refused": "This sheet could not be kept. Your proposal is still here. Download Notes before making space or trying another notebook.",
  "unreadable": "This earlier sheet is retained in Notes and cannot be edited here. Other readable sheets stay open.",
  "unknown": "Earlier Shared Side work is retained. This version cannot add a sheet to that format. Download Notes or use another activity.",
  "computedRefused": "This calculation could not be shown safely yet. Your choices and requested view are still here. Retry this view or download Notes.",
  "thin": "Very thin drawing — use the dimensions and area table.",
  "stale": "This view has changed. Use Reopen Shared Side to continue."
};
export function makeSharedSource(id='library'){
 const c=sharedCases.find(c=>c.id===id);if(!c)return null;
 return structuredClone({v:1,...c,initialX:4,...common,request:sharedCopy.story+' '+c.request+' '+sharedCopy.instruction});
}
