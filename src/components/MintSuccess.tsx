import React = require("react");

type MintSuccessProps = {
  transactionHash: string;
};
const MintSuccess: React.FC<MintSuccessProps> = ({ transactionHash }) => {
  return (
    <section>
      <h3>Minting Success!</h3>
      <p className="success_message">
        <a
          href={`https://polygonscan.com/tx/${transactionHash}`}
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
