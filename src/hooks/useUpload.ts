import { useState } from 'react';
import axios from 'axios';

interface UploadResponse {
  ipfsHashMD: string;
}
const errorMessages = {
  network: "Error: Could not access network",
  general: "Error: An error occured whild trying to upload assest"
};
const useUpload = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadToServer = async (svgString: string, title: string): Promise<string | null> => {
    setUploading(true);

    const data = {
      title,
      svgString,
    };

    try {
      const response = await axios.post<UploadResponse>('http://localhost:5000/upload', data);
      return response.data.ipfsHashMD;
    } catch (err: any) {
      const errMsg= err.message as string;
      let userMessage = errorMessages.general;
      if(errMsg.includes('Network Error')){
        userMessage = errorMessages.network;
      }
      setUploadError(userMessage);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadToServer, uploading, uploadError };
};

export default useUpload;
