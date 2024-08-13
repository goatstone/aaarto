import { PrivateKey } from "@hashgraph/sdk";
import tokenCreate from "#root/server/tokenCreate.js";
import getClient from "#root/server/getClient.js";
import getID from "#root/server/getID.js";

const TOKEN_NAME = "GOATSONE abc";
const TOKEN_SYMBOL = "GOATSTONE_ABC";
const supplyKey = PrivateKey.generate();
const ID = getID()
const client = getClient(ID.operatorId, ID.operatorKey)

tokenCreate(TOKEN_NAME, TOKEN_SYMBOL, client, getID(), supplyKey).then(
  (r) => console.log(`tokentID: ${r} ${new Date()}`)
);
