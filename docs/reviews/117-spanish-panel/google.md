# Spec 117 Spanish panel: Google

Reviewer: Google Gemini 4 Argon (High), model id `gemini-4-argon-high`, through the Antigravity CLI (agy 1.4.11). Run 2026-10-31 on the owner's Code-PC as a fresh process in an empty working directory, with no tools, the prompt piped on stdin and the output captured as UTF-8. Its input was the same packaged file as the other reviewers: [the prompt](prompt.md) text verbatim, the full companion text at blob `634c0ddd`, and spec 117's "Place and story", "How an errand works" and "Review asks" sections. It read no other panel report.

Command: `cat package.md | agy --model gemini-4-argon-high > gemini-run.out`, run in an empty directory.

The report below is verbatim.

---

### The Owner's Deliberate Choice (*ustedes* in Spain)

**Acceptable for beginners as written, with a one-sentence addition to the Grown-up notes.** Across the entire module, singular *tú* is used everywhere except a single postcard tile (*¿Cuándo vuelven?*), and avoiding a second plural conjugation paradigm (*vosotros volvéis*) for one tile is sound beginner pedagogy. Because the Grown-up notes invite Spanish-speaking adults to read aloud with the child, add one sentence to **Grown-up notes → Details** so Peninsular speakers know the choice is intentional:

> *To keep verb forms manageable for beginners, plural "you" uses **ustedes** (*¿Cuándo vuelven?*) rather than Spain's everyday **vosotros** (*¿Cuándo volvéis?*).*

---

### Line-by-Line Review

#### Problem 1
1. **Where**: Errand 1: *La carga* → Task → Something elsewhere, Marisol: `English under each, on request: "The {item} is in the {place}. Is it for the {place}?"` (applied to `«Las semillas están en el café. ¿Son para el café?»` and `«Las semillas están en la panadería. ¿Son para la panadería?»`).
2. **Kind**: a gloss that misleads (and ungrammatical English when `{item}` is plural *seeds*, failing to reflect plural *Las semillas están... ¿Son...?*).
3. **Fix**: `English under each, on request: "The {item} is in the {place}. Is it for the {place}?" (for *las semillas*: "The seeds are in the {place}. Are they for the {place}?")`
4. **Confidence**: high

#### Problem 2
1. **Where**: Errand 2: *El camino* → Note, a longer note & Sentence meanings: `Sal del muelle y sigue recto hasta el puente.`
2. **Kind**: error (missing entry in the Sentence meanings table: the short note splits this into `Teo, sal del muelle.` and `Sigue recto hasta el puente.`, both of which are in the table, but the combined sentence in the longer note is omitted from Sentence meanings).
3. **Fix**: Add row to Errand 2's Sentence meanings table:
   `| Sal del muelle y sigue recto hasta el puente. | Leave the landing and keep going straight as far as the bridge. |`
4. **Confidence**: high

#### Problem 3
1. **Where**: Errand 3: *La receta* → Words: `*luego* then · *bate* beat · *mézclalo todo* mix it all · *por los dos lados* on both sides · *darle la vuelta* to flip it`
2. **Kind**: a gloss that misleads (missing word glosses for `cocina` and `cuidado`: `cocina` is the command verb in `Al final, cocina la tortilla por los dos lados.` and on the fifth ordering card, while every other step's verb is glossed in Words).
3. **Fix**: `*luego* then · *bate* beat · *mézclalo todo* mix it all · *cocina* cook · *por los dos lados* on both sides · *cuidado* careful · *darle la vuelta* to flip it`
4. **Confidence**: high

#### Problem 4
1. **Where**: Errand 3: *La receta* → Task, part 1: the pantry → Teo, something differs: `«¿Cuántas patatas? Mira la nota otra vez.» *How many potatoes?*`
2. **Kind**: a gloss that misleads (the English gloss drops `Mira la nota otra vez.`, which is translated in the immediately preceding `huevos` line; additionally, if `cebollas (+ / −)` allows placing more than one onion, `«¿Y la cebolla?»` only fits zero onions).
3. **Fix**: `«¿Cuántas patatas? Mira la nota otra vez.» *How many potatoes? Look at the note again.*` (and either make `una cebolla` a single toggle on the shelf or use `«¿Cuántas cebollas? Mira la nota otra vez.» *How many onions? Look at the note again.*`).
4. **Confidence**: high

#### Problem 5
1. **Where**: Errand 4: *El tiempo* → Note, a longer note: `El arroyo va a subir un poco, así que las barcas deben amarrarse bien en el muelle.`, Words: `*amarrarse* to be tied up`, and Task: `**Amarrar bien la barca** *(tie the boat up well)*`.
2. **Kind**: too much load for a beginner (and unnatural wording: modal + passive reflexive `deben amarrarse` is stiff for Marisol and mismatches the active infinitive `Amarrar bien la barca` in the task; using `hay que amarrar` is more natural in Spain and matches the task button directly).
3. **Fix**:
   - Note, a longer note: `El arroyo va a subir un poco, así que hay que amarrar bien las barcas en el muelle.`
   - Sentence meanings: `| El arroyo va a subir un poco, así que hay que amarrar bien las barcas en el muelle. | The brook is going to rise a little, so the boats need to be tied up well at the landing. |`
   - Words: replace `*amarrarse* to be tied up` with `*hay que* we need to · *amarrar* to tie up`.
4. **Confidence**: high

#### Problem 6
1. **Where**: Errand 4: *El tiempo* → Question (`¿Qué va a pasar con el arroyo?`) → Nudge for `No va a cambiar.`: `Look at the sentence with *el arroyo*. *Subir* means to rise.`
2. **Kind**: an answer giveaway (naming `*Subir*` when `Va a subir un poco.` is the only choice containing `subir` hands the answer directly to the player).
3. **Fix**: `*Cambiar* means to change. Look at the sentence with *el arroyo* to see what it's going to do.`
4. **Confidence**: high

#### Problem 7
1. **Where**: Errand 5: *Una postal* → Tiles (`To`: `Querida Nuria:` and `Hola, Nube:` combined with `Questions`: `¿Cuándo vuelven?` and `¿Cómo está Nube?`).
2. **Kind**: unnatural or regionally wrong wording (pragmatic mismatch when combined: Nuria lives in Vadoalto and never came down to the market, so asking her `¿Cuándo vuelven?` makes no sense in the story, and asking Nube `¿Cómo está Nube?` addresses the cat in the third person).
3. **Fix**: Change `¿Cuándo vuelven?` to `¿Cuándo vuelve *La Garza*?` (gloss: `When is *La Garza* coming back?`)—or disable `¿Cuándo vuelven?` when addressing Nuria—and disable `¿Cómo está Nube?` when `Hola, Nube:` is selected.
4. **Confidence**: medium

---

### Answers to "Questions for the fluent reader"

1. ***más arriba en el valle* vs. *valle arriba***: Keep *más arriba en el valle*—both are natural in Spain, and *más arriba en el valle* is much more transparent for beginners than the idiomatic adverbial postposition *valle arriba*.
2. ***El muelle* vs. *el embarcadero***: Keep *el muelle*—while *el embarcadero* is technically precise for a small brook landing, *el muelle* is widely used in Spain for stone river/town landings and is far shorter and easier for beginners to read and remember.
3. ***barca* and *amarrarse***: *Barca* is fine for a small shallow-draft river boat on a brook, and *amarrar* is the exact nautical/river word for tying up, though active *hay que amarrar bien las barcas* (see Problem 5) is much more natural than *las barcas deben amarrarse bien*.
4. ***El parte del tiempo* vs. *el pronóstico del tiempo***: Keep *El parte del tiempo*—it is genuinely idiomatic in Spain (alongside *el tiempo*) and avoids the four-syllable proparoxytone *pronóstico*.
5. **The recipe wording and order**: The sequence, ingredients, and Peninsular phrasing (*tortilla de patatas*, *pela y corta*, *bate los huevos y mézclalo todo*, *cocina la tortilla por los dos lados*, *¡Cuidado al darle la vuelta!*) are authentic and sound like a real Spanish cook.
6. **Teo's lines, Marisol's replies, and nudge quotations**: The dialogue sounds warm and natural for Peninsular Spanish, and every Spanish quotation in the nudges matches its note verbatim.
7. **Postcard tile combinations**: Addressing `¿Cuándo vuelven?` to Marisol or Teo works because the gloss specifies "you all" (the crew), though pairing `¿Cuándo vuelven?` with `Querida Nuria:` (who stayed in Vadoalto) or `¿Cómo está Nube?` with `Hola, Nube:` is awkward (see Problem 7).

---

### Spec 117 Review Ask: Longer Note Beginner Load

**Yes, the longer note's load is right for a beginner who reads well in English (with Problem 5's fix).** The longer notes stay grounded in the present tense, *hay*, *va a* + infinitive, and singular *tú* imperatives, while leveraging high-frequency English cognates (*capitana*, *valle*, *jardín*, *plaza*, *oficina*, *mercado*, *montañas*) and visual scene context. The few idiomatic stretches beyond the core grammar—`¡No te pierdas!` in Errand 2, and `hasta que estén blandas`, `mézclalo todo`, and `¡Cuidado al darle la vuelta!` in Errand 3—are glossed as complete chunks in the word list and do not block task completion.

---

### Overall Verdict

**usable with the listed fixes**
