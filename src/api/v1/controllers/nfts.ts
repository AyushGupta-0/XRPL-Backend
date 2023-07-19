import { Request, Response } from 'express'
import db from '../helpers/firebase'
import uploadToIPFS from '../helpers/ipfs'

export const getAllNFTs = (req: Request, res: Response) => {
    db.collection('nfts').onSnapshot(snapshot => {
        let resData = snapshot.docs.map(doc => {
            return {id:doc.id, ...doc.data()}
        })
        res.json(resData)
    })
}