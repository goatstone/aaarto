import { PrivateKey } from "@hashgraph/sdk";
import tokenMint from "#root/server/tokenMint.js";
import getClient from "#root/server/getClient.js";
import getID from "#root/server/getID.js";

const ID = getID();
const client = getClient(ID.operatorId, ID.operatorKey);
// const supplyKey = PrivateKey.generate();
const CID = [
  Buffer.from(
    "ipfs://bafyreiao6ajgsfji6qsgbqwdtjdu5gmul7tv2v3pd6kjgcw5o65b2ogst4/metadata.json"
  ),
];
const tokenId = "0.0.4677756";
const sk = '0xc00598834bebf0818badc584951abc69174ca44f411cc22bade93a48cfa8131d'
const supplyKey= PrivateKey.fromStringED25519(sk)
tokenMint(client, tokenId, CID, supplyKey).then((response) =>
  console.log(`tokenMint: ${response} ${new Date()}`)
);
