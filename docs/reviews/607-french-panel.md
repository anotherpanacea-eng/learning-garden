# 607 · French language panel: the long rain's warning card

Method: spec 117's [language review method](../specs/117-spanish-river-market.md#language-review-method--owner-decision-2026-10-30) (owner decision 2026-10-30), which applies to French content. Three current frontier models from different providers reviewed each round separately, without seeing each other's answers:
- OpenAI (Codex CLI);
- Google (Gemini, `agy --model gemini-4-argon-high`);
- Anthropic (a separate Claude agent with no tools).

Date: 2026-11-08. Reviewed text: the French and English glosses in `dist/act-six-content.mjs` under `rain.warning`, and act-6.md's warning card, as revised below.

## Round 1 packet

# French language review packet: Learning Garden, Act VI chapter 3 (the long rain)

Context: a children's learning game (ages about 6–11, beginners in French). Willowbank is an English-speaking village; Les Saules is a French-speaking town downstream. The child's courier carries a short flood warning to Léon at Les Saules. Willowbank addresses the town with *vous* (plural, to everyone there). The French should be simple, standard French (France), correct for beginners.

## The warning card (English, then French)
EN: The brook is rising. It will reach you tomorrow morning. From Willowbank.
FR: Le ruisseau monte. Il arrivera chez vous demain matin. De la part de Willowbank.

## Seedling: choose the French card that matches the English (one right, two deliberately wrong)
1. Le ruisseau monte. Il arrivera chez vous demain matin. De la part de Willowbank.  (right)
2. Le ruisseau descend. Il arrivera chez vous demain matin.  (wrong on purpose: "the brook is going down")
3. Le ruisseau monte. Il est arrivé chez nous hier.  (wrong on purpose: "it reached us yesterday")
Feedback shown after choosing:
- right: "Yes. It says the brook is rising, and it will reach them tomorrow morning."
- 2: "Not this one. *Descend* means the brook is going down."
- 3: "Not this one. *Il est arrivé chez nous hier* means it reached us yesterday."

## Sapling: build the card from word cards (French, with the English gloss shown under each card)
Le ruisseau — the brook
monte — is rising
descend — is going down   (distractor)
Il arrivera — it will arrive
chez vous — at your place
demain matin — tomorrow morning
ce soir — this evening   (distractor)
De la part de Willowbank — from Willowbank
Intended answer: Le ruisseau / monte / Il arrivera / chez vous / demain matin / De la part de Willowbank
Feedback lines: "*Descend* means going down. The brook is rising." · "*Ce soir* means this evening. The water reaches Les Saules tomorrow morning." · "Not quite yet. Start with what is happening: *Le ruisseau monte*."

Note: the cards join into "Le ruisseau monte Il arrivera chez vous demain matin De la part de Willowbank" with no punctuation between cards; the finished card is then shown with full punctuation.

## Questions for the reviewer
1. Report any grammar or spelling errors in the French.
2. Report unnatural or regionally odd wording, and whether a native speaker would write a flood warning this way (e.g. "Il arrivera chez vous" for floodwater: does "il" clearly refer to "le ruisseau"? Is "arrivera chez vous" natural for a rising brook, or would "atteindra" / "sera chez vous" be better for beginners?).
3. Report glosses that mislead (e.g. "chez vous" = "at your place"; "Il arrivera" = "it will arrive").
4. Check the two wrong choices: are they wrong in exactly the one way described, and grammatical?
5. Beginner load and answer giveaways: can a beginner solve the choice by surface matching only? Is that acceptable for this level?
6. The *vous* choice: confirm it is right for addressing a whole town, or propose a framing.
State your confidence (high/medium/low) for each answer. Give concrete replacement text for anything you would change. Keep it under 400 words.

## Round 1 reports

### OpenAI (Codex)

1. **Grammar/spelling — high confidence.** No errors in the supplied French. *De la part de Willowbank* works as a message attribution, understood as coming from its inhabitants. The unpunctuated assembly is acceptable during building if the finished card restores sentence boundaries.

2. **Naturalness — high confidence.** *Il* clearly refers grammatically to *le ruisseau*, but a brook “arriving” sounds awkward: the approaching thing is its floodwater. No regional oddity; this is a wording issue. My beginner-friendly replacement is:

   **Le ruisseau monte. L’eau arrivera chez vous demain matin. De la part de Willowbank.**

   This is plausible in a simple village warning. *L’eau atteindra votre ville* is more precise but introduces harder vocabulary. *Il sera chez vous* retains the awkward referent.

3. **Glosses — high confidence.** Most are accurate. *Il arrivera* = “it will arrive” is correct. With the replacement, use **L’eau arrivera — the water will arrive**. *Chez vous* = “at your place” is a useful basic gloss, but after *arrivera*, **“where you live”** better conveys the intended destination. Here it means the residents’ locality, without necessarily implying inside every home.

4. **Wrong choices — high confidence.** Both are grammatical, but neither isolates one difference perfectly: both omit the sender, and choice 3 changes tense, destination/person, and time. Also, *descend* can describe a stream flowing downhill, so it does not unambiguously mean its level is falling ([Larousse](https://www.larousse.fr/dictionnaires/francais/descendre/24274)). Use these complete alternatives:

   **2. Le ruisseau baisse. L’eau arrivera chez vous demain matin. De la part de Willowbank.**  
   **3. Le ruisseau monte. L’eau arrivera chez vous ce soir. De la part de Willowbank.**

   Update the distractor/gloss to **baisse — is falling**, and feedback accordingly.

5. **Beginner load/giveaways — medium confidence.** Currently, the sender appears only in the correct choice: a strong giveaway. Equalize it across choices. Recognition and gloss matching are appropriate scaffolding, but success does not establish independent comprehension. Capitals also cue assembly order; that is acceptable here.

6. **Vous — high confidence.** Correct for addressing the inhabitants collectively. Add the English framing **“A message to everyone in Les Saules; Léon will share it.”** This prevents confusion with addressing Léon alone.

### Google (Gemini)

### 1. Grammar and spelling (**Confidence: High**)
No grammar or spelling errors. All verb conjugations and agreements (*Il est arrivé* with masculine *le ruisseau*) are correct.

### 2. Naturalness and native flood-warning phrasing (**Confidence: High**)
- **« Le ruisseau monte »** is natural.
- **« Il arrivera chez vous »**: If Les Saules is already on the brook downstream, the brook itself is already there—it is the **water/flood** (*l’eau*) that arrives. Still, for A1 beginners, keeping *Il* (or switching to *L’eau*) works well. **« Arrivera chez vous »** (or *sera chez vous*) is much better for beginners than *atteindra* (which is literary and harder to conjugate).
- **« Le ruisseau descend »** (Distractor 2): Native speakers say *le ruisseau/l’eau baisse* for falling water levels (*descend* usually means "flows downhill"). However, *descend* is acceptable at this level to pair the core opposites *monter / descendre*.
- **« De la part de Willowbank »**: Means "On behalf of Willowbank" (natural when spoken or delivered by a courier).
- **Optional natural tweak:**
  > *Le ruisseau monte. L’eau arrivera chez vous demain matin. De la part de Willowbank.*

### 3. Glosses and feedback accuracy (**Confidence: High**)
- **« Il arrivera » (it will arrive) + « chez vous » (at your place)**: Good literal scaffolding to show how French expresses "will reach you," though for a whole town, glossing *chez vous* as **"to you / at your place"** connects better with the English card.
- **Sapling feedback**: `Descend` is a conjugated verb, so match the card gloss:
  > **Replace:** `"*Descend* means is going down. The brook is rising."`

### 4. The two wrong choices (**Confidence: High**)
Both are grammatical, but **neither is wrong in only one way**: Choices 2 and 3 both omit *« De la part de Willowbank. »*
- **Replace Choice 2:** `Le ruisseau descend. Il arrivera chez vous demain matin. De la part de Willowbank.`
- **Replace Choice 3:** `Le ruisseau monte. Il est arrivé chez nous hier. De la part de Willowbank.`

### 5. Beginner load and answer giveaways (**Confidence: High**)
In Seedling, **Choice 1 is the only card containing the word "Willowbank" and three sentences.** A child can pick it by spotting the English town name without reading any French. Adding *« De la part de Willowbank. »* to Choices 2 and 3 (above) removes this giveaway while keeping the cognitive load light.

### 6. Use of *vous* (**Confidence: High**)
**Confirmed.** *Chez vous* is completely natural both for addressing the whole town (plural *vous*) and for addressing Léon and his community ("at your place/town"). No changes needed.

### Anthropic (Claude)

1. Grammar and spelling: no errors (high confidence). All lines, including both distractors, are correct.
2. Naturalness (medium-high): *il* clearly refers to *le ruisseau*. *Arrivera chez vous* is natural and common for water ("l'eau arrivera chez vous"); *atteindra* is more formal and harder for beginners; *sera chez vous* is less idiomatic. *De la part de Willowbank* is the right idiom for "from X" on a message.
3. Glosses: *chez vous* = "at your place" is acceptable (medium); *Il arrivera* = "it will arrive" is correct; *De la part de* is literally "on behalf of", and "from" is a fair gloss.
4. Wrong choices (high): choice 2 also omits the signature; add *De la part de Willowbank.* so the only difference is *monte/descend*. Choice 3 differs in tense, person and time, plus the missing signature; optionally reduce it.
5. Giveaways (medium): solvable by surface matching; acceptable at Seedling; keep the signature on all three cards so length is not a cue.
6. *Vous* (high): correct for a whole town, and for Léon.
(Report summarized from the reviewer's full text; no errors were marked.)

## Resolution

| Flag | Reviewers | Resolution |
| --- | --- | --- |
| Only the right choice carried *De la part de Willowbank*, a giveaway | All three | Applied: the signature is on every choice. |
| *Il arrivera*: a brook "arriving" is odd, since its water arrives | Codex (recommends *L'eau*), Gemini (offers *L'eau* as a tweak), Claude (keep *Il*, but calls *l'eau arrivera chez vous* natural and common) | Applied the simplest wording every reviewer accepts: *L'eau arrivera chez vous demain matin.* Gloss: *L'eau arrivera* = the water will arrive. |
| *Descend* usually means flowing downhill, not a falling level | Codex (use *baisse*), Gemini (natives say *baisse*; *descend* acceptable) | Applied *baisse* in choice 2, the word card and the feedback. |
| Choice 3 was wrong in three ways | All three | Applied Codex's *Le ruisseau monte. L'eau arrivera chez vous ce soir. De la part de Willowbank.* It now differs only in time, and matches the *ce soir* word card. Feedback: *Ce soir* means this evening. |
| *Chez vous* gloss | All three accept "at your place"; optional alternatives were "where you live" and "to you" | Kept "at your place". |
| *Vous* for a whole town | All three confirm | No change. |

act-6.md's warning card and Seedling choices were updated to match, marked as revised by this panel.

## Round 2 packet (revised lines only)

# French language review, round 2: revised lines only (Learning Garden, Act VI, the long rain)

Context: a children's game (ages about 6–11, beginners in French). Willowbank (English-speaking) sends a flood warning to the French-speaking town of Les Saules, downstream, addressed to everyone there with *vous*. Simple, standard French (France).

## Warning card
EN: The brook is rising. It will reach you tomorrow morning. From Willowbank.
FR: Le ruisseau monte. L’eau arrivera chez vous demain matin. De la part de Willowbank.

## Seedling: choose the French card that matches the English (one right, two each wrong in one way)
1. Le ruisseau monte. L’eau arrivera chez vous demain matin. De la part de Willowbank.  (right)
2. Le ruisseau baisse. L’eau arrivera chez vous demain matin. De la part de Willowbank.  (wrong: the brook is going down)
3. Le ruisseau monte. L’eau arrivera chez vous ce soir. De la part de Willowbank.  (wrong: this evening)
Feedback: right — "Yes. It says the brook is rising, and it will reach them tomorrow morning." · 2 — "Not this one. *Baisse* means the brook is going down." · 3 — "Not this one. *Ce soir* means this evening. The water reaches them tomorrow morning."

## Sapling word cards (French — English gloss)
Le ruisseau — the brook · monte — is rising · baisse — is going down (distractor) · L’eau arrivera — the water will arrive · chez vous — at your place · demain matin — tomorrow morning · ce soir — this evening (distractor) · De la part de Willowbank — from Willowbank
Answer: Le ruisseau / monte / L’eau arrivera / chez vous / demain matin / De la part de Willowbank
Feedback: "*Baisse* means going down. The brook is rising." · "*Ce soir* means this evening. The water reaches Les Saules tomorrow morning." · "Not quite yet. Start with what is happening: *Le ruisseau monte*."

Question: Is every French line and gloss above correct, natural for beginners, and is each wrong choice wrong in exactly one way? Mark anything you consider an ERROR (must fix) separately from optional suggestions, with confidence and replacement text. End with one line: "PANEL: ACCEPT" if you find no errors, otherwise "PANEL: ERRORS". Under 250 words.

## Round 2 reports

### OpenAI (Codex)

ERRORS: None. Confidence: high.

All French lines are correct, natural in standard French (France), and suitable for beginners. All word-card glosses are accurate. *Chez vous* works when addressing everyone in Les Saules; *De la part de Willowbank* naturally identifies the sender.

Each wrong choice changes exactly one thing:

- **Choice 2:** *baisse* replaces *monte*, reversing the direction of change.
- **Choice 3:** *ce soir* replaces *demain matin*, changing the arrival time.

The answer sequence and all feedback correctly reflect those distinctions.

Optional suggestion (high confidence): In the word cards, **chez vous — “at your place”** is correct, but **“at/to your place”** would also show how it works with *arrivera*. No replacement is necessary.

PANEL: ACCEPT

### Google (Gemini)

### Review Summary (**Confidence: High**)

Every French line and gloss is grammatically correct, natural in standard French, and well-suited for beginners (ages 6–11). Switching to *« L’eau arrivera »*, *« baisse »*, and *« ce soir »* resolves all previous issues cleanly. Each wrong choice in Seedling is now wrong in **exactly one way** with no visual length or English-name giveaways.

### Errors (Must Fix)
None.

### Optional Suggestions (**Confidence: High**)
1. **Align feedback phrasing with the exact Sapling card gloss (*baisse — is going down*):**
   - **Seedling Feedback 2:** *Baisse* is only the verb, not "the brook."
     - **Replace:** `"Not this one. *Baisse* means is going down. The brook is rising."` (or `"Not this one. *Le ruisseau baisse* means the brook is going down."`)
   - **Sapling Feedback 1:** Match the conjugated gloss (*is going down*) rather than the participle (*going down*).
     - **Replace:** `"*Baisse* means is going down. The brook is rising."`
2. **Sapling gloss for *chez vous*:**
   - **Optional tweak:** `chez vous — to you / at your place` to bridge the literal French meaning with the English warning card (*"will reach you"*).

PANEL: ACCEPT

### Anthropic (Claude)

ERRORS found: none. All French and glosses are correct. *L'eau arrivera chez vous demain matin* is correct and natural; *baisse* is the standard verb for a falling water level; each distractor changes exactly one thing (*monte→baisse*; *demain matin→ce soir*) and is grammatical. Feedback lines are accurate. Optional only: the word card *L'eau arrivera* is a chunk for beginners, which works here.
PANEL: ACCEPT

## After round 2

All three: **PANEL: ACCEPT**, no errors. One English-only clarity edit came from Gemini's optional note: the Seedling feedback now reads "Not this one. *Le ruisseau baisse* means the brook is going down." No French changed after round 2.

Known limit, as in spec 117: a model panel can miss wording that is correct but sounds odd to a native speaker. That risk is accepted for beginner-level content.
