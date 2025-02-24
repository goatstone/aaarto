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
if (window.env) {
  platformFee = window.env.platformFee;
  network = window.env.network;
}
if (network === "sepolia") {
  console.log(window.env.network);
  config = {
    contractArtifact: contractArtifactSepolia,
    platformFee,
    contractAddress: "0x92128cD1BCA8cc406d2223Dcf1558E4d926Dd68f",
    chainIDHex: "0xaa36a7",
    chainName: "Sepolia Testnet",
    rpcUrls: ["https://rpc.sepolia.org"],
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "SEP",
      decimals: 18,
    },
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
  };
}

export default config;
