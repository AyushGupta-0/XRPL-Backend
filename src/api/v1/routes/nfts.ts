import { Router } from 'express'
import { getAllNFTs, getAccountNFTs, getNFTDetails, mintNFT } from '../controllers/nfts'
import multer, {Multer} from 'multer'
import checkAuthentication from '../middlewares/checkAuthentication'
const router: Router = Router()
const upload: Multer = multer()


// @route     POST /api/nfts
// @desc      Get List of All NFTs
// @access    Public
router.get('/', getAllNFTs)

// @route     POST /api/nfts/mint
// @desc      Mint a new NFT
// @access    Private
router.post('/mint', checkAuthentication, upload.single('nftFile'), mintNFT)

// @route     POST /api/nfts/:account
// @desc      Get NFTs of an Account (To be changed based on our platform username)
// @access    Public
router.get('/:account', getAccountNFTs)

// @route     POST /api/nfts/:nftid
// @desc      Get a specific NFT details
// @access    Public
router.get('/:nftid', getNFTDetails)


export default router