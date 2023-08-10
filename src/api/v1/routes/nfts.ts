import { Router } from 'express'
import { getAllNFTs, getAccountNFTs, getNFTDetails, mintNFT, transferNFT, receiveNFT, listNFT, cancelNFT, buyNFT } from '../controllers/nfts'
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

// @route     GET /api/nfts/nft/:nftid
// @desc      Get a specific NFT details and list of offers
// @access    Public
router.get('/nft/:nftId', getNFTDetails)

// @route     POST /api/nfts/transfer
// @desc      Create a transfer offer for an NFT (transfer)
// @access    Private
router.post('/transfer', verifyToken, transferNFT)

// @route     POST /api/nfts/receive
// @desc      Accept a transfer offer for an NFT (transfer)
// @access    Private
router.post('/receive', verifyToken, receiveNFT)

// @route     POST /api/nfts/sell
// @desc      List an NFT (directSale/auction)
// @access    Private
router.post('/list', verifyToken, listNFT)

// @route     POST /api/nfts/buy
// @desc      Make a buy offer to an NFT for sale (directSale)
// @access    Private
router.post('/buy', verifyToken, buyNFT)

// @route     POST /api/nfts/cancel
// @desc      Cancel a transfer/sell/buy offer for an NFT (transfer, list)
// @access    Private
router.post('/cancel', verifyToken, cancelNFT)


export default router