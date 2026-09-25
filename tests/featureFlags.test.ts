import { getFeatureFlags } from "../src/featureFlags";

describe("getFeatureFlags", () => {
  test("no query string disables minting", () => {
    expect(getFeatureFlags("")).toEqual({
      mintEnabled: false,
      ipfsUploadEnabled: true,
    });
  });

  test("unknown env value disables minting", () => {
    expect(getFeatureFlags("?env=banana").mintEnabled).toBe(false);
    expect(getFeatureFlags("?foo=dev").mintEnabled).toBe(false);
  });

  test("env=dev enables minting and disables the IPFS upload", () => {
    expect(getFeatureFlags("?env=dev")).toEqual({
      mintEnabled: true,
      ipfsUploadEnabled: false,
    });
  });

  test("env=full enables minting and the IPFS upload", () => {
    expect(getFeatureFlags("?env=full")).toEqual({
      mintEnabled: true,
      ipfsUploadEnabled: true,
    });
  });
});
