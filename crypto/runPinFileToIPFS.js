import pinFileToIPFS from "./pinFileToIPFS.js";
import dotenv from "dotenv";

dotenv.config();

const JWT = process.env.PINATA_KEY;
// upload SVG art to IPFS
const art = `<svg version="1.1" width="300" height="300" xmlns="http://www.w3.org/2000/svg" id="art">
  <rect width="100%" height="100%" fill="gray" />
  <circle cx="150" cy="100" r="80" fill="green" />
  <text x="150" y="125" font-size="50" text-anchor="middle" fill="white">
    ART 9
  </text>
</svg>`;
const artBlob = new Blob([art], {
  type: "image/svg+xml",
});
const artFile = new File([artBlob], "aaarto.svg", {
  type: "image/svg+xml",
});
// pinFileToIPFS([artFile], JWT).then((response) => {
//   console.log("pinFileToIPFS: ", response);
// });
// Upload a JSON metadata to Pinata IPFS
const metaData = {
  name: "Aaarto",
  description: "Art",
  image: "ipfs://bafybeidy4pe55a3umpaq3psw2stpuc7yni346kln7mhcpu3lwvlbdlwg6i/aaarto.svg",
};
const metaDataBlob = new Blob([JSON.stringify(metaData, null, 2)], {
  type: "application/json",
});
const metaDataFile = new File([metaDataBlob], "metadata.json", {
  type: "application/json",
});
pinFileToIPFS([metaDataFile], JWT).then((response) => {
  console.log("Aaarto", response);
});
