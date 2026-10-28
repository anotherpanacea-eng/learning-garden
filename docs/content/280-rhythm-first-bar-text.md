# Spec280 · finite child text

Original authored content for [spec280](../specs/280-rhythm-first-bar.md); bounded content review is recorded in the [specification review](../reviews/280-rhythm-first-bar-spec.md). Only `{guide}`, bounded quantities and block names are interpolated safely. Fractions in visible controls use words in narration. Hidden target-order text is never narrated before Show. All text English.

## Entry

Title **Rhythm Studio**. Intro: “The mending crew needs a rhythm. Keep one sound long, break it into shorter sounds, or leave a quiet beat.”

“Every bar here has four beats. At this steady beat, a bar takes two seconds.”

Volume: “Start with your device volume low. Stop whenever you want.”

Links **Visit Bell Studio** · **Try Fraction Trail** · **Try Ribbon Recut** · **Keep exploring** · **Grown-up notes**.

Entry from Bell: **Same sound, different lengths** / “In Rhythm Studio, make a long sound, shorter sounds and quiet beats.” / **Open Rhythm Studio**.

Choice heading **Choose a rhythm**. Choices **A bar of your own** · **Echo one** · **Echo two** · **Echo with a quiet beat**. Source-choice body: “Choose any one. Your other rhythms stay here.” No recommended level or automatic assignment.

## Learn the lengths

Drawer/action **Try the lengths**. Drawer intro: “The sound stays at the same pitch. Its length changes. Tap Play example when you want to listen.”

Controls **Play example** · **Stop** · **Next** · **Back** · **Return to my rhythm**. No auto-play on Next.

1. **One whole note** / “One whole note takes all four beats of this bar.” Pattern `w`.
2. **Two half notes** / “Each half note takes two beats. Two halves take the same time as one whole note. There are two sound beginnings instead of one.” Pattern `h h`.
3. **Four quarter notes** / “Each quarter note takes one beat. Four quarters fill the same bar. Four sound beginnings, the same two seconds.” Pattern `q q q q`.
4. **A quiet beat** / “This bar has three quarter notes and one quarter rest. The rest takes one beat too. It is quiet, and we keep counting.” Pattern `q rq q q`.

Always below worked strip: “All four beats stay here, however you fill them.”

**Why does a half note sound different from two quarters?** / “They take the same time, but two quarters have two sound beginnings. This computer leaves a tiny gap before the next sound.”

**Pitch and length** / “Bell Studio changes how high or low a sound is. Here every note uses the same pitch. You choose how long it takes.”

## Composer

Own-bar heading **A bar of your own**. Prompt: “Make a rhythm for a job or a gathering. You can leave it unfinished, keep it, or change it again.”

Palette heading **Notes and a quiet beat**. Native palette labels:

- **Whole note · four beats · whole bar**
- **Half note · two beats · one half of this bar**
- **Quarter note · one beat · one quarter of this bar**
- **Quarter rest · one quiet beat · one quarter of this bar**

Palette and spoken block labels: **Whole note** / **Half note** / **Quarter note** / **Quarter rest**, with the corresponding fraction of this bar. In the narrow strip, use compact visible beat counts and **1 bar**, **1/2 bar**, **1/4 bar** beside the note symbol; full word labels remain in each block’s accessible name and the palette. Rest carries hatching and **rest**; empty area says **Space**, with the full accessible label **{n} beats unfilled**.

Beat-strip prose: “Four beats: one, two, three, four.” Moving marker speech/status if supplied: **Beat {n} of four**. Hidden reference playback uses that same generic pulse; no code/attack/rest name is disclosed through it.

Controls **Play my bar** · **Stop** · **How full is this bar?** · **Move left** · **Move right** · **Swap for…** · **Remove** · **Clear this bar** · **Keep this rhythm** · **Keep the bar facts** · **Choose another rhythm** · **Start another version**.

Selection: “Choose a block to move, swap or remove.” Selected: “Selected: {block}, position {n}.”

Clear confirmation: **Clear the current bar?** / “Your earlier checks and kept version stay.” / **Yes, clear this bar** · **Keep this bar**.

## The three echoes

Common intro: “Bramble's magpie has a rhythm. Ask to hear it, then build a bar. You can show the example whenever you want.”

**Echo one** target `q q h`.

**Echo two** target `h q q`.

**Echo with a quiet beat** target `q rq q q`.

Target orders are not printed in the initial prompt or a screen-reader label.

Controls **Play the example** · **Show the example** · **Compare with the example** · **Hide the example**. Hide does not remove the saved example support.

After Show: “Here is the example. You can build from the picture, then play the two bars one after the other.” Pattern labels become visible. No automatic playback. Reveal-specific descriptions, only after Show:

- Echo one: “Two quarter notes, then one half note.”
- Echo two: “One half note, then two quarter notes.”
- Echo with a quiet beat: “One quarter note, one quarter rest, then two quarter notes.”

Match, example not shown: “Your blocks match this example. You can play your bar and the example again.”

Match, example shown: “Your blocks match the picture. Looking is a way to learn.”

Different: “These blocks make a different rhythm. Keep your idea, listen again or show the example.”

Feedback never prints the hidden target's order. No “caught it by ear,” heard/hearing claim or praise for independence.

## Facts, playback and refusals

How-full facts: **{used} of four beats filled** / **{left} beats unfilled** / **{attacks} sounding notes** / **{rests} quarter rests** / **The placed blocks take {seconds} seconds**. Grammar uses **one beat**, **one sounding note**, **one quarter rest**, **one second** where appropriate; other integer quantities use plurals. All possible occupied times are0,.5,1,1.5,2seconds, narrated as zero/half a/one/one and a half/two seconds. Zero used: “The bar is empty. All four beats are unfilled.” Full: “All four beats are filled.”

Below incomplete bar: “Unfilled space is not a rest you placed. Add a rest if you want a quiet beat in your rhythm.”

Not-fit refusal: “That {block} needs {needed} beats. This bar has {left} beats left. Remove a block or choose a shorter one.” Use **one beat** grammar for needed/left1. Full refusal: “The bar is full. Remove or swap a block to change it.”

Empty Play: “There is nothing to play yet. Add a note or a rest.”

Requested: “Starting this short sound request.”

Playing: “The bar is playing. Stop whenever you want.”

All rests: “These blocks are all rests. Follow the four quiet beats.”

Incomplete Play: “The unfilled end stays empty while the four beats pass.”

No sound: “Sound is unavailable here. You can still build the bar and follow its four beats.”

Finished: “The bar has finished.” Stopped: “Stopped. Your rhythm is still here.” No automatic loop.

Facts kept: “These bar facts are kept. You can still change the rhythm.”

Keep result: “Kept. You can change the current bar; this version stays until you choose to replace it.” Kept heading **A version to keep**. Replace button **Replace the kept version**. Confirmation **Replace this kept version?** / “Earlier checks stay in your notes.” / **Replace it** · **Keep the earlier version**.

Source visit list **Earlier rhythms**. Readable label “{title} · version {id}”. Unsupported item label **Earlier rhythm retained**.

Capacity/preflight refusal: “This change could not be kept safely. Your earlier work is unchanged. Download your notes or keep exploring.”

Unreadable draft: “This earlier rhythm cannot be edited here. It stays in your notes. You can open another rhythm or start another version.”

Unreadable kept version: “This kept version cannot be read here. It stays in your notes and will not be replaced. Start another version to keep new work.”

Unsupported root: **An earlier Rhythm Studio notebook is kept** / “This version cannot open that notebook. Its original stays in your notes. Other places are open.”

## Grown-up panels and notes

Panel **About these sounds** / “These are simple330Hz computer tones, not recordings of a real instrument. The scheduled note length includes a short gap before the next sound. All four beats take two seconds. Equal source gain does not promise the same perceived loudness on every device.”

Panel **About examples and records** / “Audio requested does not establish that sound played, was heard or was copied by ear. Shown examples, worked teaching and earlier feedback are retained separately. An exact code match is an arrangement fact, not a musical-quality, reading or fraction-mastery judgment. Clapping or performing away from the screen is not observed here.”

Notes title **Rhythm Studio · bars and examples**. “Current and kept bars, frozen source versions and earlier comparisons stay separate. Earlier outcomes are shown as recorded. Supplied examples and support do not change another activity's records.”

Labels **Reference sound requested in this version** · **My bar sound requested in this version** · **Example shown in this version** · **Worked lengths opened in this version** · **Earlier feedback seen in this version** · **Earlier comparison on this version** · **No reference sound requested in this version** · **Target picture not shown before this check in this version** · **Target picture shown before this check in this version** · **Recorded match** · **Recorded different rhythm** · **Bar facts only** · **Kept version** · **Earlier unreadable record retained**.

Off-screen invitation: “If you like, clap your bar for someone. Which sounds are long, and where is it quiet?” No recording, upload, result entry or completion flag.
