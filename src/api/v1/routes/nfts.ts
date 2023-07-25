import { Router } from 'express'
import { getAllNFTs, getAccountNFTs, getNFTDetails, mintNFT } from '../controllers/nfts'
import verifyToken from '../middlewares/verifyJWT'
import multer, {Multer} from 'multer'
const router: Router = Router()
const upload: Multer = multer()

router.get('/', getAllNFTs)
router.post('/mint', upload.single('nftFile'), verifyToken, mintNFT)
router.get('/:account', getAccountNFTs)

router.get('/:nftid', getNFTDetails)


export default router