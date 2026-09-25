# Development Notes

## Environment variables

There are two git-ignored env files, one per piece of the system (see [Architecture](#architecture)):

| File | Used by | Contents |
|---|---|---|
| `.env` (project root) | webpack, at build time | `network=sepolia` or `polygon` |
| `backend/.env` | `backend/expressServer.js`, at runtime | `PINATA_API_KEY=...` and `PINATA_SECRET_API_KEY=...` |

Copy `env.example` to `.env` at the project root and fill in real values before running the project.

```
network=sepolia   # or "polygon" for mainnet

```

**Keep the Pinata keys in `backend/.env` only.** Never put them in the root `.env`; they must not be anywhere webpack can see them.

- `dotenv` loads `.env` in `webpack.config.js` (Node context, runs at build time).
- `DefinePlugin` inlines each `process.env.X` reference as a literal string in the bundle — every key used in app code must be listed explicitly in `webpack.config.js`, since it's doing string substitution per key, not exposing all of `process.env`.
- **Never** `require('dotenv')` or reference raw `process.env.X` outside `webpack.config.js` and `src/config.ts`. `dotenv` depends on Node's `path` module, which isn't available in the browser — importing it into app code breaks the bundle. App code should only ever import from `src/config.ts`.

## Switching networks

Edit `network=` in `.env` (`sepolia` or `polygon`), then **restart `webpack serve`**. `DefinePlugin` bakes values in at build start, so a running dev server won't pick up the change until it's stopped and rerun.

`src/config.ts` branches on `network` to select the active RPC URL, contract address, and chain ID, and throws at startup if `network` is missing or unrecognized (fail loudly rather than silently running against `undefined`).

**Care when using `polygon` (mainnet):** this points at the live contract, not testnet. Double-check `.env` before running if you're not sure which network is currently set — a leftover `network=polygon` from a previous session is the most likely way to accidentally interact with mainnet during testing.

## Architecture

| Piece | What it is | Dev | Production |
|---|---|---|---|
| Frontend | React bundle built by webpack into `docs/` | `webpack serve` on `:9000` | static files served by nginx |
| Backend | `backend/expressServer.js` (Express, port `5000`); pins the SVG and metadata to Pinata | pm2 | pm2 |

The frontend posts to the **relative** URL `/server` (`src/uploadData.ts`), so the browser and the backend must share one origin. In dev, the webpack dev server proxies `/server` to `:5000`. In production, nginx does.

## Running locally (dev)

1. Install: `npm install`
2. Create `.env` at the project root with `network=sepolia` (use the testnet for development).
3. Create `backend/.env` with the Pinata keys.
4. Start the backend under pm2:
   ```bash
   cd backend
   pm2 start expressServer.js --name aaarto-api
   pm2 logs aaarto-api        # tail logs
   pm2 restart aaarto-api     # after code or .env changes
   pm2 stop aaarto-api        # stop it (pm2 delete aaarto-api removes it)
   ```
   Check it: `curl http://localhost:5000/server_status`
5. Start the frontend from the project root: `npm start`, then open http://localhost:9000

`dotenv` reads `.env` from the directory the process runs in, so **start the backend from `backend/`** or it won't find `backend/.env`.

For `/server` to reach the backend, `devServer` in `webpack.config.js` needs a proxy:

```js
devServer: {
  static: { directory: path.join(__dirname, "docs") },
  compress: true,
  port: 9000,
  proxy: [{ context: ["/server"], target: "http://localhost:5000" }],
},
```

The Coinbase Wallet extension must be installed and set to the same network as `network=` in `.env` (or approve the chain-switch prompt).

## Deploying to aaarto.art (AWS)

Production is a single EC2 instance (Ubuntu) with nginx in front and a Let's Encrypt certificate. nginx serves the built frontend from `docs/` and reverse-proxies `/server` to the backend on `127.0.0.1:5000`.

**The build output is checked in, and the server never builds.** The bundle is built on a dev machine with `network=polygon` and committed to git (`docs/bundle.js`), and the server only runs `git pull origin main`. This is deliberate:

- What is deployed is exactly what was built and tested, and the server has no build step that could fail or produce something different.
- The server needs no root `.env`, no webpack and no dev dependencies; it only needs what the backend requires at runtime.
- Any past release can be restored with `git checkout` and a pull.

The trade-off is that the committed bundle must be built with the right `network=`. The release steps below include a check for this.

### One-time server setup

1. **Security group:** allow inbound 22 (SSH, your IP only), 80 and 443. **Do not open 5000**; only nginx talks to the backend, over localhost.
2. **DNS:** `A` records for `aaarto.art` and `www.aaarto.art` pointing at the instance's Elastic IP.
3. **Install:** Node 20+, nginx, certbot, and pm2 (`npm i -g pm2`).
4. **Clone** the repo to `/var/www/aaarto`.
5. **Install the backend's runtime dependencies** (`express`, `axios`, `cors`, `dotenv`, `form-data`) without pulling in the whole frontend toolchain. For example, `npm install --omit=dev` at the repo root; this is also why the backend should eventually get its own `package.json`.
6. **Create `backend/.env` on the server** with the Pinata keys (do not copy it from a dev machine). No root `.env` is needed here, since the server doesn't build.
7. **nginx:** create `/etc/nginx/sites-available/aaarto.art`:
   ```nginx
   server {
     listen 80;
     server_name aaarto.art www.aaarto.art;
     root /var/www/aaarto/docs;
     index index.html;

     location /server {
       proxy_pass http://127.0.0.1:5000;
       proxy_set_header Host $host;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       client_max_body_size 1m;
     }

     location / {
       try_files $uri $uri/ =404;
     }
   }
   ```
   Symlink it into `sites-enabled`, then `sudo nginx -t && sudo systemctl reload nginx`.
8. **TLS:** `sudo certbot --nginx -d aaarto.art -d www.aaarto.art`. certbot adds the 443 block and sets up auto-renewal.
9. **Backend under pm2, surviving reboots:**
   ```bash
   cd /var/www/aaarto/backend
   pm2 start expressServer.js --name aaarto-api
   pm2 save
   pm2 startup     # run the command it prints, once
   ```

### Deploying an update

**1. On the dev machine: build for mainnet and commit**

```bash
# root .env must say network=polygon for this build
npm run build
grep -c 0x03a9423E9Aac42E9F991D292F8e074808D9ABE7f docs/bundle.js   # must print 1 (the polygon contract)
grep -c 0x92128cD1BCA8cc406d2223Dcf1558E4d926Dd68f docs/bundle.js   # must print 0 (the sepolia contract)
git add -A && git commit -m "build for production" && git push origin main
```

The `network=` value is baked into `docs/bundle.js` at build time. A bundle built with `network=sepolia` and committed would silently point the live site at the testnet contract, so always run the two `grep` checks before committing. After testing on Sepolia, set `network=polygon` again before the release build, and never commit a `docs/` folder built for Sepolia.

**2. On the server: pull**

```bash
cd /var/www/aaarto
git pull origin main
pm2 restart aaarto-api        # only needed if backend/ changed
```

nginx serves `docs/` straight from disk, so a frontend-only change is live as soon as the pull finishes. If `backend/package.json` or the root `package.json` gained a dependency the backend uses, run `npm install --omit=dev` before restarting.

### Verify

- `curl https://aaarto.art/server_status` returns JSON with the uptime.
- The site loads, and a test upload returns an IPFS hash (watch `pm2 logs aaarto-api`).
- For changes that touch the mint flow, test on Sepolia locally first (`network=sepolia`) before making the `polygon` release build.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| `/server` returns 404 on localhost | `devServer.proxy` is missing, or the backend isn't running (`pm2 ls`) |
| Backend runs but Pinata returns 401 | `backend/.env` wasn't found; start pm2 from `backend/` |
| Changed `backend/.env`, nothing happened | `pm2 restart aaarto-api --update-env` |
| Changed root `.env`, nothing happened | Rebuild (`npm run build`) or restart `webpack serve` |
| 502 from nginx | Backend not running: check `pm2 ls` and `pm2 logs aaarto-api` |
| Site shows the wrong chain or contract | The committed `docs/bundle.js` was built with the wrong `network=`; fix the root `.env` on the dev machine, rebuild, commit, and pull on the server |
| `git pull` on the server complains about local changes | Something was edited or built on the server; `git status`, then `git checkout -- <file>` (the server should have no local changes) |

## Known dependency conflict

`@fluentui/react@8.x` expects `react`/`@types/react` <19; this project uses React 19. Resolved via `.npmrc`:
```
legacy-peer-deps=true
```
so plain `npm install` works without needing `--legacy-peer-deps` manually.

## process polyfill

Some web3/crypto dependencies reference the Node `process` global, which Webpack 5 no longer polyfills automatically. Handled via `ProvidePlugin` in `webpack.config.js`:

```js
new webpack.ProvidePlugin({
  Buffer: ["buffer", "Buffer"],
  process: "process/browser",
}),
```
