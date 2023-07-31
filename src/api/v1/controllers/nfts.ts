import { Response } from 'express'
import db from '../helpers/firebase'
import xumm from "../helpers/xumm"
import { fetchNFTs } from '../helpers/xrpl'
import uploadToIPFS from '../helpers/ipfs'
import ApiRequest from '../interfaces/ApiRequest'
import { PayloadAndSubscription, XummPostPayloadBodyJson } from 'xumm-sdk/dist/src/types'
import {convertStringToHex} from 'xrpl'


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
    const uri = await uploadToIPFS(req.file?.buffer)
    const transaction: XummPostPayloadBodyJson = {
        txjson: {
            TransactionType: "NFTokenMint",
            URI: convertStringToHex(`ipfs://${uri}`),
            Flags: 8,
            NFTokenTaxon: 0,
        },
        user_token: req.user.xummToken
    }
    const subscription: PayloadAndSubscription | undefined = await xumm.payload?.createAndSubscribe(transaction, async (event) => {
        if(event.data.signed){
            req.io?.emit('nftMinted', {status: 'success', message: 'NFT minted successfully'})
        }
    })
    res.json({uuid: subscription?.created.uuid, url: `https://xumm.app/sign/${subscription?.created.uuid}`, wss: `wss://xumm.app/sign/${subscription?.created.uuid}`})
}