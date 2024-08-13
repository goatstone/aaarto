import { PrivateKey } from "@hashgraph/sdk";
import tokenMint from "#root/server/tokenMint.js";
import getClient from "#root/server/getClient.js";
import getID from "#root/server/getID.js";

const ID = getID();
const client = getClient(ID.operatorId, ID.operatorKey);
const CID = [
  Buffer.from(
    "ipfs://bafybeifyhag6extnpezndrkx25yg5zmy3ybj4hoseyug7tdqu2o5fggxwe/metadata.json"
  ),
];
const tokenId = "0.0.4678180";
const supplyKey = PrivateKey.fromStringED25519("302e020100300506032b657004220420a3e3c2e2c0e7f1ddd4068028df3a8d5a52ef7f66ae44aa78e82c2b116ad2272f");
console.log("ss", supplyKey);
tokenMint(client, tokenId, CID, supplyKey).then((response) => {
  console.log(`tokenMint: ${new Date()}`, response.serials, response.tokenId);
});
