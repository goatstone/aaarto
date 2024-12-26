import mintArt from "./mintArt.js";
import fs from "node:fs/promises";
import { resolve } from "path";

console.log("running mintArt");
const svgPath = resolve("art/art.svg"  );
try {
  const data = await fs.readFile(svgPath, "utf-8");
  const response = await mintArt(data);
  console.log("end running mintArt: ", response);
} catch (err) {
  throw `error: runMintArt ${err}`;
}

process.exit();
