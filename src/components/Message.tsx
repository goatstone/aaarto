import React from "react";

type MessageProps = {
  account: string | null;
};

const Message: React.FC<MessageProps> = ({ account }) => {
  return (
    <section>
      <h3 style={{ overflowWrap: "anywhere" }}>
        {account ? `Connected Account: ${account}` : "No account connected"}
      </h3>
    </section>
  );
};

export default Message;
