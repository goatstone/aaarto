import bodyParser from "body-parser";
import pinFileToIPFS from "#root/crypto/pinFileToIPFS.js";

/**
A server to support the upload of an SVG file
save the file to IPFS
record the file as an NFT on Hedera
*/
const aaartoServer = (app, port) => {
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
  app.post("/test", (req, res) => {
    console.log("test path", req.body.art);
  });
  app.post("/addfile", ({ body }, res) => {
    const { art } = body;
    console.log("Aaarto post", art);
  });
  app.listen(port, () => {
    console.log(`Aaarto application listening on port ${port}`);
  });
};

export default aaartoServer;
