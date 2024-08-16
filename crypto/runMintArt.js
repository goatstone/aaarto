import mintArt from "./mintArt.js";
import fs from "node:fs/promises";
import { resolve } from "path";

console.log("running mintArt");
const svgPath = resolve("art/art.svg");
try {
  const data = await fs.readFile(svgPath);
  console.log(1)
  const response = await mintArt(data);
} catch (err) {
  throw `error: runMintArt ${err}`;
}
console.log("end running mintArt: ", response);

process.exit();
