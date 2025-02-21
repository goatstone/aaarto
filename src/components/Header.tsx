import React, { useState } from "react";
import { getTheme, mergeStyleSets, FontWeights } from "@fluentui/react";
import MintControl, { MintControlProps } from "./MintControl";
import AaartoModal from "@components/AaartoModal";

const theme = getTheme();
const headerStyles = mergeStyleSets({
  container: {
    display: "flex",
    flexFlow: "row nowrap",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#ccc",
    selectors: {
      h1: {
        color: "#111",
        margin: "0.25em",
      },
    },
  },
  button: {
    backgroundColor: "darkgreen",
    color: "#eee",
    borderRadius: "10%",
    fontSize: "1.25em",
    cursor: "pointer",
  },
});
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
const Header: React.FC<MintControlProps> = ({
  handleUpload,
  uploading,
  loading,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <header className={headerStyles.container}>
        <h1>Aaarto</h1>
        <MintControl
          handleUpload={handleUpload}
          loading={loading}
          uploading={uploading}
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className={headerStyles.button}
        >
          About
        </button>
      </header>
      <AaartoModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <div className={modalContentStyles.header}>
          <h2 className={modalContentStyles.heading}>Aaarto</h2>
          <button onClick={() => setIsModalOpen(false)}>X</button>
        </div>
        <div className={modalContentStyles.body}>
          <p>
            Aaarto is an online drawing program that enables the minting of
            the artwork as a Non-fungible token, an NFT.
          </p>
          <p>
            The drawing application aspect of Aaarto enables the creation of art
            by the adding of circles and squares of various sizes and colors
            onto a canvas area. Tools to set the shapes' size and color are
            offered to the user. An erase tool enables the deletion of the
            shapes applied to the canvas. There is a text area in which the user
            can give the artwork a name.
          </p>
          <p>
            At any point in the creation of the art, the user can create an NFT
            of the art.
          </p>
          <p>
            Aaarto is designed, developed and hosted by:
            <a href="https://goatstone.com" target="_blank">
              goatstone.com
            </a>
          </p>
          <a href="about.html" target="_blank" rel="noopener noreferrer">
            Click Here To Find Out More About Aaarto...
          </a>
        </div>
      </AaartoModal>
    </>
  );
};

export default Header;
