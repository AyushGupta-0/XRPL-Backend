const router = require('express').Router()
const { getAllNFTs } = require('../controllers/nftController')

router.get('/all', getAllNFTs)


module.exports = router