import contractArtifactSepolia from "../artifacts/contracts/AaartoNFTV4.sol/AaartoNFTV4.json";

/**
 * config: if there is a window.env g
 * get values from it, otherwise use default values
 */
let config: any;
// if there is a window env file get the network field
// otherwise use the default network
// TODO test only, remove the next line for production
//@ts-ignore
window.env = { network: "sepolia", platformFee: "0.002" };
let platformFee = "0.001";
let network = "sepolia";
// @ts-ignore
if (window.env) {
  // @ts-ignore
  platformFee = window.env.platformFee;
  // @ts-ignore
  network = window.env.network;
}
if (network === "sepolia") {
  //@ts-ignore
  console.log(window.env.network);
  config = {
    contractArtifact:contractArtifactSepolia,
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
