# Outside review of main: verified findings and fixes (2026-10-26)

An outside model reviewed `main` at `c83ff17`. Claude re-checked each "immediate bug" against `main` at `40e6930` before fixing anything. Line numbers in the outside review predate later merges.

| Finding | Status on `40e6930` | Action |
|---|---|---|
| `test/sentence-bridges-checks.mjs` fails on a source-substring assertion | Already fixed on `main`; all 175 `*checks*.mjs` suites, the atlas check and the story-pack check pass | None |
| Header guide link (`#companion-link`) empty when `#cafe/units` or `#loft/shadows` is loaded directly | Real | Both early-return routes now fill it the same way `#begin` and `#workshop/scale` do |
| **Switch explorer** on `#workshop/scale` falls through to `initializeExplorerState` and the host normalizers | Real: the cancelled switch left the notebook normalized in memory, which this scene is built to avoid | The scale route now shows the explorer chooser itself and returns |
| Seed Pile **Next thought** / **Back** re-resolve the default `pile` source and can replace a saved lesson's frozen source | Latent: through today's UI the step buttons always follow an explanation of the same game, so the source matches; a saved lesson stepped with no current game would be overwritten | New `stepPile` keeps the lesson's own saved source and only changes the step |
| Import preview omits newer places; preflight skips the Games Table notes | Real but display-only: import keeps every root; the preview list named none of the 16 newer places, and `pileNotes`, `shuttersNotes` and `rowsNotes` were never rendered during the preflight | Labels added for all 16; the preflight renders the three Games Table sections. The structure check still covers the same 11 roots, now listed directly instead of as an exemption list |

Not changed: the preview also lists places that `initializeExplorerState` creates on every explorer (Café, Water Lab and so on) even when unvisited. Telling "visited" from "initialized" needs a per-place rule, so it belongs with the Grown-up Notes readability work.

## Checks

- All 175 `node test/*checks*.mjs` suites pass, plus `scripts/build-learning-atlas.mjs --check` and `scripts/check-story-packs.mjs`.
- New checks: `test/seed-pile-checks.mjs` (stepping keeps a saved non-default lesson source with no current game), `test/progress-transfer-checks.mjs` (preview names the Games Table), and `test/route-scale-browser.js` (switch-and-cancel leaves the notebook and save count unchanged; direct loads of the three early-return routes show the guide link). Each new check fails on `main`.
- `test/route-scale-browser.js` (386) and `test/shadow-theatre-browser.js` (2990) pass in Chromium. `test/capacity-units-browser.js` fails at "native targets44" on `main` and on this branch alike; that failure is not from this change.
