import { ethers } from "ethers";

const mockPreSafeMint = jest.fn();
const mockContractCtor = jest.fn();

// Replace only the provider and contract; everything else (parseEther,
// Interface, ...) stays real.
jest.mock("ethers", () => {
  const actual = jest.requireActual("ethers");
  return {
    ...actual,
    ethers: {
      ...actual.ethers,
      BrowserProvider: jest.fn().mockImplementation(() => ({
        getNetwork: async () => ({ chainId: BigInt(process.env.mockChainId!) }),
        getSigner: async () => ({}),
      })),
      Contract: jest.fn().mockImplementation((...args: any[]) => {
        mockContractCtor(...args);
        return {
          preSafeMint: mockPreSafeMint,
          interface: new actual.ethers.Interface([]),
        };
      }),
    },
  };
});

const account = "0x36708B00D26Da1a6068577cD009732b79926AaCd";
const uri = "ipfs://bafkreiabc";

// Fresh copy of mintNFT and config, built with the given .env fee.
const load = (platformFee: string) => {
  process.env.platformFee = platformFee;
  let mod: any;
  jest.isolateModules(() => {
    mod = {
      mintNFT: require("../src/mintNFT").mintNFT,
      config: require("../src/config").default,
    };
  });
  process.env.platformFee = "0.001";
  return mod;
};

const walletOnChain = (chainIDHex: string) => ({
  request: jest.fn(async ({ method }: { method: string }) => {
    if (method === "eth_chainId") return chainIDHex;
    throw new Error(`unexpected request: ${method}`);
  }),
});

beforeEach(() => {
  mockPreSafeMint.mockReset();
  mockContractCtor.mockReset();
  mockPreSafeMint.mockResolvedValue({
    wait: async () => ({ hash: "0xabc", logs: [] }),
  });
});

describe("mintNFT value handling", () => {
  test.each(["0.001", "0.25", "1.5"])(
    "sends exactly the .env fee (%s) as the transaction value",
    async (fee) => {
      const { mintNFT, config } = load(fee);
      process.env.mockChainId = String(config.chainIDBigInt);
      await mintNFT(walletOnChain(config.chainIDHex), account, uri);

      expect(mockPreSafeMint).toHaveBeenCalledTimes(1);
      const [to, tokenURI, overrides] = mockPreSafeMint.mock.calls[0];
      expect(to).toBe(account);
      expect(tokenURI).toBe(uri);
      expect(overrides.value).toBe(ethers.parseEther(fee));
    },
  );

  test("does not set an explicit gasLimit", async () => {
    const { mintNFT, config } = load("0.001");
    process.env.mockChainId = String(config.chainIDBigInt);
    await mintNFT(walletOnChain(config.chainIDHex), account, uri);

    const overrides = mockPreSafeMint.mock.calls[0][2];
    expect(Object.keys(overrides)).toEqual(["value"]);
  });

  test("sends nothing when the wallet is on the wrong chain", async () => {
    const { mintNFT, config } = load("0.001");
    process.env.mockChainId = "1";
    const wallet = {
      request: jest.fn(async ({ method }: { method: string }) => {
        if (method === "eth_chainId") return config.chainIDHex;
        throw new Error(`unexpected request: ${method}`);
      }),
    };
    await expect(mintNFT(wallet, account, uri)).rejects.toThrow(
      /Wallet is on chain 1/,
    );
    expect(mockPreSafeMint).not.toHaveBeenCalled();
  });
});
