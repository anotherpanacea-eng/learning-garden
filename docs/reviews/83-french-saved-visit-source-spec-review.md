# French saved-visit specification review

A separate internal reviewer inspected spec83 at `7629f7c` through six grounded lenses. Two P2 findings concerned recovery for a retired/re-paired story and encounter history after old node IDs disappear. The root resolved both at `080eedd`; the same independent reviewer cleared that exact revision in a focused follow-up, with no remaining P1/P2. No external model call or runtime clearance is implied.

Recovery now offers a same-story fresh start only when the old route still matches a current route. Otherwise the learner explicitly chooses another story. Retained visit metadata/seen IDs preserve familiarity across retirement and changed routes, without making legacy responses new independent evidence. These are the required implementation checks in [spec83](../specs/83-french-saved-visit-source.md).
