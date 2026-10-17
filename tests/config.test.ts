const loadConfig = (network: string, platformFee = "0.001") => {
  const previous = process.env.network;
  const previousFee = process.env.platformFee;
  process.env.network = network;
  if (platformFee === undefined) delete process.env.platformFee;
  else process.env.platformFee = platformFee;
  let config: any;
  jest.isolateModules(() => {
    config = require("../src/config").default;
  });
  process.env.network = previous;
  process.env.platformFee = previousFee;
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

test("platformFee comes from the env", () => {
  expect(loadConfig("sepolia", "0.25").platformFee).toBe("0.25");
});

test.each(["", "abc", "0", "-1", "0.0000000000000000001", "1e3"])(
  "an invalid platformFee (%p) is rejected",
  (fee) => {
    expect(() => loadConfig("sepolia", fee)).toThrow();
  },
);
