import mintArt from "./mintArt.js";
import fs from "node:fs";
import { resolve } from "path";

const svgPath = resolve("art/art.svg");
const a= `<svg version="1.1" width="300" height="300"
    xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="gray" />
    <circle cx="150" cy="100" r="80" fill="green" />
    <text x="150" y="125" font-size="50" text-anchor="middle" fill="white">
          Aaarto 8.15.2024
    </text>
</svg>`
mintArt(a).then((response) => {
  console.log("mintArt: ", response);
});

fs.readFile(svgPath, "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  // mintArt(data).then((response) => {
  //   console.log("mintArt: ", response);
  // });
});
