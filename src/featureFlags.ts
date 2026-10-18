// Feature flags read from the URL query string, e.g. https://aaarto.art/?env=dev
// These only change what the UI does. They are not a security control: anyone
// can add a query string to the URL. See DEBUG.md.

export type FeatureFlags = {
  ipfsUploadEnabled: boolean;
};

// Query string values for the "env" parameter
export const ENV_PARAM = "env";
export const ENV_DEV = "dev"; // IPFS upload skipped
export const ENV_FULL = "full"; // IPFS upload enabled (the default)

// Token URI used when the IPFS upload is skipped: the well-known empty
// directory CID, so it resolves on gateways. Nothing about the art is stored.
export const DEBUG_IPFS_CID =
  "bafybeiczsscdsbs7ffqz55asqdf3smv6klcw3gofszvwlyarci47bgf354";

export const getFeatureFlags = (
  search: string = window.location.search,
): FeatureFlags => {
  const env = new URLSearchParams(search).get(ENV_PARAM);

  if (env === ENV_DEV) {
    return { ipfsUploadEnabled: false };
  }
  // No query string, ?env=full, or an unknown value: the full flow
  return { ipfsUploadEnabled: true };
};
