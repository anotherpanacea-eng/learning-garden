# Shipped French and Spanish: Gemini review resolution

Report: [Gemini 4 Argon (high)](google.md), 2026-10-31, on `main` at `23044c2`. Prompt and files: [prompt.md](prompt.md). Verdict for both languages: usable with the listed fixes.

This was a single-provider pass, requested by the owner, on French and Spanish that had already shipped with only a Claude review. Claude checked each finding against the files before applying it. The newer texts (specs 117, 326 and 327) had the full three-provider panel and are not covered here.

## Applied

| # | Line | Severity | Change |
| --- | --- | --- | --- |
| 1 | Riddle *la librería*, the library choice's nudge and the explanation | high | Both now say *la librería* looks like "library" but means a bookshop, and a library where you borrow books is *la biblioteca*. The old text suggested *librería* could mean either, depending on the clue. |
| 2 | French rooms mission: «Je viens de changer sa place.» | high | «Je viens de déplacer ${obj}.» *Changer sa place* is a calque. |
| 3 | Nora story: «Une porte « ouverte » permet à Nora de…» + «Entrer…» | high | The stem now reads «Grâce à la porte « ouverte », Nora peut…», so every choice completes it grammatically. Before, the fitting choice produced *de entrer*. |
| 4 | Rooms lesson 3 (*clarify*) guided case was the fitting answer word for word | high | The guided case now uses a parallel example: «Un message dit : « Pose le sac sur le lit. » S’il y a deux chambres, tu demandes : « Dans quelle chambre ? »», with its English. |
| 5 | Rooms lesson 1: «La chambre est sous le salon sur le plan.» | high (part) | «Sur le plan, la chambre est en dessous du salon.», and the teaching line and English follow. |
| 6 | Mission *clarify*, third choice «À quelle heure faut-il partir ?» | medium | «À quelle heure faut-il poser ${obj} ?», which matches the message being clarified, as lesson 3 already does. |
| 7 | «… elle ne peut pas entrer ici.» and «… car les passants peuvent la lire ici.» | medium | «… entrer par là.» and «… sur le mur, où les passants peuvent la lire.», with matching English. |
| 8 | Indefinite subject + *est*: the leaf postcard, the envelope (level 1) and the banner (level 1) | medium | «Il y a une feuille dans le bateau.», «Dans l’enveloppe, il y a un dessin de bateau.», «Il y a une banderole sur la terrasse.» Envelope English follows. |
| 9 | «Une affiche est en deux morceaux.» | low | «Une affiche est déchirée en deux morceaux.», English "torn into two pieces". |
| 10 | Lucie: «Elle met un livre bleu dans le sac.» with no bag introduced | medium | «… dans un sac.» The next line, «Le sac est sous la table.», now follows. The parcel line is kept: the bag holds the book for the parcel. |
| 11 | Title «L’écharpe du banc» | medium | «L’écharpe sur le banc». |
| 12 | «Comme le nom est le sien, Léa reconnaît son écharpe.» | medium | «Léa voit son nom et reconnaît son écharpe.», with matching English. *Nom* is kept, since the label line says «le nom « Léa »». |
| 13 | *À l’ombre* question: the fitting choice was the only participle and the longest | medium | Choices are now «Protégé de la pluie.», «Protégé du soleil.», «Caché derrière le mur.» The fitting choice is still second. |
| 14 | Rooms lesson 4 teaching line used *passé récent*, *futur proche*, *infinitif* | medium | Plain wording, matching what the adaptive missions already say. The English line now translates the examples. |
| 15 | Riddle *gracias* clue "I sound a little like grateful." | medium | "I start with gra, like grateful." The words share spelling, not much sound. |
| 16 | Riddle *perro* clue "Say guau out loud." | low | Adds "It rhymes with wow." so a reader without Spanish says it right. |

## Not changed, with the reason

- **Rooms lesson 1 never names the bed in its text** (high). The lesson is *Lire le plan*: the bed is drawn on the plan, and finding it there is the task. Kept as designed. Only the *sous* wording changed (row 5).
- **Clarify choices give away the answer by length and the colon** (medium; lesson 3 and the missions). Shortening them to «Dans quelle pièce : … ?» breaks the content contract in `test/adaptive-french-checks.mjs`, which requires the fitting question to ask *which table or shelf*. The guided-case giveaway (row 4) and the off-topic distractor (row 6) are fixed. Balancing the choices is a question for spec 221's owner.
- **«une petite carte» glossed "a small map"** (medium, medium confidence). The stall sells maps and the invitation says "among the maps", so *carte* as map is intended. Left for a later pass that adds *une carte* to the word list.
- **Transitive *bouger la boîte*** (low, medium confidence). Standard in everyday French; not an error.
- **French typography** (low, pattern). Shipped French uses plain spaces before ? ! : and inside « », and the rooms files mix straight and curly apostrophes. Spec 327 already sets the runtime rule (no-break space inside « », narrow no-break space before ? and !). Bringing the older files in line touches every French file and their checks, so it is a separate change.

## Follow-ups

- Spec 221's passage text (`docs/specs/221-french-rooms-plans.md`) still shows «La chambre est sous le salon sur le plan.» It should follow row 5.
- The typography sweep and the clarify-choice balance above.

## Known limit

As in the 117 panel, a model can miss wording that is correct but sounds odd to a native speaker. This pass used one provider, so a disagreement between providers could not show up.
