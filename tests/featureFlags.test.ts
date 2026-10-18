import { getFeatureFlags } from "../src/featureFlags";

describe("getFeatureFlags", () => {
  test("no query string runs the full flow, with the IPFS upload", () => {
    expect(getFeatureFlags("")).toEqual({ ipfsUploadEnabled: true });
  });

  test("unknown env value runs the full flow", () => {
    expect(getFeatureFlags("?env=banana")).toEqual({ ipfsUploadEnabled: true });
    expect(getFeatureFlags("?foo=dev")).toEqual({ ipfsUploadEnabled: true });
  });

  test("env=dev disables the IPFS upload", () => {
    expect(getFeatureFlags("?env=dev")).toEqual({ ipfsUploadEnabled: false });
  });

  test("env=full enables the IPFS upload", () => {
    expect(getFeatureFlags("?env=full")).toEqual({ ipfsUploadEnabled: true });
  });
});
