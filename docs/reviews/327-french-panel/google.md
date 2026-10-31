# Spec 327 French: Google

Reviewer: Google Gemini 4 Argon (High), model id `gemini-4-argon-high`, through the Antigravity CLI (agy 1.4.11) on Code-PC, 2026-10-31. Run alone in an empty directory, with the [prompt](prompt.md) and the companion at `98d106f` on stdin. The report below is the raw output, byte for byte.

---

Here is the review of `docs/content/327-french-ferry-crossing-text.md`, organized by your six criteria.

---

### 1. Grammar, Spelling, Accents, Punctuation, and Agreement

French spelling, accents (including capital `À` and `D'où`), verb agreements, and subject-verb inversion hyphens (`êtes-vous`, `allez-vous`, `venez-vous`, `revenez-vous`) are all accurate. There are two punctuation/formatting issues:

| Exact line(s) | Kind of problem | Exact fix | Confidence |
| --- | --- | --- | --- |
| Every line with guillemets (`«...»`), e.g.:<br>`Madame Roux: «Combien de colis avez-vous ?»`<br>`Dot: «Trois colis.»`<br>`«Nous sommes deux.» · «Nous sommes trois.» ...`<br>`Say: «À quelle heure part le bac ?»`<br>`«Le bac part à dix heures.»`<br>`Madame Roux: «Merci. Montez, s'il vous plaît !»`<br>`Say: «Combien coûte la traversée ?»`<br>`«La traversée coûte trois euros.»`<br>`Madame Roux: «Merci. C'est parti !»` | **French punctuation spacing:** The text uses French spacing before `?` and `!`, but omits the mandatory space inside French guillemets (`«` and `»`). | Add a non-breaking space (`\u202F` or `\u00A0`) after `«` and before `»` in all 19 occurrences:<br>`« Combien de colis avez-vous ? »`, `« Trois colis. »`, `« Nous sommes deux. »`, `« À quelle heure part le bac ? »`, etc. | **High** |
| All French lines ending in ` ?` or ` !`, e.g.:<br>`Où ?`, `D'où ?`, `Combien ?`, `À quelle heure ?`, `Bonjour ! Combien êtes-vous ?`, `Montez, s'il vous plaît !` | **Non-breaking space before `?` and `!`:** The spaces before `?` and `!` are regular ASCII spaces (`U+0020`), which can cause `?` or `!` to wrap onto a new line by itself on narrow screens. | Use a narrow non-breaking space (`\u202F`) or non-breaking space (`\u00A0`) before `?` and `!` at runtime. | **High** |
| `Madame Roux asked *{question word}*. That asks for {a number / a time / where you are going / where you are coming from}. Listen again.` | **Case/punctuation mismatch in template interpolation:** On the teaching card, the question words are capitalized with question marks (`Où ?`, `D'où ?`, `Combien ?`, `À quelle heure ?`), whereas in Dot's example (`She asked *combien*`) it is lowercase without `?`. | Specify the lowercase bare forms for `{question word}`: `{combien / où / d'où / à quelle heure}` so it never renders as `Madame Roux asked *Où ?*.` | **High** |

---

### 2. Naturalness, Formality, and Everyday Register in France

#### *Combien êtes-vous ?* and *Nous sommes deux.* vs. *Vous êtes combien ?* and *On est deux.*
* **`Combien êtes-vous ?` vs. `Vous êtes combien ?`:**
  * In everyday France, a ferry operator speaking casually will often say *Vous êtes combien ?*, while *Combien êtes-vous ?* is standard, polite service-encounter French (*français standard soigné*).
  * **Recommendation: Keep `Combien êtes-vous ?`.** The entire listening mechanic of this activity teaches beginners to listen for the question word **at the start of the sentence** (*Où...*, *D'où...*, *Combien...*, *À quelle heure...*). Changing to *Vous êtes combien ?* puts the question word at the end and breaks the parallel structure with *Où allez-vous ?* and *D'où venez-vous ?* (where initial *Où* vs. *D'où* is a core teaching point).
* **`Nous sommes deux.` vs. `On est deux.`:**
  * In everyday spoken French in France—especially for a child (ages 7–12) speaking with an adult companion—*Nous sommes deux.* sounds formal and textbook-like (*scolaire*). Virtually any French child or adult in real life says **« On est deux. »** (or simply **« Deux. »**, just as Dot answers « Trois colis. » rather than « Nous avons trois colis. »).
  * **Trade-off for beginners:** *Nous sommes deux / trois* is transparent for absolute beginners and avoids introducing the pronoun *on* ("we/one") and its mandatory liaison (`on‿est` `[ɔ̃.n‿ɛ]`). However, if authentic everyday spoken French for children is preferred, *On est deux.* / *On est trois.* is far more natural.

| Exact line(s) | Kind of problem | Exact fix | Confidence |
| --- | --- | --- | --- |
| `Nous sommes deux.` / `Nous sommes trois.` | **Overly formal register for children:** Correct standard French, but unnatural in everyday spoken French in France, where children and adults almost always say *On est deux / trois* (or just *Deux / Trois*). | Either change the cards to `On est deux.` / `On est trois.` (updating the preamble note from `*nous sommes*` to `*on est*`), **or** keep `Nous sommes deux / trois` consciously as a beginner textbook scaffold to avoid teaching *on* = "we" in lesson 1. | **High** |
| **Crossing 1 Ending:** `Madame Roux: «Merci. Montez, s'il vous plaît !» Thank you. Climb aboard, please!`<br>**Crossing 2 Ending:** `Madame Roux: «Merci. C'est parti !» Thank you. Off we go!` | **Pragmatic flow after Step 5:** In Step 5, the **child** asks Madame Roux a question (*À quelle heure part le bac ?* / *Combien coûte la traversée ?*) and Madame Roux answers it. Having Madame Roux immediately say *« Merci. »* right after answering the child's question feels slightly disconnected (normally the passenger says *Merci* after getting an answer, or the operator says *Parfait !* / *Très bien !*). Also, *Montez, s'il vous plaît !* is a bit brisk/conductor-like. | Replace `Merci.` in the two endings with `Très bien !` or `Parfait !`:<br>• Crossing 1: `« Parfait ! Montez à bord ! »` (*Perfect! Come aboard!* — or `« Très bien ! Montez, s'il vous plaît ! »`)<br>• Crossing 2: `« Parfait ! C'est parti ! »` (*Perfect! Off we go!*) | **Medium** |

---

### 3. English Glosses That Mislead

| Exact line(s) | Kind of problem | Exact fix | Confidence |
| --- | --- | --- | --- |
| `Où ? \| Where? \| It asks where you are going. The answer starts with *À*: *À la poste.*` | **Misleading grammatical attribution:** `Où ?` means *Where?* (both static location and destination). It is the verb *allez* in *Où allez-vous ?* that asks where you are going, not *Où* by itself. Telling beginners that `Où ?` means "where you are going" confuses them when they meet *Où est... ?* or *Où êtes-vous ?*. | Change the note to:<br>`In *Où allez-vous ?*, it asks where you are going. Here, the answer starts with *À*: *À la poste.*` | **High** |
| `Combien ? \| How many? \| The answer has a number: *Nous sommes deux.*` | **Incomplete gloss that clashes with Crossing 2 Step 5:** `Combien ?` is glossed only as `How many?`, yet in Crossing 2 Step 5 the child uses `Combien` to ask `« Combien coûte la traversée ? »` (*How much does the crossing cost?*). | Change the English column to `How many? / How much?` and the note to `The answer has a number or a price: *Nous sommes deux.*` | **High** |
| `À la boulangerie. \| To the bakery.`<br>`À la poste. \| To the post office.`<br>`À la mairie. \| To the town hall.`<br>`À cinq heures. \| At five o'clock.` | **Implicit shift in the meaning of *À*:** The child sees `*À*` translated as `To` for places and `At` for times without explanation, and may assume `À la poste` can only mean *To the post office* (when it also means *At the post office*). | Optional/minor: in the `Où ?` teaching note, mention that `*À*` means *to* (or *at*). | **Low** |

---

### 4. Review of the Two Teaching Notes

#### A. The *Où* / *D'où* Note (Answers Starting with *À* and *De*)
* **Is it accurate?**
  * **Within this activity's closed vocabulary** (*la poste*, *la boulangerie*, *la mairie*—all feminine singular nouns starting with a consonant), yes: every destination answer starts with `À la...` and every origin answer starts with `De la...`.
  * **As a general statement about French, no:** Before masculine singular nouns (e.g., *le marché*, *le village*, *le parc*) or plural nouns, `à + le` contracts to **`Au`** (*Au marché*) and `de + le` contracts to **`Du`** (*Du marché*), and before a vowel `de` becomes **`D'`**. In addition, in the card set itself, the time cards (`À cinq heures.`, `À six heures.`) **also** start with `*À*`, so telling a child simply "the answer starts with *À*" does not uniquely pick out a place card.
* **Exact fix:** Scope the rule to the places in this game and specify a place name:

| Exact line(s) | Kind of problem | Exact fix | Confidence |
| --- | --- | --- | --- |
| Teaching card:<br>`Où ? \| Where? \| It asks where you are going. The answer starts with *À*: *À la poste.*`<br>`D'où ? \| Where from? \| The *d'* at the start means *from*. The answer starts with *De*: *De la poste.*`<br>Feedback:<br>`*À* for a *D'où* question \| Listen for *d'* at the start. *D'où* asks where you are coming from, so the answer starts with *De*.`<br>`*De* for an *Où* question \| *Où* asks where you are going, so the answer starts with *À*.` | **Overgeneralized grammar rule + overlap with time cards starting with *À*:** States unconditionally that answers start with *À* and *De* (ignoring masculine *Au* / *Du*), and overlooks that `À cinq heures.` / `À six heures.` also start with `À`. | • Teaching card `Où ?`: `In *Où allez-vous ?*, it asks where you are going. Here, the place answer starts with *À*: *À la poste.*`<br>• Teaching card `D'où ?`: `The *d'* at the start means *from*. Here, the place answer starts with *De*: *De la poste.*`<br>• Feedback (`*À* for a *D'où* question`): `Listen for *d'* at the start. *D'où* asks where you are coming from, so pick a place starting with *De*.`<br>• Feedback (`*De* for an *Où* question`): `*Où allez-vous ?* asks where you are going, so pick a place starting with *À*.` | **High** |

#### B. The "Listen for the vowel" Note (*deux / dix / douze* and *trois / treize / trente*)
* **Is it useful?**
  * **Yes, very useful.** English-speaking beginners rely heavily on word-final consonants and expect *dix* to end in `/s/` and *trois* to have no final consonant. In liaison before *heures* and *euros*, *dix heures* `[di.z‿œʁ]` and *trois euros* `[tʁwa.z‿øʁo]` both surface with a `/z/` sound, which frequently causes learners to confuse *dix heures* with *douze heures* and *trois euros* with *treize euros*. Directing attention to the vowel is great pedagogy.
* **Is it accurate?**
  * **No—there are two phonetic inaccuracies in how the note is written:**
    1. **False claim about `trente` vs. `trois / treize`:** The note says: *"each one links to that word with a 'z' or 't' sound: dix heures sounds like 'dee-zur'. So the ending won't tell them apart, but the vowel will."* In reality, **five** of the six numbers (*deux, dix, douze, trois, treize*) link to *heures* or *euros* with a **"z"** sound (`/z/`), whereas **only *trente*** links with a **"t"** sound (`/t/` in *trente euros* `[tʁɑ̃.t‿øʁo]`). So the ending **does** tell *trente* apart from *trois* and *treize*; it's the five "z"-linking numbers (especially *deux/dix/douze* and *trois/treize*) where the consonant sound is identical!
    2. **Mismatch between the "Hear it" table and the note:** The table above the note lists `deux · dix · douze` and `trois · treize · trente` **without** *heures* or *euros*. When the child presses **Hear it** on those isolated words, the speech synthesizer will pronounce *deux* `[dø]` and *trois* `[tʁwa]` with **no** final consonant and *dix* `[dis]` with an **"s"** sound, directly contradicting the note below it.

| Exact line(s) | Kind of problem | Exact fix | Confidence |
| --- | --- | --- | --- |
| `deux · dix · douze \| two · ten · twelve`<br>`trois · treize · trente \| three · thirteen · thirty`<br>`**Listen for the vowel.** In Madame Roux's answers these numbers come before *heures* or *euros*, and each one links to that word with a "z" or "t" sound: *dix heures* sounds like "dee-zur". So the ending won't tell them apart, but the vowel will. *Deux* has an "uh" sound, *dix* an "ee" sound and *douze* an "oo" sound. *Trois* has a "wah" sound, *treize* an "eh" sound and *trente* a nasal "ahn" sound.` | **Phonetic inaccuracy + isolated audio mismatch:**<br>1. `deux`, `dix`, `douze`, `trois`, and `treize` all link with a `"z"` sound before *heures/euros*, while only `trente` has a `"t"` sound.<br>2. Pressing **Hear it** on bare `deux · dix · douze` will not produce the `"z"` liaison described in the note. | 1. Either include `heures` / `euros` in the **Hear it** lines (`deux heures · dix heures · douze heures` and `trois euros · treize euros · trente euros`) or provide **Hear it** buttons for the linked phrases.<br>2. Rewrite the note:<br>`**Listen for the vowel.** Before *heures* or *euros*, *deux*, *dix*, *douze*, *trois* and *treize* all link to the next word with a "z" sound (*dix heures* sounds like "dee-zur", and *trois euros* sounds like "trwah-zuro"), while *trente* links with a "t" sound. Because those endings sound so similar, listen for the vowel: *deux* has an "uh" sound, *dix* an "ee" sound and *douze* an "oo" sound. *Trois* has a "wah" sound, *treize* an "eh" sound and *trente* a nasal "ahn" sound.` | **High** |

---

### 5. Beginner Load and Answer Giveaways (Six-Card Design & Feedback)

#### Beginner Load
* **Steps 1–4** are very well calibrated for ages 7–12: short, predictable prepositional phrases (`À la...`, `De la...`, `À ... heures`) and `Nous sommes ...`, with only three feminine nouns (*la poste*, *la boulangerie*, *la mairie*).
* **Step 5 vocabulary spike in Crossing 2:** Up through Crossing 1, a crossing/ferry is called *le bac* (`À quelle heure part le bac ?`). In Crossing 2 Step 5, the child must suddenly produce `« Combien coûte la traversée ? »`, introducing both *coûte* and a new noun *la traversée* ("the crossing") at once. It is manageable because of the **Hear how it sounds** model button, but slightly higher load than Crossing 1.

#### Answer Giveaways in the Six-Card Design & Feedback

| Exact line(s) | Kind of problem | Exact fix | Confidence |
| --- | --- | --- | --- |
| **Crossing 1 Answer cards:**<br>`«Nous sommes deux.» · «Nous sommes trois.» · «À la boulangerie.» · «À la poste.» · «De la poste.» · «À cinq heures.»`<br>**Crossing 2 Answer cards:**<br>`«Nous sommes deux.» · «Nous sommes trois.» · «À la mairie.» · «De la mairie.» · «De la boulangerie.» · «À six heures.»`<br>**Feedback:**<br>`The right kind, the wrong detail \| That's the right kind of answer. Check Dot's note for {how many / the time / the place}.` | **Single-card giveaway & unreachable feedback state (`{the time}`):**<br>Because 4 question types are fit into 6 cards:<br>• In **Crossing 1**, there is **only one** `De la...` card (`De la poste.`) and **only one** time card (`À cinq heures.`). For Steps 3 and 4, Dot's note is unneeded—only one card matches the question type.<br>• In **Crossing 2**, there is **only one** `À la...` destination card (`À la mairie.`) and **only one** time card (`À six heures.`).<br>• Consequently, `{the time}` in the `"The right kind, the wrong detail"` feedback line is **unreachable dead text** in both crossings—there is never a wrong time card to pick! | Either:<br>1. Remove `/ the time` from `{how many / the time / the place}` in the feedback table (if keeping 6 static cards per crossing), **or**<br>2. Expand the card pool to 8 cards (two per category, e.g. adding `De la boulangerie.` and `À six heures.` in Crossing 1, and `À la boulangerie.` and `À cinq heures.` in Crossing 2) so every question requires checking Dot's note and `{the time}` is reachable. | **High** |
| **Teaching card (`Question words`):**<br>`Où ? \| ... \| *À la poste.*`<br>`D'où ? \| ... \| *De la poste.*`<br>`Combien ? \| ... \| *Nous sommes deux.*`<br>`À quelle heure ? \| ... \| *À cinq heures.*` | **Teaching card gives away 3 of the 4 answers to Crossing 1:**<br>The teaching card is shown immediately before Crossing 1 and is accessible via link at any time during Crossing 1. Its example answers (`De la poste.`, `Nous sommes deux.`, `À cinq heures.`) are verbatim the exact fitting answers for Steps 1, 3, and 4 of Crossing 1. | Use different example details on the teaching card (e.g., `*À la mairie.*`, `*De la mairie.*`, `*Nous sommes quatre.*`, `*À huit heures.*`) so the reference card teaches the pattern without handing over Crossing 1's exact answers. | **High** |
| **Feedback (`A card of the wrong kind`):**<br>`Madame Roux asked *{question word}*. That asks for {a number / a time / where you are going / where you are coming from}. Listen again.` | **Listening giveaway after a single wrong click:**<br>Even when Madame Roux's written words are hidden to test listening, a single wrong pick immediately reveals in text both the exact French question word she spoke and its English meaning, making `"Listen again."` at the end largely redundant. | Avoid naming and translating the exact question word on the first wrong pick; instead tell the child what kind of card they picked, e.g.:<br>`That card tells {how many / the time / where you are going / where you are coming from}. Listen again to the start of Madame Roux's question.` | **Medium** |

---

### 6. Speech Synthesizer (TTS) Hazards in the French Lines

Because the game relies on the device's built-in French speech synthesizer (`window.speechSynthesis` / OS TTS voices) rather than recorded audio, these strings are likely to be misread unless handled carefully:

| Exact line(s) | Kind of problem | Exact fix | Confidence |
| --- | --- | --- | --- |
| `deux · dix · douze`<br>`trois · treize · trente` | **Middle dot (`·`) and isolated-number pronunciation in TTS:**<br>1. Passing a string separated by middle dots (`·`, `U+00B7`) to OS TTS engines often causes the voice to run the words together without pauses or misparse the punctuation.<br>2. In isolation, TTS reads `dix` as `[dis]` (with an `/s/`), `deux` as `[dø]`, and `trois` as `[tʁwa]`, so the learner will not hear the `/z/` liaison described in the teaching note below. | 1. In the TTS payload, replace ` · ` with commas/periods (`deux, dix, douze.` or separate buttons), never raw `·`.<br>2. Have the audio speak the numbers in context (`deux heures, dix heures, douze heures` and `trois euros, treize euros, trente euros`), or provide both isolated and linked audio buttons. | **High** |
| All lines wrapped in `«...»`, e.g.:<br>`«Combien de colis avez-vous ?»`, `«Nous sommes deux.»`, `«Merci. Montez, s'il vous plaît !»` | **Guillemets read aloud by some TTS engines:**<br>If `«` and `»` are included in the string sent to the synthesizer, several OS/browser TTS profiles read them aloud as *"guillemet"* or *"ouvrez les guillemets"*. | Strip `«` and `»` from all strings passed to the speech synthesizer (display-only punctuation). | **High** |
| `Où ?`<br>`D'où ?` | **Clipped initial consonant on 1-syllable TTS utterances:**<br>Many browser/OS TTS engines slightly clip the first 50–100 ms when waking the audio pipeline or flatten prosody on a one-syllable string, which can make the initial `/d/` of `D'où ?` hard to distinguish from `Où ?`. | Have the **Hear it** button on the `Où ?` and `D'où ?` rows speak either the full question (`Où allez-vous ?` / `D'où venez-vous ?`) or `Où ? — Où allez-vous ?` so the `/d/` of `D'où` is clearly audible and not clipped at audio start. | **Medium** |
| `Le bac part à dix heures.`<br>`À cinq heures.`<br>`À six heures.`<br>`La traversée coûte trois euros.`<br>`Merci. Montez, s'il vous plaît !` | **Liaisons and *s'il vous plaît* check:**<br>Standard `fr-FR` TTS engines handle mandatory liaisons in `dix‿heures` (`[dizœʁ]`), `six‿heures` (`[sizœʁ]`), `cinq‿heures` (`[sɛ̃kœʁ]`), and `trois‿euros` (`[tʁwazøʁo]`), as well as `s'il vous plaît` and `Combien êtes-vous ?` (no liaison after *combien*), accurately as written. (Note: in French, 12:00 is normally *midi* / *minuit*, so it is good that Madame Roux says *dix heures* rather than *douze heures*.) | No text change needed for these lines; keep the comma in `Montez, s'il vous plaît !` so TTS pauses after `Montez`. | **High** |

---

### Overall Verdict

**Usable with the listed fixes.**

The core scenario, French grammar, and beginner scaffolding are well designed, but before shipping you should fix:
1. The missing spaces inside French guillemets (`« ... »`) and non-breaking spaces before `?` / `!`.
2. The phonetic inaccuracy in the **"Listen for the vowel"** note (where *trois* and *treize* link with `"z"` like *deux/dix/douze*, and only *trente* links with `"t"`) and the isolated TTS audio on that card (`deux · dix · douze` without *heures/euros*).
3. The misleading `Où ?` / `Combien ?` glosses and overgeneralized `*À*` / `*De*` rule on the teaching card.
4. The answer giveaways (the teaching card using Crossing 1's exact answers, and the unreachable `{the time}` feedback branch when only one time card exists per crossing).
