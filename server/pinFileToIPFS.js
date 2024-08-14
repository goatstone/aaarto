import { PinataSDK } from "pinata";

async function pinFileToIPFS(files, JWT) {
  const pinata = new PinataSDK({
    pinataJwt: JWT,
  });
  try {
    const upload = await pinata.upload.fileArray(files);

    return upload;
  } catch (error) {
    console.warn("pinFileToIPFS error: ", error);
  }
}

export default pinFileToIPFS;
