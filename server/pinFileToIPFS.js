import axios from "axios";

const pinFileToIPFS = async (formData, JWT) => {
  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: `Bearer ${JWT}`,
        },
      }
    );
    console.info(res.data);
    return res.data;
} catch (error) {
    console.error(error);
  }
};

export default pinFileToIPFS;
