# MIC HERO menu & game modes — v0.7

## Widescreen menu

The supplied Mic Hero portrait artwork has been recomposed into a landscape 16:9 background, rather than stretched. All six modes are interactive text, not baked-in labels. A distressed gold/black strip adapted from the supplied highlight reference follows the selected row; the selected label turns cream-white. Normal labels are dark red with a light distressed mask.

- Mouse: point to select; click to open.
- Keyboard: Up/Down to select; Enter/Space to open; Escape to go back.
- Standard gamepad: D-pad/left stick to select; bottom face button to open; right face button to go back.
- Guitar: configured strum up/down selects, green confirms, red goes back.

The main-menu scene keeps a 16:9 aspect ratio with letterboxing if the window has another shape. The desktop's initial content area is 1440x810. Settings and mode setup panels remain responsive and scroll when needed. The title screen retains its subtle hand rigs and any-button input with no visible UI overlays.

## Career

A saved three-challenge ladder on the existing original Midnight Circuit session:

| Challenge | Chart | Clear goal |
|---|---|---|
| Basement Proof | Easy | At least 65% weighted accuracy |
| Rooftop Cipher | Normal | At least 72% accuracy and 20-note best combo |
| Headline Moment | Hard | At least 80% accuracy and 35-note best combo |

Clear a challenge to unlock the next. Cleared challenges can be replayed. The results screen supports Retry, Career Board and Next Challenge when available. Clears and best challenge scores persist locally.

This is an initial challenge ladder, **not three new tracks or separately built venues**. Every challenge uses the existing approximately 85-second original track and stage, with a different authored difficulty selection and clear goal. Roll assist can be used; assisted leaderboard records are separated from unassisted ones.

## Quick Play

Starts the original session using the current Soundcheck difficulty and assistance settings. Existing D/F/J/K/L keyboard controls, controller profiles, holds, rapid passages, stem-ducking feedback and Spitfire remain intact. Completed sessions post a local Quick Play record.

## Versus Battle — simultaneous local two-player

Two players share the same song clock and difficulty, but have independent:

- Note state and timing judgments
- Score, combo, max combo and accuracy
- Holds and early-release penalties
- Hype and special phrases
- Spitfire charge and activation
- Highway, feedback and HUD

The highest score wins; equal scores produce a draw. Rematch resets both players. Both scores are saved to the local Versus record table.

### Setup

Choose each player's name and input device before starting. Options include keyboard, two separate exposed controllers, or one keyboard plus one controller. The same physical controller cannot be assigned to both players. Device lists can be refreshed. Press a controller button if the browser has not exposed it yet.

### Shared-keyboard bindings

| Lane | Player 1 | Player 2 |
|---|---|---|
| Kick | A | H |
| Snare | S | J |
| Hats | D | K |
| Sample | F | L |
| Flow | G | ; |
| Spitfire | Space | Enter |
| Shared pause/resume | Escape | Escape |

These bindings replace D/F/J/K/L only during Versus. They remain available as backup input even when a controller is selected. Test keyboard rollover; some keyboards cannot register large simultaneous chords from two players.

### Controller behavior

Each selected device is routed to its own player. Both controllers use the current Standard Gamepad or Guitar profile and remapping configuration from **Settings → Controllers**. Separate per-player profile mappings are not implemented yet. Guitar strum-to-hit works for either controller when enabled.

The original controller driver handles Player 1; an independent driver handles Player 2. Either player's configured Start/Pause button pauses the common transport. Disconnecting an assigned pad pauses play. Reconnect it before resuming, or leave the battle and choose another input. Player 1 drives menus and results; Player 2 is not a second menu cursor.

Both players use the existing shared timing calibration offset. Per-controller latency offsets, online multiplayer, vibration, input arbitration for duplicate virtual pads and anti-cheat are not implemented.

### Shared mix

Versus deliberately disables miss-triggered stem ducking. Both players hear a clean synchronized mix so one player's mistakes cannot remove the other player's timing cues. Solo, Career and Training retain stem feedback. Roll assistance is disabled for both players during Versus and the previous user preference is restored afterward.

## Cypher Training

Choose a chart difficulty and either all lanes or one instrument lane. Other chart lanes are removed, while the full backing arrangement still plays. Optional hold-to-complete roll assistance can be enabled for the drill.

A live timing readout and results report show the average early/late timing bias and timing spread of successful hits. Training never posts a leaderboard record. It is a full-session lane drill; section looping, playback-speed control, pitch-preserving time stretch and microphone lyric recognition are not implemented.

## Leaderboards

Local-only records, saved on this computer/portable data directory. Filter by:

- Quick Play, Career or Versus
- Easy, Normal or Hard
- Tap/standard or guitar-strum rules
- Assisted or unassisted

The table shows up to twenty matching scores sorted descending, with player name, score, weighted accuracy, best combo and date. The most recent 200 records are retained across all categories. Training is excluded. Records begin with this version; older single-best-score keys are not converted into full historical entries.

No account or server is used. These are local game records, not verified competitive rankings. Keyboard backup input remains possible in configured controller modes, so the rule labels are not anti-cheat enforcement.

## Settings

Soundcheck controls remain: chart difficulty, master volume, shared input offset, reduced motion and roll assistance. The Controllers button is now inside Settings (and also in the pause menu), not a seventh main-menu row.

## Code map

- `app/modes.js`: menu selection, Career, Training, local records and session lifecycle hooks.
- `app/battle.js`: independent Player 2 engine, two-pad routing, Versus keyboard layer, split rendering and results.
- `app/game.js`: original primary engine with lifecycle hooks and source-aware input.
- `app/controller.js`: primary device routing, remapping and menu navigation.
- `app/renderer.js`: shared stage and split highway dispatch.
- `app/main-menu.webp`: 16:9 recomposed artwork.
- `app/menu-highlight.webp`: blank distressed selection strip.
- `app/fonts/Anton-Regular.ttf` and `OFL.txt`: embedded open-source menu font and license.
- `app/type-grit.svg`: alpha texture used to distress mode labels.

The second engine mirrors the primary scoring windows and multiplier thresholds. Both derive input judgments and note positions from the same AudioContext clock. Solo preferences are restored when a mode ends or is left.

## Verification and boundaries

Automated Chromium/Linux checks cover menu aspect ratio at four sizes; keyboard and mouse selection; settings/controller routing; both players' keyboard hits, independent holds and Spitfire; synthetic two-controller routing; second-player guitar strums; controller-disconnect pause; winner calculation; rematch reset; Career success/failure/unlock persistence; Training filtering and timing report; Training exclusion from records; and leaderboard persistence. Existing gameplay, controller, performer-rig and title-hand tests also pass.

Run against a local server on port 8080:

```sh
node test-menu.cjs
node test-modes.cjs
node test.cjs
node test-controller.cjs
node test-rig.cjs
node test-title.cjs
node test-title-rig.cjs
```

The Windows x64 portable EXE has been cross-packaged, not launched on a Windows machine here. Physical two-controller play, Bluetooth/adapter behavior, keyboard rollover, actual Windows audio latency and release signing still need hardware testing. The executable is unsigned.
