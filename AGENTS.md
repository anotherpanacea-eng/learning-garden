# Learning Garden

Follow the workspace instructions and [CONTRIBUTING.md](CONTRIBUTING.md), including its public-repository privacy rules.

Before designing a new learning capability, check for useful overlap with [Jane](https://github.com/kentlangley/Jane) and the [Marble Skill Taxonomy](https://github.com/withmarbleapp/os-taxonomy). Build on suitable existing work instead of independently recreating it. Start with the concrete opportunities and pinned references in [docs/upstream-opportunities.md](docs/upstream-opportunities.md); refresh the relevant upstream files when implementing.

In the feature's existing spec or PR, say what was reused, adapted, or studied, and why a different approach was needed where applicable. Distinguish a design reference from incorporated code or content. Preserve applicable attribution and licenses for the actual paths used; Jane's repository has several license layers.

Keep this app's established choices: parent-guided exploration, open destinations, optional help, and separate records for support, familiarity, and independent attempts. Reusing an upstream component does not require adopting its mastery labels, access locks, timers, rewards, storage, or handling of learner data.

Validate saved work on ids, counts and outcomes. Checking that a save agrees with itself (its counts and flags match its own saved answers) is fine. Don't check it against today's wording, answer key or rules, don't rewrite saved results on load, and don't add consistency rules that nothing reads: a later copy or rule edit would then lock a child out of their work. Don't require a save to hold every item in today's content lists, or exactly today's count (coins, landmarks, key entries): read a missing item as absent and check the items the save does hold. Store codes for messages and units, and map them to text in the UI. If one saved item can't be read, keep the rest of the game open.

When a learner activity offers supplied answer choices, vary the fitting choice’s position across cases without letting tone or length give it away. If wrong choices all overclaim, consider one that withholds more than the supplied evidence requires; it must be wrong for an evidence-specific reason, not merely for being cautious. Skip that alternative where it would distort the question. Keep the order stable within a saved question, whether authored or generated, and preserve its choices and order when resuming saved work.

## Fleet backlog

Fleet-wide work items are cards: one JSON file per card,
`backlog/cards/<ID>.json` on the `fleet-custody-state` branch of
[fleet-coordination](https://github.com/anotherpanacea-eng/fleet-coordination)
(its `docs/backlog-state.md` documents them). The fleet board is the cards the
owner has admitted that sit in build, review or landing. To look an item up,
read that folder or run `python3 -m tools.backlog_state list` in a
fleet-coordination checkout; card ids match the old board ids. To propose a new
item, use the `fleet-intake` skill; a seat without GitHub uses the fleet's
Dropbox intake folder. Only the owner admits a card. Don't add rows to
`BURN-DOWN-BOARD.md` or make a `BOARD.md`. This repo's own briefs (specs,
roadmap items, Issues) work as before, and a card links to them. When a change
here finishes or moves a card's work, move the card
(`python3 -m tools.backlog_state move`) or say so in the PR. A card's stage
never reserves files; a Fleet custody checkout still does.

The roadmap's goal IDs, LG-G1 to LG-G5 in
[docs/roadmap.md](docs/roadmap.md#owner-priorities-in-order), are the cards'
`goal` field, and the lowest-numbered goal with ready work goes next. Lanes A to
D of the next consolidation lanes serve LG-G3, LG-G2, LG-G1 and LG-G4. A new
card names its goal; a card without one is maintenance.

## Who does what

Codex, on the owner's machine, lands work here: it merges and deploys. Claude
sessions write specs and code, review, and fix on their own branches. Claude
opens PRs as drafts, never merges one, and never deploys. Any other seat
follows the Claude rules unless the owner says otherwise.

## Fleet custody

Before editing, take a Fleet custody checkout from a fleet-coordination
checkout ([spec](https://github.com/anotherpanacea-eng/fleet-coordination/blob/main/specs/custody-state-cas.md)):

```sh
python3 -m tools.custody_state checkout --issue N --session <stable session id> \
    --target anotherpanacea-eng/learning-garden --branch B --path P [--path ...]
```

Start only on a `grant`. `busy` names the blocking Fleet issue; don't touch
those paths. A `plan` result means the proxy refused the write: send its
`write` as given (GitHub connector `create_or_update_file`) and the grant holds
once it lands. Each branch needs its own Fleet issue, a grant holds at most 64
paths, and a grant covers only the paths it lists, so take a new checkout
before widening scope. When your candidate is final, mark the PR ready and
release (`python3 -m tools.custody_state release`). Codex waits for that
release before landing, so a draft or a held grant means "not yet".

## Specs and review

Every new capability gets a spec under `docs/specs/` and an independent spec
review before code. A spec records:

- the Jane and Marble study above: refreshed upstream commits, what was reused,
  adapted or only studied, and the Marble topic ids and six-act strand
  families ([six-act-strands](docs/six-act-strands.md)) it touches, as
  candidates, not coverage claims;
- spec 49's teaching encounter (§5: teaching, contrast, supported practice, new
  use, return) and its hard-prerequisite crosswalk (§8) against
  `curriculum/marble/dependencies.json`;
- where it sits in the six acts of [spec 49](docs/specs/49-six-act-curriculum.md)
  and the story of [spec 120](docs/specs/120-keeper-of-the-ways.md), and the
  act or chapter job it fills.

Paraphrase upstream research rather than copying it (the teaching research
text is CC BY-SA), and don't adopt bosses, medals, gates or mastery labels. Going
beyond Jane and Marble is fine when the spec says why.

Each spec and each build gets an independent review from the other vendor: a
Claude-authored PR is reviewed by Codex, and Codex's own work needs independent
Claude clearance. An author's own checks never count as the review. Clearance
names the exact head SHA it covers; a later push needs a fresh look at the
new commits. The author fixes findings on the same branch.

## Checks

`node scripts/run-checks.mjs` runs the atlas, the story packs and every
`test/*checks*.mjs` suite (about three minutes). Run it before marking a PR
ready. For UI changes also run the touched activity's browser suite:
`python test/<activity>-browser.py` (Python Playwright) or
`node test/<activity>-browser.js` (Node Playwright), both on Chromium. Some
Node suites need `dist/` served and a URL variable; use the command the README
gives next to that activity. There is
one hosted check, a gitleaks secret scan on every PR and `main` push; the
commands above are the gate, so say in the PR which ones you ran and at which
head.

Browser suites are Chromium emulation. They don't qualify a physical iPad,
Safari, audible speech or VoiceOver, and no check here measures learning.
That limit is standing; receipts mention only departures from it.

## Landing: Codex's merge and deploy procedure

For requested After the Storm work, the default is build, independent review,
resolve findings, merge, deploy to the canonical live game. Codex lands a PR
this way:

1. **Preconditions.** The PR is ready, the author's custody is released,
   independent clearance names the current head SHA, and no review thread is
   unresolved. Stop and report if any is missing.
2. **Test the release tree.** Merge the candidate (and anything landing with
   it) onto current `main` locally. On that tree, run
   `node scripts/run-checks.mjs` and the browser suites for the activities
   the release touches.
3. **Merge** with a merge commit, never squash. Confirm the merged `main` has
   the same tree as the tested one (`git diff --quiet <tested> origin/main`).
   If `main` moved, go back to step 2.
4. **Deploy only when `dist/` changed.** From the authorized Cloudflare
   account (check the account; never assume the CLI default), run
   `npx wrangler deploy --assets ./dist --name after-the-storm-learning`.
   Deploy only `dist/`, never the repository root or CLI setup folders. Keep
   credentials and account configuration out of the repository.
5. **Verify live.** Every tracked `dist/` file must match the bytes served at
   https://after-the-storm-learning.anotherpanacea.workers.dev/. The site is
   static, so matching bytes mean the hosted game is the tested one: load the
   home page and one touched route as a smoke check rather than re-running
   the browser suites against the host. If either fails, redeploy the
   previous release and report.
6. **Receipt.** Post one PR comment: tested tree, merge SHA, Cloudflare
   version id, the asset match, the suites run with results, and any harness
   caveat. Docs-only PRs (no `dist/` change) need no deploy and no receipt
   beyond the merge. The PR comment is the record: link it from the roadmap
   once, and don't copy its counts into the roadmap, README, build queue or
   other docs. Review clearances also go in PR comments; `docs/reviews/` is
   for content reviews meant to be read later, such as the 2026-10-22 text
   review.
7. **Fleet card.** Move the linked card (`python3 -m tools.backlog_state
   move`): `done` when its `done_when` is met, otherwise leave it in `build`
   and say what is left in its note.

Stop at a concrete unresolved review, authorization or deployment blocker and
report it.
