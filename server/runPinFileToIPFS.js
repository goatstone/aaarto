import getFormData from "./getFormData.js";
import pinFileToIPFS from "./pinFileToIPFS.js";
import dotenv from "dotenv";

dotenv.config();

const JWT = process.env.PINATA_KEY;
const art = "ART";
const meta = {
  name: "ART",
  description: "art work",
  image: "ipfs://QmT9v4igGjUryGsTgGEzVYnxe7T5dkaDCpqSSFo7J8wydQ/LEAF1.jpg",
};

const formData = getFormData(art);

const json = { hello: "world" };
const blob = new Blob([JSON.stringify(json, null, 2)], {
  type: "application/json",
});
// const file = new File([blob], "hello.json", { type: "application/json" });
// const data = new FormData();
// data.append("file", file, "metadata.json");
// const file = new File(["Zzzzzz"], "Testing.txt", { type: "text/plain" });

// const upload = await pinata.upload.file(file);

// const upload = await pinata.upload.json({
//   name: "XXX",
//   description: "A Pinnie NFT from Pinata",
//   image: "ipfs://bafkreih5aznjvttude6c3wbvqeebb6rlx5wkbzyppv7garjiubll2ceym4"
// }).addMetadata({
//   name: "a.png",
//   keyValues: {
//     whimsey: 100
//   }
// })
//    const file = new File(["Zzzzzz"], "Testing.txt", { type: "text/plain" });
// const upload = await pinata.upload.file(file);
// const upload = await pinata.upload.json({
//   name: "XXX",
//   description: "A Pinnie NFT from Pinata",
//   image: "ipfs://bafkreih5aznjvttude6c3wbvqeebb6rlx5wkbzyppv7garjiubll2ceym4"
// }).addMetadata({
//   name: "a.png",
//   keyValues: {
//     whimsey: 100
//   }
// })
const j = {
  name: "AAA",
  description: "Art",
  image: "ipfs://QmT9v4igGjUryGsTgGEzVYnxe7T5dkaDCpqSSFo7J8wydQ",
};
const blob2 = new Blob([JSON.stringify(j, null, 2)], {
  type: "application/json",
});
const file1 = new File([blob2], "metadata.json", {
  type: "application/json",
});
// const file2 = new File(["hello world again!"], "hello2.txt", {
//   type: "text/plain",
// });
pinFileToIPFS(file1, JWT).then((response) => {
  console.log("Aaarto", response);
});

// {
//     "name": "LEAF1.jpg",
//     "creator": "Mother Nature",
//     "description": "Autumn",
//     "type": "image/jpg",
//     "format": "none",
//     "properties": {
//       "city": "Boston",
//       "season": "Fall",
//       "decade": "20's"
//     },
//     "image": "ipfs://bafybeig35bheyqpi4qlnuljpok54ud753bnp62fe6jit343hv3oxhgnbfm/LEAF1.jpg"
//   }
