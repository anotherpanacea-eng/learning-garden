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

**Provisional recording (2026-10-25):** [`media/fill-the-bar/`](media/fill-the-bar/README.md) holds a recorded song, captions and an animated bar strip, made before the first Rhythm Studio release. The bounded spec280 studio is now live; this recording remains authoring material outside its runtime. The lyric sheet below preserves the written verse, with the omitted recording lines clearly separated; the SRT is the as-recorded transcript. Its README lists how it was made and where it differs from this brief. A separately reviewed song-player increment must compare it with the built bar and keep its broader eighth-note content distinct before wiring up **Hear the song**.

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

*Performance: the count is whispered, one word per beat, over one held bell note. (The recording includes the count and “and then it’s done”; only the written ending noted above is omitted.)*

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

*Picture: three quarter notes and one quarter rest. The rest is hatched and labeled "rest". Only the modeled picture and bell rest on that beat in the provisional recording; the band and singing follow their own rhythm. Use the studio’s isolated tones/rests for the timing comparison.*

**Verse 5: mix them up**
> Now a half, and then a quarter,
> then two eighths to fill the last.
> Long, then shorter, then the shortest:
> one whole bar, from slow to fast.

*Recording note: the tempo remains 120 BPM. “Slow to fast” is a lyric about changing note lengths; it does not announce a tempo change.*

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

- A music/content check of the modeled bell notes against the pictured blocks. Name singing/accompaniment as separate parts, whose rhythms need not match those blocks; they do not supply the studio’s isolated duration/rest comparison. *2026-10-25: the sung melody never holds a whole bar, so the provisional recording adds a bell that plays each pictured pattern. 2026-10-28: the owner listened to the finished mix.*
- Rights and credits for the generated audio, recorded as for any other asset. Keep the lyric sheet and prompts so the song can be made again on another tool. *2026-10-25: tools, voices and the style prompt are in the [recording's README](media/fill-the-bar/README.md). 2026-10-28: the owner confirmed the ElevenLabs plan covers distribution.*
- Captions with the lyrics, and a transcript. The song must make sense with the sound off, through the picture and captions. *The authoring pack now also includes browser [WebVTT captions](media/fill-the-bar/fill-the-bar.vtt) and a [readable transcript](media/fill-the-bar/fill-the-bar-transcript.txt); the future player must use them, because embedded MP4 captions alone are not exposed by the tested Chrome browser.*

## 2. Concept art brief: *Both Ways Across Willow Bridge*

**What it is:** the Act III ending film, 40 to 55 seconds. Seedlings go up the river, reeds and honey come down, and Nuria visits Willowbank to read the marks on its flood post. The film stops before the third page comes free; its contents and the handwriting recognition remain in the game. Two towns each give something; neither rescues the other.

**When to produce it:** provisional concept art may start from this brief. Final production waits for the built Act III ending ([326](../specs/326-both-ways-across-willow-bridge.md)) and the River Market's built errands ([324](../specs/324-river-market-cargo.md) onward), because the market scene and the ending still may change in their builds. The Spanish no longer waits on a human reader: the owner's 2026-10-30 decision replaced that with the model panel, and the [117 panel](../reviews/117-spanish-panel/resolution.md) and [326 panel](../reviews/326-spanish-panel/resolution.md) have resolved the lines this film could show.

**Reconciled 2026-10-31** with the reviewed Act III specs (card LG-28):

- **Where it plays.** 326 delivers the ending as a still picture and text at `#almanac/both-ways`, after **Send the seedlings up the river**. The film is optional and enhances that same ending. It never decides eligibility, and it ends before **Read the third page**: Page 3 and Nuria's recognition of Hollis's handwriting stay in the game.
- **The goods.** The film shows what 326's still shows: seedlings in a crate going up the river path, and a barge coming down with reeds and a honey jar. The barge is *La Garza*, Vadoalto's flat, wide barge from 117, whose cargo in 324 is honey, flour and a box of reed seeds. 316's seed exchange trades apple baskets for reed bundles at an agreed rate and shares a nursery of seedlings 5 to 3.
- **What the film must not answer.** 324 asks how many jars of honey *La Garza* brings, and 328 asks where the bakery is from the landing. 316's tasks use trade groups and nursery shares. So no countable jars, sacks, baskets, bundles or seedlings in groups that match those tasks, and no landing-to-bakery route on screen. Do not show or name cargo destinations either: no honey delivered to the café, flour to the bakery, or reed seeds to the garden. Keep unloading within an unlabeled landing area, with no destination labels or directional cues.
- **[PR202](https://github.com/anotherpanacea-eng/learning-garden/pull/202)'s landing study** is an input to pieces 2, 6 and 8: its landing, mill wheel and unnumbered flood post fit. Its boat is a small rowboat, where *La Garza* is a flat, wide barge, and its open basket and crate counts would need the rule above. Its Blender reopen and implementation clearance are still open; this brief neither clears nor closes it.

**Environment study:** the [Willowbank landing concept](../../design/concepts/willowbank-landing/README.md) includes a preview, editable Blender scene and reproducible builder for the mill-side landing and exchange props. It remains provisional environment art, not a final film shot or runtime integration.

**Style:** match the existing game art in `dist/` and the three existing films (`dist/bramble-film.html`, `dist/cafe-film.html`, `dist/paris-film.html`). Use the established designs for Pip, Dot and Bramble. No copied characters or styles from other films or games.

### The pieces

| # | Piece | What it shows | Notes |
| --- | --- | --- | --- |
| 1 | **The valley map** | One valley in the Pyrenees: Vadoalto upstream, Willowbank in the middle, Les Saules downstream, where Willow Brook joins a bigger river going north. The three Ways out of Willowbank: the river path, the bridge road and the high ford. | A painted map, not a satellite view. No real town names or borders. It must work as a story map, not a lesson in geography. |
| 2 | **Vadoalto's waterfront** | An ordinary modern riverside town on a hillside above the river. A landing with flat, wide boats. Reed baskets stacked on the boats. Vadoalto's flood post by the water, with unnumbered marks; reviewed source material will determine any later scale. | Everyday and lived-in. Not quaint, not poor, not a ruin. The storm reached Vadoalto too, so a little repair work can show, but nothing like a disaster scene. |
| 3 | **Nuria** | Character sheet: an otter, she/her, the apprentice keeper of Vadoalto's flood post. Carrying a bundle of green reeds taller than she is. A satchel of letters. | Front, side and back views, three expressions (curious, laughing, reading carefully). She is a peer and a friend, never a guide who knows more than everyone. |
| 4 | **Léon** | Character sheet: a kingfisher, he/him, the ferry keeper at Les Saules. Fast, cheerful, always slightly damp. | He appears in Act III's letters and in Act VI. One sheet now saves redrawing later. |
| 5 | **The high ford path** | An old path along the river, with fence posts tied with faded ribbons in neat knots: blue at one fork, gold at another. Halfway along, a newer straight path cuts across the old one, with no ribbon on it. | The knots match the bow Bramble ties on the parcel in Act II. |
| 6 | **The boats arrive** | Vadoalto's boats at Willowbank's landing, *La Garza* among them: round loaves as big as cartwheels, dark honey, flour sacks, reed baskets. Willowbank people come down to meet them with apples. Marisol, Teo and Nube the grey cat (117) can be background figures. | Busy and friendly. No coins counted on screen and no prices shown, goods in heaps rather than countable rows, and unloading kept on an unlabeled landing with no cargo carried to a building, so no market task is answered. *La Garza* may carry its name on the hull: it is panel-resolved text. |
| 7 | **Both ways** | One frame split by the river: a crate of apple seedlings going up the river path, and *La Garza* coming down with reeds and a jar of honey. | The key frame for the film, and the same composition as 326's still, so the film and the still deliver one ending. Each town is shown giving, not only receiving. The courier, if shown, is seen from far behind. |
| 8 | **Nuria at the flood post** | Nuria in front of the mill's flood post in Willowbank, reading the marks for a long time. On the bakery windowsill behind, the parcel's pages are drying. | The emotional close. The page itself stays unreadable in the art: the handwriting moment belongs to the in-game ending. |

### Things to avoid

- Spanish or French words on signs, boats or labels unless the model panel has resolved them. Today that allows *La Garza* and the traders' «¡Pan, cestas, miel!»; leave other signs blank or use pictures.
- A guide's or courier's face.
- Any number, price, timetable or flood height that an Act III task asks about.
- Vadoalto shown as needing to be saved, or Willowbank shown as the hero.

## 3. Storyboards for the act films

These are provisional candidate refinements to the shot suggestions in [story milestones and films](../story-milestones-and-films.md#film-briefs-a-producer-can-use) for these five films, with spec 120's cast and events added. They replace no approved brief until their source and story reviews clear. The rest of that document stands. Times are approximate. Each storyboard ends with the still picture and text that deliver the same ending when the film is skipped or unavailable.

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

### Both Ways Across Willow Bridge (Act III ending)

**Length:** 40 to 55 seconds. **Produce:** provisional storyboard now; final production during the built Act III ending (326) and River Market, with the trigger checked against 326 before final cut. It plays after **Send the seedlings up the river** and stops before **Read the third page**.

| Time | Shot |
| --- | --- |
| 0–6 s | Morning at Willowbank's landing. *La Garza* ties up, low in the water. Nube watches from the cargo. |
| 6–14 s | The market: Vadoalto's traders call «¡Pan, cestas, miel!» Loaves, honey and reed baskets are set down in heaps on the landing, with no building or destination shown; Willowbank people come down with apples. |
| 14–22 s | The orchard keeper packs a crate of apple seedlings. Bramble ties the bow from the Act II parcel on it, the same knot as the old ribbons on the fence posts. |
| 22–32 s | The key frame: the river splits the screen. The seedlings go up the river path; *La Garza* comes down with reeds and a honey jar. Hold. |
| 32–42 s | Nuria steps off the barge with the reeds and walks up to the mill. She stops at the flood post. |
| 42–52 s | Nuria reading the marks for a long time. Behind her, on the bakery windowsill, the parcel's pages are drying. One lifts in the breeze. Cut before it comes free. |

**Final line (optional):** none. 326's text carries Nuria's "Ours has marks like this" in the game.
**Still and text:** 326's still, with its companion text and alt text: seedlings in a crate go up the river path while a barge comes down with reeds and a honey jar; Nuria stands at the Willowbank flood post, reading the marks.
**Avoid:** the third page, its handwriting or Hollis; any count or route an Act III task asks about; which chapters the explorer brought work from; Vadoalto rescued or Willowbank the hero; the explorer's guide or courier's face.

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
