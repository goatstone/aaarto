const errorMessages = {
  notInstalled: "MetaMask is not installed. Please install it to use this app.",
};
const checkMetaMaskInstall = () => {
  // Check if MetaMask is available
  if (typeof window.ethereum === "undefined") {
    throw new Error(errorMessages.notInstalled);
  }
};

export default checkMetaMaskInstall;
