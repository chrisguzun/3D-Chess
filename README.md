# 3D-Chess

An interactive 3D chess game running in the browser, built with Three.js and Vite. Fully playable two-player chess on a rendered 3D board with realistic piece models.

## Features

- Fully rendered 3D board and pieces using Three.js
- Complete chess rules (legal move highlighting, turn enforcement)
- Orbit controls to freely rotate the camera around the board
- Realistic piece models (see [CREDITS.md](./CREDITS.md))
- Post-processing visual effects via the `postprocessing` library

## Requirements

- Node.js 16+
- npm

## Installation

```bash
git clone https://github.com/chrisguzun/3D-Chess.git
cd 3D-Chess
npm install
```

## Usage

```bash
npm run dev
```

Then open the URL shown in your terminal (typically `http://localhost:5173`) in a browser.

### Controls

| Input | Action |
|---|---|
| Left-click a piece | Select it (legal moves highlighted) |
| Left-click a highlighted square | Move the selected piece |
| Right-click + drag | Orbit camera |
| Scroll wheel | Zoom in / out |

## Credits

3D piece models by Aitordsgn via Sketchfab, licensed under CC BY 4.0. See [CREDITS.md](./CREDITS.md) for details.
