const router = require('express').Router()
const { getAllNFTs } = require('../controllers/nfts')

router.get('/all', getAllNFTs)


module.exports = router