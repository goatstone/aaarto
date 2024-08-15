import { PrivateKey } from "@hashgraph/sdk";
import pinFileToIPFS from "./pinFileToIPFS.js";
import getPinataJWT from "./util/getPinataJWT.js";
import tokenMint from "#root/crypto/tokenMint.js";
import getClient from "#root/crypto/util/getClient.js";
import getID from "#root/crypto/util/getID.js";
import getMetaData from "#root/crypto/util/getMetaData.js";

const ID = getID();
const client = getClient(ID.operatorId, ID.operatorKey);
// An NFT token called Goatstone
const tokenId = "0.0.4678180";
// supply key from above token
const supplyKey = PrivateKey.fromStringED25519(
  "302e020100300506032b657004220420a3e3c2e2c0e7f1ddd4068028df3a8d5a52ef7f66ae44aa78e82c2b116ad2272f"
);
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
  const pinDataResponse = await pinFileToIPFS(
    JSON.stringify(getMetaData(pinImageResponse.IpfsHash), null, 2),
    getPinataJWT(),
    "metadata.json",
    "applicaton/json"
  );
  // Mint the NFT
  const CID = [Buffer.from(`https://ipfs.io/ipfs/${pinDataResponse.IpfsHash}/metadata.json`)];
  const mintResponse = await tokenMint(client, tokenId, CID, supplyKey);

  return { pinImageResponse, pinDataResponse, mintResponse };
};

export default mintArt;
