import React = require("react");
import config from "../config";

type MintSuccessProps = {
  transactionHash: string;
};
const MintSuccess: React.FC<MintSuccessProps> = ({ transactionHash }) => {
  // blockExplorerUrls isn't consistent about a trailing slash across networks
  // in config.ts, so strip it here rather than relying on that convention.
  const blockExplorerUrl =
    config.ethRequestParams[0].blockExplorerUrls[0].replace(/\/$/, "");
  const shortHash =
    transactionHash.length > 20
      ? `${transactionHash.slice(0, 10)}…${transactionHash.slice(-8)}`
      : transactionHash;
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.25em",
      }}
    >
      <p style={{ margin: 0 }}>
        Your Aaarto has been minted. View the transaction:
      </p>
      <p className="success_message" style={{ margin: 0 }}>
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
