import React, { useState } from 'react';
import { HashConnect, HashConnectConnectionState, SessionData } from 'hashconnect';

const App: React.FC = () => {
    const [size, setSize]: any = useState(70);
    const [shape, setShape]: any = useState('circle');
    const [SVGElements, setSVGElements] = useState<any[]>([]);
    const handleCanvasClick = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const el = <circle cx={x} cy={y} r={size / 2} fill="red" />
        setSVGElements(previousElements => ([...previousElements, el]))
    }
    const handleShapeChange = ({ target }: any) => {
        setShape(target.value);
    }
    const Canvas = () => {
        return (<svg className='canvas'
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            id="art"
            onClick={handleCanvasClick}
        >
            <rect id="canvas" width="100%" height="100%" fill="white" />
            {SVGElements.map((item: any) => (item))}
        </svg>)
    };

    return (
        <div>
            <h1>
                <a href="https://github.com/JoseHerminioCollas/aaarto/" target="new">
                    Aaarto
                </a>
                <a href="http://goatstone.com" target="new">goatstone</a>
            </h1>
            <Canvas />
            <section className="panel">
                <section id="shape">
                    <label>
                        Circle
                        <input type="radio" name="shape" value="circle"
                            checked={shape === 'circle'}
                            onChange={handleShapeChange}
                        />
                    </label>
                    <label>
                        Square <input type="radio" name="shape" value="square"
                            checked={shape === 'square'}
                            onChange={handleShapeChange}
                        />
                    </label>
                    <label>
                        Erase <input type="radio" name="shape" value="erase"
                            checked={shape === 'erase'}
                            onChange={handleShapeChange}
                        />
                    </label>
                </section>
                <section id="size">
                    <h3>Size</h3>
                    <input type="range" value={size} onChange={({ target }) => setSize(target.value)} min="10" max="300" />
                </section>
                <section id="color">
                    <h3>Color</h3>
                    <input type="color" value="#cccccc" />
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
