# Comic-book producer remake — v0.11.3

**Current wardrobe:** v0.11.4 replaces the outfits below with ’90s streetwear on all six artists; see `90S-STREETWEAR.md`. Earlier preservation claims describe their original release only.
Iris 808, Dust Relay and Tape Theory now have complete new shaded comic-book bodies matching the Career rappers. Bold ink contours, painted cel shadows and cool stage highlights replace the old procedural heads and shared recoloured bodies.

- **Iris 808:** violet bob, clear glasses, purple studio headphones, cropped violet utility jacket, wide black cargo trousers and platform sneakers.
- **Dust Relay:** tall lean build, short curls, green headphones around his neck, olive hoodie, dark tapered jeans and chunky olive sneakers.
- **Tape Theory:** broad heavyset build, full beard, backward red cap and red headphones, ochre workwear hoodie, relaxed dark trousers and red/cream high-tops.

Each has nine independently illustrated parts and ten individually placed joints. The arms inherit shoulder/elbow motion; beat-synchronised pad gestures, both input-hand accents, head nods, reduced motion and F2 rig view still work. These remain articulated 2D cutouts, not mesh or frame-by-frame animation.

## Career equipment and preservation

The Career sampler is a new matching comic prop on a clean X-stand. Unlike the old sampled stage cutout, it contains no baked-in hands, clothing or legs that could ghost behind the new bodies. Its deck is positioned under their finger-drumming hands. Both performer rigs route their own geometry simultaneously.

The three rapper designs and all 27 rapper runtime sprites are unchanged from v0.11.2. The six venues, Career lineups/unlocks, song, saves, name cards and controls are unchanged. Quick Play and other non-Career modes still use the original producer, rapper and sampler. Ninety-one unrelated binary assets were verified unchanged. No songs, recorded voices or producer-specific audio were added.

## Sources and rebuild

- `artwork/comic-producers/{iris,dust,tape}.webp`: durable transparent full-body authoring references.
- `tools/fullbody-producers.json`: separate body proportions, part masks, pivots and stage placements.
- `tools/prepare_fullbody_rappers.py --config tools/fullbody-producers.json --masters artwork/comic-producers`: builds the producer cutouts and metadata. Pillow, NumPy and SciPy required.
- `app/cast/{id}-producer_*.webp`: 27 new runtime parts.
- `app/cast/comic-sampler.webp`: clean equipment prop, recoverable from the portable using the runtime-asset manifest.
- `app/career-world-data.js`: custom bones, part rectangles and equipment placement.

First run `node tools/restore-assets.cjs --materialize`, then the Python rebuild command above and `node tools/build-manifest.cjs`. Optional `--sources DIRECTORY` imports the green-matte PNGs named in the configuration. Compact authoring references may be optimized after release; the shipped sprite binaries in the verified portable are authoritative. The general Career builder preserves all six comic rigs and metadata rather than overwriting them with procedural art.

## Validation

All seventeen Chromium/Linux suites passed. The new producer suite checks all 27 parts for transparency/green matte, unique body geometry, both artist rigs together, correct equipment routing, actual animated canvas renders, both input-hand accents, frozen reduced motion, debug overlay, original non-Career rigs/equipment and new-prop load-error/retry recovery.

The actual Windows portable was extracted and all 153 bundled app files compared byte-for-byte to source. Package version and seven-resolution custom icon resources on both executable files were verified. Preloading covers 117 images and three font families.

Windows execution, native GPU rendering and physical controllers remain untested in this Linux environment. The portable is unsigned. Fictional characters are AI-generated; no real artist likeness, endorsement or voice clone is claimed. Existing user-supplied artwork and smoke reuse caveats remain; see THIRD-PARTY-NOTICES.txt. No commercial redistribution permission is asserted for supplied material.
