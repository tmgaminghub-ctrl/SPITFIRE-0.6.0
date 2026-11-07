# Playable Tracklist — v0.10.0

Quick Play now opens the supplied studio-notebook artwork as a functional track-selection screen. The uploaded image is used directly (converted to a high-quality local WebP), without replacing its title, equipment, notebook, doodles or branding. Interactive controls sit on its blank ruled area; the whole composition remains 16:9 with letterboxing in other window shapes.

## Use

1. Main menu → Quick Play.
2. Select **01 — Midnight Circuit**, the existing original instrumental. Selecting it focuses Play Track; it does not automatically start audio.
3. Choose Easy, Normal or Hard. This is the existing shared Quick Play difficulty setting and saves through the original local-settings handler.
4. Choose **Play Track**. The existing loading screen waits for all artwork, fonts, puppet rigs and five synthesized audio stems before play begins.

The screen shows 96 BPM, 1:25 session length including intro/outro, five lanes, roll-assist/input rules and the existing best score for that difficulty/assist/input-rule combination. It does not fabricate extra songs. There is one playable track in this build; this is not an imported commercial song or a new recorded rap track. Original track generation, charts, scoring and stems are unchanged.

Mouse, Tab, Enter/Space, keyboard arrows and the existing controller navigation work. D-pad/stick Up/Down navigates; Left/Right adjusts a focused difficulty selector; Confirm selects/plays; Back returns to the main menu with Quick Play focused. Escape and the visible Back button also return. Standard/guitar profiles continue to use the existing mappings. Retry and Restart replay the current session directly, without forcing the user through the selector again.

Career, local Versus, Training, leaderboards, Career identity and the two-level Options pages retain their existing routes and session behaviour. The new screen registers with the shared mode-screen manager and controller navigation, so hidden menus cannot intercept its focus. Loading Back/Retry retains the established behaviour.

## Files and tests

- `app/tracklist.webp`: supplied notebook artwork, local and offline.
- `app/tracklist.css`: composition, ruled-page controls, active row, details and footer.
- `app/tracklist.js`: Quick Play route, one real track, shared difficulty/save binding, score display and real session start.
- `test-tracklist.cjs`: requires selection before gameplay, one real row, difficulty saving, best-score matching, keyboard/controller Back and confirmation, controller focus scoping, four viewport sizes, readiness gate, restart/replay and Career isolation.

All fourteen Chromium/Linux suites pass. Existing gameplay suites were updated to click Play Track after opening Quick Play; their gameplay/loading/scoring assertions are retained. The readiness manifest contains 56 images and two embedded font families. Native Windows execution and physical controllers remain untested; the Windows portable is unsigned.

## Windows runtime packaging

The portable keeps the normal 2D game runtime, Direct3D 11 shader compiler, Vulkan/SwiftShader fallbacks, codecs, ICU and Chromium licence notices. It omits the optional large `dxcompiler.dll` D3D12/WebGPU compiler and disables WebGPU: this game uses Canvas2D and Web Audio, not WebGPU. This reduces the portable footprint without downscaling the supplied artwork. Native Windows rendering still requires validation on Windows hardware.

## Rights

The user-supplied photograph/artwork includes third-party equipment branding. No affiliation, endorsement or redistribution/commercial licence is asserted. The project code licence does not grant rights to the supplied image or third-party trademarks; verify permissions before public/commercial distribution. The original user upload is retained unchanged.

## v0.10.1 — zoomed paper setlist and scrolling

The supplied notebook is framed 1.34× closer; the artwork is not regenerated or replaced. Songs are plain marker-style ink on the lined page rather than boxed cards. The tier heading is red; the selected song is blue/underlined; inactive future rows use dark ink. Permanent Marker by Font Diner is embedded unmodified with its Apache 2.0 licence. The new InkMarker face is included in the real asset-readiness barrier (56 images, three font families).

`#tracklistSongs` is a vertically scrollable region with wheel/touchpad support, keyboard region focus and a themed scrollbar only when needed. The existing controller focus navigation scrolls focused song buttons into view. Difficulty, current-rule score and Play/Back remain outside the scrolling rows. No fake songs or empty placeholder rows are shipped: Midnight Circuit is still the only playable song. Future real songs can use the same row container, but must also have real chart/audio and selection/play wiring; merely adding a displayed title does not add playable music.

The tracklist suite injects 32 temporary layout-only rows into its isolated browser to verify overflow, visibility at the bottom, mouse-wheel scrolling and unchanged Play-button position, then removes them before testing real playback. These fixtures are not part of the game or release image. All fourteen suites pass again, including saved difficulty, local bests, actual loading/play, replay and mode isolation. The clean-install lockfile dependency range for the build tool's `temp` package is corrected; release version updates now target only root package metadata.
