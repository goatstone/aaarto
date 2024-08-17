import pinFileToIPFS from "./pinFileToIPFS.js";
import getPinataJWT from "./util/getPinataJWT.js";
import tokenMint from "#root/crypto/tokenMint.js";
import getClient from "#root/crypto/util/getClient.js";
import getID from "#root/crypto/util/getID.js";
import getMetaData from "#root/crypto/util/getMetaData.js";
import getConfig from "#root/crypto/util/getConfig.js";

/**
 * Take a string of art and mint it
 */
const mintArt = async (art) => {
  const ID = getID();
  const client = await getClient(ID.operatorId, ID.operatorKey);
  const { tokenId, supplyKeyStringED25519 } = getConfig();
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
  const ipfs_address = pinDataResponse.IpfsHash;
  const mintResponse = await tokenMint(
    client,
    tokenId,
    ipfs_address,
    supplyKeyStringED25519
  );

  return { pinImageResponse, pinDataResponse, mintResponse };
};

export default mintArt;
