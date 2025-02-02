import React from "react";

const labels = {
  mint: "Mint The Aaarto",
  minting: "Minting, Please Wait..."
};

type MintControlProps = {
  handleUpload: () => {},
  uploading: boolean,
  loading: boolean,
};

const MintControl: React.FC<MintControlProps> = ({
  handleUpload,
  uploading,
  loading,
}) => {

  return (
    <section className="mint_control">
      <section>
        <button onClick={handleUpload} disabled={uploading || loading}>
          {uploading || loading ? labels.minting : labels.mint}
        </button>
      </section>
    </section>
  );
};

export default MintControl;
