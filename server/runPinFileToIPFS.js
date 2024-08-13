import getFormData from "./getFormData.js";
import pinFileToIPFS from "./pinFileToIPFS.js";
import dotenv from "dotenv";

dotenv.config();

const JWT = process.env.PINATA_KEY;
const art = "ART";
const formData = getFormData(art);

pinFileToIPFS(formData, JWT).then((response) => {
  console.log("Aaarto", response);
});
