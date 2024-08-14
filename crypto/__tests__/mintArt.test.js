import mintArt from "#root/crypto/mintArt.js";

jest.mock("../pinFileToIPFS.js" );

describe("mintArt", () => {
  it("should return expected response", async() => {
    const response = await mintArt('xx')
    expect(response.cid).toBe('abc');
  });
});
