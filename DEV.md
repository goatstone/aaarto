# Development Notes

## Environment variables

All config lives in a single `.env` file at the project root (git-ignored). Copy `.env.example` to `.env` and fill in real values before running the project.

```
network=sepolia   # or "polygon" for mainnet

```

- `dotenv` loads `.env` in `webpack.config.js` (Node context, runs at build time).
- `DefinePlugin` inlines each `process.env.X` reference as a literal string in the bundle — every key used in app code must be listed explicitly in `webpack.config.js`, since it's doing string substitution per key, not exposing all of `process.env`.
- **Never** `require('dotenv')` or reference raw `process.env.X` outside `webpack.config.js` and `src/config.ts`. `dotenv` depends on Node's `path` module, which isn't available in the browser — importing it into app code breaks the bundle. App code should only ever import from `src/config.ts`.

## Switching networks

Edit `network=` in `.env` (`sepolia` or `polygon`), then **restart `webpack serve`**. `DefinePlugin` bakes values in at build start, so a running dev server won't pick up the change until it's stopped and rerun.

`src/config.ts` branches on `network` to select the active RPC URL, contract address, and chain ID, and throws at startup if `network` is missing or unrecognized (fail loudly rather than silently running against `undefined`).

**Care when using `polygon` (mainnet):** this points at the live contract, not testnet. Double-check `.env` before running if you're not sure which network is currently set — a leftover `network=polygon` from a previous session is the most likely way to accidentally interact with mainnet during testing.

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
