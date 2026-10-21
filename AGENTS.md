# Learning Garden

Follow the workspace instructions and [CONTRIBUTING.md](CONTRIBUTING.md), including its public-repository privacy rules.

Before designing a new learning capability, check for useful overlap with [Jane](https://github.com/kentlangley/Jane) and the [Marble Skill Taxonomy](https://github.com/withmarbleapp/os-taxonomy). Build on suitable existing work instead of independently recreating it. Start with the concrete opportunities and pinned references in [docs/upstream-opportunities.md](docs/upstream-opportunities.md); refresh the relevant upstream files when implementing.

In the feature's existing spec or PR, say what was reused, adapted, or studied, and why a different approach was needed where applicable. Distinguish a design reference from incorporated code or content. Preserve applicable attribution and licenses for the actual paths used; Jane's repository has several license layers.

Keep this app's established choices: parent-guided exploration, open destinations, optional help, and separate records for support, familiarity, and independent attempts. Reusing an upstream component does not require adopting its mastery labels, access locks, timers, rewards, storage, or handling of learner data.

Validate saved work on ids, counts and outcomes. Don't require saved text to match today's wording, don't re-run or re-grade saved results on load, and don't add consistency rules that nothing reads: a later copy or rule edit would then lock a child out of their work. Store codes for messages and units, and map them to text in the UI. If one saved item can't be read, keep the rest of the game open.
