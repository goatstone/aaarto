import tokenMint from "#root/crypto/tokenMint.js";
import getClient from "#root/crypto/util/getClient.js";
import getID from "#root/crypto/util/getID.js";
import getConfig from "#root/crypto/util/getConfig.js";
import { argv } from "node:process";

if (!argv[2]) throw "Supply ipfs_address";
const ipfs_address = argv[2];
const ID = getID();
const client = await getClient(ID.operatorId, ID.operatorKey);
const { tokenId, supplyKeyStringED25519 } = getConfig();
const response = await tokenMint(
  client,
  tokenId,
  ipfs_address,
  supplyKeyStringED25519
);
console.log(`tokenMint: ${new Date()}`, response.serials, response.tokenId);
