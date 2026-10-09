const loadConfig = (network: string) => {
  const previous = process.env.network;
  process.env.network = network;
  let config: any;
  jest.isolateModules(() => {
    config = require("../src/config").default;
  });
  process.env.network = previous;
  return config;
};

describe.each([
  ["sepolia", 11155111n],
  ["polygon", 137n],
])("config for %s", (network, chainId) => {
  const config = loadConfig(network);

  test("chainIDBigInt is the real chain ID and matches the hex values", () => {
    expect(config.chainIDBigInt).toBe(chainId);
    expect(BigInt(config.chainIDHex)).toBe(chainId);
    expect(BigInt(config.ethRequestParams[0].chainId)).toBe(chainId);
  });

  test("has a contract address and https RPC URLs for adding the chain", () => {
    expect(config.contractAddress).toMatch(/^0x[0-9a-fA-F]{40}$/);
    const { rpcUrls } = config.ethRequestParams[0];
    expect(rpcUrls.length).toBeGreaterThan(0);
    rpcUrls.forEach((url: string) => expect(url).toMatch(/^https:\/\//));
  });
});

test("an unknown network is rejected", () => {
  expect(() => loadConfig("amoy")).toThrow();
});
