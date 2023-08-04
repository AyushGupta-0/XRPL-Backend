import { Router } from 'express'
import { getAllNFTs, getAccountNFTs, getNFTDetails, mintNFT, listNFT, buyNFT } from '../controllers/nfts'
import multer, {Multer} from 'multer'
import verifyToken from '../middlewares/verifyJWT'
const router: Router = Router()
const upload: Multer = multer()


// @route     GET /api/nfts
// @desc      Get List of All NFTs
// @access    Public
router.get('/', getAllNFTs)

// @route     POST /api/nfts/mint
// @desc      Mint a new NFT
// @access    Private
router.post('/mint', verifyToken, upload.single('nftFile'), mintNFT)

// @route     GET /api/nfts/:account
// @desc      Get NFTs of an Account (To be changed based on our platform username)
// @access    Public
router.get('/:account', getAccountNFTs)

// @route     GET /api/nfts/:nftid
// @desc      Get a specific NFT details
// @access    Public
router.get('/:nftid', getNFTDetails)

// @route     POST /api/nfts/list
// @desc      Create a sell offer for an NFT
// @access    Public
router.post('/list', verifyToken, listNFT)

// @route     POST /api/nfts/buy
// @desc      Accept a sell offer for an NFT
// @access    Public
router.post('/buy', verifyToken, buyNFT)


export default router