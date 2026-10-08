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
});
