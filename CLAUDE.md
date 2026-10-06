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

The project spans three repos — `goatstone/aaarto` (frontend, public), `goatstone/aaarto_backend` (public) and **`goatstone/aaarto_project` (private)** — and mixes linked `Issue` items with standalone `DraftIssue` items; check `content.type` when listing.

### Terminology

- **Issue** — lives in a repo's issue list (`goatstone/aaarto`, `aaarto_backend`, `aaarto_project`). Labels, milestone, parent and sub-issues belong to the issue.
- **Project item** — a row displayed in Project #4. Usually linked to an issue, but can also be a PR or a `DraftIssue` with no issue behind it. Status, Priority and the other project fields belong to the item. Transferring an issue re-creates its item.
- **Task** — the user's word for an issue and its project item together; GitHub has no such object. Use "issue" or "project item" when only one is meant.

### Private issues (`goatstone/aaarto_project`)

Sensitive issues live in the private repo, never in the public ones: unfixed security findings, contract/key-custody/redeploy work, and anything describing an exploitable weakness. Don't put details of unfixed weaknesses in public issue bodies *or comments* (edit history stays visible).

- **#5 "Contract issues/tasks"** — the single parent for all contract work (incl. #4 redeploy fix list, Safe/owner-admin move, fee recipient, monitoring, live-state checks, the contract security review archive #13). It is *not* in a phase. There is no public contract parent; the old public #137 was closed as a duplicate.
- **#6 "Security issues (unfixed)"** — parent for unfixed non-contract security issues (S1–S3 upload endpoint/SVG/metadata race, S8 raw errors, CSP). It is a sub-issue of public Phase 1 (#131), so these are fixed in Phase 1. A private repo can't share the public phase milestone, so the milestone rollup doesn't count them; sub-issue progress does.
- To make an issue private, `gh issue transfer <N> goatstone/aaarto_project -R goatstone/<repo>` — it gets a **new number** (public one redirects for members only) and keeps its old parent unless reparented. Reparent with `addSubIssue(... replaceParent: true)`; an issue may have only one parent.

### Phase structure (parent issues + native sub-issues)

Active work (currently the wallet-integration roadmap) is organized the same way as the `umina-achala` project (org `umina-achala`, project #1) — study that project's Phase issues (e.g. its #64) as the reference pattern before restructuring anything here:

- Each phase is a **parent issue** (e.g. #131 "Phase 1: default wallet opens automatically") using GitHub's native sub-issues feature, *not* just a milestone grouping.
- A **matching milestone** exists per phase, same name as the parent issue (e.g. milestone "Phase 1: default wallet opens automatically"). Dual structure: milestone for the project-field rollups, parent issue for the live sub-issue checklist and `sub_issues_summary` (completed/total) progress.
- Current phases: #131 (Phase 1), #132 (Phase 2), #141 (Phase 3: enhancements; the old #133 "Phase 3: TBD" is closed and superseded), #134 (Phase 4, closed).
- Non-phase parents (don't hold up a phase): **#135 "Ongoing tasks"**, **#136 "Performance, Tuning"** and **#138 "Refactor"** (parent of all `refactor`-labeled issues; the label exists in `goatstone/aaarto`, new refactor issues should get it and be added as sub-issues) have *no milestone*. **#139 "Growth"** has the milestone "Growth: analytics, SEO, marketing" and is the parent of the analytics/SEO items and of **#140 "Marketing"** (OpenSea #50, audience, content, community).
- `gh issue edit` has **no flag for sub-issues** — managed via raw GraphQL:
  ```bash
  gh api graphql -f query='mutation($p:ID!,$u:String!){addSubIssue(input:{issueId:$p,subIssueUrl:$u}){subIssue{number}}}' \
    -f p=<parent_node_id> -f u=https://github.com/goatstone/aaarto/issues/<N>
  # remove: mutation($p:ID!,$c:ID!){removeSubIssue(input:{issueId:$p,subIssueId:$c}){issue{number}}}
  ```
  Get a node id via `gh api repos/goatstone/aaarto/issues/<N> --jq .node_id`. When moving an issue between phases, update both the sub-issue link *and* its milestone to match the new parent.
- Phase 1's actual scope (clarified, not just "the first task"): a working default wallet, a query-string way to test other wallets on the live site, and any serious bug in the live wallet/mint flow — explicitly **not** anything needing a contract rewrite (those stay out of the phased rollout, tracked under private #5 instead). Unfixed security issues are the exception: private parent #6 sits inside Phase 1.

### Backend repo issues (`goatstone/aaarto_backend`)

Public repo for the Hardhat project and `AaartoNFTV4` contract (local clone: `/home/goat/projects/aaarto_backend`, which has its own `CLAUDE.md`). Its issues are repo hygiene only; contract, key-custody and security work is in the private repo (parent #5 / #6).

- **#23 "Backend repo hygiene"** is the parent for general repo work (CI #21, dependencies #22). It has no milestone and is not part of a phase.
- **#9 "Write the README"** is a Phase 1 sub-issue (#131); one checkbox is still open (commit tags per network, tracked with private #23). **#6** (Hardhat config fix, `.vscode` files) is closed.
- **Merging:** branches are rebased and merged with `--ff-only`, so the remote branches keep the old pre-rebase commits and GitHub shows them "ahead" of `main` even though the changes are in `main` (verify with `git cherry origin/main origin/<branch>`). Delete the branch after merging; there is no PR link, so issues don't auto-close; close them by hand and set the project item to Done.
- The project board's "Parent issue" grouping can lag after a reparent (cross-repo links especially); verify with `gh api repos/<owner>/<repo>/issues/<N> --jq .parent_issue_url` before assuming a parent is missing.

### Project field conventions

- **Issue numbers:** the `#N` after a title is the issue's number *within its repo* (the row number in the table is just position). A transfer to another repo assigns a new number.
- **Priority** (every item must have one; set via `item-edit` with the Priority field id above, options P0=`79628723`, P1=`0a877460`, P2=`da944a9c`): P0 = security and the live wallet/mint flow, P1 = hardening, launch needs, phase 2 work, P2 = polish and recurring work. A parent's priority is a judgment call, not a rollup of its children.
- **Status:** when an issue is closed, set its project item's Status to **Done**. Do **not** archive items.

### Work summary comments

When posting a work-summary comment (e.g. on an issue/PR in Project #4), include these two tags so a downstream parser can extract it:

```
work_summary
worked_on_task_for_hours: <N>
```

- `work_summary` marks the comment as a work summary.
- `worked_on_task_for_hours: <N>` records hours worked, as a number (e.g. `2.5`).

Both tags must appear verbatim in the comment body, followed by the prose summary.
