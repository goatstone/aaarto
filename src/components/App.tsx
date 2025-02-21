import React, { useState } from "react";
import Canvas from "@components/Canvas";
import Header from "@components/Header";
import CanvasControl from "@components/CanvasControl";
import TitleControl from "@components/TitleControl";
import Message from "./Message";
import useMintNFT from "@hooks/useMintNFT";
import useUpload from "@hooks/useUpload";

const App: React.FC = () => {
  const [shape, setShape] = useState<string>("circle");
  const [size, setSize] = useState<number>(70);
  const [color, setColor] = useState<string>("#cccccc");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [artistName, setArtistName] = useState<string>("");
  const [svgString, setSvgString] = useState<string>("");
  const { uploadToServer, uploading, uploadError } = useUpload();
  const { mintNFT, transactionHash, errorMessage, loading, account } =
    useMintNFT();

  const handleUpload = async (): Promise<void> => {
    const ipfsHashMD = await uploadToServer(
      svgString,
      name,
      description,
      artistName
    );
    if (ipfsHashMD) {
      await mintNFT(`ipfs://${ipfsHashMD}`);
    }
  };

  return (
    <>
      <Header
        handleUpload={handleUpload}
        loading={loading}
        uploading={uploading}
      />
      <Canvas
        shape={shape}
        size={size}
        color={color}
        setSvgString={setSvgString}
      />
      <section className="controls">
        <CanvasControl
          shape={shape}
          setShape={setShape}
          size={size}
          setSize={setSize}
          color={color}
          setColor={setColor}
        />
        <TitleControl title={name} setTitle={setName} />
        <section>
          <label>
            Description
            <textarea
              value={description}
              onChange={({ target }) => setDescription(target.value)}
              rows={2}
              cols={32}
              placeholder="Description"
              maxLength={256}
            >
              {description}
            </textarea>
          </label>
        </section>
        <section>
          <label>
            Artist Name
            <input
              type="text"
              value={artistName}
              onChange={({ target }) => setArtistName(target.value)}
              placeholder="Artist Name"
              maxLength={256}
              size={16}
            />
          </label>
        </section>
        <Message
          account={account}
          uploading={uploading}
          loading={loading}
          transactionHash={transactionHash}
          errorMessage={errorMessage}
          uploadError={uploadError}
        />
      </section>
    </>
  );
};

export default App;
