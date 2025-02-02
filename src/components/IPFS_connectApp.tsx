import React, { useState } from 'react';
import useUpload from '../hooks/useUpload';
import Canvas from './Canvas';

const App: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [svgString, setSvgString] = useState<string>('');
  const { uploadToServer, uploading, uploadError } = useUpload();

  const handleUpload = async () => {
    if (!svgString || !name) {
      console.log('SVG or name is missing');
      return;
    }

    const ipfsHash = await uploadToServer(svgString, name);
    if (ipfsHash) {
      await mintNFT(`ipfs://${ipfsHash}`);
    }
  };

  return (
    <div>
      <Canvas shape="circle" size={50} color="blue" setSvgString={setSvgString} />
      <input
        type="text"
        value={name}
        onChange={({ target }) => setName(target.value)}
        placeholder="Name"
        required
      />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload and Mint'}
      </button>
      {uploadError && <p>{uploadError}</p>}
    </div>
  );
};

const mintNFT = async (tokenURI: string) => {
  console.log('Minting NFT with IPFS URI', tokenURI);
  // Add your minting code here
};

export default App;
