import React, { useState } from 'react';
import Canvas from '@components/Canvas';
import Header from '@components/Header';
import ControlPanel from '@components/ControlPanel';
import useMetaMask from '@hooks/useMetaMask';
import useMintNFT from '@hooks/useMintNFT';
import useUpload from '@hooks/useUpload';

const App: React.FC = () => {
  const [shape, setShape] = useState<string>('circle');
  const [size, setSize] = useState<number>(70);
  const [color, setColor] = useState<string>('#cccccc');
  const [title, setTitle] = useState<string>('');
  const [svgString, setSvgString] = useState<string>('');
  const { uploadToServer, uploading, uploadError } = useUpload();
  const { mintNFT,
    transactionHash,
    transactionReceipt,
    errorMessage,
    loading,
    account } = useMintNFT();

  const handleUpload = async () => {
    if (!svgString) {
      console.log('SVG or Title is missing');
      return false;
    }
    const ipfsHashMD = ''
    // const ipfsHashMD = await uploadToServer(svgString, title);
    // if (ipfsHashMD) {
    await mintNFT(`ipfs://${ipfsHashMD}`);
    return true;
    // }
  };

  return (
    <div>
      <Header />
      <Canvas shape={shape} size={size} color={color} setSvgString={setSvgString} />
      <ControlPanel
        account={account}
        handleUpload={handleUpload}
        uploading={uploading}
        loading={loading}
        shape={shape}
        setShape={setShape}
        size={size}
        setSize={setSize}
        color={color}
        setColor={setColor}
        transactionHash={transactionHash}
        transactionReceipt={transactionReceipt}
        errorMessage={errorMessage}
        uploadError={uploadError}
        title={title}
        setTitle={setTitle}
      />
    </div>
  );
};

export default App;
