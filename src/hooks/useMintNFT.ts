// hooks/useMintNFT.js
import { useState } from "react";
import { ethers, TransactionReceipt, TransactionResponse } from "ethers";
import contractArtifact from "../../artifacts/contracts/AaartoNFTV4.sol/AaartoNFTV4.json";
import config from "config";

const errorMessages = {
  notInstalled: "MetaMask is not installed. Please install it to use this app.",
  accountAccess: "Connect MetaMask account with this site.",
  networkSwitch: "Please switch to the Sepolia network.",
  general: "An error occurred during minting.",
  userCancel: "The request has been cancelled.",
};
// Aaarto contract address
// payable contract
const contractAddress = "0x92128cD1BCA8cc406d2223Dcf1558E4d926Dd68f";
const platformFee = ethers.parseEther("0.002"); // Set the platform fee in ether

const useMintNFT = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [transactionReceipt, setTransactionReceipt] =
    useState<TransactionReceipt | null>(null);
  const [errorMessage, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const mintNFT = async (ipfsTokenURI: string) => {
    try {
      setLoading(true);
      // Check if MetaMask is available
      if (typeof window.ethereum === "undefined") {
        throw new Error(errorMessages.notInstalled);
      }
      // Request account access if needed
      // TODO check if account access exists before requesting, set error
      setError(errorMessages.accountAccess);
      const userAccount = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(userAccount);
      setError("");
      // Create a provider and signer from MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      // Get the network the user is connected to
      const { chainId } = await provider.getNetwork();
      // Ensure the user is connected to Sepolia testnet (chainId 11155111)
      if (chainId !== 11155111n) {
        try {
          setError(errorMessages.networkSwitch);
          // Prompt the user to switch to Sepolia
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xaa36a7" }], // Hexadecimal chain ID of Sepolia
          });
          setError("");
        } catch (e: unknown) {
          // This error code indicates that the chain has not been added to MetaMask
          if (e instanceof Error && "code" in e && e.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0xaa36a7",
                  chainName: "Sepolia Testnet",
                  rpcUrls: ["https://rpc.sepolia.org"],
                  nativeCurrency: {
                    name: "Sepolia Ether",
                    symbol: "SEP",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://sepolia.etherscan.io"],
                },
              ],
            });
          } else {
            throw e;
          }
        }
      }
      const AaartoNFTContract = new ethers.Contract(
        contractAddress,
        contractArtifact.abi,
        signer
      );
      const userAddress = await signer.getAddress();
      // Call the contract's preSafeMint function with the platform fee
      // const txResponse = await AaartoNFTContract.preSafeMint(userAddress, ipfsTokenURI);
      const txResponse: TransactionResponse =
        await AaartoNFTContract.preSafeMint(userAddress, ipfsTokenURI, {
          value: platformFee, // Set msg.value to the platform fee
        });
      setTransactionHash(txResponse.hash);
      // Wait for the transaction to be mined
      const receipt = await txResponse.wait();
      setTransactionReceipt(receipt);
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message.includes("user rejected action")
      ) {
        setError(errorMessages.userCancel);
      } else {
        setError(errorMessages.general);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    mintNFT,
    transactionHash,
    transactionReceipt,
    errorMessage,
    loading,
    account,
  };
};

export default useMintNFT;
