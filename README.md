# Aaarto

An online drawing program that can mint the art work as an NFT on the Hedera network. 

### The project is currently running at:

[http://172.232.24.171/](http://172.232.24.171/)

### These NFTs minted can be viewed here:

[https://hashscan.io/testnet/token/0.0.4690194](https://hashscan.io/testnet/token/0.0.4690194)

This project is done in the context of the Hello Future Hackathon [https://hedera.com/](https://hedera.com/)


## The crypto folder has code for creating and minting NFTs

### Create/Define a Token

Use runTokenCreate to create the definition of a Token that will enable minting of the the defined token.

```
tokenCreate(TOKEN_NAME, TOKEN_SYMBOL, client, ID, supplyKey)
```

### Mint an Aaarto NFT
```
mintArt('The art to mint in SVG')
```