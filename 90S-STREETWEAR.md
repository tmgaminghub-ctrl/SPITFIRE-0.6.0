# ’90s streetwear cast — v0.11.4

All six Career artists now wear tougher classic 1990s hip-hop outfits in the existing shaded comic-book style. This is an art/wardrobe update, not new gameplay or gang affiliation.

- **Nova Verse:** burgundy head bandana and braids, oversized burgundy/black varsity, long black tee, gold rope chain/medallion, baggy charcoal-blue denim and classic basketball high-tops.
- **Echo Kid:** oversized teal baseball jersey, long white tee, layered rope chains, baggy faded indigo denim, teal waist bandana and teal/cream high-tops. The modern sling bag is removed.
- **Brick Saint:** orange beanie and beard, oversized cream/black varsity, heavy washed denim, gold chains, cream waist bandana, wallet chain and tan work boots.
- **Iris 808:** violet bob, glasses and headphones, purple varsity, large gold hoops and rope chains, baggy indigo denim, violet waist bandana and purple/cream high-tops.
- **Dust Relay:** short curls and neck headphones, oversized olive hoodie, rope chain/medallion, baggy washed blue denim, olive waist bandanas and classic olive high-tops.
- **Tape Theory:** backward red cap and headphones, ochre work jacket and long cream tee, layered gold chains, baggy indigo denim, red waist bandanas, wallet chain and red/cream high-tops.

Their individual builds, identities, comic shadows and teal/violet highlights remain. Fifty-four runtime sprites were updated. Each still has nine illustrated cutouts and ten individual joints. The longer outfits have adjusted waist/torso cuts and pivots. Echo’s microphone/face boundary uses joint-local overlaps to avoid smearing the microphone colour onto his face.

## Preserved

The clean Career sampler, all six venues, original non-Career rigs/equipment, UI, fonts, music, controls, progression, player names and save keys are unchanged. All 65 unrelated binary assets were hash-compared with v0.11.3. No songs, voices, weapons or real gang insignia were added. Quick Play and other non-Career modes deliberately retain their original performers.

## Source and preview

Transparent full-body authoring references remain under `artwork/comic-rappers` and `artwork/comic-producers`. The source names, wardrobe flags, updated masks and joints are in `tools/fullbody-rappers.json` and `tools/fullbody-producers.json`. The common preparation tool rebuilds the selected group; run `node tools/restore-assets.cjs --materialize` before editing binaries, then `node tools/build-manifest.cjs` after rebuilding. The general Career builder preserves the wardrobe flag and custom rigs. Compact authoring references may be optimized after release; the verified portable’s compiled sprite files are authoritative.

`release/SPITFIRE-90s-cast-preview.webp` shows all six actual articulated game-sprite assemblies, not just concept art. It replaces the earlier separate rapper/producer preview images. Port 8080 serves the updated app with cache disabled; refresh and enter Career to see the new clothes.

## Verification

All seventeen automated Chromium/Linux suites passed, covering both character rigs together, full-body geometry, transparency, animation/input hand accents, reduced motion, debug overlay, loading/retry, Career progression, original non-Career equipment, menus, controllers and modes. Additional wardrobe/hash checks confirm six 90s designs and 54 changed character parts.

The actual v0.11.4 Windows portable was extracted: all 153 app files matched source, the package version matched, and both executable files retained seven-resolution custom icon resources. Preload count remains 117 images and three font families.

Native Windows execution, GPU rendering and physical controllers remain untested here. The portable is unsigned. These are fictional AI-generated character designs; no real artist endorsement, gang affiliation or voice clone is claimed. Existing supplied-art/smoke reuse caveats remain in THIRD-PARTY-NOTICES.txt; no commercial redistribution permission for supplied material is asserted.
