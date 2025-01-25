import React, { useEffect, useState } from 'react';
import Canvas from '@components/Canvas';
import Header from '@components/Header';
import ControlPanel from '@components/ControlPanel';
import useMetaMask from '@hooks/useMetaMask';
import useMintNFT from '@hooks/useMintNFT';

const App: React.FC = () => {
  const [shape, setShape] = useState<string>('circle');
  const [size, setSize] = useState<number>(70);
  const [color, setColor] = useState<string>('#cccccc');
  const [name, setName] = useState<string>('');
  const [svgString, setSvgString] = useState<string>('');
  const { openMetaMask, connectWallet, account } = useMetaMask();
  const { mintNFT, transactionHash, transactionReceipt, errorMessage, loading } = useMintNFT();

  const handleMint = async () => {
    const ipfsTokenURI = 'ipfs://bafkreiesuxfdkg7fz2zacjum5y37cjopavm5s3uwmtrwgsjjnufz46t7om';
    await mintNFT(ipfsTokenURI);
  };

  return (
    <div>
      <Header />
      <Canvas shape={shape} size={size} color={color} setSvgString={setSvgString} />
      <input
        type="text"
        value={name}
        onChange={({ target }) => setName(target.value)}
        placeholder="Name"
        required
      />
      <button onClick={handleMint} disabled={loading}>
        {loading ? 'Minting...' : 'Mint NFT'}
      </button>
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
