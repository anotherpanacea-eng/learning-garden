# Learning Garden

Follow the workspace instructions and [CONTRIBUTING.md](CONTRIBUTING.md), including its public-repository privacy rules.

Before designing a new learning capability, check for useful overlap with [Jane](https://github.com/kentlangley/Jane) and the [Marble Skill Taxonomy](https://github.com/withmarbleapp/os-taxonomy). Build on suitable existing work instead of independently recreating it. Start with the concrete opportunities and pinned references in [docs/upstream-opportunities.md](docs/upstream-opportunities.md); refresh the relevant upstream files when implementing.

In the feature's existing spec or PR, say what was reused, adapted, or studied, and why a different approach was needed where applicable. Distinguish a design reference from incorporated code or content. Preserve applicable attribution and licenses for the actual paths used; Jane's repository has several license layers.

Keep this app's established choices: parent-guided exploration, open destinations, optional help, and separate records for support, familiarity, and independent attempts. Reusing an upstream component does not require adopting its mastery labels, access locks, timers, rewards, storage, or handling of learner data.

When a learner activity offers supplied answer choices, vary the fitting choice’s position across cases without letting tone or length give it away. If wrong choices all overclaim, consider one that withholds more than the supplied evidence requires; it must be wrong for an evidence-specific reason, not merely for being cautious. Skip that alternative where it would distort the question. Keep the order stable within a saved question, whether authored or generated, and preserve its choices and order when resuming saved work.
