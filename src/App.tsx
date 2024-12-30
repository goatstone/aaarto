import React from 'react';
import { HashConnect, HashConnectConnectionState, SessionData } from 'hashconnect';
import makeCanvas from './aaarto';

console.log('HashConnect', HashConnect);
/**
 * Initialize the application
 */
const init = () => {
    makeCanvas();
};
window.addEventListener("load", init);
const App: React.FC = () => {

    return (
        <div>
            <h1>
                <a href="https://github.com/JoseHerminioCollas/aaarto/" target="new">
                    Aaarto
                </a>
                <a href="http://goatstone.com" target="new">goatstone</a>
            </h1>
            <svg
                version="1.1"
                width="500"
                height="500"
                xmlns="http://www.w3.org/2000/svg"
                id="art"
            >
                <rect id="canvas" width="100%" height="100%" fill="white" />
            </svg>
            <section className="panel">
                <section id="shape">
                    <label>
                        Circle
                        <input type="radio" name="shape" value="circle" checked />
                    </label>
                    <label>
                        Square <input type="radio" name="shape" value="square" />
                    </label>
                    <label>
                        Erase <input type="radio" name="shape" value="erase" />
                    </label>
                </section>
                <section id="size">
                    <h3>Size</h3>
                    <input type="range" min="1" max="300" value="50" />
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
