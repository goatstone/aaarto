/*
expressServer.js
Upload a SVG file to Pinata, get a hash, 
Update metaData, upload metaData to Pinata
*/
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const FormData = require("form-data");
const { validateUpload } = require("./validateUpload");
require("dotenv").config();

const PINATA_API_KEY = process.env.PINATA_API_KEY || "";
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY || "";

// Origins allowed to call the API from a browser. Not authentication: a script
// that sends no Origin header is not affected by CORS.
const DEFAULT_ORIGINS = "https://aaarto.art,http://localhost:9000";
const allowedOrigins = (process.env.CORS_ORIGINS || DEFAULT_ORIGINS)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const PINATA_TIMEOUT_MS = 30000;
const UPLOAD_RATE_WINDOW_MS = 15 * 60 * 1000;
const UPLOAD_RATE_MAX = Number(process.env.UPLOAD_RATE_MAX) || 10;

const app = express();
// nginx is the one proxy in front: take the client IP from X-Forwarded-For
// so the rate limit counts visitors, not 127.0.0.1
app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) =>
      callback(null, !origin || allowedOrigins.includes(origin)),
  })
);
// A 400x400 SVG of shapes is a few KB; validateUpload caps it at 150000
app.use(express.json({ limit: "200kb" }));
const uploadLimiter = rateLimit({
  windowMs: UPLOAD_RATE_WINDOW_MS,
  limit: UPLOAD_RATE_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many uploads, please try again later." },
});
const port = Number(process.env.PORT) || 5000;

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
app.post("/server", uploadLimiter, async (req, res) => {
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
        timeout: PINATA_TIMEOUT_MS,
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
        timeout: PINATA_TIMEOUT_MS,
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

// Oversized or malformed bodies: a generic answer, never a stack trace
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  console.error("Request rejected:", error.type || error.message);
  return res
    .status(error.status || 500)
    .json({ error: error.status === 413 ? "Upload too large." : "Invalid request." });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
