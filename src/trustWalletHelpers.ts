interface TrustEthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  isTrust?: boolean;
  isTrustWallet?: boolean;
  on?: (event: string, handler: (...args: any[]) => void) => void;
  removeListener?: (event: string, handler: (...args: any[]) => void) => void;
}

// How long to wait for wallets to answer eip6963:requestProvider.
const EIP6963_WAIT_MS = 300;
// Trust Wallet's EIP-6963 id. Not verified against the extension.
const TRUST_RDNS = "com.trustwallet.app";

const isTrust = (p: any): boolean => Boolean(p?.isTrust || p?.isTrustWallet);

function discoverViaEip6963(): Promise<TrustEthereumProvider | null> {
  return new Promise((resolve) => {
    const onAnnounce = (event: any) => {
      if (event.detail?.info?.rdns === TRUST_RDNS) {
        window.removeEventListener("eip6963:announceProvider", onAnnounce);
        clearTimeout(timer);
        resolve(event.detail.provider as TrustEthereumProvider);
      }
    };
    const timer = setTimeout(() => {
      window.removeEventListener("eip6963:announceProvider", onAnnounce);
      resolve(null);
    }, EIP6963_WAIT_MS);
    window.addEventListener("eip6963:announceProvider", onAnnounce);
    window.dispatchEvent(new Event("eip6963:requestProvider"));
  });
}

async function getTrustProvider(): Promise<TrustEthereumProvider | null> {
  const announced = await discoverViaEip6963();
  if (announced) return announced;

  const { trustwallet, ethereum } = window as any;

  // The Trust Wallet extension injects its own object next to window.ethereum.
  if (trustwallet?.request) return trustwallet as TrustEthereumProvider;

  // The Trust Wallet mobile in-app browser sets window.ethereum.
  if (Array.isArray(ethereum?.providers)) {
    const trust = ethereum.providers.find(isTrust);
    if (trust) return trust as TrustEthereumProvider;
  }
  if (isTrust(ethereum)) return ethereum as TrustEthereumProvider;

  return null;
}

export async function connectTrustWallet() {
  const ethereum = await getTrustProvider();
  // "not_installed" is turned into a user-facing message by normalizeMintError.
  if (!ethereum) throw new Error("not_installed");

  const accounts = (await ethereum.request({
    method: "eth_requestAccounts",
  })) as string[];

  if (!accounts || accounts.length === 0) {
    throw new Error("no_accounts");
  }

  return { ethereum, account: accounts[0] };
}
