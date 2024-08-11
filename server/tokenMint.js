import { Hbar, TokenMintTransaction } from "@hashgraph/sdk";

/**
 * Mint tokens on the Hedera network
 * @param {HederaClient} client
 * @param {NFT Token ID} tokenId
 * @param {Array} CID
 * @param {string} supplyKey
 * @returns
 */
async function tokenMint(client, tokenId, CID, supplyKey) {
  const maxTransactionFee = new Hbar(20);
  const mintTx = new TokenMintTransaction()
    .setTokenId(tokenId)
    .setMetadata(CID) //Batch minting - UP TO 10 NFTs in single tx
    .setMaxTransactionFee(maxTransactionFee)
    .freezeWith(client);
  const mintTxSign = await mintTx.sign(supplyKey);
  const mintTxSubmit = await mintTxSign.execute(client);
  const mintRx = await mintTxSubmit.getReceipt(client);

  return { tokenId, serials: mintRx.serials };
}

export default tokenMint;
