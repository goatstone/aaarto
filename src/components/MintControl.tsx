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
      // aria-disabled (not disabled) in the incomplete case so a click can still
      // open the explanatory modal; style both the same way.
      "button:disabled, button[aria-disabled='true']": {
        opacity: 0.5,
        cursor: "not-allowed",
      },
    },
  },
});

const labels = {
  mint: "Mint The Aaarto",
  minting: "Minting, Please Wait...",
  unavailable: "Minting is not available yet",
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
        disabled={isMinting || !mintEnabled}
        aria-disabled={mintEnabled && !canMint ? true : undefined}
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
