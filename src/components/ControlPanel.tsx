import React, { useEffect } from "react";

type ControlPanelProps = {
    shape: string,
    setShape: React.Dispatch<React.SetStateAction<string>>,
    size: number,
    setSize: React.Dispatch<React.SetStateAction<number>>,
    color: string,
    setColor: React.Dispatch<React.SetStateAction<string>>,
    account: string | null,
    connectWallet: () => Promise<void>,
    openMetaMask: () => Promise<void>,
};

const ControlPanel: React.FC<ControlPanelProps> = ({
    shape,
    setShape,
    size,
    setSize,
    color,
    setColor,
    account,
    connectWallet,
    openMetaMask
}) => {

    // useEffect(() => { connectWallet() }, []);

    return (
        <section className="panel">
            <section id="shape">
                <label>
                    Circle
                    <input
                        type="radio"
                        name="shape"
                        value="circle"
                        checked={shape === 'circle'}
                        onChange={({ target }) => setShape(target.value)}
                    />
                </label>
                <label>
                    Square
                    <input
                        type="radio"
                        name="shape"
                        value="square"
                        checked={shape === 'square'}
                        onChange={({ target }) => setShape(target.value)}
                    />
                </label>
                <label>
                    Erase
                    <input
                        type="radio"
                        name="shape"
                        value="erase"
                        checked={shape === 'erase'}
                        onChange={({ target }) => setShape(target.value)}
                    />
                </label>
            </section>
            <section id="size">
                <label>
                    Size
                    <input
                        type="range"
                        value={size}
                        min="10"
                        max="300"
                        onChange={({ target }) => setSize(Number(target.value))}
                    />
                </label>
            </section>
            <section id="color">
                <label>Color
                    <input
                        type="color"
                        value={color}
                        onChange={({ target }) => setColor(target.value)}
                    />
                </label>
            </section>
            <section id="mint">
                <button onClick={connectWallet}>
                    Connect to MetaMask
                </button>
                <button onClick={openMetaMask}>
                    Open MetaMask
                </button>
                <button disabled>
                    Create
                </button>
            </section>
            <section id="information" >
                <h4>Connected Account: {account}</h4>
            </section>
        </section>
    );
};
export default ControlPanel;
