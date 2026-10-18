# Mkraftman Windows PC Media Control

A custom Lovelace media control card for Home Assistant providing transport controls for a Windows PC via Unified Remote. Matches the visual style of the Sky Q media control card.

![HACS Badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)

## Features

- **Sky Q-style media player** — dark background with right-aligned artwork and gradient fade, matching the look of other mkraftman media control cards.
- **Transport controls** — skip previous, play/pause, and skip next buttons using actual keyboard media keys via Unified Remote's `Relmtech.Keyboard` remote.
- **Keyboard media keys** — sends real keyboard events to the active window, not system media session commands (which target the wrong app).
- **Background image** — uses `/local/images/windows.png` as the card background.
- **Configurable title** — displays "Windows PC Living Room" in the top-left corner.

## Requirements

- [hass-unified-remote](https://github.com/akshansh1998/hass-unified-remote) custom integration
- Unified Remote Server running on the target Windows PC with remote access enabled

## Installation

### HACS (Recommended)

1. Open HACS in Home Assistant
2. Go to **Frontend** → three-dot menu → **Custom repositories**
3. Add `https://github.com/mkraftman/mkraftman-windows-pc-media-control` as a **Dashboard** repository
4. Search for "Mkraftman Windows PC Media Control" and install it
5. Add the resource in **Settings → Dashboards → Resources** (HACS may do this automatically)

### Manual

1. Download `mkraftman-windows-pc-media-control.js` from the [latest release](https://github.com/mkraftman/mkraftman-windows-pc-media-control/releases)
2. Place it in your `www/` folder
3. Add the resource in **Settings → Dashboards → Resources**:
   - URL: `/local/mkraftman-windows-pc-media-control.js`
   - Type: JavaScript Module

## Usage

```yaml
type: custom:mkraftman-windows-pc-media-control
```

No configuration options are required. The card uses `unified_remote.call` with `Relmtech.Keyboard` `toggle` to send media key events.

## How It Works

The card sends actual keyboard media key events via Unified Remote's `Relmtech.Keyboard` remote, which means they go to whatever application has focus on the Windows PC. This is important because the alternative (`Unified.Media` remote) targets the Windows system media session, which often controls the wrong application.

| Button | Key Sent | Action |
|--------|----------|--------|
| Skip Previous | `media_prev_track` | Previous track/chapter |
| Play/Pause | `media_play_pause` | Toggle play/pause |
| Skip Next | `media_next_track` | Next track/chapter |

## Changelog

### v1.0.4

- Use `Relmtech.Keyboard` `toggle` with keyboard media keys instead of `Unified.Media` remote actions (fixes wrong app being controlled)
- Correct key names: `media_prev_track`, `media_play_pause`, `media_next_track`

### v1.0.3

- Replace rewind/fast-forward with skip-previous/skip-next icons and actions
- Remove Home and Windows key buttons (moved to dashboard layout)
- Rename title from "Windows PC" to "Windows PC Living Room"

### v1.0.2

- Fix Windows key: double-toggle for press-and-release behaviour

### v1.0.1

- Fix: use `toggle` action instead of `stroke` for Unified Remote keyboard commands

### v1.0.0

- Initial release

## License

MIT

## Releasing

Bump the version in `VERSION` (e.g. `1.0.1`) and push to `main`. The release workflow creates the matching `vX.Y.Z` tag and GitHub release with `dist/mkraftman-windows-pc-media-control.js` attached. Pushing a `vX.Y.Z` tag directly also still works.
