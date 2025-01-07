import { useEffect, useState } from 'react';
import { MetaMaskSDK } from "@metamask/sdk";

const useMetaMask = () => {
    const [account, setAccount] = useState<string | null>(null);

    // Initialize MetaMask SDK with dapp metadata and Infura API key
    const MMSDK = new MetaMaskSDK({
        dappMetadata: {
            name: "Example JavaScript Dapp",
            url: window.location.href,
        },
        infuraAPIKey: 'INFURA_API_KEY',
    });

    // Function to connect the user's MetaMask wallet
    const connectWallet = async () => {
        try {
            const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (accounts.length > 0) {
                // Set the first account as the connected account
                setAccount(accounts[0]);
            }
        } catch (error) {
            console.error('User denied account access or error occurred', error);
        }
    };

    // Function to open MetaMask and initiate a dummy transaction
    const openMetaMask = async () => {
        try {
            const accounts: string[] = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                const transactionParameters = {
                    to: accounts[0], // Dummy recipient address (sending to self)
                    from: accounts[0], // Must match user's active address
                    value: '0x0', // Transaction value in wei (0 in this case)
                };
                await window.ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [transactionParameters],
                });
            } else {
                alert('Please connect to MetaMask first.');
            }
        } catch (error) {
            console.error('Error opening MetaMask', error);
        }
    };

    // Consolidated useEffect to check MetaMask installation and connected account
    useEffect(() => {
        (async () => {
            if (!window.ethereum) {
                alert('MetaMask is not installed. Please install MetaMask to use this app.');
                console.error('MetaMask is not installed.');
                return;
            }

            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                }
            } catch (error) {
                if (error instanceof Error) {
                    console.error('Initialization error:', error.message);
                } else {
                    console.error('Unexpected error:', error);
                }
            }
        })();
    }, []);

    return { account, connectWallet, openMetaMask };
};

export default useMetaMask;
