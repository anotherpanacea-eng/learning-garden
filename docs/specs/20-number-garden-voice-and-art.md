# Number Garden read-aloud and art

Status: proposed; awaiting independent spec review. Reuses the existing local speech controls in `play-media.mjs` and the original SVG approach in `companions.mjs`.

## Read-aloud

Story, café and Paris tasks already offer optional local read-aloud through `hearButton` and `bindSpeech`; Number Garden pages do not. Add **Hear it** to each Number Garden question, lesson, hint, step, feedback line and Dot's prompt, using the same voice and speed controls, the same local-voice-only rule, no automatic audio and the same stop control.

Speech engines read math symbols poorly. A shared `spoken(text)` prepares text before `speak`: `__` as "blank", `×` "times", `÷` "divided by", `−` "minus", `=` "equals", `cm` and `m` after a number as centimeters and meters, `3-by-4` as "3 by 4". Items may supply a `say` override. Apply the same function to existing café and multiplication-garden speech, where expressions such as "7 × 8" also appear.

## Pip and Dot

Number Garden shows Pip and Dot only as the 🦊 and 🐞 emoji, while the rest of the app has original illustrated guides. Draw both in the house style (flat palette shapes, 2 px ink outlines, no gradients): Pip, a small fox with a satchel; Dot, a ladybug with round glasses. Each has five poses (`wave`, `think`, `point`, `cheer`, `puzzled`) from `pip(pose)` and `dot(pose)`, labeled when meaningful and hidden from assistive technology when decorative, each under 2 KB. Dot's side note follows the state: thinking before an answer, cheering after a correct one, puzzled beside targeted feedback from [spec 18](18-number-garden-help-and-feedback.md). The story modules' existing Pip and Dot references can use the same art.

## Garden scenes and story objects

Replace each area's emoji icon with a small original scene: stick bundles on burrow shelves, rows of picnic cups, a lily pad cut into equal parts, numbered stepping stones, a pavilion with shape flags, a ribbon spool on a ruler, a hollow log with a magnifying glass.

Array and counter models accept `item` (`seed` by default, plus `berry`, `cup`, `cracker`, `muffin`, `button`, `pebble`, `tile`, `flower`), drawn once per page as SVG symbols and referenced with `<use>`, so a story about cups shows cups. Content sets `item` to match each story. The existing system typography stays as chosen in the first-visit spec.

## Verification

Every `spoken` mapping is covered and plain sentences pass through unchanged; with a stub speech object, Hear it speaks the transformed text once and Stop cancels; without local voices the read-together fallback shows. Every pose renders valid SVG with a label or `aria-hidden`; every model `item` resolves to a symbol; no Number Garden view still shows the Pip or Dot emoji. Browser: hear one item per area with a local voice and with none available, at 375 px and 768 px.
