const errorMessages = {
  alreadyProcessing:
    "MetaMask is already processing a request, try opening opening the MetaMask application.",
};

const requestAccounts = async () => {
  let userAccount;
  try {
    userAccount = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
  } catch (error: any) {
    if (error.message?.includes("Already processing eth_requestAccounts")) {
      throw new Error(errorMessages.alreadyProcessing);
    }
    throw error;
  }

  return userAccount.join(' | ');
};

export default requestAccounts;
