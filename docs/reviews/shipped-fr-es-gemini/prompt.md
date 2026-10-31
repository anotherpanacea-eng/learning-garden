# Shipped French and Spanish: Gemini review prompt

Run 2026-10-31 on `main` at `23044c2`, with Gemini 4 Argon (high) through the Antigravity CLI on the owner's machine. The package (114,066 bytes, UTF-8 with BOM) held this prompt, then each file below in full under a `===== FILE: <path> =====` line:

- `dist/french-content.mjs`
- `dist/french-story-data.mjs`
- `dist/french-library.mjs`
- `dist/french-rooms-content.mjs`
- `dist/french-rooms-adaptive.mjs`
- `dist/french-rooms-ui.mjs`
- `dist/pathway-entry-content.mjs`
- `dist/riddles-content.mjs`
- the French lines of `dist/garden-ui.mjs` (lines 75, 103 and 128)

Why this set: the newer language texts (specs 117, 326 and 327) already had the three-provider panel. These shipped files had only a Claude language review.

## Prompt

You are a native-level reviewer of French (France) and Spanish (Spain) for a children's learning app. Below are source files from the app. Only the French and Spanish strings matter; the JavaScript around them is just packaging. English glosses ("meaning", "words", explanations, hints) matter only where they translate or explain the French or Spanish.

Audience: the French is for a young beginner reader (roughly ages 7 to 10) reading with a grown-up; three passage levels exist in some stories (1 = shortest). The Spanish riddle cards are for a beginner, read aloud with a grown-up. French should be standard metropolitan French; Spanish should be standard Spain Spanish.

Review every French and Spanish line and report:
1. Grammar, spelling, agreement, accent or elision errors.
2. Wording a native speaker would find unnatural, stilted, or regionally odd, with a more natural alternative at the same beginner level.
3. Glosses or explanations that mislead (wrong meaning, wrong word-by-word gloss, wrong claim about the language, wrong claim about pronunciation).
4. Questions where the answer is not supported by the passage, more than one choice fits, or the fitting choice is given away by its form (length, repeated wording) rather than understanding.
5. French typography: guillemets « » with a no-break space inside, a no-break or narrow no-break space before ? ! ; :, and typographic apostrophes. Mention typography once as a pattern with a few examples rather than listing every instance.
6. Anything too hard for the stated level (vocabulary, tense) that a simpler line would fix.

Format: a Markdown table with columns: File | Exact quoted line | Problem | Suggested fix | Severity (high = wrong or misleading; medium = unnatural; low = polish) | Confidence. Then a short list of lines you checked closely and would keep as written. End with an overall verdict for French and for Spanish: usable as written, usable with the listed fixes, or needs rework. Do not invent lines that are not in the files; quote exactly.
