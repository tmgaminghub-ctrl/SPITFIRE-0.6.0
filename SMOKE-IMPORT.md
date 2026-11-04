# Imported smoke flipbooks — v0.8.2

Both user-supplied sheets are used in the animated title, without changing the can/record rigs, title composition, controls or gameplay.

## Imported assets

- **Colored Smoke Effect — Hello Kitty and Friends Happiness Parade:** 64 row-major frames from an 8×8 grid of 256-pixel source cells. Used for the two can-adjacent rising plumes.
- **Smoke Particles — Showdown Bandit:** 25 row-major frames from five columns/five rows of 422-pixel source cells; empty right/bottom sheet margins are excluded. Used for the two outer drifting puffs/haze emitters.

The source PNGs already contain transparent alpha. Their black appearance in some image viewers is the preview background, not a black matte to erase. The importer retains the original alpha and colours rather than using a destructive black-colour key. Cells are resampled to 192 pixels and stored as two local WebP atlases. Runtime atlases are in `app/smoke/`, with provenance in `sources.json` and `app/THIRD-PARTY-NOTICES.txt`.

## Playback

Each flipbook lasts four seconds. Current/next frames are crossfaded based on elapsed time, not frame count, so display refresh rate does not change the smoke speed. Emitters have different phase offsets, a short fade-in/fade-out envelope and gentle existing rig motion. Puffs expand and rise slightly. Plumes inherit the corresponding spray can transform. The central foreground and baked prompt remain fixed.

Reduced motion selects a stable representative frame and freezes all transforms and opacity changes. The complete title still repeats after 48 seconds, including the cans and counter-rotating records. Original painted atmospheric smoke remains part of the backing illustration; the previous four moving painted-smoke overlays have been replaced by these imported flipbooks.

Both atlases are in the real gameplay preload manifest. Both instances of an atlas share the same Image object, so Retry recovers both emitters after a failed download/decode. No external hotlinks are used at runtime.

## Regeneration and editing

```sh
python tools/import_smoke.py
npm run assets
node test-smoke.cjs
```

The importer reads the original PNGs from the sibling `uploads` directory. `tools/build_title_props.py` reapplies the import after rebuilding the title when those source files are present. `app/title-rig-data.js` contains frame metadata, bounds, phases and image references. `app/title-rig.js` contains the crossfade, envelope and drawing routines.

`test-smoke.cjs` checks frame counts, atlas dimensions, transparent corners, valid frame indices/crossfade weights, different emitter phases, shared image references, actual frame playback, static reduced motion, cycle continuity, preloader inclusion and a deliberately missing atlas followed by successful Retry. All ten Chromium/Linux suites pass, including title-rig, gameplay, controllers, modes and loading tests. Windows launch and physical devices remain unverified.

## Rights and credits

Showdown Bandit sheet: https://www.spriters-resource.com/pc_computer/showdownbandit/asset/185916/ — uploaded by Models124717. The second sheet's title/game are identified from the user-provided filename; no original asset-page URL/uploader was supplied.

These are third-party game assets. They are **not** original SPITFIRE artwork and **not** covered by the project's ISC code licence. No reuse, redistribution or commercial-use licence has been verified. Obtain appropriate permission before public/commercial distribution or replace the atlases with licensed/original smoke. The full notice is bundled inside the app and copied beside the release.
