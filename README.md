# backend

## Description

This is the backend repository for the NFT Marketplace.

## API Documentation

### Authentication

- Get Account Data: `GET /api/auth/profile` [Set 'authorization' header as 'Bearer <token>']

- Create Account With Xumm (Anonymous User): `GET /api/auth/createAccountWithXumm` [Socket IO Channel `accountCreated`]
- Login Account With Xumm (Anonymous User): `GET /api/auth/loginAccountWithXumm` [Socket IO Channel `accountLoggedIn`]

- Create Account With OAuth (Authenticated User): `POST /api/auth/createAccountWithOAuth`
- Login Account With OAuth (Authenticated User): `POST /api/auth/loginAccountWithOAuth`

- Create Account With Passkey (Authenticated User): `POST /api/auth/createAccountWithPasskey`
- Login Account With Passkey (Authenticated User): `POST /api/auth/loginAccountWithPasskey`

### NFTs/Collections

- Get All NFTs: `GET /api/nfts`
- Mint an NFT: `POST /api/nfts/mint` [Socket IO Channel `nftMint`]
- Buy an NFT: `POST /api/nfts/:nftid/buy` [Socket IO Channel `nftBuy`]
- Sell an NFT: `POST /api/nfts/:nftid/sell` [Socket IO Channel `nftSell`]
- Transfer an NFT: `POST /api/nfts/:nftid/transfer` [Socket IO Channel `nftTransfer`]

### User

- Get Account: `GET /api/:username` [Returns public data of the user]


## Installation

### Project setup
```
npm install
```

### Setup .env file
```
# Copy .env.example to .env and edit the values
cp .env.example .env
```

### Get Firebase Service Account Key
```
# Place this in the project root directory
touch serviceAccountKey.json
```

### Run in dev mode
```
npm run dev
```