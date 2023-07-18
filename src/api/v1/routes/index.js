const router = require('express').Router()

router.use('/auth', require('./auth'))
router.use('/nfts', require('./nfts'))

module.exports = router