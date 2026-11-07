# Six-room Career tour — v0.11.0

Career now has six actual illustrated stage backgrounds, three original fictional rappers and three original fictional producers. Each room assigns a lineup; this is not a new artist/venue selector in Quick Play. Other modes retain the original stage and cast.

| Challenge | Venue | Rapper | Producer | Clear requirement |
|---|---|---|---|---|
| Basement Proof | The Cinder Cellar | Nova Verse | Iris 808 | Easy, 65% weighted accuracy |
| Rooftop Cipher | Skyline Rooftop | Echo Kid | Dust Relay | Normal, 72% + 20 combo |
| Headline Moment | Ironworks Club | Brick Saint | Tape Theory | Hard, 80% + 35 combo |
| Platform Pressure | Platform Zero | Nova Verse | Tape Theory | Hard, 83% + 40 combo |
| Crown the Block | Crown Block Party | Brick Saint | Iris 808 | Hard, 87% + 50 combo |
| Black Gold Headliner | Black Gold Arena | Echo Kid | Dust Relay | Hard, 90% + 65 combo |

Clear the current challenge to unlock the next. Replay unlocked rooms for a better score. The old first three challenge names, difficulty rules and clear targets remain unchanged. The old three-entry local save migrates in memory to six entries without discarding clears/bests; new progress persists to the existing `spitfireCareerV1` key. Invalid/negative/non-finite bests are normalised to zero. The existing Career player-name/pack card and local leaderboard saves remain separate and unchanged.

## Original cast

- **Nova Verse:** burgundy jacket, braids and gold hoops; restrained pocket/head nod.
- **Echo Kid:** teal jacket and flat-brim cap; larger rhythmic gesture accents.
- **Brick Saint:** cream jacket, orange beanie and beard; heavier head/arm accents.
- **Iris 808:** violet jacket/bob, large glasses and headphones; precise pad accents.
- **Dust Relay:** olive hoodie and green headphones; looser alternating pad motion.
- **Tape Theory:** ochre hoodie, red cap and beard; steady pad groove.

These are fictional characters, not portraits, endorsements or voice clones of real artists. Each has a new illustrated head plus precoloured body/limb sprites; 54 sprite variants preserve the existing bone hierarchy and bind coordinates. The sampler remains the original prop. Movement differences use beat-synchronised pose-amplitude profiles, not new motion-captured choreography. Reduced motion keeps all accents still. The original illustrated puppet bodies are adapted from the existing user-supplied artwork; original-source rights caveats still apply.

## Presentation

The six-room board has venue thumbnails, lineup names and miniature head portraits. Hover portraits for short appearance/performance descriptions. On a standard 1440×810 window the compact identity editor and all six room cards plus Back fit together; smaller windows scroll. The full Career name editor and all eleven pack styles remain available.

During Career sessions the actual canvas stage changes to the assigned venue, both articulated performers use the assigned sprite set, and the billing strip shows venue/MC/producer. Billing hides during pause/loading and is credited again on results. Retry preserves the current show; Next Challenge advances through all six rooms rather than stopping at the old third-room finale. Quick Play/Versus/Training retain their original environment and sprites. No tracklist or Options routes are replaced.

## Audio scope

All six shows use the **existing original Midnight Circuit composition and Easy/Normal/Hard charts**. This update adds venues, visual characters, pose accents and Career challenges—not six new songs, artist-specific beats, recorded rap vocals or new voice performances. Producer identities are the visual performance lineup; the audio stems/mix are unchanged.

## Files and regeneration

- `app/career-world-data.js`: cast identities, sprite paths, venue/lineup registry.
- `app/venues/*.webp`: six new AI-generated ink/wash stage paintings, 1376×768.
- `app/cast/*.webp`: 54 illustrated/recoloured sprite variants.
- `app/career-world.js`: Career-only texture selection, pose styling, billing lifecycle, explicit selected-cast decoding and Retry recovery.
- `app/career-world.css`: compact board and stage/results credits.
- `tools/build_career_world.py`: regenerates cast art from the original rig sprites and converts optional `.cache/career-*.png` paintings. When source paintings are absent, the released WebPs are retained; they are the durable scenery assets. Restore/materialise source artwork with `node tools/restore-assets.cjs --materialize` first.

The real loading barrier includes all 116 image assets and three embedded font families. Selected Career stage/cast Image instances are explicitly decoded before play. A missing stage/sprite blocks loading; Retry refreshes failed shared Image instances rather than being stuck on an earlier failed request.

## Validation

All fifteen Chromium/Linux suites pass. `test-career-world.cjs` checks migration from an actual three-room save, six unique background pixel samples, three rapper/three producer rigs, invalid/locked jobs, failed challenge lock retention, clearing and persisting all six rooms, Next Challenge past the old finale, correct finale termination, actual selected textures, loading readiness, pause/reduced motion, venue/cast results credits, desktop board fit, Quick Play isolation, and failed-cast Retry recovery. The previous fourteen gameplay/controller/menu/loading/rig/Options/tracklist/Card suites also pass.

The actual portable archive is extracted and every bundled app file compared byte-for-byte to source; version and inner/outer custom icons are verified. This is not a native Windows execution test. Windows hardware, physical controllers and native rendering remain untested; the portable is unsigned.

### v0.11.1 art update
The three rapper heads are now AI-painted/shaded designs rather than the original procedural faces, and their existing body/limb cutouts have richer stage lighting. Producers remain procedural illustrated designs. General regeneration preserves painted rapper sprites; use the dedicated preparation tool/master portraits to rebuild them. See `PAINTED-RAPPERS.md`.
