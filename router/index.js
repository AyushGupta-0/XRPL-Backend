const router = require('express').Router()

router.use('/auth', require('./authRouter'))
router.use('/nfts', require('./nftRouter'))

module.exports = router