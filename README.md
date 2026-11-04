# SPITFIRE — Street Rhythm / Black Gold v0.9.0

A Windows x64 portable rhythm-game vertical slice. Built with Canvas 2D, Web Audio and an Electron desktop shell. All assets are bundled; no internet connection, account, or installer is required to play.

## Current visual edition

The title, six-mode menu, loading artwork, alley stage, articulated performers, highway, HUD and supporting panels now follow the supplied skull-and-gold Street Rhythm cover. Read `BLACK-GOLD.md` for the current art system and `LOADING.md` for asset readiness. All existing gameplay, control profiles and local saves remain compatible.

## Play on Windows

1. Download `SPITFIRE-0.9.0-Windows-x64.exe` to a writable folder on a Windows 10/11 x64 computer.
2. Launch it, press any button on the title, then select a mode. This is a self-extracting portable app; first launch may take a moment while its runtime extracts to a temporary directory.
3. Open **Soundcheck** to choose Easy, Normal or Hard, volume, input offset, reduced motion, or roll assist.
4. Select **Quick Play** (or Career, Versus Battle or Cypher Training). The first session renders the five original synthesized stems into memory before playback.
5. Play D / F / J / K / L. Press Space when Spitfire charge reaches half. Escape pauses. F11 toggles fullscreen.

The executable is unsigned and may trigger Windows reputation warnings. Verify the origin and checksum before running; do not disable antivirus protections. This Linux build environment cannot verify actual Windows execution.

### Portable saves

On writable media the desktop shell stores settings and local records in `SPITFIRE-data` beside the executable. Move that folder with the EXE to retain records. If the location is read-only, the app falls back to Electron's normal per-user application-data location. Electron may also use ordinary OS temporary/cache files.

## What's implemented

- Five descending lanes with labels and colors; audio-clock-based positions and judgments.
- Single taps, sustained holds with tick points and early-release penalties, rapid-tap passages.
- Perfect / Great / Good / Miss judgments (35 / 70 / 110 ms windows).
- Score, combo, max combo, crowd Hype, x1–x4 combo multiplier.
- Glowing phrases award 25% Spitfire charge when at least 90% of notes are hit and no hold breaks. Space spends 50% for eight 4/4 bars, doubling the current multiplier.
- Five sample-aligned synth stems. Misses duck the corresponding stem, followed by an automatic gain recovery.
- Original 96 BPM, approximately 85-second session with bass drums, snares, hats, sample-like chords and voice-like synth gestures.
- Illustrated underground stage, articulated 2D puppet performers, animated lighting overlays, crowd silhouettes and a perspective gem-note highway.
- Menu, settings, pause/resume/restart, results and local best scores.
- Three difficulties, offset adjustment, reduced motion and optional assisted rolls.

This is not recorded rap or a finished commercial game. The flow lane is a synth stand-in awaiting licensed/original vocal recordings. The stage uses AI-generated illustrated artwork and custom 2D cutout rigs, not rigged 3D characters. Fixed keyboard keys, a single song and a fixed stage camera remain first-slice limits. Gamepad and guitar inputs are remappable in v0.4. Career challenges, local two-player Versus, lane-focused Training and local leaderboards are included in v0.7. A chart editor and online leaderboard are not included.

## Build step by step

### Step 1 — Install tools

Install Node.js 22.12+ (Node 22 LTS recommended) and npm. Open the `spitfire` project folder in a writable development directory.

### Step 2 — Install dependencies

```sh
npm ci
```

The package lock pins dependencies. Development tooling includes Electron, electron-builder and Playwright. There are no production npm dependencies inside the renderer.

### Step 3 — Run the desktop development build

```sh
npm start
```

### Step 4 — Run the browser version

```sh
python -m http.server 8080 --directory app
```

Open http://localhost:8080. Use a local server rather than double-clicking HTML for consistent settings storage.

### Step 5 — Test

With the server running:

```sh
npx playwright install chromium
# Linux only, if shared libraries are missing:
npx playwright install-deps chromium
node test.cjs
```

The smoke test checks original-stem rendering, equal stem lengths, chart loading, a perfect tap, a hold break, Spitfire activation, a frozen pause clock, results and restart. Its screenshot is written to the directory selected by `SPITFIRE_TEST_OUTPUT`, or `test-output` by default.

### Step 6 — Package Windows x64 portable EXE

On Windows PowerShell:

```powershell
$env:ELECTRON_BUILDER_COMPRESSION_LEVEL = '6'
npm run build:win
```

On Linux/macOS:

```sh
ELECTRON_BUILDER_COMPRESSION_LEVEL=6 npm run build:win
```

The EXE is created in `../release`. Compression level 6 avoids the large memory allocation made by the builder's default 7-Zip level. Packaging downloads the Windows Electron runtime and NSIS tooling; this step needs internet. The produced game does not.

## Code map

- `app/main.cjs` — desktop window, sandbox/security boundaries, portable save path.
- `app/index.html` — screens and styling; no CDN or remote fonts.
- `app/game.js` — original arrangement, procedural audio rendering, chart generation, scoring, timing and mixer.
- `app/renderer.js` — perspective projection, metallic rails, domed note gems, lighting and stage effects.
- `app/stage.jpg` — original AI-generated hip-hop stage artwork.
- `app/puppets.js`, `app/rig-data.js`, `app/rig/` — articulated character cutouts, joints and pose controller.
- `app/stage-clean.jpg` — empty stage plate behind animated characters.
- `RIGGING.md` — rig editing instructions and technical limits.
- `test.cjs` — browser smoke checks.
- `package.json` — desktop entry and portable packaging settings.

### Timing model

All sources start at one `AudioContext` timestamp. Song time is `audio.currentTime - startAt`, never accumulated frame deltas. Input judgment subtracts the user offset. Note positions derive from song time. Pausing suspends the same audio context, freezing the clock and all stems together. This first build timestamps input at callback execution; timestamp-to-audio-clock mapping is a future latency improvement.

### Chart / audio authoring

`events()` defines the full arrangement in beats. `buildChart()` selects playable events for each difficulty without changing the backing arrangement. Each event has lane, song timestamp, tap/hold type, duration and optional roll flag. Special phrases occupy alternating sixteen-beat sections. `synth()` renders each lane to a separate OfflineAudioContext buffer of identical length. Replace those buffers with aligned licensed stems when adding real tracks.

## Next development steps

1. Test the EXE on actual Windows hardware; measure timing with wired and Bluetooth audio.
2. Replace the flow synth with an original artist session and aligned recording stems.
3. Expand controller hardware testing, add keyboard remapping and test keyboard rollover.
4. Split renderer, chart, transport and score logic into modules before increasing content.
5. Add a chart-file schema, validator and waveform editor.
6. Add a proper avatar rig, more stage art and musical-boundary camera cuts outside the fixed highway.
7. Add automated long-song simulations, high-DPI/device testing and signed release builds.

## Verification boundaries

Browser smoke tests run against Chromium on Linux. Successful NSIS packaging confirms an EXE was generated, not that it has run on Windows. Audio quality, perceived latency, SmartScreen behavior, actual Windows startup and USB save behavior still require human Windows testing. This is a playable early vertical slice, not a production release.

## Release history

The following entries describe earlier releases; their artwork and title rigs have been superseded by v0.8.0.

## v0.2 Stage Edition changes

- Replaced the flat DAW highway with a receding perspective board and dimensional metallic rails.
- Replaced rectangular notes with raised, elliptical gem notes and matching pad receptors.
- Added large illustrated performers flanking the highway, with cyan beams and a central DJ.
- Moved score, combo and Hype into angled hardware-inspired panels in the lower corners.
- Kept hip-hop instruments, original synthesized music and all core scoring/timing mechanics.
- Gameplay camera remains fixed for readability. In v0.2 the characters were part of the illustration; v0.3 replaces the foreground performers with rigs.

## v0.3 Puppet Edition changes

Two foreground characters are now custom articulated 2D cutout puppets: 21 hierarchy nodes, 19 transparent artwork pieces, beat-synchronized posing, input accents and Hype/Spitfire amplitude scaling. Press F2 to inspect the bones. Reduced motion disables joint animation. See `RIGGING.md` for editing and limitations. The distant DJ is not rigged, and there is no facial animation or lip sync yet.

## v0.4.0 icon update

Custom flame/waveform icon added in seven Windows sizes (16–256 px), embedded in both the portable launcher and internal game EXE. The window and browser favicon also use the same mark. Editable SVG, 1024 px PNG and multi-resolution ICO are in `app/`. `tools/set-icon.cjs` embeds the game EXE resources during packaging without requiring Wine. The release remains unsigned.

## v0.4 Controller Edition changes

Standard gamepad and configurable five-fret guitar profiles, optional strum-to-hit, button/signed-axis remapping, saved bindings, device selection, live input monitor, controller menu navigation, on-highway button labels and disconnect-to-pause. Keyboard and controller hold ownership are independent. See `CONTROLLERS.md` for defaults, adapter limitations and testing boundaries. Run `node test-controller.cjs` for synthetic input tests. Actual physical controllers remain unverified.

## v0.4.1 — Street Rhythm title screen

The user-supplied `street_rhythm_clean_exact.png` is included byte-for-byte as `app/title-screen.png`. The complete artwork is displayed with `object-fit: contain` above a gold-and-black footer with Play Session, Soundcheck and Controllers. No text or controls cover the poster. The SPITFIRE executable identity, save locations, icon and gameplay remain unchanged. Title layout was checked at 1440x940, 1280x720 and 1000x720; gameplay, rig and synthetic-controller tests passed. Windows launch remains unverified.

## v0.5 — Mic Hero main menu

Startup now shows the Street Rhythm opening title. Press Enter, click Enter the Block, or confirm with the controller to enter the separate Mic Hero main menu. The new user-supplied portrait artwork is displayed uncropped, with Play Session, Soundcheck, Controllers and Title Screen buttons inside the open parchment column. Escape or controller Back returns from the main menu to the title.

`app/main-menu.webp` is a lossless conversion of the uploaded `Code generated image.png`; decoded RGB pixels were verified identical. `app/menus.js` owns title/main-menu transitions. `test-menu.cjs` checks the flow and central button bounds at 1440x940, 1280x720 and 1000x720. Gameplay, rig and synthetic controller tests passed. Windows launch and physical-controller testing remain unverified.

## v0.5.1 — Press any button

The supplied `Code generated image (1).png` is included unchanged as `app/press-any-button.png` and replaces the old title-screen entry button text. Press a normal keyboard key, any exposed controller button, or click the title screen to enter the main menu. Modifier-only keys, browser shortcuts and F11/Tab retain their normal behavior. Held controller buttons are gated so the start input does not also launch a session or immediately leave the menu. Returning to the title with a controller requires release before another button can advance it. `test-title.cjs` covers keyboard, click, controller and held-input behavior.

## v0.5.2 — Reference-matched clean title

The latest user-supplied `generated-image (1).png` is now the title background. Its distressed Press Any Button prompt and small-print artwork are part of the image, not an additional UI layer. `app/title-screen.webp` is a lossless conversion with decoded RGBA pixels verified identical to the supplied reference. The old footer, entry-button styling, controller status, version label and control hints are absent on the title screen. A visually transparent full-screen button retains keyboard/click accessibility without drawing UI. Main-menu, gameplay and controller screens remain unchanged.

Any-key, controller-button, click, held-input gating, menu transitions, rig and rhythm-game tests passed. The portable Windows EXE packaged successfully; actual Windows startup and hardware testing remain unverified.

## v0.6 — Rigged title hands

The title now uses a six-piece custom cutout rig: two forearms, two hand/chain groups, microphone and microphone cable. Hands inherit small forearm rotations, and the mic follows the left wrist. An eight-second idle loop uses subtle sub-degree rotations. Reduced motion holds the bind pose. The central logo, prompt and small print remain fixed; the clean backing plate uses generated texture only beneath the hand silhouettes. No UI overlays were added.

`app/title-rig.js` contains editable pivots and animation amplitudes; `app/title-rig/` contains transparent WebP artwork; `app/title-rig-data.js` contains sprite positions. `tools/build_title_rig.py` can regenerate the cutouts from an original title reference and a supplied clean background plate. Generated runtime assets are included, so normal builds do not require either external input. `test-title-rig.cjs` verifies both hands move, central pixels remain stationary, hierarchy is valid, the loop repeats, and reduced motion is static. Existing title/menu/gameplay/controller/performer-rig tests also pass. Actual Windows startup remains unverified.

## v0.7 — 16:9 menu and playable modes

The new Mic Hero menu artwork is recomposed for 16:9. A gold/black distressed strip and cream lettering highlight the selected mode using mouse, keyboard or controller. Embedded Anton type and a local grit mask keep the menu self-contained. The initial Windows content area is 1440x810.

All six menu rows now work: Career (three saved chart challenges), Quick Play, simultaneous local two-player Versus Battle (two highways and independent scoring/Spitfire), Cypher Training (lane focus and timing report), local Leaderboards, and Settings. Career uses the existing track at three difficulty levels, not new songs. Versus accepts two separate exposed controllers, a shared keyboard, or a mixed keyboard/controller setup. Both pads use the current controller mapping profile. P1 keyboard is A/S/D/F/G with Space; P2 is H/J/K/L/; with Enter.

See `MODES.md` for goals, setup, fairness rules, storage and limitations. `app/modes.js` owns mode setup/progression/records; `app/battle.js` owns the second engine and input routing. Run `node test-menu.cjs` and `node test-modes.cjs` alongside existing tests. Automated checks pass; physical two-controller play and Windows startup remain unverified.

## v0.7.1 — Loading artwork and real asset preloading

The supplied DJ/MC illustration now appears before gameplay. The session waits for all 35 bundled image assets, the embedded font and five aligned audio stems before scheduling playback or accepting note judgments. A live task/stem progress bar reports readiness. Replays reuse cached resources. Missing or invalid resources block gameplay and expose Retry/Back recovery rather than starting with broken art or audio. The asset manifest regenerates automatically for npm development and Windows packaging. See `LOADING.md` and `test-loading.cjs`. Existing mode/controller/rig/gameplay checks also pass. Actual Windows startup remains unverified.

## v0.8.0 — Black Gold visual overhaul

Full reference-led restyle: supplied skull cover, gold-lit alley stage, warm-graded articulated performers, blackened highway/gold rails/crown inlay, ivory distressed mode labels, oxblood selection markers, gold/red loading bar and consistent supporting panels. The new title uses subtle side smoke instead of the old hand cutouts; the cover, logo and baked prompt stay stationary. All modes, controller support, soundtrack, timing and save formats are preserved. Nine suites pass, including `test-black-gold.cjs`. Current loading manifest: 31 images, one font, five stems. Windows and physical hardware testing remain outstanding. See `BLACK-GOLD.md`.

## v0.8.1 — Widescreen title and prop rigs

The title is now a genuine edge-to-edge 1600×900 composition, not a square cover on a wide matte. Both gold spray cans are separate pivoted cutouts with subtle sway; both restored vinyl discs spin in opposite directions once per 48 seconds. Painted smoke follows the can transforms, with two additional drifting side-haze layers. A patched backing plate and static foreground preserve the skull, chains, logo and baked start prompt. Reduced motion freezes every layer. All nine suites pass; the title suite explicitly checks each animated layer, exact 16:9 dimensions, fixed foreground, hierarchy, the complete 48-second loop and letterboxing. See `TITLE-RIG.md`.

## v0.8.2 — Imported smoke sheets

The user-provided 64-frame plume and 25-frame puff sheets now animate the title smoke. Local transparent WebP atlases crossfade on a shared time clock, with staggered phases and smooth lifetime envelopes. Can parenting, record spin, fixed logo/prompt and reduced motion are preserved. Both atlases participate in real preloading and Retry. All ten suites pass. Read `SMOKE-IMPORT.md` and `app/THIRD-PARTY-NOTICES.txt` before redistribution: third-party asset reuse rights have not been verified.

### Workspace artwork storage

To avoid duplicating the large portable release and its artwork in this constrained workspace, binary runtime images/fonts are also durably stored inside the portable EXE. The editable code, original uploaded inputs, generation tools and image metadata remain in the project. `npm run assets` restores missing artwork into a disposable cache and links it into `app/` for local preview; `npm run build:win` materializes real files before packaging. Keep the current EXE in the sibling `release` folder. Use `node tools/restore-assets.cjs --materialize` for a self-contained source tree, or `--compact` after packaging to return unchanged assets to cache-backed storage. Checksums protect every restored image; edited regular files are never overwritten or compacted. This storage mechanism is for the source workspace only—the downloaded EXE always contains its full offline artwork.

## v0.8.3 — Interactive supplied poster menu

The new Street Rhythm poster is the main-menu background. Its original distressed label silhouettes and rough white Quick Play frame are extracted into local masks/assets. Baked labels/highlight are removed only from the central selection area; six live hit targets recreate the labels, with one white selection frame and deep-red inactive lettering. Multiplayer opens existing local two-player Versus, Training opens Cypher Training, and Options opens Settings. Career, Quick Play and local Leaderboards retain their existing routes. The skull, lettering logo, records, spray cans, tape, bricks and baked control legend are preserved. Mouse, keyboard and controller navigation and responsive contained 16:9 layout work. Title rigs and imported smoke are unchanged. Eleven suites pass. See `POSTER-MENU.md`.

### Generated-plate storage
The optional original generated clean-fill/alley authoring plates are no longer duplicated in this constrained workspace. The title prop builder falls back to the bundled patched `app/title-rig/plate.webp`; the theme builder falls back to the bundled `app/stage-clean.jpg`. Run `npm run assets` first if their cache links need restoring. The exact current runtime art is retained inside the portable EXE; original user-uploaded references remain untouched.

## v0.9.0 — Personalised Career pack cards

Career now includes a locally saved player name and eleven selectable backgrounds cropped from the supplied pack contact image. The old brand header is replaced by vector-sharp arched/outlined Western-style lettering. All thumbnails preview the name; the selected card appears during Career play and on its results. New Career records use that name. Gameplay, controls and other modes stay unchanged. The bundled OFL font is a renamed/converted Rye derivative, not the exact Backwoods font. All 54 images and two font families are preloaded before play. Twelve suites pass. See `CAREER-CARDS.md`, including source quality, name entry and third-party rights notes.

The optional generated wide-title authoring source is also no longer duplicated locally. The title builder can use the complete bundled `app/title-screen.webp` fallback, preserving its baked prompt instead of adding it twice. Restore artwork with `npm run assets` first. Original user-uploaded references are not changed.

Before editing/regenerating binary artwork or fonts, run `node tools/restore-assets.cjs --materialize` so edits affect regular source files rather than disposable cache targets. After building and verifying a new release, `--compact` can safely cache unchanged files matching the release manifest.
