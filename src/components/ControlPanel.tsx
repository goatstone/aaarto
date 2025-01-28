import React, { useEffect } from "react";

const labels = {
    mint: "Mint The Aaarto",
    minting: "Minting"
};

type ControlPanelProps = {
    shape: string,
    setShape: React.Dispatch<React.SetStateAction<string>>,
    size: number,
    setSize: React.Dispatch<React.SetStateAction<number>>,
    color: string,
    setColor: React.Dispatch<React.SetStateAction<string>>,
    account: string | null,
    handleUpload: () => {},
    uploading: boolean,
    loading: boolean,
    transactionHash: string | null,
    transactionReceipt: any,
    errorMessage: string | null,
    uploadError: string | null
    title: string,
    setTitle: React.Dispatch<React.SetStateAction<string>>,
};

const ControlPanel: React.FC<ControlPanelProps> = ({
    shape,
    setShape,
    size,
    setSize,
    color,
    setColor,
    account,
    handleUpload,
    uploading,
    loading,
    transactionHash,
    transactionReceipt,
    errorMessage,
    uploadError,
    title,
    setTitle
}) => {

    return (
        <section className="panel">
            <label>
                Title
                <input
                    type="text"
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                    placeholder="Title"
                />
            </label>
            <button onClick={handleUpload} disabled={uploading || loading}>
                {uploading || loading ? labels.minting : labels.mint}
            </button>
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
            <section id="information" >
                <h4>Connected Account: {account}</h4>
            </section>
            {transactionHash && (
                <p>
                    Transaction Hash:{' '}
                    <a href={`https://sepolia.etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
                        {transactionHash}
                    </a>
                </p>
            )}
            {transactionReceipt && <p>Transaction confirmed in block: {transactionReceipt.blockNumber}</p>}
            {errorMessage && <p>{errorMessage}</p>}
            {uploadError && <p>{uploadError}</p>}
        </section>
    );
};
export default ControlPanel;
