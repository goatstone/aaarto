import React from "react";
import { FontWeights, getTheme, mergeStyleSets } from "@fluentui/react";
import MintSuccess from "@components/MintSuccess";

const theme = getTheme();
const modalContentStyles = mergeStyleSets({
  container: {
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "stretch",
  },
  error: {
    backgroundColor: "red",
    padding: "1em",
  },
  header: [
    {
      flex: "1 1 auto",
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      fontWeight: FontWeights.semibold,
      padding: "12px 12px 14px 24px",
      selectors: {
        button: {
          width: "2em",
          height: "2em",
          borderRadius: "25%",
          fontSize: "1.5em",
          cursor: "pointer",
        },
      },
    },
  ],
  heading: {
    color: theme.palette.neutralPrimary,
    fontWeight: FontWeights.semibold,
    fontSize: "3em",
    margin: "0",
  },
  body: {
    flex: "4 4 auto",
    padding: "0 24px 24px 24px",
    overflowY: "hidden",
    selectors: {
      p: { margin: "1em 0", fontSize: "1.25em" },
      "p:first-child": { marginTop: 0 },
      "p:last-child": { marginBottom: 0 },
      a: { fontSize: "1.25em", color: "darkblue" },
    },
  },
});

type MintingInfoProps = {
  mintingError: string | null;
  account: string | null;
  transactionHash: string | null;
};

const MintingInfo: React.FC<MintingInfoProps> = ({
  mintingError,
  account,
  transactionHash,
}) => {
  return (
    <>
      <div className={modalContentStyles.header}>
        {!mintingError && (
          <>
            <h2 className={modalContentStyles.heading}>Minting An Aaarto...</h2>
            {account && <p>Connected Account: {account}</p>}
            {transactionHash && (
              <MintSuccess transactionHash={transactionHash} />
            )}
          </>
        )}
      </div>
      {mintingError && (
        <h2 className={modalContentStyles.error}>{mintingError} </h2>
      )}
    </>
  );
};

export default MintingInfo;
