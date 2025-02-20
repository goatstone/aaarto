import { useState } from "react";
import axios from "axios";

interface UploadResponse {
  ipfsHashMD: string;
}
const errorMessages = {
  network: "Error: Could not access network",
  general: "Error: An error occurred while trying to upload the assets",
};
const useUpload = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadToServer = async (
    svgString: string,
    title: string
  ): Promise<string | null> => {
    setUploading(true);

    const data = {
      title,
      svgString,
    };

    try {
      const response = await axios.post<UploadResponse>("/server", data);
      return response.data.ipfsHashMD;
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("Network Error")) {
        setUploadError(errorMessages.network);
      } else {
        setUploadError(errorMessages.general);
      }
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadToServer, uploading, uploadError };
};

export default useUpload;
