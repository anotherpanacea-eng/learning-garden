# Play receipt template

A play receipt sits beside the release receipt. The release receipt (step 6 of
"Landing" in [AGENTS.md](../../AGENTS.md)) records what was tested, merged and
deployed. The play receipt records what an explorer does with the thing that
was built. It is one comment on the PR that adds or changes a toy, a prototype
or another child-facing screen.

The five questions come from the play-first plan of 2026-11-09 (fleet cards
LG-75 to LG-88). The builder answers questions 1 to 4 from the built page. The
owner answers question 5 after the toy has been at home for a week.

This repository and its pull requests are public. Put no explorer's name, age,
words, tally counts or habits in a receipt. The home tally stays on paper
([tally sheet](tally-sheet.html)) or in the owner's private notes.

## Template

Copy the block below into a PR comment and fill it in.

```markdown
**Play receipt: <toy or screen name>, at <commit>**

1. **First ten seconds.** What does the explorer do in the first ten seconds?
   <what they touch and what moves>
2. **Sound.** What do they hear?
   <the sound each action makes>
3. **Wrong move.** What happens when they are wrong?
   <what the world shows, and how they try again>
4. **Second go.** Why would they do it a second time?
   <the reason the toy gives, in one or two sentences>
5. **Home.** After a week at home, was it asked for?
   <the owner writes one of: not yet at home / tally kept privately>
   Owner's decision for this toy: <keep / drop / not decided>

Play budget check: <the six result lines from the play budget check, or "not run" and why>
```

## Notes on filling it in

- Answer from the page as built. A plan or a spec is not an answer.
- Question 3 asks what the explorer sees. A sentence of feedback is an answer
  only when a sentence is what the page shows.
- Question 5 never carries numbers. The owner's decision is about the toy. The
  [Phase 1 decision rules](phase-1-decision-rules-proposed.md) are a proposal
  until the owner approves them.
- The play budget check is the script from fleet card LG-79. Until it has
  landed, write "not run".
