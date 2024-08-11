import { Client, AccountId, PrivateKey } from "@hashgraph/sdk";
import dotenv from "dotenv";
import tokenCreate from '#root/server/tokenCreate.js';

dotenv.config();
const ID = {
  operatorId: AccountId.fromString(process.env.OPERATOR_ID),
  operatorKey: PrivateKey.fromStringDer(process.env.OPERATOR_PVKEY),
  treasuryId: AccountId.fromString(process.env.OPERATOR_ID),
  treasuryKey: PrivateKey.fromStringDer(process.env.OPERATOR_PVKEY),
};
const client = Client.forTestnet().setOperator(ID.operatorId, ID.operatorKey);
const supplyKey = PrivateKey.generate();
const TOKEN_NAME = "GOATSONE-ART";
const TOKEN_SYMBOL = "GOATSTONE_A";
tokenCreate(TOKEN_NAME, TOKEN_SYMBOL, client, ID, supplyKey).then((r) =>
  console.log(`tokentID: ${r} ${new Date()}`)
);
