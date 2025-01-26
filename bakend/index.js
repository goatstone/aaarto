// backend/index.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Endpoint to upload files to IPFS via Pinata
app.post('/api/pinFile', async (req, res) => {
    const { svgContent } = req.body;

    try {
        const data = new FormData();
        data.append('file', Buffer.from(svgContent), {
            filename: 'nft.svg',
            contentType: 'image/svg+xml'
        });

        const pinataResponse = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: process.env.PINATA_API_KEY,
                pinata_secret_api_key: process.env.PINATA_API_SECRET,
            },
        });

        res.json({ IpfsHash: pinataResponse.data.IpfsHash });
    } catch (error) {
        console.error('Error uploading file to IPFS:', error);
        res.status(500).json({ error: 'Error uploading file to IPFS' });
    }
});

// Endpoint to upload metadata to IPFS via Pinata
app.post('/api/pinJSON', async (req, res) => {
    const { metadata } = req.body;

    try {
        const pinataResponse = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
            headers: {
                'Content-Type': 'application/json',
                pinata_api_key: process.env.PINATA_API_KEY,
                pinata_secret_api_key: process.env.PINATA_API_SECRET,
            },
        });

        res.json({ IpfsHash: pinataResponse.data.IpfsHash });
    } catch (error) {
        console.error('Error uploading metadata to IPFS:', error);
        res.status(500).json({ error: 'Error uploading metadata to IPFS' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
