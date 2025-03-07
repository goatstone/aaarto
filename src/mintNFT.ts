import config from "./config";
import { ethers, TransactionReceipt, TransactionResponse } from "ethers";
const errorMessages = {
  notInstalled: "MetaMask is not installed. Please install it to use this app.",
  accountAccess: "Connect MetaMask account with this site.",
  attemptAdd: `Attempting to add the ${config.chainNameDisplay} chain.`,
  attemptSwitch: `Attempting to switch to the ${config.chainNameDisplay} chain.`,
  general: "An error occurred during minting.",
  userCancel: "The request has been cancelled.",
  alreadyProcessing:
    "MetaMask is processing a request, try opening opening MetaMask",
};
// Aaarto contract address
const contractAddress = config.contractAddress;
// Set the platform fee in ether
const platformFee = ethers.parseEther(config.platformFee);

const mintNFT = async (ipfsTokenURI: string): Promise<string | undefined> => {
  try {
    // Create a provider and signer from MetaMask
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    // Get the network the user is connected to
    const { chainId } = await provider.getNetwork();
    // Ensure the user is connected to correct chain
    if (chainId !== config.chainIDBigInt) {
      try {
        // attempt switch to correct chain
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: config.chainIDHex }],
        });
      } catch (e: unknown) {
        // This error code 4902 indicates that the requested chain
        // has not been switched in MetaMask therefore call wallet_addEthereumChain
        if (e instanceof Error && "code" in e && e.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: config.ethRequestParams,
          });
        }
      }
    }
    // Create an instance of the contract
    const AaartoNFTContract = new ethers.Contract(
      contractAddress,
      config.contractArtifact.abi,
      signer
    );
    // Get the signers' address
    const userAddress = await signer.getAddress();
    // Call the contracts' preSafeMint function
    const txResponse: TransactionResponse = await AaartoNFTContract.preSafeMint(
      userAddress,
      ipfsTokenURI,
      {
        value: platformFee, // Set msg.value(in contract) to the platform fee
      }
    );
    // Wait for the transaction to be mined
    const receipt = await txResponse.wait();
    if (!receipt?.hash) {
      throw new Error("Transaction has not been successful");
    }
    return receipt.hash;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("user rejected action")) {
        throw new Error(errorMessages.userCancel);
      }
      if (error.message.includes("successful")) {
        throw error;
      } else {
        throw new Error(errorMessages.general);
      }
    }
  }
};

export default mintNFT;
