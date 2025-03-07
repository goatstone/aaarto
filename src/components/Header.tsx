import React from "react";
import { getTheme, mergeStyleSets, FontWeights } from "@fluentui/react";

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

const Header: React.FC<{ children: React.JSX.Element[] }> = ({ children }) => {
  const [aboutControl, mintControl] = children;

  return (
    <>
      <header className={headerStyles.container}>
        <h1>Aaarto</h1>
        {mintControl}
        {aboutControl}
      </header>
    </>
  );
};

export default Header;
