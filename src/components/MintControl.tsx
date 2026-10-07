import React from "react";
import { mergeStyleSets } from "@fluentui/react";

const mintControlStyles = mergeStyleSets({
  container: {
    backgroundColor: "lightblue",
    padding: "0.5em",
    selectors: {
      button: {
        color: "#eee",
        backgroundColor: "darkblue",
        fontSize: "1.25em",
        cursor: "pointer",
        borderRadius: "5%",
      },
    },
  },
});

const labels = {
  mint: "Mint The Aaarto",
  minting: "Minting, Please Wait...",
  unavailable: "Minting is not available yet",
  incomplete: "Draw something and enter a title to mint",
};

export type MintControlProps = {
  handleMint: () => void;
  isMinting: boolean;
  mintEnabled?: boolean;
  canMint?: boolean;
};

const MintControl: React.FC<MintControlProps> = ({
  handleMint,
  isMinting,
  mintEnabled = true,
  canMint = true,
}) => {
  return (
    <section className={mintControlStyles.container}>
      <button
        onClick={handleMint}
        disabled={isMinting || !mintEnabled || !canMint}
        title={mintEnabled && !canMint ? labels.incomplete : undefined}
      >
        {!mintEnabled
          ? labels.unavailable
          : isMinting
            ? labels.minting
            : labels.mint}
      </button>
    </section>
  );
};

export default MintControl;
