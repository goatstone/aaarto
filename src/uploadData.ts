import axios from "axios";

const messages = {
  network: "There was a network error, check your internet connection.",
  generic: "There was an error uploading data.",
};
// Messages from this error are safe to show to the user as-is.
export class UploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadError";
    Object.setPrototypeOf(this, UploadError.prototype);
  }
}

export type UploadResult = {
  // CID of the metadata JSON (what the token URI points to)
  ipfsHashMD: string;
  // CID of the SVG image
  ipfsHash: string;
};

const uploadData = async (
  svgString: string,
  name: string,
  description: string,
  artistName: string,
): Promise<UploadResult> => {
  const data = {
    name,
    svgString,
    description,
    artistName,
  };

  try {
    const address = "/server";
    const response = await axios.post(address, data);
    const { ipfsHashMD, ipfsHash } = response.data;
    return { ipfsHashMD, ipfsHash };
  } catch (error: any) {
    console.error("Upload failed:", error.message, error.response?.status);
    // Is it a network error?
    if (error.code === "ERR_NETWORK") {
      throw new UploadError(messages.network);
    }
    // If it is not a network error then send a generic message
    throw new UploadError(messages.generic);
  }
};

export default uploadData;
