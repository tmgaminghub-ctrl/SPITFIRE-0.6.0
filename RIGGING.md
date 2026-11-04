# SPITFIRE — 2D character rigs (v0.8.1)

## What's rigged

The two foreground performers have been separated from the original single illustration. A newly generated clean background plate replaces the baked-in characters. Nineteen transparent cutout sprites reconstruct the producer, rapper and sampler, driven by a 21-node parent-child hierarchy.

Each character has a root, legs, torso, head, two upper arms, two forearms and two hands. The sampler is an independent static prop. The Black Gold alley background has no extra rigged characters.

This is a lightweight custom Canvas cutout rig, not a Live2D, Spine or 3D skeleton file. Facial features and mouths are painted into the head sprites: there is no lip sync, facial rig, inverse kinematics, or mesh skinning. Motions deliberately stay near the illustration's original pose to limit cutout seams. Original occluded surfaces were not fully repainted for extreme poses.

## Animation controls

- Producer: torso sway, head nod, alternating wrist/elbow pad accents.
- Rapper: torso sway, head nod, mic-arm motion, raised-arm and wrist gestures.
- Actual lane presses add small hand/head accents.
- Motion uses the song's audio clock at 96 BPM, rather than a separate animation timer.
- Higher Hype increases motion amplitude; Spitfire increases it further.
- Pausing freezes the audio clock and therefore the pose.
- Reduced motion zeroes skeletal animation offsets and root bobbing, preserving the bind pose.
- F2 toggles the joint and bone overlay during play or in menus.

## Source structure

- `app/puppets.js`: authoritative bone hierarchy, layer order, pose controller and hierarchical transform renderer.
- `app/rig-data.js`: generated atlas-like metadata for individual sprites.
- `app/rig/*.png`: transparent individual artwork pieces, editable in an image editor.
- `app/rig/parts.json`: sprite bounds in bind-pose coordinates.
- `app/stage-clean.jpg`: clean illustrated background plate.
- `app/stage.jpg`: original source illustration, retained for regeneration.
- `tools/build_rig.py`: reproducible source-coordinate masks and PNG extraction.
- `test-rig.cjs`: tests assets, hierarchy, animated child transforms, Hype/Spitfire response, reduced motion and F2.

## Edit joints and motion

1. Run `npm ci`, then `npm start`.
2. Press F2 to inspect joint placement.
3. Edit `PUPPET_BONES` in `app/puppets.js`. `pivot` is a joint in the original 1376x768 illustration coordinate system. `parent` determines inherited motion; `z` determines draw order.
4. Edit `poseAt()` to change amplitudes and phases. Rotation values are radians, relative to the bind pose.
5. Child transformations inherit all ancestor rotations. For example, the mic hand is parented to the mic forearm, which is parented to the upper arm, then torso, then root.
6. Keep angles small unless you repaint hidden shoulder, neck and elbow surfaces.

To change the masks, edit the polygons in `tools/build_rig.py`, install Pillow (`python -m pip install Pillow`) and run `python tools/build_rig.py`. This overwrites the generated PNGs and metadata. Back up hand-painted PNG edits before regenerating.

## Test and package

With a local server running on port 8080:

```sh
node test.cjs
node test-rig.cjs
```

Windows PowerShell packaging:

```powershell
$env:ELECTRON_BUILDER_COMPRESSION_LEVEL = '6'
npm run build:win
```

The resulting `SPITFIRE-0.9.0-Windows-x64.exe` is unsigned and portable. Packaging and Chromium/Linux tests passed. Windows launch, audio latency and USB save behavior still require testing on a Windows computer.

## Current grade and title atmosphere — v0.8.1

The 19 stage sprites are warm-graded into the Black Gold palette while retaining their original alpha masks, hierarchy and animation. Run `tools/build_black_gold.py` after `tools/build_rig.py` if regenerating artwork; the former rebuilds the original sprites before applying the current grade.

The previous title's hand cutouts remain retired. The current title uses an exact 1600×900 stage with four independent prop sprites (two cans, two records), four smoke/haze sprites and one fixed foreground. The two can emitters inherit their can transforms. The patched background plate and full static fallback are bundled. The records spin in opposite directions while the cans sway gently. The composite repeats over 48 seconds; reduced motion freezes all movement. See `TITLE-RIG.md` for pivots, masks, regeneration and verification.
