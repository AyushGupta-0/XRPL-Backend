import {Router} from 'express'
import {getAllNFTs} from '../controllers/nfts'
const router: Router = Router()

router.get('/profile', getAllNFTs)


export default router