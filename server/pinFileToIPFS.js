// import axios from "axios";
import { PinataSDK } from "pinata";

async function pinFileToIPFS(file, JWT) {
  const pinata = new PinataSDK({
    pinataJwt: JWT,
  });
  try {
 
    const upload = await pinata.upload.fileArray([file]);

    console.log(upload);
  } catch (error) {
    console.log(error);
  }
}

// await main();

// const pinFileToIPFS = async (formData, JWT) => {
// };

export default pinFileToIPFS;

// try {
//   const res = await axios.post(
//     "https://api.pinata.cloud/pinning/pinFileToIPFS",
//     formData,
//     {
//       maxBodyLength: "Infinity",
//       headers: {
//         "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
//         Authorization: `Bearer ${JWT}`,
//       },
//     }
//   );
//   console.info(res.data);
//   return res.data;
// } catch (error) {
//   console.error(error);
// }
