import { PinataSDK } from "pinata";

/**
 * Provide content and config, upload a file to IPFS
 * @param {string} content
 * @param {string} JWT
 * @param {string} fileName
 * @param {string} fileType
 * @returns
 */
async function pinFileToIPFS(content, JWT, fileName, fileType) {
  const blob = new Blob([content], {
    type: fileType,
  });
  const file = new File([blob], fileName, {
    type: fileType,
  });
  const pinata = new PinataSDK({
    pinataJwt: JWT,
  });
  try {
    const upload = await pinata.upload.fileArray([file]);

    return upload;
  } catch (error) {
    console.warn("pinFileToIPFS error: ", error);
  }
}

export default pinFileToIPFS;
