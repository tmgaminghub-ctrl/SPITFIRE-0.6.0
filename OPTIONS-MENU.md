# Hip-hop paper Options — v0.9.1

Open **Options** from the interactive main menu.

The supplied Guitar Hero III screenshot is a layout reference: taped paper, a vertical stack of categories, burgundy active highlight and bottom navigation strip. The actual background is a newly generated hip-hop zine illustration with graffiti, headphones/skull, crossed microphones, vinyl, boomboxes and speakers. No Guitar Hero logo or original screenshot is bundled as game artwork. The interface fits a centred 16:9 composition; non-widescreen windows letterbox it instead of stretching the paper.

## Working categories

- **Audio:** master volume, live percentage, input timing offset and timing guidance. These are the existing real audio/settings controls, not replica sliders.
- **Video:** reduced motion, plus fullscreen/windowed toggle. If fullscreen is blocked by an embedded browser, a status message explains that instead of failing silently. Window resolution follows the available window; there is no separate render-resolution selector.
- **Controller:** the real standard gamepad/five-fret guitar profile, bindings, strum option and live input monitor, now using the matching paper palette. Done returns to Options with Controller focused. Pause-menu controller access still returns to Pause.
- **Gameplay:** Quick Play chart difficulty and unranked roll assist. Career mission difficulties remain fixed by the challenge rules; Training/Versus keep their own selectors.

Settings use the existing local `spitfireSettings` save, so previous preferences are preserved. Changes are applied immediately. The status confirms a matching saved value or reports local-save unavailability. Fullscreen state is a window action rather than a persisted preference. Controller settings retain their separate existing local save. No cloud account, store, purchases, videos, cheats or nonfunctional placeholder rows have been introduced.

## Navigation

Mouse click selects categories and operates controls. Keyboard Tab reaches every visible control; Up/Down moves between category buttons; Enter/Space activates a focused button; Left/Right adjusts ranges/selects. Escape returns to the main menu. Standard gamepad D-pad/stick navigates, confirm selects, Left/Right adjusts controls and Back returns. Guitar navigation uses the existing configured fret/strum rules.

## Files

- `app/options-menu.webp`: new 1600×900 hip-hop paper background.
- `app/options-menu.css`: paper/tabs, content panel, footer and controller palette.
- `app/options-menu.js`: relocates existing controls without discarding save/audio handlers, category selection, fullscreen feedback and controller return focus.
- `app/controller.js`: fixes an existing profile-change bug by capturing the selected value before cancellation rebuilds the binding UI. Standard ↔ guitar selection now actually changes the saved profile.

The background is included in the real pre-game asset manifest (55 images, two embedded font families). All Career cards and existing modes, title rigs, imported smoke and menu remain intact.

## Verification

Thirteen Chromium/Linux suites pass. `test-options-menu.cjs` covers real saved volume/offset, reduced motion, fullscreen feedback, difficulty/assist, working guitar-profile selection, controller return, keyboard/controller navigation and Back, reload persistence, 16:9 bounds at four sizes, image preloading and no runtime errors. The previous twelve suites also pass. The source and packaged portable assets are compared by bytes; inner/outer custom icons and version are checked. Native Windows execution and physical controllers remain untested; the portable Windows build is unsigned.

## v0.9.2 — controls match the printed artwork

Native-looking modern widgets have been restyled: cropped paper-grain category strips with irregular edges, printed serif title/category lettering, ink-stamped values, ruled slider tracks with tilted burgundy handles, hand-marked checkbox crosses, paper dropdowns, sketched content borders, scuffed Back/Fullscreen buttons, and separate dark navigation badges matching the reference. The controller binding sheet now also uses paper-grain controls and dashed ink rows. Existing HTML inputs remain accessible, keyboard/gamepad-operable and connected to the original save/audio handlers. The options suite additionally verifies embedded typography and custom range/checkbox/select appearances. All thirteen suites pass again.

## v0.9.3 — category menu and dedicated pages

Options opens with category buttons only; no Soundcheck or other settings card is shown behind/beside them. Audio opens the Soundcheck page, Video opens its settings page, Gameplay opens its page, and Controller opens the existing input/binding page. The category list is hidden on a settings page and excluded from keyboard/controller navigation. Back, Escape and controller Back return from a settings page to the category list with the originating button focused; from the category list they leave Options for the main menu. Done/Back from the Controller page returns to the category list. Reopening Options always starts at the category list. Local settings and all printed-paper control styles remain unchanged. Tests cover both navigation levels and root/detail bounds at four sizes.
