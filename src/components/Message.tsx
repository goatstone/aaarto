import React from "react";

type MessageProps = {
  account: string | null,
  uploading: boolean,
  loading: boolean,
  transactionHash: string | null,
  transactionReceipt: any,
  errorMessage: string | null,
  uploadError: string | null
};

const Message: React.FC<MessageProps> = ({
  account,
  uploading,
  loading,
  transactionHash,
  transactionReceipt,
  errorMessage,
  uploadError,
}) => {

  return (
    <section>
      <section>
        <h3>Connected Account: {account}</h3>
      </section>
      <section>
        {uploading && <p>Status: Uploading</p>}
        {loading && <p>Status: Minting</p>}
        {transactionHash && (
          <p>
            Transaction Hash:
            <a href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
              target="_blank" rel="noopener noreferrer">
              {transactionHash}
            </a>
          </p>
        )}
        {transactionReceipt && <p>Transaction confirmed in block: {transactionReceipt.blockNumber}</p>}
      </section>
      <section>
        {errorMessage && <p>Mint error: {errorMessage}</p>}
        {uploadError && <p>Upload error: {uploadError}</p>}
      </section>
    </section>
  );
};

export default Message;
