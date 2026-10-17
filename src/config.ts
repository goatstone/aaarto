import contractArtifactSepolia from "../artifacts/contracts/AaartoNFTV4.sol/AaartoNFTV4.json";

type Network = "sepolia" | "polygon";
let config: any;
let network: Network = process.env.network as Network;
if (network === "sepolia") {
  config = {
    chainNameDisplay: "Sepolia Ether",
    contractArtifact: contractArtifactSepolia,
    contractAddress: "0x92128cD1BCA8cc406d2223Dcf1558E4d926Dd68f",
    chainIDHex: "0xaa36a7",
    ethRequestParams: [
      {
        chainId: "0xaa36a7",
        chainName:"Sepolia Ether",
        rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
        nativeCurrency: {
          name: "SEP",
          symbol: "SEP",
          decimals: 18,
        },
        blockExplorerUrls: ["https://sepolia.etherscan.io"],
      },
    ],
  };
} else if (network === "polygon") {
  config = {
    chainNameDisplay: "Polygon Mainnet",
    contractArtifact: contractArtifactSepolia,
    contractAddress: "0x03a9423E9Aac42E9F991D292F8e074808D9ABE7f",
    chainIDHex: "0x89",
    ethRequestParams: [
      {
        chainId: "0x89",
        chainName: "Polygon Mainnet",
        rpcUrls: [
          "https://polygon-bor-rpc.publicnode.com",
          "https://polygon.drpc.org",
        ],
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        },
        blockExplorerUrls: ["https://polygonscan.com/"],
      },
    ],
    // Item page is <itemUrlBase><lowercase contract>:<tokenId>; Rarible 404s a
    // checksummed address. Sepolia has no marketplace, so it has no entry.
    marketplace: {
      name: "Rarible",
      itemUrlBase: "https://rarible.com/token/polygon/",
    },
  };
} else {
  throw "Chain config does not exist";
}
config.chainIDBigInt = BigInt(config.chainIDHex);
// The exact amount sent with each mint, set in the root .env (in ETH, e.g.
// "0.001"). It must be at or above the contract's platformFee() or the mint
// reverts; going above it raises the fee without changing the contract.
const platformFee: string | undefined = process.env.platformFee;
if (!platformFee || !/^\d+(\.\d{1,18})?$/.test(platformFee) || Number(platformFee) <= 0) {
  throw "platformFee is missing or invalid in .env";
}
config.platformFee = platformFee;
// Public gateways such as ipfs.io refuse plain requests now; Pinata serves the
// files this app pins.
config.ipfsGateway = "https://gateway.pinata.cloud/ipfs/";
export default config;
