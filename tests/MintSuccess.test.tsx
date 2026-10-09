import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MintSuccess from "@components/MintSuccess";

describe("MintSuccess", () => {
  test("links to the configured network's block explorer, not a hardcoded host", () => {
    // env.ts sets network=sepolia for tests (see jestGlobalSetup.js / jest.config.js)
    render(<MintSuccess transactionHash="0xabc123" />);
    const link = screen.getByRole("link", { name: /0xabc123/i });
    expect(link).toHaveAttribute(
      "href",
      "https://sepolia.etherscan.io/tx/0xabc123",
    );
  });

  test("shows the artwork, token ID and IPFS links when the upload ran", () => {
    render(
      <MintSuccess
        transactionHash="0xabc123"
        tokenId="62"
        ipfsHash="imageCid"
        ipfsHashMD="metaCid"
      />,
    );
    expect(screen.getByRole("img", { name: /minted aaarto/i })).toHaveAttribute(
      "src",
      "https://gateway.pinata.cloud/ipfs/imageCid",
    );
    expect(screen.getByText(/Token ID: 62/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /artwork/i })).toHaveAttribute(
      "href",
      "https://gateway.pinata.cloud/ipfs/imageCid",
    );
    expect(screen.getByRole("link", { name: /metadata/i })).toHaveAttribute(
      "href",
      "https://gateway.pinata.cloud/ipfs/metaCid",
    );
  });

  test("shows no artwork or IPFS links without CIDs (?env=dev)", () => {
    render(<MintSuccess transactionHash="0xabc123" tokenId="62" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /artwork|metadata/i })).toBeNull();
  });
});
