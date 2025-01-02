import React, { useState } from 'react';
import Canvas from './Canvas';
import Header from './Header';
import { HashConnect, HashConnectConnectionState, SessionData } from 'hashconnect';

const App: React.FC = () => {

    const [size, setSize] = useState<number>(70);
    const [shape, setShape] = useState<string>('circle');
    const [color, setColor] = useState<string>('#cccccc');

    return (
        <div>
            <Header />
            <Canvas size={size} shape={shape} color={color} />
            <section className="panel">
                <section id="shape">
                    <label>
                        Circle
                        <input type="radio" name="shape" value="circle"
                            checked={shape === 'circle'}
                            onChange={({ target }) => setShape(target.value)}
                        />
                    </label>
                    <label>
                        Square <input type="radio" name="shape" value="square"
                            checked={shape === 'square'}
                            onChange={({ target }) => setShape(target.value)}
                        />
                    </label>
                    <label>
                        Erase <input type="radio" name="shape" value="erase"
                            checked={shape === 'erase'}
                            onChange={({ target }) => setShape(target.value)}
                        />
                    </label>
                </section>
                <section id="size">
                    <h3>Size</h3>
                    <input type="range" value={size} onChange={({ target }) => setSize(Number(target.value))} min="10" max="300" />
                </section>
                <section id="color">
                    <h3>Color</h3>
                    <input onChange={({ target }) => setColor(target.value)} type="color" value={color} />
                </section>
                <section id="mint">
                    <button>
                        Open Wallet
                    </button>
                    <button disabled>
                        Create
                    </button>
                </section>
            </section>
        </div>
    );
};

export default App;
