# Spec 117 Spanish panel: OpenAI

Reviewer: OpenAI gpt-6.1-sol, through Codex CLI v0.160.0, at the CLI's configured default reasoning effort (low). Run 2026-10-31 on the owner's Code-PC, in an empty working directory, with read-only sandboxing. Its input was one packaged file: [the prompt](prompt.md) text verbatim, the full companion text at blob `634c0ddd`, and spec 117's "Place and story", "How an errand works" and "Review asks" sections. It read no other panel report.

Command: `cat package.md | codex exec --skip-git-repo-check -s read-only -c approval_policy=never -C <empty dir> -`

The report below is verbatim.

---

The Spanish is mostly correct and natural. The main problems are a few constructions beyond the stated beginner scope, an incomplete short recipe, and some misleading or missing glosses. The deliberate *ustedes* choice is workable with a short explanation for grown-ups.

The fixes below apply wherever the same wording repeats, including sentence meanings, word lists, cards and saved shuffles.

| Where and exact line | Kind | Exact fix | Confidence |
|---|---|---|---|
| Arriving, optional Marisol line: «Se llama *La Garza*. Dicen que antes una garza vieja cuidaba los caminos del río.» | Too much beginner load: *cuidaba* introduces the imperfect for an optional story detail. | «Se llama *La Garza*. Dicen que una garza vieja cuida los caminos del río.» English: “She's called *La Garza*, the Heron. They say an old heron looks after the river paths.” | High |
| Errand 1, requested English under misplaced items: “The {item} is in the {place}. Is it for the {place}?” | Misleading gloss for plural *las semillas*: the template produces singular agreement. | For the two seed lines: “The seeds are in the café. Are they for the café?” and “The seeds are in the bakery. Are they for the bakery?” | High |
| Errand 2, longer note and Words: «¡No te pierdas!» | Too much beginner load relative to the stated scope: a negative command uses a subjunctive form, unlike the affirmative commands being taught. | “drop the line” from the note, sentence meanings and Words. | High |
| Errand 2, Sentence meanings: the longer note’s «Sal del muelle y sigue recto hasta el puente.» has no matching sentence entry. | Missing sentence gloss. Its components are available separately, but the promised sentence-by-sentence support does not match the longer note. | Add: *Sal del muelle y sigue recto hasta el puente.* — “Leave the landing and keep going straight as far as the bridge.” | High |
| Errand 3, short note: «Al final, añade los huevos.»; short cards end with *añade los huevos*; successful result: «¡Qué rica! Vamos a cenar.» | Misleading procedure: the short version produces a finished tortilla immediately after adding the eggs, without cooking them. | Replace the last short-note sentence with «Al final, añade los huevos y cocina la tortilla por los dos lados.» Meaning: “At the end, add the eggs and cook the tortilla on both sides.” Replace the matching short card and saved-shuffle card with *añade los huevos y cocina la tortilla por los dos lados*. | High |
| Errand 3, longer note: «Después, fríe las patatas y la cebolla en el aceite, despacio, hasta que estén blandas.» | Too much beginner load: *hasta que estén* introduces the subjunctive inside an already vocabulary-heavy instruction. The original is grammatically correct. | «Después, fríe las patatas y la cebolla en el aceite a fuego lento.» Meaning: “Afterwards, fry the potatoes and the onion in the oil over low heat.” Replace *despacio* and *hasta que estén blandas* in Words with *a fuego lento* — “over low heat”. | High |
| Errand 3, pantry feedback: «¿Cuántas patatas? Mira la nota otra vez.» / “How many potatoes?” | Incomplete gloss: the second sentence is omitted. | “How many potatoes? Look at the note again.” | High |
| Errand 4, longer note: «El arroyo va a subir un poco, así que las barcas deben amarrarse bien en el muelle.» | Too much beginner load: the modal plus passive/reflexive infinitive is substantially harder than the surrounding forecast. The original is correct Spanish. | «El arroyo va a subir un poco. Amarra bien la barca en el muelle.» Meanings: “The brook is going to rise a little.” / “Tie the boat up well at the landing.” Replace *amarrarse* — “to be tied up” in Words with *amarra* — “tie up”. | High |
| Errand 5, Nuria reply: «Marisol me dio tu postal.» | Too much beginner load relative to the specified tense range: *dio* is a preterite form of an irregular verb. | «Tengo tu postal.» Meaning: “I have your postcard.” | High |
| Errand 5, Nuria reply: «Aquí el poste de crecidas marca poca agua, y eso es bueno.» | Unnatural wording: a gauge marks a water **level**; *marca poca agua* is awkward here. The specialized phrase also adds load. | «Aquí el nivel del agua está bajo, y eso es bueno.» Meaning: “Here the water level is low, and that's good.” | High |
| Grammar notes: “Every Spanish noun is masculine or feminine, and the little word in front shows which: *el saco*, *la caja*.” | Misleading grammar explanation: a preceding article does not invariably identify gender; for example, *el agua* is feminine. | “Spanish nouns have a grammatical gender: masculine or feminine. Learn each noun with its article: *el saco*, *la caja*. For more than one: *los sacos*, *las cajas*.” | High |
| Grammar notes: “*Va a* plus a verb means going to.” | Misleading explanation: the following *voy a cocinar* changes the form, but the rule does not explain why. | “Use a form of *ir* + *a* + an infinitive to say what is going to happen. *Va a llover*: it's going to rain. *Voy a cocinar*: I'm going to cook.” | High |

For *ustedes*, add this to the grown-up notes:

> “This game uses *tú* for one person and *ustedes* for more than one. In most of Spain, familiar plural ‘you’ is *vosotros/vosotras*; *ustedes* usually signals more formal address. The game consistently uses *ustedes* to keep the beginner forms simpler.”

This makes the choice acceptable without presenting it as ordinary informal usage in the Pyrenees.

I found no additional errors in the task labels, remaining dialogue, postcard tiles or tile meanings, Marisol’s reply, or sound notes. The nudges’ Spanish excerpts match the notes apart from harmless sentence-initial capitalization. Their explicit help after a non-fitting answer suits the stated unscored design.

1. **Farther up the valley:** *Más arriba en el valle* is natural and transparent; keep it.
2. **Landing:** *Muelle* is acceptable if the illustration shows a dock; *embarcadero* is more precise for a simple boarding place, but does not require replacement.
3. **Boat and mooring:** *Barca* is natural for a small river boat; *amarrarse* is correct in the original sentence, though the direct command proposed above is easier.
4. **Weather report:** *El parte del tiempo* is natural in Spain; keep it rather than introducing *pronóstico*.
5. **Recipe:** The longer recipe’s order and *mézclalo todo* are sound for a simplified game; the short recipe needs the final cooking step.
6. **Dialogue and quotations:** Teo and Marisol generally sound natural; the quoted Spanish in the nudges matches, with the support omissions listed above.
7. **Tile combinations:** *¿Cuándo vuelven?* can naturally ask one recipient about the whole crew; optional English help reading “When are you and the crew coming back?” would clarify that reference, including for Nuria.

Spec 117’s load question: **the longer notes are too demanding as a general beginner option as written**, especially the recipe. Strong English reading helps with instructions and glosses, but does not remove the load of unfamiliar Spanish verbs, attached pronouns, subordinate clauses and specialized vocabulary. With the listed simplifications, pictures and sentence-level support, they work as optional **supported stretch reading**. They should not imply that a beginner is expected to read them independently.

**usable with the listed fixes**
