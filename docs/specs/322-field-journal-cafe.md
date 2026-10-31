# 322 · Field Journal comparison: the parcel and one café turn (CR1)

Status: proposed, 2026-10-31. Implementation spec for [spec 244](244-presentation-styles.md) phase 1, course route CR1 in [course routes](../course-routes.md). Copy: [322-field-journal-cafe-text.md](../content/322-field-journal-cafe-text.md). Backlog card LG-25. This is owner priority 4 work. It commissions one reversible build after independent review of this spec. It changes no story, task or record text, and no default.

## 1. What ships

One optional per-explorer look, **Field Journal**, beside today's **Storybook**, on exactly two surfaces:

1. **Home parcel area** (`parcelHome` and `keeperInvitation` in `dist/keeper-story-ui.mjs`): chrome only.
2. **One café turn** (`dist/cafe-ui.mjs`): guest arrival and thank-you lines, the first gathering's supper eyebrow, invitation and ending, and a decorative served stamp.

Plus the choice itself in Grown-up notes, with a preview. Everything else shows Storybook in both looks (spec 244 §3 rule 6).

Out of scope: every other surface (phase 3), character art (phase 4), Mystery & Adventure (phase 5), a child-facing switch (owner decision O2), and any story-layer text (O1).

## 2. Gate check

Spec 244 §9 gates P1 on this reviewed spec and on the involved strings having passed their Push C pass. Checked on main at e0cc273 against the [2026-10-22 café review](../reviews/text-review-2026-10-22/cafe-kitchen.md):

- The review names the guest greetings and thanks among the café's strongest writing and flags none of them. Its "Lines worth keeping" list quotes three greetings (Brolly, Tangle and Pebble). 244's companion drafted Field Journal lines for Puff, Pebble, Wisp and Fern; this spec's companion revoices all twelve guests. No flag is evidence the Storybook lines passed, not that the variants keep each joke, so the content review in §9 checks that each joke survives.
- It calls the welcome-back invitation "the bar" for the other supper invitations. It flags no problem with the eyebrow, progress line or ending.
- The one flagged frame item near this surface, the "New Game Plus" eyebrow, is already fixed on main ("Gathering {n}").
- The parcel area's text is spec 120 story text and is not varied here.

So the Storybook twins of every varied string have passed. The Field Journal drafts still need the content review in §9.

## 3. State

As spec 244 §7, confirmed:

- `garden.style`: `'storybook'` or `'field-journal'`. Missing means Storybook.
- Any other value (a later `'mystery'`, a typo, a non-string) is kept verbatim, displayed as Storybook, and never rewritten on load, view, `ensureGarden`, export or import.
- **Only one writer:** `chooseStyle(state, style)` in a new `dist/style-core.mjs`. It returns `false` and writes nothing when `style` is not one of the two codes, when `state.garden` is present but not a plain object, or when the stored value already equals `style`. Otherwise it creates `state.garden={}` only when `garden` is absent, sets `state.garden.style` and returns `true`. Explicitly choosing Storybook replaces an unknown stored value; merely reading or displaying Storybook never does. It touches no other field. It follows `applyCafeStart`'s rule for an unreadable `garden`: decline, never replace.
- `styleOf(state)` returns `'field-journal'` only when `state.garden` is a plain object whose `style` is exactly `'field-journal'`, otherwise `'storybook'`. Every reader goes through it.
- The field travels in the explorer's ordinary save and notes export, and an import restores it as saved. Switching explorers never copies it. With saving off, a choice lasts for the session, under the existing storage-failure notice.
- **No other code reads it.** Evidence, support, familiarity, exposure, story, pathway, suggestion, band and reading-amount code never reads `garden.style` or `styleOf`. A source check enforces this (§8).

## 4. Root attribute and tokens

- `render()` sets `document.documentElement.dataset.style='field-journal'` when an explorer is active and `styleOf(state)` is Field Journal. It removes the attribute otherwise, including while the explorer picker is open. One call near the start of `render()`, before any route's early return, so every route gets the current value.
- Tokens: only the selectors the two surfaces use (the `.cafe-supper*`, `.cafe-guest*`, `.cafe-counter-scene`, `.cafe-response` and `.cafe-ticket*` rules in `cafe.css`, and the `.keeper-home` and `.keeper-invitation` rules in `keeper-story.css`) move their colors to custom properties. They keep their current values as defaults, so Storybook renders identically. One `:root[data-style="field-journal"]` block overrides them. No other stylesheet changes.
- The Field Journal palette, from spec 244 §4.2, with contrast on paper `#fffdf6` measured for this spec:

| Token use | Value | Contrast on paper |
| --- | --- | --- |
| Body and heading text | ink `#203f58` | 10.8:1 |
| Secondary text, rules | reed `#496b4d` | 5.9:1 |
| Stamp and focus accent | stamp red `#a8322d` | 6.5:1 |
| Washes, tape, borders only, never text | river `#78b7cf`, wrapping brown `#b99b73` | 2.2:1 and 2.6:1 |

- Same font stack and minimum sizes. No handwriting font. Focus rings keep today's width and offset, in stamp red. Help controls (**I'm stuck**, hints, Hear buttons, **Skip for now**) keep their size, position and contrast (spec 244 §3 rule 4).

## 5. Frame copy

- `dist/style-frames.mjs` exports `fieldJournalCafe`: a frozen map keyed by guest id, each `{greeting, thanks}`, plus `supper:{eyebrow, invitation, ending}` for gathering 1. The text is the Field Journal column of the copy sheet. Ember's greeting is absent, so it falls back.
- One helper, `frameText(state, storybook, variant)`: it returns `variant` when `styleOf(state)` is Field Journal and `variant` is a non-empty string, otherwise `storybook`.
- `cafe-ui.mjs` calls it at each place it now prints `o.guest.greeting`, `o.guest.thanks`, the round-1 eyebrow, `goal.theme.invitation` and `goal.theme.ending`, in both the touch and the wide layouts. The **Hear our café goal** narration and every Hear text built from these strings use the same call, so speech always matches the screen.
- Unchanged in both looks: the title, the progress line, "Plan another gathering", gatherings 2 and later, the Grown-up notes café summary, and every task string (wishes, dishes, properties, numbers, plate, cupboard, stages, repair, help, how-tos).
- **Served stamp:** Field Journal only, on a served card that is not a recovered closed visit (`served && !x.recovered`; recovered cards keep "This saved visit is closed" and get no stamp): `<span class="cafe-stamp" aria-hidden="true">Served</span>`. The thank-you line already says the order is done. Under `prefers-reduced-motion` it appears with no motion. Otherwise it may settle in at most 300 ms. Storybook gets nothing new.

## 6. Home parcel area

No markup or text change. Under `:root[data-style="field-journal"]`, `.keeper-home` and `.keeper-invitation` get a ruled left margin, two tape strips (CSS pseudo-elements, decorative) and a paper luggage tag on the existing parcel art, drawn by CSS or a decorative inline SVG with `aria-hidden="true"`. The parcel scene, **Keep it safe**, the reminder and Keeper's Pages text stay identical. The tag carries no words.

## 7. The choice in Grown-up notes

- A new `stylePanel(state)` in `dist/style-ui.mjs` renders after `cafeStartPanel(state)` in `notes()`. It shows heading **How the town looks**, the explanation, two radio inputs (**Storybook**, **Field Journal**) with their descriptions, and the **Use this look** button. It keeps clear of the café starting-amounts panel, with no shared form or button (spec 244 §2).
- The preview: one static café card drawn twice, side by side at 820 px and stacked at 320 px. It shows Puff's arrival line in each look, inside the café card markup, scoped so it never changes the page's own `data-style`. Caption: "One café order, shown both ways."
- Submitting calls `chooseStyle`. On `true`: save, set the root attribute, re-render, and announce "Look changed for this explorer." in the panel's status region. On `false` with the same value: announce "This explorer already uses this look." and do not save. On `false` because `garden` is unreadable: announce "This look can't be saved for this explorer." and change nothing. The radios start on `styleOf(state)`, so a missing or unknown value shows Storybook selected. Storage failure: the existing storage notice.
- No Home prompt, no `#begin` step, no suggestion anywhere to switch, and none of spec 244 §6's forbidden words.

## 8. Acceptance

Source checks (new `test/style-checks.mjs`, picked up by `run-checks`):

1. `styleOf` returns Storybook for missing, `'mystery'`, `''`, `null`, an array `garden` and a non-object `garden`, and Field Journal only for the exact code.
2. `chooseStyle` writes only `garden.style`: a deep copy of a synthetic full notebook differs in that one path after a successful choice, and not at all after a no-op or a refusal. An unreadable `garden` is declined and left as it was.
3. A saved `'mystery'` survives `ensureGarden`, export and import byte-for-byte.
4. `fieldJournalCafe` has the twelve guest ids on main (Ember with thanks only) plus the gathering-1 supper entry. A test runs `scanCopySource` from `scripts/check-child-copy.mjs` over every variant string, and the US spelling and read-aloud symbol checks over them; these are bounded checks alongside the §9 human review, not proof of readability. None contains an em-dash, "!", a dish name, a property word from `cafe-content.mjs`, or a spec 244 §6 forbidden word; any number a variant keeps must also be in its Storybook twin.
5. The supper invitation variant still contains "Serve six tables".
6. No production module under `dist/` other than `style-core.mjs`, `style-ui.mjs`, `style-frames.mjs`, `cafe-ui.mjs`, `keeper-story-ui.mjs` (if it needs a hook) and `app.mjs` mentions `garden.style`, `styleOf` or `frameText`.

Browser suite (new `test/field-journal-browser.py`, Chrome, 320 and 820 widths, backlog-128 local server):

1. With no `garden.style`, the café and Home render byte-identical `#main` HTML to main.
2. Choose Field Journal in Grown-up notes. The root attribute is set, the café shows the variant arrival line, eyebrow and invitation, and Hear reads the same text.
3. Start an order and reach the arithmetic stage with a typed answer. Switch look in notes and return: the order, plate, typed answer, stage and attempt history are unchanged, and the café record deep-equals its value before the switch.
4. Serve the order: the variant thank-you line and the stamp appear. With reduced motion the stamp has no animation.
5. Reload: the look persists. Switch explorer: the other explorer shows Storybook and the attribute follows. Switch back: Field Journal again.
6. Export notes, reset, import: the look returns. Import a synthetic save holding `'mystery'`: it shows Storybook and exports `'mystery'` again.
7. Keyboard only: reach and use the radio inputs and button, and the status line is announced. Touch: 44 px targets in the panel.
8. Before and after records: a synthetic notebook exported before a run of style switches and after differs only in `garden.style`.
9. Help controls in the café stay equally visible in both looks at both widths: same target size and contrast, same order relative to the task, and not overlapped. Their page position may shift with greeting length.

## 9. Reviews before release

- Independent spec review of this document.
- Content review of the copy sheet's Field Journal column against spec 244 §3 and §4.2, and against Push C rules. Each line keeps its guest's joke and adds no task content.
- Implementation review at exact head. The owner then tries it at home (phase 2) before any phase 3 work.

## 10. Upstream overlap

Jane and Marble were consulted for spec 244 on 2026-10-26 (§11 there). This slice adds no teaching content, topic or prerequisite edge, so there is no new crosswalk. It adopts 244's reading of Jane's theme picker: the learner chooses, and a choice never rewrites reached work.

## 11. Boundaries

Offline, local, per explorer. No demographic or free-text field. A look is never evidence, never changes a saved result, and never suggests itself. Every destination stays open in both looks.
