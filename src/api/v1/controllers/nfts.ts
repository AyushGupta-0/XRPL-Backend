import { Response } from 'express'
import db from '../helpers/firebase'
import xumm from "../helpers/xumm"
import { fetchNFTs, fetchTransaction, setMinter } from '../helpers/xrpl'
import uploadToIPFS from '../helpers/ipfs'
import ApiRequest from '../interfaces/ApiRequest'
import { PayloadAndSubscription, XummPostPayloadBodyJson } from 'xumm-sdk/dist/src/types'
import {convertStringToHex} from 'xrpl'
import NFT from '../interfaces/NFT'
import getTokenID from "../helpers/getTokenId"


// Get list of all Listed/Minted NFTs
// TODO: Add pagination, sorting, filtering
export const getAllNFTs = (req: ApiRequest, res: Response) => {
    db.collection('nfts').onSnapshot(snapshot => {
        let resData = snapshot.docs.map(doc => {
            return {id:doc.id, ...doc.data()}
        })
        res.json(resData)
    })
}


// Get list of NFTs of a particular account from XRPL
// TODO: Change to our platform username, and platform specific NFTs rather than XRPL NFTs
export const getAccountNFTs = async (req: ApiRequest, res: Response) => {
    if((await db.collection('users').doc(req.params.account).get()).exists){
        const nfts = await fetchNFTs(req.params.account)
        res.status(200).json({status: 'success', nfts})
    }else{
        res.status(404).json({status: 'failed', message: 'Account not found'})
    }
}


// TODO: Get details of a particular NFT
export const getNFTDetails = (req: ApiRequest, res: Response) => {

}


// Mint a new NFT
export const mintNFT = async (req: ApiRequest, res: Response) => {
    if(req.body.name && req.file){
        const uri = await uploadToIPFS(req.file?.buffer)
        setMinter(req.user.defaultWallet as string).then(async () => {
            const transaction: XummPostPayloadBodyJson = {
                txjson: {
                    TransactionType: "NFTokenMint",
                    URI: convertStringToHex(`ipfs://${uri}`),
                    Flags: 8,
                    NFTokenTaxon: 0,
                    Account: req.user.defaultWallet,
                    Issuer: process.env.PLATFORM_XRP_ACCOUNT as string,
                    TransferFee: 1500,
                    Fee: 15
                },
                user_token: req.user.xummToken
            }
            const subscription: PayloadAndSubscription | undefined = await xumm.payload?.createAndSubscribe(transaction, async (event) => {
                if(event.data.signed){
                    const tx = await fetchTransaction(event.data.txid as string)
                    const tokenId = getTokenID(tx.result)
                    const nft: NFT = {
                        name: req.body.name,
                        description: req.body.description || "",
                        tokenId,
                        tokenURI: `ipfs://${uri}`,
                        owner: req.user.defaultWallet,
                        mintedBy: req.user.defaultWallet,
                        mintedAt: Date.now(),
                    }
                    const nftRef = await db.collection('nfts').add(nft)
                    req.io?.emit('nftMinted', {status: 'success', message: 'NFT minted successfully', data: {id: nftRef.id, ...nft}})
                }
            })
            res.json({uuid: subscription?.created.uuid, url: `https://xumm.app/sign/${subscription?.created.uuid}`, wss: `wss://xumm.app/sign/${subscription?.created.uuid}`})
        }).catch(err => console.log(err))
    }else{
        res.status(400).json({status: 'failed', message: "A file and name for the NFT is required"})
    }
}


// Controller for listing NFTs for sale
export const listNFT = (req: ApiRequest, res: Response) => {
    const transaction: XummPostPayloadBodyJson = {
        txjson: {
            TransactionType: 'NFTokenCreateOffer',
        }
    }
}


// Controller for buying listed NFTs
export const buyNFT = (req: ApiRequest, res: Response) => {

}