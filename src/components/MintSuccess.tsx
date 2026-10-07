import React = require("react");
import config from "../config";

type MintSuccessProps = {
  transactionHash: string;
};
const MintSuccess: React.FC<MintSuccessProps> = ({ transactionHash }) => {
  // blockExplorerUrls isn't consistent about a trailing slash across networks
  // in config.ts, so strip it here rather than relying on that convention.
  const blockExplorerUrl = config.ethRequestParams[0].blockExplorerUrls[0].replace(
    /\/$/,
    "",
  );
  return (
    <section>
      <h3>Minting Success!</h3>
      <p className="success_message">
        <a
          href={`${blockExplorerUrl}/tx/${transactionHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {transactionHash}
        </a>
      </p>
    </section>
  );
};

export default MintSuccess;
