# Loading screen and readiness barrier — v0.9.0

The new skull-and-alley loading artwork appears before every gameplay session, including Quick Play, Career, Versus, Training and restarts. It remains a 16:9 scene, with a small live progress readout at the bottom. The artwork is bundled locally as `app/loading-screen.webp`.

## What actually loads

1. The loading artwork is decoded and given a browser paint opportunity.
2. The manifest's 54 image assets are loaded and decoded, including stage, title, menu, HUD textures and performer-rig pieces and title prop/atmosphere layers.
3. The embedded Block/Anton and PackLetter/StreetPack fonts are loaded through the Font Loading API and checked for readiness.
4. All five original audio stems are rendered into aligned AudioBuffers, or reused if already cached and valid.
5. Equal audio-buffer lengths, sufficient duration and rig-texture readiness are verified.
6. Chart and mixer state are prepared. The screen reaches Ready, then the shared audio start time is scheduled and gameplay begins.

No note judgments or live track playback begin before this barrier completes. AudioContext creation/resume is requested early to preserve trusted-input/browser autoplay behavior, but no song sources are scheduled until the assets are ready. Audio-device unlock and individual resource loads have timeouts.

The progress bar counts completed resource tasks, then completed audio stems; it is not a byte-download percentage. Cached replays can show the screen only briefly. There is no arbitrary multi-second delay just to display the artwork.

## Failure and recovery

A missing image, failed decode, unavailable font, invalid audio buffer set or audio-unlock failure keeps gameplay blocked and displays the reason with Retry and Back to Menu. Retry reruns the readiness checks. Back restores mode preferences and returns to the menu. Error messages are inserted as text, not HTML.

Decoded images and fonts are cached for the lifetime of the page. Failed image/font promises are removed so a recovered resource can be retried. Audio stems are cached after the full render completes; a partial/invalid set is not used. Progress updates from obsolete attempts are ignored.

## Implementation

- `app/loading.js`: progress, image/font decoding, caching, audio readiness, failure/retry/back behavior.
- `app/asset-manifest.js`: generated list of local images and font families.
- `tools/build-manifest.cjs`: scans image files and declared font faces to rebuild the manifest.
- `app/game.js`: session-start readiness barrier; optional per-stem callback from the original audio renderer.
- `app/index.html`: preloaded loading artwork, loading scene, accessible progress bar and error controls.
- `app/controller.js`: controller navigation for error recovery.

`npm start` and `npm run build:win` regenerate the manifest automatically. If serving the HTML version directly after adding assets, run:

```sh
npm run assets
python -m http.server 8080 --directory app
```

## Verification

`test-loading.cjs` deliberately holds an asset behind a test gate and verifies that gameplay and live song sources do not start. It then checks all decoded images, font readiness, five aligned stems, cached replay, a deliberately missing asset, Retry recovery and Back to Menu. The existing gameplay, menu, mode, controller, stage-rig and title-rig tests also pass.

```sh
node test-loading.cjs
```

Run against a server on port 8080. The tests use Chromium on Linux. The Windows portable EXE is cross-packaged and unsigned; actual Windows startup, physical controller behavior and hardware latency remain unverified here.
