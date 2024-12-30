import {
  TokenType,
  TokenSupplyType,
  TokenCreateTransaction,
} from "@hashgraph/sdk";
/**
 * Create a Hedera Token
 * @param {string} tokenName
 * @param {string} tokenSymbol
 * @param {HederaClient} client
 * @param {object} ID
 * @param {string} supplyKey
 * @returns
 */
async function tokenCreate(tokenName, tokenSymbol, client, ID, supplyKey) {
  const nftCreate = await new TokenCreateTransaction()
    .setTokenName(tokenName)
    .setTokenSymbol(tokenSymbol)
    .setTokenType(TokenType.NonFungibleUnique)
    .setDecimals(0)
    .setInitialSupply(0)
    .setTreasuryAccountId(ID.treasuryId)
    .setSupplyType(TokenSupplyType.Finite)
    .setMaxSupply(250)
    .setSupplyKey(supplyKey)
    .freezeWith(client);
  const nftCreateTxSign = await nftCreate.sign(ID.treasuryKey);
  const nftCreateSubmit = await nftCreateTxSign.execute(client);
  const nftCreateRx = await nftCreateSubmit.getReceipt(client);

  return [nftCreateRx.tokenId, supplyKey];
}

export default tokenCreate;
