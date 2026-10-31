# Recheck of the 2026-10-18 Number Garden UX findings

Checked 2026-10-31 on main at `8ddd5e07505fce1eb33a0df4e24f52e8f6b70195`, Chromium through Playwright, with the welcome film skipped. The roadmap lists four findings from the 2026-10-18 review (roadmap, Clarity sources). Specs 15 to 21 answered most of them; this note records what still reproduces.

| Finding | On main | Action |
| --- | --- | --- |
| Hint buttons hard to find | Fixed. **A little hint**, **Show me the first step**, **A smaller example** and **Work it out together** sit as labeled buttons right under **Try my answer** at every size checked. | None. |
| The question below the first screen | **Reproduces on tablets and desktops.** Spec 19 collapsed Pip's example below 700px only. At 820×1180, 1024×768 and 1440×900 the example opens by default and the question ends below the first screen in 12, 21 and 21 of the 21 adventures. Phones meet spec 19 (the question begins on a 375×667 screen). | Fixed in this PR: Pip's example starts closed at every width. With it closed, all 21 questions are fully on the first screen at those three sizes. A 320×568 screen still shows only the title and lesson first; spec 19's target is 375px, so that is left as is. |
| Models respond only to buttons | Fixed. Tapping a place-value tile or its **+** changes Pip's example, and Enter works on a focused tile. | None. |
| Emoji and generic dots in pictures | **Partly reproduces.** The area cards now draw scenes, and the old emoji `icon` values in `broad-content.mjs` are no longer rendered. The puzzle cards at `#puzzles` still show glyph strings as their picture (for example "♧ ◇ ♧" for the scarecrow and "▦ ?" for the mystery beds). They are `aria-hidden`, so screen readers skip them, but they are the generic marks the review named. | Carded: each puzzle card needs a small drawn picture of its own problem. That needs art review, so it is not done here. |

`test/number-garden-first-screen-browser.py` now guards the second finding at five sizes. It needs Python Playwright, so it runs with the other native browser suites.
