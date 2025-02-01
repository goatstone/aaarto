// hooks/useMintNFT.js
import { useState } from 'react';
import { ethers } from 'ethers';
import contractArtifact from '../../artifacts/contracts/AaartoNFT.sol/AaartoNFT.json';

const errorMessages = {
    notInstalled: 'MetaMask is not installed. Please install it to use this app.',
    accountAccess: 'Connect MetaMask account with this site.',
    networkSwitch: 'Please switch to the Sepolia network.',
    general: 'An error occured during minting.'
};
// Aaarto contract address
const contractAddress = '0x3ee122AEB70e725b7eb99a863d46A9D839B0fdA3';

const useMintNFT = () => {
    const [account, setAccount] = useState<string | null>(null);
    const [transactionHash, setTransactionHash] = useState(null);
    const [transactionReceipt, setTransactionReceipt] = <any>useState(null);
    const [errorMessage, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const mintNFT = async (ipfsTokenURI: any) => {
        try {
            setLoading(true);
            console.log('a', window.ethereum);
            // Check if MetaMask is available
            if (typeof window.ethereum === 'undefined') {
                throw new Error(errorMessages.notInstalled);
            }
            console.log('a', window.ethereum);
            // Request account access if needed
            // TODO check if account access exists before requesting, set error
            // window.ethereum._state.accounts;
            setError(errorMessages.accountAccess);
            const userAccount = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('x', userAccount);
            setAccount(userAccount);
            setError('');
            // Create a provider and signer from MetaMask
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            // Get the network the user is connected to
            const { chainId } = await provider.getNetwork();
            // Ensure the user is connected to Sepolia testnet (chainId 11155111)
            if (chainId !== 11155111n) {
                try {
                    setError(errorMessages.networkSwitch);
                    // Prompt the user to switch to Sepolia
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0xaa36a7' }], // Hexadecimal chain ID of Sepolia
                    });
                    setError('');
                } catch (switchError: any) {
                    // This error code indicates that the chain has not been added to MetaMask
                    if (switchError.code === 4902) {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: '0xaa36a7',
                                    chainName: 'Sepolia Testnet',
                                    rpcUrls: ['https://rpc.sepolia.org'],
                                    nativeCurrency: {
                                        name: 'Sepolia Ether',
                                        symbol: 'SEP',
                                        decimals: 18,
                                    },
                                    blockExplorerUrls: ['https://sepolia.etherscan.io'],
                                },
                            ],
                        });
                    } else {
                        throw switchError;
                    }
                }
            }
            const AaartoNFTContract = new ethers.Contract(contractAddress, contractArtifact.abi, signer);
            const userAddress = await signer.getAddress();
            // Call the contracts' preSafeMint function
            const txResponse = await AaartoNFTContract.preSafeMint(userAddress, ipfsTokenURI);
            setTransactionHash(txResponse.hash);
            // Wait for the transaction to be mined
            const receipt = await txResponse.wait();
            setTransactionReceipt(receipt);
            console.log('Transaction confirmed in block:', receipt.blockNumber);
        } catch (error) {
            setError(`${errorMessages.general} ${error}`);
        } finally {
            setLoading(false);
        }
    };

    return {
        mintNFT,
        transactionHash,
        transactionReceipt,
        errorMessage,
        loading,
        account
    };
};

export default useMintNFT;
