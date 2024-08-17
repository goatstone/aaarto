import mintArt from "./mintArt.js";
import fs from "node:fs/promises";
import { resolve } from "path";

console.log("running mintArt");
const svgPath = resolve("art/art.svg"  );
const svg = `<svg version="1.1" width="300" height="300" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="gray" />
    <circle cx="150" cy="100" r="80" fill="green" />
    <text x="150" y="125" font-size="50" text-anchor="middle" fill="white">
          Aaarto 8.15.2024
    </text>
</svg>`
try {
  const data = await fs.readFile(svgPath, "utf-8");
  console.log(1, data);
  const response = await mintArt(data);
  console.log("end running mintArt: ", response);
} catch (err) {
  throw `error: runMintArt ${err}`;
}

process.exit();
