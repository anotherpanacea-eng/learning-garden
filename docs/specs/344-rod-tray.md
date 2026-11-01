# 344 · The Rod Tray: adding and taking away across zero

**Writing only, proposed 2026-11-01 for LG-53 / LG-G1. Build after independent specification review and a separate math/content review.** Companion: [finite original copy](../content/344-rod-tray-text.md). Evidence, upstream refresh and reuse: [source audit](../source-audits/344-rod-tray.md). Custody: Fleet1378. This specification commissions no runtime code by itself.

## One missing operation

Learners can already place signed positions and measure the unsigned gap between them ([Gap Line 289](289-gap-line.md), `#desk/gaps`), and the generated Linear families use signed rates and balances ([312](312-signed-linear-returns.md)). Those tools already represent signed numbers, but none offers a manipulable zero-pair model for adding and removing signed quantities: add a negative, take away more than is there, or take away a negative and see why the result goes up. The roadmap's consolidation row 4 names "negative/zero and richer linear relationships" as a gap, and 312 already tells learners that "subtracting a negative adds its opposite" without a model that shows it.

Select only proposal [189](189-below-zero.md)'s **Rod Tray** bench, narrowed to whole-number addition and subtraction from −12 to +12. No flood post, thermometer, sign rules for multiplication, absolute-value course, Dry-Spell Log, history bench, story adapter or generic integer engine. The 189 proposal and its five benches stay proposals; this slice does not commission the others.

**Target:** a signed whole number is a direction and a size from zero. One positive and one negative make a **zero pair** worth nothing, so adding or removing zero pairs never changes the total. Adding a negative moves down/left; taking away a number you do not have is possible once you add zero pairs; taking away a negative moves up/right. The two jobs of the minus sign ("below zero" and "take away") stay visibly separate.

## Place and Willowbank reason

Route `#desk/rods`, a Keeper's Desk teaching bench beside Gap Line, with a discovery entry in the Number Garden and the Keeper's Desk investigation list (same pattern as 289). Standalone and open from the first visit; no act, chapter or lesson unlocks it and it unlocks nothing.

**Willowbank reason (act-agnostic, one line on the intro):** the baker sells bread at the weekly market. Some days he pays out more than he takes in, so he keeps count with an old tray of red and black rods. The baker is existing supporting cast in [spec 120](120-keeper-of-the-ways.md) (he/him). The line names no Vadoalto trader, page, Hollis or later-act event, so it is safe before Act III. Money appears only in cases 3 and 6 and is a made-up account in whole dollars; every other case is plain mathematics.

**Act fit:** strand family M1-IV (signed quantities and number-line distance, [six-act strands](../six-act-strands.md)). Spec 49 places this kind of reasoning in Act IV, *The Town Has Two Stories*; this slice is an explicit teaching bench that Act IV's later ledger and dry-spell work can lean on, and it does not change story chronology or unlock rules.

## The material

**Tray.** Two kinds of rods, each also distinguished by shape and a letter so color is never the only cue: **red upright rods marked +** (one above zero) and **black slanted rods marked −** (one below zero). At most 12 of each. Native buttons, each at least 44 px:

| Control | Effect | At a limit |
| --- | --- | --- |
| Add a red rod / Add a black rod | +1 of that rod | Disabled at 12 with the companion's "tray is full" line |
| Take away a red rod / Take away a black rod | −1 of that rod | Disabled at 0 with the companion's "add a zero pair first" line; never adds pairs automatically |
| Add a zero pair | +1 red and +1 black | Disabled when either is at 12 |
| Pair them off | Removes every matched red/black pair, leaving one kind | No-op when one kind is already absent |
| Start again | Empties this case's tray | Asks nothing; the first and latest checks stay in Notes |

The tray does **not** show its value. The learner counts what is left after pairing off. Matched pairs fade to a small "0" before they leave, unless reduced motion is on, in which case they go at once with a caption.

**The sum.** Each case shows its number sentence with brackets around a negative operand, read aloud with the two minus jobs named: "one take away negative three". The operand is drawn in the same rod style as the tray (for example "(−3)" sits beside three black rods), so the learner can see which rods to add or take away.

**Your answer.** A native stepper from −12 to +12 with **One less** / **One more** buttons and a visible value that begins as "No answer yet". No typing. **Check my answer** compares the chosen value with the case's result.

**Show on the line (optional).** A horizontal number line from −12 to +12 with labels at −10, −5, 0, +5, +10 and the start marked. It draws one arrow for the case's move: right for adding a positive or taking away a negative, left for adding a negative or taking away a positive, through zero when the move crosses it, and the arrow's caption names the size and direction (companion text). Because the arrow ends at the answer, opening it is recorded as help that showed the result.

## Six finite invitations

The companion supplies titles, prompts, hints, guided steps, explanations and per-answer feedback. Numbers verified by the scratch script described below.

| caseId | Sentence | Result | Zero pairs needed | Most rods of one color | Job |
| --- | --- | ---: | ---: | ---: | --- |
| cross-down | 4 + (−7) | −3 | 0 | 7 | Guided. Adding a negative moves down, straight through zero. |
| two-below | −5 + (−3) | −8 | 0 | 8 | Adding two negatives goes further below; confronts "two minuses make a plus". |
| pay-off | −6 + 10 (the baker owes $6, then takes in $10) | +4 | 0 | 10 | Context; right size on the wrong side of zero is the trap. |
| take-black | 1 − (−3) | +4 | 3 | 4 | Taking away rods you do not have; taking away a negative moves up. |
| take-red | 1 − 3 | −2 | 2 | 3 | Contrast with take-black: same numerals, one sign changed. |
| remove-charge | −2 − (−6) (the baker's account shows −$2, then a $6 charge made by mistake is taken off) | +4 | 4 | 6 | New application of take-black in a different setting. |

All six are open in any order. Case 1 is the only guided case (Jane's teach → guided → practice order): its three steps show before answering. The contrast pair (take-black and take-red) sits side by side in the case list with the companion's caption "Same numbers, one sign changed".

## Teaching, help and contrast

Four teach cards (companion T1–T4), each one short idea with a step-revealed worked example, open from the bench and never block it: zero pairs; adding moves along the line; taking away what you do not have; two jobs for one sign.

Every case has the same three-step help ladder, following Jane's "I'm stuck" pattern without hearts, points or skips that count against anyone:

1. **A hint** aimed at the case's top misconception (companion).
2. **A different example**: one of three worked helpers (`adding` 5 + (−6) = −1; `takeNegative` 2 − (−4) = 6; `takePositive` 2 − 6 = −4) on its own example tray, three steps, Previous/Next, returning to the learner's actual tray untouched. Helper answers differ from every case answer.
3. **Show on the line**, described above.

Feedback after **Check my answer** never says "wrong". A match uses the case's explanation. A non-match uses the case's targeted line when the chosen value is one of its two listed misconception values (for example −2 for take-black: "taking away a negative made it more negative"), otherwise the general line, and leaves tray and answer editable.

**Contrasts carried by the cases:** adding a negative versus adding a positive; adding two negatives versus the slogan; right size versus right side of zero; taking away a negative versus taking away a positive with the same numerals; minus as "below zero" versus minus as "take away". Sign rules for multiplication stay out; case 2's feedback says the slogan does not work for adding and stops there.

**What it does not establish:** a match shows one answer matched one finite case with whatever help was open. It is not mastery, placement or evidence of fluency without the tray. Spoken reasons ("Tell a grown-up why") are human conversation and are never stored.

## Saved work

Optional root `rodTray`, absent until the learner first changes a tray, answer or help state:

```
rodTray: {
  kind: 'rod-tray', version: 1, source,               // retained copy of the whole case set, see below
  drafts:   [{ caseId, red: 0..12, black: 0..12, answer: -12..12 | null }],
  checks:   [{ caseId, first, latest, count }],
  support:  [{ caseId, hint, helper, line }],          // booleans: opened or requested, never "understood"
  teaching: { T1, T2, T3, T4 }                         // booleans: teach card opened
}
```

**Retained source.** `source` is `{id, version, cases, helpers, teach, lines}` and holds the actual strings, not ids into today's catalogue: each case's sentence parts, result, prompt, guided steps, hint, explanation, the two targeted feedback values with their lines, and the general non-match line; the three helpers' steps; the four teach cards. Notes and every return view interpret saved work only through this retained source. An id resolves within the retained source and nowhere else. A later wording change ships as a new source version for new notebooks; an existing owner keeps its own source and is never silently re-read through the current copy. Build test: save, change a current case string and a feedback value, reload, and confirm Notes shows the old wording and the old literal `matches`.

**Check transitions** (following Gap Line 289's first/latest pattern). A check snapshot is `{answer, matches, red, black, helpBefore}`, where `helpBefore` is `{guided, hint, helper, line, teach}`: `guided` is true when the retained case has guided steps (they are shown before answering, so case 1 always carries it); `hint`, `helper` and `line` copy that case's support flags; `teach` lists the teach cards opened by this explorer. Pressing **Check my answer**:

- with no check yet for the case: writes `first` and `latest` as the same snapshot, `count: 1`;
- when `answer`, `red`, `black` or any `helpBefore` field differs from `latest`: replaces `latest`, `count + 1`; `first` never changes;
- when all of those equal `latest`: no write and no count change (a repeat press is a no-op);
- with `answer: null`: disabled, so no check is written.

Each support or teach flag is committed through the write gate before its help is shown; a refused write shows the refusal and not the help. Flags mean opened or requested; they do not show the help was read, and a false flag is never evidence of an unaided answer. Guided steps are disclosed in Notes as help shown by design. A support or teaching entry that cannot be read stays **unknown** in Notes and in later snapshots, never false. Codes, integers and booleans only; no free text, timing or location. Never recompute or rewrite a saved `matches` on load. An unreadable entry stays raw and exportable while the rest of the tray stays usable.

Use the existing whole-notebook gate before every write (`prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok`, as in 289), the existing save-off, Download, import, explorer switching and scoped reset behavior, and a presence-only transfer destination `rodTray`. Grown-up notes list each case's first and latest check, check count and help opened, and say plainly that intermediate attempts are not kept.

## Integration limits

Dispatch exact `#desk/rods` before generic Desk, following the 289 pattern for deferred legacy initialization and films. Add discovery beside Between the Marks without changing Gap Line's owner, text or saved data. Gap Line and the Linear families may later link here as a purposeful revisit, but this slice copies no numbers, answers or evidence between owners. No route registry change, atlas declaration or topic-coverage claim ships with the bench; a narrow atlas declaration for `mt_9QzSnn8m80` is a separate reviewed follow-up.

Accessibility: every rod has a text equivalent ("4 red rods, 7 black rods"); screen readers say "negative three", not "dash three", using a true minus sign (U+2212) with an accessible name; native controls only, no dragging; focus stays on the pressed control through each tray change; reduced motion removes the pairing animation. At 820×1180 and 1024×768 the sentence, tray, rod controls, answer stepper and Check fit the first viewport; at 320×800 the page scrolls vertically without horizontal overflow.

## Verification and delivery

- **Numbers (2026-11-01):** scratch `check344.py` (run with `python3 -I`, not in the repo) simulated all six cases and three helpers on the tray: each reaches its stated result, the zero pairs needed are 0, 0, 0, 3, 2, 4, no color exceeds 12, every start and result lies in −12..12, zero-pair invariance holds over all 169 tray states, and helper answers (−1, 6, −4) differ from every case answer (−3, −8, +4, −2). The independent math review should rerun this with its own script.
- **Copy:** `scripts/check-child-copy.mjs` is a terminology scan for spec vocabulary in child-facing strings. Register the new `dist/rod-tray-ui.mjs` and `dist/rod-tray-content.mjs` in its `copyScopes` (Notes blocks as adult blocks) and keep it passing. The companion's word limits, punctuation and US spelling are checked with a temporary script at build time plus human review; no new permanent validation framework.
- **Build checks:** every tray control at both limits; Pair them off from mixed, single-color and empty trays; the stepper at both ends; first/latest/count/no-op transitions, including a change in help alone; unknown support or teaching entries; the retained-source test above; unreadable draft or check isolation; Download → import → reload → re-download; two explorers; save-off; scoped reset; reduced motion; viewport probes above.
- **Review order:** six-lens specification review and a separate math/content review before runtime; after implementation, independent Claude implementation clearance on the exact final head before Codex lands it (AGENTS.md); release verification as usual. No physical iPad, audio or learning-outcome claim follows from Chrome checks.

## Later, not commissioned here

Flood Post and Wall Thermometer context benches; a Gap Line ↔ Rod Tray "same move, two pictures" revisit; 189's Dry-Spell Log for sign rules in multiplication; an Act IV ledger adapter that reuses kept trays; a narrow atlas declaration.
