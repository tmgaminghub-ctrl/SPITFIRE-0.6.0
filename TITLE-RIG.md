# Rigged widescreen title — v0.8.1

## Composition

The title is a true 1600×900 (16:9) landscape composition. The alley fills the entire frame rather than framing a square cover. Skull, chains, microphone and metallic Street Rhythm lettering stay in the centre, with the two spray cans and two records spread out on either side. The prompt is baked into the ground beneath the logo; no footer, visible button or controller UI is added.

Rendering uses a contained 16:9 scene. Non-16:9 windows get black letterboxing rather than stretching or cropping. The packaged window still starts at 1440×810.

## Rig

There are nine transparent drawable layers over a patched backing plate:

| Layer | Motion / ownership |
|---|---|
| canLeft / canRight | Separate bottom pivots; approximately ±0.69° sway and ±1.2 px vertical float over eight seconds, with a small phase offset |
| recordLeft / recordRight | Independent centre pivots; opposite rotation, one turn per 48 seconds |
| smokeLeft / smokeRight | Painted-smoke cutouts; translate, rotate and gently fade over twelve seconds; parented to their respective can transforms |
| hazeLeft / hazeRight | Independent outer-alley haze with twelve-second drift and opacity variation |
| foreground | Stationary skull / chains / logo occlusion layer; protects foreground edges from moving props and smoke |

The complete composite repeats after 48 seconds. Reduced motion zeros every rotation/translation and holds opacity fixed. The old title hand rig is not used.

The record rims originally hidden behind the logo are restored from symmetric intact grooves before rotation. This prevents fragments of the fixed gold lettering from spinning with the records. The clean generated plate is composited only under the expanded prop masks; the surrounding illustration is retained. The fixed foreground is restored over the moving layers. Motions stay small enough that the patched footprints cover the exposed space.

A complete static title image is shown as a fallback while rig textures decode, so the initial scene does not display empty prop holes. The animated canvas takes over only when all title layers and the patched plate are ready. The gameplay preloader also verifies those resources before starting a session.

## Editing and regeneration

- `app/title-rig.js`: authoritative pivots, parent hierarchy, layer ordering and motion curves.
- `app/title-rig-data.js`: authoritative 1600×900 coordinate system and sprite metadata.
- `app/title-rig/*.webp`: current transparent sprites and patched `plate.webp`.
- `app/title-screen.webp`: complete static title fallback with baked prompt.
- `artwork/title-wide-source.webp`: generated landscape composition, based on the supplied skull reference.
- `artwork/title-clean-fill.webp`: generated hole-fill plate; used only inside prop footprints.
- `tools/build_title_props.py`: editable silhouette polygons, occlusion mask, groove restoration, painted-smoke extraction and sprite export. Source masks are in 1376×768 coordinates and are resampled into the exact 1600×900 runtime scene.

With Python 3 and Pillow:

```sh
python tools/build_title_props.py
npm run assets
```

Normal builds do not require regeneration. `tools/build_black_gold.py` calls the new title builder at the end when its source plates are present, so regenerating the theme does not restore the old square title.

## Verification

`test-title-rig.cjs` checks exact 16:9 runtime/fallback dimensions; independent changed pixels for all eight animated layers; can-to-smoke parenting; opposite record rotation; stationary skull/logo/prompt; the complete 48-second cycle; static reduced motion; and letterboxing in a taller window.

The nine existing gameplay/controller/menu/mode/performer/title/loading/theme suites pass after this update. The portable archive's title layers, renderer, loading barrier, version and both custom icons are verified. Actual Windows launch and physical-controller testing remain unavailable in the Linux build environment.

`release/SPITFIRE-title-motion.mp4` is an eight-second capture of the actual title renderer, not the entire 48-second cycle. It is a preview only; the game renders the layers live.

## v0.8.2 smoke replacement
The cans, records, fixed foreground and layout are unchanged. The four smoke/haze layers now draw current/next frames from two imported transparent atlases, not single painted-smoke textures. Playback lasts four seconds per emission, with staggered phases, lifetime fades and existing can parenting. Reduced motion freezes a representative frame. The full title remains a 48-second cycle. See `SMOKE-IMPORT.md` for sources, rights and the tenth regression suite.

### Generated-plate storage
The optional original generated clean-fill/alley authoring plates are no longer duplicated in this constrained workspace. The title prop builder falls back to the bundled patched `app/title-rig/plate.webp`; the theme builder falls back to the bundled `app/stage-clean.jpg`. Run `npm run assets` first if their cache links need restoring. The exact current runtime art is retained inside the portable EXE; original user-uploaded references remain untouched.

The optional generated wide-title authoring source is also no longer duplicated locally. The title builder can use the complete bundled `app/title-screen.webp` fallback, preserving its baked prompt instead of adding it twice. Restore artwork with `npm run assets` first. Original user-uploaded references are not changed.
