import pinFileToIPFS from "./pinFileToIPFS.js";
import dotenv from "dotenv";

dotenv.config();

// mock the fetch function to prevent server calls
global.fetch = () => {
  console.log("mock fetch");
  return { ok: true, json: () => ({ a: 1 }) };
};

const JWT = process.env.PINATA_KEY;

const art = `<svg version="1.1" width="300" height="300" xmlns="http://www.w3.org/2000/svg" id="art">
  <rect width="100%" height="100%" fill="gray" />
  <circle cx="150" cy="100" r="80" fill="green" />
  <text x="150" y="125" font-size="50" text-anchor="middle" fill="white">
    ART 1
  </text>
</svg>`;
const artBlob = new Blob([art], {
  type: "image/svg+xml",
});
const artFile = new File([artBlob], "aaarto.svg", {
  type: "image/svg+xml",
});
const d = {
  IpfsHash: "xxx",
  PinSize: 349,
  Timestamp: "2024-08-14T14:58:11.387Z",
  isDuplicate: true,
};
pinFileToIPFS([artFile], JWT).then((response) => {
  console.log("Aaarto", response);
});

const metaData = {
  name: "AAA",
  description: "Art",
  image: "ipfs://QmT9v4igGjUryGsTgGEzVYnxe7T5dkaDCpqSSFo7J8wydQ",
};
const metaDataBlob = new Blob([JSON.stringify(metaData, null, 2)], {
  type: "application/json",
});
const metaDataFile = new File([metaDataBlob], "metadata.json", {
  type: "application/json",
});
// pinFileToIPFS([metaDataFile], JWT).then((response) => {
//   console.log("Aaarto", response);
// });
