import { PrivateKey } from "@hashgraph/sdk";
import pinFileToIPFS from "./pinFileToIPFS.js";
import getPinataJWT from "./util/getPinataJWT.js";
import tokenMint from "#root/crypto/tokenMint.js";
import getClient from "#root/crypto/util/getClient.js";
import getID from "#root/crypto/util/getID.js";

const ID = getID();
const client = getClient(ID.operatorId, ID.operatorKey);
// An NFT token called Goatstone
const tokenId = "0.0.4678180";
// supply key from above token
const supplyKey = PrivateKey.fromStringED25519("302e020100300506032b657004220420a3e3c2e2c0e7f1ddd4068028df3a8d5a52ef7f66ae44aa78e82c2b116ad2272f");

let cid='';
  // Upload a JSON metadata file to Pinata IPFS
  const metaData = {
    name: "Aaarto",
    description: "Aaarto is Art",
    image:
      `ipfs://${cid}/aaarto.svg`,
  };
/**
 * Take a string of art and mint it
 */
const mintArt = async (art) => {

  // Pin the art
  const response = await pinFileToIPFS(
    art,
    getPinataJWT(),
    "aaarto.svg",
    "image/svg+xml"
  );
  // Pin the JSON
  cid = response.cid;//TODO check the object  
  const response2= await pinFileToIPFS(
    JSON.stringify(metaData, null, 2),
    getPinataJWT(),
    "metadata.json",
    "applicaton/json"
  )

  // Mint the NFT
  const CID = [
    Buffer.from(
      `ipfs://${response2.cid}/metadata.json`
    ),
  ];
    tokenMint(client, tokenId, CID, supplyKey).then((response) => {
    console.log(`tokenMint: ${new Date()}`, response.serials, response.tokenId);
  });
  
  return response2;
};

export default mintArt;
