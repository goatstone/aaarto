# Debug Query Strings

The site reads an `env` query string from the URL when the page loads. It controls whether the mint button is enabled and whether the art is uploaded to IPFS.

| URL | Mint button | IPFS upload | Use it for |
|---|---|---|---|
| `/` (no query string) | **Disabled** | n/a | The default for visitors |
| `/?env=dev` | Enabled | **Skipped** | Testing the wallet and mint flow without pinning to Pinata |
| `/?env=full` | Enabled | Enabled | The complete flow: upload to IPFS, then mint |

Any other value (`?env=banana`) or a missing `env` is treated as no query string: the mint button stays disabled.

Examples:

```
http://localhost:9000/?env=dev
http://localhost:9000/?env=full
https://aaarto.art/?env=dev
```

The flags are read once, at page load. Change the URL and reload the page to switch modes.

## What `?env=dev` does

With the upload skipped, `uploadData` is never called, so nothing is sent to `/server` and nothing is pinned to Pinata. The wallet connection and the mint transaction still run. Because there is no metadata to point to, the token URI is a fixed placeholder:

```
ipfs://bafybeiczsscdsbs7ffqz55asqdf3smv6klcw3gofszvwlyarci47bgf354
```

That is the well-known empty-directory CID, so it resolves on gateways. It does not contain the art, title, description or artist.

## Warnings

- **The mint is real.** `?env=dev` skips IPFS only; the transaction is still sent to whichever network the build was made for. On `network=polygon` that spends real MATIC, and the token that is minted has the placeholder URI **permanently**. Use `?env=dev` on a `network=sepolia` build. See [DEV.md](DEV.md) for switching networks.
- **This is not access control.** The query string only changes the UI. Anyone can add `?env=full` to the URL and mint, and anyone can call `POST /server` directly. If minting must be restricted, that has to be enforced in the contract and on the backend.
- **Links can be shared.** A `?env=full` link works for anyone who opens it. Don't post one publicly unless minting is meant to be open.
- **The flags are in the production bundle.** They are not stripped from the build that is committed and deployed to aaarto.art, so they also work there.

## Checking that a mode works

1. Open the URL for the mode and reload.
2. **No query string:** the mint button is disabled and reads "Minting is not available yet".
3. **`?env=dev`:**
   - The button is enabled.
   - Click it. The wallet prompt appears, and the request list in the browser's Network tab shows **no** request to `/server`.
   - After a successful mint, the token URI on the block explorer is the placeholder `ipfs://bafybei…f354` above.
4. **`?env=full`:**
   - The button is enabled.
   - The Network tab shows a `POST /server` that returns `{ "ipfsHashMD": "..." }`, and the token URI on-chain is `ipfs://<that CID>`.
   - See "Data returned from an upload (IPFS)" in [DEV.md](DEV.md) for how to check the pinned data.

## Where it is in the code

| File | What it does |
|---|---|
| [src/featureFlags.ts](src/featureFlags.ts) | Parses `?env=` into `{ mintEnabled, ipfsUploadEnabled }`, and defines the placeholder CID |
| [src/components/App.tsx](src/components/App.tsx) | Reads the flags once, skips `uploadData` when the upload is disabled, and ignores mint clicks when minting is disabled |
| [src/components/MintControl.tsx](src/components/MintControl.tsx) | Disables the button (`mintEnabled` prop) |
| [tests/featureFlags.test.ts](tests/featureFlags.test.ts) | Tests for the query string parsing |

To add another mode or rename a value, change `ENV_DEV`, `ENV_FULL` and `getFeatureFlags` in `src/featureFlags.ts`.
