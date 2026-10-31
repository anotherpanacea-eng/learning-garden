# Spec 117 Spanish panel: resolution

This is the record that spec 117's [language review method](../../specs/117-spanish-river-market.md#language-review-method--owner-decision-2026-10-30) asks for, for the River Market companion text.

**Reviewed revision:** `docs/content/117-river-market-text.md` at blob `634c0ddd9eb7ad173a5dd4098bb872f0c8c90eda` (learning-garden `main` at `2fa234b`). **Resolved revision:** the same file as amended in this commit. The review binds to the resolved text; any later change to a Spanish line needs a new panel pass.

## Panel

Three current frontier models from three providers each reviewed the whole companion text separately, from the same [prompt](prompt.md), and none saw another's report.

| Reviewer | Provider | Report | Verdict |
| --- | --- | --- | --- |
| Claude Opus 5.5 | Anthropic | [claude.md](claude.md) | usable with the listed fixes |
| gpt-6.1-sol, Codex CLI, default (low) effort | OpenAI | [openai.md](openai.md) | usable with the listed fixes |
| Gemini 4 Argon (High) | Google | [google.md](google.md) | usable with the listed fixes |

The OpenAI and Google runs were made on the owner's Code-PC from one packaged input file, each in a fresh process in an empty directory. The Claude report was written in a cloud session before the others existed and was committed only after they came back. The OpenAI run used its CLI's default reasoning effort, which is low. It still found the most load issues, and no line that it alone flagged was kept unchanged.

## Resolution rules

The method's rules were applied as follows:
- A fix that every reviewer who raised the line agrees on is applied.
- Where reviewers disagree, the simplest standard wording that every reviewer would accept is used, or the line is dropped.
- No line that any reviewer marked as an error is kept without a stated reason.

## Lines changed

| # | Line | Raised by | Resolution |
| --- | --- | --- | --- |
| 1 | Boat-name line, «...antes una garza vieja cuidaba los caminos del río.» | Claude (*río* vs *arroyo*, vague), OpenAI (imperfect is extra load) | «Dicen que una garza vieja cuida el arroyo.» / "They say an old heron looks after the brook." This takes both fixes: the present tense and the text's own word for the brook. |
| 2 | Errand 1, English for the seeds' wrong-place lines | All three | Seeds get "The seeds are in the {place}. Are they for the {place}?" |
| 3 | Errand 2, «¡No te pierdas!» | OpenAI (negative command is subjunctive load); Google called it a glossed chunk | Dropped from the note, the meanings and the words. Dropping it loses no task information, and every reviewer accepts the note without it. |
| 4 | Errand 2, the longer note's «Sal del muelle y sigue recto hasta el puente.» has no sentence meaning | OpenAI, Google | The row is added. |
| 5 | Errand 3, the short recipe ends without cooking | OpenAI | The last sentence and card become «Al final, añade los huevos y cocina la tortilla por los dos lados.» |
| 6 | Errand 3, «...despacio, hasta que estén blandas.» | OpenAI (subjunctive load); Claude and Google would keep it as a chunk | «...en el aceite a fuego lento.» / "over low heat". This is simpler and correct, and every reviewer accepts it. The words list follows. |
| 7 | Errand 3, the word list lacks *cocina* and *cuidado* | Google | Both are added. |
| 8 | Errand 3, the pantry's potatoes gloss is incomplete | OpenAI, Google | "How many potatoes? Look at the note again." |
| 9 | Errand 3, «¿Y la cebolla?» on a shelf where the onion count can be changed | Google | «¿Cuántas cebollas? Mira la nota otra vez.» / "How many onions? Look at the note again." This matches the egg and potato lines. |
| 10 | Errand 3, the longer question's nudge says "after the potatoes are soft" | Follows from 6 | "The eggs come after the frying." |
| 11 | Errand 4, «...así que las barcas deben amarrarse bien en el muelle.» | OpenAI (split it into a command), Google (*hay que amarrar*); Claude accepted either | «...así que hay que amarrar bien las barcas en el muelle.» This keeps the report's voice, uses *hay*, which is already taught, and matches the task's *Amarrar bien la barca*. The words list gains *hay que* and *amarrar*. |
| 12 | Errand 4, the *No va a cambiar* nudge names *subir* | Google (answer giveaway); Claude noted the string-matching | "*Cambiar* means to change. Look at the sentence with *el arroyo* to see what it's going to do." |
| 13 | Errand 5, the *¿Cuándo vuelven?* tile | Google (makes no sense addressed to Nuria); OpenAI and Claude found it acceptable | The tile becomes «¿Cuándo vuelve *La Garza*?» / "When is *La Garza* coming back?". It fits every addressee and needs no plural verb. |
| 14 | Errand 5, *¿Cómo está Nube?* on a card addressed to Nube | Google | That tile is not offered when the card starts «Hola, Nube:». This is a build rule for the postcard slice. |
| 15 | Errand 5, Nuria's «Marisol me dio tu postal.» | Claude (*me ha dado*), OpenAI (*Tengo tu postal.*) | «Tengo tu postal.» It is present tense, and the simpler of the two. |
| 16 | Errand 5, Nuria's «el poste de crecidas marca poca agua» | OpenAI (unnatural); Claude (a minor coinage) | «Aquí el nivel del agua está bajo, y eso es bueno.» This drops the flood-post callback. If the story thread wants it back, its own letter takes a new panel pass. |
| 17 | Mi cuaderno, the gender note's "the little word in front shows which" | OpenAI (misleading: *el agua*) | OpenAI's wording: learn each noun with its article. |
| 18 | Mi cuaderno, the *va a* note | OpenAI | "Use a form of *ir* + *a* + an infinitive..." |
| 19 | Mi cuaderno, the commands note omits *sal* | Claude | *Sal* is added. |
| 20 | Grown-up details | All three on *ustedes*; OpenAI on longer-note load | Two framing sentences are added (below). |

## Lines kept, with the reason

- **«El parte del tiempo para el valle.»** Claude preferred *la previsión del tiempo*, but did not mark *el parte* as an error. OpenAI and Google both said to keep it as natural in Spain, so it is kept.
- **«más arriba en el valle», «el muelle», «barca».** All three said to keep them.
- **«mézclalo todo», «¡Cuidado al darle la vuelta!» and the recipe order.** All three accepted them.
- **Fitting choices that copy the note** (errands 1, 2 and 4). Claude noted this as mild and said to keep it. It is a fair "find it in the note" task at beginner load, and the giveaway Google raised is fixed separately at 12.
- **Every other line.** No reviewer flagged it.

## The *ustedes* choice

All three reviewers found *ustedes* acceptable. After change 13, no shipped line in this text uses a plural verb, so the choice now matters only for later lines. The grown-up details now say: "When a line speaks to more than one person, the game uses *ustedes*. In Spain, friends usually say *vosotros*; *ustedes* is also correct, and it keeps the verb forms simpler."

## Longer-note load

Claude and Google judged the longer note right for a beginner who reads well in English, with the glosses one tap away. OpenAI called it too demanding as a general option, but workable as supported stretch reading once its fixes were made. Every one of those fixes is applied above (changes 3, 5, 6, 11 and 15). Short sentences stay the default, and the grown-up details now say: "A longer note is optional stretch reading, meant to be read with the English help; short sentences are the default."

## Audio

No Spanish recording or synthesis exists, so step 3 of the method does not apply yet. Browser speech stays the default.

## Second pass: *junco* becomes *carrizo*

Spec 326's panel ([326 panel](../326-spanish-panel/resolution.md)) asked the same three providers about this text's *junco*, since Act III calls the same Vadoalto plant *carrizo*. All three said to change it. *Junco* is the rush, a shorter plant, and the "reed" gloss hid the difference. Using two names would also teach two words for one plant. The applied changes are:

- «...una caja pequeña de semillas de carrizo.» and «El carrizo crece bien en la tierra mojada.» Their English glosses are unchanged.
- *el carrizo* reed in the glossed word list, and *el carrizo* in the phrasebook list.
- The sounds note uses *jardín* as its J example, since that word is already in the note. It says "*J* is a raspy sound made at the back of the mouth". OpenAI pointed out that "breathy" can suggest an English H. The raspy sound is the usual one in northern Spain, where Vadoalto sits. Google kept the old wording and did not mark it as an error.

## Known limit

As spec 117 says, a model panel can miss wording that is correct but sounds odd to a native speaker. This residual risk is accepted for beginner content.
