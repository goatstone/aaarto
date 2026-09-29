# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Aaarto (https://aaarto.art/) is a browser drawing app that mints the drawing as an NFT. The user draws with circles/squares on an SVG canvas, then "Mint the Aaarto" uploads the SVG + ERC-721 metadata to IPFS (via Pinata) and calls a Solidity contract (`preSafeMint`) through a connected wallet.

## Commands

```bash
npm install          # legacy-peer-deps=true is set in .npmrc (React 19 vs @fluentui/react peer range)
npm start             # webpack serve on :9000 (frontend dev)
npm run build          # webpack production build -> docs/ (this is what's deployed)
npm test               # jest
npx jest tests/featureFlags.test.ts   # run a single test file
npm run build-ts       # tsc typecheck only, no emit-driven build
npm run lint            # eslint . --config eslintrc.js
```

Backend (separate process, not part of the webpack build):

```bash
cd backend
pm2 start expressServer.js --name aaarto-api
pm2 logs aaarto-api
pm2 restart aaarto-api --update-env   # after editing backend/.env
```

## Architecture

**Two independent pieces that must share an origin at `/server`:**

| Piece | What it is | Dev | Production |
|---|---|---|---|
| Frontend | React (TS) bundle built by webpack into `docs/` | `webpack serve` on `:9000`, proxies `/server` to `:5000` | static files served by nginx |
| Backend | `backend/expressServer.js` (Express, port `5000`) — pins SVG + metadata to Pinata | pm2 | pm2, nginx reverse-proxies `/server` to it |

**Deployment model is unusual and deliberate:** the production bundle (`docs/bundle.js`) is built on a dev machine and *committed to git*. The server has no build step — it only runs `git pull`. This means:
- Any change to frontend code requires a rebuild + commit before it's live, not just a push.
- `network=` (see below) is baked into the committed bundle — a wrong value in `.env` at build time silently ships the wrong chain/contract to production. See the release checklist in DEV.md before building for production (`grep`-verifies the compiled bundle contains the polygon contract address and not the sepolia one).

**Two separate, git-ignored env files** (see DEV.md for full details):
- root `.env` — read only by `webpack.config.js` at build time (`network=sepolia|polygon`), inlined into the bundle via `DefinePlugin`. Every `process.env.X` used in app code must be explicitly listed in `webpack.config.js`'s `DefinePlugin` call — it's string substitution per key, not exposing all of `process.env`.
- `backend/.env` — read only by `expressServer.js` at runtime (Pinata keys). Never put these in the root `.env`.
- App code must only import config from `src/config.ts`; never `require('dotenv')` or reference raw `process.env.X` outside `webpack.config.js`/`src/config.ts` (dotenv needs Node's `path`, which breaks in the browser bundle).

**`src/config.ts`** branches on `network` (`"sepolia" | "polygon" | "amoy"`) to select RPC URL, contract address, and chain ID, and throws at import time if `network` is missing/unrecognized. Switching networks requires restarting `webpack serve` — `DefinePlugin` bakes the value in at build start, so a running dev server won't see a `.env` edit.

**Debug query strings** (`?env=dev` / `?env=full`, parsed once in `src/featureFlags.ts`, consumed in `App.tsx`) gate whether the mint button is enabled and whether IPFS upload runs — see DEBUG.md. This is UI-only, not access control: `POST /server` is unauthenticated, and `?env=dev` still sends a real on-chain transaction (just with a placeholder token URI). Never test `?env=dev` against `network=polygon`.

**Mint flow** (`App.tsx` → `uploadData.ts` → backend `/server` → `mintNFT.ts`):
1. `uploadData()` POSTs `{ name, svgString, description, artistName }` to `/server` (skipped if `?env=dev`).
2. Backend pins the SVG to Pinata first (image CID), then builds ERC-721 metadata JSON pointing at that CID and pins it too, returning only the metadata CID (`ipfsHashMD`).
3. `connectCoinbaseWallet()` (`coinbaseHelpers.ts`) resolves a Coinbase Wallet provider (handles multi-provider/providerMap/single-provider injection cases) and requests accounts.
4. `mintNFT()` switches/adds the configured chain on the wallet if needed, then calls `preSafeMint(account, ipfs://<ipfsHashMD>)` on the contract from `config.contractArtifact`, paying `config.platformFee`.
5. Errors are normalized to user-facing messages in `App.tsx` (`normalizeMintError`) based on substring matching on `error.message` (insufficient funds, user rejected, wallet not installed, etc.).

Contract ABI/artifacts live in `artifacts/contracts/AaartoNFTV4.sol/` (checked in; there's no local Hardhat contracts source in this repo — the compiled artifact is what `config.ts` imports).

## Path aliases

`@components/*`, `@utils/*`, `@hooks/*` map to `src/components`, `src/utils`, `src/hooks` — configured in three places that must stay in sync: `tsconfig.json` (`paths`), `webpack.config.js` (`TsconfigPathsPlugin`), and `jest.config.js` (`moduleNameMapper`).

## Project tasks (GitHub Projects)

Tasks are tracked in GitHub Project **#4**, owned by the **`goatstone`** org — not the `JoseHerminioCollas` user, even though the `origin` remote points at `JoseHerminioCollas/aaarto` (the `upstream` remote, `goatstone/aaarto`, is the tell). Use `gh project` with `--owner goatstone`:

```bash
gh project view 4 --owner goatstone
gh project field-list 4 --owner goatstone
gh project item-list 4 --owner goatstone --format json
```

Writing items (`item-edit` / `item-create`) needs the project id (`PVT_kwDOAA4JWM4AvrSS`) and field ids from `field-list` (e.g. Status = `PVTSSF_lADOAA4JWM4AvrSSzgmETLw`, Priority = `PVTSSF_lADOAA4JWM4AvrSSzgmETN8`).

The project spans two repos — `goatstone/aaarto` (frontend) and `goatstone/aaarto_backend` — and mixes linked `Issue` items with standalone `DraftIssue` items (e.g. unfixed security issues kept private until patched); check `content.type` when listing.

### Work summary comments

When posting a work-summary comment (e.g. on an issue/PR in Project #4), include these two tags so a downstream parser can extract it:

```
work_summary
worked_on_task_for_hours: <N>
```

- `work_summary` marks the comment as a work summary.
- `worked_on_task_for_hours: <N>` records hours worked, as a number (e.g. `2.5`).

Both tags must appear verbatim in the comment body, followed by the prose summary.
