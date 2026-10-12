/*
expressServer.js
Upload a SVG file to Pinata, get a hash, 
Update metaData, upload metaData to Pinata
*/
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const FormData = require("form-data");
const { validateUpload } = require("./validateUpload");
require("dotenv").config();

const PINATA_API_KEY = process.env.PINATA_API_KEY || "";
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY || "";

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
const port = 5000;

// A new object per request: a shared one would be overwritten by a request
// that starts while an earlier one is still waiting on Pinata.
const buildMetadata = ({ name, description, artistName, image }) => ({
  name,
  image,
  description,
  attributes: [
    {
      trait_type: "Aaarto Art",
      value: "NFT Art created at https://aaarto.art",
    },
    {
      trait_type: "Artist Name",
      value: artistName,
    },
  ],
});
app.get("/server_status", (req, res) => {
  const uptime = process.uptime(); // Server uptime in seconds
  const status = {
    message: "Server is running",
    uptime: `${Math.floor(uptime / 60)} minutes ${Math.floor(
      uptime % 60
    )} seconds`,
  };
  res.json(status);
});
app.post("/server", async (req, res) => {
  const validation = validateUpload(req.body);
  if (!validation.ok) {
    console.error("Upload rejected:", validation.reason);
    return res.status(400).json({ error: "Invalid upload." });
  }
  try {
    const { name, svgString, description, artistName } = req.body;

    // SVG file, upload to Pinata, get a hash
    const formDataSVG = new FormData();
    formDataSVG.append("file", Buffer.from(svgString), "image.svg");
    formDataSVG.append(
      "pinataMetadata",
      JSON.stringify({ name: `Aaarto: ${name}` })
    );
    formDataSVG.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formDataSVG,
      {
        headers: {
          ...formDataSVG.getHeaders(),
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
        },
      }
    );
    const ipfsHash = response.data.IpfsHash;

    // Build the metadata with the image hash that was just retrieved
    const metadata = buildMetadata({
      name,
      description,
      artistName,
      image: `ipfs://${ipfsHash}`,
    });

    // MetaData MD, upload to Pintata
    const formDataMD = new FormData();
    const jsonBuffer = Buffer.from(JSON.stringify(metadata));
    formDataMD.append("file", jsonBuffer, "data.json");
    formDataMD.append(
      "pinataMetadata",
      JSON.stringify({ name: `Aaarto: ${name} metaData` })
    );
    formDataMD.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));
    const responseMD = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formDataMD,
      {
        headers: {
          ...formDataMD.getHeaders(),
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
        },
      }
    );
    const ipfsHashMD = responseMD.data.IpfsHash;

    return res.status(200).json({ ipfsHashMD, ipfsHash });
  } catch (error) {
    // Log details server-side only. Avoid logging the whole axios error: its
    // request config includes the Pinata auth headers.
    console.error(
      "Pinata upload failed:",
      error.message,
      error.response?.status,
      error.response?.data
    );
    return res.status(500).json({ error: "Failed to upload to Pinata." });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
