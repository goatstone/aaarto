const express = require('express');
const axios = require('axios');
const cors = require('cors');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
const port = 5000;
const PINATA_API_KEY = process.env.PINATA_API_KEY || '';
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY || '';

app.get('/debug', (req, res) => {
  res.send("xxx")
})
app.post('/upload', async (req, res) => {
  try {
    const { title, svgString } = req.body;
    const metadata = {
      name: "Aaarto",
      image: 'ipfs://new_hash',
      title
    };
    const form = new FormData();
    form.append('file', Buffer.from(svgString), 'image.svg');
    form.append('pinataMetadata', JSON.stringify({ name: `Aaarto: ${title}` }));
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
    // Upload metadata to Pintata

    return res.status(200).json({ ipfsHash, metadata })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to upload to Pinata' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
