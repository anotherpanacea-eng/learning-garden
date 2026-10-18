# 25 — Sky Post: Willow Post Office expansions

**Status: First bounded delivery loop implemented in spec 02. Courier identity choices, the rival witch and broader math generation remain planned. The Play Center and play-credit proposal has been removed.**

## Purpose

Sky Post is the flying-courier adventure within [Willow Post Office](02-willow-post-office.md). Delivering parcels, exploring routes and helping neighbors reconnect after the storm are the play. There is no separate Play Center to earn access to, no play-credit currency and no earned-time countdown. Choose an explorer and guide independently. Use original characters, places, prose and art. Extend the existing Post Office map, delivery catalog, instruction runner and `postOffice` save extension.

The first slice uses six fixed, reviewed packing examples; it has no number-range selector or procedural/adaptive math. The broader generator/range direction below needs its own reviewed follow-up spec.

## Three small releases

1. **First Post Office deliveries — implemented.** Spec 02's six deliveries and four-landmark map provide pictured flight one instruction at a time, touch buttons and keyboard equivalents; no mouse precision, reflex timer or collision penalty. Read or hear an order, write a useful route, and watch the courier follow it. The current appearances are flying witch and sky rider.
2. **Choose a magical courier.** Plan recognizable defaults of a girl witch, boy wizard and nonbinary sorcerer, with equally expressive outfits, consistent portraits and pronouns, and the same flying abilities and controls. Keep the guide choice independent. Let players choose a title and appearance rather than infer identity from an outfit. Preserve existing witch/sky-rider choices and pending deliveries when the new choices arrive. These choices are not yet implemented.
3. **The rival witch and a practice nook.** An original rival witch (she/her) offers an optional, theatrical challenge route: she tangles a delivery route or challenges the courier's parcel reasoning. Choose a recently tricky, specifically observed task type, or a neutral mixed challenge when evidence is sparse. After a miss, land at a short illustrated practice scene, then retry or take another route. The practice nook is also freely available before a challenge. Preserve the parcel, attempts and support; avoid public weak-spot labels, forced repetition, or inferring a topic deficit from one miss. A supported solution can complete the delivery. Practice uses a different example of the same idea, with pictures the learner can control. Give the rival a playful story resolution when the delivery succeeds.

## Decisions required during detailed specification

Define the rival's first encounter, the practice activity and exact return to an interrupted delivery before building them. Specify task selection, accepted answers, illustrated explanations, support/evidence distinctions and save transitions. Extend parcel math with suitable addition, division or multiplication problems and an openly chosen number range; preserve the delivery's reading/composition purpose. Study Jane's procedural generators and visual formats before implementing; reuse suitable paths with attribution rather than rebuilding its entire engine. Future story routes and new parcels can give players reasons to return without a currency gate. No fact or reading level is inferred from flight, costume or story progress.

Use only fictional/synthetic examples in the public repository. No child identity, uploads, online multiplayer, analytics, microphone, live AI, payment or server-side learner data. Every mechanic must work on a tablet without drag, hover or precise timing. New release specifications must include save-off/export/reset, paused-delivery recovery and completion-once checks. Independent spec and implementation review remain required before release.
