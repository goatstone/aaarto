import React, { useId } from "react";
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

// Read by screen readers (aria-describedby) and hidden on screen: sighted users
// get the same text from the title tooltip
const visuallyHidden = mergeStyleSets({
  text: {
    position: "absolute",
    width: "1px",
    height: "1px",
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
    whiteSpace: "nowrap",
  },
});

const labels = {
  mint: "Mint The Aaarto",
  minting: "Minting, Please Wait...",
};

export type MintControlProps = {
  handleMint: () => void;
  isMinting: boolean;
  canMint?: boolean;
  // What is still missing, e.g. "draw something and enter a title". Worded to
  // finish "Please ... before you mint your Aaarto.", as in the modal
  missingText?: string;
};

const MintControl: React.FC<MintControlProps> = ({
  handleMint,
  isMinting,
  canMint = true,
  missingText = "",
}) => {
  const reasonId = useId();
  // Why the button is incomplete, if it is. Not shown while minting is under way.
  // The tooltip breaks the line before "before"; the screen-reader text does not.
  const incomplete = !canMint && !isMinting;
  const reason = incomplete
    ? `Please ${missingText} before you mint your Aaarto.`
    : undefined;
  const tooltip = incomplete
    ? `Please ${missingText}\nbefore you mint your Aaarto.`
    : undefined;
  return (
    <section className={mintControlStyles.container}>
      <button
        onClick={handleMint}
        disabled={isMinting}
        aria-disabled={!canMint ? true : undefined}
        title={tooltip}
        aria-describedby={reason ? reasonId : undefined}
      >
        {isMinting ? labels.minting : labels.mint}
      </button>
      {reason && (
        <span id={reasonId} className={visuallyHidden.text}>
          {reason}
        </span>
      )}
    </section>
  );
};

export default MintControl;
