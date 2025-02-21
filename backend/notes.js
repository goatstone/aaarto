/*
expressServer.js
Upload a SVG file to Pinata, get a hash, 
Update metaData, upload metaData to Pinata
*/
/*
{
  "name": "Unique Art Piece",
  "description": "This is a unique piece of digital art created by a renowned artist.",
  "image": "ipfs://QmW2WQi7j6c7Ug1MdQ9C2ja8WQh8A9P85yGAKzCQeihpr",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Blue"
    },
    {
      "trait_type": "Eyes",
      "value": "Green"
    }
  ]
}
*/

const metadata = {
    name: "",
    image: "",
    description: "",
    attributes: [
      {
        trait_type: "Aaarto Art",
        value: "NFT Art created at https://aaarto.art",
      },
      {
        trait_type: "Artist Name",
        value: "",
      },
    ],
  };

  const { name, svgString, description, artistName } = req.body;
  // metadata.name = name;
  // metadata.description = description;
  // metadata.attributes[1].value = artistName;