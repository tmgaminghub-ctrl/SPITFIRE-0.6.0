# Full-body comic rappers — v0.11.2

**Current wardrobe:** v0.11.4 replaces the outfits below with ’90s streetwear on all six artists; see `90S-STREETWEAR.md`. Earlier preservation claims describe their original release only.
**Current v0.11.3 addition:** producers have also been remade. Producer-preservation statements below describe the v0.11.2 rapper release only. See `COMIC-PRODUCERS.md` for the current matching cast and clean equipment.

All three Career rappers have been rebuilt as complete, distinct shaded comic-book characters. This supersedes the v0.11.1 head-only refresh: none uses the old rapper body, clothing recolours, shared bind dimensions or shared joint placement.

- **Nova Verse:** athletic woman, braids and hoops, cropped burgundy bomber, charcoal cargo trousers and burgundy high-top sneakers.
- **Echo Kid:** lean man, cream/teal cap, oversized teal baseball jersey over a long white shirt, sling bag, black joggers and teal high-tops.
- **Brick Saint:** broad, stocky man, orange beanie and beard, cream varsity jacket with dark sleeves, black jeans and heavy tan work boots.

Bold outlines, painted cel shadows and teal/violet stage highlights unify the cast. Each has nine independently cut illustrated sprites, ten individual bind-space joints, parent-inherited 2D puppet motion and its existing beat-synchronised accents. Reduced motion still freezes articulation. These are cutout rigs, not frame-by-frame or skeletal-mesh animation.

## Integration and preservation

Career swaps textures **and** per-person `rigParts`/`bones`. The recursive renderer and F2 joint overlay use the selected rig; Quick Play and all non-Career modes retain the original default metadata and artwork. Career card portraits use the new illustrated heads.

The six venues, three producers, Career lineups/unlocks, original track, player cards, controls and save keys are unchanged. No new audio, voice clones or songs were added. Ninety-one unrelated bundled binary assets were hash-checked against v0.11.1, including original rigs, producer sprites, venues, UI art and fonts.

## Regeneration

- `artwork/comic-rappers/{nova,echo,brick}.webp`: durable transparent full-body authoring masters.
- `tools/fullbody-rappers.json`: independent source-space cut regions, proportions, world placement and pivots for each artist.
- `tools/prepare_fullbody_rappers.py`: chroma-matte import, cutout partition, small joint overlaps using nearest interior colours, sprite encoding and metadata generation. Requires Pillow, NumPy and SciPy.
- `app/cast/{id}-rapper_*.webp`: 27 runtime sprite files.
- `app/career-world-data.js`: per-person sprite rectangles, bones and comic-fullbody design flags.

Before editing binaries, run `node tools/restore-assets.cjs --materialize`. Then run `python tools/prepare_fullbody_rappers.py` to rebuild from durable masters, and `node tools/build-manifest.cjs`. Optional `--sources DIRECTORY` imports the original green-matte PNGs named in the configuration. The general Career builder preserves these sprites and metadata; the superseded head-only tool refuses to overwrite the new rigs.

## Validation and release

All sixteen automated Chromium/Linux suites passed. Checks cover distinct complete rig geometry, nine sprites/ten joints per character, custom sprite dimensions, clean transparent illustrated heads, animated poses/reduced motion, loading/retry, six-room Career progression, controller profiles, existing modes, menus and original Quick Play artwork.

The actual Windows portable was extracted; all 152 bundled app files matched source byte-for-byte, package version was checked and both executables retained seven-size custom icon resources. The preview shows the actual articulated in-game sprite assembly, not just the source concept art.

Windows 10/11 execution, native graphics and physical controllers have not been tested here. The portable is unsigned. Existing supplied-art and smoke redistribution caveats still apply; see THIRD-PARTY-NOTICES.txt. Characters are fictional AI-generated designs, not identified artists, endorsements or voice clones. No commercial permission for supplied reference/source imagery is asserted.
