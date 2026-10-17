import { getMarketplaceLink } from "../src/marketplace";

const rarible = {
  name: "Rarible",
  itemUrlBase: "https://rarible.com/token/polygon/",
};
const contract = "0x03a9423E9Aac42E9F991D292F8e074808D9ABE7f";

describe("getMarketplaceLink", () => {
  test("builds the item URL with a lowercase contract address", () => {
    expect(getMarketplaceLink(rarible, contract, "26")).toEqual({
      name: "Rarible",
      url: "https://rarible.com/token/polygon/0x03a9423e9aac42e9f991d292f8e074808d9abe7f:26",
    });
  });

  test("returns null for a network without a marketplace", () => {
    expect(getMarketplaceLink(undefined, contract, "26")).toBeNull();
  });

  test("returns null when the token ID is unknown", () => {
    expect(getMarketplaceLink(rarible, contract, null)).toBeNull();
    expect(getMarketplaceLink(rarible, contract)).toBeNull();
  });
});
