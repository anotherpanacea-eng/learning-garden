# PR462 review at head `7aaf69ee21f6925d14098ef8b2a243d1f94d9156`

## Part 1 — French language and content: **CLEAR**

**Verdict:** No P1 or P2 findings. I formed this verdict from the module you pasted, before opening any repository files.

**What I covered:** All 9 stories. For each one I read every French passage variant (27 in total) and checked it against its English meaning. I also read the titles, invitations, word lists and postcards, and all 18 questions, including every choice, answer key, ordering item, hint, explanation, skill label and helper tag.

**What I checked:**
- **Grammar and idiom:** The French is grammatical, standard metropolitan French throughout. Some forms I looked at closely and accept:
  - *à qui appartient l'écharpe*
  - *Mila lui rend l'écharpe, et Léa la remercie*
  - *qui se transportent bien*
  - *tout en lui laissant voir les toits* (the *lui* form with *laisser* + infinitive + object is standard)
  - *fait-elle sa photo*
  - *sans flou*
  - *ce chemin mène à une autre porte, ouverte*
- **English meanings:** Every meaning matches its French. The only loose spot is noted under P3.
- **Answers and context:** Each of the 18 questions has exactly one defensible answer in every variant, and the keys match. Two answers depend on inference in variant 1, which is fine because those questions are tagged as inference or context:
  - "Entrer dans le jardin" (the open gate)
  - "La clé touche la cuillère" (the noise)
- **Orderings:** All three sequence questions follow *D'abord / Ensuite / Enfin* in all variants, and each item quotes its passage verbatim.
- **Hints and explanations:** All point at words that really appear in each variant. The ellipsis in « La première porte … est fermée » covers the variants with and without *du jardin*.
- **Reading load:** With adult support, this is reasonable for beginners. Variant 1 has 4 short present-tense sentences, and variant 3 has 6 sentences with simple connectors (*donc, car, mais, alors, plutôt que, grâce à*). I make no claim about age or placement.
- **Educational claims:** The skill labels describe what the tasks actually ask, and none of them overstate it.

**Optional P3 polish (not blocking):**
1. **Le panier du concert, variant 3:** in « où les musiciens l'attendent », *l'* most naturally means *le panier*. The English says "waiting for him". Either change the English to "waiting for it", or leave it, since both readings work.
2. **Photo story word list:** « nette = clear » would be more precise for a photo as "sharp".
3. **Le dessin à l'ombre, variants 2–3:** « une place plus agréable » reads more naturally as « un endroit plus agréable ». *Place* is acceptable, but *endroit* is the usual word for a spot.
4. **Le bruit dans la boîte, variant 3:** « expliquer ce qu'elle entend » could be « expliquer le bruit », because the noise has already stopped by then.
5. **L'enveloppe bleue:** *carte* (map or card) isn't in the word list, and the invitation's "among the maps" doesn't match variant 1, which has no map. You could add « une carte = a map », and optionally mention the map in the invitation only.
6. **Le panier du concert, variant 1:** a bare *kiosque* usually suggests a newsstand. The gloss and the musicians context make it clear enough, but « kiosque à musique » on first use would remove any doubt.

**Limits:** This is a text-only review. It doesn't establish runtime behaviour, audio or text-to-speech pronunciation, device rendering, or whether anyone actually learns from the stories.

## Part 2 — Implementation against `main` and `resolution.md`: **CLEAR**

**What I covered:** I compared this head against `origin/main` (`d621825d`, which is also the merge base). That diff touches 8 files: `dist/french-story-data.mjs`, `dist/french-core.mjs`, `dist/paris-core.mjs`, `dist/paris-content.mjs`, `test/french-exploration-checks.mjs`, and `docs/reviews/462-french-panel/{google,prompt,resolution}.md`. I used read-only commands only and made no edits. The worktree was clean at that head.

**Does the code match the resolution document?** Yes. I checked each of its nine rows against the diff, and all are applied exactly as described: the door/gate gloss, the musicians and *leur goûter*, the *à qui appartient* gloss, *l'étiquette de l'écharpe* in both variants, the unstacked pronoun, *se transportent bien*, *veut prendre une photo* with *fait-elle sa photo*, *sans flou*, and the camera vocabulary (*appareil photo, pose, plutôt que, prend la photo*).

Its claim that no story IDs, answer indexes, order items or selection rules change is also true; only text strings changed. The frozen-source claim is backed by `captureParisSource` and `parisVisitSource` in `dist/paris-visit-source.mjs`, plus the existing paused-route test. The spec anchor link resolves to `docs/specs/117-spanish-river-market.md:122`.

**How the support suggestions behave:** When earlier reading-support details are uncertain, the French suggestion now says so (`dist/french-core.mjs:33`) instead of claiming the learner used help. It still suggests a shorter length, and computing the suggestion doesn't modify any records. The Paris equivalent behaves the same way.

**Tests:** I ran these locally and all passed:
- `french-exploration-checks`
- `paris-exploration-checks`
- `paris-checks`
- `french-and-revision-checks`
- `order-story-checks`
- `style-checks`
- `child-copy-checks`

I did not run the full suite or the browser tests.

**Optional P3 polish:**
1. **Test count:** in `test/french-exploration-checks.mjs`, the three new checks come after the `console.log` that prints the total, so the reported "371 passed" leaves them out. They do run, and the script exited cleanly. Moving the block above the log line would fix the count.
2. **Ambiguous wording:** at the shortest length, `french-core.mjs:33` says "Try more short sentences…", which could be misread as "try more sentences". Something like "Try another story with short sentences…" would avoid that. Also, at that length an uncertain-support case falls through to this message instead of the "details are missing" one. That's harmless, since it doesn't claim help was used, but it differs from Paris, which checks for uncertainty first.
3. **Mixed terms:** `paris-content.mjs` now says "tell a grown-up what to write" in the entrance text, while the guide line and options say "helper". The "grown-up" wording was already on `main` in the node prompt, so this isn't new, but one consistent term would read better.
4. **Status line:** `resolution.md` correctly says independent review is pending. It will need updating to record this panel's result once the panel finishes.

**Limits:** I reviewed the source diff and ran local Node checks. That doesn't establish browser, device or audio behaviour, or learning outcomes. Both verdicts are my own; I didn't use any other reviewer's findings.
