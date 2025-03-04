import axios from "axios";

const messages = {
  network: "There was a network error, check your internet connection.",
  generic: "There was an error uploading data.",
};
const uploadData = async (
  svgString: string,
  name: string,
  description: string,
  artistName: string
): Promise<string> => {
  const data = {
    name,
    svgString,
    description,
    artistName,
  };

  try {
    const address = "/server";
    const response = await axios.post(address, data);
    const ipfsHashMD = response.data.ipfsHashMD;
    return ipfsHashMD;
  } catch (error: any) {
    console.log(error);
    // Is it a network error?
    if (error.code === "ERR_NETWORK") {
      throw new Error(messages.network);
    }
    // If it is not a network error then send a generic message
    throw new Error(messages.generic);
  }
};

export default uploadData;
