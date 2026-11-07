# Historical painted head refresh — v0.11.1

**Superseded by v0.11.2:** the current build has unique full-body comic rigs, not the shared bodies described below. See `COMIC-CAST.md`. Historical head masters are no longer shipped; use `artwork/comic-rappers` and the full-body preparation tool.

Nova Verse, Echo Kid and Brick Saint now use a shaded, painted stage-illustration treatment guided by the supplied `Screenshot 2026-11-04 144055.png`, rather than their earlier flat geometric faces. They remain distinct original fictional characters:

- Nova Verse: braids, gold hoops and burgundy clothing.
- Echo Kid: cream/teal flat-brim cap and teal clothing.
- Brick Saint: orange ribbed beanie, beard and cream clothing.

The heads are new AI-painted designs with facial modelling, ink outlines and cool teal/violet highlights. Clothing and hand sprites retain the original puppet cutouts, with more tonal range and stage reflections painted into the shaded folds. These are not newly generated full-body poses; the original bind-space silhouette, articulated body parts and animation are deliberately retained. Nova's braid tips are tapered to avoid a straight crop edge.

## Preserved behaviour

All three have the same nine sprite slots, dimensions and animation pivots as before. The existing Career lineup, pose accents and reduced-motion option still work. The three producer designs, six venue paintings, original Quick Play performer/stage, gameplay, audio, songs, names, unlocks and save keys are unchanged. No voices or recordings were added.

The updated head sprites also appear in Career room-card portraits. The actual loading manifest still contains 116 images and three font families; there are no remote image dependencies.

## Source files

- `tools/prepare_painted_rappers.py`: removes the green authoring matte, preserves teal rim lighting, creates transparent master portraits, sizes heads to the existing rig metadata and reshadows original rapper body/limb cutouts.
- `tools/painted-rappers.json`: identifies the three painted designs and their reference/master paths.
- `artwork/painted-rappers/{nova,echo,brick}-head.webp`: compact, durable transparent authoring portraits, outside the app bundle.
- `app/cast/{nova,echo,brick}-rapper_*.webp`: the 27 actual in-game sprite files, including three new heads and 24 reshaded body/limb pieces.
- `app/career-world-data.js`: marks only the three rappers with `artStyle: painted-stage`.

Before regenerating or editing binaries, run `node tools/restore-assets.cjs --materialize`. The general Career art builder now preserves existing painted rapper sprites instead of silently overwriting them with the older procedural faces. Run the dedicated preparation tool to rebuild from the durable portrait masters when high-resolution `.cache` authoring images are absent.

## Validation

All sixteen Chromium/Linux suites pass. The new painted-rappers suite checks three distinct illustrated faces, rich tonal variation, transparent backgrounds with no remaining solid green matte, original bind dimensions, unchanged producer design flags, actual live Career substitution, animated poses/reduced motion and preservation of the original Quick Play rapper. The fifteen existing gameplay/controller/loading/rig/menu/Options/tracklist/Career suites also pass.

The portable archive is extracted and all app files compared byte-for-byte to source. Original producer sprites, original puppet rig sprites and venue paintings are additionally compared with v0.11.0 to confirm they were not changed. Version and custom inner/outer icons are checked. These checks do not constitute native Windows execution: Windows hardware, physical controllers and native rendering remain untested; the portable is unsigned.

## Rights

The style screenshot is user-supplied reference material. The new heads depict fictional characters, not identified real artists, endorsements or voice clones. Existing underlying puppet-body/source-art rights caveats remain; see the bundled third-party notices. No commercial redistribution permission for supplied reference/source imagery is asserted.
