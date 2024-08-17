import { Hbar, TokenMintTransaction, PrivateKey } from "@hashgraph/sdk";

/**
 * Mint tokens on the Hedera network
 * @param {HederaClient} client
 * @param {NFT Token ID} tokenId
 * @param {string} ipfs_address
 * @param {string} supplyKeyStringED25519
 * @returns
 */
async function tokenMint(
  client,
  tokenId,
  ipfs_address,
  supplyKeyStringED25519
) {
  const supplyKey = PrivateKey.fromStringED25519(supplyKeyStringED25519);
  const CID = [Buffer.from(`https://ipfs.io/ipfs/${ipfs_address}/metadata.json`)];
  const maxTransactionFee = new Hbar(20);
  const mintTx = new TokenMintTransaction()
    .setTokenId(tokenId)
    .setMetadata(CID)
    .setMaxTransactionFee(maxTransactionFee)
    .freezeWith(client);
  const mintTxSign = await mintTx.sign(supplyKey);
  const mintTxSubmit = await mintTxSign.execute(client);
  const mintRx = await mintTxSubmit.getReceipt(client);

  return { tokenId, serials: mintRx.serials };
}

export default tokenMint;
