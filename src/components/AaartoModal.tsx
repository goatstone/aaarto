import React from "react";
import { mergeStyleSets, Modal } from "@fluentui/react";

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
      {children}
    </Modal>
  );
};

export default AaartoModal;
