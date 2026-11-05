# 382 review prompts and scope

Each provider gets the **complete** finite companion, separately, without another provider's report. The public source file at the named revision is the text input; the surrounding specification is an additional independent design-review input for Claude, not a replacement for full language review.

## Initial language prompt

Independent complete finite language/content review. Do not read any other review. Review every French line and English gloss in the complete companion below as standard beginner French. Check grammar/spelling, naturalness, destination-based Pour qui, misleading glosses, beginner load, question usefulness/answer giveaways, and the pedagogy of ungraded question-driven information gathering. State provider/model and confidence, exact flagged lines and smallest repairs. CLEAR only if all lines acceptable. Do not infer language proficiency. No tool execution is needed; all public proposed content is supplied.

Input: companion revision1. Google received the full prompt but returned RESOURCE_EXHAUSTED before any tokens or review. It is not a panel vote. Claude additionally received the complete proposed spec and read-only repository access to verify seams.

## Revised complete-language prompt

Review every line of the complete revised companion independently, without reading other-provider reports. Recheck all French notes, questions, replies, labels, example and aligned English glosses; grammar/spelling, naturalness, current room versus destination, beginner load and giveaways. State provider/model if exposed, confidence, exact remaining errors or CLEAR. Do not treat this as proof of learner proficiency. Input: complete revision4, as retained in this branch.

OpenAI received the full companion on each recheck. Claude's focused recheck additionally received its own initial review and the enumerated repaired specification findings, with instructions not to read another provider's report. The final recheck adds the four explicit destination notes and click-time voice availability repair; no other-provider report is supplied. The third completed provider review remains pending; no implementation clearance is claimed.
