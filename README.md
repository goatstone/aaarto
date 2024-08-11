# Aaarto

An online drawing program that can mint the art work as an NFT on the Hedera network. This project is done in the context of the Hello Future Hackathon [https://hedera.com/](https://hedera.com/)


Start the server
navigate to the server folder and run

```bash
node express.js
```
This will run a server at port 8000

Run the development server
```bash
npm run dev
```
This will run Next.JS at port 3000

The front end should be able to make calls to the backend.

Build the site
```bash
npm run build
```


Test the files
```bash
npm run test
```

## Create an NFT Aaarto


### Step One: Create/Define a Token

Use runTokenCreate to create the definition of a Token that will enable minting of the the defined token.

```
tokenCreate(TOKEN_NAME, TOKEN_SYMBOL, client, ID, supplyKey)
```

## This site has been started with Next.js a starter
### Next.js + Jest

This example shows how to configure Jest to work with Next.js.

This includes Next.js' built-in support for Global CSS, CSS Modules and TypeScript. This example also shows how to use Jest with the App Router and React Server Components.

> **Note:** Since tests can be co-located alongside other files inside the App Router, we have placed those tests in `app/` to demonstrate this behavior (which is different than `pages/`). You can still place all tests in `__tests__` if you prefer.


