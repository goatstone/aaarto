// global.d.ts
import { WindowEnv } from "config";

declare global {
  interface Ethereum {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
  }
  interface Window {
    env: WindowEnv;
    ethereum: Ethereum;
  }
}

export {};
