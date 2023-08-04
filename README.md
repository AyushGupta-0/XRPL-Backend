# backend

## Description

This is the backend repository for the NFT Marketplace.

## API Documentation

### Authentication

- Get Current User Data: `GET /api/auth/profile` [Session cookie need to be present on the client set by OAuth]

- Create or Log into Account With Xumm (Anonymous User): `GET /api/auth/xumm` [Socket IO Channel `accountCreated`]
<!-- - Login Account With Xumm (Anonymous User): `GET /api/auth/loginAccountWithXumm` [Socket IO Channel `accountLoggedIn`] -->

- Google OAuth Screen: `GET /api/auth/google`
- Google OAuth Callback: `GET /api/auth/google/callback`
- Twitter OAuth Screen: `GET /api/auth/twitter`
- Twitter OAuth Callback: `GET /api/auth/twitter/callback`
- Discord OAuth Screen: `GET /api/auth/discord`
- Discord OAuth Callback: `GET /api/auth/discord/callback`

- Account Completion After OAuth (Authenticated User): `POST /api/auth/createAccountAfterOAuth` [Socket IO Channel `accountCreated`] (TODO)

- Create Account With Passkey (Authenticated User): `POST /api/auth/createAccountWithPasskey`
- Login Account With Passkey (Authenticated User): `POST /api/auth/loginAccountWithPasskey`

### NFTs/Collections

- Get List of All NFTs: `GET /api/nfts`
- Mint an NFT: `POST /api/nfts/mint` [Socket IO Channel `nftMint`]
- Get NFTs of a User: `GET /api/nfts/:username` [Returns NFTs of the user based on account address, to be changed to username]

### User

- Get Account: `GET /api/:username` [Returns public data of the user] (TODO)


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
# Place this in the config directory
touch ./src/config/serviceAccountKey.json
```

### Run in dev mode
```
npm run dev

# If there is an error, create build and run again
npm run build
npm run dev
```