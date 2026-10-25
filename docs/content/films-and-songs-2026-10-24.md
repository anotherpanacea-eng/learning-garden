# Provisional films and songs: writing for review

Writing pass, 2026-10-24. This document provides provisional writing associated with the [roadmap's film timing table](../roadmap.md#films-and-songs-when-each-is-needed): the fractions song for Rhythm Studio, the concept art brief for *Both Ways Across Willow Bridge*, and storyboards for the act films. Each item names what has to happen before it is produced. The story comes from [spec 120](https://github.com/anotherpanacea-eng/learning-garden/blob/be78fd55a26b4fa716521765a5819e5d3b938392/docs/specs/120-keeper-of-the-ways.md) and its script in [`120-story/`](https://github.com/anotherpanacea-eng/learning-garden/tree/be78fd55a26b4fa716521765a5819e5d3b938392/docs/content/120-story) (draft [PR127](https://github.com/anotherpanacea-eng/learning-garden/pull/127)). Rhythm Studio is [spec 115](https://github.com/anotherpanacea-eng/learning-garden/blob/e02613122f71901879c1c57ffd8261028a20d404/docs/specs/115-rhythm-studio.md) (draft [PR128](https://github.com/anotherpanacea-eng/learning-garden/pull/128)). These pinned drafts are not cleared specifications. If they change names or events, revise this writing. Nothing here makes a runtime adapter or final production ready.

The rules in [story milestones and films](../story-milestones-and-films.md#delivery-and-integration-contract) apply to everything here: a still picture and short text always deliver the same ending, no video gates play, sound starts only when the player chooses it, captions and a transcript ship with every film, and no film shows the answer to an active task.

Three more rules apply to every piece:

- **The learner stays outside the film.** The guide (Mira, Rowan or Ari) and the courier are the explorer's choices, so the films never show a particular guide's or courier's face. A post bag, boots at the door or a figure seen from far behind can stand in for them.
- **Each explorer's choices stay theirs.** Act IV's kept plan and Act V's project differ for every explorer. The films never show which plan was kept or what the project was.
- **No children in the tools.** No real child's face, voice, name, drawing or recording goes into any generation tool. Invented characters only.

## 1. The fractions song: "Fill the Bar"

**What it is:** a short song for Rhythm Studio (spec 115), with a provisional target of about 90 seconds (confirm against the eventual score). It treats this song's four-beat bar as one whole, filled in halves, quarters and eighths. In a three-beat bar, the same note durations represent different fractions; a four-beat whole note does not fit. On screen, a bar strip fills block by block on the beat, the same way the studio's bar does.

**When to produce it:** these lyrics can be reviewed now. Record it during the reviewed Rhythm Studio runtime build, after a music-content check, so the picture matches the built bar. A proposed **Hear the song** button would play it in the studio and is never needed to play a card.

**Provisional recording (2026-10-25):** [`media/fill-the-bar/`](media/fill-the-bar/README.md) holds a recorded song, captions and an animated bar strip, made ahead of the runtime build. The lyric sheet below preserves the written verse, with the omitted recording lines clearly separated; the SRT is the as-recorded transcript. Its README lists how it was made and where it differs from this brief. When the studio's bar is built, check the picture against it before wiring up **Hear the song**.

### Production sheet

- **Tempo:** 120 beats per minute in 4/4, so one beat lasts 0.5 seconds, Rhythm Studio's beat. Every bar of the song has four beats.
- **Voices:** one friendly lead voice, plus a small group on the chorus. Spoken lines are marked with the character's name; any voice can sing any line. Pip is he/him, Dot is she/her, Bramble is she/her.
- **Picture:** a single bar strip of eight equal cells with beat numbers 1 to 4 above every second cell, as in spec 115. In each verse the blocks for that verse's notes appear on the beat they start, labeled with the note's name and, from the second line of each verse, its fraction of the bar. Accessible labels and read-aloud text say fractions in words ("one half", "one quarter", "one eighth"). Rests appear as hatched blocks with the word "rest". Color is never the only cue.
- **Exposure:** the song teaches arrangements used by studio cards, including four quarter notes. A separately reviewed player must retain song use and pictured examples as support before making any unfamiliar or independent-task claim. Keep it off an active echo response unless deliberately opened as support. This writing implements no player or exposure adapter.
- **Accuracy:** every arrangement the song names fills exactly eight eighths. The check table follows the lyrics.

### Lyrics

**Intro** (spoken, over a steady four-beat tick)
> **Pip:** One, two, three, four.
> **Dot:** That's a bar.
> **Pip:** What goes in it?
> **Dot:** Let's find out.

**Verse 1: the whole note**
> Pip rings the bell and lets it go,
> it hums the whole way through, so slow:
> one, two, three, four,
> and then it's done.

*Written ending omitted from the provisional recording:* “One whole note fills the bar. Just one.”

*Performance: the count is whispered, one word per beat, over one held bell note. (The recording dropped the last two lines.)*

*Picture: one block, the whole bar wide, labeled "whole note". From the second line: "1 whole".*

**Chorus**
> Fill the bar, fill the bar,
> four beats long from end to end.
> Long notes, short notes, quiet rests,
> every bar is one whole, friend.
> Fill the bar, fill the bar,
> make it full and make it ring.
> When there's no more room to fill,
> that's the moment that we sing!

**Verse 2: half notes**
> Dot taps once and holds it, two,
> then taps again and holds it too.
> Half a bar, then half a bar:
> two halves make one whole. There you are.

*Picture: two blocks, each half the bar, labeled "half note", "1/2" from the second line.*

**Verse 3: quarter notes**
> The mending crew begin to hammer,
> they never stop and never stammer.
> Tap, tap, tap, tap.
> Tap, tap, tap, tap.
> One beat each, and four in all:
> four quarters fill it, wall to wall.

*Performance: one tap per beat, on the tick.*

*Picture: four blocks, one beat each, labeled "quarter note", "1/4".*

**Chorus**

**Verse 4: eighth notes**
> Bramble's magpie hops in fast,
> two little hops in every beat.
> Eight quick eighths, and not one more,
> and the bar is full and neat.

*Picture: eight blocks, half a beat each, labeled "eighth note", "1/8".*

**Bridge: rests** (softer, the tick keeps going)
> Shh. A rest is quiet, but a rest still counts.
> It takes up room, the same amount.
> A quarter rest, a beat of air,
> the bar keeps time while nothing's there.
> Tap, tap, tap.
> Tap, tap, tap.

*Performance: the taps fall on beats one to three, with silence on beat four.*

*Picture: three quarter notes and one quarter rest. The rest is hatched and labeled "rest". On the rest, the music drops out and only the tick plays.*

**Verse 5: mix them up**
> Now a half, and then a quarter,
> then two eighths to fill the last.
> Long, then shorter, then the shortest:
> one whole bar, from slow to fast.

*Picture: half note, quarter note, two eighth notes, filling the bar in order.*

**Final chorus** (once, with the whole group)

**Tag** (spoken)
> **Dot:** Your turn.
> **Pip:** Fill a bar!

### Check table

| Place in song | Notes and rests | Eighths | Full bar? |
| --- | --- | --- | --- |
| Verse 1 | whole | 8 | yes |
| Verse 2 | half, half | 4 + 4 = 8 | yes |
| Verse 3 | quarter × 4 | 2 × 4 = 8 | yes |
| Verse 4 | eighth × 8 | 1 × 8 = 8 | yes |
| Bridge | quarter × 3, quarter rest | 2 × 3 + 2 = 8 | yes |
| Verse 5 | half, quarter, eighth, eighth | 4 + 2 + 1 + 1 = 8 | yes |

### Before release

- A music check of the lyrics against the notes as sung. Where the singer holds a syllable, the picture's block must match what is heard. *2026-10-25: the sung melody never holds a whole bar, so the provisional recording adds a bell that plays each pictured pattern.*
- Rights and credits for the generated audio, recorded as for any other asset. Keep the lyric sheet and prompts so the song can be made again on another tool. *2026-10-25: tools, voices and the style prompt are in the [recording's README](media/fill-the-bar/README.md).*
- Captions with the lyrics, and a transcript. The song must make sense with the sound off, through the picture and captions. *2026-10-25: [`fill-the-bar.srt`](media/fill-the-bar/fill-the-bar.srt) serves as both.*

## 2. Concept art brief: *Both Ways Across Willow Bridge*

**What it is:** the Act III ending film, 40 to 55 seconds. Seedlings go up the river, reeds and honey come down, Nuria visits Willowbank and recognizes Hollis's handwriting on the flood post's records. Two towns each give something; neither rescues the other.

**When to produce it:** provisional concept art may start from this brief. Final production waits for the reviewed Act III ending and River Market (spec 117) runtime build and fluent-language review, because route geometry and trade amounts may change.

**Style:** match the existing game art in `dist/` and the three existing films (`dist/bramble-film.html`, `dist/cafe-film.html`, `dist/paris-film.html`). Use the established designs for Pip, Dot and Bramble. No copied characters or styles from other films or games.

### The pieces

| # | Piece | What it shows | Notes |
| --- | --- | --- | --- |
| 1 | **The valley map** | One valley in the Pyrenees: Vadoalto upstream, Willowbank in the middle, Les Saules downstream, where Willow Brook joins a bigger river going north. The three Ways out of Willowbank: the river path, the bridge road and the high ford. | A painted map, not a satellite view. No real town names or borders. It must work as a story map, not a lesson in geography. |
| 2 | **Vadoalto's waterfront** | An ordinary modern riverside town on a hillside above the river. A landing with flat, wide boats. Reed baskets stacked on the boats. Vadoalto's flood post by the water, with unnumbered marks; reviewed source material will determine any later scale. | Everyday and lived-in. Not quaint, not poor, not a ruin. The storm reached Vadoalto too, so a little repair work can show, but nothing like a disaster scene. |
| 3 | **Nuria** | Character sheet: an otter, she/her, the apprentice keeper of Vadoalto's flood post. Carrying a bundle of green reeds taller than she is. A satchel of letters. | Front, side and back views, three expressions (curious, laughing, reading carefully). She is a peer and a friend, never a guide who knows more than everyone. |
| 4 | **Léon** | Character sheet: a kingfisher, he/him, the ferry keeper at Les Saules. Fast, cheerful, always slightly damp. | He appears in Act III's letters and in Act VI. One sheet now saves redrawing later. |
| 5 | **The high ford path** | An old path along the river, with fence posts tied with faded ribbons in neat knots: blue at one fork, gold at another. Halfway along, a newer straight path cuts across the old one, with no ribbon on it. | The knots match the bow Bramble ties on the parcel in Act II. |
| 6 | **The boats arrive** | Vadoalto's boats at Willowbank's landing: round loaves as big as cartwheels, jars of dark honey, reed baskets. Willowbank people come down to meet them with apples. | Busy and friendly. No coins counted on screen and no prices shown, so no market task is answered. |
| 7 | **Both ways** | One frame split by the river: a parcel of apple seedlings going up the river path, and a bundle of reeds with a jar of honey coming down. | The key frame for the film. Each town is shown giving, not only receiving. The courier, if shown, is seen from far behind. |
| 8 | **Nuria at the flood post** | Nuria in front of the mill's flood post in Willowbank, reading the marks for a long time. On the bakery windowsill behind, the parcel's pages are drying. | The emotional close. The page itself stays unreadable in the art: the handwriting moment belongs to the in-game ending. |

### Things to avoid

- Spanish or French words on signs, boats or labels until a fluent reader has reviewed them. Leave signs blank or use pictures.
- A guide's or courier's face.
- Any number, price, timetable or flood height that an Act III task asks about.
- Vadoalto shown as needing to be saved, or Willowbank shown as the hero.

## 3. Storyboards for the act films

These are provisional candidate refinements to the shot suggestions in [story milestones and films](../story-milestones-and-films.md#film-briefs-a-producer-can-use) for these four films, with spec 120's cast and events added. They replace no approved brief until their source and story reviews clear. The rest of that document stands. Times are approximate. Each storyboard ends with the still picture and text that deliver the same ending when the film is skipped or unavailable.

### A Town of Our Own (Act II ending)

**Length:** 40 to 50 seconds. **Produce:** update a provisional brief during Act II specification; final production during its reviewed runtime build, with the trigger checked before final cut.

| Time | Shot |
| --- | --- |
| 0–5 s | Evening in Willowbank. Lanterns being lit along the street. Nothing is being mended; the town is just being lived in. |
| 5–12 s | The café, full. Ember's birthday cake carried out on a tray. Ember pretends not to have expected it. |
| 12–18 s | Bramble tying ribbons on chairs and lanterns, and one on a surprised Pip. |
| 18–26 s | The Story Loft's show: a painted backdrop of the footbridge and puppets. The ducks crowd the front, uninvited. |
| 26–32 s | At the curtain call, the baker asks Dot something. She glances at Pip and nods. (No dialogue needed; the game text carries "I already unpacked.") |
| 32–40 s | Wide shot: the whole town together under the lanterns. Music, dancing. |
| 40–48 s | The bridge road at the edge of the evening. A post bag comes up the road with a letter. The stamp reads Vadoalto. Hold on the letter. |

**Final line (optional):** "There is more than one way to make a place your own."
**Still and text:** the lantern-lit town at the celebration, with the letter on the post office counter. Text: "Willowbank has a celebration, and this time it isn't about mending anything. As the evening ends, a letter arrives from upstream."
**Avoid:** a "you saved the town" message, a scene showing every game, or any particular contribution the explorer must have made.

### The Map We Changed (Act IV ending)

**Length:** 35 to 50 seconds. **Produce:** provisional storyboard now; final production during the reviewed Bank Builder (spec 124), meeting-board and ending-adapter runtime build.

| Time | Shot |
| --- | --- |
| 0–6 s | The town meeting in the library. Three large sheets pinned side by side: a drawing of **the Wall**, of **the Sponge** and of **Some of Each**. No labels needed beyond the drawings. |
| 6–14 s | Bramble standing up for the Wall and the orchard families. The orchard keeper beside her. People listen; nobody laughs. |
| 14–22 s | The miller walks to the front holding the flood ledger and points at a line in it. She is changing her mind and says why. (Which plan she moves toward is not shown; the camera stays on the ledger and her face.) |
| 22–30 s | The low corner of the orchard at dusk: standing water around the youngest trees. The orchard keeper and the miller look at it together, each pointing at something different. |
| 30–38 s | Back at the meeting: the three sheets are still pinned up. Someone adds a note to one of them. Nobody tears anything down. |
| 38–45 s | Next morning: neighbors put small stakes in the ground at the low corner to watch how the water moves. It is a first step that can be undone. A question card stays on the noticeboard. |

**Final line (optional):** "A good reason can change a plan."
**Still and text:** the three plan sheets on the library wall, with a note pinned beside them. Text: "The town met about the low fields. Nobody had to agree about everything. Someone changed their mind, and said why."
**Avoid:** a winning plan, a villain, Bramble shown as wrong or redeemed, or the explorer's kept plan.

### A Question of Our Own (Act V ending)

**Length:** 35 to 50 seconds. **Produce:** provisional storyboard now; final production during the reviewed Act V project-path and ending-adapter runtime build.

| Time | Shot |
| --- | --- |
| 0–6 s | The Keeper's Pages open on a page headed *For the next Keeper*. Blank. |
| 6–16 s | A fixed fictional example: the librarian starts the first *Willowbank Gazette*, a single crooked page pinned up outside the library. |
| 16–24 s | Neighbors read it. Pip points out a mistake. The librarian winces, then laughs. |
| 24–34 s | The second version: smaller, clearer, with a note at the bottom about what it still doesn't know. |
| 34–42 s | The Gazette read aloud to a small gathering on the library steps. Listening, not applause. |
| 42–48 s | The blank page from the opening now has a ribbon bookmark in it. Its contents are not shown. |

**Final line (optional):** "A first try, a second look, and a question still worth asking."
**Still and text:** the Gazette pinned outside the library, with its note at the bottom. Text: "A question became a first version, and then a better one. One more page is bound into the Keeper's Pages."
**Avoid:** anything that looks like the explorer's own project, online publishing, or applause standing in for a grade.

### The Opening of the Ways (Act VI ending, the finale)

**Length:** 50 to 75 seconds. **Produce:** provisional concept now; final production during the reviewed Act VI ending runtime build, after the meeting board and exchange planner exist.

| Time | Shot |
| --- | --- |
| 0–8 s | The long rain is over. Willowbank in morning sun: the bridge, the mill and every mended thing standing. Puddles, nothing broken. |
| 8–16 s | Quick memory of the warning chain, in three shots: Nuria's card handed to Vadoalto's runner; a post bag going down the river path toward Les Saules; Léon on his ferry, reading. |
| 16–26 s | The first regular exchange sets off up the river path: apples and drawings going up. |
| 26–36 s | On the river path, a grey heron walking home: **Hollis**, they/them, older, unhurried. They stop at the mill's flood post and read the new marks. |
| 36–46 s | Supper at the café, with Hollis at the table. Bramble ties a ribbon at the start of each Way: river path, bridge road, high ford. |
| 46–58 s | At the bridge, a newcomer arrives carrying an unfamiliar parcel, looking lost. Dot gets there first, because she remembers being new. |
| 58–68 s | Wide shot: Dot, Pip and the newcomer at the bridge, with an open place left beside them for the explorer and their guide. |

**Final line (optional):** "There will always be another question. This time, someone new has come to ask it with you."
**Still and text:** the bridge with ribbons on each Way and the newcomer holding the parcel, Dot beside them. Text: "The Ways are open. Hollis is home. And someone new has arrived with a parcel of their own."
**Avoid:** the town damaged again, which Act IV plan was kept, Hollis's letter readable on screen (the page 6 text belongs to the game), or the explorer's guide or courier shown.

## Review

Each piece here is writing. Before production: an independent read for story consistency with spec 120 and its script; a music check for the song; a fluent Spanish and French reader for any text that ends up on screen; and a child-safety read of the final cuts. These briefs commission nothing by themselves.
