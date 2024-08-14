import dotenv from "dotenv";

const getPinataJWT = () => {
  dotenv.config();
  const JWT = process.env.PINATA_KEY;

  return JWT;
};

export default getPinataJWT;
