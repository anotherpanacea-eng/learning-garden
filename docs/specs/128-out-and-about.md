# 128. Out and About: off-screen missions for every place

Status: **proposed; awaiting independent spec review and a child-safety read of every card.** Part of the [new kinds of play proposal](../new-game-kinds.md). Applies across [spec 120](120-keeper-of-the-ways.md)'s town and festivals. Every card is in [the companion text](../content/128-out-and-about-text.md); this spec holds the card format, where cards appear and what is (and isn't) kept.

## Purpose

Some of the most important learning can't happen on a screen: holding a pencil, measuring a real cup of water, clapping with someone, watching tonight's moon, finding a woodlouse under a log. Spec 49 keeps these as adult and off-screen routes and says off-screen work may go unrecorded. This spec gives them one shared shape: a short **mission card** that sends the child into the real kitchen, yard or window, and welcomes them back with a question for a conversation with a grown-up.

The game never knows whether a mission happened. It never asks for proof, a photo, a place or a time.

## The card

| Field | Rule |
| --- | --- |
| `id` | Stable id, e.g. `kitchen-cup-of-water`. |
| `from` | The destination or festival it belongs to, by route or festival id. |
| Title | Up to six words. |
| Mission | Up to 40 words, second person, one thing to do. |
| Grown-up line | Required when the card involves the kitchen, water, heat, the outdoors, tools, torches or animals. Says what the grown-up does or watches. |
| Come-back question | One open question to talk about together. Never quiz-shaped; no answer is stored or checked. |
| Needs | Small icons: paper, kitchen, outdoors, a grown-up, a friend or family member. |

Cards are written for any age in the explorer's horizon. The same card works for a younger child with a grown-up doing more, and for an older one doing more alone. Cards never assume a garden, pets, siblings, money or a particular home.

## Where cards appear

- **On end screens.** A destination that has cards shows one, chosen in turn, as plain text under the usual links: *Out and about: {title}*. One card per end screen at most.
- **In the almanac.** A page called **Out and About** in the Field Guide Almanac ([spec 116](116-field-guide-almanac.md)) lists every card by place, with a filter by needs. This is the only full list.
- **At festivals.** Each festival (spec 120 §6) offers its own two cards while it is on.
- **On Storm Day.** The anniversary page offers one card: "Look out of the window where you first saw the storm in the game. What's the weather like today?"

Cards never appear before a task, never interrupt one, and never block anything.

## What is kept

Nothing about whether a mission was done. Two small things are allowed:

- **Later list.** **Save for later** puts a card's id on a short list on the Out and About page (latest 12). Removing it is one tap. The list says *ideas to try*, never *to do*.
- **We tried it.** A button on every card that opens its come-back question and then closes. It stores nothing.

```
outAndAbout: { later: [cardId] }    // latest 12, ids only
```

Validate ids against the card bank; unknown ids are dropped on read without rewriting. Export, import, reset and explorer switching include `outAndAbout`.

No mission contributes to the story, a chapter, a festival job or any observation record. A future spec may add an adult-reported observation for one card, as spec 49 allows; this one does not.

## Safety rules for every card

- No card asks a child to go anywhere alone, outdoors or out of sight of home, or to talk to strangers.
- No card uses heat, sharp tools, mains electricity or chemicals. Kitchen cards say a grown-up is in charge.
- Animal cards are look-don't-touch, and never involve stinging, biting or wild animals beyond garden minibeasts; minibeasts go back where they were found.
- Plants are never tasted unless a grown-up has grown or bought them as food.
- Water cards never involve open water such as ponds, rivers or the sea.
- No card asks for photos, uploads, names, addresses, or anything said about other people.
- Cards with torches or lights say batteries only and never looking into a light.

A child-safety read of the whole bank is a build blocker.

## The bank

The companion holds **61 cards** across the garden's places: the invitations already written in specs 115 to 127, gathered and given the card fields, plus new cards for older destinations (the café and Measuring Kitchen, Willow Post Office, the Story Loft, Paris and the French letters, the riddles, the Water Lab and Rain Paths, the Cartographer's Table, Bell Studio, the Lantern Circuit Bench, the living-things and fossil destinations, the Word Garden, the Keeper's Pages) and for each festival.

## Curriculum fit

Each card belongs to its destination's strands; this spec adds no topic claims. In spec 49's terms, missions are *adult or off-screen* mode with *unobserved* response context, and nothing is recorded as evidence. The strands that rely most on them are **E1** handwriting and transcription, **E5** speaking and listening, **S1-II** real observations, **M5-I** physical measurement, **S7-I** weather, and **L3** relationships and community.

**Teaching contract** ([spec 49 §5](49-six-act-curriculum.md#5-intermediate-teaching-contract)): each card is the *new application* or *purposeful revisit* part of its own destination's contract. Data boundary: card ids on the Later list only.

## Upstream check

Refreshed 2026-10-23: Marble `f186a79a9525c189e2d423e31613c62b6805416f`, Jane `1927912b8d9cd4f7df6e7fbe8416521194743060`. Many Marble teaching-research records say an on-screen task is a complement to a real, hands-on one (for example Rocks and soil, `mt_yhhprm7dZK`, and Testing Materials for Uses, `mt_e3-_toGuWf`). The cards are where that hands-on half lives. Jane has no off-screen pattern; nothing is adopted.

## Checks for implementation

- Every card in the bank has every required field, a grown-up line where the rules require one, and a mission of 40 words or fewer.
- End screens show at most one card, never before or during a task.
- We tried it stores nothing; the Later list stores ids only.
- The Out and About page filters by needs and lists cards by place.

## Review asks

- A child-safety read of all 61 cards.
- Are come-back questions open enough, and free of any hint of a right answer?
