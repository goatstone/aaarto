import contractArtifactSepolia from "../artifacts/contracts/AaartoNFTV4.sol/AaartoNFTV4.json";

/**
 * config: if there is a window.env
 * get values from it, otherwise use default values
 */
export type WindowEnv = { platformFee: string; network: string };

let config: any;
// TODO test only, remove the next line for production
const windowEnv: WindowEnv = { network: "sepolia", platformFee: "0.002" };
window.env = windowEnv;
// set default values
let platformFee = "0.001";
let network = "sepolia";
let chainName = "Sepolia Ether";
if (window.env) {
  platformFee = window.env.platformFee;
  network = window.env.network;
  chainName = network === "sepolia" ? "Sepolia Ether" : "Polygon";
}
if (network === "sepolia") {
  config = {
    chainNameDisplay: chainName,
    contractArtifact: contractArtifactSepolia,
    platformFee,
    contractAddress: "0x92128cD1BCA8cc406d2223Dcf1558E4d926Dd68f",
    chainIDBigInt: 1155111n,
    chainIDHex: "0xaa36a7",
    ethRequestParams: [
      {
        chainId: "0xaa36a7",
        chainName,
        rpcUrls: ["https://rpc.sepolia.org"],
        nativeCurrency: {
          name: chainName,
          symbol: "SEP",
          decimals: 18,
        },
        blockExplorerUrls: ["https://sepolia.etherscan.io"],
      },
    ],
  };
}

export default config;
