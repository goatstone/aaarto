import React from "react";
import MintSuccess from "@components/MintSuccess";

type MessageProps = {
  account: string | null;
  transactionHash: string | null;
};

const Message: React.FC<MessageProps> = ({ account, transactionHash }) => {
  return (
    <section>
      <section>
        <h3>
          {account ? `Connected Account : ${account}` : "No account connected"}
        </h3>
      </section>
      <section>
        {transactionHash && <MintSuccess transactionHash={transactionHash} />}
      </section>
    </section>
  );
};

export default Message;
