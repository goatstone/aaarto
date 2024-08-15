import { PrivateKey } from "@hashgraph/sdk";
import tokenMint from "#root/crypto/tokenMint.js";
import getClient from "#root/crypto/util/getClient.js";
import getID from "#root/crypto/util/getID.js";

const ID = getID();
const client = getClient(ID.operatorId, ID.operatorKey);
const CID = [
  Buffer.from(
    "ipfs://bafybeiafvn6xtuyqlylxe2db5erqgscawkgb5txbfovotwsmuurh6xqa3m/metadata.json"
  ),
];
const tokenId = "0.0.4678180";
const supplyKey = PrivateKey.fromStringED25519("302e020100300506032b657004220420a3e3c2e2c0e7f1ddd4068028df3a8d5a52ef7f66ae44aa78e82c2b116ad2272f");
console.log("ss", supplyKey);
tokenMint(client, tokenId, CID, supplyKey).then((response) => {
  console.log(`tokenMint: ${new Date()}`, response.serials, response.tokenId);
});
