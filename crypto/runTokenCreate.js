import { PrivateKey } from "@hashgraph/sdk";
import tokenCreate from "#root/crypto/tokenCreate.js";
import getClient from "#root/crypto/util/getClient.js";
import getID from "#root/crypto/util/getID.js";
import { argv } from "node:process";

if (!argv[2] || !argv[3]) {
  throw "Supply name and symbol";
}
const TOKEN_NAME = argv[2];
const TOKEN_SYMBOL = argv[3];
const supplyKey = PrivateKey.generate();
const ID = getID();
const client = await getClient(ID.operatorId, ID.operatorKey);
console.log(client)
tokenCreate(TOKEN_NAME, TOKEN_SYMBOL, client, getID(), supplyKey).then((r) =>
  console.log(`tokentID: ${r} ${new Date()}`)
);
