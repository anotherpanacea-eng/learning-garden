#405 · Complete finite Shadow Yard material

Original fictional cases; all measurements in metres. This JSON is the finite review packet, not a learner import format. Expected same-moment heights:3,6,7.5,2. Other cases do not determine a unique height. Runtime dynamic numeric substitutions are specified in405; controls and labels add no unseen solutions.

```json
{
  "copy": {
    "title": "Shadow Yard",
    "entry": "Compare heights and shadows.",
    "opening": "The café wants a new flagpost. Can shadows help us propose a height?",
    "model": "An invented model: level ground, upright posts and, where stated, the same sunny moment. Sunlight is treated as parallel.",
    "task": "Propose a height",
    "choose": "Choose a height",
    "less": "Less by 0.5 m",
    "more": "More by 0.5 m",
    "clear": "Clear my proposal",
    "compare": "Compare triangles",
    "back": "Back to Copy Frame",
    "build": "Back to my proposal",
    "teaching": "Why shadows can help",
    "example": "Show another example",
    "hear": "Hear this page",
    "visit": "Your proposals wait during this visit. Leaving Copy Frame or changing explorer clears them.",
    "incomplete": "Choose a proposed height first. The target picture will use your proposal, not a hidden answer.",
    "match": "These height-to-shadow ratios agree. Under this model’s conditions, your proposed height fits both measurements.",
    "different": "These height-to-shadow ratios differ. Under this model’s conditions, try another height and compare again.",
    "unestablished": "These shadows came from different moments. The same sunlight angle has not been established, so this pair alone cannot determine the post’s height.",
    "zero": "Both shadows have length zero in this overhead-ray model. Height divided by zero is undefined. Any positive post height could fit, so this pair cannot determine one height.",
    "returnPrompt": "Draw two upright posts and their shadows. Explain which conditions you need before using the same height-to-shadow ratio.",
    "given": "Given reference",
    "proposed": "My proposed post",
    "empty": "Choose a height to draw your proposed post.",
    "diagram": "Both pictures use the same length scale. The sloping outlines compare shapes; a proposed slope is not a measured sunlight direction.",
    "grownup": "This is an ideal geometry model, not a measured yard or construction advice. A fitting proposal is not evidence of independent mastery. Ratio checks can add existing help notes for shown multiplication, but the proposals themselves are not saved.",
    "refusal": "That view could not be prepared safely. Your earlier proposal is unchanged. Retry, download your notes, or go back.",
    "sessionOnly": "The pictures can still work during this visit. These help notes are not saved on this device. Ask a grown-up to download your notes if you want to keep them."
  },
  "cases": [
    {
      "id": "flagpost",
      "title": "Café flagpost",
      "A": 1,
      "B": 2,
      "C": 6,
      "condition": "same",
      "context": "One sunny moment. A 1 m stick casts a 2 m shadow. The flagpost’s shadow is 6 m."
    },
    {
      "id": "courtyard",
      "title": "Courtyard pole",
      "A": 2,
      "B": 3,
      "C": 9,
      "condition": "same",
      "context": "One sunny moment. A 2 m reference post casts a 3 m shadow. The courtyard pole’s shadow is 9 m."
    },
    {
      "id": "bridge",
      "title": "Bridge marker",
      "A": 3,
      "B": 2,
      "C": 5,
      "condition": "same",
      "context": "One sunny moment. A 3 m reference post casts a 2 m shadow. The bridge marker’s shadow is 5 m."
    },
    {
      "id": "garden",
      "title": "Garden post",
      "A": 4,
      "B": 6,
      "C": 3,
      "condition": "same",
      "context": "One sunny moment. A 4 m reference post casts a 6 m shadow. The garden post’s shadow is 3 m."
    },
    {
      "id": "moments",
      "title": "Different moments",
      "A": 2,
      "B": 3,
      "C": 9,
      "condition": "different",
      "context": "The 2 m reference post’s 3 m shadow was measured in the morning. The target’s 9 m shadow was measured later."
    },
    {
      "id": "overhead",
      "title": "Overhead rays",
      "A": 1,
      "B": 0,
      "C": 0,
      "condition": "zero",
      "context": "An ideal overhead-ray model. The 1 m reference post and the target post both have zero horizontal shadow length."
    }
  ],
  "teaching": [
    {
      "title": "Two right angles",
      "text": "An upright post meets level ground at a right angle. Its height and a positive shadow form two sides of a right triangle."
    },
    {
      "title": "The same shape",
      "text": "At the same sunny moment in this small level yard, parallel sunlight makes the same acute angle with the ground. The two right triangles have matching angles: they are similar."
    },
    {
      "title": "Keep the ratio order",
      "text": "For similar triangles, corresponding lengths scale together. Compare height divided by shadow length for each post, in that same order."
    },
    {
      "title": "Check the conditions",
      "text": "A different moment does not establish the same sunlight angle. A zero shadow makes height divided by shadow undefined. Check the conditions before calculating."
    }
  ],
  "example": [
    {
      "title": "A separate example",
      "text": "A 3 m post has a 4 m shadow. Another upright post has a 6 m shadow at the same sunny moment on level ground."
    },
    {
      "title": "Compare shadow lengths",
      "text": "The shadow scale factor is 6 ÷ 4 = 3/2. Multiply the reference height by this same factor."
    },
    {
      "title": "Find a proposed height",
      "text": "3 × 6 = 18. Then 18 ÷ 4 = 4.5. The proposed height is 4.5 m."
    },
    {
      "title": "Check in the same order",
      "text": "Height/shadow: 3/4 and 4.5/6 are equal. Cross-products: 3 × 6 = 18 and 4.5 × 4 = 18 square metres. This height fits the example model."
    }
  ]
}
```
