import express from "express";
import bodyParser from "body-parser";
import pinFileToIPFS from "./pinFileToIPFS.js";
import getFormData from "./getFormData.js";
import dotenv from "dotenv";

dotenv.config();
const JWT = process.env.PINATA_KEY;
/**
A server to support the upload of an SVG file
save the file to IPFS
record the file as an NFT on Hedera
*/
((app, port) => {
  app.set("view engine", "ejs");
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  app.get("/", (req, res) => {
    res.render("index", { hello: "Aaarto" });
  });
  app.post("/addfile", ({ body }, res) => {
    const { art } = body;
    const formData = getFormData(art);
    pinFileToIPFS(formData, JWT).then((r) => {
      res.send(r);
    });
    console.log("Aaarto post");
  });
  app.listen(port, () => {
    console.log(`Aaarto application listening on port ${port}`);
  });
})(express(), 8000);
