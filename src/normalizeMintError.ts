// EIP-1193 provider error code for "user rejected the request"
const USER_REJECTED_REQUEST = 4001;

// Provider/ethers errors can nest the original error under info.error (or
// error), so check each level for a code.
const hasCode = (error: any, codes: Array<string | number>): boolean =>
  [error, error?.info?.error, error?.error].some((e) =>
    codes.includes(e?.code),
  );

export const normalizeMintError = (error: any, errorMessages: any): string => {
  if (hasCode(error, ["INSUFFICIENT_FUNDS"])) {
    return errorMessages.InsufficientFunds;
  }
  if (hasCode(error, ["ACTION_REJECTED", USER_REJECTED_REQUEST])) {
    return errorMessages.userCancel;
  }
  if ((error?.message || "").toLowerCase().includes("not_installed")) {
    return errorMessages.notInstalled;
  }

  // Don't append the raw error: it can include RPC payloads. The caller logs it.
  return errorMessages.general;
};
