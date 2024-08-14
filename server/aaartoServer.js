import bodyParser from "body-parser";
import mintArt from "#root/crypto/mintArt.js";

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
    res.send("hello");
  });
  app.post("/test", (req, res) => {
    console.log("test path", req.body.art);
  });
  app.post("/mintart", ({ body }, res) => {
    const { art } = body;
    mintArt(art).then((response) => {
      console.log("Aaarto post", art, response);
      res.send({ ok: true });
    });
  });
  app.listen(port, () => {
    console.log(`Aaarto server listening on port ${port}`);
  });
};

export default aaartoServer;
