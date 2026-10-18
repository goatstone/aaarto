import React, { useState, useEffect, useRef } from "react";
import Canvas from "@components/Canvas";
import Header from "@components/Header";
import CanvasControl from "@components/CanvasControl";
import TitleControl from "@components/TitleControl";
import MintControl from "./MintControl";
import { mergeStyleSets } from "@fluentui/react";
import AaartoModal from "@components/AaartoModal";
import AboutInfo from "./AboutInfo";
import MintingInfo from "./MintingInfo";
import Message from "./Message";
import RabbyMissing from "./RabbyMissing";
import uploadData from "../uploadData";
import { connectRabbyWallet, RABBY_NOT_INSTALLED } from "../rabbyHelpers";
import { mintNFT } from "../mintNFT";
import { normalizeMintError } from "../normalizeMintError";
import config from "../config";
import { getFeatureFlags, DEBUG_IPFS_CID } from "../featureFlags";

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
  notInstalled: "Rabby Wallet is not available. Please install or open it.",
  attemptAdd: `Attempting to add the ${config.chainNameDisplay} chain.`,
  attemptSwitch: `Attempting to switch to the ${config.chainNameDisplay} chain.`,
  general: "An error occurred during minting.",
  userCancel: "The request has been cancelled.",
  InsufficientFunds:
    "Insufficient funds, please add more funds to your wallet.",
};
const App: React.FC = () => {
  const [shape, setShape] = useState<string>("circle");
  const [size, setSize] = useState<number>(70);
  const [color, setColor] = useState<string>("#cccccc");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [artistName, setArtistName] = useState<string>("");
  const [svgString, setSvgString] = useState<string>("");
  const [shapeCount, setShapeCount] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const mintInFlight = useRef(false);
  const [mintingError, setMintingError] = useState<string | null>(null);
  const [account, setAccount] = useState<null | string>(null);
  // The account the last mint was sent from: the footer follows the wallet,
  // but a pending or finished mint must keep naming the account that sent it
  const [mintAccount, setMintAccount] = useState<null | string>(null);
  const [provider, setProvider] = useState<null | {
    on?: (event: string, handler: (...args: any[]) => void) => void;
    removeListener?: (event: string, handler: (...args: any[]) => void) => void;
  }>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const [ipfsHashMD, setIpfsHashMD] = useState<string | null>(null);

  const missingForMint = [
    ...(shapeCount > 0 ? [] : ["draw something"]),
    ...(name.trim().length > 0 ? [] : ["enter a title"]),
  ];
  const canMint = missingForMint.length === 0;
  const missingText = missingForMint.join(" and ");

  type ModalContent = "about" | "minting" | "rabby_missing" | "incomplete";
  const modalContents = {
    about: <AboutInfo />,
    incomplete: (
      <div style={{ padding: "1em 2em", textAlign: "center" }}>
        <h2>Almost there</h2>
        <p>Please {missingText} before you mint your Aaarto.</p>
      </div>
    ),
    minting: (
      <MintingInfo
        account={mintAccount}
        transactionHash={transactionHash}
        tokenId={tokenId}
        ipfsHash={ipfsHash}
        ipfsHashMD={ipfsHashMD}
        mintingError={mintingError}
      />
    ),
    rabby_missing: <RabbyMissing />,
  };
  const [modalContent, setModalContent] = useState<ModalContent>("about");
  // Read once, from the query string at page load (see DEBUG.md)
  const [{ ipfsUploadEnabled }] = useState(getFeatureFlags);
  const useUploadMint = async (
    svgString: string,
    name: string,
    description: string,
    artistName: string,
  ) => {
    // Tracked apart from the modal: closing the modal must not re-enable the
    // button while a transaction may still be pending (#78)
    if (mintInFlight.current) return;
    mintInFlight.current = true;
    setIsMinting(true);
    setTransactionHash(null);
    setTokenId(null);
    setIpfsHash(null);
    setIpfsHashMD(null);
    setMintingError(null);

    try {
      // Connect before the upload, so cancelling the wallet prompt leaves no
      // paid-for pins behind (#79)
      const result = await connectRabbyWallet();
      setAccount(result.account);
      setMintAccount(result.account);
      setProvider(result.ethereum);

      // ?env=dev skips the upload: no CIDs of the drawing to show
      const uploaded = ipfsUploadEnabled
        ? await uploadData(svgString, name, description, artistName)
        : { ipfsHashMD: DEBUG_IPFS_CID, ipfsHash: null };

      const minted = await mintNFT(
        result.ethereum,
        result.account,
        `ipfs://${uploaded.ipfsHashMD}`,
      );
      setTokenId(minted.tokenId);
      setIpfsHash(uploaded.ipfsHash);
      setIpfsHashMD(ipfsUploadEnabled ? uploaded.ipfsHashMD : null);
      setTransactionHash(minted.hash);
      // The user may have closed the modal while waiting: show the result
      setModalContent("minting");
      setIsModalOpen(true);
    } catch (error: any) {
      console.log("error", error);
      if (error?.message === RABBY_NOT_INSTALLED) {
        // Its own modal, so it can carry links the error bar cannot
        setModalContent("rabby_missing");
        setIsModalOpen(true);
        return;
      }
      setMintingError(normalizeMintError(error, errorMessages));
      setModalContent("minting");
      setIsModalOpen(true);
    } finally {
      mintInFlight.current = false;
      setIsMinting(false);
    }
  };
  // Follow the wallet's selected account (#145). An empty list means the
  // wallet was locked or disconnected from the site.
  useEffect(() => {
    if (!provider?.on) return;
    const onAccountsChanged = (accounts: string[]) =>
      setAccount(accounts?.[0] ?? null);
    provider.on("accountsChanged", onAccountsChanged);
    return () => provider.removeListener?.("accountsChanged", onAccountsChanged);
  }, [provider]);
  useEffect(() => {
    if (!isModalOpen) {
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
            if (!canMint) {
              setModalContent("incomplete");
              setIsModalOpen(true);
              return;
            }
            setModalContent("minting");
            setIsModalOpen(true);
            useUploadMint(svgString, name, description, artistName);
          }}
          isMinting={isMinting}
          canMint={canMint}
          missingText={missingText}
        />
      </Header>
      <Canvas
        shape={shape}
        size={size}
        color={color}
        setSvgString={setSvgString}
        setShapeCount={setShapeCount}
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
            />
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
        <Message account={account} />
      </section>
    </>
  );
};

export default App;
