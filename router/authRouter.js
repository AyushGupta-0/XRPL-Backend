const router = require('express').Router()
const {createAccountWithXumm, createAccountWithOAuth} = require('../controllers/authController')

router.get('/createAccountWithXumm', createAccountWithXumm)
router.get('/createAccountWithOAuth', createAccountWithOAuth)

module.exports = router;