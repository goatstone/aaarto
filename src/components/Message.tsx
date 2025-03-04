import React from "react";

type MessageProps = {
  account: string | null;
  uploading: boolean;
  loading: boolean;
  transactionHash: string | null;
  errorMessage: string | null;
  uploadError: string | null;
};

const Message: React.FC<MessageProps> = ({
  account,
  uploading,
  loading,
  transactionHash,
  errorMessage,
  uploadError,
}) => {                   
  return (
    <section>
      <section>
        <h3>
          {account ? `Connected Account : ${account}` : "No account connected"}
        </h3>
      </section>
      <section>
        {uploading && <p>Status: Uploading</p>}
        {loading && <p>Status: Minting</p>}
        {transactionHash && (
          <p className="success_message">
            {/* Minting Success! Transaction Hash: */}
            <a
              href={`https://polygonscan.com/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {transactionHash}
            </a>
          </p>
        )}
      </section>
      <section>
        {errorMessage && <p>{errorMessage}</p>}
        {uploadError && <p>{uploadError}</p>}
      </section>
    </section>
  );
};

export default Message;
