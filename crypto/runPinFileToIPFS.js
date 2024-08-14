import pinFileToIPFS from "./pinFileToIPFS.js";
import getPinataJWT from "./util/getPinataJWT.js";

// upload SVG art to IPFS
const art = `<svg version="1.1" width="300" height="300" xmlns="http://www.w3.org/2000/svg" id="art">
  <rect width="100%" height="100%" fill="gray" />
  <circle cx="150" cy="100" r="80" fill="green" />
  <text x="150" y="125" font-size="50" text-anchor="middle" fill="white">
    ART 11
  </text>
</svg>`;
pinFileToIPFS(art, getPinataJWT(), "aaarto.svg", "image/svg+xml").then((response) => {
  console.log("pinFileToIPFS: ", response);
});
// Upload a JSON metadata to Pinata IPFS
const metaData = {
  name: "Aaarto",
  description: "Art",
  image:
    "ipfs://bafybeidy4pe55a3umpaq3psw2stpuc7yni346kln7mhcpu3lwvlbdlwg6i/aaarto.svg",
};
// pinFileToIPFS(JSON.stringify(metaData, null, 2), JWT).then((response) => {
//   console.log("Aaarto", response);
// });
