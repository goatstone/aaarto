import { useState } from 'react';
import axios from 'axios';

interface UploadResponse {
  ipfsHash: string;
  metadata: { name: string; description: string; image: string };
}

const useUpload = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadToServer = async (svgString: string, name: string): Promise<string | null> => {
    setUploading(true);

    const data = {
      name,
      svgString,
    };

    try {
      const response = await axios.post<UploadResponse>('http://localhost:5000/upload', data);
      return response.data.ipfsHash;
    } catch (err) {
      setUploadError('Error uploading SVG');
      console.error('Error uploading SVG:', err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadToServer, uploading, uploadError };
};

export default useUpload;
