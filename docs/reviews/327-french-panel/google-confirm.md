# Spec 327 French confirmation pass: Google

Reviewer: Google Gemini 4 Argon (High), `gemini-4-argon-high`, Antigravity CLI agy 1.4.11, on Code-PC, 2026-10-31, at `78d16bd`. The report below is the raw output, byte for byte.

---

Here is the confirmation review of the new and changed lines only.

### 1. Teaching-card examples & 2. The four teaching-card notes
* **Status of the French examples:** *« À la gare. »*, *« De la gare. »*, *« Nous sommes quatre. »*, and *« À huit heures. »* are grammatical, natural in this beginner register, and remove the Crossing 1 giveaway.
* **Issue 1a — Unglossed French examples and a misleading colon after "how many" (`Combien ?` note):**
  * **Problem:** The companion rule states *"Every French line has the English beside it,"* and this card is shown before Crossing 1. Unlike the old examples (which were glossed in the Crossing 1 table), *gare*, *quatre*, and *huit* appear nowhere else in the text. In addition, the first, second, and fourth notes introduce their example as an answer (*"the place answer starts with…"*, *"The answer has a time:"*), whereas the *Combien ?* note places *« Nous sommes quatre. »* directly after *"it asks how many:"*—making an unglossed answer look like a way of asking "how many?".
  * **Exact fix:** Name the answer role in the *Combien ?* note and gloss all four examples inline:
    * **Où ? note:** `Here, *Où allez-vous ?* asks where you are going. In this game, the place answer starts with *À*: *À la gare.* (To the station.)`
    * **D'où ? note:** `Here, *d'* is a short form of *de*, meaning "from". *D'où venez-vous ?* asks where you are coming from. In this game, the place answer starts with *De*: *De la gare.* (From the station.)`
    * **Combien ? note:** `For people or things, it asks how many, and the answer gives a number: *Nous sommes quatre.* (There are four of us.) In *Combien coûte… ?*, it asks how much something costs.`
    * **À quelle heure ? note:** `The answer has a time: *À huit heures.* (At eight o'clock.)`
  * **Confidence:** High.
* **Issue 1b — Garden-path wording in the `D'où ?` note (*"meaning from here"*):**
  * **Problem:** In *"The *d'* is a short form of *de*, meaning *from* here,"* placing *here* immediately after *from* easily reads aloud as the phrase *"from here"* (*d'ici*) rather than *"meaning 'from' in this context."*
  * **Exact fix:** Move *Here* to the start of the sentence (matching the *Où ?* note above it):
    `Here, *d'* is a short form of *de*, meaning "from".`
  * **Confidence:** High.

---

### 3. The sounds card's six linked phrases and its 'Listen for the differences' note
* **Status:** All six phrases (*deux heures*, *dix heures*, *douze heures*, *trois euros*, *treize euros*, *trente euros*) and their glosses are accurate. The note accurately describes both the vowel contrasts and the liaison/enchaînement consonant contrast ([t] in *trente euros* vs. [z] in *trois euros* and *treize euros*).
* **Issue 3a — Slight ambiguity in *"has a 't' sound where…"*:**
  * **Problem:** Because *trois*, *treize*, and *trente* all begin with a "t" sound (*tr-*), specifying that the "t" vs. "z" contrast occurs between the words makes the listening cue clearer for a child.
  * **Exact fix:**
    `**Listen for the differences.** Hear these phrases: *deux heures, dix heures, douze heures*; *trois euros, treize euros, trente euros*. Each group has different vowel sounds. Listen to the whole phrase, too: *trente euros* links with a "t" sound before *euros*, where *trois euros* and *treize euros* link with a "z" sound. Hear them again and compare.`
  * **Confidence:** Medium.

---

### 4. The eight-card sets
* **Issue 4a — Position and sequence giveaway in Crossing 1's eight-card list:**
  * **Problem:** In Crossing 1, the four pairs are ordered in the exact sequence of Steps 1–4 (how many → going to → coming from → time), and the fitting card is the **first card of every pair** (cards 1, 3, 5, and 7). Pair 3 (*« De la poste. » · « De la boulangerie. »*) even reverses the place order of Pair 2 (*« À la boulangerie. » · « À la poste. »*) so that the fitting card stays first.
  * **Exact fix:** Keep a consistent place order across Pairs 2 and 3 (just as Crossing 2 does with *mairie* then *boulangerie*) so the fitting card is not always first in its pair:
    `**Answer cards**, two of each kind, in this order: « Nous sommes deux. » · « Nous sommes trois. » · « À la boulangerie. » · « À la poste. » · « De la boulangerie. » · « De la poste. » · « À cinq heures. » · « À six heures. »`
    *(And swap the two *De* rows in the Crossing 1 table to match.)*
  * **Confidence:** High.
* **Issue 4b — Redundant rows in the Crossing 2 gloss table contradicting the note beneath it:**
  * **Problem:** The note below the Crossing 2 table states: *"The *Nous sommes* cards, *À la boulangerie.*, *De la boulangerie.* and both time cards use the English from crossing 1."* However, `De la boulangerie.` and `À six heures.` are still listed inside the Crossing 2 table (left over from the 4-card version), while the other four shared cards are omitted.
  * **Exact fix:** Remove the two duplicate rows from the Crossing 2 table so it lists only the two cards new to Crossing 2:
    ```markdown
    | Card | English |
    | --- | --- |
    | À la mairie. | To the town hall. |
    | De la mairie. | From the town hall. |
    ```
  * **Confidence:** High.

---

### 5. Crossing 1 ending: *« Merci. Montez, s'il vous plaît. »* ('Thank you. Come aboard, please.')
* **Status:** Grammatical, natural polite *vous* imperative, and accurately glossed. No fix needed.

---

### 6. The four feedback lines
* **Issue 6a — Giveaway in the `*À* for a *D'où* question` and `*De* for an *Où* question` feedback lines:**
  * **Problem:** Change 8 updated the wrong-kind feedback so it tells the child what the *picked card* says rather than naming and translating Madame Roux's hidden question. However, the two *Où* / *D'où* feedback rows still reveal the exact French question she just asked, translate it, and tell the child which prefix (*De* or *À*) to click—giving away the core *Où* vs. *D'où* listening task while her words are still hidden.
  * **Exact fix:** Describe the picked card's prefix and prompt the child to listen for *d'* at the start of her question without revealing which question she asked:
    * **`*À* for a *D'où* question`:** `That card starts with *À* and tells where you are going. Listen for *d'* at the start of Madame Roux's question. *D'où* asks where you are coming from, and its answer starts with *De*.`
    * **`*De* for an *Où* question`:** `That card starts with *De* and tells where you are coming from. Listen again to the start of Madame Roux's question. *Où* (without *d'*) asks where you are going, and its answer starts with *À*.`
  * **Confidence:** High.
* **Issue 6b — Elliptical *"tells how many"* in the wrong-kind feedback line:**
  * **Problem:** In *"That card tells {how many / the time / where you are going / where you are coming from},"* *"That card tells how many"* is slightly clipped in English compared to the other three options.
  * **Exact fix:**
    `That card tells {how many of you there are / the time / where you are going / where you are coming from}. Listen again to the start of Madame Roux's question.`
  * **Confidence:** Medium.
* **Issue 6c — *"compare the whole number"* vs. *"the whole phrase"* in Step 5 feedback:**
  * **Problem:** The sounds card teaches that the linking consonant ("t" vs. "z") appears across the word boundary in the linked phrase (*dix heures*, *trois euros*), not in the bare number alone.
  * **Exact fix:**
    `Those numbers can sound similar. Hear her again and compare the whole phrase.`
  * **Confidence:** Medium.

confirmed with the listed fixes
