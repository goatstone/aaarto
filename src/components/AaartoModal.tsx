import React from "react";
import { mergeStyleSets, FontWeights, getTheme, Modal } from "@fluentui/react";

const theme = getTheme();
const modalContentStyles = mergeStyleSets({
  container: {
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "stretch",
  },
  header: [
    {
      flex: "1 1 auto",
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: "flex",
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
export type AaartoModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
};

const modalStyles = mergeStyleSets({
  container: {
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "stretch",
  },
});

const AaartoModal: React.FC<AaartoModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  children,
}) => {
  return (
    <Modal
      isOpen={isModalOpen}
      onDismiss={() => setIsModalOpen(false)}
      isBlocking={false}
      containerClassName={modalStyles.container}
    >
      <button onClick={() => setIsModalOpen(false)}>X</button>
      {children}
    </Modal>
  );
};


export default AaartoModal;
