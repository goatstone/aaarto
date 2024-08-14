import pinFileToIPFS from "./pinFileToIPFS.js";
import getPinataJWT from "./util/getPinataJWT.js";

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
  // Mint the NFT
  return response;
};

export default mintArt;
