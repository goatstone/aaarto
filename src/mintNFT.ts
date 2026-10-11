import { ethers } from "ethers";
import config from "./config";

const contractAddress = config.contractAddress;
// The fee from .env, sent as-is. It must be >= the contract's platformFee().
const platformFee = ethers.parseEther(config.platformFee);

export type MintResult = {
  hash: string;
  // null if the receipt had no readable Mint/Transfer log
  tokenId: string | null;
};

// The contract emits Mint(to, tokenID, tokenURI) and an ERC-721 Transfer from
// the zero address; either carries the new token's ID.
export const getMintedTokenId = (
  logs: ReadonlyArray<{ address: string; topics: ReadonlyArray<string>; data: string }>,
  iface: ethers.Interface,
): string | null => {
  for (const log of logs) {
    if (log.address.toLowerCase() !== contractAddress.toLowerCase()) continue;
    let parsed: ethers.LogDescription | null = null;
    try {
      parsed = iface.parseLog({ topics: [...log.topics], data: log.data });
    } catch {
      continue;
    }
    if (parsed?.name === "Mint") return parsed.args.tokenID.toString();
    if (parsed?.name === "Transfer" && parsed.args.from === ethers.ZeroAddress) {
      return parsed.args.tokenId.toString();
    }
  }
  return null;
};

export const mintNFT = async (
  ethereum: any,
  account: string,
  ipfsTokenURI: string
): Promise<MintResult> => {
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

  // A wallet can resolve the switch request without actually moving chains,
  // so confirm before sending a transaction that pays the fee.
  const { chainId } = await provider.getNetwork();
  if (chainId !== config.chainIDBigInt) {
    throw new Error(
      `Wallet is on chain ${chainId}, expected ${config.chainIDBigInt}. Switch networks and try again.`
    );
  }

  const signer = await provider.getSigner();

  const AaartoNFTContract = new ethers.Contract(
    contractAddress,
    config.contractArtifact.abi,
    signer
  );

  // No explicit gasLimit: ethers estimates it when sending.
  const txResponse = await AaartoNFTContract.preSafeMint(
    account,
    ipfsTokenURI,
    { value: platformFee }
  );

  const receipt = await txResponse.wait();
  if (!receipt?.hash) throw new Error("Transaction failed");
  return {
    hash: receipt.hash,
    tokenId: getMintedTokenId(receipt.logs, AaartoNFTContract.interface),
  };
};
