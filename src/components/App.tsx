import React, { useState, useEffect } from "react";
import Canvas from "@components/Canvas";
import Header from "@components/Header";
import CanvasControl from "@components/CanvasControl";
import TitleControl from "@components/TitleControl";
import Message from "./Message";
import MintControl from "./MintControl";
import { mergeStyleSets } from "@fluentui/react";
import AaartoModal from "@components/AaartoModal";
import AboutInfo from "./AboutInfo";
import MintingInfo from "./MintingInfo";
import uploadData from "../uploadData";
import mintNFT from "mintNFT";
import checkMetaMaskInstall from "checkMetaMaskInstall";
import requestAccounts from "requestAccounts";

const aboutStyles = mergeStyleSets({
  button: {
    backgroundColor: "darkgreen",
    color: "#eee",
    borderRadius: "10%",
    fontSize: "1.25em",
    cursor: "pointer",
  },
});
const errorMessages = {
  notInstalled: "MetaMask is not installed. Please install it to use this app.",
  accountAccess: "Connect MetaMask account with this site.",
  // attemptAdd: `Attempting to add the ${config.chainNameDisplay} chain.`,
  // attemptSwitch: `Attempting to switch to the ${config.chainNameDisplay} chain.`,
  general: "An error occurred during minting.",
  userCancel: "The request has been cancelled.",
};
const errorMessages2 = {
  network: "Error: Could not access network",
  general: "Error: An error occurred while trying to upload the assets",
};

const App: React.FC = () => {
  const [shape, setShape] = useState<string>("circle");
  const [size, setSize] = useState<number>(70);
  const [color, setColor] = useState<string>("#cccccc");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [artistName, setArtistName] = useState<string>("");
  const [svgString, setSvgString] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintingError, setMintingError] = useState<string | null>(null);
  const [account, setAccount] = useState<null | string>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  type ModalContent = "about" | "minting";
  const modalContents = {
    about: <AboutInfo />,
    minting: (
      <MintingInfo
        account={account}
        transactionHash={transactionHash}
        mintingError={mintingError}
      />
    ),
  };
  const [modalContent, setModalContent] = useState<ModalContent>("about");
  useEffect(() => {
    (async () => {
      // Check if MetaMask is installed, if not throw error
      checkMetaMaskInstall();
      // Get the users account
      const account = await requestAccounts();
      setAccount(account);
    })();
  }, []);

  const useUploadMint = async (
    svgString: string,
    name: string,
    description: string,
    artistName: string
  ) => {
    setIsMinting(true);
    setAccount(null);
    setTransactionHash(null);
    setMintingError(null);
    try {
      const ipfsHashMD = await uploadData(
        svgString,
        name,
        description,
        artistName
      );
      // Check if MetaMask is installed, if not throw error
      checkMetaMaskInstall();
      // Get the users account
      const account = await requestAccounts();
      setAccount(account);
      const transactionHash = await mintNFT(`ipfs://${ipfsHashMD}`);
      if (transactionHash) {
        setTransactionHash(transactionHash);
      }
      setIsMinting(false);
    } catch (error: any) {
      setMintingError(`Minting Error: ${error.message}`);
    }
  };
  useEffect(() => {
    if (!isModalOpen) {
      setIsMinting(false);
      setMintingError(null);
    }
  }, [isModalOpen]);
  return (
    <>
      <AaartoModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        {modalContents[modalContent]}
      </AaartoModal>
      <Header>
        <button
          onClick={() => {
            setModalContent("about");
            setIsModalOpen(true);
          }}
          className={aboutStyles.button}
        >
          About
        </button>
        <MintControl
          handleMint={() => {
            setModalContent("minting");
            setIsModalOpen(true);
            useUploadMint(svgString, name, description, artistName);
          }}
          isMinting={isMinting}
        />
      </Header>
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
        <Message account={account} transactionHash={transactionHash} />
      </section>
    </>
  );
};

export default App;
