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

## Delivery default

For requested After the Storm implementation work, the user's default is **build → independent review → resolve findings → merge → deploy** to the existing canonical live game. Obtain independent Claude clearance on the exact candidate and verify the merged static assets before deployment. Keep credentials and account configuration out of the repository. Stop at a concrete unresolved review, authorization or deployment blocker and report it clearly.
