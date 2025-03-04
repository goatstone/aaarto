import React from "react";
import { FontWeights, getTheme, mergeStyleSets } from "@fluentui/react";

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

const AboutInfo:React.FC = () => {
  return (
    <>
      <div className={modalContentStyles.header}>
        <h2 className={modalContentStyles.heading}>Aaarto</h2>
      </div>
      <div className={modalContentStyles.body}>
        <p>
          Aaarto is an online drawing program that enables the minting of the
          artwork as a Non-fungible token, an NFT.
        </p>
        <p>
          The drawing application aspect of Aaarto enables the creation of art
          by the adding of circles and squares of various sizes and colors onto
          a canvas area. Tools to set the shapes' size and color are offered to
          the user. An erase tool enables the deletion of the shapes applied to
          the canvas. There is a text area in which the user can give the
          artwork a name.
        </p>
        <p>
          At any point in the creation of the art, the user can create an NFT of
          the art.
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
    </>
  );
};

export default AboutInfo;
