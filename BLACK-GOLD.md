# Street Rhythm — Black Gold Edition (v0.9.0)

A full visual overhaul based on the supplied skull / Street Rhythm cover: blackened iron, antique gold, ivory lettering, oxblood graffiti, silver metal, vinyl and chains. The app/executable remains SPITFIRE so the icon, application identity, controller mappings, portable saves and local records stay compatible.

## Updated throughout

- **Title:** a new edge-to-edge 1600×900 composition carries the same skull/metallic-logo tone across a real widescreen alley. Both cans sway, both records counter-rotate, painted smoke follows the cans and two outer haze layers drift independently. The patched backing plate, fixed central foreground and baked prompt remain stationary. Reduced motion freezes all layers. See `TITLE-RIG.md`.
- **Main menu:** full cover on the left; six numbered modes on the right. Gold borders, ivory distressed lettering and a red selected-mode marker work with mouse, keyboard and controller. Layout remains a contained 16:9 scene.
- **Loading:** matching skull-and-alley composition, “Respect the Rhythm” lettering and a real brass/red progress bar. Readiness, caching, error blocking, Retry and Back are retained. The current manifest decodes 54 local images, two fonts and five rendered audio stems before play.
- **Stage:** a new gold-lit, smoky brick alley, skull mural, speakers and crown graffiti. Existing 19-piece / 21-node performers remain articulated; their sprites are warm-graded from the original illustration, not replaced with static posters.
- **Gameplay:** blackened highway, antique-gold rails, subdued crown inlay, amber/ember lighting and black/gold corner meters. Five distinct note colours and lane labels remain intact for readability. Spitfire uses amber instead of the old purple effects.
- **Supporting screens:** Career, Versus, Training, local Leaderboards, controller lab, Soundcheck, pause and results use the same metal/brass palette. Two-player score panels and both highways are themed too.

## Files and regeneration

- `app/black-gold.css`: shared UI palette and layout overrides.
- `app/renderer.js`: stage, highway and in-game lighting colours.
- `app/title-rig.js`, `title-rig-data.js`, `title-rig/`: widescreen title prop/atmosphere rig.
- `app/rig/`: graded transparent performer pieces; hierarchy remains in `puppets.js`.
- `artwork/black-gold-alley.webp`: generated environment source plate.
- `tools/build_black_gold.py`: composes title/menu/loading/stage plates and rebuilds/grades performer sprites from the retained original `app/stage.jpg`. Pillow required.

Normal development and EXE packaging use the included runtime images and do **not** need the original uploaded reference or an image-generation service. To regenerate compositions, supply the original cover PNG:

```sh
python tools/build_black_gold.py "/path/to/generated-image (3).png"
npm run assets
```

When no argument is supplied, the script checks the session's sibling `uploads/generated-image (3).png`. Keep that original input if you intend to reproduce the compositions later. `tools/build_rig.py` alone extracts the ungraded original performers; run the Black Gold tool afterwards to apply the current colour grade.

## Validation and limitations

Nine automated Chromium/Linux suites pass: gameplay, controllers, menu/responsiveness, all modes, performer rig, title input, title atmosphere, asset loading and Black Gold visual integration. `test-black-gold.cjs` checks the brand/selected colours, all four mode-card themes, controller routing, stage image, five distinct lane colours, articulated puppet readiness, Versus rendering and responsive menu bounds. Screenshots were visually reviewed for title, menu, gameplay, loading and Versus.

Game rules, charts, synthesized soundtrack, controller profiles and save formats are unchanged. This does not add recorded rap, new songs, new gameplay modes, online services, 3D characters or realistic smoke simulation. The portable EXE is unsigned. Actual Windows launch, USB behavior, physical controllers and hardware latency remain unverified in this Linux environment.

### Imported smoke update (v0.9.0)
The four moving painted-smoke overlays have been replaced by the user-supplied plume/puff flipbooks. Both preserve transparency and are preloaded locally. See `SMOKE-IMPORT.md` for playback, source credit and unverified reuse rights.

### v0.8.3 poster menu
The prior left-cover/right-panel menu is replaced by the supplied central-list Street Rhythm poster. The original letter shapes and rough white frame are now interactive assets. See `POSTER-MENU.md`. The title and imported smoke remain unchanged.

### Generated-plate storage
The optional original generated clean-fill/alley authoring plates are no longer duplicated in this constrained workspace. The title prop builder falls back to the bundled patched `app/title-rig/plate.webp`; the theme builder falls back to the bundled `app/stage-clean.jpg`. Run `npm run assets` first if their cache links need restoring. The exact current runtime art is retained inside the portable EXE; original user-uploaded references remain untouched.

### v0.9.0 Career identity
Career has a locally saved player-name card with eleven supplied pack backgrounds, a Western-style arched name and Career-only HUD/results display. See `CAREER-CARDS.md`.
