import { ethers } from "ethers";
import config from "./config";

const contractAddress = config.contractAddress;
const platformFee = ethers.parseEther(config.platformFee);

export const mintNFT = async (
  ethereum: any,
  account: string,
  ipfsTokenURI: string
): Promise<string> => {
  const currentChainId = BigInt(await ethereum.request({ method: "eth_chainId" }));
  if (currentChainId !== config.chainIDBigInt) {
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: config.chainIDHex }],
      });
    } catch (e: any) {
      // Only an unknown chain is recoverable by adding it; anything else, such
      // as a rejected prompt, must stop the mint instead of sending the
      // transaction on the wrong chain. Rabby reports an unknown chain as
      // -32603 "Unrecognized chain ID" rather than the standard 4902.
      const unknownChain =
        e.code === 4902 || /unrecognized chain/i.test(e.message ?? "");
      if (!unknownChain) throw e;
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: config.ethRequestParams,
      });
    }
  }

  // Build the provider only after the chain switch: ethers pins the network
  // at construction, so a provider made before the switch throws NETWORK_ERROR.
  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();

  const AaartoNFTContract = new ethers.Contract(
    contractAddress,
    config.contractArtifact.abi,
    signer
  );

  const gasLimit = await AaartoNFTContract.preSafeMint.estimateGas(
    account,
    ipfsTokenURI,
    { value: platformFee }
  );

  const txResponse = await AaartoNFTContract.preSafeMint(
    account,
    ipfsTokenURI,
    { value: platformFee, gasLimit }
  );

  const receipt = await txResponse.wait();
  if (!receipt?.hash) throw new Error("Transaction failed");
  return receipt.hash;
};
