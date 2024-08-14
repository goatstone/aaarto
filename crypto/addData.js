import pinFileToIPFS from "./pinFileToIPFS.js";
import getPinataJWT from "./util/getPinataJWT.js";

// Upload a JSON metadata file to Pinata IPFS
const metaData = {
  name: "Aaarto",
  description: "Art",
  image:
    "ipfs://bafybeia6eatgollp3gpqofy4atz3s47nhswvzwzsx57cwy2yg3ltsviubq/aaarto.svg",
};
pinFileToIPFS(JSON.stringify(metaData, null, 2), getPinataJWT(), 'metadata.json', 'applicaton/json').then((response) => {
  console.log("Aaarto", response);
});
