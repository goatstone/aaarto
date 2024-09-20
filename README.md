# Aaarto

An online drawing program that can mint the art work as an NFT on the Hedera network. 

Aaarto enables the creation of art by the placing of circles and squares of various sizes and colors onto a canvas area. At any point in the creation of the art, the user can create an NFT of the art.

With the Aaarto program, the process of creating the art and the quality of the NFT are tightly connected. The characteristics of NFT are controlled by a single creation mechanism. Not just any digital asset is minted. The connection between the creation process and the NFT overcomes the generality of the uploading of digital data which may not have a specific connection to the NFT itself. The control of the creation process enables the creation of a more refined NFT and should be scalable to other art styles.  

Aaarto was designed and developed by Jose Collas. Jose has a long history of web development and has a deep interest in crypto.

### The project is not running online:


### These NFTs minted can be viewed here:

[https://hashscan.io/testnet/token/0.0.4690194](https://hashscan.io/testnet/token/0.0.4690194)

This project is done in the context of the Hello Future Hackathon [https://hedera.com/](https://hedera.com/)
 
## The crypto folder has code for creating and minting NFTs

### Create/Define a Token

Use runTokenCreate to create the definition of a Token that will enable minting of the the defined token.

```
node crypto/runTokenCreate.js TOKEN_NAME, TOKEN_SYMBOL
```

### Mint an Aaarto NFT
```
mintArt('The art to mint in SVG')
```
 	
## Stack
Hedera SDK, Pinata, Node, JavaScript, HTML, SVG, CSS

## Future Roadmap

The key concept of linking the creation program to the minting can be scaled to other styles of art. A system that is based on the styles of the painter Mondrian could be developed. The wallet needs to be linked to the application to enable real transactions. Aaarto coin to trade Aaarto art with.

## The Process

 ### Create the art, mint the art
<img src="art/aaarto_screen_4.png" width="500" />

### Find the art on Hashscan
<img src="art/aaarto_screen_2.png" width="500" />
<img src="art/aaarto_screen_1.png" width="500" />
<img src="art/aaarto_screen_3.png" width="500" />

## Aaarto in Action
<video controls width="500" >
    <source src="art/aaarto_demo.mp4" />
</video>
