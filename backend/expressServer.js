/*
expressServer.js
Upload a SVG file to Pinata, get a hash, 
Update metaData, upload metaData to Pinata
*/
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const FormData = require('form-data');
require('dotenv').config();

const PINATA_API_KEY = process.env.PINATA_API_KEY || '';
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY || '';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
const port = 5000;

const metadata = {
  name: "Aaarto",
  image: '',
  title: ''
};

app.get('/server_status', (req, res) => {
  const uptime = process.uptime(); // Server uptime in seconds
  const status = {
    message: 'Server is running',
    uptime: `${Math.floor(uptime / 60)} minutes ${Math.floor(uptime % 60)} seconds`
  };
  console.log('Server status check');
  res.json(status);
});
app.post('/server', async (req, res) => {
  try {
    const { title, svgString } = req.body;
    metadata.title = title;

    // SVG file, upload to Pinata, get a hash 
    const formDataSVG = new FormData();
    formDataSVG.append('file', Buffer.from(svgString), 'image.svg');
    formDataSVG.append('pinataMetadata', JSON.stringify({ name: `Aaarto: ${title}` }));
    formDataSVG.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));
    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formDataSVG, {
      headers: {
        ...formDataSVG.getHeaders(),
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });
    const ipfsHash = response.data.IpfsHash;

    // Update metadata image field with the retrieved IPFS hash
    metadata.image = `ipfs://${ipfsHash}`;

    // MetaData MD, upload to Pintata
    const formDataMD = new FormData();
    const jsonBuffer = Buffer.from(JSON.stringify(metadata));
    formDataMD.append("file", jsonBuffer, "data.json");
    formDataMD.append('pinataMetadata', JSON.stringify({ name: `Aaarto: ${title} metaData` }));
    formDataMD.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));
    const responseMD = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formDataMD, {
      headers: {
        ...formDataMD.getHeaders(),
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });
    const ipfsHashMD = responseMD.data.IpfsHash;

    return res.status(200).json({ ipfsHashMD })
  } catch (error) {

    return res.status(500).json({ error: 'Failed to upload to Pinata' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
