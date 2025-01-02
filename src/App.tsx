import React, { useState } from 'react';
import Canvas from './Canvas';
import Header from './Header';
import ControlPanel from './ControlPanel';
import { HashConnect, HashConnectConnectionState, SessionData } from 'hashconnect';

const App: React.FC = () => {

    const [shape, setShape] = useState<string>('circle');
    const [size, setSize] = useState<number>(70);
    const [color, setColor] = useState<string>('#cccccc');

    return (
        <div>
            <Header />
            <Canvas shape={shape} size={size} color={color} />
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
