import React from "react";
import { RABBY_DOWNLOAD_URL, RABBY_WEBSITE_URL } from "../rabbyHelpers";

// The global `a` rule is small and light grey for the dark page; this modal is white.
const linkStyle: React.CSSProperties = {
  color: "darkblue",
  fontSize: "1.1em",
  textDecoration: "underline",
};

const RabbyMissing: React.FC = () => (
  <div style={{ padding: "1em 2em", textAlign: "center" }}>
    <h2>Rabby Wallet is not available</h2>
    <p>
      Minting an Aaarto is a transaction on the blockchain, so you need a
      crypto wallet to approve it and pay the fee. This site uses Rabby, a free
      browser-extension wallet.
    </p>
    <p>
      <a
        href={RABBY_WEBSITE_URL}
        style={linkStyle}
        target="_blank" rel="noopener noreferrer">
        Learn about Rabby
      </a>
      {" · "}
      <a
        href={RABBY_DOWNLOAD_URL}
        style={linkStyle}
        target="_blank" rel="noopener noreferrer">
        Download the Rabby extension
      </a>
    </p>
    <p>
      After you install or unlock Rabby, reload this page and mint again.
    </p>
  </div>
);

export default RabbyMissing;
