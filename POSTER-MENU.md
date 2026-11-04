# Interactive Street Rhythm poster menu — v0.8.3

The supplied `generated-image (8).png` is now the main-menu artwork, contained in the existing 16:9 scene. The skull, metallic logo, vinyls, spray cans, gold paint, taped edges, brick wall and baked control legend are preserved.

## Live options

| Printed option | Existing feature |
|---|---|
| Career | Three-challenge local Career ladder |
| Quick Play | Current track and selected difficulty |
| Multiplayer | Local two-player Versus, not online play |
| Training | Cypher Training |
| Leaderboards | Local records on this computer |
| Options | Soundcheck/settings, with controller setup access |

The lettering is extracted from the original artwork rather than replaced with a new font. The original white rough-edged frame moves with the current selection. Inactive options use deep red, including Multiplayer (which is playable, not disabled). The baked Quick Play text/frame are removed from the central plate so there is no duplicate highlight when selecting another row.

Mouse hover/focus, keyboard Up/Down, controller D-pad/stick and existing confirm/back controls operate the live row buttons. Buttons have explicit accessible names and `aria-current` identifies the current selection. The green Continue and D-pad legends remain baked artwork hints; the six rows are the interactive controls. Enter/controller confirm activates the focused row.

Title art, can/record rigs, imported smoke, loading barrier, chart/audio timing, input profiles, saves and gameplay modes are unchanged.

## Files

- `app/main-menu.webp`: supplied poster with only central lettering/old highlight patched out.
- `app/menu-labels/*.webp`: six lossless transparent masks preserving original letter shapes/distress.
- `app/menu-highlight.webp`: extracted original rough white frame, with its inner lettering removed.
- `app/index.html`: six live rows and reference-matched names/accessibility labels.
- `app/black-gold.css`: poster alignment, glyph masks, red/white selection and moving frame.
- `app/modes.js`: existing routes and selection; also exposes `aria-current`.
- `tools/build_poster_menu.py`: deterministic extraction and localized inpainting. Requires Python, Pillow, NumPy and OpenCV; reads the untouched uploaded PNG. Included runtime files make regeneration unnecessary for normal builds.

Run `npm run assets` before local preview to restore cache-backed artwork, then serve `app` on port 8080. Packaging materializes assets automatically through `npm run build:win`.

## Validation

Eleven Chromium/Linux suites pass. `test-poster-menu.cjs` checks reference labels, six live rows, exactly one white selected row at four viewport sizes, red inactive Quick Play, `aria-current`, keyboard movement and Multiplayer/Training/Options routing. Existing synthetic-controller, gameplay, all-mode, rig, title, smoke and asset-loading tests also pass. The packaged poster, lettering, frame, CSS, routes, version and both custom icons are verified.

The portable EXE is unsigned. Actual Windows launch and physical-controller testing remain unverified here.
