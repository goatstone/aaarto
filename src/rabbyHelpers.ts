// Connect to Rabby (#110). Discovery is EIP-6963 first, then the isRabby flag on
// window.ethereum. The wallet-agnostic version is #108.

interface RabbyProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  isRabby?: boolean;
}

// Where to send a user who has no Rabby. Kept here so there is one place to
// update; rabby.io/download does not exist, the extension page is the download.
export const RABBY_WEBSITE_URL = "https://rabby.io";
export const RABBY_DOWNLOAD_URL =
  "https://chromewebstore.google.com/detail/rabby-wallet/acmacodkjbdgmoleebolmdjonilkdbch";

// The error connectRabbyWallet throws when no Rabby provider is found.
export const RABBY_NOT_INSTALLED = "not_installed";

const RABBY_RDNS = "io.rabby";
const WAIT_MS = 500;

function findRabbyViaEip6963(): Promise<RabbyProvider | null> {
  return new Promise((resolve) => {
    let found: RabbyProvider | null = null;
    const onAnnounce = (event: any) => {
      const { info, provider } = event.detail || {};
      if (info?.rdns === RABBY_RDNS) found = provider as RabbyProvider;
    };
    window.addEventListener("eip6963:announceProvider", onAnnounce);
    window.dispatchEvent(new Event("eip6963:requestProvider"));
    setTimeout(() => {
      window.removeEventListener("eip6963:announceProvider", onAnnounce);
      resolve(found);
    }, WAIT_MS);
  });
}

async function getRabbyProvider(): Promise<RabbyProvider | null> {
  const announced = await findRabbyViaEip6963();
  if (announced) return announced;

  // Fallback: Rabby marks its provider with isRabby.
  const { ethereum } = window as any;
  if (Array.isArray(ethereum?.providers)) {
    const rabby = ethereum.providers.find((p: any) => p.isRabby);
    if (rabby) return rabby as RabbyProvider;
  }
  if (ethereum?.isRabby) return ethereum as RabbyProvider;
  return null;
}

export async function connectRabbyWallet() {
  const ethereum = await getRabbyProvider();
  // "not_installed" becomes a user-facing message in normalizeMintError.
  if (!ethereum) throw new Error(RABBY_NOT_INSTALLED);

  const accounts = (await ethereum.request({
    method: "eth_requestAccounts",
  })) as string[];
  if (!accounts || accounts.length === 0) throw new Error("no_accounts");

  return { ethereum, account: accounts[0] };
}
