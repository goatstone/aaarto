import contractArtifactSepolia from "../artifacts/contracts/AaartoNFTV4.sol/AaartoNFTV4.json";

type Network = "sepolia" | "polygon";
let config: any;
let network: Network = process.env.network as Network;
if (network === "sepolia") {
  config = {
    chainNameDisplay: "Sepolia Ether",
    contractArtifact: contractArtifactSepolia,
    platformFee: "0.001",
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
    platformFee: "0.001",
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
  };
} else {
  throw "Chain config does not exist";
}
config.chainIDBigInt = BigInt(config.chainIDHex);
// Public gateways such as ipfs.io refuse plain requests now; Pinata serves the
// files this app pins.
config.ipfsGateway = "https://gateway.pinata.cloud/ipfs/";
export default config;
