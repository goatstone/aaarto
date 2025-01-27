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
  const { openMetaMask, connectWallet, account } = useMetaMask();
  const { mintNFT, transactionHash, transactionReceipt, errorMessage, loading } = useMintNFT();

  const handleUpload = async () => {
    if (!svgString) {
      console.log('SVG or Title is missing');
      return;
    }

    const ipfsHashMD = await uploadToServer(svgString, title);
    console.log('uploadToServer', ipfsHashMD)

    if (ipfsHashMD) {
      console.log('uploadToServer', ipfsHashMD)
      await mintNFT(`ipfs://${ipfsHashMD}`);
    }
  };

  // const handleMint = async () => {
  //   const ipfsTokenURI = 'ipfs://bafkreiesuxfdkg7fz2zacjum5y37cjopavm5s3uwmtrwgsjjnufz46t7om';
  //   await mintNFT(ipfsTokenURI);
  // };

  return (
    <div>
      <Header />
      <Canvas shape={shape} size={size} color={color} setSvgString={setSvgString} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading || loading ? 'Minting....' : 'Mint The Aaarto...'}
      </button>
      {uploadError && <p>{uploadError}</p>}
      <label>
        Title
        <input
          type="text"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          placeholder="Title"
        />
      </label>
      {/* <button onClick={handleMint} disabled={loading}>
        {loading ? 'Minting...' : 'Mint NFT'}
      </button> */}
      {transactionHash && (
        <p>
          Transaction Hash:{' '}
          <a href={`https://sepolia.etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
            {transactionHash}
          </a>
        </p>
      )}
      {transactionReceipt && <p>Transaction confirmed in block: {transactionReceipt.blockNumber}</p>}
      {errorMessage && <p>Error: {errorMessage}</p>}
      <ControlPanel
        account={account}
        connectWallet={connectWallet}
        openMetaMask={openMetaMask}
        shape={shape}
        setShape={setShape}
        size={size}
        setSize={setSize}
        color={color}
        setColor={setColor}
      />
    </div>
  );
};

export default App;
