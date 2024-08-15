import mintArt from "#root/crypto/mintArt.js";
// mock the props so they do not throw errors, errors that show up only in tests
jest.mock("@hashgraph/sdk", () => {
  const o = jest.requireActual("@hashgraph/sdk");
  const uint8 = new Uint8Array(2);
  uint8[0] = '42';
    return {
    ...o,
    PrivateKey: {
      ...o.PrivateKey,
      fromStringDer: () => uint8,
       fromStringED25519: () => uint8,
    },
  };
});
jest.mock("../util/getClient.js");
jest.mock("../pinFileToIPFS.js");
jest.mock("../tokenMint");

describe("mintArt", () => {
  it("should return expected image pin response", async () => {
    const response = await mintArt("xx");
    expect(response.pinImageResponse.IpfsHash).toBe("xxx");
  });
  it("should return expected data pin response", async () => {
    const response = await mintArt("xx");
    expect(response.pinDataResponse.IpfsHash).toBe("xxx");
  });
  it("should return expected mint response", async () => {
    const response = await mintArt("xx");
    expect(response.mintResponse.tokenId).toBeTruthy;
  });
});
