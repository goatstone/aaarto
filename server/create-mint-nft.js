require("dotenv").config();
const {
  Client,
  AccountId,
  PrivateKey,
  TokenType,
  TokenSupplyType,
  TokenCreateTransaction,
} = require("@hashgraph/sdk");

// Configure accounts and client, and generate needed keys
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromStringDer(process.env.OPERATOR_PVKEY);
const treasuryId = AccountId.fromString(process.env.OPERATOR_ID);
const treasuryKey = PrivateKey.fromStringDer(process.env.OPERATOR_PVKEY);
const client = Client.forTestnet().setOperator(operatorId, operatorKey);
const supplyKey = PrivateKey.generate();

async function createMintNFT(tokenName, tokenSymbol) {
  const nftCreate = await new TokenCreateTransaction()
    .setTokenName(tokenName)
    .setTokenSymbol(tokenSymbol)
    .setTokenType(TokenType.NonFungibleUnique)
    .setDecimals(0)
    .setInitialSupply(0)
    .setTreasuryAccountId(treasuryId)
    .setSupplyType(TokenSupplyType.Finite)
    .setMaxSupply(250)
    .setSupplyKey(supplyKey)
    .freezeWith(client);
  //Sign the transaction with the treasury key
  const nftCreateTxSign = await nftCreate.sign(treasuryKey);
  //Submit the transaction to a Hedera network
  const nftCreateSubmit = await nftCreateTxSign.execute(client);
  //Get the transaction receipt
  const nftCreateRx = await nftCreateSubmit.getReceipt(client);
  //Get the token ID
  const tokenId = nftCreateRx.tokenId;
  //Log the token ID
  return tokenId;
}
createMintNFT('Goatstone','GOATSTONE').then((r)=>console.log(`tokentID: ${r} ${new Date()}`))
