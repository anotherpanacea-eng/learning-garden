# Bounded mobile quality sprint — 2026-10-21

This is Linux cloud Chromium evidence, not real iPhone/iPad testing or a confirmation of Mac voice quality. The baseline was main `9613085125d3b8f2ddf9e1ecadd108eb14a054db`. All observations and exports used synthetic fixtures.

## Demonstrated defects and changes

| Baseline reproduction | Changed behavior |
| --- | --- |
| Save a voice key, then remove it from the browser list. Hear silently queues a different local voice and the picker displays that replacement. | The unavailable saved key remains selected. No replacement is queued. An explanation offers Refresh, an explicit available local voice, Automatic, or reading together. Late enumeration restores the selected key without starting speech. |
| Start a synthetic utterance, then dispatch `pagehide`. The speech cancellation count does not change. | `pagehide` and hidden-page lifecycle stop speech and clear the active controls. Returning does not restart it. Late callbacks cannot overwrite a newer utterance's status. |
| After successful startup, make `Storage.setItem` throw, then type in a story answer or change the voice preference. No warning appears until another render; Notes still claims progress is saved. | Save updates one warning immediately without replacing the activity DOM or losing input/focus. Notes reports save health. The unsaved in-memory draft remains downloadable. |

Voice selection still uses the existing local-only filter and automatic name/default heuristic. Explicit choices take priority. A known choice for the other passage language permits automatic local speech for the current language, with a visible explanation, while preserving the saved choice. No storage schema or learning-evidence rules changed.

The app now describes the voice **requested** through the browser API. It cannot verify which sound an OS actually emits. The reported Mac problem has not been audibly reproduced here; its cause remains unconfirmed. Downloaded system voices, Siri voices and browser-exposed voices are not interchangeable guarantees.

## Verification

- All **63 README-listed Node suites** passed, including **28 new selection/preference checks** in `test/mobile-quality-checks.mjs`. The final targeted speech, paused-draft, storage and transfer checks also passed.
- `test/mobile-quality-browser.py` passed **94 checks** in Chromium **151.0.7922.173**, with the Chromium sandbox enabled. Python Playwright and Chromium were already installed. No package installation or external service was needed.
- Forty-five route/viewport combinations fit their viewport: `home`, `numbers`, `living`, `loft`, `words`, `notes`, `companions`, `post`, `science`, each at **320×740, 375×667, 390×844, 768×1024 and 844×390**. This measures representative routes, not every activity/state or physical device behavior.
- Expanded voice guidance and long synthetic voice names fit at 320 px. The voice/speed selectors, preview and refresh controls measured at least 24 px wide and 44 px high. This is a focused control check, not a complete accessibility conformance audit.
- Keyboard first-run film skip, Skip to activity focus and voice preview passed. Touch-operated pause/resume preserved a selected answer and hint through reload.
- JSON download matched the saved synthetic garden. Local import added a separate explorer and preserved the original. Reset cancellation kept progress; confirmation cleared only the active explorer. Saving off removed managed explorer, legacy and kept copies.
- No application JavaScript errors or nonlocal requests occurred in the bounded browser run. Native Chromium enumeration in the initial baseline returned no voices, so speech tests use synthetic voice objects and utterances; they establish requested identity and lifecycle, not audible quality or OS behavior.
- Loaded routes remained usable after disabling the browser network. Offline reload failed with `net::ERR_INTERNET_DISCONNECTED`. The hosted static app has no service-worker installation guarantee; a downloaded static copy served locally needs no internet. This sprint does not add an offline installation or promise hosted cold-start/reload availability.

Reproduce the Node checks using the README commands. With Python Playwright and a sandbox-capable Chromium already installed:

```sh
python3 test/mobile-quality-browser.py --evidence /tmp/garden-mobile-results.json
```

Use `--chromium PATH` for a different installed executable. The script starts and closes its own loopback server, creates disposable browser contexts, and can save a JSON result. Run it in an environment that supports Chromium's sandbox; do not disable that sandbox to obtain a result. The cloud executor required its supported per-command elevated route to launch Chromium. No browser security settings were changed.

## Real-device checklist — all pending

- [ ] **Mac Safari and Chrome:** preview the parent's desired installed voice in OS settings, refresh/reopen the browser, select the voice if offered by the app, and compare the audible preview with its displayed requested name. Check saved selection after reload, a delayed list, deletion/unavailability, and English/French passages. Do not assume every downloaded voice is exposed to the browser.
- [ ] **iPhone Safari and iPad Safari:** portrait and landscape, larger text/zoom, touch targets, onscreen numeric keyboard, VoiceOver order and focus, first-run film skip, reset dialog and all relevant voice controls.
- [ ] **Background/return and audio:** switch tabs/apps, lock/unlock, interrupt playback, then return. Confirm narration stops and requires a new deliberate action; check device mute/volume, headphones and routing without changing account settings.
- [ ] **Progress with synthetic fixtures:** pause/reopen/resume, switch explorers, download/import via Files, invalid-file handling, saving off, storage failure where feasible, and cancel/confirm reset. Keep exports private.
- [ ] **Offline on each device:** compare a loaded session, navigation and narration with reload/first visit. Record actual limits rather than inferring them from desktop emulation.

Use browser/OS version and generic voice names in a private test record; omit device identifiers and real learner information. No real-device result is claimed by this checklist.

## Platform references

The implementation adapts the existing app's speech wrapper and ExplorerStore integration. It introduces no new learning capability or external runtime code/content.

- [Web Speech API specification](https://webaudio.github.io/web-speech-api/#tts-section): available voices, local-service metadata and utterance voice selection.
- [Apple: change the voice your Mac uses](https://support.apple.com/guide/mac-help/change-the-voice-your-mac-uses-to-speak-text-mchlp2290/mac).
- [Apple: hear iPhone screen text](https://support.apple.com/guide/iphone/hear-whats-on-the-screen-or-typed-iph96b214f0/ios).

Apple's OS speech settings documentation does not guarantee a particular downloaded voice will be browser-accessible. The in-app parent guide explains selecting, obtaining and previewing available local voices and gives a read-together option when none are available.
