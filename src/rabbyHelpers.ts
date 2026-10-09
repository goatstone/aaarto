// Connect to Rabby (#110). Discovery is EIP-6963 first, then the isRabby flag on
// window.ethereum. The wallet-agnostic version is #108.

interface RabbyProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  isRabby?: boolean;
}

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
  if (!ethereum) throw new Error("not_installed");

  const accounts = (await ethereum.request({
    method: "eth_requestAccounts",
  })) as string[];
  if (!accounts || accounts.length === 0) throw new Error("no_accounts");

  return { ethereum, account: accounts[0] };
}
