# GLM independent complete-language review

2026-11-05 · `z-ai/glm-5.2` through OpenRouter. Owner approved one billable public-text review after Gemini returned exhausted credits. Input: complete companion revision4, separately, without any other provider report; [exact prompt](glm-prompt.txt). No private learner data or runtime model call.

## Provider report (verbatim)

## Review: #382 · Parcel questions · complete finite companion · revision 4

### French grammar, spelling, and typography

All French is grammatically correct and typographically consistent:

- Imperatives: **Apporte le colis au café / au jardin / à la bibliothèque / à l'atelier** — correct contraction of *à + le/la/l'*.
- Colour/room replies: **Le colis est bleu / rouge / vert. Il est dans la chambre / la cuisine / le salon** — all correct agreement and prepositions.
- Destination replies: **Le colis va au café / au jardin / à la bibliothèque / à l'atelier** — correct.
- Questions: **De quelle couleur est le colis ? / Dans quelle pièce est le colis ? / Où va le colis ?** — all correct, including proper French narrow no-break space before question marks.
- Labels: **bleu, rouge, la cuisine, le salon, Le café, Le jardin, La bibliothèque, L'atelier** — all correct.
- Curly apostrophe used consistently in *l'atelier*, *l'atelier*.

### English glosses

All glosses are accurate and natural:
- *pièce* → "room" (correct for a room in a dwelling).
- *au café / au jardin* → "to the café / to the garden" — correct.
- *va au* → "is going to" — natural.
- No mistranslations or over-translations detected.

### Teaching logic

- Four cases each map to a unique colour+room intersection (blue/kitchen, red/living room, blue/living room, red/kitchen). Every pair is distinct; both questions are always needed to disambiguate fully. Logic is sound.
- The destination question deliberately echoes the note, clearly flagged as contrast rather than error. This is explained in three places (Teaching, Questions section, Support), which is appropriately redundant for beginners.
- A–D positions vary by case and are not fixed to the correct answer. No positional giveaway.
- The worked example uses **vert / chambre** — colours and rooms that never appear in any actual case, preventing accidental answer leakage from the example. Good design.

### Cognitive load

Well controlled: two colours, two rooms, four parcels, three question types, short declarative replies. The destination question adds a layer of contrast but does not add identification burden. Beginner-appropriate.

### Answer giveaways

- Parcel labels (colour + room) are visible beside the conversation, but colour alone never identifies the parcel — explicitly stated and true across all cases.
- The **Compare with the replies** feature can reveal unasked information; this is openly disclosed and permanently flagged with `compared:true` and the label **Source comparison opened**. No hidden grading or silent revelation.
- No question is graded; all return truthful replies. No "most useful" auto-indicator.
- English meanings disclosure reveals only already-asked replies. Correctly scoped.

### Interface and system text (English)

All interface strings are clear and internally consistent. Kept-version explanation, refusal messages, history limits, and speech disclaimers are all coherent and appropriate. No French appears in interface labels outside the defined panel scope.

### Actual errors

None found.

### Optional style notes (non-blocking)

1. **"Apporte le colis au jardin."** — A parcel being delivered "to the garden" is slightly unusual in real-world terms, but fully acceptable in a beginner learning context and consistent with the exercise's simplified world.
2. The Teaching paragraph is information-dense for a beginner-facing instruction. It is accurate but could benefit from a line break between the contrast explanation and the "any question, any order" note. Purely optional formatting.

### Verdict

**CLEAR WITH OPTIONAL NITS.**

Confidence: **High.** All French, glosses, and teaching logic are correct. No blockers identified. The two optional notes are stylistic only and require no changes for beginner use.

## Root resolution

No actual errors were flagged. Both optional notes are accepted as nonblocking: a garden parcel is consistent with the story, and the implementation can format the existing teaching paragraph without changing reviewed words. The finite French/English companion remains revision4 unchanged. GLM is the third completed provider alongside OpenAI and Claude; the failed Google request is not a vote. Language clearance is a model-panel judgment, not fluent-human, audio, proficiency or implementation qualification.
