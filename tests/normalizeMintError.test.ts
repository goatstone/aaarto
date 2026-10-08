import { normalizeMintError } from "../src/normalizeMintError";
import { UploadError } from "../src/uploadData";

const messages = {
  general: "general",
  userCancel: "cancelled",
  InsufficientFunds: "funds",
  notInstalled: "not installed",
};

describe("normalizeMintError", () => {
  test.each([
    ["ethers ACTION_REJECTED", { code: "ACTION_REJECTED" }],
    ["EIP-1193 4001", { code: 4001 }],
    [
      "nested info.error 4001",
      { code: "UNKNOWN_ERROR", info: { error: { code: 4001 } } },
    ],
  ])("maps %s to userCancel", (_n, error) => {
    expect(normalizeMintError(error, messages)).toBe("cancelled");
  });

  test("maps INSUFFICIENT_FUNDS to InsufficientFunds", () => {
    expect(normalizeMintError({ code: "INSUFFICIENT_FUNDS" }, messages)).toBe(
      "funds",
    );
  });

  test("does not rely on message text for rejection or funds", () => {
    expect(
      normalizeMintError({ message: "user rejected the request" }, messages),
    ).toBe("general");
    expect(
      normalizeMintError({ message: "insufficient funds" }, messages),
    ).toBe("general");
  });

  test("shows the message of an UploadError", () => {
    expect(
      normalizeMintError(
        new UploadError("There was an error uploading data."),
        messages,
      ),
    ).toBe("There was an error uploading data.");
  });

  test("falls back to the general message without the raw error text", () => {
    expect(normalizeMintError(new Error("rpc payload boom"), messages)).toBe(
      "general",
    );
  });
});
