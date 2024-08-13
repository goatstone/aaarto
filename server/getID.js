import { AccountId, PrivateKey } from "@hashgraph/sdk";
import dotenv from "dotenv";

dotenv.config();

/**
 * Get an object with Ids and keys
 * @returns object
 */
const getID = () => ({
  operatorId: AccountId.fromString(process.env.OPERATOR_ID),
  operatorKey: PrivateKey.fromStringDer(process.env.OPERATOR_PVKEY),
  treasuryId: AccountId.fromString(process.env.OPERATOR_ID),
  treasuryKey: PrivateKey.fromStringDer(process.env.OPERATOR_PVKEY),
});

export default getID;
