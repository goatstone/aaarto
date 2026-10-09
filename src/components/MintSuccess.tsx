import React = require("react");
import config from "../config";

type MintSuccessProps = {
  transactionHash: string;
  tokenId?: string | null;
  // CIDs from the upload; absent with ?env=dev, which skips the upload
  ipfsHash?: string | null;
  ipfsHashMD?: string | null;
};
const MintSuccess: React.FC<MintSuccessProps> = ({
  transactionHash,
  tokenId,
  ipfsHash,
  ipfsHashMD,
}) => {
  // blockExplorerUrls isn't consistent about a trailing slash across networks
  // in config.ts, so strip it here rather than relying on that convention.
  const blockExplorerUrl =
    config.ethRequestParams[0].blockExplorerUrls[0].replace(/\/$/, "");
  const shortHash =
    transactionHash.length > 20
      ? `${transactionHash.slice(0, 10)}…${transactionHash.slice(-8)}`
      : transactionHash;
  const imageUrl = ipfsHash ? `${config.ipfsGateway}${ipfsHash}` : null;
  const metadataUrl = ipfsHashMD ? `${config.ipfsGateway}${ipfsHashMD}` : null;
  const [imageFailed, setImageFailed] = React.useState(false);
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5em",
      }}
    >
      <p style={{ margin: 0 }}>Your Aaarto has been minted.</p>
      {imageUrl && !imageFailed && (
        <img
          src={imageUrl}
          alt="Your minted Aaarto"
          style={{ maxWidth: "100%", maxHeight: "40vh", background: "#fff" }}
          onError={() => setImageFailed(true)}
        />
      )}
      {tokenId && <p style={{ margin: 0 }}>Token ID: {tokenId}</p>}
      {(imageUrl || metadataUrl) && (
        <p style={{ margin: 0 }}>
          {imageUrl && (
            <a href={imageUrl} target="_blank" rel="noopener noreferrer">
              Artwork (SVG)
            </a>
          )}
          {imageUrl && metadataUrl && " · "}
          {metadataUrl && (
            <a href={metadataUrl} target="_blank" rel="noopener noreferrer">
              Metadata
            </a>
          )}
        </p>
      )}
      <p className="success_message" style={{ margin: 0, fontSize: "0.8em" }}>
        Transaction:{" "}
        <a
          href={`${blockExplorerUrl}/tx/${transactionHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {shortHash}
        </a>
      </p>
    </section>
  );
};

export default MintSuccess;
