### Verdict: CLEAR — PR 462 Head `7aaf69ee21f6925d14098ef8b2a243d1f94d9156`

**CLEAR** on exact head `7aaf69ee21f6925d14098ef8b2a243d1f94d9156` for [dist/french-story-data.mjs](../../../dist/french-story-data.mjs) ([`frenchStoryData`](../../../dist/french-story-data.mjs#L2)): **0 P1, 0 P2**, and **3 optional P3** polish notes below.

---

### Evaluation by Review Criterion

- **Standard Metropolitan French Grammar, Idiom & Orthotypography (Pass):** All 27 passage variants, 18 prompts/choice sets, and 9 postcard prompts use natural, grammatical metropolitan French. Gender/number agreements (`son écharpe`, `son image`, `à cet endroit`, `en grandes lettres`, `Protégé`/`Caché` for Noé), verb inversions (`répare-t-il`, `prend-elle`, `apporte-t-il`, `choisit-elle`, `place-t-il`), object pronouns (`lui rend` vs. `la remercie`, `tout en lui laissant voir les toits`), prepositions (`la vue sur la rivière`, `Sur ma photo`, `depuis la terrasse`), accented capitals (`À`, `Où`, `Émile`), guillemets (`« … »`), and French spacing before `?` and `:` are accurate and consistent.
- **Gloss & Translation Accuracy (Pass):** All 27 English `meanings` match their corresponding French passages sentence-for-sentence in tense, referent, and sense. All 9 `words` lists give accurate contextual glosses, explicitly marking context-bound senses where needed (`une porte = a door (a gate here)`, `un kiosque = a bandstand here`).
- **Beginner Reading Load with Adult Support (Pass):** Across all 9 errands, Variant 1 (4 short present-tense sentences), Variant 2 (5 sentences adding simple spatial/purpose clauses), and Variant 3 (6 sentences adding connectors like `mais`, `donc`, `alors`, `car`, `où`, `plutôt que`, `tout en`) scale language density and support rather than learner age or maturity.
- **Contextual Sufficiency, Answer Uniqueness & Ordering (Pass):** Every multiple-choice `answer` index (15/15) is uniquely true across Variants 1, 2, and 3, with distractors clearly excluded in all variants (including Variant 3 contrast distractors such as `un animal` in `fr-river-box` and `la vue sur le mur` after `plutôt que` in `fr-rooftops-photo`). All 3 `order` questions (`fr-bookstall-poster`, `fr-river-delivery`, `fr-rooftops-photo`) match explicit `D’abord` → `Ensuite` → `Enfin` markers in every variant. Every `hint` and `explanation` holds across all 3 variants (including `« La première porte … est fermée »` bridging Variants 1–2 and Variant 3 in `fr-bookstall-map`).
- **Educational Claims (Pass):** The header comment (`Variants change language support, not learner age`) and all 18 `skill` / `helper` descriptors (`detail`, `sequence`, `inference`, `context`) accurately describe narrow reading tasks without making age, grade, CEFR placement, or learning-outcome claims.

<details>

<summary><b>Per-Story Verification Summary (All 9 Stories, 27 Variants, 18 Questions)</b></summary>

| Story ID | Variants (1/2/3) & Meanings | Vocab (`words`) | Q1 (Type / Key / All Variants) | Q2 (Type / Key / All Variants) |
| :--- | :--- | :--- | :--- | :--- |
| `fr-bookstall-envelope` | 4 / 5 / 6 sents — Pass (see P3-2) | 6 entries — Pass | `mc` `answer: 0` (`Sous le grand livre.`) — Pass | `mc` `answer: 1` (`Un dessin de bateau.`) — Pass |
| `fr-bookstall-poster` | 4 / 5 / 6 sents — Pass | 8 entries — Pass | `mc` `answer: 2` (`Sur le mur.`) — Pass | `order` (3 items: `rapproche` → `colle` → `accroche`) — Pass |
| `fr-bookstall-map` | 4 / 5 / 6 sents — Pass | 8 entries — Pass | `mc` `answer: 1` (`La première porte est fermée.`) — Pass | `mc` `answer: 0` (`Entrer dans le jardin.`) — Pass |
| `fr-river-scarf` | 4 / 5 / 6 sents — Pass | 6 entries — Pass | `mc` `answer: 2` (`Léa.`) — Pass | `mc` `answer: 0` (`Elle donne l’écharpe à Léa.`) — Pass (see P3-1) |
| `fr-river-delivery` | 4 / 5 / 6 sents — Pass | 7 entries — Pass | `mc` `answer: 0` (`Au kiosque.`) — Pass | `order` (3 items: `pain` → `pommes` → `apporte`) — Pass (see P3-3) |
| `fr-river-box` | 4 / 5 / 6 sents — Pass | 7 entries — Pass | `mc` `answer: 1` (`Une clé et une cuillère.`) — Pass | `mc` `answer: 2` (`La clé touche la cuillère.`) — Pass |
| `fr-rooftops-banner` | 4 / 5 / 6 sents — Pass | 7 entries — Pass | `mc` `answer: 2` (`Avec une corde.`) — Pass | `mc` `answer: 0` (`Le vent soulève le coin.`) — Pass |
| `fr-rooftops-photo` | 4 / 5 / 6 sents — Pass | 10 entries — Pass | `mc` `answer: 0` (`La vue sur la rivière.`) — Pass | `order` (3 items: `pose` → `choisit` → `prend`) — Pass |
| `fr-rooftops-shadow` | 4 / 5 / 6 sents — Pass | 7 entries — Pass | `mc` `answer: 1` (`Protégé du soleil.`) — Pass | `mc` `answer: 2` (`Le soleil est très fort.`) — Pass |

</details>

---

### Optional P3 Notes (Non-Blocking)

1. **P3 (`fr-river-scarf`, Q2 `title`) — English question title asks for an object rather than an action and pre-glosses `rend` on a `context` item**
   - **Quoted line:**
     `{ type: 'mc', title: 'What does she give back?', skill: 'Understand a French action in context', prompt: 'Mila lui « rend » l’écharpe : que fait-elle ?', choices: ['Elle donne l’écharpe à Léa.', 'Elle cache l’écharpe sous le banc.', 'Elle achète une autre écharpe.'], answer: 0, hint: 'Follow the scarf from the bench to the person whose name is on it.', explanation: '« Rend » means gives back here. Mila returns the scarf to Léa: « Elle donne l’écharpe à Léa. »', helper: 'context' }`
   - **Note:** `que fait-elle ?` and the three choices ask *what action* Mila takes, whereas `'What does she give back?'` asks *what object* she returns and gives away `give back` directly in the question header (compare `fr-rooftops-shadow` Q1, `title: 'Use the surrounding words'`).
   - **Minimal correction:** Change `title: 'What does she give back?'` to `title: 'Understand the action'` (or `title: 'What does she do with the scarf?'`).

2. **P3 (`fr-bookstall-envelope`, Variant 3 & `words`) — Polysemy of `une petite carte` alongside `son message`**
   - **Quoted lines:**
     - `3: ['Inès cherche une enveloppe bleue au marché.', 'Elle voit une petite carte sur la table, mais ce n’est pas son message.', ...]`
     - `3: 'Inès is looking for a blue envelope at the market. She sees a small map on the table, but it is not her message. ...'`
     - `words: 'une enveloppe = an envelope; sous = under; un dessin = a drawing; un bateau = a boat; un indice = a clue; donc = so.',`
   - **Note:** `invitation` (`among the maps`) establishes the intended "map" sense of `carte`, which is valid French, but pairing unqualified `une petite carte` directly with `mais ce n’est pas son message` in Variant 3 naturally suggests "a small (note/post) card" in French when `carte` is unglossed in `words`. Neither question is affected.
   - **Minimal correction:** Add `une carte = a map here;` to `words` (or specify `une petite carte de la ville` / `a small city map` in Variant 3).

3. **P3 (`fr-river-delivery`, Q2 `prompt`) — Unglossed `la livraison` and slight scope mismatch of `prépare-t-il la livraison` with step 3**
   - **Quoted line:**
     `{ type: 'order', title: 'Pack and deliver', skill: 'Follow explicitly ordered French actions', prompt: 'Dans quel ordre Amir prépare-t-il la livraison ?', items: ['Il met du pain dans le panier.', 'Il ajoute des pommes.', 'Il apporte le panier au kiosque.'], hint: 'Use the sequence words: first « D’abord », next « Ensuite », finally « Enfin ».', explanation: 'Amir puts in the bread (« pain »), adds apples (« pommes »), then delivers the basket (« apporte le panier »).', helper: 'sequence' }`
   - **Note:** Unlike the other 17 prompts, `la livraison` appears in none of the passages or `words` and is not an English cognate; additionally, *préparer la livraison* strictly describes packing (items 1–2) rather than delivering (item 3, `Il apporte le panier au kiosque.`). Explicit `D’abord` / `Ensuite` / `Enfin` markers still keep ordering unambiguous.
   - **Minimal correction:** Change `prompt` to `'Dans quel ordre Amir fait-il ces actions ?'` (or `'Dans quel ordre Amir prépare-t-il et apporte-t-il le panier ?'`).

---

### Scope and Limits

- **Scope:** Complete independent static text and language/content review of all 9 stories, all 27 French passage variants, all 27 English meanings, all 9 `words` gloss strings, all 18 questions (prompts, choices/orderings, answer keys, hints, explanations, skills, helpers), and all story/module metadata in [dist/french-story-data.mjs](../../../dist/french-story-data.mjs) as supplied inline for PR 462 head `7aaf69ee21f6925d14098ef8b2a243d1f94d9156`, performed with zero tool calls, edits, or external lookups.
- **Limits:** Text and content review only. Does not verify git commit state on disk, runtime behavior, UI rendering/toggling of support fields, order-question interaction mechanics, device/screen-reader accessibility, audio/TTS pronunciation, or empirical learner outcomes.
