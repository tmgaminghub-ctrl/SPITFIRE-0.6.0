# Career player cards — v0.9.0

## Use

Open Career, type your player name and choose one of the eleven pack backgrounds. Name and background changes save automatically on this computer. The personalised card appears in the Career editor, during Career gameplay and on Career results. New Career leaderboard entries use that name. Quick Play, Versus and Training do not show the Career card.

The original Backwoods header area is cleared from each supplied pack crop and replaced by arched, outlined, vector-rendered player lettering. Other supplied pack imagery is retained. Thumbnails preview the same player name across every background. One gold border/check marks the selected background.

Names support up to 16 characters. Empty/invalid saved names fall back to PLAYER ONE. Names are inserted as SVG text nodes, never HTML. Long names shrink to fit the curved nameplate. Background IDs are checked against the eleven local styles; invalid saved selections fall back to the first style. This is one local player identity, not multiple independent Career save slots or an online account.

## Controls

- Keyboard: edit the name, use Tab to reach the background buttons, Left/Right to cycle/select, Enter/Space to activate a focused button.
- Controller: existing D-pad/stick navigation reaches the picker; confirm selects a background. Name entry requires a keyboard; there is no new on-screen keyboard.
- Mouse: click a background thumbnail. Changes save immediately.

The gameplay card sits above the left score meter, outside the highway. It hides while paused, loading or leaving a session. The results card is separate from the live HUD. Retry/next Career challenges retain the current identity. Career progress, difficulty rules and score calculations are unchanged.

## Typeface and source quality

The name uses an arched, outlined **Western-style approximation**, not the exact proprietary Backwoods logotype/font. The starting typeface is Rye from Google Fonts/Sorkin Type Co. It is converted to WOFF2 and renamed **StreetPack** to respect the original Reserved Font Name. All original glyphs and OFL/copyright notices are preserved. The CSS family alias is PackLetter. See `app/fonts/Rye-OFL.txt` and `app/THIRD-PARTY-NOTICES.txt`.

An exact Backwoods font match would require a suitable licensed font file. The uploaded contact image is only 535×535; individual packs are approximately 84×155 pixels. Pack imagery therefore remains low-resolution when enlarged, while the custom name lettering stays vector-sharp.

## Implementation

- `app/career-card.js`: validated local profile, editor/picker, live name thumbnails, SVG text paths and Career lifecycle integration.
- `app/career-card-data.js`: eleven allowed backgrounds and local file paths.
- `app/career-card.css`: editor, selection, in-game corner card and results placement.
- `app/career-cards/*.webp`: eleven crops with old brand headers removed.
- `tools/build_career_cards.py`: regenerates crops from the untouched user-supplied `uploads/backwoods-cigars.jpg` (Python + Pillow).
- Local profile key: `spitfireCareerPlayerV1`.

All eleven images and the name font are included in the actual session-readiness barrier (54 images, two embedded font families). The app runs offline. Binary artwork/fonts may be cache-backed in the source workspace; `npm run assets` restores them from the current portable EXE, and packaging materializes them through `npm run build:win`.

## Validation

All twelve Chromium/Linux suites pass, including `test-career-card.cjs`. The new suite checks all eleven styles, single selection, live previews, local reload persistence, keyboard/controller picker use, literal SVG text rather than markup injection, long/empty names, responsive bounds, loaded font/images, gameplay/pause/results visibility, named Career records, Quick Play isolation and invalid saved-style recovery. Windows execution and physical controllers remain unverified.

## Rights

The supplied pack imagery and trademarks remain third-party property. No affiliation, endorsement, product sale, redistribution licence or commercial-use permission is asserted. Permission should be checked before public/commercial distribution. The project code licence does not cover third-party pack artwork. Original supplied warning/flavour imagery remains part of the crop; the new lettering is only a game player-name customisation.
