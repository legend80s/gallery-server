# gallery-server — Agent Notes

## Project

Local image viewer CLI published to npm (`gallery-server`). Serves photos/videos from a folder via Koa, with a React frontend.

## Structure

- `server/app.js` — main entry + CLI bin. Koa server serving media files + client build + REST APIs (`/api/images`, `/api/videos`, `/api/view`).
- `client/` — React frontend (Create React App / `react-scripts`). Builds to `client/build/` which the server serves statically.
- `lib/` — shared constants between client and server.
- `test/` — Mocha tests.

## Commands

| Task | Command |
|---|---|
| Install | `pnpm i` |
| Dev server | `pnpm dev:server --folder=/path/to/photos` (alias: `pnpm ds`) |
| Dev client | `pnpm dev:client` (alias: `pnpm dc`) |
| Tests | `pnpm test` |
| Build client | `pnpm build:client` |
| Clean | `pnpm clean` |
| Publish | `pnpm version patch` (runs test + clean + build:client via preversion hook) |

## Critical Quirks

- **Client uses `react-scripts` (Create React App), NOT Vite.** The README mentions Vite but the actual code uses `react-scripts`. Do not migrate or add Vite config unless explicitly requested.
- **`NODE_OPTIONS=--openssl-legacy-provider`** is required in client scripts for Node.js v17+. Already wired in `client/package.json`.
- **`client/package.json` exists for scripts only.** All dependencies live in the root `package.json` under `devDependencies`. Never install deps into `client/package.json`.
- **Client dev proxy:** `client/package.json` sets `"proxy": "http://localhost:6834/"` to forward API calls to the server during development.
- **Default port:** `6834` (defined in `lib/constants.js`). Server auto-detects an available port if 6834 is occupied.
- **Token-based auth:** Each server session generates a token. API/image requests without a valid token return 403. The token is appended to URLs for sharing.
- **`node_modules` excluded:** The server recursively scans the media folder but skips `node_modules` directories.

## Style

- 2-space indent, LF line endings, UTF-8 (`.editorconfig`)
- Prettier: single quotes, trailing comma ES5 (`.prettierrc.json`)
- VS Code: Prettier as default formatter on save for JS

## Testing

- Framework: Mocha (root `pnpm test`)
- Single test file: `test/file.test.js`
- Run: `pnpm test` (no watch mode configured at root)
