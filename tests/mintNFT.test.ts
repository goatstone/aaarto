import { ethers } from "ethers";
import config from "../src/config";
import { getMintedTokenId } from "../src/mintNFT";

const iface = new ethers.Interface(config.contractArtifact.abi);
const contract = config.contractAddress;
const to = "0x36708B00D26Da1a6068577cD009732b79926AaCd";

const encode = (name: string, args: any[], address = contract) => {
  const { topics, data } = iface.encodeEventLog(name, args);
  return { address, topics, data };
};

describe("getMintedTokenId", () => {
  test("reads the token ID from the Mint log", () => {
    const logs = [
      encode("Mint", [to, 62n, "ipfs://bafkreiabc"]),
    ];
    expect(getMintedTokenId(logs, iface)).toBe("62");
  });

  test("reads it from the mint Transfer log when there is no Mint log", () => {
    const logs = [encode("Transfer", [ethers.ZeroAddress, to, 62n])];
    expect(getMintedTokenId(logs, iface)).toBe("62");
  });

  test("ignores logs from other contracts and non-mint transfers", () => {
    const other = "0xffffffffffffffffffffffffffffffffffffffff";
    const logs = [
      encode("Mint", [to, 7n, "ipfs://x"], other),
      encode("Transfer", [to, to, 9n]),
    ];
    expect(getMintedTokenId(logs, iface)).toBeNull();
  });

  test("returns null when there are no logs", () => {
    expect(getMintedTokenId([], iface)).toBeNull();
  });
});
