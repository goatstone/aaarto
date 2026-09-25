// global.d.ts

declare global {
  interface Ethereum {
    [x: string]: any;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
  }
  interface Window {
    ethereum: Ethereum;
  }
}

export {};
