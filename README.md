# backend

## Description

This is the backend repository for the NFT Marketplace.

## API Documentation

### Authentication

- Get Account Data: `GET /api/auth/getUserData` [Set 'authorization' header as 'Bearer <token>']

- Create Account With Xumm (Anonymous User): `GET /api/auth/createAccountWithXumm` [Socket IO Channel `accountCreated`]
- Login Account With Xumm (Anonymous User): `GET /api/auth/loginAccountWithXumm` [Socket IO Channel `accountLoggedIn`]

<!-- - Create Account With OAuth (Authenticated User): `GET /api/auth/createAccountWithOAuth` -->
<!-- - Login Account With OAuth (Authenticated User): `GET /api/auth/loginAccountWithOAuth` -->

### NFTs

- List All NFTs: `GET /api/nfts/all`

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