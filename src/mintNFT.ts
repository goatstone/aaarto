import config from "config";
import { ethers, TransactionReceipt, TransactionResponse } from "ethers";
const errorMessages = {
  notInstalled: "MetaMask is not installed. Please install it to use this app.",
  accountAccess: "Connect MetaMask account with this site.",
  attemptAdd: `Attempting to add the ${config.chainNameDisplay} chain.`,
  attemptSwitch: `Attempting to switch to the ${config.chainNameDisplay} chain.`,
  general: "An error occurred during minting.",
  userCancel: "The request has been cancelled.",
};
// Aaarto contract address
const contractAddress = config.contractAddress;
// Set the platform fee in ether
const platformFee = ethers.parseEther(config.platformFee);

const mintNFT = async (ipfsTokenURI: string) => {
  try {
//      setLoading(true);
    // // Check if MetaMask is available
    // if (typeof window.ethereum === "undefined") {
    //   throw new Error(errorMessages.notInstalled);
    // }
    // Request account access if needed
    // TODO check if account access exists before requesting, set error
//    setError(errorMessages.accountAccess);
    // const userAccount = await window.ethereum.request({
    //   method: "eth_requestAccounts",
    // });
    //setAccount(userAccount);
  //  setError("");
    // Create a provider and signer from MetaMask
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    // Get the network the user is connected to
    const { chainId } = await provider.getNetwork();
    // Ensure the user is connected to correct chain
    if (chainId !== config.chainIDBigInt) {
      try {
//        setError(errorMessages.attemptSwitch);
        // attempt switch to correct chain
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: config.chainIDHex }],
        });
  //      setError("");
      } catch (e: unknown) {
    //    setError(errorMessages.attemptAdd);
        // This error code 4902 indicates that the requested chain
        // has not been switched in MetaMask therefore call wallet_addEthereumChain
        if (e instanceof Error && "code" in e && e.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: config.ethRequestParams,
          });
      //    setError("");
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
    const txResponse: TransactionResponse =
      await AaartoNFTContract.preSafeMint(userAddress, ipfsTokenURI, {
        value: platformFee, // Set msg.value(in contract) to the platform fee
      });
    //setTransactionHash(txResponse.hash);
    // Wait for the transaction to be mined
    const receipt = await txResponse.wait();
    //setTransactionReceipt(receipt);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.includes("user rejected action")
    ) {
      //setError(errorMessages.userCancel);
    } else {
      //setError(errorMessages.general);
    }
  } finally {
    //setLoading(false);
  }
};

export default mintNFT;
