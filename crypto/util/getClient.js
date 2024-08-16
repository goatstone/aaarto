import { Client } from "@hashgraph/sdk";

/**
 * Provide ID and KEY, get a Hedera Client
 * @param {string} operatorId 
 * @param {string} operatorKey 
 * @returns Client
 */
const getClient = async (operatorId, operatorKey) =>
  Client.forTestnet().setOperator(operatorId, operatorKey);

export default getClient;
