// global.d.ts
interface Ethereum {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
}

interface Window {
    ethereum: Ethereum;
}