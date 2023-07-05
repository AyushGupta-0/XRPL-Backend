# backend

## Description

This is the backend repository for the NFT Marketplace.

## API Documentation

### Authentication

- Create Account With Xumm (Anonymous User): `GET /api/auth/createAccountWithXumm`
<!-- - Create Account With OAuth (Authenticated User): `GET /api/auth/createAccountWithOAuth` -->

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