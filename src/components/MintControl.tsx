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
};

export type MintControlProps = {
  handleUpload: () => Promise<void>;
  uploading: boolean;
  loading: boolean;
};

const MintControl: React.FC<MintControlProps> = ({
  handleUpload,
  uploading,
  loading,
}) => {
  return (
    <section className={mintControlStyles.container}>
      <button onClick={handleUpload} disabled={uploading || loading}>
        {uploading || loading ? labels.minting : labels.mint}
      </button>
    </section>
  );
};

export default MintControl;
