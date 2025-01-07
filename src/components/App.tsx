import React, { useEffect, useState } from 'react';
import Canvas from '@components/Canvas';
import Header from '@components/Header';
import ControlPanel from '@components/ControlPanel';
import useMetaMask from 'hooks/useMetaMask';

const App: React.FC = () => {
  const [shape, setShape] = useState<string>('circle');
  const [size, setSize] = useState<number>(70);
  const [color, setColor] = useState<string>('#cccccc');
  const { account, connectWallet, openMetaMask } = useMetaMask();

  useEffect(() => { connectWallet() }, []);

  return (
    <div>
      <Header />
      <Canvas shape={shape} size={size} color={color} />
      <p>Connected Account: {account}</p>
      <button onClick={connectWallet}>
        Connect to MetaMask
      </button>
      <button onClick={openMetaMask}>
        Open MetaMask
      </button>
      <ControlPanel
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
