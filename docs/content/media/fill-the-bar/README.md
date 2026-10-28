# "Fill the Bar": provisional recording

The fractions song for Rhythm Studio ([spec 115](../../../specs/115-rhythm-studio.md)), written in [films and songs, section 1](../../films-and-songs-2026-10-24.md#1-the-fractions-song-fill-the-bar). Recorded 2026-10-25, before the first Rhythm Studio release. The bounded [spec280](../../../specs/280-rhythm-first-bar.md) studio is now live; this recording remains outside its runtime, with song integration separately reviewed. **The owner listened to the finished mix and confirmed the ElevenLabs plan covers distribution (2026-10-28). Studio integration review remains pending.** Nothing in `dist/` plays it yet. The proposed **Hear the song** button and the exposure rules in section 1 still belong to the reviewed studio build.

| File | What it is |
| --- | --- |
| `fill-the-bar.mp4` | 125 s, 1280×720, 30 fps. The bar strip fills on the beat with the lyrics underneath; English captions muxed as a subtitle track. |
| `fill-the-bar.mp3` | The soundtrack alone (the same mix as the video). |
| `fill-the-bar.srt` | Line-timed captions (the same cues as the MP4's embedded track). |
| `fill-the-bar.vtt` | The same captions as WebVTT for a browser `<track>`. The tested Chrome browser does not expose the MP4's embedded mov_text track, so a player must load this file. |
| `fill-the-bar-transcript.txt` | The lyrics as recorded, one caption per line, for a readable transcript. |

## Timing

120 BPM in 4/4, measured on the finished audio (beat tracking gives 120.0). The first downbeat is at 0.534 s, so bar *k* starts at 0.534 + 2*k* s. Each pattern fills across one bar while the bell plays it, then holds full for one bar:

| Section (caption start) | Bar pattern |
| --- | --- |
| Intro (0 s) | empty bar, beats counted |
| Verse 1 (8 s) | whole |
| Choruses (about 20 s, 56 s, 100 s) | whole, half, quarter, eighth, two bars each |
| Verse 2 (36 s) | half, half |
| Verse 3 (44 s) | four quarters |
| Verse 4 (73 s) | eight eighths |
| Bridge (80 s) | three quarters and a hatched quarter rest |
| Verse 5 (92 s) | half, quarter, eighth, eighth |
| Tag (116 s) | empty bar; after the song, two quiet bars (120.5 to 124.5 s) with soft beat ticks for the child's own bar |

## How it was made

- **Song:** ElevenLabs Music v2.5, custom lyrics, 122 s, generated on the owner's ElevenLabs account. Style prompt: *Bright, warm acoustic folk-pop children's learning song at exactly 120 BPM in 4/4, with a steady soft woodblock tick on every beat from start to finish. Ukulele, upright bass, soft glockenspiel, light hand percussion and a small bell. One friendly adult female lead vocal with clear, unhurried diction; a small group of adult voices joins on the choruses. Each lyric line takes exactly one bar. The bridge drops to only the tick and a soft voice, then the full band returns. Bracketed tags in the lyrics are performance directions and are never sung.* The lyrics sent are the as-recorded lyrics in section 1, with `[Section]` tags and bracketed performance notes.
- **Spoken intro and tag:** ElevenLabs speech (Eleven v4) with stock adult library voices, "Jesse" for Pip and "Maisy" for Dot. The music model drops spoken lines, so these were mixed in afterwards, one count word per beat.
- **Bell layer:** the music model never holds a note for a whole bar (its longest sung note in verse 1 is about 0.8 s), so a synthesized handbell plays exactly the pattern on screen, including a four-beat whole note, and stays silent on the rest. Each bell note takes a tone of the chord under it. Only the picture and the bell model the bar: the singing and the band follow their own rhythm and keep playing through the rest, so the studio's isolated tones and rests stay the teaching comparison.
- **Picture:** Claude Motion, from a written brief and a reference render that set the beat grid, patterns, labels and palette.
- No child's face, voice or other information was used. All voices are adult stock voices.

## Differences from the brief

- The lyric changes recorded in section 1: verse 1's count and verse 3's taps get bars of their own, the bridge gains two "Tap, tap, tap" bars, and the final chorus is sung once.
- The model dropped verse 1's last line, "One whole note fills the bar. Just one." It is not in the recording or the captions.
- Fraction labels start with verse 2, not "from the second line" of every verse. Verse 1 shows "whole note" without "1 whole", and the chorus whole-note block reads "1".
- The song runs 125 s, against the brief's provisional 90 s.

A future reviewed song-player increment still owns the read-aloud fraction text ("one half", "one quarter") and the accessible labels.

## Review scope, 2026-10-25

Container probe confirms a 125.033-second 1280×720/30fps MP4 with H.264 picture, AAC audio and a mov_text caption track. Root inspected sampled frames for the whole/half/quarter/eighth/rest/mixed arrangements and the final chorus/tag; caption order and lengths are structurally valid. The final chorus begins around 100 seconds (SRT 99.920), not 104. The exact boundary can precede the next frame: sample inside a beat rather than rounding a 30fps frame to a downbeat.

This visual/container review does not establish that every sung word, note onset/duration, accent and rest agrees with the stated grid. The original tempo/zero-offset claims above remain production notes, not independent audio measurements. The owner's listening check and distribution-rights confirmation followed on 2026-10-28. No runtime integration or new commercial-use assurance is added here.
