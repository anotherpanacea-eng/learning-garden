# Spec 327 French: OpenAI

Reviewer: OpenAI gpt-6.1-sol, reasoning effort low, through Codex CLI 0.160.0 in a read-only sandbox on Code-PC, 2026-10-31. It ran four web searches, citing Larousse and the OQLF. Run alone in an empty directory, with the [prompt](prompt.md) and the companion at `98d106f` on stdin. The report below is the raw output, byte for byte.

---

**Usable with the listed fixes.** The French dialogue is grammatical, clear and appropriate for beginners. The main problems are overgeneralized teaching notes and claims about what the listening activity demonstrates. I reviewed the supplied text; I did not test a device’s speech voice.

### 1. Grammar, spelling, accents and punctuation

| Exact line or text | Kind of problem | Exact fix | Confidence |
| --- | --- | --- | --- |
| `«Combien de colis avez-vous ?»` | French typography: missing spaces inside guillemets. This occurs throughout the quoted French. | `« Combien de colis avez-vous ? »` Apply the same spacing throughout: a nonbreaking space after `«` and before `»`, and preferably a narrow nonbreaking space before `?` and `!`. | High |
| `# 327 · Le bac: finite text` | Minor typography, if this is treated as a French title. It is otherwise an English document heading containing a French phrase. | `# 327 · Le bac : finite text` | High |

The existing ordinary spaces before **?** and **!** are present and correct in principle; make them nonbreaking for display. There are **no substantive grammar, spelling, accent or agreement errors** in the French. In particular:

- **vous** correctly addresses the group.
- **Nous sommes deux/trois**, **Trois colis**, **cinq/six/dix heures** and **trois euros** are correct.
- **s'il vous plaît**, **D'où**, **À**, **coûte** and **C'est parti !** are correctly written.
- Apostrophes can be made typographic consistently, but straight apostrophes are not spelling errors.

### 2. Naturalness and register

| Exact line | Judgment and kind of issue | Exact fix | Confidence |
| --- | --- | --- | --- |
| `Bonjour ! Combien êtes-vous ?` | Natural in a service encounter, including counting ferry passengers. Polite and slightly more careful than conversational **Vous êtes combien ?**, but not excessively formal. | **Keep.** Optional conversational alternative: `Bonjour ! Vous êtes combien ?` | High |
| `Nous sommes deux.` / `Nous sommes trois.` | Natural, clear answers at a ferry. **On est deux/trois** is more conversational, but the existing answers are entirely suitable for children learning reusable phrases. | **Keep.** If deliberately choosing a conversational register, use `On est deux.` / `On est trois.` consistently. | High |
| `Où allez-vous ?` / `D'où venez-vous ?` / `À quelle heure revenez-vous ?` | Standard polite French. Their repeated inversion gives a slightly textbook-like register, but nothing unnatural enough to require replacement. | **Keep.** | High |
| `À quelle heure part le bac ?` / `Combien coûte la traversée ?` | Both natural, useful questions. | **Keep.** | High |
| `Merci. Montez, s'il vous plaît !` | Natural boarding instruction. The exclamation mark can suggest a lively invitation or a more forceful call, depending on delivery. | **Keep.** For a calmer voice: `Merci. Montez, s'il vous plaît.` | High |

**Le bac**, **la traversée**, **la mairie** and **la boulangerie** are appropriate everyday France vocabulary. Nothing here requires a regional-language warning. I would retain **Combien êtes-vous ? / Nous sommes deux.** rather than add alternative forms to this small beginner set.

### 3. English glosses

The dialogue and answer-card glosses are accurate. **“There are two of us”** is a particularly good idiomatic gloss of **Nous sommes deux**.

| Exact line | Kind of problem | Exact fix | Confidence |
| --- | --- | --- | --- |
| `Combien ?` → `How many?` | Incomplete across this game: later **combien coûte** means “how much … costs.” The existing gloss is correct for counting people or parcels. | Change the teaching-card English to `How many? / How much?` Add: `For people or things, it asks how many. In “Combien coûte… ?”, it asks how much something costs.` | High |
| `Montez, s'il vous plaît !` → `Climb aboard, please!` | Accurate, though “climb” slightly emphasizes physical climbing. | Optional smoother gloss: `Come aboard, please!` | High |

**Le bac → The ferry crossing** is acceptable as an activity title. As a vocabulary gloss, **bac** means the ferry; **traversée** means the crossing. No title change is necessary.

### 4. Teaching notes

The **Où / D'où** contrast is useful, but the wording turns local patterns into general rules. **Où** asks about location or destination depending on the whole question; it does not itself mean “where are you going.” [Larousse’s entry for *où*](https://www.larousse.fr/dictionnaires/francais/o%C3%B9/56842) explicitly covers both location and direction.

| Exact line | Kind of problem | Exact fix | Confidence |
| --- | --- | --- | --- |
| `It asks where you are going. The answer starts with À: À la poste.` | Overgeneralization. **Où êtes-vous ?** asks where you are; destination answers can also begin **Au**, **En**, **Chez**, etc. | `“Où ?” means “Where?” Here, “Où allez-vous ?” asks where you are going. Our answer cards start with À: À la poste.` | High |
| `The d' at the start means from. The answer starts with De: De la poste.` | First sentence is accurate here. Second is too general: answers can begin **Du**, **Des**, **D'**, or include a full sentence. | `The d' is a shortened form of de, meaning “from” here. “D'où venez-vous ?” asks where you are coming from. Our answer cards start with De: De la poste.` | High |
| `D'où asks where you are coming from, so the answer starts with De.` | Same overgeneralization in feedback. | `“D'où venez-vous ?” asks where you are coming from. Look for a card starting with De.` | High |
| `Où asks where you are going, so the answer starts with À.` | Same overgeneralization in feedback. | `“Où allez-vous ?” asks where you are going. Look for a card starting with À.` | High |

**“One small sound, d', changes the question”** is accurate and worth retaining.

The number note needs a more substantial correction:

| Exact line | Kind of problem | Exact fix | Confidence |
| --- | --- | --- | --- |
| `each one links to that word with a "z" or "t" sound` | Broadly describes the connected sounds, but conflates liaison with an already pronounced consonant joining the next word. | Use the replacement paragraph below. | High |
| `dix heures sounds like "dee-zur"` | Misleading English respelling: **heures** has the French /œ/ vowel, not a reliable English “ur.” | Delete the respelling; supply a **Hear it** model of `dix heures`. | High |
| `So the ending won't tell them apart, but the vowel will.` | False for the second group: **trente euros** has /t/ where **trois euros** and **treize euros** have /z/. Those consonants are useful clues too. | Use the replacement paragraph below. | High |
| `Deux has an "uh" sound … trente a nasal "ahn" sound.` | English approximations are accent-dependent. “Uh” poorly represents /ø/; “ahn” can encourage a pronounced /n/. | Remove the respellings and model complete phrases. | High |

Replace the whole **Listen for the vowel** paragraph with:

> **Listen for the differences.** Hear these phrases: *deux heures, dix heures, douze heures*; *trois euros, treize euros, trente euros*. Each group has different vowel sounds. Listen to the whole phrase, too: *trente euros* has a “t” sound where *trois euros* and *treize euros* have a “z” sound. Hear them again and compare.

Give each complete phrase its own **Hear it** button. Isolated **dix** normally ends in /s/, whereas **dix heures** has /z/; practising only isolated numbers obscures the actual listening target. [OQLF’s pronunciation reference](https://vitrinelinguistique.oqlf.gouv.qc.ca/23137/la-prononciation/prononciation-des-nombres/prononciation-de-six-et-dix) confirms this contextual change.

For adult QA, the relevant forms are:

| Phrase | Expected pronunciation |
| --- | --- |
| deux heures / dix heures / douze heures | /dø.zœʁ/ · /di.zœʁ/ · /du.zœʁ/ |
| trois euros / treize euros / trente euros | /tʁwa.zø.ʁo/ · /tʁɛ.zø.ʁo/ · /tʁɑ̃.tø.ʁo/ |

The /z/ in **douze/treize** and /t/ in **trente** are already pronounced in the numbers themselves; they are not newly supplied liaison consonants.

### 5. Beginner load and giveaways

Six cards are manageable for this audience with English support, replay and untimed attempts. The short answer fragments are a strength. The following limitations matter:

| Exact line or design | Kind of problem | Exact fix or recommendation | Confidence |
| --- | --- | --- | --- |
| Crossing 1: `De la poste.` and `À cinq heures.`; Crossing 2: `À la mairie.` and `À six heures.` | Each is the only card of its category. Recognizing “origin,” “destination” or “time” can reveal the answer without understanding the place or hour. | **Keep as supported practice**, but do not treat these picks as evidence of detailed listening comprehension. If detail discrimination becomes a goal, provide a same-category alternative. | High |
| `Two of us…` / `Three of us this time…`, alongside English card glosses | Dot’s note supplies the situation’s answers. With the question translation visible, a learner can solve the task entirely through English. | **Keep as scaffolding.** Do not count a successful pick as proof that the French was understood. | High |
| `Madame Roux asked {question word}. That asks for…` and the À/De feedback | Feedback deliberately reveals the question category and sometimes uniquely identifies the answer. | **Keep**, using the scoped replacements above. Any successful retry is a supported response. | High |
| `Close. Those numbers sound alike. Hear her again and listen for the vowel.` | “Close” is not necessarily true of the selected value; “vowel” excludes useful consonant cues. | `Those numbers can sound similar. Hear her again and compare the whole number.` | High |
| `That's what she asked. Now say it to her.` | Slightly ambiguous: the card is an answer to her question. | `That answer fits. Now say it to her.` | High |
| `Listening is observed only when Madame Roux's words stayed hidden and a French voice spoke them.` | Overclaims observation. Playback and hidden words do not establish attention or comprehension. | `The notes record whether a French voice played Madame Roux's line while her French words stayed hidden. They do not show whether the explorer listened or understood.` | High |

The unintroduced shift from **combien = how many** to **combien coûte = how much** is the clearest avoidable beginner burden; fix it in the teaching card as above.

### 6. Speech synthesis

**No French line requires a phonetic rewrite.** Standard French spelling gives a French synthesizer the right input. Actual reliability remains voice-dependent.

| Exact line | Risk and exact action | Confidence |
| --- | --- | --- |
| `Bonjour ! Combien êtes-vous ?` | Check the /z/ in **vous** after **êtes-**: /ɛt vu/ is the inverted sequence **êtes-vous**; there is no added /z/ between those words. Preserve the hyphen and punctuation. | High |
| `Où allez-vous ?` / `D'où venez-vous ?` | Preserve accents, apostrophe and hyphens. **D'où** should begin /du/, with no extra vowel after /d/. | High |
| `À cinq heures.` / `À six heures.` / `Le bac part à dix heures.` | Check /sɛ̃.kœʁ/, /si.zœʁ/ and /di.zœʁ/. **heures** has no audible /h/. Synthesize complete phrases. | High |
| `La traversée coûte trois euros.` | Check the /z/ connection in **trois euros** and that **euros** begins with a French vowel, not English “yoo.” | High |
| `Merci. Montez, s'il vous plaît !` | Standard spelling is suitable. Check ordinary /sil vu plɛ/: no /z/ between **vous** and **plaît**, and no final /t/ in **plaît**. | High |
| `deux · dix · douze` / `trois · treize · trente` | A voice may handle middle dots inconsistently. Give each number or model phrase a separate speech action instead of speaking the displayed list as one string. | Medium |
| All questions ending in `?` | Keep the question marks. A French *wh*-question need not have English-style rising intonation; a falling contour is not automatically wrong. Feed only the French line to a French, preferably **fr-FR**, voice. | High |

The first row’s practical check is simply that **êtes-vous** sounds like /ɛt vu/, not a fabricated liaison. None of these predicted checks constitutes a tested voice defect.

**Overall verdict: usable with the listed fixes.** Retain the dialogue and **Nous sommes** answers; correct the teaching notes, qualify the listening record, and check the complete phrases in the actual device voice.