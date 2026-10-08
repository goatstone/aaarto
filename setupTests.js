// setupTests.js
require('@testing-library/jest-dom');

// src/config.ts throws at import if `network` is unset. webpack's DefinePlugin
// supplies it for builds, but Jest doesn't use webpack. Always use the testnet.
process.env.network = 'sepolia';