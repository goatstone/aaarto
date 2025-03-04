const requestAccounts = async () => {
  const userAccount = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  return userAccount;
};

export default requestAccounts;
