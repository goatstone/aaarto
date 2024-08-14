import { PrivateKey } from "@hashgraph/sdk";
import tokenCreate from "#root/crypto/tokenCreate.js";
import getClient from "#root/crypto/util/getClient.js";
import getID from "#root/crypto/util/getID.js";

const TOKEN_NAME = "GOATSONE xyz";
const TOKEN_SYMBOL = "GOATSTONE_XYZ";
const supplyKey = PrivateKey.generate();
const ID = getID()
const client = getClient(ID.operatorId, ID.operatorKey)

tokenCreate(TOKEN_NAME, TOKEN_SYMBOL, client, getID(), supplyKey).then(
  (r) => console.log(`tokentID: ${r} ${new Date()}`)
);
