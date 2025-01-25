const express = require('express');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const port = 5000;

const PINATA_API_KEY = 'your_pinata_api_key';
const PINATA_SECRET_API_KEY = 'your_pinata_secret_api_key';

app.use(express.json({ limit: '50mb' }));

app.post('/upload', async (req, res) => {
  try {
    const { name, svgString } = req.body;
    
    const metadata = {
      name,
      description: 'Custom SVG NFT',
      image: 'ipfs://new_hash', 
      // Add your required metadata fields accordingly
    };

    const form = new FormData();
    form.append('file', Buffer.from(svgString), 'image.svg');
    form.append('pinataMetadata', JSON.stringify({ name }));
    form.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));

    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', form, {
      headers: {
        ...form.getHeaders(),
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });

    const ipfsHash = response.data.IpfsHash;

    // Update metadata image field with the retrieved IPFS hash
    metadata.image = `ipfs://${ipfsHash}`;

    return res.status(200).json({ ipfsHash, metadata });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to upload to Pinata' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
