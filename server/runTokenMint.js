import { Client, AccountId, PrivateKey } from "@hashgraph/sdk";
import dotenv from "dotenv";
import tokenMint from "#root/server/tokenMint.js";

dotenv.config();
const ID = {
  operatorId: AccountId.fromString(process.env.OPERATOR_ID),
  operatorKey: PrivateKey.fromStringDer(process.env.OPERATOR_PVKEY),
  treasuryId: AccountId.fromString(process.env.OPERATOR_ID),
  treasuryKey: PrivateKey.fromStringDer(process.env.OPERATOR_PVKEY),
};
const client = Client.forTestnet().setOperator(ID.operatorId, ID.operatorKey);
const supplyKey = PrivateKey.generate();
const CID = [
  Buffer.from(
    "ipfs://bafyreiao6ajgsfji6qsgbqwdtjdu5gmul7tv2v3pd6kjgcw5o65b2ogst4/metadata.json"
  ),
];
const tokenId = "0.0.4673245";
tokenMint(client, tokenId, CID, supplyKey).then((response) =>
  console.log(`tokenMint: ${response} ${new Date()}`)
);
