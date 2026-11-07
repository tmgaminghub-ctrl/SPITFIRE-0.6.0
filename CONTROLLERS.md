# SPITFIRE v0.4 — Controller setup

## Start here

1. Connect a Windows-compatible gamepad or five-fret guitar controller. Install its manufacturer's driver if Windows requires one.
2. Launch `SPITFIRE-0.11.4-Windows-x64.exe`.
3. Press a controller button so Chromium's Gamepad API can expose the device.
4. Open **Settings → Controllers** from the main menu, or **Controllers** from the pause menu.
5. Select the device and either **Standard gamepad** or **Five-fret guitar**.
6. Check the live monitor, test the bindings, then choose **Done**.

Keyboard controls remain active. Controller ownership and keyboard ownership are tracked separately so releasing one device does not cancel a hold still held on the other.

## Standard gamepad defaults

| Lane / action | Xbox-style | PlayStation-style | Standard Gamepad API index |
|---|---|---|---:|
| Kick | LB | L1 | 4 |
| Snare | A | Cross | 0 |
| Hats | X | Square | 2 |
| Sample | B | Circle | 1 |
| Flow | RB | R1 | 5 |
| Spitfire | Y | Triangle | 3 |
| Pause / resume | Menu / Start | Options | 9 |

Face-button names refer to the standard browser mapping. Nonstandard controllers may expose different indices; use the live monitor and remap. PlayStation-specific on-highway labels are selected when the device ID identifies a PlayStation-family controller; otherwise standard gamepads use Xbox-style labels.

### Menus

- D-pad up/down or left stick: move focus.
- D-pad left/right: change the focused slider or option.
- Bottom face button: confirm, toggle a checkbox, or advance the focused option.
- Right face button: back.
- Start: pause/resume during a session.

The controller panel itself is navigable with these controls. A keyboard or mouse remains available for initial setup and unusual raw-adapter mappings.

## Guitar profile

Default fret button indices are **0, 1, 3, 2, 4** for green, red, yellow, blue and orange. These are a configurable starting point, not automatic model recognition.

- Default strum up/down: buttons 12/13.
- Default Spitfire: button 8 (often Select/Back).
- Default pause: button 9 (often Start).
- Whammy, tilt and other controls are not automatically interpreted. A button or sufficiently distinct signed axis can be assigned to Spitfire.

### Tap-fret mode

Leave **Guitar: require strum** unchecked. Each new fret press judges its lane, just like a keyboard key. Hold the fret to sustain notes.

### Strum mode

Enable **Guitar: require strum**. Holding frets arms lanes without scoring. A new up/down strum edge judges all held frets, including simultaneous notes. Keep the appropriate fret held for sustain notes; the strum bar can return to neutral. Repeated strums can play roll passages while the fret stays held.

The five lane colors retain SPITFIRE's instrument colors; G / R / Y / B / O receptor labels identify fret order. There is no automatic lower-fret forgiveness, HOPO detection or open-note guitar mechanic in this build.

### Guitar menus

The mapped green fret confirms, the mapped red fret backs out, and the mapped strum up/down inputs move menu focus. Start pauses/resumes. D-pad navigation remains available too.

## Remapping

1. Select a lane or action binding.
2. Release buttons and let axes settle into their rest position.
3. Press the desired button, or move the desired axis far enough to cross 65% in the positive or negative direction.
4. The binding saves automatically. Release it before continuing.
5. Escape or **Cancel binding** cancels; capture also times out after twelve seconds.

A button or signed axis cannot be assigned simultaneously to multiple lanes or to a lane and Spitfire/Pause. Strum controls can share navigation inputs. **Reset this profile** resets only the selected profile.

Axes use hysteresis: press at 65%, release below 35%. Resting trigger axes at -1 are tolerated during binding capture; the opposite +1 end can be learned. Arbitrary POV-hat encodings and unusual nonzero intermediate values are not fully calibrated by this simple signed-axis model. If your adapter uses those, configure its driver to expose standard buttons, or use a compatible remapping utility. Do not assume every legacy guitar adapter will work.

## Device handling and saves

- Automatic mode chooses the first connected Gamepad API device; an explicit device can also be selected.
- Disconnecting the active controller pauses an active session and clears its held lanes without an immediate disconnect penalty.
- Reconnect the controller, then resume. A short resume grace period allows sustain input to be restored.
- Profiles and mappings persist alongside other game settings in the portable app's data directory when writable.
- Scores use separate local record keys for tap and configured guitar-strum rules. These are local records, not verified competitive rankings; keyboard input still works in strum configuration.
- Enable/disable controller input without disabling keyboard play.

## Timing and limitations

Controllers are polled once per animation frame before gameplay judgment. Fast repeated events that begin and end entirely between polls may be missed. Use wired controllers and a stable display refresh rate for the most consistent timing. Use Soundcheck's existing input offset for calibration; per-device latency profiles are not implemented.

The desktop build permits audio startup from controller menus. In the standalone browser preview, you may need one mouse/keyboard interaction first to satisfy browser autoplay restrictions.

Solo modes use one active controller. v0.7 Versus supports two selected controllers and independent player input; see `MODES.md`. Both controllers share the current profile and mappings. No vibration, model-specific USB driver, native raw-HID reader, or six-fret Guitar Hero Live layout is included. Windows must expose the controller through Chromium's Gamepad API. Avoid duplicate virtual/physical devices from simultaneous remapping layers.

## Verification

`test-controller.cjs` supplies synthetic Gamepad API snapshots and checks standard hits, no held-button repeats, chords, hold release, mixed keyboard/controller ownership, guitar strums, Spitfire, disconnect pause, axis hysteresis, button/axis remapping, duplicate rejection, persistence, standard menus and remapped guitar menu navigation.

The existing rhythm-game and character-rig smoke tests also pass. These are automated Chromium/Linux checks, not physical-controller tests. Actual Windows startup, Xbox/PlayStation hardware, Bluetooth, legacy guitar dongles and adapter-specific behavior remain unverified.

Run with a local server on port 8080:

```sh
node test.cjs
node test-rig.cjs
node test-controller.cjs
```

Implementation lives in `app/controller.js`. It uses the same audio-clock judgments as keyboard input; controller state is sampled before the renderer's judgment update. `press()` and `release()` in `app/game.js` track input sources independently.

## v0.7 local Versus

Main menu → Versus Battle opens device selection for both players. Assign different exposed pads, use one pad plus keyboard, or use a shared keyboard. P1 keyboard becomes A/S/D/F/G (Space = Spitfire); P2 uses H/J/K/L/; (Enter = Spitfire). Either player's configured Start button pauses the shared song. P1 navigates menus. Both pads use the current profile, including optional guitar strumming. The shared audio mix stays clean during Versus so one player's mistakes do not disrupt the opponent. See `MODES.md` for full behavior and hardware-testing limits.
