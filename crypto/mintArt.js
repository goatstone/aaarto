import { PrivateKey } from "@hashgraph/sdk";
import pinFileToIPFS from "./pinFileToIPFS.js";
import getPinataJWT from "./util/getPinataJWT.js";
import tokenMint from "#root/crypto/tokenMint.js";
import getClient from "#root/crypto/util/getClient.js";
import getID from "#root/crypto/util/getID.js";
import getMetaData from "#root/crypto/util/getMetaData.js";
import getConfig from "#root/crypto/util/getConfig.js";

const ID = getID();
const client = getClient(ID.operatorId, ID.operatorKey);
const { tokenId, supplyKey } = getConfig();
const sK = PrivateKey.fromStringED25519(supplyKey);
/**
 * Take a string of art and mint it
 */
const mintArt = async (art) => {
  // Pin the art
  const pinImageResponse = await pinFileToIPFS(
    art,
    getPinataJWT(),
    "aaarto.svg",
    "image/svg+xml"
  );
  // Pin the data
  // const pinDataResponse = await pinFileToIPFS(
  //   JSON.stringify(getMetaData(pinImageResponse.IpfsHash), null, 2),
  //   getPinataJWT(),
  //   "metadata.json",
  //   "applicaton/json"
  // );
  // const ipfs_address = `ipfs://${pinDataResponse.IpfsHash}/metadata.json`;
  // const mintResponse = await tokenMint(
  //   client,
  //   tokenId,
  //   ipfs_address,
  //   supplyKey
  // );

  // return { pinImageResponse, pinDataResponse, mintResponse };
  return { pinImageResponse  };
};

export default mintArt;
