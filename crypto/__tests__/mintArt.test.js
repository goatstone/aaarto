import mintArt from "#root/crypto/mintArt.js";

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
