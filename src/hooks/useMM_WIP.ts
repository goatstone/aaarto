import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { MetaMaskSDK } from "@metamask/sdk";
import contractArtifact from '../artifacts/contracts/AaartoNFT.sol/AaartoNFT.json';

// ABI and contract address
const AaartoNFTAbi = contractArtifact.abi;
const contractAddress = "0x85DC05D8fCd6602d7e410A5687ff634D38726215";

// Fetch the API keys from a secret manager or process.env. Never expose them directly in the frontend code!
// const PINATA_API_KEY = process.env.PINATA_API_KEY;
// const PINATA_API_SECRET = process.env.PINATA_API_SECRET;

// MetaMask SDK
const MMSDK = new MetaMaskSDK({
    dappMetadata: {
        name: "Example JavaScript Dapp",
        url: window.location.href,
    },
    infuraAPIKey: 'INFURA_API_KEY', 
});

const getSvgContent = () => {
    const svgElement = document.getElementById('nft-svg');
    if (svgElement) {
        return new XMLSerializer().serializeToString(svgElement);
    } else {
        throw new Error('SVG element not found');
    }
};

const useMetaMask = () => {
    const [account, setAccount] = useState<string | null>(null);

    useEffect(() => {
        const checkMetaMask = async () => {
            if (!window.ethereum) {
                alert('MetaMask is not installed. Please install MetaMask to use this app.');
                return;
            }

            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                }
            } catch (error) {
                console.error('Initialization error:', error);
            }
        };
        checkMetaMask();
    }, []);

    const connectWallet = async () => {
        try {
            const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);
        } catch (error) {
            console.error('User denied account access:', error);
        }
    };

    const uploadSvgToIPFS = async (svgContent) => {
        try {
            const response = await axios.post('/api/pinFile', { svgContent });
            return response.data.IpfsHash;
        } catch (error) {
            console.error('Error uploading SVG to IPFS:', error);
            throw error;
        }
    };

    const uploadMetadataToIPFS = async (imageHash) => {
        const metadata = {
            name: 'My NFT',
            description: 'An awesome NFT',
        }
    }
}