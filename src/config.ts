import contractArtifactSepolia from "../artifacts/contracts/AaartoNFTV4.sol/AaartoNFTV4.json";

type Network = "sepolia" | "polygon" | "amoy";
let config: any;
let network: Network = process.env.network as Network;
if (network === "sepolia") {
  config = {
    chainNameDisplay: "Sepolia Ether",
    contractArtifact: contractArtifactSepolia,
    platformFee: "0.001",
    contractAddress: "0x92128cD1BCA8cc406d2223Dcf1558E4d926Dd68f",
    chainIDBigInt: 1155111n,
    chainIDHex: "0xaa36a7",
    ethRequestParams: [
      {
        chainId: "0xaa36a7",
        chainName:"Sepolia Ether",
        rpcUrls: ["https://rpc.sepolia.org"],
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
    chainIDBigInt: 137n,
    chainIDHex: "0x89",
    ethRequestParams: [
      {
        chainId: "0x89",
        chainName: "Polygon Mainnet",
        rpcUrls: ["https://polygon-rpc.com/"],
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        },
        blockExplorerUrls: ["https://polygonscan.com/"],
      },
    ],
  };
} else if (network === "amoy") {
  config = {
    chainNameDisplay: "Polygon Amoy Testnet",
    contractArtifact: contractArtifactSepolia,
    platformFee: "0.001",
    contractAddress: "0xXXX",
    chainIDBigInt: 80002n,
    chainIDHex: "0x13882",
    ethRequestParams: [
      {
        chainId: "0x13882",
        chainName: "Polygon Amoy Testnet",
        rpcUrls: ["https://rpc-amoy.polygon.technology/"],
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        },
        blockExplorerUrls: ["https://amoy.polygonscan.com/"],
      },
    ],
  };
} else {
  throw "Chain config does not exist";
}
export default config;
