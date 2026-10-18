# Responsive help and the Almost-Right Café

## Scope

Build the next increment inside After the Storm: child-controlled support for the existing First Morning tasks, plus one small pretend restaurant path using that support. Preserve all existing visits, math records, guides, avatars, storage keys, public origin, and privacy controls. Generic stories and synthetic tests only; no learner identity or real household anecdotes in public source.

## Responsive help

Every scored story task has a reviewed, smaller parallel example, with a short explanation and a useful representation. A child may open it at any time. After an unsuccessful answer the guide offers it prominently; repeated misses never force a detour, lower a level, close a path, or advance the story. The original question waits in place.

A helper is a separate view within the current node, not a new visit or scored task. It contains the chosen guide, a short lesson, an interactive representation, a single small practice question, optional explanation, and controls to return to the original question or pause. It may also leave the original question for now explicitly. Correct helper answers do not solve or advance the original task. Wrong helper answers receive neutral feedback and another try or an explanation. Multiple answers are accepted when appropriate. Helpers are optional; original hints, explanations, skips, and stopping remain available.

Representations use click/tap and keyboard controls: highlight the clue in a short text; count groups of counters one row at a time; count ruler spaces; compare finite observation data; highlight wanted menu properties. No drag, hover-only action, timers, scores, or live AI. Examples use different numbers/locations from the original task, stay accurate, and return the child to the same purpose. Science examples draw only conclusions supported by their fictional observation data.

## Café

Add a fourth entrance, the Almost-Right Café, through a visible home invitation and the adventure hub. Its customers and menu are explicitly make-believe. It must be enjoyable without physical food or real animal feeding. An imaginary guest wants something unavailable; its stated properties allow more than one suitable substitute. Accept every option satisfying the stated constraints and give a short reason. Do not infer empathy, nutrition knowledge, or a general reasoning level.

Bound the first café visit to three tasks and an unscored project: (1) choose among silly substitutes using two clear properties; (2) work out enough portions for a few guests; (3) compare the order with cupboard stock and find a shortfall. End with an optional paper menu and pretend ordering game. There is no running inventory economy, failure penalty, account, or automated personalization. Each task can be left unexplored; the ending remains truthful if tasks were skipped. Café has its own chapter title, while original First Morning paths retain theirs. Waiting-visit confirmation and resumption work for this fourth entrance.

## Content interface

`restaurant-story.mjs` exports cafeEntrance and cafeNodes using existing entrance/node fields, with entrance id cafe. Choice tasks keep a representative integer answer and add optional answers:[indices] for all accepted answers. Project nodes can supply projectOptions:[strings]. An optional chapter field on the entrance supplies its displayed title.

`help-content.mjs` exports helpers keyed by original node id. A helper has id,title,lesson,passage(optional),model,kind,prompt,choices(optional),answer,answers(optional),explanation,facts(optional). Models: text {segments:[strings],focus:index,clue}; array {rows,cols}; ruler {start,end,max}; compare {labels:[strings],counts:[integers]}; menu {items:[{name,properties:[strings]}],wanted:[strings]}. Each includes an explicit tap-controlled spotlight or counter. All nine task nodes have one helper. New examples and fictional profiles must not encode actual learner records.

## State and evidence

Keep helpers inside each existing node draft: helpUsed stays true after first opening; helper:{open,exampleId,attempts,input,choice,revealed,steps,spotlight}. Validate restored values and recover from malformed additions without discarding valid legacy progress. Input/selection, original attempts, support, method, and reading mode survive helper opening, return, other visits, and reload. Closing or replaying cannot erase that support. A helper is never auto-opened merely by a render or a past miss; stored open state may resume after reload.

Original observation support/independence must include helpUsed. First-try correct after help, even if the child then selects “I knew it”, cannot become independent/fresh evidence. Helper attempts, answers revealed, representation use, and the retained original answer method are shown separately in notebook/export. Reading observation is still separate; using a math helper does not establish independent reading. Project choices remain unscored invitations, never proof of off-screen completion.

Every displayed multiplication pair in a helper or café question feeds the existing exact/commuted exposure store and updates paused story, broad, and original check-in drafts. A smaller example's exposure must not overwrite its own original task's attempts. Centralize acceptance logic so original submit, correct UI state, first-correct evidence, and export agree about multiple valid answers. Do not change the six existing task keys.

Save, export, reset, and persistence-off apply to every new field. Helpers make no remote requests and introduce no free-text identity fields, uploads, analytics, server storage, or child-specific repository fixtures.

## Verification and delivery

Independent spec review before implementation and independent implementation/content review before publication. Check all helper keys and representations, every valid and invalid café substitution, quantities/shortfall, no automatic original advancement, helper support after return/reload, repeated helper attempts, original task skip, legacy migration, exact/commuted exposure into paused drafts, malformed helper recovery, and both café and old path endings. Browser checks include helper from a wrong answer, optional helper before trying, return to a partially answered original task, café waiting/resumption, private notes, saving off, and small-screen touch layout.

Continue the existing draft feature PR rather than introduce a stacked review dependency. Update its title/description around the final change. No GitHub merge without independent Claude clearance on the exact candidate. Site publication may proceed once independent implementation review and root QA clear the candidate. Use the existing Sites source helper, keep deployment identity out of GitHub, and verify the published app anonymously. Stop after the responsive-help loop and one café visit work.
