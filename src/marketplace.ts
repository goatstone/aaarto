type Marketplace = { name: string; itemUrlBase: string };

// Link to the minted token on the network's marketplace, or null when the
// network has none or the token ID is unknown.
export const getMarketplaceLink = (
  marketplace: Marketplace | undefined,
  contractAddress: string,
  tokenId?: string | null,
): { name: string; url: string } | null => {
  if (!marketplace || !tokenId) return null;
  return {
    name: marketplace.name,
    url: `${marketplace.itemUrlBase}${contractAddress.toLowerCase()}:${tokenId}`,
  };
};
