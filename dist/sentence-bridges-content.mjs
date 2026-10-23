// Original finite fictional scenes and reviewed relation notes; no generated interpretations.
export const bridgeScenes=[
 {
  "id": "supper",
  "label": "Supper",
  "title": "A note about supper",
  "context": "Rain was falling. The helpers moved supper indoors to keep rain off the tables. Moving supper did not change the weather.",
  "purpose": "Tell the gathering helpers why the supper moved.",
  "a": "The helpers moved supper indoors.",
  "b": "Rain was falling.",
  "trials": {
   "AB:and": {
    "trial": "The helpers moved supper indoors, and rain was falling.",
    "meaning": "This adds the two facts. It does not say why supper moved. Our scene gives that reason."
   },
   "AB:because": {
    "trial": "The helpers moved supper indoors because rain was falling.",
    "meaning": "This says rain was the reason the helpers moved supper. That reason is supplied in our scene."
   },
   "AB:but": {
    "trial": "The helpers moved supper indoors, but rain was falling.",
    "meaning": "This offers a contrast between moving indoors and rain falling. Our scene uses rain as the reason for moving. What expectation would make this contrast useful?"
   },
   "BA:and": {
    "trial": "Rain was falling, and the helpers moved supper indoors.",
    "meaning": "This adds the same two facts in another order. The word and does not itself promise a reason or a time order."
   },
   "BA:because": {
    "trial": "Rain was falling because the helpers moved supper indoors.",
    "meaning": "This would make moving supper the reason rain fell. Our scene says moving supper did not change the weather. You can try the sentence, then change it."
   },
   "BA:but": {
    "trial": "Rain was falling, but the helpers moved supper indoors.",
    "meaning": "This offers the indoor move as a contrast with the rain. Our scene gives a reason for moving, not a surprise about it. What expectation might your speaker have?"
   }
  }
 },
 {
  "id": "lamp",
  "label": "Lamp",
  "title": "A note about the lamp",
  "context": "The lamp was lit. A thick screen blocked its light, so the room was dark. The helpers had expected the lamp to brighten the room. This note does not say why anyone lit it.",
  "purpose": "Tell the stage helpers what was unexpected about the room.",
  "a": "The room was dark.",
  "b": "The lamp was lit.",
  "trials": {
   "AB:and": {
    "trial": "The room was dark, and the lamp was lit.",
    "meaning": "This adds the dark room and the lit lamp. It leaves their surprising contrast for the reader to notice."
   },
   "AB:because": {
    "trial": "The room was dark because the lamp was lit.",
    "meaning": "This names the lit lamp as the reason for darkness. Our scene gives the blocking screen as the reason. The helpers expected the lit lamp to brighten the room."
   },
   "AB:but": {
    "trial": "The room was dark, but the lamp was lit.",
    "meaning": "This highlights a contrast: the room was dark even with the lamp lit. Our scene supplies the expectation that the lamp would brighten it."
   },
   "BA:and": {
    "trial": "The lamp was lit, and the room was dark.",
    "meaning": "This adds the lit lamp and the dark room. It does not name a cause or explicitly mark the contrast."
   },
   "BA:because": {
    "trial": "The lamp was lit because the room was dark.",
    "meaning": "This gives the dark room as the reason someone lit the lamp. Our note does not tell us why it was lit, so it does not confirm that reason."
   },
   "BA:but": {
    "trial": "The lamp was lit, but the room was dark.",
    "meaning": "This highlights the unexpected darkness after naming the lit lamp. Our scene says the helpers expected its light to brighten the room."
   }
  }
 },
 {
  "id": "jobs",
  "label": "Two jobs",
  "title": "A note about two jobs",
  "context": "Pip folded the banner while Dot packed the cups. The jobs happened at the same time. Neither job caused the other. The note gives no reason to expect the same job from both helpers.",
  "purpose": "Tell the next helpers about the two jobs, without inventing a cause.",
  "a": "Pip folded the banner.",
  "b": "Dot packed the cups.",
  "trials": {
   "AB:and": {
    "trial": "Pip folded the banner, and Dot packed the cups.",
    "meaning": "This adds both jobs. Our scene says they happened at the same time; and alone would not tell us that."
   },
   "AB:because": {
    "trial": "Pip folded the banner because Dot packed the cups.",
    "meaning": "This would make Dot’s packing the reason Pip folded the banner. Our scene says neither job caused the other."
   },
   "AB:but": {
    "trial": "Pip folded the banner, but Dot packed the cups.",
    "meaning": "This makes their different jobs stand out. A speaker can choose that contrast; our note gives no reason to expect them to do the same job."
   },
   "BA:and": {
    "trial": "Dot packed the cups, and Pip folded the banner.",
    "meaning": "This adds both jobs with Dot first. Changing the sentence order does not change the scene’s timing."
   },
   "BA:because": {
    "trial": "Dot packed the cups because Pip folded the banner.",
    "meaning": "This would make Pip’s folding the reason Dot packed the cups. Our scene says neither job caused the other."
   },
   "BA:but": {
    "trial": "Dot packed the cups, but Pip folded the banner.",
    "meaning": "This contrasts Dot’s job with Pip’s. Both jobs are supplied; the speaker chooses to make the difference stand out."
   }
  }
 }
];
export const bridgeWords=['and','because','but'];
export const bridgeScene=id=>bridgeScenes.find(c=>c.id===id)||null;
export const bridgeOpening="Two sentences can tell different kinds of connections. Keep our scene in view. Change the joining word and listen to what your sentence would say.";
export const bridgeTeaching="And adds one idea to another. Because gives the second part as a reason for the first. But sets up a contrast: something different or unexpected. A joining word changes what we ask our reader to connect. It does not change what happened in our scene. But does not make either idea untrue.";
